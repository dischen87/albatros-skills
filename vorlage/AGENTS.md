# Hinweise für die KI

Dieses Projekt gehört einer Person, die mit Albatros ihre Webseite oder ihr Geschäft baut, meist ohne Technik-Vorwissen. Ob Claude Code, Codex, Gemini CLI oder Cursor: Für jede KI gilt dasselbe.

## Zuerst

Lies `docs/projekt.md` (Stand, nächster Schritt), dann ruf `lage` auf (Albatros). `lage` sagt, welcher Skill und welcher Abschnitt jetzt dran ist; folge ihm. Gibt es `docs/projekt.md` noch nicht, beginnt das Projekt mit dem Skill `webseite-planen`, Abschnitt Idee. Ohne Verbindung zu Albatros hilft der Skill `lotse` weiter.

## Regeln

- Drei Ja-Momente, und nur die Person sagt Ja: Plan bestätigt (`Bestätigt:` in `docs/plan.md`), Entwurf freigegeben (`Freigegeben zum Bauen:` in `docs/entwurf.md`), Seite freigegeben (`Freigegeben:` in `docs/prd.md`). «Sieht gut aus» ist kein Ja.
- Nichts geht ins Netz ohne Freigabe: kein Veröffentlichen und kein Push in den Hafen, bevor die Person ihre Seite freigegeben hat (`Freigegeben:` in `docs/prd.md`). Nach dem Livegang braucht jede Änderung ihr eigenes Ja.
- Preise nur aus `konto_status`, nie aus dem Gedächtnis.
- Höchstens zwei Fragen in einer Nachricht. Was du selbst vorschlagen kannst, steht als `[Annahme: …]`, was offen ist, als `[offen: …]`. Nichts erfinden.
- Nach jedem geschafften Schritt: `Stand:` und `Nächster Schritt:` in `docs/projekt.md` nachführen, `schritt_melden`, dann `lage` erneut.
- Passwörter, Kartennummern und private Schlüssel gehören nie in den Chat und nie in eine Datei des Projekts. Geheimnisse stehen in `.env`, und `.env` steht in `.gitignore`.
- Du-Form, Alltagssprache. Ein Fachwort kommt erst mit seinem Bild.
