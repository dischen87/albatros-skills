---
name: git-logbuch
description: "Spiega Git a una persona senza conoscenze con l'immagine del diario di bordo sulla nave e della copia nel porto (il servizio Git di Albatros, code.aufwind.sh). Prende il repo dal porto, accompagna nelle prime voci (commit) con buone note, le manda al porto (push) e verifica che la copia arrivi sul server Albatros in ~/projekt. Regole: solo su main, solo i propri file aggiunti uno per uno, mai force-push. Usa lo skill con «Git», «GitHub», «porto», «commit», «push», «pull», «repo», «cos'è un repository?», «voglio salvare le mie modifiche», «il push è stato rifiutato», «conflitto», e prima di fare un commit per la persona."
---

# Git: il diario di bordo sulla nave, con una copia nel porto

## L'immagine

Su ogni nave c'è un diario di bordo. Ogni voce dice: chi, quando, cosa e perché. Se qualcosa va storto, si sfoglia indietro e si vede dove è cominciato.

- **Repo:** il diario di bordo del tuo progetto, con tutti i file dentro.
- **Commit:** una voce. Annota un passo piccolo e finito, con una nota di una frase.
- **Porto:** `code.aufwind.sh`, il servizio Git di Albatros. Funziona come GitHub e si chiama Forgejo. Lì c'è una copia del diario di bordo. Se il tuo computer cade in acqua, non si perde niente.
- **Push:** mandare le nuove voci al porto. **Pull:** prendere dal porto le voci più recenti.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu. Le parole commit, push e pull solo dopo l'immagine, e poi sempre insieme a lei.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Nel porto la persona accede dal browser con il suo account Albatros. Un account GitHub le serve solo per il trasloco in una casa propria (skill `landung`).
- Non fai mai un commit di qualcosa che la persona non conosce. Prima di ogni voce mostri cosa ci finisce dentro.

## Le tre regole

1. **Solo su `main`.** Un diario di bordo, una linea. I rami sono per più avanti e per le grandi ristrutturazioni.
2. **Solo i propri file, aggiunti uno per uno:** `git add <file>`. Mai `git add .`, `git add -A` o `git commit -a`. Quelli spazzano nel diario di bordo anche lavori a metà e segreti come `.env`.
3. **Mai `git push --force`.** Se un push viene rifiutato, prima `git pull --rebase`, poi di nuovo `git push`.

## Procedura

### 1. Strumenti

- `git --version` mostra se Git c'è. Sul Mac, alla prima chiamata il computer chiede se deve installare gli strumenti per sviluppatori. Sì.
- La chiave di casa dello skill `ssh-schluessel` apre anche il porto. La voce `Host aufwind.sh` in `~/.ssh/config` vale per tutte e due le porte.
- Una volta sola impostare il nome per il diario di bordo:
  ```bash
  git config --global user.name "Nome Cognome"
  git config --global user.email "tuo-indirizzo@esempio.ch"
  ```

### 2. Prendere il diario di bordo

Albatros ha già creato il tuo diario di bordo nel porto, con dentro il modello. L'indirizzo lo indica `konto_status`:

```bash
git clone git@aufwind.sh:{name}/projekt.git
cd projekt
```

Il diario di bordo è privato: lo vedi solo tu. Poi controlla il `.gitignore`, almeno con queste righe: `.env`, `.env.*`, `!.env.example`, `node_modules/`, `dist/`.

### 3. La prima voce

La persona cambia da sé qualcosa di piccolo, p. es. una riga nel `README.md`. Poi insieme:

```bash
git status                     # Cosa è cambiato?
git add README.md              # Aggiungere esattamente questo file
git diff --cached              # Cosa finisce nel diario di bordo?
git commit -m "README: obiettivo del progetto in una frase"
git pull --rebase && git push  # Mandare al porto
```

Le buone note dicono cosa e perché, in meno di 60 caratteri: «Contatto: aggiunto numero di telefono». Male: «update», «fix», «varie».

Ancora una seconda voce, così si fissa. Poi mostra nel browser: `https://code.aufwind.sh/{name}/projekt`. Tutte e due le voci sono nel porto.

### 4. Il diario di bordo sul server

**Con Light** non c'è un server: il push è già la consegna. Albatros mostra la cartella `seite/` da `main` su `https://{name}.aufwind.sh`, dopo circa 30 secondi. Se manca `seite/`, Albatros prende `public/` e altrimenti tutto il repo, per questo la pagina resta in `seite/`. Al massimo 100 MB, i collegamenti (symlink) Albatros non li mostra mai. Ricarica la pagina nel browser, la modifica c'è. Avanti con il passo 5.

**Con Pilot:** Il tuo server ha una copia sua in `~/projekt`. Albatros l'ha creata durante la configurazione, con una chiave di sola lettura solo per il tuo porto. Se il diario di bordo porta con sé il nastro trasportatore (`.github/workflows/deploy.yml`), a ogni push prende da solo le nuove voci (skill `pipeline`). Verificare:

```bash
ssh {name}@aufwind.sh 'git -C ~/projekt log --oneline -3'
```

Se mancano le nuove voci, le prendi a mano: `ssh {name}@aufwind.sh 'git -C ~/projekt pull --ff-only'`. Se manca del tutto la cartella: `ssh {name}@aufwind.sh 'git clone git@aufwind.sh:{name}/projekt.git ~/projekt'`.

### 5. Verifica la missione

`mission_pruefen` con `flugschule-04-git-logbuch`. La verifica guarda se il diario di bordo ha almeno due voci su `main`: con Pilot in `~/projekt` sul server, con Light nel porto.

## Se qualcosa si inceppa

- **`Permission denied (publickey)` al porto:** La serratura non è depositata, oppure manca la voce in `~/.ssh/config` (skill `ssh-schluessel`).
- **Push rifiutato (`rejected`):** Nel porto c'è una voce più recente. `git pull --rebase`, poi `git push`.
- **Conflitto durante il rebase:** Due voci hanno cambiato la stessa riga. Nel file, tra `<<<<<<<` e `>>>>>>>`, decidete insieme cosa resta, poi `git add <file>`, `git rebase --continue`, `git push`.
- **Modifiche aperte di altri in `git status`:** non toccarle, non portarle con te. Aggiungi solo i tuoi file.
- **Un segreto è finito nel diario di bordo:** Cancellarlo non basta, resta nelle voci vecchie. Subito skill `sicherheit`: generare di nuovo il segreto presso il fornitore.
- **Tornare a uno stato precedente di un file:** `git log --oneline <file>` mostra le voci, `git restore --source <voce> <file>` lo riporta indietro. Poi una nuova voce.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «il diario di bordo sulla nave, con una copia nel porto», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
