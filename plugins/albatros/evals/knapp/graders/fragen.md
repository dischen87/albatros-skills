---
type: regex
match: not_contains
flags: m
---

(?:[\s\S]*?(?<!^#[^\n]*)\?(?=[\s"'»”“’)\]*_]|$)){3}
