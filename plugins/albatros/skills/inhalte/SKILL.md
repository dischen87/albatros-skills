---
name: inhalte
description: 'Hilft einer Person ohne Vorwissen, Texte und Bilder für ihre Webseite zu schreiben und auszuwählen: Startseite in drei Sätzen, kurze Texte für Lesende am Handy, eigene Fotos statt Stockbilder, Bildrechte und Bildgrösse, KI-Texte in die eigene Stimme bringen. Ergebnis ist eine Inhaltsliste in docs/inhalte.md und die Texte auf der Seite. Nutze den Skill bei «Texte schreiben», «was schreibe ich auf die Startseite», «Über uns», «Bilder für die Webseite», «darf ich dieses Bild verwenden», «Text klingt nach KI», «Inhalte».'
---

# Inhalte: die Ware im Schaufenster

## Das Bild

Die Webseite ist ein Schaufenster. Gestaltung ist das Licht und die Dekoration. Die Inhalte sind die Ware. Ein schönes Schaufenster mit leeren Regalen verkauft nichts. Darum kommen die Inhalte vor der Gestaltung.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurz, konkret. Schreib Texte nie fertig über den Kopf der Person hinweg: Du machst Vorschläge, sie entscheidet und ändert. Am Ende muss jeder Text so klingen, wie sie spricht.

## Ablauf

### 1. Inhaltsliste aus dem Plan

Nimm die Seiten aus `docs/plan.md` (Skill `webseite-planen`). Leg `docs/inhalte.md` an, pro Seite: Überschrift, zwei, drei Kernsätze, Bilder, der Knopf zur Hauptsache, Stand (Entwurf, fertig).

### 2. Die Startseite in drei Sätzen

Wer auf die Startseite kommt, entscheidet in wenigen Sekunden, ob er bleibt. Die drei Sätze oben müssen beantworten:

1. **Was ist das?** («Mittagstisch für Schulkinder in Wipkingen»)
2. **Für wen und warum gut?** («Frisch gekocht, betreut, fünf Minuten vom Schulhaus»)
3. **Was jetzt?** Ein Knopf mit einem Tu-Wort: «Platz anfragen», nicht «Mehr erfahren».

### 3. Regeln für Texte im Netz

- Kurze Sätze, ein Gedanke pro Satz. Die meisten lesen am Handy.
- Das Wichtigste zuerst. Details weiter unten.
- Konkret statt Werbesprache: «Wir antworten innert 24 Stunden» statt «erstklassiger Service».
- Eine Anrede durchziehen, Du oder Sie, je nach Publikum.
- Zwischentitel, die man überfliegen kann.
- Zahlen, Preise, Öffnungszeiten, Adresse: lieber zweimal prüfen. Falsche Angaben kosten Vertrauen.

### 4. Texte mit KI

Die KI darf Entwürfe schreiben. Dann zusammen mit der Person:

- Alles streichen, was sie so nie sagen würde.
- Jede Behauptung prüfen. Was nicht stimmt oder nicht belegbar ist, fliegt raus.
- Typische Füllwörter und hohle Superlative weg («innovativ», «massgeschneidert», «nahtlos»).
- Einen echten Satz von ihr einbauen: ein Erlebnis, ein Grund, warum sie das macht.

### 5. Bilder

- **Eigene Fotos schlagen Stockbilder.** Echte Menschen, echter Ort, Tageslicht, Handy reicht.
- **Rechte:** Nur Bilder verwenden, die die Person selbst gemacht hat oder für die sie eine Lizenz hat. Ein Bild aus der Google-Suche ist nicht gratis. Erkennbare Personen vorher fragen (Recht am eigenen Bild), bei Kindern die Eltern.
- **Grösse:** Fotos vom Handy sind viel zu gross. Verkleinern auf höchstens etwa 2000 Pixel Breite und als WebP speichern, z. B. mit `cwebp -q 80 foto.jpg -o foto.webp` oder einem Online-Werkzeug ihrer Wahl. Ziel: unter 300 KB pro Bild.
- **Beschreibung für jedes Bild** (Alternativtext), siehe Skill `barrierefreiheit`.

### 6. Auf die Seite bringen

Bitte die Person, jede Angabe im Text zu prüfen (Zeiten, Wege, Preise, Namen). Du kennst sie nur aus ihrer Beschreibung. Dann Texte und Bilder ins Projekt, ins Logbuch (Skill `git-logbuch`), über das Fliessband (Skill `pipeline`) auf den Server. Dann zusammen auf dem Handy anschauen, nicht nur am Computer.

## Mission prüfen

`mission_pruefen` mit `webseite-02-inhalte`. Die Prüfung schaut, ob `~/projekt/docs/inhalte.md` existiert und die Seite unter `https://{name}.aufwind.sh` antwortet.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die Ware im Schaufenster», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt. Bitte die Person ausdrücklich, den Text in ihre eigene Stimme zu bringen und jede Angabe darin zu prüfen (Zeiten, Wege, Preise), denn du kennst sie nur aus ihrer Beschreibung.
