// Regeln aus scripts/missionsverweise.ts, die pruefen.ts nutzt (Welle 6, w6-40, 01.11.2026): die echten Skills erfüllen sie in vier
// Sprachen, und jeder falsche Verweis auf eine Mission wird rot.
import { expect, test } from 'bun:test';
import { Glob } from 'bun';
import { bloecke, ladeFragen, missionsverweise, type Fragen, type SkillText, type VerweisMission } from './missionsverweise.ts';

const wurzel = new URL('..', import.meta.url).pathname;
const missionen = async () => {
  const ms: VerweisMission[] = [];
  for (const d of new Glob('missionen/*/*.md').scanSync(wurzel))
    ms.push(Bun.YAML.parse((await Bun.file(wurzel + d).text()).match(/^---\n([\s\S]*?)\n---/)![1]!) as VerweisMission);
  return ms;
};
const skills = async () => {
  const s: SkillText[] = [];
  for (const datei of new Glob('plugins/*/skills/*/SKILL.md').scanSync(wurzel))
    s.push({ datei, slug: datei.split('/').at(-2)!, text: await Bun.file(wurzel + datei).text() });
  return s;
};

test('echte Skills in vier Sprachen: verstanden_melden, Kontrollfragen und mission_pruefen zeigen auf die Lektionen', async () => {
  const s = await skills();
  expect(s.length).toBe(4 * 27);
  // Kontrollfragen aus missionen/ und uebersetzungen/<sprache>/missionen/; jede Lektion hat sie in jeder Sprache (sonst prüft Regel 6 nichts)
  const fragen = await ladeFragen(wurzel);
  const lektionen = (await missionen()).filter((m) => !m.optional && (m.verstehen?.length ?? 0) > 0);
  for (const sprache of ['de', 'fr', 'it', 'en'])
    for (const m of lektionen) expect([sprache, m.id, fragen[sprache]?.get(m.id)?.length]).toEqual([sprache, m.id, m.verstehen!.length]);
  expect(missionsverweise(s, await missionen(), fragen)).toEqual([]);
});

test('echte Skills: gestaltung und webseite-bauen nennen ihre Lektionen flugschule-19, -20 und -21 in jeder Sprache', async () => {
  for (const { datei, slug, text } of await skills()) {
    if (slug === 'gestaltung') expect([datei, text.includes('flugschule-19-musterblatt')]).toEqual([datei, true]);
    if (slug === 'webseite-bauen')
      expect([datei, text.includes('flugschule-20-logbuch-eintrag') && text.includes('flugschule-21-text-aendern')]).toEqual([datei, true]);
  }
});

const FRAGE = [{ frage: 'Warum?', kern: 'Darum.' }];
const MS: VerweisMission[] = [
  { id: 'flugschule-19-musterblatt', weg: 'flugschule', phase: 'P6', skill: 'gestaltung', verstehen: FRAGE },
  { id: 'webseite-04-gestaltung', weg: 'webseite', phase: 'P6', skill: 'gestaltung', optional: true },
  { id: 'flugschule-17-betrieb', weg: 'flugschule', phase: 'P12', skill: 'betrieb', verstehen: FRAGE },
  { id: 'flugschule-06-zurueck-auf-gestern', weg: 'flugschule', phase: 'P12', skill: 'zurueck-auf-gestern', abo: 'pilot' },
  { id: 'flugschule-09-domain', weg: 'flugschule', phase: 'P13', skill: 'domain', optional: true },
];
const gut = 'Im Modus `lernen` (danach `verstanden_melden` mit `mission: flugschule-19-musterblatt` und `art: selbst`).\n\n'
  + '`mission_pruefen` mit `flugschule-19-musterblatt`, auf dem Weg Webseite freiwillig auch `webseite-04-gestaltung`.\n';
const gestaltung = (text: string): SkillText => ({ datei: 'plugins/albatros/skills/gestaltung/SKILL.md', slug: 'gestaltung', text });

test('gute Verweise: Lektion bei verstanden_melden, Pflicht zuerst, freiwillige Zusatzmission danach', () => {
  expect(missionsverweise([gestaltung(gut)], MS)).toEqual([]);
  // Eine andere Mission auf derselben Zeile wie verstanden_melden ist erlaubt (betrieb: Übung in zurueck-auf-gestern, gemeldet auf 17)
  const betrieb = 'Mit Pilot: die Übung im Skill `zurueck-auf-gestern` (Mission `flugschule-06-zurueck-auf-gestern`). Danach `verstanden_melden` '
    + '(Mission `flugschule-17-betrieb`, Art `selbst`). `mission_pruefen` mit `flugschule-17-betrieb`.';
  expect(missionsverweise([{ datei: 'b', slug: 'betrieb', text: betrieb }], MS)).toEqual([]);
  // Ein Skill, dessen Missionen alle freiwillig sind, prüft seine freiwillige Mission
  expect(missionsverweise([{ datei: 'd', slug: 'domain', text: '`mission_pruefen` mit `flugschule-09-domain`.' }], MS)).toEqual([]);
});

test('verstanden_melden auf einer freiwilligen Mission oder einer ohne verstehen wird rot, in jeder Sprache', () => {
  const faelle = [
    'danach `verstanden_melden` mit `mission: webseite-04-gestaltung` und `art: selbst`',
    'ensuite `verstanden_melden` avec `mission: webseite-04-gestaltung` et `art: selbst`',
    'meldest du mit `verstanden_melden` (Mission `webseite-04-gestaltung`, Art `selbst`)',
    'tu annonces `verstanden_melden` (mission `webseite-04-gestaltung`, type `selbst`)',
    'segnali `verstanden_melden` (missione `webseite-04-gestaltung`, tipo `selbst`)',
    'you report `verstanden_melden` (mission `webseite-04-gestaltung`, kind `selbst`)',
    'stellst du die Kontrollfragen der Mission `webseite-04-gestaltung` (`mission_holen`) und meldest `verstanden_melden`',
    'tu poses la question de contrôle de la leçon `webseite-04-gestaltung` :',
    'you ask the check question of the lesson `flugschule-06-zurueck-auf-gestern`:',
  ];
  for (const f of faelle) {
    const r = missionsverweise([gestaltung(`${gut}\n${f}\n`)], MS);
    // Seit 01.11.2026 meldet die Form «(`mission_holen`)» in einem Satz mit Kontrollfragen zusätzlich die Quelle (Regel 5): dort zwei Meldungen
    const holen = f.includes('(`mission_holen`)') ? 1 : 0;
    expect([f, r.length]).toEqual([f, 1 + holen]);
    expect(r[0]).toContain('aber lage nennt sie nie als Lektion');
  }
});

test('mission_pruefen zuerst mit der freiwilligen Mission, obwohl der Skill eine Pflicht-Mission hat, wird rot', () => {
  const r = missionsverweise([gestaltung(gut.replace('`mission_pruefen` mit `flugschule-19-musterblatt`', '`mission_pruefen` mit `webseite-04-gestaltung`'))], MS);
  expect(r).toEqual(['plugins/albatros/skills/gestaltung/SKILL.md:3: mission_pruefen nennt zuerst die freiwillige Mission «webseite-04-gestaltung»; '
    + 'zuerst die Pflicht (flugschule-19-musterblatt), freiwillige Zusatzmissionen danach']);
});

test('eine Lektion, die ihr Skill nicht nennt, und eine unbekannte Mission werden rot', () => {
  expect(missionsverweise([gestaltung('Kein Verweis.\n')], MS)).toEqual([
    'plugins/albatros/skills/gestaltung/SKILL.md: nennt die Lektion «flugschule-19-musterblatt» (skill: gestaltung) nicht; dort meldet die KI verstanden und prüft die Mission',
  ]);
  expect(missionsverweise([gestaltung(`${gut}Siehe \`flugschule-99-gibts-nicht\`.\n`)], MS))
    .toEqual(['plugins/albatros/skills/gestaltung/SKILL.md:4: Mission «flugschule-99-gibts-nicht» gibt es nicht in missionen/']);
});

// Regel 5 (Nachbesserung texte, 01.11.2026): mission_holen zeigt die nächste offene Mission, nicht die Lektion; nach dem letzten Schritt der
// Phase schon die nächste Phase, mit Light oder Pilot in P11 bis P13 oft schon vorher eine ohne Kontrollfrage (lauf3/mission-holen-aktuell.log)
test('Kontrollfragen «(`mission_holen`)» werden rot, in jeder Sprache; mission_holen ohne Kontrollfrage oder nur erwähnt bleibt grün', () => {
  const rot = [
    'Im Modus `lernen` stellst du jetzt die Kontrollfrage der Mission `flugschule-19-musterblatt` (`mission_holen`) und meldest erst danach.',
    'À la fin de la phase, tu poses la question de contrôle de la leçon : la mission de la phase la donne sous « verstehen » (`mission_holen`) ; si tu n\'en trouves pas…',
    'Nel modo `lernen` fai le domande di controllo della missione `flugschule-19-musterblatt` (`mission_holen`) e segnali…',
    '7. Report `freigabe`. In `lernen` mode you now ask the check questions of the mission `flugschule-19-musterblatt` (`mission_holen`) and only…',
  ];
  for (const f of rot) {
    const r = missionsverweise([gestaltung(`${gut}\n${f}\n`)], MS);
    expect([f, r]).toEqual([f, [expect.stringContaining('Kontrollfragen aus mission_holen')]]);
  }
  const gruen = [
    'Die aktuelle Mission zeigt dir das Werkzeug (`mission_holen`).',
    'Nach dem letzten Schritt zeigt `lage` schon die nächste Phase, und `mission_holen` zeigt nur die nächste offene Mission, oft eine ohne Kontrollfrage.',
  ];
  for (const f of gruen) expect([f, missionsverweise([gestaltung(`${gut}\n${f}\n`)], MS)]).toEqual([f, []]);
  // Der Absatz zählt, nicht die Zeile: ein Listenpunkt mit Kontrollfrage, ein anderer mit mission_holen
  expect(missionsverweise([gestaltung(`${gut}\n- Am Ende die Kontrollfrage.\n- Die Mission (\`mission_holen\`).\n`)], MS)).toEqual([]);
  expect(bloecke('a\nb\n\n- c\n  d\n- e\n# f\ng').map((b) => b.text)).toEqual(['a\nb', '- c\n  d', '- e', '# f\ng']);
});

// Regel 6 (01.11.2026): Steht eine Kontrollfrage wörtlich hinter «Lektion `id`», ist sie eine Frage dieser Lektion in der Sprache des Skills
test('Kontrollfragen im Skill: wörtlich wie in der Mission derselben Sprache, sonst rot', () => {
  const fragen: Fragen = {
    de: new Map([['flugschule-19-musterblatt', ['Warum stehen Farben und Schriften deiner Seite nur an einem Ort?']]]),
    fr: new Map([['flugschule-19-musterblatt', ["Pourquoi les couleurs et les polices de ton site ne sont-elles qu'à un seul endroit ?"]]]),
  };
  const fr = (text: string): SkillText => ({ datei: 'plugins/albatros-fr/skills/gestaltung/SKILL.md', slug: 'gestaltung', text });
  const wort = 'Am Ende stellst du die Kontrollfragen der Lektion `flugschule-19-musterblatt`: «Warum stehen Farben und Schriften deiner Seite nur an einem Ort?»';
  expect(missionsverweise([gestaltung(`${gut}\n${wort}\n`)], MS, fragen)).toEqual([]);
  // Französische Typografie: geschützte Leerzeichen (U+202F, U+00A0) zählen wie ein Leerzeichen
  const frWort = "tu poses les questions de contrôle de la leçon `flugschule-19-musterblatt`\u202f: «\u202fPourquoi les couleurs et les polices de ton site ne sont-elles qu'à un seul\u00a0endroit\u202f?\u202f»";
  expect(missionsverweise([fr(`${gut}\n${frWort}\n`)], MS, fragen)).toEqual([]);
  // Ein Zitat ohne Fragezeichen ist keine Kontrollfrage
  expect(missionsverweise([gestaltung(`${gut}\nZur Lektion \`flugschule-19-musterblatt\` gehört das Bild «Farbfächer».\n`)], MS, fragen)).toEqual([]);
  const rot = [
    [gestaltung(`${gut}\nKontrollfragen der Lektion \`flugschule-19-musterblatt\`, etwa «Warum stehen Farben und Schriften nur an einem Ort?»\n`)], // umformuliert
    [fr(`${gut}\nla question de contrôle de la leçon \`flugschule-19-musterblatt\` : « Warum stehen Farben und Schriften deiner Seite nur an einem Ort? »\n`)], // falsche Sprache
    [{ datei: 'plugins/albatros-en/skills/gestaltung/SKILL.md', slug: 'gestaltung', text: `${gut}\nthe check questions of the lesson \`flugschule-19-musterblatt\`: “Why?”\n` }],
  ] as SkillText[][];
  expect(missionsverweise(rot[0]!, MS, fragen)).toEqual([expect.stringContaining('steht so nicht in der Lektion «flugschule-19-musterblatt» (de)')]);
  expect(missionsverweise(rot[1]!, MS, fragen)).toEqual([expect.stringContaining('steht so nicht in der Lektion «flugschule-19-musterblatt» (fr)')]);
  // Ohne Fragen für eine Sprache (hier en) prüft Regel 6 dort nichts; der Test der echten Skills verlangt sie für alle vier Sprachen
  expect(missionsverweise(rot[2]!, MS, fragen)).toEqual([]);
});
