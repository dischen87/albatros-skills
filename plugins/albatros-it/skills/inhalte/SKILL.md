---
name: inhalte
description: "Aiuta una persona senza conoscenze tecniche a scrivere e scegliere testi e immagini per il suo sito web, nel piano di volo per la bozza di tutto il sito (P7): la pagina iniziale in tre frasi, testi brevi nel tono del concetto per chi legge sul telefonino, i testi mancanti ben visibili come [da completare], foto proprie invece di immagini di repertorio con una lista delle foto, diritti e dimensioni delle immagini, testi dell'IA riportati nella propria voce. Il risultato è una lista dei contenuti in docs/inhalte.md e i testi nella bozza. Usa lo skill con «scrivere i testi», «cosa scrivo sulla pagina iniziale», «chi siamo», «immagini per il sito», «lista delle foto», «posso usare questa immagine?», «il testo sembra scritto dall'IA», «contenuti»."
metadata:
  stand: 0.3.0
  quelle: '0ce83df4206d'
---

# Contenuti: la merce in vetrina

## L'immagine

Il sito web è una vetrina. L'aspetto grafico è la luce e la decorazione. I contenuti sono la merce. Una bella vetrina con gli scaffali vuoti non vende niente. Per questo la merce entra nel modello prima di costruire: solo con testi veri si vede se il sito regge.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Nel piano di volo

I testi nascono in P7, come parte della bozza di tutto il sito (skill `entwurf`, passo «I testi»): ciò che scrivi qui va direttamente nelle pagine di `design/entwurf/`. È già raccolto ciò che la persona ha (`Inhalte vorhanden:` in `docs/recherche.md`, P2), come suona e che cosa promette (`Ton:` e `Kern:` in `docs/konzept.md`, P5), e la lista delle foto (in `docs/inhalte.md`, P5). I testi li proponi tu; ciò che manca compare come `[da completare: che cosa manca, chi lo fornisce entro quando]` nella bozza, e il numero delle cose da completare sta nella riga `Seiten:` di `docs/entwurf.md`. La persona conferma i testi mentre sfoglia il sito.

Se il sito lo costruisce Albatros (in `docs/projekt.md` c'è `Bauen lassen: albatros`, e `lage` nomina un incarico aperto), non c'è nessuna bozza da parte tua: raccogli soltanto. Testi, elenco dei contenuti e lista delle foto vanno in `docs/inhalte.md`; sotto `design/` non metti e non cambi niente, perché è da lì che costruisce Albatros. Le foto nuove la persona le mette lei stessa in `design/bilder/` e, fino al pagamento, sceglie di nuovo la cartella del progetto nel cockpit, sotto «Il tuo incarico». Dopo la messa online portate sul sito ciò che avete raccolto con la prima modifica personale (skill `webseite-aendern`).

Se il sito è già online e un testo deve cambiare, vale lo skill `webseite-aendern`.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate `[Annahme: …]`. I segni `[Annahme: …]` e `[offen: …]` restano in tedesco, come i nomi delle righe in `docs/`: è da loro che `lage` riconosce ciò che è supposto o ancora aperto. Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, in modo breve e concreto. Non scrivere mai i testi definitivi scavalcando la persona: tu fai proposte, lei decide e cambia. Alla fine ogni testo deve suonare come parla lei.

## Procedura

### 1. Lista dei contenuti dal piano

Prendi le pagine da `docs/plan.md` (riga `Seiten:`, skill `webseite-planen`). Crea `docs/inhalte.md` o completala se esiste già con la lista delle foto di P5: per ogni pagina titolo, due o tre frasi chiave, immagini, il pulsante per la cosa principale, stato (bozza, pronto, da completare). Il modo di rivolgersi e il tono li prendi da `docs/konzept.md`.

### 2. La pagina iniziale in tre frasi

Chi arriva sulla pagina iniziale decide in pochi secondi se restare. Le tre frasi in alto devono rispondere a:

1. **Cos'è?** («Mensa per il pranzo per scolari a Molino Nuovo»)
2. **Per chi e perché è buono?** («Cucinato fresco, con sorveglianza, a cinque minuti dalla scuola»)
3. **E adesso?** Un pulsante con un verbo: «Chiedi un posto», non «Scopri di più».

### 3. Regole per i testi in rete

- Frasi brevi, un pensiero per frase. La maggior parte legge sul telefonino.
- Prima la cosa più importante. I dettagli più in basso.
- Concreto invece di linguaggio pubblicitario: «Rispondiamo entro 24 ore» invece di «servizio di prima classe».
- Mantieni un solo modo di rivolgerti, tu o Lei, a seconda del pubblico (nel piano di volo sta in `docs/konzept.md` sotto `Ton:`).
- Sottotitoli che si possono scorrere con lo sguardo.
- Numeri, prezzi, orari d'apertura, indirizzo: meglio controllarli due volte. Indicazioni sbagliate costano fiducia.
- Ciò che manca non lo inventi. Compare in modo visibile nel testo, per esempio `[da completare: orari d'apertura, li fornisce Anna entro il 7.11.2026]`, perché nessuno lo dimentichi. Mai testo Lorem o altro testo riempitivo, e mai emoji al posto delle icone.
- I fatti come frasi che sono vere anche da sole: chi, che cosa, per chi, dove, quando è aperto, quanto costa, come si chiede. In più le cinque domande che vengono fatte più spesso, ognuna con una risposta in due o tre frasi. Così lo capisce chi ha fretta, e così lo trovano i motori di ricerca e gli assistenti IA (skill `seo-grundlagen`).
- Niente recensioni, citazioni, numeri di clienti o riconoscimenti inventati. Ogni numero viene dalla persona o ha una fonte.

### 4. Testi con l'IA

L'IA può scrivere bozze. Poi insieme alla persona:

- Cancella tutto quello che lei non direbbe mai così.
- Verifica ogni affermazione. Quello che non è vero o non si può dimostrare va tolto.
- Via le tipiche parole riempitive e i superlativi vuoti («innovativo», «su misura», «senza soluzione di continuità»).
- Inserisci una sua frase vera: un'esperienza, un motivo per cui fa quello che fa.

### 5. Immagini

- **Le foto proprie battono le immagini di repertorio.** Persone vere, luogo vero, luce del giorno, basta il telefonino. Che cosa deve fotografare la persona sta nella lista delle foto in `docs/inhalte.md`: che cosa, dove, chi c'è sopra, entro quando.
- **Diritti:** Usa solo immagini che la persona ha fatto lei stessa o per cui ha una licenza. Un'immagine trovata con la ricerca di Google non è gratis. Le persone riconoscibili vanno chieste prima (diritto alla propria immagine), per i bambini i genitori.
- **Dimensioni:** Le foto del telefonino sono troppo grandi. Riducile al massimo a circa 2000 pixel di larghezza e salvale come WebP, per esempio con `cwebp -q 80 foto.jpg -o foto.webp` o con uno strumento online a sua scelta. Obiettivo: meno di 300 KB per immagine.
- **Una descrizione per ogni immagine** (testo alternativo), vedi lo skill `barrierefreiheit`.

### 6. Portarli nella bozza

Chiedi alla persona di verificare ogni dato nel testo (orari, percorsi, prezzi, nomi). Tu li conosci solo dalla sua descrizione. Poi testi e immagini vanno nelle pagine della bozza (`design/entwurf/`, le immagini in `design/entwurf/bilder/`), e li guardate insieme sul telefonino, non solo al computer (skill `entwurf`). Si costruisce solo dopo il via libera per costruire (P8); allora lo skill `webseite-bauen` riprende i testi dalla bozza.

Se il sito è già costruito o online, i testi nuovi passano dallo skill `webseite-aendern`: cambiare in locale, mostrare, approvazione, poi nel diario di bordo (skill `git-logbuch`) e in rete.

## Verifica la missione

`mission_pruefen` con `webseite-03-inhalte`. La verifica guarda se il progetto è almeno al passo «Bozza» sull'isola: tutto il sito c'è, con testi veri, da sfogliare cliccando. Ne fa parte la lista dei contenuti `docs/inhalte.md` nel progetto.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la merce in vetrina», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto (le cose da completare, con nome e data) e cosa viene dopo. Chiedi esplicitamente alla persona di riportare il testo nella sua voce e di verificare ogni dato (orari, percorsi, prezzi), perché tu li conosci solo dalla sua descrizione.
