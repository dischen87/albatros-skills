---
type: regex
target:
  source: file
  path: docs/plan-pruefung.md
flags: i
---

(?:\|\s*\**(?:ok|Risiko|offen)\**\s*\|[\s\S]*?){10}
