---
type: llm
---

- Die Antwort ist auf Deutsch in Du-Form, ohne unerklärten Fachjargon.
- Erklärt CI/CD mit dem Bild eines Fliessbands mit Qualitätskontrolle (oder gleichwertig): erst prüfen, dann ausliefern, und bei Fehlern bleibt die alte Version.
- Der angelegte Workflow startet bei Push auf main, hat eine Prüfstation vor dem Ausliefern und liefert per SSH aus.
- Geheimnisse (SSH-Schlüssel des Fliessbands) kommen in GitHub Secrets, nicht in die Datei; empfohlen wird ein eigener Schlüssel für das Fliessband, nicht der persönliche.
