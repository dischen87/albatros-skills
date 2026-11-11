// Test für plugins/albatros/skills/seo-grundlagen/sichtbar-pruefen.mjs (bun test): eine gute gebaute Seite (alles grün) und je Punkt ein
// eingebauter Fehler, der genau diesen Punkt kippt. Die zwölf Namen sind dieselben wie in der Etappe «Sichtbar werden» des Cockpits
// (albatros apps/arbeitsplatz); ändert sich die Liste hier, ändert sie sich dort. Das Skript läuft mit Node, wie bei der Person.
import { afterAll, expect, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const wurzel = new URL('..', import.meta.url).pathname;
const SKRIPT = join(wurzel, 'plugins/albatros/skills/seo-grundlagen/sichtbar-pruefen.mjs');
const NODE = Bun.which('node') ?? process.execPath;
export const PUNKTE = ['titel', 'beschreibung', 'h1', 'bilder', 'sitemap', 'robots', 'kanonisch', 'strukturierte_daten', 'open_graph', 'llms_txt', 'gewicht', 'indexnow'];
const ADRESSE = 'https://velowerkstatt.example';
const SCHLUESSEL = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';

type Punkt = { name: string; ampel: string; text: string; details: string[] };
type Ergebnis = { adresse: string | null; seiten: number; punkte: Punkt[]; zusatz: Punkt[]; ergebnis: string };
const ordner: string[] = [];
afterAll(() => { for (const d of ordner) rmSync(d, { recursive: true, force: true }); });

const seite = (pfad: string, titel: string, beschreibung: string, inhalt: string, kopf = '') => `<!doctype html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel}</title>
<meta name="description" content="${beschreibung}">
<link rel="canonical" href="${ADRESSE}${pfad}">
<meta property="og:title" content="${titel}">
<meta property="og:description" content="${beschreibung}">
<meta property="og:image" content="${ADRESSE}/bilder/werkstatt.webp">
<meta property="og:url" content="${ADRESSE}${pfad}">
<link rel="stylesheet" href="/stil.css">
${kopf}</head>
<body>
<nav><a href="/">Start</a> <a href="/angebot/">Angebot</a> <a href="/kontakt/">Kontakt</a></nav>
<main>${inhalt}</main>
<footer><a href="/impressum/">Impressum</a></footer>
</body>
</html>
`;
const JSONLD = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'BikeStore', name: 'Velowerkstatt Länggasse', url: ADRESSE, telephone: '+41 31 000 00 00',
  address: { '@type': 'PostalAddress', streetAddress: 'Musterweg 1', postalCode: '3012', addressLocality: 'Bern', addressCountry: 'CH' },
})}</script>\n`;
const GUT: Record<string, string> = {
  'index.html': seite('/', 'Velo reparieren in der Länggasse Bern | Velowerkstatt', 'Wir reparieren dein Velo in der Länggasse in Bern, meist bis am nächsten Tag. Ohne Termin vorbeikommen.',
    '<h1>Velo reparieren in der Länggasse</h1><img src="/bilder/werkstatt.webp" alt="Die Werkstatt von der Strasse aus" width="1200" height="800">', JSONLD),
  'angebot/index.html': seite('/angebot/', 'Service und Reparaturen mit Preisen | Velowerkstatt', 'Kleiner Service, grosser Service und Reparaturen an jedem Velo, mit festen Preisen und einer Offerte vor der Arbeit.', '<h1>Angebot</h1>'),
  'kontakt/index.html': seite('/kontakt/', 'Adresse und Öffnungszeiten | Velowerkstatt Länggasse', 'Musterweg 1 in Bern, offen von Dienstag bis Samstag. Telefon, Mail und der Weg zur Werkstatt in der Länggasse.', '<h1>Kontakt</h1>'),
  'impressum/index.html': seite('/impressum/', 'Impressum der Velowerkstatt Länggasse', 'Wer hinter der Velowerkstatt Länggasse steht: Name, Adresse und Kontakt der verantwortlichen Person.', '<h1>Impressum</h1>'),
  '404.html': '<!doctype html><html><head><title>Nicht gefunden</title></head><body><h1>Nicht gefunden</h1><h1>Zweite</h1></body></html>',
  'googleabc123def4567890.html': 'google-site-verification: googleabc123def4567890.html',
  'stil.css': 'body { margin: 0; }',
  'bilder/werkstatt.webp': 'x'.repeat(2000),
  'sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/', '/angebot/', '/kontakt/', '/impressum/'].map((p) => `<url><loc>${ADRESSE}${p}</loc></url>`).join('')}</urlset>`,
  'robots.txt': `User-agent: *\nAllow: /\n\nSitemap: ${ADRESSE}/sitemap.xml\n`,
  'llms.txt': `# Velowerkstatt Länggasse\n\n> Veloreparaturen in der Länggasse in Bern, meist bis am nächsten Tag.\n\n## Seiten\n\n- [Angebot](${ADRESSE}/angebot/): Service und Reparaturen mit Preisen\n- [Kontakt](${ADRESSE}/kontakt/): Adresse und Öffnungszeiten\n`,
  [`${SCHLUESSEL}.txt`]: SCHLUESSEL,
};
const pruefe = (aendern: (d: Record<string, string>) => void = () => {}, ...args: string[]) => {
  const dateien = { ...GUT };
  aendern(dateien);
  const d = mkdtempSync(join(tmpdir(), 'sichtbar-'));
  ordner.push(d);
  for (const [f, t] of Object.entries(dateien)) {
    mkdirSync(dirname(join(d, 'seite', f)), { recursive: true });
    writeFileSync(join(d, 'seite', f), t);
  }
  const r = Bun.spawnSync([NODE, SKRIPT, d, '--json', ...args]);
  const e: Ergebnis = JSON.parse(r.stdout.toString());
  const ampeln = Object.fromEntries(e.punkte.map((p) => [p.name, p.ampel]));
  return { code: r.exitCode, e, ampeln, nicht: (ampel: string) => e.punkte.filter((p) => p.ampel !== ampel).map((p) => p.name), punkt: (n: string) => [...e.punkte, ...e.zusatz].find((p) => p.name === n)! };
};

test('die zwölf Punkte heissen wie im Cockpit, in dieser Reihenfolge', () => {
  expect(pruefe().e.punkte.map((p) => p.name)).toEqual(PUNKTE);
});

test('gut: alle zwölf Punkte grün, Exit 0; 404, Prüfdatei von Google zählen nicht als Seiten', () => {
  const r = pruefe();
  expect(r.nicht('grün')).toEqual([]);
  expect(r.e.zusatz.map((p) => p.ampel)).toEqual(['grün', 'grün']);
  expect([r.code, r.e.ergebnis, r.e.seiten, r.e.adresse]).toEqual([0, 'grün', 4, ADRESSE]);
});

// Je Punkt ein eingebauter Fehler: Genau dieser Punkt kippt, die elf anderen bleiben grün
const ohne = (d: Record<string, string>, f: string, muster: RegExp | string, neu = '') => { d[f] = d[f]!.replace(muster, neu); };
// name, Ampel, was, Änderung, Meldung, und welche anderen Punkte derselbe Fehler mit Recht auch trifft
const FEHLER: [string, string, string, (d: Record<string, string>) => void, string, string[]?][] = [
  ['titel', 'rot', 'ohne <title>', (d) => ohne(d, 'angebot/index.html', /<title>.*<\/title>/), 'Ohne <title>: /angebot/'],
  ['titel', 'gelb', 'zweimal derselbe', (d) => ohne(d, 'kontakt/index.html', /<title>.*<\/title>/, '<title>Impressum der Velowerkstatt Länggasse</title>'), 'Derselbe Titel'],
  ['beschreibung', 'rot', 'fehlt', (d) => ohne(d, 'index.html', /<meta name="description"[^>]*>/), 'Ohne <meta name="description">: /'],
  ['beschreibung', 'gelb', 'zu kurz', (d) => ohne(d, 'kontakt/index.html', /<meta name="description"[^>]*>/, '<meta name="description" content="Kontakt">'), '/kontakt/ (7 Zeichen)'],
  ['h1', 'rot', 'zwei h1', (d) => ohne(d, 'kontakt/index.html', '<h1>Kontakt</h1>', '<h1>Kontakt</h1><h1>Anfahrt</h1>'), '/kontakt/ (2)'],
  ['h1', 'rot', 'keine h1', (d) => ohne(d, 'angebot/index.html', '<h1>Angebot</h1>', '<h2>Angebot</h2>'), '/angebot/ (0)'],
  ['bilder', 'rot', 'ohne alt', (d) => ohne(d, 'index.html', ' alt="Die Werkstatt von der Strasse aus"'), 'Bild ohne alt'],
  ['bilder', 'gelb', 'ohne Masse', (d) => ohne(d, 'index.html', ' width="1200" height="800"'), 'ohne width und height'],
  ['sitemap', 'rot', 'fehlt', (d) => { delete d['sitemap.xml']; }, 'sitemap.xml fehlt', ['robots']],
  ['sitemap', 'rot', 'Adresse ohne https', (d) => ohne(d, 'sitemap.xml', `<loc>${ADRESSE}/kontakt/</loc>`, '<loc>/kontakt/</loc>'), 'mit https:// beginnen'],
  ['sitemap', 'gelb', 'eine Seite fehlt', (d) => ohne(d, 'sitemap.xml', `<url><loc>${ADRESSE}/kontakt/</loc></url>`), 'Nicht in der Sitemap: /kontakt/'],
  ['robots', 'rot', 'fehlt', (d) => { delete d['robots.txt']; }, 'robots.txt fehlt'],
  ['robots', 'rot', 'sperrt alle aus', (d) => { d['robots.txt'] = `User-agent: *\nDisallow: /\nSitemap: ${ADRESSE}/sitemap.xml\n`; }, 'sperrt alle aus'],
  ['robots', 'gelb', 'ohne Sitemap', (d) => { d['robots.txt'] = 'User-agent: *\nAllow: /\n'; }, 'nennt die Sitemap nicht'],
  ['kanonisch', 'rot', 'fehlt', (d) => ohne(d, 'angebot/index.html', /<link rel="canonical"[^>]*>/), 'Ohne <link rel="canonical">: /angebot/'],
  ['kanonisch', 'rot', 'andere Hauptadresse', (d) => ohne(d, 'angebot/index.html', `<link rel="canonical" href="${ADRESSE}`, '<link rel="canonical" href="https://www.velowerkstatt.example'), 'anderer Hauptadresse'],
  ['strukturierte_daten', 'rot', 'kein gültiges JSON', (d) => ohne(d, 'index.html', '"@type":"BikeStore",', '"@type":"BikeStore",,'), 'kein gültiges JSON'],
  ['strukturierte_daten', 'gelb', 'fehlen', (d) => ohne(d, 'index.html', JSONLD), 'Keine strukturierten Daten'],
  ['strukturierte_daten', 'gelb', 'eigene Sterne', (d) => ohne(d, 'index.html', '"name":"Velowerkstatt Länggasse",', '"name":"Velowerkstatt Länggasse","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"212"},'), 'Eigene Sterne'],
  ['open_graph', 'rot', 'nirgends', (d) => { for (const f of Object.keys(d).filter((x) => x.endsWith('index.html'))) ohne(d, f, /<meta property="og:[^>]*>\n/g); }, 'Keine Seite hat Open-Graph-Angaben'],
  ['open_graph', 'rot', 'Bild fehlt im Bau', (d) => ohne(d, 'kontakt/index.html', '/bilder/werkstatt.webp', '/bilder/gibt-es-nicht.webp'), 'die Datei fehlt im Bau'],
  ['open_graph', 'gelb', 'ohne Bild', (d) => ohne(d, 'kontakt/index.html', /<meta property="og:image"[^>]*>/), '/kontakt/: es fehlt og:image'],
  ['llms_txt', 'gelb', 'fehlt', (d) => { delete d['llms.txt']; }, 'llms.txt fehlt'],
  ['llms_txt', 'rot', 'ohne Titel', (d) => ohne(d, 'llms.txt', '# Velowerkstatt Länggasse\n\n'), 'beginnt nicht mit «# <Name>»'],
  ['llms_txt', 'rot', 'toter Link', (d) => ohne(d, 'llms.txt', '/angebot/)', '/preise/)'), 'die es im Bau nicht gibt'],
  ['gewicht', 'gelb', 'über 1 MB', (d) => { d['bilder/werkstatt.webp'] = 'x'.repeat(1_200_000); }, 'Ziel unter 1 MB', ['bilder']],
  ['gewicht', 'rot', 'über 2 MB', (d) => { d['stil.css'] = `/*${'x'.repeat(2_100_000)}*/`; }, 'Grenze 2 MB'],
  ['indexnow', 'gelb', 'keine Schlüsseldatei', (d) => { delete d[`${SCHLUESSEL}.txt`]; }, 'Keine Schlüsseldatei'],
  ['indexnow', 'rot', 'Inhalt ist nicht der Schlüssel', (d) => { d[`${SCHLUESSEL}.txt`] = 'anderer-inhalt'; }, 'nicht derselbe Schlüssel'],
];
for (const [name, ampel, was, aendern, meldung, auch = []] of FEHLER)
  test(`eingebauter Fehler, ${name}: ${was} → ${ampel}`, () => {
    const r = pruefe(aendern);
    expect(r.ampeln[name]).toBe(ampel);
    expect(r.punkt(name).details.join('\n')).toContain(meldung);
    // Ein grosses Bild trifft gewicht und bilder, eine fehlende Sitemap auch robots (nennt eine Datei, die fehlt); sonst kippt nur der eine
    expect(r.nicht('grün').filter((n) => n !== name).sort()).toEqual(auch);
    expect(r.code).toBe(ampel === 'rot' ? 1 : 0);
  });

test('jeder der zwölf Punkte hat mindestens einen eingebauten Fehler', () => {
  expect([...new Set(FEHLER.map(([n]) => n))]).toEqual(PUNKTE);
});

test('Marken in llms.txt und JSON-LD, auch übersetzt: kein geprüfter Fakt → rot', () => {
  for (const marke of ['[Annahme: offen bis Samstag]', '[à compléter : horaires]', '[da completare: orari]', '[placeholder: opening hours]', '[offen: Preis]']) {
    const r = pruefe((d) => ohne(d, 'llms.txt', 'meist bis am nächsten Tag.', `meist bis am nächsten Tag. ${marke}`));
    expect([marke, r.ampeln.llms_txt]).toEqual([marke, 'rot']);
  }
  const r = pruefe((d) => ohne(d, 'index.html', '"telephone":"+41 31 000 00 00"', '"telephone":"[à compléter : téléphone]"'));
  expect(r.ampeln.strukturierte_daten).toBe('rot');
});

test('Sitemap von Astro: sitemap-index.xml mit sitemap-0.xml', () => {
  const r = pruefe((d) => {
    d['sitemap-0.xml'] = d['sitemap.xml']!;
    d['sitemap-index.xml'] = `<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${ADRESSE}/sitemap-0.xml</loc></sitemap></sitemapindex>`;
    delete d['sitemap.xml'];
    d['robots.txt'] = `User-agent: *\nAllow: /\nSitemap: ${ADRESSE}/sitemap-index.xml\n`;
  });
  expect([r.ampeln.sitemap, r.ampeln.robots]).toEqual(['grün', 'grün']);
});

test('noindex: Die Seite zählt nicht, auch nicht für die Sitemap', () => {
  const r = pruefe((d) => {
    d['danke/index.html'] = '<!doctype html><html lang="de"><head><meta name="robots" content="noindex"><title>Danke</title></head><body><a href="/">Start</a></body></html>';
  });
  expect([r.e.seiten, r.nicht('grün')]).toEqual([4, []]);
});

test('KI-Boten ausgesperrt: ein Hinweis, kein Fehler (Entscheid der Person)', () => {
  const r = pruefe((d) => { d['robots.txt'] = `User-agent: GPTBot\nUser-agent: ClaudeBot\nDisallow: /\n\nUser-agent: *\nAllow: /\nSitemap: ${ADRESSE}/sitemap.xml\n`; });
  expect(r.ampeln.robots).toBe('grün');
  expect(r.punkt('robots').details.join()).toContain('Ausgesperrt: GPTBot, ClaudeBot');
});

test('Zusatz: eine Seite, auf die keine andere zeigt, und eine ohne lang', () => {
  const r = pruefe((d) => {
    d['versteckt/index.html'] = seite('/versteckt/', 'Eine Seite, die niemand findet | Velowerkstatt', 'Diese Seite steht in keinem Menü und in keinem Text, darum findet sie auch keine Suchmaschine.', '<h1>Versteckt</h1>').replace(' lang="de-CH"', '');
    ohne(d, 'sitemap.xml', '</urlset>', `<url><loc>${ADRESSE}/versteckt/</loc></url></urlset>`);
  });
  expect(r.punkt('interne_links').details.join()).toContain('/versteckt/');
  expect(r.punkt('sprache').details.join()).toContain('/versteckt/');
  expect([r.code, r.e.ergebnis]).toEqual([0, 'gelb']);
});

test('--adresse: Die Seite ist für eine andere Hauptadresse gebaut → kanonisch und sitemap rot', () => {
  const r = pruefe(() => {}, '--adresse', 'https://www.anders.example');
  expect([r.ampeln.kanonisch, r.ampeln.sitemap, r.code]).toEqual(['rot', 'rot', 1]);
});

test('ohne gebaute Seite: Exit 2', () => {
  const d = mkdtempSync(join(tmpdir(), 'sichtbar-leer-'));
  ordner.push(d);
  const r = Bun.spawnSync([NODE, SKRIPT, d]);
  expect(r.exitCode).toBe(2);
  expect(r.stderr.toString()).toContain('index.html fehlt');
});
