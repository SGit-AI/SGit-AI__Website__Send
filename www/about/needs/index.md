# What needs a human

> The steps only the project lead can take for this site to be live and for the proposed rows to move, in order, with what each unblocks.

*Source: <https://send.sgit.ai/about/needs/> · send.sgit.ai v0.1.1 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# What needs a human

1. **Merge the branch to `dev`** in both repositories. The deploy workflow runs on `dev`; the branch `claude/wonderful-ride-c8qicn` carries v0.1.1 of both. Then keep `ref` in `tests/api.json` at `dev`, so the browser test checks out the merged API.
2. **api.send.sgit.ai first:** done. The host is live and this site loads its code from it; the live check after each deploy confirms it.
3. **Enable GitHub Pages for this repository** with the source set to GitHub Actions, and a `CNAME` record for `send.sgit.ai` pointing at `sgit-ai.github.io`.
4. **CORS on the hosted server:** done. Measured on 20 October 2026 after the first deploy: `send.sgraph.ai` allows requests from this origin with every header the release sends.
5. **A round trip against the hosted server** with an access token, to move interoperability from proposed to shipped in both reality files.
6. **The articles.** [Every site its own articles](/articles/every-site-its-own-articles.html) is written as the centralised guidance page the fourth memo asks for, in the newsroom's format; publishing it on newsroom.sgit.ai and linking it from sgit.ai's guidance needs those repositories.
7. **The commercial model.** Everything under proposed on [/use/pricing/](/use/pricing/) is a decision before it is code.
