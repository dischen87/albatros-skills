---
name: webseite-planen
description: "Pianifica con una persona senza conoscenze tecniche il suo sito web, prima di costruirlo: per chi è, cosa devono fare i visitatori, quali pagine servono, quali contenuti ci sono già, quali modelli le piacciono. Il risultato è una pianta in docs/plan.md. Usa lo skill con «voglio un sito web», «pianificare un sito web», «cosa mi serve per un sito web», «quali pagine mi servono», «sitemap», «da dove comincio», e sempre prima di costruire la prima pagina sul percorso sito web."
---

# Pianificare il sito web: la pianta

## L'immagine

Nessuno costruisce una casa senza prima disegnarne la pianta. La pianta mostra quali stanze ci sono, come si passa dall'una all'altra e dov'è la porta d'ingresso. In un sito web le stanze sono le pagine, i corridoi sono i menu e i link, e la porta d'ingresso è la pagina iniziale.

Basta una pianta su un foglio di carta. Più tardi risparmia molti lavori di ristrutturazione.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, domande brevi, una domanda per messaggio. Riprendi le risposte alla lettera: la persona deve riconoscere il suo piano. Niente gergo tecnico: «pagine» invece di «sitemap», «menu» invece di «navigazione».

## Procedura: sette domande

1. **Di cosa si tratta?** In una frase, come lo racconteresti a una vicina di casa.
2. **Per chi?** Chi deve trovare il sito? Il più concreto possibile: «genitori del quartiere che cercano una mensa per il pranzo» invece di «tutti».
3. **Cosa devono fare i visitatori?** Esattamente una cosa principale: telefonare, inviare un modulo, iscriversi, passare in negozio, comprare. Tutto sul sito porta lì.
4. **Quali pagine servono?** All'inizio al massimo cinque. Un inizio collaudato:
   - Pagina iniziale: chi, cosa, per chi, e il pulsante per la cosa principale
   - Offerta oppure «Cosa facciamo»
   - Chi siamo oppure chi sono
   - Contatto
   - Impressum e protezione dei dati (obbligatori, vedi lo skill `recht-ch`)
5. **Cosa c'è già?** Testi, foto, logo, prezzi, orari d'apertura. Quello che manca va sulla lista per lo skill `inhalte`.
6. **Quali modelli?** Due o tre siti web che piacciono alla persona, e cosa esattamente le piace (colori, calma, foto, quanto sono brevi i testi). Più tardi aiuta con lo skill `gestaltung`.
7. **Da cosa capisci che il sito funziona?** Un numero che la persona vuole tenere d'occhio, per esempio le richieste al mese. Più tardi serve allo skill `statistik`.

## La pianta

Scrivi le risposte con la persona in `docs/plan.md` nel progetto:

```markdown
# Plan für <Name der Seite>

**In einem Satz:** …
**Für wen:** …
**Hauptsache für Besucher:** … (Knopf: «…»)
**Woran wir Erfolg merken:** …

## Seiten
- Start: …
- …

## Inhalte
| Was | Haben wir | Fehlt noch |
|---|---|---|

## Vorbilder
- <Adresse>: gefällt uns, weil …
```

Alla fine leggi il piano alla persona e chiedi: «È giusto così?» Solo dopo va nel diario di bordo (skill `git-logbuch`) e con il nastro trasportatore sul server.

## Cosa risparmi alla persona

- **Troppo tutto in una volta:** Blog, negozio online, area per i membri e tre lingue sono cose per dopo. Prima un sito che fa bene la cosa principale.
- **Decisioni tecniche troppo presto:** Per cominciare basta il modello nel repo. Un sistema per i contenuti (skill `cms`) arriva solo quando qualcuno senza conoscenze tecniche deve cambiare regolarmente i contenuti.
- **Logo e colori per primi:** L'aspetto viene dopo i contenuti. Una bella pagina vuota non aiuta nessuno.

## Verifica la missione

`mission_pruefen` con `webseite-01-webseite-planen`. La verifica controlla se `docs/plan.md` si trova nel progetto (con Pilot in `~/projekt` sul server, con Light nel porto).

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la pianta», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
