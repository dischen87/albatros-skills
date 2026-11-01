// Grosse Körper in Stücken (eingang.ts: stueckweise, stuecke; Welle 8, w8-45, 01.11.2026), ohne PocketBase, mit bun test. Bun liest den
// Körper einer Antwort vom Teil so schnell in den Speicher, wie der Teil liefert, auch wenn die Besucherin nicht liest; darum holt der
// Eingang grosse Körper mit Range in Stücken, jedes erst, wenn Bun das vorige weitergibt. Geprüft: Bytes und Status wie vom Teil, nur mit
// einem Teil, der Bereiche anbietet, Abbruch bei geänderter Datei, eine angehaltene Besucherin hält wenig und bremst keine andere Adresse.
import { afterAll, expect, test } from 'bun:test';
import { connect, type Socket } from 'node:net';
import { eingang, einstellungen, stueckweise } from './eingang.ts';

const KB = 1024;
const datei = (n: number, saat: number) => new Uint8Array(n).map((_, i) => (i * 7 + saat) % 251);
const DATEIEN: Record<string, Uint8Array> = { '/video.bin': datei(2048 * KB + 77, 1), '/klein.bin': datei(100 * KB, 2), '/bild.bin': datei(600 * KB, 3) };
let etag = '"1"';
const anfragen: { pfad: string; range: string | null; ifRange: string | null }[] = [];
// Ein Teil wie nginx bei Dateien: content-length, accept-ranges, ETag; ein Bereich mit 206 und content-range; stimmt If-Range nicht, ganz (200)
const teil = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch(r) {
  const u = new URL(r.url);
  const d = DATEIEN[u.pathname.replace(/^\/ohne/, '')];
  if (!d) return new Response('nicht da', { status: 404 });
  anfragen.push({ pfad: u.pathname, range: r.headers.get('range'), ifRange: r.headers.get('if-range') });
  if (u.pathname.startsWith('/ohne')) return new Response(d, { headers: { etag } }); // ohne accept-ranges: wie ein Teil, der keine Bereiche kann
  const kopf = { 'accept-ranges': 'bytes', etag, 'content-type': 'application/octet-stream' };
  const m = /^bytes=(\d+)-(\d*)$/.exec(r.headers.get('range') ?? '');
  const ifRange = r.headers.get('if-range');
  if (!m || (ifRange !== null && ifRange !== etag)) return new Response(d, { headers: kopf });
  const von = Number(m[1]), bis = m[2] ? Math.min(Number(m[2]), d.length - 1) : d.length - 1;
  return new Response(d.subarray(von, bis + 1), { status: 206, headers: { ...kopf, 'content-range': `bytes ${von}-${bis}/${d.length}` } });
} });
const ziel = `http://127.0.0.1:${teil.port}`;
const e = einstellungen({ ursprung: 'https://verein.example', teile: [
  { name: 'pocketbase', ziel, pfade: ['/api/'], zugang: 'offen' }, { name: 'webseite', ziel, pfade: ['/'], zugang: 'offen' }] });
if (!e.ok) throw new Error(e.fehler.join(', '));
// Kleinere Stücke als ausgeliefert, damit der Test schnell bleibt: ab 256 KB in Stücken à 64 KB
const behandle = eingang(e.wert, { vertraut: '127.0.0.1', log: () => {}, grenzen: { grossBytes: 256 * KB, stueckBytes: 64 * KB } });
const tuer = Bun.serve({ hostname: '127.0.0.1', port: 0, idleTimeout: 30, fetch: (req, s) => behandle(req, s.requestIP(req)?.address ?? '') });
const offen: Socket[] = [];
afterAll(() => { for (const s of offen) s.destroy(); tuer.stop(true); teil.stop(true); });
const holen = (pfad: string, adresse: string, kopf: Record<string, string> = {}) =>
  fetch(`http://127.0.0.1:${tuer.port}${pfad}`, { headers: { host: 'verein.example', 'x-forwarded-for': adresse, ...kopf } });
const bereiche = (pfad: string) => anfragen.filter((a) => a.pfad === pfad && a.range !== null && a.ifRange !== null);
const gleich = (a: Uint8Array, b: Uint8Array) => a.length === b.length && a.every((x, i) => x === b[i]);

test('stueckweise: nur GET, 200 oder ein Bereich, ohne Komprimierung, ab grossBytes, mit accept-ranges und ETag oder Last-Modified', () => {
  const r = (status: number, h: Record<string, string>) => ({ status, headers: new Headers({ 'accept-ranges': 'bytes', 'content-length': '2000', etag: '"a"', ...h }) });
  expect(stueckweise('GET', r(200, {}), 1000)).toEqual({ von: 0, bis: 1999, ifRange: '"a"' });
  expect(stueckweise('GET', r(206, { 'content-range': 'bytes 100-2099/5000' }), 1000)).toEqual({ von: 100, bis: 2099, ifRange: '"a"' });
  expect(stueckweise('GET', r(200, { etag: 'W/"a"', 'last-modified': 'Sat, 01 Nov 2026 10:00:00 GMT' }), 1000)?.ifRange).toBe('Sat, 01 Nov 2026 10:00:00 GMT');
  for (const [methode, res] of [['HEAD', r(200, {})], ['POST', r(200, {})], ['GET', r(200, { 'content-length': '999' })], ['GET', r(304, {})],
    ['GET', r(200, { 'accept-ranges': 'none' })], ['GET', r(200, { 'content-encoding': 'gzip' })], ['GET', r(200, { etag: 'W/"a"' })],
    ['GET', r(206, { 'content-range': 'bytes 0-99/5000' })], ['GET', r(206, {})]] as const)
    expect([methode, res.status, Object.fromEntries(res.headers), stueckweise(methode, res, 1000)]).toEqual([methode, res.status, Object.fromEntries(res.headers), null]);
});

test('ein grosser Körper kommt in Stücken vom Teil und ganz bei der Besucherin an, Bytes gleich', async () => {
  const r = await holen('/video.bin', '203.0.113.10');
  expect(r.status).toBe(200);
  expect(gleich(new Uint8Array(await r.arrayBuffer()), DATEIEN['/video.bin']!)).toBe(true);
  const st = bereiche('/video.bin');
  expect(st.length).toBe(Math.ceil(DATEIEN['/video.bin']!.length / (64 * KB)));
  expect(st.every((a) => a.ifRange === '"1"')).toBe(true);
});

test('ein Bereich der Besucherin (Video im Browser) kommt als 206 mit demselben content-range, in Stücken geholt', async () => {
  anfragen.length = 0;
  const r = await holen('/video.bin', '203.0.113.11', { range: 'bytes=300000-1999999' });
  expect([r.status, r.headers.get('content-range')]).toEqual([206, `bytes 300000-1999999/${DATEIEN['/video.bin']!.length}`]);
  expect(gleich(new Uint8Array(await r.arrayBuffer()), DATEIEN['/video.bin']!.subarray(300000, 2000000))).toBe(true);
  expect(bereiche('/video.bin').length).toBe(Math.ceil(1700000 / (64 * KB)));
});

test('kleine Körper und Teile ohne Bereiche gehen wie bisher in einem Stück durch', async () => {
  anfragen.length = 0;
  for (const [pfad, soll] of [['/klein.bin', DATEIEN['/klein.bin']!], ['/ohne/video.bin', DATEIEN['/video.bin']!]] as const) {
    const r = await holen(pfad, '203.0.113.12');
    expect([pfad, r.status, gleich(new Uint8Array(await r.arrayBuffer()), soll)]).toEqual([pfad, 200, true]);
  }
  expect(anfragen.map((a) => [a.pfad, a.range])).toEqual([['/klein.bin', null], ['/ohne/video.bin', null]]);
});

test('ändert sich die Datei unterwegs, bricht der Körper ab, statt zwei Fassungen zu mischen', async () => {
  const s = connect({ host: '127.0.0.1', port: tuer.port });
  offen.push(s);
  let empfangen = 0, ende = '', schluss = '';
  const fertig = new Promise<void>((weiter) => {
    s.on('data', (d: Buffer) => {
      empfangen += d.length;
      schluss = (schluss + d.toString('latin1')).slice(-16);
      if (empfangen > 100 * KB && etag === '"1"') etag = '"2"'; // nach den ersten Stücken eine neue Fassung
    });
    s.on('end', () => { ende = 'end'; weiter(); });
    s.on('close', () => { ende ||= 'close'; weiter(); });
    s.on('error', () => {});
  });
  s.write('GET /video.bin HTTP/1.1\r\nHost: verein.example\r\nX-Forwarded-For: 203.0.113.13\r\nConnection: close\r\n\r\n');
  await Promise.race([fertig, Bun.sleep(5000)]);
  etag = '"1"';
  expect(ende).not.toBe('');
  expect(empfangen).toBeLessThan(DATEIEN['/video.bin']!.length); // nie die ganze Datei, also nie gemischt
  // und nie als fertig erkennbar: Der Schluss der Stücke (0, Leerzeile) fehlt, der Browser meldet den Download als abgebrochen
  expect(schluss.endsWith('\r\n0\r\n\r\n')).toBe(false);
}, 10_000);

test('eine angehaltene Besucherin hält nur wenige Stücke; eine andere Adresse bekommt ihre grosse Datei sofort', async () => {
  anfragen.length = 0;
  // A fordert drei grosse Dateien an und liest nichts
  for (let i = 0; i < 3; i++) {
    const s = connect({ host: '127.0.0.1', port: tuer.port }, () => { s.write(`GET /video.bin?a=${i} HTTP/1.1\r\nHost: verein.example\r\nX-Forwarded-For: 203.0.113.20\r\n\r\n`); s.pause(); });
    s.on('error', () => {});
    offen.push(s);
  }
  await Bun.sleep(1000);
  const vonA = bereiche('/video.bin').length;
  // Bun schreibt einer Leserin, die nicht liest, etwas voraus (Socket und eigener Puffer), aber nie die ganze Datei (32 Stücke)
  expect(vonA).toBeLessThan(3 * 24);
  const t = performance.now();
  const r = await holen('/video.bin', '203.0.113.21');
  const b = new Uint8Array(await r.arrayBuffer());
  expect([r.status, gleich(b, DATEIEN['/video.bin']!)]).toEqual([200, true]);
  expect(performance.now() - t).toBeLessThan(2000);
  await Bun.sleep(300);
  // A liest immer noch nicht: keine neuen Stücke für A
  expect(bereiche('/video.bin').length - vonA).toBe(Math.ceil(DATEIEN['/video.bin']!.length / (64 * KB)));
}, 15_000);

test('geht die Besucherin mitten im Körper, holt der Eingang keine weiteren Stücke und gibt ihren Platz frei', async () => {
  anfragen.length = 0;
  const s = connect({ host: '127.0.0.1', port: tuer.port });
  await new Promise<void>((weiter) => {
    let n = 0;
    s.on('data', (d: Buffer) => { n += d.length; if (n > 200 * KB) { s.destroy(); weiter(); } });
    s.on('error', () => {});
    s.write('GET /video.bin HTTP/1.1\r\nHost: verein.example\r\nX-Forwarded-For: 203.0.113.30\r\n\r\n');
  });
  await Bun.sleep(300);
  const danach = bereiche('/video.bin').length;
  await Bun.sleep(500);
  expect(bereiche('/video.bin').length).toBe(danach);
  expect(danach).toBeLessThan(Math.ceil(DATEIEN['/video.bin']!.length / (64 * KB)));
  // 21 Anfragen derselben Adresse: Die Plätze sind frei, keine wartet bis 429
  const alle = await Promise.all(Array.from({ length: 21 }, () => holen('/klein.bin', '203.0.113.30').then(async (r) => [r.status, (await r.arrayBuffer()).byteLength])));
  expect(alle.every(([st, n]) => st === 200 && n === 100 * KB)).toBe(true);
}, 10_000);
