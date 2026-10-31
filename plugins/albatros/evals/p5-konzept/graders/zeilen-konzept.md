---
type: regex
target:
  source: file
  path: docs/konzept.md
flags: m
---

^(?=[\s\S]*^Name:)(?=[\s\S]*^Kern:)(?=[\s\S]*^Ton:)(?=[\s\S]*^Charakter:)(?=[\s\S]*^Maskottchen:)(?=[\s\S]*^Muss bleiben:)(?=[\s\S]*^Bildsprache:)
