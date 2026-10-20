/* keys.js: the keyring on this device. Every key this site made or was given, with a kind on each so a vault key is
 * never mistaken for a read key. Export moves it to a password manager; nothing here is uploaded anywhere. */
import { loadApi } from './api.js'
import { $, $$, esc, saveAs, copy, status } from './ui.js'

const send = await loadApi()
const ring = new send.Keyring()
const K = send.KEYRING_KINDS
const KIND = { [K.VAULT_KEY]: ['Vault keys', 'read and write; never share, never put in a page'], [K.READ_KEY]: ['Read keys', 'read only; these may be shared'], [K.TRANSFER]: ['Transfers sent', 'the link, and the secret that can delete it'], [K.ACCESS_TOKEN]: ['Access tokens', 'who may upload, per server'] }
const el = { box: $('#keys'), prog: $('#progress') }
render()

function render() {
    const all = ring.list()
    el.box.innerHTML = Object.entries(KIND).map(([kind, [title, note]]) => {
        const es = all.filter(e => e.kind === kind)
        return `<h2>${title} <span class="muted">(${es.length})</span></h2><p class="muted">${note}</p><ul class="list">${es.map(e => `
          <li><strong>${esc(e.label)}</strong> <span class="muted">${esc((e.created || '').slice(0, 16).replace('T', ' '))}${e.endpoint ? ' · ' + esc(new URL(e.endpoint).host) : ''}</span><br>
            <span class="mono secret" data-v>${esc(e.value)}</span>
            <span class="row-actions"><button class="btn secondary" data-reveal>Reveal</button> <button class="btn secondary" data-copy="${esc(e.value)}">Copy</button>${e.link ? ` <a class="btn secondary" href="${esc(e.link)}" target="_blank" rel="noopener">Open</a>` : ''}${e.deleteSecret ? ` <button class="btn danger" data-revoke="${esc(e.id)}">Revoke transfer</button>` : ''} <button class="btn danger" data-remove="${esc(e.id)}">Forget</button></span></li>`).join('') || '<li class="muted">none</li>'}</ul>`
    }).join('')
    $$('[data-reveal]', el.box).forEach(b => b.addEventListener('click', () => { const s = b.closest('li').querySelector('[data-v]'); s.classList.toggle('secret'); b.textContent = s.classList.contains('secret') ? 'Reveal' : 'Hide' }))
    $$('[data-copy]', el.box).forEach(b => b.addEventListener('click', () => copy(b.getAttribute('data-copy'), b)))
    $$('[data-remove]', el.box).forEach(b => b.addEventListener('click', () => { if (confirm('Forget this entry on this device? There is no other copy unless you exported one.')) { ring.remove(b.getAttribute('data-remove')); render() } }))
    $$('[data-revoke]', el.box).forEach(b => b.addEventListener('click', async () => {
        const e = ring.get(b.getAttribute('data-revoke'))
        const tokens = ring.list({ kind: K.ACCESS_TOKEN }).filter(t => t.endpoint === e.endpoint)
        if (!tokens.length) { status(el.prog, 'Revoking needs the access token for ' + e.endpoint + '; set it in Settings.', 'error'); return }
        try {
            b.disabled = true
            await new send.SendTransfers({ endpoint: e.endpoint, accessToken: tokens[0].value }).remove(e.transferId, e.deleteSecret)
            ring.update(e.id, { revoked: new Date().toISOString(), deleteSecret: null })
            status(el.prog, `Revoked ${e.label}: the server deleted it; anyone opening the link now gets "not found".`, 'ok'); render()
        } catch (err) { status(el.prog, (err.code ? err.code + ': ' : '') + err.message, 'error'); b.disabled = false }
    }))
}

$('#export').addEventListener('click', () => saveAs(new TextEncoder().encode(ring.exportJson()), `send.sgit.ai-keys-${new Date().toISOString().slice(0, 10)}.json`, 'application/json'))
$('#import').addEventListener('change', async () => {
    const f = $('#import').files[0]; if (!f) return
    try { const n = ring.importJson(await f.text()); status(el.prog, `Imported ${n} entr${n === 1 ? 'y' : 'ies'}.`, 'ok'); render() } catch (err) { status(el.prog, err.message, 'error') }
})
$('#clear').addEventListener('click', () => { if (confirm('Forget every key on this device? Export first if any of them matters.')) { ring.clear(); render() } })
