// Test des Rezepts buchungen gegen ein echtes PocketBase (Version aus dem Dockerfile), mit einer Mail-Attrappe auf diesem Computer.
//   bun bausteine/pocketbase/rezepte/buchungen/test.ts      (lädt PocketBase einmal nach ~/.cache, prüft die Prüfsumme)
// Ist das Rezept eingebaut (bausteine/pocketbase/pb_hooks/buchungen.pb.js), prüft er die eingebauten Dateien, also genau das, was
// ins Netz geht. Sonst das Rezept selbst.
import { cpSync, existsSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { einstellen, lesbar, mailAttrappe, pocketbase, wurzelVon } from '../../programm.ts';

const hier = import.meta.dir, pb = wurzelVon(hier);
const eingebaut = existsSync(join(pb, 'pb_hooks', 'buchungen.pb.js'));
const tmp = mkdtempSync(join(tmpdir(), 'buchungen-'));
let fehler = 0;
const pruefe = (ok: unknown, was: string) => { console.log(`${ok ? '✓' : '✗'} ${was}`); if (!ok) fehler++; };

const mails: string[] = [];
const smtp = mailAttrappe((m) => mails.push(m));

const programm = await pocketbase(pb);
console.log(eingebaut ? 'Prüfe die eingebauten Dateien in bausteine/pocketbase.' : 'Prüfe das Rezept.');
mkdirSync(join(tmp, 'pb_migrations')); mkdirSync(join(tmp, 'pb_hooks'));
cpSync(join(pb, 'pb_migrations'), join(tmp, 'pb_migrations'), { recursive: true });
cpSync(join(eingebaut ? pb : hier, 'pb_hooks'), join(tmp, 'pb_hooks'), { recursive: true });
if (!eingebaut) cpSync(join(hier, 'pb_migrations'), join(tmp, 'pb_migrations'), { recursive: true });
const port = 18000 + Math.floor(Math.random() * 1000), api = `http://127.0.0.1:${port}/api`;
const passwort = crypto.randomUUID();
const env = { ...process.env, TZ: 'Europe/Zurich' };
const dirs = [`--dir=${join(tmp, 'pb_data')}`, `--migrationsDir=${join(tmp, 'pb_migrations')}`, `--hooksDir=${join(tmp, 'pb_hooks')}`];
Bun.spawnSync([programm, 'superuser', 'upsert', 'test@example.com', passwort, ...dirs], { env });
const server = Bun.spawn([programm, 'serve', `--http=127.0.0.1:${port}`, ...dirs], { env, stdout: 'ignore', stderr: 'pipe' });

try {
  for (let i = 0; i < 50 && !(await fetch(`${api}/health`).catch(() => null))?.ok; i++) await Bun.sleep(200);
  const { token } = await (await fetch(`${api}/collections/_superusers/auth-with-password`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identity: 'test@example.com', password: passwort }),
  })).json() as { token: string };
  const als = (t: string | null) => async (method: string, pfad: string, body?: unknown) => {
    const r = await fetch(`${api}${pfad}`, { method, headers: { 'content-type': 'application/json', ...(t ? { authorization: t } : {}) }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json().catch(() => null) as Record<string, any> };
  };
  const admin = als(token), gast = als(null);

  // Mails an die Attrappe, damit die Mails wirklich gebaut und gesendet werden
  await einstellen(api, token, smtp.port, 'https://yoga.example');

  const iso = (ms: number) => new Date(ms).toISOString().replace('T', ' ');
  const tag = 24 * 3600e3;
  const angebot = (await admin('POST', '/collections/angebote/records', { titel: 'Yoga am Abend', ort: 'Studio, Seestrasse 1', preis_hinweis: 'CHF 25, bar vor Ort', aktiv: true, buchungsschluss_min: 0 })).body.id;
  const termin = async (ab: number, plaetze: number) => (await admin('POST', '/collections/termine/records', { angebot, beginn: iso(ab), ende: iso(ab + 3600e3), plaetze })).body.id as string;
  // 3. Juli 2030, 17:00 UTC = 19:00 Uhr in Zürich (Sommerzeit)
  const voll = await termin(Date.UTC(2030, 6, 3, 17), 1), zwei = await termin(Date.now() + 2 * tag, 2), vorbei = await termin(Date.now() - tag, 5);
  const buchen = (t: string, mehr: object = {}) => gast('POST', '/collections/buchungen/records', { termin: t, anzahl: 1, name: 'Anna', email: `anna${Math.random()}@example.com`, ...mehr });

  const gleichzeitig = await Promise.all(Array.from({ length: 5 }, () => buchen(voll)));
  pruefe(gleichzeitig.map((r) => r.status).sort().join() === '200,400,400,400,400', `Letzter Platz, fünf gleichzeitig: genau eine Buchung (${gleichzeitig.map((r) => r.status)})`);
  pruefe(gleichzeitig.filter((r) => r.status === 400).every((r) => r.body.message === 'Dieser Termin ist inzwischen voll.'), 'Die anderen hören «Dieser Termin ist inzwischen voll.»');
  pruefe((await buchen(vorbei)).status === 400, 'Vergangener Termin: 400');
  const gefaelscht = await buchen(zwei, { status: 'storniert', code: 'x'.repeat(32) });
  pruefe(gefaelscht.status === 200 && gefaelscht.body.status === 'bestaetigt' && !('code' in gefaelscht.body), 'Status und Code kommen vom Server, der Code nie in der Antwort');
  pruefe((await buchen(zwei, { website: 'spam' })).status === 400, 'Honigtopf ausgefüllt: 400');
  pruefe((await buchen(zwei, { anzahl: 2 })).body.message === 'Für diesen Termin sind nur noch 1 Plätze frei.', 'Zu viele Plätze: sagt, wie viele frei sind');
  const doppelt = await buchen(zwei, { email: 'lea@example.com' });
  pruefe(doppelt.status === 200 && (await buchen(voll, { email: 'lea@example.com' })).status === 400 && (await buchen(zwei, { email: 'LEA@example.com' })).status === 400, 'Gleiche E-Mail zweimal: «schon angemeldet»');

  const frei = ((await gast('GET', '/collections/termine_frei/records?sort=beginn&perPage=500')).body.items as { id: string; frei: number }[]).filter((t) => [voll, zwei, vorbei].includes(t.id));
  pruefe(frei.length === 2 && frei.find((t) => t.id === voll)?.frei === 0 && frei.find((t) => t.id === zwei)?.frei === 0 && !frei.some((t) => t.id === vorbei), 'Sicht termine_frei: nur künftige Termine, freie Plätze stimmen');
  pruefe((await gast('GET', '/collections/buchungen/records')).status === 403, 'Buchungen sieht nur die Verwaltung');

  // Absagen per Link: Code steht nur in der Verwaltung und in der Mail
  const b = (await admin('GET', `/collections/buchungen/records?filter=${encodeURIComponent(`termin="${voll}"&&status="bestaetigt"`)}`)).body.items[0];
  const info = await gast('GET', `/buchungen/absagen/${b.code}`);
  pruefe(info.status === 200 && info.body.wann === 'Mi, 3. Juli 2030, 19:00–20:00 Uhr', `Absage-Seite zeigt die Zeit in Zürcher Zeit (${info.body.wann})`);
  pruefe((await gast('GET', `/buchungen/absagen/${'y'.repeat(32)}`)).status === 404, 'Falscher Code: 404');
  pruefe((await gast('POST', `/buchungen/absagen/${b.code}`)).body.status === 'storniert', 'Absagen per Link');
  const neu = await buchen(voll);
  pruefe(neu.status === 200, 'Danach ist der Platz wieder frei');
  const weg = await admin('PATCH', `/collections/buchungen/records/${neu.body.id}`, { status: 'storniert', grund: 'Doppelt gebucht.' });
  pruefe(weg.body.storniert_von === 'betrieb', 'Die Verwaltung storniert eine einzelne Buchung');

  // Die Verwaltung sagt den ganzen Termin ab
  await admin('PATCH', `/collections/termine/records/${zwei}`, { abgesagt: true, grund: 'Die Lehrerin ist krank.' });
  const rest = (await admin('GET', `/collections/buchungen/records?filter=${encodeURIComponent(`termin="${zwei}"`)}`)).body.items as { status: string; storniert_von: string }[];
  pruefe(rest.length === 2 && rest.every((r) => r.status === 'storniert' && r.storniert_von === 'betrieb'), 'Termin abgesagt: alle Buchungen storniert');

  // Wochenplan: jeden Montag 18:30, 75 Minuten, über die Umstellung auf Sommerzeit (30. März 2031)
  const plan = (await admin('POST', '/collections/wochenplan/records', { angebot, wochentag: 'mo', zeit: '18:30', dauer_min: 75, plaetze: 12, ab: '2031-03-10 00:00:00.000Z', bis: '2031-04-14 00:00:00.000Z', aktiv: true })).body;
  const ausPlan = async () => ((await admin('GET', `/collections/termine/records?perPage=100&sort=beginn&filter=${encodeURIComponent(`wochenplan="${plan.id}"`)}`)).body.items ?? []) as { id: string; beginn: string; ende: string; plaetze: number }[];
  let wp = await ausPlan();
  pruefe(wp.length === 6, `Wochenplan: sechs Montage vom 10. März bis 14. April 2031 (${wp.length})`);
  pruefe(wp.find((t) => t.beginn.startsWith('2031-03-24'))?.beginn === '2031-03-24 17:30:00.000Z' && wp.find((t) => t.beginn.startsWith('2031-03-31'))?.beginn === '2031-03-31 16:30:00.000Z',
    'Immer 18:30 Uhr Schweizer Zeit, vor und nach der Zeitumstellung');
  pruefe(wp.every((t) => t.plaetze === 12 && new Date(t.ende.replace(' ', 'T')).getTime() - new Date(t.beginn.replace(' ', 'T')).getTime() === 75 * 60000), 'Plätze und Dauer aus dem Plan');
  const gebucht = await buchen(wp[0]!.id);
  await admin('PATCH', `/collections/wochenplan/records/${plan.id}`, { zeit: '19:00' });
  wp = await ausPlan();
  pruefe(wp.length === 6 && wp.filter((t) => t.beginn.endsWith('17:30:00.000Z')).length === 1 && wp.find((t) => t.id === gebucht.body.termin),
    'Neue Zeit gilt für Termine ohne Buchung, der gebuchte bleibt');
  await admin('PATCH', `/collections/wochenplan/records/${plan.id}`, { aktiv: false });
  wp = await ausPlan();
  pruefe(wp.length === 1 && wp[0]!.id === gebucht.body.termin, 'Kurs beendet: Termine ohne Buchung fallen weg, der gebuchte bleibt');

  // Buchungsschluss in Minuten: 30 Minuten vor Beginn ist Schluss
  const knapp = (await admin('POST', '/collections/angebote/records', { titel: 'Knapp', aktiv: true, buchungsschluss_min: 30 })).body.id;
  const inZwanzig = (await admin('POST', '/collections/termine/records', { angebot: knapp, beginn: iso(Date.now() + 20 * 60000), ende: iso(Date.now() + 80 * 60000), plaetze: 5 })).body.id;
  const inVierzig = (await admin('POST', '/collections/termine/records', { angebot: knapp, beginn: iso(Date.now() + 40 * 60000), ende: iso(Date.now() + 100 * 60000), plaetze: 5 })).body.id;
  pruefe((await buchen(inZwanzig)).status === 400 && (await buchen(inVierzig)).status === 200, 'Buchungsschluss 30 Minuten: in 20 Minuten zu spät, in 40 Minuten geht es');

  await Bun.sleep(500);
  // quoted-printable zurück in Text (Betreffzeilen bleiben kodiert, darum prüfen wir den Inhalt)
  const text = mails.map(lesbar).join('\n');
  pruefe(mails.length === 17, `Mails: je Buchung zwei, Absage per Link zwei, Absage durch die Verwaltung je eine (${mails.length})`);
  pruefe(text.includes('Dein Platz ist gebucht.') && text.includes('?absagen=') && text.includes('19:00–20:00 Uhr') && text.includes('hat gebucht.'), 'Bestätigung mit Absage-Link und Meldung an den Betrieb');
  pruefe(text.includes('Die Lehrerin ist krank.') && text.includes('Doppelt gebucht.'), 'Absage durch die Verwaltung nennt den Grund');
} finally {
  server.kill();
  smtp.stop(true);
  const log = await new Response(server.stderr).text();
  if (fehler && log.trim()) console.log(log.slice(-2000));
}
console.log(fehler ? `\n${fehler} Prüfungen fehlgeschlagen` : '\nAlles grün');
process.exit(fehler ? 1 : 0);
