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
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
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

// Befehle mit grep auf `ziel` aus Codeblöcken (Zeilen mit \ am Ende zusammengefügt, ein Kommentar « # …» am Ende fällt weg) und aus `…`
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
      for (const t of z.matchAll(/`(grep [^`]+)`/g)) if (t[1]!.includes(ziel)) aus.push(t[1]!);
      continue;
    }
    zeile += z.replace(/\\$/, ' ');
    if (z.endsWith('\\')) continue;
    const befehl = zeile.replace(/\s+#\s.*$/, '').replace(/\s+/g, ' ').trim();
    zeile = '';
    if (befehl.startsWith('grep ') && befehl.includes(ziel)) aus.push(befehl);
  }
  return aus;
}

const skills = async () => {
  const s: { datei: string; text: string }[] = [];
  for (const datei of new Glob('plugins/*/skills/*/SKILL.md').scanSync(wurzel)) s.push({ datei, text: await Bun.file(wurzel + datei).text() });
  return s;
};
// Trifft der Befehl, wenn die Datei `ziel` diesen Inhalt hat? Wie in den Skills: Er zeigt eine Zeile. Einmal mit der Sprache des Rechners
// (meist UTF-8), einmal mit LC_ALL=C; beide Male muss dasselbe herauskommen.
const trifft = (befehl: string, ziel: string, inhalt: string) => {
  writeFileSync(join(ordner, ziel), inhalt);
  const urteile = [process.env, { ...process.env, LC_ALL: 'C' }].map((env) => {
    const r = Bun.spawnSync(['sh', '-c', befehl], { cwd: ordner, env });
    if (r.exitCode > 1) throw new Error(`${befehl}: ${r.stderr.toString()}`);
    return r.stdout.toString().trim() !== '';
  });
  if (urteile[0] !== urteile[1]) throw new Error(`${befehl}: mit LC_ALL=C anders als mit ${process.env.LC_ALL ?? process.env.LANG ?? 'ohne LANG'}`);
  return urteile[0]!;
};

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
});

test('befehle(): Codeblock mit \\ und Kommentar, Befehl in `…`, andere Dateien nicht', () => {
  const text = "Text `grep -E '^Eingang: ja' docs/betrieb.md` und `grep x docs/plan.md`.\n```bash\ngrep -E 'a' docs/prd.md | tail -n 1 \\\n  | grep -v b   # Kommentar\ngit status\n```\n";
  expect(befehle(text, 'docs/betrieb.md')).toEqual(["grep -E '^Eingang: ja' docs/betrieb.md"]);
  expect(befehle(text, 'docs/prd.md')).toEqual(["grep -E 'a' docs/prd.md | tail -n 1 | grep -v b"]);
});
