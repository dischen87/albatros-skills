---
name: webseite-bauen
description: 'Builds a website with a person who has no prior knowledge, like in a small software factory, in nine fixed steps, each with a result in docs/: brief, mockup, design system, tech stack (Astro, little JavaScript), PRD with acceptance criteria, building locally, four checks with a report and a traffic light (security, flows and access, looks, code and speed, measured with pruefen.mjs), release by the person, then harbour, conveyor belt and the site on the web with a final check. Opens the island in the cockpit and reports the steps with schritt_melden. Use this skill as soon as building starts on the website path: after webseite-planen, after the inventory from webseite-modernisieren, for “build me the site”, “mockup”, “draft”, “design system”, “tech stack”, “PRD”, “acceptance criteria”, “check before publishing”, “let me see it locally”, “what happens after the plan?”.'
---

# Build your website: the little factory

## The picture

A house goes up in a fixed order: brief, sketch, material samples, building method, building plan with a signature, shell of the house, inspection by experts, handing over the keys, moving in. Nobody pours the foundations before the family has signed the plan, and nobody moves in before the experts have inspected the house. A software factory works just the same way: every step has a result you can look at, and at the end experts check before anything goes out. On the island in the cockpit, the house grows along with it.

**How to use the picture:** One sentence about the picture in your first answer. With every new step, one sentence with its picture (in the table below), what comes out of it and what it's for. That way the person understands why this step is needed.

## How you talk

- The order is fixed. You don't skip a step, you don't build anything before the PRD is signed off, and you don't send anything to the harbour before the release. With Light, sending it to the harbour already means publishing it.
- You suggest the next step and do it after a quick yes. The person never has to know what comes next.
- Casual “you”, everyday language. You explain technical words (PRD, tokens, Lighthouse) the first time, with their picture.
- Websites stay static, without services of their own. A building block (skill `bausteine`) only comes in if the person really needs it.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- Whatever the person should see (island, mockup, drafts, preview, reports, harbour, finished site), you open yourself in the browser: `open <address or file>` (Linux `xdg-open`, Windows `start`). Just naming the address isn't enough.

## The nine steps at a glance

| Step | Picture | Result | Island |
|---|---|---|---|
| 1. Brief | the brief for the building firm | `docs/plan.md` or `docs/bestand.md` | |
| 2. Mockup | the sketch on paper | `docs/mockup.html` | `mockup` |
| 3. Design system | the material samples | `docs/designsystem.md`, `web/src/styles/tokens.css` | `entwuerfe` |
| 4. Tech stack | the building method | `docs/stack.md` | |
| 5. PRD with acceptance criteria | the building plan with a signature | `docs/prd.md` with `Signed off:` | `prd` |
| 6. Build | the shell of the house | `web/`, `seite/` | `lokal` |
| 7. Check | the inspection by experts | `docs/pruefung/` with four reports | `pruefung` |
| 8. Release | handing over the keys | `Freigegeben:` in `docs/prd.md` | `freigabe` |
| 9. Harbour, conveyor belt, live | moving in | site on the web, `docs/pruefung/messwerte-live.json` | `hafen`, `fliessband`, `live` |

Whatever is in the “Result” column has to be there at the end of the step. If it's missing, the step isn't done.

## The island

Right at the start, you open the person's island in the browser. At `https://albatros.build/en/cockpit/insel` there's a house for every project, and it grows with every step. Without a prefix (`/cockpit/insel`) the island is in German; for French, Italian and English the prefix goes in front, for example `/fr/cockpit/insel`:

```bash
open https://albatros.build/en/cockpit/insel        # macOS; Linux: xdg-open, Windows: start
```

The island reloads by itself; opening it once is enough.

After every finished step with an entry in the “Island” column, you call the Albatros tool `schritt_melden`, with `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `pruefung`, `freigabe`, `hafen`, `fliessband`, `live`, `domain`) and `sprache` (the language of the conversation, here `en`). Normally you leave out `projekt`: then the logbook in the harbour counts (`git@aufwind.sh:<name>/projekt.git`), even if it's only created later. Only for a further project that just sits on the computer do you pass a short name made of lower-case letters, digits and “-”. The answer names the step and the address of the island. Tell the person in one sentence that their house has grown.

- The island only goes forwards. If you report a step that's already there, nothing changes. The answer says so, and you don't try again.
- Albatros also sees `hafen`, `fliessband`, `live` and `domain` by itself. Report them anyway as soon as they're done.
- If it answers “Ungültige Angaben”, the step or the name was misspelled: correct it and call it once more.
- If the tool is missing or answers “unbekannt” (unknown), carry on without the island.

## The steps

### 1. Brief

No brief, no building. The brief is the floor plan `docs/plan.md` (skill `webseite-planen`) or, for an existing site, the inventory `docs/bestand.md` (skill `webseite-modernisieren`). If both are missing, you go there first. Read the brief and tell the person in three sentences what gets built, for whom, and how they'll be able to tell it's working.

### 2. Mockup (`schritt: mockup`)

Quick and rough, in greyscale: the home page and the most important subpage as one HTML file `docs/mockup.html`, with real headings and the content from the brief. It shows the structure and the order, no colours and no pictures yet (grey boxes). Open it in the browser and only ask: “Is the order right?”

### 3. Design system (`schritt: entwuerfe`)

Follow the skill `gestaltung`, sections “Three directions”, “Don't look like AI”, “The colour fan (tokens)” and “Design elements”. First you ask about the character, not about colours. Then you put two or three clearly different drafts on the mockup, as HTML in `docs/gestaltung/entwuerfe/`, and open them. The person picks a direction or a mix, then you report `entwuerfe`.

The chosen direction turns into the design system, the material samples for the whole house:

- `web/src/styles/tokens.css`: colours for light and dark, fonts, font sizes, spacing, rounded corners and shadows as CSS variables, with the contrast values as comments.
- `docs/designsystem.md` on one page, easy for people to read: the direction and its qualities; every colour with its token name, purpose and contrast; fonts and sizes; spacing and rounded corners; the components (button, link, header, footer, card, form field and whatever else the site needs), each with its purpose and the tokens it uses; the design elements.

Colours, fonts, spacing, rounded corners and components are set only there. The code of the pages only uses `var(--…)` and the components. If a value is missing, it goes into the design system first.

### 4. Tech stack

You decide the building method before anything gets built, and write it in `docs/stack.md`:

```markdown
# Tech stack

**Decision:** Astro, static
**Why:** … (one or two sentences, from the brief)
**JavaScript:** only where needed, at most 50 KB per page
**Delivered:** the folder seite/ (Light: straight from the harbour; Pilot: over the conveyor belt)
**Not chosen:** … (for example a React app or WordPress), because …
```

The standard is Astro: it builds fast, simple HTML pages without JavaScript that Albatros can deliver directly. Another framework only if the person clearly asks for it or a feature from the brief needs it. Then “Why” names the feature and why Astro isn't enough for it. “Modern” or “well known” is not a reason. A sign-up list, a login or an editing window are no reason for another framework, but for a building block (skill `bausteine`, with Pilot). Tell the person in one sentence what's chosen and why.

### 5. PRD with acceptance criteria (`schritt: prd`)

The PRD is the building plan on one page, with the list of what gets checked at the inspection. Write `docs/prd.md`:

```markdown
# PRD: <name of the site>

**Who it's for and why:** … (from the brief)
**Pages:** Home, …, Legal notice, Privacy policy
**Features:** every feature with its decision (for an existing site, all of them from docs/bestand.md)
**Design:** direction <name>, see docs/designsystem.md
**Tech stack:** see docs/stack.md
**Hosting:** Light (page from the harbour, without a server of your own) or Pilot (your own server)
**Domain:** name.aufwind.sh, later your own domain (only with Pilot)
**Not included:** …

## Acceptance criteria

### Home
- [ ] The first three sentences say who you are, who the site is for and what visitors should do
- [ ] The button “…” leads to …

### <every other page>
- [ ] …

### <every feature, for example a form>
- [ ] Sending works, missing required fields are pointed out clearly, the message arrives at <address>

### For all pages
- [ ] Content as in the brief, no placeholder without a clear label
- [ ] Phone (390 px wide): nothing cut off, readable without zooming, buttons at least 44 px high
- [ ] Contrast: text at least 4.5 : 1, buttons and borders at least 3 : 1
- [ ] Works with the keyboard, the focus is visible
- [ ] Legal notice and privacy policy are there and linked on every page
- [ ] Speed: Lighthouse at least 90 in Performance, Accessibility, Best Practices and SEO; at most 50 KB of JavaScript per page; pictures under 500 KB
- [ ] No secrets in the code, no .env on the web

Signed off: <date> by <name>
```

Every criterion has to be checkable: you can see or measure whether it's true. “Nice” or “modern” is not a criterion. Instead, write how you can tell. Show the person a short version of the PRD in the chat and open the file. Only after their yes do you fill in `Signed off:` with the date and name, report `prd` and build.

### 6. Build (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- In `web/astro.config.mjs`: `outDir: '../seite'`. Albatros delivers the folder `seite/`, with Light directly and with Pilot over the conveyor belt.
- `tokens.css` from step 3 sits in `web/src/styles/` and is included in every layout. You build the components from `docs/designsystem.md` first, then the pages out of them.
- Lists like dates, tournaments or sponsors sit as data in `web/src/data/*.json`, and the pages read them. Documents and pictures go into `web/public/`, pictures made smaller.
- The icon in the browser tab (`web/public/favicon.svg` and `favicon.ico`) is Astro's “A”: replace it with the logo or a mark taken from it.
- If material is missing (for example the sponsor logos), there's a clearly labelled placeholder, never a different picture under the wrong name.
- Build and open the preview:
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- Once the preview is running, report `lokal` before you show the site to the person and wait for their answer.

### 7. Check (`schritt: pruefung`)

Four experts inspect the building, and each one writes a report with a traffic light. The script `pruefen.mjs` in this skill measures whatever can be measured. Copy it into the project and run it:

```bash
mkdir -p scripts && cp <folder of this skill>/pruefen.mjs scripts/
# folder unknown: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
(cd web && npm run build) && node scripts/pruefen.mjs
```

The first time, it downloads the tools (Playwright, axe-core, Lighthouse, about 200 MB) and takes a few minutes. Tell the person beforehand. It writes `docs/pruefung/messwerte.json` and screenshots of every page at 390 and 1440 px into `docs/pruefung/fotos/`.

After that you write four reports, one page each, in the person's language:

- `docs/pruefung/sicherheit.md` (security and the law): secrets in the code, `npm audit`, no `.env` in `seite/`, legal notice and privacy policy there and complete (skill `recht-ch`), which outside services and cookies the site uses.
- `docs/pruefung/ablaeufe.md` (flows and access): the accessibility rules (WCAG 2.2 AA, axe) on every page, dead links, every form tried out once yourself, the home page gone through with the keyboard (Tab), the flows from the PRD step by step.
- `docs/pruefung/aussehen.md` (looks): only values from `tokens.css`, design system followed, every screenshot looked at yourself (cut off, covered, readable?) and checked against the list of AI traits in the skill `gestaltung`.
- `docs/pruefung/code.md` (code and speed): Lighthouse in the four areas, JavaScript per page, picture sizes, and which acceptance criteria are met.

```markdown
# Check: <area>

**Traffic light:** green | yellow | red
**In plain words:** two or three sentences on what this means for visitors

## Checked
- … (a measured value from messwerte.json, or what you tried out yourself)

## Fixed
- …

## Open
- … (with the reason why it can stay like this)
```

Then you go through the acceptance criteria in `docs/prd.md`: you tick off the ones that are met (`- [x]`) and note briefly where or how they were checked. Whatever isn't met stays open, with a reason.

Red means: fix it, build again, check again, until nothing is red any more. Yellow is only allowed with a reason under “Open”. You only write “all green” once you've looked at the screenshots yourself. Once the four reports are in `docs/pruefung/` and nothing is red any more, you report `pruefung`.

### 8. Release (`schritt: freigabe`)

Handing over the keys: the person decides whether the site may go out. Show them the four traffic lights in one sentence each, open the reports and the preview, and say what's still open. Also say: with Light, the next step is publishing, and then the site is visible to everyone. Ask: “May the site go on the web like this?”

Only after their clear yes do you write the line `Freigegeben: <date> by <name>` under `Signed off:` in `docs/prd.md`. (“Freigegeben” means released; keep the word `Freigegeben:` exactly as it is, because the mission check looks for it.) Then you report `freigabe`. If they want to change something, it's back to step 6 and then through the check again.

### 9. Harbour, conveyor belt and live (`schritt: hafen`, `fliessband`, `live`)

The Albatros harbour (`code.aufwind.sh`) is the person's training repository: their code lives there, private. If that still needs an account, a plan and a key, follow the skill `start` from step 3 now. Then you fetch the logbook and put the new site in it (skill `git-logbuch`):

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite scripts logbuch/        # without web/node_modules, web/.gitignore leaves that out
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # the working copy of the old site stays out
cd logbuch && git add .gitignore web docs seite scripts && git commit -m "Neue Seite: <Richtung>" && git push
```

Write the commit note in the person's language, e.g. “New site: <direction>”.

After that you open the harbour in the browser, so the person can see that their code is there, and report `hafen`:

```bash
open https://code.aufwind.sh/{name}/projekt
```

**Conveyor belt:** A simple conveyor belt, nothing special (skill `pipeline`). With Light you don't need one: whatever is on `main` in `seite/` in the harbour, Albatros shows about a minute later. With Pilot, the conveyor belt from `.github/workflows/deploy.yml` delivers the site to the server.

**Live:** The site is at `https://{name}.aufwind.sh`, with Light without a server of your own, with Pilot on your own server.

**You check yourself, the person never waits.** Instead of “have another look in a few minutes”, you check yourself after the push until your new site is there, for three minutes at most. The address already answers before that (with the template or the welcome page). So you wait for your site's title, as it stands in `seite/index.html` between `<title>` and `</title>`:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/ | grep -qF "<your site's title>" && echo "The site is there" && break; sleep 15; done
```

- **It's there:** Check the site on the web once more (title, legal notice and privacy policy, Lighthouse). Done means visible:
  ```bash
  node scripts/pruefen.mjs --live https://{name}.aufwind.sh
  ```
  If nothing is red there, report `fliessband` and `live`, open the address with the person (`open https://{name}.aufwind.sh`) and compare it with the screenshots from step 7.
- **Still not there after three minutes:** ask `konto_status`. With Light it says whether the newest state is online or what's missing. Often `seite/index.html` is missing in the harbour, because nothing was built before the push or `seite/` is in `.gitignore`. With Pilot you look in the harbour under “Actions” to see where the conveyor belt stopped (skill `pipeline`). Fix it, new entry, push, check again. Only if it still doesn't work do you tell the person what you checked and ask the coach (`coach_fragen`).

If the person then wants something different (“there’s still … missing”, a date, a text), you load the skill `webseite-aendern` and follow it. The site is released and online, so every change needs its criterion in the PRD, a before and after, and a new release before the push.

Your own domain comes along with the skill `domain` (only with Pilot), and then you report `domain`.

Only what belongs to the person, or what they have permission for, gets published (skill `webseite-modernisieren`, section “Rights”).

## Stumbling blocks

- Building before the PRD: then you make the wrong site look nice.
- Into the harbour before the release: with Light, that already means publishing.
- Acceptance criteria you can't check (“nice”, “modern”): write how you can see or measure it.
- Another framework “because it's modern”: the reason is what the person wants or a feature, otherwise Astro.
- Three drafts that only differ in colour: not a real choice.
- Colours, spacing or font sizes by hand in the code: then the design system breaks.
- Reports without measured values, or “all green” without having looked at the screenshots.
- Forgetting to build `seite/`: then the old site is sitting in the harbour. Before every push, `npm run build` in `web/`.
- Making the person wait (“have a look later”): you check yourself until the site is there (step 9).
- A step not reported: the house on the island stops growing. Report every step with an entry in the “Island” column as soon as it's done.

## Check the mission

`mission_pruefen` with `webseite-02-bauen` as soon as the page is on the web. The check looks at whether `docs/prd.md` contains the release (the line starting with `Freigegeben:`, a word that stays German because the check looks for it) and the page answers.

## Final message

Your last message in this step starts with one sentence on the picture “the little factory” that sums up the core once more. Then: which of the nine steps is done and what came out of it, where the result is, what the person has to decide and which step comes next.
