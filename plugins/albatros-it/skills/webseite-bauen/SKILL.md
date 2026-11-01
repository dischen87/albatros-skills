---
name: webseite-bauen
description: "Costruisce con una persona senza conoscenze tecniche il suo sito web sul suo computer, esattamente secondo la bozza approvata (P9 e P10): pruefen.mjs --vor-bau controlla il via libera per costruire, poi diario di bordo (git init, una voce per passo), modo di costruzione, PRD ricavato dalla bozza con accesso e porte (docs/tueren.txt), costruzione con Astro dal markup e dalle classi della bozza e da design/tokens.css, quattro controlli con pruefen.mjs e le porte, sopralluogo sul telefonino e sul computer, confronto con la bozza (--vergleich) e approvazione. Niente va online, se ne occupa lancieren. Segnala prd, lokal, pruefung, freigabe. Usa lo skill dopo entwurf (via libera per costruire) e con «costruiscimi il sito», «stack tecnologico», «PRD», «guardarlo in locale», «controllare prima di pubblicare», «approvazione», «come si va avanti dopo la bozza?»."
metadata:
  stand: 0.2.0
  quelle: '303806817acb'
---

# Costruire il sito web: il rustico nella tua officina

## L'immagine

La bozza è il modello in cui si può entrare, e la persona l'ha approvato. Adesso, nella sua officina, cioè sul suo computer, ne nasce il rustico: con le stesse stanze, porte e finestre del modello. Degli esperti ne fanno il collaudo, poi la persona ci passa dentro di persona, sul telefonino e sul computer (il sopralluogo), e lo approva. Un diario di bordo tiene ogni passo di lavoro. Niente va ancora online: dove sta la casa, lo decide dopo, al lancio.

**Come usare l'immagine:** una frase sull'immagine nella tua prima risposta. A ogni nuovo passo, una frase con la sua immagine (nella tabella più sotto), che cosa nasce e a che cosa serve.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco. Tu passi tutto alla persona in italiano e le parli sempre in italiano.
- Gli inizi di riga nei file di `docs/` (`Freigegeben zum Bauen:`, `Abgeleitet aus:`, `Lokal gesehen:`, `Vergleich mit Entwurf:`, `Freigegeben:`) restano in tedesco, come i segni `[Annahme: …]` e `[offen: …]`: `lage` e le verifiche li cercano così. Quello che segue i due punti lo scrivi in italiano.
- L'ordine è fisso. Si costruisce solo quando `pruefen.mjs --vor-bau` trova il via libera per costruire, e solo ciò che sta nella bozza. Se qualcosa deve essere diverso dalla bozza, lo dici alla persona prima di costruirlo.
- In questo skill niente va online e niente in un porto. Tutto resta sul computer della persona e da Albatros non costa niente.
- Proponi il prossimo passo e lo fai. La persona non deve mai sapere che cosa viene dopo.
- Il modo sta in `docs/projekt.md` (riga `Modus:`): con `machen` (fare) lavori tu e spieghi ogni passo in una frase con un'immagine, i momenti di apprendimento li offri. Con `lernen` (imparare) spieghi ogni passo con un'immagine e il perché, e la persona fa da sé i momenti di apprendimento.
- Al massimo due domande per messaggio. Quello che puoi proporre tu (modo di costruzione, porte) lo scrivi come `[Annahme: …]` (ipotesi) e fai confermare tutte le ipotesi in un solo messaggio.
- Dai del tu, lingua di tutti i giorni. Le parole tecniche (PRD, token, Lighthouse) le spieghi la prima volta con la loro immagine.
- Quello che la persona deve vedere (isola, anteprima, foto, rapporti, bozza e costruzione affiancate) lo apri tu: `open <indirizzo o file>` (Linux `xdg-open`, Windows `start`). Dire solo l'indirizzo non basta.

## I passi in breve

| Passo | Immagine | Risultato | Isola |
|---|---|---|---|
| 0. Prima di costruire | lo sguardo sulla firma sotto il modello | `pruefen.mjs --vor-bau` finisce con 0 | |
| 1. Officina e diario di bordo | preparare il banco, aprire il diario di bordo | diario di bordo con la prima voce | |
| 2. Modo di costruzione | come si costruisce: legno o pietra | `docs/stack.md` | |
| 3. PRD con accesso e porte | il progetto di costruzione, ricavato dal modello | `docs/prd.md` con `Abgeleitet aus:`, `docs/tueren.txt` | `prd` |
| 4. Costruire | il rustico | `web/`, `seite/` | `lokal` |
| 5. Controllare | il collaudo degli esperti | `docs/pruefung/` con quattro rapporti, porte controllate | `pruefung` |
| 6. Approvazione | il sopralluogo del rustico finito | `Lokal gesehen:`, `Vergleich mit Entwurf:` e `Freigegeben:` in `docs/prd.md` | `freigabe` |

I passi da 0 a 5 sono la fase P9, il passo 6 è la P10. Quello che sta nella colonna «Risultato» deve esserci alla fine del passo. Ogni passo finisce con una voce nel diario di bordo.

## L'isola

Se l'isola non è ancora aperta, la apri subito all'inizio nel browser. Sotto `https://albatros.build/it/cockpit/insel` c'è per ogni progetto una casa che cresce a ogni passo. Per francese, italiano e inglese davanti c'è il prefisso della lingua (`/fr`, `/it`, `/en`); senza prefisso è la versione tedesca:

```bash
open https://albatros.build/it/cockpit/insel     # macOS; Linux: xdg-open, Windows: start
```

L'isola si ricarica da sola, aprirla una volta basta.

Dopo ogni passo riuscito che ha una voce nella colonna «Isola», chiami lo strumento `schritt_melden` di Albatros, con `schritt` (`prd`, `lokal`, `pruefung`, `freigabe`) e `sprache` (la lingua della conversazione, qui `it`). `projekt` normalmente lo lasci via: allora conta il progetto che più tardi starà nel porto, anche se oggi è solo sul computer. Solo per un altro progetto dai un nome breve fatto di minuscole, cifre e «-», sempre lo stesso. La risposta indica il passo e l'indirizzo dell'isola. Di' alla persona in una frase che la sua casa è cresciuta.

- L'isola va solo avanti. Se segnali un passo che c'è già, non cambia niente. La risposta lo dice, non riprovi.
- Se risponde «Ungültige Angaben» (dati non validi), il passo o il nome era scritto male: correggi e richiamalo una volta.
- Se lo strumento manca, se la persona non è collegata o se risponde «unbekannt» (sconosciuto), si va avanti senza isola.

## I passi

### 0. Prima di costruire: la bozza è approvata?

Lo script di controllo `pruefen.mjs` si trova in questo skill. Copialo nel progetto, poi controlla se si può costruire:

```bash
mkdir -p scripts && cp <cartella di questo skill>/pruefen.mjs scripts/
# cartella sconosciuta: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
node scripts/pruefen.mjs --vor-bau
```

- **Finisce con 0:** c'è la riga `Freigegeben zum Bauen: <GG.MM.AAAA>, …` in `docs/entwurf.md`, la bozza in `design/entwurf/` e i token in `design/tokens.css`. Si va avanti con il passo 1.
- **Finisce con 2:** l'output (in tedesco) dice che cosa manca. Dillo alla persona in una frase e torna lì: senza via libera per costruire allo skill `entwurf` (parte «Freigabe», l'approvazione), senza bozza allo skill `entwurf`, senza token allo skill `gestaltung`. La riga `Freigegeben zum Bauen:` non la scrivi mai tu, nemmeno «al volo»: c'è solo dopo il sì della persona alla bozza.

### 1. Officina e diario di bordo

**L'officina, ancora una volta:** Node, npm e Git devono esserci, anche se c'erano già per la bozza:

```bash
command -v node npm git        # Windows in PowerShell: where.exe node npm git
```

Se manca qualcosa, aiuti a installarlo come nello skill `entwurf` (l'officina) e controlli di nuovo.

**Con un blocco** (`Setup:` in `docs/plan.md` ne nomina uno, o `Baustein:` in `docs/stack.md`) serve anche Bun: con lui il blocco e i suoi test girano su questo computer (passo 4). Controllalo con `command -v bun` (Windows in PowerShell `where.exe bun`). Se manca, la persona lo installa da sola: su Mac e Linux nel terminale `curl -fsSL https://bun.com/install | bash`, su Windows in PowerShell `powershell -c "irm bun.sh/install.ps1|iex"`. Poi aprire un nuovo terminale e controllare con `bun --version`.

**Il diario di bordo sul computer:** ogni passo riceve una voce (commit), con una nota in una frase. Così la persona può sfogliare all'indietro in qualsiasi momento. Per questo non serve un porto: il diario di bordo sta nella cartella del progetto, viene collegato solo alla messa online (skill `git-logbuch`, parte «Logbuch ohne Hafen», il diario di bordo senza porto).

- Se la cartella del progetto non ha ancora un diario di bordo (nessuna cartella `.git`), lo crei: `git init -b main`.
- Mancano nome e indirizzo per il diario di bordo (`git config user.name` resta vuoto)? Allora chiedi alla persona e imposti entrambi come nello skill `git-logbuch`, passo 1.
- `.gitignore` nella cartella del progetto, almeno:
  ```
  node_modules/
  .env
  .env.*
  !.env.example
  .DS_Store
  docs/pruefung/fotos/
  docs/pruefung/vorher/
  ```
- La prima voce fissa quello che è nato finora. Prima mostrare che cosa entra, poi scriverla:
  ```bash
  git status
  git add .gitignore AGENTS.md docs design scripts       # solo quello che c'è
  git diff --cached --stat
  git commit -m "Bozza approvata: piano, concetto, bozza"
  ```
- Regole come nello skill `git-logbuch`: solo `main`, solo i propri file e cartelle, con il nome (mai `git add .` né `git add -A`), mai `--force`.

**Momento di apprendimento «che cos'è una voce nel diario di bordo»:** una frase con l'immagine del diario di bordo. Nel modo `lernen` la persona digita lei stessa il comando `git commit` per la prima voce, poi segnali `verstanden_melden` (missione `flugschule-20-logbuch-eintrag`, tipo `selbst`). Nel modo `machen` lo offri.

### 2. Modo di costruzione (`docs/stack.md`)

Il modo di costruzione segue da `docs/plan.md`, riga `Setup:`. Lo proponi e lo scrivi come ipotesi in `docs/stack.md`:

```markdown
# Stack tecnologico

**Decisione:** [Annahme: Astro, statico]
**Perché:** … (una o due frasi, da docs/plan.md)
**JavaScript:** solo dove serve, al massimo 50 KB per pagina
**Blocco:** nessuno (oppure: quale, skill bausteine; più tardi gli servirà un server proprio)
**Consegnato:** la cartella seite/; dove abita, lo decide la persona al lancio
**Non scelto:** … (per esempio un'app React o WordPress), perché …
```

Lo standard è Astro: costruisce pagine HTML semplici e veloci, senza JavaScript. Un altro framework solo se la persona lo vuole espressamente o se una funzione del piano ne ha bisogno. Allora sotto «Perché» stanno la funzione e il motivo per cui Astro non basta. «Moderno» o «conosciuto» non è un motivo. Una lista di iscrizione, un accesso o una finestra di modifica non sono un motivo per un altro framework, ma per un blocco (skill `bausteine`).

La persona conferma il modo di costruzione insieme alle porte (passo 3), in un solo messaggio.

### 3. PRD con accesso e porte (`schritt: prd`)

Il PRD è il progetto di costruzione su una pagina. È ricavato dalla bozza approvata: la persona ha già firmato con la bozza, perciò per il PRD non c'è un collaudo a parte. Per scriverlo leggi `docs/projekt.md`, `docs/plan.md`, `docs/konzept.md`, `docs/designsystem.md`, `docs/entwurf.md` e ogni pagina in `design/entwurf/`. Scrivi `docs/prd.md`:

```markdown
# PRD: <nome del progetto>

Abgeleitet aus: docs/entwurf.md (Freigegeben zum Bauen: <data da docs/entwurf.md>)

**Per chi e a che scopo:** … (da docs/projekt.md)
**Pagine:** come nella bozza: home, …, più impressum e protezione dei dati
**Funzioni:** ognuna con il suo percorso, la conferma, l'errore e lo stato vuoto, come mostrati nella bozza (per un sito esistente ogni funzione di docs/bestand.md con la sua decisione)
**Design:** design/tokens.css e docs/designsystem.md; markup e classi da design/entwurf/
**Stack tecnologico:** vedi docs/stack.md
**Non incluso:** … (da docs/plan.md: quello che per il primo volo resta fuori)

## Accesso (chi può fare che cosa)

| Chi | vede | modifica |
|---|---|---|
| tutti i visitatori | home, …, impressum, protezione dei dati | niente |
| <ruolo da docs/plan.md, riga Zugang:> | … | … |

Le porte stanno in docs/tueren.txt e si controllano con pruefen.mjs --tueren.

## Criteri di collaudo

Ricavati da docs/plan.md (Testing:) e dalla bozza; approvati con la bozza.

### Home
- [ ] Titoli, menu e sezioni come in design/entwurf/index.html (pruefen.mjs --vergleich)
- [ ] Nelle prime tre frasi si dice chi siete, a chi si rivolge il sito e che cosa devono fare i visitatori
- [ ] Nell'intestazione c'è una foto vera o la cosa più importante del contenuto, non solo titolo e pulsante su una superficie colorata (skill gestaltung, «Schlicht heisst nicht ohne Bild»)

### <ogni altra pagina di design/entwurf/>
- [ ] Titoli, menu e sezioni come in design/entwurf/<pagina>.html
- [ ] …

### <ogni funzione, per esempio un modulo o le prenotazioni>
- [ ] L'invio funziona, i campi obbligatori mancanti si segnalano in modo comprensibile, il messaggio arriva a <indirizzo>
- [ ] Ogni lista mostra se sta caricando, se è vuota (una frase e un pulsante) o se ha un errore (con «Riprova», mai mascherato da lista vuota)
- [ ] Dopo l'invio una conferma: che cosa è successo, che cosa viene dopo, come annullarlo
- [ ] Il pulsante dice il risultato («Prenota un posto», non «Invia») ed è bloccato durante l'invio

### Per tutte le pagine
- [ ] Contenuto come nella bozza, nessun segnaposto senza un'etichetta chiara
- [ ] Telefonino (390 px di larghezza): niente tagliato, leggibile senza zoom, almeno 16 px di margine a sinistra e a destra, pulsanti alti almeno 44 px, il menu su una riga o come pulsante «Menu»
- [ ] Ogni pagina, anche quelle dei blocchi, ha intestazione, menu e piè di pagina con impressum e protezione dei dati
- [ ] Contrasto: testo almeno 4,5 : 1, pulsanti e bordi almeno 3 : 1
- [ ] Usabile con la tastiera, il focus è visibile
- [ ] Velocità: Lighthouse almeno 90 in prestazioni, accessibilità, best practice e SEO; al massimo 50 KB di JavaScript per pagina; immagini sotto 500 KB
- [ ] Ogni porta di docs/tueren.txt risponde come previsto; nessun segreto nel codice, nessun .env in rete
```

**Le porte:** dalla tabella «Accesso» nasce `docs/tueren.txt`, con per riga un percorso e lo stato con cui deve rispondere senza accesso. 200 vuol dire aperto, 404 «non esiste», 401 o 403 «solo con accesso», 302 «avanti all'accesso». Più numeri su una riga vogliono dire «uno di questi», dopo `#` c'è un commento:

```
# percorso      stato atteso senza accesso (da «Accesso» in docs/prd.md)
/               200
/impressum             200
/protezione-dei-dati   200
/verwaltung     404     # mai pubblico
/.env           404
/.git/config    404 403
/docs/plan.md   404     # i documenti di lavoro non vanno in rete
```

Con un blocco si aggiungono le sue porte. Se davanti c'è un ingresso (skill `bausteine`, parte «Ein Eingang für alles?»), sono per esempio `/intern/ 401`, `/_/ 404` e `/api/collections/_SUPERUSERS/auth-methods 404`: le pagine protette chiedono l'accesso, e l'accesso dell'amministrazione resta chiuso dall'esterno. Le liste di PocketBase (per esempio `/api/collections/users/records`) rispondono agli ospiti con 200 e una lista vuota, non con 401 o 403; se metti una lista così in `docs/tueren.txt`, allora con 200.

**Un messaggio per le ipotesi:** mostra il PRD alla persona in tre o quattro frasi, apri il file e presenta modo di costruzione e porte come ipotesi, per esempio: «Costruisco con Astro, senza blocchi, e aperte sono solo home, offerta, richiesta, impressum e protezione dei dati. Va bene così?» Dopo il suo sì togli `[Annahme: …]`, fai la voce nel diario di bordo (`git add docs && git commit -m "PRD dalla bozza, modo di costruzione e porte"`), segnali `prd` e costruisci.

**Costruire le funzioni come i professionisti.** Quello che fanno i visitatori (prenotare, iscriversi, ordinare, chiedere), lo costruisci secondo queste regole, anche se la persona non lo chiede:

- **Tre porte:** pagine pubbliche senza accesso; una pagina per gli ospiti tramite link con un codice segreto, senza conto (per esempio «Annullare la prenotazione»); l'amministrazione solo per la persona, mai collegata.
- **Una fonte per ogni verità:** offerte, prezzi, scadenze e orari stanno in un solo posto. Pagina, modulo, e-mail e condizioni leggono tutti da lì.
- **Una parola per ogni cosa,** uguale sulla pagina, nell'e-mail e nell'amministrazione. Una richiesta non è una prenotazione. Le parole stanno in `docs/designsystem.md`.
- **Controllare sul server, mai solo nel browser:** posti, scadenze e stati li calcola il server. Per le prenotazioni c'è la ricetta testata `buchungen` (skill `bausteine`), invece di reinventarla.
- **Errori onesti:** se un servizio non risponde, è un errore con «Riprova», mai «nessun appuntamento».
- **Formato svizzero:** «CHF 1'250.–», «mar 3 nov. 2026, 18:00–19:15», orari in `Europe/Zurich`.
- **Prima il telefonino:** a 390 px niente scorrimento laterale, l'azione principale si vede senza scorrere, un modulo chiede una cosa per passo («Passo 2 di 3»).

Ogni criterio deve potersi controllare: si vede o si misura se è vero. «Bello» o «moderno» non è un criterio.

### 4. Costruire (`schritt: lokal`)

```bash
npm create astro@latest web -- --template minimal --install --no-git --skip-houston --yes
```

- In `web/astro.config.mjs`: `outDir: '../seite'`. Si costruisce nella cartella `seite/`, è lei che più tardi il domicilio consegna.
- **I token in un solo posto:** il layout (per esempio `web/src/layouts/Seite.astro`) integra direttamente `design/tokens.css`, per primo: `import '../../../design/tokens.css';`. Il file non lo copi mai in `web/`: due copie prima o poi divergono. Se manca un valore, va prima in `design/tokens.css` e in `docs/designsystem.md`.
- **Markup e classi dalla bozza:** ogni pagina in `design/entwurf/` diventa una pagina in `web/src/pages/`, con lo stesso markup e le stesse classi. Quello che è uguale su più pagine (intestazione, menu, piè di pagina, schede, campi dei moduli) diventa un componente in `web/src/components/`. I fogli di stile che la bozza integra (tranne `tokens.css`) vanno così come sono in `web/src/styles/` e nel layout subito dopo i token; gli stili in uno `<style>` di una pagina della bozza vanno nella pagina o nel componente che corrisponde. Gli script che nella bozza fanno solo finta (un modulo che non invia niente, un menu inserito da uno script) li sostituisci con la cosa vera.
- **Impressum e protezione dei dati** non stanno nella bozza: li costruisci adesso nello stesso layout (skill `recht-ch`).
- **Prima i dati:** quello che la persona ha nominato nel piano (corsi con orari e posti, prezzi, orari di apertura) lo procuri adesso, prima di costruire. Un «ce l'abbiamo» non basta: chiedi il testo, la lista o una foto di essa.
- Le liste come appuntamenti, tornei o sponsor sono dati in `web/src/data/*.json`, le pagine li leggono. Documenti e immagini vanno in `web/public/`, le immagini rimpicciolite. Se vengono da un sito esistente, vale lo skill `webseite-modernisieren`, parte «Rechte» (i diritti).
- Il segno nella scheda del browser (`web/public/favicon.svg` e `favicon.ico`) è la «A» di Astro: sostituiscilo con il logo o con un segno ricavato da esso.
- Se manca del materiale (per esempio i loghi degli sponsor), c'è un segnaposto chiaramente etichettato come nella bozza, mai un'altra immagine sotto un nome falso.
- Costruire e avviare l'anteprima:
  ```bash
  (cd web && npm run build && npx astro preview --background)
  open http://localhost:4321
  ```
  L'anteprima continua a girare in background e mostra il nuovo stato dopo ogni `npm run build`, finché non la fermi con `(cd web && npx astro preview stop)`.
- **Con un blocco** (prenotazioni, lista di iscrizione, accesso) avvii, al posto dell'anteprima, `bun bausteine/pocketbase/lokal.ts` (indirizzo `http://localhost:8090`): solo così moduli e prenotazioni funzionano davvero, sul computer della persona.
- Quando l'anteprima gira, fai la voce nel diario di bordo (`git add web seite && git commit -m "Rustico: tutte le pagine dalla bozza"`; `web/.gitignore` esclude `web/node_modules`) e segnali `lokal`, prima di mostrare il sito alla persona.

### 5. Controllare (`schritt: pruefung`)

Quattro esperte fanno il collaudo del rustico, ognuna scrive un rapporto con un semaforo. `pruefen.mjs` misura quello che si può misurare, e in più controlla le porte:

```bash
(cd web && npm run build) && node scripts/pruefen.mjs
node scripts/pruefen.mjs --tueren                               # con un blocco: --tueren http://localhost:8090, mentre gira lokal.ts
```

La prima volta lo script scarica gli strumenti (Playwright, axe-core, Lighthouse, circa 200 MB) e ci mette qualche minuto. Dillo prima alla persona. Scrive `docs/pruefung/messwerte.json`, `docs/pruefung/tueren.json` e foto di ogni pagina a 390 e 1440 px in `docs/pruefung/fotos/`. I suoi messaggi sono in tedesco: li passi in italiano.

Poi scrivi quattro rapporti, di una pagina ciascuno, nella lingua della persona:

- `docs/pruefung/sicherheit.md` (sicurezza e diritto): segreti nel codice, `npm audit`, nessun `.env` in `seite/`, ogni porta di `docs/tueren.txt` con il suo stato, impressum e protezione dei dati presenti e completi (skill `recht-ch`), quali servizi esterni e cookie usa il sito.
- `docs/pruefung/ablaeufe.md` (percorsi e accesso): le regole di accessibilità (WCAG 2.2 AA, axe) su ogni pagina, link morti, ogni modulo provato tu una volta, la home percorsa con la tastiera (Tab), i percorsi del PRD passo per passo.
  - **Verde solo con una prova.** Per ogni funzione con un blocco, nel rapporto vanno l'output del test («Alles grün», tutto verde) e una foto di una vera prenotazione di prova o di una vera voce su questo computer. Se qualcosa non ha funzionato, il semaforo è giallo o rosso. Non scrivere mai «provato fino in fondo» se non l'hai fatto.
- `docs/pruefung/aussehen.md` (aspetto): `design/tokens.css` è integrato, solo i suoi valori nel codice, sistema di design rispettato, ogni foto guardata tu stesso (tagliato, coperto, leggibile?) e confrontata con la lista dei tratti da IA dello skill `gestaltung`. Se `pruefen.mjs` segna in rosso il menu sul telefonino o schede uguali sulla home, rifai la disposizione prima di andare avanti. Con il giallo «nessuna foto nella prima schermata», la cosa più importante sta in grande nell'intestazione e la persona riceve la lista delle foto.
- `docs/pruefung/code.md` (codice e velocità): Lighthouse nei quattro ambiti, JavaScript per pagina, dimensioni delle immagini, e quali criteri di collaudo sono soddisfatti.

```markdown
# Controllo: <ambito>

**Semaforo:** verde | giallo | rosso
**In parole semplici:** due o tre frasi su che cosa significa per le visitatrici e i visitatori

## Controllato
- … (valore misurato da messwerte.json o tueren.json, o quello che hai provato tu)

## Corretto
- …

## Aperto
- … (con il motivo per cui può restare così)
```

Poi passi in rassegna i criteri di collaudo in `docs/prd.md`: spunti quelli soddisfatti (`- [x]`) e annoti brevemente dove o con che cosa li hai controllati. Quello che non è soddisfatto resta aperto, con un motivo.

Rosso vuol dire: correggere, ricostruire, ricontrollare, finché non c'è più niente di rosso. Il giallo solo con un motivo sotto «Aperto». «Tutto verde» lo scrivi solo dopo aver guardato tu le foto. Quando i quattro rapporti stanno in `docs/pruefung/` e niente è più rosso, fai la voce nel diario di bordo (`git add docs web seite && git commit -m "Controllo: quattro rapporti, niente rosso"`) e segnali `pruefung`. Nel modo `lernen` adesso fai la domanda di controllo della missione `flugschule-20-logbuch-eintrag` (`mission_holen`) e segnali `verstanden_melden` (tipo `kontrollfrage`) solo dopo la risposta della persona.

### 6. Approvazione (Freigabe): il sopralluogo (`schritt: freigabe`)

Adesso la persona passa lei stessa per la sua casa. Decide se può andare online così.

1. **Mostrare in locale, sul telefonino e sul computer.** Costruire, avviare l'anteprima (passo 4) e passare ogni pagina con la persona: sul computer nell'anteprima (`open http://localhost:4321`), per il telefonino le foto a 390 px (`open docs/pruefung/fotos/start-390.png` e le altre). Se vuole vederlo sul suo vero telefonino e questo è nella stessa rete Wi-Fi: fermare l'anteprima e riavviarla con `(cd web && npx astro preview --host --background)`, poi sul telefonino apre l'indirizzo che sta sotto «Network».
2. **Confronto con la bozza.** Si è costruito quello che la persona ha visto nel modello; lo controlli pagina per pagina:
   ```bash
   node scripts/pruefen.mjs --vergleich
   ```
   Confronta per ogni pagina titoli, voci del menu e sezioni con `design/entwurf/` e segnala ogni differenza in giallo, con il punto (pagina, che cosa, numero nella bozza e nella costruzione). Per ogni differenza apri le due affiancate (`open design/entwurf/<pagina>.html` e `open http://localhost:4321/<pagina>/`). Se è un errore della costruzione, costruisci come nella bozza e confronti di nuovo. Se è voluto (per esempio un testo vero al posto di `[da completare]`), lo dici alla persona, e decide lei. Si va avanti solo quando non resta più nessuna differenza aperta.
3. **Momento di apprendimento «cambiare da sé un testo e vederlo in locale».** Nel modo `lernen` è obbligatorio, nel modo `machen` lo offri in una frase. La persona apre il file di una pagina in un editor di testo (`open -e web/src/pages/index.astro`, Windows `notepad`, Linux `xdg-open`; le liste come gli appuntamenti stanno in `web/src/data/`), cambia una frase e salva. Tu ricostruisci (`(cd web && npm run build)`), lei ricarica l'anteprima e vede la sua modifica. Poi decide: tenerla (voce nel diario di bordo, di nuovo `pruefen.mjs`, niente rosso) o tornare indietro con `git restore <file>`. Se l'ha fatto lei, segnali `verstanden_melden` (missione `flugschule-21-text-aendern`, tipo `selbst`).
4. **Quello che si è visto va in `docs/prd.md`,** sotto i criteri di collaudo (inizi di riga in tedesco):
   ```
   Lokal gesehen: <data>, sul telefonino (foto a 390 px) e sul computer (anteprima)
   Vergleich mit Entwurf: <data>, nessuna differenza aperta (pruefen.mjs --vergleich; discusso: …)
   ```
5. **La domanda:** «Hai visto il tuo sito sul tuo computer, in larghezza telefonino e computer. Lo approvi?» Aggiungi che cosa è ancora aperto (dai rapporti), e che quest'approvazione vale per la messa online: va online esattamente questo sito, né più né meno.
6. **Solo dopo il suo sì esplicito** scrivi sotto `Freigegeben: <GG.MM.AAAA>, «<le sue parole>»`, per esempio `Freigegeben: 31.10.2026, «Sì, online così»`. La data viene davanti, in cifre: senza data, con `[Annahme: …]` o con «non ancora» la riga non conta come sì, né per `lage` né per lo skill `lancieren`. «Sembra bello» senza un sì all'approvazione non basta. Poi la voce nel diario di bordo, con un segno (tag) esattamente su questo stato:
   ```bash
   git add docs/prd.md && git commit -m "Sito approvato" && git tag -f freigegeben
   ```
   Alla messa online il tag `freigegeben` mostra se da allora sul sito è cambiato ancora qualcosa.
7. Segnala `freigabe`. Nel modo `lernen` adesso fai le domande di controllo della missione `flugschule-21-text-aendern` (`mission_holen`) e segnali `verstanden_melden` (tipo `kontrollfrage`) solo dopo la risposta della persona.

Se prima dell'approvazione la persona vuole ancora cambiare qualcosa: un testo, un'immagine o un appuntamento, si torna al passo 4, poi di nuovo controllo e sopralluogo. Una nuova pagina o una nuova funzione è un'aggiunta: prima in `docs/plan.md`, poi una bozza delle pagine cambiate e un nuovo via libera per costruire (skill `entwurf`), solo dopo la costruzione.

Dopo viene lo skill `lancieren`: dove deve abitare il sito? Chiama `lage`, se lo strumento c'è, e seguilo.

## Trappole

- Costruire senza `pruefen.mjs --vor-bau`, o scrivere tu la riga `Freigegeben zum Bauen:`: si costruisce allora quello che nessuno ha approvato.
- Reinventare il markup invece di riprenderlo dalla bozza: al sopralluogo la persona vede allora qualcos'altro che nel modello.
- Un secondo `tokens.css` in `web/`: allora ci sono due verità, e una presto è sbagliata.
- Criteri di collaudo che non si possono controllare («bello», «moderno»): scrivi da che cosa si vede o si misura.
- Un altro framework «perché è moderno»: il motivo è il desiderio della persona o una funzione, altrimenti Astro.
- Colori, spaziature o dimensioni dei caratteri a mano nel codice: il sistema di design si rompe.
- Rapporti senza valori misurati, o «tutto verde» senza aver guardato le foto.
- Dimenticare di costruire `seite/`: l'anteprima mostra allora lo stato vecchio.
- Mandare qualcosa in un porto o pubblicare: non fa parte di questo skill, ma della messa online (skill `lancieren`).
- L'approvazione senza sopralluogo sul telefonino, o con differenze aperte rispetto alla bozza.
- Non segnalare un passo: la casa sull'isola resta ferma.

## Verificare la missione

`mission_pruefen` con `flugschule-20-logbuch-eintrag`, appena è segnalato `pruefung`, e con `flugschule-21-text-aendern`, appena è segnalato `freigabe`. La verifica guarda sull'isola se il progetto è almeno a quel passo. Sul percorso sito web c'è in più la missione facoltativa `webseite-02-bauen`: se la persona ha aggiornato da sé una lista come gli appuntamenti, verifichi anche quella dopo l'approvazione.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «il rustico nella tua officina», che ridice il nocciolo. Poi: quale passo è riuscito e che cosa ne è nato, dove sta il risultato, che cosa deve decidere la persona e che cosa viene dopo (dopo l'approvazione: il domicilio, skill `lancieren`).
