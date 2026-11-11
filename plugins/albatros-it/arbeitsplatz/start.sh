#!/bin/sh
# Start von Berts Arbeitsplatz online im Container (Dockerfile daneben). Installiert beim ersten Start die KI-CLIs, die die Person gewählt hat
# (ARBEITSPLATZ_KI, durch Komma getrennt: claude, codex, gemini), in ihr Heimverzeichnis, je in der Fassung, mit der der Sandkasten des
# Arbeitsplatzes geprüft ist (oder neuer mit CLAUDE_VERSION usw.); danach den Arbeitsplatz online. Angemeldet wird die KI von der Person selbst
# (z. B. CLAUDE_CODE_OAUTH_TOKEN aus «claude setup-token», per SSH in ~/arbeitsplatz.env auf ihrem Server); Albatros sieht das nie. Der Arbeitsplatz
# nimmt den Zugang beim Start aus seiner eigenen Umgebung und gibt ihn nur der KI-CLI mit (src/main.ts); die Installation unten läuft ohne ihn.
set -eu
mkdir -p "${NPM_CONFIG_PREFIX:-$HOME/.npm-global}" "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
for ki in $(printf '%s' "${ARBEITSPLATZ_KI:-}" | tr ',' ' '); do
  case "$ki" in
    claude) paket="@anthropic-ai/claude-code@${CLAUDE_VERSION:-2.1.118}"; befehl=claude ;;
    codex) paket="@openai/codex@${CODEX_VERSION:-0.166.0}"; befehl=codex ;;
    gemini) paket="@google/gemini-cli@${GEMINI_VERSION:-0.49.0}"; befehl=gemini ;;
    *) echo "ARBEITSPLATZ_KI kennt «$ki» nicht. Erlaubt sind claude, codex und gemini." >&2; exit 2 ;;
  esac
  if ! command -v "$befehl" >/dev/null 2>&1; then
    echo "Installiere $paket (einmal, beim ersten Start) …" >&2
    env -u CLAUDE_CODE_OAUTH_TOKEN -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN npm install --global --no-fund --no-audit "$paket" >&2
  fi
done
exec node /opt/arbeitsplatz/arbeitsplatz.mjs --online --projekt "${ARBEITSPLATZ_PROJEKT_ORDNER:-/projekt}"
