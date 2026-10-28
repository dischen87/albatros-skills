# Notes for AI agents on this server

This server belongs to a person learning with Albatros. They usually have no tech background. Here they learn SSH keys, Git and CI/CD while building a website or a business.

## How to talk to them

- In English (British spelling), casual "you", no tech jargon. Explain a term with a picture the first time it comes up.
- Albatros words: logbook (git repository), harbour (Forgejo at code.__DOMAIN__), conveyor belt (pipeline), back to yesterday (snapshot).
- Small steps: say beforehand what you're doing and why. Ask before doing anything that can't easily be undone.
- The flight manual `~/BORDBUCH.md` is written for the person. Point to it instead of explaining everything again.

## The server

- Ubuntu 24.04 in an Incus container. User `pilot` with passwordless `sudo`. Docker (with Compose) and git are installed.
- Name: `__NAME__`. Public page: https://__NAME__.__DOMAIN__. Whatever answers here on port 80 shows up there; HTTPS is done by the Albatros edge server. Albatros connects own domains (Pilot plan).
- Port 80 is first taken by the welcome page (systemd service `willkommen`). Before a web server of their own takes port 80: `sudo systemctl disable --now willkommen` (also belongs in the deploy workflow, harmless if it's already gone).
- Project: `~/projekt`, clone of the repository in the Albatros harbour (Forgejo, https://code.__DOMAIN__): `git@__DOMAIN__:__NAME__/projekt.git`. The person pushes with their own key, the server with its `~/.ssh/code` (set in `~/.ssh/config`). A push to `main` starts the conveyor belt: a Forgejo runner on this server (service `fliessband`) runs `.github/workflows/deploy.yml`. GitHub isn't needed for this.
- The web server container is called `webseite`, a CMS container `cms`. The missions check these names.
- Access: `ssh __NAME__@__DOMAIN__` goes through sshpiper to the user `pilot`. The line `albatros-zugang` in `~/.ssh/authorized_keys` must stay. Albatros adds new keys (MCP tool `schluessel_hinterlegen`).
- Limits: RAM, CPU, storage, processes and bandwidth are limited. Outgoing, the mail ports 25, 465 and 587, the other Albatros servers and the host are blocked. From outside, 22, 80 and 443 are open.
- Snapshots: every night, kept for 7 days. Before a bigger rebuild, an extra snapshot is worth it (MCP tool `snapshot`). "Back" deletes everything that came after the snapshot.

## Rules

- No secrets (passwords, API keys) in git or in public files. Put them in a `.env` with `chmod 600` and add `.env` to `.gitignore`.
- Publish databases and admin interfaces only locally, for example `-p 127.0.0.1:5432:5432`, never on all addresses.
- Start containers with `--restart unless-stopped` so they run again after a restart.
- Never copy the person's private SSH key onto this server and never print it.
- No mining, no mass emails, no scans of other machines. A guard throttles servers with constant load or suspiciously many connections and reports them.
