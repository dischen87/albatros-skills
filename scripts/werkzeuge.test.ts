// bun test: Die Skills nennen nur Werkzeuge, Felder und Werte, die es in der Plattform gibt (scripts/werkzeuge.ts, 11.11.2026).
// Was es gibt, kommt aus albatros (ALBATROS, sonst ../albatros neben diesem Repo; fehlt beides, wird der Vergleich übersprungen):
// lokal aus apps/arbeitsplatz/src/vertrag.ts (WERKZEUG_EINGABEN, die echten Schemas), fern aus services/mcp/src (jedes name: '…').
// Achtung: Ohne ALBATROS prüft der Test gegen ../albatros, also gegen den Zweig, der dort gerade liegt.
import { expect, test } from 'bun:test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Glob } from 'bun';
import {
  AUSLOESER, AUSLOESER_BIS, AUSLOESER_SKILLS, ausloeserVorne, beschreibung, feldFehler, tabelleLokal, unbekannteNamen, type Bekannt, type Eingabe,
} from './werkzeuge.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const albatros = resolve(process.env.ALBATROS ?? `${wurzel}../albatros`);
const VERTRAG = `${albatros}/apps/arbeitsplatz/src/vertrag.ts`;
const PLUGINS = { de: 'albatros', fr: 'albatros-fr', it: 'albatros-it', en: 'albatros-en' } as const;
type Sprache = keyof typeof PLUGINS;

type Pruefung = { success: boolean; error?: { issues: { path: PropertyKey[] }[] } };
type Schema = { shape: Record<string, unknown>; safeParse: (x: unknown) => Pruefung };
const istSchema = (x: unknown): x is Schema => typeof x === 'object' && x !== null && 'shape' in x && 'safeParse' in x;

/** Lokale Werkzeuge aus dem Vertrag, ferne aus dem Code von mcp, dazu Feldnamen und feste Werte beider Server. */
async function ausPlattform(): Promise<Bekannt> {
  const vertrag = (await import(VERTRAG)) as Record<string, unknown>;
  const eingaben = vertrag.WERKZEUG_EINGABEN as Record<string, unknown>;
  const lokal = new Map<string, Eingabe>();
  const woerter = new Set<string>();
  for (const [name, schema] of Object.entries(eingaben)) {
    if (!istSchema(schema)) throw new Error(`WERKZEUG_EINGABEN.${name} ist kein Objekt-Schema`);
    const felder = Object.keys(schema.shape);
    // Ein Feld allein geprüft: Fehlende Pflichtfelder zählen nicht, nur was das Schema an genau diesem Feld bemängelt
    const nimmt = (feld: string, wert: string) => !(schema.safeParse({ [feld]: wert }).error?.issues ?? []).some((i) => i.path[0] === feld);
    lokal.set(name, { felder, nimmt });
    for (const f of felder) woerter.add(f);
  }
  // Feste Werte des Vertrags (BauStand: in_arbeit, EntwurfArt: seiten_aenderung …)
  for (const wert of Object.values(vertrag)) {
    const optionen = (wert as { options?: unknown } | null)?.options;
    if (Array.isArray(optionen)) for (const o of optionen) if (typeof o === 'string') woerter.add(o);
  }
  const fern = new Set<string>();
  for await (const datei of new Glob('*.ts').scan(`${albatros}/services/mcp/src`)) {
    if (datei.endsWith('.test.ts')) continue;
    const text = await Bun.file(`${albatros}/services/mcp/src/${datei}`).text();
    for (const m of text.matchAll(/\bname: '([a-z][a-z0-9_]*)'/g)) fern.add(m[1]!);
  }
  // Felder der fernen Werkzeuge aus der echten Werkzeugliste der Evals (scripts/attrappen.ts erzeugt sie aus mcp)
  const liste = (await Bun.file(`${wurzel}plugins/albatros/evals/mocks/albatros/_tools.json`).json()) as { name: string; inputSchema?: { properties?: Record<string, unknown> } }[] | { tools: { name: string; inputSchema?: { properties?: Record<string, unknown> } }[] };
  for (const t of Array.isArray(liste) ? liste : liste.tools) for (const f of Object.keys(t.inputSchema?.properties ?? {})) woerter.add(f);
  return { lokal, fern, woerter };
}

async function skills(sprache: Sprache): Promise<{ datei: string; slug: string; text: string }[]> {
  const aus: { datei: string; slug: string; text: string }[] = [];
  for await (const datei of new Glob(`plugins/${PLUGINS[sprache]}/skills/*/SKILL.md`).scan(wurzel)) aus.push({ datei, slug: datei.split('/').at(-2)!, text: await Bun.file(wurzel + datei).text() });
  return aus.sort((a, b) => a.datei.localeCompare(b.datei));
}

// ---- Die Regeln selbst, ohne Plattform: je ein gutes Beispiel und eingebaute Fehler ----
const eingabe = (felder: Record<string, string[] | null>): Eingabe => ({
  felder: Object.keys(felder), nimmt: (f, w) => felder[f] === null || (felder[f]?.includes(w) ?? false),
});
const BEISPIEL: Bekannt = {
  lokal: new Map([
    ['naechstes', eingabe({})],
    ['teil_bereit', eingabe({ teil: ['idee', 'umfang', 'design', 'mockup'], notiz: null })],
    ['bau_teil', eingabe({ titel: null, stand: ['offen', 'in_arbeit', 'gebaut', 'geprueft'], art: ['seite', 'funktion'] })],
    ['ja_moment', eingabe({ art: ['plan', 'entwurf', 'seite'] })],
    ['arbeitsplatz_oeffnen', eingabe({})],
  ]),
  fern: new Set(['lage', 'schritt_melden']),
  woerter: new Set(['in_arbeit', 'skills_stand']),
};

test('Regeln: unbekannte Namen, Felder und Werte fallen auf, Richtiges und Codeblöcke nicht', () => {
  const gut = 'Melde den Teil mit `teil_bereit` (`teil: umfang`) und ruf `naechstes` auf. Dann `schritt_melden` und `lage` mit `skills_stand`.\n'
    + 'Beim Bauen `bau_teil` mit `titel` und `stand: in_arbeit`, bei einem neuen Teil `art: funktion`. Das Ja fragst du mit `ja_moment` an (`plan`, `entwurf` oder `seite`).\n'
    + 'In `docs/projekt.md` steht `Stand: 11.11.2026`.\n```bash\nnode x.mjs --teil_fertig\n```\n';
  expect(unbekannteNamen(gut, BEISPIEL)).toEqual([]);
  expect(feldFehler(gut, BEISPIEL)).toEqual([]);
  expect(unbekannteNamen('Melde ihn mit `teil_fertig` und `bauteil_melden`, dann `naechstes`.', BEISPIEL)).toEqual(['bauteil_melden', 'teil_fertig']);
  expect(feldFehler('Melde ihn mit `teil_bereit` (`teil: alles`).', BEISPIEL)).toEqual(['`teil: alles`: `teil_bereit` nimmt den Wert «alles» nicht an']);
  expect(feldFehler('Melde ihn mit `teil_bereit` (`bereich: umfang`).', BEISPIEL)).toEqual(['`bereich: umfang`: `teil_bereit` kennt das Feld bereich nicht']);
  expect(feldFehler('Dann `bau_teil` mit `stand: fertig`.', BEISPIEL)).toEqual(['`stand: fertig`: `bau_teil` nimmt den Wert «fertig» nicht an']);
  expect(feldFehler('Das Ja fragst du mit `ja_moment` (`freigabe`) an.', BEISPIEL)).toEqual(['`ja_moment` (`freigabe`): diesen Ja-Moment gibt es nicht']);
  // Ein Feld ohne lokales Werkzeug im Satz (Werkzeuge von Albatros, Zeilen der Dokumente) wird nicht beurteilt
  expect(feldFehler('Ruf `schritt_melden` mit `schritt: lokal` auf.', BEISPIEL)).toEqual([]);
  expect(tabelleLokal('| Werkzeug | Wofür |\n|---|---|\n| `arbeitsplatz_oeffnen` | öffnet |\n| `naechstes` | holt |\n\nText mit `bau_teil`.')).toEqual(['arbeitsplatz_oeffnen', 'naechstes']);
});

// ---- Gegen die Plattform ----
const mitPlattform = existsSync(VERTRAG);
if (!mitPlattform) console.log(`werkzeuge.test.ts: ${VERTRAG} nicht gefunden, Vergleich mit der Plattform übersprungen (ALBATROS setzen).`);

test.skipIf(!mitPlattform)('jede SKILL.md in vier Sprachen nennt nur Werkzeuge, Felder und Werte, die es in der Plattform gibt', async () => {
  const b = await ausPlattform();
  // Der Vertrag ist gelesen: die Werkzeuge des Wegs sind dabei (sonst zeigt ALBATROS auf einen alten Zweig)
  expect([albatros, b.lokal.has('teil_bereit'), b.lokal.has('bau_teil'), b.lokal.has('naechstes'), b.fern.has('lage')]).toEqual([albatros, true, true, true, true]);
  const fehler: string[] = [];
  for (const sprache of Object.keys(PLUGINS) as Sprache[]) {
    for (const { datei, text } of await skills(sprache)) {
      for (const n of unbekannteNamen(text, b)) fehler.push(`${datei}: \`${n}\` gibt es in der Plattform nicht (weder albatros-arbeitsplatz noch mcp)`);
      for (const f of feldFehler(text, b)) fehler.push(`${datei}: ${f}`);
    }
  }
  expect(fehler).toEqual([]);
});

test.skipIf(!mitPlattform)('schnellstart führt in jeder Sprache genau die Werkzeuge des lokalen Servers auf', async () => {
  const b = await ausPlattform();
  const soll = [...b.lokal.keys()].sort();
  for (const sprache of Object.keys(PLUGINS) as Sprache[]) {
    const text = await Bun.file(`${wurzel}plugins/${PLUGINS[sprache]}/skills/schnellstart/SKILL.md`).text();
    expect([sprache, tabelleLokal(text).sort()]).toEqual([sprache, soll]);
  }
});

// ---- Beschreibungen: der Satz der Person steht vorne (ohne Plattform) ----
test('Beschreibungen von lotse, webseite-planen und webseite-bauen nennen den Auslöser in den ersten Zeichen, in jeder Sprache', async () => {
  expect(ausloeserVorne("---\ndescription: 'Zuerst laden bei «Bau mir eine Webseite für …»: erst planen.'\n---\n", 'de')).toBe(true);
  expect(ausloeserVorne(`---\ndescription: 'Plant mit einer Person ohne Vorwissen ihre Webseite in vier Abschnitten. ${'x'.repeat(AUSLOESER_BIS)} «bau mir eine Webseite»'\n---\n`, 'de')).toBe(false);
  const fehler: string[] = [];
  for (const sprache of Object.keys(PLUGINS) as Sprache[]) {
    for (const slug of AUSLOESER_SKILLS) {
      const datei = `plugins/${PLUGINS[sprache]}/skills/${slug}/SKILL.md`;
      const text = await Bun.file(wurzel + datei).text();
      if (!ausloeserVorne(text, sprache)) fehler.push(`${datei}: «${AUSLOESER[sprache]}» fehlt in den ersten ${AUSLOESER_BIS} Zeichen der Beschreibung: «${beschreibung(text).slice(0, 80)}…»`);
    }
  }
  expect(fehler).toEqual([]);
});
