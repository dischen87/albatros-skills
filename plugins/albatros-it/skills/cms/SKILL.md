---
name: cms
description: "Aiuta una persona senza conoscenze tecniche a decidere se il suo sito web ha bisogno di un sistema per gestire i contenuti (CMS) e, se serve, lo installa, per esempio Strapi in Docker sul server Albatros, raggiungibile attraverso un tunnel sicuro. Spiega il CMS con l'immagine della bacheca. Usa lo skill con «CMS», «Strapi», «cambiare i contenuti da solo senza codice», «blog», «news», «gestire gli eventi», «la mia collega deve poter cambiare i testi», «WordPress», «area admin»."
---

# CMS: la bacheca nel corridoio

## L'immagine

Un CMS è una bacheca nel corridoio. Chi vuole comunicare qualcosa appende un foglietto, senza ricostruire la parete. Il sito web legge i foglietti e li mostra in bella forma.

Una bacheca conviene quando i foglietti arrivano spesso e da persone diverse: eventi, news, prodotti, menu. Per un sito che cambia due volte all'anno è un mobile che occupa solo spazio.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, in breve. Sconsiglia onestamente quando non serve una bacheca. Ogni software in più è qualcosa che va curato, protetto e aggiornato.

## 1. Serve davvero un CMS?

Chiedi tre cose:

1. Quanto spesso cambiano i contenuti? (ogni settimana o più spesso → piuttosto sì)
2. Chi li cambia? (persone senza terminale → piuttosto sì)
3. Ci sono molte voci dello stesso tipo? (eventi, prodotti, articoli → piuttosto sì)

Quattro livelli, prendi sempre il più semplice che basta:

| Livello | Cosa | Va bene se |
|---|---|---|
| A: testi nel progetto | contenuti come file Markdown nel repo, l'IA li cambia | una persona con l'IA cura tutto, cambiamenti rari |
| B: bacheca attraverso il tuo diario di bordo | una finestra di modifica nel browser (per esempio Decap CMS) che cambia i file nel repo | altri devono cambiare i testi, ma non serve una banca dati |
| C: bacheca piccola | PocketBase sul server, voci con titolo, data, testo e immagine | altri curano news o appuntamenti, pochi campi, quasi niente memoria (circa 20 MB) |
| D: CMS grande | Strapi con una banca dati propria sul server | molti tipi di contenuto, più ruoli, gestione delle immagini, più tardi anche un'app (circa 200 MB, costruzione fino a 2,5 GB) |

Se la risposta è A o B: scrivilo in `docs/plan.md` e fermati qui. È un buon risultato. C e D hanno bisogno di un server proprio, quindi Pilot. Con Light vanno A e B. C e D sono blocchi pronti, li monti con lo skill `bausteine` (ricetta `pinnwand` o blocco `strapi`).

## 2. Installare Strapi (livello D)

Strapi arriva come blocco pronto con una banca dati Postgres propria: skill `bausteine`, sezione «Strapi». L'essenziale in anticipo, così lo puoi spiegare alla persona:

- **Memoria:** In funzione Strapi con la banca dati usa circa 200 MB, durante la costruzione fino a 2,5 GB. La prima costruzione dura circa 7 minuti. Controlla con `free -h` se durante la costruzione c'è abbastanza memoria libera. Prima una foto: strumento `snapshot` con il nome `vor-cms`.
- **I segreti** li crea `bausteine/strapi/geheimnisse.sh` direttamente sul server, mai nel diario di bordo (skill `sicherheit`).
- **I tipi di contenuto** li scrivi come file in `bausteine/strapi/cms/src/api/`, sul server non si possono creare con dei clic. Schema: ricetta `veranstaltungen`.
- **Il passaggio segreto verso la bacheca:** L'amministrazione non è pubblica. La persona la raggiunge attraverso un tunnel. Immagine: un passaggio segreto dal suo computer direttamente nel corridoio, dove nessuno passa dalla strada.

  ```bash
  ssh -N -L 1337:localhost:1337 {name}@aufwind.sh
  ```

  Finché il tunnel è aperto, apre `http://localhost:1337/admin`. La prima volta crea lì lei stessa l'account. La password la digita solo lì.
- **Contenuti sul sito:** Quello che sta in `OEFFENTLICH` (`bausteine/strapi/cms/src/index.ts`), il sito lo legge sotto `/cms/api/…` del proprio indirizzo, subito dopo la pubblicazione. Non serve una nuova costruzione.

## Trappole

- Area admin messa pubblicamente in rete: un invito per gli aggressori. Usa il tunnel.
- Aggiornamenti dimenticati: aggiorna Strapi regolarmente, prima fai una foto.
- Immagini solo nel container: senza volume spariscono al prossimo riavvio.

## Verifica la missione

`mission_pruefen` con `webseite-04-cms`. La verifica controlla se il container `cms` è in funzione (Strapi). Se la persona ha scelto consapevolmente il livello A, B o C, dille che può saltare questa missione. È una buona decisione, non una lacuna.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la bacheca nel corridoio», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
