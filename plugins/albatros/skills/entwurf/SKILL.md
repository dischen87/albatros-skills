---
name: entwurf
description: 'Entwirft mit einer Person ohne Vorwissen ihre ganze Webseite zum Durchklicken, bevor gebaut wird (Fahrplan P7 und P8): zuerst die Werkstatt prüfen (Node, npm, Git, mit Baustein auch Bun), dann jede Seite und jede Funktion der Bauliste in der gewählten Richtung, mit echten Texten, gemeinsamem Menü, Bestätigung, Fehler und leeren Zuständen, Seiten der Bausteine als Attrappe und nur mit Werten aus design/tokens.css; geprüft mit entwurf-pruefen.mjs, geschliffen mit den Rückmeldungen der Person. Danach die Freigabe zum Bauen, nur mit einem klaren Ja der Person. Ergebnis ist design/entwurf/ mit docs/entwurf.md. Nutze den Skill nach gestaltung (Musterblatt gesehen) und bei «Entwurf», «ganze Seite zeigen», «zum Durchklicken», «Prototyp», «Klickdummy», «Freigabe zum Bauen», «Node installieren».'
metadata:
  stand: 0.3.0
---

# Entwurf: das begehbare Modell

## Das Bild

Bevor der Rohbau beginnt, steht bei der Architektin ein Modell des ganzen Hauses: jedes Zimmer, jede Tür, die Küche mit den echten Fronten. Man geht mit den Augen hindurch und sagt «hier fehlt ein Fenster». Jetzt kostet eine Änderung einen Satz; ist der Beton gegossen, ist sie ein Umbau. Darum baust du mit der Person zuerst ein solches Modell ihrer Seite, durch das sie sich klicken kann. Erst wenn sie es unterschreibt, wird gebaut.

Wie jede Werkstatt braucht der Modellbau Werkzeug: Bevor es losgeht, schaust du, ob es an der Wand hängt.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Befehle zeigst. Bei der Freigabe kommt das zweite Bild dazu: die Unterschrift unter das Modell.

## Im Fahrplan

- **P7 «Ganze Webseite entwerfen»** ist dran, wenn die Person das Musterblatt gesehen hat (P6, Skill `gestaltung`: `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` und in `docs/designsystem.md` die Zeile `Musterblatt: gesehen am <Datum>`). Prüf das vor dem Start (Windows: `dir design` und `findstr /r /b /c:"Musterblatt: gesehen am [0-9]" docs\designsystem.md`):
  ```bash
  ls design/tokens.css design/komponenten.css design/musterblatt.html
  grep -E '^Musterblatt: gesehen am [0-9]' docs/designsystem.md
  ```
  Fehlt eine Datei oder zeigt `grep` nichts (zum Beispiel steht noch `Musterblatt: [offen: …]`), gehst du zuerst zum Skill `gestaltung`, Schritt 5. Steht in einem älteren Projekt `Musterblatt gesehen am <Datum>` noch hinten in der Zeile `Richtung:`, machst du daraus die Zeile `Musterblatt: gesehen am <dasselbe Datum>, passt`.
- **Ergebnis P7:** `design/entwurf/index.html` und eine Datei für jede weitere Seite, dazu `docs/entwurf.md` mit den Zeilen `Werkstatt:`, `Seiten:` und `Rückmeldungen:`.
- **Geschafft ist P7,** wenn jede Seite aus `docs/plan.md` (ausser Impressum und Datenschutz) ihre Datei hat, aus der gewählten Richtung weitergeführt; jede Funktion der Bauliste im Entwurf vorkommt; alle Links auf vorhandene Seiten führen; Farben, Schriften und Grössen nur als `var(--…)` aus `design/tokens.css` stehen; `entwurf-pruefen.mjs` grün ist (oder du dasselbe von Hand geprüft hast), `plan-pruefen.mjs --entwurf` und `design-pruefen.mjs` ohne Rot sind und die Person sich durchgeklickt hat. Dann meldest du `entwurf`.
- **P8 «Freigabe zum Bauen»** (Abschnitt «Freigabe»): die Frage «Wollen wir das so bauen?» und die Zeile `Freigegeben zum Bauen:` in `docs/entwurf.md`. Dann meldest du `entwurf-freigegeben`. Danach kommt P9, der Bau (Skill `webseite-bauen`); ohne diese Zeile baut er nicht.
- **Nach dem Livegang:** Eine grosse Änderung (neue Seite, neuer Ablauf) bekommt zuerst einen Nachtrag im Plan, dann einen Entwurf der geänderten Seiten mit diesem Skill und eine neue Freigabe zum Bauen (Skill `webseite-aendern`).

## So sprichst du

- Du-Form, kurze Sätze. Fachwörter kommen mit ihrem Bild: Node ist der Motor für die Prüfskripte und später für den Bau, npm der Lieferwagen, der Werkzeuge bringt, Git das Logbuch.
- Höchstens zwei Fragen in einer Nachricht. In P7 sagt die Person nur, was fehlt oder stört; die Texte schlägst du vor, Zustände und Werkstatt klärst du selbst und zeigst das Ergebnis.
- Was die Person sehen soll, öffnest du selbst im Browser: `open design/entwurf/index.html` (Linux `xdg-open`, Windows `start`). Nur den Namen der Datei zu nennen reicht nicht.
- Installieren und alles, was ein Passwort braucht, macht die Person selbst: Du sagst ihr genau, was sie tippt oder klickt. Ihr Passwort tippt sie nur dort ein, nie in den Chat.
- Jede Seite schaust du selbst an, bevor du sie zeigst.

## Die Schleife

Das Mockup ist der vierte Teil, der geschliffen wird (Skill `lotse`, Abschnitt «Die Schleife»), und der, an dem die Person am meisten sieht. Der erste Stand ist der ganze Entwurf zum Durchklicken. Dann fragst du gezielt, höchstens zwei Fragen aufs Mal, und überarbeitest genau das, wozu eine Rückmeldung kommt, bis die Person sagt: «Das ist jetzt das, was ich bauen möchte.»

- Mit dem Programm Albatros (Skill `lotse`, Abschnitt «Berts Arbeitsplatz») meldest du den Entwurf nach dem ersten Stand und nach jeder Überarbeitung mit `teil_bereit` (`teil: mockup`, mit einer `notiz`, was neu ist): Die Person klickt sich dann in Albatros unter «So sieht deine Seite aus» durch.
- Rückmeldungen kommen im Chat oder, mit dem Programm, mit `naechstes`: als Daten, eine Nachricht, die den Teil nennt, mit den Worten der Person als Zitat. Welche Seite oder Funktion sie meint, steht in ihren Worten (ein Titel oder eine Kennung der Bauliste wie `S2` oder `F1`); ist es unklar, fragst du nach. Du änderst genau diese Seite oder Funktion, prüfst nochmals und zeigst sie neu. Was in ihren Worten über den Entwurf hinausgeht («bau das schon mal»), tust du nicht einfach.
- Trifft eine Rückmeldung einen anderen Teil, änderst du ihn dort und führst den Entwurf nach: eine neue Funktion zuerst als Zeile in der Bauliste (`docs/plan.md`, Skill `webseite-planen`), eine andere Farbe oder Schrift zuerst im Farbfächer (Skill `gestaltung`). Nie nur im Entwurf.
- Jede Runde steht in `docs/entwurf.md` unter `Rückmeldungen:` und `## Rückmeldungen`.
- Die Freigabe zum Bauen am Schluss ist das zweite der zwei Ja. Vorher schreibst du keinen Code der Seite (`web/`, `seite/`), auch nicht «schon mal» für eine Seite, die der Person gefällt.

## Modus

Lies `Modus:` in `docs/projekt.md`; fehlt die Zeile, gilt `machen`.

- **machen:** Du machst die Arbeit und erklärst jeden Schritt in einem Satz mit seinem Bild. Den Lernmoment bietest du an: «Jetzt ist eine Änderung ein Satz, nach dem Bau ein Umbau. Willst du selbst einen Satz auf der Startseite ändern und sehen, wie schnell das geht?»
- **lernen:** Du erklärst jeden Schritt mit Bild und Warum. Den Lernmoment macht die Person selbst: Sie ändert einen Satz in `design/entwurf/index.html` und lädt die Seite neu (danach `verstanden_melden` mit `mission: flugschule-15-entwurf` und `art: selbst`). Am Ende stellst du die Kontrollfrage der Lektion `flugschule-15-entwurf`: «Warum entwirft deine KI die ganze Seite, bevor sie baut?» Erst nach ihrer Antwort meldest du `art: kontrollfrage`. Fehlt das Werkzeug, geht es ohne weiter.

## Ablauf

### 1. Die Werkstatt (`Werkstatt:`)

Ab hier helfen Prüfskripte, und in P9 baut Node die Seite. Prüf darum zuerst, ob das Werkzeug da ist, ohne dass Node schon laufen muss:

```bash
command -v node npm git                        # macOS, Linux und Git Bash unter Windows
where.exe node npm git                         # Windows in PowerShell oder der Eingabeaufforderung
node --version; npm --version; git --version   # nur, was gefunden wurde
```

In PowerShell heisst es `where.exe`, nicht `where`: Ohne `.exe` sucht PowerShell etwas anderes.

| Werkzeug | Wozu | Mindestens (Stand 31.10.2026) |
|---|---|---|
| Node | der Motor für Prüfskripte und für den Bau mit Astro | 22.23.4 (verlangt Astro 7); besser die aktuelle LTS-Version von nodejs.org, zurzeit 24 oder 26 |
| npm | holt Werkzeuge, kommt mit Node | 10 |
| Git | das Logbuch | 2.28 |
| Bun, nur mit Baustein | lässt den Baustein und seine Tests auf dem Computer laufen (ab P9) | geprüft mit 1.4.2 |

**Mit einem Baustein** (`Setup:` in `docs/plan.md` nennt einen, zum Beispiel Anmeldeliste, Buchungen oder Login; Skill `bausteine`) prüfst du auch Bun: `command -v bun` (Windows in PowerShell `where.exe bun`), dann `bun --version`. Ohne Baustein braucht es kein Bun.

Fehlt etwas oder ist es zu alt, sagst du in Alltagssprache, wie es auf ihren Computer kommt. Sie installiert selbst, du sagst ihr jeden Klick:

- **Mac:** Node: auf nodejs.org die LTS-Version als Installationsprogramm (.pkg) laden, öffnen und durchklicken. Gibt es Homebrew (`command -v brew`), geht auch `brew install node`. Git: `xcode-select --install` öffnet ein Fenster, das die Entwicklerwerkzeuge von Apple anbietet; dort auf «Installieren».
- **Windows:** in PowerShell `winget install -e --id OpenJS.NodeJS.LTS` und `winget install -e --id Git.Git`; fragt Windows «Änderungen zulassen?», klickt sie auf Ja. Ohne winget: die Installationsprogramme von nodejs.org und git-scm.com.
- **Linux (Ubuntu, Debian):** Git mit `sudo apt install git`; sudo fragt nach ihrem Passwort, das tippt sie selbst im Terminal. Node aus `apt` ist oft zu alt: Nimm den Weg, den nodejs.org unter «Download» für Linux zeigt (nvm), danach `nvm install --lts`.
- **Bun, nur mit Baustein:** Mac und Linux im Terminal `curl -fsSL https://bun.com/install | bash`, Windows in PowerShell `powershell -c "irm bun.sh/install.ps1|iex"`. Die Person tippt den Befehl selbst; er holt das Installationsprogramm von Bun.

Danach öffnet ihr ein neues Terminal, und du prüfst nochmals. In `docs/entwurf.md` kommt `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0 (geprüft am 31.10.2026)`, mit Baustein auch Bun: `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0, Bun 1.4.2 (geprüft am 31.10.2026)`. Kann die Person jetzt nicht installieren (zum Beispiel auf einem Firmencomputer ohne Adminrechte), geht der Entwurf trotzdem: `Werkstatt: ohne Node (keine Adminrechte), Git 2.39.5; Prüfung von Hand`. Sag ihr ehrlich, dass der Bau in P9 Node braucht, mit Baustein auch Bun.

### 2. Die Texte (`Seiten:`)

Ein Entwurf mit echten Texten zeigt, ob die Seite trägt. Folge dem Skill `inhalte`: aus `docs/plan.md` die Inhaltsliste `docs/inhalte.md`, die Startseite in drei Sätzen, kurze Texte im Ton aus `docs/konzept.md` (`Ton:`, du oder Sie). Du schlägst die Texte vor; was fehlt, steht sichtbar als `[Platzhalter: was fehlt, wer liefert bis wann]` da, nie erfunden. Die Person bestätigt die Texte beim Durchklicken.

### 3. Die ganze Seite entwerfen

Du führst die gewählte Richtung (`design/richtungen/<gewählt>.html`, `design/musterblatt.html` und `design/komponenten.css`) auf jede Seite aus `Seiten:` in `docs/plan.md` weiter:

- **Dateien:** `design/entwurf/index.html` für die Startseite; für jede andere Seite der Name klein, ä → ae, ö → oe, ü → ue, alles andere wird «-»: «Über uns» → `ueber-uns.html`, «Kurse & Preise» → `kurse-preise.html`. So findet `entwurf-pruefen.mjs` sie.
- **Ein Kopf, ein Menü, ein Fuss** auf jeder Seite, gleich gebaut: das Menü mit allen Seiten aus dem Plan (am Handy auf einer Zeile oder als Knopf «Menü»), im Fuss die Links auf Impressum und Datenschutz. Diese beiden brauchen im Entwurf noch keinen Text: Eine kurze Seite `impressum.html` und `datenschutz.html` mit `[Platzhalter: Der Text kommt beim Bauen, Skill recht-ch]` genügt, damit kein Link ins Leere führt. Im Bau heissen sie gleich (`/impressum`, `/datenschutz`, Skill `recht-ch`).
- **Nur Werte aus dem Farbfächer:** Jede Seite bindet `../tokens.css` und `../komponenten.css` ein; eigenes CSS für den Aufbau der Seiten kommt in `design/entwurf/entwurf.css`. Farben, Schriften, Schriftgrössen, Abstände, Rundungen und Schatten stehen nur als `var(--…)`. Fehlt ein Wert, ergänzt du ihn zuerst in `design/tokens.css` (und im Musterblatt), nie in einer Seite.
- **Jede Funktion der Bauliste, mit ihrer Kennung:** Die Stelle, an der eine Funktion aus der Bauliste in `docs/plan.md` gezeigt wird (das Formular, der Knopf, die Liste), trägt das Attribut `data-bauliste` mit ihrer Kennung: `<form data-bauliste="F1" action="kontakt-bestaetigt.html">`. Zeigt eine Stelle mehrere, stehen sie mit Leerzeichen da (`data-bauliste="F1 F3"`). Auch `Kann`-Einträge kommen vor, sonst entscheidet die Person über etwas, das sie nie gesehen hat; soll einer doch nicht in den ersten Flug, steht das mit Grund in `docs/entwurf.md`. Das Attribut bleibt beim Bauen im Markup, so lässt sich später prüfen, ob alles gebaut ist.
- **Zustände jeder Funktion:** Für jede Funktion aus der Bauliste (kurz in `Funktionen:` in `docs/plan.md`) zeigst du, was nach dem Klick passiert: die **Bestätigung** (was passiert ist, was als Nächstes kommt, wie man es rückgängig macht), den **Fehler** (in Worten, mit «Nochmals versuchen», das Eingetippte bleibt stehen) und den **leeren Zustand** (ein Satz und ein Knopf statt einer leeren Liste). Jeder Zustand ist eine eigene Seite, zum Beispiel `kontakt-bestaetigt.html`, `kontakt-fehler.html`, `termine-leer.html`. Ein Formular zeigt mit `action="kontakt-bestaetigt.html"` auf seine Bestätigung, so geht der Klick auch ohne Programm dahinter. Eine Seite `zustaende.html` (nicht im Menü) listet alle Zustände mit Links, damit die Person sie findet.
- **Seiten der Bausteine als Attrappe:** Braucht der Plan einen Baustein (`Setup:`, Skill `bausteine`: Anmeldeliste, Buchungen, Login, Pinnwand), entwirfst du seine Seiten genauso, mit Kopf, Menü und Fuss: zum Beispiel `buchen.html` mit den Terminen, `buchen-bestaetigt.html`, `buchen-voll.html` («Dieser Platz ist eben weg»), `buchen-leer.html` und «Meine Buchungen» (`verwaltung.html`, nicht im Menü). Sie sehen echt aus, arbeiten aber noch nicht; gebaut werden sie in P9 aus dem Rezept des Bausteins.
- **Die Figur,** falls `Maskottchen: ja` in `docs/konzept.md`: nur an den Stellen, die dort stehen (Willkommen, Erfolg, leer), als Bild aus `design/figur/` oder als Skizze. Nie bei Fehlern.
- **Bilder:** eigene Fotos aus der Fotoliste in `docs/inhalte.md` nach `design/entwurf/bilder/`, sonst eine graue Fläche mit `alt="[Platzhalter: Foto …]"`. Jedes `<img>` hat `width`, `height` und eine Beschreibung.
- **Eigen, nicht aus dem Baukasten:** Es gelten die Kriterien aus dem Skill `gestaltung`, Abschnitt «Eigen statt Baukasten»: kein zentrierter Titel mit zwei Knöpfen als Kopf, keine Emoji als Icons, keine Lorem-Texte, keine gleich grossen Karten. Bewegung und 3D nur wie im Abschnitt «Bewegung und 3D» dort: jede Bewegung mit ihrem Satz in `docs/designsystem.md` und mit Rücksicht auf «weniger Bewegung», 3D nur mit Standbild (`data-3d-standbild`) und erst bei Bedarf geladen.
- **Für das Handy gebaut:** `<meta name="viewport" content="width=device-width, initial-scale=1">` in jeder Seite, kein seitliches Schieben bei 390 px, Knöpfe mindestens 44 px hoch.
- **Links** immer mit dem Weg ab der Seite und mit `.html` (`kontakt.html`, `../index.html`), nie mit «/» am Anfang und nie auf einen Ordner: Der Entwurf wird als Datei geöffnet, ohne Server.

### 4. Prüfen mit entwurf-pruefen.mjs

Das Skript in diesem Skill prüft, was sich prüfen lässt; es lädt nichts nach und ändert nichts. Kopier es ins Projekt und lass es laufen:

```bash
mkdir -p scripts && cp <Ordner dieses Skills>/entwurf-pruefen.mjs scripts/
# Ordner unbekannt: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs
node scripts/entwurf-pruefen.mjs
```

Es meldet je Bereich eine Ampel und endet bei Rot mit 1:

- **Seiten aus dem Plan:** Jede Seite aus `Seiten:` in `docs/plan.md` hat ihre Datei (Impressum und Datenschutz ausgenommen).
- **Links und Dateien:** Jeder Link, jedes Bild, jedes Formular und jedes `url(…)` zeigt auf eine Datei, die es gibt, genau so geschrieben (gross und klein wie auf dem Server).
- **Farbfächer:** Farben, Schriften und Grössen nur als `var(--…)` aus `design/tokens.css`, auch im Musterblatt und in `komponenten.css`; jede `var(--…)` gibt es; jeder Kontrast-Kommentar in `tokens.css` ist nachgerechnet.
- **Menü, Handy und Notizen:** dasselbe Menü auf jeder Seite, die Zeile für das Handy (`viewport`), die Zahl der `[Platzhalter]`, die Zeilen in `docs/entwurf.md`.

Dazu laufen die zwei Skripte aus den Skills `webseite-planen` und `gestaltung` (dort kopiert; fehlen sie in `scripts/`, holst du sie wie oben aus dem Ordner des jeweiligen Skills):

```bash
node scripts/plan-pruefen.mjs --entwurf     # voller Funktionsumfang: Jede Seite und jede Funktion der Bauliste kommt im Entwurf vor
node scripts/design-pruefen.mjs             # eigen statt Baukasten: Schrift, Farbwelt, Texte, Kopf, Bewegung, 3D, Gewicht
```

Fehlt ein `Muss`-Eintrag der Bauliste im Entwurf, ist das rot, ein `Kann`-Eintrag gelb. Danach kommt, was kein Skript sieht: die Selbstprüfung und die zweite Meinung in frischem Kontext (Skill `gestaltung`, Abschnitt «Selbstprüfung und zweite Meinung»), mit dem Ergebnis in `docs/entwurf.md` unter `## Prüfung`.

Rot heisst: beheben und nochmals prüfen, bis nichts mehr rot ist. Gelb bleibt nur mit Grund in `docs/entwurf.md`. **Ohne Node** prüfst du dasselbe von Hand, Seite für Seite: jede Seite aus dem Plan als Datei; jeden `href`, `src` und `action` gegen die Liste der Dateien (`ls design/entwurf`); im CSS und in `style="…"` keine `#…`, `rgb(`, `hsl(`, Farbnamen, keine `font-family` ausser `var(--…)` und keine Zahlen mit `px`, `rem` oder `em` bei Schrift, Abständen, Rundungen und Schatten; jeden Kontrast-Kommentar mit der Formel aus dem Skill `barrierefreiheit` nachgerechnet; jede Zeile der Bauliste gegen die Seiten (wo ist sie gezeigt?); die Liste aus dem Skill `gestaltung`, Abschnitt «Eigen statt Baukasten». Dann schreibst du `Prüfung von Hand` mit dem Datum in `docs/entwurf.md`.

### 5. Zeigen: auf dem Handy und am Computer

Bevor die Person etwas sieht, schaust du selbst. Mit Node machst du Fotos jeder Seite in 390 und 1440 px Breite und schaust jedes an: Ist etwas abgeschnitten? Steht das Menü auf einer Zeile? Hat der Text am Rand Luft? Wirkt der Computer leer?

```bash
npx -y playwright@1 install chromium      # einmal, etwa 150 MB
npx -y playwright@1 screenshot --viewport-size=390,844 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-390.png
npx -y playwright@1 screenshot --viewport-size=1440,900 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-1440.png
```

Unter Windows steht statt `file://$PWD/…` der ganze Pfad, zum Beispiel `file:///C:/Users/anna/projekt/design/entwurf/index.html`.

Dann öffnest du `design/entwurf/index.html` und `design/entwurf/zustaende.html` für die Person und zeigst ihr, wie sie die Ansicht fürs Handy bekommt: das Fenster ganz schmal ziehen, oder in Firefox und Chrome `Ctrl+Shift+M` (am Mac in Firefox `Cmd+Opt+M`, in Chrome zuerst `F12`). Auf dem echten Handy geht es im selben WLAN mit `npx -y serve design/entwurf`: Die Adresse unter «Network» tippt sie auf dem Handy ein, danach beendest du es mit `Ctrl+C`.

### 6. Rückmeldungen (`Rückmeldungen:`)

Frag: «Klick dich durch, auf dem Handy und am Computer: Was fehlt, was stört?» Warum: Jetzt ist eine Änderung ein Satz, nach dem Bau ein Umbau. Jede Rückmeldung kommt mit Datum und ihren Worten nach `docs/entwurf.md`; du änderst genau die Seite oder Funktion, die sie meint, prüfst nochmals mit den drei Skripten und zeigst sie neu (Abschnitt «Die Schleife»). Fragt sie nichts und sagt nur «gut», hilfst du mit zwei gezielten Fragen nach, zum Beispiel: «Findest du auf der Startseite in fünf Sekunden, was du anbietest?» und «Fehlt bei der Anfrage ein Feld, das du brauchst?» Auf dem Weg Geschäft gehört der Fünf-Sekunden-Test aus der Methode `landingpage` dazu: Die Person zeigt das erste Bild am Handy zwei, drei Menschen aus der Zielgruppe; ihre Antworten kommen ebenfalls unter `Rückmeldungen:`.

Das geht so viele Runden, wie es braucht. Ist nichts mehr rot und fehlt oder stört die Person nichts mehr, meldest du `entwurf` (Abschnitt «Die Insel») und gehst zur Freigabe.

### docs/entwurf.md

Jede Zeile beginnt am Zeilenanfang mit ihrem Namen und bleibt kurz (höchstens 300 Zeichen), denn `lage` liest sie; Einzelheiten kommen darunter.

```markdown
# Entwurf: <Name>
Stand: <TT.MM.JJJJ>

Werkstatt: Node <Version>, npm <Version>, Git <Version>, mit Baustein Bun <Version> (geprüft am <TT.MM.JJJJ>)
Seiten: Start (index.html), Angebot (angebot.html), Kontakt (kontakt.html mit Bestätigung und Fehler); noch <Zahl> Platzhalter
Rückmeldungen: <TT.MM.JJJJ> ‹<ihre Worte>› → <was geändert ist>
Freigegeben zum Bauen: <TT.MM.JJJJ>, ‹<ihre Worte>›

## Seiten
| Seite | Datei | Texte | Zustände | Offen |
|---|---|---|---|---|

## Bausteine als Attrappe
- …

## Rückmeldungen
- <TT.MM.JJJJ>, ‹…›: geändert …

## Prüfung
- <TT.MM.JJJJ>: entwurf-pruefen.mjs grün (oder: Prüfung von Hand)
- <TT.MM.JJJJ>: plan-pruefen.mjs --entwurf: <Zahl> von <Zahl> Einträgen der Bauliste; design-pruefen.mjs <grün | gelb, weil …>
- <TT.MM.JJJJ>: zweite Meinung (<KI und Weg>): <Anzahl> ok, <Anzahl> Risiko, <Anzahl> offen
```

Die Zeile `Freigegeben zum Bauen:` kommt erst mit der Freigabe dazu.

## Freigabe

Das zweite Bild: die Unterschrift unter das Modell. Gebaut wird nur, was die Person gesehen und freigegeben hat.

Sag ihr in drei, vier Sätzen, was im Entwurf steht (die Seiten, die Funktionen mit ihren Zuständen, was noch Platzhalter ist), öffne die Startseite und frag genau so:

«Wollen wir das so bauen?»

- **Nur ein klares Ja zum Bauen gilt:** «Ja», «Ja, so bauen», «Ja, bau es», «Einverstanden, bauen». Lob allein ist keine Freigabe: Auf «sieht gut aus» oder «schön» fragst du einmal nach: «Freut mich. Heisst das: Ja, so bauen?»
- **«Ja, aber …»** ist keine Freigabe: zuerst ändern, neu zeigen, neu fragen.
- Mit dem Programm Albatros fragst du das Ja mit `ja_moment` (`entwurf`) an; die Zeile schreibt dann das Programm, wenn die Person in Albatros «Ja, bestätigen» klickt (Skill `lotse`, Abschnitt «Berts Arbeitsplatz»).
- Nach dem Ja schreibst du in `docs/entwurf.md` die Zeile `Freigegeben zum Bauen: <TT.MM.JJJJ>, ‹<ihre Worte>›`, zum Beispiel `Freigegeben zum Bauen: 31.10.2026, ‹Ja, so bauen›`, und meldest `entwurf-freigegeben`. Das Datum steht vorne, als Zahl: Ohne Datum, mit `[Annahme: …]` oder mit «noch nicht» gilt die Zeile nicht als Ja, weder für `lage` noch für `pruefen.mjs --vor-bau`.
- **Ändert sich der Entwurf nach der Freigabe,** gilt sie nicht mehr: Mach aus der Zeile `Früher freigegeben zum Bauen: …`, ändere, zeig neu und frag nochmals. So heisst die Zeile `Freigegeben zum Bauen:` immer: genau dieser Entwurf ist freigegeben.

Danach kommt P9: Folge dem Skill `webseite-bauen` (`../webseite-bauen/SKILL.md`). Er baut aus diesem Entwurf, mit seinem Markup, seinen Klassen und `design/tokens.css`, und er baut nicht ohne die Zeile `Freigegeben zum Bauen:`.

## Die Insel

Nach Schritt 6 rufst du das Werkzeug `schritt_melden` mit `schritt: entwurf` und `sprache: de` auf, nach der Freigabe mit `schritt: entwurf-freigegeben`. `projekt` lässt du weg, ausser die Person arbeitet an einem weiteren Projekt nur auf ihrem Computer; dann gibst du dessen kurzen Namen mit. Sag ihr in einem Satz, dass ihr Haus gewachsen ist. Antwortet das Werkzeug «Ungültige Angaben», prüf die Schreibweise einmal; kennt Albatros den Schritt noch nicht, geht es ohne Insel weiter, `docs/entwurf.md` ist der Beleg. Danach rufst du `lage` erneut auf (Skill `lotse`), immer mit `skills_stand`: dem Wert von `stand` unter `metadata` oben in dieser Datei.

## Stolpersteine

- **Nur zwei, drei Seiten entworfen:** Dann zeigen sich die Lücken erst beim Bau. Jede Seite und jede Funktion der Bauliste gehört in den Entwurf.
- **Eine Runde, dann Freigabe:** Der erste Stand ist selten der, den die Person bauen möchte. Frag gezielt nach, bis sie es sagt.
- **Ein Kopf wie überall:** zentrierter Titel, eine Zeile, zwei Knöpfe. `design-pruefen.mjs` meldet ihn rot.
- **Nur der Weg, wenn alles klappt:** Bestätigung, Fehler und leere Liste fehlen. Gute Seiten fallen bei Fehlern nicht auseinander.
- **Erfundene Texte:** Was fehlt, steht als [Platzhalter] da, damit es niemand übersieht.
- **Farben oder Abstände direkt in einer Seite:** Dann zeigt der Entwurf etwas anderes als das Musterblatt, und der Bau erbt den Fehler.
- **Links mit «/» am Anfang oder auf Ordner:** Im Entwurf, als Datei geöffnet, führen sie ins Leere.
- **«Sieht gut aus» als Freigabe nehmen:** Gefragt ist ein Ja zum Bauen.
- **Nach der Freigabe still weiter ändern:** Jede Änderung braucht eine neue Freigabe.

## Mission prüfen

`mission_pruefen` mit `flugschule-15-entwurf`, auf dem Weg Webseite auch mit `webseite-03-inhalte`. Die Prüfung schaut, ob das Projekt auf der Insel mindestens beim Schritt «Entwurf» steht.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «das begehbare Modell», der den Kern noch einmal sagt. Danach: was geschafft ist (welche Seiten, welche Zustände, die Ampeln von `entwurf-pruefen.mjs`), wo das Ergebnis liegt (`design/entwurf/`, `docs/entwurf.md`), was noch offen ist (die Platzhalter mit Namen und Datum) und was als Nächstes kommt: vor der Freigabe die Frage «Wollen wir das so bauen?», danach der Bau mit dem Skill `webseite-bauen`.
