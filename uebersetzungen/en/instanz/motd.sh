#!/bin/sh
# Welcome on login (cloud-init puts it in /etc/update-motd.d/01-albatros)
NAME=$(hostname)
cat <<TEXT

  Welcome aboard $NAME.

  Your page:      https://$NAME.__DOMAIN__
  Flight manual:  cat ~/BORDBUCH.md
  Something broken? No problem: "Back to yesterday" in the cockpit.

TEXT
