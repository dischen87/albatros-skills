---
name: inhalte
description: "Aiuta una persona senza conoscenze tecniche a scrivere e scegliere testi e immagini per il suo sito web: la pagina iniziale in tre frasi, testi brevi per chi legge sul telefonino, foto proprie invece di immagini di repertorio, diritti e dimensioni delle immagini, testi dell'IA riportati nella propria voce. Il risultato è una lista dei contenuti in docs/inhalte.md e i testi sul sito. Usa lo skill con «scrivere i testi», «cosa scrivo sulla pagina iniziale», «chi siamo», «immagini per il sito», «posso usare questa immagine?», «il testo sembra scritto dall'IA», «contenuti»."
---

# Contenuti: la merce in vetrina

## L'immagine

Il sito web è una vetrina. L'aspetto grafico è la luce e la decorazione. I contenuti sono la merce. Una bella vetrina con gli scaffali vuoti non vende niente. Per questo i contenuti vengono prima dell'aspetto.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, in modo breve e concreto. Non scrivere mai i testi definitivi scavalcando la persona: tu fai proposte, lei decide e cambia. Alla fine ogni testo deve suonare come parla lei.

## Procedura

### 1. Lista dei contenuti dal piano

Prendi le pagine da `docs/plan.md` (skill `webseite-planen`). Crea `docs/inhalte.md`, per ogni pagina: titolo, due o tre frasi chiave, immagini, il pulsante per la cosa principale, stato (bozza, pronto).

### 2. La pagina iniziale in tre frasi

Chi arriva sulla pagina iniziale decide in pochi secondi se restare. Le tre frasi in alto devono rispondere a:

1. **Cos'è?** («Mensa per il pranzo per scolari a Molino Nuovo»)
2. **Per chi e perché è buono?** («Cucinato fresco, con sorveglianza, a cinque minuti dalla scuola»)
3. **E adesso?** Un pulsante con un verbo: «Chiedi un posto», non «Scopri di più».

### 3. Regole per i testi in rete

- Frasi brevi, un pensiero per frase. La maggior parte legge sul telefonino.
- Prima la cosa più importante. I dettagli più in basso.
- Concreto invece di linguaggio pubblicitario: «Rispondiamo entro 24 ore» invece di «servizio di prima classe».
- Mantieni un solo modo di rivolgerti, tu o Lei, a seconda del pubblico.
- Sottotitoli che si possono scorrere con lo sguardo.
- Numeri, prezzi, orari d'apertura, indirizzo: meglio controllarli due volte. Indicazioni sbagliate costano fiducia.

### 4. Testi con l'IA

L'IA può scrivere bozze. Poi insieme alla persona:

- Cancella tutto quello che lei non direbbe mai così.
- Verifica ogni affermazione. Quello che non è vero o non si può dimostrare va tolto.
- Via le tipiche parole riempitive e i superlativi vuoti («innovativo», «su misura», «senza soluzione di continuità»).
- Inserisci una sua frase vera: un'esperienza, un motivo per cui fa quello che fa.

### 5. Immagini

- **Le foto proprie battono le immagini di repertorio.** Persone vere, luogo vero, luce del giorno, basta il telefonino.
- **Diritti:** Usa solo immagini che la persona ha fatto lei stessa o per cui ha una licenza. Un'immagine trovata con la ricerca di Google non è gratis. Le persone riconoscibili vanno chieste prima (diritto alla propria immagine), per i bambini i genitori.
- **Dimensioni:** Le foto del telefonino sono troppo grandi. Riducile al massimo a circa 2000 pixel di larghezza e salvale come WebP, per esempio con `cwebp -q 80 foto.jpg -o foto.webp` o con uno strumento online a sua scelta. Obiettivo: meno di 300 KB per immagine.
- **Una descrizione per ogni immagine** (testo alternativo), vedi lo skill `barrierefreiheit`.

### 6. Portarli sul sito

Chiedi alla persona di verificare ogni dato nel testo (orari, percorsi, prezzi, nomi). Tu li conosci solo dalla sua descrizione. Poi testi e immagini nel progetto, nel diario di bordo (skill `git-logbuch`) e, con Pilot, con il nastro trasportatore (skill `pipeline`) sul server. Poi guardateli insieme sul telefonino, non solo al computer.

## Verifica la missione

`mission_pruefen` con `webseite-02-inhalte`. La verifica controlla se `~/projekt/docs/inhalte.md` esiste e se il sito risponde su `https://{name}.aufwind.sh`.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la merce in vetrina», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo. Chiedi esplicitamente alla persona di riportare il testo nella sua voce e di verificare ogni dato (orari, percorsi, prezzi), perché tu li conosci solo dalla sua descrizione.
