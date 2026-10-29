---
name: webseite-aendern
description: 'Cambia con una persona senza conoscenze tecniche il suo sito web finito dal porto di Albatros, costruito da sé o da Albatros, con la sua IA: prendere il diario di bordo dal porto, leggere prima docs/ (sistema di design, stack tecnologico e PRD sono le regole), fare la modifica nel sistema di design esistente, scriverla come criteri di collaudo nel PRD, costruire, controllare con pruefen.mjs, mostrare prima e dopo, via libera, push e controllo in rete. Le richieste piccole (testo, data, immagine) vanno veloci, quelle più grandi (nuova pagina, nuova funzione) passano da PRD e controllo. Usa lo skill con «cambia il mio sito», «nuova data», «cambiare un testo», «sostituire un''immagine», «manca …», «fai il sito …», «sul sito c''è scritto qualcosa di sbagliato», e sempre quando su un sito sotto name.aufwind.sh qualcosa deve cambiare.'
---

# Cambiare il sito web: ristrutturare una casa abitata

## L'immagine

Ristrutturare una casa abitata: nella cartella ci sono i progetti e la lista dei materiali (`docs/`). Appendere un quadro è veloce. Un muro nuovo ha bisogno di un progetto e di un collaudo. E si continua a costruire con gli stessi materiali, altrimenti sembra un rattoppo.

**Come usi l'immagine:** Una frase sull'immagine nella tua prima risposta, insieme alla tua valutazione: è una richiesta piccola o più grande?

## Come parli

- Dai del tu, lingua di tutti i giorni, frasi brevi. Quello che fai lo dici prima in una frase.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Le regole stanno in `docs/`: sistema di design, stack tecnologico e PRD. Nuovi colori, caratteri, spaziature o un altro framework solo dopo un sì esplicito della persona, e allora prima nel sistema di design.
- Niente va in rete senza via libera. Con Light il push è già la pubblicazione.
- Quello che la persona deve vedere (prima e dopo, anteprima, sito finito) lo apri tu: `open <indirizzo o file>` (Linux `xdg-open`, Windows `start`).
- La modifica con la propria IA è gratis, serve solo l'abbonamento dell'IA presso il fornitore. Se la persona preferisce non farla da sé, c'è «Lo facciamo noi per te» per CHF 29 a richiesta: la descrive nel cockpit su `https://albatros.build/it/cockpit/wuensche` (apri tu l'indirizzo per lei) e paga prima che venga fatta. Il team modifica poi il suo diario di bordo nel porto. Funziona con Light appena il sito è online, non ancora con un server proprio (Pilot).

## Procedura

### 1. Prendere il diario di bordo dal porto

Il nome del sito lo indica `konto_status`. Se il diario di bordo non è ancora su questo computer, lo prendi (skill `git-logbuch`), altrimenti prendi lo stato più recente:

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # la prima volta
cd {name} && git pull --rebase                          # ogni volta dopo
(cd web && npm ci)                                      # strumenti per costruire, non sono nel porto
```

Se `git` si ferma con «Permission denied», su questo computer manca la chiave (skill `ssh-schluessel`).

### 2. Prima leggere i progetti

Prima di cambiare qualcosa leggi:

- `docs/designsystem.md` e `web/src/styles/tokens.css`: colori, caratteri, spaziature, arrotondamenti e componenti.
- `docs/stack.md`: con cosa è costruito il sito (di solito Astro, al massimo 50 KB di JavaScript per pagina).
- `docs/prd.md`: cosa deve saper fare il sito, con i criteri di collaudo.
- `docs/plan.md` o `docs/bestand.md`: per chi è il sito.
- `web/src/data/*.json`: liste come appuntamenti, prezzi o sponsor.

Se manca `designsystem.md` o `stack.md` (sito più vecchio), prima li scrivi in breve da quello che c'è (`tokens.css`, `web/package.json`) e lo dici alla persona.

### 3. Piccola o grande?

- **Piccola:** cambiare un testo, una data, un prezzo, un orario d'apertura, un link o un'immagine, su una pagina che c'è già. Va veloce, senza mockup e senza bozze. Appuntamenti e liste li cambi in `web/src/data/*.json`, non nel codice della pagina.
- **Grande:** una nuova pagina, una nuova funzione, una nuova sezione o un altro aspetto. Qui scrivi prima i criteri di collaudo (passo 4) e aspetti il sì. Una nuova pagina riceve prima un mockup in scala di grigi (skill `webseite-bauen`, passo 2). Se la funzione ha bisogno di un programma (lista d'iscrizione, login), è un blocco con Pilot (skill `bausteine`).

Di' alla persona in una frase cos'è e come si va avanti.

### 4. La richiesta nel PRD

In fondo a `docs/prd.md`, dopo le righe `Approvato:` e `Freigegeben:` della prima costruzione, la richiesta si aggiunge come nuovi criteri di collaudo. Così si vede che la vecchia approvazione non vale per la nuova richiesta:

```markdown
## Modifiche

### <data>: <la richiesta in una frase>
- [ ] <controllabile, p. es. «Su /termine c'è il concerto di primavera: sabato 24 aprile 2027, ore 19.30, chiesa di Testdorf»>
- [ ] Solo valori del sistema di design, i criteri di collaudo di prima restano validi
```

Per una richiesta grande mostri prima i criteri alla persona e dopo il suo sì scrivi sotto `Approvato: <data> da <nome>`. Per una piccola basta mostrarli nel passo 5, insieme al risultato.

### 5. Costruire, controllare, mostrare prima e dopo

```bash
node scripts/pruefen.mjs --live https://{name}.aufwind.sh --nur aussehen --aus docs/pruefung/vorher   # foto prima
# … la modifica in web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                                # costruire e controllare
```

Se manca `scripts/pruefen.mjs`, lo prendi come nello skill `webseite-bauen`, passo 7. Rosso vuol dire: correggere e di nuovo. Nei rapporti in `docs/pruefung/` aggiungi sotto «Controllato» una riga con data e richiesta, e in `docs/prd.md` spunti i nuovi criteri. Poi apri la pagina toccata prima e dopo, una accanto all'altra, sul telefonino e sul desktop:

```bash
open docs/pruefung/vorher/fotos/live-<pagina>-390.png docs/pruefung/fotos/<pagina>-390.png
open docs/pruefung/vorher/fotos/live-<pagina>-1440.png docs/pruefung/fotos/<pagina>-1440.png
```

### 6. Via libera

Chiedi: «Può andare in rete così?» Solo dopo il sì scrivi sotto la richiesta la riga `Freigegeben: <data> da <nome>`. La parola `Freigegeben:` resta in tedesco. Se la persona vuole ancora cambiare qualcosa, si torna al passo 5.

### 7. Push e controllo in rete

Solo le tue modifiche, aggiunte una per una (skill `git-logbuch`):

```bash
git add web docs seite scripts && git commit -m "<la richiesta in una frase>" && git push
```

**Finito vuol dire visibile.** Controlli tu finché la modifica è in rete, al massimo tre minuti, con un testo preso dalla modifica:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/<pagina> | grep -qF "<testo nuovo>" && echo "La modifica c'è" && break; sleep 15; done
node scripts/pruefen.mjs --live https://{name}.aufwind.sh
```

Poi apri la pagina con la persona (`open https://{name}.aufwind.sh/<pagina>`). Se dopo tre minuti la modifica non c'è, fai come nello skill `webseite-bauen`, passo 9 («Dopo tre minuti non c'è ancora»).

## Trappole

- Partire senza `git pull`: allora manca una modifica fatta altrove, e il push viene rifiutato.
- Un colore nuovo «solo qui»: rompe il sistema di design. Valori nuovi solo con un sì, e prima in `tokens.css` e `designsystem.md`.
- Cambiare in `seite/` invece che in `web/`: alla prossima costruzione la modifica sparisce.
- Una data scritta direttamente nel codice invece che in `web/src/data/`: la prossima volta bisogna cercarla.
- Push senza via libera, oppure «è online» senza aver controllato tu.

## Messaggio finale

Il tuo ultimo messaggio inizia con una frase sull'immagine «ristrutturare una casa abitata». Poi: cosa è cambiato, dove lo si vede (con l'indirizzo), cosa è stato controllato e se resta ancora qualcosa di aperto.
