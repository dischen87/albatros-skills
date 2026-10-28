# Strapi 5: Inhalte im Browser pflegen. Der Bau läuft auf deinem Server, darum mit Grenze für den Arbeitsspeicher (Spitze etwa 2,3 GB).
FROM node:22-alpine AS bau
WORKDIR /cms
COPY cms/package.json cms/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY cms/ ./
ENV NODE_ENV=production
RUN NODE_OPTIONS=--max-old-space-size=1536 npm run build && npm prune --omit=dev --no-audit --no-fund

FROM node:22-alpine
WORKDIR /cms
ENV NODE_ENV=production STRAPI_TELEMETRY_DISABLED=true
COPY --from=bau /cms ./
EXPOSE 1337
CMD ["node_modules/.bin/strapi", "start"]
