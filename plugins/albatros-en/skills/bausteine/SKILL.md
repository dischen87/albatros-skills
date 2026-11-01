---
name: bausteine
description: "Works out with a person who has no prior knowledge what their site should be able to do, and builds in the matching ready-made building blocks, first on their own computer: a sign-up list, bookings for classes and appointments, a members' area with login and approval, a noticeboard (PocketBase), an entrance with one login for several parts, or a big CMS (Strapi with Postgres), with measured memory (RAM). Explains it with the picture of prefab parts when building a house. Use this skill for “sign-up”, “sign-up list”, “booking”, “booking tool”, “book a class”, “book an appointment”, “reservation”, “reserve a place”, “save a form”, “login”, “members' area”, “admin area”, “manage users”, “roles”, “entrance”, “database”, “Strapi”, “CMS”, “PocketBase”, “building block”, “what fits on my server”, “is my server big enough”, and whenever a site should do more than show text and pictures."
metadata:
  stand: 0.2.0
  quelle: '4b332f8bb0fe'
---

# Building blocks: prefab parts for your site

## The picture

When you build a house, you don't make the windows, doors and kitchen yourself. They come ready-made from the factory, with instructions, and get fitted. A website is just the same: nobody writes a login, a sign-up list or a system for content from scratch. Albatros has them ready as building blocks. Whatever has a test is tested (bookings, members, entrance); we measured the memory for all of them.

And just like with a house: every part needs space. That's why you first look at what the person really needs. Building blocks go in on the person's computer first, like a trial assembly in the workshop; they only go onto the server at launch.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands.

## How you talk

- **Don't just ask:** If a detail is missing, still give the concrete steps with assumptions marked `[Annahme: …]`. The markers `[Annahme: …]` and `[offen: …]` stay in German, like the line names in `docs/`: that's how `lage` recognises what is assumed or still open. Only ask about what's missing at the end.
- Casual “you”, short sentences. Instead of “authentication” say “signing in with email and password”, instead of “admin panel” say “admin area”.
- Never ask for passwords or keys. The person creates the first account for the admin area themselves in the browser. API keys (for example for emails) they only type in there.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## 1. What do you want to build?

One question per message, only as many as it takes for the answer to be clear:

1. What should the site do? In one sentence.
2. In which languages?
3. Who changes the content: just you with your AI, or others without a terminal too?
4. Should visitors enter something, sign up or log in? Do you want to see a list of the sign-ups?
5. Is there something behind it, for example payments, bookings or a newsletter?

## 2. What follows from that

| The person says … | What fits | Plan | Memory (RAM) while running |
|---|---|---|---|
| Only I look after the site, no login, in several languages too | A normal site from the template, without a building block. One folder per language (`seite/fr/`). Lists like dates or products as a file in the project (`seite/daten/termine.json`), and the site reads them: a light database in the code. | Light | nothing extra |
| Payments, donations | A payment link from a provider like Stripe (Payment Link), as a button on the site | Light | nothing extra |
| Newsletter | A service like Brevo, with the service's form on the site | Light | nothing extra |
| People sign up, I want to see the list | **Sign-up list** (PocketBase, recipe `anmeldeliste`) | Pilot | about 20 MB |
| Visitors book a place or an appointment (class, guided tour, hairdresser's appointment), I want to see the bookings and be able to cancel them | **Bookings** (PocketBase, recipe `buchungen`) | Pilot | about 20 MB |
| Members log in and see an area of their own; anyone new sends a request, and I approve them | **Members' area with login** (PocketBase, recipe `mitglieder`) | Pilot | about 20 MB |
| Others look after news or dates in the browser | **Noticeboard** (PocketBase, recipe `pinnwand`) | Pilot | about 20 MB |
| Several parts need the same login, or an area is only for one role (for example the committee) | **Entrance** (building block `eingang`, with the recipe `mitglieder`), section 7 | Pilot | 20 MB, up to 69 MB under full load |
| Lots of content types, several roles, image management, an app later | **Big CMS** (Strapi with Postgres) | Pilot | about 200 MB, build up to 2.5 GB |

Always recommend the smallest thing that's enough. Several languages on their own are never a reason for a building block. PocketBase covers the sign-up list, login and noticeboard together; it only runs once. Strapi is only worth it once PocketBase gets too small.

On the person's own computer every building block works for free, even without a plan. Online it needs a server of its own, so Pilot. If the person has Light, say so honestly as soon as they want a building block: they choose where the site lives at launch (skill `lancieren`, prices from `konto_status`, skill `kosten`). The logbook and the address stay.

## 3. What fits on the server?

A server with Pilot has 4 GB of memory (RAM) and 40 GB of space, without swap space: if it gets too much, the server shuts down a program. Measured on 28.10.2026 on the server (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17), the entrance on 31.10.2026 on a Mac:

| What | While running | While building | Space |
|---|---|---|---|
| Base load: system, Docker, worker on the conveyor belt | 150 MB, 0.5 GB planned | briefly more | – |
| Website from the template | 10 MB | brief | small |
| PocketBase (all recipes together) | 20 MB | brief | 40 MB |
| Entrance | 20 MB, up to 69 MB under full load | brief | small |
| Strapi with Postgres | 150 MB + 55 MB | peak 2.5 GB, first build about 7 minutes | 1.4 GB |

That leaves about 3.5 GB for building blocks. Website, PocketBase and Strapi together need about 250 MB while running. It only gets tight while building, which is why the conveyor belt builds one job after another. Programs that need more than 1 GB on their own don't belong on the server, for example Keycloak, Supabase, Logto, Mattermost or text recognition (OCR). For a login of your own, take PocketBase.

Before launch: `free -h` on the server shows how much is free. Afterwards: `docker stats --no-stream` shows what each building block needs.

## 4. Building it in: locally first, the server at launch

### Locally, on the person's computer

While building (skill `webseite-bauen`), free:

1. **Fetch.** In the logbook on the person's computer (skill `git-logbuch`), you download the building block from the factory, the public repository of Albatros:
   ```bash
   curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
   ```
   For the entrance, it ends in `bausteine/eingang`, for Strapi in `bausteine/strapi`. The recipes are then under `bausteine/<baustein>/rezepte/`.
2. **Add the recipe** (section 5, 6 or 7), and put the texts of the pages into the person's language.
3. **Test:** if the recipe has a test, it must report “Alles grün”: `bun bausteine/pocketbase/rezepte/buchungen/test.ts`, `bun bausteine/pocketbase/rezepte/mitglieder/test.ts`, `bun bausteine/eingang/test.ts`. Once the recipe is built in, it checks the built-in files. Without a green test, you don't go any further.
4. **The person clicks through it themselves.** Build in `web/` (`npm run build`), then `bun bausteine/pocketbase/lokal.ts` (with the entrance: `--eingang`). The whole site runs with the building block on the person's computer, and emails show up in the terminal instead of reaching real people. Give them the address and tell them what to try (logging in, booking, cancelling). They click, you watch and fix. For the admin area, `lokal.ts` shows an account that only works on this computer.
5. **Into the logbook**, not yet to the harbour.

Strapi has no test and no `lokal.ts` yet; you write its content types as files (section 6), and you only see it running on the server. Say so honestly.

### At launch, with Pilot (Beim Lancieren, mit Pilot)

In the skill `lancieren`, part 2, after the site has been released and before the push to the harbour:

1. **Photo of the server:** tool `snapshot` with the name `vor-baustein` (skill `zurueck-auf-gestern`).
2. **Hook it in.** At the very top of `compose.yaml`:
   ```yaml
   include:
     - bausteine/pocketbase/compose.yaml
   ```
   The website passes the requests on itself: the template reads every `bausteine/*/nginx.conf`. If the project is older than the building blocks (no `nginx.conf` in the project), get `Dockerfile` and `nginx.conf` from `vorlage/` in the same repository.
   **With a login, the entrance step:** if `docs/betrieb.md` says `Eingang: ja` (section 7; `grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` shows the line, “Eingang: jamais” doesn't count), `- bausteine/eingang/compose.yaml` goes under `include:` too, and for the service `webseite` the lines `ports:` and `- "80:80"` go: then the website can only be reached behind the entrance. Without a login, or if PocketBase's rules are enough, `compose.yaml` stays as in the template. The skill `lancieren` already names this step when choosing where the site lives.
3. **To the harbour.** The conveyor belt builds and delivers (skill `pipeline`). If the build fails, the old site stays online.
4. **Check** on the server: `docker ps` shows the building block as `healthy`. Then you check every door from outside: `node scripts/pruefen.mjs --tueren <address>` with the doors below, and with the entrance also protected paths 401, `/_/` 404, `/api/collections/_SUPERUSERS/auth-methods` 404 and the home page 200. Then the first account for the admin area and the emails (section 5).

### Doors of the building blocks (Türen der Bausteine)

What a building block answers without signing in goes into `docs/tueren.txt` (skill `webseite-bauen`), only the lines for the recipes that are built in. `node scripts/pruefen.mjs --tueren` checks them locally against `http://localhost:8090` (with the entrance `http://localhost:8080`) while `lokal.ts` is running, and after launch against the address. PocketBase lists with a rule (for example “only your own account”) give guests 200 with an empty list, not 401 or 403; only lists for the admin area alone give 403. That's how it should be; the rules stay as they are.

```
/api/collections/anmeldungen/records      403   # anmeldeliste: everyone may sign up, only the admin area can read
/api/collections/termine_frei/records     200   # buchungen: free dates are visible to everyone
/api/collections/buchungen/records        403   # buchungen: bookings are visible only to the admin area
/api/collections/wochenplan/records       403   # buchungen
/api/collections/users/records            200   # mitglieder: guests get an empty list
/api/collections/mitteilungen/records     200   # mitglieder: guests get an empty list
/api/collections/beitraege/records        200   # pinnwand: for everyone
/intern/                                  401   # with the entrance: every protected path from eingang.json
/_/                                       404   # with the entrance
/api/collections/_SUPERUSERS/auth-methods 404   # with the entrance
```

Measured on 31.10.2026 with PocketBase 0.40.5 and `pruefen.mjs --tueren`, directly at PocketBase and through the entrance. Without the entrance, `/_/` is only closed on the server (404); locally `lokal.ts` shows the admin area there, so check that door only after launch. With `buchungen`, “My bookings” (`/verwaltung/`) answers 200: the page is open, but only someone signed in with the admin account sees the bookings on it. A line `/verwaltung 404` doesn't fit then.

## 5. PocketBase: sign-up list, bookings, members, noticeboard

PocketBase is one single small program with a database, login and admin area. The website talks to it at `/api/` on its own address. The admin area stays closed to the outside.

- **Enter the address:** In `bausteine/pocketbase/pb_migrations/1_einstellungen.js`, set the line `ADRESSE` to the site's address (`https://{name}.aufwind.sh` or your own domain). It appears in emails like “forgotten password”.
- **Add the recipe:** From `bausteine/pocketbase/rezepte/<rezept>/`, all files from `pb_migrations/` go to `bausteine/pocketbase/pb_migrations/`, `pb_hooks/*` (if present) to `bausteine/pocketbase/pb_hooks/` and `seite/*.html` goes to `seite/`. Leave the recipe's folder where it is; the test lives there.
  - `anmeldeliste`: the form `anmelden.html`. Everyone may sign up, only the admin area can read the list.
  - `buchungen`: `buchen.html` (free dates, booking, cancelling via the link in the email) and `verwaltung.html` (“My bookings” for the person: who's coming, cancelling, weekly schedule). More below under “Bookings”.
  - `mitglieder`: anyone who registers sends a request. The person confirms their email address with the link in the email, the admin area gets a notice and approves them (in the admin area under `users`, the field `freigegeben`), and then the person gets an email. Only once the address is confirmed and they're approved do they see the messages. Approval and role (`rolle`, for example `vorstand`) are only set by the admin area, never by the person themselves. Pages: `mitglieder.html` (request, log in, state of the request, send the email again, “Forgotten your password?”), `bestaetigen.html` and `passwort.html`; the links in the emails lead to these two. If the pages live elsewhere (for example `/passwort/` in an Astro site), enter the path in `pb_migrations/2_mitteilungen_freigabe.js` (`SEITE_BESTAETIGEN`, `SEITE_PASSWORT`), and the members' area and who gets the notices in `pb_hooks/mitglieder.js` (`MITGLIEDERSEITE`, `MELDUNGEN_AN`). Add your own roles to `ROLLEN` before the site runs. If the old recipe was already built in, the new files simply go in alongside; anyone who was already a member then has to be approved once and confirm their address (“Send the email again” on `mitglieder.html`).
  - `pinnwand`: `pinnwand.html` shows posts with date and picture. Writing happens in the admin area.
  - You write your own fields or collections as another file `pb_migrations/3_*.js`, following the same pattern.
- **First account for the admin area** (at launch): After the first start, PocketBase writes a set-up link into its log. Fetch it and open the secret passage (tunnel), so the admin area stays invisible from the internet:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && docker compose logs pocketbase' | grep pbinstall
  ssh -N -L 8090:localhost:8090 {name}@aufwind.sh
  ```
  Leave the second command running in the background. Give the person the link with `http://localhost:8090` instead of `http://0.0.0.0:8090`. They set their email and password there, only in the browser. If the link has expired: `docker compose restart pocketbase` on the server, and then there's a new one. Later it works via `http://localhost:8090/_/`, as long as the tunnel is open.
- **Open up the admin area:** If others need the admin area without a terminal, or the person wants to see the list on their phone: in `bausteine/pocketbase/nginx.conf`, remove the `#` in front of the block “Verwaltung freigeben” (open up the admin area), into the logbook, to the harbour. Then it's at `https://{name}.aufwind.sh/_/`, protected with the admin area's password. Only open it up once the first account exists. As soon as emails are going out, the person switches on two-factor sign-in (MFA) in the admin area under `_superusers` → Options. With the entrance (section 7), the admin area always stays closed from the outside.
- **Emails** (confirm address, forgotten password): The server isn't allowed to send over the usual mail ports. In the admin area under Settings → Mail settings: SMTP server `smtp.resend.com`, port `2587`, user `resend`, and as the password the API key from Resend. The person types that in there themselves. Brevo works too, with `smtp-relay.brevo.com` and port `2525`. The sender is an address on your own domain that's confirmed with the mail service.
- **Signing in with Google, Apple or GitHub:** works in the admin area under `users` → Options → OAuth2. That needs an account with each provider. Only do it once email and password are working.

### Bookings

The recipe `buchungen` is a small booking tool for classes, guided tours and appointments, without customer accounts and without paying online. It's tested: two people never get the same last place, past dates can't be booked, a class stays at 18:30 even after the clocks change, and emails give the time in Swiss time.

**How you put it to the person:** “Visitors pick a date on your site and get a confirmation by email. You enter your classes once as a weekly schedule, for example every Monday at 18:30 with 12 places, and on the page ‘My bookings’ you see who's coming.”

You do the technical part, the person only decides. In this order:

1. **Ask for the classes before you build:** name, weekday, time, length, places, location, price and how long before the start people can still book. If the plan only says “we've got that”, ask for them now. Write them in `docs/kurse.md` and as `bausteine/pocketbase/pb_migrations/3_kurse.js` (pattern below): that way the dates are there from the first start, and nobody types them up.
2. **Add it:** `2_buchungen.js` to `bausteine/pocketbase/pb_migrations/`, both files from `pb_hooks/` to `bausteine/pocketbase/pb_hooks/`. Leave the folder `rezepte/buchungen` where it is; the test lives there.
3. **Make two proper pages out of it,** with header, menu and footer like all the others, never the bare HTML files:
   - `seite/buchen.html` becomes the booking page, for example `web/src/pages/kurse.astro` in the site's layout: take over the content of `<main>`, the script as `<script is:inline>`, and from the styles only the parts without `body`, `main` and `h1`. At the top, the weekly schedule in words (“Monday 18:30 Evening yoga”), from `docs/kurse.md`.
   - `seite/verwaltung.html` becomes “My bookings”, for example `web/src/pages/verwaltung.astro`, with `<meta name="robots" content="noindex">` and not in the menu.
   - Set the colours at the top of both files to the site's tokens (`var(--…)` from `tokens.css`), no copied colour values.
   - Enter the path of the booking page in `pb_hooks/buchungen.js` at `BUCHUNGSSEITE` (for example `"/kurse/"`), otherwise the links in the emails lead nowhere.
4. **Check, with proof:** `bun bausteine/pocketbase/rezepte/buchungen/test.ts` must report “Alles grün”. Then build in `web/` (`npm run build`) and start `bun bausteine/pocketbase/lokal.ts`: the whole site runs with the booking tool on the person's computer, and emails show up in the terminal instead of reaching real people. The person books a place themselves, cancels it again and logs in on “My bookings” with the account that `lokal.ts` shows. Show them the text of the email. Without this output, the check isn't green.
5. **At launch:** photo of the server (tool `snapshot`, name `vor-baustein`), hook it in, to the harbour (section 4).
6. **Emails, before the person shares the link:** After going live, set up the emails (the “Emails” point above) and book a place on the web to the person's own address. Only once this email has arrived is the booking tool finished. Notices about new bookings go to the sender address; you enter a different one in `pb_hooks/buchungen.js` at `MELDUNGEN_AN`.
7. **Show the person how to look after it themselves:** open “My bookings” on their phone (`https://{name}.aufwind.sh/verwaltung/`) and log in with the admin area's account. There they see the next two weeks, cancel a booking or a whole date (everyone who booked gets an email with the reason), and add classes or end them. Bookmark the page for them. One-off dates like a workshop don't go there (yet), but into the admin area under `termine` (the dates). If there's an entrance in front (section 7), “My bookings” only works through the tunnel.

Pattern for `3_kurse.js` (weekdays `mo` to `so`, time in Swiss time, booking cut-off in minutes before the start):

```js
/// <reference path="../pb_data/types.d.ts" />
// The classes from docs/kurse.md. Later the person changes them on “My bookings” themselves.
migrate((app) => {
  const kurs = (titel, ort, preis, buchungsschluss_min, plaene) => {
    const a = new Record(app.findCollectionByNameOrId("angebote"));
    a.set("titel", titel); a.set("ort", ort); a.set("preis_hinweis", preis); a.set("buchungsschluss_min", buchungsschluss_min); a.set("aktiv", true);
    app.save(a);
    for (const [wochentag, zeit, dauer_min, plaetze] of plaene) {
      const w = new Record(app.findCollectionByNameOrId("wochenplan"));
      w.set("angebot", a.id); w.set("wochentag", wochentag); w.set("zeit", zeit); w.set("dauer_min", dauer_min); w.set("plaetze", plaetze); w.set("aktiv", true);
      app.save(w);
    }
  };
  kurs("Evening yoga", "Seestrasse 1, Testwil", "CHF 25, cash or TWINT on site", 30, [["mo", "18:30", 75, 12], ["mi", "18:30", 75, 12]]);
});
```

The weekly schedule creates the dates eight weeks ahead, and new ones are added every night. If the person changes the time or places, that applies to all dates without a booking; booked ones stay as they are.

- **If you extend it, these rules stay:** Free places are always places minus active bookings, never a counter. Checks happen on the server (`pb_hooks/`), never only in the browser. Store times as a point in time, show them with `Europe/Zurich`. Give deadlines as a date and time, never “24 h before”. After booking, a confirmation page and an email. Only collect what's needed: no address, no date of birth, no health details. A deletion period (suggestion: 12 months after the date) goes into the privacy policy (skill `recht-ch`).
- **Deliberately left out,** until it's missed: paying online (if there are many no-shows, or for a deposit: a payment link with the booking number), customer accounts for subscriptions or 10-visit passes (recipe `mitglieder`), a waiting list, a reminder the day before.
- **With Light** there's no real booking: without a program on the server, nobody counts the places. Say so honestly and leave the choice: a request by email or through a form service (“You'll get a confirmation by tomorrow”), a link to someone else's booking tool (costs money, data often abroad), or Pilot with this recipe.

## 6. Strapi: the big CMS

Strapi is a complete system for content with roles and image management, plus a database of its own (Postgres). More on that, and on whether it's worth it: skill `cms`. Strapi only runs on the server, so at launch.

1. **Secrets first,** before `include` is in the harbour, otherwise the first build fails. From the logbook, without you seeing them:
   ```bash
   ssh {name}@aufwind.sh 'mkdir -p ~/projekt/bausteine/strapi && sh -s ~/projekt/bausteine/strapi' < bausteine/strapi/geheimnisse.sh
   ```
2. **Content types as files:** On the server, Strapi runs in production mode, where you can't click content types together. You write them under `bausteine/strapi/cms/src/api/`. The recipe `veranstaltungen` shows the pattern: `schema.json` plus controller, route and service.
3. **Reading for everyone:** In `bausteine/strapi/cms/src/index.ts`, add the type to `OEFFENTLICH`, for example `'api::veranstaltung.veranstaltung'`. The site then reads `/cms/api/veranstaltungen` on its own address, and pictures come via `/cms/uploads/`. Writing only happens in the admin area.
4. **Add `include`, into the logbook, to the harbour.** The first build takes about 7 minutes. Say so beforehand, so nobody thinks it's stuck.
5. **First account for the admin area:** tunnel `ssh -N -L 1337:localhost:1337 {name}@aufwind.sh`, then `http://localhost:1337/admin`. The person creates the account there themselves.
6. **Open up the admin area** (for an editorial team without a terminal): only once the first account exists, otherwise a stranger could register first. In `bausteine/strapi/nginx.conf`, replace the first block with the block “Verwaltung freigeben” (open up the admin area), without `#`; in `bausteine/strapi/cms/config/server.ts`, switch on the line `url: '/cms'`; into the logbook, to the harbour. Then the admin area is at `https://{name}.aufwind.sh/cms/admin`. The person invites the editorial team there (Settings → Users, role Editor or Author). Everyone sets their own password.
7. **Entries appear** as soon as they're published in the admin area. A new build isn't needed for that.

## 7. One entrance for everything? (Ein Eingang für alles?)

**The picture:** the reception desk in a building with several offices. Anyone who wants to get in signs in once; each office only learns who's coming and with which role. The entrance is a small service in front of the site. Signed in is whoever PocketBase knows (recipe `mitglieder`); there's no second login.

These rules decide whether it's needed, in this order:

1. **Never with Light,** and never without a server of your own: the entrance is a program that runs on the server.
2. **Not needed with one building block where PocketBase's rules are enough:** for example only the recipe `mitglieder` (messages only for approved members) or only `buchungen`. Then go without an entrance.
3. **Needed when two or more parts must know who's signed in** (for example protected pages under `/intern/` and the messages from PocketBase, or a small program of your own next to it), **or when roles apply across parts** (the committee sees `/vorstand/` and may do more in PocketBase).

The answer goes into `docs/betrieb.md`, on the line `Eingang:` (skill `betrieb`). Its value always starts with the German word `ja` or `nicht nötig`, even if the person speaks another language; after that comes the reason in their language, for example `Eingang: ja – /intern/ and the messages from PocketBase need the same sign-in` or `Eingang: nicht nötig – only the recipe mitglieder, PocketBase's rules are enough`. The skill `lancieren` only builds in the entrance with `Eingang: ja`. The site's doors (`docs/tueren.txt`: open, only after signing in, never) become the parts in `bausteine/eingang/eingang.json`.

**Costs:** no extra money, it runs alongside everything else on the Pilot server. Memory: 20 MB when idle, up to 69 MB under full load (measured on 31.10.2026 on a Mac, not yet on the server); every call to a protected part asks PocketBase, which costs almost a millisecond. Plus one more part to look after (the Bun version in the `Dockerfile`).

**Building it in,** locally first like every building block (section 4), step by step in `bausteine/eingang/README.md`:

1. PocketBase with the recipe `mitglieder` is built in. Fetch `bausteine/eingang`, `pb_hooks/*` to `bausteine/pocketbase/pb_hooks/`, `pb_migrations/2_eingang.js` to `bausteine/pocketbase/pb_migrations/`.
2. In `eingang.json`, enter the site's address (`ursprung`) and the parts: name, target, paths, access `offen` (open), `angemeldet` (signed in) or `rolle:<name>`. Protected pages live in their own folders (`seite/intern/`). If your own domain comes along later, nothing needs to change here: the entrance accepts forms and sign-ins from whatever address the site is opened with.
3. In `mitglieder.html`, set `const EINGANG = true;`: signing in then applies to all parts, with a cookie.
4. `bun bausteine/eingang/test.ts` reports “Alles grün”, then `bun bausteine/pocketbase/lokal.ts --eingang`: the person opens a protected page without signing in, signs in, comes back and signs out again.
5. At launch (skill `lancieren`, part 2): in `compose.yaml` under `include:`, the line `- bausteine/eingang/compose.yaml`, and for the service `webseite`, delete the lines `ports:` and `- "80:80"`, otherwise people could get round the entrance. The website can then only be reached behind the entrance. Then check every door from outside: `node scripts/pruefen.mjs --tueren https://{name}.aufwind.sh` with the “doors of the building blocks” (section 4): `/intern/` gives 401, `/_/` and `/api/collections/_SUPERUSERS/auth-methods` give 404, the home page 200.

**What it can't do:** behind the entrance, “My bookings” (recipe `buchungen`) only works through the tunnel, because the entrance closes the admin area from outside, however it's spelled. It also blocks PocketBase's realtime feature (`/api/realtime`); no recipe needs it. Signing out applies to one device; signing out everywhere means setting a new password.

## Stumbling blocks

- **Admin area opened up before the first account exists:** First create the account through the tunnel, then open it up. Only open it up if others without a terminal need it.
- **One building block too many:** Every part wants looking after and updating. Better one that runs well. An entrance without a second part is one too many.
- **Straight onto the server:** a building block that wasn't green locally, and that the person hasn't clicked through themselves, doesn't go onto the server.
- **Updates:** The versions are in the `Dockerfile` (PocketBase, entrance) and in `package.json` (Strapi). Take a photo before every update.
- **Data:** It lives in volumes on the server and is included in the daily photos. `docker compose down -v` deletes it; never do that without a photo and without a yes from the person.

## Final message

Your last message in this step starts with one sentence on the picture “prefab parts when building a house” that sums up the core once more. Then: what's built in, where it runs and how much memory it needs, what's still open and what comes next.
