---
name: lancieren
description: "Gets the released site of a person with no prior knowledge online, in two parts. Where it lives (P11): always the same question, Albatros (Light without building blocks, Pilot with one) or hosting it yourself, prices only from konto_status, upgrade_link with bestaetigt only after the choice, SSH key, seite_erstellen or server_erstellen; self-hosted on GitHub Pages, Cloudflare Pages, Netlify or your own server. Going live (P13): only with “Freigegeben:” the released site to the harbour or the provider, with a building block and login the entrance in front, check from outside (pruefen.mjs --live and --tueren), domain optional, go-live-check on the business path, announcement. Result: docs/lancieren.md, docs/live.md. Use this skill after the release and for “put it online”, “publish”, “go live”, “where should my site live”, “choose a plan”, “host it myself”."
metadata:
  stand: 0.3.3
  quelle: 'd75f241bcaf6'
---

# Launch: where it lives and the opening

## The picture

The house is built, inspected and released. Now two things follow, in this order. First you decide where it stands and fetch the key for it: **where it lives**. On the plot there's only a show house at first (the Albatros template). Once the letterbox and the smoke alarm are up (skill `betrieb`), the **opening** follows, with a ribbon across the door: exactly the released house moves in, someone checks from the street that everything is right, and the first guests hear about it.

**How to use the picture:** One sentence about the picture in your first answer, and which of the two parts is due now.

## How you talk

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- The line starts in files under `docs/` (`Wohnort:`, `Grund:`, `Adresse:`, `Freigegeben:`, `Live seit:`, `Geprüft:`, `Angekündigt:`) stay German, like the markers `[Annahme: …]` and `[offen: …]`: `lage` and the checks look for them exactly like that. What comes after the colon you write in English.
- You only name prices from `konto_status` (Albatros) or from a provider's pricing page you've just read, never from memory. If you haven't read it, you say “it's on the pricing page”.
- Cards, passwords and private keys never go into the chat. Payment happens on the payment page; accounts with providers are created by the person themselves, in the browser.
- No pressure: hosting it yourself is a good choice when it fits. You recommend the smallest place that's enough, with a one-sentence reason from the plan.
- Only the site the person has released goes online (`Freigegeben:` in `docs/prd.md`), and only in the second part.
- At most two questions per message. Whatever the person should see (payment page, harbour, site on the web), you open yourself: `open <address>` (Linux `xdg-open`, Windows `start`).
- In `lernen` mode (line `Modus:` in `docs/projekt.md`), the person creates the SSH key and does the first push themselves; in `machen` mode you do it and explain it in one sentence.

## Part 1: Where it lives (phase P11, `schritt: wohnort`)

### 1. Is the site released?

```bash
# the last line “Freigegeben:” in docs/prd.md counts: a date with a year at the front, no [Annahme] anywhere (the same rule as at Albatros)
cp <folder of this skill>/../webseite-bauen/pruefen.mjs scripts/   # the newest version, older ones don't know --freigabe
# folder unknown: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
node scripts/pruefen.mjs --freigabe
```

The site is only released if the command ends with 0 and shows “Seite freigegeben: …” (site released); that way it judges the same on every computer, on Windows too. Otherwise it ends with 2 and says why: the line is missing, the last line `Freigegeben:` has no date with a year at the front (for example “not yet” or “1 page still missing”), or it has an `[Annahme: …]`. If it shows something else, for example a report on the whole site, `scripts/pruefen.mjs` is an old version: fetch it as above and check again. If the site isn't released, you say so honestly: first comes the walk-through with the release (skill `webseite-bauen`, step 6). If the person still wants to choose where it lives already, that's fine; the site only moves in after the release. But you only write `docs/lancieren.md` and report `wohnort` after the release: otherwise the flight plan counts where it lives, and the question about the release drops out.

### 2. The question, always the same

Before you ask, you gather the basics: `konto_status` (plan, and the prices of Light and Pilot), the line `Setup:` in `docs/plan.md` and the building-block line in `docs/stack.md`. Then you show the three options in a small table, with the prices from `konto_status`:

| Where it lives | fits if | costs | what you do yourself |
|---|---|---|---|
| Albatros Light | the site needs no building block (texts, pictures, contact by email) | CHF … a month | nothing: whatever you send to the harbour is online shortly after |
| Albatros Pilot | a building block runs (sign-up, booking, login) or you want your own server | CHF … a month | little: conveyor belt and daily photos of the server are there |
| hosting it yourself | you want everything in your own hands and have time for the upkeep | with the provider | account, set-up, backup and monitoring |

Add one sentence of recommendation with a reason from `docs/plan.md` (`Setup:`).

**With a login:** if the project has a building block with a login (recipe `mitglieder`; you can tell from `Zugang:` in `docs/plan.md` and `Baustein:` in `docs/stack.md`), you recommend Pilot or hosting it yourself on your own server, never Light, and you name the **entrance** step (Eingang) straight away: whether an entrance with one login for all parts goes in front of the site, you sort out when getting ready to run it (skill `betrieb`, line `Eingang:`, following the criteria in the skill `bausteine`, section “One entrance for everything?”). It gets built in when going live (`bausteine/eingang`); after that, the website can only be reached behind the entrance.

Then the question, on its own in the message:

> Where should your site live: with Albatros (Light without building blocks, Pilot with your own server) or do you host it yourself?

Up to here, everything at Albatros was free. If the person asks why it costs something now, you say: a place on the web needs a computer that runs day and night.

### 3a. With Albatros: Light or Pilot

1. **The plan only after the choice:** once the person has chosen Light or Pilot, you fetch the link with `upgrade_link`, with `stufe` (`light` or `pilot`) and `bestaetigt: true`. Before that, you never call the tool. Give them the link and open it: they type their card only there. If a plan is already running, the link goes to the customer portal (for example for switching from Light to Pilot). Then `konto_status` until the plan is active.
2. **House key and lock:** follow the skill `ssh-schluessel`. With Light, the lock opens the harbour for the logbook, with Pilot also the door to the server. Learning moment: what an SSH key is, with the picture of lock and key. In `lernen` mode the person creates the key themselves; afterwards you report `verstanden_melden` (mission `flugschule-16-wohnort`, kind `selbst`).
3. **The name in the address:** it becomes part of `https://<name>.aufwind.sh` (3 to 32 characters: lower-case letters, digits, hyphen). Suggest one from the project name (`docs/projekt.md`, the line `Name:` in `docs/konzept.md`) and ask whether it fits.
4. **Site or server:** with Light `seite_erstellen`, with Pilot `server_erstellen`, each with `name`, the lock (`schluessel`, only the content of the `.pub` file) and `sprache` (the language of the conversation, here `en`). A server usually takes one to two minutes: ask `konto_status` until it's ready. If the name in the answer is different, say so right away.
5. **Have a look:** open `https://<name>.aufwind.sh` with the person. What's there now is the Albatros template, not their site. Say so clearly: their released site only moves in when going live.

### 3b. Hosting it yourself

The person gets the site online themselves. Albatros stays free for them (island, skills); only the tools for server, harbour and domain come with a plan. How it works depends on the building block:

- **Without a building block (a static site):** any provider for static sites delivers the folder `seite/`. Three common ways, each with an account at the provider that the person creates themselves:
  - **GitHub Pages:** the logbook goes to GitHub, and a small conveyor belt there delivers `seite/`. It's free with a public repository: then everyone can also see `docs/` with the plan and the concept. A private repository needs a paid GitHub account (pricing page). Without your own domain, the site lives at `https://<user>.github.io/<repo>/`, so in a subfolder: then `web/astro.config.mjs` needs `site: 'https://<user>.github.io'` and `base: '/<repo>'`, otherwise the links lead nowhere. Without a subfolder it works with the repository `<user>.github.io` or with your own domain.
  - **Cloudflare Pages** or **Netlify:** the logbook can stay private. Either they fetch it from GitHub (output folder `seite`, no build step needed, because `seite/` is already built in the logbook), or you upload `seite/` straight from the computer, without any repository. The address is then `https://<name>.pages.dev` or `https://<name>.netlify.app`.
  - The terms and limits of free offers change: read the provider's pricing page with the person before they decide.
- **With a building block:** a building block needs a server that runs day and night. Then the person rents their own server and sets it up with the Albatros template (`Dockerfile`, `compose.yaml` and `nginx.conf` from the folder `vorlage/` in albatros-skills, plus Caddy for HTTPS). That's moving into your own house: skill `landung`.

Help with the choice with three questions: may the logbook be public? Does the site need a building block? Who takes care of backups and monitoring (skill `betrieb`)? The whole way without Albatros is described in the skill `landung`, part “Direkt vom Computer ins Netz” (straight from the computer to the web). In this part, the person only creates the account and signs in; uploading only happens when going live.

### 4. `docs/lancieren.md`

Only once the site is released (step 1):

```markdown
# Launch

Wohnort: Albatros Light (or Albatros Pilot, or hosting it yourself: Netlify)
Grund: … (one sentence, from docs/plan.md, line Setup:, and the person's wish)
Adresse: https://<name>.aufwind.sh
Hafen: git@aufwind.sh:<name>/projekt.git (hosting it yourself: the repository on GitHub, or “no repository, upload from the computer”)
Gewählt: <date>
```

If, when hosting it yourself, the address is only known after the first upload, it says `[offen: kommt beim Live schalten]` (open: comes when going live). Then the logbook entry (`git add docs/lancieren.md && git commit -m "Where it lives: <place>"`) and `schritt_melden` with `wohnort` and `sprache`. If the tool is missing or doesn't know the step, you carry on without the island. In `lernen` mode you now ask the check questions of the lesson `flugschule-16-wohnort`, at most two in one message (counting any other questions): first “What's the difference between Light, Pilot and hosting it yourself?” and “What is an SSH key, in one sentence?”, after the person's answer “Is your site on the web after this step?” They're here because `lage` and `mission_holen` no longer show them after `wohnort`. You only report `verstanden_melden` (kind `kontrollfrage`) after their answers.

Next comes the skill `betrieb`: letterbox, smoke alarm and front door, before the guests arrive.

## Part 2: Going live (Live schalten) (phase P13, `schritt: hafen`, `fliessband`, `live`, `domain`)

Only once `docs/betrieb.md` has all its lines (skill `betrieb`). If it's missing, you go there first.

### 1. Only the released site

```bash
# the release from the walk-through, as in part 1, step 1
cp <folder of this skill>/../webseite-bauen/pruefen.mjs scripts/   # the newest version, older ones don't know --freigabe
node scripts/pruefen.mjs --freigabe
git status --short seite web design                       # empty: nothing unsaved on the site
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
```

- **No “Seite freigegeben: …”** (`pruefen.mjs --freigabe` ends with 2): nothing goes online. Back to the skill `webseite-bauen`, step 6.
- **Changed since the release** (no output “Seite wie freigegeben”, site as released): the person looks at the changed site locally and releases it again (new line `Freigegeben:`, `git tag -f freigegeben`). Only then do you carry on.
- **No tag `freigegeben`** (older projects): show the person the site locally and ask: “Is this exactly the site you released?” After the yes, you set the tag (`git tag freigegeben`).

### 2. To the harbour or the provider (`schritt: hafen`)

#### With Albatros

Since the place was chosen, the harbour holds the template, one entry. The logbook on the computer has a beginning of its own. You connect the two without cloning again and without copying files (skill `git-logbuch`, part “Logbuch ohne Hafen”):

```bash
git remote -v                                                    # is there already an origin? then use the name hafen instead of origin
git remote add origin git@aufwind.sh:<name>/projekt.git          # address from docs/lancieren.md or konto_status
git fetch origin
git merge origin/main --allow-unrelated-histories -X ours -m "Template from the harbour taken in, the released site stays"
git diff --quiet freigegeben HEAD -- seite && echo "Seite unverändert"
```

Tell the person with the picture: the template is taken into the logbook once. Where both have the same file (`seite/index.html`, `.gitignore`), theirs stays. On top come the files Pilot's conveyor belt needs (`Dockerfile`, `compose.yaml`, `nginx.conf`, `.github/workflows/deploy.yml`); with Light they sleep. If after the merge it doesn't say “Seite unverändert” (site unchanged), you don't push, and you look with `git diff freigegeben HEAD -- seite`.

**With a building block (Pilot), before the push:** now the template's `compose.yaml` is in the logbook, and you hook in the building blocks as in the skill `bausteine`, section 4 “At launch, with Pilot”: first a photo of the server (tool `snapshot`, name `vor-baustein`), then `include:` in `compose.yaml`. If `docs/betrieb.md` says `Eingang: ja` (`grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` shows the line), the **entrance** step comes on top: the line `- bausteine/eingang/compose.yaml` under `include:`, and for the service `webseite` the lines `ports:` and `- "80:80"` go. Port 80 then belongs to the entrance, and the website can only be reached behind it. Before that, `bun bausteine/eingang/test.ts` has to report “Alles grün”. Without a login, or with `Eingang: nicht nötig`, `compose.yaml` stays as in the template. Then a logbook entry.

```bash
git push -u origin main
```

Then you open the harbour in the browser (`open https://code.aufwind.sh/<name>/projekt`) and report `hafen`.

#### Hosting it yourself, with GitHub (Selbst, mit GitHub)

The person signs in with `gh auth login` in the browser. For GitHub Pages, you first create the conveyor belt, `.github/workflows/seite.yml`:

```yaml
name: Seite
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false            # never cancel a delivery that's running
jobs:
  ausliefern:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.pages.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: seite                  # the built folder, exactly as released
      - id: pages
        uses: actions/deploy-pages@v4
```

Then take the logbook along: `gh repo create <repo> --private --source . --remote origin --push` (for GitHub Pages without a paid account `--public`, once the person knows that `docs/` is then public too). For GitHub Pages, the person sets the source to “GitHub Actions” under Settings, Pages. Then you report `hafen`.

#### Hosting it yourself, without a repository (Selbst, ohne Repo)

You upload `seite/` directly, after the person has signed in in the browser: `npx netlify-cli deploy --dir=seite --prod` or `npx wrangler pages deploy seite --project-name=<name>`. The logbook stays on the computer; its backup is noted in `docs/betrieb.md`. Then there's no harbour, and you don't report `hafen`.

### 3. Conveyor belt (`schritt: fliessband`)

- **Light:** there isn't one: about a minute after the push, Albatros shows the folder `seite/`.
- **Pilot:** the push starts the conveyor belt from `.github/workflows/deploy.yml`. Open `https://code.aufwind.sh/<name>/projekt/actions` and watch with the person. Green: report `fliessband`. Red: skill `pipeline`, part “Wenn das Band rot ist” (when the belt is red).
- **Hosting it yourself:** for GitHub Pages under “Actions”, for Netlify and Cloudflare in their list of deploys. Green: report `fliessband`. Uploading without a repository has no conveyor belt.

### 4. Check from outside (`schritt: live`)

**You check yourself; the person never waits.** The address already answers before (with the template). That's why you wait for the site's title as it appears in `seite/index.html` between `<title>` and `</title>`, at most three minutes:

```bash
for i in $(seq 12); do curl -s <address> | grep -qF "<your site's title>" && echo "The site is there" && break; sleep 15; done
node scripts/pruefen.mjs --live <address>
node scripts/pruefen.mjs --tueren <address>
```

The address is in `docs/lancieren.md` (`Adresse:`). Only what's been checked from outside counts as live: if nothing is red with `--live` (title as built, legal notice and privacy policy reachable, access, Lighthouse) or with `--tueren`, you report `live`, open the address with the person and compare it with the screenshots from the check.

- **With the entrance:** `docs/tueren.txt` lists the protected paths with 401 (without signing in, for example `/intern/ 401`), plus `/_/ 404` and `/api/collections/_SUPERUSERS/auth-methods 404`: the admin sign-in stays closed from outside. PocketBase lists with a rule (for example `/api/collections/users/records`) answer guests with 200 and an empty list, not 401 or 403; all doors per recipe are in the skill `bausteine`, part “Türen der Bausteine”. If the file still dates from the build without an entrance, you adjust it before the check. Only when `--tueren` shows exactly that and the home page gives 200 is the site really behind the entrance.
- **With a building block, “live” isn't “done” yet:** only once the data is in (for example the courses) and a test booking on the web has brought its email to the person's own address (skill `bausteine`) do you tell the person they can share the link. Until then, you say honestly what's still missing.

#### Still not there after three minutes (Nach drei Minuten noch nicht da)

With Light, `konto_status` shows whether the newest state is online or what's missing. Often `seite/index.html` is missing in the harbour because `seite/` is listed in a `.gitignore`. With Pilot you look under “Actions” (skill `pipeline`), when hosting it yourself in the provider's list of deploys. Fix it, new entry, push, check again. If the fix changes the site itself, you show it to the person first and get the release again. If it still doesn't work, you say what you checked and ask the coach (`coach_fragen`).

### 5. Your own address, optional (`schritt: domain`)

Ask: “Your own address (domain) now, later or never?” Add: it costs something every year and is optional. Their answer goes straight into `docs/live.md` (template in step 8), into the line `Eigene Domain:`: first `jetzt`, `später` or `nie` in German, then, if they like, a sentence in English, for example `Eigene Domain: später, once the committee has decided on the name`. Now: with Albatros you follow the skill `domain`; when hosting it yourself, you connect it at the provider (skill `landung`, part “Direkt vom Computer ins Netz”). Once `https://<domain>` shows the site with the padlock, you report `domain` and check again with `pruefen.mjs --live https://<domain>`.

**With a login** (a building block with sign-in, for example a members' area): after the domain, the person signs in once through `https://<domain>`, on the sign-in page. With the entrance, nothing needs to go into `eingang.json`: it accepts sign-ins and forms from the address the site is opened through. If that works, the site accepts sign-ins and forms through the new address too. If the page says the email or password is wrong although both are right, or a form doesn't go through on the domain: with Albatros, you ask the coach (`coach_fragen`) and say what you checked; until then, the person signs in through `https://<name>.aufwind.sh`. When hosting it yourself there's no address on aufwind.sh, and without a subscription no coach: then the person writes an email to hallo@albatros.build with what you checked (what goes in it and what never does is in the skill `lotse`, section “Reporting gaps”); until then, they sign in through the address that applied before the domain.

**If the site replaces an existing one** (`docs/bestand.md`, skill `webseite-modernisieren`): the old domain then points to the new site. Every old address from `docs/bestand.md` that no longer exists gets a redirect to the matching new place (in Astro under `redirects` in `web/astro.config.mjs`). You never touch the email entries (MX).

### 6. Business path: the pre-flight check

On the business path you fetch the method `go-live-check` with `methode` and follow it: it reads the address from `docs/lancieren.md` and writes its result into `docs/live.md` under `Geprüft:`. The method comes with Light and Pilot. If the site is hosted by the person themselves, `methode` won't hand it out without a plan, and the check through the Albatros server isn't possible: say so honestly and go through the check from step 4 with the person, plus form, emails and checkout tried out themselves.

### 7. Who do you tell first?

Ask: “Who do you tell first?” Your first fan won't turn up on their own. Help with a short text the person sends themselves (for example to three people who care about it). You don't send anything.

### 8. `docs/live.md`

```markdown
# Live

Live seit: <date>
Adresse: https://… (the address on the web; with your own domain, that one, once it's active)
Eigene Domain: <jetzt | später | nie>, <a sentence, if the person says one>
Geprüft: <date>, pruefen.mjs --live without red, doors as expected (docs/pruefung/messwerte-live.json)
Angekündigt: <date>, <whom>
```

After `Eigene Domain:` comes first `jetzt`, `später` or `nie` (now, later, never), in German, as the person answered in step 5; `Adresse:` is always the address on the web. Then the logbook entry, the push as above, and the mission. In `lernen` mode you now ask the check questions of the lesson `flugschule-18-live-schalten`, at most two in one message (counting any other questions): first “Which site goes onto the web when you go live?” and “When is your site really live?”, after the person's answer “Why do you tell someone first?” They're here because `lage` and `mission_holen` no longer show them after `live`. You only report `verstanden_melden` (kind `kontrollfrage`) after their answers.

If the person wants something different afterwards, the skill `webseite-aendern` applies: small (change locally, show, release, push) or big (addition to the plan, draft, approval to build, build, show, release, push).

Only what belongs to the person, or what they have permission for, gets published (skill `webseite-modernisieren`, part “Rechte”).

## Pitfalls

- `upgrade_link` before the person has chosen, or prices from memory.
- Pushing your own site already when choosing where it lives: with Light every push is online right away, and the site is then on the web before the letterbox and the smoke alarm.
- Reporting `wohnort` or writing `docs/lancieren.md` before the site is released: then the flight plan jumps over the release.
- Cloning the logbook from the harbour and copying the site into it: the entries from the build are lost. Connect instead of copying.
- `git push --force` to overwrite the harbour: never. Merge as above.
- Pushing although the site has changed since the release.
- Saying “it's online” without having checked from outside yourself.
- With the entrance, leaving `ports:` in the service `webseite`: then people could get round the entrance.
- A public repository for GitHub Pages without telling the person that `docs/` is then public too.

## Checking the mission

- After part 1: `mission_pruefen` with `flugschule-16-wohnort` (island at “Wohnort”). With Albatros also `flugschule-01-start`: the check looks at whether `https://<name>.aufwind.sh` answers.
- After part 2: `mission_pruefen` with `flugschule-18-live-schalten` (island at “Live”), with Albatros also `flugschule-04-git-logbuch`, with Pilot `flugschule-05-pipeline`.

## Final message

Your last message in this step starts with a sentence on the picture “where it lives and the opening” that says the core once more. After that: what's done (place chosen or site live), where the result is (`docs/lancieren.md`, `docs/live.md`, the address), what's still open and what comes next (after choosing the place, the skill `betrieb`; after going live, the first guests).
