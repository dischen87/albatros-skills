// fahrplan.yaml laden (scripts/fahrplan.ts): erst das Schema, dann, was ein Schema nicht prüfen kann, für die Felder vom 31.10.2026
// (Gegenprüfung: insel_je_wohnort, marken, methoden.wann, ausgaenge.ablage, werte). Jeder Fall bricht eine Regel an einer Kopie.
import { describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ladeFahrplan, vertragsFehler, type Fahrplan } from './fahrplan.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const geladen = await ladeFahrplan(wurzel);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const F: Fahrplan = geladen.fahrplan;
const kopie = () => structuredClone(F);
const phase = (f: Fahrplan, id: string) => f.phasen.find((p) => p.id === id)!;
// Eine geänderte Kopie als fahrplan.yaml (JSON ist gültiges YAML) laden: Fehler oder gültig
const lade = async (f: unknown) => {
  const d = mkdtempSync(join(tmpdir(), 'albatros-fahrplan-'));
  writeFileSync(join(d, 'fahrplan.yaml'), JSON.stringify(f));
  const g = await ladeFahrplan(`${d}/`);
  rmSync(d, { recursive: true, force: true });
  return g.ok ? 'gültig' : g.fehler.join('\n');
};

describe('fahrplan.yaml nach der Gegenprüfung', () => {
  test('der Vertrag im Repo ist gültig und hat die neuen Felder', () => {
    expect(vertragsFehler(F)).toEqual([]);
    expect(phase(F, 'P13').insel_je_wohnort).toEqual({ light: ['hafen', 'live'], pilot: ['hafen', 'fliessband', 'live'], selbst: ['live'] });
    expect(F.wohnorte).toEqual({ light: 'Albatros Light', pilot: 'Albatros Pilot' });
    expect(F.marken.offen[0]).toBe('offen');
  });
  test('Insel je Wohnort: Teilfolge der Insel-Schritte der Phase in derselben Reihenfolge, alle drei Wohnorte', async () => {
    const f = kopie();
    phase(f, 'P13').insel_je_wohnort!.light = ['live', 'hafen'];
    expect(vertragsFehler(f)).toEqual(['fahrplan.yaml: P13 insel_je_wohnort.light (live, hafen) ist keine Teilfolge von insel (hafen, fliessband, live, domain)']);
    expect(await lade(f)).toContain('ist keine Teilfolge');
    const g = kopie();
    delete (phase(g, 'P13').insel_je_wohnort as Partial<Record<string, string[]>>).selbst;
    expect(await lade(g)).toContain("must have required property 'selbst'");
  });
  test('Marken: kein Wort in zwei Marken (ohne Gross- und Kleinschreibung)', async () => {
    const f = kopie();
    f.marken.annahme = [...f.marken.annahme, 'OFFEN'];
    expect(vertragsFehler(f)).toEqual(['fahrplan.yaml: marken: «OFFEN» steht in offen und in annahme']);
    expect(await lade(f)).toContain('steht in offen und in annahme');
  });
  test('methoden mit wann, ausgaenge mit ablage, werte nicht leer', async () => {
    const ohneWann = kopie();
    phase(ohneWann, 'P1').methoden = { geschaeft: ['ideen-check'] } as never;
    expect(await lade(ohneWann)).toContain("/phasen/0/methoden must have required property 'wann'");
    const ohneAblage = kopie();
    phase(ohneAblage, 'P1').ausgaenge = { geschaeft: ['weiter'] } as never;
    expect(await lade(ohneAblage)).toContain("/phasen/0/ausgaenge must have required property 'ablage'");
    const leer = kopie();
    phase(leer, 'P13').pflichtfragen[0]!.werte = [];
    expect(await lade(leer)).toContain('/phasen/12/pflichtfragen/0/werte must NOT have fewer than 1 items');
  });
  // Gegenprobe Welle 5 (31.10.2026, weg-05): P1 ist auf dem Weg Geschäft erst mit «Entscheid: weiter» oder «stoppen» geschafft
  test('ausgaenge.geschafft: Pflicht, und nur Ausgänge der Phase', async () => {
    expect(phase(F, 'P1').ausgaenge).toEqual({ geschaeft: ['weiter', 'anpassen', 'stoppen'], geschafft: ['weiter', 'stoppen'], ablage: 'docs/ideen-check.md#Entscheid:' });
    const ohne = kopie();
    delete (phase(ohne, 'P1').ausgaenge as Partial<NonNullable<Fahrplan['phasen'][number]['ausgaenge']>>).geschafft;
    expect(await lade(ohne)).toContain("/phasen/0/ausgaenge must have required property 'geschafft'");
    const fremd = kopie();
    phase(fremd, 'P1').ausgaenge!.geschafft = ['weiter', 'vielleicht'];
    expect(vertragsFehler(fremd)).toEqual(['fahrplan.yaml: P1 ausgaenge.geschafft nennt vielleicht, das ist kein Ausgang der Phase (weiter, anpassen, stoppen)']);
    expect(await lade(fremd)).toContain('das ist kein Ausgang der Phase');
  });
});
