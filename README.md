# Albatros Skills

Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen. Deine KI nimmst du im Rucksack mit auf den Weg: **Claude Code, Codex, Gemini CLI oder Cursor**. Mit allen vier klappt alles gleich. Du sagst ihr im Terminal «Ich will eine Webseite» oder «Ich habe eine Geschäftsidee». Sie führt dich nach einem festen Fahrplan von der Idee bis zur Seite im Netz und fragt von sich aus, was sie wissen muss. Bis deine Seite auf deinem Computer fertig und freigegeben ist, kostet Albatros nichts; ins Netz geht sie mit Light, mit Pilot (ein echter eigener Server) oder selbst. Unterwegs lernst du, was SSH-Schlüssel, Git und ein Fliessband (CI/CD) sind; im Modus «lernen» machst du die wichtigen Schritte selbst. Dein Logbuch (Git) liegt bei Albatros im Hafen, `code.aufwind.sh`. Ein GitHub-Konto brauchst du nur, wenn deine Seite selbst wohnt (zum Beispiel auf GitHub Pages) oder du in ein eigenes Haus umziehst.

Der Fahrplan hat 13 Phasen (P1 bis P13, `fahrplan.yaml`) in drei Etappen:

- **abheben:** Idee und Produkt, von der Idee über Research, Plan, Konzept und Musterblatt bis zum Entwurf der ganzen Seite (P1 bis P8)
- **fliegen:** die Seite auf dem eigenen Computer bauen, prüfen und freigeben, dann den Wohnort wählen (P9 bis P11)
- **landen:** Betrieb vorbereiten, live schalten und der erste Fan, also sichtbar werden und die ersten Kundinnen und Kunden gewinnen (P12, P13 und danach)

Jede Mission nennt ihre Phase (`phase`); ihr Feld `stufe` trägt dieselben drei Namen (Abschnitt «Missionen»).

Dieses Repo enthält:

- das **Plugin `albatros`** für Claude Code (Skills und die Verbindung zu Albatros über MCP),
- die **Skills** der Flugschule und des Wegs Webseite, im [Agent-Skills-Standard](https://agentskills.io) (`SKILL.md`), damit sie auch in Codex, Gemini CLI und Cursor laufen,
- die **Missionen** aller drei Wege als Markdown. Die Website macht daraus öffentliche Lernseiten, der Dienst flugschule prüft damit den Fortschritt,
- den **Fahrplan** (`fahrplan.yaml`): Phasen, Skills und Abschnitte, Pflichtfragen, Ergebnisse, Ja-Momente und Insel-Schritte; albatros erzeugt daraus, was `lage` braucht,
- die **Vorlage** für das Projekt-Repo der Lernenden (`vorlage/`): eine kleine Seite, `AGENTS.md` mit `CLAUDE.md` und `GEMINI.md` (Hinweise für jede KI), `Dockerfile`, `compose.yaml` und das Fliessband,
- die **Bausteine** (`bausteine/`): fertige, gemessene Teile für Seiten mit eigenem Server, PocketBase für Anmeldeliste, Buchungen, Login und Pinnwand, ein Eingang mit einem Login für mehrere Teile, Strapi für ein grosses CMS. Auswahl und Einbau: Skill `bausteine`.

flotte legt mit der Vorlage für jeden neuen Server `{name}/projekt` im Hafen an und klont es nach `~/projekt`. flotte-1 holt die Vorlage beim Deploy von `albatros-flotte`. Nach einer Änderung an `vorlage/` also `gh workflow run "Deploy flotte-1" -R dischen87/albatros-flotte` starten. Danach gilt sie für neue Server. Bestehende Repos bleiben, wie sie sind.

Die Methoden für den Weg Geschäft liegen im privaten Repo `albatros-methoden`. Der MCP-Dienst liefert sie mit dem Werkzeug `methode` an Mitglieder aus.

## Hauptskill und Bibliothek

Die Skills sind eine offene Bibliothek: Jede und jeder kann sie lesen und selbst den passenden wählen. Der spannende Teil ist, im richtigen Moment das Richtige zu tun. Das macht der Hauptskill **`lotse`**, wie der Fluglotse im Turm, der auf dem Radar sieht, wo jedes Flugzeug ist:

1. Er ruft das Werkzeug `lage` auf, mit dem Stand seiner Skills und den Zeilen aus den Dateien des Projekts (`docs/projekt.md` und die anderen Ergebnisse). `lage` liest den echten Stand der Person bei Albatros (Phase im Fahrplan, Insel, Abo, Seite oder Server, Mission) und nennt den Skill und Abschnitt, der jetzt dran ist, mit Grund, den offenen Pflichtfragen der Phase und dem, was danach kommt.
2. Er liest diesen Skill (`../<kennung>/SKILL.md` im selben Plugin, in Claude Code auch `albatros:<kennung>`) und folgt ihm. Fehlt der Skill oder ist er veraltet, holt er ihn mit `skill_holen`. Beim Weg Geschäft holt er die Methode mit `methode`.
3. Nach jedem geschafften Schritt meldet er ihn (`schritt_melden`) und fragt `lage` erneut.

Den richtigen Schritt nach dem echten Stand gibt es nur mit Anmeldung, denn nur dann kennt Albatros den Stand. Wann welcher Skill dran ist, entscheidet der MCP-Dienst nach dem Fahrplan, nicht dieses Repo. Ohne Anmeldung zeigt der Lotse die drei Etappen mit dem nächsten Schritt aus dem Projektordner, auf Wunsch die Bibliothek mit einer Zeile pro Skill, und erklärt, wie die Anmeldung geht. Die Kennungen der Skills bleiben deutsch und stabil, auch in den Plugins für andere Sprachen.

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

## Aktualisieren

Die Skills liegen als Kopie auf dem Computer der Person. Ist die Kopie älter als der Fahrplan bei Albatros, meldet `lage` «Albatros aktualisieren» mit diesen Befehlen, und der Lotse holt die neuen Skills mit dem Ja der Person (Skill `lotse`, «Wenn deine Skills veraltet sind»). Bis dahin holt die KI den Skill, der jetzt dran ist, mit `skill_holen`.

| KI | Befehle |
|---|---|
| Claude Code | `claude plugin marketplace update albatros` und `claude plugin update albatros@albatros`, dann tippt die Person `/reload-plugins` |
| Codex | `codex plugin marketplace upgrade albatros` und `codex plugin add albatros@albatros`, dann ein neues Gespräch |
| Gemini CLI | `npx skills update -g -y`, dann Gemini CLI neu starten |
| Cursor | `npx skills update -g -y`, dann Cursor neu starten |

albatros erzeugt aus dieser Tabelle `AKTUALISIEREN` in `packages/kit/src/fahrplan.ts` (`scripts/fahrplan-erzeugen.ts`); `bun run pruefen` verlangt dieselben Zeilen wie im deutschen Lotse. Auf Französisch, Italienisch und Englisch heisst das Plugin `albatros-fr@albatros`, `albatros-it@albatros` und `albatros-en@albatros`; die übersetzten Lotsen nennen es so. Die Befehle sind am 31.10.2026 mit `--help` von Claude Code 2.1.118, Codex 0.141.0 und `skills@1.7.4` geprüft, nicht mit einem echten Update.

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
.claude-plugin/marketplace.json     Marktplatz «albatros» mit vier Plugins: albatros (Deutsch), albatros-fr, albatros-it, albatros-en
plugins/albatros/
  .claude-plugin/plugin.json
  .mcp.json                         MCP-Server https://mcp.albatros.build (Streamable HTTP, OAuth über Clerk)
  skills/<name>/SKILL.md            27 Skills: lotse (Hauptskill, /albatros:lotse), start (/albatros:start) und die Bibliothek
  skills/entwurf/entwurf-pruefen.mjs     Prüfskript der Person für Musterblatt und Entwurf (P6, P7): Seiten, Links, Farbfächer, Menü
  skills/webseite-bauen/pruefen.mjs      Prüfskript der Person für den Bau (P9, P10, P13): vier Bereiche, --vor-bau, --tueren, --vergleich, --live
  evals/<name>/                     mindestens ein Eval-Fall pro Skill (claude plugin eval)
  evals/mocks/albatros/             Antworten der Albatros-Werkzeuge für die Evals
  evals/GUTE-ANTWORT.md             was eine gute Antwort je Phase enthält, erzeugt aus fahrplan.yaml (scripts/gute-antwort.ts)
  evals/KRITERIEN-LOG.md            jede Änderung an Kriterien mit Datum, Fall und Grund
plugins/albatros-fr/, -it/, -en/    dieselben Skills übersetzt (Kennungen deutsch); metadata.quelle nennt den deutschen Text
fahrplan.yaml                       der Ablauf P1 bis P13: Skills, Pflichtfragen, Ergebnisse, Ja-Momente, Gates, Insel-Schritte
missionen/<weg>/<nr>-<slug>.md      41 Missionen: flugschule 18, webseite 9, geschaeft 14
uebersetzungen/<sprache>/           Missionen, Vorlage und Texte für den Server auf Französisch, Italienisch und Englisch
schema/mission.schema.json          JSON Schema der Missions-Kopfdaten
schema/fahrplan.schema.json         JSON Schema von fahrplan.yaml
vorlage/                            Vorlage für {name}/projekt im Hafen: Seite, AGENTS.md mit CLAUDE.md und GEMINI.md, Dockerfile, compose.yaml, Fliessband
bausteine/                          PocketBase mit Rezepten, Eingang und Strapi, je mit Test und gemessenem Speicher (bausteine/README.md)
scripts/pruefen.ts                  prüft Skills, Missionen, Fahrplan, Version und GUTE-ANTWORT.md, dass es jeden Skill (mit Dateien wie pruefen.mjs) und jede Mission in allen vier Sprachen gibt, die Vorlage gegen webseite-planen und die Befehle zum Aktualisieren gegen den Lotse (scripts/abgleich.ts)
scripts/*.test.ts                   bun test: pruefen.test.ts (Abgleiche), entwurf-pruefen.test.ts (entwurf-pruefen.mjs gegen die Testseiten in scripts/entwurf-pruefen/, gut und schlecht)
scripts/testseiten/                 Fälle für pruefen.mjs (--vor-bau, --tueren, --vergleich, Tokens), je mit erwartet.json: bun scripts/testseiten/test.ts
scripts/gute-antwort.ts             erzeugt evals/GUTE-ANTWORT.md
scripts/einbau-test.sh              Einbau nach EINRICHTEN.md in einem leeren Home
scripts/durchspiel.ts               Durchspiel-Test (Abschnitt «Durchspiel-Test»)
```

## Skills

Nach dem Fahrplan geordnet; «Wann» nennt die Phasen, in denen ein Skill dran ist (aus `fahrplan.yaml` und den Missionen).

| Wann | Skill | Bild |
|---|---|---|
| immer | `lotse` | der Fluglotse im Turm: sagt nach dem echten Stand, was jetzt dran ist |
| Einstieg | `start` | Bordkarte holen und einsteigen: verbinden, Weg wählen, lernen oder machen, dann los mit der Idee |
| P1 bis P4 | `webseite-planen` | das Ziel auf der Karte, die Reiseführer, der Grundriss und die zweite Meinung vom Statiker (Idee, Research, Grundriss, Plan prüfen) |
| P2, P4, P13 | `webseite-modernisieren` | einen Altbau renovieren: Bestandsaufnahme der alten Seite, keine Funktion geht ohne Entscheid verloren, Umleitungen beim Livegang |
| P5 | `konzept` | der Charakter des Hauses, bevor Farben gewählt werden; Maskottchen ja, nein oder später |
| P6 | `gestaltung` | erst das Fundament, dann die Fassade: graues Mockup, drei Richtungen, Farbfächer (Tokens) und Musterblatt |
| P7, P8 | `entwurf` | das begehbare Modell, bevor der Rohbau beginnt, und die Unterschrift darunter (Freigabe zum Bauen); prüft mit `entwurf-pruefen.mjs` |
| P7 | `inhalte` | Ware im Schaufenster |
| P9, P10 | `webseite-bauen` | der Rohbau in der eigenen Werkstatt: PRD aus dem freigegebenen Entwurf, bauen, vier Prüfungen und die Türen mit `pruefen.mjs` (Geheimnisse, npm audit, axe, tote Links, Tokens, Fotos, Lighthouse, JavaScript, Bilder), Vergleich mit dem Entwurf, Freigabe; ins Netz geht nichts |
| P9, P13 | `git-logbuch` | Logbuch an Bord, Kopie im Hafen |
| P9 | `barrierefreiheit` | Rampe neben der Treppe |
| P9 | `recht-ch` | Klingelschild und Hausordnung |
| P9, P13 | `bausteine` | Fertigteile beim Hausbau: zuerst auf dem Computer, auf den Server beim Lancieren; ein Eingang mit einem Login für mehrere Teile |
| P11, P13 | `lancieren` | Wohnort und Eröffnung: Light, Pilot oder selbst, dann nur die freigegebene Seite ins Netz, von aussen geprüft |
| P11 | `kosten` | Haushaltsbuch |
| P11 | `ssh-schluessel` | Hausschlüssel und Schloss |
| P11 | `server-kennenlernen` | Rundgang durch die neue Wohnung (Pilot) |
| P12 | `betrieb` | Briefkasten, Rauchmelder und Haustür, bevor die Gäste kommen |
| P12 | `sicherheit` | den Schlüssel nicht unter die Fussmatte |
| P12 | `zurueck-auf-gestern` | das tägliche Foto der ganzen Wohnung |
| P12, freiwillig | `cms` | Pinnwand im Flur |
| P13 | `pipeline` | Fliessband mit Qualitätskontrolle |
| P13 | `seo-grundlagen` | Wegweiser und Stadtplan |
| P13, freiwillig | `domain` | Adresse im Telefonbuch |
| P13, freiwillig | `statistik` | Strichliste an der Ladentür |
| P13, freiwillig | `landung` | Umzug ins eigene Haus |
| nach dem Livegang | `webseite-aendern` | ein Umbau im bewohnten Haus: klein (lokal, zeigen, Freigabe, Push) oder gross (Nachtrag im Plan, Entwurf, Freigabe, bauen) |

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
| `insel` | `schritt` (Schlüssel aus `insel` in `fahrplan.yaml`) | das Hauptprojekt der Person (`projekt`, das Projekt ohne eigenen Namen bei `schritt_melden`) auf der Insel mindestens bei diesem Schritt steht; weitere Projekte zählen nicht |

Bis P10 (`gratis_bis`) liegt alles nur auf dem Computer der Person: Dort prüfen Missionen nur mit `insel`, und der Schritt gehört zur Phase der Mission (`pruefen.ts` prüft beides).

Platzhalter: `{name}` (Server der Person, z. B. `anna` → `https://anna.aufwind.sh`), `{domain}` (ihre eigene Domain).

Annahmen über die Instanz: Benutzer `pilot`, Projekt in `~/projekt` (Klon von `git@aufwind.sh:{name}/projekt.git`, vom Fliessband aktualisiert), Arbeitsdokumente in `~/projekt/docs/`, Webserver-Container `webseite` auf Port 80. Das Fliessband ist ein Forgejo-Runner auf dem Server (`runs-on: albatros`), der als `pilot` direkt in `~/projekt` ausliefert. GitHub kommt erst beim Umzug (Skill `landung`) dazu.

## Prüfen

```bash
bun install
bun run pruefen                       # Skills, Missionen, Fahrplan, Version, GUTE-ANTWORT.md, Vorlage und Befehle zum Aktualisieren
bun test                              # scripts/*.test.ts: Abgleiche von pruefen.ts, entwurf-pruefen.mjs gegen die Testseiten (CI: Job pruefen)
bun scripts/testseiten/test.ts        # pruefen.mjs gegen die Testseiten; --vergleich lädt beim ersten Mal Playwright und Chromium (nicht in CI)
bun bausteine/pocketbase/rezepte/buchungen/test.ts   # Rezepte und Eingang gegen ein echtes PocketBase (CI: Job bausteine)
bun bausteine/pocketbase/rezepte/mitglieder/test.ts
bun bausteine/eingang/test.ts
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

Ein echter Durchlauf mit zwei KIs, ergänzend zu den Einzel-Evals:

```bash
bun scripts/durchspiel.ts https://www.grindelwald-curling.ch/ --runden 20 --budget 30
bun scripts/durchspiel.ts --auswerten <temp-ordner> <ergebnis-ordner>   # nur Fotos, Protokoll und Bewertung eines Laufs
```

Gegen die echte Plattform läuft er nur im Workflow «Durchspiel» von `dischen87/albatros` (`--echt --fall musikverein`): Die E2E-Person beginnt wie neu (Hafen-Repo auf der Vorlage, Flugbuch und Insel leer) und bekommt Light ohne Zahlung, die KI meldet sich über das echte MCP an und baut eine Seite für den erfundenen Musikverein Testdorf unter `e2e-plattform.aufwind.sh`. Danach wird alles wie im E2E weggeräumt. Inhalte fremder Seiten gehen nie ins Netz, darum ist `--echt` nur mit diesem Fall erlaubt.

- Die eine KI (Claude Code mit dem Plugin, Sonnet) bekommt nur «Modernisiere <adresse>». Die andere spielt eine Person ohne Technikwissen und beantwortet kurz, was gefragt wird (Haiku).
- Albatros ist eine Attrappe (`scripts/durchspiel/mock-mcp.ts`, Antworten aus `scripts/durchspiel/mocks/` und `evals/mocks/albatros/`). Der Hafen ist ein lokales Git-Repo, das `seite_erstellen` unter dem gewünschten Namen anlegt. `open`, `xdg-open` und `ssh` schreiben nur ins Protokoll. `curl` auf `https://<name>.aufwind.sh` bekommt die Seite aus `seite/` im Hafen, wie bei Light: zuerst die Vorlage, nach dem Push die neue Seite. Keine Zahlung, kein Server, nichts wird veröffentlicht.
- Ergebnis in `plugins/albatros/evals/results/durchspiel-<zeit>/`: Verlauf, Protokoll (Schritte an die Insel, geöffnete Adressen, Einträge im Hafen), Fotos vorher und nachher (390 und 1440 breit), Bewertung nach Raster und Kosten.
- Raster: jede Funktion aus `docs/bestand.md` auf der neuen Seite oder mit Entscheid weggelassen, Frage nach den Eigenschaften, Frage nach Gestaltungselementen, keine KI-Merkmale, die Person musste nie wissen, was zu tun ist, Reihenfolge der neun Schritte, Designsystem, Tech-Stack mit Grund und JavaScript-Budget, prüfbare Abnahmekriterien vor dem Bau, vier Prüfberichte mit Ampel, Freigabe vor dem Push, Insel geöffnet und alle Schritte gemeldet, Push in den Hafen, die KI prüft selbst, bis die Seite live ist, und der Name ist der gewünschte.
- Maschinell: `pruefen.mjs --nur ablaeufe,code` auf der gebauten Seite (Zugang mit axe, tote Links, JavaScript je Seite, Lighthouse, Bilder), Ergebnis in `maschinell/` neben der Bewertung.

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
