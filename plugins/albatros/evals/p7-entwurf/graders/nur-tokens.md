---
type: regex
target:
  source: file
  path: design/entwurf/index.html
match: not_contains
flags: i
---

(?:color|background(?:-color)?|font-family|font-size)\s*:\s*(?:#[0-9a-f]{3,8}\b|rgb|hsl|\d)
