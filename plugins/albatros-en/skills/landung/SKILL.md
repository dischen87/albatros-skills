---
name: landung
description: "Plans and guides the move of a project from Albatros to an own server, explained with the picture of moving into your own house: moving checklist, renting and setting up a server (SSH with keys only, firewall, updates, Caddy for HTTPS), taking the logbook to GitHub, switching the conveyor belt there to the new target over SSH with its own key, taking data and secrets along, testing, switching the address in DNS or moving a domain bought through Albatros to a new registrar with the auth code from domain_mitnehmen, and taking over backups yourself. Use this skill for “my own server”, “move my site”, “leave Albatros”, “Hetzner”, “VPS”, “self-host”, “landing”, “what do I need for my own server”."
---

# Landing: moving into your own house

## The picture

At Albatros you live in a flat with a caretaker: they lock the front door, change the locks and take a photo of the flat every night. In your own house you do that yourself.

The move isn't a new build. Your project is already packed in boxes that fit anywhere: the logbook (Git), the building instructions (`Dockerfile`, `compose.yaml`) and the conveyor belt (workflow). You pack the rest, move and change your address. Only the harbour belongs to the Albatros house: your logbook gets a new harbour, for example GitHub.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”. Be honest about the effort: an own server often saves money, but costs time for upkeep.
- The person rents and pays for the server themselves with the provider.
- The old home only gets switched off once the new one is proven to work.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. Is the move worth it?

Go through it briefly with the person (see skill `kosten`): Does the project need more than Albatros offers? Do they want to have everything in their own hands? Do they have an hour or two every month for upkeep? If not, staying is a good decision.

**With Light** the move is small: the `seite/` folder runs with any provider for static sites. Take the logbook to GitHub (step 4, points 1 and 2) and switch the site on there, for example with GitHub Pages. Server and conveyor belt fall away; the moving checklist stays. If the site has its own domain, switch it over as in step 6, with the records the new provider gives you (on GitHub Pages under Settings → Pages → Custom domain).

### 2. Moving checklist

`docs/landung.md` in the project:

```markdown
# Moving to my own server

## Boxes
- [ ] Logbook: everything pushed (`git status` clean)
- [ ] Logbook in the new harbour (e.g. GitHub), all entries arrived there
- [ ] Secrets: list of the names from `.env.example` (never the values here!)
- [ ] Data: database, uploaded files (folder: …)
- [ ] Settings: domains, email entries in DNS (don't touch), cron jobs
- [ ] Domain bought through Albatros? Then move it to a new registrar with the auth code (`domain_mitnehmen`)

## What I take over myself
- [ ] Updates (automatic, security updates only)
- [ ] Backups (nightly, off site, encrypted, test restore every month)
- [ ] Monitoring (does the site answer? is the disk full?)

## Steps and date
…
```

### 3. The new house

1. Rent a server, Ubuntu 24.04, at least as much memory as before. When ordering, store the person's **lock** (the public key).
2. Set it up with a script that's safe to run several times (as root, read it first, then run it):
   - Updates, Docker from the official source
   - User `deploy` with your lock, folder `~/projekt`
   - SSH with keys only: `PasswordAuthentication no` in `/etc/ssh/sshd_config.d/10-haerten.conf`, check `sshd -t` first
   - Firewall: first `ufw allow 22/tcp`, `80/tcp`, `443`, only then `ufw enable` (otherwise you lock yourself out). Keep an open SSH session as a lifeline.
   - `fail2ban`, automatic security updates (`unattended-upgrades`)
   - Limits for logs, so the disk doesn't fill up
3. **Caddy** as the doorman in front of the website: gets the certificate for HTTPS by itself as soon as the address points to the server. It goes into `compose.yaml` as its own service, and the website itself then only binds to `127.0.0.1`. One mistake in the `Caddyfile` brings everything down: run `caddy validate` before every reload, and check from outside afterwards.

### 4. Take the logbook and conveyor belt along

At Albatros, the conveyor belt's worker lives in the house. In your own house, a worker from GitHub takes over: it doesn't build things itself, but rings at the new server with its own key and has it deliver.

1. **New harbour:** The person creates an account on github.com themselves. Then install `gh` (Mac: `brew install gh`) and run `gh auth login`; signing in happens in the browser.
2. **Move the logbook:**
   ```bash
   git remote rename origin albatros
   gh repo create <projektname> --private --source . --remote origin --push
   ```
   The old harbour stays reachable as `albatros` until you move out.
3. **Read-only key for the new server:** It fetches the logbook itself, read-only. Its house key stays on the server, only the lock goes to GitHub:
   ```bash
   ssh deploy@<neue-adresse> 'ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C eigener-server'
   ssh deploy@<neue-adresse> 'cat ~/.ssh/id_ed25519.pub' > server-schloss.pub
   gh repo deploy-key add server-schloss.pub --title "eigener-server"   # read-only, that's the default
   rm server-schloss.pub
   ssh deploy@<neue-adresse> 'ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts && git clone git@github.com:<benutzer>/<projektname>.git ~/projekt'
   ```
   Compare the fingerprint of github.com with the one on docs.github.com.
4. **A key of its own for the conveyor belt**, never the person's house key. That way it can be blocked on its own:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/fliessband -N "" -C fliessband
   ssh deploy@<neue-adresse> 'cat >> ~/.ssh/authorized_keys' < ~/.ssh/fliessband.pub
   gh secret set DEPLOY_KEY < ~/.ssh/fliessband
   gh secret set DEPLOY_KNOWN_HOSTS --body "$(ssh-keyscan -t ed25519 <neue-adresse> 2>/dev/null)"
   gh variable set SERVER --body "deploy@<neue-adresse>"
   gh variable set SEITE_URL --body "https://<domain>"
   ```
   The key goes straight from the file into GitHub's safe (secrets), never into the chat and never into the logbook. After that, `~/.ssh/fliessband` may be deleted from the computer.
5. **Adjust the workflow:** In `.github/workflows/deploy.yml`, the worker and the way to the server change. The rest stays:
   ```yaml
   jobs:
     fliessband:
       runs-on: ubuntu-latest              # a GitHub worker instead of your server
       permissions:
         contents: read                    # as few rights as possible
       concurrency:
         group: ausliefern
         cancel-in-progress: false         # never cancel a delivery that's running
       env:
         ZIEL: ${{ vars.SERVER }}
         SEITE: ${{ vars.SEITE_URL }}
         SHA: ${{ github.sha }}
       steps:
         - name: Schlüssel des Fliessbands einsetzen
           env:
             DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
             DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
           run: |
             [ -n "$DEPLOY_KEY" ] || { echo "::error::Secret DEPLOY_KEY fehlt"; exit 1; }
             install -d -m 700 ~/.ssh
             printf '%s\n' "$DEPLOY_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519
             printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
         - name: Bauen und ausliefern, notfalls zurück
           run: |
             ssh "$ZIEL" "SHA=$SHA bash -s" <<'EOF'
             # paste the block from the Albatros version here, from "set -euo pipefail" to "echo "läuft: $SHA"", without the line with willkommen
             EOF
         - name: Endkontrolle von aussen
           run: |
             # unchanged from the Albatros version
   ```
   Secrets only get into the commands through `env:`, never directly as `${{ secrets.… }}` in a `run` line. Then `gh workflow run deploy.yml` and `gh run watch`. It has to turn green.

### 5. Take data and secrets along

- `.env` directly from server to server, or via your own computer with `scp`, never through Git.
- Database: back it up on Albatros (e.g. `sqlite3 app.sqlite ".backup kopie.sqlite"` or `pg_dump`), restore it on the new server.
- Uploaded files with `rsync -a`.

### 6. Switch the address

First test through the new server's address, without changing the phone book: `curl --resolve <domain>:443:<neue-ip> https://<domain>/`. Then it depends on where the address is rented.

**Bought through Albatros** (`konto_status` shows it under “Eigene Domains”, own domains): Albatros keeps the phone book for it. The address moves along to a registrar the person chooses:

1. The person creates an account with the new registrar themselves.
2. Only call `domain_mitnehmen` after their yes. From then on, Albatros no longer renews the address. Until the move, it keeps pointing to your site or server at Albatros.
3. The tool gives the **auth code**, the key for moving the address. Show it only to the person, never in a file or in the logbook. They enter it at the new registrar and start the move there (transfer). Usually they pay for a year's renewal while doing so. With `.com` and `.net`, a move often isn't possible in the first 60 days after buying.
4. Once the move is through, they set the entries at the new registrar: A and AAAA to the new server, `www` and the email entries (MX), if there were any.

**Rented somewhere else:**

1. The day before, lower the validity (TTL) of the entries to 300 seconds. Then the switch goes faster.
2. A and AAAA record to the new server. You don't need to deregister anything at Albatros for that.

Then check: `https://<domain>` answers, `www` redirects, the padlock is there.

### 7. Only then move out

Watch it for a week. If everything runs, adjust or cancel the plan at Albatros (cockpit). A domain the person bought through Albatros moves first (step 6), otherwise it expires with their plan. There are no more photos (snapshots) after that: from now on, your own backups are what counts.

### 8. Check the mission

`docs/landung.md` into the logbook and over the conveyor belt (skills `git-logbuch`, `pipeline`), then `mission_pruefen` with `flugschule-10-landung`. The check looks at whether the moving checklist `docs/landung.md` is in the project (with Pilot on the Albatros server, with Light in the harbour). Ideally, the person writes the checklist while they still live at Albatros.

## Stumbling blocks

- No certificate: the address doesn't point to the new server yet, or port 80 is closed.
- Docker ports bypass the firewall: internal services only on `127.0.0.1`.
- Backups set up but never restored: a backup only counts once a test restore has worked.
- Automatic restart after updates: only if everything comes back up by itself afterwards.

## Final message

Your last message in this step starts with one sentence on the picture “moving into your own house” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
