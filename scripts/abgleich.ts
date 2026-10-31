// Abgleiche für pruefen.ts: Texte, die an zwei Orten stehen, müssen gleich sein.
// - AGENTS.md: der Block in webseite-planen (Abschnitt Idee, Schritt 5) ist derselbe Text wie vorlage/AGENTS.md der Sprache; dazu
//   nennen CLAUDE.md und GEMINI.md der Vorlage eine Zeile, die im Skill steht, und verweisen auf AGENTS.md.
// - Aktualisieren: die Tabelle «| KI | Befehle |» im Abschnitt «Aktualisieren» der README hat dieselben Zeilen wie die Tabelle im
//   Lotse (de). albatros liest die README genau so (aktualisierenAus in packages/kit/src/fahrplan-vertrag.ts) und erzeugt daraus
//   AKTUALISIEREN, das lage bei veralteten Skills nennt.

export type Befehle = { ki: string; befehle: string }[];

const ZEILE = /^\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|\s*$/;
const trenner = (z: string) => /^\|[\s|:-]+\|\s*$/.test(z);

// Wie aktualisierenAus in albatros: Tabellenzeilen unter der ersten Überschrift mit «Aktualisieren» bis zur nächsten Überschrift,
// ohne Trennzeile und Kopf «KI»; null, wenn es den Abschnitt oder Zeilen darin nicht gibt.
export function befehleAusReadme(readme: string): Befehle | null {
  const zeilen = readme.split('\n');
  const start = zeilen.findIndex((z) => /^#{2,4}\s.*Aktualisieren/i.test(z));
  if (start < 0) return null;
  const aus: Befehle = [];
  for (const z of zeilen.slice(start + 1)) {
    if (/^#{1,4}\s/.test(z)) break;
    const m = ZEILE.exec(z);
    if (m && !/^[-: ]+$/.test(m[1]!) && m[1] !== 'KI') aus.push({ ki: m[1]!, befehle: m[2]! });
  }
  return aus.length ? aus : null;
}

// Die Tabelle mit dem Kopf «| KI | Befehle |» in einem Skill (genau eine), Zeile für Zeile bis zum Ende der Tabelle.
export function befehleAusSkill(text: string): Befehle | string {
  const zeilen = text.split('\n');
  const koepfe = zeilen.flatMap((z, i) => (/^\|\s*KI\s*\|\s*Befehle\s*\|\s*$/.test(z) ? [i] : []));
  if (koepfe.length !== 1) return `${koepfe.length} Tabellen «| KI | Befehle |», erwartet genau eine`;
  const aus: Befehle = [];
  for (const z of zeilen.slice(koepfe[0]! + 1)) {
    if (!z.startsWith('|')) break;
    if (trenner(z)) continue;
    const m = ZEILE.exec(z);
    if (m) aus.push({ ki: m[1]!, befehle: m[2]! });
  }
  return aus.length ? aus : 'Tabelle «| KI | Befehle |» ohne Zeilen';
}

// Unterschiede zweier Tabellen in Worten; leer, wenn gleich (gleiche KIs in gleicher Reihenfolge, Befehle Zeichen für Zeichen)
export function unterschiede(readme: Befehle, lotse: Befehle): string[] {
  const aus: string[] = [];
  const kis = (b: Befehle) => b.map((x) => x.ki).join(', ');
  if (kis(readme) !== kis(lotse)) aus.push(`KIs ${kis(readme)}, im Lotse ${kis(lotse)}`);
  for (const r of readme) {
    const l = lotse.find((x) => x.ki === r.ki);
    if (l && l.befehle !== r.befehle) aus.push(`${r.ki}: «${r.befehle}», im Lotse «${l.befehle}»`);
  }
  return aus;
}

// Der Block nach «**`AGENTS.md`**» in webseite-planen: der erste ```markdown-Block danach, ohne die Einrückung des Zauns
export function agentsBlock(skill: string): string | null {
  const zeilen = skill.split('\n');
  const marke = zeilen.findIndex((z) => z.includes('**`AGENTS.md`**'));
  if (marke < 0) return null;
  const auf = zeilen.findIndex((z, i) => i > marke && /^\s*```markdown\s*$/.test(z));
  if (auf < 0) return null;
  const einzug = zeilen[auf]!.match(/^\s*/)![0];
  const zu = zeilen.findIndex((z, i) => i > auf && z === `${einzug}\`\`\``);
  if (zu < 0) return null;
  return zeilen.slice(auf + 1, zu).map((z) => (z.startsWith(einzug) ? z.slice(einzug.length) : z.trimStart())).join('\n') + '\n';
}

// Fehler je Datei der Vorlage einer Sprache; leer, wenn alles passt. vorlage: Inhalte von AGENTS.md, CLAUDE.md, GEMINI.md (null = fehlt)
export function vorlageGegenSkill(skill: string, vorlage: Record<'AGENTS.md' | 'CLAUDE.md' | 'GEMINI.md', string | null>): string[] {
  const aus: string[] = [];
  const block = agentsBlock(skill);
  if (block === null) aus.push('Block «**`AGENTS.md`**» mit ```markdown fehlt in webseite-planen');
  else if (vorlage['AGENTS.md'] === null) aus.push('AGENTS.md fehlt');
  else if (vorlage['AGENTS.md'] !== block) {
    const a = block.split('\n');
    const b = vorlage['AGENTS.md'].split('\n');
    const n = a.findIndex((z, i) => z !== b[i]);
    aus.push(`AGENTS.md anders als der Block in webseite-planen, erste Abweichung in Zeile ${(n < 0 ? a.length : n) + 1}`);
  }
  for (const [datei, verweis] of [['CLAUDE.md', '@AGENTS.md'], ['GEMINI.md', '@./AGENTS.md']] as const) {
    const t = vorlage[datei];
    if (t === null) { aus.push(`${datei} fehlt`); continue; }
    const [erste, ...rest] = t.trimEnd().split('\n');
    if (!erste || !skill.includes(erste)) aus.push(`${datei}: die erste Zeile «${erste ?? ''}» steht nicht in webseite-planen`);
    if (rest.at(-1) !== verweis) aus.push(`${datei}: letzte Zeile muss ${verweis} sein`);
  }
  return aus;
}
