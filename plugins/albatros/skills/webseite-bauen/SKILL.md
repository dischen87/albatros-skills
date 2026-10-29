---
name: webseite-bauen
description: 'Baut mit einer Person ohne Vorwissen ihre Webseite in acht festen Schritten: Mockup, Design (zwei bis drei Vorschläge nach Eigenschaften), Framework, PRD zum Abnehmen, lokal bauen und zeigen, in den Hafen schicken und dort im Browser zeigen, Fliessband, Seite oder Server. Öffnet die Insel im Cockpit und meldet jeden Schritt mit schritt_melden. Nutze den Skill, sobald auf dem Weg Webseite gebaut wird: nach webseite-planen, nach der Bestandsaufnahme von webseite-modernisieren, bei «bau mir die Seite», «Mockup», «Entwurf», «PRD», «lokal anschauen», «wie geht es nach dem Plan weiter».'
---

# Webseite bauen: vom Grundriss zum fertigen Haus

## Das Bild

Ein Haus entsteht in einer festen Reihenfolge: zuerst eine Skizze, dann Ansichten zur Wahl, dann der Bauplan mit Unterschrift, dann der Bau, dann der Einzug. Niemand giesst das Fundament, bevor die Familie den Plan unterschrieben hat. Auf der Insel im Cockpit wächst das Haus mit jedem Schritt mit.

**So setzt du das Bild ein:** Ein Satz dazu in deiner ersten Antwort, mit dem Schritt, bei dem ihr gerade seid.

## So sprichst du

- Die Reihenfolge ist fest. Du überspringst keinen Schritt und baust nichts, bevor die Person das PRD abgenommen hat.
- Du schlägst den nächsten Schritt vor und machst ihn nach einem kurzen Ja. Die Person muss nie wissen, was als Nächstes kommt.
- Du-Form, Alltagssprache. «PRD» erklärst du beim ersten Mal: der Bauplan mit Unterschrift, auf einer Seite.
- Webseiten bleiben statisch, ohne eigene Dienste. Ein Baustein (Skill `bausteine`) kommt nur dazu, wenn die Person ihn wirklich braucht.
- Was die Person sehen soll (Insel, Mockup, Entwürfe, Vorschau, Hafen, fertige Seite), öffnest du selbst im Browser: `open <adresse oder datei>` (Linux `xdg-open`, Windows `start`). Nur die Adresse zu nennen reicht nicht.

## Die Insel

Gleich zu Beginn öffnest du die Insel der Person im Browser. Unter `https://albatros.build/cockpit/insel` steht für jedes Projekt ein Haus, das mit jedem Schritt wächst. Für Französisch, Italienisch und Englisch steht das Präfix davor, zum Beispiel `/fr/cockpit/insel`:

```bash
open https://albatros.build/cockpit/insel        # macOS; Linux: xdg-open, Windows: start
```

Die Insel lädt sich selbst nach, einmal öffnen reicht.

Nach jedem geschafften Schritt rufst du das Werkzeug `schritt_melden` von Albatros auf, mit `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `hafen`, `fliessband`, `live`, `domain`) und `sprache` (die Sprache des Gesprächs). `projekt` lässt du im Normalfall weg: Dann gilt das Logbuch im Hafen (`git@aufwind.sh:<name>/projekt.git`), auch wenn es erst später entsteht. Nur für ein weiteres Projekt, das bloss auf dem Computer liegt, gibst du einen kurzen Namen aus Kleinbuchstaben, Ziffern und «-» mit. Die Antwort nennt den Schritt und die Adresse der Insel. Sag der Person in einem Satz, dass ihr Haus gewachsen ist.

- Die Insel geht nur vorwärts. Meldest du einen Schritt, der schon steht, ändert sich nichts. Die Antwort sagt das, du versuchst es nicht nochmals.
- `hafen`, `fliessband`, `live` und `domain` sieht Albatros auch selbst. Melde sie trotzdem, sobald sie geschafft sind.
- Antwortet es «Ungültige Angaben», war der Schritt oder der Name falsch geschrieben: korrigieren und einmal neu aufrufen.
- Fehlt das Werkzeug oder antwortet es «unbekannt», geht es ohne Insel weiter.

## Die acht Schritte

### 1. Mockup (`schritt: mockup`)

Schnell und grob, in Graustufen: die Startseite und die wichtigste Unterseite als eine HTML-Datei `docs/mockup.html`, mit echten Überschriften und dem Inhalt aus dem Grundriss (`docs/plan.md`) oder dem Bestand (`docs/bestand.md`). Er zeigt Aufbau und Reihenfolge, noch keine Farben und keine Bilder (graue Flächen). Öffne ihn im Browser und frag nur: «Stimmt die Reihenfolge?»

### 2. Design (`schritt: entwuerfe`)

Folge dem Skill `gestaltung`, Abschnitt «Drei Richtungen». Zuerst fragst du nach dem Charakter, nicht nach Farben. Dann legst du zwei bis drei klar verschiedene Vorschläge auf dem Mockup vor: dieselben Seiten, einmal pro Richtung, als HTML in `docs/gestaltung/entwuerfe/`. Danach prüfst du gegen die Liste der KI-Merkmale und fragst nach Gestaltungselementen (Icons, Illustrationen, Fotos, Maskottchen, 3D). Die Person wählt eine Richtung oder eine Mischung.

### 3. Framework

Sagt die Person nichts dazu, nimmst du, was am meisten Sinn macht, und sagst in einem Satz warum. Für eine statische Seite ist das Astro: Es baut schnelle, einfache HTML-Seiten, die Albatros direkt ausliefern kann. Ein anderes Framework nur, wenn die Person es will oder die Seite es braucht.

### 4. PRD zeigen und abnehmen lassen (`schritt: prd`)

Schreib `docs/prd.md` auf einer Seite und zeig es der Person. Erst nach ihrem Ja wird gebaut. Nach dem Ja meldest du zuerst `prd`, dann baust du.

```markdown
# PRD: <Name der Seite>

**Für wen und wozu:** … (aus docs/plan.md)
**Seiten:** Start, …
**Funktionen:** jede Funktion mit Entscheid (bei einer bestehenden Seite alle aus docs/bestand.md)
**Design:** Richtung <Name>, Eigenschaften …, Schrift …, Gestaltungselemente …
**Framework:** Astro (statisch), weil …
**Hosting:** Light (Seite aus dem Hafen, ohne eigenen Server) oder Pilot (eigener Server)
**Domain:** name.aufwind.sh, später eigene Domain (nur mit Pilot)
**Nicht dabei:** …

Abgenommen: <Datum> von <Name>
```

### 5. Lokal bauen und zeigen (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- In `web/astro.config.mjs`: `outDir: '../seite'`. Albatros liefert den Ordner `seite/` aus, mit Light direkt und mit Pilot über das Fliessband.
- Der Farbfächer aus dem Skill `gestaltung` liegt in `web/src/styles/tokens.css`. Ausserhalb davon steht keine Farbe und keine Schriftgrösse von Hand.
- Listen wie Termine, Turniere oder Sponsoren liegen als Daten in `web/src/data/*.json`, die Seiten lesen sie. Dokumente und Bilder kommen nach `web/public/`, Bilder verkleinert.
- Bauen und die Vorschau im Browser öffnen:
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- Fotos in Handy- und Desktopbreite (Skill `gestaltung`, Schritt 6) und Vergleich mit dem PRD: Geh jede Funktion und jeden Inhalt daraus durch und schreib in `docs/prd.md` dazu, wo sie auf der neuen Seite stehen. Fehlt etwas, baust du es nach, bevor es in den Hafen geht. Fehlt Material (zum Beispiel die Sponsorenlogos), steht ein klar beschrifteter Platzhalter da, nie ein anderes Bild unter falschem Namen.
- Schau dir jedes Foto selbst an wie eine Besucherin: Ist Text auf Bildern gut lesbar, ist nichts abgeschnitten oder verdeckt? Was nicht passt, behebst du, bevor es in den Hafen geht.
- Das Zeichen im Browser-Tab (`web/public/favicon.svg` und `favicon.ico`) ist das «A» von Astro: Ersetze es durch das Logo oder ein Zeichen daraus.
- Läuft die Vorschau, meldest du `lokal`, bevor du der Person die Seite zeigst und auf ihre Antwort wartest.

### 6. In den Hafen schicken (`schritt: hafen`)

Der Hafen von Albatros (`code.aufwind.sh`) ist das Trainings-Repo der Person: Dort liegt ihr Code, privat. Braucht es dafür noch Konto, Abo und Schlüssel, folge jetzt dem Skill `start` ab Schritt 3. Dann holst du das Logbuch und legst die neue Seite hinein (Skill `git-logbuch`):

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite logbuch/        # ohne web/node_modules, das schliesst web/.gitignore aus
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # Arbeitskopie der alten Seite bleibt draussen
cd logbuch && git add .gitignore web docs seite && git commit -m "Neue Seite: <Richtung>" && git push
```

Danach öffnest du den Hafen im Browser, damit die Person sieht, dass ihr Code dort liegt:

```bash
open https://code.aufwind.sh/{name}/projekt
```

### 7. Fliessband (`schritt: fliessband`)

Ein einfaches Fliessband, nichts Spezielles (Skill `pipeline`). Mit Light braucht es keins: Was im Hafen auf `main` unter `seite/` liegt, zeigt Albatros etwa eine Minute später. Mit Pilot liefert das Fliessband aus `.github/workflows/deploy.yml` die Seite auf den Server aus.

### 8. Seite oder Server (`schritt: live`, später `schritt: domain`)

- **Light:** Albatros zeigt die Seite ohne eigenen Server unter `https://{name}.aufwind.sh`.
- **Pilot:** Die Seite läuft auf dem eigenen Server, ebenfalls unter `https://{name}.aufwind.sh`.

**Du schaust selbst nach, die Person wartet nie.** Statt «schau in ein paar Minuten nochmal rein» prüfst du nach dem Push selbst, bis deine neue Seite da ist, höchstens drei Minuten. Die Adresse antwortet schon vorher (mit der Vorlage oder der Willkommensseite). Darum wartest du auf den Titel deiner Seite, wie er in `seite/index.html` zwischen `<title>` und `</title>` steht:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/ | grep -qF "<Titel deiner Seite>" && echo "Seite ist da" && break; sleep 15; done
```

- **Da:** Melde `fliessband` und `live`, öffne die Adresse mit der Person (`open https://{name}.aufwind.sh`) und vergleiche mit den Fotos aus Schritt 5.
- **Nach drei Minuten noch nicht da:** Frag `konto_status`. Mit Light steht dort, ob der neueste Stand online ist oder was fehlt. Oft fehlt `seite/index.html` im Hafen, weil vor dem Push nicht gebaut wurde oder `seite/` in `.gitignore` steht. Mit Pilot schaust du im Hafen unter «Actions» nach, wo das Fliessband stehen blieb (Skill `pipeline`). Beheben, neuer Eintrag, pushen, nochmals prüfen. Erst wenn es dann immer noch nicht geht, sagst du der Person, was du geprüft hast, und fragst den Coach (`coach_fragen`).

Eine eigene Domain kommt mit dem Skill `domain` dazu (nur Pilot), dann meldest du `domain`.

Veröffentlicht wird nur, was der Person gehört oder wofür sie die Erlaubnis hat (Skill `webseite-modernisieren`, Abschnitt «Rechte»).

## Stolpersteine

- Bauen vor dem PRD: Dann baut man die falsche Seite schön.
- Drei Entwürfe, die sich nur in der Farbe unterscheiden: keine echte Wahl.
- `seite/` vergessen zu bauen: Im Hafen liegt dann die alte Seite. Vor jedem Push `npm run build` in `web/`.
- Die Person warten lassen («schau später nochmal rein»): Du prüfst selbst, bis die Seite da ist (Schritt 8).
- Einen Schritt nicht gemeldet: Das Haus auf der Insel bleibt stehen. Melde jeden Schritt, sobald er geschafft ist.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «vom Grundriss zum fertigen Haus», der den Kern noch einmal sagt. Danach: welcher der acht Schritte geschafft ist, wo das Ergebnis liegt, was die Person entscheiden muss und welcher Schritt als Nächstes kommt.
