// Plugin-Verzeichnisse (scripts/verzeichnisse.ts, scripts/openai-paket.ts): die echten Manifeste sind in Ordnung, und jeder eingebaute
// Fehler wird rot. Die Fehler laufen in einer Kopie der Manifeste, ohne Berts Arbeitsplatz und ohne Evals.
import { afterAll, expect, test } from 'bun:test';
import { cpSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { baueOpenaiPaket, OPENAI_VERZEICHNIS_PLUGIN, pruefeOpenaiPaket } from './openai-paket.ts';
import { PROFIL_URL } from './verzeichnis-pakete.ts';
import { kontrast, MCP_URL, pngGroesse, pruefeVerzeichnisse, woerter } from './verzeichnisse.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const PLUGINS = ['albatros', 'albatros-fr', 'albatros-it', 'albatros-en'];
const temp: string[] = [];
const neu = (name: string) => {
  const d = mkdtempSync(`${tmpdir()}/${name}-`);
  temp.push(d);
  return d;
};
afterAll(() => temp.forEach((d) => rmSync(d, { recursive: true, force: true })));

function kopie() {
  const k = neu('verzeichnisse');
  for (const d of ['.claude-plugin', '.cursor-plugin']) cpSync(`${wurzel}${d}`, `${k}/${d}`, { recursive: true });
  for (const p of PLUGINS)
    cpSync(`${wurzel}plugins/${p}`, `${k}/plugins/${p}`, { recursive: true, filter: (q) => !/\/(arbeitsplatz|evals)(\/|$)/.test(q.slice(wurzel.length)) || q.endsWith('/evals') || /\/evals\/mocks(\/|$)/.test(q) });
  return k + '/';
}
const aendere = async (datei: string, f: (j: any) => void) => {
  const j = await Bun.file(datei).json();
  f(j);
  await Bun.write(datei, JSON.stringify(j, null, 2));
};

test('Die Manifeste im Repo erfüllen die Regeln der drei Verzeichnisse', async () => {
  expect(await pruefeVerzeichnisse(wurzel)).toEqual([]);
});

test('Cursor: falsche Adresse, fremdes Feld, fehlendes Logo, fehlendes Plugin werden rot', async () => {
  const k = kopie();
  expect(await pruefeVerzeichnisse(k)).toEqual([]);
  await aendere(`${k}plugins/albatros/mcp.json`, (j) => (j.mcpServers.albatros.url = `${MCP_URL}/mcp`));
  await aendere(`${k}plugins/albatros-fr/.cursor-plugin/plugin.json`, (j) => (j.icon = './assets/icon.png'));
  await aendere(`${k}plugins/albatros-it/.cursor-plugin/plugin.json`, (j) => (j.logo = 'assets/fehlt.png'));
  await aendere(`${k}.cursor-plugin/marketplace.json`, (j) => j.plugins.pop());
  await aendere(`${k}plugins/albatros-en/mcp.json`, (j) => (j.mcpServers['albatros-arbeitsplatz'] = { command: 'node' }));
  expect(await pruefeVerzeichnisse(k)).toEqual([
    `.cursor-plugin/marketplace.json: Plugins «albatros ./plugins/albatros, albatros-fr ./plugins/albatros-fr, albatros-it ./plugins/albatros-it», in .claude-plugin/marketplace.json «albatros ./plugins/albatros, albatros-fr ./plugins/albatros-fr, albatros-it ./plugins/albatros-it, albatros-en ./plugins/albatros-en»`,
    `plugins/albatros/mcp.json: url muss ${MCP_URL} sein (die öffentliche Adresse)`,
    'plugins/albatros-fr/.cursor-plugin/plugin.json: Feld icon kennt Cursor nicht',
    'plugins/albatros-it/.cursor-plugin/plugin.json: assets/fehlt.png gibt es nicht',
    'plugins/albatros-en/mcp.json: genau der Server albatros, nicht albatros, albatros-arbeitsplatz',
  ]);
});

test('Claude: fehlendes Icon, kurze README, Link aus dem Plugin, fehlende Datenschutz-Adresse werden rot', async () => {
  const k = kopie();
  await aendere(`${k}plugins/albatros/.claude-plugin/plugin.json`, (j) => delete j.privacyPolicyUrl);
  await aendere(`${k}plugins/albatros-fr/.claude-plugin/plugin.json`, (j) => (j.icon = './assets/fehlt.png'));
  await Bun.write(`${k}plugins/albatros-it/README.md`, '# Albatros\n\n```\nviele Wörter im Code zählen nicht\n```\n\nKurz.');
  const en = `${k}plugins/albatros-en/README.md`;
  await Bun.write(en, (await Bun.file(en).text()) + '\nSee [the guide](../../EINRICHTEN.md).\n');
  const f = await pruefeVerzeichnisse(k);
  expect(f).toContain('plugins/albatros/.claude-plugin/plugin.json: privacyPolicyUrl muss eine https-Adresse sein');
  expect(f).toContain('plugins/albatros-fr/.claude-plugin/plugin.json: ./assets/fehlt.png gibt es nicht');
  expect(f).toContain('plugins/albatros-it/README.md: 2 Wörter ausserhalb von Code-Blöcken, verlangt mindestens 40');
  expect(f).toContain('plugins/albatros-en/README.md: Link mit ../ zeigt aus dem Plugin hinaus (installiert wird nur der Plugin-Ordner)');
  expect(f).toHaveLength(4 + 5); // die README von it nennt dazu Adresse, Kopfzeile, Server, 127.0.0.1 und Datenschutz nicht mehr
});

test('ChatGPT und Codex: zu lange Texte, falsches Werkzeug, fehlende Fälle, alte Übersetzung werden rot', async () => {
  const k = kopie();
  const en = `${k}plugins/albatros-en/.codex-plugin/plugin.json`;
  await aendere(en, (j) => {
    j.interface.shortDescription = 'From an idea to your very own website';
    j.extensions['com.openai'].review.test_cases.positive[0].tools_triggered = 'konto_status, gibt_es_nicht';
    j.extensions['com.openai'].review.test_cases.negative.pop();
    j.interface.brandColor = '#FFFF00';
  });
  await aendere(`${k}plugins/albatros-fr/.codex-plugin/plugin.json`, (j) => (j.interface.shortDescription = 'Ton site web'));
  await aendere(`${k}plugins/albatros/.codex-plugin/plugin.json`, (j) => (j.mcpServers = './mcp.json'));
  expect(await pruefeVerzeichnisse(k)).toEqual([
    'plugins/albatros/.codex-plugin/plugin.json: mcpServers muss "./.mcp.json" sein',
    'plugins/albatros-en/.codex-plugin/plugin.json: interface.shortDescription höchstens 30 Zeichen (ist 37)',
    'plugins/albatros-en/.codex-plugin/plugin.json: interface.brandColor #RRGGBB mit mindestens 2:1 gegen Weiss',
    'plugins/albatros-en/.codex-plugin/plugin.json: review.test_cases braucht genau 5 positive und 3 negative Fälle (sind 5 und 2)',
    'plugins/albatros-en/.codex-plugin/plugin.json: positiver Fall 1: Werkzeug gibt_es_nicht gibt es im Server albatros nicht',
    'plugins/albatros-en/.codex-plugin/plugin.json: translations.fr-FR anders als interface in plugins/albatros-fr/.codex-plugin/plugin.json',
  ]);
});

test('Paket für OpenAI: nur Skills, Manifest und Bild, ein Server ohne Kopfzeilen', async () => {
  const ziel = neu('openai-paket');
  await baueOpenaiPaket(wurzel, OPENAI_VERZEICHNIS_PLUGIN, ziel);
  expect(await pruefeOpenaiPaket(ziel)).toEqual([]);
  const mcp = await Bun.file(`${ziel}/.mcp.json`).json();
  expect(mcp).toEqual({ mcpServers: { albatros: { url: PROFIL_URL.openai, extensions: { 'com.openai': { auth: { type: 'oauth', client: { mode: 'cimd' } } } } } } });
  // Eingebaute Fehler: Arbeitsplatz, Kopfzeile, zweiter Server
  cpSync(`${wurzel}plugins/albatros-en/.mcp.json`, `${ziel}/.mcp.json`);
  await Bun.write(`${ziel}/arbeitsplatz/README.md`, 'x');
  const f = await pruefeOpenaiPaket(ziel);
  expect(f).toContain('Dateiliste stimmt nicht mit dem kuratierten Paket überein.');
  expect(f).toContain('.mcp.json: weicht von der kuratierten Quelle ab.');
  expect(f.some((x) => x.includes('falsche MCP-Adresse'))).toBe(true);
  expect(baueOpenaiPaket(wurzel, OPENAI_VERZEICHNIS_PLUGIN, ziel)).rejects.toThrow('ist nicht leer');
  expect(baueOpenaiPaket(wurzel, 'albatros-en', neu('kein-vollplugin'))).rejects.toThrow('keine persönlichen Vollplugins');
});

test('Hilfen: PNG-Grösse, Kontrast, Wörter ohne Code-Blöcke', async () => {
  expect(pngGroesse(new Uint8Array(await Bun.file(`${wurzel}plugins/albatros/assets/icon.png`).arrayBuffer()))).toEqual({ breite: 512, hoehe: 512 });
  expect(pngGroesse(new TextEncoder().encode('kein Bild, aber lang genug für den Kopf'))).toBeNull();
  expect(kontrast('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
  expect(kontrast('#2B5AD2', '#FFFFFF')).toBeGreaterThan(2);
  expect(woerter('eins zwei\n```\ndrei vier\n```\nfünf – `sechs`')).toBe(4);
});
