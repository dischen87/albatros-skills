---
name: entwurf
description: "Conçoit avec une personne sans connaissances préalables tout son site web à parcourir en cliquant, avant la construction (plan de vol P7 et P8) : d'abord vérifier l'atelier (Node, npm, Git, avec une brique aussi Bun), puis chaque page et chaque fonction de la liste de construction dans la direction choisie, avec de vrais textes, un menu commun, confirmation, erreur et états vides, les pages des briques en factice et seulement des valeurs de design/tokens.css ; vérifié avec entwurf-pruefen.mjs, poli avec les retours de la personne. Ensuite l'autorisation de construire, seulement avec un oui clair de la personne. Le résultat est design/entwurf/ avec docs/entwurf.md. Utilise ce skill après gestaltung (planche d'échantillons vue) et pour « ébauche », « montrer tout le site », « à parcourir en cliquant », « prototype », « maquette cliquable », « autorisation de construire », « installer Node »."
metadata:
  stand: 0.3.0
  quelle: 'ebc8e728aae4'
---

# Ébauche : le modèle qu'on peut visiter

## L'image

Avant que le gros œuvre commence, l'architecte a sur sa table un modèle de toute la maison : chaque pièce, chaque porte, la cuisine avec ses vraies façades. On le parcourt des yeux et on dit « ici, il manque une fenêtre ». Maintenant, un changement tient en une phrase ; une fois le béton coulé, c'est une transformation. C'est pourquoi tu construis d'abord avec la personne un tel modèle de son site, qu'elle peut parcourir en cliquant. C'est seulement quand elle le signe qu'on construit.

Comme tout atelier, la construction du modèle a besoin d'outils : avant de commencer, tu regardes s'ils sont accrochés au mur.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de montrer des commandes. À l'autorisation s'ajoute la deuxième image : la signature sous le modèle.

## Dans le plan de vol

- **P7 « Concevoir tout le site »** est au tour quand la personne a vu la planche d'échantillons (P6, skill `gestaltung` : `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` et, dans `docs/designsystem.md`, la ligne `Musterblatt: gesehen am <date>`). Vérifie-le avant de commencer (Windows : `dir design` et `findstr /r /b /c:"Musterblatt: gesehen am [0-9]" docs\designsystem.md`) :
  ```bash
  ls design/tokens.css design/komponenten.css design/musterblatt.html
  grep -E '^Musterblatt: gesehen am [0-9]' docs/designsystem.md
  ```
  S'il manque un fichier ou si `grep` ne montre rien (par exemple, il y a encore `Musterblatt: [offen: …]`), tu vas d'abord au skill `gestaltung`, étape 5. Si, dans un projet plus ancien, `planche d'échantillons vue le <date>` figure encore à la fin de la ligne `Richtung:`, tu en fais la ligne `Musterblatt: gesehen am <même date>, passt`.
- **Résultat de P7 :** `design/entwurf/index.html` et un fichier pour chaque autre page, plus `docs/entwurf.md` avec les lignes `Werkstatt:` (atelier), `Seiten:` (pages) et `Rückmeldungen:` (retours). Les noms des lignes restent en allemand, parce que `lage` et les scripts de vérification les lisent ; le contenu est en français.
- **P7 est réussi** quand chaque page de `docs/plan.md` (sauf mentions légales et protection des données) a son fichier, prolongé à partir de la direction choisie ; que chaque fonction de la liste de construction (`## Bauliste` dans `docs/plan.md`) apparaît dans l'ébauche ; que tous les liens mènent à des pages existantes ; que les couleurs, les polices et les tailles ne figurent que comme `var(--…)` tirées de `design/tokens.css` ; que `entwurf-pruefen.mjs` est vert (ou que tu as vérifié la même chose à la main), que `plan-pruefen.mjs --entwurf` et `design-pruefen.mjs` sont sans rouge et que la personne a tout parcouru en cliquant. Tu annonces alors `entwurf`.
- **P8 « Autorisation de construire »** (section « Autorisation ») : la question « On le construit comme ça ? » et la ligne `Freigegeben zum Bauen:` dans `docs/entwurf.md`. Tu annonces alors `entwurf-freigegeben`. Ensuite vient P9, la construction (skill `webseite-bauen`) ; sans cette ligne, il ne construit pas.
- **Après la mise en ligne :** un grand changement (nouvelle page, nouveau déroulement) reçoit d'abord un ajout dans le plan, puis une ébauche des pages modifiées avec ce skill et une nouvelle autorisation de construire (skill `webseite-aendern`).

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Tutoiement, phrases courtes. Les mots techniques viennent avec leur image : Node est le moteur des scripts de vérification et plus tard de la construction, npm la camionnette qui apporte les outils, Git le journal de bord.
- Au plus deux questions par message. En P7, la personne dit seulement ce qui manque ou ce qui dérange ; les textes, c'est toi qui les proposes, les états et l'atelier, tu les clarifies toi-même et tu montres le résultat.
- Ce que la personne doit voir, tu l'ouvres toi-même dans le navigateur : `open design/entwurf/index.html` (Linux `xdg-open`, Windows `start`). Donner seulement le nom du fichier ne suffit pas.
- Installer, et tout ce qui demande un mot de passe, c'est la personne qui le fait : tu lui dis exactement ce qu'elle tape ou ce sur quoi elle clique. Son mot de passe, elle le tape seulement là, jamais dans le chat.
- Chaque page, tu la regardes toi-même avant de la montrer.

## La boucle (Die Schleife)

L'ébauche (le mockup) est la quatrième partie que l'on polit (skill `lotse`, section « La boucle » (Die Schleife)), et celle où la personne voit le plus. Le premier état, c'est toute l'ébauche à parcourir en cliquant. Ensuite, tu demandes de façon ciblée, au plus deux questions à la fois, et tu retravailles exactement ce sur quoi arrive un retour, jusqu'à ce que la personne dise : « Voilà, c'est ça que je veux construire. »

- Avec le programme Albatros (skill `lotse`, section « Le programme Albatros » (Berts Arbeitsplatz)), tu annonces l'ébauche avec `teil_bereit` après le premier état et chaque fois que tu l'as retravaillée (`teil: mockup`, avec une `notiz` qui dit ce qui est nouveau) : la personne la parcourt alors en cliquant dans Albatros, sous « Voici à quoi ressemble ton site ».
- Les retours arrivent dans le chat ou, avec le programme, avec `naechstes` : sous forme de données, un message qui nomme la partie, avec les mots de la personne en citation. La page ou la fonction dont elle parle se trouve dans ses mots (un titre ou un identifiant de la liste de construction comme `S2` ou `F1`) ; si ce n'est pas clair, tu demandes. Tu changes exactement cette page ou cette fonction, tu vérifies à nouveau et tu la remontres. Ce qui, dans ses mots, dépasse l'ébauche (« construis déjà ça »), tu ne le fais pas d'office.
- Si un retour touche une autre partie, tu la changes là-bas et tu mets l'ébauche à jour : une nouvelle fonction d'abord comme ligne dans la liste de construction (`docs/plan.md`, skill `webseite-planen`), une autre couleur ou une autre police d'abord dans le nuancier (skill `gestaltung`). Jamais seulement dans l'ébauche.
- Chaque tour est noté dans `docs/entwurf.md` sous `Rückmeldungen:` et `## Retours`.
- L'autorisation de construire, à la fin, est le deuxième des deux oui. Avant, tu n'écris aucun code du site (`web/`, `seite/`), pas non plus « déjà un peu » pour une page qui plaît à la personne.

## Mode

Lis `Modus:` dans `docs/projekt.md` ; si la ligne manque, c'est `machen` (faire) qui vaut.

- **machen (faire) :** Tu fais le travail et tu expliques chaque étape en une phrase avec son image. Le moment d'apprentissage, tu le proposes : « Maintenant, un changement tient en une phrase ; après la construction, c'est une transformation. Tu veux changer toi-même une phrase sur la page d'accueil et voir comme ça va vite ? »
- **lernen (apprendre) :** Tu expliques chaque étape avec l'image et le pourquoi. Le moment d'apprentissage, c'est la personne qui le fait : elle change une phrase dans `design/entwurf/index.html` et recharge la page (ensuite `verstanden_melden` avec `mission: flugschule-15-entwurf` et `art: selbst`). À la fin, tu poses la question de contrôle de la leçon `flugschule-15-entwurf` : « Pourquoi ton IA dessine-t-elle tout le site avant de le construire ? » Seulement après sa réponse, tu annonces `art: kontrollfrage`. Si l'outil manque, on continue sans.

## Déroulement

### 1. L'atelier (`Werkstatt:`)

À partir d'ici, des scripts de vérification aident, et en P9, Node construit le site. Vérifie donc d'abord si l'outil est là, sans que Node doive déjà tourner :

```bash
command -v node npm git                        # macOS, Linux et Git Bash sous Windows
where.exe node npm git                         # Windows dans PowerShell ou l'invite de commandes
node --version; npm --version; git --version   # seulement ce qui a été trouvé
```

Dans PowerShell, c'est `where.exe`, pas `where` : sans `.exe`, PowerShell cherche autre chose.

| Outil | À quoi il sert | Au moins (état au 31.10.2026) |
|---|---|---|
| Node | le moteur des scripts de vérification et de la construction avec Astro | 22.23.4 (exigé par Astro 7) ; mieux, la version LTS actuelle de nodejs.org, en ce moment 24 ou 26 |
| npm | va chercher des outils, vient avec Node | 10 |
| Git | le journal de bord | 2.28 |
| Bun, seulement avec une brique | fait tourner la brique et ses tests sur l'ordinateur (dès P9) | vérifié avec 1.4.2 |

**Avec une brique** (`Setup:` dans `docs/plan.md` en nomme une, par exemple liste d'inscription, réservations ou connexion ; skill `bausteine`), tu vérifies aussi Bun : `command -v bun` (Windows dans PowerShell `where.exe bun`), puis `bun --version`. Sans brique, pas besoin de Bun.

S'il manque quelque chose ou si c'est trop vieux, tu expliques en langage de tous les jours comment ça arrive sur son ordinateur. Elle installe elle-même, tu lui dis chaque clic :

- **Mac :** Node : sur nodejs.org, télécharger la version LTS comme programme d'installation (.pkg), l'ouvrir et cliquer jusqu'au bout. S'il y a Homebrew (`command -v brew`), `brew install node` marche aussi. Git : `xcode-select --install` ouvre une fenêtre qui propose les outils de développement d'Apple ; là, cliquer sur « Installer ».
- **Windows :** dans PowerShell, `winget install -e --id OpenJS.NodeJS.LTS` et `winget install -e --id Git.Git` ; quand Windows demande s'il faut autoriser les modifications, elle clique sur Oui. Sans winget : les programmes d'installation de nodejs.org et de git-scm.com.
- **Linux (Ubuntu, Debian) :** Git avec `sudo apt install git` ; sudo demande son mot de passe, elle le tape elle-même dans le terminal. Node tiré d'`apt` est souvent trop vieux : prends le chemin que nodejs.org montre pour Linux sous « Download » (nvm), puis `nvm install --lts`.
- **Bun, seulement avec une brique :** sur Mac et Linux dans le terminal `curl -fsSL https://bun.com/install | bash`, sous Windows dans PowerShell `powershell -c "irm bun.sh/install.ps1|iex"`. La personne tape la commande elle-même ; elle va chercher le programme d'installation de Bun.

Ensuite, vous ouvrez un nouveau terminal et tu vérifies encore une fois. Dans `docs/entwurf.md` va `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0 (vérifié le 31.10.2026)`, avec une brique aussi Bun : `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0, Bun 1.4.2 (vérifié le 31.10.2026)`. Si la personne ne peut pas installer maintenant (par exemple sur un ordinateur d'entreprise sans droits d'administration), l'ébauche marche quand même : `Werkstatt: sans Node (pas de droits d'administration), Git 2.39.5 ; vérification à la main`. Dis-lui honnêtement que la construction en P9 a besoin de Node, avec une brique aussi de Bun.

### 2. Les textes (Die Texte) (`Seiten:`)

Une ébauche avec de vrais textes montre si le site tient debout. Suis le skill `inhalte` : à partir de `docs/plan.md`, la liste des contenus `docs/inhalte.md`, la page d'accueil en trois phrases, des textes courts dans le ton de `docs/konzept.md` (`Ton:`, tu ou vous). C'est toi qui proposes les textes ; ce qui manque figure de façon visible comme `[à compléter : ce qui manque, qui le livre et quand]`, jamais inventé. La personne confirme les textes en parcourant le site.

### 3. Concevoir tout le site

Tu prolonges la direction choisie (`design/richtungen/<choisie>.html`, `design/musterblatt.html` et `design/komponenten.css`) sur chaque page de `Seiten:` dans `docs/plan.md` :

- **Fichiers :** `design/entwurf/index.html` pour la page d'accueil ; pour chaque autre page, le nom en minuscules, sans accents (é → e, à → a ; en allemand ä → ae, ö → oe, ü → ue), tout le reste devient « - » : « À propos » → `a-propos.html`, « Cours & prix » → `cours-prix.html`. C'est ainsi que `entwurf-pruefen.mjs` les trouve.
- **Un en-tête, un menu, un pied de page** sur chaque page, construits de la même façon : le menu avec toutes les pages du plan (sur le natel sur une ligne ou comme bouton « Menu »), dans le pied de page les liens vers les mentions légales et la protection des données. Ces deux pages n'ont pas encore besoin de texte dans l'ébauche : une courte page `mentions-legales.html` et `protection-des-donnees.html` avec `[à compléter : le texte vient à la construction, skill recht-ch]` suffit, pour qu'aucun lien ne mène dans le vide. Dans la construction, elles s'appellent pareil (`/mentions-legales`, `/protection-des-donnees`, skill `recht-ch`).
- **Seulement des valeurs du nuancier :** chaque page intègre `../tokens.css` et `../komponenten.css` ; le CSS propre à la structure des pages va dans `design/entwurf/entwurf.css`. Les couleurs, les polices, les tailles de police, les espacements, les arrondis et les ombres ne figurent que comme `var(--…)`. S'il manque une valeur, tu l'ajoutes d'abord dans `design/tokens.css` (et dans la planche d'échantillons), jamais dans une page.
- **Chaque fonction de la liste de construction, avec son identifiant :** l'endroit où une fonction de la liste de construction de `docs/plan.md` est montrée (le formulaire, le bouton, la liste) porte l'attribut `data-bauliste` avec son identifiant : `<form data-bauliste="F1" action="contact-confirme.html">`. Si un endroit en montre plusieurs, ils sont séparés par des espaces (`data-bauliste="F1 F3"`). Les entrées `Kann` (peut, plus tard) y figurent aussi, sinon la personne décide de quelque chose qu'elle n'a jamais vu ; si l'une d'elles ne doit quand même pas faire partie du premier vol, c'est noté avec la raison dans `docs/entwurf.md`. L'attribut reste dans le balisage à la construction ; ainsi, on peut vérifier plus tard si tout est construit.
- **Les états de chaque fonction :** Pour chaque fonction de la liste de construction (en bref dans `Funktionen:` dans `docs/plan.md`), tu montres ce qui se passe après le clic : la **confirmation** (ce qui s'est passé, ce qui vient ensuite, comment l'annuler), l'**erreur** (en mots, avec « Réessayer », ce qui a été tapé reste là) et l'**état vide** (une phrase et un bouton au lieu d'une liste vide). Chaque état est une page à part, par exemple `contact-confirme.html`, `contact-erreur.html`, `dates-vide.html`. Un formulaire pointe avec `action="contact-confirme.html"` vers sa confirmation ; ainsi le clic marche aussi sans programme derrière. Une page `zustaende.html` (pas dans le menu) liste tous les états avec des liens, pour que la personne les trouve.
- **Les pages des briques en factice :** si le plan a besoin d'une brique (`Setup:`, skill `bausteine` : liste d'inscription, réservations, connexion, tableau d'affichage), tu conçois ses pages de la même façon, avec en-tête, menu et pied de page : par exemple `reserver.html` avec les dates, `reserver-confirme.html`, `reserver-complet.html` (« Cette place vient d'être prise »), `reserver-vide.html` et « Mes réservations » (`verwaltung.html`, pas dans le menu). Elles ont l'air vraies mais ne fonctionnent pas encore ; elles sont construites en P9 à partir de la recette de la brique.
- **Le personnage,** si `Maskottchen: ja` dans `docs/konzept.md` : seulement aux endroits qui y sont notés (accueil, réussite, vide), en image tirée de `design/figur/` ou en esquisse. Jamais lors d'erreurs.
- **Images :** les propres photos de la liste de photos dans `docs/inhalte.md` dans `design/entwurf/bilder/`, sinon une surface grise avec `alt="[à compléter : photo …]"`. Chaque `<img>` a `width`, `height` et une description.
- **Unique, pas sorti d'un kit :** les critères du skill `gestaltung`, section « Unique plutôt qu'en kit » (Eigen statt Baukasten), s'appliquent : pas de titre centré avec deux boutons comme en-tête, pas d'emoji comme icônes, pas de textes Lorem, pas de cartes de même taille. Mouvement et 3D seulement comme dans sa section « Mouvement et 3D » (Bewegung und 3D) : chaque mouvement avec sa phrase dans `docs/designsystem.md` et en respectant « Réduire les animations », la 3D seulement avec une image fixe (`data-3d-standbild`) et chargée seulement au besoin.
- **Construit pour le natel :** `<meta name="viewport" content="width=device-width, initial-scale=1">` dans chaque page, pas de défilement de côté à 390 px, des boutons d'au moins 44 px de haut.
- **Liens** toujours avec le chemin depuis la page et avec `.html` (`contact.html`, `../index.html`), jamais avec « / » au début et jamais vers un dossier : l'ébauche s'ouvre comme fichier, sans serveur.

### 4. Vérifier avec entwurf-pruefen.mjs

Le script de ce skill vérifie ce qui peut l'être ; il ne télécharge rien et ne change rien. Copie-le dans le projet et lance-le :

```bash
mkdir -p scripts && cp <dossier de ce skill>/entwurf-pruefen.mjs scripts/
# dossier inconnu : curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs
node scripts/entwurf-pruefen.mjs
```

Il indique un feu par domaine et se termine avec 1 en cas de rouge. Ses messages sont en allemand ; tu les expliques à la personne en français :

- **Seiten aus dem Plan (pages du plan) :** chaque page de `Seiten:` dans `docs/plan.md` a son fichier (mentions légales et protection des données exceptées).
- **Links und Dateien (liens et fichiers) :** chaque lien, chaque image, chaque formulaire et chaque `url(…)` pointe vers un fichier qui existe, écrit exactement ainsi (majuscules et minuscules comme sur le serveur).
- **Farbfächer (nuancier) :** couleurs, polices et tailles seulement comme `var(--…)` tirées de `design/tokens.css`, aussi dans la planche d'échantillons et dans `komponenten.css` ; chaque `var(--…)` existe ; chaque commentaire de contraste dans `tokens.css` est recalculé.
- **Menü, Handy und Notizen (menu, natel et notes) :** le même menu sur chaque page, la ligne pour le natel (`viewport`), le nombre de `[à compléter]`, les lignes dans `docs/entwurf.md`.

En plus tournent les deux scripts des skills `webseite-planen` et `gestaltung` (copiés là-bas ; s'ils manquent dans `scripts/`, tu vas les chercher comme plus haut dans le dossier du skill concerné) :

```bash
node scripts/plan-pruefen.mjs --entwurf     # toute l'étendue des fonctions : chaque page et chaque fonction de la liste de construction apparaît dans l'ébauche
node scripts/design-pruefen.mjs             # unique plutôt qu'en kit : police, univers de couleurs, textes, en-tête, mouvement, 3D, poids
```

S'il manque dans l'ébauche une entrée `Muss` (doit, pour le premier vol) de la liste de construction, c'est rouge ; une entrée `Kann`, jaune. Ensuite vient ce qu'aucun script ne voit : l'auto-vérification et le deuxième avis dans un contexte neuf (skill `gestaltung`, section « Auto-vérification et deuxième avis » (Selbstprüfung und zweite Meinung)), avec le résultat dans `docs/entwurf.md` sous `## Vérification`.

Rouge veut dire : corriger et vérifier encore, jusqu'à ce que plus rien ne soit rouge. Le jaune ne reste qu'avec une raison dans `docs/entwurf.md`. **Sans Node**, tu vérifies la même chose à la main, page par page : chaque page du plan comme fichier ; chaque `href`, `src` et `action` contre la liste des fichiers (`ls design/entwurf`) ; dans le CSS et dans `style="…"`, pas de `#…`, `rgb(`, `hsl(`, noms de couleurs, pas de `font-family` sauf `var(--…)` et pas de nombres avec `px`, `rem` ou `em` pour la police, les espacements, les arrondis et les ombres ; chaque commentaire de contraste recalculé avec la formule du skill `barrierefreiheit` ; chaque ligne de la liste de construction contre les pages (où est-elle montrée ?) ; la liste du skill `gestaltung`, section « Unique plutôt qu'en kit » (Eigen statt Baukasten). Puis tu écris `vérification à la main` avec la date dans `docs/entwurf.md`.

### 5. Montrer : sur le natel et sur l'ordinateur

Avant que la personne voie quoi que ce soit, tu regardes toi-même. Avec Node, tu fais des photos de chaque page en 390 et 1440 px de large et tu regardes chacune : quelque chose est-il coupé ? Le menu tient-il sur une ligne ? Le texte a-t-il de l'air au bord ? L'ordinateur paraît-il vide ?

```bash
npx -y playwright@1 install chromium      # une fois, environ 150 Mo
npx -y playwright@1 screenshot --viewport-size=390,844 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-390.png
npx -y playwright@1 screenshot --viewport-size=1440,900 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-1440.png
```

Sous Windows, à la place de `file://$PWD/…`, il faut tout le chemin, par exemple `file:///C:/Users/anna/projekt/design/entwurf/index.html`.

Ensuite, tu ouvres `design/entwurf/index.html` et `design/entwurf/zustaende.html` pour la personne et tu lui montres comment obtenir la vue natel : rendre la fenêtre toute étroite, ou dans Firefox et Chrome `Ctrl+Shift+M` (sur Mac dans Firefox `Cmd+Opt+M`, dans Chrome d'abord `F12`). Sur le vrai natel, dans le même wifi, ça marche avec `npx -y serve design/entwurf` : elle tape l'adresse indiquée sous « Network » sur son natel, ensuite tu arrêtes avec `Ctrl+C`.

### 6. Retours (`Rückmeldungen:`)

Demande : « Clique partout, sur le natel et sur l'ordinateur : qu'est-ce qui manque, qu'est-ce qui dérange ? » Pourquoi : maintenant, un changement tient en une phrase ; après la construction, c'est une transformation. Chaque retour va avec la date et ses mots dans `docs/entwurf.md` ; tu changes exactement la page ou la fonction dont elle parle, tu vérifies à nouveau avec les trois scripts et tu la remontres (section « La boucle »). Si elle ne demande rien et dit seulement « bien », tu l'aides avec deux questions ciblées, par exemple : « Sur la page d'accueil, trouves-tu en cinq secondes ce que tu proposes ? » et « Manque-t-il dans la demande un champ dont tu as besoin ? » Sur le parcours entreprise, le test des cinq secondes de la méthode `landingpage` en fait partie : la personne montre le premier écran sur le natel à deux ou trois personnes du public cible ; leurs réponses vont aussi sous `Rückmeldungen:`.

Cela dure autant de tours qu'il en faut. Quand plus rien n'est rouge et que plus rien ne manque ni ne dérange la personne, tu annonces `entwurf` (section « L'île ») et tu passes à l'autorisation.

### docs/entwurf.md

Chaque ligne commence au début de la ligne par son nom en allemand et reste courte (300 caractères au plus), parce que `lage` la lit ; les détails viennent en dessous.

```markdown
# Ébauche : <nom>
Stand: <JJ.MM.AAAA>

Werkstatt: Node <version>, npm <version>, Git <version>, avec une brique Bun <version> (vérifié le <JJ.MM.AAAA>)
Seiten: Accueil (index.html), Offre (offre.html), Contact (contact.html avec confirmation et erreur) ; encore <nombre> à compléter
Rückmeldungen: <JJ.MM.AAAA> ‹<ses mots>› → <ce qui a changé>
Freigegeben zum Bauen: <JJ.MM.AAAA>, ‹<ses mots>›

## Pages
| Page | Fichier | Textes | États | Ouvert |
|---|---|---|---|---|

## Briques en factice
- …

## Retours
- <JJ.MM.AAAA>, ‹…› : changé …

## Vérification
- <JJ.MM.AAAA> : entwurf-pruefen.mjs vert (ou : vérification à la main)
- <JJ.MM.AAAA> : plan-pruefen.mjs --entwurf : <nombre> entrées sur <nombre> de la liste de construction ; design-pruefen.mjs <vert | jaune, parce que …>
- <JJ.MM.AAAA> : deuxième avis (<IA et façon>) : <nombre> ok, <nombre> risque, <nombre> ouvert
```

La ligne `Freigegeben zum Bauen:` (autorisé à construire) ne s'ajoute qu'avec l'autorisation.

## Autorisation (Freigabe)

La deuxième image : la signature sous le modèle. On ne construit que ce que la personne a vu et autorisé.

Dis-lui en trois ou quatre phrases ce que contient l'ébauche (les pages, les fonctions avec leurs états, ce qui est encore à compléter), ouvre la page d'accueil et demande exactement ainsi :

« On le construit comme ça ? »

- **Seul un oui clair à la construction compte :** « Oui », « Oui, construis-le comme ça », « Oui, vas-y », « D'accord, on construit ». Un compliment seul n'est pas une autorisation : à « ça a l'air bien » ou « c'est beau », tu redemandes une fois : « Ça me fait plaisir. Ça veut dire : oui, on le construit comme ça ? »
- **« Oui, mais … »** n'est pas une autorisation : d'abord changer, remontrer, redemander.
- Avec le programme Albatros, tu demandes le oui avec `ja_moment` (`entwurf`) ; la ligne, c'est alors le programme qui l'écrit quand la personne clique sur « Oui, confirmer » dans Albatros (skill `lotse`, section « Le programme Albatros » (Berts Arbeitsplatz)).
- Après le oui, tu écris dans `docs/entwurf.md` la ligne `Freigegeben zum Bauen: <JJ.MM.AAAA>, ‹<ses mots>›`, par exemple `Freigegeben zum Bauen: 31.10.2026, ‹Oui, construis-le comme ça›`, et tu annonces `entwurf-freigegeben`. Les mots `Freigegeben zum Bauen:` restent en allemand, c'est eux que la construction cherche. La date vient devant, en chiffres : sans date, avec `[Annahme: …]` ou avec « pas encore », la ligne ne compte pas comme un oui, ni pour `lage` ni pour `pruefen.mjs --vor-bau`.
- **Si l'ébauche change après l'autorisation,** celle-ci ne vaut plus : transforme la ligne en `Früher freigegeben zum Bauen: …` (autorisé auparavant), change, remontre et redemande. Ainsi, la ligne `Freigegeben zum Bauen:` veut toujours dire : exactement cette ébauche est autorisée.

Ensuite vient P9 : suis le skill `webseite-bauen` (`../webseite-bauen/SKILL.md`). Il construit à partir de cette ébauche, avec son balisage, ses classes et `design/tokens.css`, et il ne construit pas sans la ligne `Freigegeben zum Bauen:`.

## L'île

Après l'étape 6, tu appelles l'outil `schritt_melden` avec `schritt: entwurf` et `sprache: fr`, après l'autorisation avec `schritt: entwurf-freigegeben`. `projekt`, tu le laisses de côté, sauf si la personne travaille à un autre projet qui se trouve seulement sur son ordinateur ; tu donnes alors son nom court. Dis-lui en une phrase que sa maison a grandi. Si l'outil répond « Ungültige Angaben » (données non valables), vérifie une fois l'orthographe ; si Albatros ne connaît pas encore l'étape, on continue sans l'île, `docs/entwurf.md` en est la preuve. Ensuite, tu appelles à nouveau `lage` (skill `lotse`), toujours avec `skills_stand` : la valeur de `stand` sous `metadata` en haut de ce fichier.

## Pièges

- **Seulement deux ou trois pages conçues :** les lacunes n'apparaissent alors qu'à la construction. Chaque page et chaque fonction de la liste de construction fait partie de l'ébauche.
- **Un tour, puis l'autorisation :** le premier état est rarement celui que la personne veut construire. Demande de façon ciblée jusqu'à ce qu'elle le dise.
- **Un en-tête comme partout :** titre centré, une ligne, deux boutons. `design-pruefen.mjs` le signale en rouge.
- **Seulement le chemin où tout marche :** la confirmation, l'erreur et la liste vide manquent. Un bon site ne s'effondre pas quand il y a une erreur.
- **Des textes inventés :** ce qui manque figure comme [à compléter], pour que personne ne l'oublie.
- **Des couleurs ou des espacements directement dans une page :** l'ébauche montre alors autre chose que la planche d'échantillons, et la construction hérite de l'erreur.
- **Des liens avec « / » au début ou vers des dossiers :** dans l'ébauche ouverte comme fichier, ils mènent dans le vide.
- **Prendre « ça a l'air bien » pour une autorisation :** ce qu'on demande, c'est un oui à la construction.
- **Continuer à changer en silence après l'autorisation :** chaque changement demande une nouvelle autorisation.

## Vérifier la mission

`mission_pruefen` avec `flugschule-15-entwurf`, sur le parcours site web aussi avec `webseite-03-inhalte`. La vérification regarde si le projet est au moins à l'étape « Ébauche » sur l'île.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « le modèle qu'on peut visiter », qui redit l'essentiel. Ensuite : ce qui est fait (quelles pages, quels états, les feux d'`entwurf-pruefen.mjs`), où se trouve le résultat (`design/entwurf/`, `docs/entwurf.md`), ce qui reste ouvert (les éléments à compléter avec nom et date) et ce qui vient ensuite : avant l'autorisation, la question « On le construit comme ça ? », après, la construction avec le skill `webseite-bauen`.
