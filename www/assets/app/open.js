/* open.js: open whatever is after the # on this page: a transfer link (with or without its key), a friendly token,
 * a read key (every file of a vault, read only) or a vault key. Nothing is uploaded; opening needs no token. */
import { loadApi, settings } from './api.js'
import { $, $$, esc, bytesLabel, saveAs, copy, status, errorText, qrBox } from './ui.js'

const send = await loadApi()
const cfg = settings(send)
const el = { box: $('#open-box'), prog: $('#progress'), manual: $('#manual'), form: $('#manual-form') }

el.form.addEventListener('submit', e => { e.preventDefault(); location.hash = '#' + el.manual.value.trim().replace(/^.*#/, ''); run() })
window.addEventListener('hashchange', run)
run()

async function run() {
    const parsed = send.link.parseFragment(location.hash)
    el.box.innerHTML = ''
    status(el.prog, '')
    if (parsed.kind === 'empty') return
    if (parsed.kind === 'unknown') { el.box.innerHTML = `<p class="sg-danger">That is not a link this page knows: ${esc(parsed.raw.slice(0, 40))}. A transfer link looks like <code>#id/key</code>, a friendly token like <code>river-cloud-3847</code>, a read key like <code>sgit_public_read_…:vaultid</code>.</p>`; return }
    try {
        if (parsed.kind === 'transfer' || parsed.kind === 'friendly') await transfer(parsed)
        else await vault(parsed)
    } catch (err) { status(el.prog, errorText(err), 'error') }
}

async function transfer(parsed) {
    const api = new send.SendTransfers({ endpoint: cfg.endpoint })
    const id = parsed.kind === 'friendly' ? await send.friendly.deriveTransferId(parsed.token) : parsed.transferId
    status(el.prog, 'Asking the server what it has (not the name, it does not know it)…')
    const info = await api.info(id)
    status(el.prog, '')
    const needsKey = parsed.kind === 'transfer' && !parsed.key
    el.box.innerHTML = `
        <h2>An encrypted ${parsed.kind === 'friendly' ? 'file behind a friendly token' : 'file'}</h2>
        <dl class="kv">
          <dt>Transfer</dt><dd class="mono">${esc(id)}</dd>
          <dt>Ciphertext</dt><dd>${bytesLabel(info.encrypted_size || info.file_size_bytes || 0)}${info.file_size_bytes ? ` (plaintext ${bytesLabel(info.file_size_bytes)})` : ''}</dd>
          <dt>Downloads so far</dt><dd>${esc(info.download_count ?? '?')}${info.max_downloads ? ` of ${esc(info.max_downloads)}` : ''}</dd>
          <dt>Server</dt><dd>${esc(new URL(cfg.endpoint).host)}</dd>
        </dl>
        ${needsKey ? `<label for="key">The key, which travelled separately</label><input id="key" type="text" class="mono" placeholder="43 characters" autocomplete="off">` : ''}
        <p class="row-actions"><button id="get" class="btn">Download and decrypt</button> <span class="muted">Counts as one download. Decryption happens here; the server never sees the key.</span></p>
        <div id="got"></div>`
    $('#get').addEventListener('click', async () => {
        $('#get').disabled = true
        try {
            const keyString = needsKey ? $('#key').value.trim() : parsed.key
            const got = await api.receive(parsed.kind === 'friendly' ? { friendlyToken: parsed.token, onProgress: p } : { transferId: id, keyString, onProgress: p })
            status(el.prog, `Decrypted ${bytesLabel(got.bytes.length)}: ${got.filename || 'a file with no name in its envelope'}.`, 'ok')
            saveAs(got.bytes, got.filename || `${id}.bin`)
            $('#got').innerHTML = `<p class="sg-note">Saved as <span class="mono">${esc(got.filename || id + '.bin')}</span>. The file name was inside the ciphertext: the server never had it. <button class="btn secondary" id="save-again">Save again</button></p>`
            $('#save-again').addEventListener('click', () => saveAs(got.bytes, got.filename || `${id}.bin`))
        } catch (err) { status(el.prog, errorText(err), 'error'); $('#get').disabled = false }
    })
    function p(step) { status(el.prog, step === 'download' ? 'Downloading ciphertext…' : 'Decrypting in this browser…') }
}

async function vault(parsed) {
    status(el.prog, 'Loading the vault library and deriving keys (about a second)…')
    await send.vault.ready()
    const sg = send.vault.client({ endpoint: cfg.endpoint, accessToken: cfg.token })
    const v = parsed.kind === 'read-key' ? await send.vault.openReadOnly(sg, parsed.credential) : await send.vault.openVault(sg, parsed.credential)
    status(el.prog, 'Listing files…')
    const files = await send.vault.listAll(v)
    status(el.prog, '')
    const already = cfg.ring.list().some(e => e.value === parsed.credential)
    el.box.innerHTML = `
        <h2>${esc(v.name || 'A vault')} <span class="sg-status ${v.writable ? 'sg-status-proposed' : 'sg-status-shipped'}">${v.writable ? 'vault key: read and write' : 'read key: read only'}</span></h2>
        <dl class="kv"><dt>Vault</dt><dd class="mono">${esc(v.vaultId)}</dd><dt>Files</dt><dd>${files.length}</dd><dt>Clone it</dt><dd class="mono">sgit clone ${esc(parsed.credential)}</dd></dl>
        ${v.writable ? '<p class="sg-danger">This link carries a <strong>vault key</strong>, which can change the vault. If it reached you by a channel others can read, the owner should rotate it. Share the read key instead.</p>' : ''}
        <ul class="list" id="files">${files.map((f, i) => `<li><span class="mono">${esc(f.path)}</span> <span class="muted">${bytesLabel(f.size || 0)}</span> <button class="btn secondary" data-i="${i}">Decrypt and save</button></li>`).join('') || '<li class="muted">No files yet.</li>'}</ul>
        <p class="row-actions">${already ? '<span class="muted">Already in your keys.</span>' : `<button class="btn secondary" id="keep">Keep in my keys</button>`} <a class="btn secondary" href="/vaults/">Open in Vaults</a></p>`
    $$('[data-i]', el.box).forEach(b => b.addEventListener('click', async () => {
        const f = files[Number(b.getAttribute('data-i'))]
        try { b.disabled = true; const bytes = await send.vault.readFile(v, f.folder, f.name); saveAs(new Uint8Array(bytes), f.name); b.disabled = false } catch (err) { status(el.prog, errorText(err), 'error') }
    }))
    const keep = $('#keep')
    if (keep) keep.addEventListener('click', () => {
        cfg.ring.add({ kind: v.writable ? send.KEYRING_KINDS.VAULT_KEY : send.KEYRING_KINDS.READ_KEY, label: (v.name || v.vaultId) + (v.writable ? '' : ' (read)'), value: parsed.credential, vaultId: v.vaultId, endpoint: cfg.endpoint })
        keep.replaceWith(Object.assign(document.createElement('span'), { className: 'muted', textContent: 'Kept.' }))
    })
}
