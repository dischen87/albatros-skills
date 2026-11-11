#!/usr/bin/env node
// Prüft, was sich am Design ohne Modell prüfen lässt (Skills gestaltung, entwurf und webseite-bauen; Kriterien vom 10.11.2026):
// einzigartig statt Baukasten, Bewegung mit Absicht, 3D nur mit Rückfall, Grenzen für das Gewicht. Ohne Abhängigkeiten (Node 18+),
// liest nur, lädt nichts. Was ein Skript nicht sehen kann (ob es eigen wirkt, ob eine Bewegung etwas erklärt, ob 3D dem Inhalt dient),
// prüft die KI selbst und mit einer zweiten Meinung in frischem Kontext (Skill gestaltung, Abschnitt «Selbstprüfung und zweite Meinung»).
//   node design-pruefen.mjs [projektordner]   design/: die Richtungen (design/richtungen/), sobald es ihn gibt der Entwurf (design/entwurf/)
//   --bau [ordner]                            die gebaute Seite statt des Entwurfs (Standard seite/, sonst dist/)
//   --nur schrift,farbe,texte,kopf,richtungen,bewegung,dreid,gewicht
//   --json                                    das Ergebnis als JSON
// schrift     Eigene Schriftwahl: Die Titelschrift ist keine Standardschrift (Inter, Roboto, Arial …), höchstens zwei eigene Familien,
//             keine Schrift von fremden Servern; Typo-Skala mit mindestens vier Grössen in design/tokens.css.
// farbe       Eigene Farbwelt: keine Farbe aus dem Baukasten (Standardwerte von Tailwind und Bootstrap), kein Standard-Verlauf in Lila
//             und Blau, andere Verläufe und Glaseffekte nur mit Grund in docs/designsystem.md.
// texte       Keine Lorem-Texte, keine Emoji als Icons, keine Bilder von Platzhalter-Diensten, ein Icon-Satz; Floskeln gelb.
// kopf        Der Kopf der Startseite ist kein austauschbarer: zentrierte Zeile mit einem oder zwei Knöpfen, ohne Bild und ohne Inhalt.
// richtungen  Mindestens zwei Richtungen in design/richtungen/, klar verschieden (Schrift, Farben, Formen), nicht nur andere Farben.
// bewegung    Wer bewegt, beachtet prefers-reduced-motion (CSS und Skript); nichts läuft endlos; die Absicht steht in docs/designsystem.md.
// dreid       3D nur mit Standbild als Rückfall (<img data-3d-standbild>), erst bei Sichtbarkeit geladen, nicht bei «weniger Bewegung»,
//             Modell höchstens 2 MB; die Seite steht ohne WebGL und ohne Skript.
// gewicht     Je Seite höchstens 1 MB (gelb) und 2 MB (rot) mit allem, was sie fest einbindet; Bilder unter 500 KB; fest eingebundenes
//             JavaScript höchstens 50 KB je Seite.
// Ende mit 1, wenn ein Bereich rot ist, mit 2, wenn nichts zu prüfen da ist, sonst mit 0.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const BEREICHE = ['schrift', 'farbe', 'texte', 'kopf', 'richtungen', 'bewegung', 'dreid', 'gewicht'];
const nurBei = args.indexOf('--nur');
const bauBei = args.indexOf('--bau');
const BAU = bauBei >= 0;
const bauOrdner = BAU && args[bauBei + 1] && !args[bauBei + 1].startsWith('--') ? args[bauBei + 1] : null;
const JSON_AUS = args.includes('--json');
const NUR = new Set(nurBei >= 0 ? (args[nurBei + 1] ?? '').split(',').filter(Boolean) : BEREICHE);
const unbekannt = [...NUR].filter((b) => !BEREICHE.includes(b));
if (!NUR.size || unbekannt.length) {
  console.error(`--nur kennt ${BEREICHE.join(', ')}${unbekannt.length ? `, nicht ${unbekannt.join(', ')}` : ''}`);
  process.exit(2);
}
const WURZEL = resolve(args.find((a, i) => !a.startsWith('--') && !(nurBei >= 0 && i === nurBei + 1) && !(bauOrdner && i === bauBei + 1)) ?? '.');
const DESIGN = join(WURZEL, 'design');
const TOKENS = join(DESIGN, 'tokens.css');
const ENTWURF = join(DESIGN, 'entwurf');
const RICHTUNGEN = join(DESIGN, 'richtungen');
const GEBAUT = BAU ? (bauOrdner ? resolve(WURZEL, bauOrdner) : [join(WURZEL, 'seite'), join(WURZEL, 'dist')].find((d) => existsSync(d)) ?? join(WURZEL, 'seite')) : null;

const STUFE = { hinweis: -1, grün: 0, gelb: 1, rot: 2 };
const NAMEN = { schrift: 'Eigene Schrift und Typo-Skala', farbe: 'Eigene Farbwelt, kein Standard-Verlauf', texte: 'Echte Texte, keine Emoji als Icons',
  kopf: 'Kopf der Startseite', richtungen: 'Mindestens zwei klar verschiedene Richtungen', bewegung: 'Bewegung mit Absicht', dreid: '3D nur mit Rückfall', gewicht: 'Gewicht' };
const B = Object.fromEntries(BEREICHE.filter((b) => NUR.has(b) && !(BAU && b === 'richtungen')).map((b) => [b, { ampel: 'grün', punkte: [] }]));
const melde = (b, ampel, text) => {
  if (!B[b]) return;
  B[b].punkte.push({ ampel, text });
  if (STUFE[ampel] > STUFE[B[b].ampel]) B[b].ampel = ampel;
};

const lies = (f) => readFileSync(f, 'utf8');
const rel = (f) => relative(WURZEL, f).split(sep).join('/') || '.';
const alle = (d) => (existsSync(d) && statSync(d).isDirectory() ? readdirSync(d, { withFileTypes: true }) : [])
  .flatMap((e) => (e.name.startsWith('.') || e.name === 'node_modules' ? [] : e.isDirectory() ? alle(join(d, e.name)) : [join(d, e.name)]));
const leer = (m) => m.replace(/[^\n]/g, ' ');
const ohneKommentare = (h) => h.replace(/<!--[\s\S]*?-->/g, leer);
const ohneCssKommentare = (c) => c.replace(/\/\*[\s\S]*?\*\//g, leer);
const stile = (h) => [...ohneKommentare(h).matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map((m) => m[1]).join('\n');
const skripte = (h) => [...ohneKommentare(h).matchAll(/<script\b(?![^>]*\bsrc\s*=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script\s*>/gi)].map((m) => m[1]).join('\n');
const sichtbarerText = (h) => ohneKommentare(h).replace(/<(script|style|template)\b[\s\S]*?<\/\1\s*>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const zeile = (text, anfang) => text.split(/\r?\n/).find((z) => z.startsWith(anfang))?.slice(anfang.length).trim() ?? '';

// ---------- Was geprüft wird ----------
// Entwurf: design/entwurf/, solange es ihn nicht gibt die Richtungen; mit --bau die gebaute Seite. tokens.css gilt immer.
const ordner = BAU ? GEBAUT : existsSync(ENTWURF) ? ENTWURF : RICHTUNGEN;
const richtungen = alle(RICHTUNGEN).filter((f) => /\.html?$/i.test(f)).sort();
const seiten = alle(ordner).filter((f) => /\.html?$/i.test(f)).sort();
if (!seiten.length && !richtungen.length && !existsSync(TOKENS)) {
  console.error(BAU ? `${rel(ordner)}/ hat keine Seiten: zuerst bauen (Skill webseite-bauen).` : 'Weder design/tokens.css noch design/richtungen/ noch design/entwurf/: zuerst gestalten (Skill gestaltung).');
  process.exit(2);
}
const tokens = existsSync(TOKENS) ? ohneCssKommentare(lies(TOKENS)) : '';
const cssDateien = [...(BAU ? [] : [join(DESIGN, 'komponenten.css')].filter((f) => existsSync(f))), ...alle(ordner).filter((f) => /\.css$/i.test(f))];
const jsDateien = alle(ordner).filter((f) => /\.(m?js)$/i.test(f));
const html = new Map(seiten.map((f) => [f, lies(f)]));
const css = [tokens, ...cssDateien.map((f) => ohneCssKommentare(lies(f))), ...[...html.values()].map((h) => ohneCssKommentare(stile(h)))].join('\n');
const js = [...jsDateien.map((f) => lies(f)), ...[...html.values()].map(skripte)].join('\n');
const designsystem = existsSync(join(WURZEL, 'docs', 'designsystem.md')) ? lies(join(WURZEL, 'docs', 'designsystem.md')) : '';
const mussBleiben = existsSync(join(WURZEL, 'docs', 'konzept.md')) ? zeile(lies(join(WURZEL, 'docs', 'konzept.md')), 'Muss bleiben:').toLowerCase() : '';
const vorgegeben = (wort) => !!wort && mussBleiben.includes(wort.toLowerCase());
const start = seiten.find((f) => resolve(f) === resolve(ordner, 'index.html'));

// ---------- Schrift ----------
const STANDARDSCHRIFT = new Set(['inter', 'roboto', 'arial', 'helvetica', 'helvetica neue', 'open sans', 'montserrat', 'poppins', 'lato', 'segoe ui', 'geist', 'sf pro',
  'sf pro display', 'sf pro text', 'system-ui', '-apple-system', 'blinkmacsystemfont', 'ui-sans-serif', 'ui-serif', 'sans-serif', 'serif']);
const FREMDE_SCHRIFT = /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net|fonts\.bunny\.net|fonts\.cdnfonts\.com|use\.fontawesome\.com/i;
const SCHRIFT_NAME = /schrift|font|famil|police|caratter/i;
const KEINE_FAMILIE = /size|groesse|grösse|weight|gewicht|zeile|line|sperrung|spacing|stil|style|variant|feature|display/i;
const TITEL_NAME = /titel|title|titre|titolo|heading|headline|ueberschrift|überschrift/i;
const schriften = (text) => [...text.matchAll(/(--[\w-]+|font-family)\s*:\s*([^;{}]+)/gi)]
  .filter(([, name, wert]) => (name.toLowerCase() === 'font-family' || (SCHRIFT_NAME.test(name) && !KEINE_FAMILIE.test(name))) && /[a-z]/i.test(wert) && !/^\s*var\(/.test(wert) && !/^\s*(inherit|initial|unset)\s*$/i.test(wert))
  .map(([, name, wert]) => { const erste = wert.split(',')[0].trim().replace(/^["']|["']$/g, ''); return { name, erste, standard: STANDARDSCHRIFT.has(erste.toLowerCase()), titel: TITEL_NAME.test(name) }; });
const schriftPruefen = (wo, text) => {
  const fam = schriften(text);
  if (!fam.length) { melde('schrift', 'rot', `${wo}: keine Schrift festgelegt (Titelschrift mit Charakter und ruhige Textschrift, Skill gestaltung)`); return; }
  const titel = fam.filter((f) => f.titel);
  const schlecht = (titel.length ? titel.filter((f) => f.standard) : fam.every((f) => f.standard) ? fam : []).filter((f) => !vorgegeben(f.erste));
  const eigene = [...new Set(fam.filter((f) => !f.standard).map((f) => f.erste.toLowerCase()))];
  if (schlecht.length) melde('schrift', 'rot', `${wo}: ${titel.length ? 'Die Titelschrift ist' : 'Alle Schriften sind'} Standard (${[...new Set(schlecht.map((f) => f.erste))].join(', ')}): Wähl eine Titelschrift mit Charakter, die zu den drei Wörtern in docs/konzept.md passt`);
  else if (eigene.length > 2) melde('schrift', 'gelb', `${wo}: ${eigene.length} eigene Schriftfamilien (${eigene.join(', ')}), höchstens zwei`);
  else melde('schrift', 'grün', `${wo}: ${[...new Set(fam.map((f) => f.erste))].join(', ')}`);
};
if (B.schrift) {
  if (tokens) {
    schriftPruefen('design/tokens.css', tokens);
    const groessen = new Set([...tokens.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+)/g)].filter(([, n]) => /gr(oe|ö)sse|size|taille|grandezza|dimension/i.test(n) && !/zeile|line/i.test(n)).map(([, , w]) => w.trim()));
    if (groessen.size < 4) melde('schrift', 'gelb', `design/tokens.css: Die Typo-Skala hat ${groessen.size} ${groessen.size === 1 ? 'Grösse' : 'Grössen'} (--groesse-…), mindestens vier: klein, Text, Zwischentitel, Titel`);
    else melde('schrift', 'grün', `Typo-Skala mit ${groessen.size} Grössen`);
  } else for (const f of richtungen) schriftPruefen(rel(f), ohneCssKommentare(stile(lies(f))));
  const fremd = [...[...html].map(([f, h]) => [f, h]), ...cssDateien.map((f) => [f, lies(f)]), ...(BAU || existsSync(ENTWURF) ? [] : richtungen.map((f) => [f, lies(f)]))].filter(([, t]) => FREMDE_SCHRIFT.test(t)).map(([f]) => rel(f));
  if (fremd.length) melde('schrift', 'rot', `Schrift von einem fremden Server (${[...new Set(fremd)].slice(0, 4).join(', ')}): Schriften selbst hosten (woff2), sonst erfährt ein Dritter von jedem Besuch`);
}

// ---------- Farbe ----------
const BAUKASTEN = { '#6366f1': 'Tailwind indigo-500', '#4f46e5': 'Tailwind indigo-600', '#8b5cf6': 'Tailwind violet-500', '#7c3aed': 'Tailwind violet-600', '#a855f7': 'Tailwind purple-500',
  '#9333ea': 'Tailwind purple-600', '#3b82f6': 'Tailwind blue-500', '#2563eb': 'Tailwind blue-600', '#0ea5e9': 'Tailwind sky-500', '#10b981': 'Tailwind emerald-500',
  '#ec4899': 'Tailwind pink-500', '#0d6efd': 'Bootstrap primary', '#007bff': 'Bootstrap primary (4)', '#667eea': 'Verlauf aus dem Baukasten', '#764ba2': 'Verlauf aus dem Baukasten' };
const LILA_NAMEN = new Set(['purple', 'violet', 'indigo', 'blueviolet', 'mediumpurple', 'rebeccapurple', 'fuchsia', 'magenta', 'darkviolet', 'darkorchid', 'mediumorchid', 'orchid', 'blue', 'royalblue', 'mediumslateblue', 'slateblue', 'hotpink', 'deeppink']);
const hex6 = (h) => { const x = h.replace('#', '').toLowerCase(); return `#${(x.length <= 4 ? [...x].map((c) => c + c).join('') : x).slice(0, 6)}`; };
const hsl = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [max, min] = [Math.max(r, g, b), Math.min(r, g, b)];
  const l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const h = (max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60;
  return { h, s: d / (1 - Math.abs(2 * l - 1)), l };
};
const tokenWerte = new Map([...tokens.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+)/g)].map(([, n, w]) => [n, w.trim()]));
const aufloesen = (w, tiefe = 0) => w.replace(/var\(\s*(--[\w-]+)\s*(?:,[^()]*)?\)/g, (m, n) => (tiefe < 6 && tokenWerte.has(n) ? aufloesen(tokenWerte.get(n), tiefe + 1) : m));
const lilaBlau = (c) => c.s >= 0.35 && c.l >= 0.25 && c.l <= 0.85 && c.h >= 215 && c.h <= 335;
const verlaeufe = (text) => {
  const aus = [];
  for (const m of text.matchAll(/(?:repeating-)?(?:linear|radial|conic)-gradient\(/g)) {
    let tiefe = 1, i = m.index + m[0].length;
    for (; i < text.length && tiefe; i++) tiefe += text[i] === '(' ? 1 : text[i] === ')' ? -1 : 0;
    aus.push(aufloesen(text.slice(m.index, i)));
  }
  return aus;
};
if (B.farbe) {
  const quelle = tokens || richtungen.map((f) => ohneCssKommentare(stile(lies(f)))).join('\n');
  const baukasten = [...new Set([...quelle.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => hex6(m[0])))].filter((h) => BAUKASTEN[h] && !vorgegeben(h));
  if (baukasten.length) melde('farbe', 'rot', `Farbe aus dem Baukasten: ${baukasten.map((h) => `${h} (${BAUKASTEN[h]})`).join(', ')}. Die Farbwelt kommt aus der Marke: Logo, Ort, Material (docs/konzept.md)`);
  let standard = 0, andere = 0;
  for (const v of verlaeufe(css)) {
    const farben = [...v.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => hsl(hex6(m[0])));
    const namen = (v.toLowerCase().match(/[a-z]+/g) ?? []).filter((w) => LILA_NAMEN.has(w)).length;
    const n = farben.filter(lilaBlau).length + namen;
    if (n >= 2 || farben.some((c) => lilaBlau(c) && c.h >= 245 && c.h <= 300) || namen) standard++; else andere++;
  }
  if (standard) melde('farbe', 'rot', `${standard} Standard-Verlauf in Lila und Blau: das häufigste Zeichen einer Seite aus dem Baukasten. Nimm eine Fläche in einer Farbe der Marke`);
  if (andere && !/verlauf|dégradé|gradient|sfumatura/i.test(designsystem)) melde('farbe', 'gelb', `${andere} ${andere === 1 ? 'Verlauf' : 'Verläufe'} ohne Grund: in docs/designsystem.md sagen, wozu (Stichwort «Verlauf»), oder weglassen`);
  if (/backdrop-filter\s*:\s*(?!none)/i.test(css) && !/glas|verre|glass|vetro/i.test(designsystem)) melde('farbe', 'gelb', 'Glaseffekt (backdrop-filter) ohne Grund in docs/designsystem.md (Stichwort «Glas»)');
  if (!baukasten.length && !standard) melde('farbe', 'grün', 'Keine Farbe aus dem Baukasten, kein Standard-Verlauf');
}

// ---------- Texte, Zeichen, Bilder ----------
const LOREM = /lorem ipsum|dolor sit amet|consectetur adipisc/i;
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/gu;
const FLOSKELN = /willkommen auf unserer|entdecken sie|ihr partner für|mit leidenschaft|innovativ|nahtlos|bienvenue sur notre|votre partenaire|benvenuti sul nostro|il vostro partner|welcome to our website|your partner for|seamless|cutting-edge/gi;
const PLATZHALTERBILD = /picsum\.photos|placehold\.co|via\.placeholder\.com|placekitten\.com|placeimg\.com|dummyimage\.com|source\.unsplash\.com|loremflickr\.com/i;
const ICONSAETZE = { Lucide: /lucide/i, Phosphor: /phosphor/i, Heroicons: /heroicons/i, 'Font Awesome': /font-?awesome|\bfa-(solid|regular|brands)\b/i, 'Material Icons': /material-(icons|symbols)/i, Feather: /feather-icons|data-feather/i, 'Bootstrap Icons': /bootstrap-icons|\bbi-[a-z]/i, Tabler: /tabler-icons|\bti-[a-z]/i };
if (B.texte) {
  let sauber = true;
  for (const [f, h] of html) {
    const text = sichtbarerText(h);
    if (LOREM.test(text)) { sauber = false; melde('texte', 'rot', `${rel(f)}: Lorem-Text. Was fehlt, steht als [Platzhalter: was fehlt, wer liefert bis wann] da, nie als Fülltext`); }
    const emoji = [...new Set(text.match(EMOJI) ?? [])];
    if (emoji.length) { sauber = false; melde('texte', 'rot', `${rel(f)}: Emoji als Icon (${emoji.slice(0, 6).join(' ')}): ein einheitlicher Icon-Satz oder kein Icon`); }
    if (PLATZHALTERBILD.test(h)) { sauber = false; melde('texte', 'rot', `${rel(f)}: Bild von einem Platzhalter-Dienst: ein eigenes Foto aus der Fotoliste oder eine beschriftete graue Fläche`); }
    const floskeln = [...new Set((text.match(FLOSKELN) ?? []).map((x) => x.toLowerCase()))];
    if (floskeln.length) melde('texte', 'gelb', `${rel(f)}: Floskeln (${floskeln.join(', ')}): ein konkreter Satz mit Namen, Zahl oder Ort`);
  }
  const emojiCss = [...new Set([...css.matchAll(/content\s*:\s*(["'])(.*?)\1/g)].flatMap((m) => m[2].match(EMOJI) ?? []))];
  if (emojiCss.length) { sauber = false; melde('texte', 'rot', `Emoji als Icon im CSS (content: ${emojiCss.slice(0, 6).join(' ')})`); }
  const alles = [...html.values()].join('\n') + css + js;
  const saetze = Object.entries(ICONSAETZE).filter(([, m]) => m.test(alles)).map(([n]) => n);
  if (saetze.length > 1) melde('texte', 'gelb', `Mehrere Icon-Sätze gemischt (${saetze.join(', ')}): genau einer`);
  if (sauber && html.size) melde('texte', 'grün', `Keine Lorem-Texte, keine Emoji als Icons, keine Platzhalter-Bilder, auf ${html.size} ${html.size === 1 ? 'Seite' : 'Seiten'}`);
  if (!html.size) melde('texte', 'hinweis', 'Noch keine Seiten zum Prüfen');
}

// ---------- Kopf der Startseite ----------
// Austauschbar heisst: alles zugleich. Der Titel ist zentriert, darunter höchstens ein kurzer Satz und ein oder zwei Knöpfe, und im Kopf
// steht weder ein Bild noch Inhalt (Termin, Liste, Formular). So sieht der Kopf jeder Seite aus dem Baukasten aus.
const regeln = (text) => [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ auswahl: m[1].trim(), inhalt: m[2] }));
const kopfVon = (h) => {
  const t = ohneKommentare(h).replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, leer);
  const i = t.search(/<h1\b/i);
  if (i < 0) return null;
  const ab = Math.max(t.lastIndexOf('<main', i), t.lastIndexOf('<section', i), t.lastIndexOf('<body', i), 0);
  const nachH1 = i + 3;
  const enden = [/<h2\b/i, /<\/section\s*>/i, /<section\b/i, /<\/main\s*>/i, /<footer\b/i].map((r) => { const m = r.exec(t.slice(nachH1)); return m ? nachH1 + m.index : t.length; });
  return t.slice(ab, Math.min(...enden));
};
const kopfPruefen = (f, h) => {
  const kopf = kopfVon(h);
  if (!kopf) { melde('kopf', 'gelb', `${rel(f)}: keine Hauptüberschrift (<h1>)`); return; }
  const klassen = new Set([...kopf.matchAll(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].flatMap((m) => (m[1] ?? m[2]).split(/\s+/).filter(Boolean)));
  const trifft = (auswahl) => auswahl.split(',').some((a) => [...klassen].some((k) => new RegExp(`\\.${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\w-])`).test(a)) || /(^|[\s>+~])(body|main|section|header|h1)\s*$/i.test(a.trim()));
  const eigene = regeln(ohneCssKommentare(stile(h)) + css).filter((r) => trifft(r.auswahl));
  const zentriert = eigene.some((r) => /text-align\s*:\s*center/i.test(r.inhalt)) || /style\s*=\s*["'][^"']*text-align\s*:\s*center/i.test(kopf) || klassen.has('text-center') || /\balign\s*=\s*["']?center/i.test(kopf);
  const bild = /<(img|picture|video|canvas|model-viewer)\b/i.test(kopf) || /\bdata-3d/i.test(kopf) || [...kopf.matchAll(/<svg\b[^>]*\bwidth\s*=\s*["']?(\d+)/gi)].some((m) => Number(m[1]) >= 200)
    || eigene.some((r) => /background(-image)?\s*:[^;]*url\(/i.test(r.inhalt));
  const inhalt = /<(time|ul|ol|dl|table|form)\b/i.test(kopf);
  const knoepfe = (kopf.match(/<button\b/gi) ?? []).length + [...kopf.matchAll(/<a\b[^>]*\bclass\s*=\s*["'][^"']*\b(knopf|btn|button|cta|bouton|pulsante)\b/gi)].length;
  const text = sichtbarerText(kopf.replace(/<h1\b[\s\S]*?<\/h1\s*>/i, ' ').replace(/<(a|button)\b[\s\S]*?<\/\1\s*>/gi, ' ')).trim();
  if (zentriert && !bild && !inhalt && knoepfe >= 1 && knoepfe <= 2 && text.length <= 220)
    melde('kopf', 'rot', `${rel(f)}: austauschbarer Kopf (zentrierter Titel, ${knoepfe === 1 ? 'ein Knopf' : 'zwei Knöpfe'}, kein Bild, kein Inhalt). Bau ihn aus dem Inhalt: ein echtes Foto, oder das Wichtigste gross (der nächste Termin, das Angebot), nicht mittig auf einer Farbfläche`);
  else melde('kopf', 'grün', `${rel(f)}: Kopf mit ${bild ? 'Bild' : inhalt ? 'Inhalt' : zentriert ? 'zentriertem Titel und mehr als einer Zeile' : 'eigenem Aufbau'}`);
};
if (B.kopf) {
  const zuPruefen = start ? [start] : !BAU && !existsSync(ENTWURF) ? richtungen : [];
  for (const f of zuPruefen) kopfPruefen(f, html.get(f) ?? lies(f));
  if (!zuPruefen.length) melde('kopf', 'hinweis', 'Keine Startseite (index.html) zum Prüfen');
}

// ---------- Richtungen ----------
if (B.richtungen) {
  if (richtungen.length < 2) melde('richtungen', 'rot', `${richtungen.length} ${richtungen.length === 1 ? 'Richtung' : 'Richtungen'} in design/richtungen/: Die Person braucht mindestens zwei klar verschiedene zur Wahl (im Fahrplan drei)`);
  else {
    const bild = (f) => {
      const s = ohneCssKommentare(stile(lies(f)));
      return {
        Schrift: [...new Set(schriften(s).map((x) => x.erste.toLowerCase()))].sort().join(', '),
        Farben: [...new Set([...s.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((m) => hex6(m[0])))].sort().join(', '),
        Formen: [...new Set([...s.matchAll(/(?:border-radius|--[\w-]*(?:rund|radius|rayon|raggio)[\w-]*)\s*:\s*([^;{}]+)/gi)].map((m) => m[1].trim()))].sort().join(', '),
      };
    };
    const bilder = richtungen.map((f) => [f, bild(f)]);
    let klar = true;
    for (let a = 0; a < bilder.length; a++) for (let b = a + 1; b < bilder.length; b++) {
      const anders = Object.keys(bilder[a][1]).filter((k) => bilder[a][1][k] !== bilder[b][1][k]);
      const paar = `${rel(bilder[a][0]).replace('design/richtungen/', '')} und ${rel(bilder[b][0]).replace('design/richtungen/', '')}`;
      if (!anders.length) { klar = false; melde('richtungen', 'rot', `${paar}: gleiche Schrift, gleiche Farben, gleiche Formen. Das ist keine Wahl`); }
      else if (anders.length === 1) {
        klar = false;
        const fest = mussBleiben && !/^(nichts|keine?s?|rien|niente|nothing|none)\b/.test(mussBleiben);
        melde('richtungen', anders[0] === 'Farben' && !fest ? 'rot' : 'gelb', `${paar} unterscheiden sich nur in ${anders[0] === 'Farben' ? 'den Farben' : anders[0] === 'Schrift' ? 'der Schrift' : 'den Formen'}: Klar verschieden heisst andere Idee, Schrift, Rolle der Farbe und Formen`);
      }
    }
    if (klar) melde('richtungen', 'grün', `${richtungen.length} Richtungen, jede mit eigener Schrift, eigenen Farben oder eigenen Formen`);
  }
}

// ---------- Bewegung ----------
const WENIGER = /prefers-reduced-motion/i;
if (B.bewegung) {
  const cssBewegt = /@keyframes\b/i.test(css) || /(?<![\w-])animation(-name)?\s*:\s*(?!none\b)[^;{}]+/i.test(css) || /(?<![\w-])transition(-property)?\s*:\s*(?!none\b)[^;{}]+/i.test(css) || /scroll-behavior\s*:\s*smooth/i.test(css) || /animation-timeline\s*:/i.test(css);
  const jsBewegt = /requestAnimationFrame\s*\(|\.animate\s*\(|\bgsap\b|framer-motion|\blottie\b|\bAOS\.init|ScrollTrigger|\banime\s*\(/.test(js);
  const htmlBewegt = [...html].filter(([, h]) => /<marquee\b|<blink\b/i.test(h)).map(([f]) => rel(f));
  if (htmlBewegt.length) melde('bewegung', 'rot', `Lauftext (<marquee> oder <blink>) in ${htmlBewegt.join(', ')}: zappelt nur`);
  if (!cssBewegt && !jsBewegt && !htmlBewegt.length) melde('bewegung', 'hinweis', 'Keine Bewegung. Das ist in Ordnung: Bewegung kommt nur dazu, wo sie etwas erklärt oder führt');
  else {
    if (cssBewegt && !WENIGER.test(css)) melde('bewegung', 'rot', 'Bewegung im CSS ohne @media (prefers-reduced-motion: reduce): Wer «weniger Bewegung» eingestellt hat, sieht nur Überblenden oder nichts');
    if (jsBewegt && !WENIGER.test(js)) melde('bewegung', 'rot', 'Bewegung im Skript ohne matchMedia("(prefers-reduced-motion: reduce)"): Eine Regel im CSS hält ein Skript nicht an');
    const endlos = (css.match(/(?<![\w-])animation(-iteration-count)?\s*:[^;{}]*\binfinite\b/gi) ?? []).length;
    if (endlos) melde('bewegung', 'gelb', `${endlos} ${endlos === 1 ? 'Bewegung läuft' : 'Bewegungen laufen'} endlos (infinite): höchstens 5 Sekunden, dann still, oder ein Knopf zum Anhalten (WCAG 2.2.2)`);
    if (!/bewegung|mouvement|movimento|motion|animation/i.test(designsystem)) melde('bewegung', 'gelb', 'Die Absicht fehlt: In docs/designsystem.md steht für jede Bewegung, was sie erklärt oder wohin sie führt (Abschnitt «## Bewegung»)');
    if ((!cssBewegt || WENIGER.test(css)) && (!jsBewegt || WENIGER.test(js)) && !htmlBewegt.length) melde('bewegung', 'grün', 'Bewegung beachtet «weniger Bewegung» (prefers-reduced-motion)');
  }
}

// ---------- 3D ----------
const DREID_TAG = /<(canvas|model-viewer|spline-viewer)\b/i;
const DREID_JS = /getContext\s*\(\s*["'](webgl2?|webgpu|experimental-webgl)|\bTHREE\.|from\s+["']three["']|three(\.module)?(\.min)?\.js|\bBABYLON\.|@google\/model-viewer|WebGLRenderer|\.gl(b|tf)\b/;
if (B.dreid) {
  const mit = [...html].filter(([, h]) => DREID_TAG.test(ohneKommentare(h)) || /\bdata-3d\b/i.test(h) || DREID_JS.test(skripte(h)));
  const modelle = alle(ordner).filter((f) => /\.(glb|gltf|usdz|hdr|ktx2)$/i.test(f));
  if (!mit.length && !DREID_JS.test(js) && !modelle.length) melde('dreid', 'hinweis', 'Kein 3D. Das ist in Ordnung: 3D kommt nur dazu, wo es dem Inhalt dient (ein Produkt zum Drehen, eine räumliche Erklärung)');
  else {
    let gut = true;
    for (const [f, h] of mit) {
      const t = ohneKommentare(h);
      const standbild = /<img\b[^>]*\bdata-3d-standbild\b/i.test(t) || /<model-viewer\b[^>]*\bposter\s*=/i.test(t);
      if (!standbild) { gut = false; melde('dreid', 'rot', `${rel(f)}: 3D ohne Standbild. Zuerst steht ein Bild (<img data-3d-standbild …>), das 3D kommt nur dazu, wenn der Computer es kann; sonst bleibt das Bild`); }
      if (/<canvas\b/i.test(t)) { gut = false; melde('dreid', 'gelb', `${rel(f)}: <canvas> steht fest in der Seite. Ohne WebGL oder ohne Skript bleibt dort ein Loch: Das Skript legt die Fläche erst an, wenn 3D läuft`); }
      if (/<model-viewer\b(?![^>]*\bloading\s*=\s*["']?lazy)/i.test(t)) { gut = false; melde('dreid', 'gelb', `${rel(f)}: <model-viewer> ohne loading="lazy": Das Modell lädt sofort statt erst, wenn es sichtbar ist`); }
    }
    if (DREID_JS.test(js)) {
      if (!WENIGER.test(js)) { gut = false; melde('dreid', 'rot', '3D-Skript ohne matchMedia("(prefers-reduced-motion: reduce)"): Bei «weniger Bewegung» bleibt das Standbild'); }
      if (!/IntersectionObserver/.test(js)) { gut = false; melde('dreid', 'gelb', '3D-Skript ohne IntersectionObserver: 3D lädt erst, wenn die Stelle sichtbar ist'); }
      if (!/min-width/.test(js)) { gut = false; melde('dreid', 'gelb', '3D-Skript ohne Grenze für die Breite (matchMedia("(min-width: 768px)")): Auf dem Handy bleibt das Standbild'); }
    }
    for (const f of modelle) {
      const mb = statSync(f).size / 1e6;
      if (mb > 1) { gut = false; melde('dreid', mb > 2 ? 'rot' : 'gelb', `${rel(f)}: ${mb.toFixed(1).replace('.', ',')} MB (Ladegrenze für ein 3D-Modell: 2 MB, besser unter 1 MB)`); }
    }
    if (!/\b3d\b/i.test(designsystem)) { gut = false; melde('dreid', 'gelb', 'In docs/designsystem.md fehlt, wozu das 3D dient (Zeile «3D:» unter «## Gestaltungselemente»)'); }
    if (gut) melde('dreid', 'grün', '3D mit Standbild als Rückfall, erst bei Sichtbarkeit, nicht bei «weniger Bewegung»');
  }
}

// ---------- Gewicht ----------
if (B.gewicht) {
  const kb = (n) => `${Math.round(n / 1024)} KB`;
  const groesse = (f) => (existsSync(f) && statSync(f).isFile() ? statSync(f).size : 0);
  const lokal = (z) => z && !/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(z);
  const ziel = (von, z) => (z.startsWith('/') ? join(ordner, z) : resolve(dirname(von), z)).split(/[?#]/)[0];
  let schwer = false;
  for (const f of alle(ordner).filter((x) => /\.(png|jpe?g|webp|avif|gif)$/i.test(x))) {
    const s = groesse(f);
    if (s > 500e3) { schwer = true; melde('gewicht', s > 1.5e6 ? 'rot' : 'gelb', `Bild zu gross: ${rel(f)} (${kb(s)}, Ziel unter 500 KB)`); }
  }
  for (const [f, h] of html) {
    const t = ohneKommentare(h);
    const teile = new Set();
    let jsFest = Buffer.byteLength(skripte(h));
    for (const m of t.matchAll(/<(link|script|img|source|video|audio)\b[^>]*?\b(?:href|src|poster)\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi)) {
      const z = m[2] ?? m[3];
      if (!lokal(z) || (m[1].toLowerCase() === 'link' && !/rel\s*=\s*["']?(stylesheet|preload|modulepreload|icon)/i.test(m[0]))) continue;
      const d = ziel(f, z);
      if (teile.has(d)) continue;
      teile.add(d);
      if (m[1].toLowerCase() === 'script') jsFest += groesse(d);
      if (/\.css$/i.test(d) && existsSync(d)) for (const u of ohneCssKommentare(lies(d)).matchAll(/url\(\s*(["']?)([^"')]+)\1\s*\)/g)) if (lokal(u[2])) teile.add(ziel(d, u[2]));
    }
    const summe = Buffer.byteLength(h) + [...teile].reduce((s, d) => s + groesse(d), 0);
    if (summe > 1e6) { schwer = true; melde('gewicht', summe > 2e6 ? 'rot' : 'gelb', `${rel(f)}: ${kb(summe)} mit allem, was die Seite fest einbindet (Ziel unter 1 MB, Grenze 2 MB)`); }
    if (jsFest > 50e3) { schwer = true; melde('gewicht', BAU ? 'rot' : 'gelb', `${rel(f)}: ${kb(jsFest)} fest eingebundenes JavaScript (Budget 50 KB je Seite; 3D und anderes Schweres lädt erst bei Bedarf nach)`); }
  }
  if (!schwer && html.size) melde('gewicht', 'grün', `Jede der ${html.size} Seiten unter 1 MB, kein Bild über 500 KB, JavaScript im Budget`);
}

// ---------- Ergebnis ----------
const rot = Object.values(B).some((b) => b.ampel === 'rot');
const gelb = Object.values(B).some((b) => b.ampel === 'gelb');
if (JSON_AUS) console.log(JSON.stringify({ ordner: rel(ordner), bereiche: B, ergebnis: rot ? 'rot' : gelb ? 'gelb' : 'grün' }, null, 1));
else {
  console.log(`Design prüfen in ${WURZEL}: ${seiten.length} ${seiten.length === 1 ? 'Seite' : 'Seiten'} in ${rel(ordner)}/, ${richtungen.length} Richtungen`);
  for (const [k, b] of Object.entries(B)) {
    console.log(`\n${b.ampel === 'grün' ? '🟢' : b.ampel === 'gelb' ? '🟡' : '🔴'} ${NAMEN[k]}: ${b.ampel}`);
    for (const p of b.punkte) console.log(`   ${p.ampel.padEnd(7)} ${p.text}`);
  }
  console.log(rot ? '\nErgebnis: rot. Behebe die roten Punkte und prüf nochmals.' : gelb ? '\nErgebnis: gelb. Nichts ist rot; jeden gelben Punkt beheben oder mit Grund in docs/designsystem.md stehen lassen.' : '\nErgebnis: grün.');
  console.log('Nicht geprüft (das siehst nur du und eine zweite Meinung): ob es eigen wirkt, ob jede Bewegung etwas erklärt, ob das 3D dem Inhalt dient.');
}
process.exit(rot ? 1 : 0);
