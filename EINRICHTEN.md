# Albatros einrichten: Anleitung für deine KI

Diese Seite ist für dich, die KI: Claude Code, Codex oder Gemini CLI. Die Person nimmt dich im Rucksack mit auf ihren Weg und hat dir die Seite gegeben, damit du Albatros für sie einrichtest. Sie kennt keine Befehle im Terminal, darum führst du jeden Befehl selbst aus.

- Sag vor jedem Schritt in einem Satz, was passiert. Zum Beispiel: «Gleich öffnet sich dein Browser, dort meldest du dich mit GitHub, Apple oder Google an.»
- Von der Person brauchst du nur Klicks: eine Freigabe in deinem Fenster und die Anmeldung im Browser. Ein Befehl, den sie tippen muss, ist die Ausnahme. Dann nennst du ihn wörtlich.
- Frag nie nach Passwörtern. Die gibt die Person nur im Browser ein.
- Die Adresse des Dienstes ist `https://mcp.albatros.build`, das Repo ist `dischen87/albatros-skills`.

**Abo der KI:** Albatros zum Lernen kostet nichts, du als KI aber schon: Die Person braucht ein bezahltes Abo direkt bei deinem Anbieter, ab etwa 20 USD im Monat (Claude Code mit Claude Pro, Codex mit ChatGPT Plus, Gemini CLI mit Google AI Pro). Mit einem Gratis-Konto geht es nicht oder nur für ein paar Versuche. Sag ihr das in einem Satz, bevor ihr einrichtet. Bezahlt wird beim Anbieter, nicht bei Albatros.

**Sprache:** Sprich mit der Person in ihrer Sprache. Spricht sie Französisch, Italienisch oder Englisch, nimm unten statt `albatros@albatros` das Plugin `albatros-fr@albatros`, `albatros-it@albatros` oder `albatros-en@albatros`. Bei Gemini CLI nimmst du statt `dischen87/albatros-skills` die Adresse `https://github.com/dischen87/albatros-skills/tree/main/plugins/albatros-fr` (oder `-it`, `-en`).

Welche KI bist du? Claude Code: Teil A. Codex: Teil B. Gemini CLI: Teil C.

## A. Claude Code

1. **Einbauen.** Führ selbst aus:
   ```bash
   claude plugin marketplace add dischen87/albatros-skills
   claude plugin install albatros@albatros
   ```
   Fragt Claude Code, ob du den Befehl ausführen darfst, sag der Person: «Bestätige bitte mit Ja.»
2. **Laden.** Ein Plugin, das während des Gesprächs dazukommt, lädt Claude Code erst auf Wunsch der Person. Bitte sie, genau das einzutippen und Enter zu drücken: `/reload-plugins`. Fehlen die Werkzeuge von Albatros danach immer noch, bitte sie, Claude Code zu schliessen, wieder zu öffnen und «Weiter mit Albatros» zu schreiben.
3. **Anmelden.** Ruf das Werkzeug `authenticate` des Servers albatros auf (beim deutschen Plugin heisst es `mcp__plugin_albatros_albatros__authenticate`). Es gibt einen Link zurück. Gib ihn der Person mit dem Satz: «Klick auf diesen Link. Dein Browser öffnet sich, dort meldest du dich bei Albatros an, mit GitHub, Apple oder Google.» Danach erscheinen die Werkzeuge von Albatros von selbst. Zeigt der Browser nach der Anmeldung eine Fehlerseite, bitte die Person, die ganze Adresse aus der Adresszeile zu kopieren und dir zu schicken. Ruf damit das Werkzeug `complete_authentication` desselben Servers auf.
4. **Los.** Ruf `konto_status` auf und folge dem Skill `start`.

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

## Wenn etwas nicht klappt

- **Keine Verbindung zu Albatros:** Sag es ehrlich und versuch es später nochmals. Nichts erfinden.
- **Die Person will lieber selbst tippen:** Zeig ihr die Befehle aus ihrem Teil, jeden mit einem Satz, was er tut.
- **Fragen, die du nicht beantworten kannst:** https://community.albatros.build oder später das Werkzeug `coach_fragen`.
