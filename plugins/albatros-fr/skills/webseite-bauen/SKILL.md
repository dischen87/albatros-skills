---
name: webseite-bauen
description: "Construit avec une personne sans connaissances préalables son site web sur son ordinateur, exactement selon l'ébauche autorisée (P9 et P10) : pruefen.mjs --vor-bau vérifie l'autorisation de construire, puis journal de bord (git init, une entrée par étape), mode de construction, PRD tiré de l'ébauche avec accès et portes (docs/tueren.txt), construction avec Astro à partir du balisage et des classes de l'ébauche et de design/tokens.css, quatre vérifications avec pruefen.mjs et les portes, visite sur le natel et sur l'ordinateur, comparaison avec l'ébauche (--vergleich) et validation. Rien ne va en ligne, c'est lancieren qui s'en charge. Annonce prd, lokal, pruefung, freigabe. Utilise ce skill après entwurf (autorisation de construire) et pour « construis-moi le site », « stack technique », « PRD », « regarder en local », « vérifier avant de publier », « validation », « comment ça continue après l'ébauche ? »."
metadata:
  stand: 0.2.0
  quelle: 'd4e0b583501a'
---

# Construire le site web : le gros œuvre dans ton propre atelier

## L'image

L'ébauche est le modèle qu'on peut visiter, et la personne l'a autorisé. Maintenant, dans son propre atelier, sur son ordinateur, le gros œuvre en naît : avec les mêmes pièces, portes et fenêtres que dans le modèle. Des spécialistes en font la réception, puis la personne le parcourt elle-même, sur le natel et sur l'ordinateur (la visite), et le valide. Un journal de bord garde chaque étape de travail. Rien ne va encore en ligne : l'endroit où la maison se trouve, elle le décide ensuite, au lancement.

**Comment utiliser l'image :** une phrase sur l'image dans ta première réponse. À chaque nouvelle étape, une phrase avec son image (dans le tableau plus bas), ce qui y naît et à quoi ça sert.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Les débuts de ligne dans les fichiers de `docs/` (`Freigegeben zum Bauen:`, `Abgeleitet aus:`, `Lokal gesehen:`, `Vergleich mit Entwurf:`, `Freigegeben:`) restent en allemand, comme les marques `[Annahme: …]` et `[offen: …]` : `lage` et les vérifications les cherchent tels quels. Ce qui suit les deux-points, tu l'écris en français.
- L'ordre est fixe. On ne construit que quand `pruefen.mjs --vor-bau` trouve l'autorisation de construire, et seulement ce qui figure dans l'ébauche. Si quelque chose doit être différent de l'ébauche, tu le dis à la personne avant de le construire.
- Dans ce skill, rien ne va en ligne ni dans un port. Tout reste sur l'ordinateur de la personne et ne coûte rien chez Albatros.
- Tu proposes la prochaine étape et tu la fais. La personne n'a jamais besoin de savoir ce qui vient ensuite.
- Le mode figure dans `docs/projekt.md` (ligne `Modus:`) : avec `machen` (faire), tu travailles et tu expliques chaque étape en une phrase avec une image, tu proposes les moments d'apprentissage. Avec `lernen` (apprendre), tu expliques chaque étape avec une image et le pourquoi, et la personne fait elle-même les moments d'apprentissage.
- Au maximum deux questions par message. Ce que tu peux proposer toi-même (mode de construction, portes), tu l'inscris comme `[Annahme: …]` (hypothèse) et tu fais confirmer toutes les hypothèses dans un seul message.
- Tutoiement, langage de tous les jours. Les mots techniques (PRD, tokens, Lighthouse), tu les expliques la première fois avec leur image.
- Ce que la personne doit voir (île, aperçu, photos, rapports, ébauche et construction côte à côte), tu l'ouvres toi-même : `open <adresse ou fichier>` (Linux `xdg-open`, Windows `start`). Donner seulement l'adresse ne suffit pas.

## Les étapes en un coup d'œil

| Étape | Image | Résultat | Île |
|---|---|---|---|
| 0. Avant la construction | le coup d'œil sur la signature sous le modèle | `pruefen.mjs --vor-bau` se termine par 0 | |
| 1. Atelier et journal de bord | installer l'établi, ouvrir le journal de bord | journal de bord avec la première entrée | |
| 2. Mode de construction | comment on construit : bois ou pierre | `docs/stack.md` | |
| 3. PRD avec accès et portes | le plan de construction, tiré du modèle | `docs/prd.md` avec `Abgeleitet aus:`, `docs/tueren.txt` | `prd` |
| 4. Construire | le gros œuvre | `web/`, `seite/` | `lokal` |
| 5. Vérifier | la réception par des spécialistes | `docs/pruefung/` avec quatre rapports, portes vérifiées | `pruefung` |
| 6. Validation | la visite du gros œuvre terminé | `Lokal gesehen:`, `Vergleich mit Entwurf:` et `Freigegeben:` dans `docs/prd.md` | `freigabe` |

Les étapes 0 à 5 forment la phase P9, l'étape 6 la P10. Ce qui figure dans la colonne « Résultat » doit être là à la fin de l'étape. Chaque étape se termine par une entrée dans le journal de bord.

## L'île

Si l'île n'est pas encore ouverte, tu l'ouvres dès le début dans le navigateur web. Sous `https://albatros.build/fr/cockpit/insel`, il y a pour chaque projet une maison qui grandit à chaque étape. Pour le français, l'italien et l'anglais, le préfixe de la langue vient devant (`/fr`, `/it`, `/en`) ; sans préfixe, c'est la version allemande :

```bash
open https://albatros.build/fr/cockpit/insel     # macOS; Linux: xdg-open, Windows: start
```

L'île se recharge toute seule, l'ouvrir une fois suffit.

Après chaque étape réussie qui a une entrée dans la colonne « Île », tu appelles l'outil `schritt_melden` d'Albatros, avec `schritt` (`prd`, `lokal`, `pruefung`, `freigabe`) et `sprache` (la langue de la conversation, ici `fr`). `projekt`, tu le laisses de côté dans le cas normal : c'est alors le projet qui sera plus tard au port qui compte, même s'il n'est aujourd'hui que sur l'ordinateur. Seulement pour un autre projet, tu donnes un nom court fait de minuscules, de chiffres et de « - », toujours le même. La réponse indique l'étape et l'adresse de l'île. Dis à la personne en une phrase que sa maison a grandi.

- L'île ne fait qu'avancer. Si tu annonces une étape qui est déjà là, rien ne change. La réponse le dit, tu ne réessaies pas.
- S'il répond « Ungültige Angaben » (indications invalides), l'étape ou le nom était mal écrit : corrige et rappelle-le une fois.
- Si l'outil manque, si la personne n'est pas connectée ou s'il répond « unbekannt » (inconnu), on continue sans île.

## Les étapes

### 0. Avant la construction : l'ébauche est-elle autorisée ?

Le script de vérification `pruefen.mjs` se trouve dans ce skill. Copie-le dans le projet, puis il vérifie si on a le droit de construire :

```bash
mkdir -p scripts && cp <dossier de ce skill>/pruefen.mjs scripts/
# dossier inconnu : curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
node scripts/pruefen.mjs --vor-bau
```

- **Se termine par 0 :** il y a la ligne `Freigegeben zum Bauen: <JJ.MM.AAAA>, …` dans `docs/entwurf.md`, l'ébauche dans `design/entwurf/` et les tokens dans `design/tokens.css`. On continue avec l'étape 1.
- **Se termine par 2 :** la sortie (en allemand) dit ce qui manque. Dis-le à la personne en une phrase et retourne là-bas : sans autorisation de construire, au skill `entwurf` (partie « Freigabe », la validation) ; sans ébauche, au skill `entwurf` ; sans tokens, au skill `gestaltung`. La ligne `Freigegeben zum Bauen:`, tu ne l'écris jamais toi-même, même pas « vite fait » : elle n'existe qu'après le oui de la personne à l'ébauche.

### 1. Atelier et journal de bord

**L'atelier, encore une fois :** Node, npm et Git doivent être là, même s'ils l'étaient déjà pour l'ébauche :

```bash
command -v node npm git        # Windows dans PowerShell : where.exe node npm git
```

S'il manque quelque chose, tu aides à l'installer comme dans le skill `entwurf` (l'atelier) et tu vérifies à nouveau.

**Avec une brique** (`Setup:` dans `docs/plan.md` en nomme une, ou `Baustein:` dans `docs/stack.md`), il faut aussi Bun : c'est avec lui que la brique et ses tests tournent sur cet ordinateur (étape 4). Vérifie-le avec `command -v bun` (Windows dans PowerShell `where.exe bun`). S'il manque, la personne l'installe elle-même : sur Mac et Linux dans le terminal `curl -fsSL https://bun.com/install | bash`, sous Windows dans PowerShell `powershell -c "irm bun.sh/install.ps1|iex"`. Ensuite, ouvrir un nouveau terminal et contrôler avec `bun --version`.

**Le journal de bord sur l'ordinateur :** chaque étape reçoit une entrée (commit), avec une note en une phrase. Ainsi, la personne peut feuilleter en arrière à tout moment. Pas besoin de port pour ça : le journal de bord est dans le dossier du projet, il ne sera relié qu'à la mise en ligne (skill `git-logbuch`, partie « Logbuch ohne Hafen », le journal de bord sans port).

- Si le dossier du projet n'a pas encore de journal de bord (pas de dossier `.git`), tu le crées : `git init -b main`.
- Il manque le nom et l'adresse pour le journal de bord (`git config user.name` reste vide) ? Alors tu demandes à la personne et tu règles les deux comme dans le skill `git-logbuch`, étape 1.
- `.gitignore` dans le dossier du projet, au minimum :
  ```
  node_modules/
  .env
  .env.*
  !.env.example
  .DS_Store
  docs/pruefung/fotos/
  docs/pruefung/vorher/
  ```
- La première entrée retient ce qui est né jusqu'ici. D'abord montrer ce qui y entre, puis l'inscrire :
  ```bash
  git status
  git add .gitignore AGENTS.md docs design scripts       # seulement ce qui existe
  git diff --cached --stat
  git commit -m "Ébauche autorisée : plan, concept, ébauche"
  ```
- Règles comme dans le skill `git-logbuch` : seulement `main`, seulement ses propres fichiers et dossiers, nommés (jamais `git add .` ni `git add -A`), jamais `--force`.

**Moment d'apprentissage « ce qu'est une entrée dans le journal de bord » :** une phrase avec l'image du journal de bord. En mode `lernen`, la personne tape elle-même la commande `git commit` pour la première entrée, ensuite tu annonces `verstanden_melden` (mission `flugschule-20-logbuch-eintrag`, type `selbst`). En mode `machen`, tu le proposes.

### 2. Mode de construction (`docs/stack.md`)

Le mode de construction découle de `docs/plan.md`, ligne `Setup:`. Tu le proposes et tu l'écris comme hypothèse dans `docs/stack.md` :

```markdown
# Stack technique

**Décision :** [Annahme: Astro, statique]
**Pourquoi :** … (une ou deux phrases, tirées de docs/plan.md)
**JavaScript :** seulement là où c'est nécessaire, au maximum 50 Ko par page
**Brique :** aucune (ou : laquelle, skill bausteine ; elle aura besoin plus tard d'un propre serveur)
**Livré :** le dossier seite/ ; où il habite, la personne le décide au lancement
**Pas choisi :** … (par exemple une application React ou WordPress), parce que …
```

Par défaut, c'est Astro : il construit des pages HTML simples et rapides, sans JavaScript. Un autre framework seulement si la personne le veut expressément ou si une fonction du plan en a besoin. Alors, sous « Pourquoi », figurent la fonction et la raison pour laquelle Astro ne suffit pas. « Moderne » ou « connu » n'est pas une raison. Une liste d'inscription, une connexion ou une fenêtre d'édition ne sont pas une raison pour un autre framework, mais pour une brique (skill `bausteine`).

La personne confirme le mode de construction avec les portes (étape 3), dans un seul message.

### 3. PRD avec accès et portes (`schritt: prd`)

Le PRD est le plan de construction sur une page. Il est tiré de l'ébauche autorisée : la personne a déjà signé avec l'ébauche, c'est pourquoi il n'y a pas de réception à part pour le PRD. Pour l'écrire, lis `docs/projekt.md`, `docs/plan.md`, `docs/konzept.md`, `docs/designsystem.md`, `docs/entwurf.md` et chaque page de `design/entwurf/`. Écris `docs/prd.md` :

```markdown
# PRD : <nom du projet>

Abgeleitet aus: docs/entwurf.md (Freigegeben zum Bauen: <date tirée de docs/entwurf.md>)

**Pour qui et pourquoi :** … (tiré de docs/projekt.md)
**Pages :** comme dans l'ébauche : accueil, …, plus mentions légales et protection des données
**Fonctions :** chacune avec son déroulement, la confirmation, l'erreur et l'état vide, comme montrés dans l'ébauche (pour un site existant, chaque fonction de docs/bestand.md avec sa décision)
**Design :** design/tokens.css et docs/designsystem.md ; balisage et classes tirés de design/entwurf/
**Stack technique :** voir docs/stack.md
**Pas inclus :** … (tiré de docs/plan.md : ce qui est laissé de côté pour le premier vol)

## Accès (qui a le droit de faire quoi)

| Qui | voit | modifie |
|---|---|---|
| tous les visiteurs | accueil, …, mentions légales, protection des données | rien |
| <rôle tiré de docs/plan.md, ligne Zugang:> | … | … |

Les portes figurent dans docs/tueren.txt et sont vérifiées avec pruefen.mjs --tueren.

## Critères d'acceptation

Tirés de docs/plan.md (Testing:) et de l'ébauche ; validés avec l'ébauche.

### Accueil
- [ ] Titres, menu et sections comme dans design/entwurf/index.html (pruefen.mjs --vergleich)
- [ ] Dans les trois premières phrases figurent qui vous êtes, à qui s'adresse le site et ce que les visiteurs doivent faire
- [ ] L'en-tête montre une vraie photo ou l'essentiel du contenu, pas seulement un titre et un bouton sur une surface de couleur (skill gestaltung, « Schlicht heisst nicht ohne Bild »)

### <chaque autre page de design/entwurf/>
- [ ] Titres, menu et sections comme dans design/entwurf/<page>.html
- [ ] …

### <chaque fonction, par exemple un formulaire ou des réservations>
- [ ] L'envoi fonctionne, les champs obligatoires manquants se signalent clairement, le message arrive à <adresse>
- [ ] Chaque liste montre si elle charge, si elle est vide (une phrase et un bouton) ou si elle a une erreur (avec « Réessayer », jamais déguisée en liste vide)
- [ ] Après l'envoi, une confirmation : ce qui s'est passé, ce qui vient ensuite, comment l'annuler
- [ ] Le bouton dit le résultat (« Réserver une place », pas « Envoyer ») et il est bloqué pendant l'envoi

### Pour toutes les pages
- [ ] Contenu comme dans l'ébauche, aucun espace réservé sans étiquette claire
- [ ] Natel (390 px de large) : rien de coupé, lisible sans zoom, au moins 16 px de marge à gauche et à droite, boutons d'au moins 44 px de haut, le menu sur une ligne ou en bouton « Menu »
- [ ] Chaque page, aussi les pages des briques, a un en-tête, un menu et un pied de page avec mentions légales et protection des données
- [ ] Contraste : texte au moins 4,5 : 1, boutons et bordures au moins 3 : 1
- [ ] Utilisable au clavier, le focus est visible
- [ ] Vitesse : Lighthouse au moins 90 en performance, accessibilité, bonnes pratiques et SEO ; au maximum 50 Ko de JavaScript par page ; images sous 500 Ko
- [ ] Chaque porte de docs/tueren.txt répond comme prévu ; aucun secret dans le code, aucun .env en ligne
```

**Les portes :** du tableau « Accès » naît `docs/tueren.txt`, avec par ligne un chemin et le statut avec lequel il doit répondre sans connexion. 200 veut dire ouvert, 404 « n'existe pas », 401 ou 403 « seulement avec connexion », 302 « vers la connexion ». Plusieurs nombres sur une ligne veulent dire « l'un d'eux », après `#` vient un commentaire :

```
# chemin        statut attendu sans connexion (tiré de « Accès » dans docs/prd.md)
/               200
/mentions-legales        200
/protection-des-donnees  200
/verwaltung     404     # jamais public
/.env           404
/.git/config    404 403
/docs/plan.md   404     # les documents de travail ne vont pas en ligne
```

Avec une brique, ses portes s'ajoutent. S'il y a une entrée devant (skill `bausteine`, partie « Ein Eingang für alles? »), ce sont par exemple `/intern/ 401`, `/_/ 404` et `/api/collections/_SUPERUSERS/auth-methods 404` : les pages protégées demandent une connexion, et la connexion de l'administration reste fermée depuis l'extérieur. Les listes de PocketBase (par exemple `/api/collections/users/records`) répondent aux visiteurs 200 avec une liste vide, pas 401 ni 403 ; si tu mets une telle liste dans `docs/tueren.txt`, c'est avec 200. Toutes les portes par recette sont dans le skill `bausteine`, partie « Türen der Bausteine ». Avec la recette `buchungen`, `/verwaltung/` est la page « Mes réservations » et répond 200 (les réservations, seule la personne connectée avec le compte de l'administration les voit) ; la ligne `/verwaltung 404` de l'exemple ci-dessus ne convient alors pas.

**Un message pour les hypothèses :** montre le PRD à la personne en trois ou quatre phrases, ouvre le fichier et présente le mode de construction et les portes comme hypothèses, par exemple : « Je construis avec Astro, sans brique, et seules l'accueil, l'offre, la demande, les mentions légales et la protection des données sont ouvertes. C'est juste ? » Après son oui, tu enlèves `[Annahme: …]`, tu fais l'entrée dans le journal de bord (`git add docs && git commit -m "PRD tiré de l'ébauche, mode de construction et portes"`), tu annonces `prd` et tu construis.

**Construire les fonctions comme les pros.** Ce que font les visiteurs (réserver, s'inscrire, commander, demander), tu le construis selon ces règles, même si la personne ne le demande pas :

- **Trois portes :** des pages publiques sans connexion ; une page pour les invités par lien avec un code secret, sans compte (par exemple « annuler la réservation ») ; l'administration seulement pour la personne, jamais liée.
- **Une seule source par vérité :** offres, prix, délais et heures d'ouverture figurent à un seul endroit. Page, formulaire, e-mail et conditions lisent tous là.
- **Un mot par chose,** le même sur la page, dans l'e-mail et dans l'administration. Une demande n'est pas une réservation. Les mots figurent dans `docs/designsystem.md`.
- **Vérifier sur le serveur, jamais seulement dans le navigateur :** places, délais et statuts, c'est le serveur qui les calcule. Pour les réservations, il existe la recette testée `buchungen` (skill `bausteine`), au lieu de la réinventer.
- **Des erreurs honnêtes :** si un service ne répond pas, c'est une erreur avec « Réessayer », jamais « aucune date ».
- **Format suisse :** « CHF 1'250.– », « mar. 3 nov. 2026, 18:00–19:15 », heures en `Europe/Zurich`.
- **Le natel d'abord :** à 390 px, pas de défilement latéral, l'action principale est visible sans défiler, un formulaire demande une chose par étape (« Étape 2 sur 3 »).

Chaque critère doit pouvoir être vérifié : on voit ou on mesure s'il est rempli. « Beau » ou « moderne » n'est pas un critère.

### 4. Construire (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- Dans `web/astro.config.mjs` : `outDir: '../seite'`. On construit dans le dossier `seite/`, c'est lui que le domicile livrera plus tard.
- **Les tokens à un seul endroit :** la mise en page (par exemple `web/src/layouts/Seite.astro`) intègre directement `design/tokens.css`, en premier : `import '../../../design/tokens.css';`. Tu ne copies jamais le fichier dans `web/` : deux copies finissent par diverger. S'il manque une valeur, elle va d'abord dans `design/tokens.css` et `docs/designsystem.md`.
- **Balisage et classes tirés de l'ébauche :** chaque page de `design/entwurf/` devient une page dans `web/src/pages/`, avec le même balisage et les mêmes classes. Ce qui est identique sur plusieurs pages (en-tête, menu, pied de page, cartes, champs de formulaire) devient un composant dans `web/src/components/`. Les feuilles de style que l'ébauche intègre (sauf `tokens.css`) vont telles quelles dans `web/src/styles/` et dans la mise en page juste après les tokens ; les styles d'un `<style>` d'une page de l'ébauche vont dans la page ou le composant qui correspond. Les scripts qui, dans l'ébauche, font seulement semblant (un formulaire qui n'envoie rien, un menu inséré par un script), tu les remplaces par la vraie chose.
- **Mentions légales et protection des données** ne figurent pas dans l'ébauche : tu les construis maintenant dans la même mise en page (skill `recht-ch`).
- **Les données d'abord :** ce que la personne a cité dans le plan (cours avec horaires et places, prix, heures d'ouverture), tu le récupères maintenant, avant de construire. Un « on a ça » ne suffit pas : demande le texte, la liste ou une photo de celle-ci.
- Les listes comme les dates, les tournois ou les sponsors sont des données dans `web/src/data/*.json`, que les pages lisent. Documents et images vont dans `web/public/`, images réduites. S'ils viennent d'un site existant, le skill `webseite-modernisieren` s'applique, partie « Rechte » (les droits).
- Le signe dans l'onglet du navigateur (`web/public/favicon.svg` et `favicon.ico`) est le « A » d'Astro : remplace-le par le logo ou un signe tiré de celui-ci.
- S'il manque du matériel (par exemple les logos des sponsors), il y a un espace réservé clairement étiqueté comme dans l'ébauche, jamais une autre image sous un faux nom.
- Construire et lancer l'aperçu :
  ```bash
  (cd web && npm run build && npx astro preview --background)
  open http://localhost:4321
  ```
  L'aperçu continue de tourner en arrière-plan et montre le nouvel état après chaque `npm run build`, jusqu'à ce que tu l'arrêtes avec `(cd web && npx astro preview stop)`.
- **Avec une brique** (réservations, liste d'inscription, connexion), tu lances, au lieu de l'aperçu, `bun bausteine/pocketbase/lokal.ts` (adresse `http://localhost:8090`) : c'est seulement ainsi que formulaires et réservations fonctionnent vraiment, sur l'ordinateur de la personne.
- Quand l'aperçu tourne, tu fais l'entrée dans le journal de bord (`git add web seite && git commit -m "Gros œuvre : toutes les pages tirées de l'ébauche"` ; `web/.gitignore` exclut `web/node_modules`) et tu annonces `lokal`, avant de montrer le site à la personne.

### 5. Vérifier (`schritt: pruefung`)

Quatre spécialistes font la réception du gros œuvre, chacune écrit un rapport avec un feu tricolore. `pruefen.mjs` mesure ce qui se mesure, et en plus il vérifie les portes :

```bash
(cd web && npm run build) && node scripts/pruefen.mjs
node scripts/pruefen.mjs --tueren                               # avec une brique : --tueren http://localhost:8090, tant que lokal.ts tourne
```

La première fois, le script télécharge les outils (Playwright, axe-core, Lighthouse, environ 200 Mo) et prend quelques minutes. Dis-le à la personne avant. Il écrit `docs/pruefung/messwerte.json`, `docs/pruefung/tueren.json` et des photos de chaque page en 390 et 1440 px dans `docs/pruefung/fotos/`. Ses messages sont en allemand : tu les transmets en français.

Ensuite, tu écris quatre rapports, d'une page chacun, dans la langue de la personne :

- `docs/pruefung/sicherheit.md` (sécurité et droit) : secrets dans le code, `npm audit`, pas de `.env` dans `seite/`, chaque porte de `docs/tueren.txt` avec son statut, mentions légales et protection des données présentes et complètes (skill `recht-ch`), quels services externes et cookies le site utilise.
- `docs/pruefung/ablaeufe.md` (déroulements et accès) : les règles d'accessibilité (WCAG 2.2 AA, axe) sur chaque page, liens morts, chaque formulaire essayé une fois toi-même, la page d'accueil parcourue au clavier (Tab), les déroulements du PRD étape par étape.
  - **Vert seulement avec une preuve.** Pour chaque fonction avec une brique, la sortie du test (« Alles grün », tout vert) et une photo d'une vraie réservation de test ou d'une vraie entrée sur cet ordinateur vont dans le rapport. Si quelque chose n'a pas fonctionné, le feu est jaune ou rouge. N'écris jamais « testé de bout en bout » si tu ne l'as pas fait.
- `docs/pruefung/aussehen.md` (apparence) : `design/tokens.css` est intégré, seulement ses valeurs dans le code, système de design respecté, chaque photo regardée toi-même (coupé, masqué, lisible ?) et comparée à la liste des signes d'IA du skill `gestaltung`. Si `pruefen.mjs` signale en rouge le menu sur le natel ou des cartes identiques sur la page d'accueil, tu transformes avant de continuer. Avec le jaune « pas de photo dans la première image », l'essentiel figure en grand dans l'en-tête, et la personne reçoit la liste des photos.
- `docs/pruefung/code.md` (code et vitesse) : Lighthouse dans les quatre domaines, JavaScript par page, tailles des images, et quels critères d'acceptation sont remplis.

```markdown
# Vérification : <domaine>

**Feu :** vert | jaune | rouge
**En mots simples :** deux ou trois phrases sur ce que ça veut dire pour les visiteuses et les visiteurs

## Vérifié
- … (valeur mesurée tirée de messwerte.json ou tueren.json, ou ce que tu as essayé toi-même)

## Corrigé
- …

## Ouvert
- … (avec la raison pour laquelle ça peut rester ainsi)
```

Ensuite, tu passes en revue les critères d'acceptation de `docs/prd.md` : tu coches ceux qui sont remplis (`- [x]`) et tu notes brièvement où ou avec quoi ils ont été vérifiés. Ce qui n'est pas rempli reste ouvert, avec une raison.

Rouge veut dire : corriger, reconstruire, revérifier, jusqu'à ce que plus rien ne soit rouge. Jaune seulement avec une raison sous « Ouvert ». « Tout vert », tu ne l'écris qu'après avoir regardé les photos toi-même. Quand les quatre rapports sont dans `docs/pruefung/` et que plus rien n'est rouge, tu fais l'entrée dans le journal de bord (`git add docs web seite && git commit -m "Vérification : quatre rapports, rien de rouge"`) et tu annonces `pruefung`. En mode `lernen`, tu poses maintenant la question de contrôle de la leçon `flugschule-20-logbuch-eintrag` : « Qu'est-ce qu'une entrée dans le journal de bord (commit), et pourquoi chaque étape en reçoit-elle une ? » Si `lage` a donné d'autres leçons dans cette phase (sur le parcours site web, l'accessibilité et le droit), tu poses aussi leurs questions. Tu n'annonces `verstanden_melden` (type `kontrollfrage`, chaque fois avec la mission de la question) qu'après la réponse de la personne.

### 6. Validation (Freigabe) : la visite (`schritt: freigabe`)

Maintenant, la personne parcourt elle-même sa maison. Elle décide si elle peut aller en ligne ainsi.

1. **Montrer en local, sur le natel et sur l'ordinateur.** Construire, lancer l'aperçu (étape 4) et parcourir chaque page avec la personne : sur l'ordinateur dans l'aperçu (`open http://localhost:4321`), pour le natel les photos en 390 px (`open docs/pruefung/fotos/start-390.png` et les autres). Si elle veut le voir sur son vrai natel et qu'il est sur le même Wi-Fi : arrêter l'aperçu et le relancer avec `(cd web && npx astro preview --host --background)`, puis elle ouvre sur le natel l'adresse indiquée sous « Network ».
2. **Comparaison avec l'ébauche.** On a construit ce que la personne a vu dans le modèle ; tu le vérifies page par page :
   ```bash
   node scripts/pruefen.mjs --vergleich
   ```
   Il compare pour chaque page les titres, les entrées du menu et les sections avec `design/entwurf/` et signale chaque écart en jaune, avec l'endroit (page, quoi, numéro dans l'ébauche et dans la construction). Pour chaque écart, tu ouvres les deux côte à côte (`open design/entwurf/<page>.html` et `open http://localhost:4321/<page>/`). Si c'est une erreur de construction, tu construis comme dans l'ébauche et tu compares à nouveau. Si c'est voulu (par exemple un vrai texte au lieu de `[à compléter]`), tu le dis à la personne, et elle décide. On continue seulement quand plus aucun écart n'est ouvert.
3. **Moment d'apprentissage « changer soi-même un texte et le voir en local ».** En mode `lernen`, il est obligatoire, en mode `machen` tu le proposes en une phrase. La personne ouvre le fichier d'une page dans un éditeur de texte (`open -e web/src/pages/index.astro`, Windows `notepad`, Linux `xdg-open` ; les listes comme les dates sont dans `web/src/data/`), change une phrase et enregistre. Tu reconstruis (`(cd web && npm run build)`), elle recharge l'aperçu et voit son changement. Puis elle décide : le garder (entrée dans le journal de bord, `pruefen.mjs` à nouveau, rien de rouge) ou revenir en arrière avec `git restore <fichier>`. Si elle l'a fait elle-même, tu annonces `verstanden_melden` (mission `flugschule-21-text-aendern`, type `selbst`).
4. **Ce qui a été vu va dans `docs/prd.md`,** sous les critères d'acceptation (débuts de ligne en allemand) :
   ```
   Lokal gesehen: <date>, sur le natel (photos en 390 px) et sur l'ordinateur (aperçu)
   Vergleich mit Entwurf: <date>, aucun écart ouvert (pruefen.mjs --vergleich ; discuté : …)
   ```
5. **La question :** « Tu as vu ton site sur ton ordinateur, en largeur natel et en largeur ordinateur. Tu le valides ? » Ajoute ce qui est encore ouvert (tiré des rapports), et que cette validation vaut pour la mise en ligne : c'est exactement ce site qui ira en ligne, ni plus ni moins.
6. **Seulement après son oui explicite,** tu écris en dessous `Freigegeben: <JJ.MM.AAAA>, « <ses mots> »`, par exemple `Freigegeben: 31.10.2026, « Oui, en ligne comme ça »`. La date vient devant, en chiffres : sans date, avec `[Annahme: …]` ou avec « pas encore », la ligne ne compte pas comme un oui, ni pour `lage` ni pour le skill `lancieren`. « Ça a l'air bien » sans oui à la validation ne suffit pas. Ensuite, l'entrée dans le journal de bord, avec un repère (tag) exactement à cet état :
   ```bash
   git add docs/prd.md && git commit -m "Site validé" && git tag -f freigegeben
   ```
   À la mise en ligne, le tag `freigegeben` montre si quelque chose a encore changé sur le site depuis.
7. Annonce `freigabe`. En mode `lernen`, tu poses maintenant les questions de contrôle de la leçon `flugschule-21-text-aendern` : « Comment changes-tu toi-même un texte de ton site, et comment vois-tu le changement avant qu'il aille en ligne ? » et « Pourquoi vois-tu ton site d'abord sur ton ordinateur, avant qu'il aille en ligne ? » Tu n'annonces `verstanden_melden` (type `kontrollfrage`) qu'après la réponse de la personne.

Si la personne veut encore changer quelque chose avant la validation : un texte, une image ou une date, on revient à l'étape 4, puis vérification et visite à nouveau. Une nouvelle page ou une nouvelle fonction est un complément : d'abord dans `docs/plan.md`, puis une ébauche des pages modifiées et une nouvelle autorisation de construire (skill `entwurf`), et seulement ensuite la construction.

Ensuite vient le skill `lancieren` : où le site doit-il habiter ? Appelle `lage` si l'outil existe et suis-le.

## Pièges

- Construire sans `pruefen.mjs --vor-bau`, ou écrire soi-même la ligne `Freigegeben zum Bauen:` : on construit alors ce que personne n'a autorisé.
- Réinventer le balisage au lieu de le reprendre de l'ébauche : à la visite, la personne voit alors autre chose que dans le modèle.
- Un deuxième `tokens.css` dans `web/` : il y a alors deux vérités, et l'une d'elles sera bientôt fausse.
- Des critères d'acceptation qu'on ne peut pas vérifier (« beau », « moderne ») : écris à quoi on le voit ou on le mesure.
- Un autre framework « parce qu'il est moderne » : la raison est le souhait de la personne ou une fonction, sinon Astro.
- Des couleurs, des espacements ou des tailles de police à la main dans le code : le système de design se casse.
- Des rapports sans valeurs mesurées, ou « tout vert » sans avoir regardé les photos.
- Oublier de construire `seite/` : l'aperçu montre alors l'ancien état.
- Envoyer quelque chose dans un port ou publier : ça n'appartient pas à ce skill, mais à la mise en ligne (skill `lancieren`).
- La validation sans visite sur le natel, ou avec des écarts ouverts par rapport à l'ébauche.
- Ne pas annoncer une étape : la maison sur l'île reste plantée là.

## Vérifier la mission

`mission_pruefen` avec `flugschule-20-logbuch-eintrag`, dès que `pruefung` est annoncé, et avec `flugschule-21-text-aendern`, dès que `freigabe` est annoncé. La vérification regarde sur l'île si le projet est au moins à cette étape. Sur le parcours site web, il y a en plus la mission facultative `webseite-02-bauen` : si la personne a mis à jour elle-même une liste comme les dates, tu la vérifies aussi après la validation.

## Message de fin

Ton dernier message dans cette étape commence par une phrase sur l'image « le gros œuvre dans ton propre atelier », qui redit l'essentiel. Ensuite : quelle étape est réussie et ce qui y est né, où se trouve le résultat, ce que la personne doit décider et ce qui vient ensuite (après la validation : le domicile, skill `lancieren`).
