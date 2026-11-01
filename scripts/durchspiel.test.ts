// Durchspiel ohne Modell (scripts/durchspiel.ts --trocken): Jeder aufgezeichnete Beispiel-Verlauf läuft durch Attrappe, Protokolle,
// Zustände und Punkte wie ein echter Lauf. Erwartet: derselbe Exit-Code wie in der Aufzeichnung, dieselben Punkte wie direkt aus
// scripts/punkte.ts, die Werkzeuge mit ihrer Runde im Protokoll der Attrappe, und der Verlauf im Repo bleibt unberührt.
import { afterAll, describe, expect, test } from 'bun:test';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
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

// ———— Die Attrappe selbst (scripts/durchspiel/mock-mcp.ts), wie der echte Dienst mit FAHRPLAN und ERFASSUNG ————
// Sichtung Welle 7 (sicht-05) und w7-20 (01.11.2026): Die Attrappe prüfte bei den Eingaben nur Pflichtfelder, erlaubte Werte und Typ, nicht
// Länge und Muster; sie kürzte titel nicht, kannte die 409 von flugschule bei verstanden_melden nicht, liess coach_fragen ohne Abo durch,
// fragte bei luecke_melden mit einem eigenen Satz und nannte bei offenen Pflichtfragen mit werte die deutschen Anfangswörter nicht
// (Nachstellung: welle7/sichtung/mock-mcp.out gegen echt-mcp.out). Die KI im Durchspiel lernte so anderes als bei der echten Plattform.
type Ergebnis = { fehler: boolean; text: string };
async function attrappe(aufrufe: [string, Record<string, unknown>][], o: { stufe?: string; dateien?: Record<string, string> } = {}): Promise<Ergebnis[]> {
  const hafen = mkdtempSync(join(ordner, 'hafen-'));
  for (const [d, w] of Object.entries(o.dateien ?? {})) writeFileSync(join(hafen, d), w);
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('DURCHSPIEL_')));
  const p = Bun.spawn(['bun', join(wurzel, 'scripts/durchspiel/mock-mcp.ts')], {
    cwd: wurzel, stdin: 'pipe', stdout: 'pipe', stderr: 'ignore', env: { ...env, DURCHSPIEL_HAFEN: hafen, DURCHSPIEL_STUFE: o.stufe ?? 'light' },
  });
  p.stdin.write(`${aufrufe.map(([name, a], i) => JSON.stringify({ jsonrpc: '2.0', id: i + 1, method: 'tools/call', params: { name, arguments: a } })).join('\n')}\n`);
  p.stdin.end();
  const aus = (await new Response(p.stdout).text()).trim().split('\n').map((z) => JSON.parse(z) as { result: { content: { text: string }[]; isError?: boolean } });
  await p.exited;
  return aus.map((m) => ({ fehler: m.result.isError === true, text: m.result.content[0]!.text }));
}
const tagZuerich = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(d);
const tagCh = (iso: string) => iso.split('-').reverse().map(Number).join('.');
const morgen = () => { const d = new Date(`${tagZuerich(new Date())}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };
const STAND: string = JSON.parse(readFileSync(join(wurzel, 'plugins/albatros/.claude-plugin/plugin.json'), 'utf8')).version;
const NACHFRAGEN = 'Stell dann eine Frage aus «verstehen» dieser Mission (im Modus machen nur als Angebot), ohne die Antwort vorzusagen; beantwortet die Person sie in eigenen Worten, meldest du verstanden_melden mit art: wiederholung.';
const LANG = 'Ferienwohnungen Sonnenhof am Thunersee für Familien mit kleinen Kindern und Hunden im Berner Oberland';
const EINGABEN: [string, Record<string, unknown>][] = [
  ['schritt_melden', { schritt: 'idee', titel: 'A'.repeat(301), sprache: 'de' }], ['schritt_melden', { schritt: 'idee', titel: 'Sonnenhof\nThunersee', sprache: 'de' }],
  ['schritt_melden', { schritt: 'idee', titel: 'Sonnenhof\tThunersee' }], ['schritt_melden', { schritt: 'idee', titel: '   ' }],
  ['schritt_melden', { schritt: 'idee', titel: `${'a\n'.repeat(151)}` }], ['schritt_melden', { schritt: 'idee', projekt: 'Sonnenhof' }],
  ['schritt_melden', { titel: 'Sonnenhof' }], ['lage', { anfrage: 'x'.repeat(301) }], ['lage', { skills_stand: 'x'.repeat(21) }],
  ['luecke_melden', { frage: 'kurz', art: 'nicht_abgedeckt' }], ['luecke_melden', { frage: 'Wie baue ich ein Formular ein?', art: 'nicht_abgedeckt', skill: 'Webseite' }],
  ['coach_fragen', { frage: 'Wie geht das?', skill: 'x'.repeat(65) }], ['skill_holen', { slug: 'Lotse' }], ['verstanden_melden', { mission: '', art: 'selbst' }],
];

test('Attrappe: Eingaben mit den Grenzen und Meldungen des echten Diensts, titel gekürzt wie dort', async () => {
  const r = await attrappe([...EINGABEN, ['schritt_melden', { schritt: 'idee', titel: LANG, sprache: 'de' }], ['schritt_melden', { schritt: 'idee', titel: 'Sonnenhof\n', sprache: 'fr' }]]);
  expect(r).toEqual([
    { fehler: true, text: 'Ungültige Angaben: titel: Too big: expected string to have <=300 characters' },
    { fehler: true, text: 'Ungültige Angaben: titel: Ohne Zeilenumbrüche' },
    { fehler: true, text: 'Ungültige Angaben: titel: Ohne Zeilenumbrüche' },
    { fehler: true, text: 'Ungültige Angaben: titel: Too small: expected string to have >=1 characters' },
    { fehler: true, text: 'Ungültige Angaben: titel: Too big: expected string to have <=300 characters, titel: Ohne Zeilenumbrüche' },
    { fehler: true, text: 'Ungültige Angaben: projekt: Kleinbuchstaben, Ziffern und «-», höchstens 40 Zeichen' },
    { fehler: true, text: expect.stringMatching(/^Ungültige Angaben: schritt: Invalid option: expected one of "idee"\|"recherche"\|/) },
    { fehler: true, text: 'Ungültige Angaben: anfrage: Too big: expected string to have <=300 characters' },
    { fehler: true, text: 'Ungültige Angaben: skills_stand: Too big: expected string to have <=20 characters' },
    { fehler: true, text: 'Ungültige Angaben: frage: Too small: expected string to have >=10 characters' },
    { fehler: true, text: 'Ungültige Angaben: skill: Kleinbuchstaben, Ziffern und «-», höchstens 64 Zeichen' },
    { fehler: true, text: 'Ungültige Angaben: skill: Too big: expected string to have <=64 characters, skill: Kleinbuchstaben, Ziffern und «-», höchstens 64 Zeichen' },
    { fehler: true, text: 'Ungültige Angaben: slug: Kleinbuchstaben, Ziffern und «-», höchstens 64 Zeichen' },
    { fehler: true, text: 'Ungültige Angaben: mission: Too small: expected string to have >=1 characters' },
    { fehler: false, text: 'Auf der Insel steht projekt jetzt bei «Idee» (idee, Phase P1). Der Name ist auf der Insel gekürzt: «Ferienwohnungen Sonnenhof am Thunersee für Familien mit kleinen Kindern und…». Ruf lage erneut auf. Insel: https://albatros.build/cockpit/insel' },
    { fehler: false, text: 'projekt war schon bei «Idee» (idee, Phase P1); nichts geändert, diesen Schritt nicht nochmals melden. Insel: https://albatros.build/fr/cockpit/insel' },
  ]);
}, 30_000);

test('Attrappe: verstanden_melden mit den Regeln und Sätzen von flugschule', async () => {
  const r = await attrappe([
    ['verstanden_melden', { mission: 'webseite-02-bauen', art: 'wiederholung' }], ['verstanden_melden', { mission: 'flugschule-11-idee', art: 'wiederholung' }],
    ['verstanden_melden', { mission: 'flugschule-11-idee', art: 'kontrollfrage' }], ['verstanden_melden', { mission: 'flugschule-11-idee', art: 'kontrollfrage' }],
    ['verstanden_melden', { mission: 'flugschule-11-idee', art: 'wiederholung' }], ['verstanden_melden', { mission: 'webseite-02-bauen', art: 'selbst' }],
    ['verstanden_melden', { mission: 'flugschule-99-gibts-nicht', art: 'selbst' }],
  ]);
  const ab = tagCh(morgen());
  expect(r).toEqual([
    { fehler: true, text: 'Diese Mission hat keine Kontrollfragen, eine Wiederholung gibt es dafür nicht. Gespeichert ist nichts.' },
    { fehler: true, text: 'Wiederholen geht erst, wenn die Lektion einmal verstanden ist (selbst oder kontrollfrage). Gespeichert ist nichts.' },
    { fehler: false, text: `Notiert: «verstanden» für flugschule-11-idee («Wohin die Reise geht»), Kontrollfrage beantwortet.\nWiederholung: ab ${ab}, zu Beginn einer Sitzung. ${NACHFRAGEN}` },
    { fehler: false, text: `War schon notiert: «verstanden» für flugschule-11-idee («Wohin die Reise geht»), Kontrollfrage beantwortet.\nWiederholung: ab ${ab}, zu Beginn einer Sitzung. ${NACHFRAGEN}` },
    { fehler: true, text: `Wiederholen geht ab ${ab}, vorher ist die Lektion noch frisch. Gespeichert ist nichts.` },
    { fehler: false, text: 'Notiert: «verstanden» für webseite-02-bauen («Deine Seite auf deinem Computer»), selbst gemacht.\nFür diese Lektion steht keine Wiederholung an (die Mission hat keine Kontrollfragen, oder sie ist schon wiederholt); stell dazu keine Frage aus «verstehen».' },
    { fehler: true, text: 'Diese Mission gibt es nicht.' },
  ]);
}, 30_000);

const COACH_ABO = 'Der Coach gehört zum Abo. Deckt kein Skill die Frage ab, melde sie mit luecke_melden an Albatros (mit dem Einverständnis der Person); dann werden die Skills besser.';
const BEIM_TEAM = 'Deine Frage ist beim Albatros-Team. Die Antwort kommt per Mail und steht danach auch hier.';
const FRAGE = 'Frag die Person zuerst mit diesem Satz: «Darf Albatros Fragen, die die Skills noch nicht abdecken, mit deinem Konto speichern, damit die Skills besser werden? Du kannst sie im Cockpit ansehen und löschen.» Ruf luecke_melden danach nochmals auf: bei Ja mit einverstanden: true, bei Nein mit einverstanden: false.';
const NEIN = 'Albatros speichert keine Meldungen von dir, weil du das abgelehnt hast. Ändern kannst du das jederzeit im Cockpit.';
const GESPEICHERT = 'Gespeichert, danke: Damit werden die Skills von Albatros besser. Die Person sieht ihre Meldungen im Cockpit und kann sie dort löschen.';

test('Attrappe: coach_fragen ohne Abo wie der echte Dienst, Pflichtmeldungen gehen ans Team', async () => {
  expect(await attrappe([['coach_fragen', { frage: 'Wie geht das?' }], ['coach_fragen', { frage: 'Die Rechnung stimmt nicht.', anliegen: 'rechnung' }]], { stufe: 'gratis' }))
    .toEqual([{ fehler: true, text: COACH_ABO }, { fehler: false, text: BEIM_TEAM }]);
  const [light] = await attrappe([['coach_fragen', { frage: 'Wie geht das?' }]], { stufe: 'light' });
  expect(light!.fehler).toBe(false);
}, 30_000);

test('Attrappe: luecke_melden fragt mit dem Satz von flugschule und antwortet nach dem Nein wie dort', async () => {
  const frage = { frage: 'Wie baue ich ein Formular ein?', art: 'nicht_abgedeckt' };
  expect(await attrappe([['luecke_melden', frage], ['luecke_melden', { ...frage, einverstanden: true }], ['luecke_melden', frage]]))
    .toEqual([{ fehler: true, text: FRAGE }, { fehler: false, text: GESPEICHERT }, { fehler: false, text: GESPEICHERT }]);
  expect(await attrappe([['luecke_melden', { ...frage, einverstanden: false }], ['luecke_melden', frage], ['luecke_melden', { ...frage, einverstanden: true }]]))
    .toEqual([{ fehler: true, text: NEIN }, { fehler: true, text: NEIN }, { fehler: true, text: NEIN }]);
}, 30_000);

test('Attrappe: offene Pflichtfrage mit werte nennt die deutschen Anfangswörter wie lage (w7-20)', async () => {
  const modus = geladen.fahrplan.phasen[0]!.pflichtfragen.find((q) => q.id === 'modus')!;
  const r = await attrappe(['Projektname: Sonnenhof', 'Modus: faire', 'Modus: machen, wie besprochen', 'Modus: [offen: fragen]'].slice(0, 4).map((z, i) =>
    ['lage', { skills_stand: STAND, belege: [{ datei: 'docs/projekt.md', zeilen: i ? ['Projektname: Sonnenhof', z] : [z] }] }] as [string, Record<string, unknown>]), { dateien: { weg: 'webseite' } });
  const zeile = (t: string) => t.split('\n').filter((z) => z.startsWith('Pflichtfragen offen: modus:'));
  const fehlt = `; der Wert in «Modus:» beginnt mit lernen oder machen; diese Wörter bleiben deutsch`;
  expect(r.map((x) => zeile(x.text))).toEqual([
    [`Pflichtfragen offen: modus: ${modus.frage.de} (als [Annahme] vorschlagen${fehlt})`],
    [`Pflichtfragen offen: modus: ${modus.frage.de} (als [Annahme] vorschlagen; Zeile «Modus:» beginnt nicht mit lernen oder machen; diese Wörter bleiben deutsch)`],
    [],
    [`Pflichtfragen offen: modus: ${modus.frage.de} (als [Annahme] vorschlagen${fehlt})`],
  ]);
}, 30_000);

// Gegen das echte mcp von albatros (ALBATROS, sonst ../albatros neben diesem Repo; fehlt beides, übersprungen), wie scripts/attrappen.ts:
// dieselben Eingaben ergeben dieselbe Antwort, jeder Schritt der Insel heisst gleich, die Zeile zu offenen Pflichtfragen ist gleich, und die
// festen Sätze von flugschule und mcp stehen wörtlich in albatros. So fällt auf, wenn die Attrappe wieder abweicht.
const albatros = resolve(process.env.ALBATROS ?? `${wurzel}../albatros`);
test.skipIf(!existsSync(`${albatros}/services/mcp/scripts/lage-attrappen.ts`))('Attrappe gegen das echte mcp: gleiche Antworten, feste Sätze wörtlich aus albatros', async () => {
  const kit: Record<string, unknown> = await import(`${albatros}/packages/kit/src/index.ts`);
  const mcp: Record<string, unknown> = await import(`${albatros}/services/mcp/src/app.ts`);
  const { ZUSTAENDE } = (await import(`${albatros}/services/mcp/scripts/lage-attrappen.ts`)) as { ZUSTAENDE: Record<string, { antworten: Record<string, { status: number; body: unknown }>; eingabe: Record<string, unknown> }> };
  const createApp = mcp.createApp as (deps: Record<string, unknown>) => { request: (pfad: string, init: RequestInit) => Promise<Response> };
  // Die Antworten zum Schein unten erkennen den Weg ohne Abfrage: mcp hängt je nach Stand ?sprache=… an (albatros Welle 7, sicht-06: POST
  // /cockpit/verstanden?sprache=de; vorher ohne). Nachbesserung 01.11.2026: Der Vergleich wurde gegen albatros-w7 rot («Nicht gefunden.»),
  // obwohl die Attrappe gleich antwortete. Die Zustände von lage-attrappen.ts tragen die Abfrage im Schlüssel und gelten weiter genau.
  const ohneAbfrage = (p: string) => p.split('?')[0]!;
  const schalter = { ...(kit.ALLE_AUS as Record<string, boolean>), FAHRPLAN: true, ERFASSUNG: true };
  const echt = async (antworten: (m: string, p: string, b: unknown) => { status: number; body: unknown } | undefined, name: string, args: Record<string, unknown>): Promise<Ergebnis> => {
    const app = createApp({
      resource: 'https://mcp.albatros.build', issuer: 'https://clerk.albatros.test', schalter, erfassung: null, limit: null,
      ctx: () => ({ methoden: [], schalter, rufe: async (_d: string, m: string, p: string, b?: unknown) => antworten(m, p, b) ?? { status: 404, body: { error: 'Nicht gefunden.' } } }),
      verifyToken: async () => ({ subject: 'user_anna', aud: ['https://mcp.albatros.build'], revoked: false, expired: false }),
    });
    const r = await app.request('/', { method: 'POST', headers: { authorization: 'Bearer attrappe', 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) });
    const j = (await r.json()) as { result: { content: { text: string }[]; isError?: boolean } };
    return { fehler: j.result.isError === true, text: j.result.content[0]!.text };
  };
  // Eingaben und alle Schritte der Insel der Reihe nach (flugschule sagt jedes Mal neu), mit langem titel
  const schritte = geladen.fahrplan.insel.map((s) => ['schritt_melden', { schritt: s, titel: LANG, sprache: 'de' }] as [string, Record<string, unknown>]);
  const insel = (m: string, p: string, b: unknown) => (m === 'POST' && ohneAbfrage(p) === '/cockpit/insel/schritt'
    ? { status: 200, body: { projekt: (b as { projekt?: string }).projekt ?? 'projekt', schritt: (b as { schritt: string }).schritt, neu: true } } : undefined);
  const mock = await attrappe([...EINGABEN, ...schritte]);
  const erwartet: Ergebnis[] = [];
  for (const [name, args] of [...EINGABEN, ...schritte]) erwartet.push(await echt(insel, name, args));
  expect(mock).toEqual(erwartet);

  // Offene Pflichtfrage mit werte: dieselbe Zeile wie lage im Zustand «Gratis, Weg Webseite, noch nichts auf der Insel»
  const z = ZUSTAENDE['gratis-ohne-projekt']!;
  for (const zeilen of [['Projektname: Sonnenhof'], ['Projektname: Sonnenhof', 'Modus: faire']]) {
    const args = { ...z.eingabe, belege: [{ datei: 'docs/projekt.md', zeilen }] };
    const e = await echt((m, p) => z.antworten[`${m} ${p}`] ?? (m === 'GET' && ohneAbfrage(p) === '/cockpit/erfassung' ? { status: 200, body: { erfassung: 'ja', anfragen: 'offen' } } : undefined), 'lage', args);
    const [a] = await attrappe([['lage', args]], { stufe: 'gratis', dateien: { weg: 'webseite', erfassung: 'ja' } });
    const offen = (t: string) => t.split('\n').filter((x) => x.startsWith('Pflichtfragen offen:'));
    expect([zeilen, offen(a!.text)]).toEqual([zeilen, offen(e.text)]);
  }

  // verstanden_melden: Antwort von mcp auf die Antwort von flugschule, wie die Attrappe sie gibt
  const ab = morgen();
  const gemeldet = { mission: 'flugschule-11-idee', titel: 'Wohin die Reise geht', art: 'kontrollfrage', neu: true, am: new Date().toISOString(), wiederholungAb: ab, faellig: [] };
  const [v] = await attrappe([['verstanden_melden', { mission: 'flugschule-11-idee', art: 'kontrollfrage' }]]);
  expect(v).toEqual(await echt((m, p) => (m === 'POST' && ohneAbfrage(p) === '/cockpit/verstanden' ? { status: 200, body: gemeldet } : undefined), 'verstanden_melden', { mission: 'flugschule-11-idee', art: 'kontrollfrage' }));

  // Feste Sätze wörtlich: flugschule (lernen.ts, erfassung.ts, app.ts) und mcp (erfassen.ts); OHNE_WIEDERHOLUNG erst, wenn mcp es hat (w7-01)
  const quelle = (pfad: string) => readFileSync(`${albatros}/${pfad}`, 'utf8');
  const [lernen, erfassung, app, erfassen, mcpLernen] = ['services/flugschule/src/lernen.ts', 'services/flugschule/src/erfassung.ts', 'services/flugschule/src/app.ts',
    'services/mcp/src/erfassen.ts', 'services/mcp/src/lernen.ts'].map(quelle) as [string, string, string, string, string];
  const fest = await attrappe([['verstanden_melden', { mission: 'webseite-02-bauen', art: 'wiederholung' }], ['verstanden_melden', { mission: 'flugschule-11-idee', art: 'wiederholung' }],
    ['verstanden_melden', { mission: 'flugschule-99-gibts-nicht', art: 'selbst' }], ['verstanden_melden', { mission: 'webseite-02-bauen', art: 'selbst' }]]);
  expect([lernen.includes(fest[0]!.text), lernen.includes(fest[1]!.text), lernen.includes(`'${fest[2]!.text}'`)]).toEqual([true, true, true]);
  expect(lernen).toContain('Wiederholen geht ab ${tagCh(ab)}, vorher ist die Lektion noch frisch. Gespeichert ist nichts.');
  expect([erfassung.includes(FRAGE), erfassung.includes(NEIN), app.includes(BEIM_TEAM), erfassen.includes(GESPEICHERT)]).toEqual([true, true, true, true]);
  expect((await import(`${albatros}/services/mcp/src/erfassen.ts`)).COACH_ABO).toBe(COACH_ABO);
  if (mcpLernen.includes('OHNE_WIEDERHOLUNG')) expect(mcpLernen).toContain(fest[3]!.text.split('\n')[1]!);
  expect(INSEL_NAMEN_GLEICH(kit.INSEL_NAMEN as Record<string, string>, mock.slice(EINGABEN.length).map((x) => x.text))).toEqual([]);
}, 60_000);
// Jeder Schritt heisst in der Antwort der Attrappe wie in kit INSEL_NAMEN
function INSEL_NAMEN_GLEICH(namen: Record<string, string>, texte: string[]): string[] {
  return geladen.ok ? geladen.fahrplan.insel.flatMap((s, i) => (texte[i]?.includes(`«${namen[s]}» (${s}, Phase`) ? [] : [`${s}: ${texte[i] ?? 'keine Antwort'}`])) : [];
}
