// Stand der Skills. Alle plugin.json und die Einträge in .claude-plugin/marketplace.json tragen dieselbe Version, jede SKILL.md sie
// als metadata.stand. Eine Übersetzung nennt in metadata.quelle den deutschen Text, nach dem sie übersetzt ist: die ersten 12 Zeichen
// von SHA-256 über die deutsche SKILL.md ohne die Zeile «stand:», damit eine neue Version allein keine Übersetzung veralten lässt.
// Von Hand: grep -v '^  stand: ' plugins/albatros/skills/<slug>/SKILL.md | shasum -a 256 | cut -c1-12
export const quelle = (deutsch: string) =>
  new Bun.CryptoHasher('sha256')
    .update(deutsch.split('\n').filter((z) => !z.startsWith('  stand: ')).join('\n'))
    .digest('hex')
    .slice(0, 12);

// Kopfzeile mit dem Stand (Schnittstelle I1, Welle 8, 01.11.2026; Entscheid skills-stand-kopfzeile): Jedes Plugin schickt in seiner
// .mcp.json bei jedem Aufruf X-Albatros-Skills-Stand mit, gleich version und metadata.stand. mcp nimmt sie, wenn lage ohne skills_stand
// kommt (Live-Test 01.11.2026: lage aus webseite-planen ohne skills_stand meldete «Skills veraltet»). So kommt der Stand aus dem
// installierten Plugin, nicht aus dem Gedächtnis der KI. Zwei Schlüssel, gemessen ohne Modell gegen einen Server auf 127.0.0.1:
// Claude Code (2.1.118, 2.1.309) liest headers, Codex (0.166.0) liest aus der .mcp.json eines Plugins nur http_headers (headers allein:
// keine Kopfzeile). Wert des Servers albatros je Schlüssel, null ohne Eintrag.
export const KOPF_STAND = 'X-Albatros-Skills-Stand';
export const KOPF_SCHLUESSEL = ['headers', 'http_headers'] as const; // Claude Code, Codex
export function kopfzeileStand(mcpJson: unknown, schluessel: (typeof KOPF_SCHLUESSEL)[number] = 'headers'): string | null {
  const server = (mcpJson as { mcpServers?: { albatros?: Record<string, unknown> } } | null)?.mcpServers?.albatros;
  const kopf = server?.[schluessel];
  const wert = typeof kopf === 'object' && kopf !== null ? (kopf as Record<string, unknown>)[KOPF_STAND] : undefined;
  return typeof wert === 'string' ? wert : null;
}

// a.b.c höher als x.y.z
export function hoeher(a: string, b: string) {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (x![i] !== y![i]) return x![i]! > y![i]!;
  return false;
}
