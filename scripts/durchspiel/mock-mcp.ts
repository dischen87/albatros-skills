// Attrappe des MCP-Diensts von Albatros für den Durchspiel-Test (stdio, JSON-RPC je Zeile). Jedes Werkzeug antwortet mit dem festen
// Text aus scripts/durchspiel/mocks/<werkzeug>.md, sonst aus plugins/albatros/evals/mocks/albatros/<werkzeug>.md (wie die Evals).
// Mit DURCHSPIEL_FALL zuerst aus scripts/durchspiel/mocks/<fall>/. Mit DURCHSPIEL_HAFEN legen seite_erstellen und server_erstellen
// den Hafen unter dem gewünschten Namen an (Kopie von vorlage.git), upgrade_link merkt sich die Stufe (als wäre sie bezahlt). Danach
// gilt je nach Stand zuerst <werkzeug>.server.md, .seite.md, .<stufe>.md, falls vorhanden.
// Platzhalter: {repo}, {name} (Name der Seite), {stand} (zuletzt veröffentlicht), {stufe}.
// Beschreibungen und Parameter der Werkzeuge wie beim echten Dienst aus mocks/werkzeuge.json; fehlt ein Pflichtfeld, antwortet die
// Attrappe wie er mit «Ungültige Angaben». Neu erzeugen im Repo albatros, Ordner services/mcp:
//   bun -e "import { z } from 'zod'; import { WERKZEUGE } from './src/werkzeuge.ts'; console.log(JSON.stringify(WERKZEUGE.map((w) => { const { \$schema: _, ...inputSchema } = z.toJSONSchema(w.eingabe, { io: 'input' }) as Record<string, unknown>; return { name: w.name, description: w.description, inputSchema }; }), null, 1));" > …/albatros-skills/scripts/durchspiel/mocks/werkzeuge.json
// Keine Zahlung, kein Server: Albatros wird nie echt angesprochen.
import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const wurzel = new URL('../..', import.meta.url).pathname;
const FALL = process.env.DURCHSPIEL_FALL;
const ordner = [...(FALL ? [join(wurzel, 'scripts/durchspiel/mocks', FALL)] : []), join(wurzel, 'scripts/durchspiel/mocks'), join(wurzel, 'plugins/albatros/evals/mocks/albatros')];
const HAFEN = process.env.DURCHSPIEL_HAFEN;
const merk = (d: string) => (HAFEN && existsSync(join(HAFEN, d)) ? readFileSync(join(HAFEN, d), 'utf8').trim() : null);
const seiteName = () => merk('seite');
const stand = (n: string) => {
  const zeit = spawnSync('git', ['--git-dir', join(HAFEN!, n, 'projekt.git'), 'log', '-1', '--format=%cd', '--date=format:%d.%m.%Y %H:%M', 'main', '--', 'seite']).stdout?.toString().trim();
  return zeit ? `zuletzt veröffentlicht ${zeit}` : 'noch nichts veröffentlicht';
};
const antwort = (werkzeug: string, a: { name?: string; stufe?: string }) => {
  if (werkzeug === 'upgrade_link' && HAFEN) writeFileSync(join(HAFEN, 'abo'), a.stufe ?? 'pilot');
  if ((werkzeug === 'seite_erstellen' || werkzeug === 'server_erstellen') && HAFEN && /^[a-z0-9-]{3,32}$/.test(a.name ?? '')) {
    const ziel = join(HAFEN, a.name!, 'projekt.git');
    if (!existsSync(ziel)) spawnSync('git', ['clone', '-q', '--bare', join(HAFEN, 'vorlage.git'), ziel]);
    writeFileSync(join(HAFEN, 'seite'), a.name!);
    if (werkzeug === 'server_erstellen') writeFileSync(join(HAFEN, 'server'), a.name!);
  }
  const n = seiteName();
  for (const z of [merk('server') && '.server', n && '.seite', merk('abo') && `.${merk('abo')}`, ''].filter((x) => x !== null)) for (const o of ordner) {
    const f = join(o, `${werkzeug}${z}.md`);
    if (existsSync(f)) return readFileSync(f, 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim().replaceAll('{repo}', wurzel.replace(/\/$/, ''))
      .replaceAll('{name}', a.name ?? n ?? 'curling-grindelwald').replaceAll('{stand}', n ? stand(n) : '').replaceAll('{stufe}', a.stufe ?? merk('abo') ?? 'pilot');
  }
  return null;
};
const ECHT: { name: string; description: string; inputSchema: { required?: string[] } }[] = JSON.parse(readFileSync(join(wurzel, 'scripts/durchspiel/mocks/werkzeuge.json'), 'utf8'));
const werkzeuge = [...new Set(ordner.flatMap((o) => (existsSync(o) ? readdirSync(o) : []).filter((f) => /^[a-z_0-9]+\.md$/.test(f)).map((f) => f.slice(0, -3))))];

// Wie services/mcp/src/app.ts im Repo albatros
const ANLEITUNG = 'Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen: eine Webseite oder ein Geschäft auf einem echten eigenen Server, gebaut mit der eigenen KI. Ruf zuerst lage auf: es sagt nach dem echten Stand, welcher Skill jetzt dran ist (als Slug), und folge diesem Skill. Hauptskill ist lotse (in Claude Code /albatros:lotse); nach jedem geschafften Schritt lage erneut. Den Einstieg führt der Skill start, Einzelheiten zu Konto und Server nennt konto_status. Private SSH-Schlüssel, Passwörter und Kartendaten gehen nie an diese Werkzeuge.';
const senden = (x: unknown) => process.stdout.write(`${JSON.stringify(x)}\n`);
let puffer = '';
process.stdin.on('data', (d) => {
  puffer += d;
  let i;
  while ((i = puffer.indexOf('\n')) >= 0) {
    const zeile = puffer.slice(0, i).trim();
    puffer = puffer.slice(i + 1);
    if (!zeile) continue;
    const m = JSON.parse(zeile);
    if (m.id === undefined) continue; // Benachrichtigungen
    if (m.method === 'initialize') {
      senden({ jsonrpc: '2.0', id: m.id, result: { protocolVersion: m.params?.protocolVersion ?? '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'albatros-attrappe', version: '1' }, instructions: ANLEITUNG } });
    } else if (m.method === 'tools/list') {
      senden({ jsonrpc: '2.0', id: m.id, result: { tools: werkzeuge.map((name) => ECHT.find((w) => w.name === name) ?? { name, description: `Albatros: ${name}`, inputSchema: { type: 'object', additionalProperties: true } }) } });
    } else if (m.method === 'tools/call') {
      const fehlt = (ECHT.find((w) => w.name === m.params?.name)?.inputSchema.required ?? []).filter((k) => (m.params?.arguments ?? {})[k] === undefined);
      const text = fehlt.length ? `Ungültige Angaben: ${fehlt.map((k) => `${k}: Invalid input: expected string, received undefined`).join(', ')}`
        : antwort(m.params?.name, m.params?.arguments ?? {}) ?? `Werkzeug ${m.params?.name} gibt es nicht.`;
      process.stderr.write(`[attrappe] ${m.params?.name} ${JSON.stringify(m.params?.arguments ?? {})}\n`);
      if (process.env.DURCHSPIEL_LOG) appendFileSync(process.env.DURCHSPIEL_LOG, `${JSON.stringify({ zeit: new Date().toISOString(), werkzeug: m.params?.name, argumente: m.params?.arguments ?? {} })}\n`);
      senden({ jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text }], ...(fehlt.length ? { isError: true } : {}) } });
    } else {
      senden({ jsonrpc: '2.0', id: m.id, result: {} });
    }
  }
});
