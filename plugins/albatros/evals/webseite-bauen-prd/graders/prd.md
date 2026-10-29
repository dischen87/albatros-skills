---
type: llm
focus:
  source: file
  path: docs/prd.md
---

So bewertest du: PASS, wenn jeder Punkt im Kern erfüllt ist; Wortlaut, Reihenfolge und Länge sind frei. Punkte mit «nie», «kein» oder «nicht» sind nur verletzt, wenn die KI es tut oder ankündigt. FAIL nur bei einem klaren Verstoss oder wenn ein «Muss»-Punkt fehlt.

Bewertet wird der Bauplan (PRD).

- Muss: Es gibt Abnahmekriterien als Checkliste (`- [ ]`), je Seite und für das Anfrage-Formular.
- Muss: Die Kriterien sind prüfbar (man sieht oder misst, ob sie stimmen), nicht «schön» oder «modern».
- Muss: Für alle Seiten sind abgedeckt: Handy um 390 px, Kontrast, Tastatur, Impressum und Datenschutz, Tempo (Lighthouse oder JavaScript-Budget).
- Das Formular-Kriterium sagt, wohin die Anfrage geht (mittagstisch@example.ch) oder wie man prüft, dass sie ankommt.
- Die Abnahme ist noch nicht eingetragen: kein Datum mit Namen hinter «Abgenommen:», keine Zeile «Freigegeben:» mit Datum.
