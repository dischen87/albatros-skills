---
name: webseite-modernisieren
description: "Modernise un site web existant (association, magasin, cabinet, ancien site Jimdo, Wix ou WordPress) pour une personne sans connaissances préalables, comme variante du plan de vol. Commence tout de suite, sans poser de question, par l'état des lieux : toutes les pages, chaque fonction (formulaires, inscriptions, dates, PDF, prix, galeries, cartes, langues) et tous les contenus, avec des photos de l'ancien site dans docs/bestand.md. Ne demande ensuite que ce que seule la personne sait, surtout ce qui doit rester, et mène par le plan de la maison et la vérification du plan (aucune fonction ne se perd sans décision) jusqu'au nouveau site ; à la mise en ligne, le domaine déménage avec des redirections, l'e-mail reste intact. Utilise ce skill quand on dit « Modernise … », « notre site est dépassé », « renouveler le site web », « relaunch », « quitter Jimdo, Wix ou WordPress », « refaire l'ancien site », et tout de suite quand quelqu'un envoie seulement l'adresse d'un site web (https://…), sans autres mots."
metadata:
  stand: 0.2.0
  quelle: '8efafe8b2bdf'
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
- Tu ne demandes que ce que seule la personne sait, deux questions au maximum par message. Tout ce qui est écrit sur le site, tu le lis toi-même et tu le proposes comme `[Annahme: …]` (hypothèse). Les marques `[Annahme: …]` et `[offen: …]` restent en allemand, comme les noms des lignes dans `docs/` : c'est à elles que `lage` reconnaît ce qui est supposé ou encore ouvert.
- Ne demande jamais de mots de passe, pas même la connexion de l'ancien site. Ce qui se trouve derrière une connexion, tu le notes comme « pas consultable ».
- Apprendre ou faire, signaler les lacunes : comme dans le skill `lotse`.

## Le plan de vol quand on rénove

Moderniser suit le même plan de vol qu'un nouveau site (skill `lotse`, « Le plan de vol en trois grandes étapes »), avec ces différences :

| Section | Quand on rénove | Île |
|---|---|---|
| Idée (Idee) | courte : ce que l'ancien site veut, tu le lis toi-même ; la personne dit ce qui doit rester | `idee` |
| Recherche (Research) | l'état des lieux de l'ancien site (section « État des lieux » plus bas) | `recherche` |
| Plan de la maison, vérifier le plan (Grundriss, Plan prüfen) | skill `webseite-planen`, en plus : aucune fonction ne se perd sans décision | `plan`, `plan-geprueft` |
| Caractère, ébauche, construction | les skills habituels, avec l'état des lieux comme mandat | |
| Mise en ligne | en plus : le domaine déménage avec des redirections, les entrées e-mail (MX) restent intactes | |

Comme tu commences tout de suite, l'état des lieux vient en premier et l'idée courte après. Sur l'île, tu annonces quand même d'abord `idee`, puis `recherche`. Jusqu'à la validation, tout reste sur l'ordinateur de la personne et ne coûte rien chez Albatros.

## État des lieux (Bestandsaufnahme)

Le dossier de travail est un nouveau dossier dans le dossier actuel, nommé d'après le site (par exemple `curling-grindelwald`). Pour l'état des lieux, il ne faut ni compte ni serveur. Appelle d'abord `konto_status`. S'il montre un compte, tu ouvres tout d'abord l'île dans le navigateur web, avec `open https://albatros.build/fr/cockpit/insel` (Linux `xdg-open`, Windows `start`). Sans réponse ou sans compte, on continue sans l'île.

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
4. **Le plan de l'état des lieux `docs/bestand.md` :**

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

## L'idée, en bref

Dis avec des mots simples ce que tu as trouvé, brièvement et avec des chiffres : combien de pages, quelles fonctions, ce qui est dépassé, ce qui est bien. Ensuite, tu ne poses que les deux questions auxquelles seule la personne peut répondre :

1. **Qu'est-ce qui doit rester ?** Qu'est-ce qui est sacré : logo, couleurs, un texte, une page, une fonction ?
2. **Qui doit venir plus ?** Des hôtes, de nouveaux membres, des sponsors, des équipes pour les tournois ?

Qui s'occupe du site, tu le demandes plus tard, dans le plan de la maison. Le reste de l'idée, tu le proposes d'après l'ancien site, et la personne le confirme dans un seul message : nom du projet (le plus souvent le nom de l'ancien site), en une phrase, pour qui, chose principale, succès et mode (faire). Ensuite, tu écris comme dans le skill `webseite-planen`, section Idée (étapes 4 à 6) : `docs/projekt.md` avec `Bestehende Seite: <adresse>`, `AGENTS.md` avec `CLAUDE.md` et `GEMINI.md`, et l'esquisse grise `design/skizze.html` de la nouvelle page d'accueil, où figure déjà ce qui doit rester. Ouvre-la dans le navigateur web.

Ensuite `schritt_melden` avec `idee` et `titel`, la valeur de la ligne `Projektname:` dans `docs/projekt.md`, puis `mission_pruefen` avec `flugschule-11-idee`.

## La recherche à partir de l'état des lieux

Quand on rénove, la recherche est déjà presque faite : l'état des lieux est le meilleur guide de voyage. Écris `docs/recherche.md` avec les sept lignes tirées de l'état des lieux, chacune en début de ligne, sans gras, avec le nom allemand (modèle dans le skill `webseite-planen`, section Recherche) :

- `Vorbilder:` (modèles) l'ancien site (ouvert, avec la date), plus, si la personne le souhaite, jusqu'à deux sites comparables, chacun ouvert et joignable. Jamais d'adresses inventées.
- `Übliche Seiten und Funktionen:` ce que l'ancien site a (d'après `docs/bestand.md`).
- `Übernehmen:` (reprendre) ce qui doit rester. `Vermeiden:` (éviter) ce qui est dépassé.
- `Pflichten:` (obligations) mentions légales, protection des données, droits sur les images et les droits sur les textes et les images de l'ancien site (plus bas, « Droits »).
- `Inhalte vorhanden:` (contenus existants) d'après l'état des lieux ; ce qui manque ou est dépassé va sur la liste pour le skill `inhalte`.
- `Suchbegriffe:` (mots de recherche) comme `[Annahme: …]`, d'après les titres de l'ancien site.

Explique le résultat à la personne en cinq lignes. Ensuite `schritt_melden` avec `recherche` et `mission_pruefen` avec `flugschule-12-recherche`.

## Plan de la maison et vérification du plan

Suis le skill `webseite-planen`, section Plan de la maison (Grundriss). La plupart des réponses se trouvent déjà dans l'état des lieux : reprends-les et laisse la personne seulement confirmer. Chaque fonction de l'état des lieux entre dans le plan, avec une proposition :

- Ce qui n'a besoin que de textes et de fichiers (dates, tournois, PDF, prix, sponsors, galerie) devient un site normal sans services propres, aussi avec plusieurs langues.
- Formulaires : un lien e-mail suffit souvent. Si la liste des inscriptions doit être enregistrée, c'est une brique (skill `bausteine`, plus tard avec un serveur à soi).
- Un livre d'or plein de pub ou une connexion dont seule l'ancienne technique avait besoin peut disparaître, mais seulement avec une décision de la personne.
- Les anciennes adresses vers lesquelles d'autres font des liens (invitations aux tournois, classements, résultats Google) restent les mêmes ou reçoivent une redirection à la mise en ligne.

Tu inscris les décisions dans `docs/bestand.md` (colonne Décision) et dans `docs/plan.md`.

Ensuite vient la section « Vérifier le plan » de `webseite-planen`, avec un onzième point pour le deuxième avis : **aucune fonction de l'ancien site ne se perd sans décision** (chaque ligne de `docs/bestand.md` a une décision, et chacune qui reste figure dans le plan). On ne continue qu'après le oui de la personne au plan.

## Caractère, ébauche, construction

Ensuite, on continue comme pour chaque nouveau site, section après section avec `lage` : le caractère (skill `konzept`), la planche d'échantillons (skill `gestaltung`), tout le site comme ébauche (skill `entwurf`), puis construire, vérifier et valider sur l'ordinateur (skill `webseite-bauen`). Ton mandat, c'est `docs/plan.md` avec `docs/bestand.md`. En plus, ceci s'applique :

- Ce qui doit rester (logo, couleurs, un texte) est le cadre pour le caractère et la mise en forme. Regarde aussi les photos de l'ancien site : qu'est-ce qui est sacré, qu'est-ce qui fait dépassé ?
- L'ébauche, et plus tard le plan de construction, listent chaque fonction de `docs/bestand.md`, avec sa décision. Aucune ne disparaît en silence.
- Après la construction, tu montres avant et après côte à côte, la page d'accueil et la sous-page la plus importante, sur le natel et sur l'ordinateur, avec trois phrases sur ce qui est mieux et ce qui est resté pareil.

## Mise en ligne : le domaine déménage

Le domaine actuel de l'ancien site (par exemple `curling-wil.ch`) reste tel quel jusqu'à ce que le nouveau site soit en ligne (skill `lancieren`, section mise en ligne). Ensuite seulement, tu le fais pointer vers le nouveau site (skill `domain`, avec Albatros par `domain_verbinden`) :

- **Redirections :** chaque ancienne adresse de `docs/bestand.md` qui n'existe plus sur le nouveau site reçoit une redirection vers la nouvelle page qui correspond, pour que les liens des autres et les résultats Google ne mènent pas dans le vide. Avec un serveur à soi, ça se fait dans le serveur web (`nginx.conf`, `return 301`), sinon avec une petite page à l'ancienne adresse qui renvoie plus loin. Vérifie ensuite chaque ancienne adresse une fois.
- **Ne jamais toucher à l'e-mail :** le domaine reste chez son fournisseur et continue d'y coûter par an. Les entrées pour l'e-mail (MX), tu n'y touches jamais, sinon plus aucun e-mail n'arrive.

## Droits (Rechte)

Les textes, les photos et les logos de l'ancien site appartiennent à quelqu'un, en général à l'association ou à l'entreprise, parfois à une photographe. Qui modernise un site qui ne lui appartient pas a besoin de l'autorisation des exploitants avant que quoi que ce soit en soit publié. Les fichiers téléchargés sont une copie de travail, pour regarder. Les photos avec des personnes reconnaissables ont besoin de leur consentement. C'est pourquoi, avant de publier, tu demandes : « Est-ce que les textes et les images sont à vous, ou avez-vous l'autorisation, par exemple du comité ? »

## Pièges

- Une fonction se perd en silence : un formulaire remplacé par rien, des classements introuvables. À la fin, vérifie chaque ligne de l'état des lieux.
- Les anciennes adresses cassent : les invitations aux tournois et les classements sont souvent liés depuis d'autres sites.
- Reprendre telle quelle une galerie de milliers d'images : mieux vaut une sélection des meilleures, réduites, le reste reste dans les archives.
- Avoir l'air fait par une IA : lis dans le skill `gestaltung` la liste des signes typiques avant de concevoir la première page.
- Reprendre la bannière de cookies de l'ancienne page : un site sans suivi et sans intégrations externes ne pose pas de cookies et n'en a pas besoin. La déclaration de protection des données suffit. Une bannière ne vient que si quelque chose demande un consentement, par exemple une carte Google intégrée. Au lieu de la carte, un lien « Itinéraire » avec l'adresse suffit souvent, et la page reste sans bannière.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « rénover une vieille maison », qui redit l'essentiel. Ensuite : ce qui est trouvé ou construit, où ça se trouve (`docs/bestand.md`, photos), ce que la personne doit encore décider et ce qui vient ensuite.
