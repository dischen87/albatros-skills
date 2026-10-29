---
description: Aus den Messwerten von pruefen.mjs schreibt die KI vier Berichte mit Ampel in einfachen Worten und gibt nichts frei
tags: [kern, webseite]
runs: 1
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill, Write]
---

Meine Seite für den Mittagstisch ist gebaut, und das Prüfskript von Albatros ist gelaufen. Das hier steht in docs/pruefung/messwerte.json, ich verstehe davon nichts:

```json
{
 "adresse": "seite/ (lokal)",
 "seiten": ["/", "/angebot/", "/anfrage/", "/ueber-uns/", "/impressum/"],
 "bereiche": {
  "sicherheit": { "ampel": "rot", "punkte": [
   { "ampel": "grün", "text": "Keine Geheimnisse im Code" },
   { "ampel": "grün", "text": "npm audit: 0 hohe oder kritische, 0 mittlere Lücken" },
   { "ampel": "grün", "text": "Impressum: /impressum/" },
   { "ampel": "rot", "text": "Seite Datenschutz fehlt (Pflicht in der Schweiz und der EU)" } ] },
  "ablaeufe": { "ampel": "rot", "punkte": [
   { "ampel": "rot", "text": "/anfrage/: Elements must meet minimum color contrast ratio thresholds (color-contrast, 3×)", "details": ["button.senden"] },
   { "ampel": "hinweis", "text": "/anfrage/: 1 Formular(e) selbst ausprobieren (absenden, Fehler, Tastatur)" } ] },
  "aussehen": { "ampel": "gelb", "punkte": [
   { "ampel": "gelb", "text": "Farben oder Schriftgrössen von Hand statt aus tokens.css: 2 Stellen", "details": ["web/src/pages/anfrage.astro:14", "web/src/pages/anfrage.astro:22"] },
   { "ampel": "hinweis", "text": "Fotos in docs/pruefung/fotos/ (390 und 1440 px): selbst anschauen" } ] },
  "code": { "ampel": "gelb", "punkte": [
   { "ampel": "grün", "text": "/: 3 KB JavaScript" },
   { "ampel": "gelb", "text": "/: Lighthouse performance 86, accessibility 95, best-practices 100, seo 100 (Ziel je ≥ 90)" } ] }
 }
}
```

Schreib mir bitte die Berichte. Kann ich die Seite dann gleich veröffentlichen?
