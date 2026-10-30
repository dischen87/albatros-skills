---
name: gestaltung
description: "Retravaille l'utilisation et l'apparence d'un petit site web avec une personne sans connaissances préalables, étape par étape avec son IA. D'abord vérifier sous trois angles (déroulements, accès, états et langage), puis réparer l'utilisation, puis le caractère du site avant les couleurs préférées, trois directions bien différentes au choix, une vérification contre le look typique de l'IA, des valeurs fixes pour les couleurs, la police et les espacements (tokens), la question des éléments graphiques (icônes, illustrations, photos, mascotte, 3D, sur demande avec les outils d'images d'Albatros) et la transformation de toutes les pages, avec des photos en largeur natel et ordinateur. Utilise ce skill quand on dit « design », « ça a l'air ennuyeux », « ça fait bricolé », « ça fait IA », « vibe coded », « rendre plus beau », « couleurs », « police », « redesign », « trois variantes », « ça ne fait pas professionnel », « mise en page », « layout », « icônes », « illustrations », « mascotte », « 3D »."
---

# Mise en forme : d'abord les fondations, ensuite la façade

## L'image

Qui retape une vieille maison ne repeint pas d'abord la façade. D'abord viennent les fondations : les portes qui coincent, les escaliers sans rampe, les interrupteurs au mauvais endroit. C'est seulement quand la maison est agréable à habiter qu'on peint. De la peinture neuve sur des portes cassées ne fait qu'embellir les défauts.

Pour la façade, il y a ensuite un **nuancier** : une petite collection de couleurs, de polices et d'espacements fixes. Tout dans la maison est peint uniquement avec. Le mot technique pour ça, ce sont les **tokens**.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Si la personne veut « plus beau » ou « d'autres couleurs », ta première réponse est toujours : l'image des fondations avant la façade et le chemin en cinq étapes. Où se trouve le site et comment tu y accèdes, tu ne le demandes qu'après.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement, court. Chaque critique a besoin d'une preuve : quelle page, quel endroit, idéalement une photo. « Ça fait agité » tout seul ne compte pas.
- Les goûts, c'est la personne qui décide. Tu proposes des directions et tu dis honnêtement ce que chacune sait faire et quel est son risque.
- Les exigences propres de la personne (logo, couleur maison, forme d'adresse, textes obligatoires) passent avant tout conseil de mise en forme.
- Rien n'est publié avant que la personne ait vu les photos et dit oui.

## Déroulement

Si tu ne vois pas encore le site (pas de projet dans le dossier, pas d'adresse), explique d'abord tout le chemin en cinq étapes courtes : vérifier, réparer l'utilisation, choisir entre trois directions bien différentes, fixer le nuancier, transformer. Seulement ensuite, tu demandes où se trouve le site.

### 0. Cadre (5 minutes)

Reprendre de `docs/plan.md` (skill `webseite-planen`) : pour qui, la chose principale pour les visiteurs, les pages. En plus, demander : qu'est-ce qui doit rester (logo, couleur, police, textes) ? Crée `docs/gestaltung/`.

### 1. Vérifier sous trois angles (seulement lire, ne rien changer)

Parcours le site l'une après l'autre avec trois paires de lunettes. Pour chaque constat, une ligne de tableau dans `docs/gestaltung/pruefung.md` :

| ID | Page et endroit | Ce qui se passe, pour qui, pourquoi c'est mauvais | Preuve | Gravité | Proposition (nouveau texte mot pour mot ou nouveau comportement) |
|---|---|---|---|---|---|

- **Déroulements (DE) :** Jouer la chose principale du début à la fin. Combien d'étapes ? La réponse est-elle visible dès le premier écran ? Y a-t-il des culs-de-sac ? Est-il clair qui est derrière et combien ça coûte ?
- **Accès (AC) :** la liste de contrôle du skill `barrierefreiheit` (contraste, clavier, descriptions d'images, formulaires, natel).
- **États et langage (EL) :** Que voit-on pendant le chargement, avec un formulaire vide, en cas d'erreur, après l'envoi ? Les mêmes mots pour les mêmes choses ? Les boutons disent-ils le résultat (« Demander une place » plutôt que « Envoyer ») ?

Gravité : **critique** (la chose principale ne marche pas ou la loi est violée), **haute** (mène souvent à des erreurs ou à un abandon), **moyenne**, **basse**. Pour un petit site, 10 à 15 constats prouvés suffisent. La même erreur à beaucoup d'endroits, c'est un seul constat avec une liste des endroits. À la fin : ce qui est bien et doit rester.

### 2. Décider et réparer les fondations

Présente à la personne, regroupé, ce qu'elle doit décider (avec ta recommandation), pas un point après l'autre. Ensuite réparer : d'abord les parties communes (bouton, champ de formulaire, message d'erreur, confirmation), puis les pages. Les couleurs et les polices restent telles quelles à cette étape.

- **Bouton principal :** environ 56 px de haut, police de 17 px, demi-gras. Le deuxième bouton est blanc avec une bordure, les liens sont soulignés.
- **Désactivé** n'est jamais invisible : 40 % d'opacité, et à côté, on lit pourquoi.
- **Champs :** 48 à 52 px de haut, le libellé est au-dessus (jamais seulement un texte indicatif dans le champ), l'aide ou l'erreur en dessous, avec un mot et pas seulement avec une couleur.
- **États** (libre, complet, confirmé) toujours sous forme de mot et de forme, jamais seulement de couleur.

### 3. Trois directions

1. **Le caractère avant les couleurs.** Demande des traits de caractère, pas des couleurs préférées. Propose des paires d'opposés au choix, adaptées au site : traditionnel ou sportif, village de montagne ou ville, calme ou vivant, raffiné ou terre à terre, pour les hôtes ou pour les membres. En plus, une question : quels trois mots les visiteurs doivent-ils se dire après dix secondes ? Note les réponses dans `docs/gestaltung/richtungen.md`. Chacune des trois directions met en avant d'autres de ces traits. Les couleurs en découlent, ainsi que du logo et de l'environnement, jamais l'inverse.
2. **Modèles :** regarder les deux ou trois sites du plan. Qu'est-ce qu'ils font bien ? Qu'est-ce qu'on ne reprend pas (leur logo, leurs couleurs, leur police) ?
3. **Diagnostic :** Pourquoi l'apparence actuelle ne tient-elle pas ? Typique : tous les titres aussi forts, deux styles côte à côte, une couleur avec plusieurs significations, des espacements qui changent.
4. **Trois directions bien différentes**, pas seulement trois couleurs. Elles se distinguent par l'idée, la police, le rôle de la couleur, les formes et la profondeur. Exemple : « Doux » (chaleureux, arrondi), « Clair » (calme comme un journal), « Vif » (aplats de couleur, grands titres).
5. Chaque direction montre **les mêmes deux ou trois pages** (accueil, sous-page la plus importante, contact) avec de vrais textes. Un texte de remplissage fausse le jugement.
6. Identique dans toutes les directions : logo, textes obligatoires, un bouton principal par page, accessibilité.

`docs/gestaltung/richtungen.md` : tout en haut la ligne `Entscheid: <direction ou mélange> (<date>)`, en dessous le diagnostic et, pour chaque direction, un tableau (idée, police, couleurs, formes, force, risque). Le mot `Entscheid:` (décision) reste en allemand, c'est lui que la vérification de la mission cherche. Les ébauches en fichiers HTML dans `docs/gestaltung/entwuerfe/`, pour que la personne puisse les ouvrir dans son navigateur web.

### Ne pas avoir l'air fait par une IA

Les sites faits par une IA se reconnaissent aux mêmes signes. Vérifie chaque ébauche et le site terminé avec cette liste et écris le résultat dans `docs/gestaltung/richtungen.md` (ligne `Signes d'IA vérifiés : …`) :

- Des dégradés de violet et de bleu, des effets de lueur et de verre.
- Des emoji comme icônes.
- Inter ou une autre police standard partout, tous les titres aussi forts.
- Un en-tête centré avec une tache de couleur derrière et deux boutons côte à côte.
- Trois cartes identiques sur une ligne, avec la même ombre, le même arrondi et chacune une icône.
- Le look banque d'images : des gens souriants devant un ordinateur portable, des montagnes de n'importe où.
- Des formules creuses : « Bienvenue sur notre site web », « Découvrez », « Votre partenaire pour », « avec passion », « innovant », « sans couture ».
- Des chiffres, des avis, des citations ou des logos de clients inventés. Des promesses de temps comme « en 60 secondes ».
- Des ombres grises, deux sortes de profondeur côte à côte (une ombre ici, une bordure là), des jeux d'icônes mélangés.
- Plus de six sections sur la page d'accueil.

À la place : un seul signe distinctif, utilisé avec parcimonie (un trait sous un mot du titre, un surligneur pour au plus un mot par section), de vraies photos du lieu et des gens, une police avec du caractère, adaptée aux traits choisis, des couleurs tirées du logo et de l'environnement, une structure qui vient du contenu (si les dates sont l'essentiel, elles sont en haut) et des phrases concrètes avec des noms, des chiffres et des lieux. Dans le code, tu trouves les dégradés et les polices standard avec `grep -rnE "linear-gradient|radial-gradient|Inter" src`. Les emoji et les formules creuses, tu les cherches dans les textes, le reste dans les photos.

### 4. Le nuancier (tokens)

Un fichier `tokens.css` avec des variables CSS : couleurs pour clair et sombre, polices, tailles de police, espacements, arrondis. Pour chaque bloc, une phrase de commentaire qui dit pourquoi. Règles :

- Une couleur d'action pour tout ce qui est cliquable, et nulle part ailleurs.
- Recalculer le contraste, ne pas l'estimer : texte au moins 4,5 : 1, boutons et bordures au moins 3 : 1 (formule dans le skill `barrierefreiheit`). Noter les valeurs en commentaire.
- Le mode sombre n'échange que les variables de couleur (`@media (prefers-color-scheme: dark)`).
- En dehors de `tokens.css`, aucune couleur ni aucune taille de police n'est écrite à la main dans le code.
- **Police :** au plus deux familles, une police de titre avec du caractère et une police de texte calme, hébergées soi-même (woff2, `font-display: swap`). Texte de 16 à 17 px avec un interligne de 1,5, rien en dessous de 12 px. Grands titres avec un interligne de 1,0 à 1,1 et un peu plus serrés (−0,01 à −0,03 em), plus petits sur le natel avec `clamp()`. Gras (700) seulement pour les plus grands titres, sinon demi-gras (600). Prix et heures avec `font-variant-numeric: tabular-nums`.
- **Espacements** tirés d'une seule série : 4, 8, 12, 16, 24, 32, 48 px (plus grands pour les sections). Contenu large d'environ 1200 px au plus, 16 px de marge sur le natel.
- **Arrondis :** trois niveaux selon la taille (champ, carte, grande surface), toujours plus petits à l'intérieur qu'à l'extérieur. Les boutons soit tous arrondis, soit tous carrés.
- **Profondeur :** une seule méthode pour tout le site, soit une surface avec ombre, soit une fine ligne sans ombre. Ombres teintées de la couleur du texte, jamais grises, au plus deux niveaux. Le fond est légèrement chaud, les cartes sont blanches.
- **Mouvement :** appui 90 à 100 ms, transition 160 à 200 ms, un seul mouvement par événement. Avec « Réduire les animations », seulement des fondus.
- **Focus :** 2 à 3 px dans la couleur d'action, avec 2 px d'écart, au moins 3 : 1 sur chaque fond.
- **La couleur d'erreur** seulement pour les erreurs et ce qui est urgent.

### Éléments graphiques : toujours demander

Une fois la direction fixée, tu demandes toujours : « Tu veux encore des éléments graphiques en plus ? » Présente les possibilités avec l'effort qu'elles demandent :

- **Icônes :** un seul jeu, cohérent (par exemple Lucide ou Phosphor), jamais d'emoji et jamais deux jeux mélangés.
- **Illustrations :** peu nombreuses, dans le même style, pour les endroits vides et les explications.
- **Ses propres photos :** une liste de photos, ce que la personne doit photographier (le lieu, des gens en action, des détails). De vraies photos battent n'importe quelle image générée.
- **Une mascotte :** un personnage qui guide à travers le site. D'abord une planche avec quatre à six poses du même personnage, chacune pour un moment (bienvenue, recherche, succès, vide), puis des règles qui disent quand il apparaît : jamais lors d'erreurs, de refus ou de moments délicats, jamais à côté de photos de personnes, jamais derrière des listes ou des formulaires. Taille : pour la bienvenue, au plus la moitié de la largeur, sinon petit. Il est décoratif (`alt=""`), la phrase à côté tient aussi sans lui. Les clips animés ne se chargent que quand ils sont visibles, durent au plus 5 secondes, puis s'arrêtent (WCAG 2.2.2). Chaque image, tu la regardes toi-même, aussi en agrandi.
- **3D :** un objet ou le personnage en modèle 3D, seulement dans l'en-tête de la page d'accueil et seulement à partir de la largeur d'une tablette. D'abord, il y a une image fixe ; la 3D ne se charge que quand l'en-tête est visible. Sur le natel, sans carte graphique ou avec « Réduire les animations », l'image fixe reste.

Ce que la personne choisit va dans `docs/gestaltung/richtungen.md` et dans le nuancier (tailles, espacements, règles).

**Avec Albatros**, les images, les personnages détourés et les modèles 3D naissent avec les outils d'Albatros, payés avec le crédit de la personne (prix coûtant plus 35 %) :

- `bild_erzeugen` avec `beschreibung` (description) et `format` (`quadrat` carré, `quer` paysage, `hoch` portrait ou `breit` large), `bild_freistellen` avec `bild_url` (une image avec fond transparent), `modell_3d` avec `bild_url` (un modèle 3D en GLB, de préférence à partir d'une image détourée).
- `guthaben` montre le crédit, les prix et le lien pour recharger. Les prix, tu ne les donnes que d'après cette réponse.
- Avant le premier appel qui coûte quelque chose, tu appelles `guthaben`, tu donnes le prix et tu demandes une fois : « Une image coûte CHF …, ton crédit suffit pour … Je le fais ? » Ensuite, après chaque appel, tu indiques brièvement le coût et le reste, sans redemander. Si le crédit ne suffit pas, tu transmets le lien pour recharger.
- Chaque résultat, tu l'enregistres tout de suite dans le projet (`curl -o web/public/bilder/<name>.png <url>`), car après 7 jours, il a disparu. Pour une variante, tu changes la description : la même description renvoie la même image pendant 15 minutes, sans nouveaux frais.
- Chaque image générée, tu la regardes toi-même avant de la montrer à la personne. Sur le site ne va que ce qu'elle a choisi.
- Si un outil répond « kommt bald » (bientôt disponible), tu continues sans outils d'images (plus bas).

**Avec un propre compte Hugging Face**, ça marche aussi, comme alternative. La personne crée le compte elle-même et se connecte elle-même. Tu ajoutes le serveur officiel : `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. Avec Codex, c'est `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, avec Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, avec Cursor l'entrée `"huggingface": { "url": "https://huggingface.co/mcp?login" }` sous `mcpServers` dans `~/.cursor/mcp.json`. Les Spaces pour les images, le détourage et la 3D, elle les choisit sous huggingface.co/settings/mcp. Gratuitement, il y a 5 minutes de temps de calcul par jour. Sans connexion, le serveur ne propose que la recherche dans le Hub.

**Droits :** chaque modèle a une licence ; lis-la sur la page du modèle avant qu'une image n'arrive sur le site. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) et TRELLIS (MIT) permettent aussi l'usage commercial, FLUX.1 dev seulement l'usage non commercial. Les images générées ne montrent pas de vraies personnes ni de logos d'autrui. Les vrais lieux et les vraies personnes viennent de propres photos, avec leur consentement.

**Sans outils d'images**, le chemin est le même : des icônes d'un jeu libre, de propres photos, des illustrations d'une collection libre avec une licence claire, une mascotte dessinée ou plus tard, pas de 3D.

### 5. Transformation

Le contenu et les déroulements restent. D'abord la base (intégrer les tokens, les parties communes, une page modèle), puis les autres pages. S'il manque une valeur dans le nuancier, tu l'ajoutes là, pas dans le code de la page.

### 6. Photos et validation

Photographier chaque page, en largeur natel et en largeur ordinateur, en clair et en sombre. Si le site ne tourne pas encore sur Internet, tu prends l'adresse de l'aperçu (`http://localhost:4321`) :

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Regarde toi-même chaque photo et compare-la avec l'ébauche. Seulement ensuite, montre-la à la personne. Après son oui : journal de bord (skill `git-logbuch`), tapis roulant (skill `pipeline`).

## Pièges

- L'apparence avant l'utilisation : ça fige les défauts.
- Trois directions qui ne diffèrent que par la couleur : pas un vrai choix.
- Des couleurs écrites à la main dans le code : alors le mode sombre casse.
- Dire « terminé » sans avoir regardé soi-même les photos.

## Vérifier la mission

`mission_pruefen` avec `webseite-04-gestaltung`. La vérification regarde si `~/projekt/docs/gestaltung/richtungen.md` contient une décision (`Entscheid:`) et si le site répond.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « d'abord les fondations, ensuite la façade », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
