---
type: regex
target:
  source: file
  path: docs/plan.md
match: not_contains
flags: m
---

^Release:[^\n\[]*\b20\d\d\b
