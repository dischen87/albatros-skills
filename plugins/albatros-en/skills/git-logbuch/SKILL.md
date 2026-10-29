---
name: git-logbuch
description: "Explains Git to someone with no background using the picture of the logbook on board and the copy in the harbour (the Albatros Git service, code.aufwind.sh). Fetches the repo from the harbour, guides them through their first entries (commits) with good notes, sends them to the harbour (push) and checks that the copy arrives on the Albatros server in ~/projekt. Rules: only on main, add only your own files one by one, never force-push. Use this skill for “Git”, “GitHub”, “harbour”, “commit”, “push”, “pull”, “repo”, “what's a repository?”, “save my changes”, “back up my work”, “push rejected”, “merge conflict”, and before you commit anything for the person."
---

# Git: the logbook on board, with a copy in the harbour

## The picture

Every ship has a logbook. Every entry says: who, when, what and why. When something goes wrong, you leaf back and see where it started.

- **Repo:** the logbook of your project, with all the files in it.
- **Commit:** an entry. It records one small, finished step, with a one-sentence note.
- **Harbour:** `code.aufwind.sh`, the Albatros Git service. It works like GitHub and is called Forgejo. A copy of the logbook is kept there. If your computer falls in the water, nothing is lost.
- **Push:** send the new entries to the harbour. **Pull:** fetch the latest entries from the harbour.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”. The words commit, push and pull only after the picture, and then always together with it.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- In the harbour, the person signs in in the browser with their Albatros account. They only need a GitHub account when they move into their own house (skill `landung`).
- You never commit anything the person doesn't know about. Before every entry you show what goes into it.

## The three rules

1. **Only on `main`.** One logbook, one line. Branches are for later and for big rebuilds.
2. **Only your own files, added one by one:** `git add <datei>` (the file). Never `git add .`, `git add -A` or `git commit -a`. They sweep half-finished work and secrets like `.env` into the logbook.
3. **Never `git push --force`.** If a push is rejected, first `git pull --rebase`, then `git push` again.

## Steps

### 1. Tools

- `git --version` shows whether Git is there. On a Mac, the first time, the computer asks whether it should install the developer tools. Yes.
- The house key from the skill `ssh-schluessel` also opens the harbour. The entry `Host aufwind.sh` in `~/.ssh/config` works for both doors.
- Set the name for the logbook once (first name, last name, email address):
  ```bash
  git config --global user.name "Vorname Nachname"
  git config --global user.email "deine-adresse@beispiel.ch"
  ```

### 2. Fetch the logbook

Albatros has already created your logbook in the harbour, with the template in it. `konto_status` gives the address:

```bash
git clone git@aufwind.sh:{name}/projekt.git
cd projekt
```

The logbook is private: only you can see it. Then check the `.gitignore`, with at least these lines: `.env`, `.env.*`, `!.env.example`, `node_modules/`, `dist/`.

### 3. The first entry

The person changes something small themselves, e.g. one line in `README.md`. You open the file for them (`open -e README.md`, Linux `xdg-open`, Windows `notepad`) and name the exact line and the new text. If they don’t feel up to it or nothing changes, you do it yourself and show them the change with `git diff`. The first entry stays small, even if the person already gives you content: on the website path the site only comes with `webseite-planen` and `webseite-bauen`, with plan, checks and sign-off. Keep their content for the floor plan. Then together:

```bash
git status                     # What has changed?
git add README.md              # Add exactly this file
git diff --cached              # What goes into the logbook?
git commit -m "README: Ziel des Projekts in einem Satz"
git pull --rebase && git push  # Send it to the harbour
```

Write the note in the person's language, e.g. `git commit -m "README: aim of the project in one sentence"`.

Good notes say what and why, in under 60 characters: “Contact: phone number added”. Bad: “update”, “fix”, “misc”.

Make a second entry so it sticks. Then show it in the browser: `https://code.aufwind.sh/{name}/projekt`. Both entries are in the harbour.

### 4. The logbook on the server

**With Light** there's no server: the push already is the delivery. Albatros shows the folder `seite/` from `main` at `https://{name}.aufwind.sh`, after about 30 seconds. If `seite/` is missing, Albatros takes `public/`, and otherwise the whole repo, so the page stays in `seite/`. At most 100 MB, and Albatros never shows shortcuts (symlinks). Before you say the change is online, check yourself, every 15 seconds for at most three minutes: `curl -s https://{name}.aufwind.sh | grep -F "<new text>"`. Then open the page for the person. Carry on with step 5.

**With Pilot:** your server has its own copy in `~/projekt`. Albatros created it during set-up, with a read-only key just for your harbour. If the logbook brings the conveyor belt with it (`.github/workflows/deploy.yml`), it fetches the new entries by itself on every push (skill `pipeline`). Check:

```bash
ssh {name}@aufwind.sh 'git -C ~/projekt log --oneline -3'
```

If the new entries are missing, fetch them by hand: `ssh {name}@aufwind.sh 'git -C ~/projekt pull --ff-only'`. If the folder is missing altogether: `ssh {name}@aufwind.sh 'git clone git@aufwind.sh:{name}/projekt.git ~/projekt'`.

### 5. Check the mission

`mission_pruefen` with `flugschule-04-git-logbuch`. The check looks at whether the logbook has at least two entries on `main`: with Pilot in `~/projekt` on the server, with Light in the harbour.

## When it gets stuck

- **`Permission denied (publickey)` at the harbour:** the lock isn't stored, or the entry in `~/.ssh/config` is missing (skill `ssh-schluessel`).
- **Push rejected (`rejected`):** there's a newer entry in the harbour. `git pull --rebase`, then `git push`.
- **Conflict during the rebase:** two entries changed the same line. In the file, between `<<<<<<<` and `>>>>>>>`, decide together what stays, then `git add <datei>`, `git rebase --continue`, `git push`.
- **Someone else's open changes in `git status`:** don't touch them, don't take them along. Only add your own files.
- **A secret ended up in the logbook:** deleting it isn't enough, it stays in the old entries. Straight to the skill `sicherheit`: create the secret anew at the provider.
- **Back to an earlier version of a file:** `git log --oneline <datei>` shows the entries, `git restore --source <eintrag> <datei>` brings it back. Then make a new entry.

## Final message

Your last message in this step starts with one sentence on the picture “the logbook on board, with a copy in the harbour” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
