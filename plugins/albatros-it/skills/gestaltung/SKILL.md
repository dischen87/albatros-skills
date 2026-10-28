---
name: gestaltung
description: "Rivede l'uso e l'aspetto di un piccolo sito web con una persona senza conoscenze tecniche, passo per passo con la sua IA. Prima un controllo da tre punti di vista (percorsi, accesso, stati e linguaggio), poi la riparazione dell'uso, poi tre direzioni chiaramente diverse tra cui scegliere, valori fissi per colori, caratteri e spaziature (token) e il rifacimento di tutte le pagine con foto in larghezza telefonino e desktop. Usa lo skill con «design», «sembra noioso», «sembra fatto in casa», «renderlo più bello», «colori», «carattere», «font», «redesign», «tre varianti», «non sembra professionale», «layout»."
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

### 3. Tre direzioni

1. **Modelli:** guarda i due o tre siti del piano. Cosa fanno bene? Cosa non riprendiamo (il loro logo, i colori, il carattere)?
2. **Diagnosi:** Perché l'aspetto di oggi non regge? Tipico: tutti i titoli alla stessa voce, due stili uno accanto all'altro, un colore con più significati, spaziature che cambiano.
3. **Tre direzioni chiaramente diverse**, non solo tre colori. Si distinguono per idea, carattere, ruolo del colore, forme e profondità. Esempio: «Morbida» (calda, rotonda), «Chiara» (calma come un giornale), «Decisa» (superfici di colore, titoli grandi).
4. Ogni direzione mostra **le stesse due o tre pagine** (iniziale, sottopagina più importante, contatto) con testi veri. Il testo segnaposto falsa il giudizio.
5. Uguale in tutte le direzioni: logo, testi obbligatori, un pulsante principale per pagina, accessibilità.

`docs/gestaltung/richtungen.md`: in alto la riga `Entscheid: <direzione o combinazione> (<data>)` (la parola `Entscheid:` resta in tedesco, perché la verifica della missione la cerca), sotto la diagnosi e per ogni direzione una tabella (idea, carattere, colori, forme, punto di forza, rischio). Le bozze come file HTML in `docs/gestaltung/entwuerfe/`, così la persona può aprirle nel browser.

### 4. La mazzetta dei colori (token)

Un file `tokens.css` con variabili CSS: colori per chiaro e scuro, caratteri, dimensioni dei caratteri, spaziature, arrotondamenti. Per ogni blocco una frase di commento sul perché. Regole:

- Un colore d'azione per tutto ciò che si può cliccare, e da nessun'altra parte.
- Calcola il contrasto, non stimarlo: testo almeno 4,5 : 1, pulsanti e bordi almeno 3 : 1 (formula nello skill `barrierefreiheit`). Scrivi i valori come commento.
- La modalità scura scambia solo le variabili dei colori (`@media (prefers-color-scheme: dark)`).
- Fuori da `tokens.css` nel codice non c'è nessun colore e nessuna dimensione di carattere scritta a mano.

### 5. Rifacimento

Contenuti e percorsi restano. Prima la base (integrare i token, parti comuni, una pagina modello), poi le altre pagine. Se nella mazzetta dei colori manca un valore, lo aggiungi lì, non nel codice della pagina.

### 6. Foto e approvazione

Fotografa ogni pagina, in larghezza telefonino e in larghezza desktop, chiara e scura:

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

`mission_pruefen` con `webseite-03-gestaltung`. La verifica controlla se `~/projekt/docs/gestaltung/richtungen.md` contiene una decisione (la riga `Entscheid:`) e se il sito risponde.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «prima le fondamenta, poi la facciata», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
