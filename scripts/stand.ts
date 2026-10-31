// Stand der Skills. Alle plugin.json und die Einträge in .claude-plugin/marketplace.json tragen dieselbe Version, jede SKILL.md sie
// als metadata.stand. Eine Übersetzung nennt in metadata.quelle den deutschen Text, nach dem sie übersetzt ist: die ersten 12 Zeichen
// von SHA-256 über die deutsche SKILL.md ohne die Zeile «stand:», damit eine neue Version allein keine Übersetzung veralten lässt.
// Von Hand: grep -v '^  stand: ' plugins/albatros/skills/<slug>/SKILL.md | shasum -a 256 | cut -c1-12
export const quelle = (deutsch: string) =>
  new Bun.CryptoHasher('sha256')
    .update(deutsch.split('\n').filter((z) => !z.startsWith('  stand: ')).join('\n'))
    .digest('hex')
    .slice(0, 12);

// a.b.c höher als x.y.z
export function hoeher(a: string, b: string) {
  const [x, y] = [a, b].map((v) => v.split('.').map(Number));
  for (let i = 0; i < 3; i++) if (x![i] !== y![i]) return x![i]! > y![i]!;
  return false;
}
