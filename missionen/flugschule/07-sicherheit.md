---
id: flugschule-07-sicherheit
weg: flugschule
stufe: fliegen
titel: Den Schlüssel nicht unter die Fussmatte
bild: Schlüsselbund, Fenster und Schlösser im eigenen Haus
dauer: 30
pruefung:
  - typ: datei
    pfad: ~/projekt/.gitignore
    enthaelt: .env
skill: sicherheit
video: geheimnisse-in-60-sekunden
---

## Worum es geht

Ein Haus ist so sicher wie sein nachlässigster Moment: ein Schlüssel unter der Fussmatte, ein offenes Fenster, ein altes Schloss. Bei deinem Projekt heissen diese Dinge Geheimnisse (Passwörter, Zugangsschlüssel), offene Türen und fehlende Updates. Du räumst sie auf, bevor jemand anderes sie findet.

## Was du lernst

- warum Geheimnisse nie ins Logbuch gehören, auch nicht für einen Moment
- wo sie stattdessen liegen: in einer `.env` auf dem Server, die nie ins Logbuch kommt
- welche Türen offen sein müssen und welche nicht
- wie Updates deine Schlösser frisch halten

## So gehst du vor

1. Mit deiner KI prüfen, ob schon ein Geheimnis im Logbuch gelandet ist.
2. `.env` in die Liste der Dinge setzen, die Git ignoriert.
3. Geheimnisse an den richtigen Ort verschieben. Was schon öffentlich war, wird ausgetauscht.
4. Den Sicherheits-Rundgang auf dem Server machen.

## Geschafft, wenn

- die Datei `~/projekt/.gitignore` auf deinem Server `.env` enthält.
