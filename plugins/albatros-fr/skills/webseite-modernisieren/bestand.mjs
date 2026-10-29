#!/usr/bin/env node
// Bestandsaufnahme einer bestehenden Webseite, ohne Abhängigkeiten (Node 18+):
//   node bestand.mjs https://www.beispiel.ch [ordner]
// Liest sitemap.xml und folgt den Links auf derselben Adresse (höchstens 150 Seiten). Legt im Ordner (Standard docs/bestand) ab:
// bestand.json (alles, was gefunden wurde), seiten/<name>.txt (Text jeder Seite) und dateien/ (Bilder und Dokumente der Seite).
// Die Inhalte gehören den Betreibern der Seite: nur für die eigene Seite oder mit deren Erlaubnis verwenden.
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const start = new URL(process.argv[2] ?? '');
const ziel = process.argv[3] ?? 'docs/bestand';
const HOST = start.hostname.replace(/^www\./, '');
const MAX_SEITEN = 150, MAX_DATEIEN = 400, MAX_BYTES = 15 * 1024 * 1024;
const DOKUMENT = /\.(pdf|docx?|xlsx?|pptx?|zip|ics)(\?|$)/i;
const BILD = /\.(jpe?g|png|gif|webp|svg|avif)(\?|$)/i;
const eigen = (u) => u.hostname.replace(/^www\./, '') === HOST;

const holen = async (url) => {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Albatros-Bestandsaufnahme (fuer die Betreiber der Seite)' }, redirect: 'follow', signal: AbortSignal.timeout(20_000) });
    return r;
  } catch { return null; }
};
const text = (html) => html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ').replace(/<br\s*\/?>|<\/(p|div|li|h\d|tr)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;/g, '’')
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
const alle = (re, s) => [...s.matchAll(re)].map((m) => m[1]);
const attr = (tag, name) => new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, 'i').exec(tag)?.[1];
const name = (u) => (decodeURIComponent(u.pathname).replace(/^\/|\/$/g, '').replace(/[^\p{L}\p{N}]+/gu, '-') || 'start').slice(0, 80);

// 1. Adressen aus sitemap.xml (auch Sitemap-Index), dann von der Startseite aus den Links folgen
const warteschlange = [start.href];
const sm = await holen(new URL('/sitemap.xml', start));
if (sm?.ok) {
  const xml = await sm.text();
  for (const loc of alle(/<loc>\s*([^<\s]+)\s*<\/loc>/gi, xml)) {
    if (/sitemap.*\.xml/i.test(loc)) {
      const sub = await holen(loc);
      if (sub?.ok) warteschlange.push(...alle(/<loc>\s*([^<\s]+)\s*<\/loc>/gi, await sub.text()));
    } else warteschlange.push(loc);
  }
}

const seiten = [], dateien = new Map(), extern = new Map(), gesehen = new Set();
while (warteschlange.length && seiten.length < MAX_SEITEN) {
  const u = new URL(warteschlange.shift(), start);
  u.hash = '';
  if (!eigen(u) || gesehen.has(u.href) || DOKUMENT.test(u.pathname) || BILD.test(u.pathname)) continue;
  gesehen.add(u.href);
  const r = await holen(u.href);
  if (!r?.ok || !(r.headers.get('content-type') ?? '').includes('html')) continue;
  const html = await r.text();
  const seite = {
    adresse: u.href, datei: `seiten/${name(u)}.txt`,
    titel: text(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? ''),
    sprache: /<html[^>]*\blang=["']([^"']+)/i.exec(html)?.[1] ?? null,
    ueberschriften: alle(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/gi, html).map(text).filter(Boolean),
    formulare: alle(/(<form[\s\S]*?<\/form>)/gi, html).map((f) => ({
      ziel: attr(f, 'action') ?? '', methode: attr(f, 'method') ?? 'get',
      felder: alle(/(<(?:input|textarea|select)[^>]*>)/gi, f).map((t) => `${attr(t, 'name') ?? '?'}:${attr(t, 'type') ?? t.match(/^<(\w+)/)[1]}`).filter((x) => !/:hidden$/.test(x)),
    })),
    einbettungen: alle(/<iframe[^>]*src=["']([^"']+)/gi, html),
    mail: [...new Set(alle(/href=["']mailto:([^"'?]+)/gi, html))],
    telefon: [...new Set(alle(/href=["']tel:([^"']+)/gi, html))],
    preise: [...new Set(alle(/((?:CHF|Fr\.)\s?\d[\d'.,–-]*)/g, html))].slice(0, 20),
    zeiten: [...new Set(alle(/\b(\d{1,2}[:.]\d{2}\s?(?:–|-|bis)\s?\d{1,2}[:.]\d{2})/g, text(html)))].slice(0, 20),
    bilder: 0, dokumente: [],
  };
  for (const href of alle(/(?:href|src|data-src)=["']([^"']+)["']/gi, html)) {
    let l; try { l = new URL(href, u); } catch { continue; }
    if (!/^https?:$/.test(l.protocol)) continue;
    if (DOKUMENT.test(l.pathname) || BILD.test(l.pathname)) {
      if (DOKUMENT.test(l.pathname)) seite.dokumente.push(l.href); else seite.bilder++;
      if (!dateien.has(l.href)) dateien.set(l.href, { adresse: l.href, art: DOKUMENT.test(l.pathname) ? 'dokument' : 'bild', seite: u.href });
    } else if (eigen(l)) warteschlange.push(l.href);
    else extern.set(l.hostname, (extern.get(l.hostname) ?? 0) + 1);
  }
  await mkdir(join(ziel, 'seiten'), { recursive: true });
  await writeFile(join(ziel, seite.datei), `${seite.titel}\n${u.href}\n\n${text(html)}\n`);
  seiten.push(seite);
  await new Promise((r) => setTimeout(r, 200)); // freundlich zum Server der Seite
}

// 2. Bilder und Dokumente herunterladen (ohne Symbole und winzige Dateien)
await mkdir(join(ziel, 'dateien'), { recursive: true });
let geladen = 0, bytes = 0;
for (const d of [...dateien.values()].slice(0, MAX_DATEIEN)) {
  if (bytes > 200 * 1024 * 1024) break;
  const r = await holen(d.adresse);
  if (!r?.ok) continue;
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 4000 || buf.length > MAX_BYTES) continue;
  const datei = `dateien/${String(++geladen).padStart(3, '0')}-${decodeURIComponent(new URL(d.adresse).pathname.split('/').pop()).replace(/[^\p{L}\p{N}._-]+/gu, '-').slice(-60)}`;
  await writeFile(join(ziel, datei), buf);
  Object.assign(d, { datei, kb: Math.round(buf.length / 1024) });
  bytes += buf.length;
}

const bestand = { adresse: start.href, erfasst: new Date().toISOString(), seiten, dateien: [...dateien.values()], fremdeDienste: Object.fromEntries([...extern].sort((a, b) => b[1] - a[1])) };
await writeFile(join(ziel, 'bestand.json'), JSON.stringify(bestand, null, 2));
console.log(`${seiten.length} Seiten, ${geladen} Dateien geladen (${Math.round(bytes / 1024 / 1024)} MB), Formulare auf ${seiten.filter((s) => s.formulare.length).length} Seiten, Einbettungen: ${[...new Set(seiten.flatMap((s) => s.einbettungen))].length}`);
console.log(`Ergebnis: ${join(ziel, 'bestand.json')}`);
