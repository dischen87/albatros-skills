---
name: webseite-aendern
description: "Cambia con una persona senza conoscenze tecniche il suo sito web finito, con la sua IA, che stia nel porto di Albatros o che se ne occupi lei stessa: prendere il diario di bordo, leggere prima docs/ (piano, sistema di design, stack tecnologico, PRD, domicilio), poi piccolo (testo, appuntamento, immagine: cambiare in locale, mostrare prima e dopo, approvazione, push) o grande (nuova pagina, funzione, altro aspetto: aggiunta al piano, bozza delle pagine cambiate, via libera per costruire, costruire e controllare, mostrare, approvazione, push), sempre nel sistema di design esistente, poi verifica in rete. Usa lo skill con «cambia il mio sito», «nuovo appuntamento», «cambiare un testo», «sostituire un'immagine», «manca …», «nuova pagina», «rendi il sito …», «sul sito c'è un errore», e ogni volta che su un sito in rete qualcosa deve cambiare."
metadata:
  stand: 0.3.3
  quelle: 'e3f90bc93ad6'
---

# Cambiare il sito web: ristrutturare una casa abitata

## L'immagine

Ristrutturare una casa abitata: nella cartella ci sono i progetti e la lista dei materiali (`docs/`). Appendere un quadro è veloce. Un muro nuovo ha bisogno prima di un progetto e di un modello che gli abitanti hanno visto. E si continua a costruire con gli stessi materiali, altrimenti sembra un rattoppo.

**Come usare l'immagine:** una frase nella tua prima risposta, insieme alla tua valutazione: richiesta piccola o grande.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco. Tu passi tutto alla persona in italiano e le parli sempre in italiano.
- Gli inizi di riga nei file di `docs/` (`Freigegeben:`, `Freigegeben zum Bauen:`, `Abgeleitet aus:`, `Wohnort:`, `Adresse:`) restano in tedesco: le verifiche li cercano così.
- Dai del tu, lingua di tutti i giorni, frasi brevi. Quello che fai lo dici prima in una frase.
- Le regole stanno in `docs/`: piano, sistema di design, stack tecnologico e PRD. Nuovi colori, caratteri, spaziature o un altro framework solo dopo un sì esplicito della persona, e prima in `design/tokens.css` (siti più vecchi: `web/src/styles/tokens.css`) e in `docs/designsystem.md`.
- Niente va in rete senza approvazione. Con Light e presso la maggior parte dei fornitori il push è già la pubblicazione.
- Quello che la persona deve vedere (prima e dopo, anteprima, bozza, sito finito) lo apri tu: `open <indirizzo o file>` (Linux `xdg-open`, Windows `start`).
- La modifica con la propria IA è gratis, serve solo l'abbonamento dell'IA presso il fornitore. Se la persona preferisce non farla da sé e il sito abita da Albatros con Light, c'è «Lo facciamo noi per te»: la descrive, tu chiami `wunsch_melden`, la risposta indica il prezzo e il link per pagare. Paga prima che venga fatta, lo stato si vede su `https://albatros.build/it/cockpit/wuensche` (apri tu l'indirizzo per lei). Con un server proprio (Pilot) o se se ne occupa lei, non si può.

## Svolgimento

### 1. Prendere il diario di bordo (Das Logbuch holen)

Dove abita il sito sta in `docs/lancieren.md` (riga `Wohnort:`, indirizzo sotto `Adresse:`), altrimenti lo dice `konto_status`. Da questo dipende dove sta il diario di bordo:

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # porto di Albatros, la prima volta
gh repo clone <utente>/<repo>                           # da te, con il diario di bordo su GitHub
git pull --rebase                                       # ogni volta successiva, nella cartella del progetto
(cd web && npm ci)                                      # attrezzi per costruire, non stanno nel diario di bordo
```

Se il diario di bordo c'è solo su questo computer (da te, senza repository), lavori lì e non prendi niente. Se `git` fallisce con «Permission denied», su questo computer manca la chiave (skill `ssh-schluessel`).

**Se il sito l'ha costruito Albatros** (nella vecchia cartella del progetto, in `docs/projekt.md` c'è `Bauen lassen: albatros`, e l'incarico è online), tutto il progetto sta al porto, e `docs/lancieren.md` non c'è: `{name}` è il nome del sito da `konto_status`. Prima viene la chiave (skill `ssh-schluessel`). Il diario di bordo lo prendi in una cartella nuova accanto a quella vecchia, non dentro: `git clone git@aufwind.sh:{name}/projekt.git ../{name}-sito`. Da qui in poi lavori lì; la vecchia cartella non la cancelli. Nella cartella presa chiami `lage` con `skills_stand` (il valore di `stand` sotto `metadata` in cima a questo file) e con le sue prove (`belege`), tra cui `docs/prd.md` con la riga `Freigegeben:` che Albatros ha inserito alla consegna (passo 4). Testi e foto che la persona ha raccolto durante la costruzione (nella vecchia cartella, `docs/inhalte.md` e `design/bilder/`) sono spesso una buona prima modifica personale.

### 2. Prima leggere i progetti

Prima di cambiare qualcosa leggi:

- `docs/designsystem.md` e `design/tokens.css` (siti più vecchi: `web/src/styles/tokens.css`): colori, caratteri, spaziature, arrotondamenti e componenti.
- `docs/stack.md`: con che cosa è costruito il sito (di solito Astro, al massimo 50 KB di JavaScript per pagina).
- `docs/prd.md`: che cosa deve saper fare il sito, con i criteri di collaudo, l'accesso e l'approvazione.
- `docs/projekt.md` (riga `Für wen:`, nei siti più vecchi `docs/plan.md`) o `docs/bestand.md`: per chi è il sito. `design/entwurf/`, se c'è: il modello delle pagine.
- `web/src/data/*.json`: liste come appuntamenti, prezzi o sponsor.

Se manca `designsystem.md` o `stack.md` (sito più vecchio), prima li scrivi brevemente da quello che c'è (`tokens.css`, `web/package.json`) e lo dici alla persona. Se manca `scripts/pruefen.mjs`, lo prendi come nello skill `webseite-bauen`, passo 0.

### 3. Piccolo o grande?

- **Piccolo:** testo, appuntamento, prezzo, orario, link o un'immagine su una pagina esistente. La strada: cambiare in locale, mostrare prima e dopo, approvazione, push (passi da 4 a 7). Appuntamenti e liste li cambi in `web/src/data/*.json`, non nel codice della pagina.
- **Grande:** una nuova pagina, una nuova funzione, una nuova parte o un altro aspetto. La strada: aggiunta al piano, bozza delle pagine cambiate, via libera per costruire, costruire e controllare, mostrare, approvazione, push (prima «Grande: piano e bozza», poi i passi da 4 a 7). Se la funzione ha bisogno di un programma (lista di iscrizione, accesso), è un blocco con un server proprio (skill `bausteine`): se il sito abita su Light, vuol dire passare a Pilot (skill `lancieren`), se te ne occupi tu un server proprio (skill `landung`).
- **Indirizzo proprio** (`meinverein.ch` invece di `{name}.aufwind.sh`): non è una ristrutturazione, ma lo skill `domain`. È facoltativo e costa a parte ogni anno.

Di' alla persona in una frase che cos'è e come si va avanti.

### Grande: piano e bozza

1. **Aggiunta al piano:** in fondo a `docs/plan.md`, con gli inizi di riga in tedesco come in tutto il piano:
   ```markdown
   ## Aggiunta <data>: <la richiesta in una frase>
   Seiten: … (nuove o cambiate)
   Funktionen: … (con percorso, conferma, errore e stato vuoto)
   Zugang: … (cambia chi può fare che cosa? allora anche docs/tueren.txt)
   ```
2. **Bozza delle pagine cambiate** in `design/entwurf/`, nel sistema di design esistente, con testi veri (skill `entwurf`). La persona la sfoglia cliccando, sul telefonino e sul computer.
3. **Via libera per costruire:** solo dopo il suo sì, in `docs/entwurf.md`, sotto un titolo per l'aggiunta, la riga `Freigegeben zum Bauen: <GG.MM.AAAA>, «<le sue parole>»`. La data viene davanti, in cifre; senza data, con `[Annahme: …]` o con «non ancora» non conta come sì. Poi `node scripts/pruefen.mjs --vor-bau` deve finire con 0.
4. **Costruire** come nello skill `webseite-bauen`, passo 4: markup e classi dalla bozza, token solo da `design/tokens.css`.

### 4. La richiesta nel PRD

In fondo a `docs/prd.md`, dopo la riga `Freigegeben:` della prima costruzione, la richiesta si aggiunge come nuovi criteri di collaudo. Così si vede che la vecchia approvazione non vale per la nuova richiesta:

```markdown
## Modifiche

### <data>: <la richiesta in una frase>
- [ ] <controllabile, p. es. «Su /termine c'è il concerto di primavera: sabato 24 aprile 2027, ore 19.30, chiesa di Testdorf»>
- [ ] Solo valori del sistema di design, i criteri di collaudo precedenti restano validi
```

Per una richiesta grande sopra c'è `Abgeleitet aus: docs/entwurf.md (Nachtrag <GG.MM.AAAA>, Freigegeben zum Bauen: <GG.MM.AAAA>)`: i criteri seguono dalla bozza a cui la persona ha dato il via libera. Per una piccola li mostri al passo 5 insieme al risultato.

Se il sito l'ha costruito Albatros, la riga della prima costruzione si chiama `Freigegeben: <GG.MM.AAAA>, Abnahme mit der Zahlung von Auftrag #<numero>`: il pagamento era l'approvazione. Questa riga resta com'è.

### 5. Cambiare, costruire, controllare, mostrare prima e dopo

```bash
node scripts/pruefen.mjs --live <indirizzo> --nur aussehen --aus docs/pruefung/vorher   # foto prima, indirizzo da docs/lancieren.md
# … la modifica in web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                    # costruire e controllare
```

Per una richiesta grande in più `node scripts/pruefen.mjs --vergleich` (le pagine cambiate come nella bozza) e, se cambia l'accesso, `node scripts/pruefen.mjs --tueren`. Rosso vuol dire: correggere e rifare. Nei rapporti sotto `docs/pruefung/` aggiungi sotto «Controllato» una riga con data e richiesta e spunti i nuovi criteri in `docs/prd.md`. Poi apri la pagina interessata prima e dopo affiancate, sul telefonino e sul computer, e l'anteprima (`(cd web && npx astro preview --background)`, poi `open http://localhost:4321/<pagina>/`):

```bash
open docs/pruefung/vorher/fotos/live-<pagina>-390.png docs/pruefung/fotos/<pagina>-390.png
open docs/pruefung/vorher/fotos/live-<pagina>-1440.png docs/pruefung/fotos/<pagina>-1440.png
```

Quando niente è più rosso, la modifica va nel diario di bordo, solo con i propri file (skill `git-logbuch`): `git add web docs seite && git commit -m "<la richiesta in una frase>"`.

### 6. Approvazione

Chiedi: «Può andare in rete così?» Solo dopo il sì scrivi sotto la richiesta `Freigegeben: <GG.MM.AAAA>, «<le sue parole>»`, con la data davanti in cifre, e fai la voce nel diario di bordo con il segno dello stato approvato:

```bash
git add docs/prd.md && git commit -m "Approvato: <la richiesta in una frase>" && git tag -f freigegeben
```

Se la persona vuole ancora qualcosa di diverso, si torna al passo 5.

### 7. Fare il push e verificare in rete

In rete va solo lo stato approvato:

```bash
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
git push                                                                # porto di Albatros o GitHub
```

Se non compare «Seite wie freigegeben» (sito come approvato), dopo l'approvazione è cambiato ancora qualcosa: prima mostrare e approvare di nuovo. Se il sito abita da te, senza repository, carichi di nuovo `seite/` come alla messa online (skill `lancieren`, parte 2, «Selbst, ohne Repo»).

**Finito vuol dire visibile.** Guardi tu finché la modifica è in rete, al massimo tre minuti, con un testo della modifica:

```bash
for i in $(seq 12); do curl -s <indirizzo>/<pagina> | grep -qF "<testo nuovo>" && echo "La modifica c'è" && break; sleep 15; done
node scripts/pruefen.mjs --live <indirizzo>
```

Poi apri la pagina con la persona (`open <indirizzo>/<pagina>`). Se dopo tre minuti la modifica non c'è, fai come nello skill `lancieren`, parte 2, passo 4 («dopo tre minuti non c'è ancora»).

## Trappole

- Cominciare senza `git pull`: manca allora una modifica fatta altrove, e il push viene rifiutato.
- Un colore nuovo «solo qui»: rompe il sistema di design. I nuovi valori arrivano solo con un sì e prima in `tokens.css` e `designsystem.md`.
- Una nuova pagina senza bozza e senza via libera per costruire: la persona la vede allora per la prima volta quando è già costruita.
- Cambiare in `seite/` invece che in `web/`: alla prossima costruzione la modifica è sparita.
- Un appuntamento direttamente nel codice invece che in `web/src/data/`: la prossima volta lo si cerca.
- Fare il push senza approvazione, o «è online» senza aver controllato tu.

## Messaggio finale

Il tuo ultimo messaggio comincia con una frase sull'immagine «ristrutturare una casa abitata». Poi: che cosa è cambiato, dove lo si vede (con l'indirizzo), che cosa è stato controllato e se c'è ancora qualcosa di aperto.
