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

Quatre niveaux, toujours prendre le plus simple qui suffit :

| Niveau | Quoi | Bien quand |
|---|---|---|
| A : textes dans le projet | contenus en fichiers Markdown dans le dépôt, l'IA les modifie | une personne avec l'IA s'occupe de tout, rarement des changements |
| B : tableau d'affichage via ton journal de bord | une fenêtre de modification dans le navigateur web (par exemple Decap CMS), qui modifie les fichiers dans le dépôt | d'autres doivent changer des textes, mais pas besoin de base de données |
| C : petit tableau d'affichage | PocketBase sur le serveur, des entrées avec titre, date, texte et image | d'autres s'occupent des actualités ou de l'agenda, peu de champs, presque pas de mémoire (environ 20 MB) |
| D : grand CMS | Strapi avec sa propre base de données sur le serveur | beaucoup de types de contenu, plusieurs rôles, gestion des images, plus tard aussi une app (environ 200 MB, construction jusqu'à 2,5 GB) |

Si la réponse est A ou B : écris-le dans `docs/plan.md` et arrête-toi là. C'est un bon résultat. C et D ont besoin d'un serveur à soi, donc de Pilot. Avec Light, A et B fonctionnent. C et D sont des briques toutes faites, tu les installes avec le skill `bausteine` (recette `pinnwand` ou brique `strapi`).

## 2. Installer Strapi (niveau D)

Strapi arrive comme brique toute faite, avec sa propre base de données Postgres : skill `bausteine`, section « Strapi ». L'essentiel d'abord, pour que tu puisses l'expliquer à la personne :

- **Mémoire vive :** en fonctionnement, Strapi avec sa base de données a besoin d'environ 200 MB, pendant la construction jusqu'à 2,5 GB. La première construction dure environ 7 minutes. Vérifie avec `free -h` qu'il reste assez de libre pendant la construction. Une photo avant : outil `snapshot` avec le nom `vor-cms`.
- **Les secrets**, c'est `bausteine/strapi/geheimnisse.sh` qui les crée directement sur le serveur, jamais dans le journal de bord (skill `sicherheit`).
- **Les types de contenu**, tu les écris sous forme de fichiers sous `bausteine/strapi/cms/src/api/` ; sur le serveur, on ne peut pas les créer en cliquant. Modèle : recette `veranstaltungen`.
- **Le passage secret vers le tableau d'affichage :** l'administration n'est pas publique. La personne y accède par un tunnel. Image : un passage secret de son ordinateur directement dans le couloir, devant lequel personne ne passe depuis la rue.

  ```bash
  ssh -N -L 1337:localhost:1337 {name}@aufwind.sh
  ```

  Tant que le tunnel est ouvert, elle ouvre `http://localhost:1337/admin`. La première fois, elle y crée elle-même le compte. Le mot de passe, elle le tape seulement là.
- **Les contenus sur la page :** ce qui figure dans `OEFFENTLICH` (`bausteine/strapi/cms/src/index.ts`), la page le lit sous `/cms/api/…` de sa propre adresse, juste après la publication. Pas besoin d'une nouvelle construction pour ça.

## Pièges

- Espace admin mis en ligne publiquement : une invitation pour les attaquants. Utiliser le tunnel.
- Oublier les mises à jour : mettre Strapi à jour régulièrement, prendre une photo avant.
- Images seulement dans le conteneur : sans volume, elles ont disparu au prochain redémarrage.

## Vérifier la mission

`mission_pruefen` avec `webseite-05-cms`. La vérification regarde si le conteneur `cms` tourne (Strapi). Si la personne a choisi consciemment le niveau A, B ou C, dis-lui qu'elle peut sauter cette mission. C'est une bonne décision, pas une lacune.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « le tableau d'affichage du couloir », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
