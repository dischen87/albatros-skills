---
name: gestaltung
description: 'Überarbeitet Bedienung und Aussehen einer kleinen Webseite mit einer Person ohne Vorwissen, Schritt für Schritt mit ihrer KI. Zuerst prüfen aus drei Blickwinkeln (Abläufe, Zugang, Zustände und Sprache), dann die Bedienung reparieren, dann drei klar verschiedene Richtungen zur Wahl, feste Werte für Farben, Schrift und Abstände (Tokens) und der Umbau aller Seiten mit Fotos in Handy- und Desktopbreite. Nutze den Skill bei «Design», «sieht langweilig aus», «sieht selbstgebastelt aus», «schöner machen», «Farben», «Schrift», «Redesign», «drei Varianten», «wirkt unprofessionell», «Layout».'
---

# Gestaltung: erst das Fundament, dann die Fassade

## Das Bild

Wer ein altes Haus herrichtet, streicht nicht zuerst die Fassade. Zuerst kommt das Fundament: Türen, die klemmen, Treppen ohne Geländer, Lichtschalter am falschen Ort. Erst wenn das Haus gut bewohnbar ist, wird gestrichen. Neue Farbe über kaputten Türen macht die Fehler nur schöner.

Für die Fassade gibt es dann einen **Farbfächer**: eine kleine Sammlung fester Farben, Schriften und Abstände. Alles im Haus wird nur damit gestrichen. Das Fachwort dafür ist **Tokens**.

## So sprichst du

- Du-Form, kurz. Jede Kritik braucht einen Beleg: welche Seite, welche Stelle, am besten ein Foto. «Wirkt unruhig» allein zählt nicht.
- Geschmack entscheidet die Person. Du legst Richtungen vor und sagst ehrlich, was jede kann und was ihr Risiko ist.
- Eigene Vorgaben der Person (Logo, Hausfarbe, Anrede, Pflichttexte) gehen jedem Gestaltungstipp vor.
- Nichts wird veröffentlicht, bevor die Person die Fotos gesehen und Ja gesagt hat.

## Ablauf

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

### 3. Drei Richtungen

1. **Vorbilder:** die zwei, drei Seiten aus dem Plan anschauen. Was machen sie gut? Was übernehmen wir nicht (deren Logo, Farben, Schrift)?
2. **Diagnose:** Warum trägt das heutige Aussehen nicht? Typisch: alle Titel gleich laut, zwei Stile nebeneinander, eine Farbe mit mehreren Bedeutungen, wechselnde Abstände.
3. **Drei klar verschiedene Richtungen**, nicht nur drei Farben. Sie unterscheiden sich in Idee, Schrift, Rolle der Farbe, Formen und Tiefe. Beispiel: «Weich» (warm, rund), «Klar» (ruhig wie eine Zeitung), «Kräftig» (Farbflächen, grosse Titel).
4. Jede Richtung zeigt **dieselben zwei bis drei Seiten** (Start, wichtigste Unterseite, Kontakt) mit echten Texten. Platzhaltertext verfälscht das Urteil.
5. In allen Richtungen gleich: Logo, Pflichttexte, ein Hauptknopf pro Seite, Barrierefreiheit.

`docs/gestaltung/richtungen.md`: oben die Zeile `Entscheid: <Richtung oder Mischung> (<Datum>)`, darunter Diagnose und pro Richtung eine Tabelle (Idee, Schrift, Farben, Formen, Stärke, Risiko). Die Entwürfe als HTML-Dateien in `docs/gestaltung/entwuerfe/`, damit die Person sie im Browser öffnen kann.

### 4. Der Farbfächer (Tokens)

Eine Datei `tokens.css` mit CSS-Variablen: Farben für hell und dunkel, Schriften, Schriftgrössen, Abstände, Rundungen. Pro Block ein Satz Kommentar, warum. Regeln:

- Eine Aktionsfarbe für alles Anklickbare, sonst nirgends.
- Kontrast nachrechnen, nicht schätzen: Text mindestens 4,5 : 1, Knöpfe und Ränder mindestens 3 : 1 (Formel im Skill `barrierefreiheit`). Werte als Kommentar eintragen.
- Dunkelmodus tauscht nur die Farb-Variablen aus (`@media (prefers-color-scheme: dark)`).
- Ausserhalb von `tokens.css` steht keine Farbe und keine Schriftgrösse von Hand im Code.

### 5. Umbau

Inhalt und Abläufe bleiben. Zuerst die Grundlage (Tokens einbinden, gemeinsame Teile, eine Vorbild-Seite), dann die übrigen Seiten. Fehlt ein Wert im Farbfächer, ergänzt du ihn dort, nicht im Code der Seite.

### 6. Fotos und Freigabe

Jede Seite fotografieren, in Handybreite und Desktopbreite, hell und dunkel:

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

`mission_pruefen` mit `webseite-03-gestaltung`. Die Prüfung schaut, ob `~/projekt/docs/gestaltung/richtungen.md` einen Entscheid enthält und die Seite antwortet.
