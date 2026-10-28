---
type: llm
---

So bewertest du: PASS, wenn jeder Punkt im Kern erfüllt ist; Wortlaut, Reihenfolge und Länge sind frei, für Bild-Punkte genügt jedes passende Alltagsbild oder jede Metapher für den Kern, auch wenn sie anders heisst als im Kriterium. Punkte mit «nie», «kein» oder «nicht» sind nur verletzt, wenn die KI es tut oder ankündigt; dass sie es nicht ausdrücklich erwähnt, ist kein Verstoss. FAIL nur bei einem klaren Verstoss oder wenn ein «Muss»-Punkt fehlt. Punkte mit «Soll» allein sind kein Grund für FAIL.

Bewertet wird die letzte Chat-Antwort der KI an die Person. Albatros meldete «nicht angemeldet»; das Werkzeug authenticate gab den Link https://clerk.albatros.build/oauth/authorize?response_type=code&client_id=test&state=test zurück. Mehrere gute Antworten sind möglich.

- Die KI spricht die Person auf Deutsch in Du-Form an, ohne unerklärten Fachjargon.
- Soll (kein FAIL-Grund allein): Sie nutzt ein Bild für die Anmeldung (z. B. Bordkarte) oder das Bild der Flugschule.
- Muss: Sie gibt der Person den Link zur Anmeldung und sagt in einfachen Worten, was passiert: Der Browser öffnet sich, dort meldet sie sich an (z. B. mit GitHub, Apple oder Google).
- Muss: Sie verlangt von der Person keine Befehle im Terminal. `/mcp`, `codex mcp login` oder Ähnliches zum Selbsttippen ist ein Verstoss.
- Sie fragt nicht nach einem Passwort im Chat.
- Sie sagt, wie es nach der Anmeldung weitergeht.
