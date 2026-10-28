---
name: pipeline
description: "Explains CI/CD to someone with no background using the picture of the conveyor belt with quality control, and sets it up: a workflow in the Albatros harbour (Forgejo, code.aufwind.sh) starts on every push to main. The worker (runner) on their own server builds the site, delivers it with a health check, checks it through the public address and otherwise jumps back to the last good version. Use this skill for “pipeline”, “CI/CD”, “GitHub Actions”, “Forgejo Actions”, “workflow”, “runner”, “deploy automatically”, “deploying”, “how does my change get onto the server?”, “the conveyor belt is red”, “my build is failing”, “deploy failed”."
---

# Pipeline: the conveyor belt with quality control

## The picture

In a factory, nobody carries every part to the lorry by hand. There's a conveyor belt:

1. **Test station:** the part gets built. If that doesn't work, the belt stops and nothing goes out.
2. **Delivery:** the new part is fitted and checked straight away: does it run? If not, the old part goes back in.
3. **Final inspection:** someone checks from the street whether the site answers.

For you, the belt starts as soon as you send an entry to the harbour (skill `git-logbuch`). The worker on the belt lives with you: it runs on your own server and only works there. The technical term is **CI/CD**, the belt is called a **workflow**, the worker a **runner**.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”. Go through the workflow file with the person station by station before it runs.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- The conveyor belt doesn't need a key or a secret from the person: the worker already lives on their server. Their house key never belongs on the conveyor belt.
- If the belt is red: fix the cause, never switch off the check.

## Steps

### 1. What's already there

**With Light** there's no conveyor belt: after every push, Albatros puts the folder `seite/` from `main` straight on display, with no build and no check. Explain the picture anyway. The belt with quality control belongs to Pilot (`upgrade_link`, plan `pilot`). The file `deploy.yml` from the template sleeps on Light. When switching to Pilot, Albatros turns the belt on and runs it once straight away, so that your own server delivers the site. The mission `flugschule-05-pipeline` belongs to Pilot.

**With Pilot:** `konto_status` gives the name of the server, the address of the harbour (`git@aufwind.sh:{name}/projekt.git`) and whether the worker is ready. Don't ask the person for these. The Albatros template already brings `.github/workflows/deploy.yml`, `compose.yaml` and `Dockerfile`: read them with the person and compare them with the core below. If they're missing, create them, even if the folder is still empty, and then say what's still missing (logbook in the harbour, content of the site).

The web server container is called `webseite` and listens on port 80 inside the server. Albatros routes `https://{name}.aufwind.sh` there. On a fresh server the welcome page (service `willkommen`) takes up port 80. The conveyor belt switches it off before the first start. If you start by hand once, first run `sudo systemctl disable --now willkommen`.

`compose.yaml` (core):

```yaml
services:
  webseite:
    container_name: webseite
    build: .
    restart: unless-stopped
    ports:
      - "80:80"
    healthcheck:                         # "running" doesn't mean "working" yet
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/"]
      interval: 10s
      retries: 6
```

### 2. The workflow file

`.github/workflows/deploy.yml` (the harbour reads this folder just like GitHub):

```yaml
name: Fliessband
on:
  push:
    branches: [main]
  workflow_dispatch:                    # "Run workflow" button for a run by hand

jobs:
  fliessband:
    runs-on: albatros                   # the worker on your own server, it does one job after another
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
          cd ~/projekt                  # this is where your site lives, the state always comes from the logbook
          ALT=$(git rev-parse HEAD)
          git fetch -q origin main && git reset -q --hard "$SHA"
          # Station 1: build. If that fails, the old site stays online.
          if ! docker compose build; then
            git reset -q --hard "$ALT"
            echo "Bau fehlgeschlagen, die alte Seite bleibt online" >&2
            exit 1
          fi
          # Station 2: deliver, with the health check from compose.yaml
          sudo systemctl disable --now willkommen 2>/dev/null || true   # the welcome page frees up port 80
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

(The step names and messages stay German, as in the template: build and deliver, go back if needed; build failed, the old site stays online; the new version isn't healthy, back to the old one; final inspection through the public address.)

Explain it station by station. Nothing on the server gets changed by hand: the state always comes from the logbook. The `.env` on the server stays untouched (skill `sicherheit`). If a step ever does need a secret, it goes into the harbour's safe (in the repo under Settings, Actions, Secrets) and reaches the command in the workflow only through `env:`, never directly as `${{ secrets.… }}` in a `run` line.

### 3. First run

1. Make an entry in the logbook and push (skill `git-logbuch`).
2. Watch in the browser: `https://code.aufwind.sh/{name}/projekt/actions`.
3. Green: open the site in the browser, and the change is there.

### 4. See the inspection at work

The person deliberately puts in a mistake that makes the build fail (e.g. a typo in the `Dockerfile`) and pushes. The belt turns red, and the old site stays online. Undo the mistake, push, green. Now they know the belt protects them.

### 5. Check the mission

`mission_pruefen` with `flugschule-05-pipeline`. The check looks at whether the last run of `deploy.yml` in the harbour is green, the container `webseite` is running and the site answers.

## When the belt is red

- **Which station?** In the browser, open the red run under “Actions”. The person copies the last lines into the chat. On the server you look yourself: `ssh {name}@aufwind.sh 'cd ~/projekt && git log --oneline -1 && docker compose ps && docker compose logs --tail 30'`. Read it together, and name the cause in one sentence.
- **The run is waiting and doesn't start:** no worker is picking it up. Does the file say exactly `runs-on: albatros`? `konto_status` shows whether the worker is ready. Otherwise `coach_fragen`.
- **`Permission denied` on `git fetch`:** the server isn't allowed to read the harbour. Albatros sets that up, so `coach_fragen`.
- **Build red:** a mistake in the `Dockerfile` or in the site. The old site stays online.
- **Delivery red (“nicht gesund”, not healthy):** the container starts but doesn't answer. The lines from `docker compose logs` in the run say why. The old version is running again.
- **Final inspection red, the rest green:** the site runs inside the server, but not through the address. Check the container port (`docker ps`), then skill `zurueck-auf-gestern`.
- **Never** remove the check to make the belt go green.

## Final message

Your last message in this step starts with one sentence on the picture “the conveyor belt with quality control” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
