---
name: blog
description: "Sets up a blog on an Astro site with a person who has no prior knowledge and writes posts with her: each post a Markdown file in the logbook (web/src/content/blog/<slug>.md with title, date, description, bild), the person tells the idea, Bert writes the file, she reads it in the preview and clicks publish in Albatros. With a template for family recommendations (for whom, what, when and weather, getting there, cost, my tip, link) and rules for her own photos. Use this skill for “blog”, “blog post”, “new post”, “write an article”, “publish a recommendation”, “write up a day-trip tip”, “news on my site”."
metadata:
  stand: 0.3.3
  quelle: '040425d83711'
---

# Blog: the binder of day-trip sheets

## The picture

A binder stands on the shelf. Each outing is a sheet in it, always labelled the same at the top: title, date, one sentence about what it is. New sheets go in at the front, old ones stay. The website reads the binder and shows each sheet nicely.

**How to use the picture:** tell the person in one sentence in your first answer.

## How you talk

- Informal “you”, short sentences, numbered steps, at most two questions per message.
- You explain **Markdown** like this: a simple text in which `**bold**` becomes bold. The person needs to know no more.

## Where the posts live

Each post is a file in the logbook: `web/src/content/blog/<slug>.md`. The `<slug>` is the title in lower case with hyphens, for example `seilpark-mit-kindern`; it becomes the address `/blog/seilpark-mit-kindern/`. This is the simplest level from the skill `cms` (texts in the project): no CMS, no database, Bert writes the files. If others are to write without Bert later, the skill `cms` shows the next step.

**Before the two yeses** (plan confirmed, draft approved; `naechstes` says `bauen_erlaubt: false`) you build nothing on the site. Write a post as a draft to `docs/beitraege/<slug>.md` instead, with the same header (title, date, description). After the two yeses you move it to `web/src/content/blog/`. Albatros checks both places the same way.

## 1. Set up the blog once

The blog is a part of the site like any other. If the site is still being planned, it goes into the build list (skill `webseite-planen`) and is built with the skill `webseite-bauen`. If the site is already online, it is a big change (skill `webseite-aendern`). It is built like this (Astro 7, measured on 13.11.2026 with 7.4.11):

1. `web/src/content.config.ts` describes the header of each post:
   ```ts
   import { defineCollection } from 'astro:content';
   import { glob } from 'astro/loaders';
   import { z } from 'astro/zod';

   const blog = defineCollection({
     loader: glob({ pattern: '*.md', base: './src/content/blog' }),
     schema: ({ image }) => z.object({
       title: z.string(),
       date: z.coerce.date(),
       description: z.string().max(160),
       bild: image().optional(),
       bildtext: z.string().optional(),
       widget: z.string().optional(),
     }),
   });

   export const collections = { blog };
   ```
2. `web/src/pages/blog/index.astro` shows all posts, newest first (`getCollection('blog')`, sorted by `date`).
3. `web/src/pages/blog/[slug].astro` shows one post in the layout of the site:
   ```astro
   ---
   import { getCollection, render } from 'astro:content';
   import { Image } from 'astro:assets';
   import SwissActivities from '../../components/SwissActivities.astro';
   export async function getStaticPaths() {
     return (await getCollection('blog')).map((b) => ({ params: { slug: b.id }, props: { b } }));
   }
   const { b } = Astro.props;
   const { Content } = await render(b);
   ---
   <article>
     <h1>{b.data.title}</h1>
     {b.data.bild && <Image src={b.data.bild} alt={b.data.bildtext ?? ''} width={1200} />}
     <Content />
     {b.data.widget && <SwissActivities widgetId={b.data.widget} />}
   </article>
   ```
   The line with `SwissActivities` is only there if the site shows SwissActivities offers (skill `swissactivities`).
4. Look only with the values from `design/tokens.css` and the components of the site.

## 2. Write a post

1. **The person tells the idea:** where were you, with whom, what did you experience? If she has photos, she puts them in the chat or in the project folder.
2. **Bert gets the facts.** For an outing with the skill `swissactivities`: age, weather, price with date, getting there, link. Nothing from memory.
3. **Bert writes the file** following the template below. What the person experienced he writes in her words. If something is missing, he asks instead of inventing it.
4. **The person reads it in the preview.** Bert starts it with `vorschau_starten` (without the app: `cd web && npm run dev`). She says what should be different; Bert changes it.
5. **Bert checks** with `node scripts/pruefen.mjs` and makes an entry in the logbook: `git add web && git commit -m "Blog: <title>"`.
6. **The person clicks the publish button in Albatros.** Bert does not run `git push`. Without the app, the skill `webseite-aendern` applies (release, then push).
7. **Then share:** Bert writes posts for Instagram and the rest as drafts (skill `kanaele`).

## Template: family recommendation

```markdown
---
title: "Rope park with kids: our Saturday"
date: 2026-11-14
description: "One sentence about what it is. Google and the preview when sharing show it."
bild: ../../assets/blog/seilpark.jpg
bildtext: "Two children in the rope park, seen from behind"
widget: ""
---

**For whom:** from … years according to the provider. Our children were … and … years old.

**What:** …

**When and weather:** indoors or outdoors, in the rain …

**Getting there:** from … by train about … minutes, … changes (as of <DD.MM.YYYY>).

**Cost:** CHF … for … on <date>, checked on <DD.MM.YYYY>.

**My tip:** … (only what the person experienced herself)

**Link:** [View the offer](<booking_url exactly as returned>)
```

The field names in the header (`title`, `date`, `bild` …) stay as they are; the text is in the language of the site. Empty fields are left out: `widget` only with a widget ID, `bild` only with a photo.

## 3. Photos

1. **Only her own photos** or ones she has permission for. Never pictures from the internet.
2. **Children:** best from behind or without faces. Recognisable people only with their consent, for children with their parents’ consent (skill `recht-ch`).
3. **Where:** `web/src/assets/blog/`, a name without spaces. Astro makes the picture smaller when building.
4. **Picture text:** `bildtext` says in one sentence what can be seen. A screen reader reads it out.

## Stumbling blocks

- An experience nobody had: the site lives from real tips. Better shorter and true.
- Prices without a date: they go out of date. Always with “checked on”.
- Date in the header written wrongly (`14.11.2026` instead of `2026-11-14`): the build stops. Bert writes it as in the template.

## Final message

Your last message in this step starts with a sentence about the picture “the binder of day-trip sheets” that says the core once more. Then: what is done, where the post is, what is still open and what comes next.
