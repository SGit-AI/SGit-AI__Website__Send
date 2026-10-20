*Source: <https://send.sgit.ai/storyboards/an-agent-hands-over/> · send.sgit.ai v0.1.4 · generated from the same data as the page, so the two cannot drift.*

# An agent hands over

> Pip finishes a job, sends the result once with an expiry, keeps the work in a vault, and never logs a key. 9 panels.

*Send, as storyboards · Under the hood · board 07 · built · send.build, 20 October 2026. The script of a storyboard drawn by the kit at api.storyboards.sgit.ai; the data is storyboard.json and bundle.json beside this file.*

- [For agents](/use/agents/)
- [The Python example](/use/)

## 1. An agent hands over (cover)
*Once by transfer. Repeatedly in a vault. Never a key in a transcript.*
- Pip, wave, happy
- Maya, stand, happy
- The Server, stand, calm

Note: The agentic workflow the brief named as one of the reasons to move.
Source: use/agents/index.md

## 2. Job done
- **Pip** (wave, happy): "Report ready. Three files."
- prop: terminal, $ python3 run.py / job done: 3 files, 1.2 MB / report.md  data.csv  manifest.json

Note: A session agent at the end of a job, with a result and nobody to hand it to.
Source: use/agents/index.md

## 3. The token from the environment, in a header
- **Pip** (point, determined): "From the environment. Into a header. Nowhere else."
- prop: key, SGRAPH_ACCESS_TOKEN
- prop: board, x-sgraph-access-token: **** / never a URL, never a log

Note: The access token authorises the upload and must not land in a query string or a transcript.
Source: use/agents/index.md

## 4. One transfer, time-bound
- Pip, stand, happy
- prop: calendar, expires in 7 days
- prop: board, max_downloads: 0 / a retry is not a reader

Note: For a link another agent will open: a time bound rather than a download cap.
Source: use/agents/index.md

## 5. The link, and nothing else, in the reply
- **Pip** (wave, happy): "Here is the link. The key is in it. I logged neither."
- Maya, stand, happy
- prop: arrow, send.sgit.ai/open/#id/key

Note: The decryption key lives in the link and nowhere else: not in node output, not in a result that is kept.
Source: use/agents/index.md

## 6. The work stays in a vault
- **Pip** (point, determined): "Commit, push, hand over the read key."
- prop: vault, job-2026-10-20
- prop: key, read key, to Maya

Note: The thing that is read repeatedly goes in a vault; the read key is what travels.
Source: learn/vaults-and-keys/index.md

## 7. A bundle a reader can use
- Pip, stand, happy
- prop: record, the bundle

Note: A manifest and an llms.txt cost nothing and are the difference between a payload that can be used and one that has to be opened by a person first.
Source: use/agents/index.md

## 8. The key, in one place (evidence)
> The decryption key is in the link, and nowhere else.
> (use/agents/index.md)
- Pip, point, determined

Note: Quoted from the agents page, word for word.
Source: use/agents/index.md

## 9. Hand over once by transfer. Work repeatedly in a vault. Never paste a key. (punchline)
**Hand over once by transfer. Work repeatedly in a vault. Never paste a key.**
- Pip, wave, happy
- Maya, arms-up, happy
- The Server, stand, calm

Note: The Python example on the use page is the whole hand-over in forty lines.
Source: use/index.md
