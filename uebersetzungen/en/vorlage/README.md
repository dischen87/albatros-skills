# My project

This is your logbook, it lives in the harbour. When you send a change on `main` to the harbour (`git push`), it's online shortly after:

- **Light:** Albatros shows the folder `seite/` at your address, about 30 seconds after the push.
- **Pilot:** the conveyor belt builds your page and delivers it to your server.

| File | What it's for |
|---|---|
| `seite/` | your page as it goes online: first this template, then, when going live, the page you built and released on your computer |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | notes for your AI (Claude Code, Codex, Gemini CLI or Cursor): where you are and what applies |
| `Dockerfile` | the building instructions: a small web server with your page (Pilot) |
| `compose.yaml` | how the page runs on the server (container `webseite`, port 80, Pilot); plus Bert's workspace online, off until you want it (skill `betrieb`) |
| `.github/workflows/deploy.yml` | the conveyor belt: build, deliver, check, roll back if needed (Pilot) |
| `nginx.conf` | how the web server delivers your page |
| `bausteine/` | ready-made parts like a sign-up list, login or CMS (Pilot) |
| `.gitignore` | what never goes into the logbook, for example `.env` with secrets |

Questions? Tell your AI "Explain my project" or start Albatros with `/albatros-en:start`.
