// Durchspiel-Test nach dem Fahrplan (fahrplan.yaml, Phasen P1 bis P13): Eine KI mit dem Plugin albatros bekommt nur den ersten Satz einer
// Person (scripts/durchspiel/personen.ts), eine zweite KI spielt die Person ohne Technikwissen. Die Person weiss Dinge, die die KI über
// mehrere Runden erfragen muss (verdeckte Tatsachen: Projektname, Zielgruppe, Maskottchen ja oder nein …). Nach jeder Runde hält der Test
// die Ergebnisdateien fest; Punkte und Exit-Code kommen nur aus deterministischen Feldern (scripts/punkte.ts). Ein Richter (Modell) bewertet
// danach, was keine Maschine zählen kann: Sein Urteil steht in bewertung.json und zählt nie für den Exit-Code. Je Lauf eine Zeile im Verlauf
// (scripts/verlauf.ts, scripts/durchspiel/verlauf.jsonl), ohne Inhalte.
//   bun scripts/durchspiel.ts [--fall knapp] [--bis P4] [--runden 80] [--modell sonnet] [--budget 30] [--stand HEAD] [--ergebnis <ordner>]
//                             [--ohne-richter] [--verlauf <datei>|aus] [adresse (nur Fall curling)]
//   bun scripts/durchspiel.ts --trocken scripts/durchspiel/beispiele/gut-lernen.json [--ergebnis <ordner>] [--behalten]   ohne Modell
//   bun scripts/durchspiel.ts --auswerten <temp-ordner> <ergebnis-ordner>   Punkte, Fotos, Protokoll und Richter eines Laufs nochmals
//   ALBATROS_MCP_TOKEN=… bun scripts/durchspiel.ts --echt --fall musikverein   echte Plattform, nur im Workflow durchspiel von albatros
// Exit wie scripts/punkte.ts: 0 alles eingehalten, 1 etwas verletzt, 2 nicht auswertbar oder der Kern der Persona kam nie vor.
// --trocken spielt einen aufgezeichneten Verlauf ab (Format von lauf.json): Statt der KI schreibt der Test die Dateien jeder Runde, ruft
// die Werkzeuge der Attrappe und öffnet, was die KI öffnete; statt der Person kommen ihre aufgezeichneten Nachrichten. So laufen
// Attrappe, Protokolle, Zustände, Punkte und Exit-Code wie in einem echten Lauf, ohne Modell. Kein Webserver, kein Port.
// Mit --echt spricht die KI mit dem echten MCP von Albatros (Token der E2E-Person aus der Umgebung, nie in Dateien), mit echtem ssh, git und
// curl; die Seite geht wirklich unter <name>.aufwind.sh ins Netz. Darum dort nur Personen mit erfundenen Inhalten (echt: true).
// Sonst ist Albatros eine Attrappe (scripts/durchspiel/mock-mcp.ts, mit FAHRPLAN und ERFASSUNG wie das Ziel): keine Zahlung, kein Server.
// Der Hafen ist ein lokales Git-Repo (git@aufwind.sh: zeigt per insteadOf dorthin, seite_erstellen legt es unter dem gewünschten Namen
// an), open/xdg-open und ssh schreiben nur ins Protokoll, curl auf https://<name>.aufwind.sh bekommt die Seite aus dem Hafen (wie Light).
// Die Inhalte der Seite gehören ihren Betreibern: Alles bleibt lokal im Temp-Ordner und in plugins/albatros/evals/results/. Ohne --echt
// ausserdem: scp, rsync (zum Server) und ssh-keygen nur ins Protokoll, sendmail schreibt Mails nach mails.log, Bausteine und Dateien von
// albatros-skills auf GitHub kommen aus diesem Repo (Stand der Skills im Lauf). Mit Pilot (Fall buchung) gibt die Seite /api/ an das
// PocketBase weiter, das die KI lokal auf Port 8090 laufen lässt. Nach dem Lauf startet ein frisches PocketBase mit den Migrationen der
// KI (Probe), und der Richter prüft das Buchungstool im Browser.
import { appendFileSync, chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { PERSONEN, rolle } from './durchspiel/personen.ts';
import { ladeFahrplan, type Fahrplan } from './fahrplan.ts';
import { bericht, phaseIndex, punkte, type Aufruf, type Geoeffnet, type Lauf, type Punkte, type Zustand } from './punkte.ts';
import { anhaengen, zeileAus } from './verlauf.ts';

const args = process.argv.slice(2);
const opt = (n: string, d: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1]! : d; };
const AUSWERTEN = args.includes('--auswerten'), ECHT = args.includes('--echt'), TROCKEN = args.includes('--trocken');
const repo = new URL('..', import.meta.url).pathname;
type Beispiel = Lauf & { ordner?: string; erwartet?: { exit: number; nein?: string[] } };
const beispiel: Beispiel | null = TROCKEN ? JSON.parse(readFileSync(resolve(opt('trocken', '')), 'utf8')) : null;
const ADRESSE = args.find((a) => a.startsWith('http')) ?? 'https://www.grindelwald-curling.ch/';
const stempel = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const ergebnis = AUSWERTEN ? resolve(args[args.indexOf('--auswerten') + 2]!) : resolve(opt('ergebnis', join(repo, 'plugins/albatros/evals/results', `durchspiel-${stempel}`)));
// Fall und Phasen eines früheren Laufs (meta.json, beim Start geschrieben) für --auswerten
const frueher: { fall?: string; bis?: string } = AUSWERTEN && existsSync(join(ergebnis, 'meta.json')) ? JSON.parse(readFileSync(join(ergebnis, 'meta.json'), 'utf8')) : {};
const FALL = beispiel?.fall ?? opt('fall', frueher.fall ?? (args.some((a) => a.startsWith('http')) ? 'curling' : 'knapp'));
const persona = PERSONEN[FALL];
if (!persona) throw new Error(`Unbekannter Fall ${FALL}. Es gibt: ${Object.keys(PERSONEN).join(', ')}`);
if (ECHT && (!persona.echt || TROCKEN)) throw new Error(`--echt nur mit einer Person aus erfundenen Inhalten (${Object.values(PERSONEN).filter((p) => p.echt).map((p) => p.id).join(', ')}) und nie mit --trocken: Inhalte fremder Seiten werden nie veröffentlicht`);
const RUNDEN = Number(opt('runden', '80')), MODELL = opt('modell', 'sonnet'), BUDGET = Number(opt('budget', '30'));
const BIS = opt('bis', beispiel?.bis ?? frueher.bis ?? persona.bis);
const RICHTER = !TROCKEN && !args.includes('--ohne-richter');
mkdirSync(join(ergebnis, 'fotos'), { recursive: true });
if (!AUSWERTEN) writeFileSync(join(ergebnis, 'meta.json'), JSON.stringify({ fall: FALL, bis: BIS, echt: ECHT, trocken: TROCKEN, modell: TROCKEN ? null : MODELL, runden: RUNDEN, budget: BUDGET }));

const tmp = AUSWERTEN ? resolve(args[args.indexOf('--auswerten') + 1]!) : mkdtempSync(join(tmpdir(), 'durchspiel-'));
const LOG = join(tmp, 'albatros.log'), GEOEFFNET = join(tmp, 'geoeffnet.txt'), LIVE = join(tmp, 'live.log'), MAILS = join(tmp, 'mails.log'), RUNDE = join(tmp, 'runde');
const arbeit = join(tmp, 'arbeit'), HAFEN = join(tmp, 'hafen'), STAND = join(tmp, 'stand');
const ENV = { ...process.env, PATH: `${join(tmp, 'bin')}:${process.env.PATH}`, ...(ECHT ? {} : { GIT_CONFIG_GLOBAL: join(tmp, 'gitconfig') }) };
const git = (cwd: string, ...a: string[]) => Bun.spawnSync(['git', ...a], { cwd, env: ENV }).stdout.toString();
const lies = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
// Seite im Hafen: die von seite_erstellen (Datei hafen/seite), sonst das erste Repo ausser der Vorlage
const seiteName = () => (existsSync(join(HAFEN, 'seite')) ? readFileSync(join(HAFEN, 'seite'), 'utf8').trim() : existsSync(HAFEN) ? readdirSync(HAFEN).find((d) => existsSync(join(HAFEN, d, 'projekt.git'))) : undefined);
// Umgebung der Attrappe, für .mcp.json und --trocken
const ATTRAPPE = {
  DURCHSPIEL_LOG: LOG, DURCHSPIEL_HAFEN: HAFEN, DURCHSPIEL_FALL: FALL, DURCHSPIEL_STAND: STAND, DURCHSPIEL_RUNDE: RUNDE,
  DURCHSPIEL_STUFE: persona.stufe, DURCHSPIEL_SCHLOESSER: String(persona.schloesser),
  ...(process.env.DURCHSPIEL_METHODEN ? { DURCHSPIEL_METHODEN: process.env.DURCHSPIEL_METHODEN } : {}),
};

if (!AUSWERTEN) {
  // Stand von Skills, Fahrplan, Missionen, Bausteinen und Vorlage: ein Commit (--stand, Standard HEAD), nie halbfertige Änderungen anderer Sessions
  mkdirSync(STAND);
  const archiv = Bun.spawnSync(['sh', '-c', `git -C '${repo}' archive '${opt('stand', 'HEAD')}' plugins/albatros bausteine vorlage fahrplan.yaml missionen | tar -x -C '${STAND}'`]);
  if (archiv.exitCode !== 0 || !existsSync(join(STAND, 'fahrplan.yaml'))) throw new Error(`Stand ${opt('stand', 'HEAD')}: git archive ohne fahrplan.yaml (${archiv.stderr.toString().slice(0, 300)})`);
  writeFileSync(join(tmp, 'stand.txt'), git(repo, 'rev-parse', '--short', opt('stand', 'HEAD')).trim());
  cpSync(join(STAND, 'plugins/albatros'), join(tmp, 'plugin'), { recursive: true, filter: (p) => !p.includes('/evals') });
  writeFileSync(join(tmp, 'plugin/.mcp.json'), JSON.stringify({ mcpServers: { albatros: ECHT
    ? { type: 'http', url: process.env.ALBATROS_MCP_URL ?? 'https://mcp.albatros.build', headers: { Authorization: 'Bearer ${ALBATROS_MCP_TOKEN}' } }
    : { command: 'bun', args: [join(repo, 'scripts/durchspiel/mock-mcp.ts')], env: ATTRAPPE } } }));
  mkdirSync(arbeit);
  writeFileSync(RUNDE, '0');
  // open und xdg-open protokollieren nur, mit der Runde (es gibt keinen Bildschirm). Ohne --echt auch ssh als Attrappe, und curl auf
  // https://<name>.aufwind.sh geht an den Webserver unten (Port 4398), alles andere ans echte curl. node bekommt die Adresse als
  // http://<name>.localhost:4398, damit pruefen.mjs --live (Chromium, Lighthouse, fetch) auch dort landet und nie bei aufwind.sh
  mkdirSync(join(tmp, 'bin'));
  for (const n of ['open', 'xdg-open']) { writeFileSync(join(tmp, 'bin', n), `#!/bin/sh\necho "$(cat ${RUNDE} 2>/dev/null || echo 0) $*" >> ${GEOEFFNET}\n`); chmodSync(join(tmp, 'bin', n), 0o755); }
}
if (!AUSWERTEN && !ECHT) {
  writeFileSync(join(tmp, 'bin/ssh'), `#!/bin/sh\necho "ssh $*" >> ${LOG}\ncase "$*" in *-T*) echo "Hi $(cat ${join(HAFEN, 'seite')} 2>/dev/null || echo du)! You've successfully authenticated, but Forgejo does not provide shell access." >&2; exit 1;; esac\necho "Attrappe: kein echter Server im Durchspiel-Test"\n`);
  writeFileSync(join(tmp, 'bin/curl'), `#!/bin/sh\nfor a; do shift\n  case "$a" in\n    http*://code.aufwind.sh*) ;;\n    http*://*.aufwind.sh|http*://*.aufwind.sh/*|*.aufwind.sh|*.aufwind.sh/*) r=\${a#*://}; h=\${r%%/*}; p=\${r#"$h"}; a="http://127.0.0.1:4398\${p:-/}"; set -- "$@" -H "Host: $h";;\n    http*://codeload.github.com/dischen87/albatros-skills/*) a="file://${join(tmp, 'albatros-skills-main.tar.gz')}";;\n    http*://raw.githubusercontent.com/dischen87/albatros-skills/main/*) a="file://${STAND}/\${a#*/albatros-skills/main/}";;\n  esac\n  set -- "$@" "$a"\ndone\nexec /usr/bin/curl "$@"\n`);
  writeFileSync(join(tmp, 'bin/node'), `#!/bin/sh\nfor a; do shift\n  case "$a" in\n    http*://code.aufwind.sh*) ;;\n    http*://*.aufwind.sh|http*://*.aufwind.sh/*) r=\${a#*://}; h=\${r%%/*}; a="http://\${h%.aufwind.sh}.localhost:4398\${r#"$h"}";;\n  esac\n  set -- "$@" "$a"\ndone\nexec ${Bun.which('node') ?? 'node'} "$@"\n`);
  // Zum Server nur ins Protokoll, lokal kopieren (ohne «host:») geht weiter; nie ein neuer Schlüssel im echten ~/.ssh; Mails nur in mails.log
  for (const n of ['scp', 'rsync']) writeFileSync(join(tmp, 'bin', n), `#!/bin/sh\ncase "$*" in\n  *:*) echo "${n} $*" >> ${LOG}; echo "Attrappe: kein echter Server im Durchspiel-Test";;\n  *) exec /usr/bin/${n} "$@";;\nesac\n`);
  writeFileSync(join(tmp, 'bin/ssh-keygen'), `#!/bin/sh\necho "ssh-keygen $*" >> ${LOG}\necho "Attrappe: Im Durchspiel-Test entsteht kein neuer Schlüssel, das Schloss ist bei Albatros schon hinterlegt."\n`);
  writeFileSync(join(tmp, 'bin/sendmail'), `#!/bin/sh\n{ echo "--- sendmail $*"; cat; echo; } >> ${MAILS}\n`);
  for (const n of ['ssh', 'curl', 'node', 'scp', 'rsync', 'ssh-keygen', 'sendmail']) chmodSync(join(tmp, 'bin', n), 0o755);
  // Bausteine und Dateien von albatros-skills aus diesem Repo statt von GitHub (aufgebaut wie codeload: albatros-skills-main/…)
  Bun.spawnSync(['tar', '-czf', join(tmp, 'albatros-skills-main.tar.gz'), '-s', ',^,albatros-skills-main/,', '--exclude', 'node_modules', '-C', STAND, 'bausteine', 'vorlage', 'plugins/albatros/skills']);
  // Hafen: Vorlage als bare Repo, seite_erstellen kopiert sie nach hafen/<name>/projekt.git, wie flotte es anlegt
  writeFileSync(join(tmp, 'gitconfig'), `[user]\n\tname = ${persona.name}\n\temail = person@example.test\n[init]\n\tdefaultBranch = main\n[url "${HAFEN}/"]\n\tinsteadOf = git@aufwind.sh:\n`);
  mkdirSync(join(HAFEN, 'vorlage.git'), { recursive: true });
  git(join(HAFEN, 'vorlage.git'), 'init', '-q', '--bare', '-b', 'main');
  cpSync(join(STAND, 'vorlage'), join(tmp, 'vorlage'), { recursive: true });
  git(join(tmp, 'vorlage'), 'init', '-q', '-b', 'main'); git(join(tmp, 'vorlage'), 'add', '-A'); git(join(tmp, 'vorlage'), 'commit', '-qm', 'Vorlage von Albatros'); git(join(tmp, 'vorlage'), 'push', '-q', join(HAFEN, 'vorlage.git'), 'main');
}

// Fahrplan im Stand des Laufs (für --auswerten liegt er auch neben den Ergebnissen)
const geladen = await ladeFahrplan(existsSync(join(STAND, 'fahrplan.yaml')) ? `${STAND}/` : existsSync(join(ergebnis, 'fahrplan.yaml')) ? `${ergebnis}/` : repo);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const F: Fahrplan = geladen.fahrplan;
if (phaseIndex(F, BIS) < 0) throw new Error(`--bis ${BIS}: keine Phase im Fahrplan`);
if (existsSync(join(STAND, 'fahrplan.yaml'))) cpSync(join(STAND, 'fahrplan.yaml'), join(ergebnis, 'fahrplan.yaml'));
const ERSTE = (beispiel?.nachrichten[0]?.text ?? persona.erste).replaceAll('{adresse}', ADRESSE);

// ———— Zustand nach jeder Runde: Ergebnisdateien im Projektordner und ob gebaut ist ————
const alle = (d: string, tiefe = 0): string[] => (tiefe > 6 || !existsSync(d) || !statSync(d).isDirectory() ? [] : readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (['node_modules', '.git', '.astro', '.cache'].includes(e.name) ? [] : e.isDirectory() ? alle(join(d, e.name), tiefe + 1) : [join(d, e.name)])));
// Der Ordner mit docs/projekt.md (die KI legt ihn nach dem Projektnamen an), sonst der Arbeitsordner
const projektOrdner = (d = arbeit, tiefe = 0): string | null => {
  if (!existsSync(d)) return null;
  if (existsSync(join(d, 'docs/projekt.md'))) return d;
  if (tiefe < 3) for (const e of readdirSync(d, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith('.') || e.name === 'node_modules') continue;
    const t = projektOrdner(join(d, e.name), tiefe + 1);
    if (t) return t;
  }
  return tiefe === 0 ? d : null;
};
const VERFOLGT = [...new Set(F.phasen.flatMap((p) => p.ergebnis.map((e) => e.datei)))];
const vorlageIndex = lies(join(STAND, 'vorlage/seite/index.html'));
// Gebaut: Quellen in web/ oder eine Seite in seite/, die nicht nur die Vorlage aus dem Hafen ist
const istGebaut = (wo: string) => {
  const seite = alle(join(wo, 'seite'));
  const nurVorlage = seite.length === 1 && seite[0] === join(wo, 'seite/index.html') && lies(seite[0]) === vorlageIndex;
  return alle(join(wo, 'web')).length > 0 || (seite.length > 0 && !nurVorlage);
};
const text = (d: string) => /\.(md|txt)$/.test(d);
const zustand = (runde: number): Zustand => {
  const wo = projektOrdner() ?? arbeit;
  const dateien: Record<string, string | true> = {};
  for (const d of new Set([...VERFOLGT, ...alle(join(wo, 'docs')).map((f) => relative(wo, f)).filter(text)])) {
    const f = join(wo, d);
    if (existsSync(f) && statSync(f).isFile()) dateien[d] = text(d) && statSync(f).size <= 200_000 ? readFileSync(f, 'utf8') : true;
  }
  return { runde, dateien, gebaut: istGebaut(wo) };
};

// ———— Werkzeugaufrufe und Geöffnetes, mit Runde ————
type Runde = { start: string; ende: string };
const rundenZeit: Runde[] = AUSWERTEN && existsSync(join(ergebnis, 'runden.json')) ? JSON.parse(lies(join(ergebnis, 'runden.json'))) : [];
const rundeZu = (zeit: string) => Math.max(0, rundenZeit.findLastIndex((r) => r.start <= zeit));
// Attrappe: ihr Protokoll (jede Zeile JSON mit Runde); mit --echt: das Transkript von Claude Code (nach dem Arbeitsordner benannt)
const transkripte = () => {
  const d = join(homedir(), '.claude/projects', (existsSync(arbeit) ? realpathSync(arbeit) : arbeit).replace(/[^a-zA-Z0-9]/g, '-'));
  return existsSync(d) ? readdirSync(d).filter((f) => f.endsWith('.jsonl')).map((f) => join(d, f)) : [];
};
type Teil = { type: string; id?: string; name?: string; input?: Record<string, unknown>; tool_use_id?: string; is_error?: boolean; content?: string | { text?: string }[] };
const ausTranskript = () => {
  const aufrufe: (Aufruf & { id: string })[] = [];
  const fehler = new Set<string>();
  for (const z of transkripte().flatMap((f) => lies(f).split('\n'))) {
    let x: { timestamp?: string; message?: { content?: Teil[] | string } };
    try { x = JSON.parse(z); } catch { continue; }
    if (!Array.isArray(x.message?.content)) continue;
    for (const c of x.message.content) {
      if (c.type === 'tool_use' && c.name?.startsWith('mcp__plugin_albatros_albatros__')) {
        aufrufe.push({ id: c.id ?? '', runde: rundeZu(x.timestamp ?? ''), werkzeug: c.name.replace('mcp__plugin_albatros_albatros__', ''), argumente: c.input ?? {} });
      }
      if (c.type === 'tool_result' && c.is_error && c.tool_use_id) fehler.add(c.tool_use_id);
    }
  }
  return aufrufe.map(({ id, ...a }) => (fehler.has(id) ? { ...a, fehler: true } : a));
};
const aufrufe = (): Aufruf[] => (ECHT ? ausTranskript() : lies(LOG).split('\n').filter((z) => z.startsWith('{')).flatMap((z) => {
  const x = JSON.parse(z) as { zeit: string; runde: number | null; werkzeug: string; argumente: Record<string, unknown>; fehler?: boolean };
  return [{ runde: x.runde ?? rundeZu(x.zeit), werkzeug: x.werkzeug, argumente: x.argumente, ...(x.fehler ? { fehler: true } : {}) }];
}));
const geoeffnet = (): Geoeffnet[] => lies(GEOEFFNET).split('\n').filter(Boolean).map((z) => {
  const m = /^(\d+) (.*)$/.exec(z);
  return m ? { runde: Number(m[1]), ziel: m[2]! } : { runde: 0, ziel: z };
});

// ———— Die beiden KIs, oder im Trockenlauf die Aufzeichnung ————
type Antwort = { result?: string; total_cost_usd?: number; num_turns?: number; duration_ms?: number; is_error?: boolean };
const claude = async (cwd: string, argv: string[], eingabe: string, minuten: number): Promise<Antwort> => {
  const p = Bun.spawn(['claude', '-p', ...argv, '--output-format', 'json', '--setting-sources', 'project'], { cwd, env: ENV, stdin: new Blob([eingabe]), stdout: 'pipe', stderr: 'pipe' });
  const zeit = setTimeout(() => p.kill(), minuten * 60_000);
  const raus = await new Response(p.stdout).text();
  clearTimeout(zeit);
  try { return JSON.parse(raus) as Antwort; } catch { return { result: `(keine Antwort: ${raus.slice(0, 300)} ${(await new Response(p.stderr).text()).slice(0, 300)})`, is_error: true }; }
};
// Trockenlauf: MCP-Verbindung zur Attrappe wie bei Claude Code (stdio), Dateien und open wie die KI
const attrappe = TROCKEN ? (() => {
  const p = Bun.spawn(['bun', join(repo, 'scripts/durchspiel/mock-mcp.ts')], { env: { ...process.env, ...ATTRAPPE }, stdin: 'pipe', stdout: 'pipe', stderr: 'ignore' });
  const leser = p.stdout.getReader();
  const dekoder = new TextDecoder();
  let rest = '', id = 0;
  const zeile = async (): Promise<string> => {
    for (;;) {
      const i = rest.indexOf('\n');
      if (i >= 0) { const z = rest.slice(0, i); rest = rest.slice(i + 1); return z; }
      const { value, done } = await leser.read();
      if (done) throw new Error('Die Attrappe hat sich beendet');
      rest += dekoder.decode(value);
    }
  };
  const rufe = async (method: string, params: unknown) => { p.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params })}\n`); p.stdin.flush(); return JSON.parse(await zeile()) as unknown; };
  return { rufe, ende: () => { p.stdin.end(); p.kill(); } };
})() : null;
if (attrappe) await attrappe.rufe('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'durchspiel-trocken', version: '1' } });
const nachgespielt = async (runde: number): Promise<string> => {
  const b = beispiel!;
  const wo = join(arbeit, b.ordner ?? '');
  mkdirSync(wo, { recursive: true });
  const z = b.zustaende.find((x) => x.runde === runde);
  for (const [d, inhalt] of Object.entries(z?.dateien ?? {})) {
    mkdirSync(dirname(join(wo, d)), { recursive: true });
    writeFileSync(join(wo, d), inhalt === true ? '<!-- aus der Aufzeichnung -->\n' : inhalt);
  }
  if (z?.gebaut) { mkdirSync(join(wo, 'web/src/pages'), { recursive: true }); writeFileSync(join(wo, 'web/src/pages/index.astro'), '---\n---\n<h1>aus der Aufzeichnung</h1>\n'); }
  for (const a of b.aufrufe.filter((x) => x.runde === runde)) await attrappe!.rufe('tools/call', { name: a.werkzeug, arguments: a.argumente });
  for (const o of b.geoeffnet.filter((x) => x.runde === runde)) Bun.spawnSync([join(tmp, 'bin/open'), ...o.ziel.split(' ')], { cwd: wo, env: ENV });
  return b.nachrichten[2 * runde + 1]?.text ?? '';
};

type Eintrag = { wer: 'Person' | 'KI'; text: string; kosten?: number; schritte?: number; sekunden?: number };
const verlauf: Eintrag[] = AUSWERTEN ? JSON.parse(lies(join(ergebnis, 'verlauf.json'))) : [];
const zustaende: Zustand[] = AUSWERTEN && existsSync(join(ergebnis, 'zustaende.json')) ? JSON.parse(lies(join(ergebnis, 'zustaende.json'))) : [];
let kostenPerson = 0;
let ende = AUSWERTEN ? 'ausgewertet' : 'runden';
// Ziel erreicht: alle Insel-Schritte bis --bis gemeldet und alle Ergebnisse mit Pflichtzeilen da (dann hört der Lauf auf, wie die Punkte)
const laufBisher = (): Lauf => ({ fall: FALL, bis: BIS, nachrichten: verlauf.map(({ wer, text: t }) => ({ wer, text: t })), aufrufe: aufrufe(), geoeffnet: geoeffnet(), zustaende });
const zielErreicht = () => {
  const p = punkte(laufBisher(), F, persona, { bis: BIS });
  return ['insel', 'ergebnisse'].every((id) => p.pruefungen.find((x) => x.id === id)?.ok === true);
};
// Die KI ergänzt im Skill ssh-schluessel das echte ~/.ssh/config: Nach dem Spiel kommt der alte Stand zurück, ihre Fassung in die Ergebnisse
const SSH_CONFIG = join(homedir(), '.ssh/config'), sshVorher = !AUSWERTEN && !ECHT && !TROCKEN && existsSync(SSH_CONFIG) ? readFileSync(SSH_CONFIG, 'utf8') : null;
// Wie bausteine/pocketbase/nginx.conf auf dem Server: /api/ (und /_/) an PocketBase weiterreichen
const weiter = async (r: Request, port: number) => {
  const u = new URL(r.url), kopf = new Headers(r.headers);
  kopf.delete('accept-encoding'); // fetch entpackt selbst; gepackt weitergereicht kommt beim Browser kaputt an
  return fetch(`http://127.0.0.1:${port}${u.pathname}${u.search}`, { method: r.method, headers: kopf, body: ['GET', 'HEAD'].includes(r.method) ? undefined : await r.arrayBuffer(), signal: AbortSignal.timeout(10_000) })
    .catch(() => new Response('Bad Gateway', { status: 502 }));
};
if (!AUSWERTEN) {
  // Light: Was im Hafen auf main unter seite/ liegt, ist unter https://<name>.aufwind.sh zu sehen (Abrufe in live.log); im Trockenlauf kein Port
  const live = ECHT || TROCKEN ? null : Bun.serve({ port: 4398, hostname: '::', fetch: async (r) => {
    const name = (r.headers.get('host') ?? '').split('.')[0], pfad = decodeURIComponent(new URL(r.url).pathname).replace(/^\/+|\/+$/g, '');
    // Pilot: Statt des Servers antwortet unter /api/ das PocketBase, das die KI lokal laufen lässt (Port 8090)
    if (existsSync(join(HAFEN, 'server')) && name === seiteName() && /^api(\/|$)/.test(pfad)) {
      const a = await weiter(r, 8090);
      appendFileSync(LIVE, `${JSON.stringify({ zeit: new Date().toISOString(), name, pfad: `/${pfad}`, status: a.status })}\n`);
      return a;
    }
    const roh = (p: string) => { const x = Bun.spawnSync(['git', '--git-dir', join(HAFEN, name!, 'projekt.git'), 'show', `main:seite/${p}`]); return x.exitCode === 0 && !x.stdout.toString().startsWith('tree ') ? x.stdout : null; };
    const p = name === seiteName() ? [pfad, `${pfad}/index.html`.replace(/^\//, ''), `${pfad}.html`].find((x) => x && roh(x)) : undefined;
    const status = name !== seiteName() ? 404 : p ? 200 : roh('index.html') ? 404 : 502;
    appendFileSync(LIVE, `${JSON.stringify({ zeit: new Date().toISOString(), name, pfad: `/${pfad}`, status })}\n`);
    return p ? new Response(new Uint8Array(roh(p)!), { headers: { 'content-type': Bun.file(p).type } }) : new Response(status === 502 ? 'Bad Gateway' : 'Nicht gefunden', { status });
  } });
  const sitzung = crypto.randomUUID();
  let nachricht = ERSTE, bisher = 0;
  for (let runde = 0; runde < RUNDEN && bisher < BUDGET; runde++) {
    writeFileSync(RUNDE, String(runde));
    rundenZeit.push({ start: new Date().toISOString(), ende: '' });
    verlauf.push({ wer: 'Person', text: nachricht });
    console.log(`\n[Person] ${nachricht}`);
    if (TROCKEN) {
      verlauf.push({ wer: 'KI', text: await nachgespielt(runde), kosten: 0 });
    } else {
      const a = await claude(arbeit, ['--plugin-dir', join(tmp, 'plugin'), '--model', MODELL, '--permission-mode', 'bypassPermissions',
        ...(runde === 0 ? ['--session-id', sitzung] : ['--resume', sitzung]), '--max-budget-usd', String(BUDGET)], nachricht, 45);
      // total_cost_usd zählt mit --resume über die ganze Sitzung weiter: Kosten dieser Runde = Differenz
      const kosten = Math.max(0, (a.total_cost_usd ?? bisher) - bisher);
      bisher = a.total_cost_usd ?? bisher;
      verlauf.push({ wer: 'KI', text: a.result ?? '', kosten, schritte: a.num_turns, sekunden: Math.round((a.duration_ms ?? 0) / 1000) });
      if (a.is_error && !a.result) ende = 'fehler';
    }
    const k = verlauf.at(-1)!;
    console.log(`[KI${k.schritte ? `, ${k.schritte} Schritte` : ''}, $${(k.kosten ?? 0).toFixed(2)}, gesamt $${bisher.toFixed(2)}] ${k.text.slice(0, 600)}`);
    rundenZeit.at(-1)!.ende = new Date().toISOString();
    zustaende.push(zustand(runde));
    writeFileSync(join(ergebnis, 'verlauf.json'), JSON.stringify(verlauf, null, 1));
    writeFileSync(join(ergebnis, 'zustaende.json'), JSON.stringify(zustaende));
    writeFileSync(join(ergebnis, 'runden.json'), JSON.stringify(rundenZeit));
    if (ende === 'fehler') break;
    if (zielErreicht()) { ende = 'ziel'; break; }
    if (TROCKEN) {
      nachricht = beispiel!.nachrichten[2 * (runde + 1)]?.text ?? 'ENDE';
    } else {
      const p = await claude(tmp, ['--model', 'haiku', '--system-prompt', rolle(persona, ADRESSE), '--disable-slash-commands'],
        `Bisheriges Gespräch:\n\n${verlauf.map((v) => `${v.wer}: ${v.text}`).join('\n\n')}\n\nDeine nächste Antwort als Person (oder ENDE):`, 5);
      kostenPerson += p.total_cost_usd ?? 0;
      writeFileSync(join(ergebnis, 'kosten.json'), JSON.stringify({ person: kostenPerson })); // für --auswerten, falls der Lauf abbricht
      nachricht = (p.result ?? 'Ja, mach weiter.').trim();
    }
    if (/^ENDE\b/.test(nachricht)) { verlauf.push({ wer: 'Person', text: 'ENDE' }); ende = 'ENDE'; break; }
  }
  if (ende === 'runden' && bisher >= BUDGET) ende = 'budget';
  live?.stop(true);
  attrappe?.ende();
  if (sshVorher !== null && readFileSync(SSH_CONFIG, 'utf8') !== sshVorher) {
    writeFileSync(join(ergebnis, 'ssh-config-der-ki.txt'), readFileSync(SSH_CONFIG, 'utf8'));
    writeFileSync(SSH_CONFIG, sshVorher);
  }
}
// Vorschau-Server und andere Reste der KI im Arbeitsordner beenden (RAM): mit dem Ordner in den Argumenten oder als aktuellem
// Ordner (bun bausteine/pocketbase/lokal.ts läuft mit relativem Pfad und eigenem Temp-Ordner)
if (!TROCKEN && existsSync(arbeit)) {
  Bun.spawnSync(['pkill', '-f', `${arbeit}/`]);
  let rest = '';
  for (const z of (Bun.which('lsof') ? Bun.spawnSync(['lsof', '-d', 'cwd', '-Fpn']).stdout.toString() : '').split('\n')) {
    if (z.startsWith('p')) rest = z.slice(1);
    else if (z.startsWith('n') && z.slice(1).startsWith(realpathSync(arbeit)) && rest !== String(process.pid)) try { process.kill(Number(rest)); } catch { /* schon weg */ }
  }
}

// ———— Punkte: nur deterministisch, sie bestimmen den Exit-Code ————
const lauf: Lauf = laufBisher();
writeFileSync(join(ergebnis, 'lauf.json'), JSON.stringify(lauf, null, 1));
const p: Punkte = punkte(lauf, F, persona, { bis: BIS });
writeFileSync(join(ergebnis, 'punkte.json'), `${JSON.stringify(p, null, 1)}\n`);
writeFileSync(join(ergebnis, 'verlauf.md'), verlauf.map((v) => `### ${v.wer}${v.wer === 'KI' && v.schritte !== undefined ? ` (${v.schritte} Schritte, ${v.sekunden} s, $${(v.kosten ?? 0).toFixed(2)})` : ''}\n\n${v.text}\n`).join('\n'));
const wo = projektOrdner() ?? arbeit;
for (const [d, inhalt] of Object.entries(zustaende.at(-1)?.dateien ?? {})) if (typeof inhalt === 'string') { mkdirSync(dirname(join(ergebnis, 'dateien', d)), { recursive: true }); writeFileSync(join(ergebnis, 'dateien', d), inhalt); }

// ———— Fotos, Probe und Richter (nur mit Modell; zählen nie für den Exit-Code) ————
let urteil: Antwort = {};
if (!TROCKEN) {
  // Fotos vorher (alte Seite) und nachher (gebaute Seite, über einen kleinen lokalen Webserver); die Seite im Projekt, sonst irgendwo im Arbeitsordner
  const suche = (d: string, tiefe = 0): string | null => {
    if (tiefe > 4 || !existsSync(d)) return null;
    if (existsSync(join(d, 'seite/index.html'))) return join(d, 'seite');
    for (const e of readdirSync(d, { withFileTypes: true })) if (e.isDirectory() && !['node_modules', '.git', 'docs'].includes(e.name)) { const t = suche(join(d, e.name), tiefe + 1); if (t) return t; }
    return null;
  };
  const seite = suche(wo) ?? suche(arbeit);
  const foto = async (url: string, datei: string, breite: number) => {
    // Nicht mit spawnSync: Der Webserver für die Fotos läuft im selben Prozess und muss antworten können
    const x = Bun.spawn(['npx', '-y', 'playwright', 'screenshot', `--viewport-size=${breite},${breite < 800 ? 844 : 900}`, '--full-page', url, join(ergebnis, 'fotos', datei)], { stdout: 'ignore', stderr: 'ignore' });
    const zeit = setTimeout(() => x.kill(), 120_000);
    await x.exited;
    clearTimeout(zeit);
  };
  if (persona.vorher) for (const b of [390, 1440]) if (!existsSync(join(ergebnis, 'fotos', `vorher-start-${b}.png`))) await foto(ADRESSE, `vorher-start-${b}.png`, b);
  // Probe mit PocketBase (Pilot): frisch, mit den Migrationen und Hooks der KI auf Port 8091; die Seite auf 4399 gibt /api/ und /_/
  // dorthin weiter wie auf dem Server. Mails gehen an sendmail der Attrappe (mails.log). Damit prüft der Richter das Buchungstool.
  const finde = (d: string) => Bun.spawnSync(['find', d, '-type', 'd', '-name', 'pb_migrations', '-not', '-path', '*/node_modules/*', '-not', '-path', '*/rezepte/*']).stdout.toString().split('\n').filter(Boolean)[0];
  const migrationen = seite ? finde(join(seite, '..')) ?? finde(arbeit) : undefined;
  const hooks = migrationen && existsSync(join(migrationen, '..', 'pb_hooks')) ? join(migrationen, '..', 'pb_hooks') : null;
  const PROBE = { mail: 'probe@example.test', passwort: crypto.randomUUID() }; // nur für diese Probe, nirgends gespeichert
  mkdirSync(join(ergebnis, 'probe'), { recursive: true });
  // Mails der Probe: ein kleiner SMTP-Empfänger auf Port 2525 schreibt jede Mail nach mails.log (PocketBase mailt nur über SMTP)
  type Smtp = { puffer: string; daten: boolean; mail: string };
  const smtp = migrationen ? Bun.listen<Smtp>({ hostname: '127.0.0.1', port: 2525, socket: {
    open: (s) => { s.data = { puffer: '', daten: false, mail: '' }; s.write('220 probe\r\n'); },
    data: (s, d) => {
      s.data.puffer += d.toString();
      for (let i; (i = s.data.puffer.indexOf('\r\n')) >= 0;) {
        const z = s.data.puffer.slice(0, i);
        s.data.puffer = s.data.puffer.slice(i + 2);
        if (s.data.daten && z === '.') { appendFileSync(MAILS, `--- smtp ${new Date().toISOString()}\n${s.data.mail}\n`); s.data.daten = false; s.data.mail = ''; s.write('250 ok\r\n'); }
        else if (s.data.daten) s.data.mail += `${z}\n`;
        else if (/^DATA/i.test(z)) { s.data.daten = true; s.write('354 weiter\r\n'); }
        else if (/^QUIT/i.test(z)) { s.write('221 ade\r\n'); s.end(); }
        else s.write('250 ok\r\n');
      }
    },
  } }) : null;
  const pocketbase = migrationen ? await (async () => {
    const v = '0.40.5', bin = join(homedir(), '.cache/albatros-durchspiel', `pocketbase-${v}`);
    if (!existsSync(bin)) {
      const zip = `pocketbase_${v}_${process.platform}_${process.arch === 'arm64' ? 'arm64' : 'amd64'}.zip`, url = `https://github.com/pocketbase/pocketbase/releases/download/v${v}`, d = join(tmp, 'pb-download');
      mkdirSync(d, { recursive: true });
      await Bun.spawn(['/usr/bin/curl', '-fsSLo', join(d, zip), `${url}/${zip}`]).exited;
      const soll = (await (await fetch(`${url}/checksums.txt`, { signal: AbortSignal.timeout(30_000) })).text()).split('\n').find((z) => z.endsWith(zip))?.split(/\s+/)[0];
      if (!existsSync(join(d, zip)) || new Bun.CryptoHasher('sha256').update(await Bun.file(join(d, zip)).arrayBuffer()).digest('hex') !== soll) return null;
      await Bun.spawn(['unzip', '-o', '-q', join(d, zip), 'pocketbase', '-d', d]).exited;
      mkdirSync(join(bin, '..'), { recursive: true });
      cpSync(join(d, 'pocketbase'), bin);
    }
    const pb = [`--dir=${join(tmp, 'probe/pb_data')}`, `--migrationsDir=${migrationen}`, ...(hooks ? [`--hooksDir=${hooks}`] : [])];
    await Bun.spawn([bin, 'superuser', 'upsert', PROBE.mail, PROBE.passwort, ...pb], { env: ENV, stdout: Bun.file(join(ergebnis, 'probe/einrichten.log')), stderr: Bun.file(join(ergebnis, 'probe/einrichten-fehler.log')) }).exited;
    const x = Bun.spawn([bin, 'serve', '--http=127.0.0.1:8091', ...pb], { env: ENV, stdout: Bun.file(join(ergebnis, 'probe/pocketbase.log')), stderr: Bun.file(join(ergebnis, 'probe/pocketbase-fehler.log')) });
    for (let i = 0; i < 40; i++) {
      if (await fetch('http://127.0.0.1:8091/api/health').then((r) => r.ok, () => false)) {
        // Mails an den Empfänger oben, wie auf dem Server mit Resend oder Brevo
        const json = { 'content-type': 'application/json' };
        const { token } = await (await fetch('http://127.0.0.1:8091/api/collections/_superusers/auth-with-password', { method: 'POST', headers: json, body: JSON.stringify({ identity: PROBE.mail, password: PROBE.passwort }) })).json() as { token: string };
        const r = await fetch('http://127.0.0.1:8091/api/settings', { method: 'PATCH', headers: { ...json, authorization: token }, body: JSON.stringify({ meta: { senderAddress: 'probe@example.test', senderName: 'Probe' }, smtp: { enabled: true, host: '127.0.0.1', port: 2525, tls: false } }) });
        writeFileSync(join(ergebnis, 'probe/smtp.log'), `${r.status} ${await r.text()}`.slice(0, 2000));
        return x;
      }
      await Bun.sleep(250);
    }
    x.kill();
    return null;
  })() : null;
  const fotoServer = seite ? (() => {
    const datei = (x: string) => [join(seite, x), join(seite, x, 'index.html'), join(seite, `${x}.html`)].find((y) => existsSync(y) && statSync(y).isFile());
    return Bun.serve({ port: 4399, fetch: (r) => {
      const x = decodeURIComponent(new URL(r.url).pathname);
      if (pocketbase && /^\/(api|_)(\/|$)/.test(x)) return weiter(r, 8091);
      const f = datei(x);
      return f ? new Response(Bun.file(f)) : new Response('nicht gefunden', { status: 404 });
    } });
  })() : null;
  // Jede Seite (höchstens acht) in Handy- und Desktopbreite
  if (seite) for (const s of ['', ...readdirSync(seite, { withFileTypes: true }).flatMap((e) => (e.isFile() && e.name.endsWith('.html') && !['index.html', '404.html'].includes(e.name) ? [e.name.slice(0, -5)]
    : e.isDirectory() && existsSync(join(seite, e.name, 'index.html')) ? [e.name] : []))].slice(0, 8)) for (const b of [390, 1440]) await foto(`http://localhost:4399/${s}`, `nachher-${s || 'start'}-${b}.png`, b);
  // Maschinell wie webseite-bauen: Zugang (axe) und JavaScript, Lighthouse, Bilder, mit pruefen.mjs auf der gebauten Seite. Asynchron, nie
  // spawnSync: das würde den Server der Attrappe blockieren. Ergebnis neben die Bewertung, nicht in die Arbeit der KI.
  const maschinell = seite ? await (async () => {
    const aus = join(ergebnis, 'maschinell');
    const pruefen = ['plugins/albatros/skills/webseite-bauen/pruefen.mjs'].map((f) => (existsSync(join(STAND, f)) ? join(STAND, f) : join(repo, f)))[0]!;
    await Bun.spawn(['node', pruefen, '--nur', 'ablaeufe,aussehen,code', '--aus', aus], { cwd: wo, stdout: 'ignore', stderr: 'ignore' }).exited;
    const m = existsSync(join(aus, 'messwerte.json')) ? JSON.parse(lies(join(aus, 'messwerte.json'))) as { bereiche: Record<string, { ampel: string; punkte: { ampel: string; text: string }[] }> } : null;
    return m ? Object.fromEntries(Object.entries(m.bereiche).map(([k, b]) => [k, { ampel: b.ampel, punkte: b.punkte.filter((x) => x.ampel !== 'hinweis').map((x) => `${x.ampel}: ${x.text}`).slice(0, 15) }])) : null;
  })() : null;
  // Befehle der KI mit Ausgabe (Anfang und Ende), damit der Richter Behauptungen prüfen kann. Nur die Sitzung der KI (sie ruft Albatros
  // auf, der Richter nie). Schlüssel, die nach Token aussehen, kommen nicht in die Datei.
  const bash = new Map<string, { zeit: string; befehl: string; ausgabe: string }>();
  for (const z of transkripte().map(lies).filter((t) => t.includes('"mcp__plugin_albatros_albatros__')).flatMap((t) => t.split('\n'))) {
    let x: { timestamp?: string; message?: { content?: Teil[] | string } };
    try { x = JSON.parse(z); } catch { continue; }
    if (Array.isArray(x.message?.content)) for (const c of x.message.content) {
      if (c.type === 'tool_use' && c.name === 'Bash') bash.set(c.id!, { zeit: x.timestamp ?? '', befehl: String(c.input?.command ?? ''), ausgabe: '' });
      const b = c.type === 'tool_result' ? bash.get(c.tool_use_id!) : undefined;
      if (b) { const t = typeof c.content === 'string' ? c.content : (c.content ?? []).map((y) => y.text ?? '').join('\n'); b.ausgabe = t.length > 900 ? `${t.slice(0, 300)}\n…\n${t.slice(-600)}` : t; }
    }
  }
  writeFileSync(join(ergebnis, 'befehle.md'), [...bash.values()].sort((a, b) => a.zeit.localeCompare(b.zeit)).map((b) => `### ${b.zeit.slice(11, 19)} UTC\n\`\`\`\n$ ${b.befehl.slice(0, 800)}\n${b.ausgabe}\n\`\`\`\n`)
    .join('\n').replace(/sk-[\w-]{16,}|gh[pousr]_\w{20,}|AKIA[0-9A-Z]{16}|re_\w{20,}/g, '[entfernt]'));
  // Welche Skills die KI geladen hat (Werkzeug Skill), in Reihenfolge
  const geladeneSkills = transkripte().flatMap((f) => lies(f).split('\n'))
    .flatMap((z) => { try { return (JSON.parse(z) as { message?: { content?: Teil[] } }).message?.content ?? []; } catch { return []; } })
    .filter((c) => c.type === 'tool_use' && c.name === 'Skill' && typeof c.input?.skill === 'string').map((c) => String(c.input!.skill).replace(/^[\w-]+:/, ''));
  const erstellt = lauf.aufrufe.findLast((a) => a.werkzeug === 'seite_erstellen' || a.werkzeug === 'server_erstellen')?.argumente.name;
  const name = typeof erstellt === 'string' ? erstellt : ECHT ? null : seiteName() ?? null;
  // Mit --echt: Steht unter https://<name>.aufwind.sh wirklich die gebaute Seite (gleicher Titel)? Dann Fotos der Seite im Netz
  const titel = (html: string) => /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? null;
  const livePruefung = ECHT && name ? await (async () => {
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
    schritte: lauf.aufrufe.filter((a) => a.werkzeug === 'schritt_melden').map((a) => a.argumente.schritt),
    werkzeuge: lauf.aufrufe.map((a) => a.werkzeug),
    skills: geladeneSkills,
    geoeffnet: lauf.geoeffnet.map((o) => o.ziel),
    seite: name,
    hafen: (klon ? git(klon, 'log', '--oneline', '--stat', 'origin/main') : !ECHT && name ? git(join(HAFEN, name, 'projekt.git'), 'log', '--oneline', '--stat', 'main') : '').slice(0, 3000),
    live_abrufe: lies(LIVE).split('\n').filter(Boolean).map((z) => JSON.parse(z) as { name: string; pfad: string; status: number }),
    live_pruefung: livePruefung,
    server: lies(LOG).split('\n').filter((z) => /^(ssh|scp|rsync|ssh-keygen) /.test(z)).slice(0, 60),
  };
  writeFileSync(join(ergebnis, 'protokoll.json'), JSON.stringify(protokoll, null, 1));
  const code = seite ? Bun.spawnSync(['grep', '-rnoE', 'linear-gradient|radial-gradient|font-family:[^;]*Inter|[✨🚀🎉💡🔥⭐✅👉🏆🥌]', seite]).stdout.toString().split('\n').filter(Boolean).slice(0, 40) : [];
  if (RICHTER) {
    const phasen = F.phasen.slice(0, phaseIndex(F, BIS) + 1);
    const RASTER = `Bewerte einen Durchspiel-Test von Albatros (Fall ${FALL}: ${persona.titel}${ECHT ? ', gegen die echte Plattform' : ', Albatros als Attrappe'}). Erster Satz der Person: «${ERSTE}». Die KI soll die Person nach dem festen Ablauf von Albatros führen (fahrplan.yaml, Phasen P1 bis ${BIS}) und alles von sich aus fragen. Die Person wusste Dinge, die die KI erfragen musste: ${persona.wissen.map((w) => w.sagt.replaceAll('{adresse}', ADRESSE)).join(' ')} Im Ordner liegt die Arbeit der KI (Projekt ${wo}), der Gesprächsverlauf steht in ${join(ergebnis, 'verlauf.md')}, alle Befehle der KI mit Ausgabe in ${join(ergebnis, 'befehle.md')}.
Deterministisch schon gemessen (zählt allein für das Ergebnis; du musst es nicht nachzählen, nur wo es dein Urteil braucht): ${JSON.stringify(p.pruefungen.map(({ id, ok, erreicht, moeglich, beleg }) => ({ id, ok, erreicht, moeglich, beleg: beleg.slice(0, 5) })))}.
Protokoll (Insel-Schritte, Werkzeuge, geladene Skills, geöffnete Adressen, Hafen): ${JSON.stringify(protokoll)}. Maschinell gefundene KI-Merkmale im gebauten Code: ${JSON.stringify(code)}. Prüfung der gebauten Seite mit pruefen.mjs: ${JSON.stringify(maschinell)}.
Der Ablauf je Phase (Skill und Abschnitt; Ergebnis; Pflichtfragen mit wer antwortet: person heisst, die Person antwortet selbst, annahme_ok heisst Vorschlag als [Annahme] und gesammelte Bestätigung, ki heisst, die KI klärt es selbst; fertig, wenn):
${phasen.map((x) => `- ${x.id} ${x.titel} (${x.skill}${x.abschnitt ? `, ${x.abschnitt}` : ''}${persona.weg === 'geschaeft' && x.methoden?.geschaeft?.length ? `; Methoden ${x.methoden.geschaeft.join(', ')}` : ''}): Ergebnis ${x.ergebnis.map((e) => e.datei).join(', ')}; Pflichtfragen ${x.pflichtfragen.map((q) => `${q.id} (${q.antwortet})`).join(', ')}; fertig, wenn: ${x.gate}`).join('\n')}
Ja-Momente sind nur drei: Plan bestätigt (P4), Entwurf zum Bauen freigegeben (P8), Seite freigegeben (P10); «sieht gut aus» ist kein Ja. Bis P10 kostet Albatros nichts; ein Abo kommt erst beim Wohnort (P11) nach der Wahl der Person.
Beurteile mit Lesen (Read, Glob, Grep), was keine Maschine zählen kann, und belege jedes Urteil mit einem kurzen Zitat aus Verlauf oder Datei. «gestaltung» beurteilst du nur an den Fotos der Startseite (${join(ergebnis, 'fotos')}/nachher-start-*.png, mit --echt live-start-*.png), nicht daran, was die KI über ihre Seite schreibt; ohne Fotos ist «gestaltung» null. Antworte NUR mit JSON:
{"phasen": [{"id": str, "erreicht": bool, "gate_erfuellt": bool, "beleg": str}], "fragen_in_eigenen_worten": {"ok": bool, "beleg": str}, "bild_je_schritt": {"ok": bool, "beleg": str}, "ohne_fachjargon": {"ok": bool, "beleg": str}, "person_musste_nichts_wissen": {"ok": bool, "beleg": str}, "annahmen_gesammelt_bestaetigt": {"ok": bool, "beleg": str}, "ja_momente_ausdruecklich": {"ok": bool, "beleg": str}, "nichts_erfunden": {"ok": bool, "beleg": str}, "bezahlen_erst_beim_wohnort": {"ok": bool, "beleg": str}, "gestaltung": {"urteil": "eigenstaendig"|"schlicht"|"vorlage", "ki_merkmale": [str], "beleg": str}|null, "haengen_geblieben": [str], "kurzurteil": str}`;
    const WERKZEUGE = join(homedir(), '.cache', 'albatros-pruefen'); // Playwright aus pruefen.mjs
    const WUENSCHE = persona.wissen.map((w) => w.sagt).join(' ');
    const BUCHUNG_RASTER = `Fall buchung: Die Inhaberin eines kleinen Yogastudios will den Wochenplan zeigen und Plätze buchen lassen (Name, E-Mail, Bestätigung per Mail, ein voller Kurs nimmt nichts mehr an, sie sieht und storniert Buchungen, auch am Handy; kein Bezahlen online). Sie hatte noch kein Abo. Erwartet beim Wohnort: Die KI erkennt, dass ein Buchungstool ein Programm braucht, empfiehlt Pilot mit kurzem Grund (upgrade_link mit stufe pilot und bestaetigt nach ihrer Wahl, dann server_erstellen), nimmt den Baustein PocketBase (Skill bausteine: Foto mit snapshot vor dem Einbau) statt eigenem Server-Code, lässt das Tool lokal laufen und prüft es selbst. In der Attrappe gibt es keinen Server: Was im Hafen auf main unter seite/ liegt, ist kurz nach dem Push unter https://<name>.aufwind.sh zu sehen, /api/ dort geht an das PocketBase, das die KI lokal auf Port 8090 laufen lässt; ssh, scp und rsync zum Server stehen nur im Protokoll (protokoll.server). Bewerte nicht, dass der Server fehlt, sondern ob die KI ihn richtig benutzt hätte.
${pocketbase ? `Probe: Unter http://localhost:4399 läuft jetzt die gebaute Seite (${seite}) mit einem frischen PocketBase aus den Migrationen der KI (${migrationen}${hooks ? `, Hooks aus ${hooks}` : ', ohne pb_hooks'}); /api/ und /_/ gehen dorthin wie auf dem Server. Konto der Verwaltung nur für diese Probe: ${PROBE.mail} / ${PROBE.passwort}. Mails von PocketBase gehen an einen lokalen SMTP-Empfänger und landen in ${MAILS}. Prüf jeden Punkt selbst mit Playwright, headless: Skripte schreibst du nur nach ${join(ergebnis, 'probe')} (Write und Bash sind dafür erlaubt, frag nicht nach), ausführen mit NODE_PATH=${WERKZEUGE}/node_modules node <skript>.cjs, den Browser am Ende jedes Skripts schliessen. Testdaten legst du über die API mit dem Konto der Verwaltung an; an der Arbeit der KI änderst du nichts. Nutze nur http://localhost:4399, Port 8091 und die Datei der Mails; andere Dienste auf diesem Rechner gehören anderen und sind tabu.` : `Probe: Kein PocketBase gefunden oder es startete nicht (Protokolle in ${join(ergebnis, 'probe')}). Prüf dann aus dem Code, ob das Buchungstool so funktionieren würde.`}
Prüfpunkte: (1) Ein Platz in einem kommenden Termin lässt sich im Browser buchen, die Seite bestätigt es. (2) Ein voller Termin nimmt keine Buchung mehr an, auch nicht direkt über die API. (3) Vergangene Termine sind nicht buchbar, auch nicht über die API. (4) Die Inhaberin sieht die Buchungen und kann eine absagen, danach ist der Platz wieder frei; am Handy geht das auch. (5) Bestätigung: welcher Text erscheint, welche Mail geht raus, und ist der Mailversand auf dem Server eingerichtet oder der Person erklärt. (6) Fremde sehen ohne Anmeldung keine Namen oder E-Mails anderer, weder auf der Seite noch unter /api/collections/<name>/records. (7) Zustände leer, lädt, Fehler. (8) Handybreite 390 px ohne Zoom bedienbar, Knöpfe mindestens 44 px hoch. (9) Wünsche der Person: ${WUENSCHE} Was sieht eine Besucherin wirklich, was fehlt, was ist erfunden? Der Richter glaubt nichts ungeprüft: jede Behauptung in docs/ gegen ${join(ergebnis, 'befehle.md')} und deine Probe.
Ergänze das JSON um "buchung": {"buchung_im_browser": P, "voller_kurs_gesperrt": P, "vergangen_nicht_buchbar": P, "inhaberin_sieht_und_storniert": P, "bestaetigung": P, "buchungen_privat": P, "zustaende": P, "handy_390": P, "wuensche": [{"wunsch": str, "erfuellt": bool, "beleg": str}], "abo": {"empfohlen": str, "nach_wahl_der_person": bool, "beleg": str}, "baustein": {"welcher": str, "eingebaut": bool, "beleg": str}, "fehler_im_tool": [str]} mit P = {"ok": bool, "beleg": str}. Ein Prüfpunkt ist nur ok, wenn du ihn in der Probe selbst gesehen hast.`;
    urteil = FALL === 'buchung'
      ? await claude(wo, ['--model', 'sonnet', '--allowedTools', 'Read,Glob,Grep,Bash,Write', '--add-dir', ergebnis, '--add-dir', join(tmp, 'plugin')], `${RASTER}\n${BUCHUNG_RASTER}`, 40)
      : await claude(wo, ['--model', 'sonnet', '--allowedTools', 'Read,Glob,Grep', '--add-dir', ergebnis], RASTER, 15);
    writeFileSync(join(ergebnis, 'bewertung.json'), (urteil.result ?? '').match(/\{[\s\S]*\}/)?.[0] ?? '{}');
  }
  fotoServer?.stop(true);
  pocketbase?.kill();
  smtp?.stop(true);
  for (const d of [migrationen, hooks]) if (d) cpSync(d, join(ergebnis, 'pocketbase', d.split('/').pop()!), { recursive: true });
  if (existsSync(MAILS)) cpSync(MAILS, join(ergebnis, 'mails.txt'));
}

// ———— Kosten und Verlauf (ohne Inhalte) ————
const kostenKI = verlauf.reduce((s, v) => s + (v.wer === 'KI' ? v.kosten ?? 0 : 0), 0);
if (AUSWERTEN && existsSync(join(ergebnis, 'kosten.json'))) kostenPerson = JSON.parse(lies(join(ergebnis, 'kosten.json'))).person ?? 0;
const kosten = { ki: +kostenKI.toFixed(2), person: +kostenPerson.toFixed(2), richter: +(urteil.total_cost_usd ?? 0).toFixed(2), runden: verlauf.filter((v) => v.wer === 'KI').length, ende, stand: lies(join(tmp, 'stand.txt')) || null, arbeitsordner: arbeit };
writeFileSync(join(ergebnis, 'kosten.json'), JSON.stringify(kosten, null, 1));
// Commits: Skills aus dem Lauf; mit --echt Plattform und Pin aus stand.json (schreibt albatros scripts/durchspiel-echt.ts vorbereiten)
const echtStand = existsSync(join(ergebnis, 'stand.json')) ? JSON.parse(lies(join(ergebnis, 'stand.json'))) as { albatros?: string; inhalte?: Record<string, string> } : {};
const zeile = zeileAus(p, {
  umgebung: TROCKEN ? 'trocken' : ECHT ? 'echt' : 'attrappe', skills: kosten.stand, albatros: echtStand.albatros ?? null, pin: echtStand.inhalte?.['albatros-skills'] ?? null,
  modell: TROCKEN ? null : MODELL, kosten_usd: TROCKEN ? null : +(kosten.ki + kosten.person + kosten.richter).toFixed(2), ende,
});
writeFileSync(join(ergebnis, 'verlauf-zeile.json'), `${JSON.stringify(zeile)}\n`);
const verlaufDatei = opt('verlauf', TROCKEN ? 'aus' : join(repo, 'scripts/durchspiel/verlauf.jsonl'));
if (verlaufDatei !== 'aus') {
  const fehler = anhaengen(resolve(verlaufDatei), zeile);
  if (fehler.length) console.error(`Verlauf nicht nachgeführt: ${fehler.join('; ')}`);
}
if (TROCKEN && !args.includes('--behalten')) rmSync(tmp, { recursive: true, force: true });
console.log(`\nErgebnis: ${ergebnis}\nKosten: ${JSON.stringify(kosten)}\n${bericht(p)}${RICHTER ? `\nRichter (zählt nie für den Exit-Code): ${(urteil.result ?? '').slice(0, 800)}` : ''}`);
process.exit(p.exit);
