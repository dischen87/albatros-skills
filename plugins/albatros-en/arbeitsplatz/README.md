# Berts Arbeitsplatz (Bündel)

Dieser Ordner bekommt bei der Auslieferung das Bündel des Arbeitsplatzes: `arbeitsplatz.mjs` (Server, lokaler MCP-Server
`albatros-arbeitsplatz`, Brücke zur eigenen KI; läuft mit Node ≥ 20) und `ui/` (die Oberfläche). Gebaut wird es im Repo albatros,
`apps/arbeitsplatz`, und für alle vier Plugins gleich:

```bash
cd <albatros>/apps/arbeitsplatz && bun run buendeln --nach <albatros-skills>/plugins/albatros-en/arbeitsplatz
git -C <albatros-skills> checkout -- plugins/albatros-en/arbeitsplatz/README.md   # --nach ersetzt den ganzen Ordner, auch diese Datei
```

Eingetragen ist der Arbeitsplatz in `../.mcp.json` als Server `albatros-arbeitsplatz` (stdio:
`node ${CLAUDE_PLUGIN_ROOT}/arbeitsplatz/arbeitsplatz.mjs --mcp`). Er nimmt den Ordner, in dem die KI läuft, als Projekt und schreibt
nur in dessen Ordner `.albatros/` (eigene `.gitignore` mit `*`, kommt nie ins Logbuch). Plan und Verhalten:
`docs/foundable/f01-bert-lokal.md` in albatros. Bis das Bündel hier liegt, startet der Server nicht; die Skills arbeiten dann ohne
Arbeitsplatz weiter (Skill `schnellstart`, Abschnitt «Ohne Arbeitsplatz»).
