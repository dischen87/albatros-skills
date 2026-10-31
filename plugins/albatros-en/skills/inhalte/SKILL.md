---
name: inhalte
description: "Helps a person with no prior knowledge write and choose texts and pictures for their website, in the flight plan for the draft of the whole site (P7): the home page in three sentences, short texts in the tone from the concept for people reading on their phone, missing texts shown visibly as [placeholder], own photos instead of stock images with a photo list, picture rights and image size, bringing AI texts into their own voice. The result is a content list in docs/inhalte.md and the texts in the draft. Use this skill for “write the texts”, “what do I put on my home page”, “about us”, “pictures for my website”, “photo list”, “am I allowed to use this picture”, “this text sounds like AI”, “content”."
metadata:
  stand: 0.2.0
  quelle: '0b198ab95f73'
---

# Content: the goods in the shop window

## The picture

The website is a shop window. Design is the lighting and the decoration. The content is the goods. A beautiful shop window with empty shelves sells nothing. That's why the goods go into the model before anything gets built: only with real texts can you see whether the site holds up.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## In the flight plan

The texts are written in P7, as part of the draft of the whole site (skill `entwurf`, step “The texts”): what you write here goes straight into the pages in `design/entwurf/`. Already gathered: what the person has (`Inhalte vorhanden:` in `docs/recherche.md`, P2), how they sound and what they promise (`Ton:` and `Kern:` in `docs/konzept.md`, P5), and the photo list (in `docs/inhalte.md`, P5). You suggest the texts; whatever is missing appears as `[placeholder: what's missing, who delivers it by when]` in the draft, and the number of placeholders goes into the line `Seiten:` of `docs/entwurf.md`. The person confirms the texts while clicking through.

If the site is already live and a text should change, the skill `webseite-aendern` applies.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with assumptions marked `[Annahme: …]`. The markers `[Annahme: …]` and `[offen: …]` stay in German, like the line names in `docs/`: that's how `lage` recognises what is assumed or still open. Only ask about what's missing at the end.
- Casual “you”, short, concrete. Never finish texts over the person's head: you make suggestions, they decide and change. In the end, every text has to sound the way they talk.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. Content list from the plan

Take the pages from `docs/plan.md` (line `Seiten:`, skill `webseite-planen`). Create `docs/inhalte.md`, or add to it if it already exists with the photo list from P5: for each page, heading, two or three core sentences, pictures, the button to the main thing, status (draft, done, placeholder). You take how to address people and the tone from `docs/konzept.md`.

### 2. The home page in three sentences

Whoever lands on the home page decides within a few seconds whether to stay. The three sentences at the top have to answer:

1. **What is this?** (“Lunch club for schoolchildren in Wipkingen”)
2. **Who is it for and why is it good?** (“Freshly cooked, supervised, five minutes from the school”)
3. **What now?** A button with a doing word: “Ask for a place”, not “Learn more”.

### 3. Rules for texts on the web

- Short sentences, one thought per sentence. Most people read on their phone.
- The most important thing first. Details further down.
- Concrete instead of advertising speak: “We reply within 24 hours” instead of “first-class service”.
- Keep one way of addressing people throughout, casual or formal, depending on the audience (in the flight plan it's in `docs/konzept.md` under `Ton:`).
- Subheadings people can skim.
- Numbers, prices, opening hours, address: better check them twice. Wrong details cost trust.
- Whatever is missing, you don't make up. It appears visibly in the text, for example `[placeholder: opening hours, Anna delivers them by 7.11.2026]`, so nobody overlooks it.

### 4. Texts with AI

The AI may write drafts. Then, together with the person:

- Cut everything they'd never say like that.
- Check every claim. Whatever isn't true or can't be backed up goes.
- Out with typical filler words and hollow superlatives (“innovative”, “tailor-made”, “seamless”).
- Build in a real sentence of theirs: an experience, a reason why they do this.

### 5. Pictures

- **Own photos beat stock images.** Real people, real place, daylight, a phone is enough. What the person should photograph is in the photo list in `docs/inhalte.md`: what, where, who's in it, by when.
- **Rights:** Only use pictures the person took themselves or has a licence for. A picture from Google search isn't free. Ask recognisable people first (the right to your own image), and for children, the parents.
- **Size:** Photos from a phone are far too big. Shrink them to at most about 2000 pixels wide and save them as WebP, e.g. with `cwebp -q 80 foto.jpg -o foto.webp` or an online tool of their choice. Goal: under 300 KB per picture.
- **A description for every picture** (alt text), see skill `barrierefreiheit`.

### 6. Put it into the draft

Ask the person to check every detail in the text (times, directions, prices, names). You only know them from their description. Then texts and pictures go into the pages of the draft (`design/entwurf/`, pictures into `design/entwurf/bilder/`), and you look at them together on a phone, not just on the computer (skill `entwurf`). Building only starts after the approval to build (P8); then the skill `webseite-bauen` takes the texts over from the draft.

If the site is already built or live, new texts go through the skill `webseite-aendern`: change locally, show, release, then into the logbook (skill `git-logbuch`) and onto the web.

## Check the mission

`mission_pruefen` with `webseite-03-inhalte`. The check looks at whether the project has reached at least the step “Draft” on the island: the whole site is there with real texts to click through. The content list `docs/inhalte.md` in the project is part of it.

## Final message

Your last message in this step starts with one sentence on the picture “the goods in the shop window” that sums up the core once more. Then: what's done, where the result is, what's still open (the placeholders, with names and dates) and what comes next. Explicitly ask the person to bring the text into their own voice and to check every detail in it (times, directions, prices), because you only know them from their description.
