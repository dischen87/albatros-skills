# Albatros Skills

Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen. Du sagst deiner KI im Terminal «Ich will eine Webseite» oder «Ich habe eine Geschäftsidee». Sie führt dich zu einem echten eigenen Server. Unterwegs lernst du, was SSH-Schlüssel, Git und ein Fliessband (CI/CD) sind. Dein Logbuch (Git) liegt im Hafen von Albatros, `code.aufwind.sh`. Ein GitHub-Konto brauchst du erst, wenn du in ein eigenes Haus umziehst.

Die drei Stufen jeder Mission:

- **abheben:** Idee und Produkt
- **fliegen:** Setup und live gehen
- **landen:** der erste Fan, also sichtbar werden und die ersten Kundinnen und Kunden gewinnen

Dieses Repo enthält:

- das **Plugin `albatros`** für Claude Code (Skills und die Verbindung zu Albatros über MCP),
- die **Skills** der Flugschule und des Wegs Webseite, im [Agent-Skills-Standard](https://agentskills.io) (`SKILL.md`), damit sie auch in Codex und Gemini CLI laufen,
- die **Missionen** aller drei Wege als Markdown. Die Website macht daraus öffentliche Lernseiten, der Dienst flugschule prüft damit den Fortschritt,
- die **Vorlage** für das Projekt-Repo der Lernenden (`vorlage/`): eine kleine Seite, `Dockerfile`, `compose.yaml` und das Fliessband.

flotte legt mit der Vorlage für jeden neuen Server `{name}/projekt` im Hafen an und klont es nach `~/projekt`. flotte-1 holt die Vorlage beim Deploy von `albatros-flotte`. Nach einer Änderung an `vorlage/` also `gh workflow run "Deploy flotte-1" -R dischen87/albatros-flotte` starten. Danach gilt sie für neue Server. Bestehende Repos bleiben, wie sie sind.

Die Methoden für den Weg Geschäft liegen im privaten Repo `albatros-methoden`. Der MCP-Dienst liefert sie mit dem Werkzeug `methode` an Mitglieder aus.

## Hauptskill und Bibliothek

Die Skills sind eine offene Bibliothek: Jede und jeder kann sie lesen und selbst den passenden wählen. Der spannende Teil ist, im richtigen Moment das Richtige zu tun. Das macht der Hauptskill **`lotse`**, wie der Fluglotse im Turm, der auf dem Radar sieht, wo jedes Flugzeug ist:

1. Er ruft das Werkzeug `lage` auf. Es liest den echten Stand der Person bei Albatros (Abo, Schlüssel, Server oder Seite, Fliessband, Domain, Mission) und nennt den Skill, der jetzt dran ist, mit Grund und dem, was danach kommt.
2. Er liest diesen Skill (`../<kennung>/SKILL.md` im selben Plugin, in Claude Code auch `albatros:<kennung>`) und folgt ihm. Beim Weg Geschäft holt er die Methode mit `methode`.
3. Nach jedem geschafften Schritt fragt er `lage` erneut.

Der Lotse funktioniert nur mit Anmeldung, denn nur dann kennt Albatros den Stand. Wann welcher Skill dran ist, entscheidet der MCP-Dienst, nicht dieses Repo. Ohne Anmeldung zeigt der Lotse die Bibliothek mit einer Zeile pro Skill und erklärt, wie die Anmeldung geht. Die Kennungen der Skills bleiben deutsch und stabil, auch in den Plugins für andere Sprachen.

> Status: öffentlich ab dem Go-live von albatros.build (freigegeben am 28.10.2026). Lizenz: MIT, siehe [LICENSE](LICENSE).

## Installation

Die Person tippt keine Befehle. Sie sagt ihrer KI (Claude Code, Codex oder Gemini CLI) einen Satz:

> Richte mir Albatros ein: https://albatros.build/einrichten

Die KI liest die Anleitung [EINRICHTEN.md](EINRICHTEN.md) und erledigt alles selbst: Plugin oder Skills, Verbindung zu Albatros und Anmeldung. Von der Person braucht sie nur eine Freigabe im Fenster der KI und die Anmeldung im Browser. In Claude Code tippt sie zusätzlich einmal `/reload-plugins`, in Gemini CLI startet sie das Programm einmal neu. Bis die Seite auf albatros.build steht, gilt dieselbe Anleitung unter https://raw.githubusercontent.com/dischen87/albatros-skills/main/EINRICHTEN.md.

Getestet am 28.10.2026:
- **Claude Code 2.1.283:** In einer interaktiven Sitzung ruft die KI das Werkzeug `authenticate` des Servers albatros auf. Es gibt einen Link zur Anmeldung zurück, danach sind die Werkzeuge da. Mit `claude -p` gibt es dieses Werkzeug nicht. `claude mcp login` braucht ein echtes Terminal.
- **Codex 0.142:** `codex plugin marketplace add` und `codex mcp login` schreiben in `~/.codex` und brauchen das Netz. In der Sandbox scheitern sie oder können den Browser nicht öffnen. Darum fragt die KI einmal um Freigabe. `codex mcp login` wartet ohne Terminal, bis die Anmeldung im Browser fertig ist.
- **Gemini CLI:** nicht getestet, nach der Dokumentation.

Von Hand, für alle, die selbst tippen wollen:

| KI | Befehle |
|---|---|
| Claude Code | `/plugin marketplace add dischen87/albatros-skills`, `/plugin install albatros@albatros`, dann `/mcp`, `albatros`, «Authenticate» |
| Codex | `codex plugin marketplace add dischen87/albatros-skills`, `codex plugin add albatros@albatros`, `codex mcp login albatros` |
| Gemini CLI | `npx skills add dischen87/albatros-skills -a gemini-cli -g -y --skill '*'`, `gemini mcp add --transport http -s user albatros https://mcp.albatros.build`, im Programm `/mcp auth albatros` |

Den Befehl `/albatros:start` gibt es nur in Claude Code. In Codex und Gemini sagt die Person «Starte Albatros», dann lädt die KI den Skill `start`. `npx skills` findet die Skills über `.claude-plugin/marketplace.json`, getestet mit `skills@1.7.4`.

## Sprachen

Alle Skills und Missionen gibt es auf Deutsch, Französisch, Italienisch und Englisch, mit denselben Kennungen. Begriffe und Ablage: [GLOSSAR.md](GLOSSAR.md).

| Sprache | Claude Code | Codex und Gemini CLI |
|---|---|---|
| Deutsch | `/plugin install albatros@albatros` | `npx skills add dischen87/albatros-skills` |
| Français | `/plugin install albatros-fr@albatros` | `npx skills add https://github.com/dischen87/albatros-skills/tree/main/plugins/albatros-fr` |
| Italiano | `/plugin install albatros-it@albatros` | `npx skills add https://github.com/dischen87/albatros-skills/tree/main/plugins/albatros-it` |
| English | `/plugin install albatros-en@albatros` | `npx skills add https://github.com/dischen87/albatros-skills/tree/main/plugins/albatros-en` |

Die Werkzeuge von Albatros antworten auf Deutsch; die Skills sagen der KI, dass sie alles in der Sprache der Person weitergibt. Evals gibt es nur für Deutsch.

## Aufbau

```
.claude-plugin/marketplace.json     Marktplatz «albatros» mit einem Plugin
plugins/albatros/
  .claude-plugin/plugin.json
  .mcp.json                         MCP-Server https://mcp.albatros.build (Streamable HTTP, OAuth über Clerk)
  skills/<name>/SKILL.md            19 Skills: lotse (Hauptskill, /albatros:lotse), start (/albatros:start) und die Bibliothek
  evals/<name>/                     mindestens ein Eval-Fall pro Skill (claude plugin eval)
  evals/mocks/albatros/             Antworten der Albatros-Werkzeuge für die Evals
missionen/<weg>/<nr>-<slug>.md      32 Missionen: flugschule 10, webseite 8, geschaeft 14
schema/mission.schema.json          JSON Schema der Missions-Kopfdaten
vorlage/                            Vorlage für {name}/projekt im Hafen: Seite, Dockerfile, compose.yaml, Fliessband
scripts/pruefen.ts                  prüft Skills und Missionen
```

## Skills

| Weg | Skill | Bild |
|---|---|---|
| alle | `lotse` | der Fluglotse im Turm: sagt, was jetzt dran ist |
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
stufe: fliegen                       # abheben (Idee, Produkt) | fliegen (Setup, live) | landen (erster Fan)
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
| `workflow` | `datei` (`.github/workflows/…`) | der letzte Lauf im Repo der Person im Hafen (Forgejo) grün ist |
| `docker` | `container` | der Container läuft |

Platzhalter: `{name}` (Server der Person, z. B. `anna` → `https://anna.aufwind.sh`), `{domain}` (ihre eigene Domain).

Annahmen über die Instanz: Benutzer `pilot`, Projekt in `~/projekt` (Klon von `git@aufwind.sh:{name}/projekt.git`, vom Fliessband aktualisiert), Arbeitsdokumente in `~/projekt/docs/`, Webserver-Container `webseite` auf Port 80. Das Fliessband ist ein Forgejo-Runner auf dem Server (`runs-on: albatros`), der als `pilot` direkt in `~/projekt` ausliefert. GitHub kommt erst beim Umzug (Skill `landung`) dazu.

## Prüfen

```bash
bun install
bun run pruefen                       # Kopfdaten aller Skills und Missionen gegen das Schema
claude plugin validate .              # Marktplatz und Plugin
QUELLE=$PWD bash scripts/einbau-test.sh   # Einbau nach EINRICHTEN.md in leerem Home (CI: Job einbau)
claude plugin eval plugins/albatros --tag kern --ablation none --allow-tools Write \
  --model sonnet --judge-model sonnet --runs 3 --threshold 0.8 -j 4
```

- Jeder Fall läuft dreimal. Ein Fall besteht, wenn sein Schnitt mindestens 0,8 ist: ein kleiner Ausrutscher in drei Läufen ist erlaubt, ein Fehler in jedem Lauf nicht. Der Judge ist Sonnet, weil Haiku bei deutschen Texten mit mehreren Kriterien zu stark schwankt.
- Pro Fall prüft ein LLM-Grader die letzte Chat-Antwort (`kriterien.md` oder `antwort.md`). Schreibt der Skill eine Datei, prüft ein zweiter Grader ihren Inhalt (`focus: {source: file, path: …}`). `focus: files` zeigt nur Dateinamen und `focus: trace` nur Rohdaten, beide taugen nicht.

- Der Fall `ssh-schluessel-lokal` (Tag `bash`) lässt die KI den Schlüssel wirklich mit `ssh-keygen` erzeugen. Er braucht `--allow-tools Bash` und eine Maschine, auf der Claude Code Bash in Evals erlaubt.
- Die Evals rufen nie den echten MCP-Server. Die Antworten der Werkzeuge kommen aus `evals/mocks/albatros/`.

## Quellen

Die Methoden stammen aus der Arbeit bei Swiss Activities (Wiederverwendung freigegeben) und DIISI. Übernommen sind nur Methoden. Rausgeflogen sind Namen von Personen und Marken, interne Adressen, Kennzahlen, Zugänge und Pfade. Was keine interne Quelle hat, ist allgemeine Praxis.

| Quelle | Skill | Was übernommen wurde |
|---|---|---|
| DIISI-Skill «git-hygiene» | `git-logbuch` | Nur `main`, nur eigene Dateien einzeln aufnehmen, nie force-push; Ablauf status → add → diff --cached → commit → pull --rebase → push; Umgang mit fremden offenen Änderungen |
| CI- und Deploy-Workflow eines Produktivprojekts | `pipeline`, `landung`, `sicherheit` | Ausliefern nur nach grüner Prüfung auf `main`, Prüfung von aussen mit Wiederholungen, Secrets nur über `env:` (`pipeline`); `concurrency` ohne Abbruch, minimale `permissions`, Prüfschritt für fehlende Secrets, eigener Schlüssel und gepinnter Host-Key für das Fliessband (`landung`, GitHub-Version nach dem Umzug) |
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
