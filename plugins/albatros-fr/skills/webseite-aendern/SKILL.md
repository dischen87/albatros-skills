---
name: webseite-aendern
description: 'Modifie avec une personne sans connaissances préalables son site web terminé, qui se trouve au port d''Albatros, construit par elle-même ou par Albatros, avec sa propre IA : récupérer le journal de bord au port, lire d''abord docs/ (le système de design, la stack technique et le PRD sont les règles), faire la modification dans le système de design existant, l''inscrire dans le PRD comme critères de réception, construire, vérifier avec pruefen.mjs, montrer avant et après, autorisation, push et contrôle en ligne. Les petits souhaits (texte, date, image) vont vite, les plus grands (nouvelle page, nouvelle fonction) passent par le PRD et la vérification. Utilise ce skill quand on dit « change mon site », « nouvelle date », « modifier un texte », « remplacer une image », « il manque … », « fais le site … », « il y a quelque chose de faux sur le site », et chaque fois que quelque chose doit changer sur un site sous name.aufwind.sh.'
---

# Modifier le site web : des travaux dans une maison habitée

## L'image

Des travaux dans une maison habitée : dans le classeur, il y a les plans et la liste des matériaux (`docs/`). Accrocher un tableau, ça va vite. Un nouveau mur a besoin d'un plan et d'une réception. Et on continue avec les mêmes matériaux, sinon ça fait rafistolé.

**Comment utiliser l'image :** une phrase sur l'image dans ta première réponse, avec ton estimation : petit souhait ou plus grand souhait.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Tutoiement, langage de tous les jours, phrases courtes. Ce que tu fais, tu le dis avant en une phrase.
- Les règles se trouvent dans `docs/` : système de design, stack technique et PRD. De nouvelles couleurs, polices, espacements ou un autre framework, seulement après un oui explicite de la personne, et alors d'abord dans le système de design.
- Rien ne va en ligne sans autorisation. Avec Light, le push est déjà la publication.
- Ce que la personne doit voir (avant et après, aperçu, site terminé), tu l'ouvres toi-même : `open <adresse ou fichier>` (Linux `xdg-open`, Windows `start`).
- La modification avec sa propre IA ne coûte rien de plus, seulement l'abonnement de l'IA chez le fournisseur. Si la personne préfère ne pas faire le souhait elle-même, dis-lui : « Si tu ne veux pas le faire toi-même, Albatros peut s'en charger pour CHF 29. Ça arrive bientôt dans le cockpit. »

## Déroulement

### 1. Récupérer le journal de bord au port

Le nom du site, c'est `konto_status` qui le donne. Si le journal de bord n'est pas encore sur cet ordinateur, tu le récupères (skill `git-logbuch`), sinon tu récupères le dernier état :

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # la première fois
cd {name} && git pull --rebase                          # chaque fois ensuite
(cd web && npm ci)                                      # outils de construction, absents du port
```

Si `git` échoue avec « Permission denied », la clé manque sur cet ordinateur (skill `ssh-schluessel`).

### 2. Lire d'abord les plans

Avant de changer quoi que ce soit, tu lis :

- `docs/designsystem.md` et `web/src/styles/tokens.css` : couleurs, polices, espacements, arrondis et composants.
- `docs/stack.md` : avec quoi le site est construit (en général Astro, au plus 50 KB de JavaScript par page).
- `docs/prd.md` : ce que le site doit savoir faire, avec les critères de réception.
- `docs/plan.md` ou `docs/bestand.md` : pour qui est le site.
- `web/src/data/*.json` : les listes comme les dates, les prix ou les sponsors.

Si `designsystem.md` ou `stack.md` manque (site plus ancien), tu les écris d'abord brièvement à partir de ce qui est là (`tokens.css`, `web/package.json`), et tu le dis à la personne.

### 3. Petit ou grand ?

- **Petit :** remplacer un texte, une date, un prix, un horaire d'ouverture, un lien ou une image, sur une page qui existe déjà. Ça va vite, sans maquette ni ébauches. Les dates et les listes, tu les changes dans `web/src/data/*.json`, pas dans le code de la page.
- **Grand :** une nouvelle page, une nouvelle fonction, une nouvelle rubrique ou une autre apparence. Pour ça, tu écris d'abord les critères de réception (étape 4) et tu attends le oui. Une nouvelle page reçoit d'abord une maquette en niveaux de gris (skill `webseite-bauen`, étape 2). Si la fonction a besoin d'un programme (liste d'inscription, login), c'est une brique avec Pilot (skill `bausteine`).

Dis à la personne en une phrase ce que c'est et comment ça continue.

### 4. Le souhait dans le PRD

Tout en bas de `docs/prd.md`, après les lignes `Validé :` et `Freigegeben:` de la première construction, le souhait s'ajoute comme nouveaux critères de réception. On voit ainsi que l'ancienne validation ne vaut pas pour le nouveau souhait :

```markdown
## Modifications

### <date> : <le souhait en une phrase>
- [ ] <vérifiable, par exemple « Sur /termine, il y a le concert de printemps : samedi 24 avril 2027, 19 h 30, église de Testdorf »>
- [ ] Seulement des valeurs du système de design, les critères de réception d'avant restent valables
```

Pour un grand souhait, tu montres d'abord les critères à la personne et, après son oui, tu inscris en dessous `Validé : <date> par <nom>`. Pour un petit, il suffit de les montrer à l'étape 5, avec le résultat.

### 5. Construire, vérifier, montrer avant et après

```bash
node scripts/pruefen.mjs --live https://{name}.aufwind.sh --nur aussehen --aus docs/pruefung/vorher   # photos d'avant
# … la modification dans web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                                # construire et vérifier
```

Si `scripts/pruefen.mjs` manque, tu le récupères comme dans le skill `webseite-bauen`, étape 7. Rouge veut dire : corriger et recommencer. Dans les rapports sous `docs/pruefung/`, tu ajoutes sous « Vérifié » une ligne avec la date et le souhait, et tu coches les nouveaux critères dans `docs/prd.md`. Ensuite, tu ouvres la page concernée avant et après, côte à côte, sur le natel et sur l'ordinateur :

```bash
open docs/pruefung/vorher/fotos/live-<page>-390.png docs/pruefung/fotos/<page>-390.png
open docs/pruefung/vorher/fotos/live-<page>-1440.png docs/pruefung/fotos/<page>-1440.png
```

### 6. Autorisation

Demande : « Est-ce que ça peut aller en ligne comme ça ? » Seulement après le oui, tu inscris sous le souhait `Freigegeben: <date> par <nom>` (le mot `Freigegeben:` reste en allemand). Si la personne veut encore changer quelque chose, on revient à l'étape 5.

### 7. Push et contrôle en ligne

Seulement tes propres modifications, ajoutées une par une (skill `git-logbuch`) :

```bash
git add web docs seite scripts && git commit -m "<le souhait en une phrase>" && git push
```

**Terminé veut dire visible.** Tu vérifies toi-même jusqu'à ce que la modification soit en ligne, trois minutes au plus, avec un texte tiré de la modification :

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/<page> | grep -qF "<nouveau texte>" && echo "La modification est là" && break; sleep 15; done
node scripts/pruefen.mjs --live https://{name}.aufwind.sh
```

Ensuite, tu ouvres la page avec la personne (`open https://{name}.aufwind.sh/<page>`). Si la modification n'est pas là après trois minutes, tu fais comme dans le skill `webseite-bauen`, étape 9 (« Toujours pas là après trois minutes »).

## Pièges

- Commencer sans `git pull` : il manque alors une modification faite ailleurs, et le push est refusé.
- Une nouvelle couleur « juste ici » : ça casse le système de design. Les nouvelles valeurs arrivent seulement avec un oui, et d'abord dans `tokens.css` et `designsystem.md`.
- Modifier dans `seite/` au lieu de `web/` : à la prochaine construction, la modification a disparu.
- Une date écrite directement dans le code au lieu de `web/src/data/` : la prochaine fois, on la cherche.
- Faire un push sans autorisation, ou dire « c'est en ligne » sans avoir vérifié toi-même.

## Message final

Ton dernier message commence par une phrase sur l'image « des travaux dans une maison habitée ». Ensuite : ce qui a changé, où on le voit (avec l'adresse), ce qui a été vérifié et s'il reste quelque chose d'ouvert.
