---
title: Every site its own articles: the guidance, in one place, for the agents that write what they delivered and the memos that become articles
date: 2026-10-20
author: Dinis Cruz
author_url: https://sgit.ai/about/
summary: A lot of the websites we now create need their own articles, because the pattern I am using works. It has two halves. Agents write, in detail, what they just delivered, with the commits and the tests to check it against. And my voice memos become articles too, each one focused on the particular dimension that site is about, whether that is sgit, PKI, the Gen Z book, or Send. It started on sgit.ai, moved to the newsroom, and now it is on most of the sites, which means I find myself telling the same story over and over to each agent doing it. This is the centralised page I can point them at instead: what an articles section on a site is, the two kinds of author and how each is marked, the shape of an article so it can be imported into the newsroom unchanged, the rules that were each a correction once, and the prompt that starts one. It is written as a brief, so the newsroom can publish it and sgit.ai's guidance can import it, and so the next site gets it for free.
version: v0.1.0
license: https://creativecommons.org/licenses/by/4.0/
tags: [articles, sgit-ai-sites, agents, voice-memos, newsroom, guidance, brief, writing, article]
status: published
---

!shot every-site-its-own-articles.svg | /articles/images/ | How an articles section fills on a site. From the left, a voice memo of mine on that site's dimension, written up by the agent in my voice under my name. From the right, the agent's own account of what it delivered, under its own name, with the commits and tests to check. Both land in the site's /articles/ in the newsroom's format, so either can be imported into newsroom.sgit.ai unchanged, and sgit.ai's guidance points at this page rather than restating it. | diagram

## In short {#in-short}

- **Every `*.sgit.ai` site carries its own `/articles/`.** Not a blog: the record of what was asked and what was built, on that site's own dimension, kept where the thing it describes lives.
- **Two kinds of author, marked.** A memo of mine, written up in my voice under my name; or an agent writing what it delivered, in its own voice under its own name. Never one claimed as the other.
- **One format, the newsroom's.** Front matter, a lead figure, In short, the argument in sections with anchors, what it does not claim, where it comes from. An article in that shape imports into newsroom.sgit.ai unchanged.
- **The rules were each a correction once.** No em-dashes, British spelling, a number counted not remembered, a status on every claim, no absolute the evidence does not carry.
- **The memo's order is kept.** The article follows the path the thinking took, including the turn that looks like a tangent.
- **This page is the brief.** It is written so the newsroom can publish it and sgit.ai's guidance can import it; the next site that needs the story gets this link instead of a retelling.

## Why every site now needs this {#why}

It started on sgit.ai: the site had a section where the agents wrote up each release. Then the newsroom took that over and made it its own thing, with the voice, the shape and the build to go with it. Then PKI got articles, and the Gen Z developers book, and now Send, each on its own dimension. The pattern is effective for a reason that is easy to miss: the articles are not marketing, they are the record. When an agent delivers something, the article is where it says what it did, what it did not do, and what it does not prove, with the commits to check. When I record a memo about where a site should go, the article is where that thinking is kept, in my voice, on the page that will be built from it.

The cost of it spreading is that I found myself telling the same story over and over again to each agent doing it: the voice, the shape, the front matter, what counts as a source. So this is the centralised place. It is on send.sgit.ai because that is where it was written, and it is in the newsroom's format so the newsroom can take it and sgit.ai's guidance can point at it from the page that lists [what every repository carries](https://sgit.ai/docs/guidance/repositories.html).

## What an articles section is {#what}

A folder, `/articles/`, on the site, with an index generated from the articles' own front matter, a markdown twin beside every article, and each article listed in the site's `llms.txt`. The articles are about that site's dimension and nothing else: send.sgit.ai's are about sending files and keeping keys; pki.sgit.ai's are about keys and identity; the Gen Z book's are about the book. A general argument goes to the newsroom and is linked from the site; a site-specific one lives on the site and may be imported by the newsroom. **Content exists once**, and the site is where it is right.

An article has a slug that never changes once published, because the address is the contract. A retitle keeps the slug. A correction is a new version of the same article, with the change said in the release notes, never a silent edit.

## Two kinds of author {#authors}

| Author | Front matter | What it is |
|---|---|---|
| **Me, through an agent** | `author: Dinis Cruz`, `author_url: https://sgit.ai/about/` | A voice memo or a message of mine, written up by the agent in my voice. *I* is me. The editorial responsibility is mine. The sources end with who wrote it up |
| **An agent, in its own voice** | `author: <site>.<role>`, `author_url:` the agent's page on the site | The agent writing about work it did, in the first person as the agent, with the commits and the tests to check against. The editorial responsibility is still mine |

Never claim I did something an agent did, or the reverse. *We* is me and the agents, only where we did the thing together. No model names in the text; the agent's page carries the model, the article does not.

## The shape {#shape}

The newsroom's, exactly, so that the file moves without change. The anchors `{#in-short}`, `{#limits}` and `{#sources}` are read by its build.

```
---
title: <hook>: <the argument in one line>
date: YYYY-MM-DD
author: Dinis Cruz                      # or <site>.<role>
author_url: https://sgit.ai/about/      # or the agent's page
summary: <220 to 360 words, first person, the whole argument with its numbers>
version: vX.Y.Z                         # the site release that publishes it
license: https://creativecommons.org/licenses/by/4.0/
tags: [<ten or so, kebab-case, the last one "article">]
status: published
---

!shot <name>.svg | /articles/images/ | <the figure described in full, as sentences> | diagram

## In short {#in-short}
- **<the claim, in bold, as a sentence.>** <the number or the reason.>   (six to ten)

## <the argument, in sections with short anchors>

## What this does not claim {#limits}
- **<a limit.>** <why, and what would change it.>   (five to nine)

If you <are in the reader's position>, write to agent@riskmandate.ai.

## Where this comes from {#sources}
<the origin; the responsibility line; every source, linked and dated; what the counts were made from>
```

The title is the hook, a colon, and the argument: a sentence a reader could quote as the point. The summary is the abstract and the social post, written so a reader who stops there has the article. The lead figure comes first, with a caption that stands on its own for a reader who cannot see it. In short opens with the finding and closes with what was built or proposed. The sources name every count's origin.

## The rules, each a correction once {#rules}

1. **No em-dashes.** A comma, a colon, a semicolon or a full stop does the job. The build fails on one.
2. **British English**, and they/them for anyone whose pronouns you do not know.
3. **A number is counted, not remembered**, by a script the article can name. Say at the end what counted it.
4. **A status on every claim**: shipped, proposed, absent, reconstructed. Nothing in the present tense that the reality file does not list.
5. **No absolutes the evidence does not carry**: not "nobody has", "the first to", "never scaled". If it is true, show the count; if it is a feeling, say whose.
6. **No superlative self-claims**, and no praise for the work. "Great" is the strongest word, and it is for a thing.
7. **The memo's order is kept.** Weave the topics into one argument with a beginning and an end; do not reorganise them into someone else's outline.
8. **Wishes, not demands.** When a memo says "I want", write what I would say: "I would like", "the plan is", "what I have in mind".
9. **Name people**, not "the owner". When an agent writes about who asked or decided, it says who.
10. **A quote is word for word**, with its date; quote less and exactly.
11. **Plain words for concrete things**: the file, the commit, the button, the lane, the key. Reach for the abstractions the corpus already has and link each the first time.

## Figures {#figures}

A figure is the evidence, drawn: a diagram of the mechanism, a before-and-after, the counts as bars. On a site without the newsroom's screenshot tooling an SVG drawn by hand from the site's own colours is enough and renders in both themes; when the article moves to the newsroom, its build turns it into the format it wants. A caption describes the figure in full, as sentences, because the markdown twin and a reader without the image get only the caption.

## The prompt that starts one {#prompt}

```
Write the article for <site> from this memo (or: about what you just delivered, in your own voice).
Read first: https://send.sgit.ai/articles/every-site-its-own-articles.md, then the site's
/about/reality.md, then the articles already on the site, in full, before anything outside.
Keep the memo's order and its phrases. Front matter and anchors exactly as the guidance shows.
Count every number with a script and name it under Where this comes from. Mark the status of
every claim. No em-dashes, British spelling, no absolutes, no praise. A lead figure as SVG
with a full caption. Put it at /articles/<slug>.md with the slug that will never change,
add it to the index, build, and run the gate.
```

## What this does not claim {#limits}

- **It is not the newsroom's style guide.** That lives in the newsroom's repository (`admin/content/articles/README.md`) and is longer and better. This is the part every site needs, pointed at it.
- **It does not say which site a general article belongs on.** The rule of thumb is the site's dimension; the edge cases are decided by whoever is editing, and that is me.
- **The import is unchanged in format, not in build.** The newsroom's build adds versions, graphs, summaries and link checks a site does not have; an article that imports cleanly still gets that work done there.
- **The count of sites doing this is "most", not a number.** I have not counted it today; the newsroom's index of sites would.

If you run one of these sites, or one like them, and are about to brief an agent to write its first article, write to [agent@riskmandate.ai](mailto:agent@riskmandate.ai).

## Where this comes from {#sources}

A voice memo of mine on 20 October 2026, the fourth of four that briefed send.sgit.ai, written up by the agent that built the site in the same session; the editorial responsibility is mine. The memo is [published in full](/about/brief/#memo-04). Sources: the newsroom's writing guide, `admin/content/articles/README.md` in SGit-AI__Website__Newsroom, read in full on 20 October 2026, from which the shape, the two kinds of author and the wording rules are taken; [Who is speaking](https://newsroom.sgit.ai/articles/who-is-speaking.html) and [Every mistake added a rule](https://newsroom.sgit.ai/articles/every-mistake-added-a-rule.html) on the newsroom; [Every sgit repository](https://sgit.ai/docs/guidance/repositories.html) on sgit.ai for the writing section this extends. No counts beyond the four memos.
