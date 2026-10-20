# QR codes and friendly tokens

> Why the link is drawn as a QR code, what the code carries and does not, and the trade a friendly token makes against a random key.

*Source: <https://send.sgit.ai/learn/qr-codes/> · send.sgit.ai v0.1.2 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# QR codes and friendly tokens

## The QR code is the link

Every share on this site comes with a QR code, drawn in your browser by the pinned release's QR module from the link itself. Nothing is sent to make it; it is an SVG of the same characters you can copy. A phone's camera opens the link, and the key in the fragment reaches the phone's browser and no server.

That makes the QR code the first way to hand a link over when the two people are in the same room, on a call with a screen, or when one of them is on a phone and the other is not. It replaces the step that broke most hand-overs before: reading out or pasting a long key. The code carries everything the link carries, so it is as secret as the link: do not put it on a slide you will publish.

## A friendly token fits in a smaller square

`river-cloud-3847` is sixteen characters where a link with a random key is ninety. The QR code is smaller and scans from further away, and the token can also be said aloud or typed. The transfer id and the key are both derived from the token in both browsers, so the server never maps a token to anything and never sees it.

The trade: there are 1,024,000,000 tokens, and anyone holding the ciphertext can try them offline at 600,000 PBKDF2 rounds each. A random 256-bit key cannot be tried. So a friendly token is for a link that expires, a file that is not worth that effort, and a moment when speaking it is the point; a random key is for everything else. The send page shows which you chose and the expiry you set.

## Scanning

This release draws codes; it does not scan them. A phone's camera app opens a scanned link in the browser, which is the common case. Scanning with the page's own camera is proposed and listed as such in [the reality file](/about/reality/).

## Compatibility

A link or a token made here opens on [send.sgraph.ai](https://send.sgraph.ai), and one made there opens on [the open page](/open/) here: the fragment grammar, the token derivations and the word list are the same, copied from the SG/Send repository and held by tests. [The contracts](https://api.send.sgit.ai/docs/contracts/) are written down on the API's site.
