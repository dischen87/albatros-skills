---
name: git-logbuch
description: "Explique Git à une personne sans connaissances préalables avec l'image du journal de bord à bord et de sa copie au port (le service Git d'Albatros, code.aufwind.sh). Récupère le repo au port, accompagne les premières entrées (commit) avec de bonnes notes, les envoie au port (push) et vérifie que la copie arrive sur le serveur Albatros dans ~/projekt. Règles : seulement sur main, ajouter seulement ses propres fichiers, un par un, jamais de force-push. Utilise ce skill pour « Git », « GitHub », « port », « commit », « push », « pull », « repo », « c'est quoi un repository ? », « sauvegarder mes modifications », « mon push est refusé », « conflit », et avant de faire un commit pour la personne."
---

# Git : le journal de bord à bord, avec une copie au port

## L'image

Sur chaque bateau, il y a un journal de bord. Chaque entrée dit : qui, quand, quoi et pourquoi. Quand quelque chose tourne mal, on feuillette en arrière et on voit où ça a commencé.

- **Repo :** le journal de bord de ton projet, avec tous ses fichiers.
- **Commit :** une entrée. Elle note une petite étape terminée, avec une note d'une phrase.
- **Port :** `code.aufwind.sh`, le service Git d'Albatros. Il fonctionne comme GitHub et s'appelle Forgejo. Une copie du journal de bord y est rangée. Si ton ordinateur tombe à l'eau, rien n'est perdu.
- **Push :** envoyer les nouvelles entrées au port. **Pull :** récupérer les dernières entrées depuis le port.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** s'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon, avec les hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement. Les mots commit, push et pull seulement après l'image, puis toujours avec elle.
- Au port, la personne se connecte dans le navigateur web avec son compte Albatros. Un compte GitHub, elle n'en a besoin qu'au moment de déménager dans sa propre maison (skill `landung`).
- Tu ne fais jamais de commit avec quelque chose que la personne ne connaît pas. Avant chaque entrée, tu montres ce qui va dedans.

## Les trois règles

1. **Seulement sur `main`.** Un journal de bord, une ligne. Les branches, c'est pour plus tard et pour les grosses transformations.
2. **Seulement ses propres fichiers, un par un :** `git add <fichier>`. Jamais `git add .`, `git add -A` ou `git commit -a`. Ils balaient dans le journal de bord du travail à moitié fini et des secrets comme `.env`.
3. **Jamais `git push --force`.** Si un push est refusé, d'abord `git pull --rebase`, puis à nouveau `git push`.

## Déroulement

### 1. Les outils

- `git --version` montre si Git est là. Sur Mac, au premier appel, l'ordinateur demande s'il doit installer les outils de développement. Oui.
- La clé de la maison du skill `ssh-schluessel` ouvre aussi le port. L'entrée `Host aufwind.sh` dans `~/.ssh/config` vaut pour les deux portes.
- Une seule fois, inscrire son nom pour le journal de bord :
  ```bash
  git config --global user.name "Prénom Nom"
  git config --global user.email "ton-adresse@exemple.ch"
  ```

### 2. Récupérer le journal de bord

Albatros a déjà créé ton journal de bord au port, avec le modèle dedans. `konto_status` donne l'adresse :

```bash
git clone git@aufwind.sh:{name}/projekt.git
cd projekt
```

Le journal de bord est privé : toi seul le vois. Ensuite, vérifier le `.gitignore`, avec au moins ces lignes : `.env`, `.env.*`, `!.env.example`, `node_modules/`, `dist/`.

### 3. La première entrée

La personne modifie elle-même quelque chose de petit, p. ex. une ligne dans `README.md`. Tu lui ouvres le fichier (`open -e README.md`, Linux `xdg-open`, Windows `notepad`) et tu lui indiques exactement la ligne et le nouveau texte. Si elle n’ose pas ou si rien ne change, tu le fais toi-même et tu lui montres la modification avec `git diff`. La première entrée reste petite, même si la personne donne déjà des contenus : sur le chemin Site web, le site ne naît qu’avec `webseite-planen` et `webseite-bauen`, avec plan, contrôle et validation. Tu gardes ses contenus pour le plan. Puis ensemble :

```bash
git status                     # Qu'est-ce qui a changé ?
git add README.md              # Ajouter exactement ce fichier
git diff --cached              # Qu'est-ce qui va dans le journal de bord ?
git commit -m "README : but du projet en une phrase"
git pull --rebase && git push  # Envoyer au port
```

Les bonnes notes disent quoi et pourquoi, en moins de 60 caractères : « Contact : numéro de téléphone ajouté ». Mauvais : « update », « fix », « divers ».

Encore une deuxième entrée, pour que ça rentre. Ensuite, montrer dans le navigateur web : `https://code.aufwind.sh/{name}/projekt`. Les deux entrées sont au port.

### 4. Le journal de bord sur le serveur

**Avec Light**, il n'y a pas de serveur : le push est déjà la livraison. Albatros affiche le dossier `seite/` de `main` sous `https://{name}.aufwind.sh`, après environ 30 secondes. Si `seite/` manque, Albatros prend `public/`, sinon tout le repo ; c'est pourquoi la page reste dans `seite/`. Au maximum 100 Mo ; les raccourcis (liens symboliques), Albatros ne les affiche jamais. Avant de dire que la modification est en ligne, tu vérifies toi-même, toutes les 15 secondes, trois minutes au plus : `curl -s https://{name}.aufwind.sh | grep -F "<nouveau texte>"`. Puis tu ouvres la page pour la personne. Continuer avec l'étape 5.

**Avec Pilot :** ton serveur a sa propre copie dans `~/projekt`. Albatros l'a créée lors de l'installation, avec une clé de lecture uniquement pour ton port. Si le journal de bord contient le tapis roulant (`.github/workflows/deploy.yml`), celui-ci récupère tout seul les nouvelles entrées à chaque push (skill `pipeline`). Vérifier :

```bash
ssh {name}@aufwind.sh 'git -C ~/projekt log --oneline -3'
```

S'il manque les nouvelles entrées, tu les récupères à la main : `ssh {name}@aufwind.sh 'git -C ~/projekt pull --ff-only'`. S'il manque tout le dossier : `ssh {name}@aufwind.sh 'git clone git@aufwind.sh:{name}/projekt.git ~/projekt'`.

### 5. Vérifier la mission

`mission_pruefen` avec `flugschule-04-git-logbuch`. La vérification regarde si le journal de bord a au moins deux entrées sur `main` : avec Pilot dans `~/projekt` sur le serveur, avec Light au port.

## Quand ça coince

- **`Permission denied (publickey)` au port :** la serrure n'est pas déposée, ou l'entrée dans `~/.ssh/config` manque (skill `ssh-schluessel`).
- **Push refusé (`rejected`) :** il y a une entrée plus récente au port. `git pull --rebase`, puis `git push`.
- **Conflit pendant le rebase :** deux entrées ont modifié la même ligne. Dans le fichier, entre `<<<<<<<` et `>>>>>>>`, décider ensemble de ce qui reste, puis `git add <fichier>`, `git rebase --continue`, `git push`.
- **Modifications ouvertes de quelqu'un d'autre dans `git status` :** ne pas y toucher, ne pas les embarquer. Ajouter seulement ses propres fichiers.
- **Un secret a atterri dans le journal de bord :** l'effacer ne suffit pas, il reste dans les anciennes entrées. Tout de suite le skill `sicherheit` : recréer le secret chez le fournisseur.
- **Revenir à une version antérieure d'un fichier :** `git log --oneline <fichier>` montre les entrées, `git restore --source <entrée> <fichier>` la récupère. Ensuite une nouvelle entrée.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « le journal de bord à bord, avec une copie au port » qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
