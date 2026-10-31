// Durchspiel ohne Modell (scripts/durchspiel.ts --trocken): Jeder aufgezeichnete Beispiel-Verlauf läuft durch Attrappe, Protokolle,
// Zustände und Punkte wie ein echter Lauf. Erwartet: derselbe Exit-Code wie in der Aufzeichnung, dieselben Punkte wie direkt aus
// scripts/punkte.ts, die Werkzeuge mit ihrer Runde im Protokoll der Attrappe, und der Verlauf im Repo bleibt unberührt.
import { afterAll, describe, expect, test } from 'bun:test';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PERSONEN } from './durchspiel/personen.ts';
import { ladeFahrplan } from './fahrplan.ts';
import { punkte, type Lauf, type Punkte } from './punkte.ts';
import { pruefeZeile } from './verlauf.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const geladen = await ladeFahrplan(wurzel);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const ordner = mkdtempSync(join(tmpdir(), 'durchspiel-test-'));
afterAll(() => rmSync(ordner, { recursive: true, force: true }));
const VERLAUF = join(wurzel, 'scripts/durchspiel/verlauf.jsonl');
const kurz = (p: Punkte) => ({ exit: p.exit, erreicht: p.erreicht, moeglich: p.moeglich, pruefungen: p.pruefungen.map(({ id, ok, erreicht, moeglich }) => ({ id, ok, erreicht, moeglich })) });

describe('durchspiel.ts --trocken', () => {
  for (const datei of readdirSync(join(wurzel, 'scripts/durchspiel/beispiele')).filter((f) => f.endsWith('.json'))) {
    test(`${datei}: Exit und Punkte wie direkt gerechnet`, async () => {
      const quelle = join(wurzel, 'scripts/durchspiel/beispiele', datei);
      const b = JSON.parse(readFileSync(quelle, 'utf8')) as Lauf & { erwartet: { exit: number } };
      const vorher = readFileSync(VERLAUF, 'utf8');
      const aus = join(ordner, datei.replace('.json', ''));
      const p = Bun.spawn(['bun', join(wurzel, 'scripts/durchspiel.ts'), '--trocken', quelle, '--ergebnis', aus], { cwd: wurzel, stdout: 'pipe', stderr: 'pipe' });
      const [code, fehler] = [await p.exited, await new Response(p.stderr).text()];
      expect({ code, fehler: code > 2 ? fehler.slice(-800) : '' }).toEqual({ code: b.erwartet.exit, fehler: '' });

      const gerechnet = JSON.parse(readFileSync(join(aus, 'punkte.json'), 'utf8')) as Punkte;
      expect(kurz(gerechnet)).toEqual(kurz(punkte(b, geladen.fahrplan, PERSONEN[b.fall])));
      // Die Attrappe hat jeden Aufruf mit seiner Runde protokolliert, open jede Adresse mit ihrer Runde
      const lauf = JSON.parse(readFileSync(join(aus, 'lauf.json'), 'utf8')) as Lauf;
      expect(lauf.aufrufe.map((a) => [a.runde, a.werkzeug])).toEqual(b.aufrufe.map((a) => [a.runde, a.werkzeug]));
      expect(lauf.geoeffnet).toEqual(b.geoeffnet);
      expect(lauf.zustaende.map((z) => [z.runde, Object.keys(z.dateien).sort(), z.gebaut])).toEqual(b.zustaende.map((z) => [z.runde, Object.keys(z.dateien).sort(), z.gebaut]));
      // Eine Zeile für den Verlauf liegt bei den Ergebnissen; der Verlauf im Repo bleibt ohne --verlauf unberührt
      expect(pruefeZeile(JSON.parse(readFileSync(join(aus, 'verlauf-zeile.json'), 'utf8')))).toEqual([]);
      expect(readFileSync(VERLAUF, 'utf8')).toBe(vorher);
    }, 60_000);
  }
});
