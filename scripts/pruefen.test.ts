// Abgleiche aus scripts/abgleich.ts, die pruefen.ts nutzt: die echten Dateien sind gleich, und jede Abweichung wird rot.
import { expect, test } from 'bun:test';
import { agentsBlock, type Befehle, befehleAusReadme, befehleAusSkill, unterschiede, vorlageGegenSkill } from './abgleich.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const lies = (pfad: string) => Bun.file(wurzel + pfad).text();
const LOTSE = 'plugins/albatros/skills/lotse/SKILL.md';
const SPRACHEN = [['plugins/albatros', 'vorlage'], ['plugins/albatros-fr', 'uebersetzungen/fr/vorlage'],
  ['plugins/albatros-it', 'uebersetzungen/it/vorlage'], ['plugins/albatros-en', 'uebersetzungen/en/vorlage']] as const;
const vorlage = async (ordner: string) =>
  ({ 'AGENTS.md': await lies(`${ordner}/AGENTS.md`), 'CLAUDE.md': await lies(`${ordner}/CLAUDE.md`), 'GEMINI.md': await lies(`${ordner}/GEMINI.md`) });

test('Aktualisieren: README und Lotse (de) haben dieselben vier Zeilen', async () => {
  const readme = befehleAusReadme(await lies('README.md'));
  const lotse = befehleAusSkill(await lies(LOTSE));
  expect(readme?.map((b) => b.ki)).toEqual(['Claude Code', 'Codex', 'Gemini CLI', 'Cursor']);
  if (typeof lotse === 'string' || !readme) throw new Error(String(lotse));
  expect(unterschiede(readme, lotse)).toEqual([]);
});

test('Aktualisieren: anderer Befehl, fehlende KI, fehlender Abschnitt oder fehlende Tabelle werden rot', async () => {
  const readme = await lies('README.md');
  const lotse = befehleAusSkill(await lies(LOTSE)) as Befehle;
  const anders = befehleAusReadme(readme.replace('`npx skills update -g -y`, dann Cursor neu starten', '`npx skills add x`, dann Cursor neu starten'))!;
  expect(unterschiede(anders, lotse)).toEqual(['Cursor: «`npx skills add x`, dann Cursor neu starten», im Lotse «`npx skills update -g -y`, dann Cursor neu starten»']);
  const ohneCodex = befehleAusReadme(readme.replace(/^\| Codex \| `codex plugin marketplace upgrade.*\n/m, ''))!;
  expect(unterschiede(ohneCodex, lotse)).toEqual(['KIs Claude Code, Gemini CLI, Cursor, im Lotse Claude Code, Codex, Gemini CLI, Cursor']);
  expect(befehleAusReadme(readme.replace(/^## Aktualisieren$/m, '## Auffrischen'))).toBeNull();
  expect(befehleAusSkill('# Lotse\n\nOhne Tabelle.\n')).toBe('0 Tabellen «| KI | Befehle |», erwartet genau eine');
});

test('Aktualisieren: die README wird gelesen wie in albatros (Tabelle unter der ersten Überschrift mit «Aktualisieren»)', () => {
  // dasselbe Beispiel wie in albatros packages/kit/src/phasen.test.ts für aktualisierenAus
  const readme = '# Albatros\n\n## Installation\n\n| KI | Befehle |\n|---|---|\n| Codex | `codex plugin add albatros@albatros` |\n\n## Aktualisieren\n\nText.\n\n| KI | Befehle |\n|---|---|\n| Claude Code | `claude plugin update albatros@albatros` |\n| Cursor | `npx skills add x` |\n\n## Sprachen\n\n| Sprache | x |\n|---|---|\n| Deutsch | y |\n';
  expect(befehleAusReadme(readme)).toEqual([{ ki: 'Claude Code', befehle: '`claude plugin update albatros@albatros`' }, { ki: 'Cursor', befehle: '`npx skills add x`' }]);
  expect(befehleAusReadme('# Albatros\n\n## Installation\n')).toBeNull();
});

test('Vorlage je Sprache: AGENTS.md gleich dem Block in webseite-planen, CLAUDE.md und GEMINI.md mit Zeile aus dem Skill und Verweis', async () => {
  for (const [plugin, ordner] of SPRACHEN) {
    const skill = await lies(`${plugin}/skills/webseite-planen/SKILL.md`);
    expect(agentsBlock(skill)?.startsWith('# ')).toBe(true);
    expect([ordner, vorlageGegenSkill(skill, await vorlage(ordner))]).toEqual([ordner, []]);
  }
});

test('Vorlage: geänderte Zeile, fehlende Datei, fremde erste Zeile oder falscher Verweis werden rot', async () => {
  const skill = await lies('plugins/albatros/skills/webseite-planen/SKILL.md');
  const echt = await vorlage('vorlage');
  const zeile = echt['AGENTS.md'].split('\n').findIndex((z) => z.includes('Preise nur aus')) + 1;
  expect(zeile).toBeGreaterThan(1);
  expect(vorlageGegenSkill(skill, { ...echt, 'AGENTS.md': echt['AGENTS.md'].replace('Preise nur aus', 'Preise aus') }))
    .toEqual([`AGENTS.md anders als der Block in webseite-planen, erste Abweichung in Zeile ${zeile}`]);
  expect(vorlageGegenSkill(skill, { ...echt, 'GEMINI.md': null })).toEqual(['GEMINI.md fehlt']);
  expect(vorlageGegenSkill(skill, { ...echt, 'CLAUDE.md': 'Lies AGENTS.md.\n\n@AGENTS.md\n' })).toEqual(['CLAUDE.md: die erste Zeile «Lies AGENTS.md.» steht nicht in webseite-planen']);
  expect(vorlageGegenSkill(skill, { ...echt, 'GEMINI.md': echt['GEMINI.md'].replace('@./AGENTS.md', '@AGENTS.md') })).toEqual(['GEMINI.md: letzte Zeile muss @./AGENTS.md sein']);
  expect(vorlageGegenSkill(skill.replace('**`AGENTS.md`**', '`AGENTS.md`'), echt)).toEqual(['Block «**`AGENTS.md`**» mit ```markdown fehlt in webseite-planen']);
});
