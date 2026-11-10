#!/usr/bin/env node
// Prüft den Plan (Skill webseite-planen, Fahrplan P3 und P4) und seine Bauliste, ohne Abhängigkeiten (Node 18+). Liest nur.
//   node plan-pruefen.mjs [projektordner]     docs/plan.md: Pflichtzeilen und die Bauliste (Form, Kennungen, Abnahme)
//   --json                                    die Bauliste als JSON auf die Standardausgabe (so liest sie auch das Cockpit)
//   --entwurf                                 dazu: Jede Seite und jede Funktion der Bauliste kommt im Entwurf vor (design/entwurf/)
//   --bau [ordner]                            dazu: … kommt in der gebauten Seite vor (Standard seite/, sonst dist/)
//
// Die Bauliste steht in docs/plan.md unter der Überschrift «## Bauliste», als erste Tabelle darunter, mit genau diesen Spalten:
//   | Kennung | Art | Titel | Muss/Kann | Abnahme |
//   Kennung    S1, S2 … für Seiten, F1, F2 … für Funktionen; einmal vergeben, nie neu nummeriert
//   Art        Seite oder Funktion (passt zur Kennung)
//   Titel      so, wie die Person es nennt; eine Seite heisst gleich wie in der Zeile «Seiten:»
//   Muss/Kann  Muss (gehört zum ersten Flug) oder Kann (darf später kommen)
//   Abnahme    ein Satz, den man prüfen kann; [Annahme: …] ist erlaubt, [offen: …] nur, bis der Plan bestätigt ist
// Überschrift, Spaltenköpfe und die Wörter Seite, Funktion, Muss und Kann bleiben in jeder Sprache deutsch, wie die Zeilennamen.
// Im Entwurf und im Bau trägt die Stelle, die eine Funktion zeigt, das Attribut data-bauliste="F1" (mehrere mit Leerzeichen).
// Ende mit 1, wenn etwas rot ist, mit 2, wenn docs/plan.md fehlt, sonst mit 0.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const args = process.argv.slice(2);
const JSON_AUS = args.includes('--json');
const ENTWURF = args.includes('--entwurf');
const bauBei = args.indexOf('--bau');
const BAU = bauBei >= 0;
const bauOrdner = BAU && args[bauBei + 1] && !args[bauBei + 1].startsWith('--') ? args[bauBei + 1] : null;
const WURZEL = resolve(args.find((a, i) => !a.startsWith('--') && !(BAU && bauOrdner && i === bauBei + 1)) ?? '.');
const PLAN = join(WURZEL, 'docs', 'plan.md');

// Pflichtzeilen von P3 (fahrplan.yaml, Ergebnis docs/plan.md); scripts/plan-pruefen.test.ts hält die Liste mit dem Fahrplan gleich
const PFLICHTZEILEN = ['Projektname:', 'Seiten:', 'Funktionen:', 'Zugang:', 'Sprachen:', 'Setup:', 'Testing:', 'Release:', 'Pflege:', 'Stand:'];
const SPALTEN = ['Kennung', 'Art', 'Titel', 'Muss/Kann', 'Abnahme'];
const START = /^(start|startseite|home|homepage|home ?page|landingpage|landing ?page|accueil|page d'accueil|page d’accueil|pagina iniziale|inizio)$/i;
const RECHT = /impressum|imprint|legal|mentions|note legali|datenschutz|privacy|confidentialit|protection des donn|protezione|informativa/i;
// Impressum und Datenschutz je für sich, in den vier Sprachen der Skills (Pfade aus recht-ch), für Titel wie für Dateinamen
const RECHT_ARTEN = [/impressum|imprint|legal|mentions|note[\s-]?legali|colophon/i, /datenschutz|privacy|confidentialit|protection[\s-]des[\s-]donn|protezione|informativa/i];
const OFFEN = /\[(?:offen|ouvert|aperto|open)(?![\p{L}\p{N}])/iu;
const ANNAHME = /\[(?:annahme|hypoth[eè]se|ipotesi|assumption)\s*:?\s*([^\]]*)\]/gi;

const punkte = [];
const melde = (ampel, text) => punkte.push({ ampel, text });
const klein = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();
const rel = (f) => relative(WURZEL, f).split(sep).join('/') || '.';
const alle = (d) => (existsSync(d) && statSync(d).isDirectory() ? readdirSync(d, { withFileTypes: true }) : [])
  .flatMap((e) => (e.name.startsWith('.') || e.name === 'node_modules' ? [] : e.isDirectory() ? alle(join(d, e.name)) : [join(d, e.name)]));
const dateiFuer = (name) => (START.test(name) ? 'index' : name.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''));

// Eine Tabellenzeile in Zellen; «\|» in einer Zelle bleibt ein Strich
const zellen = (z) => z.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((x) => x.replace(/\\\|/g, '|').replace(/\*\*|__|`/g, '').trim());

/** Die Bauliste aus dem Text von docs/plan.md: Einträge und Fehler in der Form. */
function bauliste(text) {
  const zeilen = text.split(/\r?\n/);
  const fehler = [];
  const kopf = zeilen.findIndex((z) => /^##\s+Bauliste\s*$/.test(z));
  if (kopf < 0) return { eintraege: [], fehler: ['Die Überschrift «## Bauliste» fehlt (Skill webseite-planen, Abschnitt Grundriss)'] };
  let i = kopf + 1;
  while (i < zeilen.length && !zeilen[i].trim().startsWith('|') && !/^#{1,6}\s/.test(zeilen[i])) i++;
  if (i >= zeilen.length || !zeilen[i].trim().startsWith('|')) return { eintraege: [], fehler: ['Unter «## Bauliste» fehlt die Tabelle'] };
  const spalten = zellen(zeilen[i]);
  if (spalten.join('|') !== SPALTEN.join('|')) fehler.push(`Bauliste: Die Spalten heissen «| ${SPALTEN.join(' | ')} |», nicht «| ${spalten.join(' | ')} |»`);
  const eintraege = [];
  for (i += 1; i < zeilen.length && zeilen[i].trim().startsWith('|'); i++) {
    if (/^\s*\|[\s|:-]+\|\s*$/.test(zeilen[i])) continue;
    const z = zellen(zeilen[i]);
    const nr = i + 1;
    if (z.length !== SPALTEN.length) { fehler.push(`Bauliste, Zeile ${nr}: ${z.length} Spalten, erwartet ${SPALTEN.length}`); continue; }
    const [kennung, art, titel, stufe, abnahme] = z;
    const e = { kennung, art, titel, stufe, abnahme, offen: OFFEN.test(abnahme), zeile: nr };
    if (!/^[SF][1-9]\d*$/.test(kennung)) fehler.push(`Bauliste, Zeile ${nr}: Kennung «${kennung}» ist nicht S1, S2 … (Seite) oder F1, F2 … (Funktion)`);
    else if (eintraege.some((x) => x.kennung === kennung)) fehler.push(`Bauliste, Zeile ${nr}: Kennung ${kennung} gibt es zweimal`);
    if (art !== 'Seite' && art !== 'Funktion') fehler.push(`Bauliste, Zeile ${nr} (${kennung}): Art «${art}» ist nicht Seite oder Funktion`);
    else if (/^[SF]/.test(kennung) && (kennung[0] === 'S') !== (art === 'Seite')) fehler.push(`Bauliste, Zeile ${nr}: ${kennung} passt nicht zur Art ${art} (S für Seite, F für Funktion)`);
    if (!titel) fehler.push(`Bauliste, Zeile ${nr} (${kennung}): Titel fehlt`);
    else if (titel.length > 80) fehler.push(`Bauliste, Zeile ${nr} (${kennung}): Titel länger als 80 Zeichen`);
    else if (eintraege.some((x) => x.art === art && klein(x.titel) === klein(titel))) fehler.push(`Bauliste, Zeile ${nr} (${kennung}): «${titel}» steht schon als ${art} da`);
    if (stufe !== 'Muss' && stufe !== 'Kann') fehler.push(`Bauliste, Zeile ${nr} (${kennung}): «${stufe}» ist nicht Muss oder Kann`);
    if (abnahme.replace(ANNAHME, '$1').replace(/[\s.…<>-]/g, '').length < 10) fehler.push(`Bauliste, Zeile ${nr} (${kennung}): Abnahme fehlt: ein Satz, den man prüfen kann`);
    eintraege.push(e);
  }
  if (!eintraege.length) fehler.push('Bauliste: kein Eintrag');
  else if (!eintraege.some((e) => e.art === 'Seite')) fehler.push('Bauliste: keine Seite (Art Seite, Kennung S1 …)');
  return { eintraege, fehler };
}

// Seiten aus der Zeile «Seiten:» (wie entwurf-pruefen.mjs): [Annahme: …] ausgepackt, Klammern und Erklärungen fallen weg
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
const seitenZeile = (text) => {
  const z = text.split(/\r?\n/).find((x) => /^Seiten\s*:/.test(x));
  if (!z) return [];
  return teilen(z.replace(/^Seiten\s*:\s*/, '').replace(ANNAHME, '$1')).map((r) => r.replace(/\[[^\]]*\]/g, '').replace(/\([^)]*\)/g, '').replace(/[*_`]/g, '')
    .split(/:|\s[–—-]\s/)[0].trim().replace(/[.!?]+$/, '')).filter(Boolean);
};
const jaWert = (text, anfang) => {
  const z = text.split('\n').map((x) => x.replace(/^[\s>*-]*/, '')).filter((x) => x.startsWith(anfang)).at(-1);
  return z === undefined ? null : z.slice(anfang.length).replace(/\*/g, '').trim();
};
const datiert = (w) => w !== null && /^\d{1,4}[./\- ]/.test(w) && /\b(19|20)\d\d\b/.test(w);

if (!existsSync(PLAN)) {
  if (JSON_AUS) console.log(JSON.stringify({ datei: 'docs/plan.md', bestaetigt: null, bauliste: [], fehler: ['docs/plan.md fehlt'] }, null, 1));
  else console.error('docs/plan.md fehlt: zuerst den Grundriss schreiben (Skill webseite-planen, Abschnitt Grundriss).');
  process.exit(2);
}
const text = readFileSync(PLAN, 'utf8');
const { eintraege, fehler } = bauliste(text);
const bestaetigtRoh = jaWert(text, 'Bestätigt:');
const bestaetigt = datiert(bestaetigtRoh) ? bestaetigtRoh : null;

// ---------- Plan: Pflichtzeilen, Bauliste, Seiten gleich wie in der Zeile «Seiten:» ----------
for (const z of PFLICHTZEILEN) if (!new RegExp(`^${z.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'm').test(text)) melde('rot', `docs/plan.md: Zeile «${z}» fehlt (am Zeilenanfang, ohne Fettdruck)`);
for (const f of fehler) melde('rot', f);
const seiten = eintraege.filter((e) => e.art === 'Seite');
const funktionen = eintraege.filter((e) => e.art === 'Funktion');
if (eintraege.length) {
  const inZeile = seitenZeile(text).filter((n) => !RECHT.test(n));
  const inListe = seiten.filter((e) => !RECHT.test(e.titel));
  for (const n of inZeile) if (!inListe.some((e) => klein(e.titel) === klein(n))) melde('rot', `Seite «${n}» steht in der Zeile «Seiten:», aber nicht in der Bauliste`);
  for (const e of inListe) if (inZeile.length && !inZeile.some((n) => klein(n) === klein(e.titel))) melde('rot', `${e.kennung} «${e.titel}» steht in der Bauliste, aber nicht in der Zeile «Seiten:»`);
  if (!seiten.some((e) => RECHT.test(e.titel))) melde('gelb', 'Bauliste: Impressum und Datenschutz fehlen als Seiten (gebaut werden sie in jedem Fall, Skill recht-ch)');
  if (!funktionen.length) melde('hinweis', 'Bauliste ohne Funktion: stimmt nur, wenn Besucher auf der Seite nichts absenden, buchen oder anmelden');
  const offen = eintraege.filter((e) => e.offen);
  if (offen.length) melde(bestaetigt ? 'rot' : 'gelb', `Abnahme noch [offen] bei ${offen.map((e) => e.kennung).join(', ')}${bestaetigt ? ': Der Plan ist bestätigt, da darf nichts mehr offen sein' : ': vor dem Ja zum Plan klären'}`);
  if (!fehler.length) melde('grün', `Bauliste: ${seiten.length} ${seiten.length === 1 ? 'Seite' : 'Seiten'}, ${funktionen.length} ${funktionen.length === 1 ? 'Funktion' : 'Funktionen'}; ${eintraege.filter((e) => e.stufe === 'Muss').length} Muss, ${eintraege.filter((e) => e.stufe === 'Kann').length} Kann`);
}

// ---------- Umfang: Jede Seite und jede Funktion der Bauliste kommt im Entwurf oder im Bau vor ----------
const marken = (ordner) => {
  const gefunden = new Map(); // Kennung → erste Datei
  const dateien = alle(ordner).filter((f) => /\.html?$/i.test(f));
  for (const f of dateien) {
    const html = readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
    for (const m of html.matchAll(/\bdata-bauliste\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi))
      for (const k of (m[1] ?? m[2] ?? m[3]).split(/[\s,]+/).filter(Boolean)) if (!gefunden.has(k)) gefunden.set(k, f);
  }
  return { gefunden, dateien };
};
const umfang = (ordner, was, rechtNoetig) => {
  if (!existsSync(ordner)) { melde('rot', `${rel(ordner)}/ fehlt: Dort müsste jede Seite und jede Funktion der Bauliste vorkommen`); return; }
  const { gefunden, dateien } = marken(ordner);
  const pfade = dateien.map((f) => relative(ordner, f).split(sep).join('/').toLowerCase());
  let da = 0;
  for (const e of eintraege) {
    const fehlt = (grund) => melde(e.stufe === 'Kann' ? 'gelb' : 'rot', `${e.kennung} «${e.titel}» (${e.stufe}) fehlt ${was}: ${grund}`);
    if (gefunden.has(e.kennung)) { da++; continue; }
    if (e.art === 'Funktion') { fehlt(`Keine Stelle trägt data-bauliste="${e.kennung}"`); continue; }
    if (RECHT.test(e.titel)) {
      if (!rechtNoetig) { melde('hinweis', `${e.kennung} «${e.titel}»: im Entwurf nicht nötig, der Text kommt beim Bauen (Skill recht-ch)`); continue; }
      const arten = RECHT_ARTEN.filter((r) => r.test(e.titel));
      if (arten.every((r) => pfade.some((p) => r.test(p)))) { da++; continue; }
      fehlt('keine Seite mit diesem Namen (Skill recht-ch)'); continue;
    }
    const slug = dateiFuer(e.titel);
    if ([`${slug}.html`, `${slug}/index.html`].some((p) => pfade.includes(p))) da++;
    else fehlt(`${rel(ordner)}/${slug}.html gibt es nicht, und keine Seite trägt data-bauliste="${e.kennung}"`);
  }
  const fremd = [...gefunden.keys()].filter((k) => !eintraege.some((e) => e.kennung === k));
  for (const k of fremd) melde('gelb', `data-bauliste="${k}" in ${rel(gefunden.get(k))}: Diese Kennung gibt es in der Bauliste nicht (Nachtrag im Plan, oder entfernen)`);
  if (eintraege.length) melde('grün', `${da} von ${eintraege.length} Einträgen der Bauliste kommen ${was} vor`);
};
if (ENTWURF && eintraege.length) umfang(join(WURZEL, 'design', 'entwurf'), 'im Entwurf', false);
if (BAU && eintraege.length) umfang(bauOrdner ? resolve(WURZEL, bauOrdner) : [join(WURZEL, 'seite'), join(WURZEL, 'dist')].find((d) => existsSync(d)) ?? join(WURZEL, 'seite'), 'im Bau', true);

const rot = punkte.some((p) => p.ampel === 'rot');
const gelb = punkte.some((p) => p.ampel === 'gelb');
if (JSON_AUS) {
  console.log(JSON.stringify({
    datei: 'docs/plan.md',
    bestaetigt,
    bauliste: eintraege.map(({ kennung, art, titel, stufe, abnahme, offen }) => ({ kennung, art, titel, stufe, abnahme, offen })),
    fehler: punkte.filter((p) => p.ampel === 'rot').map((p) => p.text),
    ergebnis: rot ? 'rot' : gelb ? 'gelb' : 'grün',
  }, null, 1));
} else {
  console.log(`Plan prüfen in ${WURZEL}: docs/plan.md${bestaetigt ? `, bestätigt ${bestaetigt}` : ', noch nicht bestätigt'}`);
  console.log(`\n${rot ? '🔴' : gelb ? '🟡' : '🟢'} Plan und Bauliste: ${rot ? 'rot' : gelb ? 'gelb' : 'grün'}`);
  for (const p of punkte) console.log(`   ${p.ampel.padEnd(7)} ${p.text}`);
  console.log(rot ? '\nErgebnis: rot. Behebe die roten Punkte und prüf nochmals.' : gelb ? '\nErgebnis: gelb. Nichts ist rot; jeden gelben Punkt beheben oder mit Grund stehen lassen.' : '\nErgebnis: grün.');
}
process.exit(rot ? 1 : 0);
