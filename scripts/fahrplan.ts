// Fahrplan (fahrplan.yaml) laden, für pruefen.ts und gute-antwort.ts. Erst das Schema (schema/fahrplan.schema.json) prüft die Form,
// dann gilt der Typ. Was ein Schema nicht prüfen kann, prüft pruefen.ts.
import Ajv from 'ajv/dist/2020';
import schema from '../schema/fahrplan.schema.json';

export type Sprache = 'de' | 'fr' | 'it' | 'en';
export type Pflichtfrage = {
  id: string;
  bereich: string;
  antwortet: 'person' | 'annahme_ok' | 'ki';
  ablage: string;
  frage: Record<Sprache, string>;
  warum: Record<Sprache, string>;
};
export type JeWeg = { geschaeft?: string[] };
export type Phase = {
  id: string;
  titel: string;
  etappe: 'abheben' | 'fliegen' | 'landen';
  bild: string;
  skill: string;
  abschnitt?: string;
  methoden?: JeWeg;
  varianten?: { modernisieren?: { skill?: string; abschnitt?: string; zusatz?: string } };
  ergebnis: { datei: string; zeilen?: string[] }[];
  insel: string[];
  lernmomente?: string[];
  ausgaenge?: JeWeg;
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
  return { ok: true, fahrplan: daten };
}
