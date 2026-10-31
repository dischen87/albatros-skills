// Test von pruefen.mjs (Skill webseite-bauen) mit den Testseiten in diesem Ordner: je Fall ein kleines Projekt mit erwartet.json.
//   bun scripts/testseiten/test.ts            alle Fälle; --vergleich lädt beim ersten Mal Playwright und Chromium nach ~/.cache
//   bun scripts/testseiten/test.ts tueren     nur die Fälle, deren Name das Wort enthält
// erwartet.json: befehl (Schalter für pruefen.mjs, {attrappe} wird die Adresse der Attrappe unten), exit, ausgabe (Texte in der
// Ausgabe), messwerte (Datei, die pruefen.mjs nach --aus schreibt), ampel (je Bereich), punkte (Texte, die genau so als Punkt
// vorkommen), nicht (Texte, die weder in der Ausgabe noch in einem Punkt vorkommen). Messwerte gehen in einen Temp-Ordner.
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Erwartet = { befehl: string[]; exit: number; ausgabe?: string[]; messwerte?: string; ampel?: Record<string, string>; punkte?: string[]; nicht?: string[] };
type Messwerte = { bereiche: Record<string, { ampel: string; punkte: { ampel: string; text: string }[] }> };

const hier = import.meta.dir;
const PRUEFEN = join(hier, '../../plugins/albatros/skills/webseite-bauen/pruefen.mjs');
const nur = process.argv[2];
let fehler = 0;

// Attrappe eines Bausteins auf diesem Computer: Umleitungen und Türen, die ohne Anmeldung zu bleiben, wie sie ein Eingang beantwortet
const attrappe = Bun.serve({
  port: 0,
  hostname: '127.0.0.1',
  fetch(req) {
    const p = new URL(req.url).pathname;
    if (p === '/impressum') return new Response(null, { status: 301, headers: { location: '/impressum/' } });
    if (p === '/mitglieder') return new Response(null, { status: 302, headers: { location: '/anmelden' } });
    if (p === '/verwaltung') return new Response('Nicht erlaubt', { status: 403 });
    if (['/', '/impressum/', '/anmelden', '/geheim'].includes(p)) return new Response('<h1>Hallo</h1>', { headers: { 'content-type': 'text/html' } });
    return new Response('Nicht gefunden', { status: 404 });
  },
});

const faelle = readdirSync(hier, { withFileTypes: true }).filter((e) => e.isDirectory() && (!nur || e.name.includes(nur))).map((e) => e.name).sort();
for (const fall of faelle) {
  const ordner = join(hier, fall);
  const e: Erwartet = JSON.parse(readFileSync(join(ordner, 'erwartet.json'), 'utf8'));
  const aus = mkdtempSync(join(tmpdir(), `testseiten-${fall}-`));
  const befehl = e.befehl.map((x) => x.replace('{attrappe}', `http://127.0.0.1:${attrappe.port}`));
  const r = Bun.spawn(['node', PRUEFEN, ...befehl, '--aus', aus], { cwd: ordner, stdout: 'pipe', stderr: 'pipe' });
  const [stdout, stderr, exit] = await Promise.all([new Response(r.stdout).text(), new Response(r.stderr).text(), r.exited]);
  const ausgabe = stdout + stderr;
  const m: Messwerte | null = e.messwerte && existsSync(join(aus, e.messwerte)) ? JSON.parse(readFileSync(join(aus, e.messwerte), 'utf8')) : null;
  const punkte = m ? Object.values(m.bereiche).flatMap((b) => b.punkte.map((x) => x.text)) : [];
  const ergebnisse: [boolean, string][] = [
    [exit === e.exit, `Ende mit ${e.exit}${exit === e.exit ? '' : ` (war ${exit})`}`],
    ...(e.ausgabe ?? []).map((t): [boolean, string] => [ausgabe.includes(t), `Ausgabe enthält «${t}»`]),
    ...(e.messwerte ? [[!!m, `${e.messwerte} geschrieben`] as [boolean, string]] : []),
    ...Object.entries(e.ampel ?? {}).map(([b, a]): [boolean, string] => [m?.bereiche[b]?.ampel === a, `${b}: ${a}${m?.bereiche[b]?.ampel === a ? '' : ` (war ${m?.bereiche[b]?.ampel})`}`]),
    ...(e.punkte ?? []).map((t): [boolean, string] => [punkte.includes(t), `Punkt «${t}»`]),
    ...(e.nicht ?? []).map((t): [boolean, string] => [!ausgabe.includes(t) && !punkte.some((x) => x.includes(t)), `nirgends «${t}»`]),
  ];
  console.log(`\n${fall}: node pruefen.mjs ${befehl.join(' ')}`);
  for (const [ok, was] of ergebnisse) console.log(`${ok ? '✓' : '✗'} ${was}`);
  // Bei einem Fehler zeigen, was pruefen.mjs wirklich gesagt hat
  if (ergebnisse.some(([ok]) => !ok)) {
    fehler += ergebnisse.filter(([ok]) => !ok).length;
    console.log(`  Ausgabe:\n${ausgabe.trim().replace(/^/gm, '    ')}${punkte.length ? `\n  Punkte:\n${punkte.map((x) => `    ${x}`).join('\n')}` : ''}`);
  }
  rmSync(aus, { recursive: true, force: true });
}
attrappe.stop();
console.log(fehler ? `\n${fehler} Prüfungen gescheitert.` : `\n${faelle.length} Fälle wie erwartet.`);
process.exit(fehler ? 1 : 0);
