---
type: regex
target:
  source: file
  path: docs/plan.md
flags: m
---

^(?=[\s\S]*^Seiten:[^\n]*\[Annahme)(?=[\s\S]*^Setup:[^\n]*\[Annahme)(?=[\s\S]*^Testing:[^\n]*\[Annahme)
