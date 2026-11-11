// Test für plugins/albatros/skills/webseite-planen/plan-pruefen.mjs (bun test): die Bauliste in docs/plan.md (Form und JSON, so wie das
// Cockpit sie liest), je Regel ein eingebauter Fehler, und der Umfang: Jede Seite und Funktion der Bauliste kommt im Entwurf (--entwurf)
// und im Bau (--bau) vor. Das Skript läuft mit Node, wie bei der Person.
import { afterAll, expect, test } from 'bun:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { ladeFahrplan } from './fahrplan.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const SKRIPT = join(wurzel, 'plugins/albatros/skills/webseite-planen/plan-pruefen.mjs');
const GUT = join(wurzel, 'scripts/entwurf-pruefen/gut');
const NODE = Bun.which('node') ?? process.execPath;

const PLAN = `# Plan: Musikverein Testdorf

Projektname: Musikverein Testdorf
Seiten: [Annahme: Start, Konzerte, Über uns, Mitspielen, Impressum und Datenschutz]
Funktionen: Anfrage zum Mitspielen über ein Formular (F1); Konzerte im Kalender speichern (F2, kann später kommen)
Zugang: keine Bereiche nur für bestimmte Leute
Sprachen: Deutsch
Setup: statisch, eine Seite ohne eigene Dienste
Testing: Die Anfrage kommt beim Präsidenten an; Impressum und Datenschutz auf jeder Seite
Release: zum Jahreskonzert am 12.12.2026
Pflege: der Präsident, einmal im Monat
Stand: 10.11.2026, Grundriss steht

## Bauliste

| Kennung | Art | Titel | Muss/Kann | Abnahme |
|---|---|---|---|---|
| S1 | Seite | Start | Muss | Am Handy steht ohne Scrollen, wer der Verein ist, und der Knopf «Mitspielen anfragen» |
| S2 | Seite | Konzerte | Muss | Jedes Konzert steht mit Datum, Zeit und Ort da; ohne Konzert steht ein Satz statt einer leeren Liste |
| S3 | Seite | Über uns | Muss | Man liest, wer der Verein ist und wann er probt |
| S4 | Seite | Mitspielen | Muss | Das Formular fragt nur Name und E-Mail |
| S5 | Seite | Impressum | Muss | Von jeder Seite aus erreichbar |
| S6 | Seite | Datenschutz | Muss | Von jeder Seite aus erreichbar |
| F1 | Funktion | Anfrage zum Mitspielen | Muss | Die Anfrage kommt beim Präsidenten an; Bestätigung und Fehler stehen in Worten da |
| F2 | Funktion | Konzert im Kalender speichern | Kann | [Annahme: Ein Klick lädt den Termin als Kalenderdatei] |
`;

type Eintrag = { kennung: string; art: string; titel: string; stufe: string; abnahme: string; offen: boolean };
type Ergebnis = { datei: string; bestaetigt: string | null; bauliste: Eintrag[]; fehler: string[]; ergebnis: string };
const ordner: string[] = [];
afterAll(() => { for (const d of ordner) rmSync(d, { recursive: true, force: true }); });
const projekt = (dateien: Record<string, string>, mitEntwurf = false) => {
  const d = mkdtempSync(join(tmpdir(), 'plan-pruefen-'));
  ordner.push(d);
  if (mitEntwurf) cpSync(join(GUT, 'design'), join(d, 'design'), { recursive: true });
  for (const [f, t] of Object.entries(dateien)) {
    mkdirSync(dirname(join(d, f)), { recursive: true });
    writeFileSync(join(d, f), t);
  }
  return d;
};
const pruefe = (d: string, ...a: string[]) => {
  const r = Bun.spawnSync([NODE, SKRIPT, d, ...a]);
  return { code: r.exitCode, aus: r.stdout.toString() + r.stderr.toString() };
};
const json = (plan: string): Ergebnis => JSON.parse(pruefe(projekt({ 'docs/plan.md': plan }), '--json').aus);
const aendere = (alt: string | RegExp, neu: string) => { const t = PLAN.replace(alt, neu); if (t === PLAN) throw new Error(`nichts ersetzt: ${alt}`); return t; };

test('Pflichtzeilen wie P3 in fahrplan.yaml (Ergebnis docs/plan.md)', async () => {
  const plan = await ladeFahrplan(wurzel);
  if (!plan.ok) throw new Error(plan.fehler.join('\n'));
  const soll = plan.fahrplan.phasen.find((p) => p.id === 'P3')!.ergebnis.find((e) => e.datei === 'docs/plan.md')!.zeilen;
  const ist = /const PFLICHTZEILEN = \[([^\]]*)\]/.exec(readFileSync(SKRIPT, 'utf8'))![1]!.split(',').map((s) => s.trim().replace(/^'|'$/g, ''));
  expect(ist).toEqual(soll!);
});

test('gut: grün, Exit 0, und --json gibt die Bauliste so, wie das Cockpit sie liest', () => {
  const d = projekt({ 'docs/plan.md': PLAN });
  const r = pruefe(d);
  expect(r.code).toBe(0);
  expect(r.aus).toContain('Bauliste: 6 Seiten, 2 Funktionen; 7 Muss, 1 Kann');
  expect(r.aus).toContain('Ergebnis: grün.');
  const e: Ergebnis = JSON.parse(pruefe(d, '--json').aus);
  expect(Object.keys(e)).toEqual(['datei', 'bestaetigt', 'bauliste', 'fehler', 'ergebnis']);
  expect([e.datei, e.bestaetigt, e.fehler, e.ergebnis]).toEqual(['docs/plan.md', null, [], 'grün']);
  expect(e.bauliste.map((x) => x.kennung)).toEqual(['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'F1', 'F2']);
  expect(e.bauliste[6]).toEqual({ kennung: 'F1', art: 'Funktion', titel: 'Anfrage zum Mitspielen', stufe: 'Muss', abnahme: 'Die Anfrage kommt beim Präsidenten an; Bestätigung und Fehler stehen in Worten da', offen: false });
  expect(e.bauliste[7]).toMatchObject({ kennung: 'F2', stufe: 'Kann', offen: false });
});

test('bestätigt: das Datum mit Wortlaut steht im JSON; ohne Datum oder als Annahme gilt es nicht', () => {
  expect(json(`${PLAN}\nBestätigt: 10.11.2026, «So machen wir es»\n`).bestaetigt).toBe('10.11.2026, «So machen wir es»');
  expect(json(`${PLAN}\nBestätigt: [offen: kommt nach der Prüfung]\n`).bestaetigt).toBeNull();
});

const FEHLER: [string, string, string][] = [
  ['ohne Überschrift', aendere('## Bauliste', '## Liste'), 'Die Überschrift «## Bauliste» fehlt'],
  ['andere Spalten', aendere('| Kennung | Art | Titel | Muss/Kann | Abnahme |', '| Nr | Art | Titel | Priorität | Abnahme |'), 'Die Spalten heissen «| Kennung | Art | Titel | Muss/Kann | Abnahme |»'],
  ['Kennung zweimal', aendere('| S3 | Seite | Über uns', '| S2 | Seite | Über uns'), 'Kennung S2 gibt es zweimal'],
  ['Kennung in falscher Form', aendere('| F1 | Funktion', '| Funktion-1 | Funktion'), 'Kennung «Funktion-1» ist nicht S1, S2 …'],
  ['Kennung passt nicht zur Art', aendere('| F1 | Funktion', '| S9 | Funktion'), 'S9 passt nicht zur Art Funktion'],
  ['unbekannte Art', aendere('| F1 | Funktion', '| F1 | Feature'), 'Art «Feature» ist nicht Seite oder Funktion'],
  ['weder Muss noch Kann', aendere('| Konzert im Kalender speichern | Kann |', '| Konzert im Kalender speichern | vielleicht |'), '«vielleicht» ist nicht Muss oder Kann'],
  ['Abnahme leer', aendere('Das Formular fragt nur Name und E-Mail', '…'), 'Bauliste, Zeile 21 (S4): Abnahme fehlt'],
  ['Titel fehlt', aendere('| S3 | Seite | Über uns |', '| S3 | Seite |  |'), '(S3): Titel fehlt'],
  ['Seite nur in der Zeile «Seiten:»', aendere('Start, Konzerte, Über uns', 'Start, Konzerte, Galerie, Über uns'), 'Seite «Galerie» steht in der Zeile «Seiten:», aber nicht in der Bauliste'],
  ['Seite nur in der Bauliste', aendere('Start, Konzerte, Über uns', 'Start, Über uns'), 'S2 «Konzerte» steht in der Bauliste, aber nicht in der Zeile «Seiten:»'],
  ['Pflichtzeile fehlt', aendere('Pflege: der Präsident, einmal im Monat\n', ''), 'Zeile «Pflege:» fehlt'],
  ['bestätigt, aber noch offen', `${aendere('[Annahme: Ein Klick lädt den Termin als Kalenderdatei]', '[offen: braucht es das?]')}\nBestätigt: 10.11.2026, «Ja»\n`, 'Abnahme noch [offen] bei F2: Der Plan ist bestätigt'],
];
for (const [was, plan, meldung] of FEHLER)
  test(`eingebauter Fehler: ${was} → rot, Exit 1`, () => {
    const r = pruefe(projekt({ 'docs/plan.md': plan }));
    expect(r.aus).toContain(meldung);
    expect(r.aus).toContain('Ergebnis: rot.');
    expect(r.code).toBe(1);
    const e = json(plan);
    expect([e.ergebnis, e.fehler.some((f) => f.includes(meldung))]).toEqual(['rot', true]);
  });

test('noch offen vor dem Ja: gelb, Exit 0, und im JSON offen: true', () => {
  const plan = aendere('[Annahme: Ein Klick lädt den Termin als Kalenderdatei]', '[offen: braucht es das?]');
  const r = pruefe(projekt({ 'docs/plan.md': plan }));
  expect([r.code, r.aus.includes('Abnahme noch [offen] bei F2: vor dem Ja zum Plan klären')]).toEqual([0, true]);
  expect(json(plan).bauliste[7]!.offen).toBe(true);
});

test('ohne docs/plan.md: Exit 2', () => {
  expect(pruefe(projekt({})).code).toBe(2);
});

// Umfang im Entwurf: die Testseiten des Entwurfs (scripts/entwurf-pruefen/gut) mit der Bauliste; die Funktion trägt data-bauliste
const mitMarke = (d: string, datei: string, alt: string, neu: string) => {
  const f = join(d, datei);
  const t = readFileSync(f, 'utf8');
  if (!t.includes(alt)) throw new Error(`${datei}: «${alt}» nicht gefunden`);
  writeFileSync(f, t.replace(alt, neu));
};
const entwurf = () => {
  const d = projekt({ 'docs/plan.md': PLAN }, true);
  mitMarke(d, 'design/entwurf/mitspielen.html', '<form action=', '<form data-bauliste="F1" action=');
  mitMarke(d, 'design/entwurf/konzerte.html', '<main', '<main data-bauliste="F2"');
  return d;
};

test('--entwurf, gut: alle acht Einträge kommen vor (Impressum und Datenschutz sind im Entwurf nicht nötig)', () => {
  const r = pruefe(entwurf(), '--entwurf');
  expect(r.aus).toContain('6 von 8 Einträgen der Bauliste kommen im Entwurf vor');
  expect(r.aus).toContain('S5 «Impressum»: im Entwurf nicht nötig');
  expect(r.aus).not.toContain('fehlt im Entwurf');
  expect(r.code).toBe(0);
});

test('--entwurf, eingebauter Fehler: Die Funktion F1 (Muss) ist nirgends gezeigt → rot', () => {
  const d = entwurf();
  mitMarke(d, 'design/entwurf/mitspielen.html', ' data-bauliste="F1"', '');
  const r = pruefe(d, '--entwurf');
  expect(r.aus).toContain('rot     F1 «Anfrage zum Mitspielen» (Muss) fehlt im Entwurf: Keine Stelle trägt data-bauliste="F1"');
  expect(r.code).toBe(1);
});

test('--entwurf, eingebauter Fehler: Eine Seite aus dem Plan fehlt → rot; eine Kann-Funktion fehlt → gelb', () => {
  const d = entwurf();
  rmSync(join(d, 'design/entwurf/ueber-uns.html'));
  mitMarke(d, 'design/entwurf/konzerte.html', ' data-bauliste="F2"', '');
  const r = pruefe(d, '--entwurf');
  expect(r.aus).toContain('rot     S3 «Über uns» (Muss) fehlt im Entwurf: design/entwurf/ueber-uns.html gibt es nicht');
  expect(r.aus).toContain('gelb    F2 «Konzert im Kalender speichern» (Kann) fehlt im Entwurf');
  expect(r.code).toBe(1);
});

test('--entwurf: eine Kennung im Entwurf, die es in der Bauliste nicht gibt → gelb', () => {
  const d = entwurf();
  mitMarke(d, 'design/entwurf/index.html', '<main', '<main data-bauliste="F7"');
  const r = pruefe(d, '--entwurf');
  expect(r.aus).toContain('gelb    data-bauliste="F7" in design/entwurf/index.html: Diese Kennung gibt es in der Bauliste nicht');
  expect(r.code).toBe(0);
});

// Umfang im Bau: seite/ mit Ordnern statt .html, Impressum und Datenschutz sind jetzt Pflicht
const SEITE = (innen = '') => `<!doctype html><html lang="de"><body><main>${innen}</main></body></html>`;
const bau = (dateien: Record<string, string> = {}) => projekt({
  'docs/plan.md': PLAN,
  'seite/index.html': SEITE(), 'seite/konzerte/index.html': SEITE('<a data-bauliste="F2" href="/jahreskonzert.ics">Im Kalender speichern</a>'), 'seite/ueber-uns/index.html': SEITE(),
  'seite/mitspielen/index.html': SEITE('<form data-bauliste="F1"></form>'), 'seite/impressum/index.html': SEITE(), 'seite/datenschutz/index.html': SEITE(),
  ...dateien,
});

test('--bau, gut: alle acht Einträge sind gebaut', () => {
  const r = pruefe(bau(), '--bau');
  expect(r.aus).toContain('8 von 8 Einträgen der Bauliste kommen im Bau vor');
  expect(r.code).toBe(0);
});

test('--bau, eingebauter Fehler: Die Funktion ist beim Bauen verloren gegangen, das Impressum fehlt → rot', () => {
  const d = bau({ 'seite/mitspielen/index.html': SEITE('<form></form>') });
  rmSync(join(d, 'seite/impressum'), { recursive: true });
  const r = pruefe(d, '--bau');
  expect(r.aus).toContain('rot     F1 «Anfrage zum Mitspielen» (Muss) fehlt im Bau: Keine Stelle trägt data-bauliste="F1"');
  expect(r.aus).toContain('rot     S5 «Impressum» (Muss) fehlt im Bau');
  expect(r.code).toBe(1);
});

test('--bau <ordner>: auch dist/', () => {
  const d = projekt({ 'docs/plan.md': PLAN, 'dist/index.html': SEITE() });
  const r = pruefe(d, '--bau', 'dist');
  expect(r.aus).toContain('S2 «Konzerte» (Muss) fehlt im Bau: dist/konzerte.html gibt es nicht');
  expect(r.code).toBe(1);
});
