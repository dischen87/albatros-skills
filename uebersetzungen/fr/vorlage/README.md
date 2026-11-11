# Mon projet

Voici ton journal de bord, il se trouve au port. Quand tu envoies une modification sur `main` au port (`git push`), elle est en ligne peu après :

- **Light :** Albatros affiche le dossier `seite/` à ton adresse, environ 30 secondes après le push.
- **Pilot :** le tapis roulant construit ta page et la livre sur ton serveur.

| Fichier | À quoi il sert |
|---|---|
| `seite/` | ta page, telle qu'elle est en ligne : d'abord ce modèle, à la mise en ligne la page que tu as construite et validée sur ton ordinateur |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | des indications pour ton IA (Claude Code, Codex, Gemini CLI ou Cursor) : où vous en êtes et ce qui s'applique |
| `Dockerfile` | la recette de construction : un petit serveur web avec ta page (Pilot) |
| `compose.yaml` | comment la page tourne sur le serveur (conteneur `webseite`, port 80, Pilot) ; en plus l'espace de travail de Bert en ligne, éteint tant que tu ne le veux pas (skill `betrieb`) |
| `.github/workflows/deploy.yml` | le tapis roulant : construire, livrer, vérifier, revenir en arrière si besoin (Pilot) |
| `nginx.conf` | comment le serveur web livre ta page |
| `bausteine/` | des briques toutes prêtes comme liste d'inscription, connexion ou CMS (Pilot) |
| `.gitignore` | ce qui n'entre jamais dans le journal de bord, par exemple `.env` avec des secrets |

Des questions ? Dis à ton IA « Explique-moi mon projet » ou lance Albatros avec `/albatros-fr:start`.
