// Astro-Integration für den Arbeitsplatz von Albatros (Bert lokal). Wirkt nur bei `astro dev`, und nur, wenn die Umgebung die Adresse des
// Arbeitsplatzes nennt (ARBEITSPLATZ_URL, http://127.0.0.1:<port>): Startet der Arbeitsplatz den Dev-Server selbst (Werkzeug
// vorschau_starten), setzt er sie. Dann lädt jede Seite das Vorschau-Skript des Arbeitsplatzes, aber nur, wenn sie im iframe des
// Arbeitsplatzes steckt: So kann die Person in der Vorschau auf eine Stelle zeigen und Text direkt tippen.
// Ohne ARBEITSPLATZ_URL fügt sie nichts ein. Sie liest und schreibt keine Dateien (auch nicht in .albatros/), ausser nach dem Bau (unten).
// Seit Korrekturrunde P (15.11.2026): Nennt Albatros den Ordner design/ des Projekts (ALBATROS_DESIGN_ORDNER), darf der Dev-Server auch dort lesen
// (die selbst gehosteten Schriften aus design/tokens.css; vorher 403 und Ersatzschrift in der Vorschau), sonst nur im Ordner der Seite.
// Nach `astro build` nimmt sie Astros Hilfsdateien (content-assets.mjs, content-modules.mjs, data-store.json, collections/*.schema.json) aus dem
// Ordner der gebauten Seite: Mit outDir '../seite' legt Astro 5 sie dorthin, und ins Netz gehören sie nicht.
// Astro markiert im Dev-Modus jedes Element mit seiner Quelle (data-astro-source-file, data-astro-source-loc), entfernt die Angaben im Browser
// aber wieder (Werkzeugleiste, App «Audit»), bevor das Vorschau-Skript geladen ist (gemessen mit Astro 7.4.7). Darum kopiert ein kleines
// Skript im Kopf der Seite sie vorher in eigene Angaben (data-albatros-source-file, -loc), die das Vorschau-Skript liest.
// Im fertigen Bau (astro build) und auf der Seite im Netz ist nichts vom Vorschau-Skript enthalten.
// Liegt in <projekt>/werkzeuge/ (Skill webseite-bauen). Einbinden in <projekt>/web/astro.config.mjs:
//   import albatrosVorschau from '../werkzeuge/albatros-vorschau.mjs';
//   export default defineConfig({ outDir: '../seite', integrations: [albatrosVorschau()] });

import { readdirSync, rmSync, rmdirSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LOKAL = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/;
const HILFSDATEIEN = ['content-assets.mjs', 'content-modules.mjs', 'data-store.json', 'content.d.ts', 'types.d.ts'];

// Ordner design/ des Projekts, nur wenn Albatros ihn nennt (absolut, endet auf design)
function designOrdner() {
  const d = process.env.ALBATROS_DESIGN_ORDNER;
  return d && isAbsolute(d) && /[\\/]design$/.test(d) ? d : null;
}

// Astros Hilfsdateien aus dem Ordner der gebauten Seite nehmen (nur genau diese Namen, collections/ nur mit *.schema.json und nur, wenn er danach leer ist)
function hilfsdateienWeg(ordner) {
  for (const n of HILFSDATEIEN) rmSync(join(ordner, n), { force: true });
  const c = join(ordner, 'collections');
  let rest;
  try { rest = readdirSync(c); } catch { return; }
  for (const n of rest) if (n.endsWith('.schema.json')) rmSync(join(c, n), { force: true });
  try { if (!readdirSync(c).length) rmdirSync(c); } catch { /* bleibt */ }
}

// Adresse des Arbeitsplatzes, nur auf diesem Computer
function arbeitsplatzUrl() {
  const url = process.env.ARBEITSPLATZ_URL;
  return url && LOKAL.test(url) ? url : null;
}

// Läuft im Kopf, bevor Module (auch die Werkzeugleiste von Astro) laufen: «interactive» kommt vor den aufgeschobenen Skripten
const QUELLE_SICHERN = `if (window.parent !== window) {
  const sichern = () => {
    for (const el of document.querySelectorAll('[data-astro-source-file]')) {
      el.setAttribute('data-albatros-source-file', el.getAttribute('data-astro-source-file'));
      el.setAttribute('data-albatros-source-loc', el.getAttribute('data-astro-source-loc') || '');
    }
  };
  document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') sichern(); });
  document.addEventListener('astro:after-swap', sichern);
}`;

export default function albatrosVorschau() {
  return {
    name: 'albatros-vorschau',
    hooks: {
      'astro:config:setup': ({ command, config, injectScript, updateConfig }) => {
        if (command !== 'dev') return;
        const url = arbeitsplatzUrl();
        if (!url) return;
        const design = designOrdner();
        if (design) updateConfig({ vite: { server: { fs: { allow: [fileURLToPath(config.root), design] } } } });
        injectScript('head-inline', QUELLE_SICHERN);
        injectScript('page', `if (window.parent !== window) { const s = document.createElement('script'); s.src = ${JSON.stringify(`${url}/vorschau.js`)}; document.head.appendChild(s); }`);
      },
      'astro:build:done': ({ dir }) => {
        hilfsdateienWeg(fileURLToPath(dir));
      },
    },
  };
}
