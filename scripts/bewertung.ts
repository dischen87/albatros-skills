// Liest die Eval-Fälle (plugins/albatros/evals/<fall>) so, wie claude plugin eval 2.1.309 sie liest, und bewertet einen Beispiel-Verlauf
// mit den Gradern ohne Modell (regex, tool_used, tool_order, file_exists). Für evals.test.ts: Jeder Grader ohne Modell muss ein gutes
// Beispiel durchlassen und ein schlechtes erkennen. llm-Grader bewertet hier niemand.
// Grundlage (gelesen am 31.10.2026 im Programm von Claude Code 2.1.309, Zod-Schemas und Bewertung von plugin eval):
// - regex: target last_message (Standard) | files | mock_calls | trace | {source: file, path}; match contains | not_contains | count:N;
//   flags; das Muster ist der Text unter dem Kopf. Eine Datei, die es nicht gibt, ergibt FAIL, auch bei not_contains.
// - tool_used: tool, input_match (RegExp ohne Flags auf JSON.stringify der Eingabe), min (Standard 1), max.
// - tool_order: before und after (Werkzeug oder {tool, input_match}); der erste Aufruf von before kommt vor dem ersten von after.
// - file_exists: path als Glob gegen die neu entstandenen Dateien, exists (Standard true).
// - mock_calls: je Aufruf eines nachgebildeten Werkzeugs eine Zeile {"tool","input","output","isError"?,"verdict"} als JSON.
import { mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';

export const EVALS = new URL('../plugins/albatros/evals/', import.meta.url).pathname;
export const ALBATROS = 'mcp__plugin_albatros_albatros__';

// Erlaubte Schlüssel, sonst lädt plugin eval den Fall nicht (prompt.md: «unknown frontmatter key»; Grader und Attrappen: strict)
export const KOPF_PROMPT = new Set(['schema_version', 'name', 'description', 'tags', 'plugins', 'runs', 'expected_outcome', 'model', 'max_turns',
  'timeout_seconds', 'allowed_tools', 'disallowed_tools', 'artifact_publish', 'growthbook_overrides', 'append_system_prompt', 'env']);
const GEMEINSAM = ['type', 'name', 'weight', 'arm'];
export const KOPF_GRADER: Record<string, string[]> = {
  regex: [...GEMEINSAM, 'target', 'pattern', 'flags', 'match'],
  tool_order: [...GEMEINSAM, 'before', 'after'],
  tool_used: [...GEMEINSAM, 'tool', 'input_match', 'min', 'max'],
  file_exists: [...GEMEINSAM, 'path', 'exists'],
  llm: [...GEMEINSAM, 'criteria', 'focus'],
  baseline: [...GEMEINSAM, 'baseline_file', 'criteria'],
};
export const KOPF_ATTRAPPE = new Set(['type', 'expect', 'error', 'tools', 'abort_when']);
export const OHNE_MODELL = new Set(['regex', 'tool_used', 'tool_order', 'file_exists']);

type Kopf = Record<string, unknown>;
export type Grader = { name: string; kopf: Kopf; text: string };
export type Fall = { name: string; ordner: string; kopf: Kopf; prompt: string; graders: Grader[]; geruest: string | null };
export type Aufruf = { tool: string; input?: Record<string, unknown> };
// Ein Verlauf, wie ihn plugin eval sieht: Werkzeugaufrufe in ihrer Reihenfolge, die letzte Antwort an die Person und die Dateien, die
// die KI geschrieben hat (Pfad → Inhalt nach dem Lauf). Werkzeuge ohne Präfix und klein geschrieben sind Albatros-Werkzeuge.
export type Verlauf = { aufrufe: Aufruf[]; antwort: string; dateien?: Record<string, string> };
export type Ergebnis = { name: string; bestanden: boolean; warum: string };

export function teile(roh: string): { kopf: Kopf; text: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(roh);
  if (!m) return { kopf: {}, text: roh };
  return { kopf: (Bun.YAML.parse(m[1]!) as Kopf | null) ?? {}, text: m[2]! };
}

export async function ladeFall(name: string): Promise<Fall> {
  const ordner = join(EVALS, name);
  const { kopf, text } = teile(await Bun.file(join(ordner, 'prompt.md')).text());
  const graders: Grader[] = [];
  const gOrdner = join(ordner, 'graders');
  for (const datei of readdirSync(gOrdner).filter((d) => d.endsWith('.md')).sort()) {
    const g = teile(await Bun.file(join(gOrdner, datei)).text());
    graders.push({ name: datei.replace(/\.md$/, ''), kopf: g.kopf, text: g.text.trim() });
  }
  const yaml = Bun.file(join(ordner, 'case.yaml'));
  const c = (await yaml.exists()) ? (Bun.YAML.parse(await yaml.text()) as { context?: { scaffold_script?: string } }) : null;
  const skript = c?.context?.scaffold_script;
  return { name, ordner, kopf, prompt: text.trim(), graders, geruest: skript ? join(ordner, skript) : null };
}

export const faelle = () => readdirSync(EVALS).filter((d) => !d.startsWith('_') && d !== 'mocks' && d !== 'results' && statSync(join(EVALS, d)).isDirectory()).sort();

// Was plugin eval beim Laden ablehnt oder ein Grader nie bestehen kann
export function pruefeFall(f: Fall): string[] {
  const fehler: string[] = [];
  for (const k of Object.keys(f.kopf)) if (!KOPF_PROMPT.has(k)) fehler.push(`${f.name}/prompt.md: Schlüssel «${k}» kennt plugin eval nicht`);
  if (!f.prompt) fehler.push(`${f.name}/prompt.md: kein Prompt`);
  if (!f.graders.length) fehler.push(`${f.name}: keine Grader`);
  const erlaubt = new Set((f.kopf.allowed_tools as string[] | undefined) ?? []);
  for (const g of f.graders) {
    const typ = String(g.kopf.type ?? '');
    const felder = KOPF_GRADER[typ];
    if (!felder) {
      fehler.push(`${f.name}/graders/${g.name}.md: type «${typ}» gibt es nicht`);
      continue;
    }
    for (const k of Object.keys(g.kopf)) if (!felder.includes(k)) fehler.push(`${f.name}/graders/${g.name}.md: Feld «${k}» gibt es bei ${typ} nicht`);
    if ((typ === 'regex' || typ === 'llm') && !g.text && !g.kopf.pattern && !g.kopf.criteria) fehler.push(`${f.name}/graders/${g.name}.md: Muster oder Kriterien fehlen`);
    if (typ === 'regex') {
      try {
        new RegExp(g.text, String(g.kopf.flags ?? ''));
      } catch (e) {
        fehler.push(`${f.name}/graders/${g.name}.md: Muster ungültig (${(e as Error).message})`);
      }
      const t = g.kopf.target;
      if (t !== undefined && !['last_message', 'files', 'mock_calls', 'trace'].includes(String(t)) && !(typeof t === 'object' && t !== null && 'path' in t))
        fehler.push(`${f.name}/graders/${g.name}.md: target «${JSON.stringify(t)}» gibt es nicht`);
    }
    if (typeof g.kopf.input_match === 'string') {
      try {
        new RegExp(g.kopf.input_match);
      } catch (e) {
        fehler.push(`${f.name}/graders/${g.name}.md: input_match ungültig (${(e as Error).message})`);
      }
    }
    // Ein Werkzeug, das ein Grader verlangt, muss die KI auch haben (Albatros-Werkzeuge kommen aus den Attrappen)
    const tool = typ === 'tool_used' && Number(g.kopf.min ?? 1) >= 1 ? String(g.kopf.tool) : null;
    if (tool && !tool.startsWith(ALBATROS) && !erlaubt.has(tool)) fehler.push(`${f.name}/graders/${g.name}.md: ${tool} fehlt in allowed_tools`);
  }
  return fehler;
}

// Attrappen eines Falls: zuerst die der Suite, dann die des Falls (der Fall gewinnt), wie die Ebenen in plugin eval
export async function attrappen(f: Fall): Promise<Map<string, { text: string; fehler: boolean; kopf: Kopf }>> {
  const karte = new Map<string, { text: string; fehler: boolean; kopf: Kopf }>();
  for (const o of [join(EVALS, 'mocks/albatros'), join(f.ordner, 'mocks/albatros')]) {
    let dateien: string[] = [];
    try {
      dateien = readdirSync(o).filter((d) => d.endsWith('.md'));
    } catch {
      continue;
    }
    for (const d of dateien) {
      const a = teile(await Bun.file(join(o, d)).text());
      karte.set(d.replace(/\.md$/, ''), { text: a.text.replace(/^\n+/, '').replace(/\s+$/, ''), fehler: a.kopf.error === true, kopf: a.kopf });
    }
  }
  return karte;
}

const voll = (tool: string) => (/^[a-z]/.test(tool) && !tool.includes('__') ? ALBATROS + tool : tool);
const wert = (input: Record<string, unknown>, feld: string) => {
  const v = feld.split('.').reduce<unknown>((o, k) => (typeof o === 'object' && o !== null ? (o as Record<string, unknown>)[k] : undefined), input);
  return v === undefined ? '' : typeof v === 'string' ? v : JSON.stringify(v);
};

// Glob wie in plugin eval: ** über Ordner, * innerhalb eines Ordners, ? ein Zeichen, ganzer Pfad
export function glob(muster: string): RegExp {
  let r = '^';
  for (let i = 0; i < muster.length; i++) {
    const c = muster[i]!;
    if (c === '*') {
      if (muster[i + 1] === '*') {
        if (muster[i + 2] === '/') {
          r += '(?:.*/)?';
          i += 2;
        } else {
          r += '.*';
          i++;
        }
      } else r += '[^/]*';
    } else if (c === '?') r += '.';
    else r += '.+^${}()|[]\\'.includes(c) ? `\\${c}` : c;
  }
  return new RegExp(`${r}$`);
}

const alleDateien = (o: string, basis = o): string[] =>
  readdirSync(o, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? alleDateien(join(o, e.name), basis) : [relative(basis, join(o, e.name))]));

// Bewertet einen Verlauf: Gerüst des Falls in einen leeren Ordner, dann die Dateien der KI darüber, dann jeden Grader ohne Modell
export async function bewerte(f: Fall, v: Verlauf): Promise<Ergebnis[]> {
  const ordner = mkdtempSync(join(tmpdir(), `albatros-eval-${f.name}-`));
  try {
    if (f.geruest) {
      const r = Bun.spawnSync(['bash', f.geruest], { cwd: ordner, stderr: 'pipe' });
      if (r.exitCode !== 0) throw new Error(`${f.name}: scaffold.sh endet mit ${r.exitCode}: ${r.stderr.toString()}`);
    }
    const vorher = new Set(alleDateien(ordner));
    for (const [pfad, inhalt] of Object.entries(v.dateien ?? {})) {
      mkdirSync(dirname(join(ordner, pfad)), { recursive: true });
      await Bun.write(join(ordner, pfad), inhalt);
    }
    const neu = alleDateien(ordner).filter((p) => !vorher.has(p));
    const karte = await attrappen(f);
    const aufrufe = v.aufrufe.map((a) => ({ name: voll(a.tool), input: a.input ?? {} }));
    const mockCalls = aufrufe.filter((a) => a.name.startsWith(ALBATROS)).map((a) => {
      const m = karte.get(a.name.slice(ALBATROS.length));
      const output = m ? m.text.replace(/\{\{\s*input\.([A-Za-z0-9_.-]+)\s*\}\}/g, (_, feld: string) => wert(a.input, feld)) : `no mock for albatros/${a.name}`;
      const fehler = !m || m.fehler;
      return JSON.stringify({ tool: a.name, input: a.input, output, ...(fehler ? { isError: true } : {}), verdict: fehler ? 'tool_error' : 'ok' });
    });
    const ergebnisse: Ergebnis[] = [];
    for (const g of f.graders) {
      const typ = String(g.kopf.type);
      if (!OHNE_MODELL.has(typ)) continue;
      ergebnisse.push({ name: g.name, ...(await einGrader(g, typ, { ordner, neu, aufrufe, mockCalls, antwort: v.antwort })) });
    }
    return ergebnisse;
  } finally {
    rmSync(ordner, { recursive: true, force: true });
  }
}

type Lauf = { ordner: string; neu: string[]; aufrufe: { name: string; input: Record<string, unknown> }[]; mockCalls: string[]; antwort: string };
const passt = (a: { name: string; input: Record<string, unknown> }, tool: string, im?: unknown) =>
  a.name === tool && (typeof im !== 'string' || !im || new RegExp(im).test(JSON.stringify(a.input)));

async function einGrader(g: Grader, typ: string, l: Lauf): Promise<{ bestanden: boolean; warum: string }> {
  const k = g.kopf;
  if (typ === 'tool_used') {
    const n = l.aufrufe.filter((a) => passt(a, String(k.tool), k.input_match)).length;
    const min = Number(k.min ?? 1);
    const max = k.max === undefined ? Infinity : Number(k.max);
    return { bestanden: n >= min && n <= max, warum: `${k.tool} ${n}× (erwartet ${min}..${max})` };
  }
  if (typ === 'tool_order') {
    const index = (x: unknown) => {
      const s = typeof x === 'string' ? { tool: x } : (x as { tool: string; input_match?: string });
      return l.aufrufe.findIndex((a) => passt(a, s.tool, s.input_match));
    };
    const [b, a] = [index(k.before), index(k.after)];
    return { bestanden: b >= 0 && a >= 0 && b < a, warum: `before ${b}, after ${a}` };
  }
  if (typ === 'file_exists') {
    const r = glob(String(k.path));
    const da = l.neu.some((p) => r.test(p));
    const soll = k.exists !== false;
    return { bestanden: da === soll, warum: `${k.path} ${da ? 'da' : 'fehlt'}` };
  }
  // regex
  const t = k.target ?? 'last_message';
  let text: string;
  if (typeof t === 'object' && t !== null) {
    const f = Bun.file(join(l.ordner, String((t as { path: string }).path)));
    if (!(await f.exists())) return { bestanden: false, warum: `Datei ${(t as { path: string }).path} fehlt` };
    text = await f.text();
  } else if (t === 'files') text = l.neu.join('\n');
  else if (t === 'mock_calls') text = l.mockCalls.join('\n');
  else if (t === 'last_message') text = l.antwort;
  else return { bestanden: false, warum: `target ${String(t)} bildet dieser Test nicht nach` };
  const flags = String(k.flags ?? '');
  const muster = g.text;
  const match = String(k.match ?? 'contains');
  if (match === 'contains') return { bestanden: new RegExp(muster, flags).test(text), warum: 'contains' };
  if (match === 'not_contains') return { bestanden: !new RegExp(muster, flags).test(text), warum: 'not_contains' };
  const n = Number(/^count:(\d+)$/.exec(match)?.[1] ?? NaN);
  const treffer = text.match(new RegExp(muster, flags.includes('g') ? flags : `${flags}g`))?.length ?? 0;
  return { bestanden: treffer === n, warum: `${treffer} Treffer (erwartet ${n})` };
}
