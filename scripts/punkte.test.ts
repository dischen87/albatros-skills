// Punkte des Durchspiels (scripts/punkte.ts) an aufgezeichneten Beispiel-Verläufen (scripts/durchspiel/beispiele/, je mit erwartetem
// Exit-Code) und an kleinen Läufen, die je eine Regel brechen. Die Beispiele sind von Hand im Format von lauf.json geschrieben, nicht von
// einem Modell aufgezeichnet.
import { describe, expect, test } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PERSONEN, rolle } from './durchspiel/personen.ts';
import { ladeFahrplan, type Fahrplan } from './fahrplan.ts';
import { beantwortet, belegt, datiert, fragen, freigabeZumBauen, punkte, wert, type Lauf } from './punkte.ts';

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
  test('es gibt einen guten, einen schlechten und einen nicht auswertbaren Lauf', () => {
    expect(dateien.map((d) => beispiel(d).erwartet.exit).sort()).toEqual([0, 1, 2]);
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
    for (const w of ['[offen: fragen]', '[ouvert : demander]', '[aperto: chiedere]', '[open: ask]', '[Platzhalter: Text]', '[placeholder: text]', '', null]) expect(belegt(w)).toBe(false);
    for (const w of ['[Annahme: zehn Anfragen]', '[Hypothèse : dix]', '[Ipotesi: dieci]', '[Assumption: ten]']) expect([belegt(w), beantwortet(w)]).toEqual([true, false]);
    expect(beantwortet('Blende 8 [Annahme: Schreibweise]')).toBe(true);
  });
  test('Freigabe zum Bauen wie pruefen.mjs --vor-bau: letzte Zeile, Fett weg, Datum vorne', () => {
    expect(datiert(freigabeZumBauen('Freigegeben zum Bauen: 31.10.2026, «Ja, bau ihn so.»'))).toBe(true);
    expect(datiert(freigabeZumBauen('**Freigegeben zum Bauen:** 2026-10-31'))).toBe(true);
    expect(datiert(freigabeZumBauen('Freigegeben zum Bauen: 31.10.2026\nFreigegeben zum Bauen: [offen: Nachtrag]'))).toBe(false);
    expect(datiert(freigabeZumBauen('Früher freigegeben zum Bauen: 30.10.2026'))).toBe(false);
    expect(datiert(freigabeZumBauen('Freigegeben zum Bauen: <Datum>'))).toBe(false);
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
