/* api.js: the one place this site loads the API from, and the settings every app page shares.
 *
 * The release is pinned in tools/api.json; the gate checks that PINNED below is that file's entry. A developer can
 * point a page at another copy for one browser with localStorage['send.sgit.ai.api-base'] (the tests do), which
 * never changes what other readers get. The endpoint (the SG/Send server) and the access token live in the keyring,
 * in this browser only.
 */
export const PINNED   = 'https://api.send.sgit.ai/v0.1.1/send/send-api.js'
export const API_BASE_KEY = 'send.sgit.ai.api-base'
export const ENDPOINTS = [
    { id: 'prod',  label: 'send.sgraph.ai (the hosted service)', endpoint: 'https://send.sgraph.ai' },
    { id: 'dev',   label: 'dev.send.sgraph.ai (development)',   endpoint: 'https://dev.send.sgraph.ai' },
    { id: 'local', label: 'a server on this machine',           endpoint: 'http://localhost:8787' },
]
export const DEFAULT_ENDPOINT = ENDPOINTS[0].endpoint

let api = null
export async function loadApi() {
    if (api) return api
    let base = null
    try { base = localStorage.getItem(API_BASE_KEY) } catch (e) { base = null }
    const url = base ? base.replace(/\/+$/, '') + '/send/send-api.js' : PINNED
    try { api = await import(url) } catch (e) {
        const main = document.querySelector('main')
        if (main) { const d = document.createElement('div'); d.className = 'sg-danger'; d.textContent = `The code this page runs could not be loaded from ${url}: ${e.message}. The host may not be live yet; a developer can point this browser at another copy in Settings.`; main.prepend(d) }
        throw e
    }
    return api
}

export function settings(send) {
    const ring = new send.Keyring()
    const tokens = ring.list({ kind: send.KEYRING_KINDS.ACCESS_TOKEN })
    let endpoint = DEFAULT_ENDPOINT
    try { endpoint = localStorage.getItem('send.sgit.ai.endpoint') || DEFAULT_ENDPOINT } catch (e) { /* none */ }
    const token = tokens.find(t => t.endpoint === endpoint) || null
    return { ring, endpoint, token: token ? token.value : '', tokenEntry: token }
}

export function setEndpoint(endpoint) {
    try { localStorage.setItem('send.sgit.ai.endpoint', endpoint) } catch (e) { /* none */ }
}

export function setToken(send, endpoint, value) {
    const ring = new send.Keyring()
    for (const t of ring.list({ kind: send.KEYRING_KINDS.ACCESS_TOKEN })) if (t.endpoint === endpoint) ring.remove(t.id)
    if (value) ring.add({ kind: send.KEYRING_KINDS.ACCESS_TOKEN, label: new URL(endpoint).host, value, endpoint })
}

export function openUrl() {
    return location.origin + '/open/'
}
