#!/bin/sh
# Accueil à la connexion (cloud-init la met dans /etc/update-motd.d/01-albatros)
NAME=$(hostname)
cat <<TEXT

  Bienvenue à bord de $NAME.

  Ta page :         https://$NAME.__DOMAIN__
  Manuel de bord :  cat ~/BORDBUCH.md
  Quelque chose est cassé ? Pas de problème : « Retour à hier » dans le cockpit.

TEXT
