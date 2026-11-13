---
name: kanaele
description: "Aide une personne sans connaissances préalables à créer elle-même des comptes de réseaux sociaux pour son site (Instagram en compte professionnel, page Facebook, page LinkedIn, Pinterest, TikTok en option), avec le même nom que le site et une bio avec lien ; les mots de passe et les codes restent chez elle. Ensuite « partager les nouveaux articles » : pour chaque nouvel article de blog, Bert écrit une courte publication par canal en brouillon (outil entwurf), la personne valide et publie elle-même ; comme aide récurrente avec l’outil aufgabe. Utilise ce skill pour « réseaux sociaux », « Instagram », « page Facebook », « LinkedIn », « Pinterest », « TikTok », « créer un compte », « partager un article », « écrire une publication », « comment faire connaître mon site »."
metadata:
  stand: 0.3.2
  quelle: 'e939e5cb6500'
---

# Canaux : les colonnes d'affichage en ville

## L'image

Ton site est ta boutique. Instagram, Facebook et les autres sont des colonnes d’affichage dans différents quartiers. Sur chaque affiche figurent le même nom et la même image, avec une flèche vers la boutique : le lien. Il n’y a que toi qui peux coller des affiches.

**Comment utiliser l'image :** dis-la à la personne en une phrase dans ta première réponse.

## Comment tu parles

- Tutoiement, phrases courtes, étapes numérotées, au plus deux questions par message.
- Les boutons des applis changent parfois de nom. Si la personne voit autre chose, elle te dit ce qu’elle voit.

## Trois règles fixes

1. **La personne crée les comptes elle-même.** Mots de passe et codes (double authentification), elle les tape seulement dans l’appli. Tu ne les demandes jamais et tu ne les vois jamais.
2. **Tu ne publies jamais.** Chaque publication est un brouillon. La personne la lit, la valide et la publie avec son propre clic. Cela vaut toujours, même si elle dit « fais-le simplement ».
3. **Dire ouvertement qui recommande.** Si une publication renvoie vers SwissActivities et que la personne y travaille, la publication dit : « Je travaille chez SwissActivities. Les conseils sont les miens. » (dans la langue de la publication). Tu l’ajoutes de toi-même et tu ne l’omets jamais. Raison : la publicité doit être reconnaissable comme telle (droit suisse de la concurrence déloyale). Les comptes ne ressemblent jamais aux comptes officiels de SwissActivities : nom propre, image propre. Si l’entreprise a des règles pour les réseaux sociaux, la personne le demande là-bas.

## 1. Préparer le nom et la bio

Tu écris `docs/kanaele.md` :

```markdown
# Kanäle
Name: <comme le site, p. ex. ausflugsmami>
Link: <adresse du site>
Bio: <au plus 150 caractères, avec la mention>
| Kanal | Konto | Stand |
|---|---|---|
| Instagram | @… | offen |

## Geteilt
```

Les noms des lignes et `## Geteilt` restent en allemand pour que l’aide récurrente les trouve ; après les deux-points, tu écris dans la langue de la personne.

1. **Nom :** le même que le site, partout le même. La personne vérifie dans chaque appli s’il est libre ; sinon un petit ajout, partout le même.
2. **Image :** logo ou la même photo sur tous les canaux.
3. **Bio :** par exemple « Sorties en famille en Suisse, testées par nous. Je travaille chez SwissActivities, les conseils sont les miens. » Plus le lien vers le site.

## 2. Créer les comptes (la personne le fait)

**Instagram (compte professionnel)**
1. Ouvrir l’appli Instagram, « Créer un compte », avec ton adresse e-mail.
2. Saisir le nom, la photo de profil et la bio de `docs/kanaele.md`.
3. Profil, menu ☰, « Type de compte et outils », « Passer à un compte professionnel », choisir une catégorie (p. ex. « Blogueur »), « Créateur ».
4. « Modifier le profil », « Liens », l’adresse de ton site.
5. Dans les paramètres, activer l’authentification à deux facteurs.

**Page Facebook**
1. Se connecter avec ton compte Facebook personnel. Une page en a besoin derrière elle ; il n’est pas affiché.
2. Menu, « Pages », « Créer une Page ».
3. Saisir le nom, la catégorie (p. ex. « Blogueur ») et la bio.
4. Photo de profil, photo de couverture et l’adresse de ton site.
5. « Terminé ». Puis activer l’authentification à deux facteurs dans les paramètres.

**Page LinkedIn**
1. Souvent, ton profil personnel suffit : tu y partages simplement les articles toi-même. Une page vaut la peine si les recommandations sont un projet à part.
2. Se connecter à LinkedIn, en haut « Pour les entreprises », « Créer une page Entreprise ».
3. Saisir le nom, l’adresse de la page (linkedin.com/company/<nom>), le site, le logo et le slogan.
4. Confirmer que tu as le droit de créer la page, et « Créer la page ».

**Pinterest**
1. Créer un compte professionnel : sur pinterest.ch « S’inscrire » et choisir « compte professionnel », ou convertir un compte existant.
2. Nom, photo de profil, à propos et l’adresse de ton site.
3. Confirmer le site : Pinterest montre un petit bout de code. Donne-le-moi, je l’intègre au site. Ce n’est pas un secret.
4. Créer des tableaux, par exemple « Jours de pluie avec enfants » et « Randonner avec une poussette ».

**TikTok (en option)**
1. Ouvrir l’appli TikTok, « S’inscrire », avec ton adresse e-mail.
2. Nom, photo de profil et bio de `docs/kanaele.md`.
3. Si un lien dans le profil n’est pas possible, l’adresse du site va dans la publication.
4. Dans les paramètres, activer l’authentification à deux facteurs.

Quand un compte est prêt, tu inscris son nom dans `docs/kanaele.md` et tu mets `Stand` sur `fertig`. Noms des menus selon les applis, non revérifiés le 13.11.2026.

## 3. Partager les nouveaux articles

Quand un article de blog est en ligne (skill `blog`), tu fais ceci :

1. **Lire :** titre, la phrase de `description`, adresse de l’article, image.
2. **Un brouillon par canal :** pour chaque canal prêt dans `docs/kanaele.md`, tu appelles `entwurf` avec `art: beitrag`. Dans `an` va le canal (p. ex. « Instagram »), dans `text` la publication. Court : une phrase qui rend curieux, une phrase d’utilité, le lien, trois à cinq hashtags et la mention de la règle 3.
3. **Chaque canal à sa façon :** Instagram avec « lien dans la bio » et image en format portrait ; Facebook avec le lien directement ; LinkedIn un peu plus sobre ; Pinterest comme épingle avec image en format portrait et lien ; TikTok comme texte pour une courte vidéo de la personne.
4. **La personne décide :** elle voit les brouillons dans Albatros, les modifie, valide et publie elle-même.
5. **Noter :** sous `## Geteilt` dans `docs/kanaele.md` vient `<slug> <JJ.MM.AAAA>`. Ainsi, aucun brouillon n’est fait deux fois.

Sans le programme Albatros, tu ranges les brouillons dans `docs/beitraege/<JJ.MM.AAAA>-<slug>.md` ; la personne les copie dans l’appli.

## 4. En faire une aide récurrente

Propose-le. Seulement après son oui, tu le crées avec `aufgabe`, avec `ausloeser: zeit` et `wiederholen: woechentlich` :

- **Titre :** « Partager les nouveaux articles »
- **Quand :** chaque lundi à 9 h (la personne choisit le jour et l’heure)
- **Instruction :** « Regarde dans web/src/content/blog/ s’il y a des articles en ligne qui manquent sous ## Geteilt dans docs/kanaele.md. Pour chacun : un brouillon par canal prêt avec entwurf, art beitrag, avec la mention de SwissActivities s’il y renvoie. Puis inscrire l’article sous ## Geteilt. Ne rien publier. »

Si `aufgabe` propose un déclencheur pour un site fraîchement publié, prends plutôt celui-là (`ausloeser: ereignis`). Les brouillons arrivent alors juste après la publication au lieu du lundi.

## Pièges

- Cinq noms pour un site : personne ne retrouve ce qui va ensemble. Partout le même nom.
- Un mot de passe dans le chat : dis à la personne de le changer tout de suite. Tu ne l’enregistres nulle part.
- Une publication sans mention de l’employeur : la phrase de la règle 3 va dans chaque publication avec un lien vers SwissActivities.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « les colonnes d'affichage en ville » qui redit l'essentiel. Ensuite : ce qui est fait, quels comptes sont prêts, ce qui reste ouvert et ce qui vient ensuite.
