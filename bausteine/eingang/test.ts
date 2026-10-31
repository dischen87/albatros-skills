// Test des Eingangs: der echte Dienst (eingang.ts als eigener Prozess) vor einem echten PocketBase (Version aus
// bausteine/pocketbase/Dockerfile, mit den Rezepten mitglieder und eingang) und vor Teilen zum Schein, die zeigen, was bei ihnen ankommt.
//   bun bausteine/eingang/test.ts      (lädt PocketBase einmal nach ~/.cache, prüft die Prüfsumme)
// Ist der Eingang eingebaut (bausteine/pocketbase/pb_hooks/eingang.pb.js), prüft er die eingebauten Dateien von PocketBase, sonst die
// Rezepte mitglieder und eingang. eingang.json prüft er nicht, er baut sich eigene Teile.
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { einstellen, mailAttrappe, pocketbase, wurzelVon } from '../pocketbase/programm.ts';
import { GRENZEN } from './eingang.ts';

const hier = import.meta.dir, pb = wurzelVon(join(hier, '..', 'pocketbase'));
const eingebaut = existsSync(join(pb, 'pb_hooks', 'eingang.pb.js'));
const tmp = mkdtempSync(join(tmpdir(), 'eingang-'));
let fehler = 0;
const pruefe = (ok: unknown, was: string) => { console.log(`${ok ? '✓' : '✗'} ${was}`); if (!ok) fehler++; };
const ADRESSE = 'verein.example', EIGEN = `https://${ADRESSE}`;

// PocketBase mit den Rezepten
const programm = await pocketbase(pb);
console.log(eingebaut ? 'Prüfe die eingebauten Dateien in bausteine/pocketbase.' : 'Prüfe die Rezepte mitglieder und eingang.');
mkdirSync(join(tmp, 'pb_migrations')); mkdirSync(join(tmp, 'pb_hooks'));
cpSync(join(pb, 'pb_migrations'), join(tmp, 'pb_migrations'), { recursive: true });
if (eingebaut) cpSync(join(pb, 'pb_hooks'), join(tmp, 'pb_hooks'), { recursive: true });
else for (const r of [join(pb, 'rezepte', 'mitglieder'), hier]) for (const d of ['pb_migrations', 'pb_hooks']) cpSync(join(r, d), join(tmp, d), { recursive: true });
const pbPort = 18000 + Math.floor(Math.random() * 1000), api = `http://127.0.0.1:${pbPort}/api`;
const passwort = crypto.randomUUID();
const dirs = [`--dir=${join(tmp, 'pb_data')}`, `--migrationsDir=${join(tmp, 'pb_migrations')}`, `--hooksDir=${join(tmp, 'pb_hooks')}`];
Bun.spawnSync([programm, 'superuser', 'upsert', 'test@example.com', passwort, ...dirs]);
const server = Bun.spawn([programm, 'serve', `--http=127.0.0.1:${pbPort}`, ...dirs], { stdout: 'ignore', stderr: 'pipe' });
let mails = 0;
const smtp = mailAttrappe(() => { mails++; });

// Teile zum Schein: zeigen, was ankommt, und versuchen selbst Kopfzeilen und die Sitzung zu setzen
type Gesehen = { pfad: string; kopf: Record<string, string>; bytes: number };
const gesehen: Gesehen[] = [];
const teil = Bun.serve({
  port: 0,
  maxRequestBodySize: 100 * 1024 * 1024,
  async fetch(r) {
    const u = new URL(r.url);
    const bytes = r.method === 'POST' ? (await r.arrayBuffer().catch(() => null))?.byteLength ?? -1 : 0;
    gesehen.push({ pfad: u.pathname + u.search, kopf: Object.fromEntries(r.headers), bytes });
    const h = new Headers({ 'content-type': 'application/json', 'x-eingang-rolle': 'verwaltung' });
    h.append('set-cookie', '__Host-sitzung=gefaelscht; Path=/; Secure; HttpOnly');
    // Browser lesen den Namen ohne Leerzeichen und Tab vor dem «=» (RFC 6265, 5.2): das wäre ebenfalls die Sitzung
    h.append('set-cookie', '__Host-sitzung =mit-leerzeichen; Path=/; Secure; HttpOnly');
    h.append('set-cookie', '__Host-sitzung\t=mit-tab; Path=/; Secure; HttpOnly');
    h.append('set-cookie', '__HOST-Sitzung=gross; Path=/; Secure; HttpOnly');
    h.append('set-cookie', 'sprache=de; Path=/');
    return new Response(JSON.stringify({ pfad: u.pathname }), { headers: h });
  },
});
const haengt = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch: () => new Promise<Response>(() => {}) }); // PocketBase, das nie antwortet
// Ein Teil, der sich Zeit lässt: /langsam/<Sekunden> antwortet nach so vielen Sekunden, /langsam/halten erst, wenn der Test loslässt
let loslassen = () => {};
let halten = new Promise<void>((r) => { loslassen = r; });
let gehalten = 0, gehaltenHoechstens = 0;
const langsam = Bun.serve({
  hostname: '127.0.0.1', port: 0, idleTimeout: 255,
  async fetch(r) {
    const was = new URL(r.url).pathname.split('/').pop()!;
    if (was !== 'halten') await Bun.sleep(Number(was) * 1000);
    else {
      gehaltenHoechstens = Math.max(gehaltenHoechstens, ++gehalten);
      await Promise.race([halten, Bun.sleep(30_000)]).finally(() => gehalten--);
    }
    return new Response('fertig');
  },
});
const ziel = `http://127.0.0.1:${teil.port}`;
const teile = (pocketbaseZiel: string) => [
  { name: 'pocketbase', ziel: pocketbaseZiel, pfade: ['/api/'], zugang: 'offen' },
  { name: 'intern', ziel, pfade: ['/intern/'], zugang: 'angemeldet' },
  { name: 'vorstand', ziel, pfade: ['/vorstand/'], zugang: 'rolle:vorstand' },
  { name: 'langsam', ziel: `http://127.0.0.1:${langsam.port}`, pfade: ['/langsam/'], zugang: 'offen' },
  { name: 'webseite', ziel, pfade: ['/'], zugang: 'offen' },
];

// Der Eingang als eigener Prozess, wie im Container
const prozesse: ReturnType<typeof Bun.spawn>[] = [];
async function starten(konfig: object, env: Record<string, string> = {}) {
  const port = 19000 + Math.floor(Math.random() * 1000);
  const datei = join(tmp, `eingang-${port}.json`);
  writeFileSync(datei, JSON.stringify(konfig));
  const p = Bun.spawn([process.execPath, '--smol', join(hier, 'eingang.ts')], { env: { ...process.env, PORT: String(port), EINGANG_JSON: datei, VERTRAUTE_PROXYS: '', ...env }, stdout: 'pipe', stderr: 'pipe' });
  prozesse.push(p);
  const zeilen: string[] = [];
  (async () => {
    const dec = new TextDecoder();
    let rest = '';
    for await (const c of p.stdout) { rest += dec.decode(c); const z = rest.split('\n'); rest = z.pop()!; zeilen.push(...z.filter(Boolean)); }
  })();
  for (let i = 0; i < 100 && !zeilen.some((z) => z.includes('"start":true')) && p.exitCode === null; i++) await Bun.sleep(50);
  const basis = `http://127.0.0.1:${port}`;
  const holen = (pfad: string, o: { methode?: string; kopf?: Record<string, string>; koerper?: BodyInit } = {}) =>
    fetch(basis + pfad, { method: o.methode ?? 'GET', headers: { host: ADRESSE, ...o.kopf }, body: o.koerper, redirect: 'manual' });
  // Rohe Anfragezeile, so wie sie im Netz ankommt (fetch würde .. und // selbst auflösen und bei Abbruch selbst wiederholen)
  const roh = (zeile: string, kopf: Record<string, string> = {}) => new Promise<number>((fertig) => {
    let daten = '';
    Bun.connect({ hostname: '127.0.0.1', port, socket: {
      open(s) { s.write(`${zeile} HTTP/1.1\r\nHost: ${ADRESSE}\r\n${Object.entries(kopf).map(([k, v]) => `${k}: ${v}\r\n`).join('')}Connection: close\r\n\r\n`); },
      data(_s, d) { daten += d.toString(); },
      close() { fertig(Number(/^HTTP\/1\.1 (\d{3})/.exec(daten)?.[1] ?? 0)); },
      error() { fertig(0); },
    } }).catch(() => fertig(0));
  });
  // Eine Verbindung, die offen bleibt: status, sobald die Antwort beginnt (0 ohne Antwort); zu() bricht ab wie ein geschlossener Tab
  const offen = (zeile: string, kopf: Record<string, string>) => {
    let sock: { end(): void } | null = null, daten = '', fertig = (_: number) => {};
    const status = new Promise<number>((r) => { fertig = r; });
    Bun.connect({ hostname: '127.0.0.1', port, socket: {
      open(s) { sock = s; s.write(`${zeile} HTTP/1.1\r\nHost: ${ADRESSE}\r\n${Object.entries(kopf).map(([k, v]) => `${k}: ${v}\r\n`).join('')}\r\n`); },
      data(_s, d) { daten += d.toString(); const m = /^HTTP\/1\.1 (\d{3})/.exec(daten); if (m) fertig(Number(m[1])); },
      close() { fertig(0); },
      error() { fertig(0); },
    } }).catch(() => fertig(0));
    return { status, zu: () => sock?.end() };
  };
  return { holen, roh, offen, zeilen, p, port };
}
const konfig = (pocketbaseZiel: string) => ({ ursprung: EIGEN, anmeldeseite: '/mitglieder.html', teile: teile(pocketbaseZiel) });

try {
  for (let i = 0; i < 50 && !(await fetch(`${api}/health`).catch(() => null))?.ok; i++) await Bun.sleep(200);
  const { token } = await (await fetch(`${api}/collections/_superusers/auth-with-password`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identity: 'test@example.com', password: passwort }),
  })).json() as { token: string };
  await einstellen(api, token, smtp.port, EIGEN);
  const admin = async (methode: string, pfad: string, body?: unknown) =>
    (await fetch(`${api}${pfad}`, { method: methode, headers: { 'content-type': 'application/json', authorization: token }, body: body ? JSON.stringify(body) : undefined })).json() as Promise<Record<string, any>>;
  const konto = (email: string, freigegeben: boolean) => admin('POST', '/collections/users/records', { email, password: 'geheim-123', passwordConfirm: 'geheim-123', verified: true, freigegeben, rolle: 'mitglied' });
  const anna = await konto('anna@example.com', true), bert = await konto('bert@example.com', false);
  await admin('POST', '/collections/mitteilungen/records', { titel: 'Probe am Freitag' });

  const e1 = await starten(konfig(`http://127.0.0.1:${pbPort}`));
  const { holen, roh } = e1;
  const json = { 'content-type': 'application/json', origin: EIGEN };

  // Anmelden: das Token nur im Cookie, für Skripte nicht lesbar
  const an = await holen('/api/eingang/anmelden', { methode: 'POST', kopf: json, koerper: JSON.stringify({ email: 'anna@example.com', passwort: 'geheim-123' }) });
  const sc = an.headers.get('set-cookie') ?? '';
  const cookie = sc.split(';')[0]!, wert = cookie.split('=')[1] ?? '';
  pruefe(an.status === 204 && sc.startsWith('__Host-sitzung=ey') && ['Path=/', 'Max-Age=432000', 'HttpOnly', 'Secure', 'SameSite=Lax'].every((x) => sc.includes(x)) && !/domain=/i.test(sc) && (await an.text()) === '',
    'Anmelden: Cookie __Host-sitzung mit HttpOnly, Secure, SameSite=Lax, Path=/, Max-Age wie das Token (5 Tage), ohne Domain; kein Token im Körper');
  const falsch = await holen('/api/eingang/anmelden', { methode: 'POST', kopf: json, koerper: JSON.stringify({ email: 'anna@example.com', passwort: 'falsch-123' }) });
  pruefe(falsch.status === 400 && !falsch.headers.get('set-cookie'), 'Falsches Passwort: 400, kein Cookie');

  // Geschützte Pfade
  const vorher = gesehen.length;
  const ohne = await holen('/intern/seite.html');
  const ohneHtml = await holen('/intern/seite.html?x=1', { kopf: { accept: 'text/html' } });
  pruefe(ohne.status === 401 && ohneHtml.status === 401 && (await ohneHtml.text()).includes('href="/mitglieder.html?weiter=%2Fintern%2Fseite.html%3Fx%3D1"') && gesehen.length === vorher,
    'Geschützter Pfad ohne Cookie: 401, im Browser mit dem Weg zur Anmeldung (weiter=…); der Teil sieht nichts');
  const mit = await holen('/intern/seite.html', { kopf: { cookie: `${cookie}; sprache=de`, authorization: 'Bearer fremd', 'x-eingang-benutzer': 'admin', 'X-Eingang-Rolle': 'vorstand' } });
  const k = gesehen.at(-1)!.kopf;
  pruefe(mit.status === 200 && k['x-eingang-benutzer'] === anna.id && k['x-eingang-rolle'] === 'mitglied' && !k.cookie && !k.authorization,
    'Mit Cookie: Der Teil bekommt x-eingang-benutzer (nur die Record-ID) und die echte Rolle, gefälschte Werte fallen weg, Cookie und Authorization nicht');
  pruefe(mit.headers.get('cache-control') === 'no-store' && /\bCookie\b/.test(mit.headers.get('vary') ?? '') && mit.headers.get('x-frame-options') === 'SAMEORIGIN', 'Hinter dem Login: no-store, Vary: Cookie, nicht in fremde Rahmen');
  await holen('/verein/', { kopf: { 'X-Eingang-Benutzer': anna.id, 'x-eingang-rolle': 'vorstand', 'x-eingang-irgendwas': '1', 'x-forwarded-for': '203.0.113.9', cookie } });
  const offen = gesehen.at(-1)!.kopf;
  pruefe(Object.keys(offen).every((x) => !x.startsWith('x-eingang-')) && !offen.cookie, 'Offener Teil: alle gefälschten x-eingang-* fallen weg, auch in anderer Schreibweise; kein Cookie');
  pruefe(offen['x-forwarded-for'] === '127.0.0.1', `X-Forwarded-For vom Browser zählt nicht (VERTRAUTE_PROXYS leer): der Teil bekommt die Adresse der Verbindung (${offen['x-forwarded-for']})`);
  const antwort = await holen('/verein/');
  pruefe(!antwort.headers.get('x-eingang-rolle') && antwort.headers.getSetCookie().join() === 'sprache=de; Path=/',
    `Antworten der Teile: x-eingang-* entfernt, eine Sitzung von einem Teil fällt weg (auch «__Host-sitzung =…», mit Tab oder in Grossbuchstaben), andere Cookies bleiben (${antwort.headers.getSetCookie().length} Set-Cookie)`);
  // Köpfe mit Unterstrich: Server nach WSGI oder CGI (etwa Python) lesen x_eingang_rolle wie x-eingang-rolle. Der Eingang verwirft sie, wie nginx
  await holen('/verein/', { kopf: { X_Eingang_Rolle: 'vorstand', X_Eingang_Benutzer: 'jemand', X_Forwarded_For: '6.6.6.6', X_Real_IP: '6.6.6.6' } });
  const unterOffen = gesehen.at(-1)!.kopf;
  await holen('/intern/seite.html', { kopf: { cookie, X_Eingang_Rolle: 'vorstand', X_Eingang_Benutzer: 'jemand' } });
  const unterZu = gesehen.at(-1)!.kopf;
  pruefe([unterOffen, unterZu].every((k) => Object.keys(k).every((x) => !x.includes('_'))) && !unterOffen['x-eingang-rolle'] && unterZu['x-eingang-rolle'] === 'mitglied' && unterZu['x-eingang-benutzer'] === anna.id,
    `Köpfe mit Unterstrich (X_Eingang_Rolle, X_Forwarded_For) kommen bei keinem Teil an (${[...Object.keys(unterOffen), ...Object.keys(unterZu)].filter((x) => x.includes('_')).join(', ') || 'keiner'})`);

  // Rollen
  pruefe((await holen('/vorstand/protokoll.html', { kopf: { cookie } })).status === 403, 'Teil mit rolle:vorstand: für ein Mitglied 403');
  await admin('PATCH', `/collections/users/records/${anna.id}`, { rolle: 'vorstand' });
  const vorstand = await holen('/vorstand/protokoll.html', { kopf: { cookie } });
  pruefe(vorstand.status === 200 && gesehen.at(-1)!.kopf['x-eingang-rolle'] === 'vorstand', 'Rolle stimmt: nachdem die Verwaltung sie gesetzt hat, 200 mit x-eingang-rolle vorstand');

  // Die eigene Rolle oder Freigabe ändert niemand selbst, auch nicht durch den Eingang
  const an2 = await holen('/api/eingang/anmelden', { methode: 'POST', kopf: json, koerper: JSON.stringify({ email: 'bert@example.com', passwort: 'geheim-123' }) });
  const bertCookie = (an2.headers.get('set-cookie') ?? '').split(';')[0]!;
  const selbst = await Promise.all([
    holen(`/api/collections/users/records/${bert.id}`, { methode: 'PATCH', kopf: { ...json, cookie: bertCookie }, koerper: JSON.stringify({ freigegeben: true }) }),
    holen(`/api/collections/users/records/${bert.id}`, { methode: 'PATCH', kopf: { ...json, cookie: bertCookie }, koerper: JSON.stringify({ rolle: 'vorstand' }) }),
  ]);
  const bertDanach = await admin('GET', `/collections/users/records/${bert.id}`);
  pruefe(selbst.every((r) => r.status === 404) && bertDanach.freigegeben === false && bertDanach.rolle === 'mitglied',
    `Eigene Freigabe oder Rolle per PATCH mit Cookie und eigenem Ursprung: abgelehnt (${selbst.map((r) => r.status)}), nichts geändert`);
  pruefe(an2.status === 204 && (await holen('/intern/seite.html', { kopf: { cookie: bertCookie } })).status === 401, 'Angemeldet, aber nicht freigegeben: geschützter Pfad 401');
  const m = await holen('/api/collections/mitteilungen/records', { kopf: { cookie } });
  pruefe(m.status === 200 && (await m.json() as { totalItems: number }).totalItems === 1 && m.headers.get('cache-control') === 'no-store', 'Mitteilungen mit dem Cookie durch den Eingang: PocketBase prüft selbst, Antwort no-store');
  // Eine Record-ID hat 15 Zeichen aus a-z und 0-9; etwa jede 130. hat keine Ziffer. Auch die gehört nicht ins Protokoll (unten geprüft)
  const ohneZiffer = (await admin('POST', '/collections/mitteilungen/records', { id: 'ohneziffernabcd', titel: 'Kennung ohne Ziffer' })).id as string;
  await holen(`/api/collections/mitteilungen/records/${ohneZiffer}`, { kopf: { cookie } });

  // Fremde Ursprünge
  const schreiben = (kopf: Record<string, string>) => holen(`/api/collections/users/records/${anna.id}`, { methode: 'PATCH', kopf: { 'content-type': 'application/json', ...kopf }, koerper: '{"name":"Anna"}' });
  const fremd = await Promise.all([schreiben({ cookie, origin: 'https://boese.example' }), schreiben({ cookie, origin: 'https://nachbar.aufwind.sh' }), schreiben({ cookie }), schreiben({ cookie, origin: 'null' })]);
  pruefe(fremd.every((r) => r.status === 403), `Schreiben mit Cookie von fremdem Ursprung, aus der Nachbarschaft, ohne oder mit Origin null: 403 (${fremd.map((r) => r.status)})`);
  pruefe((await schreiben({ cookie, origin: EIGEN })).status === 200, 'Vom eigenen Ursprung: geht');
  const vorTeil = gesehen.length;
  const formular = (pfad: string, kopf: Record<string, string>) => holen(pfad, { methode: 'POST', kopf: { 'content-type': 'application/x-www-form-urlencoded', ...kopf }, koerper: 'x=1' });
  const fremdTeil = await Promise.all([formular('/intern/formular', { cookie, origin: 'https://boese.example' }), formular('/verein/formular', { cookie, origin: 'https://nachbar.aufwind.sh' }),
    formular('/verein/formular', { origin: 'https://boese.example' }), formular('/verein/formular', { cookie })]);
  pruefe(fremdTeil.every((r) => r.status === 403) && gesehen.length === vorTeil && (await formular('/verein/formular', { cookie, origin: EIGEN })).status === 200,
    `Auch zu den anderen Teilen (ohne eigene Prüfung): Schreiben aus fremden Seiten 403, der Teil sieht nichts; vom eigenen Ursprung geht es (${fremdTeil.map((r) => r.status)})`);
  pruefe((await holen('/api/eingang/anmelden', { methode: 'POST', kopf: { 'content-type': 'application/json', origin: 'https://boese.example' }, koerper: JSON.stringify({ email: 'anna@example.com', passwort: 'geheim-123' }) })).status === 403,
    'Anmelden aus einer fremden Seite: 403');
  const direkt = await fetch(`${api}/collections/users/records/${anna.id}`, { method: 'PATCH', headers: { 'content-type': 'application/json', cookie, origin: 'https://boese.example' }, body: '{"name":"x"}' });
  pruefe(direkt.status === 403, 'Zweite Schicht: PocketBase selbst lehnt Schreiben mit Cookie von fremdem Ursprung ab (403)');
  const erneuern = await holen('/api/collections/users/auth-refresh', { methode: 'POST', kopf: { origin: EIGEN, cookie } });
  pruefe(erneuern.status === 401, 'Das Token kommt nie in eine Antwort: auth-refresh gilt mit dem Cookie nicht (401)');

  // Verwaltung und Punktdateien
  const zahl = gesehen.length;
  const VERWALTUNG = ['/_/', '/_', '/_/#/settings', '/api/collections/_superusers/auth-with-password', '/api/collections/_superusers/records', '/api/settings', '/api/backups', '/api/logs',
    '/api/crons', '/api/collections', '/api/collections/users', '/api/collections/users/truncate', '/api/collections/meta/scaffolds', '/admin', '/admin/login', '/.env', '/.git/config', '/intern/.htpasswd'];
  const zu = await Promise.all(VERWALTUNG.map((p) => holen(p, { methode: p.endsWith('auth-with-password') ? 'POST' : 'GET', kopf: json, koerper: p.endsWith('auth-with-password') ? JSON.stringify({ identity: 'test@example.com', password: passwort }) : undefined })));
  pruefe(zu.every((r) => r.status === 404) && gesehen.length === zahl, `Verwaltungspfade und Punktdateien: 404, kein Teil sieht sie (${VERWALTUNG.length} Pfade)`);
  pruefe((await roh('POST /api/collections/%5fsuperusers/auth-with-password')) === 404 && (await roh('GET /api/collections/_super%75sers/records')) === 404, 'Auch kodiert (%5fsuperusers): 404');
  pruefe((await holen('/.well-known/security.txt')).status === 200, '/.well-known/ bleibt erreichbar');

  // Die Verwaltung bleibt zu, egal wie geschrieben: PocketBase findet Sammlungen ohne Gross/Klein (Go EqualFold, auch «ſ» für «s») und über
  // ihre ID (pbc_<crc32>, in jeder PocketBase gleich). Jede Probe kommt von einer eigenen Adresse, damit keine Grenze dazwischenkommt.
  const e4 = await starten(konfig(`http://127.0.0.1:${pbPort}`), { VERTRAUTE_PROXYS: '127.0.0.1' });
  let nummer = 0;
  const neu = () => `192.0.2.${++nummer}`;
  // Passwort raten über auth-with-password (der Weg ist durch den offenen Teil pocketbase erreichbar): dieselbe Grenze wie beim Anmelden
  // über den Eingang, 5 Versuche je Adresse in 60 Sekunden. Langsamer als die Grenze *:auth von PocketBase (2 in 3 s), läuft nebenher.
  const ratenLangsam = (async () => {
    const r: number[] = [];
    for (let i = 0; i < 6; i++) {
      if (i) await Bun.sleep(1600);
      r.push((await e4.holen('/api/collections/users/auth-with-password', { methode: 'POST', kopf: { ...json, 'x-forwarded-for': '198.51.100.60' }, koerper: JSON.stringify({ identity: 'anna@example.com', password: `falsch-${i}` }) })).status);
    }
    return r;
  })();
  // Ein Teil braucht 15 s (etwa ein Hook, der beim Registrieren zwei Mails schickt): Die Antwort muss ankommen. Bun schliesst ruhige
  // Verbindungen sonst nach 10 s, und die eigene Grenze (teilMs, 504 nach 60 s) griffe nie. Läuft ebenfalls nebenher.
  const t15 = performance.now();
  const fuenfzehn = e4.roh('GET /langsam/15', { 'X-Forwarded-For': '198.51.100.62' }).then((s) => ({ s, ms: performance.now() - t15 }));
  const suId = (await admin('GET', '/collections/_superusers')).id as string;
  const suKoerper = JSON.stringify({ identity: 'test@example.com', password: passwort });
  const schreibweisen = ['_SUPERUSERS', '_Superusers', suId, '_%C5%BFuperusers', '_MFAS'];
  const mailsVorher = mails;
  const anders = await Promise.all(schreibweisen.flatMap((s) => [
    e4.holen(`/api/collections/${s}/auth-with-password`, { methode: 'POST', kopf: { ...json, 'x-forwarded-for': neu() }, koerper: suKoerper }),
    e4.holen(`/api/collections/${s}/auth-methods`, { kopf: { 'x-forwarded-for': neu() } }),
    e4.holen(`/api/collections/${s}/request-password-reset`, { methode: 'POST', kopf: { ...json, 'x-forwarded-for': neu() }, koerper: JSON.stringify({ email: 'test@example.com' }) }),
  ]));
  await Bun.sleep(300);
  pruefe(anders.every((r) => r.status === 404) && mails === mailsVorher,
    `Verwaltung in anderer Schreibweise (_SUPERUSERS, _Superusers, ${suId}, _ſuperusers, _MFAS): anmelden, auth-methods und Passwort vergessen 404, keine Mail (${anders.map((r) => r.status)})`);
  const mitToken = await Promise.all([e4.holen('/api/collections/users/records', { kopf: { authorization: token, 'x-forwarded-for': neu() } }),
    e4.holen(`/api/collections/users/records/${bert.id}`, { methode: 'PATCH', kopf: { ...json, authorization: token, 'x-forwarded-for': neu() }, koerper: JSON.stringify({ freigegeben: true, rolle: 'vorstand' }) })]);
  const bertNachher = await admin('GET', `/collections/users/records/${bert.id}`);
  pruefe(mitToken.every((r) => r.status === 404) && bertNachher.freigegeben === false && bertNachher.rolle === 'mitglied',
    `Ein Token der Verwaltung gilt durch den Eingang nicht: Mitglieder lesen oder freigeben 404, nichts geändert (${mitToken.map((r) => r.status)})`);
  // Zweite Schicht: PocketBase selbst sperrt mit dem Kopf x-eingang-weg (setzt nur der Eingang) jedes Konto der Verwaltung und jede
  // Systemsammlung; über den Tunnel (direkt, ohne den Kopf) bleibt die Verwaltung erreichbar
  const direkt2 = (pfad: string, kopf: Record<string, string>, koerper?: string) =>
    fetch(`http://127.0.0.1:${pbPort}${pfad}`, { method: koerper ? 'POST' : 'GET', headers: { 'content-type': 'application/json', 'x-forwarded-for': neu(), ...kopf }, body: koerper });
  const aussen = { 'x-eingang-weg': 'aussen' };
  const mailsVorher2 = mails;
  const schicht2 = await Promise.all([...['_superusers', '_SUPERUSERS', suId, '_%C5%BFuperusers'].map((s) => direkt2(`/api/collections/${s}/auth-with-password`, aussen, suKoerper)),
    direkt2('/api/collections/users/records', { ...aussen, authorization: token }), direkt2('/api/collections/_superusers/request-password-reset', aussen, JSON.stringify({ email: 'test@example.com' })),
    direkt2('/_/', aussen)]);
  await Bun.sleep(300);
  const keineMail = mails === mailsVorher2; // vor der Anmeldung über den Tunnel: die schickt PocketBase eine Mail «Neue Anmeldung»
  const tunnel = await direkt2('/api/collections/_superusers/auth-with-password', {}, suKoerper);
  pruefe(schicht2.every((r) => r.status === 404) && keineMail && tunnel.status === 200,
    `Zweite Schicht: PocketBase mit x-eingang-weg 404 für Verwaltung und Systemsammlungen, keine Mail (${schicht2.map((r) => r.status)}); über den Tunnel ohne den Kopf ${tunnel.status}`);

  // Eigene Domain: Die Kante leitet sie an denselben Server, der Host bleibt. Der eigene Ursprung der Anfrage gilt beim Schreiben, auch
  // ohne Eintrag in eingang.json; fremde Ursprünge und ein Ursprung, der nicht zum Host passt, weiterhin nicht.
  const ueber = (host: string, origin: string, pfad: string, koerper: object) =>
    e4.holen(pfad, { methode: 'POST', kopf: { host, origin, 'content-type': 'application/json', 'x-forwarded-for': neu() }, koerper: JSON.stringify(koerper) });
  const annaKoerper = { email: 'anna@example.com', passwort: 'geheim-123' };
  const domain = await Promise.all([ueber('www.meinverein.example', 'https://www.meinverein.example', '/api/eingang/anmelden', annaKoerper),
    ueber('meinverein.example', 'https://meinverein.example', '/api/eingang/anmelden', annaKoerper),
    ueber('www.meinverein.example', 'https://www.meinverein.example', '/api/collections/users/records', { name: 'Neu', email: 'neu@example.com', password: 'geheim-12345', passwordConfirm: 'geheim-12345' }),
    ueber('www.meinverein.example', 'https://www.meinverein.example', '/api/collections/users/request-password-reset', { email: 'anna@example.com' })]);
  const nichtDomain = await Promise.all([ueber('www.meinverein.example', 'https://boese.example', '/api/eingang/anmelden', annaKoerper),
    ueber(ADRESSE, 'https://www.meinverein.example', '/api/eingang/anmelden', annaKoerper), ueber('www.meinverein.example', 'http://www.meinverein.example', '/api/eingang/anmelden', annaKoerper)]);
  pruefe(domain.map((r) => r.status).join() === '204,204,200,204' && (domain[0]!.headers.get('set-cookie') ?? '').startsWith('__Host-sitzung=ey') && nichtDomain.every((r) => r.status === 403),
    `Über die eigene Domain (Host und Origin gleich): anmelden, Anfrage stellen, Passwort vergessen gehen (${domain.map((r) => r.status)}); fremder Ursprung, anderer Host oder http: 403 (${nichtDomain.map((r) => r.status)})`);

  // Raten aus einem IPv6-Netz: PocketBase zählt je Adresse, der Eingang je /64, auch über auth-with-password
  const netz64 = await Promise.all(Array.from({ length: 12 }, (_, i) => e4.holen('/api/collections/users/auth-with-password',
    { methode: 'POST', kopf: { ...json, 'x-forwarded-for': `2001:db8:5:5::${(i + 1).toString(16)}` }, koerper: JSON.stringify({ identity: 'anna@example.com', password: `falsch-${i}` }) })));
  const zaehlung = (r: number[]) => Object.entries(r.reduce<Record<number, number>>((z, s) => ({ ...z, [s]: (z[s] ?? 0) + 1 }), {})).map(([s, n]) => `${n}×${s}`).join(' ');
  pruefe(netz64.filter((r) => r.status === 400).length === 10 && netz64.filter((r) => r.status === 429).length === 2,
    `Raten über auth-with-password aus 12 Adressen eines /64: der Eingang lässt 10 je Minute durch, dann 429 (${zaehlung(netz64.map((r) => r.status))})`);

  // Gleichzeitig offene Anfragen je Adresse (IPv6 je /64) sind begrenzt, darüber 429. Ohne Grenze belegte eine Adresse mit 300 langsamen
  // Anfragen alle 256 Plätze, die Bun für fetch hat, und jede andere Besucherin wartete, auch auf die Startseite.
  const e5 = await starten(konfig(`http://127.0.0.1:${pbPort}`), { VERTRAUTE_PROXYS: '127.0.0.1' });
  const viele = Array.from({ length: 300 }, () => e5.offen('GET /langsam/halten', { 'X-Forwarded-For': '203.0.113.66' }));
  await Bun.sleep(1500);
  const sofort = await Promise.all(viele.map((v) => Promise.race([v.status, Bun.sleep(5).then(() => -1)])));
  const tb = performance.now();
  const besucherin = await Promise.race([e5.roh('GET /verein/', { 'X-Forwarded-For': '198.51.100.77' }), Bun.sleep(3000).then(() => 0)]);
  const besucherinMs = performance.now() - tb, beimTeil = gehaltenHoechstens;
  loslassen();
  const spaeter = await Promise.all(viele.map((v) => Promise.race([v.status, Bun.sleep(5000).then(() => 0)])));
  for (const v of viele) v.zu();
  pruefe(beimTeil <= GRENZEN.gleichzeitig && sofort.filter((s) => s === 429).length === 300 - beimTeil && spaeter.filter((s) => s === 200).length === beimTeil && besucherin === 200 && besucherinMs < 2000,
    `Eine Adresse mit 300 langsamen Anfragen: ${beimTeil} beim Teil (höchstens ${GRENZEN.gleichzeitig}), ${sofort.filter((s) => s === 429).length}× sofort 429; eine andere Besucherin bekommt die Startseite (${besucherin || 'keine Antwort'} nach ${(besucherinMs / 1000).toFixed(1)} s)`);
  const wieder: number[] = [];
  for (let i = 0; i < 25; i++) { const r = await e5.holen('/verein/', { kopf: { 'x-forwarded-for': '203.0.113.66' } }); await r.text(); wieder.push(r.status); }
  halten = new Promise<void>((r) => { loslassen = r; });
  const abbrechen = Array.from({ length: 20 }, () => e5.offen('GET /langsam/halten', { 'X-Forwarded-For': '203.0.113.67' }));
  await Bun.sleep(500);
  for (const v of abbrechen) v.zu();
  await Bun.sleep(500);
  const nachAbbruch = await e5.holen('/verein/', { kopf: { 'x-forwarded-for': '203.0.113.67' } });
  loslassen();
  pruefe(wieder.every((s) => s === 200) && nachAbbruch.status === 200,
    `Die Plätze werden frei, wenn die Antwort durch ist (25 nacheinander: ${zaehlung(wieder)}) und wenn die Besucherin abbricht (${nachAbbruch.status})`);
  const echtzeit = await e5.holen('/api/realtime', { kopf: { accept: 'text/event-stream', 'x-forwarded-for': '198.51.100.78' } });
  await echtzeit.body?.cancel();
  pruefe(echtzeit.status === 404, `Echtzeit von PocketBase (/api/realtime): braucht kein Rezept, jede Verbindung bliebe offen, darum 404 (${echtzeit.status})`);

  // Pfade mit Tricks: entschieden wird auf dem aufgelösten Pfad
  const tricks: [string, number][] = [['GET /verein/../api/settings', 404], ['GET /verein/../intern/seite.html', 401], ['GET /verein/%2e%2e/intern/seite.html', 401], ['GET /intern%2fseite.html', 400],
    ['GET /intern/seite%2ehtml', 400], ['GET //api/settings', 400], ['GET /verein/..%5c..%5capi/settings', 400], ['GET /intern/%00', 400], ['GET /intern/%zz', 400], ['GET /Intern/seite.html', 200]];
  const ist = await Promise.all(tricks.map(([z]) => roh(z)));
  pruefe(ist.every((s, i) => s === tricks[i]![1]), `Pfad-Tricks: .. aufgelöst, kodierte Punkte, Schrägstriche, Rückstriche, Nullbytes und // abgelehnt (${ist.join(',')})`);

  // Grössen
  pruefe((await holen('/verein/', { kopf: { 'x-gross': 'a'.repeat(9000) } })).status === 431, 'Kopfzeilen über 8 KB: 431');
  const gross = new Uint8Array(10 * 1024 * 1024 + 1), bisher = gesehen.length;
  pruefe((await holen('/verein/hochladen', { methode: 'POST', kopf: { origin: EIGEN }, koerper: gross })).status === 413 && gesehen.length === bisher, 'Körper über 10 MB: 413, der Teil sieht nichts');
  const strom = new ReadableStream({ start(c) { for (let i = 0; i < 11; i++) c.enqueue(new Uint8Array(1024 * 1024)); c.close(); } });
  const stuecke = await holen('/verein/hochladen', { methode: 'POST', kopf: { origin: EIGEN }, koerper: strom }).catch(() => ({ status: 0 }));
  await Bun.sleep(100);
  pruefe(stuecke.status === 413 && gesehen.slice(bisher).every((g) => g.bytes <= 0), `Auch in Stücken ohne Content-Length: 413, beim Teil kommt nichts an (${stuecke.status})`);

  const ab = await holen('/api/eingang/abmelden', { methode: 'POST', kopf: { origin: EIGEN, cookie } });
  pruefe(ab.status === 204 && /^__Host-sitzung=;.*Max-Age=0/.test(ab.headers.get('set-cookie') ?? ''), 'Abmelden löscht das Cookie');

  // Grenzen je Adresse, hinter einem vertrauten Proxy
  const e2 = await starten(konfig(`http://127.0.0.1:${pbPort}`), { VERTRAUTE_PROXYS: '127.0.0.1', ANFRAGEN_PRO_MINUTE: '20' });
  const reihe: number[] = [];
  for (let i = 0; i < 21; i++) reihe.push((await e2.holen('/verein/', { kopf: { 'x-forwarded-for': '203.0.113.7' } })).status);
  const letzte = await e2.holen('/verein/', { kopf: { 'x-forwarded-for': '203.0.113.7' } });
  const andere = await e2.holen('/verein/', { kopf: { 'x-forwarded-for': '203.0.113.8' } });
  pruefe(reihe.slice(0, 20).every((s) => s === 200) && reihe[20] === 429 && Number(letzte.headers.get('retry-after')) > 0 && andere.status === 200 && gesehen.at(-1)!.kopf['x-forwarded-for'] === '203.0.113.8',
    'Grenze je Adresse (20 je Minute): die 21. Anfrage 429 mit Retry-After; eine andere Adresse geht weiter, der Teil bekommt sie');
  const versuche: number[] = [];
  for (let i = 0; i < 6; i++) versuche.push((await e2.holen('/api/eingang/anmelden', { methode: 'POST', kopf: { ...json, 'x-forwarded-for': '198.51.100.50' }, koerper: JSON.stringify({ email: 'anna@example.com', passwort: `falsch-${i}` }) })).status);
  pruefe(versuche.join() === '400,400,400,400,400,429', `Passwörter durchprobieren: nach 5 Fehlversuchen je Adresse 429 (${versuche.join()})`);

  const geraten = await ratenLangsam;
  pruefe(geraten.join() === '400,400,400,400,400,429', `Passwörter durchprobieren über auth-with-password: nach 5 Fehlversuchen je Adresse 429, auch langsam (${geraten.join()})`);
  const f = await fuenfzehn;
  pruefe(f.s === 200 && f.ms >= 14_500, `Ein Teil braucht 15 s: die Antwort kommt an (${f.s || 'keine Antwort'} nach ${(f.ms / 1000).toFixed(1)} s)`);

  // PocketBase antwortet nicht
  const e3 = await starten(konfig(`http://127.0.0.1:${haengt.port}`));
  const t0 = performance.now();
  const lange = await e3.holen('/intern/seite.html', { kopf: { cookie } });
  const ms = performance.now() - t0;
  pruefe(lange.status === 503 && ms >= 1900 && ms < 3500, `PocketBase hängt: 503 nach 2 s (${Math.round(ms)} ms)`);
  server.kill();
  await server.exited;
  const weg = await holen('/intern/seite.html', { kopf: { cookie } });
  pruefe(weg.status === 503 && (await holen('/intern/seite.html')).status === 401 && (await holen('/verein/')).status === 200,
    'Ohne PocketBase: geschützter Pfad mit Cookie 503, ohne Cookie 401, offene Teile laufen weiter');

  // Protokoll: eine Zeile je Anfrage, ohne Cookie, Token, Abfrage, Kopfzeilen oder Adressen
  await holen('/verein/suche?token=geheim-abfrage-123');
  await Bun.sleep(100);
  const zeilen = e1.zeilen.filter((z) => !z.includes('"start":true'));
  const alle = [...e1.zeilen, ...e2.zeilen, ...e3.zeilen].join('\n');
  pruefe(zeilen.length > 40 && zeilen.every((z) => { try { const j = JSON.parse(z); return j.methode && j.pfad && j.teil && j.status && typeof j.ms === 'number'; } catch { return false; } }),
    `Protokoll: eine JSON-Zeile je Anfrage mit Methode, Pfad, Teil, Status und Dauer (${zeilen.length} Zeilen)`);
  const verboten: [string, string][] = [['Token', wert.slice(10, 40)], ['Passwort', 'geheim'], ['Cookie', 'cookie'], ['Authorization', 'authorization'], ['Kopf', 'x-eingang'],
    ['Adresse', '127.0.0.1'], ['Adresse', '203.0.113'], ['Adresse', '198.51.100'], ['Host', ADRESSE], ['Record-ID', anna.id], ['Record-ID ohne Ziffer', ohneZiffer]];
  const gefunden = verboten.filter(([, x]) => alle.includes(x)).map(([n]) => n);
  pruefe(!gefunden.length, `Protokoll ohne Cookie, Token, Passwort, Abfrage, Kopfzeilen, Adressen und Record-IDs${gefunden.length ? ` (gefunden: ${gefunden.join(', ')})` : ''}`);

  // eingang.json mit Fehlern: Der Eingang startet nicht und sagt, was fehlt
  const kaputt = await Promise.all([{ ...konfig(ziel), teile: teile(ziel).slice(1) }, { ...konfig(ziel), ursprung: 'https://NAME.aufwind.sh' }, { ...konfig(ziel), teile: [...teile(ziel), { name: 'doppelt', ziel, pfade: ['/intern/'], zugang: 'offen' }] }]
    .map(async (x) => { const s = await starten(x); await s.p.exited; return { code: s.p.exitCode, text: await new Response(s.p.stderr as ReadableStream).text() }; }));
  pruefe(kaputt.every((x) => x.code === 1) && kaputt[0]!.text.includes('pocketbase') && kaputt[1]!.text.includes('statt NAME') && kaputt[2]!.text.includes('zwei Teilen'),
    'eingang.json ohne PocketBase, mit NAME oder mit einem Pfad für zwei Teile: startet nicht und sagt, was fehlt');
} finally {
  for (const p of prozesse) p.kill();
  server.kill();
  teil.stop(true);
  haengt.stop(true);
  loslassen();
  langsam.stop(true);
  smtp.stop(true);
  const log = await new Response(server.stderr).text();
  if (fehler && log.trim()) console.log(log.slice(-2000));
  await Promise.all([server.exited, ...prozesse.map((p) => p.exited)]);
  rmSync(tmp, { recursive: true, force: true }); // die Daten dieses Laufs
}
console.log(fehler ? `\n${fehler} Prüfungen fehlgeschlagen` : '\nAlles grün');
process.exit(fehler ? 1 : 0);
