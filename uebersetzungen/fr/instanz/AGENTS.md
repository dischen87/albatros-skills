# Indications pour les agents IA sur ce serveur

Ce serveur appartient à une personne qui apprend avec Albatros. Elle n'a souvent aucune formation technique. Elle apprend ici les clés SSH, Git et le CI/CD en construisant une page web ou une entreprise.

## Comment lui parler

- En français, en la tutoyant, sans jargon technique, guillemets « ». Explique un terme avec une image la première fois qu'il apparaît.
- Les mots d'Albatros : journal de bord (dépôt git), port (Forgejo sur code.__DOMAIN__), tapis roulant (pipeline), retour à hier (snapshot).
- Petits pas : dis avant ce que tu fais et pourquoi. Demande avant de faire quelque chose qui ne s'annule pas facilement.
- Le manuel de bord `~/BORDBUCH.md` est écrit pour la personne. Renvoie à lui au lieu de tout réexpliquer.

## Le serveur

- Ubuntu 24.04 dans un conteneur Incus. Utilisateur `pilot` avec `sudo` sans mot de passe. Docker (avec Compose) et git sont installés.
- Nom : `__NAME__`. Page publique : https://__NAME__.__DOMAIN__. Ce qui répond ici au port 80 y apparaît ; le HTTPS, c'est le serveur edge d'Albatros. Albatros relie les propres domaines (abonnement Pilot).
- Au port 80 tourne d'abord la page d'accueil (service systemd `willkommen`). Avant qu'un propre serveur web prenne le port 80 : `sudo systemctl disable --now willkommen` (fait aussi partie du workflow de déploiement, sans dommage si elle a déjà disparu).
- Projet : `~/projekt`, clone du dépôt au port d'Albatros (Forgejo, https://code.__DOMAIN__) : `git@__DOMAIN__:__NAME__/projekt.git`. La personne pousse avec sa propre clé, le serveur avec sa clé `~/.ssh/code` (inscrite dans `~/.ssh/config`). Un push sur `main` lance le tapis roulant : un runner Forgejo sur ce serveur (service `fliessband`) exécute `.github/workflows/deploy.yml`. GitHub n'est pas nécessaire pour cela.
- Le conteneur du serveur web s'appelle `webseite`, un conteneur CMS `cms`. Les missions vérifient ces noms.
- Accès : `ssh __NAME__@__DOMAIN__` passe par sshpiper vers l'utilisateur `pilot`. La ligne `albatros-zugang` dans `~/.ssh/authorized_keys` doit rester. Albatros enregistre les nouvelles clés (outil MCP `schluessel_hinterlegen`).
- Limites : RAM, CPU, stockage, processus et bande passante sont limités. En sortie, les ports e-mail 25, 465 et 587, les autres serveurs d'Albatros et l'hôte sont bloqués. De l'extérieur, 22, 80 et 443 sont ouverts.
- Snapshots : chaque nuit, pendant 7 jours. Avant une grosse transformation, un snapshot à part vaut la peine (outil MCP `snapshot`). « Retour » efface tout ce qui est venu après le snapshot.

## Règles

- Pas de secrets (mots de passe, clés API) dans git ni dans des fichiers publics. Mets-les dans un `.env` avec `chmod 600` et ajoute `.env` à `.gitignore`.
- Bases de données et interfaces d'administration seulement en local, par exemple `-p 127.0.0.1:5432:5432`, jamais sur toutes les adresses.
- Démarrer les conteneurs avec `--restart unless-stopped`, pour qu'ils tournent de nouveau après un redémarrage.
- Ne jamais copier la clé SSH privée de la personne sur ce serveur et ne jamais l'afficher.
- Pas de minage, pas d'e-mails en masse, pas de scans d'autres machines. Un gardien freine les serveurs en charge continue ou avec un nombre suspect de connexions et les signale.
