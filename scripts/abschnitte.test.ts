// Prüfung der Abschnittsnamen (scripts/abschnitte.ts, Schnittstellen Welle 5 §5): gefunden wird nur, was in einer Überschrift steht,
// übersetzt mit dem deutschen Namen in Klammern; jede Lücke wird rot, mit Datei und Quelle.
import { expect, test } from 'bun:test';
import { abschnitteImFahrplan, abschnittsnamen, findet, type PhaseMitAbschnitt, type Skills, ueberschriften, verweiseIn } from './abschnitte.ts';

const skills = (de: Record<string, string>, fr: Record<string, string> = {}, it: Record<string, string> = {}, en: Record<string, string> = {}): Skills => ({
  de: new Map(Object.entries(de)), fr: new Map(Object.entries(fr)), it: new Map(Object.entries(it)), en: new Map(Object.entries(en)),
});

test('Überschriften: # und fette Anfänge, ohne Codeblöcke und ohne `…`', () => {
  const text = '# Titel\n\n## Freigabe\n\nText mit **fett** mitten drin.\n\n**Selbst, ohne Repo:** Du lädst hoch.\n- **Mit Eingang:** …\n1. **Nur so** geht es\n\n```markdown\n## Im Codeblock\n```\n\n### 6. Validation : la visite (`schritt: freigabe`)\n';
  expect(ueberschriften(text)).toEqual(['Titel', 'Freigabe', 'Selbst, ohne Repo:', 'Mit Eingang:', 'Nur so', '6. Validation : la visite ( )']);
});

test('findet: ganzes Stück, gross und klein egal, auch in Klammern und mit schmalem Leerzeichen', () => {
  expect(findet(['Autorisation (Freigabe)'], 'Freigabe')).toBe(true);
  expect(findet(['Research'], 'Research')).toBe(true);
  expect(findet(['7. Une entrée pour tout ?'], 'Une entrée pour tout ?')).toBe(true);
  expect(findet(['Autorisation'], 'Freigabe')).toBe(false);
  expect(findet(['Freigabezeit'], 'Freigabe')).toBe(false);
  // Was in `…` steht, zählt nicht: «(`schritt: freigabe`)» ist kein Abschnitt Freigabe
  expect(findet(ueberschriften('### 6. Validation : la visite (`schritt: freigabe`)'), 'Freigabe')).toBe(false);
});

test('Verweise: die Formen aus den deutschen Skills, ohne Zitate, Vorlagen und Verweise auf sich selbst', () => {
  const text = [
    'Kriterien im Skill `bausteine`, Abschnitt «Ein Eingang für alles?», erfüllt.',
    'zurück zum Skill `entwurf` (Abschnitt «Freigabe»), ohne Entwurf',
    'steht im Skill `lancieren`, Teil 2, «Selbst, mit GitHub» und «Selbst, ohne Repo».',
    'wie im Skill `lancieren`, Teil 2, Schritt 4 («Nach drei Minuten noch nicht da»).',
    'wie im Skill `bausteine`, Abschnitt 4 «Beim Lancieren, mit Pilot»: zuerst',
    'Skill `recht-ch`, «Cookies und Statistik»; Skill `entwurf`, Schritt «Die Texte»',
    'Danach folgt der Abschnitt «Plan prüfen» in `webseite-planen`.',
    'bei «selbst» verbindest du sie (Skill `domain`, bei «selbst»), Skill `landung`, Umzugsliste «Was ich selbst übernehme»',
    'meldest `entwurf` (Abschnitt «Die Insel») und Skill `betrieb`, Abschnitt «Eigenes»',
    '```markdown',
    'Skill `gestaltung`, Abschnitt «Nur im Codeblock»',
    '```',
  ].join('\n');
  expect(verweiseIn(text, 'betrieb').map((v) => `${v.ziel} «${v.name}»`)).toEqual([
    'bausteine «Ein Eingang für alles?»', 'entwurf «Freigabe»', 'lancieren «Selbst, mit GitHub»', 'lancieren «Selbst, ohne Repo»',
    'lancieren «Nach drei Minuten noch nicht da»', 'bausteine «Beim Lancieren, mit Pilot»', 'recht-ch «Cookies und Statistik»',
    'entwurf «Die Texte»', 'webseite-planen «Plan prüfen»',
  ]);
});

test('Abschnitte aus dem Fahrplan, auch aus der Variante modernisieren', () => {
  const phasen: PhaseMitAbschnitt[] = [
    { id: 'P2', skill: 'webseite-planen', abschnitt: 'Research', varianten: { modernisieren: { skill: 'webseite-modernisieren', abschnitt: 'Bestandsaufnahme' } } },
    { id: 'P4', skill: 'webseite-planen', abschnitt: 'Plan prüfen', varianten: { modernisieren: { zusatz: 'Keine Funktion geht verloren.' } } },
    { id: 'P9', skill: 'webseite-bauen' },
  ];
  expect(abschnitteImFahrplan({ phasen })).toEqual([
    { ziel: 'webseite-planen', name: 'Research', von: 'lage, P2' },
    { ziel: 'webseite-modernisieren', name: 'Bestandsaufnahme', von: 'lage, P2 modernisieren' },
    { ziel: 'webseite-planen', name: 'Plan prüfen', von: 'lage, P4' },
  ]);
});

test('abschnittsnamen: grün, wenn jede Sprache den Namen in einer Überschrift trägt', () => {
  const s = skills(
    { entwurf: '# Entwurf\n\n## Freigabe\n', 'webseite-bauen': '# Bauen\n\nzurück zum Skill `entwurf` (Abschnitt «Freigabe»).\n' },
    { entwurf: '# Ébauche\n\n## Autorisation (Freigabe)\n' },
    { entwurf: '# Bozza\n\n## Via libera (Freigabe)\n' },
    { entwurf: '# Draft\n\n**Approval (Freigabe):** only with a clear yes\n' },
  );
  expect(abschnittsnamen(s, [{ ziel: 'entwurf', name: 'Freigabe', von: 'lage, P8' }])).toEqual([]);
});

test('abschnittsnamen: rot je Datei, mit allen Quellen; eine fehlende Übersetzung meldet eine andere Prüfung', () => {
  const s = skills(
    { entwurf: '# Entwurf\n\n## Freigabe\n', 'webseite-bauen': '# Bauen\n\nzurück zum Skill `entwurf` (Abschnitt «Freigabe»), dann Skill `lancieren`, Abschnitt «Live schalten».\n' },
    { entwurf: '# Ébauche\n\n## Autorisation\n\n```\n## Autorisation (Freigabe)\n```\n' },
    { entwurf: '# Bozza\n\nIl via libera (Freigabe) viene dopo.\n' },
    {},
  );
  expect(abschnittsnamen(s, [{ ziel: 'entwurf', name: 'Freigabe', von: 'lage, P8' }])).toEqual([
    'plugins/albatros-fr/skills/entwurf/SKILL.md: keine Überschrift mit «Freigabe» oder «(Freigabe)», zum Beispiel «## <übersetzt> (Freigabe)» (lage, P8; Verweis in webseite-bauen)',
    'plugins/albatros-it/skills/entwurf/SKILL.md: keine Überschrift mit «Freigabe» oder «(Freigabe)», zum Beispiel «## <übersetzt> (Freigabe)» (lage, P8; Verweis in webseite-bauen)',
    'plugins/albatros/skills/lancieren/SKILL.md fehlt, aber «Live schalten» wird dort gesucht (Verweis in webseite-bauen)',
  ]);
});

test('abschnittsnamen: auch die deutsche Überschrift muss es geben', () => {
  const s = skills({ entwurf: '# Entwurf\n\n## Unterschrift\n' }, { entwurf: '## Autorisation (Freigabe)\n' }, { entwurf: '## Via libera (Freigabe)\n' }, { entwurf: '## Approval (Freigabe)\n' });
  expect(abschnittsnamen(s, [{ ziel: 'entwurf', name: 'Freigabe', von: 'lage, P8' }])).toEqual(['plugins/albatros/skills/entwurf/SKILL.md: keine Überschrift mit «Freigabe» (lage, P8)']);
});
