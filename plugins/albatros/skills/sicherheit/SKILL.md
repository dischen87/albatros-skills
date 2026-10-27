---
name: sicherheit
description: 'Macht mit einer Person ohne Vorwissen ihr Projekt sicher, mit dem Bild vom Haus mit Schlüsselbund, Tresor, Fenstern und Schlössern: Geheimnisse nie ins Logbuch (Git), sondern in .env auf dem Server und GitHub Secrets; versehentlich veröffentlichte Schlüssel sofort neu erzeugen; ein Schlüssel pro Zweck; nur nötige Türen offen; Updates. Nutze den Skill bei «Sicherheit», «Passwort im Code», «API-Schlüssel», «.env», «Secret», «ich habe einen Schlüssel auf GitHub hochgeladen», «ist meine Seite sicher», «gehackt», «Updates», «Firewall», und bevor ein neues Geheimnis ins Projekt kommt.'
---

# Sicherheit: den Schlüssel nicht unter die Fussmatte

## Das Bild

Ein Haus ist so sicher wie sein nachlässigster Moment. Einbrecher suchen nicht das stärkste Schloss, sondern den Schlüssel unter der Fussmatte und das offene Kellerfenster.

- **Geheimnisse** (Passwörter, API-Schlüssel, private Schlüssel) sind Schlüssel. Sie gehören in den **Tresor**, nie unter die Fussmatte.
- Das **Logbuch** (Git) ist keine Fussmatte, sondern ein Schaufenster: Was einmal drin steht, bleibt in allen alten Einträgen sichtbar.
- **Türen und Fenster** sind die offenen Zugänge zum Server. Nur so viele wie nötig.
- **Updates** sind neue Schlösser, wenn bei den alten ein Trick bekannt geworden ist.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, ruhig, aber klar. Ist ein Geheimnis öffentlich geworden, gilt: sofort handeln, ohne Schuldzuweisung.
- Geheimnisse liest du nie laut vor, gibst sie nie aus und schreibst sie nie in den Chat, in Commit-Notizen oder Logs.
- Öffentliche Schlüssel (z. B. `phc_…` für die Statistik oder `pk_…` bei Stripe) sind keine Geheimnisse. Geheime erkennt man oft am Anfang: `sk_…`, `ghp_…`, `-----BEGIN … PRIVATE KEY-----`.

## Ablauf

### 1. Ist schon etwas unter der Fussmatte?

```bash
git ls-files | grep -E '(^|/)\.env(\..+)?$' | grep -v '\.env\.example$'
git log -p --all | grep -nE -- '-----BEGIN [A-Z ]*PRIVATE KEY-----|sk_live_|sk_test_|ghp_[A-Za-z0-9]{20,}|password *[=:]' | head
```

Findest du etwas: **Sofort beim Anbieter neu erzeugen** (rotieren) und das alte ungültig machen. Aus dem Repo löschen reicht nicht, der alte Eintrag bleibt im Logbuch und im Hafen. Erst danach aufräumen.

### 2. Der Tresor

- **`.gitignore`** enthält `.env`, `.env.*` und `!.env.example`. Die Person schaut mit dir nach.
- **`.env.example`** im Repo zeigt, welche Geheimnisse es braucht, mit leeren Werten.
- **Auf dem Server** liegen die echten Werte in `~/projekt/.env`, nur für dich lesbar:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && umask 077 && touch .env && chmod 600 .env'
  ```
  Werte trägt die Person selbst ein (`nano ~/projekt/.env`), damit sie nicht in deinem Verlauf landen.
- **Für das Fliessband** liegen Geheimnisse in GitHub: `gh secret set NAME`. Das fragt den Wert verdeckt ab. Im Workflow nur über `env:` verwenden (Skill `pipeline`).
- **Im Dockerfile:** eine `.dockerignore` mit `.env`, `.git`, `node_modules`. Sonst wird die `.env` beim Bauen mit eingepackt.

### 3. Ein Schlüssel pro Zweck

Der Hausschlüssel der Person, der Schlüssel des Fliessbands, der Lese-Schlüssel des Servers für GitHub: jeder einzeln. Geht einer verloren, wird nur dieses Schloss ausgewechselt (im Cockpit oder mit `schluessel_hinterlegen`).

### 4. Türen und Fenster

Auf Albatros kümmert sich die Plattform um die Haustür (Firewall, Schutz gegen Passwort-Raten). Du achtest auf die Türen, die du selbst öffnest:

- In `compose.yaml` nur die Webseite auf Port 80 nach aussen. Alles andere (Datenbank, CMS, Admin) nur an `127.0.0.1` binden, z. B. `"127.0.0.1:5432:5432"`, oder gar nicht veröffentlichen. Docker öffnet Ports sonst an jeder Firewall vorbei.
- Admin-Bereiche nur über einen Tunnel (Skill `cms`).
- Prüfen, dass nichts Internes ausgeliefert wird:
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.env
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.git/config
  ```
  Beide müssen `404` (oder `403`) sein.

### 5. Neue Schlösser

- Auf dem Server: `apt list --upgradable` zeigt offene Updates. Vor grösseren Updates ein Foto (Skill `zurueck-auf-gestern`), dann `sudo apt update && sudo apt upgrade`.
- Im Projekt: `npm audit` (falls es eine `package.json` gibt) zeigt bekannte Lücken in Bausteinen.

### 6. Wenig Rechte

- Workflows mit `permissions: contents: read`.
- Programme im Container nicht als root laufen lassen, wenn die Vorlage das erlaubt (`USER` im Dockerfile).
- Jede Person, die mitarbeitet, bekommt einen eigenen Zugang, keinen geteilten.

### 7. Mission prüfen

Logbuch und Fliessband (Skills `git-logbuch`, `pipeline`), dann `mission_pruefen` mit `flugschule-07-sicherheit`. Die Prüfung schaut, ob `~/projekt/.gitignore` auf dem Server `.env` enthält.

## Wenn etwas passiert ist

1. Geheimnis beim Anbieter neu erzeugen, altes sperren.
2. Prüfen, ob es missbraucht wurde (Rechnungen, Logins, Versandlisten beim Anbieter).
3. Server zurück auf ein Foto von vor dem Vorfall, wenn er verändert wurde (Skill `zurueck-auf-gestern`).
4. Geht es um Daten anderer Menschen: Albatros über `coach_fragen` informieren. Bei hohem Risiko für Betroffene verlangt das Datenschutzgesetz eine Meldung an den EDÖB (Art. 24 DSG). Keine Rechtsberatung.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «den Schlüssel nicht unter die Fussmatte», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
