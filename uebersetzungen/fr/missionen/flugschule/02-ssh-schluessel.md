---
titel: Ta clé de la maison pour le serveur
bild: Clé de la maison et serrure
---

## De quoi il s'agit

Sur ton serveur, tu n'entres pas avec un mot de passe, mais avec une paire de clés. La clé de la maison, tu la gardes sur ton ordinateur. La serrure qui va avec, on la pose dans la porte de ton serveur. Celui qui voit la serrure ne peut rien ouvrir avec.

## Ce que tu apprends

- ce qu'est une clé SSH : clé de la maison (privée) et serrure (publique)
- pourquoi seule la serrure quitte ton ordinateur
- comment tu ouvres la porte de ton serveur avec `ssh`

## Comment t'y prendre

1. Ton IA crée la paire de clés sur ton ordinateur.
2. Tu regardes la serrure (le fichier qui se termine par `.pub`). Seul celui-ci va chez Albatros.
3. Tu tapes toi-même `ssh {name}@aufwind.sh` et tu es pour la première fois sur ton serveur.
4. Tu laisses une empreinte : le fichier `hallo.txt`.

## Réussi quand

- le fichier `~/hallo.txt` se trouve sur ton serveur.
