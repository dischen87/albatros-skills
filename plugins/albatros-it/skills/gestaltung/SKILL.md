---
name: gestaltung
description: "Rivede l'uso e l'aspetto di un piccolo sito web con una persona senza conoscenze tecniche, passo per passo con la sua IA. Prima un controllo da tre punti di vista (percorsi, accesso, stati e linguaggio), poi la riparazione dell'uso, poi il carattere del sito invece dei colori preferiti, tre direzioni chiaramente diverse tra cui scegliere, un controllo contro il tipico aspetto da IA, valori fissi per colori, caratteri e spaziature (token), la domanda sugli elementi grafici (icone, illustrazioni, foto, mascotte, 3D, se si vuole con gli strumenti per immagini di Albatros) e il rifacimento di tutte le pagine con foto in larghezza telefonino e desktop. Usa lo skill con «design», «sembra noioso», «sembra fatto in casa», «sembra fatto dall'IA», «vibe coded», «renderlo più bello», «colori», «carattere», «font», «redesign», «tre varianti», «non sembra professionale», «layout», «icone», «illustrazioni», «mascotte», «3D»."
---

# Aspetto: prima le fondamenta, poi la facciata

## L'immagine

Chi rimette a posto una casa vecchia non dipinge per prima la facciata. Prima vengono le fondamenta: porte che si incastrano, scale senza ringhiera, interruttori nel posto sbagliato. Solo quando la casa è comoda da abitare si dipinge. Una vernice nuova sopra porte rotte rende gli errori solo più belli.

Per la facciata c'è poi una **mazzetta dei colori**: una piccola raccolta di colori, caratteri e spaziature fissi. Tutto nella casa si dipinge solo con quella. La parola tecnica è **token**.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Se la persona vuole «più bello» o «altri colori», la tua prima risposta è sempre: l'immagine delle fondamenta prima della facciata e il percorso in cinque passi. Dove si trova il sito e come ci arrivi lo chiedi solo dopo.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, in breve. Ogni critica ha bisogno di una prova: quale pagina, quale punto, meglio ancora una foto. «Sembra agitato» da solo non conta.
- Il gusto lo decide la persona. Tu proponi direzioni e dici onestamente cosa sa fare ognuna e qual è il suo rischio.
- Le indicazioni proprie della persona (logo, colore aziendale, modo di rivolgersi, testi obbligatori) vengono prima di ogni consiglio di design.
- Niente viene pubblicato prima che la persona abbia visto le foto e detto di sì.

## Procedura

Se non vedi ancora il sito (nessun progetto nella cartella, nessun indirizzo), spiega prima tutto il percorso in cinque passi brevi: controllare, riparare l'uso, scegliere tra tre direzioni chiaramente diverse, fissare la mazzetta dei colori, rifare. Solo dopo chiedi dove si trova il sito.

### 0. Cornice (5 minuti)

Riprendi da `docs/plan.md` (skill `webseite-planen`): per chi, la cosa principale per i visitatori, le pagine. In più chiedi: cosa deve restare (logo, colore, carattere, testi)? Crea `docs/gestaltung/`.

### 1. Controllo da tre punti di vista (solo leggere, non cambiare niente)

Percorri il sito uno dopo l'altro con tre paia di occhiali. Per ogni osservazione una riga di tabella in `docs/gestaltung/pruefung.md`:

| ID | Pagina e punto | Cosa succede, per chi, perché è un problema | Prova | Gravità | Proposta (nuovo testo alla lettera o nuovo comportamento) |
|---|---|---|---|---|---|

- **Percorsi (PE):** Prova la cosa principale dall'inizio alla fine. Quanti passi? La risposta è nella prima schermata? Ci sono vicoli ciechi? È chiaro chi c'è dietro e quanto costa?
- **Accesso (AC):** la lista di controllo dello skill `barrierefreiheit` (contrasto, tastiera, descrizioni delle immagini, moduli, telefonino).
- **Stati e linguaggio (SL):** Cosa si vede durante il caricamento, con un modulo vuoto, con un errore, dopo l'invio? Le stesse parole per le stesse cose? I pulsanti dicono il risultato («Chiedi un posto» invece di «Invia»)?

Gravità: **critica** (la cosa principale non funziona o viola la legge), **alta** (porta spesso a errori o abbandoni), **media**, **bassa**. Per un piccolo sito bastano da 10 a 15 osservazioni con prova. Lo stesso errore in molti punti è un'osservazione con una lista dei punti. Alla fine: cosa è buono e deve restare.

### 2. Decidere e riparare le fondamenta

Presenta alla persona tutto insieme quello che deve decidere (con la tua raccomandazione), non punto per punto. Poi ripara: prima le parti comuni (pulsante, campo del modulo, messaggio d'errore, conferma), poi le pagine. Colori e caratteri in questo passo restano come sono.

- **Pulsante principale:** alto circa 56 px, carattere da 17 px, semigrassetto. Il secondo pulsante è bianco con bordo, i link sono sottolineati.
- **Disattivato** non è mai invisibile: opacità al 40 %, e accanto c'è scritto perché.
- **Campi:** alti da 48 a 52 px, l'etichetta sta sopra (mai solo un segnaposto nel campo), aiuto o errore sotto, con una parola e non solo con il colore.
- **Stato** (libero, al completo, confermato) sempre come parola e forma, mai solo come colore.

### 3. Tre direzioni

1. **Il carattere prima dei colori.** Chiedi delle caratteristiche, non dei colori preferiti. Proponi coppie di opposti tra cui scegliere, adatte al sito: tradizionale o sportivo, villaggio di montagna o città, calmo o vivace, elegante o alla mano, per gli ospiti o per i membri. In più una domanda: quali tre parole devono pensare i visitatori dopo dieci secondi? Annota le risposte in `docs/gestaltung/richtungen.md`. Ognuna delle tre direzioni mette in risalto altre di queste caratteristiche. I colori ne derivano, insieme al logo e all'ambiente, mai il contrario.
2. **Modelli:** guarda i due o tre siti del piano. Cosa fanno bene? Cosa non riprendiamo (il loro logo, i colori, il carattere)?
3. **Diagnosi:** Perché l'aspetto di oggi non regge? Tipico: tutti i titoli alla stessa voce, due stili uno accanto all'altro, un colore con più significati, spaziature che cambiano.
4. **Tre direzioni chiaramente diverse**, non solo tre colori. Si distinguono per idea, carattere, ruolo del colore, forme e profondità. Esempio: «Morbida» (calda, rotonda), «Chiara» (calma come un giornale), «Decisa» (superfici di colore, titoli grandi).
5. Ogni direzione mostra **le stesse due o tre pagine** (iniziale, sottopagina più importante, contatto) con testi veri. Il testo segnaposto falsa il giudizio.
6. Uguale in tutte le direzioni: logo, testi obbligatori, un pulsante principale per pagina, accessibilità.

`docs/gestaltung/richtungen.md`: in alto la riga `Entscheid: <direzione o combinazione> (<data>)` (la parola `Entscheid:` resta in tedesco, perché la verifica della missione la cerca), sotto la diagnosi e per ogni direzione una tabella (idea, carattere, colori, forme, punto di forza, rischio). Le bozze come file HTML in `docs/gestaltung/entwuerfe/`, così la persona può aprirle nel browser.

### Non sembrare fatto dall'IA

I siti fatti con l'IA si riconoscono dagli stessi tratti. Controlla ogni bozza e il sito finito con questa lista e scrivi il risultato in `docs/gestaltung/richtungen.md` (riga `Tratti dell'IA controllati: …`):

- Sfumature in viola e blu, effetti luminosi e di vetro.
- Emoji come icone.
- Inter o un altro carattere standard dappertutto, tutti i titoli alla stessa voce.
- Testata centrata con una macchia di colore dietro e due pulsanti uno accanto all'altro.
- Tre schede uguali in fila, con la stessa ombra, lo stesso arrotondamento e un'icona ciascuna.
- Aspetto da immagini di repertorio: persone sorridenti al portatile, montagne di chissà dove.
- Frasi fatte: «Benvenuti sul nostro sito», «Scopri», «Il vostro partner per», «con passione», «innovativo», «senza intoppi».
- Numeri, recensioni, citazioni o loghi di clienti inventati. Promesse di tempo come «in 60 secondi».
- Ombre grigie, due tipi di profondità uno accanto all'altro (ombra qui, bordo là), set di icone mescolati.
- Più di sei sezioni sulla pagina iniziale.

Invece: un unico segno distintivo, usato con parsimonia (una linea sotto una parola del titolo, un evidenziatore per al massimo una parola per sezione), foto vere del luogo e delle persone, un carattere tipografico con personalità, adatto alle caratteristiche, colori dal logo e dall'ambiente, una struttura che nasce dal contenuto (se gli appuntamenti sono la cosa principale, stanno in alto) e frasi concrete con nomi, numeri e luoghi. Nel codice trovi sfumature e caratteri standard con `grep -rnE "linear-gradient|radial-gradient|Inter" src`. Emoji e frasi fatte le cerchi nei testi, il resto nelle foto.

### 4. La mazzetta dei colori (token)

Un file `tokens.css` con variabili CSS: colori per chiaro e scuro, caratteri, dimensioni dei caratteri, spaziature, arrotondamenti. Per ogni blocco una frase di commento sul perché. Regole:

- Un colore d'azione per tutto ciò che si può cliccare, e da nessun'altra parte.
- Calcola il contrasto, non stimarlo: testo almeno 4,5 : 1, pulsanti e bordi almeno 3 : 1 (formula nello skill `barrierefreiheit`). Scrivi i valori come commento.
- La modalità scura scambia solo le variabili dei colori (`@media (prefers-color-scheme: dark)`).
- Fuori da `tokens.css` nel codice non c'è nessun colore e nessuna dimensione di carattere scritta a mano.
- **Caratteri:** al massimo due famiglie, un carattere per i titoli con personalità e un carattere tranquillo per il testo, ospitati in proprio (woff2, `font-display: swap`). Testo da 16 a 17 px con interlinea 1,5, niente sotto i 12 px. Titoli grandi con interlinea da 1,0 a 1,1 e un po' più stretti (da −0,01 a −0,03 em), sul telefonino più piccoli con `clamp()`. Grassetto (700) solo per i titoli più grandi, altrimenti semigrassetto (600). Prezzi e orari con `font-variant-numeric: tabular-nums`.
- **Spaziature** solo da una serie: 4, 8, 12, 16, 24, 32, 48 px (più grandi per le sezioni). Contenuto largo al massimo circa 1200 px, sul telefonino 16 px di margine.
- **Arrotondamenti:** tre livelli secondo la grandezza (campo, scheda, superficie grande), dentro sempre più piccoli che fuori. I pulsanti o tutti arrotondati o tutti squadrati.
- **Profondità:** un solo metodo per tutto il sito, o superficie con ombra o linea sottile senza ombra. Ombre tinte del colore del testo, mai grigie, al massimo due livelli. Lo sfondo è leggermente caldo, le schede sono bianche.
- **Movimento:** pressione da 90 a 100 ms, cambio da 160 a 200 ms, un movimento per evento. Con «Riduci movimento» solo dissolvenze.
- **Focus:** da 2 a 3 px nel colore d'azione con 2 px di distanza, su ogni sfondo almeno 3 : 1.
- **Il colore d'errore** solo per errori e cose urgenti.

### Elementi grafici: chiedi sempre

Quando la direzione è decisa, chiedi sempre: «Vuoi aggiungere anche degli elementi grafici?» Presenta le possibilità con il lavoro che richiedono:

- **Icone:** un unico set uniforme (per esempio Lucide o Phosphor), mai emoji e mai due set mescolati.
- **Illustrazioni:** poche, nello stesso stile, per i punti vuoti e le spiegazioni.
- **Foto proprie:** una lista di cosa deve fotografare la persona (il luogo, persone in azione, dettagli). Le foto vere battono qualsiasi immagine generata.
- **Una mascotte:** una figura che accompagna attraverso il sito. Prima un foglio con quattro-sei pose della stessa figura, una per ogni momento (benvenuto, ricerca, successo, vuoto), poi le regole su quando compare: mai con errori, disdette o momenti delicati, mai accanto a foto di persone, mai dietro liste o moduli. Grandezza: per il benvenuto al massimo metà della larghezza, altrimenti piccola. È decorazione (`alt=""`), la frase accanto regge anche senza di lei. I clip animati si caricano solo quando sono visibili, durano al massimo 5 secondi e poi si fermano (WCAG 2.2.2). Ogni immagine la guardi tu stesso, anche ingrandita.
- **3D:** un oggetto o la figura come modello 3D, solo nella testata della pagina iniziale e solo dalla larghezza di un tablet in su. Prima c'è un'immagine ferma, il 3D si carica solo quando la testata è visibile. Sul telefonino, senza scheda grafica o con «Riduci movimento» resta l'immagine ferma.

Quello che sceglie la persona va in `docs/gestaltung/richtungen.md` e nella mazzetta dei colori (dimensioni, spaziature, regole).

**Con Albatros** immagini, figure scontornate e modelli 3D nascono con gli strumenti di Albatros, pagati dal credito della persona (prezzo di costo più 35 %):

- `bild_erzeugen` con `beschreibung` e `format` (`quadrat`, `quer`, `hoch` o `breit`), `bild_freistellen` con `bild_url` (un'immagine con sfondo trasparente), `modell_3d` con `bild_url` (un modello 3D in formato GLB, meglio se da un'immagine scontornata).
- `guthaben` mostra il saldo, i prezzi e il link per ricaricare. I prezzi li dici solo da questa risposta.
- Prima della prima chiamata che costa qualcosa chiami `guthaben`, dici il prezzo e chiedi una volta: «Un'immagine costa CHF …, il tuo credito basta per … Procedo?» Dopo, a ogni chiamata dici in breve costo e resto, senza chiedere di nuovo. Se il credito non basta, passi il link per ricaricare.
- Ogni risultato lo salvi subito nel progetto (`curl -o web/public/bilder/<name>.png <url>`), perché dopo 7 giorni sparisce. Per una variante cambi la descrizione: la stessa descrizione per 15 minuti restituisce la stessa immagine, senza nuovi costi.
- Ogni immagine generata la guardi tu stesso prima di mostrarla alla persona. Sul sito va solo quello che ha scelto lei.
- Se uno strumento risponde «kommt bald» (arriva presto), vai avanti senza strumenti per immagini (vedi sotto).

**Con un account Hugging Face proprio** si può fare anche così, come alternativa. La persona crea l'account da sola e accede da sola. Tu colleghi il server ufficiale: `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. Con Codex è `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, con Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, con Cursor la voce `"huggingface": { "url": "https://huggingface.co/mcp?login" }` sotto `mcpServers` in `~/.cursor/mcp.json`. Gli Spaces per immagini, scontorno e 3D li sceglie lei su huggingface.co/settings/mcp. Gratis ci sono 5 minuti di calcolo al giorno. Senza accesso il server offre solo la ricerca nell'Hub.

**Diritti:** Ogni modello ha una licenza: leggila sulla pagina del modello prima che un'immagine vada sul sito. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) e TRELLIS (MIT) permettono anche l'uso commerciale, FLUX.1 dev solo quello non commerciale. Le immagini generate non mostrano persone reali né loghi di altri. Luoghi e persone reali vengono da foto proprie, con il consenso.

**Senza strumenti per immagini** il percorso è lo stesso: icone da un set libero, foto proprie, illustrazioni da una raccolta libera con una licenza chiara, una mascotte disegnata o più tardi, niente 3D.

### 5. Rifacimento

Contenuti e percorsi restano. Prima la base (integrare i token, parti comuni, una pagina modello), poi le altre pagine. Se nella mazzetta dei colori manca un valore, lo aggiungi lì, non nel codice della pagina.

### 6. Foto e approvazione

Fotografa ogni pagina, in larghezza telefonino e in larghezza desktop, chiara e scura. Se il sito non è ancora in rete, usi l'indirizzo dell'anteprima (`http://localhost:4321`):

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Guarda tu stesso ogni foto e confrontala con la bozza. Solo dopo mostrala alla persona. Dopo il suo sì: diario di bordo (skill `git-logbuch`), nastro trasportatore (skill `pipeline`).

## Trappole

- Aspetto prima dell'uso: fissa gli errori.
- Tre direzioni che si distinguono solo per il colore: nessuna vera scelta.
- Colori scritti a mano nel codice: così la modalità scura si rompe.
- Dire «finito» senza aver guardato tu stesso le foto.

## Verifica la missione

`mission_pruefen` con `webseite-04-gestaltung`. La verifica controlla se `~/projekt/docs/gestaltung/richtungen.md` contiene una decisione (la riga `Entscheid:`) e se il sito risponde.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «prima le fondamenta, poi la facciata», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
