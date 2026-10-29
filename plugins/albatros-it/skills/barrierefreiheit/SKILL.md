---
name: barrierefreiheit
description: "Controlla e migliora l'accessibilità di un piccolo sito web con una persona senza conoscenze tecniche, secondo le WCAG 2.2 AA spiegate con parole semplici: contrasto, dimensione del testo e zoom, descrizioni delle immagini, uso con la tastiera, moduli, lettura ad alta voce, movimento. Il risultato è un protocollo di controllo in docs/barrierefreiheit.md. Usa lo skill con «accessibilità», «accessibile», «senza barriere», «accessibility», «a11y», «WCAG», «contrasto», «testo alternativo», «alt text», «screen reader», «leggibile per le persone anziane», «usare con la tastiera»."
---

# Accessibilità: la rampa accanto alla scala

## L'immagine

Una casa con una scala davanti alla porta va bene per molti. Per chi è in sedia a rotelle, con un passeggino o con una valigia pesante è un muro. Una rampa accanto alla scala aiuta queste persone, e anche tutti gli altri la prendono volentieri.

Nei siti web le rampe sono: abbastanza contrasto, descrizioni per le immagini, uso senza mouse, moduli con etichette chiare. Ne approfitta ogni persona che guarda il telefonino al sole, che ha dimenticato gli occhiali o che ha fretta.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Abbreviazioni e nomi di strumenti solo con mezza frase di spiegazione: WCAG (la lista di controllo riconosciuta a livello internazionale per siti web accessibili), Lighthouse (uno strumento di controllo integrato in Chrome). Altrimenti lasciali fuori.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, senza sigle tecniche. Il «contrasto» lo spieghi con una scritta grigio chiaro su carta bianca.
- Ogni punto ha bisogno di una prova: pagina e punto.
- Gli strumenti automatici trovano solo una parte. Dillo onestamente e fai i controlli a mano con la persona.

## Procedura

### 1. Primo controllo automatico

La persona apre il suo sito in Chrome, clic destro, «Ispeziona», scheda «Lighthouse», sceglie solo «Accessibilità», «Analizza caricamento pagina». Oppure controlli tu nel terminale:

```bash
npx pa11y https://{name}.aufwind.sh
```

Le segnalazioni vanno nel protocollo come osservazioni. Quello che gli strumenti non vedono: se l'ordine ha senso, se i testi sono comprensibili, dove si arriva dopo un clic.

### 2. Controllare a mano

**Vedere**
- Calcola il contrasto: testo almeno 4,5 : 1, titoli grandi, pulsanti, bordi dei campi di inserimento e simboli almeno 3 : 1. Chiaro e scuro separati.
  - Formula: linearizza ogni canale di colore (da 0 a 1): `c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`. Luminanza `L = 0.2126 R + 0.7152 G + 0.0722 B`. Contrasto `(L_hell + 0.05) / (L_dunkel + 0.05)`. Controllo: bianco su nero dà 21.
- Il colore non è mai l'unico segno distintivo: errori con simbolo e testo, voce di menu attiva anche sottolineata o in grassetto.
- Zoom al 200 %: niente viene tagliato, nessuno scorrimento laterale. Larghezze di controllo 320, 375, 768 e 1440 pixel.

**Usare**
- Solo con la tastiera: `Tab` avanti, `Shift+Tab` indietro, `Enter` clicca. Si arriva dappertutto? Si vede sempre dove si è (cornice del focus)? `Escape` chiude una finestra aperta?
- Superfici da cliccare sul telefonino abbastanza grandi: circa un polpastrello, almeno 44 × 44 pixel.
- I link sono link, i pulsanti sono pulsanti. I testi dei link dicono dove portano («Vedi i prezzi», non «qui»).

**Leggere ad alta voce**
- Ogni immagine con un contenuto ha una descrizione (`alt="…"`) che dice cosa si deve vedere. La pura decorazione riceve `alt=""`.
- I pulsanti con solo un simbolo (cuore, lente, menu) hanno un nome (`aria-label="Cerca"`).
- Titoli in un ordine sensato: esattamente un `h1`, sotto `h2`, `h3`.
- Lingua della pagina impostata: `<html lang="it-CH">`.
- Ascoltare tu stesso sul Mac: `Cmd+F5` accende e spegne VoiceOver.

**Moduli**
- Un'etichetta visibile sopra ogni campo, non solo un segnaposto grigio nel campo.
- Campi obbligatori riconoscibili. Tipo di campo giusto (`type="email"`, `type="tel"`), così il telefonino mostra la tastiera adatta.
- Errori direttamente accanto al campo, comprensibili, con la via per risolverli. In caso di errore i dati inseriti restano.

**Movimento**
- Chi nelle impostazioni di sistema ha scelto «Riduci movimento» vede immagini ferme: `@media (prefers-reduced-motion: reduce)`.
- Quello che si muove da solo si ferma al più tardi dopo 5 secondi oppure si può fermare.
- I video hanno i sottotitoli.

### 3. Protocollo e riparazione

`docs/barrierefreiheit.md`:

```markdown
# Accessibilità: protocollo di verifica (<data>)

| Punto | Risultato | Prova (pagina, punto) | Riparazione |
|---|---|---|---|
| Contrasto del testo | soddisfatto / non soddisfatto / non pertinente | … | … |

## Contrasti
| Coppia di colori | Valore | basta per |
|---|---|---|
```

Poi ripara, prima i punti critici (tutto quello che esclude del tutto una persona). Dopo controlla di nuovo e aggiorna il protocollo. Diario di bordo (skill `git-logbuch`), nastro trasportatore (skill `pipeline`).

## Buono a sapersi

- In Svizzera la legge sui disabili (LDis) obbliga soprattutto le autorità e i servizi pubblici. Per i siti privati non è un obbligo, ma un vantaggio: arrivano più persone e i motori di ricerca capiscono meglio il sito. Se la persona vende anche nell'UE, può valere lo European Accessibility Act. Questa non è una consulenza legale.
- Il test con persone vere porta più di tutto, anche con persone anziane.

## Verifica la missione

`mission_pruefen` con `webseite-06-barrierefreiheit`. La verifica controlla se `docs/barrierefreiheit.md` si trova nel progetto (con Pilot in `~/projekt` sul server, con Light nel porto).

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la rampa accanto alla scala», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
