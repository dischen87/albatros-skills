---
name: seo-grundlagen
description: "Rend un petit site web facile à trouver pour les moteurs de recherche, expliqué aux personnes sans connaissances préalables avec l'image des panneaux indicateurs et du plan de ville. Titre de page et description, un seul titre principal, des adresses parlantes, descriptions d'images, temps de chargement, sitemap.xml, robots.txt, données structurées pour les commerces locaux, Google Search Console et profil d'entreprise. Utilise ce skill quand on dit « SEO », « être trouvé sur Google », « Google ne trouve pas mon site », « moteur de recherche », « sitemap », « méta-description », « être trouvé dans ma région », « fiche Google Maps »."
---

# Bases du SEO : panneaux indicateurs et plan de ville

## L'image

Un moteur de recherche, c'est un plan de ville qu'un messager zélé redessine chaque jour. Il parcourt les rues, lit les enseignes et note ce qu'il trouve. Pour que ton magasin figure sur le plan, il faut :

- **une enseigne claire au-dessus de la porte** (titre de page et titre principal),
- **des panneaux indicateurs** qui mènent d'autres endroits jusqu'à toi (liens),
- **un plan de situation** que tu glisses dans la main du messager (`sitemap.xml`),
- **un règlement de maison** pour le messager : où il a le droit d'aller (`robots.txt`).

Le mot technique pour tout ça, c'est **SEO** (optimisation pour les moteurs de recherche). Mais ce qui compte le plus, c'est que le site réponde bien à la question des gens qui cherchent.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement. Ne pas promettre de miracles : être trouvé prend des semaines, pas des heures. Pas de trucs (texte caché, liens achetés), ils font plus de mal que de bien.

## Déroulement

### 1. Que cherchent les gens ?

Noter avec la personne cinq phrases que son public taperait sur Google (« cantine de midi Sous-Gare », « réparer vélo Fribourg Pérolles »). Une phrase principale par page. Ça va dans `docs/plan.md`.

### 2. Chaque page : l'enseigne au-dessus de la porte

- **Titre de page** (`<title>`) : quoi + lieu ou bénéfice + nom, environ 50 à 60 caractères. Chaque page a le sien.
- **Description** (`<meta name="description">`) : une ou deux phrases qui donnent envie de cliquer, environ 150 caractères. Elle apparaît souvent sous le titre dans les résultats de recherche.
- **Un seul titre principal** (`<h1>`) par page, avec des intertitres en dessous.
- **Des adresses parlantes :** `/offre/cantine-de-midi` plutôt que `/page?id=7`.
- **Descriptions d'images** (`alt`), voir le skill `barrierefreiheit`.
- **Langue :** `<html lang="fr-CH">` (ou la langue du site, par exemple `de-CH`).
- **Une adresse principale :** Le site est accessible soit avec, soit sans `www`, l'autre variante redirige. `<link rel="canonical">` pointe vers l'adresse principale.

### 3. Plan de situation et règlement de maison

- `public/sitemap.xml` : toutes les pages publiques avec leur adresse complète. Beaucoup d'outils la génèrent automatiquement au moment de la construction, sinon à la main.
- `public/robots.txt` :
  ```
  User-agent: *
  Allow: /
  Sitemap: https://<domain>/sitemap.xml
  ```

### 4. Rapide et agréable sur le natel

Réduire les images (skill `inhalte`), charger seulement les polices et les scripts nécessaires. Vérifier dans Chrome avec Lighthouse (clic droit, « Inspecter », « Lighthouse », catégories « SEO » et « Performances »).

### 5. Pour les commerces locaux

- Adresse, téléphone et horaires d'ouverture en texte sur le site (pas seulement dans une image), écrits partout de la même façon.
- Données structurées : un petit bloc `application/ld+json` du type `LocalBusiness` avec nom, adresse, téléphone, horaires d'ouverture. Il aide le moteur de recherche à lire correctement les informations.
- Profil d'entreprise sur Google (autrefois « Google My Business ») : la personne le crée et le confirme elle-même. Les mêmes informations que sur le site web.

### 6. Prévenir le messager

Avec un propre domaine (skill `domain`) : la personne inscrit son site dans la Google Search Console. Elle prouve qu'elle en est propriétaire avec une entrée TXT dans l'annuaire, exactement comme chez Albatros. Ensuite, y soumettre la sitemap. Pour Bing, il y a les Bing Webmaster Tools.

### 7. Rassembler des panneaux indicateurs

De vrais liens depuis des endroits qui conviennent : l'annuaire du quartier ou de l'association professionnelle, les partenaires, les médias locaux, les sociétés locales. Pas de liens achetés.

## Vérifier la mission

Journal de bord et tapis roulant (skills `git-logbuch`, `pipeline`), puis `mission_pruefen` avec `webseite-09-seo-grundlagen`. La vérification regarde si `https://{name}.aufwind.sh/sitemap.xml` et `/robots.txt` répondent.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « panneaux indicateurs et plan de ville », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
