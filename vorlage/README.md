# Mein Projekt

Das ist dein Logbuch. Jede Änderung, die du auf `main` in den Hafen schickst (`git push`), baut das Fliessband und liefert sie auf deinen Server aus.

| Datei | Wofür |
|---|---|
| `seite/` | deine Seite, fang mit `index.html` an |
| `Dockerfile` | die Bauanleitung: ein kleiner Webserver mit deiner Seite |
| `compose.yaml` | wie die Seite auf dem Server läuft (Container `webseite`, Port 80) |
| `.github/workflows/deploy.yml` | das Fliessband: bauen, ausliefern, prüfen, notfalls zurück |
| `.gitignore` | was nie ins Logbuch kommt, zum Beispiel `.env` mit Geheimnissen |

Fragen? Sag deiner KI «Erklär mir mein Projekt» oder starte Albatros mit `/albatros:start`.
