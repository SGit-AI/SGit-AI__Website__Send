*Source: <https://send.sgit.ai/storyboards/send-a-file/> · send.sgit.ai v0.1.4 · generated from the same data as the page, so the two cannot drift.*

# Send a file. Keep the key.

> Maya sends forty photos to Hugo, who has no account; the server keeps bytes it cannot read; Hugo scans a code on his phone. 9 panels.

*Send, as storyboards · For everyone · board 01 · built · send.build, 20 October 2026. The script of a storyboard drawn by the kit at api.storyboards.sgit.ai; the data is storyboard.json and bundle.json beside this file.*

- [Send a file](/)
- [Open a link](/open/)

## 1. Send a file. Keep the key. (cover)
*Encrypted here. The server gets bytes it cannot read.*
- Maya, point, happy
- Hugo, stand, happy
- The Server, stand, calm

Note: The whole site in one line: the file is encrypted in the sender's browser, and the key never reaches a server.
Source: index.html

## 2. A file to hand over
- **Maya** (think, thinking): "Forty photos for Hugo. He has no account anywhere."
- prop: laptop

Note: The case the brief led with: a file for a person who did not choose this site.
Source: index.html

## 3. Encrypted here, before it leaves
- **Maya** (point, determined): "The name goes inside the envelope too."
- prop: laptop
- prop: arrow, encrypted in the browser
- prop: envelope, photos.zip, inside

Note: AES-256-GCM under a fresh key, with the file name wrapped inside the plaintext, so the server never learns it.
Source: learn/index.md

## 4. The server keeps bytes
- **The Server** (stand, calm): "I keep the bytes. I cannot read them."
- prop: server, ciphertext, size, time
- prop: envelope, sealed

Note: What a zero-knowledge store is: it holds ciphertext and compares hashes. It never had the key.
Source: learn/security/index.md

## 5. A link, and a QR code
- **Maya** (point, happy): "Scan this."
- prop: qr, send.sgit.ai/open/#…

Note: The key travels after the # in the link, which browsers never send to a server. The code is the link, drawn here.
Source: learn/qr-codes/index.md

## 6. On Hugo's phone
- **Hugo** (think, confused): "Do I need an account?"
- **Maya** (wave, happy): "No. The key is in the link."
- prop: phoneqr, send.sgit.ai/open/#…

Note: Opening needs nothing: no token, no account. The key is the gate.
Source: open/index.html

## 7. Decrypted on his phone
- **Hugo** (arms-up, happy): "There they are."
- prop: phone
- prop: mark, decrypted here

Note: Download, decrypt, unwrap: the file and its name come back in Hugo's browser, byte for byte.
Source: open/index.html

## 8. What the server is (evidence)
> The server is a capability-checked ciphertext store: every access decision it makes is a hash comparison, and it never holds a raw key.
> (learn/security/index.md)
- The Server, stand, calm

Note: Quoted from the security page, word for word.
Source: learn/security/index.md

## 9. Whoever has the link has the file. Nobody else does, the server included. (punchline)
**Whoever has the link has the file. Nobody else does, the server included.**
- Maya, wave, happy
- Hugo, arms-up, happy
- The Server, stand, calm

Note: Send, open: built and driven end to end by the browser test.
Source: tests/test_app.mjs
