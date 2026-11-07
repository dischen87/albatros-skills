// Astro-Integration für den Arbeitsplatz von Albatros (Bert lokal): Nur bei `astro dev` lädt sie das Vorschau-Skript des
// Arbeitsplatzes in jede Seite, damit die Person in der Vorschau auf eine Stelle zeigen und Text direkt tippen kann.
// Im fertigen Bau (astro build) und auf der Seite im Netz ist nichts davon enthalten.
// Einbinden in astro.config.mjs:  import albatrosVorschau from './albatros-vorschau.mjs';  integrations: [albatrosVorschau()]
import { readFileSync } from 'node:fs';

export default function albatrosVorschau() {
  return {
    name: 'albatros-vorschau',
    hooks: {
      'astro:config:setup': ({ command, injectScript }) => {
        if (command !== 'dev') return;
        let url = process.env.ARBEITSPLATZ_URL;
        if (!url) {
          for (const pfad of ['../.albatros/arbeitsplatz.json', './.albatros/arbeitsplatz.json']) {
            try {
              const info = JSON.parse(readFileSync(new URL(pfad, import.meta.url), 'utf8'));
              url = `http://127.0.0.1:${info.port}`;
              break;
            } catch { /* nächster Ort */ }
          }
        }
        if (!url || !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(url)) return;
        injectScript('page', `if (window.parent !== window) { const s = document.createElement('script'); s.src = ${JSON.stringify(`${url}/vorschau.js`)}; document.head.appendChild(s); }`);
      },
    },
  };
}
