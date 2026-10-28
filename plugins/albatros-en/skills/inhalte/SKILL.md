---
name: inhalte
description: "Helps a person with no prior knowledge write and choose texts and pictures for their website: the home page in three sentences, short texts for people reading on their phone, own photos instead of stock images, picture rights and image size, bringing AI texts into their own voice. The result is a content list in docs/inhalte.md and the texts on the site. Use this skill for “write the texts”, “what do I put on my home page”, “about us”, “pictures for my website”, “am I allowed to use this picture”, “this text sounds like AI”, “content”."
---

# Content: the goods in the shop window

## The picture

The website is a shop window. Design is the lighting and the decoration. The content is the goods. A beautiful shop window with empty shelves sells nothing. That's why content comes before design.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, short, concrete. Never finish texts over the person's head: you make suggestions, they decide and change. In the end, every text has to sound the way they talk.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. Content list from the plan

Take the pages from `docs/plan.md` (skill `webseite-planen`). Create `docs/inhalte.md`, for each page: heading, two or three core sentences, pictures, the button to the main thing, status (draft, done).

### 2. The home page in three sentences

Whoever lands on the home page decides within a few seconds whether to stay. The three sentences at the top have to answer:

1. **What is this?** (“Lunch club for schoolchildren in Wipkingen”)
2. **Who is it for and why is it good?** (“Freshly cooked, supervised, five minutes from the school”)
3. **What now?** A button with a doing word: “Ask for a place”, not “Learn more”.

### 3. Rules for texts on the web

- Short sentences, one thought per sentence. Most people read on their phone.
- The most important thing first. Details further down.
- Concrete instead of advertising speak: “We reply within 24 hours” instead of “first-class service”.
- Keep one way of addressing people throughout, casual or formal, depending on the audience.
- Subheadings people can skim.
- Numbers, prices, opening hours, address: better check them twice. Wrong details cost trust.

### 4. Texts with AI

The AI may write drafts. Then, together with the person:

- Cut everything they'd never say like that.
- Check every claim. Whatever isn't true or can't be backed up goes.
- Out with typical filler words and hollow superlatives (“innovative”, “tailor-made”, “seamless”).
- Build in a real sentence of theirs: an experience, a reason why they do this.

### 5. Pictures

- **Own photos beat stock images.** Real people, real place, daylight, a phone is enough.
- **Rights:** Only use pictures the person took themselves or has a licence for. A picture from Google search isn't free. Ask recognisable people first (the right to your own image), and for children, the parents.
- **Size:** Photos from a phone are far too big. Shrink them to at most about 2000 pixels wide and save them as WebP, e.g. with `cwebp -q 80 foto.jpg -o foto.webp` or an online tool of their choice. Goal: under 300 KB per picture.
- **A description for every picture** (alt text), see skill `barrierefreiheit`.

### 6. Put it on the site

Ask the person to check every detail in the text (times, directions, prices, names). You only know them from their description. Then texts and pictures into the project, into the logbook (skill `git-logbuch`) and, with Pilot, over the conveyor belt (skill `pipeline`) onto the server. Then look at it together on a phone, not just on the computer.

## Check the mission

`mission_pruefen` with `webseite-02-inhalte`. The check looks at whether `~/projekt/docs/inhalte.md` exists and the site answers at `https://{name}.aufwind.sh`.

## Final message

Your last message in this step starts with one sentence on the picture “the goods in the shop window” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next. Explicitly ask the person to bring the text into their own voice and to check every detail in it (times, directions, prices), because you only know them from their description.
