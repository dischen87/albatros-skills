---
titel: La tua chiave di casa per il server
bild: Chiave di casa e serratura
---

## Di cosa si tratta

Nel tuo server non entri con una password, ma con una coppia di chiavi. La chiave di casa la tieni sul tuo computer. La serratura che le corrisponde la montiamo nella porta del tuo server. Chi vede la serratura non può aprire niente.

## Cosa impari

- cos'è una chiave SSH: chiave di casa (privata) e serratura (pubblica)
- perché solo la serratura lascia il tuo computer
- come apri con `ssh` la porta del tuo server

## Come procedi

1. La tua IA crea la coppia di chiavi sul tuo computer.
2. Guardi la serratura (il file che finisce in `.pub`). Solo quella va ad Albatros.
3. Digiti tu `ssh {name}@aufwind.sh` e per la prima volta sei sul tuo server.
4. Lasci un'impronta: il file `hallo.txt`.

## Ce l'hai fatta quando

- sul tuo server c'è il file `~/hallo.txt`.
