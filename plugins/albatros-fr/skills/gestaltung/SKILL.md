---
name: gestaltung
description: "Met en forme avec une personne sans connaissances préalables l'utilisation et l'apparence de son site. Dans le plan de vol (P6) : maquette grise (« L'ordre est-il juste ? »), trois directions bien différentes tirées du concept, vérification contre le look IA, tokens pour les couleurs, la police et les espacements (design/tokens.css), docs/designsystem.md et une planche d'échantillons. Pour un site existant : vérifier sous trois angles, réparer l'utilisation, directions, tokens, transformation avec photos. Toujours avec la question des éléments graphiques (icônes, photos, mascotte, 3D ; outils d'images seulement après le prix et un oui). Utilise ce skill après konzept et quand on dit « design », « système de design », « planche d'échantillons », « ça a l'air ennuyeux », « ça fait bricolé », « ça fait IA », « vibe coded », « rendre plus beau », « couleurs », « police », « redesign », « trois variantes », « ça ne fait pas professionnel », « mise en page », « icônes », « mascotte », « 3D »."
metadata:
  stand: 0.2.0
  quelle: '26d5ada41225'
---

# Mise en forme : d'abord les fondations, ensuite la façade

## L'image

Qui retape une vieille maison ne repeint pas d'abord la façade. D'abord viennent les fondations : les portes qui coincent, les escaliers sans rampe, les interrupteurs au mauvais endroit. C'est seulement quand la maison est agréable à habiter qu'on peint. De la peinture neuve sur des portes cassées ne fait qu'embellir les défauts.

Pour une maison neuve, les fondations, c'est la structure : on dessine d'abord en gris quelle pièce se trouve où. Ensuite seulement, on pose les échantillons de matériaux côte à côte sur une **planche d'échantillons** : couleurs, polices, boutons et champs, comme on regarde le carrelage et le bois avant de commander. Ce qui est juste sur la planche d'échantillons est juste dans chaque pièce.

Pour la façade, il y a un **nuancier** : une petite collection de couleurs, de polices et d'espacements fixes. Tout dans la maison est peint uniquement avec. Le mot technique pour ça, ce sont les **tokens**.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Deux chemins à travers ce skill

- **Nouveau site dans le plan de vol (P6) :** Il y a `docs/konzept.md` de P5, et rien n'est encore construit. Tu suis la section « De la maquette à la planche d'échantillons ».
- **Retravailler un site existant :** Le site est déjà construit ou en ligne, et la personne trouve qu'il est difficile à utiliser ou qu'il n'est pas beau (« ça fait bricolé », « rendre plus beau », « d'autres couleurs »). Tu suis la section « Retravailler un site existant ». Si le site est déjà en ligne, une ébauche des pages modifiées avec autorisation de construire vient avant la transformation (skills `entwurf` et `webseite-aendern`).

Pour les deux valent les sections « Trois directions », « Ne pas avoir l'air fait par une IA », « Le nuancier (tokens) » et « Éléments graphiques ».

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Ta première réponse, c'est toujours l'image et le chemin en cinq étapes : dans le plan de vol, maquette, trois directions, choix, nuancier, planche d'échantillons ; pour un site existant, vérifier, réparer l'utilisation, choisir entre trois directions bien différentes, fixer le nuancier, transformer. Si la personne veut « plus beau » ou « d'autres couleurs », c'est pareil. Où se trouve le site et comment tu y accèdes, tu ne le demandes qu'après.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées `[Annahme: …]`. Les marques `[Annahme: …]` et `[offen: …]` restent en allemand, comme les noms des lignes dans `docs/` : c'est à elles que `lage` reconnaît ce qui est supposé ou encore ouvert. Demande ce qui manque seulement à la fin.
- Tutoiement, court. Au plus deux questions par message. Chaque critique a besoin d'une preuve : quelle page, quel endroit, idéalement une photo. « Ça fait agité » tout seul ne compte pas.
- Les goûts, c'est la personne qui décide. Tu proposes des directions et tu dis honnêtement ce que chacune sait faire et quel est son risque.
- Les exigences propres de la personne (logo, couleur maison, forme d'adresse, textes obligatoires) passent avant tout conseil de mise en forme. Dans le plan de vol, elles figurent dans `docs/konzept.md` sous `Muss bleiben:`.
- Ce que la personne doit voir (maquette, directions, planche d'échantillons, photos), tu l'ouvres toi-même dans le navigateur : `open <fichier>` (Linux `xdg-open`, Windows `start`). Donner seulement le nom du fichier ne suffit pas.
- Rien n'est publié avant que la personne ait vu les photos et dit oui.

## De la maquette à la planche d'échantillons (plan de vol P6)

Phase P6 « Système de design avec exemple ». C'est son tour quand `docs/konzept.md` a les sept lignes (P5, skill `konzept`) ; s'il manque, tu vas d'abord là-bas. Ensuite vient P7, tout le site en ébauche à parcourir en cliquant (skill `entwurf`).

- **Résultat :** `design/mockup.html`, `design/richtungen/*.html`, `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` et `docs/designsystem.md` avec les lignes `Reihenfolge:`, `Richtung:`, `Musterblatt:`, `Farben:`, `Schriften:`, `Abstände:`, `Komponenten:` et `Maskottchen:`. Les noms de fichiers et de lignes restent en allemand, parce que `lage` et les scripts de vérification les lisent ; le contenu est en français.
- **Réussi quand** `tokens.css` et `musterblatt.html` sont là, que la planche d'échantillons n'utilise les couleurs, les polices et les tailles que comme `var(--…)` tirées de `tokens.css` et que la personne l'a vue (`Musterblatt: gesehen am …`).
- **Questions à la personne :** « L'ordre dans la maquette grise est-il juste ? », « Laquelle des trois directions, ou quel mélange ? », « La planche d'échantillons convient-elle : couleurs, polices, boutons, champs, cartes et en-tête sur le natel ? » et la question des éléments graphiques. Chacune des trois réponses a sa propre ligne (`Reihenfolge:`, `Richtung:`, `Musterblatt:`). Pas d'hypothèse ici : tant que la personne n'a pas répondu, il y a `[offen: …]`. « Aussi une version sombre ? », tu la proposes comme `[Annahme: oui, claire et sombre]`, parce que beaucoup de natels affichent en sombre la nuit.
- **Île :** `mockup` dès que l'ordre est juste ; `entwuerfe` dès que la personne a vu la planche d'échantillons et qu'elle lui convient.

**Mode :** Lis `Modus:` dans `docs/projekt.md` (si la ligne manque, c'est `machen`, faire, qui vaut). Le moment d'apprentissage de cette phase, c'est « Pourquoi les couleurs et les polices ne sont qu'à un seul endroit » : la personne change elle-même une couleur dans `design/tokens.css`, recharge la planche d'échantillons et voit qu'elle change partout. En mode `lernen` (apprendre), elle le fait elle-même (ensuite `verstanden_melden` avec `mission: flugschule-19-musterblatt` et `art: selbst`), et à la fin, tu poses les questions de contrôle de la leçon `flugschule-19-musterblatt` (`mission_holen`), par exemple « Pourquoi les couleurs et les polices ne sont-elles qu'à un seul endroit ? » Seulement après sa réponse, tu annonces `art: kontrollfrage`. En mode `machen` (faire), tu proposes le moment d'apprentissage et tu expliques chaque étape en une phrase avec son image. Si l'outil `verstanden_melden` manque, on continue sans.

### 1. La maquette à partir de l'esquisse (`schritt: mockup`)

L'esquisse grise de la page d'accueil de P1 se trouve dans `design/skizze.html`. Tu en fais `design/mockup.html` : la page d'accueil de haut en bas (sur le parcours entreprise comme dans `docs/plan.md` sous « Startseite von oben nach unten ») et la sous-page la plus importante, les deux dans un seul fichier. Si l'esquisse manque, tu prends `docs/plan.md`.

- Seulement des tons de gris et la police du système, pas d'images : des surfaces grises avec une légende qui dit ce qui viendra là (« Photo : la répétition au collège »).
- De vrais titres et de vraies phrases tirés de `docs/projekt.md`, `docs/plan.md` et `docs/konzept.md` (nom, cœur), le bouton principal avec son vrai texte (« Demander une place »), le menu avec toutes les pages de `Seiten:`.
- Un seul fichier sans liens vers Internet ; il s'ouvre d'un double-clic.

Ouvre-le et demande seulement : « L'ordre dans la maquette grise est-il juste ? » Pourquoi : la structure avant l'apparence. Change jusqu'à ce qu'il soit juste. Ensuite, tu crées `docs/designsystem.md` (modèle à l'étape 4) avec `Reihenfolge: bestätigt am <JJ.MM.AAAA>`, `Richtung: [offen: choix de la direction]`, `Musterblatt: [offen: vient après l'avoir montrée]` et les autres lignes avec `[offen: …]`, et tu annonces `mockup` (section « L'île »).

### 2. Trois directions sur la maquette

Maintenant, le caractère entre en jeu. Lis dans `docs/konzept.md` les trois mots sous `Charakter:`, le ton, le langage visuel et ce qui doit rester, dans `docs/recherche.md` les modèles. Tu en tires trois directions bien différentes selon la section « Trois directions » : chaque fois un fichier `design/richtungen/<nom>.html` (par exemple `doux.html`, `clair.html`, `vif.html`) avec exactement le contenu et l'ordre de la maquette.

- En haut de chaque fichier, un petit encadré : l'idée, lequel des trois mots elle met en avant, les polices, le rôle de la couleur, les formes, la profondeur, la force et le risque.
- Chaque direction a ses propres valeurs provisoires dans un `<style>` en haut du fichier. C'est permis, car c'est seulement après le choix que naît le nuancier comme source unique.
- Si un personnage en fait partie (`Maskottchen: ja`), il figure dans chaque direction à l'endroit où il apparaît, en image ou en esquisse tirée de `design/figur/`.

### 3. Vérification contre le look IA et choix

Regarde chaque direction dans le navigateur, en largeur natel et en largeur ordinateur, et vérifie-la avec la liste de la section « Ne pas avoir l'air fait par une IA ». Ce que tu trouves, tu le corriges avant que la personne voie les directions. Écris le résultat dans `docs/designsystem.md` sous `## Richtung` : `Signes d'IA vérifiés : doux ok, clair ok, vif : cartes de même taille, transformé`.

Ouvre les trois et demande : « Laquelle des trois directions, ou quel mélange ? » Pourquoi : trois directions clairement différentes montrent ce qui est possible. Dans le même message ou juste après vient la question des éléments graphiques (section « Éléments graphiques »). Le choix va dans la ligne `Richtung:`, par exemple `Richtung: clair, avec les couleurs de doux`.

### 4. Nuancier, composants et système de design

De la direction choisie naissent les échantillons de matériaux pour toute la maison :

- **`design/tokens.css` :** le nuancier, la source unique des couleurs (claires et sombres), des polices, des tailles de police, des espacements, des arrondis et des ombres, avec les contrastes en commentaire (section « Le nuancier (tokens) »).
- **`design/komponenten.css` :** les parties communes, seulement avec `var(--…)` : bouton (normal, focus, désactivé), lien, champ avec libellé, aide et erreur, message de confirmation et d'erreur, carte, en-tête avec menu, pied de page avec mentions légales et protection des données. L'en-tête s'oriente sur sa propre largeur (requête de conteneur `@container`) plutôt que sur la largeur de la fenêtre ; ainsi la planche d'échantillons le montre aussi dans un cadre de 390 px de large, comme sur le natel. La planche d'échantillons et l'ébauche utilisent le même fichier.
- **`docs/designsystem.md` :** lisible pour des humains, sur une page. Chaque ligne commence au début de la ligne par son nom en allemand et reste courte (300 caractères au plus), parce que `lage` lit ces lignes :

```markdown
# Système de design : <nom>
Stand: <JJ.MM.AAAA>

Reihenfolge: bestätigt am <JJ.MM.AAAA>
Richtung: <nom de la direction ou du mélange>
Musterblatt: [offen: vient après l'avoir montrée]
Farben: <couleur d'action, fond, texte, erreur> ; claire et sombre ; contrastes dans design/tokens.css
Schriften: <police de titre> et <police de texte> ; texte 17 px, titres <tailles>
Abstände: 4, 8, 12, 16, 24, 32, 48 px ; contenu 1200 px au plus ; arrondis <…> ; profondeur : <ombre ou ligne>
Komponenten: bouton, lien, champ, message, carte, en-tête avec menu, pied de page (design/komponenten.css)
Maskottchen: <ja – personnage, poses, quand il apparaît | nein | später>

## Direction
Traits : <les trois mots> · idée : … · signes d'IA vérifiés : …

## Couleurs
| Token | Rôle | clair | sombre | Contraste |
|---|---|---|---|---|

## Composants
| Composant | Rôle | Tokens |
|---|---|---|

## Mots
Un mot par chose, le même sur le site, dans le mail et dans l'administration : demande (pas réservation), …

## Éléments graphiques
Icônes : … · illustrations : … · photos : liste de photos dans docs/inhalte.md · personnage : … · 3D : …
```

Les débuts de ces lignes sont fixes et restent en allemand, parce que `lage` et le skill `entwurf` les lisent : après `Reihenfolge:` vient `bestätigt am` avec la date. Après `Musterblatt:` vient `[offen: vient après l'avoir montrée]` jusqu'au oui de la personne, puis `gesehen am <JJ.MM.AAAA>, passt` (étape 5). Après `Maskottchen:` vient d'abord `ja`, `nein` ou `später`, comme dans `docs/konzept.md`.

### 5. La planche d'échantillons

`design/musterblatt.html` n'intègre que `tokens.css` et `komponenten.css` et montre sur une seule page :

- chaque couleur en surface avec son nom, son rôle et son contraste, claire et sombre côte à côte ;
- les tailles de police de la plus grande à la plus petite, avec de vraies phrases du projet ;
- les espacements en série et les arrondis ;
- le bouton normal, avec le focus et désactivé (avec la raison à côté) ;
- un champ avec libellé, aide et une erreur en mots ;
- une carte et un message de confirmation et d'erreur ;
- l'en-tête avec menu dans un cadre de 390 px de large et en pleine largeur ;
- les éléments graphiques : des icônes du jeu choisi, le personnage dans ses poses ou en esquisse, une photo ou la surface où elle viendra.

Dans la planche d'échantillons, les couleurs, les polices et les tailles ne figurent que comme `var(--…)`. Vérifie-le des yeux dans le code ; si Node est déjà là, `node <dossier du skill entwurf>/entwurf-pruefen.mjs --nur farbfaecher` le mesure et recalcule au passage chaque commentaire de contraste (dossier inconnu : `curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs`).

Ouvre la planche d'échantillons et montre à la personne comment la voir sur le natel : rendre la fenêtre du navigateur toute étroite ou utiliser la vue natel du navigateur (Firefox et Chrome : `Ctrl+Shift+M`, sur Mac dans Firefox `Cmd+Opt+M`, dans Chrome d'abord `F12`). Puis demande : « La planche d'échantillons convient-elle : couleurs, polices, boutons, champs, cartes et en-tête sur le natel ? » Pourquoi : ce qui est juste sur la planche d'échantillons est juste sur chaque page. Les changements, tu les fais dans `tokens.css` ou `komponenten.css`, jamais dans la planche elle-même. Après son oui, tu écris dans `docs/designsystem.md` la ligne `Musterblatt: gesehen am <JJ.MM.AAAA>, passt` (à la place de `[offen: …]`), par exemple `Musterblatt: gesehen am 31.10.2026, passt`, tu remplis les autres lignes et tu annonces `entwuerfe`.

### L'île

Après l'étape 1, tu appelles l'outil `schritt_melden` avec `schritt: mockup` et `sprache: fr`, après l'étape 5 avec `schritt: entwuerfe`. `projekt`, tu le laisses de côté, sauf si la personne travaille à un autre projet qui se trouve seulement sur son ordinateur ; tu donnes alors son nom court. Dis-lui en une phrase que sa maison a grandi sur l'île. Si l'outil répond « Ungültige Angaben » (données non valables), vérifie une fois l'orthographe ; s'il manque, on continue sans l'île. Ensuite, tu appelles à nouveau `lage` (skill `lotse`).

## Trois directions

1. **Le caractère avant les couleurs.** Dans le plan de vol, les traits figurent déjà dans `docs/konzept.md` (`Charakter:`). Sinon, demande des traits de caractère, pas des couleurs préférées : propose des paires d'opposés au choix, adaptées au site : traditionnel ou sportif, village de montagne ou ville, calme ou vivant, raffiné ou terre à terre, pour les hôtes ou pour les membres. En plus, une question : quels trois mots les visiteurs doivent-ils se dire après dix secondes ? Chacune des trois directions met en avant d'autres de ces traits. Les couleurs en découlent, ainsi que du logo et de l'environnement, jamais l'inverse.
2. **Modèles :** regarder les deux ou trois sites de la recherche ou du plan. Qu'est-ce qu'ils font bien ? Qu'est-ce qu'on ne reprend pas (leur logo, leurs couleurs, leur police) ?
3. **Diagnostic** (pour un site existant) : Pourquoi l'apparence actuelle ne tient-elle pas ? Typique : tous les titres aussi forts, deux styles côte à côte, une couleur avec plusieurs significations, des espacements qui changent.
4. **Trois directions bien différentes**, pas seulement trois couleurs. Elles se distinguent par l'idée, la police, le rôle de la couleur, les formes et la profondeur. Exemple : « Doux » (chaleureux, arrondi), « Clair » (calme comme un journal), « Vif » (aplats de couleur, grands titres).
5. Chaque direction montre **les mêmes pages** avec de vrais textes : dans le plan de vol la maquette, pour un site existant deux ou trois pages (accueil, sous-page la plus importante, contact). Un texte de remplissage fausse le jugement.
6. Identique dans toutes les directions : logo, textes obligatoires, un bouton principal par page, accessibilité.

## Ne pas avoir l'air fait par une IA

Les sites faits par une IA se reconnaissent aux mêmes signes. Vérifie chaque direction et le site terminé avec cette liste et note le résultat (dans le plan de vol dans `docs/designsystem.md`, sinon dans `docs/gestaltung/richtungen.md`, ligne `Signes d'IA vérifiés : …`) :

- Des dégradés de violet et de bleu, des effets de lueur et de verre.
- Des emoji comme icônes.
- Inter ou une autre police standard partout, tous les titres aussi forts.
- Un en-tête centré : titre, phrase et bouton au milieu d'une surface de couleur ou devant une tache de couleur, avec un ou deux boutons.
- Des cartes de même taille côte à côte ou les unes sous les autres, peu importe qu'elles aient une icône, des coins arrondis ou droits. C'est le signe d'IA le plus fréquent : range le contenu selon son importance, pas dans des cases identiques.
- Le look banque d'images : des gens souriants devant un ordinateur portable, des montagnes de n'importe où.
- Des formules creuses : « Bienvenue sur notre site web », « Découvrez », « Votre partenaire pour », « avec passion », « innovant », « sans couture ».
- Des chiffres, des avis, des citations ou des logos de clients inventés. Des promesses de temps comme « en 60 secondes ».
- Des ombres grises, deux sortes de profondeur côte à côte (une ombre ici, une bordure là), des jeux d'icônes mélangés.
- Plus de six sections sur la page d'accueil.

Vérifie le motif, pas la formulation : un bouton au lieu de deux ou des cartes les unes sous les autres au lieu de côte à côte, c'est le même signe. Pour cela, tu regardes les pages ou les photos, pas seulement le code.

À la place : un seul signe distinctif, utilisé avec parcimonie (un trait sous un mot du titre, un surligneur pour au plus un mot par section), de vraies photos du lieu et des gens, une police avec du caractère, adaptée aux traits choisis, des couleurs tirées du logo et de l'environnement, une structure qui vient du contenu (si les dates sont l'essentiel, elles sont en haut) et des phrases concrètes avec des noms, des chiffres et des lieux. Dans le code, tu trouves les dégradés et les polices standard avec `grep -rnE "linear-gradient|radial-gradient|Inter" design src`. Les emoji et les formules creuses, tu les cherches dans les textes, le reste avec les yeux.

## Le nuancier (tokens)

Un fichier `tokens.css` avec des variables CSS : couleurs pour clair et sombre, polices, tailles de police, espacements, arrondis et ombres. Il se trouve dans `design/tokens.css`, même quand le site est construit : la mise en page l'intègre à cet endroit (skill `webseite-bauen`), il n'y en a pas de copie sous `web/`. Pour chaque bloc, une phrase de commentaire qui dit pourquoi. Règles :

- Une couleur d'action pour tout ce qui est cliquable, et nulle part ailleurs.
- Recalculer le contraste, ne pas l'estimer : texte au moins 4,5 : 1, boutons et bordures au moins 3 : 1 (formule dans le skill `barrierefreiheit`). Les couleurs en hexadécimal (`#1d1b18`), le contraste en commentaire sur la même ligne, toujours avec la couleur d'en face : `/* 16,0 : 1 sur --hell-grund */`. Ainsi, on peut le recalculer ; `entwurf-pruefen.mjs` (skill `entwurf`) le fait pour chaque commentaire.
- Chaque couleur figure une seule fois, dans une palette claire et une palette sombre. Les pages n'utilisent que des noms comme `--farbe-text` ; le mode sombre n'échange que cette correspondance (`@media (prefers-color-scheme: dark)`). Les noms des tokens restent en allemand, comme dans l'exemple.
- En dehors de `tokens.css`, aucune couleur, aucune police, aucune taille de police, aucun espacement, aucun arrondi et aucune ombre n'est écrit à la main dans le code. Les largeurs d'écran dans `@media` peuvent être des nombres.
- **Police :** au plus deux familles, une police de titre avec du caractère et une police de texte calme, sous licence libre (par exemple SIL Open Font License) et hébergées soi-même (woff2, `font-display: swap` ; dans le plan de vol dans `design/schriften/`, source et licence en commentaire). Jamais chargées depuis des serveurs étrangers, ça trahit les visiteurs à des tiers. Texte de 16 à 17 px avec un interligne de 1,5, rien en dessous de 12 px. Grands titres avec un interligne de 1,0 à 1,1 et un peu plus serrés (−0,01 à −0,03 em), plus petits sur le natel avec `clamp()`. Gras (700) seulement pour les plus grands titres, sinon demi-gras (600). Prix et heures avec `font-variant-numeric: tabular-nums`.
- **Espacements** tirés d'une seule série : 4, 8, 12, 16, 24, 32, 48 px (plus grands pour les sections). Contenu large d'environ 1200 px au plus, 16 px de marge sur le natel. Sur l'ordinateur, l'en-tête et les sections utilisent cette largeur, seul le texte courant reste étroit (environ 70 caractères par ligne).
- **Arrondis :** trois niveaux selon la taille (champ, carte, grande surface), toujours plus petits à l'intérieur qu'à l'extérieur. Les boutons soit tous arrondis, soit tous carrés.
- **Profondeur :** une seule méthode pour tout le site, soit une surface avec ombre, soit une fine ligne sans ombre. Ombres teintées de la couleur du texte, jamais grises, au plus deux niveaux. Le fond est légèrement chaud, les cartes sont blanches.
- **Mouvement :** appui 90 à 100 ms, transition 160 à 200 ms, un seul mouvement par événement. Avec « Réduire les animations », seulement des fondus.
- **Focus :** 2 à 3 px dans la couleur d'action, avec 2 px d'écart, au moins 3 : 1 sur chaque fond.
- **La couleur d'erreur** seulement pour les erreurs et ce qui est urgent.

Voici comment commence un `tokens.css` (les contrastes de ces couleurs sont recalculés) :

```css
/* Nuancier de <nom> : la source unique des couleurs, polices, tailles, espacements, arrondis et ombres. */
:root {
  /* Palette : chaque couleur une fois, avec son contraste (texte au moins 4,5 : 1, boutons et bordures 3 : 1) */
  --hell-grund: #faf7f2;      /* légèrement chaud */
  --hell-text: #1d1b18;       /* 16,0 : 1 sur --hell-grund */
  --hell-aktion: #0b5c8c;     /* 6,7 : 1 sur --hell-grund, seulement pour ce qui est cliquable */
  --hell-auf-aktion: #ffffff; /* 7,1 : 1 sur --hell-aktion */
  --hell-rand: #8a8378;       /* 3,5 : 1 sur --hell-grund */
  --dunkel-grund: #171614;
  --dunkel-text: #f1ece4;     /* 15,3 : 1 sur --dunkel-grund */
  --dunkel-aktion: #7cc4f0;   /* 9,4 : 1 sur --dunkel-grund */

  /* Ce que les pages utilisent ; le mode sombre n'échange que ces lignes */
  --farbe-grund: var(--hell-grund);
  --farbe-text: var(--hell-text);
  --farbe-aktion: var(--hell-aktion);

  /* Polices, tailles, espacements, arrondis, ombres */
  --schrift-titel: "<police de titre>", Georgia, serif;
  --groesse-text: 1.0625rem;  /* 17 px */
  --abstand-4: 16px;
  --rund-klein: 6px;
  --schatten-1: 0 1px 2px rgb(29 27 24 / 0.08);
}
@media (prefers-color-scheme: dark) {
  :root { --farbe-grund: var(--dunkel-grund); --farbe-text: var(--dunkel-text); --farbe-aktion: var(--dunkel-aktion); }
}
```

## Éléments graphiques (Gestaltungselemente) : toujours demander

Une fois la direction fixée, tu demandes toujours : « Tu veux encore des éléments graphiques en plus ? » Présente les possibilités avec l'effort qu'elles demandent. Ce qui est déjà décidé dans le plan de vol (`Bildsprache:` et `Maskottchen:` dans `docs/konzept.md`), tu ne le redemandes pas, tu t'appuies dessus.

- **Icônes :** un seul jeu, cohérent (par exemple Lucide ou Phosphor), jamais d'emoji et jamais deux jeux mélangés.
- **Illustrations :** peu nombreuses, dans le même style, pour les endroits vides et les explications.
- **Ses propres photos :** une liste de photos, ce que la personne doit photographier (le lieu, des gens en action, des détails), dans le plan de vol dans `docs/inhalte.md`. De vraies photos battent n'importe quelle image générée.
- **Une mascotte :** un personnage qui guide à travers le site. D'abord une planche avec quatre à six poses du même personnage, chacune pour un moment (bienvenue, recherche, succès, vide), puis des règles qui disent quand il apparaît : jamais lors d'erreurs, de refus ou de moments délicats, jamais à côté de photos de personnes, jamais derrière des listes ou des formulaires. Taille : pour la bienvenue, au plus la moitié de la largeur, sinon petit. Il est décoratif (`alt=""`), la phrase à côté tient aussi sans lui. Les clips animés ne se chargent que quand ils sont visibles, durent au plus 5 secondes, puis s'arrêtent (WCAG 2.2.2). Chaque image, tu la regardes toi-même, aussi en agrandi. Sans crédit, les poses restent des esquisses jusqu'à la validation du site (P10).
- **3D :** un objet ou le personnage en modèle 3D, seulement dans l'en-tête de la page d'accueil et seulement à partir de la largeur d'une tablette. D'abord, il y a une image fixe ; la 3D ne se charge que quand l'en-tête est visible. Sur le natel, sans carte graphique ou avec « Réduire les animations », l'image fixe reste.

**Sobre ne veut pas dire sans image.** Si la personne ne veut ni icônes, ni illustrations, ni personnage, tu proposes quand même une vraie photo pour l'en-tête de la page d'accueil (le lieu, des gens en action) et tu lui donnes la liste de photos. Une photo, c'est du contenu, pas de la décoration. Si elle n'en a pas encore, l'en-tête porte l'essentiel du contenu au lieu d'une surface de couleur avec un titre (par exemple la prochaine date en grand), et la liste de photos figure sous « Ouvert » (dans le plan de vol dans `docs/inhalte.md`, sinon dans `docs/gestaltung/richtungen.md`). Si elle ne veut pas non plus de photos, sa phrase y figure.

Ce que la personne choisit va dans le système de design (`docs/designsystem.md`) et dans le nuancier (tailles, espacements, règles).

**Avec Albatros**, les images, les personnages détourés et les modèles 3D naissent avec les outils d'Albatros, payés avec le crédit de la personne (prix coûtant plus 35 %) :

- `bild_erzeugen` avec `beschreibung` (description) et `format` (`quadrat` carré, `quer` paysage, `hoch` portrait ou `breit` large), `bild_freistellen` avec `bild_url` (une image avec fond transparent), `modell_3d` avec `bild_url` (un modèle 3D en GLB, de préférence à partir d'une image détourée).
- `guthaben` montre le crédit, les prix et le lien pour recharger. Les prix, tu ne les donnes que d'après cette réponse.
- Avant le premier appel qui coûte quelque chose, tu appelles `guthaben`, tu donnes le prix et tu demandes une fois : « Une image coûte CHF …, ton crédit suffit pour … Je le fais ? » Ensuite, après chaque appel, tu indiques brièvement le coût et le reste, sans redemander. Si le crédit ne suffit pas, tu transmets le lien pour recharger.
- Chaque résultat, tu l'enregistres tout de suite dans le projet (dans le plan de vol `curl -o design/bilder/<nom>.png <url>`, pour un site construit dans `web/public/bilder/`), car après 7 jours, il a disparu. Pour une variante, tu changes la description : la même description renvoie la même image pendant 15 minutes, sans nouveaux frais.
- Chaque image générée, tu la regardes toi-même avant de la montrer à la personne. Sur le site ne va que ce qu'elle a choisi.
- Si un outil répond « kommt bald » (bientôt disponible), tu continues sans outils d'images (plus bas).

**Avec un propre compte Hugging Face**, ça marche aussi, comme alternative. La personne crée le compte elle-même et se connecte elle-même. Tu ajoutes le serveur officiel : `claude mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`. Avec Codex, c'est `codex mcp add huggingface --url "https://huggingface.co/mcp?login"`, avec Gemini CLI `gemini mcp add --transport http -s user huggingface "https://huggingface.co/mcp?login"`, avec Cursor l'entrée `"huggingface": { "url": "https://huggingface.co/mcp?login" }` sous `mcpServers` dans `~/.cursor/mcp.json`. Les Spaces pour les images, le détourage et la 3D, elle les choisit sous huggingface.co/settings/mcp. Gratuitement, il y a 5 minutes de temps de calcul par jour. Sans connexion, le serveur ne propose que la recherche dans le Hub.

**Droits :** chaque modèle a une licence ; lis-la sur la page du modèle avant qu'une image n'arrive sur le site. FLUX.1 schnell (Apache 2.0), BiRefNet (MIT) et TRELLIS (MIT) permettent aussi l'usage commercial, FLUX.1 dev seulement l'usage non commercial. Les images générées ne montrent pas de vraies personnes ni de logos d'autrui. Les vrais lieux et les vraies personnes viennent de propres photos, avec leur consentement.

**Sans outils d'images**, le chemin est le même : des icônes d'un jeu libre, de propres photos, des illustrations d'une collection libre avec une licence claire, une mascotte dessinée ou plus tard, pas de 3D.

## Retravailler un site existant

Si tu ne vois pas encore le site (pas de projet dans le dossier, pas d'adresse), explique d'abord tout le chemin en cinq étapes courtes : vérifier, réparer l'utilisation, choisir entre trois directions bien différentes, fixer le nuancier, transformer. Seulement ensuite, tu demandes où se trouve le site.

### 0. Cadre (5 minutes)

Reprendre de `docs/projekt.md` et de `docs/plan.md` (skill `webseite-planen`) : pour qui (`Für wen:`), la chose principale pour les visiteurs (`Hauptsache:`), les pages (`Seiten:`). En plus, demander : qu'est-ce qui doit rester (logo, couleur, police, textes) ? Crée `docs/gestaltung/`.

### 1. Vérifier sous trois angles (seulement lire, ne rien changer)

Parcours le site l'une après l'autre avec trois paires de lunettes. Pour chaque constat, une ligne de tableau dans `docs/gestaltung/pruefung.md` :

| ID | Page et endroit | Ce qui se passe, pour qui, pourquoi c'est mauvais | Preuve | Gravité | Proposition (nouveau texte mot pour mot ou nouveau comportement) |
|---|---|---|---|---|---|

- **Déroulements (DE) :** Jouer la chose principale du début à la fin. Combien d'étapes ? La réponse est-elle visible dès le premier écran ? Y a-t-il des culs-de-sac ? Est-il clair qui est derrière et combien ça coûte ?
- **Accès (AC) :** la liste de contrôle du skill `barrierefreiheit` (contraste, clavier, descriptions d'images, formulaires, natel).
- **États et langage (EL) :** Que voit-on pendant le chargement, avec un formulaire vide, en cas d'erreur, après l'envoi ? Les mêmes mots pour les mêmes choses ? Les boutons disent-ils le résultat (« Demander une place » plutôt que « Envoyer ») ?

Gravité : **critique** (la chose principale ne marche pas ou la loi est violée), **haute** (mène souvent à des erreurs ou à un abandon), **moyenne**, **basse**. Pour un petit site, 10 à 15 constats prouvés suffisent. La même erreur à beaucoup d'endroits, c'est un seul constat avec une liste des endroits. À la fin : ce qui est bien et doit rester.

### 2. Décider et réparer les fondations

Présente à la personne, regroupé, ce qu'elle doit décider (avec ta recommandation), pas un point après l'autre. Ensuite réparer : d'abord les parties communes (bouton, champ de formulaire, message d'erreur, confirmation), puis les pages. Les couleurs et les polices restent telles quelles à cette étape.

- **Bouton principal :** environ 56 px de haut, police de 17 px, demi-gras. Le deuxième bouton est blanc avec une bordure, les liens sont soulignés.
- **Désactivé** n'est jamais invisible : 40 % d'opacité, et à côté, on lit pourquoi.
- **Champs :** 48 à 52 px de haut, le libellé est au-dessus (jamais seulement un texte indicatif dans le champ), l'aide ou l'erreur en dessous, avec un mot et pas seulement avec une couleur.
- **États** (libre, complet, confirmé) toujours sous forme de mot et de forme, jamais seulement de couleur.
- **Menu sur le natel :** à 390 px, il tient sur une ligne, sinon il devient un bouton « Menu » qui déplie la liste (sans JavaScript avec `<details>`). Un élément de menu seul sur une deuxième ligne est une erreur.

### 3. Trois directions

Selon la section « Trois directions », avec deux ou trois pages du site existant. `docs/gestaltung/richtungen.md` : tout en haut la ligne `Entscheid: <direction ou mélange> (<date>)`, en dessous le diagnostic et, pour chaque direction, un tableau (idée, police, couleurs, formes, force, risque), plus la ligne `Signes d'IA vérifiés : …`. Le mot `Entscheid:` (décision) reste en allemand. Les directions en fichiers HTML dans `design/richtungen/`, comme dans le plan de vol, pour que la personne puisse les ouvrir dans son navigateur web.

### 4. Le nuancier

Selon la section « Le nuancier (tokens) », dans `design/tokens.css`, avec `docs/designsystem.md` comme dans le plan de vol (étape 4 plus haut) ; c'est sur eux que le skill `webseite-aendern` construit plus tard. Si un site plus ancien a encore ses tokens dans `web/src/styles/tokens.css`, tu les déménages à cette occasion : la mise en page n'intègre plus que `design/tokens.css`, l'ancien fichier disparaît. Avec la question des éléments graphiques (section « Éléments graphiques »).

### 5. Transformation

Le contenu et les déroulements restent. D'abord la base (intégrer les tokens, les parties communes, une page modèle), puis les autres pages. S'il manque une valeur dans le nuancier, tu l'ajoutes là, pas dans le code de la page. Si le site est déjà en ligne, tu montres d'abord les pages modifiées en ébauche et tu demandes l'autorisation de construire (skill `entwurf`), ensuite c'est le skill `webseite-aendern` qui vaut.

### 6. Photos et validation

Photographier chaque page, en largeur natel et en largeur ordinateur, en clair et en sombre. Si le site ne tourne pas encore sur Internet, tu prends l'adresse de l'aperçu (`http://localhost:4321`) :

```bash
npx playwright screenshot --viewport-size=375,812 --full-page https://{name}.aufwind.sh docs/gestaltung/fotos/start-375.png
npx playwright screenshot --viewport-size=1440,900 --full-page --color-scheme=dark https://{name}.aufwind.sh docs/gestaltung/fotos/start-1440-dunkel.png
```

Regarde toi-même chaque photo et compare-la avec l'ébauche : sur le natel, le texte a-t-il de l'air à gauche et à droite ? Rien n'est coupé ni décalé ? Le menu tient-il sur une ligne ? L'ordinateur ne paraît-il pas vide, avec une colonne étroite au milieu ? Seulement ensuite, montre-la à la personne. Après son oui : journal de bord (skill `git-logbuch`), tapis roulant (skill `pipeline`).

## Pièges

- L'apparence avant l'utilisation ou avant la structure : ça fige les défauts.
- Trois directions qui ne diffèrent que par la couleur : pas un vrai choix.
- Des couleurs écrites à la main dans le code ou dans la planche d'échantillons : alors le mode sombre casse, et la planche montre autre chose que les pages.
- Des contrastes estimés au lieu d'être recalculés.
- La planche d'échantillons montrée seulement sur l'ordinateur : l'en-tête avec menu sur le natel en fait partie.
- Dire « terminé » sans avoir regardé soi-même les pages ou les photos.

## Vérifier la mission

`mission_pruefen` avec `flugschule-19-musterblatt`. La vérification regarde si le projet est au moins à l'étape « Ébauches » sur l'île ; dans le plan de vol, tu ne l'annonces que quand la personne a vu la planche d'échantillons. Sur le parcours site web, il y a en plus la mission facultative `webseite-04-gestaltung` (éléments graphiques) : si la personne a choisi des éléments graphiques, tu la vérifies aussi avec `mission_pruefen`.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « d'abord les fondations, ensuite la façade », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite ; dans le plan de vol, c'est P7, tout le site en ébauche à parcourir en cliquant (skill `entwurf`).
