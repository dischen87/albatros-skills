---
name: projekt-planen
description: "Pianifica un progetto web con Albatros, legge lo stato salvato e registra i passi confermati. Usa per la pianificazione Albatros o il prossimo passo di un progetto Albatros."
metadata:
  stand: 0.3.3
---

# Pianificare un progetto con Albatros

Rispondi nella lingua della persona, in modo semplice, con al massimo due domande aperte per messaggio. Usa le istruzioni incluse qui.

## Collegamento e ripresa

Leggi lo stato reale del progetto con `konto_status` e `lage`. Per `lage` puoi inviare `skills_stand` da metadata.stand e `projekt: projekt`. Invia solo brevi prove tratte dai file di risultato condivisi esplicitamente per questo progetto; nessuna cronologia della conversazione o credenziale. Se manca il collegamento, invita la persona ad aprire l'accesso del plugin nel browser. Non chiedere password, chiavi private o codici d'accesso. In caso di errore continua a pianificare localmente e indica che lo stato salvato è sconosciuto.

Scegli con la persona `webseite` o `geschaeft`; salva solo la sua scelta con `weg_waehlen`. Salva `lernen` o `machen` con `modus_waehlen` se sceglie tale modalità e lo strumento è disponibile. Tratta un'idea d'attività come un progetto da precisare in questo percorso.

## Dall'idea al prototipo locale verificato

Lavora sulla fase realmente aperta, da P1 a P10, indicata da `lage`, senza inventare il completamento dei passi precedenti:

- P1: annota nome del progetto, obiettivo in una frase, pubblico e un criterio di successo osservabile. Segna gli elementi sconosciuti come domande aperte.
- P2: raccogli contenuti esistenti, fonti e riferimenti. Usa fonti accessibili e distingui i fatti dalle ipotesi.
- P3: formula un piccolo piano di pagine, funzioni, lingue e criteri di verifica.
- P4: esamina il piano con la persona, mostra contraddizioni e decisioni aperte e registra il suo consenso al piano.
- P5: descrivi tono, direzione visiva e materiale disponibile; usa testo e file esistenti.
- P6: crea un piccolo sistema grafico con caratteri, colori, spazi e una pagina di esempio; lascia scegliere una direzione alla persona.
- P7: prepara la bozza dell’intero sito e verificala rispetto al piano delle pagine e al sistema grafico.
- P8: mostra la bozza scelta e registra il consenso esplicito alla realizzazione. Non realizzare il sito prima del consenso.
- P9: realizza la bozza approvata localmente soltanto su richiesta e in un ambiente capace di modificare file. Verifica contenuti, collegamenti, viste strette e larghe, tastiera, moduli e criteri concordati. In una chat normale prepara il piano e il passaggio di consegne. Distingui risultati misurati e verifiche ancora aperte.
- P10: risolvi i problemi, mostra i risultati e chiedi il via libera al prototipo locale.

In chat fornisci una breve descrizione, l'elenco delle pagine, la direzione scelta, le domande aperte e il prossimo passo. Se sono richiesti file locali, salva gli stessi risultati nei file pertinenti e indica dove si trovano. La pubblicazione è fuori da questo percorso. Da P11 in poi spiega in modo neutro che lo stato registrato supera l'ambito di pianificazione.

## Avanzamento e apprendimento

`schritt_melden` registra solo un passo realmente completato e confermato dalla persona. Prendi il valore dallo schema dello strumento o dallo stato del progetto, senza indovinarlo; usa `projekt: projekt`. Solo se lo schema prevede `titel`, invia il nome confermato con al massimo 80 caratteri. Non ripetere la stessa segnalazione. Poi rileggi `lage`.

`mission_holen` restituisce un riepilogo strutturato del compito attuale. Usa `mission_pruefen` solo con il suo vero identificativo e quando la persona richiede tale verifica. Una verifica non superata rimane aperta. Usa `verstanden_melden` solo dopo una risposta o azione della persona, con il vero identificativo e il corretto `art`. Spiega gli strumenti non disponibili o il limite raggiunto; non passare a un altro server per proseguire.

Supporto per questo collegamento: mathias@albatrospartner.ch. Invia un messaggio solo su esplicita richiesta della persona.
