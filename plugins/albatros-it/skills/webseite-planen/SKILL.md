---
name: webseite-planen
description: "Pianifica con una persona senza conoscenze tecniche il suo sito web prima del design e della costruzione, in quattro sezioni del piano di volo: idea (nome del progetto, l'idea in una frase, per chi, cosa principale, docs/projekt.md, AGENTS.md e uno schizzo grigio della pagina iniziale), ricerca (fino a tre siti simili, obblighi, contenuti esistenti, docs/recherche.md), pianta (pagine, funzioni, accesso, lingue, cura, docs/plan.md) e verifica del piano (secondo parere in un contesto nuovo, docs/plan-pruefung.md, sì della persona). Sul percorso attività con i metodi ideen-check, zielgruppe, angebot-und-preis e landingpage. Usa lo skill con «voglio un sito web», «pianificare un sito web», «da dove comincio», «cosa mi serve per un sito web», «quali pagine mi servono», «sitemap», «nome del progetto», «verificare il piano», quando lage nomina webseite-planen, e sempre prima del design o della costruzione sul percorso sito web."
metadata:
  stand: 0.2.0
  quelle: '085eb225aa62'
---

# Pianificare il sito web: la pianta

## L'immagine

Nessuno costruisce una casa senza prima disegnarne la pianta. La pianta mostra quali stanze ci sono, come si passa dall'una all'altra e dov'è la porta d'ingresso. In un sito web le stanze sono le pagine, i corridoi sono i menu e i link, e la porta d'ingresso è la pagina iniziale. Prima di costruire, un'ingegnera statica che non l'ha disegnata guarda la pianta.

Basta una pianta su un foglio di carta. Più tardi risparmia molti lavori di ristrutturazione.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione. Ogni sezione qui sotto ha in più la sua immagine, per una frase.

## Le quattro sezioni

`lage` nomina la sezione che tocca adesso, con il suo nome tedesco (seconda colonna). Senza `lage` cominci dalla prima sezione di cui manca il risultato.

| Sezione | Nome in `lage` | Immagine | Risultato | Isola |
|---|---|---|---|---|
| Idea | Idee | cerchiare la meta sulla carta prima di decollare | `docs/projekt.md`, `AGENTS.md`, `design/skizze.html` | `idee` |
| Ricerca | Research | leggere le guide di viaggio prima di decollare | `docs/recherche.md` | `recherche` |
| Pianta | Grundriss | la pianta della casa | `docs/plan.md` | `plan` |
| Verificare il piano | Plan prüfen | il secondo parere dell'ingegnera statica, prima di costruire | `docs/plan-pruefung.md`, `Bestätigt:` in `docs/plan.md` | `plan-geprueft` |

Le quattro sezioni sono l'inizio della prima tappa, decollare (P1–P4 nel piano di volo). I numeri sono solo per te; alla persona dici la sezione a parole. Tutto resta sul suo computer e da Albatros non costa niente.

Se la persona vuole subito il piano intero, scrivi in una volta i file che mancano come bozza, con `[Annahme: …]` e `[offen: …]`, e poi chiedi solo quello che manca. Il secondo parere e il sì della persona nella sezione «Verificare il piano» non li salti mai.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, frasi brevi, niente gergo tecnico: «pagine» invece di «sitemap», «menu» invece di «navigazione». Una parola tecnica arriva solo quando serve, e prima con la sua immagine.
- **Al massimo due domande per messaggio, al massimo cinque alla persona per sezione.** Quello che la persona ha già raccontato non lo chiedi di nuovo. Riprendi le sue risposte alla lettera: deve riconoscere il suo piano.
- **Ipotesi invece di domande:** quello che puoi proporre da te lo scrivi come `[Annahme: …]` (ipotesi), con mezza frase di motivo. Tutte le ipotesi di una sezione la persona le conferma in un solo messaggio: «Ho scritto queste ipotesi: … È giusto così?» Poi togli il segno. Quello che nessuno sa resta come `[offen: …]` (aperto). Non inventare niente.
- **Non aspettare:** se manca un dato, scrivi comunque il file come bozza, con ipotesi e punti aperti segnati. Chiedi solo alla fine quello che manca.
- **Imparare o fare:** vale la riga `Modus:` in `docs/projekt.md`, di regola fare (`machen`). Come funzionano i due modi lo trovi nello skill `lotse`, sezione «Imparare o fare». I momenti di apprendimento qui sotto li offri nel modo fare; nel modo imparare (`lernen`) la persona li fa da sé.
- **Righe per il piano di volo:** in `docs/projekt.md`, `docs/recherche.md`, `docs/plan.md` e `docs/plan-pruefung.md` ogni riga obbligatoria comincia a inizio riga con il suo nome, senza grassetto (`Projektname: …`). I nomi delle righe e i segni `[Annahme: …]` e `[offen: …]` restano in tedesco, come `Freigegeben:`: è da quelli che `lage` riconosce cosa ha già una risposta. Dopo i due punti scrivi in italiano.
- Se la persona chiede qualcosa che questo skill non copre, o se devi tirare a indovinare: skill `lotse`, sezione «Segnalare le lacune».

## Dopo ogni sezione

1. Aggiornare in `docs/projekt.md` le righe `Stand:` (stato) e `Nächster Schritt:` (prossimo passo).
2. `schritt_melden` con il passo della tabella qui sopra e `sprache: it`. Per il primo progetto della persona lasci fuori `projekt`: più tardi diventa il diario di bordo nel porto. Solo per un altro progetto dai un nome breve di lettere minuscole, cifre e «-». Di' alla persona in una frase che la sua casa è cresciuta sull'isola. Se lo strumento risponde «Ungültige Angaben» (dati non validi) o «unbekannt» (sconosciuto), o se manca, si continua senza isola.
3. Verificare la missione della sezione (qui sotto, «Verificare la missione»), poi richiamare `lage` (skill `lotse`) e seguire quello che tocca adesso.

Se la persona ha un account e la sua isola non è ancora aperta in questa conversazione, la apri una volta: `open https://albatros.build/it/cockpit/insel` (Linux `xdg-open`, Windows `start`). Lì a ogni passo cresce una casa.

## Idea (Idee)

**Immagine:** cerchiare la meta sulla carta prima di decollare. Senza una meta nessuna pilota sa che rotta prendere.

1. **Un nome, già nella prima risposta.** Proponi un nome per il progetto o chiedilo: «Come deve chiamarsi il tuo progetto? Basta un nome provvisorio, può anche essere scelto a caso.» Con un nome potete da adesso fare riferimento a tutto. Per la cartella prendi una forma breve di lettere minuscole e «-» (`mensa-wipkingen`). Se non stai già lavorando in una cartella di progetto, crei una nuova cartella con questo nome e lavori lì dentro.
2. **Le domande sull'idea.** Chiedi solo quello che manca ancora, al massimo due alla volta, in quest'ordine:
   - Di cosa si tratta, in una frase? Come lo racconteresti a una vicina di casa.
   - A chi è destinato? Il più concreto possibile: «genitori del quartiere che cercano una mensa per il pranzo» invece di «tutti».
   - Che cosa devono fare soprattutto i visitatori? Esattamente una cosa principale: telefonare, chiedere, iscriversi, passare, comprare. Tutto sul sito porta lì.
   - Esiste già un sito web? Se sì, l'indirizzo. **Se sì**, segui lo skill `webseite-modernisieren`: comincia con l'inventario del vecchio sito, così non va perso niente.
3. **Due ipotesi.** `Erfolg:` (successo) lo proponi tu: da cosa la persona capirà fra tre mesi che funziona, come numero o come evento che si può vedere (p. es. «dieci richieste al mese»). `Modus:` è `machen` (fare), a meno che la persona abbia già scelto altrimenti. Di' a questo proposito: «Faccio io il lavoro e ti spiego ogni passo in una frase. Se preferisci imparare tu i passi importanti, dimmelo, si può in qualsiasi momento.» Le conferma entrambe in un solo messaggio.
4. **`docs/projekt.md`** nella cartella del progetto. `Projektname` = nome del progetto, `In einem Satz` = in una frase, `Für wen` = per chi, `Hauptsache` = cosa principale, `Erfolg` = successo, `Bestehende Seite` = sito esistente, `Modus` = modo, `Weg` = percorso:

   ```markdown
   # <nome del progetto>

   Projektname: <nome>
   In einem Satz: …
   Für wen: …
   Hauptsache: … (pulsante: «…»)
   Erfolg: [Annahme: …]
   Bestehende Seite: nessuno
   Modus: machen
   Weg: sito web (o attività)
   Stand: <GG.MM.AAAA>, l'idea c'è
   Nächster Schritt: ricerca: guardare siti simili
   ```

5. **`AGENTS.md`** nella cartella del progetto, esattamente con questo testo. Dice a ogni IA, anche in una conversazione nuova, a che punto siete e cosa vale. È lo stesso testo del modello per il diario di bordo nel porto.

   ```markdown
   # Indicazioni per l'IA

   Questo progetto appartiene a una persona che con Albatros costruisce il suo sito web o la sua attività, per lo più senza conoscenze tecniche. Che sia Claude Code, Codex, Gemini CLI o Cursor: per ogni IA vale lo stesso.

   ## Per prima cosa

   Leggi `docs/projekt.md` (stato, prossimo passo), poi chiama `lage` (Albatros). `lage` dice quale skill e quale sezione toccano adesso; seguilo. Se `docs/projekt.md` non esiste ancora, il progetto comincia con lo skill `webseite-planen`, sezione Idee. Senza collegamento ad Albatros aiuta lo skill `lotse`.

   ## Regole

   - Tre momenti del sì, e solo la persona dice sì: piano confermato (`Bestätigt:` in `docs/plan.md`), bozza con via libera per costruire (`Freigegeben zum Bauen:` in `docs/entwurf.md`), sito approvato (`Freigegeben:` in `docs/prd.md`). «Sembra a posto» non è un sì.
   - Niente va in rete senza approvazione: nessuna pubblicazione e nessun push nel porto prima che la persona abbia approvato il suo sito (`Freigegeben:` in `docs/prd.md`). Dopo la messa online ogni modifica ha bisogno del suo sì.
   - I prezzi solo da `konto_status`, mai a memoria.
   - Al massimo due domande per messaggio. Quello che puoi proporre da te è segnato `[Annahme: …]` (ipotesi), quello che è aperto `[offen: …]`. Questi segni e i nomi delle righe in `docs/` restano in tedesco. Non inventare niente.
   - Dopo ogni passo riuscito: aggiornare `Stand:` e `Nächster Schritt:` in `docs/projekt.md`, `schritt_melden`, poi di nuovo `lage`.
   - Password, numeri di carta e chiavi private non vanno mai nella chat né in un file del progetto. I segreti stanno in `.env`, e `.env` sta in `.gitignore`.
   - Dare del tu, linguaggio di tutti i giorni, in italiano. Una parola tecnica arriva solo con la sua immagine.
   ```

   In più due piccoli file, così anche Claude Code e Gemini CLI leggono il testo (Codex e Cursor leggono `AGENTS.md` da soli): `CLAUDE.md` con la riga «Valgono le indicazioni in AGENTS.md.» e sotto `@AGENTS.md`, `GEMINI.md` con la stessa riga e sotto `@./AGENTS.md`.
6. **Lo schizzo grigio, il primo successo visibile.** Scrivi `design/skizze.html`: la pagina iniziale dall'alto in basso, solo in grigio, con le parole vere di `docs/projekt.md`. Ancora niente colori, niente immagini, nessun carattere da scegliere; superfici grigie mostrano dove più tardi arrivano le immagini. Un solo file senza collegamenti verso l'esterno, leggibile sul telefonino:

   ```html
   <!doctype html>
   <html lang="it">
   <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <title>Schizzo: <nome del progetto></title>
   <style>
     body { margin: 0; font: 17px/1.5 system-ui, sans-serif; color: #333; background: #eee; }
     header, section, footer { max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem; }
     .flaeche { background: #ccc; border-radius: 8px; min-height: 12rem; }
     .knopf { display: inline-block; background: #555; color: #fff; padding: .8rem 1.4rem; border-radius: 8px; }
     .notiz { font-size: .85rem; color: #777; }
   </style>
   </head>
   <body>
     <header><strong><nome del progetto></strong> · Inizio · Offerta · Contatto</header>
     <section><h1><in una frase></h1><p><per chi></p><span class="knopf"><cosa principale come pulsante></span></section>
     <section><div class="flaeche"></div><p class="notiz">Qui più tardi arriva un'immagine.</p></section>
     <section><h2>Cosa devono sapere i visitatori</h2><p>…</p></section>
     <footer>Impressum · Protezione dei dati<p class="notiz">Schizzo in grigio: prima l'ordine, colori e immagini arrivano più tardi.</p></footer>
   </body>
   </html>
   ```

   Aprilo nel browser (`open design/skizze.html`; Linux `xdg-open`, Windows `start`) e di' in una frase cosa vede la persona: «Questo è l'ordine della tua pagina iniziale, ancora tutto in grigio. Colori e immagini arrivano più tardi.»
7. **Percorso attività:** adesso il metodo `ideen-check` verifica se l'idea regge. Prendilo con lo strumento `methode` (`name: ideen-check`) e seguilo. Finisce con la riga `Entscheid:` (decisione) in `docs/ideen-check.md`: **weiter** (continuare: poi ricerca con pubblico, offerta e prezzo), **anpassen** (adattare: un nuovo giro di verifica) o **stoppen** (fermarsi: una fine onesta e riuscita). Se lì c'è scritto «Hausaufgabe offen bis …» (compito aperto fino al …), il piano di volo aspetta la persona: annotalo in `docs/projekt.md` sotto `Stand:` e `Nächster Schritt:` e per oggi fermati. Se `methode` risponde che il metodo è solo per i membri, dillo onestamente e non scrivere `docs/ideen-check.md` a memoria.

**Momenti di apprendimento:** perché un progetto ha bisogno di un nome prima che esista qualcosa. Una sola cosa principale invece di cinque.

**Ce l'hai fatta quando** `docs/projekt.md` ha tutte le righe, il nome del progetto non è vuoto, `AGENTS.md` è nel progetto e lo schizzo è stato aperto; sul percorso attività c'è in più `Entscheid: weiter` o `Entscheid: stoppen`. Poi `schritt_melden` con `idee`.

## Ricerca (Research)

**Immagine:** leggere le guide di viaggio prima di decollare: che cosa ci si aspetta, che cosa è meglio evitare, che cosa portare. Le guide di viaggio sono siti simili nella regione e nel settore della persona.

Cominci senza domande. L'unica domanda alla persona è quali testi, quali foto e quale logo ha già. Se conosce lei stessa siti che le piacciono lo chiedi di passaggio; i suoi si aggiungono ai tuoi.

1. **Fino a tre siti simili.** Cercali in rete, nella regione e nel settore della persona. Apri tu ogni indirizzo e verifica che risponda, per esempio così:
   ```bash
   curl -sL -o /dev/null -w '%{http_code}\n' --max-time 15 https://www.esempio.ch/
   ```
   200 vuol dire raggiungibile. Quello che non risponde non entra. Se ne trovi meno di tre, scrivi il motivo. Se non puoi andare in rete, i siti li nomina la persona; altrimenti lì c'è `[offen: …]`. Mai indirizzi inventati.
2. **Quello che hanno tutti** (`Übliche Seiten und Funktionen:`, pagine e funzioni abituali): quali pagine, quale menu, richiesta, prenotazione, prezzi, orari d'apertura. Quello che hanno tutti, i visitatori se lo aspettano anche qui.
3. **Riprendere ed evitare** (`Übernehmen:`, `Vermeiden:`): quello che ha dato buona prova, e quello che il sito della persona fa apposta in modo diverso, entrambi come `[Annahme: …]`. Ispirarsi è permesso, copiare no: testi, immagini e grafica di altri non li riprendi mai.
4. **Obblighi** (`Pflichten:`): impressum, protezione dei dati, diritti sulle immagini, cookie. In Svizzera quasi ogni sito ha bisogno di impressum e dichiarazione sulla protezione dei dati; i dettagli nello skill `recht-ch`. Nessuna consulenza legale.
5. **Contenuti esistenti** (`Inhalte vorhanden:`): «Quali testi, quali foto e quale logo hai già?» Se la persona dice «ce l'abbiamo», chiedilo subito (testo, lista o una foto), soprattutto tutto quello che serve a una funzione, per esempio corsi con orari e posti. Quello che manca va sulla lista per lo skill `inhalte`. I contenuti mancanti sono il motivo più frequente per cui i siti non vengono mai finiti.
6. **Parole di ricerca** (`Suchbegriffe:`): da tre a cinque parole con cui qualcuno cercherebbe la persona, come `[Annahme: …]`. Da qui nascono più tardi titoli e testi che si trovano.
7. **Scrivere `docs/recherche.md`** e spiegarlo alla persona in cinque righe: che cosa hanno in comune i modelli, che cosa riprendete, che cosa fate diversamente, quali obblighi valgono e quali contenuti mancano ancora. Le ipotesi le conferma in un solo messaggio.

   ```markdown
   # Ricerca: <nome del progetto>
   Stand: <GG.MM.AAAA>

   Vorbilder: <indirizzo> (aperto il <GG.MM.AAAA>, raggiungibile): piace perché …; …
   Übliche Seiten und Funktionen: …
   Übernehmen: [Annahme: …]
   Vermeiden: [Annahme: …]
   Pflichten: impressum, dichiarazione sulla protezione dei dati, …
   Inhalte vorhanden: …; manca: …
   Suchbegriffe: [Annahme: «…», «…», «…»]
   ```

**Percorso attività:** prima vengono i metodi `zielgruppe` e `angebot-und-preis` (strumento `methode`), ma solo quando `docs/ideen-check.md` dice «Entscheid: weiter». Scrivono `docs/zielgruppe.md` e `docs/angebot.md` e annotano in `docs/recherche.md` quello che serve alla ricerca; le offerte simili diventano i modelli. Dopo qui compili solo le righe che mancano.

**Momento di apprendimento:** ispirarsi è permesso, copiare no.

**Ce l'hai fatta quando** `docs/recherche.md` ha tutte e sette le righe e ogni indirizzo dei modelli è stato aperto ed era raggiungibile. Poi `schritt_melden` con `recherche`.

## Pianta (Grundriss)

**Immagine:** la pianta della casa: quali stanze, quali corridoi, dov'è la porta d'ingresso.

1. **Cinque domande a cui può rispondere solo la persona,** al massimo due alla volta, e solo quello che manca ancora:
   - Che cosa devono poter fare i visitatori: chiedere, prenotare, iscriversi, pagare? Ogni funzione avrà bisogno di uno svolgimento con conferma e caso di errore.
   - Ci sono aree solo per certe persone? Chi può vedere e cambiare che cosa?
   - In quali lingue? Ogni lingua raddoppia i testi.
   - Entro quando deve essere online? C'è un'occasione?
   - Chi cambierà più tardi testi e appuntamenti, e quanto spesso?
2. **Il resto lo proponi con un motivo, come standard invece che come domanda:**
   - `Seiten:` (pagine) Per il primo volo al massimo da cinque a sette, impressum e protezione dei dati compresi. Un inizio collaudato: pagina iniziale (chi, cosa, per chi, e il pulsante per la cosa principale), offerta, chi siamo, contatto, impressum e protezione dei dati. Ogni pagina va curata.
   - `Setup:` (configurazione) Lo standard è un sito senza servizi propri: testi e immagini, anche in più lingue, liste come le date come file nel progetto, richieste per e-mail. Solo una lista di iscrizione, prenotazioni con posti, un accesso o una bacheca per altri richiedono un blocco (skill `bausteine`, più tardi con un server tuo). Un sistema per gestire i contenuti (skill `cms`) arriva solo quando qualcuno senza conoscenze tecniche cambia regolarmente i contenuti.
   - `Testing:` (verifica) da che cosa capite che è finito: da tre a cinque frasi che si possono verificare, partendo dalla cosa principale. Per esempio: «Sul telefonino si vede senza scorrere di cosa si tratta, e il pulsante «Chiedere un posto».» «Una richiesta arriva, e chi chiede riceve una conferma.» «Impressum e protezione dei dati si raggiungono da ogni pagina.»
   - `Release:` (messa online) la data o l'occasione della persona, e in più, come standard, la strada verso la rete: la persona vede prima il suo sito sul suo computer e lo approva, poi sceglie dove abita il sito (da Albatros o da sé), poi va online. Prima dell'approvazione niente va in rete.
3. **Scrivere `docs/plan.md`.** `Funktionen` = funzioni, `Zugang` = accesso, `Sprachen` = lingue, `Pflege` = cura:

   ```markdown
   # Piano: <nome del progetto>

   Worum es geht: <in una frase>, per <per chi>. Successo: <successo> (da docs/projekt.md)

   Projektname: <da docs/projekt.md>
   Seiten: [Annahme: inizio, offerta, chi siamo, contatto, impressum e protezione dei dati]
   Funktionen: cosa principale «…»: …; conferma: …; errore: …
   Zugang: …
   Sprachen: …
   Setup: [Annahme: sito senza servizi propri, perché …]
   Testing: [Annahme: …; …; …]
   Release: <data o occasione>; strada verso la rete: vedere sul computer, approvazione, scegliere il domicilio, online
   Pflege: …
   Stand: <GG.MM.AAAA>, la pianta c'è, non ancora verificata

   ## Pagine
   - Inizio: …

   ## Contenuti
   | Cosa | Ce l'abbiamo | Manca ancora: chi lo fornisce ed entro quando |
   |---|---|---|
   ```

   Leggi il piano alla persona con parole brevi. Le ipotesi le conferma in un solo messaggio.

**Percorso attività:** il progetto della pagina iniziale dall'alto in basso e il collaudo li scrive il metodo `landingpage` (strumento `methode`) in `docs/plan.md`. Dopo completi con le domande qui sopra le righe che lì sono ancora `[offen]`.

**Momento di apprendimento:** perché ogni pagina va curata.

**Ce l'hai fatta quando** `docs/plan.md` ha tutte e dieci le righe, i punti aperti ci sono come `[offen: …]` e niente è inventato. Poi `schritt_melden` con `plan`.

## Verificare il piano (Plan prüfen)

**Immagine:** il secondo parere dell'ingegnera statica, prima di costruire. Non ha disegnato lei il piano, e per questo vede ciò che è sfuggito all'architetto.

1. **Secondo parere in un contesto nuovo.** Chi ha scritto il piano vede peggio le sue lacune, anche tu. Per questo verifica un contesto nuovo, che legge solo `docs/` e non conosce la storia precedente:

   | IA | Come |
   |---|---|
   | Claude Code | un subagente, oppure `claude -p` nella cartella del progetto |
   | Codex | `codex exec` nella cartella del progetto |
   | Gemini CLI | `gemini -p` nella cartella del progetto |
   | Cursor | una nuova chat dell'agente, oppure `agent -p` nella cartella del progetto |

   Se non funziona niente di questo, chiedi alla persona di aprire una nuova conversazione e di copiarci l'incarico. L'incarico, parola per parola:

   > Leggi solo i file in docs/ e verifica il piano in docs/plan.md con questa lista. Per ogni punto indica ok, rischio o aperto, con il punto preciso (file e riga) e una frase di motivo. Non inventare niente: quello che non sta in docs/ è aperto.
   > 1. Una sola cosa principale, e ogni pagina la serve
   > 2. Al massimo da cinque a sette pagine per il primo volo
   > 3. Ogni funzione ha uno svolgimento con conferma, errore e stato vuoto
   > 4. I contenuti ci sono, oppure è chiaro chi li fornisce ed entro quando
   > 5. È chiarito chi può fare che cosa, e se per questo serve un blocco
   > 6. Impressum, protezione dei dati e diritti sulle immagini sono previsti
   > 7. La misura del successo è un numero o un evento osservabile
   > 8. È chiaro quanto costa dopo il lancio e chi lo paga
   > 9. Il rischio più grande è nominato, e anche quello che per il primo volo si lascia fuori
   > 10. La data è adatta all'ampiezza del lavoro

2. **`docs/plan-pruefung.md`** con il risultato, senza voto e senza percentuale: ogni punto onestamente ok, rischio o aperto. `Geprüft am` = verificato il, `Zweite Meinung` = secondo parere:

   ```markdown
   # Verifica del piano: <nome del progetto>

   Geprüft am: <GG.MM.AAAA>
   Zweite Meinung: <IA e modo, p. es. Claude Code, subagente in un contesto nuovo>; <numero> ok, <numero> rischio, <numero> aperto

   | Punto | Risultato | Dove | Motivo |
   |---|---|---|---|
   ```

3. **Decide la persona.** Mostrale solo i punti con rischio o aperti, ognuno in una frase con la tua proposta. Poi la domanda: «Ho segnato i punti con rischio o aperti. Il piano è definitivo così, o cambiamo qualcosa?» È il primo dei tre momenti del sì di tutto il percorso: il design comincia solo con un piano confermato. «Sembra a posto» non è un sì; allora richiedi.
4. **Solo dopo il suo sì** in `docs/plan.md` entra la riga `Bestätigt: <GG.MM.AAAA>, «<le sue parole>»` (confermato), e sotto `Stand:` c'è «verificato e confermato». Mai prima. Se vuole cambiare qualcosa, cambi il piano, verifichi ancora una volta i punti cambiati in un contesto nuovo e chiedi di nuovo.

**Modernizzare:** il secondo parere verifica in più che nessuna funzione del vecchio sito vada persa senza una decisione (`docs/bestand.md`, colonna Decisione). Aggiungilo come undicesimo punto all'incarico.

**Momento di apprendimento:** chi ha scritto il piano vede peggio le sue lacune.

**Ce l'hai fatta quando** ogni punto della lista di controllo è ok, rischio o aperto con il punto preciso e `docs/plan.md` ha la riga `Bestätigt:` con il sì della persona. Poi `schritt_melden` con `plan-geprueft`. Dopo viene il carattere del sito (skill `konzept`), ancora prima di colori e codice.

## Cosa risparmi alla persona

- **Troppo tutto in una volta:** blog, negozio online e area per i membri sono cose per dopo. Prima un sito che fa bene la cosa principale. Più lingue non sono un problema, se i testi ci sono.
- **Decisioni tecniche troppo presto:** per il piano basta lo standard qui sopra. Un blocco o un sistema per i contenuti arriva solo quando una funzione ne ha davvero bisogno.
- **Logo e colori per primi:** carattere e aspetto vengono dopo il piano confermato. Una bella pagina vuota non aiuta nessuno.

## Verificare la missione

Dopo `schritt_melden` verifichi la missione della sezione con `mission_pruefen`. È superata appena il passo c'è sull'isola:

| Sezione | Missione | Percorso attività in più |
|---|---|---|
| Idea | `flugschule-11-idee` | `geschaeft-01-ideen-check` |
| Ricerca | `flugschule-12-recherche` | `geschaeft-02-zielgruppe`, `geschaeft-03-angebot-und-preis` |
| Pianta | `webseite-01-webseite-planen` (percorso sito web) | `geschaeft-05-landingpage` |
| Verificare il piano | `flugschule-13-plan-pruefen` | |

Senza accesso questo salta; i file nel progetto sono comunque il risultato.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine della sezione (la meta sulla carta, le guide di viaggio, la pianta, il secondo parere dell'ingegnera statica), che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
