#!/usr/bin/env node
/* test_app.mjs: the five app pages, in Chromium, end to end.
 *
 * Serves www/ on a local port; starts the SG/Send API in memory from the API repository's pinned release
 * (SEND_API=<checkout>, or ../SGit-AI__Website__Send__API); routes every request for https://api.send.sgit.ai/<release>/
 * to that release directory with the CORS header GitHub Pages sends. So the pages are the real pages, the code is the
 * pinned release, and nothing is mocked but the host name. Then: save settings, send a file, open the link and compare
 * the bytes, create a vault, add a file, open its read key. Skips with a message, never silently, when Playwright or
 * Chromium is missing; CI treats a skip as a failure.
 */
import fs from 'fs'
import http from 'http'
import path from 'path'
import { execSync } from 'child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const WWW = path.join(ROOT, 'www')
const pin = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/api.json'), 'utf8'))
const API_ROOT = process.env.SEND_API ? path.resolve(process.env.SEND_API) : path.join(ROOT, '..', 'SGit-AI__Website__Send__API')
const RELEASE = path.join(API_ROOT, 'releases', pin.release)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.md': 'text/markdown', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.xml': 'application/xml' }
const CORS = { 'access-control-allow-origin': '*' }
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }

if (!fs.existsSync(path.join(RELEASE, 'send/send-api.js'))) { console.log(`SKIP: the pinned release ${pin.release} is not at ${RELEASE}; set SEND_API=<a checkout of ${pin.host}>`); process.exit(0) }
if (!fs.existsSync(path.join(WWW, 'index.html'))) { console.log('SKIP: www/ is not built; run python3 tools/build.py'); process.exit(0) }

async function playwright() {
    try { return await import('playwright') } catch (e) {
        try { const g = execSync('npm root -g').toString().trim(); return await import(path.join(g, 'playwright', 'index.mjs')) }
        catch (e2) { console.log('SKIP: playwright is not installed'); process.exit(0) }
    }
}
const serve = (root) => new Promise(resolve => {
    const s = http.createServer((req, res) => {
        let p = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))
        if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html')
        if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); res.end('not found'); return }
        res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(fs.readFileSync(p))
    })
    s.listen(0, '127.0.0.1', () => resolve(s))
})

const { startServer } = await import(path.join(RELEASE, 'tests/server.mjs'))
const api = await startServer()
const site = await serve(WWW)
const origin = `http://127.0.0.1:${site.address().port}`
const pw = await playwright()
let browser
try { browser = await pw.chromium.launch() } catch (e) {
    try { browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' }) } catch (e2) { console.log('SKIP: chromium is not available'); process.exit(0) }
}
const ctx = await browser.newContext({ acceptDownloads: true })
const apiHits = []
await ctx.route(`${pin.host}/**`, route => {
    const u = new URL(route.request().url())
    const m = new RegExp(`^/${pin.release.replace(/\./g, '\\.')}/(.+)$`).exec(u.pathname)
    const f = m ? path.join(RELEASE, decodeURIComponent(m[1])) : ''
    if (!m || !f.startsWith(RELEASE) || !fs.existsSync(f)) return route.fulfill({ status: 404, headers: CORS, body: '' })
    apiHits.push(m[1])
    return route.fulfill({ status: 200, headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', ...CORS }, body: fs.readFileSync(f) })
})
const errors = []
const page = await ctx.newPage()
page.on('pageerror', e => errors.push(String(e)))
page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()) })   // resource failures are judged by the response handler below
page.on('response', r => { if (r.status() >= 400 && !(r.status() === 404 && /\/api\/vault\/read\//.test(r.url()))) errors.push(`${r.status()} ${r.url()}`) })   // a missing clone ref on first open is a 404 the library expects
page.on('dialog', d => d.accept())

try {
    // settings: the local server and its token
    await page.goto(`${origin}/settings/`)
    await page.waitForSelector('#endpoint option', { state: 'attached' })
    await page.selectOption('#endpoint', 'custom')
    await page.fill('#custom', api.base)
    await page.fill('#token', api.token)
    await page.click('#settings-form button[type=submit]')
    await page.waitForFunction(() => /answers/.test(document.querySelector('#progress').textContent), null, { timeout: 20000 })
    check(apiHits.some(h => h === 'send/send-api.js'), 'the page loaded the pinned release from the API host')

    // send a file
    const original = Buffer.alloc(3000); for (let i = 0; i < original.length; i++) original[i] = (i * 7) % 251
    await page.goto(`${origin}/`)
    await page.waitForSelector('#drop')
    await page.setInputFiles('#file', { name: 'report.bin', mimeType: 'application/octet-stream', buffer: original })
    await page.click('#go')
    await page.waitForSelector('#result:not(.hidden) .link a', { timeout: 60000 })
    const link = await page.$eval('#result .link a', a => a.href)
    check(/\/open\/#[a-z0-9]{8,32}\/[A-Za-z0-9_-]{43}$/.test(link), `a link with the key was built: ${link.replace(/#.*/, '#…')}`)
    check(await page.$('#result .qr svg path') !== null, 'the QR code is drawn')
    check(api.transfers.size === 1 && ![...api.log].some(l => l.includes('report.bin')), 'one transfer on the server, and the name in no request')
    check(!api.log.some(l => l.includes(api.token)), 'the access token appears in no request path')

    // open it and compare the bytes
    await page.goto(link.replace(/^https?:\/\/[^/]+/, origin))
    await page.waitForSelector('#get', { timeout: 20000 })
    const [download] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), page.click('#get')])
    check(download.suggestedFilename() === 'report.bin', `saved as ${download.suggestedFilename()} (the name came from the envelope)`)
    const got = fs.readFileSync(await download.path())
    check(got.equals(original), 'the bytes are the original, byte for byte')

    // keys: the transfer is there with its delete secret
    await page.goto(`${origin}/keys/`)
    await page.waitForSelector('#keys h2')
    check(await page.$('[data-revoke]') !== null, 'the transfer is in the keyring with a revoke button')

    // a vault: create, add a file, publish, open the read key
    await page.goto(`${origin}/vaults/`)
    await page.waitForSelector('#create')
    await page.fill('#new-name', 'Test vault')
    await page.click('#create')
    await page.waitForSelector('#vault-box .link a', { timeout: 60000 })
    const readLink = await page.$eval('#vault-box .link a', a => a.href)
    check(/\/open\/#sgit_public_read_[0-9a-f]{64}:[a-z0-9]{4,24}$/.test(readLink), 'the share link carries a public read key')
    check(!(await page.content()).includes('sgit_private_vault_'), 'the vault key is on no part of the vaults page')
    await page.setInputFiles('#add-files', { name: 'notes.md', mimeType: 'text/markdown', buffer: Buffer.from('# from the test') })
    await page.click('#add')
    await page.waitForFunction(() => [...document.querySelectorAll('#files li .mono')].some(e => e.textContent === '/notes.md') && /Committed 1 new/.test(document.querySelector('#progress').textContent), null, { timeout: 60000 })
    await page.goto(readLink.replace(/^https?:\/\/[^/]+/, origin))
    await page.waitForSelector('#files li', { timeout: 60000 })
    const listed = await page.$$eval('#files li .mono', els => els.map(e => e.textContent))
    check(listed.includes('/notes.md'), `the read key lists the file: ${listed.join(', ')}`)
    check((await page.textContent('#open-box')).includes('Already in your keys'), 'the read key is recognised as already kept on this device')
    check(api.vaults().length === 1, 'one vault on the server')
    check(errors.length === 0, errors.length ? `page errors: ${errors.join(' | ')}` : 'no page errors')
} catch (e) {
    check(false, `error: ${e.message}`)
} finally {
    await browser.close(); site.close(); await api.close()
}
console.log(failed ? `${failed} failure(s)` : 'app: PASSED')
process.exit(failed ? 1 : 0)
