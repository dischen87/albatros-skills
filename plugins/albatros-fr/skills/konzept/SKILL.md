---
name: konzept
description: "Clarifie avec une personne sans connaissances préalables, après le plan confirmé, le caractère de son site avant de choisir les couleurs (plan de vol P5) : nom vers l'extérieur, cœur en trois phrases, ton (tu ou vous), trois mots pour l'effet voulu, ce qui doit rester, langage visuel et toujours la question de savoir si un personnage (mascotte) en fait partie : oui, non ou plus tard. Sur le parcours entreprise, d'abord avec la méthode marke. Des images du personnage seulement après avoir indiqué le prix et reçu un oui. Le résultat est docs/konzept.md. Utilise ce skill après webseite-planen (plan confirmé) et pour « concept », « marque », « caractère », « ton », « mascotte », « personnage », « quel effet doit faire mon site »."
metadata:
  stand: 0.2.0
  quelle: '02a20c500e11'
---

# Concept : le caractère avant les couleurs

## L'image

Avant qu'une maison reçoive sa couleur, elle a un caractère : une ferme accueillante, un appartement clair en ville, une maison de vacances espiègle. Qui choisit d'abord les couleurs finit par peindre une maison que personne ne voulait ainsi. C'est pourquoi tu fixes d'abord avec la personne comment son site s'appelle, comment il sonne et quel effet il doit produire. Les couleurs, les polices et les formes en découlent ensuite, à l'étape suivante (skill `gestaltung`).

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions, même si elle veut tout de suite parler de couleurs.

## Dans le plan de vol

Phase P5 « Concept de design et de marketing ». C'est le tour de cette phase après le plan confirmé : `docs/plan.md` a la ligne `Bestätigt:` (P4, skill `webseite-planen`). Si elle manque, dis-le honnêtement et va d'abord là-bas (section « Vérifier le plan ») : on ne met en forme qu'un plan confirmé. Ensuite vient P6, le système de design avec la planche d'échantillons (skill `gestaltung`).

- **Résultat :** `docs/konzept.md` avec les lignes `Name:`, `Kern:`, `Ton:`, `Charakter:`, `Maskottchen:`, `Muss bleiben:` et `Bildsprache:` (modèle à l'étape 6). Les noms des lignes restent en allemand, parce que `lage` les lit ; le contenu est en français.
- **Réussi quand** les sept lignes sont là et que `Maskottchen:` commence par `ja`, `nein` ou `später`. Tu annonces alors l'étape `konzept` sur l'île.
- **Parcours entreprise :** D'abord vient la méthode `marke`. Va la chercher avec l'outil `methode` (nom `marke`) et suis-la : elle vérifie le nom avec la personne (Swissreg, registre du commerce, domaine, test à voix haute) et remplit `docs/konzept.md` avec les mêmes sept lignes ; la démarche va dans `docs/marke.md`. Ensuite tu reprends son résultat : lis `docs/konzept.md`, demande seulement ce qui manque (souvent la réponse au sujet du personnage) et continue avec les sections « Le personnage » et « L'île ». C'est `lage` qui dit si c'est le parcours entreprise (il nomme la méthode `marke`) ; dans le projet, tu le reconnais à `docs/zielgruppe.md` ou `docs/angebot.md` de P2. Si `methode` ne livre rien, tu fais ici toutes les étapes et tu dis honnêtement que la vérification approfondie du nom fait partie de la méthode.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Tutoiement, phrases courtes, pas de jargon. Ce que la personne a déjà dit (dans `docs/projekt.md`, dans le plan ou dans la conversation), tu ne le redemandes pas : tu le lui relis et tu l'inscris.
- Au plus deux questions par message. Cinq questions, seule la personne y répond : le nom, le ton, le caractère, le personnage et ce qui doit rester. Le cœur et le langage visuel, tu les proposes et tu les inscris comme `[Hypothèse : …]` ; la personne confirme toutes les hypothèses en un seul message.
- Ce que la personne n'a pas dit figure comme `[ouvert : …]`, jamais comme ton invention.
- Les goûts, c'est la personne qui décide. Tu aides avec des paires d'opposés et des exemples, pas avec des couleurs préférées.
- Les images faites avec les outils d'images d'Albatros coûtent du crédit : d'abord le prix, puis seulement après son oui (section « Le personnage »).

## Mode

Lis la ligne `Modus:` dans `docs/projekt.md` ; si elle manque, c'est `machen` (faire) qui vaut.

- **machen (faire) :** Tu fais le travail et tu expliques chaque étape en une phrase avec son image. Les cinq questions à la personne, tu les poses quand même. Le moment d'apprentissage, tu le proposes sans insister : « Le caractère avant les couleurs. Tu veux voir pourquoi la même couleur fait un tout autre effet chez une boulangère et chez une avocate ? »
- **lernen (apprendre) :** Tu expliques chaque étape avec l'image et le pourquoi. Les trois mots du caractère, c'est la personne qui les trouve ; toi, tu aides seulement avec des paires d'opposés. À la fin, tu poses la question de contrôle de la leçon `flugschule-14-konzept` : « Pourquoi fixes-tu le caractère de ton site avant les couleurs ? » Seulement après sa réponse, tu appelles `verstanden_melden` avec `mission: flugschule-14-konzept` et `art: kontrollfrage`. Si l'outil manque, on continue sans.

## Déroulement

### 1. Lire ce qui existe déjà

Lis `docs/projekt.md` (nom du projet, pour qui, chose principale), `docs/recherche.md` (modèles, ce qu'on reprend, ce qu'on évite) et `docs/plan.md` (pages, fonctions). Si `docs/konzept.md` existe déjà (par exemple grâce à la méthode `marke`), tu la complètes.

### 2. Nom et ton

Demande dans un même message :

- « Le nom du projet reste-t-il, ou le projet doit-il s'appeler autrement vers l'extérieur ? » Pourquoi : le nom figure sur chaque page et plus tard dans l'adresse.
- « Tu ou vous, et comment la langue doit-elle sonner ? » Pourquoi : le ton fait des textes une voix. Aide avec une phrase sur deux tons, par exemple « Passe nous voir, le café est déjà chaud » et « Nous nous réjouissons de votre visite ».

Si le projet doit s'appeler autrement, tu proposes trois à cinq noms et la personne choisit. Une courte recherche sur le web montre si le nom existe déjà ; l'outil `domain_suchen` montre si une adresse qui va bien est libre (seulement chercher, acheter vient bien plus tard). La vérification approfondie dans le registre des marques et le registre du commerce fait partie de la méthode `marke`.

### 3. Caractère et ce qui doit rester

- « Quels trois mots décrivent l'effet qu'il doit produire ? » Pourquoi : les directions de la mise en forme naissent du caractère, pas des couleurs préférées. Aide avec des paires d'opposés adaptées au projet : traditionnel ou sportif, village de montagne ou ville, calme ou vivant, raffiné ou simple, ludique ou sobre. Et avec la question : que doivent penser les visiteurs après dix secondes ?
- « Y a-t-il un logo, une couleur maison ou une police qui doivent rester ? » Pourquoi : ce qui doit rester est le cadre de toutes les directions. S'il n'y a rien, on écrit « rien ».

Les couleurs préférées ne vont sous `Muss bleiben:` que si elles doivent vraiment rester. Sinon, tu les notes sous la ligne comme un souhait ; en P6, on verra si elles vont avec le caractère.

### 4. Le personnage : oui, non ou plus tard

Cette question, tu la poses toujours, même si la personne n'en parle pas, dans un message à part :

« Un personnage doit-il en faire partie, qui guide à travers ton site ? Oui, non ou plus tard. »

Avec la raison en une phrase : un personnage rend un site unique, mais demande du soin dans chaque image. Tu ne proposes pas de réponse, c'est la personne qui décide. Tant qu'elle n'a pas répondu, `docs/konzept.md` contient `Maskottchen: [ouvert : question posée le <JJ.MM.AAAA>]`.

Pour « oui », on continue avec la section « Le personnage ». Pour « non » ou « plus tard », la ligne suffit. « Plus tard » veut dire : le site fonctionne sans personnage, et la question revient après la mise en ligne.

### 5. Le cœur et le langage visuel comme proposition

À partir de ce que la personne a dit, tu proposes les deux et tu les inscris comme `[Hypothèse : …]` :

- **Le cœur** en trois phrases : pour qui ? Que promets-tu (un résultat, pas un adjectif) ? Pourquoi toi justement (avec une preuve) ? Le cœur est la mesure de chaque texte et de chaque image.
- **Le langage visuel :** photos, illustrations, icônes ou un mélange. Un site sans images ressemble à un modèle tout fait. De vraies photos du lieu et des gens battent n'importe quelle image générée. S'il y a des photos, tu écris tout de suite une courte liste de photos dans `docs/inhalte.md` (section « Liste de photos » : quoi, où, qui est dessus) : les photos prennent du temps, la personne peut ainsi déjà commencer.

Puis dans un seul message : « J'ai proposé le cœur et le langage visuel ainsi : … Ça te va, ou on change quelque chose ? » Après sa réponse, les crochets disparaissent.

### 6. docs/konzept.md

Chaque ligne commence au début de la ligne par son nom en allemand, sans gras, et reste courte (300 caractères au plus), parce que `lage` lit ces lignes. Les détails viennent en dessous.

```markdown
# Concept : <nom>
Stand: <JJ.MM.AAAA>

Name: <nom vers l'extérieur>
Kern: Pour <qui> : <promesse>. Pourquoi nous : <preuve>.
Ton: <tu ou vous> ; <trois qualités, comment ça sonne>
Charakter: <trois mots>
Maskottchen: <ja, nein ou später>
Muss bleiben: <logo, couleur maison, police, ou rien>
Bildsprache: <photos, illustrations, icônes ou un mélange>

## Ton
| Nous sommes | Comme ça | Pas comme ça |
|---|---|---|
| … | « … » | « … » |

## Personnage
Seulement avec « Maskottchen: ja », voir la section « Le personnage ».
```

Après `Maskottchen:` vient d'abord l'un des trois mots allemands `ja` (oui), `nein` (non) ou `später` (plus tard), pour « oui » suivi d'une brève description du personnage : `Maskottchen: ja – Lina, une chouette curieuse`.

À la fin, lis le fichier à la personne et demande : « Est-ce que tu reconnais ton projet là-dedans ? »

## Le personnage

Pour « oui », vous décrivez d'abord le personnage avec des mots, sous `## Personnage` dans `docs/konzept.md` :

- Quel genre de personnage (animal, objet, humain), son nom, trois qualités, en accord avec le caractère du site.
- Où il apparaît : par exemple pour l'accueil, lors d'une réussite, sur une page vide.
- Où jamais : lors d'erreurs, d'annulations et de moments délicats, à côté de photos de personnes, derrière des listes ou des formulaires.

Une image du personnage est facultative et coûte du crédit. Avant la première image, tu appelles l'outil `guthaben`, tu indiques le prix tiré de sa réponse et tu demandes une seule fois : « Une image coûte CHF …, ton crédit suffit pour … Je fais une première image du personnage ? » Seulement après son oui, tu appelles `bild_erzeugen` ; `bild_freistellen` et `modell_3d` de même, seulement après le prix et un oui. Chaque image, tu la regardes toi-même avant de la montrer, et tu l'enregistres tout de suite dans le projet (`curl -o design/figur/<nom>.png <url>`), parce qu'après 7 jours, elle a disparu.

Si le crédit ne suffit pas, ou si la personne ne veut pas (encore) d'image, le personnage reste une esquisse jusqu'à la validation du site (P10) : un dessin simple en gris, que tu dessines comme `design/figur/skizze.svg`, ou une photo de son propre dessin sur papier. Cela suffit pour la planche d'échantillons et l'ébauche. Les poses du personnage (accueil, recherche, réussite, vide) naissent en P6 (skill `gestaltung`, section « Éléments graphiques »).

## L'île

Quand tout est dans `docs/konzept.md` et que `Maskottchen:` commence par `ja`, `nein` ou `später`, tu appelles l'outil `schritt_melden` avec `schritt: konzept` et `sprache: fr`. `projekt`, tu le laisses de côté, sauf si la personne travaille à un autre projet qui se trouve seulement sur son ordinateur ; tu donnes alors son nom court. Dis-lui en une phrase que sa maison a grandi sur l'île. Si l'outil répond « Ungültige Angaben » (données non valables), vérifie une fois l'orthographe ; si Albatros ne connaît pas encore l'étape, on continue sans l'île, `docs/konzept.md` en est la preuve. Ensuite, tu appelles à nouveau `lage` (skill `lotse`).

## Pièges

- **Les couleurs d'abord :** le site plaît alors à la personne, mais ne dit rien aux visiteurs. Les couleurs viennent en P6, du caractère.
- **Oublier la question du personnage :** elle passe facilement à la trappe et elle est obligatoire, parce qu'un personnage marque plus tard chaque image.
- **Faire passer des hypothèses pour des réponses :** le nom, le ton, le caractère, le personnage et ce qui doit rester, c'est la personne qui les dit.
- **Des images sans prix :** chaque outil d'images seulement après le prix et un oui.
- **Un ton qui ne tient pas :** le site au « tu », le mail au « vous », ça fait deux magasins différents.

## Vérifier la mission

`mission_pruefen` avec `flugschule-14-konzept`, sur le parcours entreprise aussi avec `geschaeft-04-marke`. La vérification regarde si le projet est au moins à l'étape « Concept » sur l'île.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « le caractère avant les couleurs », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat (`docs/konzept.md`), ce qui reste ouvert (souvent la réponse au sujet du personnage ou une photo) et ce qui vient ensuite : le système de design avec la planche d'échantillons en P6 (skill `gestaltung`).
