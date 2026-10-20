*Source: <https://send.sgit.ai/storyboards/what-can-go-wrong/> · send.sgit.ai v0.1.4 · generated from the same data as the page, so the two cannot drift.*

# What can go wrong

> Six ways a hand-over fails: a link in a public channel, expired, the wrong key, a vault key in a link, and what revocation does and does not do. 9 panels.

*Send, as storyboards · Under the hood · board 08 · built · send.build, 20 October 2026. The script of a storyboard drawn by the kit at api.storyboards.sgit.ai; the data is storyboard.json and bundle.json beside this file.*

- [Security: what the server sees](/learn/security/)
- [Keys](/keys/)

## 1. What can go wrong (cover)
*Expiry, caps and revocation limit the future. Nothing takes back the past.*
- Eve, shrug, happy
- Maya, think, worried
- Ravi, stand, confused

Note: The failures, each with what it costs and what the site does about it.
Source: learn/security/index.md

## 2. The link in a public channel
- **Eve** (wave, happy): "A link is as private as where it went."
- prop: board, #id/key, pasted in a group chat / = everyone in the chat has the file /  / send the key by another channel

Note: The link-only option exists for exactly this: the id by one channel, the key by another.
Source: index.html

## 3. Expired, or spent
- **Ravi** (think, confused): "It worked yesterday."
- **Maya** (wave, happy): "Seven days. I'll send a new one."
- prop: mark, 410: gone

Note: 410 is an end state, not an error to retry: expired or exhausted.
Source: open/index.html

## 4. Wrong key
- **Hugo** (think, worried): "It says the key does not open it."
- prop: mark, EDECRYPT
- prop: phone

Note: A wrong key fails cleanly; the bytes were never readable, so nothing is half-opened.
Source: open/index.html

## 5. A vault key in a link
- **Inês** (point, determined): "That was write access. New vault, copy the files, new read key."
- prop: key, sgit_private_vault_…
- prop: sign, rotate it

Note: The open page opens it, with a warning: a vault key should never have travelled in a link.
Source: open/index.html

## 6. Revoke, from Keys
- **Maya** (point, determined): "Deleted on the server. The link opens nothing now."
- prop: record, Keys

Note: A transfer sent from this device keeps its delete secret; revoking deletes it on the server.
Source: keys/index.html

## 7. What revocation does not do
- **Eve** (shrug, happy): "I downloaded it on Tuesday."
- prop: board, revocation is not retroactive / a read key, once out, is out / a copy fetched is a copy kept

Note: Rotating protects the future; nothing on the server reaches a copy already fetched.
Source: learn/vaults-and-keys/index.md

## 8. Not retroactive (evidence)
> revocation is not retroactive, because anyone who fetched the objects keeps them.
> (learn/vaults-and-keys/index.md)
- Eve, shrug, thinking

Note: Quoted from the vaults and keys page, word for word.
Source: learn/vaults-and-keys/index.md

## 9. Expiry, caps and revocation limit the future. Nothing takes back the past. (punchline)
**Expiry, caps and revocation limit the future. Nothing takes back the past.**
- Maya, wave, happy
- Ravi, stand, happy
- Eve, shrug, worried

Note: The security page ends with what the site does not claim.
Source: learn/security/index.md
