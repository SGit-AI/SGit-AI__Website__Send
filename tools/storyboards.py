#!/usr/bin/env python3
"""storyboards.py: the storyboards section of send.sgit.ai, generated from data.

A storyboard is one JSON file (website/storyboards/NN__<slug>.json), the cast another (cast.json), and series.json is
what this site adds (shelves, stances, the start). Nothing is an image: every panel is drawn in the reader's browser by
the storyboard kit at api.storyboards.sgit.ai, loaded from the one release tools/storyboards-api.json pins, with the
integrity string of every file. The technique and the format are storyboards.sgit.ai's; the markup the kit wires is the
one its pages use, so a storyboard made here can be imported there unchanged.

The checks, each a way a storyboard could quietly go wrong: every character a scene names is in the cast; every kind,
pose, mood, setting and prop is one the kit draws; an evidence panel's quote is found word for word in the page source
its `source` names; a line a character says is marked not_a_quote; every try-it link points at a page that exists.
"""
import html
import json
import re

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC  = ROOT / 'website' / 'storyboards'
PIN  = ROOT / 'tools' / 'storyboards-api.json'
KINDS    = {'cover', 'scene', 'evidence', 'punchline', 'spectrum', 'map', 'graph'}
POSES    = {'stand', 'point', 'wave', 'arms-up', 'shrug', 'think', 'sit'}
MOODS    = {'neutral', 'happy', 'excited', 'calm', 'worried', 'sad', 'surprised', 'thinking', 'confused', 'determined'}
SETTINGS = {'none', 'office', 'interview', 'street', 'night', 'classroom'}
PROPS    = {'laptop', 'desk', 'book', 'board', 'phone', 'sign',                                            # the kit's own
            'key', 'vault', 'qr', 'envelope', 'record', 'server', 'arrow', 'mark', 'calendar', 'terminal', 'phoneqr', 'padlock'}   # props/security.js
e = lambda s: html.escape(str(s or ''), quote=True)


def payload(obj):
    return json.dumps(obj, ensure_ascii=False).replace('</', '<\\/')


def norm(s):
    return re.sub(r'\s+', ' ', re.sub(r'[*_`>#|]', '', str(s))).strip().lower()


class Storyboards:

    def __init__(self, site):
        self.site   = site
        self.pin    = json.loads(PIN.read_text(encoding='utf-8'))
        self.series = json.loads((SRC / 'series.json').read_text(encoding='utf-8'))
        self.cast   = json.loads((SRC / 'cast.json').read_text(encoding='utf-8'))
        self.boards = []
        for f in sorted(SRC.glob('[0-9][0-9]__*.json')):
            sb = json.loads(f.read_text(encoding='utf-8'))
            self.boards.append({'n': f.name[:2], 'file': f.name, 'sb': sb})
        self.by_slug = {b['sb']['slug']: b for b in self.boards}
        self.names   = {c['id']: c['name'] for c in self.cast['characters']}

    # --- the checks ------------------------------------------------------------------------------------------------

    def problems(self, pages):
        out = []
        ids = set(self.names)
        srcs = {p['src'].relative_to(ROOT / 'website' / 'pages').as_posix(): p for p in pages}
        for b in self.boards:
            sb = b['sb']
            at0 = b['file']
            if sb['slug'] != b['file'][4:-5]: out.append(f'{at0}: slug {sb["slug"]} does not match the file name')
            for i, s in enumerate(sb['scenes'], 1):
                at = f'{at0} panel {i}'
                k = s.get('kind', 'scene')
                if k not in KINDS: out.append(f'{at}: unknown kind {k}')
                if s.get('setting') and s['setting'] not in SETTINGS: out.append(f'{at}: unknown setting {s["setting"]}')
                for c in s.get('cast', []):
                    if c['who'] not in ids: out.append(f'{at}: {c["who"]} is not in the cast')
                    if c.get('pose') not in POSES: out.append(f'{at}: unknown pose {c.get("pose")}')
                    if c.get('mood') not in MOODS: out.append(f'{at}: unknown mood {c.get("mood")}')
                    if (c.get('says') or c.get('thinks')) and not s.get('not_a_quote') and k != 'evidence': out.append(f'{at}: a line said without not_a_quote')
                for p in s.get('props', []):
                    if p['kind'] not in PROPS: out.append(f'{at}: unknown prop {p["kind"]}')
                if k == 'evidence':
                    ev = s.get('evidence') or {}
                    src = ev.get('source') or s.get('source')
                    page = srcs.get(src)
                    if not page: out.append(f'{at}: evidence source {src} is not a page source'); continue
                    text = page['body'] + ' ' + page['meta'].get('summary', '') + ' ' + page['meta'].get('description', '')
                    if norm(ev.get('quote', '')) not in norm(text): out.append(f'{at}: the quote is not in {src}, word for word')
            for label, href in sb.get('try_it', []):
                if href.startswith('http'): continue
                target = ROOT / 'www' / href.strip('/')
                if not (target / 'index.html').exists() and not target.with_suffix('.html').exists() and not (href == '/'):
                    if not (ROOT / 'website' / 'pages' / (href.strip('/') or 'index')).exists() and not (ROOT / 'website' / 'pages' / href.strip('/') / 'index.html').exists() and not (ROOT / 'website' / 'pages' / href.strip('/') / 'index.md').exists() and href != '/':
                        out.append(f'{at0}: try-it link {href} has no page')
        for sh in self.series['shelves']:
            for slug in sh['boards']:
                if slug not in self.by_slug: out.append(f'series.json: shelf {sh["title"]} names {slug}, which does not exist')
        return out

    # --- the kit, pinned ---------------------------------------------------------------------------------------------

    def tag(self, path, kind):
        f = self.pin['files'][path]
        url = self.pin['base'] + path
        if kind == 'css': return f'<link rel="stylesheet" href="{url}" integrity="{f["integrity"]}" crossorigin="anonymous">'
        return f'<script src="{url}" integrity="{f["integrity"]}" crossorigin="anonymous" defer></script>'

    def head(self, export=False):
        parts = [self.tag('fonts.css', 'css'), self.tag('storyboard.css', 'css'),
                 '<script>window.StoryboardPrefsKey = "send.sgit.ai.storyboards.v1";</script>',
                 self.tag('vendor/rough-4.6.6.js', 'js')]
        parts += [self.tag(f'props/{p}.js', 'js') for p in self.series.get('packs', [])]
        parts.append(self.tag('storyboard.js', 'js'))
        if export: parts.append(self.tag('export.js', 'js'))
        return '\n'.join(parts)

    # --- the pages ---------------------------------------------------------------------------------------------------

    def tools_html(self, views=True):
        v = ('<span class="sb-views" role="group" aria-label="View"><button type="button" data-view="deck" title="One panel at a time (d)">Deck</button>'
             '<button type="button" data-view="grid" title="Every panel on one page (g)">Grid</button><button type="button" data-view="script" title="The storyboard as text (t)">Script</button></span>') if views else ''
        cols = ''.join(f'<option value="{n}">{n}</option>' for n in range(1, 7))
        keys = ('<kbd>d</kbd> <kbd>g</kbd> <kbd>t</kbd> views &middot; ' if views else '') + '<kbd>a</kbd> animation &middot; <kbd>x</kbd> text &middot; <kbd>+</kbd><kbd>&minus;</kbd> per row &middot; <kbd>/</kbd> filter &middot; <kbd>p</kbd> play' + (' &middot; <kbd>&larr;</kbd><kbd>&rarr;</kbd> <kbd>n</kbd> notes <kbd>f</kbd> full screen' if views else '')
        return (f'<div class="sb-tools" role="toolbar" aria-label="How to view the panels">{v}<label class="sb-for-grid">Per row <select class="sb-cols">{cols}</select></label>'
                '<label title="Panels play as they arrive (a)"><input type="checkbox" class="sb-anim"> Animation</label>'
                '<label class="sb-for-grid" title="Each panel\'s script under it (x)"><input type="checkbox" class="sb-showtext"> Text</label>'
                '<button type="button" class="sb-playall sb-for-grid" title="Play the panels one after another (p)">Play in order</button>'
                '<input type="search" class="sb-filter sb-for-list" placeholder="Filter: a word, a name, a mood, a kind" aria-label="Filter the panels">'
                f'<span class="sb-keys">{keys}</span></div>')

    def viewer(self, sb):
        return (f'<div class="sb-viewer">{self.tools_html(True)}<div class="sb-deck" hidden><div class="sb-track"></div>'
                '<div class="sb-bar"><button type="button" class="sb-prev" aria-label="Previous panel">&larr;</button><span class="sb-count"></span><button type="button" class="sb-next" aria-label="Next panel">&rarr;</button>'
                '<button type="button" class="sb-replay" title="Play this panel (p)">&#9654; Play</button><button type="button" class="sb-notes-toggle" title="Notes (n)">Notes</button><button type="button" class="sb-full" title="Full screen (f)">Full screen</button></div>'
                f'<div class="sb-notes"></div></div><div class="sb-grid" hidden></div><div class="sb-script" hidden></div>'
                f'<script type="application/json" class="sb-data">{payload({"storyboard": sb, "cast": self.cast})}</script></div>')

    def script_md(self, sb):
        lines = []
        for i, s in enumerate(sb['scenes'], 1):
            k = s.get('kind', 'scene')
            head = s.get('caption') or s.get('title') or s.get('punchline') or f'Panel {i}'
            lines.append(f'## {i}. {head}' + (f' ({k})' if k != 'scene' else ''))
            if k == 'cover' and s.get('subtitle'): lines.append(f'*{s["subtitle"]}*')
            if k == 'punchline': lines.append(f'**{s["punchline"]}**')
            if k == 'evidence':
                ev = s['evidence']; lines.append(f'> {ev["quote"]}'); lines.append(f'> ({ev.get("source") or s.get("source")})')
            for c in s.get('cast', []):
                name = self.names.get(c['who'], c['who'])
                if c.get('says'): lines.append(f'- **{name}** ({c.get("pose")}, {c.get("mood")}): "{c["says"]}"')
                elif c.get('thinks'): lines.append(f'- **{name}** thinks: "{c["thinks"]}"')
                else: lines.append(f'- {name}, {c.get("pose")}, {c.get("mood")}')
            for p in s.get('props', []):
                desc = p.get('label') or p.get('text') or (' / '.join(p['lines']) if p.get('lines') else '')
                lines.append(f'- prop: {p["kind"]}' + (f', {desc}' if desc else ''))
            if s.get('note'): lines.append(f'\nNote: {s["note"]}')
            if s.get('source'): lines.append(f'Source: {s["source"]}')
            lines.append('')
        return '\n'.join(lines)

    def pages(self):
        """Synthetic pages for the site's build: dicts with kind html, body, head, a twin, and side files."""
        out = []
        S, cast, meta = '/storyboards', self.cast, self.series
        first_shelf = {slug: sh['title'] for sh in meta['shelves'] for slug in sh['boards']}
        for b in self.boards:
            sb, slug = b['sb'], b['sb']['slug']
            n = len(sb['scenes'])
            tries = ''.join(f'<a class="btn{"" if i else " "}" href="{e(h)}">{e(l)} &rarr;</a>' for i, (l, h) in enumerate(sb.get('try_it', [])))
            snippet = e(f'<script src="{self.pin["base"]}embed.js" defer></script>\n<sg-storyboard src="{self.site.cfg["host"]}{S}/{slug}/bundle.json" view="deck"></sg-storyboard>')
            body = (f'<p class="muted kicker">{e(meta["title"])} &middot; {e(first_shelf.get(slug, ""))} &middot; board {b["n"]}</p>'
                    f'<h1>{e(sb["title"])}</h1><p class="sg-lead">{e(sb.get("subtitle", ""))}</p>'
                    f'<p class="muted"><span class="sg-status sg-status-{"shipped" if sb.get("status") == "built" else "proposed"}">{e(sb.get("status", ""))}</span> {n} panels &middot; {e(sb.get("by", ""))}. {e(sb.get("rule", ""))}</p>'
                    f'{"<div class=\"row-actions sb-try\">" + tries + "</div>" if tries else ""}'
                    f'{self.viewer(sb)}'
                    f'<h2 id="formats">Take it with you</h2><p class="muted">The same storyboard as data and as text. The pictures are drawn in your browser, now, by the storyboard kit at '
                    f'<a href="{e(self.pin["host"])}">api.storyboards.sgit.ai</a> {e(self.pin["release"])}, pinned with the integrity string of every file.</p>'
                    f'<div class="formats"><a href="storyboard.json"><b>storyboard.json</b><span>the data, as this site wrote it</span></a>'
                    f'<a href="bundle.json"><b>bundle.json</b><span>the data with its cast, for an embed</span></a>'
                    f'<a href="index.md"><b>index.md</b><span>the script, as markdown</span></a>'
                    f'<a href="../cast.json"><b>cast.json</b><span>the cast</span></a></div>'
                    f'<h2 id="embed">Put it on your page</h2><p class="muted">Two lines: the embed script from the pinned release, and one element. The storyboard is drawn into your page from this site\'s bundle.</p>'
                    f'<pre><code>{snippet}</code></pre>'
                    f'<p class="muted">Every board: <a href="{S}/">the shelf</a> &middot; <a href="{S}/all/">every panel on one page</a> &middot; <a href="{S}/model-sheet/">the model sheet</a>.</p>')
            twin = (f'# {sb["title"]}\n\n> {sb.get("subtitle", "")}\n\n*{meta["title"]} · {first_shelf.get(slug, "")} · board {b["n"]} · {sb.get("status", "")} · {sb.get("by", "")}. '
                    f'The script of a storyboard drawn by the kit at api.storyboards.sgit.ai; the data is storyboard.json and bundle.json beside this file.*\n\n'
                    + (''.join(f'- [{l}]({h})\n' for l, h in sb.get('try_it', [])) + '\n' if sb.get('try_it') else '') + self.script_md(sb))
            out.append({'kind': 'html', 'url': f'{S}/{slug}/', 'out': f'storyboards/{slug}/index.html', 'twin': f'storyboards/{slug}/index.md', 'title': sb['title'],
                        'description': sb.get('subtitle', ''), 'meta': {'head': self.head(), 'title': sb['title']}, 'body': body, 'twin_md': twin, 'section': 'storyboards', 'src': SRC / b['file'],
                        'files': {f'storyboards/{slug}/storyboard.json': json.dumps(sb, indent=1, ensure_ascii=False) + '\n',
                                  f'storyboards/{slug}/bundle.json': json.dumps({'storyboard': sb, 'cast': cast, 'packs': meta.get('packs', [])}, ensure_ascii=False) + '\n'}})
        # the shelf
        stance = meta.get('stance', {})
        def faces_of(sb, k=4):
            count = {}
            for sc in sb['scenes']:
                for c in sc.get('cast', []): count[c['who']] = count.get(c['who'], 0) + 1
            return [w for w, _ in sorted(count.items(), key=lambda x: (-x[1], x[0]))[:k]]
        def faces(sb, cls='sbx-face'):
            return ''.join(f'<svg class="{cls}" data-who="{e(w)}" role="img" aria-label="{e(self.names[w])}"><title>{e(self.names[w])}</title></svg>' for w in faces_of(sb))
        def thumb(slug, i, cls='sbx-thumb'):
            return f'<svg class="{cls}" data-board="{e(slug)}" data-scene="{i}" viewBox="0 0 1600 1000" role="img" aria-label="Panel {i + 1}"></svg>'
        def card(slug):
            b = self.by_slug[slug]; sb = b['sb']; href = f'{S}/{slug}/'
            strip = ''.join(thumb(slug, i) for i in range(1, min(4, len(sb['scenes']))))
            return (f'<article class="sbx-card"><a class="sbx-cover" href="{href}" aria-label="{e(sb["title"])}: open the deck">{thumb(slug, 0)}<span class="sbx-tag">{b["n"]}</span></a>'
                    f'<a class="sbx-strip" href="{href}?view=grid" aria-label="{e(sb["title"])}: every panel">{strip}</a>'
                    f'<div class="sbx-body"><h3><a href="{href}">{e(sb["title"])}</a></h3><p>{e(sb.get("subtitle", ""))}</p>'
                    f'<div class="sbx-meta"><span class="sbx-faces">{faces(sb)}</span><span>{len(sb["scenes"])} panels</span><span class="sg-status sg-status-{"shipped" if sb.get("status") == "built" else "proposed"}">{e(sb.get("status", ""))}</span></div></div></article>')
        st = self.by_slug[meta['start']]; ssb = st['sb']; sn = len(ssb['scenes']); shref = f'{S}/{ssb["slug"]}/'
        start = (f'<section class="sbx-start"><p class="sbx-kicker">Start here</p><div class="sbx-start-grid"><div><a class="sbx-cover sbx-big" href="{shref}" aria-label="{e(ssb["title"])}: open the deck">{thumb(ssb["slug"], 0)}</a>'
                 f'<div class="sbx-start-strip">{"".join(thumb(ssb["slug"], i) for i in range(1, min(4, sn)))}<a class="sbx-more" href="{shref}?view=grid">+{max(0, sn - 4)} more</a></div></div>'
                 f'<div class="sbx-start-text"><span class="sbx-tag sbx-tag-big">{st["n"]}</span><h2>{e(ssb["title"])}</h2><p>{e(ssb.get("subtitle", ""))}</p>'
                 f'<div class="sbx-meta"><span class="sbx-faces">{faces(ssb, "sbx-face sbx-face-big")}</span><span>{sn} panels &middot; {e(ssb.get("status", ""))}</span></div>'
                 f'<div class="row-actions"><a class="btn" href="{shref}?view=deck">&#9654; Play the deck</a><a class="btn secondary" href="{shref}?view=grid">See all {sn}</a><a class="btn secondary" href="{shref}?view=script">Read the script</a></div></div></div></section>')
        shelves = ''.join(f'<section class="sbx-shelf"><div class="sbx-head"><h2 id="shelf-{k}">{e(sh["title"])}</h2><p>{e(sh.get("note", ""))}</p></div><div class="sbx-cards">{"".join(card(s) for s in sh["boards"])}</div></section>' for k, sh in enumerate(meta['shelves'], 1))
        people = ''.join(f'<article class="sbx-person"><svg class="sbx-figure" data-who="{e(c["id"])}" data-pose="{e(stance.get(c["id"], ["stand", "happy"])[0])}" data-mood="{e(stance.get(c["id"], ["stand", "happy"])[1])}" role="img" aria-label="{e(c["name"])}"></svg>'
                         f'<div><h3>{e(c["name"])} <span class="muted">{e(c["pronouns"])}{", " + str(c["age"]) if c.get("age") else ""}</span></h3><p><strong>{e(c["role"])}</strong></p><p>{e(c["stands_for"])}</p>'
                         f'<p class="muted">Wants {e(c["wants"])}. Fears {e(c["fears"])}.</p><p class="sbx-line">&ldquo;{e(c["line"])}&rdquo;</p></div></article>' for c in cast['characters'])
        names = ''.join(f'<span>{e(c["name"])}</span>' for c in cast['characters'])
        data = {'cast': cast, 'boards': {b['sb']['slug']: {'title': b['sb']['title'], 'scenes': b['sb']['scenes'][:4]} for b in self.boards}, 'stance': stance}
        total = sum(len(b['sb']['scenes']) for b in self.boards)
        body = (f'<div class="sbx"><section class="sbx-hero"><h1>{e(meta["title"])}</h1><p class="sg-lead">{e(meta["blurb"])}</p>'
                f'<svg class="sbx-lineup" role="img" aria-label="The cast, in a line"></svg><div class="sbx-names" style="--n:{len(cast["characters"])}">{names}</div>'
                f'<p class="muted">{len(self.boards)} storyboards, {total} panels, drawn in your browser by <a href="{e(self.pin["host"])}">api.storyboards.sgit.ai</a> {e(self.pin["release"])}. Every one is data: '
                f'<a href="{S}/all/">every panel on one page</a> &middot; <a href="{S}/model-sheet/">the model sheet</a> &middot; <a href="https://storyboards.sgit.ai/">storyboards.sgit.ai</a>, where the technique comes from.</p></section>'
                f'{start}{shelves}'
                f'<section class="sbx-cast" id="cast"><div class="sbx-head"><h2>The cast</h2><p>{e(cast.get("what", ""))}</p><a href="{S}/model-sheet/">The model sheet: every mood and pose &rarr;</a></div><div class="sbx-people">{people}</div></section>'
                f'<p class="muted">{e(meta.get("quotes", ""))} The data is <a href="{S}/cast.json">cast.json</a> and one JSON file per board, in the repository under <code>website/storyboards/</code>.</p>'
                f'<script type="application/json" class="sb-data">{payload(data)}</script></div>')
        twin = (f'# {meta["title"]}\n\n> {meta["blurb"]}\n\n{len(self.boards)} storyboards, {total} panels, drawn by the kit at api.storyboards.sgit.ai {self.pin["release"]}.\n\n'
                + ''.join(f'## {sh["title"]}\n\n{sh.get("note", "")}\n\n' + ''.join(f'- [{self.by_slug[s]["sb"]["title"]}]({S}/{s}/index.md): {self.by_slug[s]["sb"].get("subtitle", "")}\n' for s in sh['boards']) + '\n' for sh in meta['shelves'])
                + '## The cast\n\n' + cast.get('what', '') + '\n\n' + ''.join(f'- **{c["name"]}** ({c["pronouns"]}): {c["role"]}. {c["stands_for"]}. "{c["line"]}"\n' for c in cast['characters']))
        out.append({'kind': 'html', 'url': f'{S}/', 'out': 'storyboards/index.html', 'twin': 'storyboards/index.md', 'title': meta['title'], 'description': meta['blurb'], 'meta': {'head': self.head(), 'title': meta['title']},
                    'body': body, 'twin_md': twin, 'section': 'storyboards', 'src': SRC / 'series.json', 'files': {'storyboards/cast.json': json.dumps(cast, indent=1, ensure_ascii=False) + '\n', 'storyboards/series.json': json.dumps(meta, indent=1, ensure_ascii=False) + '\n'}})
        # every panel
        data = {'boards': [{'href': f'{S}/{b["sb"]["slug"]}/', 'storyboard': b['sb']} for b in self.boards], 'cast': cast}
        body = (f'<h1>Every panel</h1><p class="sg-lead">All {total} panels of the {len(self.boards)} storyboards on one page, in order. Filter by a word, a name or a mood; play them in order.</p>'
                f'<div class="sb-contact" data-view="grid">{self.tools_html(False)}<script type="application/json" class="sb-data">{payload(data)}</script></div>'
                f'<p class="muted"><a href="{S}/">The shelf</a> &middot; <a href="{S}/model-sheet/">the model sheet</a></p>')
        out.append({'kind': 'html', 'url': f'{S}/all/', 'out': 'storyboards/all/index.html', 'twin': 'storyboards/all/index.md', 'title': 'Every panel', 'description': f'All {total} panels of the {len(self.boards)} storyboards on one page.',
                    'meta': {'head': self.head(), 'title': 'Every panel'}, 'body': body, 'twin_md': f'# Every panel\n\nAll {total} panels, in order. The scripts: ' + ', '.join(f'[{b["sb"]["title"]}]({S}/{b["sb"]["slug"]}/index.md)' for b in self.boards) + '\n', 'section': 'storyboards', 'src': SRC / 'series.json', 'files': {}})
        # the model sheet
        body = (f'<h1>The model sheet</h1><p class="sg-lead">Every character of {e(meta["title"])} in every mood and every pose, side by side, the way animators check a character is on model: a face that reads wrong here reads wrong in every panel it is in.</p>'
                f'<div class="sb-sheet"><script type="application/json" class="sb-data">{payload({"cast": cast})}</script></div><p class="muted"><a href="{S}/">The shelf</a> &middot; <a href="{S}/cast.json">cast.json</a></p>')
        out.append({'kind': 'html', 'url': f'{S}/model-sheet/', 'out': 'storyboards/model-sheet/index.html', 'twin': 'storyboards/model-sheet/index.md', 'title': 'The model sheet', 'description': f'Every character of {meta["title"]} in every mood and pose.',
                    'meta': {'head': self.head(), 'title': 'The model sheet'}, 'body': body, 'twin_md': '# The model sheet\n\n' + ''.join(f'- **{c["name"]}**: {c["role"]}\n' for c in cast['characters']), 'section': 'storyboards', 'src': SRC / 'cast.json', 'files': {}})
        return out
