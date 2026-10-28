#!/usr/bin/env bash
# Baut Albatros in einem leeren Home-Ordner so ein, wie EINRICHTEN.md es der KI vorgibt, und prüft das Ergebnis.
# Jede Zeile aus den bash-Blöcken von EINRICHTEN.md läuft echt. Anmeldungen (login) nur mit --help, die brauchen einen Menschen.
# QUELLE=<pfad> ersetzt dischen87/albatros-skills durch einen lokalen Stand (Pull Requests, Test vor dem Push).
set -euo pipefail
cd "$(dirname "$0")/.."
REPO=$PWD
URL=https://mcp.albatros.build
fehler() { echo "FEHLER: $*" >&2; exit 1; }

echo "== Dienst: $URL verlangt die Anmeldung"
kopf=$(curl -sS -o /dev/null -D - -X POST -H 'content-type: application/json' -d '{}' "$URL/")
grep -q '^HTTP/[0-9.]* 401' <<<"$kopf" || fehler "$URL antwortet nicht mit 401"
grep -qi '^www-authenticate: Bearer resource_metadata=' <<<"$kopf" || fehler "$URL nennt kein resource_metadata"

HOME=$(mktemp -d)
export HOME CODEX_HOME="$HOME/.codex" GIT_TERMINAL_PROMPT=0
mkdir -p "$HOME/bin" "$CODEX_HOME"
export PATH="$HOME/bin:$PATH"
command -v gemini >/dev/null || printf '#!/bin/sh\nexec npx -y @google/gemini-cli "$@"\n' > "$HOME/bin/gemini"
chmod +x "$HOME/bin/"* 2>/dev/null || true

echo "== Befehle aus EINRICHTEN.md"
awk '/^ *```bash/{b=1;next} /^ *```/{b=0} b' EINRICHTEN.md | sed 's/^ *//' | while read -r zeile; do
  [ -n "$zeile" ] || continue
  [ -z "${QUELLE:-}" ] || zeile=${zeile//dischen87\/albatros-skills/$QUELLE}
  case "$zeile" in *" login "*) zeile="${zeile%%login*}login --help" ;; esac
  echo "\$ $zeile"
  bash -c "$zeile" < /dev/null > "$HOME/ausgabe" 2>&1 || { tail -20 "$HOME/ausgabe"; fehler "Befehl scheitert: $zeile"; }
done

echo "== Ergebnis prüfen"
skills=$(ls "$REPO/plugins/albatros/skills")
pruefe_skills() {
  local wo=$1
  for s in $skills; do
    ls $wo/$s/SKILL.md >/dev/null 2>&1 || fehler "Skill $s fehlt unter $wo"
  done
}
pruefe_skills "$HOME/.claude/plugins/cache/albatros/albatros/*/skills"
grep -q "$URL" $HOME/.claude/plugins/cache/albatros/albatros/*/.mcp.json || fehler "Claude Code: .mcp.json ohne $URL"
pruefe_skills "$CODEX_HOME/plugins/cache/albatros/albatros/*/skills"
codex mcp list 2>&1 | grep -q "albatros *$URL" || fehler "Codex: Server albatros fehlt"
pruefe_skills "$HOME/.agents/skills"
grep -q "\"url\": \"$URL\"" "$HOME/.gemini/settings.json" || fehler "Gemini CLI: Server albatros fehlt"
echo "Einbau in Claude Code, Codex und Gemini CLI in Ordnung ($(wc -w <<<"$skills" | tr -d ' ') Skills)."
