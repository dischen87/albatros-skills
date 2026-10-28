# Il mio progetto

Questo è il tuo diario di bordo, si trova al porto. Quando mandi una modifica su `main` al porto (`git push`), poco dopo è online:

- **Light:** Albatros mostra la cartella `seite/` al tuo indirizzo, circa 30 secondi dopo il push.
- **Pilot:** il nastro trasportatore costruisce la tua pagina e la consegna sul tuo server.

| File | A cosa serve |
|---|---|
| `seite/` | la tua pagina, comincia da `index.html` |
| `Dockerfile` | le istruzioni di costruzione: un piccolo server web con la tua pagina (Pilot) |
| `compose.yaml` | come gira la pagina sul server (container `webseite`, porta 80, Pilot) |
| `.github/workflows/deploy.yml` | il nastro trasportatore: costruire, consegnare, controllare, se serve tornare indietro (Pilot) |
| `nginx.conf` | come il server web consegna la tua pagina |
| `bausteine/` | blocchi pronti come lista di iscrizione, accesso o CMS (Pilot) |
| `.gitignore` | cosa non entra mai nel diario di bordo, per esempio `.env` con i segreti |

Domande? Di' alla tua IA «Spiegami il mio progetto» oppure avvia Albatros con `/albatros-it:start`.
