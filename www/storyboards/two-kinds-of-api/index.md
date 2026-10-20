*Source: <https://send.sgit.ai/storyboards/two-kinds-of-api/> · send.sgit.ai v0.1.4 · generated from the same data as the page, so the two cannot drift.*

# Two kinds of API

> The code a page runs is a release that never changes; the server it talks to is a deployment. Inês pins one and runs the other. 8 panels.

*Send, as storyboards · Under the hood · board 06 · built · send.build, 20 October 2026. The script of a storyboard drawn by the kit at api.storyboards.sgit.ai; the data is storyboard.json and bundle.json beside this file.*

- [api.send.sgit.ai](https://api.send.sgit.ai/)
- [The article](/articles/two-kinds-of-api.html)

## 1. Two kinds of API (cover)
*Files a page runs, and a server it talks to.*
- Inês, point, determined
- The Server, stand, calm

Note: The contradiction Dinis found after the first deploy, and the rule that came out of it.
Source: articles/two-kinds-of-api.md

## 2. Which release?
- **Inês** (think, thinking): "Which release is this page running?"
- prop: laptop
- prop: board, import * as send from / 'https://api.send.sgit.ai/ /   v0.1.1/send/send-api.js'

Note: A page names one release by its full address and copies its manifest.
Source: use/embed/index.md

## 3. A release is a folder that never changes
- Inês, point, happy
- prop: board, /v0.1.0/   36 files, every hash listed / /v0.1.1/   one fix, a whole copy / a change is the next folder, / never an edit of this one

Note: Every minor release is a complete, independent copy; the gate fails a hash that moved.
Source: learn/from-sgraph/index.md

## 4. The server is a deployment
- **Inês** (point, determined): "Same contract, any host."
- prop: server, send.sgraph.ai
- prop: sign, dev.send.sgraph.ai
- prop: sign, localhost:8787

Note: One HTTP contract, many deployments; the page names the one it talks to as an endpoint.
Source: settings/index.html

## 5. Her own server
- **Inês** (point, happy): "Mine. On my laptop. Nothing leaves it."
- prop: terminal, $ node tests/server.mjs 8787 local-dev-token / in-memory SG/Send API at / http://localhost:8787

Note: The in-memory server in every API release: the same routes, for tests and for a laptop.
Source: use/index.md

## 6. The rule
- Inês, stand, happy
- prop: board, api.<site>.sgit.ai      files a page runs / <service>.api.sgit.ai   a server / dev.vault.api.sgit.ai   environment leftmost

Note: The order of the labels does the work; one sentence to explain.
Source: articles/two-kinds-of-api.md

## 7. Contract versus deployment (evidence)
> The distinction is contract versus deployment, not JavaScript versus Python.
> (articles/two-kinds-of-api.md)
- Inês, point, determined

Note: Quoted from the article, word for word.
Source: articles/two-kinds-of-api.md

## 8. Pin the files. Name the server. Never confuse the two. (punchline)
**Pin the files. Name the server. Never confuse the two.**
- Inês, wave, happy
- The Server, stand, calm

Note: Decided on 20 October 2026; not yet deployed as new hosts.
Source: articles/two-kinds-of-api.md
