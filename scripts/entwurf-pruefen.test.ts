// Test für plugins/albatros/skills/entwurf/entwurf-pruefen.mjs (bun test): die Testseiten in scripts/entwurf-pruefen/ (gut: alles
// richtig, schlecht: jede Regel einmal gebrochen) und kleine Projekte für die Zeile «Seiten:» in anderen Formen. Das Skript läuft mit
// Node, wie bei der Person; ohne Node mit Bun.
import { afterAll, expect, test } from 'bun:test';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const wurzel = new URL('..', import.meta.url).pathname;
const SKRIPT = join(wurzel, 'plugins/albatros/skills/entwurf/entwurf-pruefen.mjs');
const TESTSEITEN = join(wurzel, 'scripts/entwurf-pruefen');
const NODE = Bun.which('node') ?? process.execPath;

const pruefe = (...a: string[]) => {
  const r = Bun.spawnSync([NODE, SKRIPT, ...a]);
  const aus = r.stdout.toString() + r.stderr.toString();
  const zeilen = (ampel: string) => aus.split('\n').filter((z) => z.startsWith(`   ${ampel} `)).length;
  return { code: r.exitCode, aus, rot: zeilen('rot    '), gelb: zeilen('gelb   ') };
};
const ordner: string[] = [];
const projekt = (dateien: Record<string, string>) => {
  const d = mkdtempSync(join(tmpdir(), 'entwurf-pruefen-'));
  ordner.push(d);
  for (const [f, t] of Object.entries(dateien)) {
    mkdirSync(dirname(join(d, f)), { recursive: true });
    writeFileSync(join(d, f), t);
  }
  return d;
};
afterAll(() => { for (const d of ordner) rmSync(d, { recursive: true, force: true }); });
const SEITE = '<!doctype html><html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="../tokens.css"></head><body><nav><a href="index.html">Start</a></nav></body></html>';

test('gut: alles grün, Exit 0', () => {
  const r = pruefe(join(TESTSEITEN, 'gut'));
  expect(r.code).toBe(0);
  for (const s of ['Start → design/entwurf/index.html', 'Über uns → design/entwurf/ueber-uns.html', 'Mitspielen → design/entwurf/mitspielen.html',
    'Impressum: im Entwurf nicht nötig', '12 von 12 Kontrasten in design/tokens.css nachgerechnet und richtig', 'Dasselbe Menü auf allen 10 Seiten',
    'Freigegeben zum Bauen: 31.10.2026, ‹Ja, so bauen›', 'Ergebnis: grün.']) expect(r.aus).toContain(s);
  expect(r.rot + r.gelb).toBe(0);
});

test('schlecht: jede gebrochene Regel genau einmal gemeldet, Exit 1', () => {
  const r = pruefe(join(TESTSEITEN, 'schlecht'));
  expect(r.code).toBe(1);
  const erwartet = [
    // Seiten
    'Über uns: design/entwurf/ueber-uns.html fehlt',
    'Kurse → design/entwurf/kurse/index.html',
    // Links: die fehlende Seite einmal, mit allen Stellen
    'design/entwurf/ueber-uns.html gibt es nicht, verlinkt als «ueber-uns.html» (auf 9 Seiten:',
    '«/konzerte.html» beginnt mit «/»',
    '«Konzerte.html» ist anders geschrieben als die Datei design/entwurf/konzerte.html',
    '«mitspielen» ohne .html',
    'design/entwurf/danke.html gibt es nicht',
    'Link ohne Ziel («#»)',
    'Sprungmarke «#programm» gibt es in design/entwurf/konzerte.html nicht',
    '«kurse/» zeigt auf einen Ordner',
    'design/entwurf/bilder/fehlt.jpg gibt es nicht',
    // Farbfächer, mit Zeilennummer
    'design/entwurf/konzerte.html bindet design/tokens.css nicht ein',
    'design/entwurf/index.html:10: Schrift von Hand (font-family: Arial, sans-serif)',
    'design/entwurf/index.html:10: Grösse von Hand (font-size: 40px)',
    'design/entwurf/index.html:27: Farbe von Hand (color: #333)',
    'design/entwurf/index.html:27: Grösse von Hand (padding: 13px)',
    'design/komponenten.css:36: Grösse von Hand (border-radius: 999px)',
    'design/komponenten.css:37: Farbe von Hand (background: white)',
    'design/entwurf/index.html:11: var(--gibt-es-nicht) gibt es nicht in design/tokens.css',
    'design/tokens.css:7: --hell-text auf --hell-grund: behauptet 12,0 : 1, nachgerechnet 16,0 : 1. Kommentar korrigieren',
    'design/tokens.css:8: --hell-leise auf --hell-grund: behauptet 4,6 : 1, nachgerechnet 3,5 : 1. Das reicht nicht für Text',
    // Menü und Notizen
    'design/entwurf/index.html: <meta name="viewport"',
    'design/entwurf/konzerte.html: anderes Menü als design/entwurf/index.html, es fehlt mitspielen.html',
    'docs/entwurf.md fehlt',
    'Ergebnis: rot.',
  ];
  for (const s of erwartet) expect(r.aus).toContain(s);
  // Nicht mehr als das: 1 Seite, 7 Links, 9 im Farbfächer rot; 2 Links, 1 Kontrast, 3 Menü und Notizen gelb
  expect([r.rot, r.gelb]).toEqual([17, 6]);
});

test('Seiten: Hypothèse ausgepackt, Akzente und Rechtsseiten auf Französisch', () => {
  const d = projekt({
    'docs/plan.md': 'Seiten: [Hypothèse : Accueil, À propos, Contact, Mentions légales, Protection des données]\n',
    'design/entwurf/index.html': SEITE,
    'design/entwurf/a-propos.html': SEITE,
  });
  const r = pruefe('--nur', 'seiten', d);
  expect(r.code).toBe(1);
  for (const s of ['Accueil → design/entwurf/index.html', 'À propos → design/entwurf/a-propos.html', 'Contact: design/entwurf/contact.html fehlt',
    'Mentions légales: im Entwurf nicht nötig', 'Protection des données: im Entwurf nicht nötig']) expect(r.aus).toContain(s);
  expect(r.rot).toBe(1);
});

test('Seiten: Liste unter «## Seiten» wie im alten Grundriss, Klammern und Erklärungen fallen weg', () => {
  const d = projekt({
    'docs/plan.md': '# Plan\n\n## Seiten\n- Start: wer, was, für wen\n- Angebot (Kurse, Preise): was wir machen\n- Über mich – die Geschichte\n- Impressum und Datenschutz\n\n## Inhalte\n- Fotos\n',
    'design/entwurf/index.html': SEITE,
    'design/entwurf/angebot.html': SEITE,
    'design/entwurf/ueber-mich.html': SEITE,
  });
  const r = pruefe('--nur', 'seiten', d);
  expect(r.code).toBe(0);
  for (const s of ['Start → design/entwurf/index.html', 'Angebot → design/entwurf/angebot.html', 'Über mich → design/entwurf/ueber-mich.html']) expect(r.aus).toContain(s);
  expect(r.aus).not.toContain('Fotos');
});

test('Seiten: ohne docs/plan.md rot', () => {
  const r = pruefe('--nur', 'seiten', projekt({ 'design/entwurf/index.html': SEITE }));
  expect(r.code).toBe(1);
  expect(r.aus).toContain('docs/plan.md fehlt');
});

test('farbfaecher geht schon in P6, nur mit tokens.css und Musterblatt', () => {
  const d = projekt({});
  for (const f of ['design/tokens.css', 'design/komponenten.css', 'design/musterblatt.html']) cpSync(join(TESTSEITEN, 'gut', f), join(d, f), { recursive: true });
  const r = pruefe('--nur', 'farbfaecher', d);
  expect(r.code).toBe(0);
  expect(r.aus).toContain('Farben, Schriften und Grössen nur als var(--…), in 2 Dateien');
  expect(r.aus).toContain('12 von 12 Kontrasten in design/tokens.css nachgerechnet und richtig');
});

test('unbekannter Bereich: Exit 2', () => {
  const r = pruefe('--nur', 'bunt');
  expect(r.code).toBe(2);
  expect(r.aus).toContain('--nur kennt seiten, links, farbfaecher, menue, nicht bunt');
});
