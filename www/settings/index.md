# Settings

> Which SG/Send server this browser talks to, the access token for it, and which copy of the API the pages load. All of it stays in this browser.

*Source: <https://send.sgit.ai/settings/> · send.sgit.ai v0.1.1 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# Settings

The server

The SG/Send API host that stores ciphertext. The hosted one is `send.sgraph.ai`; [you can run your own](https://sgit.ai/deploy/), or [one on this machine](/use/#local) for trying things out.

Host

Access token for that server

Sent as a request header to that host only, never in a URL, kept in [your keys](/keys/). This is the beta gate: [how to get one](/use/pricing/).

Save and check

## The code these pages run

  Pinned releaseLoaded

Load the API from another copy (this browser only)

For developers: a local checkout of [api.send.sgit.ai](https://api.send.sgit.ai) served at a URL ending in the release directory, for example `http://localhost:8788/v0.1.1`. Other readers are not affected.
