// Test des Rezepts buchungen gegen ein echtes PocketBase (Version aus ../../Dockerfile), mit einer Mail-Attrappe auf localhost.
//   bun bausteine/pocketbase/rezepte/buchungen/test.ts            (lädt PocketBase in einen Temp-Ordner, prüft die Prüfsumme)
//   POCKETBASE=/pfad/zu/pocketbase bun …/test.ts                    (mit einem vorhandenen Programm)
import { cpSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const hier = import.meta.dir, pb = join(hier, '../..');
const tmp = mkdtempSync(join(tmpdir(), 'buchungen-'));
let fehler = 0;
const pruefe = (ok: unknown, was: string) => { console.log(`${ok ? '✓' : '✗'} ${was}`); if (!ok) fehler++; };

async function programm() {
  if (process.env.POCKETBASE) return process.env.POCKETBASE;
  const v = /PB_VERSION=([\d.]+)/.exec(readFileSync(join(pb, 'Dockerfile'), 'utf8'))![1]!;
  const os = process.platform === 'darwin' ? 'darwin' : 'linux', arch = process.arch === 'arm64' ? 'arm64' : 'amd64';
  const datei = `pocketbase_${v}_${os}_${arch}.zip`, url = `https://github.com/pocketbase/pocketbase/releases/download/v${v}`;
  const zip = new Uint8Array(await (await fetch(`${url}/${datei}`)).arrayBuffer());
  const summe = (await (await fetch(`${url}/checksums.txt`)).text()).split('\n').find((z) => z.endsWith(datei))?.split(/\s+/)[0];
  if (new Bun.CryptoHasher('sha256').update(zip).digest('hex') !== summe) throw new Error(`Prüfsumme von ${datei} stimmt nicht`);
  writeFileSync(join(tmp, datei), zip);
  Bun.spawnSync(['unzip', '-q', datei, 'pocketbase'], { cwd: tmp });
  return join(tmp, 'pocketbase');
}

// Mail-Attrappe: nimmt SMTP an und merkt sich jede Mail
const mails: string[] = [];
const smtp = Bun.listen<{ daten: boolean; puffer: string }>({
  hostname: '127.0.0.1', port: 0,
  socket: {
    open(s) { s.data = { daten: false, puffer: '' }; s.write('220 attrappe\r\n'); },
    data(s, d) {
      s.data.puffer += d.toString();
      if (s.data.daten) {
        const i = s.data.puffer.indexOf('\r\n.\r\n');
        if (i < 0) return;
        mails.push(s.data.puffer.slice(0, i));
        s.data = { daten: false, puffer: s.data.puffer.slice(i + 5) };
        s.write('250 ok\r\n');
      }
      let n;
      while (!s.data.daten && (n = s.data.puffer.indexOf('\r\n')) >= 0) {
        const z = s.data.puffer.slice(0, n).toUpperCase();
        s.data.puffer = s.data.puffer.slice(n + 2);
        if (z.startsWith('EHLO') || z.startsWith('HELO')) s.write('250 attrappe\r\n');
        else if (z.startsWith('DATA')) { s.data.daten = true; s.write('354 los\r\n'); }
        else if (z.startsWith('QUIT')) { s.write('221 tschuess\r\n'); s.end(); }
        else s.write('250 ok\r\n');
      }
    },
  },
});

const pocketbase = await programm();
mkdirSync(join(tmp, 'pb_migrations')); mkdirSync(join(tmp, 'pb_hooks'));
cpSync(join(pb, 'pb_migrations'), join(tmp, 'pb_migrations'), { recursive: true });
cpSync(join(hier, 'pb_migrations'), join(tmp, 'pb_migrations'), { recursive: true });
cpSync(join(hier, 'pb_hooks'), join(tmp, 'pb_hooks'), { recursive: true });
const port = 18000 + Math.floor(Math.random() * 1000), api = `http://127.0.0.1:${port}/api`;
const passwort = crypto.randomUUID();
const env = { ...process.env, TZ: 'Europe/Zurich' };
const dirs = [`--dir=${join(tmp, 'pb_data')}`, `--migrationsDir=${join(tmp, 'pb_migrations')}`, `--hooksDir=${join(tmp, 'pb_hooks')}`];
Bun.spawnSync([pocketbase, 'superuser', 'upsert', 'test@example.com', passwort, ...dirs], { env });
const server = Bun.spawn([pocketbase, 'serve', `--http=127.0.0.1:${port}`, ...dirs], { env, stdout: 'ignore', stderr: 'pipe' });

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
  await admin('PATCH', '/settings', { meta: { appURL: 'https://yoga.example', senderAddress: 'studio@example.com', senderName: 'Studio' }, smtp: { enabled: true, host: '127.0.0.1', port: smtp.port, tls: false } });

  const iso = (ms: number) => new Date(ms).toISOString().replace('T', ' ');
  const tag = 24 * 3600e3;
  const angebot = (await admin('POST', '/collections/angebote/records', { titel: 'Yoga am Abend', ort: 'Studio, Seestrasse 1', preis_hinweis: 'CHF 25, bar vor Ort', aktiv: true, buchungsschluss_std: 0 })).body.id;
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

  const frei = (await gast('GET', '/collections/termine_frei/records?sort=beginn')).body.items as { id: string; frei: number }[];
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

  await Bun.sleep(500);
  // quoted-printable zurück in Text (Betreffzeilen bleiben kodiert, darum prüfen wir den Inhalt)
  const qp = (m: string) => {
    const t = m.replace(/=\r\n/g, ''), bytes: number[] = [];
    for (let i = 0; i < t.length; i++) {
      if (t[i] === '=' && /^[0-9A-F]{2}$/.test(t.slice(i + 1, i + 3))) { bytes.push(parseInt(t.slice(i + 1, i + 3), 16)); i += 2; } else bytes.push(t.charCodeAt(i));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };
  const text = mails.map(qp).join('\n');
  pruefe(mails.length === 13, `Mails: je Buchung zwei, Absage per Link zwei, Absage durch die Verwaltung je eine (${mails.length})`);
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
