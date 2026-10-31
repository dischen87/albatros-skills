#!/usr/bin/env node
// Prüft den Entwurf der ganzen Seite (Skill entwurf, Fahrplan P7), ohne Abhängigkeiten (Node 18+). Liest nur, schreibt nichts.
//   node entwurf-pruefen.mjs [projektordner]       Standard: der Ordner, in dem du gerade bist
//   --nur seiten,links,farbfaecher,menue           nur diese Bereiche; farbfaecher geht schon in P6 (tokens.css und Musterblatt)
// Seiten      Jede Seite aus der Zeile «Seiten:» in docs/plan.md hat ihre Datei in design/entwurf/, ausser Impressum und Datenschutz:
//             die Startseite index.html, sonst der Name klein, ä → ae, ö → oe, ü → ue, alles andere «-» («Über uns» → ueber-uns.html).
// Links       Jeder Link, jedes Bild, jedes Formular und jedes url(…) zeigt auf eine Datei, die es gibt, genau so geschrieben.
// Farbfächer  Farben, Schriften und Grössen (Schriftgrösse, Abstände, Rundungen, Schatten) nur als var(--…) aus design/tokens.css,
//             in den Entwurfsseiten, ihren Stylesheets und im Musterblatt; jeder Kontrast-Kommentar in tokens.css nachgerechnet.
// Menü        Dasselbe Menü auf jeder Seite, Ansicht fürs Handy (viewport), [Platzhalter] gezählt, Zeilen in docs/entwurf.md.
// Ende mit 1, wenn ein Bereich rot ist, sonst mit 0.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const BEREICHE = ['seiten', 'links', 'farbfaecher', 'menue'];
const nurBei = args.indexOf('--nur');
const NUR = new Set(nurBei >= 0 ? (args[nurBei + 1] ?? '').split(',').filter(Boolean) : BEREICHE);
const unbekannt = [...NUR].filter((b) => !BEREICHE.includes(b));
if (!NUR.size || unbekannt.length) {
  console.error(`--nur kennt ${BEREICHE.join(', ')}${unbekannt.length ? `, nicht ${unbekannt.join(', ')}` : ''}`);
  process.exit(2);
}
const WURZEL = resolve(args.find((a, i) => !a.startsWith('--') && (nurBei < 0 || i !== nurBei + 1)) ?? '.');
const ENTWURF = join(WURZEL, 'design', 'entwurf');
const TOKENS = join(WURZEL, 'design', 'tokens.css');
const MUSTERBLATT = join(WURZEL, 'design', 'musterblatt.html');
const PLAN = join(WURZEL, 'docs', 'plan.md');
const NOTIZEN = join(WURZEL, 'docs', 'entwurf.md');

// Ergebnis wie bei pruefen.mjs (Skill webseite-bauen): je Bereich eine Ampel, die schlechteste seiner Punkte
const STUFE = { hinweis: -1, grün: 0, gelb: 1, rot: 2 };
const NAMEN = { seiten: 'Seiten aus dem Plan', links: 'Links und Dateien', farbfaecher: 'Farbfächer: nur var(--…) aus design/tokens.css', menue: 'Menü, Handy und Notizen' };
const B = Object.fromEntries(BEREICHE.filter((b) => NUR.has(b)).map((b) => [b, { ampel: 'grün', punkte: [] }]));
const melde = (b, ampel, text) => {
  if (!B[b]) return;
  B[b].punkte.push({ ampel, text });
  if (STUFE[ampel] > STUFE[B[b].ampel]) B[b].ampel = ampel;
};

const lies = (f) => readFileSync(f, 'utf8');
const rel = (f) => relative(WURZEL, f).split(sep).join('/') || '.';
const zeileBei = (text, pos) => text.slice(0, pos).split('\n').length;
const alle = (d) => (existsSync(d) && statSync(d).isDirectory() ? readdirSync(d, { withFileTypes: true }) : [])
  .flatMap((e) => (e.name.startsWith('.') || e.name === 'node_modules' ? [] : e.isDirectory() ? alle(join(d, e.name)) : [join(d, e.name)]));
const SEITEN = alle(ENTWURF).filter((f) => /\.html?$/i.test(f)).sort();

// Gibt es den Pfad genau so geschrieben? Mac und Windows verzeihen «Kontakt.html» statt «kontakt.html», ein Server nicht.
const liste = new Map();
const namen = (d) => {
  if (!liste.has(d)) liste.set(d, existsSync(d) && statSync(d).isDirectory() ? readdirSync(d) : []);
  return liste.get(d);
};
const suche = (f, gleich) => {
  const r = relative(WURZEL, f);
  if (r === '..' || r.startsWith(`..${sep}`)) return { art: 'draussen' };
  let d = WURZEL;
  for (const teil of r.split(sep).filter(Boolean)) {
    const treffer = namen(d).find((n) => (gleich ? n === teil : n.toLowerCase() === teil.toLowerCase()));
    if (!treffer) return { art: null };
    d = join(d, treffer);
  }
  return { art: statSync(d).isDirectory() ? 'ordner' : 'datei', pfad: d };
};

// HTML ohne Abhängigkeiten: Kommentare und den Inhalt von <script> und <style> ausblenden (Zeilen bleiben), dann die Tags lesen
const leer = (m) => m.replace(/[^\n]/g, ' ');
const ohneKommentare = (h) => h.replace(/<!--[\s\S]*?-->/g, leer);
const nurTags = (h) => ohneKommentare(h).replace(/(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2\s*>)/gi, (m, auf, n, innen, zu) => auf + leer(innen) + zu);
const ATTR = /([^\s"'=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
const tags = (h) => [...nurTags(h).matchAll(/<([a-zA-Z][\w-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/g)].map((m) => ({
  name: m[1].toLowerCase(),
  pos: m.index,
  a: Object.fromEntries([...m[2].matchAll(ATTR)].map((x) => [x[1].toLowerCase(), (x[2] ?? x[3] ?? x[4]).replace(/&amp;/g, '&')])),
}));
const stile = (h) => [...ohneKommentare(h).matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map((m) => ({ css: m[1], pos: m.index + m[0].indexOf('>') + 1 }));
const ohneCssKommentare = (c) => c.replace(/\/\*[\s\S]*?\*\//g, leer);
const IMPORT = /@import\s+(?:url\(\s*)?["']?([^"')\s;]+)["']?\s*\)?/g;
const URL_IN_CSS = /url\(\s*(["']?)([^"')]+)\1\s*\)/g;
const aussen = (z) => /^[a-z][a-z0-9+.-]*:/i.test(z) || z.startsWith('//');
const entschluesseln = (p) => { try { return decodeURIComponent(p); } catch { return p; } };
const ort = (z) => resolve(dirname(z.datei), entschluesseln(z.ziel.split('#')[0].split('?')[0]));

// ---------- Seiten aus dem Plan ----------
// Zeile «Seiten: Start, Angebot, Über uns, Kontakt, Impressum, Datenschutz»; eine Liste darunter oder unter «## Seiten» geht auch.
// [Annahme: …] wird ausgepackt, (Erklärungen), [offen: …] und alles nach «:» oder « – » fallen weg.
const START = /^(start|startseite|home|homepage|home ?page|landingpage|landing ?page|accueil|page d'accueil|page d’accueil|pagina iniziale|inizio)$/i;
const RECHT = /impressum|imprint|legal|mentions|note legali|datenschutz|privacy|confidentialit|protection des donn|protezione|informativa/i;
const ANNAHME = /\[(?:annahme|hypoth[eè]se|ipotesi|assumption)\s*:?\s*([^\]]*)\]/gi;
const dateiFuer = (name) => (START.test(name) ? 'index.html' : `${name.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.html`);
const teilen = (s) => {
  const teile = [];
  let tiefe = 0, jetzt = '';
  for (const z of s) {
    if ('([{'.includes(z)) tiefe++;
    if (')]}'.includes(z)) tiefe = Math.max(0, tiefe - 1);
    if (!tiefe && (z === ',' || z === ';')) { teile.push(jetzt); jetzt = ''; } else jetzt += z;
  }
  return [...teile, jetzt];
};
const seitenAusPlan = (text) => {
  const zeilen = text.split(/\r?\n/);
  const punkte = (ab) => {
    const r = [];
    for (let i = ab; i < zeilen.length; i++) {
      const p = /^\s*(?:[-*+]|\d+\.)\s+(.*)$/.exec(zeilen[i]);
      if (p) r.push(p[1]);
      else if (zeilen[i].trim() || r.length) break;
    }
    return r;
  };
  let roh = [];
  const z = zeilen.findIndex((x) => /^\s*(?:\*\*|__)?Seiten(?:\*\*|__)?\s*:/i.test(x));
  if (z >= 0) {
    const wert = zeilen[z].replace(/^\s*(?:\*\*|__)?Seiten(?:\*\*|__)?\s*:\s*(?:\*\*|__)?/i, '').trim();
    roh = wert ? teilen(wert.replace(ANNAHME, '$1')) : punkte(z + 1);
  } else {
    const t = zeilen.findIndex((x) => /^#{1,6}\s*Seiten\s*$/i.test(x));
    if (t >= 0) roh = punkte(t + 1);
  }
  const seiten = new Map();
  for (const r of roh) {
    const name = r.replace(ANNAHME, '$1').replace(/\[[^\]]*\]/g, '').replace(/\([^)]*\)/g, '').replace(/[*_`]/g, '')
      .split(/:|\s[–—-]\s/)[0].trim().replace(/[.!?]+$/, '');
    if (!name) continue;
    const datei = RECHT.test(name) ? null : dateiFuer(name);
    const schluessel = datei ?? name.toLowerCase();
    if (!seiten.has(schluessel)) seiten.set(schluessel, { name, datei });
  }
  return [...seiten.values()];
};

if (B.seiten) {
  if (!existsSync(PLAN)) melde('seiten', 'rot', 'docs/plan.md fehlt: ohne Plan keine Liste der Seiten (Skill webseite-planen)');
  else {
    const seiten = seitenAusPlan(lies(PLAN));
    if (!seiten.length) melde('seiten', 'rot', 'In docs/plan.md fehlt die Zeile «Seiten:» mit den Seiten, durch Komma getrennt');
    if (!SEITEN.length) melde('seiten', 'rot', 'design/entwurf/ fehlt oder hat keine Seiten (.html)');
    for (const s of seiten) {
      if (!s.datei) { melde('seiten', 'hinweis', `${s.name}: im Entwurf nicht nötig, der Text kommt beim Bauen (Skill recht-ch)`); continue; }
      const da = [s.datei, `${s.datei.replace(/\.html$/, '')}/index.html`].find((d) => suche(join(ENTWURF, d), true).art === 'datei');
      melde('seiten', da ? 'grün' : 'rot', da ? `${s.name} → design/entwurf/${da}` : `${s.name}: design/entwurf/${s.datei} fehlt`);
    }
  }
}

// ---------- Was die Seiten laden: Stylesheets (mit @import), damit tokens.css und ihre url(…) mitgeprüft werden ----------
const verweise = []; // { datei, ziel, link }
const VERWEISE = { a: ['href'], area: ['href'], link: ['href'], img: ['src', 'srcset'], source: ['src', 'srcset'], script: ['src'], iframe: ['src'],
  video: ['src', 'poster'], audio: ['src'], track: ['src'], embed: ['src'], object: ['data'], form: ['action'], input: ['src'] };
const geladen = new Map(); // Seite → Stylesheets, die sie lädt
const cssDateien = new Set(alle(ENTWURF).filter((f) => /\.css$/i.test(f)));
const importe = (css, von, menge) => {
  for (const m of ohneCssKommentare(css).matchAll(IMPORT)) {
    if (aussen(m[1])) continue;
    const f = resolve(dirname(von), entschluesseln(m[1].split('?')[0]));
    if (menge.has(f) || suche(f, true).art !== 'datei') continue;
    menge.add(f);
    importe(lies(f), f, menge);
  }
};
for (const seite of [...SEITEN, ...(existsSync(MUSTERBLATT) ? [MUSTERBLATT] : [])]) {
  const html = lies(seite);
  const menge = new Set();
  for (const t of tags(html)) {
    for (const name of VERWEISE[t.name] ?? []) {
      const wert = t.a[name];
      if (wert === undefined) continue;
      const ziele = name === 'srcset' ? wert.split(',').map((x) => x.trim().split(/\s+/)[0]).filter(Boolean) : [wert];
      for (const ziel of ziele) verweise.push({ datei: seite, ziel, link: t.name === 'a' || t.name === 'area' });
    }
    if (t.name === 'link' && /stylesheet/i.test(t.a.rel ?? '') && t.a.href && !aussen(t.a.href)) {
      const f = ort({ datei: seite, ziel: t.a.href });
      if (suche(f, true).art === 'datei' && !menge.has(f)) { menge.add(f); importe(lies(f), f, menge); }
    }
  }
  for (const s of stile(html)) {
    importe(s.css, seite, menge);
    for (const m of ohneCssKommentare(s.css).matchAll(URL_IN_CSS)) verweise.push({ datei: seite, ziel: m[2], link: false });
  }
  for (const t of tags(html)) for (const m of (t.a.style ?? '').matchAll(URL_IN_CSS)) verweise.push({ datei: seite, ziel: m[2], link: false });
  geladen.set(seite, menge);
  for (const f of menge) cssDateien.add(f);
}
for (const f of cssDateien) for (const m of ohneCssKommentare(lies(f)).matchAll(URL_IN_CSS)) verweise.push({ datei: f, ziel: m[2], link: false });

// ---------- Links und Dateien ----------
const ids = new Map();
const idsVon = (f) => {
  if (!ids.has(f)) ids.set(f, new Set(tags(lies(f)).flatMap((t) => [t.a.id, t.name === 'a' ? t.a.name : undefined]).filter(Boolean)));
  return ids.get(f);
};
if (B.links) {
  if (!SEITEN.length) melde('links', 'rot', 'design/entwurf/ fehlt oder hat keine Seiten (.html)');
  let geprueft = 0, nachAussen = 0;
  // Derselbe Fehler an mehreren Stellen (oft über das Menü) wird eine Zeile mit allen Stellen
  const funde = new Map();
  const fund = (ampel, schluessel, text, datei) => {
    if (!funde.has(schluessel)) funde.set(schluessel, { ampel, text, wo: [] });
    const wo = rel(datei).replace(/^design\/entwurf\//, '');
    if (!funde.get(schluessel).wo.includes(wo)) funde.get(schluessel).wo.push(wo);
  };
  for (const v of verweise.filter((x) => !(x.datei === MUSTERBLATT && x.link))) {
    const ziel = v.ziel.trim();
    if (!ziel || ziel === '#') {
      fund(v.link ? 'gelb' : 'rot', `leer|${ziel}|${v.link}`, `${v.link ? 'Link ohne Ziel' : 'Verweis ohne Datei'} («${v.ziel}»): auf eine Seite, einen Zustand oder nach aussen zeigen lassen`, v.datei);
      continue;
    }
    if (aussen(ziel)) { nachAussen++; continue; }
    geprueft++;
    const [pfadTeil, marke] = ziel.split('#');
    const pfad = pfadTeil.split('?')[0];
    const markeFehlt = (f) => marke && marke !== 'top' && /\.html?$/i.test(f) && !idsVon(f).has(entschluesseln(marke));
    if (!pfad) {
      if (markeFehlt(v.datei)) fund('gelb', `marke|${rel(v.datei)}#${marke}`, `Sprungmarke «#${marke}» gibt es auf der Seite nicht`, v.datei);
      continue;
    }
    if (pfad.startsWith('/')) {
      fund('rot', `abs|${ziel}`, `«${ziel}» beginnt mit «/». Als Datei geöffnet zeigt das auf die Festplatte statt in den Entwurf: schreib den Weg ab der Seite, zum Beispiel «${pfad.replace(/^\/+/, '') || 'index.html'}»`, v.datei);
      continue;
    }
    const f = ort(v);
    const genau = suche(f, true);
    if (genau.art === 'datei') {
      if (markeFehlt(f)) fund('gelb', `marke|${rel(f)}#${marke}`, `Sprungmarke «#${marke}» gibt es in ${rel(f)} nicht`, v.datei);
      continue;
    }
    if (genau.art === 'draussen') fund('rot', `draussen|${ziel}`, `«${ziel}» zeigt aus dem Projekt hinaus`, v.datei);
    else if (genau.art === 'ordner') fund('rot', `ordner|${rel(f)}`, `«${ziel}» zeigt auf einen Ordner. Als Datei geöffnet zeigt der Browser dann nur die Dateiliste: schreib «${pfad.replace(/\/?$/, '/')}index.html»`, v.datei);
    else if (suche(`${f}.html`, true).art === 'datei') fund('rot', `ohne|${rel(f)}`, `«${ziel}» ohne .html. Im Entwurf öffnet der Browser die Datei direkt: schreib «${pfad}.html»`, v.datei);
    else {
      const aehnlich = suche(f, false);
      if (aehnlich.art) fund('rot', `fall|${rel(f)}`, `«${ziel}» ist anders geschrieben als die Datei ${rel(aehnlich.pfad)} (gross und klein). Auf dem Server fände man sie so nicht`, v.datei);
      else fund('rot', `fehlt|${rel(f)}`, `${rel(f)} gibt es nicht, verlinkt als «${ziel}»`, v.datei);
    }
  }
  for (const x of funde.values()) melde('links', x.ampel, `${x.text} (${x.wo.length === 1 ? `auf ${x.wo[0]}` : `auf ${x.wo.length} Seiten: ${x.wo.slice(0, 4).join(', ')}${x.wo.length > 4 ? ' …' : ''}`})`);
  if (SEITEN.length && B.links.ampel !== 'rot') melde('links', 'grün', `${geprueft} Verweise geprüft, alle führen auf vorhandene Dateien${nachAussen ? ` (${nachAussen} nach aussen nicht geprüft)` : ''}`);
}

// ---------- Farbfächer: nur var(--…) aus design/tokens.css ----------
// Farbe: #hex, rgb(), hsl() und ähnliche überall, Farbnamen (white, red …) bei Farb-Eigenschaften. Schrift: font-family und font.
// Grösse: Längen mit Einheit (px, rem, em …) bei Schriftgrösse, Zeilenhöhe, Abständen, Rundungen und Schatten. Breiten, Höhen und
// @media bleiben frei (Bildschirmbreiten lassen sich nicht als var(--…) schreiben). Eigene --namen im Entwurf gelten, wenn ihr Wert
// selbst nur var(--…) nutzt.
const FARBNAMEN = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse ' +
  'chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen ' +
  'darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray ' +
  'dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred ' +
  'indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey ' +
  'lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon ' +
  'mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue ' +
  'mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred ' +
  'papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna ' +
  'silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen').split(' '));
const FARBWERT = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const FARB_EIGENSCHAFT = /^(color|background(-color)?|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|fill|stroke|(box|text)-shadow|caret-color|accent-color|text-decoration(-color)?|column-rule(-color)?|scrollbar-color|stop-color|flood-color|lighting-color|text-emphasis(-color)?|--.*)$/i;
const GROESSE_EIGENSCHAFT = /^(font-size|font|line-height|letter-spacing|word-spacing|margin(-(top|right|bottom|left|block|inline)(-(start|end))?)?|padding(-(top|right|bottom|left|block|inline)(-(start|end))?)?|(row-|column-|grid-)?gap|border(-(top|bottom)-(left|right)|-(start|end)-(start|end))?-radius|(box|text)-shadow|--.*)$/i;
const LAENGE = /(?<![\w.#-])-?(\d+\.?\d*|\.\d+)(px|rem|em|pt|pc|cm|mm|in|q|ex|ch|vw|vh|vmin|vmax|svh|lvh|dvh|svw|lvw|dvw|cqw|cqh|cqi|cqb)\b/gi;
const SCHRIFT_WORTE = new Set('inherit initial unset revert revert-layer normal italic oblique bold bolder lighter small-caps condensed expanded semi-condensed semi-expanded extra-condensed extra-expanded ultra-condensed ultra-expanded caption icon menu message-box small-caption status-bar'.split(' '));
const ohneVar = (v) => v.replace(/var\(\s*--[\w-]+\s*,?/g, ' ');
const ohneUrl = (v) => v.replace(/url\(([^()]|\([^()]*\))*\)/g, ' ');

const tokens = existsSync(TOKENS) ? lies(TOKENS) : null;
const definiert = new Set(tokens ? [...ohneCssKommentare(tokens).matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]) : []);
const eigene = new Set();
const benutzt = new Map(); // --name → erste Stelle
const vonHand = [];
// Eine Liste von Deklarationen («color: …; padding: …»); zeile0 ist die Zeile der Datei, in der text beginnt
const deklarationen = (text, datei, zeile0) => {
  let ab = 0;
  for (const teil of text.split(';')) {
    const start = ab + Math.max(0, teil.search(/\S/));
    ab += teil.length + 1;
    const m = /^\s*(--[\w-]+|[a-zA-Z-]+)\s*:\s*([\s\S]*?)\s*$/.exec(teil);
    if (!m) continue;
    const [, eigenschaft, wert] = m;
    const wo = `${rel(datei)}:${zeile0 + zeileBei(text, start) - 1}`;
    const zeigen = `${eigenschaft}: ${wert.replace(/\s+/g, ' ').slice(0, 80)}`;
    const e = eigenschaft.toLowerCase();
    if (e.startsWith('--')) eigene.add(eigenschaft);
    for (const v of wert.matchAll(/var\(\s*(--[\w-]+)/g)) if (!benutzt.has(v[1])) benutzt.set(v[1], wo);
    const w = ohneUrl(ohneVar(wert));
    const worte = w.toLowerCase().match(/[a-z][a-z-]*/g) ?? [];
    if (FARBWERT.test(w) || (FARB_EIGENSCHAFT.test(e) && worte.some((x) => FARBNAMEN.has(x)))) vonHand.push(`${wo}: Farbe von Hand (${zeigen})`);
    if ((e === 'font-family' || e === 'font') && w.replace(/["']/g, ' ').split(/[\s,/()]+/).some((x) => x && !/^[\d.]+[a-z%]*$/i.test(x) && !SCHRIFT_WORTE.has(x.toLowerCase())))
      vonHand.push(`${wo}: Schrift von Hand (${zeigen})`);
    if (GROESSE_EIGENSCHAFT.test(e) && [...w.matchAll(LAENGE)].some((x) => parseFloat(x[1]) !== 0)) vonHand.push(`${wo}: Grösse von Hand (${zeigen})`);
  }
};
// Ganzes CSS: Blöcke von innen nach aussen lesen (auch verschachteltes CSS). Kommentare und gelesene Blöcke werden zu Leerzeichen,
// so stimmen Positionen und Zeilennummern mit der Datei überein. zeileVorher: Zeilen vor dem CSS (bei <style> in einer Seite).
const pruefeCss = (css, datei, zeileVorher = 0) => {
  const original = ohneCssKommentare(css);
  let rest = original;
  for (let runde = 0; runde < 50 && /[{}]/.test(rest); runde++) {
    rest = rest.replace(/\{([^{}]*)\}/g, (m, innen, pos) => {
      deklarationen(innen, datei, zeileVorher + zeileBei(original, pos + 1));
      return leer(m);
    });
  }
};

if (B.farbfaecher) {
  if (!tokens) melde('farbfaecher', 'rot', 'design/tokens.css fehlt: Farben, Schriften und Grössen gehören dorthin (Skill gestaltung, P6)');
  const seiten = [...SEITEN, ...(existsSync(MUSTERBLATT) ? [MUSTERBLATT] : [])];
  if (!seiten.length) melde('farbfaecher', 'gelb', 'Weder design/entwurf/ noch design/musterblatt.html: nur tokens.css geprüft');
  for (const seite of seiten) {
    const html = lies(seite);
    for (const s of stile(html)) pruefeCss(s.css, seite, zeileBei(html, s.pos) - 1);
    for (const t of tags(html)) {
      if (t.a.style !== undefined) deklarationen(t.a.style, seite, zeileBei(html, t.pos));
      for (const a of ['fill', 'stroke', 'stop-color', 'color', 'bgcolor']) {
        const w = t.a[a];
        if (w && (FARBWERT.test(w) || FARBNAMEN.has(w.trim().toLowerCase()))) vonHand.push(`${rel(seite)}:${zeileBei(html, t.pos)}: Farbe von Hand (Attribut ${a}="${w}")`);
      }
    }
    if (tokens && ![...(geladen.get(seite) ?? [])].some((f) => resolve(f) === resolve(TOKENS)))
      melde('farbfaecher', 'rot', `${rel(seite)} bindet design/tokens.css nicht ein: <link rel="stylesheet" href="${relative(dirname(seite), TOKENS).split(sep).join('/')}">`);
  }
  for (const f of [...cssDateien].filter((x) => resolve(x) !== resolve(TOKENS)).sort()) pruefeCss(lies(f), f);
  for (const x of vonHand) melde('farbfaecher', 'rot', x);
  const fehlt = [...benutzt].filter(([n]) => !definiert.has(n) && !eigene.has(n));
  for (const [n, wo] of fehlt) melde('farbfaecher', 'rot', `${wo}: var(${n}) gibt es nicht in design/tokens.css`);
  const anzahl = seiten.length + [...cssDateien].filter((x) => resolve(x) !== resolve(TOKENS)).length;
  if (!vonHand.length && !fehlt.length && seiten.length) melde('farbfaecher', 'grün', `Farben, Schriften und Grössen nur als var(--…), in ${anzahl} Dateien`);
}

// ---------- Kontraste in tokens.css nachrechnen (Formel wie im Skill barrierefreiheit) ----------
// Ein Kommentar in derselben Zeile wie die Farbe: «/* 6,5 : 1 auf --farbe-grund */». Werte in @media (prefers-color-scheme: dark)
// und in Blöcken mit «dunkel» oder «dark» im Namen gelten für die dunkle Fassung.
const farbe = (roh) => {
  const v = (roh ?? '').trim().toLowerCase();
  let m = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(v);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((x) => x + x).join('');
    return h.length === 8 && h.slice(6) !== 'ff' ? null : [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  const deckend = (a) => !a || parseFloat(a) >= (a.endsWith('%') ? 100 : 1);
  m = /^rgba?\(\s*([\d.]+%?)[\s,]+([\d.]+%?)[\s,]+([\d.]+%?)\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/.exec(v);
  if (m) return deckend(m[4]) ? m.slice(1, 4).map((x) => (x.endsWith('%') ? parseFloat(x) * 2.55 : parseFloat(x))) : null;
  m = /^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/.exec(v);
  if (m && deckend(m[4])) {
    const [h, s, l] = [parseFloat(m[1]), parseFloat(m[2]) / 100, parseFloat(m[3]) / 100];
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    return [0, 8, 4].map((n) => 255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));
  }
  return { white: [255, 255, 255], black: [0, 0, 0] }[v] ?? null;
};
const leuchtdichte = (rgb) => {
  const [r, g, b] = rgb.map((c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const kontrast = (a, b) => { const [x, y] = [leuchtdichte(a), leuchtdichte(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const zahl = (x) => (Math.floor(x * 10) / 10).toFixed(1).replace('.', ',');
const DUNKEL = /prefers-color-scheme\s*:\s*dark|dunkel|\bdark\b/i;

if (B.farbfaecher && tokens) {
  const ohne = ohneCssKommentare(tokens);
  const decl = [];
  const stapel = [false];
  let kopf = '', kopfAb = 0;
  for (let i = 0; i <= ohne.length; i++) {
    const z = ohne[i] ?? ';';
    if (z !== '{' && z !== '}' && z !== ';') { kopf += z; continue; }
    const m = /^\s*(--[\w-]+)\s*:\s*([\s\S]*?)\s*$/.exec(kopf);
    if (z !== '{' && m) decl.push({ name: m[1], wert: m[2], dunkel: stapel.at(-1), zeile: zeileBei(ohne, kopfAb + kopf.search(/\S/)) });
    if (z === '{') stapel.push(stapel.at(-1) || DUNKEL.test(kopf));
    if (z === '}' && stapel.length > 1) stapel.pop();
    kopf = '';
    kopfAb = i + 1;
  }
  const hell = new Map(decl.filter((d) => !d.dunkel).map((d) => [d.name, d.wert]));
  const dunkel = new Map(decl.filter((d) => d.dunkel).map((d) => [d.name, d.wert]));
  const wert = (name, imDunkeln, tiefe = 0) => {
    const roh = (imDunkeln ? dunkel.get(name) : undefined) ?? hell.get(name);
    if (roh === undefined || tiefe > 10) return null;
    const v = /^var\(\s*(--[\w-]+)\s*(?:,[\s\S]*)?\)$/.exec(roh.trim());
    return v ? wert(v[1], imDunkeln, tiefe + 1) : roh;
  };
  let nachgerechnet = 0, stimmt = 0;
  for (const k of tokens.matchAll(/\/\*([\s\S]*?)\*\//g)) {
    const zeile = zeileBei(tokens, k.index);
    // Nur Kommentare hinter einer Farbe zählen; ein allgemeiner Satz wie «Text mindestens 4,5 : 1» ist keine Behauptung
    const d = decl.filter((x) => x.zeile === zeile).at(-1);
    if (!d || !/\d+(?:[.,]\d+)?\s*:\s*1\b/.test(k[1])) continue;
    const behauptet = [...k[1].matchAll(/(\d+(?:[.,]\d+)?)\s*:\s*1\b[^-\d]{0,24}?(--[\w-]+)/g)];
    if (!behauptet.length) {
      melde('farbfaecher', 'gelb', `design/tokens.css:${zeile}: Kontrast von ${d.name} ohne Gegenfarbe: schreib «… : 1 auf --name», dann lässt er sich nachrechnen`);
      continue;
    }
    for (const [, zahlText, gegen] of behauptet) {
      const soll = parseFloat(zahlText.replace(',', '.'));
      const [vorne, hinten] = [farbe(wert(d.name, d.dunkel)), farbe(wert(gegen, d.dunkel))];
      const was = `${d.name} auf ${gegen}${d.dunkel ? ' (dunkel)' : ''}`;
      nachgerechnet++;
      if (!vorne || !hinten) { melde('farbfaecher', 'gelb', `design/tokens.css:${zeile}: ${was} lässt sich nicht nachrechnen: Farben als #hex ohne Durchsichtigkeit schreiben`); continue; }
      const ist = kontrast(vorne, hinten);
      const grenze = soll >= 4.5 ? 4.5 : soll >= 3 ? 3 : 0;
      if (ist < grenze) melde('farbfaecher', 'rot', `design/tokens.css:${zeile}: ${was}: behauptet ${zahl(soll)} : 1, nachgerechnet ${zahl(ist)} : 1. Das reicht nicht für ${grenze === 4.5 ? 'Text (mindestens 4,5 : 1)' : 'Knöpfe, Ränder und grosse Titel (mindestens 3 : 1)'}`);
      else if (Math.abs(ist - soll) > 0.2) melde('farbfaecher', 'gelb', `design/tokens.css:${zeile}: ${was}: behauptet ${zahl(soll)} : 1, nachgerechnet ${zahl(ist)} : 1. Kommentar korrigieren`);
      else stimmt++;
    }
  }
  if (!nachgerechnet) melde('farbfaecher', 'gelb', 'Keine Kontraste als Kommentar in design/tokens.css, zum Beispiel «--farbe-text: #1d1b18; /* 16,2 : 1 auf --farbe-grund */»');
  else if (stimmt) melde('farbfaecher', 'grün', `${stimmt} von ${nachgerechnet} Kontrasten in design/tokens.css nachgerechnet und richtig`);
}

// ---------- Menü, Handy und Notizen ----------
if (B.menue) {
  if (!SEITEN.length) melde('menue', 'rot', 'design/entwurf/ fehlt oder hat keine Seiten (.html)');
  const menue = (f) => {
    const nav = /<nav\b[^>]*>([\s\S]*?)<\/nav\s*>/i.exec(ohneKommentare(lies(f)));
    if (!nav) return null;
    return [...new Set(tags(nav[1]).filter((t) => t.name === 'a' && t.a.href).map((t) => (aussen(t.a.href) || t.a.href.startsWith('#') ? t.a.href
      : relative(ENTWURF, ort({ datei: f, ziel: t.a.href })).split(sep).join('/'))))].sort();
  };
  const start = SEITEN.find((f) => resolve(f) === resolve(ENTWURF, 'index.html')) ?? SEITEN[0];
  const soll = start ? menue(start) : null;
  let gleich = 0;
  for (const f of SEITEN) {
    const html = lies(f);
    if (!/<meta\b[^>]*name\s*=\s*["']?viewport/i.test(html)) melde('menue', 'gelb', `${rel(f)}: <meta name="viewport" content="width=device-width, initial-scale=1"> fehlt, auf dem Handy wirkt die Seite sonst winzig`);
    const ist = menue(f);
    if (!ist) melde('menue', 'gelb', `${rel(f)}: kein Menü (<nav>); jede Seite hat Kopf, Menü und Fuss`);
    else if (soll && ist.join('\n') !== soll.join('\n')) {
      const fehlt = soll.filter((x) => !ist.includes(x));
      const mehr = ist.filter((x) => !soll.includes(x));
      melde('menue', 'gelb', `${rel(f)}: anderes Menü als ${rel(start)}${fehlt.length ? `, es fehlt ${fehlt.join(', ')}` : ''}${mehr.length ? `, zusätzlich ${mehr.join(', ')}` : ''}`);
    } else gleich++;
  }
  if (SEITEN.length && gleich === SEITEN.length) melde('menue', 'grün', `Dasselbe Menü auf allen ${SEITEN.length} Seiten`);
  const platzhalter = SEITEN.map((f) => [rel(f).replace(/^design\/entwurf\//, ''), (ohneKommentare(lies(f)).match(/\[(?:platzhalter|à compléter|a completer|da completare|placeholder)\b[^\]]*\]/gi) ?? []).length]).filter(([, n]) => n);
  const summe = platzhalter.reduce((s, [, n]) => s + n, 0);
  if (SEITEN.length) melde('menue', 'hinweis', summe ? `[Platzhalter] noch ${summe}× (${platzhalter.map(([f, n]) => `${f} ${n}`).join(', ')}): in docs/entwurf.md bei «Seiten:» nennen` : 'Keine [Platzhalter] mehr');
  if (!existsSync(NOTIZEN)) melde('menue', 'gelb', 'docs/entwurf.md fehlt (Zeilen Werkstatt:, Seiten:, Rückmeldungen:)');
  else {
    const notizen = lies(NOTIZEN);
    for (const z of ['Werkstatt:', 'Seiten:', 'Rückmeldungen:']) if (!new RegExp(`^${z}`, 'm').test(notizen)) melde('menue', 'gelb', `docs/entwurf.md: Zeile «${z}» fehlt`);
    const frei = /^Freigegeben zum Bauen:\s*(.*)$/m.exec(notizen);
    melde('menue', 'hinweis', frei ? `Freigegeben zum Bauen: ${frei[1].trim()}` : 'Noch nicht zum Bauen freigegeben (P8, Abschnitt «Freigabe» im Skill entwurf)');
  }
}

console.log(`Entwurf prüfen in ${WURZEL}: ${SEITEN.length} Seiten in design/entwurf/`);
for (const [k, b] of Object.entries(B)) {
  console.log(`\n${b.ampel === 'grün' ? '🟢' : b.ampel === 'gelb' ? '🟡' : '🔴'} ${NAMEN[k]}: ${b.ampel}`);
  const zeigen = b.punkte.filter((p) => p.ampel !== 'grün' || k === 'seiten' || b.ampel === 'grün');
  for (const p of zeigen.slice(0, 40)) console.log(`   ${p.ampel.padEnd(7)} ${p.text}`);
  if (zeigen.length > 40) console.log(`   … und ${zeigen.length - 40} weitere`);
}
const rot = Object.values(B).some((b) => b.ampel === 'rot');
const gelb = Object.values(B).some((b) => b.ampel === 'gelb');
console.log(rot ? '\nErgebnis: rot. Behebe die roten Punkte und prüf nochmals.' : gelb ? '\nErgebnis: gelb. Nichts ist rot; jeden gelben Punkt beheben oder mit Grund in docs/entwurf.md stehen lassen.' : '\nErgebnis: grün.');
process.exit(rot ? 1 : 0);
