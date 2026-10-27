---
name: ssh-schluessel
description: 'Erklärt einer Person ohne Vorwissen den SSH-Schlüssel mit dem Bild von Hausschlüssel und Schloss, erzeugt das Schlüsselpaar lokal auf ihrem Computer, hinterlegt nur den öffentlichen Teil bei Albatros und testet den ersten Besuch auf dem Server. Nutze den Skill bei «SSH-Schlüssel», «ssh-keygen», «ich komme nicht auf meinen Server», «Permission denied (publickey)», «was ist ein public key», «neuer Computer», und als Schritt 4 von /albatros:start.'
---

# SSH-Schlüssel: Hausschlüssel und Schloss

## Das Bild

Ein SSH-Schlüssel ist ein Paar:

- **Der Hausschlüssel** (privater Schlüssel) bleibt immer bei dir, auf deinem Computer. Niemand sonst bekommt ihn, auch Albatros nicht, auch ich nicht.
- **Das Schloss** (öffentlicher Schlüssel) darfst du überall einbauen lassen. Wer das Schloss sieht, kann damit nichts öffnen.

Wir bauen dein Schloss in die Tür deines Servers ein. Danach kommt nur hinein, wer den passenden Hausschlüssel hat: du. Ein Passwort brauchst du dafür nicht.

Erklär das Bild, bevor du einen Befehl ausführst. Die Wörter «privater» und «öffentlicher Schlüssel» nennst du erst danach, und dann immer zusammen mit dem Bild.

## Harte Regeln

- Der private Schlüssel verlässt den Computer nie. Du liest ihn nicht, zeigst ihn nicht an, kopierst ihn nicht und lädst ihn nirgends hoch, auch nicht auf Wunsch. Wenn die Person ihn in den Chat kopieren will: freundlich stoppen und erklären, warum.
- Hochgeladen wird nur die Datei, die auf `.pub` endet (pub wie public, öffentlich). Prüf vor dem Hochladen, dass der Inhalt mit `ssh-ed25519 ` beginnt und aus einer einzigen Zeile besteht.
- Bestehende Schlüssel überschreibst du nie. `ssh-keygen` fragt vor dem Überschreiben nach, aber du wählst ohnehin einen eigenen Dateinamen.

## Ablauf

### 1. Gibt es schon einen Albatros-Schlüssel?

```bash
ls ~/.ssh/albatros.pub 2>/dev/null && echo "schon da" || echo "noch keiner"
```

Ist er schon da, nimm ihn und geh zu Schritt 3.

### 2. Schlüssel erzeugen (lokal)

Sag vorher: «Jetzt stellt dein Computer einen neuen Hausschlüssel und das passende Schloss her. Beides landet im versteckten Ordner `.ssh` in deinem Benutzerordner.»

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "albatros" -f ~/.ssh/albatros -N ""
```

- `-t ed25519`: eine moderne, sichere Art von Schlüssel.
- `-f ~/.ssh/albatros`: der Name. Es entstehen zwei Dateien: `albatros` (Hausschlüssel) und `albatros.pub` (Schloss).
- `-N ""`: ohne Zusatzpasswort. So kann ich den Befehl für dich ausführen. Wer ein Extra-Schloss am Schlüsselbund will, tippt später selbst in einem eigenen Terminal-Fenster `ssh-keygen -p -f ~/.ssh/albatros` und vergibt eine Passphrase. Die tippst du nie in den Chat.

Windows: Der gleiche Befehl funktioniert in PowerShell, nur ohne `mkdir`/`chmod`-Zeile. Der Ordner heisst dort `$HOME\.ssh`.

### 3. Nur das Schloss hochladen

```bash
cat ~/.ssh/albatros.pub
```

Zeig der Person die Zeile und sag: «Das ist dein Schloss. Das darf jede Person sehen.» Gib genau diese Zeile an das Albatros-Werkzeug `schluessel_hinterlegen`.

Fehlt das Werkzeug (Albatros noch nicht verbunden): Folge zuerst Schritt 1 im Skill `start`. Alternativ kann die Person die Zeile im Cockpit auf albatros.build unter «Schlüssel» einfügen.

### 4. Dem Computer sagen, welcher Schlüssel zu welcher Tür gehört

Frag, ob du einen Eintrag in `~/.ssh/config` ergänzen darfst. Bild: ein Zettel am Schlüsselbund «dieser Schlüssel gehört zu aufwind.sh». Nur anhängen, nichts löschen:

```bash
cat >> ~/.ssh/config <<'EOF'

Host aufwind.sh
  IdentityFile ~/.ssh/albatros
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

### 5. Erster Besuch

Lass die Person diesen Befehl selbst tippen (in Claude Code mit `!` davor):

```bash
ssh {name}@aufwind.sh
```

`{name}` ist der Name ihres Servers (steht in `konto_status`). Beim allerersten Mal fragt der Computer: «Are you sure you want to continue connecting?» Bild: Der Server zeigt seinen Ausweis. Der Fingerabdruck steht im Cockpit. Stimmt er, tippt die Person `yes`.

Drinnen: `echo "Ich war hier" > ~/hallo.txt`, dann `exit`. Das ist ihr erster Fussabdruck auf dem eigenen Server.

Wenn du selbst testen musst (dein Terminal ist nicht interaktiv):

```bash
ssh -o StrictHostKeyChecking=accept-new {name}@aufwind.sh 'echo "Ich war hier" > ~/hallo.txt && cat ~/hallo.txt'
```

### 6. Mission prüfen

`mission_pruefen` mit `flugschule-02-ssh-schluessel`. Die Prüfung schaut, ob `~/hallo.txt` auf dem Server liegt.

## Wenn es hakt

- **`Permission denied (publickey)`**: Das Schloss passt nicht zur Tür. Prüf der Reihe nach: Ist der Server-Name richtig? Wurde das Schloss hochgeladen (`konto_status`)? Steht der Eintrag in `~/.ssh/config`? Test mit `ssh -v {name}@aufwind.sh` und such nach der Zeile «Offering public key».
- **Neuer Computer:** neuer Hausschlüssel auf dem neuen Computer, Schloss zusätzlich hochladen. Den alten Hausschlüssel nie per Mail oder Stick kopieren.
- **Computer verloren oder gestohlen:** Das alte Schloss sofort im Cockpit entfernen. Das ist, als würdest du den Schliesszylinder auswechseln.
- **`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED`**: Der Ausweis des Servers ist anders als beim letzten Mal. Nicht einfach wegklicken. Fingerabdruck im Cockpit vergleichen. Erst wenn er stimmt, die alte Zeile mit `ssh-keygen -R aufwind.sh` entfernen.
