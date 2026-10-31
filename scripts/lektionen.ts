// Lektionen je Phase (Fund anf-04 der Gegenprüfung, 31.10.2026), für pruefen.ts. Im Modus lernen stellt die KI am Ende jeder Phase mit
// Lernmomenten die Kontrollfrage der Lektion und meldet danach verstanden_melden mit der Mission (fahrplan.yaml, modus.lernen). Als Lektion
// nennt lage (albatros services/mcp/src/lage.ts, lektion()) jede nicht freiwillige Mission der Phase auf dem Weg flugschule oder dem Weg
// der Person, für Light ohne die Missionen mit abo: pilot. Darum braucht jede Phase mit lernmomente je Weg mindestens eine solche Mission
// mit verstehen; sonst gibt es dort keine Kontrollfrage, kein «verstanden» und keinen Eintrag im Flugbuch.
export type LektionsMission = { id: string; weg: string; phase?: string; optional?: boolean; abo?: string; verstehen?: unknown[] };
export type LernPhase = { id: string; lernmomente?: string[] };
export const LERN_WEGE = ['webseite', 'geschaeft'] as const;

// Lektion mit Kontrollfrage, die lage auf diesem Weg jeder Person zeigt (auch mit Light)
export const istLektion = (m: LektionsMission, phase: string, weg: string) =>
  m.phase === phase && !m.optional && (m.weg === 'flugschule' || m.weg === weg) && m.abo !== 'pilot' && (m.verstehen?.length ?? 0) > 0;

export function lektionenFehlen(phasen: LernPhase[], missionen: LektionsMission[]): string[] {
  return phasen.filter((p) => p.lernmomente?.length).flatMap((p) => LERN_WEGE
    .filter((weg) => !missionen.some((m) => istLektion(m, p.id, weg)))
    .map((weg) => `${p.id} hat Lernmomente, aber auf dem Weg ${weg} keine Lektion mit Kontrollfrage: Es braucht eine Mission mit phase: ${p.id} `
      + `und verstehen, ohne optional: true und ohne abo: pilot, unter missionen/flugschule/ oder missionen/${weg}/`));
}
