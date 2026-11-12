# Albatros (italiano)

Albatros è una scuola di volo per persone senza conoscenze tecniche. La tua IA (Claude, Codex, Cursor o Gemini CLI) ti guida secondo un piano di volo fisso, dall'idea fino al tuo sito web o alla tua attività online. Strada facendo impari che cosa sono una chiave SSH, Git e un nastro trasportatore (CI/CD). Finché il tuo sito non è finito sul tuo computer, Albatros non costa niente; poi scegli dove abita: da Albatros (Light, oppure Pilot con un vero server tuo) o da te.

Dopo l'installazione di' alla tua IA: «Avvia Albatros». In Claude Code funziona anche `/albatros-it:start`.

## Installare

| IA | Come |
|---|---|
| Claude (claude.ai, Cowork, Claude Code) | aggiungere «Albatros» dall'elenco di Claude appena ci sarà; fino ad allora, in Claude Code: `claude plugin install albatros-it --marketplace dischen87/albatros-skills` |
| Cursor | installare «Albatros» dal Marketplace di Cursor appena ci sarà; fino ad allora come in [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md), parte D |
| Codex e ChatGPT | dall'elenco dei plugin di ChatGPT e Codex appena ci sarà; fino ad allora `codex plugin marketplace add dischen87/albatros-skills` e `codex plugin add albatros-it@albatros` |

Oppure di' alla tua IA: «Installami Albatros: https://albatros.build/einrichten». Legge [EINRICHTEN.md](https://github.com/dischen87/albatros-skills/blob/main/EINRICHTEN.md) e fa tutto da sola.

## Che cosa contiene il plugin e che cosa fa

- **Skill** (Markdown in `skills/`): istruzioni per la tua IA, dallo skill principale `lotse` fino a chiave SSH, Git, dominio e diritto svizzero. Non eseguono niente da sole.
- **Collegamento ad Albatros** (`albatros`, `https://mcp.albatros.build`): accedi ad Albatros nel browser (OAuth tramite Clerk, con Google, Apple o GitHub). Né Albatros né la tua IA vedono la tua password. Ogni chiamata indica la versione degli skill nell'intestazione `X-Albatros-Skills-Stand`, nient'altro sul tuo computer. Che cosa salva Albatros (percorso, abbonamento, progressi) è nell'[informativa sulla privacy](https://albatros.build/it/datenschutz).
- **Il programma Albatros** (`albatros-arbeitsplatz`, `node arbeitsplatz/arbeitsplatz.mjs --mcp`): la tua pagina iniziale sul tuo computer. È raggiungibile solo lì (127.0.0.1), scrive solo nella cartella `.albatros/` del tuo progetto e non manda niente in Internet di sua iniziativa. Richiede Node 20 o più recente. Claude Code lo avvia dal plugin; in Codex e Cursor la tua IA lo aggiunge solo se lo vuoi (skill `schnellstart`). Il codice sorgente è in `dischen87/albatros` (`apps/arbeitsplatz`); il pacchetto qui non è minificato e contiene OpenPGP.js (LGPL-3.0-or-later) senza modifiche.
- Nessun hook, nessun permesso modificato.

## Costi, aiuto, licenza

- Imparare con Albatros non costa niente. La tua IA ha bisogno di un abbonamento presso il suo fornitore. Prezzi: https://albatros.build/it/preise
- Domande ed errori: https://github.com/dischen87/albatros-skills/issues
- [CG](https://albatros.build/it/agb), [privacy](https://albatros.build/it/datenschutz), [note legali](https://albatros.build/it/impressum). Editore: Albatros Partner (https://albatros.build).
- Licenza: MIT ([LICENSE](https://github.com/dischen87/albatros-skills/blob/main/LICENSE)).
