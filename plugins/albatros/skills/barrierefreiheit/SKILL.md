---
name: barrierefreiheit
description: 'Prüft und verbessert die Barrierefreiheit einer kleinen Webseite mit einer Person ohne Vorwissen, nach WCAG 2.2 AA in einfachen Worten: Kontrast, Schriftgrösse und Zoom, Bildbeschreibungen, Bedienung mit der Tastatur, Formulare, Vorlesen, Bewegung. Ergebnis ist ein Prüfprotokoll in docs/barrierefreiheit.md. Nutze den Skill bei «Barrierefreiheit», «barrierefrei», «Accessibility», «a11y», «WCAG», «Kontrast», «Alt-Text», «Screenreader», «für ältere Menschen lesbar», «mit Tastatur bedienen».'
---

# Barrierefreiheit: die Rampe neben der Treppe

## Das Bild

Ein Haus mit einer Treppe vor der Tür ist für viele gut. Für jemanden im Rollstuhl, mit Kinderwagen oder mit schwerem Koffer ist es eine Mauer. Eine Rampe neben der Treppe hilft diesen Menschen, und alle anderen nehmen sie auch gern.

Bei Webseiten sind die Rampen: genug Kontrast, Beschreibungen für Bilder, Bedienung ohne Maus, Formulare mit klaren Beschriftungen. Davon profitiert jede Person, die bei Sonne auf das Handy schaut, eine Brille vergessen hat oder es eilig hat.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- Abkürzungen und Werkzeugnamen nur mit einem Halbsatz Erklärung: WCAG (die international anerkannte Prüfliste für zugängliche Webseiten), Lighthouse (ein Prüfwerkzeug, das in Chrome eingebaut ist). Sonst lass sie weg.
- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, ohne Fachkürzel. «Kontrast» erklärst du mit hellgrauer Schrift auf weissem Papier.
- Jeder Punkt braucht einen Beleg: Seite und Stelle.
- Automatische Werkzeuge finden nur einen Teil. Sag das ehrlich und mach die Handprüfungen mit der Person.

## Ablauf

### 1. Automatisch vorprüfen

Die Person öffnet ihre Seite in Chrome, Rechtsklick, «Untersuchen», Reiter «Lighthouse», nur «Barrierefreiheit» wählen, «Seite analysieren». Oder du prüfst im Terminal:

```bash
npx pa11y https://{name}.aufwind.sh
```

Die Meldungen gehen als Befunde ins Protokoll. Was die Werkzeuge nicht sehen: ob die Reihenfolge Sinn ergibt, ob Texte verständlich sind, wo man nach einem Klick landet.

### 2. Von Hand prüfen

**Sehen**
- Kontrast nachrechnen: Text mindestens 4,5 : 1, grosse Titel, Knöpfe, Ränder von Eingabefeldern und Symbole mindestens 3 : 1. Hell und dunkel getrennt.
  - Formel: Jeden Farbkanal (0 bis 1) linearisieren: `c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`. Leuchtdichte `L = 0.2126 R + 0.7152 G + 0.0722 B`. Kontrast `(L_hell + 0.05) / (L_dunkel + 0.05)`. Kontrolle: Weiss auf Schwarz ergibt 21.
- Farbe ist nie das einzige Merkmal: Fehler mit Symbol und Text, aktiver Menüpunkt auch unterstrichen oder fett.
- Zoom auf 200 %: Nichts wird abgeschnitten, kein seitliches Scrollen. Prüfbreiten 320, 375, 768 und 1440 Pixel.

**Bedienen**
- Nur mit der Tastatur: `Tab` vorwärts, `Shift+Tab` zurück, `Enter` klickt. Kommt man überall hin? Sieht man immer, wo man ist (Fokus-Rahmen)? Schliesst `Escape` ein offenes Fenster?
- Klickflächen am Handy gross genug: etwa eine Fingerkuppe, mindestens 44 × 44 Pixel.
- Links sind Links, Knöpfe sind Knöpfe. Linktexte sagen, wohin es geht («Preise ansehen», nicht «hier»).

**Vorlesen**
- Jedes inhaltliche Bild hat eine Beschreibung (`alt="…"`), die sagt, was man sehen soll. Reine Deko bekommt `alt=""`.
- Knöpfe nur mit Symbol (Herz, Lupe, Menü) haben einen Namen (`aria-label="Suchen"`).
- Überschriften in sinnvoller Reihenfolge: genau eine `h1`, darunter `h2`, `h3`.
- Sprache der Seite gesetzt: `<html lang="de-CH">`.
- Am Mac selbst hören: `Cmd+F5` schaltet VoiceOver ein und aus.

**Formulare**
- Sichtbare Beschriftung über jedem Feld, nicht nur grauer Platzhalter im Feld.
- Pflichtfelder erkennbar. Richtiger Feldtyp (`type="email"`, `type="tel"`), damit das Handy die passende Tastatur zeigt.
- Fehler direkt am Feld, verständlich, mit dem Weg zur Lösung. Eingaben bleiben bei einem Fehler erhalten.

**Bewegung**
- Wer in den Systemeinstellungen «Bewegung reduzieren» gewählt hat, sieht Standbilder: `@media (prefers-reduced-motion: reduce)`.
- Was sich von selbst bewegt, hört nach höchstens 5 Sekunden auf oder lässt sich anhalten.
- Videos haben Untertitel.

### 3. Protokoll und Reparatur

`docs/barrierefreiheit.md`:

```markdown
# Barrierefreiheit: Prüfprotokoll (<Datum>)

| Punkt | Ergebnis | Beleg (Seite, Stelle) | Reparatur |
|---|---|---|---|
| Kontrast Text | erfüllt / nicht erfüllt / nicht relevant | … | … |

## Kontraste
| Farbpaar | Wert | reicht für |
|---|---|---|
```

Dann reparieren, kritische Punkte zuerst (alles, was eine Person ganz ausschliesst). Danach nochmals prüfen und das Protokoll nachführen. Logbuch (Skill `git-logbuch`), Fliessband (Skill `pipeline`).

## Gut zu wissen

- In der Schweiz verpflichtet das Behindertengleichstellungsgesetz vor allem Behörden und öffentliche Dienste. Für private Seiten ist es keine Pflicht, aber ein Vorteil: mehr Menschen kommen an, Suchmaschinen verstehen die Seite besser. Verkauft die Person auch in die EU, kann der European Accessibility Act gelten. Das ist keine Rechtsberatung.
- Am meisten bringt der Test mit echten Menschen, auch mit älteren Personen.

## Mission prüfen

`mission_pruefen` mit `webseite-05-barrierefreiheit`. Die Prüfung schaut, ob `docs/barrierefreiheit.md` im Projekt liegt (mit Pilot in `~/projekt` auf dem Server, mit Light im Hafen).

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die Rampe neben der Treppe», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
