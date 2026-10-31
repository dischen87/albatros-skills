---
type: regex
target:
  source: file
  path: docs/betrieb.md
flags: m
---

^(?=[\s\S]*^Rückmeldungen:)(?=[\s\S]*^Überwachung:)(?=[\s\S]*^Sicherung:)(?=[\s\S]*^Eingang:)(?=[\s\S]*^Statistik:)
