// Der Eingang (Baustein eingang): eine Tür für alle Teile einer Seite. Er entscheidet bei jeder Anfrage nach dem Pfad, zu welchem Teil
// sie geht und ob es dafür eine Anmeldung braucht. Angemeldet ist, wen PocketBase kennt (GET /api/eingang/pruefen, pb_hooks/eingang.pb.js).
// Nur Bun, keine Pakete. Muster: das Gateway von amouk (services/gateway).
//   bun eingang.ts                 liest eingang.json daneben (oder die Datei in EINGANG_JSON)
//   PORT                           Standard 8080
//   EINGANG_HOST                   die Adresse, auf der er hört, lokal 127.0.0.1 (lokal.ts); leer: alle Adressen, wie im Container nötig
//                                  (nicht HOSTNAME: Docker setzt es im Container auf die Container-ID)
//   URSPRUNG                       ersetzt «ursprung» aus eingang.json, zum Beispiel lokal http://localhost:8080
//   VERTRAUTE_PROXYS               Adressen oder Netze (10.0.0.0/8), deren X-Forwarded-For gilt; «*»: jede Verbindung kommt über einen
//                                  Proxy, der X-Forwarded-For neu setzt (Albatros-Server: die Kante). Leer: die Adresse der Verbindung.
//   ANFRAGEN_PRO_MINUTE            Grenze je Adresse, Standard 600
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const COOKIE = '__Host-sitzung';
export const GRENZEN = {
  kopfBytes: 8 * 1024,              // alle Kopfzeilen zusammen (Bun selbst lehnt ab 16 KB ab)
  koerperBytes: 10 * 1024 * 1024,   // wie client_max_body_size in pocketbase/nginx.conf
  anfragenProMinute: 600,           // je Adresse; eine Seite mit Bildern braucht 20 bis 40 Anfragen
  anmeldenProMinute: 10,            // je Adresse, über den Eingang und auth-with-* zusammen; PocketBase selbst erlaubt 5 in 60 Sekunden (pb_migrations/2_eingang.js)
  gleichzeitig: 20,                 // offene Anfragen je Adresse, bis die Antwort ganz durch ist, sonst 429 (fetch für alle: Bun 256, Dockerfile 1024)
  pocketbaseMs: 2000,               // so lange darf die Prüfung der Anmeldung dauern, sonst 503
  teilMs: 60_000,                   // so lange darf ein Teil bis zur Antwort brauchen, sonst 504 (Bun.serve wartet darum länger, idleTimeout)
};
// Verwaltung und Interna von PocketBase sind von aussen nie erreichbar (404), dazu jede Punktdatei ausser /.well-known/. Auch die Echtzeit
// (/api/realtime): Kein Rezept braucht sie, und jede Verbindung bliebe offen und hielte einen der Plätze für alle.
const VERWALTUNG = ['/_', '/admin', '/api/collections/_superusers', '/api/settings', '/api/backups', '/api/logs', '/api/crons', '/api/collections/meta', '/api/realtime'];
// Anmeldeversuche zählen zusätzlich (anmeldenProMinute), über den Eingang und die Wege von PocketBase (auth-with-password, -otp, -oauth2)
const ANMELDEN = /^\/api\/(eingang\/anmelden$|collections\/[^/]+\/auth-with-)/;
const HOP = new Set(['connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'te', 'trailer', 'upgrade', 'proxy-authorization', 'proxy-authenticate', 'host', 'content-length']);
const NAME = /^[a-z0-9][a-z0-9-]{0,31}$/;

export type Zugang = 'offen' | 'angemeldet' | `rolle:${string}`;
export type Teil = { name: string; ziel: string; pfade: string[]; zugang: Zugang };
export type Einstellungen = { urspruenge: Set<string>; anmeldeseite: string; teile: Teil[]; wege: [string, Teil][]; pocketbase: Teil };
type Ergebnis<T> = { ok: true; wert: T } | { ok: false; fehler: string[] };

// eingang.json prüfen, bevor der Eingang startet: Ein Fehler hier heisst, er startet nicht (und die alte Version bleibt online)
export function einstellungen(roh: unknown, ursprungEnv?: string): Ergebnis<Einstellungen> {
  const fehler: string[] = [];
  const o = (typeof roh === 'object' && roh !== null ? roh : {}) as Record<string, unknown>;
  const urspruenge = new Set<string>();
  const liste = ursprungEnv ? ursprungEnv.split(',') : Array.isArray(o.ursprung) ? o.ursprung : [o.ursprung];
  for (const u of liste) {
    const url = typeof u === 'string' ? URL.parse(u.trim()) : null;
    if (typeof u === 'string' && /(^|\/\/)NAME\./.test(u)) fehler.push('ursprung: trag die Adresse deiner Seite ein (statt NAME)');
    else if (!url || !/^https?:$/.test(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search) fehler.push(`ursprung: «${String(u)}» ist keine Adresse wie https://anna.aufwind.sh`);
    else urspruenge.add(url.origin);
  }
  const anmeldeseite = o.anmeldeseite ?? '/mitglieder.html';
  if (typeof anmeldeseite !== 'string' || !anmeldeseite.startsWith('/') || anmeldeseite.startsWith('//')) fehler.push('anmeldeseite: ein Pfad wie /mitglieder.html');
  const teile: Teil[] = [];
  if (!Array.isArray(o.teile) || !o.teile.length) fehler.push('teile: mindestens ein Teil');
  for (const t of Array.isArray(o.teile) ? o.teile as Record<string, unknown>[] : []) {
    const name = typeof t?.name === 'string' ? t.name : '';
    const was = `teile «${name || '?'}»`;
    if (!NAME.test(name)) fehler.push(`${was}: name klein, mit Bindestrichen, höchstens 32 Zeichen`);
    const ziel = typeof t?.ziel === 'string' ? URL.parse(t.ziel) : null;
    if (!ziel || !/^https?:$/.test(ziel.protocol) || ziel.username || ziel.password || ziel.pathname !== '/' || ziel.search || ziel.hash) fehler.push(`${was}: ziel wie http://webseite:80 (ohne Pfad)`);
    const pfade = Array.isArray(t?.pfade) ? t.pfade : [];
    if (!pfade.length || !pfade.every((p) => typeof p === 'string' && p.startsWith('/') && !/\/\/|\.\.|%|\\|\s/.test(p))) fehler.push(`${was}: pfade wie ["/intern/"]`);
    const zugang = t?.zugang;
    if (typeof zugang !== 'string' || !(zugang === 'offen' || zugang === 'angemeldet' || (zugang.startsWith('rolle:') && NAME.test(zugang.slice(6))))) fehler.push(`${was}: zugang offen, angemeldet oder rolle:<name>`);
    if (teile.some((x) => x.name === name)) fehler.push(`${was}: den Namen gibt es zweimal`);
    teile.push({ name, ziel: ziel?.origin ?? '', pfade: pfade as string[], zugang: zugang as Zugang });
  }
  const wege: [string, Teil][] = [];
  for (const t of teile) for (const p of t.pfade) {
    if (wege.some(([q]) => q === p)) fehler.push(`Pfad ${p} gehört zu zwei Teilen`);
    wege.push([p, t]);
  }
  wege.sort((a, b) => b[0].length - a[0].length);
  const pocketbase = teile.find((t) => t.name === 'pocketbase');
  if (!pocketbase) fehler.push('teile: ein Teil heisst pocketbase (das Login)');
  else if (!pocketbase.pfade.includes('/api/') || pocketbase.zugang !== 'offen') fehler.push('teile «pocketbase»: pfade mit "/api/" und zugang offen (PocketBase prüft selbst)');
  if (typeof anmeldeseite === 'string' && teile.length && teilFuer(wege, anmeldeseite)?.zugang !== 'offen') fehler.push('anmeldeseite: muss in einem offenen Teil liegen');
  if (fehler.length) return { ok: false, fehler };
  return { ok: true, wert: { urspruenge, anmeldeseite: anmeldeseite as string, teile, wege, pocketbase: pocketbase! } };
}

// Präfix «/intern/» passt auf /intern und alles darunter, «/» auf alles; der längste gewinnt
const passt = (pfad: string, p: string) => (p.endsWith('/') ? pfad.startsWith(p) || pfad === p.slice(0, -1) : pfad === p || pfad.startsWith(`${p}/`));
const teilFuer = (wege: [string, Teil][], pfad: string) => wege.find(([p]) => passt(pfad, p))?.[1];

// Der Pfad, auf dem entschieden wird: new URL hat . und .. schon aufgelöst. Kodierte Punkte, Schrägstriche, Rückstriche und Nullbytes,
// doppelte Schrägstriche und Steuerzeichen gibt es in echten Adressen nicht; sie dienen nur dazu, Regeln zu umgehen.
export function pfadVon(pathname: string): string | null {
  if (/%(2e|2f|5c|00)/i.test(pathname) || pathname.includes('//') || pathname.includes('\\')) return null;
  try {
    const d = decodeURIComponent(pathname);
    return /[\u0000-\u001f\u007f]/.test(d) ? null : d;
  } catch {
    return null;
  }
}

// PocketBase findet eine Sammlung ohne Gross/Klein (Go strings.EqualFold, also auch «ſ» für «s» und «K» für «k») und über ihre ID
// (pbc_<Ziffern>, für _superusers in jeder PocketBase gleich). Darum vergleicht der Eingang so, wie PocketBase auflöst: Systemsammlungen
// (alle mit «_» am Anfang, etwa _superusers) und Sammlungen über ihre ID bleiben zu, egal wie geschrieben. Die Seiten nennen Sammlungen
// beim Namen. PocketBase prüft dasselbe noch einmal (pb_hooks/eingang.pb.js, mit dem Kopf x-eingang-weg).
const systemOderId = (pfad: string) => {
  const s = /^\/api\/collections\/([^/]+)/.exec(pfad)?.[1]?.toUpperCase().toLowerCase();
  return s !== undefined && (s.startsWith('_') || /^pbc_\d+$/.test(s));
};

export const verwaltung = (pfad: string) =>
  VERWALTUNG.some((v) => pfad === v || pfad.startsWith(`${v}/`)) || /^\/api\/collections\/?$|^\/api\/collections\/[^/]+\/?$|^\/api\/collections\/[^/]+\/(truncate|impersonate)(\/|$)/.test(pfad) ||
  systemOderId(pfad) || pfad.split('/').some((s) => s.startsWith('.') && s !== '.well-known');

// Adressen als 16 Bytes (IPv4 als ::ffff:a.b.c.d), damit Netze wie 10.0.0.0/8 und fd00::/8 gleich gerechnet werden
export function ipBytes(ip: string): Uint8Array | null {
  const v4 = /^(?:::ffff:)?(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/i.exec(ip);
  if (v4) {
    const b = new Uint8Array(16);
    b[10] = 0xff; b[11] = 0xff;
    for (let i = 0; i < 4; i++) { const n = Number(v4[i + 1]); if (n > 255) return null; b[12 + i] = n; }
    return b;
  }
  if (!/^[0-9a-f:]+$/i.test(ip) || ip.split('::').length > 2) return null;
  const [kopf = '', schwanz = ''] = ip.split('::');
  const h = kopf ? kopf.split(':') : [], t = schwanz ? schwanz.split(':') : [];
  const fehlt = 8 - h.length - t.length;
  if ((ip.includes('::') ? fehlt < 1 : fehlt !== 0) || [...h, ...t].some((x) => !/^[0-9a-f]{1,4}$/i.test(x))) return null;
  const teile = [...h, ...Array<string>(ip.includes('::') ? fehlt : 0).fill('0'), ...t].map((x) => parseInt(x, 16));
  const b = new Uint8Array(16);
  teile.forEach((x, i) => { b[2 * i] = x >> 8; b[2 * i + 1] = x & 0xff; });
  return b;
}

type Netz = { b: Uint8Array; bits: number };
export function netze(roh: string | undefined): { alle: boolean; liste: Netz[] } | null {
  const liste: Netz[] = [];
  let alle = false;
  for (const s of (roh ?? '').split(',').map((x) => x.trim()).filter(Boolean)) {
    if (s === '*') { alle = true; continue; }
    const [ip = '', laenge] = s.split('/');
    const b = ipBytes(ip);
    const v4 = b !== null && ip.includes('.');
    const bits = laenge === undefined ? 128 : Number(laenge) + (v4 ? 96 : 0);
    if (!b || !Number.isInteger(bits) || bits < (v4 ? 96 : 0) || bits > 128) return null;
    liste.push({ b, bits });
  }
  return { alle, liste };
}
const imNetz = (b: Uint8Array, n: Netz) => {
  for (let i = 0; i < 16; i++) {
    const rest = n.bits - 8 * i;
    if (rest <= 0) return true;
    const maske = rest >= 8 ? 0xff : (0xff << (8 - rest)) & 0xff;
    if ((b[i]! & maske) !== (n.b[i]! & maske)) return false;
  }
  return true;
};
const lesbar = (b: Uint8Array) => (b.slice(0, 12).every((x, i) => x === (i >= 10 ? 0xff : 0)) ? [...b.slice(12)].join('.')
  : Array.from({ length: 8 }, (_, i) => ((b[2 * i]! << 8) | b[2 * i + 1]!).toString(16)).join(':'));

// Die Adresse der Besucherin: die der Verbindung, ausser sie ist ein vertrauter Proxy; dann von rechts der erste Eintrag in
// X-Forwarded-For, der kein vertrauter Proxy ist. «*» vertraut der Verbindung und nimmt den letzten Eintrag.
export function adresse(verbindung: string, xff: string | null, v: { alle: boolean; liste: Netz[] }) {
  const b = ipBytes(verbindung);
  if (!b) return verbindung;
  const vertraut = (x: Uint8Array) => v.liste.some((n) => imNetz(x, n));
  if (!v.alle && !vertraut(b)) return lesbar(b);
  const kette = (xff ?? '').split(',').map((x) => x.trim()).filter(Boolean);
  for (let i = kette.length - 1; i >= 0; i--) {
    const x = ipBytes(kette[i]!);
    if (!x) break;
    if (!vertraut(x) || i === 0) return lesbar(x);
  }
  return lesbar(b);
}

// Zähler je Adresse (IPv6 je /64), feste Fenster von einer Minute. Höchstens 10 000 Adressen, die volle Liste kostet gemessen etwa 10 MB
// (bei 20 000 waren es 40 MB): Ist sie voll, fallen die abgelaufenen weg, sonst alle. Lieber kurz ohne Zähler als ohne Speicher.
function zaehler(jetzt: () => number) {
  const n = new Map<string, { zahl: number; bis: number }>();
  return (schluessel: string, max: number): number => {
    const t = jetzt();
    let h = n.get(schluessel);
    if (!h || h.bis <= t) {
      if (!h && n.size >= 10_000) { for (const [k, x] of n) if (x.bis <= t) n.delete(k); if (n.size >= 10_000) n.clear(); }
      h = { zahl: 0, bis: t + 60_000 };
      n.set(schluessel, h);
    }
    h.zahl++;
    return h.zahl > max ? Math.max(1, Math.ceil((h.bis - t) / 1000)) : 0;
  };
}
const netzVon = (a: string) => (a.includes(':') ? `${a.split(':').slice(0, 4).join(':')}::/64` : a);

const cookieWert = (kopf: string | null, name: string) => {
  for (const teil of (kopf ?? '').split(';')) {
    const i = teil.indexOf('=');
    if (i > 0 && teil.slice(0, i).trim() === name) return teil.slice(i + 1).trim();
  }
  return null;
};
const MELDUNG: Record<number, string> = {
  400: 'Diese Adresse gibt es so nicht.', 401: 'Dafür musst du angemeldet sein.', 403: 'Das ist nicht erlaubt.', 404: 'Nicht gefunden.',
  413: 'Die Anfrage ist zu gross.', 429: 'Zu viele Anfragen. Warte bitte einen Moment.', 431: 'Die Anfrage ist zu gross.',
  500: 'Da ist etwas schiefgegangen.', 502: 'Dieser Teil der Seite antwortet gerade nicht.', 503: 'Die Anmeldung lässt sich gerade nicht prüfen. Versuch es gleich nochmals.',
  504: 'Dieser Teil der Seite antwortet gerade nicht rechtzeitig.',
};
const json = (status: number, kopf: Record<string, string> = {}, meldung = MELDUNG[status]) =>
  new Response(JSON.stringify({ status, message: meldung }), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...kopf } });

// Für Menschen im Browser: eine kleine Seite mit dem Weg zur Anmeldung statt JSON
function seite(status: 401 | 403, anmeldeseite: string, zurueck: string) {
  const link = `${anmeldeseite}?weiter=${encodeURIComponent(zurueck)}`.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const [titel, satz] = status === 401 ? ['Bitte anmelden', 'Diese Seite ist nur für freigeschaltete Mitglieder.'] : ['Kein Zugang', 'Dafür fehlt deinem Konto die Berechtigung.'];
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">`
    + `<title>${titel}</title></head><body style="font:17px/1.5 system-ui,sans-serif;max-width:640px;margin:0 auto;padding:24px 16px"><h1>${titel}</h1><p>${satz}</p>`
    + `<p><a href="${link}">${status === 401 ? 'Zur Anmeldung' : 'Mit einem anderen Konto anmelden'}</a></p></body></html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

// Pfad fürs Protokoll ohne Kennungen, Codes und Abfrage: /api/collections/mitteilungen/records/:id. Record-IDs von PocketBase haben
// 15 Zeichen aus a-z und 0-9, nicht jede hat eine Ziffer.
const ohneKennungen = (pfad: string) => pfad.split('/').map((s) => (/\d/.test(s) || s.length > 20 || /^[a-z0-9]{15}$/.test(s) ? ':id' : s)).join('/');

// Der Körper geht unverändert durch. Ist er ganz durch, bricht er ab oder bricht die Besucherin ab, wird der Platz frei.
function durch(koerper: ReadableStream<Uint8Array>, frei: () => void) {
  const leser = koerper.getReader();
  return new ReadableStream<Uint8Array>({
    async pull(c) {
      try {
        const { done, value } = await leser.read();
        if (done) { frei(); c.close(); } else c.enqueue(value);
      } catch (err) {
        frei();
        c.error(err);
      }
    },
    cancel(grund) { frei(); return leser.cancel(grund); },
  });
}

export type Optionen = { vertraut?: string; anfragenProMinute?: number; jetzt?: () => number; log?: (zeile: string) => void };

export function eingang(e: Einstellungen, o: Optionen = {}) {
  const vertraut = netze(o.vertraut);
  if (!vertraut) throw new Error('VERTRAUTE_PROXYS: Adressen oder Netze wie 10.0.0.0/8, durch Kommas getrennt, oder *');
  const zaehle = zaehler(o.jetzt ?? Date.now);
  const laufend = new Map<string, number>(); // offene Anfragen je Adresse (IPv6 je /64); leer, sobald alle durch sind
  const proMinute = o.anfragenProMinute ?? GRENZEN.anfragenProMinute;
  const log = o.log ?? ((z: string) => console.log(z));
  const [hauptUrsprung] = e.urspruenge;
  const proto = new URL(hauptUrsprung!).protocol.slice(0, -1);

  // Wer ist angemeldet? PocketBase sagt es (204 mit Kennung und Rolle, sonst 401). Antwortet es nicht innert 2 s: 503.
  async function pruefen(cookie: string | null, authorization: string | null, host: string, wer: string) {
    const kopf: Record<string, string> = { host, 'x-forwarded-for': wer };
    if (cookie) kopf.cookie = `${COOKIE}=${cookie}`;
    if (authorization) kopf.authorization = authorization;
    try {
      const r = await fetch(`${e.pocketbase.ziel}/api/eingang/pruefen`, { headers: kopf, redirect: 'manual', signal: AbortSignal.timeout(GRENZEN.pocketbaseMs) });
      await r.body?.cancel();
      const id = r.headers.get('x-eingang-benutzer') ?? '', rolle = r.headers.get('x-eingang-rolle') ?? '';
      if (r.status === 204 && /^[a-z0-9]{1,32}$/.test(id) && NAME.test(rolle)) return { id, rolle } as const;
      if (r.status === 401) return 'nein' as const;
      return r.status === 429 ? ('viele' as const) : ('fehler' as const);
    } catch {
      return 'fehler' as const;
    }
  }

  async function behandeln(req: Request, verbindung: string): Promise<{ res: Response; teil: string; pfad: string }> {
    let kopfBytes = 0;
    req.headers.forEach((v, k) => { kopfBytes += k.length + v.length + 4; });
    if (kopfBytes > GRENZEN.kopfBytes) return { res: json(431), teil: '-', pfad: '-' };
    if (Number(req.headers.get('content-length') ?? 0) > GRENZEN.koerperBytes) return { res: json(413), teil: '-', pfad: '-' };

    const wer = adresse(verbindung, req.headers.get('x-forwarded-for'), vertraut!);
    const url = new URL(req.url);
    const pfad = pfadVon(url.pathname);
    const warten = zaehle(`a:${netzVon(wer)}`, proMinute) || (pfad !== null && ANMELDEN.test(pfad) ? zaehle(`m:${netzVon(wer)}`, GRENZEN.anmeldenProMinute) : 0);
    if (warten) return { res: json(429, { 'retry-after': String(warten) }), teil: '-', pfad: '-' };
    if (pfad === null) return { res: json(400), teil: '-', pfad: '-' };
    const protokoll = ohneKennungen(pfad);
    const teil = verwaltung(pfad) ? undefined : teilFuer(e.wege, pfad);
    if (!teil) return { res: json(404), teil: '-', pfad: protokoll };
    const pb = teil === e.pocketbase;

    // Schreiben: nie aus fremden Seiten, und mit der Sitzung nur mit eigenem Ursprung (Schutz vor untergeschobenen Anfragen). Eigen ist
    // die Adresse, an die die Anfrage ging (den Host setzt die Kante; eine fremde Seite kann keinen Origin schicken, der ihm gleicht), so
    // gilt auch eine eigene Domain ohne Eintrag. Wie eigeneHerkunft in pb_hooks/eingang.js; die Liste ursprung bleibt für Ausnahmen.
    const cookie = cookieWert(req.headers.get('cookie'), COOKIE);
    const origin = req.headers.get('origin');
    const eigen = origin !== null && (e.urspruenge.has(origin) || origin === `${proto}://${url.host}`);
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && (origin !== null ? !eigen : cookie !== null)) return { res: json(403), teil: teil.name, pfad: protokoll };

    // Ab hier geht es ins Netz (Prüfung bei PocketBase, der Teil). Je Adresse höchstens GRENZEN.gleichzeitig offene Anfragen, bis die
    // Antwort ganz durch ist; sonst belegte eine Adresse mit langsamen Anfragen alle Plätze, die Bun für fetch hat, und alle warteten.
    const netz = netzVon(wer);
    if ((laufend.get(netz) ?? 0) >= GRENZEN.gleichzeitig) return { res: json(429, { 'retry-after': '5' }), teil: teil.name, pfad: protokoll };
    const platz = belegen(netz);
    req.signal.addEventListener('abort', platz.frei, { once: true });
    try {
      return await weiterleiten(req, url, wer, teil, pb, cookie, protokoll, platz);
    } finally {
      if (!platz.beimKoerper) platz.frei();
    }
  }

  // Einen Platz belegen. frei() gibt ihn zurück (mehrmals schadet nicht); beimKoerper: Der Körper der Antwort gibt ihn frei, wenn er durch ist
  function belegen(netz: string) {
    laufend.set(netz, (laufend.get(netz) ?? 0) + 1);
    let zurueck = false;
    const platz = { beimKoerper: false, frei: () => {
      if (zurueck) return;
      zurueck = true;
      const n = (laufend.get(netz) ?? 1) - 1;
      if (n > 0) laufend.set(netz, n); else laufend.delete(netz);
    } };
    return platz;
  }

  async function weiterleiten(req: Request, url: URL, wer: string, teil: Teil, pb: boolean, cookie: string | null, protokoll: string,
    platz: ReturnType<typeof belegen>): Promise<{ res: Response; teil: string; pfad: string }> {
    const authorization = req.headers.get('authorization');
    let angemeldet: { id: string; rolle: string } | null = null;
    if (teil.zugang !== 'offen') {
      const html = req.method === 'GET' && (req.headers.get('accept') ?? '').includes('text/html');
      const zurueck = url.pathname + url.search;
      const ergebnis = cookie || authorization ? await pruefen(cookie, authorization, url.host, wer) : 'nein';
      if (ergebnis === 'fehler') return { res: json(503, { 'retry-after': '5' }), teil: teil.name, pfad: protokoll };
      if (ergebnis === 'viele') return { res: json(429, { 'retry-after': '10' }), teil: teil.name, pfad: protokoll };
      // Das Cookie bleibt: Es läuft mit dem Token ab, und wer auf die Freigabe wartet, soll angemeldet bleiben
      if (ergebnis === 'nein') return { res: html ? seite(401, e.anmeldeseite, zurueck) : json(401), teil: teil.name, pfad: protokoll };
      if (teil.zugang.startsWith('rolle:') && ergebnis.rolle !== teil.zugang.slice(6)) {
        return { res: html ? seite(403, e.anmeldeseite, zurueck) : json(403), teil: teil.name, pfad: protokoll };
      }
      angemeldet = ergebnis;
    }

    // Weiter an den Teil: fremde x-eingang-* und Weiterleitungs-Köpfe weg; Cookie und Authorization bekommt nur PocketBase. Köpfe mit
    // Unterstrich fallen ganz weg (wie bei nginx): Server nach WSGI oder CGI lesen x_eingang_rolle wie x-eingang-rolle.
    const kopf = new Headers();
    req.headers.forEach((v, k) => {
      if (k.includes('_') || HOP.has(k) || k.startsWith('x-eingang-') || k.startsWith('x-forwarded-') || k === 'forwarded' || k === 'x-real-ip') return;
      if (!pb && (k === 'cookie' || k === 'authorization')) return;
      kopf.set(k, v);
    });
    kopf.set('host', url.host);
    kopf.set('x-forwarded-for', wer);
    kopf.set('x-forwarded-proto', proto);
    kopf.set('x-forwarded-host', url.host);
    // Für PocketBase: Die Anfrage kommt von aussen. Dann gilt dort kein Konto der Verwaltung und keine Systemsammlung (zweite Schicht)
    if (pb) kopf.set('x-eingang-weg', 'aussen');
    if (angemeldet) { kopf.set('x-eingang-benutzer', angemeldet.id); kopf.set('x-eingang-rolle', angemeldet.rolle); }

    const halt = new AbortController();
    const uhr = setTimeout(() => halt.abort(new DOMException('Zeit abgelaufen', 'TimeoutError')), GRENZEN.teilMs);
    req.signal.addEventListener('abort', () => halt.abort());
    let res: Response;
    try {
      res = await fetch(`${teil.ziel}${url.pathname}${url.search}`, {
        method: req.method, headers: kopf, body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body, redirect: 'manual', signal: halt.signal, decompress: false,
      } as RequestInit);
    } catch {
      return { res: json(halt.signal.reason instanceof DOMException && halt.signal.reason.name === 'TimeoutError' ? 504 : 502), teil: teil.name, pfad: protokoll };
    } finally {
      clearTimeout(uhr);
    }

    // Antwort: keine x-eingang-* nach aussen; die Sitzung setzt nur PocketBase; hinter dem Login nichts im Zwischenspeicher
    const aus = new Headers();
    // content-length bleibt: Der Körper geht unverändert durch (auch komprimiert, decompress: false)
    res.headers.forEach((v, k) => { if ((!HOP.has(k) || k === 'content-length') && !k.startsWith('x-eingang-') && k !== 'set-cookie') aus.append(k, v); });
    // Den Namen lesen wie der Browser: bis zum ersten «=», ohne Leerzeichen und Tab davor und danach (RFC 6265, 5.2)
    for (const c of res.headers.getSetCookie()) if (pb || c.slice(0, Math.max(0, c.indexOf('='))).trim().toLowerCase() !== COOKIE.toLowerCase()) aus.append('set-cookie', c);
    if (!aus.has('x-content-type-options')) aus.set('x-content-type-options', 'nosniff');
    if (angemeldet || (pb && (cookie || authorization))) {
      aus.set('cache-control', 'no-store');
      aus.append('vary', 'Cookie');
      if (!aus.has('x-frame-options')) aus.set('x-frame-options', 'SAMEORIGIN');
    }
    const koerper = res.body ? durch(res.body, platz.frei) : null;
    platz.beimKoerper = koerper !== null;
    return { res: new Response(koerper, { status: res.status, statusText: res.statusText, headers: aus }), teil: teil.name, pfad: protokoll };
  }

  // Eine Zeile je Anfrage: Methode, Pfad ohne Kennungen, Teil, Status, Dauer. Nie Cookie, Token, Abfrage, Kopfzeilen oder Adressen.
  return async (req: Request, verbindung: string): Promise<Response> => {
    const start = performance.now();
    let r: { res: Response; teil: string; pfad: string };
    try {
      r = await behandeln(req, verbindung);
    } catch (err) {
      r = { res: json(500), teil: '-', pfad: '-' };
      log(JSON.stringify({ zeit: new Date().toISOString(), fehler: err instanceof Error ? err.name : 'Fehler' }));
    }
    log(JSON.stringify({ zeit: new Date().toISOString(), methode: req.method, pfad: r.pfad, teil: r.teil, status: r.res.status, ms: Math.round(performance.now() - start) }));
    return r.res;
  };
}

if (import.meta.main) {
  const datei = process.env.EINGANG_JSON ?? join(import.meta.dir, 'eingang.json');
  let roh: unknown = null;
  try { roh = JSON.parse(readFileSync(datei, 'utf8')); } catch (err) { console.error(`${datei}: ${existsSync(datei) ? `kein gültiges JSON (${(err as Error).message})` : 'fehlt'}`); process.exit(1); }
  const e = einstellungen(roh, process.env.URSPRUNG);
  if (!e.ok) { console.error(`${datei}:\n- ${e.fehler.join('\n- ')}`); process.exit(1); }
  const proMinute = process.env.ANFRAGEN_PRO_MINUTE ? Number(process.env.ANFRAGEN_PRO_MINUTE) : undefined;
  if (proMinute !== undefined && !(Number.isInteger(proMinute) && proMinute > 0)) { console.error('ANFRAGEN_PRO_MINUTE: eine ganze Zahl über 0'); process.exit(1); }
  let behandle: ReturnType<typeof eingang>;
  try { behandle = eingang(e.wert, { vertraut: process.env.VERTRAUTE_PROXYS, anfragenProMinute: proMinute }); } catch (err) { console.error((err as Error).message); process.exit(1); }
  const server = Bun.serve({
    port: Number(process.env.PORT ?? 8080),
    maxRequestBodySize: GRENZEN.koerperBytes,
    // Bun schliesst eine Verbindung sonst nach 10 s ohne Daten, auch wenn ein Teil noch arbeitet: Die eigene Grenze (504) muss zuerst greifen
    idleTimeout: Math.ceil(GRENZEN.teilMs / 1000) + 5,
    hostname: process.env.EINGANG_HOST || undefined,
    fetch: (req, s) => behandle(req, s.requestIP(req)?.address ?? ''),
  });
  console.log(JSON.stringify({ zeit: new Date().toISOString(), start: true, port: server.port, teile: e.wert.teile.map((t) => `${t.name} ${t.zugang}`) }));
}
