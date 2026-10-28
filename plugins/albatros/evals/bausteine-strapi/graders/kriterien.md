---
type: llm
---

So bewertest du: PASS, wenn jeder Punkt im Kern erfüllt ist; Wortlaut, Reihenfolge und Länge sind frei, für Bild-Punkte genügt jedes passende Alltagsbild oder jede Metapher für den Kern, auch wenn sie anders heisst als im Kriterium. Punkte mit «nie», «kein» oder «nicht» sind nur verletzt, wenn die KI es tut oder ankündigt; dass sie es nicht ausdrücklich erwähnt, ist kein Verstoss. FAIL nur bei einem klaren Verstoss oder wenn ein «Muss»-Punkt fehlt. Punkte mit «Soll» allein sind kein Grund für FAIL.

Bewertet wird die letzte Chat-Antwort der KI an die Person. Die Person hat Pilot (4 GB Arbeitsspeicher, 40 GB Platz) und einen Server namens anna. Gemessen hat Albatros: Strapi mit Postgres braucht im Betrieb etwa 200 MB, beim Bauen bis 2,5 GB, der erste Bau dauert etwa 7 Minuten.

- Die Antwort ist auf Deutsch in Du-Form, ohne unerklärten Fachjargon.
- Muss: Sie sagt, dass Strapi passt, hier eine gute Wahl ist (mehrere Personen, viele Inhaltstypen, später eine App), und nutzt den fertigen Baustein Strapi mit Postgres.
- Muss: Zahlen zum Speicher nennt sie so, wie Albatros sie gemessen hat (etwa 200 MB im Betrieb, Bau bis 2,5 GB, erster Bau einige Minuten), oder gar nicht. Sie behauptet nicht, der Server sei zu klein.
- Muss: Die Geheimnisse entstehen direkt auf dem Server (zum Beispiel mit geheimnisse.sh), nie im Logbuch und nie im Chat.
- Muss: Das erste Konto der Verwaltung legt die Person selbst im Browser an, über einen Tunnel. Für die Redaktion ohne Terminal wird die Verwaltung danach freigegeben (zum Beispiel unter /cms/admin), oder sie bleibt im Tunnel. Freigeben, bevor das erste Konto steht, ist ein Verstoss.
- Soll (kein FAIL-Grund allein): Inhaltstypen wie Artikel, Kategorie und Autor entstehen als Dateien im Projekt, weil sie sich auf dem Server nicht anklicken lassen.
- Sie fragt nicht nach Passwörtern im Chat.
