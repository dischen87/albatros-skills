---
name: gestaltung
description: "Reworks how a small website works and looks, with a person who has no prior knowledge, step by step with their AI. First a check from three angles (flows, access, states and language), then fixing how it works, then the site's character instead of favourite colours, three clearly different directions to choose from, a check against the typical AI look, fixed values for colours, type and spacing (tokens), the question about design elements (icons, illustrations, photos, mascot, 3D, on request with the Albatros image tools) and rebuilding all pages with screenshots at phone and desktop width. Use this skill for “design”, “it looks boring”, “it looks home-made”, “it looks like AI”, “vibe coded”, “make it look nicer”, “colours”, “fonts”, “redesign”, “three versions”, “it looks unprofessional”, “layout”, “icons”, “illustrations”, “mascot”, “3D”."
---

# Design: first the foundations, then the facade

## The picture

When you do up an old house, you don't paint the facade first. The foundations come first: doors that stick, stairs without a handrail, light switches in the wrong place. Only once the house is good to live in does the painting start. New paint over broken doors just makes the faults look prettier.

For the facade there's then a **colour fan**: a small collection of fixed colours, fonts and spacings. Everything in the house gets painted with these and nothing else. The technical word for it is **tokens**.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- If the person wants it “nicer” or “different colours”, your first answer is always: the picture of the foundations before the facade, and the way there in five steps. Only after that do you ask where the site is and how you get to it.
- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, short. Every criticism needs evidence: which page, which spot, ideally a screenshot. “Looks busy” on its own doesn't count.
- Taste is the person's call. You put forward directions and say honestly what each one does well and what its risk is.
- The person's own requirements (logo, house colour, how they address people, mandatory texts) come before any design tip.
- Nothing gets published before the person has seen the screenshots and said yes.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

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

1. **Character before colours.** Ask about qualities, not favourite colours. Put pairs of opposites forward to choose from, to suit the site: traditional or sporty, mountain village or city, calm or lively, refined or down-to-earth, for guests or for members. Plus one question: which three words should visitors think after ten seconds? Write the answers down in `docs/gestaltung/richtungen.md`. Each of the three directions stresses different ones of these qualities. Colours follow from them and from the logo and surroundings, never the other way round.
2. **Examples:** look at the two or three sites from the plan. What do they do well? What don't we copy (their logo, colours, font)?
3. **Diagnosis:** Why doesn't today's look work? Typical: all headings equally loud, two styles side by side, one colour with several meanings, spacing that keeps changing.
4. **Three clearly different directions**, not just three colours. They differ in idea, font, the role of colour, shapes and depth. Example: “Soft” (warm, round), “Clear” (calm like a newspaper), “Bold” (blocks of colour, big headings).
5. Each direction shows **the same two or three pages** (home, most important subpage, contact) with real texts. Placeholder text skews the judgement.
6. The same in all directions: logo, mandatory texts, one main button per page, accessibility.

`docs/gestaltung/richtungen.md`: at the top the line `Entscheid: <direction or mix> (<date>)` (“Entscheid” means decision; keep the word `Entscheid:` exactly as it is, because the mission check looks for it), below it the diagnosis and one table per direction (idea, font, colours, shapes, strength, risk). The drafts as HTML files in `docs/gestaltung/entwuerfe/`, so the person can open them in the browser.

### Don't look like AI

AI sites give themselves away with the same traits. Check every draft and the finished site against this list and write the result in `docs/gestaltung/richtungen.md` (line `AI traits checked: …`):

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

Check for the pattern, not the wording: one button instead of two, or cards stacked instead of side by side, is the same trait. For this you look at the screenshots, not just the code.

Instead: one single signature mark, used sparingly (a stroke under one word in the heading, a highlighter on at most one word per section), real photos of the place and the people, a font with character that suits the qualities, colours from the logo and surroundings, a structure that comes from the content (if dates are the main thing, they go at the top), and concrete sentences with names, numbers and places. In the code you find gradients and default fonts with `grep -rnE "linear-gradient|radial-gradient|Inter" src`. Emoji and filler phrases you look for in the texts, the rest in the screenshots.

### 4. The colour fan (tokens)

One file `tokens.css` with CSS variables: colours for light and dark, fonts, font sizes, spacing, rounded corners. One sentence of comment per block saying why. Rules:

- One action colour for everything clickable, and nowhere else.
- Calculate contrast, don't estimate it: text at least 4.5 : 1, buttons and borders at least 3 : 1 (formula in the skill `barrierefreiheit`). Put the values in as comments.
- Dark mode only swaps the colour variables (`@media (prefers-color-scheme: dark)`).
- Outside `tokens.css`, no colour and no font size is written into the code by hand.
- **Type:** two families at most, a heading font with character and a calm body font, self-hosted (woff2, `font-display: swap`). Text 16 to 17 px with a line height of 1.5, nothing under 12 px. Big headings with a line height of 1.0 to 1.1 and set slightly tighter (−0.01 to −0.03 em), smaller on the phone with `clamp()`. Bold (700) only for the biggest headings, otherwise semi-bold (600). Prices and times with `font-variant-numeric: tabular-nums`.
- **Spacing** only from one scale: 4, 8, 12, 16, 24, 32, 48 px (bigger for sections). Content at most about 1200 px wide, a 16 px margin on the phone. On a computer the header and sections use this width; only running text stays narrow (about 70 characters per line).
- **Rounded corners:** three steps by size (field, card, large surface), always smaller inside than outside. Buttons either all round or all square.
- **Depth:** one method for the whole site, either surfaces with a shadow or a fine line without a shadow. Shadows tinted in the text colour, never grey, two levels at most. The background is slightly warm, cards are white.
- **Motion:** press 90 to 100 ms, transitions 160 to 200 ms, one movement per event. With “Reduce motion”, only cross-fades.
- **Focus:** 2 to 3 px in the action colour with a 2 px gap, at least 3 : 1 on every background.
- **The error colour** only for errors and anything urgent.

### Design elements: always ask

Once the direction is settled, you always ask: “Would you like any design elements as well?” Put the options forward with the effort each one takes:

- **Icons:** one single, consistent set (for example Lucide or Phosphor), never emoji and never two sets mixed.
- **Illustrations:** a few, in the same style, for empty spots and explanations.
- **Your own photos:** a photo list of what the person should photograph (the place, people in action, details). Real photos beat any generated picture.
- **A mascot:** a character that guides people through the site. First a sheet with four to six poses of the same character, one for each moment (welcome, searching, success, empty), then rules for when it appears: never with errors, cancellations or delicate moments, never next to photos of people, never behind lists or forms. Size: at most half the width for the welcome, small otherwise. It's decoration (`alt=""`); the sentence next to it works without it too. Animated clips only load once they're visible, play for 5 seconds at most and then stop (WCAG 2.2.2). You look at every picture yourself, zoomed in too.
- **3D:** an object or the character as a 3D model, only in the header of the home page and only from tablet width up. A still image comes first; the 3D only loads once the header is visible. On a phone, without a graphics card or with “Reduce motion”, the still image stays.

**Plain doesn't mean without pictures.** If the person wants no icons, illustrations or characters, you still suggest a real photo for the header of the home page (the place, people in action) and give them the photo list. A photo is content, not decoration. If they don't have one yet, the header carries the most important content instead of a colour block with a heading (for example the next date, large), and the photo list goes into `docs/gestaltung/richtungen.md` under “Open”. If they don't want photos either, their sentence goes there.

Whatever the person picks goes into `docs/gestaltung/richtungen.md` and into the colour fan (sizes, spacing, rules).

**With Albatros**, pictures, cut-out characters and 3D models are made with the Albatros tools, paid from the person's credit (cost price plus 35 %):

- `bild_erzeugen` with `beschreibung` (the description) and `format` (`quadrat` square, `quer` landscape, `hoch` portrait or `breit` wide), `bild_freistellen` with `bild_url` (a picture with a transparent background), `modell_3d` with `bild_url` (a 3D model as GLB, ideally from a cut-out picture).
- `guthaben` shows the balance, the prices and the link to top up. You only give prices from this answer.
- Before the first call that costs something, you call `guthaben`, give the price and ask once: “A picture costs CHF …, your credit is enough for … Shall I?” After that, after every call you briefly give the cost and what's left, without asking again. If the credit isn't enough, pass on the link to top up.
- You save every result in the project straight away (`curl -o web/public/bilder/<name>.png <url>`), because after 7 days it's gone. For a variant you change the description: the same description returns the same picture for 15 minutes, at no extra cost.
- You look at every generated picture yourself before you show it to the person. Only what they've chosen goes on the site.
- If a tool answers “kommt bald” (coming soon), you carry on without the image tools (below).

**With their own Hugging Face account** it works too, as an alternative. The person creates the account themselves and signs in themselves. You add the official server: `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. With Codex it's `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, with Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, with Cursor the entry `"huggingface": { "url": "https://huggingface.co/mcp?login" }` under `mcpServers` in `~/.cursor/mcp.json`. They choose the Spaces for pictures, cutting out and 3D at huggingface.co/settings/mcp. For free there are 5 minutes of computing time a day. Without signing in, the server only offers search in the Hub.

**Rights:** Every model has a licence; read it on the model page before a picture goes on the site. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) and TRELLIS (MIT) also allow commercial use, FLUX.1 dev only non-commercial use. Generated pictures show no real people and no other people's logos. Real places and people come from the person's own photos, with consent.

**Without image tools** the path works just the same: icons from a free set, your own photos, illustrations from a free collection with a clear licence, a mascot drawn by hand or later, no 3D.

### 5. Rebuild

Content and flows stay. First the groundwork (include the tokens, shared parts, one model page), then the other pages. If a value is missing from the colour fan, you add it there, not in the page's code.

### 6. Screenshots and sign-off

Take a screenshot of every page, at phone width and desktop width, light and dark. If the site isn't on the web yet, use the address of the preview (`http://localhost:4321`):

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Look at every screenshot yourself and compare it with the draft: on the phone, does the text have room on the left and right? Is nothing cut off or out of place? Does the menu fit on one line? Does the computer view not look empty, with a narrow column in the middle? Only then show it to the person. After their yes: logbook (skill `git-logbuch`), conveyor belt (skill `pipeline`).

## Stumbling blocks

- Looks before how it works: that sets the faults in stone.
- Three directions that only differ in colour: not a real choice.
- Colours by hand in the code: then dark mode breaks.
- Saying “done” without having looked at the screenshots yourself.

## Check the mission

`mission_pruefen` with `webseite-04-gestaltung`. The check looks at whether `~/projekt/docs/gestaltung/richtungen.md` contains a decision (the line starting with `Entscheid:`) and the site answers.

## Final message

Your last message in this step starts with one sentence on the picture “first the foundations, then the facade” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
