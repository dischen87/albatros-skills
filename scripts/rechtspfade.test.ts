// Pfade für Impressum und Datenschutz je Sprache (Welle 6, w6-47, 01.11.2026). Die Mission webseite-07-recht-ch nennt dieselben Pfade wie
// der Skill recht-ch derselben Sprache (Entscheid weg-07, Welle 5: de /impressum und /datenschutz, fr /mentions-legales und
// /protection-des-donnees, it /impressum und /protezione-dei-dati, en /legal-notice und /privacy). Vorher nannten die Übersetzungen der
// Mission noch /impressum und /datenschutz, die Lernenden lasen also zwei Pfade (Gegenprobe texte-b, Welle 5).
import { expect, test } from 'bun:test';

const wurzel = new URL('..', import.meta.url).pathname;
const PFAD = /`(\/(?:impressum|datenschutz|mentions-legales|protection-des-donnees|protezione-dei-dati|legal-notice|privacy))`/g;
const pfade = async (datei: string) => new Set([...(await Bun.file(wurzel + datei).text()).matchAll(PFAD)].map((m) => m[1]!));

test('Mission webseite-07-recht-ch nennt in jeder Sprache die Pfade des Skills recht-ch', async () => {
  for (const s of ['de', 'fr', 'it', 'en']) {
    const mission = await pfade(s === 'de' ? 'missionen/webseite/07-recht-ch.md' : `uebersetzungen/${s}/missionen/webseite/07-recht-ch.md`);
    const skill = await pfade(`plugins/albatros${s === 'de' ? '' : `-${s}`}/skills/recht-ch/SKILL.md`);
    expect([s, mission.size]).toEqual([s, 2]);
    expect([s, [...mission].filter((p) => !skill.has(p))]).toEqual([s, []]);
  }
});
