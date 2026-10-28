---
name: server-kennenlernen
description: "Visite guidée de son propre serveur Albatros pour une personne sans connaissances préalables. Explique le terminal, les dossiers, l'espace disque, la mémoire vive, les programmes qui tournent et le passe-partout sudo avec des images tirées d'un appartement. La personne tape elle-même ses premières commandes. Utilise ce skill pour « qu'est-ce qu'il y a sur mon serveur ? », « comment je me déplace dans le terminal ? », « c'est quoi un dossier sur le serveur ? », « ls cd pwd », « combien de place j'ai ? », « qu'est-ce qui tourne là-dessus ? », et après la première visite SSH réussie."
---

# Découvrir le serveur : visite du nouvel appartement

## L'image

Ton serveur est un appartement dans un grand immeuble. Il a sa propre porte (ta serrure SSH), ses propres pièces (les dossiers) et ses propres appareils (les programmes). Les voisins ne voient pas chez toi, et tu ne vois pas chez eux.

Le terminal, c'est l'interphone : tu dis une courte phrase, l'appartement répond.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

**Seulement avec Pilot.** Avec Light, il n'y a pas d'appartement à soi, seulement une vitrine : la page tirée du journal de bord. Si `konto_status` montre un autre niveau, explique brièvement ce qu'apporte un serveur à soi, et seulement si la personne le souhaite, va chercher le lien avec `upgrade_link` (niveau `pilot`).

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** s'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon, avec les hypothèses marquées (`[hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement, phrases courtes, pas de jargon. Chaque commande reçoit d'abord son image.
- La personne tape elle-même les commandes de cette visite (dans Claude Code avec `!` devant, sinon dans sa propre fenêtre de terminal après `ssh {name}@aufwind.sh`). Tu expliques ce qui va venir, puis tu lis la réponse avec elle.
- Au maximum un nouveau mot par étape.

## La visite

Avant : « Ici, tu ne peux rien casser pour toujours. Chaque nuit, tout l'appartement est photographié, et on peut revenir à hier. »

| Étape | Commande | Image | À quoi faire attention |
|---|---|---|---|
| Où suis-je ? | `pwd` | Le point « Vous êtes ici » sur le plan de la ville | `/home/pilot` est le couloir de ton appartement, en abrégé `~` |
| Qu'y a-t-il ici ? | `ls -la` | Allumer la lumière dans la pièce | Les fichiers qui commencent par un point sont cachés, p. ex. `.ssh` |
| Lire le guide de bord | `cat BORDBUCH.md` | Le classeur de bienvenue sur la table | On y trouve ce qui fait partie de l'appartement |
| Entrer dans une pièce | `cd projekt` et retour avec `cd ~` | Passer une porte | Si le dossier n'existe pas encore : `mkdir projekt` construit une nouvelle pièce |
| Combien de place ? | `df -h /` | La cave : à quel point est-elle pleine ? | La colonne « Avail » est la place libre |
| Combien de surface de travail ? | `free -h` | La surface du bureau : ce qui tourne en ce moment y est posé | « available » est libre. Si elle est presque pleine, tout devient lent |
| Qu'est-ce qui tourne en ce moment ? | `docker ps` | Quels appareils sont branchés | Les conteneurs Docker sont comme des appareils avec une prise : on les branche et débranche sans casser le mur |
| Repartir | `exit` | Fermer la porte derrière toi | |

## Le passe-partout : sudo

À expliquer seulement quand une commande répond « Permission denied » ou a besoin de `sudo`. Image : avec `sudo` devant une commande, tu utilises le passe-partout du concierge. Il ouvre toutes les portes, même celle de la chaufferie. C'est pourquoi on ne l'utilise que si l'on sait exactement ce que fait la commande. Toi (l'agent), tu n'utilises jamais `sudo` sans un oui explicite de la personne, et jamais avec `rm -rf`.

## Pour finir : la note de visite

La personne note trois choses qu'elle a découvertes, avec ses propres mots :

```bash
nano ~/rundgang.md
```

`nano` est un simple bloc-notes dans le terminal : écrire, puis `Ctrl+O` et Entrée pour enregistrer, `Ctrl+X` pour quitter. Plutôt par commande ? `echo "- ..." >> ~/rundgang.md`.

Ensuite `mission_pruefen` avec `flugschule-03-server-kennenlernen`. La vérification regarde si `~/rundgang.md` existe.

## Quand ça coince

- **`command not found`** : faute de frappe, ou l'appareil n'est pas installé. Compare d'abord la commande lettre par lettre.
- **`No such file or directory`** : tu es dans la mauvaise pièce. `pwd` te dit où tu es.
- **La personne se sent dépassée :** ne garde que `pwd`, `ls`, `cd` et `exit`. Le reste peut attendre d'être utile.
- **Quelque chose a été effacé :** skill `zurueck-auf-gestern`.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « visite du nouvel appartement » qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
