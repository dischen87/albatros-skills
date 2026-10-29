---
name: webseite-aendern
description: 'Changes a finished website from the Albatros harbour with a person who has no prior knowledge, whether they built it themselves or Albatros built it, using their own AI: fetch it from the harbour, read docs/ first (design system, tech stack and PRD are the rules), make the change within the existing design system, add it to the PRD as acceptance criteria, build, check with pruefen.mjs, show before and after, release, push and check on the web. Small requests (a text, a date, a picture) go quickly, bigger ones (a new page, a new feature) go through the PRD and the check. Use this skill for “change my site”, “new date”, “change a text”, “swap a picture”, “… is missing”, “make the site …”, “something on the site is wrong”, and whenever something on a site at name.aufwind.sh should be different.'
---

# Change your website: renovating a house you live in

## The picture

Renovating a house you live in: the folder holds the plans and the list of materials (`docs/`). Hanging a picture is quick. A new wall needs a plan and a sign-off. And you keep building with the same materials, otherwise it looks like patchwork.

**How to use the picture:** One sentence about it in your first answer, together with your view on whether this is a small or a bigger request.

## How you talk

- Casual “you”, everyday language, short sentences. Before you do something, say what in one sentence.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- The rules are in `docs/`: design system, tech stack and PRD. New colours, fonts, spacing or another framework only come after a clear yes from the person, and then first in the design system.
- Nothing goes on the web without the release. With Light, the push already means publishing.
- Whatever the person should see (before and after, preview, finished site), you open yourself: `open <address or file>` (Linux `xdg-open`, Windows `start`).
- Making the change with their own AI costs nothing extra, only the AI subscription with its provider. If the person would rather not make the change themselves, tell them: “If you don't want to do it yourself, Albatros can do it for CHF 29. It's coming to the cockpit soon.”

## The steps

### 1. Fetch from the harbour

`konto_status` gives the name of the site. If the logbook isn't on this computer yet, fetch it (skill `git-logbuch`). Otherwise fetch the latest state:

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # the first time
cd {name} && git pull --rebase                          # every time after that
(cd web && npm ci)                                      # building tools, they're not in the harbour
```

If `git` fails with “Permission denied”, the key is missing on this computer (skill `ssh-schluessel`).

### 2. Read the plans first

Before you change anything, read:

- `docs/designsystem.md` and `web/src/styles/tokens.css`: colours, fonts, spacing, rounded corners and components.
- `docs/stack.md`: what the site is built with (usually Astro, at most 50 KB of JavaScript per page).
- `docs/prd.md`: what the site has to do, with the acceptance criteria.
- `docs/plan.md` or `docs/bestand.md`: who the site is for.
- `web/src/data/*.json`: lists like dates, prices or sponsors.

If `designsystem.md` or `stack.md` is missing (an older site), first write a short version from what's there (`tokens.css`, `web/package.json`), and tell the person.

### 3. Small or big?

- **Small:** swapping a text, a date, a price, opening hours, a link or a picture on an existing page. That goes quickly, without a mockup or drafts. Dates and lists you change in `web/src/data/*.json`, not in the code of the page.
- **Big:** a new page, a new feature, a new section or a different look. For that you first write the acceptance criteria (step 4) and wait for the yes. A new page gets a greyscale mockup first (skill `webseite-bauen`, step 2). If the feature needs a program (a sign-up list, a login), that's a building block, with Pilot (skill `bausteine`).

Tell the person in one sentence which it is and what happens next.

### 4. The request goes into the PRD

At the very bottom of `docs/prd.md`, after the lines with the sign-off and `Freigegeben:` from the first build, the request is added as new acceptance criteria. That way it's clear the old release doesn't cover the new request:

```markdown
## Changes

### <date>: <the request in one sentence>
- [ ] <checkable, e.g. “The spring concert is on /termine: Saturday, 24 April 2027, 7.30 pm, Testdorf church”>
- [ ] Only values from the design system, the existing acceptance criteria still apply
```

For a big request, show the criteria to the person first, and after their yes write `Signed off: <date> by <name>` underneath. For a small one, it's enough to show them in step 5 together with the result.

### 5. Build, check, show before and after

```bash
node scripts/pruefen.mjs --live https://{name}.aufwind.sh --nur aussehen --aus docs/pruefung/vorher   # screenshots before
# … the change in web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                                # build and check
```

If `scripts/pruefen.mjs` is missing, fetch it as in the skill `webseite-bauen`, step 7. Red means: fix it and run it again. In the reports under `docs/pruefung/`, add a line under “Checked” with the date and the request, and tick off the new criteria in `docs/prd.md`. Then open the page concerned before and after, side by side, at phone width and at desktop width:

```bash
open docs/pruefung/vorher/fotos/live-<page>-390.png docs/pruefung/fotos/<page>-390.png
open docs/pruefung/vorher/fotos/live-<page>-1440.png docs/pruefung/fotos/<page>-1440.png
```

### 6. Release

Ask: “May this go on the web like this?” Only after the yes do you write `Freigegeben: <date> by <name>` under the request. (“Freigegeben” means released; the word stays German, as in the skill `webseite-bauen`.) If the person wants something different, it's back to step 5.

### 7. Push and check on the web

Only your own changes, added one by one (skill `git-logbuch`):

```bash
git add web docs seite scripts && git commit -m "<the request in one sentence>" && git push
```

**Done means visible.** You check yourself until the change is on the web, for three minutes at most, with a piece of text from the change:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/<page> | grep -qF "<new text>" && echo "The change is there" && break; sleep 15; done
node scripts/pruefen.mjs --live https://{name}.aufwind.sh
```

Then open the page with the person (`open https://{name}.aufwind.sh/<page>`). If the change still isn't there after three minutes, do as in the skill `webseite-bauen`, step 9 (“Still not there after three minutes”).

## Stumbling blocks

- Starting without `git pull`: then a change from somewhere else is missing, and the push gets rejected.
- A new colour “just here”: that breaks the design system. New values only come with a yes, and first in `tokens.css` and `designsystem.md`.
- Changing things in `seite/` instead of `web/`: with the next build, the change is gone.
- A date straight in the code instead of in `web/src/data/`: next time you have to hunt for it.
- Pushing without the release, or saying “it's online” without having looked yourself.

## Final message

Your last message starts with one sentence on the picture “renovating a house you live in”. Then: what has changed, where you can see it (with the address), what was checked and whether anything is still open.
