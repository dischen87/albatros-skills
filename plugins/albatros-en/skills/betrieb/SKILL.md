---
name: betrieb
description: "Prepares running the site with a person who has no prior knowledge, before the guests arrive (P12): how visitors get in touch and who reads it how often, who finds out when the site stops responding (simple, free monitoring), how to get back to yesterday (photos of the server with Pilot, the logbook with Light, a backup of your own when hosting it yourself), whether an entrance with sign-in is needed (only with your own server, skill bausteine) and whether visitors are counted (skill statistik, with consent where it's required). The result is docs/betrieb.md. Use this skill after choosing where the site lives (lancieren) and for “running it”, “monitoring”, “backup”, “feedback”, “who reads the form”, “what if the site goes down?”."
metadata:
  stand: 0.2.0
  quelle: '7d86dfefd03f'
---

# Running it: before the guests arrive

## The picture

Before the first guests arrive, the letterbox is up, and someone empties it. The smoke alarm goes off when there's a fire, and it's clear who hears it. There's a plan for getting the house back to how it was yesterday when something breaks. If some rooms are for residents only, there's a doorkeeper at the entrance. And on the shop door there may be a tally sheet. For the site this means: feedback, monitoring, backup, entrance and statistics.

**How to use the picture:** One sentence about the picture in your first answer. For each point, one sentence with its part of the picture.

## How you talk

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- The line starts in `docs/betrieb.md` (`Rückmeldungen:`, `Überwachung:`, `Sicherung:`, `Eingang:`, `Statistik:`) stay German, like the markers `[Annahme: …]` and `[offen: …]`: `lage` looks for them exactly like that. What comes after the colon you write in English. The one exception: after `Eingang:` always comes first `ja` or `nicht nötig` in German (lancieren and bausteine look for them exactly like that), then the reason in English.
- Casual “you”, calm, concrete. Every answer becomes a line in `docs/betrieb.md`.
- Feedback, entrance and statistics are the person's own decisions, in `machen` mode too. Monitoring you suggest and write down as `[Annahme: …]` (assumption). The backup you work out yourself and show. At most two questions per message.
- You only name prices and terms of outside services from their pricing page. Accounts with outside services are created by the person themselves.
- What applies depends on where the site lives (`docs/lancieren.md`, line `Wohnort:`): Albatros Light, Albatros Pilot or hosting it yourself.
- None of this puts the site online. That comes afterwards, when going live (skill `lancieren`, part 2).

## Steps

### 1. Where does the site live?

Read `docs/lancieren.md`. If the file or the line `Wohnort:` is missing, choosing the place comes first (skill `lancieren`, part 1).

### 2. Feedback: the letterbox

Ask: “How do visitors get in touch with you, and who reads it how often?” Why: feedback nobody reads is worse than none.

- The way is usually already in the PRD (`docs/prd.md`): a link to send an email, a form, a phone number or a building block such as the sign-up list. Work out which address it goes to, who reads it there, how often, and who does it during holidays.
- After going live, the person sends a test message through the site on the web themselves and checks whether it arrives (skill `lancieren`, part 2).

Example: `Rückmeldungen: form on /kontakt to anna@example.ch, Anna reads it on Mondays and Thursdays, Beat during holidays`

### 3. Monitoring: the smoke alarm

Ask: “Who finds out when the site stops responding?” Why: better you notice than your customers.

- **What Albatros does:** Albatros monitors its own platform and fixes outages there. Albatros doesn't send the person a message when their site stops responding. When hosting it yourself, there's only what the provider offers.
- **The simple solution, free:** a checking service on the web that calls the address from `docs/lancieren.md` every few minutes and sends an email when it doesn't answer, for example UptimeRobot or Better Stack (terms on the pricing page). The person creates the account themselves; you tell them what to enter where: the address, and as recipient the person who also reads the feedback. They can set it up now (the address already answers with the template) or right after going live.
- **With your own server,** a watcher such as Uptime Kuma works too, but never on the same server: if that fails, the watcher goes quiet as well.
- If the person doesn't want monitoring, the line says so, with their reason.

Example: `Überwachung: [Annahme: UptimeRobot (free) checks https://anna.aufwind.sh every 5 minutes, email to anna@example.ch]`. After their yes, you remove `[Annahme: …]`.

### 4. Backup: back to yesterday

You work this out yourself and show it to the person: “How do you get back to yesterday?”

- **Albatros Light:** the logbook is the backup. Every state is in the harbour and on the computer. You go back with `git revert` and a push (skill `zurueck-auf-gestern`, paragraph on Light). There are no photos of a server, because there is no server.
- **Albatros Pilot:** every night a photo of the whole server (seven days), plus a photo of your own before every big rebuild (tool `snapshot`). You go back with `zurueck` (skill `zurueck-auf-gestern`). The logbook in the harbour stays the copy outside the flat.
- **Hosting it yourself, without a server:** the logbook on the computer needs a second copy outside the computer, for example a private repository on GitHub. Providers for static sites usually keep earlier deploys that can be switched back on: show the person where that is in their provider's interface.
- **Hosting it yourself, with a server:** a backup of your own, at night, off-site, encrypted, with a test every month (skill `landung`, moving list “Was ich selbst übernehme”, what I take on myself). A backup only counts once restoring it has worked.

**Learning moment “back to yesterday”:** in `lernen` mode the person tries it once themselves. With Light or when hosting it yourself: commit a small change and take it back with `git revert HEAD`. With Pilot: the exercise in the skill `zurueck-auf-gestern` (mission `flugschule-06-zurueck-auf-gestern`), on the template that's online right now. Then `verstanden_melden` (mission `flugschule-17-betrieb`, kind `selbst`). In `machen` mode you offer it.

Example: `Sicherung: logbook in the harbour and on this computer, back with git revert (tried on 31.10.2026)`

### 5. Entrance: the doorkeeper

Ask: “Are there several parts that need to know who is signed in?” Why: then one entrance checks in a single place who may do what.

- **No sign-in on the site** (the “Access” table in `docs/prd.md` only has “all visitors”): `Eingang: nicht nötig (no sign-in)`.
- **With sign-in:** an entrance only comes if the criteria in the skill `bausteine`, part “Ein Eingang für alles?” (one entrance for everything?), are met, and only with your own server (Pilot, or hosting it yourself with a server). Otherwise the building block's own sign-in is enough. Either way, the doors from `docs/tueren.txt` stay closed without signing in (`node scripts/pruefen.mjs --tueren`).

The line always starts with `ja` or `nicht nötig`, then comes the reason: `lancieren` and `bausteine` only build in the entrance with `Eingang: ja`.

Examples: `Eingang: ja, /intern/ and the messages from PocketBase need the same sign-in (criteria in the skill bausteine met)` or `Eingang: nicht nötig, only the sign-up list with its own sign-in (criteria in the skill bausteine not met)`

### 6. Statistics: the tally sheet

Ask: “Do you want to count who comes?” Why: without numbers, the measure of success from `docs/projekt.md` (line `Erfolg:`) stays a guess.

- How it works is in the skill `statistik`: first a small plan of what gets counted, then the set-up without cookies. That way no banner is needed in Switzerland. If the site counts with cookies or is aimed at people in the EU, it needs the visitors' consent first (skill `recht-ch`, “Cookies und Statistik”), and the privacy policy mentions the statistics.
- It's added when going live or right afterwards (mission `webseite-08-statistik`, optional).

Example: `Statistik: yes, without cookies, goal “enquiry sent”, set up after going live (skill statistik)` or `Statistik: no, the enquiries in the inbox are enough`

### 7. `docs/betrieb.md`

```markdown
# Running it

Rückmeldungen: …
Überwachung: …
Sicherung: …
Eingang: …
Statistik: …
Stand: <date>
```

Once every line has an answer, you make the logbook entry (`git add docs/betrieb.md && git commit -m "Running it: letterbox, smoke alarm, backup"`) and report `schritt_melden` with `betrieb` and `sprache`. If the tool is missing or doesn't know the step, you carry on without the island. In `lernen` mode you now ask the check questions of the lesson `flugschule-17-betrieb`: “Why is feedback nobody reads worse than none?”, “How do you get back to yesterday?” and “Who should be first to notice when your site stops responding?” You only report `verstanden_melden` (kind `kontrollfrage`) after the person's answer.

Next comes going live: skill `lancieren`, part 2.

## Pitfalls

- A form whose messages nobody reads.
- Putting the watcher on the same server it's supposed to watch.
- “Albatros will notice”: Albatros sees the platform, not every single site.
- A backup that has never been restored: it only counts after the test.
- Building an entrance because it sounds professional: only when the criteria are met and with your own server.
- Statistics with cookies without consent, where it's required.

## Checking the mission

`mission_pruefen` with `flugschule-17-betrieb`: the check looks on the island whether the project is at the step “Betrieb” (running it). With Albatros, `flugschule-07-sicherheit` also belongs to this phase, with Pilot `flugschule-06-zurueck-auf-gestern` and, optionally, `webseite-05-cms`.

## Final message

Your last message in this step starts with a sentence on the picture “before the guests arrive” that says the core once more. After that: what's settled (the five lines in `docs/betrieb.md`), what the person still sets up themselves (for example the account at the checking service), and that going live comes next.
