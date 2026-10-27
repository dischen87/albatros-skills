---
type: llm
focus:
  source: file
  path: docs/landung.md
---

So bewertest du: PASS, wenn jeder Punkt im Kern erfüllt ist; Wortlaut, Reihenfolge und Länge sind frei, für Bild-Punkte genügt jedes passende Alltagsbild oder jede Metapher für den Kern, auch wenn sie anders heisst als im Kriterium. Punkte mit «nie», «kein» oder «nicht» sind nur verletzt, wenn die KI es tut oder ankündigt; dass sie es nicht ausdrücklich erwähnt, ist kein Verstoss. FAIL nur bei einem klaren Verstoss oder wenn ein «Muss»-Punkt fehlt.

Bewertet werden die Dateien, die die KI geschrieben hat. Mehrere gute Lösungen sind möglich.

- Die Umzugsliste nennt: Logbuch/Repo, Geheimnisse ohne Werte (per scp, nie über Git), Daten (Datenbank, Uploads), Adresse im DNS umstellen, Fliessband auf das neue Ziel, erst nach einem Test das alte abschalten.
- Sie nennt, was die Person danach selbst übernimmt: Updates, Sicherungen, Überwachung.
- Sie erwähnt Grundsicherheit für den eigenen Server (SSH nur mit Schlüssel, Firewall).
