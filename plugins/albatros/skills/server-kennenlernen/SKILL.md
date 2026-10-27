---
name: server-kennenlernen
description: 'Rundgang durch den eigenen Albatros-Server für eine Person ohne Vorwissen. Erklärt Terminal, Ordner, Speicher, Arbeitsspeicher, laufende Programme und den Hauptschlüssel sudo mit Bildern aus einer Wohnung. Die Person tippt die ersten Befehle selbst. Nutze den Skill bei «was ist auf meinem Server», «wie bewege ich mich im Terminal», «was ist ein Ordner auf dem Server», «ls cd pwd», «wie viel Platz habe ich», «was läuft da», und nach dem ersten erfolgreichen SSH-Besuch.'
---

# Server kennenlernen: Rundgang durch die neue Wohnung

## Das Bild

Dein Server ist eine Wohnung in einem grossen Haus. Sie hat eine eigene Tür (dein SSH-Schloss), eigene Zimmer (Ordner) und eigene Geräte (Programme). Die Nachbarn sehen nicht hinein, und du siehst nicht zu ihnen.

Das Terminal ist die Gegensprechanlage: Du sagst einen kurzen Satz, die Wohnung antwortet.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurze Sätze, kein Fachjargon. Jeder Befehl bekommt zuerst sein Bild.
- Die Person tippt die Befehle dieses Rundgangs selbst (in Claude Code mit `!` davor, sonst in einem eigenen Terminal-Fenster nach `ssh {name}@aufwind.sh`). Du erklärst, was kommt, und liest danach mit ihr die Antwort.
- Höchstens ein neuer Begriff pro Schritt.

## Der Rundgang

Vorher: «Du kannst hier nichts für immer kaputt machen. Jede Nacht wird die ganze Wohnung fotografiert, und wir können auf gestern zurück.»

| Schritt | Befehl | Bild | Worauf achten |
|---|---|---|---|
| Wo stehe ich? | `pwd` | Der Zettel «Sie sind hier» am Stadtplan | `/home/pilot` ist der Flur deiner Wohnung, kurz `~` |
| Was liegt hier? | `ls -la` | Licht im Zimmer anmachen | Dateien mit Punkt vorne sind versteckt, z. B. `.ssh` |
| Ins Bordbuch schauen | `cat BORDBUCH.md` | Die Begrüssungsmappe auf dem Tisch | Hier steht, was zur Wohnung gehört |
| In ein Zimmer gehen | `cd projekt` und zurück mit `cd ~` | Durch eine Tür gehen | Gibt es den Ordner noch nicht: `mkdir projekt` baut ein neues Zimmer |
| Wie viel Platz? | `df -h /` | Der Keller: wie voll ist er? | Spalte «Avail» ist der freie Platz |
| Wie viel Arbeitsfläche? | `free -h` | Die Fläche auf dem Schreibtisch: Was gerade läuft, liegt dort | «available» ist frei. Ist sie fast voll, wird alles langsam |
| Was läuft gerade? | `docker ps` | Welche Geräte eingesteckt sind | Docker-Container sind wie Geräte mit Stecker: ein- und ausstecken, ohne die Wand aufzureissen |
| Wieder gehen | `exit` | Tür hinter dir zumachen | |

## Der Hauptschlüssel: sudo

Erst erklären, wenn ein Befehl «Permission denied» meldet oder `sudo` braucht. Bild: Mit `sudo` vor einem Befehl benutzt du den Hauptschlüssel des Hauswarts. Damit geht jede Tür auf, auch die zum Heizungsraum. Darum nur dann, wenn du genau weisst, was der Befehl tut. Du (der Agent) setzt `sudo` nie ohne ausdrückliches Ja der Person ein und nie mit `rm -rf`.

## Abschluss: der Rundgang-Zettel

Die Person schreibt drei Dinge auf, die sie entdeckt hat, in ihren eigenen Worten:

```bash
nano ~/rundgang.md
```

`nano` ist ein einfacher Notizblock im Terminal: Schreiben, dann `Ctrl+O` und Enter zum Speichern, `Ctrl+X` zum Verlassen. Lieber per Befehl? `echo "- ..." >> ~/rundgang.md`.

Dann `mission_pruefen` mit `flugschule-03-server-kennenlernen`. Die Prüfung schaut, ob `~/rundgang.md` existiert.

## Wenn es hakt

- **`command not found`**: Tippfehler oder das Gerät ist nicht installiert. Zuerst den Befehl genau vergleichen.
- **`No such file or directory`**: Du stehst im falschen Zimmer. `pwd` sagt, wo du bist.
- **Die Person fühlt sich überfordert:** Nimm nur `pwd`, `ls`, `cd` und `exit`. Der Rest kann warten, bis er gebraucht wird.
- **Etwas wurde gelöscht:** Skill `zurueck-auf-gestern`.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Rundgang durch die neue Wohnung», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
