---
name: zurueck-auf-gestern
description: "Explique les snapshots avec l'image de la photo quotidienne de tout l'appartement, prend une photo à part avant les modifications risquées et remet le serveur en état avec « retour à hier ». Contient l'exercice « casser exprès et réparer ». Utilise ce skill pour « snapshot », « backup », « sauvegarde », « j'ai effacé quelque chose », « ma page est cassée », « mon serveur ne marche plus », « annuler », « revenir en arrière », « retour à hier », et avant de transformer quelque chose de gros sur le serveur."
---

# Retour à hier : la photo de tout l'appartement

## L'image

Chaque nuit, Albatros prend une photo de tout ton appartement : chaque pièce, chaque fichier, chaque appareil qui tourne. Les sept dernières photos sont gardées. Si quelque chose tourne mal, tu dis « remets l'appartement comme sur cette photo », et il l'est.

Le mot technique pour ça est **snapshot** (instantané).

Important : tout ce qui est arrivé après la photo est perdu ensuite. C'est pourquoi le journal de bord au port est si précieux (skill `git-logbuch`) : il garde une copie de ton travail en dehors de l'appartement. Remettre l'appartement en état ne touche pas au port.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

**Les photos du serveur n'existent qu'avec Pilot.** Avec Light, il n'y a pas de serveur ; on revient en arrière par le journal de bord : `git log --oneline` montre les entrées, `git revert <entrée>` annule une entrée sous la forme d'une nouvelle entrée, puis `git push`. Peu après, l'ancienne page est de nouveau en ligne. Jamais `git push --force`.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** s'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon, avec les hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement, calme, phrases courtes. Quand quelque chose est cassé, d'abord rassurer : « Ça se répare. » Ensuite seulement agir.

## Avant une grosse transformation : une photo à part

Avant de faire quelque chose de gros sur le serveur (installer des paquets, changer la configuration, transformer une base de données), propose une photo : outil `snapshot` avec un nom parlant, p. ex. `vor-cms-installation`. Ça ne prend pas de temps et ça évite beaucoup d'ennuis.

Photos à part : au maximum cinq, elles expirent après 30 jours. Les noms qui commencent par `taeglich-` sont réservés aux photos de la nuit.

## Remettre en état

1. **D'abord regarder ce qui est cassé.** Parfois, il faut moins qu'une photo entière : un conteneur arrêté redémarre avec `docker start webseite`, un fichier modifié dans le projet revient avec `git restore <fichier>`.
2. **Afficher les photos :** `snapshot` avec l'action « auflisten » (lister) (ou dans le cockpit, « Server », « Snapshots »). Choisir la bonne avec la personne : la dernière sur laquelle tout marchait encore.
3. **Prévenir de ce qui sera perdu :** « Tout ce que tu as modifié sur le serveur après <moment> sera perdu, y compris toutes les photos plus récentes que celle-ci. Ce qui est déjà au port reste. » Si la personne a du travail non sauvegardé sur le serveur, le mettre d'abord à l'abri (`git push`, ou copier le fichier sur son propre ordinateur avec `scp {name}@aufwind.sh:~/datei .`).
4. **Seulement après un oui clair :** `zurueck` avec le nom de la photo. Le serveur redémarre, ça prend environ une minute.
5. **Vérifier :** ouvrir la page dans le navigateur web, `docker ps` sur le serveur.

## Exercice : casser exprès

Cet exercice est la mission. Il enlève la peur de l'erreur.

1. Prendre une photo : `snapshot` avec le nom `vor-der-uebung`.
2. Ouvrir la page dans le navigateur web : `https://{name}.aufwind.sh`. Elle marche.
3. Casser (la personne tape elle-même) :
   ```bash
   ssh {name}@aufwind.sh 'docker rm -f webseite'
   ```
   Recharger la page : elle a disparu. Laisser sentir un instant que ce n'est pas grave.
4. `zurueck` sur `vor-der-uebung`.
5. Recharger la page : elle est de retour.
6. `mission_pruefen` avec `flugschule-06-zurueck-auf-gestern`. La vérification regarde si la page répond et si le conteneur `webseite` tourne.

## Ce que les snapshots ne sont pas

- Pas un remplacement du journal de bord au port et sur ton ordinateur. Les photos sont dans le même immeuble que l'appartement.
- Pas une protection pour l'ordinateur de la personne. Là, la règle est : faire régulièrement un push de son travail.
- Pas une archive pour toujours. Après sept jours, une photo a disparu. Ce qui doit rester plus longtemps a sa place dans le journal de bord.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « la photo de tout l'appartement » qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
