---
type: regex
target:
  source: file
  path: docs/konzept.md
flags: mi
---

^(?=[\s\S]*^Name:[^\n]*Sonnenhof Merligen)(?=[\s\S]*^Ton:[^\n]*\bdu\b)(?=[\s\S]*^Charakter:[^\n]*herzlich[^\n]*ruhig[^\n]*l(?:ä|ae)ndlich)(?=[\s\S]*^Muss bleiben:[^\n]*nichts)
