---
name: entwurf
description: "Drafts the whole website with a person who has no prior knowledge, to click through before anything gets built (flight plan P7 and P8): first a check of the workshop (Node, npm, Git, with a building block also Bun), then every page and every feature of the build list in the chosen direction, with real texts, a shared menu, confirmation, error and empty states, the pages of building blocks as dummies and only values from design/tokens.css; checked with entwurf-pruefen.mjs, refined with the person's feedback. Then the approval to build, only with a clear yes from the person. The result is design/entwurf/ with docs/entwurf.md. Use this skill after gestaltung (sample sheet seen) and for “draft”, “show me the whole site”, “click-through”, “prototype”, “clickable mockup”, “approval to build”, “install Node”."
metadata:
  stand: 0.3.0
  quelle: '1f451bb253cc'
---

# Draft: the walk-through model

## The picture

Before the shell of a house goes up, the architect has a model of the whole house on the table: every room, every door, the kitchen with its real fronts. You walk through it with your eyes and say “there's a window missing here”. Right now a change costs one sentence; once the concrete is poured, it's a rebuild. That's why you first build a model like that of the person's site with them, one they can click through. Only once they sign it does building start.

Like every workshop, model-making needs tools: before you start, you check they're hanging on the wall.

**How to use the picture:** Tell the person in your first answer, before you show commands. At the approval the second picture comes in: the signature under the model.

## In the flight plan

- **P7 “Draft the whole website”** is due once the person has seen the sample sheet (P6, skill `gestaltung`: `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` and, in `docs/designsystem.md`, the line `Musterblatt: gesehen am <date>`). Check this before you start (Windows: `dir design` and `findstr /r /b /c:"Musterblatt: gesehen am [0-9]" docs\designsystem.md`):
  ```bash
  ls design/tokens.css design/komponenten.css design/musterblatt.html
  grep -E '^Musterblatt: gesehen am [0-9]' docs/designsystem.md
  ```
  If a file is missing or `grep` shows nothing (for example, it still says `Musterblatt: [offen: …]`), go to the skill `gestaltung`, step 5, first. If in an older project `sample sheet seen on <date>` is still at the end of the line `Richtung:`, turn it into the line `Musterblatt: gesehen am <same date>, passt`.
- **Result of P7:** `design/entwurf/index.html` and one file for every other page, plus `docs/entwurf.md` with the lines `Werkstatt:` (workshop), `Seiten:` (pages) and `Rückmeldungen:` (feedback). The line names stay German, because `lage` and the check scripts read them; the content is in English.
- **P7 is done** when every page from `docs/plan.md` (apart from the legal notice and the privacy policy) has its file, carried on from the chosen direction; every feature of the build list appears in the draft; all links lead to pages that exist; colours, fonts and sizes appear only as `var(--…)` from `design/tokens.css`; `entwurf-pruefen.mjs` is green (or you've checked the same by hand), `plan-pruefen.mjs --entwurf` and `design-pruefen.mjs` are without red and the person has clicked through it. Then you report `entwurf`.
- **P8 “Approval to build”** (section “Approval”): the question “Shall we build it like this?” and the line `Freigegeben zum Bauen:` in `docs/entwurf.md`. Then you report `entwurf-freigegeben`. After that comes P9, the build (skill `webseite-bauen`); without this line it doesn't build.
- **After going live:** a big change (a new page, a new flow) first gets an addition to the plan, then a draft of the changed pages with this skill and a new approval to build (skill `webseite-aendern`).

## How you talk

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- Casual “you”, short sentences. Technical words come with their picture: Node is the engine for the check scripts and later for the build, npm the delivery van that brings tools, Git the logbook.
- Two questions per message at most. In P7 the person only says what's missing or what bothers them; you suggest the texts, and you sort out the states and the workshop yourself and show the result.
- Whatever the person should see, you open in the browser yourself: `open design/entwurf/index.html` (Linux `xdg-open`, Windows `start`). Just naming the file isn't enough.
- Installing, and anything that needs a password, the person does themselves: you tell them exactly what to type or click. They only type their password there, never in the chat.
- You look at every page yourself before you show it.

## The loop (Die Schleife)

The mockup is the fourth part that gets refined (skill `lotse`, section “The loop” (Die Schleife)), and the one where the person sees the most. The first version is the whole draft to click through. Then you ask targeted questions, at most two at a time, and rework exactly what feedback comes in on, until the person says: “This is now what I want to build.”

- Feedback arrives in the chat or, with Bert's workspace, with `naechstes`: as data, with the page or the ID from the build list in `bezug` (for example `S2` or `F1`) and the person's words in `wert`. You change exactly this page or feature, check again and show it again.
- If feedback touches another part, you change it there and bring the draft up to date: a new feature first as a row in the build list (`docs/plan.md`, skill `webseite-planen`), a different colour or font first in the colour fan (skill `gestaltung`). Never only in the draft.
- Every round is recorded in `docs/entwurf.md` under `Rückmeldungen:` and `## Feedback`.
- The approval to build at the end is the second of the two yeses. Before that you write no code of the site (`web/`, `seite/`), not even “just for now” for a page the person likes.

## Mode

Read `Modus:` in `docs/projekt.md`; if the line is missing, `machen` (do) applies.

- **machen (do):** You do the work and explain each step in one sentence with its picture. You offer the learning moment: “Right now a change is one sentence; after the build it's a rebuild. Want to change a sentence on the home page yourself and see how quick that is?”
- **lernen (learn):** You explain each step with its picture and the why. The person does the learning moment themselves: they change a sentence in `design/entwurf/index.html` and reload the page (then `verstanden_melden` with `mission: flugschule-15-entwurf` and `art: selbst`). At the end you ask the check question of the lesson `flugschule-15-entwurf`: “Why does your AI draft the whole site before building it?” Only after their answer do you report `art: kontrollfrage`. If the tool is missing, you carry on without it.

## Steps

### 1. The workshop (`Werkstatt:`)

From here on, check scripts help, and in P9 Node builds the site. So first check whether the tools are there, without Node having to run yet:

```bash
command -v node npm git                        # macOS, Linux and Git Bash on Windows
where.exe node npm git                         # Windows in PowerShell or the Command Prompt
node --version; npm --version; git --version   # only what was found
```

In PowerShell it's `where.exe`, not `where`: without `.exe`, PowerShell looks for something else.

| Tool | What it's for | At least (as of 31.10.2026) |
|---|---|---|
| Node | the engine for check scripts and for the build with Astro | 22.23.4 (required by Astro 7); better the current LTS version from nodejs.org, currently 24 or 26 |
| npm | fetches tools, comes with Node | 10 |
| Git | the logbook | 2.28 |
| Bun, only with a building block | runs the building block and its tests on the computer (from P9) | checked with 1.4.2 |

**With a building block** (`Setup:` in `docs/plan.md` names one, for example a sign-up list, bookings or a login; skill `bausteine`) you also check Bun: `command -v bun` (Windows in PowerShell `where.exe bun`), then `bun --version`. Without a building block there's no need for Bun.

If something is missing or too old, you explain in everyday words how it gets onto their computer. They install it themselves; you tell them every click:

- **Mac:** Node: on nodejs.org, download the LTS version as an installer (.pkg), open it and click through. If Homebrew is there (`command -v brew`), `brew install node` works too. Git: `xcode-select --install` opens a window offering Apple's developer tools; click “Install” there.
- **Windows:** in PowerShell `winget install -e --id OpenJS.NodeJS.LTS` and `winget install -e --id Git.Git`; when Windows asks whether to allow changes, they click Yes. Without winget: the installers from nodejs.org and git-scm.com.
- **Linux (Ubuntu, Debian):** Git with `sudo apt install git`; sudo asks for their password, which they type in the terminal themselves. Node from `apt` is often too old: take the route nodejs.org shows for Linux under “Download” (nvm), then `nvm install --lts`.
- **Bun, only with a building block:** on a Mac and on Linux in the terminal `curl -fsSL https://bun.com/install | bash`, on Windows in PowerShell `powershell -c "irm bun.sh/install.ps1|iex"`. The person types the command themselves; it fetches Bun's installer.

After that, open a new terminal together and check again. Into `docs/entwurf.md` goes `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0 (checked on 31.10.2026)`, with a building block also Bun: `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0, Bun 1.4.2 (checked on 31.10.2026)`. If the person can't install right now (for example on a work computer without admin rights), the draft still works: `Werkstatt: without Node (no admin rights), Git 2.39.5; checked by hand`. Tell them honestly that the build in P9 needs Node, and with a building block Bun too.

### 2. The texts (Die Texte) (`Seiten:`)

A draft with real texts shows whether the site holds up. Follow the skill `inhalte`: from `docs/plan.md` the content list `docs/inhalte.md`, the home page in three sentences, short texts in the tone from `docs/konzept.md` (`Ton:`, formal or informal). You suggest the texts; whatever is missing appears visibly as `[placeholder: what's missing, who delivers it by when]`, never made up. The person confirms the texts while clicking through.

### 3. Draft the whole site

You carry the chosen direction (`design/richtungen/<chosen>.html`, `design/musterblatt.html` and `design/komponenten.css`) over to every page from `Seiten:` in `docs/plan.md`:

- **Files:** `design/entwurf/index.html` for the home page; for every other page the name in small letters, without accents (é → e; in German ä → ae, ö → oe, ü → ue), everything else becomes “-”: “About us” → `about-us.html`, “Courses & prices” → `courses-prices.html`. That's how `entwurf-pruefen.mjs` finds them.
- **One header, one menu, one footer** on every page, built the same way: the menu with all pages from the plan (on a phone on one line or as a “Menu” button), in the footer the links to the legal notice and the privacy policy. These two don't need text in the draft yet: a short page `legal-notice.html` and `privacy.html` with `[placeholder: the text comes with the build, skill recht-ch]` is enough, so no link leads nowhere. In the build they have the same names (`/legal-notice`, `/privacy`, skill `recht-ch`).
- **Only values from the colour fan:** every page includes `../tokens.css` and `../komponenten.css`; the CSS for the layout of the pages goes into `design/entwurf/entwurf.css`. Colours, fonts, font sizes, spacing, rounded corners and shadows appear only as `var(--…)`. If a value is missing, you first add it to `design/tokens.css` (and to the sample sheet), never in a page.
- **Every feature of the build list, with its ID:** the spot where a feature from the build list in `docs/plan.md` is shown (the form, the button, the list) carries the attribute `data-bauliste` with its ID: `<form data-bauliste="F1" action="contact-sent.html">`. If one spot shows several, they're written with spaces between them (`data-bauliste="F1 F3"`). `Kann` (can) entries appear too, otherwise the person decides about something they've never seen; if one isn't meant to be in the first flight after all, that's written with the reason in `docs/entwurf.md`. The attribute stays in the markup when building, so it can be checked later whether everything is built.
- **The states of every feature:** For every feature from the build list (in short under `Funktionen:` in `docs/plan.md`) you show what happens after the click: the **confirmation** (what has happened, what comes next, how to undo it), the **error** (in words, with “Try again”, what was typed stays there) and the **empty state** (one sentence and a button instead of an empty list). Each state is a page of its own, for example `contact-sent.html`, `contact-error.html`, `dates-empty.html`. A form points to its confirmation with `action="contact-sent.html"`, so the click works even without a program behind it. A page `zustaende.html` (not in the menu) lists all states with links, so the person can find them.
- **The pages of building blocks as dummies:** If the plan needs a building block (`Setup:`, skill `bausteine`: sign-up list, bookings, login, noticeboard), you draft its pages the same way, with header, menu and footer: for example `book.html` with the dates, `book-confirmed.html`, `book-full.html` (“This place has just gone”), `book-empty.html` and “My bookings” (`verwaltung.html`, not in the menu). They look real but don't work yet; they're built in P9 from the building block's recipe.
- **The mascot,** if `Maskottchen: ja` is in `docs/konzept.md`: only in the spots listed there (welcome, success, empty), as a picture from `design/figur/` or as a sketch. Never with errors.
- **Pictures:** the person's own photos from the photo list in `docs/inhalte.md` into `design/entwurf/bilder/`, otherwise a grey area with `alt="[placeholder: photo …]"`. Every `<img>` has `width`, `height` and a description.
- **Its own, not from a kit:** the criteria from the skill `gestaltung`, section “Your own, not from a kit” (Eigen statt Baukasten), apply: no centred heading with two buttons as the header, no emoji as icons, no lorem texts, no cards of the same size. Motion and 3D only as in the section “Motion and 3D” (Bewegung und 3D) there: every movement with its sentence in `docs/designsystem.md` and with respect for “Reduce motion”, 3D only with a still image (`data-3d-standbild`) and only loaded when needed.
- **Built for the phone:** `<meta name="viewport" content="width=device-width, initial-scale=1">` in every page, no sideways scrolling at 390 px, buttons at least 44 px high.
- **Links** always with the path from the page and with `.html` (`contact.html`, `../index.html`), never with “/” at the start and never to a folder: the draft is opened as a file, without a server.

### 4. Check with entwurf-pruefen.mjs

The script in this skill checks what can be checked; it doesn't download anything and doesn't change anything. Copy it into the project and run it:

```bash
mkdir -p scripts && cp <folder of this skill>/entwurf-pruefen.mjs scripts/
# folder unknown: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs
node scripts/entwurf-pruefen.mjs
```

It gives a traffic light per area and ends with 1 if anything is red. Its messages are in German; you explain them to the person in English:

- **Seiten aus dem Plan (pages from the plan):** every page from `Seiten:` in `docs/plan.md` has its file (legal notice and privacy policy excepted).
- **Links und Dateien (links and files):** every link, every picture, every form and every `url(…)` points to a file that exists, written exactly like that (capitals and small letters as on the server).
- **Farbfächer (colour fan):** colours, fonts and sizes only as `var(--…)` from `design/tokens.css`, also in the sample sheet and in `komponenten.css`; every `var(--…)` exists; every contrast comment in `tokens.css` is recalculated.
- **Menü, Handy und Notizen (menu, phone and notes):** the same menu on every page, the line for phones (`viewport`), the number of `[placeholder]`, the lines in `docs/entwurf.md`.

On top of that, the two scripts from the skills `webseite-planen` and `gestaltung` run (copied there; if they're missing in `scripts/`, you get them from the folder of the respective skill as above):

```bash
node scripts/plan-pruefen.mjs --entwurf     # full scope of features: every page and every feature of the build list appears in the draft
node scripts/design-pruefen.mjs             # your own, not from a kit: font, colour world, texts, header, motion, 3D, weight
```

If a `Muss` (must) entry of the build list is missing in the draft, that's red; a `Kann` (can) entry is yellow. After that comes what no script sees: the self-check and the second opinion in a fresh context (skill `gestaltung`, section “Self-check and second opinion” (Selbstprüfung und zweite Meinung)), with the result in `docs/entwurf.md` under `## Check`.

Red means: fix it and check again, until nothing is red any more. Yellow only stays with a reason in `docs/entwurf.md`. **Without Node** you check the same by hand, page by page: every page from the plan as a file; every `href`, `src` and `action` against the list of files (`ls design/entwurf`); in the CSS and in `style="…"` no `#…`, `rgb(`, `hsl(`, colour names, no `font-family` other than `var(--…)` and no numbers with `px`, `rem` or `em` for fonts, spacing, rounded corners and shadows; every contrast comment recalculated with the formula from the skill `barrierefreiheit`; every row of the build list against the pages (where is it shown?); the list from the skill `gestaltung`, section “Your own, not from a kit” (Eigen statt Baukasten). Then you write `checked by hand` with the date in `docs/entwurf.md`.

### 5. Show it: on a phone and on a computer

Before the person sees anything, you look yourself. With Node you take screenshots of every page at 390 and 1440 px wide and look at each one: is anything cut off? Does the menu fit on one line? Does the text have room at the edge? Does the computer view look empty?

```bash
npx -y playwright@1 install chromium      # once, about 150 MB
npx -y playwright@1 screenshot --viewport-size=390,844 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-390.png
npx -y playwright@1 screenshot --viewport-size=1440,900 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-1440.png
```

On Windows, instead of `file://$PWD/…` you need the whole path, for example `file:///C:/Users/anna/projekt/design/entwurf/index.html`.

Then you open `design/entwurf/index.html` and `design/entwurf/zustaende.html` for the person and show them how to get the phone view: drag the window very narrow, or in Firefox and Chrome `Ctrl+Shift+M` (on a Mac in Firefox `Cmd+Opt+M`, in Chrome `F12` first). On a real phone, on the same Wi-Fi, it works with `npx -y serve design/entwurf`: they type the address shown under “Network” into their phone, and afterwards you stop it with `Ctrl+C`.

### 6. Feedback (`Rückmeldungen:`)

Ask: “Click your way through, on a phone and on a computer: what's missing, what bothers you?” Why: right now a change is one sentence; after the build it's a rebuild. Every piece of feedback goes into `docs/entwurf.md` with the date and their own words; you change exactly the page or feature they mean, check again with the three scripts and show it again (section “The loop”). If they ask nothing and only say “good”, you help along with two targeted questions, for example: “On the home page, do you find within five seconds what you offer?” and “Is a field you need missing from the enquiry?” On the business path, the five-second test from the method `landingpage` is part of it: the person shows the first screen on a phone to two or three people from the target group; their answers also go under `Rückmeldungen:`.

This goes on for as many rounds as it takes. Once nothing is red and nothing is missing or bothering the person any more, you report `entwurf` (section “The island”) and move on to the approval.

### docs/entwurf.md

Each line starts at the beginning of the line with its German name and stays short (300 characters at most), because `lage` reads it; details go underneath.

```markdown
# Draft: <name>
Stand: <DD.MM.YYYY>

Werkstatt: Node <version>, npm <version>, Git <version>, with a building block Bun <version> (checked on <DD.MM.YYYY>)
Seiten: Home (index.html), Offer (offer.html), Contact (contact.html with confirmation and error); <number> placeholders left
Rückmeldungen: <DD.MM.YYYY> ‹<their words>› → <what was changed>
Freigegeben zum Bauen: <DD.MM.YYYY>, ‹<their words>›

## Pages
| Page | File | Texts | States | Open |
|---|---|---|---|---|

## Building blocks as dummies
- …

## Feedback
- <DD.MM.YYYY>, ‹…›: changed …

## Check
- <DD.MM.YYYY>: entwurf-pruefen.mjs green (or: checked by hand)
- <DD.MM.YYYY>: plan-pruefen.mjs --entwurf: <number> of <number> entries of the build list; design-pruefen.mjs <green | yellow, because …>
- <DD.MM.YYYY>: second opinion (<AI and way>): <number> ok, <number> risk, <number> open
```

The line `Freigegeben zum Bauen:` (approved to build) is only added with the approval.

## Approval (Freigabe)

The second picture: the signature under the model. Only what the person has seen and approved gets built.

Tell them in three or four sentences what's in the draft (the pages, the features with their states, what's still a placeholder), open the home page and ask exactly like this:

“Shall we build it like this?”

- **Only a clear yes to building counts:** “Yes”, “Yes, build it like this”, “Yes, go ahead”, “Agreed, build it”. Praise on its own is not an approval: to “looks good” or “nice” you ask once more: “Glad you like it. Does that mean: yes, build it like this?”
- **“Yes, but …”** is not an approval: change it first, show it again, ask again.
- With Bert's workspace you request the yes with `ja_moment` (`entwurf`); the workspace then writes the line when the person clicks “Ja, bestätigen” (yes, confirm) (skill `lotse`, section “Bert's workspace” (Berts Arbeitsplatz)).
- After the yes you write the line `Freigegeben zum Bauen: <DD.MM.YYYY>, ‹<their words>›` into `docs/entwurf.md`, for example `Freigegeben zum Bauen: 31.10.2026, ‹Yes, build it like this›`, and report `entwurf-freigegeben`. The words `Freigegeben zum Bauen:` stay German, because the build looks for them. The date comes first, as numbers: without a date, with `[Annahme: …]` or with “not yet”, the line doesn't count as a yes, neither for `lage` nor for `pruefen.mjs --vor-bau`.
- **If the draft changes after the approval,** it no longer counts: turn the line into `Früher freigegeben zum Bauen: …` (approved earlier), make the change, show it again and ask again. That way the line `Freigegeben zum Bauen:` always means: exactly this draft is approved.

After that comes P9: follow the skill `webseite-bauen` (`../webseite-bauen/SKILL.md`). It builds from this draft, with its markup, its classes and `design/tokens.css`, and it doesn't build without the line `Freigegeben zum Bauen:`.

## The island

After step 6 you call the tool `schritt_melden` with `schritt: entwurf` and `sprache: en`, after the approval with `schritt: entwurf-freigegeben`. You leave out `projekt`, unless the person is working on another project that's only on their computer; then you pass its short name. Tell them in one sentence that their house has grown. If the tool answers “Ungültige Angaben” (invalid details), check the spelling once; if Albatros doesn't know the step yet, carry on without the island, and `docs/entwurf.md` is the evidence. Then call `lage` again (skill `lotse`), always with `skills_stand`: the value of `stand` under `metadata` at the top of this file.

## Stumbling blocks

- **Only two or three pages drafted:** then the gaps only show during the build. Every page and every feature of the build list belongs in the draft.
- **One round, then approval:** the first version is rarely the one the person wants to build. Ask targeted questions until they say so.
- **A header like everywhere else:** a centred heading, one line, two buttons. `design-pruefen.mjs` reports it as red.
- **Only the path where everything works:** confirmation, error and empty list are missing. Good sites don't fall apart when something goes wrong.
- **Made-up texts:** whatever is missing appears as [placeholder], so nobody overlooks it.
- **Colours or spacing directly in a page:** then the draft shows something different from the sample sheet, and the build inherits the mistake.
- **Links with “/” at the start or to folders:** in the draft, opened as a file, they lead nowhere.
- **Taking “looks good” as an approval:** what's asked for is a yes to building.
- **Quietly carrying on changing after the approval:** every change needs a new approval.

## Check the mission

`mission_pruefen` with `flugschule-15-entwurf`, on the website path also with `webseite-03-inhalte`. The check looks at whether the project has reached at least the step “Draft” on the island.

## Final message

Your last message in this step starts with one sentence on the picture “the walk-through model” that sums up the core once more. Then: what's done (which pages, which states, the traffic lights from `entwurf-pruefen.mjs`), where the result is (`design/entwurf/`, `docs/entwurf.md`), what's still open (the placeholders with names and dates) and what comes next: before the approval the question “Shall we build it like this?”, after it the build with the skill `webseite-bauen`.
