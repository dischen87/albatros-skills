---
name: betrieb
description: "Prepara con una persona senza conoscenze tecniche la gestione del suo sito, prima che arrivino gli ospiti (P12): come la contattano i visitatori e chi legge i messaggi e quanto spesso, chi lo viene a sapere quando il sito non risponde (una sorveglianza semplice e gratuita), come si torna a ieri (foto del server con Pilot, il diario di bordo con Light, una copia di sicurezza propria se te ne occupi tu), se serve un ingresso con accesso (solo con un server proprio, skill bausteine) e se si conta chi arriva (skill statistik, con consenso dove serve). Il risultato è docs/betrieb.md. Con Pilot, su richiesta, lo spazio di lavoro di Bert online (giorno e notte, solo membri del progetto). Usa lo skill dopo il domicilio (lancieren) e con «gestione», «sorveglianza», «copia di sicurezza», «backup», «messaggi dei visitatori», «chi legge il modulo», «e se il sito non funziona più?», «spazio di lavoro online», «pilota automatico di notte»."
metadata:
  stand: 0.3.0
  quelle: '6b2bb7374057'
---

# Gestione: prima che arrivino gli ospiti

## L'immagine

Prima che arrivino i primi ospiti, la bucalettere è appesa, e qualcuno la svuota. Il rilevatore di fumo suona quando brucia, ed è chiaro chi lo sente. C'è un piano per far tornare la casa com'era ieri quando qualcosa si rompe. Se ci sono stanze solo per chi ci abita, all'ingresso c'è un portinaio. E alla porta del negozio magari c'è una lista di tacche. Per il sito vuol dire: messaggi dei visitatori, sorveglianza, copia di sicurezza, ingresso e statistiche.

**Come usare l'immagine:** una frase sull'immagine nella tua prima risposta. Per ogni punto, una frase con la sua parte dell'immagine.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco. Tu passi tutto alla persona in italiano e le parli sempre in italiano.
- Gli inizi di riga in `docs/betrieb.md` (`Rückmeldungen:`, `Überwachung:`, `Sicherung:`, `Eingang:`, `Statistik:`) restano in tedesco, come i segni `[Annahme: …]` e `[offen: …]`: `lage` li cerca così. Quello che segue i due punti lo scrivi in italiano. Unica eccezione: dopo `Eingang:` viene sempre prima `ja` o `nicht nötig` in tedesco (lancieren e bausteine li cercano così), poi il motivo in italiano.
- Dai del tu, calmo, concreto. Ogni risposta diventa una riga in `docs/betrieb.md`.
- Messaggi dei visitatori, ingresso e statistiche li decide la persona, anche nel modo `machen`. La sorveglianza la proponi tu e la scrivi come `[Annahme: …]` (ipotesi). La copia di sicurezza la chiarisci tu e la mostri. Al massimo due domande per messaggio.
- Prezzi e condizioni di servizi esterni li dai solo dalla loro pagina dei prezzi. I conti presso servizi esterni li apre la persona stessa.
- Che cosa vale dipende dal domicilio (`docs/lancieren.md`, riga `Wohnort:`): Albatros Light, Albatros Pilot o da te.
- Niente di tutto questo mette il sito online. Questo viene dopo, alla messa online (skill `lancieren`, parte 2).

## Svolgimento

### 1. Dove abita il sito?

Leggi `docs/lancieren.md`. Se manca il file o la riga `Wohnort:`, viene prima il domicilio (skill `lancieren`, parte 1).

### 2. Messaggi dei visitatori: la bucalettere

Chiedi: «Come ti contattano i visitatori, e chi legge i messaggi e quanto spesso?» Perché: un messaggio che nessuno legge è peggio di nessun messaggio.

- La strada di solito sta già nel PRD (`docs/prd.md`): un link per scrivere un'e-mail, un modulo, un numero di telefono o un blocco come la lista di iscrizione. Chiarisci a quale indirizzo arriva, chi legge lì, quanto spesso, e chi lo fa durante le vacanze.
- Dopo la messa online la persona manda lei stessa un messaggio di prova tramite il sito in rete e guarda se arriva (skill `lancieren`, parte 2).

Esempio: `Rückmeldungen: modulo su /kontakt verso anna@example.ch, legge Anna il lunedì e il giovedì, durante le vacanze Beat`

### 3. Sorveglianza: il rilevatore di fumo

Chiedi: «Chi lo viene a sapere quando il sito non risponde?» Perché: meglio che te ne accorga tu che i tuoi clienti.

- **Che cosa fa Albatros:** Albatros sorveglia la propria piattaforma e lì ripara i guasti. Un messaggio alla persona quando il suo sito non risponde, Albatros non lo manda. Se te ne occupi tu, c'è solo quello che offre il fornitore.
- **La soluzione semplice, gratuita:** un servizio di controllo in rete che ogni pochi minuti chiama l'indirizzo di `docs/lancieren.md` e manda un'e-mail quando non risponde, per esempio UptimeRobot o Better Stack (condizioni sulla pagina dei prezzi). La persona apre il conto da sé; tu le dici che cosa inserire e dove: l'indirizzo, e come destinatario la persona che legge anche i messaggi dei visitatori. Può prepararlo adesso (l'indirizzo risponde già con il modello) o subito dopo la messa online.
- **Con un server proprio** va bene anche un guardiano come Uptime Kuma, ma mai sullo stesso server: se cade, tace anche il guardiano.
- Se la persona non vuole una sorveglianza, nella riga c'è scritto così, con il suo motivo.

Esempio: `Überwachung: [Annahme: UptimeRobot (gratis) controlla https://anna.aufwind.sh ogni 5 minuti, e-mail ad anna@example.ch]`. Dopo il suo sì togli `[Annahme: …]`.

### 4. Copia di sicurezza: ritorno a ieri

Lo chiarisci tu e lo mostri alla persona: «Come torni a ieri?»

- **Albatros Light:** il diario di bordo è la copia di sicurezza. Ogni stato sta nel porto e sul computer. Si torna indietro con `git revert` e un push (skill `zurueck-auf-gestern`, paragrafo su Light). Foto di un server non ce ne sono, perché non c'è un server.
- **Albatros Pilot:** ogni notte una foto di tutto il server (sette giorni), più una foto propria prima di ogni grande trasformazione (strumento `snapshot`). Si torna indietro con `zurueck` (skill `zurueck-auf-gestern`). Il diario di bordo nel porto resta la copia fuori dall'appartamento.
- **Da te, senza server:** il diario di bordo sul computer ha bisogno di una seconda copia fuori dal computer, per esempio un repository privato su GitHub. I fornitori per siti statici di solito tengono le consegne precedenti, che si possono riattivare: mostra alla persona dove si fa nell'interfaccia del suo fornitore.
- **Da te, con server:** una copia di sicurezza propria, di notte, fuori casa, cifrata, con una prova ogni mese (skill `landung`, lista del trasloco «Was ich selbst übernehme», quello che faccio io). Una copia di sicurezza conta solo quando il ripristino ha funzionato almeno una volta.

**Momento di apprendimento «ritorno a ieri»:** nel modo `lernen` la persona lo prova una volta di persona. Con Light o da te: registrare un piccolo cambiamento e annullarlo con `git revert HEAD`. Con Pilot: l'esercizio dello skill `zurueck-auf-gestern` (missione `flugschule-06-zurueck-auf-gestern`), sul modello che è online in questo momento. Poi `verstanden_melden` (missione `flugschule-17-betrieb`, tipo `selbst`). Nel modo `machen` lo offri.

Esempio: `Sicherung: diario di bordo nel porto e su questo computer, ritorno con git revert (provato il 31.10.2026)`

### 5. Ingresso: il portinaio

Chiedi: «Ci sono più parti che devono sapere chi ha fatto l'accesso?» Perché: allora un ingresso controlla in un solo punto chi può fare che cosa.

- **Nessun accesso sul sito** (la tabella «Accesso» in `docs/prd.md` ha solo «tutti i visitatori»): `Eingang: nicht nötig (nessun accesso)`.
- **Con accesso:** un ingresso arriva solo se i criteri dello skill `bausteine`, parte «Ein Eingang für alles?» (un ingresso per tutto?), sono soddisfatti, e solo con un server proprio (Pilot, o da te con server). Altrimenti basta l'accesso del blocco stesso. In ogni caso le porte di `docs/tueren.txt` restano chiuse senza accesso (`node scripts/pruefen.mjs --tueren`).

La riga comincia sempre con `ja` o `nicht nötig`, poi viene il motivo: `lancieren` e `bausteine` montano l'ingresso solo con `Eingang: ja`.

Esempi: `Eingang: ja, /intern/ e i messaggi di PocketBase chiedono lo stesso accesso (criteri dello skill bausteine soddisfatti)` o `Eingang: nicht nötig, solo la lista di iscrizione con il suo accesso (criteri dello skill bausteine non soddisfatti)`

### 6. Statistiche: la lista di tacche

Chiedi: «Vuoi contare chi arriva?» Perché: senza numeri la misura del successo di `docs/projekt.md` (riga `Erfolg:`) resta una supposizione.

- Come si fa sta nello skill `statistik`: prima un piccolo piano di che cosa si conta, poi l'integrazione senza cookie. Così in Svizzera non serve un banner. Se il sito conta con i cookie o si rivolge a persone nell'UE, serve prima il consenso dei visitatori (skill `recht-ch`, «Cookies und Statistik»), e la dichiarazione sulla protezione dei dati menziona le statistiche.
- Si integrano alla messa online o subito dopo (missione `webseite-08-statistik`, facoltativa).

Esempio: `Statistik: sì, senza cookie, obiettivo «richiesta inviata», integrazione dopo la messa online (skill statistik)` oppure `Statistik: no, le richieste nella casella di posta bastano`

### 7. `docs/betrieb.md`

```markdown
# Gestione

Rückmeldungen: …
Überwachung: …
Sicherung: …
Eingang: …
Statistik: …
Stand: <data>
```

Quando ogni riga ha una risposta, fai la voce nel diario di bordo (`git add docs/betrieb.md && git commit -m "Gestione: bucalettere, rilevatore di fumo, copia di sicurezza"`) e segnali `schritt_melden` con `betrieb` e `sprache`. Se lo strumento manca o non conosce il passo, si va avanti senza isola. Nel modo `lernen` fai adesso le domande di controllo della lezione `flugschule-17-betrieb`, al massimo due per messaggio (contando anche le altre domande): prima «Perché un messaggio che nessuno legge è peggio di nessun messaggio?» e «Come torni a ieri?», dopo la risposta della persona «Chi deve accorgersi per primo che il tuo sito non risponde?» Segnali `verstanden_melden` (tipo `kontrollfrage`) solo dopo le sue risposte.

Poi viene la messa online: skill `lancieren`, parte 2.

## Spazio di lavoro sul mio server (Arbeitsplatz online, facoltativo, solo con Pilot)

Lo spazio di lavoro sul computer dorme quando il computer è chiuso. Con Pilot un secondo spazio di lavoro può abitare sul server della persona, come un ufficio che resta aperto di notte: lì l'IA lavora secondo l'orario e appena arriva una mail o una vendita. Entrano solo i membri del progetto, con l'accesso di Albatros. Lo proponi solo se la persona lo chiede («spazio di lavoro sul mio server», «spazio di lavoro online») o se `docs/betrieb.md` è finito; non è un passo della tabella di marcia.

**Cosa funziona online (stato al 10.11.2026), lo dici per prima cosa:**
- Online lavora solo Claude Code, con l'abbonamento Claude della titolare. Lì l'IA lavora in una gabbia, come un'officina con una sola porta verso il progetto: modifica file solo nel progetto e salva versioni (`git commit`). Non raggiunge lo spazio di lavoro stesso, né le chiavi della persona, né nulla fuori dal progetto, e non può pubblicare. Al livello più alto del progetto non crea nulla di nuovo; per questo c'è l'IA sul computer.
- Se il server non può rinchiudere l'IA (sistema più vecchio), lì legge soltanto. Che cosa vale lo mostra lo spazio di lavoro nelle impostazioni, sotto «La tua IA sul server».
- Solo la titolare può avviare l'IA: lavora con il suo abbonamento Claude, e secondo le condizioni di Anthropic nessun altro può usarlo. I membri vedono tutto; chi ha «sola lettura» legge soltanto.
- Online non installi né Codex né Gemini CLI. Per OpenAI non è chiaro se un programma come lo spazio di lavoro possa avviare Codex con un abbonamento ChatGPT su un server; l'accesso con Google per Gemini CLI non esiste più dal 18.06.2026. Se la persona lo chiede, dille esattamente questo.

**L'abbonamento Claude lo permette?** Chiedi prima: «Il tuo progetto è commerciale, vendi qualcosa o fai pubblicità per un'azienda?» Perché: da questo dipende quale abbonamento serve.
- Anthropic stessa descrive la via senza browser: `claude setup-token` per script e macchine senza browser. L'account appartiene a una persona e non si condivide mai.
- In Svizzera e nel SEE, Pro e Max valgono solo per scopi non commerciali (condizioni di Anthropic per i consumatori, sezione 11). Per un progetto commerciale servono Claude Team o Enterprise; lì `claude setup-token` funziona pure. Se il progetto è commerciale e la persona ha solo Pro o Max, ti fermi qui, dici perché, e lei continua con lo spazio di lavoro sul computer.
- Rileggi le condizioni con lei prima che decida: https://code.claude.com/docs/en/legal-and-compliance e https://www.anthropic.com/legal/consumer-terms

**Preparazione: sette passi, tre li fa la persona.** Il token lo digita lei; tu non lo vedi mai, e non passa mai da Albatros.

1. **Annunciarsi ad Albatros (tu).** Chiama `arbeitsplatz_online` con `an: true`. La risposta indica `ALBATROS_PROJEKT` e l'indirizzo `https://{name}.aufwind.sh/arbeitsplatz`. Se lo strumento non esiste o dice «solo con Pilot», ti fermi qui: lo spazio di lavoro online non è ancora attivo presso Albatros, oppure manca il server.
2. **Scegliere l'indirizzo (tu, con la persona).** Lo spazio di lavoro deve avere un indirizzo proprio, non una stanza nella casa del sito: su `{name}.aufwind.sh/arbeitsplatz` uno script del sito potrebbe comandare lo spazio di lavoro mentre la persona ha effettuato l'accesso.
   - **Con un dominio proprio** (skill `domain`): annuncia `arbeitsplatz.<dominio>` con `domain_verbinden` e guida la persona tra le voci presso il fornitore del dominio, esattamente come nello skill `domain`. L'indirizzo dello spazio di lavoro è allora `https://arbeitsplatz.<dominio>`.
   - **Senza dominio proprio:** resta `https://{name}.aufwind.sh/arbeitsplatz`. Di' alla persona la frase qui sopra e che lo spazio di lavoro stesso lo segnala nelle impostazioni. A questo sito non si aggiungono script di terzi finché lo spazio di lavoro abita lì.
3. **Controllare il modello e prendere l'immagine (tu).** `grep -c arbeitsplatz compose.yaml nginx.conf` nel progetto: se manca il servizio `arbeitsplatz` in `compose.yaml` o la sezione in `nginx.conf` (modello più vecchio), prendi entrambi dal modello, fai la voce nel diario di bordo e consegna (skill `webseite-aendern`). Poi:
   ```bash
   ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz pull arbeitsplatz'
   ```
   Se Docker segnala che l'immagine non esiste («manifest unknown», «denied», «not found»), non è ancora pubblicata. Allora la costruisci una volta sul server dal plugin, dalla cartella `arbeitsplatz` accanto agli skill (`<cartella di questo skill>/../../arbeitsplatz`). Se lì manca il file `Dockerfile`, il plugin è troppo vecchio: aggiornalo, altrimenti fermati qui.
   ```bash
   scp -r "<cartella di questo skill>/../../arbeitsplatz" {name}@aufwind.sh:arbeitsplatz-bild
   ssh {name}@aufwind.sh 'docker build -t "$(grep -o "ghcr.io/dischen87/albatros-arbeitsplatz:[0-9.]*" ~/projekt/compose.yaml)" ~/arbeitsplatz-bild && rm -r ~/arbeitsplatz-bild'
   ```
4. **Creare le impostazioni (tu),** senza token, fuori dal progetto (così il file non finisce mai nel diario di bordo, e l'IA nello spazio di lavoro non lo legge):
   ```bash
   ssh {name}@aufwind.sh 'umask 077 && printf "%s\n" "ARBEITSPLATZ_ADRESSE=<indirizzo del passo 2>" "ALBATROS_PROJEKT=<progetto>" "ARBEITSPLATZ_KI=claude" > ~/arbeitsplatz.env'
   ```
   Con un dominio proprio si aggiunge una riga, perché le nuove mail e le vendite continuino ad arrivare: `ARBEITSPLATZ_EREIGNIS_ADRESSE=https://{name}.aufwind.sh/arbeitsplatz` (l'indirizzo del passo 1).
5. **Creare il token (la persona, sul suo computer).** Nel terminale: `claude setup-token`. Conferma nel browser, il terminale mostra il token (vale un anno). Dille: «Copialo, ma non mandarlo mai nella chat, nemmeno a me.»
6. **Inserire il token sul server (la persona, nel suo terminale, non tu).** Copia questa sola riga, incolla il token alla domanda (incollando non si vede) e preme Invio:
   ```bash
   ssh -t {name}@aufwind.sh 'printf "Incolla il token, poi Invio (resta nascosto): "; stty -echo; IFS= read -r t; stty echo; echo; touch ~/arbeitsplatz.env; chmod 600 ~/arbeitsplatz.env; sed -i "/^CLAUDE_CODE_OAUTH_TOKEN=/d" ~/arbeitsplatz.env; printf "CLAUDE_CODE_OAUTH_TOKEN=%s\n" "$t" >> ~/arbeitsplatz.env; echo Salvato.'
   ```
   Non eseguire mai tu questo comando, e dopo non leggere mai `~/arbeitsplatz.env` con `cat`: il token è un accesso al suo abbonamento.
7. **Avviare (tu), poi accedere (la persona).** `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz up -d --wait'`. Al primo avvio lo spazio di lavoro scarica Claude Code da Anthropic (una volta, qualche minuto). La persona apre l'indirizzo nel browser e clicca «Accedi con Albatros». Nelle impostazioni, sotto «La tua IA sul server», dopo circa un minuto si legge «Claude collegato» e «Può modificare file»; lì sceglie Claude Code e gli orari del pilota automatico, e sotto Compiti per esempio «Quando arriva una mail: proporre una risposta».

**Verificare:** la pagina si carica, l'accesso funziona, si legge «Claude collegato», e un membro con «sola lettura» vede tutto ma non può avviare nulla. Se si legge «Claude non collegato», lo spazio di lavoro mostra di nuovo i passi da 5 a 7; dopo un nuovo token lo riavvii: `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz up -d --force-recreate arbeitsplatz'`.

**Spegnere:** `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz stop arbeitsplatz'` e `arbeitsplatz_online` con `an: false`. Poi la persona cancella la riga del token: `ssh {name}@aufwind.sh 'sed -i "/^CLAUDE_CODE_OAUTH_TOKEN=/d" ~/arbeitsplatz.env'`.

In `docs/betrieb.md` si aggiunge la riga `Arbeitsplatz online: nein` oppure `Arbeitsplatz online: ja, seit <data>, <indirizzo>, Claude Code con l'abbonamento della titolare`.

## Trappole

- Un modulo i cui messaggi nessuno legge.
- Mettere il guardiano sullo stesso server che deve sorvegliare.
- «Albatros se ne accorgerà»: Albatros vede la piattaforma, non ogni singolo sito.
- Una copia di sicurezza mai ripristinata: conta solo dopo la prova.
- Costruire un ingresso perché suona professionale: solo con i criteri soddisfatti e con un server proprio.
- Statistiche con cookie senza consenso, dove serve.
- Scrivere il token dell'IA nella chat, nel diario di bordo o in un file del progetto: va solo in `~/arbeitsplatz.env` sul server, digitato dalla persona.
- Lasciare lo spazio di lavoro online all'indirizzo del sito anche se c'è un dominio proprio: con `arbeitsplatz.<dominio>` ha la sua porta.
- Far girare lo spazio di lavoro online con un abbonamento che non è pensato per questo (Pro o Max per un'attività, l'account di un'altra persona).

## Verificare la missione

`mission_pruefen` con `flugschule-17-betrieb`: la verifica guarda sull'isola se il progetto è al passo «Betrieb» (gestione). Da Albatros fa parte di questa fase anche `flugschule-07-sicherheit`, con Pilot `flugschule-06-zurueck-auf-gestern` e, facoltativa, `webseite-05-cms`.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «prima che arrivino gli ospiti», che ridice il nocciolo. Poi: che cosa è chiarito (le cinque righe di `docs/betrieb.md`), che cosa la persona prepara ancora da sé (per esempio il conto presso il servizio di controllo), e che dopo viene la messa online.
