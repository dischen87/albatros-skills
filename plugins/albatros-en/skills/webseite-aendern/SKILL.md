---
name: webseite-aendern
description: "Changes a finished website with a person who has no prior knowledge, with their own AI, whether it's in the Albatros harbour or they host it themselves: fetch the logbook, read docs/ first (plan, design system, tech stack, PRD, where it lives), then small (text, date, picture: change locally, show before and after, release, push) or big (new page, feature, different look: addition to the plan, draft of the changed pages, approval to build, build and check, show, release, push), always within the existing design system, then check on the web. Use this skill for “change my site”, “new date”, “change a text”, “swap a picture”, “… is missing”, “new page”, “make the site …”, “something on the site is wrong”, and whenever something on a site that's online should be different."
metadata:
  stand: 0.2.0
  quelle: '79078892243f'
---

# Change your website: renovating a house you live in

## The picture

Renovating a house you live in: the folder holds the plans and the list of materials (`docs/`). Hanging a picture is quick. A new wall first needs a plan and a model the residents have seen. And you keep building with the same materials, otherwise it looks like patchwork.

**How to use the picture:** One sentence about it in your first answer, together with your estimate of whether it's a small or a big wish.

## How you talk

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- The line starts in files under `docs/` (`Freigegeben:`, `Freigegeben zum Bauen:`, `Abgeleitet aus:`, `Wohnort:`, `Adresse:`) stay German: the checks look for them exactly like that.
- Casual “you”, everyday language, short sentences. Whatever you do, you say it first in one sentence.
- The rules are in `docs/`: plan, design system, tech stack and PRD. New colours, fonts, spacing or a different framework only after a clear yes from the person, and then first in `design/tokens.css` (older sites: `web/src/styles/tokens.css`) and `docs/designsystem.md`.
- Nothing goes online without a release. With Light and with most providers, the push already means publishing.
- Whatever the person should see (before and after, preview, draft, finished site), you open yourself: `open <address or file>` (Linux `xdg-open`, Windows `start`).
- Making the change with their own AI is free; it only takes the AI subscription with its provider. If the person would rather not make the change themselves and the site lives with Albatros on Light, there's “We do it for you”: they describe it, you call `wunsch_melden`, and the answer names the price and the payment link. They pay before it's done; the status is at `https://albatros.build/en/cockpit/wuensche` (open the address for them). With their own server (Pilot) or when hosting it themselves, this isn't available.

## Steps

### 1. Fetch the logbook (Das Logbuch holen)

Where the site lives is in `docs/lancieren.md` (line `Wohnort:`, address under `Adresse:`), otherwise `konto_status` says it. That decides where the logbook is:

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # Albatros harbour, the first time
gh repo clone <user>/<repo>                             # hosting it yourself, with the logbook on GitHub
git pull --rebase                                       # every time after that, in the project folder
(cd web && npm ci)                                      # build tools, they're not in the logbook
```

If the logbook is only on this computer (hosting it yourself, without a repository), you work there and fetch nothing. If `git` fails with “Permission denied”, the key is missing on this computer (skill `ssh-schluessel`).

**If Albatros built the site** (in the previous project folder, `docs/projekt.md` has `Bauen lassen: albatros`, and the order is live), the whole project is in the harbour, and there is no `docs/lancieren.md`: `{name}` is the site's name from `konto_status`. The key comes first (skill `ssh-schluessel`). Fetch the logbook into a new folder next to the previous one, not into it: `git clone git@aufwind.sh:{name}/projekt.git ../{name}-site`. From now on you work there; you don't delete the previous folder. In the fetched folder you call `lage` with its evidence (`belege`), including `docs/prd.md` with the line `Freigegeben:` that Albatros added on delivery (step 4). Texts and photos the person collected while it was being built (in the previous folder, `docs/inhalte.md` and `design/bilder/`) often make a good first change of their own.

### 2. Read the plans first

Before you change anything, you read:

- `docs/designsystem.md` and `design/tokens.css` (older sites: `web/src/styles/tokens.css`): colours, fonts, spacing, corner radii and components.
- `docs/stack.md`: what the site is built with (usually Astro, at most 50 KB of JavaScript per page).
- `docs/prd.md`: what the site has to do, with the acceptance criteria, the access and the release.
- `docs/projekt.md` (line `Für wen:`, on older sites `docs/plan.md`) or `docs/bestand.md`: who the site is for. `design/entwurf/`, if there is one: the model of the pages.
- `web/src/data/*.json`: lists such as dates, prices or sponsors.

If `designsystem.md` or `stack.md` is missing (older site), you write them briefly first from what's there (`tokens.css`, `web/package.json`) and tell the person. If `scripts/pruefen.mjs` is missing, you fetch it as in the skill `webseite-bauen`, step 0.

### 3. Small or big?

- **Small:** a text, date, price, opening time, link or picture on an existing page. The way: change locally, show before and after, release, push (steps 4 to 7). Dates and lists you change in `web/src/data/*.json`, not in the page's code.
- **Big:** a new page, a new feature, a new section or a different look. The way: addition to the plan, draft of the changed pages, approval to build, build and check, show, release, push (first “Big: plan and draft”, then steps 4 to 7). If the feature needs a program (sign-up list, login), that's a building block with its own server (skill `bausteine`): if the site lives on Light, that means switching to Pilot (skill `lancieren`); when hosting it yourself, your own server (skill `landung`).
- **Your own address** (`meinverein.ch` instead of `{name}.aufwind.sh`): not a renovation, but the skill `domain`. It's optional and costs extra every year.

Tell the person in one sentence what it is and how it goes on.

### Big: plan and draft

1. **Addition to the plan:** at the very bottom of `docs/plan.md`, with the line starts in German as in the rest of the plan:
   ```markdown
   ## Addition <date>: <the wish in one sentence>
   Seiten: … (new or changed)
   Funktionen: … (with flow, confirmation, error and empty state)
   Zugang: … (does who may do what change? then docs/tueren.txt as well)
   ```
2. **Draft of the changed pages** in `design/entwurf/`, within the existing design system, with real texts (skill `entwurf`). The person clicks through it, on a phone and on a computer.
3. **Approval to build:** only after their yes does the line `Freigegeben zum Bauen: <DD.MM.YYYY>, “<their words>”` go into `docs/entwurf.md`, under a heading for the addition. The date comes first, as numbers; without a date, with `[Annahme: …]` or with “not yet”, it doesn't count as a yes. Then `node scripts/pruefen.mjs --vor-bau` must end with 0.
4. **Build** as in the skill `webseite-bauen`, step 4: markup and classes from the draft, tokens only from `design/tokens.css`.

### 4. The wish in the PRD

At the very bottom of `docs/prd.md`, after the line `Freigegeben:` from the first build, the wish is added as new acceptance criteria. That way it's clear the old release doesn't cover the new wish:

```markdown
## Changes

### <date>: <the wish in one sentence>
- [ ] <checkable, e.g. “On /termine the spring concert is listed: Saturday, 24 April 2027, 7.30 pm, Testdorf church”>
- [ ] Only values from the design system; the previous acceptance criteria still apply
```

For a big wish, `Abgeleitet aus: docs/entwurf.md (Nachtrag <DD.MM.YYYY>, Freigegeben zum Bauen: <DD.MM.YYYY>)` goes above it: the criteria follow from the draft the person approved. For a small one, you show them in step 5 together with the result.

If Albatros built the site, the line from the first build reads `Freigegeben: <DD.MM.YYYY>, Abnahme mit der Zahlung von Auftrag #<number>`: the payment was the release. This line stays as it is.

### 5. Change, build, check, show before and after

```bash
node scripts/pruefen.mjs --live <address> --nur aussehen --aus docs/pruefung/vorher     # screenshots before, address from docs/lancieren.md
# … the change in web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                    # build and check
```

For a big wish, also `node scripts/pruefen.mjs --vergleich` (the changed pages as in the draft) and, if the access changes, `node scripts/pruefen.mjs --tueren`. Red means: fix it and run again. In the reports under `docs/pruefung/` you add a line under “Checked” with the date and the wish, and tick off the new criteria in `docs/prd.md`. Then you open the affected page before and after side by side, on a phone and on a computer, and the preview (`(cd web && npx astro preview --background)`, then `open http://localhost:4321/<page>/`):

```bash
open docs/pruefung/vorher/fotos/live-<page>-390.png docs/pruefung/fotos/<page>-390.png
open docs/pruefung/vorher/fotos/live-<page>-1440.png docs/pruefung/fotos/<page>-1440.png
```

Once nothing is red any more, the change goes into the logbook, with your own files only (skill `git-logbuch`): `git add web docs seite && git commit -m "<the wish in one sentence>"`.

### 6. Release

Ask: “May this go on the web like this?” Only after the yes do you write `Freigegeben: <DD.MM.YYYY>, “<their words>”` under the wish, with the date first as numbers, and make the logbook entry with the marker for the released state:

```bash
git add docs/prd.md && git commit -m "Released: <the wish in one sentence>" && git tag -f freigegeben
```

If the person wants something different, it's back to step 5.

### 7. Push and check on the web

Only the released state goes online:

```bash
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
git push                                                                # Albatros harbour or GitHub
```

If “Seite wie freigegeben” (site as released) doesn't appear, something changed after the release: show it first and release it again. If the site is hosted by the person themselves without a repository, you upload `seite/` again as when going live (skill `lancieren`, part 2, “Selbst, ohne Repo”).

**Done means visible.** You check yourself until the change is on the web, at most three minutes, with a text from the change:

```bash
for i in $(seq 12); do curl -s <address>/<page> | grep -qF "<new text>" && echo "The change is there" && break; sleep 15; done
node scripts/pruefen.mjs --live <address>
```

Then you open the page with the person (`open <address>/<page>`). If the change isn't there after three minutes, you proceed as in the skill `lancieren`, part 2, step 4 (“still not there after three minutes”).

## Pitfalls

- Starting without `git pull`: then a change made elsewhere is missing, and the push gets rejected.
- A new colour “just here”: that breaks the design system. New values only come with a yes, and first in `tokens.css` and `designsystem.md`.
- A new page without a draft and without approval to build: then the person sees it for the first time when it's already built.
- Changing things in `seite/` instead of `web/`: the next build wipes the change.
- A date put straight into the code instead of `web/src/data/`: next time, you have to hunt for it.
- Pushing without a release, or “it's online” without having checked yourself.

## Final message

Your last message starts with a sentence on the picture “renovating a house you live in”. After that: what's changed, where you can see it (with the address), what was checked and whether anything is still open.
