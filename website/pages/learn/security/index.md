---
title: Security, what the server sees
description: What the server can see, what it cannot, the two secrets that must not be confused, what a friendly token costs, and what this site does not claim.
---

# Security: what the server sees, and what it cannot

## The server

| It can see | It cannot see |
|---|---|
| The ciphertext, and its size (the plaintext plus 28 bytes for a transfer) | The plaintext |
| When it was uploaded, and how many times it was downloaded | The file name: it is inside the ciphertext |
| A hash of the sender's IP, salted daily | The decryption key: it is in the link's fragment |
| The `content_type_hint` the sender chose | The vault key or the passphrase; it stores a hash of the write key and compares |
| Your access token, hashed, to decide whether you may upload | Who you sent the link to |

The server is a capability-checked ciphertext store: every access decision it makes is a hash comparison, and it never holds a raw key. A full compromise of it yields ciphertext and hashes. That property is the whole product rather than a feature of it, and [sgit.ai's security page](https://sgit.ai/security/) covers it from the server's side.

## This site

This site is static files on GitHub Pages: it has no way to receive a request body. The code the pages run comes from [api.send.sgit.ai](https://api.send.sgit.ai), pinned to one release whose every file is hashed in [the manifest](https://api.send.sgit.ai/v0.1.0/manifest.json) and checked by this repository's gate. No script, style or font is loaded from any other origin. Nothing is stored except what you can see on [Keys](/keys/) and the theme you picked.

## Two secrets that must not be confused

The **access token** says who may upload. It goes in a request header to the server you chose and nowhere else: never a URL, never a log. The **decryption key** says who may read. It goes in the link after `#` or by a second channel, and never reaches any server. They are unrelated values. Confusing them does not throw an error, which is why it is the first thing on [the quick start](https://api.send.sgit.ai/start/).

## What a friendly token costs

A friendly token is two words from a list of 320 and four digits: 1,024,000,000 possibilities. Anyone holding the ciphertext can try them offline, at 600,000 PBKDF2 rounds each. That is a real cost, and it is not the cost of a random 256-bit key. A friendly token is for a link that expires and a file that is not worth that effort; a random key is for the rest. The send page says which you chose.

## The keyring

The keyring on [Keys](/keys/) is plaintext in your browser's storage. It makes the keys findable, which is what was missing before; it does not make them safe from someone with your device. Export it to a password manager for the keys that matter. [Vaults and keys](/learn/vaults-and-keys/) says where each kind of key should live.

## What this site does not claim

- **Not proved against the hosted server yet.** The formats match send.sgraph.ai's published contracts and the code is tested against an in-memory implementation of its API; a round trip against `send.sgraph.ai` itself is marked proposed in [the reality file](/about/reality/) until it is recorded.
- **Not audited.** The crypto is the browser's Web Crypto API, used the same way send.sgraph.ai has since its first version; nobody outside the project has reviewed this site's use of it.
- **Not metadata-free.** Sizes, timing and counts are visible to the server, and the link is as private as the channel it travels by.
- **A beta.** Do not upload confidential or illegal content.
