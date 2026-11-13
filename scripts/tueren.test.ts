// Türen der Bausteine in den Texten der Skills (Nachbesserung texte, 01.11.2026). Was eine Liste von PocketBase Gästen antwortet, misst
// die Tabelle «Türen der Bausteine» im Skill bausteine (PocketBase 0.40.5, 31.10.2026): Listen mit einer Regel geben 200 mit leerer Liste,
// Listen allein für die Verwaltung 403. Die Gegenprobe texte fand in webseite-bauen (vier Sprachen) «Listen von PocketBase geben Gästen
// 200», ohne die Regel; wer danach eine Liste wie anmeldungen mit 200 in docs/tueren.txt schreibt, bekommt bei --tueren ein falsches Rot.
// Darum gilt in jedem Skill jeder Sprache, ausserhalb von Codeblöcken:
// 1. Ein Satzteil über Listen von PocketBase nennt die Regel («mit einer Regel», «avec une règle», «con una regola», «with a rule»).
// 2. Nennt ein Satzteil einen Pfad /api/collections/<name>/records und danach einen Status, ist es der Status aus der Tabelle.
import { expect, test } from 'bun:test';
import { Glob } from 'bun';

const wurzel = new URL('..', import.meta.url).pathname;
const LISTEN = /Listen von PocketBase|listes de PocketBase|liste di PocketBase|PocketBase lists/i;
const MIT_REGEL = /mit einer Regel|avec une règle|con una regola|with a rule/i;
const PFAD = /\/api\/collections\/[A-Za-z0-9_]+\/records/g;
const STATUS = /\b(200|302|401|403|404)\b/;

// Tabelle «Türen der Bausteine»: der erste Codeblock nach der Überschrift (übersetzt mit dem deutschen Namen in Klammern), je Zeile Pfad
// und Status
export function tabelle(bausteine: string): Map<string, string> {
  const ab = /^###[^\n]*Türen der Bausteine/m.exec(bausteine)?.index;
  if (ab === undefined) return new Map();
  const block = /```\n([\s\S]*?)```/.exec(bausteine.slice(ab))?.[1] ?? '';
  return new Map([...block.matchAll(/^(\/\S+)\s+(\d{3})\b/gm)].map((z) => [z[1]!, z[2]!]));
}

// Satzteile ausserhalb von Codeblöcken, getrennt an «.», «;» und Zeilenenden
const satzteile = (text: string) => text.split(/^```[\s\S]*?^```/m).flatMap((t) => t.split(/[.;](?=\s|$)|\n/));

export function tuerenPruefen(datei: string, text: string, soll: Map<string, string>): string[] {
  const fehler: string[] = [];
  for (const s of satzteile(text)) {
    if (LISTEN.test(s) && !MIT_REGEL.test(s)) fehler.push(`${datei}: «${s.trim().slice(0, 100)}…» nennt Listen von PocketBase ohne die Regel; Listen allein für die Verwaltung geben 403 (Skill bausteine, «Türen der Bausteine»)`);
    for (const p of s.matchAll(PFAD)) {
      const status = STATUS.exec(s.slice(p.index + p[0].length))?.[1];
      if (status && soll.has(p[0]) && soll.get(p[0]) !== status) fehler.push(`${datei}: ${p[0]} mit ${status}, die Tabelle «Türen der Bausteine» sagt ${soll.get(p[0])}`);
    }
  }
  return fehler;
}

const skills = async () => {
  const s: { datei: string; text: string }[] = [];
  for (const datei of new Glob('plugins/*/skills/*/SKILL.md').scanSync(wurzel)) s.push({ datei, text: await Bun.file(wurzel + datei).text() });
  return s;
};

test('Tabelle «Türen der Bausteine»: in jeder Sprache dieselben Pfade und Status, Listen mit 200 und mit 403', async () => {
  const de = tabelle(await Bun.file(`${wurzel}plugins/albatros/skills/bausteine/SKILL.md`).text());
  expect(de.get('/api/collections/users/records')).toBe('200');
  expect(de.get('/api/collections/anmeldungen/records')).toBe('403');
  for (const s of ['fr', 'it', 'en']) expect([s, tabelle(await Bun.file(`${wurzel}plugins/albatros-${s}/skills/bausteine/SKILL.md`).text())]).toEqual([s, de]);
});

test('echte Skills in vier Sprachen: Listen von PocketBase mit der Regel, Status wie in der Tabelle', async () => {
  const soll = tabelle(await Bun.file(`${wurzel}plugins/albatros/skills/bausteine/SKILL.md`).text());
  const alle = await skills();
  expect(alle.length).toBe(4 * 31); // 31 Skills seit swissactivities, blog und kanaele (13.11.2026), vorher 28 seit schnellstart (07.11.2026)
  // Es gibt solche Sätze (sonst prüft der Test nichts): in bausteine, lancieren und webseite-bauen je Sprache
  expect(alle.filter(({ text }) => satzteile(text).some((s) => LISTEN.test(s))).length).toBeGreaterThanOrEqual(12);
  expect(alle.flatMap(({ datei, text }) => tuerenPruefen(datei, text, soll))).toEqual([]);
});

test('ohne Regel, mit falschem Status oder nur im Codeblock: rot bzw. grün wie erwartet', () => {
  const soll = new Map([['/api/collections/users/records', '200'], ['/api/collections/anmeldungen/records', '403']]);
  // Der Satz aus webseite-bauen vor der Nachbesserung, in vier Sprachen
  for (const alt of [
    'Listen von PocketBase (zum Beispiel `/api/collections/users/records`) geben Gästen 200 mit einer leeren Liste, nicht 401 oder 403; nimmst du so eine Liste auf, dann mit 200.',
    'Les listes de PocketBase (par exemple `/api/collections/users/records`) répondent aux visiteurs 200 avec une liste vide, pas 401 ni 403 ;',
    'Le liste di PocketBase (per esempio `/api/collections/users/records`) rispondono agli ospiti con 200 e una lista vuota, non con 401 o 403;',
    'PocketBase lists (for example `/api/collections/users/records`) answer guests with 200 and an empty list, not 401 or 403;',
  ]) expect([alt, tuerenPruefen('x', alt, soll).length]).toEqual([alt, 1]);
  expect(tuerenPruefen('x', 'Listen von PocketBase mit einer Regel (zum Beispiel `/api/collections/anmeldungen/records`) geben Gästen 200.', soll))
    .toEqual(['x: /api/collections/anmeldungen/records mit 200, die Tabelle «Türen der Bausteine» sagt 403']);
  expect(tuerenPruefen('x', 'Listen von PocketBase mit einer Regel (zum Beispiel `/api/collections/users/records`) geben Gästen 200.', soll)).toEqual([]);
  expect(tuerenPruefen('x', '```\n/api/collections/anmeldungen/records 200\nListen von PocketBase geben 200\n```\n', soll)).toEqual([]);
});
