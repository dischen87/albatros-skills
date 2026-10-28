// Prüft die Kopfdaten aller Skills (Agent-Skills-Standard) und aller Missionen (schema/mission.schema.json).
import Ajv from 'ajv/dist/2020';
import { Glob } from 'bun';
import schema from '../schema/mission.schema.json';

const wurzel = new URL('..', import.meta.url).pathname;
const pruefeMission = new Ajv({ allErrors: true }).compile(schema);
const fehler: string[] = [];
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;

async function kopfdaten(datei: string) {
  const m = (await Bun.file(wurzel + datei).text()).match(/^---\n([\s\S]*?)\n---\n\s*\S/);
  if (!m) fehler.push(`${datei}: Kopfdaten oder Text fehlen`);
  if (!m) return null;
  try {
    return Bun.YAML.parse(m[1]) as Record<string, any>;
  } catch (e) {
    fehler.push(`${datei}: Kopfdaten sind kein gültiges YAML (${(e as Error).message})`);
    return null;
  }
}

const skills = new Set<string>();
for await (const datei of new Glob('plugins/*/skills/*/SKILL.md').scan(wurzel)) {
  const ordner = datei.split('/').at(-2)!;
  const k = await kopfdaten(datei);
  if (!k) continue;
  if (k.name !== ordner || !NAME.test(ordner) || ordner.length > 64)
    fehler.push(`${datei}: name muss gleich wie der Ordner sein (klein, Bindestriche, höchstens 64 Zeichen)`);
  if (typeof k.description !== 'string' || !k.description.trim() || k.description.length > 1024)
    fehler.push(`${datei}: description fehlt oder ist länger als 1024 Zeichen`);
  skills.add(ordner);
}

// Die Bibliothek im Hauptskill lotse nennt jeden Skill ihres Plugins, damit man ohne Anmeldung selbst wählen kann
for await (const datei of new Glob('plugins/*/skills/lotse/SKILL.md').scan(wurzel)) {
  const text = await Bun.file(wurzel + datei).text();
  for await (const andere of new Glob(datei.replace('lotse/SKILL.md', '*/SKILL.md')).scan(wurzel)) {
    const name = andere.split('/').at(-2)!;
    if (name !== 'lotse' && !text.includes(`| \`${name}\` |`)) fehler.push(`${datei}: Skill «${name}» fehlt in der Bibliothek`);
  }
}

const wege = new Set<string>();
for await (const datei of new Glob('missionen/*/*.md').scan(wurzel)) {
  const [, weg, name] = datei.split('/');
  const k = await kopfdaten(datei);
  if (!k) continue;
  wege.add(weg);
  if (!pruefeMission(k))
    for (const e of pruefeMission.errors!) fehler.push(`${datei}: ${e.instancePath || '/'} ${e.message}`);
  if (k.id !== `${weg}-${name.replace(/\.md$/, '')}`) fehler.push(`${datei}: id muss «${weg}-${name.replace(/\.md$/, '')}» sein`);
  if (k.weg !== weg) fehler.push(`${datei}: weg muss «${weg}» sein`);
  if (k.abo !== 'pilot' && k.pruefung?.some((p: any) => p.typ === 'docker' || p.typ === 'workflow'))
    fehler.push(`${datei}: Prüfung mit docker oder workflow braucht abo: pilot`);
  // ponytail: Methoden des Wegs geschaeft liegen im privaten Repo albatros-methoden und sind hier nicht prüfbar.
  if (weg !== 'geschaeft' && !skills.has(k.skill)) fehler.push(`${datei}: Skill «${k.skill}» gibt es nicht`);
}
for (const weg of ['flugschule', 'webseite', 'geschaeft'])
  if (!wege.has(weg)) fehler.push(`missionen/${weg}: keine Missionen`);

// Übersetzte Vorlage: flotte legt uebersetzungen/<sprache>/vorlage über vorlage/. YAML muss gleich gebaut sein wie das deutsche,
// nur Kommentare, name: und Texte in "…" dürfen anders sein. Sonst liefe das Fliessband in einer Sprache mit alten Befehlen.
const gerippe = (t: string) => t.split('\n').map((z) => z.replace(/#.*$/, '').replace(/"[^"]*"/g, '""').replace(/(name:).*/, '$1').trimEnd()).join('\n');
for await (const datei of new Glob('uebersetzungen/*/vorlage/**/*').scan({ cwd: wurzel, dot: true })) {
  const de = 'vorlage/' + datei.split('/').slice(3).join('/');
  if (!(await Bun.file(wurzel + de).exists())) fehler.push(`${datei}: ${de} gibt es nicht`);
  else if (/\.ya?ml$/.test(datei) && gerippe(await Bun.file(wurzel + datei).text()) !== gerippe(await Bun.file(wurzel + de).text()))
    fehler.push(`${datei}: anders gebaut als ${de}`);
}

if (fehler.length) {
  console.error(fehler.join('\n'));
  process.exit(1);
}
console.log(`${skills.size} Skills und alle Missionen in Ordnung.`);
