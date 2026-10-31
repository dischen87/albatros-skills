// Durchspiel-Test: Eine KI mit dem Plugin albatros bekommt nur den ersten Satz der Person (Fall curling: «Modernisiere <adresse>»,
// Fall musikverein: ein erfundener Verein will eine neue Seite, Fall buchung: ein erfundenes Yogastudio will Kurse mit Platzbuchung,
// also Pilot mit Baustein), eine zweite KI spielt die Person ohne Technikwissen und beantwortet ihre Fragen kurz. Am Ende: Fotos
// vorher und nachher, Bewertung nach Raster, Kosten.
//   bun scripts/durchspiel.ts [adresse] [--fall curling|musikverein|buchung] [--runden 16] [--modell sonnet] [--budget 30] [--stand HEAD] [--ergebnis <ordner>]
//   bun scripts/durchspiel.ts --auswerten <temp-ordner> <ergebnis-ordner>   (nur Fotos, Protokoll und Bewertung eines Laufs)
//   ALBATROS_MCP_TOKEN=… bun scripts/durchspiel.ts --echt --fall musikverein   (echte Plattform, nur im Workflow durchspiel von albatros)
// Mit --echt spricht die KI mit dem echten MCP von Albatros (Token der E2E-Person aus der Umgebung, nie in Dateien), mit echtem ssh,
// git und curl; die Seite geht wirklich unter <name>.aufwind.sh ins Netz. Darum dort nur erfundene Inhalte (Fall musikverein).
// Albatros ist eine Attrappe (scripts/durchspiel/mock-mcp.ts): keine Zahlung, kein Server. Der Hafen ist ein lokales Git-Repo
// (git@aufwind.sh: zeigt per insteadOf dorthin, seite_erstellen legt es unter dem gewünschten Namen an), open/xdg-open und ssh
// schreiben nur ins Protokoll, curl auf https://<name>.aufwind.sh bekommt die Seite aus dem Hafen (wie Light). Die Inhalte der Seite
// gehören ihren Betreibern: Alles bleibt lokal im Temp-Ordner und in plugins/albatros/evals/results/, nichts wird veröffentlicht.
// Ohne --echt ausserdem: scp, rsync (zum Server) und ssh-keygen nur ins Protokoll, sendmail schreibt Mails nach mails.log, Bausteine
// und Dateien von albatros-skills auf GitHub kommen aus diesem Repo (Stand der Skills im Lauf). Mit Pilot (Fall buchung, Attrappe in
// scripts/durchspiel/mocks/buchung/) gibt die Seite /api/ an das PocketBase weiter, das die KI lokal auf Port 8090 laufen lässt.
// Nach dem Lauf startet ein frisches PocketBase mit den Migrationen der KI (Probe), und der Richter prüft das Buchungstool im Browser.
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
const LOG = join(tmp, 'albatros.log'), GEOEFFNET = join(tmp, 'geoeffnet.txt'), LIVE = join(tmp, 'live.log'), MAILS = join(tmp, 'mails.log');
const arbeit = join(tmp, 'arbeit'), HAFEN = join(tmp, 'hafen'), STAND = join(tmp, 'stand');
const ENV = { ...process.env, PATH: `${join(tmp, 'bin')}:${process.env.PATH}`, ...(ECHT ? {} : { GIT_CONFIG_GLOBAL: join(tmp, 'gitconfig') }) };
const git = (cwd: string, ...a: string[]) => Bun.spawnSync(['git', ...a], { cwd, env: ENV }).stdout.toString();
// Seite im Hafen: die von seite_erstellen (Datei hafen/seite), sonst das erste Repo ausser der Vorlage
const seiteName = () => (existsSync(join(HAFEN, 'seite')) ? readFileSync(join(HAFEN, 'seite'), 'utf8').trim() : readdirSync(HAFEN).find((d) => existsSync(join(HAFEN, d, 'projekt.git'))));

if (!AUSWERTEN) {
  // Plugin mit der Attrappe statt des echten Diensts (mit --echt: echter Dienst, Token aus der Umgebung), Arbeitsordner frisch
  // Stand von Skills, Bausteinen und Vorlage: ein Commit (--stand, Standard HEAD), nie halbfertige Änderungen anderer Sessions
  mkdirSync(STAND);
  Bun.spawnSync(['sh', '-c', `git -C '${repo}' archive '${opt('stand', 'HEAD')}' plugins/albatros bausteine vorlage | tar -x -C '${STAND}'`]);
  writeFileSync(join(tmp, 'stand.txt'), git(repo, 'rev-parse', '--short', opt('stand', 'HEAD')).trim());
  cpSync(join(STAND, 'plugins/albatros'), join(tmp, 'plugin'), { recursive: true, filter: (p) => !p.includes('/evals') });
  writeFileSync(join(tmp, 'plugin/.mcp.json'), JSON.stringify({ mcpServers: { albatros: ECHT
    ? { type: 'http', url: process.env.ALBATROS_MCP_URL ?? 'https://mcp.albatros.build', headers: { Authorization: 'Bearer ${ALBATROS_MCP_TOKEN}' } }
    : { command: 'bun', args: [join(repo, 'scripts/durchspiel/mock-mcp.ts')], env: { DURCHSPIEL_LOG: LOG, DURCHSPIEL_HAFEN: HAFEN, DURCHSPIEL_FALL: FALL } } } }));
  mkdirSync(arbeit);
  // open und xdg-open protokollieren nur (es gibt keinen Bildschirm). Ohne --echt auch ssh als Attrappe, und curl auf
  // https://<name>.aufwind.sh geht an den Webserver unten (Port 4398), alles andere ans echte curl. node bekommt die Adresse als
  // http://<name>.localhost:4398, damit pruefen.mjs --live (Chromium, Lighthouse, fetch) auch dort landet und nie bei aufwind.sh
  mkdirSync(join(tmp, 'bin'));
  for (const n of ['open', 'xdg-open']) { writeFileSync(join(tmp, 'bin', n), `#!/bin/sh\necho "$*" >> ${GEOEFFNET}\n`); chmodSync(join(tmp, 'bin', n), 0o755); }
}
if (!AUSWERTEN && !ECHT) {
  writeFileSync(join(tmp, 'bin/ssh'), `#!/bin/sh\necho "ssh $*" >> ${LOG}\ncase "$*" in *-T*) echo "Hi $(cat ${join(HAFEN, 'seite')} 2>/dev/null || echo du)! You've successfully authenticated, but Forgejo does not provide shell access." >&2; exit 1;; esac\necho "Attrappe: kein echter Server im Durchspiel-Test"\n`);
  writeFileSync(join(tmp, 'bin/curl'), `#!/bin/sh\nfor a; do shift\n  case "$a" in\n    http*://code.aufwind.sh*) ;;\n    http*://*.aufwind.sh|http*://*.aufwind.sh/*|*.aufwind.sh|*.aufwind.sh/*) r=\${a#*://}; h=\${r%%/*}; p=\${r#"$h"}; a="http://127.0.0.1:4398\${p:-/}"; set -- "$@" -H "Host: $h";;\n    http*://codeload.github.com/dischen87/albatros-skills/*) a="file://${join(tmp, 'albatros-skills-main.tar.gz')}";;\n    http*://raw.githubusercontent.com/dischen87/albatros-skills/main/*) a="file://${STAND}/\${a#*/albatros-skills/main/}";;\n  esac\n  set -- "$@" "$a"\ndone\nexec /usr/bin/curl "$@"\n`);
  writeFileSync(join(tmp, 'bin/node'), `#!/bin/sh\nfor a; do shift\n  case "$a" in\n    http*://code.aufwind.sh*) ;;\n    http*://*.aufwind.sh|http*://*.aufwind.sh/*) r=\${a#*://}; h=\${r%%/*}; a="http://\${h%.aufwind.sh}.localhost:4398\${r#"$h"}";;\n  esac\n  set -- "$@" "$a"\ndone\nexec ${Bun.which('node')} "$@"\n`);
  // Zum Server nur ins Protokoll, lokal kopieren (ohne «host:») geht weiter; nie ein neuer Schlüssel im echten ~/.ssh; Mails nur in mails.log
  for (const n of ['scp', 'rsync']) writeFileSync(join(tmp, 'bin', n), `#!/bin/sh\ncase "$*" in\n  *:*) echo "${n} $*" >> ${LOG}; echo "Attrappe: kein echter Server im Durchspiel-Test";;\n  *) exec /usr/bin/${n} "$@";;\nesac\n`);
  writeFileSync(join(tmp, 'bin/ssh-keygen'), `#!/bin/sh\necho "ssh-keygen $*" >> ${LOG}\necho "Attrappe: Im Durchspiel-Test entsteht kein neuer Schlüssel, das Schloss ist bei Albatros schon hinterlegt."\n`);
  writeFileSync(join(tmp, 'bin/sendmail'), `#!/bin/sh\n{ echo "--- sendmail $*"; cat; echo; } >> ${MAILS}\n`);
  for (const n of ['ssh', 'curl', 'node', 'scp', 'rsync', 'ssh-keygen', 'sendmail']) chmodSync(join(tmp, 'bin', n), 0o755);
  // Bausteine und Dateien von albatros-skills aus diesem Repo statt von GitHub (aufgebaut wie codeload: albatros-skills-main/…)
  Bun.spawnSync(['tar', '-czf', join(tmp, 'albatros-skills-main.tar.gz'), '-s', ',^,albatros-skills-main/,', '--exclude', 'node_modules', '-C', STAND, 'bausteine', 'vorlage', 'plugins/albatros/skills']);
  // Hafen: Vorlage als bare Repo, seite_erstellen kopiert sie nach hafen/<name>/projekt.git, wie flotte es anlegt
  writeFileSync(join(tmp, 'gitconfig'), `[user]\n\tname = ${{ musikverein: 'Präsidentin Musikverein Testdorf', buchung: 'Inhaberin Yogaraum Testwil' }[FALL] ?? 'Vorstand Curling'}\n\temail = vorstand@example.test\n[init]\n\tdefaultBranch = main\n[url "${HAFEN}/"]\n\tinsteadOf = git@aufwind.sh:\n`);
  mkdirSync(join(HAFEN, 'vorlage.git'), { recursive: true });
  git(join(HAFEN, 'vorlage.git'), 'init', '-q', '--bare', '-b', 'main');
  cpSync(join(STAND, 'vorlage'), join(tmp, 'vorlage'), { recursive: true });
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
const BUCHUNG = `Du spielst eine Person ohne Technikwissen: Mira, Inhaberin des Yogaraums Testwil, eines erfundenen kleinen Yogastudios für einen Test (den Ort Testwil gibt es nicht). Du unterrichtest allein im Yogaraum im alten Schulhaus Testwil, höchstens 12 Plätze pro Kurs. Wochenplan: Montag 18.30 Hatha (75 Minuten), Dienstag 9.00 Yoga 60+ (60 Minuten), Dienstag 19.00 Vinyasa (75 Minuten), Mittwoch 18.30 Yin Yoga (75 Minuten), Donnerstag 12.15 Mittagsyoga (45 Minuten), Samstag 9.30 Vinyasa (90 Minuten). Preise: Einzelstunde CHF 28, 10er-Abo CHF 250, bezahlt wird vor Ort bar oder mit TWINT. Du willst eine Webseite, auf der man den Wochenplan sieht und für einen bestimmten Termin einen Platz buchen kann, mit Name und E-Mail, ohne eigenes Konto. Wer bucht, bekommt eine Bestätigung per Mail. Ist ein Kurs voll, soll man nicht mehr buchen können. Du selbst willst sehen, wer gebucht hat, und eine Buchung absagen können (zum Beispiel wenn jemand anruft), am liebsten auch am Handy. Bezahlen online willst du nicht. Kontakt: hallo@yogaraum-testwil.example. Fotos hast du keine. Bei Albatros bist du angemeldet und hast deinen Schlüssel schon hinterlegt (eine Bekannte hat dir das eingerichtet); ein Abo hast du noch keins.
Regeln: Antworte auf Deutsch, kurz (ein bis drei Sätze), wie ein Mensch im Chat. Beantworte nur, was die KI fragt. Schlag nie selbst technische Schritte vor und sag nie, was die KI als Nächstes tun soll. Musst du wählen, wähle selbst etwas Passendes. Nenn nie echte Personen, Adressen oder Telefonnummern. Fragt die KI, welches Abo du willst, ohne eines zu empfehlen: «Ich weiss nicht, was ich brauche. Was empfiehlst du?» Gibt sie dir einen Link zur Zahlungsseite: «Erledigt, ich habe bezahlt.» Fragt sie nach dem Namen der Adresse oder schlägt sie einen vor, antworte immer: «Nimm bitte yogaraum-testwil.» Bittet sie dich, im Browser etwas anzulegen oder einzugeben (Konto, Passwort, Schlüssel für Mails): «Erledigt.» Bittet sie dich, im Terminal etwas zu tippen oder eine Datei zu ändern: «Das traue ich mir noch nicht zu, mach du es bitte und zeig mir, was du geändert hast.» Fragt sie nach Gestaltungselementen: Schlichte Formen oder Icons sind gut, erzeugte Fotos willst du nicht. Fragt sie, ob sie weitermachen, bauen, in den Hafen schicken soll oder ob die Seite so ins Netz darf: «Ja, mach weiter, das darf so ins Netz.» Eine eigene Domain willst du jetzt noch nicht.
Erst wenn die KI meldet, dass die Seite unter https://yogaraum-testwil.aufwind.sh im Netz steht, und sie dir gezeigt hat (eine Vorschau unter localhost heisst noch nicht, dass sie im Netz steht), fragst du einmal: «Super! Wie sehe ich jetzt am Handy, wer gebucht hat, und wie sage ich eine Buchung ab?» Hat sie das erklärt, oder fragt sie nichts mehr, antworte genau: ENDE`;
// Was Mira will, als Soll-Liste für den Richter (gleich wie in BUCHUNG)
const WUENSCHE = 'Wochenplan sichtbar mit allen sechs Kursen: Montag 18.30 Hatha (75 Min), Dienstag 9.00 Yoga 60+ (60 Min), Dienstag 19.00 Vinyasa (75 Min), Mittwoch 18.30 Yin Yoga (75 Min), Donnerstag 12.15 Mittagsyoga (45 Min), Samstag 9.30 Vinyasa (90 Min); höchstens 12 Plätze pro Kurs; Ort Yogaraum im alten Schulhaus Testwil; Preise Einzelstunde CHF 28, 10er-Abo CHF 250, bezahlt vor Ort bar oder TWINT; Platz für einen bestimmten Termin buchen mit Name und E-Mail, ohne Konto; Bestätigung per Mail; voller Kurs nicht mehr buchbar; die Inhaberin sieht, wer gebucht hat, und sagt Buchungen ab, auch am Handy; kein Bezahlen online; Kontakt hallo@yogaraum-testwil.example; keine erzeugten Fotos, schlichte Formen oder Icons';
const { start: ERSTE, vorher: VORHER, person: PERSON } = FALL === 'musikverein'
  ? { start: 'Ich will eine Webseite für unseren Musikverein Testdorf.', vorher: null, person: MUSIKVEREIN }
  : FALL === 'buchung'
    ? { start: 'Ich habe ein kleines Yogastudio und will eine Webseite, auf der man meine Kurse sieht und einen Platz buchen kann.', vorher: null, person: BUCHUNG }
    : { start: `Modernisiere ${ADRESSE}`, vorher: ADRESSE, person: CURLING };

type Eintrag = { wer: 'Person' | 'KI'; text: string; kosten?: number; schritte?: number; sekunden?: number };
const verlauf: Eintrag[] = AUSWERTEN ? JSON.parse(readFileSync(join(ergebnis, 'verlauf.json'), 'utf8')) : [];
let kostenPerson = 0;
// Die KI ergänzt im Skill ssh-schluessel das echte ~/.ssh/config: Nach dem Spiel kommt der alte Stand zurück, ihre Fassung in die Ergebnisse
const SSH_CONFIG = join(homedir(), '.ssh/config'), sshVorher = !AUSWERTEN && !ECHT && existsSync(SSH_CONFIG) ? readFileSync(SSH_CONFIG, 'utf8') : null;
// Wie bausteine/pocketbase/nginx.conf auf dem Server: /api/ (und /_/) an PocketBase weiterreichen
const weiter = async (r: Request, port: number) => {
  const u = new URL(r.url), kopf = new Headers(r.headers);
  kopf.delete('accept-encoding'); // fetch entpackt selbst; gepackt weitergereicht kommt beim Browser kaputt an
  return fetch(`http://127.0.0.1:${port}${u.pathname}${u.search}`, { method: r.method, headers: kopf, body: ['GET', 'HEAD'].includes(r.method) ? undefined : await r.arrayBuffer(), signal: AbortSignal.timeout(10_000) })
    .catch(() => new Response('Bad Gateway', { status: 502 }));
};
if (!AUSWERTEN) {
  // Light: Was im Hafen auf main unter seite/ liegt, ist unter https://<name>.aufwind.sh zu sehen (Abrufe in live.log)
  const live = ECHT ? null : Bun.serve({ port: 4398, hostname: '::', fetch: async (r) => {
    const name = (r.headers.get('host') ?? '').split('.')[0], pfad = decodeURIComponent(new URL(r.url).pathname).replace(/^\/+|\/+$/g, '');
    // Pilot: Statt des Servers antwortet unter /api/ das PocketBase, das die KI lokal laufen lässt (Port 8090)
    if (existsSync(join(HAFEN, 'server')) && name === seiteName() && /^api(\/|$)/.test(pfad)) {
      const a = await weiter(r, 8090);
      appendFileSync(LIVE, `${JSON.stringify({ zeit: new Date().toISOString(), name, pfad: `/${pfad}`, status: a.status })}\n`);
      return a;
    }
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
    writeFileSync(join(ergebnis, 'kosten.json'), JSON.stringify({ person: kostenPerson })); // für --auswerten, falls der Lauf abbricht
    nachricht = (p.result ?? 'Ja, mach weiter.').trim();
    if (/^ENDE\b/.test(nachricht)) { verlauf.push({ wer: 'Person', text: 'ENDE' }); break; }
  }
  live?.stop(true);
  if (sshVorher !== null && readFileSync(SSH_CONFIG, 'utf8') !== sshVorher) {
    writeFileSync(join(ergebnis, 'ssh-config-der-ki.txt'), readFileSync(SSH_CONFIG, 'utf8'));
    writeFileSync(SSH_CONFIG, sshVorher);
  }
}
// Vorschau-Server und andere Reste der KI im Arbeitsordner beenden (RAM): mit dem Ordner in den Argumenten oder als aktuellem
// Ordner (bun bausteine/pocketbase/lokal.ts läuft mit relativem Pfad und eigenem Temp-Ordner)
Bun.spawnSync(['pkill', '-f', `${arbeit}/`]);
let rest = '';
for (const z of Bun.spawnSync(['lsof', '-d', 'cwd', '-Fpn']).stdout.toString().split('\n')) {
  if (z.startsWith('p')) rest = z.slice(1);
  else if (z.startsWith('n') && z.slice(1).startsWith(realpathSync(arbeit)) && rest !== String(process.pid)) try { process.kill(Number(rest)); } catch { /* schon weg */ }
}

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
  const p = Bun.spawn([bin, 'serve', '--http=127.0.0.1:8091', ...pb], { env: ENV, stdout: Bun.file(join(ergebnis, 'probe/pocketbase.log')), stderr: Bun.file(join(ergebnis, 'probe/pocketbase-fehler.log')) });
  for (let i = 0; i < 40; i++) {
    if (await fetch('http://127.0.0.1:8091/api/health').then((r) => r.ok, () => false)) {
      // Mails an den Empfänger oben, wie auf dem Server mit Resend oder Brevo
      const json = { 'content-type': 'application/json' };
      const { token } = await (await fetch('http://127.0.0.1:8091/api/collections/_superusers/auth-with-password', { method: 'POST', headers: json, body: JSON.stringify({ identity: PROBE.mail, password: PROBE.passwort }) })).json() as { token: string };
      const r = await fetch('http://127.0.0.1:8091/api/settings', { method: 'PATCH', headers: { ...json, authorization: token }, body: JSON.stringify({ meta: { senderAddress: 'probe@example.test', senderName: 'Probe' }, smtp: { enabled: true, host: '127.0.0.1', port: 2525, tls: false } }) });
      writeFileSync(join(ergebnis, 'probe/smtp.log'), `${r.status} ${await r.text()}`.slice(0, 2000));
      return p;
    }
    await Bun.sleep(250);
  }
  p.kill();
  return null;
})() : null;
const fotoServer = seite ? (() => {
  const datei = (p: string) => [join(seite, p), join(seite, p, 'index.html'), join(seite, `${p}.html`)].find((x) => existsSync(x) && statSync(x).isFile());
  return Bun.serve({ port: 4399, fetch: (r) => {
    const p = decodeURIComponent(new URL(r.url).pathname);
    if (pocketbase && /^\/(api|_)(\/|$)/.test(p)) return weiter(r, 8091);
    const f = datei(p);
    return f ? new Response(Bun.file(f)) : new Response('nicht gefunden', { status: 404 });
  } });
})() : null;
// Jede Seite (höchstens acht) in Handy- und Desktopbreite
if (seite) for (const s of ['', ...readdirSync(seite, { withFileTypes: true }).flatMap((e) => (e.isFile() && e.name.endsWith('.html') && !['index.html', '404.html'].includes(e.name) ? [e.name.slice(0, -5)]
  : e.isDirectory() && existsSync(join(seite, e.name, 'index.html')) ? [e.name] : []))].slice(0, 8)) for (const b of [390, 1440]) await foto(`http://localhost:4399/${s}`, `nachher-${s || 'start'}-${b}.png`, b);

// Bewertung nach Raster: Protokolle (Albatros, geöffnete Adressen, Hafen), maschinelle Prüfung des Codes, dann ein Richter
const code = seite ? Bun.spawnSync(['grep', '-rnoE', 'linear-gradient|radial-gradient|font-family:[^;]*Inter|[✨🚀🎉💡🔥⭐✅👉🏆🥌]', seite]).stdout.toString().split('\n').filter(Boolean).slice(0, 40) : [];
const lies = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
// Maschinell wie Schritt 7 von webseite-bauen: Zugang (axe) und JavaScript, Lighthouse, Bilder, mit pruefen.mjs auf der gebauten Seite.
// Asynchron, nie spawnSync: das würde den Server der Attrappe blockieren. Ergebnis neben die Bewertung, nicht in die Arbeit der KI.
const maschinell = seite ? await (async () => {
  const aus = join(ergebnis, 'maschinell');
  const pruefen = ['plugins/albatros/skills/webseite-bauen/pruefen.mjs'].map((f) => (existsSync(join(STAND, f)) ? join(STAND, f) : join(repo, f)))[0]!;
  await Bun.spawn(['node', pruefen, '--nur', 'ablaeufe,aussehen,code', '--aus', aus],
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
// Befehle der KI mit Ausgabe (Anfang und Ende), damit der Richter Behauptungen prüfen kann: lief test.ts, lief lokal.ts, wurde gebucht?
// Nur die Sitzung der KI (sie ruft Albatros auf, der Richter nie). Schlüssel, die nach Token aussehen, kommen nicht in die Datei.
type Teil = { type: string; id?: string; name?: string; input?: { command?: string }; tool_use_id?: string; content?: string | { text?: string }[] };
const bash = new Map<string, { zeit: string; befehl: string; ausgabe: string }>();
for (const z of (existsSync(transkripte) ? readdirSync(transkripte).filter((f) => f.endsWith('.jsonl')) : []).map((f) => lies(join(transkripte, f)))
  .filter((t) => t.includes('"mcp__plugin_albatros_albatros__')).flatMap((t) => t.split('\n'))) {
  let x: { timestamp?: string; message?: { content?: Teil[] | string } };
  try { x = JSON.parse(z); } catch { continue; }
  if (Array.isArray(x.message?.content)) for (const c of x.message.content) {
    if (c.type === 'tool_use' && c.name === 'Bash') bash.set(c.id!, { zeit: x.timestamp ?? '', befehl: c.input?.command ?? '', ausgabe: '' });
    const b = c.type === 'tool_result' ? bash.get(c.tool_use_id!) : undefined;
    if (b) { const t = typeof c.content === 'string' ? c.content : (c.content ?? []).map((y) => y.text ?? '').join('\n'); b.ausgabe = t.length > 900 ? `${t.slice(0, 300)}\n…\n${t.slice(-600)}` : t; }
  }
}
writeFileSync(join(ergebnis, 'befehle.md'), [...bash.values()].sort((a, b) => a.zeit.localeCompare(b.zeit)).map((b) => `### ${b.zeit.slice(11, 19)} UTC\n\`\`\`\n$ ${b.befehl.slice(0, 800)}\n${b.ausgabe}\n\`\`\`\n`)
  .join('\n').replace(/sk-[\w-]{16,}|gh[pousr]_\w{20,}|AKIA[0-9A-Z]{16}|re_\w{20,}/g, '[entfernt]'));
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
  server: lies(LOG).split('\n').filter((z) => /^(ssh|scp|rsync|ssh-keygen) /.test(z)).slice(0, 60),
};
writeFileSync(join(ergebnis, 'protokoll.json'), JSON.stringify(protokoll, null, 1));
writeFileSync(join(ergebnis, 'verlauf.md'), verlauf.map((v) => `### ${v.wer}${v.wer === 'KI' ? ` (${v.schritte} Schritte, ${v.sekunden} s, $${(v.kosten ?? 0).toFixed(2)})` : ''}\n\n${v.text}\n`).join('\n'));
const RASTER = `Bewerte einen Durchspiel-Test (Fall ${FALL}${ECHT ? ', gegen die echte Plattform' : ', Albatros als Attrappe'}). Erster Satz der Person: «${ERSTE}». Im Ordner liegen die Arbeit der KI (docs/bestand.md nur beim Modernisieren, sonst kommen die Funktionen aus docs/plan.md; docs/plan.md, docs/mockup.html, docs/gestaltung/, docs/prd.md, die gebaute Seite unter ${seite ?? '(keine gebaute Seite gefunden)'}) und der Gesprächsverlauf ${join(ergebnis, 'verlauf.md')}. Protokoll (gemeldete Schritte an die Insel in Reihenfolge, aufgerufene Albatros-Werkzeuge, im Browser geöffnete Adressen, Einträge im Hafen; ob das PRD vor dem Bau abgenommen war, zeigt der Verlauf, denn nach dem Bau trägt die KI im PRD nach, wo jede Funktion steht): ${JSON.stringify(protokoll)}. Maschinell gefundene Treffer für KI-Merkmale im gebauten Code: ${JSON.stringify(code)}. Maschinelle Prüfung der gebauten Seite mit pruefen.mjs (Zugang nach WCAG mit axe, tote Links, JavaScript je Seite, Lighthouse, Bilder): ${JSON.stringify(maschinell)}.
Die feste Reihenfolge (Skill webseite-bauen, die kleine Fabrik) ist: Auftrag (plan.md oder bestand.md), mockup, entwuerfe (2-3 Entwürfe, daraus docs/designsystem.md und web/src/styles/tokens.css), Tech-Stack (docs/stack.md: Astro mit Grund und JavaScript-Budget ≤ 50 KB je Seite; ein anderes Framework nur auf Wunsch der Person oder wegen einer Funktion), prd (docs/prd.md mit prüfbaren Abnahmekriterien als Checkliste, «Abgenommen:» vor dem Bau, mit Ja der Person), lokal, Prüfung (scripts/pruefen.mjs gelaufen, docs/pruefung/messwerte.json und vier Berichte sicherheit.md, ablaeufe.md, aussehen.md, code.md mit Ampel in einfachen Worten, Abnahmekriterien abgehakt), Freigabe (die Person sagt Ja nach den Berichten, dann «Freigegeben:» in docs/prd.md, vor dem Push), hafen (Push und Hafen im Browser geöffnet), fliessband, live (danach pruefen.mjs --live). Auf der Insel meldet die KI: mockup, entwuerfe, prd, lokal, pruefung (erst wenn die vier Berichte liegen), freigabe (erst nach dem Ja der Person), hafen, fliessband, live; Auftrag und Tech-Stack sind keine Inselschritte. Was die Person sehen soll (Insel, Mockup, Entwürfe, Vorschau, Hafen, Seite), soll die KI mit open öffnen (geoeffnet). Mit Light ist die Seite kurz nach dem Push unter https://<name>.aufwind.sh erreichbar (live_abrufe: Abrufe der KI mit Status). Die KI soll selbst nachschauen, bis sie erreichbar ist, und die Person nicht warten lassen. Der Name der Seite soll der sein, den die Person wollte. ${ECHT ? 'live_pruefung zeigt, ob unter der Adresse wirklich der Titel der gebauten Seite steht; die Fotos fotos/live-* zeigen die Seite im Netz.' : ''}
Prüf mit Lesen (Read, Glob, Grep) und antworte NUR mit JSON:
{"bestand_vorhanden": bool|null, "funktionen": [{"funktion": str, "im_bestand": bool, "auf_neuer_seite": bool, "entscheid_der_person": str|null}], "frage_eigenschaften": {"gestellt": bool, "zitat": str}, "frage_gestaltungselemente": {"gestellt": bool, "zitat": str}, "ki_merkmale": [str], "person_musste_nichts_wissen": {"ok": bool, "beleg": str}, "reihenfolge": {"ok": bool, "ist": [str], "abweichungen": [str]}, "prd_vor_bau": {"ok": bool, "beleg": str}, "insel": {"geoeffnet": bool, "alle_schritte_gemeldet": bool, "fehlend": [str]}, "hafen": {"gepusht": bool, "im_browser_geoeffnet": bool}, "live": {"selbst_geprueft": bool, "erreicht": bool, "person_warten_lassen": bool, "name_wie_gewuenscht": bool}, "designsystem": {"datei": bool, "nur_tokens": bool, "beleg": str}, "stack": {"datei": bool, "entscheid": str, "grund_ok": bool, "js_budget": bool}, "abnahmekriterien": {"vorhanden": bool, "pruefbar": bool, "anzahl": int, "abgehakt_nach_pruefung": bool, "beleg": str}, "pruefberichte": {"vorhanden": [str], "ampeln": {"sicherheit": str|null, "ablaeufe": str|null, "aussehen": str|null, "code": str|null}, "messwerte_gelaufen": bool, "einfach_erklaert": bool, "rot_vor_freigabe_behoben": bool}, "freigabe_vor_push": {"ok": bool, "beleg": str}, "aenderung": {"gewuenscht": bool, "skill_webseite_aendern": bool, "docs_gelesen": bool, "im_prd": bool, "nur_designsystem": bool, "vorher_nachher_gezeigt": bool, "freigabe_vor_push": bool, "im_netz": bool, "beleg": str}|null, "maschinell": {"zugang_ok": bool, "js_budget_ok": bool, "lighthouse_ok": bool, "befunde": [str]}, "gestaltung": {"kopf_foto": bool, "kopf_wichtigstes_gross": bool, "gleiche_karten": bool, "menue_390_ok": bool, "behauptungen_stimmen": bool, "urteil": "eigenstaendig"|"schlicht"|"vorlage", "beleg": str}, "seite_gebaut": bool, "haengen_geblieben": [str], "kurzurteil": str}
Wünscht die Person nach dem Live-Gang eine Änderung, gilt für sie der Skill webseite-aendern (protokoll.skills): Hafen holen, zuerst docs/ lesen (Designsystem, Stack, PRD), die Änderung nur mit Werten aus dem Designsystem und Termine in web/src/data, als Abnahmekriterium unter «Änderungen» in docs/prd.md, bauen, pruefen.mjs, vorher und nachher zeigen, Freigabe, dann Push und selbst im Netz nachschauen; ohne Änderungswunsch ist «aenderung» null. «person_musste_nichts_wissen» ist nur ok, wenn die Person nie selbst einen nächsten Schritt vorschlagen oder Technik erklären musste. Eine Funktion gilt als vorhanden, wenn die neue Seite sie zeigt oder ersetzt; fällt sie weg, braucht es einen Entscheid der Person im Verlauf. «gestaltung» beurteilst du nur anhand der Fotos der Startseite (fotos/nachher-start-*.png, mit --echt fotos/live-start-*.png; Read zeigt Bilder), nicht anhand dessen, was die KI über ihre Seite schreibt: Steht im ersten Bild ein echtes Foto? Steht ohne Foto das Wichtigste (zum Beispiel der nächste Termin) gross im Kopf, nicht in einer Karte darunter? Stehen gleich gestaltete Karten neben- oder untereinander? «menue_390_ok» ist true, wenn das Menü bei 390 px auf eine Zeile passt oder ein Knopf «Menü» ist; beides ist richtig und kein KI-Merkmal, falsch ist nur ein umbrechendes Menü. «behauptungen_stimmen» ist false, sobald docs/gestaltung/richtungen.md, docs/pruefung/aussehen.md oder der Verlauf etwas über Kopf, Karten oder KI-Merkmale sagt, das die Fotos nicht zeigen. «urteil»: «vorlage», wenn die Seite wie eine Vorlage wirkt (Titel, Satz und Knopf im Kopf, darunter gleiche Kästen), «schlicht», wenn sie klar nach Wichtigkeit geordnet, aber ohne Bild ist, sonst «eigenstaendig». KI-Merkmale zählst du nach dem Muster, nicht nach dem Wortlaut: ein Knopf statt zwei oder Karten untereinander statt nebeneinander sind dasselbe Merkmal.`;
const WERKZEUGE = join(homedir(), '.cache', 'albatros-pruefen'); // Playwright aus pruefen.mjs
const BUCHUNG_RASTER = `Fall buchung: Die Inhaberin eines kleinen Yogastudios will den Wochenplan zeigen und Plätze buchen lassen (Name, E-Mail, Bestätigung per Mail, ein voller Kurs nimmt nichts mehr an, sie sieht und storniert Buchungen, auch am Handy; kein Bezahlen online). Sie hatte noch kein Abo. Erwartet: Die KI erkennt, dass ein Buchungstool ein Programm braucht, empfiehlt Pilot mit kurzem Grund (upgrade_link mit stufe pilot, dann server_erstellen), nimmt den Baustein PocketBase (Skill bausteine: Foto mit snapshot vor dem Einbau, ADRESSE in 1_einstellungen.js) statt eigenem Server-Code, lässt das Tool lokal laufen und prüft es selbst. In der Attrappe gibt es keinen Server: Was im Hafen auf main unter seite/ liegt, ist kurz nach dem Push unter https://<name>.aufwind.sh zu sehen, /api/ dort geht an das PocketBase, das die KI lokal auf Port 8090 laufen lässt; ssh, scp und rsync zum Server stehen nur im Protokoll (protokoll.server). Bewerte nicht, dass der Server fehlt, sondern ob die KI ihn richtig benutzt hätte.
${pocketbase ? `Probe: Unter http://localhost:4399 läuft jetzt die gebaute Seite (${seite}) mit einem frischen PocketBase aus den Migrationen der KI (${migrationen}${hooks ? `, Hooks aus ${hooks}` : ', ohne pb_hooks'}); /api/ und /_/ gehen dorthin wie auf dem Server. Konto der Verwaltung nur für diese Probe: ${PROBE.mail} / ${PROBE.passwort}. Mails von PocketBase gehen an einen lokalen SMTP-Empfänger und landen in ${MAILS}. Prüf jeden Punkt selbst mit Playwright, headless: Skripte schreibst du nur nach ${join(ergebnis, 'probe')} (Write und Bash sind dafür erlaubt, frag nicht nach), ausführen mit NODE_PATH=${WERKZEUGE}/node_modules node <skript>.cjs, den Browser am Ende jedes Skripts schliessen. Testdaten (zum Beispiel einen Termin in der Vergangenheit, einen Kurs mit einem Platz) legst du über die API mit dem Konto der Verwaltung an; an der Arbeit der KI änderst du nichts. Nutze nur http://localhost:4399, Port 8091 und die Datei der Mails; andere Dienste auf diesem Rechner gehören anderen und sind tabu. Fotos des Ablaufs nach ${join(ergebnis, 'fotos')}/probe-<was>-<390|1440>.png.` : `Probe: Kein PocketBase gefunden oder es startete nicht (Protokolle in ${join(ergebnis, 'probe')}). Prüf dann aus dem Code, ob das Buchungstool so funktionieren würde.`}
Prüfpunkte: (1) Ein Platz in einem kommenden Termin lässt sich im Browser buchen, die Seite bestätigt es. (2) Ein voller Termin nimmt keine Buchung mehr an, auch nicht direkt über die API. (3) Vergangene Termine sind nicht buchbar, auch nicht über die API. (4) Die Inhaberin sieht die Buchungen und kann eine absagen, danach ist der Platz wieder frei; am Handy geht das auch. (5) Bestätigung: welcher Text erscheint auf der Seite, welche Mail geht raus (Kurs, Datum, Zeit, Ort, wie man absagt), und ist der Mailversand auf dem Server eingerichtet oder der Person erklärt. (6) Fremde sehen ohne Anmeldung keine Namen oder E-Mails anderer, weder auf der Seite noch unter /api/collections/<name>/records. (7) Zustände: leer (keine Termine), lädt, Fehler (PocketBase nicht erreichbar, zum Beispiel mit page.route auf /api/ abbrechen). (8) Handybreite 390 px: Wochenplan und Buchung ohne Zoom bedienbar, nichts abgeschnitten, Knöpfe mindestens 44 px hoch. (9) Gestaltung: Schau die Fotos ${join(ergebnis, 'fotos')}/nachher-*.png selbst an und prüf sie gegen die KI-Merkmale im Skill gestaltung (${join(tmp, 'plugin/skills/gestaltung/SKILL.md')}). (10) Läuft auf dem Server dasselbe wie lokal: Kopiert das Dockerfile des Bausteins alles, was das Tool braucht (zum Beispiel pb_hooks), und ist der Baustein in compose.yaml eingehängt? (11) Rezept: Gibt es im Stand der Skills (Archiv ${join(tmp, 'albatros-skills-main.tar.gz')}, ansehen mit tar tzf) ein Rezept bausteine/pocketbase/rezepte/buchungen, nimmt die KI es statt selbst etwas zu bauen, lässt sie dessen test.ts laufen (Verlauf, Transkript) und passt sie seite/buchen.html an die Tokens der Seite an (Farben, Schriften, Abstände aus tokens.css statt eigener Werte)?
Der Richter glaubt nichts ungeprüft. (12) Behauptungen: Jede abgehakte Zeile in docs/prd.md und jedes «grün» in docs/pruefung/*.md, die das Buchungstool, die Tests, die Handybreite oder Impressum und Datenschutz betreffen, prüfst du gegen ${join(ergebnis, 'befehle.md')} (alle Befehle der KI mit Ausgabe, Zeiten in UTC) und gegen deine Probe: Lief test.ts wirklich, mit welchem Ergebnis? Lief lokal.ts (oder sonst ein PocketBase) wirklich, und wurde dort wirklich gebucht? Zeiten der Albatros-Aufrufe, auch schritt_melden, stehen in ${LOG}. (13) Wünsche der Person: ${WUENSCHE}. Gleich die gebaute Seite und den Verlauf damit ab: Was davon sieht eine Besucherin wirklich, was fehlt, was ist erfunden? (14) Jede Seite bei 390 px: Kopf mit Menü und Fuss mit Impressum und Datenschutz vorhanden, links und rechts mindestens 12 px Luft, nichts lässt sich seitlich schieben; miss es selbst in der Probe mit Playwright, auch für buchen.html und verwaltung.html, und nimm die Messung von pruefen.mjs (Bereich aussehen) dazu. (15) Sieben Schritte: Der Skill bausteine (${join(tmp, 'plugin/skills/bausteine/SKILL.md')}, Abschnitt «Buchungen») nennt sieben Schritte. Folgt die KI ihnen in dieser Reihenfolge (Verlauf, befehle.md, Zeiten)? Steht pb_migrations/3_kurse.js mit den echten Kursen der Person, bevor gebaut wird? Ist die Buchungsseite eine Seite im Layout der Seite (Kopf, Menü, Fuss) und BUCHUNGSSEITE in pb_hooks/buchungen.js gesetzt? Gibt es «Meine Buchungen» (verwaltung.html), und funktioniert sie in der Probe (wer kommt, absagen mit Grund)? Sagt die KI der Person ehrlich, was vor dem Teilen der Adresse noch fehlt (zum Beispiel Mails), bevor sie «fertig» sagt? (16) Einfachheit: Zähl im Verlauf jede Stelle, an der die Person etwas Technisches tun oder verstehen musste (Befehle, Fachwörter, Dateien, Verwaltung von PocketBase), und ob es mit einem Bild erklärt war.
Ergänze das JSON um "buchung": {"behauptungen": [{"behauptung": str, "wo": str, "stimmt": bool, "beleg": str}], "wuensche": [{"wunsch": str, "erfuellt": bool, "beleg": str}], "seiten_390": [{"seite": str, "kopf_menue_fuss": bool, "impressum_datenschutz": bool, "rand_ok": bool, "schiebt_seitlich": bool}], "sieben_schritte": {"in_reihenfolge": bool, "ist": [str], "fehlend_oder_falsch": [str], "beleg": str}, "kurse_vor_bau": {"datei_3_kurse": bool, "kurse_echt": bool, "vor_dem_bau": bool, "beleg": str}, "buchungsseite": {"im_layout": bool, "buchungsseite_gesetzt": bool, "beleg": str}, "meine_buchungen": {"vorhanden": bool, "funktioniert": bool, "beleg": str}, "ehrlich_vor_teilen": {"ok": bool, "beleg": str}, "einfachheit": {"technische_stellen": [str], "ohne_bild_erklaert": [str], "urteil": str}, "rezept": {"vorhanden": bool, "genommen": bool|null, "test_ts_gelaufen": bool|null, "buchen_html_mit_tokens": bool|null, "beleg": str}, "abo": {"empfohlen": str, "grund_verstaendlich": bool, "upgrade_link_pilot": bool, "server_erstellt": bool, "snapshot_vor_baustein": bool, "beleg": str}, "baustein": {"welcher": str, "eingebaut": bool, "adresse_gesetzt": bool, "server_gleich_wie_lokal": bool, "beleg": str}, "lokal_von_ki_geprueft": {"ok": bool, "beleg": str}, "buchung_im_browser": P, "voller_kurs_gesperrt": P, "vergangen_nicht_buchbar": P, "inhaberin_sieht_und_storniert": P, "bestaetigung": {"ok": bool, "seite": str, "mail": str|null, "mailversand_eingerichtet_oder_erklaert": bool}, "buchungen_privat": P, "zustaende": {"leer": bool, "laedt": bool, "fehler": bool, "beleg": str}, "handy_390": P, "nicht_nach_ki": {"ok": bool, "merkmale": [str]}, "uebergabe_inhaberin": {"erklaert": bool, "beleg": str}, "fehler_im_tool": [str]} mit P = {"ok": bool, "beleg": str}. Ein Prüfpunkt ist nur ok, wenn du ihn in der Probe selbst gesehen hast; schreib in «beleg», was du getan und gesehen hast. «lokal_von_ki_geprueft» ist nur ok, wenn befehle.md zeigt, dass die KI das Tool laufen liess und darin gebucht hat; eine Behauptung in einem Bericht reicht nicht. «nicht_nach_ki» prüfst du an den Fotos: drei oder mehr gleich gebaute Karten in einer Reihe zählen als Merkmal, auch ohne Icons und Schatten.`;
const urteil = FALL === 'buchung'
  ? await claude(arbeit, ['--model', 'sonnet', '--allowedTools', 'Read,Glob,Grep,Bash,Write', '--add-dir', ergebnis, '--add-dir', join(tmp, 'plugin')], `${RASTER}\n${BUCHUNG_RASTER}`, 40)
  : await claude(arbeit, ['--model', 'sonnet', '--allowedTools', 'Read,Glob,Grep', '--add-dir', ergebnis], RASTER, 15);
fotoServer?.stop(true);
pocketbase?.kill();
smtp?.stop(true);
const json = (urteil.result ?? '').match(/\{[\s\S]*\}/)?.[0] ?? '{}';
writeFileSync(join(ergebnis, 'bewertung.json'), json);
for (const f of Bun.spawnSync(['find', arbeit, '-path', '*/docs/*', '-maxdepth', '4', '(', '-name', 'bestand.md', '-o', '-name', 'plan.md', '-o', '-name', 'prd.md', '-o', '-name', 'richtungen.md', '-o', '-name', 'mockup.html', '-o', '-name', 'designsystem.md', '-o', '-name', 'stack.md', '-o', '-path', '*/docs/pruefung/*.md', ')']).stdout.toString().split('\n').filter(Boolean)) cpSync(f, join(ergebnis, f.split('/').pop()!));
for (const d of [migrationen, hooks]) if (d) cpSync(d, join(ergebnis, 'pocketbase', d.split('/').pop()!), { recursive: true });
if (existsSync(MAILS)) cpSync(MAILS, join(ergebnis, 'mails.txt'));
const kostenKI = verlauf.reduce((s, v) => s + (v.wer === 'KI' ? v.kosten ?? 0 : 0), 0);
if (AUSWERTEN && existsSync(join(ergebnis, 'kosten.json'))) kostenPerson = JSON.parse(readFileSync(join(ergebnis, 'kosten.json'), 'utf8')).person ?? 0;
const kosten = { ki: +kostenKI.toFixed(2), person: +kostenPerson.toFixed(2), richter: +(urteil.total_cost_usd ?? 0).toFixed(2), runden: verlauf.filter((v) => v.wer === 'KI').length, stand: lies(join(tmp, 'stand.txt')) || null, arbeitsordner: arbeit };
writeFileSync(join(ergebnis, 'kosten.json'), JSON.stringify(kosten, null, 1));
console.log(`\nErgebnis: ${ergebnis}\nKosten: ${JSON.stringify(kosten)}\nBewertung: ${json.slice(0, 1500)}`);
