// Astro-Integration für den Arbeitsplatz von Albatros (Bert lokal). Wirkt nur bei `astro dev`:
// 1. Sie lädt das Vorschau-Skript des Arbeitsplatzes in jede Seite, aber nur, wenn die Seite im iframe des Arbeitsplatzes steckt.
//    So kann die Person in der Vorschau auf eine Stelle zeigen und Text direkt tippen. Ohne laufenden Arbeitsplatz fügt sie nichts ein.
// 2. Sie schreibt beim Start .albatros/dev.json mit der Adresse des Dev-Servers (nur, wenn es den Ordner .albatros/ schon gibt), damit
//    der Arbeitsplatz die Vorschau auch auf einem anderen Port als 4321 findet, und löscht die Datei beim Beenden wieder.
//    .albatros/ hat eine eigene .gitignore mit «*»: nichts davon kommt ins Logbuch.
// Im fertigen Bau (astro build) und auf der Seite im Netz ist nichts davon enthalten.
// Liegt in <projekt>/werkzeuge/ (Skill webseite-bauen). Einbinden in <projekt>/web/astro.config.mjs:
//   import albatrosVorschau from '../werkzeuge/albatros-vorschau.mjs';
//   export default defineConfig({ outDir: '../seite', integrations: [albatrosVorschau()] });
import { existsSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';

const LOKAL = /^http:\/\/(127\.0\.0\.1|localhost):\d+$/;

// Ordner .albatros/ des Projekts: neben dieser Datei (Projektordner) oder eine Ebene höher (Datei in werkzeuge/ oder web/)
function albatrosOrdner() {
  for (const pfad of ['./.albatros/', '../.albatros/']) {
    const ordner = new URL(pfad, import.meta.url);
    if (existsSync(ordner)) return ordner;
  }
  return null;
}

// Adresse des laufenden Arbeitsplatzes: ARBEITSPLATZ_URL oder der Port aus .albatros/arbeitsplatz.json; nur auf diesem Computer
function arbeitsplatzUrl(ordner) {
  let url = process.env.ARBEITSPLATZ_URL;
  if (!url && ordner) {
    try {
      const info = JSON.parse(readFileSync(new URL('arbeitsplatz.json', ordner), 'utf8'));
      if (Number.isInteger(info.port)) url = `http://127.0.0.1:${info.port}`;
    } catch { /* Arbeitsplatz läuft nicht */ }
  }
  return url && LOKAL.test(url) ? url : null;
}

// Adresse, unter der der Dev-Server antwortet. Ohne --host hört Astro auf manchen Computern nur auf ::1 (gemessen mit Astro 7.4.7 auf
// macOS: 127.0.0.1 antwortet dann nicht), darum dort localhost.
function devUrl(address) {
  const host = address.address === '::1' || address.address === 'localhost' ? 'localhost' : '127.0.0.1';
  return `http://${host}:${address.port}`;
}

export default function albatrosVorschau() {
  let geschrieben = null;
  return {
    name: 'albatros-vorschau',
    hooks: {
      'astro:config:setup': ({ command, injectScript }) => {
        if (command !== 'dev') return;
        const url = arbeitsplatzUrl(albatrosOrdner());
        if (!url) return;
        injectScript('page', `if (window.parent !== window) { const s = document.createElement('script'); s.src = ${JSON.stringify(`${url}/vorschau.js`)}; document.head.appendChild(s); }`);
      },
      'astro:server:start': ({ address }) => {
        const ordner = albatrosOrdner();
        if (!ordner || !address?.port) return;
        const ziel = new URL('dev.json', ordner);
        const tmp = new URL(`dev.json.${process.pid}.tmp`, ordner);
        try {
          geschrieben = devUrl(address);
          writeFileSync(tmp, `${JSON.stringify({ url: geschrieben }, null, 2)}\n`);
          renameSync(tmp, ziel);
        } catch {
          geschrieben = null; // ohne dev.json sucht der Arbeitsplatz auf den üblichen Ports
        }
      },
      'astro:server:done': () => {
        const ordner = albatrosOrdner();
        if (!ordner || !geschrieben) return;
        const ziel = new URL('dev.json', ordner);
        try {
          if (JSON.parse(readFileSync(ziel, 'utf8')).url === geschrieben) rmSync(ziel, { force: true });
        } catch { /* schon weg */ }
      },
    },
  };
}
