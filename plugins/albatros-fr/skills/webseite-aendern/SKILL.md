---
name: webseite-aendern
description: "Modifie avec une personne sans connaissances préalables son site web terminé, avec sa propre IA, qu'il soit au port d'Albatros ou qu'elle l'héberge elle-même : récupérer le journal de bord, lire d'abord docs/ (plan, système de design, stack technique, PRD, domicile), puis petit (texte, date, image : changer en local, montrer avant et après, validation, push) ou grand (nouvelle page, fonction, autre apparence : complément au plan, ébauche des pages modifiées, autorisation de construire, construire et vérifier, montrer, validation, push), toujours dans le système de design existant, puis vérifier en ligne. Utilise ce skill pour « modifie mon site », « nouvelle date », « changer un texte », « remplacer une image », « il manque … », « nouvelle page », « rends le site … », « il y a une erreur sur le site », et chaque fois que quelque chose doit changer sur un site en ligne."
metadata:
  stand: 0.2.0
  quelle: '1bdaf535ed2f'
---

# Modifier le site web : des travaux dans une maison habitée

## L'image

Des travaux dans une maison habitée : dans le classeur, il y a les plans et la liste des matériaux (`docs/`). Accrocher un tableau, ça va vite. Un nouveau mur a d'abord besoin d'un plan et d'un modèle que les habitants ont vu. Et on continue avec les mêmes matériaux, sinon ça fait rafistolé.

**Comment utiliser l'image :** une phrase là-dessus dans ta première réponse, avec ton estimation : petit ou grand souhait.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Les débuts de ligne dans les fichiers de `docs/` (`Freigegeben:`, `Freigegeben zum Bauen:`, `Abgeleitet aus:`, `Wohnort:`, `Adresse:`) restent en allemand : les vérifications les cherchent tels quels.
- Tutoiement, langage de tous les jours, phrases courtes. Ce que tu fais, tu le dis avant en une phrase.
- Les règles figurent dans `docs/` : plan, système de design, stack technique et PRD. De nouvelles couleurs, polices, espacements ou un autre framework, seulement après un oui explicite de la personne, et d'abord dans `design/tokens.css` (sites plus anciens : `web/src/styles/tokens.css`) et `docs/designsystem.md`.
- Rien ne va en ligne sans validation. Avec Light et chez la plupart des fournisseurs, le push est déjà la publication.
- Ce que la personne doit voir (avant et après, aperçu, ébauche, site terminé), tu l'ouvres toi-même : `open <adresse ou fichier>` (Linux `xdg-open`, Windows `start`).
- La modification avec sa propre IA est gratuite, il ne faut que l'abonnement de l'IA chez le fournisseur. Si la personne préfère ne pas faire le souhait elle-même et que le site habite chez Albatros avec Light, il y a « Nous le faisons pour toi » : elle le décrit, tu appelles `wunsch_melden`, la réponse donne le prix et le lien de paiement. Elle paie avant la réalisation, l'état figure sous `https://albatros.build/fr/cockpit/wuensche` (ouvre l'adresse pour elle). Avec son propre serveur (Pilot) ou par soi-même, ce n'est pas possible.

## Déroulement

### 1. Récupérer le journal de bord

Où le site habite figure dans `docs/lancieren.md` (ligne `Wohnort:`, adresse sous `Adresse:`), sinon `konto_status` le dit. C'est de là que dépend l'endroit où se trouve le journal de bord :

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # port d'Albatros, la première fois
gh repo clone <utilisateur>/<depot>                     # par soi-même, avec le journal de bord chez GitHub
git pull --rebase                                       # chaque fois suivante, dans le dossier du projet
(cd web && npm ci)                                      # outils de construction, ils ne sont pas dans le journal de bord
```

Si le journal de bord n'existe que sur cet ordinateur (par soi-même, sans dépôt), tu travailles là et tu ne récupères rien. Si `git` échoue avec « Permission denied », il manque la clé sur cet ordinateur (skill `ssh-schluessel`).

### 2. Lire d'abord les plans

Avant de changer quoi que ce soit, tu lis :

- `docs/designsystem.md` et `design/tokens.css` (sites plus anciens : `web/src/styles/tokens.css`) : couleurs, polices, espacements, arrondis et composants.
- `docs/stack.md` : avec quoi le site est construit (en général Astro, au maximum 50 Ko de JavaScript par page).
- `docs/prd.md` : ce que le site doit savoir faire, avec les critères d'acceptation, l'accès et la validation.
- `docs/plan.md` ou `docs/bestand.md` : pour qui est le site. `design/entwurf/`, s'il existe : le modèle des pages.
- `web/src/data/*.json` : les listes comme les dates, les prix ou les sponsors.

Si `designsystem.md` ou `stack.md` manque (site plus ancien), tu les écris d'abord brièvement à partir de ce qui existe (`tokens.css`, `web/package.json`) et tu le dis à la personne. Si `scripts/pruefen.mjs` manque, tu le récupères comme dans le skill `webseite-bauen`, étape 0.

### 3. Petit ou grand ?

- **Petit :** texte, date, prix, heure d'ouverture, lien ou une image sur une page existante. Le chemin : changer en local, montrer avant et après, validation, push (étapes 4 à 7). Les dates et les listes, tu les changes dans `web/src/data/*.json`, pas dans le code de la page.
- **Grand :** une nouvelle page, une nouvelle fonction, une nouvelle partie ou une autre apparence. Le chemin : complément au plan, ébauche des pages modifiées, autorisation de construire, construire et vérifier, montrer, validation, push (d'abord « Grand : plan et ébauche », puis les étapes 4 à 7). Si la fonction a besoin d'un programme (liste d'inscription, connexion), c'est une brique avec un propre serveur (skill `bausteine`) : si le site habite chez Light, ça veut dire passer à Pilot (skill `lancieren`) ; par soi-même, un propre serveur (skill `landung`).
- **Propre adresse** (`meinverein.ch` au lieu de `{name}.aufwind.sh`) : pas de travaux, mais le skill `domain`. Elle est facultative et coûte en plus chaque année.

Dis à la personne en une phrase ce que c'est et comment ça continue.

### Grand : plan et ébauche

1. **Complément au plan :** tout en bas de `docs/plan.md`, avec les débuts de ligne en allemand comme dans tout le plan :
   ```markdown
   ## Complément <date> : <le souhait en une phrase>
   Seiten: … (nouvelles ou modifiées)
   Funktionen: … (avec déroulement, confirmation, erreur et état vide)
   Zugang: … (qui a le droit de faire quoi change ? alors aussi docs/tueren.txt)
   ```
2. **Ébauche des pages modifiées** dans `design/entwurf/`, dans le système de design existant, avec de vrais textes (skill `entwurf`). La personne clique à travers, sur le natel et sur l'ordinateur.
3. **Autorisation de construire :** seulement après son oui, dans `docs/entwurf.md`, sous un titre pour le complément, la ligne `Freigegeben zum Bauen: <date> (« <ses mots> »)`. Ensuite, `node scripts/pruefen.mjs --vor-bau` doit se terminer par 0.
4. **Construire** comme dans le skill `webseite-bauen`, étape 4 : balisage et classes tirés de l'ébauche, tokens seulement depuis `design/tokens.css`.

### 4. Le souhait dans le PRD

Tout en bas de `docs/prd.md`, après la ligne `Freigegeben:` de la première construction (sur les sites plus anciens aussi `Abgenommen:`), le souhait s'ajoute comme nouveaux critères d'acceptation. Ainsi, on voit que l'ancienne validation ne vaut pas pour le nouveau souhait :

```markdown
## Changements

### <date> : <le souhait en une phrase>
- [ ] <vérifiable, p. ex. « Sur /termine figure le concert de printemps : samedi 24 avril 2027, 19 h 30, église de Testdorf »>
- [ ] Seulement des valeurs du système de design, les critères d'acceptation précédents restent valables
```

Pour un grand souhait, il y a au-dessus `Abgeleitet aus: docs/entwurf.md (Nachtrag <date>, Freigegeben zum Bauen: <date>)` : les critères découlent de l'ébauche que la personne a autorisée. Pour un petit, tu les montres à l'étape 5 avec le résultat.

### 5. Changer, construire, vérifier, montrer avant et après

```bash
node scripts/pruefen.mjs --live <adresse> --nur aussehen --aus docs/pruefung/vorher     # photos avant, adresse tirée de docs/lancieren.md
# … le changement dans web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                    # construire et vérifier
```

Pour un grand souhait, en plus `node scripts/pruefen.mjs --vergleich` (les pages modifiées comme dans l'ébauche) et, si l'accès change, `node scripts/pruefen.mjs --tueren`. Rouge veut dire : corriger et recommencer. Dans les rapports sous `docs/pruefung/`, tu ajoutes sous « Vérifié » une ligne avec la date et le souhait, et tu coches les nouveaux critères dans `docs/prd.md`. Ensuite, tu ouvres la page concernée avant et après côte à côte, sur le natel et sur l'ordinateur, et l'aperçu (`(cd web && npx astro preview --background)`, puis `open http://localhost:4321/<page>/`) :

```bash
open docs/pruefung/vorher/fotos/live-<page>-390.png docs/pruefung/fotos/<page>-390.png
open docs/pruefung/vorher/fotos/live-<page>-1440.png docs/pruefung/fotos/<page>-1440.png
```

Quand plus rien n'est rouge, le changement va dans le journal de bord, seulement avec ses propres fichiers (skill `git-logbuch`) : `git add web docs seite && git commit -m "<le souhait en une phrase>"`.

### 6. Validation

Demande : « Est-ce que ça peut aller en ligne comme ça ? » Seulement après le oui, tu inscris sous le souhait `Freigegeben: <date> (« <ses mots> »)` et tu fais l'entrée dans le journal de bord avec le repère de l'état validé :

```bash
git add docs/prd.md && git commit -m "Validé : <le souhait en une phrase>" && git tag -f freigegeben
```

Si la personne veut encore autre chose, on revient à l'étape 5.

### 7. Pousser et vérifier en ligne

Seul l'état validé va en ligne :

```bash
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
git push                                                                # port d'Albatros ou GitHub
```

S'il n'y a pas « Seite wie freigegeben » (site comme validé), quelque chose a encore changé après la validation : d'abord montrer et valider à nouveau. Si le site habite par soi-même, sans dépôt, tu téléverses `seite/` à nouveau comme à la mise en ligne (skill `lancieren`, partie 2, « Selbst, ohne Repo »).

**Terminé veut dire visible.** Tu regardes toi-même jusqu'à ce que le changement soit en ligne, au maximum trois minutes, avec un texte du changement :

```bash
for i in $(seq 12); do curl -s <adresse>/<page> | grep -qF "<nouveau texte>" && echo "Le changement est là" && break; sleep 15; done
node scripts/pruefen.mjs --live <adresse>
```

Ensuite, tu ouvres la page avec la personne (`open <adresse>/<page>`). Si le changement n'est pas là après trois minutes, tu procèdes comme dans le skill `lancieren`, partie 2, étape 4 (« toujours pas là après trois minutes »).

## Pièges

- Commencer sans `git pull` : il manque alors un changement fait ailleurs, et le push est refusé.
- Une nouvelle couleur « juste ici » : ça casse le système de design. Les nouvelles valeurs viennent seulement avec un oui et d'abord dans `tokens.css` et `designsystem.md`.
- Une nouvelle page sans ébauche et sans autorisation de construire : la personne la voit alors pour la première fois quand elle est déjà construite.
- Changer dans `seite/` au lieu de `web/` : à la prochaine construction, le changement a disparu.
- Une date directement dans le code au lieu de `web/src/data/` : la prochaine fois, on la cherche.
- Pousser sans validation, ou « c'est en ligne » sans avoir vérifié soi-même.

## Message de fin

Ton dernier message commence par une phrase sur l'image « des travaux dans une maison habitée ». Ensuite : ce qui est changé, où on le voit (avec l'adresse), ce qui a été vérifié et s'il reste quelque chose d'ouvert.
