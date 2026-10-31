// Regel «Lektion je Phase und Weg» aus scripts/lektionen.ts, die pruefen.ts nutzt: die echten Missionen erfüllen sie, und jede Lücke wird rot.
import { expect, test } from 'bun:test';
import { Glob } from 'bun';
import { ladeFahrplan } from './fahrplan.ts';
import { istLektion, lektionenFehlen, type LektionsMission } from './lektionen.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const echte = async () => {
  const ms: LektionsMission[] = [];
  for (const d of new Glob('missionen/*/*.md').scanSync(wurzel)) {
    const kopf = (await Bun.file(wurzel + d).text()).match(/^---\n([\s\S]*?)\n---/)![1]!;
    ms.push(Bun.YAML.parse(kopf) as LektionsMission);
  }
  return ms;
};

test('echte Missionen: jede Phase mit Lernmomenten hat auf beiden Wegen eine Lektion mit Kontrollfrage', async () => {
  const plan = await ladeFahrplan(wurzel);
  if (!plan.ok) throw new Error(plan.fehler.join('\n'));
  expect(plan.fahrplan.phasen.filter((p) => p.lernmomente?.length).length).toBeGreaterThan(0);
  expect(lektionenFehlen(plan.fahrplan.phasen, await echte())).toEqual([]);
});

const FRAGE = [{ frage: 'Warum?', kern: 'Darum.' }];
const P = [{ id: 'P6', lernmomente: ['Warum Farben nur an einem Ort stehen'] }];

test('eine Lektion der Flugschule zählt für beide Wege, eine des Wegs nur für ihren Weg', () => {
  expect(lektionenFehlen(P, [{ id: 'flugschule-19-x', weg: 'flugschule', phase: 'P6', verstehen: FRAGE }])).toEqual([]);
  const nurWebseite = lektionenFehlen(P, [{ id: 'webseite-04-x', weg: 'webseite', phase: 'P6', verstehen: FRAGE }]);
  expect(nurWebseite).toHaveLength(1);
  expect(nurWebseite[0]).toStartWith('P6 hat Lernmomente, aber auf dem Weg geschaeft keine Lektion mit Kontrollfrage');
});

test('ohne Kontrollfrage, freiwillig, nur mit Pilot oder in einer anderen Phase zählt eine Mission nicht', () => {
  const ohne: LektionsMission[] = [
    { id: 'flugschule-01-a', weg: 'flugschule', phase: 'P6' },
    { id: 'flugschule-02-b', weg: 'flugschule', phase: 'P6', verstehen: [] },
    { id: 'flugschule-03-c', weg: 'flugschule', phase: 'P6', optional: true, verstehen: FRAGE },
    { id: 'flugschule-04-d', weg: 'flugschule', phase: 'P6', abo: 'pilot', verstehen: FRAGE },
    { id: 'flugschule-05-e', weg: 'flugschule', phase: 'P7', verstehen: FRAGE },
  ];
  expect(lektionenFehlen(P, ohne).map((f) => f.split(':')[0])).toEqual([
    'P6 hat Lernmomente, aber auf dem Weg webseite keine Lektion mit Kontrollfrage',
    'P6 hat Lernmomente, aber auf dem Weg geschaeft keine Lektion mit Kontrollfrage',
  ]);
  // abo: light hält lage für niemanden zurück, nur abo: pilot fällt für Light weg
  expect(istLektion({ id: 'flugschule-06-f', weg: 'flugschule', phase: 'P6', abo: 'light', verstehen: FRAGE }, 'P6', 'webseite')).toBe(true);
});

test('Phasen ohne Lernmomente brauchen keine Lektion', () => {
  expect(lektionenFehlen([{ id: 'P8' }, { id: 'P13', lernmomente: [] }], [])).toEqual([]);
});
