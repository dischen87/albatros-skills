---
titel: Don't leave the key under the doormat
bild: Key ring, windows and locks in your own house
---

## What it's about

A house is only as safe as its most careless moment: a key under the doormat, an open window, an old lock. In your project these things are called secrets (passwords, access keys), open doors and missing updates. You tidy them up before someone else finds them.

## What you'll learn

- why secrets never belong in the logbook, not even for a moment
- where they go instead: in a `.env` on the server that never goes into the logbook. On a page with Light there should be none at all, because everything on it is public.
- which doors need to be open and which don't
- how updates keep your locks fresh

## How you go about it

1. Check with your AI whether a secret has already ended up in the logbook.
2. Put `.env` on the list of things Git ignores.
3. Move secrets to the right place. Anything that was already public gets replaced.
4. With Pilot: do the security tour on the server.

## Done when

- the file `.gitignore` in your project contains `.env`.
