---
titel: Il secondo parere sul piano
bild: 'Il secondo parere dell''ingegnera statica, prima di costruire'
phase: P4
verstehen:
  - frage: Perché la tua IA verifica il tuo piano in una conversazione nuova?
    kern: Chi ha scritto il piano vede peggio le sue lacune. Uno sguardo nuovo, senza la storia precedente, trova ciò che il primo non ha visto.
  - frage: Che cosa significa un punto «rischio» nella lista di controllo?
    kern: Il piano funziona così, ma in quel punto qualcosa può andare storto. Decidi consapevolmente se cambiarlo o se accettare il rischio.
---

## Di cosa si tratta

Prima di costruire una casa, un'ingegnera statica guarda il piano. Non l'ha disegnato lei, e per questo vede ciò che è sfuggito all'architetto. La tua IA fa lo stesso con il tuo piano: in una conversazione nuova, che conosce solo i tuoi documenti in `docs/`, lo verifica con una lista fissa. Poi decidi tu se il piano vale così.

## Cosa impari

- chi ha scritto il piano vede peggio le sue lacune
- che cosa c'è nella lista di controllo: una cosa principale, poche pagine, svolgimenti con conferma ed errore, contenuti, obblighi, costi, data
- ok, rischio o aperto: tre risposte oneste invece di un voto
- perché il design comincia solo con un piano confermato

## Come procedi

1. La tua IA chiede il secondo parere in una conversazione nuova, che legge solo `docs/`.
2. Ogni punto della lista di controllo riceve ok, rischio o aperto, con il punto del piano.
3. La tua IA ti mostra i punti con rischio o aperti.
4. Decidi tu: lasciare così o cambiare. Solo dopo il tuo sì il piano viene segnato come confermato, con la data.

Se modernizzi un sito esistente, il secondo parere verifica anche che nessuna funzione del vecchio sito vada persa senza una decisione.

## Ce l'hai fatta quando

- in `docs/plan.md` c'è la tua conferma con la data
- e sulla tua isola è raggiunto il passo «Piano verificato».
