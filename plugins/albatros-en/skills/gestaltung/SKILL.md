---
name: gestaltung
description: "Designs how a person's site works and looks, with a person who has no prior knowledge. In the flight plan (P6): a grey mockup (“Is the order right?”), three clearly different directions from the concept, a check against the AI look, tokens for colours, type and spacing (design/tokens.css), docs/designsystem.md and a sample sheet. For an existing site: a check from three angles, fixing how it works, directions, tokens, rebuilding with screenshots. Always with the question about design elements (icons, photos, mascot, 3D; image tools only after the price and a yes). Use this skill after konzept and for “design”, “design system”, “sample sheet”, “it looks boring”, “it looks home-made”, “it looks like AI”, “vibe coded”, “make it look nicer”, “colours”, “fonts”, “redesign”, “three versions”, “it looks unprofessional”, “layout”, “icons”, “mascot”, “3D”."
metadata:
  stand: 0.2.0
  quelle: '02f75af84c9c'
---

# Design: first the foundations, then the facade

## The picture

When you do up an old house, you don't paint the facade first. The foundations come first: doors that stick, stairs without a handrail, light switches in the wrong place. Only once the house is good to live in does the painting start. New paint over broken doors just makes the faults look prettier.

With a new house, the foundations are the layout: first you draw in grey which room goes where. Only then do you lay out the material samples side by side on a **sample sheet**: colours, fonts, buttons and fields, the way you look at tiles and wood before ordering anything for a new house. Whatever is right on the sample sheet is right in every room.

For the facade there's a **colour fan**: a small collection of fixed colours, fonts and spacings. Everything in the house gets painted with these and nothing else. The technical word for it is **tokens**.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## Two ways through this skill

- **A new site in the flight plan (P6):** There's `docs/konzept.md` from P5, and nothing has been built yet. You go through the section “From mockup to sample sheet”.
- **Reworking an existing site:** The site is already built or on the web, and the person finds it hard to use or thinks it doesn't look good (“it looks home-made”, “make it look nicer”, “different colours”). You go through the section “Reworking an existing site”. If the site is already live, a draft of the changed pages with approval to build comes before the rebuild (skills `entwurf` and `webseite-aendern`).

The sections “Three directions”, “Don't look like AI”, “The colour fan (tokens)” and “Design elements” apply to both.

## How you talk

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- Your first answer is always the picture and the way there in five steps: in the flight plan mockup, three directions, choice, colour fan, sample sheet; for an existing site check, fix how it works, choose from three clearly different directions, set the colour fan, rebuild. If the person wants it “nicer” or “different colours”, that applies just the same. Only after that do you ask where the site is and how you get to it.
- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, short. Two questions per message at most. Every criticism needs evidence: which page, which spot, ideally a screenshot. “Looks busy” on its own doesn't count.
- Taste is the person's call. You put forward directions and say honestly what each one does well and what its risk is.
- The person's own requirements (logo, house colour, how they address people, mandatory texts) come before any design tip. In the flight plan they're in `docs/konzept.md` under `Muss bleiben:` (must stay).
- Whatever the person should see (mockup, directions, sample sheet, screenshots), you open in the browser yourself: `open <file>` (Linux `xdg-open`, Windows `start`). Just naming the file isn't enough.
- Nothing gets published before the person has seen the screenshots and said yes.

## From mockup to sample sheet (flight plan P6)

Phase P6 “Design system with an example”. It's due once `docs/konzept.md` has all seven lines (P5, skill `konzept`); if it's missing, go there first. After that comes P7, the whole site as a draft to click through (skill `entwurf`).

- **Result:** `design/mockup.html`, `design/richtungen/*.html`, `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` and `docs/designsystem.md` with the lines `Richtung:` (direction), `Farben:` (colours), `Schriften:` (fonts), `Abstände:` (spacing), `Komponenten:` (components) and `Maskottchen:` (mascot). File and line names stay German, because `lage` and the check scripts read them; the content is in English.
- **Done when** `tokens.css` and `musterblatt.html` exist, the sample sheet uses colours, fonts and sizes only as `var(--…)` from `tokens.css`, and the person has seen it.
- **Questions for the person:** “Is the order on the grey sketch right?”, “Which of the three directions, or which mix?”, “Does the sample sheet work: colours, fonts, buttons, fields, cards and header on a phone?” and the question about design elements. “A dark version too?” you suggest as `[Assumption: yes, light and dark]`, because many phones switch to dark at night.
- **Island:** `mockup` as soon as the order is right; `entwuerfe` as soon as the person has seen the sample sheet and is happy with it.

**Mode:** Read `Modus:` in `docs/projekt.md` (if the line is missing, `machen`, do, applies). The learning moment of this phase is “Why colours and fonts live in one place only”: the person changes a colour in `design/tokens.css` themselves, reloads the sample sheet and sees it change everywhere. In mode `lernen` (learn) they do it themselves (then `verstanden_melden` with `mission: webseite-04-gestaltung` and `art: selbst`), and at the end you ask the check question of the lesson: “Why do colours and fonts live in one place only?” Only after their answer do you report `art: kontrollfrage`. In mode `machen` (do) you offer the learning moment and explain each step in one sentence with its picture. If the tool `verstanden_melden` is missing, you carry on without it.

### 1. The mockup from the sketch (`schritt: mockup`)

The grey sketch of the home page from P1 is in `design/skizze.html`. From it you make `design/mockup.html`: the home page from top to bottom (on the business path as written in `docs/plan.md` under “Startseite von oben nach unten”) and the most important subpage, both in one file. If the sketch is missing, use `docs/plan.md`.

- Only shades of grey and the system font, no pictures: grey areas with a label saying what goes there (“Photo: rehearsal in the school hall”).
- Real headings and sentences from `docs/projekt.md`, `docs/plan.md` and `docs/konzept.md` (name, core), the main button with its real text (“Ask for a place”), the menu with all pages from `Seiten:`.
- One file with no links to the web; it opens with a double-click.

Open it and ask only: “Is the order on the grey sketch right?” Why: structure before looks. Change it until it's right. Then you create `docs/designsystem.md` (template in step 4) with `Richtung: [open: choice of direction] · order confirmed on <DD.MM.YYYY>`, the other lines with `[open: …]`, and report `mockup` (section “The island”).

### 2. Three directions on the mockup

Now the character comes in. Read in `docs/konzept.md` the three words under `Charakter:`, the tone, the visual style and what has to stay, in `docs/recherche.md` the examples. From these you make three clearly different directions following the section “Three directions”: one file each, `design/richtungen/<name>.html` (for example `soft.html`, `clear.html`, `bold.html`), with exactly the content and order of the mockup.

- At the top of each file a short box: the idea, which of the three words it stresses, fonts, the role of colour, shapes, depth, strength and risk.
- Each direction has its own provisional values in a `<style>` at the top of the file. That's allowed, because only after the choice does the colour fan come into being as the single source.
- If a mascot is part of it (`Maskottchen: ja`), it appears in every direction in the spot where it turns up, as a picture or as a sketch from `design/figur/`.

### 3. Check against the AI look, and the choice

Look at each direction in the browser, at phone and desktop width, and check it against the list in the section “Don't look like AI”. Whatever you find, you fix before the person sees the directions. Write the result in `docs/designsystem.md` under `## Richtung`: `AI traits checked: soft ok, clear ok, bold: cards all the same size, rebuilt`.

Open all three and ask: “Which of the three directions, or which mix?” Why: three clearly different directions show what's possible. In the same message or right after it comes the question about design elements (section “Design elements”). The choice goes into the line `Richtung:`, for example `Richtung: clear, with the colours of soft · order confirmed on 30.10.2026`.

### 4. Colour fan, components and design system

The chosen direction becomes the material samples for the whole house:

- **`design/tokens.css`:** the colour fan, the single source for colours (light and dark), fonts, font sizes, spacing, rounded corners and shadows, with the contrasts as comments (section “The colour fan (tokens)”).
- **`design/komponenten.css`:** the shared parts, only with `var(--…)`: button (normal, focus, disabled), link, field with label, help and error, message for confirmation and error, card, header with menu, footer with legal notice and privacy policy. The header adjusts to its own width (container query `@container`) rather than to the width of the window, so the sample sheet can also show it in a 390 px wide frame, like on a phone. The sample sheet and the draft use the same file.
- **`docs/designsystem.md`:** readable for humans, on one page. Each line starts at the beginning of the line with its German name and stays short (300 characters at most), because `lage` reads these lines:

```markdown
# Design system: <name>
Stand: <DD.MM.YYYY>

Richtung: <name of the direction or mix> · order confirmed on <DD.MM.YYYY> · sample sheet seen on <DD.MM.YYYY>
Farben: <action colour, background, text, error>; light and dark; contrasts in design/tokens.css
Schriften: <heading font> and <body font>; text 17 px, headings <sizes>
Abstände: 4, 8, 12, 16, 24, 32, 48 px; content 1200 px at most; corners <…>; depth: <shadow or line>
Komponenten: button, link, field, message, card, header with menu, footer (design/komponenten.css)
Maskottchen: <ja – mascot, poses, when it appears | nein | später>

## Direction
Qualities: <the three words> · idea: … · AI traits checked: …

## Colours
| Token | Purpose | light | dark | Contrast |
|---|---|---|---|---|

## Components
| Component | Purpose | Tokens |
|---|---|---|

## Words
One word per thing, the same on the site, in the email and in the admin area: enquiry (not booking), …

## Design elements
Icons: … · illustrations: … · photos: photo list in docs/inhalte.md · mascot: … · 3D: …
```

After `Maskottchen:` comes first `ja`, `nein` or `später` (yes, no, later), as in `docs/konzept.md`.

### 5. The sample sheet

`design/musterblatt.html` includes only `tokens.css` and `komponenten.css` and shows on one page:

- every colour as a swatch with its name, purpose and contrast, light and dark side by side;
- the font sizes from large to small, with real sentences from the project;
- the spacing scale and the rounded corners;
- the button normal, with focus and disabled (with the reason next to it);
- a field with label, help and an error in words;
- a card and a message for confirmation and error;
- the header with menu in a 390 px wide frame and at full width;
- the design elements: icons from the chosen set, the mascot in its poses or as a sketch, a photo or the area where it will go.

In the sample sheet, colours, fonts and sizes appear only as `var(--…)`. Check this with your own eyes in the code; if Node is already there, `node <folder of the skill entwurf>/entwurf-pruefen.mjs --nur farbfaecher` measures it and recalculates every contrast comment along the way (folder unknown: `curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs`).

Open the sample sheet and show the person how to see it as on a phone: drag the browser window very narrow, or use the browser's phone view (Firefox and Chrome: `Ctrl+Shift+M`, on a Mac in Firefox `Cmd+Opt+M`, in Chrome `F12` first). Then ask: “Does the sample sheet work: colours, fonts, buttons, fields, cards and header on a phone?” Why: what's right on the sample sheet is right on every page. You make changes in `tokens.css` or `komponenten.css`, never in the sample sheet itself. After their yes you add `sample sheet seen on <DD.MM.YYYY>` to the line `Richtung:`, fill in the other lines and report `entwuerfe`.

### The island

After step 1 you call the tool `schritt_melden` with `schritt: mockup` and `sprache: en`, after step 5 with `schritt: entwuerfe`. You leave out `projekt`, unless the person is working on another project that's only on their computer; then you pass its short name. Tell them in one sentence that their house has grown on the island. If the tool answers “Ungültige Angaben” (invalid details), check the spelling once; if the tool is missing, carry on without the island. Then call `lage` again (skill `lotse`).

## Three directions

1. **Character before colours.** In the flight plan the qualities are already in `docs/konzept.md` (`Charakter:`). Otherwise ask about qualities, not favourite colours: put pairs of opposites forward to choose from, to suit the site: traditional or sporty, mountain village or city, calm or lively, refined or down-to-earth, for guests or for members. Plus one question: which three words should visitors think after ten seconds? Each of the three directions stresses different ones of these qualities. Colours follow from them and from the logo and surroundings, never the other way round.
2. **Examples:** look at the two or three sites from the research or the plan. What do they do well? What don't we copy (their logo, colours, font)?
3. **Diagnosis** (for an existing site): Why doesn't today's look work? Typical: all headings equally loud, two styles side by side, one colour with several meanings, spacing that keeps changing.
4. **Three clearly different directions**, not just three colours. They differ in idea, font, the role of colour, shapes and depth. Example: “Soft” (warm, round), “Clear” (calm like a newspaper), “Bold” (blocks of colour, big headings).
5. Each direction shows **the same pages** with real texts: in the flight plan the mockup, for an existing site two or three pages (home, most important subpage, contact). Placeholder text skews the judgement.
6. The same in all directions: logo, mandatory texts, one main button per page, accessibility.

## Don't look like AI

AI sites give themselves away with the same traits. Check every direction and the finished site against this list and write the result down (in the flight plan in `docs/designsystem.md`, otherwise in `docs/gestaltung/richtungen.md`, line `AI traits checked: …`):

- Gradients in purple and blue, glow and glass effects.
- Emoji as icons.
- Inter or another default font everywhere, all headings equally loud.
- A centred header: heading, sentence and button in the middle of a colour block or in front of a blob of colour, with one or two buttons.
- Cards of the same size side by side or stacked, with or without icons, rounded or square. This is the most common AI trait: arrange the content by how important it is, not in identical boxes.
- The stock photo look: smiling people at a laptop, mountains from anywhere.
- Filler phrases: “Welcome to our website”, “Discover”, “Your partner for”, “with passion”, “innovative”, “seamless”.
- Made-up numbers, reviews, quotes or customer logos. Time promises like “in 60 seconds”.
- Grey shadows, two kinds of depth side by side (shadow here, border there), mixed icon sets.
- More than six sections on the home page.

Check for the pattern, not the wording: one button instead of two, or cards stacked instead of side by side, is the same trait. For this you look at the pages or screenshots, not just the code.

Instead: one single signature mark, used sparingly (a stroke under one word in the heading, a highlighter on at most one word per section), real photos of the place and the people, a font with character that suits the qualities, colours from the logo and surroundings, a structure that comes from the content (if dates are the main thing, they go at the top), and concrete sentences with names, numbers and places. In the code you find gradients and default fonts with `grep -rnE "linear-gradient|radial-gradient|Inter" design src`. Emoji and filler phrases you look for in the texts, the rest with your eyes.

## The colour fan (tokens)

One file `tokens.css` with CSS variables: colours for light and dark, fonts, font sizes, spacing, rounded corners and shadows. In the flight plan it lives in `design/tokens.css`, for a built site in `web/src/styles/tokens.css`. One sentence of comment per block saying why. Rules:

- One action colour for everything clickable, and nowhere else.
- Calculate contrast, don't estimate it: text at least 4.5 : 1, buttons and borders at least 3 : 1 (formula in the skill `barrierefreiheit`). Colours as hex (`#1d1b18`), the contrast as a comment on the same line, always with the colour it's measured against: `/* 16,0 : 1 on --hell-grund */`. That way it can be recalculated; `entwurf-pruefen.mjs` (skill `entwurf`) does that for every comment.
- Every colour appears once, in a palette for light and one for dark. The pages only use names like `--farbe-text`; dark mode only swaps this mapping (`@media (prefers-color-scheme: dark)`). The token names stay German, as in the example.
- Outside `tokens.css`, no colour, no font, no font size, no spacing, no rounded corner and no shadow is written into the code by hand. Screen widths in `@media` may be numbers.
- **Type:** two families at most, a heading font with character and a calm body font, with a free licence (for example the SIL Open Font License) and self-hosted (woff2, `font-display: swap`; in the flight plan in `design/schriften/`, source and licence as a comment). Never load them from other people's servers; that gives your visitors away to third parties. Text 16 to 17 px with a line height of 1.5, nothing under 12 px. Big headings with a line height of 1.0 to 1.1 and set slightly tighter (−0.01 to −0.03 em), smaller on the phone with `clamp()`. Bold (700) only for the biggest headings, otherwise semi-bold (600). Prices and times with `font-variant-numeric: tabular-nums`.
- **Spacing** only from one scale: 4, 8, 12, 16, 24, 32, 48 px (bigger for sections). Content at most about 1200 px wide, a 16 px margin on the phone. On a computer the header and sections use this width; only running text stays narrow (about 70 characters per line).
- **Rounded corners:** three steps by size (field, card, large surface), always smaller inside than outside. Buttons either all round or all square.
- **Depth:** one method for the whole site, either surfaces with a shadow or a fine line without a shadow. Shadows tinted in the text colour, never grey, two levels at most. The background is slightly warm, cards are white.
- **Motion:** press 90 to 100 ms, transitions 160 to 200 ms, one movement per event. With “Reduce motion”, only cross-fades.
- **Focus:** 2 to 3 px in the action colour with a 2 px gap, at least 3 : 1 on every background.
- **The error colour** only for errors and anything urgent.

This is how a `tokens.css` starts (the contrasts of these colours are recalculated):

```css
/* Colour fan of <name>: the single source for colours, fonts, sizes, spacing, rounded corners and shadows. */
:root {
  /* Palette: every colour once, with its contrast (text at least 4.5 : 1, buttons and borders 3 : 1) */
  --hell-grund: #faf7f2;      /* slightly warm */
  --hell-text: #1d1b18;       /* 16,0 : 1 on --hell-grund */
  --hell-aktion: #0b5c8c;     /* 6,7 : 1 on --hell-grund, only for clickable things */
  --hell-auf-aktion: #ffffff; /* 7,1 : 1 on --hell-aktion */
  --hell-rand: #8a8378;       /* 3,5 : 1 on --hell-grund */
  --dunkel-grund: #171614;
  --dunkel-text: #f1ece4;     /* 15,3 : 1 on --dunkel-grund */
  --dunkel-aktion: #7cc4f0;   /* 9,4 : 1 on --dunkel-grund */

  /* What the pages use; dark mode only swaps these lines */
  --farbe-grund: var(--hell-grund);
  --farbe-text: var(--hell-text);
  --farbe-aktion: var(--hell-aktion);

  /* Fonts, sizes, spacing, rounded corners, shadows */
  --schrift-titel: "<heading font>", Georgia, serif;
  --groesse-text: 1.0625rem;  /* 17 px */
  --abstand-4: 16px;
  --rund-klein: 6px;
  --schatten-1: 0 1px 2px rgb(29 27 24 / 0.08);
}
@media (prefers-color-scheme: dark) {
  :root { --farbe-grund: var(--dunkel-grund); --farbe-text: var(--dunkel-text); --farbe-aktion: var(--dunkel-aktion); }
}
```

## Design elements: always ask

Once the direction is settled, you always ask: “Would you like any design elements as well?” Put the options forward with the effort each one takes. Whatever is already decided in the flight plan (`Bildsprache:` and `Maskottchen:` in `docs/konzept.md`), you don't ask again; you build on it.

- **Icons:** one single, consistent set (for example Lucide or Phosphor), never emoji and never two sets mixed.
- **Illustrations:** a few, in the same style, for empty spots and explanations.
- **Your own photos:** a photo list of what the person should photograph (the place, people in action, details), in the flight plan in `docs/inhalte.md`. Real photos beat any generated picture.
- **A mascot:** a character that guides people through the site. First a sheet with four to six poses of the same character, one for each moment (welcome, searching, success, empty), then rules for when it appears: never with errors, cancellations or delicate moments, never next to photos of people, never behind lists or forms. Size: at most half the width for the welcome, small otherwise. It's decoration (`alt=""`); the sentence next to it works without it too. Animated clips only load once they're visible, play for 5 seconds at most and then stop (WCAG 2.2.2). You look at every picture yourself, zoomed in too. Without credit the poses stay sketches until the site is released (P10).
- **3D:** an object or the character as a 3D model, only in the header of the home page and only from tablet width up. A still image comes first; the 3D only loads once the header is visible. On a phone, without a graphics card or with “Reduce motion”, the still image stays.

**Plain doesn't mean without pictures.** If the person wants no icons, illustrations or characters, you still suggest a real photo for the header of the home page (the place, people in action) and give them the photo list. A photo is content, not decoration. If they don't have one yet, the header carries the most important content instead of a colour block with a heading (for example the next date, large), and the photo list goes under “Open” (in the flight plan in `docs/inhalte.md`, otherwise in `docs/gestaltung/richtungen.md`). If they don't want photos either, their sentence goes there.

Whatever the person picks goes into the design system (in the flight plan `docs/designsystem.md`, otherwise `docs/gestaltung/richtungen.md`) and into the colour fan (sizes, spacing, rules).

**With Albatros**, pictures, cut-out characters and 3D models are made with the Albatros tools, paid from the person's credit (cost price plus 35 %):

- `bild_erzeugen` with `beschreibung` (the description) and `format` (`quadrat` square, `quer` landscape, `hoch` portrait or `breit` wide), `bild_freistellen` with `bild_url` (a picture with a transparent background), `modell_3d` with `bild_url` (a 3D model as GLB, ideally from a cut-out picture).
- `guthaben` shows the balance, the prices and the link to top up. You only give prices from this answer.
- Before the first call that costs something, you call `guthaben`, give the price and ask once: “A picture costs CHF …, your credit is enough for … Shall I?” After that, after every call you briefly give the cost and what's left, without asking again. If the credit isn't enough, pass on the link to top up.
- You save every result in the project straight away (in the flight plan `curl -o design/bilder/<name>.png <url>`, for a built site into `web/public/bilder/`), because after 7 days it's gone. For a variant you change the description: the same description returns the same picture for 15 minutes, at no extra cost.
- You look at every generated picture yourself before you show it to the person. Only what they've chosen goes on the site.
- If a tool answers “kommt bald” (coming soon), you carry on without the image tools (below).

**With their own Hugging Face account** it works too, as an alternative. The person creates the account themselves and signs in themselves. You add the official server: `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. With Codex it's `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, with Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, with Cursor the entry `"huggingface": { "url": "https://huggingface.co/mcp?login" }` under `mcpServers` in `~/.cursor/mcp.json`. They choose the Spaces for pictures, cutting out and 3D at huggingface.co/settings/mcp. For free there are 5 minutes of computing time a day. Without signing in, the server only offers search in the Hub.

**Rights:** Every model has a licence; read it on the model page before a picture goes on the site. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) and TRELLIS (MIT) also allow commercial use, FLUX.1 dev only non-commercial use. Generated pictures show no real people and no other people's logos. Real places and people come from the person's own photos, with consent.

**Without image tools** the path works just the same: icons from a free set, your own photos, illustrations from a free collection with a clear licence, a mascot drawn by hand or later, no 3D.

## Reworking an existing site

If you can't see the site yet (no project in the folder, no address), first explain the whole way in five short steps: check, fix how it works, choose from three clearly different directions, set the colour fan, rebuild. Only then do you ask where the site is.

### 0. Frame (5 minutes)

Take from `docs/plan.md` (skill `webseite-planen`): who it's for, the main thing for visitors, the pages. Also ask: What has to stay (logo, colour, font, texts)? Create `docs/gestaltung/`.

### 1. Check from three angles (read only, change nothing)

Go through the site with three pairs of glasses, one after the other. One table row per finding in `docs/gestaltung/pruefung.md`:

| ID | Page and spot | What happens, for whom, why it's bad | Evidence | Severity | Suggestion (new text word for word, or new behaviour) |
|---|---|---|---|---|---|

- **Flows (FL):** Play through the main thing from start to finish. How many steps? Is the answer in the first screen? Are there dead ends? Is it clear who's behind it and what it costs?
- **Access (AC):** the checklist from the skill `barrierefreiheit` (contrast, keyboard, picture descriptions, forms, phone).
- **States and language (SL):** What do you see while it's loading, with an empty form, with an error, after sending? The same words for the same things? Do buttons name the result (“Ask for a place” instead of “Submit”)?

Severity: **critical** (the main thing doesn't work, or the law is broken), **high** (often leads to mistakes or people giving up), **medium**, **low**. For a small site, 10 to 15 findings with evidence are enough. The same fault in many places is one finding with a list of the places. At the end: what's good and should stay.

### 2. Decide and fix the foundations

Put everything the person has to decide in front of them in one go (with your recommendation), not one by one. Then fix: first the shared parts (button, form field, error message, confirmation), then the pages. Colours and fonts stay as they are in this step.

- **Main button:** about 56 px high, 17 px text, semi-bold. The second button is white with a border, links are underlined.
- **Disabled** is never invisible: 40 % opacity, with the reason written next to it.
- **Fields:** 48 to 52 px high, the label sits above (never just a placeholder in the field), help or error below, in words and not just in colour.
- **Status** (free, fully booked, confirmed) always as a word and a shape, never just as a colour.
- **Menu on the phone:** at 390 px it fits on one line, otherwise it becomes a “Menu” button that opens the list (without JavaScript, with `<details>`). A menu item alone on a second line is a mistake.

### 3. Three directions

Following the section “Three directions”, with two or three pages of the existing site. `docs/gestaltung/richtungen.md`: at the top the line `Entscheid: <direction or mix> (<date>)` (“Entscheid” means decision; keep the word `Entscheid:` exactly as it is), below it the diagnosis and one table per direction (idea, font, colours, shapes, strength, risk), plus the line `AI traits checked: …`. The drafts as HTML files in `docs/gestaltung/entwuerfe/`, so the person can open them in the browser.

### 4. The colour fan

Following the section “The colour fan (tokens)”, in `web/src/styles/tokens.css`. Together with the question about design elements (section “Design elements”).

### 5. Rebuild

Content and flows stay. First the groundwork (include the tokens, shared parts, one model page), then the other pages. If a value is missing from the colour fan, you add it there, not in the page's code. If the site is already live, you first show the changed pages as a draft and get the approval to build (skill `entwurf`); then the skill `webseite-aendern` applies.

### 6. Screenshots and sign-off

Take a screenshot of every page, at phone width and desktop width, light and dark. If the site isn't on the web yet, use the address of the preview (`http://localhost:4321`):

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Look at every screenshot yourself and compare it with the draft: on the phone, does the text have room on the left and right? Is nothing cut off or out of place? Does the menu fit on one line? Does the computer view not look empty, with a narrow column in the middle? Only then show it to the person. After their yes: logbook (skill `git-logbuch`), conveyor belt (skill `pipeline`).

## Stumbling blocks

- Looks before how it works, or before the layout: that sets the faults in stone.
- Three directions that only differ in colour: not a real choice.
- Colours by hand in the code or in the sample sheet: then dark mode breaks, and the sample sheet shows something different from the pages.
- Contrasts estimated instead of recalculated.
- Showing the sample sheet only on a computer: the header with menu on a phone is part of it.
- Saying “done” without having looked at the pages or screenshots yourself.

## Check the mission

`mission_pruefen` with `webseite-04-gestaltung`. The check looks at whether the project has reached at least the step “Drafts” on the island; in the flight plan you only report it once the person has seen the sample sheet.

## Final message

Your last message in this step starts with one sentence on the picture “first the foundations, then the facade” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next; in the flight plan that's P7, the whole site as a draft to click through (skill `entwurf`).
