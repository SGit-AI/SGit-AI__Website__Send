# Embed it in your site

> Put a send box, an open page, or a QR hand-over on your own site by pinning the same release this site runs; what to pin, what to check, what stays on your origin.

*Source: <https://send.sgit.ai/use/embed/> · send.sgit.ai v0.1.0 · this file is generated from the same content as the page, so the two cannot drift. Every page on this site has a `.md` twin; internal links below point at pages, swap `.html` for `.md` to read the twin.*

---

# Embed it in your site

The code this site runs is not this site's. It is [api.send.sgit.ai](https://api.send.sgit.ai) v0.1.0, and any page on any origin can import it the same way:

```html
<script type="module">
  import * as send from 'https://api.send.sgit.ai/v0.1.0/send/send-api.js'
</script>
```

A script loaded from that host runs on **your** page's origin, so the keyring, the clone branch and everything the modules store stay in your site's storage; the API host has no way to receive anything. The three things to get right:

1. **Pin the release** in one file and copy its [manifest](https://api.send.sgit.ai/v0.1.0/manifest.json) beside it; make your build refuse a reference to the host that is not that release. This site does it in `tools/api.json` and `tools/check.py`.
2. **Keep the access token out of the page.** It belongs to whoever uploads, in their browser, pasted once into something like [Settings](/settings/). A token in page source is a token everyone has.
3. **Build the link on your open page.** `send.link.transferLink({ openUrl: 'https://your.site/open/', ... })`, and parse it there with `send.link.parseFragment(location.hash)`. Or point at `https://send.sgit.ai/open/`, which opens anything made with these formats.

This site's own app modules (`assets/app/send.js`, `open.js`, `vaults.js`, `keys.js`, `settings.js`) are small, plain ES modules with no framework; copy the ones you want from [the repository](https://github.com/SGit-AI/SGit-AI__Website__Send) and keep the import of the pinned release. [For developers](https://api.send.sgit.ai/for-developers/) on the API's site has the per-module notes and what runs in Node.
