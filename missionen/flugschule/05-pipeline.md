---
id: flugschule-05-pipeline
weg: flugschule
stufe: fliegen
titel: Das Fliessband für deine Seite
bild: Fliessband mit Qualitätskontrolle
dauer: 60
abo: pilot
pruefung:
  - typ: workflow
    datei: .github/workflows/deploy.yml
  - typ: docker
    container: webseite
  - typ: http
    url: https://{name}.aufwind.sh
skill: pipeline
video: ci-cd-in-60-sekunden
---

## Worum es geht

Statt jede Änderung von Hand auf den Server zu tragen, baust du ein Fliessband. Du legst eine Änderung ins Logbuch, und das Fliessband übernimmt: prüfen, bauen, ausliefern. Fällt die Qualitätskontrolle durch, bleibt die alte Seite stehen. Das Fachwort dafür ist CI/CD.

## Was du lernst

- was ein Workflow ist und wann er startet
- wie die Qualitätskontrolle Fehler abfängt, bevor sie jemand sieht
- wer am Fliessband arbeitet: ein Arbeiter (Runner), der auf deinem eigenen Server wohnt
- was passiert, wenn etwas schiefgeht

## So gehst du vor

1. Die Workflow-Datei in deinem Repo anschauen und verstehen, Schritt für Schritt.
2. Den Arbeiter auf deinem Server kennenlernen: Er nimmt jede Änderung an, baut sie und liefert sie aus.
3. Eine kleine Änderung pushen und zuschauen, wie das Fliessband läuft.
4. Absichtlich einen Fehler pushen und sehen, wie die Kontrolle ihn stoppt.

## Geschafft, wenn

- der letzte Lauf von `.github/workflows/deploy.yml` im Hafen grün ist,
- auf deinem Server der Container `webseite` läuft
- und `https://{name}.aufwind.sh` antwortet.
