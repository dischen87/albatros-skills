// Durchspiel-Test: Eine KI mit dem Plugin albatros bekommt nur den ersten Satz der Person (Fall curling: «Modernisiere <adresse>»,
// Fall musikverein: ein erfundener Verein will eine neue Seite), eine zweite KI spielt die Person ohne Technikwissen und beantwortet
// ihre Fragen kurz. Am Ende: Fotos vorher und nachher, Bewertung nach Raster, Kosten.
//   bun scripts/durchspiel.ts [adresse] [--fall curling|musikverein] [--runden 16] [--modell sonnet] [--budget 30] [--ergebnis <ordner>]
//   bun scripts/durchspiel.ts --auswerten <temp-ordner> <ergebnis-ordner>   (nur Fotos, Protokoll und Bewertung eines Laufs)
//   ALBATROS_MCP_TOKEN=… bun scripts/durchspiel.ts --echt --fall musikverein   (echte Plattform, nur im Workflow durchspiel von albatros)
// Mit --echt spricht die KI mit dem echten MCP von Albatros (Token der E2E-Person aus der Umgebung, nie in Dateien), mit echtem ssh,
// git und curl; die Seite geht wirklich unter <name>.aufwind.sh ins Netz. Darum dort nur erfundene Inhalte (Fall musikverein).
// Albatros ist eine Attrappe (scripts/durchspiel/mock-mcp.ts): keine Zahlung, kein Server. Der Hafen ist ein lokales Git-Repo
// (git@aufwind.sh: zeigt per insteadOf dorthin, seite_erstellen legt es unter dem gewünschten Namen an), open/xdg-open und ssh
// schreiben nur ins Protokoll, curl auf https://<name>.aufwind.sh bekommt die Seite aus dem Hafen (wie Light). Die Inhalte der Seite
// gehören ihren Betreibern: Alles bleibt lokal im Temp-Ordner und in plugins/albatros/evals/results/, nichts wird veröffentlicht.
import { appendFileSync, chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, statSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (n: string, d: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1]! : d; };
const ADRESSE = args.find((a) => a.startsWith('http')) ?? 'https://www.grindelwald-curling.ch/';
const RUNDEN = Number(opt('runden', '16')), MODELL = opt('modell', 'sonnet'), BUDGET = Number(opt('budget', '30'));
const AUSWERTEN = args.includes('--auswerten'), ECHT = args.includes('--echt'), FALL = opt('fall', 'curling');
if (ECHT && FALL !== 'musikverein') throw new Error('--echt nur mit --fall musikverein: Inhalte fremder Seiten werden nie veröffentlicht');
const repo = new URL('..', import.meta.url).pathname;
const stempel = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const ergebnis = AUSWERTEN ? resolve(args[args.indexOf('--auswerten') + 2]!) : resolve(opt('ergebnis', join(repo, 'plugins/albatros/evals/results', `durchspiel-${stempel}`)));
mkdirSync(join(ergebnis, 'fotos'), { recursive: true });

const tmp = AUSWERTEN ? resolve(args[args.indexOf('--auswerten') + 1]!) : mkdtempSync(join(tmpdir(), 'durchspiel-'));
const LOG = join(tmp, 'albatros.log'), GEOEFFNET = join(tmp, 'geoeffnet.txt'), LIVE = join(tmp, 'live.log');
const arbeit = join(tmp, 'arbeit'), HAFEN = join(tmp, 'hafen');
const ENV = { ...process.env, PATH: `${join(tmp, 'bin')}:${process.env.PATH}`, ...(ECHT ? {} : { GIT_CONFIG_GLOBAL: join(tmp, 'gitconfig') }) };
const git = (cwd: string, ...a: string[]) => Bun.spawnSync(['git', ...a], { cwd, env: ENV }).stdout.toString();
// Seite im Hafen: die von seite_erstellen (Datei hafen/seite), sonst das erste Repo ausser der Vorlage
const seiteName = () => (existsSync(join(HAFEN, 'seite')) ? readFileSync(join(HAFEN, 'seite'), 'utf8').trim() : readdirSync(HAFEN).find((d) => existsSync(join(HAFEN, d, 'projekt.git'))));

if (!AUSWERTEN) {
  // Plugin mit der Attrappe statt des echten Diensts (mit --echt: echter Dienst, Token aus der Umgebung), Arbeitsordner frisch
  cpSync(join(repo, 'plugins/albatros'), join(tmp, 'plugin'), { recursive: true, filter: (p) => !p.includes('/evals') });
  writeFileSync(join(tmp, 'plugin/.mcp.json'), JSON.stringify({ mcpServers: { albatros: ECHT
    ? { type: 'http', url: process.env.ALBATROS_MCP_URL ?? 'https://mcp.albatros.build', headers: { Authorization: 'Bearer ${ALBATROS_MCP_TOKEN}' } }
    : { command: 'bun', args: [join(repo, 'scripts/durchspiel/mock-mcp.ts')], env: { DURCHSPIEL_LOG: LOG, DURCHSPIEL_HAFEN: HAFEN } } } }));
  mkdirSync(arbeit);
  // open und xdg-open protokollieren nur (es gibt keinen Bildschirm). Ohne --echt auch ssh als Attrappe, und curl auf
  // https://<name>.aufwind.sh geht an den Webserver unten (Port 4398), alles andere ans echte curl
  mkdirSync(join(tmp, 'bin'));
  for (const n of ['open', 'xdg-open']) { writeFileSync(join(tmp, 'bin', n), `#!/bin/sh\necho "$*" >> ${GEOEFFNET}\n`); chmodSync(join(tmp, 'bin', n), 0o755); }
}
if (!AUSWERTEN && !ECHT) {
  writeFileSync(join(tmp, 'bin/ssh'), `#!/bin/sh\necho "ssh $*" >> ${LOG}\ncase "$*" in *-T*) echo "Hi $(cat ${join(HAFEN, 'seite')} 2>/dev/null || echo du)! You've successfully authenticated, but Forgejo does not provide shell access." >&2; exit 1;; esac\necho "Attrappe: kein echter Server im Durchspiel-Test"\n`);
  writeFileSync(join(tmp, 'bin/curl'), `#!/bin/sh\nfor a; do shift\n  case "$a" in\n    http*://code.aufwind.sh*) ;;\n    http*://*.aufwind.sh|http*://*.aufwind.sh/*|*.aufwind.sh|*.aufwind.sh/*) r=\${a#*://}; h=\${r%%/*}; p=\${r#"$h"}; a="http://127.0.0.1:4398\${p:-/}"; set -- "$@" -H "Host: $h";;\n  esac\n  set -- "$@" "$a"\ndone\nexec /usr/bin/curl "$@"\n`);
  for (const n of ['ssh', 'curl']) chmodSync(join(tmp, 'bin', n), 0o755);
  // Hafen: Vorlage als bare Repo, seite_erstellen kopiert sie nach hafen/<name>/projekt.git, wie flotte es anlegt
  writeFileSync(join(tmp, 'gitconfig'), `[user]\n\tname = Vorstand Curling\n\temail = vorstand@example.test\n[init]\n\tdefaultBranch = main\n[url "${HAFEN}/"]\n\tinsteadOf = git@aufwind.sh:\n`);
  mkdirSync(join(HAFEN, 'vorlage.git'), { recursive: true });
  git(join(HAFEN, 'vorlage.git'), 'init', '-q', '--bare', '-b', 'main');
  cpSync(join(repo, 'vorlage'), join(tmp, 'vorlage'), { recursive: true });
  git(join(tmp, 'vorlage'), 'init', '-q', '-b', 'main'); git(join(tmp, 'vorlage'), 'add', '-A'); git(join(tmp, 'vorlage'), 'commit', '-qm', 'Vorlage von Albatros'); git(join(tmp, 'vorlage'), 'push', '-q', join(HAFEN, 'vorlage.git'), 'main');
}

type Antwort = { result?: string; total_cost_usd?: number; num_turns?: number; duration_ms?: number; is_error?: boolean };
const claude = async (cwd: string, argv: string[], eingabe: string, minuten: number): Promise<Antwort> => {
  const p = Bun.spawn(['claude', '-p', ...argv, '--output-format', 'json', '--setting-sources', 'project'], { cwd, env: ENV, stdin: new Blob([eingabe]), stdout: 'pipe', stderr: 'pipe' });
  const zeit = setTimeout(() => p.kill(), minuten * 60_000);
  const raus = await new Response(p.stdout).text();
  clearTimeout(zeit);
  try { return JSON.parse(raus) as Antwort; } catch { return { result: `(keine Antwort: ${raus.slice(0, 300)} ${(await new Response(p.stderr).text()).slice(0, 300)})`, is_error: true }; }
};

const CURLING = `Du spielst eine Person ohne Technikwissen: Mitglied im Vorstand des Curling Club Grindelwald (Bern, Schweiz). Die Webseite ${ADRESSE} gehört dem Club; heute pflegt sie der Kassier ab und zu mit Jimdo, künftig möchtest du sie selbst pflegen, ein paar Mal pro Saison. Dir ist wichtig: das Clublogo und die Turnierausschreibungen mit den PDFs; mehr Gäste und Teams für die Turniere. Bei Albatros hast du das Abo Light schon bezahlt und deinen Schlüssel hinterlegt. Du hast keine eigenen Fotos zur Hand.
Regeln: Antworte auf Deutsch, kurz (ein bis drei Sätze), wie ein Mensch im Chat. Beantworte nur, was die KI fragt. Schlag nie selbst technische Schritte vor und sag nie, was die KI als Nächstes tun soll. Musst du wählen, wähle selbst etwas Passendes. Fragt sie nach Rechten an Texten und Bildern: Sie gehören dem Club, du bist im Vorstand. Kostet etwas Geld (zum Beispiel Bilder erzeugen), sag Ja, wenn es unter einem Franken ist. Fragt sie, ob sie weitermachen, bauen, in den Hafen schicken soll oder ob die Seite so ins Netz darf: «Ja, mach weiter, das darf so ins Netz.» Bittet sie dich, selbst eine Datei zu ändern oder etwas zu tippen: «Das traue ich mir noch nicht zu, mach du es bitte und zeig mir, was du geändert hast.» Eine eigene Domain willst du jetzt noch nicht.
Ist die Seite im Hafen und die KI meldet, dass sie unter der Adresse läuft oder dass sie fertig ist, oder fragt sie nichts mehr, antworte genau: ENDE`;
const MUSIKVEREIN = `Du spielst eine Person ohne Technikwissen: Präsidentin des Musikvereins Testdorf, eines erfundenen Vereins für einen Test. Ihr habt noch keine Webseite und möchtet eine einfache, die du selbst ein paar Mal im Jahr nachführst. Darauf soll: wer ihr seid (Blasmusik, gegründet 1923, rund 35 Mitglieder), die Probe jeden Donnerstag um 20 Uhr im Schulhaus Testdorf, das Jahreskonzert am Samstag, 13. März 2027, um 20 Uhr in der Mehrzweckhalle Testdorf (Eintritt frei, Kollekte), dass neue Mitglieder willkommen sind (alle Register, besonders Klarinette und Posaune) und Kontakt per E-Mail an info@musikverein-testdorf.example. Ihr wollt mehr junge Mitglieder und mehr Publikum. Bilder habt ihr keine. Texte schreibst du selbst, wenn die KI danach fragt: kurz, freundlich, in eigenen Worten. Bei Albatros hast du das Abo Light schon bezahlt, einen Schlüssel hast du noch nicht.
Regeln: Antworte auf Deutsch, kurz (ein bis drei Sätze), wie ein Mensch im Chat. Beantworte nur, was die KI fragt. Schlag nie selbst technische Schritte vor und sag nie, was die KI als Nächstes tun soll. Musst du wählen, wähle selbst etwas Passendes. Nenn nie echte Personen, Adressen oder Telefonnummern. Fragt die KI nach dem Namen der Adresse oder schlägt sie einen vor, antworte immer: «Nimm bitte e2e-plattform, so heisst unsere Testadresse.» Kostet etwas Geld (zum Beispiel Bilder erzeugen), sag Nein, ihr braucht keine Bilder. Fragt sie, ob sie weitermachen, bauen, in den Hafen schicken soll oder ob die Seite so ins Netz darf: «Ja, mach weiter, das darf so ins Netz.» Bittet sie dich, selbst eine Datei zu ändern oder etwas zu tippen: «Das traue ich mir noch nicht zu, mach du es bitte und zeig mir, was du geändert hast.» Eine eigene Domain willst du nicht.
Erst wenn die KI meldet, dass die Seite unter https://e2e-plattform.aufwind.sh im Netz steht, und sie dir gezeigt hat, wünschst du dir einmal eine kleine Änderung (eine Vorschau unter localhost oder die Frage, ob sie ins Netz darf, heisst noch nicht, dass sie im Netz steht): «Super! Eine Sache fehlt noch: das Frühlingskonzert am Samstag, 24. April 2027, um 19.30 Uhr in der Kirche Testdorf.» Steht auch das im Netz und die KI hat es dir gezeigt, oder fragt sie nichts mehr, antworte genau: ENDE`;
const { start: ERSTE, vorher: VORHER, person: PERSON } = FALL === 'musikverein'
  ? { start: 'Ich will eine Webseite für unseren Musikverein Testdorf.', vorher: null, person: MUSIKVEREIN }
  : { start: `Modernisiere ${ADRESSE}`, vorher: ADRESSE, person: CURLING };

type Eintrag = { wer: 'Person' | 'KI'; text: string; kosten?: number; schritte?: number; sekunden?: number };
const verlauf: Eintrag[] = AUSWERTEN ? JSON.parse(readFileSync(join(ergebnis, 'verlauf.json'), 'utf8')) : [];
let kostenPerson = 0;
if (!AUSWERTEN) {
  // Light: Was im Hafen auf main unter seite/ liegt, ist unter https://<name>.aufwind.sh zu sehen (Abrufe in live.log)
  const live = ECHT ? null : Bun.serve({ port: 4398, fetch: (r) => {
    const name = (r.headers.get('host') ?? '').split('.')[0], pfad = decodeURIComponent(new URL(r.url).pathname).replace(/^\/+|\/+$/g, '');
    const roh = (p: string) => { const x = Bun.spawnSync(['git', '--git-dir', join(HAFEN, name, 'projekt.git'), 'show', `main:seite/${p}`]); return x.exitCode === 0 && !x.stdout.toString().startsWith('tree ') ? x.stdout : null; };
    const p = name === seiteName() ? [pfad, `${pfad}/index.html`.replace(/^\//, ''), `${pfad}.html`].find((x) => x && roh(x)) : undefined;
    const status = name !== seiteName() ? 404 : p ? 200 : roh('index.html') ? 404 : 502;
    appendFileSync(LIVE, `${JSON.stringify({ zeit: new Date().toISOString(), name, pfad: `/${pfad}`, status })}\n`);
    return p ? new Response(roh(p), { headers: { 'content-type': Bun.file(p).type } }) : new Response(status === 502 ? 'Bad Gateway' : 'Nicht gefunden', { status });
  } });
  const sitzung = crypto.randomUUID();
  let nachricht = ERSTE, bisher = 0;
  for (let runde = 0; runde < RUNDEN && bisher < BUDGET; runde++) {
    verlauf.push({ wer: 'Person', text: nachricht });
    console.log(`\n[Person] ${nachricht}`);
    const a = await claude(arbeit, ['--plugin-dir', join(tmp, 'plugin'), '--model', MODELL, '--permission-mode', 'bypassPermissions',
      ...(runde === 0 ? ['--session-id', sitzung] : ['--resume', sitzung]), '--max-budget-usd', String(BUDGET)], nachricht, 45);
    // total_cost_usd zählt mit --resume über die ganze Sitzung weiter: Kosten dieser Runde = Differenz
    const kosten = Math.max(0, (a.total_cost_usd ?? bisher) - bisher);
    bisher = a.total_cost_usd ?? bisher;
    verlauf.push({ wer: 'KI', text: a.result ?? '', kosten, schritte: a.num_turns, sekunden: Math.round((a.duration_ms ?? 0) / 1000) });
    console.log(`[KI, ${a.num_turns ?? '?'} Schritte, $${kosten.toFixed(2)}, gesamt $${bisher.toFixed(2)}] ${(a.result ?? '').slice(0, 600)}`);
    writeFileSync(join(ergebnis, 'verlauf.json'), JSON.stringify(verlauf, null, 1));
    if (a.is_error && !a.result) break;
    const p = await claude(tmp, ['--model', 'haiku', '--system-prompt', PERSON, '--disable-slash-commands'],
      `Bisheriges Gespräch:\n\n${verlauf.map((v) => `${v.wer}: ${v.text}`).join('\n\n')}\n\nDeine nächste Antwort als Person (oder ENDE):`, 5);
    kostenPerson += p.total_cost_usd ?? 0;
    nachricht = (p.result ?? 'Ja, mach weiter.').trim();
    if (/^ENDE\b/.test(nachricht)) { verlauf.push({ wer: 'Person', text: 'ENDE' }); break; }
  }
  live?.stop(true);
}
// Vorschau-Server und andere Reste der KI im Arbeitsordner beenden (RAM)
Bun.spawnSync(['pkill', '-f', `${arbeit}/`]);

// Fotos vorher (alte Seite) und nachher (gebaute Seite, über einen kleinen lokalen Webserver)
const suche = (d: string, tiefe = 0): string | null => {
  if (tiefe > 4 || !existsSync(d)) return null;
  if (existsSync(join(d, 'seite/index.html'))) return join(d, 'seite');
  for (const e of readdirSync(d, { withFileTypes: true })) if (e.isDirectory() && !['node_modules', '.git', 'docs'].includes(e.name)) { const t = suche(join(d, e.name), tiefe + 1); if (t) return t; }
  return null;
};
const seite = suche(arbeit);
// Nicht mit spawnSync: Der Webserver für die Fotos läuft im selben Prozess und muss antworten können
const foto = async (url: string, datei: string, breite: number) => {
  const p = Bun.spawn(['npx', '-y', 'playwright', 'screenshot', `--viewport-size=${breite},${breite < 800 ? 844 : 900}`, '--full-page', url, join(ergebnis, 'fotos', datei)], { stdout: 'ignore', stderr: 'ignore' });
  const zeit = setTimeout(() => p.kill(), 120_000);
  await p.exited;
  clearTimeout(zeit);
};
if (VORHER) for (const b of [390, 1440]) if (!existsSync(join(ergebnis, 'fotos', `vorher-start-${b}.png`))) await foto(VORHER, `vorher-start-${b}.png`, b);
if (seite) {
  const datei = (p: string) => [join(seite, p), join(seite, p, 'index.html'), join(seite, `${p}.html`)].find((x) => existsSync(x) && statSync(x).isFile());
  const server = Bun.serve({ port: 4399, fetch: (r) => { const f = datei(decodeURIComponent(new URL(r.url).pathname)); return f ? new Response(Bun.file(f)) : new Response('nicht gefunden', { status: 404 }); } });
  for (const b of [390, 1440]) await foto('http://localhost:4399/', `nachher-start-${b}.png`, b);
  server.stop(true);
}

// Bewertung nach Raster: Protokolle (Albatros, geöffnete Adressen, Hafen), maschinelle Prüfung des Codes, dann ein Richter
const code = seite ? Bun.spawnSync(['grep', '-rnoE', 'linear-gradient|radial-gradient|font-family:[^;]*Inter|[✨🚀🎉💡🔥⭐✅👉🏆🥌]', seite]).stdout.toString().split('\n').filter(Boolean).slice(0, 40) : [];
const lies = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
// Maschinell wie Schritt 7 von webseite-bauen: Zugang (axe) und JavaScript, Lighthouse, Bilder, mit pruefen.mjs auf der gebauten Seite.
// Asynchron, nie spawnSync: das würde den Server der Attrappe blockieren. Ergebnis neben die Bewertung, nicht in die Arbeit der KI.
const maschinell = seite ? await (async () => {
  const aus = join(ergebnis, 'maschinell');
  await Bun.spawn(['node', join(import.meta.dir, '..', 'plugins/albatros/skills/webseite-bauen/pruefen.mjs'), '--nur', 'ablaeufe,code', '--aus', aus],
    { cwd: join(seite, '..'), stdout: 'ignore', stderr: 'ignore' }).exited;
  const m = existsSync(join(aus, 'messwerte.json')) ? JSON.parse(lies(join(aus, 'messwerte.json'))) as { bereiche: Record<string, { ampel: string; punkte: { ampel: string; text: string }[] }> } : null;
  return m ? Object.fromEntries(Object.entries(m.bereiche).map(([k, b]) => [k, { ampel: b.ampel, punkte: b.punkte.filter((x) => x.ampel !== 'hinweis').map((x) => `${x.ampel}: ${x.text}`).slice(0, 15) }])) : null;
})() : null;
// Aufrufe der Albatros-Werkzeuge aus dem Transkript der KI (Claude Code legt es nach dem Arbeitsordner benannt ab)
const transkripte = join(homedir(), '.claude/projects', realpathSync(arbeit).replace(/[^a-zA-Z0-9]/g, '-'));
const meldungen = (existsSync(transkripte) ? readdirSync(transkripte).filter((f) => f.endsWith('.jsonl')) : []).flatMap((f) => lies(join(transkripte, f)).split('\n'))
  .flatMap((z) => { try { return (JSON.parse(z) as { message?: { content?: { type: string; name?: string; input?: Record<string, string> }[] } }).message?.content ?? []; } catch { return []; } })
  .filter((c) => c.type === 'tool_use' && c.name?.startsWith('mcp__plugin_albatros_albatros__'))
  .map((c) => ({ werkzeug: c.name!.replace('mcp__plugin_albatros_albatros__', ''), argumente: c.input ?? {} }));
// Welche Skills die KI geladen hat (Werkzeug Skill), in Reihenfolge
const geladen = (existsSync(transkripte) ? readdirSync(transkripte).filter((f) => f.endsWith('.jsonl')) : []).flatMap((f) => lies(join(transkripte, f)).split('\n'))
  .flatMap((z) => { try { return (JSON.parse(z) as { message?: { content?: { type: string; name?: string; input?: { skill?: string } }[] } }).message?.content ?? []; } catch { return []; } })
  .filter((c) => c.type === 'tool_use' && c.name === 'Skill' && c.input?.skill).map((c) => c.input!.skill!.replace(/^[\w-]+:/, ''));
const name = meldungen.findLast((m) => m.werkzeug === 'seite_erstellen')?.argumente.name ?? (ECHT ? null : seiteName() ?? null);
// Mit --echt: Steht unter https://<name>.aufwind.sh wirklich die gebaute Seite (gleicher Titel)? Dann Fotos der Seite im Netz
const titel = (html: string) => /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? null;
const live_pruefung = ECHT && name ? await (async () => {
  const r = await fetch(`https://${name}.aufwind.sh/`, { signal: AbortSignal.timeout(15_000) }).catch(() => null);
  const t = r?.ok ? titel(await r.text()) : null;
  const gebaut = seite ? titel(lies(join(seite, 'index.html'))) : null;
  if (r?.ok) for (const b of [390, 1440]) await foto(`https://${name}.aufwind.sh/`, `live-start-${b}.png`, b);
  return { adresse: `https://${name}.aufwind.sh/`, status: r?.status ?? null, titel_live: t, titel_gebaut: gebaut, gleich: !!t && t === gebaut };
})() : null;
// Einträge im Hafen: mit --echt aus dem Klon der KI (Remote git@aufwind.sh:…), sonst aus dem lokalen Hafen
const klon = ECHT ? Bun.spawnSync(['find', arbeit, '-maxdepth', '3', '-name', '.git', '-type', 'd']).stdout.toString().split('\n').filter(Boolean)
  .map((g) => join(g, '..')).find((d) => git(d, 'remote', 'get-url', 'origin').includes('aufwind.sh')) : undefined;
const protokoll = {
  schritte: meldungen.filter((m) => m.werkzeug === 'schritt_melden').map((m) => m.argumente.schritt),
  werkzeuge: meldungen.map((m) => m.werkzeug),
  skills: geladen,
  geoeffnet: lies(GEOEFFNET).split('\n').filter(Boolean),
  seite: name,
  hafen: (klon ? git(klon, 'log', '--oneline', '--stat', 'origin/main') : !ECHT && name ? git(join(HAFEN, name, 'projekt.git'), 'log', '--oneline', '--stat', 'main') : '').slice(0, 3000),
  live_abrufe: lies(LIVE).split('\n').filter(Boolean).map((z) => JSON.parse(z) as { name: string; pfad: string; status: number }),
  live_pruefung,
};
writeFileSync(join(ergebnis, 'protokoll.json'), JSON.stringify(protokoll, null, 1));
writeFileSync(join(ergebnis, 'verlauf.md'), verlauf.map((v) => `### ${v.wer}${v.wer === 'KI' ? ` (${v.schritte} Schritte, ${v.sekunden} s, $${(v.kosten ?? 0).toFixed(2)})` : ''}\n\n${v.text}\n`).join('\n'));
const RASTER = `Bewerte einen Durchspiel-Test (Fall ${FALL}${ECHT ? ', gegen die echte Plattform' : ', Albatros als Attrappe'}). Erster Satz der Person: «${ERSTE}». Im Ordner liegen die Arbeit der KI (docs/bestand.md nur beim Modernisieren, sonst kommen die Funktionen aus docs/plan.md; docs/plan.md, docs/mockup.html, docs/gestaltung/, docs/prd.md, die gebaute Seite unter ${seite ?? '(keine gebaute Seite gefunden)'}) und der Gesprächsverlauf ${join(ergebnis, 'verlauf.md')}. Protokoll (gemeldete Schritte an die Insel in Reihenfolge, aufgerufene Albatros-Werkzeuge, im Browser geöffnete Adressen, Einträge im Hafen; ob das PRD vor dem Bau abgenommen war, zeigt der Verlauf, denn nach dem Bau trägt die KI im PRD nach, wo jede Funktion steht): ${JSON.stringify(protokoll)}. Maschinell gefundene Treffer für KI-Merkmale im gebauten Code: ${JSON.stringify(code)}. Maschinelle Prüfung der gebauten Seite mit pruefen.mjs (Zugang nach WCAG mit axe, tote Links, JavaScript je Seite, Lighthouse, Bilder): ${JSON.stringify(maschinell)}.
Die feste Reihenfolge (Skill webseite-bauen, die kleine Fabrik) ist: Auftrag (plan.md oder bestand.md), mockup, entwuerfe (2-3 Entwürfe, daraus docs/designsystem.md und web/src/styles/tokens.css), Tech-Stack (docs/stack.md: Astro mit Grund und JavaScript-Budget ≤ 50 KB je Seite; ein anderes Framework nur auf Wunsch der Person oder wegen einer Funktion), prd (docs/prd.md mit prüfbaren Abnahmekriterien als Checkliste, «Abgenommen:» vor dem Bau, mit Ja der Person), lokal, Prüfung (scripts/pruefen.mjs gelaufen, docs/pruefung/messwerte.json und vier Berichte sicherheit.md, ablaeufe.md, aussehen.md, code.md mit Ampel in einfachen Worten, Abnahmekriterien abgehakt), Freigabe (die Person sagt Ja nach den Berichten, dann «Freigegeben:» in docs/prd.md, vor dem Push), hafen (Push und Hafen im Browser geöffnet), fliessband, live (danach pruefen.mjs --live). Tech-Stack, Prüfung und Freigabe sind keine Schritte auf der Insel. Was die Person sehen soll (Insel, Mockup, Entwürfe, Vorschau, Hafen, Seite), soll die KI mit open öffnen (geoeffnet). Mit Light ist die Seite kurz nach dem Push unter https://<name>.aufwind.sh erreichbar (live_abrufe: Abrufe der KI mit Status). Die KI soll selbst nachschauen, bis sie erreichbar ist, und die Person nicht warten lassen. Der Name der Seite soll der sein, den die Person wollte. ${ECHT ? 'live_pruefung zeigt, ob unter der Adresse wirklich der Titel der gebauten Seite steht; die Fotos fotos/live-* zeigen die Seite im Netz.' : ''}
Prüf mit Lesen (Read, Glob, Grep) und antworte NUR mit JSON:
{"bestand_vorhanden": bool|null, "funktionen": [{"funktion": str, "im_bestand": bool, "auf_neuer_seite": bool, "entscheid_der_person": str|null}], "frage_eigenschaften": {"gestellt": bool, "zitat": str}, "frage_gestaltungselemente": {"gestellt": bool, "zitat": str}, "ki_merkmale": [str], "person_musste_nichts_wissen": {"ok": bool, "beleg": str}, "reihenfolge": {"ok": bool, "ist": [str], "abweichungen": [str]}, "prd_vor_bau": {"ok": bool, "beleg": str}, "insel": {"geoeffnet": bool, "alle_schritte_gemeldet": bool, "fehlend": [str]}, "hafen": {"gepusht": bool, "im_browser_geoeffnet": bool}, "live": {"selbst_geprueft": bool, "erreicht": bool, "person_warten_lassen": bool, "name_wie_gewuenscht": bool}, "designsystem": {"datei": bool, "nur_tokens": bool, "beleg": str}, "stack": {"datei": bool, "entscheid": str, "grund_ok": bool, "js_budget": bool}, "abnahmekriterien": {"vorhanden": bool, "pruefbar": bool, "anzahl": int, "abgehakt_nach_pruefung": bool, "beleg": str}, "pruefberichte": {"vorhanden": [str], "ampeln": {"sicherheit": str|null, "ablaeufe": str|null, "aussehen": str|null, "code": str|null}, "messwerte_gelaufen": bool, "einfach_erklaert": bool, "rot_vor_freigabe_behoben": bool}, "freigabe_vor_push": {"ok": bool, "beleg": str}, "aenderung": {"gewuenscht": bool, "skill_webseite_aendern": bool, "docs_gelesen": bool, "im_prd": bool, "nur_designsystem": bool, "vorher_nachher_gezeigt": bool, "freigabe_vor_push": bool, "im_netz": bool, "beleg": str}|null, "maschinell": {"zugang_ok": bool, "js_budget_ok": bool, "lighthouse_ok": bool, "befunde": [str]}, "seite_gebaut": bool, "haengen_geblieben": [str], "kurzurteil": str}
Wünscht die Person nach dem Live-Gang eine Änderung, gilt für sie der Skill webseite-aendern (protokoll.skills): Hafen holen, zuerst docs/ lesen (Designsystem, Stack, PRD), die Änderung nur mit Werten aus dem Designsystem und Termine in web/src/data, als Abnahmekriterium unter «Änderungen» in docs/prd.md, bauen, pruefen.mjs, vorher und nachher zeigen, Freigabe, dann Push und selbst im Netz nachschauen; ohne Änderungswunsch ist «aenderung» null. «person_musste_nichts_wissen» ist nur ok, wenn die Person nie selbst einen nächsten Schritt vorschlagen oder Technik erklären musste. Eine Funktion gilt als vorhanden, wenn die neue Seite sie zeigt oder ersetzt; fällt sie weg, braucht es einen Entscheid der Person im Verlauf.`;
const urteil = await claude(arbeit, ['--model', 'sonnet', '--allowedTools', 'Read,Glob,Grep', '--add-dir', ergebnis], RASTER, 15);
const json = (urteil.result ?? '').match(/\{[\s\S]*\}/)?.[0] ?? '{}';
writeFileSync(join(ergebnis, 'bewertung.json'), json);
for (const f of Bun.spawnSync(['find', arbeit, '-path', '*/docs/*', '-maxdepth', '4', '(', '-name', 'bestand.md', '-o', '-name', 'plan.md', '-o', '-name', 'prd.md', '-o', '-name', 'richtungen.md', '-o', '-name', 'mockup.html', '-o', '-name', 'designsystem.md', '-o', '-name', 'stack.md', '-o', '-path', '*/docs/pruefung/*.md', ')']).stdout.toString().split('\n').filter(Boolean)) cpSync(f, join(ergebnis, f.split('/').pop()!));
const kostenKI = verlauf.reduce((s, v) => s + (v.wer === 'KI' ? v.kosten ?? 0 : 0), 0);
if (AUSWERTEN && existsSync(join(ergebnis, 'kosten.json'))) kostenPerson = JSON.parse(readFileSync(join(ergebnis, 'kosten.json'), 'utf8')).person ?? 0;
const kosten = { ki: +kostenKI.toFixed(2), person: +kostenPerson.toFixed(2), richter: +(urteil.total_cost_usd ?? 0).toFixed(2), runden: verlauf.filter((v) => v.wer === 'KI').length, arbeitsordner: arbeit };
writeFileSync(join(ergebnis, 'kosten.json'), JSON.stringify(kosten, null, 1));
console.log(`\nErgebnis: ${ergebnis}\nKosten: ${JSON.stringify(kosten)}\nBewertung: ${json.slice(0, 1500)}`);
