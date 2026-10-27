---
name: git-logbuch
description: 'Erklärt Git einer Person ohne Vorwissen mit dem Bild vom Logbuch an Bord und der Kopie im Hafen (GitHub). Legt das Repo an, führt durch die ersten Einträge (Commit) mit guten Notizen, schickt sie in den Hafen (Push) und holt das Logbuch auf den Albatros-Server nach ~/projekt, mit einem eigenen Lese-Schlüssel des Servers. Regeln: nur auf main, nur eigene Dateien einzeln aufnehmen, nie force-push. Nutze den Skill bei «Git», «GitHub», «commit», «push», «pull», «Repo», «was ist ein Repository», «meine Änderungen sichern», «push abgelehnt», «Konflikt», und bevor du für die Person etwas committest.'
---

# Git: das Logbuch an Bord, mit einer Kopie im Hafen

## Das Bild

Auf jedem Schiff gibt es ein Logbuch. Jeder Eintrag sagt: wer, wann, was und warum. Wenn etwas schiefgeht, blättert man zurück und sieht, wo es anfing.

- **Repo:** das Logbuch deines Projekts, mit allen Dateien darin.
- **Commit:** ein Eintrag. Er hält einen kleinen, fertigen Schritt fest, mit einer Notiz in einem Satz.
- **GitHub:** der Hafen. Dort liegt eine Kopie des Logbuchs. Fällt dein Computer ins Wasser, ist nichts verloren.
- **Push:** die neuen Einträge in den Hafen schicken. **Pull:** die neusten Einträge aus dem Hafen holen.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form. Die Wörter Commit, Push und Pull erst nach dem Bild, dann immer zusammen mit ihm.
- Das GitHub-Konto und die Anmeldung macht die Person selbst im Browser.
- Du committest nie etwas, das die Person nicht kennt. Vor jedem Eintrag zeigst du, was hineinkommt.

## Die drei Regeln

1. **Nur auf `main`.** Ein Logbuch, eine Linie. Zweige sind etwas für später und grosse Umbauten.
2. **Nur eigene Dateien, einzeln aufnehmen:** `git add <datei>`. Nie `git add .`, `git add -A` oder `git commit -a`. Die fegen halbfertige Arbeit und Geheimnisse wie `.env` mit ins Logbuch.
3. **Nie `git push --force`.** Wird ein Push abgelehnt, zuerst `git pull --rebase`, dann nochmals `git push`.

## Ablauf

### 1. Werkzeuge und Konto

- `git --version` zeigt, ob Git da ist. Am Mac fragt der Computer beim ersten Aufruf, ob er die Entwicklerwerkzeuge installieren soll. Ja.
- GitHub-Konto: Die Person legt es auf github.com an.
- `gh` (GitHub im Terminal): `gh --version`. Fehlt es, installieren (Mac: `brew install gh`), dann `gh auth login`. Die Anmeldung läuft im Browser.
- Einmal den Namen fürs Logbuch setzen:
  ```bash
  git config --global user.name "Vorname Nachname"
  git config --global user.email "die-adresse@bei-github"
  ```

### 2. Das Logbuch anlegen

Nennt `konto_status` eine Albatros-Vorlage, nimm sie, sonst ein leeres Repo:

```bash
gh repo create <projektname> --private --clone --template <vorlage>   # mit Vorlage
gh repo create <projektname> --private --clone --add-readme           # ohne Vorlage
cd <projektname>
```

Privat, weil später auch Arbeitsnotizen in `docs/` liegen. Danach eine `.gitignore` prüfen oder anlegen, mindestens mit diesen Zeilen: `.env`, `.env.*`, `!.env.example`, `node_modules/`, `dist/`.

### 3. Der erste Eintrag

Die Person ändert selbst etwas Kleines, z. B. eine Zeile im `README.md`. Dann zusammen:

```bash
git status                     # Was hat sich geändert?
git add README.md              # Genau diese Datei aufnehmen
git diff --cached              # Was kommt ins Logbuch?
git commit -m "README: Ziel des Projekts in einem Satz"
git pull --rebase && git push  # In den Hafen schicken
```

Gute Notizen sagen was und warum, in unter 60 Zeichen: «Kontakt: Telefonnummer ergänzt». Schlecht: «update», «fix», «diverses».

Noch ein zweiter Eintrag, damit es sitzt. Danach auf github.com zeigen: Beide Einträge liegen im Hafen.

### 4. Das Logbuch auf den Server holen

Damit das Fliessband (Skill `pipeline`) später liefern kann, bekommt der Server eine eigene Kopie in `~/projekt`. Bild: Der Server hat seinen eigenen Hausschlüssel, aber nur für das Lesezimmer im Hafen. Albatros hat ihn beim Einrichten schon gemacht (`~/.ssh/github`). Du baust nur noch das passende Schloss bei GitHub ein:

```bash
ssh {name}@aufwind.sh 'cat ~/.ssh/github.pub' > server-schloss.pub
gh repo deploy-key add server-schloss.pub --title "albatros-server"   # nur lesen, das ist der Standard
rm server-schloss.pub
```

Der Hausschlüssel des Servers bleibt auf dem Server. Zu GitHub geht nur das Schloss. Dann das Logbuch auf den Server holen:

```bash
ssh {name}@aufwind.sh 'git clone git@github.com:<benutzer>/<projektname>.git ~/projekt'
```

Fehlt `~/.ssh/github` auf dem Server (ältere Einrichtung), macht ihn `ssh {name}@aufwind.sh 'ssh-keygen -t ed25519 -f ~/.ssh/github -N ""'`, und in `~/.ssh/config` auf dem Server gehört ein Eintrag `Host github.com` mit `IdentityFile ~/.ssh/github`.

### 5. Mission prüfen

`mission_pruefen` mit `flugschule-04-git-logbuch`. Die Prüfung schaut, ob `~/projekt` auf dem Server ein Git-Repo mit mindestens zwei Einträgen auf `main` ist.

## Wenn es hakt

- **Push abgelehnt (`rejected`):** Im Hafen liegt ein neuerer Eintrag. `git pull --rebase`, dann `git push`.
- **Konflikt beim Rebase:** Zwei Einträge haben die gleiche Zeile geändert. In der Datei zwischen `<<<<<<<` und `>>>>>>>` gemeinsam entscheiden, was bleibt, dann `git add <datei>`, `git rebase --continue`, `git push`.
- **Fremde offene Änderungen in `git status`:** nicht anfassen, nicht mitnehmen. Nur die eigenen Dateien aufnehmen.
- **Geheimnis im Logbuch gelandet:** Löschen reicht nicht, es bleibt in den alten Einträgen. Sofort Skill `sicherheit`: das Geheimnis beim Anbieter neu erzeugen.
- **Zurück zu einem früheren Stand einer Datei:** `git log --oneline <datei>` zeigt die Einträge, `git restore --source <eintrag> <datei>` holt sie zurück. Danach ein neuer Eintrag.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «das Logbuch an Bord, mit einer Kopie im Hafen», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
