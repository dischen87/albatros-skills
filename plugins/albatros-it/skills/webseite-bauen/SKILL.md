---
name: webseite-bauen
description: 'Costruisce con una persona senza conoscenze tecniche il suo sito web come in una piccola fabbrica di software, in nove passi fissi, ognuno con un risultato in docs/: incarico, mockup, sistema di design, stack tecnologico (Astro, poco JavaScript), PRD con criteri di collaudo, costruire in locale, quattro controlli con rapporto e semaforo (sicurezza, percorsi e accesso, aspetto, codice e velocità, misurati con pruefen.mjs), via libera della persona, poi porto, nastro trasportatore e sito in rete con controllo finale. Apre l''isola nel cockpit e segnala i passi con schritt_melden. Usa lo skill appena sul percorso sito web si costruisce: dopo webseite-planen, dopo l''inventario di webseite-modernisieren, con «costruiscimi il sito», «mockup», «bozza», «sistema di design», «stack tecnologico», «tech stack», «PRD», «criteri di collaudo», «criteri di accettazione», «controllare prima di pubblicare», «guardarlo in locale», «come si va avanti dopo il piano?».'
---

# Costruire il sito web: la piccola fabbrica

## L'immagine

Una casa nasce in un ordine fisso: incarico, schizzo, campioni dei materiali, tipo di costruzione, progetto con la firma, costruzione grezza, collaudo degli esperti, consegna delle chiavi, trasloco. Nessuno getta le fondamenta prima che la famiglia abbia firmato il progetto, e nessuno ci va ad abitare prima che gli esperti abbiano fatto il collaudo. Una fabbrica di software lavora allo stesso modo: ogni passo ha un risultato che si può guardare, e alla fine gli esperti controllano, prima che qualcosa esca. Sull'isola nel cockpit la casa cresce con ogni passo.

**Come usi l'immagine:** Una frase sull'immagine nella tua prima risposta. A ogni nuovo passo una frase con la sua immagine (nella tabella qui sotto), cosa nasce e a cosa serve. Così la persona capisce perché questo passo è necessario.

## Come parli

- L'ordine è fisso. Non salti nessun passo, non costruisci niente prima che il PRD sia approvato e non mandi niente al porto prima del via libera. Con Light il push è già la pubblicazione.
- Proponi tu il prossimo passo e lo fai dopo un breve sì. La persona non deve mai sapere cosa viene dopo.
- Dai del tu, lingua di tutti i giorni. Le parole tecniche (PRD, token, Lighthouse) le spieghi la prima volta con la loro immagine.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- I siti web restano statici, senza servizi propri. Un blocco (skill `bausteine`) si aggiunge solo se la persona ne ha davvero bisogno.
- Quello che la persona deve vedere (isola, mockup, bozze, anteprima, rapporti, porto, sito finito) lo apri tu nel browser: `open <indirizzo o file>` (Linux `xdg-open`, Windows `start`). Dire solo l'indirizzo non basta.

## I nove passi in breve

| Passo | Immagine | Risultato | Isola |
|---|---|---|---|
| 1. Incarico | l'incarico all'impresa di costruzioni | `docs/plan.md` o `docs/bestand.md` | |
| 2. Mockup | lo schizzo su carta | `docs/mockup.html` | `mockup` |
| 3. Sistema di design | i campioni dei materiali | `docs/designsystem.md`, `web/src/styles/tokens.css` | `entwuerfe` |
| 4. Stack tecnologico | il tipo di costruzione | `docs/stack.md` | |
| 5. PRD con criteri di collaudo | il progetto con la firma | `docs/prd.md` con `Approvato:` | `prd` |
| 6. Costruire | la costruzione grezza | `web/`, `seite/` | `lokal` |
| 7. Controllare | il collaudo degli esperti | `docs/pruefung/` con quattro rapporti | `pruefung` |
| 8. Via libera | la consegna delle chiavi | `Freigegeben:` in `docs/prd.md` | `freigabe` |
| 9. Porto, nastro trasportatore, in rete | il trasloco | sito in rete, `docs/pruefung/messwerte-live.json` | `hafen`, `fliessband`, `live` |

Quello che sta nella colonna «Risultato» deve esserci alla fine del passo. Se manca, il passo non è riuscito.

## L'isola

Subito all'inizio apri nel browser l'isola della persona. Su `https://albatros.build/it/cockpit/insel` c'è per ogni progetto una casa che cresce con ogni passo. Per francese, italiano e inglese davanti c'è il prefisso della lingua (`/fr/`, `/it/`, `/en/`), in tedesco l'indirizzo è senza prefisso (`https://albatros.build/cockpit/insel`):

```bash
open https://albatros.build/it/cockpit/insel     # macOS; Linux: xdg-open, Windows: start
```

L'isola si aggiorna da sola, basta aprirla una volta.

Dopo ogni passo riuscito che ha una voce nella colonna «Isola» chiami lo strumento `schritt_melden` di Albatros, con `schritt` (`mockup`, `entwuerfe`, `prd`, `lokal`, `pruefung`, `freigabe`, `hafen`, `fliessband`, `live`, `domain`) e `sprache` (la lingua della conversazione). `projekt` di solito lo lasci via: allora vale il diario di bordo nel porto (`git@aufwind.sh:<name>/projekt.git`), anche se nasce solo più tardi. Solo per un altro progetto che sta soltanto sul computer passi un nome breve fatto di lettere minuscole, cifre e «-». La risposta indica il passo e l'indirizzo dell'isola. Di' alla persona in una frase che la sua casa è cresciuta.

- L'isola va solo avanti. Se segnali un passo che c'è già, non cambia niente. La risposta lo dice, e tu non riprovi.
- `hafen`, `fliessband`, `live` e `domain` Albatros li vede anche da solo. Segnalali comunque, appena sono riusciti.
- Se risponde «Ungültige Angaben», il passo o il nome era scritto male: correggi e richiamalo una volta.
- Se lo strumento manca o risponde «unbekannt» (sconosciuto), si va avanti senza isola.

## I passi

### 1. Incarico

Senza incarico non si costruisce. L'incarico è la pianta `docs/plan.md` (skill `webseite-planen`) o, per un sito esistente, l'inventario `docs/bestand.md` (skill `webseite-modernisieren`). Se mancano tutti e due, vai prima lì. Leggi l'incarico e di' alla persona in tre frasi cosa si costruisce, per chi e da cosa si accorgerà che funziona.

### 2. Mockup (`schritt: mockup`)

Veloce e grezzo, in scala di grigi: la pagina iniziale e la sottopagina più importante in un unico file HTML `docs/mockup.html`, con titoli veri e il contenuto dell'incarico. Mostra la struttura e l'ordine, ancora niente colori e niente immagini (superfici grigie). Aprilo nel browser e chiedi solo: «L'ordine è giusto?»

### 3. Sistema di design (`schritt: entwuerfe`)

Segui lo skill `gestaltung`, sezioni «Tre direzioni», «Non sembrare fatto dall'IA», «La mazzetta dei colori (token)» ed «Elementi grafici». Prima chiedi del carattere, non dei colori. Poi presenti due o tre bozze chiaramente diverse sul mockup, come HTML in `docs/gestaltung/entwuerfe/`, e le apri. La persona sceglie una direzione o una combinazione, poi segnali `entwuerfe`.

Dalla direzione scelta nasce il sistema di design, i campioni dei materiali per tutta la casa:

- `web/src/styles/tokens.css`: colori per chiaro e scuro, caratteri, dimensioni dei caratteri, spaziature, arrotondamenti e ombre come variabili CSS, i valori di contrasto come commento.
- `docs/designsystem.md` su una pagina, leggibile per le persone: direzione e caratteristiche; ogni colore con nome del token, scopo e contrasto; caratteri e dimensioni; spaziature e arrotondamenti; i componenti (pulsante, link, testata, piè di pagina, scheda, campo del modulo e quello che serve ancora al sito), ognuno con il suo scopo e i token che usa; gli elementi grafici.

Colori, caratteri, spaziature, arrotondamenti e componenti stanno solo lì. Nel codice delle pagine ci sono solo `var(--…)` e i componenti. Se manca un valore, va prima nel sistema di design.

### 4. Stack tecnologico

Il tipo di costruzione lo decidi tu prima di costruire e lo scrivi in `docs/stack.md`:

```markdown
# Stack tecnologico

**Decisione:** Astro, statico
**Perché:** … (una o due frasi, dall'incarico)
**JavaScript:** solo dove serve, al massimo 50 KB per pagina
**Consegnato:** la cartella seite/ (Light: direttamente dal porto; Pilot: attraverso il nastro trasportatore)
**Non scelto:** … (per esempio un'app React o WordPress), perché …
```

Di base si usa Astro: costruisce pagine HTML veloci e semplici, senza JavaScript, che Albatros può consegnare direttamente. Un altro framework solo se la persona lo vuole espressamente o se una funzione dell'incarico ne ha bisogno. Allora sotto «Perché» c'è la funzione e perché Astro non basta. «Moderno» o «conosciuto» non è un motivo. Una lista d'iscrizione, un login o una finestra per modificare i contenuti non sono un motivo per un altro framework, ma per un blocco (skill `bausteine`, con Pilot). Di' alla persona in una frase cosa hai scelto e perché.

### 5. PRD con criteri di collaudo (`schritt: prd`)

Il PRD è il progetto su una pagina, con la lista di cosa si controlla al collaudo. Scrivi `docs/prd.md`:

```markdown
# PRD: <nome del sito>

**Per chi e a cosa serve:** … (dall'incarico)
**Pagine:** pagina iniziale, …, Impressum, protezione dei dati
**Funzioni:** ogni funzione con la sua decisione (per un sito esistente tutte quelle di docs/bestand.md)
**Design:** direzione <nome>, vedi docs/designsystem.md
**Stack tecnologico:** vedi docs/stack.md
**Hosting:** Light (pagina dal porto, senza server proprio) o Pilot (server proprio)
**Dominio:** name.aufwind.sh, più tardi dominio proprio (solo con Pilot)
**Non incluso:** …

## Criteri di collaudo

### Pagina iniziale
- [ ] Nelle prime tre frasi c'è scritto chi siete, per chi è il sito e cosa devono fare i visitatori
- [ ] Il pulsante «…» porta a …

### <ogni altra pagina>
- [ ] …

### <ogni funzione, per esempio un modulo>
- [ ] L'invio funziona, i campi obbligatori mancanti lo dicono in modo comprensibile, il messaggio arriva a <indirizzo>

### Per tutte le pagine
- [ ] Contenuto come nell'incarico, nessun segnaposto senza un'indicazione chiara
- [ ] Telefonino (largo 390 px): niente tagliato, leggibile senza zoom, pulsanti alti almeno 44 px
- [ ] Contrasto: testo almeno 4,5 : 1, pulsanti e bordi almeno 3 : 1
- [ ] Si può usare con la tastiera, il focus è visibile
- [ ] Impressum e protezione dei dati ci sono e hanno un link su ogni pagina
- [ ] Velocità: Lighthouse almeno 90 in prestazioni, accessibilità, best practice e SEO; al massimo 50 KB di JavaScript per pagina; immagini sotto 500 KB
- [ ] Nessun segreto nel codice, nessun .env in rete

Approvato: <data> da <nome>
```

Ogni criterio deve potersi controllare: si vede o si misura se è giusto. «Bello» o «moderno» non è un criterio. Scrivi invece da cosa lo si riconosce. Mostra alla persona il PRD in breve nella chat e apri il file. Solo dopo il suo sì scrivi `Approvato:` con data e nome, segnali `prd` e costruisci.

### 6. Costruire (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- In `web/astro.config.mjs`: `outDir: '../seite'`. Albatros consegna la cartella `seite/`, con Light direttamente e con Pilot attraverso il nastro trasportatore.
- `tokens.css` del passo 3 sta in `web/src/styles/` e viene incluso in ogni layout. Prima costruisci i componenti di `docs/designsystem.md`, poi con questi le pagine.
- Liste come appuntamenti, tornei o sponsor stanno come dati in `web/src/data/*.json`, le pagine le leggono. Documenti e immagini vanno in `web/public/`, le immagini rimpicciolite.
- Il simbolo nella scheda del browser (`web/public/favicon.svg` e `favicon.ico`) è la «A» di Astro: sostituiscilo con il logo o un segno tratto da esso.
- Se manca del materiale (per esempio i loghi degli sponsor), c'è un segnaposto chiaramente indicato, mai un'altra immagine sotto un nome sbagliato.
- Costruire e aprire l'anteprima:
  ```bash
  cd web && npm run build && npx astro preview --open
  ```
- Quando l'anteprima gira, segnali `lokal`, prima di mostrare il sito alla persona e aspettare la sua risposta.

### 7. Controllare (`schritt: pruefung`)

Quattro esperti fanno il collaudo della costruzione, ognuno scrive un rapporto con un semaforo. Lo script `pruefen.mjs` in questo skill misura quello che si può misurare. Copialo nel progetto e fallo partire:

```bash
mkdir -p scripts && cp <cartella di questo skill>/pruefen.mjs scripts/
# cartella sconosciuta o file mancante: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
(cd web && npm run build) && node scripts/pruefen.mjs
```

La prima volta scarica gli strumenti (Playwright, axe-core, Lighthouse, circa 200 MB) e ci mette qualche minuto. Dillo prima alla persona. Scrive `docs/pruefung/messwerte.json` e foto di ogni pagina a 390 e 1440 px in `docs/pruefung/fotos/`.

Poi scrivi quattro rapporti, di una pagina ciascuno, nella lingua della persona:

- `docs/pruefung/sicherheit.md` (sicurezza e aspetti legali): segreti nel codice, `npm audit`, nessun `.env` in `seite/`, Impressum e protezione dei dati presenti e completi (skill `recht-ch`), quali servizi esterni e cookie usa il sito.
- `docs/pruefung/ablaeufe.md` (percorsi e accesso): le regole per l'accessibilità (WCAG 2.2 AA, axe) su ogni pagina, link morti, ogni modulo provato tu stesso una volta, la pagina iniziale percorsa con la tastiera (Tab), i percorsi del PRD passo per passo.
- `docs/pruefung/aussehen.md` (aspetto): solo valori di `tokens.css`, sistema di design rispettato, ogni foto guardata da te (tagliato, coperto, leggibile?) e controllata con la lista dei tratti tipici dell'IA nello skill `gestaltung`.
- `docs/pruefung/code.md` (codice e velocità): Lighthouse nei quattro ambiti, JavaScript per pagina, dimensioni delle immagini, e quali criteri di collaudo sono soddisfatti.

```markdown
# Controllo: <ambito>

**Semaforo:** verde | giallo | rosso
**In parole semplici:** due o tre frasi su cosa significa per le visitatrici e i visitatori

## Controllato
- … (valore misurato da messwerte.json o quello che hai provato tu)

## Corretto
- …

## Aperto
- … (con il motivo per cui può restare così)
```

Poi passi in rassegna i criteri di collaudo in `docs/prd.md`: quelli soddisfatti li spunti (`- [x]`) e scrivi in breve dove o con cosa li hai controllati. Quello che non è soddisfatto resta aperto, con il motivo.

Rosso vuol dire: correggere, ricostruire, controllare di nuovo, finché niente è più rosso. Giallo va bene solo con un motivo sotto «Aperto». «Tutto verde» lo scrivi solo quando hai guardato tu le foto. Quando i quattro rapporti sono in `docs/pruefung/` e niente è più rosso, segnali `pruefung`.

### 8. Via libera (`schritt: freigabe`)

La consegna delle chiavi: è la persona a decidere se il sito può uscire. Mostrale i quattro semafori con una frase ciascuno, apri i rapporti e l'anteprima e dille cosa resta aperto. Dille anche: con Light il prossimo passo è la pubblicazione, poi il sito è visibile a tutti. Chiedi: «Il sito può andare in rete così?»

Solo dopo il suo sì esplicito scrivi in `docs/prd.md`, sotto `Approvato:`, la riga `Freigegeben: <data> da <nome>`. La parola `Freigegeben:` resta in tedesco, perché la verifica della missione la cerca. Poi segnali `freigabe`. Se vuole cambiare qualcosa, si torna al passo 6 e poi di nuovo al controllo.

### 9. Porto, nastro trasportatore e in rete (`schritt: hafen`, `fliessband`, `live`)

Il porto di Albatros (`code.aufwind.sh`) è il repository di allenamento della persona: lì c'è il suo codice, privato. Se servono ancora account, abbonamento e chiave, segui adesso lo skill `start` dal passo 3. Poi prendi il diario di bordo e ci metti dentro il nuovo sito (skill `git-logbuch`):

```bash
git clone git@aufwind.sh:{name}/projekt.git logbuch
cp -R web docs seite scripts logbuch/        # senza web/node_modules, lo esclude web/.gitignore
echo "docs/bestand/dateien/" >> logbuch/.gitignore   # la copia di lavoro del vecchio sito resta fuori
cd logbuch && git add .gitignore web docs seite scripts && git commit -m "Nuovo sito: <direzione>" && git push
```

Poi apri il porto nel browser, così la persona vede che il suo codice è lì, e segnali `hafen`:

```bash
open https://code.aufwind.sh/{name}/projekt
```

**Nastro trasportatore:** Un nastro trasportatore semplice, niente di speciale (skill `pipeline`). Con Light non ne serve nessuno: quello che sta nel porto su `main` in `seite/`, Albatros lo mostra circa un minuto dopo. Con Pilot il nastro trasportatore di `.github/workflows/deploy.yml` consegna la pagina sul server.

**In rete:** Il sito si trova su `https://{name}.aufwind.sh`, con Light senza server proprio, con Pilot sul server proprio.

**Controlli tu, la persona non aspetta mai.** Invece di «guarda di nuovo tra qualche minuto», dopo il push controlli tu finché la tua nuova pagina c'è, al massimo tre minuti. L'indirizzo risponde già prima (con il modello o la pagina di benvenuto). Perciò aspetti il titolo della tua pagina, come sta in `seite/index.html` tra `<title>` e `</title>`:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/ | grep -qF "<titolo della tua pagina>" && echo "La pagina c'è" && break; sleep 15; done
```

- **C'è:** controlla di nuovo il sito in rete (titolo, Impressum e protezione dei dati, Lighthouse). Finito vuol dire visibile:
  ```bash
  node scripts/pruefen.mjs --live https://{name}.aufwind.sh
  ```
  Se lì niente è rosso, segnali `fliessband` e `live`, apri l'indirizzo con la persona (`open https://{name}.aufwind.sh`) e confrontalo con le foto del passo 7.
- **Dopo tre minuti non c'è ancora:** chiedi `konto_status`. Con Light lì c'è scritto se l'ultimo stato è online o cosa manca. Spesso nel porto manca `seite/index.html`, perché prima del push non si è costruito o perché `seite/` sta in `.gitignore`. Con Pilot guardi nel porto sotto «Actions» dove si è fermato il nastro trasportatore (skill `pipeline`). Correggere, nuova voce, push, controllare di nuovo. Solo se non funziona ancora, dici alla persona cosa hai controllato e chiedi al coach (`coach_fragen`).

Un dominio proprio si aggiunge con lo skill `domain` (solo Pilot), poi segnali `domain`.

Si pubblica solo quello che appartiene alla persona o per cui ha il permesso (skill `webseite-modernisieren`, sezione «Diritti»).

## Trappole

- Costruire prima del PRD: così si fa bello il sito sbagliato.
- Nel porto prima del via libera: con Light questa è già la pubblicazione.
- Criteri di collaudo che non si possono controllare («bello», «moderno»): scrivi da cosa lo si vede o come lo si misura.
- Un altro framework «perché è moderno»: il motivo è il desiderio della persona o una funzione, altrimenti Astro.
- Tre bozze che si distinguono solo per il colore: nessuna vera scelta.
- Colori, spaziature o dimensioni dei caratteri scritti a mano nel codice: così il sistema di design si rompe.
- Rapporti senza valori misurati, o «tutto verde» senza aver guardato le foto.
- Dimenticare di costruire `seite/`: nel porto c'è allora la vecchia pagina. Prima di ogni push `npm run build` in `web/`.
- Far aspettare la persona («guarda più tardi»): controlli tu finché la pagina c'è (passo 9).
- Un passo non segnalato: la casa sull'isola resta ferma. Segnala ogni passo con una voce nella colonna «Isola», appena è riuscito.

## Verifica la missione

`mission_pruefen` con `webseite-02-bauen`, appena il sito è in rete. La verifica controlla se in `docs/prd.md` c'è il via libera (la riga `Freigegeben:`) e se il sito risponde. La parola `Freigegeben:` resta in tedesco, perché la verifica della missione la cerca.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la piccola fabbrica», che ne ripete il nocciolo. Poi: quale dei nove passi è fatto e cosa è nato, dove si trova il risultato, cosa deve decidere la persona e quale passo viene dopo.
