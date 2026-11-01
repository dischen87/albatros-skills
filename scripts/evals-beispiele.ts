// Beispiel-Verläufe für evals.test.ts: je Fall ein guter Verlauf, den jeder Grader ohne Modell durchlässt, und schlechte, die genau die
// genannten Grader erkennen müssen (faellt). Die Dateien sind, was die KI schreibt; das Gerüst des Falls (scaffold.sh) liegt darunter.
// Erfunden, aber nach den Skills: so sieht ein guter Lauf aus, so die typischen Fehler (zu weit gemeldet, erfunden, ohne Ja gebaut).
import type { Verlauf } from './bewertung.ts';

export type Beispiele = { gut: Verlauf; schlecht: (Verlauf & { faellt: string[] })[] };

// Bausteine, die viele Fälle teilen
const LOTSE = { tool: 'Skill', input: { skill: 'albatros:lotse' } };
const skill = (s: string) => ({ tool: 'Skill', input: { skill: `albatros:${s}` } });
const LAGE = { tool: 'lage', input: { skills_stand: '0.2.0' } };
const melde = (schritt: string) => ({ tool: 'schritt_melden', input: { schritt, sprache: 'de' } });
// Typische Fehler in der Antwort: scharfes S und drei Fragen auf einmal
const SCHLECHT_GESAGT = 'Grüße! Was meinst du dazu? Passt das so? Und wie geht es dir?';
const NUR_EINE_FRAGE = 'Passt das so?';
// Belege von P1 und P2 aus dem Gerüst, wie die KI sie lage mitgibt (für anfrage-erlaubt und anfrage-nicht-erlaubt, w6-51)
const BELEGE_P3 = [
  { datei: 'docs/projekt.md', zeilen: ['Projektname: Sonnenhof', 'Hauptsache: Eine Woche anfragen (Knopf: «Woche anfragen»)'] },
  { datei: 'docs/recherche.md', zeilen: ['Vorbilder: Ferienhof Rösli in Sigriswil (von Anna genannt, Adresse fehlt): Preise je Woche sofort sichtbar'] },
];

const projektMd = `# Sonnenhof

Projektname: Sonnenhof
In einem Satz: Zwei Ferienwohnungen auf unserem Bauernhof in Merligen, mit Blick auf den Thunersee.
Für wen: Familien mit kleinen Kindern, die eine ruhige Woche auf dem Hof suchen
Hauptsache: Eine Woche anfragen (Knopf: «Woche anfragen»)
Erfolg: [Annahme: zwei Anfragen pro Monat in der Saison]
Bestehende Seite: keine
Modus: machen
Weg: Webseite
Stand: 31.10.2026, Idee steht
Nächster Schritt: Research: vergleichbare Seiten anschauen
`;

const planMd = (o: { sprachen?: string; release?: string; pflege?: string; zusatz?: string; annahme?: boolean } = {}) => {
  const a = (x: string) => (o.annahme === false ? x : `[Annahme: ${x}]`);
  return [
    '# Plan: Sonnenhof', '',
    'Worum es geht: Zwei Ferienwohnungen auf unserem Bauernhof in Merligen, für Familien mit kleinen Kindern.', '',
    'Projektname: Sonnenhof',
    `Seiten: ${a('Start, Wohnungen, Preise und Belegung, Anfrage, Über uns, Impressum, Datenschutz')}`,
    'Funktionen: Hauptsache «Woche anfragen»: Anfrage per Formular; Bestätigung per Mail; Fehler mit «Nochmals senden»',
    'Zugang: keine Bereiche nur für bestimmte Leute',
    `Sprachen: ${o.sprachen ?? 'Deutsch und Englisch'}`,
    `Setup: ${a('Seite ohne eigene Dienste, Anfragen per Mail')}`,
    `Testing: ${a('Am Handy sieht man den Knopf «Woche anfragen»; eine Anfrage kommt an')}`,
    `Release: ${o.release ?? 'vor Ostern 2027, im April beginnt die Saison; Weg ins Netz: ansehen, Freigabe, Wohnort, live'}`,
    ...(o.pflege === '' ? [] : [`Pflege: ${o.pflege ?? 'Anna, die freien Wochen jeden Sonntag'}`]),
    'Stand: 31.10.2026, Grundriss steht, noch nicht geprüft',
    ...(o.zusatz ? [o.zusatz] : []), '',
  ].join('\n');
};

const seite = (titel: string, main: string, stil = '') => `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titel} · Sonnenhof Merligen</title><link rel="stylesheet" href="../tokens.css"><link rel="stylesheet" href="../komponenten.css">${stil}</head>
<body><main id="inhalt">${main}</main></body></html>
`;

const entwurfMd = (zusatz = '', rueckmeldung = '29.10.2026 ‹Die Kälber gehören ganz nach oben› → Foto der Kälber auf der Startseite oben') => `# Entwurf: Sonnenhof Merligen
Stand: 31.10.2026

Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.50.1 (geprüft am 29.10.2026)
Seiten: Start (index.html), Wohnungen (wohnungen.html), Preise und Belegung (preise-und-belegung.html), Anfrage (anfrage.html mit Bestätigung und Fehler), Über uns (ueber-uns.html); noch 6 Platzhalter
Rückmeldungen: ${rueckmeldung}
${zusatz}`;

const prdMd = (freigabe: string) => `# PRD: Sonnenhof

Abgeleitet aus: docs/entwurf.md (Freigegeben zum Bauen: 30.10.2026)

## Abnahmekriterien
- [x] Am Handy ohne Scrollen der Knopf «Woche anfragen»

Lokal gesehen: 31.10.2026, auf dem Handy (Fotos 390 px) und am Computer (Vorschau)
Vergleich mit Entwurf: 31.10.2026, keine offene Abweichung (pruefen.mjs --vergleich)
${freigabe}
`;

export const BEISPIELE: Record<string, Beispiele> = {
  'p1-idee': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('webseite-planen')],
      dateien: {
        'docs/projekt.md': projektMd,
        'AGENTS.md': '# Hinweise für die KI\n',
        'CLAUDE.md': 'Es gelten die Hinweise in AGENTS.md.\n\n@AGENTS.md\n',
        'design/skizze.html': '<!doctype html><title>Skizze: Sonnenhof</title>\n',
      },
      antwort: 'Das Ziel ist auf der Karte eingekreist. In docs/projekt.md steht deine Idee, AGENTS.md sagt jeder KI, wo ihr steht, und design/skizze.html zeigt die Startseite in Grau: Öffne sie mit einem Doppelklick. Als Erfolg habe ich «zwei Anfragen pro Monat in der Saison» vorgeschlagen. Passt das so?',
    },
    schlecht: [{
      aufrufe: [melde('idee'), melde('recherche'), LAGE],
      dateien: { 'docs/projekt.md': '# Hof\n\nProjektname: Hof\nErfolg: zehn Anfragen\nModus: lernen\n' },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-projekt', 'antworten-idee', 'erfolg-als-annahme', 'modus-machen', 'agents', 'skizze', 'insel-nicht-weiter', 'titel', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p2-research': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('webseite-planen')],
      dateien: {
        'docs/recherche.md': `# Research: Sonnenhof
Stand: 31.10.2026

Vorbilder: Ferienhof Rösli in Sigriswil (von dir genannt, Adresse unbekannt): Preise je Woche sofort sichtbar; weitere konnte ich ohne Netz nicht aufrufen
Übliche Seiten und Funktionen: Wohnungen mit Fotos, Preise je Woche, freie Wochen, Anfrage, Anreise
Übernehmen: [Annahme: Preise je Woche gross auf der Seite]
Vermeiden: [Annahme: Online-Kasse, für zwei Wohnungen reicht eine Anfrage]
Pflichten: Impressum, Datenschutzerklärung, Bildrechte der eigenen Fotos
Inhalte vorhanden: Fotos beider Wohnungen und des Gartens; fehlt: Texte, Logo
Suchbegriffe: [Annahme: «Ferienwohnung Thunersee», «Ferien auf dem Bauernhof»]
`,
      },
      antwort: 'Die Reiseführer sind gelesen, so gut es ohne Netz geht: Ich konnte keine Seiten aufrufen, darum steht nur dein Vorbild drin. Die Suchbegriffe und was wir übernehmen habe ich vorgeschlagen. Stimmt das so?',
    },
    schlecht: [{
      aufrufe: [melde('plan'), LAGE],
      dateien: {
        'docs/recherche.md': `# Research
Vorbilder: https://www.alpenhof-beispiel.ch und bauernhofferien.ch
Übliche Seiten und Funktionen: Wohnungen, Preise
Übernehmen: Preise gross
Pflichten: Impressum
Inhalte vorhanden: keine
Suchbegriffe: Ferien
`,
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-recherche', 'vorbild-der-person', 'keine-erfundene-adresse', 'inhalte-vorhanden', 'annahmen', 'insel-nicht-weiter', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p3-grundriss': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('webseite-planen'), melde('plan'), LAGE],
      dateien: { 'docs/plan.md': planMd() },
      antwort: 'Der Grundriss deines Hauses steht in docs/plan.md: sieben Seiten, die Anfrage, Deutsch und Englisch, online vor Ostern 2027. Drei Dinge habe ich vorgeschlagen: die Seiten, eine Seite ohne eigene Dienste und woran wir erkennen, dass sie fertig ist. Stimmt das so?',
    },
    schlecht: [{
      aufrufe: [melde('plan-geprueft'), LAGE],
      dateien: { 'docs/plan.md': planMd({ sprachen: 'Deutsch', pflege: '', annahme: false, zusatz: 'Bestätigt: 31.10.2026' }) },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-plan', 'antworten-grundriss', 'annahmen-grundriss', 'kein-bestaetigt', 'insel-plan', 'insel-nicht-weiter', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p4-plan-pruefen': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('webseite-planen'), { tool: 'Agent', input: { prompt: 'Lies nur die Dateien in docs/ und prüfe den Plan …' } }],
      dateien: {
        'docs/plan-pruefung.md': `# Prüfung des Plans: Sonnenhof

Geprüft am: 31.10.2026
Zweite Meinung: Claude Code, Subagent in frischem Kontext; 7 ok, 3 Risiko, 0 offen

| Punkt | Ergebnis | Stelle | Begründung |
|---|---|---|---|
| 1. Eine Hauptsache | ok | plan.md, Funktionen | Woche anfragen |
| 2. Fünf bis sieben Seiten | ok | plan.md, Seiten | sieben |
| 3. Abläufe | Risiko | plan.md, Funktionen | belegte Woche fehlt |
| 4. Inhalte | Risiko | plan.md, Inhalte | Texte fehlen |
| 5. Wer darf was | ok | plan.md, Zugang | alles öffentlich |
| 6. Pflichten | ok | recherche.md | eingeplant |
| 7. Erfolgsmass | ok | projekt.md | zwei Anfragen |
| 8. Kosten | Risiko | plan.md, Release | offen, wer bezahlt |
| 9. Risiko | ok | plan.md, Setup | ohne Buchungssystem |
| 10. Datum | ok | plan.md, Release | passt |
`,
      },
      antwort: 'Die zweite Meinung ist da, wie bei einer Statikerin, die den Plan nicht gezeichnet hat. Drei Punkte haben ein Risiko: die belegte Woche, die fehlenden Texte und wer den Wohnort bezahlt. Ich habe die Punkte mit Risiko oder offen markiert. Ist der Plan so final, oder ändern wir etwas?',
    },
    schlecht: [{
      aufrufe: [melde('plan-geprueft'), LAGE],
      dateien: {
        'docs/plan-pruefung.md': '# Prüfung\n\nGeprüft am: 31.10.2026\n\n- Hauptsache: ok\n- Seiten: ok\n',
        'docs/plan.md': planMd({ zusatz: 'Bestätigt: 31.10.2026, «sieht gut aus»' }),
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-plan-pruefung', 'pruefliste', 'zweite-meinung-frisch', 'kein-bestaetigt', 'insel-nicht-weiter', 'ja-frage', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p5-konzept': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('konzept')],
      dateien: {
        'docs/konzept.md': `# Konzept: Sonnenhof Merligen
Stand: 31.10.2026

Name: Sonnenhof Merligen
Kern: [Annahme: Für Familien mit kleinen Kindern: eine Woche mitten im Hofalltag. Warum wir: Wir leben selbst auf dem Hof.]
Ton: du; herzlich, einfach, wie auf dem Hof
Charakter: herzlich, ruhig, ländlich
Maskottchen: [offen: Frage gestellt am 31.10.2026]
Muss bleiben: nichts
Bildsprache: [Annahme: Fotos vom Hof und von den Tieren]
`,
      },
      antwort: 'Charakter vor Farben: Name, Ton und deine drei Wörter stehen in docs/konzept.md. Eine Figur macht eine Seite unverwechselbar, braucht aber in jedem Bild Pflege. Soll eine Figur dazugehören, die durch deine Seite führt? Ja, nein oder später.',
    },
    schlecht: [{
      aufrufe: [melde('konzept'), LAGE, { tool: 'bild_erzeugen', input: { beschreibung: 'eine Kuh als Maskottchen' } }],
      dateien: {
        'docs/konzept.md': `# Konzept
Name: Sonnenhof
Kern: Ferien auf dem Hof
Ton: Sie
Charakter: modern
Maskottchen: ja, eine Kuh
Muss bleiben: nichts
`,
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-konzept', 'antworten-konzept', 'annahmen-konzept', 'maskottchen-offen', 'figur-frage', 'insel-nicht-weiter', 'kein-bild', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p6-mockup': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('gestaltung')],
      dateien: { 'design/mockup.html': '<!doctype html><title>Mockup: Sonnenhof Merligen</title>\n' },
      antwort: 'Erst das Fundament, dann die Fassade: design/mockup.html zeigt die Startseite und die Seite Wohnungen in Grau. Öffne die Datei im Browser. Stimmt die Reihenfolge auf der grauen Skizze?',
    },
    schlecht: [{
      aufrufe: [melde('mockup'), LAGE],
      dateien: { 'design/tokens.css': ':root { --farbe-aktion: #0b5c8c; }\n' },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'mockup', 'reihenfolge-frage', 'kein-farbfaecher-vorher', 'insel-nicht-weiter', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p7-entwurf': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('entwurf')],
      dateien: {
        'design/entwurf/index.html': seite('Start', '<h1>Ferien auf dem Bauernhof</h1>', '<style>.oben { padding: var(--abstand-6); color: var(--farbe-text); }</style>'),
        'design/entwurf/wohnungen.html': seite('Wohnungen', '<h1>Unsere zwei Wohnungen</h1>'),
        'design/entwurf/preise-und-belegung.html': seite('Preise und Belegung', '<h1>Preise und Belegung</h1>'),
        'design/entwurf/anfrage.html': seite('Anfrage', '<form action="anfrage-bestaetigt.html"></form>'),
        'design/entwurf/anfrage-bestaetigt.html': seite('Anfrage angekommen', '<h1>Danke</h1>'),
        'design/entwurf/anfrage-fehler.html': seite('Fehler beim Senden', '<h1>Das hat nicht geklappt</h1>'),
        'design/entwurf/ueber-uns.html': seite('Über uns', '<h1>Über uns</h1>'),
        'docs/entwurf.md': entwurfMd('', '[offen: kommt nach dem Durchklicken]').replace(/^Werkstatt: .*$/m, 'Werkstatt: [offen: ohne Terminal nicht geprüft, Anna prüft mit node --version]'),
      },
      antwort: 'Das begehbare Modell steht in design/entwurf/: Start, Wohnungen, Preise und Belegung, Anfrage mit Bestätigung und Fehler, Über uns. Klick dich durch, auf dem Handy und am Computer: Was fehlt, was stört?',
    },
    schlecht: [{
      aufrufe: [melde('entwurf-freigegeben'), LAGE],
      dateien: {
        'design/entwurf/index.html': seite('Start', '<h1>Ferien</h1>', '<style>h1 { color: #333333; }</style>'),
        'design/entwurf/wohnungen.html': seite('Wohnungen', '<h1>Wohnungen</h1>'),
        'docs/entwurf.md': '# Entwurf\nWerkstatt: Node 24\nSeiten: Start\nFreigegeben zum Bauen: 31.10.2026\n',
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-entwurf', 'seiten-im-entwurf', 'zustaende', 'nur-tokens', 'kein-freigegeben', 'insel-nicht-weiter', 'durchklicken-frage', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p8-sieht-gut-aus': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('entwurf')],
      antwort: 'Freut mich, dass dir das Modell gefällt! Gebaut wird nur, was du mit einem klaren Ja unterschreibst. Heisst das: Ja, so bauen?',
    },
    schlecht: [{
      aufrufe: [melde('entwurf-freigegeben'), LAGE],
      dateien: {
        'docs/entwurf.md': entwurfMd('Freigegeben zum Bauen: 31.10.2026, ‹Sieht gut aus›\n'),
        'docs/prd.md': '# PRD\n',
        'web/package.json': '{}\n',
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'kein-freigegeben', 'insel-nicht-weiter', 'kein-bau', 'nachfrage', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p8-ja': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('entwurf'), melde('entwurf-freigegeben'), LAGE],
      dateien: { 'docs/entwurf.md': entwurfMd('Freigegeben zum Bauen: 31.10.2026, ‹Ja, so bauen!›\n') },
      antwort: 'Die Unterschrift steht unter dem Modell: Gebaut wird genau dieser Entwurf. Als Nächstes baue ich die Seite auf deinem Computer, ins Netz geht dabei nichts.',
    },
    schlecht: [{
      aufrufe: [melde('entwurf'), LAGE],
      dateien: {
        'docs/entwurf.md': entwurfMd('Freigegeben zum Bauen: ‹sieht gut aus›\n'),
        'web/src/pages/index.astro': '<h1>Sonnenhof</h1>\n',
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'freigegeben', 'insel-freigegeben', 'kein-rohbau', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'webseite-bauen-prd': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('webseite-bauen')],
      dateien: {
        'docs/stack.md': '# Tech-Stack\n\n**Entscheid:** [Annahme: Astro, statisch]\n**JavaScript:** höchstens 50 KB je Seite\n',
        'docs/prd.md': `# PRD: Sonnenhof

Abgeleitet aus: docs/entwurf.md (Freigegeben zum Bauen: 30.10.2026)

## Abnahmekriterien
### Anfrage
- [ ] Eine Anfrage kommt bei [offen: Mailadresse von Anna] an
`,
        'docs/tueren.txt': '/               200\n/anfrage        200\n/.env           404\n/.git/config    404 403\n',
      },
      antwort: 'Der Bauplan ist aus deinem freigegebenen Entwurf abgeleitet, darum musst du ihn nicht eigens abnehmen. Ich baue mit Astro, ohne Baustein, und offen sind nur Start, Wohnungen, Preise, Anfrage, Über uns, Impressum und Datenschutz. Stimmt das so?',
    },
    schlecht: [{
      aufrufe: [melde('prd'), LAGE],
      dateien: {
        'docs/prd.md': '# PRD\n\n## Abnahmekriterien\n- [ ] Seite schön\nAbgenommen: [offen]\n',
        'web/package.json': '{}\n',
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'skill', 'abgeleitet', 'keine-eigene-abnahme', 'stack-datei', 'tueren', 'kein-rohbau', 'insel-nicht-weiter', 'fragen', 'kein-scharfes-s'],
    }, {
      aufrufe: [LOTSE, LAGE, skill('webseite-bauen')],
      dateien: { 'docs/stack.md': '# Tech-Stack\n' },
      antwort: NUR_EINE_FRAGE,
      faellt: ['prd-datei', 'abgeleitet', 'tueren'],
    }],
  },

  'p10-freigabe': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('webseite-bauen'), melde('freigabe'), LAGE],
      dateien: { 'docs/prd.md': prdMd('Freigegeben: 31.10.2026 («Ja, ich gebe sie frei»)') },
      antwort: 'Die Begehung ist geschafft, du hast den Schlüssel: Genau diese Seite ist freigegeben. Als Nächstes wählst du, wo sie wohnt, bei Albatros oder selbst. Bis hierher hat Albatros nichts gekostet.',
    },
    schlecht: [{
      aufrufe: [melde('wohnort'), LAGE, { tool: 'upgrade_link', input: { stufe: 'light' } }],
      dateien: { 'docs/prd.md': prdMd('Freigegeben: [offen]') },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'freigegeben', 'insel-freigabe', 'insel-nicht-weiter', 'kein-abo', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p11-wohnort': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('lancieren'), { tool: 'konto_status' }, { tool: 'upgrade_link', input: { stufe: 'light', bestaetigt: true } }],
      antwort: 'Gute Wahl, Light kostet laut deinem Konto CHF 15 pro Monat. Hier ist die Zahlungsseite: https://checkout.stripe.com/c/pay/cs_test_albatros_light Deine Karte gibst du nur dort ein, nie im Chat. Danach holen wir den Schlüssel fürs Haus. Sagst du mir, wenn du fertig bist?',
    },
    schlecht: [{
      aufrufe: [{ tool: 'upgrade_link', input: { stufe: 'pilot' } }, LAGE, { tool: 'seite_erstellen', input: { name: 'sonnenhof', sprache: 'de' } }, melde('live')],
      antwort: `Light kostet CHF 19 pro Monat. ${SCHLECHT_GESAGT}`,
      faellt: ['lage-zuerst', 'abo-link', 'link-weitergegeben', 'preise-aus-konto', 'keine-seite-vor-abo', 'insel-nicht-weiter', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p12-betrieb': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('betrieb'), melde('betrieb'), LAGE],
      dateien: {
        'docs/betrieb.md': `# Betrieb

Rückmeldungen: Formular an sonnenhof@example.com, liest Anna jeden Abend, in den Ferien Beat
Überwachung: [Annahme: UptimeRobot (gratis) prüft https://sonnenhof-thunersee.ch alle 5 Minuten, Mail an sonnenhof@example.com]
Sicherung: Logbuch auf diesem Computer und eine zweite Kopie in einem privaten Repo bei GitHub; frühere Stände beim Verein wieder hochladen
Eingang: nicht nötig (keine Anmeldung)
Statistik: ja, ohne Cookies, Ziel «Anfrage gesendet» (Skill statistik)
Stand: 31.10.2026
`,
      },
      antwort: 'Briefkasten, Rauchmelder und Haustür sind bereit: Alles steht in docs/betrieb.md. Für die Überwachung schlage ich UptimeRobot vor, das Konto legst du selbst an. Passt das?',
    },
    schlecht: [{
      aufrufe: [melde('live'), LAGE],
      dateien: { 'docs/betrieb.md': '# Betrieb\n\nRückmeldungen: Formular\nÜberwachung: UptimeRobot\nSicherung: [offen]\nEingang: Eingang mit Login\n' },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-betrieb', 'antworten-betrieb', 'ueberwachung-annahme', 'sicherung-geklaert', 'insel-betrieb', 'insel-nicht-weiter', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'p13-geaendert': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('lancieren')],
      antwort: 'Ins Netz geht nur die Seite, die du freigegeben hast, und das neue Foto hast du nach der Freigabe eingesetzt. Lass uns die geänderte Startseite zuerst zusammen anschauen; danach gibst du sie neu frei, und ich schalte sie live. Sollen wir das gleich machen?',
    },
    schlecht: [{
      aufrufe: [melde('hafen'), LAGE, melde('live')],
      dateien: { 'docs/live.md': '# Live\n\nLive seit: 31.10.2026\n' },
      antwort: `Die Seite ist jetzt online! ${SCHLECHT_GESAGT}`,
      faellt: ['lage-zuerst', 'nicht-live', 'kein-live-datei', 'neue-freigabe', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'knapp': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('webseite-planen')],
      dateien: { 'docs/plan.md': planMd({ sprachen: 'Deutsch', release: '[offen: bis wann online, und gibt es einen Anlass?]; Weg ins Netz: ansehen, Freigabe, Wohnort, live', pflege: 'Anna' }) },
      antwort: 'Danke, das reicht für den Grundriss: Anfragen, keine geschützten Bereiche, Deutsch, und du pflegst die Seite. Eins fehlt noch, damit wir planen können: Bis wann soll die Seite online sein?',
    },
    schlecht: [{
      aufrufe: [melde('plan'), LAGE],
      dateien: { 'docs/plan.md': planMd({ sprachen: 'Englisch', release: 'Frühling 2027', pflege: '' }) },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'zeilen-plan', 'antworten-knapp', 'release-offen', 'kein-datum-erfunden', 'release-frage', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'nein-vor-bau': {
    gut: {
      aufrufe: [LOTSE, LAGE, skill('entwurf')],
      dateien: { 'docs/entwurf.md': entwurfMd('', '31.10.2026 ‹Preise und Belegung zu kompliziert; auf der Startseite fehlen die Tiere› → wird geändert') },
      antwort: 'Jetzt ist eine Änderung ein Satz, nach dem Bau wäre sie ein Umbau: Darum ändern wir zuerst das Modell. Ich mache «Preise und Belegung» einfacher und hole die Tiere auf die Startseite. Soll ich dafür die Fotos der Kälber nehmen?',
    },
    schlecht: [{
      aufrufe: [melde('prd'), LAGE],
      dateien: {
        'docs/entwurf.md': entwurfMd('Freigegeben zum Bauen: 31.10.2026, ‹bau trotzdem›\n', '31.10.2026 ‹zu kompliziert›'),
        'docs/prd.md': '# PRD\n',
        'web/package.json': '{}\n',
      },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'kein-freigegeben', 'insel-nicht-weiter', 'kein-bau', 'rueckmeldung', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'gratis-bis-lokal': {
    gut: {
      aufrufe: [LAGE, { tool: 'upgrade_link', input: { stufe: 'light' } }],
      antwort: 'Nein, du musst jetzt nichts bezahlen: Bis deine Seite auf deinem Computer fertig und freigegeben ist, kostet Albatros nichts. Erst dann wählst du, ob sie bei Albatros wohnt oder woanders. Weiter mit dem Grundriss: Was sollen Besucher auf deiner Seite tun können?',
    },
    schlecht: [{
      aufrufe: [{ tool: 'upgrade_link', input: { stufe: 'light', bestaetigt: true } }, LAGE],
      antwort: `Hier ist der Link: https://checkout.stripe.com/c/pay/cs_test_albatros_light ${SCHLECHT_GESAGT}`,
      faellt: ['lage-zuerst', 'kein-abo', 'kein-zahlungslink', 'gratis', 'fragen', 'kein-scharfes-s'],
    }],
  },

  'lernen-kontrollfrage': {
    gut: {
      aufrufe: [LOTSE, { tool: 'lage', input: { skills_stand: '0.2.0', modus: 'lernen' } }, skill('webseite-planen'), melde('plan-geprueft'), LAGE],
      dateien: { 'docs/plan.md': planMd({ zusatz: 'Bestätigt: 31.10.2026, «Ja, der Plan ist so final»' }) },
      antwort: 'Dein Plan ist bestätigt, die Statikerin hat unterschrieben. Zum Schluss dieser Etappe eine Kontrollfrage, in deinen Worten: Warum prüft jemand anderes deinen Plan, und nicht du selbst?',
    },
    schlecht: [{
      aufrufe: [{ tool: 'verstanden_melden', input: { mission: 'flugschule-13-plan-pruefen', art: 'kontrollfrage' } }, LAGE],
      dateien: { 'docs/plan.md': planMd() },
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage-zuerst', 'bestaetigt', 'insel-plan-geprueft', 'kontrollfrage', 'nicht-vorweg', 'fragen', 'kein-scharfes-s', 'skill'],
    }],
  },

  'lernen-verstanden': {
    gut: {
      aufrufe: [LAGE, { tool: 'verstanden_melden', input: { mission: 'flugschule-13-plan-pruefen', art: 'kontrollfrage' } }],
      antwort: 'Genau: Wer den Plan selbst geschrieben hat, sieht seine Lücken am schlechtesten. Weiter geht es mit dem Charakter deiner Seite. Bleibt der Name Sonnenhof, oder soll das Projekt nach aussen anders heissen?',
    },
    schlecht: [{
      aufrufe: [{ tool: 'verstanden_melden', input: { mission: 'flugschule-14-konzept', art: 'kontrollfrage' } }],
      antwort: SCHLECHT_GESAGT,
      faellt: ['lage', 'verstanden', 'nicht-naechste-lektion', 'fragen', 'kein-scharfes-s'],
    }],
  },

  'luecke-ohne-skill': {
    gut: {
      aufrufe: [LAGE, { tool: 'luecke_melden', input: { frage: 'Wie lässt sich die Belegung einer Ferienwohnung auf der eigenen Seite automatisch mit dem Kalender einer Buchungsplattform abgleichen?', art: 'nicht_abgedeckt', skill: 'webseite-planen', phase: 'P3', skills_stand: '0.2.0' } }],
      antwort: 'Dafür hat Albatros noch kein Know-how, und ich will dir nichts erfinden. Ich möchte die Frage ohne deinen Namen an Albatros melden. Darf Albatros Fragen, die die Skills noch nicht abdecken, mit deinem Konto speichern, damit die Skills besser werden? Du kannst sie im Cockpit ansehen und löschen.',
    },
    schlecht: [{
      aufrufe: [{ tool: 'luecke_melden', input: { frage: 'Anna Brunner (anna.brunner@example.com) fragt nach Booking.com', art: 'nicht_abgedeckt', einverstanden: true } }],
      antwort: SCHLECHT_GESAGT,
      faellt: ['ohne-einwilligung', 'keine-personendaten', 'einwilligung-gefragt', 'fragen', 'kein-scharfes-s'],
    }, {
      aufrufe: [LAGE],
      antwort: 'Das geht mit einem Channel-Manager. Darf Albatros das speichern?',
      faellt: ['luecke-gemeldet'],
    }],
  },

  // Welle 6 (w6-51, anf-01, 01.11.2026): anfrage nur, wenn lage «Anfragen: erlaubt.» zeigt, dann ab dem nächsten Aufruf und ohne Name
  // oder E-Mail. Dieselbe Lage wie p3-grundriss; die beiden Fälle unterscheiden sich nur in dieser Zeile.
  'anfrage-nicht-erlaubt': {
    gut: {
      // Belege mit «anfragen» im Text sind keine anfrage: Der Grader sucht nur das Feld
      aufrufe: [LOTSE, LAGE, skill('webseite-planen'), melde('plan'), { tool: 'lage', input: { skills_stand: '0.2.0', belege: BELEGE_P3 } }],
      antwort: 'Der Grundriss deines Hauses steht in docs/plan.md: sieben Seiten, die Anfrage, Deutsch und Englisch, online vor Ostern 2027. Als Nächstes prüft eine zweite Meinung den Plan. Stimmt das so?',
    },
    schlecht: [{
      aufrufe: [LAGE, melde('plan'), { tool: 'lage', input: { skills_stand: '0.2.0', anfrage: 'Den Grundriss mit den fünf Antworten fertig schreiben.' } }],
      antwort: SCHLECHT_GESAGT,
      faellt: ['keine-anfrage', 'fragen', 'kein-scharfes-s'],
    }, {
      aufrufe: [melde('plan'), LAGE],
      antwort: NUR_EINE_FRAGE,
      faellt: ['lage-zuerst'],
    }],
  },
  'anfrage-erlaubt': {
    gut: {
      // Namen in den Belegen (docs/recherche.md: «von Anna genannt») zählen nicht, nur in anfrage
      aufrufe: [LOTSE, LAGE, skill('webseite-planen'), melde('plan'),
        { tool: 'lage', input: { skills_stand: '0.2.0', belege: BELEGE_P3, anfrage: 'Den Grundriss mit den fünf Antworten fertig schreiben und sagen, wie es weitergeht.' } }],
      antwort: 'Der Grundriss deines Hauses steht in docs/plan.md: sieben Seiten, die Anfrage, Deutsch und Englisch, online vor Ostern 2027. Als Nächstes prüft eine zweite Meinung den Plan. Stimmt das so?',
    },
    schlecht: [{
      aufrufe: [LAGE, melde('plan'), LAGE],
      antwort: SCHLECHT_GESAGT,
      faellt: ['anfrage-gesendet', 'fragen', 'kein-scharfes-s'],
    }, {
      aufrufe: [LAGE, { tool: 'lage', input: { skills_stand: '0.2.0', anfrage: 'Anna Brunner (anna.brunner@example.com) will den Grundriss fertig.' } }],
      antwort: NUR_EINE_FRAGE,
      faellt: ['anfrage-ohne-personendaten'],
    }, {
      aufrufe: [melde('plan'), LAGE],
      antwort: NUR_EINE_FRAGE,
      faellt: ['lage-zuerst', 'anfrage-gesendet'],
    }],
  },

  // Angeglichene Fälle (KRITERIEN-LOG.md, 2026-10-31)
  'lotse-ohne-anmeldung': {
    gut: {
      aufrufe: [LOTSE, LAGE, { tool: 'authenticate' }],
      antwort: 'Albatros kennt dich noch nicht, darum sehe ich deinen Stand nicht. Der Fahrplan hat drei Etappen: abheben (Idee bis Entwurf), fliegen (bauen und freigeben), landen (live und erste Gäste). Dein Ordner ist leer, also ist die Idee mit dem Projektnamen dran (Skill webseite-planen). Für den Lotsen melde dich hier an: https://clerk.albatros.build/oauth/authorize?response_type=code&client_id=test&state=test',
    },
    schlecht: [{
      aufrufe: [],
      antwort: 'Hier ist die Bibliothek: pipeline, git-logbuch, domain.',
      faellt: ['lage', 'skill', 'etappen', 'naechster-schritt'],
    }],
  },

  'webseite-planen': {
    gut: {
      aufrufe: [skill('webseite-planen')],
      dateien: {
        'docs/recherche.md': 'Vorbilder: die Seite einer Bäckerei (Name und Adresse fehlen): ruhig\n',
        'docs/plan.md': planMd(),
      },
      antwort: 'Der Grundriss liegt in docs/plan.md. Prüf ihn bitte in Ruhe.',
    },
    schlecht: [{
      aufrufe: [],
      dateien: {
        'docs/recherche.md': 'Vorbilder: https://www.brot-beispiel.ch\n',
        'plan.md': '# Plan\nSeiten: Start\n',
        'docs/plan.md': planMd({ pflege: '', zusatz: 'Bestätigt: 31.10.2026' }),
      },
      antwort: 'Fertig.',
      faellt: ['skill', 'zeilen-plan', 'kein-bestaetigt', 'vorbild', 'keine-erfundene-adresse'],
    }, {
      aufrufe: [skill('webseite-planen')],
      dateien: { 'docs/recherche.md': 'Vorbilder: Bäckerei\n' },
      antwort: 'Fertig.',
      faellt: ['plan-datei', 'zeilen-plan'],
    }],
  },

  'start-light': {
    gut: {
      aufrufe: [skill('start'), { tool: 'konto_status' }],
      antwort: 'Für eine Seite aus Texten, Fotos und einer Kontaktadresse brauchst du keinen eigenen Server: Light reicht (CHF 15 pro Monat). Bis deine Seite auf deinem Computer fertig ist, kostet Albatros nichts. Wie soll dein Projekt heissen?',
    },
    schlecht: [{
      aufrufe: [{ tool: 'upgrade_link', input: { stufe: 'light' } }],
      antwort: 'Hier ist der Link zur Zahlung.',
      faellt: ['skill', 'konto', 'kein-zahlungslink'],
    }],
  },
};
