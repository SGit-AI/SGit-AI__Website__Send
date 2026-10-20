*Source: <https://send.sgit.ai/storyboards/the-envelope/> · send.sgit.ai v0.1.4 · generated from the same data as the page, so the two cannot drift.*

# The envelope and the fragment

> What the bytes look like, which of them the server sees, and where each of the two secrets goes. 9 panels.

*Send, as storyboards · Under the hood · board 05 · built · send.build, 20 October 2026. The script of a storyboard drawn by the kit at api.storyboards.sgit.ai; the data is storyboard.json and bundle.json beside this file.*

- [The contracts, on the API site](https://api.send.sgit.ai/docs/contracts/)
- [Security: what the server sees](/learn/security/)

## 1. The envelope and the fragment (cover)
*Bytes the server sees, and bytes it never does.*
- Inês, point, determined
- Eve, shrug, thinking
- The Server, stand, calm

Note: The technical half of the first board: the exact layout, and the two places a secret may be.
Source: learn/security/index.md

## 2. The name goes inside
- **Inês** (point, determined): "Wrapped before encrypting. Get the order wrong and the download has no name."
- prop: board, SGMETA\0           7 bytes / meta_len           4 bytes, big-endian / {"filename": "report.pdf"} / file bytes         the rest

Note: The SGMETA envelope, the layout send.sgraph.ai has used since its first version.
Source: learn/index.md

## 3. Then AES-256-GCM
- Inês, stand, happy
- prop: board, IV            12 bytes, fresh every time / ciphertext / tag           16 bytes / = plaintext + 28 bytes, exactly

Note: The ciphertext is 28 bytes longer than the plaintext: the tests hold that number.
Source: learn/index.md

## 4. Two secrets, two places
- **Inês** (point, determined): "Never the other way round."
- prop: key, access token: a request header
- prop: key, decryption key: the # fragment

Note: The token says who may upload; the key says who may read. Confusing them does not throw.
Source: learn/security/index.md

## 5. What the server sees
- **The Server** (stand, calm): "Bytes, a size, a time, a hint you chose."
- prop: server, send.sgraph.ai
- prop: board, ciphertext, size, time / a hashed IP / content_type_hint / not: name, key, plaintext

Note: The full list, both columns, is on the security page.
Source: learn/security/index.md

## 6. Eve on the wire
- **Eve** (shrug, thinking): "Everything after the # is yours, not mine."
- prop: arrow, #id/key never leaves the browser
- prop: padlock, fragment

Note: A browser never sends the fragment of a URL to the server that serves the page.
Source: learn/index.md

## 7. The token, in one place (evidence)
> The access token says who may upload. It goes in a request header to the server you chose and nowhere else: never a URL, never a log.
> (learn/security/index.md)
- Inês, point, determined

Note: Quoted from the security page, word for word.
Source: learn/security/index.md

## 8. Held by tests, not by promises
- **Inês** (point, happy): "Held by tests, not by promises."
- prop: terminal, $ node --test 'tests/*.test.mjs' / ok  send then receive: byte for byte / ok  the name in no request / ok  the token in no request path / # pass 44

Note: The API release's tests run against the server in memory; the browser test drives this site.
Source: use/index.md

## 9. The server gets bytes it cannot read, a size, and a hint you chose. (punchline)
**The server gets bytes it cannot read, a size, and a hint you chose.**
- Inês, wave, happy
- The Server, stand, calm
- Eve, shrug, worried

Note: The claim the whole site rests on, and what it does not claim is on the security page too.
Source: learn/security/index.md
