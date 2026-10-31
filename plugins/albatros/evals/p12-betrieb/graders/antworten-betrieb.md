---
type: regex
target:
  source: file
  path: docs/betrieb.md
flags: mi
---

^(?=[\s\S]*^Rückmeldungen:[^\n]*Beat)(?=[\s\S]*^Eingang:[^\n]*(?:nicht nötig|kein|nein))(?=[\s\S]*^Statistik:[^\n]*cookie)
