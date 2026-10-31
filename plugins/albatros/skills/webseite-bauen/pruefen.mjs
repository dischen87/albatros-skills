#!/usr/bin/env node
// Prüfungen des Skills webseite-bauen auf dem Computer der Person. Misst die gebaute Seite wie die vier Prüfungen einer Software-Fabrik
// und schreibt die Messwerte nach docs/pruefung/; die Berichte in einfachen Worten schreibt danach die KI.
//   node scripts/pruefen.mjs --vor-bau              vor dem Bau: Ende mit 2 ohne «Freigegeben zum Bauen: <Datum>» in docs/entwurf.md,
//                                                    ohne design/entwurf/index.html oder ohne design/tokens.css
//   node scripts/pruefen.mjs                        die gebaute Seite aus seite/, über einen kleinen Server auf diesem Computer
//   node scripts/pruefen.mjs --tueren [<adresse>]   die Türen aus docs/tueren.txt (je Zeile Pfad und erwarteter Status ohne Anmeldung):
//                                                    lokal aus seite/, oder unter <adresse> (Baustein auf diesem Computer, Seite im Netz)
//   node scripts/pruefen.mjs --vergleich            jede gebaute Seite gegen ihren Entwurf in design/entwurf/: Überschriften, Menüpunkte
//                                                    und Abschnitte; jede Abweichung gelb, mit Stelle
//   node scripts/pruefen.mjs --live <adresse>       dieselbe Prüfung gegen die Seite im Netz, dazu Titel wie in seite/index.html
//   --nur sicherheit,ablaeufe,aussehen,code         nur diese Bereiche
//   --aus <ordner>                                  Messwerte und Fotos dorthin statt nach docs/pruefung (für Durchspiel und Tests)
// Aufruf im Projektordner (mit seite/, meist auch web/, design/ und docs/). Beim ersten Mal lädt das Skript Playwright, axe-core (dieselben
// Regeln wie pa11y) und Lighthouse nach ~/.cache/albatros-pruefen und Chromium dazu; --vor-bau und --tueren brauchen sie nicht. Zeigt nie
// Werte von Geheimnissen. Ende mit 1, wenn ein Bereich rot ist, mit 2, wenn etwas fehlt, was die Prüfung braucht, sonst mit 0.
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const wert = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const LIVE = wert('--live')?.replace(/\/$/, '');
const NUR = new Set((wert('--nur') ?? 'sicherheit,ablaeufe,aussehen,code').split(','));
// --tueren ohne Adresse prüft lokal, was in seite/ liegt
const TUEREN = !args.includes('--tueren') ? null : /^https?:\/\//.test(wert('--tueren') ?? '') ? wert('--tueren').replace(/\/$/, '') : 'lokal';
const VERGLEICH = args.includes('--vergleich');
const WURZEL = process.cwd();
const SEITE = join(WURZEL, 'seite');
const ENTWURF = join(WURZEL, 'design', 'entwurf');
const AUS = resolve(wert('--aus') ?? join(WURZEL, 'docs', 'pruefung'));
const SELBST = fileURLToPath(import.meta.url);
const WIN = process.platform === 'win32';
const fehlt = (...texte) => { console.error(texte.join('\n')); process.exit(2); };

const alle = (d) => (existsSync(d) ? readdirSync(d, { withFileTypes: true }) : [])
  .flatMap((e) => (['node_modules', '.git', '.astro', '.cache'].includes(e.name) ? [] : e.isDirectory() ? alle(join(d, e.name)) : [join(d, e.name)]));
const rel = (f) => relative(WURZEL, f).split(sep).join('/');

// ---------- Vor dem Bau: gebaut wird nur ein Entwurf mit Freigabe zum Bauen (Skill entwurf); es zählt die letzte solche Zeile ----------
if (args.includes('--vor-bau')) {
  const md = join(WURZEL, 'docs', 'entwurf.md');
  const zeilen = existsSync(md) ? readFileSync(md, 'utf8').split('\n').map((z) => z.replace(/^[\s>*-]*/, '')).filter((z) => z.startsWith('Freigegeben zum Bauen:')) : [];
  const freigabe = zeilen.at(-1)?.slice('Freigegeben zum Bauen:'.length).replace(/\*/g, '').trim() ?? '';
  // Ein Datum steht vorne (31.10.2026, 2026-10-31, 31. Oktober 2026); leer, «[offen …]» oder «<Datum>» ist keine Freigabe
  const datiert = /^\d{1,4}[./\- ]/.test(freigabe) && /\b(19|20)\d\d\b/.test(freigabe);
  const luecken = [
    !existsSync(md) ? 'docs/entwurf.md fehlt: zuerst die ganze Seite entwerfen und freigeben lassen (Skill entwurf).'
      : !datiert && 'docs/entwurf.md hat keine Zeile «Freigegeben zum Bauen: <Datum>». Gebaut wird erst nach dem Ja der Person zum Entwurf (Skill entwurf, Abschnitt Freigabe).',
    !existsSync(join(ENTWURF, 'index.html')) && 'design/entwurf/index.html fehlt: gebaut wird aus dem Entwurf (Skill entwurf).',
    !existsSync(join(WURZEL, 'design', 'tokens.css')) && 'design/tokens.css fehlt: Farben, Schriften und Abstände kommen aus dem Designsystem (Skill gestaltung).',
  ].filter(Boolean);
  if (luecken.length) fehlt('Noch nicht bauen:', ...luecken.map((l) => `- ${l}`));
  const n = alle(ENTWURF).filter((f) => f.endsWith('.html')).length;
  console.log(`Freigegeben zum Bauen: ${freigabe}. Entwurf mit ${n} ${n === 1 ? 'Seite' : 'Seiten'} in design/entwurf/. Es darf gebaut werden.`);
  process.exit(0);
}

const LOKAL = !LIVE && (!TUEREN || TUEREN === 'lokal');
if (LOKAL && !existsSync(join(SEITE, 'index.html'))) fehlt('seite/index.html fehlt: zuerst in web/ «npm run build» (outDir ../seite).');
if (VERGLEICH && !existsSync(join(ENTWURF, 'index.html'))) fehlt('design/entwurf/index.html fehlt: verglichen wird mit dem freigegebenen Entwurf (Skill entwurf).');

// Wie Albatros ausliefert: /a → a, a.html oder a/index.html
const datei = (wurzel, p) => {
  let roh;
  try { roh = decodeURIComponent(p.split(/[?#]/)[0]); } catch { return null; }
  if (roh.split('/').includes('..')) return null;
  for (const k of [roh, `${roh}.html`, join(roh, 'index.html')]) {
    const f = join(wurzel, k);
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return null;
};
const pfad = (wurzel, f) => `/${relative(wurzel, f).split(sep).join('/')}`.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
const seitenIn = (wurzel) => alle(wurzel).filter((f) => f.endsWith('.html') && !/(^|[/\\])404\.html$/.test(f)).map((f) => pfad(wurzel, f))
  .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
const TYPEN = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml' };
// Ein kleiner Server auf diesem Computer, der einen Ordner so ausliefert wie Albatros
const statisch = async (wurzel) => {
  const s = createServer((q, a) => {
    const f = datei(wurzel, q.url ?? '/');
    a.writeHead(f ? 200 : 404, { 'content-type': f ? (TYPEN[extname(f).toLowerCase()] ?? 'application/octet-stream') : 'text/plain' });
    a.end(f ? readFileSync(f) : 'Nicht gefunden');
  }).listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  return { adresse: `http://127.0.0.1:${s.address().port}`, zu: () => s.close() };
};
// Impressum und Datenschutz in den vier Sprachen der Skills (Pfade aus recht-ch: /impressum, /mentions-legales, /legal-notice;
// /datenschutz, /protection-des-donnees, /protezione-dei-dati, /privacy), für Seiten wie für Links (Adresse und Text des Links)
const IMPRESSUM = /impressum|imprint|legal|mentions|colophon/i;
const DATENSCHUTZ = /datenschutz|privacy|confidentialit|protection.des.donn|protezione|informativa/i;

// Ergebnis: je Bereich eine Ampel (die schlechteste ihrer Punkte) und die Punkte
// hinweis: etwas, das die KI selbst tun muss (Fotos anschauen, Formular ausprobieren); ändert die Ampel nicht
const STUFE = { hinweis: -1, grün: 0, gelb: 1, rot: 2 };
const NAMEN = { sicherheit: 'Sicherheit und Recht', ablaeufe: 'Abläufe und Zugang', aussehen: 'Aussehen', code: 'Code und Tempo', live: 'Im Netz',
  tueren: 'Türen (wer darf was)', vergleich: 'Vergleich mit dem Entwurf' };
const BEREICHE = TUEREN ? ['tueren'] : VERGLEICH ? ['vergleich']
  : [...['sicherheit', 'ablaeufe', 'aussehen', 'code'].filter((k) => NUR.has(k)), ...(LIVE ? ['live'] : [])];
const B = Object.fromEntries(BEREICHE.map((k) => [k, { ampel: 'grün', punkte: [] }]));
const melde = (b, ampel, text, details) => {
  if (!B[b]) return;
  B[b].punkte.push(details?.length ? { ampel, text, details: details.slice(0, 20) } : { ampel, text });
  if (STUFE[ampel] > STUFE[B[b].ampel]) B[b].ampel = ampel;
};
// Messwerte schreiben und die Ampeln zeigen; Ende mit 1, wenn ein Bereich rot ist
const schluss = (name, titel, kopf) => {
  mkdirSync(AUS, { recursive: true });
  writeFileSync(join(AUS, name), `${JSON.stringify({ zeit: new Date().toISOString(), ...kopf, bereiche: B }, null, 1)}\n`);
  console.log(`\n${titel}. Messwerte: ${AUS.startsWith(WURZEL) ? rel(join(AUS, name)) : join(AUS, name)}`);
  for (const [k, b] of Object.entries(B)) {
    console.log(`\n${b.ampel === 'grün' ? '🟢' : b.ampel === 'gelb' ? '🟡' : '🔴'} ${NAMEN[k]}: ${b.ampel}`);
    for (const x of b.punkte.filter((y) => y.ampel !== 'grün' || b.punkte.length <= 4)) console.log(`   ${x.ampel.padEnd(7)} ${x.text}`);
  }
  process.exit(Object.values(B).some((b) => b.ampel === 'rot') ? 1 : 0);
};

// ---------- Türen: jede Adresse aus docs/tueren.txt antwortet ohne Anmeldung so, wie es im PRD unter «Zugang» steht ----------
if (TUEREN) {
  const liste = join(WURZEL, 'docs', 'tueren.txt');
  const FORM = 'docs/tueren.txt: je Zeile ein Pfad und der erwartete Status ohne Anmeldung, zum Beispiel «/verwaltung 404» oder «/intern/ 401»; Kommentare nach #.';
  if (!existsSync(liste)) fehlt(`docs/tueren.txt fehlt. ${FORM}`);
  const tueren = [];
  const unlesbar = [];
  readFileSync(liste, 'utf8').split('\n').forEach((z, i) => {
    const t = z.replace(/#.*$/, '').trim();
    if (!t) return;
    const p = /^\/\S*/.exec(t)?.[0];
    const soll = [...t.slice(p?.length ?? 0).matchAll(/\b[1-5]\d\d\b/g)].map((m) => Number(m[0]));
    if (p && soll.length) tueren.push({ pfad: p, soll });
    else unlesbar.push(`Zeile ${i + 1} nicht lesbar: ${t}`);
  });
  if (unlesbar.length || !tueren.length) fehlt(FORM, ...unlesbar);
  const server = TUEREN === 'lokal' ? await statisch(SEITE) : null;
  const basis = server?.adresse ?? TUEREN;
  // Status ohne Anmeldung. Einer Umleitung auf dieselbe Adresse mit oder ohne «/» am Ende (/a → /a/) folgt sie, jede andere zählt selbst
  const status = async (p) => {
    let u = new URL(p, basis);
    for (let schritt = 0; ; schritt++) {
      const r = await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(10_000) }).catch(() => null);
      if (!r) return 0;
      await r.body?.cancel().catch(() => {});
      const ziel = r.status >= 300 && r.status < 400 && r.headers.get('location') ? new URL(r.headers.get('location'), u) : null;
      if (!ziel || ziel.origin !== u.origin || ziel.pathname.replace(/\/$/, '') !== u.pathname.replace(/\/$/, '') || schritt === 3) return r.status;
      u = ziel;
    }
  };
  for (const t of tueren) {
    const ist = await status(t.pfad);
    melde('tueren', t.soll.includes(ist) ? 'grün' : 'rot', `${t.pfad}: ${ist || 'keine Antwort'}, erwartet ${t.soll.join(' oder ')}`);
  }
  server?.zu();
  schluss('tueren.json', `Türen ${server ? 'lokal (seite/)' : `unter ${basis}`}, ${tueren.length} Türen`, { adresse: server ? 'seite/ (lokal)' : basis });
}

// Werkzeuge einmal in einen eigenen Ordner, nie ins Projekt der Person
const WERKZEUGE = join(homedir(), '.cache', 'albatros-pruefen');
const modul = (...p) => join(WERKZEUGE, 'node_modules', ...p);
if (!existsSync(modul('lighthouse', 'cli', 'index.js'))) {
  console.log('Lade die Prüfwerkzeuge (einmalig, etwa 200 MB) …');
  mkdirSync(WERKZEUGE, { recursive: true });
  execFileSync('npm', ['install', '--prefix', WERKZEUGE, '--no-audit', '--no-fund', '--loglevel=error', 'playwright@1', 'axe-core@4', 'lighthouse@13'], { stdio: 'inherit', shell: WIN });
}
const { chromium } = createRequire(join(WERKZEUGE, 'package.json'))('playwright');
if (!existsSync(chromium.executablePath())) execFileSync(process.execPath, [modul('playwright', 'cli.js'), 'install', 'chromium'], { stdio: 'inherit' });
const AXE = readFileSync(modul('axe-core', 'axe.min.js'), 'utf8');

// ---------- Vergleich mit dem Entwurf: was die Person im Entwurf freigegeben hat, steht auch im Bau ----------
// Unterschiede zweier Listen über die längste gemeinsame Folge: je Lücke paarweise [Nr. und Text im Entwurf, Nr. und Text im Bau]
const unterschiede = (a, b) => {
  const gleich = (x, y) => x.toLowerCase() === y.toLowerCase();
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) L[i][j] = gleich(a[i], b[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const aus = [];
  let [i, j, nurA, nurB] = [0, 0, [], []];
  const paare = () => { for (let k = 0; k < Math.max(nurA.length, nurB.length); k++) aus.push([nurA[k], nurB[k]]); nurA = []; nurB = []; };
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && gleich(a[i], b[j])) { paare(); i++; j++; }
    else if (j >= b.length || (i < a.length && L[i + 1][j] >= L[i][j + 1])) { nurA.push([i + 1, a[i]]); i++; }
    else { nurB.push([j + 1, b[j]]); j++; }
  }
  paare();
  return aus;
};
if (VERGLEICH) {
  const [entwurf, bau] = [await statisch(ENTWURF), await statisch(SEITE)];
  // Seiten gehören zusammen über ihren Pfad (/angebot.html im Entwurf, /angebot/ im Bau), sonst über den letzten Teil, wenn er eindeutig ist
  const schluessel = (p) => (p === '/' ? '/' : p.replace(/\/$/, ''));
  const imEntwurf = new Map(seitenIn(ENTWURF).map((p) => [schluessel(p), p]));
  const imBau = new Map(seitenIn(SEITE).map((p) => [schluessel(p), p]));
  const entwurfsDatei = (p) => rel(datei(ENTWURF, p) ?? ENTWURF);
  const verglichen = new Set();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    // Was die Person sieht, nach dem Laden (auch was ein Skript einfügt): Überschriften, Menü im Kopf, Abschnitte im Inhalt
    const bauplan = async (url) => {
      const r = await page.goto(url, { waitUntil: 'load', timeout: 30_000 }).catch(() => null);
      if (r?.status() !== 200) return null;
      return page.evaluate(() => {
        const text = (e) => (e?.textContent ?? '').replace(/\s+/g, ' ').trim();
        const ziel = (a) => {
          const u = new URL(a.getAttribute('href') ?? '', location.href);
          return u.origin !== location.origin ? `${u.host}${u.pathname}` : `${u.pathname.replace(/(index)?\.html$/, '').replace(/(.)\/$/, '$1') || '/'}${u.hash}`;
        };
        const nav = document.querySelector('header nav') ?? document.querySelector('nav');
        const inhalt = document.querySelector('main') ?? document.body;
        return {
          Überschrift: [...document.querySelectorAll('h1, h2, h3')].map((h) => `${h.tagName.toLowerCase()} «${text(h)}»`),
          Menüpunkt: [...(nav?.querySelectorAll('a') ?? [])].map((a) => `«${text(a)}» → ${ziel(a)}`),
          Abschnitt: [...inhalt.querySelectorAll('section')].filter((s) => !s.parentElement?.closest('section'))
            .map((s) => `«${s.id || s.getAttribute('aria-label') || text(s.querySelector('h1, h2, h3')) || 'ohne Titel'}»`),
        };
      });
    };
    for (const [k, p] of imEntwurf) {
      const gleichNamig = [...imBau.keys()].filter((x) => x.split('/').at(-1) === k.split('/').at(-1));
      const kb = imBau.has(k) ? k : gleichNamig.length === 1 ? gleichNamig[0] : null;
      if (!kb) { melde('vergleich', 'gelb', `${k}: Seite aus dem Entwurf fehlt im Bau (${entwurfsDatei(p)})`); continue; }
      verglichen.add(kb);
      const e = await bauplan(entwurf.adresse + p);
      const b = await bauplan(bau.adresse + imBau.get(kb));
      if (!e || !b) { melde('vergleich', 'rot', `${k}: ${e ? 'die gebaute Seite' : 'der Entwurf'} lässt sich nicht laden`); continue; }
      const stelle = kb === k ? k : `${k} (im Bau ${kb})`;
      let n = 0;
      for (const art of Object.keys(e)) {
        for (const [x, y] of unterschiede(e[art], b[art])) {
          n++;
          melde('vergleich', 'gelb', x && y ? `${stelle}: ${art} geändert: Entwurf Nr. ${x[0]} ${x[1]}, Bau Nr. ${y[0]} ${y[1]}`
            : x ? `${stelle}: ${art} fehlt im Bau: Entwurf Nr. ${x[0]} ${x[1]}` : `${stelle}: ${art} nicht im Entwurf: Bau Nr. ${y[0]} ${y[1]}`);
        }
      }
      if (!n) melde('vergleich', 'grün', `${stelle}: Überschriften, Menü und Abschnitte wie im Entwurf`);
    }
  } finally {
    await browser.close();
  }
  // Impressum und Datenschutz gehören nicht in den Entwurf, alle anderen Seiten schon
  const neu = [...imBau.keys()].filter((k) => !verglichen.has(k) && !IMPRESSUM.test(k) && !DATENSCHUTZ.test(k));
  if (neu.length) melde('vergleich', 'gelb', `Seiten im Bau, die nicht im Entwurf stehen: ${neu.join(', ')}`, neu);
  entwurf.zu();
  bau.zu();
  schluss('vergleich.json', `Vergleich mit dem Entwurf, ${imEntwurf.size} Seiten im Entwurf, ${imBau.size} im Bau`, { adresse: 'seite/ (lokal) gegen design/entwurf/' });
}

const SEITEN = seitenIn(SEITE);
if (!SEITEN.length) SEITEN.push('/');

// ---------- Sicherheit und Recht ----------
if (B.sicherheit) {
  const GEHEIM = [/sk_(live|test)_[0-9a-zA-Z]{10,}/, /rk_(live|test)_[0-9a-zA-Z]{10,}/, /AKIA[0-9A-Z]{16}/, /gh[pousr]_[0-9A-Za-z]{30,}/,
    /github_pat_[0-9A-Za-z_]{20,}/, /xox[abprs]-[0-9A-Za-z-]{10,}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /AIza[0-9A-Za-z_-]{35}/,
    /sk-ant-[0-9A-Za-z_-]{20,}/, /sk-(proj-)?[0-9A-Za-z_-]{32,}/, /\bre_[0-9A-Za-z]{20,}/];
  const funde = [];
  for (const f of alle(WURZEL)) {
    if (f === SELBST || f.startsWith(AUS) || statSync(f).size > 2e6 || /\.(png|jpe?g|webp|avif|gif|ico|pdf|woff2?|ttf|mp4|zip)$/i.test(f)) continue;
    readFileSync(f, 'utf8').split('\n').forEach((z, i) => { if (GEHEIM.some((r) => r.test(z))) funde.push(`${rel(f)}:${i + 1}`); });
  }
  melde('sicherheit', funde.length ? 'rot' : 'grün', funde.length ? `Mögliche Geheimnisse im Code (Wert nicht gezeigt): ${funde.length}` : 'Keine Geheimnisse im Code', funde);
  const envs = alle(WURZEL).map(rel).filter((f) => /(^|\/)\.env(\.|$)/.test(f) && !/\.(example|sample)$/.test(f));
  const ignoriert = existsSync(join(WURZEL, '.gitignore')) && /^\/?\.env/m.test(readFileSync(join(WURZEL, '.gitignore'), 'utf8'));
  if (envs.some((f) => f.startsWith('seite/'))) melde('sicherheit', 'rot', '.env liegt in seite/ und wäre im Netz', envs);
  else if (envs.length && !ignoriert) melde('sicherheit', 'gelb', '.env ist nicht in .gitignore', envs);
  if (existsSync(join(WURZEL, 'web', 'package-lock.json'))) {
    const r = spawnSync('npm', ['audit', '--json', '--omit=dev'], { cwd: join(WURZEL, 'web'), encoding: 'utf8', shell: WIN, maxBuffer: 32e6 });
    try {
      const v = JSON.parse(r.stdout).metadata.vulnerabilities;
      const hoch = (v.high ?? 0) + (v.critical ?? 0);
      melde('sicherheit', hoch ? 'rot' : v.moderate ? 'gelb' : 'grün', `npm audit: ${hoch} hohe oder kritische, ${v.moderate ?? 0} mittlere Lücken`);
    } catch {
      melde('sicherheit', 'gelb', 'npm audit lief nicht (ohne Netz?)');
    }
  }
  for (const [name, muster] of [['Impressum', IMPRESSUM], ['Datenschutz', DATENSCHUTZ]]) {
    const da = SEITEN.find((p) => muster.test(p));
    melde('sicherheit', da ? 'grün' : 'rot', da ? `${name}: ${da}` : `Seite ${name} fehlt (Pflicht in der Schweiz und der EU)`);
  }
}

// ---------- Aussehen (Code): Tokens aus design/tokens.css eingebunden, nur Tokens im Code, Hinweise auf KI-Look ----------
const quellen = alle(join(WURZEL, 'web', 'src')).filter((f) => /\.(astro|css|scss|jsx|tsx|vue|svelte|html|md|mdx)$/.test(f));
if (B.aussehen) {
  const vonHand = [];
  const verlaeufe = [];
  for (const f of quellen.filter((x) => !/tokens\.css$/.test(x))) {
    readFileSync(f, 'utf8').split('\n').forEach((z, i) => {
      if (/#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(rgba?|hsla?|oklch)\(|font-size\s*:\s*[\d.]+(px|rem|em)/.test(z)) vonHand.push(`${rel(f)}:${i + 1}`);
      if (/(linear|radial|conic)-gradient/.test(z)) verlaeufe.push(`${rel(f)}:${i + 1}`);
    });
  }
  // Die Tokens stehen in design/tokens.css (Skill gestaltung); ältere Projekte haben sie noch in web/src/styles/tokens.css
  const [NEU, ALT] = [join(WURZEL, 'design', 'tokens.css'), join(WURZEL, 'web', 'src', 'styles', 'tokens.css')];
  const TOKENS = [NEU, ALT].find((f) => existsSync(f));
  if (!TOKENS) melde('aussehen', 'rot', 'design/tokens.css fehlt (ältere Projekte: web/src/styles/tokens.css)');
  else {
    // Eingebunden heisst: Die Werte aus tokens.css stehen in der gebauten Seite (in einer CSS-Datei oder im <style> der Seite)
    const namen = [...new Set([...readFileSync(TOKENS, 'utf8').matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))];
    const gebaut = alle(SEITE).filter((f) => /\.(css|html)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
    const da = namen.filter((n) => gebaut.includes(`${n}:`));
    melde('aussehen', da.length ? 'grün' : 'rot', da.length ? `${rel(TOKENS)} ist eingebunden (${da.length} von ${namen.length} Werten in seite/)`
      : `${rel(TOKENS)} ist nicht eingebunden: im Layout importieren und neu bauen`);
    if (TOKENS === NEU && existsSync(ALT)) melde('aussehen', 'gelb', 'Zwei tokens.css: web/src/styles/tokens.css entfernen, es gilt nur design/tokens.css');
  }
  melde('aussehen', vonHand.length ? 'gelb' : 'grün', vonHand.length ? `Farben oder Schriftgrössen von Hand statt aus tokens.css: ${vonHand.length} Stellen` : 'Farben und Schriftgrössen nur aus tokens.css', vonHand);
  if (verlaeufe.length) melde('aussehen', 'gelb', `Verläufe (KI-Merkmal, mit den Fotos prüfen): ${verlaeufe.length}`, verlaeufe);
  const schriften = quellen.flatMap((f) => [...readFileSync(f, 'utf8').matchAll(/font-family\s*:\s*([^;}\n]+)/g)].map((m) => m[1].trim()));
  if (schriften.length && schriften.every((s) => /^["']?(Inter|Roboto|Arial|Helvetica|system-ui|-apple-system|sans-serif)/i.test(s))) {
    melde('aussehen', 'gelb', `Nur Standardschriften (KI-Merkmal): ${[...new Set(schriften)].join(', ')}`);
  }
}

// ---------- Im Browser: Zugang (axe), Links, Formulare, JavaScript, Fotos, Floskeln ----------
const FLOSKELN = /willkommen auf unserer|entdecken sie|ihr partner für|mit leidenschaft|innovativ|nahtlos|bienvenue sur notre|découvrez|votre partenaire|benvenuti sul nostro|scopri|il vostro partner|welcome to our website|discover|your partner for|seamless|cutting-edge|lorem ipsum/gi;
const EMOJI = /\p{Extended_Pictographic}/u;
const name = (p) => (p === '/' ? 'start' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));
const server = LIVE ? null : await statisch(SEITE);
const BASIS = LIVE ?? server.adresse;
const titel = {};

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let skripte = 0;
  page.on('response', async (r) => {
    if (r.request().resourceType() === 'script') skripte += (await r.body().catch(() => Buffer.alloc(0))).length;
  });
  const geprueft = new Map();
  for (const p of SEITEN) {
    skripte = 0;
    const r = await page.goto(BASIS + p, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => null);
    const status = r?.status() ?? 0;
    if (status !== 200) {
      melde(LIVE ? 'live' : 'ablaeufe', 'rot', `${p} antwortet mit ${status || 'nichts'}`);
      continue;
    }
    titel[p] = await page.title();
    // JavaScript zuerst messen, bevor axe dazukommt
    if (B.code) {
      const inline = await page.$$eval('script:not([src])', (es) => es.reduce((s, e) => s + e.textContent.length, 0));
      const kb = Math.round((skripte + inline) / 1024);
      if (kb > 50) melde('code', 'rot', `${p}: ${kb} KB JavaScript (Budget 50 KB je Seite)`);
      else melde('code', 'grün', `${p}: ${kb} KB JavaScript`);
    }
    if (B.ablaeufe) {
      await page.addScriptTag({ content: AXE });
      const fehler = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }))
        .violations.map((v) => ({ id: v.id, impact: v.impact, hilfe: v.help, n: v.nodes.length, wo: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) })));
      for (const v of fehler) melde('ablaeufe', ['critical', 'serious'].includes(v.impact) ? 'rot' : 'gelb', `${p}: ${v.hilfe} (${v.id}, ${v.n}×)`, v.wo);
      if (!fehler.length) melde('ablaeufe', 'grün', `${p}: Zugang nach WCAG 2.2 AA (axe): nichts gefunden`);
      const ziele = await page.$$eval('a[href], img[src], link[rel=stylesheet][href], script[src], source[src]', (es) => es.map((e) => e.getAttribute('href') ?? e.getAttribute('src')));
      for (const z of ziele) {
        if (!z || /^(#|mailto:|tel:|javascript:|data:)/i.test(z)) continue;
        const u = new URL(z, BASIS + p);
        if (u.origin !== new URL(BASIS).origin || geprueft.has(u.pathname)) continue;
        const ok = LIVE ? (await fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(10_000) }).catch(() => null))?.ok ?? false : !!datei(SEITE, u.pathname);
        geprueft.set(u.pathname, ok);
        if (!ok) melde('ablaeufe', 'rot', `Toter Link auf ${p}: ${u.pathname}`);
      }
      // Impressum und Datenschutz gehören auf jede Seite, auch auf die Seiten der Bausteine (Buchen, Anmelden)
      const links = await page.$$eval('a[href]', (as) => as.map((a) => `${a.getAttribute('href')} ${a.textContent}`.toLowerCase()).join(' '));
      if (!IMPRESSUM.test(links)) melde('ablaeufe', 'rot', `${p}: kein Link zum Impressum (gehört auf jede Seite, Skill recht-ch)`);
      if (!DATENSCHUTZ.test(links)) melde('ablaeufe', 'rot', `${p}: kein Link zur Datenschutzerklärung (gehört auf jede Seite, Skill recht-ch)`);
      const formulare = await page.$$eval('form', (fs) => fs.map((f) => f.getAttribute('action') ?? '(ohne action)'));
      if (formulare.length) melde('ablaeufe', 'hinweis', `${p}: ${formulare.length} Formular(e) selbst ausprobieren (absenden, Fehler, Tastatur)`, formulare);
    }
    if (B.aussehen) {
      const text = await page.innerText('body');
      const floskeln = [...new Set((text.match(FLOSKELN) ?? []).map((x) => x.toLowerCase()))];
      if (floskeln.length) melde('aussehen', 'gelb', `${p}: Floskeln (KI-Merkmal): ${floskeln.join(', ')}`);
      if (EMOJI.test(await page.$$eval('h1, h2, h3, nav, button, li', (es) => es.map((e) => e.textContent).join(' ')))) melde('aussehen', 'gelb', `${p}: Emoji in Titeln, Menü oder Listen (KI-Merkmal)`);
      // Handy (390 px): seitlich schieben geht nicht, Text hat links und rechts Luft
      const handy = await page.evaluate(() => ({
        breit: document.documentElement.scrollWidth > innerWidth + 1,
        amRand: [...document.querySelectorAll('h1, h2, h3, p, li, a, button, label, input')].filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.right > 0 && r.left < innerWidth && getComputedStyle(e).visibility !== 'hidden' && (r.left < 12 || r.right > innerWidth - 12);
        }).length,
      }));
      if (handy.breit) melde('aussehen', 'rot', `${p}: Auf dem Handy (390 px) lässt sich die Seite seitlich schieben`);
      if (handy.amRand) melde('aussehen', 'gelb', `${p}: Auf dem Handy kleben ${handy.amRand} Elemente am Rand (weniger als 12 px Luft)`);
      // Menü bei 390 px: eine Zeile oder ein Knopf «Menü» (Links in einem geschlossenen <details> haben keine Fläche)
      const menueZeilen = await page.evaluate(() => {
        const nav = document.querySelector('header nav') ?? document.querySelector('nav');
        const oben = [...(nav?.querySelectorAll('a') ?? [])].filter((a) => a.getClientRects().length && getComputedStyle(a).visibility !== 'hidden')
          .map((a) => a.getBoundingClientRect().top).sort((x, y) => x - y);
        return oben.filter((t, i) => i === 0 || t - oben[i - 1] > 8).length;
      });
      if (menueZeilen > 1) melde('aussehen', 'rot', `${p}: Auf dem Handy (390 px) steht das Menü auf ${menueZeilen} Zeilen: auf eine Zeile oder als Knopf «Menü» (Skill gestaltung)`);
      // Startseite: gleich gestaltete Karten neben- oder untereinander sind das häufigste KI-Merkmal; Listen gleicher Dinge (ul, ol) zählen nicht
      const startseite = p === '/' || p === '/index.html';
      const karten = startseite ? await page.evaluate(() => {
        const istKarte = (e) => {
          const s = getComputedStyle(e);
          const flaeche = s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== getComputedStyle(e.parentElement).backgroundColor;
          return e.offsetHeight > 60 && parseFloat(s.borderTopLeftRadius) >= 4 && (flaeche || s.boxShadow !== 'none' || parseFloat(s.borderTopWidth) > 0);
        };
        const art = (e) => { const s = getComputedStyle(e); return [s.backgroundColor, s.borderTopLeftRadius, s.boxShadow, s.borderTopWidth, s.paddingTop, e.offsetWidth].join('|'); };
        const wurzel = document.querySelector('main') ?? document.body;
        let max = 0;
        for (const el of [wurzel, ...wurzel.querySelectorAll('*')]) {
          if (/^(UL|OL)$/.test(el.tagName)) continue;
          const n = {};
          for (const k of el.children) if (istKarte(k)) n[art(k)] = (n[art(k)] ?? 0) + 1;
          max = Math.max(max, 0, ...Object.values(n));
        }
        return max;
      }) : 0;
      if (karten > 1) melde('aussehen', 'rot', `${p}: ${karten} gleich gestaltete Karten (KI-Merkmal): ordne nach Wichtigkeit, das Wichtigste gross in den Kopf, der Rest ohne gleiche Kästen (Skill gestaltung)`);
      mkdirSync(join(AUS, 'fotos'), { recursive: true });
      const vor = LIVE ? 'live-' : '';
      await page.screenshot({ path: join(AUS, 'fotos', `${vor}${name(p)}-390.png`), fullPage: true });
      await page.setViewportSize({ width: 1440, height: 900 });
      // Startseite: Im ersten Bild am Computer steht ein Foto oder Bild (Skill gestaltung, «Schlicht heisst nicht ohne Bild»)
      if (startseite && !(await page.evaluate(() => [...document.querySelectorAll('body *')].some((e) => {
        const r = e.getBoundingClientRect();
        if (r.top >= innerHeight || r.bottom <= 0 || r.width < 200 || r.height < 120) return false;
        return /^(img|picture|video|svg|canvas)$/i.test(e.tagName) || getComputedStyle(e).backgroundImage.includes('url(');
      })))) melde('aussehen', 'gelb', `${p}: Im ersten Bild der Startseite (1440 × 900) steht kein Foto: Foto aus der Fotoliste einsetzen; bis dahin muss das Wichtigste gross im Kopf stehen`);
      await page.screenshot({ path: join(AUS, 'fotos', `${vor}${name(p)}-1440.png`), fullPage: true });
      await page.setViewportSize({ width: 390, height: 844 });
    }
  }
  if (B.ablaeufe && geprueft.size && ![...geprueft.values()].includes(false)) melde('ablaeufe', 'grün', `${geprueft.size} Links und Dateien geprüft, keiner tot`);
  if (B.aussehen) melde('aussehen', 'hinweis', 'Fotos in docs/pruefung/fotos/ (390 und 1440 px): selbst anschauen und mit der Liste der KI-Merkmale im Skill gestaltung vergleichen');
} finally {
  await browser.close();
}

// ---------- Code und Tempo: Lighthouse und Bilder ----------
if (B.code) {
  for (const p of SEITEN.filter((x) => titel[x] !== undefined)) {
    // Nicht spawnSync: Das blockiert diesen Prozess und damit den kleinen Server, den Lighthouse gerade abfragt
    const stdout = await new Promise((fertig) => {
      const c = spawn(process.execPath, [modul('lighthouse', 'cli', 'index.js'), BASIS + p, '--output=json', '--quiet', '--chrome-flags=--headless=new --no-sandbox',
        '--only-categories=performance,accessibility,best-practices,seo'], { env: { ...process.env, CHROME_PATH: chromium.executablePath() }, stdio: ['ignore', 'pipe', 'ignore'] });
      let aus = '';
      c.stdout.on('data', (d) => { aus += d; });
      c.on('close', () => fertig(aus));
    });
    let k;
    try { k = JSON.parse(stdout).categories; } catch { melde('code', 'gelb', `${p}: Lighthouse lief nicht`); continue; }
    const werte = Object.fromEntries(Object.values(k).map((c) => [c.id, Math.round((c.score ?? 0) * 100)]));
    const min = Math.min(...Object.values(werte));
    melde('code', min >= 90 ? 'grün' : min >= 80 ? 'gelb' : 'rot', `${p}: Lighthouse ${Object.entries(werte).map(([a, b]) => `${a} ${b}`).join(', ')} (Ziel je ≥ 90)`);
  }
  if (!LIVE) {
    const gross = alle(SEITE).filter((f) => /\.(png|jpe?g|webp|avif|gif)$/i.test(f)).map((f) => [rel(f), statSync(f).size]).filter(([, s]) => s > 500e3);
    for (const [f, s] of gross) melde('code', s > 1.5e6 ? 'rot' : 'gelb', `Bild zu gross: ${f} (${Math.round(s / 1024)} KB, Ziel unter 500 KB)`);
  }
}

// ---------- Im Netz: derselbe Titel wie gebaut, Impressum und Datenschutz antworten ----------
if (LIVE) {
  const soll = existsSync(join(SEITE, 'index.html')) ? /<title>([^<]*)<\/title>/i.exec(readFileSync(join(SEITE, 'index.html'), 'utf8'))?.[1]?.trim() : wert('--titel');
  const ist = titel['/'];
  melde('live', soll && ist === soll ? 'grün' : 'rot', `Titel im Netz: «${ist ?? '–'}»${soll ? `, gebaut: «${soll}»` : ''}`);
  for (const [n, muster] of [['Impressum', IMPRESSUM], ['Datenschutz', DATENSCHUTZ]]) {
    const p = SEITEN.find((x) => muster.test(x));
    melde('live', p && titel[p] !== undefined ? 'grün' : 'rot', p ? `${n} im Netz: ${p}` : `${n} nicht gefunden`);
  }
}
server?.zu();

schluss(LIVE ? 'messwerte-live.json' : 'messwerte.json', `Prüfung ${LIVE ? `im Netz (${LIVE})` : 'lokal'}, ${SEITEN.length} Seiten`, { adresse: LIVE ?? 'seite/ (lokal)', seiten: SEITEN });
