// Einreichungs-ZIP von Albatros Project Planning, unabhängig von den vollen persönlichen Plugins.
//   bun scripts/openai-paket.ts <ziel.zip>
import { mkdtempSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { baueVerzeichnisPaket, pluginName, pruefeVerzeichnisPaket, versionVon } from './verzeichnis-pakete.ts';
import { dateien } from './verzeichnisse.ts';

export const OPENAI_VERZEICHNIS_PLUGIN = pluginName('en');
const WURZEL = resolve(import.meta.dir, '..');

export async function baueOpenaiPaket(wurzel: string, plugin: string, ziel: string) {
  if (plugin !== OPENAI_VERZEICHNIS_PLUGIN) throw new Error(`Für das Verzeichnis nur ${OPENAI_VERZEICHNIS_PLUGIN}, keine persönlichen Vollplugins.`);
  await baueVerzeichnisPaket(wurzel, 'openai', 'en', ziel);
}

export const pruefeOpenaiPaket = (ordner: string, wurzel = WURZEL) => pruefeVerzeichnisPaket(wurzel, 'openai', 'en', ordner);

if (import.meta.main) {
  const [zip, plugin = OPENAI_VERZEICHNIS_PLUGIN] = process.argv.slice(2);
  if (!zip?.endsWith('.zip')) throw new Error('Aufruf: bun scripts/openai-paket.ts <ziel.zip>');
  const ziel = resolve(zip);
  if (ziel.startsWith(WURZEL + '/')) throw new Error('Das ZIP gehört nicht ins Repo: einen Pfad ausserhalb nennen.');
  const ordner = mkdtempSync(`${tmpdir()}/openai-paket-`);
  const zipTemp = mkdtempSync(`${dirname(ziel)}/.albatros-zip-`);
  try {
    await baueOpenaiPaket(WURZEL, plugin, ordner);
    const gebaut = `${zipTemp}/paket.zip`;
    const z = Bun.spawnSync(['zip', '-qrX', gebaut, '.'], { cwd: ordner, stderr: 'pipe' });
    if (z.exitCode !== 0) throw new Error(`zip: ${z.stderr.toString()}`);
    renameSync(gebaut, ziel);
    console.log(`${ziel}: ${plugin} ${await versionVon(WURZEL)}, ${dateien(ordner).length} Dateien`);
  } finally {
    rmSync(ordner, { recursive: true, force: true });
    rmSync(zipTemp, { recursive: true, force: true });
  }
}
