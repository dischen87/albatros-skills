---
name: lancieren
description: "Mette online il sito approvato di una persona senza conoscenze tecniche, in due parti. Domicilio (P11): sempre la stessa domanda, Albatros (Light senza blocchi, Pilot con un blocco) o da te, prezzi solo da konto_status, upgrade_link con bestaetigt solo dopo la scelta, chiave SSH, seite_erstellen o server_erstellen; da te GitHub Pages, Cloudflare Pages, Netlify o un server proprio. Messa online (P13): solo con «Freigegeben:» il sito approvato nel porto o dal fornitore, con blocco e accesso l'ingresso davanti, verifica dall'esterno (pruefen.mjs --live e --tueren), dominio facoltativo, go-live-check sul percorso attività, annuncio. Risultato: docs/lancieren.md, docs/live.md. Usa lo skill dopo l'approvazione e con «mettere online», «pubblicare», «lanciare», «dove deve abitare il mio sito», «scegliere un abbonamento», «ospitarlo da me»."
metadata:
  stand: 0.3.0
  quelle: 'd75f241bcaf6'
---

# Lanciare: il domicilio e l'inaugurazione

## L'immagine

La casa è costruita, collaudata e approvata. Adesso vengono due cose, in quest'ordine. Prima decidi dove sta e vai a prendere la chiave: il **domicilio**. Sul terreno c'è poi solo una casa campione (il modello di Albatros). Quando bucalettere e rilevatore di fumo sono appesi (skill `betrieb`), viene l'**inaugurazione** con il nastro davanti alla porta: entra esattamente la casa approvata, qualcuno controlla dalla strada che tutto vada bene, e i primi ospiti lo vengono a sapere.

**Come usare l'immagine:** una frase sull'immagine nella tua prima risposta, e quale delle due parti tocca adesso.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco. Tu passi tutto alla persona in italiano e le parli sempre in italiano.
- Gli inizi di riga nei file di `docs/` (`Wohnort:`, `Grund:`, `Adresse:`, `Freigegeben:`, `Live seit:`, `Geprüft:`, `Angekündigt:`) restano in tedesco, come i segni `[Annahme: …]` e `[offen: …]`: `lage` e le verifiche li cercano così. Quello che segue i due punti lo scrivi in italiano.
- I prezzi li dai solo da `konto_status` (Albatros) o dalla pagina dei prezzi di un fornitore che hai appena letto, mai a memoria. Se non l'hai letta, dici «sta sulla pagina dei prezzi».
- Carte, password e chiavi private non vanno mai nella chat. Si paga sulla pagina di pagamento, i conti presso i fornitori li apre la persona stessa, nel browser.
- Niente pressioni: «da te» è una buona scelta, se va bene. Consigli il domicilio più piccolo che basta, con una frase di motivo dal piano.
- Online va solo il sito che la persona ha approvato (`Freigegeben:` in `docs/prd.md`), e solo nella seconda parte.
- Al massimo due domande per messaggio. Quello che la persona deve vedere (pagina di pagamento, porto, sito online) lo apri tu: `open <indirizzo>` (Linux `xdg-open`, Windows `start`).
- Nel modo `lernen` (riga `Modus:` in `docs/projekt.md`) la persona fa da sé la chiave SSH e il primo push; nel modo `machen` lo fai tu e lo spieghi in una frase.

## Parte 1: il domicilio (fase P11, `schritt: wohnort`)

### 1. Il sito è approvato?

```bash
# conta l'ultima riga «Freigegeben:» in docs/prd.md: davanti una data con l'anno, da nessuna parte una [Annahme] (la stessa regola di Albatros)
cp <cartella di questo skill>/../webseite-bauen/pruefen.mjs scripts/   # la versione più recente, quelle vecchie non conoscono --freigabe
# cartella sconosciuta: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/webseite-bauen/pruefen.mjs -o scripts/pruefen.mjs
node scripts/pruefen.mjs --freigabe
```

Il sito è approvato solo se il comando finisce con 0 e mostra «Seite freigegeben: …» (sito approvato); così giudica allo stesso modo su ogni computer, anche su Windows. Altrimenti finisce con 2 e dice perché: la riga manca, nell'ultima riga `Freigegeben:` davanti non c'è una data con l'anno (per esempio «non ancora» o «manca ancora 1 pagina»), o c'è una `[Annahme: …]`. Se mostra altro, per esempio un rapporto su tutto il sito, `scripts/pruefen.mjs` è una versione vecchia: prendila come sopra e controlla di nuovo. Se il sito non è approvato, lo dici onestamente: prima viene il sopralluogo con l'approvazione (skill `webseite-bauen`, passo 6). Se la persona vuole comunque già scegliere il domicilio, si può; il sito ci entra solo dopo l'approvazione. Ma `docs/lancieren.md` lo scrivi e `wohnort` lo segnali solo dopo l'approvazione: altrimenti il piano di volo conta il domicilio, e la domanda sull'approvazione salta.

### 2. La domanda, sempre la stessa

Prima di chiedere, raccogli le basi: `konto_status` (abbonamento e prezzi di Light e Pilot), in `docs/plan.md` la riga `Setup:` e in `docs/stack.md` la riga del blocco. Poi mostri i tre domicili in una piccola tabella, con i prezzi da `konto_status`:

| Domicilio | va bene se | costa | quello che fai tu |
|---|---|---|---|
| Albatros Light | il sito non ha bisogno di blocchi (testi, immagini, contatto per e-mail) | CHF … al mese | niente: quello che mandi nel porto è online poco dopo |
| Albatros Pilot | gira un blocco (iscrizione, prenotazione, accesso) o vuoi un server tuo | CHF … al mese | poco: nastro trasportatore e foto quotidiane del server ci sono già |
| da te | vuoi avere tutto in mano e hai tempo per la manutenzione | dal fornitore | conto, installazione, copia di sicurezza e sorveglianza |

Aggiungi una frase di consiglio con un motivo da `docs/plan.md` (`Setup:`).

**Con accesso:** se il progetto ha un blocco con accesso (ricetta `mitglieder`; lo si vede da `Zugang:` in `docs/plan.md` e da `Baustein:` in `docs/stack.md`), consigli Pilot o da te con un server tuo, mai Light, e nomini subito il passo **ingresso** (Eingang): se davanti al sito ci sarà un ingresso con un solo accesso per tutte le parti, lo chiarite nella gestione (skill `betrieb`, riga `Eingang:`, secondo i criteri dello skill `bausteine`, sezione «Un ingresso per tutto?»). Viene montato alla messa online (`bausteine/eingang`); dopo, il sito è raggiungibile solo dietro l'ingresso.

Poi la domanda, da sola nel messaggio:

> Dove deve abitare il tuo sito: da Albatros (Light senza blocchi, Pilot con il tuo server) o te ne occupi tu?

Fin qui da Albatros era tutto gratis. Se la persona chiede perché adesso costa qualcosa, dici: un posto in rete ha bisogno di un computer che giri giorno e notte.

### 3a. Da Albatros: Light o Pilot

1. **L'abbonamento solo dopo la scelta:** quando la persona ha scelto Light o Pilot, prendi il link con `upgrade_link`, con `stufe` (`light` o `pilot`) e `bestaetigt: true`. Prima non chiami mai lo strumento. Dalle il link e aprilo: la carta la digita solo lì. Se c'è già un abbonamento, arriva il link al portale clienti (per esempio per passare da Light a Pilot). Poi `konto_status`, finché l'abbonamento è attivo.
2. **Chiave di casa e serratura:** segui lo skill `ssh-schluessel`. Con Light la serratura apre il porto per il diario di bordo, con Pilot anche la porta del server. Momento di apprendimento: che cos'è una chiave SSH, con l'immagine di serratura e chiave. Nel modo `lernen` la persona crea da sé la chiave, poi segnali `verstanden_melden` (missione `flugschule-16-wohnort`, tipo `selbst`).
3. **Il nome dell'indirizzo:** diventa parte di `https://<name>.aufwind.sh` (da 3 a 32 caratteri: minuscole, cifre, trattino). Proponilo partendo dal nome del progetto (`docs/projekt.md`, in `docs/konzept.md` la riga `Name:`) e chiedi se va bene.
4. **Sito o server:** con Light `seite_erstellen`, con Pilot `server_erstellen`, ogni volta con `name`, la serratura (`schluessel`, solo il contenuto del file `.pub`) e `sprache` (la lingua della conversazione, qui `it`). Un server di solito ci mette uno o due minuti: chiedi con `konto_status` finché è pronto. Se il nome nella risposta è diverso, dillo subito.
5. **Guardare:** apri `https://<name>.aufwind.sh` con la persona. Lì adesso c'è il modello di Albatros, non il suo sito. Dillo chiaramente: il suo sito approvato ci entra solo alla messa online.

### 3b. Da te

La persona mette online il sito da sé. Albatros per lei resta gratis (isola, skill); solo gli strumenti per server, porto e dominio fanno parte di un abbonamento. Come si fa dipende dal blocco:

- **Senza blocchi (un sito statico):** ogni fornitore per siti statici consegna la cartella `seite/`. Tre strade diffuse, ognuna con un conto presso il fornitore, che la persona apre da sé:
  - **GitHub Pages:** il diario di bordo va su GitHub, un piccolo nastro trasportatore lì consegna `seite/`. È gratis con un repository pubblico: allora tutti vedono anche `docs/` con piano e concetto. Per un repository privato serve un conto a pagamento su GitHub (pagina dei prezzi). Senza dominio proprio il sito sta sotto `https://<utente>.github.io/<repo>/`, cioè in una sottocartella: allora in `web/astro.config.mjs` servono `site: 'https://<utente>.github.io'` e `base: '/<repo>'`, altrimenti i link portano nel vuoto. Senza sottocartella si può con il repository `<utente>.github.io` o con un dominio proprio.
  - **Cloudflare Pages** o **Netlify:** il diario di bordo può restare privato. O lo prendono da GitHub (cartella di uscita `seite`, nessun passo di costruzione, perché `seite/` è già costruita nel diario di bordo), o carichi `seite/` direttamente dal computer, senza alcun repository. L'indirizzo è allora `https://<name>.pages.dev` o `https://<name>.netlify.app`.
  - Condizioni e limiti delle offerte gratuite cambiano: leggi la pagina dei prezzi del fornitore con la persona, prima che decida.
- **Con un blocco:** un blocco ha bisogno di un server che giri giorno e notte. La persona affitta allora un server proprio e lo prepara con il modello di Albatros (`Dockerfile`, `compose.yaml` e `nginx.conf` dalla cartella `vorlage/` di albatros-skills, più Caddy per HTTPS). È il trasloco nella casa propria: skill `landung`.

Aiuta nella scelta con tre domande: il diario di bordo può essere pubblico? Il sito ha bisogno di un blocco? Chi si occupa di copia di sicurezza e sorveglianza (skill `betrieb`)? Tutta la strada senza Albatros la descrive lo skill `landung`, parte «Direkt vom Computer ins Netz» (direttamente dal computer in rete). In questa parte la persona apre solo il conto e fa l'accesso; si carica solo alla messa online.

### 4. `docs/lancieren.md`

Solo quando il sito è approvato (passo 1):

```markdown
# Lanciare

Wohnort: Albatros Light (oppure Albatros Pilot, oppure da te: Netlify)
Grund: … (una frase, da docs/plan.md, riga Setup:, e dal desiderio della persona)
Adresse: https://<name>.aufwind.sh
Hafen: git@aufwind.sh:<name>/projekt.git (da te: il repository su GitHub, oppure «nessun repository, caricato dal computer»)
Gewählt: <data>
```

Se da te l'indirizzo si sa solo dopo il primo caricamento, c'è `[offen: kommt beim Live schalten]` (aperto: arriva alla messa online). Poi la voce nel diario di bordo (`git add docs/lancieren.md && git commit -m "Domicilio: <domicilio>"`) e `schritt_melden` con `wohnort` e `sprache`. Se lo strumento manca o non conosce il passo, si va avanti senza isola. Nel modo `lernen` fai adesso le domande di controllo della lezione `flugschule-16-wohnort`, al massimo due per messaggio (contando anche le altre domande): prima «Che cosa distingue Light, Pilot e «da te»?» e «Che cos'è una chiave SSH, in una frase?», dopo la risposta della persona «Dopo questo passo il tuo sito è già online?» Stanno qui perché `lage` e `mission_holen` non le mostrano più dopo `wohnort`. Segnali `verstanden_melden` (tipo `kontrollfrage`) solo dopo le sue risposte.

Si va avanti con lo skill `betrieb`: bucalettere, rilevatore di fumo e porta di casa, prima che arrivino gli ospiti.

## Parte 2: la messa online (Live schalten) (fase P13, `schritt: hafen`, `fliessband`, `live`, `domain`)

Solo quando `docs/betrieb.md` ha tutte le righe (skill `betrieb`). Se manca, vai prima lì.

### 1. Solo il sito approvato

```bash
# l'approvazione del sopralluogo, come nella parte 1, passo 1
cp <cartella di questo skill>/../webseite-bauen/pruefen.mjs scripts/   # la versione più recente, quelle vecchie non conoscono --freigabe
node scripts/pruefen.mjs --freigabe
git status --short seite web design                       # vuoto: niente di non salvato sul sito
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
```

- **Nessun «Seite freigegeben: …»** (`pruefen.mjs --freigabe` finisce con 2): niente va online. Ritorno allo skill `webseite-bauen`, passo 6.
- **Cambiato dopo l'approvazione** (nessun output «Seite wie freigegeben», sito come approvato): la persona guarda il sito cambiato in locale e lo approva di nuovo (nuova riga `Freigegeben:`, `git tag -f freigegeben`). Solo dopo si va avanti.
- **Nessun tag `freigegeben`** (progetti più vecchi): mostra il sito in locale alla persona e chiedi: «È esattamente il sito che hai approvato?» Dopo il sì metti il tag (`git tag freigegeben`).

### 2. Nel porto o dal fornitore (`schritt: hafen`)

#### Da Albatros

Nel porto c'è dal domicilio il modello, una voce. Il diario di bordo sul computer ha un suo inizio. Colleghi i due, senza clonare di nuovo e senza copiare file (skill `git-logbuch`, parte «Logbuch ohne Hafen»):

```bash
git remote -v                                                    # c'è già un origin? allora il nome hafen invece di origin
git remote add origin git@aufwind.sh:<name>/projekt.git          # indirizzo da docs/lancieren.md o da konto_status
git fetch origin
git merge origin/main --allow-unrelated-histories -X ours -m "Modello dal porto ripreso, il sito approvato resta"
git diff --quiet freigegeben HEAD -- seite && echo "Seite unverändert"
```

Dillo alla persona con l'immagine: il modello viene ripreso una volta nel diario di bordo. Dove entrambi hanno lo stesso file (`seite/index.html`, `.gitignore`), resta il suo. Si aggiungono i file che servono al nastro trasportatore di Pilot (`Dockerfile`, `compose.yaml`, `nginx.conf`, `.github/workflows/deploy.yml`); con Light dormono. Se dopo l'unione non c'è «Seite unverändert» (sito invariato), non fai il push e guardi con `git diff freigegeben HEAD -- seite`.

**Con un blocco (Pilot), prima del push:** adesso nel diario di bordo c'è il `compose.yaml` del modello, e agganci i blocchi come nello skill `bausteine`, sezione 4 «Al lancio, con Pilot»: prima una foto del server (strumento `snapshot`, nome `vor-baustein`), poi `include:` in `compose.yaml`. Se in `docs/betrieb.md` c'è `Eingang: ja` (`grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` mostra la riga), si aggiunge il passo **ingresso**: la riga `- bausteine/eingang/compose.yaml` sotto `include:`, e nel servizio `webseite` spariscono le righe `ports:` e `- "80:80"`. La porta 80 è allora dell'ingresso, il sito è raggiungibile solo dietro di lui. Prima `bun bausteine/eingang/test.ts` deve segnalare «Alles grün». Senza accesso, o con `Eingang: nicht nötig`, `compose.yaml` resta come nel modello. Poi una voce nel diario di bordo.

```bash
git push -u origin main
```

Poi apri il porto nel browser (`open https://code.aufwind.sh/<name>/projekt`) e segnali `hafen`.

#### Da te, con GitHub (Selbst, mit GitHub)

La persona fa l'accesso con `gh auth login` nel browser. Per GitHub Pages prima crei il nastro trasportatore, `.github/workflows/seite.yml`:

```yaml
name: Seite
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false            # non interrompere mai una consegna in corso
jobs:
  ausliefern:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.pages.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: seite                  # la cartella costruita, così come è stata approvata
      - id: pages
        uses: actions/deploy-pages@v4
```

Poi portare il diario di bordo: `gh repo create <repo> --private --source . --remote origin --push` (per GitHub Pages senza conto a pagamento `--public`, dopo che la persona sa che allora anche `docs/` è pubblico). Per GitHub Pages la persona imposta sotto Settings, Pages la fonte su «GitHub Actions». Poi segnali `hafen`.

#### Da te, senza repository (Selbst, ohne Repo)

Carichi `seite/` direttamente, dopo che la persona ha fatto l'accesso nel browser: `npx netlify-cli deploy --dir=seite --prod` o `npx wrangler pages deploy seite --project-name=<name>`. Il diario di bordo resta sul computer; la sua copia di sicurezza sta in `docs/betrieb.md`. Un porto allora non c'è, `hafen` non lo segnali.

### 3. Nastro trasportatore (`schritt: fliessband`)

- **Light:** non c'è: circa un minuto dopo il push Albatros mostra la cartella `seite/`.
- **Pilot:** il push avvia il nastro trasportatore di `.github/workflows/deploy.yml`. Apri `https://code.aufwind.sh/<name>/projekt/actions` e guarda con la persona. Verde: segnalare `fliessband`. Rosso: skill `pipeline`, parte «Wenn das Band rot ist» (quando il nastro è rosso).
- **Da te:** su GitHub Pages sotto «Actions», su Netlify e Cloudflare nella loro lista delle consegne. Verde: segnalare `fliessband`. Con il caricamento senza repository non c'è un nastro trasportatore.

### 4. Controllare dall'esterno (`schritt: live`)

**Guardi tu, la persona non aspetta mai.** L'indirizzo risponde già prima (con il modello). Perciò aspetti il titolo del sito, così come sta in `seite/index.html` tra `<title>` e `</title>`, al massimo tre minuti:

```bash
for i in $(seq 12); do curl -s <indirizzo> | grep -qF "<titolo del tuo sito>" && echo "Il sito c'è" && break; sleep 15; done
node scripts/pruefen.mjs --live <indirizzo>
node scripts/pruefen.mjs --tueren <indirizzo>
```

L'indirizzo sta in `docs/lancieren.md` (`Adresse:`). È online solo ciò che è stato controllato dall'esterno: se con `--live` (titolo come costruito, impressum e protezione dei dati raggiungibili, accessibilità, Lighthouse) e con `--tueren` niente è rosso, segnali `live`, apri l'indirizzo con la persona e confronti con le foto del controllo.

- **Con l'ingresso:** in `docs/tueren.txt` ci sono i percorsi protetti con 401 (senza accesso, per esempio `/intern/ 401`), in più `/_/ 404` e `/api/collections/_SUPERUSERS/auth-methods 404`: l'accesso dell'amministrazione resta chiuso dall'esterno. Le liste di PocketBase con una regola (per esempio `/api/collections/users/records`) rispondono agli ospiti con 200 e una lista vuota, non con 401 o 403; tutte le porte per ricetta stanno nello skill `bausteine`, parte «Türen der Bausteine». Se il file è ancora quello della costruzione senza ingresso, lo adatti prima della verifica. Solo quando `--tueren` mostra esattamente questo e la pagina iniziale dà 200, il sito sta davvero dietro l'ingresso.
- **Con un blocco «online» non vuol dire ancora «finito»:** solo quando i dati ci sono (per esempio i corsi) e una prenotazione di prova in rete ha portato la sua e-mail al proprio indirizzo (skill `bausteine`), dici alla persona che può condividere il link. Fino ad allora dici onestamente che cosa manca ancora.

#### Dopo tre minuti non c'è ancora (Nach drei Minuten noch nicht da)

Con Light `konto_status` mostra se l'ultimo stato è online o che cosa manca. Spesso nel porto manca `seite/index.html`, perché `seite/` sta in un `.gitignore`. Con Pilot guardi sotto «Actions» (skill `pipeline`), da te nella lista delle consegne del fornitore. Correggere, nuova voce, push, ricontrollare. Se la correzione cambia il sito stesso, prima lo mostri alla persona e ottieni di nuovo l'approvazione. Se ancora non va, dici che cosa hai controllato e chiedi al coach (`coach_fragen`).

### 5. Un indirizzo tuo, facoltativo (`schritt: domain`)

Chiedi: «Un indirizzo tuo (dominio) adesso, più tardi o mai?» Aggiungi: costa ogni anno ed è facoltativo. La sua risposta va subito in `docs/live.md` (modello al passo 8), nella riga `Eigene Domain:`: prima `jetzt`, `später` o `nie` in tedesco, poi, se vuole, una frase in italiano, per esempio `Eigene Domain: später, quando il comitato avrà deciso il nome`. Adesso: da Albatros segui lo skill `domain`, da te lo colleghi presso il fornitore (skill `landung`, parte «Direkt vom Computer ins Netz»). Quando `https://<dominio>` mostra il sito con il lucchetto, segnali `domain` e ricontrolli con `pruefen.mjs --live https://<dominio>`.

**Con accesso** (un blocco con accesso, per esempio un'area membri): dopo il dominio la persona fa una volta l'accesso tramite `https://<dominio>`, sulla pagina di accesso. Con l'ingresso non serve nessuna voce in `eingang.json`: accetta accessi e moduli dall'indirizzo tramite cui il sito viene aperto. Se funziona, il sito accetta accessi e moduli anche tramite il nuovo indirizzo. Se la pagina dice che e-mail o password sono sbagliate anche se tutti e due sono giusti, o se un modulo tramite il dominio non va: da Albatros chiedi al coach (`coach_fragen`) e dici che cosa hai controllato; fino ad allora la persona fa l'accesso tramite `https://<name>.aufwind.sh`. Da te non c'è nessun indirizzo su aufwind.sh, e senza abbonamento non c'è il coach: allora la persona scrive un'e-mail a hallo@albatros.build, con quello che hai controllato (cosa va nell'e-mail e cosa mai, lo trovi nello skill `lotse`, sezione «Segnalare le lacune»); fino ad allora fa l'accesso tramite l'indirizzo che valeva prima del dominio.

**Se il sito ne sostituisce uno esistente** (`docs/bestand.md`, skill `webseite-modernisieren`): il vecchio dominio punta poi sul nuovo sito. Ogni vecchio indirizzo di `docs/bestand.md` che non esiste più riceve un reindirizzamento al punto nuovo giusto (in Astro sotto `redirects` in `web/astro.config.mjs`). Le voci per l'e-mail (MX) non le tocchi mai.

### 6. Percorso attività: il controllo prima del volo

Sul percorso attività prendi con `methode` il metodo `go-live-check` e lo segui: legge l'indirizzo da `docs/lancieren.md` e scrive il suo risultato in `docs/live.md` sotto `Geprüft:`. Il metodo c'è con Light e Pilot. Se il sito abita «da te», senza abbonamento `methode` non lo dà, e la verifica tramite il server di Albatros non è possibile: dillo onestamente e passa con la persona il controllo del passo 4, più modulo, e-mail e cassa provati di persona.

### 7. A chi lo dici per primo?

Chiedi: «A chi lo dici per primo?» Il primo fan non arriva da solo. Aiuta con un breve testo che la persona manda da sé (per esempio a tre persone che ci tengono). Tu non mandi niente.

### 8. `docs/live.md`

```markdown
# Online

Live seit: <data>
Adresse: https://… (l'indirizzo in rete; con un dominio proprio, questo, appena è attivo)
Eigene Domain: <jetzt | später | nie>, <una frase, se la persona la dice>
Geprüft: <data>, pruefen.mjs --live senza rosso, porte come previsto (docs/pruefung/messwerte-live.json)
Angekündigt: <data>, <a chi>
```

Dopo `Eigene Domain:` viene prima `jetzt`, `später` o `nie`, in tedesco, come la persona ha risposto al passo 5; `Adresse:` è sempre l'indirizzo in rete. Poi la voce nel diario di bordo, il push come sopra, e la missione. Nel modo `lernen` fai adesso le domande di controllo della lezione `flugschule-18-live-schalten`, al massimo due per messaggio (contando anche le altre domande): prima «Quale sito va online alla messa online?» e «Quando il tuo sito è davvero online?», dopo la risposta della persona «Perché lo dici prima a qualcuno?» Stanno qui perché `lage` e `mission_holen` non le mostrano più dopo `live`. Segnali `verstanden_melden` (tipo `kontrollfrage`) solo dopo le sue risposte.

Se dopo la persona vuole qualcosa di diverso, vale lo skill `webseite-aendern`: piccolo (cambiare in locale, mostrare, approvazione, push) o grande (aggiunta al piano, bozza, via libera per costruire, costruire, mostrare, approvazione, push).

Online va solo ciò che appartiene alla persona o per cui ha il permesso (skill `webseite-modernisieren`, parte «Rechte»).

## Trappole

- `upgrade_link` prima della scelta della persona, o prezzi a memoria.
- Al momento del domicilio fare già il push del proprio sito: con Light ogni push è subito online, e il sito sta allora in rete prima di bucalettere e rilevatore di fumo.
- Segnalare `wohnort` o scrivere `docs/lancieren.md` prima che il sito sia approvato: allora il piano di volo salta l'approvazione.
- Clonare il diario di bordo dal porto e copiarci dentro il sito: le voci della costruzione vanno allora perse. Collegare invece di copiare.
- `git push --force` per sovrascrivere il porto: mai. Unire come sopra.
- Fare il push anche se il sito è cambiato dopo l'approvazione.
- Dire «è online» senza aver controllato tu dall'esterno.
- Con l'ingresso, lasciare `ports:` nel servizio `webseite`: così si potrebbe aggirare l'ingresso.
- Un repository pubblico per GitHub Pages, senza dire alla persona che allora anche `docs/` è pubblico.

## Verificare la missione

- Dopo la parte 1: `mission_pruefen` con `flugschule-16-wohnort` (isola su «Wohnort»). Da Albatros anche `flugschule-01-start`: la verifica guarda se `https://<name>.aufwind.sh` risponde.
- Dopo la parte 2: `mission_pruefen` con `flugschule-18-live-schalten` (isola su «Live»), da Albatros anche `flugschule-04-git-logbuch`, con Pilot `flugschule-05-pipeline`.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «il domicilio e l'inaugurazione», che ridice il nocciolo. Poi: che cosa è riuscito (domicilio scelto o sito online), dove sta il risultato (`docs/lancieren.md`, `docs/live.md`, l'indirizzo), che cosa è ancora aperto e che cosa viene dopo (dopo il domicilio lo skill `betrieb`, dopo la messa online i primi ospiti).
