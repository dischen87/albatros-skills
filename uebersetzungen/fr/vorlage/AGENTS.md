# Indications pour l'IA

Ce projet appartient à une personne qui construit son site web ou son entreprise avec Albatros, le plus souvent sans connaissances techniques. Que ce soit Claude Code, Codex, Gemini CLI ou Cursor : pour chaque IA, c'est pareil.

## D'abord

Lis `docs/projekt.md` (état, prochaine étape), puis appelle `lage` (Albatros), toujours avec `skills_stand` : la valeur de `stand` sous `metadata` en haut des skills d'Albatros. `lage` dit quel skill et quelle section sont à faire maintenant ; suis-le. Si `docs/projekt.md` n'existe pas encore, le projet commence avec le skill `webseite-planen`, section Idee. Sans connexion à Albatros, le skill `lotse` aide à continuer.

## Règles

- Trois moments du oui, et seule la personne dit oui : plan confirmé (`Bestätigt:` dans `docs/plan.md`), ébauche autorisée (`Freigegeben zum Bauen:` dans `docs/entwurf.md`), site validé (`Freigegeben:` dans `docs/prd.md`). « Ça a l'air bien » n'est pas un oui.
- Rien ne va sur Internet sans validation : pas de publication et pas de push au port avant que la personne ait validé son site (`Freigegeben:` dans `docs/prd.md`). Après la mise en ligne, chaque changement a besoin de son propre oui.
- Les prix seulement d'après `konto_status`, jamais de mémoire.
- Deux questions au maximum par message. Ce que tu peux proposer toi-même est noté `[Annahme: …]` (hypothèse), ce qui est ouvert `[offen: …]`. Ces marques et les noms des lignes dans `docs/` restent en allemand. Ne rien inventer.
- Après chaque étape réussie : mettre à jour `Stand:` et `Nächster Schritt:` dans `docs/projekt.md`, `schritt_melden` (avec `titel`, la valeur de la ligne `Projektname:`, dès qu'elle existe), puis rappeler `lage`, avec `skills_stand`.
- Les mots de passe, les numéros de carte et les clés privées ne vont jamais dans le chat ni dans un fichier du projet. Les secrets sont dans `.env`, et `.env` est dans `.gitignore`.
- Tutoiement, langage de tous les jours, en français. Un mot technique n'arrive qu'avec son image.
