---
name: zurueck-auf-gestern
description: "Explains snapshots using the picture of the daily photo of the whole flat, takes a photo of its own before risky changes and brings the server back with “back to yesterday”. Includes the exercise “break it on purpose and repair it”. Use this skill for “snapshot”, “backup”, “I deleted something”, “my site is broken”, “my server isn't working any more”, “undo”, “roll back”, “back to yesterday”, and before you rebuild anything big on the server."
---

# Back to yesterday: the photo of the whole flat

## The picture

Every night Albatros takes a photo of your whole flat: every room, every file, every running appliance. The last seven photos are kept. If something goes wrong, you say “make the flat the way it is in this photo”, and it is.

The technical term for this is **snapshot**.

Important: anything added after the photo is gone afterwards. That's why the logbook in the harbour is so valuable (skill `git-logbuch`): it holds a copy of your work outside the flat. Bringing back the flat leaves the harbour alone.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

**Photos of the server only come with Pilot.** With Light there's no server, so going back works through the logbook: `git log --oneline` shows the entries, `git revert <eintrag>` (the entry) undoes an entry as a new entry, then `git push`. Shortly afterwards the old page is online again. Never `git push --force`.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, calm, short sentences. If something is broken, reassure first: “This can be fixed.” Only then act.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Before a big rebuild: a photo of your own

Before you do something big on the server (install packages, change configuration, rebuild a database), suggest a photo: tool `snapshot` with a meaningful name, e.g. `vor-cms-installation` (before the CMS installation). It costs no time and saves a lot of trouble.

Your own photos: at most five, and they expire after 30 days. Names starting with `taeglich-` (daily) are reserved for the nightly photos.

## Bringing it back

1. **First look at what's broken.** Sometimes less than a whole photo will do: a stopped container starts with `docker start webseite`, a changed file in the project comes back with `git restore <datei>`.
2. **Show the photos:** `snapshot` with the action “auflisten” (list) (or the cockpit, “Server”, “Snapshots”). Choose the right one with the person: the last one on which everything still worked.
3. **Warn about what gets lost:** “Everything you changed on the server after <time> will be gone afterwards, including all photos newer than this one. Whatever is already in the harbour stays.” If the person has unsaved work on the server, save that first (`git push`, or copy the file to their own computer with `scp {name}@aufwind.sh:~/datei .`).
4. **Only after a clear yes:** `zurueck` with the name of the photo. The server restarts, which takes about a minute.
5. **Check:** open the site in the browser, `docker ps` on the server.

## Exercise: break it on purpose

This exercise is the mission. It takes away the fear of mistakes.

1. Take a photo: `snapshot` with the name `vor-der-uebung` (before the exercise).
2. Open the site in the browser: `https://{name}.aufwind.sh`. It's running.
3. Break it (the person types it themselves):
   ```bash
   ssh {name}@aufwind.sh 'docker rm -f webseite'
   ```
   Reload the site: it's gone. Let them feel for a moment that this is fine.
4. `zurueck` to `vor-der-uebung`.
5. Reload the site: it's back.
6. `mission_pruefen` with `flugschule-06-zurueck-auf-gestern`. The check looks at whether the site answers and the container `webseite` is running.

## What snapshots aren't

- Not a replacement for the logbook in the harbour and on your computer. The photos are kept in the same building as the flat.
- No protection for the person's own computer. There the rule is: push your work regularly.
- Not an archive forever. After seven days a photo is gone. Whatever should stay longer belongs in the logbook.

## Final message

Your last message in this step starts with one sentence on the picture “the photo of the whole flat” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
