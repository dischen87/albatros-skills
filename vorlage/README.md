# Mein Projekt

Das ist dein Logbuch, es liegt im Hafen. Schickst du eine Änderung auf `main` in den Hafen (`git push`), ist sie kurz darauf online:

- **Light:** Albatros zeigt den Ordner `seite/` unter deiner Adresse, etwa 30 Sekunden nach dem Push.
- **Pilot:** Das Fliessband baut deine Seite und liefert sie auf deinen Server aus.

| Datei | Wofür |
|---|---|
| `seite/` | deine Seite, wie sie online geht: zuerst diese Vorlage, beim Live schalten die Seite, die du auf deinem Computer gebaut und freigegeben hast |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Hinweise für deine KI (Claude Code, Codex, Gemini CLI oder Cursor): wo ihr steht und was gilt |
| `Dockerfile` | die Bauanleitung: ein kleiner Webserver mit deiner Seite (Pilot) |
| `compose.yaml` | wie die Seite auf dem Server läuft (Container `webseite`, Port 80, Pilot); dazu Berts Arbeitsplatz online, aus, bis du ihn willst (Skill `betrieb`) |
| `.github/workflows/deploy.yml` | das Fliessband: bauen, ausliefern, prüfen, notfalls zurück (Pilot) |
| `nginx.conf` | wie der Webserver deine Seite ausliefert |
| `bausteine/` | fertige Teile wie Anmeldeliste, Login oder CMS (Pilot) |
| `.gitignore` | was nie ins Logbuch kommt, zum Beispiel `.env` mit Geheimnissen |

Fragen? Sag deiner KI «Erklär mir mein Projekt» oder starte Albatros mit `/albatros:start`.
