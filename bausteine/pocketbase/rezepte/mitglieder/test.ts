// Test des Rezepts mitglieder gegen ein echtes PocketBase (Version aus dem Dockerfile), mit einer Mail-Attrappe auf diesem Computer.
//   bun bausteine/pocketbase/rezepte/mitglieder/test.ts      (lädt PocketBase einmal nach ~/.cache, prüft die Prüfsumme)
// Ist das Rezept eingebaut (bausteine/pocketbase/pb_hooks/mitglieder.pb.js), prüft er die eingebauten Dateien, also genau das, was
// ins Netz geht. Sonst das Rezept selbst. Die Seiten (mitglieder.html, bestaetigen.html, passwort.html) prüft er nicht.
import { cpSync, existsSync, mkdirSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { einstellen, lesbar, mailAttrappe, pocketbase, wurzelVon } from '../../programm.ts';

const hier = import.meta.dir, pb = wurzelVon(hier);
const eingebaut = existsSync(join(pb, 'pb_hooks', 'mitglieder.pb.js'));
const tmp = mkdtempSync(join(tmpdir(), 'mitglieder-'));
let fehler = 0;
const pruefe = (ok: unknown, was: string) => { console.log(`${ok ? '✓' : '✗'} ${was}`); if (!ok) fehler++; };

const mails: string[] = [];
const smtp = mailAttrappe((m) => mails.push(lesbar(m)));

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

// Jede Person kommt von einer eigenen Adresse (X-Forwarded-For, wie hinter der Seite), sonst bremst die Grenze für Anmeldungen den Test
let nr = 0;
type Antwort = { status: number; body: Record<string, any> };
const als = (t: string | null) => async (method: string, pfad: string, body?: unknown): Promise<Antwort> => {
  const form = body instanceof FormData;
  const r = await fetch(`${api}${pfad}`, {
    method, body: form ? body : body ? JSON.stringify(body) : undefined,
    headers: { ...(form ? {} : { 'content-type': 'application/json' }), 'x-forwarded-for': `203.0.113.${++nr % 250}`, ...(t ? { authorization: t } : {}) },
  });
  return { status: r.status, body: await r.json().catch(() => ({})) as Record<string, any> };
};
const anmelden = async (email: string, pw: string) => (await als(null)('POST', '/collections/users/auth-with-password', { identity: email, password: pw }));
// Empfänger einer Mail (die Attrappe sieht den Kopf, wie er gesendet wurde)
const an = (mail: string, adresse: string) => new RegExp(`To: <?${adresse.replace(/\./g, '\\.')}>?\\r?$`, 'm').test(mail);
const link = (adresse: string, seite: string) => {
  const m = mails.filter((x) => an(x, adresse)).map((x) => new RegExp(`https://verein\\.example${seite.replace('.', '\\.')}\\?token=([\\w.-]+)`).exec(x)?.[1]).filter(Boolean);
  return m.at(-1) as string | undefined;
};

try {
  for (let i = 0; i < 50 && !(await fetch(`${api}/health`).catch(() => null))?.ok; i++) await Bun.sleep(200);
  const { token } = await (await fetch(`${api}/collections/_superusers/auth-with-password`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ identity: 'test@example.com', password: passwort }),
  })).json() as { token: string };
  const admin = als(token), gast = als(null);
  await einstellen(api, token, smtp.port, 'https://verein.example');

  const probe = (await admin('POST', '/collections/mitteilungen/records', { titel: 'Probe am Freitag', text: '<p>19 Uhr im Saal</p>' })).body.id as string;
  const liste = async (t: string | null) => (await als(t)('GET', '/collections/mitteilungen/records')).body.items?.length as number | undefined;
  pruefe((await liste(null)) === 0, 'Ohne Anmeldung: keine Mitteilungen');

  // Registrieren ist eine Anfrage: Freigabe, Rolle und Bestätigung setzt nie der Browser
  const neu = (email: string, mehr: object = {}) => gast('POST', '/collections/users/records', { name: 'Anna', email, password: 'geheim-123', passwordConfirm: 'geheim-123', ...mehr });
  const selbstGesetzt = await Promise.all([{ freigegeben: true }, { rolle: 'vorstand' }, { verified: true }].map((x) => neu(`frech${Math.random()}@example.com`, x)));
  pruefe(selbstGesetzt.every((r) => r.status === 400), `Registrieren mit freigegeben, rolle oder verified: abgelehnt (${selbstGesetzt.map((r) => r.status)})`);
  const zahl = (await admin('GET', '/collections/users/records?perPage=1')).body.totalItems;
  pruefe(zahl === 0, `Keine dieser Anfragen ist gespeichert (${zahl})`);
  const anna = await neu('anna@example.com');
  pruefe(anna.status === 200 && anna.body.freigegeben === false && anna.body.rolle === '' && anna.body.verified === false, 'Anfrage gespeichert: nicht freigegeben, ohne Rolle, nicht bestätigt');
  await Bun.sleep(300);
  pruefe(link('anna@example.com', '/bestaetigen.html'), 'Mail zum Bestätigen mit Link auf die eigene Seite (bestaetigen.html)');
  pruefe(mails.some((m) => an(m, 'seite@example.com') && m.includes('anna@example.com') && m.includes('möchte in den Mitgliederbereich')), 'Meldung an die Verwaltung: wer möchte hinein');

  const a1 = await anmelden('anna@example.com', 'geheim-123');
  const t1 = a1.body.token as string;
  pruefe(a1.status === 200 && (await liste(t1)) === 0, 'Angemeldet, aber nicht bestätigt und nicht freigegeben: keine Mitteilungen');

  // Die eigene Freigabe oder Rolle kann niemand setzen, auf keinem Weg
  const anna_ = als(t1), id = anna.body.id as string;
  const form = new FormData(); form.set('freigegeben', 'true');
  const versuche = await Promise.all([{ freigegeben: true }, { rolle: 'vorstand' }, { 'rolle+': 'vorstand' }, { verified: true }, form].map((b) => anna_('PATCH', `/collections/users/records/${id}`, b)));
  const danach = (await admin('GET', `/collections/users/records/${id}`)).body;
  pruefe(versuche.every((r) => r.status >= 400 && r.status < 500) && danach.freigegeben === false && danach.rolle === '' && danach.verified === false,
    `Eigene Freigabe, Rolle oder Bestätigung per PATCH (JSON, rolle+, Formular): abgelehnt (${versuche.map((r) => r.status)}), nichts geändert`);
  pruefe((await anna_('PATCH', `/collections/users/records/${id}`, { name: 'Anna Muster' })).body.name === 'Anna Muster', 'Den eigenen Namen ändern geht');

  const bestaetigt = await gast('POST', '/collections/users/confirm-verification', { token: link('anna@example.com', '/bestaetigen.html') });
  pruefe(bestaetigt.status === 204 && (await anna_('GET', `/collections/users/records/${id}`)).body.verified === true, 'Link aus der Mail bestätigt die Adresse');
  pruefe((await liste(t1)) === 0, 'Bestätigt, aber noch nicht freigegeben: keine Mitteilungen');

  const frei = await admin('PATCH', `/collections/users/records/${id}`, { freigegeben: true, rolle: 'mitglied' });
  await Bun.sleep(300);
  pruefe(frei.status === 200 && mails.some((m) => an(m, 'anna@example.com') && m.includes('Du bist freigeschaltet') && m.includes('https://verein.example/mitglieder.html')),
    'Die Verwaltung schaltet frei: Mail an die Person mit dem Link zum Mitgliederbereich');
  pruefe((await liste(t1)) === 1 && (await anna_('GET', `/collections/mitteilungen/records/${probe}`)).status === 200, 'Bestätigt und freigegeben: Mitteilungen sichtbar');

  // Freigegeben ohne bestätigte Adresse reicht nicht
  const bert = (await neu('bert@example.com', { name: 'Bert' })).body.id as string;
  await admin('PATCH', `/collections/users/records/${bert}`, { freigegeben: true });
  const tb = (await anmelden('bert@example.com', 'geheim-123')).body.token as string;
  pruefe((await liste(tb)) === 0, 'Freigegeben, aber Adresse nicht bestätigt: keine Mitteilungen');
  const sieht = (await anna_('GET', '/collections/users/records')).body.items as { id: string }[];
  pruefe(sieht.length === 1 && sieht[0]!.id === id && (await anna_('GET', `/collections/users/records/${bert}`)).status === 404, 'Mitglieder sehen nur das eigene Konto');

  // Passwort vergessen: Link auf die eigene Seite, das alte Passwort gilt danach nicht mehr
  const vorMails = mails.length;
  pruefe((await gast('POST', '/collections/users/request-password-reset', { email: 'niemand@example.com' })).status === 204, 'Unbekannte Adresse: gleiche Antwort (204), verrät nichts');
  pruefe((await gast('POST', '/collections/users/request-password-reset', { email: 'anna@example.com' })).status === 204, 'Passwort vergessen angefragt');
  await Bun.sleep(300);
  const reset = link('anna@example.com', '/passwort.html');
  pruefe(reset && mails.length === vorMails + 1, 'Genau eine Mail, mit Link auf die eigene Seite (passwort.html)');
  const neuGesetzt = await gast('POST', '/collections/users/confirm-password-reset', { token: reset, password: 'neues-geheim-456', passwordConfirm: 'neues-geheim-456' });
  pruefe(neuGesetzt.status === 204, 'Neues Passwort mit dem Link gesetzt');
  pruefe((await anmelden('anna@example.com', 'geheim-123')).status === 400 && (await anmelden('anna@example.com', 'neues-geheim-456')).status === 200, 'Altes Passwort gilt nicht mehr, das neue schon');
  pruefe((await anna_('POST', '/collections/users/auth-refresh')).status === 401, 'Alte Anmeldung ist nach dem neuen Passwort ungültig');

  // Keine Mail führt auf die Verwaltung, alle auf die eigene Adresse
  pruefe(!mails.some((m) => m.includes('/_/')) && mails.every((m) => !m.includes('Acme')), `Keine Mail verweist auf /_/ oder nennt «Acme» (${mails.length} Mails)`);
} finally {
  server.kill();
  smtp.stop(true);
  const log = await new Response(server.stderr).text();
  if (fehler && log.trim()) console.log(log.slice(-2000));
}
console.log(fehler ? `\n${fehler} Prüfungen fehlgeschlagen` : '\nAlles grün');
process.exit(fehler ? 1 : 0);
