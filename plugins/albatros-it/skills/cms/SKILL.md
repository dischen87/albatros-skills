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

Tre livelli, prendi sempre il più semplice che basta:

| Livello | Cosa | Va bene se |
|---|---|---|
| A: testi nel progetto | contenuti come file Markdown nel repo, l'IA li cambia | una persona con l'IA cura tutto, cambiamenti rari |
| B: bacheca attraverso il tuo diario di bordo | una finestra di modifica nel browser (per esempio Decap CMS) che cambia i file nel repo | altri devono cambiare i testi, ma non serve una banca dati |
| C: CMS proprio | un programma con banca dati sul server, per esempio Strapi | molte voci, più ruoli, gestione delle immagini, più tardi anche un'app |

Se la risposta è A o B: scrivilo in `docs/plan.md` e fermati qui. È un buon risultato. Il livello C ha bisogno di un server proprio, quindi Pilot. Con Light vanno A e B.

## 2. Installare Strapi (livello C)

### Prima

- Strapi ha bisogno di memoria di lavoro. Controlla con `free -h` sul server se è libero almeno circa 1 GB. Altrimenti prima più potenza (skill `kosten`).
- Fai una foto: strumento `snapshot` con il nome `vor-cms` (skill `zurueck-auf-gestern`).

### Installazione

1. In locale crea un progetto Strapi nella cartella `cms/` del repo (istruzioni attuali: `npx create-strapi@latest cms`), con SQLite come banca dati. Il file della banca dati non va nel diario di bordo (`.gitignore`).
2. In `compose.yaml` aggiungi un servizio `cms`: nome del container `cms`, porta solo verso l'interno (`127.0.0.1:1337:1337`), un volume per la banca dati e le immagini caricate. I segreti (`APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`) come variabili d'ambiente da un `.env` sul server, mai nel repo (skill `sicherheit`).
3. Diario di bordo e nastro trasportatore (skill `git-logbuch`, `pipeline`). Dopo, sul server: `docker ps` mostra `cms`.

### Il passaggio segreto verso la bacheca

L'area di modifica non è pubblica. La persona la raggiunge attraverso un tunnel. Immagine: un passaggio segreto dal suo computer direttamente nel corridoio, dove nessuno passa dalla strada.

```bash
ssh -L 1337:localhost:1337 {name}@aufwind.sh
```

Finché questa finestra è aperta, apre nel browser `http://localhost:1337/admin`. La prima volta crea lì lei stessa l'account admin. La password la digita solo lì.

### Collegare i contenuti

1. Con la persona crea un tipo di contenuto (per esempio «Evento» con titolo, data, luogo, testo, immagine).
2. Il sito web prende le voci durante la costruzione da `http://cms:1337/api/...` nella stessa rete Docker. Un token API con soli diritti di lettura, come segreto sul server.
3. Le voci nuove compaiono dopo la costruzione successiva. Chi le vuole subito: un webhook in Strapi che avvia la costruzione. Questo arriva solo quando dà davvero fastidio.

## Trappole

- Area admin messa pubblicamente in rete: un invito per gli aggressori. Usa il tunnel.
- Aggiornamenti dimenticati: aggiorna Strapi regolarmente, prima fai una foto.
- Immagini solo nel container: senza volume spariscono al prossimo riavvio.

## Verifica la missione

`mission_pruefen` con `webseite-04-cms`. La verifica controlla se il container `cms` è in funzione. Se la persona ha scelto consapevolmente il livello A o B, dille che può saltare questa missione. È una buona decisione, non una lacuna.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la bacheca nel corridoio», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
