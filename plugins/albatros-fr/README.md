# Albatros (français)

Albatros est une école de vol pour les personnes sans bagage technique. Ton IA (Claude, Codex, Cursor ou Gemini CLI) te guide selon un plan de vol fixe, de l'idée jusqu'à ton propre site web ou ta propre activité en ligne. En chemin, tu apprends ce que sont une clé SSH, Git et un tapis roulant (CI/CD). Jusqu'à ce que ton site soit terminé sur ton ordinateur, Albatros ne coûte rien ; ensuite, tu choisis où il habite : chez Albatros (Light, ou Pilot avec un vrai serveur à toi) ou par toi-même.

Après l'installation, dis à ton IA : « Démarre Albatros ». Dans Claude Code, `/albatros-fr:start` marche aussi.

## Installer

| IA | Comment |
|---|---|
| Claude (claude.ai, Cowork, Claude Code) | ajouter « Albatros » depuis l'annuaire de Claude dès qu'il y figure ; d'ici là, dans Claude Code : `claude plugin install albatros-fr --marketplace dischen87/albatros-skills` |
| Cursor | installer « Albatros » depuis la Marketplace de Cursor dès qu'il y figure ; d'ici là comme dans [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md), partie D |
| Codex et ChatGPT | depuis l'annuaire de plugins de ChatGPT et Codex dès qu'il y figure ; d'ici là `codex plugin marketplace add dischen87/albatros-skills` et `codex plugin add albatros-fr@albatros` |

Ou dis à ton IA : « Installe-moi Albatros : https://albatros.build/einrichten ». Elle lit [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md) et fait tout elle-même.

## Ce que contient le plugin et ce qu'il fait

- **Skills** (Markdown dans `skills/`) : des instructions pour ton IA, du skill principal `lotse` jusqu'à la clé SSH, Git, le domaine et le droit suisse. Elles n'exécutent rien d'elles-mêmes.
- **Connexion à Albatros** (`albatros`, `https://mcp.albatros.build`) : tu te connectes à Albatros dans ton navigateur (OAuth via Clerk, avec Google, Apple ou GitHub). Ni Albatros ni ton IA ne voient ton mot de passe. Chaque appel indique la version des skills dans l'en-tête `X-Albatros-Skills-Stand`, rien d'autre sur ton ordinateur. Ce qu'Albatros enregistre (parcours, abonnement, progression) figure dans la [politique de confidentialité](https://albatros.build/fr/datenschutz).
- **Le programme Albatros** (`albatros-arbeitsplatz`, `node arbeitsplatz/arbeitsplatz.mjs --mcp`) : ta page d'accueil sur ton ordinateur. Il n'est joignable que là (127.0.0.1), n'écrit que dans le dossier `.albatros/` de ton projet et n'envoie rien sur Internet de lui-même. Il demande Node 20 ou plus récent. Claude Code le démarre depuis le plugin ; dans Codex et Cursor, ton IA ne l'ajoute que si tu le veux (skill `schnellstart`). Le code source se trouve dans `dischen87/albatros` (`apps/arbeitsplatz`) ; le paquet ici n'est pas minifié et contient OpenPGP.js (LGPL-3.0-or-later) sans modification.
- Pas de hooks, pas de permissions modifiées.

## Coûts, aide, licence

- Apprendre avec Albatros ne coûte rien. Ton IA a besoin d'un abonnement chez son fournisseur. Prix : https://albatros.build/fr/preise
- Questions et erreurs : https://github.com/dischen87/albatros-skills/issues
- [CG](https://albatros.build/fr/agb), [confidentialité](https://albatros.build/fr/datenschutz), [mentions légales](https://albatros.build/fr/impressum). Éditeur : Albatros Partner (https://albatros.build).
- Licence : MIT ([LICENSE](https://github.com/dischen87/albatros-skills/blob/main/LICENSE)).
