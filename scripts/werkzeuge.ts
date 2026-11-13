// Werkzeuge in den Skills gegen die Plattform (11.11.2026). Die Skills nennen Werkzeuge zweier Server: des lokalen Servers
// albatros-arbeitsplatz (das Programm «Albatros» auf dem Computer der Person; Vertrag: albatros apps/arbeitsplatz/src/vertrag.ts,
// WERKZEUG_EINGABEN) und des Servers von Albatros (albatros services/mcp). Ein Name, den es dort nicht gibt, ein Feld, das ein Werkzeug
// nicht kennt, oder ein Wert, den es ablehnt, fällt der KI erst im Gespräch mit der Person auf. Darum prüft werkzeuge.test.ts jede
// SKILL.md in allen vier Sprachen. Hier nur reine Funktionen; was es gibt, liest der Test aus der Plattform (ALBATROS).

/** Eingabe eines lokalen Werkzeugs: seine Felder und eine Prüfung wie safeParse (true = angenommen, was dieses Feld betrifft). */
export type Eingabe = { felder: string[]; nimmt: (feld: string, wert: string) => boolean };
export type Bekannt = {
  /** Werkzeuge des lokalen Servers albatros-arbeitsplatz */
  lokal: Map<string, Eingabe>;
  /** Werkzeuge des Servers von Albatros */
  fern: Set<string>;
  /** Feldnamen und feste Werte mit Unterstrich (bild_url, in_arbeit …): keine Werkzeuge, aber aus der Plattform */
  woerter: Set<string>;
};

// Wörter mit Unterstrich in `…`, die kein Werkzeug sind und nicht aus der Plattform kommen. Ein neues Wort kommt hier nur mit Grund dazu.
export const KEIN_WERKZEUG: ReadonlySet<string> = new Set([
  'generate_lead', 'sign_up', // Ereignisse der Statistik (Skill statistik)
  'pg_dump', 'node_modules', 'mem_limit', // Befehle, Ordner, Einstellung in compose.yaml
  'needs_auth', 'session_connectors_status', // Anmeldung der KI (Skill start)
  'default_tools_approval_mode', // Einstellung von Codex (Skill schnellstart)
  'schritt_2', 'passo_2', // Anker in Texten
  'nicht_abgedeckt', 'geraten', 'skill_unklar', 'skill_falsch', 'werkzeug_fehlt', 'fehler_bei_albatros', 'fehler_albatros', // Werte von luecke_melden und coach_fragen
  'naechster_schritt', 'bauen_erlaubt', // Schlüssel in der Lage, die naechstes als Daten nennt (apps/arbeitsplatz/src/weg/lage.ts)
  // Werkzeuge und Felder des öffentlichen Servers von SwissActivities (https://gateway.swissactivities.com/mcp, Skill swissactivities),
  // gelesen mit tools/list und search_activities am 13.11.2026; nicht aus der Plattform von Albatros
  'search_activities', 'get_activity_details', 'check_availability', 'search_places', 'get_place_details', 'search_hikes', 'get_hike_details',
  'get_weather', 'plan_journey', 'find_rail_passes', 'recommend_rail_pass', 'get_point_of_interest', 'show_on_map', 'plan_free_time',
  'booking_url', 'for_families', 'min_age', 'max_age', 'rain_ok',
]);

/** Text ohne Codeblöcke (```), damit Befehle und Vorlagen nicht als Werkzeug zählen. */
export function ohneBloecke(text: string): string {
  let block = false;
  return text.split('\n').map((z) => {
    if (/^\s*(```|~~~)/.test(z)) { block = !block; return ''; }
    return block ? '' : z;
  }).join('\n');
}

const NAME = /`([a-z][a-z0-9]*(?:_[a-z0-9]+)+)`/g;
/** Namen mit Unterstrich in `…`, die weder ein Werkzeug noch ein bekanntes Wort sind. */
export function unbekannteNamen(text: string, b: Bekannt): string[] {
  const aus = new Set<string>();
  for (const m of ohneBloecke(text).matchAll(NAME)) {
    const n = m[1]!;
    if (!b.lokal.has(n) && !b.fern.has(n) && !b.woerter.has(n) && !KEIN_WERKZEUG.has(n)) aus.add(n);
  }
  return [...aus].sort();
}

/** Erste Spalte der Tabelle im Skill schnellstart, die die Werkzeuge des lokalen Servers aufführt (beginnt mit `arbeitsplatz_oeffnen`). */
export function tabelleLokal(schnellstart: string): string[] {
  const zeilen = ohneBloecke(schnellstart).split('\n');
  const start = zeilen.findIndex((z) => /^\|\s*`arbeitsplatz_oeffnen`\s*\|/.test(z));
  if (start < 0) return [];
  const aus: string[] = [];
  for (const z of zeilen.slice(start)) {
    const m = /^\|\s*`([a-z_0-9]+)`\s*\|/.exec(z);
    if (!m) break;
    aus.push(m[1]!);
  }
  return aus;
}

const saetze = (text: string): string[] => ohneBloecke(text).split(/(?<=[.!?])\s+|\n/);
const IN_ZEICHEN = /`([^`\n]+)`/g;
const FELD_WERT = /^([a-z][a-z0-9_]*): (\S.*)$/;

/**
 * Felder und Werte: Nennt ein Satz ein lokales Werkzeug mit Feldern und dazu `feld: wert`, muss eines dieser Werkzeuge das Feld kennen
 * und den Wert annehmen. Dazu die Ja-Momente in Klammern nach `ja_moment` («`ja_moment` (`plan`)»). Zeilennamen der Dokumente beginnen
 * gross (`Stand: …`) und zählen nicht.
 */
export function feldFehler(text: string, b: Bekannt): string[] {
  const aus: string[] = [];
  for (const satz of saetze(text)) {
    const stuecke = [...satz.matchAll(IN_ZEICHEN)].map((m) => m[1]!);
    const werkzeuge = stuecke.filter((s) => (b.lokal.get(s)?.felder.length ?? 0) > 0);
    if (!werkzeuge.length) continue;
    for (const s of stuecke) {
      const m = FELD_WERT.exec(s);
      if (!m) continue;
      const [, feld, wert] = m as unknown as [string, string, string];
      const mitFeld = werkzeuge.filter((w) => b.lokal.get(w)!.felder.includes(feld));
      if (!mitFeld.length) aus.push(`\`${s}\`: ${werkzeuge.map((w) => `\`${w}\``).join(', ')} kennt das Feld ${feld} nicht`);
      else if (!mitFeld.some((w) => b.lokal.get(w)!.nimmt(feld, wert))) aus.push(`\`${s}\`: ${mitFeld.map((w) => `\`${w}\``).join(', ')} nimmt den Wert «${wert}» nicht an`);
    }
    const ja = b.lokal.get('ja_moment');
    if (ja) {
      for (const m of satz.matchAll(/`ja_moment`[^.()]{0,40}\(([^)]*)\)/g)) {
        for (const w of m[1]!.matchAll(/`([a-z_]+)`/g)) if (!ja.nimmt('art', w[1]!)) aus.push(`\`ja_moment\` (\`${w[1]}\`): diesen Ja-Moment gibt es nicht`);
      }
    }
  }
  return aus;
}

// Beschreibungen (description) der Skills, mit denen der Weg beginnt. Claude Code gibt der Liste der Skills 1 % des Kontexts, 4 Zeichen je
// Token: rund 8000 Zeichen bei 200 000 Token, 40 000 bei einer Million; die 28 Beschreibungen des deutschen Plugins haben zusammen über
// 20 000. Gemessen am 11.11.2026 in den Verläufen zweier Läufe: Claude Code 2.1.118 (Sonnet, Liste 7711 Zeichen) kürzte jede
// Beschreibung auf rund 150 Zeichen, die KI lud bei «bau mir doch gleich schon mal die Startseite» keinen Skill und baute ohne die zwei Ja.
// Claude Code 2.1.321 mit Sonnet 5.5 (eine Million Token, Liste 29 026 Zeichen) zeigte alle ganz, die KI lud bei «Bau mir eine Webseite
// für meinen Hofladen in Thun.» den Skill lotse, fragte nach und baute nicht. Nach dem Code von 2.1.321 stehen Skills, die nicht mehr ins
// Budget passen, nur mit Namen da (nicht in einem Lauf gemessen). Was eine KI zum Laden bringt, steht darum ganz vorne: der Satz der Person.
export const AUSLOESER: Record<'de' | 'fr' | 'it' | 'en', string> = {
  de: 'bau mir eine Webseite', fr: 'construis-moi un site', it: 'costruiscimi un sito', en: 'build me a website',
};
export const AUSLOESER_SKILLS = ['lotse', 'webseite-planen', 'webseite-bauen'] as const;
export const AUSLOESER_BIS = 150;
/** Beschreibung aus dem Kopf einer SKILL.md: eine Zeile, in '…' (Deutsch), in "…" (Übersetzungen) oder ohne Anführungszeichen. */
export function beschreibung(text: string): string {
  const d = /^description: (.*)$/m.exec(text)?.[1]?.trim() ?? '';
  if (d.length > 1 && d.startsWith("'") && d.endsWith("'")) return d.slice(1, -1).replaceAll("''", "'");
  if (d.length > 1 && d.startsWith('"') && d.endsWith('"')) return d.slice(1, -1).replace(/\\(["\\])/g, '$1');
  return d;
}
export const ausloeserVorne = (text: string, sprache: keyof typeof AUSLOESER): boolean =>
  beschreibung(text).slice(0, AUSLOESER_BIS).toLowerCase().includes(AUSLOESER[sprache].toLowerCase());
