#!/bin/sh
# Benvenuto all'accesso (cloud-init lo mette in /etc/update-motd.d/01-albatros)
NAME=$(hostname)
cat <<TEXT

  Benvenuti a bordo di $NAME.

  La tua pagina:     https://$NAME.__DOMAIN__
  Manuale di bordo:  cat ~/BORDBUCH.md
  Qualcosa si è rotto? Nessun problema: «Ritorno a ieri» nel cockpit.

TEXT
