---
id: flugschule-06-zurueck-auf-gestern
weg: flugschule
stufe: fliegen
titel: Kaputt machen erlaubt
bild: Das tägliche Foto der ganzen Wohnung
dauer: 20
pruefung:
  - typ: docker
    container: webseite
  - typ: http
    url: https://{name}.aufwind.sh
skill: zurueck-auf-gestern
video: snapshot-in-60-sekunden
---

## Worum es geht

Jede Nacht wird deine ganze Wohnung fotografiert. Geht etwas schief, holst du sie zurück, so wie sie auf dem Foto war. Das Fachwort ist Snapshot. In dieser Mission machst du deine Seite absichtlich kaputt und reparierst sie wieder. Danach hast du keine Angst mehr vor Fehlern.

## Was du lernst

- was ein Snapshot ist und wann du selbst einen machst
- wie «Zurück auf gestern» funktioniert
- was dabei verloren geht und warum das Logbuch auf GitHub trotzdem wichtig bleibt

## So gehst du vor

1. Ein eigenes Foto machen.
2. Deine Seite absichtlich abschalten und im Browser sehen, dass sie weg ist.
3. Zurück auf das Foto.
4. Die Seite ist wieder da.

## Geschafft, wenn

- der Container `webseite` wieder läuft
- und `https://{name}.aufwind.sh` wieder antwortet.
