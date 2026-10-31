---
type: regex
target:
  source: file
  path: docs/projekt.md
flags: m
---

^(?=[\s\S]*^Projektname:)(?=[\s\S]*^In einem Satz:)(?=[\s\S]*^Für wen:)(?=[\s\S]*^Hauptsache:)(?=[\s\S]*^Erfolg:)(?=[\s\S]*^Bestehende Seite:)(?=[\s\S]*^Modus:)(?=[\s\S]*^Stand:)(?=[\s\S]*^Nächster Schritt:)
