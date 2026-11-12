# Plugin-Verzeichnisse: Claude, Cursor, ChatGPT und Codex

Ziel (Mathias, 12.11.2026): Albatros mit einem Klick aus dem Verzeichnis von Claude, dem Marktplatz von Cursor und dem Plugin-Katalog von ChatGPT und Codex. Stand: Plugin 0.3.0, Zweig `verbinden/verzeichnisse`, noch nichts eingereicht.

Quellen, gelesen am 12.11.2026: [code.claude.com/docs/en/plugins/publish](https://code.claude.com/docs/en/plugins/publish.md), [claude.com/docs/directory/publish](https://claude.com/docs/directory/publish.md), [claude.com/docs/plugins/pre-submission-checklist](https://claude.com/docs/plugins/pre-submission-checklist.md), [Manifest von Claude](https://code.claude.com/docs/en/plugins/manifest-reference.md); [cursor.com/docs/reference/plugins](https://cursor.com/docs/reference/plugins.md), [cursor/plugin-template](https://github.com/cursor/plugin-template); [developers.openai.com/plugins/build/plugins](https://developers.openai.com/plugins/build/plugins.md), [developers.openai.com/plugins/deploy/submission](https://developers.openai.com/plugins/deploy/submission.md).

`bun run pruefen` prüft alle Regeln unten, die sich ohne Portal prüfen lassen (`scripts/verzeichnisse.ts`); `bun test scripts/verzeichnisse.test.ts` baut je Regel einen Fehler ein, der rot wird.

## Überblick

| Verzeichnis | Was eingereicht wird | Wo | Prüfung | Stand |
|---|---|---|---|---|
| Claude (claude.ai, Cowork, Claude Code) | je Plugin-Ordner ein Eintrag aus dem öffentlichen Repo; dazu der MCP-Server als eigener Connector | [claude.ai/directory/manage](https://claude.ai/directory/manage), «Submit new» | automatisch (Validate, Sicherheitsscan) und ein Mensch beim ersten Eintrag | bereit, `claude plugin validate --strict` ohne Befund |
| Cursor | Link aufs Repo; `.cursor-plugin/marketplace.json` nennt die vier Plugins | [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish) | von Hand durch Cursor, Quelltext offen | bereit bis auf den Test in Cursor selbst |
| ChatGPT und Codex | ein ZIP (`bun scripts/openai-paket.ts`), der MCP-Server wird im Portal verbunden | [platform.openai.com/plugins](https://platform.openai.com/plugins) | automatisch (Metadaten, Skills, Scan der Werkzeuge) und Review mit Testkonto und Video | Paket bereit; Verifizierung, Domain-Nachweis, Testkonto, Video offen |

Die Verbindung zu Albatros heisst überall `https://mcp.albatros.build`, ohne `/mcp`: So nennt mcp sich selbst als `resource` in `https://mcp.albatros.build/.well-known/oauth-protected-resource` (gelesen am 12.11.2026). `/mcp` nimmt mcp auch an, aber die Anmeldung gilt für die `resource`, und OpenAI lässt die Adresse nach der Einreichung nur über den Support ändern.

## Claude

Eine Listung erreicht claude.ai, Cowork und Claude Code. Jedes Plugin eines Marktplatz-Repos ist eine eigene Einreichung («Pick one plugin first»).

| Regel (Checkliste vor der Einreichung) | Ergebnis bei Verstoss | Stand |
|---|---|---|
| Ordner mit `.claude-plugin/plugin.json`, Name klein mit Bindestrichen, nicht `claude`, `mcp` usw. | blockiert | erfüllt (`albatros`, `albatros-fr`, `albatros-it`, `albatros-en`) |
| `description`, `author`, `version` | Warnung | erfüllt |
| README im Plugin-Ordner, mindestens 40 Wörter ausserhalb von Code | blockiert | erfüllt seit 12.11.2026 (387 bis 419 Wörter, je Sprache) |
| Lizenz (`LICENSE` oder `license`) | blockiert | erfüllt (`MIT`) |
| `icon`: quadratisches PNG, 512 bis 2048 px, unter 2 MB; wird nur beim ersten Speichern übernommen | Befund von `validate` | erfüllt (`assets/icon.png`, 512 px, 176 KB) |
| `privacyPolicyUrl` bei einem MCP-Server im Netz; dazu `termsOfServiceUrl`, `supportUrl`, `documentationUrl` | Befund von `validate` | erfüllt (je Sprache albatros.build/…/datenschutz und /agb; Hilfe: GitHub-Issues) |
| `.mcp.json` gültig, Server im Netz mit `type: http` und `https://` | blockiert | erfüllt |
| Keine Systemdateien (`.DS_Store` …) im Plugin-Ordner | blockiert | erfüllt (keine im Repo; `pruefen` prüft `git ls-files`) |
| Keine Secrets, keine Zugangsdaten aus der Umgebung | blockiert | erfüllt |
| Repo unter 50 MiB als Archiv, unter 10 000 Dateien | Validierung bricht ab | erfüllt (1257 Dateien, `git archive` 22 MB unkomprimiert) |
| Höchstens 512 Dateien im Plugin | an einen Menschen | **offen**: `plugins/albatros` hat 560, davon 489 in `evals/` |
| Jede Datei ausser Bildern und Schriften unter 256 KiB | an einen Menschen | **offen**: `arbeitsplatz/arbeitsplatz.mjs` 1,9 MB, `arbeitsplatz/ui/app.js` 0,8 MB (in allen vier Plugins) |
| Lokaler MCP-Server startet eine Datei im Plugin, die der Prüfer nicht durchliest (kein Shell-Skript) | an einen Menschen | **offen**: `node ${CLAUDE_PLUGIN_ROOT}/arbeitsplatz/arbeitsplatz.mjs --mcp`; das Bündel ist lesbar, nicht verkleinert, aber der Quelltext liegt im privaten Repo `dischen87/albatros` |
| Server als eigener MCP-Connector einreichen und mit dem Plugin verbinden | Empfehlung von Anthropic | **offen** |

Gemessen am 12.11.2026 mit Claude Code 2.1.321 und leerem `CLAUDE_CONFIG_DIR`: `claude plugin validate --strict` für den Marktplatz und alle vier Plugins «Validation passed», die Prüfungen fürs Verzeichnis «found nothing to report» (vorher `ICON_MISSING` und `PRIVACY_URL_MISSING`). `claude plugin install albatros --marketplace dischen87/albatros-skills` baut das Plugin von GitHub (`main`) ein; derselbe Befehl gegen diesen Zweig als lokaler Marktplatz ebenso, `mcp list` zeigt `albatros` («Needs authentication») und `albatros-arbeitsplatz` («Connected»). Das Portal (**Validate**) prüft mehr als `validate`: nicht gelaufen, es braucht Mathias' Anmeldung.

Die drei offenen «an einen Menschen»-Punkte blockieren nicht; ein Mensch liest dann mit. Wer sie vermeiden will: `evals/` aus dem Plugin-Ordner nehmen (`experimental.evals` zeigt auf einen anderen Ordner, `scripts/` und `claude plugin eval` müssten mit) und den Quelltext von `apps/arbeitsplatz` öffentlich machen. Beides ist ein eigener Entscheid, hier nicht umgesetzt.

### Was Mathias tun muss

1. Zweig `verbinden/verzeichnisse` nach `main` mergen (eingereicht wird das öffentliche Repo, Zweig `main`).
2. Auf [claude.ai/directory/manage](https://claude.ai/directory/manage) mit dem Konto, dem die Listung gehören soll (die erste Organisation behält sie): **Submit new** → **MCP connector** → URL `https://mcp.albatros.build`, Anmeldung OAuth. Checkliste: [Connector](https://claude.com/docs/connectors/building/review-criteria.md).
3. **Submit new** → **Plugin bundle** → Repo `dischen87/albatros-skills`, Ordner `plugins/albatros`, Zweig `main` → **Validate**. Befunde «Blocking» an Claude zurückgeben, sonst weiter → **Submit for review**.
4. Nach der Freigabe Connector und Plugin im Portal verbinden («pair»).
5. Danach dieselben Schritte für `plugins/albatros-en`, `-fr`, `-it` (je eine Listung; Anzeigename «Albatros (English)» usw.).

## Cursor

Ein Repo mit mehreren Plugins: `.cursor-plugin/marketplace.json` im Repo, je Plugin `.cursor-plugin/plugin.json` (Begründung: Cursor löst jeden Eintrag des Marktplatzes über das Manifest im Plugin-Ordner auf; vier Sprachen bleiben vier Plugins wie bei Claude, mit denselben Namen). Skills findet Cursor in `skills/`, die Verbindung in `mcp.json` im Plugin-Ordner (der Name, den Cursor ohne Angabe liest; das Template warnt vor anderen Namen). Regeln und Befehle braucht es nicht: Die Skills sind der Inhalt, der Einstieg ist «Starte Albatros».

| Regel (Checkliste von Cursor) | Stand |
|---|---|
| gültiges `.cursor-plugin/plugin.json`, Name eindeutig, klein, kebab-case | erfüllt (nur Felder aus der Referenz und `displayName` wie im Template) |
| `description` erklärt den Zweck | erfüllt (gleich wie bei Claude) |
| Komponenten mit gültigen Dateien und Kopfdaten | erfüllt (`pruefen`: jede `SKILL.md` mit `name` und `description`) |
| Logo im Repo, relativer Pfad | erfüllt (`assets/icon.png`) |
| `README.md` | erfüllt |
| `${VAR}` in `mcp.json` nur mit `variables` | erfüllt (keine Platzhalter) |
| Pfade relativ, ohne `..` | erfüllt |
| `.cursor-plugin/marketplace.json` im Repo, Namen eindeutig | erfüllt (dieselben vier wie bei Claude) |
| Quelltext offen | erfüllt für das Repo (MIT); **offen**: Das Bündel von Berts Arbeitsplatz liegt im Plugin-Ordner, sein Quelltext ist privat (Cursor startet es nicht, siehe unten) |
| lokal in Cursor getestet | **offen**: auf diesem Mac ist Cursor nicht installiert |

`mcp.json` enthält nur `albatros` mit `https://mcp.albatros.build` und der Kopfzeile `X-Albatros-Skills-Stand` (im Plugin kommen Skills und Verbindung zusammen, also stimmt der Stand). Berts Arbeitsplatz fehlt dort bewusst: In welchem Ordner Cursor einen lokalen Server aus einem Plugin startet, ist nicht gemessen; im falschen Ordner schriebe er `.albatros/` dorthin. Bis es gemessen ist, trägt die KI ihn wie bisher ein (Skill `schnellstart`, «Arbeitsplatz eintragen»). Gemessen am 12.11.2026: Claude Code 2.1.321 und Codex 0.166.0 lesen `mcp.json` nicht, sie zeigen nur die zwei Server aus `.mcp.json`.

### Was Mathias tun muss

1. Cursor installieren und lokal prüfen: `mkdir -p ~/.cursor/plugins/local && cp -R plugins/albatros ~/.cursor/plugins/local/albatros`, Cursor neu laden («Developer: Reload Window»), unter **Customize** Skills und den Server `plugin-albatros-albatros` ansehen, im Chat «Starte Albatros», Anmeldung im Browser. Danach `rm -r ~/.cursor/plugins/local/albatros`. Klappt die Anmeldung nicht: Cursor nutzt als Rücksprung auch `https://www.cursor.com/agents/mcp/oauth/callback`; ob Clerk ihn annimmt, ist nicht gemessen.
2. Merge nach `main`.
3. [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish): Link `https://github.com/dischen87/albatros-skills` einreichen.

## ChatGPT und Codex

ChatGPT und Codex teilen einen Katalog. Eingereicht wird ein ZIP mit dem Codex-Format (`.codex-plugin/plugin.json`, `.mcp.json`, `skills/`, `assets/`). Jedes Plugin im Repo hat dieses Manifest (für den Marktplatz in Codex, Texte je Sprache); eingereicht wird **`albatros-en`**, weil der Eintrag bei OpenAI englisch sein muss («Keep English text in the base listing fields»); Deutsch, Französisch und Italienisch stehen als Übersetzungen darin (`de-DE`, `fr-FR`, `it-IT`, gleich den Texten der drei anderen Plugins, `pruefen` vergleicht).

`bun scripts/openai-paket.ts <ziel.zip>` baut das Paket: nur Manifest, Skills und Icon (ohne README: sie beschreibt Kopfzeile und Arbeitsplatz, die das Paket nicht hat), `.mcp.json` mit genau dem Server `albatros` ohne Kopfzeilen (die Einreichung lehnt Kopfzeilen ab) und mit OAuth über CIMD (Rückfall DCR), ohne Berts Arbeitsplatz (ein lokaler Server machte das Plugin zu «nur Desktop»). Ohne Kopfzeile nennt die KI den Stand mit `skills_stand` bei `lage`, wie bei Gemini CLI und Cursor. Gemessen am 12.11.2026: 38 Dateien, 431 KB.

| Regel (Einreichung, «Manifest fields») | Stand |
|---|---|
| `name`, `version`, `description`, `author.name`, `skills`, `mcpServers` | erfüllt |
| `interface`: `displayName` und `shortDescription` je höchstens 30 Zeichen, `longDescription` höchstens 4000, `developerName`, `category`, `capabilities` | erfüllt («Albatros», «From idea to your own website»); `category` ist «Productivity», **Entscheid** im Portal |
| vier Adressen für die Prüfung des MCP-Servers (`websiteURL`, `supportURL`, `privacyPolicyURL`, `termsOfServiceURL`) | erfüllt; `supportURL` ist GitHub-Issues, **Entscheid** (eine Hilfeseite auf albatros.build gibt es nicht, community.albatros.build verlangt eine Anmeldung) |
| `logo` und `composerIcon`, quadratisch, mindestens 48 px | erfüllt (`assets/icon.png`) |
| `brandColor` mit 2:1 gegen Weiss | erfüllt (`#2B5AD2`, brand-himmel aus den Tokens; dunkel `#B9D3FF`) |
| fünf positive und drei negative Testfälle | **Entwurf, nicht gelaufen**: OpenAI verlangt, jeden Fall vorher mit dem Testkonto laufen zu lassen; die Werkzeuge darin gibt es (`pruefen` vergleicht mit `_tools.json`) |
| `review.commerce` | `true` mit Beschreibung (Links zu Stripe über `upgrade_link` und `domain_kaufen`, bezahlt wird auf albatros.build), **Entscheid** (Geld) |
| Video (`demo_recording_url`) | **offen** |
| keine Hooks, keine Kopfzeilen, keine Zugangsdaten im Paket | erfüllt |
| Organisation verifiziert (Person oder Firma) | **offen** |
| Domain-Nachweis: `https://mcp.albatros.build/.well-known/openai-apps-challenge` gibt genau das Token aus dem Portal zurück | **offen**, braucht eine Änderung in mcp (Repo `albatros`) |
| Testkonto ohne MFA, ohne Code per Mail, ohne Magic Link | **offen**: Die Anmeldung bei Albatros läuft über Google, Apple oder GitHub; es braucht ein eigenes Testkonto, das ohne Rückfrage durchgeht |
| `publication.countries` | weggelassen, **Entscheid** (ohne Angabe keine Einschränkung beim ersten Hochladen, nicht geprüft) |

Gemessen am 12.11.2026 mit Codex 0.166.0 (leeres `CODEX_HOME`, dieser Zweig als lokaler Marktplatz, ohne Modell): `codex plugin add` für `albatros` und `albatros-en`; `codex app-server` (`plugin/read`) liest `interface` aus `.codex-plugin/plugin.json`, `skills/list` zeigt die Skills (`albatros-en:…`), `codex mcp list` zeigt `albatros` mit `X-Albatros-Skills-Stand: 0.3.0` und `albatros-arbeitsplatz` wie vor dem Manifest. Nicht gemessen: Hochladen ins Portal, Anmeldung mit CIMD oder DCR bei Clerk aus ChatGPT (der Rücksprung von ChatGPT muss bei Clerk erlaubt sein).

Grenze in ChatGPT: Im gewöhnlichen Chat kann die KI keine Befehle ausführen und keine Dateien schreiben. Albatros kann dort planen, erklären und den Fortschritt festhalten, bauen und veröffentlichen geht nur in Codex (Desktop-App von ChatGPT oder Codex CLI). So steht es in `longDescription`.

### Was Mathias tun muss

1. Entscheide: `category`, `supportURL`, `commerce`, Länder, ob `albatros-en` das eingereichte Plugin ist.
2. Organisation auf [platform.openai.com/settings/organization/general](https://platform.openai.com/settings/organization/general) verifizieren (Firma Albatros Partner).
3. Testkonto bei Albatros anlegen, das sich ohne MFA und ohne Code anmelden lässt; die fünf positiven und drei negativen Fälle aus `plugins/albatros-en/.codex-plugin/plugin.json` damit laufen lassen und ein Video davon aufnehmen (URL in `review.demo_recording_url`).
4. Nach dem Merge: `bun scripts/openai-paket.ts ~/Desktop/albatros-openai.zip`.
5. [platform.openai.com/plugins](https://platform.openai.com/plugins) → **Upload new or existing plugin** → ZIP → Befunde unter **Metadata & Skills** lesen.
6. **MCPs** → **Connect**: Das Portal zeigt das Token für den Domain-Nachweis; mcp muss es unter `/.well-known/openai-apps-challenge` ausliefern (Änderung in `albatros`, `services/mcp`), dann verbinden und anmelden.
7. **Review details**: Zugang zum Testkonto eintragen (nie ins Paket), **Submit for review**, nach der Freigabe **Publish plugin**.

## Texte für die Einträge

Claude und Cursor zeigen `displayName`, `description` aus `plugin.json` und die README des Plugins. OpenAI zeigt `interface` (Kurz- und Langtext, Vorschläge zum Starten).

**Deutsch** (Kurztext 30 Zeichen): Von der Idee zur eigenen Seite

> Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen. Du sagst deiner KI «Ich will eine Webseite» oder «Ich habe eine Geschäftsidee», und Albatros führt sie nach einem festen Fahrplan in 13 Phasen von der Idee bis zur Seite im Netz. Albatros stellt die Fragen, auf die es ankommt, merkt sich, wo du stehst, und sagt deiner KI, was jetzt dran ist. Du wählst, ob du die Schritte selbst lernst (SSH-Schlüssel, Git, Fliessband) oder die KI sie macht. Bis deine Seite auf deinem Computer fertig ist, kostet Albatros nichts. (Ganzer Text: `plugins/albatros/.codex-plugin/plugin.json`.)

Vorschläge: «Starte Albatros.», «Ich will eine Webseite für meinen Blumenladen.», «Was ist mein nächster Schritt mit Albatros?»

**English** (short text 29 characters): From idea to your own website

> Albatros is a flight school for people with no technical background. You tell your AI "I want a website" or "I've got a business idea", and Albatros guides it along a fixed flight plan in 13 phases from the idea to your site online. Albatros asks the questions that matter, remembers where you are and tells your AI what's up next. You choose whether you learn the steps yourself (SSH keys, Git, a pipeline) or let the AI do them. Until your site is finished on your own computer, Albatros costs nothing. (Full text: `plugins/albatros-en/.codex-plugin/plugin.json`.)

Prompts: “Start Albatros.”, “I want a website for my flower shop.”, “What's my next step with Albatros?”

## Version

Bleibt 0.3.0: Unter `plugins/*/skills` hat sich nichts geändert, und neu sind nur Manifeste, README, Icon und `mcp.json` für Cursor. Wer 0.3.0 schon hat, behält die alte Kopie ohne diese Dateien; das ändert nichts an Skills und Verbindung. `SKILLS_STAND` in der Plattform bleibt.
