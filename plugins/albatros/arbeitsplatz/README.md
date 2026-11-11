# Albatros 0.3.0

Gebündelt aus [dischen87/albatros](https://github.com/dischen87/albatros) `apps/arbeitsplatz` mit `bun run buendeln --nach <dieser Ordner>`. Nicht von Hand ändern.

- `node arbeitsplatz.mjs` startet den Arbeitsplatz im aktuellen Ordner (Projektordner, nicht der Benutzerordner), `--hilfe` zeigt alle Optionen.
- `node arbeitsplatz.mjs --mcp` ist der lokale MCP-Server für deine KI (stdio); das Plugin trägt ihn in `.mcp.json` ein.
- `docker build -t ghcr.io/dischen87/albatros-arbeitsplatz:0.3.0 .` in diesem Ordner baut das Bild für den Arbeitsplatz online (eigener Server, Skill betrieb).
- Braucht Node 20 oder neuer. Lizenz: MIT. Das Bündel enthält OpenPGP.js (LGPL-3.0-or-later, https://openpgpjs.org), unverändert: Damit prüft der Arbeitsplatz die Unterschrift von Anthropic, bevor er die KI einrichtet.
