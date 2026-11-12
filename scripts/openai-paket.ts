// Paket (ZIP) für den Plugin-Katalog von ChatGPT und Codex (docs/verzeichnisse.md, Teil «ChatGPT und Codex»).
//   bun scripts/openai-paket.ts <ziel.zip> [plugin]      plugin ohne Angabe: OPENAI_PLUGIN (albatros-en)
// Hochgeladen wird ein ZIP, nicht das Repo (developers.openai.com/plugins/deploy/submission.md, gelesen am 12.11.2026). Das Paket ist
// das Plugin aus diesem Repo mit drei Unterschieden, alle aus derselben Seite:
// - .mcp.json hat genau den Server albatros mit der öffentlichen Adresse und ohne Kopfzeilen («public submission rejects nonempty server
//   headers»), dazu die Anmeldung über OAuth mit CIMD (Rückfall DCR) unter extensions.com.openai.auth. Ohne Kopfzeile schickt die KI den
//   Stand der Skills als skills_stand bei lage mit, wie bei Gemini CLI und Cursor (Skills start und lotse).
// - Ohne Berts Arbeitsplatz: ein lokaler MCP-Server macht das Plugin zu «desktop-only» (eigener Weg, developers.openai.com/plugins/deploy/desktop-only).
// - Ohne evals/, .claude-plugin/, .cursor-plugin/ und mcp.json von Cursor: Sie gehören zu den anderen Verzeichnissen und zum Prüfen hier.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { dateien, MCP_URL, OPENAI_PLUGIN } from './verzeichnisse.ts';

const MIT = ['.codex-plugin', 'skills', 'assets', 'README.md'];

export async function baueOpenaiPaket(wurzel: string, plugin: string, ziel: string) {
  const quelle = `${wurzel.replace(/\/$/, '')}/plugins/${plugin}`;
  if (!existsSync(`${quelle}/.codex-plugin/plugin.json`)) throw new Error(`plugins/${plugin}/.codex-plugin/plugin.json fehlt`);
  if (existsSync(ziel) && readdirSync(ziel).length) throw new Error(`${ziel} ist nicht leer`);
  mkdirSync(ziel, { recursive: true });
  for (const t of MIT) cpSync(`${quelle}/${t}`, `${ziel}/${t}`, { recursive: true });
  const mcp = { mcpServers: { albatros: { url: MCP_URL, extensions: { 'com.openai': { auth: { type: 'oauth', client: { mode: 'cimd' } } } } } } };
  await Bun.write(`${ziel}/.mcp.json`, JSON.stringify(mcp, null, 2) + '\n');
}

// Was im Paket sein darf und muss; leer heisst in Ordnung
export async function pruefeOpenaiPaket(ordner: string): Promise<string[]> {
  const f: string[] = [];
  const alle = dateien(ordner);
  for (const d of alle) if (!MIT.some((t) => d === t || d.startsWith(`${t}/`)) && d !== '.mcp.json') f.push(`${d}: gehört nicht ins Paket`);
  if (alle.some((d) => /(^|\/)(\.DS_Store|Thumbs\.db)$/.test(d))) f.push('Systemdatei im Paket');
  const m = await Bun.file(`${ordner}/.codex-plugin/plugin.json`).json().catch(() => null);
  if (!m) return [...f, '.codex-plugin/plugin.json fehlt'];
  const mcp = await Bun.file(`${ordner}/.mcp.json`).json().catch(() => null);
  const s = mcp?.mcpServers ?? {};
  if (Object.keys(s).join() !== 'albatros') f.push(`.mcp.json: genau ein Server albatros, nicht ${Object.keys(s).join(', ')}`);
  if (s.albatros?.url !== MCP_URL) f.push(`.mcp.json: url muss ${MCP_URL} sein`);
  if (s.albatros?.headers || s.albatros?.http_headers || s.albatros?.command) f.push('.mcp.json: keine Kopfzeilen und kein lokaler Befehl (Einreichung bei OpenAI)');
  if (s.albatros?.extensions?.['com.openai']?.auth?.type !== 'oauth') f.push('.mcp.json: auth.type oauth fehlt');
  for (const p of [m.interface?.logo, m.interface?.composerIcon, m.extensions?.['com.openai']?.onboardingSkill])
    if (typeof p !== 'string' || !existsSync(`${ordner}/${p.replace(/^\.\//, '')}`)) f.push(`${p}: fehlt im Paket`);
  if (!alle.some((d) => /^skills\/[^/]+\/SKILL\.md$/.test(d))) f.push('skills/: keine Skills im Paket');
  return f;
}

if (import.meta.main) {
  const [zip, plugin = OPENAI_PLUGIN] = process.argv.slice(2);
  if (!zip?.endsWith('.zip')) {
    console.error('Aufruf: bun scripts/openai-paket.ts <ziel.zip> [plugin]');
    process.exit(2);
  }
  const wurzel = new URL('..', import.meta.url).pathname;
  const ziel = resolve(zip);
  if (ziel.startsWith(resolve(wurzel) + '/')) {
    console.error('Das ZIP gehört nicht ins Repo: einen Pfad ausserhalb nennen.');
    process.exit(2);
  }
  const ordner = mkdtempSync(`${tmpdir()}/openai-paket-`);
  try {
    await baueOpenaiPaket(wurzel, plugin, ordner);
    const f = await pruefeOpenaiPaket(ordner);
    if (f.length) throw new Error(f.join('\n'));
    rmSync(ziel, { force: true });
    const z = Bun.spawnSync(['zip', '-qrX', ziel, '.'], { cwd: ordner, stderr: 'pipe' });
    if (z.exitCode !== 0) throw new Error(`zip: ${z.stderr.toString()}`);
    console.log(`${ziel}: ${plugin} ${(await Bun.file(`${ordner}/.codex-plugin/plugin.json`).json()).version}, ${dateien(ordner).length} Dateien`);
  } catch (e) {
    console.error((e as Error).message);
    process.exitCode = 1;
  } finally {
    rmSync(ordner, { recursive: true, force: true });
  }
}
