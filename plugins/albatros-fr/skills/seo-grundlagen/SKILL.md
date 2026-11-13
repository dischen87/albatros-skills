---
name: seo-grundlagen
description: "Rend un petit site web visible : pour les moteurs de recherche (SEO) et pour les assistants IA (GEO), expliqué aux personnes sans connaissances préalables avec l'image des panneaux indicateurs et du plan de ville. Titre de page et description, un seul titre principal, adresse canonique, descriptions d'images, sitemap.xml, robots.txt, données structurées selon le genre d'activité, aperçu au partage, llms.txt, faits et questions avec réponses, Google Search Console, Bing Webmaster Tools, IndexNow et profil d'entreprise ; vérifié avec sichtbar-pruefen.mjs sur le site construit. Utilise ce skill quand on dit « SEO », « GEO », « devenir visible », « être trouvé sur Google », « Google ne trouve pas mon site », « être trouvé dans ChatGPT », « recherche par IA », « moteur de recherche », « sitemap », « méta-description », « Search Console », « Bing », « IndexNow », « llms.txt », « être trouvé dans ma région », « fiche Google Maps »."
metadata:
  stand: 0.3.3
  quelle: 'd1e923bdddba'
---

# Bases du SEO : panneaux indicateurs et plan de ville

## L'image

Un moteur de recherche, c'est un plan de ville qu'un messager zélé redessine chaque jour. Il parcourt les rues, lit les enseignes et note ce qu'il trouve. Pour que ton magasin figure sur le plan, il faut :

- **une enseigne claire au-dessus de la porte** (titre de page et titre principal),
- **des panneaux indicateurs** qui mènent d'autres endroits jusqu'à toi (liens),
- **un plan de situation** que tu glisses dans la main du messager (`sitemap.xml`),
- **un règlement de maison** pour le messager : où il a le droit d'aller (`robots.txt`).

Aujourd'hui, beaucoup de gens ne consultent plus le plan de ville, mais un guichet de renseignements : un assistant IA qui donne tout de suite la réponse lui-même. Le guichet ne recommande que ce qu'il sait avec certitude. Il a besoin de faits clairs sur ton magasin, écrits partout de la même façon.

Les mots techniques pour ça sont **SEO** (être trouvé dans les moteurs de recherche) et **GEO** (être cité dans les réponses des IA). Pour les deux, ce qui compte le plus, c'est que le site réponde bien à la question des gens qui cherchent.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées `[Annahme: …]`. Les marques `[Annahme: …]` et `[offen: …]` restent en allemand, comme les noms des lignes dans `docs/` : c'est à elles que `lage` reconnaît ce qui est supposé ou encore ouvert. Demande ce qui manque seulement à la fin.
- Tutoiement. Ne pas promettre de miracles : être trouvé prend des semaines, pas des heures, et personne ne peut garantir une place dans une recherche ou dans une réponse d'IA. Pas de trucs (texte caché, liens achetés, textes écrits seulement pour les machines), ils font plus de mal que de bien.
- **Ne rien inventer :** pas d'avis, d'étoiles, de nombres de clients, de distinctions ni de citations qui n'existent pas. Chaque chiffre sur le site vient de la personne ou d'une source que tu as ouverte toi-même, et il est écrit avec elle.
- **Les comptes appartiennent à la personne :** chez Google et Microsoft, elle se connecte elle-même, dans son navigateur web. Tu ne saisis jamais de données d'accès, même si elle te les donne, et tu ne confirmes rien en son nom : c'est elle qui clique sur « Confirmer ». Tu prépares ce qui doit se trouver sur le site et tu lui dis chaque clic.

## Quand vient quoi

- **Pendant la construction** (skill `webseite-bauen`), sur l'ordinateur de la personne : tout ce qui est dans le site, étapes 1 à 6. Le script `sichtbar-pruefen.mjs` le vérifie sur le site construit.
- **Après la mise en ligne** (skill `lancieren`), avec la vraie adresse : Search Console, Bing Webmaster Tools, IndexNow et le profil d'entreprise, étapes 7 à 10. Le plus simple, c'est avec un propre domaine (skill `domain`).
- **Avec le programme Albatros** (skill `lotse`, section « Le programme Albatros » (Berts Arbeitsplatz)), la grande étape « Devenir visible » montre les mêmes douze points que le script, avec des mots de tous les jours (« Être trouvé sur Google »). Appelle `naechstes` au début et après chaque étape : il dit combien de points y manquent encore et apporte ce que la personne demande dans Albatros. Si son message nomme des points de la vérification, tu t'occupes exactement de ceux-là et tu ne changes que ce qu'il faut pour ça.

## Déroulement

### 1. Que cherchent et que demandent les gens ?

Noter avec la personne cinq phrases que son public cible taperait sur Google (« cantine de midi Sous-Gare », « réparer vélo Fribourg Pérolles »), et cinq questions qu'il poserait à une IA (« Où puis-je faire réparer mon vélo à Pérolles, et combien coûte un service ? »). Une phrase principale par page. Ça va dans `docs/recherche.md`, à la ligne `Suchbegriffe:` ; s'il y a déjà quelque chose de la recherche (P2), tu t'appuies dessus.

### 2. Chaque page : l'enseigne au-dessus de la porte

- **Titre de page** (`<title>`) : quoi + lieu ou bénéfice + nom, environ 50 à 60 caractères. Chaque page a le sien. (point « titel »)
- **Description** (`<meta name="description">`) : une ou deux phrases qui donnent envie de cliquer, environ 150 caractères, une autre sur chaque page. Elle apparaît souvent sous le titre dans les résultats de recherche. (point « beschreibung »)
- **Exactement un titre principal** (`<h1>`) par page, avec des intertitres en dessous. (point « h1 »)
- **Des adresses parlantes :** `/offre/cantine-de-midi` plutôt que `/page?id=7`.
- **Images :** chacune avec une description (`alt`, pour une pure décoration `alt=""`), avec `width` et `height`, sous 500 Ko (skills `barrierefreiheit` et `inhalte`). (point « bilder »)
- **Langue :** `<html lang="fr-CH">` (ou la langue du site, par exemple `de-CH`).
- **Une adresse principale :** le site est accessible soit avec, soit sans `www`, l'autre variante redirige. Chaque page nomme avec `<link rel="canonical" href="https://…">` son adresse unique et complète. Avec Astro, l'adresse principale figure comme `site` dans `web/astro.config.mjs` (l'adresse de `docs/lancieren.md`, ligne `Adresse:`), et la mise en page écrit `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)}>`. (point « kanonisch »)
- **Liens internes :** chaque page est liée depuis au moins une autre, avec un texte de lien qui dit où il mène.
- **Aperçu au partage** (Open Graph) : `og:title`, `og:description`, `og:image` (adresse complète, une image à soi, environ 1200 × 630 px) et `og:url` sur chaque page. Ainsi, un lien partagé montre une image et un texte au lieu d'une adresse nue. (point « open_graph »)

### 3. Plan de situation et règlement de maison

- **`web/public/sitemap.xml` :** toutes les pages publiques avec leur adresse complète (`https://…`), pour chaque page un `<url><loc>…</loc></url>`. Pour les cinq à sept pages du premier vol, tu l'écris à la main et tu la mets à jour à chaque nouvelle page ; le script de l'étape 6 signale s'il manque une page ou s'il y en a une de trop. Google n'y lit que les adresses et, si elle est juste, la date de la dernière modification ; il ne tient pas compte de `priority` ni de `changefreq`. À partir de beaucoup de pages, c'est l'intégration d'Astro qui la génère (`npx astro add sitemap`, a besoin de `site`) ; le fichier s'appelle alors `sitemap-index.xml`, et le script le lit aussi. La mission plus bas vérifie `sitemap.xml`, c'est pourquoi on en reste, pour le premier vol, au fichier écrit à la main. (point « sitemap »)
- **`web/public/robots.txt` :** (point « robots »)
  ```
  User-agent: *
  Allow: /

  Sitemap: https://<domain>/sitemap.xml
  ```
  La ligne `Sitemap:` a besoin de l'adresse complète. C'est par elle que les moteurs de recherche auprès desquels personne ne l'a soumis trouvent aussi le plan de situation.
- **Les messagers des IA :** qui veut apparaître dans les réponses des IA ne laisse pas leurs messagers dehors. Si les textes du site peuvent aussi être lus pour entraîner des modèles d'IA, c'est la personne qui le décide ; tu le lui demandes et tu l'inscris. On bloque un messager précis avec son propre bloc (`User-agent: GPTBot`, en dessous `Disallow: /`) ; chez Google, `Google-Extended` ne règle que l'entraînement, pas la recherche.

### 4. Données structurées : les informations sur l'activité, lisibles par les machines

Un bloc `application/ld+json` (JSON-LD, vocabulaire schema.org) dans l'en-tête HTML de la page d'accueil dit aux moteurs de recherche et aux assistants IA, sans qu'ils aient à deviner, qui c'est. Le type (`@type`) dépend de l'activité, le plus précisément possible : (point « strukturierte_daten »)

| Ce que la personne a | `@type` | Ce qu'on y met |
|---|---|---|
| Magasin, cabinet, studio, atelier, restaurant avec une adresse | `LocalBusiness` ou plus précis (`Restaurant`, `BikeStore`, `HairSalon`, `Dentist` …) | `name`, `address` (Google exige les deux), plus `telephone`, `url`, `openingHoursSpecification`, `geo` |
| Association, entreprise sans magasin, projet | `Organization` (pour une association aussi `SportsOrganization`, `NGO` …) | `name`, `url`, `logo`, contact |
| Une personne (indépendante, artiste) | `Person` | `name`, `jobTitle`, `url` |
| Cours et événements avec une date | `Event`, un bloc par événement | `name`, `startDate`, `location` |
| Produits avec un prix | `Product` avec `offers` | `name`, `image`, prix et monnaie |

Règles : dans le bloc ne figure que ce qui est aussi visible sur le site, avec les mêmes mots et les mêmes chiffres. Pas d'étoiles ni d'avis sur sa propre activité (`aggregateRating`, `review`) : Google ne les affiche pas pour `LocalBusiness` et `Organization` quand l'entreprise les gère elle-même, et les avis inventés sont interdits. Pas de `[Annahme: …]` ni de `[à compléter : …]` dans le bloc. La personne peut le vérifier après la mise en ligne avec le « Rich Results Test » de Google.

### 5. Pour les réponses des IA : des faits qu'on peut citer

Un assistant IA cite un site quand il y trouve une réponse claire et étayée. Pour ça, il ne faut pas de trucs et, d'après Google, pas non plus de fichiers particuliers : ce qui est bon pour la recherche l'est aussi pour les réponses par IA de Google. Ce qui aide en plus :

- **Une section de faits** sur la page d'accueil ou sous « À propos » : qui, quoi, pour qui, où, quand c'est ouvert, ce que ça coûte, comment on fait une demande. En phrases entières, qui sont justes à elles seules (« L'atelier vélo de Pérolles répare les vélos de toutes les marques, le plus souvent pour le lendemain »), pas seulement dans des images ou des tableaux.
- **Questions et réponses :** les cinq questions de l'étape 1, chacune avec une réponse en deux ou trois phrases, visibles sur le site. Seulement des questions qui sont vraiment posées ; c'est la personne qui confirme les réponses.
- **Sources :** chaque chiffre et chaque affirmation a une preuve : une indication propre avec une date (« état novembre 2026 ») ou un lien vers la source. Ce qui ne peut pas être prouvé tombe.
- **Partout les mêmes informations :** le nom, l'adresse, le téléphone et les horaires d'ouverture sont écrits sur le site, dans les données structurées, dans le profil d'entreprise et dans les annuaires de façon identique, caractère pour caractère.
- **`web/public/llms.txt` :** un bref aperçu pour les assistants IA, en Markdown : d'abord `# <nom>`, puis un résumé sous forme de citation (`> …`), puis sous `## Pages` les pages les plus importantes sous forme de liens avec une demi-phrase. Seulement des faits vérifiés, rien qui ne figure pas aussi sur le site. Pour être honnête : c'est une proposition (llmstxt.org), pas un standard ; Google dit qu'il n'y a pas besoin d'un tel fichier, et il n'est pas établi que d'autres assistants le lisent. Il coûte cinq minutes et ne fait pas de mal. (point « llms_txt »)

  ```markdown
  # Atelier vélo de Pérolles

  > Réparations de vélos à Pérolles, à Fribourg, le plus souvent pour le lendemain. Ouvert du mardi au samedi.

  ## Pages

  - [Offre](https://<domain>/offre/): service et réparations avec les prix
  - [Contact](https://<domain>/contact/): adresse, horaires d'ouverture, téléphone
  ```

### 6. Rapide et léger, puis vérifier

Réduire les images (skill `inhalte`), charger seulement les polices et les scripts nécessaires : par page au plus 1 Mo avec tout ce qu'elle intègre de façon fixe. (point « gewicht »)

Ensuite, le script de ce skill vérifie le site construit, sans réseau et sans rien changer :

```bash
mkdir -p scripts && cp <dossier de ce skill>/sichtbar-pruefen.mjs scripts/
# dossier inconnu : curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/seo-grundlagen/sichtbar-pruefen.mjs -o scripts/sichtbar-pruefen.mjs
(cd web && npm run build) && node scripts/sichtbar-pruefen.mjs        # le site construit dans seite/ (sinon dist/)
node scripts/sichtbar-pruefen.mjs --json                               # la même chose en JSON, avec les douze noms
```

Il annonce douze points avec un feu, sous des noms fixes (les mêmes dans toutes les langues) : « titel », « beschreibung », « h1 », « bilder », « sitemap », « robots », « kanonisch », « strukturierte_daten », « open_graph », « llms_txt », « gewicht » et « indexnow ». Rouge veut dire : ça empêche ou fausse le fait d'être trouvé ; corriger, reconstruire, revérifier. Jaune veut dire : recommandé. Ce que le script ne peut pas voir, tu le dis honnêtement à la personne : si les faits sont justes, si d'autres font des liens vers elle, et tout ce qui ne se fait que dans ses comptes. En plus, dans Chrome, Lighthouse (clic droit, « Inspecter », « Lighthouse », catégories « SEO » et « Performances ») ; à la construction, `pruefen.mjs` le mesure déjà (skill `webseite-bauen`).

### 7. Google Search Console : prévenir le messager

Après la mise en ligne. La Search Console est la fenêtre par laquelle la personne voit ce que Google sait de son site. Voici comment faire (vérifié le 10.11.2026 dans l'aide de Google) :

1. La personne ouvre search.google.com/search-console, se connecte avec son compte Google et ajoute son site. Il y a deux types : **Domaine** (tout ce qui est sous le domaine, possible seulement avec une entrée dans l'annuaire du domaine, le DNS) et **Préfixe de l'URL** (exactement une adresse comme `https://www.<domain>/`, possible aussi avec un fichier).
2. **Propriété par fichier** (préfixe de l'URL) : Google lui donne un petit fichier à télécharger. Elle le met pour toi dans le dossier du projet, tu le places tel quel dans `web/public/` (le nom et le contenu restent comme ils sont), puis le site retourne en ligne avec ce fichier (skill `webseite-aendern` : validation de la personne, et seulement ensuite le push). Tu vérifies que le fichier répond à son adresse ; c'est la personne qui clique sur « Confirmer ».
3. **Propriété par entrée DNS** (domaine ou préfixe de l'URL) : Google montre une entrée TXT. La personne l'inscrit là où son domaine est géré (skill `domain` ; chez Albatros, exactement comme la preuve TXT `_albatros`), puis elle clique sur « Confirmer ». Il peut se passer des minutes ou des heures avant que l'entrée soit visible.
4. **Le fichier ou l'entrée restent pour toujours :** Google revérifie régulièrement. Qui les enlève perd la confirmation.
5. **Soumettre la sitemap :** sous « Sitemaps », la personne inscrit l'adresse de la sitemap (`https://<domain>/sitemap.xml`). C'est une indication pour Google, pas une garantie.
6. Après quelques jours, « Pages » montre ce qui a été repris et ce qui ne l'a pas été, avec la raison. Elle vérifie des adresses précises avec l'« Inspection de l'URL ».

Sans propre domaine (l'adresse d'Albatros), seul marche le chemin **Préfixe de l'URL**, avec un fichier ou avec la balise `<meta name="google-site-verification" …>` dans l'en-tête HTML de la page d'accueil, car le DNS de l'adresse est géré par Albatros.

### 8. Bing Webmaster Tools

Bing alimente aussi d'autres recherches et quelques assistants IA. Voici comment faire (vérifié le 10.11.2026 dans l'aide et sur le blog de Bing) :

1. La personne ouvre bing.com/webmasters et se connecte avec son compte Microsoft.
2. **Le plus simple : importer depuis la Search Console.** Elle choisit « Importer » et autorise elle-même Bing à accéder à sa Search Console. Le site est alors confirmé sans autre preuve ; Bing compare régulièrement avec Google. Cette autorisation, elle seule la donne, dans son navigateur web.
3. **Ou à la main :** le fichier `BingSiteAuth.xml` dans `web/public/` (comme pour Google, tel quel), ou la balise `<meta name="msvalidate.01" content="…">` dans l'en-tête HTML de la page d'accueil, ou une entrée DNS que Bing affiche dans le compte. Puis elle clique sur « Confirmer ».
4. Sous « Sitemaps », elle soumet la même sitemap.

### 9. IndexNow : annoncer tout de suite les pages nouvelles et modifiées

IndexNow est une sonnette pour les moteurs de recherche : au lieu d'attendre que le messager passe, le site annonce lui-même ce qui est nouveau. Ça vaut pour Bing et d'autres (d'après indexnow.org le 10.11.2026 : Amazon, Bing, Naver, Seznam.cz, Yandex, Yep ; une annonce à l'un va à tous), pas pour Google. Une annonce est une indication, pas une garantie.

1. **Clé :** 8 à 128 caractères parmi `a–z`, `A–Z`, `0–9` et `-`. C'est toi qui la génères : `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`.
2. **Fichier de clé :** `web/public/<clé>.txt`, avec pour contenu exactement la clé. La clé n'est pas un secret, elle est à découvert sur Internet ; elle prouve seulement que l'annonce vient de ce site. Chaque adresse (aussi avec et sans `www`) a besoin de son propre fichier. (point « indexnow »)
3. **Annoncer**, seulement quand le site est en ligne avec le fichier de clé, et seulement avec le oui de la personne, car les adresses de son site vont alors à des tiers :
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' "https://api.indexnow.org/indexnow?url=https://<domain>/&key=<clé>"
   ```
   200 veut dire accepté, 202 accepté et la clé est encore en cours de vérification, 403 la clé ne correspond pas au fichier, 422 l'adresse n'appartient pas à cette clé, 429 trop d'annonces. Plusieurs adresses passent dans une seule annonce en JSON (`host`, `key`, `urlList`, jusqu'à 10 000 adresses).
4. On annonce ce qui est nouveau, modifié ou supprimé, pas tout chaque jour. Si la personne publie avec le programme Albatros, la grande étape « Devenir visible » dit si l'annonce y part déjà avec ; dans ce cas, tu n'annonces pas à double.

### 10. Pour les commerces locaux : le profil d'entreprise

- Adresse, téléphone et horaires d'ouverture en texte sur le site (pas seulement dans une image), écrits partout de la même façon.
- **Profil d'entreprise sur Google** (autrefois « Google My Business ») : avec lui, le commerce apparaît sur Google Maps et à droite à côté de la recherche. La personne le crée elle-même (google.com/business) et le confirme elle-même, selon le commerce par courrier, par téléphone ou par vidéo ; ça peut prendre des jours. Les mêmes informations que sur le site web, inscrire l'adresse du site web. Les avis y viennent de vraies clientes et de vrais clients ; on a le droit d'en demander, jamais d'en acheter ni d'en écrire soi-même.
- Une indication, rien de plus : tu ne crées pas le profil et tu ne t'y connectes pas.

### 11. Rassembler des panneaux indicateurs

De vrais liens depuis des endroits qui conviennent : l'annuaire du quartier ou de l'association professionnelle, les partenaires, les médias locaux, les sociétés locales. Pas de liens achetés. Chaque mention avec les mêmes informations que sur le site aide aussi les assistants IA : ils croient plus volontiers ce qui est écrit pareil à plusieurs endroits.

## Pièges

- Promettre un classement : personne ne le peut.
- Inventer des étoiles, des avis ou des chiffres, même « juste comme exemple » : c'est une tromperie (LCD) et ça finit par se savoir.
- Des informations dans le JSON-LD qui ne figurent pas sur le site ou qui y sont formulées autrement.
- Supprimer le fichier de vérification de Google ou de Bing après la confirmation : la confirmation est alors perdue.
- Accepter les données d'accès de la personne ou cliquer sur « Confirmer » à sa place : cela, elle seule le fait.
- Oublier un `robots.txt` avec `Disallow: /` datant de la construction : alors personne ne trouve le site.
- La sitemap avec une autre adresse que le site (avec au lieu de sans `www`, `http` au lieu de `https`).

## Vérifier la mission

Journal de bord et tapis roulant (skills `git-logbuch`, `pipeline`), puis `mission_pruefen` avec `webseite-09-seo-grundlagen`. La vérification regarde si `https://{name}.aufwind.sh/sitemap.xml` et `/robots.txt` répondent.

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « panneaux indicateurs et plan de ville », qui en redit l'essentiel. Ensuite : ce qui est fait (les douze points avec leur feu), où se trouve le résultat, ce que la personne doit faire elle-même dans ses comptes (Search Console, Bing, profil d'entreprise) et ce qui vient ensuite. Dis honnêtement que ça peut prendre des semaines.
