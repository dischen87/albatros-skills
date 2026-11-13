// Repoübergreifender Vertrag, wenn die Plattform danebenliegt: ALBATROS wie in werkzeuge.test.ts.
// Keine Netzaufrufe und keine produktiven Werkzeuge; nur lokale Schemas und Konstanten.
import { expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PROFIL_URL, VERZEICHNIS_TOOLS } from './verzeichnis-pakete.ts';

const albatros = resolve(process.env.ALBATROS ?? `${import.meta.dir}/../../albatros`);
const profil = `${albatros}/services/mcp/src/profile.ts`;

test.skipIf(!existsSync(profil))('Verzeichnisbundles stimmen mit den tatsächlichen Plattform-URLs, Werkzeugen und P1–P10-Schemas überein', async () => {
  const p = await import(profil);
  const kit = await import(`${albatros}/packages/kit/src/index.ts`);
  for (const name of ['claude', 'openai'] as const) expect(PROFIL_URL[name]).toBe(`https://mcp.albatros.build${p.VERZEICHNIS_PFADE[name]}`);
  const s = { ...kit.ALLE_AUS, FAHRPLAN: true };
  const werkzeuge = p.verzeichnisWerkzeuge(s);
  expect(werkzeuge.map((w: { name: string }) => w.name).sort()).toEqual([...VERZEICHNIS_TOOLS].sort());
  const plan = Bun.YAML.parse(await Bun.file(new URL('../fahrplan.yaml', import.meta.url)).text());
  expect([...p.PROFIL_SCHRITTE]).toEqual(plan.phasen.slice(0, 10).flatMap((x: { insel: string[] }) => x.insel));
  const finde = (name: string) => werkzeuge.find((w: { name: string }) => w.name === name);
  expect(finde('lage').eingabe.safeParse({ skills_stand: '0.3.1', projekt: 'projekt', belege: [{ datei: 'docs/projekt.md', zeilen: ['Projektname: Velowerkstatt'] }] }).success).toBe(true);
  expect(finde('schritt_melden').eingabe.safeParse({ projekt: 'projekt', schritt: 'idee', titel: 'Velowerkstatt' }).success).toBe(true);
  expect(finde('schritt_melden').eingabe.safeParse({ projekt: 'projekt', schritt: 'live' }).success).toBe(false);
  expect(finde('lage').eingabe.safeParse({ belege: [{ datei: '.env', zeilen: ['SECRET=x'] }] }).success).toBe(false);
});
