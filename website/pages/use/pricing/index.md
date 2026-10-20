---
title: The commercial model
description: How using this site and its capabilities is meant to be paid for, what is true today (a beta behind access tokens), what is proposed, and what will never be charged for.
---

# The commercial model

The brief for this site [says it plainly](/about/brief/#memo-02): the point is a full usage-based commercial model for using the site and its capabilities. This page is that model, with the status of every part marked, because most of it is not built yet.

## Today, counted {#today}

| | Status |
|---|---|
| **Opening a link** is free, needs no account and no token, and always will. The key is the gate | shipped |
| **Sending** needs an access token, issued by hand during the beta. A token has a use limit and can be revoked | shipped (the gate exists on the server; tokens are made by a person) |
| **How to get a token:** write to the address at the bottom of this page with what you want to send and how often | shipped, by email |
| **Running your own server** with the open-source SG/Send API, and pointing [Settings](/settings/) at it: no token from us, no bill from us | shipped |
| **Embedding the code** from api.send.sgit.ai in your own site: free, Apache-2.0 | shipped |

## Proposed {#proposed}

Each row is described in a brief and has no code behind it on this site. The reality file lists them as proposed; nothing here is a promise.

| Idea | Shape |
|---|---|
| **Self-service tokens** | pay for an allowance of uploads or bytes, get a token in the browser, keep it in [Keys](/keys/) |
| **Usage meter on the page** | the token's remaining uses shown on the send page, as the API already reports them |
| **Vault hosting** | a vault above a size or an age carries a cost, paid by its owner, with the read key free to everyone who holds it |
| **Organisations** | a token per team with its own servers or its own bucket, under their own keys |
| **A reading meter for shared content** | the newsroom's [SG Meter](https://api.newsroom.sgit.ai) pattern applied to a vault page: pay by how far you read, in the browser |

## What will not be charged for {#never}

- Opening a link, ever. The recipient did not choose this site.
- Reading a vault with its read key, or cloning it with sgit.
- Exporting your keys, or leaving: there is no account to close and nothing of yours on this site.
- The code: api.send.sgit.ai is open source and stays so.

## How to get an access token today

Write to [agent@riskmandate.ai](mailto:agent@riskmandate.ai) with what you want to send and how often. During the beta tokens are issued by hand and use-limited; a token is tied to a server, kept in your browser, and sent only in a request header to that server.
