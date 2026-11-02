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
// Antwort von JSON-RPC als Ergebnis: ein Fehler von JSON-RPC (unbekanntes Werkzeug, unbekannte Methode) als «JSON-RPC <code>: <message>»
type Rpc = { result?: { content: { text: string }[]; isError?: boolean }; error?: { code: number; message: string } };
const alsErgebnis = (m: Rpc): Ergebnis => (m.result ? { fehler: m.result.isError === true, text: m.result.content[0]!.text } : { fehler: true, text: `JSON-RPC ${m.error?.code}: ${m.error?.message}` });
async function attrappe(aufrufe: [string, unknown][], o: { stufe?: string; dateien?: Record<string, string>; methode?: string; bauservice?: boolean } = {}): Promise<Ergebnis[]> {
  const hafen = mkdtempSync(join(ordner, 'hafen-'));
  for (const [d, w] of Object.entries(o.dateien ?? {})) writeFileSync(join(hafen, d), w);
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith('DURCHSPIEL_')));
  const p = Bun.spawn(['bun', join(wurzel, 'scripts/durchspiel/mock-mcp.ts')], {
    cwd: wurzel, stdin: 'pipe', stdout: 'pipe', stderr: 'ignore',
    env: { ...env, DURCHSPIEL_HAFEN: hafen, DURCHSPIEL_STUFE: o.stufe ?? 'light', ...(o.bauservice ? { DURCHSPIEL_BAUSERVICE: 'on' } : {}) },
  });
  p.stdin.write(`${aufrufe.map(([name, a], i) => JSON.stringify({ jsonrpc: '2.0', id: i + 1, method: o.methode ?? 'tools/call', params: { name, arguments: a } })).join('\n')}\n`);
  p.stdin.end();
  const aus = (await new Response(p.stdout).text()).trim().split('\n').map((z) => alsErgebnis(JSON.parse(z) as Rpc));
  await p.exited;
  return aus;
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

// Nachbesserung Welle 7 (01.11.2026, Gegenprobe zu sicht-05): Die Attrappe prüfte nur die oberste Ebene wie zod. Erwartet ist hier, was das
// echte mcp (zod 4.6.7) am 01.11.2026 geantwortet hat (albatros 2f35816 und albatros-w7 31b9dcf gleich; Nachstellung im Scratch
// welle7/skills/runde2/sicht-05). Läuft auch ohne albatros daneben (CI); der Vergleich unten prüft jedes Feld gegen das echte mcp.
test('Attrappe: verschachtelte Eingaben, Listen, null und unbekannte Werkzeuge wie das echte mcp', async () => {
  const beleg = (x: Record<string, unknown>) => ({ belege: [{ datei: 'docs/projekt.md', zeilen: [], ...x }] });
  const r = await attrappe([
    ['lage', beleg({ zeilen: ['x'.repeat(301)] })], ['lage', beleg({ datei: '' })], ['lage', { belege: [{ datei: 'docs/projekt.md' }] }],
    ['lage', beleg({ zeilen: Array(51).fill('x') })], ['lage', beleg({ datei: 'd'.repeat(201) })], ['lage', { belege: [beleg({ zeilen: Array(51).fill(5) }).belege[0], null] }],
    ['lage', { belege: 'x'.repeat(31) }], ['lage', []], ['domain_suchen', { wuensche: [] }], ['domain_suchen', { wuensche: ['x'.repeat(64)] }],
    ['domain_suchen', { wuensche: ['😀'.repeat(64)] }], ['domain_suchen', { wuensche: ['😀'.repeat(63)] }], ['schritt_melden', { schritt: 'idee', titel: null }],
    ['schritt_melden', { schritt: 'idee', titel: [] }], ['verstanden_melden', { mission: null, art: 'selbst' }], ['upgrade_link', { stufe: null }], ['gibts_nicht', {}],
  ]);
  expect(r).toEqual([
    { fehler: true, text: 'Ungültige Angaben: belege.0.zeilen.0: Too big: expected string to have <=300 characters' },
    { fehler: true, text: 'Ungültige Angaben: belege.0.datei: Too small: expected string to have >=1 characters' },
    { fehler: true, text: 'Ungültige Angaben: belege.0.zeilen: Invalid input: expected array, received undefined' },
    { fehler: true, text: 'Ungültige Angaben: belege.0.zeilen: Too big: expected array to have <=50 items' },
    { fehler: true, text: 'Ungültige Angaben: belege.0.datei: Too big: expected string to have <=200 characters' },
    { fehler: true, text: 'Ungültige Angaben: belege.0.zeilen: Too big: expected array to have <=50 items, belege.1: Invalid input: expected object, received null' },
    { fehler: true, text: 'Ungültige Angaben: belege: Invalid input: expected array, received string, belege: Too big: expected string to have <=30 characters' },
    { fehler: true, text: 'Ungültige Angaben: Eingabe: Invalid input: expected object, received array' },
    { fehler: true, text: 'Ungültige Angaben: wuensche: Too small: expected array to have >=1 items' },
    { fehler: true, text: 'Ungültige Angaben: wuensche.0: Too big: expected string to have <=63 characters' },
    { fehler: true, text: 'Ungültige Angaben: wuensche.0: Too big: expected string to have <=63 characters' },
    { fehler: false, text: expect.stringMatching(/^Frei \(Preis pro Jahr/) },
    { fehler: true, text: 'Ungültige Angaben: titel: Invalid input: expected string, received null' },
    { fehler: true, text: 'Ungültige Angaben: titel: Invalid input: expected string, received array, titel: Too small: expected array to have >=1 items' },
    { fehler: true, text: 'Ungültige Angaben: mission: Invalid input: expected string, received null' },
    { fehler: true, text: 'Ungültige Angaben: stufe: Invalid option: expected one of "light"|"pilot"' },
    { fehler: true, text: 'JSON-RPC -32602: Unbekanntes Werkzeug: gibts_nicht' },
  ]);
  expect(await attrappe([['', {}]], { methode: 'resources/list' })).toEqual([{ fehler: true, text: 'JSON-RPC -32601: Unbekannte Methode: resources/list' }]);
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
const mitAlbatros = existsSync(`${albatros}/services/mcp/scripts/lage-attrappen.ts`);
type Antworten = (m: string, p: string, b: unknown) => { status: number; body: unknown } | undefined;
// Das echte mcp (createApp) mit FAHRPLAN und ERFASSUNG; flugschule und konto antworten zum Schein (antworten, sonst 404)
async function echtesMcp() {
  const kit: Record<string, unknown> = await import(`${albatros}/packages/kit/src/index.ts`);
  const mcp: Record<string, unknown> = await import(`${albatros}/services/mcp/src/app.ts`);
  const createApp = mcp.createApp as (deps: Record<string, unknown>) => { request: (pfad: string, init: RequestInit) => Promise<Response> };
  const schalter = { ...(kit.ALLE_AUS as Record<string, boolean>), FAHRPLAN: true, ERFASSUNG: true };
  const app = (antworten: Antworten) => createApp({
    resource: 'https://mcp.albatros.build', issuer: 'https://clerk.albatros.test', schalter, erfassung: null, limit: null,
    ctx: () => ({ methoden: [], schalter, rufe: async (_d: string, m: string, p: string, b?: unknown) => antworten(m, p, b) ?? { status: 404, body: { error: 'Nicht gefunden.' } } }),
    verifyToken: async () => ({ subject: 'user_anna', aud: ['https://mcp.albatros.build'], revoked: false, expired: false }),
  });
  const rufe = async (a: ReturnType<typeof app>, name: string, args: unknown): Promise<Ergebnis> => {
    const r = await a.request('/', { method: 'POST', headers: { authorization: 'Bearer attrappe', 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) });
    return alsErgebnis((await r.json()) as Rpc);
  };
  return { kit, app, rufe, echt: (antworten: Antworten, name: string, args: unknown) => rufe(app(antworten), name, args) };
}
test.skipIf(!mitAlbatros)('Attrappe gegen das echte mcp: gleiche Antworten, feste Sätze wörtlich aus albatros', async () => {
  const { kit, echt } = await echtesMcp();
  const { ZUSTAENDE } = (await import(`${albatros}/services/mcp/scripts/lage-attrappen.ts`)) as { ZUSTAENDE: Record<string, { antworten: Record<string, { status: number; body: unknown }>; eingabe: Record<string, unknown> }> };
  // Die Antworten zum Schein unten erkennen den Weg ohne Abfrage: mcp hängt je nach Stand ?sprache=… an (albatros Welle 7, sicht-06: POST
  // /cockpit/verstanden?sprache=de; vorher ohne). Nachbesserung 01.11.2026: Der Vergleich wurde gegen albatros-w7 rot («Nicht gefunden.»),
  // obwohl die Attrappe gleich antwortete. Die Zustände von lage-attrappen.ts tragen die Abfrage im Schlüssel und gelten weiter genau.
  const ohneAbfrage = (p: string) => p.split('?')[0]!;
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
// Grenzwerte jedes Felds jedes Werkzeugs, das die Attrappe anbietet (aus ihrem tools/list erzeugt, auch in Listen und Objekten darin), gegen
// das echte mcp: Lehnt eines der beiden ab, lehnen beide ab, mit demselben Text (Nachbesserung Welle 7, 01.11.2026, Gegenprobe zu sicht-05:
// Die Attrappe prüfte nur die oberste Ebene wie zod; 10 von 29 Grenzfällen der Gegenprobe antworteten anders). Nimmt beides an, vergleicht
// der Test nicht: Die Antworten hängen dann am Zustand und an flugschule und konto zum Schein.
type Knoten = { type?: string; enum?: unknown[]; minLength?: number; maxLength?: number; pattern?: string; minItems?: number; maxItems?: number;
  items?: Knoten; properties?: Record<string, Knoten>; required?: string[] };
const gueltig = (s: Knoten): unknown => (s.enum ? s.enum[0] : s.type === 'object' ? Object.fromEntries((s.required ?? []).map((k) => [k, gueltig(s.properties?.[k] ?? {})]))
  : s.type === 'array' ? Array.from({ length: s.minItems ?? 0 }, () => gueltig(s.items ?? {})) : s.type === 'boolean' ? true : 'a'.repeat(Math.max(s.minLength ?? 1, 1)));
const FALSCH: unknown[] = [null, 5, 1.5, true, {}, [], 'x', ['a'], { length: 400 }];
function varianten(s: Knoten): unknown[] {
  if (s.enum) return [...FALSCH, 'gibts-nicht', String(s.enum[0]).toUpperCase(), ` ${String(s.enum[0])}`];
  if (s.type === 'string') {
    const grenzen = [s.minLength, s.maxLength].filter((n): n is number => n !== undefined);
    return [...FALSCH, '', ' ', 'A', 'Ab', 'a\nb', 'a\tb', '\u007f', '\u2028', ' a ', 'a b', '-a', 'a_b', 'ä', '😀', '🇨🇭', ...grenzen.flatMap((n) => [
      'a'.repeat(Math.max(n - 1, 0)), 'a'.repeat(n), 'a'.repeat(n + 1), '😀'.repeat(n), '😀'.repeat(n + 1), ` ${'a'.repeat(n)} `, `${'a'.repeat(n)}\n`,
      'A'.repeat(n + 1), Array(n + 1).fill('a'), Array(n).fill('a')])];
  }
  if (s.type === 'array') {
    const ok = gueltig(s.items ?? {});
    const grenzen = [s.minItems, s.maxItems].filter((n): n is number => n !== undefined);
    return [...FALSCH, [null], [ok, null], [5, ok], 'x'.repeat((s.maxItems ?? 2) + 1), ...grenzen.flatMap((n) => [Array(Math.max(n - 1, 0)).fill(ok),
      Array(n).fill(ok), Array(n + 1).fill(ok), Array(n + 1).fill(null), [...Array(Math.max(n - 1, 0)).fill(ok), null], [...Array(n).fill(ok), 5]])];
  }
  return s.type === 'boolean' ? [...FALSCH, 'ja', 0] : FALSCH;
}
function faelle(schema: Knoten): unknown[] {
  const aus: unknown[] = [];
  const feld = (s: Knoten, setze: (v: unknown) => unknown) => {
    aus.push(setze(gueltig(s)));
    for (const v of varianten(s)) aus.push(setze(v));
    if (s.type === 'array' && s.items) feld(s.items, (v) => setze([v]));
    if (s.type === 'object') {
      const basis = gueltig(s) as Record<string, unknown>;
      for (const [k, p] of Object.entries(s.properties ?? {})) {
        aus.push(setze(Object.fromEntries(Object.entries(basis).filter(([x]) => x !== k))));
        feld(p, (v) => setze({ ...basis, [k]: v }));
      }
    }
  };
  feld(schema, (v) => v);
  return [...new Map(aus.map((a) => [JSON.stringify(a), a])).values()];
}
test.skipIf(!mitAlbatros)('Attrappe gegen das echte mcp: Grenzwerte jedes Felds jedes Werkzeugs, abgelehnt mit denselben Meldungen wie zod', async () => {
  const { app, rufe } = await echtesMcp();
  const echt = app(() => undefined);
  const p = Bun.spawn(['bun', join(wurzel, 'scripts/durchspiel/mock-mcp.ts')], { cwd: wurzel, stdin: 'pipe', stdout: 'pipe', stderr: 'ignore' });
  p.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' })}\n`);
  p.stdin.end();
  const { tools } = (JSON.parse(await new Response(p.stdout).text()) as { result: { tools: { name: string; inputSchema: Knoten }[] } }).result;
  await p.exited;
  const liste: [string, unknown][] = [...tools.flatMap((t) => faelle(t.inputSchema).map((a) => [t.name, a] as [string, unknown])), ['gibts_nicht', {}], ['', {}]];
  const mock = await attrappe(liste);
  const abgelehnt = (x: Ergebnis) => x.text.startsWith('Ungültige Angaben') || x.text.startsWith('JSON-RPC');
  const abweichend: string[] = [];
  let verglichen = 0;
  for (const [i, [name, args]] of liste.entries()) {
    const e = await rufe(echt, name, args).catch((err: unknown) => ({ fehler: true, text: `Absturz: ${String(err)}` }));
    const m = mock[i] ?? { fehler: true, text: '(keine Antwort)' };
    if (!abgelehnt(e) && !abgelehnt(m)) continue;
    verglichen++;
    if (e.fehler !== m.fehler || e.text !== m.text) abweichend.push(`${name} ${JSON.stringify(args).slice(0, 160)}\n  echt:     ${e.text.slice(0, 300)}\n  attrappe: ${m.text.slice(0, 300)}`);
  }
  expect(abweichend).toEqual([]);
  // Gezählt am 01.11.2026: 26 Werkzeuge, 1505 Fälle, 1012 lehnen beide ab. Sinkt das stark, prüft der Test weniger, als er sagt
  expect(tools.length).toBeGreaterThan(20);
  expect(verglichen).toBeGreaterThan(900);
}, 120_000);

// Jeder Schritt heisst in der Antwort der Attrappe wie in kit INSEL_NAMEN
function INSEL_NAMEN_GLEICH(namen: Record<string, string>, texte: string[]): string[] {
  return geladen.ok ? geladen.fahrplan.insel.flatMap((s, i) => (texte[i]?.includes(`«${namen[s]}» (${s}, Phase`) ? [] : [`${s}: ${texte[i] ?? 'keine Antwort'}`])) : [];
}

// ———— Bauservice (Nachbesserung 02.11.2026, Gegenprobe skills): Attrappe mit DURCHSPIEL_BAUSERVICE=on gegen das echte mcp mit BAUSERVICE ————
// Läuft, wenn albatros den Bauservice hat (services/mcp/src/bauservice.ts, seit Welle 8). Gleiche Zustände, gleiche Zeilen von lage (Jetzt dran,
// Angebot, Danach, Hinweise, der Teil des Stands mit der Phase), gleiches konto_status zum Bauservice und gleiches auftrag_anlegen. Vorher wich die
// Attrappe ab: «Danach» P6 statt der Übergabe, «Phase P6» im Stand, «danach Light» auch mit Light, bestaetigt nur true.
const mitBauservice = existsSync(`${albatros}/services/mcp/src/bauservice.ts`);
test.skipIf(!mitBauservice)('Bauservice: Attrappe wie lage, konto_status und auftrag_anlegen im echten mcp, in jedem Zustand', async () => {
  const kit: Record<string, unknown> = await import(`${albatros}/packages/kit/src/index.ts`);
  const mcp: Record<string, unknown> = await import(`${albatros}/services/mcp/src/app.ts`);
  const { ZUSTAENDE } = (await import(`${albatros}/services/mcp/scripts/lage-attrappen.ts`)) as { ZUSTAENDE: Record<string, { antworten: Record<string, { status: number; body: unknown }> }> };
  const createApp = mcp.createApp as (deps: Record<string, unknown>) => { request: (pfad: string, init: RequestInit) => Promise<Response> };
  const schalter = { ...(kit.ALLE_AUS as Record<string, boolean>), FAHRPLAN: true, ERFASSUNG: true, BAUSERVICE: true };
  type A = Record<string, { status: number; body: unknown }>;
  const echt = async (antworten: A, name: string, args: unknown): Promise<Ergebnis> => {
    const app = createApp({ resource: 'https://mcp.albatros.build', issuer: 'https://clerk.albatros.test', schalter, erfassung: null, limit: null,
      ctx: () => ({ methoden: [], schalter, rufe: async (_d: string, m: string, p: string) => antworten[`${m} ${p}`] ?? antworten[`${m} ${p.split('?')[0]}`] ?? { status: 404, body: { error: 'Nicht gefunden.' } } }),
      verifyToken: async () => ({ subject: 'user_anna', aud: ['https://mcp.albatros.build'], revoked: false, expired: false }) });
    const r = await app.request('/', { method: 'POST', headers: { authorization: 'Bearer attrappe', 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name, arguments: args } }) });
    return alsErgebnis((await r.json()) as Rpc);
  };
  const basis = ZUSTAENDE['gratis-ohne-projekt']!.antworten;
  const ich = (stufe: string) => {
    const b = basis['GET /cockpit/ich']!.body as Record<string, unknown>;
    const leistung = { ...(b.leistung as object), server: stufe === 'pilot', seite: stufe !== 'gratis', bisPhase: stufe === 'gratis' ? 'P10' : null, preisChfMonat: stufe === 'light' ? 15 : stufe === 'pilot' ? 40 : 0 };
    return { status: 200, body: { ...b, stufe, leistung, abo: stufe === 'gratis' ? null : { stufe, status: 'active', bis: null, kuendigtZumEnde: false } } };
  };
  const projekt = (extra: string[] = []) => ({ datei: 'docs/projekt.md', zeilen: ['Projektname: Stiel und Blatt', 'In einem Satz: Blumenladen', 'Für wen: Quartier', 'Hauptsache: Strauss anfragen', 'Erfolg: drei Anfragen pro Woche', 'Bestehende Seite: keine', 'Modus: machen', ...extra] });
  const recherche = { datei: 'docs/recherche.md', zeilen: ['Vorbilder: a, b, c', 'Übernehmen: klare Preise', 'Vermeiden: Popups', 'Pflichten: Impressum, Datenschutz', 'Inhalte vorhanden: Fotos', 'Suchbegriffe: Blumen Testwil'] };
  const plan = (setup: string) => ({ datei: 'docs/plan.md', zeilen: ['Seiten: Start, Angebot, Kontakt, Impressum, Datenschutz', 'Funktionen: Hauptsache «Strauss anfragen»: Mail; Bestätigung: Mail; Fehler: nochmals', 'Zugang: alles öffentlich', 'Sprachen: Deutsch', `Setup: ${setup}`, 'Testing: Anfrage kommt an', 'Release: Mai 2027', 'Pflege: selbst, monatlich', 'Bestätigt: 01.11.2026, «Ja»'] });
  const pruefung = { datei: 'docs/plan-pruefung.md', zeilen: ['Geprüft am: 01.11.2026', 'Zweite Meinung: zehn Punkte ok'] };
  const konzept = { datei: 'docs/konzept.md', zeilen: ['Name: Stiel und Blatt', 'Ton: du, herzlich', 'Charakter: frisch, verspielt, persönlich', 'Maskottchen: nein', 'Muss bleiben: Logo mit Blatt', 'Kern: frische Blumen', 'Bildsprache: hell'] };
  const P4 = ['idee', 'recherche', 'plan', 'plan-geprueft'], P5 = [...P4, 'konzept'];
  const STATISCH = 'statisch, Seite ohne eigene Dienste';
  const ALBATROS = 'Bauen lassen: albatros (01.11.2026)';
  type Fall = { name: string; stufe?: string; belege: object[]; schritte: string[]; auftrag?: string; stuecke?: string[]; modus?: string };
  const FAELLE: Fall[] = [
    { name: 'R1 Angebot, Gratis', belege: [projekt(), recherche, plan(STATISCH), pruefung], schritte: P4 },
    { name: 'R1 Angebot, Light', stufe: 'light', belege: [projekt(), recherche, plan(STATISCH), pruefung], schritte: P4 },
    { name: 'Pilot: kein Angebot', stufe: 'pilot', belege: [projekt(), recherche, plan(STATISCH), pruefung], schritte: P4 },
    { name: 'Setup [Annahme: statisch …]', belege: [projekt(), recherche, plan(`[Annahme: ${STATISCH}]`), pruefung], schritte: P4 },
    { name: 'Setup baustein', belege: [projekt(), recherche, plan('baustein, Anmeldeliste'), pruefung], schritte: P4 },
    { name: 'Modus lernen', belege: [projekt(), recherche, plan(STATISCH), pruefung], schritte: P4, modus: 'lernen' },
    { name: 'P5 mit albatros: Danach die Übergabe', belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung], schritte: P4 },
    { name: 'R1b Übergabe', belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung, konzept], schritte: P5 },
    { name: '[Annahme: albatros] ist keine Wahl', belege: [projekt(['Bauen lassen: [Annahme: albatros]']), recherche, plan(STATISCH), pruefung, konzept], schritte: P5 },
    { name: 'Pilot: keine Übergabe', stufe: 'pilot', belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung, konzept], schritte: P5 },
    ...['briefing', 'gewaehlt', 'im_bau', 'bezahlt'].map((auftrag) => ({ name: `R2 ${auftrag}`, belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung, konzept], schritte: P5, auftrag })),
    { name: 'R2 vorschlaege', belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung, konzept], schritte: P5, auftrag: 'vorschlaege', stuecke: ['mockup', 'entwurf-1'] },
    { name: 'R2 vorschau, Gratis', belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung, konzept], schritte: P5, auftrag: 'vorschau', stuecke: ['vorschau'] },
    { name: 'R2 vorschau, Light', stufe: 'light', belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung, konzept], schritte: P5, auftrag: 'vorschau', stuecke: ['vorschau'] },
    { name: 'R4 zurückgezogen mit albatros', belege: [projekt([ALBATROS]), recherche, plan(STATISCH), pruefung, konzept], schritte: P5, auftrag: 'zurueckgezogen' },
  ];
  const zeilen = (t: string) => t.split('\n').filter((z) => /^(Jetzt dran|Angebot|Danach|Hinweis):/.test(z)).concat(t.split('\n').filter((z) => z.startsWith('Stand:')).map((z) => z.split(' · ').at(-1)!));
  const anders: string[] = [];
  for (const f of FAELLE) {
    const stufe = f.stufe ?? 'gratis';
    const preis = { einmaligChf: 290, aboChfMonat: stufe === 'gratis' ? 15 : null };
    const auftraege = f.auftrag ? [{ nr: 1, status: f.auftrag, preis, stuecke: (f.stuecke ?? []).map((stueck) => ({ stueck })) }] : [];
    const antworten: A = { ...basis, 'GET /cockpit/ich': ich(stufe), 'GET /cockpit/erfassung': { status: 200, body: { erfassung: 'ja', anfragen: 'offen' } },
      'GET /cockpit/insel': { status: 200, body: { projekte: [{ projekt: 'projekt', titel: 'Stiel und Blatt', schritt: f.schritte.at(-1), am: '2026-11-01T10:00:00Z' }], gesehen: null } },
      'GET /cockpit/auftraege': { status: 200, body: auftraege }, 'GET /web/auftrag': { status: 200, body: { einmaligChf: 290, aboChfMonat: 15 } } };
    const args = { skills_stand: STAND, modus: f.modus ?? 'machen', belege: f.belege };
    const e = await echt(antworten, 'lage', args);
    const ek = await echt(antworten, 'konto_status', {});
    const dateien: Record<string, string> = { weg: 'webseite', erfassung: 'ja', ...(stufe !== 'gratis' ? { abo: stufe } : {}), ...(f.auftrag ? { auftrag: f.auftrag } : {}) };
    const m = await attrappe([...f.schritte.map((s) => ['schritt_melden', { schritt: s, titel: 'Stiel und Blatt', sprache: 'de' }] as [string, unknown]), ['lage', args], ['konto_status', {}]], { stufe, dateien, bauservice: true });
    const [ml, mk] = m.slice(-2) as [Ergebnis, Ergebnis];
    if (JSON.stringify(zeilen(ml.text)) !== JSON.stringify(zeilen(e.text))) anders.push(`${f.name}, lage:\n  echt:     ${zeilen(e.text).join(' | ')}\n  attrappe: ${zeilen(ml.text).join(' | ')}`);
    const bau = (t: string) => t.split(/(?<=\.)\s+|\n/).filter((z) => /Auftrag bei Albatros|Albatros baut deine Seite|einmalig|Im Cockpit: https/.test(z)).join(' ');
    if (bau(mk.text) !== bau(ek.text)) anders.push(`${f.name}, konto_status:\n  echt:     ${bau(ek.text)}\n  attrappe: ${bau(mk.text)}`);
  }
  // auftrag_anlegen: ohne Ja, ohne bestaetigt, falscher Typ, angelegt, zweiter offener Auftrag, zu lang, nur Leerzeichen
  const B = { name: 'Stiel und Blatt', wofuer: 'Blumenladen', fuerWen: 'Quartier', seiten: 'Start, Kontakt', stil: 'frisch' };
  const ANLEGEN: unknown[] = [{ ...B, bestaetigt: false }, B, { ...B, bestaetigt: 'true' }, { ...B, bestaetigt: true }, { ...B, bestaetigt: true },
    { ...B, bestaetigt: true, material: 'x'.repeat(4001) }, { ...B, bestaetigt: true, name: '   ' }, { ...B, bestaetigt: true, adresse: 'y'.repeat(301) }];
  let offen = false;
  const antworten = (m: string, p: string): { status: number; body: unknown } | undefined => {
    if (m === 'POST' && p === '/cockpit/auftraege') { if (offen) return { status: 409, body: { error: 'Du hast schon einen offenen Auftrag.' } }; offen = true; return { status: 200, body: { nr: 1, status: 'briefing', preis: { einmaligChf: 290, aboChfMonat: 15 } } }; }
    if (m === 'GET' && p === '/cockpit/ich') return { status: 200, body: { sprache: 'de' } };
    return undefined;
  };
  const erwartet: Ergebnis[] = [];
  for (const a of ANLEGEN) erwartet.push(await echt(new Proxy({}, { get: (_t, k: string) => { const [m, ...p] = k.split(' '); return antworten(m!, p.join(' ')); } }) as A, 'auftrag_anlegen', a));
  const mock = await attrappe(ANLEGEN.map((a) => ['auftrag_anlegen', a] as [string, unknown]), { stufe: 'gratis', bauservice: true });
  ANLEGEN.forEach((a, i) => { if (JSON.stringify(mock[i]) !== JSON.stringify(erwartet[i])) anders.push(`auftrag_anlegen ${JSON.stringify(a).slice(0, 80)}:\n  echt:     ${erwartet[i]!.text}\n  attrappe: ${mock[i]!.text}`); });
  expect(anders).toEqual([]);
}, 120_000);

// Der Betrag eines Auftrags in der Attrappe (sie ist im Durchspiel auch konto) wie in albatros: services/konto/src/stufen.ts AUFTRAG.preisChf und
// der Preis von Light (Nachbesserung 02.11.2026: vorher stand er fest in punkte.ts, ohne Abgleich)
test.skipIf(!mitBauservice)('Bauservice: Beträge der Attrappe wie konto stufen.ts', async () => {
  const stufen = (await import(`${albatros}/services/konto/src/stufen.ts`)) as { AUFTRAG: { preisChf: number }; LEISTUNG: Record<string, { preisChfMonat: number }> };
  const quelle = readFileSync(join(wurzel, 'scripts/durchspiel/mock-mcp.ts'), 'utf8');
  expect(Number(/const AUFTRAG_CHF = (\d+);/.exec(quelle)?.[1])).toBe(stufen.AUFTRAG.preisChf);
  expect(Number(/const PREIS: Record<string, number> = \{ light: (\d+), pilot: (\d+) \};/.exec(quelle)?.[1])).toBe(stufen.LEISTUNG.light!.preisChfMonat);
});
