---
name: webseite-bauen
description: 'Construit avec une personne sans connaissances préalables son site web comme dans une petite usine à logiciels, en neuf étapes fixes, chacune avec un résultat dans docs/ : mandat, maquette, système de design, stack technique (Astro, peu de JavaScript), PRD avec critères d''acceptation, construire en local, quatre vérifications avec rapport et feu tricolore (sécurité, déroulements et accès, apparence, code et vitesse, mesurés avec pruefen.mjs), autorisation par la personne, puis port, tapis roulant et site en ligne avec contrôle final. Ouvre l''île dans le cockpit et annonce les étapes avec schritt_melden. Utilise ce skill dès qu''on construit sur le parcours site web : après webseite-planen, après l''état des lieux de webseite-modernisieren, quand on dit « construis-moi le site », « maquette », « mockup », « ébauche », « système de design », « stack technique », « PRD », « critères d''acceptation », « vérifier avant de publier », « regarder en local », « comment ça continue après le plan ? ».'
---

# Construire le site web : la petite usine

## L'image

Une maison se construit dans un ordre fixe : mandat, esquisse, échantillons de matériaux, mode de construction, plan de construction avec signature, gros œuvre, réception par des spécialistes, remise des clés, emménagement. Personne ne coule les fondations avant que la famille ait signé le plan, et personne n'emménage avant que les spécialistes aient fait la réception. Une usine à logiciels travaille exactement pareil : chaque étape a un résultat qu'on peut regarder, et à la fin, des spécialistes vérifient avant que quelque chose sorte. Sur l'île du cockpit, la maison grandit avec.

**Comment utiliser l'image :** une phrase sur l'image dans ta première réponse. À chaque nouvelle étape, une phrase avec son image (dans le tableau plus bas), ce qui y naît et à quoi ça sert. Ainsi, la personne comprend pourquoi cette étape est nécessaire.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- L'ordre est fixe. Tu ne sautes aucune étape, tu ne construis rien avant que la personne ait validé le PRD et tu n'envoies rien au port avant son autorisation. Avec Light, le push est déjà la publication.
- Tu proposes la prochaine étape et tu la fais après un bref oui. La personne n'a jamais besoin de savoir ce qui vient ensuite.
- Tutoiement, langage de tous les jours. Les mots techniques (PRD, tokens, Lighthouse), tu les expliques la première fois avec leur image.
- Les sites web restent statiques, sans services à soi. Une brique (skill `bausteine`) ne s'ajoute que si la personne en a vraiment besoin.
- Ce que la personne doit voir (île, maquette, ébauches, aperçu, rapports, port, site terminé), tu l'ouvres toi-même dans le navigateur : `open <adresse ou fichier>` (Linux `xdg-open`, Windows `start`). Donner seulement l'adresse ne suffit pas.

## Les neuf étapes en un coup d'œil

| Étape | Image | Résultat | Île |
|---|---|---|---|
| 1. Mandat | le mandat donné à l'entreprise de construction | `docs/plan.md` ou `docs/bestand.md` | |
| 2. Maquette | l'esquisse sur papier | `docs/mockup.html` | `mockup` |
| 3. Système de design | les échantillons de matériaux | `docs/designsystem.md`, `web/src/styles/tokens.css` | `entwuerfe` |
| 4. Stack technique | le mode de construction | `docs/stack.md` | |
| 5. PRD avec critères d'acceptation | le plan de construction avec signature | `docs/prd.md` avec `Validé :` | `prd` |
| 6. Construire | le gros œuvre | `web/`, `seite/` | `lokal` |
| 7. Vérifier | la réception par des spécialistes | `docs/pruefung/` avec quatre rapports | `pruefung` |
| 8. Autorisation | la remise des clés | `Freigegeben:` dans `docs/prd.md` | `freigabe` |
| 9. Port, tapis roulant, en ligne | l'emménagement | site en ligne, `docs/pruefung/messwerte-live.json` | `hafen`, `fliessband`, `live` |

Ce qui figure dans la colonne « Résultat » doit être là à la fin de l'étape. S'il manque, l'étape n'est pas réussie.

## L'île

Dès le début, tu ouvres l'île de la personne dans le navigateur web. Sous `https://albatros.build/fr/cockpit/insel`, il y a pour chaque projet une maison qui grandit à chaque étape. Pour le français, l'italien et l'anglais, le préfixe de la langue vient devant (`/fr`, `/it`, `/en`) ; sans préfixe, `https://albatros.build/cockpit/insel` est la version allemande :

```bash
open https://albatros.build/fr/cockpit/insel     # macOS; Linux: xdg-open, Windows: start
```

L'île se recharge toute seule, l'ouvrir une fois suffit.

Après chaque étape réussie qui a une entrée dans la colonne « Île », tu appelles l'outil `schritt_melden` d'Albatros, avec `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `pruefung`, `freigabe`, `hafen`, `fliessband`, `live`, `domain`) et `sprache` (la langue de la conversation, ici `fr`). `projekt`, tu le laisses de côté dans le cas normal : c'est alors le journal de bord au port qui compte (`git@aufwind.sh:<name>/projekt.git`), même s'il n'est créé que plus tard. Seulement pour un autre projet, qui se trouve uniquement sur l'ordinateur, tu donnes un nom court fait de minuscules, de chiffres et de « - ». La réponse indique l'étape et l'adresse de l'île. Dis à la personne en une phrase que sa maison a grandi.

- L'île ne fait qu'avancer. Si tu annonces une étape qui est déjà là, rien ne change. La réponse le dit, tu ne réessaies pas.
- `hafen`, `fliessband`, `live` et `domain`, Albatros les voit aussi tout seul. Annonce-les quand même, dès qu'elles sont réussies.
- S'il répond « Ungültige Angaben », l'étape ou le nom était mal écrit : corrige et rappelle-le une fois.
- Si l'outil manque ou répond « unbekannt » (inconnu), on continue sans île.

## Les étapes

### 1. Mandat

Pas de construction sans mandat. Le mandat, c'est le plan `docs/plan.md` (skill `webseite-planen`) ou, pour un site existant, l'état des lieux `docs/bestand.md` (skill `webseite-modernisieren`). S'il n'y a ni l'un ni l'autre, tu passes d'abord par là. Lis le mandat et dis à la personne en trois phrases ce qui est construit, pour qui et à quoi elle verra le succès.

### 2. Maquette (`schritt: mockup`)

Rapide et grossière, en niveaux de gris : la page d'accueil et la sous-page la plus importante dans un seul fichier HTML `docs/mockup.html`, avec de vrais titres et le contenu du mandat. Elle montre la structure et l'ordre, encore sans couleurs ni images (surfaces grises). Ouvre-la dans le navigateur web et demande seulement : « Est-ce que l'ordre est juste ? »

### 3. Système de design (`schritt: entwuerfe`)

Suis le skill `gestaltung`, sections « Trois directions », « Ne pas avoir l'air fait par une IA », « Le nuancier (tokens) » et « Éléments graphiques ». D'abord, tu demandes le caractère, pas les couleurs. Ensuite, tu présentes deux ou trois ébauches bien différentes sur la maquette, en HTML dans `docs/gestaltung/entwuerfe/`, et tu les ouvres. La personne choisit une direction ou un mélange, ensuite tu annonces `entwuerfe`.

De la direction choisie naît le système de design, les échantillons de matériaux pour toute la maison :

- `web/src/styles/tokens.css` : les couleurs pour clair et sombre, les polices, les tailles de police, les espacements, les arrondis et les ombres en variables CSS, les valeurs de contraste en commentaire.
- `docs/designsystem.md` sur une page, lisible pour des humains : la direction et ses traits de caractère ; chaque couleur avec le nom du token, son rôle et son contraste ; les polices et les tailles ; les espacements et les arrondis ; les composants (bouton, lien, en-tête, pied de page, carte, champ de formulaire et ce dont le site a encore besoin), chacun avec son rôle et les tokens qu'il utilise ; les éléments graphiques.

Les couleurs, la police, les espacements, les arrondis et les composants ne figurent que là. Dans le code des pages, il n'y a que `var(--…)` et les composants. S'il manque une valeur, elle va d'abord dans le système de design.

### 4. Stack technique

Le mode de construction, tu le décides avant de construire et tu l'écris dans `docs/stack.md` :

```markdown
# Stack technique

**Décision :** Astro, statique
**Pourquoi :** … (une ou deux phrases, tirées du mandat)
**JavaScript :** seulement là où c'est nécessaire, au plus 50 KB par page
**Livré :** le dossier seite/ (Light : directement depuis le port ; Pilot : par le tapis roulant)
**Pas choisi :** … (par exemple une app React ou WordPress), parce que …
```

Par défaut, c'est Astro : il construit des pages HTML rapides et simples, sans JavaScript, qu'Albatros peut livrer directement. Un autre framework seulement si la personne le veut expressément ou si une fonction du mandat en a besoin. Alors, sous « Pourquoi », il y a la fonction et la raison pour laquelle Astro ne suffit pas. « Moderne » ou « connu » n'est pas une raison. Une liste d'inscription, un login ou une fenêtre d'édition ne sont pas une raison pour un autre framework, mais pour une brique (skill `bausteine`, avec Pilot). Dis à la personne en une phrase ce qui est choisi et pourquoi.

### 5. PRD avec critères d'acceptation (`schritt: prd`)

Le PRD, c'est le plan de construction sur une page, avec la liste de ce qu'on vérifie à la réception. Écris `docs/prd.md` :

```markdown
# PRD : <nom du site>

**Pour qui et pourquoi :** … (tiré du mandat)
**Pages :** accueil, …, impressum, protection des données
**Fonctions :** chaque fonction avec sa décision (pour un site existant, toutes celles de docs/bestand.md)
**Design :** direction <nom>, voir docs/designsystem.md
**Stack technique :** voir docs/stack.md
**Hébergement :** Light (page tirée du port, sans serveur à soi) ou Pilot (serveur à soi)
**Domaine :** name.aufwind.sh, plus tard propre domaine (seulement avec Pilot)
**Pas inclus :** …

## Critères d'acceptation

### Accueil
- [ ] Les trois premières phrases disent qui vous êtes, pour qui est le site et ce que les visiteurs doivent faire
- [ ] Le bouton « … » mène à …

### <chaque autre page>
- [ ] …

### <chaque fonction, par exemple un formulaire>
- [ ] L'envoi marche, les champs obligatoires manquants le signalent de façon compréhensible, le message arrive à <adresse>

### Pour toutes les pages
- [ ] Contenu comme dans le mandat, pas d'espace réservé sans nom clair
- [ ] Natel (390 px de large) : rien de coupé, lisible sans zoom, boutons d'au moins 44 px de haut
- [ ] Contraste : texte au moins 4,5 : 1, boutons et bordures au moins 3 : 1
- [ ] Utilisable au clavier, le focus est visible
- [ ] Impressum et protection des données présents et liés sur chaque page
- [ ] Vitesse : Lighthouse au moins 90 en performance, accessibilité, bonnes pratiques et SEO ; au plus 50 KB de JavaScript par page ; images sous 500 KB
- [ ] Pas de secrets dans le code, pas de .env en ligne

Validé : <date> par <nom>
```

Chaque critère doit pouvoir être vérifié : on voit ou on mesure s'il est rempli. « Beau » ou « moderne » n'est pas un critère. Écris à la place à quoi on le reconnaît. Montre le PRD à la personne en version courte dans le chat et ouvre le fichier. Seulement après son oui, tu inscris `Validé :` avec la date et le nom, tu annonces `prd` et tu construis.

### 6. Construire (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- Dans `web/astro.config.mjs` : `outDir: '../seite'`. Albatros livre le dossier `seite/`, avec Light directement et avec Pilot par le tapis roulant.
- `tokens.css` de l'étape 3 se trouve dans `web/src/styles/` et est intégré dans chaque mise en page (layout). Les composants de `docs/designsystem.md`, tu les construis d'abord, puis les pages à partir d'eux.
- Les listes comme les dates, les tournois ou les sponsors sont des données dans `web/src/data/*.json`, que les pages lisent. Les documents et les images vont dans `web/public/`, les images réduites.
- Le symbole dans l'onglet du navigateur (`web/public/favicon.svg` et `favicon.ico`) est le « A » d'Astro : remplace-le par le logo ou un signe tiré de celui-ci.
- S'il manque du matériel (par exemple les logos des sponsors), il y a un espace réservé clairement nommé, jamais une autre image sous un faux nom.
- Construire et ouvrir l'aperçu :
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- Quand l'aperçu tourne, tu annonces `lokal`, avant de montrer le site à la personne et d'attendre sa réponse.

### 7. Vérifier (`schritt: pruefung`)

Quatre spécialistes font la réception de la construction, chacun écrit un rapport avec un feu (vert, orange ou rouge). Le script `pruefen.mjs` de ce skill mesure ce qui peut se mesurer. Copie-le dans le projet et lance-le :

```bash
mkdir -p scripts && cp <dossier de ce skill>/pruefen.mjs scripts/
# dossier inconnu : curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
(cd web && npm run build) && node scripts/pruefen.mjs
```

La première fois, il charge les outils (Playwright, axe-core, Lighthouse, environ 200 MB) et prend quelques minutes. Dis-le à la personne avant. Il écrit `docs/pruefung/messwerte.json` et des photos de chaque page en 390 et 1440 px dans `docs/pruefung/fotos/`.

Ensuite, tu écris quatre rapports, chacun sur une page, dans la langue de la personne :

- `docs/pruefung/sicherheit.md` (sécurité et droit) : secrets dans le code, `npm audit`, pas de `.env` dans `seite/`, impressum et protection des données présents et complets (skill `recht-ch`), quels services d'autres fournisseurs et quels cookies le site utilise.
- `docs/pruefung/ablaeufe.md` (déroulements et accès) : les règles d'accessibilité (WCAG 2.2 AA, axe) sur chaque page, les liens morts, chaque formulaire essayé une fois toi-même, la page d'accueil parcourue au clavier (Tab), les déroulements du PRD étape par étape.
- `docs/pruefung/aussehen.md` (apparence) : seulement des valeurs de `tokens.css`, système de design respecté, chaque photo regardée toi-même (coupé, caché, lisible ?) et vérifiée avec la liste des signes d'IA du skill `gestaltung`.
- `docs/pruefung/code.md` (code et vitesse) : Lighthouse dans les quatre domaines, JavaScript par page, tailles des images, et quels critères d'acceptation sont remplis.

```markdown
# Vérification : <domaine>

**Feu :** vert | orange | rouge
**En mots simples :** deux, trois phrases sur ce que ça veut dire pour les visiteuses et les visiteurs

## Vérifié
- … (valeur mesurée tirée de messwerte.json ou ce que tu as essayé toi-même)

## Corrigé
- …

## Ouvert
- … (avec la raison pour laquelle ça peut rester ainsi)
```

Ensuite, tu passes en revue les critères d'acceptation dans `docs/prd.md` : ceux qui sont remplis, tu les coches (`- [x]`) et tu écris brièvement à côté où ou avec quoi tu l'as vérifié. Ce qui n'est pas rempli reste ouvert, avec la raison.

Rouge veut dire : corriger, reconstruire, vérifier à nouveau, jusqu'à ce que plus rien ne soit rouge. Orange ne passe qu'avec une raison sous « Ouvert ». « Tout vert », tu ne l'écris qu'après avoir regardé les photos toi-même. Quand les quatre rapports sont dans `docs/pruefung/` et que plus rien n'est rouge, tu annonces `pruefung`.

### 8. Autorisation (`schritt: freigabe`)

La remise des clés : la personne décide si le site peut sortir. Montre-lui les quatre feux en une phrase chacun, ouvre les rapports et l'aperçu et dis ce qui reste ouvert. Dis aussi : avec Light, la prochaine étape est la publication, le site est alors visible pour tout le monde. Demande : « Le site peut-il aller en ligne comme ça ? »

Seulement après son oui explicite, tu écris dans `docs/prd.md`, sous `Validé :`, la ligne `Freigegeben: <date> par <nom>`. Le mot `Freigegeben:` (autorisé) reste en allemand, c'est lui que la vérification de la mission cherche. Ensuite, tu annonces `freigabe`. Si elle veut changer quelque chose, on revient à l'étape 6, puis on repasse par la vérification.

### 9. Port, tapis roulant et en ligne (`schritt: hafen`, `fliessband`, `live`)

Le port d'Albatros (`code.aufwind.sh`) est le dépôt d'entraînement de la personne : c'est là que se trouve son code, en privé. S'il faut encore pour ça un compte, un abonnement et une clé, suis maintenant le skill `start` à partir de l'étape 3. Ensuite, tu récupères le journal de bord et tu y mets le nouveau site (skill `git-logbuch`) :

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite scripts logbuch/        # sans web/node_modules, que web/.gitignore exclut
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # la copie de travail de l'ancien site reste dehors
cd logbuch && git add .gitignore web docs seite scripts && git commit -m "Nouveau site : <direction>" && git push
```

Ensuite, tu ouvres le port dans le navigateur web, pour que la personne voie que son code s'y trouve, et tu annonces `hafen` :

```bash
open https://code.aufwind.sh/{name}/projekt
```

**Tapis roulant :** un tapis roulant simple, rien de spécial (skill `pipeline`). Avec Light, il n'en faut pas : ce qui est sur `main` dans `seite/` au port, Albatros le montre environ une minute plus tard. Avec Pilot, le tapis roulant de `.github/workflows/deploy.yml` livre le site sur le serveur.

**En ligne :** le site se trouve sous `https://{name}.aufwind.sh`, avec Light sans serveur à soi, avec Pilot sur le serveur à soi.

**Tu vérifies toi-même, la personne n'attend jamais.** Au lieu de « regarde à nouveau dans quelques minutes », tu vérifies toi-même après le push jusqu'à ce que ta nouvelle page soit là, trois minutes au plus. L'adresse répond déjà avant (avec le modèle ou la page de bienvenue). C'est pourquoi tu attends le titre de ta page, tel qu'il figure dans `seite/index.html` entre `<title>` et `</title>` :

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/ | grep -qF "<titre de ta page>" && echo "La page est là" && break; sleep 15; done
```

- **Elle est là :** vérifie encore une fois le site en ligne (titre, impressum et protection des données, Lighthouse). Terminé veut dire visible :
  ```bash
  node scripts/pruefen.mjs --live https://{name}.aufwind.sh
  ```
  S'il n'y a rien de rouge, tu annonces `fliessband` et `live`, tu ouvres l'adresse avec la personne (`open https://{name}.aufwind.sh`) et tu compares avec les photos de l'étape 7.
- **Toujours pas là après trois minutes :** demande `konto_status`. Avec Light, il indique si le dernier état est en ligne ou ce qui manque. Souvent, `seite/index.html` manque au port, parce que rien n'a été construit avant le push ou que `seite/` figure dans `.gitignore`. Avec Pilot, tu regardes au port sous « Actions » où le tapis roulant s'est arrêté (skill `pipeline`). Corriger, nouvelle entrée, push, vérifier à nouveau. Seulement si ça ne marche toujours pas, tu dis à la personne ce que tu as vérifié et tu demandes au coach (`coach_fragen`).

Si la personne souhaite ensuite autre chose (« il manque encore … », une date, un texte), tu charges le skill `webseite-aendern` et tu le suis. Le site est validé et en ligne, donc chaque modification a besoin de son critère dans le PRD, d'un avant et après et d'une nouvelle autorisation avant le push.

Un propre domaine s'ajoute avec le skill `domain` (seulement Pilot), ensuite tu annonces `domain`.

On ne publie que ce qui appartient à la personne ou ce pour quoi elle a l'autorisation (skill `webseite-modernisieren`, section « Droits »).

## Pièges

- Construire avant le PRD : on construit alors joliment le mauvais site.
- Envoyer au port avant l'autorisation : avec Light, c'est déjà la publication.
- Des critères d'acceptation qu'on ne peut pas vérifier (« beau », « moderne ») : écris à quoi on le voit ou comment on le mesure.
- Un autre framework « parce qu'il est moderne » : la raison, c'est le souhait de la personne ou une fonction, sinon Astro.
- Trois ébauches qui ne diffèrent que par la couleur : pas un vrai choix.
- Des couleurs, des espacements ou des tailles de police écrits à la main dans le code : alors le système de design casse.
- Des rapports sans valeurs mesurées, ou « tout vert » sans avoir regardé les photos.
- Oublier de construire `seite/` : au port, il y a alors l'ancienne page. Avant chaque push, `npm run build` dans `web/`.
- Faire attendre la personne (« regarde plus tard ») : tu vérifies toi-même jusqu'à ce que la page soit là (étape 9).
- Une étape pas annoncée : la maison sur l'île arrête de grandir. Annonce chaque étape qui a une entrée dans la colonne « Île », dès qu'elle est réussie.

## Vérifier la mission

`mission_pruefen` avec `webseite-02-bauen`, dès que le site est en ligne. La vérification regarde si `docs/prd.md` contient l'autorisation (`Freigegeben:`) et si le site répond. C'est pour ça que le mot `Freigegeben:` reste en allemand.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « la petite usine », qui redit l'essentiel. Ensuite : laquelle des neuf étapes est réussie et ce qui y est né, où se trouve le résultat, ce que la personne doit décider et quelle étape vient ensuite.
