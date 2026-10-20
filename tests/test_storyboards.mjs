#!/usr/bin/env node
/* test_storyboards.mjs: the storyboards, validated by the kit's own formats.js in Node, then drawn in Chromium.
 *
 * Node: every storyboard and the cast pass StoryboardFormats.validate from the pinned release of the kit (the vocabulary
 * the renderer knows), loaded from a checkout of the kit's repository (STORYBOARDS_API=<path>, or
 * ../SGit-AI__Website__Storyboards__API) at the pinned path. Chromium: www/ served locally with the kit host routed to
 * that checkout; the shelf, every storyboard page, every-panel and the model sheet open with no page errors and the deck
 * draws as many panels as the storyboard has scenes. Skips with a message, never silently, when the checkout, Playwright
 * or Chromium is missing; CI treats a skip as a failure.
 */
import fs from 'fs'
import http from 'http'
import path from 'path'
import { createRequire } from 'module'
import { execSync } from 'child_process'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const WWW = path.join(ROOT, 'www')
const pin = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/storyboards-api.json'), 'utf8'))
const relPath = new URL(pin.base).pathname.replace(/^\/|\/$/g, '')                      // v0/v0.1/v0.1.0
const API_ROOT = process.env.STORYBOARDS_API ? path.resolve(process.env.STORYBOARDS_API) : path.join(ROOT, '..', 'SGit-AI__Website__Storyboards__API')
const KIT = path.join(API_ROOT, relPath)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.md': 'text/markdown', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain' }
let failed = 0
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }

if (!fs.existsSync(path.join(KIT, 'storyboard.js'))) { console.log(`SKIP: the pinned kit ${pin.release} is not at ${KIT}; set STORYBOARDS_API=<a checkout of ${pin.host}>`); process.exit(0) }
if (!fs.existsSync(path.join(WWW, 'storyboards/index.html'))) { console.log('SKIP: www/ is not built; run python3 tools/build.py'); process.exit(0) }

// --- Node: the kit's own validator over every storyboard ----------------------------------------------------------
const require = createRequire(import.meta.url)
const formats = require(path.join(KIT, 'formats.js'))
const F = formats.StoryboardFormats || formats
const cast = JSON.parse(fs.readFileSync(path.join(ROOT, 'website/storyboards/cast.json'), 'utf8'))
const boards = fs.readdirSync(path.join(ROOT, 'website/storyboards')).filter(f => /^\d\d__.*\.json$/.test(f)).sort()
const PROPS = [...new Set([...(F.VOCAB && F.VOCAB.props ? (typeof F.VOCAB.props === 'function' ? F.VOCAB.props() : F.VOCAB.props) : []), ...((F.PACKS && F.PACKS.security) || [])])]
for (const f of boards) {
    const sb = JSON.parse(fs.readFileSync(path.join(ROOT, 'website/storyboards', f), 'utf8'))
    const problems = F.validate(sb, cast, { props: PROPS.length ? PROPS : undefined })
    check(problems.length === 0, `${f}: validate() by the kit ${pin.release}${problems.length ? ': ' + problems.slice(0, 3).join('; ') : ''}`)
}
const pinManifest = JSON.parse(fs.readFileSync(path.join(KIT, 'manifest.json'), 'utf8'))
check(pinManifest.release === pin.release && (pinManifest.files || []).every(f => pin.files[f.path] && pin.files[f.path].integrity === f.integrity), 'tools/storyboards-api.json matches the release manifest file for file')

// --- Chromium: the pages, with the kit host routed to the checkout ---------------------------------------------------
async function playwright() {
    try { return await import('playwright') } catch (e) {
        try { const g = execSync('npm root -g').toString().trim(); return await import(path.join(g, 'playwright', 'index.mjs')) }
        catch (e2) { console.log('SKIP: playwright is not installed'); process.exit(0) }
    }
}
const site = http.createServer((req, res) => {
    let p = path.join(WWW, decodeURIComponent(new URL(req.url, 'http://x').pathname))
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html')
    if (!p.startsWith(WWW) || !fs.existsSync(p)) { res.writeHead(404); res.end('not found'); return }
    res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' }); res.end(fs.readFileSync(p))
})
await new Promise(r => site.listen(0, '127.0.0.1', r))
const origin = `http://127.0.0.1:${site.address().port}`
const pw = await playwright()
let browser
try { browser = await pw.chromium.launch() } catch (e) {
    try { browser = await pw.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' }) } catch (e2) { console.log('SKIP: chromium is not available'); process.exit(0) }
}
const ctx = await browser.newContext()
await ctx.route(`${pin.host}/**`, route => {
    const u = new URL(route.request().url())
    const f = path.join(API_ROOT, decodeURIComponent(u.pathname))
    if (!f.startsWith(API_ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return route.fulfill({ status: 404, headers: { 'access-control-allow-origin': '*' }, body: '' })
    return route.fulfill({ status: 200, headers: { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'access-control-allow-origin': '*' }, body: fs.readFileSync(f) })
})
const errors = []
const page = await ctx.newPage()
page.on('pageerror', e => errors.push(String(e)))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
try {
    await page.goto(`${origin}/storyboards/`)
    await page.waitForFunction(() => document.querySelectorAll('.sbx-cover svg path, .sbx-cover svg g *').length > 20, null, { timeout: 30000 })
    check(await page.$$eval('.sbx-card', els => els.length) === boards.length, `the shelf shows ${boards.length} cards, drawn live`)
    check(await page.$$eval('.sbx-person', els => els.length) === cast.characters.length, `the cast section shows ${cast.characters.length} people`)
    for (const f of boards) {
        const sb = JSON.parse(fs.readFileSync(path.join(ROOT, 'website/storyboards', f), 'utf8'))
        await page.goto(`${origin}/storyboards/${sb.slug}/?view=grid`)
        await page.waitForFunction(n => document.querySelectorAll('.sb-grid svg').length >= n, sb.scenes.length, { timeout: 30000 })
        const drawn = await page.$$eval('.sb-grid svg', els => els.filter(s => s.querySelector('path, text')).length)
        check(drawn === sb.scenes.length, `${sb.slug}: ${drawn} of ${sb.scenes.length} panels drawn`)
        const bundle = JSON.parse(fs.readFileSync(path.join(WWW, 'storyboards', sb.slug, 'bundle.json'), 'utf8'))
        check(bundle.storyboard.slug === sb.slug && bundle.cast.characters.length === cast.characters.length, `${sb.slug}: bundle.json carries the storyboard and the cast`)
    }
    await page.goto(`${origin}/storyboards/all/`)
    await page.waitForFunction(() => document.querySelectorAll('.sb-contact svg').length > 50, null, { timeout: 60000 })
    check(true, 'every panel on one page draws')
    await page.goto(`${origin}/storyboards/model-sheet/`)
    await page.waitForFunction(() => document.querySelectorAll('.sb-sheet svg').length > 20, null, { timeout: 60000 })
    check(true, 'the model sheet draws')
    check(errors.length === 0, errors.length ? `page errors: ${errors.slice(0, 5).join(' | ')}` : 'no page errors')
} catch (e) { check(false, `error: ${e.message}`) }
finally { await browser.close(); site.close() }
console.log(failed ? `${failed} failure(s)` : 'storyboards: PASSED')
process.exit(failed ? 1 : 0)
