// Prüft die Kopfdaten aller Skills (Agent-Skills-Standard) und aller Missionen (schema/mission.schema.json) und den Fahrplan
// (fahrplan.yaml gegen schema/fahrplan.schema.json, dazu was ein Schema nicht prüfen kann).
import Ajv from 'ajv/dist/2020';
import { Glob } from 'bun';
import { existsSync } from 'node:fs';
import schema from '../schema/mission.schema.json';
import { ALTE_INSEL, ladeFahrplan } from './fahrplan.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const pruefeMission = new Ajv({ allErrors: true }).compile(schema);
const fehler: string[] = [];
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Methoden des Wegs Geschäft liegen im privaten Repo albatros-methoden; geprüft wird nur, wo es daneben liegt (nicht in CI)
const METHODEN = wurzel + '../albatros-methoden/skills/';
const methodeFehlt = (name: string) => existsSync(METHODEN) && !existsSync(`${METHODEN}${name}/SKILL.md`);
const skillFehlt = async (name: string) => !(await Bun.file(`${wurzel}plugins/albatros/skills/${name}/SKILL.md`).exists());

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

// Fahrplan: nach dem Schema, was ein Schema nicht prüfen kann
const plan = await ladeFahrplan(wurzel);
if (!plan.ok) fehler.push(...plan.fehler);
const fahrplan = plan.ok ? plan.fahrplan : null;
if (fahrplan) {
  const f = (text: string) => fehler.push(`fahrplan.yaml: ${text}`);
  const ids = fahrplan.phasen.map((p) => p.id);
  if (ids.join() !== ids.map((_, i) => `P${i + 1}`).join()) f(`Phasen müssen P1 bis P${ids.length} in dieser Reihenfolge sein, nicht ${ids.join(', ')}`);
  if (!ids.includes(fahrplan.gratis_bis)) f(`gratis_bis: ${fahrplan.gratis_bis} ist keine Phase`);
  const fragen = new Map<string, string>();
  for (const p of fahrplan.phasen) {
    for (const q of p.pflichtfragen) {
      if (fragen.has(q.id)) f(`Pflichtfrage «${q.id}» gibt es in ${fragen.get(q.id)} und in ${p.id}`);
      fragen.set(q.id, p.id);
      // Die Antwort gehört in eine Datei (und Zeile) aus dem Ergebnis derselben Phase, sonst sieht das Gate sie nicht
      const [datei, zeile] = q.ablage.split('#');
      const e = p.ergebnis.find((x) => x.datei === datei);
      if (!e) f(`${p.id} ${q.id}: ablage ${datei} steht nicht im Ergebnis der Phase`);
      else if (zeile && !e.zeilen?.includes(zeile)) f(`${p.id} ${q.id}: Zeile «${zeile}» fehlt in den Zeilen von ${datei}`);
    }
    const person = p.pflichtfragen.filter((q) => q.antwortet === 'person').length;
    if (person > fahrplan.fragen_je_phase) f(`${p.id}: ${person} Fragen an die Person, höchstens ${fahrplan.fragen_je_phase} (fragen_je_phase)`);
    for (const skill of [p.skill, p.varianten?.modernisieren?.skill])
      if (skill && (await skillFehlt(skill))) f(`${p.id}: Skill «${skill}» gibt es nicht in plugins/albatros/skills`);
    for (const m of p.methoden?.geschaeft ?? []) if (methodeFehlt(m)) f(`${p.id}: Methode «${m}» gibt es nicht in albatros-methoden/skills`);
  }
  if (await skillFehlt(fahrplan.nach_live.aendern.skill)) f(`nach_live: Skill «${fahrplan.nach_live.aendern.skill}» gibt es nicht in plugins/albatros/skills`);
  for (const m of fahrplan.nach_live.landen.geschaeft ?? []) if (methodeFehlt(m)) f(`nach_live: Methode «${m}» gibt es nicht in albatros-methoden/skills`);
  for (const j of fahrplan.ja_momente) {
    const q = fahrplan.phasen.find((p) => p.id === j.phase)?.pflichtfragen.find((x) => x.id === j.frage);
    if (q?.antwortet !== 'person') f(`Ja-Moment ${j.phase} «${j.frage}»: braucht eine Pflichtfrage dieser Phase mit antwortet: person`);
  }
  // Jeder Insel-Schritt gehört zu genau einer Phase; die zehn alten behalten ihre Reihenfolge, neue kommen dazwischen
  const inPhasen = fahrplan.phasen.flatMap((p) => p.insel);
  if (inPhasen.join() !== fahrplan.insel.join()) f(`insel muss genau phasen[].insel in derselben Reihenfolge sein (${inPhasen.join(', ')})`);
  const alt = ALTE_INSEL.map((s) => fahrplan.insel.indexOf(s));
  if (alt.some((i, n) => i < 0 || (n > 0 && i <= alt[n - 1]!))) f(`insel: die zehn alten Schritte fehlen oder stehen nicht in alter Reihenfolge (${ALTE_INSEL.join(' < ')})`);
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
  if (weg === 'geschaeft' ? methodeFehlt(k.skill) : !skills.has(k.skill)) fehler.push(`${datei}: Skill «${k.skill}» gibt es nicht`);
}
for (const weg of ['flugschule', 'webseite', 'geschaeft'])
  if (!wege.has(weg)) fehler.push(`missionen/${weg}: keine Missionen`);

// Jeder Skill (mit allen Dateien daneben, etwa pruefen.mjs) und jede Mission gibt es in allen vier Sprachen. Dateien neben SKILL.md
// sind in jeder Sprache gleich: Sie geben keinen Text aus, den die Person liest, ohne dass die KI ihn erklärt.
const uebersetzt = async (pfad: string) => Bun.file(wurzel + pfad).exists();
for (const s of ['fr', 'it', 'en']) {
  for await (const datei of new Glob('plugins/albatros/skills/*/*').scan(wurzel)) {
    const dort = datei.replace('plugins/albatros/', `plugins/albatros-${s}/`);
    if (!(await uebersetzt(dort))) fehler.push(`${dort} fehlt`);
    else if (!datei.endsWith('SKILL.md') && (await Bun.file(wurzel + dort).text()) !== (await Bun.file(wurzel + datei).text())) fehler.push(`${dort}: anders als ${datei}`);
  }
  for await (const datei of new Glob('missionen/*/*.md').scan(wurzel)) {
    if (!(await uebersetzt(`uebersetzungen/${s}/${datei}`))) fehler.push(`uebersetzungen/${s}/${datei} fehlt`);
  }
}

// Übersetzte Vorlage: flotte legt uebersetzungen/<sprache>/vorlage über vorlage/. YAML muss gleich gebaut sein wie das deutsche,
// nur Kommentare, name: und Texte in "…" dürfen anders sein. Sonst liefe das Fliessband in einer Sprache mit alten Befehlen.
const gerippe = (t: string) => t.split('\n').map((z) => z.replace(/#.*$/, '').replace(/"[^"]*"/g, '""').replace(/(name:).*/, '$1').trimEnd()).join('\n');
for await (const datei of new Glob('uebersetzungen/*/vorlage/**/*').scan({ cwd: wurzel, dot: true })) {
  const de = 'vorlage/' + datei.split('/').slice(3).join('/');
  if (!(await Bun.file(wurzel + de).exists())) fehler.push(`${datei}: ${de} gibt es nicht`);
  else if (/\.ya?ml$/.test(datei) && gerippe(await Bun.file(wurzel + datei).text()) !== gerippe(await Bun.file(wurzel + de).text()))
    fehler.push(`${datei}: anders gebaut als ${de}`);
}
// motd.sh läuft beim Einloggen als root: muss sich als Shell-Skript lesen lassen
for await (const datei of new Glob('uebersetzungen/*/instanz/*.sh').scan(wurzel)) {
  const r = Bun.spawnSync(['sh', '-n', wurzel + datei]);
  if (r.exitCode !== 0) fehler.push(`${datei}: sh -n scheitert: ${r.stderr.toString().trim()}`);
}

if (fehler.length) {
  console.error(fehler.join('\n'));
  process.exit(1);
}
console.log(`${skills.size} Skills, alle Missionen und der Fahrplan (${fahrplan?.phasen.length} Phasen) in Ordnung.`);
