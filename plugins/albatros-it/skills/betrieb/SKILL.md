---
name: betrieb
description: "Prepara con una persona senza conoscenze tecniche la gestione del suo sito, prima che arrivino gli ospiti (P12): come la contattano i visitatori e chi legge i messaggi e quanto spesso, chi lo viene a sapere quando il sito non risponde (una sorveglianza semplice e gratuita), come si torna a ieri (foto del server con Pilot, il diario di bordo con Light, una copia di sicurezza propria se te ne occupi tu), se serve un ingresso con accesso (solo con un server proprio, skill bausteine) e se si conta chi arriva (skill statistik, con consenso dove serve). Il risultato è docs/betrieb.md. Usa lo skill dopo il domicilio (lancieren) e con «gestione», «sorveglianza», «copia di sicurezza», «backup», «messaggi dei visitatori», «chi legge il modulo», «e se il sito non funziona più?»."
metadata:
  stand: 0.2.0
  quelle: 'b68eee2fb444'
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

## Trappole

- Un modulo i cui messaggi nessuno legge.
- Mettere il guardiano sullo stesso server che deve sorvegliare.
- «Albatros se ne accorgerà»: Albatros vede la piattaforma, non ogni singolo sito.
- Una copia di sicurezza mai ripristinata: conta solo dopo la prova.
- Costruire un ingresso perché suona professionale: solo con i criteri soddisfatti e con un server proprio.
- Statistiche con cookie senza consenso, dove serve.

## Verificare la missione

`mission_pruefen` con `flugschule-17-betrieb`: la verifica guarda sull'isola se il progetto è al passo «Betrieb» (gestione). Da Albatros fa parte di questa fase anche `flugschule-07-sicherheit`, con Pilot `flugschule-06-zurueck-auf-gestern` e, facoltativa, `webseite-05-cms`.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «prima che arrivino gli ospiti», che ridice il nocciolo. Poi: che cosa è chiarito (le cinque righe di `docs/betrieb.md`), che cosa la persona prepara ancora da sé (per esempio il conto presso il servizio di controllo), e che dopo viene la messa online.
