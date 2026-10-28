---
name: zurueck-auf-gestern
description: "Spiega gli snapshot con l'immagine della foto quotidiana di tutto l'appartamento, prima di modifiche rischiose scatta una foto propria e con il «ritorno a ieri» rimette in piedi il server. Contiene l'esercizio «rompere apposta e riparare». Usa lo skill con «snapshot», «backup», «ho cancellato qualcosa», «il sito è rotto», «la pagina non va più», «il server non funziona più», «annullare», «tornare indietro», «ritorno a ieri», e prima di fare un grosso cambiamento sul server."
---

# Ritorno a ieri: la foto di tutto l'appartamento

## L'immagine

Ogni notte Albatros scatta una foto di tutto il tuo appartamento: ogni stanza, ogni file, ogni apparecchio acceso. Le ultime sette foto restano. Se qualcosa va storto, dici «rimetti l'appartamento com'era in questa foto», ed eccolo com'era.

Il termine tecnico è **snapshot** (istantanea).

Importante: tutto quello che si è aggiunto dopo la foto, dopo non c'è più. Per questo il diario di bordo nel porto è così prezioso (skill `git-logbuch`): lì c'è una copia del tuo lavoro fuori dall'appartamento. Il ritorno dell'appartamento lascia in pace il porto.

**Come usi l'immagine:** dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

**Le foto del server ci sono solo con Pilot.** Con Light non c'è nessun server, si torna indietro con il diario di bordo: `git log --oneline` mostra le voci, `git revert <voce>` annulla una voce con una voce nuova, poi `git push`. Poco dopo la vecchia pagina è di nuovo online. Mai `git push --force`.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu, con calma, frasi brevi. Se qualcosa è rotto, prima rassicura: «Si può riparare.» Solo dopo agisci.

## Prima di un grosso cambiamento: una foto propria

Prima di fare qualcosa di grosso sul server (installare pacchetti, cambiare la configurazione, rifare la banca dati), proponi una foto: strumento `snapshot` con un nome che dica qualcosa, p. es. `vor-cms-installation`. Non costano tempo e risparmiano un sacco di guai.

Foto proprie: al massimo cinque, scadono dopo 30 giorni. I nomi che iniziano con `taeglich-` sono riservati alle foto notturne.

## Tornare indietro

1. **Prima guarda cosa è rotto.** A volte basta meno di una foto intera: un container fermo riparte con `docker start webseite`, un file cambiato nel progetto torna con `git restore <file>`.
2. **Mostrare le foto:** `snapshot` con l'azione «auflisten» (elencare), oppure nel cockpit alla voce «Server», «Snapshots». Scegli con la persona quella giusta: l'ultima in cui funzionava ancora tutto.
3. **Avvisare cosa va perso:** «Tutto quello che hai cambiato sul server dopo <momento>, dopo non c'è più, e anche tutte le foto più recenti di questa. Quello che è già nel porto resta.» Se la persona ha lavoro non salvato sul server, prima salvalo (`git push` oppure copia il file sul proprio computer con `scp {name}@aufwind.sh:~/datei .`).
4. **Solo dopo un sì chiaro:** `zurueck` con il nome della foto. Il server si riavvia, ci vuole circa un minuto.
5. **Verificare:** apri la pagina nel browser, `docker ps` sul server.

## Esercizio: rompere apposta

Questo esercizio è la missione. Toglie la paura degli errori.

1. Scatta una foto: `snapshot` con il nome `vor-der-uebung`.
2. Apri la pagina nel browser: `https://{name}.aufwind.sh`. Funziona.
3. Rompila (la persona scrive lei stessa):
   ```bash
   ssh {name}@aufwind.sh 'docker rm -f webseite'
   ```
   Ricarica la pagina: non c'è più. Lascia che senta per un attimo che va bene così.
4. `zurueck` su `vor-der-uebung`.
5. Ricarica la pagina: c'è di nuovo.
6. `mission_pruefen` con `flugschule-06-zurueck-auf-gestern`. La verifica controlla se la pagina risponde e se il container `webseite` gira.

## Cosa non sono gli snapshot

- Non sostituiscono il diario di bordo nel porto e sul tuo computer. Le foto stanno nello stesso palazzo dell'appartamento.
- Non proteggono il computer della persona. Lì vale: fare il push del lavoro regolarmente.
- Non sono un archivio per sempre. Dopo sette giorni una foto non c'è più. Quello che deve restare più a lungo va nel diario di bordo.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la foto di tutto l'appartamento», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
