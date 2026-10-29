---
name: seo-grundlagen
description: "Rende un piccolo sito web facile da trovare per i motori di ricerca, spiegato a persone senza conoscenze tecniche con l'immagine dei cartelli stradali e della pianta della città. Titolo e descrizione della pagina, un solo titolo principale, indirizzi parlanti, descrizioni delle immagini, tempo di caricamento, sitemap.xml, robots.txt, dati strutturati per attività locali, Google Search Console e profilo dell'attività. Usa lo skill con «SEO», «farsi trovare su Google», «Google non trova il mio sito», «motore di ricerca», «sitemap», «meta description», «farsi trovare in zona», «comparire su Google Maps»."
---

# Basi SEO: cartelli stradali e pianta della città

## L'immagine

Un motore di ricerca è una pianta della città che un messaggero diligente ridisegna ogni giorno. Cammina per le strade, legge le insegne e annota quello che trova. Perché il tuo negozio sia sulla pianta, servono:

- **un'insegna chiara sopra la porta** (titolo della pagina e titolo principale),
- **cartelli stradali** da altri luoghi verso di te (link),
- **una piantina** che metti in mano al messaggero (`sitemap.xml`),
- **un regolamento della casa** per il messaggero: dove può andare (`robots.txt`).

La parola tecnica per tutto questo è **SEO** (ottimizzazione per i motori di ricerca). Ma conta soprattutto che il sito risponda bene alla domanda di chi cerca.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu. Non promettere miracoli: farsi trovare richiede settimane, non ore. Niente trucchi (testo nascosto, link comprati): fanno più danni che altro.

## Procedura

### 1. Cosa cercano le persone?

Scrivi con la persona cinque frasi che il suo pubblico digiterebbe su Google («mensa pranzo scolari Molino Nuovo», «riparare bici Bellinzona centro»). Per ogni pagina una frase principale. Va in `docs/plan.md`.

### 2. Ogni pagina: l'insegna sopra la porta

- **Titolo della pagina** (`<title>`): cosa + luogo o vantaggio + nome, circa da 50 a 60 caratteri. Ogni pagina il suo.
- **Descrizione** (`<meta name="description">`): una o due frasi che invitano a cliccare, circa 150 caratteri. Spesso compare sotto il titolo nei risultati di ricerca.
- **Esattamente un titolo principale** (`<h1>`) per pagina, sotto i sottotitoli.
- **Indirizzi parlanti:** `/offerta/mensa` invece di `/pagina?id=7`.
- **Descrizioni delle immagini** (`alt`), vedi lo skill `barrierefreiheit`.
- **Lingua:** `<html lang="it-CH">`.
- **Un solo indirizzo principale:** il sito è raggiungibile o con o senza `www`, l'altra variante reindirizza. `<link rel="canonical">` punta all'indirizzo principale.

### 3. Piantina e regolamento della casa

- `public/sitemap.xml`: tutte le pagine pubbliche con l'indirizzo completo. Molti strumenti la generano automaticamente durante la costruzione, altrimenti a mano.
- `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://<domain>/sitemap.xml
  ```

### 4. Veloce e comodo sul telefonino

Riduci le immagini (skill `inhalte`), carica solo i caratteri e gli script necessari. Verifica in Chrome con Lighthouse (clic destro, «Ispeziona», «Lighthouse», categorie «SEO» e «Prestazioni»).

### 5. Per le attività locali

- Indirizzo, telefono e orari d'apertura come testo sul sito (non solo in un'immagine), scritti ovunque allo stesso modo.
- Dati strutturati: un piccolo blocco `application/ld+json` del tipo `LocalBusiness` con nome, indirizzo, telefono, orari d'apertura. Aiuta il motore di ricerca a leggere bene i dati.
- Profilo dell'attività su Google (prima «Google My Business»): la persona lo crea e lo conferma lei stessa. Gli stessi dati del sito web.

### 6. Avvisare il messaggero

Con un dominio proprio (skill `domain`): la persona registra il sito nella Google Search Console. Conferma di esserne la proprietaria con una voce TXT nell'elenco telefonico, proprio come con Albatros. Poi lì invia la sitemap. Per Bing ci sono i Bing Webmaster Tools.

### 7. Raccogliere cartelli stradali

Link veri da luoghi adatti: elenco del quartiere o dell'associazione di categoria, partner, media locali, società e associazioni. Niente link comprati.

## Verifica la missione

Diario di bordo e nastro trasportatore (skill `git-logbuch`, `pipeline`), poi `mission_pruefen` con `webseite-09-seo-grundlagen`. La verifica controlla se `https://{name}.aufwind.sh/sitemap.xml` e `/robots.txt` rispondono.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «cartelli stradali e pianta della città», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
