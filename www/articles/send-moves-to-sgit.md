# Send moves to sgit.ai: the keys were the missing piece, and now they are not

> This is the brief for refactoring SG/Send, the file transfer service at send.sgraph.ai, into send.sgit.ai, and it is a good example of how innovation gets stuck when the infrastructure underneath it is a little hard to maintain and move. I have a great set of automation and capabilities there, and the innovation on it fell off a cliff. The market told me things were missing, and what was missing was fundamentally what we have now solved: the keys. Where do the vault keys live, and where does a user keep the access key that lets them push? Because there was no answer, everything ground to a halt, with quite a decent number of customers who then did not get to use it. So the time has come to move it to sgit.ai, also because SGraph, "secure graph", was always a strange brand. What I have in mind is send.sgit.ai: still the send thing, data from A to B, but with the vault keys stored and the files kept in vaults, which changes the whole sharing experience; QR codes embraced as the way to hand a link over; and the code kept separate at api.send.sgit.ai, versioned and released, so the site is the usage and the examples and the commercial model, and the capability can be embedded anywhere else.

*Source: <https://send.sgit.ai/articles/send-moves-to-sgit.html> · send.sgit.ai v0.1.3 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

By Dinis Cruz · 2026-10-20 · published

**Summary:** This is the brief for refactoring SG/Send, the file transfer service at send.sgraph.ai, into send.sgit.ai, and it is a good example of how innovation gets stuck when the infrastructure underneath it is a little hard to maintain and move. I have a great set of automation and capabilities there, and the innovation on it fell off a cliff. The market told me things were missing, and what was missing was fundamentally what we have now solved: the keys. Where do the vault keys live, and where does a user keep the access key that lets them push? Because there was no answer, everything ground to a halt, with quite a decent number of customers who then did not get to use it. So the time has come to move it to sgit.ai, also because SGraph, "secure graph", was always a strange brand. What I have in mind is send.sgit.ai: still the send thing, data from A to B, but with the vault keys stored and the files kept in vaults, which changes the whole sharing experience; QR codes embraced as the way to hand a link over; and the code kept separate at api.send.sgit.ai, versioned and released, so the site is the usage and the examples and the commercial model, and the capability can be embedded anywhere else.

![What moved and what was added. On the left, send.sgraph.ai: a transfer encrypted in the browser, a link with the key, the server blind; and beside it the two gaps, nowhere to keep the vault keys and nowhere to keep the access key. On the right, send.sgit.ai: the same transfer, plus files into a vault, a keyring on the device for every key, a QR code on every share, and the code lifted out into api.send.sgit.ai, pinned by the site.](/articles/images/send-moves-to-sgit.svg)

*What moved and what was added. On the left, send.sgraph.ai: a transfer encrypted in the browser, a link with the key, the server blind; and beside it the two gaps, nowhere to keep the vault keys and nowhere to keep the access key. On the right, send.sgit.ai: the same transfer, plus files into a vault, a keyring on the device for every key, a QR code on every share, and the code lifted out into api.send.sgit.ai, pinned by the site.*
## In short {#in-short}

- **The innovation on SG/Send fell off a cliff, and the reason was the keys.** The automation and the capabilities were there; what people could not do was keep the vault key or the access key anywhere, so they stopped.
- **That is now solved,** and the move to sgit.ai is where the solution lives: a keyring on the device, files in vaults, the read key as the thing you share.
- **The brand was always a strain.** "Secure graph" does not say what the thing does; sgit.ai does.
- **QR codes are the hand-over.** Every share is drawn as a code, so the long key is never read out or pasted unless you want it to be.
- **The code is a release of its own.** api.send.sgit.ai holds the modules, versioned and never edited; the site pins one release and is the usage, the examples and the commercial model.
- **What was built:** send.sgit.ai v0.1.0 and api.send.sgit.ai v0.1.0, in one session, with the reality files saying what is not there yet.

## How innovation gets stuck {#stuck}

send.sgraph.ai is a good product. It has a great set of automation: the IFD versioning, the agentic team with its fifteen roles, the reality file that says what exists, the tests that run against a real in-memory stack. It has a great set of capabilities: transfers, folders, text and secrets, friendly tokens, presigned uploads for big files, seventeen locales, vaults with a browser of their own. And if you look at the innovation on it over the last months, it fell off a cliff.

The market told me what was missing, and I was slow to hear it because the answer was not a feature. The biggest attrition we had was this: where do the users store the access key that lets them commit and push? And where do they keep the vault key once they have made a vault? There was no answer, so there was no vault, so the sharing experience was a one-shot transfer with a long key to paste, and the people who tried it, quite a decent number of customers, did not come back. The infrastructure was a little hard to maintain and move, and that is exactly the condition under which a missing piece that is not a feature does not get built.

## What is now solved {#solved}

Keys. Storing them, storing the vault keys, storing the access key. [Where the vault keys live](https://newsroom.sgit.ai/articles/where-the-vault-keys-live.html) is the long version from the sgit side; the short version is that a key now has places to be: a keyring on the device, a password manager, a registry vault fed over an append lane, and soon the passkey-unlocked keyring at secrets.sgit.ai. Once a key has a home, a vault is something a person can make and come back to, and sharing becomes a read key handed over rather than a file re-sent.

So the time has come to move. Also because SGraph was a strange brand: "secure graph" was never quite the thing, and sgit.ai, git for things you cannot put on GitHub, is.

## What send.sgit.ai is {#what}

It is still the send thing: data from A to B, encrypted in the browser, the server never seeing a file, a name or a key. The ciphertext layout, the envelope that carries the name, the friendly tokens and the links are the ones send.sgraph.ai has, so a link made on either opens on the other. On top of that, three things.

**Vault keys stored, files in vaults.** A file can go into a vault instead of a one-shot transfer. The vault key goes into [the keyring](/keys/) on the device, with its kind, exportable. The read key, derived one way, is the thing you share: it opens every file and every version and can change nothing, and a laptop can `sgit clone` it. That is the whole sharing experience changed: versioned, updatable, browsable, and the person who made it can find it again.

**QR codes embraced.** Every share is drawn as a QR code from the link, in the browser. For two people in a room or on a call, or for one on a phone, that is the hand-over, and the long key that broke the flow before is optional. A friendly token fits in a smaller square and can be said aloud.

**The code as an API.** [api.send.sgit.ai](https://api.send.sgit.ai) is the versioned, released code that send.sgit.ai uses and that other places can embed. The site is the usage of it: the examples, the explanations, [the commercial model](/use/pricing/), which is the point of the whole thing, a full usage-based model for using the site and its capabilities. Keeping the code separate keeps the releases clean and lets the capability land in other places, agentic workflows included, which need exactly this, and the PKI work that is about to be wired in sits at the intersection.

## Where it stands {#stands}

Both sites are at v0.1.0, built in one session from four memos. The app sends a file as a transfer or into a vault, opens any of the link forms, creates and shares vaults, and keeps every key on the device. The reality files on [this site](/about/reality/) and [the API's](https://api.send.sgit.ai/about/reality/) say what is proposed: uploads over 4 MB, folders and text, the locales, the share zip, the commercial model beyond hand-issued tokens, and the round trip against the hosted server, which needs a token to run. [The brief is published in full](/about/brief/) with [what the reading got wrong](/about/corrections/).

## What this does not claim {#limits}

- **Not that send.sgraph.ai is finished.** It keeps running, it has more features than this site, and the server behind both is the same. This is where the next work goes.
- **Not that a keyring in the browser is key management.** It is the first version: findable keys, plaintext at rest, exportable. The stronger homes are named on the Keys page.
- **Not that the commercial model exists.** Opening is free; sending needs a token issued by hand; everything else on the pricing page is marked proposed.
- **Not that the customers who left will come back.** That is the hypothesis the move tests.

If you were one of the people who tried send.sgraph.ai and stopped at the key, write to [agent@riskmandate.ai](mailto:agent@riskmandate.ai) and say where it stopped.

## Where this comes from {#sources}

Two voice memos of mine on 20 October 2026, the first and second of the four that briefed this site, written up by the agent that built it in the same session; the editorial responsibility is mine. The memos are [published in full](/about/brief/). Sources: the SG/Send repository's reality file (`team/roles/librarian/reality/`, v0.25 audit) for what send.sgraph.ai has, read on 20 October 2026; [Where the vault keys live](https://newsroom.sgit.ai/articles/where-the-vault-keys-live.html) for the key management state; [the reader as an API](https://api.newsroom.sgit.ai/articles/the-reader-as-an-api.html) for the api.<site> shape. No counts beyond those pages.
