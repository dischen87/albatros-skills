import { afterAll, expect, test } from 'bun:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { baueVerzeichnisPaket, claudePfad, openaiManifest, PROFIL_URL, pruefeVerzeichnisPaket, SPRACHEN, SUPPORT, SUPPORT_URL, VERZEICHNIS_TOOLS, versionVon } from './verzeichnis-pakete.ts';
import { dateien } from './verzeichnisse.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const temp: string[] = [];
const neu = () => { const d = mkdtempSync(`${tmpdir()}/albatros-directory-`); temp.push(d); return d; };
afterAll(() => temp.forEach((d) => rmSync(d, { recursive: true, force: true })));

test('Claude: alle vier eingecheckten Bundles sind vollständig und mit den kuratierten Quellen reproduzierbar', async () => {
  for (const s of SPRACHEN) {
    const ziel = neu();
    await baueVerzeichnisPaket(wurzel, 'claude', s, ziel);
    expect(await pruefeVerzeichnisPaket(wurzel, 'claude', s, `${wurzel}/${claudePfad(s)}`)).toEqual([]);
    const m = await Bun.file(`${ziel}/.claude-plugin/plugin.json`).json();
    expect(m.author.email).toBe(SUPPORT);
    expect(m.supportUrl).toBe(SUPPORT_URL);
    const mcp = await Bun.file(`${ziel}/.mcp.json`).json();
    expect(mcp).toEqual({ mcpServers: { albatros: { type: 'http', url: PROFIL_URL.claude } } });
    expect(dateien(ziel).sort()).toEqual(['.claude-plugin/plugin.json', '.mcp.json', 'README.md', 'assets/icon.png', 'skills/projekt-planen/SKILL.md']);
  }
});

test('OpenAI: englische Basis, drei eigenständige Übersetzungen und nur Prüffälle für Profilwerkzeuge', async () => {
  const ziel = neu();
  await baueVerzeichnisPaket(wurzel, 'openai', 'en', ziel);
  expect(await pruefeVerzeichnisPaket(wurzel, 'openai', 'en', ziel)).toEqual([]);
  const m = await Bun.file(`${ziel}/.codex-plugin/plugin.json`).json();
  const o = m.extensions['com.openai'];
  expect(o.review.commerce).toBe(false);
  expect(o.review.commerce_description).toBeUndefined();
  expect(o.review.test_cases.positive).toHaveLength(5);
  expect(o.review.test_cases.negative).toHaveLength(3);
  for (const c of o.review.test_cases.positive) for (const tool of c.tools_triggered.split(', ')) expect(VERZEICHNIS_TOOLS).toContain(tool);
  expect(Object.keys(o.publication.translations).sort()).toEqual(['de-DE', 'fr-FR', 'it-IT']);
  for (const t of Object.values(o.publication.translations) as { subtitle: string; description: string }[]) {
    expect(t.subtitle.length).toBeLessThanOrEqual(30);
    expect(t.description).toContain(SUPPORT);
  }
  expect(m.interface.supportURL).toBe(SUPPORT_URL);
  expect(m.author.email).toBe(SUPPORT);
  expect(m).toEqual(openaiManifest(await versionVon(wurzel)));
  expect(dateien(ziel).sort()).toEqual(['.codex-plugin/plugin.json', '.mcp.json', 'assets/icon.png', 'skills/projekt-planen/SKILL.md']);
});

test('Kontaminierte Inhalte, zusätzliche Assets und volle oder fremde MCP-Verbindungen blockieren die Ausgabe', async () => {
  const ziel = neu();
  await baueVerzeichnisPaket(wurzel, 'openai', 'en', ziel);
  await Bun.write(`${ziel}/skills/projekt-planen/SKILL.md`, (await Bun.file(`${ziel}/skills/projekt-planen/SKILL.md`).text()) + '\nCall upgrade_link, bild_erzeugen and guthaben; open https://albatros.build/cockpit/abo.\n');
  await Bun.write(`${ziel}/assets/zusatz.txt`, 'unreviewed material');
  const mcp = await Bun.file(`${ziel}/.mcp.json`).json();
  mcp.mcpServers.albatros.url = 'https://mcp.albatros.build';
  mcp.mcpServers.extra = { url: 'https://example.test' };
  await Bun.write(`${ziel}/.mcp.json`, JSON.stringify(mcp));
  const f = await pruefeVerzeichnisPaket(wurzel, 'openai', 'en', ziel);
  expect(f).toContain('Dateiliste stimmt nicht mit dem kuratierten Paket überein.');
  expect(f).toContain('.mcp.json: weicht von der kuratierten Quelle ab.');
  expect(f).toContain('skills/projekt-planen/SKILL.md: Inhalt ausserhalb des Verzeichnisumfangs.');
  expect(f.some((x) => x.includes('falsche MCP-Adresse https://mcp.albatros.build'))).toBe(true);
});

test('Kein stilles Umschalten eines Claude-Bundles auf OpenAI oder Überschreiben vorhandener Ausgaben', async () => {
  const ziel = neu();
  await baueVerzeichnisPaket(wurzel, 'claude', 'de', ziel);
  await Bun.write(`${ziel}/.mcp.json`, JSON.stringify({ mcpServers: { albatros: { type: 'http', url: PROFIL_URL.openai } } }));
  expect((await pruefeVerzeichnisPaket(wurzel, 'claude', 'de', ziel)).some((x) => x.includes('falsche MCP-Adresse'))).toBe(true);
  expect(baueVerzeichnisPaket(wurzel, 'claude', 'de', ziel)).rejects.toThrow('ist nicht leer');
  expect(baueVerzeichnisPaket(wurzel, 'openai', 'de', neu())).rejects.toThrow('englische Basis');
});

test('Persönliche Pluginverbindungen enthalten weiterhin den vollen Server und den lokalen Arbeitsplatz', async () => {
  for (const suffix of ['', '-en', '-fr', '-it']) {
    const m = await Bun.file(`${wurzel}/plugins/albatros${suffix}/.mcp.json`).json();
    expect(m.mcpServers.albatros.url).toBe('https://mcp.albatros.build');
    expect(m.mcpServers['albatros-arbeitsplatz'].command).toBe('node');
  }
});
