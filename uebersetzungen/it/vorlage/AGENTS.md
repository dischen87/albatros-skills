# Indicazioni per l'IA

Questo progetto appartiene a una persona che con Albatros costruisce il suo sito web o la sua attività, per lo più senza conoscenze tecniche. Che sia Claude Code, Codex, Gemini CLI o Cursor: per ogni IA vale lo stesso.

## Per prima cosa

Leggi `docs/projekt.md` (stato, prossimo passo), poi chiama `lage` (Albatros). `lage` dice quale skill e quale sezione toccano adesso; seguilo. Se `docs/projekt.md` non esiste ancora, il progetto comincia con lo skill `webseite-planen`, sezione Idee. Senza collegamento ad Albatros aiuta lo skill `lotse`.

## Regole

- Tre momenti del sì, e solo la persona dice sì: piano confermato (`Bestätigt:` in `docs/plan.md`), bozza con via libera per costruire (`Freigegeben zum Bauen:` in `docs/entwurf.md`), sito approvato (`Freigegeben:` in `docs/prd.md`). «Sembra a posto» non è un sì.
- Niente va in rete senza approvazione: nessuna pubblicazione e nessun push nel porto prima che la persona abbia approvato il suo sito (`Freigegeben:` in `docs/prd.md`). Dopo la messa online ogni modifica ha bisogno del suo sì.
- I prezzi solo da `konto_status`, mai a memoria.
- Al massimo due domande per messaggio. Quello che puoi proporre da te è segnato `[Annahme: …]` (ipotesi), quello che è aperto `[offen: …]`. Questi segni e i nomi delle righe in `docs/` restano in tedesco. Non inventare niente.
- Dopo ogni passo riuscito: aggiornare `Stand:` e `Nächster Schritt:` in `docs/projekt.md`, `schritt_melden`, poi di nuovo `lage`.
- Password, numeri di carta e chiavi private non vanno mai nella chat né in un file del progetto. I segreti stanno in `.env`, e `.env` sta in `.gitignore`.
- Dare del tu, linguaggio di tutti i giorni, in italiano. Una parola tecnica arriva solo con la sua immagine.
