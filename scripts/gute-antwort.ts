// Erzeugt plugins/albatros/evals/GUTE-ANTWORT.md aus fahrplan.yaml: was eine gute Antwort in jeder Phase enthält, als Grundlage der
// Evals. Eval-Fälle nennen ihre Phase als Tag im Kopf ihrer prompt.md (tags: [P3] oder tags: [P3, P4]); die Änderungen kommen aus
// KRITERIEN-LOG.md. Aufruf: bun scripts/gute-antwort.ts (schreibt die Datei). pruefen.ts verlangt, dass sie dem Erzeugten entspricht.
import { Glob } from 'bun';
import { type Fahrplan, ladeFahrplan, type Phase } from './fahrplan.ts';

export const ZIEL = 'plugins/albatros/evals/GUTE-ANTWORT.md';
export const LOG = 'plugins/albatros/evals/KRITERIEN-LOG.md';
const WER = { person: 'Person', annahme_ok: 'Annahme', ki: 'KI' } as const;
const zelle = (s: string) => s.replaceAll('|', '\\|').replaceAll('\n', ' ');
const code = (s: string) => `\`${s}\``;

// Eval-Fälle je Phase, aus den Tags im Kopf von plugins/albatros/evals/<fall>/prompt.md. Ein Tag wie P3 ist eine Phase; so filtert auch
// claude plugin eval --tag P3. Einen Kopf «phase:» lädt plugin eval nicht (unknown frontmatter key, gemessen mit 2.1.309 am 31.10.2026).
async function evalFaelle(wurzel: string, ids: string[]) {
  const je = new Map<string, string[]>(ids.map((p) => [p, []]));
  const fehler: string[] = [];
  for await (const datei of new Glob('plugins/albatros/evals/*/prompt.md').scan(wurzel)) {
    const m = /^---\n([\s\S]*?)\n---\n/.exec(await Bun.file(wurzel + datei).text());
    let kopf: unknown = null;
    try {
      kopf = m ? Bun.YAML.parse(m[1]!) : null;
    } catch (e) {
      fehler.push(`${datei}: Kopf ist kein gültiges YAML (${(e as Error).message})`);
    }
    if (typeof kopf !== 'object' || kopf === null) continue;
    if ('phase' in kopf) fehler.push(`${datei}: «phase:» im Kopf lädt plugin eval nicht; die Phase gehört als Tag in tags, z. B. tags: [P3]`);
    const tags = 'tags' in kopf && Array.isArray(kopf.tags) ? kopf.tags : [];
    for (const p of tags.filter((t): t is string => typeof t === 'string' && /^P\d+$/.test(t))) {
      const liste = je.get(p);
      if (liste) liste.push(datei.split('/').at(-2)!);
      else fehler.push(`${datei}: Tag ${p} ist keine Phase aus fahrplan.yaml`);
    }
  }
  for (const liste of je.values()) liste.sort();
  return { je, fehler };
}

// Einträge aus KRITERIEN-LOG.md: Tabellenzeilen | Datum | Fall | Änderung | Grund |, ältester zuerst
async function kriterienLog(wurzel: string) {
  const text = await Bun.file(wurzel + LOG).text().catch(() => null);
  if (text === null) return { eintraege: [], fehler: [`${LOG} fehlt`] };
  const eintraege: string[][] = [];
  const fehler: string[] = [];
  for (const z of text.split('\n').filter((x) => /^\|\s*\d/.test(x))) {
    const zellen = z.split(/(?<!\\)\|/).slice(1, -1).map((s) => s.trim());
    if (zellen.length !== 4 || !/^\d{4}-\d{2}-\d{2}$/.test(zellen[0]!) || zellen.some((s) => !s)) fehler.push(`${LOG}: Zeile braucht Datum (JJJJ-MM-TT), Fall, Änderung und Grund: ${z}`);
    else if (eintraege.length && zellen[0]! < eintraege.at(-1)![0]!) fehler.push(`${LOG}: neue Einträge kommen unten dazu (${zellen[0]} nach ${eintraege.at(-1)![0]})`);
    else eintraege.push(zellen);
  }
  if (!eintraege.length && !fehler.length) fehler.push(`${LOG}: kein Eintrag`);
  return { eintraege, fehler };
}

function phase(p: Phase, f: Fahrplan, faelle: string[]): string {
  const zeilen = [`## ${p.id} ${p.titel}`, ''];
  const kopf = [`Etappe ${p.etappe}`, `Skill ${code(p.skill)}${p.abschnitt ? `, Abschnitt «${p.abschnitt}»` : ''}`, `Insel ${p.insel.map(code).join(', ')}`, `Bild: ${p.bild}`];
  zeilen.push(kopf.join(' · '), '');
  if (p.methoden?.geschaeft)
    zeilen.push(`- Weg Geschäft: ${p.methoden.geschaeft.map(code).join(', ')}${p.ausgaenge?.geschaeft ? ` (Ausgänge: ${p.ausgaenge.geschaeft.join(', ')})` : ''}`);
  const v = p.varianten?.modernisieren;
  if (v) zeilen.push(`- Modernisieren: ${[v.skill && `Skill ${code(v.skill)}`, v.abschnitt && `Abschnitt «${v.abschnitt}»`, v.zusatz].filter(Boolean).join(', ')}`);
  if (p.methoden?.geschaeft || v) zeilen.push('');
  zeilen.push('**Pflichtfragen**', '', '| Kennung | Frage | Wer antwortet | Ablage |', '|---|---|---|---|');
  for (const q of p.pflichtfragen) zeilen.push(`| ${code(q.id)} | ${zelle(q.frage.de)} | ${WER[q.antwortet]} | ${code(q.ablage)} |`);
  zeilen.push('', '**Ergebnis**', '');
  for (const e of p.ergebnis)
    zeilen.push(`- ${code(e.datei)}${e.zeilen ? ` mit ${e.zeilen.length === 1 ? 'der Zeile' : 'den Zeilen'} ${e.zeilen.map(code).join(', ')}` : ''}`);
  if (p.pruefliste) {
    zeilen.push('', '**Prüfliste** (jeder Punkt ok, Risiko oder offen, mit Stelle im Plan)', '');
    p.pruefliste.forEach((x, i) => zeilen.push(`${i + 1}. ${x}`));
  }
  if (p.zweite_meinung) {
    zeilen.push('', '**Zweite Meinung in frischem Kontext**', '');
    for (const [ki, wie] of Object.entries(p.zweite_meinung)) zeilen.push(`- ${ki}: ${wie}`);
  }
  const ja = f.ja_momente.find((j) => j.phase === p.id);
  const frage = ja && p.pflichtfragen.find((q) => q.id === ja.frage);
  zeilen.push(
    '',
    frage
      ? `**Ja-Moment:** «${frage.frage.de}» (${code(frage.id)}). Erst nach dem Ja der Person, mit Datum und ihrem Wortlaut in ${code(frage.ablage)}.`
      : '**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.',
    '',
    `**Gate:** ${p.gate}`,
  );
  if (p.lernmomente) zeilen.push('', `**Lernmomente:** ${p.lernmomente.join(' · ')}`);
  zeilen.push('', `**Eval-Fälle:** ${faelle.length ? faelle.map(code).join(', ') : 'noch kein Fall'}`, '');
  return zeilen.join('\n');
}

export async function guteAntwort(wurzel: string, f: Fahrplan): Promise<{ ok: true; text: string } | { ok: false; fehler: string[] }> {
  const faelle = await evalFaelle(wurzel, f.phasen.map((p) => p.id));
  const log = await kriterienLog(wurzel);
  if (faelle.fehler.length || log.fehler.length) return { ok: false, fehler: [...faelle.fehler, ...log.fehler] };
  const n = f.nach_live;
  const text = [
    '# Gute Antwort: was die KI in jeder Phase tut',
    '',
    `Erzeugt aus ${code('fahrplan.yaml')} (Fassung ${f.version}, Stand ${f.stand}) mit ${code('bun scripts/gute-antwort.ts')}. Nicht von Hand ändern: ${code('bun scripts/pruefen.ts')} verlangt, dass diese Datei dem Erzeugten entspricht. Kriterien ändern sich nur mit Datum und Grund in ${code('KRITERIEN-LOG.md')}. Ein Eval-Fall zählt für eine Phase, wenn seine ${code('prompt.md')} sie als Tag nennt (${code('tags: [P3]')} oder ${code('tags: [P3, P4]')}); so filtert auch ${code('claude plugin eval --tag P3')}.`,
    '',
    '## Für alle Phasen',
    '',
    `- Höchstens ${f.fragen_je_nachricht} Fragen in einer Nachricht.`,
    `- Höchstens ${f.fragen_je_phase} Fragen an die Person je Phase. Den Rest schlägt die KI als [Annahme] vor, und die Person bestätigt alle Annahmen einer Phase in einer einzigen Nachricht.`,
    '- Ein Fachwort kommt erst, nachdem es erklärt ist, zuerst mit seinem Bild.',
    `- Preise nur aus ${code('konto_status')}, nie aus dem Gedächtnis.`,
    '- Wer antwortet: Person heisst, die Person antwortet immer selbst, auch im Modus machen. Annahme heisst, die KI schlägt einen Standard als [Annahme] vor. KI heisst, die KI klärt es selbst (Recherche, Messung) und zeigt das Ergebnis.',
    `- Ja-Momente gibt es nur ${f.ja_momente.length}: ${f.ja_momente.map((j) => `${j.phase} (${code(j.frage)})`).join(', ')}. «Sieht gut aus» ist kein Ja.`,
    `- Gratis bis ${f.gratis_bis}.`,
    `- Modus (Standard: ${f.modus.standard}; gilt je Projekt, steht in ${code(f.modus.quelle)}):`,
    `  - machen: ${f.modus.machen}`,
    `  - lernen: ${f.modus.lernen}`,
    '',
    ...f.phasen.map((p) => phase(p, f, faelle.je.get(p.id) ?? [])),
    '## Nach dem Livegang',
    '',
    `Kein eigener Platz auf der Insel. Ändern mit ${code(n.aendern.skill)}:`,
    '',
    `- klein: ${n.aendern.klein.join(', ')}`,
    `- gross: ${n.aendern.gross.join(', ')}`,
    ...(n.landen.geschaeft ? ['', `Weg Geschäft, Etappe Landen: ${n.landen.geschaeft.map(code).join(', ')}`] : []),
    '',
    '## Änderungen',
    '',
    `Aus ${code('KRITERIEN-LOG.md')}, ältester Eintrag zuerst.`,
    '',
    '| Datum | Fall | Änderung | Grund |',
    '|---|---|---|---|',
    ...log.eintraege.map((z) => `| ${z.join(' | ')} |`),
    '',
  ].join('\n');
  return { ok: true, text };
}

if (import.meta.main) {
  const wurzel = new URL('..', import.meta.url).pathname;
  const plan = await ladeFahrplan(wurzel);
  const r = plan.ok ? await guteAntwort(wurzel, plan.fahrplan) : plan;
  if (!r.ok) {
    console.error(r.fehler.join('\n'));
    process.exit(1);
  }
  await Bun.write(wurzel + ZIEL, r.text);
  console.log(`${ZIEL} geschrieben (${r.text.split('\n').length} Zeilen).`);
}
