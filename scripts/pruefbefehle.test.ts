// Prüfbefehle der Skills (Welle 6, w6-42 und w6-43, 01.11.2026), so wie sie wörtlich in den Skills stehen (vier Sprachen), gegen die Regel
// dahinter:
// - «Freigegeben:» in docs/prd.md (lancieren, Teil 1 und 2): seit Welle 8 (w8-46, Entscheid w7-freigabe-node, 01.11.2026) mit
//   `node scripts/pruefen.mjs --freigabe` (Skill webseite-bauen) statt grep und findstr. pruefen.mjs nimmt Zeichen für Zeichen die
//   Ausdrücke von albatros kit jaWert und jaBelegt, darum urteilt es in jedem Fall wie kit, auf jedem Rechner und in jeder Sprach-Einstellung,
//   auch unter Windows. Der grep-Befehl davor war in der sicheren Richtung strenger (24 von 87 Dateien in vier Sprach-Einstellungen mit dem
//   grep des Macs, 8 mit dem ugrep von Claude Code) und sagte bei langem s (ſ) frei, wo kit nicht frei sagt (welle8/skills/w8-46/vorher.log).
//   Die Fälle unten sind die der Wellen 5 bis 7, jetzt alle mit der Erwartung «genau wie kit».
// - «Eingang:» in docs/betrieb.md (lancieren, bausteine): das deutsche Wort ja vorne, danach kein Buchstabe (betrieb, bausteine §7).
//   Vorher nahm `grep -E '^Eingang: ja'` auch «Eingang: jamais» (grep-probe der Gegenprobe texte-b). Dieser Befehl läuft mit sh (das grep
//   des Rechners: BSD auf dem Mac, GNU in CI) und, in Claude Code, mit dessen grep (ugrep).
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
// Derselbe Befehl steht in vier Sprachen und oft mehrfach, wörtlich gleich: Er läuft je Wortlaut und Inhalt nur einmal, das Urteil gilt
// für jede Stelle mit diesem Wortlaut (gleicher Befehl, gleiche Datei, gleiches sh: gleiches Ergebnis). Vorher startete allein der
// Freigabe-Test mit grep 448 sh-Aufrufe und lief mit 12 gleichzeitigen Läufen in das Timeout von 5 s (Gegenprobe texte, 01.11.2026).
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

// Zeilen in docs/prd.md (je Fall die ganze Datei); Fälle der Gegenprobe texte-b (Welle 5) und aus w6-43, dazu die Grenzfälle der Gegenprobe texte
// (01.11.2026, repro/w6-43-rand.ts): ein zweites «Freigegeben:» in der Zeile, Leerraum am Ende, Annahme-Marke mit Akzent in Grossbuchstaben
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

// Welle 7, w7-26 (01.11.2026): Leerraum ausserhalb von ASCII (U+00A0, U+2003, U+202F, U+2028, U+FEFF) kennt kit (JS \s) als Leerraum, grep nicht
// überall; U+0085 kennt kit nicht als Leerraum
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

// Nachbesserung Welle 7 (01.11.2026): Satzzeichen vor «Freigegeben:» in einer späteren Zeile; kit zählt die Zeile nicht (vorne fallen nur
// Leerraum, >, * und - weg). STRENGER: hier war der grep-Befehl strenger als kit (Zeichen ausserhalb von ASCII), node ist es nicht mehr.
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

// Nachbesserung Welle 7 (01.11.2026, freigabe-latin1.log): docs/prd.md mit Bytes, die kein UTF-8 sind (Latin-1 aus einem alten Editor); kit und
// pruefen.mjs lesen UTF-8, ungültige Bytes als U+FFFD
const L1 = (...teile: (string | number)[]) => new Uint8Array(teile.flatMap((t) => (typeof t === 'number' ? [t] : [...new TextEncoder().encode(t)])));
const LATIN1: Uint8Array[] = [
  L1('# PRD\nFreigegeben: 31.10.2026 ', 0xab, ' [Annahme: passt]\n'), L1('# PRD\nFreigegeben: 30.10.2026, Ja\nFreigegeben: 31.10.2026 M', 0xe4, 'rz [Annahme]\n'),
  L1('# PRD\nFreigegeben: 30.10.2026, Ja\nFreigegeben: 31.10.2026 ', 0xe4, ' [ipotesi: s', 0xec, ']\n'), L1('# PRD\nFreigegeben: 31.10.2026, ', 0xab, 'Ja', 0xbb, ' [Annahme: passt]\n'),
];
// Gegenprobe 2 von Welle 7 (runde2/kit-falten.ts): kit faltet mit den Flags iu das lange s (ſ) zu s; der grep-Befehl sagte hier frei
const LANGES_S: string[][] = [['Freigegeben: 31.10.2026, [aſſumption: ok]'], ['Freigegeben: 30.10.2026, «Ja»', 'Freigegeben: 31.10.2026 [Annahme: paſst]']];

const text = (z: string[]) => new TextEncoder().encode(z.length ? `# PRD\n${z.join('\n')}\n` : '# PRD\n');
const FREIGABE_FAELLE: Uint8Array[] = [...[...FREIGABEN, ...UNICODE_LEERRAUM, ...REALISTISCH, ...STRENGER, ...LANGES_S].map(text), ...LATIN1];

test('Freigabe: lancieren (vier Sprachen, Teil 1 und 2) prüft mit node scripts/pruefen.mjs --freigabe, ohne grep und findstr', async () => {
  const lancieren = (await skills()).filter(({ datei }) => datei.includes('/lancieren/'));
  expect(lancieren.length).toBe(4);
  for (const { datei, text: t } of lancieren) {
    expect([datei, t.split('\n').filter((z) => z.trim() === 'node scripts/pruefen.mjs --freigabe').length]).toEqual([datei, 2]);
    expect([datei, befehle(t, 'docs/prd.md').filter((b) => b.includes('Freigegeben'))]).toEqual([datei, []]);
    expect([datei, /findstr/.test(t)]).toEqual([datei, false]);
    // vorher die neuste Fassung aus dem Skill webseite-bauen, ältere kennen --freigabe nicht
    expect([datei, (t.match(/^cp <[^>]+>\/\.\.\/webseite-bauen\/pruefen\.mjs scripts\//gm) ?? []).length]).toEqual([datei, 2]);
  }
});

// Urteil von pruefen.mjs --freigabe für docs/prd.md mit diesem Inhalt: frei nur mit Ende 0 und der Zeile «Seite freigegeben: …» (so liest es die
// KI nach lancieren); nicht frei heisst Ende 2. Alles andere ist ein Fehler des Skripts.
const PRUEFEN = `${wurzel}plugins/albatros/skills/webseite-bauen/pruefen.mjs`;
const NODE = Bun.which('node');
async function freigabeVonNode(inhalt: Uint8Array): Promise<boolean> {
  const d = mkdtempSync(join(ordner, 'freigabe-'));
  mkdirSync(join(d, 'docs'));
  writeFileSync(join(d, 'docs/prd.md'), inhalt);
  const p = Bun.spawn([NODE!, PRUEFEN, '--freigabe'], { cwd: d, stdout: 'pipe', stderr: 'pipe' });
  const [aus, code] = await Promise.all([new Response(p.stdout).text(), p.exited]);
  if (code !== 0 && code !== 2) throw new Error(`pruefen.mjs --freigabe: Ende ${code} ${await new Response(p.stderr).text()}`);
  const frei = code === 0 && /^Seite freigegeben: /m.test(aus);
  if (code === 0 && !frei) throw new Error(`pruefen.mjs --freigabe: Ende 0 ohne «Seite freigegeben:» (${aus})`);
  return frei;
}
// Das echte kit, wenn albatros daneben liegt (ALBATROS oder ../albatros): punkte.ts baut es nach, hier zählt auch das Original
const ALBATROS = process.env.ALBATROS ?? `${wurzel}../albatros`;
const KIT = `${ALBATROS}/packages/kit/src/phasen.ts`;

test.skipIf(!NODE)('Freigabe: pruefen.mjs --freigabe urteilt in jedem Fall genau wie kit jaBelegt', async () => {
  const kit = existsSync(KIT) ? ((await import(KIT)) as { jaBelegt: (zeilen: readonly string[], anfang: string) => boolean }).jaBelegt : null;
  const urteile = await Promise.all(FREIGABE_FAELLE.map(freigabeVonNode));
  const anders: string[] = [];
  FREIGABE_FAELLE.forEach((bytes, i) => {
    const inhalt = new TextDecoder().decode(bytes);
    const regel = jaBelegt(F, inhalt, 'Freigegeben:');
    if (kit && kit(inhalt.split('\n'), 'Freigegeben:') !== regel) anders.push(`punkte.ts anders als kit: ${JSON.stringify(inhalt)}`);
    if (urteile[i] !== regel) anders.push(`${JSON.stringify(inhalt)}: pruefen.mjs ${urteile[i] ? 'frei' : 'nicht frei'}, kit ${regel ? 'frei' : 'nicht frei'}`);
  });
  expect(anders).toEqual([]);
  // Die Fälle trennen: es gibt freie und nicht freie, auch unter den Fällen, in denen grep strenger war
  expect(new Set(urteile).size).toBe(2);
  expect(STRENGER.every((z) => jaBelegt(F, `# PRD\n${z.join('\n')}\n`, 'Freigegeben:'))).toBe(true);
  expect(FREIGABE_FAELLE.length).toBe(FREIGABEN.length + UNICODE_LEERRAUM.length + REALISTISCH.length + STRENGER.length + LANGES_S.length + LATIN1.length);
}, 60_000);

test.skipIf(!NODE)('Freigabe: ohne docs/prd.md nicht frei; «Freigegeben zum Bauen:» zählt nicht als «Freigegeben:»', async () => {
  const d = mkdtempSync(join(ordner, 'ohne-'));
  const r = Bun.spawnSync([NODE!, PRUEFEN, '--freigabe'], { cwd: d });
  expect(r.exitCode).toBe(2);
  expect(r.stderr.toString()).toContain('docs/prd.md fehlt');
  // «Freigegeben zum Bauen:» ist keine Zeile «Freigegeben:»
  expect(await freigabeVonNode(text(['Freigegeben zum Bauen: 31.10.2026']))).toBe(false);
});

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

// In Claude Code ist grep in der Shell der KI (zsh) eine Funktion, die das eingebaute ugrep ruft (Shell-Schnappschuss von Claude Code 2.1.309:
// ARGV0=ugrep "$CLAUDE_CODE_EXECPATH" -G --ignore-files --hidden -I …). Bis Welle 7 prüfte dieser Test den Freigabe-Befehl damit; seit dem
// Wechsel auf node (w8-46, 01.11.2026) den Befehl für «Eingang:», der weiter mit grep läuft (Gegenprobe Welle 7: auf seinen Zeilen gleich).
// Läuft nur in Claude Code mit zsh; CI prüft sh mit GNU grep.
const CC = process.env.CLAUDE_CODE_EXECPATH;
const MIT_UGREP = !!CC && existsSync(CC) && Bun.which('zsh') !== null;
test.skipIf(!MIT_UGREP)('Eingang: auch mit dem grep von Claude Code (ugrep) nur das deutsche ja vorne', async () => {
  const gefunden = new Set((await skills()).flatMap(({ text: t }) => befehle(t, 'docs/betrieb.md').filter((b) => b.includes('Eingang'))));
  expect(gefunden.size).toBeGreaterThanOrEqual(1);
  const funktion = `grep() { ARGV0=ugrep "${CC}" -G --ignore-files --hidden -I "$@"; }`;
  const ohne = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'LANG' && !k.startsWith('LC_')));
  const falsch: string[] = [];
  for (const b of gefunden)
    for (const [z, ja] of EINGAENGE) {
      writeFileSync(join(ordner, 'docs/betrieb.md'), `Rückmeldungen: Formular\n${z}\nStatistik: nein\n`);
      for (const [name, env] of Object.entries({ 'ohne LANG': ohne, C: { ...ohne, LC_ALL: 'C' }, 'C.UTF-8': { ...ohne, LC_ALL: 'C.UTF-8' } })) {
        const r = Bun.spawnSync(['zsh', '-f', '-c', `${funktion}\n${b}`], { cwd: ordner, env });
        if (r.exitCode > 1) throw new Error(`ugrep ${name}: ${r.stderr.toString()} (${b})`);
        if ((r.stdout.toString().trim() !== '') !== ja) falsch.push(`ugrep ${name}: «${z}» ${ja ? 'nicht erkannt' : 'als ja genommen'} (${b})`);
      }
    }
  expect(falsch).toEqual([]);
}, 120_000);

test('befehle(): Codeblock mit \\ und Kommentar, Befehl in `…`, andere Dateien nicht, Umgebung davor', () => {
  expect(befehle("```bash\nLC_ALL=C grep -E 'a' docs/prd.md | LC_ALL=C grep -v b\n```\nText `LC_ALL=C grep x docs/prd.md`.\n", 'docs/prd.md'))
    .toEqual(["LC_ALL=C grep -E 'a' docs/prd.md | LC_ALL=C grep -v b", 'LC_ALL=C grep x docs/prd.md']);
  const text = "Text `grep -E '^Eingang: ja' docs/betrieb.md` und `grep x docs/plan.md`.\n```bash\ngrep -E 'a' docs/prd.md | tail -n 1 \\\n  | grep -v b   # Kommentar\ngit status\n```\n";
  expect(befehle(text, 'docs/betrieb.md')).toEqual(["grep -E '^Eingang: ja' docs/betrieb.md"]);
  expect(befehle(text, 'docs/prd.md')).toEqual(["grep -E 'a' docs/prd.md | tail -n 1 | grep -v b"]);
});
