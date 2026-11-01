// Abgleiche aus scripts/abgleich.ts, die pruefen.ts nutzt: die echten Dateien sind gleich, und jede Abweichung wird rot.
import { expect, test } from 'bun:test';
import { Glob } from 'bun';
import { agentsBlock, type Befehle, befehleAusReadme, befehleAusSkill, bozzaApprovata, titelAusweg, unterschiede, vorlageGegenSkill } from './abgleich.ts';

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

// Welle 6, w6-52 (01.11.2026): Die Vorlage nannte schritt_melden ohne titel; der lotse und webseite-planen geben titel bei jedem
// schritt_melden mit (Wert der Zeile «Projektname:»), damit die Insel das Haus mit dem Namen des Projekts zeigt. Vorlage und Block in
// webseite-planen sind gleich (Test oben); hier: Die Regel nennt titel, in jeder Sprache.
test('Vorlage je Sprache: die Regel nach jedem Schritt nennt schritt_melden mit titel aus «Projektname:»', async () => {
  for (const [, ordner] of SPRACHEN) {
    const regel = (await lies(`${ordner}/AGENTS.md`)).split('\n').filter((z) => z.includes('`schritt_melden`') && z.includes('`Stand:`'));
    expect([ordner, regel.length]).toEqual([ordner, 1]);
    expect([ordner, regel[0]!.includes('`titel`') && regel[0]!.includes('`Projektname:`')]).toEqual([ordner, true]);
  }
});

// Welle 6, w6-52 (01.11.2026): Das Gerüst der Evals (plugins/albatros/evals/_projekt/projekt.sh) legt AGENTS.md so an, wie webseite-planen
// es in P1 schreibt, also gleich wie vorlage/AGENTS.md. Ändert sich die Vorlage, zieht das Gerüst mit.
test('Gerüst der Evals: AGENTS.md in projekt.sh ist gleich wie vorlage/AGENTS.md', async () => {
  const sh = await lies('plugins/albatros/evals/_projekt/projekt.sh');
  const agents = /cat > AGENTS\.md <<'EOF'\n([\s\S]*?\n)EOF\n/.exec(sh)?.[1];
  expect(agents).toBe(await lies('vorlage/AGENTS.md'));
});

// Welle 7, w7-21 (01.11.2026): mcp lehnt titel mit Zeilenumbruch oder über 300 Zeichen mit «Ungültige Angaben» ab und meldet den Schritt dann
// nicht; webseite-planen sagte «geht es ohne Insel weiter», und der Schritt fehlte. Jeder Skill, der titel nennt, sagt den Ausweg.
test('titel bei schritt_melden: jeder Skill, der ihn nennt, sagt in seiner Sprache, dass der Schritt dann ohne titel nochmals kommt', async () => {
  const mitTitel: string[] = [];
  for (const d of new Glob('plugins/*/skills/*/SKILL.md').scanSync(wurzel)) {
    const text = await lies(d);
    if (!text.includes('`titel`')) continue;
    mitTitel.push(d.split('/').slice(1, 4).join('/'));
    expect([d, titelAusweg(d, text)]).toEqual([d, null]);
  }
  expect(mitTitel.sort()).toEqual(['albatros', 'albatros-en', 'albatros-fr', 'albatros-it']
    .flatMap((p) => ['lotse', 'webseite-modernisieren', 'webseite-planen'].map((s) => `${p}/skills/${s}`)).sort());
  // rot: der Satz fehlt, oder er steht in einer anderen Sprache
  expect(titelAusweg('plugins/albatros/skills/lotse/SKILL.md', 'Bei jedem `schritt_melden` gibst du `titel` mit.')).toContain('nochmals ohne `titel`');
  expect(titelAusweg('plugins/albatros-fr/skills/lotse/SKILL.md', '`schritt_melden` avec `titel`; sonst nochmals ohne `titel`.')).toContain('nochmals sans `titel`');
  expect(titelAusweg('plugins/albatros-en/skills/x/SKILL.md', '`schritt_melden` with `titel`, else again without `titel`.')).toBeNull();
  expect(titelAusweg('plugins/albatros/skills/gestaltung/SKILL.md', '`schritt_melden` mit `schritt: mockup`.')).toBeNull();
});

// Sichtung Welle 7, sicht-08 (01.11.2026): GLOSSAR.md trennt «via libera per costruire» (P8) von «approvazione» (P10)
test('Italienisch: die Bozza hat den via libera, nie «approvata»; die Skills halten sich daran', async () => {
  for (const d of new Glob('plugins/albatros-it/skills/*/SKILL.md').scanSync(wurzel)) expect([d, bozzaApprovata(d, await lies(d))]).toEqual([d, []]);
  const it = 'plugins/albatros-it/skills/webseite-bauen/SKILL.md';
  for (const rot of ['### 0. Prima di costruire: la bozza è approvata?', 'git commit -m "Bozza approvata: piano, concetto, bozza"',
    'È ricavato dalla bozza approvata: la persona ha già firmato.', 'La bozza è il modello in cui si può entrare, e la persona l\'ha approvato.'])
    expect([rot, bozzaApprovata(it, rot).length]).toEqual([rot, 1]);
  for (const gruen of ['### 0. Prima di costruire: la bozza ha il via libera?', 'Il sito approvato va online.', 'La bozza è pronta. Il sito è approvato in P10.'])
    expect([gruen, bozzaApprovata(it, gruen)]).toEqual([gruen, []]);
  // Nur Italienisch: «approvata» kommt in anderen Sprachen nicht vor, «approved draft» ist im Englischen richtig (approval to build)
  expect(bozzaApprovata('plugins/albatros-en/skills/webseite-bauen/SKILL.md', 'bozza approvata')).toEqual([]);
});
