// Fahrplan (fahrplan.yaml) laden, für pruefen.ts, gute-antwort.ts, punkte.ts und die Attrappe des Durchspiels. Erst das Schema
// (schema/fahrplan.schema.json) prüft die Form, dann gilt der Typ. Was ein Schema nicht prüfen kann, prüft pruefen.ts; die Felder
// insel_je_wohnort und marken (31.10.2026) prüft schon ladeFahrplan (vertragsFehler), damit jeder Leser dieselbe Regel sieht.
import Ajv from 'ajv/dist/2020';
import schema from '../schema/fahrplan.schema.json';

export type Sprache = 'de' | 'fr' | 'it' | 'en';
export type Pflichtfrage = {
  id: string;
  bereich: string;
  antwortet: 'person' | 'annahme_ok' | 'ki';
  ablage: string;
  werte?: string[]; // der Wert beginnt mit einem dieser Wörter (deutsch in allen Sprachen)
  frage: Record<Sprache, string>;
  warum: Record<Sprache, string>;
};
export type JeWeg = { geschaeft?: string[] };
export type Wohnort = 'light' | 'pilot' | 'selbst';
export const WOHNORTE: readonly Wohnort[] = ['light', 'pilot', 'selbst'];
export type Phase = {
  id: string;
  titel: string;
  etappe: 'abheben' | 'fliegen' | 'landen';
  bild: string;
  skill: string;
  abschnitt?: string;
  methoden?: { geschaeft: string[]; wann: 'vor_skill' | 'nach_skill' };
  varianten?: { modernisieren?: { skill?: string; abschnitt?: string; zusatz?: string } };
  ergebnis: { datei: string; zeilen?: string[] }[];
  insel: string[];
  insel_je_wohnort?: Record<Wohnort, string[]>;
  lernmomente?: string[];
  ausgaenge?: { geschaeft: string[]; geschafft: string[]; ablage: string }; // geschafft: die Ausgänge, mit denen die Phase geschafft ist
  pflichtfragen: Pflichtfrage[];
  pruefliste?: string[];
  zweite_meinung?: Record<string, string>;
  gate: string;
};
export type Fahrplan = {
  version: number;
  stand: string;
  gratis_bis: string;
  fragen_je_phase: number;
  fragen_je_nachricht: number;
  ja_momente: { phase: string; frage: string }[];
  marken: { offen: string[]; platzhalter: string[]; annahme: string[] };
  wohnorte: { light: string; pilot: string };
  modus: { standard: 'machen' | 'lernen'; quelle: string; machen: string; lernen: string };
  phasen: Phase[];
  nach_live: { aendern: { skill: string; klein: string[]; gross: string[] }; landen: JeWeg };
  insel: string[];
};

// Die zehn Insel-Schritte vor Fassung 2 in ihrer Reihenfolge. Datenbank und Cockpit kennen sie so; Bedeutung und Reihenfolge bleiben.
export const ALTE_INSEL = ['mockup', 'entwuerfe', 'prd', 'lokal', 'pruefung', 'freigabe', 'hafen', 'fliessband', 'live', 'domain'];

const pruefe = new Ajv({ allErrors: true }).compile<Fahrplan>(schema);

export async function ladeFahrplan(wurzel: string): Promise<{ ok: true; fahrplan: Fahrplan } | { ok: false; fehler: string[] }> {
  let daten: unknown;
  try {
    daten = Bun.YAML.parse(await Bun.file(wurzel + 'fahrplan.yaml').text());
  } catch (e) {
    return { ok: false, fehler: [`fahrplan.yaml: kein gültiges YAML (${(e as Error).message})`] };
  }
  if (!pruefe(daten)) return { ok: false, fehler: (pruefe.errors ?? []).map((e) => `fahrplan.yaml: ${e.instancePath || '/'} ${e.message}`) };
  const fehler = vertragsFehler(daten);
  return fehler.length ? { ok: false, fehler } : { ok: true, fahrplan: daten };
}

// Was das Schema an den Feldern vom 31.10.2026 nicht prüfen kann: Insel je Wohnort ist je eine Teilfolge der Insel-Schritte der Phase
// (gleiche Reihenfolge), die Ausgänge, mit denen eine Phase geschafft ist, sind Ausgänge dieser Phase, und kein Wort steht in zwei Marken
export function vertragsFehler(f: Fahrplan): string[] {
  const fehler: string[] = [];
  for (const p of f.phasen) {
    for (const w of WOHNORTE) {
      const liste = p.insel_je_wohnort?.[w];
      if (liste && !teilfolge(liste, p.insel)) fehler.push(`fahrplan.yaml: ${p.id} insel_je_wohnort.${w} (${liste.join(', ')}) ist keine Teilfolge von insel (${p.insel.join(', ')})`);
    }
    const fremd = p.ausgaenge?.geschafft.filter((a) => !p.ausgaenge!.geschaeft.includes(a)) ?? [];
    if (fremd.length) fehler.push(`fahrplan.yaml: ${p.id} ausgaenge.geschafft nennt ${fremd.join(', ')}, das ist kein Ausgang der Phase (${p.ausgaenge!.geschaeft.join(', ')})`);
  }
  const gesehen = new Map<string, string>();
  for (const [marke, woerter] of Object.entries(f.marken)) {
    for (const wort of woerter) {
      const klein = wort.toLowerCase();
      if (gesehen.has(klein)) fehler.push(`fahrplan.yaml: marken: «${wort}» steht in ${gesehen.get(klein)} und in ${marke}`);
      gesehen.set(klein, marke);
    }
  }
  return fehler;
}
const teilfolge = (teil: string[], ganz: string[]) => {
  let i = 0;
  for (const s of ganz) if (s === teil[i]) i++;
  return i === teil.length;
};
