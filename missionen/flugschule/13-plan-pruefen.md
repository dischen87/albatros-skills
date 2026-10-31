---
id: flugschule-13-plan-pruefen
weg: flugschule
stufe: abheben
phase: P4
titel: Die zweite Meinung zum Plan
bild: Die zweite Meinung vom Statiker, bevor gebaut wird
dauer: 20
pruefung:
  - typ: insel
    schritt: plan-geprueft
skill: webseite-planen
video: null
verstehen:
  - frage: Warum prüft deine KI deinen Plan in einem frischen Gespräch?
    kern: Wer den Plan geschrieben hat, sieht seine Lücken am schlechtesten. Ein frischer Blick ohne die Vorgeschichte findet, was der erste übersehen hat.
  - frage: Was heisst es, wenn ein Punkt der Prüfliste «Risiko» ist?
    kern: Der Plan geht so, aber an dieser Stelle kann es schiefgehen. Du entscheidest bewusst, ob ihr es ändert oder das Risiko tragt.
---

## Worum es geht

Bevor ein Haus gebaut wird, schaut eine Statikerin den Plan an. Sie hat ihn nicht gezeichnet und sieht darum, was dem Architekten entgangen ist. Deine KI macht dasselbe mit deinem Plan: In einem frischen Gespräch, das nur deine Unterlagen in `docs/` kennt, prüft sie ihn gegen eine feste Liste. Danach entscheidest du, ob der Plan so gilt.

## Was du lernst

- wer den Plan geschrieben hat, sieht seine Lücken am schlechtesten
- was auf der Prüfliste steht: eine Hauptsache, wenige Seiten, Abläufe mit Bestätigung und Fehler, Inhalte, Pflichten, Kosten, Datum
- ok, Risiko oder offen: drei ehrliche Antworten statt einer Note
- warum erst ein bestätigter Plan gestaltet wird

## So gehst du vor

1. Deine KI holt die zweite Meinung in einem frischen Gespräch, das nur `docs/` liest.
2. Jeder Punkt der Prüfliste bekommt ok, Risiko oder offen, mit der Stelle im Plan.
3. Deine KI zeigt dir die Punkte mit Risiko oder offen.
4. Du entscheidest: so lassen oder ändern. Erst nach deinem Ja steht im Plan «Bestätigt:» mit Datum.

Modernisierst du eine bestehende Seite, prüft die zweite Meinung auch, dass keine Funktion der alten Seite ohne Entscheid verloren geht.

## Geschafft, wenn

- in `docs/plan.md` deine Bestätigung mit Datum steht
- und auf deiner Insel der Schritt «Plan geprüft» erreicht ist.
