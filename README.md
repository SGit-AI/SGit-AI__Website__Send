# SGit-AI__Website__Send

The repository for [send.sgit.ai](https://send.sgit.ai): send a file to anyone, encrypted in the browser before it
leaves, the server never seeing the file, its name or the key; hand over the link as a QR code or a friendly token; or
keep the files in a vault you can open again, update, share read-only and clone with sgit; and keep every key in a
keyring on the device. It grew from [send.sgraph.ai](https://send.sgraph.ai) and keeps its formats. Current version v0.1.0.

- **The app** is five pages, `/`, `/open/`, `/vaults/`, `/keys/`, `/settings/`, as small ES modules in
  `website/assets/app/` with no framework. They run one pinned release of
  [api.send.sgit.ai](https://api.send.sgit.ai), named in [`tools/api.json`](tools/api.json) with its manifest copied
  beside it; the gate refuses any other reference.
- **The content** is markdown in `website/pages/` with front matter; `www/` is what `python3 tools/build.py` writes and
  is committed; every page has a markdown twin and a place in `/llms.txt`.
- **What is real:** [`website/data/features.json`](website/data/features.json), rendered at `/about/reality/`. If it
  is not listed there, it does not exist.
- **The brief, in full:** [`briefs/`](briefs/), the four voice memos of 20 October 2026, with
  [`BRIEF-CORRECTIONS.md`](BRIEF-CORRECTIONS.md) beside them.
- **The articles:** `/articles/`, in the newsroom's format, including the guidance page for every site's own articles.

## Working on it

```
python3 tools/build.py                 # write www/ from website/
python3 tools/check.py                 # the gate: what CI runs
node tests/test_app.mjs                # the app in Chromium, against ../SGit-AI__Website__Send__API (or SEND_API=<path>) and the API in memory
python3 -m http.server -d www 8000     # serve the built site; in Settings choose "a server on this machine" for the API
```

Every change that lands on `dev` is a version (`tools/version.json`); the deploy tags it, publishes `www/`, and then
polls the live site for the version. Code Apache-2.0 (see [LICENSE](LICENSE)); content CC BY 4.0.
