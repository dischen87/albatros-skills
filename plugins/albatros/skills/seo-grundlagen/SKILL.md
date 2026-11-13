---
name: seo-grundlagen
description: 'Macht eine kleine Webseite sichtbar: für Suchmaschinen (SEO) und für KI-Assistenten (GEO), erklärt für Menschen ohne Vorwissen mit dem Bild von Wegweiser und Stadtplan. Seitentitel und Beschreibung, eine Hauptüberschrift, kanonische Adresse, Bildbeschreibungen, sitemap.xml, robots.txt, strukturierte Daten je Art des Geschäfts, Vorschau beim Teilen, llms.txt, Fakten und Fragen mit Antworten, Google Search Console, Bing Webmaster Tools, IndexNow und Unternehmensprofil; geprüft mit sichtbar-pruefen.mjs an der gebauten Seite. Nutze den Skill bei «SEO», «GEO», «sichtbar werden», «bei Google gefunden werden», «Google findet meine Seite nicht», «in ChatGPT gefunden werden», «KI-Suche», «Suchmaschine», «Sitemap», «Meta-Beschreibung», «Search Console», «Bing», «IndexNow», «llms.txt», «lokal gefunden werden», «Google Maps Eintrag».'
metadata:
  stand: 0.3.3
---

# SEO-Grundlagen: Wegweiser und Stadtplan

## Das Bild

Eine Suchmaschine ist ein Stadtplan, den ein fleissiger Bote jeden Tag nachzeichnet. Er läuft durch die Strassen, liest die Schilder und trägt ein, was er findet. Damit dein Laden auf dem Plan steht, braucht es:

- **ein klares Schild über der Tür** (Seitentitel und Hauptüberschrift),
- **Wegweiser** von anderen Orten zu dir (Links),
- **einen Lageplan**, den du dem Boten in die Hand drückst (`sitemap.xml`),
- **eine Hausordnung** für den Boten: wo er hindarf (`robots.txt`).

Heute fragen viele nicht mehr den Stadtplan, sondern eine Auskunft: einen KI-Assistenten, der die Antwort gleich selbst sagt. Die Auskunft empfiehlt nur, was sie sicher weiss. Sie braucht klare Fakten über deinen Laden, die überall gleich stehen.

Die Fachwörter dafür sind **SEO** (gefunden werden in Suchmaschinen) und **GEO** (genannt werden in KI-Antworten). Am meisten zählt für beide, dass die Seite die Frage der Suchenden gut beantwortet.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form. Keine Wunder versprechen: Gefunden werden braucht Wochen, nicht Stunden, und niemand kann einen Platz in einer Suche oder in einer KI-Antwort zusagen. Keine Tricks (versteckter Text, gekaufte Links, Texte nur für Maschinen), die schaden mehr, als sie nützen.
- **Nichts erfinden:** keine Bewertungen, Sterne, Kundenzahlen, Auszeichnungen oder Zitate, die es nicht gibt. Jede Zahl auf der Seite kommt von der Person oder aus einer Quelle, die du selbst geöffnet hast, und steht mit ihr da.
- **Konten gehören der Person:** Bei Google und Microsoft meldet sie sich selbst an, in ihrem Browser. Du gibst nie Zugangsdaten ein, auch nicht, wenn sie sie dir nennt, und du bestätigst nichts in ihrem Namen: Auf «Bestätigen» klickt sie. Du bereitest vor, was auf der Seite liegen muss, und sagst ihr jeden Klick.

## Wann was drankommt

- **Beim Bauen** (Skill `webseite-bauen`), auf dem Computer der Person: alles, was in der Seite steht, Schritte 1 bis 6. Das Skript `sichtbar-pruefen.mjs` prüft es an der gebauten Seite.
- **Nach dem Livegang** (Skill `lancieren`), mit der echten Adresse: Search Console, Bing Webmaster Tools, IndexNow und das Unternehmensprofil, Schritte 7 bis 10. Am einfachsten mit eigener Domain (Skill `domain`).
- **Mit dem Programm Albatros** (Skill `lotse`, Abschnitt «Berts Arbeitsplatz») zeigt die Etappe «Sichtbar werden» dieselben zwölf Punkte wie das Skript, in Alltagsworten («Bei Google gefunden werden»). Ruf zu Beginn und nach jedem Schritt `naechstes` auf: Es nennt, wie viele Punkte dort noch fehlen, und bringt, worum die Person in Albatros bittet. Nennt ihre Nachricht Punkte der Prüfung, kümmerst du dich um genau diese und änderst nur, was dafür nötig ist.

## Ablauf

### 1. Wonach suchen und fragen die Leute?

Mit der Person fünf Sätze aufschreiben, die ihre Zielgruppe bei Google eintippen würde («Mittagstisch Wipkingen», «Velo reparieren Bern Länggasse»), und fünf Fragen, die sie einer KI stellen würde («Wo kann ich in der Länggasse mein Velo flicken lassen, und was kostet ein Service?»). Pro Seite ein Hauptsatz. Kommt in `docs/recherche.md` in die Zeile `Suchbegriffe:`; steht dort schon etwas aus der Research (P2), baust du darauf auf.

### 2. Jede Seite: das Schild über der Tür

- **Seitentitel** (`<title>`): Was + Ort oder Nutzen + Name, etwa 50 bis 60 Zeichen. Jede Seite einen eigenen. (Punkt «titel»)
- **Beschreibung** (`<meta name="description">`): ein, zwei Sätze, die zum Klicken einladen, etwa 150 Zeichen, auf jeder Seite eine andere. Steht oft unter dem Titel im Suchergebnis. (Punkt «beschreibung»)
- **Genau eine Hauptüberschrift** (`<h1>`) pro Seite, darunter Zwischentitel. (Punkt «h1»)
- **Sprechende Adressen:** `/angebot/mittagstisch` statt `/seite?id=7`.
- **Bilder:** jedes mit Beschreibung (`alt`, bei reinem Schmuck `alt=""`), mit `width` und `height`, unter 500 KB (Skills `barrierefreiheit` und `inhalte`). (Punkt «bilder»)
- **Sprache:** `<html lang="de-CH">`.
- **Eine Hauptadresse:** Die Seite ist entweder mit oder ohne `www` erreichbar, die andere Variante leitet weiter. Jede Seite nennt mit `<link rel="canonical" href="https://…">` ihre eine, volle Adresse. Mit Astro steht die Hauptadresse als `site` in `web/astro.config.mjs` (die Adresse aus `docs/lancieren.md`, Zeile `Adresse:`), und das Layout schreibt `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)}>`. (Punkt «kanonisch»)
- **Interne Links:** Jede Seite ist von mindestens einer anderen aus verlinkt, mit einem Linktext, der sagt, wohin es geht.
- **Vorschau beim Teilen** (Open Graph): `og:title`, `og:description`, `og:image` (volle Adresse, ein eigenes Bild, etwa 1200 × 630 px) und `og:url` auf jeder Seite. So zeigt ein geteilter Link Bild und Text statt einer nackten Adresse. (Punkt «open_graph»)

### 3. Lageplan und Hausordnung

- **`web/public/sitemap.xml`:** alle öffentlichen Seiten mit voller Adresse (`https://…`), je Seite ein `<url><loc>…</loc></url>`. Für die fünf bis sieben Seiten des ersten Flugs schreibst du sie von Hand und führst sie mit jeder neuen Seite nach; das Skript in Schritt 6 meldet, wenn eine Seite fehlt oder eine zu viel drinsteht. Google liest daraus nur die Adressen und, wenn es stimmt, das Datum der letzten Änderung; `priority` und `changefreq` beachtet es nicht. Ab vielen Seiten erzeugt sie die Integration von Astro (`npx astro add sitemap`, braucht `site`); dann heisst die Datei `sitemap-index.xml`, und das Skript liest auch sie. Die Mission unten prüft `sitemap.xml`, darum bleibt es für den ersten Flug bei der Datei von Hand. (Punkt «sitemap»)
- **`web/public/robots.txt`:** (Punkt «robots»)
  ```
  User-agent: *
  Allow: /

  Sitemap: https://<domain>/sitemap.xml
  ```
  Die Zeile `Sitemap:` braucht die volle Adresse. Über sie finden auch Suchmaschinen den Lageplan, bei denen niemand ihn eingereicht hat.
- **KI-Boten:** Wer in KI-Antworten vorkommen will, sperrt ihre Boten nicht aus. Ob die Texte der Seite auch zum Trainieren von KI-Modellen gelesen werden dürfen, entscheidet die Person; du fragst sie und trägst es ein. Einzelne Boten sperrt man mit einem eigenen Block (`User-agent: GPTBot`, darunter `Disallow: /`), bei Google steuert `Google-Extended` nur das Training, nicht die Suche.

### 4. Strukturierte Daten: die Angaben zum Geschäft, maschinenlesbar

Ein Block `application/ld+json` (JSON-LD, Vokabular schema.org) im Kopf der Startseite sagt Suchmaschinen und KI-Assistenten ohne Raten, wer das ist. Die Art (`@type`) richtet sich nach dem Geschäft, so genau wie möglich: (Punkt «strukturierte_daten»)

| Was die Person hat | `@type` | Was hineingehört |
|---|---|---|
| Laden, Praxis, Studio, Werkstatt, Restaurant mit Adresse | `LocalBusiness` oder genauer (`Restaurant`, `BikeStore`, `HairSalon`, `Dentist` …) | `name`, `address` (beides verlangt Google), dazu `telephone`, `url`, `openingHoursSpecification`, `geo` |
| Verein, Firma ohne Laden, Projekt | `Organization` (Verein auch `SportsOrganization`, `NGO` …) | `name`, `url`, `logo`, Kontakt |
| Eine Person (freischaffend, Künstlerin) | `Person` | `name`, `jobTitle`, `url` |
| Kurse und Anlässe mit Datum | `Event`, je Anlass ein Block | `name`, `startDate`, `location` |
| Produkte mit Preis | `Product` mit `offers` | `name`, `image`, Preis und Währung |

Regeln: Im Block steht nur, was auch sichtbar auf der Seite steht, mit denselben Worten und Zahlen. Keine Sterne und Bewertungen zum eigenen Geschäft (`aggregateRating`, `review`): Google zeigt sie bei `LocalBusiness` und `Organization` nicht, wenn das Geschäft sie selbst verwaltet, und erfundene sind verboten. Kein `[Annahme: …]` und kein `[Platzhalter: …]` im Block. Prüfen kann die Person ihn nach dem Livegang mit dem «Rich Results Test» von Google.

### 5. Für KI-Antworten: Fakten, die man zitieren kann

Ein KI-Assistent nennt eine Seite, wenn er darin eine klare, belegte Antwort findet. Dafür braucht es keine Tricks und laut Google auch keine besonderen Dateien: Was für die Suche gut ist, ist es auch für die KI-Antworten von Google. Was darüber hinaus hilft:

- **Ein Fakten-Abschnitt** auf der Startseite oder unter «Über uns»: wer, was, für wen, wo, wann offen, was es kostet, wie man anfragt. In ganzen Sätzen, die für sich allein stimmen («Die Velowerkstatt Länggasse repariert Velos aller Marken, meist bis am nächsten Tag»), nicht nur in Bildern oder Tabellen.
- **Fragen und Antworten:** die fünf Fragen aus Schritt 1, je mit einer Antwort in zwei, drei Sätzen, sichtbar auf der Seite. Nur Fragen, die wirklich gestellt werden; die Antworten bestätigt die Person.
- **Quellen:** Jede Zahl und jede Behauptung hat einen Beleg: eine eigene Angabe mit Datum («Stand November 2026») oder ein Link zur Quelle. Was sich nicht belegen lässt, fällt weg.
- **Überall dieselben Angaben:** Name, Adresse, Telefon und Öffnungszeiten stehen auf der Seite, in den strukturierten Daten, im Unternehmensprofil und in Verzeichnissen Zeichen für Zeichen gleich.
- **`web/public/llms.txt`:** eine kurze Übersicht für KI-Assistenten, in Markdown: zuerst `# <Name>`, dann eine Zusammenfassung als Zitat (`> …`), dann unter `## Seiten` die wichtigsten Seiten als Links mit einem Halbsatz. Nur geprüfte Fakten, nichts, was nicht auch auf der Seite steht. Ehrlich dazu: Das ist ein Vorschlag (llmstxt.org), kein Standard; Google sagt, es brauche keine solche Datei, und ob andere Assistenten sie lesen, ist nicht gesichert. Sie kostet fünf Minuten und schadet nicht. (Punkt «llms_txt»)

  ```markdown
  # Velowerkstatt Länggasse

  > Veloreparaturen in der Länggasse in Bern, meist bis am nächsten Tag. Offen Dienstag bis Samstag.

  ## Seiten

  - [Angebot](https://<domain>/angebot/): Service und Reparaturen mit Preisen
  - [Kontakt](https://<domain>/kontakt/): Adresse, Öffnungszeiten, Telefon
  ```

### 6. Schnell und leicht, dann prüfen

Bilder verkleinern (Skill `inhalte`), nur nötige Schriften und Skripte laden: je Seite höchstens 1 MB mit allem, was sie fest einbindet. (Punkt «gewicht»)

Dann prüft das Skript in diesem Skill die gebaute Seite, ohne Netz und ohne etwas zu ändern:

```bash
mkdir -p scripts && cp <Ordner dieses Skills>/sichtbar-pruefen.mjs scripts/
# Ordner unbekannt: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/seo-grundlagen/sichtbar-pruefen.mjs -o scripts/sichtbar-pruefen.mjs
(cd web && npm run build) && node scripts/sichtbar-pruefen.mjs        # die gebaute Seite in seite/ (sonst dist/)
node scripts/sichtbar-pruefen.mjs --json                               # dasselbe als JSON, mit den zwölf Namen
```

Es meldet zwölf Punkte mit Ampel, mit festen Namen (in jeder Sprache gleich): «titel», «beschreibung», «h1», «bilder», «sitemap», «robots», «kanonisch», «strukturierte_daten», «open_graph», «llms_txt», «gewicht» und «indexnow». Rot heisst: Das verhindert oder verfälscht das Finden; beheben, neu bauen, nochmals prüfen. Gelb heisst: empfohlen. Was das Skript nicht sehen kann, sagst du der Person ehrlich: ob die Fakten stimmen, ob andere auf sie verlinken, und alles, was nur in ihren Konten geht. Dazu in Chrome Lighthouse (Rechtsklick, «Untersuchen», «Lighthouse», Kategorien «SEO» und «Leistung»); beim Bauen misst das schon `pruefen.mjs` (Skill `webseite-bauen`).

### 7. Google Search Console: dem Boten Bescheid geben

Nach dem Livegang. Die Search Console ist das Fenster, durch das die Person sieht, was Google von ihrer Seite weiss. So geht es (geprüft am 10.11.2026 an der Hilfe von Google):

1. Die Person öffnet search.google.com/search-console, meldet sich mit ihrem Google-Konto an und fügt ihre Seite hinzu. Es gibt zwei Arten: **Domain** (alles unter der Domain, geht nur mit einem Eintrag im Telefonbuch der Domain, dem DNS) und **URL-Präfix** (genau eine Adresse wie `https://www.<domain>/`, geht auch mit einer Datei).
2. **Inhaberschaft per Datei** (URL-Präfix): Google gibt ihr eine kleine Datei zum Herunterladen. Sie legt sie dir in den Projektordner, du legst sie unverändert nach `web/public/` (Name und Inhalt bleiben, wie sie sind), dann geht die Seite mit dieser Datei neu ins Netz (Skill `webseite-aendern`: Freigabe der Person, dann erst der Push). Du prüfst, dass die Datei unter ihrer Adresse antwortet; auf «Bestätigen» klickt die Person.
3. **Inhaberschaft per DNS-Eintrag** (Domain oder URL-Präfix): Google zeigt einen TXT-Eintrag. Die Person trägt ihn dort ein, wo ihre Domain verwaltet wird (Skill `domain`; bei Albatros genau wie der TXT-Beweis `_albatros`), dann klickt sie auf «Bestätigen». Es kann Minuten bis Stunden dauern, bis der Eintrag sichtbar ist.
4. **Datei oder Eintrag bleiben für immer:** Google prüft immer wieder nach. Wer sie entfernt, verliert die Bestätigung.
5. **Sitemap einreichen:** Unter «Sitemaps» trägt die Person die Adresse der Sitemap ein (`https://<domain>/sitemap.xml`). Das ist ein Hinweis für Google, keine Zusage.
6. Nach ein paar Tagen zeigt «Seiten», was aufgenommen ist und was nicht, mit dem Grund. Einzelne Adressen prüft sie mit der «URL-Prüfung».

Ohne eigene Domain (die Adresse von Albatros) geht nur der Weg **URL-Präfix** mit Datei oder mit dem Tag `<meta name="google-site-verification" …>` im Kopf der Startseite, denn das DNS der Adresse verwaltet Albatros.

### 8. Bing Webmaster Tools

Bing speist auch andere Suchen und einige KI-Assistenten. So geht es (geprüft am 10.11.2026 an der Hilfe und am Blog von Bing):

1. Die Person öffnet bing.com/webmasters und meldet sich mit ihrem Microsoft-Konto an.
2. **Am einfachsten: aus der Search Console importieren.** Sie wählt «Importieren» und erlaubt Bing selbst den Zugriff auf ihre Search Console. Die Seite ist dann ohne weiteren Beweis bestätigt; Bing gleicht regelmässig mit Google ab. Diese Erlaubnis gibt nur sie, in ihrem Browser.
3. **Oder von Hand:** die Datei `BingSiteAuth.xml` nach `web/public/` (wie bei Google, unverändert), oder das Tag `<meta name="msvalidate.01" content="…">` im Kopf der Startseite, oder ein DNS-Eintrag, den Bing im Konto anzeigt. Dann klickt sie auf «Bestätigen».
4. Unter «Sitemaps» reicht sie dieselbe Sitemap ein.

### 9. IndexNow: neue und geänderte Seiten sofort melden

IndexNow ist eine Klingel für Suchmaschinen: Statt zu warten, bis der Bote vorbeikommt, meldet die Seite selbst, was neu ist. Es gilt für Bing und weitere (laut indexnow.org am 10.11.2026: Amazon, Bing, Naver, Seznam.cz, Yandex, Yep; eine Meldung an eine geht an alle), nicht für Google. Eine Meldung ist ein Hinweis, keine Zusage.

1. **Schlüssel:** 8 bis 128 Zeichen aus `a–z`, `A–Z`, `0–9` und `-`. Du erzeugst ihn: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`.
2. **Schlüsseldatei:** `web/public/<schlüssel>.txt`, Inhalt genau der Schlüssel. Der Schlüssel ist kein Geheimnis, er liegt offen im Netz; er beweist nur, dass die Meldung von dieser Seite kommt. Jede Adresse (auch mit und ohne `www`) braucht ihre eigene Datei. (Punkt «indexnow»)
3. **Melden**, erst wenn die Seite mit der Schlüsseldatei live ist, und nur mit dem Ja der Person, denn dabei gehen die Adressen ihrer Seite an Dritte:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' "https://api.indexnow.org/indexnow?url=https://<domain>/&key=<schlüssel>"
   ```
   200 heisst angenommen, 202 angenommen und der Schlüssel wird noch geprüft, 403 der Schlüssel passt nicht zur Datei, 422 die Adresse gehört nicht zu diesem Schlüssel, 429 zu viele Meldungen. Mehrere Adressen gehen in einer Meldung als JSON (`host`, `key`, `urlList`, bis 10 000 Adressen).
4. Gemeldet wird, was neu, geändert oder gelöscht ist, nicht jeden Tag alles. Veröffentlicht die Person mit dem Programm Albatros, sagt die Etappe «Sichtbar werden», ob die Meldung dort schon mitläuft; dann meldest du nicht doppelt.

### 10. Für lokale Geschäfte: das Unternehmensprofil

- Adresse, Telefon und Öffnungszeiten als Text auf der Seite (nicht nur im Bild), überall gleich geschrieben.
- **Unternehmensprofil bei Google** (früher «Google My Business»): Damit erscheint das Geschäft auf Google Maps und rechts neben der Suche. Die Person legt es selbst an (google.com/business) und bestätigt es selbst, je nach Geschäft per Post, Telefon oder Video; das kann Tage dauern. Dieselben Angaben wie auf der Webseite, die Adresse der Webseite eintragen. Bewertungen kommen dort von echten Kundinnen und Kunden; bitten darf man darum, kaufen oder selbst schreiben nie.
- Ein Hinweis, mehr nicht: Du richtest das Profil nicht ein und meldest dich dort nicht an.

### 11. Wegweiser sammeln

Echte Links von passenden Orten: Verzeichnis des Quartiers oder Verbands, Partner, lokale Medien, Vereine. Keine gekauften Links. Jede Erwähnung mit denselben Angaben wie auf der Seite hilft auch den KI-Assistenten: Sie glauben eher, was an mehreren Orten gleich steht.

## Stolpersteine

- Eine Platzierung versprechen: Niemand kann das.
- Sterne, Bewertungen oder Zahlen erfinden, auch «nur als Beispiel»: Das ist Täuschung (UWG) und fliegt auf.
- Angaben im JSON-LD, die nicht auf der Seite stehen oder anders lauten.
- Die Prüfdatei von Google oder Bing nach der Bestätigung löschen: Dann geht die Bestätigung verloren.
- Zugangsdaten der Person annehmen oder für sie auf «Bestätigen» klicken: Das tut nur sie.
- `robots.txt` mit `Disallow: /` aus der Bauzeit vergessen: Dann findet niemand die Seite.
- Die Sitemap mit einer anderen Adresse als die Seite (mit statt ohne `www`, `http` statt `https`).

## Mission prüfen

Logbuch und Fliessband (Skills `git-logbuch`, `pipeline`), dann `mission_pruefen` mit `webseite-09-seo-grundlagen`. Die Prüfung schaut, ob `https://{name}.aufwind.sh/sitemap.xml` und `/robots.txt` antworten.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Wegweiser und Stadtplan», der den Kern noch einmal sagt. Danach: was geschafft ist (die zwölf Punkte mit ihrer Ampel), wo das Ergebnis liegt, was die Person selbst in ihren Konten tun muss (Search Console, Bing, Unternehmensprofil) und was als Nächstes kommt. Sag ehrlich, dass es Wochen dauern kann.
