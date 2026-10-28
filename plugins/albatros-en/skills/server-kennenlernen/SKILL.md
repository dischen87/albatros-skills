---
name: server-kennenlernen
description: "A tour of your own Albatros server for someone with no background. Explains the terminal, folders, storage, memory, running programs and the master key sudo with pictures from a flat. The person types their first commands themselves. Use this skill for “what's on my server?”, “how do I get around in the terminal?”, “what's a folder on the server?”, “ls cd pwd”, “how much space have I got?”, “what's running on there?”, and after the first successful SSH visit."
---

# Getting to know your server: a tour of your new flat

## The picture

Your server is a flat in a big building. It has its own door (your SSH lock), its own rooms (folders) and its own appliances (programs). The neighbours can't see in, and you can't see into theirs.

The terminal is the intercom: you say a short sentence, the flat answers.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

**Pilot only.** With Light there's no flat of your own, just a shop window: the page from the logbook. If `konto_status` shows a different plan, explain briefly what a server of your own adds, and only get the link with `upgrade_link` (plan `pilot`) if they want it.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, short sentences, no jargon. Every command gets its picture first.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- The person types the commands on this tour themselves (in Claude Code with `!` in front, otherwise in a terminal window of their own after `ssh {name}@aufwind.sh`). You explain what's coming and then read the answer with them.
- At most one new term per step.

## The tour

Before you start: “You can't break anything for good here. Every night the whole flat gets photographed, and we can go back to yesterday.”

| Step | Command | Picture | What to look out for |
|---|---|---|---|
| Where am I? | `pwd` | The “You are here” sticker on the city map | `/home/pilot` is the hallway of your flat, `~` for short |
| What's in here? | `ls -la` | Switching on the light in the room | Files with a dot in front are hidden, e.g. `.ssh` |
| Look in the on-board book | `cat BORDBUCH.md` | The welcome folder on the table | It says what belongs to the flat |
| Go into a room | `cd projekt` and back with `cd ~` | Walking through a door | If the folder doesn't exist yet: `mkdir projekt` builds a new room |
| How much space? | `df -h /` | The cellar: how full is it? | The “Avail” column is the free space |
| How much desk space? | `free -h` | The surface of the desk: whatever is running right now lies there | “available” is free. If it's almost full, everything slows down |
| What's running right now? | `docker ps` | Which appliances are plugged in | Docker containers are like appliances with a plug: plug them in and out without tearing open the wall |
| Leave again | `exit` | Closing the door behind you | |

## The master key: sudo

Only explain it when a command says “Permission denied” or needs `sudo`. Picture: with `sudo` in front of a command you're using the caretaker's master key. It opens every door, including the one to the boiler room. So only use it when you know exactly what the command does. You (the agent) never use `sudo` without the person's explicit yes, and never with `rm -rf`.

## Wrapping up: the tour note

The person writes down three things they discovered, in their own words:

```bash
nano ~/rundgang.md
```

`nano` is a simple notepad in the terminal: write, then `Ctrl+O` and Enter to save, `Ctrl+X` to leave. Prefer a command? `echo "- ..." >> ~/rundgang.md`.

Then `mission_pruefen` with `flugschule-03-server-kennenlernen`. The check looks at whether `~/rundgang.md` exists.

## When it gets stuck

- **`command not found`**: a typo, or the appliance isn't installed. First compare the command carefully.
- **`No such file or directory`**: you're in the wrong room. `pwd` tells you where you are.
- **The person feels overwhelmed:** stick to `pwd`, `ls`, `cd` and `exit`. The rest can wait until it's needed.
- **Something got deleted:** skill `zurueck-auf-gestern`.

## Final message

Your last message in this step starts with one sentence on the picture “a tour of your new flat” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
