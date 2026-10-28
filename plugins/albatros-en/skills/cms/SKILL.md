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

Three levels, always take the simplest one that's enough:

| Level | What | Good if |
|---|---|---|
| A: texts in the project | content as Markdown files in the repo, the AI changes them | one person with AI looks after everything, rare changes |
| B: noticeboard via your logbook | an editing window in the browser (e.g. Decap CMS) that changes the files in the repo | others should change texts, but no database is needed |
| C: own CMS | a program with a database on the server, e.g. Strapi | lots of entries, several roles, image management, later an app too |

If A or B is the answer: write that in `docs/plan.md` and stop here. That's a good result. Level C needs an own server, so Pilot. With Light, A and B work.

## 2. Set up Strapi (level C)

### Before

- Strapi needs memory. Check with `free -h` on the server whether at least about 1 GB is free. Otherwise get more power first (skill `kosten`).
- Take a photo: tool `snapshot` with the name `vor-cms` (skill `zurueck-auf-gestern`).

### Set up

1. Locally, create a Strapi project in the repo's `cms/` folder (current instructions: `npx create-strapi@latest cms`), with SQLite as the database. The database file doesn't go into the logbook (`.gitignore`).
2. In `compose.yaml`, add a service `cms`: container name `cms`, port only on the inside (`127.0.0.1:1337:1337`), a volume for the database and uploaded pictures. Secrets (`APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`) as environment variables from a `.env` on the server, never in the repo (skill `sicherheit`).
3. Logbook and conveyor belt (skills `git-logbuch`, `pipeline`). After that, on the server: `docker ps` shows `cms`.

### The secret passage to the noticeboard

The editing area isn't public. The person reaches it through a tunnel. Picture: a secret passage from their computer straight into the hallway, which nobody from the street walks past.

```bash
ssh -L 1337:localhost:1337 {name}@aufwind.sh
```

As long as this window is open, they open `http://localhost:1337/admin` in the browser. The first time, they create the admin account there themselves. They only type the password there.

### Connect the content

1. Create a content type with the person (e.g. “Event” with title, date, place, text, picture).
2. The website fetches the entries while building via `http://cms:1337/api/...` from the same Docker network. An API token with read-only rights, stored as a secret on the server.
3. New entries appear after the next build. If you want it instantly: a webhook in Strapi that triggers the build. That only comes when it really gets in the way.

## Stumbling blocks

- Admin area put openly on the internet: an invitation for attackers. Use the tunnel.
- Forgotten updates: update Strapi regularly, take a photo first.
- Pictures only inside the container: without a volume they're gone after the next restart.

## Check the mission

`mission_pruefen` with `webseite-04-cms`. The check looks at whether the container `cms` is running. If the person has deliberately decided on level A or B, tell them they may skip this mission. That's a good decision, not a gap.

## Final message

Your last message in this step starts with one sentence on the picture “the noticeboard in the hallway” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
