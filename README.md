# Albatros Skills

Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen. Du sagst deiner KI im Terminal «Ich will eine Webseite» oder «Ich habe eine Geschäftsidee». Sie führt dich zu einem echten eigenen Server. Unterwegs lernst du, was SSH-Schlüssel, Git und ein Fliessband (CI/CD) sind: Du hebst ab, fliegst und landest.

Dieses Repo enthält:

- das **Plugin `albatros`** für Claude Code (Skills und die Verbindung zu Albatros über MCP),
- die **Skills** der Flugschule und des Wegs Webseite, im [Agent-Skills-Standard](https://agentskills.io) (`SKILL.md`), damit sie auch in Codex und Gemini CLI laufen,
- die **Missionen** aller drei Wege als Markdown. Die Website macht daraus öffentliche Lernseiten, der Dienst flugschule prüft damit den Fortschritt.

Die Methoden für den Weg Geschäft liegen im privaten Repo `albatros-methoden`. Der MCP-Dienst liefert sie mit dem Werkzeug `methode` an Mitglieder aus.

> Status: privat. Das Repo wird erst öffentlich, wenn Mathias es freigibt. Eine Lizenz ist noch nicht gewählt.

## Installation

### Claude Code

```
/plugin marketplace add dischen87/albatros-skills
/plugin install albatros@albatros
/albatros:start
```

Lokal aus diesem Ordner: `/plugin marketplace add /Users/mathias/diisi_projekte/albatros-skills`.

Beim ersten Werkzeug-Aufruf meldet sich Albatros über den Browser an (`/mcp`, dann `albatros` und «Authenticate»).

### Codex CLI

```bash
npx skills add dischen87/albatros-skills -a codex
codex mcp add albatros --url https://mcp.albatros.build
codex mcp login albatros
```

### Gemini CLI

```bash
npx skills add dischen87/albatros-skills -a gemini-cli
gemini mcp add --transport http -s user albatros https://mcp.albatros.build
```

Danach in Gemini CLI: `/mcp auth albatros`.

`npx skills` findet die Skills über `.claude-plugin/marketplace.json`, getestet mit `skills@1.7.4`. Den Befehl `/albatros:start` gibt es nur in Claude Code. In Codex und Gemini sagst du «Starte Albatros», dann lädt die KI den Skill `start`.

## Aufbau

```
.claude-plugin/marketplace.json     Marktplatz «albatros» mit einem Plugin
plugins/albatros/
  .claude-plugin/plugin.json
  .mcp.json                         MCP-Server https://mcp.albatros.build (Streamable HTTP, OAuth über Clerk)
  skills/<name>/SKILL.md            18 Skills, der Skill start ist zugleich /albatros:start
  evals/<name>/                     ein Eval-Fall pro Skill (claude plugin eval)
  evals/mocks/albatros/             Antworten der Albatros-Werkzeuge für die Evals
missionen/<weg>/<nr>-<slug>.md      32 Missionen: flugschule 10, webseite 8, geschaeft 14
schema/mission.schema.json          JSON Schema der Missions-Kopfdaten
scripts/pruefen.ts                  prüft Skills und Missionen
```

## Skills

| Weg | Skill | Bild |
|---|---|---|
| Flugschule | `start` | Bordkarte holen und einsteigen |
| | `ssh-schluessel` | Hausschlüssel und Schloss |
| | `server-kennenlernen` | Rundgang durch die neue Wohnung |
| | `git-logbuch` | Logbuch an Bord, Kopie im Hafen |
| | `pipeline` | Fliessband mit Qualitätskontrolle |
| | `zurueck-auf-gestern` | das tägliche Foto der ganzen Wohnung |
| | `sicherheit` | den Schlüssel nicht unter die Fussmatte |
| | `kosten` | Haushaltsbuch |
| | `domain` | Adresse im Telefonbuch |
| | `landung` | Umzug ins eigene Haus |
| Webseite | `webseite-planen` | Grundriss |
| | `inhalte` | Ware im Schaufenster |
| | `gestaltung` | erst das Fundament, dann die Fassade |
| | `cms` | Pinnwand im Flur |
| | `seo-grundlagen` | Wegweiser und Stadtplan |
| | `barrierefreiheit` | Rampe neben der Treppe |
| | `recht-ch` | Klingelschild und Hausordnung |
| | `statistik` | Strichliste an der Ladentür |

Alle Skills: Deutsch, Du-Form, kein Fachjargon. Ein Begriff kommt erst, wenn er gebraucht wird, und zuerst mit seinem Bild.

## Missionen

```markdown
---
id: flugschule-02-ssh-schluessel     # <weg>-<nr>-<slug>, gleich wie der Dateiname
weg: flugschule                      # flugschule | webseite | geschaeft
stufe: abheben                       # abheben | fliegen | landen
titel: Dein Hausschlüssel für den Server
bild: Hausschlüssel und Schloss
dauer: 20                            # Minuten
pruefung:
  - typ: datei
    pfad: ~/hallo.txt
skill: ssh-schluessel                # bei geschaeft: Name der Methode
video: ssh-in-60-sekunden            # oder null
---
## Worum es geht · ## Was du lernst · ## So gehst du vor · ## Geschafft, wenn
```

Die Prüftypen passen zur Prüf-API von flotte (`POST /server/:id/pruefen`):

| typ | Felder | besteht, wenn |
|---|---|---|
| `http` | `url`, `status` (200), `enthaelt` | die Adresse so antwortet |
| `datei` | `pfad` (`~/…`), `enthaelt` | die Datei in der Instanz existiert |
| `git` | `pfad`, `min_commits` (1), `branch` (`main`) | der Ordner ein Repo mit so vielen Einträgen ist |
| `workflow` | `datei` (`.github/workflows/…`) | der letzte Lauf im Repo der Person grün ist |
| `docker` | `container` | der Container läuft |

Platzhalter: `{name}` (Server der Person, z. B. `anna` → `https://anna.aufwind.sh`), `{domain}` (ihre eigene Domain).

Annahmen über die Instanz: Benutzer `pilot`, Projekt in `~/projekt` (Klon ihres Repos, vom Fliessband aktualisiert), Arbeitsdokumente in `~/projekt/docs/`, Webserver-Container `webseite` auf Port 80.

## Prüfen

```bash
bun install
bun run pruefen                       # Kopfdaten aller Skills und Missionen gegen das Schema
claude plugin validate .              # Marktplatz und Plugin
claude plugin eval plugins/albatros --tag kern --ablation none --allow-tools Write --model sonnet -j 4
```

- Der Fall `ssh-schluessel-lokal` (Tag `bash`) lässt die KI den Schlüssel wirklich mit `ssh-keygen` erzeugen. Er braucht `--allow-tools Bash` und eine Maschine, auf der Claude Code Bash in Evals erlaubt.
- Die Evals rufen nie den echten MCP-Server. Die Antworten der Werkzeuge kommen aus `evals/mocks/albatros/`.

## Quellen

Die Methoden stammen aus der Arbeit bei Swiss Activities (Wiederverwendung freigegeben) und DIISI. Übernommen sind nur Methoden. Rausgeflogen sind Namen von Personen und Marken, interne Adressen, Kennzahlen, Zugänge und Pfade. Was keine interne Quelle hat, ist allgemeine Praxis.

| Quelle | Skill | Was übernommen wurde |
|---|---|---|
| DIISI-Skill «git-hygiene» | `git-logbuch` | Nur `main`, nur eigene Dateien einzeln aufnehmen, nie force-push; Ablauf status → add → diff --cached → commit → pull --rebase → push; Umgang mit fremden offenen Änderungen |
| CI- und Deploy-Workflow eines Produktivprojekts | `pipeline`, `sicherheit` | Ausliefern nur nach grüner Prüfung auf `main`, `concurrency` ohne Abbruch, minimale `permissions`, Prüfschritt für fehlende Secrets, Secrets nur über `env:`, eigener Schlüssel und gepinnter Host-Key für das Fliessband, Prüfung von aussen mit Wiederholungen |
| Server-Deploy-Skript desselben Projekts | `pipeline`, `zurueck-auf-gestern`, `sicherheit` | `set -euo pipefail`, `up --wait` mit Healthcheck, Rücksprung auf die letzte gute Version, `.env` nur für den Besitzer lesbar, Ports von Datenbanken nur an `127.0.0.1` |
| Server-Einrichtungs- und Sicherungsskript | `landung`, `sicherheit` | Mehrfach ausführbare Einrichtung, SSH nur mit Schlüssel, ufw erst erlauben, dann einschalten, fail2ban, nur Sicherheitsupdates automatisch, Log-Grenzen, Sicherung mit Probe |
| Infrastruktur-Workflow (Webserver neu laden) | `landung` | Erst validieren, laufende Konfiguration sichern, nach dem Neuladen von aussen prüfen, sonst zurück |
| Rechtsseiten, Monitoring-Dokumentation, Akquise-Regeln eines Produktivprojekts | `recht-ch` | Pflichtangaben Impressum (UWG Art. 3 Abs. 1 lit. s), Gliederung Datenschutzerklärung (DSG Art. 19), Statistik ohne unnötige Kennungen, Werbemails nur mit Einwilligung (lit. o) |
| DIISI-Skill «ux-redesign» mit Vorlagen und Skripten | `gestaltung`, `barrierefreiheit` | Erst Bedienung, dann Aussehen; drei Prüf-Blickwinkel mit belegten Befunden und Schweregraden; drei klar verschiedene Richtungen auf denselben Seiten; Tokens als einzige Quelle; Kontrastformel und Schwellen; Fotos in 375 und 1440 px, hell und dunkel |
| SA-Skill «funktionen-sichtbar» (Prinzipien, Bausteine) | `gestaltung`, `barrierefreiheit` | Bausteinregeln (ein Hauptknopf, deaktiviert nie unsichtbar, nie nur Farbe), Prüfpunkte für grosse Schrift, Klickflächen und Formulare |
| SA-Analytics-Vertrag (Event-Taxonomie) | `statistik` | Ereignis-Plan vor dem Einbau, ein Ereignis pro Handlung, Namensregeln, zählt erst beim Erfolg, Datenschutzregeln, eigene Besuche herausfiltern, Abgleich mit echten Anfragen |
| SA-Release-Prozess | `pipeline` | Was freigegeben ist, geht unverändert raus; Rücksprung ist geübt, nicht nur geplant |
| Albatros-Plan (A2, B1) | `start`, `ssh-schluessel`, `server-kennenlernen`, `domain`, `zurueck-auf-gestern`, `kosten` | Ablauf von `/albatros:start`, Werkzeuge des MCP-Dienstes, TXT-Beweis `_albatros`, tägliche Snapshots, Abo-Stufen. Die Lehrteile sind allgemeine Praxis |
| allgemeine Praxis | `webseite-planen`, `inhalte`, `cms`, `seo-grundlagen` | keine interne Quelle |
