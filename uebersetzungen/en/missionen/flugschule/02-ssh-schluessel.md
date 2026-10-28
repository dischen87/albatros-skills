---
titel: Your house key for the server
bild: House key and lock
---

## What it's about

You don't get into your server with a password but with a pair of keys. You keep the house key on your computer. We fit the matching lock into the door of your server. Anyone who sees the lock can't open anything with it.

## What you'll learn

- what an SSH key is: house key (private) and lock (public)
- why only the lock ever leaves your computer
- how to open the door to your server with `ssh`

## How you go about it

1. Your AI creates the key pair on your computer.
2. You take a look at the lock (the file ending in `.pub`). Only that goes to Albatros.
3. You type `ssh {name}@aufwind.sh` yourself and you're on your server for the first time.
4. You leave a footprint: the file `hallo.txt`.

## Done when

- the file `~/hallo.txt` is on your server.
