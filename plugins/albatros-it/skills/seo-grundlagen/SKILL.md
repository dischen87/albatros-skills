---
name: seo-grundlagen
description: "Rende visibile un piccolo sito web: per i motori di ricerca (SEO) e per gli assistenti IA (GEO), spiegato a persone senza conoscenze tecniche con l'immagine dei cartelli stradali e della pianta della città. Titolo e descrizione della pagina, un solo titolo principale, indirizzo canonico, descrizioni delle immagini, sitemap.xml, robots.txt, dati strutturati secondo il tipo di attività, anteprima quando si condivide, llms.txt, fatti e domande con risposte, Google Search Console, Bing Webmaster Tools, IndexNow e profilo dell'attività; verificato con sichtbar-pruefen.mjs sul sito costruito. Usa lo skill con «SEO», «GEO», «diventare visibile», «farsi trovare su Google», «Google non trova il mio sito», «farsi trovare in ChatGPT», «ricerca con l'IA», «motore di ricerca», «sitemap», «meta description», «Search Console», «Bing», «IndexNow», «llms.txt», «farsi trovare in zona», «comparire su Google Maps»."
metadata:
  stand: 0.3.2
  quelle: 'd1e923bdddba'
---

# Basi SEO: cartelli stradali e pianta della città

## L'immagine

Un motore di ricerca è una pianta della città che un messaggero diligente ridisegna ogni giorno. Cammina per le strade, legge le insegne e annota quello che trova. Perché il tuo negozio sia sulla pianta, servono:

- **un'insegna chiara sopra la porta** (titolo della pagina e titolo principale),
- **cartelli stradali** da altri luoghi verso di te (link),
- **una piantina** che metti in mano al messaggero (`sitemap.xml`),
- **un regolamento della casa** per il messaggero: dove può andare (`robots.txt`).

Oggi molti non consultano più la pianta della città, ma uno sportello informazioni: un assistente IA che dà subito lui la risposta. Lo sportello consiglia solo quello che sa con certezza. Ha bisogno di fatti chiari sul tuo negozio, scritti dappertutto allo stesso modo.

Le parole tecniche sono **SEO** (farsi trovare nei motori di ricerca) e **GEO** (essere nominati nelle risposte delle IA). Per tutte e due conta soprattutto che il sito risponda bene alla domanda di chi cerca.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate `[Annahme: …]`. I segni `[Annahme: …]` e `[offen: …]` restano in tedesco, come i nomi delle righe in `docs/`: è da loro che `lage` riconosce ciò che è supposto o ancora aperto. Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu. Non promettere miracoli: farsi trovare richiede settimane, non ore, e nessuno può garantire un posto in una ricerca o nella risposta di un'IA. Niente trucchi (testo nascosto, link comprati, testi scritti solo per le macchine): fanno più danni che altro.
- **Non inventare niente:** niente recensioni, stelle, numeri di clienti, riconoscimenti o citazioni che non esistono. Ogni numero sul sito viene dalla persona o da una fonte che hai aperto tu, e sta scritto insieme a lei.
- **Gli account sono della persona:** su Google e Microsoft accede lei, nel suo browser. Tu non inserisci mai dati di accesso, nemmeno se te li dice, e non confermi niente a suo nome: su «Conferma» clicca lei. Tu prepari quello che deve stare sul sito e le dici ogni clic.

## Quando tocca che cosa

- **Durante la costruzione** (skill `webseite-bauen`), sul computer della persona: tutto quello che sta nel sito, passi da 1 a 6. Lo script `sichtbar-pruefen.mjs` lo verifica sul sito costruito.
- **Dopo la messa online** (skill `lancieren`), con l'indirizzo vero: Search Console, Bing Webmaster Tools, IndexNow e il profilo dell'attività, passi da 7 a 10. La cosa più semplice è con un dominio proprio (skill `domain`).
- **Con il programma Albatros** (skill `lotse`, sezione «Il programma Albatros» (Berts Arbeitsplatz)) la tappa «Diventare visibile» mostra gli stessi dodici punti dello script, con parole di tutti i giorni («Farsi trovare su Google»). Chiama `naechstes` all'inizio e dopo ogni passo: dice quanti punti lì mancano ancora e porta quello che la persona chiede in Albatros. Se il suo messaggio nomina dei punti della verifica, ti occupi proprio di quelli e cambi solo ciò che serve per questo.

## Procedura

### 1. Che cosa cercano e chiedono le persone?

Scrivi con la persona cinque frasi che il suo pubblico digiterebbe su Google («mensa pranzo scolari Molino Nuovo», «riparare bici Bellinzona centro»), e cinque domande che farebbe a un'IA («Dove posso far riparare la mia bici in centro a Bellinzona, e quanto costa un servizio?»). Per ogni pagina una frase principale. Va in `docs/recherche.md`, nella riga `Suchbegriffe:`; se lì c'è già qualcosa della ricerca (P2), ci costruisci sopra.

### 2. Ogni pagina: l'insegna sopra la porta

- **Titolo della pagina** (`<title>`): cosa + luogo o vantaggio + nome, circa da 50 a 60 caratteri. Ogni pagina il suo. (punto «titel»)
- **Descrizione** (`<meta name="description">`): una o due frasi che invitano a cliccare, circa 150 caratteri, su ogni pagina una diversa. Spesso compare sotto il titolo nei risultati di ricerca. (punto «beschreibung»)
- **Esattamente un titolo principale** (`<h1>`) per pagina, sotto i sottotitoli. (punto «h1»)
- **Indirizzi parlanti:** `/offerta/mensa` invece di `/pagina?id=7`.
- **Immagini:** ognuna con una descrizione (`alt`, per la pura decorazione `alt=""`), con `width` e `height`, sotto 500 KB (skill `barrierefreiheit` e `inhalte`). (punto «bilder»)
- **Lingua:** `<html lang="it-CH">`.
- **Un solo indirizzo principale:** il sito è raggiungibile o con o senza `www`, l'altra variante reindirizza. Ogni pagina indica con `<link rel="canonical" href="https://…">` il suo unico indirizzo completo. Con Astro l'indirizzo principale sta come `site` in `web/astro.config.mjs` (l'indirizzo da `docs/lancieren.md`, riga `Adresse:`), e il layout scrive `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)}>`. (punto «kanonisch»)
- **Link interni:** ogni pagina è collegata da almeno un'altra pagina, con un testo del link che dice dove porta.
- **Anteprima quando si condivide** (Open Graph): `og:title`, `og:description`, `og:image` (indirizzo completo, un'immagine propria, circa 1200 × 630 px) e `og:url` su ogni pagina. Così un link condiviso mostra immagine e testo invece di un indirizzo nudo. (punto «open_graph»)

### 3. Piantina e regolamento della casa

- **`web/public/sitemap.xml`:** tutte le pagine pubbliche con l'indirizzo completo (`https://…`), per ogni pagina un `<url><loc>…</loc></url>`. Per le cinque-sette pagine del primo volo la scrivi a mano e la aggiorni a ogni nuova pagina; lo script del passo 6 segnala se manca una pagina o se ce n'è una di troppo. Google ne legge solo gli indirizzi e, se è giusta, la data dell'ultima modifica; di `priority` e `changefreq` non tiene conto. Quando le pagine sono molte, la genera l'integrazione di Astro (`npx astro add sitemap`, ha bisogno di `site`); allora il file si chiama `sitemap-index.xml`, e lo script legge anche quello. La missione più sotto verifica `sitemap.xml`, perciò per il primo volo si resta al file scritto a mano. (punto «sitemap»)
- **`web/public/robots.txt`:** (punto «robots»)
  ```
  User-agent: *
  Allow: /

  Sitemap: https://<domain>/sitemap.xml
  ```
  La riga `Sitemap:` ha bisogno dell'indirizzo completo. Grazie a lei trovano la piantina anche i motori di ricerca a cui nessuno l'ha inviata.
- **I messaggeri delle IA:** chi vuole comparire nelle risposte delle IA non chiude fuori i loro messaggeri. Se i testi del sito possono essere letti anche per addestrare modelli di IA, lo decide la persona; tu glielo chiedi e lo inserisci. I singoli messaggeri si bloccano con un blocco a sé (`User-agent: GPTBot`, sotto `Disallow: /`); per Google, `Google-Extended` regola solo l'addestramento, non la ricerca.

### 4. Dati strutturati: i dati dell'attività, leggibili dalle macchine

Un blocco `application/ld+json` (JSON-LD, vocabolario schema.org) nella testa della pagina iniziale dice ai motori di ricerca e agli assistenti IA, senza che debbano tirare a indovinare, chi è. Il tipo (`@type`) dipende dall'attività, il più preciso possibile: (punto «strukturierte_daten»)

| Che cosa ha la persona | `@type` | Che cosa ci va dentro |
|---|---|---|
| Negozio, studio medico, studio, officina, ristorante con un indirizzo | `LocalBusiness` o più preciso (`Restaurant`, `BikeStore`, `HairSalon`, `Dentist` …) | `name`, `address` (Google li richiede entrambi), in più `telephone`, `url`, `openingHoursSpecification`, `geo` |
| Associazione, ditta senza negozio, progetto | `Organization` (per un'associazione anche `SportsOrganization`, `NGO` …) | `name`, `url`, `logo`, contatto |
| Una persona (indipendente, artista) | `Person` | `name`, `jobTitle`, `url` |
| Corsi ed eventi con una data | `Event`, un blocco per evento | `name`, `startDate`, `location` |
| Prodotti con un prezzo | `Product` con `offers` | `name`, `image`, prezzo e valuta |

Regole: nel blocco c'è solo quello che sta anche in modo visibile sul sito, con le stesse parole e gli stessi numeri. Niente stelle e recensioni sulla propria attività (`aggregateRating`, `review`): Google non le mostra per `LocalBusiness` e `Organization` quando è l'attività stessa a gestirle, e quelle inventate sono vietate. Nessun `[Annahme: …]` e nessun `[da completare: …]` nel blocco. La persona può verificarlo dopo la messa online con il «Rich Results Test» di Google.

### 5. Per le risposte delle IA: fatti che si possono citare

Un assistente IA nomina un sito quando ci trova una risposta chiara e documentata. Per questo non servono trucchi e, secondo Google, nemmeno file speciali: quello che va bene per la ricerca va bene anche per le risposte IA di Google. Che cosa aiuta in più:

- **Una sezione dei fatti** sulla pagina iniziale o sotto «Chi siamo»: chi, che cosa, per chi, dove, quando è aperto, quanto costa, come si chiede. In frasi intere che sono vere anche da sole («L'officina di biciclette Bellinzona Centro ripara bici di tutte le marche, di solito entro il giorno dopo»), non solo in immagini o tabelle.
- **Domande e risposte:** le cinque domande del passo 1, ognuna con una risposta in due o tre frasi, visibili sul sito. Solo domande che vengono fatte davvero; le risposte le conferma la persona.
- **Fonti:** ogni numero e ogni affermazione ha una prova: un dato proprio con la data («stato: novembre 2026») o un link alla fonte. Quello che non si può provare cade.
- **Dappertutto gli stessi dati:** nome, indirizzo, telefono e orari d'apertura stanno sul sito, nei dati strutturati, nel profilo dell'attività e negli elenchi uguali carattere per carattere.
- **`web/public/llms.txt`:** una breve panoramica per gli assistenti IA, in Markdown: prima `# <nome>`, poi un riassunto come citazione (`> …`), poi sotto `## Pagine` le pagine più importanti come link con mezza frase. Solo fatti verificati, niente che non stia anche sul sito. Detto onestamente: è una proposta (llmstxt.org), non uno standard; Google dice che un file così non serve, e non è certo che altri assistenti lo leggano. Costa cinque minuti e non fa danni. (punto «llms_txt»)

  ```markdown
  # Officina di biciclette Bellinzona Centro

  > Riparazioni di biciclette nel centro di Bellinzona, di solito entro il giorno dopo. Aperto da martedì a sabato.

  ## Pagine

  - [Offerta](https://<domain>/offerta/): servizio e riparazioni con i prezzi
  - [Contatto](https://<domain>/contatto/): indirizzo, orari d'apertura, telefono
  ```

### 6. Veloce e leggero, poi verificare

Riduci le immagini (skill `inhalte`), carica solo i caratteri e gli script necessari: per pagina al massimo 1 MB con tutto ciò che include in modo fisso. (punto «gewicht»)

Poi lo script di questo skill verifica il sito costruito, senza rete e senza cambiare niente:

```bash
mkdir -p scripts && cp <cartella di questo skill>/sichtbar-pruefen.mjs scripts/
# cartella sconosciuta: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/seo-grundlagen/sichtbar-pruefen.mjs -o scripts/sichtbar-pruefen.mjs
(cd web && npm run build) && node scripts/sichtbar-pruefen.mjs        # il sito costruito in seite/ (altrimenti dist/)
node scripts/sichtbar-pruefen.mjs --json                               # lo stesso come JSON, con i dodici nomi
```

Segnala dodici punti con un semaforo, con nomi fissi (uguali in ogni lingua): «titel», «beschreibung», «h1», «bilder», «sitemap», «robots», «kanonisch», «strukturierte_daten», «open_graph», «llms_txt», «gewicht» e «indexnow». Rosso vuol dire: questo impedisce o falsa il farsi trovare; correggere, ricostruire, verificare di nuovo. Giallo vuol dire: consigliato. Quello che lo script non può vedere lo dici onestamente alla persona: se i fatti sono veri, se altri mettono link verso di lei, e tutto ciò che si può fare solo nei suoi account. In più, in Chrome, Lighthouse (clic destro, «Ispeziona», «Lighthouse», categorie «SEO» e «Prestazioni»); durante la costruzione lo misura già `pruefen.mjs` (skill `webseite-bauen`).

### 7. Google Search Console: avvisare il messaggero

Dopo la messa online. La Search Console è la finestra da cui la persona vede che cosa Google sa del suo sito. Funziona così (verificato il 10.11.2026 sulla guida di Google):

1. La persona apre search.google.com/search-console, accede con il suo account Google e aggiunge il suo sito. Ci sono due tipi: **Dominio** (tutto ciò che sta sotto il dominio, funziona solo con una voce nell'elenco telefonico del dominio, il DNS) e **Prefisso URL** (esattamente un indirizzo come `https://www.<domain>/`, funziona anche con un file).
2. **Proprietà con un file** (Prefisso URL): Google le dà un piccolo file da scaricare. Lei te lo mette nella cartella del progetto, tu lo metti così com'è in `web/public/` (nome e contenuto restano come sono), poi il sito va di nuovo in rete con questo file (skill `webseite-aendern`: approvazione della persona, solo dopo il push). Tu verifichi che il file risponda al suo indirizzo; su «Conferma» clicca la persona.
3. **Proprietà con una voce DNS** (Dominio o Prefisso URL): Google mostra una voce TXT. La persona la inserisce là dove viene gestito il suo dominio (skill `domain`; da Albatros proprio come la prova TXT `_albatros`), poi clicca su «Conferma». Possono volerci da minuti a ore prima che la voce sia visibile.
4. **Il file o la voce restano per sempre:** Google ricontrolla di continuo. Chi li toglie perde la conferma.
5. **Inviare la sitemap:** sotto «Sitemap» la persona inserisce l'indirizzo della sitemap (`https://<domain>/sitemap.xml`). È un'indicazione per Google, non una garanzia.
6. Dopo qualche giorno «Pagine» mostra che cosa è stato accolto e che cosa no, con il motivo. I singoli indirizzi li verifica con il «Controllo URL».

Senza dominio proprio (l'indirizzo di Albatros) funziona solo la strada **Prefisso URL** con un file o con il tag `<meta name="google-site-verification" …>` nella testa della pagina iniziale, perché il DNS dell'indirizzo lo gestisce Albatros.

### 8. Bing Webmaster Tools

Bing alimenta anche altre ricerche e alcuni assistenti IA. Funziona così (verificato il 10.11.2026 sulla guida e sul blog di Bing):

1. La persona apre bing.com/webmasters e accede con il suo account Microsoft.
2. **La cosa più semplice: importare dalla Search Console.** Sceglie «Importa» e permette lei stessa a Bing di accedere alla sua Search Console. Il sito è allora confermato senza altra prova; Bing confronta regolarmente con Google. Questo permesso lo dà solo lei, nel suo browser.
3. **Oppure a mano:** il file `BingSiteAuth.xml` in `web/public/` (come per Google, così com'è), o il tag `<meta name="msvalidate.01" content="…">` nella testa della pagina iniziale, o una voce DNS che Bing mostra nell'account. Poi clicca su «Conferma».
4. Sotto «Sitemap» invia la stessa sitemap.

### 9. IndexNow: segnalare subito le pagine nuove e cambiate

IndexNow è un campanello per i motori di ricerca: invece di aspettare che passi il messaggero, il sito segnala da sé che cosa c'è di nuovo. Vale per Bing e altri (secondo indexnow.org il 10.11.2026: Amazon, Bing, Naver, Seznam.cz, Yandex, Yep; una segnalazione a uno va a tutti), non per Google. Una segnalazione è un'indicazione, non una garanzia.

1. **Chiave:** da 8 a 128 caratteri tra `a–z`, `A–Z`, `0–9` e `-`. La generi tu: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`.
2. **File della chiave:** `web/public/<chiave>.txt`, contenuto esattamente la chiave. La chiave non è un segreto, sta aperta in rete; prova solo che la segnalazione viene da questo sito. Ogni indirizzo (anche con e senza `www`) ha bisogno del suo file. (punto «indexnow»)
3. **Segnalare**, solo quando il sito con il file della chiave è online, e solo con il sì della persona, perché così gli indirizzi del suo sito vanno a terzi:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' "https://api.indexnow.org/indexnow?url=https://<domain>/&key=<chiave>"
   ```
   200 vuol dire accettata, 202 accettata e la chiave viene ancora verificata, 403 la chiave non corrisponde al file, 422 l'indirizzo non appartiene a questa chiave, 429 troppe segnalazioni. Più indirizzi vanno in una sola segnalazione come JSON (`host`, `key`, `urlList`, fino a 10 000 indirizzi).
4. Si segnala quello che è nuovo, cambiato o cancellato, non tutto ogni giorno. Se la persona pubblica con il programma Albatros, la tappa «Diventare visibile» dice se lì la segnalazione parte già insieme; allora non segnali due volte.

### 10. Per le attività locali: il profilo dell'attività

- Indirizzo, telefono e orari d'apertura come testo sul sito (non solo in un'immagine), scritti ovunque allo stesso modo.
- **Profilo dell'attività su Google** (prima «Google My Business»): con questo l'attività compare su Google Maps e a destra accanto alla ricerca. La persona lo crea da sé (google.com/business) e lo conferma da sé, a seconda dell'attività per posta, per telefono o con un video; possono volerci giorni. Gli stessi dati del sito web, e ci inserisce l'indirizzo del sito web. Le recensioni lì vengono da clienti veri; chiederle è permesso, comprarle o scriverle da sé mai.
- Un'indicazione, niente di più: tu non crei il profilo e non accedi lì.

### 11. Raccogliere cartelli stradali

Link veri da luoghi adatti: elenco del quartiere o dell'associazione di categoria, partner, media locali, società e associazioni. Niente link comprati. Ogni menzione con gli stessi dati del sito aiuta anche gli assistenti IA: credono più facilmente a quello che sta scritto uguale in più posti.

## Trappole

- Promettere un piazzamento: nessuno può farlo.
- Inventare stelle, recensioni o numeri, anche «solo come esempio»: è un inganno (LCSl) e viene scoperto.
- Dati nel JSON-LD che non stanno sul sito o che lì sono diversi.
- Cancellare il file di verifica di Google o di Bing dopo la conferma: allora la conferma va persa.
- Accettare i dati di accesso della persona o cliccare per lei su «Conferma»: lo fa solo lei.
- Dimenticare un `robots.txt` con `Disallow: /` del periodo di costruzione: allora nessuno trova il sito.
- La sitemap con un indirizzo diverso da quello del sito (con invece che senza `www`, `http` invece di `https`).

## Verifica la missione

Diario di bordo e nastro trasportatore (skill `git-logbuch`, `pipeline`), poi `mission_pruefen` con `webseite-09-seo-grundlagen`. La verifica controlla se `https://{name}.aufwind.sh/sitemap.xml` e `/robots.txt` rispondono.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «cartelli stradali e pianta della città», che ne ripete il nocciolo. Poi: cosa è fatto (i dodici punti con il loro semaforo), dove si trova il risultato, cosa deve fare la persona stessa nei suoi account (Search Console, Bing, profilo dell'attività) e cosa viene dopo. Di' onestamente che possono volerci settimane.
