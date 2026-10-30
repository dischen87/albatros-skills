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
  - `buchungen` : `buchen.html` (dates libres, réserver, annuler par le lien de l'e-mail) et `verwaltung.html` (« Mes réservations » pour la personne : qui vient, annuler, programme de la semaine). Plus de détails plus bas, sous « Réservations ».
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

La recette `buchungen` est un petit outil de réservation pour des cours, des visites guidées et des rendez-vous, sans compte client et sans paiement en ligne. Elle est testée : deux personnes n'obtiennent jamais la même dernière place, les dates passées ne peuvent pas être réservées, un cours reste à 18:30 même après le changement d'heure, les e-mails donnent l'heure suisse.

**Tu le dis ainsi à la personne :** « Les visiteurs choisissent une date sur ton site et reçoivent une confirmation par e-mail. Tu inscris tes cours une seule fois comme programme de la semaine, par exemple chaque lundi à 18:30 avec 12 places, et tu vois sur la page “Mes réservations” qui vient. »

La technique, c'est toi qui t'en occupes, la personne ne fait que décider. Dans cet ordre :

1. **Photo du serveur** (outil `snapshot`, nom `vor-baustein`), avant d'installer quoi que ce soit.
2. **Demander les cours avant de construire :** nom, jour de la semaine, heure, durée, places, lieu, prix et jusqu'à combien de temps avant le début on peut réserver. Si le plan dit seulement « on l'a », demande-les maintenant. Écris-les dans `docs/kurse.md` et comme `bausteine/pocketbase/pb_migrations/3_kurse.js` (modèle plus bas) : ainsi les dates sont là dès le premier démarrage, personne ne les recopie.
3. **Installer :** `2_buchungen.js` dans `bausteine/pocketbase/pb_migrations/`, les deux fichiers de `pb_hooks/` dans `bausteine/pocketbase/pb_hooks/`. Le dossier `rezepte/buchungen`, tu le laisses en place, c'est là que se trouve le test.
4. **En faire deux vraies pages,** avec en-tête, menu et pied de page comme toutes les autres, jamais les fichiers HTML nus :
   - `seite/buchen.html` devient la page pour réserver, par exemple `web/src/pages/kurse.astro` dans la mise en page du site : reprendre le contenu de `<main>`, le script comme `<script is:inline>`, et des styles seulement les parties sans `body`, `main` et `h1`. En haut, le programme de la semaine en toutes lettres (« Lundi 18:30 Yoga du soir »), tiré de `docs/kurse.md`.
   - `seite/verwaltung.html` devient « Mes réservations », par exemple `web/src/pages/verwaltung.astro`, avec `<meta name="robots" content="noindex">` et pas dans le menu.
   - Les couleurs tout en haut des deux fichiers, tu les mets sur les tokens du site (`var(--…)` de `tokens.css`), pas de valeurs de couleur copiées.
   - Le chemin de la page pour réserver, tu l'inscris dans `pb_hooks/buchungen.js` à `BUCHUNGSSEITE` (par exemple `"/kurse/"`), sinon les liens des e-mails ne mènent nulle part.
5. **Vérifier, avec preuve :** `bun bausteine/pocketbase/rezepte/buchungen/test.ts` doit annoncer « Alles grün ». Ensuite, construire dans `web/` (`npm run build`) et lancer `bun bausteine/pocketbase/lokal.ts` : tout le site tourne avec l'outil de réservation sur l'ordinateur de la personne, les e-mails apparaissent dans le terminal au lieu d'arriver chez de vraies personnes. Réserve toi-même une place, annule-la, connecte-toi sur « Mes réservations » avec le compte que `lokal.ts` affiche. Montre à la personne la photo de la confirmation et le texte de l'e-mail. Sans ces résultats, la vérification n'est pas verte.
6. **Les e-mails, avant que la personne partage le lien :** après la mise en ligne, régler les e-mails (point « E-mails » plus haut) et réserver en ligne une place à l'adresse de la personne. L'outil de réservation n'est terminé que quand cet e-mail est arrivé. Les avis de nouvelles réservations vont à l'adresse de l'expéditeur ; une autre, tu l'inscris dans `pb_hooks/buchungen.js` à `MELDUNGEN_AN`.
7. **Montrer à la personne comment elle s'en occupe elle-même :** ouvrir « Mes réservations » sur le natel (`https://{name}.aufwind.sh/verwaltung/`) et se connecter avec le compte de l'administration. Elle y voit les deux prochaines semaines, annule une réservation ou toute une date (toutes les personnes qui ont réservé reçoivent un e-mail avec la raison), inscrit des cours ou y met fin. Ajoute-lui la page aux favoris. Les dates uniques comme un atelier ne se font pas (encore) là, mais dans l'administration sous `termine` (les dates).

Modèle pour `3_kurse.js` (jours de la semaine de `mo` à `so`, heure en heure suisse, clôture des réservations en minutes avant le début) :

```js
/// <reference path="../pb_data/types.d.ts" />
// Les cours de docs/kurse.md. Plus tard, la personne les modifie elle-même sur « Mes réservations ».
migrate((app) => {
  const kurs = (titel, ort, preis, buchungsschluss_min, plaene) => {
    const a = new Record(app.findCollectionByNameOrId("angebote"));
    a.set("titel", titel); a.set("ort", ort); a.set("preis_hinweis", preis); a.set("buchungsschluss_min", buchungsschluss_min); a.set("aktiv", true);
    app.save(a);
    for (const [wochentag, zeit, dauer_min, plaetze] of plaene) {
      const w = new Record(app.findCollectionByNameOrId("wochenplan"));
      w.set("angebot", a.id); w.set("wochentag", wochentag); w.set("zeit", zeit); w.set("dauer_min", dauer_min); w.set("plaetze", plaetze); w.set("aktiv", true);
      app.save(w);
    }
  };
  kurs("Yoga du soir", "Seestrasse 1, Testwil", "CHF 25, en espèces ou TWINT sur place", 30, [["mo", "18:30", 75, 12], ["mi", "18:30", 75, 12]]);
});
```

Le programme de la semaine produit les dates huit semaines à l'avance, et de nouvelles s'ajoutent chaque nuit. Si la personne change l'heure ou les places, ça vaut pour toutes les dates sans réservation ; celles qui sont réservées restent comme elles sont.

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
