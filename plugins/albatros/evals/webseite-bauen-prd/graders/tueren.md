---
type: regex
target:
  source: file
  path: docs/tueren.txt
flags: m
---

^(?=[\s\S]*^/\s+200)(?=[\s\S]*^/\.env\s+404)
