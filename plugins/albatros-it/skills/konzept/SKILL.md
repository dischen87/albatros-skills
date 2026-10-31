---
name: konzept
description: "Chiarisce con una persona senza conoscenze tecniche, dopo il piano confermato, il carattere del suo sito prima di scegliere i colori (piano di volo P5): nome verso l'esterno, nucleo in tre frasi, tono (tu o Lei), tre parole per l'effetto, ciò che deve restare, linguaggio visivo e sempre la domanda se ne fa parte un personaggio (mascotte): sì, no o più tardi. Sul percorso attività prima con il metodo marke. Immagini del personaggio solo dopo aver indicato il prezzo e ricevuto un sì. Il risultato è docs/konzept.md. Usa questo skill dopo webseite-planen (piano confermato) e con «concetto», «marchio», «carattere», «tono», «mascotte», «personaggio», «che effetto deve fare il mio sito»."
metadata:
  stand: 0.2.0
  quelle: '02a20c500e11'
---

# Concetto: il carattere prima dei colori

## L'immagine

Prima di ricevere il colore, una casa ha un carattere: una fattoria accogliente, un appartamento chiaro in città, una casa di vacanza giocosa. Chi sceglie prima i colori finisce per dipingere una casa che nessuno voleva così. Per questo stabilisci prima con la persona come si chiama il suo sito, come suona e che effetto deve fare. Colori, caratteri e forme nascono da lì, nel passo successivo (skill `gestaltung`).

**Come usare l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande, anche se vuole subito parlare di colori.

## Nel piano di volo

Fase P5 «Concetto di design e di marketing». Tocca a questa fase dopo il piano confermato: `docs/plan.md` ha la riga `Bestätigt:` (P4, skill `webseite-planen`). Se manca, dillo onestamente e vai prima lì (sezione «Verificare il piano»): si dà forma solo a un piano confermato. Dopo viene P6, il sistema di design con la tavola dei campioni (skill `gestaltung`).

- **Risultato:** `docs/konzept.md` con le righe `Name:`, `Kern:`, `Ton:`, `Charakter:`, `Maskottchen:`, `Muss bleiben:` e `Bildsprache:` (modello al passo 6). I nomi delle righe restano in tedesco, perché `lage` li legge; il contenuto è in italiano.
- **Fatto quando** ci sono tutte e sette le righe e `Maskottchen:` comincia con `ja`, `nein` o `später`. Allora annunci il passo `konzept` sull'isola.
- **Percorso attività:** Prima viene il metodo `marke`. Prendilo con lo strumento `methode` (nome `marke`) e seguilo: verifica con la persona il nome (Swissreg, registro di commercio, dominio, prova a voce) e riempie `docs/konzept.md` con le stesse sette righe; il ragionamento va in `docs/marke.md`. Dopo riprendi il suo risultato: leggi `docs/konzept.md`, chiedi solo ciò che manca (spesso la risposta sul personaggio) e continua con le sezioni «Il personaggio» e «L'isola». Se è il percorso attività lo dice `lage` (nomina il metodo `marke`); nel progetto lo riconosci da `docs/zielgruppe.md` o `docs/angebot.md` di P2. Se `methode` non fornisce niente, fai qui tutti i passi e dici onestamente che la verifica approfondita del nome fa parte del metodo.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Del tu, frasi brevi, niente gergo tecnico. Ciò che la persona ha già detto (in `docs/projekt.md`, nel piano o nella conversazione) non lo richiedi: glielo rileggi e lo inserisci.
- Al massimo due domande per messaggio. A cinque domande risponde solo la persona: nome, tono, carattere, personaggio e ciò che deve restare. Nucleo e linguaggio visivo li proponi tu e li inserisci come `[Ipotesi: …]`; la persona conferma tutte le ipotesi in un unico messaggio.
- Ciò che la persona non ha detto compare come `[aperto: …]`, mai come una tua invenzione.
- Il gusto lo decide la persona. Tu aiuti con coppie di opposti ed esempi, non con i colori preferiti.
- Le immagini fatte con gli strumenti di immagini di Albatros costano credito: prima il prezzo, poi solo dopo il suo sì (sezione «Il personaggio»).

## Modo

Leggi la riga `Modus:` in `docs/projekt.md`; se manca, vale `machen` (fare).

- **machen (fare):** Fai tu il lavoro e spieghi ogni passo in una frase con la sua immagine. Le cinque domande alla persona le fai comunque. Il momento di apprendimento lo offri senza insistere: «Il carattere prima dei colori. Vuoi vedere perché lo stesso colore fa un effetto del tutto diverso per una panetteria e per un'avvocata?»
- **lernen (imparare):** Spieghi ogni passo con l'immagine e il perché. Le tre parole del carattere le trova la persona; tu aiuti solo con coppie di opposti. Alla fine fai la domanda di controllo della lezione `flugschule-14-konzept`: «Perché stabilisci il carattere del tuo sito prima dei colori?» Solo dopo la sua risposta chiami `verstanden_melden` con `mission: flugschule-14-konzept` e `art: kontrollfrage`. Se lo strumento manca, si continua senza.

## Procedura

### 1. Leggere ciò che c'è già

Leggi `docs/projekt.md` (nome del progetto, per chi, cosa principale), `docs/recherche.md` (modelli, cosa riprendere, cosa evitare) e `docs/plan.md` (pagine, funzioni). Se `docs/konzept.md` esiste già (per esempio grazie al metodo `marke`), la completi.

### 2. Nome e tono

Chiedi in un unico messaggio:

- «Il nome del progetto resta, o verso l'esterno il progetto deve chiamarsi in un altro modo?» Perché: il nome compare su ogni pagina e più tardi nell'indirizzo.
- «Tu o Lei, e come deve suonare la lingua?» Perché: il tono trasforma i testi in una voce. Aiuta con una frase in due toni, per esempio «Passa a trovarci, il caffè è già caldo» e «Saremo lieti della Sua visita».

Se il progetto deve chiamarsi in un altro modo, proponi da tre a cinque nomi e la persona sceglie. Una breve ricerca sul web mostra se il nome esiste già; lo strumento `domain_suchen` mostra se un indirizzo adatto è libero (solo cercare, comprare viene molto più tardi). La verifica approfondita nel registro dei marchi e nel registro di commercio fa parte del metodo `marke`.

### 3. Carattere e ciò che deve restare

- «Quali tre parole descrivono l'effetto che deve fare?» Perché: le direzioni nascono dal carattere, non dai colori preferiti. Aiuta con coppie di opposti adatte al progetto: tradizionale o sportivo, villaggio di montagna o città, calmo o vivace, raffinato o semplice, giocoso o sobrio. E con la domanda: che cosa devono pensare i visitatori dopo dieci secondi?
- «Ci sono un logo, un colore aziendale o un carattere che devono restare?» Perché: ciò che deve restare è la cornice per tutte le direzioni. Se non c'è niente, si scrive «niente».

I colori preferiti vanno sotto `Muss bleiben:` solo se devono davvero restare. Altrimenti li annoti sotto la riga come desiderio; in P6 si vedrà se si adattano al carattere.

### 4. Il personaggio: sì, no o più tardi

Questa domanda la fai sempre, anche se la persona non ne parla, in un messaggio a sé:

«Ci deve essere un personaggio che guida attraverso il tuo sito? Sì, no o più tardi.»

Con il motivo in una frase: un personaggio rende un sito inconfondibile, ma va curato in ogni immagine. Non proponi una risposta, decide la persona. Finché non risponde, in `docs/konzept.md` c'è `Maskottchen: [aperto: domanda fatta il <GG.MM.AAAA>]`.

Con «sì» si continua con la sezione «Il personaggio». Con «no» o «più tardi» basta la riga. «Più tardi» vuol dire: il sito funziona senza personaggio, e la domanda torna dopo la messa online.

### 5. Nucleo e linguaggio visivo come proposta

Da ciò che la persona ha detto proponi entrambi e li inserisci come `[Ipotesi: …]`:

- **Nucleo** in tre frasi: per chi? Che cosa prometti (un risultato, non un aggettivo)? Perché proprio tu (con una prova)? Il nucleo è il metro per ogni testo e ogni immagine.
- **Linguaggio visivo:** foto, illustrazioni, icone o un misto. Un sito senza immagini sembra un modello già pronto. Foto vere del luogo e delle persone battono qualsiasi immagine generata. Se ci sono foto, scrivi subito una breve lista di foto in `docs/inhalte.md` (sezione «Lista delle foto»: che cosa, dove, chi c'è sopra): le foto richiedono tempo, così la persona può già cominciare.

Poi in un unico messaggio: «Ho proposto nucleo e linguaggio visivo così: … Va bene, o cambiamo qualcosa?» Dopo la sua risposta le parentesi spariscono.

### 6. docs/konzept.md

Ogni riga comincia a inizio riga con il suo nome in tedesco, senza grassetto, e resta breve (al massimo 300 caratteri), perché `lage` legge queste righe. I dettagli vanno sotto.

```markdown
# Concetto: <nome>
Stand: <GG.MM.AAAA>

Name: <nome verso l'esterno>
Kern: Per <chi>: <promessa>. Perché noi: <prova>.
Ton: <tu o Lei>; <tre qualità, come suona>
Charakter: <tre parole>
Maskottchen: <ja, nein o später>
Muss bleiben: <logo, colore aziendale, carattere, o niente>
Bildsprache: <foto, illustrazioni, icone o un misto>

## Tono
| Siamo | Così sì | Così no |
|---|---|---|
| … | «…» | «…» |

## Personaggio
Solo con «Maskottchen: ja», vedi la sezione «Il personaggio».
```

Dopo `Maskottchen:` viene prima una delle tre parole tedesche `ja` (sì), `nein` (no) o `später` (più tardi), con «sì» seguita da una breve descrizione del personaggio: `Maskottchen: ja – Lina, una civetta curiosa`.

Alla fine leggi il file alla persona e chiedi: «Riconosci il tuo progetto qui dentro?»

## Il personaggio

Con «sì» descrivete prima il personaggio a parole, sotto `## Personaggio` in `docs/konzept.md`:

- Che tipo di personaggio (animale, oggetto, persona), il suo nome, tre qualità, in sintonia con il carattere del sito.
- Dove appare: per esempio al benvenuto, a un successo, su una pagina vuota.
- Dove mai: con errori, disdette e momenti delicati, accanto a foto di persone, dietro liste o moduli.

Un'immagine del personaggio è facoltativa e costa credito. Prima della prima immagine chiami lo strumento `guthaben`, dici il prezzo della sua risposta e chiedi una sola volta: «Un'immagine costa CHF …, il tuo credito basta per … Faccio una prima immagine del personaggio?» Solo dopo il suo sì chiami `bild_erzeugen`; `bild_freistellen` e `modell_3d` allo stesso modo, solo dopo prezzo e sì. Ogni immagine la guardi tu prima di mostrarla e la salvi subito nel progetto (`curl -o design/figur/<nome>.png <url>`), perché dopo 7 giorni non c'è più.

Se il credito non basta, o la persona non vuole (ancora) un'immagine, il personaggio resta uno schizzo fino all'approvazione del sito (P10): un disegno semplice in grigio, che disegni come `design/figur/skizze.svg`, o una foto del suo disegno su carta. Basta per la tavola dei campioni e per la bozza. Le pose del personaggio (benvenuto, ricerca, successo, vuoto) nascono in P6 (skill `gestaltung`, sezione «Elementi grafici»).

## L'isola

Quando tutto è in `docs/konzept.md` e `Maskottchen:` comincia con `ja`, `nein` o `später`, chiami lo strumento `schritt_melden` con `schritt: konzept` e `sprache: it`. `projekt` lo lasci fuori, a meno che la persona lavori a un altro progetto che sta solo sul suo computer; allora dai il suo nome breve. Dille in una frase che la sua casa è cresciuta sull'isola. Se lo strumento risponde «Ungültige Angaben» (dati non validi), controlla una volta la scrittura; se Albatros non conosce ancora il passo, si continua senza isola, `docs/konzept.md` ne è la prova. Dopo chiami di nuovo `lage` (skill `lotse`).

## Trappole

- **Prima i colori:** allora il sito piace alla persona, ma non dice niente ai visitatori. I colori vengono in P6, dal carattere.
- **Dimenticare la domanda sul personaggio:** si perde facilmente ed è obbligatoria, perché un personaggio segna poi ogni immagine.
- **Spacciare ipotesi per risposte:** nome, tono, carattere, personaggio e ciò che deve restare li dice la persona.
- **Immagini senza prezzo:** ogni strumento di immagini solo dopo prezzo e sì.
- **Un tono che non regge:** il sito con il tu, la mail con il Lei sembrano due negozi diversi.

## Verifica la missione

`mission_pruefen` con `flugschule-14-konzept`, sul percorso attività anche con `geschaeft-04-marke`. La verifica guarda se il progetto è almeno al passo «Concetto» sull'isola.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «il carattere prima dei colori», che ripete l'essenziale. Poi: che cosa è fatto, dove si trova il risultato (`docs/konzept.md`), che cosa resta aperto (spesso la risposta sul personaggio o una foto) e che cosa viene dopo: il sistema di design con la tavola dei campioni in P6 (skill `gestaltung`).
