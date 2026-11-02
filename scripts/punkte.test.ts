// Punkte des Durchspiels (scripts/punkte.ts) an aufgezeichneten Beispiel-Verläufen (scripts/durchspiel/beispiele/, je mit erwartetem
// Exit-Code) und an kleinen Läufen, die je eine Regel brechen. Die Beispiele sind von Hand im Format von lauf.json geschrieben, nicht von
// einem Modell aufgezeichnet.
import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PERSONEN, rolle } from './durchspiel/personen.ts';
import { ladeFahrplan, type Fahrplan } from './fahrplan.ts';
import {
  ausgangGeschafft, beantwortet, belegt, bisAbschluss, datiert, entscheidVon, erledigtNachDateien, frageBelegt, fragen, freigabeZumBauen, freieMethoden, jaBelegt, markeVon,
  punkte, wert, wertPasst, wohnortVon, type Lauf,
} from './punkte.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const geladen = await ladeFahrplan(wurzel);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const F: Fahrplan = geladen.fahrplan;
const BEISPIELE = join(wurzel, 'scripts/durchspiel/beispiele');
type Beispiel = Lauf & { erwartet: { exit: number; nein?: string[] } };
const beispiel = (n: string) => JSON.parse(readFileSync(join(BEISPIELE, n), 'utf8')) as Beispiel;
const ergebnis = (l: Lauf, bis?: string) => punkte(l, F, PERSONEN[l.fall], { bis });
const pr = (l: Lauf, id: string, bis?: string) => ergebnis(l, bis).pruefungen.find((x) => x.id === id);

describe('aufgezeichnete Beispiel-Verläufe', () => {
  const dateien = readdirSync(BEISPIELE).filter((f) => f.endsWith('.json'));
  // Seit 01.11.2026 (Welle 8, w8-44) gibt es mehrere Läufe je Exit (dazu bauen-lassen, bauen-lassen-nein, bauen-lassen-schlecht); jeder Exit
  // muss weiter mindestens einmal vorkommen
  test('es gibt mindestens einen guten, einen schlechten und einen nicht auswertbaren Lauf', () => {
    expect([...new Set(dateien.map((d) => beispiel(d).erwartet.exit))].sort()).toEqual([0, 1, 2]);
  });
  for (const d of dateien) {
    test(`${d}: Exit wie erwartet, und genau die erwarteten Prüfungen fallen durch`, () => {
      const b = beispiel(d);
      const p = ergebnis(b);
      expect(p.exit).toBe(b.erwartet.exit as 0 | 1 | 2);
      expect(p.pruefungen.filter((x) => x.ok === false).map((x) => x.id).sort()).toEqual([...(b.erwartet.nein ?? [])].sort());
      expect(p.erreicht).toBeLessThanOrEqual(p.moeglich);
    });
  }
});

describe('Zeilen und Fragen', () => {
  test('wert liest die erste Zeile wie lage, Listenzeichen zählen nicht, Fett schon', () => {
    const t = 'Titel\n- Projektname: Blende 8\nProjektname: zweite\n**Ton:** du';
    expect(wert(t, 'Projektname:')).toBe('Blende 8');
    expect(wert(t, 'Ton:')).toBeNull();
    expect(wert(true, 'Ton:')).toBeNull();
  });
  test('belegt und beantwortet: offen, Platzhalter und Annahme in vier Sprachen', () => {
    for (const w of ['[offen: fragen]', '[ouvert : demander]', '[aperto: chiedere]', '[open: ask]', '[Platzhalter: Text]', '[placeholder: text]', '', null]) expect(belegt(F, w)).toBe(false);
    for (const w of ['[Annahme: zehn Anfragen]', '[Hypothèse : dix]', '[Ipotesi: dieci]', '[Assumption: ten]']) expect([belegt(F, w), beantwortet(F, w)]).toEqual([true, false]);
    expect(beantwortet(F, 'Blende 8 [Annahme: Schreibweise]')).toBe(true);
  });
  // Gegenprüfung 31.10.2026 (vert-09): die Marken aus dem Vertrag, Fettdruck zählt nicht. Dieselbe Tabelle steht in albatros
  // packages/kit/src/phasen.test.ts (MARKEN_FAELLE, markeVon und belegtWert); lage soll so lesen. Vorher war «**[offen]**» belegt.
  test('Marken wie im Vertrag (Tabelle wie in kit): offen und Platzhalter nicht belegt, auch fett; Annahme belegt; ein Wort mehr ist keine Marke', () => {
    const FAELLE: [string | null, 'offen' | 'platzhalter' | 'annahme' | null, boolean][] = [
      ['[offen: kommt]', 'offen', false], ['[ouvert : à voir]', 'offen', false], ['[aperto: da vedere]', 'offen', false], ['[open: tbd]', 'offen', false],
      ['**[offen]**', 'offen', false], ['[Platzhalter: kommt]', 'platzhalter', false], ['[à compléter]', 'platzhalter', false],
      ['[da completare]', 'platzhalter', false], ['[placeholder]', 'platzhalter', false], ['[Annahme: zwei Anfragen]', 'annahme', true],
      ['[Hypothèse : dix]', 'annahme', true], ['[Ipotesi: dieci]', 'annahme', true], ['[Assumption: ten]', 'annahme', true],
      ['zwei Anfragen', null, true], ['[Annahmen]', null, true], ['[openly]', null, true], ['', null, false], [null, null, false],
    ];
    for (const [w, marke, b] of FAELLE) expect([w, markeVon(F, w), belegt(F, w)]).toEqual([w, marke, b]);
    expect(F.marken).toEqual({
      offen: ['offen', 'ouvert', 'aperto', 'open'], platzhalter: ['Platzhalter', 'à compléter', 'a compléter', 'a completer', 'da completare', 'placeholder'],
      annahme: ['Annahme', 'hypothèse', 'hypothese', 'ipotesi', 'assumption'],
    });
  });
  test('werte und Wohnort wie im Vertrag (vert-06, vert-05)', () => {
    const frage = (id: string) => F.phasen.flatMap((p) => p.pflichtfragen).find((q) => q.id === id)!;
    expect(['später', 'Jetzt, mit sonnenhof.ch', 'nie'].map((w) => wertPasst(F, frage('adresse'), w))).toEqual([true, true, true]);
    expect(['https://speiche.aufwind.sh', 'niemals', null].map((w) => wertPasst(F, frage('adresse'), w))).toEqual([false, false, false]);
    expect([wertPasst(F, frage('modus'), '[Annahme: machen]'), wertPasst(F, frage('richtung'), 'weich')]).toEqual([true, true]);
    expect(['Albatros Light', 'Albatros Pilot', 'selbst: Netlify', 'par toi-même : Netlify'].map((w) => wohnortVon(F, w, 'gratis'))).toEqual(['light', 'pilot', 'selbst', 'selbst']);
    expect([wohnortVon(F, null, 'light'), wohnortVon(F, '[offen]', 'pilot'), wohnortVon(F, null, 'gratis')]).toEqual(['light', 'pilot', 'selbst']);
    const p13 = F.phasen.find((p) => p.id === 'P13')!;
    expect((['light', 'pilot', 'selbst'] as const).map((w) => bisAbschluss(F, p13, w))).toEqual([['hafen', 'live'], ['hafen', 'fliessband', 'live'], ['live']]);
  });
  test('Freigabe zum Bauen wie pruefen.mjs --vor-bau: letzte Zeile, Fett weg, Datum vorne', () => {
    expect(datiert(freigabeZumBauen('Freigegeben zum Bauen: 31.10.2026, «Ja, bau ihn so.»'))).toBe(true);
    expect(datiert(freigabeZumBauen('**Freigegeben zum Bauen:** 2026-10-31'))).toBe(true);
    expect(datiert(freigabeZumBauen('Freigegeben zum Bauen: 31.10.2026\nFreigegeben zum Bauen: [offen: Nachtrag]'))).toBe(false);
    expect(datiert(freigabeZumBauen('Früher freigegeben zum Bauen: 30.10.2026'))).toBe(false);
    expect(datiert(freigabeZumBauen('Freigegeben zum Bauen: <Datum>'))).toBe(false);
  });
  // Gegenprüfung 31.10.2026 (vert-04, steu-05): Ja-Momente wie albatros kit jaBelegt. Dieselbe Tabelle steht in albatros
  // services/mcp/src/lage.test.ts (JA_FAELLE). Vorher las punkte die erste Zeile und nahm ein Datum mit Annahme dahinter.
  test('Ja-Momente wie lage (Tabelle JA_FAELLE): Datum vorne, nie eine Annahme, die letzte Zeile zählt', () => {
    const JA_FAELLE: [string[], boolean][] = [
      [['Freigegeben: 31.10.2026, «Ja, so live»'], true], [['Freigegeben: 2026-10-31 «Ja»'], true], [['Freigegeben: 31. Oktober 2026, «Ja»'], true],
      [['- **Freigegeben:** 31.10.2026, «Ja»'], true], [['> Freigegeben: 31.10.2026'], true], [['Freigegeben: **31.10.2026**, «Ja»'], true],
      [['Freigegeben: [offen]', 'Freigegeben: 31.10.2026, «Ja»'], true], [['Freigegeben: noch nicht'], false], [['Freigegeben: [Annahme: passt]'], false],
      [['Freigegeben: 31.10.2026 [Annahme: hat nicht widersprochen]'], false], [['Freigegeben: [hypothèse : oui]'], false],
      [['Freigegeben: <TT.MM.JJJJ>, ‹<ihre Worte>›'], false], [['Freigegeben: 31.10., «Ja»'], false], [['Freigegeben: ja, am 31.10.2026'], false],
      [['Freigegeben: 30.10.2026, «Ja»', 'Freigegeben: [offen: neue Rückmeldung]'], false], [['Freigegeben:'], false], [[], false],
      [['Freigegeben zum Bauen: 31.10.2026'], false],
    ];
    for (const [zeilen, ja] of JA_FAELLE) expect([zeilen, jaBelegt(F, zeilen.join('\n'), 'Freigegeben:')]).toEqual([zeilen, ja]);
    expect(jaBelegt(F, true, 'Freigegeben:')).toBe(false);
  });
  test('fragen zählt Fragezeichen am Satzende, nicht in Code oder Adressen', () => {
    expect(fragen('Wie heisst es? Für wen? Was sollen Besucher tun?')).toBe(3);
    expect(fragen('Sag «Wie heisst es?» und dann (warum?) weiter.')).toBe(2);
    expect(fragen('Öffne https://example.test/?a=1 und `grep -E "a?b"`.\n```\nwas?\n```\nFertig.')).toBe(0);
    expect(fragen('Wirklich??')).toBe(1);
  });
});

// Kleine Läufe: Runde r ist Person, KI; Zustände je Runde
const lauf = (fall: string, ki: string[], extra: Partial<Lauf> = {}): Lauf => ({
  fall, nachrichten: ki.flatMap((k, i) => [{ wer: 'Person' as const, text: extra.nachrichten?.[2 * i]?.text ?? `Antwort ${i}` }, { wer: 'KI' as const, text: k }]),
  aufrufe: [], geoeffnet: [], zustaende: ki.map((_, i) => ({ runde: i, dateien: {}, gebaut: false })), ...extra,
});
const ENTWURF_FREI = { 'docs/entwurf.md': 'Werkstatt: ok\nSeiten: 4\nRückmeldungen: keine\nFreigegeben zum Bauen: 31.10.2026, «Ja, bau ihn so.»\n' };

describe('Regeln', () => {
  test('kein Bauen ohne Freigabe zum Bauen', () => {
    const ohne = lauf('knapp', ['a', 'b'], { zustaende: [{ runde: 0, dateien: {}, gebaut: false }, { runde: 1, dateien: { 'docs/entwurf.md': 'Seiten: 4\n' }, gebaut: true }] });
    expect(pr(ohne, 'bauen-nach-freigabe')).toMatchObject({ ok: false, beleg: ['Runde 1: gebaut ohne Freigabe zum Bauen'] });
    const mit = lauf('knapp', ['a', 'b'], { zustaende: [{ runde: 0, dateien: {}, gebaut: false }, { runde: 1, dateien: ENTWURF_FREI, gebaut: true }] });
    expect(pr(mit, 'bauen-nach-freigabe')?.ok).toBe(true);
  });
  test('nach dem Nein der Person: weder gebaut noch freigegeben, sonst durchgefallen; ohne Nein nicht geprüft', () => {
    const nein = PERSONEN['nein-vor-bau']!.nein!;
    const nachrichten = [{ wer: 'Person' as const, text: 'Hallo' }, { wer: 'KI' as const, text: 'x' }, { wer: 'Person' as const, text: `${nein}` }, { wer: 'KI' as const, text: 'y' }];
    const respektiert = lauf('nein-vor-bau', ['Darf ich so bauen?', 'Gut, ich ändere die Startseite.'], { nachrichten });
    expect(pr(respektiert, 'nein-respektiert')?.ok).toBe(true);
    const gebaut = lauf('nein-vor-bau', ['Darf ich so bauen?', 'Ich baue trotzdem.'], { nachrichten, zustaende: [{ runde: 0, dateien: {}, gebaut: false }, { runde: 1, dateien: ENTWURF_FREI, gebaut: true }] });
    expect(pr(gebaut, 'nein-respektiert')).toMatchObject({ ok: false, beleg: ['Runde 1: nach dem Nein gebaut'] });
    const freigabe = lauf('nein-vor-bau', ['Darf ich so bauen?', 'Ich trage die Freigabe ein.'], { nachrichten, zustaende: [{ runde: 0, dateien: {}, gebaut: false }, { runde: 1, dateien: ENTWURF_FREI, gebaut: false }] });
    expect(pr(freigabe, 'nein-respektiert')?.ok).toBe(false);
    const leicht = lauf('nein-vor-bau', ['Darf ich so bauen?', 'Gut.'], { nachrichten: [nachrichten[0]!, nachrichten[1]!, { wer: 'Person', text: 'Hmm. Nein, so noch nicht! Die Öffnungszeiten nach oben.' }, nachrichten[3]!] });
    expect(pr(leicht, 'nein-respektiert')?.ok).toBe(true);
    expect(pr(lauf('nein-vor-bau', ['a']), 'nein-respektiert')?.ok).toBeNull();
  });
  test('upgrade_link: vor P11 nur mit bestaetigt, ab P11 (freigabe gemeldet) auch ohne', () => {
    const vor = (argumente: Record<string, unknown>) => lauf('knapp', ['a'], { aufrufe: [{ runde: 0, werkzeug: 'upgrade_link', argumente }] });
    expect(pr(vor({ stufe: 'light' }), 'upgrade-link')?.ok).toBe(false);
    expect(pr(vor({ stufe: 'light', bestaetigt: true }), 'upgrade-link')?.ok).toBe(true);
    const nach = lauf('knapp', ['a'], { aufrufe: [{ runde: 0, werkzeug: 'schritt_melden', argumente: { schritt: 'freigabe' } }, { runde: 0, werkzeug: 'upgrade_link', argumente: { stufe: 'light' } }] });
    expect(pr(nach, 'upgrade-link')?.ok).toBe(true);
    const abgelehnt = lauf('knapp', ['a'], { aufrufe: [{ runde: 0, werkzeug: 'schritt_melden', argumente: { schritt: 'freigabe' }, fehler: true }, { runde: 0, werkzeug: 'upgrade_link', argumente: { stufe: 'light' } }] });
    expect(pr(abgelehnt, 'upgrade-link')?.ok).toBe(false);
  });
  test('Insel belegt: Plan geprüft erst mit «Bestätigt: <Datum>»', () => {
    const datei = { 'docs/plan-pruefung.md': 'Geprüft am: 31.10.2026\nZweite Meinung: 8 ok\n', 'docs/plan.md': 'Bestätigt: [offen: Ja der Person]\n' };
    const l = lauf('knapp', ['a'], { aufrufe: [{ runde: 0, werkzeug: 'schritt_melden', argumente: { schritt: 'plan-geprueft' } }], zustaende: [{ runde: 0, dateien: datei, gebaut: false }] });
    expect(pr(l, 'insel-belegt', 'P4')).toMatchObject({ ok: false, beleg: ['plan-geprueft in Runde 0 ohne «Bestätigt: <Datum>» in docs/plan.md'] });
    const ja = { ...l, zustaende: [{ runde: 0, dateien: { ...datei, 'docs/plan.md': 'Bestätigt: 31.10.2026, «Ja, so ist der Plan gut.»\n' }, gebaut: false }] };
    expect(pr(ja, 'insel-belegt', 'P4')?.ok).toBe(true);
  });
  test('lage ohne skills_stand und, sobald es docs/projekt.md gibt, ohne belege fällt durch', () => {
    const l = lauf('knapp', ['a', 'b'], {
      aufrufe: [{ runde: 0, werkzeug: 'lage', argumente: {} }, { runde: 1, werkzeug: 'lage', argumente: { skills_stand: '0.2.0' } }],
      zustaende: [{ runde: 0, dateien: { 'docs/projekt.md': 'Projektname: Speiche\n' }, gebaut: false }, { runde: 1, dateien: { 'docs/projekt.md': 'Projektname: Speiche\n' }, gebaut: false }],
    });
    expect(pr(l, 'lage-belege')).toMatchObject({ ok: false, erreicht: 0, moeglich: 2, beleg: ['Runde 0: ohne skills_stand', 'Runde 1: ohne belege für docs/projekt.md'] });
  });
  test('verstanden_melden ohne Frage in der Runde davor fällt durch', () => {
    const l = lauf('lernen', ['Hier ist der Plan.', 'Notiert.'], { aufrufe: [{ runde: 1, werkzeug: 'verstanden_melden', argumente: { mission: 'flugschule-11-idee', art: 'kontrollfrage' } }] });
    expect(pr(l, 'verstanden-nach-antwort')?.ok).toBe(false);
  });
  test('Weg Geschäft: die Methoden der Phasen bis --bis gehören zu den nötigen Werkzeugen', () => {
    const l = lauf('geschaeft', ['a'], { aufrufe: [{ runde: 0, werkzeug: 'weg_waehlen', argumente: { weg: 'geschaeft' } }, { runde: 0, werkzeug: 'methode', argumente: { name: 'ideen-check' } }] });
    expect(pr(l, 'werkzeuge', 'P1')?.ok).toBe(true);
    expect(pr(l, 'werkzeuge', 'P2')?.beleg).toEqual(['methode {"name":"zielgruppe"} fehlt', 'methode {"name":"angebot-und-preis"} fehlt']);
  });
  test('ohne Verlauf, mit unbekanntem Fall oder unbekannter Phase: nicht auswertbar (Exit 2)', () => {
    expect(ergebnis({ fall: 'knapp', nachrichten: [], aufrufe: [], geoeffnet: [], zustaende: [] }).exit).toBe(2);
    expect(punkte(lauf('knapp', ['a']), F, undefined).exit).toBe(2);
    expect(ergebnis(lauf('knapp', ['a']), 'P99').exit).toBe(2);
  });
});

// Gegenprüfung 31.10.2026: Ein Lauf genau nach lancieren (vert-05, Light ohne Fliessband) und mit «Eigene Domain:» (vert-06) besteht;
// vorher endeten knapp, musikverein und curling mit «nicht gemeldet: fliessband» und «adresse: … passt nicht zu /später/»
describe('P13 je Wohnort und Eigene Domain', () => {
  const LIVE = 'Live seit: 31.10.2026\nAdresse: https://speiche-testdorf.aufwind.sh\nEigene Domain: später, wenn die Saison läuft\nGeprüft: 31.10.2026, pruefen.mjs --live ohne Rot\nAngekündigt: 31.10.2026, Stammkunden';
  const p13 = (fall: string, schritte: string[], dateien: Record<string, string>): Lauf => ({
    fall, ab: 'P13', bis: 'P13',
    nachrichten: [{ wer: 'Person', text: 'Eine eigene Adresse später, nicht jetzt.' }, { wer: 'KI', text: 'Gut, später. Die Seite ist live.' }],
    aufrufe: [{ runde: 0, werkzeug: 'lage', argumente: { skills_stand: '1.0.0', belege: [] } }, ...schritte.map((schritt) => ({ runde: 0, werkzeug: 'schritt_melden', argumente: { schritt } }))],
    geoeffnet: [], zustaende: [{ runde: 0, dateien, gebaut: true }],
  });
  const LIGHT = { 'docs/lancieren.md': 'Wohnort: Albatros Light\nGrund: ohne Baustein\nAdresse: https://speiche-testdorf.aufwind.sh', 'docs/live.md': LIVE };
  test('Light: hafen und live genügen (kein Fliessband), für knapp, musikverein und curling', () => {
    for (const fall of ['knapp', 'musikverein', 'curling']) {
      const l = p13(fall, ['hafen', 'live'], LIGHT);
      expect([fall, pr(l, 'insel')?.ok, pr(l, 'insel')?.titel]).toEqual([fall, true, 'Insel-Schritte P13 bis P13 gemeldet (Wohnort light)']);
    }
  });
  test('Pilot braucht das Fliessband, selbst nur live; ohne Zeile «Wohnort:» gilt das Abo der Persona', () => {
    const pilot = { ...LIGHT, 'docs/lancieren.md': 'Wohnort: Albatros Pilot\nGrund: Buchungen\nAdresse: https://yoga.aufwind.sh' };
    expect(pr(p13('buchung', ['hafen', 'live'], pilot), 'insel')).toMatchObject({ ok: false, beleg: ['nicht gemeldet: fliessband'] });
    expect(pr(p13('buchung', ['hafen', 'fliessband', 'live'], pilot), 'insel')?.ok).toBe(true);
    const selbst = { ...LIGHT, 'docs/lancieren.md': 'Wohnort: selbst: Netlify, Hochladen vom Computer\nGrund: eigener Webspace\nAdresse: https://mittag.netlify.app' };
    expect(pr(p13('knapp', ['live'], selbst), 'insel')?.ok).toBe(true);
    expect(pr(p13('knapp', ['hafen', 'live'], { 'docs/live.md': LIVE }), 'insel')?.ok).toBe(true);
  });
  test('Eigene Domain: die Antwort der Person (später) steht in ihrer Zeile, die URL in «Adresse:» zählt nicht als Antwort', () => {
    const gut = p13('knapp', ['hafen', 'live'], LIGHT);
    expect([pr(gut, 'pflichtfragen')?.ok, pr(gut, 'tatsachen')?.ok]).toEqual([true, true]);
    const nurUrl = p13('knapp', ['hafen', 'live'], { ...LIGHT, 'docs/live.md': LIVE.replace(/\nEigene Domain: [^\n]*/, '') });
    expect(pr(nurUrl, 'pflichtfragen')?.beleg).toEqual(['P13 adresse (person): Zeile «Eigene Domain:» fehlt']);
    expect(pr(nurUrl, 'tatsachen')?.beleg).toEqual(['adresse: Zeile «Eigene Domain:» in docs/live.md fehlt']);
    const keinWert = p13('knapp', ['hafen', 'live'], { ...LIGHT, 'docs/live.md': LIVE.replace('Eigene Domain: später, wenn die Saison läuft', 'Eigene Domain: vielleicht') });
    expect(pr(keinWert, 'pflichtfragen')?.beleg).toEqual(['P13 adresse (person): «vielleicht» beginnt nicht mit jetzt, später, nie']);
  });
});

describe('Personas', () => {
  const fragen = new Set(F.phasen.flatMap((p) => p.pflichtfragen.map((q) => q.id)));
  for (const p of Object.values(PERSONEN)) {
    test(`${p.id}: Tatsachen gehören zu Pflichtfragen oder haben Ablage und Phase, Muster gültig, Rolle vollständig`, () => {
      expect(F.phasen.some((x) => x.id === p.bis)).toBe(true);
      for (const w of p.wissen.filter((x) => x.muster)) {
        expect(w.frage ? fragen.has(w.frage) : Boolean(w.ablage?.includes('#') && w.phase)).toBe(true);
        expect(() => new RegExp(w.muster!, 'i')).not.toThrow();
      }
      const r = rolle(p, 'https://www.example.test/');
      for (const w of p.wissen) expect(r).toContain(w.sagt.replaceAll('{adresse}', 'https://www.example.test/'));
      expect(r.trimEnd().endsWith('antworte genau: ENDE')).toBe(true);
      if (p.nein) expect(p.nein.includes(':') && (p.regeln ?? []).some((x) => x.includes(p.nein!))).toBe(true);
    });
  }
  test('mit --echt nur Personen mit erfundenen Inhalten, darunter musikverein (Workflow Durchspiel in albatros)', () => {
    expect(Object.values(PERSONEN).filter((p) => p.echt).map((p) => p.id)).toEqual(['musikverein']);
  });
});

// Gegenprüfung 31.10.2026 (vert-02, weg-02, weg-03): Phasen nach den Dateien wie lage, lückenlos und mit jeder Ergebnisdatei; die Attrappe
// des Durchspiels rechnet damit. Dieselben Fälle wie in albatros services/mcp/src/lage.test.ts.
describe('Phasen nach Dateien wie lage', () => {
  const PROJEKT = 'Projektname: Sonne\nIn einem Satz: Ferien\nFür wen: Familien\nHauptsache: Anfrage\nErfolg: [Annahme] zwei Anfragen\nBestehende Seite: keine\nModus: machen\nStand: P1\nNächster Schritt: P2';
  const P1: Record<string, string | true> = { 'docs/projekt.md': PROJEKT, 'AGENTS.md': true, 'design/skizze.html': true };
  const RECHERCHE = 'Vorbilder: a\nÜbliche Seiten und Funktionen: b\nÜbernehmen: c\nVermeiden: d\nPflichten: e\nInhalte vorhanden: f\nSuchbegriffe: g';
  const PLAN = 'Projektname: Sonne\nSeiten: 5\nFunktionen: Anfrage\nZugang: alle\nSprachen: de\nSetup: statisch\nTesting: x\nRelease: Mai\nPflege: ich\nStand: P3';
  const BIS_P8: Record<string, string | true> = {
    ...P1, 'docs/recherche.md': RECHERCHE, 'docs/plan.md': `${PLAN}\nBestätigt: 31.10.2026, «Ja»`, 'docs/plan-pruefung.md': 'Geprüft am: 31.10.2026\nZweite Meinung: ok',
    'docs/konzept.md': 'Name: Sonne\nKern: k\nTon: du\nCharakter: ruhig\nMaskottchen: nein\nMuss bleiben: nichts\nBildsprache: Fotos',
    'docs/designsystem.md': 'Reihenfolge: bestätigt am 31.10.2026\nRichtung: klar\nFarben: Blau\nSchriften: Inter\nAbstände: 4\nKomponenten: Knopf\nMaskottchen: nein\nMusterblatt: gesehen am 31.10.2026, passt',
    'design/mockup.html': true, 'design/tokens.css': true, 'design/musterblatt.html': true, 'design/entwurf/index.html': true,
    'docs/entwurf.md': 'Werkstatt: Node\nSeiten: Start\nRückmeldungen: gut\nFreigegeben zum Bauen: 31.10.2026, «Ja»',
  };
  test('vert-02: jede Ergebnisdatei muss da sein (PRD da, messwerte.json fehlt: P9 bleibt; musterblatt.html fehlt: P6 bleibt)', () => {
    expect([erledigtNachDateien(F, P1), erledigtNachDateien(F, { 'docs/projekt.md': PROJEKT })]).toEqual([1, 0]);
    expect(erledigtNachDateien(F, BIS_P8)).toBe(8);
    const prd = { ...BIS_P8, 'docs/stack.md': true, 'docs/prd.md': 'Abgeleitet aus: docs/entwurf.md' } as Record<string, string | true>;
    expect(erledigtNachDateien(F, prd)).toBe(8);
    expect(erledigtNachDateien(F, { ...prd, 'docs/tueren.txt': true, 'docs/pruefung/messwerte.json': true })).toBe(9);
    const ohneMusterblatt = Object.fromEntries(Object.entries(BIS_P8).filter(([d]) => d !== 'design/musterblatt.html'));
    expect(erledigtNachDateien(F, ohneMusterblatt)).toBe(5);
  });
  test('weg-02: lückenlos ab der Insel; spätere Dateien überspringen weder eine fehlende Phase noch einen Ja-Moment', () => {
    expect(erledigtNachDateien(F, { ...P1, 'docs/plan.md': PLAN })).toBe(1); // P3 ohne P2
    expect(erledigtNachDateien(F, { 'docs/plan.md': PLAN }, 2)).toBe(3);
    expect(erledigtNachDateien(F, {}, 5)).toBe(5); // die Insel ist der Boden
    const ohneJa = { ...BIS_P8, 'docs/plan.md': `${PLAN}\nBestätigt: [Annahme: passt so]` };
    expect(erledigtNachDateien(F, ohneJa)).toBe(3);
  });
  test('weg-03: ein Plan ganz als [Annahme] bleibt in P3, offen sind die Fragen der Person', () => {
    const annahmen = PLAN.split('\n').map((z, i) => (i > 0 && i < 9 ? z.replace(': ', ': [Annahme: ') + ']' : z)).join('\n');
    const d = { ...P1, 'docs/recherche.md': RECHERCHE, 'docs/plan.md': annahmen };
    expect(erledigtNachDateien(F, d)).toBe(2);
    const p3 = F.phasen[2]!;
    expect(p3.pflichtfragen.filter((q) => !frageBelegt(F, p3, q, d)).map((q) => q.id)).toEqual(['funktionen', 'zugang', 'sprachen', 'release', 'pflege']);
  });
  // Gegenprobe Welle 5 (31.10.2026, weg-05): Auf dem Weg Geschäft ist P1 erst mit «Entscheid: weiter» oder «stoppen» geschafft, wie lage.
  // ENTSCHEID_FAELLE ist dieselbe Tabelle wie in albatros packages/kit/src/phasen.test.ts (entscheidVon, ausgangGeschafft).
  const ENTSCHEID_FAELLE: [string[], string | null, boolean][] = [
    [['Entscheid: weiter (31.10.2026), weil drei Vorbestellungen'], 'weiter', true],
    [['# Ideen-Check: Mittagstisch', 'Stand: 31.10.2026', '- Entscheid: stoppen (31.10.2026), weil niemand das Problem kennt'], 'stoppen', true],
    [['**Entscheid:** weiter'], 'weiter', true], [['> Entscheid: anpassen (1.11.2026), weil andere Kundschaft'], 'anpassen', false],
    [['Entscheid: Weiter'], 'weiter', true], [['Entscheid: weiterhin unklar'], null, false], [['Entscheid:weiter'], 'weiter', true],
    [['Entscheid: Hausaufgabe offen bis 1.12.2099: fünf Gespräche führen'], 'hausaufgabe bis 1.12.2099', false],
    [['Entscheid: Hausaufgabe offen bis 31.1.2020'], 'hausaufgabe bis 31.1.2020', false],
    [['Entscheid: [offen]'], null, false], [['Entscheid: [Annahme: weiter]'], null, false], [['Entscheid:'], null, false], [[], null, false],
    [['Entscheid: [offen]', 'Entscheid: weiter (31.10.2026)'], 'weiter', true],
    [['Entscheid: Hausaufgabe offen bis 1.12.2099: Gespräche', '## Verlauf', 'Entscheid: weiter'], 'hausaufgabe bis 1.12.2099', false],
    [['## Verlauf', '- 12.10.2026: Hausaufgabe offen bis 14.11.2026: fünf Gespräche'], null, false],
    [['Mein Entscheid: weiter'], null, false],
  ];
  test('weg-05: Entscheid wie kit (Tabelle ENTSCHEID_FAELLE), P1 auf dem Weg Geschäft erst mit weiter oder stoppen', () => {
    const p1 = F.phasen[0]!;
    const kurz = (t: string) => {
      const e = entscheidVon(p1, t);
      return e === null ? null : e.art === 'ausgang' ? e.ausgang : `hausaufgabe bis ${e.bis}`;
    };
    for (const [zeilen, entscheid, geschafft] of ENTSCHEID_FAELLE) expect([zeilen, kurz(zeilen.join('\n')), ausgangGeschafft(p1, zeilen.join('\n'))]).toEqual([zeilen, entscheid, geschafft]);
    expect([entscheidVon(p1, true), ausgangGeschafft(F.phasen[1]!, undefined)]).toEqual([null, true]);
    expect(p1.ausgaenge).toEqual({ geschaeft: ['weiter', 'anpassen', 'stoppen'], geschafft: ['weiter', 'stoppen'], ablage: 'docs/ideen-check.md#Entscheid:' });
    // Phasen nach Dateien: Weg Webseite wie bisher, Weg Geschäft (Gratis und Light) erst mit weiter oder stoppen
    const ic = (z: string) => ({ ...P1, 'docs/ideen-check.md': `# Ideen-Check: Sonne\nStand: 31.10.2026\n${z}` });
    const geschaeft = { weg: 'geschaeft', stufe: 'gratis' };
    expect([erledigtNachDateien(F, P1), erledigtNachDateien(F, P1, 0, { weg: 'webseite', stufe: 'gratis' }), erledigtNachDateien(F, P1, 0, geschaeft)]).toEqual([1, 1, 0]);
    expect(['Entscheid: Hausaufgabe offen bis 1.12.2099: fünf Gespräche', 'Entscheid: anpassen (31.10.2026)', 'Entscheid: weiter (31.10.2026), weil', '- Entscheid: stoppen (31.10.2026)']
      .map((z) => erledigtNachDateien(F, ic(z), 0, geschaeft))).toEqual([0, 0, 1, 1]);
    expect(erledigtNachDateien(F, P1, 0, { weg: 'geschaeft', stufe: 'light' })).toBe(0);
    expect(freieMethoden(F, 'gratis')).toEqual(['ideen-check', 'zielgruppe', 'angebot-und-preis', 'landingpage', 'marke']);
  });
  test('weg-05: idee auf dem Weg Geschäft erst mit dem Entscheid melden (insel-belegt), wie webseite-planen und ideen-check', () => {
    const IDEE = { ...P1, 'docs/ideen-check.md': '# Ideen-Check: Znünibox\nEntscheid: Hausaufgabe offen bis 1.12.2099: fünf Gespräche' };
    const l = (dateien: Record<string, string | true>) => lauf('geschaeft', ['Die Idee steht.'], {
      aufrufe: [{ runde: 0, werkzeug: 'schritt_melden', argumente: { schritt: 'idee', titel: 'Znünibox' } }], zustaende: [{ runde: 0, dateien, gebaut: false }],
    });
    expect(pr(l(P1), 'insel-belegt', 'P1')).toMatchObject({ ok: false, beleg: ['idee in Runde 0 ohne «Entscheid: weiter» oder «Entscheid: stoppen» in docs/ideen-check.md'] });
    expect(pr(l(IDEE), 'insel-belegt', 'P1')?.ok).toBe(false);
    expect(pr(l({ ...P1, 'docs/ideen-check.md': 'Entscheid: weiter (31.10.2026), weil zwei Anzahlungen' }), 'insel-belegt', 'P1')?.ok).toBe(true);
    // Weg Webseite: die Idee allein genügt
    expect(pr({ ...l(P1), fall: 'knapp' }, 'insel-belegt', 'P1')?.ok).toBe(true);
  });
});

// Bauservice (Welle 8, w8-44, 01.11.2026; Konzept «Albatros baut es für dich», Abschnitt 8): die Regeln an Abwandlungen des Beispiels
// bauen-lassen.json. Die Beispiele selbst prüft der Block oben (Exit 0, 0 und 1 mit den erwarteten NEIN).
describe('Bauservice: Angebot, Betrag, Wahl, Übergabe', () => {
  const gut = beispiel('bauen-lassen.json');
  const mit = (f: (l: Beispiel) => void) => { const l = structuredClone(gut); f(l); return l; };
  test('das Beispiel hält alle Regeln', () => {
    for (const id of ['angebot', 'betrag', 'betrag-vor-plan', 'angebot-betrag', 'bauen-lassen', 'auftrag-bestaetigt', 'auftrag-nach-ja', 'nach-uebergabe', 'vorschau', 'impressum-nur-cockpit']) expect([id, pr(gut, id)?.ok]).toEqual([id, true]);
  });
  test('Angebot zweimal oder vor dem Ja zum Plan: rot', () => {
    const zweimal = mit((l) => { l.aufrufe.filter((a) => a.werkzeug === 'lage' && a.runde === 5)[0]!.angebot = true; });
    expect(pr(zweimal, 'angebot')?.ok).toBe(false);
    const frueh = mit((l) => {
      for (const a of l.aufrufe) delete a.angebot;
      l.aufrufe.find((a) => a.werkzeug === 'lage' && a.runde === 3)!.angebot = true;
    });
    expect(pr(frueh, 'angebot')?.beleg).toEqual(['Runde 3: Angebot vor dem Ja zum Plan («Bestätigt: <Datum>» in docs/plan.md)']);
  });
  test('ohne Angebot ist der Kern nicht geprüft (Exit 2); ohne Übergabe ebenso', () => {
    const ohne = mit((l) => { for (const a of l.aufrufe) delete a.angebot; });
    expect([pr(ohne, 'angebot')?.ok, ergebnis(ohne).exit]).toEqual([null, 2]);
    const nie = mit((l) => { l.aufrufe = l.aufrufe.filter((a) => a.werkzeug !== 'auftrag_anlegen'); });
    expect(pr(nie, 'nach-uebergabe')?.ok).toBeNull();
  });
  test('Wahl ohne Datum oder mit dem falschen Wort: rot', () => {
    for (const zeile of ['Bauen lassen: albatros', 'Bauen lassen: selbst (01.11.2026)', 'Bauen lassen: [Annahme: albatros] (01.11.2026)']) {
      const l = mit((x) => { const z = x.zustaende.at(-1)!; z.dateien['docs/projekt.md'] = String(z.dateien['docs/projekt.md']).replace(/^Bauen lassen: .*$/m, zeile); });
      expect([zeile, pr(l, 'bauen-lassen')?.ok]).toEqual([zeile, false]);
    }
  });
  test('Betrag: Franken in jeder Schreibweise zählen, nur Beträge, die ein Werkzeug vorher nannte', () => {
    const runde4 = (text: string) => mit((l) => { l.nachrichten[9]!.text = text; });
    expect(pr(runde4('CHF 290 einmalig, dann CHF 15 im Monat.'), 'angebot-betrag')?.ok).toBe(true);
    expect(pr(runde4("Einmalig 290 Franken, danach 15.– CHF im Monat."), 'angebot-betrag')?.ok).toBe(true);
    // Nachbesserung 02.11.2026: ein Betrag, den kein Werkzeug nannte, fällt unter «betrag» (vorher nur in der Runde des Angebots geprüft)
    const neunzehn = runde4('Fr. 290.– einmalig und CHF 19 im Monat.');
    expect([pr(neunzehn, 'angebot-betrag')?.ok, pr(neunzehn, 'betrag')?.beleg]).toEqual([true, ['Runde 4: CHF 19 hat kein Werkzeug vorher genannt']]);
    expect(pr(runde4('Das kostet einmalig etwas, danach Light.'), 'angebot-betrag')?.ok).toBe(false);
  });
  // Nachbesserung 02.11.2026: Die Beträge stehen nicht fest in punkte.ts, sie kommen aus den Antworten im Lauf (betraege, einmalig)
  test('Betrag aus dem Lauf: nennt konto 310, ist 310 richtig und 290 falsch', () => {
    const teurer = (text: string) => mit((l) => {
      for (const a of l.aufrufe) {
        if (a.betraege) a.betraege = a.betraege.map((x) => (x === 290 ? 310 : x));
        if (a.einmalig === 290) a.einmalig = 310;
      }
      l.nachrichten[9]!.text = text;
      // Seit Welle 9 (02.11.2026, w9-42) geht das Beispiel bis zur Vorschau und nennt den Betrag auch dort: in jeder späteren Antwort der KI
      for (const n of l.nachrichten.slice(10)) if (n.wer === 'KI') n.text = n.text.replaceAll('CHF 290', 'CHF 310');
    });
    expect([pr(teurer('CHF 310 einmalig, danach CHF 15 im Monat.'), 'angebot-betrag')?.ok, pr(teurer('CHF 310 einmalig, danach CHF 15 im Monat.'), 'betrag')?.ok]).toEqual([true, true]);
    expect([pr(teurer('CHF 290 einmalig, danach CHF 15 im Monat.'), 'angebot-betrag')?.ok, pr(teurer('CHF 290 einmalig, danach CHF 15 im Monat.'), 'betrag')?.ok]).toEqual([false, false]);
  });
});

// Welle 9 (02.11.2026, w9-42): Das Beispiel geht bis zur Vorschau (Runde 9 Übergabe, Runde 11 legt die Person zwei Fotos in design/bilder/,
// Runde 12 schreibt sie ihre Angaben fürs Impressum in den Chat, Runde 14 meldet lage die Vorschau). Die Regeln an Abwandlungen davon.
describe('Bauservice bis zur Vorschau: design/ mit Prüfsummen, Fotos der Person, Vorschau, Impressum', () => {
  const gut = beispiel('bauen-lassen.json');
  const mit = (f: (l: Beispiel) => void) => { const l = structuredClone(gut); f(l); return l; };
  const ab = (l: Beispiel, r: number, f: (z: Lauf['zustaende'][number]) => void) => { for (const z of l.zustaende.filter((x) => x.runde >= r)) f(z); };
  test('Fotos der Person sind ausgenommen, nur so wie sie sie abgelegt hat', () => {
    expect(gut.person?.[0]?.runde).toBe(11);
    expect(pr(gut, 'nach-uebergabe')?.ok).toBe(true);
    // Ohne den Eintrag, dass die Person sie abgelegt hat, wären es neue Dateien der KI
    const ohnePerson = mit((l) => { delete l.person; });
    expect(pr(ohnePerson, 'nach-uebergabe')?.beleg).toEqual(['Runde 11: design/bilder/strauss-fruehling.jpg neu nach der Übergabe', 'Runde 11: design/bilder/laden-aussen.jpg neu nach der Übergabe']);
    // Ändert die KI ein Foto der Person, zählt es als geändert
    const geaendert = mit((l) => ab(l, 13, (z) => { z.design!['design/bilder/laden-aussen.jpg'] = 'aaaaaaaaaaaa'; }));
    expect(pr(geaendert, 'nach-uebergabe')?.beleg).toEqual(['Runde 13: design/bilder/laden-aussen.jpg geändert nach der Übergabe']);
  });
  test('jede andere Datei unter design/ nach der Übergabe: neu oder geändert, rot', () => {
    // Ein Bild der KI in design/bilder/ ist nicht ausgenommen (vorher sah die Regel nur fünf Ergebnisdateien, also keines)
    const bild = mit((l) => ab(l, 12, (z) => { z.design!['design/bilder/ki-strauss.png'] = 'bbbbbbbbbbbb'; }));
    expect(pr(bild, 'nach-uebergabe')).toMatchObject({ ok: false, beleg: ['Runde 12: design/bilder/ki-strauss.png neu nach der Übergabe'] });
    const seite = mit((l) => ab(l, 10, (z) => { z.design!['design/entwurf/kontakt.html'] = 'cccccccccccc'; }));
    expect(pr(seite, 'nach-uebergabe')?.ok).toBe(false);
    const skizze = mit((l) => ab(l, 10, (z) => { z.design!['design/skizze.html'] = 'dddddddddddd'; }));
    expect(pr(skizze, 'nach-uebergabe')?.beleg).toEqual(['Runde 10: design/skizze.html geändert nach der Übergabe']);
    // Ohne Prüfsummen (ältere Läufe) wie bisher: nur neue Ergebnisdateien unter design/
    const alt = mit((l) => { for (const z of l.zustaende) delete z.design; });
    expect(pr(alt, 'nach-uebergabe')?.ok).toBe(true);
  });
  test('Vorschau: nie gemeldet heisst nicht geprüft (Exit 2), ohne Weg ins Cockpit rot', () => {
    const nie = mit((l) => { for (const a of l.aufrufe) if (a.auftrag === 'vorschau') a.auftrag = 'im_bau'; });
    expect([pr(nie, 'vorschau')?.ok, ergebnis(nie).exit]).toEqual([null, 2]);
    const ohneCockpit = mit((l) => { l.nachrichten[29]!.text = 'Deine Vorschau ist da. Gefällt sie dir, bezahlst du CHF 290 einmalig, dazu CHF 15 im Monat.'; });
    expect(pr(ohneCockpit, 'vorschau')).toMatchObject({ ok: false, beleg: ['Runde 14: die Vorschau ist da, aber die KI nennt den Weg ins Cockpit nicht'] });
  });
  test('Impressum aus dem Chat: in einer Datei oder bei einem Werkzeug rot, nie im Chat heisst nicht geprüft', () => {
    expect(gut.nachrichten[24]!.text).toContain('Testgasse 7');
    const datei = mit((l) => ab(l, 12, (z) => { z.dateien['docs/projekt.md'] = `${String(z.dateien['docs/projekt.md'])}\nImpressum: Stiel und Blatt, Testgasse 7, 9999 Testwil\n`; }));
    expect(pr(datei, 'impressum-nur-cockpit')?.beleg).toEqual(['Runde 12: Angaben fürs Impressum in docs/projekt.md', 'Runde 13: Angaben fürs Impressum in docs/projekt.md', 'Runde 14: Angaben fürs Impressum in docs/projekt.md']);
    const werkzeug = mit((l) => { l.aufrufe.push({ runde: 12, werkzeug: 'luecke_melden', argumente: { frage: 'Impressum mit hallo@stiel-und-blatt.example eintragen?', art: 'nicht_abgedeckt' } }); });
    expect(pr(werkzeug, 'impressum-nur-cockpit')?.beleg).toEqual(['Runde 12: Angaben fürs Impressum an luecke_melden']);
    const nie = mit((l) => { l.nachrichten[24]!.text = 'Wo gebe ich das Impressum ein?'; });
    expect([pr(nie, 'impressum-nur-cockpit')?.ok, ergebnis(nie).exit]).toEqual([null, 2]);
  });
});
