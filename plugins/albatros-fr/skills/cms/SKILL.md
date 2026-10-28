---
name: cms
description: "Aide une personne sans connaissances préalables à décider si son site web a besoin d'un système de gestion des contenus (CMS) et, si oui, l'installe, par exemple Strapi dans Docker sur le serveur Albatros, accessible par un tunnel sécurisé. Explique le CMS avec l'image du tableau d'affichage. Utilise ce skill quand on dit « CMS », « Strapi », « modifier les contenus moi-même sans code », « blog », « actualités », « gérer les événements », « ma collègue doit pouvoir changer les textes », « WordPress », « espace admin »."
---

# CMS : le tableau d'affichage du couloir

## L'image

Un CMS, c'est un tableau d'affichage dans le couloir. Qui veut annoncer quelque chose y accroche une affichette, sans reconstruire le mur. Le site web lit les affichettes et les présente joliment.

Un tableau d'affichage vaut la peine quand des affichettes arrivent souvent et de différentes personnes : événements, actualités, produits, menus. Pour un site qui change deux fois par an, c'est un meuble qui prend juste de la place.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement, court. Déconseille honnêtement quand il ne faut pas de tableau d'affichage. Chaque logiciel en plus, c'est quelque chose qu'il faut entretenir, sécuriser et mettre à jour.

## 1. Faut-il vraiment un CMS ?

Demande trois choses :

1. À quelle fréquence les contenus changent-ils ? (chaque semaine ou plus souvent → plutôt oui)
2. Qui les change ? (des gens sans terminal → plutôt oui)
3. Y a-t-il beaucoup d'entrées du même genre ? (événements, produits, articles → plutôt oui)

Trois niveaux, toujours prendre le plus simple qui suffit :

| Niveau | Quoi | Bien quand |
|---|---|---|
| A : textes dans le projet | contenus en fichiers Markdown dans le dépôt, l'IA les modifie | une personne avec l'IA s'occupe de tout, rarement des changements |
| B : tableau d'affichage via ton journal de bord | une fenêtre de modification dans le navigateur web (par exemple Decap CMS), qui modifie les fichiers dans le dépôt | d'autres doivent changer des textes, mais pas besoin de base de données |
| C : son propre CMS | un programme avec base de données sur le serveur, par exemple Strapi | beaucoup d'entrées, plusieurs rôles, gestion des images, plus tard aussi une app |

Si la réponse est A ou B : écris-le dans `docs/plan.md` et arrête-toi là. C'est un bon résultat. Le niveau C a besoin de son propre serveur, donc de Pilot. Avec Light, A et B fonctionnent.

## 2. Installer Strapi (niveau C)

### Avant

- Strapi a besoin de mémoire vive. Vérifie avec `free -h` sur le serveur s'il y a au moins environ 1 GB de libre. Sinon, d'abord plus de puissance (skill `kosten`).
- Prendre une photo : outil `snapshot` avec le nom `vor-cms` (skill `zurueck-auf-gestern`).

### Installer

1. Créer en local un projet Strapi dans le dossier `cms/` du dépôt (instructions actuelles : `npx create-strapi@latest cms`), avec SQLite comme base de données. Le fichier de la base de données ne va pas dans le journal de bord (`.gitignore`).
2. Dans `compose.yaml`, ajouter un service `cms` : nom du conteneur `cms`, port seulement vers l'intérieur (`127.0.0.1:1337:1337`), un volume pour la base de données et les images téléversées. Les secrets (`APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`) comme variables d'environnement tirées d'un `.env` sur le serveur, jamais dans le dépôt (skill `sicherheit`).
3. Journal de bord et tapis roulant (skills `git-logbuch`, `pipeline`). Ensuite, sur le serveur : `docker ps` affiche `cms`.

### Le passage secret vers le tableau d'affichage

L'espace de modification n'est pas public. La personne y accède par un tunnel. Image : un passage secret de son ordinateur directement dans le couloir, devant lequel personne ne passe depuis la rue.

```bash
ssh -L 1337:localhost:1337 {name}@aufwind.sh
```

Tant que cette fenêtre est ouverte, elle ouvre `http://localhost:1337/admin` dans son navigateur web. La première fois, elle y crée elle-même le compte admin. Le mot de passe, elle le tape seulement là.

### Brancher les contenus

1. Créer avec la personne un type de contenu (par exemple « Événement » avec titre, date, lieu, texte, image).
2. Le site web va chercher les entrées au moment de la construction via `http://cms:1337/api/...`, depuis le même réseau Docker. Un jeton d'API avec seulement des droits de lecture, comme secret sur le serveur.
3. Les nouvelles entrées apparaissent après la construction suivante. Qui veut que ce soit immédiat : un webhook dans Strapi qui déclenche la construction. Ça ne vient que quand ça gêne vraiment.

## Pièges

- Espace admin mis en ligne publiquement : une invitation pour les attaquants. Utiliser le tunnel.
- Oublier les mises à jour : mettre Strapi à jour régulièrement, prendre une photo avant.
- Images seulement dans le conteneur : sans volume, elles ont disparu au prochain redémarrage.

## Vérifier la mission

`mission_pruefen` avec `webseite-04-cms`. La vérification regarde si le conteneur `cms` tourne. Si la personne a choisi consciemment le niveau A ou B, dis-lui qu'elle peut sauter cette mission. C'est une bonne décision, pas une lacune.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « le tableau d'affichage du couloir », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
