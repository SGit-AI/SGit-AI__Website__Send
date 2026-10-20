*Source: <https://send.sgit.ai/storyboards/a-folder-that-remembers/> · send.sgit.ai v0.1.4 · generated from the same data as the page, so the two cannot drift.*

# A folder that remembers

> Ravi gets a new version every week; Maya puts the files in a vault, shares the read key once, and every version stays. 9 panels.

*Send, as storyboards · For everyone · board 03 · built · send.build, 20 October 2026. The script of a storyboard drawn by the kit at api.storyboards.sgit.ai; the data is storyboard.json and bundle.json beside this file.*

- [Vaults](/vaults/)

## 1. A folder that remembers (cover)
*Files in a vault: versioned, updatable, shared once.*
- Maya, point, happy
- Ravi, think, thinking
- The Server, stand, calm

Note: The second thing the brief asked for: files kept in vaults, not one-shot transfers.
Source: learn/vaults-and-keys/index.md

## 2. Which one is current?
- **Ravi** (think, worried): "Every week a new link. Which one is current?"
- prop: board, report-v1.pdf / report-v2.pdf / report-v2-final.pdf / report-v2-final-FINAL.pdf

Note: The problem a transfer cannot solve: there is no second version of a transfer.
Source: vaults/index.html

## 3. Into a vault instead
- **Maya** (point, determined): "Into a vault. One place, every version."
- prop: vault, Project Q4

Note: A vault is a folder of files, encrypted here, versioned like git.
Source: learn/vaults-and-keys/index.md

## 4. Every change is a commit
- Maya, stand, happy
- prop: record, the history

Note: Each write is one commit with a message; two devices merge with compare-and-swap.
Source: learn/vaults-and-keys/index.md

## 5. Two keys
- **Maya** (point, happy): "The read key is the one I share."
- prop: key, vault key: read and write
- prop: key, read key: read only

Note: The read key is derived one way from the vault key; it can never become write access.
Source: learn/vaults-and-keys/index.md

## 6. Ravi always sees the latest
- **Ravi** (arms-up, happy): "Same link. New version."
- prop: phoneqr, send.sgit.ai/open/#sgit_public_read_…
- prop: mark, 4 files, 4 commits

Note: The read-key link opens every file and every version, read only.
Source: open/index.html

## 7. And on a laptop
- **Ravi** (point, thinking): "My laptop too?"
- prop: terminal, $ sgit clone sgit_public_read_…:q4 / cloning… 4 files, 4 commits / $ ls / report.pdf  photos/

Note: The browser and the CLI are two clones of one vault.
Source: learn/vaults-and-keys/index.md

## 8. Why the read key can be shared (evidence)
> The read key is derived from the vault key one way, so a read key can never be turned back into write access.
> (learn/vaults-and-keys/index.md)
- Maya, point, happy

Note: Quoted from the vaults and keys page, word for word.
Source: learn/vaults-and-keys/index.md

## 9. Share the read key once. Keep the vault key. Every version stays. (punchline)
**Share the read key once. Keep the vault key. Every version stays.**
- Maya, wave, happy
- Ravi, arms-up, happy
- The Server, stand, calm

Note: Create, add, publish, open by read key: driven by the browser test.
Source: tests/test_app.mjs
