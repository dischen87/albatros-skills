---
name: seo-grundlagen
description: 'Macht eine kleine Webseite für Suchmaschinen gut auffindbar, erklärt für Menschen ohne Vorwissen mit dem Bild von Wegweiser und Stadtplan. Seitentitel und Beschreibung, eine Hauptüberschrift, sprechende Adressen, Bildbeschreibungen, Ladezeit, sitemap.xml, robots.txt, strukturierte Daten für lokale Geschäfte, Google Search Console und Unternehmensprofil. Nutze den Skill bei «SEO», «bei Google gefunden werden», «Google findet meine Seite nicht», «Suchmaschine», «Sitemap», «Meta-Beschreibung», «lokal gefunden werden», «Google Maps Eintrag».'
---

# SEO-Grundlagen: Wegweiser und Stadtplan

## Das Bild

Eine Suchmaschine ist ein Stadtplan, den ein fleissiger Bote jeden Tag nachzeichnet. Er läuft durch die Strassen, liest die Schilder und trägt ein, was er findet. Damit dein Laden auf dem Plan steht, braucht es:

- **ein klares Schild über der Tür** (Seitentitel und Hauptüberschrift),
- **Wegweiser** von anderen Orten zu dir (Links),
- **einen Lageplan**, den du dem Boten in die Hand drückst (`sitemap.xml`),
- **eine Hausordnung** für den Boten: wo er hindarf (`robots.txt`).

Das Fachwort für all das ist **SEO** (Suchmaschinen-Optimierung). Am meisten zählt aber, dass die Seite die Frage der Suchenden gut beantwortet.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form. Keine Wunder versprechen: Gefunden werden braucht Wochen, nicht Stunden. Keine Tricks (versteckter Text, gekaufte Links), die schaden mehr, als sie nützen.

## Ablauf

### 1. Wonach suchen die Leute?

Mit der Person fünf Sätze aufschreiben, die ihre Zielgruppe bei Google eintippen würde («Mittagstisch Wipkingen», «Velo reparieren Bern Länggasse»). Pro Seite ein Hauptsatz. Kommt in `docs/plan.md`.

### 2. Jede Seite: das Schild über der Tür

- **Seitentitel** (`<title>`): Was + Ort oder Nutzen + Name, etwa 50 bis 60 Zeichen. Jede Seite einen eigenen.
- **Beschreibung** (`<meta name="description">`): ein, zwei Sätze, die zum Klicken einladen, etwa 150 Zeichen. Steht oft unter dem Titel im Suchergebnis.
- **Genau eine Hauptüberschrift** (`<h1>`) pro Seite, darunter Zwischentitel.
- **Sprechende Adressen:** `/angebot/mittagstisch` statt `/seite?id=7`.
- **Bildbeschreibungen** (`alt`), siehe Skill `barrierefreiheit`.
- **Sprache:** `<html lang="de-CH">`.
- **Eine Hauptadresse:** Die Seite ist entweder mit oder ohne `www` erreichbar, die andere Variante leitet weiter. `<link rel="canonical">` zeigt auf die Hauptadresse.

### 3. Lageplan und Hausordnung

- `public/sitemap.xml`: alle öffentlichen Seiten mit voller Adresse. Viele Werkzeuge erzeugen sie beim Bauen automatisch, sonst von Hand.
- `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://<domain>/sitemap.xml
  ```

### 4. Schnell und gut am Handy

Bilder verkleinern (Skill `inhalte`), nur nötige Schriften und Skripte laden. Prüfen in Chrome mit Lighthouse (Rechtsklick, «Untersuchen», «Lighthouse», Kategorie «SEO» und «Leistung»).

### 5. Für lokale Geschäfte

- Adresse, Telefon und Öffnungszeiten als Text auf der Seite (nicht nur im Bild), überall gleich geschrieben.
- Strukturierte Daten: ein kleiner Block `application/ld+json` vom Typ `LocalBusiness` mit Name, Adresse, Telefon, Öffnungszeiten. Er hilft der Suchmaschine, die Angaben richtig zu lesen.
- Unternehmensprofil bei Google (früher «Google My Business»): Die Person legt es selbst an und bestätigt es. Gleiche Angaben wie auf der Webseite.

### 6. Dem Boten Bescheid geben

Mit eigener Domain (Skill `domain`): Die Person meldet die Seite in der Google Search Console an. Den Besitz bestätigt sie mit einem TXT-Eintrag im Telefonbuch, genau wie bei Albatros. Dann die Sitemap dort einreichen. Für Bing gibt es die Bing Webmaster Tools.

### 7. Wegweiser sammeln

Echte Links von passenden Orten: Verzeichnis des Quartiers oder Verbands, Partner, lokale Medien, Vereine. Keine gekauften Links.

## Mission prüfen

Logbuch und Fliessband (Skills `git-logbuch`, `pipeline`), dann `mission_pruefen` mit `webseite-09-seo-grundlagen`. Die Prüfung schaut, ob `https://{name}.aufwind.sh/sitemap.xml` und `/robots.txt` antworten.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Wegweiser und Stadtplan», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
