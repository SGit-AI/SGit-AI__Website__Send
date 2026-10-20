# How it works

> What happens to a file between the drop zone and the recipient, step by step, with what each party holds at every step.

*Source: <https://send.sgit.ai/learn/> · send.sgit.ai v0.1.4 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# How it works

*As a storyboard: [Send a file. Keep the key.](/storyboards/send-a-file/), nine panels, no cryptography required.*

Four parties: **you**, in your browser; **the recipient**, in theirs; **the server**, which stores ciphertext; and **this site**, which serves pages and code and receives nothing. Here is what each holds at every step.

## Sending a file as a transfer

| Step | Where it happens | You hold | The server holds |
|---|---|---|---|
| 1. You drop a file | your browser | the file | nothing |
| 2. The name is wrapped in front of the file in an envelope | your browser | file and name, as one buffer | nothing |
| 3. A fresh AES-256-GCM key is made and the buffer is encrypted | your browser | the key, the ciphertext | nothing |
| 4. The ciphertext is uploaded: create, upload, complete | your browser to the server | the key | the ciphertext, its size, the time, a hashed IP, a content type hint |
| 5. The link is built with the key after `#`, and drawn as a QR code | your browser | the link | nothing: browsers never send the fragment |
| 6. You hand the link over, by any channel | you to the recipient | the link, in your keys | the ciphertext |
| 7. The recipient opens it: download, decrypt, unwrap | their browser | | the ciphertext, and a download count |

The server could not read the file at any step, and never learned its name. [Security: what the server sees](/learn/security/) is the full list.

## Sending into a vault instead

Steps 1 to 3 are the same, per file. Instead of one transfer, the files are committed into a vault: each file becomes an encrypted object, the folder listing is itself encrypted entry by entry, a commit points at the tree, and the whole thing is published with a compare-and-swap so that two devices never overwrite each other. The link carries the **read key**, derived one way from the vault key: it opens every file and every version, and can change nothing. The **vault key** stays in [your keys](/keys/). [Vaults and keys](/learn/vaults-and-keys/) has the rest.

## Three ways to hand over

| Form | Carries | Good for |
|---|---|---|
| A link with the key | `#id/key`, a 43-character random key | a link in a message; a QR code on a screen |
| A friendly token | `river-cloud-3847`: the id and the key both derive from it | saying it aloud, typing it on a phone, a smaller QR code; links that expire |
| A link and a key, separately | `#id` by one channel, the key by another | when one channel alone should not be enough |

[QR codes and friendly tokens](/learn/qr-codes/) explains the trade each makes.

## What runs where

The pages are this site's. The code they run is [api.send.sgit.ai](https://api.send.sgit.ai) v0.1.1, pinned by address, with a manifest of every file's hash copied into this repository and checked by the gate. The server is whichever SG/Send host you choose in [Settings](/settings/): the hosted one at `send.sgraph.ai`, your own, or [one in memory on your laptop](/use/#local).
