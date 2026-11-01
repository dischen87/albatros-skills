// Prüft die Kopfdaten aller Skills (Agent-Skills-Standard) und aller Missionen (schema/mission.schema.json), den Fahrplan
// (fahrplan.yaml gegen schema/fahrplan.schema.json, dazu was ein Schema nicht prüfen kann) und dass GUTE-ANTWORT.md erzeugt ist.
// Dazu Texte, die an zwei Orten stehen (scripts/abgleich.ts): die Vorlage je Sprache gegen webseite-planen, die Befehle zum
// Aktualisieren in der README gegen den Lotse.
import Ajv from 'ajv/dist/2020';
import { Glob } from 'bun';
import { existsSync } from 'node:fs';
import schema from '../schema/mission.schema.json';
import { befehleAusReadme, befehleAusSkill, titelAusweg, unterschiede, vorlageGegenSkill } from './abgleich.ts';
import { pruefeAbschnittsnamen } from './abschnitte.ts';
import { ALTE_INSEL, ladeFahrplan } from './fahrplan.ts';
import { guteAntwort, ZIEL } from './gute-antwort.ts';
import { lektionenFehlen } from './lektionen.ts';
import { ladeFragen, missionsverweise, type SkillText } from './missionsverweise.ts';
import { hoeher, quelle } from './stand.ts';

type Mission = {
  id: string;
  weg: string;
  phase: string;
  optional?: boolean;
  abo?: 'light' | 'pilot';
  skill: string;
  pruefung: { typ: string; schritt?: string }[];
  verstehen?: { frage: string; kern: string }[];
};
const wurzel = new URL('..', import.meta.url).pathname;
const pruefeMission = new Ajv({ allErrors: true }).compile<Mission>(schema);
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

// Version (scripts/stand.ts): alle Plugins und ihre Einträge im Marktplatz gleich, im Format a.b.c
const VERSION: string = (await Bun.file(wurzel + 'plugins/albatros/.claude-plugin/plugin.json').json()).version;
if (!/^\d+\.\d+\.\d+$/.test(String(VERSION))) fehler.push(`plugins/albatros/.claude-plugin/plugin.json: version ${VERSION} ist nicht a.b.c`);
for (const p of (await Bun.file(wurzel + '.claude-plugin/marketplace.json').json()).plugins as { name: string; source: string; version: string }[]) {
  if (p.version !== VERSION) fehler.push(`.claude-plugin/marketplace.json: ${p.name} hat version ${p.version}, nicht ${VERSION}`);
  const eigen = (await Bun.file(`${wurzel}${p.source}/.claude-plugin/plugin.json`).json()).version;
  if (eigen !== VERSION) fehler.push(`${p.source.replace(/^\.\//, '')}/.claude-plugin/plugin.json: version ${eigen}, nicht ${VERSION}`);
}
// Ändert sich etwas unter plugins/*/skills, steigt die Version gegenüber origin/main (sonst behalten alte Installationen den alten Stand
// ohne es zu merken). Ohne origin/main, etwa in einer flachen Kopie, entfällt diese Prüfung.
const git = (...a: string[]) => Bun.spawnSync(['git', '-C', wurzel, ...a]);
if (git('rev-parse', '--verify', '--quiet', 'origin/main^{commit}').exitCode === 0) {
  const SKILLS = ':(glob)plugins/*/skills/**';
  const geaendert = [git('diff', '--name-only', 'origin/main', '--', SKILLS), git('ls-files', '--others', '--exclude-standard', '--', SKILLS)].some((r) => r.stdout.toString().trim());
  const vorher = git('show', 'origin/main:plugins/albatros/.claude-plugin/plugin.json');
  const alt: unknown = vorher.exitCode === 0 ? JSON.parse(vorher.stdout.toString()).version : null;
  if (geaendert && typeof alt === 'string' && !hoeher(VERSION, alt)) fehler.push(`Skills geändert gegenüber origin/main, aber version ${VERSION} ist nicht höher als ${alt} (alle plugin.json und marketplace.json)`);
} else console.log('Ohne origin/main: Prüfung «Version höher als auf main» übersprungen.');

const skills = new Set<string>();
for await (const datei of new Glob('plugins/*/skills/*/SKILL.md').scan(wurzel)) {
  const ordner = datei.split('/').at(-2)!;
  const k = await kopfdaten(datei);
  if (!k) continue;
  // Jede SKILL.md trägt den Stand; eine Übersetzung nennt den deutschen Text, nach dem sie übersetzt ist
  const meta = typeof k.metadata === 'object' && k.metadata !== null ? k.metadata : {};
  if (meta.stand !== VERSION) fehler.push(`${datei}: metadata.stand muss ${VERSION} sein (version in plugin.json), nicht ${meta.stand ?? 'leer'}`);
  if (!datei.startsWith('plugins/albatros/')) {
    const de = Bun.file(`${wurzel}plugins/albatros/skills/${ordner}/SKILL.md`);
    const soll = (await de.exists()) ? quelle(await de.text()) : null;
    if (!soll) fehler.push(`${datei}: keine deutsche SKILL.md in plugins/albatros/skills/${ordner}`);
    else if (meta.quelle !== soll)
      fehler.push(`${datei}: Übersetzung veraltet, metadata.quelle ist ${meta.quelle ?? 'leer'}, der deutsche Text hat ${soll} (erst übersetzen, dann quelle setzen)`);
  }
  if (k.name !== ordner || !NAME.test(ordner) || ordner.length > 64)
    fehler.push(`${datei}: name muss gleich wie der Ordner sein (klein, Bindestriche, höchstens 64 Zeichen)`);
  if (typeof k.description !== 'string' || !k.description.trim() || k.description.length > 1024)
    fehler.push(`${datei}: description fehlt oder ist länger als 1024 Zeichen`);
  // Ohne Überschrift bricht flugschule (skills.ts) beim Laden ab
  if (!/\n---\n[\s\S]*?^# \S/m.test(await Bun.file(wurzel + datei).text())) fehler.push(`${datei}: Überschrift «# …» fehlt`);
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

// P1 legt AGENTS.md im Projekt an, mit demselben Text wie die Vorlage im Hafen: je Sprache der Block in webseite-planen gleich
// vorlage/AGENTS.md (übersetzt: uebersetzungen/<sprache>/vorlage/), CLAUDE.md und GEMINI.md mit der Zeile aus dem Skill und dem Verweis
const lies = async (pfad: string) => ((await Bun.file(wurzel + pfad).exists()) ? Bun.file(wurzel + pfad).text() : null);
for (const s of ['de', 'fr', 'it', 'en']) {
  const skill = `plugins/albatros${s === 'de' ? '' : `-${s}`}/skills/webseite-planen/SKILL.md`;
  const ordner = s === 'de' ? 'vorlage' : `uebersetzungen/${s}/vorlage`;
  const text = await lies(skill);
  if (text === null) continue; // eine fehlende Übersetzung meldet die Prüfung der vier Sprachen
  const vorlage = { 'AGENTS.md': await lies(`${ordner}/AGENTS.md`), 'CLAUDE.md': await lies(`${ordner}/CLAUDE.md`), 'GEMINI.md': await lies(`${ordner}/GEMINI.md`) };
  for (const f of vorlageGegenSkill(text, vorlage)) fehler.push(`${ordner}/${f} (gegen ${skill})`);
}

// Befehle zum Aktualisieren: albatros erzeugt aus der README (Abschnitt «Aktualisieren») AKTUALISIEREN, das lage bei veralteten Skills
// nennt; der Lotse (de) sagt der KI dieselben Befehle
const LOTSE = 'plugins/albatros/skills/lotse/SKILL.md';
const imLotse = befehleAusSkill((await lies(LOTSE)) ?? '');
const inReadme = befehleAusReadme((await lies('README.md')) ?? '');
if (typeof imLotse === 'string') fehler.push(`${LOTSE}: ${imLotse}`);
else if (!inReadme) fehler.push('README.md: Abschnitt «Aktualisieren» mit der Tabelle «| KI | Befehle |» fehlt (albatros erzeugt daraus AKTUALISIEREN)');
else for (const u of unterschiede(inReadme, imLotse)) fehler.push(`README.md, Abschnitt «Aktualisieren», anders als ${LOTSE}: ${u}`);

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

// Abschnittsnamen (scripts/abschnitte.ts): Was lage aus fahrplan.yaml nennt und worauf deutsche Skills verweisen, steht im Ziel-Skill
// jeder Sprache in einer Überschrift, übersetzt mit dem deutschen Namen in Klammern
if (fahrplan) fehler.push(...(await pruefeAbschnittsnamen(wurzel, fahrplan)));

// GUTE-ANTWORT.md ist aus fahrplan.yaml, den Köpfen der Eval-Fälle und KRITERIEN-LOG.md erzeugt und darf nicht davon abweichen
if (fahrplan) {
  const gut = await guteAntwort(wurzel, fahrplan);
  if (!gut.ok) fehler.push(...gut.fehler);
  else if ((await Bun.file(wurzel + ZIEL).text().catch(() => '')) !== gut.text) fehler.push(`${ZIEL}: nicht wie erzeugt, bun scripts/gute-antwort.ts ausführen`);
}

// Missionen gegen den Fahrplan: Das Schema nennt Phasen und Insel-Schritte selbst (für Leser ohne fahrplan.yaml), dieselben wie dort
const inselPhase = new Map(fahrplan?.phasen.flatMap((p) => p.insel.map((s) => [s, p.id] as const)));
const nummer = (phase: string) => Number(phase.slice(1));
if (fahrplan && schema.properties.phase.enum.join() !== fahrplan.phasen.map((p) => p.id).join())
  fehler.push('schema/mission.schema.json: phase muss genau die Phasen aus fahrplan.yaml nennen');
if (fahrplan && schema.$defs.insel.properties.schritt.enum.join() !== fahrplan.insel.join())
  fehler.push('schema/mission.schema.json: insel.schritt muss genau die Liste insel aus fahrplan.yaml sein');

const wege = new Set<string>();
const deutsch = new Map<string, Mission>();
for await (const datei of new Glob('missionen/*/*.md').scan(wurzel)) {
  const [, weg, name] = datei.split('/');
  const k = await kopfdaten(datei);
  if (!k) continue;
  wege.add(weg);
  const gueltig = pruefeMission(k);
  if (!gueltig)
    for (const e of pruefeMission.errors!) fehler.push(`${datei}: ${e.instancePath || '/'} ${e.message}`);
  if (k.id !== `${weg}-${name.replace(/\.md$/, '')}`) fehler.push(`${datei}: id muss «${weg}-${name.replace(/\.md$/, '')}» sein`);
  if (k.weg !== weg) fehler.push(`${datei}: weg muss «${weg}» sein`);
  if (k.abo !== 'pilot' && k.pruefung?.some((p: any) => p.typ === 'docker' || p.typ === 'workflow'))
    fehler.push(`${datei}: Prüfung mit docker oder workflow braucht abo: pilot`);
  if (weg === 'geschaeft' ? methodeFehlt(k.skill) : !skills.has(k.skill)) fehler.push(`${datei}: Skill «${k.skill}» gibt es nicht`);
  if (!gueltig) continue;
  deutsch.set(datei, k);
  if (!fahrplan) continue;
  // Der Insel-Schritt gehört zur Phase der Mission; bis gratis_bis arbeitet die Person nur auf ihrem Computer, ohne Server und Hafen
  for (const p of k.pruefung)
    if (p.typ === 'insel' && inselPhase.get(p.schritt ?? '') !== k.phase)
      fehler.push(`${datei}: Insel-Schritt «${p.schritt}» gehört zu ${inselPhase.get(p.schritt ?? '')}, nicht zur Phase ${k.phase}`);
  if (nummer(k.phase) <= nummer(fahrplan.gratis_bis) && k.pruefung.some((p) => p.typ !== 'insel'))
    fehler.push(`${datei}: Phase ${k.phase} liegt bis gratis_bis (${fahrplan.gratis_bis}), dort prüft eine Mission nur mit typ: insel`);
}
for (const weg of ['flugschule', 'webseite', 'geschaeft'])
  if (!wege.has(weg)) fehler.push(`missionen/${weg}: keine Missionen`);
// Lektion je Phase und Weg (scripts/lektionen.ts): Wo der Fahrplan Lernmomente hat, zeigt lage im Modus lernen eine Kontrollfrage
if (fahrplan) for (const f of lektionenFehlen(fahrplan.phasen, [...deutsch.values()])) fehler.push(`missionen: ${f}`);
// Verweise der Skills auf Missionen (scripts/missionsverweise.ts), in jeder Sprache: verstanden_melden und Kontrollfragen nur mit einer
// Lektion, mission_pruefen zuerst mit der Pflicht-Mission, jede Lektion in ihrem Skill genannt, Kontrollfragen nie aus mission_holen und,
// wo sie wörtlich im Skill stehen, gleich wie in der Mission derselben Sprache (seit 01.11.2026), mehr als fragen_je_nachricht davon in einem
// Absatz nur mit dem Satz, dass höchstens so viele in eine Nachricht kommen (Welle 7)
const skillTexte: SkillText[] = [];
for await (const datei of new Glob('plugins/*/skills/*/SKILL.md').scan(wurzel))
  skillTexte.push({ datei, slug: datei.split('/').at(-2)!, text: await Bun.file(wurzel + datei).text() });
fehler.push(...missionsverweise(skillTexte, [...deutsch.values()], await ladeFragen(wurzel), fahrplan?.fragen_je_nachricht));
// titel bei schritt_melden: nach «Ungültige Angaben» wegen titel nochmals ohne titel, sonst fehlt der Schritt auf der Insel (scripts/abgleich.ts)
for (const { datei, text } of skillTexte) {
  const f = titelAusweg(datei, text);
  if (f) fehler.push(f);
}

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
// Kopf einer übersetzten Mission: titel, bild und verstehen übersetzt, phase und optional gleich wie Deutsch; alles andere kommt aus der
// deutschen Mission. titel und bild in den Längen, die flugschule (uebersetzungen.ts) annimmt.
const IM_KOPF = new Set(['titel', 'bild', 'phase', 'optional', 'verstehen']);
const laenge = (x: unknown, min: number, max: number) => typeof x === 'string' && x.trim().length >= min && x.length <= max;
for (const [datei, de] of deutsch)
  for (const s of ['fr', 'it', 'en']) {
    const pfad = `uebersetzungen/${s}/${datei}`;
    if (!(await uebersetzt(pfad))) continue;
    const k = await kopfdaten(pfad);
    if (!k) continue;
    for (const feld of Object.keys(k)) if (!IM_KOPF.has(feld)) fehler.push(`${pfad}: ${feld} gehört nicht in den Kopf (kommt aus ${datei})`);
    if (!laenge(k.titel, 3, 80) || !laenge(k.bild, 3, 200)) fehler.push(`${pfad}: titel (3 bis 80 Zeichen) und bild (3 bis 200) nötig`);
    if (k.phase !== de.phase) fehler.push(`${pfad}: phase muss ${de.phase} sein wie in ${datei}`);
    if ((k.optional ?? false) !== (de.optional ?? false)) fehler.push(`${pfad}: optional muss gleich sein wie in ${datei}`);
    const v: unknown[] = Array.isArray(k.verstehen) ? k.verstehen : [];
    const ok = (x: unknown) => typeof x === 'object' && x !== null && 'frage' in x && 'kern' in x && laenge(x.frage, 10, 300) && laenge(x.kern, 10, 400);
    if (v.length !== (de.verstehen?.length ?? 0) || !v.every(ok)) fehler.push(`${pfad}: verstehen braucht ${de.verstehen?.length ?? 0} übersetzte Einträge mit frage und kern wie ${datei}`);
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
console.log(`${skills.size} Skills und ${deutsch.size} Missionen in vier Sprachen und der Fahrplan (${fahrplan?.phasen.length} Phasen) in Ordnung.`);
