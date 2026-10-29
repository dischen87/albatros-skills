#!/usr/bin/env node
// Prüfung vor der Freigabe (Skill webseite-bauen, Schritt 7): misst die gebaute Seite wie die vier Prüfungen einer Software-Fabrik
// und schreibt die Messwerte nach docs/pruefung/messwerte.json. Die Berichte in einfachen Worten schreibt danach die KI.
//   node scripts/pruefen.mjs                      die gebaute Seite aus seite/, über einen kleinen Server auf diesem Computer
//   node scripts/pruefen.mjs --live <adresse>     dieselbe Prüfung gegen die Seite im Netz, dazu Titel wie in seite/index.html
//   --nur sicherheit,ablaeufe,aussehen,code       nur diese Bereiche
//   --aus <ordner>                                Messwerte und Fotos dorthin statt nach docs/pruefung (für den Durchspiel)
// Aufruf im Projektordner (mit seite/, meist auch web/ und docs/). Beim ersten Mal lädt das Skript Playwright, axe-core (dieselben
// Regeln wie pa11y) und Lighthouse nach ~/.cache/albatros-pruefen und Chromium dazu. Zeigt nie Werte von Geheimnissen.
// Ende mit 1, wenn ein Bereich rot ist, sonst 0.
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const wert = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const LIVE = wert('--live')?.replace(/\/$/, '');
const NUR = new Set((wert('--nur') ?? 'sicherheit,ablaeufe,aussehen,code').split(','));
const WURZEL = process.cwd();
const SEITE = join(WURZEL, 'seite');
const AUS = wert('--aus') ?? join(WURZEL, 'docs', 'pruefung');
const SELBST = fileURLToPath(import.meta.url);
const WIN = process.platform === 'win32';
if (!LIVE && !existsSync(join(SEITE, 'index.html'))) {
  console.error('seite/index.html fehlt: zuerst in web/ «npm run build» (outDir ../seite).');
  process.exit(2);
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

// Ergebnis: je Bereich eine Ampel (die schlechteste ihrer Punkte) und die Punkte
// hinweis: etwas, das die KI selbst tun muss (Fotos anschauen, Formular ausprobieren); ändert die Ampel nicht
const STUFE = { hinweis: -1, grün: 0, gelb: 1, rot: 2 };
const NAMEN = { sicherheit: 'Sicherheit und Recht', ablaeufe: 'Abläufe und Zugang', aussehen: 'Aussehen', code: 'Code und Tempo', live: 'Im Netz' };
const B = Object.fromEntries([...NUR, ...(LIVE ? ['live'] : [])].filter((k) => NAMEN[k]).map((k) => [k, { ampel: 'grün', punkte: [] }]));
const melde = (b, ampel, text, details) => {
  if (!B[b]) return;
  B[b].punkte.push(details?.length ? { ampel, text, details: details.slice(0, 20) } : { ampel, text });
  if (STUFE[ampel] > STUFE[B[b].ampel]) B[b].ampel = ampel;
};

const alle = (d) => (existsSync(d) ? readdirSync(d, { withFileTypes: true }) : [])
  .flatMap((e) => (['node_modules', '.git', '.astro', '.cache'].includes(e.name) ? [] : e.isDirectory() ? alle(join(d, e.name)) : [join(d, e.name)]));
const rel = (f) => relative(WURZEL, f).split(sep).join('/');
// Wie Albatros ausliefert: /a → a, a.html oder a/index.html
const datei = (p) => {
  const roh = decodeURIComponent(p.split(/[?#]/)[0]);
  if (roh.split('/').includes('..')) return null;
  for (const k of [roh, `${roh}.html`, join(roh, 'index.html')]) {
    const f = join(SEITE, k);
    if (existsSync(f) && statSync(f).isFile()) return f;
  }
  return null;
};
const pfad = (f) => `/${relative(SEITE, f).split(sep).join('/')}`.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '');
const SEITEN = alle(SEITE).filter((f) => f.endsWith('.html') && !/(^|[/\\])404\.html$/.test(f)).map(pfad)
  .sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b));
if (!SEITEN.length) SEITEN.push('/');
const IMPRESSUM = /impressum|imprint|legal|mentions-legales|note-legali/i;
const DATENSCHUTZ = /datenschutz|privacy|confidentialit|protezione/i;

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

// ---------- Aussehen (Code): nur Tokens, Hinweise auf KI-Look ----------
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
  if (!quellen.some((f) => /tokens\.css$/.test(f))) melde('aussehen', 'rot', 'web/src/styles/tokens.css fehlt');
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
const TYPEN = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = LIVE ? null : createServer((q, a) => {
  const f = datei(q.url ?? '/');
  a.writeHead(f ? 200 : 404, { 'content-type': f ? (TYPEN[extname(f).toLowerCase()] ?? 'application/octet-stream') : 'text/plain' });
  a.end(f ? readFileSync(f) : 'Nicht gefunden');
}).listen(0, '127.0.0.1');
if (server) await new Promise((r) => server.once('listening', r));
const BASIS = LIVE ?? `http://127.0.0.1:${server.address().port}`;
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
        const ok = LIVE ? (await fetch(u, { method: 'HEAD', signal: AbortSignal.timeout(10_000) }).catch(() => null))?.ok ?? false : !!datei(u.pathname);
        geprueft.set(u.pathname, ok);
        if (!ok) melde('ablaeufe', 'rot', `Toter Link auf ${p}: ${u.pathname}`);
      }
      const formulare = await page.$$eval('form', (fs) => fs.map((f) => f.getAttribute('action') ?? '(ohne action)'));
      if (formulare.length) melde('ablaeufe', 'hinweis', `${p}: ${formulare.length} Formular(e) selbst ausprobieren (absenden, Fehler, Tastatur)`, formulare);
    }
    if (B.aussehen) {
      const text = await page.innerText('body');
      const floskeln = [...new Set((text.match(FLOSKELN) ?? []).map((x) => x.toLowerCase()))];
      if (floskeln.length) melde('aussehen', 'gelb', `${p}: Floskeln (KI-Merkmal): ${floskeln.join(', ')}`);
      if (EMOJI.test(await page.$$eval('h1, h2, h3, nav, button, li', (es) => es.map((e) => e.textContent).join(' ')))) melde('aussehen', 'gelb', `${p}: Emoji in Titeln, Menü oder Listen (KI-Merkmal)`);
      mkdirSync(join(AUS, 'fotos'), { recursive: true });
      const vor = LIVE ? 'live-' : '';
      await page.screenshot({ path: join(AUS, 'fotos', `${vor}${name(p)}-390.png`), fullPage: true });
      await page.setViewportSize({ width: 1440, height: 900 });
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
server?.close();

mkdirSync(AUS, { recursive: true });
writeFileSync(join(AUS, LIVE ? 'messwerte-live.json' : 'messwerte.json'), `${JSON.stringify({ zeit: new Date().toISOString(), adresse: LIVE ?? 'seite/ (lokal)', seiten: SEITEN, bereiche: B }, null, 1)}\n`);
console.log(`\nPrüfung ${LIVE ? `im Netz (${LIVE})` : 'lokal'}, ${SEITEN.length} Seiten. Messwerte: ${rel(join(AUS, LIVE ? 'messwerte-live.json' : 'messwerte.json'))}`);
for (const [k, b] of Object.entries(B)) {
  console.log(`\n${b.ampel === 'grün' ? '🟢' : b.ampel === 'gelb' ? '🟡' : '🔴'} ${NAMEN[k]}: ${b.ampel}`);
  for (const x of b.punkte.filter((y) => y.ampel !== 'grün' || b.punkte.length <= 4)) console.log(`   ${x.ampel.padEnd(7)} ${x.text}`);
}
process.exit(Object.values(B).some((b) => b.ampel === 'rot') ? 1 : 0);
