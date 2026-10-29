---
name: webseite-bauen
description: "Builds a website with a person who has no prior knowledge, in eight fixed steps: mockup, design (two or three suggestions based on character), framework, a PRD to sign off, building locally and showing it, sending it to the harbour and showing it there in the browser, conveyor belt, page or server. Opens the island in the cockpit and reports every step with schritt_melden. Use this skill as soon as building starts on the website path: after webseite-planen, after the inventory from webseite-modernisieren, for “build me the site”, “mockup”, “draft”, “PRD”, “let me see it locally”, “what happens after the plan?”."
---

# Build your website: from floor plan to finished house

## The picture

A house goes up in a fixed order: first a sketch, then views to choose from, then the building plan with a signature, then the building work, then moving in. Nobody pours the foundations before the family has signed the plan. On the island in the cockpit, the house grows with every step.

**How to use the picture:** One sentence about it in your first answer, with the step you're at right now.

## How you talk

- The order is fixed. You don't skip a step, and you don't build anything before the person has signed off the PRD.
- You suggest the next step and do it after a quick yes. The person never has to know what comes next.
- Casual “you”, everyday language. You explain “PRD” the first time: the building plan with a signature, on one page.
- Websites stay static, without services of their own. A building block (skill `bausteine`) only comes in if the person really needs it.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- Whatever the person should see (island, mockup, drafts, preview, harbour, finished site), you open yourself in the browser: `open <address or file>` (Linux `xdg-open`, Windows `start`). Just naming the address isn't enough.

## The island

Right at the start, you open the person's island in the browser. At `https://albatros.build/en/cockpit/insel` there's a house for every project, and it grows with every step. Without a prefix (`/cockpit/insel`) the island is in German; for French, Italian and English the prefix goes in front, for example `/fr/cockpit/insel`:

```bash
open https://albatros.build/en/cockpit/insel        # macOS; Linux: xdg-open, Windows: start
```

The island reloads by itself; opening it once is enough.

After every step that's done, you call the Albatros tool `schritt_melden`, with `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `hafen`, `fliessband`, `live`, `domain`) and `sprache` (the language of the conversation, here `en`). Normally you leave out `projekt`: then the logbook in the harbour counts (`git@aufwind.sh:<name>/projekt.git`), even if it's only created later. Only for a further project that just sits on the computer do you pass a short name made of lower-case letters, digits and “-”. The answer names the step and the address of the island. Tell the person in one sentence that their house has grown.

- The island only goes forwards. If you report a step that's already there, nothing changes. The answer says so, and you don't try again.
- Albatros also sees `hafen`, `fliessband`, `live` and `domain` by itself. Report them anyway as soon as they're done.
- If it answers “Ungültige Angaben”, the step or the name was misspelled: correct it and call it once more.
- If the tool is missing or answers “unbekannt” (unknown), carry on without the island.

## The eight steps

### 1. Mockup (`schritt: mockup`)

Quick and rough, in greyscale: the home page and the most important subpage as one HTML file `docs/mockup.html`, with real headings and the content from the floor plan (`docs/plan.md`) or the inventory (`docs/bestand.md`). It shows the structure and the order, no colours and no pictures yet (grey boxes). Open it in the browser and only ask: “Is the order right?”

### 2. Design (`schritt: entwuerfe`)

Follow the skill `gestaltung`, section “Three directions”. First you ask about the character, not about colours. Then you put two or three clearly different suggestions on the mockup: the same pages, once per direction, as HTML in `docs/gestaltung/entwuerfe/`. After that you check them against the list of AI traits and ask about design elements (icons, illustrations, photos, mascot, 3D). The person picks a direction or a mix.

### 3. Framework

If the person doesn't say anything about it, you take whatever makes the most sense and say why in one sentence. For a static site, that's Astro: it builds fast, simple HTML pages that Albatros can deliver directly. Another framework only if the person wants it or the site needs it.

### 4. Show the PRD and get it signed off (`schritt: prd`)

Write `docs/prd.md` on one page and show it to the person. Building only starts after their yes. After the yes, report `prd` first, then build.

```markdown
# PRD: <name of the site>

**Who it's for and why:** … (from docs/plan.md)
**Pages:** Home, …
**Features:** every feature with its decision (for an existing site, all of them from docs/bestand.md)
**Design:** direction <name>, character …, font …, design elements …
**Framework:** Astro (static), because …
**Hosting:** Light (page from the harbour, without a server of your own) or Pilot (your own server)
**Domain:** name.aufwind.sh, later your own domain (only with Pilot)
**Not included:** …

Signed off: <date> by <name>
```

### 5. Build locally and show it (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- In `web/astro.config.mjs`: `outDir: '../seite'`. Albatros delivers the folder `seite/`, with Light directly and with Pilot over the conveyor belt.
- The colour fan from the skill `gestaltung` sits in `web/src/styles/tokens.css`. Outside it, no colour and no font size is written by hand.
- Lists like dates, tournaments or sponsors sit as data in `web/src/data/*.json`, and the pages read them. Documents and pictures go into `web/public/`, pictures made smaller.
- Build and open the preview in the browser:
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- Screenshots at phone and desktop width (skill `gestaltung`, step 6) and a comparison with the PRD: go through every feature and every piece of content in it and note in `docs/prd.md` where they are on the new site. If something is missing, you build it before it goes to the harbour. If material is missing (for example the sponsor logos), there's a clearly labelled placeholder, never a different picture under the wrong name.
- Look at every screenshot yourself like a visitor would: is text on pictures easy to read, is nothing cut off or covered? Fix whatever doesn't fit before it goes to the harbour.
- The icon in the browser tab (`web/public/favicon.svg` and `favicon.ico`) is Astro's “A”: replace it with the logo or a mark taken from it.
- Once the preview is running, report `lokal` before you show the site to the person and wait for their answer.

### 6. Send it to the harbour (`schritt: hafen`)

The Albatros harbour (`code.aufwind.sh`) is the person's training repository: their code lives there, private. If that still needs an account, a plan and a key, follow the skill `start` from step 3 now. Then you fetch the logbook and put the new site in it (skill `git-logbuch`):

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite logbuch/        # without web/node_modules, web/.gitignore leaves that out
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # the working copy of the old site stays out
cd logbuch && git add .gitignore web docs seite && git commit -m "Neue Seite: <Richtung>" && git push
```

Write the commit note in the person's language, e.g. “New site: <direction>”.

After that you open the harbour in the browser, so the person can see that their code is there:

```bash
open https://code.aufwind.sh/{name}/projekt
```

### 7. Conveyor belt (`schritt: fliessband`)

A simple conveyor belt, nothing special (skill `pipeline`). With Light you don't need one: whatever is on `main` in `seite/` in the harbour, Albatros shows about a minute later. With Pilot, the conveyor belt from `.github/workflows/deploy.yml` delivers the site to the server.

### 8. Page or server (`schritt: live`, later `schritt: domain`)

- **Light:** Albatros shows the site without a server of your own at `https://{name}.aufwind.sh`.
- **Pilot:** The site runs on your own server, also at `https://{name}.aufwind.sh`.

**You check yourself, the person never waits.** Instead of “have another look in a few minutes”, you check yourself after the push until your new site is there, for three minutes at most. The address already answers before that (with the template or the welcome page). So you wait for your site's title, as it stands in `seite/index.html` between `<title>` and `</title>`:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/ | grep -qF "<your site's title>" && echo "The site is there" && break; sleep 15; done
```

- **It's there:** report `fliessband` and `live`, open the address with the person (`open https://{name}.aufwind.sh`) and compare it with the screenshots from step 5.
- **Still not there after three minutes:** ask `konto_status`. With Light it says whether the newest state is online or what's missing. Often `seite/index.html` is missing in the harbour, because nothing was built before the push or `seite/` is in `.gitignore`. With Pilot you look in the harbour under “Actions” to see where the conveyor belt stopped (skill `pipeline`). Fix it, new entry, push, check again. Only if it still doesn't work do you tell the person what you checked and ask the coach (`coach_fragen`).

Your own domain comes along with the skill `domain` (only with Pilot), and then you report `domain`.

Only what belongs to the person, or what they have permission for, gets published (skill `webseite-modernisieren`, section “Rights”).

## Stumbling blocks

- Building before the PRD: then you make the wrong site look nice.
- Three drafts that only differ in colour: not a real choice.
- Forgetting to build `seite/`: then the old site is sitting in the harbour. Before every push, `npm run build` in `web/`.
- Making the person wait (“have a look later”): you check yourself until the site is there (step 8).
- A step not reported: the house on the island stops growing. Report every step as soon as it's done.

## Final message

Your last message in this step starts with one sentence on the picture “from floor plan to finished house” that sums up the core once more. Then: which of the eight steps is done, where the result is, what the person has to decide and which step comes next.
