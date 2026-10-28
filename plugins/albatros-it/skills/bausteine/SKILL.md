---
name: bausteine
description: "Scopre con una persona senza conoscenze tecniche cosa deve saper fare il suo sito e monta i blocchi pronti adatti: lista di iscrizione, area membri con accesso, bacheca (PocketBase) o un CMS grande (Strapi con Postgres), con la memoria di lavoro misurata. Spiega con l'immagine degli elementi prefabbricati nella costruzione di una casa. Usa lo skill con «iscrizione», «lista di iscrizione», «salvare un modulo», «login», «accesso», «area membri», «area admin», «gestire gli utenti», «banca dati», «database», «Strapi», «CMS», «PocketBase», «blocco», «cosa ci sta sul mio server», «basta il mio server», e quando un sito deve saper fare più che mostrare testi e immagini."
---

# Blocchi: elementi prefabbricati per il tuo sito

## L'immagine

Chi costruisce una casa non si fa da solo finestre, porte e cucina. Arrivano pronte dalla fabbrica, collaudate e con le istruzioni, e vengono montate. Con un sito web è lo stesso: nessuno riscrive da zero un accesso, una lista di iscrizione o un sistema per i contenuti. Albatros li tiene pronti come blocchi, testati e misurati.

E come per la casa: ogni elemento ha bisogno di spazio. Per questo prima guardi cosa serve davvero alla persona.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi.

## Come parli

- **Non limitarti a chiedere:** Se manca un dato, dai comunque i passi concreti con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
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
| I membri accedono e vedono un'area tutta loro | **Area membri con accesso** (PocketBase, ricetta `mitglieder`) | Pilot | circa 20 MB |
| Altri curano news o appuntamenti nel browser | **Bacheca** (PocketBase, ricetta `pinnwand`) | Pilot | circa 20 MB |
| Molti tipi di contenuto, più ruoli, gestione delle immagini, più tardi un'app | **CMS grande** (Strapi con Postgres) | Pilot | circa 200 MB, costruzione fino a 2,5 GB |

Consiglia sempre il più piccolo che basta. Più lingue da sole non sono mai un motivo per un blocco. PocketBase copre insieme lista di iscrizione, accesso e bacheca, e gira una volta sola. Strapi conviene solo quando PocketBase diventa troppo piccolo.

Se la persona ha Light e le serve un blocco: diglielo onestamente. I blocchi girano sul server proprio, quindi con Pilot (skill `kosten`, cambio con `upgrade_link` e `pilot`). Diario di bordo e indirizzo restano.

## 3. Cosa ci sta sul server?

Un server con Pilot ha 4 GB di memoria di lavoro (RAM) e 40 GB di spazio, senza memoria di scambio (swap): se diventa troppo, il server chiude un programma. Misurato il 28.10.2026 (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17):

| Cosa | In funzione | Durante la costruzione | Spazio |
|---|---|---|---|
| Sito dal modello | 10 MB | breve | poco |
| PocketBase (tutte e tre le ricette insieme) | 20 MB | breve | 40 MB |
| Strapi con Postgres | 150 MB + 55 MB | picco 2,5 GB, prima costruzione circa 7 minuti | 1,4 GB |

Sito, PocketBase e Strapi insieme, in funzione, usano circa 250 MB. Si fa stretto solo durante la costruzione, per questo il nastro trasportatore costruisce un lavoro dopo l'altro. Sul server non vanno programmi che da soli usano più di 1 GB, per esempio Keycloak, Supabase, Logto, Mattermost o il riconoscimento del testo (OCR). Per un accesso proprio prendi PocketBase.

Prima del montaggio: `free -h` sul server mostra quanto è libero. Dopo il montaggio: `docker stats --no-stream` mostra quanto usa ogni blocco.

## 4. Montare

Vale per ogni blocco. Prima fai una foto del server: strumento `snapshot` con il nome `vor-baustein` (skill `zurueck-auf-gestern`).

1. **Prendere.** Nel diario di bordo sul computer della persona (skill `git-logbuch`) scarichi il blocco dalla fabbrica, il repository pubblico di Albatros:
   ```bash
   curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
   ```
   Per Strapi alla fine c'è `bausteine/strapi`. Le ricette poi si trovano in `bausteine/<baustein>/rezepte/`.
2. **Agganciare.** In `compose.yaml`, proprio in cima:
   ```yaml
   include:
     - bausteine/pocketbase/compose.yaml
   ```
   Il sito inoltra da solo le richieste: il modello legge ogni `bausteine/*/nginx.conf`. Se il progetto è più vecchio dei blocchi (nessun `nginx.conf` nel progetto), prendi `Dockerfile` e `nginx.conf` da `vorlage/` nello stesso repository.
3. **Inserire la ricetta** (sezione 5 o 6) e portare i testi delle pagine nella lingua della persona.
4. **Nel diario di bordo e al porto.** Il nastro trasportatore costruisce e consegna (skill `pipeline`). Se la costruzione non riesce, il vecchio sito resta online.
5. **Verificare** sul server: `docker ps` mostra il blocco come `healthy`.

## 5. PocketBase: lista di iscrizione, membri, bacheca

PocketBase è un unico piccolo programma con banca dati, accesso e amministrazione. Il sito gli parla sotto `/api/` del proprio indirizzo. L'amministrazione resta fuori dal sito pubblico.

- **Inserire l'indirizzo:** In `bausteine/pocketbase/pb_migrations/1_einstellungen.js` imposta la riga `ADRESSE` sull'indirizzo del sito (`https://{name}.aufwind.sh` o il dominio proprio). Compare nelle e-mail come «Password dimenticata».
- **Inserire la ricetta:** Da `bausteine/pocketbase/rezepte/<rezept>/`, `pb_migrations/2_*.js` va in `bausteine/pocketbase/pb_migrations/` e `seite/*.html` va in `seite/`.
  - `anmeldeliste`: modulo `anmelden.html`. Tutti possono iscriversi, leggere può solo l'amministrazione.
  - `mitglieder`: `mitglieder.html` con registrarsi, accedere, uscire. Le comunicazioni le vedono solo i membri che hanno effettuato l'accesso. I membri si trovano nell'amministrazione sotto `users`.
  - `pinnwand`: `pinnwand.html` mostra gli articoli con data e immagine. Si scrive nell'amministrazione.
  - Campi o raccolte propri li scrivi come ulteriore file `pb_migrations/3_*.js` secondo lo stesso schema.
- **Primo account dell'amministrazione:** Dopo il primo avvio PocketBase scrive un link di configurazione nel registro. Prendilo e apri il passaggio segreto (tunnel), così l'amministrazione resta invisibile da internet:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && docker compose logs pocketbase' | grep pbinstall
  ssh -N -L 8090:localhost:8090 {name}@aufwind.sh
  ```
  Il secondo comando lo lasci girare in background. Dai alla persona il link con `http://localhost:8090` invece di `http://0.0.0.0:8090`. Lì stabilisce e-mail e password, solo nel browser. Se il link è scaduto: `docker compose restart pocketbase` sul server, poi ce n'è uno nuovo. Più tardi si entra da `http://localhost:8090/_/`, finché il tunnel è aperto.
- **Aprire l'amministrazione:** Se altri hanno bisogno dell'amministrazione senza terminale, o se la persona vuole vedere la lista sul cellulare: in `bausteine/pocketbase/nginx.conf` togli i `#` davanti alla sezione «Verwaltung freigeben» (aprire l'amministrazione), nel diario di bordo, al porto. Allora è su `https://{name}.aufwind.sh/_/`, protetta con la password dell'amministrazione. Aprila solo quando il primo account c'è. Appena partono le e-mail, la persona attiva nell'amministrazione sotto `_superusers` → Options l'accesso a due fattori (MFA).
- **E-mail** (confermare l'indirizzo, password dimenticata): Il server non può inviare attraverso le solite porte per le e-mail. Nell'amministrazione sotto Settings → Mail settings: server SMTP `smtp.resend.com`, porta `2587`, utente `resend`, come password la chiave API di Resend. Quella la digita lì la persona stessa. Va anche Brevo, con `smtp-relay.brevo.com` e la porta `2525`. Il mittente è un indirizzo del dominio proprio, confermato presso il servizio e-mail.
- **Accedere con Google, Apple o GitHub:** si fa nell'amministrazione sotto `users` → Options → OAuth2. Serve un account presso il rispettivo fornitore. Fallo solo quando e-mail e password funzionano.

## 6. Strapi: il CMS grande

Strapi è un sistema completo per i contenuti con ruoli e gestione delle immagini, e in più ha una banca dati propria (Postgres). Altro su questo, e sulla domanda se conviene: skill `cms`.

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

## Trappole

- **Amministrazione aperta prima che ci sia il primo account:** Prima crea l'account attraverso il tunnel, poi apri. Apri solo se altri ne hanno bisogno senza terminale.
- **Un blocco di troppo:** Ogni elemento va curato e aggiornato. Meglio uno solo che funziona bene.
- **Aggiornamenti:** Le versioni sono nel `Dockerfile` (PocketBase) e in `package.json` (Strapi). Prima di ogni aggiornamento fai una foto.
- **Dati:** Si trovano in volumi sul server e sono compresi nelle foto quotidiane. `docker compose down -v` li cancella: mai senza una foto e senza il sì della persona.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «elementi prefabbricati nella costruzione di una casa», che ne ripete il nocciolo. Poi: cosa è montato, dove gira e quanta memoria usa, cosa resta aperto e cosa viene dopo.
