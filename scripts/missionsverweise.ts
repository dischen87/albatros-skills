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
// Dazu seit der Nachbesserung (Gegenprobe texte, 01.11.2026): mission_holen zeigt die nächste offene Mission, nicht eine bestimmte
// Lektion. Nach dem Schritt, der die Phase abschliesst, ist das schon eine Mission der nächsten Phase; mit Light oder Pilot ist es in P11
// bis P13 schon vorher eine ohne Kontrollfrage (flugschule route(): in der Phase nach Weg und ID, flugschule-01 vor -16, -06/-07 vor -17,
// -04 vor -18; Nachbau lauf3/mission-holen-aktuell.ts). verstanden_melden nimmt die Mission dagegen ausdrücklich an.
// 5. Kontrollfragen kommen nie «(`mission_holen`)»: kein Absatz oder Listenpunkt mit einer Kontrollfrage nennt mission_holen als Quelle.
// 6. Steht eine Kontrollfrage wörtlich im Skill («…?» hinter «Lektion `id`» im selben Absatz), ist sie Wort für Wort eine Frage dieser
//    Lektion in der Sprache des Skills (missionen/ bzw. uebersetzungen/<sprache>/missionen/, verstehen.frage).
import type { LektionsMission } from './lektionen.ts';

export type VerweisMission = LektionsMission & { skill: string };
export type SkillText = { datei: string; slug: string; text: string };
// Kontrollfragen je Sprache (de, fr, it, en) und Mission, wie flugschule sie zeigt
export type Fragen = Partial<Record<string, ReadonlyMap<string, readonly string[]>>>;

const ID = String.raw`(?:flugschule|webseite|geschaeft)-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*`;
const LEKTION = new RegExp(String.raw`(?:Lektion|leçon|lezione|lesson) \`(${ID})\``, 'gi');
// Wörter vor der Mission sind kurz und ohne `…`: «mit `mission: x`», «(Mission `x`», «avec», «(missione», «with»
const ALS_LEKTION = [
  new RegExp(String.raw`\`verstanden_melden\`[^\`\n]{0,20}\`(?:mission: )?(${ID})\``, 'g'),
  new RegExp(String.raw`\`(${ID})\` \(\`mission_holen\`\)`, 'g'),
  LEKTION,
];
const GEPRUEFT = new RegExp(String.raw`\`mission_pruefen\`[^\`\n]{0,20}\`(${ID})\``, 'g');
const KONTROLLFRAGE = /Kontrollfrage|questions? de contrôle|domand[ae] di controllo|check questions?/i;
const AUS_HOLEN = '(`mission_holen`)';
// Gefragt: «…» (de, fr, it) oder “…” (en), am Ende ein Fragezeichen
const GEFRAGT = /«([^»\n]*)»|“([^”\n]*)”/g;

const istLektion = (m: VerweisMission) => !m.optional && (m.verstehen?.length ?? 0) > 0;
const zeile = (text: string, stelle: number) => text.slice(0, stelle).split('\n').length;
export const spracheVon = (datei: string) => /plugins\/albatros-(fr|it|en)\//.exec(datei)?.[1] ?? 'de';
// Leerraum wie gesetzt (auch geschützte Leerzeichen der französischen Typografie) zählt als ein Leerzeichen
const glatt = (s: string) => s.replace(/[\s  ]+/gu, ' ').trim();
// Absätze und Listenpunkte eines Skills, mit ihrer Stelle im Text
export function bloecke(text: string): { start: number; text: string }[] {
  const aus: { start: number; text: string }[] = [];
  let [start, stelle, jetzt] = [0, 0, [] as string[]];
  for (const z of text.split('\n')) {
    if ((z.trim() === '' || /^\s*(?:[-*+]|\d+\.)\s|^#/.test(z)) && jetzt.length) {
      aus.push({ start, text: jetzt.join('\n') });
      jetzt = [];
    }
    if (z.trim() !== '') {
      if (!jetzt.length) start = stelle;
      jetzt.push(z);
    }
    stelle += z.length + 1;
  }
  if (jetzt.length) aus.push({ start, text: jetzt.join('\n') });
  return aus;
}

export function missionsverweise(skills: SkillText[], missionen: VerweisMission[], fragen: Fragen = {}): string[] {
  const nachId = new Map(missionen.map((m) => [m.id, m]));
  const deutsch = new Map(missionen.map((m) => [m.id, (m.verstehen ?? []).map((v) => (v as { frage?: string }).frage ?? '')]));
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

    const sprache = spracheVon(datei);
    const jeLektion = sprache === 'de' ? (fragen.de ?? deutsch) : fragen[sprache];
    for (const b of bloecke(text)) {
      if (KONTROLLFRAGE.test(b.text) && b.text.includes(AUS_HOLEN))
        fehler.push(`${datei}:${zeile(text, b.start + b.text.indexOf(AUS_HOLEN))}: Kontrollfragen aus mission_holen; es zeigt die nächste offene `
          + 'Mission, nicht die Lektion (nach dem letzten Schritt der Phase schon die nächste Phase). Die Fragen der Lektion wörtlich in den Skill, '
          + 'den Kern einer guten Antwort nennt lage («Kontrollfrage am Ende der Phase»), gestellt vor dem letzten Schritt der Phase');
      if (!jeLektion) continue;
      for (const l of b.text.matchAll(LEKTION)) {
        const soll = jeLektion.get(l[1]!);
        if (!soll?.length) continue;
        for (const q of b.text.slice(l.index + l[0].length).matchAll(GEFRAGT)) {
          const gefragt = glatt(q[1] ?? q[2] ?? '');
          if (gefragt.endsWith('?') && !soll.some((f) => glatt(f) === gefragt))
            fehler.push(`${datei}:${zeile(text, b.start + l.index + l[0].length + q.index)}: Kontrollfrage «${gefragt}» steht so nicht in der Lektion `
              + `«${l[1]}» (${sprache}); wörtlich: ${soll.map((f) => `«${glatt(f)}»`).join(' oder ')}`);
        }
      }
    }
  }
  return fehler;
}

// Kontrollfragen für Regel 6: Deutsch aus missionen/, sonst aus uebersetzungen/<sprache>/missionen/ (gleicher Pfad). Fehler im Kopf meldet
// pruefen.ts an anderer Stelle; hier fehlt die Mission dann nur.
export async function ladeFragen(wurzel: string): Promise<Fragen> {
  const kopf = async (pfad: string): Promise<{ id?: unknown; verstehen?: unknown } | null> => {
    const datei = Bun.file(wurzel + pfad);
    if (!(await datei.exists())) return null;
    const k = /^---\n([\s\S]*?)\n---/.exec(await datei.text())?.[1];
    try {
      return k ? (Bun.YAML.parse(k) as { id?: unknown; verstehen?: unknown }) : null;
    } catch {
      return null;
    }
  };
  const fragenIn = (k: { verstehen?: unknown } | null) =>
    (Array.isArray(k?.verstehen) ? k.verstehen : []).flatMap((v: unknown) => (typeof (v as { frage?: unknown })?.frage === 'string' ? [(v as { frage: string }).frage] : []));
  const aus: Record<string, Map<string, string[]>> = { de: new Map(), fr: new Map(), it: new Map(), en: new Map() };
  for (const pfad of new Bun.Glob('missionen/*/*.md').scanSync(wurzel)) {
    const de = await kopf(pfad);
    if (typeof de?.id !== 'string') continue;
    aus.de!.set(de.id, fragenIn(de));
    for (const s of ['fr', 'it', 'en']) aus[s]!.set(de.id, fragenIn(await kopf(`uebersetzungen/${s}/${pfad}`)));
  }
  return aus;
}
