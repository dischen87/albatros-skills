---
name: gestaltung
description: 'Überarbeitet Bedienung und Aussehen einer kleinen Webseite mit einer Person ohne Vorwissen, Schritt für Schritt mit ihrer KI. Zuerst prüfen aus drei Blickwinkeln (Abläufe, Zugang, Zustände und Sprache), dann die Bedienung reparieren, dann der Charakter der Seite statt Lieblingsfarben, drei klar verschiedene Richtungen zur Wahl, eine Prüfung gegen den typischen KI-Look, feste Werte für Farben, Schrift und Abstände (Tokens), die Frage nach Gestaltungselementen (Icons, Illustrationen, Fotos, Maskottchen, 3D, auf Wunsch mit den Bild-Werkzeugen von Albatros) und der Umbau aller Seiten mit Fotos in Handy- und Desktopbreite. Nutze den Skill bei «Design», «sieht langweilig aus», «sieht selbstgebastelt aus», «sieht nach KI aus», «vibe coded», «schöner machen», «Farben», «Schrift», «Redesign», «drei Varianten», «wirkt unprofessionell», «Layout», «Icons», «Illustrationen», «Maskottchen», «3D».'
---

# Gestaltung: erst das Fundament, dann die Fassade

## Das Bild

Wer ein altes Haus herrichtet, streicht nicht zuerst die Fassade. Zuerst kommt das Fundament: Türen, die klemmen, Treppen ohne Geländer, Lichtschalter am falschen Ort. Erst wenn das Haus gut bewohnbar ist, wird gestrichen. Neue Farbe über kaputten Türen macht die Fehler nur schöner.

Für die Fassade gibt es dann einen **Farbfächer**: eine kleine Sammlung fester Farben, Schriften und Abstände. Alles im Haus wird nur damit gestrichen. Das Fachwort dafür ist **Tokens**.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- Wünscht sich die Person «schöner» oder «andere Farben», ist deine erste Antwort immer: das Bild vom Fundament vor der Fassade und der Weg in fünf Schritten. Wo die Seite liegt und wie du an sie kommst, fragst du erst danach.
- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurz. Jede Kritik braucht einen Beleg: welche Seite, welche Stelle, am besten ein Foto. «Wirkt unruhig» allein zählt nicht.
- Geschmack entscheidet die Person. Du legst Richtungen vor und sagst ehrlich, was jede kann und was ihr Risiko ist.
- Eigene Vorgaben der Person (Logo, Hausfarbe, Anrede, Pflichttexte) gehen jedem Gestaltungstipp vor.
- Nichts wird veröffentlicht, bevor die Person die Fotos gesehen und Ja gesagt hat.

## Ablauf

Siehst du die Seite noch nicht (kein Projekt im Ordner, keine Adresse), erklär zuerst den ganzen Weg in fünf kurzen Schritten: prüfen, Bedienung reparieren, drei klar verschiedene Richtungen wählen, Farbfächer festlegen, umbauen. Erst danach fragst du, wo die Seite liegt.

### 0. Rahmen (5 Minuten)

Aus `docs/plan.md` (Skill `webseite-planen`) übernehmen: für wen, Hauptsache für Besucher, Seiten. Dazu fragen: Was muss bleiben (Logo, Farbe, Schrift, Texte)? Lege `docs/gestaltung/` an.

### 1. Prüfen aus drei Blickwinkeln (nur lesen, nichts ändern)

Geh die Seite nacheinander mit drei Brillen durch. Pro Befund eine Tabellenzeile in `docs/gestaltung/pruefung.md`:

| ID | Seite und Stelle | Was passiert, für wen, warum schlecht | Beleg | Schwere | Vorschlag (neuer Text wörtlich oder neues Verhalten) |
|---|---|---|---|---|---|

- **Abläufe (AB):** Hauptsache von Anfang bis Ende durchspielen. Wie viele Schritte? Steht die Antwort im ersten Bild? Gibt es Sackgassen? Ist klar, wer dahintersteckt und was es kostet?
- **Zugang (ZG):** die Prüfliste aus dem Skill `barrierefreiheit` (Kontrast, Tastatur, Bildbeschreibungen, Formulare, Handy).
- **Zustände und Sprache (ZS):** Was sieht man beim Laden, bei einem leeren Formular, bei einem Fehler, nach dem Absenden? Gleiche Wörter für gleiche Dinge? Knöpfe nennen das Ergebnis («Platz anfragen» statt «Absenden»)?

Schwere: **kritisch** (Hauptsache geht nicht oder Recht verletzt), **hoch** (führt oft zu Fehlern oder Abbruch), **mittel**, **niedrig**. Für eine kleine Seite reichen 10 bis 15 belegte Befunde. Derselbe Fehler an vielen Stellen ist ein Befund mit einer Liste der Stellen. Am Schluss: was gut ist und bleiben soll.

### 2. Entscheiden und das Fundament reparieren

Lege der Person gesammelt vor, was sie entscheiden muss (mit deiner Empfehlung), nicht einzeln. Dann reparieren: zuerst die gemeinsamen Teile (Knopf, Formularfeld, Fehlermeldung, Bestätigung), dann die Seiten. Farben und Schriften bleiben in diesem Schritt, wie sie sind.

- **Hauptknopf:** etwa 56 px hoch, Schrift 17 px, halbfett. Der zweite Knopf ist weiss mit Rand, Links sind unterstrichen.
- **Gesperrt** ist nie unsichtbar: 40 % Deckkraft, und daneben steht, warum.
- **Felder:** 48 bis 52 px hoch, die Beschriftung steht darüber (nie nur ein Platzhalter im Feld), Hilfe oder Fehler darunter, mit Wort und nicht nur mit Farbe.
- **Status** (frei, ausgebucht, bestätigt) immer als Wort und Form, nie nur als Farbe.

### 3. Drei Richtungen

1. **Charakter zuerst, nicht Farben.** Frag nach Eigenschaften, nicht nach Lieblingsfarben. Leg Gegensatzpaare zur Wahl vor, passend zur Seite: traditionell oder sportlich, Bergdorf oder Stadt, ruhig oder lebendig, edel oder bodenständig, für Gäste oder für Mitglieder. Dazu eine Frage: Welche drei Wörter sollen Besucher nach zehn Sekunden denken? Halte die Antworten in `docs/gestaltung/richtungen.md` fest. Jede der drei Richtungen betont andere dieser Eigenschaften. Farben folgen daraus und aus Logo und Umgebung, nie umgekehrt.
2. **Vorbilder:** die zwei, drei Seiten aus dem Plan anschauen. Was machen sie gut? Was übernehmen wir nicht (deren Logo, Farben, Schrift)?
3. **Diagnose:** Warum trägt das heutige Aussehen nicht? Typisch: alle Titel gleich laut, zwei Stile nebeneinander, eine Farbe mit mehreren Bedeutungen, wechselnde Abstände.
4. **Drei klar verschiedene Richtungen**, nicht nur drei Farben. Sie unterscheiden sich in Idee, Schrift, Rolle der Farbe, Formen und Tiefe. Beispiel: «Weich» (warm, rund), «Klar» (ruhig wie eine Zeitung), «Kräftig» (Farbflächen, grosse Titel).
5. Jede Richtung zeigt **dieselben zwei bis drei Seiten** (Start, wichtigste Unterseite, Kontakt) mit echten Texten. Platzhaltertext verfälscht das Urteil.
6. In allen Richtungen gleich: Logo, Pflichttexte, ein Hauptknopf pro Seite, Barrierefreiheit.

`docs/gestaltung/richtungen.md`: oben die Zeile `Entscheid: <Richtung oder Mischung> (<Datum>)`, darunter Diagnose und pro Richtung eine Tabelle (Idee, Schrift, Farben, Formen, Stärke, Risiko). Die Entwürfe als HTML-Dateien in `docs/gestaltung/entwuerfe/`, damit die Person sie im Browser öffnen kann.

### Nicht nach KI aussehen

KI-Seiten erkennt man an denselben Merkmalen. Prüf jeden Entwurf und die fertige Seite gegen diese Liste und schreib das Ergebnis in `docs/gestaltung/richtungen.md` (Zeile `KI-Merkmale geprüft: …`):

- Verläufe in Lila und Blau, Glüh- und Glaseffekte.
- Emoji als Icons.
- Inter oder eine andere Standardschrift überall, alle Titel gleich laut.
- Zentrierter Kopf mit Farbklecks dahinter und zwei Knöpfen nebeneinander.
- Drei gleiche Karten in einer Reihe, mit gleichem Schatten, gleicher Rundung und je einem Icon.
- Stockbild-Look: lächelnde Menschen am Laptop, Berge von irgendwo.
- Füllfloskeln: «Willkommen auf unserer Webseite», «Entdecken Sie», «Ihr Partner für», «mit Leidenschaft», «innovativ», «nahtlos».
- Erfundene Zahlen, Bewertungen, Zitate oder Kundenlogos. Zeitversprechen wie «in 60 Sekunden».
- Graue Schatten, zwei Arten von Tiefe nebeneinander (Schatten hier, Rahmen dort), gemischte Icon-Sätze.
- Mehr als sechs Abschnitte auf der Startseite.

Stattdessen: ein einziges Erkennungszeichen, sparsam eingesetzt (ein Strich unter einem Wort im Titel, ein Leuchtstift für höchstens ein Wort pro Abschnitt), echte Fotos des Ortes und der Menschen, eine Schrift mit Charakter passend zu den Eigenschaften, Farben aus Logo und Umgebung, ein Aufbau aus dem Inhalt (sind Termine die Hauptsache, stehen sie oben) und konkrete Sätze mit Namen, Zahlen und Orten. Im Code findest du Verläufe und Standardschriften mit `grep -rnE "linear-gradient|radial-gradient|Inter" src`. Emoji und Floskeln suchst du in den Texten, den Rest in den Fotos.

### 4. Der Farbfächer (Tokens)

Eine Datei `tokens.css` mit CSS-Variablen: Farben für hell und dunkel, Schriften, Schriftgrössen, Abstände, Rundungen. Pro Block ein Satz Kommentar, warum. Regeln:

- Eine Aktionsfarbe für alles Anklickbare, sonst nirgends.
- Kontrast nachrechnen, nicht schätzen: Text mindestens 4,5 : 1, Knöpfe und Ränder mindestens 3 : 1 (Formel im Skill `barrierefreiheit`). Werte als Kommentar eintragen.
- Dunkelmodus tauscht nur die Farb-Variablen aus (`@media (prefers-color-scheme: dark)`).
- Ausserhalb von `tokens.css` steht keine Farbe und keine Schriftgrösse von Hand im Code.
- **Schrift:** höchstens zwei Familien, eine Titelschrift mit Charakter und eine ruhige Textschrift, selbst gehostet (woff2, `font-display: swap`). Text 16 bis 17 px mit Zeilenhöhe 1,5, nichts unter 12 px. Grosse Titel mit Zeilenhöhe 1,0 bis 1,1 und leicht enger gesetzt (−0,01 bis −0,03 em), auf dem Handy mit `clamp()` kleiner. Fett (700) nur für die grössten Titel, sonst halbfett (600). Preise und Zeiten mit `font-variant-numeric: tabular-nums`.
- **Abstände** nur aus einer Reihe: 4, 8, 12, 16, 24, 32, 48 px (für Abschnitte grösser). Inhalt höchstens etwa 1200 px breit, am Handy 16 px Rand.
- **Rundungen:** drei Stufen nach Grösse (Feld, Karte, grosse Fläche), innen immer kleiner als aussen. Knöpfe entweder alle rund oder alle eckig.
- **Tiefe:** eine Methode für die ganze Seite, entweder Fläche mit Schatten oder feine Linie ohne Schatten. Schatten in der Textfarbe getönt, nie grau, höchstens zwei Stufen. Der Grund ist leicht warm, Karten sind weiss.
- **Bewegung:** Drücken 90 bis 100 ms, Wechsel 160 bis 200 ms, eine Bewegung pro Ereignis. Bei «weniger Bewegung» nur Überblenden.
- **Fokus:** 2 bis 3 px in der Aktionsfarbe mit 2 px Abstand, auf jedem Hintergrund mindestens 3 : 1.
- **Die Fehlerfarbe** nur für Fehler und Dringendes.

### Gestaltungselemente: immer fragen

Steht die Richtung, fragst du immer: «Möchtest du noch Gestaltungselemente dazu?» Leg die Möglichkeiten mit Aufwand vor:

- **Icons:** ein einziger, einheitlicher Satz (zum Beispiel Lucide oder Phosphor), nie Emoji und nie zwei Sätze gemischt.
- **Illustrationen:** wenige, im gleichen Stil, für leere Stellen und Erklärungen.
- **Eigene Fotos:** eine Fotoliste, was die Person fotografieren soll (Ort, Menschen in Aktion, Details). Echte Fotos schlagen jedes erzeugte Bild.
- **Ein Maskottchen:** eine Figur, die durch die Seite führt. Zuerst ein Blatt mit vier bis sechs Posen derselben Figur, je eine für einen Moment (Willkommen, Suchen, Erfolg, leer), dann Regeln, wann sie erscheint: nie bei Fehlern, Absagen oder heiklen Momenten, nie neben Fotos von Menschen, nie hinter Listen oder Formularen. Grösse: beim Willkommen höchstens die halbe Breite, sonst klein. Sie ist Schmuck (`alt=""`), der Satz daneben stimmt auch ohne sie. Bewegte Clips laden erst, wenn sie sichtbar sind, spielen höchstens 5 Sekunden und bleiben dann stehen (WCAG 2.2.2). Jedes Bild schaust du selbst an, auch vergrössert.
- **3D:** ein Gegenstand oder die Figur als 3D-Modell, nur im Kopf der Startseite und erst ab Tablet-Breite. Zuerst steht ein Standbild, das 3D lädt erst, wenn der Kopf sichtbar ist. Auf dem Handy, ohne Grafikkarte oder bei «weniger Bewegung» bleibt das Standbild.

Was die Person wählt, kommt in `docs/gestaltung/richtungen.md` und in den Farbfächer (Grössen, Abstände, Regeln).

**Mit Albatros** entstehen Bilder, freigestellte Figuren und 3D-Modelle über die Werkzeuge von Albatros, bezahlt aus dem Guthaben der Person (Selbstkosten plus 35 %):

- `bild_erzeugen` mit `beschreibung` und `format` (`quadrat`, `quer`, `hoch` oder `breit`), `bild_freistellen` mit `bild_url` (ein Bild mit transparentem Hintergrund), `modell_3d` mit `bild_url` (ein 3D-Modell als GLB, am besten aus einem freigestellten Bild).
- `guthaben` zeigt den Stand, die Preise und den Link zum Aufladen. Preise nennst du nur aus dieser Antwort.
- Vor dem ersten Aufruf, der etwas kostet, rufst du `guthaben` auf, nennst den Preis und fragst einmal: «Ein Bild kostet CHF …, dein Guthaben reicht für … Soll ich?» Danach nennst du nach jedem Aufruf kurz Kosten und Rest, ohne neu zu fragen. Reicht das Guthaben nicht, gibst du den Link zum Aufladen weiter.
- Jedes Ergebnis speicherst du sofort im Projekt (`curl -o web/public/bilder/<name>.png <url>`), denn nach 7 Tagen ist es weg. Für eine Variante änderst du die Beschreibung: Dieselbe Beschreibung gibt 15 Minuten lang dasselbe Bild zurück, ohne neue Kosten.
- Jedes erzeugte Bild schaust du selbst an, bevor du es der Person zeigst. Auf die Seite kommt nur, was sie gewählt hat.
- Antwortet ein Werkzeug «kommt bald», machst du ohne Bild-Werkzeuge weiter (unten).

**Mit einem eigenen Hugging-Face-Konto** geht es auch, als Alternative. Die Person legt das Konto selbst an und meldet sich selbst an. Du bindest den offiziellen Server ein: `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. Mit Codex heisst es `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, mit Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, mit Cursor der Eintrag `"huggingface": { "url": "https://huggingface.co/mcp?login" }` unter `mcpServers` in `~/.cursor/mcp.json`. Die Spaces für Bilder, Freistellen und 3D wählt sie unter huggingface.co/settings/mcp. Gratis gibt es 5 Minuten Rechenzeit pro Tag. Ohne Anmeldung bietet der Server nur die Suche im Hub.

**Rechte:** Jedes Modell hat eine Lizenz, lies sie auf der Modellseite, bevor ein Bild auf die Seite kommt. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) und TRELLIS (MIT) erlauben auch gewerbliche Nutzung, FLUX.1 dev nur nicht gewerbliche. Erzeugte Bilder zeigen keine echten Personen und keine fremden Logos. Echte Orte und Menschen kommen von eigenen Fotos mit Einverständnis.

**Ohne Bild-Werkzeuge** geht der Weg genauso: Icons aus einem freien Satz, eigene Fotos, Illustrationen aus einer freien Sammlung mit klarer Lizenz, ein Maskottchen gezeichnet oder später, kein 3D.

### 5. Umbau

Inhalt und Abläufe bleiben. Zuerst die Grundlage (Tokens einbinden, gemeinsame Teile, eine Vorbild-Seite), dann die übrigen Seiten. Fehlt ein Wert im Farbfächer, ergänzt du ihn dort, nicht im Code der Seite.

### 6. Fotos und Freigabe

Jede Seite fotografieren, in Handybreite und Desktopbreite, hell und dunkel. Läuft die Seite noch nicht im Netz, nimmst du die Adresse der Vorschau (`http://localhost:4321`):

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Jedes Foto selbst anschauen und mit dem Entwurf vergleichen. Erst dann der Person zeigen. Nach ihrem Ja: Logbuch (Skill `git-logbuch`), Fliessband (Skill `pipeline`).

## Stolpersteine

- Aussehen vor Bedienung: schreibt die Fehler fest.
- Drei Richtungen, die sich nur in der Farbe unterscheiden: keine echte Wahl.
- Farben von Hand im Code: Dann bricht der Dunkelmodus.
- «Fertig» sagen, ohne die Fotos selbst angeschaut zu haben.

## Mission prüfen

`mission_pruefen` mit `webseite-04-gestaltung`. Die Prüfung schaut, ob `~/projekt/docs/gestaltung/richtungen.md` einen Entscheid enthält und die Seite antwortet.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «erst das Fundament, dann die Fassade», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
