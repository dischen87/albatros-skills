---
name: pipeline
description: 'Erklärt CI/CD einer Person ohne Vorwissen mit dem Bild vom Fliessband mit Qualitätskontrolle und richtet es ein: ein GitHub-Actions-Workflow prüft und baut jede Änderung auf main und liefert sie per SSH mit einem eigenen Schlüssel des Fliessbands auf den Albatros-Server, mit Endkontrolle von aussen und Rücksprung auf die letzte gute Version. Nutze den Skill bei «Pipeline», «CI/CD», «GitHub Actions», «Workflow», «automatisch ausliefern», «deployen», «wie kommt meine Änderung auf den Server», «Actions ist rot», «Deploy fehlgeschlagen».'
---

# Pipeline: das Fliessband mit Qualitätskontrolle

## Das Bild

In einer Fabrik trägt niemand jedes Teil einzeln zum Lastwagen. Es gibt ein Fliessband:

1. **Prüfstation:** Jedes Teil wird geprüft. Ist es fehlerhaft, hält das Band an, und nichts geht raus.
2. **Verpackung:** Das Teil wird gebaut und verpackt.
3. **Auslieferung:** Erst wenn alles grün ist, fährt es zum Kunden.
4. **Endkontrolle:** Beim Kunden wird geschaut, ob es funktioniert. Wenn nicht, kommt das alte Teil zurück.

Bei dir startet das Band, sobald du einen Eintrag in den Hafen schickst (Skill `git-logbuch`). Das Fachwort ist **CI/CD**, das Band selbst heisst bei GitHub **Workflow**.

## So sprichst du

- Du-Form. Geh die Workflow-Datei mit der Person Station für Station durch, bevor sie läuft.
- Das Fliessband bekommt einen **eigenen Schlüssel**, nie den Hausschlüssel der Person. So lässt er sich einzeln sperren.
- Ist das Band rot: Ursache beheben, nie die Prüfung abschalten.

## Ablauf

### 1. Was schon da ist

Bringt die Vorlage `.github/workflows/deploy.yml`, `compose.yaml` und `Dockerfile` mit, lies sie mit der Person und vergleiche mit dem Kern unten. Sonst lege die Dateien an. Der Webserver-Container heisst `webseite` und hört im Server auf Port 80. Albatros leitet `https://{name}.aufwind.sh` dorthin.

`compose.yaml` (Kern):

```yaml
services:
  webseite:
    container_name: webseite
    build: .
    restart: unless-stopped
    ports:
      - "80:80"
    healthcheck:                         # «läuft» heisst noch nicht «funktioniert»
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/"]
      interval: 10s
      retries: 6
```

### 2. Der Schlüssel des Fliessbands

```bash
ssh-keygen -t ed25519 -f ~/.ssh/albatros-fliessband -N "" -C "fliessband"
cat ~/.ssh/albatros-fliessband.pub
```

- Das **Schloss** (`.pub`) geht mit `schluessel_hinterlegen` zu Albatros, wie beim eigenen Schlüssel.
- Der **Schlüssel selbst** gehört diesmal nicht dir, sondern dem Fliessband. Er geht direkt aus der Datei in den Tresor von GitHub (Secrets), nie in den Chat und nie ins Logbuch:

```bash
gh secret set DEPLOY_KEY < ~/.ssh/albatros-fliessband
gh secret set DEPLOY_KNOWN_HOSTS --body "$(ssh-keyscan -t ed25519 aufwind.sh 2>/dev/null)"
gh variable set SERVER --body "{name}@aufwind.sh"
gh variable set SEITE_URL --body "https://{name}.aufwind.sh"
```

Den Fingerabdruck aus `ssh-keyscan` mit dem im Cockpit vergleichen. Danach darf die Datei `~/.ssh/albatros-fliessband` auf dem Computer gelöscht werden: Das Band hat seinen Schlüssel.

### 3. Die Workflow-Datei

`.github/workflows/deploy.yml`:

```yaml
name: Fliessband
on:
  push:
    branches: [main]
  workflow_dispatch:                  # Knopf «Run workflow» für einen Lauf von Hand
permissions:
  contents: read                      # so wenig Rechte wie möglich
concurrency:
  group: ausliefern
  cancel-in-progress: false           # eine laufende Auslieferung nie abbrechen

jobs:
  pruefen:                            # Station 1: Qualitätskontrolle
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t probe .  # baut die Seite genau wie auf dem Server; Tests der Vorlage laufen im Dockerfile

  ausliefern:                         # Station 2 bis 4
    needs: pruefen                    # nur wenn die Prüfung grün ist
    runs-on: ubuntu-latest
    env:
      ZIEL: ${{ vars.SERVER }}
      SEITE: ${{ vars.SEITE_URL }}
      SHA: ${{ github.sha }}
    steps:
      - name: Schlüssel des Fliessbands einsetzen
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
        run: |
          [ -n "$DEPLOY_KEY" ] || { echo "::error::Secret DEPLOY_KEY fehlt"; exit 1; }
          install -d -m 700 ~/.ssh
          printf '%s\n' "$DEPLOY_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519
          printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
      - name: Ausliefern, notfalls zurück
        run: |
          ssh "$ZIEL" "SHA=$SHA bash -s" <<'EOF'
          set -euo pipefail
          cd ~/projekt
          ALT=$(git rev-parse HEAD)
          git fetch -q origin main && git reset -q --hard "$SHA"
          if docker compose up -d --build --wait --wait-timeout 120; then
            echo "läuft: $SHA"
          else
            echo "neue Version ist nicht gesund, zurück auf $ALT" >&2
            docker compose logs --tail 30 >&2 || true
            git reset -q --hard "$ALT"
            docker compose up -d --build --wait --wait-timeout 120 || true
            exit 1
          fi
          EOF
      - name: Endkontrolle von aussen
        run: |
          for i in 1 2 3 4 5; do
            code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$SEITE" || true)
            [ "$code" = 200 ] && exit 0
            sleep 3
          done
          echo "::error::$SEITE antwortet $code statt 200"; exit 1
```

Station für Station erklären. Wichtig: Geheimnisse kommen nur über `env:` in die Befehle, nie direkt als `${{ secrets.… }}` in eine `run`-Zeile. Auf dem Server wird nichts von Hand geändert: Der Stand kommt immer aus dem Logbuch. Die `.env` auf dem Server bleibt dabei unberührt (Skill `sicherheit`).

### 4. Erste Fahrt

1. Eintrag ins Logbuch, Push (Skill `git-logbuch`).
2. Zuschauen: `gh run watch` oder auf github.com unter «Actions».
3. Grün: Seite im Browser öffnen, die Änderung ist da.

### 5. Die Kontrolle bei der Arbeit sehen

Die Person baut absichtlich einen Fehler ein, der den Bau scheitern lässt (z. B. einen Tippfehler im `Dockerfile`), und pusht. Das Band wird rot, die alte Seite bleibt online. Fehler zurücknehmen, pushen, grün. Jetzt weiss sie, dass das Band sie schützt.

### 6. Mission prüfen

`mission_pruefen` mit `flugschule-05-pipeline`. Die Prüfung schaut, ob der letzte Lauf von `deploy.yml` grün ist, der Container `webseite` läuft und die Seite antwortet.

## Wenn das Band rot ist

- **Welche Station?** `gh run view --log-failed` zeigt die letzten Zeilen der roten Station. Zusammen lesen, Ursache in einem Satz benennen.
- **`Permission denied (publickey)` beim Ausliefern:** Schloss des Fliessbands nicht hinterlegt, oder `DEPLOY_KEY` fehlt oder ist unvollständig.
- **`Host key verification failed`:** `DEPLOY_KNOWN_HOSTS` fehlt oder ist alt.
- **Endkontrolle rot, Auslieferung grün:** Die Seite läuft im Server, aber nicht von aussen. Container-Port prüfen (`docker ps`), dann Skill `zurueck-auf-gestern`.
- **Nie** die Prüfung entfernen, damit das Band grün wird.
