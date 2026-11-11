# Berts Arbeitsplatz online (Foundable-Gleichstand F1.9, docs/foundable/f01-bert-lokal.md §1): derselbe Arbeitsplatz wie auf dem Computer, als
# Container auf dem eigenen Server der Person (Pilot), hinter dem Webserver der Webseite: am besten unter einem eigenen Namen
# (https://arbeitsplatz.<domain>), sonst unter https://<name>.aufwind.sh/arbeitsplatz.
#
# Bauen: Der Kontext ist das Bündel (dist/ nach «bun run buendeln»); das Bündel-Skript legt dieses Dockerfile, start.sh und kaefig.pl dazu. So
# lässt sich das Bild auch aus dem Ordner arbeitsplatz/ des Plugins bauen, auf dem eigenen Server, ohne Registry (Skill betrieb):
#   bun run buendeln && docker build -t ghcr.io/dischen87/albatros-arbeitsplatz:<version> apps/arbeitsplatz/dist
# Veröffentlicht wird es mit .github/workflows/arbeitsplatz-bild.yml (nur von Hand gestartet).
#
# Im Bild: Node, das Bündel (Server, Oberfläche, MCP-Server), git und ssh, dazu der Käfig für die KI (container/kaefig.pl, Landlock; braucht nur
# perl-base, das in jedem Debian-Bild ist). Mit ihm darf die KI online auch Dateien ändern; ohne Landlock ABI 4 (Linux vor 6.7) bleibt sie bei
# «nur lesen» (src/bruecke/kaefig.ts). Derselbe Helfer ist im Käfig die Leitung zum MCP-Server des Arbeitsplatzes (--anschluss,
# src/bruecke/anschluss.ts): Der Server läuft ausserhalb des Käfigs, darum braucht das Bild dafür nichts Weiteres.
# Nicht im Bild: die KI-CLIs. start.sh installiert beim ersten Start nur
# die, die die Person wählt (ARBEITSPLATZ_KI), in ihr Heimverzeichnis (Volume, bleibt über Neustarts). Gründe: Claude Code ist proprietär
# («All rights reserved», Nutzung nach den Bedingungen von Anthropic); wer es in seinem Produkt vorinstalliert, braucht die Commercial Terms, und
# es muss unverändert so laufen, wie Anthropic es veröffentlicht (code.claude.com/docs/en/legal-and-compliance). Codex und Gemini CLI sind
# Apache-2.0, aber jede CLI im Bild wäre Gewicht für alle, die sie nicht wählen, und veraltete Fassungen mit Sicherheitslücken bis zum nächsten Bild.
# So holt die Person die Software selbst beim Anbieter (npm), und Albatros verteilt keine fremde Software.
#
# Läuft nie als root (USER), ohne zusätzliche Rechte (compose: cap_drop ALL, no-new-privileges). Das Projekt ist ein Volume (/projekt), der
# Zustand des Arbeitsplatzes (Anmeldung, gesehene Ereignisse) liegt im Heimverzeichnis ausserhalb des Projekts.
#
# BASIS ist nur für Messungen ohne Netz änderbar (scripts/container-pruefen.ts nimmt ein Bild, das schon da ist); PAKETE=nein lässt apt-get aus
# (git und ssh müssen dann im Basisbild sein).
ARG BASIS=node:22-bookworm-slim
FROM ${BASIS}
ARG PAKETE=ja
RUN if [ "$PAKETE" = ja ]; then \
      apt-get update && apt-get install -y --no-install-recommends ca-certificates git openssh-client && rm -rf /var/lib/apt/lists/*; \
    fi \
  && command -v git >/dev/null && command -v node >/dev/null && command -v npm >/dev/null \
  && perl -MFcntl -MPOSIX -MSocket -e 1
ARG UID=1000
ARG GID=1000
RUN mkdir -p /opt/arbeitsplatz /projekt /home/arbeitsplatz/.npm-global /home/arbeitsplatz/.albatros \
  && chown -R ${UID}:${GID} /home/arbeitsplatz /projekt && chmod 700 /home/arbeitsplatz/.albatros
COPY arbeitsplatz.mjs VERSION start.sh kaefig.pl /opt/arbeitsplatz/
COPY ui/ /opt/arbeitsplatz/ui/
# Öffentlicher Schlüssel der Ereignisse aus der Cloud (iss albatros, kit ereignis.ts): setzt der Bau von Albatros, damit die Person nichts
# eintragen muss; leer heisst «keine Ereignisse», sie bleiben in der Cloud (POST /api/ereignis antwortet 503)
ARG EREIGNIS_SCHLUESSEL=
ENV ALBATROS_EREIGNIS_SCHLUESSEL=${EREIGNIS_SCHLUESSEL}
ENV HOME=/home/arbeitsplatz \
    NODE_ENV=production \
    NPM_CONFIG_PREFIX=/home/arbeitsplatz/.npm-global \
    CLAUDE_CONFIG_DIR=/home/arbeitsplatz/.claude \
    ALBATROS_KAEFIG=/opt/arbeitsplatz/kaefig.pl \
    PATH=/home/arbeitsplatz/.npm-global/bin:$PATH \
    ARBEITSPLATZ_PORT=4747 \
    ARBEITSPLATZ_HOEREN=0.0.0.0
USER ${UID}:${GID}
WORKDIR /projekt
EXPOSE 4747
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.ARBEITSPLATZ_PORT||4747)+'/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
ENTRYPOINT ["/bin/sh", "/opt/arbeitsplatz/start.sh"]
