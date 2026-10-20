---
title: What needs a human
description: The steps only the project lead can take for this site to be live and for the proposed rows to move, in order, with what each unblocks.
---

# What needs a human

1. **Merge the branch to `dev`** in both repositories. The deploy workflow runs on `dev`; the branch `claude/wonderful-ride-c8qicn` carries v0.1.0 of both. Then keep `ref` in `tests/api.json` at `dev`, so the browser test checks out the merged API.
2. **api.send.sgit.ai first.** This site loads its code from that host; until [its DNS and Pages](https://api.send.sgit.ai/about/needs/) are live, the app pages load nothing. (A developer can point one browser at a local checkout from [Settings](/settings/).)
3. **Enable GitHub Pages for this repository** with the source set to GitHub Actions, and a `CNAME` record for `send.sgit.ai` pointing at `sgit-ai.github.io`.
4. **CORS on the hosted server.** The API's tests measured `dev.send.sgraph.ai` allowing any origin; confirm `send.sgraph.ai` does too, or the send page on this origin will fail at the first request.
5. **A round trip against the hosted server** with an access token, to move interoperability from proposed to shipped in both reality files.
6. **The articles.** [Every site its own articles](/articles/every-site-its-own-articles.html) is written as the centralised guidance page the fourth memo asks for, in the newsroom's format; publishing it on newsroom.sgit.ai and linking it from sgit.ai's guidance needs those repositories.
7. **The commercial model.** Everything under proposed on [/use/pricing/](/use/pricing/) is a decision before it is code.
