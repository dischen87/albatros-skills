# Albatros Skills

Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen. Deine KI nimmst du im Rucksack mit auf den Weg: **Claude Code, Codex, Gemini CLI oder Cursor**. Mit allen vier klappt alles gleich. Du sagst ihr im Terminal «Ich will eine Webseite» oder «Ich habe eine Geschäftsidee». Sie führt dich nach einem festen Fahrplan von der Idee bis zur Seite im Netz und fragt von sich aus, was sie wissen muss. Bis deine Seite auf deinem Computer fertig und freigegeben ist, kostet Albatros nichts; ins Netz geht sie mit Light, mit Pilot (ein echter eigener Server) oder selbst. Unterwegs lernst du, was SSH-Schlüssel, Git und ein Fliessband (CI/CD) sind; im Modus «lernen» machst du die wichtigen Schritte selbst. Dein Logbuch (Git) liegt zuerst nur auf deinem Computer; beim Live schalten kommt es zu Albatros in den Hafen, `code.aufwind.sh`. Ein GitHub-Konto brauchst du nur, wenn deine Seite selbst wohnt (zum Beispiel auf GitHub Pages) oder du in ein eigenes Haus umziehst.

Der Fahrplan hat 13 Phasen (P1 bis P13, `fahrplan.yaml`) in drei Etappen:

- **abheben:** Idee und Produkt, von der Idee über Research, Plan, Konzept und Musterblatt bis zum Entwurf der ganzen Seite (P1 bis P8)
- **fliegen:** die Seite auf dem eigenen Computer bauen, prüfen und freigeben, dann den Wohnort wählen (P9 bis P11)
- **landen:** Betrieb vorbereiten, live schalten und der erste Fan, also sichtbar werden und die ersten Kundinnen und Kunden gewinnen (P12, P13 und danach)

Jede Mission nennt ihre Phase (`phase`); ihr Feld `stufe` ist die Etappe dieser Phase, mit denselben drei Namen (Abschnitt «Missionen»; `pruefen.ts` prüft das seit 01.11.2026).

Dieses Repo enthält:

- das **Plugin `albatros`** für Claude Code (Skills, die Verbindung zu Albatros über MCP und Berts Arbeitsplatz, die Startseite auf dem eigenen Computer, als lokaler MCP-Server `albatros-arbeitsplatz`),
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

Woher `lage` den Stand kennt: Jedes Plugin schickt ihn bei jedem Aufruf selbst mit, als Kopfzeile `X-Albatros-Skills-Stand` in seiner `.mcp.json`, gleich `version` in `plugin.json` und `metadata.stand` der Skills (`bun run pruefen` verlangt das). Sie steht dort zweimal: unter `headers` für Claude Code und unter `http_headers` für Codex, denn Codex liest aus der `.mcp.json` eines Plugins nur diesen Schlüssel. Gemessen am 01.11.2026 ohne Modell gegen einen Server auf 127.0.0.1: Claude Code 2.1.118 und 2.1.309 (`--plugin-dir`, `mcp list`) schicken sie bei `initialize` und jeder weiteren Anfrage, Codex 0.166.0 (Plugin aus einem lokalen Marktplatz, `mcp list`) bei seinen Anfragen an den Server; ein Aufruf von `lage` in einer Sitzung ist nicht gemessen. albatros nimmt die Kopfzeile, wenn `lage` ohne `skills_stand` kommt; `skills_stand` im Aufruf geht vor. Bei Gemini CLI und Cursor kommen Skills (`npx skills`) und Verbindung getrennt: Eine feste Kopfzeile in deren Verbindung bliebe nach `npx skills update` auf dem alten Stand stehen. Dort schickt die KI `skills_stand` mit (`metadata.stand` des Skills, Skills `start` und `lotse`).

albatros erzeugt aus dieser Tabelle `AKTUALISIEREN` in `packages/kit/src/fahrplan.ts` (`scripts/fahrplan-erzeugen.ts`); `bun run pruefen` verlangt dieselben Zeilen wie im deutschen Lotse. Auf Französisch, Italienisch und Englisch heisst das Plugin `albatros-fr@albatros`, `albatros-it@albatros` und `albatros-en@albatros`: In den Befehlen für Claude Code und Codex steht dann dieser Name statt `albatros@albatros`, der Marktplatz heisst immer `albatros`, und `npx skills update -g -y` gilt für alle Sprachen. Die übersetzten Lotsen nennen es so. Die Befehle sind am 31.10.2026 mit `--help` von Claude Code 2.1.118, Codex 0.141.0 und `skills@1.7.4` geprüft, nicht mit einem echten Update.

## Berts Arbeitsplatz

Berts Arbeitsplatz ist die Startseite der Person auf ihrem Computer (Plan: `docs/foundable/f01-bert-lokal.md` in albatros, Code: `apps/arbeitsplatz`). Jedes Plugin trägt ihn in `.mcp.json` als zweiten Server ein, `albatros-arbeitsplatz` mit stdio: `node ${CLAUDE_PLUGIN_ROOT}/arbeitsplatz/arbeitsplatz.mjs --mcp`. Der Server nimmt den Ordner, in dem die KI läuft, als Projekt und schreibt nur in dessen `.albatros/` (eigene `.gitignore` mit `*`). Das Bündel liegt seit Version 0.3.0 in `plugins/<plugin>/arbeitsplatz/` (`arbeitsplatz.mjs`, `ui/`, dazu Dockerfile, `start.sh` und `kaefig.pl` für den Arbeitsplatz auf dem eigenen Server; 29 Dateien, 1,9 MB je Plugin, in allen vier Plugins gleich). Es wird nie von Hand geändert, sondern in albatros neu gebaut: `cd apps/arbeitsplatz && ARBEITSPLATZ_VERSION=<version> bun run buendeln --nach <albatros-skills>/plugins/<plugin>/arbeitsplatz`, einmal je Plugin (`--nach` ersetzt den ganzen Ordner). Wie die KI ihn nutzt, steht in den Skills `schnellstart` und `lotse`; die Integration für die Vorschau im Skill `webseite-bauen`.

Gemessen am 07.11.2026 ohne Modell, mit dem Bündel 0.3.0 in einer Kopie des Plugins:

| KI | Ergebnis |
|---|---|
| Claude Code 2.1.118 und 2.1.317 | `claude --plugin-dir <kopie> mcp list` mit leerem `CLAUDE_CONFIG_DIR`: `plugin:albatros:albatros-arbeitsplatz: node <kopie>/arbeitsplatz/arbeitsplatz.mjs --mcp - ✓ Connected`; `${CLAUDE_PLUGIN_ROOT}` wird eingesetzt, der Server läuft im Ordner, in dem Claude Code gestartet wurde. |
| Codex 0.166.0 | Plugin aus einem lokalen Test-Marktplatz mit leerem `CODEX_HOME`: `codex mcp list` zeigt den Server, aber mit `${CLAUDE_PLUGIN_ROOT}` im Pfad. In einer Sitzung (`codex app-server`, `thread/start`, ohne Modell) startet Codex ihn im Ordner der Sitzung, ersetzt den Platzhalter aber nicht und setzt auch keine Umgebungsvariable dafür (auch `${PLUGIN_ROOT}` und `./arbeitsplatz/…` geprüft): Start fehlgeschlagen. Ein eigener Eintrag mit demselben Namen und festem Pfad (`codex mcp add albatros-arbeitsplatz -- node <pfad> --mcp`) ersetzt den aus dem Plugin und meldet «ready» mit den zehn Werkzeugen. `default_tools_approval_mode` nimmt `auto`, `prompt`, `writes` und `approve` an (anderes bricht ab); setzen lässt es sich nur in `config.toml` (`codex mcp add -c 'mcp_servers.albatros-arbeitsplatz.default_tools_approval_mode=…'` bricht mit «invalid transport» ab). Anleitung: Skill `schnellstart`, Abschnitt «Arbeitsplatz eintragen». |
| Gemini CLI 0.49.0 | `gemini mcp add -s user --trust albatros-arbeitsplatz node <pfad> --mcp` schreibt den Eintrag mit `--mcp` als Argument; `gemini mcp list` zeigt «Connected» nur in einem Ordner, dem die Person vertraut (sonst «Disabled»); der Server läuft im Ordner von Gemini CLI. Das Bündel kommt dort aus einem schmalen Klon dieses Repos (`git clone --depth 1 --filter=blob:none --sparse`, geprüft gegen `main`). |
| Cursor | nicht geprüft |

Die Vorschau startet der Arbeitsplatz selbst (Werkzeug `vorschau_starten` oder der Bildschirm «Webseite»), nie die KI: Er startet `astro dev` in einem eigenen Sandkasten ohne Netz, der Dev-Server hört nur auf einem Unix-Socket, und der Arbeitsplatz reicht ihn auf 127.0.0.1 weiter. Dabei setzt er `ARBEITSPLATZ_URL`; nur dann fügt die Integration `albatros-vorschau` etwas ein: das Vorschau-Skript des Arbeitsplatzes, das nur im iframe des Arbeitsplatzes wirkt («Zeigen» und «Text»). Die Integration liest und schreibt keine Dateien, auch nicht in `.albatros/`; `astro build` enthält nichts davon. Gemessen am 07.11.2026 mit Astro 7.4.7 (`npm create astro@latest --template minimal`) und dem Bündel unter node (albatros `apps/arbeitsplatz/scripts/vorschau-echt.ts`): Die Vorschau läuft nach 1,8 s, der Dev-Server hat keinen TCP-Port, «Text» ändert die Datei und Astro lädt neu, Stoppen beendet alle Prozesse.

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
  .mcp.json                         MCP-Server https://mcp.albatros.build (Streamable HTTP, OAuth über Clerk), mit der Kopfzeile X-Albatros-Skills-Stand (Abschnitt «Aktualisieren»),
                                    und albatros-arbeitsplatz (stdio: node ${CLAUDE_PLUGIN_ROOT}/arbeitsplatz/arbeitsplatz.mjs --mcp, Abschnitt «Berts Arbeitsplatz»)
  arbeitsplatz/                     Bündel von Berts Arbeitsplatz aus albatros apps/arbeitsplatz (bun run buendeln --nach …), seit 0.3.0 im Repo: das Plugin wird über git verteilt
  skills/<name>/SKILL.md            28 Skills: lotse (Hauptskill, /albatros:lotse), start (/albatros:start), schnellstart und die Bibliothek
  skills/entwurf/entwurf-pruefen.mjs     Prüfskript der Person für Musterblatt und Entwurf (P6, P7): Seiten, Links, Farbfächer, Menü
  skills/webseite-bauen/pruefen.mjs      Prüfskript der Person für den Bau (P9 bis P13): vier Bereiche, --vor-bau, --freigabe (lancieren, Regel wie kit jaBelegt), --tueren, --vergleich, --live
  skills/webseite-bauen/albatros-vorschau.mjs   Astro-Integration für die Vorschau im Arbeitsplatz (nur astro dev), gleich wie vorlage/werkzeuge/albatros-vorschau.mjs
  evals/<name>/                     mindestens ein Eval-Fall pro Skill und je Phase (claude plugin eval, Abschnitt «Evals»)
  evals/_projekt/                   Gerüst Sonnenhof für die Fälle (projekt.sh, bis P1 … P12) und die Anleitung des Servers
  evals/mocks/albatros/             Attrappen der Albatros-Werkzeuge für die Evals; _tools.json ist die echte Werkzeugliste
  evals/GUTE-ANTWORT.md             was eine gute Antwort je Phase enthält, erzeugt aus fahrplan.yaml (scripts/gute-antwort.ts)
  evals/KRITERIEN-LOG.md            jede Änderung an Kriterien mit Datum, Fall und Grund
plugins/albatros-fr/, -it/, -en/    dieselben Skills übersetzt (Kennungen deutsch); metadata.quelle nennt den deutschen Text
fahrplan.yaml                       der Ablauf P1 bis P13: Skills, Pflichtfragen, Ergebnisse, Ja-Momente, Gates, Insel-Schritte
missionen/<weg>/<nr>-<slug>.md      44 Missionen: flugschule 21, webseite 9, geschaeft 14
uebersetzungen/<sprache>/           Missionen, Vorlage und Texte für den Server auf Französisch, Italienisch und Englisch
schema/mission.schema.json          JSON Schema der Missions-Kopfdaten
schema/fahrplan.schema.json         JSON Schema von fahrplan.yaml
vorlage/                            Vorlage für {name}/projekt im Hafen: Seite, AGENTS.md mit CLAUDE.md und GEMINI.md, Dockerfile, compose.yaml, Fliessband,
                                    werkzeuge/albatros-vorschau.mjs (Vorschau im Arbeitsplatz: wirkt nur, wenn der Arbeitsplatz den Dev-Server startet, schreibt keine Dateien)
bausteine/                          PocketBase mit Rezepten, Eingang und Strapi, je mit Test und gemessenem Speicher (bausteine/README.md)
scripts/pruefen.ts                  prüft Skills, Missionen, Fahrplan, Version und GUTE-ANTWORT.md, dass es jeden Skill (mit Dateien wie pruefen.mjs) und jede Mission in allen vier Sprachen gibt, die Vorlage gegen webseite-planen und die Befehle zum Aktualisieren gegen den Lotse (scripts/abgleich.ts), dass Abschnitte aus fahrplan.yaml und Querverweise in jeder Sprache in einer #-Überschrift stehen (scripts/abschnitte.ts), dass jede Phase mit Lernmomenten je Weg eine Lektion mit Kontrollfrage hat (scripts/lektionen.ts) und dass die Skills bei verstanden_melden, Kontrollfragen und mission_pruefen die richtigen Missionen nennen, Kontrollfragen nie aus mission_holen nehmen, wörtlich so zitieren, wie die Mission sie in derselben Sprache stellt, und höchstens zwei in eine Nachricht legen (scripts/missionsverweise.ts), und dass ein Skill mit titel bei schritt_melden den Ausweg nach «Ungültige Angaben» nennt und auf Italienisch die Bozza «con via libera» heisst (scripts/abgleich.ts), dazu Berts Arbeitsplatz: der Server albatros-arbeitsplatz in jedem Plugin, dieselbe Integration albatros-vorschau in Skill und Vorlage, und schnellstart mit AGENTS.md wie die Vorlage und docs/projekt.md mit allen Zeilen von P1
scripts/*.test.ts                   bun test: pruefen.test.ts (Abgleiche, Vorlage, Gerüst der Evals), abschnitte.test.ts (Abschnittsnamen), lektionen.test.ts (Lektion je Phase und Weg), missionsverweise.test.ts (Missionen in den Skills), pruefbefehle.test.ts (die Freigabe in lancieren mit pruefen.mjs --freigabe gegen kit jaBelegt, auch mit Leerraum ausserhalb von ASCII und Dateien in Latin-1; der grep-Befehl für «Eingang:», in Claude Code auch mit dessen grep, einem eingebauten ugrep), rechtspfade.test.ts (Pfade für Impressum und Datenschutz je Sprache), tueren.test.ts (Listen von PocketBase und ihr Status in den Skills gegen «Türen der Bausteine»), fahrplan.test.ts (fahrplan.yaml), evals.test.ts (Grader ohne Modell, Attrappen), entwurf-pruefen.test.ts (entwurf-pruefen.mjs gegen die Testseiten in scripts/entwurf-pruefen/, gut und schlecht), punkte.test.ts, durchspiel.test.ts (Trockenläufe und die Attrappe, mit albatros auch gegen das echte mcp), verlauf.test.ts; dazu bausteine/eingang/verwaltung.test.ts (vordere Schicht des Eingangs) und stuecke.test.ts (grosse Körper in Stücken)
scripts/attrappen.ts                erzeugt die Attrappen der Evals mit dem echten mcp von albatros (--pruefen vergleicht nur)
scripts/bewertung.ts                Grader ohne Modell wie in plugin eval, mit Beispielen je Fall in scripts/evals-beispiele.ts
scripts/testseiten/                 Fälle für pruefen.mjs (--vor-bau, --tueren, --vergleich, Tokens, Recht fr und it), je mit erwartet.json: bun scripts/testseiten/test.ts
scripts/gute-antwort.ts             erzeugt evals/GUTE-ANTWORT.md
scripts/einbau-test.sh              Einbau nach EINRICHTEN.md in einem leeren Home
scripts/durchspiel.ts               Durchspiel-Test (Abschnitt «Durchspiel-Test»)
```

## Skills

Nach dem Fahrplan geordnet; «Wann» nennt die Phasen, in denen ein Skill dran ist (aus `fahrplan.yaml` und den Missionen).

| Wann | Skill | Bild |
|---|---|---|
| immer | `lotse` | der Fluglotse im Turm: sagt nach dem echten Stand, was jetzt dran ist |
| Einstieg | `start` | Bordkarte holen und einsteigen: verbinden, Weg wählen, lernen oder machen, `lage` fragen, dann los mit der Idee |
| Einstieg, Modus machen | `schnellstart` | der erste Rundflug: in wenigen Minuten Projekt, Zielgruppe, Angebot, Arbeitslogo und graue Skizze, dazu Vorschläge und eine Ideen-Karte in Berts Arbeitsplatz |
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
stufe: fliegen                       # Etappe der Phase: abheben (P1 bis P8) | fliegen (P9 bis P11) | landen (P12, P13)
phase: P11                           # Phase im Fahrplan: dort wird das Thema gebraucht und ist die Prüfung bestehbar
optional: true                       # nur bei freiwilligen Missionen (domain, landung, cms, statistik, webseite-02, webseite-04)
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
bun run pruefen                       # Skills, Missionen, Fahrplan, Version, GUTE-ANTWORT.md, KRITERIEN-LOG.md, Vorlage und Befehle zum Aktualisieren
bun test                              # scripts/*.test.ts, bausteine/eingang/verwaltung.test.ts und stuecke.test.ts: Regeln von pruefen.ts, Prüfbefehle der
                                      # Skills, Grader der Evals ohne Modell, entwurf-pruefen.mjs gegen die Testseiten, Punkte, Trockenläufe
                                      # und Verlauf des Durchspiels (CI: Job pruefen)
bun scripts/testseiten/test.ts        # pruefen.mjs gegen die Testseiten (nicht in CI); alle Fälle ausser --vor-bau und --tueren laden beim
                                      # ersten Mal Playwright, axe-core und Lighthouse nach ~/.cache/albatros-pruefen und Chromium dorthin,
                                      # wo Playwright seine Browser ablegt: Mac ~/Library/Caches/ms-playwright, Linux ~/.cache/ms-playwright
bun bausteine/pocketbase/rezepte/buchungen/test.ts   # Rezepte und Eingang gegen ein echtes PocketBase (CI: Job bausteine)
bun bausteine/pocketbase/rezepte/mitglieder/test.ts
bun bausteine/eingang/test.ts
claude plugin validate .              # Marktplatz
for p in albatros albatros-fr albatros-it albatros-en; do claude plugin validate plugins/$p; done   # jedes Plugin
QUELLE=$PWD bash scripts/einbau-test.sh   # Einbau nach EINRICHTEN.md in leerem Home (CI: Job einbau)
```

- Version: Ändert sich etwas unter `plugins/*/skills`, steigt die Version in allen `plugin.json` und in `.claude-plugin/marketplace.json` gegenüber `origin/main`; jede `SKILL.md` trägt sie als `metadata.stand`. Eine Übersetzung nennt in `metadata.quelle` den deutschen Text, nach dem sie übersetzt ist (`grep -v '^  stand: ' <deutsche SKILL.md> | shasum -a 256 | cut -c1-12`); ändert sich der deutsche Text, meldet `pruefen.ts` die Übersetzung als veraltet, bis sie nachgeführt und `quelle` neu gesetzt ist.

## Evals

Ein Eval-Fall prüft, was die KI mit den Skills tut: ein Satz der Person (`prompt.md`), auf Wunsch ein Projektordner aus dem Gerüst (`scaffold.sh`), die Antworten der Albatros-Werkzeuge aus Attrappen und die Grader in `graders/`. Die Fälle liegen in `plugins/albatros/evals/<fall>/`, nur auf Deutsch, und laufen mit `claude plugin eval` (gemessen mit Claude Code 2.1.309; 2.1.118 kennt den Befehl noch nicht). In CI laufen sie nicht.

**Ohne Modell und ohne Kosten:**

```bash
claude plugin eval plugins/albatros --tag fahrplan --scaffold --allow-tools Write Edit --ablation none \
  --max-cost-usd 0 --no-publish --trust-plugin --output-dir <ordner> --report <ordner>/bericht.html
bun test                                                   # Grader ohne Modell: je Fall ein gutes und mindestens ein schlechtes Beispiel
ALBATROS=<albatros-ordner> bun scripts/attrappen.ts --pruefen   # Attrappen wie aus dem echten mcp erzeugt, Missionen der lage-Attrappen wie missionen/? Schreibt nichts, Exit 1 bei Abweichung
bun scripts/gute-antwort.ts                                # GUTE-ANTWORT.md neu erzeugen, nach jeder Änderung an fahrplan.yaml, an den Tags oder am KRITERIEN-LOG.md
```

Mit `--max-cost-usd 0` startet `plugin eval` keinen bezahlten Lauf: Exit 2 mit «cost ceiling $0 hit» und $0.00 ist hier das erwartete Ergebnis. Er lädt alle Fälle und meldet Warnungen zu den Gradern für alle (etwa ein Grader, der mit den erlaubten Werkzeugen nie bestehen kann). Die Attrappen lädt er aber nur für den ersten Fall, bevor die Grenze greift; einen Lade-Fehler in den Attrappen eines späteren Falls zeigt er nicht (gemessen mit 2.1.309, Gegenprobe vom 31.10.2026). Die Attrappen prüfen darum `bun test` (jede lage der Fälle aus `scripts/attrappen.ts` mit `type: fixed`) und `scripts/attrappen.ts --pruefen`. `bun test` prüft in `scripts/evals.test.ts` die Grader ohne Modell (`regex`, `tool_used`, `file_exists`, nachgebaut in `scripts/bewertung.ts`) mit den Beispielen aus `scripts/evals-beispiele.ts`: Jeder lässt das gute Beispiel durch und erkennt ein schlechtes. Der Vergleich der Attrappen mit dem echten mcp läuft dort mit `ALBATROS=<albatros-ordner>`, ohne `ALBATROS` auch dann, wenn `../albatros` neben diesem Repo liegt; fehlt beides, wird er übersprungen.

**Mit Modell** (kostet; die Attrappen gelten weiter, der echte Server von Albatros wird nie gerufen):

```bash
claude plugin eval plugins/albatros --tag fahrplan --scaffold --allow-tools Write Edit --ablation none \
  --model sonnet --judge-model sonnet --runs 3 --threshold 0.8 -j 4 --no-publish
```

- **Auswahl:** `--tag fahrplan` sind die Fälle je Phase P1 bis P13, die Personen, die nicht mitspielen, und die Fälle zu Anfragen; `--tag erfassung` nur diese (`anfrage-erlaubt`, `anfrage-nicht-erlaubt`: dieselbe Lage, einmal mit und einmal ohne «Anfragen: erlaubt.»); `--tag kern` die älteren Kernfälle; `--tag P3` eine Phase; `--case <name>` ein Fall.
- **Attrappen:** `--mocks record` ist der Standard und startet den MCP-Server von Albatros nie. Die Antworten der Werkzeuge kommen aus `evals/mocks/albatros/` und je Fall aus `<fall>/mocks/albatros/`; `_tools.json` ist die echte Werkzeugliste (FAHRPLAN und ERFASSUNG an), `_projekt/anleitung.txt` die Anleitung des Servers. `ALBATROS=<albatros-ordner> bun scripts/attrappen.ts` erzeugt sie mit dem echten mcp von albatros (ohne `ALBATROS`: `../albatros`), ohne einen Dienst aufzurufen; welcher Fall welchen Zustand bekommt, steht dort in `FAELLE`.
- **`--no-publish` immer:** Ohne den Schalter lädt `plugin eval` den Bericht mit Prompts und Antworten auf claude.ai hoch, wenn das Konto es kann. Mit `--output-dir` und `--report` bleiben Ergebnisse und Bericht ausserhalb des Repos, sonst liegen sie in `plugins/albatros/evals/results/` (nicht im Git).
- **Schalter:** `--scaffold` lässt `scaffold.sh` den Projektordner anlegen (Gerüst Sonnenhof aus `_projekt/projekt.sh`); `--allow-tools Write Edit` braucht jeder Fall, der Dateien schreibt; `--ablation none` lässt den Vergleichslauf ohne Plugin weg; `--trust-plugin` beantwortet die Frage beim ersten Lauf (nur für dieses Repo).
- **Bestehen:** Jeder Fall läuft dreimal (`--runs 3`) und besteht, wenn sein Schnitt mindestens 0,8 ist: ein Ausrutscher in drei Läufen ist erlaubt, ein Fehler in jedem Lauf nicht. Entschieden wird nach dem Aggregat, nie nach einem einzelnen Urteil. Der Judge ist Sonnet, weil Haiku (Standard) bei deutschen Texten mit mehreren Kriterien zu stark schwankt.
- **Grader:** Was ohne Modell geht (Pflichtzeilen, Werkzeugaufrufe, höchstens zwei Fragen, kein ß), prüfen Grader ohne Modell. Ein `llm`-Grader prüft nur, wie die KI es der Person sagt (`kriterien.md`, `antwort.md` oder `sprache.md`, die letzte Chat-Antwort). Den Inhalt einer Datei prüft ein Grader mit `focus: {source: file, path: …}`; `focus: files` zeigt nur Dateinamen und `focus: trace` nur Rohdaten, beide taugen nicht.
- **`evals/GUTE-ANTWORT.md`** sagt je Phase, was eine gute Antwort enthält, und nennt die Fälle dazu. `scripts/gute-antwort.ts` erzeugt sie aus `fahrplan.yaml`, den Tags der Fälle und `KRITERIEN-LOG.md`, nie von Hand. Die Phase eines Falls steht als Tag in seiner `prompt.md` (`tags: [fahrplan, P3]`); einen Kopf `phase:` lädt `plugin eval` nicht («unknown frontmatter key»).
- **`evals/KRITERIEN-LOG.md`:** Jede Änderung an Kriterien (Grader, und in `fahrplan.yaml` Pflichtfragen, Ergebnisse, Ja-Momente und Gates) kommt als neue Zeile unten dazu: Datum (JJJJ-MM-TT), Fall, Änderung und Grund. Kriterien ändern sich nur, um richtige Ergebnisse anzunehmen, nie, um einen Fehler festzuschreiben. `bun run pruefen` prüft Form und Reihenfolge.
- Der Fall `ssh-schluessel-lokal` (Tag `bash`) lässt die KI den Schlüssel wirklich mit `ssh-keygen` erzeugen. Er braucht `--allow-tools Bash` und eine Maschine, auf der Claude Code Bash in Evals erlaubt.
- Der Fall `webseite-aendern-termin` legt mit `case.yaml` und `scaffold.sh` eine fertige Seite (docs/, Termine als Daten) in den Arbeitsordner. Er läuft nur mit `--scaffold` und `--allow-tools Write Edit`. Die Fälle `webseite-bauen-prd` und `webseite-bauen-pruefung` prüfen Tech-Stack, das aus dem Entwurf abgeleitete PRD mit den Türen und die vier Berichte aus Messwerten, ohne Bash.
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
| `bauen-lassen`, `bauen-lassen-nein` | Bauservice (Attrappe mit `DURCHSPIEL_BAUSERVICE=on`, Regeln und Wortlaut wie `bauservice.ts` in albatros; Albatros rückt den Auftrag je Runde einen Stand weiter): lässt Albatros bauen, bis lage die Vorschau meldet; baut selbst weiter | Angebot einmal nach dem Ja zum Plan; jeder Betrag nur aus einer Antwort von lage oder konto im Lauf, der Betrag des Bauservice nie vor dem Ja zum Plan; Wahl in `Bauen lassen:`; `auftrag_anlegen` nur mit `bestaetigt` und erst in einer Runde nach der Übergabe-Anweisung; nach der Übergabe nichts Neues oder Geändertes unter `design/` ausser den Fotos, die die Person selbst in `design/bilder/` legt; bei der Vorschau der Weg ins Cockpit; Angaben fürs Impressum aus dem Chat in keiner Datei und bei keinem Werkzeug | P5 |

**Ohne Modell und ohne Kosten prüfen** (kein Netz, kein Port, kein Konto):

```bash
bun test                                                                              # Punkte, Trockenläufe und Verlauf
bun scripts/durchspiel.ts --trocken scripts/durchspiel/beispiele/gut-lernen.json        # Exit 0
bun scripts/durchspiel.ts --trocken scripts/durchspiel/beispiele/schlecht-gratis.json   # Exit 1
bun scripts/durchspiel.ts --trocken scripts/durchspiel/beispiele/offen-nein-vor-bau.json --ergebnis <ordner>   # Exit 2, Ergebnis ausserhalb des Repos
bun scripts/durchspiel.ts --trocken scripts/durchspiel/beispiele/bauen-lassen.json --ergebnis <ordner>   # Exit 0, ebenso bauen-lassen-nein; Exit 1: bauen-lassen-schlecht, -vor-plan, -betrag, -ohne-ja, -weiterbauen
bun scripts/punkte.ts <ergebnis-ordner>                                               # Punkte eines Laufs neu rechnen (lauf.json)
bun scripts/verlauf.ts                                                                # Trend je Fall
```

Der Trockenlauf spielt einen aufgezeichneten Verlauf ab (Format von `lauf.json`): Statt der KI schreibt er die Dateien jeder Runde, ruft die Werkzeuge der Attrappe und öffnet, was die KI öffnete; statt der Person kommen ihre aufgezeichneten Nachrichten. Attrappe, Protokolle, Zustände, Punkte und Exit-Code laufen wie in einem echten Lauf. Die Beispiele in `scripts/durchspiel/beispiele/` (gut, schlecht, nicht auswertbar; seit 01.11.2026 dazu drei zum Bauservice) sind von Hand geschrieben, je mit erwartetem Exit-Code, nicht von einem Modell aufgezeichnet.

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

**Attrappe:** Ohne `--echt` ist Albatros `scripts/durchspiel/mock-mcp.ts` und antwortet wie die Plattform mit den Schaltern FAHRPLAN und ERFASSUNG: `lage` nach dem Fahrplan (Phase aus Insel und `belege`, offene Pflichtfragen, Ergebnis, Gate, Gratis-Hinweis, Modus und Lektion), `schritt_melden` mit den 19 Schritten und dem `titel` gekürzt wie dort, `upgrade_link` ohne Abo vor P11 nur mit `bestaetigt`, `methode` aus `albatros-methoden` daneben (oder `DURCHSPIEL_METHODEN`), `mission_pruefen` besteht erst mit dem Schritt auf der Insel, dazu Weg, Modus, `verstanden_melden` mit den Regeln von flugschule (409 ohne Kontrollfragen und vor dem Tag danach), `skill_holen`, `luecke_melden` mit dem Satz von flugschule, `coach_fragen` ohne Abo mit 403 und Konto. Eingaben prüft sie wie zod im echten Dienst, auf jeder Ebene (auch `belege[].zeilen[]`): Pflichtfelder, Werte, Typ, Länge in Codepunkten, Listen, Muster, mit denselben Meldungen; ein Werkzeug, das sie nicht anbietet, ist wie dort ein Fehler von JSON-RPC. `bun test` prüft feste Fälle mit den Antworten des echten mcp und vergleicht, wenn albatros daneben liegt, Grenzwerte jedes Felds jedes Werkzeugs mit dem echten mcp (`scripts/durchspiel.test.ts`, gut 1500 Fälle). Werkzeuge und Anleitung stehen in `scripts/durchspiel/mocks/werkzeuge.json` und `anleitung.txt`, erzeugt aus dem Code von albatros (Befehl im Kopf von `mock-mcp.ts`). Der Hafen ist ein lokales Git-Repo; `open`, `xdg-open` und `ssh` schreiben nur ins Protokoll; `curl` auf `https://<name>.aufwind.sh` bekommt die Seite aus `seite/` im Hafen, wie bei Light. Keine Zahlung, kein Server, nichts wird veröffentlicht.

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
