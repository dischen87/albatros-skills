---
name: inhalte
description: "Aide une personne sans connaissances préalables à écrire et à choisir les textes et les images de son site web : la page d'accueil en trois phrases, des textes courts pour qui lit sur son natel, ses propres photos plutôt que des images de banque d'images, droits et taille des images, ramener des textes d'IA à sa propre voix. Le résultat est une liste des contenus dans docs/inhalte.md et les textes sur le site. Utilise ce skill quand on dit « écrire les textes », « qu'est-ce que j'écris sur la page d'accueil ? », « à propos de nous », « des images pour mon site », « j'ai le droit d'utiliser cette image ? », « le texte sonne comme de l'IA », « contenus »."
---

# Contenus : la marchandise dans la vitrine

## L'image

Le site web est une vitrine. La mise en forme, c'est la lumière et la décoration. Les contenus sont la marchandise. Une belle vitrine aux étagères vides ne vend rien. C'est pourquoi les contenus viennent avant la mise en forme.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement, court, concret. N'écris jamais les textes définitifs par-dessus la tête de la personne : tu fais des propositions, elle décide et modifie. À la fin, chaque texte doit sonner comme elle parle.

## Déroulement

### 1. Liste des contenus à partir du plan

Prends les pages de `docs/plan.md` (skill `webseite-planen`). Crée `docs/inhalte.md`, avec pour chaque page : titre, deux ou trois phrases clés, images, le bouton vers la chose principale, état (brouillon, terminé).

### 2. La page d'accueil en trois phrases

Qui arrive sur la page d'accueil décide en quelques secondes s'il reste. Les trois phrases du haut doivent répondre à :

1. **Qu'est-ce que c'est ?** (« Cantine de midi pour écoliers à Sous-Gare »)
2. **Pour qui et pourquoi c'est bien ?** (« Cuisiné frais, encadré, à cinq minutes de l'école »)
3. **Et maintenant ?** Un bouton avec un verbe d'action : « Demander une place », pas « En savoir plus ».

### 3. Règles pour les textes sur le web

- Phrases courtes, une idée par phrase. La plupart des gens lisent sur leur natel.
- Le plus important d'abord. Les détails plus bas.
- Du concret plutôt que du langage publicitaire : « Nous répondons dans les 24 heures » plutôt que « service de première classe ».
- Garder une seule forme d'adresse, tu ou vous, selon le public.
- Des intertitres qu'on peut survoler.
- Chiffres, prix, horaires, adresse : mieux vaut vérifier deux fois. Des informations fausses coûtent la confiance.

### 4. Textes avec l'IA

L'IA a le droit d'écrire des brouillons. Ensuite, avec la personne :

- Biffer tout ce qu'elle ne dirait jamais ainsi.
- Vérifier chaque affirmation. Ce qui n'est pas juste ou pas prouvable, dehors.
- Enlever les mots de remplissage typiques et les superlatifs creux (« innovant », « sur mesure », « sans couture »).
- Intégrer une vraie phrase d'elle : une expérience vécue, une raison pour laquelle elle fait ça.

### 5. Images

- **Ses propres photos battent les images de banque d'images.** De vraies personnes, un vrai lieu, la lumière du jour, un natel suffit.
- **Droits :** N'utiliser que des images que la personne a faites elle-même ou pour lesquelles elle a une licence. Une image trouvée avec la recherche Google n'est pas gratuite. Demander d'abord aux personnes reconnaissables (droit à l'image), pour les enfants aux parents.
- **Taille :** Les photos du natel sont beaucoup trop grandes. Les réduire à environ 2000 pixels de large au maximum et les enregistrer en WebP, par exemple avec `cwebp -q 80 foto.jpg -o foto.webp` ou un outil en ligne de son choix. Objectif : moins de 300 KB par image.
- **Une description pour chaque image** (texte alternatif), voir le skill `barrierefreiheit`.

### 6. Mettre sur le site

Demande à la personne de vérifier chaque information dans le texte (horaires, itinéraires, prix, noms). Tu ne les connais que par sa description. Ensuite, textes et images dans le projet, dans le journal de bord (skill `git-logbuch`) et, avec Pilot, par le tapis roulant (skill `pipeline`) sur le serveur. Puis regarder ensemble sur le natel, pas seulement sur l'ordinateur.

## Vérifier la mission

`mission_pruefen` avec `webseite-02-inhalte`. La vérification regarde si `~/projekt/docs/inhalte.md` existe et si le site répond sous `https://{name}.aufwind.sh`.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « la marchandise dans la vitrine », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite. Demande expressément à la personne de ramener le texte à sa propre voix et d'y vérifier chaque information (horaires, itinéraires, prix), car tu ne les connais que par sa description.
