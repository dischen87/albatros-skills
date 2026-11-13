---
name: projekt-planen
description: "Plant ein Webseitenprojekt mit Albatros, liest den gespeicherten Projektstand und hält bestätigte Schritte fest. Nutze den Skill für Albatros-Projektplanung oder die Frage nach dem nächsten Projektschritt."
metadata:
  stand: 0.3.3
---

# Projekt mit Albatros planen

Antworte in der Sprache der Person, einfach und mit höchstens zwei offenen Fragen je Nachricht. Nutze nur die hier beigepackte Anleitung.

## Verbinden und fortsetzen

Lies mit `konto_status` und `lage` den tatsächlichen Projektstand. Für `lage` kannst du `skills_stand` aus metadata.stand und `projekt: projekt` senden. Sende nur knappe, ausdrücklich für dieses Projekt freigegebene Belege aus Ergebnisdateien; keine Gesprächsverläufe oder Zugangsdaten. Wenn die Verbindung fehlt, lasse die Person die Anmeldung beim Plugin im Browser öffnen. Frage nie nach Passwort, privaten Schlüsseln oder Anmeldecodes. Bei einem Fehler plane lokal weiter und kennzeichne den gespeicherten Stand als unbekannt.

Wähle mit der Person `webseite` oder `geschaeft`; speichere nur ihre Wahl mit `weg_waehlen`. Speichere `lernen` oder `machen` mit `modus_waehlen`, wenn sie diesen Modus gewählt hat und das Werkzeug verfügbar ist. Eine Geschäftsidee wird hier als Projektbriefing behandelt.

## Vom Briefing zum geprüften lokalen Prototyp

Arbeite an der tatsächlichen offenen Phase P1 bis P10 aus `lage`, ohne frühere Schritte als erledigt zu erfinden:

- P1: Projektname, Ziel in einem Satz, Zielgruppe und ein beobachtbares Erfolgskriterium festhalten. Unbekanntes als offene Frage kennzeichnen.
- P2: vorhandene Inhalte, Quellen und Vorbilder sammeln. Recherche nur aus zugänglichen Quellen und klar von Annahmen trennen.
- P3: benötigte Seiten, Funktionen, Sprachen und Abnahmekriterien als kleinen Plan formulieren.
- P4: den Plan mit der Person prüfen. Widersprüche und offene Entscheidungen zeigen und ihr Ja zum Plan festhalten.
- P5: Ton, visuelle Richtung und vorhandenes Material beschreiben; mit Text und vorhandenen Dateien arbeiten.
- P6: ein kleines Designsystem mit Schrift, Farben, Abständen und einer Beispielseite entwerfen; die Person die Richtung wählen lassen.
- P7: die ganze Webseite als Entwurf anlegen und gegen Seitenplan und Designsystem prüfen.
- P8: den gewählten Entwurf zeigen und das ausdrückliche Ja zur Umsetzung festhalten. Noch nicht ohne dieses Ja bauen.
- P9: den freigegebenen Entwurf nur auf Auftrag und in einer Umgebung mit Dateibearbeitung lokal umsetzen. Inhalte, Links, schmale und breite Ansichten, Tastaturbedienung, Formulare und Abnahmekriterien prüfen. Im normalen Chat Plan und Übergabe vorbereiten. Gemessene Ergebnisse von offenen Prüfungen unterscheiden.
- P10: Befunde beheben, die Ergebnisse zeigen und die Person den lokalen Prototyp freigeben lassen.

Im Chat liefere ein kurzes Briefing, die Seitenliste, die gewählte Richtung, offene Fragen und den nächsten Schritt. Wenn lokale Dateien beauftragt sind, halte dieselben Ergebnisse in den passenden Projektdateien fest und nenne deren Ort. Veröffentlichungen gehören nicht zu diesem Ablauf. Bei P11 oder höher erkläre neutral, dass der dokumentierte Projektstand ausserhalb dieses Planungsumfangs liegt.

## Fortschritt und Lernen

`schritt_melden` speichert nur einen tatsächlich erledigten und von der Person bestätigten Schritt. Übernimm den Schrittwert aus dem Werkzeug-Schema oder dem Projektstand, nicht aus einer Vermutung; verwende `projekt: projekt`. Nur wenn das Schema `titel` anbietet, sende den bestätigten Projektnamen mit höchstens 80 Zeichen. Wiederhole dieselbe Meldung nicht. Lies danach `lage` erneut.

`mission_holen` zeigt die aktuelle Aufgabe als strukturierte Übersicht. Verwende `mission_pruefen` nur für deren tatsächliche ID und erst wenn die Person die Prüfung beauftragt. Ein fehlgeschlagener Test bleibt offen. `verstanden_melden` ist nur nach einer eigenen Antwort oder Handlung der Person zulässig, mit der tatsächlichen Missions-ID und passender `art`. Fehlende Werkzeuge oder ein ausgeschöpfter Umfang werden erklärt; wechsle dafür nicht zu einem anderen Server.

Support bei Problemen mit dieser Verbindung: mathias@albatrospartner.ch. Eine Nachricht darf nur auf ausdrücklichen Auftrag der Person gesendet werden.
