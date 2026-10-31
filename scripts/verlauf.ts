// Verlauf der Durchspiele: je Lauf eine Zeile JSON (Datum, Commits bzw. Pin, Fall, deterministische Punkte), nie Inhalte oder Angaben zur
// Person. Der Trend vergleicht nur Läufe mit gleichem Fall, gleichen Phasen und gleichem Stand der Prüfungen (PUNKTE_STAND).
//   bun scripts/verlauf.ts [datei]                                   Trend je Fall, die letzten zehn Läufe
//   bun scripts/verlauf.ts --anhaengen <ergebnis-ordner> [datei]     Zeile eines Laufs (verlauf-zeile.json) anhängen, z. B. aus dem
//                                                                    Artefakt des Workflows «Durchspiel» von albatros
// Die Datei ist scripts/durchspiel/verlauf.jsonl: im Repo versioniert, damit der Trend über Rechner und Wochen hält und im Review sichtbar
// ist; ausserhalb von plugins/, damit sie nie bei den Lernenden landet; nicht in plugins/albatros/evals/results/, denn dort liegen die ganzen
// Läufe mit Gesprächen und Dateien und bleiben lokal (.gitignore). Eine Zeile mit einem Feld oder Wert, der nicht hierher gehört, lehnt
// anhaengen ab (pruefeZeile); so kommt kein Text aus einem Gespräch in diese Datei.
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Punkte } from './punkte.ts';

export type Zeile = {
  datum: string; // ISO bis zur Minute, UTC
  fall: string;
  umgebung: 'attrappe' | 'echt' | 'trocken';
  skills: string | null; // Commit der Skills im Lauf (--stand)
  albatros: string | null; // Commit der Plattform (nur --echt)
  pin: string | null; // albatros-skills in inhalte.lock der Plattform (nur --echt)
  modell: string | null;
  ab: string;
  bis: string;
  punkte_stand: string;
  erreicht: number;
  moeglich: number;
  exit: 0 | 1 | 2;
  pruefungen: Record<string, [number, number]>; // Prüfung → [erreicht, möglich]
  runden: number;
  ende: string; // ziel, ENDE, runden, budget, fehler, ausgewertet
  kosten_usd: number | null;
};
type Meta = Pick<Zeile, 'umgebung' | 'skills' | 'albatros' | 'pin' | 'modell' | 'kosten_usd' | 'ende'>;

export const zeileAus = (p: Punkte, m: Meta, jetzt = new Date()): Zeile => ({
  datum: `${jetzt.toISOString().slice(0, 16)}Z`, fall: p.fall, umgebung: m.umgebung, skills: m.skills, albatros: m.albatros, pin: m.pin, modell: m.modell,
  ab: p.ab, bis: p.bis, punkte_stand: p.stand, erreicht: p.erreicht, moeglich: p.moeglich, exit: p.exit,
  pruefungen: Object.fromEntries(p.pruefungen.map((x) => [x.id, [x.erreicht, x.moeglich]])), runden: p.info.runden, ende: m.ende, kosten_usd: m.kosten_usd,
});

// Nur diese Felder und nur diese Formen: Kennungen, Commits, Zahlen. Freier Text hat hier keinen Platz.
const KENNUNG = /^[a-z0-9][a-z0-9-]{0,39}$/;
const COMMIT = /^[0-9a-f]{7,40}$/;
const FELDER: Record<keyof Zeile, (v: unknown) => boolean> = {
  datum: (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(v),
  fall: (v) => typeof v === 'string' && KENNUNG.test(v),
  umgebung: (v) => v === 'attrappe' || v === 'echt' || v === 'trocken',
  skills: (v) => v === null || (typeof v === 'string' && COMMIT.test(v)),
  albatros: (v) => v === null || (typeof v === 'string' && COMMIT.test(v)),
  pin: (v) => v === null || (typeof v === 'string' && COMMIT.test(v)),
  modell: (v) => v === null || (typeof v === 'string' && /^[a-z0-9][a-z0-9.\-[\]]{0,39}$/.test(v)),
  ab: (v) => typeof v === 'string' && /^P\d{1,2}$/.test(v),
  bis: (v) => typeof v === 'string' && /^P\d{1,2}$/.test(v),
  punkte_stand: (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v),
  erreicht: (v) => Number.isInteger(v) && (v as number) >= 0,
  moeglich: (v) => Number.isInteger(v) && (v as number) >= 0,
  exit: (v) => v === 0 || v === 1 || v === 2,
  pruefungen: (v) => typeof v === 'object' && v !== null && !Array.isArray(v) && Object.entries(v).every(([k, x]) => KENNUNG.test(k)
    && Array.isArray(x) && x.length === 2 && x.every((n) => Number.isInteger(n) && n >= 0)),
  runden: (v) => Number.isInteger(v) && (v as number) >= 0,
  ende: (v) => typeof v === 'string' && ['ziel', 'ENDE', 'runden', 'budget', 'fehler', 'ausgewertet'].includes(v),
  kosten_usd: (v) => v === null || (typeof v === 'number' && v >= 0 && v < 10_000),
};
export const pruefeZeile = (z: unknown): string[] => {
  if (typeof z !== 'object' || z === null || Array.isArray(z)) return ['keine Zeile'];
  const o = z as Record<string, unknown>;
  return [
    ...Object.keys(o).filter((k) => !(k in FELDER)).map((k) => `Feld ${k} gehört nicht in den Verlauf`),
    ...Object.entries(FELDER).filter(([k, ok]) => !ok(o[k])).map(([k]) => `Feld ${k} fehlt oder hat keine erlaubte Form`),
  ];
};

export function anhaengen(datei: string, z: Zeile): string[] {
  const fehler = pruefeZeile(z);
  if (!fehler.length) appendFileSync(datei, `${JSON.stringify(z)}\n`);
  return fehler;
}

export const lesen = (datei: string): Zeile[] => (existsSync(datei) ? readFileSync(datei, 'utf8') : '').split('\n').filter((z) => z.trim()).flatMap((z) => {
  try {
    const x = JSON.parse(z) as unknown;
    return pruefeZeile(x).length ? [] : [x as Zeile];
  } catch { return []; }
});

// Trend: je Fall, Phasen und Stand der Prüfungen die letzten Läufe, älteste zuerst, mit Anteil und den Prüfungen, die nicht voll sind
export function trend(zeilen: Zeile[], anzahl = 10): string {
  if (!zeilen.length) return 'Noch keine Läufe im Verlauf.';
  const gruppen = new Map<string, Zeile[]>();
  for (const z of zeilen) {
    const k = `${z.fall} ${z.ab}–${z.bis} (Prüfungen ${z.punkte_stand})`;
    gruppen.set(k, [...(gruppen.get(k) ?? []), z]);
  }
  const aus: string[] = [];
  for (const [k, liste] of gruppen) {
    const letzte = liste.sort((a, b) => a.datum.localeCompare(b.datum)).slice(-anzahl);
    const anteil = (z: Zeile) => (z.moeglich ? Math.round((100 * z.erreicht) / z.moeglich) : 0);
    const erste = letzte[0]!, jetzt = letzte.at(-1)!;
    aus.push(`${k}: ${letzte.length} von ${liste.length} Läufen, ${anteil(erste)} % → ${anteil(jetzt)} %, zuletzt Exit ${jetzt.exit}`);
    for (const z of letzte) {
      const offen = Object.entries(z.pruefungen).filter(([, [e, m]]) => e < m).map(([id, [e, m]]) => `${id} ${e}/${m}`);
      aus.push(`  ${z.datum.replace('T', ' ').slice(0, 16)}  ${z.umgebung.padEnd(8)} ${(z.skills ?? '-').slice(0, 7).padEnd(7)} ${String(z.erreicht).padStart(3)}/${String(z.moeglich).padEnd(3)} ${String(anteil(z)).padStart(3)} %  Exit ${z.exit}  ${z.runden} Runden (${z.ende})${offen.length ? `  offen: ${offen.join(', ')}` : ''}`);
    }
  }
  return aus.join('\n');
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const STANDARD = new URL('./durchspiel/verlauf.jsonl', import.meta.url).pathname;
  if (args[0] === '--anhaengen') {
    const ordner = args[1];
    const datei = args[2] ?? STANDARD;
    if (!ordner || !existsSync(join(ordner, 'verlauf-zeile.json'))) {
      console.error('Aufruf: bun scripts/verlauf.ts --anhaengen <ergebnis-ordner mit verlauf-zeile.json> [datei]');
      process.exit(2);
    }
    const z = JSON.parse(readFileSync(join(ordner, 'verlauf-zeile.json'), 'utf8')) as Zeile;
    const fehler = anhaengen(datei, z);
    if (fehler.length) {
      console.error(`Nicht angehängt: ${fehler.join('; ')}`);
      process.exit(1);
    }
    console.log(`Angehängt an ${datei}: ${z.fall} ${z.datum}, ${z.erreicht}/${z.moeglich}, Exit ${z.exit}`);
  } else {
    console.log(trend(lesen(args[0] ?? STANDARD)));
  }
}
