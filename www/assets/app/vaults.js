/* vaults.js: the vaults this browser holds the keys for. Create one, open one, add files, see the history, and
 * share it with its read key as a link and a QR code. The vault key never leaves the keyring; the read key is the
 * one that may be shared. Publishing uses compare-and-swap, so two devices never overwrite each other. */
import { loadApi, settings, openUrl } from './api.js'
import { $, $$, esc, bytesLabel, saveAs, copy, status, errorText, qrBox } from './ui.js'

const send = await loadApi()
const cfg = settings(send)
const el = { list: $('#vault-list'), prog: $('#progress'), box: $('#vault-box'), create: $('#create-form'), token: $('#token-notice') }
if (!cfg.token) el.token.classList.remove('hidden')

render()

function entries() { return cfg.ring.list().filter(e => e.kind === send.KEYRING_KINDS.VAULT_KEY || e.kind === send.KEYRING_KINDS.READ_KEY) }

function render() {
    const es = entries()
    el.list.innerHTML = es.length ? es.map(e => `<li><strong>${esc(e.label)}</strong> <span class="muted">${e.kind === send.KEYRING_KINDS.VAULT_KEY ? 'vault key' : 'read key'} · ${esc(e.vaultId || '')}</span> <button class="btn secondary" data-open="${esc(e.id)}">Open</button></li>`).join('')
                                 : '<li class="muted">No vaults on this device yet. Create one below, or <a href="/open/">open a read key</a> and keep it.</li>'
    $$('[data-open]', el.list).forEach(b => b.addEventListener('click', () => open(cfg.ring.get(b.getAttribute('data-open')))))
}

el.create.addEventListener('submit', async e => {
    e.preventDefault()
    const name = $('#new-name').value.trim() || `Vault ${new Date().toISOString().slice(0, 10)}`
    try {
        $('#create').disabled = true
        status(el.prog, 'Loading the library, deriving keys, writing the first commit…')
        await send.vault.ready()
        const sg = send.vault.client({ endpoint: cfg.endpoint, accessToken: cfg.token })
        const { vault, vaultKey, readKey } = await send.vault.createVault(sg, { name })
        const entry = cfg.ring.add({ kind: send.KEYRING_KINDS.VAULT_KEY, label: name, value: vaultKey, vaultId: vault.vaultId, endpoint: cfg.endpoint })
        cfg.ring.add({ kind: send.KEYRING_KINDS.READ_KEY, label: `${name} (read)`, value: readKey, vaultId: vault.vaultId, endpoint: cfg.endpoint })
        status(el.prog, `Created "${name}". Its vault key is in your keys; keep a copy somewhere safe, there is no reset.`, 'ok')
        render(); open(entry)
    } catch (err) { status(el.prog, errorText(err), 'error') }
    $('#create').disabled = false
})

async function open(entry, keep = '') {
    try {
        status(el.prog, 'Opening…')
        await send.vault.ready()
        const sg = send.vault.client({ endpoint: cfg.endpoint, accessToken: cfg.token })
        const v = entry.kind === send.KEYRING_KINDS.READ_KEY ? await send.vault.openReadOnly(sg, entry.value) : await send.vault.openVault(sg, entry.value)
        const readKey = v.writable ? await send.vault.readKeyOf(v) : entry.value
        const files = await send.vault.listAll(v)
        const log = v.writable ? await send.vault.history(v, { limit: 20 }) : []
        status(el.prog, keep, keep ? 'ok' : '')
        const link = send.link.vaultLink({ openUrl: openUrl(), credential: readKey })
        el.box.innerHTML = `
          <h2>${esc(v.name || entry.label)} <span class="sg-status ${v.writable ? 'sg-status-proposed' : 'sg-status-shipped'}">${v.writable ? 'read and write' : 'read only'}</span></h2>
          <div class="two">
            <div>
              <h3>Files</h3>
              <ul class="list" id="files">${files.map((f, i) => `<li><span class="mono">${esc(f.path)}</span> <span class="muted">${bytesLabel(f.size || 0)}</span> <button class="btn secondary" data-i="${i}">Save</button></li>`).join('') || '<li class="muted">No files yet.</li>'}</ul>
              ${v.writable ? `<p class="row-actions"><input id="add-files" type="file" multiple> <button id="add" class="btn">Encrypt, commit and publish</button></p>` : ''}
              ${log.length ? `<h3>History</h3><ul class="list">${log.map(c => `<li><span class="mono">${esc(String(c.id).slice(0, 24))}</span> <span class="muted">${new Date(c.timestamp_ms).toISOString().slice(0, 16).replace('T', ' ')}</span> ${esc(c.message || '')}</li>`).join('')}</ul>` : ''}
            </div>
            <div>
              <h3>Share, read only</h3>
              <p class="link"><a href="${esc(link)}" target="_blank" rel="noopener">${esc(link)}</a></p>
              <p class="row-actions"><button class="btn" data-copy="${esc(link)}">Copy link</button> <button class="btn secondary" data-copy="${esc(readKey)}">Copy read key</button></p>
              ${qrBox(send, link, link)}
              <p class="muted">The read key opens every file and every version, and can change nothing. <code class="mono">sgit clone ${esc(readKey)}</code> on a laptop gets the same.</p>
              ${v.writable ? `<p class="muted">The vault key is in <a href="/keys/">your keys</a> and in no link on this page.</p>` : ''}
            </div>
          </div>`
        $$('[data-copy]', el.box).forEach(b => b.addEventListener('click', () => copy(b.getAttribute('data-copy'), b)))
        $$('[data-i]', el.box).forEach(b => b.addEventListener('click', async () => { const f = files[Number(b.getAttribute('data-i'))]; saveAs(new Uint8Array(await send.vault.readFile(v, f.folder, f.name)), f.name) }))
        const add = $('#add')
        if (add) add.addEventListener('click', async () => {
            const picked = [...$('#add-files').files]
            if (!picked.length) return
            try {
                add.disabled = true
                status(el.prog, `Encrypting ${picked.length} file(s) and committing…`)
                const list = []
                for (const f of picked) list.push({ folder: '/', name: f.name, data: new Uint8Array(await f.arrayBuffer()) })
                const w = await send.vault.writeFiles(v, list)
                status(el.prog, 'Publishing with compare-and-swap…')
                const p = await send.vault.publish(v)
                open(entry, `Committed ${w.added} new and ${w.updated} updated file(s)${p.merged ? ', merged with another device\'s commits' : ''}.`)
            } catch (err) { status(el.prog, errorText(err), 'error'); add.disabled = false }
        })
    } catch (err) { status(el.prog, errorText(err), 'error') }
}
