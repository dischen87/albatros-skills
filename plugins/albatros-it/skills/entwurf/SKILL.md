---
name: entwurf
description: "Progetta con una persona senza conoscenze tecniche tutto il suo sito web da sfogliare cliccando, prima di costruirlo (piano di volo P7 e P8): prima controllare l'officina (Node, npm, Git, con un blocco anche Bun), poi ogni pagina e ogni funzione della lista di costruzione nella direzione scelta, con testi veri, un menu comune, conferma, errore e stati vuoti, le pagine dei blocchi come simulazione e solo valori da design/tokens.css; verificato con entwurf-pruefen.mjs, rifinito con i riscontri della persona. Poi il via libera per costruire, solo con un sì chiaro della persona. Il risultato è design/entwurf/ con docs/entwurf.md. Usa questo skill dopo gestaltung (tavola dei campioni vista) e con «bozza», «mostrare tutto il sito», «da sfogliare cliccando», «prototipo», «via libera per costruire», «installare Node»."
metadata:
  stand: 0.3.3
  quelle: 'ebc8e728aae4'
---

# Bozza: il modello in cui si può entrare

## L'immagine

Prima che cominci il grezzo, sul tavolo dell'architetta c'è un modello di tutta la casa: ogni stanza, ogni porta, la cucina con i suoi veri frontali. Lo si percorre con gli occhi e si dice «qui manca una finestra». Adesso una modifica costa una frase; quando il cemento è gettato, è una ristrutturazione. Per questo costruisci prima con la persona un modello così del suo sito, da sfogliare cliccando. Solo quando lei lo firma si costruisce.

Come ogni officina, anche la costruzione del modello ha bisogno di attrezzi: prima di cominciare guardi se sono appesi al muro.

**Come usare l'immagine:** Dilla alla persona nella tua prima risposta, prima di mostrare comandi. Al via libera si aggiunge la seconda immagine: la firma sotto il modello.

## Nel piano di volo

- **P7 «Progettare tutto il sito»** tocca quando la persona ha visto la tavola dei campioni (P6, skill `gestaltung`: `design/tokens.css`, `design/komponenten.css`, `design/musterblatt.html` e, in `docs/designsystem.md`, la riga `Musterblatt: gesehen am <data>`). Controllalo prima di cominciare (Windows: `dir design` e `findstr /r /b /c:"Musterblatt: gesehen am [0-9]" docs\designsystem.md`):
  ```bash
  ls design/tokens.css design/komponenten.css design/musterblatt.html
  grep -E '^Musterblatt: gesehen am [0-9]' docs/designsystem.md
  ```
  Se manca un file o se `grep` non mostra niente (per esempio c'è ancora `Musterblatt: [offen: …]`), vai prima allo skill `gestaltung`, passo 5. Se in un progetto più vecchio `tavola dei campioni vista il <data>` sta ancora in fondo alla riga `Richtung:`, ne fai la riga `Musterblatt: gesehen am <stessa data>, passt`.
- **Risultato di P7:** `design/entwurf/index.html` e un file per ogni altra pagina, più `docs/entwurf.md` con le righe `Werkstatt:` (officina), `Seiten:` (pagine) e `Rückmeldungen:` (riscontri). I nomi delle righe restano in tedesco, perché `lage` e gli script di verifica li leggono; il contenuto è in italiano.
- **P7 è fatta** quando ogni pagina di `docs/plan.md` (tranne impressum e protezione dei dati) ha il suo file, continuato dalla direzione scelta; ogni funzione della lista di costruzione (Bauliste) compare nella bozza; tutti i link portano a pagine esistenti; colori, caratteri e dimensioni compaiono solo come `var(--…)` da `design/tokens.css`; `entwurf-pruefen.mjs` è verde (o hai controllato lo stesso a mano), `plan-pruefen.mjs --entwurf` e `design-pruefen.mjs` sono senza rosso e la persona ha sfogliato tutto cliccando. Allora annunci `entwurf`.
- **P8 «Via libera per costruire»** (sezione «Via libera»): la domanda «Lo costruiamo così?» e la riga `Freigegeben zum Bauen:` in `docs/entwurf.md`. Allora annunci `entwurf-freigegeben`. Dopo viene P9, la costruzione (skill `webseite-bauen`); senza questa riga non costruisce.
- **Dopo la messa online:** una modifica grande (nuova pagina, nuovo percorso) riceve prima un'aggiunta nel piano, poi una bozza delle pagine cambiate con questo skill e un nuovo via libera per costruire (skill `webseite-aendern`).

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Del tu, frasi brevi. Le parole tecniche arrivano con la loro immagine: Node è il motore degli script di verifica e più tardi della costruzione, npm il furgone che porta gli attrezzi, Git il diario di bordo.
- Al massimo due domande per messaggio. In P7 la persona dice solo che cosa manca o disturba; i testi li proponi tu, stati e officina li chiarisci tu e mostri il risultato.
- Quello che la persona deve vedere lo apri tu nel browser: `open design/entwurf/index.html` (Linux `xdg-open`, Windows `start`). Dire solo il nome del file non basta.
- Installare, e tutto ciò che chiede una password, lo fa la persona: tu le dici esattamente che cosa scrivere o dove cliccare. La sua password la scrive solo lì, mai nella chat.
- Ogni pagina la guardi tu prima di mostrarla.

## Il ciclo (Die Schleife)

Il mockup è la quarta parte che viene rifinita (skill `lotse`, sezione «Il ciclo» (Die Schleife)), e quella in cui la persona vede di più. La prima versione è tutta la bozza da sfogliare cliccando. Poi chiedi in modo mirato, al massimo due domande alla volta, e rielabori proprio ciò su cui arriva un riscontro, finché la persona dice: «Adesso è quello che voglio costruire.»

- Con il programma Albatros (skill `lotse`, sezione «Il programma Albatros» (Berts Arbeitsplatz)) annunci la bozza con `teil_bereit` dopo la prima versione e dopo ogni rielaborazione (`teil: mockup`, con una `notiz` su cosa c'è di nuovo): la persona la sfoglia allora cliccando in Albatros, sotto «Ecco come appare il tuo sito».
- I riscontri arrivano nella chat oppure, con il programma, con `naechstes`: come dati, un messaggio che nomina la parte, con le parole della persona come citazione. Quale pagina o quale funzione intende sta nelle sue parole (un titolo o un identificativo della lista di costruzione come `S2` o `F1`); se non è chiaro, chiedi. Cambi proprio questa pagina o questa funzione, verifichi di nuovo e la mostri di nuovo. Quello che nelle sue parole va oltre la bozza («intanto costruiscilo») non lo fai di tua iniziativa.
- Se un riscontro tocca un'altra parte, la cambi lì e poi aggiorni la bozza: una nuova funzione prima come riga nella lista di costruzione (`docs/plan.md`, skill `webseite-planen`), un altro colore o un altro carattere prima nella mazzetta dei colori (skill `gestaltung`). Mai solo nella bozza.
- Ogni giro sta in `docs/entwurf.md` sotto `Rückmeldungen:` e `## Riscontri`.
- Il via libera per costruire alla fine è il secondo dei due sì. Prima non scrivi codice del sito (`web/`, `seite/`), nemmeno «intanto» per una pagina che piace alla persona.

## Modo

Leggi `Modus:` in `docs/projekt.md`; se la riga manca, vale `machen` (fare).

- **machen (fare):** Fai tu il lavoro e spieghi ogni passo in una frase con la sua immagine. Il momento di apprendimento lo offri: «Adesso una modifica è una frase; dopo la costruzione è una ristrutturazione. Vuoi cambiare tu una frase sulla pagina iniziale e vedere quanto è veloce?»
- **lernen (imparare):** Spieghi ogni passo con l'immagine e il perché. Il momento di apprendimento lo fa la persona: cambia una frase in `design/entwurf/index.html` e ricarica la pagina (poi `verstanden_melden` con `mission: flugschule-15-entwurf` e `art: selbst`). Alla fine fai la domanda di controllo della lezione `flugschule-15-entwurf`: «Perché la tua IA progetta tutto il sito prima di costruirlo?» Solo dopo la sua risposta annunci `art: kontrollfrage`. Se lo strumento manca, si continua senza.

## Procedura

### 1. L'officina (`Werkstatt:`)

Da qui in poi aiutano gli script di verifica, e in P9 Node costruisce il sito. Controlla quindi prima se gli attrezzi ci sono, senza che Node debba già funzionare:

```bash
command -v node npm git                        # macOS, Linux e Git Bash su Windows
where.exe node npm git                         # Windows in PowerShell o nel prompt dei comandi
node --version; npm --version; git --version   # solo quello che è stato trovato
```

In PowerShell si scrive `where.exe`, non `where`: senza `.exe` PowerShell cerca un'altra cosa.

| Attrezzo | A che cosa serve | Almeno (stato al 31.10.2026) |
|---|---|---|
| Node | il motore degli script di verifica e della costruzione con Astro | 22.23.4 (lo chiede Astro 7); meglio la versione LTS attuale di nodejs.org, adesso 24 o 26 |
| npm | prende gli attrezzi, arriva con Node | 10 |
| Git | il diario di bordo | 2.28 |
| Bun, solo con un blocco | fa girare il blocco e i suoi test sul computer (da P9) | controllato con 1.4.2 |

**Con un blocco** (`Setup:` in `docs/plan.md` ne nomina uno, per esempio lista di iscrizione, prenotazioni o accesso; skill `bausteine`) controlli anche Bun: `command -v bun` (Windows in PowerShell `where.exe bun`), poi `bun --version`. Senza blocco Bun non serve.

Se manca qualcosa o è troppo vecchio, spieghi con parole di tutti i giorni come arriva sul suo computer. Installa lei, tu le dici ogni clic:

- **Mac:** Node: su nodejs.org scaricare la versione LTS come programma d'installazione (.pkg), aprirlo e cliccare fino alla fine. Se c'è Homebrew (`command -v brew`), va anche `brew install node`. Git: `xcode-select --install` apre una finestra che offre gli strumenti per sviluppatori di Apple; lì cliccare su «Installa».
- **Windows:** in PowerShell `winget install -e --id OpenJS.NodeJS.LTS` e `winget install -e --id Git.Git`; quando Windows chiede se consentire le modifiche, clicca su Sì. Senza winget: i programmi d'installazione di nodejs.org e git-scm.com.
- **Linux (Ubuntu, Debian):** Git con `sudo apt install git`; sudo chiede la sua password, la scrive lei nel terminale. Node da `apt` spesso è troppo vecchio: prendi la strada che nodejs.org mostra per Linux sotto «Download» (nvm), poi `nvm install --lts`.
- **Bun, solo con un blocco:** su Mac e Linux nel terminale `curl -fsSL https://bun.com/install | bash`, su Windows in PowerShell `powershell -c "irm bun.sh/install.ps1|iex"`. La persona scrive il comando da sola; prende il programma d'installazione di Bun.

Dopo aprite un nuovo terminale e tu controlli di nuovo. In `docs/entwurf.md` va `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0 (controllato il 31.10.2026)`, con un blocco anche Bun: `Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.53.0, Bun 1.4.2 (controllato il 31.10.2026)`. Se la persona adesso non può installare (per esempio su un computer aziendale senza diritti di amministratore), la bozza si fa lo stesso: `Werkstatt: senza Node (nessun diritto di amministratore), Git 2.39.5; verifica a mano`. Dille onestamente che la costruzione in P9 ha bisogno di Node, con un blocco anche di Bun.

### 2. I testi (Die Texte) (`Seiten:`)

Una bozza con testi veri mostra se il sito regge. Segui lo skill `inhalte`: da `docs/plan.md` la lista dei contenuti `docs/inhalte.md`, la pagina iniziale in tre frasi, testi brevi nel tono di `docs/konzept.md` (`Ton:`, tu o Lei). I testi li proponi tu; ciò che manca compare in modo visibile come `[da completare: che cosa manca, chi lo fornisce entro quando]`, mai inventato. La persona conferma i testi mentre sfoglia il sito.

### 3. Progettare tutto il sito

Porti la direzione scelta (`design/richtungen/<scelta>.html`, `design/musterblatt.html` e `design/komponenten.css`) su ogni pagina di `Seiten:` in `docs/plan.md`:

- **File:** `design/entwurf/index.html` per la pagina iniziale; per ogni altra pagina il nome in minuscolo, senza accenti (è → e; in tedesco ä → ae, ö → oe, ü → ue), tutto il resto diventa «-»: «Chi siamo» → `chi-siamo.html`, «Corsi & prezzi» → `corsi-prezzi.html`. Così `entwurf-pruefen.mjs` li trova.
- **Un'intestazione, un menu, un piè di pagina** su ogni pagina, costruiti uguali: il menu con tutte le pagine del piano (sul telefonino su una riga o come pulsante «Menu»), nel piè di pagina i link a impressum e protezione dei dati. Queste due nella bozza non hanno ancora bisogno di testo: una breve pagina `impressum.html` e `protezione-dei-dati.html` con `[da completare: il testo arriva con la costruzione, skill recht-ch]` basta, perché nessun link porti nel vuoto. Nella costruzione si chiamano uguale (`/impressum`, `/protezione-dei-dati`, skill `recht-ch`).
- **Solo valori della mazzetta dei colori:** ogni pagina integra `../tokens.css` e `../komponenten.css`; il CSS proprio per la struttura delle pagine va in `design/entwurf/entwurf.css`. Colori, caratteri, dimensioni dei caratteri, spaziature, arrotondamenti e ombre compaiono solo come `var(--…)`. Se manca un valore, lo aggiungi prima in `design/tokens.css` (e nella tavola dei campioni), mai in una pagina.
- **Ogni funzione della lista di costruzione, con il suo identificativo:** il punto in cui si mostra una funzione della lista di costruzione in `docs/plan.md` (il modulo, il pulsante, la lista) porta l'attributo `data-bauliste` con il suo identificativo: `<form data-bauliste="F1" action="contatto-confermato.html">`. Se un punto ne mostra più di una, stanno separate da spazi (`data-bauliste="F1 F3"`). Compaiono anche le voci `Kann` (può arrivare dopo), altrimenti la persona decide su qualcosa che non ha mai visto; se una non deve proprio entrare nel primo volo, sta scritto con il motivo in `docs/entwurf.md`. Durante la costruzione l'attributo resta nel markup, così più tardi si può verificare se tutto è costruito.
- **Gli stati di ogni funzione:** Per ogni funzione della lista di costruzione (in breve in `Funktionen:` in `docs/plan.md`) mostri che cosa succede dopo il clic: la **conferma** (che cosa è successo, che cosa viene dopo, come annullarlo), l'**errore** (a parole, con «Riprova», ciò che è stato scritto resta lì) e lo **stato vuoto** (una frase e un pulsante invece di una lista vuota). Ogni stato è una pagina a sé, per esempio `contatto-confermato.html`, `contatto-errore.html`, `date-vuoto.html`. Un modulo punta con `action="contatto-confermato.html"` alla sua conferma; così il clic funziona anche senza un programma dietro. Una pagina `zustaende.html` (non nel menu) elenca tutti gli stati con dei link, perché la persona li trovi.
- **Le pagine dei blocchi come simulazione:** se il piano ha bisogno di un blocco (`Setup:`, skill `bausteine`: lista di iscrizione, prenotazioni, accesso, bacheca), progetti le sue pagine allo stesso modo, con intestazione, menu e piè di pagina: per esempio `prenotare.html` con le date, `prenotare-confermato.html`, `prenotare-completo.html` («Questo posto è appena stato preso»), `prenotare-vuoto.html` e «Le mie prenotazioni» (`verwaltung.html`, non nel menu). Sembrano vere ma ancora non funzionano; si costruiscono in P9 dalla ricetta del blocco.
- **Il personaggio,** se in `docs/konzept.md` c'è `Maskottchen: ja`: solo nei punti indicati lì (benvenuto, successo, vuoto), come immagine da `design/figur/` o come schizzo. Mai con errori.
- **Immagini:** foto proprie dalla lista delle foto in `docs/inhalte.md` in `design/entwurf/bilder/`, altrimenti una superficie grigia con `alt="[da completare: foto …]"`. Ogni `<img>` ha `width`, `height` e una descrizione.
- **Unico, non fatto con lo stampino:** valgono i criteri dello skill `gestaltung`, sezione «Unico, non fatto con lo stampino» (Eigen statt Baukasten): niente titolo centrato con due pulsanti come testata, niente emoji come icone, niente testi Lorem, niente schede tutte della stessa grandezza. Movimento e 3D solo come nella sezione «Movimento e 3D» (Bewegung und 3D) di quello skill: ogni movimento con la sua frase in `docs/designsystem.md` e con riguardo per «Riduci movimento», il 3D solo con un'immagine ferma (`data-3d-standbild`) e caricato solo quando serve.
- **Costruito per il telefonino:** `<meta name="viewport" content="width=device-width, initial-scale=1">` in ogni pagina, nessuno scorrimento laterale a 390 px, pulsanti alti almeno 44 px.
- **Link** sempre con il percorso dalla pagina e con `.html` (`contatto.html`, `../index.html`), mai con «/» all'inizio e mai verso una cartella: la bozza si apre come file, senza server.

### 4. Verificare con entwurf-pruefen.mjs

Lo script di questo skill verifica ciò che si può verificare; non scarica niente e non cambia niente. Copialo nel progetto e avvialo:

```bash
mkdir -p scripts && cp <cartella di questo skill>/entwurf-pruefen.mjs scripts/
# cartella sconosciuta: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/entwurf/entwurf-pruefen.mjs -o scripts/entwurf-pruefen.mjs
node scripts/entwurf-pruefen.mjs
```

Dà un semaforo per ogni ambito e finisce con 1 se c'è del rosso. I suoi messaggi sono in tedesco; tu li spieghi alla persona in italiano:

- **Seiten aus dem Plan (pagine del piano):** ogni pagina di `Seiten:` in `docs/plan.md` ha il suo file (impressum e protezione dei dati esclusi).
- **Links und Dateien (link e file):** ogni link, ogni immagine, ogni modulo e ogni `url(…)` punta a un file che esiste, scritto esattamente così (maiuscole e minuscole come sul server).
- **Farbfächer (mazzetta dei colori):** colori, caratteri e dimensioni solo come `var(--…)` da `design/tokens.css`, anche nella tavola dei campioni e in `komponenten.css`; ogni `var(--…)` esiste; ogni commento di contrasto in `tokens.css` è ricalcolato.
- **Menü, Handy und Notizen (menu, telefonino e note):** lo stesso menu su ogni pagina, la riga per il telefonino (`viewport`), il numero di `[da completare]`, le righe in `docs/entwurf.md`.

In più girano i due script degli skill `webseite-planen` e `gestaltung` (copiati lì; se mancano in `scripts/`, li prendi come sopra dalla cartella del rispettivo skill):

```bash
node scripts/plan-pruefen.mjs --entwurf     # funzionalità complete: ogni pagina e ogni funzione della lista di costruzione compare nella bozza
node scripts/design-pruefen.mjs             # unico, non fatto con lo stampino: carattere, mondo dei colori, testi, testata, movimento, 3D, peso
```

Se nella bozza manca una voce `Muss` (deve esserci) della lista di costruzione, è rosso; una voce `Kann`, giallo. Poi viene quello che nessuno script vede: l'autoverifica e il secondo parere in un contesto nuovo (skill `gestaltung`, sezione «Autoverifica e secondo parere» (Selbstprüfung und zweite Meinung)), con il risultato in `docs/entwurf.md` sotto `## Verifica`.

Rosso vuol dire: correggere e verificare di nuovo, finché niente è più rosso. Il giallo resta solo con un motivo in `docs/entwurf.md`. **Senza Node** verifichi lo stesso a mano, pagina per pagina: ogni pagina del piano come file; ogni `href`, `src` e `action` contro la lista dei file (`ls design/entwurf`); nel CSS e in `style="…"` niente `#…`, `rgb(`, `hsl(`, nomi di colori, niente `font-family` tranne `var(--…)` e niente numeri con `px`, `rem` o `em` per caratteri, spaziature, arrotondamenti e ombre; ogni commento di contrasto ricalcolato con la formula dello skill `barrierefreiheit`; ogni riga della lista di costruzione contro le pagine (dov'è mostrata?); la lista dello skill `gestaltung`, sezione «Unico, non fatto con lo stampino» (Eigen statt Baukasten). Poi scrivi `verifica a mano` con la data in `docs/entwurf.md`.

### 5. Mostrare: sul telefonino e sul computer

Prima che la persona veda qualcosa, guardi tu. Con Node fai foto di ogni pagina larghe 390 e 1440 px e le guardi tutte: c'è qualcosa di tagliato? Il menu sta su una riga? Il testo ha spazio al bordo? Il computer sembra vuoto?

```bash
npx -y playwright@1 install chromium      # una volta, circa 150 MB
npx -y playwright@1 screenshot --viewport-size=390,844 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-390.png
npx -y playwright@1 screenshot --viewport-size=1440,900 --full-page "file://$PWD/design/entwurf/index.html" docs/entwurf-fotos/start-1440.png
```

Su Windows al posto di `file://$PWD/…` ci va il percorso intero, per esempio `file:///C:/Users/anna/projekt/design/entwurf/index.html`.

Poi apri `design/entwurf/index.html` e `design/entwurf/zustaende.html` per la persona e le mostri come avere la vista telefonino: rendere la finestra strettissima, oppure in Firefox e Chrome `Ctrl+Shift+M` (sul Mac in Firefox `Cmd+Opt+M`, in Chrome prima `F12`). Sul telefonino vero, nella stessa rete wifi, si fa con `npx -y serve design/entwurf`: lei scrive sul telefonino l'indirizzo che compare sotto «Network», poi lo fermi con `Ctrl+C`.

### 6. Riscontri (`Rückmeldungen:`)

Chiedi: «Clicca dappertutto, sul telefonino e sul computer: che cosa manca, che cosa disturba?» Perché: adesso una modifica è una frase; dopo la costruzione è una ristrutturazione. Ogni riscontro va con la data e le sue parole in `docs/entwurf.md`; tu cambi proprio la pagina o la funzione che intende, verifichi di nuovo con i tre script e la mostri di nuovo (sezione «Il ciclo»). Se non chiede niente e dice solo «bene», la aiuti con due domande mirate, per esempio: «Sulla pagina iniziale trovi in cinque secondi che cosa offri?» e «Nella richiesta manca un campo che ti serve?» Sul percorso attività ne fa parte il test dei cinque secondi del metodo `landingpage`: la persona mostra la prima schermata sul telefonino a due o tre persone del pubblico; anche le loro risposte vanno sotto `Rückmeldungen:`.

Si va avanti per tutti i giri che servono. Quando niente è più rosso e alla persona non manca né disturba più niente, annunci `entwurf` (sezione «L'isola») e passi al via libera.

### docs/entwurf.md

Ogni riga comincia a inizio riga con il suo nome in tedesco e resta breve (al massimo 300 caratteri), perché `lage` la legge; i dettagli vanno sotto.

```markdown
# Bozza: <nome>
Stand: <GG.MM.AAAA>

Werkstatt: Node <versione>, npm <versione>, Git <versione>, con un blocco Bun <versione> (controllato il <GG.MM.AAAA>)
Seiten: Pagina iniziale (index.html), Offerta (offerta.html), Contatto (contatto.html con conferma ed errore); ancora <numero> da completare
Rückmeldungen: <GG.MM.AAAA> ‹<le sue parole>› → <che cosa è cambiato>
Freigegeben zum Bauen: <GG.MM.AAAA>, ‹<le sue parole>›

## Pagine
| Pagina | File | Testi | Stati | Aperto |
|---|---|---|---|---|

## Blocchi come simulazione
- …

## Riscontri
- <GG.MM.AAAA>, ‹…›: cambiato …

## Verifica
- <GG.MM.AAAA>: entwurf-pruefen.mjs verde (oppure: verifica a mano)
- <GG.MM.AAAA>: plan-pruefen.mjs --entwurf: <numero> di <numero> voci della lista di costruzione; design-pruefen.mjs <verde | giallo, perché …>
- <GG.MM.AAAA>: secondo parere (<IA e modo>): <numero> ok, <numero> rischio, <numero> aperto
```

La riga `Freigegeben zum Bauen:` (via libera per costruire) si aggiunge solo con il via libera.

## Via libera (Freigabe)

La seconda immagine: la firma sotto il modello. Si costruisce solo ciò che la persona ha visto e a cui ha dato il via libera.

Dille in tre o quattro frasi che cosa c'è nella bozza (le pagine, le funzioni con i loro stati, ciò che è ancora da completare), apri la pagina iniziale e chiedi esattamente così:

«Lo costruiamo così?»

- **Vale solo un sì chiaro alla costruzione:** «Sì», «Sì, costruiscilo così», «Sì, vai», «D'accordo, costruiamo». Un complimento da solo non è un via libera: a «sembra bello» o «carino» chiedi una volta: «Mi fa piacere. Vuol dire: sì, lo costruiamo così?»
- **«Sì, ma …»** non è un via libera: prima cambiare, mostrare di nuovo, chiedere di nuovo.
- Con il programma Albatros chiedi il sì con `ja_moment` (`entwurf`); la riga la scrive allora il programma, quando la persona clicca in Albatros su «Sì, confermo» (skill `lotse`, sezione «Il programma Albatros» (Berts Arbeitsplatz)).
- Dopo il sì scrivi in `docs/entwurf.md` la riga `Freigegeben zum Bauen: <GG.MM.AAAA>, ‹<le sue parole>›`, per esempio `Freigegeben zum Bauen: 31.10.2026, ‹Sì, costruiscilo così›`, e annunci `entwurf-freigegeben`. Le parole `Freigegeben zum Bauen:` restano in tedesco, perché la costruzione le cerca. La data viene davanti, in cifre: senza data, con `[Annahme: …]` o con «non ancora» la riga non conta come sì, né per `lage` né per `pruefen.mjs --vor-bau`.
- **Se la bozza cambia dopo il via libera,** questo non vale più: trasforma la riga in `Früher freigegeben zum Bauen: …` (via libera precedente), cambia, mostra di nuovo e chiedi di nuovo. Così la riga `Freigegeben zum Bauen:` vuol sempre dire: proprio questa bozza ha il via libera.

Dopo viene P9: segui lo skill `webseite-bauen` (`../webseite-bauen/SKILL.md`). Costruisce da questa bozza, con il suo markup, le sue classi e `design/tokens.css`, e non costruisce senza la riga `Freigegeben zum Bauen:`.

## L'isola

Dopo il passo 6 chiami lo strumento `schritt_melden` con `schritt: entwurf` e `sprache: it`, dopo il via libera con `schritt: entwurf-freigegeben`. `projekt` lo lasci fuori, a meno che la persona lavori a un altro progetto che sta solo sul suo computer; allora dai il suo nome breve. Dille in una frase che la sua casa è cresciuta. Se lo strumento risponde «Ungültige Angaben» (dati non validi), controlla una volta la scrittura; se Albatros non conosce ancora il passo, si continua senza isola, `docs/entwurf.md` ne è la prova. Dopo chiami di nuovo `lage` (skill `lotse`), sempre con `skills_stand`: il valore di `stand` sotto `metadata` in cima a questo file.

## Trappole

- **Progettate solo due o tre pagine:** le lacune si vedono allora solo durante la costruzione. Ogni pagina e ogni funzione della lista di costruzione fa parte della bozza.
- **Un giro, poi il via libera:** la prima versione è di rado quella che la persona vuole costruire. Chiedi in modo mirato finché lo dice.
- **Una testata come dappertutto:** titolo centrato, una riga, due pulsanti. `design-pruefen.mjs` la segnala in rosso.
- **Solo il percorso in cui tutto va bene:** mancano conferma, errore e lista vuota. Un buon sito non va in pezzi quando c'è un errore.
- **Testi inventati:** ciò che manca compare come [da completare], perché nessuno lo dimentichi.
- **Colori o spaziature direttamente in una pagina:** allora la bozza mostra altro rispetto alla tavola dei campioni, e la costruzione eredita l'errore.
- **Link con «/» all'inizio o verso cartelle:** nella bozza aperta come file portano nel vuoto.
- **Prendere «sembra bello» per un via libera:** serve un sì alla costruzione.
- **Continuare a cambiare in silenzio dopo il via libera:** ogni modifica ha bisogno di un nuovo via libera.

## Verifica la missione

`mission_pruefen` con `flugschule-15-entwurf`, sul percorso sito web anche con `webseite-03-inhalte`. La verifica guarda se il progetto è almeno al passo «Bozza» sull'isola.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «il modello in cui si può entrare», che ripete l'essenziale. Poi: che cosa è fatto (quali pagine, quali stati, i semafori di `entwurf-pruefen.mjs`), dove si trova il risultato (`design/entwurf/`, `docs/entwurf.md`), che cosa resta aperto (le cose da completare con nome e data) e che cosa viene dopo: prima del via libera la domanda «Lo costruiamo così?», dopo la costruzione con lo skill `webseite-bauen`.
