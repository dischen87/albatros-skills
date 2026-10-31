---
name: inhalte
description: "Aide une personne sans connaissances préalables à écrire et à choisir les textes et les images de son site web, dans le plan de vol pour l'ébauche de tout le site (P7) : la page d'accueil en trois phrases, des textes courts dans le ton du concept pour des gens qui lisent sur le natel, les textes manquants bien visibles comme [à compléter], ses propres photos plutôt que des images de banque d'images avec une liste de photos, droits et taille des images, ramener les textes d'IA à sa propre voix. Le résultat est une liste des contenus dans docs/inhalte.md et les textes dans l'ébauche. Utilise ce skill quand on dit « écrire des textes », « qu'est-ce que j'écris sur la page d'accueil », « à propos », « images pour le site », « liste de photos », « est-ce que j'ai le droit d'utiliser cette image », « le texte fait IA », « contenus »."
metadata:
  stand: 0.2.0
  quelle: '0b198ab95f73'
---

# Contenus : la marchandise dans la vitrine

## L'image

Le site web est une vitrine. La mise en forme, c'est la lumière et la décoration. Les contenus sont la marchandise. Une belle vitrine aux étagères vides ne vend rien. C'est pourquoi la marchandise entre dans la maquette avant la construction : c'est seulement avec de vrais textes qu'on voit si le site tient debout.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Dans le plan de vol

Les textes naissent en P7, comme partie de l'ébauche de tout le site (skill `entwurf`, étape « Les textes ») : ce que tu écris ici va directement dans les pages de `design/entwurf/`. Ce qui est déjà rassemblé : ce que la personne a (`Inhalte vorhanden:` dans `docs/recherche.md`, P2), comment elle sonne et ce qu'elle promet (`Ton:` et `Kern:` dans `docs/konzept.md`, P5), et la liste de photos (dans `docs/inhalte.md`, P5). Les textes, c'est toi qui les proposes ; ce qui manque figure comme `[à compléter : ce qui manque, qui le livre et quand]` dans l'ébauche, et le nombre d'éléments à compléter figure dans la ligne `Seiten:` de `docs/entwurf.md`. La personne confirme les textes en parcourant le site.

Si le site est déjà en ligne et qu'un texte doit changer, c'est le skill `webseite-aendern` qui vaut.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement, court, concret. N'écris jamais les textes définitifs par-dessus la tête de la personne : tu fais des propositions, elle décide et modifie. À la fin, chaque texte doit sonner comme elle parle.

## Déroulement

### 1. Liste des contenus à partir du plan

Prends les pages de `docs/plan.md` (ligne `Seiten:`, skill `webseite-planen`). Crée `docs/inhalte.md` ou complète-la si elle existe déjà avec la liste de photos de P5 : pour chaque page, titre, deux ou trois phrases clés, images, le bouton vers la chose principale, état (brouillon, terminé, à compléter). La forme d'adresse et le ton, tu les prends dans `docs/konzept.md`.

### 2. La page d'accueil en trois phrases

Qui arrive sur la page d'accueil décide en quelques secondes s'il reste. Les trois phrases du haut doivent répondre à :

1. **Qu'est-ce que c'est ?** (« Cantine de midi pour écoliers à Sous-Gare »)
2. **Pour qui et pourquoi c'est bien ?** (« Cuisiné frais, encadré, à cinq minutes de l'école »)
3. **Et maintenant ?** Un bouton avec un verbe d'action : « Demander une place », pas « En savoir plus ».

### 3. Règles pour les textes sur le web

- Phrases courtes, une idée par phrase. La plupart des gens lisent sur leur natel.
- Le plus important d'abord. Les détails plus bas.
- Du concret plutôt que du langage publicitaire : « Nous répondons dans les 24 heures » plutôt que « service de première classe ».
- Garder une seule forme d'adresse, tu ou vous, selon le public (dans le plan de vol, elle figure dans `docs/konzept.md` sous `Ton:`).
- Des intertitres qu'on peut survoler.
- Chiffres, prix, horaires, adresse : mieux vaut vérifier deux fois. Des informations fausses coûtent la confiance.
- Ce qui manque, tu ne l'inventes pas. Ça figure de façon visible dans le texte, par exemple `[à compléter : horaires, Anna les livre d'ici le 7.11.2026]`, pour que personne ne l'oublie.

### 4. Textes avec l'IA

L'IA a le droit d'écrire des brouillons. Ensuite, avec la personne :

- Biffer tout ce qu'elle ne dirait jamais ainsi.
- Vérifier chaque affirmation. Ce qui n'est pas juste ou pas prouvable, dehors.
- Enlever les mots de remplissage typiques et les superlatifs creux (« innovant », « sur mesure », « sans couture »).
- Intégrer une vraie phrase d'elle : une expérience vécue, une raison pour laquelle elle fait ça.

### 5. Images

- **Ses propres photos battent les images de banque d'images.** De vraies personnes, un vrai lieu, la lumière du jour, un natel suffit. Ce que la personne doit photographier figure dans la liste de photos dans `docs/inhalte.md` : quoi, où, qui est dessus, pour quand.
- **Droits :** N'utiliser que des images que la personne a faites elle-même ou pour lesquelles elle a une licence. Une image trouvée avec la recherche Google n'est pas gratuite. Demander d'abord aux personnes reconnaissables (droit à l'image), pour les enfants aux parents.
- **Taille :** Les photos du natel sont beaucoup trop grandes. Les réduire à environ 2000 pixels de large au maximum et les enregistrer en WebP, par exemple avec `cwebp -q 80 foto.jpg -o foto.webp` ou un outil en ligne de son choix. Objectif : moins de 300 KB par image.
- **Une description pour chaque image** (texte alternatif), voir le skill `barrierefreiheit`.

### 6. Mettre dans l'ébauche

Demande à la personne de vérifier chaque information dans le texte (horaires, itinéraires, prix, noms). Tu ne les connais que par sa description. Ensuite, les textes et les images vont dans les pages de l'ébauche (`design/entwurf/`, les images dans `design/entwurf/bilder/`), et vous les regardez ensemble sur le natel, pas seulement sur l'ordinateur (skill `entwurf`). On ne construit qu'après l'autorisation de construire (P8) ; le skill `webseite-bauen` reprend alors les textes de l'ébauche.

Si le site est déjà construit ou en ligne, les nouveaux textes passent par le skill `webseite-aendern` : changer en local, montrer, validation, puis dans le journal de bord (skill `git-logbuch`) et en ligne.

## Vérifier la mission

`mission_pruefen` avec `webseite-03-inhalte`. La vérification regarde si le projet est au moins à l'étape « Ébauche » sur l'île : tout le site est là avec de vrais textes, à parcourir en cliquant. La liste des contenus `docs/inhalte.md` dans le projet en fait partie.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « la marchandise dans la vitrine », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert (les éléments à compléter, avec nom et date) et ce qui vient ensuite. Demande expressément à la personne de ramener le texte à sa propre voix et d'y vérifier chaque information (horaires, itinéraires, prix), car tu ne les connais que par sa description.
