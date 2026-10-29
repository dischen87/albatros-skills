---
name: cms
description: 'Hilft einer Person ohne Vorwissen zu entscheiden, ob ihre Webseite ein System zur Inhaltspflege (CMS) braucht, und richtet es bei Bedarf ein, z. B. Strapi in Docker auf dem Albatros-Server, erreichbar über einen sicheren Tunnel. Erklärt CMS mit dem Bild der Pinnwand. Nutze den Skill bei «CMS», «Strapi», «Inhalte selbst ändern ohne Code», «Blog», «News», «Veranstaltungen pflegen», «meine Kollegin soll Texte ändern können», «WordPress», «Admin-Bereich».'
---

# CMS: die Pinnwand im Flur

## Das Bild

Ein CMS ist eine Pinnwand im Flur. Wer etwas mitteilen will, hängt einen Zettel auf, ohne die Wand neu zu bauen. Die Webseite liest die Zettel und zeigt sie schön an.

Eine Pinnwand lohnt sich, wenn oft und von verschiedenen Leuten Zettel kommen: Veranstaltungen, News, Produkte, Menüs. Für eine Seite, die sich zweimal im Jahr ändert, ist sie ein Möbel, das nur Platz braucht.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurz. Rate ehrlich ab, wenn es keine Pinnwand braucht. Jede zusätzliche Software ist etwas, das gepflegt, gesichert und aktualisiert werden will.

## 1. Braucht es überhaupt ein CMS?

Frag drei Dinge:

1. Wie oft ändern sich Inhalte? (wöchentlich oder öfter → eher ja)
2. Wer ändert sie? (Menschen ohne Terminal → eher ja)
3. Gibt es viele gleichartige Einträge? (Veranstaltungen, Produkte, Beiträge → eher ja)

Vier Stufen, immer die einfachste nehmen, die reicht:

| Stufe | Was | Gut wenn |
|---|---|---|
| A: Texte im Projekt | Inhalte als Markdown-Dateien im Repo, die KI ändert sie | eine Person mit KI pflegt alles, selten Änderungen |
| B: Pinnwand über dein Logbuch | ein Bearbeitungsfenster im Browser (z. B. Decap CMS), das die Dateien im Repo ändert | andere sollen Texte ändern, aber keine Datenbank nötig |
| C: kleine Pinnwand | PocketBase auf dem Server, Einträge mit Titel, Datum, Text und Bild | andere pflegen News oder Termine, wenige Felder, kaum Speicher (etwa 20 MB) |
| D: grosses CMS | Strapi mit eigener Datenbank auf dem Server | viele Inhaltstypen, mehrere Rollen, Bilderverwaltung, später auch eine App (etwa 200 MB, Bau bis 2,5 GB) |

Ist A oder B die Antwort: Schreib das in `docs/plan.md` und hör hier auf. Das ist ein gutes Ergebnis. C und D brauchen einen eigenen Server, also Pilot. Mit Light gehen A und B. C und D sind fertige Bausteine, du baust sie mit dem Skill `bausteine` ein (Rezept `pinnwand` oder Baustein `strapi`).

## 2. Strapi einrichten (Stufe D)

Strapi kommt als fertiger Baustein mit eigener Postgres-Datenbank: Skill `bausteine`, Abschnitt «Strapi». Das Wichtigste vorab, damit du es der Person erklären kannst:

- **Speicher:** Im Betrieb braucht Strapi mit Datenbank etwa 200 MB, beim Bauen bis 2,5 GB. Der erste Bau dauert etwa 7 Minuten. Prüf mit `free -h`, ob beim Bauen genug frei ist. Foto vorher: Werkzeug `snapshot` mit Namen `vor-cms`.
- **Geheimnisse** legt `bausteine/strapi/geheimnisse.sh` direkt auf dem Server an, nie im Logbuch (Skill `sicherheit`).
- **Inhaltstypen** schreibst du als Dateien unter `bausteine/strapi/cms/src/api/`, auf dem Server lassen sie sich nicht anklicken. Muster: Rezept `veranstaltungen`.
- **Der geheime Gang zur Pinnwand:** Die Verwaltung ist nicht öffentlich. Die Person erreicht sie über einen Tunnel. Bild: ein geheimer Gang von ihrem Computer direkt in den Flur, an dem niemand von der Strasse vorbeikommt.

  ```bash
  ssh -N -L 1337:localhost:1337 {name}@aufwind.sh
  ```

  Solange der Tunnel offen ist, öffnet sie `http://localhost:1337/admin`. Beim ersten Mal legt sie dort selbst das Konto an. Das Passwort tippt sie nur dort.
- **Inhalte auf der Seite:** Was in `OEFFENTLICH` steht (`bausteine/strapi/cms/src/index.ts`), liest die Seite unter `/cms/api/…` der eigenen Adresse, gleich nach dem Veröffentlichen. Ein neuer Bau ist dafür nicht nötig.

## Stolpersteine

- Admin-Bereich öffentlich ins Netz gestellt: Einladung für Angreifer. Tunnel benutzen.
- Updates vergessen: Strapi regelmässig aktualisieren, vorher Foto machen.
- Bilder nur im Container: ohne Volume sind sie nach dem nächsten Neustart weg.

## Mission prüfen

`mission_pruefen` mit `webseite-05-cms`. Die Prüfung schaut, ob der Container `cms` läuft (Strapi). Hat sich die Person bewusst für Stufe A, B oder C entschieden, sag ihr, dass sie diese Mission überspringen darf. Das ist eine gute Entscheidung, keine Lücke.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die Pinnwand im Flur», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
