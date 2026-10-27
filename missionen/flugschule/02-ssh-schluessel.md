---
id: flugschule-02-ssh-schluessel
weg: flugschule
stufe: fliegen
titel: Dein Hausschlüssel für den Server
bild: Hausschlüssel und Schloss
dauer: 20
pruefung:
  - typ: datei
    pfad: ~/hallo.txt
skill: ssh-schluessel
video: ssh-in-60-sekunden
---

## Worum es geht

Auf deinen Server kommst du nicht mit einem Passwort, sondern mit einem Schlüsselpaar. Den Hausschlüssel behältst du auf deinem Computer. Das passende Schloss bauen wir in die Tür deines Servers ein. Wer das Schloss sieht, kann damit nichts öffnen.

## Was du lernst

- was ein SSH-Schlüssel ist: Hausschlüssel (privat) und Schloss (öffentlich)
- warum nur das Schloss deinen Computer verlässt
- wie du mit `ssh` die Tür zu deinem Server öffnest

## So gehst du vor

1. Deine KI erzeugt das Schlüsselpaar auf deinem Computer.
2. Du schaust dir das Schloss an (die Datei, die auf `.pub` endet). Nur das geht zu Albatros.
3. Du tippst selbst `ssh {name}@aufwind.sh` und bist zum ersten Mal auf deinem Server.
4. Du hinterlässt einen Fussabdruck: die Datei `hallo.txt`.

## Geschafft, wenn

- auf deinem Server die Datei `~/hallo.txt` liegt.
