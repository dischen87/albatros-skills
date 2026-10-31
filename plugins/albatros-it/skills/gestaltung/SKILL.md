---
name: gestaltung
description: "Dà forma con una persona senza conoscenze tecniche all'uso e all'aspetto del suo sito. Nel piano di volo (P6): mockup grigio («L'ordine è giusto?»), tre direzioni chiaramente diverse dal concetto, controllo contro l'aspetto da IA, token per colori, carattere e spaziature (design/tokens.css), docs/designsystem.md e una tavola dei campioni. Per un sito esistente: controllare da tre punti di vista, riparare l'uso, direzioni, token, rifacimento con foto. Sempre con la domanda sugli elementi grafici (icone, foto, mascotte, 3D; strumenti per immagini solo dopo prezzo e sì). Usa questo skill dopo konzept e con «design», «sistema di design», «tavola dei campioni», «sembra noioso», «sembra fatto in casa», «sembra fatto dall'IA», «vibe coded», «renderlo più bello», «colori», «carattere», «redesign», «tre varianti», «non sembra professionale», «layout», «icone», «mascotte», «3D»."
metadata:
  stand: 0.2.0
  quelle: '02f75af84c9c'
---

# Aspetto: prima le fondamenta, poi la facciata

## L'immagine

Chi rimette a posto una casa vecchia non dipinge per prima la facciata. Prima vengono le fondamenta: porte che si incastrano, scale senza ringhiera, interruttori nel posto sbagliato. Solo quando la casa è comoda da abitare si dipinge. Una vernice nuova sopra porte rotte rende gli errori solo più belli.

In una casa nuova le fondamenta sono la struttura: prima si disegna in grigio quale stanza sta dove. Solo dopo si mettono i campioni dei materiali uno accanto all'altro su una **tavola dei campioni**: colori, caratteri, pulsanti e campi, come quando nella costruzione di una casa si guardano piastrelle e legno prima di ordinare. Ciò che è giusto sulla tavola dei campioni è giusto in ogni stanza.

Per la facciata c'è una **mazzetta dei colori**: una piccola raccolta di colori, caratteri e spaziature fissi. Tutto nella casa si dipinge solo con quella. La parola tecnica è **token**.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Due strade attraverso questo skill

- **Sito nuovo nel piano di volo (P6):** C'è `docs/konzept.md` di P5, e non è ancora costruito niente. Segui la sezione «Dal mockup alla tavola dei campioni».
- **Rifare un sito esistente:** Il sito è già costruito o in rete, e la persona trova che sia difficile da usare o che non sia bello («sembra fatto in casa», «renderlo più bello», «altri colori»). Segui la sezione «Rifare un sito esistente». Se il sito è già online, prima del rifacimento viene una bozza delle pagine cambiate con il via libera per costruire (skill `entwurf` e `webseite-aendern`).

Per entrambe valgono le sezioni «Tre direzioni», «Non sembrare fatto dall'IA», «La mazzetta dei colori (token)» ed «Elementi grafici».

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- La tua prima risposta è sempre l'immagine e il percorso in cinque passi: nel piano di volo mockup, tre direzioni, scelta, mazzetta dei colori, tavola dei campioni; per un sito esistente controllare, riparare l'uso, scegliere tra tre direzioni chiaramente diverse, fissare la mazzetta dei colori, rifare. Se la persona vuole «più bello» o «altri colori», vale lo stesso. Dove si trova il sito e come ci arrivi lo chiedi solo dopo.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu, in breve. Al massimo due domande per messaggio. Ogni critica ha bisogno di una prova: quale pagina, quale punto, meglio ancora una foto. «Sembra agitato» da solo non conta.
- Il gusto lo decide la persona. Tu proponi direzioni e dici onestamente cosa sa fare ognuna e qual è il suo rischio.
- Le indicazioni proprie della persona (logo, colore aziendale, modo di rivolgersi, testi obbligatori) vengono prima di ogni consiglio di design. Nel piano di volo stanno in `docs/konzept.md` sotto `Muss bleiben:`.
- Quello che la persona deve vedere (mockup, direzioni, tavola dei campioni, foto) lo apri tu nel browser: `open <file>` (Linux `xdg-open`, Windows `start`). Dire solo il nome del file non basta.
- Niente viene pubblicato prima che la persona abbia visto le foto e detto di sì.

## Dal mockup alla tavola dei campioni (piano di volo P6)

Fase P6 «Sistema di design con esempio». Tocca a questa fase quando `docs/konzept.md` ha tutte e sette le righe (P5, skill `konzept`); se manca, vai prima lì. Dopo viene P7, tutto il sito come bozza da sfogliare cliccando (skill `entwurf`).

- **Risultato:** `design/mockup.html`, `design/richtungen/*.html`, `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` e `docs/designsystem.md` con le righe `Richtung:`, `Farben:`, `Schriften:`, `Abstände:`, `Komponenten:` e `Maskottchen:`. I nomi dei file e delle righe restano in tedesco, perché `lage` e gli script di verifica li leggono; il contenuto è in italiano.
- **Fatto quando** ci sono `tokens.css` e `musterblatt.html`, la tavola dei campioni usa colori, caratteri e dimensioni solo come `var(--…)` da `tokens.css` e la persona l'ha vista.
- **Domande alla persona:** «L'ordine sullo schizzo grigio è giusto?», «Quale delle tre direzioni, o quale combinazione?», «La tavola dei campioni va bene: colori, caratteri, pulsanti, campi, schede e intestazione sul telefonino?» e la domanda sugli elementi grafici. «Anche una versione scura?» la proponi come `[Ipotesi: sì, chiara e scura]`, perché molti telefonini di notte mostrano tutto scuro.
- **Isola:** `mockup` appena l'ordine è giusto; `entwuerfe` appena la persona ha visto la tavola dei campioni e le va bene.

**Modo:** Leggi `Modus:` in `docs/projekt.md` (se la riga manca, vale `machen`, fare). Il momento di apprendimento di questa fase è «Perché colori e caratteri stanno in un solo posto»: la persona cambia lei stessa un colore in `design/tokens.css`, ricarica la tavola dei campioni e vede che cambia dappertutto. Nel modo `lernen` (imparare) lo fa da sola (poi `verstanden_melden` con `mission: webseite-04-gestaltung` e `art: selbst`), e alla fine fai la domanda di controllo della lezione: «Perché colori e caratteri stanno in un solo posto?» Solo dopo la sua risposta annunci `art: kontrollfrage`. Nel modo `machen` (fare) offri il momento di apprendimento e spieghi ogni passo in una frase con la sua immagine. Se lo strumento `verstanden_melden` manca, si continua senza.

### 1. Il mockup dallo schizzo (`schritt: mockup`)

Lo schizzo grigio della pagina iniziale di P1 si trova in `design/skizze.html`. Da lì fai `design/mockup.html`: la pagina iniziale dall'alto in basso (sul percorso attività come in `docs/plan.md` sotto «Startseite von oben nach unten») e la sottopagina più importante, tutte e due in un solo file. Se lo schizzo manca, prendi `docs/plan.md`.

- Solo toni di grigio e il carattere del sistema, niente immagini: superfici grigie con una scritta che dice cosa ci andrà («Foto: la prova nella scuola»).
- Titoli e frasi veri da `docs/projekt.md`, `docs/plan.md` e `docs/konzept.md` (nome, nucleo), il pulsante principale con il suo testo vero («Chiedi un posto»), il menu con tutte le pagine di `Seiten:`.
- Un solo file senza link alla rete; si apre con un doppio clic.

Aprilo e chiedi solo: «L'ordine sullo schizzo grigio è giusto?» Perché: prima la struttura, poi l'aspetto. Cambia finché è giusto. Poi crei `docs/designsystem.md` (modello al passo 4) con `Richtung: [aperto: scelta della direzione] · ordine confermato il <GG.MM.AAAA>`, le altre righe con `[aperto: …]`, e annunci `mockup` (sezione «L'isola»).

### 2. Tre direzioni sul mockup

Adesso entra in gioco il carattere. Leggi in `docs/konzept.md` le tre parole sotto `Charakter:`, il tono, il linguaggio visivo e ciò che deve restare, in `docs/recherche.md` i modelli. Ne fai tre direzioni chiaramente diverse secondo la sezione «Tre direzioni»: ogni volta un file `design/richtungen/<nome>.html` (per esempio `morbida.html`, `chiara.html`, `decisa.html`) con esattamente il contenuto e l'ordine del mockup.

- In alto in ogni file un breve riquadro: l'idea, quale delle tre parole mette in risalto, caratteri, ruolo del colore, forme, profondità, punto di forza e rischio.
- Ogni direzione ha i suoi valori provvisori in uno `<style>` in alto nel file. È permesso, perché solo dopo la scelta nasce la mazzetta dei colori come unica fonte.
- Se ne fa parte un personaggio (`Maskottchen: ja`), sta in ogni direzione nel punto in cui appare, come immagine o come schizzo da `design/figur/`.

### 3. Controllo contro l'aspetto da IA e scelta

Guarda ogni direzione nel browser, in larghezza telefonino e desktop, e controllala con la lista della sezione «Non sembrare fatto dall'IA». Quello che trovi lo correggi prima che la persona veda le direzioni. Scrivi il risultato in `docs/designsystem.md` sotto `## Richtung`: `Tratti dell'IA controllati: morbida ok, chiara ok, decisa: schede tutte uguali, rifatta`.

Apri tutte e tre e chiedi: «Quale delle tre direzioni, o quale combinazione?» Perché: tre direzioni chiaramente diverse mostrano che cosa è possibile. Nello stesso messaggio o subito dopo viene la domanda sugli elementi grafici (sezione «Elementi grafici»). La scelta va nella riga `Richtung:`, per esempio `Richtung: chiara, con i colori di morbida · ordine confermato il 30.10.2026`.

### 4. Mazzetta dei colori, componenti e sistema di design

Dalla direzione scelta nascono i campioni dei materiali per tutta la casa:

- **`design/tokens.css`:** la mazzetta dei colori, l'unica fonte per colori (chiari e scuri), caratteri, dimensioni dei caratteri, spaziature, arrotondamenti e ombre, con i contrasti come commento (sezione «La mazzetta dei colori (token)»).
- **`design/komponenten.css`:** le parti comuni, solo con `var(--…)`: pulsante (normale, focus, disattivato), link, campo con etichetta, aiuto ed errore, messaggio di conferma e di errore, scheda, intestazione con menu, piè di pagina con impressum e protezione dei dati. L'intestazione si regola sulla propria larghezza (interrogazione del contenitore `@container`) invece che sulla larghezza della finestra; così la tavola dei campioni la mostra anche in una cornice larga 390 px, come sul telefonino. Tavola dei campioni e bozza usano lo stesso file.
- **`docs/designsystem.md`:** leggibile per le persone, su una pagina. Ogni riga comincia a inizio riga con il suo nome in tedesco e resta breve (al massimo 300 caratteri), perché `lage` legge queste righe:

```markdown
# Sistema di design: <nome>
Stand: <GG.MM.AAAA>

Richtung: <nome della direzione o combinazione> · ordine confermato il <GG.MM.AAAA> · tavola dei campioni vista il <GG.MM.AAAA>
Farben: <colore d'azione, sfondo, testo, errore>; chiaro e scuro; contrasti in design/tokens.css
Schriften: <carattere dei titoli> e <carattere del testo>; testo 17 px, titoli <dimensioni>
Abstände: 4, 8, 12, 16, 24, 32, 48 px; contenuto al massimo 1200 px; arrotondamenti <…>; profondità: <ombra o linea>
Komponenten: pulsante, link, campo, messaggio, scheda, intestazione con menu, piè di pagina (design/komponenten.css)
Maskottchen: <ja – personaggio, pose, quando appare | nein | später>

## Direzione
Caratteristiche: <le tre parole> · idea: … · tratti dell'IA controllati: …

## Colori
| Token | Ruolo | chiaro | scuro | Contrasto |
|---|---|---|---|---|

## Componenti
| Componente | Ruolo | Token |
|---|---|---|

## Parole
Una parola per ogni cosa, uguale sul sito, nella mail e nell'amministrazione: richiesta (non prenotazione), …

## Elementi grafici
Icone: … · illustrazioni: … · foto: lista delle foto in docs/inhalte.md · personaggio: … · 3D: …
```

Dopo `Maskottchen:` viene prima `ja`, `nein` o `später`, come in `docs/konzept.md`.

### 5. La tavola dei campioni

`design/musterblatt.html` integra solo `tokens.css` e `komponenten.css` e mostra su una sola pagina:

- ogni colore come superficie con nome, ruolo e contrasto, chiaro e scuro uno accanto all'altro;
- le dimensioni dei caratteri dalla più grande alla più piccola, con frasi vere del progetto;
- le spaziature come serie e gli arrotondamenti;
- il pulsante normale, con il focus e disattivato (con il motivo accanto);
- un campo con etichetta, aiuto e un errore a parole;
- una scheda e un messaggio di conferma e di errore;
- l'intestazione con menu in una cornice larga 390 px e a tutta larghezza;
- gli elementi grafici: icone del set scelto, il personaggio nelle sue pose o come schizzo, una foto o la superficie dove andrà.

Nella tavola dei campioni colori, caratteri e dimensioni compaiono solo come `var(--…)`. Controllalo con gli occhi nel codice; se Node c'è già, lo misura `node <cartella dello skill entwurf>/entwurf-pruefen.mjs --nur farbfaecher`, che ricalcola anche ogni commento di contrasto (cartella sconosciuta: `curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs`).

Apri la tavola dei campioni e mostra alla persona come vederla sul telefonino: rendere la finestra del browser strettissima o usare la vista telefonino del browser (Firefox e Chrome: `Ctrl+Shift+M`, sul Mac in Firefox `Cmd+Opt+M`, in Chrome prima `F12`). Poi chiedi: «La tavola dei campioni va bene: colori, caratteri, pulsanti, campi, schede e intestazione sul telefonino?» Perché: ciò che è giusto nella tavola dei campioni è giusto su ogni pagina. Le modifiche le fai in `tokens.css` o `komponenten.css`, mai nella tavola stessa. Dopo il suo sì aggiungi `tavola dei campioni vista il <GG.MM.AAAA>` alla riga `Richtung:`, riempi le altre righe e annunci `entwuerfe`.

### L'isola

Dopo il passo 1 chiami lo strumento `schritt_melden` con `schritt: mockup` e `sprache: it`, dopo il passo 5 con `schritt: entwuerfe`. `projekt` lo lasci fuori, a meno che la persona lavori a un altro progetto che sta solo sul suo computer; allora dai il suo nome breve. Dille in una frase che la sua casa è cresciuta sull'isola. Se lo strumento risponde «Ungültige Angaben» (dati non validi), controlla una volta la scrittura; se manca, si continua senza isola. Dopo chiami di nuovo `lage` (skill `lotse`).

## Tre direzioni

1. **Il carattere prima dei colori.** Nel piano di volo le caratteristiche stanno già in `docs/konzept.md` (`Charakter:`). Altrimenti chiedi delle caratteristiche, non dei colori preferiti: proponi coppie di opposti tra cui scegliere, adatte al sito: tradizionale o sportivo, villaggio di montagna o città, calmo o vivace, elegante o alla mano, per gli ospiti o per i membri. In più una domanda: quali tre parole devono pensare i visitatori dopo dieci secondi? Ognuna delle tre direzioni mette in risalto altre di queste caratteristiche. I colori ne derivano, insieme al logo e all'ambiente, mai il contrario.
2. **Modelli:** guarda i due o tre siti della ricerca o del piano. Cosa fanno bene? Cosa non riprendiamo (il loro logo, i colori, il carattere)?
3. **Diagnosi** (per un sito esistente): Perché l'aspetto di oggi non regge? Tipico: tutti i titoli alla stessa voce, due stili uno accanto all'altro, un colore con più significati, spaziature che cambiano.
4. **Tre direzioni chiaramente diverse**, non solo tre colori. Si distinguono per idea, carattere, ruolo del colore, forme e profondità. Esempio: «Morbida» (calda, rotonda), «Chiara» (calma come un giornale), «Decisa» (superfici di colore, titoli grandi).
5. Ogni direzione mostra **le stesse pagine** con testi veri: nel piano di volo il mockup, per un sito esistente due o tre pagine (iniziale, sottopagina più importante, contatto). Il testo segnaposto falsa il giudizio.
6. Uguale in tutte le direzioni: logo, testi obbligatori, un pulsante principale per pagina, accessibilità.

## Non sembrare fatto dall'IA

I siti fatti con l'IA si riconoscono dagli stessi tratti. Controlla ogni direzione e il sito finito con questa lista e annota il risultato (nel piano di volo in `docs/designsystem.md`, altrimenti in `docs/gestaltung/richtungen.md`, riga `Tratti dell'IA controllati: …`):

- Sfumature in viola e blu, effetti luminosi e di vetro.
- Emoji come icone.
- Inter o un altro carattere standard dappertutto, tutti i titoli alla stessa voce.
- Testata centrata: titolo, frase e pulsante al centro di una superficie colorata o davanti a una macchia di colore, con uno o due pulsanti.
- Schede della stessa grandezza una accanto all'altra o una sotto l'altra, non importa se con icona, arrotondate o squadrate. È il tratto dell'IA più frequente: ordina il contenuto secondo la sua importanza, non in caselle uguali.
- Aspetto da immagini di repertorio: persone sorridenti al portatile, montagne di chissà dove.
- Frasi fatte: «Benvenuti sul nostro sito», «Scopri», «Il vostro partner per», «con passione», «innovativo», «senza intoppi».
- Numeri, recensioni, citazioni o loghi di clienti inventati. Promesse di tempo come «in 60 secondi».
- Ombre grigie, due tipi di profondità uno accanto all'altro (ombra qui, bordo là), set di icone mescolati.
- Più di sei sezioni sulla pagina iniziale.

Controlla lo schema, non la formulazione: un pulsante invece di due o schede una sotto l'altra invece che affiancate sono lo stesso tratto. Per questo guardi le pagine o le foto, non solo il codice.

Invece: un unico segno distintivo, usato con parsimonia (una linea sotto una parola del titolo, un evidenziatore per al massimo una parola per sezione), foto vere del luogo e delle persone, un carattere tipografico con personalità, adatto alle caratteristiche, colori dal logo e dall'ambiente, una struttura che nasce dal contenuto (se gli appuntamenti sono la cosa principale, stanno in alto) e frasi concrete con nomi, numeri e luoghi. Nel codice trovi sfumature e caratteri standard con `grep -rnE "linear-gradient|radial-gradient|Inter" design src`. Emoji e frasi fatte le cerchi nei testi, il resto con gli occhi.

## La mazzetta dei colori (token)

Un file `tokens.css` con variabili CSS: colori per chiaro e scuro, caratteri, dimensioni dei caratteri, spaziature, arrotondamenti e ombre. Nel piano di volo sta in `design/tokens.css`, per un sito costruito in `web/src/styles/tokens.css`. Per ogni blocco una frase di commento sul perché. Regole:

- Un colore d'azione per tutto ciò che si può cliccare, e da nessun'altra parte.
- Calcola il contrasto, non stimarlo: testo almeno 4,5 : 1, pulsanti e bordi almeno 3 : 1 (formula nello skill `barrierefreiheit`). I colori in esadecimale (`#1d1b18`), il contrasto come commento sulla stessa riga, sempre con il colore di fronte: `/* 16,0 : 1 su --hell-grund */`. Così si può ricalcolare; `entwurf-pruefen.mjs` (skill `entwurf`) lo fa per ogni commento.
- Ogni colore compare una volta sola, in una tavolozza chiara e una scura. Le pagine usano solo nomi come `--farbe-text`; la modalità scura scambia solo questa corrispondenza (`@media (prefers-color-scheme: dark)`). I nomi dei token restano in tedesco, come nell'esempio.
- Fuori da `tokens.css` nel codice non c'è nessun colore, nessun carattere, nessuna dimensione di carattere, nessuna spaziatura, nessun arrotondamento e nessuna ombra scritti a mano. Le larghezze degli schermi in `@media` possono essere numeri.
- **Caratteri:** al massimo due famiglie, un carattere per i titoli con personalità e un carattere tranquillo per il testo, con licenza libera (per esempio SIL Open Font License) e ospitati in proprio (woff2, `font-display: swap`; nel piano di volo in `design/schriften/`, fonte e licenza come commento). Mai caricati da server di altri: tradirebbe i visitatori a terzi. Testo da 16 a 17 px con interlinea 1,5, niente sotto i 12 px. Titoli grandi con interlinea da 1,0 a 1,1 e un po' più stretti (da −0,01 a −0,03 em), sul telefonino più piccoli con `clamp()`. Grassetto (700) solo per i titoli più grandi, altrimenti semigrassetto (600). Prezzi e orari con `font-variant-numeric: tabular-nums`.
- **Spaziature** solo da una serie: 4, 8, 12, 16, 24, 32, 48 px (più grandi per le sezioni). Contenuto largo al massimo circa 1200 px, sul telefonino 16 px di margine. Sul computer testata e sezioni usano questa larghezza, stretto resta solo il testo corrente (circa 70 caratteri per riga).
- **Arrotondamenti:** tre livelli secondo la grandezza (campo, scheda, superficie grande), dentro sempre più piccoli che fuori. I pulsanti o tutti arrotondati o tutti squadrati.
- **Profondità:** un solo metodo per tutto il sito, o superficie con ombra o linea sottile senza ombra. Ombre tinte del colore del testo, mai grigie, al massimo due livelli. Lo sfondo è leggermente caldo, le schede sono bianche.
- **Movimento:** pressione da 90 a 100 ms, cambio da 160 a 200 ms, un movimento per evento. Con «Riduci movimento» solo dissolvenze.
- **Focus:** da 2 a 3 px nel colore d'azione con 2 px di distanza, su ogni sfondo almeno 3 : 1.
- **Il colore d'errore** solo per errori e cose urgenti.

Così comincia un `tokens.css` (i contrasti di questi colori sono ricalcolati):

```css
/* Mazzetta dei colori di <nome>: l'unica fonte per colori, caratteri, dimensioni, spaziature, arrotondamenti e ombre. */
:root {
  /* Tavolozza: ogni colore una volta, con il contrasto (testo almeno 4,5 : 1, pulsanti e bordi 3 : 1) */
  --hell-grund: #faf7f2;      /* leggermente caldo */
  --hell-text: #1d1b18;       /* 16,0 : 1 su --hell-grund */
  --hell-aktion: #0b5c8c;     /* 6,7 : 1 su --hell-grund, solo per ciò che si clicca */
  --hell-auf-aktion: #ffffff; /* 7,1 : 1 su --hell-aktion */
  --hell-rand: #8a8378;       /* 3,5 : 1 su --hell-grund */
  --dunkel-grund: #171614;
  --dunkel-text: #f1ece4;     /* 15,3 : 1 su --dunkel-grund */
  --dunkel-aktion: #7cc4f0;   /* 9,4 : 1 su --dunkel-grund */

  /* Ciò che usano le pagine; la modalità scura scambia solo queste righe */
  --farbe-grund: var(--hell-grund);
  --farbe-text: var(--hell-text);
  --farbe-aktion: var(--hell-aktion);

  /* Caratteri, dimensioni, spaziature, arrotondamenti, ombre */
  --schrift-titel: "<carattere dei titoli>", Georgia, serif;
  --groesse-text: 1.0625rem;  /* 17 px */
  --abstand-4: 16px;
  --rund-klein: 6px;
  --schatten-1: 0 1px 2px rgb(29 27 24 / 0.08);
}
@media (prefers-color-scheme: dark) {
  :root { --farbe-grund: var(--dunkel-grund); --farbe-text: var(--dunkel-text); --farbe-aktion: var(--dunkel-aktion); }
}
```

## Elementi grafici: chiedi sempre

Quando la direzione è decisa, chiedi sempre: «Vuoi aggiungere anche degli elementi grafici?» Presenta le possibilità con il lavoro che richiedono. Ciò che nel piano di volo è già deciso (`Bildsprache:` e `Maskottchen:` in `docs/konzept.md`) non lo richiedi, ci costruisci sopra.

- **Icone:** un unico set uniforme (per esempio Lucide o Phosphor), mai emoji e mai due set mescolati.
- **Illustrazioni:** poche, nello stesso stile, per i punti vuoti e le spiegazioni.
- **Foto proprie:** una lista di cosa deve fotografare la persona (il luogo, persone in azione, dettagli), nel piano di volo in `docs/inhalte.md`. Le foto vere battono qualsiasi immagine generata.
- **Una mascotte:** una figura che accompagna attraverso il sito. Prima un foglio con quattro-sei pose della stessa figura, una per ogni momento (benvenuto, ricerca, successo, vuoto), poi le regole su quando compare: mai con errori, disdette o momenti delicati, mai accanto a foto di persone, mai dietro liste o moduli. Grandezza: per il benvenuto al massimo metà della larghezza, altrimenti piccola. È decorazione (`alt=""`), la frase accanto regge anche senza di lei. I clip animati si caricano solo quando sono visibili, durano al massimo 5 secondi e poi si fermano (WCAG 2.2.2). Ogni immagine la guardi tu stesso, anche ingrandita. Senza credito le pose restano schizzi fino all'approvazione del sito (P10).
- **3D:** un oggetto o la figura come modello 3D, solo nella testata della pagina iniziale e solo dalla larghezza di un tablet in su. Prima c'è un'immagine ferma, il 3D si carica solo quando la testata è visibile. Sul telefonino, senza scheda grafica o con «Riduci movimento» resta l'immagine ferma.

**Sobrio non vuol dire senza immagini.** Se la persona non vuole icone, illustrazioni o figure, proponi comunque una foto vera per la testata della pagina iniziale (il luogo, persone in azione) e le dai la lista delle foto. Una foto è contenuto, non decorazione. Se non ne ha ancora, la testata porta la cosa più importante del contenuto invece di una superficie colorata con il titolo (per esempio il prossimo appuntamento in grande), e la lista delle foto sta sotto «Aperto» (nel piano di volo in `docs/inhalte.md`, altrimenti in `docs/gestaltung/richtungen.md`). Se non vuole nemmeno foto, lì c'è la sua frase.

Quello che sceglie la persona va nel sistema di design (nel piano di volo `docs/designsystem.md`, altrimenti `docs/gestaltung/richtungen.md`) e nella mazzetta dei colori (dimensioni, spaziature, regole).

**Con Albatros** immagini, figure scontornate e modelli 3D nascono con gli strumenti di Albatros, pagati dal credito della persona (prezzo di costo più 35 %):

- `bild_erzeugen` con `beschreibung` e `format` (`quadrat`, `quer`, `hoch` o `breit`), `bild_freistellen` con `bild_url` (un'immagine con sfondo trasparente), `modell_3d` con `bild_url` (un modello 3D in formato GLB, meglio se da un'immagine scontornata).
- `guthaben` mostra il saldo, i prezzi e il link per ricaricare. I prezzi li dici solo da questa risposta.
- Prima della prima chiamata che costa qualcosa chiami `guthaben`, dici il prezzo e chiedi una volta: «Un'immagine costa CHF …, il tuo credito basta per … Procedo?» Dopo, a ogni chiamata dici in breve costo e resto, senza chiedere di nuovo. Se il credito non basta, passi il link per ricaricare.
- Ogni risultato lo salvi subito nel progetto (nel piano di volo `curl -o design/bilder/<nome>.png <url>`, per un sito costruito in `web/public/bilder/`), perché dopo 7 giorni sparisce. Per una variante cambi la descrizione: la stessa descrizione per 15 minuti restituisce la stessa immagine, senza nuovi costi.
- Ogni immagine generata la guardi tu stesso prima di mostrarla alla persona. Sul sito va solo quello che ha scelto lei.
- Se uno strumento risponde «kommt bald» (arriva presto), vai avanti senza strumenti per immagini (vedi sotto).

**Con un account Hugging Face proprio** si può fare anche così, come alternativa. La persona crea l'account da sola e accede da sola. Tu colleghi il server ufficiale: `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. Con Codex è `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, con Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, con Cursor la voce `"huggingface": { "url": "https://huggingface.co/mcp?login" }` sotto `mcpServers` in `~/.cursor/mcp.json`. Gli Spaces per immagini, scontorno e 3D li sceglie lei su huggingface.co/settings/mcp. Gratis ci sono 5 minuti di calcolo al giorno. Senza accesso il server offre solo la ricerca nell'Hub.

**Diritti:** Ogni modello ha una licenza: leggila sulla pagina del modello prima che un'immagine vada sul sito. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) e TRELLIS (MIT) permettono anche l'uso commerciale, FLUX.1 dev solo quello non commerciale. Le immagini generate non mostrano persone reali né loghi di altri. Luoghi e persone reali vengono da foto proprie, con il consenso.

**Senza strumenti per immagini** il percorso è lo stesso: icone da un set libero, foto proprie, illustrazioni da una raccolta libera con una licenza chiara, una mascotte disegnata o più tardi, niente 3D.

## Rifare un sito esistente

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
- **Menu sul telefonino:** a 390 px sta su una riga, altrimenti diventa un pulsante «Menu» che apre la lista (senza JavaScript con `<details>`). Una voce di menu da sola su una seconda riga è un errore.

### 3. Tre direzioni

Secondo la sezione «Tre direzioni», con due o tre pagine del sito esistente. `docs/gestaltung/richtungen.md`: in alto la riga `Entscheid: <direzione o combinazione> (<data>)` (la parola `Entscheid:` resta in tedesco), sotto la diagnosi e per ogni direzione una tabella (idea, carattere, colori, forme, punto di forza, rischio), in più la riga `Tratti dell'IA controllati: …`. Le bozze come file HTML in `docs/gestaltung/entwuerfe/`, così la persona può aprirle nel browser.

### 4. La mazzetta dei colori

Secondo la sezione «La mazzetta dei colori (token)», in `web/src/styles/tokens.css`. Con la domanda sugli elementi grafici (sezione «Elementi grafici»).

### 5. Rifacimento

Contenuti e percorsi restano. Prima la base (integrare i token, parti comuni, una pagina modello), poi le altre pagine. Se nella mazzetta dei colori manca un valore, lo aggiungi lì, non nel codice della pagina. Se il sito è già online, mostri prima le pagine cambiate come bozza e chiedi il via libera per costruire (skill `entwurf`), poi vale lo skill `webseite-aendern`.

### 6. Foto e approvazione

Fotografa ogni pagina, in larghezza telefonino e in larghezza desktop, chiara e scura. Se il sito non è ancora in rete, usi l'indirizzo dell'anteprima (`http://localhost:4321`):

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Guarda tu stesso ogni foto e confrontala con la bozza: sul telefonino il testo ha spazio a sinistra e a destra? Niente è tagliato o spostato? Il menu sta su una riga? Il computer non sembra vuoto, con una colonna stretta al centro? Solo dopo mostrala alla persona. Dopo il suo sì: diario di bordo (skill `git-logbuch`), nastro trasportatore (skill `pipeline`).

## Trappole

- Aspetto prima dell'uso o prima della struttura: fissa gli errori.
- Tre direzioni che si distinguono solo per il colore: nessuna vera scelta.
- Colori scritti a mano nel codice o nella tavola dei campioni: così la modalità scura si rompe, e la tavola mostra altro rispetto alle pagine.
- Contrasti stimati invece che ricalcolati.
- La tavola dei campioni mostrata solo sul computer: l'intestazione con menu sul telefonino ne fa parte.
- Dire «finito» senza aver guardato tu stesso le pagine o le foto.

## Verifica la missione

`mission_pruefen` con `webseite-04-gestaltung`. La verifica guarda se il progetto è almeno al passo «Bozze» sull'isola; nel piano di volo lo annunci solo quando la persona ha visto la tavola dei campioni.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «prima le fondamenta, poi la facciata», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo; nel piano di volo è P7, tutto il sito come bozza da sfogliare cliccando (skill `entwurf`).
