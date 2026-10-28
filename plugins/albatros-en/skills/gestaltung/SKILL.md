---
name: gestaltung
description: "Reworks how a small website works and looks, with a person who has no prior knowledge, step by step with their AI. First a check from three angles (flows, access, states and language), then fixing how it works, then three clearly different directions to choose from, fixed values for colours, type and spacing (tokens), and rebuilding all pages with screenshots at phone and desktop width. Use this skill for “design”, “it looks boring”, “it looks home-made”, “make it look nicer”, “colours”, “fonts”, “redesign”, “three versions”, “it looks unprofessional”, “layout”."
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

### 3. Three directions

1. **Examples:** look at the two or three sites from the plan. What do they do well? What don't we copy (their logo, colours, font)?
2. **Diagnosis:** Why doesn't today's look work? Typical: all headings equally loud, two styles side by side, one colour with several meanings, spacing that keeps changing.
3. **Three clearly different directions**, not just three colours. They differ in idea, font, the role of colour, shapes and depth. Example: “Soft” (warm, round), “Clear” (calm like a newspaper), “Bold” (blocks of colour, big headings).
4. Each direction shows **the same two or three pages** (home, most important subpage, contact) with real texts. Placeholder text skews the judgement.
5. The same in all directions: logo, mandatory texts, one main button per page, accessibility.

`docs/gestaltung/richtungen.md`: at the top the line `Entscheid: <direction or mix> (<date>)` (“Entscheid” means decision; keep the word `Entscheid:` exactly as it is, because the mission check looks for it), below it the diagnosis and one table per direction (idea, font, colours, shapes, strength, risk). The drafts as HTML files in `docs/gestaltung/entwuerfe/`, so the person can open them in the browser.

### 4. The colour fan (tokens)

One file `tokens.css` with CSS variables: colours for light and dark, fonts, font sizes, spacing, rounded corners. One sentence of comment per block saying why. Rules:

- One action colour for everything clickable, and nowhere else.
- Calculate contrast, don't estimate it: text at least 4.5 : 1, buttons and borders at least 3 : 1 (formula in the skill `barrierefreiheit`). Put the values in as comments.
- Dark mode only swaps the colour variables (`@media (prefers-color-scheme: dark)`).
- Outside `tokens.css`, no colour and no font size is written into the code by hand.

### 5. Rebuild

Content and flows stay. First the groundwork (include the tokens, shared parts, one model page), then the other pages. If a value is missing from the colour fan, you add it there, not in the page's code.

### 6. Screenshots and sign-off

Take a screenshot of every page, at phone width and desktop width, light and dark:

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Look at every screenshot yourself and compare it with the draft. Only then show it to the person. After their yes: logbook (skill `git-logbuch`), conveyor belt (skill `pipeline`).

## Stumbling blocks

- Looks before how it works: that sets the faults in stone.
- Three directions that only differ in colour: not a real choice.
- Colours by hand in the code: then dark mode breaks.
- Saying “done” without having looked at the screenshots yourself.

## Check the mission

`mission_pruefen` with `webseite-03-gestaltung`. The check looks at whether `~/projekt/docs/gestaltung/richtungen.md` contains a decision (the line starting with `Entscheid:`) and the site answers.

## Final message

Your last message in this step starts with one sentence on the picture “first the foundations, then the facade” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
