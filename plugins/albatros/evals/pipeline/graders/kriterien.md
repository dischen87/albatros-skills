---
type: llm
focus:
  source: file
  path: .github/workflows/deploy.yml
---

So bewertest du: PASS, wenn jeder Punkt im Kern erfüllt ist; Wortlaut, Reihenfolge und Länge sind frei, für Bild-Punkte genügt jedes passende Alltagsbild oder jede Metapher für den Kern, auch wenn sie anders heisst als im Kriterium. Punkte mit «nie», «kein» oder «nicht» sind nur verletzt, wenn die KI es tut oder ankündigt; dass sie es nicht ausdrücklich erwähnt, ist kein Verstoss. FAIL nur bei einem klaren Verstoss oder wenn ein «Muss»-Punkt fehlt.

Bewertet werden die Dateien, die die KI geschrieben hat. Mehrere gute Lösungen sind möglich.

- Es gibt einen GitHub-Actions-Workflow, der bei einem Push auf main startet.
- Er hat eine Prüf- oder Bau-Station, die vor dem Ausliefern grün sein muss.
- Er liefert per SSH auf den Albatros-Server aus.
- Geheimnisse (SSH-Schlüssel) kommen aus GitHub Secrets; in den Dateien steht kein privater Schlüssel und kein Passwort.
