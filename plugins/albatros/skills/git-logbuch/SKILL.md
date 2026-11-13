---
name: git-logbuch
description: 'Erklärt Git einer Person ohne Vorwissen mit dem Bild vom Logbuch an Bord und der Kopie im Hafen (dem Git-Dienst von Albatros, code.aufwind.sh). Führt durch die ersten Einträge (Commit) mit guten Notizen. Bis die Seite freigegeben ist, liegt das Logbuch nur auf dem Computer (git init, kein Push); erst beim Live schalten holt er das Repo aus dem Hafen oder verbindet das eigene als origin, schickt die Einträge in den Hafen (Push) und prüft, dass die Kopie auf dem Albatros-Server in ~/projekt ankommt. Regeln: nur auf main, nur eigene Dateien einzeln aufnehmen, nie force-push. Nutze den Skill bei «Git», «GitHub», «Hafen», «commit», «push», «pull», «Repo», «was ist ein Repository», «meine Änderungen sichern», «push abgelehnt», «Konflikt», und bevor du für die Person etwas committest.'
metadata:
  stand: 0.3.3
---

# Git: das Logbuch an Bord, mit einer Kopie im Hafen

## Das Bild

Auf jedem Schiff gibt es ein Logbuch. Jeder Eintrag sagt: wer, wann, was und warum. Wenn etwas schiefgeht, blättert man zurück und sieht, wo es anfing.

- **Repo:** das Logbuch deines Projekts, mit allen Dateien darin.
- **Commit:** ein Eintrag. Er hält einen kleinen, fertigen Schritt fest, mit einer Notiz in einem Satz.
- **Hafen:** `code.aufwind.sh`, der Git-Dienst von Albatros. Er funktioniert wie GitHub und heisst Forgejo. Dort liegt eine Kopie des Logbuchs. Fällt dein Computer ins Wasser, ist nichts verloren.
- **Push:** die neuen Einträge in den Hafen schicken. **Pull:** die neusten Einträge aus dem Hafen holen.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form. Die Wörter Commit, Push und Pull erst nach dem Bild, dann immer zusammen mit ihm.
- Im Hafen meldet sich die Person im Browser mit ihrem Albatros-Konto an. Ein GitHub-Konto braucht sie erst beim Umzug in ein eigenes Haus (Skill `landung`).
- Du committest nie etwas, das die Person nicht kennt. Vor jedem Eintrag zeigst du, was hineinkommt.

## Die drei Regeln

1. **Nur auf `main`.** Ein Logbuch, eine Linie. Zweige sind etwas für später und grosse Umbauten.
2. **Nur eigene Dateien, einzeln aufnehmen:** `git add <datei>`. Nie `git add .`, `git add -A` oder `git commit -a`. Die fegen halbfertige Arbeit und Geheimnisse wie `.env` mit ins Logbuch.
3. **Nie `git push --force`.** Wird ein Push abgelehnt, zuerst `git pull --rebase`, dann nochmals `git push`.

## Ablauf

### 1. Werkzeuge

- `git --version` zeigt, ob Git da ist. Am Mac fragt der Computer beim ersten Aufruf, ob er die Entwicklerwerkzeuge installieren soll. Ja.
- Der Hausschlüssel aus dem Skill `ssh-schluessel` öffnet auch den Hafen. Der Eintrag `Host aufwind.sh` in `~/.ssh/config` gilt für beide Türen.
- Einmal den Namen fürs Logbuch setzen:
  ```bash
  git config --global user.name "Vorname Nachname"
  git config --global user.email "deine-adresse@beispiel.ch"
  ```

### 2. Das Logbuch holen

**Zuerst: Ist die Seite schon freigegeben?** In den Hafen kommt das Logbuch erst, wenn die Person ihre Seite freigegeben hat (`Freigegeben:` mit Datum in `docs/prd.md`) und ihr sie live schaltet (Skill `lancieren`, Abschnitt «Live schalten»), oder wenn ihre Seite schon im Netz ist und sie etwas ändert (Skill `webseite-aendern`). Vorher folgst du dem Abschnitt «Logbuch ohne Hafen»: alles auf dem Computer, ohne Push, auch auf dem Weg Geschäft, wenn eine Methode «ins Logbuch» sagt.

Gibt es schon ein Logbuch auf diesem Computer (auf dem Weg Webseite entsteht es beim Bau, Skill `webseite-bauen`), holst du nichts: Es wird mit dem Hafen verbunden (Abschnitt «Logbuch ohne Hafen»). Sonst gilt: Albatros hat dein Logbuch im Hafen schon angelegt, mit der Vorlage darin. Die Adresse nennt `konto_status`:

```bash
git clone git@aufwind.sh:{name}/projekt.git
cd projekt
```

Das Logbuch ist privat: Nur du siehst es. Danach die `.gitignore` prüfen, mindestens mit diesen Zeilen: `.env`, `.env.*`, `!.env.example`, `node_modules/`, `dist/`.

### 3. Der erste Eintrag

Die Person ändert selbst etwas Kleines, z. B. eine Zeile im `README.md`. Du öffnest ihr die Datei (`open -e README.md`, Linux `xdg-open`, Windows `notepad`) und nennst genau die Zeile und den neuen Text. Traut sie sich das nicht zu oder ändert sich nichts, machst du es selbst und zeigst ihr die Änderung mit `git diff`. Der erste Eintrag bleibt klein, auch wenn die Person schon Inhalte nennt: Auf dem Weg Webseite entsteht die Seite erst im festen Ablauf, mit Plan, Entwurf, Bau und Freigabe. Ihre Inhalte merkst du dir für den Grundriss. Dann zusammen:

```bash
git status                     # Was hat sich geändert?
git add README.md              # Genau diese Datei aufnehmen
git diff --cached              # Was kommt ins Logbuch?
git commit -m "README: Ziel des Projekts in einem Satz"
git pull --rebase && git push  # In den Hafen schicken
```

Gute Notizen sagen was und warum, in unter 60 Zeichen: «Kontakt: Telefonnummer ergänzt». Schlecht: «update», «fix», «diverses».

Noch ein zweiter Eintrag, damit es sitzt. Danach im Browser zeigen: `https://code.aufwind.sh/{name}/projekt`. Beide Einträge liegen im Hafen.

### 4. Das Logbuch auf dem Server

**Mit Light** gibt es keinen Server: Der Push ist schon die Auslieferung. Albatros zeigt den Ordner `seite/` aus `main` unter `https://{name}.aufwind.sh`, nach etwa 30 Sekunden. Fehlt `seite/`, nimmt Albatros `public/` und sonst das ganze Repo, darum bleibt die Seite in `seite/`. Höchstens 100 MB, Verknüpfungen (Symlinks) zeigt Albatros nie. Bevor du sagst, dass die Änderung im Netz ist, schaust du selbst nach, alle 15 Sekunden, höchstens drei Minuten: `curl -s https://{name}.aufwind.sh | grep -F "<neuer Text>"`. Dann öffnest du die Seite für die Person. Weiter mit Schritt 5.

**Mit Pilot:** Dein Server hat eine eigene Kopie in `~/projekt`. Albatros hat sie beim Einrichten angelegt, mit einem Lese-Schlüssel nur für deinen Hafen. Bringt das Logbuch das Fliessband mit (`.github/workflows/deploy.yml`), holt es bei jedem Push die neuen Einträge selbst (Skill `pipeline`). Prüfen:

```bash
ssh {name}@aufwind.sh 'git -C ~/projekt log --oneline -3'
```

Fehlen die neuen Einträge, holst du sie von Hand: `ssh {name}@aufwind.sh 'git -C ~/projekt pull --ff-only'`. Fehlt der Ordner ganz: `ssh {name}@aufwind.sh 'git clone git@aufwind.sh:{name}/projekt.git ~/projekt'`.

### 5. Mission prüfen

`mission_pruefen` mit `flugschule-04-git-logbuch`. Die Prüfung schaut, ob das Logbuch mindestens zwei Einträge auf `main` hat: mit Pilot in `~/projekt` auf dem Server, mit Light im Hafen.

## Logbuch ohne Hafen

Ein Logbuch braucht keinen Hafen, um anzufangen, und bis zur Freigabe ist das der einzige Weg. Auf dem Weg Webseite entsteht es beim Bau auf dem Computer (Skill `webseite-bauen`), lange bevor die Seite einen Wohnort hat; auf dem Weg Geschäft schon bei den ersten Methoden, wenn sie «ins Logbuch» sagen. Gibt es im Projektordner noch keines (`git status` meldet «not a git repository»), legst du es an:

```bash
git init -b main                         # einmal, im Projektordner
git add .gitignore docs design           # die eigenen Dateien und Ordner mit Namen
git commit -m "Idee: Projektname, Satz und Skizze"
```

Fehlt `.gitignore`, legst du sie vorher an, mindestens mit `.env`, `.env.*`, `!.env.example`, `node_modules/` und `dist/`. Danach kommt jeder fertige Schritt als eigener Eintrag dazu, nach den drei Regeln oben.

**Kein Push vor der Freigabe.** Bis die Person ihre Seite freigegeben hat (`Freigegeben:` mit Datum in `docs/prd.md`) und ihr sie live schaltet (P13, Skill `lancieren`, Abschnitt «Live schalten»), geht nichts in den Hafen: kein `git clone` aus dem Hafen, kein `git remote add`, kein `git push`. Das gilt auf beiden Wegen, auch wenn im Hafen schon die Vorlage liegt. Mit Light ist jeder Push sofort im Netz, mit Pilot bringt ihn das Fliessband auf den Server: Was im Hafen liegt, kann online sein, bevor die Person Ja gesagt hat.

Solange es keinen Hafen gibt, liegt das Logbuch nur auf diesem Computer. Fällt er ins Wasser, ist es weg: Dann braucht es eine zweite Kopie, zum Beispiel ein privates Repo (Skill `betrieb`, Sicherung).

**Erst beim Live schalten den Hafen verbinden** (Skill `lancieren`), nach der Freigabe: ohne neu zu klonen und ohne Dateien zu kopieren, sonst gehen die Einträge vom Bau verloren.

- **Hafen von Albatros:** Dort liegt seit dem Wohnort die Vorlage, ein Eintrag mit eigenem Anfang. Du verbindest den Hafen als `origin` und nimmst die Vorlage einmal ins Logbuch auf. Wo beide dieselbe Datei haben, bleibt die eigene (`-X ours`):
  ```bash
  git remote add origin git@aufwind.sh:{name}/projekt.git
  git fetch origin
  git merge origin/main --allow-unrelated-histories -X ours -m "Vorlage aus dem Hafen übernommen"
  git push -u origin main
  ```
  Gibt es schon ein `origin` (`git remote -v`), nimmst du für den Hafen einen anderen Namen, zum Beispiel `hafen`.
- **Ein leeres Repo bei GitHub** (Wohnort «selbst»): `gh repo create <repo> --private --source . --remote origin --push`. Da ist nichts zusammenzuführen.

Auch hier gilt: nie `git push --force`. Wird der Push abgelehnt, zuerst zusammenführen wie oben.

## Wenn es hakt

- **`Permission denied (publickey)` beim Hafen:** Das Schloss ist nicht hinterlegt, oder der Eintrag in `~/.ssh/config` fehlt (Skill `ssh-schluessel`).
- **Push abgelehnt (`rejected`):** Im Hafen liegt ein neuerer Eintrag. `git pull --rebase`, dann `git push`.
- **Konflikt beim Rebase:** Zwei Einträge haben die gleiche Zeile geändert. In der Datei zwischen `<<<<<<<` und `>>>>>>>` gemeinsam entscheiden, was bleibt, dann `git add <datei>`, `git rebase --continue`, `git push`.
- **Fremde offene Änderungen in `git status`:** nicht anfassen, nicht mitnehmen. Nur die eigenen Dateien aufnehmen.
- **Geheimnis im Logbuch gelandet:** Löschen reicht nicht, es bleibt in den alten Einträgen. Sofort Skill `sicherheit`: das Geheimnis beim Anbieter neu erzeugen.
- **Zurück zu einem früheren Stand einer Datei:** `git log --oneline <datei>` zeigt die Einträge, `git restore --source <eintrag> <datei>` holt sie zurück. Danach ein neuer Eintrag.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «das Logbuch an Bord, mit einer Kopie im Hafen», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
