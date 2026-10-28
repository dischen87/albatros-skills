---
name: gestaltung
description: "Retravaille l'utilisation et l'apparence d'un petit site web avec une personne sans connaissances préalables, étape par étape avec son IA. D'abord vérifier sous trois angles (déroulements, accès, états et langage), puis réparer l'utilisation, puis trois directions bien différentes au choix, des valeurs fixes pour les couleurs, la police et les espacements (tokens) et la transformation de toutes les pages, avec des photos en largeur natel et ordinateur. Utilise ce skill quand on dit « design », « ça a l'air ennuyeux », « ça fait bricolé », « rendre plus beau », « couleurs », « police », « redesign », « trois variantes », « ça ne fait pas professionnel », « mise en page », « layout »."
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

### 3. Trois directions

1. **Modèles :** regarder les deux ou trois sites du plan. Qu'est-ce qu'ils font bien ? Qu'est-ce qu'on ne reprend pas (leur logo, leurs couleurs, leur police) ?
2. **Diagnostic :** Pourquoi l'apparence actuelle ne tient-elle pas ? Typique : tous les titres aussi forts, deux styles côte à côte, une couleur avec plusieurs significations, des espacements qui changent.
3. **Trois directions bien différentes**, pas seulement trois couleurs. Elles se distinguent par l'idée, la police, le rôle de la couleur, les formes et la profondeur. Exemple : « Doux » (chaleureux, arrondi), « Clair » (calme comme un journal), « Vif » (aplats de couleur, grands titres).
4. Chaque direction montre **les mêmes deux ou trois pages** (accueil, sous-page la plus importante, contact) avec de vrais textes. Un texte de remplissage fausse le jugement.
5. Identique dans toutes les directions : logo, textes obligatoires, un bouton principal par page, accessibilité.

`docs/gestaltung/richtungen.md` : tout en haut la ligne `Entscheid: <direction ou mélange> (<date>)`, en dessous le diagnostic et, pour chaque direction, un tableau (idée, police, couleurs, formes, force, risque). Le mot `Entscheid:` (décision) reste en allemand, c'est lui que la vérification de la mission cherche. Les ébauches en fichiers HTML dans `docs/gestaltung/entwuerfe/`, pour que la personne puisse les ouvrir dans son navigateur web.

### 4. Le nuancier (tokens)

Un fichier `tokens.css` avec des variables CSS : couleurs pour clair et sombre, polices, tailles de police, espacements, arrondis. Pour chaque bloc, une phrase de commentaire qui dit pourquoi. Règles :

- Une couleur d'action pour tout ce qui est cliquable, et nulle part ailleurs.
- Recalculer le contraste, ne pas l'estimer : texte au moins 4,5 : 1, boutons et bordures au moins 3 : 1 (formule dans le skill `barrierefreiheit`). Noter les valeurs en commentaire.
- Le mode sombre n'échange que les variables de couleur (`@media (prefers-color-scheme: dark)`).
- En dehors de `tokens.css`, aucune couleur ni aucune taille de police n'est écrite à la main dans le code.

### 5. Transformation

Le contenu et les déroulements restent. D'abord la base (intégrer les tokens, les parties communes, une page modèle), puis les autres pages. S'il manque une valeur dans le nuancier, tu l'ajoutes là, pas dans le code de la page.

### 6. Photos et validation

Photographier chaque page, en largeur natel et en largeur ordinateur, en clair et en sombre :

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

`mission_pruefen` avec `webseite-03-gestaltung`. La vérification regarde si `~/projekt/docs/gestaltung/richtungen.md` contient une décision (`Entscheid:`) et si le site répond.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « d'abord les fondations, ensuite la façade », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
