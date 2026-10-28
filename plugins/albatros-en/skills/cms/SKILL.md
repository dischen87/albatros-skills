---
name: cms
description: "Helps a person with no prior knowledge decide whether their website needs a system for looking after content (CMS), and sets one up if needed, e.g. Strapi in Docker on the Albatros server, reachable through a secure tunnel. Explains a CMS with the picture of a noticeboard. Use this skill for “CMS”, “Strapi”, “change the content myself without code”, “blog”, “news”, “keep events up to date”, “my colleague should be able to change the texts”, “WordPress”, “admin area”."
---

# CMS: the noticeboard in the hallway

## The picture

A CMS is a noticeboard in the hallway. Anyone who wants to share something pins up a note, without rebuilding the wall. The website reads the notes and shows them nicely.

A noticeboard is worth it when notes come often and from different people: events, news, products, menus. For a site that changes twice a year, it's a piece of furniture that just takes up space.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, short. Honestly advise against it if no noticeboard is needed. Every extra piece of software is something that wants looking after, backing up and updating.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## 1. Does it need a CMS at all?

Ask three things:

1. How often does the content change? (weekly or more often → more likely yes)
2. Who changes it? (people without a terminal → more likely yes)
3. Are there lots of entries of the same kind? (events, products, posts → more likely yes)

Four levels, always take the simplest one that's enough:

| Level | What | Good if |
|---|---|---|
| A: texts in the project | content as Markdown files in the repo, the AI changes them | one person with AI looks after everything, rare changes |
| B: noticeboard via your logbook | an editing window in the browser (e.g. Decap CMS) that changes the files in the repo | others should change texts, but no database is needed |
| C: small noticeboard | PocketBase on the server, entries with title, date, text and picture | others look after news or dates, few fields, hardly any memory (about 20 MB) |
| D: big CMS | Strapi with its own database on the server | lots of content types, several roles, image management, later an app too (about 200 MB, build up to 2.5 GB) |

If A or B is the answer: write that in `docs/plan.md` and stop here. That's a good result. C and D need an own server, so Pilot. With Light, A and B work. C and D are ready-made building blocks; you build them in with the skill `bausteine` (recipe `pinnwand` or building block `strapi`).

## 2. Set up Strapi (level D)

Strapi comes as a ready-made building block with its own Postgres database: skill `bausteine`, section “Strapi”. The most important points up front, so you can explain them to the person:

- **Memory:** While running, Strapi with its database needs about 200 MB, and up to 2.5 GB while building. The first build takes about 7 minutes. Check with `free -h` whether enough is free for building. A photo first: tool `snapshot` with the name `vor-cms`.
- **Secrets** are created by `bausteine/strapi/geheimnisse.sh` directly on the server, never in the logbook (skill `sicherheit`).
- **Content types** you write as files under `bausteine/strapi/cms/src/api/`; on the server they can't be clicked together. Pattern: recipe `veranstaltungen`.
- **The secret passage to the noticeboard:** The admin area isn't public. The person reaches it through a tunnel. Picture: a secret passage from their computer straight into the hallway, which nobody from the street walks past.

  ```bash
  ssh -N -L 1337:localhost:1337 {name}@aufwind.sh
  ```

  As long as the tunnel is open, they open `http://localhost:1337/admin`. The first time, they create the account there themselves. They only type the password there.
- **Content on the site:** Whatever is listed in `OEFFENTLICH` (`bausteine/strapi/cms/src/index.ts`), the site reads at `/cms/api/…` on its own address, straight after publishing. A new build isn't needed for that.

## Stumbling blocks

- Admin area put openly on the internet: an invitation for attackers. Use the tunnel.
- Forgotten updates: update Strapi regularly, take a photo first.
- Pictures only inside the container: without a volume they're gone after the next restart.

## Check the mission

`mission_pruefen` with `webseite-04-cms`. The check looks at whether the container `cms` is running (Strapi). If the person has deliberately decided on level A, B or C, tell them they may skip this mission. That's a good decision, not a gap.

## Final message

Your last message in this step starts with one sentence on the picture “the noticeboard in the hallway” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
