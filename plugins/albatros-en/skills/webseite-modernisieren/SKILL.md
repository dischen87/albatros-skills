---
name: webseite-modernisieren
description: "Modernises an existing website (club, shop, practice, old Jimdo, Wix or WordPress site) for a person with no prior knowledge, as a variant of the flight plan. Gets going straight away with the inventory, without asking first: all pages, every feature (forms, sign-ups, dates, PDFs, prices, galleries, maps, languages) and all content, with screenshots of the old site in docs/bestand.md. After that it only asks what only the person knows, above all what has to stay, and leads via the floor plan and checking the plan (no feature gets lost without a decision) to the new site; when going live, the domain moves over with redirects and the email stays untouched. Use this skill for “Modernise …”, “modernise our website”, “our site is out of date”, “renew the website”, “relaunch”, “move away from Jimdo, Wix or WordPress”, “redo the old site”, and straight away when someone just sends the address of a website (https://…) with no other words."
metadata:
  stand: 0.2.0
  quelle: '8efafe8b2bdf'
---

# Modernise a website: renovating an old house

## The picture

An old house gets renovated, not torn down. First someone walks through every room with a notepad and a camera: what's there, what works, what's rotten, and what the family holds sacred, for example the tiled stove. Only with this inventory plan does the rebuilding start. And no wall comes down without the family saying yes.

**How to use the picture:** One sentence about it in your first answer, together with what you're doing right now.

## How you talk

- **Get going straight away.** If the person sends an address or “Modernise …”, you don't ask what they want. You say in one sentence that you're now looking at every room of the old site and roughly how long that takes, and you start.
- The person never has to know what the next step is. You suggest it and do it after a quick yes.
- Casual “you”, everyday language. Instead of “sitemap” say “list of all pages”, instead of “form backend” say “where the enquiries go”.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- You only ask what only the person knows, at most two questions in one message. Anything that's on the site, you look up yourself and suggest as `[Annahme: …]` (assumption). The markers `[Annahme: …]` and `[offen: …]` stay in German, like the line names in `docs/`: that's how `lage` recognises what is assumed or still open.
- Never ask for passwords, not even the login for the old site. Whatever is behind a login, you note as “can't be seen”.
- Learn or do, reporting gaps: as in the skill `lotse`.

## The flight plan when renovating

Modernising follows the same flight plan as a new site (skill `lotse`, “The flight plan in three stages”), with these differences:

| Section | When renovating | Island |
|---|---|---|
| Idea (Idee) | short: you read for yourself what the old site is for; the person says what has to stay | `idee` |
| Research | the inventory of the old site (section “Inventory” below) | `recherche` |
| Floor plan, checking the plan (Grundriss, Plan prüfen) | skill `webseite-planen`, plus: no feature gets lost without a decision | `plan`, `plan-geprueft` |
| Character, draft, building | the usual skills, with the inventory as the brief | |
| Going live | plus: the domain moves over with redirects, the email records (MX) stay untouched | |

Because you get going straight away, the inventory comes first and the short idea after it. On the island you still report `idee` first, then `recherche`. Until the release, everything stays on the person's computer and costs nothing at Albatros.

## Inventory (Bestandsaufnahme)

The working folder is a new folder in the current folder, named after the site (for example `curling-grindelwald`). The inventory needs neither an account nor a server. Call `konto_status` first. If it shows an account, the very first thing you do is open the island in the browser, with `open https://albatros.build/en/cockpit/insel` (Linux `xdg-open`, Windows `start`). With no answer or no account, carry on without the island.

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
4. **The inventory plan `docs/bestand.md`:**

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

## The idea, in short

Say in simple words what you found, briefly and with numbers: how many pages, which features, what's out of date, what's good. Then you only ask the two questions that only the person can answer:

1. **What has to stay?** What's sacred: logo, colours, a text, a page, a feature?
2. **Who should come more?** Guests, new members, sponsors, teams for tournaments?

Who looks after the site, you ask later, in the floor plan. The rest of the idea you suggest from the old site, and the person confirms it in one message: project name (usually the name of the old site), in one sentence, who it's for, main thing, success and mode (do). Then you write, as in the skill `webseite-planen`, section Idea (steps 4 to 6): `docs/projekt.md` with `Bestehende Seite: <address>`, `AGENTS.md` with `CLAUDE.md` and `GEMINI.md`, and the grey sketch `design/skizze.html` of the new home page, which already shows what has to stay. Open it in the browser.

Then `schritt_melden` with `idee` and `titel`, the value of the line `Projektname:` in `docs/projekt.md`, and after that `mission_pruefen` with `flugschule-11-idee`.

## Research from the inventory

When renovating, the research is almost done already: the inventory is the best travel guide. Write `docs/recherche.md` with the seven lines taken from the inventory, each at the start of the line, without bold, with its German name (template in the skill `webseite-planen`, section Research):

- `Vorbilder:` (examples) the old site (opened, with the date), plus, if the person wants, up to two comparable sites, each opened and reachable. Never made-up addresses.
- `Übliche Seiten und Funktionen:` what the old site has (from `docs/bestand.md`).
- `Übernehmen:` (adopt) what has to stay. `Vermeiden:` (avoid) what's out of date.
- `Pflichten:` (obligations) legal notice, privacy, image rights, and the rights to the old site's texts and pictures (below, “Rights”).
- `Inhalte vorhanden:` (existing content) from the inventory; whatever is missing or out of date goes on the list for the skill `inhalte`.
- `Suchbegriffe:` (search words) as `[Annahme: …]`, from the titles of the old site.

Explain the result to the person in five lines. Then `schritt_melden` with `recherche` and `mission_pruefen` with `flugschule-12-recherche`.

## Floor plan and checking the plan

Follow the skill `webseite-planen`, section Floor plan (Grundriss). Most of the answers are already in the inventory: take them over and just let the person confirm them. Every feature from the inventory goes into the plan, with a suggestion:

- Anything that only needs texts and files (dates, tournaments, PDFs, prices, sponsors, gallery) becomes a normal site without its own services, even with several languages.
- Forms: an email link is often enough. If the list of sign-ups should be saved, that's a building block (skill `bausteine`, later with your own server).
- A guestbook full of spam, or a login that only the old technology needed, may be dropped, but only with the person's decision.
- Old addresses that others link to (tournament announcements, rankings, Google results) stay the same or get a redirect when going live.

You enter the decisions in `docs/bestand.md` (Decision column) and in `docs/plan.md`.

After that comes the section “Checking the plan” in `webseite-planen`, with an eleventh point for the second opinion: **no feature of the old site gets lost without a decision** (every row in `docs/bestand.md` has a decision, and every one that stays is in the plan). You only carry on after the person's yes to the plan.

## Character, draft, building

After that it goes on as with every new site, section by section with `lage`: the character (skill `konzept`), the sample sheet (skill `gestaltung`), the whole site as a draft (skill `entwurf`), then building, checking and releasing on the computer (skill `webseite-bauen`). Your brief is `docs/plan.md` together with `docs/bestand.md`. On top of that:

- What has to stay (logo, colours, a text) is the frame for the character and the design. Read the screenshots of the old site as well: what's sacred, what looks out of date?
- The draft, and later the build plan, list every feature from `docs/bestand.md`, with its decision. None is dropped silently.
- After the build, you show before and after side by side, the home page and the most important subpage, on a phone and on a desktop, with three sentences on what's better and what's stayed the same.

## Going live: the domain moves over

The current domain of the old site (for example `curling-wil.ch`) stays as it is until the new site is live (skill `lancieren`, section going live). Only then do you point it to the new site (skill `domain`, with Albatros via `domain_verbinden`):

- **Redirects:** every old address in `docs/bestand.md` that no longer exists on the new site gets a redirect to the matching new page, so that other people's links and Google results don't lead nowhere. With a server of your own that's done in the web server (`nginx.conf`, `return 301`), otherwise with a small page at the old address that sends visitors on. Afterwards, check every old address once.
- **Never touch the email:** the domain stays with its provider and keeps costing there per year. You never touch the email records (MX), otherwise no more email arrives.

## Rights (Rechte)

Texts, photos and logos on the old site belong to someone, usually the club or the business, sometimes a photographer. Anyone modernising a site that doesn't belong to them needs the permission of the people who run it before any of it is published. The downloaded files are a working copy for looking at. Photos with recognisable people need those people's consent. That's why, before publishing, you ask: “Do the texts and pictures belong to you, or do you have permission, for example from the committee?”

## Stumbling blocks

- A feature gets lost silently: a form replaced by nothing, rankings no longer findable. At the end, check every row in the inventory.
- Old addresses break: tournament announcements and rankings are often linked from other sites.
- Taking over a gallery with thousands of pictures one to one: better a selection of the best, made smaller; the rest stays in the archive.
- Looking like AI: read the list of typical traits in the skill `gestaltung` before you draft the first page.
- Taking over the old site's cookie banner: a site without tracking and without third-party embeds sets no cookies and doesn't need one. The privacy policy is enough. A banner only comes in when something needs consent, for example an embedded Google map. Instead of the map, a “Plan your route” link with the address is usually enough, and the site stays without a banner.

## Final message

Your last message in this step starts with one sentence on the picture “renovating an old house” that sums up the core once more. Then: what's been found or built, where it is (`docs/bestand.md`, screenshots), what the person still has to decide and what comes next.
