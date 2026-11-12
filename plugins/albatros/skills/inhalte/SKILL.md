---
name: inhalte
description: 'Hilft einer Person ohne Vorwissen, Texte und Bilder für ihre Webseite zu schreiben und auszuwählen, im Fahrplan für den Entwurf der ganzen Seite (P7): Startseite in drei Sätzen, kurze Texte im Ton aus dem Konzept für Lesende am Handy, fehlende Texte sichtbar als [Platzhalter], eigene Fotos statt Stockbilder mit einer Fotoliste, Bildrechte und Bildgrösse, KI-Texte in die eigene Stimme bringen. Ergebnis ist eine Inhaltsliste in docs/inhalte.md und die Texte im Entwurf. Nutze den Skill bei «Texte schreiben», «was schreibe ich auf die Startseite», «Über uns», «Bilder für die Webseite», «Fotoliste», «darf ich dieses Bild verwenden», «Text klingt nach KI», «Inhalte».'
metadata:
  stand: 0.3.1
---

# Inhalte: die Ware im Schaufenster

## Das Bild

Die Webseite ist ein Schaufenster. Gestaltung ist das Licht und die Dekoration. Die Inhalte sind die Ware. Ein schönes Schaufenster mit leeren Regalen verkauft nichts. Darum kommt die Ware ins Modell, bevor gebaut wird: Erst mit echten Texten sieht man, ob die Seite trägt.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## Im Fahrplan

Die Texte entstehen in P7, als Teil des Entwurfs der ganzen Seite (Skill `entwurf`, Schritt «Die Texte»): Was du hier schreibst, kommt direkt in die Seiten in `design/entwurf/`. Schon gesammelt ist, was die Person hat (`Inhalte vorhanden:` in `docs/recherche.md`, P2), wie sie klingt und was sie verspricht (`Ton:` und `Kern:` in `docs/konzept.md`, P5), und die Fotoliste (in `docs/inhalte.md`, P5). Die Texte schlägst du vor; was fehlt, steht als `[Platzhalter: was fehlt, wer liefert bis wann]` im Entwurf, und die Zahl der Platzhalter steht in der Zeile `Seiten:` von `docs/entwurf.md`. Die Person bestätigt die Texte beim Durchklicken.

Baut Albatros die Seite (in `docs/projekt.md` steht `Bauen lassen: albatros`, und `lage` nennt einen offenen Auftrag), gibt es keinen Entwurf von dir: Du sammelst nur. Texte, Inhaltsliste und Fotoliste kommen nach `docs/inhalte.md`; unter `design/` legst und änderst du nichts, denn daraus baut Albatros. Neue Fotos legt die Person selbst in `design/bilder/` und wählt bis zur Zahlung im Cockpit unter «Dein Auftrag» ihren Projektordner nochmals. Nach dem Livegang bringt ihr das Gesammelte mit der ersten eigenen Änderung auf die Seite (Skill `webseite-aendern`).

Ist die Seite schon im Netz und soll sich ein Text ändern, gilt der Skill `webseite-aendern`.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurz, konkret. Schreib Texte nie fertig über den Kopf der Person hinweg: Du machst Vorschläge, sie entscheidet und ändert. Am Ende muss jeder Text so klingen, wie sie spricht.

## Ablauf

### 1. Inhaltsliste aus dem Plan

Nimm die Seiten aus `docs/plan.md` (Zeile `Seiten:`, Skill `webseite-planen`). Leg `docs/inhalte.md` an oder ergänze sie, wenn es sie mit der Fotoliste aus P5 schon gibt: pro Seite Überschrift, zwei, drei Kernsätze, Bilder, der Knopf zur Hauptsache, Stand (Entwurf, fertig, Platzhalter). Anrede und Ton nimmst du aus `docs/konzept.md`.

### 2. Die Startseite in drei Sätzen

Wer auf die Startseite kommt, entscheidet in wenigen Sekunden, ob er bleibt. Die drei Sätze oben müssen beantworten:

1. **Was ist das?** («Mittagstisch für Schulkinder in Wipkingen»)
2. **Für wen und warum gut?** («Frisch gekocht, betreut, fünf Minuten vom Schulhaus»)
3. **Was jetzt?** Ein Knopf mit einem Tu-Wort: «Platz anfragen», nicht «Mehr erfahren».

### 3. Regeln für Texte im Netz

- Kurze Sätze, ein Gedanke pro Satz. Die meisten lesen am Handy.
- Das Wichtigste zuerst. Details weiter unten.
- Konkret statt Werbesprache: «Wir antworten innert 24 Stunden» statt «erstklassiger Service».
- Eine Anrede durchziehen, Du oder Sie, je nach Publikum (im Fahrplan steht sie in `docs/konzept.md` unter `Ton:`).
- Zwischentitel, die man überfliegen kann.
- Zahlen, Preise, Öffnungszeiten, Adresse: lieber zweimal prüfen. Falsche Angaben kosten Vertrauen.
- Was fehlt, erfindest du nicht. Es steht sichtbar im Text, zum Beispiel `[Platzhalter: Öffnungszeiten, liefert Anna bis 7.11.2026]`, damit es niemand übersieht. Nie Lorem-Text oder anderer Fülltext, und nie Emoji anstelle von Icons.
- Fakten als Sätze, die für sich allein stimmen: wer, was, für wen, wo, wann offen, was es kostet, wie man anfragt. Dazu die fünf Fragen, die am häufigsten gestellt werden, je mit einer Antwort in zwei, drei Sätzen. So versteht es, wer es eilig hat, und so finden es Suchmaschinen und KI-Assistenten (Skill `seo-grundlagen`).
- Keine erfundenen Bewertungen, Zitate, Kundenzahlen oder Auszeichnungen. Jede Zahl kommt von der Person oder hat eine Quelle.

### 4. Texte mit KI

Die KI darf Entwürfe schreiben. Dann zusammen mit der Person:

- Alles streichen, was sie so nie sagen würde.
- Jede Behauptung prüfen. Was nicht stimmt oder nicht belegbar ist, fliegt raus.
- Typische Füllwörter und hohle Superlative weg («innovativ», «massgeschneidert», «nahtlos»).
- Einen echten Satz von ihr einbauen: ein Erlebnis, ein Grund, warum sie das macht.

### 5. Bilder

- **Eigene Fotos schlagen Stockbilder.** Echte Menschen, echter Ort, Tageslicht, Handy reicht. Was die Person fotografieren soll, steht in der Fotoliste in `docs/inhalte.md`: was, wo, wer darauf ist, bis wann.
- **Rechte:** Nur Bilder verwenden, die die Person selbst gemacht hat oder für die sie eine Lizenz hat. Ein Bild aus der Google-Suche ist nicht gratis. Erkennbare Personen vorher fragen (Recht am eigenen Bild), bei Kindern die Eltern.
- **Grösse:** Fotos vom Handy sind viel zu gross. Verkleinern auf höchstens etwa 2000 Pixel Breite und als WebP speichern, z. B. mit `cwebp -q 80 foto.jpg -o foto.webp` oder einem Online-Werkzeug ihrer Wahl. Ziel: unter 300 KB pro Bild.
- **Beschreibung für jedes Bild** (Alternativtext), siehe Skill `barrierefreiheit`.

### 6. In den Entwurf bringen

Bitte die Person, jede Angabe im Text zu prüfen (Zeiten, Wege, Preise, Namen). Du kennst sie nur aus ihrer Beschreibung. Dann kommen Texte und Bilder in die Seiten des Entwurfs (`design/entwurf/`, Bilder nach `design/entwurf/bilder/`), und ihr schaut sie zusammen auf dem Handy an, nicht nur am Computer (Skill `entwurf`). Gebaut wird erst nach der Freigabe zum Bauen (P8); dann übernimmt der Skill `webseite-bauen` die Texte aus dem Entwurf.

Ist die Seite schon gebaut oder im Netz, kommen neue Texte über den Skill `webseite-aendern`: lokal ändern, zeigen, Freigabe, dann ins Logbuch (Skill `git-logbuch`) und ins Netz.

## Mission prüfen

`mission_pruefen` mit `webseite-03-inhalte`. Die Prüfung schaut, ob das Projekt auf der Insel mindestens beim Schritt «Entwurf» steht: Die ganze Seite ist mit echten Texten zum Durchklicken da. Dazu gehört die Inhaltsliste `docs/inhalte.md` im Projekt.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die Ware im Schaufenster», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist (die Platzhalter mit Namen und Datum) und was als Nächstes kommt. Bitte die Person ausdrücklich, den Text in ihre eigene Stimme zu bringen und jede Angabe darin zu prüfen (Zeiten, Wege, Preise), denn du kennst sie nur aus ihrer Beschreibung.
