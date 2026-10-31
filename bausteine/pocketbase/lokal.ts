// Die Seite mit PocketBase auf diesem Computer, bevor etwas ins Netz geht (Skill bausteine): echtes Buchen, echte Mails, nur lokal.
//   bun bausteine/pocketbase/lokal.ts                  die gebaute Seite aus seite/ (vorher in web/ «npm run build») unter http://localhost:8090
//   --seite <ordner>  --port <zahl>
//   --eingang  [--eingang-port <zahl>]               mit dem Baustein eingang davor (bausteine/eingang), die Seite dann unter http://localhost:8080
// Bei jedem Start frisch (eigener Temp-Ordner). Die Daten aus pb_migrations kommen mit, also auch der Wochenplan der Person
// (3_kurse.js). Mails gehen an niemanden, sie erscheinen hier im Terminal. Für die Verwaltung (verwaltung.html und /_/) gibt es
// ein Konto nur für diesen Computer, es steht unten. Beenden mit Ctrl+C.
import { cpSync, existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { einstellen, lesbar, mailAttrappe, pocketbase, wurzelVon } from './programm.ts';

const args = process.argv.slice(2);
const wert = (n: string) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const wurzel = wurzelVon(import.meta.dir);
const seite = resolve(wert('--seite') ?? join(wurzel, '../../seite'));
const port = Number(wert('--port') ?? 8090), adresse = `http://localhost:${port}`, api = `${adresse}/api`;
if (!existsSync(join(seite, 'index.html'))) {
  console.error(`${seite}/index.html fehlt: zuerst die Seite bauen (in web/ «npm run build»), oder --seite <ordner> angeben.`);
  process.exit(2);
}

const tmp = mkdtempSync(join(tmpdir(), 'pocketbase-lokal-'));
cpSync(join(wurzel, 'pb_migrations'), join(tmp, 'pb_migrations'), { recursive: true });
cpSync(join(wurzel, 'pb_hooks'), join(tmp, 'pb_hooks'), { recursive: true });
const dirs = [`--dir=${join(tmp, 'pb_data')}`, `--migrationsDir=${join(tmp, 'pb_migrations')}`, `--hooksDir=${join(tmp, 'pb_hooks')}`];
const env = { ...process.env, TZ: 'Europe/Zurich' };
const programm = await pocketbase(wurzel);
const konto = 'lokal@albatros.test', passwort = crypto.randomUUID().slice(0, 18);
Bun.spawnSync([programm, 'superuser', 'upsert', konto, passwort, ...dirs], { env });
const server = Bun.spawn([programm, 'serve', `--http=127.0.0.1:${port}`, `--publicDir=${seite}`, ...dirs], { env, stdout: 'inherit', stderr: 'inherit' });
const prozesse: { kill(): void }[] = [server];
process.on('SIGINT', () => { for (const p of prozesse) p.kill(); process.exit(0); });

// Mit dem Eingang: Er bekommt eingang.json aus dem Projekt, nur gehen alle Teile an dieses PocketBase (es liefert lokal auch die Seite aus)
let seitenAdresse = adresse;
if (args.includes('--eingang')) {
  const ordner = join(wurzel, '..', 'eingang');
  if (!existsSync(join(ordner, 'eingang.json'))) { console.error(`${ordner}/eingang.json fehlt: zuerst den Baustein eingang holen (Skill bausteine).`); server.kill(); process.exit(2); }
  const konfig = JSON.parse(readFileSync(join(ordner, 'eingang.json'), 'utf8')) as { teile: { ziel: string }[] };
  for (const t of konfig.teile) t.ziel = `http://127.0.0.1:${port}`;
  const eingangPort = Number(wert('--eingang-port') ?? 8080);
  seitenAdresse = `http://localhost:${eingangPort}`;
  writeFileSync(join(tmp, 'eingang.json'), JSON.stringify({ ...konfig, ursprung: seitenAdresse }));
  prozesse.push(Bun.spawn([process.execPath, '--smol', join(ordner, 'eingang.ts')], {
    env: { ...env, PORT: String(eingangPort), EINGANG_JSON: join(tmp, 'eingang.json'), VERTRAUTE_PROXYS: '' }, stdout: 'ignore', stderr: 'inherit',
  }));
}

// Mails im Terminal: an wen, Betreff und Text
const smtp = mailAttrappe((roh) => {
  const kopf = roh.slice(0, roh.indexOf('\r\n\r\n'));
  const an = /^To: (.*)$/m.exec(kopf)?.[1] ?? '?';
  // Betreff mit Umlauten kommt als =?UTF-8?q?…?=, oft in mehreren Stücken
  const betreff = (/^Subject: (.*(?:\r\n[ \t].*)*)/m.exec(kopf)?.[1] ?? '').replace(/\r\n[ \t]/g, ' ').replace(/\?=\s+=\?UTF-8\?q\?/gi, '')
    .replace(/=\?UTF-8\?q\?(.*?)\?=/gi, (_, q: string) => lesbar(q.replace(/_/g, ' ')));
  const text = /Content-Type: text\/plain[^\n]*\r?\n\r?\n([\s\S]*?)\r?\n--/.exec(lesbar(roh))?.[1]?.trim() ?? '';
  console.log(`\n── Mail an ${an}: ${betreff}\n${text}\n──`);
});

for (let i = 0; i < 50 && !(await fetch(`${api}/health`).catch(() => null))?.ok; i++) await Bun.sleep(200);
const anmeldung = await fetch(`${api}/collections/_superusers/auth-with-password`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identity: konto, password: passwort }),
});
if (!anmeldung.ok) { console.error(`PocketBase antwortet nicht wie erwartet (${anmeldung.status}).`); for (const p of prozesse) p.kill(); process.exit(1); }
await einstellen(api, ((await anmeldung.json()) as { token: string }).token, smtp.port, seitenAdresse);

console.log(`
Läuft auf diesem Computer, nichts davon ist im Netz:
  Seite:          ${seitenAdresse}/${seitenAdresse !== adresse ? '  (durch den Eingang; geschützte Teile nur mit Anmeldung)' : ''}
  Verwaltung:     ${adresse}/verwaltung.html (falls eingebaut) und ${adresse}/_/
  Konto (nur hier): ${konto}  Passwort: ${passwort}
  Mails erscheinen hier im Terminal. Beenden mit Ctrl+C.`);
await server.exited;
