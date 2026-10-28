---
titel: Pas de clé sous le paillasson
bild: Trousseau de clés, fenêtres et serrures dans ta propre maison
---

## De quoi il s'agit

Une maison est aussi sûre que son moment le plus négligent : une clé sous le paillasson, une fenêtre ouverte, une vieille serrure. Dans ton projet, ces choses s'appellent secrets (mots de passe, clés d'accès), portes ouvertes et mises à jour manquantes. Tu fais le ménage avant que quelqu'un d'autre les trouve.

## Ce que tu apprends

- pourquoi les secrets n'ont jamais leur place dans le journal de bord, même pas un instant
- où ils vont à la place : dans un `.env` sur le serveur, qui ne va jamais dans le journal de bord. Sur une page avec Light, il n'en faut aucun, car tout ce qui s'y trouve est public.
- quelles portes doivent être ouvertes et lesquelles non
- comment les mises à jour gardent tes serrures fraîches

## Comment t'y prendre

1. Vérifier avec ton IA si un secret a déjà atterri dans le journal de bord.
2. Mettre `.env` dans la liste des choses que Git ignore.
3. Déplacer les secrets au bon endroit. Ce qui était déjà public est remplacé.
4. Avec Pilot : faire la visite de sécurité sur le serveur.

## Réussi quand

- le fichier `.gitignore` de ton projet contient `.env`.
