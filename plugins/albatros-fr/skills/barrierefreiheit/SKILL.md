---
name: barrierefreiheit
description: "Vérifie et améliore l'accessibilité d'un petit site web avec une personne sans connaissances préalables, selon les WCAG 2.2 AA en mots simples : contraste, taille du texte et zoom, descriptions d'images, utilisation au clavier, formulaires, lecture à voix haute, mouvement. Le résultat est un procès-verbal de contrôle dans docs/barrierefreiheit.md. Utilise ce skill quand on dit « accessibilité », « accessible », « accessibility », « a11y », « WCAG », « contraste », « texte alternatif », « lecteur d'écran », « lisible pour les personnes âgées », « utiliser au clavier »."
---

# Accessibilité : la rampe à côté de l'escalier

## L'image

Une maison avec un escalier devant la porte convient à beaucoup de gens. Pour quelqu'un en fauteuil roulant, avec une poussette ou une lourde valise, c'est un mur. Une rampe à côté de l'escalier aide ces personnes, et tous les autres l'empruntent volontiers aussi.

Pour les sites web, les rampes sont : assez de contraste, des descriptions pour les images, l'utilisation sans souris, des formulaires avec des étiquettes claires. Chaque personne qui regarde son natel au soleil, qui a oublié ses lunettes ou qui est pressée en profite.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Les abréviations et les noms d'outils seulement avec une demi-phrase d'explication : WCAG (la liste de contrôle reconnue au niveau international pour des sites web accessibles), Lighthouse (un outil de contrôle intégré à Chrome). Sinon, laisse-les de côté.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement, sans abréviations techniques. Le « contraste », tu l'expliques avec une écriture gris clair sur du papier blanc.
- Chaque point a besoin d'une preuve : la page et l'endroit.
- Les outils automatiques ne trouvent qu'une partie des problèmes. Dis-le honnêtement et fais les contrôles à la main avec la personne.

## Déroulement

### 1. Contrôle automatique préalable

La personne ouvre son site dans Chrome, clic droit, « Inspecter », onglet « Lighthouse », choisir seulement « Accessibilité », « Analyser le chargement de la page ». Ou tu vérifies dans le terminal :

```bash
npx pa11y https://{name}.aufwind.sh
```

Les messages vont comme constats dans le procès-verbal. Ce que les outils ne voient pas : si l'ordre a du sens, si les textes sont compréhensibles, où l'on atterrit après un clic.

### 2. Contrôler à la main

**Voir**
- Recalculer le contraste : texte au moins 4,5 : 1 ; grands titres, boutons, bordures des champs de saisie et symboles au moins 3 : 1. Clair et sombre séparément.
  - Formule : linéariser chaque canal de couleur (0 à 1) : `c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`. Luminance `L = 0.2126 R + 0.7152 G + 0.0722 B`. Contraste `(L_hell + 0.05) / (L_dunkel + 0.05)` (`hell` = la couleur claire, `dunkel` = la couleur sombre). Contrôle : blanc sur noir donne 21.
- La couleur n'est jamais le seul signe : une erreur avec symbole et texte, l'élément de menu actif aussi souligné ou en gras.
- Zoom à 200 % : rien n'est coupé, pas de défilement horizontal. Largeurs de contrôle 320, 375, 768 et 1440 pixels.

**Utiliser**
- Seulement au clavier : `Tab` en avant, `Shift+Tab` en arrière, `Enter` clique. Arrive-t-on partout ? Voit-on toujours où l'on est (cadre de focus) ? `Escape` ferme-t-il une fenêtre ouverte ?
- Zones cliquables assez grandes sur le natel : environ un bout de doigt, au moins 44 × 44 pixels.
- Les liens sont des liens, les boutons sont des boutons. Les textes des liens disent où ils mènent (« Voir les prix », pas « ici »).

**Lecture à voix haute**
- Chaque image de contenu a une description (`alt="…"`) qui dit ce qu'on doit voir. La pure décoration reçoit `alt=""`.
- Les boutons avec seulement un symbole (cœur, loupe, menu) ont un nom (`aria-label="Rechercher"`).
- Les titres dans un ordre logique : un seul `h1`, puis `h2`, `h3` en dessous.
- Langue de la page définie : `<html lang="fr-CH">` (ou la langue du site).
- Sur Mac, écouter soi-même : `Cmd+F5` active et désactive VoiceOver.

**Formulaires**
- Une étiquette visible au-dessus de chaque champ, pas seulement un texte gris d'exemple dans le champ.
- Champs obligatoires reconnaissables. Le bon type de champ (`type="email"`, `type="tel"`), pour que le natel affiche le bon clavier.
- Les erreurs directement au champ, compréhensibles, avec le chemin vers la solution. Les saisies sont conservées en cas d'erreur.

**Mouvement**
- Qui a choisi « Réduire les animations » dans les réglages du système voit des images fixes : `@media (prefers-reduced-motion: reduce)`.
- Ce qui bouge tout seul s'arrête après 5 secondes au plus ou peut être mis en pause.
- Les vidéos ont des sous-titres.

### 3. Procès-verbal et réparation

`docs/barrierefreiheit.md` :

```markdown
# Accessibilité : procès-verbal de contrôle (<date>)

| Point | Résultat | Preuve (page, endroit) | Réparation |
|---|---|---|---|
| Contraste du texte | rempli / pas rempli / pas pertinent | … | … |

## Contrastes
| Paire de couleurs | Valeur | suffit pour |
|---|---|---|
```

Ensuite réparer, les points critiques d'abord (tout ce qui exclut complètement une personne). Puis contrôler encore une fois et mettre à jour le procès-verbal. Journal de bord (skill `git-logbuch`), tapis roulant (skill `pipeline`).

## Bon à savoir

- En Suisse, la loi sur l'égalité pour les handicapés (LHand) oblige surtout les autorités et les services publics. Pour les sites privés, ce n'est pas une obligation, mais un avantage : plus de gens y arrivent, les moteurs de recherche comprennent mieux le site. Si la personne vend aussi dans l'UE, l'European Accessibility Act peut s'appliquer. Ce n'est pas un conseil juridique.
- Ce qui apporte le plus, c'est le test avec de vraies personnes, y compris des personnes âgées.

## Vérifier la mission

`mission_pruefen` avec `webseite-06-barrierefreiheit`. La vérification regarde si `docs/barrierefreiheit.md` se trouve dans le projet (avec Pilot dans `~/projekt` sur le serveur, avec Light dans le port).

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « la rampe à côté de l'escalier », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
