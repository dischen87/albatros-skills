---
name: bausteine
description: "Scopre con una persona senza conoscenze tecniche cosa deve saper fare il suo sito e monta i blocchi pronti adatti, prima sul suo computer: lista di iscrizione, prenotazioni per corsi e appuntamenti, area membri con accesso e abilitazione, bacheca (PocketBase), un ingresso con un solo accesso per più parti o un CMS grande (Strapi con Postgres), con la memoria di lavoro misurata. Spiega con l'immagine degli elementi prefabbricati nella costruzione di una casa. Usa lo skill con «iscrizione», «lista di iscrizione», «prenotazione», «prenotare un corso», «prenotare un appuntamento», «riservare un posto», «salvare un modulo», «login», «accesso», «area membri», «area admin», «gestire gli utenti», «ruoli», «ingresso», «banca dati», «Strapi», «CMS», «PocketBase», «blocco», «cosa ci sta sul mio server», «basta il mio server», e quando un sito deve saper fare più che mostrare testi e immagini."
metadata:
  stand: 0.2.0
  quelle: '5cece7070637'
---

# Blocchi: elementi prefabbricati per il tuo sito

## L'immagine

Chi costruisce una casa non si fa da solo finestre, porte e cucina. Arrivano pronte dalla fabbrica, con le istruzioni, e vengono montate. Con un sito web è lo stesso: nessuno riscrive da zero un accesso, una lista di iscrizione o un sistema per i contenuti. Albatros li tiene pronti come blocchi. È collaudato ciò che ha un test (prenotazioni, membri, ingresso); la memoria di lavoro l'abbiamo misurata per tutti.

E come per la casa: ogni elemento ha bisogno di spazio. Per questo prima guardi cosa serve davvero alla persona. Si monta prima sul computer della persona, come un montaggio di prova in officina; sul server va solo al lancio.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi.

## Come parli

- **Non limitarti a chiedere:** Se manca un dato, dai comunque i passi concreti con le ipotesi segnate `[Annahme: …]`. I segni `[Annahme: …]` e `[offen: …]` restano in tedesco, come i nomi delle righe in `docs/`: è da loro che `lage` riconosce ciò che è supposto o ancora aperto. Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, frasi brevi. Invece di «autenticazione» dici «accedere con e-mail e password», invece di «pannello admin» dici «amministrazione».
- Non chiedere mai password o chiavi. Il primo account dell'amministrazione lo crea la persona stessa nel browser. Le chiavi API (per esempio per le e-mail) le digita solo lì.

## 1. Cosa vuoi costruire?

Una domanda per messaggio, solo quante ne servono perché la risposta sia chiara:

1. Cosa deve fare il sito? In una frase.
2. In quali lingue?
3. Chi cambia i contenuti: solo tu con la tua IA, o anche altri senza terminale?
4. I visitatori devono inserire qualcosa, iscriversi o accedere? Vuoi vedere una lista delle iscrizioni?
5. C'è dietro qualcos'altro, per esempio pagamenti, prenotazioni o una newsletter?

## 2. Cosa ne segue

| La persona dice … | Cosa fa al caso | Abbonamento | Memoria di lavoro in funzione |
|---|---|---|---|
| Solo io curo il sito, niente accesso, anche in più lingue | Sito normale dal modello, senza blocco. Una cartella per lingua (`seite/fr/`). Liste come appuntamenti o prodotti come file nel progetto (`seite/daten/termine.json`), il sito le legge: una banca dati leggera nel codice. | Light | niente in più |
| Pagamenti, donazioni | Link di pagamento di un fornitore come Stripe (Payment Link), sul sito come pulsante | Light | niente in più |
| Newsletter | Un servizio come Brevo, modulo del servizio sul sito | Light | niente in più |
| Le persone si iscrivono, voglio vedere la lista | **Lista di iscrizione** (PocketBase, ricetta `anmeldeliste`) | Pilot | circa 20 MB |
| I visitatori prenotano un posto o un appuntamento (corso, visita guidata, appuntamento dal parrucchiere), voglio vedere le prenotazioni e poterle annullare | **Prenotazioni** (PocketBase, ricetta `buchungen`) | Pilot | circa 20 MB |
| I membri accedono e vedono un'area tutta loro; chi è nuovo fa una richiesta, e io lo abilito | **Area membri con accesso** (PocketBase, ricetta `mitglieder`) | Pilot | circa 20 MB |
| Altri curano news o appuntamenti nel browser | **Bacheca** (PocketBase, ricetta `pinnwand`) | Pilot | circa 20 MB |
| Più parti hanno bisogno dello stesso accesso, o un'area è solo per un ruolo (per esempio il comitato) | **Ingresso** (blocco `eingang`, con la ricetta `mitglieder`), sezione 7 | Pilot | 20 MB, a pieno carico fino a 129 MB (limite del container 128 MB) |
| Molti tipi di contenuto, più ruoli, gestione delle immagini, più tardi un'app | **CMS grande** (Strapi con Postgres) | Pilot | circa 200 MB, costruzione fino a 2,5 GB |

Consiglia sempre il più piccolo che basta. Più lingue da sole non sono mai un motivo per un blocco. PocketBase copre insieme lista di iscrizione, accesso e bacheca, e gira una volta sola. Strapi conviene solo quando PocketBase diventa troppo piccolo.

Sul proprio computer ogni blocco funziona gratis, anche senza abbonamento. Online gli serve un server proprio, quindi Pilot. Se la persona ha Light, diglielo onestamente appena vuole un blocco: il domicilio del sito lo sceglie al lancio (skill `lancieren`, prezzi con `konto_status`, skill `kosten`). Diario di bordo e indirizzo restano.

## 3. Cosa ci sta sul server?

Un server con Pilot ha 4 GB di memoria di lavoro (RAM) e 40 GB di spazio, senza memoria di scambio (swap): se diventa troppo, il server chiude un programma. Misurato il 28.10.2026 sul server (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17), l'ingresso il 31.10.2026 su un Mac:

| Cosa | In funzione | Durante la costruzione | Spazio |
|---|---|---|---|
| Carico di base: sistema, Docker, operaio del nastro trasportatore | 150 MB, previsti 0,5 GB | per poco di più | – |
| Sito dal modello | 10 MB | breve | poco |
| PocketBase (tutte le ricette insieme) | 20 MB | breve | 40 MB |
| Ingresso | 20 MB, a pieno carico fino a 129 MB, nel container limitato a 128 MB | breve | poco |
| Strapi con Postgres | 150 MB + 55 MB | picco 2,5 GB, prima costruzione circa 7 minuti | 1,4 GB |

Per i blocchi restano quindi circa 3,5 GB. Sito, PocketBase e Strapi insieme, in funzione, usano circa 250 MB. Si fa stretto solo durante la costruzione, per questo il nastro trasportatore costruisce un lavoro dopo l'altro. Sul server non vanno programmi che da soli usano più di 1 GB, per esempio Keycloak, Supabase, Logto, Mattermost o il riconoscimento del testo (OCR). Per un accesso proprio prendi PocketBase.

Prima del lancio: `free -h` sul server mostra quanto è libero. Dopo: `docker stats --no-stream` mostra quanto usa ogni blocco.

## 4. Montare: prima in locale, il server al lancio

### In locale, sul computer della persona

Durante la costruzione (skill `webseite-bauen`), gratis:

1. **Prendere.** Nel diario di bordo sul computer della persona (skill `git-logbuch`) scarichi il blocco dalla fabbrica, il repository pubblico di Albatros:
   ```bash
   curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
   ```
   Per l'ingresso alla fine c'è `bausteine/eingang`, per Strapi `bausteine/strapi`. Le ricette poi si trovano in `bausteine/<baustein>/rezepte/`.
2. **Inserire la ricetta** (sezione 5, 6 o 7) e portare i testi delle pagine nella lingua della persona.
3. **Test:** se la ricetta ha un test, deve segnalare «Alles grün»: `bun bausteine/pocketbase/rezepte/buchungen/test.ts`, `bun bausteine/pocketbase/rezepte/mitglieder/test.ts`, `bun bausteine/eingang/test.ts`. A ricetta montata controlla i file montati. Senza test verde non si va avanti.
4. **La persona clicca da sola.** Costruire in `web/` (`npm run build`), poi `bun bausteine/pocketbase/lokal.ts` (con l'ingresso: `--eingang`). Tutto il sito gira con il blocco sul computer della persona, le e-mail compaiono nel terminale invece che da persone vere. Dalle l'indirizzo e dille cosa provare (accedere, prenotare, annullare). Lei clicca, tu guardi e ripari. Per l'amministrazione `lokal.ts` mostra un account valido solo su questo computer.
5. **Nel diario di bordo**, non ancora al porto.

Strapi non ha ancora un test né `lokal.ts`; i suoi tipi di contenuto li scrivi come file (sezione 6), e lo si vede girare solo sul server. Dillo onestamente.

### Al lancio, con Pilot (Beim Lancieren, mit Pilot)

Nello skill `lancieren`, parte 2, dopo l'approvazione del sito e prima del push nel porto:

1. **Foto del server:** strumento `snapshot` con il nome `vor-baustein` (skill `zurueck-auf-gestern`).
2. **Agganciare.** In `compose.yaml`, proprio in cima:
   ```yaml
   include:
     - bausteine/pocketbase/compose.yaml
   ```
   Il sito inoltra da solo le richieste: il modello legge ogni `bausteine/*/nginx.conf`. Se il progetto è più vecchio dei blocchi (nessun `nginx.conf` nel progetto), prendi `Dockerfile` e `nginx.conf` da `vorlage/` nello stesso repository.
   **Con accesso, il passo ingresso:** se in `docs/betrieb.md` c'è `Eingang: ja` (sezione 7; `grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` mostra la riga, «Eingang: jamais» non conta), sotto `include:` si aggiunge `- bausteine/eingang/compose.yaml`, e nel servizio `webseite` spariscono `ports:` e `- "80:80"`: allora il sito è raggiungibile solo dietro l'ingresso. Senza accesso, o se bastano le regole di PocketBase, `compose.yaml` resta come nel modello. Lo skill `lancieren` nomina questo passo già al domicilio.
3. **Al porto.** Il nastro trasportatore costruisce e consegna (skill `pipeline`). Se la costruzione non riesce, il vecchio sito resta online.
4. **Verificare** sul server: `docker ps` mostra il blocco come `healthy`. Poi verifichi ogni porta dall'esterno: `node scripts/pruefen.mjs --tueren <indirizzo>` con le porte qui sotto, con l'ingresso anche i percorsi protetti 401, `/_/` 404, `/api/collections/_SUPERUSERS/auth-methods` 404 e la pagina iniziale 200. Poi il primo account dell'amministrazione e le e-mail (sezione 5).

### Porte dei blocchi (Türen der Bausteine)

Quello che un blocco risponde senza accesso va in `docs/tueren.txt` (skill `webseite-bauen`), solo le righe delle ricette montate. `node scripts/pruefen.mjs --tueren` le verifica in locale contro `http://localhost:8090` (con l'ingresso `http://localhost:8080`), finché gira `lokal.ts`, e dopo il lancio contro l'indirizzo. Le liste di PocketBase con una regola (per esempio «solo il proprio account») danno agli ospiti 200 con una lista vuota, non 401 né 403; solo le liste riservate all'amministrazione danno 403. È giusto così; le regole restano come sono.

```
/api/collections/anmeldungen/records      403   # anmeldeliste: iscriversi possono tutti, leggere solo l'amministrazione
/api/collections/termine_frei/records     200   # buchungen: le date libere le vede chiunque
/api/collections/buchungen/records        403   # buchungen: le prenotazioni le vede solo l'amministrazione
/api/collections/wochenplan/records       403   # buchungen
/api/collections/users/records            200   # mitglieder: gli ospiti ricevono una lista vuota
/api/collections/mitteilungen/records     200   # mitglieder: gli ospiti ricevono una lista vuota
/api/collections/beitraege/records        200   # pinnwand: per tutti
/intern/                                  401   # con l'ingresso: ogni percorso protetto di eingang.json
/_/                                       404   # con l'ingresso
/api/collections/_SUPERUSERS/auth-methods 404   # con l'ingresso
```

Misurato il 31.10.2026 con PocketBase 0.40.5 e `pruefen.mjs --tueren`, direttamente presso PocketBase e attraverso l'ingresso. Senza l'ingresso `/_/` è chiuso solo sul server (404); in locale `lokal.ts` lì mostra l'amministrazione, quindi questa porta si verifica solo dopo il lancio. Con `buchungen`, «Le mie prenotazioni» (`/verwaltung/`) risponde 200: la pagina è aperta, ma le prenotazioni le vede solo chi accede con l'account dell'amministrazione. Una riga `/verwaltung 404` allora non va bene.

## 5. PocketBase: lista di iscrizione, prenotazioni, membri, bacheca

PocketBase è un unico piccolo programma con banca dati, accesso e amministrazione. Il sito gli parla sotto `/api/` del proprio indirizzo. L'amministrazione resta fuori dal sito pubblico.

- **Inserire l'indirizzo:** In `bausteine/pocketbase/pb_migrations/1_einstellungen.js` imposta la riga `ADRESSE` sull'indirizzo del sito (`https://{name}.aufwind.sh` o il dominio proprio). Compare nelle e-mail come «Password dimenticata».
- **Inserire la ricetta:** Da `bausteine/pocketbase/rezepte/<rezept>/`, tutti i file di `pb_migrations/` vanno in `bausteine/pocketbase/pb_migrations/`, `pb_hooks/*` (se c'è) in `bausteine/pocketbase/pb_hooks/` e `seite/*.html` va in `seite/`. La cartella della ricetta la lasci dov'è, lì c'è il test.
  - `anmeldeliste`: modulo `anmelden.html`. Tutti possono iscriversi, leggere può solo l'amministrazione.
  - `buchungen`: `buchen.html` (date libere, prenotare, annullare tramite il link nell'e-mail) e `verwaltung.html` («Le mie prenotazioni» per la persona: chi viene, annullare, programma settimanale). Altro più sotto in «Prenotazioni».
  - `mitglieder`: chi si registra fa una richiesta. La persona conferma il suo indirizzo e-mail con il link nell'e-mail, l'amministrazione riceve un avviso e la abilita (nell'amministrazione sotto `users`, il campo `freigegeben`), poi la persona riceve un'e-mail. Solo con l'indirizzo confermato e l'accesso abilitato vede le comunicazioni. Abilitazione e ruolo (`rolle`, per esempio `vorstand`) li imposta solo l'amministrazione, mai la persona stessa. Pagine: `mitglieder.html` (richiesta, accedere, stato della richiesta, rimandare l'e-mail, «Password dimenticata?»), `bestaetigen.html` e `passwort.html`; a queste due portano i link nelle e-mail. Se le pagine stanno altrove (per esempio `/passwort/` in un sito Astro), inserisci il percorso in `pb_migrations/2_mitteilungen_freigabe.js` (`SEITE_BESTAETIGEN`, `SEITE_PASSWORT`), l'area membri e chi riceve gli avvisi in `pb_hooks/mitglieder.js` (`MITGLIEDERSEITE`, `MELDUNGEN_AN`). Ruoli propri li aggiungi in `ROLLEN` prima che il sito giri. Se la vecchia ricetta era già montata, i nuovi file si aggiungono e basta; chi era già membro deve poi essere abilitato una volta e confermare l'indirizzo («Rimandare l'e-mail» su `mitglieder.html`).
  - `pinnwand`: `pinnwand.html` mostra gli articoli con data e immagine. Si scrive nell'amministrazione.
  - Campi o raccolte propri li scrivi come ulteriore file `pb_migrations/3_*.js` secondo lo stesso schema.
- **Primo account dell'amministrazione** (al lancio): Dopo il primo avvio PocketBase scrive un link di configurazione nel registro. Prendilo e apri il passaggio segreto (tunnel), così l'amministrazione resta invisibile da internet:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && docker compose logs pocketbase' | grep pbinstall
  ssh -N -L 8090:localhost:8090 {name}@aufwind.sh
  ```
  Il secondo comando lo lasci girare in background. Dai alla persona il link con `http://localhost:8090` invece di `http://0.0.0.0:8090`. Lì stabilisce e-mail e password, solo nel browser. Se il link è scaduto: `docker compose restart pocketbase` sul server, poi ce n'è uno nuovo. Più tardi si entra da `http://localhost:8090/_/`, finché il tunnel è aperto.
- **Aprire l'amministrazione:** Se altri hanno bisogno dell'amministrazione senza terminale, o se la persona vuole vedere la lista sul cellulare: in `bausteine/pocketbase/nginx.conf` togli i `#` davanti alla sezione «Verwaltung freigeben» (aprire l'amministrazione), nel diario di bordo, al porto. Allora è su `https://{name}.aufwind.sh/_/`, protetta con la password dell'amministrazione. Aprila solo quando il primo account c'è. Appena partono le e-mail, la persona attiva nell'amministrazione sotto `_superusers` → Options l'accesso a due fattori (MFA). Con l'ingresso (sezione 7) l'amministrazione resta sempre chiusa dall'esterno.
- **E-mail** (confermare l'indirizzo, password dimenticata): Il server non può inviare attraverso le solite porte per le e-mail. Nell'amministrazione sotto Settings → Mail settings: server SMTP `smtp.resend.com`, porta `2587`, utente `resend`, come password la chiave API di Resend. Quella la digita lì la persona stessa. Va anche Brevo, con `smtp-relay.brevo.com` e la porta `2525`. Il mittente è un indirizzo del dominio proprio, confermato presso il servizio e-mail.
- **Accedere con Google, Apple o GitHub:** si fa nell'amministrazione sotto `users` → Options → OAuth2. Serve un account presso il rispettivo fornitore. Fallo solo quando e-mail e password funzionano.

### Prenotazioni

La ricetta `buchungen` è un piccolo strumento di prenotazione per corsi, visite guidate e appuntamenti, senza account cliente e senza pagamento online. È collaudata: due persone non ricevono mai lo stesso ultimo posto, le date passate non si possono prenotare, un corso resta alle 18:30 anche dopo il cambio dell'ora, le e-mail indicano l'ora svizzera.

**Alla persona lo dici così:** «I visitatori scelgono una data sul tuo sito e ricevono una conferma per e-mail. Inserisci i tuoi corsi una volta sola come programma settimanale, per esempio ogni lunedì alle 18:30 con 12 posti, e sulla pagina “Le mie prenotazioni” vedi chi viene.»

La parte tecnica la fai tu, la persona decide soltanto. In quest'ordine:

1. **Chiedere i corsi prima di costruire:** nome, giorno della settimana, ora, durata, posti, luogo, prezzo e fino a quanto prima dell'inizio si può prenotare. Se nel piano c'è solo «ce l'abbiamo», chiedili adesso. Scrivili in `docs/kurse.md` e come `bausteine/pocketbase/pb_migrations/3_kurse.js` (schema qui sotto): così le date ci sono dal primo avvio, nessuno le ricopia.
2. **Montare:** `2_buchungen.js` in `bausteine/pocketbase/pb_migrations/`, entrambi i file di `pb_hooks/` in `bausteine/pocketbase/pb_hooks/`. La cartella `rezepte/buchungen` la lasci dov'è, lì c'è il test.
3. **Farne due pagine vere,** con testata, menu e piè di pagina come tutte le altre, mai i file HTML nudi:
   - Da `seite/buchen.html` nasce la pagina per prenotare, per esempio `web/src/pages/kurse.astro` nel layout del sito: riprendere il contenuto di `<main>`, lo script come `<script is:inline>`, degli stili solo le parti senza `body`, `main` e `h1`. In alto c'è il programma settimanale a parole («Lunedì 18:30 Yoga serale»), da `docs/kurse.md`.
   - Da `seite/verwaltung.html` nasce «Le mie prenotazioni», per esempio `web/src/pages/verwaltung.astro`, con `<meta name="robots" content="noindex">` e non nel menu.
   - I colori in cima a entrambi i file li imposti sui token del sito (`var(--…)` da `tokens.css`), niente valori di colore copiati.
   - Il percorso della pagina per prenotare lo inserisci in `pb_hooks/buchungen.js` alla voce `BUCHUNGSSEITE` (per esempio `"/kurse/"`), altrimenti i link nelle e-mail non portano da nessuna parte.
4. **Controllare, con una prova:** `bun bausteine/pocketbase/rezepte/buchungen/test.ts` deve segnalare «Alles grün». Poi costruire in `web/` (`npm run build`) e avviare `bun bausteine/pocketbase/lokal.ts`: tutto il sito gira con lo strumento di prenotazione sul computer della persona, le e-mail compaiono nel terminale invece che da persone vere. La persona prenota da sola un posto, lo annulla e accede a «Le mie prenotazioni» con l'account che mostra `lokal.ts`. Mostrale il testo dell'e-mail. Senza questi risultati il controllo non è verde.
5. **Al lancio:** foto del server (strumento `snapshot`, nome `vor-baustein`), agganciare, al porto (sezione 4).
6. **Le e-mail, prima che la persona condivida il link:** dopo la messa online imposta le e-mail (punto «E-mail» qui sopra) e prenota in rete un posto all'indirizzo della persona. Lo strumento di prenotazione è finito solo quando questa e-mail è arrivata. Gli avvisi di nuove prenotazioni vanno all'indirizzo del mittente; un altro lo inserisci in `pb_hooks/buchungen.js` alla voce `MELDUNGEN_AN`.
7. **Mostrare alla persona come gestire tutto da sola:** aprire «Le mie prenotazioni» sul cellulare (`https://{name}.aufwind.sh/verwaltung/`) e accedere con l'account dell'amministrazione. Lì vede le prossime due settimane, annulla una prenotazione o un'intera data (tutte le persone prenotate ricevono un'e-mail con il motivo), inserisce corsi o li termina. Aggiungile la pagina ai preferiti. Le date singole come un workshop non si fanno (ancora) lì, ma nell'amministrazione sotto `termine` (le date). Se davanti c'è un ingresso (sezione 7), «Le mie prenotazioni» funziona solo attraverso il tunnel.

Schema per `3_kurse.js` (giorni della settimana da `mo` a `so`, ora in ora svizzera, chiusura delle prenotazioni in minuti prima dell'inizio):

```js
/// <reference path="../pb_data/types.d.ts" />
// I corsi da docs/kurse.md. Più tardi la persona li cambia da sola su «Le mie prenotazioni».
migrate((app) => {
  const kurs = (titel, ort, preis, buchungsschluss_min, plaene) => {
    const a = new Record(app.findCollectionByNameOrId("angebote"));
    a.set("titel", titel); a.set("ort", ort); a.set("preis_hinweis", preis); a.set("buchungsschluss_min", buchungsschluss_min); a.set("aktiv", true);
    app.save(a);
    for (const [wochentag, zeit, dauer_min, plaetze] of plaene) {
      const w = new Record(app.findCollectionByNameOrId("wochenplan"));
      w.set("angebot", a.id); w.set("wochentag", wochentag); w.set("zeit", zeit); w.set("dauer_min", dauer_min); w.set("plaetze", plaetze); w.set("aktiv", true);
      app.save(w);
    }
  };
  kurs("Yoga serale", "Seestrasse 1, Testwil", "CHF 25, in contanti o TWINT sul posto", 30, [["mo", "18:30", 75, 12], ["mi", "18:30", 75, 12]]);
});
```

Dal programma settimanale nascono le date per otto settimane in anticipo, ogni notte se ne aggiungono di nuove. Se la persona cambia ora o posti, vale per tutte le date senza prenotazioni; quelle prenotate restano come sono.

- **Se lo ampliate, queste regole restano:** I posti liberi sono sempre i posti meno le prenotazioni attive, mai un contatore. Il controllo avviene nel server (`pb_hooks/`), mai solo nel browser. Salvare gli orari come istante preciso, mostrarli con `Europe/Zurich`. Indicare le scadenze con data e ora, mai «24 h prima». Dopo la prenotazione una pagina di conferma e un'e-mail. Raccogliere solo quello che serve: niente indirizzo, niente data di nascita, niente dati sulla salute. Un termine di cancellazione (proposta: 12 mesi dopo la data) va nella dichiarazione sulla protezione dei dati (skill `recht-ch`).
- **Volutamente non incluso,** solo quando manca: pagamento online (se molte persone non si presentano, o per un acconto: un link di pagamento con il numero di prenotazione), account cliente per abbonamenti o carte da 10 ingressi (ricetta `mitglieder`), lista d'attesa, promemoria il giorno prima.
- **Con Light** non si può prenotare davvero: senza un programma sul server nessuno conta i posti. Dillo onestamente e lascia la scelta: richiesta per e-mail o con un servizio di moduli («Ricevi una conferma entro domani»), un link a uno strumento di prenotazione di un altro fornitore (costa, dati spesso all'estero), o Pilot con questa ricetta.

## 6. Strapi: il CMS grande

Strapi è un sistema completo per i contenuti con ruoli e gestione delle immagini, e in più ha una banca dati propria (Postgres). Altro su questo, e sulla domanda se conviene: skill `cms`. Strapi gira solo sul server, quindi al lancio.

1. **Prima i segreti,** prima che `include` sia nel porto, altrimenti la prima costruzione fallisce. Dal diario di bordo, senza che tu li veda:
   ```bash
   ssh {name}@aufwind.sh 'mkdir -p ~/projekt/bausteine/strapi && sh -s ~/projekt/bausteine/strapi' < bausteine/strapi/geheimnisse.sh
   ```
2. **Tipi di contenuto come file:** Sul server Strapi gira in modalità di esercizio, lì non si possono creare tipi di contenuto con dei clic. Li scrivi in `bausteine/strapi/cms/src/api/`. La ricetta `veranstaltungen` mostra lo schema: `schema.json` più controller, route e service.
3. **Lettura per tutti:** In `bausteine/strapi/cms/src/index.ts` inserisci il tipo in `OEFFENTLICH`, per esempio `'api::veranstaltung.veranstaltung'`. Il sito legge poi `/cms/api/veranstaltungen` del proprio indirizzo, le immagini arrivano da `/cms/uploads/`. Scrivere si può solo nell'amministrazione.
4. **Aggiungere `include`, nel diario di bordo, al porto.** La prima costruzione dura circa 7 minuti. Dillo prima, così nessuno pensa che sia bloccata.
5. **Primo account dell'amministrazione:** tunnel `ssh -N -L 1337:localhost:1337 {name}@aufwind.sh`, poi `http://localhost:1337/admin`. La persona crea lì l'account da sola.
6. **Aprire l'amministrazione** (per una redazione senza terminale): solo quando il primo account c'è, altrimenti una persona estranea potrebbe registrarsi per prima. In `bausteine/strapi/nginx.conf` sostituisci la prima sezione con la sezione «Verwaltung freigeben» (senza `#`), in `bausteine/strapi/cms/config/server.ts` attiva la riga `url: '/cms'`, nel diario di bordo, al porto. Allora l'amministrazione è su `https://{name}.aufwind.sh/cms/admin`. Lì la persona invita la redazione (Settings → Users, ruolo Editor o Author). Ogni persona imposta da sola la propria password.
7. **Le voci compaiono** appena sono pubblicate nell'amministrazione. Non serve una nuova costruzione.

## 7. Un ingresso per tutto? (Ein Eingang für alles?)

**L'immagine:** la reception di un palazzo con più uffici. Chi vuole entrare si annuncia una volta; ogni ufficio sa solo chi arriva e con quale ruolo. L'ingresso è un piccolo servizio davanti al sito. Ha fatto l'accesso chi PocketBase conosce (ricetta `mitglieder`), un secondo accesso non c'è.

Se serve lo decidono queste regole, in quest'ordine:

1. **Mai con Light** e mai senza un server proprio: l'ingresso è un programma che gira sul server.
2. **Non serve con un blocco per cui bastano le regole di PocketBase:** per esempio solo la ricetta `mitglieder` (comunicazioni solo per chi è abilitato) o solo `buchungen`. Allora senza ingresso.
3. **Serve quando due o più parti devono sapere chi ha fatto l'accesso** (per esempio pagine protette sotto `/intern/` e le comunicazioni da PocketBase, o un piccolo programma tuo accanto), **o quando dei ruoli valgono per più parti** (il comitato vede `/vorstand/` e in PocketBase può fare di più).

La risposta va in `docs/betrieb.md`, alla riga `Eingang:` (skill `betrieb`). Il suo valore comincia sempre con la parola tedesca `ja` o `nicht nötig`, anche se la persona parla un'altra lingua; dopo viene il motivo nella sua lingua, per esempio `Eingang: ja – /intern/ e le comunicazioni da PocketBase richiedono lo stesso accesso` o `Eingang: nicht nötig – solo la ricetta mitglieder, bastano le regole di PocketBase`. Lo skill `lancieren` monta l'ingresso solo con `Eingang: ja`. Le porte del sito (`docs/tueren.txt`: aperte, solo con accesso, mai) diventano le parti in `bausteine/eingang/eingang.json`.

**Costi:** niente soldi in più, gira insieme al resto sul server Pilot. Memoria: 20 MB a riposo; a pieno carico con pagine piccole fino a 69 MB, con molte immagini insieme (20 pagine da 60 immagini) fino a 129 MB, e se dei visitatori scaricano file grandi senza leggerli fino in fondo: dal sito (nginx) e da PocketBase l'ingresso prende i file grandi a pezzi, misurato con tre indirizzi fino a 42 MB, con quattordici fino a 73 MB; da una parte tua che non conosce gli intervalli, di più (misurato 201 MB). Misurato dal 31.10 al 02.11.2026 su un Mac. Il container è limitato a 128 MB (`mem_limit`); se allora riparte e quanto gli serve sul server, non è ancora misurato; ogni chiamata a una parte protetta interroga PocketBase, costa quasi un millisecondo. In più un elemento da curare (versione di Bun nel `Dockerfile`).

**Montare,** prima in locale come ogni blocco (sezione 4), passo per passo in `bausteine/eingang/README.md`:

1. PocketBase con la ricetta `mitglieder` è montato. Prendere `bausteine/eingang`, `pb_hooks/*` in `bausteine/pocketbase/pb_hooks/`, `pb_migrations/*` in `bausteine/pocketbase/pb_migrations/`.
2. In `eingang.json` inserire l'indirizzo del sito (`ursprung`) e le parti: nome, destinazione, percorsi, accesso `offen` (aperto), `angemeldet` (con accesso) o `rolle:<name>`. Le pagine protette stanno in cartelle proprie (`seite/intern/`). Se più tardi arriva un dominio proprio, qui non serve niente: l'ingresso accetta moduli e accessi dall'indirizzo con cui si apre il sito.
3. In `mitglieder.html` impostare `const EINGANG = true;`: l'accesso vale allora con un cookie per tutte le parti.
4. `bun bausteine/eingang/test.ts` segnala «Alles grün», poi `bun bausteine/pocketbase/lokal.ts --eingang`: la persona apre una pagina protetta senza accesso, accede, torna indietro ed esce.
5. Al lancio (skill `lancieren`, parte 2): in `compose.yaml` sotto `include:` la riga `- bausteine/eingang/compose.yaml`, e nel servizio `webseite` cancellare le righe `ports:` e `- "80:80"`, altrimenti si potrebbe aggirare l'ingresso. Il sito è allora raggiungibile solo dietro l'ingresso. Poi verificare ogni porta dall'esterno: `node scripts/pruefen.mjs --tueren https://{name}.aufwind.sh` con le «porte dei blocchi» (sezione 4): `/intern/` dà 401, `/_/` e `/api/collections/_SUPERUSERS/auth-methods` danno 404, la pagina iniziale 200.

**Cosa non sa fare:** dietro l'ingresso «Le mie prenotazioni» (ricetta `buchungen`) funziona solo attraverso il tunnel, perché l'ingresso chiude dall'esterno l'amministrazione, in qualsiasi grafia. Chiude anche il tempo reale di PocketBase (`/api/realtime`), nessuna ricetta ne ha bisogno. Uscire vale per tutti i dispositivi: chi esce sul telefono è uscito anche sul computer.

## Trappole

- **Amministrazione aperta prima che ci sia il primo account:** Prima crea l'account attraverso il tunnel, poi apri. Apri solo se altri ne hanno bisogno senza terminale.
- **Un blocco di troppo:** Ogni elemento va curato e aggiornato. Meglio uno solo che funziona bene. Un ingresso senza una seconda parte è uno di troppo.
- **Direttamente sul server:** un blocco che in locale non era verde e su cui la persona non ha cliccato da sola non va sul server.
- **Aggiornamenti:** Le versioni sono nel `Dockerfile` (PocketBase, ingresso) e in `package.json` (Strapi). Prima di ogni aggiornamento fai una foto.
- **Dati:** Si trovano in volumi sul server e sono compresi nelle foto quotidiane. `docker compose down -v` li cancella: mai senza una foto e senza il sì della persona.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «elementi prefabbricati nella costruzione di una casa», che ne ripete il nocciolo. Poi: cosa è montato, dove gira e quanta memoria usa, cosa resta aperto e cosa viene dopo.
