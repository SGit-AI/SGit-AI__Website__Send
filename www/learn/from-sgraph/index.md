# From send.sgraph.ai to here

> What send.sgraph.ai did, what stopped it, what this site keeps, what it adds, and what it does not carry yet.

*Source: <https://send.sgit.ai/learn/from-sgraph/> · send.sgit.ai v0.1.1 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# From send.sgraph.ai to here

[send.sgraph.ai](https://send.sgraph.ai) has been live since early 2026: zero-knowledge file sharing, encrypted in the browser, the server never seeing the file, the name or the key. It got to v0.34 with a lot of automation and a lot of capability, and then the innovation on it fell off a cliff. The brief that started this site [says why, in the person's own words](/about/brief/#memo-01): the thing users kept running into was where to keep the keys, the vault keys and the access key that lets you push, and because there was no answer everything ground to a halt. That is now solved, and the brand was always a strain ("secure graph" does not say what it does), so the work moves to sgit.ai.

## What this site keeps

- **The job:** send data from A to B, encrypted here, the server blind. The same ciphertext layout, the same envelope, the same friendly tokens, the same link grammar, so links and tokens open on either site.
- **The server:** the SG/Send API, at `send.sgraph.ai` or wherever you point [Settings](/settings/). Nothing server-side changed for this site.
- **The access gate:** uploading still needs an access token during the beta; [the commercial model](/use/pricing/) says how that changes.

## What it adds

- **Keys that are kept.** Every key this site makes goes into [the keyring](/keys/) on the device, with a kind, exportable.
- **Files in vaults.** A file can go into a vault instead of a one-shot transfer: versioned, updatable, browsable, clonable with sgit, shared read-only with a key that cannot write.
- **QR codes first.** Every share is drawn as a code; the long-key hand-over that broke the flow is optional.
- **The code as a release of its own.** [api.send.sgit.ai](https://api.send.sgit.ai) holds the modules, versioned and never edited, so the site is the usage and anyone can embed the same code.

## What it does not carry yet

Counted from send.sgraph.ai's own reality file at v0.25 and its UI at v0.3.x on 20 October 2026, and listed as proposed in [this site's reality file](/about/reality/): folder transfers, text and secret transfers, uploads over 4 MB through presigned multipart, the seventeen locales, the share zip of a whole vault behind a token, the gallery and viewers, the admin console, the data rooms. Some of it will come as releases of the API; some of it belongs to the vault browser at [vault.sgraph.ai](https://vault.sgraph.ai) and will stay there.
