---
name: domain
description: "Trova, compra o collega un dominio proprio (p. es. mionegozio.ch) per la pagina o il server su Albatros, con Light come con Pilot. Spiega dominio e DNS con l'immagine dell'indirizzo e dell'elenco telefonico, propone nomi, cerca con domain_suchen cosa è libero e compra tramite Albatros con domain_kaufen (la persona è titolare, i suoi dati li inserisce solo sulla pagina di pagamento). Un dominio che la persona ha già, lo skill lo collega con domain_verbinden: voci DNS, prova TXT _albatros e verifica, finché la pagina compare nel browser con il lucchetto. Usa lo skill con «dominio proprio», «il mio indirizzo», «comprare un .ch», «quale dominio è libero?», «cercare un dominio», «DNS», «record A», «CNAME», «record TXT», «il dominio non punta alla mia pagina», «certificato», «https non funziona»."
---

# Dominio: il tuo indirizzo nell'elenco telefonico

## L'immagine

- **Dominio** (`mionegozio.ch`): il tuo indirizzo, che le persone riescono a ricordare.
- **Server**: la casa raggiungibile con un numero che nessuno riesce a ricordare.
- **DNS**: l'elenco telefonico di internet. Dice: «mionegozio.ch abita nella casa con questo numero.»
- **Registrar**: l'ufficio presso cui affitti l'indirizzo per un anno. Albatros può sbrigarlo per te. Come titolare risulti comunque tu.

La tua pagina è già raggiungibile su `{name}.aufwind.sh`. Con un dominio proprio riceve un indirizzo che appartiene a te. Se più avanti traslochi (skill `landung`), l'indirizzo lo porti con te.

**Come usi l'immagine:** dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu, frasi brevi, niente gergo tecnico. «Voce nell'elenco telefonico» invece di «record DNS», finché la persona non vede le parole nell'interfaccia del suo registrar. Allora le dici tutte e due.
- Nome, indirizzo, telefono e dati di pagamento la persona li inserisce solo sulla pagina di pagamento, mai nella chat.

## Procedura

### 1. L'abbonamento va bene?

I domini propri ci sono con Light e con Pilot, non con Gratis. Verifica con `konto_status`. Se la persona ha Gratis, spiega la differenza e prendi il link con `upgrade_link` (livello `light`). Non imporre niente. Cercare si può con ogni abbonamento. Comprare e collegare si può appena c'è la pagina (Light) o il server (Pilot). Il dominio costa a parte, all'anno, in più dell'abbonamento.

### 2. La persona ha già un indirizzo?

- **No:** avanti con il passo 3, ne trova e ne compra uno tramite Albatros.
- **Sì, comprato altrove:** avanti con il passo 4.
- **Sì, comprato tramite Albatros:** `konto_status` lo mostra alla voce «Eigene Domains» (domini propri) con il suo stato. Se è attivo, avanti con il passo 7.

### 3. Trovare e comprare un indirizzo

1. **Proponi tu dei nomi:** da tre a cinque idee adatte al progetto, prima di cercare. Brevi, facili da compitare, senza trattini se si può evitare. Una località nel nome aiuta se la parola da sola è già presa. `.ch` per un pubblico in Svizzera. Nessun marchio altrui nel nome, porta guai.
2. **Cercare:** `domain_suchen` con fino a cinque desideri, come parole o domini interi (`bici-lugano`, `bottega-anna.ch`). Albatros aggiunge le estensioni `.ch`, `.com`, `.net`, `.shop` e `.li` e delle varianti, e indica solo ciò che è davvero libero, con il prezzo annuo. Riporta risultati e prezzi esattamente così. Se un indirizzo è libero e quanto costa non lo indovini mai. Se non c'è niente di libero: altre parole, aggiungere una località o una forma più corta, poi cerca di nuovo.
3. **Di' come funziona l'acquisto,** insieme ai risultati:
   - La persona è fin dall'inizio lei stessa titolare, non Albatros. I suoi diritti da titolare sono descritti dall'ICANN, l'ente che fa le regole per i domini. Scrivi sempre il link per intero (pagina in inglese): https://www.icann.org/resources/pages/benefits-2013-09-16-en
   - Nome, indirizzo e telefono li inserisce lei stessa sulla pagina di pagamento, mai nella chat. I dati devono essere giusti, perché l'indirizzo appartiene a chi è registrato.
   - Il prezzo vale per anno e vale uguale anche per il rinnovo. Albatros rinnova ogni anno, finché l'abbonamento del dominio è attivo.
4. **Comprare:** quando la persona ha scelto un indirizzo, chiami `domain_kaufen` con esattamente quello e le passi il link. Pagamento e dati li fa lei stessa sulla pagina di pagamento.
5. **Dopo:** presso il registrar non c'è niente da inserire. Albatros registra l'indirizzo, mette le voci nell'elenco telefonico e prende il certificato, di solito in 5–30 minuti. Lo stato lo mostra `konto_status`. Avanti con il passo 7.

### 4. Registrare un indirizzo esistente

Chiama `domain_verbinden` con il dominio. Lo strumento risponde con esattamente le voci che devono andare nell'elenco telefonico:

- una **voce TXT** `_albatros.<domain>` con un codice. È la prova che l'indirizzo è tuo, come una lettera che solo l'inquilino trova nella buca delle lettere.
- una voce che punta alla tua pagina o al tuo server: per `www.<domain>` di solito un **CNAME** su `{name}.aufwind.sh` («abita presso»), per l'indirizzo senza `www` una voce **A** e una **AAAA** con i numeri della risposta.

Prendi sempre i valori dalla risposta di `domain_verbinden`, mai valori a memoria. Mostrali come tabella con le colonne Tipo, Nome, Valore e **Significato**, così nessuna sigla resta senza spiegazione: TXT = biglietto con la prova, CNAME = «abita presso», A = numero civico, AAAA = numero civico nuovo, più lungo.

### 5. Inserire le voci presso il registrar

La persona apre presso il registrar la gestione DNS (spesso «DNS», «Zona» o «Record del nameserver»). Guidala campo per campo: tipo, nome, valore. Inciampo tipico: alcuni registrar aggiungono da soli il dominio. Allora il campo «Nome» è solo `_albatros` invece di `_albatros.mionegozio.ch`.

### 6. Aspettare e verificare

L'elenco telefonico non viene ristampato dappertutto subito. Ci vogliono minuti, raramente ore. Verifica con:

```bash
dig +short TXT _albatros.meinladen.ch
dig +short meinladen.ch
dig +short www.meinladen.ch
```

Se le risposte corrispondono ai valori del passo 4, chiama di nuovo `domain_verbinden`. Albatros verifica la prova e poi prende automaticamente il certificato (il simbolo del lucchetto nel browser). Senza verifica non c'è certificato.

### 7. Verifica la missione

Apri `https://<domain>` con la persona. Poi `mission_pruefen` con `flugschule-09-domain`.

## Se qualcosa si inceppa

- **Comprato, ma dopo un'ora non ancora attivo:** `konto_status` mostra lo stato e un'indicazione. Se lì c'è scritto che qualcosa non ha funzionato, si fa vivo il team. Altrimenti `coach_fragen`.
- **`dig` non mostra niente:** errore di battitura nel nome o non ancora ristampato. Aspetta dieci minuti, poi riprova.
- **Vecchie voci danno fastidio:** molti registrar creano una pagina di parcheggio. Queste voci A la persona le deve cancellare, altrimenti l'indirizzo punta a due case.
- **E-mail tramite il dominio:** le voci MX per l'e-mail non toccarle né cancellarle mai. Sono un altro capitolo dell'elenco telefonico.
- **Il browser avvisa «non sicuro»:** il certificato manca ancora. Di solito la prova TXT non è ancora visibile. Torna al passo 6.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «il tuo indirizzo nell'elenco telefonico», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
