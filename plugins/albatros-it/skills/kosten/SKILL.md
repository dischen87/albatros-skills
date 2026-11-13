---
name: kosten
description: "Con la persona tiene un libro dei conti di casa onesto per il suo progetto: abbonamento Albatros (solo dal domicilio, fino al sito sul proprio computer Albatros è gratis), dominio, abbonamento all'IA, e-mail, servizi aggiuntivi, un fornitore o un server proprio se se ne occupa da sé. Prezzi di Albatros solo da konto_status. Spiega quali costi sono fissi e quali variabili, come evitare brutte sorprese e quando conviene un trasloco. Usa lo skill con «quanto costa?», «costi», «prezzi», «è troppo caro», «budget», «fattura», «ne vale la pena?», «quanto costa un server?», e prima che la persona aggiunga un nuovo servizio a pagamento."
metadata:
  stand: 0.3.2
  quelle: 'da041e2a8b74'
---

# Costi: il libro dei conti di casa

## L'immagine

Come il libro dei conti di casa per un appartamento: c'è l'**affitto** (costi fissi ogni mese), ci sono le **spese accessorie** (a seconda di quanto consumi) e gli **acquisti una tantum**. Chi annota tutto non ha sorprese sulla fattura.

**Come usi l'immagine:** dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate `[Annahme: …]`. I segni `[Annahme: …]` e `[offen: …]` restano in tedesco, come i nomi delle righe in `docs/`: è da loro che `lage` riconosce ciò che è supposto o ancora aperto. Chiedi solo alla fine quello che manca.
- Dai del tu, in modo onesto, senza pressione di vendita. Non dire mai prezzi a memoria come se fossero fatti. I prezzi di Albatros li dai solo da `konto_status`. Per altri fornitori dici «circa» e mandi la persona alla loro pagina dei prezzi.
- **Gratis fino al locale:** finché il sito viene costruito e approvato sul proprio computer, Albatros non costa niente. Un abbonamento serve solo quando il sito deve abitare da Albatros (skill `lancieren`, domicilio). Chi va online da sé paga il fornitore, non Albatros.

## Procedura

### 1. Cosa c'è già?

Chiedi e annota:

| Voce | Tipo | Ordine di grandezza tipico | Da dove viene il prezzo esatto |
|---|---|---|---|
| Abbonamento Albatros (solo dal domicilio da Albatros) | affitto | secondo il livello: Light senza, Pilot con un server proprio | `konto_status` |
| Domicilio «da te»: fornitore per siti statici o server proprio | affitto | per i siti statici ci sono offerte gratuite con dei limiti, un server proprio costa ogni mese | pagina dei prezzi del fornitore |
| Dominio proprio (`.ch`), con Light o Pilot | affitto annuale, a parte dall'abbonamento | circa un biglietto del cinema all'anno | `domain_suchen` o pagina dei prezzi del registrar |
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

Scrivi con la persona la tabella in `docs/kosten.md` nel suo progetto, con la somma mensile, la somma annuale e una riga «Prossimo controllo: <data fra tre mesi>». Poi una voce nel diario di bordo (skill `git-logbuch`). Nel porto o dal fornitore il file arriva con il prossimo push, al più presto alla messa online.

### 4. Quando conviene più potenza o un trasloco?

- **Da Gratis a Light o Pilot:** solo quando il sito approvato deve abitare da Albatros (skill `lancieren`). Fino ad allora basta Gratis.
- **Da Light a Pilot:** appena sulla pagina deve girare un programma (banca dati, accesso per membri, CMS proprio). Per un dominio proprio basta Light.
- **Più potenza da Albatros:** quando la pagina diventa lenta e `free -h` mostra di continuo poca memoria di lavoro libera.
- **Trasloco su un server proprio** (skill `landung`): quando il progetto guadagna soldi, ha bisogno in modo permanente di più potenza di quanta ne offra il livello più grande, o la persona vuole avere tutto in mano sua. Un server proprio spesso costa meno d'affitto, ma di più in tempo tuo: aggiornamenti, backup e sorveglianza a quel punto non li fa più nessuno per te.

### 5. Verifica la missione

Il libro dei conti fa parte della scelta del domicilio (skill `lancieren`, parte 1). `mission_pruefen` con `flugschule-08-kosten`: la verifica guarda sull'isola se il progetto è al passo «Wohnort» (domicilio).

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «il libro dei conti di casa», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
