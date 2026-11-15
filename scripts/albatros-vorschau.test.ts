// Integration albatros-vorschau (Skill webseite-bauen), Korrekturrunde P (15.11.2026, echter Durchgang 4): Nach `astro build` nimmt sie Astros Hilfsdateien
// aus dem Ordner der gebauten Seite (mit outDir '../seite' legt Astro 5 sie dorthin; gemessen mit Astro 5.18 am aufgezeichneten Projekt), und nur wenn
// Albatros den Ordner design/ nennt, darf der Dev-Server dort lesen (Schriften aus design/tokens.css; gemessen: vorher 403, danach 200).
import { afterAll, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import albatrosVorschau from '../plugins/albatros/skills/webseite-bauen/albatros-vorschau.mjs';

const ordner: string[] = [];
afterAll(() => { for (const o of ordner) rmSync(o, { recursive: true, force: true }); });

test('alle Kopien der Integration sind gleich (vier Sprachen und die Vorlage)', () => {
  const de = readFileSync('plugins/albatros/skills/webseite-bauen/albatros-vorschau.mjs', 'utf8');
  for (const p of ['plugins/albatros-en', 'plugins/albatros-fr', 'plugins/albatros-it']) expect(readFileSync(`${p}/skills/webseite-bauen/albatros-vorschau.mjs`, 'utf8')).toBe(de);
  expect(readFileSync('vorlage/werkzeuge/albatros-vorschau.mjs', 'utf8')).toBe(de);
});

test('nach dem Bau: genau Astros Hilfsdateien weg, die Seite und andere Dateien bleiben', () => {
  const seite = mkdtempSync(join(tmpdir(), 'vorschau-bau-'));
  ordner.push(seite);
  const d = (p: string, inhalt = 'x') => { mkdirSync(join(seite, p, '..'), { recursive: true }); writeFileSync(join(seite, p), inhalt); };
  for (const p of ['index.html', 'blog/index.html', 'content-assets.mjs', 'content-modules.mjs', 'data-store.json', 'collections/blog.schema.json', 'collections/eigene.txt', 'sitemap.xml']) d(p);
  const hooks = albatrosVorschau().hooks as Record<string, (x: unknown) => void>;
  hooks['astro:build:done']!({ dir: pathToFileURL(`${seite}/`) });
  const da = (p: string) => existsSync(join(seite, p));
  expect(['index.html', 'blog/index.html', 'sitemap.xml', 'collections/eigene.txt'].every(da)).toBe(true);
  expect(['content-assets.mjs', 'content-modules.mjs', 'data-store.json', 'collections/blog.schema.json'].some(da)).toBe(false);
  // Ein Ordner collections nur mit Schemas verschwindet ganz
  rmSync(join(seite, 'collections/eigene.txt'));
  d('collections/tipps.schema.json');
  hooks['astro:build:done']!({ dir: pathToFileURL(`${seite}/`) });
  expect(da('collections')).toBe(false);
});

test('Dev-Server: Ordner design/ nur, wenn Albatros ihn nennt (absolut, endet auf design), und nur mit ARBEITSPLATZ_URL', () => {
  const alt = { url: process.env.ARBEITSPLATZ_URL, design: process.env.ALBATROS_DESIGN_ORDNER };
  const lauf = () => {
    const vite: unknown[] = [];
    const hooks = albatrosVorschau().hooks as Record<string, (x: unknown) => void>;
    hooks['astro:config:setup']!({ command: 'dev', config: { root: pathToFileURL('/projekt/web/') }, injectScript: () => {}, updateConfig: (c: unknown) => vite.push(c) });
    return vite;
  };
  try {
    process.env.ARBEITSPLATZ_URL = 'http://127.0.0.1:4747';
    process.env.ALBATROS_DESIGN_ORDNER = '/projekt/design';
    expect(lauf()).toEqual([{ vite: { server: { fs: { allow: ['/projekt/web/', '/projekt/design'] } } } }]);
    for (const falsch of ['design', '/projekt/geheim', '/projekt/design/../geheim']) {
      process.env.ALBATROS_DESIGN_ORDNER = falsch;
      expect([falsch, lauf()]).toEqual([falsch, []]);
    }
    delete process.env.ARBEITSPLATZ_URL;
    process.env.ALBATROS_DESIGN_ORDNER = '/projekt/design';
    expect(lauf()).toEqual([]);
  } finally {
    if (alt.url === undefined) delete process.env.ARBEITSPLATZ_URL; else process.env.ARBEITSPLATZ_URL = alt.url;
    if (alt.design === undefined) delete process.env.ALBATROS_DESIGN_ORDNER; else process.env.ALBATROS_DESIGN_ORDNER = alt.design;
  }
});
