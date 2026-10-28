---
name: sicherheit
description: "Makes a project secure together with someone with no background, using the picture of a house with a key ring, a safe, windows and locks: secrets never go into the logbook (Git) but into .env on the server (and, if the conveyor belt needs one, into the harbour's safe); keys published by accident get recreated straight away; one key per purpose; only the doors you need stay open; updates. Use this skill for “security”, “password in the code”, “API key”, “.env”, “secret”, “I pushed a key to GitHub”, “I leaked my API key”, “is my site secure?”, “I've been hacked”, “updates”, “firewall”, and before a new secret goes into the project."
---

# Security: don't leave the key under the doormat

## The picture

A house is only as safe as its most careless moment. Burglars don't look for the strongest lock, they look for the key under the doormat and the open cellar window.

- **Secrets** (passwords, API keys, private keys) are keys. They belong in the **safe**, never under the doormat.
- The **logbook** (Git) isn't a doormat, it's a shop window: whatever is in it once stays visible in all the old entries.
- **Doors and windows** are the open ways into the server. Only as many as you need.
- **Updates** are new locks, for when a trick against the old ones has become known.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, calm but clear. If a secret has become public: act straight away, without blaming anyone.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- You never read secrets out, never print them and never write them into the chat, commit notes or logs.
- Public keys (e.g. `phc_…` for statistics or `pk_…` at Stripe) aren't secrets. You can often spot secret ones by how they start: `sk_…`, `ghp_…`, `-----BEGIN … PRIVATE KEY-----`.

## Steps

**With Light**, everything Albatros puts on display is public, even what isn't linked anywhere: the folder `seite/`. If it's missing, it's `public/`, or even the whole repo including `docs/`. That's why the page stays in `seite/`. No secrets at all belong in there. Steps 1 and 2 still apply. Everything to do with the server, `.env` and ports only applies with Pilot.

### 1. Is there already something under the doormat?

```bash
git ls-files | grep -E '(^|/)\.env(\..+)?$' | grep -v '\.env\.example$'
git log -p --all | grep -nE -- '-----BEGIN [A-Z ]*PRIVATE KEY-----|sk_live_|sk_test_|ghp_[A-Za-z0-9]{20,}|password *[=:]' | head
```

If you find something: **recreate it at the provider straight away** (rotate it) and make the old one invalid. Deleting it from the repo isn't enough, the old entry stays in the logbook and in the harbour. Only tidy up after that.

### 2. The safe

- **`.gitignore`** contains `.env`, `.env.*` and `!.env.example`. The person checks it with you.
- **`.env.example`** in the repo shows which secrets are needed, with empty values.
- **On the server** the real values are in `~/projekt/.env`, readable only by you:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && umask 077 && touch .env && chmod 600 .env'
  ```
  The person enters the values themselves (`nano ~/projekt/.env`), so they don't end up in your history.
- **For the conveyor belt:** it runs on your server, and your site reads its secrets from the `.env`. If a step in the workflow does need one, it goes into the harbour's safe (in the repo under Settings, Actions, Secrets) and reaches the command in the workflow only through `env:` (skill `pipeline`).
- **In the Dockerfile:** a `.dockerignore` with `.env`, `.git`, `node_modules`. Otherwise the `.env` gets packed in during the build.

### 3. One key per purpose

The person's house key (for server and harbour), the server's read-only key for the harbour, later on your own server the conveyor belt's key: each one separate. If one gets lost, only that lock gets changed (in the cockpit or with `schluessel_hinterlegen`).

### 4. Doors and windows

On Albatros, the platform takes care of the front door (firewall, protection against password guessing). You look after the doors you open yourself:

- In `compose.yaml`, only the website goes out on port 80. Bind everything else (database, CMS, admin) only to `127.0.0.1`, e.g. `"127.0.0.1:5432:5432"`, or don't publish it at all. Otherwise Docker opens ports right past any firewall.
- Admin areas only through a tunnel (skill `cms`).
- Check that nothing internal gets served:
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.env
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.git/config
  ```
  Both must be `404` (or `403`).

### 5. New locks

- On the server: `apt list --upgradable` shows pending updates. Before bigger updates, a photo (skill `zurueck-auf-gestern`), then `sudo apt update && sudo apt upgrade`.
- In the project: `npm audit` (if there's a `package.json`) shows known holes in building blocks.

### 6. Few rights

- Workflows only get the secrets they need. On GitHub (after the move, skill `landung`) also `permissions: contents: read`.
- Don't let programs in the container run as root if the template allows it (`USER` in the Dockerfile).
- Everyone who works on it gets their own access, never a shared one.

### 7. Check the mission

Logbook and conveyor belt (skills `git-logbuch`, `pipeline`), then `mission_pruefen` with `flugschule-07-sicherheit`. The check looks at whether `.gitignore` in the project contains `.env` (with Pilot in `~/projekt` on the server, with Light in the harbour).

## If something has happened

1. Recreate the secret at the provider, block the old one.
2. Check whether it was misused (invoices, logins, mailing lists at the provider).
3. Put the server back to a photo from before the incident if it was changed (skill `zurueck-auf-gestern`).
4. If other people's data is involved: inform Albatros via `coach_fragen`. If there's a high risk for the people affected, the data protection law requires a report to the EDÖB (the Swiss Federal Data Protection and Information Commissioner) (Art. 24 DSG, the Swiss Federal Act on Data Protection). No legal advice.

## Final message

Your last message in this step starts with one sentence on the picture “don't leave the key under the doormat” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
