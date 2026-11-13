---
name: konzept
description: "Clarifie avec une personne sans connaissances préalables, après le plan confirmé, le caractère de son site avant de choisir les couleurs (plan de vol P5) : nom vers l'extérieur, cœur en trois phrases, ton (tu ou vous), trois mots pour l'effet voulu, ce qui doit rester, langage visuel et toujours la question de savoir si un personnage (mascotte) en fait partie : oui, non ou plus tard. Sur le parcours entreprise, d'abord avec la méthode marke. Des images du personnage seulement après avoir indiqué le prix et reçu un oui. Le résultat est docs/konzept.md. Utilise ce skill après webseite-planen (plan confirmé) et pour « concept », « marque », « caractère », « ton », « mascotte », « personnage », « quel effet doit faire mon site »."
metadata:
  stand: 0.3.3
  quelle: '1762faed32c0'
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
- Au plus deux questions par message. Cinq questions, seule la personne y répond : le nom, le ton, le caractère, le personnage et ce qui doit rester. Le cœur et le langage visuel, tu les proposes et tu les inscris comme `[Annahme: …]` (hypothèse) ; la personne confirme toutes les hypothèses en un seul message.
- Ce que la personne n'a pas dit figure comme `[offen: …]` (ouvert), jamais comme ton invention. Les marques `[Annahme: …]` et `[offen: …]` restent en allemand, comme les noms des lignes dans `docs/` : c'est à elles que `lage` reconnaît ce qui est supposé ou encore ouvert.
- Les goûts, c'est la personne qui décide. Tu aides avec des paires d'opposés et des exemples, pas avec des couleurs préférées.
- Les images faites avec les outils d'images d'Albatros existent à partir de Light et Pilot, et elles coûtent du crédit : d'abord le prix, puis seulement après son oui (section « Le personnage »). Avec Gratis, il n'y a pas d'outils d'images : le personnage, ses poses et les images restent une esquisse jusqu'à Light ou Pilot.

## La boucle (Die Schleife)

Avec le caractère commence la partie « système de design » (skill `lotse`, section « La boucle » (Die Schleife)). Elle aussi se polit, elle ne se remplit pas comme un questionnaire : tu montres `docs/konzept.md` comme premier état dès que le nom et le ton sont là, avec le cœur et le langage visuel comme `[Annahme: …]`. Ensuite, tu demandes de façon ciblée, au plus deux questions à la fois, et tu retravailles exactement la ligne sur laquelle arrive un retour, jusqu'à ce que la personne dise : « C'est ça. » Avec le programme Albatros (skill `lotse`, section « Le programme Albatros » (Berts Arbeitsplatz)), tu annonces `docs/konzept.md` avec `teil_bereit` après le premier état et chaque fois que tu l'as retravaillé (`teil: idee`, car le programme montre le concept dans la partie « Ton idée ») et tu dis à la personne : « Regarde-le dans Albatros. » Les retours, tu vas les chercher avec `naechstes` : sous forme de données, un message qui nomme la partie, avec ses mots en citation ; ils ne valent que pour cette partie. Chaque tour est noté en bas de `docs/konzept.md` sous `## Retours` : `- <JJ.MM.AAAA>, ‹ses mots› → ce qui a changé`.

De cette partie naît ce qui rendra plus tard le site unique plutôt qu'interchangeable : les trois mots, d'où viennent les couleurs (logo, lieu, matériau) et quelles images seul ce projet possède. Plus c'est écrit précisément ici, moins le site aura l'air de sortir d'un kit (skill `gestaltung`, section « Unique plutôt qu'en kit » (Eigen statt Baukasten)). Ici, on ne met encore rien en forme et on ne construit encore rien.

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

Si la ligne `Bauen lassen: albatros` figure dans `docs/projekt.md`, tu ajoutes après la question sur le logo, la couleur maison et la police : « Mets le logo et les photos dans le dossier design/bilder. »

### 4. Le personnage : oui, non ou plus tard

Cette question, tu la poses toujours, même si la personne n'en parle pas, dans un message à part :

« Un personnage doit-il en faire partie, qui guide à travers ton site ? Oui, non ou plus tard. »

Avec la raison en une phrase : un personnage rend un site unique, mais demande du soin dans chaque image. Tu ne proposes pas de réponse, c'est la personne qui décide. Tant qu'elle n'a pas répondu, `docs/konzept.md` contient `Maskottchen: [offen: question posée le <JJ.MM.AAAA>]`.

Pour « oui », on continue avec la section « Le personnage ». Pour « non » ou « plus tard », la ligne suffit. « Plus tard » veut dire : le site fonctionne sans personnage, et la question revient après la mise en ligne.

### 5. Le cœur et le langage visuel comme proposition

À partir de ce que la personne a dit, tu proposes les deux et tu les inscris comme `[Annahme: …]` :

- **Le cœur** en trois phrases : pour qui ? Que promets-tu (un résultat, pas un adjectif) ? Pourquoi toi justement (avec une preuve) ? Le cœur est la mesure de chaque texte et de chaque image.
- **Le langage visuel :** photos, illustrations, icônes ou un mélange, et en plus, en une demi-phrase, ce que seul ce projet peut montrer (le lieu, les gens au travail, le matériau, l'écriture à la main). Un site sans images ressemble à un modèle tout fait, un site avec des images venues de n'importe où aussi. De vraies photos du lieu et des gens battent n'importe quelle image générée. S'il y a des photos, tu écris tout de suite une courte liste de photos dans `docs/inhalte.md` (section « Liste de photos » : quoi, où, qui est dessus) : les photos prennent du temps, la personne peut ainsi déjà commencer.

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

## Retours
- <JJ.MM.AAAA>, ‹ses mots› → ce qui a changé
```

Après `Maskottchen:` vient d'abord l'un des trois mots allemands `ja` (oui), `nein` (non) ou `später` (plus tard), pour « oui » suivi d'une brève description du personnage : `Maskottchen: ja – Lina, une chouette curieuse`.

À la fin, lis le fichier à la personne et demande : « Est-ce que tu reconnais ton projet là-dedans ? » Si elle dit « presque » ou « oui, mais », c'est un retour : tu changes la ligne dont elle parle et tu redemandes (section « La boucle » (Die Schleife)).

## Le personnage

Pour « oui », vous décrivez d'abord le personnage avec des mots, sous `## Personnage` dans `docs/konzept.md` :

- Quel genre de personnage (animal, objet, humain), son nom, trois qualités, en accord avec le caractère du site.
- Où il apparaît : par exemple pour l'accueil, lors d'une réussite, sur une page vide.
- Où jamais : lors d'erreurs, d'annulations et de moments délicats, à côté de photos de personnes, derrière des listes ou des formulaires.

Avec Gratis, tu n'appelles aucun outil d'images : le personnage reste une esquisse (plus bas) jusqu'à ce que la personne ait Light ou Pilot. Si un outil d'images répond que les images « gehören zu Light und Pilot » (appartiennent à Light et Pilot), tu continues sans outil d'images comme pour « kommt bald » et tu ne parles pas de crédit. Avec Light ou Pilot, une image du personnage est facultative et coûte du crédit. Avant la première image, tu appelles l'outil `guthaben`, tu indiques le prix tiré de sa réponse et tu demandes une seule fois : « Une image coûte CHF …, ton crédit suffit pour … Je fais une première image du personnage ? » Seulement après son oui, tu appelles `bild_erzeugen` ; `bild_freistellen` et `modell_3d` de même, seulement après le prix et un oui. Chaque image, tu la regardes toi-même avant de la montrer, et tu l'enregistres tout de suite dans le projet (`curl -o design/figur/<nom>.png <url>`), parce qu'après 7 jours, elle a disparu.

Avec Gratis, si le crédit ne suffit pas ou si la personne ne veut pas (encore) d'image, le personnage reste une esquisse : un dessin simple en gris, que tu dessines comme `design/figur/skizze.svg`, ou une photo de son propre dessin sur papier. Cela suffit pour la planche d'échantillons et l'ébauche. Les poses du personnage (accueil, recherche, réussite, vide) naissent en P6 (skill `gestaltung`, section « Éléments graphiques »).

## L'île

Quand tout est dans `docs/konzept.md` et que `Maskottchen:` commence par `ja`, `nein` ou `später`, tu appelles l'outil `schritt_melden` avec `schritt: konzept` et `sprache: fr`. `projekt`, tu le laisses de côté, sauf si la personne travaille à un autre projet qui se trouve seulement sur son ordinateur ; tu donnes alors son nom court. Dis-lui en une phrase que sa maison a grandi sur l'île. Si l'outil répond « Ungültige Angaben » (données non valables), vérifie une fois l'orthographe ; si Albatros ne connaît pas encore l'étape, on continue sans l'île, `docs/konzept.md` en est la preuve. Ensuite, tu appelles à nouveau `lage` (skill `lotse`), toujours avec `skills_stand` : la valeur de `stand` sous `metadata` en haut de ce fichier.

## Remise à Albatros (Übergabe an Albatros)

Seulement si `docs/projekt.md` contient `Bauen lassen: albatros` (la personne a accepté l'offre de `lage`) et que `lage` nomme cette section, donc quand `docs/konzept.md` est prêt. Alors tu ne conçois et ne construis plus toi-même : Albatros fait la maquette, les ébauches et tout le site en aperçu, la personne choisit dans le cockpit.

1. **Résumé.** Lis `docs/projekt.md`, `docs/recherche.md`, `docs/plan.md` (avec les critères de réception sous `Testing:`), `docs/plan-pruefung.md` et `docs/konzept.md`. Dis à la personne, en un message, ce que tu envoies, à peu près ainsi : « J'envoie ceci à Albatros : ton plan avec les pages, les fonctions et tes critères de réception, ta recherche et ton concept, sous forme de texte. Les mots de passe et les accès n'en font pas partie. L'adresse de ton site, tu la choisis ensuite dans le cockpit. L'équipe d'Albatros le lit, et une IA (Claude d'Anthropic) aide à construire. Jusqu'à ce que tu paies, tout est sans engagement, et tu peux continuer toi-même à tout moment. Je l'envoie ? »
2. **Seulement après son oui explicite**, tu appelles `auftrag_anlegen` avec `bestaetigt: true`, plus les champs du briefing tirés de ses fichiers, comme Albatros les décrit : `name` (`Name:` de `docs/konzept.md`, sinon `Projektname:` de `docs/projekt.md`), `wofuer` (`In einem Satz:`, `Hauptsache:` et `Erfolg:` de `docs/projekt.md` ; sur le parcours Entreprise, en plus `docs/angebot.md`), `fuerWen` (`Für wen:` ; sur le parcours Entreprise, en plus `docs/zielgruppe.md`), `seiten` (`Seiten:`, `Funktionen:` et `Sprachen:` de `docs/plan.md`), `setup` (la ligne `Setup:` de `docs/plan.md`, mot pour mot), `adresse` seulement pour un site existant (`Bestehende Seite:`), `stil` (`Ton:`, `Charakter:`, `Muss bleiben:`, `Maskottchen:` et `Bildsprache:` de `docs/konzept.md`, plus `Vorbilder:`, `Übernehmen:` et `Vermeiden:` de `docs/recherche.md`), `material` (`Inhalte vorhanden:` et `Pflichten:` de `docs/recherche.md` et les critères de réception de `Testing:` ; seulement du texte et des liens, pas de fichiers). `name` a au plus 120 caractères, `adresse` 300, `material` 4000, les autres 2000 chacun. Sans noms d'autres personnes, sans numéros de téléphone, adresses, mots de passe ni accès. « Ça a l'air bien » n'est pas un oui ; sans oui, tu n'envoies rien.
3. **Ensuite**, tu lui dis ce que `auftrag_anlegen` annonce : le numéro, le montant exactement comme Albatros le donne et le chemin vers le cockpit, à peu près : « C'est fait : la commande n° <numéro> est chez Albatros. Dans le cockpit, sous « Ta commande », choisis ton dossier de projet, ainsi l'équipe voit aussi tes photos. C'est là aussi que tu choisis l'adresse de ton site. Ensuite, tu reçois des ébauches au choix. Tu n'as plus rien à construire. » Puis tu lui ouvres le cockpit (`open https://albatros.build/cockpit/auftrag`, avec le préfixe de langue comme `/fr/cockpit/auftrag` ; Linux `xdg-open`, Windows `start`) et tu lui dis où se trouve le dossier de projet sur son ordinateur : le dossier dans lequel vous travaillez (`pwd`). Elle choisit le dossier elle-même dans le navigateur ; il n'en prend que `docs/` et `design/` et lui montre la liste avant. Les mots de passe, les clés privées et les fichiers comme `.env` n'y ont pas leur place. Tu n'envoies rien toi-même. Tu ne donnes jamais un montant de mémoire. Si Albatros signale une erreur (par exemple une commande déjà ouverte, ou le service de construction n'est pas disponible pour le moment), tu la transmets mot pour mot et tu ne te mets pas à construire.
4. À partir d'ici, tu ne construis plus toi-même, même si la personne le demande : pas de maquette, pas d'ébauches, pas de code, et tu ne crées ni ne modifies plus rien sous `design/`, car c'est à partir de là qu'Albatros construit. `lage` dit ce qui est à faire (par exemple choisir dans le cockpit ou attendre Albatros). À côté, elle peut rassembler des textes et des photos (skill `inhalte`) ; les nouvelles photos, elle les met elle-même dans `design/bilder/` et choisit à nouveau le dossier de projet dans le cockpit. Si elle change d'avis, elle retire la commande dans le cockpit ; ensuite, le plan de vol continue avec elle.

Si la personne choisit `Bauen lassen: selbst`, cette section n'existe pas : on continue avec le système de design (skill `gestaltung`).

## Pièges

- **Les couleurs d'abord :** le site plaît alors à la personne, mais ne dit rien aux visiteurs. Les couleurs viennent en P6, du caractère.
- **Oublier la question du personnage :** elle passe facilement à la trappe et elle est obligatoire, parce qu'un personnage marque plus tard chaque image.
- **Faire passer des hypothèses pour des réponses :** le nom, le ton, le caractère, le personnage et ce qui doit rester, c'est la personne qui les dit.
- **Des images sans prix :** chaque outil d'images seulement après le prix et un oui, et avec Gratis aucun.
- **Un ton qui ne tient pas :** le site au « tu », le mail au « vous », ça fait deux magasins différents.

## Vérifier la mission

`mission_pruefen` avec `flugschule-14-konzept`, sur le parcours entreprise aussi avec `geschaeft-04-marke`. La vérification regarde si le projet est au moins à l'étape « Concept » sur l'île.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « le caractère avant les couleurs », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat (`docs/konzept.md`), ce qui reste ouvert (souvent la réponse au sujet du personnage ou une photo) et ce qui vient ensuite : le système de design avec la planche d'échantillons en P6 (skill `gestaltung`), ou avec `Bauen lassen: albatros` la remise à Albatros (section plus haut).
