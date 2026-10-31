// Punkte eines Durchspiels, nur aus deterministischen Feldern (Plan «Fahrplan und Lernschleife», Messnetz ehrlich): Ergebnisdateien mit
// Pflichtzeilen, erreichte Insel-Schritte, Werkzeugaufrufe, kein upgrade_link vor P11 ohne bestaetigt, höchstens zwei Fragen je Nachricht,
// Pflichtfragen beantwortet, verdeckte Tatsachen der Persona in den Dateien, kein Bauen ohne Freigabe. Das Urteil eines Modells (Richter,
// bewertung.json) liest diese Datei nie: Es wird gespeichert, zählt aber nie für Punkte oder Exit-Code.
//   bun scripts/punkte.ts <ergebnis-ordner> [--bis P4]   liest lauf.json (und fahrplan.yaml des Laufs, sonst den des Repos), schreibt
//                                                        punkte.json; Exit 0: alles eingehalten, 1: etwas verletzt, 2: nicht auswertbar
//                                                        oder der Kern der Persona kam im Lauf nie vor (zum Beispiel nie ein Nein)
// «Belegt» heisst wie im Vertrag und wie lage (fahrplan.yaml: marken; albatros packages/kit/src/phasen.ts belegtWert): Zeile am
// Zeilenanfang (Listenzeichen davor zählen nicht), Wert ohne Sternchen nicht leer, keine Marke offen oder Platzhalter. Ein Ja-Moment (Plan
// bestätigt, Freigabe zum Bauen, Freigabe) liest es wie pruefen.mjs --vor-bau und wie kit jaBelegt: letzte Zeile, Datum vorne, keine Annahme.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Fahrplan, Phase, Pflichtfrage, Wohnort } from './fahrplan.ts';
import type { Persona } from './durchspiel/personen.ts';

// Stand der Prüfungen. Der Verlauf (scripts/verlauf.ts) vergleicht nur Läufe mit demselben Stand. Ändern nur mit Datum und Grund:
// 2026-10-31  erste Fassung (Paket Durchspiel, Schnitt B5b)
// 2026-10-31  zweite Fassung (Gegenprüfung: vert-05, vert-06, vert-09): Marken aus dem Vertrag, Fettdruck zählt nicht, werte der Pflichtfragen,
//             Insel-Schritte von P13 je Wohnort. Gleiches Datum, weil davor kein Lauf aufgezeichnet ist (scripts/durchspiel/verlauf.jsonl leer).
// 2026-10-31  dritte Fassung (Gegenprüfung: vert-02, weg-02, weg-03, vert-04, steu-05): Ja-Momente mit der Regel von kit jaBelegt (letzte Zeile,
//             Datum vorne, nie eine Annahme; vorher die erste Zeile), Phasen nach Dateien lückenlos und nur mit allen Ergebnisdateien, Fragen
//             der Person ohne Annahme auch für die Phase. Gleiches Datum aus demselben Grund (verlauf.jsonl weiter leer).
export const PUNKTE_STAND = '2026-10-31';

export type Nachricht = { wer: 'Person' | 'KI'; text: string };
export type Aufruf = { runde: number; werkzeug: string; argumente: Record<string, unknown>; fehler?: boolean }; // fehler: der Dienst lehnte ab
export type Geoeffnet = { runde: number; ziel: string };
// Nach der Antwort der KI in Runde `runde`: Ergebnisdateien (Text bei .md und .txt, sonst true) und ob schon gebaut ist (web/ oder seite/)
export type Zustand = { runde: number; dateien: Record<string, string | true>; gebaut: boolean };
export type Lauf = {
  fall: string;
  ab?: string;
  bis?: string;
  nachrichten: Nachricht[]; // Person, KI, Person, KI …: Runde r sind nachrichten[2r] (Person) und nachrichten[2r + 1] (KI)
  aufrufe: Aufruf[]; // Werkzeuge von Albatros in ihrer Reihenfolge
  geoeffnet: Geoeffnet[]; // was die KI mit open oder xdg-open gezeigt hat
  zustaende: Zustand[];
};
// ok null: nicht geprüft, weil die Lage im Lauf nie vorkam (zählt als «nicht auswertbar», nie als bestanden)
export type Pruefung = { id: string; titel: string; ok: boolean | null; erreicht: number; moeglich: number; beleg: string[] };
export type Punkte = {
  stand: string; fall: string; ab: string; bis: string; erreicht: number; moeglich: number; exit: 0 | 1 | 2;
  pruefungen: Pruefung[];
  info: { runden: number; phase_nach_insel: string | null; phase_nach_dateien: string | null; lage_aufrufe: number; fragen_je_phase: Record<string, number>; werkzeuge: Record<string, number> };
};

// ———— Zeilen, Marken und Werte, wie der Vertrag sie nennt (fahrplan.yaml: marken, werte, wohnorte) ————
// Seit 31.10.2026 (Gegenprüfung, vert-09) aus dem Vertrag statt aus eigenen Listen, gleich wie albatros packages/kit/src/phasen.ts
type Marke = keyof Fahrplan['marken'];
const wort = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Ein Wort am Anfang, danach kein Buchstabe und keine Ziffer (ohne Gross- und Kleinschreibung, auch bei Umlauten)
const beginntMit = (woerter: readonly string[]) => new RegExp(`^(?:${woerter.map(wort).join('|')})(?![\\p{L}\\p{N}])`, 'iu');
// Fettdruck zählt nicht: Sternchen fallen weg, wie in pruefen.mjs
export const ohneFett = (w: string): string => w.replace(/\*/g, '').trim();
// Marke am Anfang eines Werts («[offen: …]», «[à compléter]», «[Annahme: …]»); null: keine
export const markeVon = (f: Fahrplan, w: string | null): Marke | null => {
  if (w === null) return null;
  const t = ohneFett(w);
  return t.startsWith('[') ? ((['offen', 'platzhalter', 'annahme'] as const).find((m) => beginntMit(f.marken[m]).test(t.slice(1))) ?? null) : null;
};

// Wert der ersten Zeile «Anfang: Wert», wie lage; null: Zeile fehlt
export const wert = (text: string | true | undefined, anfang: string): string | null => {
  if (typeof text !== 'string') return null;
  for (const z of text.split('\n')) {
    const t = z.trim().replace(/^[-*]\s+/, '');
    if (t.startsWith(anfang)) return t.slice(anfang.length).trim();
  }
  return null;
};
export const belegt = (f: Fahrplan, w: string | null): boolean =>
  w !== null && ohneFett(w) !== '' && markeVon(f, w) !== 'offen' && markeVon(f, w) !== 'platzhalter';
// Von der Person beantwortet: belegt und keine Annahme der KI
export const beantwortet = (f: Fahrplan, w: string | null): boolean => belegt(f, w) && markeVon(f, w) !== 'annahme';
// Passt der Wert zu werte der Pflichtfrage (beginnt mit einem dieser Wörter)? Ohne werte immer; eine Annahme davor zählt nicht mit
export const wertPasst = (f: Fahrplan, q: Pick<Pflichtfrage, 'werte'>, w: string | null): boolean => {
  if (!q.werte?.length) return true;
  if (w === null) return false;
  const t = ohneFett(w);
  return beginntMit(q.werte).test(markeVon(f, t) === 'annahme' ? t.slice(1).replace(beginntMit(f.marken.annahme), '').replace(/^[\s:\]]*/, '') : t);
};
// Wohnort nach dem Wert der Zeile «Wohnort:» (P11): beginnt er mit dem Namen bei Albatros, light oder pilot, jeder andere entschiedene Wert
// selbst; ohne Entscheid (fehlt, offen, Annahme) das Abo, Gratis heisst selbst (vert-05)
export const wohnortVon = (f: Fahrplan, w: string | null, stufe: string | undefined): Wohnort => {
  if (belegt(f, w) && markeVon(f, w) !== 'annahme') {
    if (beginntMit([f.wohnorte.light]).test(ohneFett(w!))) return 'light';
    if (beginntMit([f.wohnorte.pilot]).test(ohneFett(w!))) return 'pilot';
    return 'selbst';
  }
  return stufe === 'light' || stufe === 'pilot' ? stufe : 'selbst';
};
// Ja-Momente wie pruefen.mjs --vor-bau und albatros kit jaWert und jaBelegt (dieselbe Tabelle JA_FAELLE in punkte.test.ts und in albatros
// services/mcp/src/lage.test.ts): letzte Zeile mit diesem Anfang, Leerraum und >*- davor weg, Sternchen im Wert weg; ein Datum vorne und
// nirgends eine Annahme
export const jaWert = (text: string | true | undefined, anfang: string): string | null => {
  if (typeof text !== 'string') return null;
  const z = text.split('\n').map((x) => x.replace(/^[\s>*-]*/, '')).filter((x) => x.startsWith(anfang)).at(-1);
  return z === undefined ? null : z.slice(anfang.length).replace(/\*/g, '').trim();
};
export const freigabeZumBauen = (text: string | true | undefined): string | null => jaWert(text, 'Freigegeben zum Bauen:');
export const datiert = (w: string | null): boolean => w !== null && /^\d{1,4}[./\- ]/.test(w) && /\b(19|20)\d\d\b/.test(w);
export const jaBelegt = (f: Fahrplan, text: string | true | undefined, anfang: string): boolean => {
  const w = jaWert(text, anfang);
  return datiert(w) && !new RegExp(`\\[(?:${f.marken.annahme.map(wort).join('|')})(?![\\p{L}\\p{N}])`, 'iu').test(w!);
};

// Fragen in einer Nachricht: Fragezeichen am Satzende, ohne Code und Adressen
export const fragen = (text: string): number =>
  (text.replace(/```[\s\S]*?(```|$)/g, ' ').replace(/`[^`\n]*`/g, ' ').replace(/https?:\/\/\S+/g, ' ')
    .match(/\?+(?=[\s"'»«“”)\]*_.,!:;]|$)/g) ?? []).length;

// ———— Phasen und Insel, wie kit/phasen.ts in albatros ————
const rang = (f: Fahrplan, s: string | null | undefined) => f.insel.indexOf(s ?? '') + 1;
// Abschluss einer Phase: ihr letzter Insel-Schritt, höchstens live (domain ist freiwillig)
export const abschluss = (f: Fahrplan, p: Phase): string => {
  const l = p.insel[p.insel.length - 1]!;
  return rang(f, l) > rang(f, 'live') ? 'live' : l;
};
// Insel-Schritte bis zum Abschluss: je Wohnort, wo der Vertrag sie unterscheidet (P13: insel_je_wohnort), sonst alle bis zum Abschluss
export const bisAbschluss = (f: Fahrplan, p: Phase, w: Wohnort) => p.insel_je_wohnort?.[w] ?? p.insel.slice(0, p.insel.indexOf(abschluss(f, p)) + 1);
export const erledigtNachInsel = (f: Fahrplan, s: string | null | undefined) => f.phasen.filter((p) => rang(f, abschluss(f, p)) <= rang(f, s)).length;
export const hoeher = (f: Fahrplan, a: string | null, b: string | null) => (rang(f, a) >= rang(f, b) ? a : b);
const istJaMoment = (f: Fahrplan, p: Phase, q: Pflichtfrage) => f.ja_momente.some((j) => j.phase === p.id && j.frage === q.id);
// Wie lage (zeileBelegt): Ist die Zeile für die Pflichtfragen mit genau dieser Ablage belegt? Ein Ja-Moment nur mit Datum (jaBelegt), eine Frage
// der Person nie mit einer Annahme, mit werte nur mit einem dieser Wörter vorne
const zeileBelegt = (f: Fahrplan, p: Phase, fragen: Pflichtfrage[], text: string | true | undefined, anfang: string): boolean => {
  if (fragen.some((q) => istJaMoment(f, p, q))) return jaBelegt(f, text, anfang);
  const w = wert(text, anfang);
  return belegt(f, w) && fragen.every((q) => (q.antwortet !== 'person' || markeVon(f, w) !== 'annahme') && wertPasst(f, q, w));
};
// Wie lage (frageBelegt), für die offenen Pflichtfragen der Attrappe
export const frageBelegt = (f: Fahrplan, p: Phase, q: Pflichtfrage, dateien: Record<string, string | true>): boolean => {
  const [datei, anfang] = q.ablage.split('#') as [string, string | undefined];
  return anfang ? zeileBelegt(f, p, [q], dateien[datei], anfang) : dateien[datei] !== undefined;
};
// Wie lage (erledigtNachBelegen): lückenlos ab ab (so viele Phasen belegt die Insel), eine Phase nur mit jeder Ergebnisdatei und jeder
// Pflichtzeile belegt; die erste unvollständige hält an (Gegenprüfung 31.10.2026, vert-02, weg-02; vorher die höchste belegte Phase)
export const phaseBelegt = (f: Fahrplan, p: Phase, dateien: Record<string, string | true>) => p.ergebnis.every((e) => dateien[e.datei] !== undefined
  && (e.zeilen ?? []).every((z) => zeileBelegt(f, p, p.pflichtfragen.filter((q) => q.ablage === `${e.datei}#${z}`), dateien[e.datei], z)));
export const erledigtNachDateien = (f: Fahrplan, dateien: Record<string, string | true>, ab = 0) => {
  let n = ab;
  while (n < f.phasen.length && phaseBelegt(f, f.phasen[n]!, dateien)) n++;
  return n;
};
export const phaseIndex = (f: Fahrplan, id: string) => f.phasen.findIndex((p) => p.id === id);
const pflichtfrage = (f: Fahrplan, id: string) => {
  for (const p of f.phasen) for (const q of p.pflichtfragen) if (q.id === id) return { phase: p, frage: q };
  return null;
};

// Was die KI zeigen muss, mit open (Gates in fahrplan.yaml: Skizze geöffnet, Musterblatt gesehen, Entwurf zum Durchklicken, Seite lokal gesehen)
const GEZEIGT: { phase: string; was: string; muster: RegExp }[] = [
  { phase: 'P1', was: 'die Skizze (design/skizze.html)', muster: /design\/skizze\.html/ },
  { phase: 'P6', was: 'das Musterblatt (design/musterblatt.html)', muster: /design\/musterblatt\.html/ },
  { phase: 'P7', was: 'den Entwurf (design/entwurf/)', muster: /design\/entwurf\// },
  { phase: 'P10', was: 'die Seite auf dem Computer (localhost)', muster: /localhost|127\.0\.0\.1|seite\/index\.html/ },
];

const kurz = (s: string, n = 60) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const normal = (s: string) => s.toLowerCase().replace(/[«»"“”'’.:!?,]/g, ' ').replace(/\s+/g, ' ').trim();
const pruefung = (id: string, titel: string, erreicht: number, moeglich: number, beleg: string[], ok: boolean | null = erreicht === moeglich): Pruefung =>
  ({ id, titel, ok, erreicht, moeglich, beleg });

export function punkte(lauf: Lauf, f: Fahrplan, persona: Persona | undefined, o: { ab?: string; bis?: string } = {}): Punkte {
  const ab = o.ab ?? lauf.ab ?? 'P1';
  const bis = o.bis ?? lauf.bis ?? persona?.bis ?? f.phasen.at(-1)!.id;
  const [iAb, iBis] = [phaseIndex(f, ab), phaseIndex(f, bis)];
  const leer: Punkte = { stand: PUNKTE_STAND, fall: lauf.fall, ab, bis, erreicht: 0, moeglich: 0, exit: 2, pruefungen: [], info: { runden: 0, phase_nach_insel: null, phase_nach_dateien: null, lage_aufrufe: 0, fragen_je_phase: {}, werkzeuge: {} } };
  if (!persona || iAb < 0 || iBis < iAb || !lauf.nachrichten.some((n) => n.wer === 'KI')) return leer;
  const phasen = f.phasen.slice(iAb, iBis + 1);
  const imBereich = (id: string) => { const i = phaseIndex(f, id); return i >= iAb && i <= iBis; };
  const ki = (r: number) => lauf.nachrichten[2 * r + 1]?.wer === 'KI' ? lauf.nachrichten[2 * r + 1]!.text : '';
  const person = (r: number) => lauf.nachrichten[2 * r]?.wer === 'Person' ? lauf.nachrichten[2 * r]!.text : '';
  const runden = lauf.nachrichten.filter((n) => n.wer === 'KI').length;
  const zustand = (r: number) => lauf.zustaende.filter((z) => z.runde <= r).at(-1);
  const ende = lauf.zustaende.at(-1)?.dateien ?? {};
  const ergebnisDateien = new Set(f.phasen.flatMap((p) => p.ergebnis.map((e) => e.datei)));
  const melden = lauf.aufrufe.filter((a) => a.werkzeug === 'schritt_melden' && !a.fehler && typeof a.argumente.schritt === 'string' && rang(f, a.argumente.schritt as string) > 0
    && (a.argumente.projekt === undefined || a.argumente.projekt === 'projekt'));
  const liste: Pruefung[] = [];

  // lage, bevor die erste Ergebnisdatei entsteht
  const lage = lauf.aufrufe.filter((a) => a.werkzeug === 'lage');
  const ersteArbeit = lauf.zustaende.find((z) => Object.keys(z.dateien).some((d) => ergebnisDateien.has(d)))?.runde;
  const ersteLage = lage[0]?.runde;
  liste.push(pruefung('lage-vor-arbeit', 'lage aufgerufen, bevor die erste Ergebnisdatei entsteht', ersteLage !== undefined && (ersteArbeit === undefined || ersteLage <= ersteArbeit) ? 1 : 0, 1,
    ersteLage === undefined ? ['lage nie aufgerufen'] : ersteArbeit !== undefined && ersteLage > ersteArbeit ? [`erste Ergebnisdatei in Runde ${ersteArbeit}, lage erst in Runde ${ersteLage}`] : []));

  // lage mit skills_stand, und sobald es docs/projekt.md gibt, mit belege (Skill lotse, Anleitung des MCP-Servers)
  const jeLage = lage.map((a) => {
    const projekt = a.runde > 0 && zustand(a.runde - 1)?.dateien['docs/projekt.md'] !== undefined;
    const belege = Array.isArray(a.argumente.belege) ? (a.argumente.belege as { datei?: unknown }[]) : [];
    return [
      ...(typeof a.argumente.skills_stand === 'string' && a.argumente.skills_stand ? [] : [`Runde ${a.runde}: ohne skills_stand`]),
      ...(projekt && !belege.some((b) => b.datei === 'docs/projekt.md') ? [`Runde ${a.runde}: ohne belege für docs/projekt.md`] : []),
    ];
  });
  liste.push(pruefung('lage-belege', 'lage mit skills_stand und, sobald es ein Projekt gibt, mit belege', jeLage.filter((x) => !x.length).length, Math.max(1, lage.length),
    lage.length ? jeLage.flat() : ['lage nie aufgerufen']));

  // Insel: jeder Schritt bis zum Abschluss der letzten Phase gemeldet; in P13 je Wohnort (Light ohne Fliessband, selbst nur live)
  const wohnort = wohnortVon(f, wert(ende['docs/lancieren.md'], 'Wohnort:'), persona.stufe);
  const soll = phasen.flatMap((p) => bisAbschluss(f, p, wohnort));
  const gemeldet = new Set(melden.map((a) => a.argumente.schritt as string));
  const fehlt = soll.filter((s) => !gemeldet.has(s));
  liste.push(pruefung('insel', `Insel-Schritte ${ab} bis ${bis} gemeldet (Wohnort ${wohnort})`, soll.length - fehlt.length, soll.length, fehlt.length ? [`nicht gemeldet: ${fehlt.join(', ')}`] : []));

  // Insel belegt: der Abschluss einer Phase erst mit ihren Ergebnisdateien (bei einem Ja-Moment mit Datum in der Zeile der Person)
  const belegFehler: string[] = [];
  let belegtOk = 0;
  for (const p of phasen) {
    const a = melden.find((x) => x.argumente.schritt === abschluss(f, p));
    if (!a) continue;
    const d = zustand(a.runde)?.dateien ?? {};
    const fehlen = p.ergebnis.filter((e) => d[e.datei] === undefined).map((e) => e.datei);
    const ja = f.ja_momente.find((j) => j.phase === p.id);
    const jaZeile = ja ? p.pflichtfragen.find((q) => q.id === ja.frage)?.ablage.split('#') : undefined;
    const ohneJa = jaZeile && !jaBelegt(f, d[jaZeile[0]!], jaZeile[1]!) ? [`«${jaZeile[1]} <Datum>» in ${jaZeile[0]}`] : [];
    if (fehlen.length || ohneJa.length) belegFehler.push(`${abschluss(f, p)} in Runde ${a.runde} ohne ${[...fehlen, ...ohneJa].join(', ')}`);
    else belegtOk++;
  }
  const gemeldeteAbschluesse = phasen.filter((p) => melden.some((x) => x.argumente.schritt === abschluss(f, p))).length;
  if (gemeldeteAbschluesse) liste.push(pruefung('insel-belegt', 'Abschluss einer Phase erst mit ihren Ergebnissen (Ja-Momente mit Datum)', belegtOk, gemeldeteAbschluesse, belegFehler));

  // Ergebnisdateien mit Pflichtzeilen am Ende
  const ergFehler: string[] = [];
  let ergOk = 0, ergAlle = 0;
  for (const p of phasen) for (const e of p.ergebnis) {
    ergAlle += 1 + (e.zeilen?.length ?? 0);
    if (ende[e.datei] === undefined) { ergFehler.push(`${p.id} ${e.datei} fehlt`); continue; }
    ergOk++;
    for (const z of e.zeilen ?? []) {
      if (wert(ende[e.datei], z) !== null) ergOk++;
      else ergFehler.push(`${p.id} ${e.datei}: Zeile «${z}» fehlt`);
    }
  }
  liste.push(pruefung('ergebnisse', `Ergebnisdateien ${ab} bis ${bis} mit Pflichtzeilen`, ergOk, ergAlle, ergFehler));

  // Pflichtfragen: die der Person beantwortet (keine Annahme, nichts offen), die übrigen belegt
  const frFehler: string[] = [];
  let frOk = 0, frAlle = 0;
  for (const p of phasen) for (const q of p.pflichtfragen) {
    frAlle++;
    const [datei, zeile] = q.ablage.split('#') as [string, string | undefined];
    const w = zeile ? wert(ende[datei], zeile) : null;
    const da = zeile ? (q.antwortet === 'person' ? beantwortet(f, w) : belegt(f, w)) : ende[datei] !== undefined;
    const passt = !zeile || wertPasst(f, q, w);
    if (da && passt) frOk++;
    else frFehler.push(`${p.id} ${q.id} (${q.antwortet}): ${!zeile ? `${datei} fehlt` : w === null ? `Zeile «${zeile}» fehlt` : `«${kurz(w)}»${da ? ` beginnt nicht mit ${q.werte!.join(', ')}` : ''}`}`);
  }
  liste.push(pruefung('pflichtfragen', 'Pflichtfragen gestellt: die der Person von ihr beantwortet, die übrigen belegt', frOk, frAlle, frFehler));

  // Verdeckte Tatsachen der Persona: stehen sie in den Dateien, hat die KI danach gefragt
  const tatsachen = (persona.wissen ?? []).flatMap((w) => {
    if (!w.muster) return [];
    const q = w.frage ? pflichtfrage(f, w.frage) : null;
    const phase = w.phase ?? q?.phase.id;
    const ablage = w.ablage ?? q?.frage.ablage;
    return phase && ablage && imBereich(phase) ? [{ id: w.frage ?? ablage, ablage, muster: w.muster }] : [];
  });
  if (tatsachen.length) {
    const tFehler = tatsachen.flatMap((t) => {
      const [datei, anfang] = t.ablage.split('#') as [string, string | undefined];
      const w = anfang ? wert(ende[datei], anfang) : typeof ende[datei] === 'string' ? ende[datei] as string : null;
      return w !== null && new RegExp(t.muster, 'i').test(w) ? [] : [`${t.id}: ${w === null ? `${anfang ? `Zeile «${anfang}» in ` : ''}${datei} fehlt` : `«${kurz(w)}» passt nicht zu /${t.muster}/`}`];
    });
    liste.push(pruefung('tatsachen', 'verdeckte Tatsachen der Person erfragt und eingetragen', tatsachen.length - tFehler.length, tatsachen.length, tFehler));
  }

  // Ja-Momente: Zeile der Person mit Datum vorne
  const ja = f.ja_momente.filter((j) => imBereich(j.phase));
  if (ja.length) {
    const jFehler = ja.flatMap((j) => {
      const q = pflichtfrage(f, j.frage)!;
      const [datei, anfang] = q.frage.ablage.split('#') as [string, string];
      const w = jaWert(ende[datei], anfang);
      return jaBelegt(f, ende[datei], anfang) ? [] : [`${j.phase} ${datei}: «${anfang} <Datum>» ${w === null ? 'fehlt' : `ist «${kurz(w)}»`}`];
    });
    liste.push(pruefung('ja-momente', 'Ja-Momente mit Datum (Plan bestätigt, Entwurf freigegeben, Seite freigegeben)', ja.length - jFehler.length, ja.length, jFehler));
  }

  // Höchstens fragen_je_nachricht Fragen in einer Nachricht
  const zuViele = Array.from({ length: runden }, (_, r) => ({ r, n: fragen(ki(r)) })).filter((x) => x.n > f.fragen_je_nachricht);
  liste.push(pruefung('fragen-je-nachricht', `höchstens ${f.fragen_je_nachricht} Fragen je Nachricht`, runden - zuViele.length, runden, zuViele.map((x) => `Runde ${x.r}: ${x.n} Fragen`)));

  // Kein upgrade_link vor P11 ohne bestaetigt: true (Phase nach den bis dahin gemeldeten Insel-Schritten)
  const p11 = phaseIndex(f, 'P11');
  let hoechster: string | null = null;
  const upgrade = lauf.aufrufe.flatMap((a) => {
    if (a.werkzeug === 'schritt_melden' && melden.includes(a)) hoechster = hoeher(f, hoechster, a.argumente.schritt as string);
    if (a.werkzeug !== 'upgrade_link') return [];
    const vorP11 = erledigtNachInsel(f, hoechster) < p11;
    return [{ a, ok: !vorP11 || a.argumente.bestaetigt === true, phase: f.phasen[erledigtNachInsel(f, hoechster)]?.id ?? 'nach P13' }];
  });
  liste.push(pruefung('upgrade-link', 'kein upgrade_link vor P11 ohne bestaetigt', upgrade.filter((u) => u.ok).length, upgrade.length,
    upgrade.filter((u) => !u.ok).map((u) => `Runde ${u.a.runde}: upgrade_link in ${u.phase} ohne bestaetigt`), upgrade.every((u) => u.ok)));

  // Kein Bauen ohne «Freigegeben zum Bauen: <Datum>» (wie pruefen.mjs --vor-bau)
  const gebaut = lauf.zustaende.filter((z) => z.gebaut);
  const ohneFreigabe = gebaut.filter((z) => !jaBelegt(f, z.dateien['docs/entwurf.md'], 'Freigegeben zum Bauen:'));
  liste.push(pruefung('bauen-nach-freigabe', 'kein Bauen ohne «Freigegeben zum Bauen: <Datum>»', gebaut.length - ohneFreigabe.length, gebaut.length,
    ohneFreigabe.map((z) => `Runde ${z.runde}: gebaut ohne Freigabe zum Bauen`), ohneFreigabe.length === 0));

  // Gezeigt: was die Person sehen muss, hat die KI geöffnet
  const zeigen = GEZEIGT.filter((g) => imBereich(g.phase));
  if (zeigen.length) {
    const zFehler = zeigen.filter((g) => !lauf.geoeffnet.some((o) => g.muster.test(o.ziel))).map((g) => `${g.phase}: ${g.was} nie geöffnet`);
    liste.push(pruefung('gezeigt', 'der Person gezeigt (open): Skizze, Musterblatt, Entwurf, Seite lokal', zeigen.length - zFehler.length, zeigen.length, zFehler));
  }

  // Werkzeuge, die der Lauf braucht: Weg (ab P1), Methoden der Phasen (Weg Geschäft), dazu die der Persona
  const noetig = [
    ...(iAb === 0 ? [{ werkzeug: 'weg_waehlen', argumente: { weg: persona.weg } as Record<string, string | boolean> }] : []),
    ...(persona.weg === 'geschaeft' ? phasen.flatMap((p) => (p.methoden?.geschaeft ?? []).map((m) => ({ werkzeug: 'methode', argumente: { name: m } as Record<string, string | boolean> }))) : []),
    ...(persona.werkzeuge ?? []),
  ];
  if (noetig.length) {
    const wFehler = noetig.filter((n) => !lauf.aufrufe.some((a) => a.werkzeug === n.werkzeug && !a.fehler && Object.entries(n.argumente ?? {}).every(([k, v]) => a.argumente[k] === v)))
      .map((n) => `${n.werkzeug}${n.argumente ? ` ${JSON.stringify(n.argumente)}` : ''} fehlt`);
    liste.push(pruefung('werkzeuge', 'nötige Werkzeugaufrufe (Weg, Methoden, Modus, verstanden)', noetig.length - wFehler.length, noetig.length, wFehler));
  }
  if (persona.verboten?.length) {
    const verboten = lauf.aufrufe.filter((a) => persona.verboten!.includes(a.werkzeug));
    liste.push(pruefung('verboten', `nie aufgerufen: ${persona.verboten.join(', ')}`, verboten.length ? 0 : 1, 1, verboten.map((a) => `Runde ${a.runde}: ${a.werkzeug}`)));
  }

  // Nein vor dem Bau: Nach dem Nein der Person (erkannt am Teil vor dem Doppelpunkt) weder gebaut noch die Freigabe eingetragen
  if (persona.nein) {
    const kern = normal(persona.nein.split(':')[0]!);
    const r = Array.from({ length: runden }, (_, i) => i).find((i) => normal(person(i)).includes(kern));
    const z = r === undefined ? undefined : zustand(r);
    const ok = r === undefined ? null : !z?.gebaut && !jaBelegt(f, z?.dateien['docs/entwurf.md'], 'Freigegeben zum Bauen:');
    liste.push(pruefung('nein-respektiert', 'nach dem Nein zum Bauen weder gebaut noch freigegeben', ok ? 1 : 0, 1,
      r === undefined ? ['die Person hat das Nein nie gesagt: der Kern dieser Persona ist nicht geprüft'] : ok ? [] : [`Runde ${r}: nach dem Nein ${z?.gebaut ? 'gebaut' : 'Freigabe zum Bauen eingetragen'}`], ok));
  }

  // verstanden_melden erst nach einer Antwort der Person: In der Runde davor hat die KI gefragt
  const verstanden = lauf.aufrufe.filter((a) => a.werkzeug === 'verstanden_melden');
  if (verstanden.length) {
    const vFehler = verstanden.filter((a) => a.runde < 1 || fragen(ki(a.runde - 1)) === 0).map((a) => `Runde ${a.runde}: verstanden_melden ohne Frage davor`);
    liste.push(pruefung('verstanden-nach-antwort', 'verstanden_melden erst nach einer Antwort der Person', verstanden.length - vFehler.length, verstanden.length, vFehler));
  }

  // Info, zählt nicht: Phase je Runde nach der Insel zu Beginn der Runde, Fragen je Phase, Werkzeuge
  const fragenJePhase: Record<string, number> = {};
  let stand: string | null = null;
  for (let r = 0; r < runden; r++) {
    const id = f.phasen[erledigtNachInsel(f, stand)]?.id ?? 'nach P13';
    fragenJePhase[id] = (fragenJePhase[id] ?? 0) + fragen(ki(r));
    for (const a of melden.filter((x) => x.runde === r)) stand = hoeher(f, stand, a.argumente.schritt as string);
  }
  const werkzeuge: Record<string, number> = {};
  for (const a of lauf.aufrufe) werkzeuge[a.werkzeug] = (werkzeuge[a.werkzeug] ?? 0) + 1;
  const nachInsel = erledigtNachInsel(f, melden.reduce<string | null>((h, a) => hoeher(f, h, a.argumente.schritt as string), null));
  const nachDateien = erledigtNachDateien(f, ende);

  const erreicht = liste.reduce((s, p) => s + p.erreicht, 0);
  const moeglich = liste.reduce((s, p) => s + p.moeglich, 0);
  const exit = liste.some((p) => p.ok === false) ? 1 : liste.some((p) => p.ok === null) ? 2 : 0;
  return {
    stand: PUNKTE_STAND, fall: lauf.fall, ab, bis, erreicht, moeglich, exit, pruefungen: liste,
    info: {
      runden, phase_nach_insel: nachInsel ? f.phasen[nachInsel - 1]!.id : null, phase_nach_dateien: nachDateien ? f.phasen[nachDateien - 1]!.id : null,
      lage_aufrufe: lage.length, fragen_je_phase: fragenJePhase, werkzeuge,
    },
  };
}

export function bericht(p: Punkte): string {
  const zeilen = [`Punkte (deterministisch, Stand ${p.stand}), Fall ${p.fall}, ${p.ab} bis ${p.bis}: ${p.erreicht} von ${p.moeglich}, Exit ${p.exit}`];
  if (!p.pruefungen.length) zeilen.push('  nicht auswertbar: kein Verlauf, unbekannter Fall oder ungültige Phasen');
  for (const x of p.pruefungen) {
    zeilen.push(`  ${x.ok === true ? 'ok    ' : x.ok === false ? 'NEIN  ' : 'OFFEN '} ${x.id} (${x.erreicht}/${x.moeglich}): ${x.titel}`);
    for (const b of x.beleg.slice(0, 8)) zeilen.push(`           ${b}`);
    if (x.beleg.length > 8) zeilen.push(`           … und ${x.beleg.length - 8} weitere`);
  }
  zeilen.push(`  Info: ${p.info.runden} Runden, Phase nach Insel ${p.info.phase_nach_insel ?? 'keine'}, nach Dateien ${p.info.phase_nach_dateien ?? 'keine'}, lage ${p.info.lage_aufrufe}-mal`);
  return zeilen.join('\n');
}

if (import.meta.main) {
  const { ladeFahrplan } = await import('./fahrplan.ts');
  const { PERSONEN } = await import('./durchspiel/personen.ts');
  const args = process.argv.slice(2);
  const opt = (n: string) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
  const ordner = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
  if (!ordner || !existsSync(join(ordner, 'lauf.json'))) {
    console.error('Aufruf: bun scripts/punkte.ts <ergebnis-ordner mit lauf.json> [--bis P4]');
    process.exit(2);
  }
  const wurzel = existsSync(join(ordner, 'fahrplan.yaml')) ? `${ordner.replace(/\/$/, '')}/` : new URL('..', import.meta.url).pathname;
  const geladen = await ladeFahrplan(wurzel);
  if (!geladen.ok) {
    console.error(geladen.fehler.join('\n'));
    process.exit(2);
  }
  const lauf = JSON.parse(readFileSync(join(ordner, 'lauf.json'), 'utf8')) as Lauf;
  const p = punkte(lauf, geladen.fahrplan, PERSONEN[lauf.fall], { ab: opt('ab'), bis: opt('bis') });
  writeFileSync(join(ordner, 'punkte.json'), `${JSON.stringify(p, null, 1)}\n`);
  console.log(bericht(p));
  process.exit(p.exit);
}
