#!/usr/bin/env node
// Prüft an der gebauten Seite, ob sie gefunden werden kann (Skill seo-grundlagen, Abschnitt «Sichtbar werden»): von Suchmaschinen und von
// KI-Assistenten. Ohne Abhängigkeiten (Node 18+), ohne Netz, liest nur. Dieselben zwölf Punkte, mit denselben Namen, zeigt das Cockpit in
// seiner Etappe «Sichtbar werden».
//   node sichtbar-pruefen.mjs [projektordner]   die gebaute Seite in seite/, sonst dist/
//   --ordner <ordner>                           ein anderer Ordner mit der gebauten Seite
//   --adresse https://…                         die Hauptadresse; sonst «Adresse:» aus docs/live.md oder docs/lancieren.md, sonst aus der Seite
//   --json                                      das Ergebnis als JSON
// titel               jede Seite hat einen eigenen <title> (10 bis 60 Zeichen)
// beschreibung        jede Seite hat eine eigene <meta name="description"> (50 bis 160 Zeichen)
// h1                  jede Seite hat genau eine <h1>
// bilder              jedes <img> hat alt (leer bei Schmuck), width und height; kein Bild über 500 KB
// sitemap             sitemap.xml (oder sitemap-index.xml) mit vollen https-Adressen, jede Seite steht darin
// robots              robots.txt sperrt nicht alles aus und nennt die Sitemap mit voller Adresse
// kanonisch           jede Seite nennt mit <link rel="canonical"> ihre eine Adresse, alle mit derselben Hauptadresse
// strukturierte_daten JSON-LD (schema.org) mit der Art des Geschäfts, gültig, Name und Adresse da, keine eigenen Sterne
// open_graph          og:title, og:description, og:image und og:url je Seite (die Vorschau beim Teilen)
// llms_txt            /llms.txt nach llmstxt.org: Titel, Zusammenfassung, Links, die es gibt (ein Vorschlag, kein Standard)
// gewicht             je Seite höchstens 1 MB (gelb) und 2 MB (rot) mit allem, was sie fest einbindet
// indexnow            Schlüsseldatei <schlüssel>.txt im Wurzelordner, Inhalt gleich dem Schlüssel (für Bing und andere, nicht Google)
// Dazu, ohne eigenen Punkt im Cockpit: interne_links (jede Seite ist von einer anderen aus verlinkt) und sprache (<html lang>).
// Rot: Das verhindert oder verfälscht das Finden. Gelb: empfohlen, die Seite wird auch so gefunden. Ende mit 1 bei Rot, mit 2 ohne Seite.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const wert = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const JSON_AUS = args.includes('--json');
const mitWert = new Set(['--ordner', '--adresse']);
const WURZEL = resolve(args.find((a, i) => !a.startsWith('--') && !mitWert.has(args[i - 1])) ?? '.');
const ORDNER = wert('--ordner') ? resolve(WURZEL, wert('--ordner')) : [join(WURZEL, 'seite'), join(WURZEL, 'dist')].find((d) => existsSync(join(d, 'index.html'))) ?? join(WURZEL, 'seite');
if (!existsSync(join(ORDNER, 'index.html'))) {
  console.error(`${relative(WURZEL, ORDNER) || '.'}/index.html fehlt: zuerst bauen (Skill webseite-bauen), dann prüfen.`);
  process.exit(2);
}

const PUNKTE = ['titel', 'beschreibung', 'h1', 'bilder', 'sitemap', 'robots', 'kanonisch', 'strukturierte_daten', 'open_graph', 'llms_txt', 'gewicht', 'indexnow'];
const ZUSATZ = ['interne_links', 'sprache'];
const STUFE = { hinweis: -1, grün: 0, gelb: 1, rot: 2 };
const M = Object.fromEntries([...PUNKTE, ...ZUSATZ].map((p) => [p, []]));
const melde = (punkt, ampel, text) => M[punkt].push({ ampel, text });

const lies = (f) => readFileSync(f, 'utf8');
const rel = (f) => relative(ORDNER, f).split(sep).join('/');
const alle = (d) => (existsSync(d) && statSync(d).isDirectory() ? readdirSync(d, { withFileTypes: true }) : [])
  .flatMap((e) => (e.name === 'node_modules' || e.name === '.git' ? [] : e.isDirectory() ? alle(join(d, e.name)) : [join(d, e.name)]));
const leer = (m) => m.replace(/[^\n]/g, ' ');
const ohneKommentare = (h) => h.replace(/<!--[\s\S]*?-->/g, leer);
const ATTR = /([^\s"'=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
const entitaeten = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
const tags = (h, name) => [...ohneKommentare(h).replace(/(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2\s*>)/gi, (m, auf, n, innen, zu) => auf + leer(innen) + zu)
  .matchAll(new RegExp(`<(${name})\\b((?:[^>"']|"[^"]*"|'[^']*')*)>`, 'gi'))].map((m) => ({
  name: m[1].toLowerCase(),
  roh: m[2],
  a: Object.fromEntries([...m[2].matchAll(ATTR)].map((x) => [x[1].toLowerCase(), entitaeten(x[2] ?? x[3] ?? x[4])])),
}));
const meta = (h, schluessel, name) => tags(h, 'meta').find((t) => (t.a[schluessel] ?? '').toLowerCase() === name)?.a.content?.trim() ?? null;
const text = (s) => entitaeten(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const liste = (xs, n = 6) => `${xs.slice(0, n).join(', ')}${xs.length > n ? ` und ${xs.length - n} weitere` : ''}`;
const ohneSchluss = (p) => (p.length > 1 ? p.replace(/\/$/, '') : p);

// ---------- Die Seiten: jede .html ausser 404, Prüfdateien von Google und Seiten mit noindex ----------
const dateien = alle(ORDNER);
const pfadVon = (f) => `/${rel(f)}`.replace(/(^|\/)index\.html?$/, '$1').replace(/\.html?$/, '');
const seiten = dateien.filter((f) => /\.html?$/i.test(f) && !/(^|\/)404\.html?$/i.test(rel(f)) && !/^google[0-9a-f]+\.html$/i.test(basename(f)))
  .map((f) => { const h = lies(f); return { f, h, pfad: pfadVon(f), noindex: /noindex/i.test(meta(h, 'name', 'robots') ?? '') }; })
  .sort((a, b) => a.pfad.localeCompare(b.pfad));
const zaehlbar = seiten.filter((s) => !s.noindex);
const startseite = seiten.find((s) => s.pfad === '/');

// Die Hauptadresse: angegeben, sonst aus docs/, sonst aus der kanonischen Adresse der Startseite
const kanonisch = (h) => tags(h, 'link').find((t) => /(^|\s)canonical(\s|$)/i.test(t.a.rel ?? ''))?.a.href?.trim() ?? null;
const ausDocs = ['docs/live.md', 'docs/lancieren.md'].map((d) => join(WURZEL, d)).filter((d) => existsSync(d))
  .map((d) => /^Adresse:\s*(https?:\/\/\S+)/m.exec(lies(d))?.[1]).find(Boolean);
const url = (u) => { try { return new URL(u); } catch { return null; } };
const HAUPT = url(wert('--adresse') ?? ausDocs ?? kanonisch(startseite.h) ?? '');
const eigen = (u) => !!u && !!HAUPT && u.host === HAUPT.host;

// ---------- titel, beschreibung, h1 ----------
const doppelt = (paare) => { const m = new Map(); for (const [k, wo] of paare) m.set(k, [...(m.get(k) ?? []), wo]); return [...m].filter(([, wo]) => wo.length > 1); };
{
  const titel = zaehlbar.map((s) => [text(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(ohneKommentare(s.h))?.[1] ?? ''), s.pfad]);
  const ohne = titel.filter(([t]) => !t).map(([, p]) => p);
  if (ohne.length) melde('titel', 'rot', `Ohne <title>: ${liste(ohne)}`);
  for (const [t, wo] of doppelt(titel.filter(([t]) => t))) melde('titel', 'gelb', `Derselbe Titel «${t}» auf ${liste(wo)}: jede Seite braucht ihren eigenen`);
  const lang = titel.filter(([t]) => t && (t.length < 10 || t.length > 60)).map(([t, p]) => `${p} (${t.length} Zeichen)`);
  if (lang.length) melde('titel', 'gelb', `Titel kürzer als 10 oder länger als 60 Zeichen: ${liste(lang)}`);

  const beschr = zaehlbar.map((s) => [meta(s.h, 'name', 'description') ?? '', s.pfad]);
  const ohneB = beschr.filter(([t]) => !t).map(([, p]) => p);
  if (ohneB.length) melde('beschreibung', 'rot', `Ohne <meta name="description">: ${liste(ohneB)}`);
  for (const [t, wo] of doppelt(beschr.filter(([t]) => t))) melde('beschreibung', 'gelb', `Dieselbe Beschreibung auf ${liste(wo)} («${t.slice(0, 50)}…»)`);
  const langB = beschr.filter(([t]) => t && (t.length < 50 || t.length > 160)).map(([t, p]) => `${p} (${t.length} Zeichen)`);
  if (langB.length) melde('beschreibung', 'gelb', `Beschreibung kürzer als 50 oder länger als 160 Zeichen: ${liste(langB)}`);

  const h1 = zaehlbar.map((s) => [tags(s.h, 'h1').length, s.pfad]).filter(([n]) => n !== 1).map(([n, p]) => `${p} (${n})`);
  if (h1.length) melde('h1', 'rot', `Nicht genau eine Hauptüberschrift (<h1>): ${liste(h1)}`);
}

// ---------- bilder ----------
{
  const ohneAlt = [], ohneMass = [];
  for (const s of seiten) for (const t of tags(s.h, 'img')) {
    const was = `${s.pfad}: ${(t.a.src ?? '').split('/').at(-1) || 'Bild ohne src'}`;
    if (!/(^|\s)alt(\s*=|\s|$)/i.test(t.roh)) ohneAlt.push(was);
    if (!t.a.width || !t.a.height) ohneMass.push(was);
  }
  if (ohneAlt.length) melde('bilder', 'rot', `Bild ohne alt (Beschreibung, bei Schmuck alt=""): ${liste(ohneAlt)}`);
  if (ohneMass.length) melde('bilder', 'gelb', `Bild ohne width und height (die Seite springt beim Laden): ${liste(ohneMass)}`);
  const gross = dateien.filter((f) => /\.(png|jpe?g|webp|avif|gif)$/i.test(f) && statSync(f).size > 500e3).map((f) => `${rel(f)} (${Math.round(statSync(f).size / 1024)} KB)`);
  if (gross.length) melde('bilder', 'gelb', `Bild über 500 KB: ${liste(gross)}`);
}

// ---------- sitemap ----------
const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => entitaeten(m[1]));
const sitemapDatei = ['sitemap.xml', 'sitemap-index.xml', 'sitemap_index.xml'].map((n) => join(ORDNER, n)).find((f) => existsSync(f));
{
  if (!sitemapDatei) melde('sitemap', 'rot', 'sitemap.xml fehlt (bei Astro: die Integration @astrojs/sitemap mit «site» in astro.config.mjs; sie schreibt sitemap-index.xml)');
  else {
    let xml = lies(sitemapDatei);
    let adressen = locs(xml);
    if (/<sitemapindex\b/i.test(xml)) {
      adressen = [];
      for (const l of locs(xml)) {
        const teil = join(ORDNER, decodeURIComponent(url(l)?.pathname ?? l));
        if (existsSync(teil)) adressen.push(...locs(lies(teil)));
        else melde('sitemap', 'rot', `${rel(sitemapDatei)} nennt ${l}, die Datei fehlt im Bau`);
      }
    }
    const falsch = adressen.filter((a) => !/^https:\/\//i.test(a));
    if (!adressen.length) melde('sitemap', 'rot', `${rel(sitemapDatei)} nennt keine Adresse (<loc>)`);
    if (falsch.length) melde('sitemap', 'rot', `Adressen in der Sitemap müssen voll sein und mit https:// beginnen: ${liste(falsch, 3)}`);
    const fremd = adressen.filter((a) => /^https:\/\//i.test(a) && HAUPT && !eigen(url(a)));
    if (fremd.length) melde('sitemap', 'rot', `Sitemap mit anderer Hauptadresse als ${HAUPT.origin}: ${liste(fremd, 3)}`);
    const drin = new Set(adressen.map((a) => ohneSchluss(decodeURIComponent(url(a)?.pathname ?? ''))));
    const fehlt = zaehlbar.filter((s) => !drin.has(ohneSchluss(s.pfad))).map((s) => s.pfad);
    if (fehlt.length) melde('sitemap', 'gelb', `Nicht in der Sitemap: ${liste(fehlt)}`);
    const pfade = new Set(seiten.map((s) => ohneSchluss(s.pfad)));
    const tot = [...drin].filter((p) => p && !pfade.has(p));
    if (tot.length) melde('sitemap', 'gelb', `In der Sitemap, aber nicht gebaut: ${liste(tot)}`);
  }
}

// ---------- robots ----------
{
  const f = join(ORDNER, 'robots.txt');
  if (!existsSync(f)) melde('robots', 'rot', 'robots.txt fehlt (User-agent: *, Allow: /, Sitemap: https://…/sitemap.xml)');
  else {
    const zeilen = lies(f).split(/\r?\n/).map((z) => z.replace(/#.*$/, '').trim()).filter(Boolean).map((z) => { const i = z.indexOf(':'); return [z.slice(0, i).trim().toLowerCase(), z.slice(i + 1).trim()]; });
    let agenten = [], neu = true;
    const gesperrt = [];
    for (const [k, v] of zeilen) {
      if (k === 'user-agent') { if (neu) agenten = []; agenten.push(v); neu = false; continue; }
      neu = true;
      if (k === 'disallow' && v === '/') gesperrt.push(...agenten);
    }
    if (gesperrt.includes('*')) melde('robots', 'rot', 'robots.txt sperrt alle aus (User-agent: * mit Disallow: /): Keine Suchmaschine darf die Seite lesen');
    const ki = gesperrt.filter((a) => a !== '*');
    if (ki.length) melde('robots', 'hinweis', `Ausgesperrt: ${ki.join(', ')}. Das ist ein Entscheid der Person: Wer KI-Boten aussperrt, kommt in deren Antworten nicht vor`);
    const karten = zeilen.filter(([k]) => k === 'sitemap').map(([, v]) => v);
    if (!karten.length) melde('robots', 'gelb', 'robots.txt nennt die Sitemap nicht (Sitemap: https://…/sitemap.xml): So finden sie auch Suchmaschinen, bei denen niemand sie eingereicht hat');
    for (const k of karten) {
      if (!/^https:\/\//i.test(k)) melde('robots', 'rot', `robots.txt: «Sitemap: ${k}» braucht die volle Adresse mit https://`);
      else if (HAUPT && !eigen(url(k))) melde('robots', 'gelb', `robots.txt nennt eine Sitemap unter einer anderen Adresse (${k}) als ${HAUPT.origin}`);
      else if (!existsSync(join(ORDNER, decodeURIComponent(url(k)?.pathname ?? '')))) melde('robots', 'rot', `robots.txt nennt ${k}, die Datei fehlt im Bau`);
    }
  }
}

// ---------- kanonisch ----------
{
  const ohne = [], falsch = [], fremd = [], anders = [];
  for (const s of zaehlbar) {
    const k = kanonisch(s.h);
    const u = k ? url(k) : null;
    if (!k) ohne.push(s.pfad);
    else if (!u || u.protocol !== 'https:') falsch.push(`${s.pfad} → ${k}`);
    else if (!eigen(u)) fremd.push(`${s.pfad} → ${u.origin}`);
    else if (ohneSchluss(decodeURIComponent(u.pathname)) !== ohneSchluss(s.pfad)) anders.push(`${s.pfad} → ${u.pathname}`);
  }
  if (ohne.length) melde('kanonisch', 'rot', `Ohne <link rel="canonical">: ${liste(ohne)}`);
  if (falsch.length) melde('kanonisch', 'rot', `Kanonische Adresse nicht voll mit https://: ${liste(falsch, 3)}`);
  if (fremd.length) melde('kanonisch', 'rot', `Kanonische Adresse mit anderer Hauptadresse${HAUPT ? ` als ${HAUPT.origin}` : ''}: ${liste(fremd, 3)}`);
  if (anders.length) melde('kanonisch', 'gelb', `Kanonische Adresse zeigt auf eine andere Seite: ${liste(anders, 3)}`);
}

// ---------- strukturierte_daten ----------
{
  const bloecke = [];
  for (const s of seiten) for (const m of ohneKommentare(s.h).matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi)) {
    try { bloecke.push({ pfad: s.pfad, daten: JSON.parse(m[1]) }); } catch { melde('strukturierte_daten', 'rot', `${s.pfad}: Der Block application/ld+json ist kein gültiges JSON`); }
  }
  const dinge = bloecke.flatMap((b) => [b.daten].flat().flatMap((d) => (d && typeof d === 'object' && Array.isArray(d['@graph']) ? d['@graph'].map((g) => ({ '@context': d['@context'], ...g })) : [d])).map((d) => ({ pfad: b.pfad, d })));
  if (!bloecke.length && !M.strukturierte_daten.length) melde('strukturierte_daten', 'gelb', 'Keine strukturierten Daten (JSON-LD): auf der Startseite ein Block mit der Art des Geschäfts, Name, Adresse und Öffnungszeiten');
  for (const { pfad, d } of dinge) {
    if (!d || typeof d !== 'object') { melde('strukturierte_daten', 'rot', `${pfad}: JSON-LD ist kein Objekt`); continue; }
    const arten = [d['@type']].flat().filter(Boolean).map(String);
    if (!/schema\.org/i.test(JSON.stringify(d['@context'] ?? ''))) melde('strukturierte_daten', 'rot', `${pfad}: JSON-LD ohne "@context": "https://schema.org"`);
    if (!arten.length) { melde('strukturierte_daten', 'rot', `${pfad}: JSON-LD ohne "@type" (die Art: LocalBusiness oder genauer, Organization, Person, Event …)`); continue; }
    if (d.address !== undefined || arten.some((a) => /LocalBusiness|Store|Restaurant|Dentist|Salon|Shop/i.test(a))) {
      const fehlt = ['name', 'address'].filter((k) => !d[k] || (typeof d[k] === 'object' && !Object.keys(d[k]).length));
      if (fehlt.length) melde('strukturierte_daten', 'gelb', `${pfad}: ${arten.join(', ')} ohne ${fehlt.join(' und ')} (Google verlangt name und address)`);
    }
    if (d.aggregateRating !== undefined || d.review !== undefined)
      melde('strukturierte_daten', 'gelb', `${pfad}: ${arten.join(', ')} mit Bewertungen (aggregateRating oder review). Eigene Sterne zum eigenen Geschäft zeigt Google nicht, und erfundene sind verboten: nur echte, sichtbar auf der Seite, mit Quelle`);
    if (/\[(annahme|offen|platzhalter)\b/i.test(JSON.stringify(d))) melde('strukturierte_daten', 'rot', `${pfad}: JSON-LD mit [Annahme], [offen] oder [Platzhalter]: Dort stehen nur geprüfte Angaben`);
  }
  if (bloecke.length && startseite && !bloecke.some((b) => b.pfad === '/')) melde('strukturierte_daten', 'gelb', 'Die Startseite hat keine strukturierten Daten, andere Seiten schon');
}

// ---------- open_graph ----------
{
  const NOETIG = ['og:title', 'og:description', 'og:image', 'og:url'];
  const luecken = zaehlbar.map((s) => [s.pfad, NOETIG.filter((n) => !meta(s.h, 'property', n))]).filter(([, f]) => f.length);
  if (zaehlbar.length && luecken.length === zaehlbar.length && luecken.every(([, f]) => f.length === NOETIG.length)) melde('open_graph', 'rot', 'Keine Seite hat Open-Graph-Angaben (og:title, og:description, og:image, og:url): Geteilte Links zeigen kein Bild und keinen Text');
  else for (const [p, f] of luecken.slice(0, 8)) melde('open_graph', 'gelb', `${p}: es fehlt ${f.join(', ')}`);
  for (const s of zaehlbar) {
    const bild = meta(s.h, 'property', 'og:image');
    if (!bild) continue;
    const u = url(bild);
    if (!u || u.protocol !== 'https:') melde('open_graph', 'gelb', `${s.pfad}: og:image braucht die volle Adresse mit https:// (${bild})`);
    else if (eigen(u) && !existsSync(join(ORDNER, decodeURIComponent(u.pathname)))) melde('open_graph', 'rot', `${s.pfad}: og:image zeigt auf ${u.pathname}, die Datei fehlt im Bau`);
  }
}

// ---------- llms_txt ----------
{
  const f = join(ORDNER, 'llms.txt');
  if (!existsSync(f)) melde('llms_txt', 'gelb', 'llms.txt fehlt: eine kurze Übersicht für KI-Assistenten (Titel, ein Satz, Links zu den wichtigsten Seiten). Ein Vorschlag (llmstxt.org), kein Standard; Google braucht sie nicht');
  else {
    const t = lies(f).replace(/^﻿/, '');
    const zeilen = t.split(/\r?\n/);
    if (!/^# \S/.test(zeilen.find((z) => z.trim()) ?? '')) melde('llms_txt', 'rot', 'llms.txt beginnt nicht mit «# <Name>» (die einzige Pflicht nach llmstxt.org)');
    if (!zeilen.some((z) => /^>\s*\S/.test(z))) melde('llms_txt', 'gelb', 'llms.txt ohne Zusammenfassung («> ein, zwei Sätze: was, für wen, wo»)');
    const links = [...t.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map((m) => m[2]);
    if (!links.length) melde('llms_txt', 'gelb', 'llms.txt ohne Links («## Seiten», darunter «- [Name](https://…): worum es geht»)');
    const pfade = new Set(seiten.map((s) => ohneSchluss(s.pfad)));
    const tot = links.filter((l) => { const u = url(l); return u && eigen(u) && !pfade.has(ohneSchluss(decodeURIComponent(u.pathname))) && !existsSync(join(ORDNER, decodeURIComponent(u.pathname))); });
    if (tot.length) melde('llms_txt', 'rot', `llms.txt nennt Adressen, die es im Bau nicht gibt: ${liste(tot, 3)}`);
    if (links.some((l) => !/^https:\/\//i.test(l))) melde('llms_txt', 'gelb', 'llms.txt: Links mit voller Adresse (https://…)');
    if (/\[(annahme|offen|platzhalter)\b|lorem ipsum/i.test(t)) melde('llms_txt', 'rot', 'llms.txt mit [Annahme], [offen], [Platzhalter] oder Lorem: Dort stehen nur geprüfte Fakten');
  }
}

// ---------- gewicht ----------
{
  const groesse = (f) => (existsSync(f) && statSync(f).isFile() ? statSync(f).size : 0);
  const lokal = (z) => z && !/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(z);
  const ziel = (von, z) => (z.startsWith('/') ? join(ORDNER, z) : resolve(dirname(von), z)).split(/[?#]/)[0];
  for (const s of seiten) {
    const teile = new Set();
    for (const t of tags(s.h, 'link|script|img|source|video|audio')) {
      const z = t.a.href ?? t.a.src ?? t.a.poster;
      if (!lokal(z) || (t.name === 'link' && !/stylesheet|preload|modulepreload|icon/i.test(t.a.rel ?? ''))) continue;
      const d = ziel(s.f, z);
      teile.add(d);
      if (/\.css$/i.test(d) && existsSync(d)) for (const u of lies(d).replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/g)) if (lokal(u[2])) teile.add(ziel(d, u[2]));
    }
    const summe = Buffer.byteLength(s.h) + [...teile].reduce((n, d) => n + groesse(d), 0);
    if (summe > 1e6) melde('gewicht', summe > 2e6 ? 'rot' : 'gelb', `${s.pfad}: ${Math.round(summe / 1024)} KB mit allem, was die Seite fest einbindet (Ziel unter 1 MB, Grenze 2 MB)`);
  }
}

// ---------- indexnow ----------
{
  const BEKANNT = /^(robots|llms|llms-full|humans|security|ads|app-ads)$/i;
  const kandidaten = readdirSync(ORDNER).filter((n) => /^[A-Za-z0-9-]{8,128}\.txt$/.test(n) && !BEKANNT.test(n.slice(0, -4)));
  const gut = kandidaten.filter((n) => lies(join(ORDNER, n)).trim() === n.slice(0, -4));
  if (gut.length) melde('indexnow', 'grün', `Schlüsseldatei für IndexNow liegt im Wurzelordner (${gut[0].slice(0, 6)}….txt)`);
  else if (kandidaten.length) melde('indexnow', 'rot', `${kandidaten[0]}: Der Inhalt ist nicht derselbe Schlüssel wie der Dateiname (8 bis 128 Zeichen aus a–z, A–Z, 0–9 und «-»)`);
  else melde('indexnow', 'gelb', 'Keine Schlüsseldatei für IndexNow: Damit erfahren Bing und andere (nicht Google) sofort von neuen und geänderten Seiten. Mit Albatros Light und Pilot meldet Albatros die Seiten');
}

// ---------- Zusatz: interne Links und Sprache ----------
{
  const verlinkt = new Set(['/']);
  for (const s of seiten) for (const t of tags(s.h, 'a')) {
    const z = t.a.href;
    if (!z || /^(mailto:|tel:|#|javascript:)/i.test(z)) continue;
    const u = url(z) ?? (() => { try { return new URL(z, `https://x${s.pfad}`); } catch { return null; } })();
    if (u && (u.host === 'x' || eigen(u))) verlinkt.add(ohneSchluss(decodeURIComponent(u.pathname).replace(/(^|\/)index\.html?$/, '$1').replace(/\.html?$/, '')) || '/');
  }
  const allein = zaehlbar.filter((s) => !verlinkt.has(ohneSchluss(s.pfad))).map((s) => s.pfad);
  if (allein.length) melde('interne_links', 'gelb', `Von keiner anderen Seite verlinkt: ${liste(allein)}`);
  const ohneLang = seiten.filter((s) => !tags(s.h, 'html')[0]?.a.lang).map((s) => s.pfad);
  if (ohneLang.length) melde('sprache', 'gelb', `Ohne <html lang="…">: ${liste(ohneLang)}`);
}

// ---------- Ergebnis ----------
const OK = { titel: 'Jede Seite hat ihren eigenen Titel', beschreibung: 'Jede Seite hat ihre eigene Beschreibung', h1: 'Jede Seite hat genau eine Hauptüberschrift',
  bilder: 'Jedes Bild hat Beschreibung und Masse', sitemap: 'Die Sitemap nennt jede Seite mit voller Adresse', robots: 'robots.txt lässt Suchmaschinen herein und nennt die Sitemap',
  kanonisch: 'Jede Seite nennt ihre eine Adresse', strukturierte_daten: 'Strukturierte Daten (JSON-LD) sind gültig', open_graph: 'Geteilte Links zeigen Titel, Text und Bild',
  llms_txt: 'llms.txt mit Titel, Zusammenfassung und Links', gewicht: 'Jede Seite unter 1 MB', indexnow: '', interne_links: 'Jede Seite ist von einer anderen aus verlinkt', sprache: 'Jede Seite nennt ihre Sprache' };
const punkt = (name) => {
  const m = M[name];
  const ampel = m.reduce((a, x) => (STUFE[x.ampel] > STUFE[a] ? x.ampel : a), 'grün');
  const schlimmste = m.filter((x) => x.ampel === ampel);
  return { name, ampel, text: ampel === 'grün' ? (m.find((x) => x.ampel === 'grün')?.text ?? OK[name]) : schlimmste[0].text, details: m.filter((x) => x.ampel !== 'grün').map((x) => `${x.ampel}: ${x.text}`) };
};
const punkte = PUNKTE.map(punkt);
const zusatz = ZUSATZ.map(punkt);
const rot = punkte.some((p) => p.ampel === 'rot');
const gelb = [...punkte, ...zusatz].some((p) => p.ampel === 'gelb');
const ergebnis = rot ? 'rot' : gelb ? 'gelb' : 'grün';
if (JSON_AUS) console.log(JSON.stringify({ ordner: relative(WURZEL, ORDNER).split(sep).join('/') || '.', adresse: HAUPT?.origin ?? null, seiten: zaehlbar.length, punkte, zusatz, ergebnis }, null, 1));
else {
  console.log(`Sichtbar werden: ${zaehlbar.length} ${zaehlbar.length === 1 ? 'Seite' : 'Seiten'} in ${relative(WURZEL, ORDNER) || '.'}/${HAUPT ? `, Hauptadresse ${HAUPT.origin}` : ', Hauptadresse unbekannt (--adresse https://…)'}\n`);
  for (const p of [...punkte, ...zusatz]) {
    console.log(`${p.ampel === 'grün' ? '🟢' : p.ampel === 'gelb' ? '🟡' : '🔴'} ${p.name.padEnd(20)} ${p.ampel === 'grün' ? p.text : ''}`);
    for (const d of p.details) console.log(`   ${d}`);
  }
  console.log(rot ? '\nErgebnis: rot. Behebe die roten Punkte, bau neu und prüf nochmals.' : gelb ? '\nErgebnis: gelb. Nichts verhindert das Finden; die gelben Punkte sind empfohlen.' : '\nErgebnis: grün.');
  console.log('Nicht geprüft (das geht nur von aussen und mit der Person): Anmeldung in der Google Search Console und bei den Bing Webmaster Tools, ob die Fakten stimmen, Links von anderen Seiten.');
}
process.exit(rot ? 1 : 0);
