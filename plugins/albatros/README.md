# Albatros

Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen. Deine KI (Claude, Codex, Cursor oder Gemini CLI) führt dich nach einem festen Fahrplan von der Idee bis zur eigenen Webseite oder zum eigenen Geschäft im Netz. Unterwegs lernst du, was SSH-Schlüssel, Git und ein Fliessband (CI/CD) sind. Bis deine Seite auf deinem Computer fertig ist, kostet Albatros nichts; dann wählst du, wo sie wohnt: bei Albatros (Light oder Pilot mit einem echten eigenen Server) oder selbst.

Sag deiner KI nach dem Einbau: «Starte Albatros». In Claude Code geht auch `/albatros:start`.

## Einbauen

| KI | So geht es |
|---|---|
| Claude (claude.ai, Cowork, Claude Code) | im Verzeichnis von Claude «Albatros» hinzufügen, sobald es dort steht; in Claude Code bis dahin `claude plugin install albatros --marketplace dischen87/albatros-skills` |
| Cursor | im Marktplatz von Cursor «Albatros» installieren, sobald es dort steht; bis dahin wie in [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md), Teil D |
| Codex und ChatGPT | im Plugin-Verzeichnis von ChatGPT und Codex, sobald es dort steht; bis dahin `codex plugin marketplace add dischen87/albatros-skills` und `codex plugin add albatros@albatros` |

Oder sag deiner KI: «Richte mir Albatros ein: https://albatros.build/einrichten». Sie liest [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md) und erledigt alles selbst.

## Was das Plugin enthält und was es tut

- **Skills** (Markdown in `skills/`): Anleitungen für deine KI, vom Hauptskill `lotse` bis zu SSH-Schlüssel, Git, Domain und Recht in der Schweiz. Sie führen nichts von selbst aus.
- **Verbindung zu Albatros** (`albatros`, `https://mcp.albatros.build`): Du meldest dich im Browser bei Albatros an (OAuth über Clerk, mit Google, Apple oder GitHub). Dein Passwort sieht weder Albatros noch deine KI. Jeder Aufruf nennt den Stand der Skills in der Kopfzeile `X-Albatros-Skills-Stand`, sonst nichts über deinen Computer. Was Albatros speichert (Weg, Abo, Fortschritt), steht in der [Datenschutzerklärung](https://albatros.build/datenschutz).
- **Das Programm Albatros** (`albatros-arbeitsplatz`, `node arbeitsplatz/arbeitsplatz.mjs --mcp`): deine Startseite auf deinem Computer. Es ist nur dort erreichbar (127.0.0.1), schreibt nur in den Ordner `.albatros/` deines Projekts und schickt von sich aus nichts ins Netz. Es braucht Node 20 oder neuer. Claude Code startet es aus dem Plugin; in Codex und Cursor trägt deine KI es erst ein, wenn du es willst (Skill `schnellstart`). Der Quelltext liegt in `dischen87/albatros` (`apps/arbeitsplatz`); das Bündel hier ist nicht verkleinert und enthält OpenPGP.js (LGPL-3.0-or-later) unverändert.
- Keine Hooks, keine geänderten Berechtigungen.

## Kosten, Hilfe, Lizenz

- Albatros zum Lernen kostet nichts. Deine KI braucht ein Abo bei ihrem Anbieter. Preise: https://albatros.build/preise
- Fragen und Fehler: https://github.com/dischen87/albatros-skills/issues
- [AGB](https://albatros.build/agb), [Datenschutz](https://albatros.build/datenschutz), [Impressum](https://albatros.build/impressum). Herausgeber: Albatros Partner (https://albatros.build).
- Lizenz: MIT ([LICENSE](https://github.com/dischen87/albatros-skills/blob/main/LICENSE)).
