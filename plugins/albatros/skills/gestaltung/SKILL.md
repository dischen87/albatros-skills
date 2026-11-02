---
name: gestaltung
description: 'Gestaltet mit einer Person ohne Vorwissen Bedienung und Aussehen ihrer Seite. Im Fahrplan (P6): graues Mockup («Stimmt die Reihenfolge?»), drei klar verschiedene Richtungen aus dem Konzept, Prüfung gegen den KI-Look, Tokens für Farben, Schrift und Abstände (design/tokens.css), docs/designsystem.md und ein Musterblatt. Bei einer bestehenden Seite: prüfen aus drei Blickwinkeln, Bedienung reparieren, Richtungen, Tokens, Umbau mit Fotos. Immer mit der Frage nach Gestaltungselementen (Icons, Fotos, Maskottchen, 3D; Bild-Werkzeuge nur nach Preis und Ja). Nutze den Skill nach konzept und bei «Design», «Designsystem», «Musterblatt», «sieht langweilig aus», «sieht selbstgebastelt aus», «sieht nach KI aus», «vibe coded», «schöner machen», «Farben», «Schrift», «Redesign», «drei Varianten», «wirkt unprofessionell», «Layout», «Icons», «Maskottchen», «3D».'
metadata:
  stand: 0.2.0
---

# Gestaltung: erst das Fundament, dann die Fassade

## Das Bild

Wer ein altes Haus herrichtet, streicht nicht zuerst die Fassade. Zuerst kommt das Fundament: Türen, die klemmen, Treppen ohne Geländer, Lichtschalter am falschen Ort. Erst wenn das Haus gut bewohnbar ist, wird gestrichen. Neue Farbe über kaputten Türen macht die Fehler nur schöner.

Bei einem neuen Haus ist das Fundament der Aufbau: Zuerst zeichnet man in Grau, welches Zimmer wo liegt. Erst dann legt man die Materialmuster nebeneinander auf ein **Musterblatt**: Farben, Schriften, Knöpfe und Felder, so wie man beim Hausbau Plättli und Holz anschaut, bevor bestellt wird. Was auf dem Musterblatt stimmt, stimmt in jedem Zimmer.

Für die Fassade gibt es einen **Farbfächer**: eine kleine Sammlung fester Farben, Schriften und Abstände. Alles im Haus wird nur damit gestrichen. Das Fachwort dafür ist **Tokens**.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## Zwei Wege durch diesen Skill

- **Neue Seite im Fahrplan (P6):** Es gibt `docs/konzept.md` aus P5, gebaut ist noch nichts. Du gehst durch den Abschnitt «Vom Mockup zum Musterblatt».
- **Eine bestehende Seite überarbeiten:** Die Seite ist schon gebaut oder im Netz, und die Person findet, sie sei schwer zu bedienen oder sehe nicht gut aus («sieht selbstgebastelt aus», «schöner machen», «andere Farben»). Du gehst durch den Abschnitt «Eine bestehende Seite überarbeiten». Ist die Seite schon live, kommt vor dem Umbau ein Entwurf der geänderten Seiten mit Freigabe zum Bauen (Skills `entwurf` und `webseite-aendern`).

Für beide gelten die Abschnitte «Drei Richtungen», «Nicht nach KI aussehen», «Der Farbfächer (Tokens)» und «Gestaltungselemente».

## So sprichst du

- Deine erste Antwort ist immer das Bild und der Weg in fünf Schritten: im Fahrplan Mockup, drei Richtungen, Wahl, Farbfächer, Musterblatt; bei einer bestehenden Seite prüfen, Bedienung reparieren, drei klar verschiedene Richtungen wählen, Farbfächer festlegen, umbauen. Wünscht sich die Person «schöner» oder «andere Farben», gilt das genauso. Wo die Seite liegt und wie du an sie kommst, fragst du erst danach.
- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurz. Höchstens zwei Fragen in einer Nachricht. Jede Kritik braucht einen Beleg: welche Seite, welche Stelle, am besten ein Foto. «Wirkt unruhig» allein zählt nicht.
- Geschmack entscheidet die Person. Du legst Richtungen vor und sagst ehrlich, was jede kann und was ihr Risiko ist.
- Eigene Vorgaben der Person (Logo, Hausfarbe, Anrede, Pflichttexte) gehen jedem Gestaltungstipp vor. Im Fahrplan stehen sie in `docs/konzept.md` unter `Muss bleiben:`.
- Was die Person sehen soll (Mockup, Richtungen, Musterblatt, Fotos), öffnest du selbst im Browser: `open <datei>` (Linux `xdg-open`, Windows `start`). Nur den Namen der Datei zu nennen reicht nicht.
- Nichts wird veröffentlicht, bevor die Person die Fotos gesehen und Ja gesagt hat.

## Vom Mockup zum Musterblatt (Fahrplan P6)

Phase P6 «Designsystem mit Beispiel». Dran, wenn `docs/konzept.md` alle sieben Zeilen hat (P5, Skill `konzept`); fehlt sie, gehst du zuerst dorthin. Danach kommt P7, die ganze Seite als Entwurf zum Durchklicken (Skill `entwurf`).

- **Ergebnis:** `design/mockup.html`, `design/richtungen/*.html`, `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` und `docs/designsystem.md` mit den Zeilen `Reihenfolge:`, `Richtung:`, `Musterblatt:`, `Farben:`, `Schriften:`, `Abstände:`, `Komponenten:` und `Maskottchen:`.
- **Geschafft, wenn** `tokens.css` und `musterblatt.html` da sind, das Musterblatt Farben, Schriften und Grössen nur als `var(--…)` aus `tokens.css` nutzt und die Person es gesehen hat (`Musterblatt: gesehen am …`).
- **Fragen an die Person:** «Stimmt die Reihenfolge im grauen Mockup?», «Welche der drei Richtungen, oder welche Mischung?», «Passt das Musterblatt: Farben, Schriften, Knöpfe, Felder, Karten und Kopf auf dem Handy?» und die Frage nach Gestaltungselementen. Jede der drei Antworten hat ihre eigene Zeile (`Reihenfolge:`, `Richtung:`, `Musterblatt:`). Eine Annahme gibt es dafür nicht: Bis die Person geantwortet hat, steht dort `[offen: …]`. «Auch eine dunkle Fassung?» schlägst du als `[Annahme: ja, hell und dunkel]` vor, denn viele Handys zeigen nachts dunkel.
- **Insel:** `mockup`, sobald die Reihenfolge stimmt; `entwuerfe`, sobald die Person das Musterblatt gesehen hat und es passt.

**Modus:** Lies `Modus:` in `docs/projekt.md` (fehlt die Zeile, gilt `machen`). Der Lernmoment dieser Phase ist «Warum Farben und Schriften nur an einem Ort stehen»: Die Person ändert selbst eine Farbe in `design/tokens.css`, lädt das Musterblatt neu und sieht, wie sie sich überall ändert. Im Modus `lernen` macht sie das selbst (danach `verstanden_melden` mit `mission: flugschule-19-musterblatt` und `art: selbst`), und am Ende der Phase, wenn du `entwuerfe` meldest, stellst du die Kontrollfragen der Lektion `flugschule-19-musterblatt`: «Warum stehen Farben und Schriften deiner Seite nur an einem Ort?» und «Warum zeigt dir deine KI zuerst ein graues Mockup und erst dann Farben?» Den Kern einer guten Antwort nennt `lage`. Erst nach ihrer Antwort meldest du `art: kontrollfrage`. Im Modus `machen` bietest du den Lernmoment an und erklärst jeden Schritt in einem Satz mit seinem Bild. Fehlt das Werkzeug `verstanden_melden`, geht es ohne weiter.

### 1. Das Mockup aus der Skizze (`schritt: mockup`)

Die graue Skizze der Startseite aus P1 liegt in `design/skizze.html`. Daraus machst du `design/mockup.html`: die Startseite von oben nach unten (auf dem Weg Geschäft so, wie es in `docs/plan.md` unter «Startseite von oben nach unten» steht) und die wichtigste Unterseite, beide in einer Datei. Fehlt die Skizze, nimmst du `docs/plan.md`.

- Nur Graustufen und die Schrift des Systems, keine Bilder: graue Flächen mit einer Beschriftung, was dort hinkommt («Foto: die Probe im Schulhaus»).
- Echte Überschriften und Sätze aus `docs/projekt.md`, `docs/plan.md` und `docs/konzept.md` (Name, Kern), der Hauptknopf mit seinem echten Text («Platz anfragen»), das Menü mit allen Seiten aus `Seiten:`.
- Eine Datei ohne Verweise ins Netz; sie öffnet sich mit einem Doppelklick.

Öffne sie und frag nur: «Stimmt die Reihenfolge im grauen Mockup?» Warum: Aufbau vor Aussehen. Ändere, bis sie stimmt. Dann legst du `docs/designsystem.md` an (Vorlage in Schritt 4) mit `Reihenfolge: bestätigt am <TT.MM.JJJJ>`, `Richtung: [offen: Wahl der Richtung]`, `Musterblatt: [offen: kommt nach dem Zeigen]` und den übrigen Zeilen mit `[offen: …]`, und meldest `mockup` (Abschnitt «Die Insel»).

### 2. Drei Richtungen auf dem Mockup

Jetzt kommt der Charakter dazu. Lies in `docs/konzept.md` die drei Wörter unter `Charakter:`, den Ton, die Bildsprache und was bleiben muss, in `docs/recherche.md` die Vorbilder. Daraus machst du drei klar verschiedene Richtungen nach dem Abschnitt «Drei Richtungen»: je eine Datei `design/richtungen/<name>.html` (zum Beispiel `weich.html`, `klar.html`, `kraeftig.html`) mit genau dem Inhalt und der Reihenfolge des Mockups.

- Oben in jeder Datei ein kurzer Kasten: die Idee, welches der drei Wörter sie betont, Schriften, Rolle der Farbe, Formen, Tiefe, Stärke und Risiko.
- Jede Richtung hat ihre eigenen vorläufigen Werte in einem `<style>` oben in der Datei. Das ist erlaubt, denn erst nach der Wahl entsteht der Farbfächer als einzige Quelle.
- Gehört eine Figur dazu (`Maskottchen: ja`), steht sie in jeder Richtung an der Stelle, an der sie auftaucht, als Bild oder als Skizze aus `design/figur/`.

### 3. Prüfung gegen den KI-Look und Wahl

Schau jede Richtung im Browser an, in Handy- und Desktopbreite, und prüf sie gegen die Liste im Abschnitt «Nicht nach KI aussehen». Was du findest, besserst du, bevor die Person die Richtungen sieht. Schreib das Ergebnis in `docs/designsystem.md` unter `## Richtung`: `KI-Merkmale geprüft: weich ok, klar ok, kräftig: Karten gleich gross, umgebaut`.

Öffne alle drei und frag: «Welche der drei Richtungen, oder welche Mischung?» Warum: Drei klar verschiedene Richtungen zeigen, was möglich ist. In derselben Nachricht oder gleich danach kommt die Frage nach Gestaltungselementen (Abschnitt «Gestaltungselemente»). Die Wahl kommt in die Zeile `Richtung:`, zum Beispiel `Richtung: klar, mit den Farben von weich`.

### 4. Farbfächer, Komponenten und Designsystem

Aus der gewählten Richtung entstehen die Materialmuster für das ganze Haus:

- **`design/tokens.css`:** der Farbfächer, die einzige Quelle für Farben (hell und dunkel), Schriften, Schriftgrössen, Abstände, Rundungen und Schatten, mit den Kontrasten als Kommentar (Abschnitt «Der Farbfächer (Tokens)»).
- **`design/komponenten.css`:** die gemeinsamen Teile, nur mit `var(--…)`: Knopf (normal, Fokus, gesperrt), Link, Feld mit Beschriftung, Hilfe und Fehler, Meldung für Bestätigung und Fehler, Karte, Kopf mit Menü, Fuss mit Impressum und Datenschutz. Der Kopf richtet sich nach seiner eigenen Breite (Container-Abfrage `@container`) statt nach der Breite des Fensters, so zeigt ihn das Musterblatt auch in einem 390 px breiten Rahmen wie auf dem Handy. Musterblatt und Entwurf nutzen dieselbe Datei.
- **`docs/designsystem.md`:** für Menschen lesbar, auf einer Seite. Jede Zeile beginnt am Zeilenanfang mit ihrem Namen und bleibt kurz (höchstens 300 Zeichen), denn `lage` liest diese Zeilen:

```markdown
# Designsystem: <Name>
Stand: <TT.MM.JJJJ>

Reihenfolge: bestätigt am <TT.MM.JJJJ>
Richtung: <Name der Richtung oder Mischung>
Musterblatt: [offen: kommt nach dem Zeigen]
Farben: <Aktionsfarbe, Grund, Text, Fehler>; hell und dunkel; Kontraste in design/tokens.css
Schriften: <Titelschrift> und <Textschrift>; Text 17 px, Titel <Grössen>
Abstände: 4, 8, 12, 16, 24, 32, 48 px; Inhalt höchstens 1200 px; Rundungen <…>; Tiefe: <Schatten oder Linie>
Komponenten: Knopf, Link, Feld, Meldung, Karte, Kopf mit Menü, Fuss (design/komponenten.css)
Maskottchen: <ja – Figur, Posen, wann sie auftaucht | nein | später>

## Richtung
Eigenschaften: <die drei Wörter> · Idee: … · KI-Merkmale geprüft: …

## Farben
| Token | Zweck | hell | dunkel | Kontrast |
|---|---|---|---|---|

## Komponenten
| Komponente | Zweck | Tokens |
|---|---|---|

## Wörter
Ein Wort je Ding, gleich auf der Seite, in der Mail und in der Verwaltung: Anfrage (nicht Buchung), …

## Gestaltungselemente
Icons: … · Illustrationen: … · Fotos: Fotoliste in docs/inhalte.md · Figur: … · 3D: …
```

Die Anfänge der Zeilen sind fest, denn `lage` und der Skill `entwurf` lesen sie: Hinter `Reihenfolge:` steht `bestätigt am` mit dem Datum. Hinter `Musterblatt:` steht `[offen: kommt nach dem Zeigen]`, bis die Person Ja gesagt hat, danach `gesehen am <TT.MM.JJJJ>, passt` (Schritt 5). Hinter `Maskottchen:` steht zuerst `ja`, `nein` oder `später`, wie in `docs/konzept.md`.

### 5. Das Musterblatt

`design/musterblatt.html` bindet nur `tokens.css` und `komponenten.css` ein und zeigt auf einer Seite:

- jede Farbe als Fläche mit Name, Zweck und Kontrast, hell und dunkel nebeneinander;
- die Schriftgrössen von gross bis klein, mit echten Sätzen aus dem Projekt;
- die Abstände als Reihe und die Rundungen;
- den Knopf normal, im Fokus und gesperrt (mit dem Grund daneben);
- ein Feld mit Beschriftung, Hilfe und einem Fehler in Worten;
- eine Karte und eine Meldung für Bestätigung und Fehler;
- den Kopf mit Menü in einem 390 px breiten Rahmen und in voller Breite;
- die Gestaltungselemente: Icons aus dem gewählten Satz, die Figur in ihren Posen oder als Skizze, ein Foto oder die Fläche, auf die es kommt.

Farben, Schriften und Grössen stehen im Musterblatt nur als `var(--…)`. Prüf das mit den Augen im Code; ist Node schon da, misst es `node <Ordner des Skills entwurf>/entwurf-pruefen.mjs --nur farbfaecher` und rechnet dabei auch jeden Kontrast-Kommentar nach (Ordner unbekannt: `curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs`).

Öffne das Musterblatt und zeig der Person, wie sie es am Handy sieht: das Browserfenster ganz schmal ziehen oder die Handy-Ansicht des Browsers (Firefox und Chrome: `Ctrl+Shift+M`, am Mac in Firefox `Cmd+Opt+M`, in Chrome zuerst `F12`). Dann frag: «Passt das Musterblatt: Farben, Schriften, Knöpfe, Felder, Karten und Kopf auf dem Handy?» Warum: Was im Musterblatt stimmt, stimmt auf jeder Seite. Änderungen machst du in `tokens.css` oder `komponenten.css`, nie im Musterblatt selbst. Nach ihrem Ja schreibst du in `docs/designsystem.md` die Zeile `Musterblatt: gesehen am <TT.MM.JJJJ>, passt` (statt `[offen: …]`), zum Beispiel `Musterblatt: gesehen am 31.10.2026, passt`, füllst die übrigen Zeilen und meldest `entwuerfe`. Im Modus `lernen` stellst du dazu die zwei Kontrollfragen der Lektion `flugschule-19-musterblatt` (oben beim Modus).

### Die Insel

Nach Schritt 1 rufst du das Werkzeug `schritt_melden` mit `schritt: mockup` und `sprache: de` auf, nach Schritt 5 mit `schritt: entwuerfe`. `projekt` lässt du weg, ausser die Person arbeitet an einem weiteren Projekt nur auf ihrem Computer; dann gibst du dessen kurzen Namen mit. Sag ihr in einem Satz, dass ihr Haus auf der Insel gewachsen ist. Antwortet das Werkzeug «Ungültige Angaben», prüf die Schreibweise einmal; fehlt es, geht es ohne Insel weiter. Danach rufst du `lage` erneut auf (Skill `lotse`), immer mit `skills_stand`: dem Wert von `stand` unter `metadata` oben in dieser Datei.

## Drei Richtungen

1. **Charakter zuerst, nicht Farben.** Im Fahrplan stehen die Eigenschaften schon in `docs/konzept.md` (`Charakter:`). Sonst fragst du nach Eigenschaften, nicht nach Lieblingsfarben: Leg Gegensatzpaare zur Wahl vor, passend zur Seite: traditionell oder sportlich, Bergdorf oder Stadt, ruhig oder lebendig, edel oder bodenständig, für Gäste oder für Mitglieder. Dazu eine Frage: Welche drei Wörter sollen Besucher nach zehn Sekunden denken? Jede der drei Richtungen betont andere dieser Eigenschaften. Farben folgen daraus und aus Logo und Umgebung, nie umgekehrt.
2. **Vorbilder:** die zwei, drei Seiten aus der Recherche oder dem Plan anschauen. Was machen sie gut? Was übernehmen wir nicht (deren Logo, Farben, Schrift)?
3. **Diagnose** (bei einer bestehenden Seite): Warum trägt das heutige Aussehen nicht? Typisch: alle Titel gleich laut, zwei Stile nebeneinander, eine Farbe mit mehreren Bedeutungen, wechselnde Abstände.
4. **Drei klar verschiedene Richtungen**, nicht nur drei Farben. Sie unterscheiden sich in Idee, Schrift, Rolle der Farbe, Formen und Tiefe. Beispiel: «Weich» (warm, rund), «Klar» (ruhig wie eine Zeitung), «Kräftig» (Farbflächen, grosse Titel).
5. Jede Richtung zeigt **dieselben Seiten** mit echten Texten: im Fahrplan das Mockup, bei einer bestehenden Seite zwei bis drei Seiten (Start, wichtigste Unterseite, Kontakt). Platzhaltertext verfälscht das Urteil.
6. In allen Richtungen gleich: Logo, Pflichttexte, ein Hauptknopf pro Seite, Barrierefreiheit.

## Nicht nach KI aussehen

KI-Seiten erkennt man an denselben Merkmalen. Prüf jede Richtung und die fertige Seite gegen diese Liste und schreib das Ergebnis auf (im Fahrplan in `docs/designsystem.md`, sonst in `docs/gestaltung/richtungen.md`, Zeile `KI-Merkmale geprüft: …`):

- Verläufe in Lila und Blau, Glüh- und Glaseffekte.
- Emoji als Icons.
- Inter oder eine andere Standardschrift überall, alle Titel gleich laut.
- Zentrierter Kopf: Titel, Satz und Knopf mittig in einer Farbfläche oder vor einem Farbklecks, mit einem oder zwei Knöpfen.
- Gleich grosse Karten nebeneinander oder untereinander, egal ob mit Icon, rund oder eckig. Das ist das häufigste KI-Merkmal: Ordne den Inhalt nach seiner Wichtigkeit, nicht in gleiche Kästchen.
- Stockbild-Look: lächelnde Menschen am Laptop, Berge von irgendwo.
- Füllfloskeln: «Willkommen auf unserer Webseite», «Entdecken Sie», «Ihr Partner für», «mit Leidenschaft», «innovativ», «nahtlos».
- Erfundene Zahlen, Bewertungen, Zitate oder Kundenlogos. Zeitversprechen wie «in 60 Sekunden».
- Graue Schatten, zwei Arten von Tiefe nebeneinander (Schatten hier, Rahmen dort), gemischte Icon-Sätze.
- Mehr als sechs Abschnitte auf der Startseite.

Prüf nach dem Muster, nicht nach dem Wortlaut: Ein Knopf statt zwei oder Karten untereinander statt nebeneinander sind dasselbe Merkmal. Dafür schaust du die Seiten oder Fotos an, nicht nur den Code.

Stattdessen: ein einziges Erkennungszeichen, sparsam eingesetzt (ein Strich unter einem Wort im Titel, ein Leuchtstift für höchstens ein Wort pro Abschnitt), echte Fotos des Ortes und der Menschen, eine Schrift mit Charakter passend zu den Eigenschaften, Farben aus Logo und Umgebung, ein Aufbau aus dem Inhalt (sind Termine die Hauptsache, stehen sie oben) und konkrete Sätze mit Namen, Zahlen und Orten. Im Code findest du Verläufe und Standardschriften mit `grep -rnE "linear-gradient|radial-gradient|Inter" design src`. Emoji und Floskeln suchst du in den Texten, den Rest mit den Augen.

## Der Farbfächer (Tokens)

Eine Datei `tokens.css` mit CSS-Variablen: Farben für hell und dunkel, Schriften, Schriftgrössen, Abstände, Rundungen und Schatten. Sie liegt in `design/tokens.css`, auch wenn die Seite gebaut ist: Das Layout bindet sie dort ein (Skill `webseite-bauen`), eine Kopie unter `web/` gibt es nicht. Pro Block ein Satz Kommentar, warum. Regeln:

- Eine Aktionsfarbe für alles Anklickbare, sonst nirgends.
- Kontrast nachrechnen, nicht schätzen: Text mindestens 4,5 : 1, Knöpfe und Ränder mindestens 3 : 1 (Formel im Skill `barrierefreiheit`). Farben als Hex (`#1d1b18`), den Kontrast als Kommentar in derselben Zeile, immer mit der Gegenfarbe: `/* 16,0 : 1 auf --hell-grund */`. So lässt er sich nachrechnen; `entwurf-pruefen.mjs` (Skill `entwurf`) tut das für jeden Kommentar.
- Jede Farbe steht einmal, in einer Palette für hell und einer für dunkel. Die Seiten nutzen nur Namen wie `--farbe-text`; der Dunkelmodus tauscht nur diese Zuordnung aus (`@media (prefers-color-scheme: dark)`).
- Ausserhalb von `tokens.css` steht keine Farbe, keine Schrift und keine Schriftgrösse, kein Abstand, keine Rundung und kein Schatten von Hand im Code. Breiten von Bildschirmen in `@media` dürfen Zahlen sein.
- **Schrift:** höchstens zwei Familien, eine Titelschrift mit Charakter und eine ruhige Textschrift, mit freier Lizenz (zum Beispiel SIL Open Font License) und selbst gehostet (woff2, `font-display: swap`; im Fahrplan in `design/schriften/`, Quelle und Lizenz als Kommentar). Nie von fremden Servern laden, das verrät die Besucher an Dritte. Text 16 bis 17 px mit Zeilenhöhe 1,5, nichts unter 12 px. Grosse Titel mit Zeilenhöhe 1,0 bis 1,1 und leicht enger gesetzt (−0,01 bis −0,03 em), auf dem Handy mit `clamp()` kleiner. Fett (700) nur für die grössten Titel, sonst halbfett (600). Preise und Zeiten mit `font-variant-numeric: tabular-nums`.
- **Abstände** nur aus einer Reihe: 4, 8, 12, 16, 24, 32, 48 px (für Abschnitte grösser). Inhalt höchstens etwa 1200 px breit, am Handy 16 px Rand. Auf dem Computer nutzen Kopf und Abschnitte diese Breite, schmal bleibt nur der Fliesstext (etwa 70 Zeichen pro Zeile).
- **Rundungen:** drei Stufen nach Grösse (Feld, Karte, grosse Fläche), innen immer kleiner als aussen. Knöpfe entweder alle rund oder alle eckig.
- **Tiefe:** eine Methode für die ganze Seite, entweder Fläche mit Schatten oder feine Linie ohne Schatten. Schatten in der Textfarbe getönt, nie grau, höchstens zwei Stufen. Der Grund ist leicht warm, Karten sind weiss.
- **Bewegung:** Drücken 90 bis 100 ms, Wechsel 160 bis 200 ms, eine Bewegung pro Ereignis. Bei «weniger Bewegung» nur Überblenden.
- **Fokus:** 2 bis 3 px in der Aktionsfarbe mit 2 px Abstand, auf jedem Hintergrund mindestens 3 : 1.
- **Die Fehlerfarbe** nur für Fehler und Dringendes.

So beginnt eine `tokens.css` (die Kontraste dieser Farben sind nachgerechnet):

```css
/* Farbfächer von <Name>: die einzige Quelle für Farben, Schriften, Grössen, Abstände, Rundungen und Schatten. */
:root {
  /* Palette: jede Farbe einmal, mit Kontrast (Text mindestens 4,5 : 1, Knöpfe und Ränder 3 : 1) */
  --hell-grund: #faf7f2;      /* leicht warm */
  --hell-text: #1d1b18;       /* 16,0 : 1 auf --hell-grund */
  --hell-aktion: #0b5c8c;     /* 6,7 : 1 auf --hell-grund, nur für Anklickbares */
  --hell-auf-aktion: #ffffff; /* 7,1 : 1 auf --hell-aktion */
  --hell-rand: #8a8378;       /* 3,5 : 1 auf --hell-grund */
  --dunkel-grund: #171614;
  --dunkel-text: #f1ece4;     /* 15,3 : 1 auf --dunkel-grund */
  --dunkel-aktion: #7cc4f0;   /* 9,4 : 1 auf --dunkel-grund */

  /* Was die Seiten nutzen; der Dunkelmodus tauscht nur diese Zeilen */
  --farbe-grund: var(--hell-grund);
  --farbe-text: var(--hell-text);
  --farbe-aktion: var(--hell-aktion);

  /* Schriften, Grössen, Abstände, Rundungen, Schatten */
  --schrift-titel: "<Titelschrift>", Georgia, serif;
  --groesse-text: 1.0625rem;  /* 17 px */
  --abstand-4: 16px;
  --rund-klein: 6px;
  --schatten-1: 0 1px 2px rgb(29 27 24 / 0.08);
}
@media (prefers-color-scheme: dark) {
  :root { --farbe-grund: var(--dunkel-grund); --farbe-text: var(--dunkel-text); --farbe-aktion: var(--dunkel-aktion); }
}
```

## Gestaltungselemente: immer fragen

Steht die Richtung, fragst du immer: «Möchtest du noch Gestaltungselemente dazu?» Leg die Möglichkeiten mit Aufwand vor. Was im Fahrplan schon entschieden ist (`Bildsprache:` und `Maskottchen:` in `docs/konzept.md`), fragst du nicht nochmals, du baust darauf auf.

- **Icons:** ein einziger, einheitlicher Satz (zum Beispiel Lucide oder Phosphor), nie Emoji und nie zwei Sätze gemischt.
- **Illustrationen:** wenige, im gleichen Stil, für leere Stellen und Erklärungen.
- **Eigene Fotos:** eine Fotoliste, was die Person fotografieren soll (Ort, Menschen in Aktion, Details), im Fahrplan in `docs/inhalte.md`. Echte Fotos schlagen jedes erzeugte Bild.
- **Ein Maskottchen:** eine Figur, die durch die Seite führt. Zuerst ein Blatt mit vier bis sechs Posen derselben Figur, je eine für einen Moment (Willkommen, Suchen, Erfolg, leer), dann Regeln, wann sie erscheint: nie bei Fehlern, Absagen oder heiklen Momenten, nie neben Fotos von Menschen, nie hinter Listen oder Formularen. Grösse: beim Willkommen höchstens die halbe Breite, sonst klein. Sie ist Schmuck (`alt=""`), der Satz daneben stimmt auch ohne sie. Bewegte Clips laden erst, wenn sie sichtbar sind, spielen höchstens 5 Sekunden und bleiben dann stehen (WCAG 2.2.2). Jedes Bild schaust du selbst an, auch vergrössert. Ohne Guthaben bleiben die Posen bis zur Freigabe der Seite (P10) Skizzen.
- **3D:** ein Gegenstand oder die Figur als 3D-Modell, nur im Kopf der Startseite und erst ab Tablet-Breite. Zuerst steht ein Standbild, das 3D lädt erst, wenn der Kopf sichtbar ist. Auf dem Handy, ohne Grafikkarte oder bei «weniger Bewegung» bleibt das Standbild.

**Schlicht heisst nicht ohne Bild.** Will die Person keine Icons, Illustrationen oder Figuren, schlägst du trotzdem ein echtes Foto für den Kopf der Startseite vor (der Ort, die Menschen in Aktion) und gibst ihr die Fotoliste. Ein Foto ist Inhalt, kein Schmuck. Hat sie noch keins, trägt der Kopf statt einer Farbfläche mit Titel das Wichtigste aus dem Inhalt (zum Beispiel den nächsten Termin gross), und die Fotoliste steht unter «Offen» (im Fahrplan in `docs/inhalte.md`, sonst in `docs/gestaltung/richtungen.md`). Will sie auch keine Fotos, steht ihr Satz dort.

Was die Person wählt, kommt ins Designsystem (`docs/designsystem.md`) und in den Farbfächer (Grössen, Abstände, Regeln).

**Mit Albatros** entstehen Bilder, freigestellte Figuren und 3D-Modelle über die Werkzeuge von Albatros, bezahlt aus dem Guthaben der Person (Selbstkosten plus 35 %), ab Light und Pilot. Mit Gratis gibt es keine Bild-Werkzeuge: Figur, Posen und Bilder bleiben bis Light oder Pilot eine Skizze (unten, «Ohne Bild-Werkzeuge»):

- `bild_erzeugen` mit `beschreibung` und `format` (`quadrat`, `quer`, `hoch` oder `breit`), `bild_freistellen` mit `bild_url` (ein Bild mit transparentem Hintergrund), `modell_3d` mit `bild_url` (ein 3D-Modell als GLB, am besten aus einem freigestellten Bild).
- `guthaben` zeigt den Stand, die Preise und den Link zum Aufladen. Preise nennst du nur aus dieser Antwort.
- Vor dem ersten Aufruf, der etwas kostet, rufst du `guthaben` auf, nennst den Preis und fragst einmal: «Ein Bild kostet CHF …, dein Guthaben reicht für … Soll ich?» Danach nennst du nach jedem Aufruf kurz Kosten und Rest, ohne neu zu fragen. Reicht das Guthaben nicht, gibst du den Link zum Aufladen weiter.
- Jedes Ergebnis speicherst du sofort im Projekt (im Fahrplan `curl -o design/bilder/<name>.png <url>`, bei einer gebauten Seite nach `web/public/bilder/`), denn nach 7 Tagen ist es weg. Für eine Variante änderst du die Beschreibung: Dieselbe Beschreibung gibt 15 Minuten lang dasselbe Bild zurück, ohne neue Kosten.
- Jedes erzeugte Bild schaust du selbst an, bevor du es der Person zeigst. Auf die Seite kommt nur, was sie gewählt hat.
- Antwortet ein Werkzeug «kommt bald», oder Bilder «gehören zu Light und Pilot» (mit Gratis), machst du ohne Bild-Werkzeuge weiter (unten) und fragst nicht nach Guthaben.

**Mit einem eigenen Hugging-Face-Konto** geht es auch, als Alternative. Die Person legt das Konto selbst an und meldet sich selbst an. Du bindest den offiziellen Server ein: `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. Mit Codex heisst es `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, mit Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, mit Cursor der Eintrag `"huggingface": { "url": "https://huggingface.co/mcp?login" }` unter `mcpServers` in `~/.cursor/mcp.json`. Die Spaces für Bilder, Freistellen und 3D wählt sie unter huggingface.co/settings/mcp. Gratis gibt es 5 Minuten Rechenzeit pro Tag. Ohne Anmeldung bietet der Server nur die Suche im Hub.

**Rechte:** Jedes Modell hat eine Lizenz, lies sie auf der Modellseite, bevor ein Bild auf die Seite kommt. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) und TRELLIS (MIT) erlauben auch gewerbliche Nutzung, FLUX.1 dev nur nicht gewerbliche. Erzeugte Bilder zeigen keine echten Personen und keine fremden Logos. Echte Orte und Menschen kommen von eigenen Fotos mit Einverständnis.

**Ohne Bild-Werkzeuge** geht der Weg genauso: Icons aus einem freien Satz, eigene Fotos, Illustrationen aus einer freien Sammlung mit klarer Lizenz, ein Maskottchen gezeichnet oder später, kein 3D.

## Eine bestehende Seite überarbeiten

Siehst du die Seite noch nicht (kein Projekt im Ordner, keine Adresse), erklär zuerst den ganzen Weg in fünf kurzen Schritten: prüfen, Bedienung reparieren, drei klar verschiedene Richtungen wählen, Farbfächer festlegen, umbauen. Erst danach fragst du, wo die Seite liegt.

### 0. Rahmen (5 Minuten)

Aus `docs/projekt.md` und `docs/plan.md` (Skill `webseite-planen`) übernehmen: für wen (`Für wen:`), Hauptsache für Besucher (`Hauptsache:`), Seiten (`Seiten:`). Dazu fragen: Was muss bleiben (Logo, Farbe, Schrift, Texte)? Lege `docs/gestaltung/` an.

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
- **Menü auf dem Handy:** Bei 390 px passt es auf eine Zeile, sonst wird es ein Knopf «Menü», der die Liste aufklappt (ohne JavaScript mit `<details>`). Ein Menüpunkt allein auf einer zweiten Zeile ist ein Fehler.

### 3. Drei Richtungen

Nach dem Abschnitt «Drei Richtungen», mit zwei bis drei Seiten der bestehenden Seite. `docs/gestaltung/richtungen.md`: oben die Zeile `Entscheid: <Richtung oder Mischung> (<Datum>)`, darunter Diagnose und pro Richtung eine Tabelle (Idee, Schrift, Farben, Formen, Stärke, Risiko), dazu die Zeile `KI-Merkmale geprüft: …`. Die Richtungen als HTML-Dateien in `design/richtungen/`, wie im Fahrplan, damit die Person sie im Browser öffnen kann.

### 4. Der Farbfächer

Nach dem Abschnitt «Der Farbfächer (Tokens)», in `design/tokens.css`, dazu `docs/designsystem.md` wie im Fahrplan (Schritt 4 oben); daran baut später der Skill `webseite-aendern` weiter. Hat eine ältere Seite ihre Tokens noch in `web/src/styles/tokens.css`, ziehst du sie dabei um: Das Layout bindet nur noch `design/tokens.css` ein, die alte Datei fällt weg. Dazu die Frage nach Gestaltungselementen (Abschnitt «Gestaltungselemente»).

### 5. Umbau

Inhalt und Abläufe bleiben. Zuerst die Grundlage (Tokens einbinden, gemeinsame Teile, eine Vorbild-Seite), dann die übrigen Seiten. Fehlt ein Wert im Farbfächer, ergänzt du ihn dort, nicht im Code der Seite. Ist die Seite schon live, zeigst du die geänderten Seiten zuerst als Entwurf und holst die Freigabe zum Bauen (Skill `entwurf`), dann gilt der Skill `webseite-aendern`.

### 6. Fotos und Freigabe

Jede Seite fotografieren, in Handybreite und Desktopbreite, hell und dunkel. Läuft die Seite noch nicht im Netz, nimmst du die Adresse der Vorschau (`http://localhost:4321`):

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Jedes Foto selbst anschauen und mit dem Entwurf vergleichen: Hat der Text auf dem Handy links und rechts Luft? Ist nichts abgeschnitten oder versetzt? Passt das Menü auf eine Zeile? Wirkt der Computer nicht leer, mit einer schmalen Spalte in der Mitte? Erst dann der Person zeigen. Nach ihrem Ja: Logbuch (Skill `git-logbuch`), Fliessband (Skill `pipeline`).

## Stolpersteine

- Aussehen vor Bedienung oder vor dem Aufbau: schreibt die Fehler fest.
- Drei Richtungen, die sich nur in der Farbe unterscheiden: keine echte Wahl.
- Farben von Hand im Code oder im Musterblatt: Dann bricht der Dunkelmodus, und das Musterblatt zeigt etwas anderes als die Seiten.
- Kontraste geschätzt statt nachgerechnet.
- Das Musterblatt nur am Computer gezeigt: Der Kopf mit Menü auf dem Handy gehört dazu.
- «Fertig» sagen, ohne die Seiten oder Fotos selbst angeschaut zu haben.

## Mission prüfen

`mission_pruefen` mit `flugschule-19-musterblatt`. Die Prüfung schaut, ob das Projekt auf der Insel mindestens beim Schritt «Entwürfe» steht; im Fahrplan meldest du ihn erst, wenn die Person das Musterblatt gesehen hat. Auf dem Weg Webseite gibt es dazu die freiwillige Mission `webseite-04-gestaltung` (Gestaltungselemente): Hat die Person Gestaltungselemente gewählt, prüfst du auch sie mit `mission_pruefen`.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «erst das Fundament, dann die Fassade», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt; im Fahrplan ist das P7, die ganze Seite als Entwurf zum Durchklicken (Skill `entwurf`).
