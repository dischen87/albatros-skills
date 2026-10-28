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

Drei Stufen, immer die einfachste nehmen, die reicht:

| Stufe | Was | Gut wenn |
|---|---|---|
| A: Texte im Projekt | Inhalte als Markdown-Dateien im Repo, die KI ändert sie | eine Person mit KI pflegt alles, selten Änderungen |
| B: Pinnwand über dein Logbuch | ein Bearbeitungsfenster im Browser (z. B. Decap CMS), das die Dateien im Repo ändert | andere sollen Texte ändern, aber keine Datenbank nötig |
| C: eigenes CMS | ein Programm mit Datenbank auf dem Server, z. B. Strapi | viele Einträge, mehrere Rollen, Bilder-Verwaltung, später auch eine App |

Ist A oder B die Antwort: Schreib das in `docs/plan.md` und hör hier auf. Das ist ein gutes Ergebnis. Stufe C braucht einen eigenen Server, also Pilot. Mit Light gehen A und B.

## 2. Strapi einrichten (Stufe C)

### Vorher

- Strapi braucht Arbeitsspeicher. Prüf mit `free -h` auf dem Server, ob mindestens etwa 1 GB frei ist. Sonst zuerst mehr Leistung (Skill `kosten`).
- Foto machen: Werkzeug `snapshot` mit Namen `vor-cms` (Skill `zurueck-auf-gestern`).

### Einrichten

1. Lokal ein Strapi-Projekt im Ordner `cms/` des Repos anlegen (aktuelle Anleitung: `npx create-strapi@latest cms`), mit SQLite als Datenbank. Die Datenbank-Datei kommt nicht ins Logbuch (`.gitignore`).
2. In `compose.yaml` einen Dienst `cms` ergänzen: Container-Name `cms`, Port nur nach innen (`127.0.0.1:1337:1337`), ein Volume für Datenbank und hochgeladene Bilder. Geheimnisse (`APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`) als Umgebungsvariablen aus einer `.env` auf dem Server, nie im Repo (Skill `sicherheit`).
3. Logbuch und Fliessband (Skills `git-logbuch`, `pipeline`). Danach auf dem Server: `docker ps` zeigt `cms`.

### Der geheime Gang zur Pinnwand

Der Bearbeitungsbereich ist nicht öffentlich. Die Person erreicht ihn über einen Tunnel. Bild: ein geheimer Gang von ihrem Computer direkt in den Flur, an dem niemand von der Strasse vorbeikommt.

```bash
ssh -L 1337:localhost:1337 {name}@aufwind.sh
```

Solange dieses Fenster offen ist, öffnet sie im Browser `http://localhost:1337/admin`. Beim ersten Mal legt sie dort selbst das Admin-Konto an. Das Passwort tippt sie nur dort.

### Inhalte anbinden

1. Mit der Person einen Inhaltstyp anlegen (z. B. «Veranstaltung» mit Titel, Datum, Ort, Text, Bild).
2. Die Webseite holt die Einträge beim Bauen über `http://cms:1337/api/...` aus dem gleichen Docker-Netz. Ein API-Token mit nur Leserechten, als Geheimnis auf dem Server.
3. Neue Einträge erscheinen nach dem nächsten Bau. Wer es sofort will: ein Webhook in Strapi, der den Bau auslöst. Das kommt erst, wenn es wirklich stört.

## Stolpersteine

- Admin-Bereich öffentlich ins Netz gestellt: Einladung für Angreifer. Tunnel benutzen.
- Updates vergessen: Strapi regelmässig aktualisieren, vorher Foto machen.
- Bilder nur im Container: ohne Volume sind sie nach dem nächsten Neustart weg.

## Mission prüfen

`mission_pruefen` mit `webseite-04-cms`. Die Prüfung schaut, ob der Container `cms` läuft. Hat sich die Person bewusst für Stufe A oder B entschieden, sag ihr, dass sie diese Mission überspringen darf. Das ist eine gute Entscheidung, keine Lücke.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die Pinnwand im Flur», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
