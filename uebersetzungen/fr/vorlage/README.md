# Mon projet

Voici ton journal de bord, il se trouve au port. Quand tu envoies une modification sur `main` au port (`git push`), elle est en ligne peu après :

- **Light :** Albatros affiche le dossier `seite/` à ton adresse, environ 30 secondes après le push.
- **Pilot :** le tapis roulant construit ta page et la livre sur ton serveur.

| Fichier | À quoi il sert |
|---|---|
| `seite/` | ta page, commence par `index.html` |
| `Dockerfile` | la recette de construction : un petit serveur web avec ta page (Pilot) |
| `compose.yaml` | comment la page tourne sur le serveur (conteneur `webseite`, port 80, Pilot) |
| `.github/workflows/deploy.yml` | le tapis roulant : construire, livrer, vérifier, revenir en arrière si besoin (Pilot) |
| `nginx.conf` | comment le serveur web livre ta page |
| `bausteine/` | des éléments prêts à l'emploi comme liste d'inscription, connexion ou CMS (Pilot) |
| `.gitignore` | ce qui n'entre jamais dans le journal de bord, par exemple `.env` avec des secrets |

Des questions ? Dis à ton IA « Explique-moi mon projet » ou lance Albatros avec `/albatros-fr:start`.
