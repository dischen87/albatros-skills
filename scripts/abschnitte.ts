// Abschnittsnamen für pruefen.ts (Schnittstellen Welle 5, §5, 31.10.2026). lage nennt Abschnitte deutsch, so wie sie in fahrplan.yaml
// stehen (abschnitt, auch in varianten), und Skills zeigen mit deutschen Namen auf Abschnitte anderer Skills
// («Skill `lancieren`, Teil 2, «Selbst, ohne Repo»»). Damit die KI den Abschnitt in jeder Sprache findet, steht jeder dieser Namen
// im Ziel-Skill jeder Sprache in einer Überschrift: deutsch so, übersetzt als Überschrift oder in Klammern («## Autorisation (Freigabe)»).
// Als Überschrift zählt eine Zeile mit # oder ein fetter Anfang (**Name:** …), nie etwas in einem Codeblock oder in `…`.
import { Glob } from 'bun';
import type { Phase } from './fahrplan.ts';

export type Sprache = 'de' | 'fr' | 'it' | 'en';
export const SPRACHEN: Sprache[] = ['de', 'fr', 'it', 'en'];
// Ein Name, den die KI im Skill `ziel` als Abschnitt finden muss, und woher er kommt (für die Meldung)
export type Verweis = { ziel: string; name: string; von: string };
// Skills je Sprache: Slug → Text der SKILL.md
export type Skills = Record<Sprache, Map<string, string>>;

// Zeilen ausserhalb von Codeblöcken (```), Zeilen im Block werden leer, damit die Nummern stimmen
export function ohneCode(text: string): string[] {
  let block = false;
  return text.split('\n').map((z) => {
    if (/^\s*(```|~~~)/.test(z)) {
      block = !block;
      return '';
    }
    return block ? '' : z;
  });
}

// Text der Überschriften: Zeilen mit # und fette Anfänge von Zeilen und Listenpunkten, ohne `…` und mit einfachen Leerzeichen
export function ueberschriften(text: string): string[] {
  return ohneCode(text).flatMap((z) => {
    const kopf = /^#{1,6}\s+(.*)$/.exec(z)?.[1] ?? /^\s*(?:[-*+]\s+|\d+\.\s+)?\*\*(.+?)\*\*/.exec(z)?.[1];
    return kopf === undefined ? [] : [kopf.replace(/`[^`]*`/g, ' ').replace(/\s+/g, ' ').trim()];
  });
}

// Steht der Name als ganzes Stück in einer Überschrift (gross und klein egal, davor und danach kein Buchstabe und keine Ziffer)?
export function findet(koepfe: string[], name: string): boolean {
  const n = name.replace(/\s+/g, ' ').trim().toLowerCase();
  const rand = (c: string | undefined) => c === undefined || !/[\p{L}\p{N}]/u.test(c);
  return koepfe.some((k) => {
    const t = k.toLowerCase();
    for (let i = t.indexOf(n); i >= 0; i = t.indexOf(n, i + 1)) if (rand(t[i - 1]) && rand(t[i + n.length])) return true;
    return false;
  });
}

// Querverweise in einem deutschen Skill: «Skill `x`, Abschnitt «Name»», «Skill `x` (Abschnitt «Name»)», «Skill `x`, Teil 2, «Name»
// und «Name»», «Skill `x`, Schritt «Name»», «Skill `x`, Abschnitt 4 «Name»» und «Abschnitt «Name» in `x`». Nicht gemeint sind Zitate
// ohne Wort für den Ort («Skill `x`, bei «selbst»») und Überschriften in Vorlagen («Umzugsliste «…»»). Verweise auf sich selbst zählen nicht.
const VERWEIS = /Skill `([a-z0-9-]+)`(?:,\s*|\s*\(\s*)(?:(?:Teil|Schritt|Abschnitt) \d+,?\s*)*(?:(?:Abschnitt|Schritt)\s+)?\(?«([^»]+)»(?:\s+und\s+«([^»]+)»)?/g;
const RUECKWAERTS = /Abschnitt «([^»]+)» (?:in|im Skill) `([a-z0-9-]+)`/g;
export function verweiseIn(text: string, von: string): Verweis[] {
  const aus: Verweis[] = [];
  for (const z of ohneCode(text)) {
    for (const m of z.matchAll(VERWEIS)) for (const name of [m[2], m[3]]) if (name && m[1] !== von) aus.push({ ziel: m[1]!, name, von: `Verweis in ${von}` });
    for (const m of z.matchAll(RUECKWAERTS)) if (m[2] !== von) aus.push({ ziel: m[2]!, name: m[1]!, von: `Verweis in ${von}` });
  }
  return aus;
}

// Was von einer Phase gebraucht wird: Skill und Abschnitt, auch in der Variante modernisieren
export type PhaseMitAbschnitt = Pick<Phase, 'id' | 'skill' | 'abschnitt' | 'varianten'>;

// Abschnitte aus fahrplan.yaml, die lage nennt (Phase und Variante modernisieren)
export function abschnitteImFahrplan(fahrplan: { phasen: PhaseMitAbschnitt[] }): Verweis[] {
  return fahrplan.phasen.flatMap((p) => {
    const v = p.varianten?.modernisieren;
    return [
      ...(p.abschnitt ? [{ ziel: p.skill, name: p.abschnitt, von: `lage, ${p.id}` }] : []),
      ...(v?.abschnitt ? [{ ziel: v.skill ?? p.skill, name: v.abschnitt, von: `lage, ${p.id} modernisieren` }] : []),
    ];
  });
}

const pfad = (s: Sprache, slug: string) => `plugins/albatros${s === 'de' ? '' : `-${s}`}/skills/${slug}/SKILL.md`;

// Die Prüfung: jeder Name aus fahrplan.yaml und jeder Querverweis aus den deutschen Skills steht im Ziel-Skill jeder Sprache in einer
// Überschrift. Ein Name, der an mehreren Stellen vorkommt, gibt je Datei eine Meldung mit allen Quellen.
export function abschnittsnamen(skills: Skills, abschnitte: Verweis[]): string[] {
  const verweise = [...abschnitte, ...[...skills.de].flatMap(([slug, text]) => verweiseIn(text, slug))];
  const quellen = new Map<string, { ziel: string; name: string; von: Set<string> }>();
  for (const v of verweise) {
    const k = `${v.ziel}\n${v.name}`;
    if (!quellen.has(k)) quellen.set(k, { ziel: v.ziel, name: v.name, von: new Set() });
    quellen.get(k)!.von.add(v.von);
  }
  const fehler: string[] = [];
  for (const { ziel, name, von } of quellen.values()) {
    const woher = [...von].join('; ');
    for (const s of SPRACHEN) {
      const text = skills[s].get(ziel);
      if (text === undefined) {
        if (s === 'de') fehler.push(`${pfad(s, ziel)} fehlt, aber «${name}» wird dort gesucht (${woher})`);
        continue; // eine fehlende Übersetzung meldet die Prüfung der vier Sprachen
      }
      if (findet(ueberschriften(text), name)) continue;
      fehler.push(s === 'de'
        ? `${pfad(s, ziel)}: keine Überschrift mit «${name}» (${woher})`
        : `${pfad(s, ziel)}: keine Überschrift mit «${name}» oder «(${name})», zum Beispiel «## <übersetzt> (${name})» (${woher})`);
    }
  }
  return fehler;
}

// Für pruefen.ts: die Skills aller vier Sprachen lesen und prüfen
export async function pruefeAbschnittsnamen(wurzel: string, fahrplan: { phasen: PhaseMitAbschnitt[] }): Promise<string[]> {
  const skills: Skills = { de: new Map(), fr: new Map(), it: new Map(), en: new Map() };
  for (const s of SPRACHEN)
    for await (const datei of new Glob(pfad(s, '*')).scan(wurzel)) skills[s].set(datei.split('/').at(-2)!, await Bun.file(wurzel + datei).text());
  return abschnittsnamen(skills, abschnitteImFahrplan(fahrplan));
}
