---
name: zurueck-auf-gestern
description: 'Erklärt Snapshots mit dem Bild vom täglichen Foto der ganzen Wohnung, macht vor riskanten Änderungen ein eigenes Foto und holt den Server mit «Zurück auf gestern» wieder her. Enthält die Übung «absichtlich kaputt machen und reparieren». Nutze den Skill bei «Snapshot», «Backup», «ich habe etwas gelöscht», «Seite ist kaputt», «Server geht nicht mehr», «rückgängig machen», «zurück auf gestern», und bevor du auf dem Server etwas Grosses umbaust.'
---

# Zurück auf gestern: das Foto der ganzen Wohnung

## Das Bild

Jede Nacht macht Albatros ein Foto deiner ganzen Wohnung: jedes Zimmer, jede Datei, jedes laufende Gerät. Die letzten sieben Fotos bleiben. Geht etwas schief, sagst du «mach die Wohnung wieder so wie auf diesem Foto», und sie ist es.

Das Fachwort dafür ist **Snapshot** (Schnappschuss).

Wichtig: Alles, was nach dem Foto dazugekommen ist, ist danach weg. Darum ist das Logbuch im Hafen so wertvoll (Skill `git-logbuch`): Dort liegt eine Kopie deiner Arbeit ausserhalb der Wohnung. Das Zurückholen der Wohnung lässt den Hafen in Ruhe.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

**Fotos des Servers gibt es nur mit Pilot.** Mit Light gibt es keinen Server, zurück geht es über das Logbuch: `git log --oneline` zeigt die Einträge, `git revert <eintrag>` nimmt einen Eintrag als neuen Eintrag zurück, dann `git push`. Kurz danach ist die alte Seite wieder online. Nie `git push --force`.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, ruhig, kurze Sätze. Wenn etwas kaputt ist, zuerst beruhigen: «Das lässt sich reparieren.» Dann erst handeln.

## Vor einem grossen Umbau: eigenes Foto

Bevor du auf dem Server etwas Grosses machst (Pakete installieren, Konfiguration ändern, Datenbank umbauen), schlag ein Foto vor: Werkzeug `snapshot` mit einem sprechenden Namen, z. B. `vor-cms-installation`. Kosten keine Zeit, ersparen viel Ärger.

Eigene Fotos: höchstens fünf, sie verfallen nach 30 Tagen. Namen, die mit `taeglich-` beginnen, sind für die nächtlichen Fotos reserviert.

## Zurückholen

1. **Erst schauen, was kaputt ist.** Manchmal reicht weniger als ein ganzes Foto: Ein gestoppter Container startet mit `docker start webseite`, eine geänderte Datei im Projekt kommt mit `git restore <datei>` zurück.
2. **Fotos anzeigen:** `snapshot` mit der Aktion «auflisten» (oder Cockpit, «Server», «Snapshots»). Mit der Person das richtige wählen: das letzte, auf dem noch alles ging.
3. **Warnen, was verloren geht:** «Alles, was du nach <Zeitpunkt> auf dem Server geändert hast, ist danach weg, auch alle Fotos, die neuer sind als dieses. Was schon im Hafen liegt, bleibt.» Hat die Person ungesicherte Arbeit auf dem Server, zuerst diese sichern (`git push` oder Datei auf den eigenen Computer kopieren mit `scp {name}@aufwind.sh:~/datei .`).
4. **Erst nach einem klaren Ja:** `zurueck` mit dem Namen des Fotos. Der Server startet neu, das dauert etwa eine Minute.
5. **Prüfen:** Seite im Browser öffnen, `docker ps` auf dem Server.

## Übung: absichtlich kaputt machen

Diese Übung ist die Mission. Sie nimmt die Angst vor Fehlern.

1. Foto machen: `snapshot` mit Namen `vor-der-uebung`.
2. Seite im Browser öffnen: `https://{name}.aufwind.sh`. Sie läuft.
3. Kaputt machen (die Person tippt selbst):
   ```bash
   ssh {name}@aufwind.sh 'docker rm -f webseite'
   ```
   Seite neu laden: Sie ist weg. Kurz spüren lassen, dass das in Ordnung ist.
4. `zurueck` auf `vor-der-uebung`.
5. Seite neu laden: Sie ist wieder da.
6. `mission_pruefen` mit `flugschule-06-zurueck-auf-gestern`. Die Prüfung schaut, ob die Seite antwortet und der Container `webseite` läuft.

## Was Snapshots nicht sind

- Kein Ersatz für das Logbuch im Hafen und auf deinem Computer. Fotos liegen im gleichen Haus wie die Wohnung.
- Kein Schutz für den eigenen Computer der Person. Dort gilt: Arbeit regelmässig pushen.
- Kein Archiv für immer. Nach sieben Tagen ist ein Foto weg. Was länger bleiben soll, gehört ins Logbuch.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «das Foto der ganzen Wohnung», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
