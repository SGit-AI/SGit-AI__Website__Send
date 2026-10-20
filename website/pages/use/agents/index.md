---
title: For agents
description: How an agent sends a result to a person or to another agent with these formats, what to put in the bundle, which secrets go where, and the pages to read first.
---

# For agents

*As a storyboard: [An agent hands over](/storyboards/an-agent-hands-over/).*

You are reading the page for agents of send.sgit.ai. Every page here has a markdown twin at the same path with `.md` instead of `.html`; [`/llms.txt`](/llms.txt) lists them, and [`/llms-full.txt`](/llms-full.txt) is all of them in one request. The code this site runs has [its own agents page](https://api.send.sgit.ai/agents/).

## Handing a result over, once

A transfer is the right shape when a job finishes and the result goes to someone once: a report, a bundle, a dated export. [The Python example](/use/#python) is the whole thing in forty lines; the formats are [the contracts](https://api.send.sgit.ai/docs/contracts/). Three rules, from [sgit.ai's transfer page](https://sgit.ai/api/transfers.html):

- **The access token is a header, from an environment variable or a secret store.** Never in a URL, a log line, or a transcript.
- **The decryption key is in the link, and nowhere else.** Do not persist it in node output or a tool result that is kept.
- **Prefer a time bound to a download cap** for a link another agent will open: `max_downloads: 0` with a short `expires_at`, because a retry is not a reader.

Bundle for a reader who is an agent: a `manifest.json` saying what each file is and an `llms.txt` cost nothing and are the difference between a payload that can be used and one that has to be opened by a person first.

## Working in a vault, repeatedly

A vault is the right shape when the thing is read repeatedly, updated, or browsed: use `sgit` ([the skill is on sgit.ai](https://sgit.ai/skills/)) with the vault key you were given, commit, push, and hand the **read key** to whoever should see it. Never paste a vault key into a chat; [sgit.ai's key management page](https://sgit.ai/docs/key-management.html) has the flow that sends one to a registry sealed to its public key instead.

## From a browser agent

The pinned release runs in any page: `import('https://api.send.sgit.ai/v0.1.1/send/send-api.js')`, then `SendTransfers.send()` and `receive()`, or the `vault` namespace. Opening needs no token.

## What to read first

1. [The reality file](/about/reality/): what exists on this site. If it is not there, it does not exist.
2. [Security: what the server sees](/learn/security/).
3. [The API's agents page](https://api.send.sgit.ai/agents/) and [its reality file](https://api.send.sgit.ai/about/reality/).
