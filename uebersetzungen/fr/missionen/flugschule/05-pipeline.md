---
titel: Le tapis roulant pour ta page
bild: Tapis roulant avec contrôle qualité
---

## De quoi il s'agit

Au lieu de porter chaque changement à la main sur le serveur, tu construis un tapis roulant. Tu poses un changement dans le journal de bord, et le tapis roulant s'occupe du reste : vérifier, construire, livrer. Si le contrôle qualité échoue, l'ancienne page reste en place. Le mot technique pour ça, c'est CI/CD.

## Ce que tu apprends

- ce qu'est un workflow et quand il démarre
- comment le contrôle qualité attrape les erreurs avant que quelqu'un les voie
- qui travaille au tapis roulant : un ouvrier (runner) qui habite sur ton propre serveur
- ce qui se passe quand quelque chose tourne mal

## Comment t'y prendre

1. Regarder le fichier de workflow dans ton dépôt et le comprendre, étape par étape.
2. Faire la connaissance de l'ouvrier sur ton serveur : il prend chaque changement, le construit et le livre.
3. Pousser (push) un petit changement et regarder le tapis roulant tourner.
4. Pousser exprès une erreur et voir comment le contrôle l'arrête.

## Réussi quand

- le dernier passage de `.github/workflows/deploy.yml` au port est vert,
- le conteneur `webseite` tourne sur ton serveur
- et `https://{name}.aufwind.sh` répond.
