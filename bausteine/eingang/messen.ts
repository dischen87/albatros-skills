// Arbeitsspeicher (RSS) und Antwortzeiten des Eingangs messen: im Leerlauf und unter Last, vor einem echten PocketBase (Rezepte
// mitglieder und eingang) und einem Teil zum Schein, der eine kleine Seite liefert.
//   bun bausteine/eingang/messen.ts [--anfragen 10000] [--gleichzeitig 50] [--adressen 1000] [--smol]
//   bun bausteine/eingang/messen.ts --gehalten 1100 [--fetch-plaetze 1024] [--smol]
// Die Hälfte der Anfragen geht an einen offenen Teil, die Hälfte an einen geschützten (jede fragt PocketBase, wer angemeldet ist).
// Die Anfragen kommen von --adressen verschiedenen Adressen (X-Forwarded-For hinter einem vertrauten Proxy), ohne Grenze.
// --smol startet den Eingang mit «bun --smol» (kleinerer Speicher, häufiger aufräumen).
// --gehalten N: statt Last N Anfragen, die ein langsamer Teil festhält, je 20 von einer Adresse (so viele lässt der Eingang je Adresse
// offen). Misst den Speicher dabei und ob eine andere Besucherin noch durchkommt. --fetch-plaetze setzt BUN_CONFIG_MAX_HTTP_REQUESTS
// (wie im Dockerfile; ohne: Standard von Bun, 256).
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pocketbase, wurzelVon } from '../pocketbase/programm.ts';

const args = process.argv.slice(2);
const wert = (n: string, d: number) => { const i = args.indexOf(n); return i >= 0 ? Number(args[i + 1]) : d; };
const ANFRAGEN = wert('--anfragen', 10_000), GLEICHZEITIG = wert('--gleichzeitig', 50), ADRESSEN = wert('--adressen', 1000), SMOL = args.includes('--smol');
const GEHALTEN = wert('--gehalten', 0), PLAETZE = wert('--fetch-plaetze', 0);
const hier = import.meta.dir, pb = wurzelVon(join(hier, '..', 'pocketbase'));
const tmp = mkdtempSync(join(tmpdir(), 'eingang-messen-'));
mkdirSync(join(tmp, 'pb_migrations')); mkdirSync(join(tmp, 'pb_hooks'));
cpSync(join(pb, 'pb_migrations'), join(tmp, 'pb_migrations'), { recursive: true });
for (const r of [join(pb, 'rezepte', 'mitglieder'), hier]) for (const d of ['pb_migrations', 'pb_hooks']) cpSync(join(r, d), join(tmp, d), { recursive: true });
const programm = await pocketbase(pb);
const pbPort = 18000 + Math.floor(Math.random() * 1000), api = `http://127.0.0.1:${pbPort}/api`, passwort = crypto.randomUUID();
const dirs = [`--dir=${join(tmp, 'pb_data')}`, `--migrationsDir=${join(tmp, 'pb_migrations')}`, `--hooksDir=${join(tmp, 'pb_hooks')}`];
Bun.spawnSync([programm, 'superuser', 'upsert', 'test@example.com', passwort, ...dirs]);
// PocketBase wie in pocketbase/compose.yaml: GOMEMLIMIT 200MiB
const server = Bun.spawn([programm, 'serve', `--http=127.0.0.1:${pbPort}`, ...dirs], { env: { ...process.env, GOMEMLIMIT: '200MiB' }, stdout: 'ignore', stderr: 'ignore' });
const seite = '<!doctype html><title>Verein</title>' + '<p>Text</p>'.repeat(150);
let loslassen = () => {}, gehalten = 0;
const halten = new Promise<void>((r) => { loslassen = r; });
const teil = Bun.serve({ hostname: '127.0.0.1', port: 0, idleTimeout: 255, async fetch(r) {
  if (new URL(r.url).pathname === '/halten') { gehalten++; await halten; gehalten--; }
  return new Response(seite, { headers: { 'content-type': 'text/html; charset=utf-8' } });
} });
const port = 19000 + Math.floor(Math.random() * 1000), basis = `http://127.0.0.1:${port}`;
const konfig = join(tmp, 'eingang.json');
writeFileSync(konfig, JSON.stringify({ ursprung: 'https://verein.example', teile: [
  { name: 'pocketbase', ziel: `http://127.0.0.1:${pbPort}`, pfade: ['/api/'], zugang: 'offen' },
  { name: 'intern', ziel: `http://127.0.0.1:${teil.port}`, pfade: ['/intern/'], zugang: 'angemeldet' },
  { name: 'webseite', ziel: `http://127.0.0.1:${teil.port}`, pfade: ['/'], zugang: 'offen' },
] }));
const eingang = Bun.spawn([process.execPath, ...(SMOL ? ['--smol'] : []), join(hier, 'eingang.ts')], {
  env: { ...process.env, PORT: String(port), EINGANG_HOST: '127.0.0.1', EINGANG_JSON: konfig, VERTRAUTE_PROXYS: '127.0.0.1', ANFRAGEN_PRO_MINUTE: '1000000',
    ...(PLAETZE ? { BUN_CONFIG_MAX_HTTP_REQUESTS: String(PLAETZE) } : {}) }, stdout: 'ignore', stderr: 'inherit',
});
const rss = (pid: number) => Number(Bun.spawnSync(['ps', '-o', 'rss=', '-p', String(pid)]).stdout.toString().trim()) / 1024;
const mb = (x: number) => `${x.toFixed(1)} MB`;

try {
  for (let i = 0; i < 50 && !(await fetch(`${api}/health`).catch(() => null))?.ok; i++) await Bun.sleep(200);
  for (let i = 0; i < 50 && !(await fetch(`${basis}/`, { headers: { host: 'verein.example' } }).catch(() => null)); i++) await Bun.sleep(100);
  const { token } = await (await fetch(`${api}/collections/_superusers/auth-with-password`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identity: 'test@example.com', password: passwort }) })).json() as { token: string };
  await fetch(`${api}/collections/users/records`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: token }, body: JSON.stringify({ email: 'anna@example.com', password: 'geheim-123', passwordConfirm: 'geheim-123', verified: true, freigegeben: true }) });
  const an = await fetch(`${basis}/api/eingang/anmelden`, { method: 'POST', headers: { host: 'verein.example', origin: 'https://verein.example', 'content-type': 'application/json' }, body: JSON.stringify({ email: 'anna@example.com', passwort: 'geheim-123' }) });
  const cookie = (an.headers.get('set-cookie') ?? '').split(';')[0]!;
  if (an.status !== 204) throw new Error(`Anmelden: ${an.status}`);

  await Bun.sleep(2000);
  const leer = rss(eingang.pid), pbLeer = rss(server.pid);
  if (GEHALTEN) {
    // Je 20 von einer Adresse: so viele lässt der Eingang je Adresse offen (GRENZEN.gleichzeitig)
    const offen: { end(): void }[] = [];
    for (let i = 0; i < GEHALTEN; i++) {
      const a = Math.floor(i / 20);
      Bun.connect({ hostname: '127.0.0.1', port, socket: {
        open(s) { offen.push(s); s.write(`GET /halten HTTP/1.1\r\nHost: verein.example\r\nX-Forwarded-For: 10.9.${(a >> 8) & 255}.${a & 255}\r\n\r\n`); },
        data() {}, close() {}, error() {},
      } }).catch(() => {});
    }
    await Bun.sleep(3000);
    const voll = rss(eingang.pid), t = performance.now();
    const besucherin = await Promise.race([fetch(`${basis}/`, { headers: { host: 'verein.example', 'x-forwarded-for': '198.51.100.7' } }).then((r) => r.status), Bun.sleep(4000).then(() => 0)]);
    const ms = performance.now() - t;
    console.log(`Bun ${Bun.version}${SMOL ? ' --smol' : ''}, ${process.platform} ${process.arch}, ${new Date().toISOString().slice(0, 10)}, BUN_CONFIG_MAX_HTTP_REQUESTS ${PLAETZE || '256 (Standard)'}`);
    console.log(`${GEHALTEN} gehaltene Anfragen von ${Math.ceil(GEHALTEN / 20)} Adressen: beim Teil ${gehalten}; Eingang RSS: Leerlauf ${mb(leer)}, mit allen offen ${mb(voll)}`);
    console.log(`Andere Besucherin: ${besucherin || 'keine Antwort'} nach ${(ms / 1000).toFixed(1)} s`);
    loslassen();
    for (const s of offen) s.end();
    await Bun.sleep(500);
  } else {
    let spitze = leer, pbSpitze = pbLeer;
    const uhr = setInterval(() => { spitze = Math.max(spitze, rss(eingang.pid)); pbSpitze = Math.max(pbSpitze, rss(server.pid)); }, 100);
    const zeiten: Record<'offen' | 'geschuetzt', number[]> = { offen: [], geschuetzt: [] };
    const status = new Map<number, number>();
    let n = 0;
    const t0 = performance.now();
    await Promise.all(Array.from({ length: GLEICHZEITIG }, async () => {
      while (n < ANFRAGEN) {
        const i = n++, art = i % 2 ? 'geschuetzt' : 'offen';
        const t = performance.now();
        const r = await fetch(`${basis}${art === 'offen' ? '/' : '/intern/seite.html'}`, { headers: { host: 'verein.example', cookie, 'x-forwarded-for': `10.0.${((i % ADRESSEN) >> 8) & 255}.${(i % ADRESSEN) & 255}` } });
        await r.arrayBuffer();
        zeiten[art].push(performance.now() - t);
        status.set(r.status, (status.get(r.status) ?? 0) + 1);
      }
    }));
    const dauer = (performance.now() - t0) / 1000;
    clearInterval(uhr);
    await Bun.sleep(5000);
    const danach = rss(eingang.pid);
    const p = (xs: number[], q: number) => xs.sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(q * xs.length))]!.toFixed(1);
    console.log(`Bun ${Bun.version}${SMOL ? ' --smol' : ''}, ${process.platform} ${process.arch}, ${new Date().toISOString().slice(0, 10)}, ${ADRESSEN} Adressen`);
    console.log(`Eingang RSS: Leerlauf ${mb(leer)}, Spitze unter Last ${mb(spitze)}, 5 s danach ${mb(danach)}`);
    console.log(`PocketBase RSS: Leerlauf ${mb(pbLeer)}, Spitze ${mb(pbSpitze)}`);
    console.log(`Last: ${ANFRAGEN} Anfragen, ${GLEICHZEITIG} gleichzeitig, ${(ANFRAGEN / dauer).toFixed(0)} je Sekunde; Status ${[...status].map(([s, z]) => `${s}×${z}`).join(', ')}`);
    console.log(`Antwortzeit offen: Median ${p(zeiten.offen, 0.5)} ms, 95 % ${p(zeiten.offen, 0.95)} ms; geschützt (mit Prüfung bei PocketBase): Median ${p(zeiten.geschuetzt, 0.5)} ms, 95 % ${p(zeiten.geschuetzt, 0.95)} ms`);
  }
} finally {
  eingang.kill();
  server.kill();
  loslassen();
  teil.stop(true);
  await Promise.all([eingang.exited, server.exited]);
  rmSync(tmp, { recursive: true, force: true }); // PocketBase protokolliert jede Anfrage, das sind rund 30 MB je Lauf
}
