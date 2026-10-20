/* ui.js: the small helpers every app page uses. No framework. */
export const $  = (sel, root = document) => root.querySelector(sel)
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]
export const esc = s => String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]))

export function bytesLabel(n) {
    if (n < 1024) return `${n} B`
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
    return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export function saveAs(bytes, filename, type = 'application/octet-stream') {
    const blob = new Blob([bytes], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename || 'download'; document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 10000)
}

export async function copy(text, button) {
    try { await navigator.clipboard.writeText(text); flash(button, 'Copied') } catch (e) { flash(button, 'Select and copy') }
}

export function flash(button, label) {
    if (!button) return
    const old = button.textContent
    button.textContent = label
    setTimeout(() => { button.textContent = old }, 1400)
}

export function status(el, text, kind = '') {
    if (!el) return
    el.textContent = text
    el.className = 'progress ' + kind
}

export function errorText(e) {
    const code = e && e.code ? `${e.code}: ` : ''
    const hints = { EAUTH: 'the access token is missing or wrong; set one in Settings', EGONE: 'this transfer has expired or its downloads are spent', ENOTFOUND: 'no such transfer; it may have been deleted',
                    EDECRYPT: 'the key does not open this file', EKEY: 'this link carries no key; paste the key that travelled separately', ENETWORK: 'the server could not be reached; check the endpoint in Settings',
                    ETOOLARGE: 'this release sends files under 4 MB', ENOCRYPTO: 'this page needs https or localhost', EEDGE: 'the edge answered with an HTML page; try again or check the endpoint' }
    return code + (hints[e && e.code] || (e && e.message) || String(e))
}

export function fileDrop(zone, input, onFiles) {
    zone.addEventListener('click', () => input.click())
    zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click() } })
    input.addEventListener('change', () => { if (input.files.length) onFiles([...input.files]) })
    for (const ev of ['dragenter', 'dragover']) zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('over') })
    for (const ev of ['dragleave', 'drop']) zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('over') })
    zone.addEventListener('drop', e => { if (e.dataTransfer.files.length) onFiles([...e.dataTransfer.files]) })
    document.addEventListener('dragover', e => e.preventDefault())
    document.addEventListener('drop', e => e.preventDefault())
}

export function qrBox(send, text, title) {
    return `<div class="qr" title="${esc(title || '')}">${send.qr.toSvg(text, { title: title || text })}</div>`
}
