# Version history

> One line per version, newest first, saying what changed and why. Every change that lands on dev is a version; the deploy tags it.

*Source: <https://send.sgit.ai/versions/> · send.sgit.ai v0.1.2 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# Version history

Every change that lands on `dev` is a version, in `tools/version.json`, tagged by the deploy and shown in the header of every page. The code the app runs has [a history of its own](https://api.send.sgit.ai/versions/).

| Version | Date | Kind | What changed, and why |
|---|---|---|---|
| **v0.1.2** | 2026-10-20 | fix | **the pin check leaves articles alone.** v0.1.1 landed with the gate red on one line: the agent's article about the first release names the v0.1.0 address it was written against, and the pin check read that as an unpinned reference. An article is the record of its day, so the check now skips /articles/; nothing a page runs changed. Recorded here rather than hidden, as the release discipline asks. |
| **v0.1.1** | 2026-10-20 | fix | **the site pins api.send.sgit.ai v0.1.1, whose health check asks the route the hosted service serves.** After the first deploy, Settings reported send.sgraph.ai as not answering: the v0.1.0 release asked /api/health, which the hosted service does not serve (its route is /api/info/health). The API's v0.1.1 fixes that; this version changes the pin and copies its manifest, and nothing else on the site. The same run measured that send.sgraph.ai allows requests from this origin with every header the release sends. |
| **v0.1.0** | 2026-10-20 | release | **the first version of send.sgit.ai: send, open, vaults, keys and settings on the pinned API, with the explanations, the examples, the commercial model and three articles.** From the four voice memos of 20 October 2026, published in full with their corrections. The app runs api.send.sgit.ai v0.1.0, pinned with its manifest: a file sent as a transfer or into a vault, a link, a friendly token or a QR code to hand over, an open page for any of them, vaults created and shared read-only, and a keyring on the device. An end-to-end browser test drives all of it against the in-memory server. What is not built is listed as proposed in the reality file, including the round trip against the hosted send.sgraph.ai. |
