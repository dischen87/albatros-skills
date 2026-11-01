// Prüfung der Abschnittsnamen (scripts/abschnitte.ts, Schnittstellen Welle 5 §5): gefunden wird nur, was in einer Überschrift steht,
// übersetzt mit dem deutschen Namen in Klammern; jede Lücke wird rot, mit Datei und Quelle.
import { expect, test } from 'bun:test';
import { abschnitteImFahrplan, abschnittsnamen, findet, type PhaseMitAbschnitt, type Skills, ueberschriften, verweiseIn } from './abschnitte.ts';

const skills = (de: Record<string, string>, fr: Record<string, string> = {}, it: Record<string, string> = {}, en: Record<string, string> = {}): Skills => ({
  de: new Map(Object.entries(de)), fr: new Map(Object.entries(fr)), it: new Map(Object.entries(it)), en: new Map(Object.entries(en)),
});

// 01.11.2026 (w6-45): Fette Anfänge zählen nicht mehr als Überschrift; vorher erwartete dieser Test sie in der Liste ('Selbst, ohne Repo:',
// 'Mit Eingang:', 'Nur so'). Das gab falsches Grün (Mutation der Gegenprobe texte-b, Test unten).
test('Überschriften: nur Zeilen mit #, ohne fette Anfänge, ohne Codeblöcke und ohne `…`', () => {
  const text = '# Titel\n\n## Freigabe\n\nText mit **fett** mitten drin.\n\n**Selbst, ohne Repo:** Du lädst hoch.\n- **Mit Eingang:** …\n1. **Nur so** geht es\n\n```markdown\n## Im Codeblock\n```\n\n### 6. Validation : la visite (`schritt: freigabe`)\n';
  expect(ueberschriften(text)).toEqual(['Titel', 'Freigabe', '6. Validation : la visite ( )']);
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
    // 01.11.2026 (w6-45): vorher «**Approval (Freigabe):** …» als fetter Anfang; zählt nicht mehr, nur eine #-Überschrift
    { entwurf: '# Draft\n\n### Approval (Freigabe)\n\nOnly with a clear yes.\n' },
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

// Welle 6, w6-45 (01.11.2026): Die Prüfung gab falsches Grün. Fette Listenanfänge zählten als Überschrift, und ein Name zählte auch als
// Teilwort («P8 «Freigabe zum Bauen»», «Nach der Freigabe still weiter ändern»). Mutation der Gegenprobe texte-b (Welle 5, mutation.ts):
// «## Freigabe» → «## Zustimmung» in entwurf blieb grün. Jetzt zählen nur #-Überschriften, als ganzer Kopf oder als «(Name)».
test('Mutation der Gegenprobe: «## Freigabe» → «## Zustimmung» im echten entwurf (de) wird rot', async () => {
  const wurzel = new URL('..', import.meta.url).pathname;
  const { ladeFahrplan } = await import('./fahrplan.ts');
  const plan = await ladeFahrplan(wurzel);
  if (!plan.ok) throw new Error(plan.fehler.join('\n'));
  const echt: Skills = { de: new Map(), fr: new Map(), it: new Map(), en: new Map() };
  for (const [s, ordner] of [['de', 'albatros'], ['fr', 'albatros-fr'], ['it', 'albatros-it'], ['en', 'albatros-en']] as const)
    for (const d of new Bun.Glob(`plugins/${ordner}/skills/*/SKILL.md`).scanSync(wurzel)) echt[s].set(d.split('/').at(-2)!, await Bun.file(wurzel + d).text());
  const abschnitte = abschnitteImFahrplan(plan.fahrplan);
  expect(abschnittsnamen(echt, abschnitte)).toEqual([]);
  const entwurf = echt.de.get('entwurf')!;
  expect(entwurf).toContain('\n## Freigabe\n');
  echt.de.set('entwurf', entwurf.replace('\n## Freigabe\n', '\n## Zustimmung\n'));
  expect(abschnittsnamen(echt, abschnitte).filter((f) => f.startsWith('plugins/albatros/skills/entwurf/SKILL.md: keine Überschrift mit «Freigabe»'))).toHaveLength(1);
});

test('nur #-Überschriften, als ganzer Kopf oder «(Name)»: fette Anfänge und Teilwörter zählen nicht', () => {
  const koepfe = (text: string) => ueberschriften(text);
  // ganzer Kopf: ohne Nummer, ohne «Teil 2: », ohne Klammern am Ende, ohne Untertitel nach «: »
  expect(findet(koepfe('### 6. Freigabe: die Begehung (`schritt: freigabe`)'), 'Freigabe')).toBe(true);
  expect(findet(koepfe('## Teil 2: Live schalten (Phase P13, `schritt: hafen`, `live`)'), 'Live schalten')).toBe(true);
  expect(findet(koepfe('## 6. Strapi : le grand CMS'), 'Strapi')).toBe(true);
  expect(findet(koepfe('## Direkt vom Computer ins Netz (directement de l\'ordinateur sur Internet)'), 'Direkt vom Computer ins Netz')).toBe(true);
  expect(findet(koepfe('#### Selbst, ohne Repo'), 'Selbst, ohne Repo')).toBe(true);
  expect(findet(koepfe('## Partie 2 : la mise en ligne (Live schalten) (phase P13, `schritt: hafen`)'), 'Live schalten')).toBe(true);
  // nicht: fett statt #, Teilwort, Name nur im Untertitel oder in längeren Klammern
  expect(findet(koepfe('- **P8 «Freigabe zum Bauen»** (Abschnitt «Freigabe»): die Frage'), 'Freigabe')).toBe(false);
  expect(findet(koepfe('- **Nach der Freigabe still weiter ändern:** Jede Änderung'), 'Freigabe')).toBe(false);
  expect(findet(koepfe('**Selbst, ohne Repo:** Du lädst `seite/` hoch.'), 'Selbst, ohne Repo')).toBe(false);
  expect(findet(koepfe('## Die Freigabe der Seite'), 'Freigabe')).toBe(false);
  expect(findet(koepfe('## Begehung: die Freigabe'), 'Freigabe')).toBe(false);
  expect(findet(koepfe('## Autorisation (Freigabe zum Bauen)'), 'Freigabe')).toBe(false);
});
