// Test für plugins/albatros/skills/gestaltung/design-pruefen.mjs (bun test): die guten Testseiten des Entwurfs (scripts/entwurf-pruefen/gut)
// mit drei klar verschiedenen Richtungen sind grün; je Kriterium vom 10.11.2026 ein eingebauter Fehler, der genau seinen Bereich kippt.
// Das Skript läuft mit Node, wie bei der Person.
import { afterAll, expect, test } from 'bun:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const wurzel = new URL('..', import.meta.url).pathname;
const SKRIPT = join(wurzel, 'plugins/albatros/skills/gestaltung/design-pruefen.mjs');
const GUT = join(wurzel, 'scripts/entwurf-pruefen/gut');
const NODE = Bun.which('node') ?? process.execPath;
const BEREICHE = ['schrift', 'farbe', 'texte', 'kopf', 'richtungen', 'bewegung', 'dreid', 'gewicht'];

const richtung = (schrift: string, farbe: string, rund: string) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Richtung</title>
<style>
  :root { --schrift-titel: ${schrift}; --aktion: ${farbe}; --rund: ${rund}; }
  body { font-family: system-ui, sans-serif; color: #1d1b18; background: #faf7f2; }
  h1 { font-family: var(--schrift-titel); }
  .knopf { background: var(--aktion); border-radius: var(--rund); }
</style></head>
<body><main><h1>Blasmusik aus Testdorf, seit 1921</h1><p>Wir proben jeden Donnerstag um 20 Uhr im Schulhaus.</p><img src="probe.svg" alt="Die Probe" width="600" height="400"></main></body></html>
`;
const RICHTUNGEN = {
  'design/richtungen/weich.html': richtung('"Fraunces", Georgia, serif', '#8a4b2a', '16px'),
  'design/richtungen/klar.html': richtung('"Source Serif 4", Georgia, serif', '#0b5c8c', '2px'),
  'design/richtungen/kraeftig.html': richtung('"Archivo Black", Impact, sans-serif', '#b3261e', '0'),
};
const DOCS = {
  'docs/konzept.md': '# Konzept\n\nCharakter: herzlich, bodenständig, festlich\nMuss bleiben: nichts\n',
  'docs/designsystem.md': '# Designsystem\n\nRichtung: klar\nSchriften: Georgia und Systemschrift\n',
};

type Bereich = { ampel: string; punkte: { ampel: string; text: string }[] };
type Ergebnis = { ordner: string; bereiche: Record<string, Bereich>; ergebnis: string };
const ordner: string[] = [];
afterAll(() => { for (const d of ordner) rmSync(d, { recursive: true, force: true }); });
const schreibe = (d: string, dateien: Record<string, string | null>) => {
  for (const [f, t] of Object.entries(dateien)) {
    if (t === null) { rmSync(join(d, f), { recursive: true, force: true }); continue; }
    mkdirSync(dirname(join(d, f)), { recursive: true });
    writeFileSync(join(d, f), t);
  }
};
// Ein Projekt: die guten Testseiten, dazu Richtungen und docs; aendern bekommt den Ordner und eine Hilfe zum Ersetzen in einer Datei
type Hilfe = { d: string; ersetze: (datei: string, alt: string | RegExp, neu: string) => void; schreibe: (dateien: Record<string, string | null>) => void };
const pruefe = (aendern: (h: Hilfe) => void = () => {}, ...args: string[]) => {
  const d = mkdtempSync(join(tmpdir(), 'design-pruefen-'));
  ordner.push(d);
  cpSync(join(GUT, 'design'), join(d, 'design'), { recursive: true });
  schreibe(d, { ...RICHTUNGEN, ...DOCS });
  aendern({
    d,
    schreibe: (dateien) => schreibe(d, dateien),
    ersetze: (datei, alt, neu) => {
      const t = readFileSync(join(d, datei), 'utf8');
      const n = t.replace(alt, neu);
      if (n === t) throw new Error(`${datei}: nichts ersetzt (${alt})`);
      writeFileSync(join(d, datei), n);
    },
  });
  const r = Bun.spawnSync([NODE, SKRIPT, d, '--json', ...args]);
  const e: Ergebnis = JSON.parse(r.stdout.toString());
  return {
    code: r.exitCode, e,
    ampeln: Object.fromEntries(Object.entries(e.bereiche).map(([k, b]) => [k, b.ampel])),
    texte: (b: string) => e.bereiche[b]!.punkte.map((p) => `${p.ampel}: ${p.text}`).join('\n'),
    nichtGruen: () => Object.entries(e.bereiche).filter(([, b]) => b.ampel !== 'grün').map(([k]) => k),
  };
};

test('gut: alle acht Bereiche grün, Exit 0', () => {
  const r = pruefe();
  expect(Object.keys(r.e.bereiche)).toEqual(BEREICHE);
  expect(r.nichtGruen()).toEqual([]);
  expect([r.code, r.e.ergebnis, r.e.ordner]).toEqual([0, 'grün', 'design/entwurf']);
  expect(r.texte('richtungen')).toContain('3 Richtungen, jede mit eigener Schrift, eigenen Farben oder eigenen Formen');
});

const KOPF_BAUKASTEN = '<main id="inhalt"><section class="held"><h1>Willkommen beim Musikverein</h1><p>Blasmusik aus Testdorf.</p><p><a class="knopf" href="mitspielen.html">Mitspielen</a> <a class="knopf" href="konzerte.html">Konzerte</a></p></section>';
const DREID_SKRIPT = `<script>
  const buehne = document.querySelector('[data-3d]');
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (buehne && !ruhig && matchMedia('(min-width: 768px)').matches) new IntersectionObserver(async ([e], o) => {
    if (!e.isIntersecting) return;
    o.disconnect();
    const fläche = document.createElement('canvas');
    if (!fläche.getContext('webgl2')) return;
    (await import('./drehen.js')).zeige(buehne, fläche, 'modelle/tuba.glb');
  }).observe(buehne);
</script>`;
const DREID_GUT = (h: Hilfe) => {
  h.ersetze('design/entwurf/index.html', '<img class="bild" src="bilder/probe.svg"', '<img data-3d-standbild class="bild" src="bilder/probe.svg"');
  h.ersetze('design/entwurf/index.html', '<div class="zwei">', '<div class="zwei" data-3d="modelle/tuba.glb">');
  h.ersetze('design/entwurf/index.html', '</body>', `${DREID_SKRIPT}</body>`);
  h.schreibe({ 'design/entwurf/drehen.js': 'export const zeige = () => {};', 'design/entwurf/modelle/tuba.glb': 'x'.repeat(400_000) });
  h.ersetze('docs/designsystem.md', /$/, '\n## Gestaltungselemente\n3D: die Tuba zum Drehen, weil man am Instrument zeigt, was im Verein gespielt wird\n\n## Bewegung\nDie Tuba dreht sich nur, wenn man sie zieht.\n');
};

// Bereich, Ampel, was, Änderung, Meldung
const FEHLER: [string, string, string, (h: Hilfe) => void, string][] = [
  ['schrift', 'rot', 'Titelschrift Inter', (h) => h.ersetze('design/tokens.css', '--schrift-titel: Georgia, "Times New Roman", serif;', '--schrift-titel: Inter, sans-serif;'), 'Die Titelschrift ist Standard (Inter)'],
  ['schrift', 'rot', 'Schrift von Google Fonts', (h) => h.ersetze('design/entwurf/index.html', '</head>', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces"></head>'), 'Schrift von einem fremden Server'],
  ['schrift', 'gelb', 'Typo-Skala mit zwei Grössen', (h) => { h.ersetze('design/tokens.css', /--groesse-klein:[^\n]*\n/, ''); h.ersetze('design/tokens.css', /--groesse-h2:[^\n]*\n/, ''); }, 'Die Typo-Skala hat 2 Grössen'],
  ['farbe', 'rot', 'Aktionsfarbe aus Tailwind', (h) => h.ersetze('design/tokens.css', '--hell-aktion: #0b5c8c;', '--hell-aktion: #6366f1;'), 'Farbe aus dem Baukasten: #6366f1 (Tailwind indigo-500)'],
  ['farbe', 'rot', 'Verlauf in Lila und Blau', (h) => h.ersetze('design/entwurf/entwurf.css', /$/, '\n.kopf { background: linear-gradient(135deg, #5b6ee1 0%, #8e44ad 100%); }\n'), '1 Standard-Verlauf in Lila und Blau'],
  ['farbe', 'gelb', 'anderer Verlauf ohne Grund', (h) => h.ersetze('design/entwurf/entwurf.css', /$/, '\n.kopf { background: linear-gradient(var(--hell-grund), var(--hell-flaeche)); }\n'), '1 Verlauf ohne Grund'],
  ['farbe', 'gelb', 'Glaseffekt', (h) => h.ersetze('design/komponenten.css', /$/, '\n.kopf { backdrop-filter: blur(12px); }\n'), 'Glaseffekt (backdrop-filter)'],
  ['texte', 'rot', 'Lorem ipsum', (h) => h.ersetze('design/entwurf/ueber-uns.html', '</main>', '<p>Lorem ipsum dolor sit amet.</p></main>'), 'design/entwurf/ueber-uns.html: Lorem-Text'],
  ['texte', 'rot', 'Emoji als Icons', (h) => h.ersetze('design/entwurf/index.html', '<h2>Nächstes Konzert</h2>', '<h2>🎺 Nächstes Konzert</h2><ul><li>✅ Jeden Donnerstag</li></ul>'), 'design/entwurf/index.html: Emoji als Icon (🎺 ✅)'],
  ['texte', 'rot', 'Bild von einem Platzhalter-Dienst', (h) => h.ersetze('design/entwurf/index.html', 'src="bilder/probe.svg"', 'src="https://picsum.photos/600/400"'), 'Bild von einem Platzhalter-Dienst'],
  ['texte', 'gelb', 'Floskeln', (h) => h.ersetze('design/entwurf/index.html', 'Wir sind 34', 'Willkommen auf unserer Webseite. Wir sind 34'), 'Floskeln (willkommen auf unserer)'],
  ['kopf', 'rot', 'zentrierter Titel mit zwei Knöpfen', (h) => { h.ersetze('design/entwurf/index.html', /<main id="inhalt">[\s\S]*?<img[^>]*>\s*<\/div>/, KOPF_BAUKASTEN); h.ersetze('design/entwurf/entwurf.css', /$/, '\n.held { text-align: center; }\n'); }, 'austauschbarer Kopf (zentrierter Titel, zwei Knöpfe, kein Bild, kein Inhalt)'],
  ['richtungen', 'rot', 'nur eine Richtung', (h) => h.schreibe({ 'design/richtungen/klar.html': null, 'design/richtungen/kraeftig.html': null }), '1 Richtung in design/richtungen/'],
  ['richtungen', 'rot', 'zweimal dieselbe', (h) => h.schreibe({ 'design/richtungen/kraeftig.html': RICHTUNGEN['design/richtungen/klar.html'] }), 'klar.html und kraeftig.html: gleiche Schrift, gleiche Farben, gleiche Formen'],
  ['richtungen', 'rot', 'nur andere Farben', (h) => h.schreibe({ 'design/richtungen/kraeftig.html': richtung('"Source Serif 4", Georgia, serif', '#b3261e', '2px') }), 'klar.html und kraeftig.html unterscheiden sich nur in den Farben'],
  ['bewegung', 'rot', 'Bewegung ohne «weniger Bewegung»', (h) => h.ersetze('design/komponenten.css', /$/, '\n.knopf { transition: transform 160ms; }\n'), 'Bewegung im CSS ohne @media (prefers-reduced-motion: reduce)'],
  ['bewegung', 'rot', 'Skript bewegt ohne Rücksicht', (h) => h.ersetze('design/entwurf/index.html', '</body>', '<script>requestAnimationFrame(function zappeln() { requestAnimationFrame(zappeln); });</script></body>'), 'Bewegung im Skript ohne matchMedia'],
  ['bewegung', 'rot', 'Lauftext', (h) => h.ersetze('design/entwurf/index.html', '<h2>Nächstes Konzert</h2>', '<marquee>Jetzt anmelden</marquee>'), 'Lauftext (<marquee> oder <blink>)'],
  ['bewegung', 'gelb', 'läuft endlos, Absicht fehlt', (h) => h.ersetze('design/komponenten.css', /$/, '\n@keyframes puls { to { opacity: 0.5; } }\n.knopf { animation: puls 2s infinite; }\n@media (prefers-reduced-motion: reduce) { .knopf { animation: none; } }\n'), '1 Bewegung läuft endlos (infinite)'],
  ['dreid', 'rot', '3D ohne Standbild', (h) => h.ersetze('design/entwurf/index.html', '</main>', '<canvas id="buehne"></canvas><script>document.getElementById("buehne").getContext("webgl");</script></main>'), '3D ohne Standbild'],
  ['dreid', 'rot', 'Modell über 2 MB', (h) => { DREID_GUT(h); h.schreibe({ 'design/entwurf/modelle/tuba.glb': 'x'.repeat(2_400_000) }); }, 'modelle/tuba.glb: 2,4 MB'],
  ['dreid', 'gelb', 'lädt sofort statt bei Sichtbarkeit', (h) => { DREID_GUT(h); h.ersetze('design/entwurf/index.html', 'new IntersectionObserver(async ([e], o) => {', '(async (e, o) => {'); h.ersetze('design/entwurf/index.html', '}).observe(buehne);', '})({ isIntersecting: true }, { disconnect() {} });'); }, '3D-Skript ohne IntersectionObserver'],
  ['gewicht', 'gelb', 'Bild mit 600 KB', (h) => h.schreibe({ 'design/entwurf/bilder/gross.jpg': 'x'.repeat(600_000) }), 'Bild zu gross: design/entwurf/bilder/gross.jpg (586 KB'],
  ['gewicht', 'rot', 'Seite über 2 MB', (h) => { h.schreibe({ 'design/entwurf/bilder/a.webp': 'x'.repeat(450_000), 'design/entwurf/bilder/b.webp': 'x'.repeat(450_000), 'design/entwurf/bilder/c.webp': 'x'.repeat(450_000), 'design/entwurf/bilder/d.webp': 'x'.repeat(450_000), 'design/entwurf/bilder/e.webp': 'x'.repeat(450_000) }); h.ersetze('design/entwurf/index.html', '</main>', `${'abcde'.split('').map((n) => `<img src="bilder/${n}.webp" alt="" width="10" height="10">`).join('')}</main>`); }, 'design/entwurf/index.html: 2'],
];
for (const [bereich, ampel, was, aendern, meldung] of FEHLER)
  test(`eingebauter Fehler, ${bereich}: ${was} → ${ampel}`, () => {
    const r = pruefe(aendern);
    expect(r.texte(bereich)).toContain(meldung);
    expect(r.ampeln[bereich]).toBe(ampel);
    expect(r.nichtGruen()).toEqual([bereich]);
    expect(r.code).toBe(ampel === 'rot' ? 1 : 0);
  });

test('jeder Bereich hat mindestens einen eingebauten Fehler', () => {
  expect([...new Set(FEHLER.map(([b]) => b))]).toEqual(BEREICHE);
});

test('schrift: Die Standardschrift ist kein Fehler, wenn sie bleiben muss (docs/konzept.md)', () => {
  const r = pruefe((h) => {
    h.ersetze('design/tokens.css', '--schrift-titel: Georgia, "Times New Roman", serif;', '--schrift-titel: Inter, sans-serif;');
    h.ersetze('docs/konzept.md', 'Muss bleiben: nichts', 'Muss bleiben: die Hausschrift Inter und das Logo');
  });
  expect(r.ampeln.schrift).toBe('grün');
});

test('richtungen: Muss etwas bleiben (Hausschrift), sind nur andere Farben gelb statt rot', () => {
  const r = pruefe((h) => {
    h.schreibe({ 'design/richtungen/kraeftig.html': richtung('"Source Serif 4", Georgia, serif', '#b3261e', '2px') });
    h.ersetze('docs/konzept.md', 'Muss bleiben: nichts', 'Muss bleiben: die Hausschrift Source Serif');
  });
  expect([r.ampeln.richtungen, r.code]).toEqual(['gelb', 0]);
});

test('kopf: zentriert ist kein Fehler, sobald ein Bild oder Inhalt im Kopf steht', () => {
  for (const dazu of ['<img src="bilder/probe.svg" alt="Die Probe" width="600" height="400">', '<p>Nächstes Konzert: <time datetime="2026-12-12">12. Dez. 2026</time></p>']) {
    const r = pruefe((h) => {
      h.ersetze('design/entwurf/index.html', /<main id="inhalt">[\s\S]*?<img[^>]*>\s*<\/div>/, KOPF_BAUKASTEN.replace('</section>', `${dazu}</section>`));
      h.ersetze('design/entwurf/entwurf.css', /$/, '\n.held { text-align: center; }\n');
    });
    expect(r.ampeln.kopf).toBe('grün');
  }
});

test('texte: ©, ✓ und → sind keine Emoji', () => {
  const r = pruefe((h) => h.ersetze('design/entwurf/index.html', '<h2>Nächstes Konzert</h2>', '<h2>Nächstes Konzert →</h2><p>✓ Eintritt frei · © 2026</p>'));
  expect(r.ampeln.texte).toBe('grün');
});

test('bewegung: mit «weniger Bewegung» und der Absicht in docs/designsystem.md grün', () => {
  const r = pruefe((h) => {
    h.ersetze('design/komponenten.css', /$/, '\n.knopf { transition: transform 160ms; }\n@media (prefers-reduced-motion: reduce) { .knopf { transition: none; } }\n');
    h.ersetze('docs/designsystem.md', /$/, '\n## Bewegung\nDer Knopf gibt beim Drücken nach: Man sieht, dass der Klick angekommen ist.\n');
  });
  expect(r.ampeln.bewegung).toBe('grün');
  expect(r.texte('bewegung')).toContain('Bewegung beachtet «weniger Bewegung»');
});

test('dreid: mit Standbild, erst bei Sichtbarkeit, ab Tablet-Breite, nicht bei «weniger Bewegung» → grün', () => {
  const r = pruefe(DREID_GUT);
  expect(r.nichtGruen()).toEqual([]);
  expect(r.texte('dreid')).toContain('3D mit Standbild als Rückfall');
});

test('vor der Wahl (noch kein Entwurf): geprüft werden die Richtungen selbst', () => {
  const r = pruefe((h) => {
    h.schreibe({ 'design/entwurf': null, 'design/tokens.css': null, 'design/komponenten.css': null, 'design/musterblatt.html': null });
    h.schreibe({ 'design/richtungen/kraeftig.html': richtung('Inter, sans-serif', '#b3261e', '0').replace('system-ui, sans-serif', 'Inter, sans-serif').replace('<p>Wir proben', '<p>🚀 Wir proben') });
  });
  expect(r.e.ordner).toBe('design/richtungen');
  expect(r.texte('schrift')).toContain('rot: design/richtungen/kraeftig.html: Die Titelschrift ist Standard (Inter)');
  expect(r.texte('texte')).toContain('rot: design/richtungen/kraeftig.html: Emoji als Icon (🚀)');
  expect(r.code).toBe(1);
});

test('--bau: die gebaute Seite; fest eingebundenes JavaScript über 50 KB ist dort rot, Richtungen zählen nicht', () => {
  const r = pruefe((h) => {
    cpSync(join(h.d, 'design/entwurf'), join(h.d, 'seite'), { recursive: true });
    h.schreibe({ 'seite/gross.js': `// ${'x'.repeat(60_000)}`, 'design/richtungen': null });
    h.ersetze('seite/index.html', '</head>', '<script src="gross.js"></script></head>');
    h.ersetze('seite/index.html', /<link rel="stylesheet" href="\.\.\/[^>]*>\s*/g, '');
  }, '--bau');
  expect(r.e.ordner).toBe('seite');
  expect(Object.keys(r.e.bereiche)).toEqual(BEREICHE.filter((b) => b !== 'richtungen'));
  expect(r.texte('gewicht')).toContain('rot: seite/index.html: 59 KB fest eingebundenes JavaScript');
  expect(r.code).toBe(1);
});

test('unbekannter Bereich und leeres Projekt: Exit 2', () => {
  const d = mkdtempSync(join(tmpdir(), 'design-leer-'));
  ordner.push(d);
  expect(Bun.spawnSync([NODE, SKRIPT, d]).exitCode).toBe(2);
  const r = Bun.spawnSync([NODE, SKRIPT, d, '--nur', 'bunt']);
  expect(r.exitCode).toBe(2);
  expect(r.stderr.toString()).toContain('--nur kennt schrift, farbe, texte, kopf, richtungen, bewegung, dreid, gewicht, nicht bunt');
});
