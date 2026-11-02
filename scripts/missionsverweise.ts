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
// 5. Kontrollfragen kommen nie aus mission_holen: kein Absatz oder Listenpunkt mit einer Kontrollfrage nennt mission_holen als Quelle.
//    Quelle ist es in Klammern «(`mission_holen`)», direkt nach «mit, über, aus, von» (with, using, from, avec, par, con, tramite …) ohne
//    Verneinung davor, und in jedem Satz ohne Verneinung oder «nur» («…, die du mit `mission_holen` holst», «`mission_holen` liefert sie»).
//    Erlaubt ist die Warnung: «`mission_holen` zeigt nur die nächste offene Mission», «weil `lage` und `mission_holen` sie nicht mehr zeigen».
// 6. Steht eine Kontrollfrage wörtlich im Skill («…?» hinter einer Lektion `id` im selben Absatz, egal ob «Lektion», «Mission» oder nichts
//    davor steht), ist sie Wort für Wort eine Frage dieser Lektion in der Sprache des Skills (missionen/ bzw.
//    uebersetzungen/<sprache>/missionen/, verstehen.frage). Es zählt die Mission, die zuletzt vor der Frage steht.
// Regel 5 und 6 hängen seit Welle 7 (01.11.2026, w7-24) nicht mehr an einem Wortlaut: In en blieben «…, which you fetch with
// `mission_holen`» und «mission `id`: “…?”» grün (Gegenprobe texte, runde2/repro/mutation-kontrollfragen-r2b.log).
// 7. Zitiert ein Absatz mehr Kontrollfragen, als in eine Nachricht dürfen (fragen_je_nachricht in fahrplan.yaml, Grader fragen.md der
//    Evals lernen-*), sagt er in seiner Sprache, dass höchstens so viele in eine Nachricht kommen («höchstens zwei», «au plus deux»,
//    «al massimo due», «at most two»); die übrigen kommen nach der Antwort der Person (Welle 7, 01.11.2026, w7-22: betrieb und lancieren
//    zitierten drei Fragen mit «stellst du jetzt»).
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
// Regel 5: mission_holen im Absatz, und woran man die Quelle erkennt (Klammern, ein Wort für «mit» davor, ein Satz ohne Verneinung).
// Verneinung und «nur» in allen vier Sprachen (ein Skill zitiert auch deutsche Wörter); die Wörter für «mit» je Sprache, weil «da» im
// Deutschen etwas anderes heisst als im Italienischen.
const HOLEN = /`mission_holen`/g;
const NEIN = String.raw`nicht|nie|nur|kein\p{L}*|ohne|ne|pas|jamais|seulement|uniquement|sans|non|mai|solo|soltanto|senza|not|never|no|only|without`;
const VERNEINT = new RegExp(String.raw`(?<![\p{L}\p{N}])(?:(?:${NEIN})(?![\p{L}\p{N}])|n[’'](?=\p{L}))|n[’']t(?![\p{L}\p{N}])`, 'iu');
const MIT: Record<string, string> = {
  de: 'mit|über|aus|von|per|via|durch', fr: 'avec|via|par|de|depuis|grâce à', it: 'con|via|tramite|da|dal|dallo|attraverso|mediante',
  en: 'with|via|using|from|through|by',
};
// Verneint ist auch das Verb davor (Welle 8, w8-47, 01.11.2026: «never come from», «do not come from», «non arrivano da», «non le prendi da»):
// eine echte Verneinung bis zwei Wörter vor dem Wort für «mit». «ohne» und «nur» zählen weiter nur direkt davor, sonst würde «ohne Umweg mit
// `mission_holen`» grün. Dazu englisch «n't» («isn't from», «don't come from»).
const NEIN_VERB = String.raw`nicht|nie|niemals|kein\p{L}*|pas|jamais|non|mai|not|never|no|\p{L}*n[’']t`;
// Nachbesserung 02.11.2026 (Gegenprobe skills): Steht zwischen Verneinung und dem Wort für «mit» «anders als», «other than», «autrement que» …,
// hebt das die Verneinung auf («nicht anders als aus `mission_holen`» heisst: nur von dort). Solche Wörter zählen nicht als die zwei dazwischen.
const AUFHEBEN = String.raw`anders|woanders|als|ausser|sondern|other|than|but|except|autrement|ailleurs|que|sauf|altro|altrimenti|che|tranne|fuorché`;
const QUELLE_DAVOR = Object.fromEntries(Object.entries(MIT).map(([s, w]) => [s, new RegExp(
  String.raw`(?:^|[^\p{L}])(?:(${NEIN}|\p{L}*n[’']t)\s+|(${NEIN_VERB})\s+(?:(?!(?:${AUFHEBEN})(?![\p{L}\p{N}]))\p{L}+\s+){1,2})?(?:${w})\s+(?:(?:dem|l[’']|lo|the)\s*(?:Werkzeug|outil|strumento|tool)\s+)?$`, 'iu')]));
// Satzgrenze: . ! ? : ; vor Leerraum, nicht nach einem einzelnen Buchstaben (z. B., e.g.)
const SATZENDE = /(?<!(?:^|[\s(.])\p{L})[.!?:;](?=\s|$)/gu;
function satzUm(text: string, stelle: number): string {
  let [von, bis] = [0, text.length];
  for (const e of text.matchAll(SATZENDE)) {
    if (e.index < stelle) von = e.index + 1;
    else { bis = e.index; break; }
  }
  return text.slice(von, bis);
}
// Stelle, an der der Absatz mission_holen als Quelle der Kontrollfragen nennt; null: nur als Warnung oder gar nicht
export function holenAlsQuelle(text: string, sprache = 'de'): number | null {
  if (!KONTROLLFRAGE.test(text)) return null;
  for (const h of text.matchAll(HOLEN)) {
    const davor = text.slice(0, h.index);
    const klammer = davor.endsWith('(') && text.slice(h.index + h[0].length).startsWith(')');
    const mit = (QUELLE_DAVOR[sprache] ?? QUELLE_DAVOR.de!).exec(davor);
    if (klammer || (mit && !mit[1] && !mit[2]) || !VERNEINT.test(satzUm(text, h.index))) return h.index;
  }
  return null;
}
// Regel 6: Missionen im Absatz (wie bei verstanden_melden auch «`mission: x`»), die Frage gehört zur letzten davor.
// Gefragt: «…» (de, fr, it; darin eine Ebene «…» wie «Was unterscheidet Light, Pilot und «selbst»?»), “…” oder "…" (en), am Ende ein Fragezeichen
const MISSION = new RegExp(String.raw`\`(?:mission: )?(${ID})\``, 'g');
// Regel 7: «höchstens <Zahl>» je Sprache, als Wort oder Ziffer
const ZAHLWORT: Record<string, Record<number, string>> = {
  de: { 1: 'eine', 2: 'zwei', 3: 'drei' }, fr: { 1: 'une', 2: 'deux', 3: 'trois' }, it: { 1: 'una', 2: 'due', 3: 'tre' }, en: { 1: 'one', 2: 'two', 3: 'three' },
};
const BEISPIEL: Record<string, string> = { de: 'höchstens', fr: 'au plus', it: 'al massimo', en: 'at most' };
const hoechstens = (sprache: string, n: number) => {
  const z = `(?:${n}|${ZAHLWORT[sprache]?.[n] ?? n})`;
  const muster: Record<string, string> = {
    de: `höchstens ${z}`, fr: `(?:au plus|au maximum|pas plus de) ${z}|${z} au (?:plus|maximum)`, it: `(?:al massimo|non più di|massimo) ${z}`,
    en: `(?:at most|no more than) ${z}|${z} at most`,
  };
  return new RegExp(`(?<![\\p{L}])(?:${muster[sprache] ?? muster.de})(?![\\p{L}])`, 'iu');
};
const GEFRAGT = /«((?:[^«»\n]|«[^«»\n]*»)*)»|“((?:[^“”\n]|“[^“”\n]*”)*)”|"([^"\n]*)"/g;

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

export function missionsverweise(skills: SkillText[], missionen: VerweisMission[], fragen: Fragen = {}, jeNachricht = 2): string[] {
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
      // Die Reihenfolge der Skills und Evals (Entscheid texte, Welle 6; w7-23, 01.11.2026): die Frage zusammen mit dem letzten Schritt der
      // Phase, in derselben Antwort (lernen-kontrollfrage), verstanden_melden erst nach der Antwort der Person (lernen-verstanden)
      const holen = holenAlsQuelle(b.text, sprache);
      if (holen !== null)
        fehler.push(`${datei}:${zeile(text, b.start + holen)}: Kontrollfragen aus mission_holen; es zeigt die nächste offene Mission, nicht die `
          + 'Lektion (nach dem letzten Schritt der Phase schon die nächste Phase). Die Fragen der Lektion wörtlich in den Skill, den Kern einer guten '
          + 'Antwort nennt lage («Kontrollfrage am Ende der Phase»); gestellt in derselben Antwort wie der letzte Schritt der Phase, '
          + 'verstanden_melden erst nach der Antwort der Person');
      if (!jeLektion) continue;
      const missionenIm = [...b.text.matchAll(MISSION)];
      let zitiert = 0;
      for (const q of b.text.matchAll(GEFRAGT)) {
        const gefragt = glatt(q[1] ?? q[2] ?? q[3] ?? '');
        const zu = missionenIm.filter((m) => m.index < q.index).at(-1)?.[1];
        const soll = zu ? jeLektion.get(zu) : undefined;
        if (!gefragt.endsWith('?') || !soll?.length) continue;
        zitiert++;
        if (!soll.some((f) => glatt(f) === gefragt))
          fehler.push(`${datei}:${zeile(text, b.start + q.index)}: Kontrollfrage «${gefragt}» steht so nicht in der Lektion «${zu}» (${sprache}); `
            + `wörtlich: ${soll.map((f) => `«${glatt(f)}»`).join(' oder ')}`);
      }
      if (zitiert > jeNachricht && !hoechstens(sprache, jeNachricht).test(b.text))
        fehler.push(`${datei}:${zeile(text, b.start)}: ${zitiert} Kontrollfragen in einem Absatz, aber höchstens ${jeNachricht} Fragen in einer Nachricht `
          + `(fragen_je_nachricht); sag im Absatz, dass höchstens ${jeNachricht} in eine Nachricht kommen («${BEISPIEL[sprache] ?? BEISPIEL.de} ${ZAHLWORT[sprache]?.[jeNachricht] ?? jeNachricht}») `
          + 'und die übrigen nach der Antwort der Person');
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
