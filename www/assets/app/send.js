/* send.js: the send box on the home page. Pick a file, choose how to hand it over and where it lives, encrypt it
 * here, upload it, and get a link and a QR code. Every byte that leaves this page is ciphertext; the name goes
 * inside it; the key goes in the link's fragment or nowhere. Needs an access token (Settings) to upload. */
import { loadApi, settings, openUrl } from './api.js'
import { $, $$, esc, bytesLabel, saveAs, copy, status, errorText, fileDrop, qrBox } from './ui.js'

const send = await loadApi()
const cfg = settings(send)
const el = {
    zone: $('#drop'), input: $('#file'), picked: $('#picked'), form: $('#send-form'), go: $('#go'), prog: $('#progress'),
    result: $('#result'), token: $('#token-notice'), vaultPick: $('#vault-pick'), vaultName: $('#vault-name-row'),
}
let files = []

if (!cfg.token) el.token.classList.remove('hidden')
$('#endpoint-label').textContent = new URL(cfg.endpoint).host

// vaults this browser holds, for the "into a vault" option
const vaults = cfg.ring.list({ kind: send.KEYRING_KINDS.VAULT_KEY })
el.vaultPick.innerHTML = '<option value="new">a new vault</option>' + vaults.map(v => `<option value="${esc(v.id)}">${esc(v.label || v.vaultId || v.id)}</option>`).join('')
el.vaultPick.addEventListener('change', () => el.vaultName.classList.toggle('hidden', el.vaultPick.value !== 'new'))

fileDrop(el.zone, el.input, picked => {
    files = picked
    el.picked.innerHTML = files.map(f => `<li><span class="mono">${esc(f.name)}</span> <span class="muted">${bytesLabel(f.size)}</span></li>`).join('')
    el.picked.classList.remove('hidden')
    el.go.disabled = false
    const many = files.length > 1
    $$('input[name=where]').forEach(r => { if (r.value === 'transfer') { r.disabled = many; if (many) $('input[name=where][value=vault]').checked = true } })
    $('#many-note').classList.toggle('hidden', !many)
})

$$('input[name=where]').forEach(r => r.addEventListener('change', () => {
    $('#transfer-options').classList.toggle('hidden', r.value !== 'transfer' || !r.checked)
    $('#vault-options').classList.toggle('hidden', r.value !== 'vault' || !r.checked)
}))

el.form.addEventListener('submit', async e => {
    e.preventDefault()
    if (!files.length) return
    el.go.disabled = true
    el.result.classList.add('hidden')
    const where = $('input[name=where]:checked').value
    const how = $('input[name=how]:checked').value
    try {
        if (where === 'transfer') await sendTransfer(files[0], how)
        else await sendVault(files, how)
    } catch (err) {
        status(el.prog, errorText(err), 'error')
        el.go.disabled = false
    }
})

async function sendTransfer(file, how) {
    const api = new send.SendTransfers({ endpoint: cfg.endpoint, accessToken: cfg.token })
    const bytes = new Uint8Array(await file.arrayBuffer())
    const days = Number($('#expires').value)
    const friendlyToken = how === 'friendly' ? send.friendly.newFriendlyToken() : null
    const labels = { wrap: 'Wrapping the name inside the file', encrypt: 'Encrypting in this browser', create: 'Asking the server for a transfer id', upload: 'Uploading ciphertext', complete: 'Finishing' }
    const r = await api.send({
        bytes, filename: file.name, contentTypeHint: 'application/octet-stream', friendlyToken,
        maxDownloads: Number($('#downloads').value), expiresAt: days ? Date.now() + days * 86400e3 : 0, revocable: true,
        onProgress: step => status(el.prog, labels[step] + '…'),
    })
    status(el.prog, `Sent: ${bytesLabel(r.encryptedBytes)} of ciphertext. The server has the bytes, not the name, not the key.`, 'ok')
    const base = openUrl()
    let link, keyLine = ''
    if (friendlyToken) link = send.link.friendlyLink({ openUrl: base, token: friendlyToken })
    else if (how === 'link-only') { link = send.link.transferLink({ openUrl: base, transferId: r.transferId }); keyLine = r.keyString }
    else link = send.link.transferLink({ openUrl: base, transferId: r.transferId, key: r.keyString })
    cfg.ring.add({ kind: send.KEYRING_KINDS.TRANSFER, label: file.name, value: friendlyToken || `${r.transferId}/${r.keyString}`, transferId: r.transferId, link, deleteSecret: r.deleteSecret, endpoint: cfg.endpoint, size: file.size })
    showResult({ link, keyLine, friendlyToken, title: `${file.name} is ready to hand over`, note: days ? `Expires in ${days} day(s).` : 'Never expires.', extra: `<p class="muted">Kept in <a href="/keys/">your keys</a> on this device, with the secret that can delete it.</p>` })
}

async function sendVault(picked, how) {
    await send.vault.ready()
    const sg = send.vault.client({ endpoint: cfg.endpoint, accessToken: cfg.token })
    let vault, vaultKey, readKey, label
    const choice = el.vaultPick.value
    if (choice === 'new') {
        label = $('#vault-name').value.trim() || `Vault ${new Date().toISOString().slice(0, 10)}`
        status(el.prog, 'Creating the vault: deriving keys (about a second) and writing the first commit…')
        ;({ vault, vaultKey, readKey } = await send.vault.createVault(sg, { name: label }))
        cfg.ring.add({ kind: send.KEYRING_KINDS.VAULT_KEY, label, value: vaultKey, vaultId: vault.vaultId, endpoint: cfg.endpoint })
        cfg.ring.add({ kind: send.KEYRING_KINDS.READ_KEY, label: `${label} (read)`, value: readKey, vaultId: vault.vaultId, endpoint: cfg.endpoint })
    } else {
        const entry = cfg.ring.get(choice)
        label = entry.label
        status(el.prog, 'Opening the vault…')
        vault = await send.vault.openVault(sg, entry.value)
        vaultKey = entry.value
        readKey = await send.vault.readKeyOf(vault)
    }
    status(el.prog, `Encrypting ${picked.length} file(s) and committing…`)
    const list = []
    for (const f of picked) list.push({ folder: '/', name: f.name, data: new Uint8Array(await f.arrayBuffer()) })
    const w = await send.vault.writeFiles(vault, list)
    status(el.prog, 'Publishing with compare-and-swap…')
    const p = await send.vault.publish(vault)
    status(el.prog, `Committed ${w.added} new and ${w.updated} updated file(s) to "${label}"${p.merged ? ', merged with what another device had published' : ''}.`, 'ok')
    const link = send.link.vaultLink({ openUrl: openUrl(), credential: readKey })
    showResult({ link, keyLine: '', title: `"${label}" has the file(s)`, note: 'This link carries the read key: anyone with it can read every file and every version, and nobody can change anything. The vault key stays in your keys.',
                 extra: `<p>Clone it with sgit: <code class="mono">sgit clone ${esc(readKey)}</code></p><p class="muted">Open it in <a href="/vaults/">Vaults</a> to add, update or share again.</p>` })
}

function showResult({ link, keyLine, friendlyToken, title, note, extra }) {
    el.result.innerHTML = `
        <h2>${esc(title)}</h2>
        <div class="two">
          <div>
            <p><strong>Link</strong> <span class="muted">${esc(note)}</span></p>
            <p class="link"><a href="${esc(link)}" target="_blank" rel="noopener">${esc(link)}</a></p>
            <p class="row-actions"><button class="btn" data-copy="${esc(link)}">Copy link</button> <a class="btn secondary" href="${esc(link)}" target="_blank" rel="noopener">Open in a new tab</a></p>
            ${friendlyToken ? `<p><strong>Say it aloud:</strong> <span class="mono" style="font-size:1.3em">${esc(friendlyToken)}</span> <button class="btn secondary" data-copy="${esc(friendlyToken)}">Copy token</button></p><p class="muted">Whoever opens the link, or types the token on <a href="/open/">the open page</a>, gets the file. There are 1,024,000,000 tokens; use one for a link that expires.</p>` : ''}
            ${keyLine ? `<p><strong>Key, to send by a second channel</strong> <span class="muted">(the link alone opens nothing)</span></p><p class="mono">${esc(keyLine)}</p><p><button class="btn secondary" data-copy="${esc(keyLine)}">Copy key</button></p>` : ''}
            ${extra || ''}
          </div>
          <div><p><strong>Scan to open</strong></p>${qrBox(send, link, link)}<p class="muted">The QR code is the link, drawn here; nothing was sent to make it.</p></div>
        </div>
        <p><button class="btn secondary" id="again">Send another</button></p>`
    el.result.classList.remove('hidden')
    $$('[data-copy]', el.result).forEach(b => b.addEventListener('click', () => copy(b.getAttribute('data-copy'), b)))
    $('#again').addEventListener('click', () => { files = []; el.picked.classList.add('hidden'); el.result.classList.add('hidden'); status(el.prog, ''); el.input.value = ''; el.go.disabled = true })
}
