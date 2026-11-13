---
name: blog
description: 'Richtet mit einer Person ohne Vorwissen einen Blog auf ihrer Astro-Seite ein und schreibt mit ihr Beiträge: jeder Beitrag eine Markdown-Datei im Logbuch (web/src/content/blog/<slug>.md mit title, date, description, bild), die Person erzählt die Idee, Bert schreibt die Datei, sie liest in der Vorschau und klickt in Albatros auf «Veröffentlichen». Mit Vorlage für Familien-Empfehlungen (Für wen, Was, Wann und Wetter, Anreise, Kosten, Mein Tipp, Link) und Regeln für eigene Fotos. Nutze den Skill bei «Blog», «Blogbeitrag», «neuer Beitrag», «Artikel schreiben», «Empfehlung veröffentlichen», «Ausflugstipp aufschreiben», «News auf meiner Seite».'
metadata:
  stand: 0.3.3
---

# Blog: der Ordner mit den Ausflugsblättern

## Das Bild

Im Regal steht ein Ordner. Jeder Ausflug ist ein Blatt darin, oben immer gleich beschriftet: Titel, Datum, ein Satz, worum es geht. Neue Blätter kommen vorne dazu, alte bleiben. Die Webseite liest den Ordner und zeigt jedes Blatt schön an.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, in einem Satz.

## So sprichst du

- Du-Form, kurze Sätze, nummerierte Schritte, höchstens zwei Fragen in einer Nachricht.
- **Markdown** erklärst du so: ein einfacher Text, in dem `**fett**` fett wird. Mehr muss die Person nicht wissen.

## Wo die Beiträge liegen

Jeder Beitrag ist eine Datei im Logbuch: `web/src/content/blog/<slug>.md`. Der `<slug>` ist der Titel in kleinen Buchstaben mit Bindestrichen, zum Beispiel `seilpark-mit-kindern`; er wird die Adresse `/blog/seilpark-mit-kindern/`. Das ist die einfachste Stufe aus dem Skill `cms` (Texte im Projekt): kein CMS, keine Datenbank, Bert schreibt die Dateien. Wollen später andere ohne Bert schreiben, zeigt der Skill `cms` den nächsten Schritt.

**Vor den zwei Ja** (Plan bestätigt, Entwurf freigegeben; `naechstes` sagt `bauen_erlaubt: false`) baust du nichts an der Seite. Einen Beitrag schreibst du dann als Entwurf nach `docs/beitraege/<slug>.md`, mit demselben Kopf (title, date, description). Nach den zwei Ja ziehst du ihn nach `web/src/content/blog/`. Albatros prüft beide Orte gleich.

## 1. Den Blog einmal einrichten

Der Blog ist ein Teil der Seite wie jeder andere. Ist die Seite noch in Planung, steht er in der Bauliste (Skill `webseite-planen`) und wird mit dem Skill `webseite-bauen` gebaut. Ist sie schon im Netz, ist er eine grosse Änderung (Skill `webseite-aendern`). Gebaut wird er so (Astro 7, gemessen am 13.11.2026 mit 7.4.11):

1. `web/src/content.config.ts` beschreibt den Kopf jedes Beitrags:
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
2. `web/src/pages/blog/index.astro` zeigt alle Beiträge, die neusten zuerst (`getCollection('blog')`, sortiert nach `date`).
3. `web/src/pages/blog/[slug].astro` zeigt einen Beitrag im Layout der Seite:
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
   Die Zeile mit `SwissActivities` gibt es nur, wenn die Seite Angebote von SwissActivities zeigt (Skill `swissactivities`).
4. Aussehen nur mit den Werten aus `design/tokens.css` und den Komponenten der Seite.

## 2. Einen Beitrag schreiben

1. **Die Person erzählt die Idee:** Wo wart ihr, mit wem, was habt ihr erlebt? Hat sie Fotos, legt sie sie in den Chat oder in den Projektordner.
2. **Bert holt die Fakten.** Bei einem Ausflug mit dem Skill `swissactivities`: Alter, Wetter, Preis mit Datum, Anreise, Link. Nichts aus dem Gedächtnis.
3. **Bert schreibt die Datei** nach der Vorlage unten. Was die Person erlebt hat, schreibt er in ihren Worten. Fehlt etwas, fragt er nach, statt es zu erfinden.
4. **Die Person liest in der Vorschau.** Bert startet sie mit `vorschau_starten` (ohne das Programm: `cd web && npm run dev`). Sie sagt, was anders sein soll; Bert ändert es.
5. **Bert prüft** mit `node scripts/pruefen.mjs` und macht einen Eintrag ins Logbuch: `git add web && git commit -m "Blog: <Titel>"`.
6. **Die Person klickt in Albatros auf «Veröffentlichen».** Bert macht kein `git push`. Ohne das Programm gilt der Skill `webseite-aendern` (Freigabe, dann Push).
7. **Danach teilen:** Beiträge für Instagram und Co. schreibt Bert als Entwürfe (Skill `kanaele`).

## Vorlage: Familien-Empfehlung

```markdown
---
title: "Seilpark mit Kindern: unser Samstag"
date: 2026-11-14
description: "Ein Satz, worum es geht. Ihn zeigen Google und die Vorschau beim Teilen."
bild: ../../assets/blog/seilpark.jpg
bildtext: "Zwei Kinder im Seilpark, von hinten"
widget: ""
---

**Für wen:** ab … Jahren laut Anbieter. Unsere Kinder waren … und … Jahre alt.

**Was:** …

**Wann und Wetter:** drinnen oder draussen, bei Regen …

**Anreise:** ab … mit dem Zug etwa … Minuten, … Mal umsteigen (Stand <TT.MM.JJJJ>).

**Kosten:** CHF … für … am <Datum>, geprüft am <TT.MM.JJJJ>.

**Mein Tipp:** … (nur, was die Person selbst erlebt hat)

**Link:** [Angebot ansehen](<booking_url genau wie geliefert>)
```

Leere Felder bleiben weg: `widget` nur mit einer Widget-ID, `bild` nur mit einem Foto.

## 3. Fotos

1. **Nur eigene Fotos** oder solche, für die die Person die Erlaubnis hat. Bilder aus dem Netz nie.
2. **Kinder:** am besten von hinten oder ohne Gesicht. Erkennbare Menschen nur mit ihrem Einverständnis, bei Kindern mit dem der Eltern (Skill `recht-ch`).
3. **Ablage:** `web/src/assets/blog/`, ein Name ohne Leerzeichen. Astro verkleinert das Bild beim Bauen.
4. **Bildtext:** `bildtext` sagt in einem Satz, was zu sehen ist. Das liest ein Screenreader vor.

## Stolpersteine

- Ein Erlebnis, das niemand hatte: Die Seite lebt von echten Tipps. Lieber kürzer und wahr.
- Preise ohne Datum: Sie veralten. Immer mit «geprüft am».
- Datum im Kopf falsch geschrieben (`14.11.2026` statt `2026-11-14`): Der Bau bricht ab. Bert schreibt es so wie in der Vorlage.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «der Ordner mit den Ausflugsblättern», der den Kern noch einmal sagt. Danach: was geschafft ist, wo der Beitrag liegt, was noch offen ist und was als Nächstes kommt.
