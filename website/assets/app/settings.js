/* settings.js: which SG/Send server this browser talks to, the access token for it, and which copy of the API the
 * pages load. All of it stays in this browser. */
import { loadApi, settings, setEndpoint, setToken, ENDPOINTS, PINNED, API_BASE_KEY } from './api.js'
import { $, esc, status } from './ui.js'

const send = await loadApi()
let cfg = settings(send)
const el = { sel: $('#endpoint'), custom: $('#custom'), token: $('#token'), prog: $('#progress'), form: $('#settings-form'), apiBase: $('#api-base') }
el.sel.innerHTML = ENDPOINTS.map(e => `<option value="${esc(e.endpoint)}">${esc(e.label)}</option>`).join('') + '<option value="custom">another host</option>'
const known = ENDPOINTS.some(e => e.endpoint === cfg.endpoint)
el.sel.value = known ? cfg.endpoint : 'custom'
el.custom.value = known ? '' : cfg.endpoint
el.custom.parentElement.classList.toggle('hidden', known)
el.token.value = cfg.token
$('#pinned').textContent = PINNED
$('#loaded').textContent = send.VERSION
try { el.apiBase.value = localStorage.getItem(API_BASE_KEY) || '' } catch (e) { /* none */ }
el.sel.addEventListener('change', () => { el.custom.parentElement.classList.toggle('hidden', el.sel.value !== 'custom'); el.token.value = (new send.Keyring().list({ kind: send.KEYRING_KINDS.ACCESS_TOKEN }).find(t => t.endpoint === el.sel.value) || {}).value || '' })

el.form.addEventListener('submit', async e => {
    e.preventDefault()
    const endpoint = (el.sel.value === 'custom' ? el.custom.value.trim() : el.sel.value).replace(/\/+$/, '')
    try { new URL(endpoint) } catch (err) { status(el.prog, 'That is not a URL.', 'error'); return }
    setEndpoint(endpoint)
    setToken(send, endpoint, el.token.value.trim())
    try { if (el.apiBase.value.trim()) localStorage.setItem(API_BASE_KEY, el.apiBase.value.trim()); else localStorage.removeItem(API_BASE_KEY) } catch (err) { /* none */ }
    cfg = settings(send)
    status(el.prog, 'Checking the server…')
    try {
        const h = await new send.SendTransfers({ endpoint }).health()
        status(el.prog, `Saved. ${new URL(endpoint).host} answers: ${esc(h.status || 'ok')}${h.version ? ', version ' + esc(h.version) : ''}. ${el.token.value.trim() ? 'The token is kept in your keys and sent only to this host, in a header.' : 'No token: you can open links but not send.'}`, 'ok')
    } catch (err) { status(el.prog, `Saved, but ${new URL(endpoint).host} did not answer /api/health: ${err.message}`, 'error') }
})
