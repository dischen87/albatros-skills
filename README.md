# Albatros Skills

Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen. Deine KI nimmst du im Rucksack mit auf den Weg: **Claude Code, Codex, Gemini CLI oder Cursor**. Mit allen vier klappt alles gleich. Du sagst ihr im Terminal «Ich will eine Webseite» oder «Ich habe eine Geschäftsidee». Sie führt dich zu einem echten eigenen Server. Unterwegs lernst du, was SSH-Schlüssel, Git und ein Fliessband (CI/CD) sind. Dein Logbuch (Git) liegt im Hafen von Albatros, `code.aufwind.sh`. Ein GitHub-Konto brauchst du erst, wenn du in ein eigenes Haus umziehst.

Die drei Stufen jeder Mission:

- **abheben:** Idee und Produkt
- **fliegen:** Setup und live gehen
- **landen:** der erste Fan, also sichtbar werden und die ersten Kundinnen und Kunden gewinnen

Dieses Repo enthält:

- das **Plugin `albatros`** für Claude Code (Skills und die Verbindung zu Albatros über MCP),
- die **Skills** der Flugschule und des Wegs Webseite, im [Agent-Skills-Standard](https://agentskills.io) (`SKILL.md`), damit sie auch in Codex, Gemini CLI und Cursor laufen,
- die **Missionen** aller drei Wege als Markdown. Die Website macht daraus öffentliche Lernseiten, der Dienst flugschule prüft damit den Fortschritt,
- die **Vorlage** für das Projekt-Repo der Lernenden (`vorlage/`): eine kleine Seite, `Dockerfile`, `compose.yaml` und das Fliessband,
- die **Bausteine** (`bausteine/`): fertige, gemessene Teile für Seiten mit Pilot, PocketBase für Anmeldeliste, Login und Pinnwand, Strapi für ein grosses CMS. Auswahl und Einbau: Skill `bausteine`.

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

Die Person tippt keine Befehle. Sie sagt ihrer KI (Claude Code, Codex, Gemini CLI oder Cursor) einen Satz:

> Richte mir Albatros ein: https://albatros.build/einrichten

Die KI liest die Anleitung [EINRICHTEN.md](EINRICHTEN.md) und erledigt alles selbst: Plugin oder Skills, Verbindung zu Albatros und Anmeldung. Von der Person braucht sie nur eine Freigabe im Fenster der KI und die Anmeldung im Browser. In Claude Code tippt sie zusätzlich einmal `/reload-plugins`, in Gemini CLI und im Editor von Cursor startet sie das Programm einmal neu. Bis die Seite auf albatros.build steht, gilt dieselbe Anleitung unter https://raw.githubusercontent.com/dischen87/albatros-skills/main/EINRICHTEN.md.

Getestet am 28.10.2026:
- **Claude Code 2.1.283:** In einer interaktiven Sitzung ruft die KI das Werkzeug `authenticate` des Servers albatros auf. Es gibt einen Link zur Anmeldung zurück, danach sind die Werkzeuge da. Mit `claude -p` gibt es dieses Werkzeug nicht. `claude mcp login` braucht ein echtes Terminal.
- **Codex 0.142:** `codex plugin marketplace add` und `codex mcp login` schreiben in `~/.codex` und brauchen das Netz. In der Sandbox scheitern sie oder können den Browser nicht öffnen. Darum fragt die KI einmal um Freigabe. `codex mcp login` wartet ohne Terminal, bis die Anmeldung im Browser fertig ist.
- **Gemini CLI:** nicht getestet, nach der Dokumentation.
- **Cursor:** nach der Dokumentation (29.10.2026). Clerk nimmt die Rücksprünge von Cursor an (`http://localhost:8787/callback`, ältere Versionen `cursor://anysphere.cursor-mcp/oauth/callback`). Der Einbau ohne Anmeldung läuft im Check `einbau`.

Von Hand, für alle, die selbst tippen wollen:

| KI | Befehle |
|---|---|
| Claude Code | `/plugin marketplace add dischen87/albatros-skills`, `/plugin install albatros@albatros`, dann `/mcp`, `albatros`, «Authenticate» |
| Codex | `codex plugin marketplace add dischen87/albatros-skills`, `codex plugin add albatros@albatros`, `codex mcp login albatros` |
| Gemini CLI | `npx skills add dischen87/albatros-skills -a gemini-cli -g -y --skill '*'`, `gemini mcp add --transport http -s user albatros https://mcp.albatros.build`, im Programm `/mcp auth albatros` |
| Cursor | `npx skills add dischen87/albatros-skills -a cursor -g -y --skill '*'`, in `~/.cursor/mcp.json` unter `mcpServers` der Eintrag `"albatros": { "url": "https://mcp.albatros.build" }`, dann `agent mcp login albatros` oder im Editor unter MCP anmelden |

Den Befehl `/albatros:start` gibt es nur in Claude Code. In Codex, Gemini CLI und Cursor sagt die Person «Starte Albatros», dann lädt die KI den Skill `start`. `npx skills` findet die Skills über `.claude-plugin/marketplace.json`, getestet mit `skills@1.7.4`.

## Sprachen

Alle Skills und Missionen gibt es auf Deutsch, Französisch, Italienisch und Englisch, mit denselben Kennungen. Begriffe und Ablage: [GLOSSAR.md](GLOSSAR.md).

| Sprache | Claude Code | Codex, Gemini CLI und Cursor |
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
  skills/<name>/SKILL.md            27 Skills: lotse (Hauptskill, /albatros:lotse), start (/albatros:start) und die Bibliothek
  evals/<name>/                     mindestens ein Eval-Fall pro Skill (claude plugin eval)
  evals/mocks/albatros/             Antworten der Albatros-Werkzeuge für die Evals
  evals/GUTE-ANTWORT.md             was eine gute Antwort je Phase enthält, erzeugt aus fahrplan.yaml (scripts/gute-antwort.ts)
  evals/KRITERIEN-LOG.md            jede Änderung an Kriterien mit Datum, Fall und Grund
fahrplan.yaml                       der Ablauf P1 bis P13: Skills, Pflichtfragen, Ergebnisse, Ja-Momente, Gates, Insel-Schritte
missionen/<weg>/<nr>-<slug>.md      41 Missionen: flugschule 18, webseite 9, geschaeft 14
schema/mission.schema.json          JSON Schema der Missions-Kopfdaten
schema/fahrplan.schema.json         JSON Schema von fahrplan.yaml
vorlage/                            Vorlage für {name}/projekt im Hafen: Seite, Dockerfile, compose.yaml, Fliessband
scripts/pruefen.ts                  prüft Skills, Missionen, Fahrplan, Version und GUTE-ANTWORT.md, auch dass es jeden Skill (mit Dateien wie pruefen.mjs) und jede Mission in allen vier Sprachen gibt
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
| Webseite | `webseite-modernisieren` | einen Altbau renovieren: Bestandsaufnahme der alten Seite |
| | `webseite-planen` | Grundriss |
| | `konzept` | der Charakter des Hauses, bevor Farben gewählt werden (Platzhalter) |
| | `entwurf` | das begehbare Modell, bevor der Rohbau beginnt (Platzhalter) |
| | `lancieren` | wo das Haus steht, und die Eröffnung mit Band (Platzhalter) |
| | `betrieb` | Briefkasten, Rauchmelder und Haustür, bevor die Gäste kommen (Platzhalter) |
| | `webseite-bauen` | die kleine Fabrik: Auftrag, Mockup, Designsystem, Tech-Stack, PRD mit Abnahmekriterien, lokal bauen, vier Prüfungen, Freigabe, Hafen, Fliessband und live; misst mit `pruefen.mjs` (Geheimnisse, npm audit, axe, tote Links, Tokens, Fotos, Lighthouse, JavaScript, Bilder) |
| | `inhalte` | Ware im Schaufenster |
| | `gestaltung` | erst das Fundament, dann die Fassade |
| | `cms` | Pinnwand im Flur |
| | `bausteine` | Fertigteile beim Hausbau |
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
phase: P11                           # Phase im Fahrplan: dort wird das Thema gebraucht und ist die Prüfung bestehbar
optional: true                       # nur bei freiwilligen Missionen (domain, landung, cms, statistik)
titel: Dein Hausschlüssel für den Server
bild: Hausschlüssel und Schloss
dauer: 20                            # Minuten
pruefung:
  - typ: datei
    pfad: ~/hallo.txt
skill: ssh-schluessel                # bei geschaeft: Name der Methode
video: ssh-in-60-sekunden            # oder null
verstehen:                           # optional, 1 bis 3 Kontrollfragen der Lektion mit Kernaussage
  - frage: Was ist ein SSH-Schlüssel, in einem Satz?
    kern: Hausschlüssel und Schloss …
---
## Worum es geht · ## Was du lernst · ## So gehst du vor · ## Geschafft, wenn
```

Die Prüftypen passen zur Prüf-API von flotte (`POST /server/:id/pruefen`); `insel` prüft flugschule selbst:

| typ | Felder | besteht, wenn |
|---|---|---|
| `http` | `url`, `status` (200), `enthaelt` | die Adresse so antwortet |
| `datei` | `pfad` (`~/…`), `enthaelt` | die Datei in der Instanz existiert |
| `git` | `pfad`, `min_commits` (1), `branch` (`main`) | der Ordner ein Repo mit so vielen Einträgen ist |
| `workflow` | `datei` (`.github/workflows/…`) | der letzte Lauf im Repo der Person im Hafen (Forgejo) grün ist |
| `docker` | `container` | der Container läuft |
| `insel` | `schritt` (Schlüssel aus `insel` in `fahrplan.yaml`) | ein Projekt der Person auf der Insel mindestens bei diesem Schritt steht |

Bis P10 (`gratis_bis`) liegt alles nur auf dem Computer der Person: Dort prüfen Missionen nur mit `insel`, und der Schritt gehört zur Phase der Mission (`pruefen.ts` prüft beides).

Platzhalter: `{name}` (Server der Person, z. B. `anna` → `https://anna.aufwind.sh`), `{domain}` (ihre eigene Domain).

Annahmen über die Instanz: Benutzer `pilot`, Projekt in `~/projekt` (Klon von `git@aufwind.sh:{name}/projekt.git`, vom Fliessband aktualisiert), Arbeitsdokumente in `~/projekt/docs/`, Webserver-Container `webseite` auf Port 80. Das Fliessband ist ein Forgejo-Runner auf dem Server (`runs-on: albatros`), der als `pilot` direkt in `~/projekt` ausliefert. GitHub kommt erst beim Umzug (Skill `landung`) dazu.

## Prüfen

```bash
bun install
bun run pruefen                       # Skills, Missionen, Fahrplan, Version und GUTE-ANTWORT.md
bun scripts/gute-antwort.ts           # GUTE-ANTWORT.md neu erzeugen, nach jeder Änderung an fahrplan.yaml, phase: in Evals oder KRITERIEN-LOG.md
claude plugin validate .              # Marktplatz und Plugin
QUELLE=$PWD bash scripts/einbau-test.sh   # Einbau nach EINRICHTEN.md in leerem Home (CI: Job einbau)
claude plugin eval plugins/albatros --tag kern --ablation none --allow-tools Write \
  --model sonnet --judge-model sonnet --runs 3 --threshold 0.8 -j 4
```

- Jeder Fall läuft dreimal. Ein Fall besteht, wenn sein Schnitt mindestens 0,8 ist: ein kleiner Ausrutscher in drei Läufen ist erlaubt, ein Fehler in jedem Lauf nicht. Der Judge ist Sonnet, weil Haiku bei deutschen Texten mit mehreren Kriterien zu stark schwankt.
- Pro Fall prüft ein LLM-Grader die letzte Chat-Antwort (`kriterien.md` oder `antwort.md`). Schreibt der Skill eine Datei, prüft ein zweiter Grader ihren Inhalt (`focus: {source: file, path: …}`). `focus: files` zeigt nur Dateinamen und `focus: trace` nur Rohdaten, beide taugen nicht.
- Was eine gute Antwort je Phase enthält, steht in `evals/GUTE-ANTWORT.md` (aus `fahrplan.yaml` erzeugt). Ein Fall nennt seine Phase im Kopf seiner `prompt.md` (`phase: P3` oder `phase: [P3, P4]`); jede Änderung an Kriterien kommt mit Datum, Fall und Grund in `evals/KRITERIEN-LOG.md`.
- Version: Ändert sich etwas unter `plugins/*/skills`, steigt die Version in allen `plugin.json` und in `.claude-plugin/marketplace.json` gegenüber `origin/main`; jede `SKILL.md` trägt sie als `metadata.stand`. Eine Übersetzung nennt in `metadata.quelle` den deutschen Text, nach dem sie übersetzt ist (`grep -v '^  stand: ' <deutsche SKILL.md> | shasum -a 256 | cut -c1-12`); ändert sich der deutsche Text, meldet `pruefen.ts` die Übersetzung als veraltet, bis sie nachgeführt und `quelle` neu gesetzt ist.

- Der Fall `ssh-schluessel-lokal` (Tag `bash`) lässt die KI den Schlüssel wirklich mit `ssh-keygen` erzeugen. Er braucht `--allow-tools Bash` und eine Maschine, auf der Claude Code Bash in Evals erlaubt.
- Die Evals rufen nie den echten MCP-Server. Die Antworten der Werkzeuge kommen aus `evals/mocks/albatros/`.
- Der Fall `webseite-aendern-termin` legt mit `case.yaml` und `scaffold.sh` eine fertige Seite (docs/, Termine als Daten) in den Arbeitsordner. Er läuft nur mit `--scaffold` und `--allow-tools Write,Edit`. Die Fälle `webseite-bauen-prd` und `webseite-bauen-pruefung` prüfen Tech-Stack, PRD mit Abnahmekriterien und die vier Berichte aus Messwerten, ohne Bash.
- Evals mit Bash laufen auf diesem Mac nicht (der Docker-Ordner enthält einen symbolischen Link). Die Fälle `modernisieren-*` lesen die Seite darum mit WebFetch, mit 15 Minuten Zeit pro Lauf.

### Durchspiel-Test

Ein Durchlauf mit zwei KIs nach dem Fahrplan (`fahrplan.yaml`, P1 bis P13), ergänzend zu den Einzel-Evals. Die eine KI (Claude Code mit dem Plugin, Sonnet) bekommt nur den ersten Satz einer Person aus `scripts/durchspiel/personen.ts`, die andere spielt die Person (Haiku). Jede Person weiss Dinge, die die KI über mehrere Runden erfragen muss (Projektname, Zielgruppe, Maskottchen ja oder nein …), und sagt sie nur auf Nachfrage. Alle Personen, Orte und Adressen sind erfunden, ausser der Seite im Fall `curling`, die nie ins Netz geht.

| Fall | Person | prüft vor allem | bis |
|---|---|---|---|
| `knapp` | antwortet mit wenigen Worten, nur auf die erste Frage | nachfragen, bis jede Pflichtfrage beantwortet ist | P13 |
| `gratis-bis-lokal` | Gratis, zahlt erst nach der fertigen Seite, wohnt selbst | kein `upgrade_link`, keine Seite bei Albatros | P11 |
| `nein-vor-bau` | sagt beim ersten Mal Nein zum Bauen | nach dem Nein weder gebaut noch freigegeben | P9 |
| `lernen` | will lernen statt machen lassen | `modus_waehlen`, Kontrollfrage, `verstanden_melden` erst nach ihrer Antwort | P2 |
| `geschaeft` | Geschäftsidee, Weg Geschäft | Methoden der Phasen (`ideen-check`, `zielgruppe`, `angebot-und-preis`, `landingpage`) | P3 |
| `musikverein` | erfundener Verein, als einziger auch gegen die echte Plattform | ganzer Ablauf bis live | P13 |
| `curling`, `buchung` | modernisiert eine bestehende Seite; Yogastudio mit Buchungstool (Pilot, Baustein) | Bestandsaufnahme; Wohnort Pilot, Probe mit PocketBase | P13 |

**Ohne Modell und ohne Kosten prüfen** (kein Netz, kein Port, kein Konto):

```bash
bun test                                                                              # Punkte, Trockenlauf und Verlauf
bun scripts/durchspiel.ts --trocken scripts/durchspiel/beispiele/gut-lernen.json        # Exit 0
bun scripts/durchspiel.ts --trocken scripts/durchspiel/beispiele/schlecht-gratis.json   # Exit 1
bun scripts/punkte.ts <ergebnis-ordner>                                               # Punkte eines Laufs neu rechnen (lauf.json)
bun scripts/verlauf.ts                                                                # Trend je Fall
```

Der Trockenlauf spielt einen aufgezeichneten Verlauf ab (Format von `lauf.json`): Statt der KI schreibt er die Dateien jeder Runde, ruft die Werkzeuge der Attrappe und öffnet, was die KI öffnete; statt der Person kommen ihre aufgezeichneten Nachrichten. Attrappe, Protokolle, Zustände, Punkte und Exit-Code laufen wie in einem echten Lauf. Die drei Beispiele in `scripts/durchspiel/beispiele/` (gut, schlecht, nicht auswertbar) sind von Hand geschrieben, je mit erwartetem Exit-Code, nicht von einem Modell aufgezeichnet.

**Mit Modell** (kostet; `--budget` deckelt die bauende KI, Standard 30 USD, dazu Person und Richter):

```bash
bun scripts/durchspiel.ts --fall knapp --bis P4                    # nur bis der Plan bestätigt ist, günstiger
bun scripts/durchspiel.ts --fall nein-vor-bau --ohne-richter       # ohne Urteil des Modells
bun scripts/durchspiel.ts https://www.grindelwald-curling.ch/      # Fall curling
bun scripts/durchspiel.ts --auswerten <temp-ordner> <ergebnis-ordner>   # Punkte, Fotos und Richter eines Laufs nochmals
```

Ergebnis in `plugins/albatros/evals/results/durchspiel-<zeit>/` (nicht im Git): `verlauf.md`, `lauf.json` (Nachrichten, Werkzeuge mit Runde, Geöffnetes, Ergebnisdateien nach jeder Runde), `punkte.json`, `bewertung.json`, `protokoll.json`, `fotos/`, `dateien/`, `kosten.json`, `verlauf-zeile.json`. Der Lauf hört auf, sobald alle Insel-Schritte und Ergebnisse bis `--bis` da sind, die Person ENDE sagt, oder Runden (`--runden`, Standard 80) oder Budget aufgebraucht sind.

Gegen die echte Plattform läuft er nur im Workflow «Durchspiel» von `dischen87/albatros` (`--echt --fall musikverein`), mit albatros-skills im Stand aus `inhalte.lock` der Plattform, nie `main`. Die E2E-Person beginnt wie neu (Hafen-Repo auf der Vorlage, Flugbuch und Insel leer) und bekommt Light ohne Zahlung; die KI meldet sich über das echte MCP an und baut die Seite des erfundenen Musikvereins unter `e2e-plattform.aufwind.sh`. Danach wird alles wie im E2E weggeräumt. Inhalte fremder Seiten gehen nie ins Netz, darum ist `--echt` nur mit Personen erlaubt, die `echt: true` haben.

**Was zählt** (Punkte und Exit-Code, nur aus deterministischen Feldern, `scripts/punkte.ts`), je für die Phasen bis `--bis`:

- Ergebnisdateien mit ihren Pflichtzeilen am Zeilenanfang (wie `lage` sie liest), Pflichtfragen beantwortet (die der Person nie als `[Annahme]`, keine `[offen]`), die verdeckten Tatsachen der Person in der Ablage ihrer Pflichtfrage, Ja-Momente mit Datum.
- Insel: jeder Schritt bis zum Abschluss der letzten Phase gemeldet, der Abschluss einer Phase erst mit ihren Ergebnissen.
- Werkzeuge: `lage` vor der ersten Ergebnisdatei, mit `skills_stand` und `belege`; `weg_waehlen`, die Methoden der Phasen (Weg Geschäft), die Werkzeuge der Person (`modus_waehlen`, `verstanden_melden`); kein verbotenes Werkzeug; kein `upgrade_link` vor P11 ohne `bestaetigt: true`; `verstanden_melden` erst nach einer Frage der KI.
- Höchstens zwei Fragen je Nachricht (Fragezeichen am Satzende, ohne Code und Adressen); gezeigt mit `open`: Skizze, Musterblatt, Entwurf, Seite lokal.
- Kein Bauen (Quellen in `web/` oder eine eigene `seite/`) ohne `Freigegeben zum Bauen: <Datum>` wie bei `pruefen.mjs --vor-bau`; nach dem Nein der Person weder gebaut noch freigegeben.

Exit 0: alles eingehalten. Exit 1: mindestens eine Prüfung verletzt. Exit 2: nicht auswertbar, oder der Kern der Person kam im Lauf nie vor (zum Beispiel `nein-vor-bau --bis P4`: nie ein Nein, also nichts bewiesen). Ändert sich eine Prüfung, steigt `PUNKTE_STAND` in `scripts/punkte.ts` mit Datum und Grund; der Trend vergleicht nur Läufe mit gleichem Stand.

**Was nicht zählt:** Das Urteil des Richters (Sonnet, `bewertung.json`: Phasen und Gates, Fragen in eigenen Worten, Bild je Schritt, ohne Fachjargon, nichts erfunden, Gestaltung an den Fotos) wird gespeichert, ändert aber nie Punkte oder Exit-Code. Ebenso die Fotos, die maschinelle Prüfung der gebauten Seite mit `pruefen.mjs`, die Probe mit PocketBase (Fall `buchung`) und die Kosten.

**Verlauf:** Je Lauf mit Modell kommt eine Zeile in `scripts/durchspiel/verlauf.jsonl`: Datum, Commit der Skills, mit `--echt` Commit und Pin der Plattform, Fall, Phasen, Punkte je Prüfung, Exit, Runden, Kosten. Nie Inhalte oder Angaben zur Person: `scripts/verlauf.ts` lehnt jedes andere Feld und jeden freien Text ab. Die Datei liegt im Repo, damit der Trend über Rechner und Wochen hält, und ausserhalb von `plugins/`, damit sie nie bei den Lernenden landet. Trockenläufe schreiben keine Zeile (`--verlauf <datei>` schreibt sie trotzdem). Die Zeile eines Laufs im Workflow liegt im Artefakt `durchspiel/verlauf-zeile.json`; übernehmen mit `bun scripts/verlauf.ts --anhaengen <ordner>`.

**Attrappe:** Ohne `--echt` ist Albatros `scripts/durchspiel/mock-mcp.ts` und antwortet wie die Plattform mit den Schaltern FAHRPLAN und ERFASSUNG: `lage` nach dem Fahrplan (Phase aus Insel und `belege`, offene Pflichtfragen, Ergebnis, Gate, Gratis-Hinweis, Modus und Lektion), `schritt_melden` mit den 19 Schritten, `upgrade_link` ohne Abo vor P11 nur mit `bestaetigt`, `methode` aus `albatros-methoden` daneben (oder `DURCHSPIEL_METHODEN`), dazu Weg, Modus, verstanden, `skill_holen`, `luecke_melden` und Konto. Werkzeuge und Anleitung stehen in `scripts/durchspiel/mocks/werkzeuge.json` und `anleitung.txt`, erzeugt aus dem Code von albatros (Befehl im Kopf von `mock-mcp.ts`). Der Hafen ist ein lokales Git-Repo; `open`, `xdg-open` und `ssh` schreiben nur ins Protokoll; `curl` auf `https://<name>.aufwind.sh` bekommt die Seite aus `seite/` im Hafen, wie bei Light. Keine Zahlung, kein Server, nichts wird veröffentlicht.

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
