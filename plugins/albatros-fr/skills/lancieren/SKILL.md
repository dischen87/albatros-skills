---
name: lancieren
description: "Met en ligne le site validé d'une personne sans connaissances préalables, en deux parties. Domicile (P11) : toujours la même question, Albatros (Light sans brique, Pilot avec brique) ou par soi-même, prix seulement depuis konto_status, upgrade_link avec bestaetigt seulement après le choix, clé SSH, seite_erstellen ou server_erstellen ; par soi-même GitHub Pages, Cloudflare Pages, Netlify ou un propre serveur. Mise en ligne (P13) : seulement avec « Freigegeben: », le site validé au port ou chez le fournisseur, avec brique et connexion l'entrée devant, vérification de l'extérieur (pruefen.mjs --live et --tueren), domaine facultatif, go-live-check sur le parcours entreprise, annonce. Résultat : docs/lancieren.md, docs/live.md. Utilise ce skill après la validation et pour « mettre en ligne », « publier », « lancer », « où doit habiter mon site », « choisir un abonnement », « héberger moi-même »."
metadata:
  stand: 0.2.0
  quelle: '03efe9b03d67'
---

# Lancer : le domicile et l'inauguration

## L'image

La maison est construite, réceptionnée et validée. Maintenant viennent deux choses, dans cet ordre. D'abord, tu décides où elle se trouve et tu vas chercher la clé : le **domicile**. Sur le terrain, il n'y a ensuite qu'une maison témoin (le modèle d'Albatros). Quand la boîte aux lettres et le détecteur de fumée sont posés (skill `betrieb`), vient l'**inauguration** avec un ruban devant la porte : exactement la maison validée emménage, quelqu'un vérifie depuis la rue que tout joue, et les premiers invités l'apprennent.

**Comment utiliser l'image :** une phrase sur l'image dans ta première réponse, et laquelle des deux parties est maintenant à faire.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Les débuts de ligne dans les fichiers de `docs/` (`Wohnort:`, `Grund:`, `Adresse:`, `Freigegeben:`, `Live seit:`, `Geprüft:`, `Angekündigt:`) restent en allemand, comme les marques `[Annahme: …]` et `[offen: …]` : `lage` et les vérifications les cherchent tels quels. Ce qui suit les deux-points, tu l'écris en français.
- Les prix, tu ne les donnes que depuis `konto_status` (Albatros) ou depuis la page de prix d'un fournisseur que tu viens de lire, jamais de mémoire. Si tu ne l'as pas lue, tu dis « c'est sur la page de prix ».
- Cartes, mots de passe et clés privées ne vont jamais dans le chat. On paie sur la page de paiement, les comptes chez les fournisseurs, la personne les crée elle-même, dans le navigateur.
- Pas de pression : « par toi-même » est un bon choix quand ça convient. Tu recommandes le plus petit domicile qui suffit, avec une phrase de raison tirée du plan.
- Seul le site que la personne a validé va en ligne (`Freigegeben:` dans `docs/prd.md`), et seulement dans la deuxième partie.
- Au maximum deux questions par message. Ce que la personne doit voir (page de paiement, port, site en ligne), tu l'ouvres toi-même : `open <adresse>` (Linux `xdg-open`, Windows `start`).
- En mode `lernen` (ligne `Modus:` dans `docs/projekt.md`), la personne fait elle-même la clé SSH et le premier push ; en mode `machen`, tu le fais et tu l'expliques en une phrase.

## Partie 1 : le domicile (phase P11, `schritt: wohnort`)

### 1. Le site est-il validé ?

```bash
# la dernière ligne « Freigegeben: » compte : devant, une date avec l'année, nulle part une [Annahme]
# LC_ALL=C : pareil sur chaque ordinateur ; devant « Freigegeben: », seulement des espaces, >, * ou -, seuls les espaces normaux comptent
LC_ALL=C grep -E '^([^ -~]|[[:space:]>*-])*Freigegeben:' docs/prd.md | tail -n 1 | LC_ALL=C tr -d '*' \
  | LC_ALL=C grep -E '^[[:space:]>-]*Freigegeben:[[:space:]]*[0-9]{1,4}([./-]| .*[[:graph:]])' \
  | LC_ALL=C grep -E '(^|[^A-Za-z0-9_])(19|20)[0-9]{2}([^A-Za-z0-9_]|$)' \
  | LC_ALL=C grep -v -i -E '\[(annahme|hypoth(e|è|È)se|ipotesi|assumption)([^[:alnum:]]|$)'
# Windows : findstr /r /b /c:"Freigegeben: [0-9]" docs\prd.md | findstr /r /c:"19[0-9][0-9]" /c:"20[0-9][0-9]" | findstr /v /i /l /c:"[annahme" /c:"[hypoth" /c:"[ipotesi" /c:"[assumption"
```

Si ça ne montre aucune ligne, le site n'est pas encore validé : la ligne manque, ou dans la dernière ligne `Freigegeben:`, il n'y a pas de date avec l'année devant (par exemple « pas encore » ou « il manque encore 1 page »), ou il y a une `[Annahme: …]`. Si une ligne `Freigegeben:` avec une date est pourtant là, un signe spécial gêne, par exemple une espace insécable, « • » ou « ✓ » : dans cette ligne devant la date ou dedans, ou devant `Freigegeben:` dans une ligne plus bas (la commande prend alors celle-ci comme la dernière). Dans la ligne avec la date, tu remplaces une espace spéciale par une espace normale et tu enlèves les autres signes spéciaux devant la date ; la date et les mots de la personne restent, puis tu vérifies encore une fois. Si le signe est dans une ligne plus bas, tu demandes à la personne si la validation est toujours valable ; seulement après son oui, tu écris à la fin une nouvelle ligne `Freigegeben: <JJ.MM.AAAA>, « <ses mots> »`. Sous Windows, `findstr` montre chaque ligne qui correspond ; elle ne compte que si c'est la dernière ligne `Freigegeben:` de `docs/prd.md`. Alors tu le dis honnêtement : d'abord vient la visite avec la validation (skill `webseite-bauen`, étape 6). Si la personne veut quand même déjà choisir le domicile, c'est possible ; le site n'emménagera qu'après la validation. Mais tu n'écris `docs/lancieren.md` et tu n'annonces `wohnort` qu'après la validation : sinon le plan de vol compte le domicile, et la question de la validation disparaît.

### 2. La question, toujours la même

Avant de demander, tu rassembles les bases : `konto_status` (abonnement et prix de Light et Pilot), dans `docs/plan.md` la ligne `Setup:` et dans `docs/stack.md` la ligne de la brique. Ensuite, tu montres les trois domiciles dans un petit tableau, avec les prix tirés de `konto_status` :

| Domicile | convient si | coûte | ce que tu fais toi-même |
|---|---|---|---|
| Albatros Light | le site n'a pas besoin de brique (textes, images, contact par e-mail) | CHF … par mois | rien : ce que tu envoies au port est en ligne peu après |
| Albatros Pilot | une brique tourne (inscription, réservation, connexion) ou tu veux un propre serveur | CHF … par mois | peu : tapis roulant et photos quotidiennes du serveur sont là |
| par toi-même | tu veux tout avoir en main et tu as du temps pour l'entretien | chez le fournisseur | compte, installation, sauvegarde et surveillance |

Ajoute une phrase de recommandation avec une raison tirée de `docs/plan.md` (`Setup:`).

**Avec connexion :** si le projet a une brique avec connexion (recette `mitglieder` ; on le voit à `Zugang:` dans `docs/plan.md` et à `Baustein:` dans `docs/stack.md`), tu recommandes Pilot ou par toi-même avec un propre serveur, jamais Light, et tu nommes tout de suite l'étape **entrée** (Eingang) : s'il y aura devant le site une entrée avec une seule connexion pour toutes les parties, vous le clarifiez dans l'exploitation (skill `betrieb`, ligne `Eingang:`, selon les critères du skill `bausteine`, section « Une entrée pour tout ? »). Elle est installée à la mise en ligne (`bausteine/eingang`) ; ensuite, le site web n'est plus accessible que derrière l'entrée.

Puis la question, seule dans le message :

> Où ton site doit-il habiter : chez Albatros (Light sans brique, Pilot avec ton propre serveur) ou est-ce que tu t'en charges toi-même ?

Jusqu'ici, chez Albatros, tout était gratuit. Si la personne demande pourquoi ça coûte maintenant, tu dis : une place sur Internet a besoin d'un ordinateur qui tourne jour et nuit.

### 3a. Chez Albatros : Light ou Pilot

1. **L'abonnement seulement après le choix :** quand la personne a choisi Light ou Pilot, tu vas chercher le lien avec `upgrade_link`, avec `stufe` (`light` ou `pilot`) et `bestaetigt: true`. Avant, tu n'appelles jamais l'outil. Donne-lui le lien et ouvre-le : elle tape sa carte seulement là. Si un abonnement tourne déjà, c'est le lien vers le portail client (par exemple pour passer de Light à Pilot). Ensuite `konto_status`, jusqu'à ce que l'abonnement soit actif.
2. **Clé de la maison et serrure :** suis le skill `ssh-schluessel`. Avec Light, la serrure ouvre le port pour le journal de bord, avec Pilot aussi la porte du serveur. Moment d'apprentissage : ce qu'est une clé SSH, avec l'image de la serrure et de la clé. En mode `lernen`, la personne crée elle-même la clé, ensuite tu annonces `verstanden_melden` (mission `flugschule-16-wohnort`, type `selbst`).
3. **Le nom de l'adresse :** il fait partie de `https://<name>.aufwind.sh` (3 à 32 caractères : minuscules, chiffres, trait d'union). Propose-le à partir du nom du projet (`docs/projekt.md`, dans `docs/konzept.md` la ligne `Name:`) et demande s'il convient.
4. **Site ou serveur :** avec Light `seite_erstellen`, avec Pilot `server_erstellen`, chaque fois avec `name`, la serrure (`schluessel`, seulement le contenu du fichier `.pub`) et `sprache` (la langue de la conversation, ici `fr`). Un serveur prend en général une à deux minutes : demande avec `konto_status` jusqu'à ce qu'il soit prêt. Si le nom dans la réponse est différent, dis-le tout de suite.
5. **Regarder :** ouvre `https://<name>.aufwind.sh` avec la personne. Il y a maintenant le modèle d'Albatros, pas son site. Dis-le clairement : son site validé n'emménage qu'à la mise en ligne.

### 3b. Par toi-même

La personne met elle-même le site en ligne. Albatros reste gratuit pour elle (île, skills) ; seuls les outils pour serveur, port et domaine font partie d'un abonnement. Comment ça se passe dépend de la brique :

- **Sans brique (un site statique) :** tout fournisseur pour sites statiques livre le dossier `seite/`. Trois chemins répandus, chacun avec un compte chez le fournisseur, que la personne crée elle-même :
  - **GitHub Pages :** le journal de bord va chez GitHub, un petit tapis roulant là-bas livre `seite/`. C'est gratuit avec un dépôt public : alors tout le monde voit aussi `docs/` avec le plan et le concept. Pour un dépôt privé, il faut un compte payant chez GitHub (page de prix). Sans propre domaine, le site se trouve sous `https://<utilisateur>.github.io/<depot>/`, donc dans un sous-dossier : il faut alors dans `web/astro.config.mjs` `site: 'https://<utilisateur>.github.io'` et `base: '/<depot>'`, sinon les liens mènent dans le vide. Sans sous-dossier, c'est possible avec le dépôt `<utilisateur>.github.io` ou avec un propre domaine.
  - **Cloudflare Pages** ou **Netlify :** le journal de bord peut rester privé. Soit ils le récupèrent chez GitHub (dossier de sortie `seite`, pas d'étape de construction, parce que `seite/` est déjà construit dans le journal de bord), soit tu téléverses `seite/` directement depuis l'ordinateur, sans aucun dépôt. L'adresse est alors `https://<name>.pages.dev` ou `https://<name>.netlify.app`.
  - Les conditions et limites des offres gratuites changent : lis la page de prix du fournisseur avec la personne avant qu'elle décide.
- **Avec une brique :** une brique a besoin d'un serveur qui tourne jour et nuit. La personne loue alors un propre serveur et l'installe avec le modèle d'Albatros (`Dockerfile`, `compose.yaml` et `nginx.conf` du dossier `vorlage/` d'albatros-skills, plus Caddy pour HTTPS). C'est le déménagement dans sa propre maison : skill `landung`.

Aide au choix avec trois questions : le journal de bord peut-il être public ? Le site a-t-il besoin d'une brique ? Qui s'occupe de la sauvegarde et de la surveillance (skill `betrieb`) ? Tout le chemin sans Albatros est décrit dans le skill `landung`, partie « Direkt vom Computer ins Netz » (directement de l'ordinateur sur Internet). Dans cette partie, la personne crée seulement le compte et se connecte ; on ne téléverse qu'à la mise en ligne.

### 4. `docs/lancieren.md`

Seulement quand le site est validé (étape 1) :

```markdown
# Lancer

Wohnort: Albatros Light (ou Albatros Pilot, ou par toi-même : Netlify)
Grund: … (une phrase, tirée de docs/plan.md, ligne Setup:, et du souhait de la personne)
Adresse: https://<name>.aufwind.sh
Hafen: git@aufwind.sh:<name>/projekt.git (par toi-même : le dépôt chez GitHub, ou « pas de dépôt, téléversement depuis l'ordinateur »)
Gewählt: <date>
```

Si, par toi-même, l'adresse n'est connue qu'après le premier téléversement, il y a `[offen: kommt beim Live schalten]` (ouvert : vient à la mise en ligne). Ensuite, l'entrée dans le journal de bord (`git add docs/lancieren.md && git commit -m "Domicile : <domicile>"`) et `schritt_melden` avec `wohnort` et `sprache`. Si l'outil manque ou ne connaît pas l'étape, on continue sans île. En mode `lernen`, tu poses maintenant les questions de contrôle de la leçon `flugschule-16-wohnort`, au maximum deux par message (autres questions comprises) : d'abord « Qu'est-ce qui distingue Light, Pilot et « par toi-même » ? » et « Qu'est-ce qu'une clé SSH, en une phrase ? », après la réponse de la personne « Ton site est-il déjà en ligne après cette étape ? » Elles sont ici parce que `lage` et `mission_holen` ne les montrent plus après `wohnort`. Tu n'annonces `verstanden_melden` (type `kontrollfrage`) qu'après ses réponses.

On continue avec le skill `betrieb` : boîte aux lettres, détecteur de fumée et porte d'entrée, avant que les invités arrivent.

## Partie 2 : la mise en ligne (Live schalten) (phase P13, `schritt: hafen`, `fliessband`, `live`, `domain`)

Seulement quand `docs/betrieb.md` a toutes ses lignes (skill `betrieb`). S'il manque, tu vas d'abord là-bas.

### 1. Seulement le site validé

```bash
# la validation de la visite, comme dans la partie 1, étape 1 (la commande pour Windows y est aussi)
LC_ALL=C grep -E '^([^ -~]|[[:space:]>*-])*Freigegeben:' docs/prd.md | tail -n 1 | LC_ALL=C tr -d '*' \
  | LC_ALL=C grep -E '^[[:space:]>-]*Freigegeben:[[:space:]]*[0-9]{1,4}([./-]| .*[[:graph:]])' \
  | LC_ALL=C grep -E '(^|[^A-Za-z0-9_])(19|20)[0-9]{2}([^A-Za-z0-9_]|$)' \
  | LC_ALL=C grep -v -i -E '\[(annahme|hypoth(e|è|È)se|ipotesi|assumption)([^[:alnum:]]|$)'
git status --short seite web design                       # vide : rien de non enregistré sur le site
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
```

- **Pas de ligne `Freigegeben:` avec la date devant :** rien ne va en ligne. Retour au skill `webseite-bauen`, étape 6.
- **Changé depuis la validation** (pas de sortie « Seite wie freigegeben », site comme validé) : la personne regarde le site modifié en local et le valide à nouveau (nouvelle ligne `Freigegeben:`, `git tag -f freigegeben`). Seulement ensuite on continue.
- **Pas de tag `freigegeben`** (projets plus anciens) : montre le site en local à la personne et demande : « Est-ce exactement le site que tu as validé ? » Après le oui, tu poses le tag (`git tag freigegeben`).

### 2. Au port ou chez le fournisseur (`schritt: hafen`)

#### Chez Albatros

Au port, il y a depuis le domicile le modèle, une entrée. Le journal de bord sur l'ordinateur a son propre début. Tu relies les deux, sans cloner à nouveau et sans copier de fichiers (skill `git-logbuch`, partie « Logbuch ohne Hafen ») :

```bash
git remote -v                                                    # y a-t-il déjà un origin ? alors le nom hafen au lieu d'origin
git remote add origin git@aufwind.sh:<name>/projekt.git          # adresse tirée de docs/lancieren.md ou de konto_status
git fetch origin
git merge origin/main --allow-unrelated-histories -X ours -m "Modèle du port repris, le site validé reste"
git diff --quiet freigegeben HEAD -- seite && echo "Seite unverändert"
```

Dis-le à la personne avec l'image : le modèle est repris une fois dans le journal de bord. Là où les deux ont le même fichier (`seite/index.html`, `.gitignore`), c'est le sien qui reste. S'y ajoutent les fichiers dont le tapis roulant de Pilot a besoin (`Dockerfile`, `compose.yaml`, `nginx.conf`, `.github/workflows/deploy.yml`) ; avec Light, ils dorment. Si, après la fusion, il n'y a pas « Seite unverändert » (site inchangé), tu ne pousses pas et tu regardes avec `git diff freigegeben HEAD -- seite`.

**Avec une brique (Pilot), avant le push :** maintenant, le `compose.yaml` du modèle est dans le journal de bord, et tu branches les briques comme dans le skill `bausteine`, section 4 « Au lancement, avec Pilot » : d'abord une photo du serveur (outil `snapshot`, nom `vor-baustein`), puis `include:` dans `compose.yaml`. Si `docs/betrieb.md` dit `Eingang: ja` (`grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` montre la ligne), l'étape **entrée** s'y ajoute : la ligne `- bausteine/eingang/compose.yaml` sous `include:`, et pour le service `webseite`, les lignes `ports:` et `- "80:80"` disparaissent. Le port 80 est alors à l'entrée, le site web n'est plus accessible que derrière elle. Avant, `bun bausteine/eingang/test.ts` doit annoncer « Alles grün ». Sans connexion, ou avec `Eingang: nicht nötig`, `compose.yaml` reste comme dans le modèle. Ensuite, tu l'inscris dans le journal de bord.

```bash
git push -u origin main
```

Ensuite, tu ouvres le port dans le navigateur (`open https://code.aufwind.sh/<name>/projekt`) et tu annonces `hafen`.

#### Par toi-même, avec GitHub (Selbst, mit GitHub)

La personne se connecte avec `gh auth login` dans le navigateur. Pour GitHub Pages, tu crées avant le tapis roulant, `.github/workflows/seite.yml` :

```yaml
name: Seite
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false            # ne jamais interrompre une livraison en cours
jobs:
  ausliefern:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.pages.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: seite                  # le dossier construit, tel qu'il a été validé
      - id: pages
        uses: actions/deploy-pages@v4
```

Ensuite, emporter le journal de bord : `gh repo create <depot> --private --source . --remote origin --push` (pour GitHub Pages sans compte payant `--public`, après que la personne sait qu'alors `docs/` est aussi public). Pour GitHub Pages, la personne règle sous Settings, Pages la source sur « GitHub Actions ». Ensuite, tu annonces `hafen`.

#### Par toi-même, sans dépôt (Selbst, ohne Repo)

Tu téléverses `seite/` directement, après que la personne s'est connectée dans le navigateur : `npx netlify-cli deploy --dir=seite --prod` ou `npx wrangler pages deploy seite --project-name=<name>`. Le journal de bord reste sur l'ordinateur ; sa sauvegarde figure dans `docs/betrieb.md`. Il n'y a alors pas de port, tu n'annonces pas `hafen`.

### 3. Tapis roulant (`schritt: fliessband`)

- **Light :** il n'y en a pas : environ une minute après le push, Albatros montre le dossier `seite/`.
- **Pilot :** le push lance le tapis roulant de `.github/workflows/deploy.yml`. Ouvre `https://code.aufwind.sh/<name>/projekt/actions` et regarde avec la personne. Vert : annoncer `fliessband`. Rouge : skill `pipeline`, partie « Wenn das Band rot ist » (quand le tapis est rouge).
- **Par toi-même :** chez GitHub Pages sous « Actions », chez Netlify et Cloudflare dans leur liste des livraisons. Vert : annoncer `fliessband`. Pour le téléversement sans dépôt, il n'y a pas de tapis roulant.

### 4. Vérifier de l'extérieur (`schritt: live`)

**Tu regardes toi-même, la personne n'attend jamais.** L'adresse répond déjà avant (avec le modèle). C'est pourquoi tu attends le titre du site, tel qu'il figure dans `seite/index.html` entre `<title>` et `</title>`, au maximum trois minutes :

```bash
for i in $(seq 12); do curl -s <adresse> | grep -qF "<titre de ton site>" && echo "Le site est là" && break; sleep 15; done
node scripts/pruefen.mjs --live <adresse>
node scripts/pruefen.mjs --tueren <adresse>
```

L'adresse figure dans `docs/lancieren.md` (`Adresse:`). N'est en ligne que ce qui a été vérifié de l'extérieur : si rien n'est rouge avec `--live` (titre comme construit, mentions légales et protection des données accessibles, accès, Lighthouse) ni avec `--tueren`, tu annonces `live`, tu ouvres l'adresse avec la personne et tu compares avec les photos de la vérification.

- **Avec l'entrée :** dans `docs/tueren.txt` figurent les chemins protégés avec 401 (sans connexion, par exemple `/intern/ 401`), en plus `/_/ 404` et `/api/collections/_SUPERUSERS/auth-methods 404` : la connexion de l'administration reste fermée depuis l'extérieur. Les listes de PocketBase avec une règle (par exemple `/api/collections/users/records`) répondent aux visiteurs 200 avec une liste vide, pas 401 ni 403 ; toutes les portes par recette sont dans le skill `bausteine`, partie « Türen der Bausteine ». Si le fichier date encore de la construction sans entrée, tu l'adaptes avant la vérification. C'est seulement quand `--tueren` montre exactement cela et que la page d'accueil donne 200 que le site est vraiment derrière l'entrée.
- **Avec une brique, « en ligne » n'est pas encore « terminé » :** seulement quand les données sont dedans (par exemple les cours) et qu'une réservation de test en ligne a apporté son e-mail à sa propre adresse (skill `bausteine`), tu dis à la personne qu'elle peut partager le lien. D'ici là, tu dis honnêtement ce qui manque encore.

#### Toujours pas là après trois minutes (Nach drei Minuten noch nicht da)

Avec Light, `konto_status` montre si le dernier état est en ligne ou ce qui manque. Souvent, `seite/index.html` manque au port parce que `seite/` figure dans un `.gitignore`. Avec Pilot, tu regardes sous « Actions » (skill `pipeline`), par toi-même dans la liste des livraisons du fournisseur. Corriger, nouvelle entrée, pousser, revérifier. Si la correction change le site lui-même, tu le montres d'abord à la personne et tu obtiens à nouveau la validation. Si ça ne marche toujours pas, tu dis ce que tu as vérifié et tu demandes au coach (`coach_fragen`).

### 5. Une propre adresse, facultative (`schritt: domain`)

Demande : « Ta propre adresse (domaine) maintenant, plus tard ou jamais ? » Ajoute : elle coûte chaque année et elle est facultative. Sa réponse va tout de suite dans `docs/live.md` (modèle à l'étape 8), dans la ligne `Eigene Domain:` : d'abord `jetzt`, `später` ou `nie` en allemand, puis, si elle le souhaite, une phrase en français, par exemple `Eigene Domain: später, quand le comité aura choisi le nom`. Maintenant : chez Albatros, tu suis le skill `domain` ; par toi-même, tu la relies chez le fournisseur (skill `landung`, partie « Direkt vom Computer ins Netz »). Quand `https://<domaine>` montre le site avec le cadenas, tu annonces `domain` et tu revérifies avec `pruefen.mjs --live https://<domaine>`.

**Avec connexion** (une brique avec connexion, par exemple un espace membres) : après le domaine, la personne se connecte une fois via `https://<domaine>`, sur la page de connexion. Avec l'entrée, il n'y a rien à ajouter dans `eingang.json` : elle accepte les connexions et les formulaires de l'adresse par laquelle le site est appelé. Si ça marche, le site accepte les connexions et les formulaires aussi via la nouvelle adresse. Si la page dit que l'e-mail ou le mot de passe est faux alors que les deux sont justes, ou si un formulaire ne passe pas via le domaine : chez Albatros, tu demandes au coach (`coach_fragen`) et tu dis ce que tu as vérifié ; d'ici là, la personne se connecte via `https://<name>.aufwind.sh`. Par toi-même, il n'y a pas d'adresse sur aufwind.sh, et sans abonnement pas de coach : la personne écrit alors un e-mail à hallo@albatros.build, avec ce que tu as vérifié (ce qui doit y figurer et ce qui n'y va jamais, c'est dans le skill `lotse`, section « Signaler les lacunes ») ; d'ici là, elle se connecte via l'adresse qui valait avant le domaine.

**Si le site en remplace un existant** (`docs/bestand.md`, skill `webseite-modernisieren`) : l'ancien domaine pointe ensuite sur le nouveau site. Chaque ancienne adresse de `docs/bestand.md` qui n'existe plus reçoit une redirection vers le bon nouvel endroit (dans Astro sous `redirects` dans `web/astro.config.mjs`). Les entrées pour l'e-mail (MX), tu n'y touches jamais.

### 6. Parcours entreprise : le contrôle avant le vol

Sur le parcours entreprise, tu vas chercher avec `methode` la méthode `go-live-check` et tu la suis : elle lit l'adresse dans `docs/lancieren.md` et écrit son résultat dans `docs/live.md` sous `Geprüft:`. La méthode existe avec Light et Pilot. Si le site habite « par toi-même », `methode` ne la donne pas sans abonnement, et la vérification par le serveur d'Albatros n'est pas possible : dis-le honnêtement et passe avec la personne la vérification de l'étape 4, plus formulaire, e-mails et caisse essayés soi-même.

### 7. À qui le dis-tu en premier ?

Demande : « À qui le dis-tu en premier ? » Le premier fan ne vient pas tout seul. Aide avec un court texte que la personne envoie elle-même (par exemple à trois personnes que ça intéresse). Toi, tu n'envoies rien.

### 8. `docs/live.md`

```markdown
# En ligne

Live seit: <date>
Adresse: https://… (l'adresse sur Internet ; avec un propre domaine, celui-ci, dès qu'il est actif)
Eigene Domain: <jetzt | später | nie>, <une phrase, si la personne en dit une>
Geprüft: <date>, pruefen.mjs --live sans rouge, portes comme prévu (docs/pruefung/messwerte-live.json)
Angekündigt: <date>, <à qui>
```

Après `Eigene Domain:` vient d'abord `jetzt`, `später` ou `nie`, en allemand, comme la personne a répondu à l'étape 5 ; `Adresse:` est toujours l'adresse sur Internet. Ensuite, l'entrée dans le journal de bord, le push comme plus haut, et la mission. En mode `lernen`, tu poses maintenant les questions de contrôle de la leçon `flugschule-18-live-schalten`, au maximum deux par message (autres questions comprises) : d'abord « Quel site va en ligne lors de la mise en ligne ? » et « Quand ton site est-il vraiment en ligne ? », après la réponse de la personne « Pourquoi le dis-tu d'abord à quelqu'un ? » Elles sont ici parce que `lage` et `mission_holen` ne les montrent plus après `live`. Tu n'annonces `verstanden_melden` (type `kontrollfrage`) qu'après ses réponses.

Si la personne veut ensuite autre chose, le skill `webseite-aendern` s'applique : petit (changer en local, montrer, validation, push) ou grand (complément au plan, ébauche, autorisation de construire, construire, montrer, validation, push).

Ne va en ligne que ce qui appartient à la personne ou ce pour quoi elle a l'autorisation (skill `webseite-modernisieren`, partie « Rechte »).

## Pièges

- `upgrade_link` avant le choix de la personne, ou des prix de mémoire.
- Pousser déjà son propre site au moment du domicile : avec Light, chaque push est tout de suite en ligne, et le site est alors sur Internet avant la boîte aux lettres et le détecteur de fumée.
- Annoncer `wohnort` ou écrire `docs/lancieren.md` avant que le site soit validé : alors le plan de vol saute par-dessus la validation.
- Cloner le journal de bord depuis le port et y copier le site : les entrées de la construction sont alors perdues. Relier au lieu de copier.
- `git push --force` pour écraser le port : jamais. Fusionner comme plus haut.
- Pousser alors que le site a changé depuis la validation.
- Dire « c'est en ligne » sans avoir vérifié soi-même de l'extérieur.
- Avec l'entrée, laisser `ports:` dans le service `webseite` : on pourrait alors contourner l'entrée.
- Un dépôt public pour GitHub Pages, sans dire à la personne qu'alors `docs/` est aussi public.

## Vérifier la mission

- Après la partie 1 : `mission_pruefen` avec `flugschule-16-wohnort` (île à « Wohnort »). Chez Albatros aussi `flugschule-01-start` : la vérification regarde si `https://<name>.aufwind.sh` répond.
- Après la partie 2 : `mission_pruefen` avec `flugschule-18-live-schalten` (île à « Live »), chez Albatros aussi `flugschule-04-git-logbuch`, avec Pilot `flugschule-05-pipeline`.

## Message de fin

Ton dernier message dans cette étape commence par une phrase sur l'image « le domicile et l'inauguration », qui redit l'essentiel. Ensuite : ce qui est réussi (domicile choisi ou site en ligne), où se trouve le résultat (`docs/lancieren.md`, `docs/live.md`, l'adresse), ce qui est encore ouvert et ce qui vient ensuite (après le domicile, le skill `betrieb` ; après la mise en ligne, les premiers invités).
