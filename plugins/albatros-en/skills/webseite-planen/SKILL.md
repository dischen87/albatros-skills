---
name: webseite-planen
description: "Plans a website with a person who has no prior knowledge, before anything gets designed or built, in four sections of the flight plan: idea (project name, the idea in one sentence, who it's for, the main thing, docs/projekt.md, AGENTS.md and a grey sketch of the home page), research (up to three comparable sites, obligations, existing content, docs/recherche.md), floor plan (pages, features, access, languages, upkeep, docs/plan.md) and checking the plan (second opinion in a fresh context, docs/plan-pruefung.md, the person's yes). On the business path with the methods ideen-check, zielgruppe, angebot-und-preis and landingpage. Use this skill for “I want a website”, “plan my website”, “where do I start”, “what do I need for a website”, “which pages do I need”, “sitemap”, “project name”, “check the plan”, when lage names webseite-planen, and always before anything gets designed or built on the website path."
metadata:
  stand: 0.2.0
  quelle: '501e96d6b453'
---

# Plan your website: the floor plan

## The picture

Nobody builds a house without drawing a floor plan first. The floor plan shows which rooms there are, how you get from one to the next and where the front door is. On a website, the rooms are the pages, the corridors are the menus and links, and the front door is the home page. Before building starts, a structural engineer who didn't draw the floor plan looks it over.

A floor plan on one sheet of paper is enough. It saves a lot of rebuilding later.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away. On top of that, each section below has its own picture for one sentence.

## The four sections

`lage` names the section that's up now, by its German name (second column). Without `lage`, you start with the first section whose result is missing.

| Section | Name in `lage` | Picture | Result | Island |
|---|---|---|---|---|
| Idea | Idee | circling the destination on the map before you take off | `docs/projekt.md`, `AGENTS.md`, `design/skizze.html` | `idee` |
| Research | Research | reading the travel guides before you take off | `docs/recherche.md` | `recherche` |
| Floor plan | Grundriss | the floor plan of the house | `docs/plan.md` | `plan` |
| Checking the plan | Plan prüfen | the structural engineer's second opinion before building starts | `docs/plan-pruefung.md`, `Bestätigt:` in `docs/plan.md` | `plan-geprueft` |

The four sections are the start of the first stage, taking off (P1 to P4 in the flight plan). The numbers are only for you; to the person you name the section in words. Everything stays on their computer and costs nothing at Albatros.

If the person wants the whole plan straight away, write the missing files in one go as a draft, with `[Annahme: …]` and `[offen: …]`, and then only ask about what's missing. You never skip the second opinion and the person's yes in the section “Checking the plan”.

## How you talk

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- Casual “you”, short sentences, no jargon: “pages” instead of “sitemap”, “menu” instead of “navigation”. A technical word only comes in when it's needed, and with its picture first.
- **At most two questions in one message, at most five to the person per section.** Don't ask again about anything the person has already told you. Write their answers down word for word, so they recognise their own plan.
- **Assumptions instead of questions:** whatever you can suggest yourself, you enter as `[Annahme: …]` (assumption), with half a sentence on why. The person confirms all the assumptions of a section in one single message: “I've entered these assumptions: … Is that right?” Then you remove the marker. Whatever nobody knows stays as `[offen: …]` (open). Don't make anything up.
- **Don't wait:** if a detail is missing, still write the file as a draft, with assumptions and open points marked. Only ask about what's missing at the end.
- **Learn or do:** the line `Modus:` in `docs/projekt.md` is what counts; the default is do (`machen`). How the two modes work is in the skill `lotse`, section “Learn or do”. You offer the learning moments below in do mode; in learn mode (`lernen`) the person does them themselves.
- **Lines for the flight plan:** in `docs/projekt.md`, `docs/recherche.md`, `docs/plan.md` and `docs/plan-pruefung.md`, every required line starts at the beginning of the line with its name, without bold (`Projektname: …`). The line names and the markers `[Annahme: …]` and `[offen: …]` stay in German, like `Freigegeben:`: that's how `lage` recognises what has already been answered. After the colon you write in English.
- If the person asks about something this skill doesn't cover, or you have to guess: skill `lotse`, section “Reporting gaps”.

## After every section

1. Update the lines `Stand:` (status) and `Nächster Schritt:` (next step) in `docs/projekt.md`.
2. `schritt_melden` with the step from the table above, `titel` (the value of the line `Projektname:` in `docs/projekt.md`, as the person calls their project) and `sprache: en`. With `titel`, the island shows the house with that name instead of “projekt”. For the person's first project you leave out `projekt`: it later becomes the logbook in the harbour. Only for another project do you give a short name made of lowercase letters, digits and “-”. Tell the person in one sentence that their house on the island has grown. If the tool answers “Ungültige Angaben” (invalid details) or “unbekannt” (unknown), or it's missing, carry on without the island.
3. Check the mission of the section (below, “Checking the mission”), then call `lage` again (skill `lotse`) and follow whatever is up now.

If the person has an account and their island isn't open yet in this conversation, open it once: `open https://albatros.build/en/cockpit/insel` (Linux `xdg-open`, Windows `start`). A house grows there with every step.

## Idea (Idee)

**Picture:** circling the destination on the map before you take off. Without a destination, no pilot knows which route to fly.

1. **A name, in your very first answer.** Suggest a project name or ask for one: “What should your project be called? A working name is enough, and it can be completely arbitrary.” With a name, you can refer to everything from now on. For the folder you use a short form made of lowercase letters and “-” (`lunch-club-wipkingen`). If you aren't already working in a project folder, create a new folder with that name and work inside it.
2. **The questions about the idea.** Only ask what's still missing, at most two at a time, in this order:
   - What's it about, in one sentence? The way you'd tell a neighbour.
   - Who is it for? As specific as possible: “parents in the neighbourhood looking for a lunch club” instead of “everyone”.
   - What should visitors do above all? Exactly one main thing: call, send an enquiry, sign up, drop by, buy. Everything on the site leads there.
   - Is there already a website? If so, its address. **If yes**, you follow the skill `webseite-modernisieren`: it starts with an inventory of the old site, so nothing gets lost.
3. **Two assumptions.** You suggest `Erfolg:` (success) yourself: how the person will notice in three months that it's working, as a number or an event you can see (e.g. “ten enquiries a month”). `Modus:` is `machen` (do), unless the person has already chosen otherwise. Say about it: “I'll do the work and explain each step to you in one sentence. If you'd rather learn the important steps yourself, just say so; you can switch at any time.” They confirm both in one message.
4. **`docs/projekt.md`** in the project folder. `Projektname` = project name, `In einem Satz` = in one sentence, `Für wen` = who it's for, `Hauptsache` = main thing, `Erfolg` = success, `Bestehende Seite` = existing site, `Modus` = mode, `Weg` = path:

   ```markdown
   # <project name>

   Projektname: <name>
   In einem Satz: …
   Für wen: …
   Hauptsache: … (button: “…”)
   Erfolg: [Annahme: …]
   Bestehende Seite: none
   Modus: machen
   Weg: website (or business)
   Stand: <DD.MM.YYYY>, the idea is set
   Nächster Schritt: research: look at comparable sites
   ```

5. **`AGENTS.md`** in the project folder, with exactly this text. It tells every AI, even in a new conversation, where you stand and what applies. It's the same text as in the template for the logbook in the harbour.

   ```markdown
   # Instructions for the AI

   This project belongs to a person who is building their website or business with Albatros, usually without any technical background. Whether it's Claude Code, Codex, Gemini CLI or Cursor: the same applies to every AI.

   ## First

   Read `docs/projekt.md` (status, next step), then call `lage` (Albatros). `lage` says which skill and which section are up now; follow it. If `docs/projekt.md` doesn't exist yet, the project starts with the skill `webseite-planen`, section Idee. Without a connection to Albatros, the skill `lotse` helps you carry on.

   ## Rules

   - Three yes moments, and only the person says yes: plan confirmed (`Bestätigt:` in `docs/plan.md`), draft approved for building (`Freigegeben zum Bauen:` in `docs/entwurf.md`), site released (`Freigegeben:` in `docs/prd.md`). “Looks good” is not a yes.
   - Nothing goes online without a release: no publishing and no push to the harbour before the person has released their site (`Freigegeben:` in `docs/prd.md`). After going live, every change needs its own yes.
   - Prices only from `konto_status`, never from memory.
   - At most two questions in one message. Whatever you can suggest yourself is marked `[Annahme: …]` (assumption), whatever is open `[offen: …]`. These markers and the line names in `docs/` stay in German. Don't make anything up.
   - After every step that's done: update `Stand:` and `Nächster Schritt:` in `docs/projekt.md`, `schritt_melden` (with `titel`, the value of the line `Projektname:`, once it exists), then call `lage` again.
   - Passwords, card numbers and private keys never go into the chat or into a file in the project. Secrets live in `.env`, and `.env` is in `.gitignore`.
   - Casual “you”, everyday language, in English. A technical word only comes in with its picture.
   ```

   On top of that, two small files, so that Claude Code and Gemini CLI read the text too (Codex and Cursor read `AGENTS.md` by themselves): `CLAUDE.md` with the line “The instructions in AGENTS.md apply.” and `@AGENTS.md` below it, `GEMINI.md` with the same line and `@./AGENTS.md` below it.
6. **The grey sketch, the first visible success.** Write `design/skizze.html`: the home page from top to bottom, only in grey, with the real words from `docs/projekt.md`. No colours yet, no pictures, no font to choose; grey areas show where pictures will go later. One single file with no links to outside, readable on a phone:

   ```html
   <!doctype html>
   <html lang="en">
   <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <title>Sketch: <project name></title>
   <style>
     body { margin: 0; font: 17px/1.5 system-ui, sans-serif; color: #333; background: #eee; }
     header, section, footer { max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem; }
     .flaeche { background: #ccc; border-radius: 8px; min-height: 12rem; }
     .knopf { display: inline-block; background: #555; color: #fff; padding: .8rem 1.4rem; border-radius: 8px; }
     .notiz { font-size: .85rem; color: #777; }
   </style>
   </head>
   <body>
     <header><strong><project name></strong> · Home · Offer · Contact</header>
     <section><h1><in one sentence></h1><p><who it's for></p><span class="knopf"><main thing as a button></span></section>
     <section><div class="flaeche"></div><p class="notiz">A picture goes here later.</p></section>
     <section><h2>What visitors need to know</h2><p>…</p></section>
     <footer>Legal notice · Privacy<p class="notiz">Sketch in grey: the order comes first, colours and pictures come later.</p></footer>
   </body>
   </html>
   ```

   Open it in the browser (`open design/skizze.html`; Linux `xdg-open`, Windows `start`) and say in one sentence what the person is seeing: “This is the order of your home page, still all in grey. Colours and pictures come later.”
7. **Business path:** now the method `ideen-check` checks whether the idea holds up. Get it with the tool `methode` (`name: ideen-check`) and follow it. It ends with the line `Entscheid:` (decision) in `docs/ideen-check.md`: **weiter** (carry on: then research with target group, offer and price), **anpassen** (adjust: a new round of checking) or **stoppen** (stop: an honest, successful end). If it says “Hausaufgabe offen bis …” (homework open until …), the flight plan waits for the person: enter that in `docs/projekt.md` under `Stand:` and `Nächster Schritt:` and stop for today. If `methode` answers that the method is only for members, say so honestly and don't write `docs/ideen-check.md` from memory.

**Learning moments:** why a project needs a name before anything exists. One main thing instead of five.

**Done when** `docs/projekt.md` has all its lines, the project name isn't empty, `AGENTS.md` is in the project and the sketch has been opened; on the business path there's also `Entscheid: weiter` or `Entscheid: stoppen`. Then `schritt_melden` with `idee` and `titel`, the value of the line `Projektname:` (for example `titel: Lunch Club Wipkingen`).

## Research

**Picture:** reading the travel guides before you take off: what people expect there, what to avoid, what to bring. The travel guides are comparable sites in the person's region and line of business.

You start without asking first. The one question to the person is which texts, photos and which logo they already have. Whether they know sites they like themselves, you ask in passing; theirs are added to yours.

1. **Up to three comparable sites.** Search for them on the web, in the person's region and line of business. Open every address yourself and check that it answers, for example like this:
   ```bash
   curl -sL -o /dev/null -w '%{http_code}\n' --max-time 15 https://www.example.ch/
   ```
   200 means reachable. Whatever doesn't answer doesn't go in. If you find fewer than three, write down why. If you can't get on the web, the person names the sites; otherwise it says `[offen: …]`. Never made-up addresses.
2. **What everyone has** (`Übliche Seiten und Funktionen:`, usual pages and features): which pages, which menu, enquiry, booking, prices, opening hours. What everyone has, visitors will expect here too.
3. **Adopt and avoid** (`Übernehmen:`, `Vermeiden:`): what has proved itself, and what the person's site deliberately does differently, both as `[Annahme: …]`. Taking inspiration is allowed, copying isn't: you never take over other people's texts, pictures or design.
4. **Obligations** (`Pflichten:`): legal notice, privacy, image rights, cookies. In Switzerland almost every site needs a legal notice and a privacy policy; details in the skill `recht-ch`. No legal advice.
5. **Existing content** (`Inhalte vorhanden:`): “Which texts, photos and which logo do you already have?” If the person says “we've got that”, ask for it right away (text, a list or a photo of it), above all everything a feature needs, for example courses with times and places. Whatever is missing goes on the list for the skill `inhalte`. Missing content is the most common reason why websites never get finished.
6. **Search words** (`Suchbegriffe:`): three to five words someone would use to search for the person, as `[Annahme: …]`. That's where titles and texts people can find come from later.
7. **Write `docs/recherche.md`** and explain it to the person in five lines: what the examples have in common, what you'll adopt, what you'll do differently, which obligations apply and which content is still missing. They confirm the assumptions in one message.

   ```markdown
   # Research: <project name>
   Stand: <DD.MM.YYYY>

   Vorbilder: <address> (opened on <DD.MM.YYYY>, reachable): liked because …; …
   Übliche Seiten und Funktionen: …
   Übernehmen: [Annahme: …]
   Vermeiden: [Annahme: …]
   Pflichten: legal notice, privacy policy, …
   Inhalte vorhanden: …; missing: …
   Suchbegriffe: [Annahme: “…”, “…”, “…”]
   ```

**Business path:** first come the methods `zielgruppe` and `angebot-und-preis` (tool `methode`), but only once `docs/ideen-check.md` says “Entscheid: weiter”. They write `docs/zielgruppe.md` and `docs/angebot.md` and enter in `docs/recherche.md` what the research needs from them; the comparable offers become the examples. After that you only fill in the lines that are missing here.

**Learning moment:** taking inspiration is allowed, copying isn't.

**Done when** `docs/recherche.md` has all seven lines and every address among the examples was opened and reachable. Then `schritt_melden` with `recherche`.

## Floor plan (Grundriss)

**Picture:** the floor plan of the house: which rooms, which corridors, where the front door is.

1. **Five questions only the person can answer,** at most two at a time, and only what's still missing:
   - What should visitors be able to do: send an enquiry, book, sign up, pay? Every feature will need a flow with a confirmation and a case for when something goes wrong.
   - Are there areas only for certain people? Who may see and change what?
   - In which languages? Every language doubles the texts.
   - By when should it be online? Is there an occasion?
   - Who will change texts and dates later, and how often?
2. **You suggest the rest with a reason, as a default rather than a question:**
   - `Seiten:` (pages) For the first flight five to seven at most, counting the legal notice and the privacy policy. A tried and tested start: home page (who, what, for whom, and the button for the main thing), offer, about us, contact, legal notice and privacy. Every page has to be looked after.
   - `Setup:` The default is a site without its own services: texts and pictures, in several languages too, lists like dates as a file in the project, enquiries by email. Only a sign-up list, bookings with places, a login or a noticeboard for others needs a building block (skill `bausteine`, later with your own server). A system for managing content (skill `cms`) only comes once someone without technical knowledge changes content regularly.
   - `Testing:` how you'll know it's finished: three to five sentences you can check, starting from the main thing. For example: “On a phone you can see what it's about without scrolling, and the button “Ask for a place”.” “An enquiry arrives, and whoever sends it gets a confirmation.” “The legal notice and privacy policy can be reached from every page.”
   - `Release:` the person's date or occasion, plus the way online as the default: the person sees their site on their own computer first and releases it, then chooses where the site lives (with Albatros or self-hosted), then it goes live. Nothing goes online before the release.
3. **Write `docs/plan.md`.** `Funktionen` = features, `Zugang` = access, `Sprachen` = languages, `Pflege` = upkeep:

   ```markdown
   # Plan: <project name>

   Worum es geht: <in one sentence>, for <who it's for>. Success: <success> (from docs/projekt.md)

   Projektname: <from docs/projekt.md>
   Seiten: [Annahme: home, offer, about us, contact, legal notice and privacy]
   Funktionen: main thing “…”: …; confirmation: …; error: …
   Zugang: …
   Sprachen: …
   Setup: [Annahme: site without its own services, because …]
   Testing: [Annahme: …; …; …]
   Release: <date or occasion>; way online: view on the computer, release, choose where it lives, live
   Pflege: …
   Stand: <DD.MM.YYYY>, floor plan is set, not checked yet

   ## Pages
   - Home: …

   ## Content
   | What | We have it | Still missing: who delivers it by when |
   |---|---|---|
   ```

   Read the plan to the person in a few words. They confirm the assumptions in one message.

**Business path:** the build plan of the home page from top to bottom and the acceptance checks are written into `docs/plan.md` by the method `landingpage` (tool `methode`). After that, you use the questions above to fill in the lines that still say `[offen]` there.

**Learning moment:** why every page has to be looked after.

**Done when** `docs/plan.md` has all ten lines, open points are there as `[offen: …]` and nothing is made up. Then `schritt_melden` with `plan`.

## Checking the plan (Plan prüfen)

**Picture:** the structural engineer's second opinion before building starts. She didn't draw the plan, so she sees what the architect missed.

1. **A second opinion in a fresh context.** Whoever wrote the plan is worst at seeing its gaps, you included. That's why a fresh context does the check, one that only reads `docs/` and doesn't know the back story:

   | AI | How |
   |---|---|
   | Claude Code | a subagent, or `claude -p` in the project folder |
   | Codex | `codex exec` in the project folder |
   | Gemini CLI | `gemini -p` in the project folder |
   | Cursor | a new agent chat, or `agent -p` in the project folder |

   If none of that works, ask the person to open a new conversation and paste the task into it. The task, word for word:

   > Read only the files in docs/ and check the plan in docs/plan.md against this list. For every point, give ok, risk or open, with the place (file and line) and one sentence of reasoning. Don't make anything up: whatever isn't in docs/ is open.
   > 1. Exactly one main thing, and every page serves it
   > 2. Five to seven pages at most for the first flight
   > 3. Every feature has a flow with confirmation, error and empty state
   > 4. The content exists, or it's clear who delivers it by when
   > 5. It's clear who may do what, and whether that needs a building block
   > 6. Legal notice, privacy and image rights are planned in
   > 7. The measure of success is a number or an observable event
   > 8. It's clear what it costs after launch and who pays
   > 9. The biggest risk is named, along with what's left out of the first flight
   > 10. The date fits the scope

2. **`docs/plan-pruefung.md`** with the result, without a grade and without a score: every point honestly ok, risk or open. `Geprüft am` = checked on, `Zweite Meinung` = second opinion:

   ```markdown
   # Check of the plan: <project name>

   Geprüft am: <DD.MM.YYYY>
   Zweite Meinung: <AI and way, e.g. Claude Code, subagent in a fresh context>; <number> ok, <number> risk, <number> open

   | Point | Result | Place | Reason |
   |---|---|---|---|
   ```

3. **The person decides.** Show them only the points marked risk or open, each in one sentence with your suggestion. Then the question: “I've marked the points as risk or open. Is the plan final like this, or do we change something?” That's the first of three yes moments on the whole way: design only starts once the plan is confirmed. “Looks good” is not a yes; then you ask again.
4. **Only after their yes** does the line `Bestätigt: <DD.MM.YYYY>, “<their words>”` (confirmed) go into `docs/plan.md`, and `Stand:` says “checked and confirmed”. Never before. If they want to change something, you change the plan, check the changed points again in a fresh context and ask again.

**Modernising:** the second opinion also checks that no feature of the old site gets lost without a decision (`docs/bestand.md`, column Decision). Add that to the task as an eleventh point.

**Learning moment:** whoever wrote the plan is worst at seeing its gaps.

**Done when** every point on the checklist is ok, risk or open with its place, and `docs/plan.md` has the line `Bestätigt:` with the person's yes. Then `schritt_melden` with `plan-geprueft`. Next comes the character of the site (skill `konzept`), still before colours and code.

## What you spare the person

- **Too much at once:** a blog, a shop and a members' area are for later. First a site that does the main thing well. Several languages are no problem if the texts are there.
- **Technical decisions too early:** for the plan, the defaults above are enough. A building block or a content system only comes when a feature really needs it.
- **Logo and colours first:** character and design come after the plan is confirmed. A beautiful empty page doesn't help anyone.

## Checking the mission (Mission prüfen)

After `schritt_melden`, check the mission of the section with `mission_pruefen`. It passes as soon as the step is on the island:

| Section | Mission | Business path as well |
|---|---|---|
| Idea | `flugschule-11-idee` | `geschaeft-01-ideen-check` |
| Research | `flugschule-12-recherche` | `geschaeft-02-zielgruppe`, `geschaeft-03-angebot-und-preis` |
| Floor plan | `webseite-01-webseite-planen` (website path) | `geschaeft-05-landingpage` |
| Checking the plan | `flugschule-13-plan-pruefen` | |

Without sign-in this falls away; the files in the project are still the result.

## Final message

Your last message in this step starts with one sentence on the picture of the section (the destination on the map, the travel guides, the floor plan, the structural engineer's second opinion) that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
