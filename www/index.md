# send.sgit.ai, send a file, keep the key

> Send a file to anyone, encrypted in your browser before it leaves. The server never sees the file, its name or the key. Hand over the link as a QR code, or keep the files in a vault you can open again, update, and clone with sgit.

*Source: <https://send.sgit.ai/> · send.sgit.ai v0.1.1 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# Send a file. Keep the key.

The file is encrypted here, in your browser, with its name inside the ciphertext. The server gets bytes it cannot read. You get a link, a QR code, or a token you can say aloud; whoever has it gets the file, and nobody else does, the server included.

**Beta:** uploading needs an access token. [Set one in Settings](/settings/), or [read how to get one](/use/pricing/). Opening a link needs nothing.

    Drop a file here, or click to choose
    Encrypted in this browser before upload · under 4 MB for a one-off transfer · any size into a vault

Several files go into a vault, as one commit.

Where it lives

 One transfer: uploaded once, handed over once, expires

 Into a vault: versioned, updatable, clonable with sgit

Expires

      in 1 dayin 7 daysin 30 daysnever

Downloads

      unlimitedoncefive times

Which vault

Name for the new vault

How to hand it over

 A link with the key in it (and a QR code)

 A friendly token you can say aloud, river-cloud-3847

 A link, with the key sent separately

For a vault the link carries the read key; the vault key stays on this device.

Encrypt and send to the server set in [Settings](/settings/)

## What happens, in one table

StepWhereWhat the server gets

The name goes inside an envelope in front of the filethis browsernothing

The whole thing is encrypted with AES-256-GCM under a fresh keythis browsernothing

The ciphertext is uploaded as one transfer, or committed into a vaultthe server you choseciphertext, its size, a hashed sender IP, a content type hint you choose

The link is built with the key after the `#`this browsernothing: browsers never send the fragment

The link is drawn as a QR codethis browsernothing

[How it works](/learn/) · [What the server sees](/learn/security/) · [Vaults and keys](/learn/vaults-and-keys/) · the code this page runs is [api.send.sgit.ai v0.1.1](https://api.send.sgit.ai/v0.1.1/README.md), pinned.
