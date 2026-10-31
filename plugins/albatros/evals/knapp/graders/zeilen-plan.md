---
type: regex
target:
  source: file
  path: docs/plan.md
flags: m
---

^(?=[\s\S]*^Projektname:)(?=[\s\S]*^Seiten:)(?=[\s\S]*^Funktionen:)(?=[\s\S]*^Zugang:)(?=[\s\S]*^Sprachen:)(?=[\s\S]*^Setup:)(?=[\s\S]*^Testing:)(?=[\s\S]*^Release:)(?=[\s\S]*^Pflege:)(?=[\s\S]*^Stand:)
