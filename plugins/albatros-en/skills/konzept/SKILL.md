---
name: konzept
description: "Works out with a person who has no prior knowledge, once the plan is confirmed, the character of their site before any colours are chosen (flight plan P5): name to the outside world, core in three sentences, tone (formal or informal), three words for how it should come across, what has to stay, visual style and always the question whether a character (mascot) belongs to it: yes, no or later. On the business path, first with the method marke. Pictures of the mascot only after naming the price and getting a yes. The result is docs/konzept.md. Use this skill after webseite-planen (plan confirmed) and for “concept”, “brand”, “character”, “tone”, “mascot”, “how should my site come across”."
metadata:
  stand: 0.3.0
  quelle: '6d5570949ea3'
---

# Concept: character before colours

## The picture

Before a house gets its colour, it has a character: a cosy farmhouse, a clear city flat, a playful holiday home. Anyone who picks the colours first ends up painting a house nobody wanted like that. That's why you first settle with the person what their site is called, how it sounds and how it should come across. Colours, fonts and shapes then follow from that, in the next step (skill `gestaltung`).

**How to use the picture:** Tell the person in your first answer, before you ask questions, even if they want to talk about colours straight away.

## In the flight plan

Phase P5 “Design and marketing concept”. It's due after the confirmed plan: `docs/plan.md` has the line `Bestätigt:` (“confirmed”, P4, skill `webseite-planen`). If it's missing, say so honestly and go there first (section “Check the plan”): only a confirmed plan gets designed. After that comes P6, the design system with its sample sheet (skill `gestaltung`).

- **Result:** `docs/konzept.md` with the lines `Name:`, `Kern:` (core), `Ton:` (tone), `Charakter:`, `Maskottchen:` (mascot), `Muss bleiben:` (must stay) and `Bildsprache:` (visual style) (template in step 6). The line names stay German, because `lage` reads them; the content is in English.
- **Done when** all seven lines are there and `Maskottchen:` starts with `ja`, `nein` or `später`. Then you report the step `konzept` on the island.
- **Business path:** The method `marke` comes first. Fetch it with the tool `methode` (name `marke`) and follow it: it checks the name with the person (Swissreg, commercial register, domain, a say-it-out-loud test) and fills `docs/konzept.md` with the same seven lines; the reasoning goes into `docs/marke.md`. After that you take over its result: read `docs/konzept.md`, ask only for what's missing (often the answer about the mascot) and carry on with the sections “The mascot” and “The island”. Whether it's the business path, `lage` tells you (it names the method `marke`); in the project you recognise it by `docs/zielgruppe.md` or `docs/angebot.md` from P2. If `methode` delivers nothing, you go through all the steps here and say honestly that the thorough check of the name is part of the method.

## How you talk

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- Casual “you”, short sentences, no jargon. Whatever the person has already said (in `docs/projekt.md`, in the plan or in the conversation), you don't ask again: you read it back to them and write it down.
- Two questions per message at most. Five questions are answered only by the person: name, tone, character, the mascot and what has to stay. Core and visual style you suggest and write down as `[Annahme: …]` (assumption); the person confirms all assumptions in one single message.
- Whatever the person hasn't said appears as `[offen: …]` (open), never as something you made up. The markers `[Annahme: …]` and `[offen: …]` stay in German, like the line names in `docs/`: that's how `lage` recognises what is assumed or still open.
- Taste is the person's call. You help with pairs of opposites and examples, not with favourite colours.
- Pictures made with the Albatros image tools come with Light and Pilot, and they cost credit: first the price, then only after their yes (section “The mascot”). With Gratis there are no image tools: the mascot, its poses and pictures stay a sketch until Light or Pilot.

## Mode

Read the line `Modus:` in `docs/projekt.md`; if it's missing, `machen` (do) applies.

- **machen (do):** You do the work and explain each step in one sentence with its picture. You still ask the person the five questions. You offer the learning moment without pushing: “Character before colours. Want to see why the same colour comes across completely differently for a bakery and for a lawyer?”
- **lernen (learn):** You explain each step with its picture and the why. The person finds the three words for the character themselves; you only help with pairs of opposites. At the end you ask the check question of the lesson `flugschule-14-konzept`: “Why do you settle your site's character before its colours?” Only after their answer do you call `verstanden_melden` with `mission: flugschule-14-konzept` and `art: kontrollfrage`. If the tool is missing, you carry on without it.

## Steps

### 1. Read what's already there

Read `docs/projekt.md` (project name, who it's for, the main thing), `docs/recherche.md` (examples, what to adopt, what to avoid) and `docs/plan.md` (pages, features). If `docs/konzept.md` already exists (for example from the method `marke`), you add to it.

### 2. Name and tone

Ask in one message:

- “Does the project name stay, or should the project have a different name to the outside world?” Why: the name appears on every page and later in the address.
- “Formal or informal, and how should the language sound?” Why: the tone turns texts into a voice. Help with one sentence in two tones, for example “Drop by, the coffee's already on” and “We look forward to welcoming you”.

If the project should have a different name, you suggest three to five names and the person chooses. A quick web search shows whether the name already exists; the tool `domain_suchen` shows whether a matching address is free (search only, buying comes much later). The thorough check in the trademark register and the commercial register is part of the method `marke`.

### 3. Character and what has to stay

- “Which three words describe how it should come across?” Why: the directions come from the character, not from favourite colours. Help with pairs of opposites that suit the project: traditional or sporty, mountain village or city, calm or lively, refined or down-to-earth, playful or matter-of-fact. And with the question: what should visitors think after ten seconds?
- “Is there a logo, house colour or font that has to stay?” Why: whatever has to stay is the frame for all directions. If there's nothing, write “nothing”.

Favourite colours only go under `Muss bleiben:` if they really have to stay. Otherwise you note them below the line as a wish; in P6 it will show whether they suit the character.

If `docs/projekt.md` has the line `Bauen lassen: albatros`, add after the question about logo, house colour and font: “Put the logo and photos in the folder design/bilder.”

### 4. The mascot: yes, no or later

You always ask this question, even if the person doesn't bring it up, in a message of its own:

“Should there be a character who guides people through your site? Yes, no or later.”

With the reason in one sentence: a character makes a site unmistakable, but it needs care in every picture. You don't suggest an answer; the person decides. Until they answer, `docs/konzept.md` says `Maskottchen: [offen: question asked on <DD.MM.YYYY>]`.

With “yes” you continue with the section “The mascot”. With “no” or “later” the line is enough. “Later” means: the site works without a mascot, and the question comes back after going live.

### 5. Core and visual style as a suggestion

From what the person has said, you suggest both and write them down as `[Annahme: …]`:

- **Core** in three sentences: for whom? What do you promise (a result, not an adjective)? Why you of all people (with evidence)? The core is the yardstick for every text and every picture.
- **Visual style:** photos, illustrations, icons or a mix. A site without pictures looks like a template. Real photos of the place and the people beat any generated picture. If photos are part of it, you write a short photo list into `docs/inhalte.md` straight away (section “Photo list”: what, where, who's in it): photos take time, so the person can start now.

Then in one message: “I've suggested the core and visual style like this: … Does that work, or shall we change something?” After their answer the brackets go.

### 6. docs/konzept.md

Each line starts at the beginning of the line with its German name, not in bold, and stays short (300 characters at most), because `lage` reads these lines. Details go underneath.

```markdown
# Concept: <name>
Stand: <DD.MM.YYYY>

Name: <name to the outside world>
Kern: For <whom>: <promise>. Why us: <evidence>.
Ton: <formal or informal>; <three qualities, how it sounds>
Charakter: <three words>
Maskottchen: <ja, nein or später>
Muss bleiben: <logo, house colour, font, or nothing>
Bildsprache: <photos, illustrations, icons or a mix>

## Tone
| We are | Like this | Not like this |
|---|---|---|
| … | “…” | “…” |

## Mascot
Only with “Maskottchen: ja”, see the section “The mascot”.
```

After `Maskottchen:` comes first one of the three German words `ja` (yes), `nein` (no) or `später` (later), with “yes” followed by a short description of the mascot: `Maskottchen: ja – Lina, a curious owl`.

At the end, read the file to the person and ask: “Do you recognise your project in this?”

## The mascot

With “yes”, you first describe the mascot in words, under `## Mascot` in `docs/konzept.md`:

- What kind of figure (animal, object, human), its name, three qualities that suit the character of the site.
- Where it appears: for example at the welcome, at a success, on an empty page.
- Where never: with errors, cancellations and delicate moments, next to photos of people, behind lists or forms.

With Gratis you don't call any image tool: the mascot stays a sketch (below) until the person has Light or Pilot. If an image tool answers that pictures “gehören zu Light und Pilot” (belong to Light and Pilot), carry on without an image tool as with “kommt bald” and don't ask about credit. With Light or Pilot, a picture of the mascot is optional and costs credit. Before the first picture you call the tool `guthaben`, give the price from its answer and ask once: “A picture costs CHF …, your credit is enough for … Shall I make a first picture of the mascot?” Only after their yes do you call `bild_erzeugen`; `bild_freistellen` and `modell_3d` likewise only after the price and a yes. You look at every picture yourself before you show it, and save it in the project straight away (`curl -o design/figur/<name>.png <url>`), because after 7 days it's gone.

With Gratis, if the credit isn't enough or the person doesn't want a picture (yet), the mascot stays a sketch: a simple drawing in grey that you draw as `design/figur/skizze.svg`, or a photo of their own drawing on paper. That's enough for the sample sheet and the draft. The mascot's poses (welcome, searching, success, empty) are made in P6 (skill `gestaltung`, section “Design elements”).

## The island

Once everything is in `docs/konzept.md` and `Maskottchen:` starts with `ja`, `nein` or `später`, you call the tool `schritt_melden` with `schritt: konzept` and `sprache: en`. You leave out `projekt`, unless the person is working on another project that's only on their computer; then you pass its short name. Tell them in one sentence that their house has grown on the island. If the tool answers “Ungültige Angaben” (invalid details), check the spelling once; if Albatros doesn't know the step yet, carry on without the island, and `docs/konzept.md` is the evidence. Then call `lage` again (skill `lotse`), always with `skills_stand`: the value of `stand` under `metadata` at the top of this file.

## Handing over to Albatros (Übergabe an Albatros)

Only if `docs/projekt.md` has `Bauen lassen: albatros` (the person accepted the offer from `lage`) and `lage` names this section, so once `docs/konzept.md` is done. Then you no longer design or build yourself: Albatros makes the mockup, the drafts and the whole site as a preview, and the person chooses in the cockpit.

1. **Summary.** Read `docs/projekt.md`, `docs/recherche.md`, `docs/plan.md` (with the acceptance criteria under `Testing:`), `docs/plan-pruefung.md` and `docs/konzept.md`. Tell the person in one message what you're sending, roughly like this: “This is what I'll send to Albatros: your plan with pages, features and your acceptance criteria, your research and your concept, as text. Passwords and access details are not included. You choose the address of your site afterwards in the cockpit. The Albatros team reads it, and an AI (Claude by Anthropic) helps with building. Until you pay, nothing is binding, and you can carry on yourself at any time. Shall I send it?”
2. **Only after their explicit yes** call `auftrag_anlegen` with `bestaetigt: true`, plus the briefing fields from their files, the way Albatros describes them: `name` (`Name:` from `docs/konzept.md`, otherwise `Projektname:` from `docs/projekt.md`), `wofuer` (`In einem Satz:`, `Hauptsache:` and `Erfolg:` from `docs/projekt.md`; on the business path also `docs/angebot.md`), `fuerWen` (`Für wen:`; on the business path also `docs/zielgruppe.md`), `seiten` (`Seiten:`, `Funktionen:` and `Sprachen:` from `docs/plan.md`), `setup` (the line `Setup:` from `docs/plan.md`, word for word), `adresse` only for an existing site (`Bestehende Seite:`), `stil` (`Ton:`, `Charakter:`, `Muss bleiben:`, `Maskottchen:` and `Bildsprache:` from `docs/konzept.md`, plus `Vorbilder:`, `Übernehmen:` and `Vermeiden:` from `docs/recherche.md`), `material` (`Inhalte vorhanden:` and `Pflichten:` from `docs/recherche.md` and the acceptance criteria from `Testing:`; only text and links, no files). `name` has at most 120 characters, `adresse` 300, `material` 4000, the others 2000 each. No names of other people, no phone numbers, addresses, passwords or access details. “Looks good” is not a yes; without a yes, you send nothing.
3. **Afterwards** tell them what `auftrag_anlegen` reports: the number, the amount exactly as Albatros gives it and the way to the cockpit, roughly: “Done: order #<number> is with Albatros. In the cockpit, under “Your order”, choose your project folder, then the team sees your photos too. That's also where you choose the address of your site. Next you'll get drafts to choose from. You don't have to build anything any more.” Then open the cockpit for them (`open https://albatros.build/cockpit/auftrag`, with a language prefix like `/fr/cockpit/auftrag`; Linux `xdg-open`, Windows `start`) and tell them where the project folder is on their computer: the folder you're working in (`pwd`). They choose the folder there themselves in the browser; it only takes `docs/` and `design/` from it and shows them the list first. Passwords, private keys and files like `.env` don't belong in it. You don't upload anything yourself. Never give an amount from memory. If Albatros reports an error (for example an order is already open, or the build service isn't available right now), pass it on word for word and don't start building.
4. From here on you don't build anything yourself, even if the person asks: no mockup, no drafts, no code, and you don't add or change anything under `design/` any more, because that's what Albatros builds from. `lage` says what's up (for example choosing in the cockpit or waiting for Albatros). Meanwhile they can collect texts and photos (skill `inhalte`); they put new photos into `design/bilder/` themselves and choose the project folder again in the cockpit. If they change their mind, they withdraw the order in the cockpit; after that the flight plan carries on with them.

If the person chooses `Bauen lassen: selbst`, this section doesn't apply: it carries on with the design system (skill `gestaltung`).

## Stumbling blocks

- **Colours first:** then the person likes the site, but it says nothing to visitors. Colours come in P6, from the character.
- **Forgetting the question about the mascot:** it easily gets lost, and it's compulsory because a mascot later shapes every picture.
- **Passing off assumptions as answers:** name, tone, character, the mascot and what has to stay are said by the person.
- **Pictures without a price:** every image tool only after the price and a yes, and with Gratis none at all.
- **A tone that doesn't hold:** the site informal, the email formal, and it feels like two different shops.

## Check the mission

`mission_pruefen` with `flugschule-14-konzept`, on the business path also with `geschaeft-04-marke`. The check looks at whether the project has reached at least the step “Concept” on the island.

## Final message

Your last message in this step starts with one sentence on the picture “character before colours” that sums up the core once more. Then: what's done, where the result is (`docs/konzept.md`), what's still open (often the answer about the mascot or a photo) and what comes next: the design system with its sample sheet in P6 (skill `gestaltung`), or with `Bauen lassen: albatros` the handover to Albatros (section above).
