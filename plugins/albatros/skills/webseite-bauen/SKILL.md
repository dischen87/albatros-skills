---
name: webseite-bauen
description: 'Baut mit einer Person ohne Vorwissen ihre Webseite wie in einer kleinen Software-Fabrik, in neun festen Schritten mit je einem Ergebnis in docs/: Auftrag, Mockup, Designsystem, Tech-Stack (Astro, wenig JavaScript), PRD mit Abnahmekriterien, lokal bauen, vier Prüfungen mit Bericht und Ampel (Sicherheit, Abläufe und Zugang, Aussehen, Code und Tempo, gemessen mit pruefen.mjs), Freigabe durch die Person, dann Hafen, Fliessband und Seite im Netz mit Schlussprüfung. Öffnet die Insel im Cockpit und meldet die Schritte mit schritt_melden. Nutze den Skill, sobald auf dem Weg Webseite gebaut wird: nach webseite-planen, nach der Bestandsaufnahme von webseite-modernisieren, bei «bau mir die Seite», «Mockup», «Entwurf», «Designsystem», «Tech-Stack», «PRD», «Abnahmekriterien», «vor dem Veröffentlichen prüfen», «lokal anschauen», «wie geht es nach dem Plan weiter».'
---

# Webseite bauen: die kleine Fabrik

## Das Bild

Ein Haus entsteht in einer festen Reihenfolge: Auftrag, Skizze, Materialmuster, Bauweise, Bauplan mit Unterschrift, Rohbau, Abnahme durch Fachleute, Schlüsselübergabe, Einzug. Niemand giesst das Fundament, bevor die Familie den Plan unterschrieben hat, und niemand zieht ein, bevor die Fachleute abgenommen haben. Eine Software-Fabrik arbeitet genauso: Jeder Schritt hat ein Ergebnis, das man anschauen kann, und am Ende prüfen Fachleute, bevor etwas hinausgeht. Auf der Insel im Cockpit wächst das Haus mit.

**So setzt du das Bild ein:** In deiner ersten Antwort ein Satz zum Bild. Bei jedem neuen Schritt ein Satz mit seinem Bild (in der Tabelle unten), was dabei entsteht und wozu. So versteht die Person, warum es diesen Schritt braucht.

## So sprichst du

- Die Reihenfolge ist fest. Du überspringst keinen Schritt, baust nichts vor der Abnahme des PRD und schickst nichts in den Hafen vor der Freigabe. Mit Light ist der Push schon die Veröffentlichung.
- Du schlägst den nächsten Schritt vor und machst ihn nach einem kurzen Ja. Die Person muss nie wissen, was als Nächstes kommt.
- Du-Form, Alltagssprache. Fachwörter (PRD, Tokens, Lighthouse) erklärst du beim ersten Mal mit ihrem Bild.
- Webseiten bleiben statisch, ohne eigene Dienste. Ein Baustein (Skill `bausteine`) kommt nur dazu, wenn die Person ihn wirklich braucht.
- Was die Person sehen soll (Insel, Mockup, Entwürfe, Vorschau, Berichte, Hafen, fertige Seite), öffnest du selbst im Browser: `open <adresse oder datei>` (Linux `xdg-open`, Windows `start`). Nur die Adresse zu nennen reicht nicht.

## Die neun Schritte auf einen Blick

| Schritt | Bild | Ergebnis | Insel |
|---|---|---|---|
| 1. Auftrag | der Auftrag an die Baufirma | `docs/plan.md` oder `docs/bestand.md` | |
| 2. Mockup | die Skizze auf Papier | `docs/mockup.html` | `mockup` |
| 3. Designsystem | die Materialmuster | `docs/designsystem.md`, `web/src/styles/tokens.css` | `entwuerfe` |
| 4. Tech-Stack | die Bauweise | `docs/stack.md` | |
| 5. PRD mit Abnahmekriterien | der Bauplan mit Unterschrift | `docs/prd.md` mit `Abgenommen:` | `prd` |
| 6. Bauen | der Rohbau | `web/`, `seite/` | `lokal` |
| 7. Prüfen | die Abnahme durch Fachleute | `docs/pruefung/` mit vier Berichten | `pruefung` |
| 8. Freigabe | die Schlüsselübergabe | `Freigegeben:` in `docs/prd.md` | `freigabe` |
| 9. Hafen, Fliessband, live | der Einzug | Seite im Netz, `docs/pruefung/messwerte-live.json` | `hafen`, `fliessband`, `live` |

Was in der Spalte «Ergebnis» steht, muss am Ende des Schritts da sein. Fehlt es, ist der Schritt nicht geschafft.

## Die Insel

Gleich zu Beginn öffnest du die Insel der Person im Browser. Unter `https://albatros.build/cockpit/insel` steht für jedes Projekt ein Haus, das mit jedem Schritt wächst. Für Französisch, Italienisch und Englisch steht das Präfix davor, zum Beispiel `/fr/cockpit/insel`:

```bash
open https://albatros.build/cockpit/insel        # macOS; Linux: xdg-open, Windows: start
```

Die Insel lädt sich selbst nach, einmal öffnen reicht.

Nach jedem geschafften Schritt mit einem Eintrag in der Spalte «Insel» rufst du das Werkzeug `schritt_melden` von Albatros auf, mit `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `pruefung`, `freigabe`, `hafen`, `fliessband`, `live`, `domain`) und `sprache` (die Sprache des Gesprächs). `projekt` lässt du im Normalfall weg: Dann gilt das Logbuch im Hafen (`git@aufwind.sh:<name>/projekt.git`), auch wenn es erst später entsteht. Nur für ein weiteres Projekt, das bloss auf dem Computer liegt, gibst du einen kurzen Namen aus Kleinbuchstaben, Ziffern und «-» mit. Die Antwort nennt den Schritt und die Adresse der Insel. Sag der Person in einem Satz, dass ihr Haus gewachsen ist.

- Die Insel geht nur vorwärts. Meldest du einen Schritt, der schon steht, ändert sich nichts. Die Antwort sagt das, du versuchst es nicht nochmals.
- `hafen`, `fliessband`, `live` und `domain` sieht Albatros auch selbst. Melde sie trotzdem, sobald sie geschafft sind.
- Antwortet es «Ungültige Angaben», war der Schritt oder der Name falsch geschrieben: korrigieren und einmal neu aufrufen.
- Fehlt das Werkzeug oder antwortet es «unbekannt», geht es ohne Insel weiter.

## Die Schritte

### 1. Auftrag

Ohne Auftrag kein Bau. Der Auftrag ist der Grundriss `docs/plan.md` (Skill `webseite-planen`) oder bei einer bestehenden Seite die Bestandsaufnahme `docs/bestand.md` (Skill `webseite-modernisieren`). Fehlt beides, gehst du zuerst dorthin. Lies den Auftrag und sag der Person in drei Sätzen, was gebaut wird, für wen und woran sie den Erfolg merkt.

### 2. Mockup (`schritt: mockup`)

Schnell und grob, in Graustufen: die Startseite und die wichtigste Unterseite als eine HTML-Datei `docs/mockup.html`, mit echten Überschriften und dem Inhalt aus dem Auftrag. Er zeigt Aufbau und Reihenfolge, noch keine Farben und keine Bilder (graue Flächen). Öffne ihn im Browser und frag nur: «Stimmt die Reihenfolge?»

### 3. Designsystem (`schritt: entwuerfe`)

Folge dem Skill `gestaltung`, Abschnitte «Drei Richtungen», «Nicht nach KI aussehen», «Der Farbfächer (Tokens)» und «Gestaltungselemente». Zuerst fragst du nach dem Charakter, nicht nach Farben. Dann legst du zwei bis drei klar verschiedene Entwürfe auf dem Mockup vor, als HTML in `docs/gestaltung/entwuerfe/`, und öffnest sie. Die Person wählt eine Richtung oder eine Mischung, dann meldest du `entwuerfe`.

Aus der gewählten Richtung entsteht das Designsystem, die Materialmuster für das ganze Haus:

- `web/src/styles/tokens.css`: Farben für hell und dunkel, Schriften, Schriftgrössen, Abstände, Radien und Schatten als CSS-Variablen, die Kontrastwerte als Kommentar.
- `docs/designsystem.md` auf einer Seite, für Menschen lesbar: Richtung und Eigenschaften; jede Farbe mit Token-Name, Zweck und Kontrast; Schriften und Grössen; Abstände und Radien; die Komponenten (Knopf, Link, Kopf, Fuss, Karte, Formularfeld und was die Seite sonst braucht), je mit Zweck und den Tokens, die sie nutzt; die Gestaltungselemente.

Farben, Schrift, Abstände, Radien und Komponenten stehen nur dort. Im Code der Seiten steht nur `var(--…)` und die Komponenten. Fehlt ein Wert, kommt er zuerst ins Designsystem.

### 4. Tech-Stack

Die Bauweise entscheidest du, bevor gebaut wird, und schreibst sie in `docs/stack.md`:

```markdown
# Tech-Stack

**Entscheid:** Astro, statisch
**Warum:** … (ein, zwei Sätze, aus dem Auftrag)
**JavaScript:** nur wo nötig, höchstens 50 KB je Seite
**Ausgeliefert:** der Ordner seite/ (Light: direkt aus dem Hafen; Pilot: über das Fliessband)
**Nicht gewählt:** … (zum Beispiel eine React-App oder WordPress), weil …
```

Standard ist Astro: Es baut schnelle, einfache HTML-Seiten ohne JavaScript, die Albatros direkt ausliefern kann. Ein anderes Framework gibt es nur, wenn die Person es ausdrücklich will oder eine Funktion aus dem Auftrag es braucht. Dann steht unter «Warum» die Funktion und warum Astro dafür nicht reicht. «Modern» oder «bekannt» ist kein Grund. Eine Anmeldeliste, ein Login oder ein Bearbeitungsfenster sind kein Grund für ein anderes Framework, sondern für einen Baustein (Skill `bausteine`, mit Pilot). Sag der Person in einem Satz, was gewählt ist und warum.

### 5. PRD mit Abnahmekriterien (`schritt: prd`)

Das PRD ist der Bauplan auf einer Seite, mit der Liste, was bei der Abnahme geprüft wird. Schreib `docs/prd.md`:

```markdown
# PRD: <Name der Seite>

**Für wen und wozu:** … (aus dem Auftrag)
**Seiten:** Start, …, Impressum, Datenschutz
**Funktionen:** jede mit Entscheid (bei einer bestehenden Seite alle aus docs/bestand.md)
**Design:** Richtung <Name>, siehe docs/designsystem.md
**Tech-Stack:** siehe docs/stack.md
**Hosting:** Light (Seite aus dem Hafen, ohne eigenen Server) oder Pilot (eigener Server)
**Domain:** name.aufwind.sh, später eigene Domain (mit Light oder Pilot)
**Nicht dabei:** …

## Abnahmekriterien

### Start
- [ ] In den ersten drei Sätzen steht, wer ihr seid, für wen die Seite ist und was Besucher tun sollen
- [ ] Der Knopf «…» führt zu …

### <jede weitere Seite>
- [ ] …

### <jede Funktion, zum Beispiel ein Formular oder Buchungen>
- [ ] Absenden geht, fehlende Pflichtfelder melden sich verständlich, die Nachricht kommt bei <Adresse> an
- [ ] Jede Liste zeigt, ob sie lädt, leer ist (ein Satz und ein Knopf) oder einen Fehler hat (mit «Nochmals versuchen», nie als leere Liste getarnt)
- [ ] Nach dem Absenden eine Bestätigungsseite: was passiert ist, die Nummer, was als Nächstes kommt, wie man es rückgängig macht
- [ ] Der Knopf sagt das Ergebnis («Platz buchen», nicht «Senden») und ist gesperrt, solange gesendet wird

### Für alle Seiten
- [ ] Inhalt wie im Auftrag, kein Platzhalter ohne klare Beschriftung
- [ ] Handy (390 px breit): nichts abgeschnitten, ohne Zoom lesbar, links und rechts mindestens 16 px Rand, Knöpfe mindestens 44 px hoch
- [ ] Jede Seite, auch die Seiten der Bausteine (zum Beispiel zum Buchen), hat Kopf, Menü und Fuss mit Impressum und Datenschutz
- [ ] Kontrast: Text mindestens 4,5 : 1, Knöpfe und Ränder mindestens 3 : 1
- [ ] Mit der Tastatur bedienbar, der Fokus ist sichtbar
- [ ] Impressum und Datenschutz vorhanden und auf jeder Seite verlinkt
- [ ] Tempo: Lighthouse mindestens 90 in Leistung, Zugang, Best Practices und SEO; höchstens 50 KB JavaScript je Seite; Bilder unter 500 KB
- [ ] Keine Geheimnisse im Code, keine .env im Netz

Abgenommen: <Datum> von <Name>
```

**Funktionen bauen wie die Profis.** Was Besucher tun (buchen, anmelden, bestellen, anfragen), baust du nach diesen Regeln, auch wenn die Person nicht danach fragt:

- **Drei Türen:** öffentliche Seiten ohne Login; eine Seite für Gäste per Link mit geheimem Code, ohne Konto (zum Beispiel «Buchung absagen»); die Verwaltung nur für die Person, nie verlinkt.
- **Eine Quelle je Wahrheit:** Angebote, Preise, Fristen und Öffnungszeiten stehen an einem Ort. Seite, Formular, Mail und Bedingungen lesen von dort.
- **Ein Wort je Ding,** gleich auf der Seite, in der Mail und in der Verwaltung. Eine Anfrage ist keine Buchung. Die Wörter stehen in `docs/designsystem.md`.
- **Prüfen im Server, nie nur im Browser:** Plätze, Fristen und Status rechnet der Server. Für Buchungen gibt es das getestete Rezept `buchungen` (Skill `bausteine`), statt es neu zu erfinden.
- **Ehrliche Fehler:** Antwortet ein Dienst nicht, ist das ein Fehler mit «Nochmals versuchen», nie «keine Termine».
- **Schweizer Format:** «CHF 1'250.–», «Di, 3. Nov. 2026, 18:00–19:15 Uhr», Zeiten in `Europe/Zurich`.
- **Handy zuerst:** Bei 390 px kein seitliches Scrollen, die Hauptaktion ist ohne Scrollen sichtbar, ein Formular fragt eine Sache pro Schritt («Schritt 2 von 3»).

Jedes Kriterium muss man prüfen können: Man sieht oder misst, ob es stimmt. «Schön» oder «modern» ist kein Kriterium. Schreib stattdessen, woran man es erkennt. Zeig der Person das PRD in einer Kurzfassung im Chat und öffne die Datei. Erst nach ihrem Ja trägst du `Abgenommen:` mit Datum und Namen ein, meldest `prd` und baust.

### 6. Bauen (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- In `web/astro.config.mjs`: `outDir: '../seite'`. Albatros liefert den Ordner `seite/` aus, mit Light direkt und mit Pilot über das Fliessband.
- `tokens.css` aus Schritt 3 liegt in `web/src/styles/` und wird in jedem Layout eingebunden. Die Komponenten aus `docs/designsystem.md` baust du zuerst, dann die Seiten daraus.
- **Daten zuerst:** Was die Person im Plan genannt hat (Kurse mit Zeiten und Plätzen, Preise, Öffnungszeiten), holst du jetzt, bevor du baust. Ein «haben wir» im Plan reicht nicht: Bitte um den Text, die Liste oder ein Foto davon.
- Listen wie Termine, Turniere oder Sponsoren liegen als Daten in `web/src/data/*.json`, die Seiten lesen sie. Dokumente und Bilder kommen nach `web/public/`, Bilder verkleinert.
- Das Zeichen im Browser-Tab (`web/public/favicon.svg` und `favicon.ico`) ist das «A» von Astro: Ersetze es durch das Logo oder ein Zeichen daraus.
- Fehlt Material (zum Beispiel die Sponsorenlogos), steht ein klar beschrifteter Platzhalter da, nie ein anderes Bild unter falschem Namen.
- Bauen und die Vorschau öffnen:
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- **Mit einem Baustein** (Buchungen, Anmeldeliste, Login) startest du statt der Vorschau `bun bausteine/pocketbase/lokal.ts`: Nur so laufen Formulare und Buchungen wirklich, auf dem Computer der Person.
- Läuft die Vorschau, meldest du `lokal`, bevor du der Person die Seite zeigst und auf ihre Antwort wartest.

### 7. Prüfen (`schritt: pruefung`)

Vier Fachleute nehmen den Bau ab, jede schreibt einen Bericht mit Ampel. Das Skript `pruefen.mjs` in diesem Skill misst, was sich messen lässt. Kopier es ins Projekt und lass es laufen:

```bash
mkdir -p scripts && cp <Ordner dieses Skills>/pruefen.mjs scripts/
# Ordner unbekannt: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
(cd web && npm run build) && node scripts/pruefen.mjs
```

Beim ersten Mal lädt es die Werkzeuge (Playwright, axe-core, Lighthouse, etwa 200 MB) und braucht einige Minuten. Sag das der Person vorher. Es schreibt `docs/pruefung/messwerte.json` und Fotos jeder Seite in 390 und 1440 px nach `docs/pruefung/fotos/`.

Danach schreibst du vier Berichte, je eine Seite, in der Sprache der Person:

- `docs/pruefung/sicherheit.md` (Sicherheit und Recht): Geheimnisse im Code, `npm audit`, keine `.env` in `seite/`, Impressum und Datenschutz vorhanden und vollständig (Skill `recht-ch`), welche fremden Dienste und Cookies die Seite nutzt.
- `docs/pruefung/ablaeufe.md` (Abläufe und Zugang): die Regeln für Barrierefreiheit (WCAG 2.2 AA, axe) auf jeder Seite, tote Links, jedes Formular selbst einmal ausprobiert, die Startseite mit der Tastatur durchgegangen (Tab), die Abläufe aus dem PRD Schritt für Schritt.
  - **Grün nur mit Beweis.** Für jede Funktion mit Baustein gehören die Ausgabe des Tests («Alles grün») und ein Foto einer echten Testbuchung oder eines echten Eintrags auf diesem Computer in den Bericht. Lief etwas nicht, ist die Ampel gelb oder rot. Schreib nie «durchgespielt», wenn du es nicht getan hast.
- `docs/pruefung/aussehen.md` (Aussehen): nur Werte aus `tokens.css`, Designsystem eingehalten, jedes Foto selbst angeschaut (abgeschnitten, verdeckt, lesbar?) und gegen die Liste der KI-Merkmale im Skill `gestaltung` geprüft.
- `docs/pruefung/code.md` (Code und Tempo): Lighthouse in den vier Bereichen, JavaScript je Seite, Bildgrössen, und welche Abnahmekriterien erfüllt sind.

```markdown
# Prüfung: <Bereich>

**Ampel:** grün | gelb | rot
**In einfachen Worten:** zwei, drei Sätze, was das für die Besucherinnen und Besucher heisst

## Geprüft
- … (Messwert aus messwerte.json oder was du selbst ausprobiert hast)

## Behoben
- …

## Offen
- … (mit dem Grund, warum es so bleiben darf)
```

Dann gehst du die Abnahmekriterien in `docs/prd.md` durch: Erfüllte hakst du ab (`- [x]`) und schreibst kurz dazu, wo oder womit geprüft. Was nicht erfüllt ist, bleibt offen, mit Grund.

Rot heisst: beheben, neu bauen, nochmals prüfen, bis nichts mehr rot ist. Gelb geht nur mit Grund unter «Offen». «Alles grün» schreibst du erst, wenn du die Fotos selbst angeschaut hast. Liegen die vier Berichte in `docs/pruefung/` und ist nichts mehr rot, meldest du `pruefung`.

### 8. Freigabe (`schritt: freigabe`)

Die Schlüsselübergabe: Die Person entscheidet, ob die Seite hinaus darf. Zeig ihr die vier Ampeln in je einem Satz, öffne die Berichte und die Vorschau und sag dazu, was offen ist. Sag auch: Mit Light ist der nächste Schritt die Veröffentlichung, die Seite ist dann für alle sichtbar. Frag: «Darf die Seite so ins Netz?»

Erst nach ihrem ausdrücklichen Ja schreibst du unter `Abgenommen:` in `docs/prd.md` die Zeile `Freigegeben: <Datum> von <Name>`. Danach meldest du `freigabe`. Will sie etwas ändern, geht es zurück zu Schritt 6 und danach nochmals durch die Prüfung.

### 9. Hafen, Fliessband und live (`schritt: hafen`, `fliessband`, `live`)

Der Hafen von Albatros (`code.aufwind.sh`) ist das Trainings-Repo der Person: Dort liegt ihr Code, privat. Braucht es dafür noch Konto, Abo und Schlüssel, folge jetzt dem Skill `start` ab Schritt 3. Dann holst du das Logbuch und legst die neue Seite hinein (Skill `git-logbuch`):

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite scripts logbuch/        # ohne web/node_modules, das schliesst web/.gitignore aus
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # Arbeitskopie der alten Seite bleibt draussen
cd logbuch && git add .gitignore web docs seite scripts && git commit -m "Neue Seite: <Richtung>" && git push
```

Danach öffnest du den Hafen im Browser, damit die Person sieht, dass ihr Code dort liegt, und meldest `hafen`:

```bash
open https://code.aufwind.sh/{name}/projekt
```

**Fliessband:** Ein einfaches Fliessband, nichts Spezielles (Skill `pipeline`). Mit Light braucht es keins: Was im Hafen auf `main` unter `seite/` liegt, zeigt Albatros etwa eine Minute später. Mit Pilot liefert das Fliessband aus `.github/workflows/deploy.yml` die Seite auf den Server aus.

**Live:** Die Seite steht unter `https://{name}.aufwind.sh`, mit Light ohne eigenen Server, mit Pilot auf dem eigenen Server.

**Du schaust selbst nach, die Person wartet nie.** Statt «schau in ein paar Minuten nochmal rein» prüfst du nach dem Push selbst, bis deine neue Seite da ist, höchstens drei Minuten. Die Adresse antwortet schon vorher (mit der Vorlage oder der Willkommensseite). Darum wartest du auf den Titel deiner Seite, wie er in `seite/index.html` zwischen `<title>` und `</title>` steht:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/ | grep -qF "<Titel deiner Seite>" && echo "Seite ist da" && break; sleep 15; done
```

- **Da:** Prüf die Seite im Netz nochmals (Titel, Impressum und Datenschutz, Lighthouse). Fertig heisst sichtbar:
  ```bash
  node scripts/pruefen.mjs --live https://{name}.aufwind.sh
  ```
  Ist dort nichts rot, meldest du `fliessband` und `live`, öffnest die Adresse mit der Person (`open https://{name}.aufwind.sh`) und vergleichst mit den Fotos aus Schritt 7.
- **Mit einem Baustein ist «live» noch nicht «fertig»:** Erst wenn die Daten drin sind (zum Beispiel die Kurse) und eine Testbuchung im Netz ihre Mail an die eigene Adresse gebracht hat (Skill `bausteine`), sagst du der Person, dass sie den Link teilen kann. Bis dahin sagst du ehrlich, was noch fehlt.
- **Nach drei Minuten noch nicht da:** Frag `konto_status`. Mit Light steht dort, ob der neueste Stand online ist oder was fehlt. Oft fehlt `seite/index.html` im Hafen, weil vor dem Push nicht gebaut wurde oder `seite/` in `.gitignore` steht. Mit Pilot schaust du im Hafen unter «Actions» nach, wo das Fliessband stehen blieb (Skill `pipeline`). Beheben, neuer Eintrag, pushen, nochmals prüfen. Erst wenn es dann immer noch nicht geht, sagst du der Person, was du geprüft hast, und fragst den Coach (`coach_fragen`).

Wünscht die Person danach noch etwas anders («es fehlt noch …», ein Termin, ein Text), lädst du den Skill `webseite-aendern` und folgst ihm. Die Seite ist freigegeben und im Netz, darum braucht jede Änderung ihr Kriterium im PRD, vorher und nachher und eine neue Freigabe vor dem Push.

Eine eigene Domain kommt mit dem Skill `domain` dazu, mit Light wie mit Pilot, dann meldest du `domain`.

Veröffentlicht wird nur, was der Person gehört oder wofür sie die Erlaubnis hat (Skill `webseite-modernisieren`, Abschnitt «Rechte»).

## Stolpersteine

- Bauen vor dem PRD: Dann baut man die falsche Seite schön.
- In den Hafen vor der Freigabe: Mit Light ist das schon die Veröffentlichung.
- Abnahmekriterien, die man nicht prüfen kann («schön», «modern»): Schreib, woran man es sieht oder misst.
- Ein anderes Framework, «weil es modern ist»: Der Grund ist der Wunsch der Person oder eine Funktion, sonst Astro.
- Drei Entwürfe, die sich nur in der Farbe unterscheiden: keine echte Wahl.
- Farben, Abstände oder Schriftgrössen von Hand im Code: Dann bricht das Designsystem.
- Berichte ohne Messwerte, oder «alles grün», ohne die Fotos angeschaut zu haben.
- `seite/` vergessen zu bauen: Im Hafen liegt dann die alte Seite. Vor jedem Push `npm run build` in `web/`.
- Die Person warten lassen («schau später nochmal rein»): Du prüfst selbst, bis die Seite da ist (Schritt 9).
- Einen Schritt nicht gemeldet: Das Haus auf der Insel bleibt stehen. Melde jeden Schritt mit Eintrag in der Spalte «Insel», sobald er geschafft ist.

## Mission prüfen

`mission_pruefen` mit `webseite-02-bauen`, sobald die Seite im Netz ist. Die Prüfung schaut, ob in `docs/prd.md` die Freigabe steht (`Freigegeben:`) und die Seite antwortet.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die kleine Fabrik», der den Kern noch einmal sagt. Danach: welcher der neun Schritte geschafft ist und was dabei entstanden ist, wo das Ergebnis liegt, was die Person entscheiden muss und welcher Schritt als Nächstes kommt.
