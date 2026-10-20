---
title: Vaults and keys
description: What a vault is, the one secret and the keys derived from it, which may be shared and which never, where each kind of key should live, and what to do when one is lost.
---

# Vaults and keys

*As storyboards: [A folder that remembers](/storyboards/a-folder-that-remembers/) and [Where the keys live](/storyboards/where-the-keys-live/).*

## What a vault is

A vault is a folder of files, encrypted in your browser, versioned like git: every change is a commit, the history is kept, two devices can work on it and merge, and a laptop can `sgit clone` it. send.sgraph.ai had transfers; what it did not have, and what stopped people, was a place to keep the vault keys and a way to put files into vaults from the page. This site has both.

## One secret, and the keys derived from it

| Key | What it carries | Looks like | May be shared |
|---|---|---|---|
| **The vault key** | read and write | `sgit_private_vault_<passphrase>:<vault id>` | **never**: not in a link, a page, a chat, a repository |
| **The read key** | read only, every file, every version | `sgit_public_read_<64 hex>:<vault id>` | yes: this is what a share link carries |
| **The write key** | what the server checks before accepting a push | never shown; derived from the passphrase, sent as a header, stored as a hash | no |

The read key is derived from the vault key one way, so a read key can never be turned back into write access. The vault id after the colon is the address, and it is public. [sgit.ai's credentials page](https://sgit.ai/docs/credentials.html) has the prefixes and why the word in them matters.

## Where each kind of key should live

| Key | Today, on this site | The better home |
|---|---|---|
| Vault keys | [Keys](/keys/), plaintext, per device; export to move | a password manager; [secrets.sgit.ai](https://secrets.sgit.ai)'s passkey-unlocked keyring when it ships; a registry vault fed over an append lane, as [sgit.ai's key management page](https://sgit.ai/docs/key-management.html) describes |
| Read keys | Keys, and in the links you hand out | anywhere; they are publishable |
| Transfer keys | Keys, with the delete secret | the same; they expire with the transfer |
| Access tokens | Keys, per server | a password manager |

## When a key is lost

There is no reset. A vault whose vault key is lost cannot be written to again; if a read key survives it can still be read and cloned, and its contents copied into a new vault. A transfer whose key is lost is gone. This is the price of the server never holding a key, and it is why the keyring exists: a key that is written down somewhere is a key that is not lost.

## When a key leaks

A read key that leaks means the vault's contents are as public as wherever it went; revocation is not retroactive, because anyone who fetched the objects keeps them. A vault key that leaks means rotating: make a new vault, copy the files, re-share the new read key, and stop using the old one. [Keys](/keys/) can revoke a transfer, which deletes it on the server, if the transfer was sent from this device.

## sgit, on a laptop

```
pip install sgit-ai
sgit clone sgit_public_read_…:vaultid        # read-only, every file and every commit
sgit clone sgit_private_vault_…:vaultid      # read and write
sgit commit "added the report" && sgit push  # then open it here again: the browser and the CLI are two clones of one vault
```

[sgit.ai](https://sgit.ai) is the documentation for the CLI and the vault format.
