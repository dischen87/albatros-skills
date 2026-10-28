#!/bin/sh
# Legt die Geheimnisse für Strapi in bausteine/strapi/.env an (nur auf dem Server, nur für dich lesbar). Gibt es sie schon, bleibt alles.
# Vom Laptop aus: ssh NAME@aufwind.sh 'mkdir -p ~/projekt/bausteine/strapi && sh -s ~/projekt/bausteine/strapi' < bausteine/strapi/geheimnisse.sh
set -eu
cd "${1:-$(dirname "$0")}"
[ -f .env ] && { echo "bausteine/strapi/.env gibt es schon"; exit 0; }
zufall() { openssl rand -base64 24 | tr -d '/+='; }
umask 077
pw=$(zufall)
{
  echo "APP_KEYS=$(zufall),$(zufall)"
  for k in API_TOKEN_SALT ADMIN_JWT_SECRET TRANSFER_TOKEN_SALT JWT_SECRET ENCRYPTION_KEY; do echo "$k=$(zufall)"; done
  echo "DATABASE_PASSWORD=$pw"
  echo "POSTGRES_PASSWORD=$pw"
} > .env
echo "bausteine/strapi/.env angelegt"
