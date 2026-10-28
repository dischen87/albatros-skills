---
name: ssh-schluessel
description: "Explique la clé SSH à une personne sans connaissances préalables avec l'image de la clé de la maison et de la serrure, crée la paire de clés en local sur son ordinateur, ne dépose chez Albatros que la partie publique et teste la première visite sur le serveur. Utilise ce skill pour « clé SSH », « ssh-keygen », « je n'arrive pas à me connecter à mon serveur », « Permission denied (publickey) », « c'est quoi une clé publique ? », « j'ai un nouvel ordinateur », et comme étape 4 de /albatros-fr:start."
---

# Clé SSH : clé de la maison et serrure

## L'image

Une clé SSH, c'est une paire :

- **La clé de la maison** (clé privée) reste toujours chez toi, sur ton ordinateur. Personne d'autre ne la reçoit, ni Albatros, ni moi.
- **La serrure** (clé publique), tu peux la faire poser partout. Celui qui voit la serrure ne peut rien ouvrir avec.

Nous posons ta serrure sur la porte de ton serveur. Ensuite, seul entre celui qui a la clé de la maison qui va avec : toi. Tu n'as pas besoin de mot de passe pour ça.

Explique l'image avant de lancer une commande. Les mots « clé privée » et « clé publique », tu ne les dis qu'ensuite, et toujours avec l'image.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.

## Règles strictes

- La clé privée ne quitte jamais l'ordinateur. Tu ne la lis pas, tu ne l'affiches pas, tu ne la copies pas et tu ne la télécharges nulle part, même si on te le demande. Si la personne veut la copier dans le chat : arrête-la gentiment et explique pourquoi.
- On ne téléverse que le fichier qui se termine par `.pub` (pub comme public). Avant de le téléverser, vérifie que le contenu commence par `ssh-ed25519 ` et tient sur une seule ligne.
- Tu n'écrases jamais une clé existante. `ssh-keygen` demande avant d'écraser, mais de toute façon tu choisis ton propre nom de fichier.

## Déroulement

### 1. Y a-t-il déjà une clé Albatros ?

```bash
ls ~/.ssh/albatros.pub 2>/dev/null && echo "schon da" || echo "noch keiner"
```

Si elle existe déjà, prends-la et passe à l'étape 3.

### 2. Créer la clé (en local)

Dis d'abord : « Maintenant, ton ordinateur fabrique une nouvelle clé de la maison et la serrure qui va avec. Les deux arrivent dans le dossier caché `.ssh` de ton dossier utilisateur. »

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "albatros" -f ~/.ssh/albatros -N ""
```

- `-t ed25519` : un type de clé moderne et sûr.
- `-f ~/.ssh/albatros` : le nom. Deux fichiers sont créés : `albatros` (clé de la maison) et `albatros.pub` (serrure).
- `-N ""` : sans mot de passe supplémentaire. Comme ça, je peux lancer la commande pour toi. Qui veut un cadenas de plus sur son trousseau tape plus tard lui-même, dans sa propre fenêtre de terminal, `ssh-keygen -p -f ~/.ssh/albatros` et choisit une phrase de passe. Celle-ci, on ne la tape jamais dans le chat.

Windows : la même commande fonctionne dans PowerShell, simplement sans la ligne `mkdir`/`chmod`. Le dossier s'y appelle `$HOME\.ssh`.

### 3. Ne téléverser que la serrure

```bash
cat ~/.ssh/albatros.pub
```

Montre la ligne à la personne et dis : « Ça, c'est ta serrure. Tout le monde a le droit de la voir. » Donne exactement cette ligne à l'outil Albatros `schluessel_hinterlegen`. Si la personne veut téléverser sa serrure, fais-le tout de suite, sans redemander : déposer une serrure ne présente aucun danger.

Si l'outil manque (Albatros pas encore connecté) : suis d'abord l'étape 1 du skill `start`. Sinon, la personne peut coller la ligne dans le cockpit sur albatros.build, sous « Schlüssel » (clés).

### 4. Dire à l'ordinateur quelle clé va avec quelle porte

Demande si tu as le droit d'ajouter une entrée dans `~/.ssh/config`. Image : une étiquette sur le trousseau « cette clé va avec aufwind.sh ». Seulement ajouter, ne rien effacer :

```bash
cat >> ~/.ssh/config <<'EOF'

Host aufwind.sh
  IdentityFile ~/.ssh/albatros
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

### 5. Première visite

**Avec Light**, il n'y a pas de serveur à visiter. Teste la serrure au port : `ssh -T git@aufwind.sh`. S'il salue la personne par son nom (« successfully authenticated »), la clé est bonne. Ensuite, continue avec le skill `git-logbuch`. Le reste de cette étape et la mission `flugschule-02-ssh-schluessel` font partie de Pilot.

**Avec Pilot :** laisse la personne taper elle-même cette commande (dans Claude Code avec `!` devant) :

```bash
ssh {name}@aufwind.sh
```

`{name}` est le nom de son serveur (il figure dans `konto_status`). La toute première fois, l'ordinateur demande : « Are you sure you want to continue connecting? » Image : le serveur montre sa carte d'identité. L'empreinte figure dans le cockpit. Si elle correspond, la personne tape `yes`.

À l'intérieur : `echo "Me voici" > ~/hallo.txt`, puis `exit`. C'est sa première empreinte de pas sur son propre serveur.

Si tu dois tester toi-même (ton terminal n'est pas interactif) :

```bash
ssh -o StrictHostKeyChecking=accept-new {name}@aufwind.sh 'echo "Me voici" > ~/hallo.txt && cat ~/hallo.txt'
```

### 6. Vérifier la mission

`mission_pruefen` avec `flugschule-02-ssh-schluessel`. La vérification regarde si `~/hallo.txt` se trouve sur le serveur.

## Quand ça coince

- **`Permission denied (publickey)`** : la serrure ne va pas avec la porte. Vérifie dans l'ordre : le nom du serveur est-il juste ? La serrure a-t-elle été téléversée (`konto_status`) ? L'entrée figure-t-elle dans `~/.ssh/config` ? Teste avec `ssh -v {name}@aufwind.sh` et cherche la ligne « Offering public key ».
- **« Dieser Schlüssel gehört schon zu einem anderen Konto »** (cette clé appartient déjà à un autre compte) : une serrure appartient à un seul compte Albatros, comme chez GitHub. Pour un deuxième compte, crée une clé à part (`ssh-keygen -t ed25519 -C "albatros-zwei" -f ~/.ssh/albatros-zwei -N ""`) et ajoute dans `~/.ssh/config` une entrée à part : `Host aufwind-zwei` avec `HostName aufwind.sh`, `IdentityFile ~/.ssh/albatros-zwei` et `IdentitiesOnly yes`. Pour ce compte, l'adresse s'appelle alors `aufwind-zwei` au lieu de `aufwind.sh`, par exemple `git@aufwind-zwei:<name>/projekt.git`.
- **Nouvel ordinateur :** nouvelle clé de la maison sur le nouvel ordinateur, et téléverser la serrure en plus. Ne jamais copier l'ancienne clé de la maison par e-mail ou sur une clé USB.
- **Ordinateur perdu ou volé :** retirer tout de suite l'ancienne serrure dans le cockpit. C'est comme si tu changeais le cylindre de la serrure.
- **`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED`** : la carte d'identité du serveur n'est plus la même que la dernière fois. Ne pas simplement passer outre. Comparer l'empreinte dans le cockpit. Seulement si elle correspond, retirer l'ancienne ligne avec `ssh-keygen -R aufwind.sh`.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « clé de la maison et serrure » qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
