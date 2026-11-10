---
name: bausteine
description: "Découvre avec une personne sans connaissances préalables ce que sa page doit savoir faire, et installe les briques toutes faites qui conviennent, d'abord sur son ordinateur : liste d'inscription, réservations, espace membres avec connexion et activation, tableau d'affichage (PocketBase), une entrée avec une seule connexion pour plusieurs parties ou un grand CMS (Strapi avec Postgres), avec la mémoire vive mesurée. Explique avec l'image des éléments préfabriqués dans la construction d'une maison. Utilise ce skill pour « inscription », « liste d'inscription », « réservation », « réserver un cours », « prendre rendez-vous », « enregistrer un formulaire », « connexion », « espace membres », « espace admin », « gérer les utilisateurs », « rôles », « entrée », « base de données », « Strapi », « CMS », « PocketBase », « brique », « qu'est-ce qui tient sur mon serveur ? », et quand une page doit savoir faire plus que montrer des textes et des images."
metadata:
  stand: 0.3.0
  quelle: '5cece7070637'
---

# Briques : des éléments préfabriqués pour ta page

## L'image

Quand on construit une maison, on ne fabrique pas soi-même les fenêtres, les portes et la cuisine. Elles arrivent toutes faites de l'usine, avec leur mode d'emploi, et on les pose. Pour un site web, c'est pareil : la connexion, la liste d'inscription ou un système pour les contenus, personne ne les écrit de zéro. Albatros les tient prêts sous forme de briques toutes faites. Ce qui a un test est testé (réservations, membres, entrée) ; la mémoire vive, nous l'avons mesurée pour toutes.

Et comme pour la maison : chaque élément prend de la place. C'est pourquoi tu regardes d'abord ce dont la personne a vraiment besoin. On installe d'abord sur l'ordinateur de la personne, comme un montage d'essai à l'atelier ; sur le serveur, ça ne vient qu'au lancement.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque une information, donne quand même les étapes concrètes avec des hypothèses marquées `[Annahme: …]`. Les marques `[Annahme: …]` et `[offen: …]` restent en allemand, comme les noms des lignes dans `docs/` : c'est à elles que `lage` reconnaît ce qui est supposé ou encore ouvert. Demande ce qui manque seulement à la fin.
- Tutoiement, phrases courtes. Au lieu de « authentification », tu dis « se connecter avec e-mail et mot de passe », au lieu de « back-office », « administration ».
- Ne demande jamais de mots de passe ni de clés. Le premier compte de l'administration, la personne le crée elle-même dans le navigateur web. Les clés d'API (par exemple pour les e-mails), elle les tape seulement là.

## 1. Qu'est-ce que tu veux construire ?

Une question par message, et seulement autant qu'il en faut pour que la réponse soit claire :

1. Que doit faire la page ? En une phrase.
2. Dans quelles langues ?
3. Qui modifie les contenus : seulement toi avec ton IA, ou aussi d'autres personnes sans terminal ?
4. Les visiteurs doivent-ils remplir quelque chose, s'inscrire ou se connecter ? Veux-tu voir une liste des inscriptions ?
5. Y a-t-il quelque chose derrière, par exemple un paiement, des réservations ou une newsletter ?

## 2. Ce qui en découle

| La personne dit … | Ce qui convient | Abonnement | Mémoire vive en fonctionnement |
|---|---|---|---|
| Il n'y a que moi qui m'occupe de la page, pas de connexion, aussi en plusieurs langues | Une page normale tirée du modèle, sans brique. Un dossier par langue (`seite/fr/`). Les listes comme l'agenda ou les produits sous forme de fichier dans le projet (`seite/daten/termine.json`), que la page lit : une base de données légère dans le code. | Light | rien de plus |
| Paiement, dons | Lien de paiement d'un fournisseur comme Stripe (Payment Link), sous forme de bouton sur la page | Light | rien de plus |
| Newsletter | Un service comme Brevo, avec le formulaire du service sur la page | Light | rien de plus |
| Des gens s'inscrivent, je veux voir la liste | **Liste d'inscription** (PocketBase, recette `anmeldeliste`) | Pilot | environ 20 MB |
| Les visiteurs réservent une place ou un rendez-vous (cours, visite guidée, rendez-vous chez le coiffeur), je veux voir les réservations et pouvoir les annuler | **Réservations** (PocketBase, recette `buchungen`) | Pilot | environ 20 MB |
| Des membres se connectent et voient un espace à eux ; qui est nouveau fait une demande, et je l'active | **Espace membres avec connexion** (PocketBase, recette `mitglieder`) | Pilot | environ 20 MB |
| D'autres s'occupent des actualités ou de l'agenda dans le navigateur web | **Tableau d'affichage** (PocketBase, recette `pinnwand`) | Pilot | environ 20 MB |
| Plusieurs parties ont besoin de la même connexion, ou un espace n'est que pour un rôle (par exemple le comité) | **Entrée** (brique `eingang`, avec la recette `mitglieder`), section 7 | Pilot | 20 MB, sous pleine charge jusqu'à 129 MB (limite du conteneur 128 MB) |
| Beaucoup de types de contenu, plusieurs rôles, gestion des images, plus tard une app | **Grand CMS** (Strapi avec Postgres) | Pilot | environ 200 MB, construction jusqu'à 2,5 GB |

Recommande toujours le plus petit qui suffit. Plusieurs langues, à elles seules, ne sont jamais une raison pour une brique. PocketBase couvre à la fois la liste d'inscription, la connexion et le tableau d'affichage, et il ne tourne qu'une seule fois. Strapi ne vaut la peine que quand PocketBase devient trop petit.

Sur son propre ordinateur, chaque brique marche gratuitement, même sans abonnement. En ligne, il lui faut un serveur à soi, donc Pilot. Si la personne a Light, dis-le honnêtement dès qu'elle veut une brique : elle choisit le domicile de son site au lancement (skill `lancieren`, prix avec `konto_status`, skill `kosten`). Le journal de bord et l'adresse restent.

## 3. Qu'est-ce qui tient sur le serveur ?

Un serveur avec Pilot a 4 GB de mémoire vive et 40 GB d'espace disque, sans espace d'échange : si ça devient trop, le serveur arrête un programme. Mesuré le 28.10.2026 sur le serveur (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17), l'entrée le 31.10.2026 sur un Mac :

| Quoi | En fonctionnement | Pendant la construction | Espace disque |
|---|---|---|---|
| Charge de base : système, Docker, ouvrier du tapis roulant | 150 MB, prévu 0,5 GB | brièvement plus | – |
| Site web tiré du modèle | 10 MB | bref | petit |
| PocketBase (toutes les recettes ensemble) | 20 MB | bref | 40 MB |
| Entrée | 20 MB, sous pleine charge jusqu'à 129 MB, limitée à 128 MB dans le conteneur | bref | petit |
| Strapi avec Postgres | 150 MB + 55 MB | pic à 2,5 GB, première construction environ 7 minutes | 1,4 GB |

Il reste donc environ 3,5 GB pour les briques. Site web, PocketBase et Strapi ensemble ont besoin d'environ 250 MB en fonctionnement. Ça ne devient serré que pendant la construction, c'est pourquoi le tapis roulant construit une tâche après l'autre. Les programmes qui ont besoin à eux seuls de plus de 1 GB n'ont pas leur place sur le serveur, par exemple Keycloak, Supabase, Logto, Mattermost ou la reconnaissance de texte (OCR). Pour une connexion à toi, prends PocketBase.

Avant le lancement : `free -h` sur le serveur montre combien il reste de libre. Ensuite : `docker stats --no-stream` montre ce dont chaque brique a besoin.

## 4. Installer : d'abord en local, le serveur au lancement

### En local, sur l'ordinateur de la personne

Pendant la construction (skill `webseite-bauen`), gratuit :

1. **Aller chercher.** Dans le journal de bord sur l'ordinateur de la personne (skill `git-logbuch`), tu télécharges la brique depuis l'usine, le dépôt public d'Albatros :
   ```bash
   curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
   ```
   Pour l'entrée, il y a `bausteine/eingang` à la fin, pour Strapi `bausteine/strapi`. Les recettes se trouvent ensuite sous `bausteine/<baustein>/rezepte/`.
2. **Mettre en place la recette** (section 5, 6 ou 7), et traduire les textes des pages dans la langue de la personne.
3. **Test :** si la recette a un test, il doit annoncer « Alles grün » : `bun bausteine/pocketbase/rezepte/buchungen/test.ts`, `bun bausteine/pocketbase/rezepte/mitglieder/test.ts`, `bun bausteine/eingang/test.ts`. Une fois la recette installée, il vérifie les fichiers installés. Sans test vert, on ne va pas plus loin.
4. **La personne clique elle-même.** Construire dans `web/` (`npm run build`), puis `bun bausteine/pocketbase/lokal.ts` (avec l'entrée : `--eingang`). Tout le site tourne avec la brique sur l'ordinateur de la personne, les e-mails apparaissent dans le terminal au lieu d'arriver chez de vraies personnes. Donne-lui l'adresse et dis-lui ce qu'elle doit essayer (se connecter, réserver, annuler). Elle clique, tu regardes et tu répares. Pour l'administration, `lokal.ts` affiche un compte valable seulement sur cet ordinateur.
5. **Dans le journal de bord**, pas encore au port.

Strapi n'a pas encore de test ni de `lokal.ts` ; ses types de contenu, tu les écris sous forme de fichiers (section 6), et on ne le voit tourner que sur le serveur. Dis-le honnêtement.

### Au lancement, avec Pilot (Beim Lancieren, mit Pilot)

Dans le skill `lancieren`, partie 2, après la validation de la page et avant le push au port :

1. **Photo du serveur :** outil `snapshot` avec le nom `vor-baustein` (skill `zurueck-auf-gestern`).
2. **Brancher.** Tout en haut de `compose.yaml` :
   ```yaml
   include:
     - bausteine/pocketbase/compose.yaml
   ```
   Le site web transmet lui-même les demandes : le modèle lit chaque `bausteine/*/nginx.conf`. Si le projet est plus ancien que les briques (pas de `nginx.conf` dans le projet), va chercher `Dockerfile` et `nginx.conf` dans `vorlage/` du même dépôt.
   **Avec connexion, l'étape entrée :** si `docs/betrieb.md` dit `Eingang: ja` (section 7 ; `grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` montre la ligne, « Eingang: jamais » ne compte pas), `- bausteine/eingang/compose.yaml` s'ajoute sous `include:`, et pour le service `webseite`, `ports:` et `- "80:80"` disparaissent : le site web n'est alors plus accessible que derrière l'entrée. Sans connexion, ou si les règles de PocketBase suffisent, `compose.yaml` reste comme dans le modèle. Le skill `lancieren` nomme cette étape dès le domicile.
3. **Au port.** Le tapis roulant construit et livre (skill `pipeline`). Si la construction échoue, l'ancienne page reste en ligne.
4. **Vérifier** sur le serveur : `docker ps` affiche la brique comme `healthy`. Ensuite, tu vérifies chaque porte de l'extérieur : `node scripts/pruefen.mjs --tueren <adresse>` avec les portes ci-dessous, avec l'entrée aussi les chemins protégés 401, `/_/` 404, `/api/collections/_SUPERUSERS/auth-methods` 404 et la page d'accueil 200. Ensuite le premier compte de l'administration et les e-mails (section 5).

### Portes des briques (Türen der Bausteine)

Ce qu'une brique répond sans connexion va dans `docs/tueren.txt` (skill `webseite-bauen`), seulement les lignes des recettes installées. `node scripts/pruefen.mjs --tueren` les vérifie en local contre `http://localhost:8090` (avec l'entrée `http://localhost:8080`), tant que `lokal.ts` tourne, et après le lancement contre l'adresse. Les listes de PocketBase avec une règle (par exemple « seulement son propre compte ») donnent aux visiteurs 200 avec une liste vide, pas 401 ni 403 ; seules les listes réservées à l'administration donnent 403. C'est juste ainsi ; les règles restent comme elles sont.

```
/api/collections/anmeldungen/records      403   # anmeldeliste : tout le monde peut s'inscrire, seule l'administration peut lire
/api/collections/termine_frei/records     200   # buchungen : les dates libres, tout le monde les voit
/api/collections/buchungen/records        403   # buchungen : les réservations, seule l'administration les voit
/api/collections/wochenplan/records       403   # buchungen
/api/collections/users/records            200   # mitglieder : les visiteurs reçoivent une liste vide
/api/collections/mitteilungen/records     200   # mitglieder : les visiteurs reçoivent une liste vide
/api/collections/beitraege/records        200   # pinnwand : pour tout le monde
/intern/                                  401   # avec l'entrée : chaque chemin protégé de eingang.json
/_/                                       404   # avec l'entrée
/api/collections/_SUPERUSERS/auth-methods 404   # avec l'entrée
```

Mesuré le 31.10.2026 avec PocketBase 0.40.5 et `pruefen.mjs --tueren`, directement auprès de PocketBase et à travers l'entrée. Sans l'entrée, `/_/` n'est fermé que sur le serveur (404) ; en local, `lokal.ts` y montre l'administration, alors cette porte ne se vérifie qu'après le lancement. Avec `buchungen`, « Mes réservations » (`/verwaltung/`) répond 200 : la page est ouverte, mais seule la personne qui se connecte avec le compte de l'administration y voit les réservations. Une ligne `/verwaltung 404` ne convient alors pas.

## 5. PocketBase : liste d'inscription, réservations, membres, tableau d'affichage

PocketBase est un seul petit programme avec base de données, connexion et administration. Le site web lui parle sous `/api/` de sa propre adresse. L'administration reste fermée au public.

- **Inscrire l'adresse :** dans `bausteine/pocketbase/pb_migrations/1_einstellungen.js`, mettre la ligne `ADRESSE` sur l'adresse de la page (`https://{name}.aufwind.sh` ou le propre domaine). Elle apparaît dans les e-mails comme « Mot de passe oublié ».
- **Mettre en place la recette :** depuis `bausteine/pocketbase/rezepte/<rezept>/`, tous les fichiers de `pb_migrations/` vont dans `bausteine/pocketbase/pb_migrations/`, `pb_hooks/*` (s'il y en a) dans `bausteine/pocketbase/pb_hooks/` et `seite/*.html` dans `seite/`. Le dossier de la recette, tu le laisses en place, c'est là que se trouve le test.
  - `anmeldeliste` : formulaire `anmelden.html`. Tout le monde peut s'inscrire, seule l'administration peut lire.
  - `buchungen` : `buchen.html` (dates libres, réserver, annuler par le lien de l'e-mail) et `verwaltung.html` (« Mes réservations » pour la personne : qui vient, annuler, programme de la semaine). Plus de détails plus bas, sous « Réservations ».
  - `mitglieder` : qui crée un compte fait une demande. La personne confirme son adresse e-mail avec le lien de l'e-mail, l'administration reçoit un avis et l'active (dans l'administration, sous `users`, le champ `freigegeben`), puis la personne reçoit un e-mail. Ce n'est qu'avec l'adresse confirmée et l'accès activé qu'elle voit les messages. L'activation et le rôle (`rolle`, par exemple `vorstand`) ne sont fixés que par l'administration, jamais par la personne elle-même. Pages : `mitglieder.html` (demande, se connecter, état de la demande, renvoyer l'e-mail, « Mot de passe oublié ? »), `bestaetigen.html` et `passwort.html` ; c'est vers ces deux pages que mènent les liens des e-mails. Si les pages sont ailleurs (par exemple `/passwort/` dans un site Astro), tu inscris le chemin dans `pb_migrations/2_mitteilungen_freigabe.js` (`SEITE_BESTAETIGEN`, `SEITE_PASSWORT`), et l'espace membres ainsi que le destinataire des avis dans `pb_hooks/mitglieder.js` (`MITGLIEDERSEITE`, `MELDUNGEN_AN`). Des rôles en plus, tu les ajoutes dans `ROLLEN` avant que la page tourne. Si l'ancienne recette était déjà installée, les nouveaux fichiers s'ajoutent simplement ; qui était déjà membre doit ensuite être activé une fois et confirmer son adresse (« Renvoyer l'e-mail » sur `mitglieder.html`).
  - `pinnwand` : `pinnwand.html` affiche des articles avec date et image. On les écrit dans l'administration.
  - Des champs ou des collections en plus, tu les écris dans un autre fichier `pb_migrations/3_*.js`, sur le même modèle.
- **Premier compte de l'administration** (au lancement) : après le premier démarrage, PocketBase écrit un lien d'installation dans ses messages. Va le chercher et ouvre le passage secret (tunnel), ainsi l'administration reste invisible depuis Internet :
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && docker compose logs pocketbase' | grep pbinstall
  ssh -N -L 8090:localhost:8090 {name}@aufwind.sh
  ```
  Tu laisses tourner la deuxième commande en arrière-plan. Donne le lien à la personne avec `http://localhost:8090` au lieu de `http://0.0.0.0:8090`. Elle y choisit son e-mail et son mot de passe, seulement dans le navigateur web. Si le lien a expiré : `docker compose restart pocketbase` sur le serveur, et il y en a un nouveau. Plus tard, ça passe par `http://localhost:8090/_/`, tant que le tunnel est ouvert.
- **Ouvrir l'administration :** si d'autres ont besoin de l'administration sans terminal, ou si la personne veut voir la liste sur son natel : dans `bausteine/pocketbase/nginx.conf`, enlever les `#` devant le bloc « Verwaltung freigeben » (ouvrir l'administration), puis dans le journal de bord et au port. Elle se trouve alors sous `https://{name}.aufwind.sh/_/`, protégée par le mot de passe de l'administration. N'ouvrir que quand le premier compte existe. Dès que les e-mails partent, la personne active dans l'administration, sous `_superusers` → Options, la connexion à deux facteurs (MFA). Avec l'entrée (section 7), l'administration reste toujours fermée depuis l'extérieur.
- **E-mails** (confirmer l'adresse, mot de passe oublié) : le serveur n'a pas le droit d'envoyer par les ports habituels des e-mails. Dans l'administration, sous Settings → Mail settings : serveur SMTP `smtp.resend.com`, port `2587`, utilisateur `resend`, et comme mot de passe la clé d'API de Resend. La personne la tape elle-même à cet endroit. Brevo marche aussi, avec `smtp-relay.brevo.com` et le port `2525`. L'expéditeur est une adresse du propre domaine, confirmée auprès du service d'e-mails.
- **Se connecter avec Google, Apple ou GitHub :** ça se règle dans l'administration sous `users` → Options → OAuth2. Il faut un compte chez le fournisseur concerné. Ne le fais que quand l'e-mail et le mot de passe fonctionnent.

### Réservations

La recette `buchungen` est un petit outil de réservation pour des cours, des visites guidées et des rendez-vous, sans compte client et sans paiement en ligne. Elle est testée : deux personnes n'obtiennent jamais la même dernière place, les dates passées ne peuvent pas être réservées, un cours reste à 18:30 même après le changement d'heure, les e-mails donnent l'heure suisse.

**Tu le dis ainsi à la personne :** « Les visiteurs choisissent une date sur ton site et reçoivent une confirmation par e-mail. Tu inscris tes cours une seule fois comme programme de la semaine, par exemple chaque lundi à 18:30 avec 12 places, et tu vois sur la page “Mes réservations” qui vient. »

La technique, c'est toi qui t'en occupes, la personne ne fait que décider. Dans cet ordre :

1. **Demander les cours avant de construire :** nom, jour de la semaine, heure, durée, places, lieu, prix et jusqu'à combien de temps avant le début on peut réserver. Si le plan dit seulement « on l'a », demande-les maintenant. Écris-les dans `docs/kurse.md` et comme `bausteine/pocketbase/pb_migrations/3_kurse.js` (modèle plus bas) : ainsi les dates sont là dès le premier démarrage, personne ne les recopie.
2. **Installer :** `2_buchungen.js` dans `bausteine/pocketbase/pb_migrations/`, les deux fichiers de `pb_hooks/` dans `bausteine/pocketbase/pb_hooks/`. Le dossier `rezepte/buchungen`, tu le laisses en place, c'est là que se trouve le test.
3. **En faire deux vraies pages,** avec en-tête, menu et pied de page comme toutes les autres, jamais les fichiers HTML nus :
   - `seite/buchen.html` devient la page pour réserver, par exemple `web/src/pages/kurse.astro` dans la mise en page du site : reprendre le contenu de `<main>`, le script comme `<script is:inline>`, et des styles seulement les parties sans `body`, `main` et `h1`. En haut, le programme de la semaine en toutes lettres (« Lundi 18:30 Yoga du soir »), tiré de `docs/kurse.md`.
   - `seite/verwaltung.html` devient « Mes réservations », par exemple `web/src/pages/verwaltung.astro`, avec `<meta name="robots" content="noindex">` et pas dans le menu.
   - Les couleurs tout en haut des deux fichiers, tu les mets sur les tokens du site (`var(--…)` de `tokens.css`), pas de valeurs de couleur copiées.
   - Le chemin de la page pour réserver, tu l'inscris dans `pb_hooks/buchungen.js` à `BUCHUNGSSEITE` (par exemple `"/kurse/"`), sinon les liens des e-mails ne mènent nulle part.
4. **Vérifier, avec preuve :** `bun bausteine/pocketbase/rezepte/buchungen/test.ts` doit annoncer « Alles grün ». Ensuite, construire dans `web/` (`npm run build`) et lancer `bun bausteine/pocketbase/lokal.ts` : tout le site tourne avec l'outil de réservation sur l'ordinateur de la personne, les e-mails apparaissent dans le terminal au lieu d'arriver chez de vraies personnes. La personne réserve elle-même une place, l'annule et se connecte sur « Mes réservations » avec le compte que `lokal.ts` affiche. Montre-lui le texte de l'e-mail. Sans ces résultats, la vérification n'est pas verte.
5. **Au lancement :** photo du serveur (outil `snapshot`, nom `vor-baustein`), brancher, au port (section 4).
6. **Les e-mails, avant que la personne partage le lien :** après la mise en ligne, régler les e-mails (point « E-mails » plus haut) et réserver en ligne une place à l'adresse de la personne. L'outil de réservation n'est terminé que quand cet e-mail est arrivé. Les avis de nouvelles réservations vont à l'adresse de l'expéditeur ; une autre, tu l'inscris dans `pb_hooks/buchungen.js` à `MELDUNGEN_AN`.
7. **Montrer à la personne comment elle s'en occupe elle-même :** ouvrir « Mes réservations » sur le natel (`https://{name}.aufwind.sh/verwaltung/`) et se connecter avec le compte de l'administration. Elle y voit les deux prochaines semaines, annule une réservation ou toute une date (toutes les personnes qui ont réservé reçoivent un e-mail avec la raison), inscrit des cours ou y met fin. Ajoute-lui la page aux favoris. Les dates uniques comme un atelier ne se font pas (encore) là, mais dans l'administration sous `termine` (les dates). S'il y a une entrée devant (section 7), « Mes réservations » ne marche que par le tunnel.

Modèle pour `3_kurse.js` (jours de la semaine de `mo` à `so`, heure en heure suisse, clôture des réservations en minutes avant le début) :

```js
/// <reference path="../pb_data/types.d.ts" />
// Les cours de docs/kurse.md. Plus tard, la personne les modifie elle-même sur « Mes réservations ».
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

Le programme de la semaine produit les dates huit semaines à l'avance, et de nouvelles s'ajoutent chaque nuit. Si la personne change l'heure ou les places, ça vaut pour toutes les dates sans réservation ; celles qui sont réservées restent comme elles sont.

- **Si vous l'étendez, ces règles restent :** les places libres, c'est toujours les places moins les réservations actives, jamais un compteur. La vérification se fait sur le serveur (`pb_hooks/`), jamais seulement dans le navigateur web. Enregistrer les heures comme un instant précis, les afficher avec `Europe/Zurich`. Donner les délais avec la date et l'heure, jamais « 24 h avant ». Après la réservation, une page de confirmation et un e-mail. Ne demander que le nécessaire : pas d'adresse, pas de date de naissance, pas d'informations sur la santé. Un délai d'effacement (proposition : 12 mois après la date) va dans la déclaration de protection des données (skill `recht-ch`).
- **Volontairement pas inclus,** seulement quand ça manque : le paiement en ligne (s'il y a beaucoup de personnes qui ne viennent pas sans prévenir, ou pour un acompte : un lien de paiement avec le numéro de réservation), des comptes clients pour des abonnements ou des cartes de 10 entrées (recette `mitglieder`), une liste d'attente, un rappel la veille.
- **Avec Light,** pas de vraie réservation : sans programme sur le serveur, personne ne compte les places. Le dire honnêtement et laisser le choix : une demande par e-mail ou par un service de formulaires (« Tu reçois une confirmation d'ici demain »), un lien vers l'outil de réservation d'un autre fournisseur (payant, données souvent à l'étranger), ou Pilot avec cette recette.

## 6. Strapi : le grand CMS

Strapi est un système complet pour les contenus, avec des rôles et une gestion des images, accompagné de sa propre base de données (Postgres). Pour en savoir plus, et pour savoir si ça vaut la peine : skill `cms`. Strapi ne tourne que sur le serveur, donc au lancement.

1. **D'abord les secrets,** avant que `include` soit au port, sinon la première construction échoue. Depuis le journal de bord, sans que tu les voies :
   ```bash
   ssh {name}@aufwind.sh 'mkdir -p ~/projekt/bausteine/strapi && sh -s ~/projekt/bausteine/strapi' < bausteine/strapi/geheimnisse.sh
   ```
2. **Les types de contenu sous forme de fichiers :** sur le serveur, Strapi tourne en mode production, on ne peut pas y créer de types de contenu en cliquant. Tu les écris sous `bausteine/strapi/cms/src/api/`. La recette `veranstaltungen` montre le modèle : `schema.json` plus contrôleur, route et service.
3. **Lecture pour tout le monde :** dans `bausteine/strapi/cms/src/index.ts`, inscrire le type dans `OEFFENTLICH`, par exemple `'api::veranstaltung.veranstaltung'`. La page lit alors `/cms/api/veranstaltungen` de sa propre adresse, les images arrivent par `/cms/uploads/`. On n'écrit que dans l'administration.
4. **Ajouter `include`, puis dans le journal de bord et au port.** La première construction dure environ 7 minutes. Dis-le avant, pour que personne ne pense que c'est bloqué.
5. **Premier compte de l'administration :** tunnel `ssh -N -L 1337:localhost:1337 {name}@aufwind.sh`, puis `http://localhost:1337/admin`. La personne y crée elle-même le compte.
6. **Ouvrir l'administration** (pour une rédaction sans terminal) : seulement quand le premier compte existe, sinon une personne inconnue pourrait s'inscrire avant. Dans `bausteine/strapi/nginx.conf`, remplacer le premier bloc par le bloc « Verwaltung freigeben » (ouvrir l'administration), sans les `#` ; dans `bausteine/strapi/cms/config/server.ts`, activer la ligne `url: '/cms'` ; puis dans le journal de bord et au port. L'administration se trouve alors sous `https://{name}.aufwind.sh/cms/admin`. La personne y invite la rédaction (Settings → Users, rôle Editor ou Author). Chaque personne choisit elle-même son mot de passe.
7. **Les entrées apparaissent** dès qu'elles sont publiées dans l'administration. Pas besoin d'une nouvelle construction pour ça.

## 7. Une entrée pour tout ? (Ein Eingang für alles?)

**L'image :** l'accueil d'un immeuble avec plusieurs bureaux. Qui veut entrer s'annonce une fois ; chaque bureau apprend seulement qui vient et avec quel rôle. L'entrée est un petit service devant la page. Est connecté qui PocketBase connaît (recette `mitglieder`), il n'y a pas de deuxième connexion.

Ces règles décident s'il en faut une, dans cet ordre :

1. **Jamais avec Light,** et jamais sans serveur à soi : l'entrée est un programme qui tourne sur le serveur.
2. **Pas nécessaire avec une brique pour laquelle les règles de PocketBase suffisent :** par exemple seulement la recette `mitglieder` (messages seulement pour les personnes activées) ou seulement `buchungen`. Alors sans entrée.
3. **Nécessaire quand deux parties ou plus doivent savoir qui est connecté** (par exemple des pages protégées sous `/intern/` et les messages de PocketBase, ou un petit programme à toi à côté), **ou quand des rôles valent pour plusieurs parties** (le comité voit `/vorstand/` et a plus de droits dans PocketBase).

La réponse va dans `docs/betrieb.md`, à la ligne `Eingang:` (skill `betrieb`). Sa valeur commence toujours par le mot allemand `ja` ou `nicht nötig`, même si la personne parle une autre langue ; ensuite vient la raison dans sa langue, par exemple `Eingang: ja – /intern/ et les messages de PocketBase demandent la même connexion` ou `Eingang: nicht nötig – seulement la recette mitglieder, les règles de PocketBase suffisent`. Le skill `lancieren` n'installe l'entrée qu'avec `Eingang: ja`. Les portes du site (`docs/tueren.txt` : ouvertes, seulement avec connexion, jamais) deviennent les parties dans `bausteine/eingang/eingang.json`.

**Coûts :** pas d'argent en plus, elle tourne avec le reste sur le serveur Pilot. Mémoire : 20 MB au repos ; sous pleine charge avec de petites pages jusqu'à 69 MB, avec beaucoup d'images à la fois (20 pages de 60 images) jusqu'à 129 MB, et si des visiteuses téléchargent de gros fichiers sans les lire jusqu'au bout : depuis le site (nginx) et depuis PocketBase, l'entrée va chercher les gros fichiers par morceaux, mesuré avec trois adresses jusqu'à 42 MB, avec quatorze jusqu'à 73 MB ; depuis une partie à toi qui ne connaît pas les plages, davantage (mesuré 201 MB). Mesuré du 31.10 au 02.11.2026 sur un Mac. Le conteneur est limité à 128 MB (`mem_limit`) ; s'il redémarre alors et combien il lui faut sur le serveur, ce n'est pas encore mesuré ; chaque appel d'une partie protégée interroge PocketBase, ça coûte presque une milliseconde. Et un élément de plus à entretenir (version de Bun dans le `Dockerfile`).

**Installer,** d'abord en local comme chaque brique (section 4), pas à pas dans `bausteine/eingang/README.md` :

1. PocketBase avec la recette `mitglieder` est installé. Aller chercher `bausteine/eingang`, `pb_hooks/*` dans `bausteine/pocketbase/pb_hooks/`, `pb_migrations/*` dans `bausteine/pocketbase/pb_migrations/`.
2. Dans `eingang.json`, inscrire l'adresse de la page (`ursprung`) et les parties : nom, cible, chemins, accès `offen` (ouvert), `angemeldet` (connecté) ou `rolle:<name>`. Les pages protégées sont dans leurs propres dossiers (`seite/intern/`). Si un propre domaine s'ajoute plus tard, il n'y a rien à changer ici : l'entrée accepte les formulaires et les connexions de l'adresse par laquelle on ouvre la page.
3. Dans `mitglieder.html`, mettre `const EINGANG = true;` : la connexion vaut alors avec un cookie pour toutes les parties.
4. `bun bausteine/eingang/test.ts` annonce « Alles grün », puis `bun bausteine/pocketbase/lokal.ts --eingang` : la personne ouvre une page protégée sans être connectée, se connecte, revient et se déconnecte.
5. Au lancement (skill `lancieren`, partie 2) : dans `compose.yaml`, sous `include:`, la ligne `- bausteine/eingang/compose.yaml`, et pour le service `webseite`, effacer les lignes `ports:` et `- "80:80"`, sinon on pourrait contourner l'entrée. Le site web n'est alors plus accessible que derrière l'entrée. Ensuite, vérifier chaque porte depuis l'extérieur : `node scripts/pruefen.mjs --tueren https://{name}.aufwind.sh` avec les « portes des briques » (section 4) : `/intern/` donne 401, `/_/` et `/api/collections/_SUPERUSERS/auth-methods` donnent 404, la page d'accueil 200.

**Ce qu'elle ne sait pas faire :** derrière l'entrée, « Mes réservations » (recette `buchungen`) ne marche que par le tunnel, parce qu'elle ferme l'administration depuis l'extérieur, quelle que soit l'écriture. Elle ferme aussi le temps réel de PocketBase (`/api/realtime`), aucune recette n'en a besoin. Se déconnecter vaut pour tous les appareils : qui se déconnecte sur son téléphone l'est aussi sur son ordinateur.

## Pièges

- **Administration ouverte avant que le premier compte existe :** d'abord créer le compte par le tunnel, ensuite ouvrir. N'ouvrir que si d'autres en ont besoin sans terminal.
- **Une brique de trop :** chaque élément doit être entretenu et mis à jour. Mieux vaut une seule qui tourne bien. Une entrée sans deuxième partie, c'est une de trop.
- **Directement sur le serveur :** une brique qui n'était pas verte en local et sur laquelle la personne n'a pas cliqué elle-même ne va pas sur le serveur.
- **Mises à jour :** les versions figurent dans le `Dockerfile` (PocketBase, entrée) et dans `package.json` (Strapi). Avant chaque mise à jour, prendre une photo.
- **Données :** elles se trouvent dans des volumes sur le serveur et font partie des photos quotidiennes. `docker compose down -v` les efface : jamais sans photo et sans le oui de la personne.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « les éléments préfabriqués dans la construction d'une maison », qui redit l'essentiel. Ensuite : ce qui est installé, où ça tourne et combien de mémoire vive ça demande, ce qui reste ouvert et ce qui vient ensuite.
