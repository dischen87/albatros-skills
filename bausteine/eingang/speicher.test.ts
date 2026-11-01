// Speicher des Eingangs bei grossen Antworten und Besucherinnen, die nicht weiterlesen (Welle 7, w7-28, 01.11.2026). Bun liest den Körper
// einer Antwort vom Teil so schnell in den Speicher, wie der Teil liefert, sobald der Eingang ihn zu lesen beginnt; schon eine Antwort, die
// niemand liest, hält rund 1 MB. Je 20 ungelesene Downloads à 5 MB von drei Adressen brachten den Eingang auf 186–204 MB (mem_limit 128m).
// Darum (eingang.ts, koerper und durch): Grosse Körper (content-length ab grossBytes) gehen nur, wenn sie Platz im Speicher haben, je
// Adresse und über alle; sonst gehen die Kopfzeilen hinaus, der Körper vom Teil wird verworfen und später nochmals geholt (nur GET, gleiche
// Länge und ETag). Ohne PocketBase: Der Eingang läuft hier im Prozess mit kleinen Grenzen; test.ts prüft den Rest gegen ein echtes
// PocketBase. Läuft mit bun test (CI-Job pruefen).
import { afterAll, expect, test } from 'bun:test';
import { connect } from 'node:net';
import { eingang, einstellungen } from './eingang.ts';

// Grosse Körper hier 8 MB: Ein Socket auf diesem Rechner nimmt von einer Besucherin, die nicht liest, rund 2,6 MB auf (gemessen), erst der
// Rest bleibt im Eingang
const MB = 1024 * 1024;
const GROSS = 8 * MB;
const DATEI = new Uint8Array(GROSS).fill(66);
const anfragen = new Map<string, number>();
const zaehle = (pfad: string) => anfragen.set(pfad, (anfragen.get(pfad) ?? 0) + 1);
// Der Teil zum Schein: /gross/* 8 MB mit Länge und ETag; /anders/* beim ersten Mal ETag "a" und lauter a, danach ETag "b" und lauter b
// (die Datei hat sich geändert); /klein 10 KB
const teil = Bun.serve({ hostname: '127.0.0.1', port: 0, idleTimeout: 60, fetch(r) {
  const pfad = new URL(r.url).pathname;
  zaehle(pfad);
  if (pfad.startsWith('/gross/')) return new Response(DATEI, { headers: { etag: '"1"', 'content-type': 'application/octet-stream' } });
  if (pfad.startsWith('/anders/')) {
    const erstes = anfragen.get(pfad) === 1;
    return new Response(new Uint8Array(GROSS).fill(erstes ? 0x61 : 0x62), { headers: { etag: erstes ? '"a"' : '"b"' } });
  }
  if (pfad === '/klein') return new Response(new Uint8Array(10 * 1024).fill(67));
  return new Response('Startseite');
} });
const ziel = `http://127.0.0.1:${teil.port}`;
const e = einstellungen({ ursprung: 'https://verein.example', anmeldeseite: '/mitglieder.html', teile: [
  { name: 'pocketbase', ziel, pfade: ['/api/'], zugang: 'offen' }, { name: 'webseite', ziel, pfade: ['/'], zugang: 'offen' }] });
if (!e.ok) throw new Error(e.fehler.join(', '));
// Kleine Grenzen: grosse Körper ab 64 KB, je Adresse 8 MB (also einer zugleich, ein zweiter passt nie dazu), über alle 16 MB
const behandle = eingang(e.wert, { vertraut: '127.0.0.1', grenzen: { grossBytes: 64 * 1024, koerperJeAdresse: GROSS, koerperAlle: 2 * GROSS }, log: () => {} });
const tuer = Bun.serve({ hostname: '127.0.0.1', port: 0, idleTimeout: 60, fetch: (req, s) => behandle(req, s.requestIP(req)?.address ?? '') });
afterAll(() => { tuer.stop(true); teil.stop(true); });

// Eine Besucherin, die liest: Status, Zahl der Bytes (-1, wenn der Körper abbricht), ETag und das erste Byte; Status 0, wenn die Verbindung
// vor den Kopfzeilen zugeht
async function lies(pfad: string, adresse: string) {
  const r = await fetch(`http://127.0.0.1:${tuer.port}${pfad}`, { headers: { host: 'verein.example', 'x-forwarded-for': adresse }, signal: AbortSignal.timeout(10_000) })
    .catch(() => null);
  if (!r) return { status: 0, bytes: -1, etag: null, byte: -1 };
  const b = await r.arrayBuffer().then((x) => new Uint8Array(x), () => null);
  return { status: r.status, bytes: b ? b.length : -1, etag: r.headers.get('etag'), byte: b?.[0] ?? -1 };
}
const ganz = { status: 200, bytes: GROSS, etag: '"1"', byte: 66 };
// Eine Besucherin, die nach dem ersten Stück nicht weiterliest (angehaltener Download): Status aus der ersten Zeile, zu() schliesst
function haelt(pfad: string, adresse: string) {
  const s = connect({ host: '127.0.0.1', port: tuer.port }, () => s.write(`GET ${pfad} HTTP/1.1\r\nHost: verein.example\r\nX-Forwarded-For: ${adresse}\r\n\r\n`));
  const status = new Promise<number>((fertig) => {
    s.once('data', (d: Buffer) => { s.pause(); fertig(Number(d.toString().split(' ')[1])); });
    s.on('close', () => fertig(0));
  });
  s.on('error', () => {});
  return { status, zu: () => s.destroy() };
}
const zu = async (liste: { zu: () => void }[]) => { for (const x of liste) x.zu(); await Bun.sleep(200); };

test('grosse Körper: je Adresse nur so viel wie Platz ist, die übrigen warten ohne offene Antwort vom Teil; eine andere Adresse geht', async () => {
  const a = Array.from({ length: 5 }, (_, i) => haelt(`/gross/a${i}`, '203.0.113.1'));
  // Alle fünf haben Kopfzeilen (200); vom Teil hat jede einmal geholt, ein Körper läuft (8 MB je Adresse), vier sind verworfen und warten
  expect(await Promise.all(a.map((x) => x.status))).toEqual([200, 200, 200, 200, 200]);
  await Bun.sleep(100);
  expect([0, 1, 2, 3, 4].map((i) => anfragen.get(`/gross/a${i}`))).toEqual([1, 1, 1, 1, 1]);
  // Eine andere Adresse bekommt ihren grossen Körper ganz (über alle 16 MB)
  expect(await lies('/gross/b', '203.0.113.2')).toEqual(ganz);
  // Geht die erste Besucherin, holt die nächste Wartende ihren Körper nochmals, und nur sie (je einer zugleich)
  a[0]!.zu();
  await Bun.sleep(300);
  expect([0, 1, 2, 3, 4].map((i) => anfragen.get(`/gross/a${i}`))).toEqual([1, 2, 1, 1, 1]);
  await zu(a);
  // Danach ist der Platz wieder frei: Ein grosser Körper von a geht sofort ganz durch; wer wartete und ging, hat nichts nochmals geholt
  const t = performance.now();
  expect(await lies('/gross/a-danach', '203.0.113.1')).toEqual(ganz);
  expect(performance.now() - t).toBeLessThan(1000);
  expect([0, 1, 2, 3, 4].map((i) => anfragen.get(`/gross/a${i}`)).reduce((x, y) => x + y!, 0)).toBeLessThanOrEqual(7);
}, 20_000);

test('wer liest, bekommt jeden grossen Körper ganz, auch nach dem Warten; kleine Körper warten nie', async () => {
  const halter = haelt('/gross/h0', '203.0.113.3');
  await halter.status;
  // Der Platz der Adresse ist voll: ein kleiner Körper geht trotzdem sofort
  const t = performance.now();
  const klein = await lies('/klein', '203.0.113.3');
  expect([klein.status, klein.bytes, performance.now() - t < 300]).toEqual([200, 10 * 1024, true]);
  // Fünf grosse von derselben Adresse, gelesen: Sie warten, bis die Halterin geht, und kommen dann ganz an, einer nach dem anderen
  const fuenf = Promise.all(Array.from({ length: 5 }, (_, i) => lies(`/gross/c${i}`, '203.0.113.3')));
  await Bun.sleep(300);
  halter.zu();
  expect(await fuenf).toEqual(Array.from({ length: 5 }, () => ganz));
}, 20_000);

test('liefert der Teil beim zweiten Mal etwas anderes, bekommt die Besucherin nie Kopfzeilen der einen und Körper der anderen Antwort', async () => {
  const halter = haelt('/gross/i0', '203.0.113.4');
  await halter.status;
  const anders = lies('/anders/1', '203.0.113.4');
  await Bun.sleep(300);
  halter.zu();
  // Der Eingang bricht ab (gleiche Länge, anderes ETag). Holt die Besucherin die Datei dann selbst nochmals (wie ein Browser bei einer
  // Verbindung, die vor der Antwort zuging), bekommt sie die neue ganz, mit passendem ETag
  const r = await anders;
  const passt = r.bytes === -1 || (r.status === 200 && r.bytes === GROSS && ((r.etag === '"a"' && r.byte === 0x61) || (r.etag === '"b"' && r.byte === 0x62)));
  expect([r.status, r.etag, r.byte, passt]).toEqual([r.status, r.etag, r.byte, true]);
  expect(anfragen.get('/anders/1')).toBeGreaterThanOrEqual(2);
}, 20_000);
