# Brief corrections

> Where the brief was wrong, where the agent's reading of it was wrong, and what was done instead; the brief itself is never edited.

*Source: <https://send.sgit.ai/about/corrections/> · send.sgit.ai v0.1.2 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# Brief corrections

The brief ([published in full](/about/brief/)) is never edited to look right afterwards. This page is the file `BRIEF-CORRECTIONS.md` in the repository, rendered: where the brief was wrong, where the agent's reading was wrong, what was found and what was done instead, dated, with the mistake left visible.

| Date | Where | What was found | What was done |
|---|---|---|---|
| 2026-10-20 | Memo 1, "replicates the functionality that we had on send.sgraph.ai" | send.sgraph.ai at v0.34 has far more than a first release can carry: folders, text and secret transfers, presigned multipart uploads, seventeen locales, a share zip of a vault, a gallery, an admin console. | v0.1.1 carries the core: transfers under 4 MB, friendly tokens, QR codes, vaults with the keyring. The rest is listed as proposed in the reality file and on /learn/from-sgraph/, never described as present. |
| 2026-10-20 | Memo 1, "embrace QR codes, which is a much better way instead of those pass keys" | "Pass keys" most likely means the friendly tokens and the beta access gate, not WebAuthn passkeys; the transcription does not settle it. | QR codes carry the link, with the key or the friendly token, and are drawn on every share. Friendly tokens stay as the spoken form. WebAuthn passkeys are untouched and belong to secrets.sgit.ai. |
| 2026-10-20 | Memo 2, "the full-blown usage commercial model" | No billing, no self-service tokens and no meter exist on the server or on this site; access tokens are issued by hand. | /use/pricing/ states what is true today (free to open, a hand-issued token to send) and lists the model as proposed, row by row. |
| 2026-10-20 | Memo 4 | The memo asks for the centralised guidance page to be published in the newsroom and imported from there. This session has write access to the two Send repositories only. | The page is /articles/every-site-its-own-articles.html here, in the newsroom's article format so it imports unchanged; moving it is on /about/needs/. |
| 2026-10-20 | The app, interoperability | A link made here opening on send.sgraph.ai is asserted from the shared formats and the tests against the in-memory server, not from a run against the hosted site. | Marked proposed in the reality file until a round trip is recorded; the test to run exists in the API repository. |
| 2026-10-20 | The keyring | The brief asks for "the ability to store the vault keys"; a plaintext localStorage keyring stores them but does not protect them. | Built as the first version, with the limit written on the Keys page and the stronger homes named; the passkey-unlocked keyring stays proposed. |
