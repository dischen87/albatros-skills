#!/usr/bin/env bash
# Eine fertige Seite aus dem Hafen, wie nach git clone: docs/ mit den Regeln, Termine als Daten
set -euo pipefail
echo "scaffold cwd: $PWD" >> "${TMPDIR:-/tmp}/albatros-eval-scaffold.log"
mkdir -p docs web/src/data web/src/styles web/src/pages seite
cat > docs/designsystem.md <<'MD'
# Designsystem: Musikverein Testdorf
Richtung «Dorfplatz»: herzlich, festlich, lebendig.
- Farben: --farbe-grund #fdf8f0, --farbe-text #1f2a44 (Kontrast 13.1 : 1), --farbe-aktion #b8860b (nur für Anklickbares), --farbe-gold #c9a227
- Schrift: --schrift-titel "Fraunces", --schrift-text "Source Sans 3"; Grössen --gross-1 bis --gross-5
- Abstände --abstand-1 bis --abstand-6, Radien --radius-klein, --radius-gross
- Komponenten: Knopf (aktion), Terminkarte (grund, radius-gross, Datum fett), Kopf, Fuss
MD
cat > docs/stack.md <<'MD'
# Tech-Stack
**Entscheid:** Astro, statisch
**Warum:** Texte, Termine und Kontakt, keine Anmeldung
**JavaScript:** höchstens 50 KB je Seite, zurzeit keins
MD
cat > docs/prd.md <<'MD'
# PRD: Musikverein Testdorf
**Seiten:** Start, Mitspielen, Termine, Über uns, Kontakt, Impressum, Datenschutz
## Abnahmekriterien
### Termine
- [x] Jahreskonzert: Samstag, 13. März 2027, 20 Uhr, Mehrzweckhalle Testdorf (geprüft am Handy)
- [x] Probe jeden Donnerstag, 20 Uhr, Schulhaus Testdorf
### Für alle Seiten
- [x] Handy 390 px, Kontrast, Tastatur, Impressum und Datenschutz, Lighthouse ≥ 90
Abgenommen: 2026-10-29 von Musikverein Testdorf
Freigegeben: 2026-10-29 von Musikverein Testdorf
MD
cat > web/src/data/termine.json <<'JSON'
[
  { "titel": "Jahreskonzert", "datum": "2027-03-13", "zeit": "20:00", "ort": "Mehrzweckhalle Testdorf", "eintritt": "frei, Kollekte" }
]
JSON
cat > web/src/styles/tokens.css <<'CSS'
:root { --farbe-grund: #fdf8f0; --farbe-text: #1f2a44; --farbe-aktion: #b8860b; --farbe-gold: #c9a227; --radius-gross: 1rem; }
CSS
cat > web/src/pages/termine.astro <<'ASTRO'
---
import termine from '../data/termine.json';
---
<h1>Termine</h1>
{termine.map((t) => <article class="terminkarte"><strong>{t.datum}, {t.zeit}</strong> {t.titel}, {t.ort}</article>)}
ASTRO
