---
name: webseite-modernisieren
description: "Modernises an existing website (a club, a shop, a practice, an old Jimdo, Wix or WordPress site) for a person with no prior knowledge. Gets going straight away with the inventory, without asking first: all pages, every feature (forms, sign-ups, dates, PDFs, prices, galleries, maps, languages) and all content, with screenshots of the old site in docs/bestand.md. Only then asks what only the person knows, and leads via plan and design to the new site, without any feature getting lost unasked. Use this skill for “Modernise …”, “Modernize …”, “modernise our website”, “our site is out of date”, “renew our website”, “relaunch”, “move away from Jimdo, Wix or WordPress”, “redo the old site”, and straight away when someone just sends the address of a website (https://…), with no other words."
---

# Modernise a website: renovating an old house

## The picture

An old house gets renovated, not torn down. First someone goes through every room with a notepad and a camera: what's there, what works, what's rotten, and what the family holds sacred, the tiled stove for example. Only with this inventory plan does the rebuilding start. And no wall comes down without the family saying yes.

**How to use the picture:** One sentence about it in your first answer, together with what you're doing right now.

## How you talk

- **Get going straight away.** If the person sends an address or “Modernise …”, you don't ask what they want. You say in one sentence that you're now looking at every room of the old site and roughly how long that takes, and you start.
- The person never has to know what the next step is. You suggest it and do it after a quick yes.
- Casual “you”, everyday language. Instead of “sitemap” say “list of all pages”, instead of “form backend” say “where the enquiries go”.
- You only ask what only the person knows. Anything that's on the site, you look up yourself.
- Never ask for passwords, not even the login for the old site. Whatever is behind a login, you note as “can't be seen”.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. Inventory, without asking first

The working folder is a new folder in the current folder, named after the site (for example `curling-grindelwald`). The inventory needs neither an account nor a server. Call `konto_status` first. If it shows an account, the very first thing you do is open the island in the browser, with `open https://albatros.build/en/cockpit/insel` (skill `webseite-bauen`, section “The island”). With no answer or no account, carry on without the island.

1. **Read all pages.** The script `bestand.mjs` is in this skill's folder (in Claude Code the path is shown at the top as “Base directory for this skill”). It only needs Node:
   ```bash
   node <folder-of-this-skill>/bestand.mjs https://www.beispiel.ch docs/bestand
   ```
   It reads `sitemap.xml`, follows the links on the same address and saves: `docs/bestand/bestand.json` (pages, forms with their fields, embeds, email, phone, prices, times, documents, third-party services), the text of every page in `docs/bestand/seiten/`, and pictures and documents in `docs/bestand/dateien/`. Without Node, you fetch the list of pages with `curl -sL https://www.beispiel.ch/sitemap.xml` and each page one by one.
2. **Screenshots of the old site.** A screenshot of every page in the menu, at phone and desktop width. The first time, Playwright downloads a browser (about 150 MB):
   ```bash
   npx -y playwright install chromium
   npx -y playwright screenshot --viewport-size=390,844 --full-page https://www.beispiel.ch/ docs/bestand/fotos/start-390.png
   npx -y playwright screenshot --viewport-size=1440,900 https://www.beispiel.ch/ docs/bestand/fotos/start-1440.png
   ```
   Look at every screenshot yourself. They show what the texts don't say: how tidy it is, the pictures, whether it works on a phone.
3. **Find every feature.** Go through the texts and screenshots with this list, and for each point note where it is and how it's built today:
   - Forms: contact, sign-up, reservation, order, a board for finding players or partners, guestbook. Which fields, where do the enquiries go?
   - Dates: calendar, tournaments, courses, training times, opening hours, season.
   - Documents: PDFs (tournament announcements, rankings, statutes, menus), how many, how old.
   - Prices, membership fees, rates.
   - Pictures: galleries (albums, how many), logos, sponsors with links.
   - Embeds and third-party systems: map, video, booking system, shop, newsletter, social media, weather, webcam (`einbettungen` and `fremdeDienste` in `bestand.json`).
   - Areas with a login, languages, legal notice and privacy policy, links to other sites.

### 2. The inventory plan `docs/bestand.md`

```markdown
# Inventory: <name of the site>

**Address:** … · **recorded:** <date> · **built with:** <e.g. Jimdo> · **Pages:** <number> · **Languages:** …

## Pages
| Page | Address | What's on it, in one sentence | Condition | Screenshot |
|---|---|---|---|---|

## Features
| Feature | Where | How it works today | Must stay? | Decision |
|---|---|---|---|---|
| Contact form (name, email, message) | /kontakt | Jimdo form | yes | open |

## Content
Texts, pictures (how many, own or someone else's), documents, logos, sponsors.

## What's out of date
Every point with evidence, for example “news from 2019 on the home page”, “pictures blurry on a phone”, “guestbook full of spam”.

## What has to stay
What visitors need and what's good.

## Open questions
```

The **Decision** column stays “open” until the person has decided: “stays”, “new as …” or “dropped (decided on <date>)”. No feature disappears from the new site as long as there's no decision like that here.

`docs/bestand/dateien/` doesn't go into the logbook: it's too big and contains material other people hold the rights to. Add it to `.gitignore`. Whatever the new site needs from it, you copy over specifically later.

### 3. Report back, then only three questions

Say in simple words what you found, briefly and with numbers: how many pages, which features, what's out of date, what's good. Then you only ask the questions that only the person can answer, numbered, in one message:

1. **Who looks after the site** today and in future, and how often does something change?
2. **What's sacred?** What has to stay exactly as it is (logo, colours, a text, a page, a feature)?
3. **Who should come more?** Guests, new members, sponsors, teams for tournaments?

Everything else you suggest yourself, with marked assumptions (`[Assumption: …]`) that the person can correct.

### 4. From inventory to plan

Follow the skill `webseite-planen`. Most of the answers are already in the inventory: take them over and just let the person confirm them. Every feature from the inventory goes into the plan, with a suggestion:

- Anything that only needs texts and files (dates, tournaments, PDFs, prices, sponsors, gallery) becomes a normal static site, even with several languages (Light is enough).
- Forms: an email link is often enough. If the list of sign-ups should be saved, that's a building block (skill `bausteine`, with Pilot).
- A guestbook full of spam, or a login that only the old technology needed, may be dropped, but only with the person's decision.
- Old addresses that others link to (tournament announcements, rankings, Google results) stay the same or get a redirect.

You enter the decisions in `docs/bestand.md` (Decision column) and in `docs/plan.md`.

### 5. Building in eight steps

From here you follow the skill `webseite-bauen`, in its fixed order: brief, mockup, design system, tech stack, PRD with acceptance criteria, local build, four checks, release, harbour, conveyor belt and live. Your brief is `docs/bestand.md`. On top of that:

- The PRD lists every feature from `docs/bestand.md`, with its decision. None is dropped silently.
- For the design, you read the screenshots of the old site as well: what's sacred (logo, colours)? What looks out of date?
- After the local build, you show before and after side by side, the home page and the most important subpage, on a phone and on a desktop, with three sentences on what's better and what's stayed the same.
- The old address only points to the new site once the new one is running (skill `domain`).

## Rights

Texts, photos and logos on the old site belong to someone, usually the club or the business, sometimes a photographer. Anyone modernising a site that doesn't belong to them needs the permission of the people who run it before any of it is published. The downloaded files are a working copy for looking at. Photos with recognisable people need those people's consent. That's why, before publishing, you ask: “Do the texts and pictures belong to you, or do you have permission, for example from the committee?”

## Stumbling blocks

- A feature gets lost silently: a form replaced by nothing, rankings no longer findable. At the end, check every row in the inventory.
- Old addresses break: tournament announcements and rankings are often linked from other sites.
- Taking over a gallery with thousands of pictures one to one: better a selection of the best, made smaller; the rest stays in the archive.
- Looking like AI: read the list of typical traits in the skill `gestaltung` before you build the first page.
- Taking over the old site's cookie banner: a static site without tracking and without third-party embeds sets no cookies and doesn't need one. The privacy policy is enough. A banner only comes in when something needs consent, for example an embedded Google map. Instead of the map, a “Plan your route” link with the address is usually enough, and the site stays without a banner.

## Final message

Your last message in this step starts with one sentence on the picture “renovating an old house” that sums up the core once more. Then: what's been found or built, where it is (`docs/bestand.md`, screenshots), what the person still has to decide and what comes next.
