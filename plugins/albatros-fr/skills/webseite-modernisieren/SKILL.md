---
name: webseite-modernisieren
description: "Modernise un site web existant (association, magasin, cabinet, ancien site Jimdo, Wix ou WordPress) pour une personne sans connaissances préalables. Commence tout de suite, sans poser de question, par l'état des lieux : toutes les pages, chaque fonction (formulaires, inscriptions, dates, PDF, prix, galeries, cartes, langues) et tous les contenus, avec des photos de l'ancien site dans docs/bestand.md. Ne demande ensuite que ce que seule la personne sait, et mène par le plan et la mise en forme jusqu'au nouveau site, sans qu'une fonction se perde sans qu'on l'ait demandé. Utilise ce skill quand on dit « Modernise … », « modernise notre site web », « notre site est dépassé », « renouveler le site web », « relaunch », « quitter Jimdo, Wix ou WordPress », « refaire l'ancien site », et tout de suite quand quelqu'un envoie seulement l'adresse d'un site web (https://…), sans autres mots."
---

# Moderniser un site web : rénover une vieille maison

## L'image

Une vieille maison, on la rénove, on ne la démolit pas. D'abord, quelqu'un passe dans chaque pièce avec un bloc-notes et un appareil photo : qu'est-ce qu'il y a, qu'est-ce qui marche, qu'est-ce qui est pourri, et qu'est-ce qui est sacré pour la famille, par exemple le poêle en faïence. C'est seulement avec ce plan de l'état des lieux qu'on transforme. Et aucun mur ne disparaît sans que la famille ait dit oui.

**Comment utiliser l'image :** une phrase dans ta première réponse, avec ce que tu es en train de faire.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Commencer tout de suite.** Si la personne envoie une adresse ou « Modernise … », tu ne demandes pas ce qu'elle veut. Tu dis en une phrase que tu vas maintenant regarder chaque pièce de l'ancien site et combien de temps ça prend à peu près, et tu commences.
- La personne n'a jamais besoin de savoir quelle est la prochaine étape. Tu la proposes et tu la fais après un bref oui.
- Tutoiement, langage de tous les jours. Au lieu de « sitemap », tu dis « liste de toutes les pages », au lieu de « backend de formulaire », « où vont les demandes ».
- Tu ne demandes que ce que seule la personne sait. Tout ce qui est écrit sur le site, tu le lis toi-même.
- Ne demande jamais de mots de passe, pas même la connexion de l'ancien site. Ce qui se trouve derrière une connexion, tu le notes comme « pas consultable ».

## Déroulement

### 1. État des lieux, sans poser de question

Le dossier de travail est un nouveau dossier dans le dossier actuel, nommé d'après le site (par exemple `curling-grindelwald`). Pour l'état des lieux, il ne faut ni compte ni serveur. Appelle d'abord `konto_status`. S'il montre un compte, tu ouvres tout d'abord l'île dans le navigateur web, avec `open https://albatros.build/fr/cockpit/insel` (skill `webseite-bauen`, section « L'île »). Sans réponse ou sans compte, on continue sans l'île.

1. **Lire toutes les pages.** Le script `bestand.mjs` se trouve dans le dossier de ce skill (dans Claude Code, le chemin est indiqué en haut comme « Base directory for this skill »). Il n'a besoin que de Node :
   ```bash
   node <dossier-de-ce-skill>/bestand.mjs https://www.beispiel.ch docs/bestand
   ```
   Il lit `sitemap.xml`, suit les liens de la même adresse et range : `docs/bestand/bestand.json` (pages, formulaires avec leurs champs, contenus intégrés, e-mail, téléphone, prix, horaires, documents, services externes), le texte de chaque page dans `docs/bestand/seiten/` et les images et documents dans `docs/bestand/dateien/`. Sans Node, tu récupères la liste des pages avec `curl -sL https://www.beispiel.ch/sitemap.xml` et chaque page une par une.
2. **Photos de l'ancien site.** De chaque page du menu, une photo en largeur natel et en largeur ordinateur. La première fois, Playwright télécharge un navigateur web (environ 150 Mo) :
   ```bash
   npx -y playwright install chromium
   npx -y playwright screenshot --viewport-size=390,844 --full-page https://www.beispiel.ch/ docs/bestand/fotos/start-390.png
   npx -y playwright screenshot --viewport-size=1440,900 https://www.beispiel.ch/ docs/bestand/fotos/start-1440.png
   ```
   Regarde toi-même chaque photo. Elles montrent ce que les textes ne disent pas : l'ordre, les images, si le site marche bien sur le natel.
3. **Trouver chaque fonction.** Parcours les textes et les photos avec cette liste et note pour chaque point où il se trouve et comment il est construit aujourd'hui :
   - Formulaires : contact, inscription, réservation, commande, bourse aux joueurs ou aux partenaires, livre d'or. Quels champs, où vont les demandes ?
   - Dates : calendrier, tournois, cours, horaires d'entraînement, horaires d'ouverture, saison.
   - Documents : PDF (invitations aux tournois, classements, statuts, cartes des menus), combien, de quand ils datent.
   - Prix, cotisations, tarifs.
   - Images : galeries (albums, nombre), logos, sponsors avec liens.
   - Contenus intégrés et systèmes externes : carte, vidéo, système de réservation, boutique, newsletter, réseaux sociaux, météo, webcam (`einbettungen` et `fremdeDienste` dans `bestand.json`).
   - Espaces avec connexion, langues, mentions légales et protection des données, liens vers d'autres sites.

### 2. Le plan de l'état des lieux `docs/bestand.md`

```markdown
# État des lieux : <nom du site>

**Adresse :** … · **relevé le :** <date> · **construit avec :** <p. ex. Jimdo> · **Pages :** <nombre> · **Langues :** …

## Pages
| Page | Adresse | Ce qu'il y a dessus, en une phrase | État | Photo |
|---|---|---|---|---|

## Fonctions
| Fonction | Où | Comment aujourd'hui | Doit rester ? | Décision |
|---|---|---|---|---|
| Formulaire de contact (nom, e-mail, message) | /kontakt | Formulaire de Jimdo | oui | ouvert |

## Contenus
Textes, images (nombre, propres ou d'autres), documents, logos, sponsors.

## Ce qui est dépassé
Chaque point avec une preuve, par exemple « news de 2019 sur la page d'accueil », « images floues sur le natel », « livre d'or plein de pub ».

## Ce qui doit rester
Ce dont les visiteurs ont besoin et ce qui est bien.

## Questions ouvertes
```

La colonne **Décision** reste « ouvert » jusqu'à ce que la personne ait décidé : « reste », « nouveau sous forme de … » ou « supprimé (décidé le <date>) ». Aucune fonction ne disparaît du nouveau site tant qu'une telle décision n'est pas inscrite ici.

`docs/bestand/dateien/` ne va pas dans le journal de bord : le dossier est trop gros et contient des droits d'autrui. Inscris-le dans `.gitignore`. Ce dont le nouveau site a besoin, tu le copies plus tard de manière ciblée.

### 3. Faire le compte rendu, puis seulement trois questions

Dis avec des mots simples ce que tu as trouvé, brièvement et avec des chiffres : combien de pages, quelles fonctions, ce qui est dépassé, ce qui est bien. Ensuite, tu ne poses que les questions auxquelles seule la personne peut répondre, numérotées, dans un seul message :

1. **Qui s'occupe du site** aujourd'hui et à l'avenir, et à quelle fréquence quelque chose change ?
2. **Qu'est-ce qui est sacré ?** Qu'est-ce qui doit rester exactement comme ça (logo, couleurs, un texte, une page, une fonction) ?
3. **Qui doit venir plus ?** Des hôtes, de nouveaux membres, des sponsors, des équipes pour les tournois ?

Tout le reste, tu le proposes toi-même, avec des hypothèses marquées (`[Hypothèse : …]`) que la personne peut corriger.

### 4. De l'état des lieux au plan

Suis le skill `webseite-planen`. La plupart des réponses se trouvent déjà dans l'état des lieux : reprends-les et laisse la personne seulement confirmer. Chaque fonction de l'état des lieux entre dans le plan, avec une proposition :

- Ce qui n'a besoin que de textes et de fichiers (dates, tournois, PDF, prix, sponsors, galerie) devient une page statique normale, aussi avec plusieurs langues (Light suffit).
- Formulaires : un lien e-mail suffit souvent. Si la liste des inscriptions doit être enregistrée, c'est une brique (skill `bausteine`, avec Pilot).
- Un livre d'or plein de pub ou une connexion dont seule l'ancienne technique avait besoin peut disparaître, mais seulement avec une décision de la personne.
- Les anciennes adresses vers lesquelles d'autres font des liens (invitations aux tournois, classements, résultats Google) restent les mêmes ou reçoivent une redirection.

Tu inscris les décisions dans `docs/bestand.md` (colonne Décision) et dans `docs/plan.md`.

### 5. Construire en huit étapes

À partir d'ici, tu suis le skill `webseite-bauen`, dans son ordre fixe : mandat, maquette, système de design, stack technique, PRD avec critères de réception, construction en local, quatre vérifications, validation, port, tapis roulant et en ligne. Ton mandat, c'est `docs/bestand.md`. En plus, ceci s'applique :

- Le PRD liste chaque fonction de `docs/bestand.md`, avec sa décision. Aucune ne disparaît en silence.
- Pour la mise en forme, tu regardes aussi les photos de l'ancien site : qu'est-ce qui est sacré (logo, couleurs) ? Qu'est-ce qui fait dépassé ?
- Après la construction en local, tu montres avant et après côte à côte, la page d'accueil et la sous-page la plus importante, sur le natel et sur l'ordinateur, avec trois phrases sur ce qui est mieux et ce qui est resté pareil.
- Le domaine actuel de l'ancien site (par exemple `curling-wil.ch`) reste tel quel jusqu'à ce que le nouveau site soit en ligne sous `{name}.aufwind.sh`. Ensuite seulement, tu le fais pointer vers le nouveau site avec `domain_verbinden` (skill `domain`, étape 4), avec Light comme avec Pilot. Le domaine reste chez son registraire et continue d'y coûter par an. Tu ne touches pas aux entrées e-mail (MX).

## Droits

Les textes, les photos et les logos de l'ancien site appartiennent à quelqu'un, en général à l'association ou à l'entreprise, parfois à une photographe. Qui modernise un site qui ne lui appartient pas a besoin de l'autorisation des exploitants avant que quoi que ce soit en soit publié. Les fichiers téléchargés sont une copie de travail, pour regarder. Les photos avec des personnes reconnaissables ont besoin de leur consentement. C'est pourquoi, avant de publier, tu demandes : « Est-ce que les textes et les images sont à vous, ou avez-vous l'autorisation, par exemple du comité ? »

## Pièges

- Une fonction se perd en silence : un formulaire remplacé par rien, des classements introuvables. À la fin, vérifie chaque ligne de l'état des lieux.
- Les anciennes adresses cassent : les invitations aux tournois et les classements sont souvent liés depuis d'autres sites.
- Reprendre telle quelle une galerie de milliers d'images : mieux vaut une sélection des meilleures, réduites, le reste reste dans les archives.
- Avoir l'air fait par une IA : lis dans le skill `gestaltung` la liste des signes typiques avant de construire la première page.
- Reprendre la bannière de cookies de l'ancienne page : une page statique sans suivi et sans intégrations externes ne pose pas de cookies et n'en a pas besoin. La déclaration de protection des données suffit. Une bannière ne vient que si quelque chose demande un consentement, par exemple une carte Google intégrée. Au lieu de la carte, un lien « Itinéraire » avec l'adresse suffit souvent, et la page reste sans bannière.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « rénover une vieille maison », qui redit l'essentiel. Ensuite : ce qui est trouvé ou construit, où ça se trouve (`docs/bestand.md`, photos), ce que la personne doit encore décider et ce qui vient ensuite.
