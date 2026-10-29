---
name: kosten
description: "Con la persona tiene un libro dei conti di casa onesto per il suo progetto: abbonamento Albatros, dominio, abbonamento all'IA, e-mail, servizi aggiuntivi, più avanti un server proprio. Spiega quali costi sono fissi e quali variabili, come evitare brutte sorprese e quando conviene un trasloco. Usa lo skill con «quanto costa?», «costi», «prezzi», «è troppo caro», «budget», «fattura», «ne vale la pena?», «quanto costa un server?», e prima che la persona aggiunga un nuovo servizio a pagamento."
---

# Costi: il libro dei conti di casa

## L'immagine

Come il libro dei conti di casa per un appartamento: c'è l'**affitto** (costi fissi ogni mese), ci sono le **spese accessorie** (a seconda di quanto consumi) e gli **acquisti una tantum**. Chi annota tutto non ha sorprese sulla fattura.

**Come usi l'immagine:** dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu, in modo onesto, senza pressione di vendita. Non dire mai prezzi a memoria come se fossero fatti. I prezzi attuali di Albatros vengono da `konto_status` o da albatros.build/preise. Per altri fornitori dici «circa» e mandi la persona alla loro pagina dei prezzi.

## Procedura

### 1. Cosa c'è già?

Chiedi e annota:

| Voce | Tipo | Ordine di grandezza tipico | Da dove viene il prezzo esatto |
|---|---|---|---|
| Abbonamento Albatros | affitto | secondo il livello | `konto_status` |
| Dominio proprio (`.ch`) | affitto annuale | circa un biglietto del cinema all'anno | `domain_suchen` o pagina dei prezzi del registrar |
| IA nel terminale (Claude Code, Codex, Gemini CLI, Cursor) | affitto | da 8 USD al mese con Cursor Plus, altrimenti da circa 20 USD: Claude Pro, ChatGPT Plus o, per Gemini CLI, Google AI Pro; un account gratuito non basta, o solo per qualche prova | pagina dei prezzi del fornitore; si paga lì, non ad Albatros |
| E-mail con dominio proprio | affitto | piccolo | fornitore |
| Statistiche (p. es. PostHog) | spese accessorie | di solito gratis fino a un limite | pagina dei prezzi |
| Invio di e-mail (newsletter) | spese accessorie | gratis fino a un limite, poi per e-mail | pagina dei prezzi |
| Pubblicità a pagamento | spese accessorie | decidi tu | account pubblicitario |

### 2. Trovare le trappole

- **Spese accessorie senza tetto:** per tutto quello che costa a consumo (interfacce IA, invio di e-mail, pubblicità), imposta un limite mensile. La maggior parte dei fornitori ha un'impostazione apposita. La persona lo imposta lei stessa.
- **Periodi gratuiti:** annota la data in cui finiscono.
- **Abbonamenti annuali:** annota il termine di disdetta.
- **Pagato due volte:** due servizi che fanno la stessa cosa.

### 3. Il libro dei conti nel progetto

Scrivi con la persona la tabella in `docs/kosten.md` nel suo progetto, con la somma mensile, la somma annuale e una riga «Prossimo controllo: <data fra tre mesi>». Poi nel diario di bordo (skill `git-logbuch`) e con il nastro trasportatore sul server.

### 4. Quando conviene più potenza o un trasloco?

- **Da Light a Pilot:** appena sulla pagina deve girare un programma (banca dati, accesso per membri, CMS proprio) o si aggiunge un dominio proprio.
- **Più potenza da Albatros:** quando la pagina diventa lenta e `free -h` mostra di continuo poca memoria di lavoro libera.
- **Trasloco su un server proprio** (skill `landung`): quando il progetto guadagna soldi, ha bisogno in modo permanente di più potenza di quanta ne offra il livello più grande, o la persona vuole avere tutto in mano sua. Un server proprio spesso costa meno d'affitto, ma di più in tempo tuo: aggiornamenti, backup e sorveglianza a quel punto non li fa più nessuno per te.

### 5. Verifica la missione

`mission_pruefen` con `flugschule-08-kosten`. La verifica controlla se `docs/kosten.md` si trova nel progetto (con Pilot in `~/projekt` sul server, con Light nel porto).

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «il libro dei conti di casa», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
