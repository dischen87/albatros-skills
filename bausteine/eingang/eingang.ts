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
  gleichzeitig: 20,                 // offene Anfragen je Adresse beim Teil, bis die Antwort ganz durch ist (fetch für alle: Bun 256, Dockerfile 1024)
  wartend: 100,                     // so viele weitere je Adresse warten auf einen dieser Plätze (eine Seite mit vielen Bildern), darüber 429
  wartendAlle: 2000,                // und so viele über alle Adressen zusammen (gemessen rund 5 KB je wartende Anfrage, README), darüber 429
  pocketbaseMs: 2000,               // so lange darf die Prüfung der Anmeldung dauern, sonst 503
  teilMs: 60_000,                   // so lange darf eine Anfrage ab Ankunft bis zur Antwort brauchen, Warten auf einen Platz eingeschlossen, sonst
                                    // 504 (oder 429, wenn sie bis dahin keinen Platz bekam). Bun.serve wartet darum länger (idleTimeout)
  grossBytes: 1024 * 1024,          // ein Körper ab dieser Länge kommt in Stücken vom Teil, wenn der Teil das kann (stueckweise unten)
  stueckBytes: 64 * 1024,           // so gross ist ein Stück (eine Anfrage mit Range an den Teil)
  grossJeAdresse: 6,                // so viele grosse Körper je Adresse zugleich in Stücken; weitere derselben Adresse warten, bis einer durch ist
};
// Bun liest den Körper einer Antwort vom Teil so schnell in den Speicher, wie der Teil liefert, auch wenn die Besucherin nicht liest
// (Welle 7, w7-28: rund 3 MB je hängendem Download von 5 MB; 3 Adressen × 20 Downloads: 194 bis 208 MB). Darum holt der Eingang grosse
// Körper in Stücken (Range), jedes erst, wenn Bun das vorige an die Besucherin weitergibt: Wer langsam liest, hält nur, was Bun ihr
// vorausschreibt. Ohne Budget über alle Adressen: Keine Besucherin wartet auf eine andere (Welle 8, w8-45, 01.11.2026). Gemessen mit
// 3 × 20 hängenden Downloads à 5 MB von einem Teil wie nginx: Stücke à 256 KB 108 bis 116 MB, à 64 KB 60 bis 63 MB (README, «Speicher»).
// Nachbesserung 02.11.2026 (Gegenprobe skills): Mit Stücken à 64 KB braucht eine Datei von 25 MB 401 Anfragen an den Teil; PocketBase lässt
// mit den Grenzen der Bausteine je Adresse 300 in 10 Sekunden zu (es sieht die Adresse der Besucherin aus X-Forwarded-For) und brach Filme
// und Galerien mit 429 ab. Darum eine eigene Grenze für /api/files/ in pb_migrations/3_eingang_dateien.js. Grössere Stücke (bis 256 KB nach
// Dateigrösse) hielten mehr Speicher (3 × 20 hängende Downloads bis 123 MB) und machten Galerien nicht schneller, darum bleibt es bei 64 KB.
// Dazu höchstens grossJeAdresse grosse Körper je Adresse zugleich: Eine Besucherin wartet dabei nur auf ihre eigenen, andere nie; das ist
// der Deckel für den Speicher ohne gemeinsame Sperre wie in w7-28 (gemessen 14 Adressen × 20 hängende Downloads 87 statt 159 MB, README).
const SCHEIBE = 16 * 1024; // Bun schreibt Scheiben voraus, nicht Bytes: kleine Scheiben halten weniger Speicher
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

// Plätze je Adresse (IPv6 je /64): Höchstens g.gleichzeitig Anfragen sind unterwegs zu PocketBase oder einem Teil, bis ihre Antwort ganz
// durch ist. Weitere warten der Reihe nach, höchstens g.wartend je Adresse und g.wartendAlle zusammen: Eine Seite mit 60 Bildern kommt
// über HTTP/2 an der Kante auf einmal und mit derselben Adresse, sie soll keine 429 bekommen. Wird ein Platz frei, geht er an die nächste
// wartende Anfrage derselben Adresse. So belegt eine Adresse mit langsamen Anfragen höchstens ihre eigenen Plätze (wartende belegen keinen
// Platz für fetch), und alle anderen kommen weiter durch.
type Platz = { frei: () => void; beimKoerper: boolean };
function plaetze(g: Pick<typeof GRENZEN, 'gleichzeitig' | 'wartend' | 'wartendAlle'>) {
  const je = new Map<string, { laufend: number; warten: ((p: Platz) => void)[] }>();
  let wartendAlle = 0;
  const platz = (netz: string): Platz => {
    let zurueck = false;
    return { beimKoerper: false, frei: () => { // mehrmals schadet nicht
      if (zurueck) return;
      zurueck = true;
      const a = je.get(netz)!;
      const naechste = a.warten.shift();
      if (naechste) naechste(platz(netz)); // der Platz geht weiter, laufend bleibt gleich
      else if (--a.laufend === 0) je.delete(netz);
    } };
  };
  // Ein Platz, sobald einer frei ist; 'voll', wenn schon zu viele warten oder bis zur Frist keiner frei wurde; null, wenn die Besucherin abbricht
  return (netz: string, signal: AbortSignal, frist: number): Promise<Platz | 'voll' | null> => {
    let a = je.get(netz);
    if (!a) je.set(netz, (a = { laufend: 0, warten: [] }));
    if (a.laufend < g.gleichzeitig) { a.laufend++; return Promise.resolve(platz(netz)); }
    if (signal.aborted) return Promise.resolve(null);
    if (a.warten.length >= g.wartend || wartendAlle >= g.wartendAlle) return Promise.resolve('voll');
    const warten = a.warten;
    wartendAlle++;
    return new Promise((fertig) => {
      const ende = () => { wartendAlle--; clearTimeout(uhr); signal.removeEventListener('abort', abbruch); };
      const dran = (p: Platz) => { ende(); fertig(p); };
      const weg = (grund: 'voll' | null) => { ende(); const i = warten.indexOf(dran); if (i >= 0) warten.splice(i, 1); fertig(grund); };
      const abbruch = () => weg(null);
      const uhr = setTimeout(() => weg('voll'), Math.max(0, frist - performance.now()));
      signal.addEventListener('abort', abbruch, { once: true });
      warten.push(dran);
    });
  };
}

const cookieWert = (kopf: string | null, name: string) => {
  for (const teil of (kopf ?? '').split(';')) {
    const i = teil.indexOf('=');
    if (i > 0 && teil.slice(0, i).trim() === name) return teil.slice(i + 1).trim();
  }
  return null;
};
// Der Name in einem Set-Cookie eines Teils, so wie der Browser ihn liest (RFC 6265bis, 5.6): das Paar bis zum ersten «;», der Name bis
// zum ersten «=», ohne Leerzeichen und Tab davor und danach; klein geschrieben. Leer heisst: ein Cookie ohne Namen (kein «=» oder nichts
// davor). Manche Browser schicken davon nur den Wert zurück, «=__Host-sitzung=x» käme also als Sitzung an. Kein Teil braucht so eines.
const cookieName = (setCookie: string) => {
  const paar = setCookie.split(';', 1)[0]!, i = paar.indexOf('=');
  return i < 0 ? '' : paar.slice(0, i).trim().toLowerCase();
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

// Kann dieser Körper in Stücken kommen? Nur bei GET, ganz (200) oder genau ein Bereich (206), ohne Komprimierung, ab grossBytes, wenn der
// Teil Bereiche anbietet (accept-ranges: bytes, wie nginx bei Dateien und PocketBase bei Dateien) und die Datei erkennbar bleibt (ETag ohne
// W/ oder Last-Modified, für If-Range: Ändert sie sich unterwegs, schickt der Teil 200 statt 206, und der Eingang bricht ab, statt zwei
// Fassungen zu mischen). Last-Modified gilt nur als starker Validator, also mindestens 1 s vor Date (RFC 9110, 8.8.2.2 und 13.1.5): Wird eine
// Datei in derselben Sekunde ersetzt, in der sie entstand, trägt die neue dieselbe Zeit (Nachbesserung 02.11.2026, sonst gemischte Bytes).
// Sonst geht der Körper wie bisher durch (durch oben). Ergebnis: Anfang und Ende der Bytes in der Datei, If-Range, und was jedes Stück
// gleich haben muss (ETag bzw. Last-Modified, Länge der ganzen Datei; null: unbekannt).
export type Bereich = { von: number; bis: number; ifRange: string; gleich: { etag: string | null; datum: string | null; ganz: number | null } };
export function stueckweise(methode: string, res: Pick<Response, 'status' | 'headers'>, grossBytes: number, jetzt = Date.now()): Bereich | null {
  if (methode !== 'GET' || (res.status !== 200 && res.status !== 206)) return null;
  const h = res.headers;
  if ((h.get('content-encoding') ?? 'identity').toLowerCase() !== 'identity') return null;
  if (!(h.get('accept-ranges') ?? '').toLowerCase().split(',').map((x) => x.trim()).includes('bytes')) return null;
  const etag = h.get('etag'), datum = h.get('last-modified');
  const stark = etag && /^"[^"]*"$/.test(etag) ? etag : null;
  const zeit = datum ? Date.parse(datum) : NaN, bezug = h.get('date') ? Date.parse(h.get('date')!) : jetzt;
  const datumStark = !stark && datum && !Number.isNaN(zeit) && !Number.isNaN(bezug) && bezug - zeit >= 1000 ? datum : null;
  const ifRange = stark ?? datumStark;
  const laenge = Number(h.get('content-length') ?? NaN);
  if (!ifRange || !Number.isSafeInteger(laenge) || laenge < grossBytes) return null;
  const gleich = { etag: stark, datum: stark ? null : datumStark, ganz: res.status === 200 ? laenge : null };
  if (res.status === 200) return { von: 0, bis: laenge - 1, ifRange, gleich };
  const b = /^bytes (\d+)-(\d+)\/(\d+|\*)$/.exec(h.get('content-range') ?? '');
  if (!b) return null;
  const [von, bis] = [Number(b[1]), Number(b[2])];
  return bis - von + 1 === laenge ? { von, bis, ifRange, gleich: { ...gleich, ganz: b[3] === '*' ? null : Number(b[3]) } } : null;
}

// Grosse Körper je Adresse (IPv6 je /64): höchstens n zugleich in Stücken. Ein weiterer derselben Adresse wartet beim ersten Stück, bis einer
// ihrer eigenen durch ist, abgebrochen oder von ihr verlassen; andere Adressen warten nie. Ergebnis: frei() oder null (die Besucherin ging).
function grosseKoerper(n: number) {
  const je = new Map<string, { offen: number; warten: ((frei: () => void) => void)[] }>();
  const frei = (netz: string) => {
    let zurueck = false;
    return () => {
      if (zurueck) return;
      zurueck = true;
      const a = je.get(netz)!;
      const naechste = a.warten.shift();
      if (naechste) naechste(frei(netz));
      else if (--a.offen === 0) je.delete(netz);
    };
  };
  return (netz: string, signal: AbortSignal): Promise<(() => void) | null> => {
    let a = je.get(netz);
    if (!a) je.set(netz, (a = { offen: 0, warten: [] }));
    if (a.offen < n) { a.offen++; return Promise.resolve(frei(netz)); }
    if (signal.aborted) return Promise.resolve(null);
    const warten = a.warten;
    return new Promise((fertig) => {
      const dran = (f: () => void) => { signal.removeEventListener('abort', weg); fertig(f); };
      const weg = () => { const i = warten.indexOf(dran); if (i >= 0) warten.splice(i, 1); fertig(null); };
      signal.addEventListener('abort', weg, { once: true });
      warten.push(dran);
    });
  };
}

// Der Körper in Stücken: Jedes Stück (Range von bis) holt der Eingang erst, wenn Bun das vorige ganz weitergegeben hat, und gibt es in
// Scheiben weiter. Ein Stück kommt ganz und mit 206 und genau diesem Bereich, sonst bricht der Körper ab (die Besucherin sieht einen
// abgebrochenen Download und lädt neu). Vor dem ersten Stück wartet er, bis die Adresse einen ihrer Plätze für grosse Körper hat (gross).
// Ist er durch, bricht er ab oder bricht die Besucherin ab, werden beide Plätze frei.
function stuecke(holen: (von: number, bis: number, signal: AbortSignal) => Promise<Uint8Array>, bereich: { von: number; bis: number },
  stueckBytes: number, frei: () => void, melden: (grund: string) => void, gross: (signal: AbortSignal) => Promise<(() => void) | null>) {
  const halt = new AbortController();
  let pos = bereich.von, stueck = new Uint8Array(0), i = 0, grossFrei: (() => void) | null = null;
  const alleFrei = () => { grossFrei?.(); frei(); };
  return new ReadableStream<Uint8Array>({
    async pull(c) {
      try {
        if (!grossFrei) {
          grossFrei = await gross(halt.signal);
          if (!grossFrei) { frei(); return; } // die Besucherin ging, während sie wartete (cancel unten)
        }
        if (i >= stueck.length) {
          if (pos > bereich.bis) { alleFrei(); c.close(); return; }
          const bis = Math.min(bereich.bis, pos + stueckBytes - 1);
          stueck = await holen(pos, bis, halt.signal);
          [pos, i] = [bis + 1, 0];
        }
        const scheibe = stueck.subarray(i, i + SCHEIBE);
        i += scheibe.length;
        c.enqueue(scheibe);
      } catch (err) {
        alleFrei();
        if (!halt.signal.aborted) melden(err instanceof Error ? err.message : 'Fehler');
        c.error(err); // die Antwort bricht ab (ohne Schluss der Stücke): Die Besucherin sieht einen abgebrochenen Download, nie einen falschen
      }
    },
    cancel() { halt.abort(); alleFrei(); },
  }, { highWaterMark: 0 });
}

// grenzen: nur für den Test (kürzere Frist, weniger Wartende, kleinere Stücke als in GRENZEN)
export type Optionen = { vertraut?: string; anfragenProMinute?: number;
  grenzen?: Partial<Pick<typeof GRENZEN, 'teilMs' | 'wartendAlle' | 'grossBytes' | 'stueckBytes' | 'grossJeAdresse'>>;
  jetzt?: () => number; log?: (zeile: string) => void };

export function eingang(e: Einstellungen, o: Optionen = {}) {
  const vertraut = netze(o.vertraut);
  if (!vertraut) throw new Error('VERTRAUTE_PROXYS: Adressen oder Netze wie 10.0.0.0/8, durch Kommas getrennt, oder *');
  const g = { ...GRENZEN, ...o.grenzen };
  const zaehle = zaehler(o.jetzt ?? Date.now);
  const platzFuer = plaetze(g);
  const grossFuer = grosseKoerper(g.grossJeAdresse);
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
    const frist = performance.now() + g.teilMs; // bis dahin beginnt die Antwort, Warten auf einen Platz eingeschlossen
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

    // Ab hier geht es ins Netz (Prüfung bei PocketBase, der Teil), mit einem der Plätze dieser Adresse (plaetze oben). Sonst belegte eine
    // Adresse mit langsamen Anfragen alle Plätze, die Bun für fetch hat, und alle warteten. beimKoerper: Der Körper der Antwort gibt den
    // Platz frei, wenn er durch ist; bricht die Besucherin ab, wird er sofort frei.
    const platz = await platzFuer(netzVon(wer), req.signal, frist);
    if (platz === 'voll') return { res: json(429, { 'retry-after': '5' }), teil: teil.name, pfad: protokoll };
    if (platz === null) return { res: json(499), teil: teil.name, pfad: protokoll }; // die Besucherin ist weg (wie nginx: 499 nur im Protokoll)
    req.signal.addEventListener('abort', platz.frei, { once: true });
    try {
      if (req.signal.aborted) return { res: json(499), teil: teil.name, pfad: protokoll };
      return await weiterleiten(req, url, wer, teil, pb, cookie, protokoll, platz, frist);
    } finally {
      if (!platz.beimKoerper) platz.frei();
    }
  }

  async function weiterleiten(req: Request, url: URL, wer: string, teil: Teil, pb: boolean, cookie: string | null, protokoll: string,
    platz: Platz, frist: number): Promise<{ res: Response; teil: string; pfad: string }> {
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
    const uhr = setTimeout(() => halt.abort(new DOMException('Zeit abgelaufen', 'TimeoutError')), Math.max(0, frist - performance.now()));
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
    // content-length geht mit: Der Körper geht unverändert durch (auch komprimiert, decompress: false). Bun schickt ihn mit dieser Länge
    // oder in Stücken (chunked), die Bytes sind dieselben (gemessen mit 3 MB und gzip).
    res.headers.forEach((v, k) => { if ((!HOP.has(k) || k === 'content-length') && !k.startsWith('x-eingang-') && k !== 'set-cookie') aus.append(k, v); });
    for (const c of res.headers.getSetCookie()) { const n = cookieName(c); if (pb || (n !== '' && n !== COOKIE.toLowerCase())) aus.append('set-cookie', c); }
    if (!aus.has('x-content-type-options')) aus.set('x-content-type-options', 'nosniff');
    if (angemeldet || (pb && (cookie || authorization))) {
      aus.set('cache-control', 'no-store');
      aus.append('vary', 'Cookie');
      if (!aus.has('x-frame-options')) aus.set('x-frame-options', 'SAMEORIGIN');
    }
    // Grosse Körper in Stücken (stueckweise oben): Der erste Körper vom Teil wird gleich verworfen, sonst läse Bun ihn ganz in den Speicher
    const bereich = res.body ? stueckweise(req.method, res, g.grossBytes) : null;
    if (bereich) void res.body!.cancel().catch(() => {});
    const melden = (grund: string) => log(JSON.stringify({ zeit: new Date().toISOString(), methode: req.method, pfad: protokoll, teil: teil.name, fehler: 'stueck', grund }));
    const koerper = !res.body ? null : bereich
      ? stuecke(stueckHolen(teil, url, kopf, bereich), bereich, g.stueckBytes, platz.frei, melden, (s) => grossFuer(netzVon(wer), s))
      : durch(res.body, platz.frei);
    platz.beimKoerper = koerper !== null;
    return { res: new Response(koerper, { status: res.status, statusText: res.statusText, headers: aus }), teil: teil.name, pfad: protokoll };
  }

  // Ein Stück vom Teil: dieselben Kopfzeilen wie die erste Anfrage, ohne Bedingungen, dazu Range und If-Range. Nur 206 mit genau diesem
  // Bereich und ganzer Länge zählt, und mit demselben ETag bzw. derselben Last-Modified und derselben Länge der ganzen Datei wie die erste
  // Antwort (ein Teil, der If-Range nicht beachtet, fällt so auch auf); die Frist ist dieselbe wie für eine Antwort (teilMs), das Stück kommt
  // ohne Warten auf die Besucherin.
  function stueckHolen(teil: Teil, url: URL, kopf: Headers, b: Bereich) {
    const basis = new Headers(kopf);
    for (const k of ['range', 'if-range', 'if-none-match', 'if-modified-since', 'if-match', 'if-unmodified-since']) basis.delete(k);
    basis.set('if-range', b.ifRange);
    return async (von: number, bis: number, signal: AbortSignal) => {
      const k = new Headers(basis);
      k.set('range', `bytes=${von}-${bis}`);
      const r = await fetch(`${teil.ziel}${url.pathname}${url.search}`, {
        headers: k, redirect: 'manual', signal: AbortSignal.any([signal, AbortSignal.timeout(g.teilMs)]), decompress: false,
      } as RequestInit);
      const m = /^bytes (\d+)-(\d+)\/(\d+|\*)$/.exec(r.headers.get('content-range') ?? '');
      const anders = r.status !== 206 ? `${r.status} statt 206`
        : !m || Number(m[1]) !== von || Number(m[2]) !== bis ? 'anderer Bereich'
        : b.gleich.ganz !== null && m[3] !== String(b.gleich.ganz) ? 'andere Länge der Datei'
        : b.gleich.etag !== null && r.headers.get('etag') !== b.gleich.etag ? 'anderer ETag'
        : b.gleich.datum !== null && r.headers.get('last-modified') !== b.gleich.datum ? 'andere Last-Modified' : null;
      if (anders) {
        await r.body?.cancel().catch(() => {});
        throw new Error(`Stück ${von}-${bis}: ${anders} (Datei geändert?)`);
      }
      const stueck = new Uint8Array(await r.arrayBuffer());
      if (stueck.length !== bis - von + 1) throw new Error(`Stück ${von}-${bis}: ${stueck.length} Bytes`);
      return stueck;
    };
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
    // Bun schliesst eine Verbindung sonst nach 10 s ohne Daten, auch wenn ein Teil noch arbeitet oder die Anfrage auf einen Platz wartet:
    // Die eigene Frist ab Ankunft (504, oder 429 ohne Platz) muss zuerst greifen
    idleTimeout: Math.ceil(GRENZEN.teilMs / 1000) + 5,
    hostname: process.env.EINGANG_HOST || undefined,
    fetch: (req, s) => behandle(req, s.requestIP(req)?.address ?? ''),
  });
  console.log(JSON.stringify({ zeit: new Date().toISOString(), start: true, port: server.port, teile: e.wert.teile.map((t) => `${t.name} ${t.zugang}`) }));
}
