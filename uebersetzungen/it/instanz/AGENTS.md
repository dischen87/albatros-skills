# Indicazioni per gli agenti IA su questo server

Questo server appartiene a una persona che impara con Albatros. Di solito non ha una formazione tecnica. Qui impara le chiavi SSH, Git e il CI/CD mentre costruisce una pagina web o un'attività.

## Come parlarle

- In italiano, dandole del tu, senza gergo tecnico, virgolette «». Spiega un termine con un'immagine la prima volta che compare.
- Le parole di Albatros: diario di bordo (repository git), porto (Forgejo su code.__DOMAIN__), nastro trasportatore (pipeline), ritorno a ieri (snapshot).
- Piccoli passi: di' prima cosa fai e perché. Chiedi prima di fare qualcosa che non si annulla facilmente.
- Il manuale di bordo `~/BORDBUCH.md` è scritto per la persona. Rimanda a quello invece di rispiegare tutto.

## Il server

- Ubuntu 24.04 in un container Incus. Utente `pilot` con `sudo` senza password. Docker (con Compose) e git sono installati.
- Nome: `__NAME__`. Pagina pubblica: https://__NAME__.__DOMAIN__. Lì appare ciò che qui risponde alla porta 80; l'HTTPS lo fa il server edge di Albatros. I domini propri li collega Albatros (abbonamento Pilot).
- Sulla porta 80 gira prima la pagina di benvenuto (servizio systemd `willkommen`). Prima che un proprio server web prenda la porta 80: `sudo systemctl disable --now willkommen` (va anche nel workflow di deploy, non fa danni se è già spenta).
- Progetto: `~/projekt`, clone del repository al porto di Albatros (Forgejo, https://code.__DOMAIN__): `git@__DOMAIN__:__NAME__/projekt.git`. La persona fa push con la sua chiave, il server con la sua `~/.ssh/code` (registrata in `~/.ssh/config`). Un push su `main` avvia il nastro trasportatore: un runner Forgejo su questo server (servizio `fliessband`) esegue `.github/workflows/deploy.yml`. GitHub non serve.
- Il container del server web si chiama `webseite`, un container CMS `cms`. Le missioni controllano questi nomi.
- Accesso: `ssh __NAME__@__DOMAIN__` passa tramite sshpiper all'utente `pilot`. La riga `albatros-zugang` in `~/.ssh/authorized_keys` deve restare. Le nuove chiavi le registra Albatros (strumento MCP `schluessel_hinterlegen`).
- Limiti: RAM, CPU, spazio, processi e banda sono limitati. In uscita sono bloccati le porte e-mail 25, 465 e 587, gli altri server di Albatros e l'host. Dall'esterno entrano solo SSH (22) e il server edge di Albatros; il server edge fa l'HTTPS e parla con la porta 80 del server. L'indirizzo dei visitatori si trova in `X-Forwarded-For` (il server edge riscrive l'intestazione); `X-Real-IP` chiunque può falsificarlo.
- Snapshot: ogni notte, per 7 giorni. Prima di una ristrutturazione più grande conviene uno snapshot a parte (strumento MCP `snapshot`). «Ritorno» cancella tutto ciò che è venuto dopo lo snapshot.

## Regole

- Niente segreti (password, chiavi API) in git o in file pubblici. Mettili in un `.env` con `chmod 600` e aggiungi `.env` a `.gitignore`.
- Database e interfacce di amministrazione solo in locale, per esempio `-p 127.0.0.1:5432:5432`, mai su tutti gli indirizzi.
- Avviare i container con `--restart unless-stopped`, così ripartono dopo un riavvio.
- Non copiare mai la chiave SSH privata della persona su questo server e non mostrarla mai.
- Niente mining, niente e-mail di massa, niente scansioni di altri computer. Un guardiano rallenta i server con carico continuo o con troppe connessioni sospette e li segnala.
