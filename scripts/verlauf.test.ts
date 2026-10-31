// Verlauf der Durchspiele (scripts/verlauf.ts): je Lauf eine Zeile nur mit Kennungen, Commits und Zahlen, nie Inhalte; Trend je Fall.
import { afterAll, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PERSONEN } from './durchspiel/personen.ts';
import { ladeFahrplan } from './fahrplan.ts';
import { punkte, type Lauf } from './punkte.ts';
import { anhaengen, lesen, pruefeZeile, trend, zeileAus, type Zeile } from './verlauf.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const geladen = await ladeFahrplan(wurzel);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const ordner = mkdtempSync(join(tmpdir(), 'verlauf-test-'));
afterAll(() => rmSync(ordner, { recursive: true, force: true }));
const beispiel = (n: string) => JSON.parse(readFileSync(join(wurzel, 'scripts/durchspiel/beispiele', n), 'utf8')) as Lauf;
const META = { umgebung: 'attrappe' as const, skills: 'a92f5c5', albatros: null, pin: null, modell: 'sonnet', kosten_usd: 12.5, ende: 'ziel' };

test('eine Zeile hat nur erlaubte Felder, keine Inhalte aus dem Gespräch', () => {
  const b = beispiel('gut-lernen.json');
  const z = zeileAus(punkte(b, geladen.fahrplan, PERSONEN[b.fall]), META, new Date('2026-10-31T17:05:59Z'));
  expect(pruefeZeile(z)).toEqual([]);
  expect(z).toMatchObject({ datum: '2026-10-31T17:05Z', fall: 'lernen', ab: 'P1', bis: 'P2', erreicht: 63, moeglich: 63, exit: 0, runden: 7 });
  const json = JSON.stringify(z);
  for (const n of b.nachrichten) for (const wort of n.text.split(/\s+/).filter((w) => w.length > 12)) expect(json).not.toContain(wort);
  for (const t of ['Blende', 'Fotoclub', 'Testwil']) expect(json).not.toContain(t);
});

test('pruefeZeile lehnt fremde Felder und freien Text ab', () => {
  const b = beispiel('schlecht-gratis.json');
  const z = zeileAus(punkte(b, geladen.fahrplan, PERSONEN[b.fall]), META);
  expect(pruefeZeile({ ...z, text: 'Suppenlöffel heisst er.' })).toEqual(['Feld text gehört nicht in den Verlauf']);
  expect(pruefeZeile({ ...z, fall: 'Mira vom Yogaraum' })).toEqual(['Feld fall fehlt oder hat keine erlaubte Form']);
  expect(pruefeZeile({ ...z, skills: 'mein Stand' })).toEqual(['Feld skills fehlt oder hat keine erlaubte Form']);
  expect(pruefeZeile({ ...z, pruefungen: { 'ein Satz mit Leerzeichen': [1, 1] } })).toEqual(['Feld pruefungen fehlt oder hat keine erlaubte Form']);
  const { datum: _, ...ohneDatum } = z;
  expect(pruefeZeile(ohneDatum)).toEqual(['Feld datum fehlt oder hat keine erlaubte Form']);
});

test('anhaengen schreibt nur gültige Zeilen; Trend je Fall mit Anteil und offenen Prüfungen', () => {
  const datei = join(ordner, 'verlauf.jsonl');
  const z = (n: string, d: string, skills: string): Zeile => {
    const b = beispiel(n);
    return zeileAus(punkte(b, geladen.fahrplan, PERSONEN[b.fall]), { ...META, skills }, new Date(d));
  };
  expect(anhaengen(datei, z('schlecht-gratis.json', '2026-10-30T08:00:00Z', 'aaaaaaa'))).toEqual([]);
  expect(anhaengen(datei, z('gut-lernen.json', '2026-10-31T09:00:00Z', 'bbbbbbb'))).toEqual([]);
  expect(anhaengen(datei, { ...z('gut-lernen.json', '2026-10-31T10:00:00Z', 'ccccccc'), fall: 'Kein Kennzeichen' })).not.toEqual([]);
  const zeilen = lesen(datei);
  expect(zeilen.map((x) => x.skills)).toEqual(['aaaaaaa', 'bbbbbbb']);
  const t = trend(zeilen);
  expect(t).toContain('lernen P1–P2 (Prüfungen 2026-10-31): 1 von 1 Läufen, 100 % → 100 %, zuletzt Exit 0');
  expect(t).toContain('gratis-bis-lokal P1–P1 (Prüfungen 2026-10-31): 1 von 1 Läufen, 44 % → 44 %, zuletzt Exit 1');
  expect(t).toMatch(/offen: lage-vor-arbeit 0\/1, lage-belege 0\/1/);
  expect(trend([])).toBe('Noch keine Läufe im Verlauf.');
});

test('der Verlauf im Repo hat nur gültige Zeilen', () => {
  const datei = join(wurzel, 'scripts/durchspiel/verlauf.jsonl');
  const roh = readFileSync(datei, 'utf8').split('\n').filter((z) => z.trim());
  expect(roh.flatMap((z) => pruefeZeile(JSON.parse(z)))).toEqual([]);
  expect(lesen(datei)).toHaveLength(roh.length);
});
