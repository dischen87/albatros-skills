---
titel: La chiave non sotto lo zerbino
bild: Mazzo di chiavi, finestre e serrature nella tua casa
---

## Di cosa si tratta

Una casa è sicura quanto il suo momento più distratto: una chiave sotto lo zerbino, una finestra aperta, una serratura vecchia. Nel tuo progetto queste cose si chiamano segreti (password, chiavi di accesso), porte aperte e aggiornamenti mancanti. Le metti in ordine prima che qualcun altro le trovi.

## Cosa impari

- perché i segreti non vanno mai nel diario di bordo, nemmeno per un momento
- dove stanno invece: in un file `.env` sul server, che non entra mai nel diario di bordo. Su una pagina con Light non ne va nessuno, perché tutto quello che c'è sopra è pubblico.
- quali porte devono essere aperte e quali no
- come gli aggiornamenti tengono fresche le tue serrature

## Come procedi

1. Con la tua IA verifichi se un segreto è già finito nel diario di bordo.
2. Metti `.env` nella lista delle cose che Git ignora.
3. Sposti i segreti nel posto giusto. Quello che era già pubblico lo sostituisci.
4. Con Pilot: fai il giro di sicurezza sul server.

## Ce l'hai fatta quando

- il file `.gitignore` nel tuo progetto contiene `.env`.
