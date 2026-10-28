# Manuel de bord de __NAME__

Bienvenue à bord ! Voici ton propre serveur. Un serveur est un ordinateur qui tourne toujours et qui est toujours relié à Internet. Ta page web continue de tourner ici, même quand ton ordinateur portable est fermé.

## Où tu es

- Ton serveur s'appelle **__NAME__**.
- Ta page : https://__NAME__.__DOMAIN__
- Pour entrer : `ssh __NAME__@__DOMAIN__`
- Ici, tu es l'utilisateur `pilot`. Avec `sudo` devant une commande, tu as tous les droits, comme un commandant de bord.
- Ta maison est le dossier `/home/pilot`. Ce manuel de bord s'y trouve aussi.

## Ce qui est déjà à bord

- **Docker** emballe les programmes dans des caisses (conteneurs). Chaque caisse contient tout ce dont le programme a besoin. Ainsi, les programmes ne se gênent pas.
- **git** est ton journal de bord pour le code. Chaque entrée (commit) note ce qui a changé. Tu peux toujours revenir à une ancienne entrée.

## Ta page web

Ce qui répond sur ce serveur au port 80, le monde entier le voit à l'adresse https://__NAME__.__DOMAIN__. Albatros s'occupe du cadenas dans le navigateur web (HTTPS).

Au début, il y a là un message d'accueil. Il garde le port 80 libre pour toi jusqu'à ce que ta propre page arrive. Alors tu lui laisses la place :

```
sudo systemctl disable --now willkommen
```

Ton projet se trouve dans le dossier `~/projekt`. C'est une copie de ton journal de bord (dépôt) du port d'Albatros. Depuis ton ordinateur portable, tu envoies les modifications au port avec `git push`, à `git@__DOMAIN__:__NAME__/projekt.git`, avec ta propre clé. Ensuite, le tapis roulant construit ta page ici sur le serveur et la livre. Le serveur va chercher ton journal de bord avec sa propre clé (`~/.ssh/code`), tu n'as pas à t'en occuper.

## Tu ne peux rien casser

Chaque nuit, Albatros prend une photo de ton serveur. Ça s'appelle un snapshot. Les photos des 7 derniers jours restent. Si quelque chose tourne mal, tu choisis « Retour à hier » dans le cockpit ou par ton IA.

Bon à savoir : ce que tu as changé après la photo disparaît. Les photos plus récentes que celle choisie aussi.

## Limites

- La mémoire de travail (RAM), l'espace de stockage et la puissance de calcul dépendent de ton abonnement. Si ça devient juste, Albatros te prévient.
- Envoyer des e-mails directement depuis le serveur ne marche pas, les ports e-mail 25, 465 et 587 sont fermés. Ainsi, personne ne peut envoyer de spam. Pour les e-mails, tu passes par un service comme Resend ou Brevo et son API.
- Tu n'atteins pas les serveurs des autres élèves, et eux n'atteignent pas le tien.
- Depuis l'extérieur, seuls SSH (22) et la page web (80 et 443) sont accessibles.

## Ta clé

Dans `~/.ssh/authorized_keys`, il y a une ligne avec `albatros-zugang`. Laisse-la : c'est par elle que tu entres avec `ssh __NAME__@__DOMAIN__`. Une nouvelle clé, tu l'enregistres par Albatros, dans le cockpit ou par ton IA.

## Aide

Demande à ton IA ou au coach dans le cockpit. Il connaît ton serveur et ta mission.
