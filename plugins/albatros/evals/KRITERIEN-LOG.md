# Kriterien-Log

Jede Änderung an den Kriterien der Evals steht hier mit Datum, Fall und Grund: an `fahrplan.yaml` (Pflichtfragen, Ergebnisse, Ja-Momente, Gates), an `GUTE-ANTWORT.md` und an den Gradern in `evals/*/graders/`. Kriterien ändern sich nur mit datierter Begründung und nur, um korrekte Ergebnisse anzunehmen, nie um einen Fehler festzuschreiben.

Neue Einträge kommen unten dazu, die Zeilen darüber bleiben. `bun scripts/gute-antwort.ts` übernimmt sie in `GUTE-ANTWORT.md` (Abschnitt «Änderungen»), `bun scripts/pruefen.ts` prüft Form und Reihenfolge. Fall: der Ordner des Eval-Falls, oder `alle`.

| Datum | Fall | Änderung | Grund |
|---|---|---|---|
| 2026-10-31 | alle | Fahrplan-Fassung 2: Phasen P1 bis P13 mit Pflichtfragen (wer antwortet), Ergebnissen mit Pflichtzeilen, Gates, drei Ja-Momenten (P4, P8, P10) und 19 Insel-Schritten; `GUTE-ANTWORT.md` wird daraus erzeugt. | Plan «Fahrplan und Lernschleife», Fassung 2 nach der Gegenprüfung (albatros/docs/plan-fahrplan.md): Was eine gute Antwort ist, soll an einer Stelle festgelegt und messbar sein, statt über 42 Grader verstreut. |
