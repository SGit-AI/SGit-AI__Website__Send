# Reality, what exists

> The code-verified list of what this site implements, generated from website/data/features.json on every build. If it is not listed here, it does not exist.

*Source: <https://send.sgit.ai/about/reality/> · send.sgit.ai v0.1.3 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# Reality: what exists

Generated from `website/data/features.json` on every build; audited 2026-10-20, v0.1.0, by reading website/ and running tests/test_app.mjs against the pinned release and the in-memory server against the code. **If it is not listed here, it does not exist.** Status words: *shipped* (code, tests, served), *proposed* (described in a brief, no code), *absent* (asked about, not built, not planned yet).

## Sending

| Feature | Status | Since | Evidence |
|---|---|---|---|
| Send one file as a transfer: envelope, encrypt here, upload; a link with the key, a QR code | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/send.js`, `tests/test_app.mjs` |
| Friendly token instead of a random key; link-only with the key shown separately | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/send.js` |
| Expiry (1, 7, 30 days, never) and download caps (unlimited, 1, 5); every transfer revocable from Keys | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/send.js`, `assets/app/keys.js` |
| Several files, or any size, into a vault as one commit | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/send.js` sendVault |
| Transfers over 4 MB (presigned multipart) | <span class="sg-status sg-status-proposed">proposed</span> |  | the API refuses with ETOOLARGE; the server route exists |
| Folder transfers, text and secret transfers, as send.sgraph.ai has them | <span class="sg-status sg-status-proposed">proposed</span> |  | not in the pinned release |
| Locales other than en-GB | <span class="sg-status sg-status-absent">absent</span> |  | one language; send.sgraph.ai has seventeen |

## Opening

| Feature | Status | Since | Evidence |
|---|---|---|---|
| Open a transfer link with its key, link-only with the key pasted, or a friendly token; decrypt here; save with the name from the envelope | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/open.js`, `tests/test_app.mjs` |
| Open a read key: list every file of a vault, decrypt and save each; keep the key | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/open.js` |
| A vault key in a link opens, with a warning that it is write access | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/open.js` |
| Links made on send.sgraph.ai open here, proved against the hosted site | <span class="sg-status sg-status-proposed">proposed</span> |  | the formats are the same, held by the API's tests; no live run recorded |
| Preview of images, text or markdown in the page | <span class="sg-status sg-status-proposed">proposed</span> |  | files are saved, not shown |

## Vaults

| Feature | Status | Since | Evidence |
|---|---|---|---|
| Create a vault; the vault key and the read key go into the keyring | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/vaults.js` |
| Open a vault from the keyring, list files, add files as one commit, publish with compare-and-swap, see the history | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/vaults.js`, `tests/test_app.mjs` |
| Share read-only: the read-key link and its QR code; the sgit clone line | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/vaults.js` |
| Folders, rename, delete, move inside a vault from this site | <span class="sg-status sg-status-proposed">proposed</span> |  | the library has them; the page writes to the root only |
| Browsing a vault with pages, markdown and galleries | <span class="sg-status sg-status-absent">absent</span> |  | that is vault.sgraph.ai's job, and this site links to sgit instead |

## Keys

| Feature | Status | Since | Evidence |
|---|---|---|---|
| The keyring: vault keys, read keys, transfers sent, access tokens; reveal, copy, forget, export, import | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/keys.js` |
| Revoke a transfer sent from this device | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/keys.js`, the delete secret kept with the entry |
| Keys encrypted at rest, unlocked by a passkey | <span class="sg-status sg-status-proposed">proposed</span> |  | secrets.sgit.ai's design; the page says the keyring is plaintext |
| Sending a vault key to a registry over an append lane | <span class="sg-status sg-status-proposed">proposed</span> |  | sgit.ai/docs/send-a-vault-key; not built here |

## Settings and the code

| Feature | Status | Since | Evidence |
|---|---|---|---|
| Choose the server (hosted, dev, local, custom); the access token per server; a health check | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/settings.js` |
| The API pinned to api.send.sgit.ai v0.1.0 with its manifest copied; the gate refuses an unpinned reference | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `tools/api.json`, `tools/api-manifest.json`, `tools/check.py` |
| A per-browser override of where the API loads from, for development | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `assets/app/api.js`, localStorage `send.sgit.ai.api-base` |

## The commercial model

| Feature | Status | Since | Evidence |
|---|---|---|---|
| Opening is free; sending needs a hand-issued, use-limited access token | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | the server's gate; `/use/pricing/` |
| Self-service tokens, a usage meter on the page, vault hosting fees, organisations, a reading meter | <span class="sg-status sg-status-proposed">proposed</span> |  | `/use/pricing/`, each row marked |

## The site and the pipeline

| Feature | Status | Since | Evidence |
|---|---|---|---|
| Every page with a markdown twin, llms.txt, llms-full.txt, sitemap; chrome injected at build; two themes | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `tools/sitekit.py`, `www/` |
| The gate: build committed, links, twins, origins, the pin, tripwire, prose, version | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `tools/check.py`, `.github/workflows/ci.yml` |
| An end-to-end browser test: send, open, vault, against the pinned release and the in-memory server | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `tests/test_app.mjs` |
| Deploy to GitHub Pages on dev, tag, verify the live site | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `.github/workflows/deploy-pages.yml`; the first run waits on Pages and DNS |
| The articles section, in the newsroom's format | <span class="sg-status sg-status-shipped">shipped</span> | v0.1.0 | `/articles/`, three articles |
| A review/ folder with the derived graph and navigator | <span class="sg-status sg-status-proposed">proposed</span> |  | `review/intent/` only |

**Counted, not remembered:** 2 absent, 9 proposed, 21 shipped.
