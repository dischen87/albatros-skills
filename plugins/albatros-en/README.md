# Albatros (English)

Albatros is a flight school for people with no technical background. Your AI (Claude, Codex, Cursor or Gemini CLI) guides you along a fixed flight plan from the idea to your own website or business online. On the way you learn what SSH keys, Git and a pipeline (CI/CD) are. Until your site is finished on your own computer, Albatros costs nothing; then you choose where it lives: with Albatros (Light, or Pilot with a real server of your own) or self-hosted.

After installing, tell your AI: “Start Albatros”. In Claude Code, `/albatros-en:start` works too.

## Install

| AI | How |
|---|---|
| Claude (claude.ai, Cowork, Claude Code) | add “Albatros” from Claude's directory once it is listed there; until then, in Claude Code: `claude plugin install albatros-en --marketplace dischen87/albatros-skills` |
| Cursor | install “Albatros” from the Cursor Marketplace once it is listed there; until then as in [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md), part D |
| Codex and ChatGPT | from the plugin directory of ChatGPT and Codex once it is listed there; until then `codex plugin marketplace add dischen87/albatros-skills` and `codex plugin add albatros-en@albatros` |

Or tell your AI: “Set up Albatros for me: https://albatros.build/einrichten”. It reads [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md) and does everything itself.

## What the plugin contains and what it does

- **Skills** (Markdown in `skills/`): instructions for your AI, from the main skill `lotse` to SSH keys, Git, domains and Swiss law. They don't run anything on their own.
- **Connection to Albatros** (`albatros`, `https://mcp.albatros.build`): you sign in to Albatros in your browser (OAuth via Clerk, with Google, Apple or GitHub). Neither Albatros nor your AI sees your password. Every call names the version of the skills in the header `X-Albatros-Skills-Stand`, nothing else about your computer. What Albatros stores (path, subscription, progress) is in the [privacy policy](https://albatros.build/en/datenschutz).
- **The Albatros app** (`albatros-arbeitsplatz`, `node arbeitsplatz/arbeitsplatz.mjs --mcp`): your home page on your own computer. It is reachable only there (127.0.0.1), writes only to the `.albatros/` folder of your project and sends nothing to the internet on its own. It needs Node 20 or newer. Claude Code starts it from the plugin; in Codex and Cursor your AI only adds it when you want it (skill `schnellstart`). The source is in `dischen87/albatros` (`apps/arbeitsplatz`); the bundle here is not minified and contains OpenPGP.js (LGPL-3.0-or-later) unchanged.
- No hooks, no changed permissions.

## Cost, help, license

- Learning with Albatros is free. Your AI needs a subscription with its provider. Prices: https://albatros.build/en/preise
- Questions and bugs: https://github.com/dischen87/albatros-skills/issues
- [Terms](https://albatros.build/en/agb), [privacy](https://albatros.build/en/datenschutz), [legal notice](https://albatros.build/en/impressum). Publisher: Albatros Partner (https://albatros.build).
- License: MIT ([LICENSE](https://github.com/dischen87/albatros-skills/blob/main/LICENSE)).
