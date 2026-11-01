// Abgleiche für pruefen.ts: Texte, die an zwei Orten stehen, müssen gleich sein.
// - AGENTS.md: der Block in webseite-planen (Abschnitt Idee, Schritt 5) ist derselbe Text wie vorlage/AGENTS.md der Sprache; dazu
//   nennen CLAUDE.md und GEMINI.md der Vorlage eine Zeile, die im Skill steht, und verweisen auf AGENTS.md.
// - Aktualisieren: die Tabelle «| KI | Befehle |» im Abschnitt «Aktualisieren» der README hat dieselben Zeilen wie die Tabelle im
//   Lotse (de). albatros liest die README genau so (aktualisierenAus in packages/kit/src/fahrplan-vertrag.ts) und erzeugt daraus
//   AKTUALISIEREN, das lage bei veralteten Skills nennt.
// - titel bei schritt_melden: wie mcp ihn annimmt (titelAusweg, unten).
// - Begriffe wie im GLOSSAR.md: auf Italienisch die Freigabe zum Bauen (P8) nie «approvata» (bozzaApprovata, unten).

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

// Ein abgelehnter titel kostet nie den Schritt (Welle 7, 01.11.2026, w7-21). mcp nimmt titel bis 300 Zeichen und kürzt ihn auf der Insel
// auf 80; mit Zeilenumbruch (oder einem anderen Steuerzeichen) oder über 300 Zeichen antwortet schritt_melden «Ungültige Angaben» und
// schickt den Schritt gar nicht an flugschule (Nachbau mit dem echten mcp: …/scratchpad/welle7/skills/w7-21/titel-echt.log). Wer titel bei
// schritt_melden nennt, sagt darum in seiner Sprache, dass der Schritt dann gleich nochmals ohne titel kommt; null: in Ordnung.
const OHNE_TITEL: Record<string, string> = { de: 'ohne `titel`', fr: 'sans `titel`', it: 'senza `titel`', en: 'without `titel`' };
export function titelAusweg(datei: string, text: string): string | null {
  if (!text.includes('`titel`') || !text.includes('`schritt_melden`')) return null;
  const sprache = /plugins\/albatros-(fr|it|en)\//.exec(datei)?.[1] ?? 'de';
  const ohne = OHNE_TITEL[sprache]!;
  return text.includes(ohne) ? null
    : `${datei}: nennt \`titel\` bei \`schritt_melden\`, aber nicht, dass der Schritt nach «Ungültige Angaben» wegen \`titel\` gleich nochmals ${ohne} kommt; sonst fehlt er auf der Insel`;
}

// GLOSSAR.md unterscheidet die Freigabe zum Bauen (P8: «via libera per costruire») von der Freigabe in P10 («approvazione»); das Web sagt
// seit w6-24 «Bozza con via libera». webseite-bauen (it) nannte P8 trotzdem «bozza approvata», auch im Eintrag ins Logbuch der Person
// (Sichtung Welle 7, sicht-08, 01.11.2026). Gemeldet wird jeder Satz eines italienischen Skills, der die Bozza und «approvat…» verbindet,
// ausser «via libera» oder «sito» steht dazwischen («bozza con via libera per costruire, sito approvato»: dort ist der Sito approvato).
const LUECKE = String.raw`(?:(?!via libera|\bsito\b)[^.!?\n]){0,60}?`;
const BOZZA_APPROVATA = new RegExp(String.raw`\bbozz[ae]\b${LUECKE}\bapprovat\p{L}*|\bapprovat\p{L}*${LUECKE}\bbozz[ae]\b`, 'giu');
export function bozzaApprovata(datei: string, text: string): string[] {
  if (!/plugins\/albatros-it\//.test(datei)) return [];
  return [...text.matchAll(BOZZA_APPROVATA)].map((t) => `${datei}:${text.slice(0, t.index).split('\n').length}: «${t[0]}»: `
    + 'die Freigabe zum Bauen heisst auf Italienisch «via libera per costruire» (bozza con via libera), «approvazione» ist die Freigabe in P10 (GLOSSAR.md)');
}
