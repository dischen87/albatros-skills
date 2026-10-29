---
name: webseite-bauen
description: "Costruisce con una persona senza conoscenze tecniche il suo sito web in otto passi fissi: mockup, design (due o tre proposte secondo le caratteristiche), framework, PRD da approvare, costruire e mostrare in locale, mandare al porto e mostrarlo lì nel browser, nastro trasportatore, pagina o server. Apre l'isola nel cockpit e segnala ogni passo con schritt_melden. Usa lo skill appena sul percorso sito web si costruisce: dopo webseite-planen, dopo l'inventario di webseite-modernisieren, con «costruiscimi il sito», «mockup», «bozza», «PRD», «guardarlo in locale», «come si va avanti dopo il piano?»."
---

# Costruire il sito web: dalla pianta alla casa finita

## L'immagine

Una casa nasce in un ordine fisso: prima uno schizzo, poi le viste tra cui scegliere, poi il progetto con la firma, poi la costruzione, poi il trasloco. Nessuno getta le fondamenta prima che la famiglia abbia firmato il progetto. Sull'isola nel cockpit la casa cresce con ogni passo.

**Come usi l'immagine:** Una frase nella tua prima risposta, con il passo a cui siete arrivati.

## Come parli

- L'ordine è fisso. Non salti nessun passo e non costruisci niente prima che la persona abbia approvato il PRD.
- Proponi tu il prossimo passo e lo fai dopo un breve sì. La persona non deve mai sapere cosa viene dopo.
- Dai del tu, lingua di tutti i giorni. «PRD» lo spieghi la prima volta: il progetto con la firma, su una pagina.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- I siti web restano statici, senza servizi propri. Un blocco (skill `bausteine`) si aggiunge solo se la persona ne ha davvero bisogno.
- Quello che la persona deve vedere (isola, mockup, bozze, anteprima, porto, sito finito) lo apri tu nel browser: `open <indirizzo o file>` (Linux `xdg-open`, Windows `start`). Dire solo l'indirizzo non basta.

## L'isola

Subito all'inizio apri nel browser l'isola della persona. Su `https://albatros.build/it/cockpit/insel` c'è per ogni progetto una casa che cresce con ogni passo. Per francese, italiano e inglese davanti c'è il prefisso della lingua (`/fr/`, `/it/`, `/en/`), in tedesco l'indirizzo è senza prefisso (`https://albatros.build/cockpit/insel`):

```bash
open https://albatros.build/it/cockpit/insel     # macOS; Linux: xdg-open, Windows: start
```

L'isola si aggiorna da sola, basta aprirla una volta.

Dopo ogni passo riuscito chiami lo strumento `schritt_melden` di Albatros, con `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `hafen`, `fliessband`, `live`, `domain`) e `sprache` (la lingua della conversazione). `projekt` di solito lo lasci via: allora vale il diario di bordo nel porto (`git@aufwind.sh:<name>/projekt.git`), anche se nasce solo più tardi. Solo per un altro progetto che sta soltanto sul computer passi un nome breve fatto di lettere minuscole, cifre e «-». La risposta indica il passo e l'indirizzo dell'isola. Di' alla persona in una frase che la sua casa è cresciuta.

- L'isola va solo avanti. Se segnali un passo che c'è già, non cambia niente. La risposta lo dice, e tu non riprovi.
- `hafen`, `fliessband`, `live` e `domain` Albatros li vede anche da solo. Segnalali comunque, appena sono riusciti.
- Se risponde «Ungültige Angaben», il passo o il nome era scritto male: correggi e richiamalo una volta.
- Se lo strumento manca o risponde «unbekannt» (sconosciuto), si va avanti senza isola.

## Gli otto passi

### 1. Mockup (`schritt: mockup`)

Veloce e grezzo, in scala di grigi: la pagina iniziale e la sottopagina più importante in un unico file HTML `docs/mockup.html`, con titoli veri e il contenuto della pianta (`docs/plan.md`) o dell'inventario (`docs/bestand.md`). Mostra la struttura e l'ordine, ancora niente colori e niente immagini (superfici grigie). Aprilo nel browser e chiedi solo: «L'ordine è giusto?»

### 2. Design (`schritt: entwuerfe`)

Segui lo skill `gestaltung`, sezione «Tre direzioni». Prima chiedi del carattere, non dei colori. Poi presenti due o tre proposte chiaramente diverse sul mockup: le stesse pagine, una volta per direzione, come HTML in `docs/gestaltung/entwuerfe/`. Dopo controlli con la lista dei tratti tipici dell'IA e chiedi degli elementi grafici (icone, illustrazioni, foto, mascotte, 3D). La persona sceglie una direzione o una combinazione.

### 3. Framework

Se la persona non dice niente, prendi quello che ha più senso e dici in una frase perché. Per un sito statico è Astro: costruisce pagine HTML veloci e semplici, che Albatros può consegnare direttamente. Un altro framework solo se la persona lo vuole o il sito ne ha bisogno.

### 4. Mostrare il PRD e farlo approvare (`schritt: prd`)

Scrivi `docs/prd.md` su una pagina e mostralo alla persona. Solo dopo il suo sì si costruisce.

```markdown
# PRD: <nome del sito>

**Per chi e a cosa serve:** … (da docs/plan.md)
**Pagine:** pagina iniziale, …
**Funzioni:** ogni funzione con la sua decisione (per un sito esistente tutte quelle di docs/bestand.md)
**Design:** direzione <nome>, caratteristiche …, carattere tipografico …, elementi grafici …
**Framework:** Astro (statico), perché …
**Hosting:** Light (pagina dal porto, senza server proprio) o Pilot (server proprio)
**Dominio:** name.aufwind.sh, più tardi dominio proprio (solo con Pilot)
**Non incluso:** …

Approvato: <data> da <nome>
```

### 5. Costruire e mostrare in locale (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- In `web/astro.config.mjs`: `outDir: '../seite'`. Albatros consegna la cartella `seite/`, con Light direttamente e con Pilot attraverso il nastro trasportatore.
- La mazzetta dei colori dello skill `gestaltung` sta in `web/src/styles/tokens.css`. Fuori da lì non c'è nessun colore e nessuna dimensione di carattere scritta a mano.
- Liste come appuntamenti, tornei o sponsor stanno come dati in `web/src/data/*.json`, le pagine le leggono. Documenti e immagini vanno in `web/public/`, le immagini rimpicciolite.
- Costruire e aprire l'anteprima nel browser:
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- Foto in larghezza telefonino e desktop (skill `gestaltung`, passo 6) e confronto con il PRD: passa in rassegna ogni funzione e ogni contenuto e scrivi in `docs/prd.md` dove si trovano sul nuovo sito. Se manca qualcosa, lo costruisci prima che vada nel porto. Se manca del materiale (per esempio i loghi degli sponsor), c'è un segnaposto chiaramente indicato, mai un'altra immagine sotto un nome sbagliato.
- Guarda tu ogni foto come una visitatrice: il testo sulle immagini si legge bene, niente è tagliato o coperto? Quello che non va lo correggi prima che vada nel porto.
- Il simbolo nella scheda del browser (`web/public/favicon.svg` e `favicon.ico`) è la «A» di Astro: sostituiscilo con il logo o un segno tratto da esso.
- Quando l'anteprima gira, segnali `lokal`.

### 6. Mandare al porto (`schritt: hafen`)

Il porto di Albatros (`code.aufwind.sh`) è il repository di allenamento della persona: lì c'è il suo codice, privato. Se servono ancora account, abbonamento e chiave, segui adesso lo skill `start` dal passo 3. Poi prendi il diario di bordo e ci metti dentro il nuovo sito (skill `git-logbuch`):

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite logbuch/        # senza web/node_modules, lo esclude web/.gitignore
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # la copia di lavoro del vecchio sito resta fuori
cd logbuch && git add .gitignore web docs seite && git commit -m "Nuovo sito: <direzione>" && git push
```

Poi apri il porto nel browser, così la persona vede che il suo codice è lì:

```bash
open https://code.aufwind.sh/{name}/projekt
```

### 7. Nastro trasportatore (`schritt: fliessband`)

Un nastro trasportatore semplice, niente di speciale (skill `pipeline`). Con Light non ne serve nessuno: quello che sta nel porto su `main` in `seite/`, Albatros lo mostra circa un minuto dopo. Con Pilot il nastro trasportatore di `.github/workflows/deploy.yml` consegna la pagina sul server.

### 8. Pagina o server (`schritt: live`, più tardi `schritt: domain`)

- **Light:** Albatros mostra la pagina senza server proprio su `https://{name}.aufwind.sh`.
- **Pilot:** La pagina gira sul server proprio, anche lei su `https://{name}.aufwind.sh`.

**Controlli tu, la persona non aspetta mai.** Invece di «guarda di nuovo tra qualche minuto», dopo il push controlli tu finché la pagina c'è, al massimo tre minuti:

```bash
curl -sf -o /dev/null --retry 12 --retry-delay 15 --retry-all-errors https://{name}.aufwind.sh/ && echo "La pagina c'è"
```

- **C'è:** segnala `fliessband` e `live`, apri l'indirizzo con la persona (`open https://{name}.aufwind.sh`) e confrontalo con le foto del passo 5.
- **Dopo tre minuti non c'è ancora:** chiedi `konto_status`. Con Light lì c'è scritto se l'ultimo stato è online o cosa manca. Spesso nel porto manca `seite/index.html`, perché prima del push non si è costruito o perché `seite/` sta in `.gitignore`. Con Pilot guardi nel porto sotto «Actions» dove si è fermato il nastro trasportatore (skill `pipeline`). Correggere, nuova voce, push, controllare di nuovo. Solo se non funziona ancora, dici alla persona cosa hai controllato e chiedi al coach (`coach_fragen`).

Un dominio proprio si aggiunge con lo skill `domain` (solo Pilot), poi segnali `domain`.

Si pubblica solo quello che appartiene alla persona o per cui ha il permesso (skill `webseite-modernisieren`, sezione «Diritti»).

## Trappole

- Costruire prima del PRD: così si fa bello il sito sbagliato.
- Tre bozze che si distinguono solo per il colore: nessuna vera scelta.
- Dimenticare di costruire `seite/`: nel porto c'è allora la vecchia pagina. Prima di ogni push `npm run build` in `web/`.
- Far aspettare la persona («guarda più tardi»): controlli tu finché la pagina c'è (passo 8).
- Un passo non segnalato: la casa sull'isola resta ferma. Segnala ogni passo appena è riuscito.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «dalla pianta alla casa finita», che ne ripete il nocciolo. Poi: quale degli otto passi è fatto, dove si trova il risultato, cosa deve decidere la persona e quale passo viene dopo.
