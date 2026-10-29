---
name: webseite-bauen
description: "Construit avec une personne sans connaissances préalables son site web en huit étapes fixes : maquette, design (deux ou trois propositions d'après le caractère voulu), framework, PRD à valider, construire et montrer en local, envoyer au port et l'y montrer dans le navigateur web, tapis roulant, page ou serveur. Ouvre l'île dans le cockpit et annonce chaque étape avec schritt_melden. Utilise ce skill dès qu'on construit sur le parcours site web : après webseite-planen, après l'état des lieux de webseite-modernisieren, quand on dit « construis-moi le site », « maquette », « mockup », « ébauche », « PRD », « regarder en local », « comment ça continue après le plan ? »."
---

# Construire le site web : du plan à la maison terminée

## L'image

Une maison se construit dans un ordre fixe : d'abord une esquisse, puis des vues au choix, puis le plan de construction avec signature, puis la construction, puis l'emménagement. Personne ne coule les fondations avant que la famille ait signé le plan. Sur l'île du cockpit, la maison grandit à chaque étape.

**Comment utiliser l'image :** une phrase dans ta première réponse, avec l'étape où vous en êtes.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- L'ordre est fixe. Tu ne sautes aucune étape et tu ne construis rien avant que la personne ait validé le PRD.
- Tu proposes la prochaine étape et tu la fais après un bref oui. La personne n'a jamais besoin de savoir ce qui vient ensuite.
- Tutoiement, langage de tous les jours. « PRD », tu l'expliques la première fois : le plan de construction avec signature, sur une page.
- Les sites web restent statiques, sans services à soi. Une brique (skill `bausteine`) ne s'ajoute que si la personne en a vraiment besoin.
- Ce que la personne doit voir (île, maquette, ébauches, aperçu, port, site terminé), tu l'ouvres toi-même dans le navigateur : `open <adresse ou fichier>` (Linux `xdg-open`, Windows `start`). Donner seulement l'adresse ne suffit pas.

## L'île

Dès le début, tu ouvres l'île de la personne dans le navigateur web. Sous `https://albatros.build/fr/cockpit/insel`, il y a pour chaque projet une maison qui grandit à chaque étape. Pour le français, l'italien et l'anglais, le préfixe de la langue vient devant (`/fr`, `/it`, `/en`) ; sans préfixe, `https://albatros.build/cockpit/insel` est la version allemande :

```bash
open https://albatros.build/fr/cockpit/insel     # macOS; Linux: xdg-open, Windows: start
```

L'île se recharge toute seule, l'ouvrir une fois suffit.

Après chaque étape réussie, tu appelles l'outil `schritt_melden` d'Albatros, avec `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `hafen`, `fliessband`, `live`, `domain`) et `sprache` (la langue de la conversation, ici `fr`). `projekt`, tu le laisses de côté dans le cas normal : c'est alors le journal de bord au port qui compte (`git@aufwind.sh:<name>/projekt.git`), même s'il n'est créé que plus tard. Seulement pour un autre projet, qui se trouve uniquement sur l'ordinateur, tu donnes un nom court fait de minuscules, de chiffres et de « - ». La réponse indique l'étape et l'adresse de l'île. Dis à la personne en une phrase que sa maison a grandi.

- L'île ne fait qu'avancer. Si tu annonces une étape qui est déjà là, rien ne change. La réponse le dit, tu ne réessaies pas.
- `hafen`, `fliessband`, `live` et `domain`, Albatros les voit aussi tout seul. Annonce-les quand même, dès qu'elles sont réussies.
- S'il répond « Ungültige Angaben », l'étape ou le nom était mal écrit : corrige et rappelle-le une fois.
- Si l'outil manque ou répond « unbekannt » (inconnu), on continue sans île.

## Les huit étapes

### 1. Maquette (`schritt: mockup`)

Rapide et grossière, en niveaux de gris : la page d'accueil et la sous-page la plus importante dans un seul fichier HTML `docs/mockup.html`, avec de vrais titres et le contenu du plan (`docs/plan.md`) ou de l'état des lieux (`docs/bestand.md`). Elle montre la structure et l'ordre, encore sans couleurs ni images (surfaces grises). Ouvre-la dans le navigateur web et demande seulement : « Est-ce que l'ordre est juste ? »

### 2. Design : les ébauches (`schritt: entwuerfe`)

Suis le skill `gestaltung`, section « Trois directions ». D'abord, tu demandes le caractère, pas les couleurs. Ensuite, tu présentes deux ou trois propositions bien différentes sur la maquette : les mêmes pages, une fois par direction, en HTML dans `docs/gestaltung/entwuerfe/`. Après, tu vérifies avec la liste des signes typiques de l'IA et tu demandes quels éléments graphiques la personne veut (icônes, illustrations, photos, mascotte, 3D). La personne choisit une direction ou un mélange.

### 3. Framework

Si la personne ne dit rien là-dessus, tu prends ce qui a le plus de sens et tu dis en une phrase pourquoi. Pour une page statique, c'est Astro : il construit des pages HTML rapides et simples qu'Albatros peut livrer directement. Un autre framework seulement si la personne le veut ou si le site en a besoin.

### 4. Montrer le PRD et le faire valider (`schritt: prd`)

Écris `docs/prd.md` sur une page et montre-le à la personne. On ne construit qu'après son oui.

```markdown
# PRD : <nom du site>

**Pour qui et pourquoi :** … (de docs/plan.md)
**Pages :** accueil, …
**Fonctions :** chaque fonction avec sa décision (pour un site existant, toutes celles de docs/bestand.md)
**Design :** direction <nom>, traits de caractère …, police …, éléments graphiques …
**Framework :** Astro (statique), parce que …
**Hébergement :** Light (page tirée du port, sans serveur à soi) ou Pilot (serveur à soi)
**Domaine :** name.aufwind.sh, plus tard propre domaine (seulement avec Pilot)
**Pas inclus :** …

Validé : <date> par <nom>
```

### 5. Construire et montrer en local (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- Dans `web/astro.config.mjs` : `outDir: '../seite'`. Albatros livre le dossier `seite/`, avec Light directement et avec Pilot par le tapis roulant.
- Le nuancier du skill `gestaltung` se trouve dans `web/src/styles/tokens.css`. En dehors, aucune couleur ni aucune taille de police n'est écrite à la main.
- Les listes comme les dates, les tournois ou les sponsors sont des données dans `web/src/data/*.json`, que les pages lisent. Les documents et les images vont dans `web/public/`, les images réduites.
- Construire et ouvrir l'aperçu dans le navigateur web :
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- Photos en largeur natel et en largeur ordinateur (skill `gestaltung`, étape 6) et comparaison avec le PRD : passe en revue chaque fonction et chaque contenu et note dans `docs/prd.md` où ils se trouvent sur le nouveau site. S'il manque quelque chose, tu le construis avant que ça parte au port. S'il manque du matériel (par exemple les logos des sponsors), il y a un espace réservé clairement nommé, jamais une autre image sous un faux nom.
- Regarde chaque photo toi-même comme une visiteuse : le texte sur les images est-il bien lisible, rien n'est-il coupé ou caché ? Ce qui ne va pas, tu le corriges avant que ça parte au port.
- Le symbole dans l'onglet du navigateur (`web/public/favicon.svg` et `favicon.ico`) est le « A » d'Astro : remplace-le par le logo ou un signe tiré de celui-ci.
- Quand l'aperçu tourne, tu annonces `lokal`.

### 6. Envoyer au port (`schritt: hafen`)

Le port d'Albatros (`code.aufwind.sh`) est le dépôt d'entraînement de la personne : c'est là que se trouve son code, en privé. S'il faut encore pour ça un compte, un abonnement et une clé, suis maintenant le skill `start` à partir de l'étape 3. Ensuite, tu récupères le journal de bord et tu y mets le nouveau site (skill `git-logbuch`) :

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite logbuch/        # sans web/node_modules, que web/.gitignore exclut
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # la copie de travail de l'ancien site reste dehors
cd logbuch && git add .gitignore web docs seite && git commit -m "Nouveau site : <direction>" && git push
```

Ensuite, tu ouvres le port dans le navigateur web, pour que la personne voie que son code s'y trouve :

```bash
open https://code.aufwind.sh/{name}/projekt
```

### 7. Tapis roulant (`schritt: fliessband`)

Un tapis roulant simple, rien de spécial (skill `pipeline`). Avec Light, il n'en faut pas : ce qui est sur `main` dans `seite/` au port, Albatros le montre environ une minute plus tard. Avec Pilot, le tapis roulant de `.github/workflows/deploy.yml` livre la page sur le serveur.

### 8. Page ou serveur (`schritt: live`, plus tard `schritt: domain`)

- **Light :** Albatros montre la page sans serveur à soi sous `https://{name}.aufwind.sh`.
- **Pilot :** la page tourne sur le serveur à soi, elle aussi sous `https://{name}.aufwind.sh`.

**Tu vérifies toi-même, la personne n'attend jamais.** Au lieu de « regarde à nouveau dans quelques minutes », tu vérifies toi-même après le push jusqu'à ce que ta nouvelle page soit là, trois minutes au plus. L'adresse répond déjà avant (avec le modèle ou la page de bienvenue). C'est pourquoi tu attends le titre de ta page, tel qu'il figure dans `seite/index.html` entre `<title>` et `</title>` :

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/ | grep -qF "<titre de ta page>" && echo "La page est là" && break; sleep 15; done
```

- **Elle est là :** annonce `fliessband` et `live`, ouvre l'adresse avec la personne (`open https://{name}.aufwind.sh`) et compare avec les photos de l'étape 5.
- **Toujours pas là après trois minutes :** demande `konto_status`. Avec Light, il indique si le dernier état est en ligne ou ce qui manque. Souvent, `seite/index.html` manque au port, parce que rien n'a été construit avant le push ou que `seite/` figure dans `.gitignore`. Avec Pilot, tu regardes au port sous « Actions » où le tapis roulant s'est arrêté (skill `pipeline`). Corriger, nouvelle entrée, push, vérifier à nouveau. Seulement si ça ne marche toujours pas, tu dis à la personne ce que tu as vérifié et tu demandes au coach (`coach_fragen`).

Un propre domaine s'ajoute avec le skill `domain` (seulement Pilot), ensuite tu annonces `domain`.

On ne publie que ce qui appartient à la personne ou ce pour quoi elle a l'autorisation (skill `webseite-modernisieren`, section « Droits »).

## Pièges

- Construire avant le PRD : on construit alors joliment le mauvais site.
- Trois ébauches qui ne diffèrent que par la couleur : pas un vrai choix.
- Oublier de construire `seite/` : au port, il y a alors l'ancienne page. Avant chaque push, `npm run build` dans `web/`.
- Faire attendre la personne (« regarde plus tard ») : tu vérifies toi-même jusqu'à ce que la page soit là (étape 8).
- Une étape pas annoncée : la maison sur l'île arrête de grandir. Annonce chaque étape dès qu'elle est réussie.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « du plan à la maison terminée », qui redit l'essentiel. Ensuite : laquelle des huit étapes est réussie, où se trouve le résultat, ce que la personne doit décider et quelle étape vient ensuite.
