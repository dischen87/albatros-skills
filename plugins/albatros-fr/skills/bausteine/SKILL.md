---
name: bausteine
description: "Découvre avec une personne sans connaissances préalables ce que sa page doit savoir faire, et installe les briques toutes faites qui conviennent : liste d'inscription, réservations pour des cours et des rendez-vous, espace membres avec connexion, tableau d'affichage (PocketBase) ou un grand CMS (Strapi avec Postgres), avec la mémoire vive mesurée. Explique avec l'image des éléments préfabriqués dans la construction d'une maison. Utilise ce skill pour « inscription », « liste d'inscription », « réservation », « outil de réservation », « réserver un cours », « prendre rendez-vous », « réserver une place », « enregistrer un formulaire », « connexion », « se connecter », « espace membres », « espace admin », « gérer les utilisateurs », « base de données », « Strapi », « CMS », « PocketBase », « brique », « qu'est-ce qui tient sur mon serveur ? », « est-ce que mon serveur suffit ? », et quand une page doit savoir faire plus que montrer des textes et des images."
---

# Briques : des éléments préfabriqués pour ta page

## L'image

Quand on construit une maison, on ne fabrique pas soi-même les fenêtres, les portes et la cuisine. Elles arrivent toutes faites de l'usine, contrôlées et avec leur mode d'emploi, et on les pose. Pour un site web, c'est pareil : la connexion, la liste d'inscription ou un système pour les contenus, personne ne les écrit de zéro. Albatros les tient prêts sous forme de briques toutes faites, testées et mesurées.

Et comme pour la maison : chaque élément prend de la place. C'est pourquoi tu regardes d'abord ce dont la personne a vraiment besoin.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque une information, donne quand même les étapes concrètes avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement, phrases courtes. Au lieu de « authentification », tu dis « se connecter avec e-mail et mot de passe », au lieu de « back-office », « administration ».
- Ne demande jamais de mots de passe ni de clés. Le premier compte de l'administration, la personne le crée elle-même dans le navigateur web. Les clés d'API (par exemple pour les e-mails), elle les tape seulement là.

## 1. Qu'est-ce que tu veux construire ?

Une question par message, et seulement autant qu'il en faut pour que la réponse soit claire :

1. Que doit faire la page ? En une phrase.
2. Dans quelles langues ?
3. Qui modifie les contenus : seulement toi avec ton IA, ou aussi d'autres personnes sans terminal ?
4. Les visiteurs doivent-ils remplir quelque chose, s'inscrire ou se connecter ? Veux-tu voir une liste des inscriptions ?
5. Y a-t-il quelque chose derrière, par exemple un paiement, des réservations ou une newsletter ?

## 2. Ce qui en découle

| La personne dit … | Ce qui convient | Abonnement | Mémoire vive en fonctionnement |
|---|---|---|---|
| Il n'y a que moi qui m'occupe de la page, pas de connexion, aussi en plusieurs langues | Une page normale tirée du modèle, sans brique. Un dossier par langue (`seite/fr/`). Les listes comme l'agenda ou les produits sous forme de fichier dans le projet (`seite/daten/termine.json`), que la page lit : une base de données légère dans le code. | Light | rien de plus |
| Paiement, dons | Lien de paiement d'un fournisseur comme Stripe (Payment Link), sous forme de bouton sur la page | Light | rien de plus |
| Newsletter | Un service comme Brevo, avec le formulaire du service sur la page | Light | rien de plus |
| Des gens s'inscrivent, je veux voir la liste | **Liste d'inscription** (PocketBase, recette `anmeldeliste`) | Pilot | environ 20 MB |
| Les visiteurs réservent une place ou un rendez-vous (cours, visite guidée, rendez-vous chez le coiffeur), je veux voir les réservations et pouvoir les annuler | **Réservations** (PocketBase, recette `buchungen`) | Pilot | environ 20 MB |
| Des membres se connectent et voient un espace à eux | **Espace membres avec connexion** (PocketBase, recette `mitglieder`) | Pilot | environ 20 MB |
| D'autres s'occupent des actualités ou de l'agenda dans le navigateur web | **Tableau d'affichage** (PocketBase, recette `pinnwand`) | Pilot | environ 20 MB |
| Beaucoup de types de contenu, plusieurs rôles, gestion des images, plus tard une app | **Grand CMS** (Strapi avec Postgres) | Pilot | environ 200 MB, construction jusqu'à 2,5 GB |

Recommande toujours le plus petit qui suffit. Plusieurs langues, à elles seules, ne sont jamais une raison pour une brique. PocketBase couvre à la fois la liste d'inscription, la connexion et le tableau d'affichage, et il ne tourne qu'une seule fois. Strapi ne vaut la peine que quand PocketBase devient trop petit.

Si la personne a Light et a besoin d'une brique : dis-le honnêtement. Les briques tournent sur un serveur à soi, donc avec Pilot (skill `kosten`, changement via `upgrade_link` avec `pilot`). Le journal de bord et l'adresse restent.

## 3. Qu'est-ce qui tient sur le serveur ?

Un serveur avec Pilot a 4 GB de mémoire vive et 40 GB d'espace disque, sans espace d'échange : si ça devient trop, le serveur arrête un programme. Mesuré le 28.10.2026 (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17) :

| Quoi | En fonctionnement | Pendant la construction | Espace disque |
|---|---|---|---|
| Site web tiré du modèle | 10 MB | bref | petit |
| PocketBase (toutes les recettes ensemble) | 20 MB | bref | 40 MB |
| Strapi avec Postgres | 150 MB + 55 MB | pic à 2,5 GB, première construction environ 7 minutes | 1,4 GB |

Site web, PocketBase et Strapi ensemble ont besoin d'environ 250 MB en fonctionnement. Ça ne devient serré que pendant la construction, c'est pourquoi le tapis roulant construit une tâche après l'autre. Les programmes qui ont besoin à eux seuls de plus de 1 GB n'ont pas leur place sur le serveur, par exemple Keycloak, Supabase, Logto, Mattermost ou la reconnaissance de texte (OCR). Pour une connexion à toi, prends PocketBase.

Avant l'installation : `free -h` sur le serveur montre combien il reste de libre. Après l'installation : `docker stats --no-stream` montre ce dont chaque brique a besoin.

## 4. Installer

Valable pour chaque brique. Prends d'abord une photo du serveur : outil `snapshot` avec le nom `vor-baustein` (skill `zurueck-auf-gestern`).

1. **Aller chercher.** Dans le journal de bord sur l'ordinateur de la personne (skill `git-logbuch`), tu télécharges la brique depuis l'usine, le dépôt public d'Albatros :
   ```bash
   curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
   ```
   Pour Strapi, il y a `bausteine/strapi` à la fin. Les recettes se trouvent ensuite sous `bausteine/<baustein>/rezepte/`.
2. **Brancher.** Tout en haut de `compose.yaml` :
   ```yaml
   include:
     - bausteine/pocketbase/compose.yaml
   ```
   Le site web transmet lui-même les demandes : le modèle lit chaque `bausteine/*/nginx.conf`. Si le projet est plus ancien que les briques (pas de `nginx.conf` dans le projet), va chercher `Dockerfile` et `nginx.conf` dans `vorlage/` du même dépôt.
3. **Mettre en place la recette** (section 5 ou 6), et traduire les textes des pages dans la langue de la personne.
4. **Dans le journal de bord et au port.** Le tapis roulant construit et livre (skill `pipeline`). Si la construction échoue, l'ancienne page reste en ligne.
5. **Vérifier** sur le serveur : `docker ps` affiche la brique comme `healthy`.

## 5. PocketBase : liste d'inscription, réservations, membres, tableau d'affichage

PocketBase est un seul petit programme avec base de données, connexion et administration. Le site web lui parle sous `/api/` de sa propre adresse. L'administration reste fermée au public.

- **Inscrire l'adresse :** dans `bausteine/pocketbase/pb_migrations/1_einstellungen.js`, mettre la ligne `ADRESSE` sur l'adresse de la page (`https://{name}.aufwind.sh` ou le propre domaine). Elle apparaît dans les e-mails comme « Mot de passe oublié ».
- **Mettre en place la recette :** depuis `bausteine/pocketbase/rezepte/<rezept>/`, `pb_migrations/2_*.js` va dans `bausteine/pocketbase/pb_migrations/`, `pb_hooks/*` (s'il y en a) dans `bausteine/pocketbase/pb_hooks/` et `seite/*.html` dans `seite/`.
  - `anmeldeliste` : formulaire `anmelden.html`. Tout le monde peut s'inscrire, seule l'administration peut lire.
  - `buchungen` : `buchen.html` affiche les dates libres, prend les réservations et les annule par le lien de l'e-mail. Plus de détails plus bas, sous « Réservations ».
  - `mitglieder` : `mitglieder.html` pour créer un compte, se connecter et se déconnecter. Seuls les membres connectés voient les messages. Les membres se trouvent dans l'administration sous `users`.
  - `pinnwand` : `pinnwand.html` affiche des articles avec date et image. On les écrit dans l'administration.
  - Des champs ou des collections en plus, tu les écris dans un autre fichier `pb_migrations/3_*.js`, sur le même modèle.
- **Premier compte de l'administration :** après le premier démarrage, PocketBase écrit un lien d'installation dans ses messages. Va le chercher et ouvre le passage secret (tunnel), ainsi l'administration reste invisible depuis Internet :
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && docker compose logs pocketbase' | grep pbinstall
  ssh -N -L 8090:localhost:8090 {name}@aufwind.sh
  ```
  Tu laisses tourner la deuxième commande en arrière-plan. Donne le lien à la personne avec `http://localhost:8090` au lieu de `http://0.0.0.0:8090`. Elle y choisit son e-mail et son mot de passe, seulement dans le navigateur web. Si le lien a expiré : `docker compose restart pocketbase` sur le serveur, et il y en a un nouveau. Plus tard, ça passe par `http://localhost:8090/_/`, tant que le tunnel est ouvert.
- **Ouvrir l'administration :** si d'autres ont besoin de l'administration sans terminal, ou si la personne veut voir la liste sur son natel : dans `bausteine/pocketbase/nginx.conf`, enlever les `#` devant le bloc « Verwaltung freigeben » (ouvrir l'administration), puis dans le journal de bord et au port. Elle se trouve alors sous `https://{name}.aufwind.sh/_/`, protégée par le mot de passe de l'administration. N'ouvrir que quand le premier compte existe. Dès que les e-mails partent, la personne active dans l'administration, sous `_superusers` → Options, la connexion à deux facteurs (MFA).
- **E-mails** (confirmer l'adresse, mot de passe oublié) : le serveur n'a pas le droit d'envoyer par les ports habituels des e-mails. Dans l'administration, sous Settings → Mail settings : serveur SMTP `smtp.resend.com`, port `2587`, utilisateur `resend`, et comme mot de passe la clé d'API de Resend. La personne la tape elle-même à cet endroit. Brevo marche aussi, avec `smtp-relay.brevo.com` et le port `2525`. L'expéditeur est une adresse du propre domaine, confirmée auprès du service d'e-mails.
- **Se connecter avec Google, Apple ou GitHub :** ça se règle dans l'administration sous `users` → Options → OAuth2. Il faut un compte chez le fournisseur concerné. Ne le fais que quand l'e-mail et le mot de passe fonctionnent.

### Réservations

La recette `buchungen` est un petit outil de réservation pour des cours, des visites guidées et des rendez-vous, sans compte client et sans paiement en ligne. Elle est testée : deux personnes n'obtiennent jamais la même dernière place, les dates passées ne peuvent pas être réservées, les e-mails donnent l'heure en heure suisse.

- **Ce dont la personne s'occupe,** dans l'administration : `angebote` (les offres : titre, lieu, indication de prix comme « CHF 25, en espèces ou TWINT sur place », clôture des réservations en heures, actif) et `termine` (les dates : offre, début, fin, places). Les réservations, elle les voit sous `buchungen`. En annuler une seule : statut `storniert` et une raison. Annuler tout un cours : sur la date, `abgesagt` et la raison, toutes les personnes qui ont réservé reçoivent un e-mail. Ne jamais supprimer de dates.
- **D'abord les e-mails :** sans réglages des e-mails (point « E-mails » plus haut), personne ne reçoit de confirmation. Ne mettre en ligne que quand une réservation de test est arrivée à l'adresse de la personne. Les avis de nouvelles réservations vont à l'adresse de l'expéditeur ; une autre, tu l'inscris dans `pb_hooks/buchungen.js` à `MELDUNGEN_AN`.
- **Tester avant chaque push** sur l'ordinateur de la personne (Mac ou Linux, sous Windows dans WSL) : `bun bausteine/pocketbase/rezepte/buchungen/test.ts`. Il télécharge PocketBase et vérifie tout, aussi cinq réservations simultanées sur la dernière place. Si vous modifiez quelque chose dans la recette, il doit rester vert.
- **Adapter la page :** `buchen.html` reprend les couleurs, la police et les espacements du site (mettre les variables tout en haut du fichier sur les valeurs de `tokens.css`), les textes passent dans la langue de la personne. « Réserver une place » devient le bouton principal de la page d'accueil.
- **Si vous l'étendez, ces règles restent :** les places libres, c'est toujours les places moins les réservations actives, jamais un compteur. La vérification se fait sur le serveur (`pb_hooks/`), jamais seulement dans le navigateur web. Enregistrer les heures comme un instant précis, les afficher avec `Europe/Zurich`. Donner les délais avec la date et l'heure, jamais « 24 h avant ». Après la réservation, une page de confirmation et un e-mail. Ne demander que le nécessaire : pas d'adresse, pas de date de naissance, pas d'informations sur la santé. Un délai d'effacement (proposition : 12 mois après la date) va dans la déclaration de protection des données (skill `recht-ch`).
- **Volontairement pas inclus,** seulement quand ça manque : le paiement en ligne (s'il y a beaucoup de personnes qui ne viennent pas sans prévenir, ou pour un acompte : un lien de paiement avec le numéro de réservation), des comptes clients pour des abonnements ou des cartes de 10 entrées (recette `mitglieder`), une liste d'attente, un rappel la veille.
- **Avec Light,** pas de vraie réservation : sans programme sur le serveur, personne ne compte les places. Le dire honnêtement et laisser le choix : une demande par e-mail ou par un service de formulaires (« Tu reçois une confirmation d'ici demain »), un lien vers l'outil de réservation d'un autre fournisseur (payant, données souvent à l'étranger), ou Pilot avec cette recette.

## 6. Strapi : le grand CMS

Strapi est un système complet pour les contenus, avec des rôles et une gestion des images, accompagné de sa propre base de données (Postgres). Pour en savoir plus, et pour savoir si ça vaut la peine : skill `cms`.

1. **D'abord les secrets,** avant que `include` soit au port, sinon la première construction échoue. Depuis le journal de bord, sans que tu les voies :
   ```bash
   ssh {name}@aufwind.sh 'mkdir -p ~/projekt/bausteine/strapi && sh -s ~/projekt/bausteine/strapi' < bausteine/strapi/geheimnisse.sh
   ```
2. **Les types de contenu sous forme de fichiers :** sur le serveur, Strapi tourne en mode production, on ne peut pas y créer de types de contenu en cliquant. Tu les écris sous `bausteine/strapi/cms/src/api/`. La recette `veranstaltungen` montre le modèle : `schema.json` plus contrôleur, route et service.
3. **Lecture pour tout le monde :** dans `bausteine/strapi/cms/src/index.ts`, inscrire le type dans `OEFFENTLICH`, par exemple `'api::veranstaltung.veranstaltung'`. La page lit alors `/cms/api/veranstaltungen` de sa propre adresse, les images arrivent par `/cms/uploads/`. On n'écrit que dans l'administration.
4. **Ajouter `include`, puis dans le journal de bord et au port.** La première construction dure environ 7 minutes. Dis-le avant, pour que personne ne pense que c'est bloqué.
5. **Premier compte de l'administration :** tunnel `ssh -N -L 1337:localhost:1337 {name}@aufwind.sh`, puis `http://localhost:1337/admin`. La personne y crée elle-même le compte.
6. **Ouvrir l'administration** (pour une rédaction sans terminal) : seulement quand le premier compte existe, sinon une personne inconnue pourrait s'inscrire avant. Dans `bausteine/strapi/nginx.conf`, remplacer le premier bloc par le bloc « Verwaltung freigeben » (ouvrir l'administration), sans les `#` ; dans `bausteine/strapi/cms/config/server.ts`, activer la ligne `url: '/cms'` ; puis dans le journal de bord et au port. L'administration se trouve alors sous `https://{name}.aufwind.sh/cms/admin`. La personne y invite la rédaction (Settings → Users, rôle Editor ou Author). Chaque personne choisit elle-même son mot de passe.
7. **Les entrées apparaissent** dès qu'elles sont publiées dans l'administration. Pas besoin d'une nouvelle construction pour ça.

## Pièges

- **Administration ouverte avant que le premier compte existe :** d'abord créer le compte par le tunnel, ensuite ouvrir. N'ouvrir que si d'autres en ont besoin sans terminal.
- **Une brique de trop :** chaque élément doit être entretenu et mis à jour. Mieux vaut une seule qui tourne bien.
- **Mises à jour :** les versions figurent dans le `Dockerfile` (PocketBase) et dans `package.json` (Strapi). Avant chaque mise à jour, prendre une photo.
- **Données :** elles se trouvent dans des volumes sur le serveur et font partie des photos quotidiennes. `docker compose down -v` les efface : jamais sans photo et sans le oui de la personne.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « les éléments préfabriqués dans la construction d'une maison », qui redit l'essentiel. Ensuite : ce qui est installé, où ça tourne et combien de mémoire vive ça demande, ce qui reste ouvert et ce qui vient ensuite.
