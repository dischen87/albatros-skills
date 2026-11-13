---
name: blog
description: "Imposta con una persona senza conoscenze preliminari un blog sul suo sito Astro e scrive articoli con lei: ogni articolo è un file Markdown nel diario di bordo (web/src/content/blog/<slug>.md con title, date, description, bild), la persona racconta l’idea, Bert scrive il file, lei lo legge nell’anteprima e clicca su pubblica in Albatros. Con un modello per i consigli alle famiglie (per chi, cosa, quando e meteo, viaggio, costi, il mio consiglio, link) e regole per le proprie foto. Usa lo skill per «blog», «articolo del blog», «nuovo articolo», «scrivere un articolo», «pubblicare un consiglio», «scrivere un’idea per una gita», «novità sul mio sito»."
metadata:
  stand: 0.3.2
  quelle: '1d602af4dfb6'
---

# Blog: il raccoglitore delle schede delle gite

## L'immagine

Sullo scaffale c’è un raccoglitore. Ogni gita è una scheda, sempre etichettata allo stesso modo in alto: titolo, data, una frase sull’argomento. Le schede nuove vanno davanti, quelle vecchie restano. Il sito legge il raccoglitore e mostra bene ogni scheda.

**Come usare l'immagine:** dilla alla persona in una frase nella tua prima risposta.

## Come parli

- Dai del tu, frasi brevi, passi numerati, al massimo due domande per messaggio.
- Spieghi il **Markdown** così: un testo semplice in cui `**grassetto**` diventa grassetto. Alla persona non serve sapere di più.

## Dove stanno gli articoli

Ogni articolo è un file nel diario di bordo: `web/src/content/blog/<slug>.md`. Lo `<slug>` è il titolo in minuscolo con trattini, per esempio `parco-avventura-bambini`; diventa l’indirizzo `/blog/parco-avventura-bambini/`. È il livello più semplice dello skill `cms` (testi nel progetto): niente CMS, niente banca dati, Bert scrive i file. Se più tardi altri devono scrivere senza Bert, lo skill `cms` mostra il passo successivo.

## 1. Impostare il blog una volta

Il blog è una parte del sito come le altre. Se il sito è ancora in progettazione, entra nella lista di costruzione (skill `webseite-planen`) e si costruisce con lo skill `webseite-bauen`. Se il sito è già online, è una modifica grande (skill `webseite-aendern`). Si costruisce così (Astro 7, misurato il 13.11.2026 con 7.4.11):

1. `web/src/content.config.ts` descrive l’intestazione di ogni articolo:
   ```ts
   import { defineCollection } from 'astro:content';
   import { glob } from 'astro/loaders';
   import { z } from 'astro/zod';

   const blog = defineCollection({
     loader: glob({ pattern: '*.md', base: './src/content/blog' }),
     schema: ({ image }) => z.object({
       title: z.string(),
       date: z.coerce.date(),
       description: z.string().max(160),
       bild: image().optional(),
       bildtext: z.string().optional(),
       widget: z.string().optional(),
     }),
   });

   export const collections = { blog };
   ```
2. `web/src/pages/blog/index.astro` mostra tutti gli articoli, i più recenti prima (`getCollection('blog')`, ordinati per `date`).
3. `web/src/pages/blog/[slug].astro` mostra un articolo nell’impaginazione del sito:
   ```astro
   ---
   import { getCollection, render } from 'astro:content';
   import { Image } from 'astro:assets';
   import SwissActivities from '../../components/SwissActivities.astro';
   export async function getStaticPaths() {
     return (await getCollection('blog')).map((b) => ({ params: { slug: b.id }, props: { b } }));
   }
   const { b } = Astro.props;
   const { Content } = await render(b);
   ---
   <article>
     <h1>{b.data.title}</h1>
     {b.data.bild && <Image src={b.data.bild} alt={b.data.bildtext ?? ''} width={1200} />}
     <Content />
     {b.data.widget && <SwissActivities widgetId={b.data.widget} />}
   </article>
   ```
   La riga con `SwissActivities` c’è solo se il sito mostra offerte di SwissActivities (skill `swissactivities`).
4. L’aspetto solo con i valori di `design/tokens.css` e i componenti del sito.

## 2. Scrivere un articolo

1. **La persona racconta l’idea:** dove siete stati, con chi, cosa avete vissuto? Se ha foto, le mette nella chat o nella cartella del progetto.
2. **Bert prende i fatti.** Per una gita con lo skill `swissactivities`: età, meteo, prezzo con data, viaggio, link. Niente a memoria.
3. **Bert scrive il file** secondo il modello qui sotto. Ciò che la persona ha vissuto lo scrive con le sue parole. Se manca qualcosa, chiede invece di inventare.
4. **La persona legge nell’anteprima.** Bert la avvia con `vorschau_starten` (senza il programma: `cd web && npm run dev`). Lei dice cosa deve cambiare; Bert lo modifica.
5. **Bert verifica** con `node scripts/pruefen.mjs` e fa una voce nel diario di bordo: `git add web && git commit -m "Blog: <titolo>"`.
6. **La persona clicca sul pulsante di pubblicazione in Albatros.** Bert non fa `git push`. Senza il programma vale lo skill `webseite-aendern` (approvazione, poi push).
7. **Poi condividere:** i post per Instagram e gli altri Bert li scrive come messaggi in bozza (skill `kanaele`).

## Modello: consiglio per famiglie

```markdown
---
title: "Parco avventura con i bambini: il nostro sabato"
date: 2026-11-14
description: "Una frase sull’argomento. La mostrano Google e l’anteprima quando si condivide."
bild: ../../assets/blog/parco-avventura.jpg
bildtext: "Due bambini nel parco avventura, visti da dietro"
widget: ""
---

**Per chi:** da … anni secondo l’offerente. I nostri bambini avevano … e … anni.

**Cosa:** …

**Quando e meteo:** dentro o fuori, con la pioggia …

**Viaggio:** da … in treno circa … minuti, … cambi (stato al <GG.MM.AAAA>).

**Costi:** CHF … per … il <data>, verificato il <GG.MM.AAAA>.

**Il mio consiglio:** … (solo ciò che la persona ha vissuto)

**Link:** [Vedi l’offerta](<booking_url esattamente come fornito>)
```

I nomi dei campi nell’intestazione (`title`, `date`, `bild` …) restano come sono; il testo è nella lingua del sito. I campi vuoti si tolgono: `widget` solo con un ID di widget, `bild` solo con una foto.

## 3. Foto

1. **Solo foto proprie** o quelle per cui la persona ha il permesso. Mai immagini da Internet.
2. **Bambini:** meglio da dietro o senza volto. Persone riconoscibili solo con il loro consenso, per i bambini con quello dei genitori (skill `recht-ch`).
3. **Dove:** `web/src/assets/blog/`, un nome senza spazi. Astro rimpicciolisce l’immagine durante la costruzione.
4. **Testo dell’immagine:** `bildtext` dice in una frase cosa si vede. Un lettore di schermo lo legge ad alta voce.

## Trappole

- Un’esperienza che nessuno ha fatto: il sito vive di consigli veri. Meglio più corto e vero.
- Prezzi senza data: invecchiano. Sempre con «verificato il».
- Data scritta male nell’intestazione (`14.11.2026` invece di `2026-11-14`): la costruzione si ferma. Bert la scrive come nel modello.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «il raccoglitore delle schede delle gite» che ridice l'essenziale. Poi: cosa è fatto, dove si trova l’articolo, cosa resta aperto e cosa viene dopo.
