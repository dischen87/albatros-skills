// Attrappen der Albatros-Werkzeuge für die Fahrplan-Evals (plugins/albatros/evals), gerendert mit dem echten mcp von albatros
// (Schalter FAHRPLAN und ERFASSUNG an), wie services/mcp/scripts/lage-attrappen.ts dort. Schreibt:
// - mocks/albatros/_tools.json: tools/list, damit die KI im Eval die echten Beschreibungen und Eingaben sieht
// - _projekt/anleitung.txt: die Anleitung (instructions) des Servers; neue Fälle hängen sie mit append_system_prompt an
// - <fall>/mocks/albatros/lage.md und weitere Werkzeuge je Fall: mit einem Zustand aus lage-attrappen.ts, oder mit einem eigenen
//   Zustand (Insel-Schritt), dessen Belege aus dem Gerüst des Falls kommen (scaffold.sh, so wie die KI sie nach dem Skill lotse liest)
// Ruft keinen Dienst auf. Aufruf: ALBATROS=<Ordner von albatros> bun scripts/attrappen.ts [--pruefen]
// Ohne ALBATROS: ../albatros neben diesem Repo. --pruefen schreibt nichts und endet mit 1, wenn etwas vom Erzeugten abweicht.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { ladeFahrplan } from './fahrplan.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const EVALS = `${wurzel}plugins/albatros/evals/`;
const A = resolve(process.env.ALBATROS ?? `${wurzel}../albatros`);

type Antwort = { status: number; body: unknown };
type Zustand = { antworten: Record<string, Antwort>; eingabe: Record<string, unknown> };
type Fall = { zustand?: string; insel?: string; werkzeuge?: Record<string, Record<string, unknown>>; mission?: { id: string; erledigt: number } };

// Welcher Fall welchen Zustand bekommt. zustand: einer der 12 Zustände aus lage-attrappen.ts, unverändert. insel: eigener Zustand
// (Gratis, Weg Webseite, das Hauptprojekt «Sonnenhof» auf der Insel bei diesem Schritt), Eingabe wie von der KI aus dem Gerüst.
// werkzeuge: weitere Werkzeuge, die im selben Zustand mit diesen Argumenten gerendert werden. mission: die aktuelle Mission im Flugbuch
// (aus missionen/ in diesem Repo) und wie viele erledigt sind; dazu wird mission_holen gerendert.
export const FAELLE: Record<string, Fall> = {
  'p1-idee': { zustand: 'gratis-ohne-projekt' },
  'p2-research': { insel: 'idee' },
  'p3-grundriss': { insel: 'recherche' },
  'p4-plan-pruefen': { insel: 'plan' },
  'p5-konzept': { insel: 'plan-geprueft' },
  'p6-mockup': { insel: 'konzept' },
  'p7-entwurf': { insel: 'entwuerfe' },
  'p8-sieht-gut-aus': { insel: 'entwurf' },
  'p8-ja': { insel: 'entwurf' },
  'webseite-bauen-prd': { insel: 'entwurf-freigegeben' },
  'p10-freigabe': { insel: 'pruefung' },
  'p11-wohnort': { zustand: 'gratis-p10-freigegeben', werkzeuge: { konto_status: {}, upgrade_link: { stufe: 'light', bestaetigt: true } } },
  'p12-betrieb': { zustand: 'selbst-lanciert' },
  'p13-geaendert': { zustand: 'light-p13' },
  'knapp': { insel: 'recherche' },
  'nein-vor-bau': { insel: 'entwurf' },
  'gratis-bis-lokal': { insel: 'recherche', werkzeuge: { konto_status: {}, upgrade_link: { stufe: 'light' } } },
  'lernen-kontrollfrage': { zustand: 'gratis-p4', mission: { id: 'flugschule-13-plan-pruefen', erledigt: 3 } },
  'lernen-verstanden': { insel: 'plan-geprueft', mission: { id: 'flugschule-14-konzept', erledigt: 4 } },
  'anfrage': { insel: 'recherche' },
};

// Was konto für Preise und Abo antwortet (in den Zuständen der Attrappen fehlt es, weil lage es nicht braucht)
const KONTO_EXTRA: Record<string, Antwort> = {
  'GET /web/stufen': { status: 200, body: [{ stufe: 'gratis', leistung: { preisChfMonat: 0 } }, { stufe: 'light', leistung: { preisChfMonat: 15 } }, { stufe: 'pilot', leistung: { preisChfMonat: 40 } }] },
  'POST /cockpit/abo/checkout': { status: 200, body: { url: 'https://checkout.stripe.com/c/pay/cs_test_albatros_light' } },
};
const SCHALTER_AN = { FAHRPLAN: true, ERFASSUNG: true };

async function main() {
  const fehlt = (was: string) => {
    console.error(`${was}: albatros nicht gefunden unter ${A}. Setz ALBATROS auf den Ordner von albatros (Branch fahrplan-und-lernschleife).`);
    process.exit(2);
  };
  if (!(await Bun.file(`${A}/services/mcp/scripts/lage-attrappen.ts`).exists())) fehlt('lage-attrappen.ts');
  const kit: Record<string, unknown> = await import(`${A}/packages/kit/src/index.ts`);
  const mcp: Record<string, unknown> = await import(`${A}/services/mcp/src/app.ts`);
  const attrappen: Record<string, unknown> = await import(`${A}/services/mcp/scripts/lage-attrappen.ts`);
  const ZUSTAENDE = attrappen.ZUSTAENDE as Record<string, Zustand>;
  const createApp = mcp.createApp as (deps: Record<string, unknown>) => { request: (pfad: string, init: RequestInit) => Promise<Response> };
  const SKILLS_STAND = String(kit.SKILLS_STAND);

  // Ein JSON-RPC-Aufruf an das echte mcp mit festen Antworten von konto und flugschule
  async function rpc(antworten: Record<string, Antwort>, method: string, params: Record<string, unknown>) {
    const schalter = { ...(kit.ALLE_AUS as Record<string, boolean>), ...SCHALTER_AN };
    const app = createApp({
      resource: 'https://mcp.albatros.build', issuer: 'https://clerk.albatros.test', schalter, erfassung: null, limit: null,
      ctx: () => ({ methoden: [], schalter, rufe: async (_d: string, m: string, p: string) => antworten[`${m} ${p}`] ?? { status: 404, body: { error: 'Nicht gefunden.' } } }),
      verifyToken: async () => ({ subject: 'user_anna', aud: ['https://mcp.albatros.build'], revoked: false, expired: false }),
    });
    const r = await app.request('/', {
      method: 'POST', headers: { authorization: 'Bearer attrappe', 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    });
    return (await r.json()) as { result?: Record<string, unknown>; error?: unknown };
  }

  async function werkzeug(z: Zustand, name: string, args: Record<string, unknown>) {
    const b = await rpc({ ...z.antworten, ...KONTO_EXTRA }, 'tools/call', { name, arguments: args });
    const r = b.result as { content?: { text: string }[]; isError?: boolean } | undefined;
    const text = r?.content?.[0]?.text;
    if (!text) throw new Error(`${name}: keine Antwort (${JSON.stringify(b)})`);
    return { text, fehler: r?.isError === true };
  }

  // Belege so, wie die KI sie nach dem Skill lotse aus dem Projekt liest: je Ergebnisdatei aus fahrplan.yaml, die es gibt, die Zeilen
  // mit «Name:» am Anfang, wörtlich; Dateien ohne solche Zeilen mit leerer Liste
  const plan = await ladeFahrplan(wurzel);
  if (!plan.ok) throw new Error(plan.fehler.join('\n'));
  const DATEIEN = [...new Set(plan.fahrplan.phasen.flatMap((p) => p.ergebnis.map((e) => e.datei)))];
  const ZEILE = /^[A-ZÄÖÜ][A-Za-zÄÖÜäöü ]{0,40}:/;

  async function geruest(fall: string): Promise<string | null> {
    const yaml = Bun.file(`${EVALS}${fall}/case.yaml`);
    if (!(await yaml.exists())) return null;
    const skript = (Bun.YAML.parse(await yaml.text()) as { context?: { scaffold_script?: string } }).context?.scaffold_script;
    if (!skript) return null;
    const ordner = mkdtempSync(join(tmpdir(), 'albatros-geruest-'));
    const r = Bun.spawnSync(['bash', `${EVALS}${fall}/${skript}`], { cwd: ordner, stderr: 'pipe' });
    if (r.exitCode !== 0) throw new Error(`${fall}: scaffold.sh endet mit ${r.exitCode}: ${r.stderr.toString()}`);
    return ordner;
  }

  async function belege(ordner: string) {
    const liste: { datei: string; zeilen: string[] }[] = [];
    for (const datei of DATEIEN) {
      const f = Bun.file(join(ordner, datei));
      if (!(await f.exists())) continue;
      const zeilen = (await f.text()).split('\n').filter((z) => ZEILE.test(z)).slice(0, 50);
      for (const z of zeilen) if (z.length > 300) throw new Error(`${datei}: Zeile länger als 300 Zeichen, lage lehnt sie ab: ${z.slice(0, 60)}…`);
      liste.push({ datei, zeilen });
    }
    return liste.slice(0, 20);
  }

  async function zustandFuer(fall: string, f: Fall): Promise<Zustand> {
    if (f.zustand) {
      const z = ZUSTAENDE[f.zustand];
      if (!z) throw new Error(`${fall}: Zustand ${f.zustand} gibt es in lage-attrappen.ts nicht`);
      return z;
    }
    const basis = ZUSTAENDE['gratis-ohne-projekt']!;
    const ordner = await geruest(fall);
    const eingabe: Record<string, unknown> = { skills_stand: SKILLS_STAND };
    if (ordner) {
      eingabe.belege = await belege(ordner);
      const modus = /^Modus: (lernen|machen)/m.exec(await Bun.file(join(ordner, 'docs/projekt.md')).text().catch(() => ''))?.[1];
      if (modus) eingabe.modus = modus;
      rmSync(ordner, { recursive: true, force: true });
    }
    const insel: Antwort = { status: 200, body: { projekte: [{ projekt: 'projekt', titel: 'Sonnenhof', schritt: f.insel, am: '2026-10-30T10:00:00Z' }], gesehen: null } };
    return { antworten: { ...basis.antworten, 'GET /cockpit/insel': insel }, eingabe };
  }

  // Flugbuch mit der aktuellen Mission, wie flugschule es mission_holen liefert (Kopf und Text aus missionen/<weg>/<nr>-<slug>.md)
  async function flugbuch(m: { id: string; erledigt: number }): Promise<Antwort> {
    const [weg, nr, ...rest] = m.id.split('-');
    const roh = await Bun.file(`${wurzel}missionen/${weg}/${nr}-${rest.join('-')}.md`).text();
    const teile = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(roh);
    if (!teile) throw new Error(`${m.id}: Mission ohne Kopf`);
    const k = Bun.YAML.parse(teile[1]!) as Record<string, unknown>;
    const aktuell = { id: k.id, weg: k.weg, stufe: k.stufe, titel: k.titel, bild: k.bild, skill: k.skill, dauer: k.dauer, pruefung: k.pruefung, text: teile[2]!.trim() };
    return { status: 200, body: { aktuell, erledigt: [], fortschritt: { erledigt: m.erledigt, gesamt: 12 } } };
  }

  const attrappe = (text: string, fehler: boolean) => `---\ntype: fixed\n${fehler ? 'error: true\n' : ''}---\n\n${text}\n`;

  // Alles, was erzeugt wird: Pfad → Inhalt
  const soll = new Map<string, string>();
  const init = await rpc({}, 'initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'claude-code', version: '2.1.309' } });
  const anleitung = String((init.result as { instructions?: string } | undefined)?.instructions ?? '');
  if (!anleitung) throw new Error('initialize ohne instructions');
  soll.set(`${EVALS}_projekt/anleitung.txt`, `# MCP Server Instructions\n\nThe following MCP servers have provided instructions for how to use their tools and resources:\n\n## plugin:albatros:albatros\n${anleitung}\n`);
  const liste = await rpc({}, 'tools/list', {});
  const tools = ((liste.result as { tools?: { name: string; description: string; inputSchema: unknown }[] } | undefined)?.tools ?? [])
    .map((t) => ({ name: t.name, description: t.description, inputSchema: t.inputSchema }));
  if (!tools.length) throw new Error('tools/list ohne Werkzeuge');
  soll.set(`${EVALS}mocks/albatros/_tools.json`, `${JSON.stringify({ tools }, null, 2)}\n`);

  for (const [fall, f] of Object.entries(FAELLE)) {
    if (!(await Bun.file(`${EVALS}${fall}/prompt.md`).exists())) throw new Error(`${fall}: Fall fehlt (${EVALS}${fall}/prompt.md)`);
    const z = await zustandFuer(fall, f);
    const lage = await werkzeug(z, 'lage', z.eingabe);
    // Die weiteren Werkzeuge sehen dazu die aktuelle Mission; lage bleibt genau wie in lage-attrappen.ts
    const mit: Zustand = f.mission ? { ...z, antworten: { ...z.antworten, 'GET /cockpit/flugbuch': await flugbuch(f.mission) } } : z;
    soll.set(`${EVALS}${fall}/mocks/albatros/lage.md`, attrappe(lage.text, lage.fehler));
    for (const [name, args] of Object.entries({ ...f.werkzeuge, ...(f.mission ? { mission_holen: {} } : {}) })) {
      const w = await werkzeug(mit, name, args);
      soll.set(`${EVALS}${fall}/mocks/albatros/${name}.md`, attrappe(w.text, w.fehler));
    }
  }

  const pruefen = process.argv.includes('--pruefen');
  let abweichend = 0;
  for (const [pfad, inhalt] of soll) {
    const ist = await Bun.file(pfad).text().catch(() => null);
    if (ist === inhalt) continue;
    abweichend++;
    if (pruefen) console.error(`${pfad.slice(wurzel.length)}: ${ist === null ? 'fehlt' : 'anders als erzeugt'}`);
    else await Bun.write(pfad, inhalt);
  }
  if (pruefen && abweichend) {
    console.error(`${abweichend} von ${soll.size} Attrappen weichen ab: ALBATROS=${A} bun scripts/attrappen.ts`);
    process.exit(1);
  }
  console.log(pruefen ? `${soll.size} Attrappen wie erzeugt (albatros: ${A}).` : `${abweichend} von ${soll.size} Attrappen geschrieben (albatros: ${A}).`);
}

if (import.meta.main) await main();
