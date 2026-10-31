---
type: regex
target:
  source: file
  path: docs/recherche.md
match: not_contains
flags: mi
---

^Vorbilder:[^\n]*(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:ch|li|com|net|org|de|at|info|swiss)\b)
