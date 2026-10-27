---
name: pipeline
description: 'Erklärt CI/CD einer Person ohne Vorwissen mit dem Bild vom Fliessband mit Qualitätskontrolle und richtet es ein: Ein Workflow im Hafen von Albatros (Forgejo, code.aufwind.sh) startet bei jedem Push auf main. Der Arbeiter (Runner) auf dem eigenen Server baut die Seite, liefert sie mit Gesundheitscheck aus, prüft sie über die öffentliche Adresse und springt sonst auf die letzte gute Version zurück. Nutze den Skill bei «Pipeline», «CI/CD», «GitHub Actions», «Forgejo Actions», «Workflow», «Runner», «automatisch ausliefern», «deployen», «wie kommt meine Änderung auf den Server», «Fliessband ist rot», «Deploy fehlgeschlagen».'
---

# Pipeline: das Fliessband mit Qualitätskontrolle

## Das Bild

In einer Fabrik trägt niemand jedes Teil einzeln zum Lastwagen. Es gibt ein Fliessband:

1. **Prüfstation:** Das Teil wird gebaut. Klappt das nicht, hält das Band an, und nichts geht raus.
2. **Auslieferung:** Das neue Teil wird eingebaut und sofort geprüft: Läuft es? Wenn nicht, kommt das alte Teil zurück.
3. **Endkontrolle:** Von der Strasse aus wird geschaut, ob die Seite antwortet.

Bei dir startet das Band, sobald du einen Eintrag in den Hafen schickst (Skill `git-logbuch`). Der Arbeiter am Band wohnt bei dir: Er läuft auf deinem eigenen Server und arbeitet nur dort. Das Fachwort ist **CI/CD**, das Band heisst **Workflow**, der Arbeiter **Runner**.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form. Geh die Workflow-Datei mit der Person Station für Station durch, bevor sie läuft.
- Das Fliessband braucht keinen Schlüssel und kein Geheimnis von der Person: Der Arbeiter wohnt schon auf ihrem Server. Ihr Hausschlüssel gehört nie ins Fliessband.
- Ist das Band rot: Ursache beheben, nie die Prüfung abschalten.

## Ablauf

### 1. Was schon da ist

`konto_status` nennt den Namen des Servers, die Adresse des Hafens (`git@aufwind.sh:{name}/projekt.git`) und ob der Arbeiter bereit ist. Frag die Person nicht danach. Die Vorlage von Albatros bringt `.github/workflows/deploy.yml`, `compose.yaml` und `Dockerfile` schon mit: Lies sie mit der Person und vergleiche mit dem Kern unten. Fehlen sie, legst du sie an, auch wenn der Ordner noch leer ist, und sagst danach, was noch fehlt (Logbuch im Hafen, Inhalt der Seite).

Der Webserver-Container heisst `webseite` und hört im Server auf Port 80. Albatros leitet `https://{name}.aufwind.sh` dorthin. Auf einem frischen Server belegt die Begrüssungsseite (Dienst `willkommen`) Port 80. Das Fliessband schaltet sie vor dem ersten Start ab. Startest du einmal von Hand, zuerst `sudo systemctl disable --now willkommen`.

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

### 2. Die Workflow-Datei

`.github/workflows/deploy.yml` (der Hafen liest diesen Ordner wie GitHub):

```yaml
name: Fliessband
on:
  push:
    branches: [main]
  workflow_dispatch:                    # Knopf «Run workflow» für einen Lauf von Hand

jobs:
  fliessband:
    runs-on: albatros                   # der Arbeiter auf deinem eigenen Server, er macht einen Auftrag nach dem anderen
    defaults:
      run:
        shell: bash
    env:
      SHA: ${{ github.sha }}
      SEITE: https://${{ github.repository_owner }}.aufwind.sh
    steps:
      - name: Bauen und ausliefern, notfalls zurück
        run: |
          set -euo pipefail
          cd ~/projekt                  # hier wohnt deine Seite, der Stand kommt immer aus dem Logbuch
          ALT=$(git rev-parse HEAD)
          git fetch -q origin main && git reset -q --hard "$SHA"
          # Station 1: bauen. Klappt das nicht, bleibt die alte Seite online.
          if ! docker compose build; then
            git reset -q --hard "$ALT"
            echo "Bau fehlgeschlagen, die alte Seite bleibt online" >&2
            exit 1
          fi
          # Station 2: ausliefern, mit dem Gesundheitscheck aus compose.yaml
          sudo systemctl disable --now willkommen 2>/dev/null || true   # Begrüssungsseite gibt Port 80 frei
          if ! docker compose up -d --wait --wait-timeout 120; then
            echo "Neue Version ist nicht gesund, zurück auf $ALT" >&2
            docker compose logs --tail 30 >&2 || true
            git reset -q --hard "$ALT"
            docker compose up -d --build --wait --wait-timeout 120 || true
            exit 1
          fi
          echo "läuft: $SHA"
      - name: Endkontrolle über die öffentliche Adresse
        run: |
          for i in 1 2 3 4 5; do
            code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$SEITE" || true)
            [ "$code" = 200 ] && exit 0
            sleep 3
          done
          echo "$SEITE antwortet $code statt 200" >&2
          exit 1
```

Station für Station erklären. Auf dem Server wird nichts von Hand geändert: Der Stand kommt immer aus dem Logbuch. Die `.env` auf dem Server bleibt dabei unberührt (Skill `sicherheit`). Braucht ein Schritt doch einmal ein Geheimnis, kommt es in den Tresor des Hafens (im Repo unter Einstellungen, Actions, Secrets) und im Workflow nur über `env:` in den Befehl, nie direkt als `${{ secrets.… }}` in eine `run`-Zeile.

### 3. Erste Fahrt

1. Eintrag ins Logbuch, Push (Skill `git-logbuch`).
2. Zuschauen im Browser: `https://code.aufwind.sh/{name}/projekt/actions`.
3. Grün: Seite im Browser öffnen, die Änderung ist da.

### 4. Die Kontrolle bei der Arbeit sehen

Die Person baut absichtlich einen Fehler ein, der den Bau scheitern lässt (z. B. einen Tippfehler im `Dockerfile`), und pusht. Das Band wird rot, die alte Seite bleibt online. Fehler zurücknehmen, pushen, grün. Jetzt weiss sie, dass das Band sie schützt.

### 5. Mission prüfen

`mission_pruefen` mit `flugschule-05-pipeline`. Die Prüfung schaut, ob der letzte Lauf von `deploy.yml` im Hafen grün ist, der Container `webseite` läuft und die Seite antwortet.

## Wenn das Band rot ist

- **Welche Station?** Im Browser unter «Actions» den roten Lauf öffnen. Die Person kopiert die letzten Zeilen in den Chat. Auf dem Server siehst du selbst nach: `ssh {name}@aufwind.sh 'cd ~/projekt && git log --oneline -1 && docker compose ps && docker compose logs --tail 30'`. Zusammen lesen, Ursache in einem Satz benennen.
- **Der Lauf wartet und startet nicht:** Kein Arbeiter nimmt ihn an. Steht in der Datei genau `runs-on: albatros`? `konto_status` zeigt, ob der Arbeiter bereit ist. Sonst `coach_fragen`.
- **`Permission denied` bei `git fetch`:** Der Server darf den Hafen nicht lesen. Das richtet Albatros ein, also `coach_fragen`.
- **Bau rot:** Fehler im `Dockerfile` oder in der Seite. Die alte Seite bleibt online.
- **Auslieferung rot («nicht gesund»):** Der Container startet, antwortet aber nicht. Die Zeilen aus `docker compose logs` im Lauf sagen, warum. Die alte Version läuft wieder.
- **Endkontrolle rot, der Rest grün:** Die Seite läuft im Server, aber nicht über die Adresse. Container-Port prüfen (`docker ps`), dann Skill `zurueck-auf-gestern`.
- **Nie** die Prüfung entfernen, damit das Band grün wird.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «das Fliessband mit Qualitätskontrolle», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
