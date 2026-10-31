// Attrappe des MCP-Diensts von Albatros für den Durchspiel-Test (stdio, JSON-RPC je Zeile), so wie Albatros mit den Schaltern FAHRPLAN und
// ERFASSUNG antwortet (Plan «Fahrplan und Lernschleife»). Keine Zahlung, kein Server: Albatros wird nie echt angesprochen.
// - Mit Zustand im Ordner DURCHSPIEL_HAFEN: lage nach dem Fahrplan (Phase aus Insel und belege wie albatros services/mcp/src/lage.ts: die
//   Insel als Boden, die Belege lückenlos weiter; offene Pflichtfragen, Ergebnis, Gate, Gratis-Hinweis, Modus, im Modus lernen die Lektion,
//   Methoden vor oder nach dem Skill, Hinweis zur Erfassung bis luecke_melden mit einverstanden), schritt_melden, weg_waehlen, modus_waehlen,
//   verstanden_melden, skill_holen, luecke_melden, upgrade_link (ohne Abo vor P11 ohne bestaetigt nur der Gratis-Hinweis, sonst gilt das
//   Abo als bezahlt), methode, konto_status, schluessel_hinterlegen, mission_holen und mission_pruefen (Prüfung insel gegen die Insel).
//   seite_erstellen und server_erstellen legen den Hafen unter dem Namen an (Kopie von vorlage.git).
// - Feste Texte: zuerst scripts/durchspiel/mocks/<fall>/<werkzeug>.md (überschreibt auch die Werkzeuge mit Zustand), sonst für die übrigen
//   scripts/durchspiel/mocks/<werkzeug>.md oder plugins/albatros/evals/mocks/albatros/<werkzeug>.md; je nach Stand zuerst
//   <werkzeug>.server.md, .seite.md, .<abo>.md. Platzhalter: {repo}, {name} (Name der Seite), {stand} (zuletzt veröffentlicht), {stufe}.
// Umgebung: DURCHSPIEL_STAND (Stand der Skills im Lauf mit fahrplan.yaml, missionen/, plugins/albatros), DURCHSPIEL_FALL, DURCHSPIEL_STUFE
// (gratis, light, pilot), DURCHSPIEL_SCHLOESSER, DURCHSPIEL_LOG (jeder Aufruf als JSON-Zeile mit Runde), DURCHSPIEL_RUNDE (Datei mit der
// Nummer der laufenden Runde), DURCHSPIEL_METHODEN (Ordner mit <name>/SKILL.md, sonst ../albatros-methoden/skills neben diesem Repo).
// Beschreibungen und Parameter der Werkzeuge und die Anleitung wie beim echten Dienst mit FAHRPLAN und ERFASSUNG (mocks/werkzeuge.json,
// mocks/anleitung.txt); fehlt ein Pflichtfeld oder ist ein Wert nicht erlaubt, antwortet die Attrappe wie er mit «Ungültige Angaben».
// Neu erzeugen im Repo albatros, Ordner services/mcp, mit Z=…/albatros-skills/scripts/durchspiel/mocks:
//   bun -e "import { z } from 'zod'; import { WERKZEUGE } from './src/werkzeuge.ts'; import { anleitung } from './src/lage.ts';
//     const an = { FAHRPLAN: true, ERFASSUNG: true }; const liste = WERKZEUGE.filter((w) => (!w.nurMit || an[w.nurMit]) && (!w.nurOhne || !an[w.nurOhne]))
//     .map((w) => { const { \$schema: _, ...inputSchema } = z.toJSONSchema(w.eingabe, { io: 'input' }); return { name: w.name, description: w.description, inputSchema }; });
//     await Bun.write('$Z/werkzeuge.json', JSON.stringify(liste, null, 1) + '\n'); await Bun.write('$Z/anleitung.txt', anleitung(an) + '\n');"
import { spawnSync } from 'node:child_process';
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ladeFahrplan, type Phase, type Pflichtfrage } from '../fahrplan.ts';
import { bisAbschluss, erledigtNachDateien, erledigtNachInsel, frageBelegt, phaseIndex, wert, wohnortVon } from '../punkte.ts';
import { hoeher as neuer } from '../stand.ts';

type Args = Record<string, unknown>;
type Antwort = { text: string; fehler?: boolean };
type Beleg = { datei: string; zeilen: string[] };

const wurzel = new URL('../..', import.meta.url).pathname;
const QUELLE = process.env.DURCHSPIEL_STAND ? `${process.env.DURCHSPIEL_STAND.replace(/\/$/, '')}/` : wurzel;
const FALL = process.env.DURCHSPIEL_FALL;
const HAFEN = process.env.DURCHSPIEL_HAFEN;
const METHODEN = process.env.DURCHSPIEL_METHODEN ?? join(wurzel, '../albatros-methoden/skills');
const fallOrdner = FALL ? join(wurzel, 'scripts/durchspiel/mocks', FALL) : null;
const ordner = [join(wurzel, 'scripts/durchspiel/mocks'), join(wurzel, 'plugins/albatros/evals/mocks/albatros')];
const geladen = await ladeFahrplan(QUELLE);
if (!geladen.ok) throw new Error(geladen.fehler.join('\n'));
const F = geladen.fahrplan;
const SKILLS_STAND: string = JSON.parse(readFileSync(join(QUELLE, 'plugins/albatros/.claude-plugin/plugin.json'), 'utf8')).version;

// ———— Zustand ————
const merk = (d: string) => (HAFEN && existsSync(join(HAFEN, d)) ? readFileSync(join(HAFEN, d), 'utf8').trim() || null : null);
const setze = (d: string, w: string) => { if (HAFEN) writeFileSync(join(HAFEN, d), w); };
const stufe = () => merk('abo') ?? process.env.DURCHSPIEL_STUFE ?? 'light';
const schloesser = () => Number(merk('schloesser') ?? process.env.DURCHSPIEL_SCHLOESSER ?? '1');
const seiteName = () => merk('seite');
const insel = () => merk('insel');
const rang = (s: string | null) => F.insel.indexOf(s ?? '') + 1;
const stand = (n: string) => {
  const zeit = spawnSync('git', ['--git-dir', join(HAFEN!, n, 'projekt.git'), 'log', '-1', '--format=%cd', '--date=format:%d.%m.%Y %H:%M', 'main', '--', 'seite']).stdout?.toString().trim();
  return zeit ? `zuletzt veröffentlicht ${zeit}` : 'noch nichts veröffentlicht';
};

// ———— Feste Texte ————
const text = (o: string, werkzeug: string, a: Args) => {
  const n = seiteName();
  const abo = merk('abo');
  for (const z of [merk('server') && '.server', n && '.seite', abo && `.${abo}`, ''].filter((x) => x !== null)) {
    const f = join(o, `${werkzeug}${z}.md`);
    if (existsSync(f)) {
      return readFileSync(f, 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim().replaceAll('{repo}', wurzel.replace(/\/$/, ''))
        .replaceAll('{name}', String(a.name ?? n ?? 'curling-grindelwald')).replaceAll('{stand}', n ? stand(n) : '').replaceAll('{stufe}', String(a.stufe ?? abo ?? 'pilot'));
    }
  }
  return null;
};

// ———— lage nach dem Fahrplan ————
const STUFEN: Record<string, string> = { gratis: 'Gratis', light: 'Light', pilot: 'Pilot' };
const PREIS: Record<string, number> = { light: 15, pilot: 40 };
const skill = (slug: string) => `Skill \`${slug}\``;
const methodeText = (ms: string[]) => `${ms.map((m) => `Methode \`${m}\``).join(' und ')} (holen mit dem Werkzeug methode)`;
const GRATIS_HINWEIS = 'Bis zur fertigen Seite auf deinem Computer kostet Albatros nichts. Erst beim Wohnort wählst du: mit Albatros oder selbst.';
const gratisBis = phaseIndex(F, F.gratis_bis);
// Methoden ohne Abo: die der Phasen bis zur Gratis-Grenze (wie GRATIS.methoden in albatros services/konto/src/stufen.ts)
const freieMethoden = F.phasen.slice(0, gratisBis + 1).flatMap((p) => p.methoden?.geschaeft ?? []);
const ENTSCHEID = /^Entscheid: (Hausaufgabe offen bis (\d{1,2}\.\d{1,2}\.\d{4})|weiter|anpassen|stoppen)/;
const bisText = (n: number) => (n ? `bis ${F.phasen[n - 1]!.id}` : 'keine');
const wer = (p: Phase, q: Pflichtfrage) => (q.antwortet === 'ki' ? 'klärst du selbst' : q.antwortet === 'annahme_ok' ? 'als [Annahme] vorschlagen'
  : F.ja_momente.some((j) => j.phase === p.id && j.frage === q.id) ? 'die Person antwortet; Ja-Moment: nur ihr ausdrückliches Ja zählt, mit Datum vorne' : 'die Person antwortet, eine [Annahme] zählt nicht');
// Methoden vor oder nach dem Skill wie im Vertrag (methoden.wann), wie lage
const mitMethoden = (p: Phase, skillText: string, ms: string[]) => (!ms.length ? skillText
  : p.methoden?.wann === 'nach_skill' ? `${skillText}, dann ${methodeText(ms)}, sobald der Skill sie nennt` : `${methodeText(ms)}, dann ${skillText}`);
// Erfassung wie Albatros mit ERFASSUNG: solange die Person nichts gesagt hat (luecke_melden ohne einverstanden), der Hinweis; Anfragen erlaubt
// die Person nur im Cockpit, im Durchspiel also nie
const HINWEIS_ERFASSUNG = 'Hinweis zur Erfassung: Albatros speichert, welche Werkzeuge deine KI aufruft, nie Inhalte. Ansehen und widersprechen kannst du unter https://albatros.build/cockpit/daten.';

type Mission = {
  id: string; weg: string; titel: string; skill?: string; phase?: string; optional?: boolean; abo?: string;
  pruefung?: { typ: string; schritt?: string }[]; verstehen?: { frage: string; kern: string }[];
};
const missionen: Mission[] = ['flugschule', 'webseite', 'geschaeft'].flatMap((w) => {
  const d = join(QUELLE, 'missionen', w);
  return (existsSync(d) ? readdirSync(d) : []).filter((f) => f.endsWith('.md')).flatMap((f) => {
    const m = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(d, f), 'utf8'));
    return m ? [Bun.YAML.parse(m[1]!) as Mission] : [];
  });
});

function lektion(p: Phase, weg: string | null, st: string): string[] {
  const zeilen = p.lernmomente?.length ? [`Lernmomente: ${p.lernmomente.join('; ')}.`] : [];
  const verstanden = (merk('verstanden') ?? '').split('\n').filter(Boolean).map((z) => z.split(' '));
  // Lektionen nur mit Kontrollfrage (verstehen), wie lage seit 31.10.2026 (weg-10)
  for (const m of missionen.filter((x) => x.phase === p.id && !x.optional && (x.weg === 'flugschule' || x.weg === weg) && !(st === 'light' && x.abo === 'pilot') && (x.verstehen?.length ?? 0) > 0)) {
    const arten = verstanden.filter(([id]) => id === m.id).map(([, art]) => art);
    zeilen.push(`Lektion: Mission ${m.id} («${m.titel}»), verstanden: ${arten.length ? `ja (${arten.join(', ')})` : 'noch nicht'}.`);
    for (const f of m.verstehen ?? []) zeilen.push(`Kontrollfrage am Ende der Phase: ${f.frage} Kern einer guten Antwort: ${f.kern} Danach verstanden_melden mit mission ${m.id}.`);
  }
  return zeilen;
}

function lage(a: Args): Antwort {
  const belege: Beleg[] = Array.isArray(a.belege) ? (a.belege as Beleg[]).filter((b) => typeof b?.datei === 'string' && Array.isArray(b.zeilen)) : [];
  const dateien: Record<string, string> = Object.fromEntries(belege.map((b) => [b.datei, b.zeilen.join('\n')]));
  const weg = merk('weg');
  const st = stufe();
  const modus = a.modus === 'lernen' || a.modus === 'machen' ? a.modus : (merk('modus') as 'lernen' | 'machen' | null) ?? F.modus.standard;
  const geschaeft = weg === 'geschaeft';
  const e = geschaeft ? belege.filter((b) => b.datei === 'docs/ideen-check.md').flatMap((b) => b.zeilen).map((z) => ENTSCHEID.exec(z.trim().replace(/^[-*]\s+/, ''))).find(Boolean) ?? null : null;
  const entscheid = e ? (e[2] ? 'hausaufgabe' : e[1]!) : null;
  // Wie lage seit 31.10.2026 (vert-02, weg-02): die Insel ist der Boden, die Belege führen lückenlos von dort weiter
  const nachInsel = erledigtNachInsel(F, insel());
  const nachDateien = erledigtNachDateien(F, dateien, nachInsel);
  const erledigt = entscheid === 'anpassen' ? 0 : nachDateien;
  const p = F.phasen[erledigt];
  const wohnort = wohnortVon(F, wert(dateien['docs/lancieren.md'], 'Wohnort:'), st);
  const modernisieren = /https?:\/\/|\b[a-z0-9-]+\.[a-z]{2,}\b/i.test(wert(dateien['docs/projekt.md'], 'Bestehende Seite:') ?? '');
  const fuer = (q: Phase) => {
    const v = modernisieren ? q.varianten?.modernisieren : undefined;
    const abschnitt = v?.skill ? v.abschnitt : q.abschnitt;
    return { zusatz: v?.zusatz, text: `${skill(v?.skill ?? q.skill)}${abschnitt ? `, Abschnitt «${abschnitt}»` : ''}` };
  };
  const zeilen: string[] = [];
  const hinweise: string[] = [];
  const ss = typeof a.skills_stand === 'string' && /^\d+\.\d+\.\d+$/.test(a.skills_stand) ? a.skills_stand : null;
  if (!ss || neuer(SKILLS_STAND, ss)) {
    zeilen.push(`Deine Albatros-Skills sind veraltet (auf diesem Computer: ${ss ?? 'unbekannt'}, aktuell: ${SKILLS_STAND}). Gib bei lage skills_stand mit (metadata.stand in deinen Skills); fehlt dir ein Skill, hol ihn mit skill_holen.`);
  }
  let jetzt: string;
  let grund: string;
  let danach: string | undefined;
  let phaseDran = false;
  if (!weg) {
    [jetzt, grund] = [skill('start'), 'Du hast noch keinen Weg gewählt: eine Webseite oder ein Geschäft.'];
  } else if (entscheid === 'stoppen') {
    [jetzt, grund] = ['nichts mehr', 'Dein Ideen-Check sagt «stoppen»: Die Idee trägt so nicht. Das ist geschafft, nicht gescheitert.'];
    danach = `Mit einer neuen Idee beginnt es wieder bei P1: ${methodeText(['ideen-check'])}`;
  } else if (entscheid === 'hausaufgabe') {
    [jetzt, grund] = [`warten bis ${e![2]}`, `Dein Ideen-Check hat eine Hausaufgabe offen bis ${e![2]}. Erst mit ihrem Ergebnis entscheidet ihr: weiter, anpassen oder stoppen.`];
    danach = `${methodeText(['ideen-check'])} mit dem Ergebnis der Hausaufgabe`;
  } else if (p) {
    phaseDran = true;
    const f = fuer(p);
    const methoden = geschaeft ? (p.methoden?.geschaeft ?? []).filter((m) => !(m === 'ideen-check' && entscheid === 'weiter')) : [];
    const mitAbo = st === 'gratis' ? methoden.filter((m) => !freieMethoden.includes(m)) : [];
    jetzt = mitMethoden(p, f.text, methoden.filter((m) => !mitAbo.includes(m)));
    grund = `${entscheid === 'anpassen' ? 'Dein Ideen-Check sagt «anpassen»: Idee schärfen, dann den Check wiederholen. ' : ''}Phase ${p.id} «${p.titel}» (Etappe ${p.etappe}), Bild: ${p.bild}.`;
    if (f.zusatz) hinweise.push(f.zusatz);
    if (mitAbo.length) hinweise.push(`${mitAbo.map((m) => `Die Methode \`${m}\``).join(' und ')} gehört zum Abo; ohne Abo führt ${f.text} allein durch die Phase.`);
    const q = F.phasen[erledigt + 1];
    // Nach dem Livegang auf dem Weg Geschäft die erste Methode der Etappe Landen, mit Gratis der freie Weg (wie lage, steu-06)
    const landen = geschaeft && st !== 'gratis' ? F.nach_live.landen.geschaeft?.[0] : undefined;
    danach = q ? `Phase ${q.id} «${q.titel}» mit ${fuer(q).text}`
      : `nach dem Livegang ${landen ? methodeText([landen]) : skill(F.nach_live.aendern.skill)}${geschaeft && !landen ? '; die Etappe Landen mit den Methoden gehört zum Abo' : ''}`;
  } else if (geschaeft && st !== 'gratis') {
    [jetzt, grund] = [methodeText([F.nach_live.landen.geschaeft?.[0] ?? 'zahlen']), `Deine Seite ist live, alle ${F.phasen.length} Phasen sind geschafft. Jetzt kommt die Etappe Landen: sichtbar werden und die ersten Kundinnen und Kunden gewinnen.`];
    danach = `${skill('landung')}, sobald du in ein eigenes Haus umziehen willst`;
  } else {
    [jetzt, grund] = [skill(F.nach_live.aendern.skill), `Deine Seite ist live, alle ${F.phasen.length} Phasen sind geschafft. Änderungen gehen klein (${F.nach_live.aendern.klein.join(', ')}) oder gross (${F.nach_live.aendern.gross.join(', ')}).`];
    if (geschaeft) hinweise.push('Die Etappe Landen mit den Methoden gehört zum Abo; den Link gibt upgrade_link, wenn die Person es will.');
    danach = merk('seite') || merk('server') ? `${skill('landung')}, sobald du in ein eigenes Haus umziehen willst` : `${skill('statistik')}, sobald du wissen willst, wer deine Seite besucht`;
  }
  zeilen.push(`Jetzt dran: ${jetzt}. Grund: ${grund}`, ...(merk('erfassung') ? [] : [HINWEIS_ERFASSUNG]), ...hinweise.slice(0, 2).map((h) => `Hinweis: ${h}`));
  if (phaseDran && p) {
    for (const q of p.pflichtfragen.filter((x) => !frageBelegt(F, p, x, dateien))) zeilen.push(`Pflichtfragen offen: ${q.id}: ${q.frage.de} (${wer(p, q)})`);
    zeilen.push(`Ergebnis: ${p.ergebnis.map((x) => (x.zeilen?.length ? `${x.datei} mit ${x.zeilen.map((z) => `«${z}»`).join(', ')}` : x.datei)).join('; ')}.`);
    // In P13 je Wohnort (fahrplan.yaml: insel_je_wohnort), aus «Wohnort:» in den Belegen, sonst aus dem Abo der Attrappe
    const melden = bisAbschluss(F, p, wohnort);
    zeilen.push(`Fertig, wenn: ${p.gate} Dann schritt_melden mit ${melden.map((x) => `«${x}»`).join(', ')}${melden.length > 1 ? ', je sobald geschafft' : ''}.`);
    if (st === 'gratis' && erledigt <= gratisBis) zeilen.push(`Hinweis: ${GRATIS_HINWEIS}`);
    zeilen.push(`Modus: ${modus}. ${F.modus[modus]}`);
    if (modus === 'lernen') zeilen.push(...lektion(p, weg, st));
  }
  // Was die Belege über die Insel hinaus belegen, fehlt auf der Insel noch (wie lage)
  const nachmelden = F.phasen.slice(nachInsel, nachDateien).flatMap((q) => bisAbschluss(F, q, wohnort)).filter((x) => rang(x) > rang(insel()));
  if (entscheid !== 'anpassen' && nachmelden.length) zeilen.push(`Auf der Insel fehlt noch: ${nachmelden.map((x) => `«${x}»`).join(', ')} (nach den Belegen schon geschafft). Melde sie mit schritt_melden, der Reihe nach.`);
  if (danach) zeilen.push(`Danach: ${danach}.`);
  const [n, server, s, i] = [schloesser(), merk('server'), seiteName(), insel()];
  zeilen.push(`Stand: ${[
    `Weg ${weg === 'webseite' ? 'Webseite' : weg === 'geschaeft' ? 'Geschäft' : 'offen'}`,
    `Abo ${STUFEN[st] ?? st}`,
    server ? `Server ${server} bereit, ${n} Schlösser` : s ? `Seite https://${s}.aufwind.sh ${stand(s)}, ${n} Schlösser` : null,
    `Projekt projekt ${i ? `auf der Insel bei «${i}»` : 'noch nicht auf der Insel'}`,
    p ? `Phase ${p.id} von ${F.phasen.length} (geschafft nach Insel: ${bisText(nachInsel)}${nachDateien > nachInsel ? `, nach Belegen weiter: ${bisText(nachDateien)}` : ''})` : `alle ${F.phasen.length} Phasen geschafft`,
  ].filter(Boolean).join(' · ')}.`);
  return { text: zeilen.join('\n') };
}

// ———— Weitere Werkzeuge mit Zustand ————
const ART: Record<string, string> = { selbst: 'selbst gemacht', kontrollfrage: 'Kontrollfrage beantwortet', wiederholung: 'wiederholt' };
const MIT_ZUSTAND: Record<string, (a: Args) => Antwort> = {
  lage,
  schritt_melden: (a) => {
    const s = String(a.schritt);
    const projekt = typeof a.projekt === 'string' && a.projekt ? a.projekt : 'projekt';
    const vorher = projekt === 'projekt' ? insel() : merk(`insel-${projekt}`);
    const neu = rang(s) > rang(vorher);
    if (neu) setze(projekt === 'projekt' ? 'insel' : `insel-${projekt}`, s);
    const phase = F.phasen.find((p) => p.insel.includes(s))!;
    const adresse = `https://albatros.build${a.sprache && a.sprache !== 'de' ? `/${String(a.sprache)}` : ''}/cockpit/insel`;
    return { text: neu ? `Auf der Insel steht ${projekt} jetzt bei «${s}» (${s}, Phase ${phase.id}). Ruf lage erneut auf. Insel: ${adresse}`
      : `${projekt} war schon bei «${vorher}»; nichts geändert, diesen Schritt nicht nochmals melden. Insel: ${adresse}` };
  },
  weg_waehlen: (a) => { setze('weg', String(a.weg)); return { text: `Weg gespeichert: ${a.weg === 'webseite' ? 'Webseite' : 'Geschäft'}.` }; },
  modus_waehlen: (a) => {
    const m = a.modus === 'lernen' ? 'lernen' : 'machen';
    setze('modus', m);
    return { text: [`Modus gespeichert: ${m}, als Vorgabe für neue Projekte.`, `Für dich als KI gilt laut Fahrplan: ${F.modus[m]}`,
      `Im Projekt gilt die Zeile «Modus:» in docs/projekt.md: Trag dort «Modus: ${m}» ein; andere Projekte behalten ihren Modus. Wechseln geht jederzeit.`].join('\n') };
  },
  verstanden_melden: (a) => {
    const m = missionen.find((x) => x.id === a.mission);
    if (!m) return { fehler: true, text: `Die Mission ${String(a.mission)} gibt es nicht. Nimm die Kennung, wie lage oder mission_holen sie nennt.` };
    const schon = (merk('verstanden') ?? '').split('\n').includes(`${m.id} ${String(a.art)}`);
    if (!schon && HAFEN) appendFileSync(join(HAFEN, 'verstanden'), `${m.id} ${String(a.art)}\n`);
    return { text: `${schon ? 'War schon notiert' : 'Notiert'}: «verstanden» für ${m.id} («${m.titel}»), ${ART[String(a.art)]}.\nWiederholung: in etwa einer Woche, zu Beginn einer Sitzung.` };
  },
  // Missionen wie flugschule: Prüfung insel besteht, sobald der Schritt auf der Insel steht; andere Prüfungen (Datei, http, git) kann die
  // Attrappe nicht sehen und lässt sie gelten
  mission_pruefen: (a) => {
    const m = missionen.find((x) => x.id === a.mission);
    if (!m) return { fehler: true, text: `Die Mission ${String(a.mission)} gibt es nicht.` };
    const fehlt = (m.pruefung ?? []).filter((x) => x.typ === 'insel' && rang(insel()) < rang(x.schritt ?? null));
    if (fehlt.length) return { text: `Noch nicht bestanden: ${fehlt.map((x) => `Auf der Insel steht projekt noch nicht bei «${x.schritt}».`).join(' ')}` };
    const schon = (merk('flugbuch') ?? '').split('\n').includes(m.id);
    if (!schon && HAFEN) appendFileSync(join(HAFEN, 'flugbuch'), `${m.id}\n`);
    return { text: schon ? 'Prüfung bestanden. Die Mission stand schon im Flugbuch.' : 'Prüfung bestanden. Eintrag im Flugbuch gemacht.' };
  },
  mission_holen: () => {
    const p = F.phasen[erledigtNachInsel(F, insel())];
    const fertig = (merk('flugbuch') ?? '').split('\n');
    const m = missionen.find((x) => x.phase === p?.id && !x.optional && (x.weg === 'flugschule' || x.weg === merk('weg')) && !fertig.includes(x.id));
    if (!m) return { text: p ? `Keine offene Mission in Phase ${p.id}. Was jetzt dran ist, sagt lage.` : 'Alle Missionen des Fahrplans sind geschafft.' };
    const pruefung = (m.pruefung ?? []).map((x) => (x.typ === 'insel' ? `Insel bei «${x.schritt}»` : x.typ)).join(', ');
    return { text: `Aktuelle Mission: ${m.id} («${m.titel}»), Phase ${m.phase}. Skill: ${m.skill ?? 'lotse'}. Prüfung: ${pruefung || 'keine'}.` };
  },
  skill_holen: (a) => {
    const f = join(QUELLE, 'plugins/albatros/skills', String(a.slug), 'SKILL.md');
    if (!/^[a-z0-9-]{1,64}$/.test(String(a.slug)) || !existsSync(f)) {
      return { fehler: true, text: `Den Skill ${String(a.slug)} gibt es bei Albatros nicht. Nimm den Slug genau so, wie lage ihn nennt (im Zweifel lage nochmals aufrufen); eine Methode für den Weg Geschäft holst du mit dem Werkzeug methode.` };
    }
    return { text: `Skill ${String(a.slug)} in der aktuellen Fassung von Albatros. Folge dieser Anleitung statt einer älteren Kopie.\n\n${readFileSync(f, 'utf8').replace(/^---[\s\S]*?---\s*/, '')}` };
  },
  // Mit einverstanden ist die Einwilligung gesetzt (wie flugschule über konto): danach kein Hinweis zur Erfassung mehr in lage
  luecke_melden: (a) => {
    if (a.einverstanden === undefined) {
      return { fehler: true, text: 'Bevor Albatros Meldungen speichert, frag die Person: «Darf Albatros solche Fragen mit deinem Konto speichern, damit die Skills besser werden? Du siehst sie im Cockpit und kannst sie dort löschen.» Ruf luecke_melden danach mit einverstanden: true oder false nochmals auf.' };
    }
    setze('erfassung', a.einverstanden === false ? 'nein' : 'ja');
    return a.einverstanden === false ? { text: 'Nichts gespeichert. Albatros speichert keine Meldungen mehr von dieser Person.' }
      : { text: 'Gespeichert, danke: Damit werden die Skills von Albatros besser. Die Person sieht ihre Meldungen im Cockpit und kann sie dort löschen.' };
  },
  upgrade_link: (a) => {
    const ziel = a.stufe === 'light' ? 'light' : 'pilot';
    if (stufe() !== 'gratis') return { text: 'Du hast schon ein Abo. Wechseln oder kündigen kannst du im Kundenportal: https://albatros.build/cockpit/abo' };
    const erledigt = erledigtNachInsel(F, insel());
    if (a.bestaetigt !== true && erledigt <= gratisBis) {
      return { text: `${GRATIS_HINWEIS} Du stehst bei Phase ${F.phasen[erledigt]!.id}; den Link zum Abo gibt es ab ${F.phasen[gratisBis + 1]?.id ?? 'dem Wohnort'}. Will die Person das Abo trotzdem schon jetzt, ruf upgrade_link nach ihrem ausdrücklichen Ja nochmals mit bestaetigt: true auf.` };
    }
    setze('abo', ziel); // die Attrappe tut, als wäre bezahlt
    return { text: `Link zur Zahlungsseite (${STUFEN[ziel]}, CHF ${PREIS[ziel]} pro Monat): https://albatros.build/abo/checkout/${ziel}\nDie Karte gibst du nur dort ein. Danach mit konto_status prüfen, ob das Abo aktiv ist.` };
  },
  methode: (a) => {
    const vorhanden = existsSync(METHODEN) ? readdirSync(METHODEN).filter((n) => existsSync(join(METHODEN, n, 'SKILL.md'))).sort() : [];
    const gratis = stufe() === 'gratis';
    const liste = vorhanden.map((n) => `- ${n}${gratis && !freieMethoden.includes(n) ? ' (mit Abo)' : ''}`).join('\n');
    if (typeof a.name !== 'string' || !a.name) return { text: `Methoden für den Weg Geschäft:\n${liste || freieMethoden.map((n) => `- ${n}`).join('\n')}` };
    if (gratis && !freieMethoden.includes(a.name)) return { text: `Die Methode ${a.name} gehört zum Abo. Ohne Abo gehen: ${freieMethoden.join(', ')}. Den Link zum Abo gibt upgrade_link, wenn die Person es will.` };
    if (vorhanden.includes(a.name)) return { text: readFileSync(join(METHODEN, a.name, 'SKILL.md'), 'utf8').replace(/^---[\s\S]*?---\s*/, '').trim() };
    return vorhanden.length ? { fehler: true, text: `Die Methode ${a.name} gibt es nicht. Vorhanden:\n${liste}` }
      : { text: `Methode ${a.name}: Im Durchspiel ohne albatros-methoden (DURCHSPIEL_METHODEN) gibt es keinen Text. Arbeite mit dem, was lage und die Skills sagen.` };
  },
  konto_status: () => {
    const [st, n, s, server, weg] = [stufe(), schloesser(), seiteName(), merk('server'), merk('weg')];
    return { text: [
      `Angemeldet. Abo: ${st === 'gratis' ? 'Gratis (Skills, Missionen und der Fahrplan bis zur fertigen Seite auf deinem Computer; keine Seite im Netz, kein Server)' : `${STUFEN[st]} (CHF ${PREIS[st]} pro Monat, aktiv)`}.`,
      'Light kostet CHF 15 pro Monat (eine Webseite unter name.aufwind.sh, auch mit eigener Domain, ohne eigenen Server), Pilot CHF 40 pro Monat (eigener Server mit 4 GB Arbeitsspeicher und 40 GB Speicher, Fliessband, tägliche Fotos, eigene Domains).',
      server ? `Server: ${server} (bereit). SSH: ssh ${server}@aufwind.sh. Hafen (Git): git@aufwind.sh:${server}/projekt.git, im Browser https://code.aufwind.sh/${server}/projekt.`
        : s ? `Seite: https://${s}.aufwind.sh (${stand(s)}). Hafen (Git): git@aufwind.sh:${s}/projekt.git, im Browser https://code.aufwind.sh/${s}/projekt.` : 'Server: keiner. Seite: keine.',
      `Weg: ${weg === 'webseite' ? 'Webseite' : weg === 'geschaeft' ? 'Geschäft' : 'noch nicht gewählt'}.`,
      `Hinterlegte Schlösser: ${n ? `${n} (ssh-ed25519 …@laptop)` : 'keine (Werkzeug schluessel_hinterlegen)'}. Guthaben für Bilder: CHF 5.00.`,
    ].join(' ') };
  },
  schluessel_hinterlegen: (a) => {
    if (!/^(ssh-ed25519|ssh-rsa|ecdsa-sha2-nistp256) [A-Za-z0-9+/=]{20,}/.test(String(a.schluessel).trim())) {
      return { fehler: true, text: 'Das ist kein öffentlicher Schlüssel. Gib nur den Inhalt der Datei mit .pub am Ende mit, nie den privaten Schlüssel.' };
    }
    setze('schloesser', String(schloesser() + 1));
    return { text: `Schloss hinterlegt. Hinterlegte Schlösser: ${schloesser()}.` };
  },
};

function antwort(werkzeug: string, a: Args): Antwort | null {
  if ((werkzeug === 'seite_erstellen' || werkzeug === 'server_erstellen') && HAFEN && /^[a-z0-9-]{3,32}$/.test(String(a.name ?? ''))) {
    const ziel = join(HAFEN, String(a.name), 'projekt.git');
    if (!existsSync(ziel)) spawnSync('git', ['clone', '-q', '--bare', join(HAFEN, 'vorlage.git'), ziel]);
    setze('seite', String(a.name));
    if (werkzeug === 'server_erstellen') setze('server', String(a.name));
  }
  const fest = fallOrdner ? text(fallOrdner, werkzeug, a) : null;
  if (fest !== null) return { text: fest };
  if (MIT_ZUSTAND[werkzeug]) return MIT_ZUSTAND[werkzeug](a);
  for (const o of ordner) {
    const t = text(o, werkzeug, a);
    if (t !== null) return { text: t };
  }
  return null;
}

type Schema = { name: string; description: string; inputSchema: { required?: string[]; properties?: Record<string, { type?: string; enum?: unknown[] }> } };
const ECHT: Schema[] = JSON.parse(readFileSync(join(wurzel, 'scripts/durchspiel/mocks/werkzeuge.json'), 'utf8'));
const ANLEITUNG = readFileSync(join(wurzel, 'scripts/durchspiel/mocks/anleitung.txt'), 'utf8').trim();
const mitText = (n: string) => [...(fallOrdner ? [fallOrdner] : []), ...ordner].some((o) => existsSync(join(o, `${n}.md`)));
const werkzeuge = ECHT.filter((w) => MIT_ZUSTAND[w.name] || mitText(w.name));
// Wie zod im echten Dienst: Pflichtfelder, erlaubte Werte (schritt_melden: die 19 Schritte der Insel), Typ
const ungueltig = (name: string, a: Args) => {
  const s = ECHT.find((w) => w.name === name)?.inputSchema;
  const fehlt = (s?.required ?? []).filter((k) => a[k] === undefined).map((k) => `${k}: Invalid input: expected string, received undefined`);
  const falsch = Object.entries(s?.properties ?? {}).flatMap(([k, p]) => {
    if (a[k] === undefined) return [];
    if (p.enum && !p.enum.includes(a[k])) return [`${k}: Invalid option: expected one of ${p.enum.map((x) => `"${String(x)}"`).join('|')}`];
    if (p.type && p.type !== 'array' && p.type !== 'object' && typeof a[k] !== p.type) return [`${k}: Invalid input: expected ${p.type}, received ${typeof a[k]}`];
    return [];
  });
  return [...fehlt, ...falsch];
};

const runde = () => { const f = process.env.DURCHSPIEL_RUNDE; return f && existsSync(f) ? Number(readFileSync(f, 'utf8').trim()) : null; };
const senden = (x: unknown) => process.stdout.write(`${JSON.stringify(x)}\n`);
let puffer = '';
process.stdin.on('data', (d) => {
  puffer += d;
  let i;
  while ((i = puffer.indexOf('\n')) >= 0) {
    const zeile = puffer.slice(0, i).trim();
    puffer = puffer.slice(i + 1);
    if (!zeile) continue;
    const m = JSON.parse(zeile);
    if (m.id === undefined) continue; // Benachrichtigungen
    if (m.method === 'initialize') {
      senden({ jsonrpc: '2.0', id: m.id, result: { protocolVersion: m.params?.protocolVersion ?? '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'albatros-attrappe', version: '2' }, instructions: ANLEITUNG } });
    } else if (m.method === 'tools/list') {
      senden({ jsonrpc: '2.0', id: m.id, result: { tools: werkzeuge } });
    } else if (m.method === 'tools/call') {
      const name = String(m.params?.name ?? '');
      const a: Args = m.params?.arguments ?? {};
      const fehler = ungueltig(name, a);
      const r: Antwort = fehler.length ? { fehler: true, text: `Ungültige Angaben: ${fehler.join(', ')}` }
        : werkzeuge.some((w) => w.name === name) ? antwort(name, a) ?? { fehler: true, text: `Werkzeug ${name} gibt es nicht.` } : { fehler: true, text: `Werkzeug ${name} gibt es nicht.` };
      process.stderr.write(`[attrappe] ${name} ${JSON.stringify(a)}\n`);
      if (process.env.DURCHSPIEL_LOG) appendFileSync(process.env.DURCHSPIEL_LOG, `${JSON.stringify({ zeit: new Date().toISOString(), runde: runde(), werkzeug: name, argumente: a, fehler: r.fehler ?? false })}\n`);
      senden({ jsonrpc: '2.0', id: m.id, result: { content: [{ type: 'text', text: r.text }], ...(r.fehler ? { isError: true } : {}) } });
    } else {
      senden({ jsonrpc: '2.0', id: m.id, result: {} });
    }
  }
});
