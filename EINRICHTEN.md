# Albatros einrichten: Anleitung für deine KI

Diese Seite ist für dich, die KI: Claude Code, Codex, Gemini CLI oder Cursor. Die Person nimmt dich im Rucksack mit auf ihren Weg und hat dir die Seite gegeben, damit du Albatros für sie einrichtest. Sie kennt keine Befehle im Terminal, darum führst du jeden Befehl selbst aus.

- **Begrüss die Person zuerst**, in deinen Worten, etwa so: «Schön, dass du da bist! Ich richte jetzt Albatros für dich ein. Das dauert ein paar Minuten. Du musst nur zwei-, dreimal kurz etwas tun, und ich sage dir jedes Mal genau, was.»
- Sag vor jedem Schritt in einem Satz, was passiert. Zum Beispiel: «Gleich öffnet sich dein Browser, dort meldest du dich mit GitHub, Apple oder Google an.»
- **Muss die Person etwas tun, ist das eine eigene, kurze Nachricht mit genau einer Handlung:** wo (zum Beispiel «unten ins Eingabefeld»), was (das Einzutippende allein in einem Codeblock), und woran sie merkt, dass es geklappt hat. Danach hörst du auf und wartest. Keine Liste mit Varianten, kein «falls nicht, dann …» im selben Atemzug.
- Von der Person brauchst du nur Klicks: eine Freigabe in deinem Fenster und die Anmeldung im Browser. Ein Befehl, den sie tippen muss, ist die Ausnahme. Dann nennst du ihn wörtlich.
- **Kein Fachjargon, kein Prüfbericht.** Wörter wie Plugin, MCP, Server-Eintrag, Skill, Hook, Repo, Token, Marketplace und Namen von Werkzeugen (`konto_status`, `authenticate` …) sagst du der Person nicht. Für sie heisst alles einfach «Albatros». Prüf ruhig, was du einbaust. Der Person sagst du dazu höchstens einen Satz, zum Beispiel: «Ich habe nachgeschaut: Albatros bringt nur Anleitungen für mich und eine Verbindung zu albatros.build mit. Nichts läuft heimlich auf deinem Computer.»
- Frag nie nach Passwörtern. Die gibt die Person nur im Browser ein.
- Die Adresse des Dienstes ist `https://mcp.albatros.build`, das Repo ist `dischen87/albatros-skills`.

**Was du einbaust** (damit du nicht suchen musst): Das Plugin enthält nur Anleitungen (Skills, Markdown) und die Verbindung zu `https://mcp.albatros.build`. Keine Hooks, keine Skripte, die von selbst laufen, keine Berechtigungen. Die Verbindung meldet sich mit OAuth an: Die Person meldet sich im Browser bei Albatros an, ihr Passwort sieht weder Albatros noch du. Herausgeber ist Albatros Partner AG (albatros.build), der Quelltext ist öffentlich.

**Abo der KI:** Albatros zum Lernen kostet nichts, du als KI aber schon: Die Person braucht ein bezahltes Abo direkt bei deinem Anbieter, ab 8 USD im Monat (Cursor mit Plus), sonst ab etwa 20 USD (Claude Code mit Claude Pro, Codex mit ChatGPT Plus, Gemini CLI mit Google AI Pro). Mit einem Gratis-Konto geht es nicht oder nur für ein paar Versuche. Sag ihr das in einem Satz, bevor ihr einrichtet. Bezahlt wird beim Anbieter, nicht bei Albatros.

**Sprache:** Sprich mit der Person in ihrer Sprache. Spricht sie Französisch, Italienisch oder Englisch, nimm unten statt `albatros@albatros` das Plugin `albatros-fr@albatros`, `albatros-it@albatros` oder `albatros-en@albatros`. Bei Gemini CLI und Cursor nimmst du statt `dischen87/albatros-skills` die Adresse `https://github.com/dischen87/albatros-skills/tree/main/plugins/albatros-fr` (oder `-it`, `-en`).

Welche KI bist du? Claude Code: Teil A. Codex: Teil B. Gemini CLI: Teil C. Cursor (im Editor oder im Terminal als `agent`): Teil D.

## A. Claude Code

1. **Einbauen.** Führ selbst aus:
   ```bash
   claude plugin marketplace add dischen87/albatros-skills
   claude plugin install albatros@albatros
   ```
   Fragt Claude Code, ob du den Befehl ausführen darfst, sag der Person: «Gleich fragt dich das Fenster, ob ich etwas ausführen darf. Klick auf Erlauben.»
2. **Laden.** Ein Plugin, das während des Gesprächs dazukommt, lädt Claude Code erst auf Wunsch der Person. Schreib ihr genau das und warte:

   > Albatros ist eingebaut. Damit ich es benutzen kann, tippe unten ins Eingabefeld genau das hier und drück Enter:
   > ```
   > /reload-plugins
   > ```
   > Schreib mir danach einfach «weiter».

   Fehlen die Werkzeuge von Albatros danach immer noch, bitte sie, Claude Code zu schliessen, wieder zu öffnen und «Weiter mit Albatros» zu schreiben.
3. **Anmelden.** Wie, hängt davon ab, wo Claude Code läuft:
   - **Gibt es das Werkzeug `authenticate` des Servers albatros** (Claude Code im Terminal; beim deutschen Plugin heisst es `mcp__plugin_albatros_albatros__authenticate`): Ruf es auf. Es gibt einen Link zurück. Gib ihn der Person mit dem Satz: «Klick auf diesen Link. Dein Browser öffnet sich, dort meldest du dich bei Albatros an, mit GitHub, Apple oder Google.» Danach erscheinen die Werkzeuge von Albatros von selbst. Zeigt der Browser nach der Anmeldung eine Fehlerseite, bitte die Person, die ganze Adresse aus der Adresszeile zu kopieren und dir zu schicken. Ruf damit das Werkzeug `complete_authentication` desselben Servers auf.
   - **Gibt es kein Werkzeug `authenticate`** (Desktop-App von Claude, Tab «Code»; dort gibt es meist das Werkzeug `session_connectors_status`): Die Anmeldung startet nur die Person. Schreib ihr genau das und warte:

     > Jetzt fehlt nur noch deine Anmeldung. Tippe unten ins Eingabefeld und drück Enter:
     > ```
     > /mcp
     > ```
     > Es öffnet sich eine Liste. Klick bei **albatros** auf **Verbinden**. Dein Browser öffnet sich: Melde dich dort mit Google, Apple oder GitHub an und klick auf **Erlauben**. Wenn der Browser meldet, dass es geklappt hat, komm hierher zurück und schreib «fertig».

     Danach prüfst du mit `session_connectors_status`, ob bei `plugin:albatros:albatros` (bei den anderen Sprachen `plugin:albatros-fr:albatros` usw.) `connected` steht. Steht `needs_auth`: Bitte die Person, in derselben Liste bei albatros auf **Erneut verbinden** zu klicken und die Anmeldung im Browser bis zum Schluss zu machen. Die Werkzeuge von Albatros sind ab deiner nächsten Antwort da.
4. **Los.** Ruf `konto_status` auf und folge dem Skill `start`. Er begrüsst die Person an Bord.

## B. Codex

1. **Einbauen.** Führ selbst aus:
   ```bash
   codex plugin marketplace add dischen87/albatros-skills
   codex plugin add albatros@albatros
   ```
   Die Befehle schreiben in die Einstellungen von Codex und laden aus dem Netz. In der Sandbox geht das nicht, darum bitte um die Freigabe, sie ausserhalb auszuführen. Die Person sieht eine Frage und wählt «Ja».
2. **Anmelden.** Führ selbst aus, ebenfalls mit Freigabe ausserhalb der Sandbox und mit einer Zeitgrenze von mindestens fünf Minuten (`timeout_ms` 300000):
   ```bash
   codex mcp login albatros
   ```
   Der Befehl öffnet den Browser und wartet, bis die Person sich angemeldet hat. Sag vorher: «Gleich öffnet sich dein Browser, dort meldest du dich mit GitHub, Apple oder Google an.» Öffnet sich der Browser nicht, gib der Person den Link aus der Ausgabe (die Zeile nach «Authorize `albatros` by opening this URL»). Fertig ist es, wenn der Befehl ohne Fehler endet. `codex mcp list` zeigt dann bei albatros nicht mehr «Not logged in».
3. **Los.** Ruf `konto_status` auf und folge dem Skill `start`. Fehlt das Werkzeug noch, bitte die Person, ein neues Gespräch zu beginnen und dort «Starte Albatros» zu schreiben.

## C. Gemini CLI

Gemini CLI läuft mit Google AI Pro. Für Gratis-Konten und Google One hat Google es am 18.06.2026 durch Antigravity CLI ersetzt; ein Gratis-API-Schlüssel reicht für 250 Anfragen am Tag, nur mit Flash.

1. **Einbauen.** Führ selbst aus:
   ```bash
   npx skills add dischen87/albatros-skills -a gemini-cli -g -y --skill '*'
   gemini mcp add --transport http -s user albatros https://mcp.albatros.build
   ```
2. **Neu starten.** Gemini CLI verbindet sich erst beim nächsten Start mit Albatros. Bitte die Person, Gemini CLI zu schliessen, wieder zu öffnen und «Starte Albatros» zu schreiben. Beim Verbinden öffnet sich der Browser zur Anmeldung. Bleibt er zu, bitte sie, genau das einzutippen: `/mcp auth albatros`.
3. **Los.** Ruf `konto_status` auf und folge dem Skill `start`.

## D. Cursor

1. **Einbauen.** Führ selbst aus:
   ```bash
   npx skills add dischen87/albatros-skills -a cursor -g -y --skill '*'
   node -e 'const fs=require("fs"),f=require("os").homedir()+"/.cursor/mcp.json";let c={};try{c=JSON.parse(fs.readFileSync(f,"utf8"))}catch(e){if(e.code!=="ENOENT")throw e}c.mcpServers={...c.mcpServers,albatros:{url:"https://mcp.albatros.build"}};fs.mkdirSync(require("path").dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(c,null,2))'
   ```
   Der erste Befehl legt die Skills dorthin, wo Cursor sie liest (`~/.agents/skills`). Der zweite trägt Albatros in `~/.cursor/mcp.json` ein. Was dort schon steht, bleibt. Ist die Datei kaputt, bricht er ab, ohne etwas zu ändern: Dann zeig der Person die Fehlermeldung.
2. **Anmelden.** Im Terminal (Cursor CLI, Befehl `agent`) führst du selbst aus, mit einer Zeitgrenze von mindestens fünf Minuten:
   ```bash
   agent mcp login albatros
   ```
   Der Befehl öffnet den Browser und wartet, bis die Person sich angemeldet hat. Sag vorher: «Gleich öffnet sich dein Browser, dort meldest du dich mit GitHub, Apple oder Google an.» Im Editor von Cursor bittest du die Person, Cursor neu zu starten. Beim Verbinden öffnet Cursor den Browser zur Anmeldung. Bleibt er zu, bitte sie, in den Einstellungen von Cursor unter MCP bei albatros die Anmeldung zu starten.
3. **Los.** Ruf `konto_status` auf und folge dem Skill `start`. Fehlt das Werkzeug noch, bitte die Person, ein neues Gespräch zu beginnen und dort «Starte Albatros» zu schreiben.

## Wenn etwas nicht klappt

- **Keine Verbindung zu Albatros:** Sag es ehrlich und versuch es später nochmals. Nichts erfinden.
- **Die Person will lieber selbst tippen:** Zeig ihr die Befehle aus ihrem Teil, jeden mit einem Satz, was er tut.
- **Fragen, die du nicht beantworten kannst:** https://community.albatros.build oder später das Werkzeug `coach_fragen`.
