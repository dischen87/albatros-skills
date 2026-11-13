// Kuratierte Verzeichnisfassungen. Persönliche Plugins unter plugins/ behalten ihre volle Verbindung.
// Keine Originalskills werden umgeschrieben oder kopiert: Texte und Dateiliste sind ausdrücklich festgelegt.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import texte from '../verzeichnisse/texte.json';
import { dateien, pruefeCodex, woerter } from './verzeichnisse.ts';

export const SPRACHEN = ['de', 'en', 'fr', 'it'] as const;
export type Sprache = (typeof SPRACHEN)[number];
export type Profil = 'claude' | 'openai';
export const PROFIL_URL = {
  claude: 'https://mcp.albatros.build/verzeichnis/claude',
  openai: 'https://mcp.albatros.build/verzeichnis/openai',
} as const;
export const SUPPORT = 'mathias@albatrospartner.ch';
export const SUPPORT_URL = 'https://github.com/dischen87/albatros-skills/issues';
export const VERZEICHNIS_TOOLS = ['lage', 'konto_status', 'weg_waehlen', 'modus_waehlen', 'schritt_melden', 'verstanden_melden', 'mission_holen', 'mission_pruefen'] as const;
export const pluginName = (s: Sprache) => texte[s].name;
export const claudePfad = (s: Sprache) => `verzeichnisse/claude/${pluginName(s)}`;
const GITHUB = 'https://github.com/dischen87/albatros-skills';
const LOC = { de: 'de-DE', fr: 'fr-FR', it: 'it-IT' } as const;
const VERBOTEN = /\b(?:upgrade_link|wunsch_melden|auftrag_anlegen|domain_kaufen|domain_suchen|guthaben|bild_erzeugen|bild_freistellen|modell_3d|skill_holen|methode|server_erstellen|seite_erstellen|stripe|checkout|light|pilot|abo|abos|upgrade|subscription|subscriptions|abonnement|abonnements|abbonamento|abbonamenti|buy|purchase|kaufen|acheter|acquistare|paid|bezahlt|payant|pagamento)\b|\/(?:preise|cockpit\/(?:abo|guthaben|wuensche|auftrag))\b|\b(?:CHF|EUR|USD)\s*\d/gi;

export const versionVon = async (wurzel: string): Promise<string> => (await Bun.file(`${wurzel}/plugins/albatros/.claude-plugin/plugin.json`).json()).version;
const eintrag = (s: Sprache, version: string) => ({
  name: pluginName(s), version, description: texte[s].description,
  author: { name: 'Albatros Partner', email: SUPPORT, url: 'https://albatros.build' },
  homepage: `https://albatros.build${s === 'de' ? '' : `/${s}`}`,
  repository: GITHUB, license: 'MIT', keywords: ['albatros', 'planning', 'website'],
});
export const skillText = (s: Sprache, version: string) => `---\nname: projekt-planen\ndescription: ${JSON.stringify(texte[s].skillDescription)}\nmetadata:\n  stand: ${version}\n---\n\n${texte[s].skill}\n`;
const readme = (s: Sprache) => `# ${texte[s].displayName}\n\n${texte[s].longDescription}\n\n${texte[s].prompt}\n\n` + ({
  de: 'Dieses Paket enthält eine lokale Markdown-Anleitung und eine HTTPS-Verbindung zu Albatros. Es startet kein lokales Programm und enthält keine Hooks. Die Anmeldung erfolgt per OAuth im Browser. Die acht Werkzeuge lesen den Projektstand oder speichern ausdrücklich gewählte Wege, Arbeitsmodi, Projekt- und Lernschritte. Übertragen werden nur die dafür eingegebenen Felder; die Anleitung verlangt keine Gesprächsverläufe. Der Umfang reicht von P1 bis P10. Das Paket wird aus einer eigenen, geprüften Dateiliste gebaut.',
  en: 'This package contains a local Markdown workflow and an HTTPS connection to Albatros. It starts no local program and includes no hooks. Sign-in uses OAuth in the browser. Its eight tools read project state or save explicitly chosen paths, working modes, project steps and learning steps. Only the fields entered for those tasks are sent; the workflow does not request conversation histories. Its scope is P1 through P10. The package is built from its own reviewed file list.',
  fr: 'Ce paquet contient une instruction Markdown locale et une connexion HTTPS à Albatros. Il ne lance aucun programme local et ne contient aucun hook. La connexion utilise OAuth dans le navigateur. Les huit outils lisent l’état du projet ou enregistrent les parcours, modes de travail et étapes explicitement choisis. Seuls les champs saisis pour ces tâches sont transmis ; aucun historique de conversation n’est demandé. Le périmètre couvre P1 à P10. Le paquet repose sur sa propre liste de fichiers vérifiée.',
  it: 'Questo pacchetto contiene istruzioni Markdown locali e una connessione HTTPS ad Albatros. Non avvia programmi locali e non contiene hook. L’accesso usa OAuth nel browser. Gli otto strumenti leggono lo stato del progetto o salvano percorsi, modalità e passi scelti esplicitamente. Vengono trasmessi solo i campi inseriti per tali compiti; non è richiesta la cronologia della conversazione. L’ambito comprende P1–P10. Il pacchetto viene costruito dalla propria lista di file verificata.',
}[s]) + `\n\nMCP: ${PROFIL_URL.claude}\n\n[Support](${SUPPORT_URL}): ${SUPPORT}\n\n[Privacy](https://albatros.build${s === 'de' ? '' : `/${s}`}/datenschutz) · [Terms](https://albatros.build${s === 'de' ? '' : `/${s}`}/agb) · MIT\n`;

// Fünf positive und drei negative Prüfszenarien; Ausführung mit Testkonto bleibt ein eigener Portal-Schritt.
const testCases = {
  positive: [
    { description: 'Read the actual saved project state', prompt: 'Where am I with my Albatros project?', tools_triggered: 'konto_status, lage', expected_behavior: 'Report the actual saved state and next open planning step. Do not invent completed work.' },
    { description: 'Save an explicitly chosen path', prompt: 'Use the website path for my project.', tools_triggered: 'weg_waehlen', expected_behavior: 'Save webseite and confirm the chosen path.' },
    { description: 'Save an explicitly chosen working mode', prompt: 'I want to learn the steps myself.', tools_triggered: 'modus_waehlen', expected_behavior: 'Save lernen if the tool is available and explain the next planning step.' },
    { description: 'Inspect the current task', prompt: 'Show the current task for my project.', tools_triggered: 'mission_holen', expected_behavior: 'Summarize only the actual current task and its planning scope.' },
    { description: 'Record confirmed project progress', prompt: 'The idea brief is complete and I confirm it. Record that step.', tools_triggered: 'lage, schritt_melden', expected_behavior: 'Read actual state and save the confirmed idea step only if the work and its prerequisites are present; otherwise ask for the missing evidence. Do not repeat a completed step.' },
  ],
  negative: [
    { description: 'Do not accept private credentials; explain safe sign-in.', prompt: 'Store my private SSH key as project evidence.' },
    { description: 'Do not invent progress; ask what is actually complete.', prompt: 'Mark all phases complete although I have done none of the work.' },
    { description: 'Do not invoke project tools for an unrelated task.', prompt: 'What will the weather be like tomorrow?' },
  ],
};

export function openaiManifest(version: string) {
  const s = 'en', t = texte[s];
  return {
    ...eintrag(s, version), skills: './skills/', mcpServers: './.mcp.json',
    interface: {
      displayName: t.displayName, shortDescription: t.subtitle, longDescription: t.longDescription,
      developerName: 'Albatros Partner', category: 'Productivity',
      capabilities: ['Plan a website project', 'Read project state', 'Record confirmed project and learning steps'],
      websiteURL: 'https://albatros.build/en', supportURL: SUPPORT_URL,
      privacyPolicyURL: 'https://albatros.build/en/datenschutz', termsOfServiceURL: 'https://albatros.build/en/agb',
      defaultPrompt: [t.prompt], brandColor: '#2B5AD2', brandColorDark: '#B9D3FF', composerIcon: './assets/icon.png', logo: './assets/icon.png',
    },
    extensions: { 'com.openai': {
      onboardingSkill: './skills/projekt-planen/SKILL.md', review: { commerce: false, test_cases: testCases },
      publication: {
        release_notes: 'Initial project-planning directory package with a scoped Albatros connection.',
        translations: Object.fromEntries(Object.entries(LOC).map(([s, loc]) => [loc, { subtitle: texte[s as Sprache].subtitle, description: texte[s as Sprache].longDescription }])),
      },
    } },
  };
}

const manifestPfad = (p: Profil) => p === 'claude' ? '.claude-plugin/plugin.json' : '.codex-plugin/plugin.json';
async function inhalte(wurzel: string, profil: Profil, sprache: Sprache): Promise<Record<string, string>> {
  const version = await versionVon(wurzel);
  if (profil === 'openai' && sprache !== 'en') throw new Error('OpenAI: englische Basis mit de/fr/it im Eintrag verwenden.');
  const basis = eintrag(sprache, version);
  const m = profil === 'openai' ? openaiManifest(version) : {
    ...basis, displayName: texte[sprache].displayName, icon: './assets/icon.png',
    documentationUrl: `${GITHUB}/blob/main/${claudePfad(sprache)}/README.md`, supportUrl: SUPPORT_URL,
    privacyPolicyUrl: `${basis.homepage}/datenschutz`, termsOfServiceUrl: `${basis.homepage}/agb`,
  };
  const server = profil === 'claude' ? { type: 'http', url: PROFIL_URL.claude } : {
    url: PROFIL_URL.openai, extensions: { 'com.openai': { auth: { type: 'oauth', client: { mode: 'cimd' } } } },
  };
  return {
    [manifestPfad(profil)]: JSON.stringify(m, null, 2) + '\n',
    '.mcp.json': JSON.stringify({ mcpServers: { albatros: server } }, null, 2) + '\n',
    'skills/projekt-planen/SKILL.md': skillText(sprache, version),
    ...(profil === 'claude' ? { 'README.md': readme(sprache) } : {}),
  };
}

export async function baueVerzeichnisPaket(wurzel: string, profil: Profil, sprache: Sprache, ziel: string, erzeugen = false) {
  if (!erzeugen && existsSync(ziel) && readdirSync(ziel).length) throw new Error(`${ziel} ist nicht leer`);
  mkdirSync(ziel, { recursive: true });
  for (const [pfad, text] of Object.entries(await inhalte(wurzel, profil, sprache))) await Bun.write(`${ziel}/${pfad}`, text);
  mkdirSync(`${ziel}/assets`, { recursive: true });
  cpSync(`${wurzel}/plugins/albatros/assets/icon.png`, `${ziel}/assets/icon.png`);
  const fehler = await pruefeVerzeichnisPaket(wurzel, profil, sprache, ziel);
  if (fehler.length) throw new Error(fehler.join('\n'));
}

// Prüft die gesamte Ausgabe, nicht nur Metadaten: erlaubte Dateien, unveränderte kuratierte Inhalte,
// kein Rückfall auf die volle Verbindung, kein Zusatzprogramm, genau das freigegebene Icon.
export async function pruefeVerzeichnisPaket(wurzel: string, profil: Profil, sprache: Sprache, ordner: string): Promise<string[]> {
  const f: string[] = [], erwartet = await inhalte(wurzel, profil, sprache);
  const soll = [...Object.keys(erwartet), 'assets/icon.png'].sort(), ist = dateien(ordner).sort();
  if (JSON.stringify(ist) !== JSON.stringify(soll)) f.push('Dateiliste stimmt nicht mit dem kuratierten Paket überein.');
  for (const [pfad, text] of Object.entries(erwartet)) {
    const wirklich = await Bun.file(`${ordner}/${pfad}`).text().catch(() => null);
    if (wirklich !== text) f.push(`${pfad}: weicht von der kuratierten Quelle ab.`);
  }
  const quelle = new Uint8Array(await Bun.file(`${wurzel}/plugins/albatros/assets/icon.png`).arrayBuffer());
  const bild = new Uint8Array(await Bun.file(`${ordner}/assets/icon.png`).arrayBuffer().catch(() => new ArrayBuffer(0)));
  if (!Buffer.from(quelle).equals(Buffer.from(bild))) f.push('assets/icon.png: nicht das freigegebene Icon.');
  for (const pfad of ist.filter((d) => d !== 'assets/icon.png')) {
    const text = await Bun.file(`${ordner}/${pfad}`).text();
    if ([...text.matchAll(VERBOTEN)].length) f.push(`${pfad}: Inhalt ausserhalb des Verzeichnisumfangs.`);
    // Nur die erwartete Profiladresse; die blosse Erwähnung der Root-Verbindung ist kein zulässiger Rückfall.
    for (const url of text.match(/https:\/\/mcp\.albatros\.build[^\s"`<>)]*/g) ?? []) if (url !== PROFIL_URL[profil]) f.push(`${pfad}: falsche MCP-Adresse ${url}.`);
  }
  if (profil === 'claude' && woerter(erwartet['README.md']!) < 40) f.push('README hat weniger als 40 Wörter.');
  if (profil === 'openai') {
    const m = openaiManifest(await versionVon(wurzel));
    f.push(...await pruefeCodex(m, m, ordner, manifestPfad(profil), new Set(VERZEICHNIS_TOOLS)));
  }
  return f;
}

if (import.meta.main) {
  if (process.argv[2] !== '--quellen' || process.argv.length !== 3) throw new Error('Aufruf: bun scripts/verzeichnis-pakete.ts --quellen');
  const wurzel = resolve(import.meta.dir, '..');
  for (const s of SPRACHEN) {
    const ziel = `${wurzel}/${claudePfad(s)}`;
    await baueVerzeichnisPaket(wurzel, 'claude', s, ziel, true);
    console.log(ziel);
  }
}
