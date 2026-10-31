---
type: regex
target:
  source: file
  path: docs/plan.md
flags: mi
---

^(?=[\s\S]*^Funktionen:[^\n]*anfrag)(?=[\s\S]*^Zugang:[^\n]*(?:kein|nein|alle|öffentlich))(?=[\s\S]*^Sprachen:[^\n]*Deutsch)
