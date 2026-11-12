// Plugin-Verzeichnisse (12.11.2026, docs/verzeichnisse.md): Jedes Plugin aus .claude-plugin/marketplace.json trägt die Angaben, die das
// Verzeichnis von Claude, der Marktplatz von Cursor und der Plugin-Katalog von ChatGPT und Codex verlangen. Regeln nach der Doku vom
// 12.11.2026, je mit Quelle:
// - Claude: code.claude.com/docs/en/plugins/manifest-reference.md («Directory listing fields»), claude.com/docs/plugins/pre-submission-checklist.md
//   (README im Plugin-Ordner mit mindestens 40 Wörtern ausserhalb von Code-Blöcken, Lizenz, keine Systemdateien) und die Prüfungen von
//   `claude plugin validate` 2.1.321 (icon: quadratisches PNG, 512 bis 2048 px, unter 2 MB; privacyPolicyUrl bei einem MCP-Server im Netz).
// - Cursor: cursor.com/docs/reference/plugins.md (.cursor-plugin/plugin.json, .cursor-plugin/marketplace.json, mcp.json im Plugin-Ordner,
//   Pfade relativ ohne «..», Logo im Repo) und github.com/cursor/plugin-template (displayName, Quelle «./plugins/…»).
// - ChatGPT und Codex: developers.openai.com/plugins/deploy/submission.md («Manifest fields», «Listing metadata», «Icons», Testfälle) für
//   .codex-plugin/plugin.json im Codex-Format; das Paket für die Einreichung baut scripts/openai-paket.ts.
// Die Verbindung zu Albatros hat überall genau die öffentliche Adresse MCP_URL: So nennt sie mcp selbst als resource in
// https://mcp.albatros.build/.well-known/oauth-protected-resource (gelesen am 12.11.2026); /mcp nimmt mcp auch an, die Anmeldung gilt aber
// für die resource.
import { existsSync, readdirSync, statSync } from 'node:fs';
import { KOPF_STAND } from './stand.ts';

export const MCP_URL = 'https://mcp.albatros.build';
// Das Plugin, das bei ChatGPT und Codex eingereicht wird: Dort steht der Eintrag auf Englisch (übersetzt in publication.translations).
export const OPENAI_PLUGIN = 'albatros-en';
const OPENAI_UEBERSETZUNGEN: Record<string, string> = { 'de-DE': 'albatros', 'fr-FR': 'albatros-fr', 'it-IT': 'albatros-it' };

type Json = Record<string, any>;
const istObjekt = (x: unknown): x is Json => typeof x === 'object' && x !== null && !Array.isArray(x);
const https = (x: unknown) => typeof x === 'string' && /^https:\/\/[^\s@]+$/.test(x);
const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Cursor: «Lowercase, kebab-case (alphanumerics, hyphens, and periods). Must start and end with an alphanumeric character.»
const cursorName = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;
const relativ = (p: unknown) => typeof p === 'string' && p.length > 0 && !p.startsWith('/') && !/^[a-z]+:/i.test(p) && !p.split('/').includes('..');
const ohneCodeBloecke = (t: string) => t.replace(/```[\s\S]*?```/g, ' ');
export const woerter = (t: string) => ohneCodeBloecke(t).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// Breite und Höhe eines PNG aus dem IHDR-Block, null wenn es kein PNG ist
export function pngGroesse(bytes: Uint8Array): { breite: number; hoehe: number } | null {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 24 || sig.some((b, i) => bytes[i] !== b)) return null;
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { breite: v.getUint32(16), hoehe: v.getUint32(20) };
}

// Kontrast nach WCAG zwischen zwei Farben #RRGGBB (OpenAI: brandColor mindestens 2:1 gegen Weiss, brandColorDark gegen #212121)
export function kontrast(a: string, b: string) {
  const l = (h: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!;
  };
  const [x, y] = [l(a), l(b)].sort((m, n) => n - m);
  return (x! + 0.05) / (y! + 0.05);
}

const CURSOR_FELDER = new Set(['name', 'displayName', 'description', 'version', 'author', 'homepage', 'repository', 'license', 'keywords', 'logo', 'rules', 'agents', 'skills', 'commands', 'hooks', 'mcpServers', 'variables']);
const CURSOR_MARKT_EINTRAG = new Set(['name', 'source', 'description', 'version', 'author', 'homepage', 'repository', 'license', 'keywords', 'logo', 'category', 'tags', 'skills', 'rules', 'agents', 'commands', 'hooks', 'mcpServers', 'variables']);
const SYSTEMDATEIEN = /(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini|__MACOSX)(\/|$)/;

async function json(datei: string, fehler: string[], anzeige: string): Promise<Json | null> {
  if (!existsSync(datei)) return (fehler.push(`${anzeige} fehlt`), null);
  try {
    const j = await Bun.file(datei).json();
    return istObjekt(j) ? j : (fehler.push(`${anzeige}: kein JSON-Objekt`), null);
  } catch (e) {
    return (fehler.push(`${anzeige}: kein gültiges JSON (${(e as Error).message})`), null);
  }
}

// Bild im Plugin: vorhanden, PNG, quadratisch, Kante zwischen min und max, kleiner als maxBytes
async function bild(ordner: string, pfad: string, anzeige: string, min: number, max: number, maxBytes: number): Promise<string[]> {
  const datei = `${ordner}/${pfad.replace(/^\.\//, '')}`;
  if (!existsSync(datei)) return [`${anzeige}: ${pfad} gibt es nicht`];
  const bytes = new Uint8Array(await Bun.file(datei).arrayBuffer());
  const g = pngGroesse(bytes);
  if (!g) return [`${anzeige}: ${pfad} ist kein PNG`];
  const f: string[] = [];
  if (g.breite !== g.hoehe) f.push(`${anzeige}: ${pfad} ist nicht quadratisch (${g.breite}×${g.hoehe})`);
  if (g.breite < min || g.breite > max) f.push(`${anzeige}: ${pfad} hat ${g.breite} px, erlaubt ${min} bis ${max}`);
  if (bytes.length >= maxBytes) f.push(`${anzeige}: ${pfad} hat ${bytes.length} Bytes, erlaubt unter ${maxBytes}`);
  return f;
}

// Werkzeuge des Servers albatros (echte Liste aus mcp, scripts/attrappen.ts)
async function werkzeugnamen(wurzel: string): Promise<Set<string>> {
  const t = await Bun.file(`${wurzel}plugins/albatros/evals/mocks/albatros/_tools.json`).json().catch(() => null);
  const liste: unknown[] = Array.isArray(t) ? t : istObjekt(t) && Array.isArray(t.tools) ? t.tools : [];
  return new Set(liste.flatMap((x) => (istObjekt(x) && typeof x.name === 'string' ? [x.name] : [])));
}

export async function pruefeVerzeichnisse(wurzel: string): Promise<string[]> {
  if (!wurzel.endsWith('/')) wurzel += '/';
  const fehler: string[] = [];
  const markt = await json(`${wurzel}.claude-plugin/marketplace.json`, fehler, '.claude-plugin/marketplace.json');
  if (!markt) return fehler;
  const eintraege = (Array.isArray(markt.plugins) ? markt.plugins : []) as { name: string; source: string }[];
  const version = (await Bun.file(`${wurzel}plugins/albatros/.claude-plugin/plugin.json`).json().catch(() => ({}))).version as string;
  const werkzeuge = await werkzeugnamen(wurzel);
  const git = Bun.spawnSync(['git', '-C', wurzel, 'ls-files'], { stderr: 'ignore' });
  const imRepo = git.exitCode === 0 ? git.stdout.toString().split('\n') : [];

  // Cursor: Marktplatz im Repo mit denselben Plugins wie der von Claude
  const cm = await json(`${wurzel}.cursor-plugin/marketplace.json`, fehler, '.cursor-plugin/marketplace.json');
  if (cm) {
    const a = '.cursor-plugin/marketplace.json';
    if (typeof cm.name !== 'string' || !kebab.test(cm.name)) fehler.push(`${a}: name muss kebab-case sein`);
    if (!istObjekt(cm.owner) || typeof cm.owner.name !== 'string' || !cm.owner.name) fehler.push(`${a}: owner.name fehlt`);
    const cp = (Array.isArray(cm.plugins) ? cm.plugins : []) as Json[];
    const soll = eintraege.map((p) => `${p.name} ${p.source}`).join(', ');
    const ist = cp.map((p) => `${p.name} ${typeof p.source === 'string' ? p.source : JSON.stringify(p.source)}`).join(', ');
    if (soll !== ist) fehler.push(`${a}: Plugins «${ist}», in .claude-plugin/marketplace.json «${soll}»`);
    if (new Set(cp.map((p) => p.name)).size !== cp.length) fehler.push(`${a}: Plugin-Namen nicht eindeutig`);
    for (const p of cp) {
      for (const k of Object.keys(p)) if (!CURSOR_MARKT_EINTRAG.has(k)) fehler.push(`${a}: ${p.name}: Feld ${k} kennt Cursor nicht`);
      if (!relativ(p.source)) fehler.push(`${a}: ${p.name}: source muss ein relativer Pfad ohne «..» sein`);
    }
  }

  for (const { name, source } of eintraege) {
    const ordner = `${wurzel}${source.replace(/^\.\//, '')}`;
    const kurz = source.replace(/^\.\//, '');
    const claude = await json(`${ordner}/.claude-plugin/plugin.json`, fehler, `${kurz}/.claude-plugin/plugin.json`);
    if (!claude) continue;

    // Claude: Felder für das Verzeichnis, README und Systemdateien im Plugin-Ordner
    const ca = `${kurz}/.claude-plugin/plugin.json`;
    if (typeof claude.displayName !== 'string' || !claude.displayName.trim()) fehler.push(`${ca}: displayName fehlt`);
    if (!istObjekt(claude.author) || !claude.author.name) fehler.push(`${ca}: author.name fehlt`);
    if (typeof claude.license !== 'string' || !claude.license) fehler.push(`${ca}: license fehlt`);
    for (const f of ['homepage', 'documentationUrl', 'supportUrl', 'privacyPolicyUrl', 'termsOfServiceUrl']) if (!https(claude[f])) fehler.push(`${ca}: ${f} muss eine https-Adresse sein`);
    if (!relativ(claude.icon) || !String(claude.icon).startsWith('./')) fehler.push(`${ca}: icon muss ein Pfad im Plugin sein, mit ./ vorne`);
    else fehler.push(...(await bild(ordner, claude.icon, ca, 512, 2048, 2 * 1024 * 1024)));
    const readme = existsSync(`${ordner}/README.md`) ? await Bun.file(`${ordner}/README.md`).text() : null;
    if (readme === null) fehler.push(`${kurz}/README.md fehlt (Verzeichnis von Claude und Cursor zeigen sie an)`);
    else {
      if (woerter(readme) < 40) fehler.push(`${kurz}/README.md: ${woerter(readme)} Wörter ausserhalb von Code-Blöcken, verlangt mindestens 40`);
      // Was das Plugin startet und wohin es sich verbindet, steht in der README (Sicherheitsprüfung von Claude)
      for (const w of [MCP_URL, KOPF_STAND, 'albatros-arbeitsplatz', '127.0.0.1', claude.privacyPolicyUrl]) if (typeof w === 'string' && !readme.includes(w)) fehler.push(`${kurz}/README.md: «${w}» fehlt`);
      if (/\]\(\.\.\//.test(readme)) fehler.push(`${kurz}/README.md: Link mit ../ zeigt aus dem Plugin hinaus (installiert wird nur der Plugin-Ordner)`);
    }
    for (const d of imRepo) if (d.startsWith(`${kurz}/`) && SYSTEMDATEIEN.test(d)) fehler.push(`${d}: Systemdatei im Plugin (Verzeichnis von Claude lehnt ab)`);
    const mcp = await json(`${ordner}/.mcp.json`, fehler, `${kurz}/.mcp.json`);
    const server = mcp?.mcpServers?.albatros;
    if (mcp && (!istObjekt(server) || server.type !== 'http' || server.url !== MCP_URL)) fehler.push(`${kurz}/.mcp.json: Server albatros muss type http und url ${MCP_URL} haben`);

    // Cursor: Manifest, Logo, Skills und mcp.json mit nur der Verbindung zu Albatros (Berts Arbeitsplatz startet in Cursor nicht aus
    // dem Plugin: in welchem Ordner Cursor einen Server aus einem Plugin startet, ist nicht gemessen, docs/verzeichnisse.md)
    const cu = await json(`${ordner}/.cursor-plugin/plugin.json`, fehler, `${kurz}/.cursor-plugin/plugin.json`);
    if (cu) {
      const a = `${kurz}/.cursor-plugin/plugin.json`;
      for (const k of Object.keys(cu)) if (!CURSOR_FELDER.has(k)) fehler.push(`${a}: Feld ${k} kennt Cursor nicht`);
      if (typeof cu.name !== 'string' || !cursorName.test(cu.name) || cu.name !== name) fehler.push(`${a}: name muss «${name}» sein (klein, kebab-case)`);
      if (cu.version !== version) fehler.push(`${a}: version ${cu.version}, nicht ${version}`);
      if (cu.description !== claude.description) fehler.push(`${a}: description anders als in .claude-plugin/plugin.json`);
      if (cu.displayName !== claude.displayName) fehler.push(`${a}: displayName anders als in .claude-plugin/plugin.json`);
      if (!istObjekt(cu.author) || typeof cu.author.name !== 'string' || !cu.author.name) fehler.push(`${a}: author.name fehlt`);
      if (istObjekt(cu.author)) for (const k of Object.keys(cu.author)) if (k !== 'name' && k !== 'email') fehler.push(`${a}: author.${k} kennt Cursor nicht (nur name und email)`);
      if (!relativ(cu.logo)) fehler.push(`${a}: logo muss ein relativer Pfad im Repo sein`);
      else fehler.push(...(await bild(ordner, cu.logo, a, 48, 4096, 5 * 1024 * 1024)));
      for (const k of ['rules', 'agents', 'skills', 'commands', 'hooks', 'mcpServers'])
        for (const p of [cu[k]].flat()) if (p !== undefined && typeof p === 'string' && !relativ(p)) fehler.push(`${a}: ${k} muss relativ sein, ohne «..»`);
      const skills = existsSync(`${ordner}/skills`) ? readdirSync(`${ordner}/skills`).filter((s) => existsSync(`${ordner}/skills/${s}/SKILL.md`)) : [];
      if (!skills.length) fehler.push(`${kurz}/skills: keine Skills für Cursor`);
      const cmcp = await json(`${ordner}/mcp.json`, fehler, `${kurz}/mcp.json`);
      if (cmcp) {
        const s = istObjekt(cmcp.mcpServers) ? cmcp.mcpServers : {};
        if (Object.keys(s).join() !== 'albatros') fehler.push(`${kurz}/mcp.json: genau der Server albatros, nicht ${Object.keys(s).join(', ') || 'keiner'}`);
        const al = s.albatros;
        if (!istObjekt(al) || al.url !== MCP_URL) fehler.push(`${kurz}/mcp.json: url muss ${MCP_URL} sein (die öffentliche Adresse)`);
        else {
          const h = istObjekt(al.headers) ? al.headers : {};
          if (Object.keys(h).join() !== KOPF_STAND || h[KOPF_STAND] !== version) fehler.push(`${kurz}/mcp.json: headers genau ${KOPF_STAND}: ${version}`);
          if (JSON.stringify(cmcp).includes('${')) fehler.push(`${kurz}/mcp.json: Platzhalter \${…} brauchten variables im Manifest`);
        }
      }
    }

    // ChatGPT und Codex: .codex-plugin/plugin.json im Codex-Format
    const cx = await json(`${ordner}/.codex-plugin/plugin.json`, fehler, `${kurz}/.codex-plugin/plugin.json`);
    if (cx) fehler.push(...(await pruefeCodex(cx, claude, ordner, `${kurz}/.codex-plugin/plugin.json`, name === OPENAI_PLUGIN ? werkzeuge : null)));
  }

  // Übersetzungen im Eintrag bei OpenAI: gleich wie die Kurz- und Langbeschreibung der Plugins in diesen Sprachen
  const en = await Bun.file(`${wurzel}plugins/${OPENAI_PLUGIN}/.codex-plugin/plugin.json`).json().catch(() => null);
  const tr = en?.extensions?.['com.openai']?.publication?.translations;
  if (en && !istObjekt(tr)) fehler.push(`plugins/${OPENAI_PLUGIN}/.codex-plugin/plugin.json: publication.translations fehlt`);
  else if (en)
    for (const [loc, p] of Object.entries(OPENAI_UEBERSETZUNGEN)) {
      const i = (await Bun.file(`${wurzel}plugins/${p}/.codex-plugin/plugin.json`).json().catch(() => null))?.interface;
      if (tr[loc]?.subtitle !== i?.shortDescription || tr[loc]?.description !== i?.longDescription)
        fehler.push(`plugins/${OPENAI_PLUGIN}/.codex-plugin/plugin.json: translations.${loc} anders als interface in plugins/${p}/.codex-plugin/plugin.json`);
    }
  return fehler;
}

// Codex-Format nach developers.openai.com/plugins/deploy/submission.md; mit werkzeuge auch die Angaben für die Prüfung bei OpenAI
export async function pruefeCodex(cx: Json, claude: Json, ordner: string, a: string, werkzeuge: Set<string> | null): Promise<string[]> {
  const f: string[] = [];
  const laenge = (x: unknown, max: number) => typeof x === 'string' && x.trim().length > 0 && x.length <= max;
  if (cx.$schema !== undefined) f.push(`${a}: $schema gehört nicht ins Codex-Format`);
  for (const k of ['name', 'version', 'description']) if (cx[k] !== claude[k]) f.push(`${a}: ${k} anders als in .claude-plugin/plugin.json`);
  if (typeof cx.name !== 'string' || cx.name.length > 64 || !kebab.test(cx.name)) f.push(`${a}: name klein, mit einzelnen Bindestrichen, höchstens 64 Zeichen`);
  if (!laenge(cx.description, 4000)) f.push(`${a}: description höchstens 4000 Zeichen`);
  if (!istObjekt(cx.author) || !laenge(cx.author.name, 120) || (cx.author.url !== undefined && !https(cx.author.url))) f.push(`${a}: author.name (höchstens 120 Zeichen) und author.url mit https`);
  if (cx.homepage !== undefined && !https(cx.homepage)) f.push(`${a}: homepage muss https sein`);
  if (cx.skills !== './skills/') f.push(`${a}: skills muss "./skills/" sein`);
  if (cx.mcpServers !== './.mcp.json') f.push(`${a}: mcpServers muss "./.mcp.json" sein`);
  const i = cx.interface;
  if (!istObjekt(i)) return [...f, `${a}: interface fehlt`];
  if (!laenge(i.displayName, 30)) f.push(`${a}: interface.displayName höchstens 30 Zeichen`);
  if (!laenge(i.shortDescription, 30)) f.push(`${a}: interface.shortDescription höchstens 30 Zeichen (ist ${String(i.shortDescription ?? '').length})`);
  if (!laenge(i.longDescription, 4000)) f.push(`${a}: interface.longDescription höchstens 4000 Zeichen`);
  if (!laenge(i.developerName, 80)) f.push(`${a}: interface.developerName höchstens 80 Zeichen`);
  if (!laenge(i.category, 80)) f.push(`${a}: interface.category fehlt`);
  if (!Array.isArray(i.capabilities) || i.capabilities.length > 20 || !i.capabilities.every((c: unknown) => laenge(c, 120))) f.push(`${a}: interface.capabilities höchstens 20, je höchstens 120 Zeichen`);
  for (const k of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) if (!https(i[k]) || i[k].length > 1024) f.push(`${a}: interface.${k} muss https sein (höchstens 1024 Zeichen)`);
  const prompts = [i.defaultPrompt ?? []].flat();
  if (prompts.length > 3 || !prompts.every((p: unknown) => laenge(p, 128) && !String(p).includes('@')) || new Set(prompts).size !== prompts.length) f.push(`${a}: interface.defaultPrompt höchstens 3, je höchstens 128 Zeichen, verschieden, ohne @`);
  const farbe = /^#[0-9A-Fa-f]{6}$/;
  if (i.brandColor !== undefined && (!farbe.test(i.brandColor) || kontrast(i.brandColor, '#FFFFFF') < 2)) f.push(`${a}: interface.brandColor #RRGGBB mit mindestens 2:1 gegen Weiss`);
  if (i.brandColorDark !== undefined && (!farbe.test(i.brandColorDark) || kontrast(i.brandColorDark, '#212121') < 2)) f.push(`${a}: interface.brandColorDark #RRGGBB mit mindestens 2:1 gegen #212121`);
  for (const k of ['composerIcon', 'logo']) {
    if (typeof i[k] !== 'string' || !i[k].startsWith('./') || !relativ(i[k])) f.push(`${a}: interface.${k} muss ein Pfad mit ./ im Plugin sein`);
    else f.push(...(await bild(ordner, i[k], `${a} interface.${k}`, 48, 4096, 5 * 1024 * 1024)));
  }
  const o = cx.extensions?.['com.openai'];
  if (!istObjekt(o)) return [...f, `${a}: extensions.com.openai fehlt`];
  if (typeof o.onboardingSkill !== 'string' || !o.onboardingSkill.startsWith('./') || !existsSync(`${ordner}/${o.onboardingSkill.slice(2)}`)) f.push(`${a}: onboardingSkill muss eine SKILL.md im Plugin sein`);
  if (JSON.stringify(cx).match(/"(test_credentials|reviewer_instructions|clientSecret)"/)) f.push(`${a}: Zugangsdaten gehören nicht ins Paket (test_credentials, reviewer_instructions, clientSecret)`);
  if (werkzeuge) {
    // Erste Prüfung bei OpenAI: genau fünf positive und drei negative Fälle; die Werkzeuge gibt es im Server albatros
    const tc = o.review?.test_cases;
    const pos = Array.isArray(tc?.positive) ? tc.positive : [];
    const neg = Array.isArray(tc?.negative) ? tc.negative : [];
    if (pos.length !== 5 || neg.length !== 3) f.push(`${a}: review.test_cases braucht genau 5 positive und 3 negative Fälle (sind ${pos.length} und ${neg.length})`);
    for (const [n, c] of pos.entries()) {
      if (!laenge(c.description, 4000) || !laenge(c.prompt, 4000) || !laenge(c.expected_behavior, 4000) || typeof c.tools_triggered !== 'string') f.push(`${a}: positiver Fall ${n + 1} braucht description, prompt, tools_triggered und expected_behavior`);
      for (const w of String(c.tools_triggered ?? '').split(',').map((x) => x.trim()).filter(Boolean)) if (!werkzeuge.has(w)) f.push(`${a}: positiver Fall ${n + 1}: Werkzeug ${w} gibt es im Server albatros nicht`);
    }
    for (const [n, c] of neg.entries()) if (!laenge(c.description, 4000) || !laenge(c.prompt, 4000)) f.push(`${a}: negativer Fall ${n + 1} braucht description und prompt`);
    const tr = o.publication?.translations;
    if (istObjekt(tr)) for (const [loc, t] of Object.entries(tr)) if (!istObjekt(t) || (t.subtitle != null && !laenge(t.subtitle, 30)) || (t.description != null && !laenge(t.description, 4000))) f.push(`${a}: translations.${loc}: subtitle höchstens 30, description höchstens 4000 Zeichen`);
  }
  return f;
}

// Dateien eines Ordners, rekursiv, relativ (für das Paket an OpenAI und seine Prüfung)
export function dateien(ordner: string, vor = ''): string[] {
  return readdirSync(`${ordner}/${vor}`).flatMap((n) => {
    const p = vor ? `${vor}/${n}` : n;
    return statSync(`${ordner}/${p}`).isDirectory() ? dateien(ordner, p) : [p];
  });
}
