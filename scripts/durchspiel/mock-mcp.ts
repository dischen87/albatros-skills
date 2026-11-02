// Attrappe des MCP-Diensts von Albatros für den Durchspiel-Test (stdio, JSON-RPC je Zeile), so wie Albatros mit den Schaltern FAHRPLAN und
// ERFASSUNG antwortet (Plan «Fahrplan und Lernschleife»). Keine Zahlung, kein Server: Albatros wird nie echt angesprochen.
// - Mit Zustand im Ordner DURCHSPIEL_HAFEN: lage nach dem Fahrplan (Phase aus Insel und belege wie albatros services/mcp/src/lage.ts: die
//   Insel als Boden, die Belege lückenlos weiter; offene Pflichtfragen, Ergebnis, Gate, Gratis-Hinweis, Modus, im Modus lernen die Lektion,
//   Methoden vor oder nach dem Skill, Hinweis zur Erfassung bis luecke_melden mit einverstanden), schritt_melden, weg_waehlen, modus_waehlen,
//   verstanden_melden, skill_holen, luecke_melden, upgrade_link (ohne Abo vor P11 ohne bestaetigt nur der Gratis-Hinweis, sonst gilt das
//   Abo als bezahlt), methode, konto_status, schluessel_hinterlegen, mission_holen und mission_pruefen (Prüfung insel gegen die Insel).
//   seite_erstellen und server_erstellen legen den Hafen unter dem Namen an (Kopie von vorlage.git).
// - Feste Texte: zuerst scripts/durchspiel/mocks/<fall>/<werkzeug>.md (überschreibt auch die Werkzeuge mit Zustand), sonst für die übrigen
//   scripts/durchspiel/mocks/<werkzeug>.md oder plugins/albatros/evals/mocks/albatros/<werkzeug>.md; je nach Stand zuerst
//   <werkzeug>.server.md, .seite.md, .<abo>.md. Platzhalter: {repo}, {name} (Name der Seite), {stand} (zuletzt veröffentlicht), {stufe}.
// Umgebung: DURCHSPIEL_STAND (Stand der Skills im Lauf mit fahrplan.yaml, missionen/, plugins/albatros), DURCHSPIEL_FALL, DURCHSPIEL_STUFE
// (gratis, light, pilot), DURCHSPIEL_SCHLOESSER, DURCHSPIEL_LOG (jeder Aufruf als JSON-Zeile mit Runde), DURCHSPIEL_RUNDE (Datei mit der
// Nummer der laufenden Runde), DURCHSPIEL_METHODEN (Ordner mit <name>/SKILL.md, sonst ../albatros-methoden/skills neben diesem Repo),
// DURCHSPIEL_BAUSERVICE=on (Bauservice wie mit dem Schalter BAUSERVICE: auftrag_anlegen und in lage die Zeile «Angebot:», unten bei «Bauservice»).
// Beschreibungen und Parameter der Werkzeuge und die Anleitung wie beim echten Dienst mit FAHRPLAN, ERFASSUNG und BAUSERVICE (mocks/werkzeuge.json,
// mocks/anleitung.txt); Eingaben prüft sie auf jeder Ebene wie zod im echten Dienst (auch in Listen und Objekten darin, unten bei «Eingaben
// wie zod») und antwortet wie er mit «Ungültige Angaben»; ein Werkzeug, das sie nicht anbietet, und eine unbekannte Methode sind wie dort
// Fehler von JSON-RPC (-32602, -32601). Seit Welle 7 (01.11.2026, Sichtung sicht-05, w7-20) auch wie er: titel
// gekürzt (kuerzeTitel) und Schritte mit ihrem Namen auf der Insel, verstanden_melden mit den Regeln und Sätzen von flugschule (409),
// coach_fragen ohne Abo mit dem Satz von mcp, luecke_melden mit dem Satz von flugschule, offene Pflichtfragen mit den deutschen
// Anfangswörtern wie lage. scripts/durchspiel.test.ts vergleicht das mit dem echten mcp, wenn albatros daneben liegt.
// Neu erzeugen im Repo albatros, Ordner services/mcp, mit Z=…/albatros-skills/scripts/durchspiel/mocks:
// (seit Welle 8 kann nurMit eine Liste sein: sichtbarBei aus services/mcp/src/gemeinsam.ts wie tools/list; mit BAUSERVICE steht auftrag_anlegen
// in werkzeuge.json, die Attrappe bietet es trotzdem nur mit DURCHSPIEL_BAUSERVICE=on an; Welle 9, 02.11.2026)
//   bun -e "import { z } from 'zod'; import { WERKZEUGE } from './src/werkzeuge.ts'; import { sichtbarBei } from './src/gemeinsam.ts'; import { anleitung } from './src/lage.ts';
//     const an = { FAHRPLAN: true, ERFASSUNG: true, BAUSERVICE: true }; const liste = WERKZEUGE.filter((w) => sichtbarBei(w, an))
//     .map((w) => { const { \$schema: _, ...inputSchema } = z.toJSONSchema(w.eingabe, { io: 'input' }); return { name: w.name, description: w.description, inputSchema }; });
//     await Bun.write('$Z/werkzeuge.json', JSON.stringify(liste, null, 1) + '\n'); await Bun.write('$Z/anleitung.txt', anleitung(an) + '\n');"
import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ladeFahrplan, type Phase, type Pflichtfrage } from '../fahrplan.ts';
import {
  ausgangZaehlt, beantwortet, belegt, bisAbschluss, entscheidVon, erledigtNachDateien, erledigtNachInsel, frageBelegt, freieMethoden, jaBelegt, phaseBelegt, phaseIndex, wert,
  wertPasst, wohnortVon, type Fuer,
} from '../punkte.ts';
import { hoeher as neuer } from '../stand.ts';

type Args = Record<string, unknown>;
type Antwort = { text: string; fehler?: boolean };
type Beleg = { datei: string; zeilen: string[] };

const wurzel = new URL('../..', import.meta.url).pathname;
const QUELLE = process.env.DURCHSPIEL_STAND ? `${process.env.DURCHSPIEL_STAND.replace(/\/$/, '')}/` : wurzel;
const FALL = process.env.DURCHSPIEL_FALL;
const HAFEN = process.env.DURCHSPIEL_HAFEN;
const METHODEN = process.env.DURCHSPIEL_METHODEN ?? join(wurzel, '../albatros-methoden/skills');
const fallOrdner = FALL ? join(wurzel, 'scripts/durchspiel/mocks', FALL) : null;
const ordner = [join(wurzel, 'scripts/durchspiel/mocks'), join(wurzel, 'plugins/albatros/evals/mocks/albatros')];
const geladen = await ladeFahrplan(QUELLE);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const F = geladen.fahrplan;
const SKILLS_STAND: string = JSON.parse(readFileSync(join(QUELLE, 'plugins/albatros/.claude-plugin/plugin.json'), 'utf8')).version;

// ———— Zustand ————
const merk = (d: string) => (HAFEN && existsSync(join(HAFEN, d)) ? readFileSync(join(HAFEN, d), 'utf8').trim() || null : null);
const setze = (d: string, w: string) => { if (HAFEN) writeFileSync(join(HAFEN, d), w); };
const stufe = () => merk('abo') ?? process.env.DURCHSPIEL_STUFE ?? 'light';
const schloesser = () => Number(merk('schloesser') ?? process.env.DURCHSPIEL_SCHLOESSER ?? '1');
const seiteName = () => merk('seite');
const insel = () => merk('insel');
const rang = (s: string | null) => F.insel.indexOf(s ?? '') + 1;
const stand = (n: string) => {
  const zeit = spawnSync('git', ['--git-dir', join(HAFEN!, n, 'projekt.git'), 'log', '-1', '--format=%cd', '--date=format:%d.%m.%Y %H:%M', 'main', '--', 'seite']).stdout?.toString().trim();
  return zeit ? `zuletzt veröffentlicht ${zeit}` : 'noch nichts veröffentlicht';
};

// ———— Feste Texte ————
const text = (o: string, werkzeug: string, a: Args) => {
  const n = seiteName();
  const abo = merk('abo');
  for (const z of [merk('server') && '.server', n && '.seite', abo && `.${abo}`, ''].filter((x) => x !== null)) {
    const f = join(o, `${werkzeug}${z}.md`);
    if (existsSync(f)) {
      return readFileSync(f, 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim().replaceAll('{repo}', wurzel.replace(/\/$/, ''))
        .replaceAll('{name}', String(a.name ?? n ?? 'curling-grindelwald')).replaceAll('{stand}', n ? stand(n) : '').replaceAll('{stufe}', String(a.stufe ?? abo ?? 'pilot'));
    }
  }
  return null;
};

// ———— lage nach dem Fahrplan ————
const STUFEN: Record<string, string> = { gratis: 'Gratis', light: 'Light', pilot: 'Pilot' };
const PREIS: Record<string, number> = { light: 15, pilot: 40 };
const skill = (slug: string) => `Skill \`${slug}\``;
const methodeText = (ms: string[]) => `${ms.map((m) => `Methode \`${m}\``).join(' und ')} (holen mit dem Werkzeug methode)`;
const GRATIS_HINWEIS = 'Bis zur fertigen Seite auf deinem Computer kostet Albatros nichts. Erst beim Wohnort wählst du: mit Albatros oder selbst.';
const gratisBis = phaseIndex(F, F.gratis_bis);
// Methoden ohne Abo: die der Phasen bis zur Gratis-Grenze (punkte.ts freieMethoden, wie GRATIS.methoden in albatros services/konto/src/stufen.ts)
const GRATIS_METHODEN = freieMethoden(F, 'gratis') ?? [];
// Entscheid des Ideen-Checks wie lage (kit entscheidVon, hier aus punkte.ts): Datei und Zeile aus ausgaenge im Vertrag (P1)
const MIT_AUSGANG = F.phasen.find((p) => p.ausgaenge)!;
const AUSGANG_DATEI = MIT_AUSGANG.ausgaenge!.ablage.split('#')[0]!;
// Was zum Ausgang fehlt, wie lage: «Entscheid: weiter» oder «Entscheid: stoppen» in docs/ideen-check.md
const ausgangText = (p: Phase) => {
  const [datei, zeile] = p.ausgaenge!.ablage.split('#') as [string, string];
  return `${p.ausgaenge!.geschafft.map((x) => `«${zeile} ${x}»`).join(' oder ')} in ${datei}`;
};
const bisText = (n: number) => (n ? `bis ${F.phasen[n - 1]!.id}` : 'keine');
const wer = (p: Phase, q: Pflichtfrage) => (q.antwortet === 'ki' ? 'klärst du selbst' : q.antwortet === 'annahme_ok' ? 'als [Annahme] vorschlagen'
  : F.ja_momente.some((j) => j.phase === p.id && j.frage === q.id) ? 'die Person antwortet; Ja-Moment: nur ihr ausdrückliches Ja zählt, mit Datum vorne' : 'die Person antwortet, eine [Annahme] zählt nicht');
// Methoden vor oder nach dem Skill wie im Vertrag (methoden.wann), wie lage
const mitMethoden = (p: Phase, skillText: string, ms: string[]) => (!ms.length ? skillText
  : p.methoden?.wann === 'nach_skill' ? `${skillText}, dann ${methodeText(ms)}, sobald der Skill sie nennt` : `${methodeText(ms)}, dann ${skillText}`);
// Erfassung wie Albatros mit ERFASSUNG: solange die Person nichts gesagt hat (luecke_melden ohne einverstanden), der Hinweis; Anfragen erlaubt
// die Person nur im Cockpit, im Durchspiel also nie
const HINWEIS_ERFASSUNG = 'Hinweis zur Erfassung: Albatros speichert, welche Werkzeuge deine KI aufruft, nie deine Unterhaltung mit ihr. Lücken und Anfragen nur, wenn du sie erlaubst. Ansehen und widersprechen kannst du unter https://albatros.build/cockpit/daten.';

// ———— Bauservice (Welle 8, w8-44; Welle 9, w9-42; Konzept «Albatros baut es für dich», 3.1) ————
// Mit DURCHSPIEL_BAUSERVICE=on wie lage, konto_status und auftrag_anlegen mit FAHRPLAN und BAUSERVICE, Regeln und Wortlaut aus albatros
// services/mcp/src/bauservice.ts (Nachbesserung 02.11.2026 nach der Gegenprobe: vorher eigene Sätze, P6 als «Danach» bei «Bauen lassen:
// albatros», «Phase P6» im Stand, «danach Light» auch für Light, bestaetigt nur true). scripts/durchspiel.test.ts vergleicht mit dem echten mcp,
// wenn albatros den Bauservice hat. Nicht nachgebaut: abgelaufene Vorschläge und Vorschau (braucht die Stücke des Auftrags in konto).
// Welle 9 (02.11.2026, w9-42, Stand albatros efe228c): R2 «vorschlaege» mit den Angaben fürs Impressum (J5), Ziel server (eigener Server oder
// Pilot) ohne Bezahlen und ohne Betrag in lage, konto_status und auftrag_anlegen, R3 nach der Auslieferung (J4: warten bis zur Freigabe auf der
// Insel, Schlüssel, Logbuch holen, danach die erste eigene Änderung, Domain und Ankündigung freiwillig), konto_status nach live. Dazu die
// Nahtstellen nach Welle 9 (albatros 6540052): «Setup: [Annahme: statisch …]» gibt kein Angebot, nur die bestätigte Antwort, die mit statisch
// beginnt; R1b übergibt nur mit diesem Setup und ohne eigenen Server (sonst der normale Fahrplan mit dem Hinweis, was gilt, bis P6 geschafft);
// auftrag_anlegen braucht setup und lehnt ohne Setup statisch oder mit Pilot oder eigenem Server ab, ohne Auftrag; «Danach» und die Antwort
// von auftrag_anlegen nennen den Projektordner.
// Die Attrappe ist hier auch konto: Stand des Auftrags in der Datei auftrag im Hafen, Betrag wie GET /web/auftrag (stufen.ts AUFTRAG.preisChf und
// Light; durchspiel.test.ts gleicht mit albatros ab). scripts/punkte.ts liest die Beträge aus den Antworten, nie von hier. Im Durchspiel (mit
// DURCHSPIEL_RUNDE) arbeitet Albatros zwischen den Runden: Jede neue Runde, in der die KI lage oder konto_status aufruft, rückt der Auftrag einen
// Stand weiter (briefing, vorschlaege, im_bau, vorschau; die Wahl der Person im Cockpit und der Start des Baus auf dem Mac sind ein Schritt), bis
// zur Vorschau; bezahlt wird im Durchspiel nie. Ohne DURCHSPIEL_RUNDE (Vergleichstest) bleibt der Stand, wie die Datei auftrag ihn nennt.
const BAUSERVICE = process.env.DURCHSPIEL_BAUSERVICE === 'on';
const AUFTRAG_CHF = 290;
const [BL_DATEI, BL_ZEILE] = F.bauen_lassen.quelle.split('#') as [string, string];
const [SETUP_DATEI, SETUP_ZEILE] = F.phasen.flatMap((p) => p.pflichtfragen).find((q) => q.id === 'setup')!.ablage.split('#') as [string, string];
const istOffen = (s: string | null) => s !== null && s !== 'live' && s !== 'zurueckgezogen';
const STAND_NAME: Record<string, string> = {
  briefing: 'Briefing', vorschlaege: 'Vorschläge bereit', gewaehlt: 'Richtung gewählt', im_bau: 'Im Bau', vorschau: 'Vorschau bereit', bezahlt: 'Bezahlt', live: 'Live',
  zurueckgezogen: 'Zurückgezogen',
};
const COCKPIT_AUFTRAG = 'https://albatros.build/cockpit/auftrag';
const ANGEBOT_ABO = 'Albatros kann deine Seite auch für dich bauen: Du bekommst Entwürfe zur Wahl und danach eine Vorschau deiner ganzen Seite. Bezahlen musst du erst, wenn du die Seite willst: CHF {einmalig} einmalig, danach Light für CHF {abo} im Monat. Selbst weiterbauen kostet bis zur fertigen Seite auf deinem Computer nichts. Frag die Person einmal, was ihr lieber ist, und schreib ihre Antwort mit Datum in {datei}: «{zeile} selbst (TT.MM.JJJJ)» oder «{zeile} albatros (TT.MM.JJJJ)». Die Fragen zum Konzept kommen so oder so.';
const ANGEBOT_LIGHT = 'Albatros kann deine Seite auch für dich bauen: Du bekommst Entwürfe zur Wahl und danach eine Vorschau deiner ganzen Seite. Bezahlen musst du erst, wenn du die Seite willst: CHF {einmalig} einmalig, Light hast du schon. Selbst weiterbauen kostet bis zur fertigen Seite auf deinem Computer nichts. Frag die Person einmal, was ihr lieber ist, und schreib ihre Antwort mit Datum in {datei}: «{zeile} selbst (TT.MM.JJJJ)» oder «{zeile} albatros (TT.MM.JJJJ)». Die Fragen zum Konzept kommen so oder so.';
const UEBERGABE = 'Die Person will, dass Albatros ihre Seite baut, und ihr Konzept steht. Fass zusammen, was mitgeht, frag «Soll ich es schicken?» und leg den Auftrag erst nach ihrem Ja mit auftrag_anlegen an. Weiterbauen mit P6 gehört nicht dazu.';
const DANACH_COCKPIT = 'im Cockpit unter «Dein Auftrag» den Projektordner und die Adresse der Seite wählen, später eine Richtung ({link})';
const R2_VORSCHLAEGE = 'Die Entwürfe für Auftrag #{nr} sind da. Die Person schaut sie im Cockpit an, wählt eine Richtung und gibt dort die Angaben fürs Impressum ein: Name oder Firma, Postadresse und E-Mail. An diese E-Mail gehen auch Anfragen von Besuchern, ausser sie nennt eine andere. Diese Angaben gibt sie nur im Cockpit ein, nie im Chat: {link}. Bauen musst du nichts.';
const R2_VORSCHAU_ABO = 'Die Vorschau von Auftrag #{nr} ist da. Die Person schaut sie auf dem Handy und am Computer an. Gefällt sie ihr, klickt sie im Cockpit auf «Bezahlen und live schalten» (CHF {einmalig} einmalig, dazu Light für CHF {abo} im Monat); sonst schreibt sie dort, was anders werden soll: {link}.';
const R2_VORSCHAU = 'Die Vorschau von Auftrag #{nr} ist da. Die Person schaut sie auf dem Handy und am Computer an. Gefällt sie ihr, klickt sie im Cockpit auf «Bezahlen und live schalten» (CHF {einmalig} einmalig); sonst schreibt sie dort, was anders werden soll: {link}.';
const R2_VORSCHAU_SERVER = 'Die Vorschau von Auftrag #{nr} ist da. Die Person schaut sie auf dem Handy und am Computer an und schreibt im Cockpit, was ihr gefällt oder was anders werden soll. Weil sie einen eigenen Server hat, liefert Albatros die Seite noch nicht von selbst dorthin aus, darum geht Bezahlen im Cockpit noch nicht; das Team findet mit ihr eine Lösung: {link}.';
const ZIEL_SERVER = 'Mit deinem eigenen Server geht Bezahlen im Cockpit noch nicht: Dorthin liefert Albatros noch nicht von selbst aus. Schreib dem Team im Cockpit, es findet mit dir eine Lösung.';
const R2_BRIEFING = 'Albatros liest das Briefing von Auftrag #{nr} und macht Entwürfe. Baue nicht selbst daneben weiter; bis dahin kann die Person Texte und Fotos sammeln (Skill `inhalte`).';
const R2_BAU = 'Albatros baut die Seite für Auftrag #{nr}. Baue nicht selbst daneben weiter; bis dahin kann die Person Texte und Fotos sammeln (Skill `inhalte`).';
const R2_BEZAHLT = 'Auftrag #{nr} ist bezahlt, Albatros schaltet die Seite jetzt live. Baue nicht selbst daneben weiter.';
const R3_WARTEN = 'Auftrag #{nr} ist live: Albatros hat die Seite gebaut, und die Person hat sie mit der Zahlung freigegeben. Albatros trägt die Freigabe gleich auf ihrer Insel ein. Ruf lage in ein paar Minuten nochmals auf und baue bis dahin nichts nach, was Albatros schon gebaut hat.';
const R3_LOGBUCH = 'Albatros hat die Seite für Auftrag #{nr} gebaut, und sie ist live. Das ganze Projekt liegt im Logbuch im Hafen: Hol es auf diesen Computer (git clone), denn daran lernt die Person, ihre Seite selbst zu ändern. Liegt es schon da, ruf lage in diesem Ordner mit belege auf (darin docs/prd.md mit «Freigegeben:»).';
const R3_DANACH_LOGBUCH = 'die erste eigene Änderung an der fertigen Seite mit Skill `webseite-aendern`; freiwillig eine eigene Domain (Skill `domain`) und wem die Person es zuerst sagt (Skill `lancieren`, Abschnitt «Wem sagst du es zuerst?»)';
const R3_DANACH_LIVE = 'freiwillig eine eigene Domain (Skill `domain`) und wem die Person es zuerst sagt (Skill `lancieren`, Abschnitt «Wem sagst du es zuerst?»); beides kommt in docs/live.md («Eigene Domain:», «Angekündigt:»)';
const R4 = 'Auftrag #{nr} ist zurückgezogen: Ab hier baust du selbst weiter. Die Entwürfe von Albatros sind nicht dabei, sie gehören erst mit der Zahlung dir.';
const R4_ZEILE = 'Auftrag #{nr} ist zurückgezogen: Ab hier baust du selbst weiter. Die Entwürfe von Albatros sind nicht dabei, sie gehören erst mit der Zahlung dir. Schreib in {datei} «{zeile} selbst (TT.MM.JJJJ)».';
const NUR_STATISCH = 'Albatros baut bis jetzt nur Seiten ohne eigene Dienste: Dafür beginnt «{setup}» in {plan} mit statisch, von der Person bestätigt (ohne [Annahme]). Braucht die Seite einen Baustein (Anmeldung, Buchung, Login), baust du mit ihr selbst weiter und schreibst in {datei} «{zeile} selbst (TT.MM.JJJJ)».';
const NUR_OHNE_SERVER = 'Mit einem eigenen Server oder dem Abo Pilot baut Albatros die Seite noch nicht: Dorthin liefert es noch nicht von selbst aus. Darum baust du mit der Person selbst weiter und schreibst in {datei} «{zeile} selbst (TT.MM.JJJJ)»; will sie trotzdem bauen lassen, frag das Team mit coach_fragen.';
const OHNE_JA = 'Ohne das ausdrückliche Ja der Person lege ich keinen Auftrag an. Zeig ihr die Zusammenfassung, frag «Soll ich es schicken?» und ruf auftrag_anlegen erst nach ihrem Ja mit bestaetigt: true auf.';
const UEBERGABE_JETZT = 'Skill `konzept`, Abschnitt «Übergabe an Albatros»';
const LOGBUCH_JETZT = 'Skill `webseite-aendern`, Abschnitt «Das Logbuch holen»';
// Schlüssel nach der Auslieferung (R3), wie die Regel «noch kein Schloss» in lage.ts; die Attrappe kennt sie nur hier (sonst hat sie keine Regeln
// für Server und Seite)
const KEIN_SCHLOSS = { server: 'Es ist noch kein Schloss hinterlegt: Ohne kommst du weder auf den Server noch in den Hafen.', seite: 'Es ist noch kein Schloss hinterlegt: Ohne geht kein git push in den Hafen, und deine Seite bleibt leer.' };
const fuelle = (t: string, w: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (m, k: string) => (k in w ? String(w[k]) : m));
// Wie bauserviceMoeglich: nur ohne eigenen Server und ohne Pilot (dorthin liefert konto keinen Auftrag aus). Sonst ist das Ziel eines Auftrags
// server (konto zielVon: Server oder Stufe mit Server), und konto kassiert dort nicht (Welle 9)
const bauserviceMoeglich = () => !merk('server') && stufe() !== 'pilot';
const zielServer = () => !bauserviceMoeglich();
// Preis eines Auftrags wie konto: einmalig, dazu Light im selben Checkout, solange kein Abo läuft (mit Abo null)
const auftragPreis = () => ({ einmaligChf: AUFTRAG_CHF, aboChfMonat: stufe() === 'gratis' ? PREIS.light! : null });
// Wahl in «Bauen lassen:» (die Antwort der Person, nie eine Annahme) und Setup ab statisch, wie bauenLassen und setupPasst. Setup ebenfalls nur
// als Antwort, nie als [Annahme: statisch …] (fahrplan/w9-nahtstellen, siehe oben)
const bauenLassen = (dateien: Record<string, string>) => {
  const w = wert(dateien[BL_DATEI], BL_ZEILE);
  return { zeile: w !== null, wahl: F.bauen_lassen.werte.find((x) => beantwortet(F, w) && wertPasst(F, { werte: [x] }, w)) ?? null };
};
const setupPasst = (dateien: Record<string, string>) => {
  const w = wert(dateien[SETUP_DATEI], SETUP_ZEILE);
  return beantwortet(F, w) && wertPasst(F, { werte: [F.bauen_lassen.setup_beginnt] }, w);
};
// Was eine Übergabe verhindert, wie uebergabeHindernis: ohne Ziel, in das konto ausliefert, oder ohne Setup statisch (bestätigt)
const uebergabeHindernis = (dateien: Record<string, string>) => (!bauserviceMoeglich() ? NUR_OHNE_SERVER : !setupPasst(dateien) ? NUR_STATISCH : null);
const HINDERNIS_WERTE = { setup: SETUP_ZEILE, plan: SETUP_DATEI, datei: BL_DATEI, zeile: BL_ZEILE };
// setup von auftrag_anlegen als Beleg wie setupBeleg: die ganze Zeile (auch als Listenpunkt) oder nur der Wert
const setupBeleg = (s: string): Record<string, string> => {
  const z0 = s.trim().replace(/^[-*]\s+/, '');
  return { [SETUP_DATEI]: z0.startsWith(SETUP_ZEILE) ? z0 : `${SETUP_ZEILE} ${z0}` };
};
// R3 liest zwei Stellen aus dem Vertrag wie bauservice.ts: docs/prd.md mit dem Ja-Moment von P10 (konto schreibt «Freigegeben: …, Abnahme mit
// der Zahlung von Auftrag #n», J2) heisst, das Logbuch liegt auf dem Computer; docs/live.md mit den Antworten auf adresse und ankuendigung (P13)
const frageVon = (phase: string, id: string) => F.phasen.find((p) => p.id === phase)!.pflichtfragen.find((q) => q.id === id)!;
const JA_P10 = F.ja_momente.find((j) => j.phase === 'P10')!;
const [PRD_DATEI, PRD_ZEILE] = frageVon(JA_P10.phase, JA_P10.frage).ablage.split('#') as [string, string];
const NACH_LIVE_FRAGEN = [frageVon('P13', 'adresse'), frageVon('P13', 'ankuendigung')];
const logbuchDa = (dateien: Record<string, string>) => jaBelegt(F, dateien[PRD_DATEI], PRD_ZEILE);
const nachLiveBeantwortet = (dateien: Record<string, string>) => NACH_LIVE_FRAGEN.every((q) => {
  const [datei, anfang] = q.ablage.split('#') as [string, string];
  const w = wert(dateien[datei], anfang);
  return beantwortet(F, w) && wertPasst(F, q, w);
});
// Albatros arbeitet zwischen den Runden (nur im Durchspiel, siehe oben): ein Stand je neuer Runde mit lage oder konto_status
const WEITER: Record<string, string> = { briefing: 'vorschlaege', vorschlaege: 'im_bau', gewaehlt: 'im_bau', im_bau: 'vorschau' };
function auftragWeiter() {
  const r = runde();
  const s = merk('auftrag');
  if (!BAUSERVICE || r === null || !s || !WEITER[s]) return;
  if (r > Number(merk('auftrag-runde') ?? '-1')) {
    setze('auftrag', WEITER[s]!);
    setze('auftrag-runde', String(r));
  }
}
type BauRegeln = {
  offen: { jetzt: string; grund: string } | null; uebergabe: { jetzt: string; grund: string; danach: string } | null; angebot: string | null;
  danachP5: string | null; hinweis: string | null; rueckweg: { jetzt: string; grund: string; danach: string } | null; danachLive: string | null; gebaut: boolean;
  schluessel: boolean;
};
// Regeln R1, R1b, R2, R3, R4 wie bauserviceRegeln; auftrag: Stand des einzigen Auftrags der Attrappe (Nummer 1) oder null
function bauserviceRegeln(o: { dateien: Record<string, string>; modus: string; phase: string | null; geschafft: number; stoppen: boolean }): BauRegeln {
  const r: BauRegeln = { offen: null, uebergabe: null, angebot: null, danachP5: null, hinweis: null, rueckweg: null, danachLive: null, gebaut: false, schluessel: false };
  if (!BAUSERVICE) return r;
  const auftrag = merk('auftrag');
  const ab = phaseIndex(F, F.bauen_lassen.ab);
  const bl = bauenLassen(o.dateien);
  const zeile = { datei: BL_DATEI, zeile: BL_ZEILE };
  if (istOffen(auftrag)) {
    const p = auftragPreis();
    const w = { nr: 1, link: COCKPIT_AUFTRAG, einmalig: p.einmaligChf, abo: p.aboChfMonat ?? 0 };
    const vorschau = zielServer() ? R2_VORSCHAU_SERVER : p.aboChfMonat === null ? R2_VORSCHAU : R2_VORSCHAU_ABO;
    if (auftrag === 'vorschlaege') r.offen = { jetzt: 'im Cockpit unter «Dein Auftrag» eine Richtung wählen und die Angaben fürs Impressum eingeben', grund: fuelle(R2_VORSCHLAEGE, w) };
    else if (auftrag === 'vorschau') r.offen = { jetzt: 'im Cockpit unter «Dein Auftrag» die Vorschau ansehen', grund: fuelle(vorschau, w) };
    else r.offen = { jetzt: 'warten auf Albatros', grund: fuelle(auftrag === 'briefing' ? R2_BRIEFING : auftrag === 'bezahlt' ? R2_BEZAHLT : R2_BAU, w) };
    return r;
  }
  // R3 nach der Auslieferung: vor der Freigabe auf der Insel warten; danach Schlüssel (in lage, wie dort vor dem Logbuch), das Logbuch, bis
  // docs/prd.md mit «Freigegeben:» als Beleg kommt, dann Domain und Ankündigung freiwillig, bis docs/live.md sie nennt
  if (auftrag === 'live') {
    if (rang(insel()) < rang('freigabe')) {
      r.offen = { jetzt: 'warten', grund: fuelle(R3_WARTEN, { nr: 1 }) };
      r.gebaut = true;
    } else {
      r.schluessel = true;
      if (!logbuchDa(o.dateien)) r.rueckweg = { jetzt: LOGBUCH_JETZT, grund: fuelle(R3_LOGBUCH, { nr: 1 }), danach: R3_DANACH_LOGBUCH };
      else if (!nachLiveBeantwortet(o.dateien)) r.danachLive = R3_DANACH_LIVE;
    }
    return r;
  }
  if (auftrag === 'zurueckgezogen') {
    if (o.geschafft <= ab + 1) r.hinweis = fuelle(bl.wahl === 'albatros' ? R4_ZEILE : R4, { nr: 1, ...zeile });
    return r;
  }
  const ohneAuftrag = auftrag === null;
  // R1b nur unter den Bedingungen von R1: sonst der normale Fahrplan mit dem Satz, was gilt, wie R4 nur, bis P6 geschafft ist
  if (bl.wahl === 'albatros' && ohneAuftrag) {
    const hindernis = uebergabeHindernis(o.dateien);
    if (hindernis) {
      if (o.geschafft <= ab + 1) r.hinweis = fuelle(hindernis, HINDERNIS_WERTE);
      return r;
    }
  }
  if (!bauserviceMoeglich()) return r;
  if (bl.wahl === 'albatros' && ohneAuftrag) {
    if (o.geschafft > ab) r.uebergabe = { jetzt: UEBERGABE_JETZT, grund: UEBERGABE, danach: fuelle(DANACH_COCKPIT, { link: COCKPIT_AUFTRAG }) };
    else if (o.phase === F.bauen_lassen.ab) r.danachP5 = UEBERGABE_JETZT;
    return r;
  }
  if (o.phase === F.bauen_lassen.ab && o.modus === F.bauen_lassen.nur_modus && !o.stoppen && ohneAuftrag && !bl.zeile && setupPasst(o.dateien)) {
    r.angebot = fuelle(stufe() === 'light' ? ANGEBOT_LIGHT : ANGEBOT_ABO, { einmalig: AUFTRAG_CHF, abo: PREIS.light!, ...zeile });
  }
  return r;
}
// Zeile für konto_status wie kontoStatusZeile
function kontoStatusZeile(): string | null {
  if (!BAUSERVICE) return null;
  const auftrag = merk('auftrag');
  const im = `Im Cockpit: ${COCKPIT_AUFTRAG}.`;
  if (istOffen(auftrag)) {
    if (zielServer()) return `Auftrag bei Albatros: #1, ${STAND_NAME[auftrag!] ?? auftrag}. ${ZIEL_SERVER} ${im}`;
    const p = auftragPreis();
    const abo = p.aboChfMonat === null ? '' : `, dazu Light für CHF ${p.aboChfMonat} im Monat`;
    return `Auftrag bei Albatros: #1, ${STAND_NAME[auftrag!] ?? auftrag}. Bezahlt wird erst bei der Vorschau: CHF ${p.einmaligChf} einmalig${abo}. ${im}`;
  }
  if (auftrag === 'live') return `Auftrag bei Albatros: #1, ${STAND_NAME.live}. Albatros hat deine Seite gebaut, bezahlt ist sie; ändern kannst du sie jetzt selbst. ${im}`;
  if (!bauserviceMoeglich()) return null;
  const danach = stufe() === 'light' ? ', Light hast du schon' : `, danach Light für CHF ${PREIS.light} im Monat`;
  return `Albatros baut deine Seite auf Wunsch: CHF ${AUFTRAG_CHF} einmalig${danach}; bezahlt wird erst, wenn dir die Vorschau gefällt. Angeboten wird es in lage, sobald dein Plan steht.`;
}

type Mission = {
  id: string; weg: string; titel: string; skill?: string; phase?: string; optional?: boolean; abo?: string;
  pruefung?: { typ: string; schritt?: string }[]; verstehen?: { frage: string; kern: string }[];
};
const missionen: Mission[] = ['flugschule', 'webseite', 'geschaeft'].flatMap((w) => {
  const d = join(QUELLE, 'missionen', w);
  return (existsSync(d) ? readdirSync(d) : []).filter((f) => f.endsWith('.md')).flatMap((f) => {
    const m = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(d, f), 'utf8'));
    return m ? [Bun.YAML.parse(m[1]!) as Mission] : [];
  });
});

// Pflichtfragen mit werte (modus, maskottchen, reihenfolge, musterblatt, adresse) wie werteHinweis in lage (w6-21; w7-20, 01.11.2026): steht
// ein Wert da, der nicht mit einem der Wörter beginnt, sagt es die Zeile; fehlt er oder ist er offen, nennt sie die Wörter
const oder = (w: readonly string[]) => (w.length > 1 ? `${w.slice(0, -1).join(', ')} oder ${w.at(-1)}` : w.join(''));
const werteHinweis = (q: Pflichtfrage, dateien: Record<string, string>): string => {
  const [datei, anfang] = q.ablage.split('#') as [string, string | undefined];
  if (!q.werte?.length || !anfang) return '';
  const w = wert(dateien[datei], anfang);
  if (belegt(F, w) && !wertPasst(F, q, w)) return `; Zeile «${anfang}» beginnt nicht mit ${oder(q.werte)}; diese Wörter bleiben deutsch`;
  return belegt(F, w) ? '' : `; der Wert in «${anfang}» beginnt mit ${oder(q.werte)}; diese Wörter bleiben deutsch`;
};

function lektion(p: Phase, weg: string | null, st: string): string[] {
  const zeilen = p.lernmomente?.length ? [`Lernmomente: ${p.lernmomente.join('; ')}.`] : [];
  const verstanden = (merk('verstanden') ?? '').split('\n').filter(Boolean).map((z) => z.split(' '));
  // Lektionen nur mit Kontrollfrage (verstehen), wie lage seit 31.10.2026 (weg-10)
  for (const m of missionen.filter((x) => x.phase === p.id && !x.optional && (x.weg === 'flugschule' || x.weg === weg) && !(st === 'light' && x.abo === 'pilot') && (x.verstehen?.length ?? 0) > 0)) {
    const arten = verstanden.filter(([id]) => id === m.id).map(([, art]) => art);
    zeilen.push(`Lektion: Mission ${m.id} («${m.titel}»), verstanden: ${arten.length ? `ja (${arten.join(', ')})` : 'noch nicht'}.`);
    for (const f of m.verstehen ?? []) zeilen.push(`Kontrollfrage am Ende der Phase: ${f.frage} Kern einer guten Antwort: ${f.kern} Danach verstanden_melden mit mission ${m.id}.`);
  }
  return zeilen;
}

function lage(a: Args): Antwort {
  auftragWeiter(); // Bauservice im Durchspiel: Albatros hat seit der letzten Runde weitergearbeitet
  const belege: Beleg[] = Array.isArray(a.belege) ? (a.belege as Beleg[]).filter((b) => typeof b?.datei === 'string' && Array.isArray(b.zeilen)) : [];
  const dateien: Record<string, string> = Object.fromEntries(belege.map((b) => [b.datei, b.zeilen.join('\n')]));
  const weg = merk('weg');
  const st = stufe();
  const modus = a.modus === 'lernen' || a.modus === 'machen' ? a.modus : (merk('modus') as 'lernen' | 'machen' | null) ?? F.modus.standard;
  const geschaeft = weg === 'geschaeft';
  const e = geschaeft ? entscheidVon(MIT_AUSGANG, dateien[AUSGANG_DATEI]) : null;
  const entscheid = e?.art === 'hausaufgabe' ? 'hausaufgabe' : (e?.ausgang ?? null);
  // Wie lage seit 31.10.2026 (vert-02, weg-02): die Insel ist der Boden, die Belege führen lückenlos von dort weiter; auf dem Weg Geschäft hält
  // der Ideen-Check P1, bis er weiter oder stoppen sagt (Gegenprobe Welle 5, weg-05)
  const frei = freieMethoden(F, st);
  const fuerWeg: Fuer = { weg, stufe: st };
  const nachInsel = erledigtNachInsel(F, insel());
  const nachDateien = erledigtNachDateien(F, dateien, nachInsel, fuerWeg);
  const erledigt = entscheid === 'anpassen' ? 0 : nachDateien;
  const p = F.phasen[erledigt];
  const wohnort = wohnortVon(F, wert(dateien['docs/lancieren.md'], 'Wohnort:'), st);
  const modernisieren = /https?:\/\/|\b[a-z0-9-]+\.[a-z]{2,}\b/i.test(wert(dateien['docs/projekt.md'], 'Bestehende Seite:') ?? '');
  const fuer = (q: Phase) => {
    const v = modernisieren ? q.varianten?.modernisieren : undefined;
    const abschnitt = v?.skill ? v.abschnitt : q.abschnitt;
    return { zusatz: v?.zusatz, abschnitt, text: `${skill(v?.skill ?? q.skill)}${abschnitt ? `, Abschnitt «${abschnitt}»` : ''}` };
  };
  const zeilen: string[] = [];
  const hinweise: string[] = [];
  // Bauservice (oben, wie bauserviceRegeln in albatros): Stand des Auftrags in der Attrappe, Wahl der Person in docs/projekt.md
  const bau = bauserviceRegeln({ dateien, modus, phase: p?.id ?? null, geschafft: erledigt, stoppen: entscheid === 'stoppen' });
  const ss = typeof a.skills_stand === 'string' && /^\d+\.\d+\.\d+$/.test(a.skills_stand) ? a.skills_stand : null;
  if (!ss || neuer(SKILLS_STAND, ss)) {
    zeilen.push(`Deine Albatros-Skills sind veraltet (auf diesem Computer: ${ss ?? 'unbekannt'}, aktuell: ${SKILLS_STAND}). Gib bei lage skills_stand mit (metadata.stand in deinen Skills); fehlt dir ein Skill, hol ihn mit skill_holen.`);
  }
  let jetzt: string;
  let grund: string;
  let danach: string | undefined;
  let phaseDran = false;
  if (!weg) {
    [jetzt, grund] = [skill('start'), 'Du hast noch keinen Weg gewählt: eine Webseite oder ein Geschäft.'];
  } else if (bau.offen) {
    // R2 Auftrag offen: was die Person im Cockpit tut, oder warten; kein «Danach», nie P6 bis P10 daneben. R3 vor der Freigabe ebenso (warten)
    [jetzt, grund] = [bau.offen.jetzt, bau.offen.grund];
  } else if (bau.schluessel && erledigt >= phaseIndex(F, 'P11') && (merk('server') || seiteName()) && schloesser() === 0) {
    // R3 nach der Freigabe: zuerst das Schloss, wie die Regel in lage (dort für alle, hier nur nach der Auslieferung); «Danach» wie dort die Phase
    [jetzt, grund] = [skill('ssh-schluessel'), merk('server') ? KEIN_SCHLOSS.server : KEIN_SCHLOSS.seite];
    if (p) danach = `Phase ${p.id} «${p.titel}» mit ${fuer(p).text}`;
  } else if (bau.rueckweg) {
    // R3: das Logbuch holen, nie P6 bis P10; die Phase im Stand bleibt die der Insel
    [jetzt, grund, danach] = [bau.rueckweg.jetzt, bau.rueckweg.grund, bau.rueckweg.danach];
  } else if (entscheid === 'stoppen') {
    [jetzt, grund] = ['nichts mehr', 'Dein Ideen-Check sagt «stoppen»: Die Idee trägt so nicht. Das ist geschafft, nicht gescheitert.'];
    danach = `Mit einer neuen Idee beginnt es wieder bei P1: ${methodeText(['ideen-check'])}`;
  } else if (e?.art === 'hausaufgabe') {
    [jetzt, grund] = [`warten bis ${e.bis}`, `Dein Ideen-Check hat eine Hausaufgabe offen bis ${e.bis}. Erst mit ihrem Ergebnis entscheidet ihr: weiter, anpassen oder stoppen.`];
    danach = `${methodeText(['ideen-check'])} mit dem Ergebnis der Hausaufgabe`;
  } else if (bau.uebergabe) {
    // R1b Übergabe: «Bauen lassen: albatros», P5 geschafft, noch kein Auftrag; nie P6
    [jetzt, grund, danach] = [bau.uebergabe.jetzt, bau.uebergabe.grund, bau.uebergabe.danach];
  } else if (p) {
    phaseDran = true;
    const f = fuer(p);
    const methoden = geschaeft ? (p.methoden?.geschaeft ?? []).filter((m) => !(m === 'ideen-check' && entscheid === 'weiter')) : [];
    const mitAbo = methoden.filter((m) => frei && !frei.includes(m));
    const freie = methoden.filter((m) => !mitAbo.includes(m));
    // Wie lage: nach dem Skill (nach_skill), sein Ergebnis steht, der Ausgang fehlt (P1: Idee fertig, kein Entscheid): nur noch die Methoden
    const nurMethoden = p.methoden?.wann === 'nach_skill' && ausgangZaehlt(F, p, fuerWeg) && !entscheid && freie.length > 0 && phaseBelegt(F, p, dateien);
    jetzt = nurMethoden ? methodeText(freie) : mitMethoden(p, f.text, freie);
    grund = `${entscheid === 'anpassen' ? 'Dein Ideen-Check sagt «anpassen»: Idee schärfen, dann den Check wiederholen. ' : ''}${nurMethoden ? `Das Ergebnis von ${f.text}${f.abschnitt ? ',' : ''} steht; es fehlt ${ausgangText(p)}. ` : ''}Phase ${p.id} «${p.titel}» (Etappe ${p.etappe}), Bild: ${p.bild}.`;
    if (f.zusatz) hinweise.push(f.zusatz);
    if (mitAbo.length) hinweise.push(`${mitAbo.map((m) => `Die Methode \`${m}\``).join(' und ')} gehört zum Abo; ohne Abo führt ${f.text} allein durch die Phase.`);
    const q = F.phasen[erledigt + 1];
    // Nach dem Livegang auf dem Weg Geschäft die erste Methode der Etappe Landen, mit Gratis der freie Weg (wie lage, steu-06)
    const landen = geschaeft && st !== 'gratis' ? F.nach_live.landen.geschaeft?.[0] : undefined;
    danach = q ? `Phase ${q.id} «${q.titel}» mit ${fuer(q).text}`
      : `nach dem Livegang ${landen ? methodeText([landen]) : skill(F.nach_live.aendern.skill)}${geschaeft && !landen ? '; die Etappe Landen mit den Methoden gehört zum Abo' : ''}`;
    if (bau.danachP5) danach = bau.danachP5; // P5 mit «Bauen lassen: albatros»: danach die Übergabe, nie P6
  } else if (geschaeft && st !== 'gratis') {
    [jetzt, grund] = [methodeText([F.nach_live.landen.geschaeft?.[0] ?? 'zahlen']), `Deine Seite ist live, alle ${F.phasen.length} Phasen sind geschafft. Jetzt kommt die Etappe Landen: sichtbar werden und die ersten Kundinnen und Kunden gewinnen.`];
    danach = `${skill('landung')}, sobald du in ein eigenes Haus umziehen willst`;
    if (bau.danachLive) danach = bau.danachLive; // R3 wie unten
  } else {
    [jetzt, grund] = [skill(F.nach_live.aendern.skill), `Deine Seite ist live, alle ${F.phasen.length} Phasen sind geschafft. Änderungen gehen klein (${F.nach_live.aendern.klein.join(', ')}) oder gross (${F.nach_live.aendern.gross.join(', ')}).`];
    if (geschaeft) hinweise.push('Die Etappe Landen mit den Methoden gehört zum Abo; den Link gibt upgrade_link, wenn die Person es will.');
    danach = merk('seite') || merk('server') ? `${skill('landung')}, sobald du in ein eigenes Haus umziehen willst` : `${skill('statistik')}, sobald du wissen willst, wer deine Seite besucht`;
    if (bau.danachLive) danach = bau.danachLive; // R3: Hat Albatros gebaut, Domain und Ankündigung freiwillig, bis docs/live.md sie nennt
  }
  if (bau.hinweis) hinweise.push(bau.hinweis); // R4 (zurückgezogen) hinter den Hinweisen, die etwas melden
  zeilen.push(`Jetzt dran: ${jetzt}. Grund: ${grund}`, ...(merk('erfassung') ? [] : [HINWEIS_ERFASSUNG]), ...hinweise.slice(0, 2).map((h) => `Hinweis: ${h}`));
  if (phaseDran && p) {
    for (const q of p.pflichtfragen.filter((x) => !frageBelegt(F, p, x, dateien))) zeilen.push(`Pflichtfragen offen: ${q.id}: ${q.frage.de} (${wer(p, q)}${werteHinweis(q, dateien)})`);
    zeilen.push(`Ergebnis: ${p.ergebnis.map((x) => (x.zeilen?.length ? `${x.datei} mit ${x.zeilen.map((z) => `«${z}»`).join(', ')}` : x.datei)).join('; ')}.`);
    // In P13 je Wohnort (fahrplan.yaml: insel_je_wohnort), aus «Wohnort:» in den Belegen, sonst aus dem Abo der Attrappe
    const melden = bisAbschluss(F, p, wohnort);
    const ausgang = ausgangZaehlt(F, p, fuerWeg) ? ` Auf dem Weg Geschäft dazu ${ausgangText(p)}.` : '';
    zeilen.push(`Fertig, wenn: ${p.gate}${ausgang} Dann schritt_melden mit ${melden.map((x) => `«${x}»`).join(', ')}${melden.length > 1 ? ', je sobald geschafft' : ''}.`);
    if (st === 'gratis' && erledigt <= gratisBis) zeilen.push(`Hinweis: ${GRATIS_HINWEIS}`);
    // R1 Angebot: eine eigene Zeile mit dem Betrag, wie der Gratis-Hinweis
    if (bau.angebot) zeilen.push(`Angebot: ${bau.angebot}`);
    zeilen.push(`Modus: ${modus}. ${F.modus[modus]}`);
    if (modus === 'lernen') zeilen.push(...lektion(p, weg, st));
  }
  // Was die Belege über die Insel hinaus belegen, fehlt auf der Insel noch (wie lage)
  const nachmelden = F.phasen.slice(nachInsel, nachDateien).flatMap((q) => bisAbschluss(F, q, wohnort)).filter((x) => rang(x) > rang(insel()));
  if (entscheid !== 'anpassen' && nachmelden.length) zeilen.push(`Auf der Insel fehlt noch: ${nachmelden.map((x) => `«${x}»`).join(', ')} (nach den Belegen schon geschafft). Melde sie mit schritt_melden, der Reihe nach.`);
  if (danach) zeilen.push(`Danach: ${danach}.`);
  const [n, server, s, i] = [schloesser(), merk('server'), seiteName(), insel()];
  zeilen.push(`Stand: ${[
    `Weg ${weg === 'webseite' ? 'Webseite' : weg === 'geschaeft' ? 'Geschäft' : 'offen'}`,
    `Abo ${STUFEN[st] ?? st}`,
    server ? `Server ${server} bereit, ${n} Schlösser` : s ? `Seite https://${s}.aufwind.sh ${stand(s)}, ${n} Schlösser` : null,
    `Projekt projekt ${i ? `auf der Insel bei «${i}»` : 'noch nicht auf der Insel'}`,
    // R1b und R2: keine Phase, an der die KI weiterbauen könnte; R3 vor der Freigabe: die Seite hat Albatros gebaut
    bau.gebaut ? `Fahrplan geschafft: ${bisText(erledigt)}, die Seite hat Albatros gebaut`
      : bau.offen || bau.uebergabe ? `Fahrplan geschafft: ${bisText(erledigt)}, den Bau übernimmt Albatros`
      : p ? `Phase ${p.id} von ${F.phasen.length} (geschafft nach Insel: ${bisText(nachInsel)}${nachDateien > nachInsel ? `, nach Belegen weiter: ${bisText(nachDateien)}` : ''})` : `alle ${F.phasen.length} Phasen geschafft`,
  ].filter(Boolean).join(' · ')}.`);
  return { text: zeilen.join('\n') };
}

// ———— Weitere Werkzeuge mit Zustand ————
// Namen der Schritte für Texte an die Person, wie INSEL_NAMEN in albatros packages/kit/src/phasen.ts
const INSEL_NAMEN: Record<string, string> = {
  idee: 'Idee', recherche: 'Recherche', plan: 'Plan', 'plan-geprueft': 'Plan geprüft', konzept: 'Konzept', mockup: 'Graues Mockup', entwuerfe: 'Entwürfe',
  entwurf: 'Entwurf', 'entwurf-freigegeben': 'Entwurf freigegeben', prd: 'Bauplan', lokal: 'Rohbau', pruefung: 'Prüfung', freigabe: 'Freigabe',
  wohnort: 'Wohnort', betrieb: 'Betrieb', hafen: 'Hafen', fliessband: 'Fliessband', live: 'Live', domain: 'Eigene Adresse',
};
// Name des Projekts auf der Insel wie kuerzeTitel in albatros services/mcp/src/werkzeuge.ts (w6-20, an Grenzen ganzer Zeichen seit w7-05):
// bis 80 Zeichen, sonst an der letzten Wortgrenze vor der Grenze mit «…»
const ZEICHEN = new Intl.Segmenter('de', { granularity: 'grapheme' });
function kuerzeTitel(titel: string, max = 80): string {
  if (titel.length <= max) return titel;
  let s = '';
  for (const { segment } of ZEICHEN.segment(titel)) {
    if (s.length + segment.length > max - 1) break; // Platz für «…»
    s += segment;
  }
  if (!/^\s/.test(titel.slice(s.length))) {
    const grenze = s.search(/\s\S*$/);
    if (grenze > max / 2) s = s.slice(0, grenze);
  }
  return `${s.replace(/[\s,;:.\-–—(/]+$/u, '') || s}…`;
}
// verstanden_melden wie flugschule (services/flugschule/src/lernen.ts) und mcp (services/mcp/src/lernen.ts): Je Mission und Art einmal;
// wiederholung nur für Missionen mit Kontrollfragen, erst nach einem ersten verstanden und frühestens am Tag danach, sonst 409 und nichts
// gespeichert. Die Attrappe merkt sich je Eintrag den Tag in Zürich (Datei verstanden: «<mission> <art> <JJJJ-MM-TT>»).
const ART: Record<string, string> = { selbst: 'selbst gemacht', kontrollfrage: 'Kontrollfrage beantwortet', wiederholung: 'später nochmals gekonnt' };
const KEINE_WIEDERHOLUNG = 'Diese Mission hat keine Kontrollfragen, eine Wiederholung gibt es dafür nicht. Gespeichert ist nichts.';
const NOCH_NICHTS = 'Wiederholen geht erst, wenn die Lektion einmal verstanden ist (selbst oder kontrollfrage). Gespeichert ist nichts.';
// Ohne Wiederholung (wiederholungAb null) wie mcp seit w7-01 (Welle 7): nach einer Wiederholung «wiederholt», ohne Kontrollfragen «keine»
const OHNE_WIEDERHOLUNG = {
  wiederholt: 'Diese Lektion ist wiederholt; eine weitere Wiederholung braucht es nicht.',
  keine: 'Für diese Lektion steht keine Wiederholung an (die Mission hat keine Kontrollfragen, oder sie ist schon wiederholt); stell dazu keine Frage aus «verstehen».',
};
const NACHFRAGEN = 'Stell dann eine Frage aus «verstehen» dieser Mission (im Modus machen nur als Angebot), ohne die Antwort vorzusagen; beantwortet die Person sie in eigenen Worten, meldest du verstanden_melden mit art: wiederholung.';
const tagZuerich = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(d);
const tagCh = (iso: string) => iso.split('-').reverse().map(Number).join('.');
const tagDanach = (iso: string) => { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };
type Verstanden = { art: string; tag: string };
const verstandenVon = (id: string): Verstanden[] => (merk('verstanden') ?? '').split('\n').map((z) => z.split(' '))
  .filter(([m]) => m === id).map(([, art, tag]) => ({ art: art ?? '', tag: tag ?? tagZuerich(new Date()) }));
// Wie flugschule wiederholungAb: ab dem Tag nach dem ersten verstanden, bis eine wiederholung gemeldet ist
const wiederholungAb = (e: Verstanden[]) => (e.some((x) => x.art === 'wiederholung') || !e.length ? null : tagDanach(e.map((x) => x.tag).sort()[0]!));
// coach_fragen und luecke_melden wie mcp (services/mcp/src/erfassen.ts) und flugschule (app.ts, erfassung.ts) mit ERFASSUNG
const COACH_ABO = 'Der Coach gehört zum Abo. Deckt kein Skill die Frage ab, melde sie mit luecke_melden an Albatros (mit dem Einverständnis der Person); dann werden die Skills besser.';
const BEIM_TEAM = 'Deine Frage ist beim Albatros-Team. Die Antwort kommt per Mail und steht danach auch hier.';
const FRAGE = 'Frag die Person zuerst mit diesem Satz: «Darf Albatros Fragen, die die Skills noch nicht abdecken, mit deinem Konto speichern, damit die Skills besser werden? Du kannst sie im Cockpit ansehen und löschen.» Ruf luecke_melden danach nochmals auf: bei Ja mit einverstanden: true, bei Nein mit einverstanden: false.';
const NEIN = 'Albatros speichert keine Meldungen von dir, weil du das abgelehnt hast. Ändern kannst du das jederzeit im Cockpit.';
const GESPEICHERT = 'Gespeichert, danke: Damit werden die Skills von Albatros besser. Die Person sieht ihre Meldungen im Cockpit und kann sie dort löschen.';

const MIT_ZUSTAND: Record<string, (a: Args) => Antwort> = {
  lage,
  schritt_melden: (a) => {
    const s = String(a.schritt);
    const projekt = typeof a.projekt === 'string' && a.projekt ? a.projekt : 'projekt';
    const vorher = projekt === 'projekt' ? insel() : merk(`insel-${projekt}`);
    const neu = rang(s) > rang(vorher);
    if (neu) setze(projekt === 'projekt' ? 'insel' : `insel-${projekt}`, s);
    const jetzt = neu ? s : vorher!;
    const wo = `«${INSEL_NAMEN[jetzt]}» (${jetzt}, Phase ${F.phasen.find((p) => p.insel.includes(jetzt))!.id})`;
    const adresse = `https://albatros.build${a.sprache && a.sprache !== 'de' ? `/${String(a.sprache)}` : ''}/cockpit/insel`;
    const titel = typeof a.titel === 'string' && a.titel ? kuerzeTitel(a.titel) : undefined;
    const gekuerzt = titel && titel !== a.titel ? ` Der Name ist auf der Insel gekürzt: «${titel}».` : '';
    return { text: neu ? `Auf der Insel steht ${projekt} jetzt bei ${wo}.${gekuerzt} Ruf lage erneut auf. Insel: ${adresse}`
      : `${projekt} war schon bei ${wo}; nichts geändert, diesen Schritt nicht nochmals melden.${gekuerzt} Insel: ${adresse}` };
  },
  weg_waehlen: (a) => { setze('weg', String(a.weg)); return { text: `Weg gespeichert: ${a.weg === 'webseite' ? 'Webseite' : 'Geschäft'}.` }; },
  modus_waehlen: (a) => {
    const m = a.modus === 'lernen' ? 'lernen' : 'machen';
    setze('modus', m);
    return { text: [`Modus gespeichert: ${m}, als Vorgabe für neue Projekte.`, `Für dich als KI gilt laut Fahrplan: ${F.modus[m]}`,
      `Im Projekt gilt die Zeile «Modus:» in docs/projekt.md: Trag dort «Modus: ${m}» ein; andere Projekte behalten ihren Modus. Wechseln geht jederzeit.`].join('\n') };
  },
  verstanden_melden: (a) => {
    const m = missionen.find((x) => x.id === a.mission);
    if (!m) return { fehler: true, text: 'Diese Mission gibt es nicht.' };
    const art = String(a.art);
    const mit = (m.verstehen?.length ?? 0) > 0;
    const bisher = verstandenVon(m.id);
    const heute = tagZuerich(new Date());
    if (art === 'wiederholung') {
      if (!mit) return { fehler: true, text: KEINE_WIEDERHOLUNG };
      const ab = wiederholungAb(bisher);
      if (!bisher.some((x) => x.art === 'wiederholung')) {
        if (ab === null) return { fehler: true, text: NOCH_NICHTS };
        if (ab > heute) return { fehler: true, text: `Wiederholen geht ab ${tagCh(ab)}, vorher ist die Lektion noch frisch. Gespeichert ist nichts.` };
      }
    }
    const schon = bisher.some((x) => x.art === art);
    if (!schon && HAFEN) appendFileSync(join(HAFEN, 'verstanden'), `${m.id} ${art} ${heute}\n`);
    const ab = mit ? wiederholungAb(schon ? bisher : [...bisher, { art, tag: heute }]) : null;
    return { text: [`${schon ? 'War schon notiert' : 'Notiert'}: «verstanden» für ${m.id} («${m.titel}»), ${ART[art]}.`,
      ab === null ? OHNE_WIEDERHOLUNG[art === 'wiederholung' ? 'wiederholt' : 'keine']
        : ab <= heute ? `Wiederholung: schon fällig, zu Beginn der nächsten Sitzung. ${NACHFRAGEN}` : `Wiederholung: ab ${tagCh(ab)}, zu Beginn einer Sitzung. ${NACHFRAGEN}`,
    ].join('\n') };
  },
  // Missionen wie flugschule: Prüfung insel besteht, sobald der Schritt auf der Insel steht; andere Prüfungen (Datei, http, git) kann die
  // Attrappe nicht sehen und lässt sie gelten
  mission_pruefen: (a) => {
    const m = missionen.find((x) => x.id === a.mission);
    if (!m) return { fehler: true, text: `Die Mission ${String(a.mission)} gibt es nicht.` };
    const fehlt = (m.pruefung ?? []).filter((x) => x.typ === 'insel' && rang(insel()) < rang(x.schritt ?? null));
    if (fehlt.length) return { text: `Noch nicht bestanden: ${fehlt.map((x) => `Auf der Insel steht projekt noch nicht bei «${x.schritt}».`).join(' ')}` };
    const schon = (merk('flugbuch') ?? '').split('\n').includes(m.id);
    if (!schon && HAFEN) appendFileSync(join(HAFEN, 'flugbuch'), `${m.id}\n`);
    return { text: schon ? 'Prüfung bestanden. Die Mission stand schon im Flugbuch.' : 'Prüfung bestanden. Eintrag im Flugbuch gemacht.' };
  },
  mission_holen: () => {
    const p = F.phasen[erledigtNachInsel(F, insel())];
    const fertig = (merk('flugbuch') ?? '').split('\n');
    const m = missionen.find((x) => x.phase === p?.id && !x.optional && (x.weg === 'flugschule' || x.weg === merk('weg')) && !fertig.includes(x.id));
    if (!m) return { text: p ? `Keine offene Mission in Phase ${p.id}. Was jetzt dran ist, sagt lage.` : 'Alle Missionen des Fahrplans sind geschafft.' };
    const pruefung = (m.pruefung ?? []).map((x) => (x.typ === 'insel' ? `Insel bei «${x.schritt}»` : x.typ)).join(', ');
    return { text: `Aktuelle Mission: ${m.id} («${m.titel}»), Phase ${m.phase}. Skill: ${m.skill ?? 'lotse'}. Prüfung: ${pruefung || 'keine'}.` };
  },
  skill_holen: (a) => {
    const f = join(QUELLE, 'plugins/albatros/skills', String(a.slug), 'SKILL.md');
    if (!/^[a-z0-9-]{1,64}$/.test(String(a.slug)) || !existsSync(f)) {
      return { fehler: true, text: `Den Skill ${String(a.slug)} gibt es bei Albatros nicht. Nimm den Slug genau so, wie lage ihn nennt (im Zweifel lage nochmals aufrufen); eine Methode für den Weg Geschäft holst du mit dem Werkzeug methode.` };
    }
    return { text: `Skill ${String(a.slug)} in der aktuellen Fassung von Albatros. Folge dieser Anleitung statt einer älteren Kopie.\n\n${readFileSync(f, 'utf8').replace(/^---[\s\S]*?---\s*/, '')}` };
  },
  // Einwilligung wie flugschule über konto (erfassung.ts): offen fragt mit dem festen Satz (409), true setzt ja, false setzt nein (403 und nie
  // mehr gespeichert); danach kein Hinweis zur Erfassung mehr in lage
  luecke_melden: (a) => {
    if (merk('erfassung') === 'nein') return { fehler: true, text: NEIN };
    if (a.einverstanden === false) {
      setze('erfassung', 'nein');
      return { fehler: true, text: NEIN };
    }
    if (merk('erfassung') !== 'ja') {
      if (a.einverstanden !== true) return { fehler: true, text: FRAGE };
      setze('erfassung', 'ja');
    }
    return { text: GESPEICHERT };
  },
  // Pflichtmeldungen (anliegen) gehen auch ohne Abo ans Team; sonst ohne Abo 403 (mcp: COACH_ABO), mit Abo der feste Text der Attrappe
  coach_fragen: (a) => {
    if (a.anliegen) return { text: BEIM_TEAM };
    if (stufe() === 'gratis') return { fehler: true, text: COACH_ABO };
    for (const o of ordner) {
      const t = text(o, 'coach_fragen', a);
      if (t !== null) return { text: t };
    }
    return { text: 'Der Coach hat geantwortet (Attrappe).' };
  },
  upgrade_link: (a) => {
    const ziel = a.stufe === 'light' ? 'light' : 'pilot';
    if (stufe() !== 'gratis') return { text: 'Du hast schon ein Abo. Wechseln oder kündigen kannst du im Kundenportal: https://albatros.build/cockpit/abo' };
    const erledigt = erledigtNachInsel(F, insel());
    if (a.bestaetigt !== true && erledigt <= gratisBis) {
      return { text: `${GRATIS_HINWEIS} Du stehst bei Phase ${F.phasen[erledigt]!.id}; den Link zum Abo gibt es ab ${F.phasen[gratisBis + 1]?.id ?? 'dem Wohnort'}. Will die Person das Abo trotzdem schon jetzt, ruf upgrade_link nach ihrem ausdrücklichen Ja nochmals mit bestaetigt: true auf.` };
    }
    setze('abo', ziel); // die Attrappe tut, als wäre bezahlt
    return { text: `Link zur Zahlungsseite (${STUFEN[ziel]}, CHF ${PREIS[ziel]} pro Monat): https://albatros.build/abo/checkout/${ziel}\nDie Karte gibst du nur dort ein. Danach mit konto_status prüfen, ob das Abo aktiv ist.` };
  },
  methode: (a) => {
    const vorhanden = existsSync(METHODEN) ? readdirSync(METHODEN).filter((n) => existsSync(join(METHODEN, n, 'SKILL.md'))).sort() : [];
    const gratis = stufe() === 'gratis';
    const liste = vorhanden.map((n) => `- ${n}${gratis && !GRATIS_METHODEN.includes(n) ? ' (mit Abo)' : ''}`).join('\n');
    if (typeof a.name !== 'string' || !a.name) return { text: `Methoden für den Weg Geschäft:\n${liste || GRATIS_METHODEN.map((n) => `- ${n}`).join('\n')}` };
    if (gratis && !GRATIS_METHODEN.includes(a.name)) return { text: `Die Methode ${a.name} gehört zum Abo. Ohne Abo gehen: ${GRATIS_METHODEN.join(', ')}. Den Link zum Abo gibt upgrade_link, wenn die Person es will.` };
    if (vorhanden.includes(a.name)) return { text: readFileSync(join(METHODEN, a.name, 'SKILL.md'), 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim() };
    return vorhanden.length ? { fehler: true, text: `Die Methode ${a.name} gibt es nicht. Vorhanden:\n${liste}` }
      : { text: `Methode ${a.name}: Im Durchspiel ohne albatros-methoden (DURCHSPIEL_METHODEN) gibt es keinen Text. Arbeite mit dem, was lage und die Skills sagen.` };
  },
  konto_status: () => {
    auftragWeiter();
    const [st, n, s, server, weg] = [stufe(), schloesser(), seiteName(), merk('server'), merk('weg')];
    return { text: [
      `Angemeldet. Abo: ${st === 'gratis' ? 'Gratis (Skills, Missionen und der Fahrplan bis zur fertigen Seite auf deinem Computer; keine Seite im Netz, kein Server)' : `${STUFEN[st]} (CHF ${PREIS[st]} pro Monat, aktiv)`}.`,
      'Light kostet CHF 15 pro Monat (eine Webseite unter name.aufwind.sh, auch mit eigener Domain, ohne eigenen Server), Pilot CHF 40 pro Monat (eigener Server mit 4 GB Arbeitsspeicher und 40 GB Speicher, Fliessband, tägliche Fotos, eigene Domains).',
      server ? `Server: ${server} (bereit). SSH: ssh ${server}@aufwind.sh. Hafen (Git): git@aufwind.sh:${server}/projekt.git, im Browser https://code.aufwind.sh/${server}/projekt.`
        : s ? `Seite: https://${s}.aufwind.sh (${stand(s)}). Hafen (Git): git@aufwind.sh:${s}/projekt.git, im Browser https://code.aufwind.sh/${s}/projekt.` : 'Server: keiner. Seite: keine.',
      `Weg: ${weg === 'webseite' ? 'Webseite' : weg === 'geschaeft' ? 'Geschäft' : 'noch nicht gewählt'}.`,
      `Hinterlegte Schlösser: ${n ? `${n} (ssh-ed25519 …@laptop)` : 'keine (Werkzeug schluessel_hinterlegen)'}. Guthaben für Bilder: CHF 5.00.`,
      kontoStatusZeile(), // Bauservice: der Betrag aus konto (bauservice.ts kontoStatusZeile)
    ].filter(Boolean).join(' ') };
  },
  // Wie mcp auftrag_anlegen (Schnittstelle I4, bauservice.ts AUFTRAG_ANLEGEN) und konto POST /cockpit/auftraege: ohne Ja der Text OHNE_JA,
  // ein offener Auftrag je Person (409 wörtlich wie konto)
  auftrag_anlegen: (a) => {
    if (a.bestaetigt !== true) return { fehler: true, text: OHNE_JA };
    // Dieselbe Regel wie R1 und R1b (Nahtstellen nach Welle 9): mit Pilot oder eigenem Server, ohne Setup statisch (bestätigt) kein Auftrag
    const hindernis = uebergabeHindernis(setupBeleg(String(a.setup ?? '')));
    if (hindernis) return { fehler: true, text: fuelle(hindernis, HINDERNIS_WERTE) };
    if (istOffen(merk('auftrag'))) return { fehler: true, text: 'Du hast schon einen offenen Auftrag.' };
    setze('auftrag', 'briefing');
    setze('auftrag-runde', String(runde() ?? -1));
    const p = auftragPreis();
    const abo = p.aboChfMonat === null ? '' : `, dazu Light für CHF ${p.aboChfMonat} im Monat`;
    return { text: `Auftrag #1 ist bei Albatros. Bezahlt wird erst, wenn die Vorschau gefällt: CHF ${p.einmaligChf} einmalig${abo}. `
      + `Im Cockpit unter «Dein Auftrag»: ${COCKPIT_AUFTRAG}. Dort wählt die Person ihren Projektordner und die Adresse ihrer Seite, später eine Richtung; bauen muss sie nichts mehr. Ruf lage erneut auf.` };
  },
  schluessel_hinterlegen: (a) => {
    if (!/^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256) [A-Za-z0-9+/=]{20,}/.test(String(a.schluessel).trim())) {
      return { fehler: true, text: 'Das ist kein öffentlicher Schlüssel. Gib nur den Inhalt der Datei mit .pub am Ende mit, nie den privaten Schlüssel.' };
    }
    setze('schloesser', String(schloesser() + 1));
    return { text: `Schloss hinterlegt. Hinterlegte Schlösser: ${schloesser()}.` };
  },
};

function antwort(werkzeug: string, a: Args): Antwort | null {
  if ((werkzeug === 'seite_erstellen' || werkzeug === 'server_erstellen') && HAFEN && /^[a-z0-9-]{3,32}$/.test(String(a.name ?? ''))) {
    const ziel = join(HAFEN, String(a.name), 'projekt.git');
    if (!existsSync(ziel)) spawnSync('git', ['clone', '-q', '--bare', join(HAFEN, 'vorlage.git'), ziel]);
    setze('seite', String(a.name));
    if (werkzeug === 'server_erstellen') setze('server', String(a.name));
  }
  const fest = fallOrdner ? text(fallOrdner, werkzeug, a) : null;
  if (fest !== null) return { text: fest };
  if (MIT_ZUSTAND[werkzeug]) return MIT_ZUSTAND[werkzeug](a);
  for (const o of ordner) {
    const t = text(o, werkzeug, a);
    if (t !== null) return { text: t };
  }
  return null;
}

type Knoten = { type?: string; description?: string; enum?: unknown[]; minLength?: number; maxLength?: number; pattern?: string; minItems?: number; maxItems?: number;
  items?: Knoten; properties?: Record<string, Knoten>; required?: string[]; default?: unknown };
type Schema = { name: string; description: string; inputSchema: Knoten };
const ECHT: Schema[] = JSON.parse(readFileSync(join(wurzel, 'scripts/durchspiel/mocks/werkzeuge.json'), 'utf8'));
const ANLEITUNG = readFileSync(join(wurzel, 'scripts/durchspiel/mocks/anleitung.txt'), 'utf8').trim();
const mitText = (n: string) => [...(fallOrdner ? [fallOrdner] : []), ...ordner].some((o) => existsSync(join(o, `${n}.md`)));
// auftrag_anlegen nur mit Bauservice. werkzeuge.json kam bis Welle 8 aus mcp ohne BAUSERVICE; seit dem Erzeugungsbefehl oben (Welle 9) steht
// auftrag_anlegen darin, und die Attrappe nimmt die Eingabe von dort. Bis der Koordinator neu erzeugt, steht sie hier wie in albatros services/mcp/src/bauservice.ts (Eingabe, Beschreibungen wörtlich), die Felder wie Briefing in
// services/konto/src/auftraege.ts (trim, Längen); bestaetigt ist ein Wahrheitswert, false gibt den Text OHNE_JA (Nachbesserung 02.11.2026)
const text1 = (max: number, description: string): Knoten => ({ type: 'string', minLength: 1, maxLength: max, description });
const AUFTRAG_WERKZEUG: Schema = ECHT.find((w) => w.name === 'auftrag_anlegen') ?? {
  name: 'auftrag_anlegen',
  description: 'Nur wenn die Person will, dass Albatros ihre Seite baut, lage dazu «Übergabe an Albatros» nennt und sie auf «Soll ich es schicken?» ausdrücklich Ja gesagt hat (bestaetigt: true): Legt den Auftrag mit dem Briefing an. Albatros baut bis jetzt nur Seiten ohne Baustein (Setup statisch) und nicht auf einen eigenen Server. Die Felder füllst du aus ihren Dateien, ohne Namen von Dritten und ohne Passwörter oder Zugangsdaten. Gibt Nummer, Betrag und den Link ins Cockpit zurück; bezahlt wird erst, wenn ihr die Vorschau gefällt. Höchstens ein offener Auftrag je Person.',
  inputSchema: { type: 'object', required: ['bestaetigt', 'name', 'wofuer', 'fuerWen', 'seiten', 'setup', 'stil'], properties: {
    bestaetigt: { type: 'boolean', description: 'true erst nach dem ausdrücklichen Ja der Person auf «Soll ich es schicken?»; ohne Ja legt Albatros nichts an.' },
    name: text1(120, 'Name der Seite oder des Projekts: «Name:» aus docs/konzept.md, sonst «Projektname:» aus docs/projekt.md.'),
    wofuer: text1(2000, 'Wofür die Seite ist: «In einem Satz:», «Hauptsache:» und «Erfolg:» aus docs/projekt.md; auf dem Weg Geschäft dazu docs/angebot.md.'),
    fuerWen: text1(2000, 'Für wen sie ist: «Für wen:» aus docs/projekt.md; auf dem Weg Geschäft dazu docs/zielgruppe.md.'),
    seiten: text1(2000, 'Seiten und Funktionen aus docs/plan.md («Seiten:», «Funktionen:», «Sprachen:»).'),
    setup: text1(300, 'Die Zeile «Setup:» aus docs/plan.md, wörtlich. Albatros baut bis jetzt nur Seiten, deren Setup mit statisch beginnt und von der Person bestätigt ist.'),
    adresse: { type: 'string', maxLength: 300, description: 'Bestehende Webseite: «Bestehende Seite:» aus docs/projekt.md, nur wenn es eine gibt.' },
    stil: text1(2000, 'Wirkung aus docs/konzept.md («Ton:», «Charakter:», «Muss bleiben:», «Maskottchen:», «Bildsprache:») und docs/recherche.md («Vorbilder:», «Übernehmen:», «Vermeiden:»).'),
    material: { type: 'string', maxLength: 4000, description: 'Inhalte und Pflichten aus docs/recherche.md («Inhalte vorhanden:», «Pflichten:») und die Abnahmekriterien aus docs/plan.md («Testing:»); nur Text und Links, keine Dateien.' },
  } },
};
const werkzeuge = [...ECHT.filter((w) => w.name !== 'auftrag_anlegen' && (MIT_ZUSTAND[w.name] || mitText(w.name))), ...(BAUSERVICE ? [AUFTRAG_WERKZEUG] : [])];

// ———— Eingaben wie zod im echten Dienst ————
// werkzeuge.json trägt die Eingaben von mcp als JSON Schema (z.toJSONSchema). Die Attrappe prüft sie wie zod 4 (mcp: zod 4.6.7,
// nachgebaut aus zod/v4/core schemas.js, checks.js und locales/en.js) und antwortet wie mcp mit «Ungültige Angaben: <pfad>: <meldung>, …»,
// der Pfad mit Punkten (belege.0.zeilen.0), ohne Pfad «Eingabe». Nachbesserung Welle 7 (01.11.2026, Gegenprobe zu sicht-05): Vorher
// prüfte die Attrappe nur die oberste Ebene; verschachtelte Felder (belege[].zeilen[], wuensche[]), minItems und null («received null»)
// wichen vom echten Dienst ab. Wie zod:
// - Falscher Typ: «Invalid input: expected <typ>, received <art>» (art: null, array, object, string, number, boolean, undefined).
// - Erlaubte Werte (enum): «Invalid option: expected one of "a"|"b"» für jede andere Eingabe, auch für null und ein fehlendes Pflichtfeld.
// - Text: zuerst .trim() (nur Felder in GETRIMMT), dann die Länge in Codepunkten (ein Emoji zählt 1), dann das Muster; jeder Fund zählt.
//   Ist der Typ falsch, prüft zod nur noch die Länge, und nur wenn der Wert eine hat (eine Liste: «expected array to have <=300 items»).
// - Liste: Länger als maxItems gibt nur diesen Fund, die Einträge prüft zod dann nicht. Sonst die Einträge (pfad.0, pfad.1, …), danach die
//   Länge; hatte ein Eintrag schon eine zu lange Liste, nicht mehr.
// - Objekt: die Felder in der Reihenfolge des Schemas. Fehlt ein freiwilliges Feld, nichts (mit default: der Wert); fehlt ein Pflichtfeld,
//   prüft zod undefined. Unbekannte Felder fallen weg, wie bei zod.
// Was das JSON Schema nicht trägt, steht hier: eigene Meldungen von mcp zu Mustern (services/mcp/src/werkzeuge.ts, gemeinsam.ts) und
// .trim(). scripts/durchspiel.test.ts vergleicht das mit dem echten mcp für Grenzwerte jedes Felds; weicht etwas ab, wird er rot.
const MUSTER_MELDUNG: Record<string, string> = {
  '^[^\\u0000-\\u001f]*$': 'Ohne Zeilenumbrüche',
  '^[a-z0-9][a-z0-9-]{0,39}$': 'Kleinbuchstaben, Ziffern und «-», höchstens 40 Zeichen',
  '^[a-z0-9][a-z0-9-]{0,63}$': 'Kleinbuchstaben, Ziffern und «-», höchstens 64 Zeichen',
};
const GETRIMMT = new Set(['schritt_melden.titel', ...['name', 'wofuer', 'fuerWen', 'seiten', 'setup', 'adresse', 'stil', 'material'].map((f) => `auftrag_anlegen.${f}`)]);
type Fund = { pfad: (string | number)[]; text: string; weiter?: boolean }; // weiter wie issue.continue bei zod: false hält alles Weitere an
const artVon = (v: unknown) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
const alsWert = (v: unknown) => (typeof v === 'string' ? `"${v}"` : String(v));
// Länge wie zod $ZodCheckMinLength/$ZodCheckMaxLength: für jeden Wert mit length (auch nach falschem Typ), Text in Codepunkten
const EINHEIT: Record<string, string> = { string: 'characters', array: 'items' };
function laengen(min: number | undefined, max: number | undefined, v: unknown, pfad: Fund['pfad'], funde: Fund[]) {
  for (const [grenze, zuKlein] of [[min, true], [max, false]] as const) {
    if (grenze === undefined || funde.some((f) => f.weiter === false) || v === null || v === undefined || (v as { length?: unknown }).length === undefined) continue;
    const roh = (v as { length: number }).length;
    const n = typeof v === 'string' && (zuKlein ? roh >= grenze && roh < grenze * 2 : roh > grenze) ? [...v].length : roh;
    if (zuKlein ? n >= grenze : n <= grenze) continue;
    const herkunft = Array.isArray(v) ? 'array' : typeof v === 'string' ? 'string' : 'unknown';
    const e = EINHEIT[herkunft];
    const satz = zuKlein ? `Too small: expected ${herkunft} to ${e ? 'have ' : 'be '}>=${grenze}` : `Too big: expected ${herkunft} to ${e ? 'have ' : 'be '}<=${grenze}`;
    funde.push({ pfad, text: e ? `${satz} ${e}` : satz, weiter: true });
  }
}
function pruefe(s: Knoten, roh: unknown, pfad: Fund['pfad'], feld: string): { funde: Fund[]; wert: unknown } {
  const funde: Fund[] = [];
  if (s.enum) {
    if (!s.enum.includes(roh)) funde.push({ pfad, text: s.enum.length === 1 ? `Invalid input: expected ${alsWert(s.enum[0])}` : `Invalid option: expected one of ${s.enum.map(alsWert).join('|')}` });
    return { funde, wert: roh };
  }
  const falsch = (typ: string) => funde.push({ pfad, text: `Invalid input: expected ${typ}, received ${artVon(roh)}` });
  if (s.type === 'object') {
    if (typeof roh !== 'object' || roh === null || Array.isArray(roh)) { falsch('object'); return { funde, wert: roh }; }
    const wert: Args = {};
    for (const [k, p] of Object.entries(s.properties ?? {})) {
      if (!(k in roh) && !s.required?.includes(k)) { if (p.default !== undefined) wert[k] = p.default; continue; }
      const r = pruefe(p, (roh as Args)[k], [...pfad, k], `${feld}.${k}`);
      funde.push(...r.funde);
      if (r.wert !== undefined) wert[k] = r.wert;
    }
    return { funde, wert };
  }
  if (s.type === 'array') {
    if (Array.isArray(roh) && s.maxItems !== undefined && roh.length > s.maxItems) return { funde: [{ pfad, text: `Too big: expected array to have <=${s.maxItems} items`, weiter: false }], wert: roh };
    let wert = roh;
    if (!Array.isArray(roh)) falsch('array');
    else wert = roh.map((x, i) => { const r = pruefe(s.items ?? {}, x, [...pfad, i], feld); funde.push(...r.funde); return r.wert; });
    laengen(s.minItems, s.maxItems, wert, pfad, funde);
    return { funde, wert };
  }
  if (s.type === 'string') {
    let wert = roh;
    if (typeof roh !== 'string') falsch('string');
    else if (GETRIMMT.has(feld)) wert = roh.trim();
    laengen(s.minLength, s.maxLength, wert, pfad, funde);
    if (typeof wert === 'string' && s.pattern !== undefined && !new RegExp(s.pattern).test(wert)) {
      funde.push({ pfad, text: MUSTER_MELDUNG[s.pattern] ?? `Invalid string: must match pattern /${s.pattern}/`, weiter: true });
    }
    return { funde, wert };
  }
  if (s.type === 'boolean' && typeof roh !== 'boolean') falsch('boolean');
  return { funde, wert: roh };
}
// Wie mcp (app.ts): arguments fehlt oder ist null: {}; Meldung je Fund «<pfad>: <meldung>», ohne Pfad «Eingabe»
const ungueltig = (w: Schema, roh: unknown): { fehler: string[]; a: Args } => {
  const r = pruefe(w.inputSchema, roh ?? {}, [], w.name);
  return { fehler: r.funde.map((f) => `${f.pfad.join('.') || 'Eingabe'}: ${f.text}`), a: r.wert as Args };
};

const runde = () => { const f = process.env.DURCHSPIEL_RUNDE; return f && existsSync(f) ? Number(readFileSync(f, 'utf8').trim()) : null; };
const senden = (x: unknown) => process.stdout.write(`${JSON.stringify(x)}\n`);
let puffer = '';
process.stdin.on('data', (d) => {
  puffer += d;
  let i;
  while ((i = puffer.indexOf('\n')) >= 0) {
    const zeile = puffer.slice(0, i).trim();
    puffer = puffer.slice(i + 1);
    if (!zeile) continue;
    const m = JSON.parse(zeile);
    if (m.id === undefined) continue; // Benachrichtigungen
    if (m.method === 'initialize') {
      senden({ jsonrpc: '2.0', id: m.id, result: { protocolVersion: m.params?.protocolVersion ?? '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'albatros-attrappe', version: '2' }, instructions: ANLEITUNG } });
    } else if (m.method === 'tools/list') {
      senden({ jsonrpc: '2.0', id: m.id, result: { tools: werkzeuge } });
    } else if (m.method === 'tools/call') {
      // Wie mcp (app.ts): ein Werkzeug, das die Attrappe nicht anbietet, ist ein Fehler von JSON-RPC (-32602), keine Antwort des Werkzeugs
      const name = String(m.params?.name);
      const roh: unknown = m.params?.arguments;
      const w = werkzeuge.find((x) => x.name === name);
      const { fehler, a } = w ? ungueltig(w, roh) : { fehler: [], a: {} };
      const r: Antwort = !w ? { fehler: true, text: `Unbekanntes Werkzeug: ${name}` } : fehler.length ? { fehler: true, text: `Ungültige Angaben: ${fehler.join(', ')}` }
        : antwort(name, a) ?? { fehler: true, text: `Werkzeug ${name} gibt es nicht.` };
      process.stderr.write(`[attrappe] ${name} ${JSON.stringify(roh ?? {})}\n`);
      // Für scripts/punkte.ts (Bauservice): angebot, lage zeigte die Zeile «Angebot:»; uebergabe, lage nannte die Übergabe an Albatros (R1b);
      // betraege, alle Beträge in CHF in der Antwort (lage, konto_status, auftrag_anlegen …): Die KI darf nur diese nennen, nie andere
      const angebot = name === 'lage' && /^Angebot: /m.test(r.text);
      const uebergabe = name === 'lage' && /^Jetzt dran: Skill `konzept`, Abschnitt «Übergabe an Albatros»/m.test(r.text);
      // einmalig: der Betrag des Bauservice («CHF … einmalig» im Angebot, in konto_status oder in der Antwort von auftrag_anlegen)
      const betraege = [...new Set([...r.text.matchAll(/CHF\s*(\d[\d'’]*)/g)].map((x) => Number(x[1]!.replace(/['’]/g, ''))))];
      const einmalig = /CHF\s*(\d[\d'’]*) einmalig/.exec(r.text)?.[1];
      // auftrag (Welle 9, w9-42): Stand des Auftrags, wie lage und konto_status ihn eben gesehen haben (punkte.ts: Vorschau erreicht)
      const auftrag = BAUSERVICE && (name === 'lage' || name === 'konto_status') ? merk('auftrag') : null;
      if (process.env.DURCHSPIEL_LOG) appendFileSync(process.env.DURCHSPIEL_LOG, `${JSON.stringify({ zeit: new Date().toISOString(), runde: runde(), werkzeug: name, argumente: roh ?? {}, fehler: r.fehler ?? false, ...(angebot ? { angebot } : {}), ...(uebergabe ? { uebergabe } : {}), ...(betraege.length ? { betraege } : {}), ...(einmalig ? { einmalig: Number(einmalig.replace(/['’]/g, '')) } : {}), ...(auftrag ? { auftrag } : {}) })}\n`);
      senden(w ? { jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text: r.text }], ...(r.fehler ? { isError: true } : {}) } }
        : { jsonrpc: '2.0', id: m.id, error: { code: -32602, message: r.text } });
    } else if (m.method === 'ping') {
      senden({ jsonrpc: '2.0', id: m.id, result: {} });
    } else {
      senden({ jsonrpc: '2.0', id: m.id, error: { code: -32601, message: `Unbekannte Methode: ${String(m.method)}` } }); // wie mcp
    }
  }
});
