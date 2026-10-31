---
type: regex
target:
  source: file
  path: docs/konzept.md
flags: m
---

^(?=[\s\S]*^Kern:[^\n]*\[Annahme)(?=[\s\S]*^Bildsprache:[^\n]*\[Annahme)
