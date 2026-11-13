# Verzeichnisfassungen und persönliche Plugins

Stand 13.11.2026. Mathias hat getrennte Fassungen für Claude und OpenAI bestätigt. Support für diese Einträge: **mathias@albatrospartner.ch**. Noch keine Einreichung und keine Portal-Freigabe.

## Getrennte Verbindungen

| Verwendung | Inhalt | MCP-Adresse |
|---|---|---|
| Persönliche Installation aus `plugins/*` | vollständige Skills, Arbeitsplatz und bisherige Funktionen | `https://mcp.albatros.build` |
| Claude-Verzeichnis | kuratierte Projektplanung P1–P10, vier Sprachpakete | `https://mcp.albatros.build/verzeichnis/claude` |
| ChatGPT/Codex-Verzeichnis | kuratierte Projektplanung P1–P10, englische Basis mit de/fr/it im Eintrag | `https://mcp.albatros.build/verzeichnis/openai` |

Die Verzeichnisfassungen haben eigene Namen und enthalten eine eigenständig geschriebene Anleitung. Sie kopieren keine vollständigen Originalskills und laden keine Anleitung über `skill_holen` oder `methode`. Beide verwenden ausschliesslich `lage`, `konto_status`, `weg_waehlen`, `modus_waehlen`, `schritt_melden`, `verstanden_melden`, `mission_holen` und `mission_pruefen`. Der Server begrenzt auch direkte Aufrufe auf diesen Umfang. Mit ausgeschaltetem FAHRPLAN sind Lernwerkzeuge wie bisher nicht verfügbar.

Die Fassungen erstellen keine KI-Bilder oder 3D-Modelle. Sie enthalten keine Abos, Preislisten, Guthaben, Upgrades, Kauf- oder Checkout-Wege. Planen und bestätigten Fortschritt festhalten funktioniert im Chat; die Arbeit an lokalen Dateien setzt eine Umgebung mit diesen Fähigkeiten und einen Auftrag voraus. Bei P11 oder höher nennt die Verbindung neutral die Grenze des Planungsumfangs. Die acht Werkzeuge enthalten eigene beschränkte Antworten statt der vollständigen Skill-, Missions- und Kontotexte.

Die persönlichen Plugins und ihre bestehende Verbindung bleiben funktional unverändert. Für den Cursor Marketplace bleibt die bisherige offene Fassung mit `.cursor-plugin/marketplace.json` und `plugins/*/.cursor-plugin/plugin.json` vorgesehen. Diese wird nicht als OpenAI- oder Claude-Verzeichnisfassung eingereicht.

## Claude: einreichbare Quellordner

| Sprache | Plugin-Ordner im öffentlichen Repo |
|---|---|
| Deutsch | `verzeichnisse/claude/albatros-planung` |
| Englisch | `verzeichnisse/claude/albatros-planning` |
| Französisch | `verzeichnisse/claude/albatros-planification-fr` |
| Italienisch | `verzeichnisse/claude/albatros-progetto-it` |

Jeder Ordner enthält nur `.claude-plugin/plugin.json`, `.mcp.json`, `README.md`, `skills/projekt-planen/SKILL.md` und `assets/icon.png`. Die README erklärt die ausgeführten und übertragenen Vorgänge. Das Icon ist das vorhandene Albatros-Zeichen. Keine lokalen Server, Hooks, Laufzeitinstallationen oder externen Skill-Fetches.

Die Texte werden in `verzeichnisse/texte.json` gepflegt. Nach Änderungen:

```sh
bun scripts/verzeichnis-pakete.ts --quellen
bun run pruefen
bun test
```

`bun run pruefen` verlangt, dass die eingecheckten Claude-Ordner mit den kuratierten Quellen übereinstimmen. `scripts/verzeichnis-pakete.test.ts` prüft auch manipulierte MCP-Adressen, zusätzliche Dateien und ausgeschlossene Inhalte. `scripts/verzeichnis-vertrag.test.ts` gleicht URLs, Werkzeugnamen und Schemas gegen die Plattform ab, wenn `ALBATROS` auf deren Checkout mit `services/mcp/src/profile.ts` zeigt.

Aktuelle offizielle CLI einmalig und ohne globales Update verwenden, zum Beispiel für das deutsche Paket:

```sh
npx --yes @anthropic-ai/claude-code@2.1.323 plugin validate --strict --profile directory verzeichnisse/claude/albatros-planung
```

Die installierte CLI 2.1.118 kennt die neuen Listingfelder und `--strict` noch nicht. Die aktuelle [Manifest-Referenz](https://code.claude.com/docs/en/plugins/manifest-reference.md) erlaubt `displayName`, `icon`, `documentationUrl`, `supportUrl`, `privacyPolicyUrl` und `termsOfServiceUrl`. Diese Felder werden deshalb beibehalten. Die lokale CLI ersetzt weder den Sicherheitsscan noch die Policy-Prüfung im Portal.

Nach Merge und Server-Deploy: im [Claude-Portal](https://claude.ai/directory/manage) zuerst den MCP-Connector mit der **Claude-Profiladresse** einreichen, dann je Sprachpaket **Plugin bundle** mit einem Ordner aus der Tabelle, Branch `main`. **Validate**, Befunde beheben, **Submit for review**; freigegebene zusammengehörige Einträge koppeln. Die erste einreichende Organisation behält den Eintrag. Vorher den tatsächlichen OAuth-Weg und alle Werkzeuge mit dem separaten Prüfkonto testen.

## OpenAI: eigener ZIP-Builder

```sh
bun scripts/openai-paket.ts ~/Downloads/albatros-einreichen-2026-11-13/albatros-openai-0.3.1.zip
```

Der Builder gibt ausschliesslich **albatros-planning** aus: `.codex-plugin/plugin.json`, `.mcp.json`, `skills/projekt-planen/SKILL.md` und `assets/icon.png`. Er nimmt keinen persönlichen Vollplugin-Namen als Einreichung an. Die Verbindung hat keine Kopfzeilen und keinen lokalen Befehl; OAuth bevorzugt CIMD. Der englische Eintrag enthält deutsche, französische und italienische Übersetzungen aus denselben kuratierten Quellen, fünf positive und drei negative Szenarien und `review.commerce: false`.

Die fünf Szenarien stehen in `scripts/verzeichnis-pakete.ts` bei `testCases`; im ZIP unter `.codex-plugin/plugin.json` → `extensions.com.openai.review.test_cases`. Sie sind ein Prüfleitfaden, kein Nachweis einer bereits ausgeführten Portal-Prüfung. Kein Kennwort, keine Prüferzugangsdaten und kein erfundenes Demovideo im Paket.

Kontaktmail steht in `author.email` und im Eintragstext. `supportURL` bleibt die gültige HTTPS-Adresse der [GitHub-Issues](https://github.com/dischen87/albatros-skills/issues), weil das OpenAI-Schema HTTPS verlangt. Kein ungültiges `mailto` und keine noch nicht vorhandene Kontaktseite.

Nach Server-Deploy und echten Kontotests: Organisation bei OpenAI verifizieren, [Plugin-Portal](https://platform.openai.com/plugins) öffnen, ZIP hochladen, MCP-Verbindung mit der **OpenAI-Profiladresse** herstellen. Den dort angezeigten Domain-Token unter `/.well-known/openai-apps-challenge` ausliefern und prüfen. Zugang zum gefüllten Prüfkonto ohne MFA oder Mail-/SMS-Code nur im Portal hinterlegen. Alle fünf positiven und drei negativen Fälle ausführen, ein zugängliches Demovideo aufnehmen und erst dann **Submit for review**. Nach Freigabe separat **Publish plugin**.

Die Datei `albatros-openai-0.3.1-vorpruefung.zip` aus dem ersten unveränderten Build ist ausdrücklich ein veraltetes, nicht einreichbares Vorprüfungsartefakt. Für die Einreichung ausschliesslich einen neuen Build dieses Builders verwenden.

## Vor der tatsächlichen Einreichung offen

- Profilserver deployen und OAuth mit den exakten URLs, pfadgenauen Protected Resource Metadata und passenden Token-Audiences im echten Client testen.
- Die Werkzeuge in Claude und ChatGPT/Codex mit einem eigenen, gefüllten Prüfkonto durchspielen; keine echten Nutzerdaten verwenden.
- Organisation und bei OpenAI die Domain bestätigen; zugängliches Demovideo und Prüferzugang im Portal ergänzen.
- Claude-Portalprüfung, OpenAI-Metadaten-/Skill-/Toolscan und anschliessende Reviews bestehen.

Quellen, am 13.11.2026 an der Quelle gelesen: [Anthropic Connector-Checkliste](https://claude.com/docs/connectors/building/review-criteria.md), [Claude veröffentlichen](https://claude.com/docs/directory/publish), [OpenAI-Richtlinien](https://developers.openai.com/plugins/plugin-guidelines), [OpenAI-Paketformat](https://developers.openai.com/plugins/build/plugins), [OpenAI-Einreichung](https://developers.openai.com/plugins/deploy/submission). OpenAI erlaubt die Nutzung vorhandener Berechtigungen; das Auslagern eines digitalen Verkaufs auf eine externe Zahlungsseite macht ihn nicht zulässig. Die Verzeichnisfassung bietet deshalb eigenständige Projektplanung.
