---
id: geschaeft-06-go-live-check
weg: geschaeft
stufe: fliegen
titel: Vor dem Start einmal ums Flugzeug
bild: Die Vorflugkontrolle am echten Flugzeug, mit laufendem Flugschreiber
dauer: 90
pruefung:
  - typ: datei
    pfad: ~/projekt/docs/go-live-check.md
  - typ: http
    url: https://{name}.aufwind.sh
    status: 200
skill: go-live-check
video: go-live-check-in-60-sekunden
---

## Worum es geht

Vor jedem Start geht die Pilotin einmal ums Flugzeug und hakt eine feste Liste ab, am echten Flugzeug, nicht im Handbuch. Genauso prüfst du deine Seite, bevor die Flyer gedruckt sind. Und der Flugschreiber, deine Statistik, läuft schon beim Start.

## Was du lernst

- am laufenden Angebot prüfen statt im Code oder aus der Erinnerung
- was ein Blocker ist und was nach dem Start warten darf
- warum du die ersten Besucher später nicht nachmessen kannst
- wie du nach jeder Korrektur siehst, dass sie wirklich stimmt

## So gehst du vor

1. Mit deiner KI die Checkliste am echten Angebot durchgehen.
2. Formular, Mails und, falls vorhanden, die Kasse selbst ausprobieren.
3. Jeden Befund einordnen: Blocker, erste Tage, erste Woche oder später.
4. Die Blocker beheben und jeden einzeln nachprüfen.
5. Ein paar Tage nach dem Start nochmals durchgehen.

## Geschafft, wenn

- `docs/go-live-check.md` mit Kurzfassung und Befunden auf deinem Server liegt.
- deine Seite unter `https://{name}.aufwind.sh` antwortet.
