// Verweise der Skills auf Missionen, für pruefen.ts (Welle 6, w6-40, 01.11.2026). Im Modus lernen nennt lage als Lektion nur Missionen
// mit Kontrollfrage (verstehen), die nicht freiwillig sind (albatros services/mcp/src/lage.ts, lektion(); hier scripts/lektionen.ts).
// Zeigt ein Skill für verstanden_melden oder die Kontrollfragen auf eine andere Mission, landet «verstanden» dort, wo lage und das
// Flugbuch es nie suchen (Gegenprobe lernteil, Welle 5: gestaltung und webseite-bauen nannten webseite-04 bzw. webseite-02, lage nannte
// flugschule-19, -20 und -21). Darum gilt in jedem Skill jeder Sprache:
// 1. Jede genannte Mission gibt es.
// 2. Die Mission bei `verstanden_melden`, vor (`mission_holen`) und nach «Lektion» ist eine Lektion: nicht freiwillig, mit verstehen.
// 3. Hat der Skill Pflicht-Missionen (skill: <slug>, ohne optional), nennt jedes `mission_pruefen` zuerst eine Pflicht-Mission;
//    freiwillige Zusatzmissionen kommen danach. Skills, deren Missionen alle freiwillig sind (domain, landung, cms, statistik), dürfen.
// 4. Jede Lektion, deren Skill in diesem Repo liegt, nennt ihr Skill.
import type { LektionsMission } from './lektionen.ts';

export type VerweisMission = LektionsMission & { skill: string };
export type SkillText = { datei: string; slug: string; text: string };

const ID = String.raw`(?:flugschule|webseite|geschaeft)-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*`;
// Wörter vor der Mission sind kurz und ohne `…`: «mit `mission: x`», «(Mission `x`», «avec», «(missione», «with»
const ALS_LEKTION = [
  new RegExp(String.raw`\`verstanden_melden\`[^\`\n]{0,20}\`(?:mission: )?(${ID})\``, 'g'),
  new RegExp(String.raw`\`(${ID})\` \(\`mission_holen\`\)`, 'g'),
  new RegExp(String.raw`(?:Lektion|leçon|lezione|lesson) \`(${ID})\``, 'gi'),
];
const GEPRUEFT = new RegExp(String.raw`\`mission_pruefen\`[^\`\n]{0,20}\`(${ID})\``, 'g');

const istLektion = (m: VerweisMission) => !m.optional && (m.verstehen?.length ?? 0) > 0;
const zeile = (text: string, stelle: number) => text.slice(0, stelle).split('\n').length;

export function missionsverweise(skills: SkillText[], missionen: VerweisMission[]): string[] {
  const nachId = new Map(missionen.map((m) => [m.id, m]));
  const fehler: string[] = [];
  for (const { datei, slug, text } of skills) {
    for (const t of text.matchAll(new RegExp(ID, 'g')))
      if (!nachId.has(t[0])) fehler.push(`${datei}:${zeile(text, t.index)}: Mission «${t[0]}» gibt es nicht in missionen/`);
    for (const muster of ALS_LEKTION)
      for (const t of text.matchAll(muster)) {
        const m = nachId.get(t[1]!);
        if (m && !istLektion(m))
          fehler.push(`${datei}:${zeile(text, t.index)}: verstanden_melden oder Kontrollfragen mit «${m.id}», aber lage nennt sie nie als Lektion `
            + `(${m.optional ? 'freiwillig' : 'ohne verstehen'}); nimm die Lektion der Phase (Mission mit verstehen, ohne optional)`);
      }
    const pflicht = missionen.filter((m) => m.skill === slug && !m.optional).map((m) => m.id);
    for (const t of text.matchAll(GEPRUEFT)) {
      const m = nachId.get(t[1]!);
      if (m?.optional && pflicht.length)
        fehler.push(`${datei}:${zeile(text, t.index)}: mission_pruefen nennt zuerst die freiwillige Mission «${m.id}»; zuerst die Pflicht `
          + `(${pflicht.join(', ')}), freiwillige Zusatzmissionen danach`);
    }
    // Lektionen mit einer Methode als skill (Weg Geschäft, albatros-methoden) haben hier keinen Skill-Text und fallen so weg
    for (const m of missionen)
      if (m.skill === slug && istLektion(m) && !text.includes(m.id))
        fehler.push(`${datei}: nennt die Lektion «${m.id}» (skill: ${slug}) nicht; dort meldet die KI verstanden und prüft die Mission`);
  }
  return fehler;
}
