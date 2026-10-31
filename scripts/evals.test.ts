// Tests für die Eval-Fälle (plugins/albatros/evals): Sie laden wie in plugin eval 2.1.309, und jeder Grader ohne Modell lässt ein gutes
// Beispiel durch und erkennt ein schlechtes (scripts/evals-beispiele.ts). Dazu: Pflichtzeilen wie in fahrplan.yaml, die Anleitung des
// Servers wie erzeugt, die Gerüste so, wie die Prüfskripte der Skills sie annehmen. Ohne Modell, ohne Netz.
import { describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { FAELLE } from './attrappen.ts';
import { attrappen, bewerte, EVALS, faelle, glob, KOPF_ATTRAPPE, ladeFall, OHNE_MODELL, pruefeFall, teile } from './bewertung.ts';
import { BEISPIELE } from './evals-beispiele.ts';
import { ladeFahrplan } from './fahrplan.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const plan = await ladeFahrplan(wurzel);
if (!plan.ok) throw new Error(plan.fehler.join('\n'));
const fahrplan = plan.fahrplan;
const PHASEN = new Set(fahrplan.phasen.map((p) => p.id));
const alle = await Promise.all(faelle().map(ladeFall));
const tags = (f: { kopf: Record<string, unknown> }) => ((f.kopf.tags as string[] | undefined) ?? []).map(String);

describe('Fälle laden wie in plugin eval 2.1.309', () => {
  test.each(alle.map((f) => [f.name, f] as const))('%s', async (_, f) => {
    expect(pruefeFall(f)).toEqual([]);
    for (const [tool, a] of await attrappen(f)) {
      expect(Object.keys(a.kopf).filter((k) => !KOPF_ATTRAPPE.has(k)), `Attrappe ${tool}`).toEqual([]);
      expect(a.text.length, `Attrappe ${tool} leer`).toBeGreaterThan(0);
    }
  });

  test('Phase steht als Tag P1 bis P13 (der Kopf phase: bricht plugin eval)', () => {
    for (const f of alle) for (const t of tags(f).filter((x) => /^P\d+$/.test(x))) expect(PHASEN.has(t), `${f.name}: ${t}`).toBe(true);
  });
});

describe('Grader «fragen»: höchstens zwei Fragen in einer Nachricht', async () => {
  const f = await ladeFall('p3-grundriss');
  const g = f.graders.find((x) => x.name === 'fragen')!;
  const ok = (text: string) => !new RegExp(g.text, String(g.kopf.flags)).test(text);
  test('zwei Fragen gehen, drei nicht', () => {
    expect(ok('Passt das so? Und bis wann soll sie online sein?')).toBe(true);
    expect(ok('Passt das? Bis wann? Wer pflegt?')).toBe(false);
    expect(ok('Passt das?\n\nBis wann?\n\nWer pflegt?\n')).toBe(false);
  });
  test('Fragezeichen in Adressen, Überschriften und vor Klammern', () => {
    expect(ok('Link: https://x.ch/a?b=1&c=2 und https://y.ch/?q=3, dazu https://z.ch/?r=4. Passt das?')).toBe(true);
    expect(ok('## Was ist jetzt dran?\n## Warum?\nPasst das? Bis wann?')).toBe(true);
    expect(ok('«Wie heisst es?» (Name?) **Wer?**')).toBe(false);
    expect(ok('„Wie heisst es?“ ‚Wer?’ Wann?')).toBe(false);
  });
});

// Muster, die eine Formulierung der KI erkennen, gegen Sätze aus den Skills und aus lage (die die KI oft wörtlich übernimmt)
describe('Muster gegen Sätze aus Skills und lage', async () => {
  const muster = async (fall: string, grader: string) => {
    const g = (await ladeFall(fall)).graders.find((x) => x.name === grader)!;
    return (text: string) => new RegExp(g.text, String(g.kopf.flags ?? '')).test(text);
  };
  test('gratis: «kostet Albatros nichts» (lage, Skill start)', async () => {
    const t = await muster('gratis-bis-lokal', 'gratis');
    expect(t('Bis zur fertigen Seite auf deinem Computer kostet Albatros nichts.')).toBe(true);
    expect(t('Bis du deine Seite auf deinem Computer siehst, kostet Albatros nichts.')).toBe(true);
    expect(t('Nein, du musst jetzt nichts bezahlen.')).toBe(true);
    expect(t('Light kostet CHF 15 pro Monat. Hier ist der Link.')).toBe(false);
  });
  test('nachfrage: Ja zum Bauen (Skill entwurf)', async () => {
    const t = await muster('p8-sieht-gut-aus', 'nachfrage');
    expect(t('Freut mich. Heisst das: Ja, so bauen?')).toBe(true);
    expect(t('Wollen wir das so bauen?')).toBe(true);
    expect(t('Soll ich mit dem Bau beginnen?')).toBe(true);
    expect(t('Super, dann schreibe ich den Bauplan. Passt dir das?')).toBe(false);
  });
  test('figur-frage, reihenfolge-frage, ja-frage, release-frage: die Fragen aus fahrplan.yaml', async () => {
    const frage = (p: string, id: string) => fahrplan.phasen.find((x) => x.id === p)!.pflichtfragen.find((q) => q.id === id)!.frage.de;
    expect((await muster('p5-konzept', 'figur-frage'))(frage('P5', 'maskottchen'))).toBe(true);
    expect((await muster('p6-mockup', 'reihenfolge-frage'))(frage('P6', 'reihenfolge'))).toBe(true);
    expect((await muster('p4-plan-pruefen', 'ja-frage'))(frage('P4', 'plan-bestaetigt'))).toBe(true);
    expect((await muster('knapp', 'release-frage'))(frage('P3', 'release'))).toBe(true);
    expect((await muster('p7-entwurf', 'durchklicken-frage'))(frage('P7', 'durchklicken'))).toBe(true);
    expect((await muster('p8-sieht-gut-aus', 'nachfrage'))(frage('P8', 'freigabe-entwurf'))).toBe(true);
  });
  test('kontrollfrage: die Fragen der Lektion (lage-Attrappe und Mission)', async () => {
    const t = await muster('lernen-kontrollfrage', 'kontrollfrage');
    expect(t('Warum prüft jemand anderes deinen Plan?')).toBe(true);
    expect(t('Warum prüft deine KI deinen Plan in einem frischen Gespräch?')).toBe(true);
    expect(t('Warum braucht ein Projekt einen Namen?')).toBe(false);
  });
});

describe('Beispiel-Verläufe: jeder Grader ohne Modell lässt das gute durch und erkennt ein schlechtes', () => {
  for (const [name, b] of Object.entries(BEISPIELE)) {
    test(name, async () => {
      const f = alle.find((x) => x.name === name);
      expect(f, `Fall ${name}`).toBeDefined();
      const ohne = f!.graders.filter((g) => OHNE_MODELL.has(String(g.kopf.type))).map((g) => g.name);
      const gut = await bewerte(f!, b.gut);
      expect(gut.filter((e) => !e.bestanden).map((e) => `${e.name}: ${e.warum}`), 'gutes Beispiel').toEqual([]);
      const erkannt = new Set<string>();
      for (const [i, s] of b.schlecht.entries()) {
        const r = await bewerte(f!, s);
        for (const n of s.faellt) {
          const e = r.find((x) => x.name === n);
          expect(e, `${name} schlecht ${i + 1}: Grader ${n} gibt es nicht`).toBeDefined();
          expect(e!.bestanden, `${name} schlecht ${i + 1}: ${n} sollte FAIL sein (${e!.warum})`).toBe(false);
          erkannt.add(n);
        }
      }
      expect(ohne.filter((n) => !erkannt.has(n)), 'Grader ohne rotes Beispiel').toEqual([]);
    });
  }

  test('jeder Fahrplan-Fall hat Beispiele', () => {
    const ohne = alle.filter((f) => tags(f).includes('fahrplan') && !BEISPIELE[f.name]).map((f) => f.name);
    expect(ohne).toEqual([]);
  });
});

describe('Kriterien aus fahrplan.yaml', () => {
  // Grader zeilen-*: alle Pflichtzeilen (ergebnis.zeilen) der Datei in der Phase des Falls, am Zeilenanfang
  test('Grader zeilen-* nennen genau die Pflichtzeilen der Phase', () => {
    let n = 0;
    for (const f of alle) {
      for (const g of f.graders.filter((x) => x.name.startsWith('zeilen-'))) {
        const datei = String((g.kopf.target as { path?: string } | undefined)?.path);
        const p = fahrplan.phasen.find((x) => tags(f).includes(x.id) && x.ergebnis.some((e) => e.datei === datei && e.zeilen));
        expect(p, `${f.name}/${g.name}: keine Phase des Falls hat ${datei} mit Zeilen`).toBeDefined();
        const zeilen = p!.ergebnis.find((e) => e.datei === datei)!.zeilen!;
        expect(g.text, `${f.name}/${g.name}`).toBe(`^${zeilen.map((z) => `(?=[\\s\\S]*^${z})`).join('')}`);
        expect(g.kopf.flags).toBe('m');
        n++;
      }
    }
    expect(n).toBeGreaterThanOrEqual(9);
  });

  test('jede Phase hat mindestens einen Fall', () => {
    const fehlend = fahrplan.phasen.filter((p) => !alle.some((f) => tags(f).includes(p.id))).map((p) => p.id);
    expect(fehlend).toEqual([]);
  });

  test('die Anleitung des Servers ist in jedem neuen Fall die erzeugte', async () => {
    const soll = (await Bun.file(join(EVALS, '_projekt/anleitung.txt')).text()).trim();
    for (const f of alle.filter((x) => tags(x).includes('fahrplan'))) expect(String(f.kopf.append_system_prompt ?? '').trim(), f.name).toBe(soll);
  });
});

describe('Attrappen der Werkzeuge', () => {
  test('jeder Fall aus scripts/attrappen.ts hat seine lage', async () => {
    for (const fall of Object.keys(FAELLE)) {
      const { kopf, text } = teile(await Bun.file(join(EVALS, fall, 'mocks/albatros/lage.md')).text());
      expect(kopf.type, fall).toBe('fixed');
      expect(text, fall).toMatch(/^\nJetzt dran: /);
    }
  });

  const albatros = resolve(process.env.ALBATROS ?? `${wurzel}../albatros`);
  test.skipIf(!existsSync(`${albatros}/services/mcp/scripts/lage-attrappen.ts`))('wie aus dem echten mcp erzeugt (braucht albatros)', () => {
    const r = Bun.spawnSync(['bun', `${wurzel}scripts/attrappen.ts`, '--pruefen'], { env: { ...process.env, ALBATROS: albatros }, stderr: 'pipe', stdout: 'pipe' });
    expect(r.stderr.toString().split('\n').filter((z) => z && !z.includes('"level":"info"')).join('\n')).toBe('');
    expect(r.exitCode).toBe(0);
  });
});

describe('Gerüste wie nach dem Fahrplan', () => {
  const lauf = (fall: string, befehl: string[]) => {
    const o = mkdtempSync(join(tmpdir(), 'albatros-geruest-'));
    try {
      const s = Bun.spawnSync(['bash', join(EVALS, fall, 'scaffold.sh')], { cwd: o, stderr: 'pipe' });
      expect(s.exitCode, s.stderr.toString()).toBe(0);
      const r = Bun.spawnSync(befehl, { cwd: o, stdout: 'pipe', stderr: 'pipe' });
      return { code: r.exitCode, text: r.stdout.toString() + r.stderr.toString() };
    } finally {
      rmSync(o, { recursive: true, force: true });
    }
  };
  const node = Bun.which('node');
  test.skipIf(!node)('der Entwurf (bis P7) ist für entwurf-pruefen.mjs grün', () => {
    const r = lauf('p8-ja', [node!, join(wurzel, 'plugins/albatros/skills/entwurf/entwurf-pruefen.mjs'), '.']);
    expect(r.code, r.text).toBe(0);
    expect(r.text).toContain('Ergebnis: grün');
  });
  test.skipIf(!node)('ohne Freigabe (bis P7) sperrt pruefen.mjs --vor-bau, mit Freigabe (bis P8) nicht', () => {
    const pruefen = join(wurzel, 'plugins/albatros/skills/webseite-bauen/pruefen.mjs');
    expect(lauf('nein-vor-bau', [node!, pruefen, '--vor-bau']).code).toBe(2);
    expect(lauf('webseite-bauen-prd', [node!, pruefen, '--vor-bau']).code).toBe(0);
  });
  test('glob wie plugin eval', () => {
    expect(glob('**/prd.md').test('docs/prd.md')).toBe(true);
    expect(glob('**/prd.md').test('prd.md')).toBe(true);
    expect(glob('AGENTS.md').test('docs/AGENTS.md')).toBe(false);
    expect(glob('design/*.html').test('design/entwurf/index.html')).toBe(false);
  });
});
