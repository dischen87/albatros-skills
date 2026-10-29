// Attrappe des MCP-Diensts von Albatros für den Durchspiel-Test (stdio, JSON-RPC je Zeile). Jedes Werkzeug antwortet mit dem festen
// Text aus scripts/durchspiel/mocks/<werkzeug>.md, sonst aus plugins/albatros/evals/mocks/albatros/<werkzeug>.md (wie die Evals).
// Mit DURCHSPIEL_HAFEN legt seite_erstellen den Hafen unter dem gewünschten Namen an (Kopie von vorlage.git); danach gilt
// <werkzeug>.seite.md, falls vorhanden. Platzhalter: {repo}, {name} (Name der Seite), {stand} (zuletzt veröffentlicht).
// Keine Zahlung, kein Server: Albatros wird nie echt angesprochen.
import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const wurzel = new URL('../..', import.meta.url).pathname;
const ordner = [join(wurzel, 'scripts/durchspiel/mocks'), join(wurzel, 'plugins/albatros/evals/mocks/albatros')];
const HAFEN = process.env.DURCHSPIEL_HAFEN;
const seiteName = () => (HAFEN && existsSync(join(HAFEN, 'seite')) ? readFileSync(join(HAFEN, 'seite'), 'utf8').trim() : null);
const stand = (n: string) => {
  const zeit = spawnSync('git', ['--git-dir', join(HAFEN!, n, 'projekt.git'), 'log', '-1', '--format=%cd', '--date=format:%d.%m.%Y %H:%M', 'main', '--', 'seite']).stdout?.toString().trim();
  return zeit ? `zuletzt veröffentlicht ${zeit}` : 'noch nichts veröffentlicht';
};
const antwort = (werkzeug: string, a: { name?: string }) => {
  if (werkzeug === 'seite_erstellen' && HAFEN && /^[a-z0-9-]{3,32}$/.test(a.name ?? '')) {
    const ziel = join(HAFEN, a.name!, 'projekt.git');
    if (!existsSync(ziel)) spawnSync('git', ['clone', '-q', '--bare', join(HAFEN, 'vorlage.git'), ziel]);
    writeFileSync(join(HAFEN, 'seite'), a.name!);
  }
  const n = seiteName();
  for (const o of ordner) for (const f of [...(n ? [join(o, `${werkzeug}.seite.md`)] : []), join(o, `${werkzeug}.md`)]) {
    if (existsSync(f)) return readFileSync(f, 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim().replaceAll('{repo}', wurzel.replace(/\/$/, ''))
      .replaceAll('{name}', a.name ?? n ?? 'curling-grindelwald').replaceAll('{stand}', n ? stand(n) : '');
  }
  return null;
};
const werkzeuge = [...new Set(ordner.flatMap((o) => (existsSync(o) ? readdirSync(o) : []).filter((f) => f.endsWith('.md') && !f.endsWith('.seite.md')).map((f) => f.slice(0, -3))))];

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
      senden({ jsonrpc: '2.0', id: m.id, result: { protocolVersion: m.params?.protocolVersion ?? '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'albatros-attrappe', version: '1' } } });
    } else if (m.method === 'tools/list') {
      senden({ jsonrpc: '2.0', id: m.id, result: { tools: werkzeuge.map((name) => ({ name, description: `Albatros: ${name}`, inputSchema: { type: 'object', additionalProperties: true } })) } });
    } else if (m.method === 'tools/call') {
      const text = antwort(m.params?.name, m.params?.arguments ?? {}) ?? `Werkzeug ${m.params?.name} gibt es nicht.`;
      process.stderr.write(`[attrappe] ${m.params?.name} ${JSON.stringify(m.params?.arguments ?? {})}\n`);
      if (process.env.DURCHSPIEL_LOG) appendFileSync(process.env.DURCHSPIEL_LOG, `${JSON.stringify({ zeit: new Date().toISOString(), werkzeug: m.params?.name, argumente: m.params?.arguments ?? {} })}\n`);
      senden({ jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text }] } });
    } else {
      senden({ jsonrpc: '2.0', id: m.id, result: {} });
    }
  }
});
