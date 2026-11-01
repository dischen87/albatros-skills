// Prüfbefehle der Skills (Welle 6, w6-42 und w6-43, 01.11.2026). Die KI prüft Zeilen des Vertrags mit grep, so wie die Befehle wörtlich
// in den Skills stehen (vier Sprachen). Dieser Test zieht die Befehle heraus, lässt sie mit sh gegen Beispielzeilen laufen (das grep des
// Rechners: BSD auf dem Mac, GNU in CI) und vergleicht mit der Regel dahinter:
// - «Freigegeben:» in docs/prd.md (lancieren): wie albatros kit jaBelegt, hier nachgebaut in scripts/punkte.ts (jaBelegt, Tabelle wie
//   JA_FAELLE in punkte.test.ts): Es zählt die letzte solche Zeile, vorne ein Datum mit Jahr 19xx oder 20xx, nirgends eine Annahme-Marke.
//   Vorher nahm `grep -m1 -E '^Freigegeben: [0-9]'` auch «1 Seite fehlt noch», «31.10.2026 [Annahme: …]» und eine ältere Zeile über
//   einer offenen (Gegenprobe texte-b, Welle 5).
// - «Eingang:» in docs/betrieb.md (lancieren, bausteine): das deutsche Wort ja vorne, danach kein Buchstabe (betrieb, bausteine §7).
//   Vorher nahm `grep -E '^Eingang: ja'` auch «Eingang: jamais» (grep-probe der Gegenprobe texte-b).
// Windows (findstr) läuft hier nicht; dort steht der Befehl so nah wie möglich daneben, den Rest entscheidet lage.
import { afterAll, expect, test } from 'bun:test';
import { Glob } from 'bun';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ladeFahrplan } from './fahrplan.ts';
import { jaBelegt } from './punkte.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const geladen = await ladeFahrplan(wurzel);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const F = geladen.fahrplan;
const ordner = mkdtempSync(join(tmpdir(), 'pruefbefehle-'));
mkdirSync(join(ordner, 'docs'));
afterAll(() => rmSync(ordner, { recursive: true, force: true }));

// Befehle mit grep auf `ziel` aus Codeblöcken (Zeilen mit \ am Ende zusammengefügt, ein Kommentar « # …» am Ende fällt weg) und aus `…`.
// Seit 01.11.2026 (w7-26) auch mit Umgebung davor («LC_ALL=C grep …»): Der Freigabe-Befehl läuft so, damit grep auf jedem Rechner gleich
// zählt; ohne das fände der Test ihn nicht mehr.
const MIT_GREP = /^(?:[A-Z_][A-Z0-9_]*=\S*\s+)*grep /;
export function befehle(text: string, ziel: string): string[] {
  const aus: string[] = [];
  let block = false;
  let zeile = '';
  for (const z of text.split('\n')) {
    if (/^\s*```/.test(z)) {
      block = !block;
      continue;
    }
    if (!block) {
      for (const t of z.matchAll(/`((?:[A-Z_][A-Z0-9_]*=\S*\s+)*grep [^`]+)`/g)) if (t[1]!.includes(ziel)) aus.push(t[1]!);
      continue;
    }
    zeile += z.replace(/\\$/, ' ');
    if (z.endsWith('\\')) continue;
    const befehl = zeile.replace(/\s+#\s.*$/, '').replace(/\s+/g, ' ').trim();
    zeile = '';
    if (MIT_GREP.test(befehl) && befehl.includes(ziel)) aus.push(befehl);
  }
  return aus;
}

const skills = async () => {
  const s: { datei: string; text: string }[] = [];
  for (const datei of new Glob('plugins/*/skills/*/SKILL.md').scanSync(wurzel)) s.push({ datei, text: await Bun.file(wurzel + datei).text() });
  return s;
};
// Trifft der Befehl, wenn die Datei `ziel` diesen Inhalt hat? Wie in den Skills: Er zeigt eine Zeile. Mit der Sprache des Rechners, mit
// LC_ALL=C.UTF-8 und mit LC_ALL=C; jedes Mal muss dasselbe herauskommen. C.UTF-8 steht seit 01.11.2026 ausdrücklich dabei: Ohne LANG (wie
// in der Umgebung der Agenten) liefen vorher beide Male wie C, und was grep -i mit UTF-8 anders macht, blieb ungeprüft.
// Derselbe Befehl steht in vier Sprachen und in lancieren zweimal (Teil 1 und 2), wörtlich gleich: Er läuft je Wortlaut und Inhalt nur
// einmal, das Urteil gilt für jede Stelle mit diesem Wortlaut (gleicher Befehl, gleiche Datei, gleiches sh: gleiches Ergebnis). Vorher
// startete der Freigabe-Test 448 sh-Aufrufe (8 Befehle × 28 Fälle × 2 Sprach-Einstellungen), brauchte allein 2,3 s und lief mit 12
// gleichzeitigen Läufen 12 von 12 Mal in das Timeout von 5 s (Gegenprobe texte, 01.11.2026; Messung lauf3/pruefbefehle-parallel12-vorher.log).
const urteile = new Map<string, boolean>();
const trifft = (befehl: string, ziel: string, inhalt: string) => {
  const schluessel = JSON.stringify([befehl, ziel, inhalt]);
  const bekannt = urteile.get(schluessel);
  if (bekannt !== undefined) return bekannt;
  writeFileSync(join(ordner, ziel), inhalt);
  const sprachen = { [`des Rechners (${process.env.LC_ALL || process.env.LANG || 'ohne LANG'})`]: process.env, 'C.UTF-8': { ...process.env, LC_ALL: 'C.UTF-8' }, C: { ...process.env, LC_ALL: 'C' } };
  const je = Object.entries(sprachen).map(([name, env]) => {
    const r = Bun.spawnSync(['sh', '-c', befehl], { cwd: ordner, env });
    if (r.exitCode > 1) throw new Error(`${befehl}: ${r.stderr.toString()}`);
    return [name, r.stdout.toString().trim() !== ''] as const;
  });
  if (new Set(je.map(([, u]) => u)).size > 1) throw new Error(`${befehl}: je nach Sprache anders bei ${JSON.stringify(inhalt)}: ${je.map(([n, u]) => `${n} ${u ? 'trifft' : 'trifft nicht'}`).join(', ')}`);
  urteile.set(schluessel, je[0]![1]);
  return je[0]![1];
};
// Diese Tests starten Prozesse (sh, grep, tail, tr); wie lange das dauert, hängt von der Last auf dem Rechner ab, nicht vom geprüften Text.
// Darum ein eigenes Timeout statt der 5 s von bun test (01.11.2026, Gegenprobe texte: auf dem geteilten Rechner zufällig rot).
const MIT_PROZESSEN = 30_000;

// Zeilen in docs/prd.md (je Fall die ganze Datei) und was kit jaBelegt dazu sagt; dazu die Fälle aus der Gegenprobe und aus w6-43
const FREIGABEN: string[][] = [
  ['Freigegeben: 31.10.2026, «Ja, so live»'], ['Freigegeben: 2026-10-31 «Ja»'], ['Freigegeben: 31. Oktober 2026, «Ja»'],
  ['- **Freigegeben:** 31.10.2026, «Ja»'], ['> Freigegeben: 31.10.2026'], ['Freigegeben: **31.10.2026**, «Ja»'],
  ['Freigegeben: [offen]', 'Freigegeben: 31.10.2026, «Ja»'], ['Freigegeben: noch nicht'], ['Freigegeben: [Annahme: passt]'],
  ['Freigegeben: [Annahme: ja]'], ['Freigegeben: 31.10.2026 [Annahme: hat nicht widersprochen]'], ['Freigegeben: [hypothèse : oui]'],
  ['Freigegeben: 31.10.2026, « oui » [hypothèse : relu]'], ['Freigegeben: 31.10.2026 [ipotesi: sì]'], ['Freigegeben: 31.10.2026 [Assumption: yes]'],
  ['Freigegeben: 31.10.2026, «Ja» [Annahmen geprüft]'], ['Freigegeben: <TT.MM.JJJJ>, ‹<ihre Worte>›'], ['Freigegeben: 31.10., «Ja»'],
  ['Freigegeben: ja, am 31.10.2026'], ['Freigegeben: 1 Seite fehlt noch'], ['Freigegeben: pas encore'], ['Freigegeben: 12/31/2026, yes'],
  ['Freigegeben: 30.10.2026, «Ja»', 'Freigegeben: [offen: neue Rückmeldung]'], ['Freigegeben: 30.10.2026, «Ja»', 'Freigegeben: 02.11.2026, «Ja, neu»'],
  ['Freigegeben:'], [], ['Freigegeben zum Bauen: 31.10.2026'], ['Abgeleitet aus: docs/entwurf.md', 'Freigegeben:\t31.10.2026, «Ja»'],
  // Grenzfälle der Gegenprobe texte (01.11.2026, repro/w6-43-rand.ts): Das Datum zählt nur direkt hinter dem ersten «Freigegeben:» der Zeile
  // (vorher nahm der Befehl ein zweites weiter hinten), Leerraum am Ende zählt nicht (kit schneidet ihn ab), und eine Annahme-Marke in
  // Grossbuchstaben mit Akzent gilt auch mit LC_ALL=C (dort kennt grep -i nur a bis z)
  ['Freigegeben: [offen] (Freigegeben: 31.10.2026 war der alte Stand)'], ['Freigegeben: noch nicht, Freigegeben: 31.10.2026 kommt erst'],
  ['Freigegeben: 2026 '], ['Freigegeben: 2026 \t'], ['Freigegeben: 2026'], ['Freigegeben: 31 Oktober 2026, «Ja»'], [' Freigegeben: 31.10.2026, «Ja»'],
  ['Freigegeben: 31.10.2026, «Ja»\r'], ['Freigegeben: 31.10.2026 [HYPOTHÈSE : relu]'], ['Freigegeben: 31.10.2026 [HypothÈse : relu]'],
  ['Freigegeben: [HYPOTHÈSE : oui] 31.10.2026'], ['Freigegeben: 31.10.2026, «Ja»', '* Freigegeben: noch nicht'],
];

test('Freigabe: jeder Befehl in lancieren (vier Sprachen, Teil 1 und 2) urteilt wie kit jaBelegt', async () => {
  const gefunden = (await skills()).flatMap(({ datei, text }) => befehle(text, 'docs/prd.md').filter((b) => b.includes('Freigegeben')).map((b) => [datei, b] as const));
  expect(gefunden.filter(([d]) => d.includes('/lancieren/')).length).toBeGreaterThanOrEqual(8);
  // Die Regel steht nicht schon in jeder Zeile gleich: Es gibt Fälle mit Ja und ohne
  expect(new Set(FREIGABEN.map((z) => jaBelegt(F, z.join('\n'), 'Freigegeben:'))).size).toBe(2);
  const abweichungen: string[] = [];
  for (const [datei, b] of gefunden)
    for (const z of FREIGABEN) {
      const inhalt = z.length ? `# PRD\n${z.join('\n')}\n` : '# PRD\n';
      const [g, r] = [trifft(b, 'docs/prd.md', inhalt), jaBelegt(F, inhalt, 'Freigegeben:')];
      if (g !== r) abweichungen.push(`${datei}: ${JSON.stringify(z)} grep ${g ? 'frei' : 'nicht frei'}, Regel ${r ? 'frei' : 'nicht frei'} (${b})`);
    }
  expect(abweichungen).toEqual([]);
}, MIT_PROZESSEN);

// Welle 7, w7-26 (01.11.2026): Leerraum ausserhalb von ASCII (U+00A0, U+2003, U+202F, U+2028, U+FEFF) kennt kit (JS \s) als Leerraum, grep
// je nach Rechner und Sprach-Einstellung nicht (LC_ALL=C nie, glibc auch mit UTF-8 nicht für U+00A0 und U+202F). Darum nahm der Befehl eine
// ältere Zeile «Freigegeben: <Datum>» über einer neueren mit U+00A0 davor: frei, wo kit «nicht frei» sagt (Gegenprobe texte,
// runde2/repro/w6-43-runde2.ts: 32 Abweichungen in der unsicheren Richtung, je ohne LANG und mit LC_ALL=C). Hier gilt: in keiner
// Sprach-Einstellung frei, wo kit nicht frei sagt. Strenger als kit darf der Befehl sein (U+00A0 direkt hinter «Freigegeben:»): Dann
// schreibt die KI die Zeile mit normalem Leerzeichen neu.
const [NBSP, GEVIERT, SCHMAL, ZEILE, BOM, NEL] = ['\u00a0', '\u2003', '\u202f', '\u2028', '\ufeff', '\u0085'];
const UNICODE_LEERRAUM: string[][] = [
  ['Freigegeben: 31.10.2026, «Ja»', `${NBSP}Freigegeben: noch nicht`], ['Freigegeben: 31.10.2026, «Ja»', `${GEVIERT}Freigegeben: [offen: neue Rückmeldung]`],
  ['Freigegeben: 30.10.2026, «Ja»', `${SCHMAL}- Freigegeben: 01.11.2026 [Annahme: passt]`], ['Freigegeben: 31.10.2026, «Ja»', `>${NBSP}Freigegeben: noch nicht`],
  ['Freigegeben: 31.10.2026, «Ja»', `${ZEILE}Freigegeben: noch nicht`], ['Freigegeben: 31.10.2026, «Ja»', `${BOM}Freigegeben: [offen]`],
  [`Freigegeben: 2026 ${NBSP}`], [`Freigegeben: 2026${NBSP}`], [`Freigegeben: 2026 ${SCHMAL}${GEVIERT}`], [`Freigegeben: 2026 ${NBSP}«${NBSP}»`],
  [`Freigegeben:${NBSP}31.10.2026, «Ja»`], [`${NBSP}Freigegeben: 31.10.2026, «Ja»`], [`Freigegeben: 31.10.2026${NBSP}[Annahme: passt]`],
  // kit zählt U+0085 nicht als Leerraum: Die Zeile davor gilt, sie ist frei (manche grep kennen U+0085 als [[:space:]])
  ['Freigegeben: noch nicht', `${NEL}Freigegeben: 31.10.2026, «Ja»`],
];
test('Freigabe: mit Leerraum ausserhalb von ASCII nie frei, wo kit nicht frei sagt, in jeder Sprach-Einstellung', async () => {
  const gefunden = (await skills()).flatMap(({ datei, text }) => befehle(text, 'docs/prd.md').filter((b) => b.includes('Freigegeben')).map((b) => [datei, b] as const));
  expect(gefunden.filter(([d]) => d.includes('/lancieren/')).length).toBeGreaterThanOrEqual(8);
  const ohne = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'LANG' && !k.startsWith('LC_')));
  const sprachen: Record<string, Record<string, string | undefined>> = {
    'des Rechners': process.env, 'ohne LANG': ohne, C: { ...ohne, LC_ALL: 'C' }, 'C.UTF-8': { ...ohne, LC_ALL: 'C.UTF-8' }, 'en_US.UTF-8': { ...ohne, LC_ALL: 'en_US.UTF-8' },
  };
  const unsicher: string[] = [];
  for (const b of new Set(gefunden.map(([, x]) => x)))
    for (const z of UNICODE_LEERRAUM) {
      const inhalt = `# PRD\n${z.join('\n')}\n`;
      if (jaBelegt(F, inhalt, 'Freigegeben:')) continue;
      writeFileSync(join(ordner, 'docs/prd.md'), inhalt);
      for (const [name, env] of Object.entries(sprachen)) {
        const r = Bun.spawnSync(['sh', '-c', b], { cwd: ordner, env });
        if (r.exitCode > 1) throw new Error(`${b}: ${r.stderr.toString()}`);
        if (r.stdout.toString().trim() !== '') unsicher.push(`${name}: ${JSON.stringify(z)} grep frei, kit nicht frei (${b})`);
      }
    }
  expect(unsicher).toEqual([]);
}, MIT_PROZESSEN);

// Nachbesserung Welle 7 (01.11.2026, Gegenprobe zu w7-26): Die erste Stufe nahm jede Zeile ohne Buchstaben vor «Freigegeben:» als letzte,
// auch «| Freigegeben: | Datum |», «<!-- Freigegeben: noch nicht -->» oder «- [ ] Freigegeben: [offen]» unter der datierten Zeile; kit
// zählt sie nicht (vorne fallen nur Leerraum, >, * und - weg). Der Befehl sagte dann «nicht frei», wo kit und der Befehl vor w7-26 «frei»
// sagten (9 von 21 Zeilen der Gegenprobe, freigabe-neu-strenger.log). Jetzt zählen wie bei kit nur Leerraum, >, * und - davor, dazu jedes
// Zeichen ausserhalb von ASCII (grep kennt mit LC_ALL=C keinen Unicode-Leerraum; so bleibt der Befehl nie freier als kit). Strenger als kit
// bleibt er nur mit einem Zeichen ausserhalb von ASCII vor «Freigegeben:» oder direkt hinter einer Jahreszahl allein (STRENGER).
const REALISTISCH: string[][] = [
  ['Freigegeben: 31.10.2026, «Ja, so online»'], ['Freigegeben: 31.10.2026, « oui, c\'est bon »'], ['Freigegeben: 31.10.2026, “yes, ship it”'],
  ['Freigegeben: 2026-10-31, «Ja»'], ['Freigegeben: 31. Oktober 2026, «Ja»'], ['**Freigegeben:** 31.10.2026, «Ja»'], ['- Freigegeben: 31.10.2026 ✓'],
  ['Freigegeben: 2026 – «Ja»'], ['Freigegeben: 2026 «Ja»'], ['Freigegeben: 31.10.2026 — Anna: «passt»'],
  ['Freigegeben: 31.10.2026, «Ja»', '| Freigegeben: | Datum |'], ['Freigegeben: 31.10.2026, «Ja»', '# Freigegeben: siehe unten'],
  ['Freigegeben: 31.10.2026, «Ja»', '"Freigegeben: noch nicht" war der alte Stand'], ['Freigegeben: 31.10.2026, «Ja»', '(Freigegeben: noch nicht)'],
  ['Freigegeben: 31.10.2026, «Ja»', '1. Freigegeben: noch nicht'], ['Freigegeben: 31.10.2026, «Ja»', '`Freigegeben:` kommt nach der Begehung'],
  ['Freigegeben: 31.10.2026, «Ja»', '<!-- Freigegeben: noch nicht -->'], ['Freigegeben: 31.10.2026, «Ja»', '_Freigegeben:_ 31.10.2026'],
  ['Freigegeben: 31.10.2026, «Ja»', '- [ ] Freigegeben: [offen]'], ['Freigegeben: 31.10.2026, «Ja»', '> Freigegeben: 01.11.2026, «Ja, nochmals»'],
  ['Freigegeben: 31.10.2026, «Ja»', '+ Freigegeben: noch nicht'], ['Freigegeben: 31.10.2026, «Ja»', ': Freigegeben: noch nicht'],
  ['Freigegeben: 31.10.2026, «Ja»', "'Freigegeben: noch nicht'"], ['Freigegeben: 31.10.2026, «Ja»', '~~Freigegeben: noch nicht~~'],
];
const STRENGER: string[][] = [['Freigegeben: 2026 ✓'], ['Freigegeben: 31.10.2026, «Ja»', '• Freigegeben: noch nicht'], ['Freigegeben: 31.10.2026, «Ja»', '«Freigegeben: noch nicht»']];
test('Freigabe: Zeilen mit Satzzeichen vor «Freigegeben:» zählen wie bei kit nicht; strenger nur mit Zeichen ausserhalb von ASCII', async () => {
  const gefunden = (await skills()).flatMap(({ datei, text }) => befehle(text, 'docs/prd.md').filter((b) => b.includes('Freigegeben')).map((b) => [datei, b] as const));
  expect(gefunden.filter(([d]) => d.includes('/lancieren/')).length).toBeGreaterThanOrEqual(8);
  const abweichungen: string[] = [];
  for (const [datei, b] of gefunden)
    for (const z of [...REALISTISCH, ...STRENGER]) {
      const inhalt = `# PRD\n${z.join('\n')}\n`;
      const [g, r] = [trifft(b, 'docs/prd.md', inhalt), jaBelegt(F, inhalt, 'Freigegeben:')];
      const erwartet = STRENGER.includes(z) ? false : r;
      if (g !== erwartet) abweichungen.push(`${datei}: ${JSON.stringify(z)} grep ${g ? 'frei' : 'nicht frei'}, erwartet ${erwartet ? 'frei' : 'nicht frei'} (kit ${r ? 'frei' : 'nicht frei'})`);
    }
  expect(abweichungen).toEqual([]);
  // STRENGER ist wirklich strenger als kit (sonst gehört der Fall zu REALISTISCH)
  expect(STRENGER.filter((z) => !jaBelegt(F, `# PRD\n${z.join('\n')}\n`, 'Freigegeben:'))).toEqual([]);
}, MIT_PROZESSEN);

// Nachbesserung Welle 7 (01.11.2026, Gegenprobe zu w7-26, freigabe-latin1.log): Eine docs/prd.md mit Bytes, die kein UTF-8 sind (Latin-1 aus
// einem alten Editor). tr ohne LC_ALL=C meldet mit UTF-8-Sprache «Illegal byte sequence» und schneidet die Zeile davor ab (BSD): Eine
// [Annahme] dahinter fiel weg, der Befehl sagte frei, kit (liest UTF-8, ungültige Bytes als U+FFFD) nicht frei. Schon vor w7-26 so.
const L1 = (...teile: (string | number)[]) => new Uint8Array(teile.flatMap((t) => (typeof t === 'number' ? [t] : [...new TextEncoder().encode(t)])));
const LATIN1: Uint8Array[] = [
  L1('# PRD\nFreigegeben: 31.10.2026 ', 0xab, ' [Annahme: passt]\n'), L1('# PRD\nFreigegeben: 30.10.2026, Ja\nFreigegeben: 31.10.2026 M', 0xe4, 'rz [Annahme]\n'),
  L1('# PRD\nFreigegeben: 30.10.2026, Ja\nFreigegeben: 31.10.2026 ', 0xe4, ' [ipotesi: s', 0xec, ']\n'), L1('# PRD\nFreigegeben: 31.10.2026, ', 0xab, 'Ja', 0xbb, ' [Annahme: passt]\n'),
];
test('Freigabe: docs/prd.md in Latin-1 nie frei, wo kit nicht frei sagt, in jeder Sprach-Einstellung', async () => {
  const gefunden = (await skills()).flatMap(({ text }) => befehle(text, 'docs/prd.md').filter((b) => b.includes('Freigegeben')));
  expect(gefunden.length).toBeGreaterThanOrEqual(8);
  const ohne = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'LANG' && !k.startsWith('LC_')));
  const sprachen: Record<string, Record<string, string | undefined>> = {
    'des Rechners': process.env, 'ohne LANG': ohne, C: { ...ohne, LC_ALL: 'C' }, 'C.UTF-8': { ...ohne, LC_ALL: 'C.UTF-8' }, 'en_US.UTF-8': { ...ohne, LC_ALL: 'en_US.UTF-8' },
  };
  const unsicher: string[] = [];
  for (const b of new Set(gefunden))
    for (const bytes of LATIN1) {
      expect(jaBelegt(F, new TextDecoder().decode(bytes), 'Freigegeben:')).toBe(false);
      writeFileSync(join(ordner, 'docs/prd.md'), bytes);
      for (const [name, env] of Object.entries(sprachen)) {
        const r = Bun.spawnSync(['sh', '-c', b], { cwd: ordner, env });
        if (r.exitCode > 1) throw new Error(`${b}: ${r.stderr.toString()}`);
        if (r.stdout.toString().trim() !== '') unsicher.push(`${name}: ${JSON.stringify(new TextDecoder().decode(bytes))} grep frei, kit nicht frei (${b})`);
      }
    }
  expect(unsicher).toEqual([]);
}, MIT_PROZESSEN);

// Nachbesserung Welle 7 (01.11.2026): In Claude Code ist grep in der Shell der KI (zsh) eine Funktion, die das eingebaute ugrep ruft (so im
// Shell-Schnappschuss von Claude Code 2.1.309: ARGV0=ugrep "$CLAUDE_CODE_EXECPATH" -G --ignore-files --hidden -I …). Die Befehle der Skills
// laufen bei Lernenden mit Claude Code also mit ugrep, nicht mit dem grep, das sh hier nimmt. ugrep kennt Unicode: [[:punct:]] ohne |, `, ~
// und + (Symbole), ein leeres [^[:print:][:cntrl:]] ist ein Fehler. Gemessen vor dieser Nachbesserung mit 624 Dateien: ugrep 0 unsicher, 26
// strenger als kit; danach 0 und 15 (welle7/skills/runde2/freigabe). Dieser Test läuft nur in Claude Code mit zsh; CI prüft sh mit GNU grep.
const CC = process.env.CLAUDE_CODE_EXECPATH;
const MIT_UGREP = !!CC && existsSync(CC) && Bun.which('zsh') !== null;
test.skipIf(!MIT_UGREP)('Freigabe: auch mit dem grep von Claude Code (ugrep) nie frei, wo kit nicht frei sagt; die Zeilen der Gegenprobe wie kit', async () => {
  const gefunden = new Set((await skills()).flatMap(({ text }) => befehle(text, 'docs/prd.md').filter((b) => b.includes('Freigegeben'))));
  const funktion = `grep() { ARGV0=ugrep "${CC}" -G --ignore-files --hidden -I "$@"; }`;
  const ohne = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'LANG' && !k.startsWith('LC_')));
  const sprachen: Record<string, Record<string, string | undefined>> = { 'ohne LANG': ohne, C: { ...ohne, LC_ALL: 'C' }, 'C.UTF-8': { ...ohne, LC_ALL: 'C.UTF-8' }, 'en_US.UTF-8': { ...ohne, LC_ALL: 'en_US.UTF-8' } };
  const text = (z: string[]) => new TextEncoder().encode(z.length ? `# PRD\n${z.join('\n')}\n` : '# PRD\n');
  // gleich: muss wie kit urteilen; sonst nur nie freier als kit
  const faelle: [Uint8Array, boolean][] = [...[...FREIGABEN, ...REALISTISCH].map((z) => [text(z), true] as [Uint8Array, boolean]),
    ...[...UNICODE_LEERRAUM, ...STRENGER].map((z) => [text(z), false] as [Uint8Array, boolean]), ...LATIN1.map((b) => [b, false] as [Uint8Array, boolean])];
  const falsch: string[] = [];
  for (const b of gefunden)
    for (const [bytes, gleich] of faelle) {
      const k = jaBelegt(F, new TextDecoder().decode(bytes), 'Freigegeben:');
      writeFileSync(join(ordner, 'docs/prd.md'), bytes);
      for (const [name, env] of Object.entries(sprachen)) {
        const r = Bun.spawnSync(['zsh', '-f', '-c', `${funktion}\n${b}`], { cwd: ordner, env });
        if (r.exitCode > 1) throw new Error(`ugrep ${name}: ${r.stderr.toString()} (${b})`);
        const g = r.stdout.toString().trim() !== '';
        if ((g && !k) || (gleich && g !== k)) falsch.push(`ugrep ${name}: ${JSON.stringify(new TextDecoder().decode(bytes))} grep ${g ? 'frei' : 'nicht frei'}, kit ${k ? 'frei' : 'nicht frei'}`);
      }
    }
  expect(falsch).toEqual([]);
}, 120_000);

// Zeilen «Eingang:» in docs/betrieb.md: nur das deutsche ja vorne, danach kein Buchstabe
const EINGAENGE: [string, boolean][] = [
  ['Eingang: ja – /intern/ und die Mitteilungen aus PocketBase brauchen dieselbe Anmeldung', true], ['Eingang: ja, /intern/ et les messages', true],
  ['Eingang: ja', true], ['Eingang: ja (Kriterien erfüllt)', true], ['Eingang: jamais, pas de connexion', false], ['Eingang: javascript genügt', false],
  ['Eingang: nicht nötig – nur das Rezept mitglieder', false], ['Eingang: [Annahme: ja]', false], ['Eingang: [offen: Betrieb]', false],
  ['Eingang: oui, même connexion', false], ['Eingang:', false],
];

test('Eingang: jeder Befehl in den Skills (vier Sprachen) nimmt nur das deutsche ja vorne, nicht «jamais»', async () => {
  const gefunden = (await skills()).flatMap(({ datei, text }) => befehle(text, 'docs/betrieb.md').filter((b) => b.includes('Eingang')).map((b) => [datei, b] as const));
  expect(gefunden.filter(([d]) => d.includes('/lancieren/')).length).toBeGreaterThanOrEqual(4);
  const abweichungen: string[] = [];
  for (const [datei, b] of gefunden)
    for (const [z, ja] of EINGAENGE)
      if (trifft(b, 'docs/betrieb.md', `Rückmeldungen: Formular\n${z}\nStatistik: nein\n`) !== ja) abweichungen.push(`${datei}: «${z}» ${ja ? 'nicht erkannt' : 'als ja genommen'} (${b})`);
  expect(abweichungen).toEqual([]);
}, MIT_PROZESSEN);

test('befehle(): Codeblock mit \\ und Kommentar, Befehl in `…`, andere Dateien nicht, Umgebung davor', () => {
  expect(befehle("```bash\nLC_ALL=C grep -E 'a' docs/prd.md | LC_ALL=C grep -v b\n```\nText `LC_ALL=C grep x docs/prd.md`.\n", 'docs/prd.md'))
    .toEqual(["LC_ALL=C grep -E 'a' docs/prd.md | LC_ALL=C grep -v b", 'LC_ALL=C grep x docs/prd.md']);
  const text = "Text `grep -E '^Eingang: ja' docs/betrieb.md` und `grep x docs/plan.md`.\n```bash\ngrep -E 'a' docs/prd.md | tail -n 1 \\\n  | grep -v b   # Kommentar\ngit status\n```\n";
  expect(befehle(text, 'docs/betrieb.md')).toEqual(["grep -E '^Eingang: ja' docs/betrieb.md"]);
  expect(befehle(text, 'docs/prd.md')).toEqual(["grep -E 'a' docs/prd.md | tail -n 1 | grep -v b"]);
});
