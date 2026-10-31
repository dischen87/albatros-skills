---
type: regex
target:
  source: file
  path: docs/projekt.md
flags: mi
---

^(?=[\s\S]*^Projektname:[^\n]*Sonnenhof)(?=[\s\S]*^In einem Satz:[^\n]*Merligen)(?=[\s\S]*^Für wen:[^\n]*Familien)(?=[\s\S]*^Hauptsache:[^\n]*anfrag)(?=[\s\S]*^Bestehende Seite:[^\n]*(?:keine|nein))
