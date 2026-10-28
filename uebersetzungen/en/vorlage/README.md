# My project

This is your logbook, it lives in the harbour. When you send a change on `main` to the harbour (`git push`), it's online shortly after:

- **Light:** Albatros shows the folder `seite/` at your address, about 30 seconds after the push.
- **Pilot:** the conveyor belt builds your page and delivers it to your server.

| File | What it's for |
|---|---|
| `seite/` | your page, start with `index.html` |
| `Dockerfile` | the building instructions: a small web server with your page (Pilot) |
| `compose.yaml` | how the page runs on the server (container `webseite`, port 80, Pilot) |
| `.github/workflows/deploy.yml` | the conveyor belt: build, deliver, check, roll back if needed (Pilot) |
| `.gitignore` | what never goes into the logbook, for example `.env` with secrets |

Questions? Tell your AI "Explain my project" or start Albatros with `/albatros-en:start`.
