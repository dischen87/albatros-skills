---
name: recht-ch
description: "Mette in regola dal punto di vista legale un piccolo sito web svizzero, spiegato a persone senza conoscenze tecniche con l'immagine della targhetta del campanello e del regolamento della casa: impressum (art. 3 cpv. 1 lett. s LCSl), dichiarazione sulla protezione dei dati secondo la nLPD (obbligo d'informare, art. 19), cookie (art. 45c LTC), accesso con login (cookie, registri, termini), quando si aggiunge il RGPD (GDPR) dell'UE, diritti sulle immagini, e-mail pubblicitarie solo con consenso. Non è una consulenza legale. Usa lo skill con «impressum», «protezione dei dati», «privacy», «dichiarazione sulla protezione dei dati», «informativa sulla privacy», «LPD», «nLPD», «GDPR», «banner dei cookie», «mi serve per legge?», «cosa deve esserci sul mio sito», «modulo di contatto e privacy», «login e privacy»."
metadata:
  stand: 0.3.1
  quelle: 'e1db985e5990'
---

# Diritto CH: targhetta del campanello e regolamento della casa

## L'immagine

- **Impressum = targhetta del campanello:** Chi abita qui, e come si raggiunge questa persona?
- **Dichiarazione sulla protezione dei dati = regolamento della casa per i visitatori:** Cosa succede con quello che i visitatori ti danno o lasciano (il nome nel modulo, le tracce nelle statistiche)?
- **Cookie = piccoli foglietti che metti in tasca ai visitatori**, per riconoscerli. Su questo devi informare.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate `[Annahme: …]`. I segni `[Annahme: …]` e `[offen: …]` restano in tedesco, come i nomi delle righe in `docs/`: è da loro che `lage` riconosce ciò che è supposto o ancora aperto. Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, in modo semplice ma preciso: cita la legge e l'articolo.
- Aggiungi sempre: «Questa non è una consulenza legale. In caso di dubbio, con dati delicati (salute, bambini) o con molta cifra d'affari conviene rivolgersi a una persona del mestiere.»
- Non copiare alla cieca un modello trovato in rete. Ogni frase deve adattarsi al sito. Una dichiarazione che nomina servizi che non esistono, o che ne dimentica di veri, è sbagliata.

## Procedura

### 1. Inventario

Chiedi e prendi nota:

- Chi gestisce il sito (persona privata, associazione, ditta individuale, Sagl)? Vende qualcosa online?
- Quali dati arrivano? Modulo di contatto, newsletter, ordine, account, statistiche (skill `statistik`), mappe o video incorporati, caratteri da server di terzi.
- Dove girano i servizi? Server Albatros (Germania/Finlandia, UE), PostHog (UE), invio di e-mail, fornitori di pagamento (spesso USA).
- Il sito si rivolge anche a persone nell'UE (consegna, prezzi in euro, lingua)?

### 2. Impressum (`/impressum`)

Obbligatorio per tutti quelli che offrono online merci, opere o prestazioni (art. 3 cpv. 1 lett. s LCSl): indicazioni chiare e complete sull'identità e sull'indirizzo di contatto, compresa l'e-mail. Consigliabile anche senza obbligo.

- Nome o ditta (come nel registro di commercio), forma giuridica
- Indirizzo postale (non solo una casella postale)
- Indirizzo e-mail
- se presenti: numero IDI, iscrizione nel registro di commercio, persona responsabile

### 3. Dichiarazione sulla protezione dei dati (`/protezione-dei-dati`)

La legge sulla protezione dei dati riveduta (nLPD, in vigore dal 1° settembre 2023) chiede che tu informi quando raccogli dati personali (art. 19 LPD). Succede già con un modulo di contatto o con statistiche che registrano gli indirizzi IP. Contenuto:

1. Chi è responsabile, con contatto
2. Quali dati, per cosa (per ogni scopo: contatto, newsletter, ordine, statistiche)
3. A chi vanno (hosting, statistiche, invio di e-mail, pagamento), con il paese. Per i paesi senza una protezione dei dati adeguata: quali garanzie valgono
4. Per quanto tempo restano
5. Diritti dei visitatori: accesso (art. 25 LPD), rettifica, cancellazione, e come esercitarli
6. Data dell'ultima modifica

Se il sito si rivolge anche a persone nell'UE, può valere in più il RGPD (GDPR) (art. 3 par. 2 RGPD). Allora indica anche la base giuridica per ogni scopo.

### 4. Cookie e statistiche (Cookies und Statistik)

- Svizzera: chi imposta cookie deve informare sul trattamento e sul suo scopo e dire come rifiutarli (art. 45c LTC). Di solito basta un'indicazione nella dichiarazione sulla protezione dei dati.
- Pubblico dell'UE: per i cookie non necessari (statistiche, pubblicità) serve prima un consenso. Allora un banner con un «Rifiuta» di pari valore.
- La cosa più semplice: nessun cookie inutile. Le statistiche dello skill `statistik` funzionano senza cookie. Integra i caratteri in locale invece che da server di terzi.

### 5. Accesso e ingresso

Vale quando il sito ha un accesso (ricetta `mitglieder`, blocco `eingang`, skill `bausteine`).

- **Il cookie dell'accesso** (`__Host-sitzung`, vale 5 giorni, illeggibile per gli script nel browser) serve perché una persona resti connessa. L'art. 45c LTC chiede anche per questo l'informazione: che viene impostato, a che scopo, e come rifiutarlo (senza questo cookie l'accesso non funziona). Basta una frase nella dichiarazione sulla protezione dei dati. Per questo cookie non servono né banner né consenso, nemmeno per i visitatori dell'UE: lì i cookie strettamente necessari sono esenti dal consenso (art. 5 par. 3 della direttiva ePrivacy).
- **Registri:** PocketBase registra ogni accesso con l'indirizzo IP e cancella le voci dopo 5 giorni (amministrazione → Settings → Logs). L'ingresso scrive una riga per accesso, senza indirizzo IP, senza cookie e senza identificativo della persona. Entrambi vanno, con il termine, nella dichiarazione sulla protezione dei dati.
- **Termini:** un account resta finché la persona o l'amministrazione lo cancella. Le richieste che l'amministrazione non abilita, le cancella al più tardi dopo 30 giorni (proposta; da annotare in `docs/betrieb.md`). L'accesso termina dopo 5 giorni o uscendo su questo dispositivo.
- **Frase per la dichiarazione sulla protezione dei dati** della persona (da adattare, non riprendere nulla che sul sito non c'è):
  > Area membri: per l'accesso salviamo nome, indirizzo e-mail, password (solo come impronta illeggibile) e se l'amministrazione ha abilitato l'account, finché l'account viene cancellato. All'accesso impostiamo un cookie necessario («__Host-sitzung», 5 giorni) perché l'accesso resti attivo; senza questo cookie l'accesso non è possibile. Il nostro server registra gli accessi con l'indirizzo IP per 5 giorni.

### 6. E-mail pubblicitarie

Pubblicità per e-mail solo con consenso preventivo (art. 3 cpv. 1 lett. o LCSl). Eccezione: la propria clientela, a cui al momento dell'acquisto è stata indicata la possibilità di rifiutare, per offerte proprie simili. In ogni e-mail: il mittente giusto e un link di disiscrizione semplice e gratuito. Iscrizione alla newsletter con e-mail di conferma (double opt-in), così il consenso è dimostrato.

### 7. Immagini e testi

Solo immagini proprie o con licenza. Persone riconoscibili solo con il loro consenso. Vedi lo skill `inhalte`.

### 8. Costruire le pagine e collegarle

Impressum e protezione dei dati come pagine a sé, raggiungibili da ogni pagina nel piè di pagina, agli indirizzi `/impressum` e `/protezione-dei-dati`, come nella bozza (skill `entwurf`); `pruefen.mjs` le trova con questi nomi. Una voce nel diario di bordo (skill `git-logbuch`); online vanno con tutto il sito alla messa online (skill `lancieren`). In `docs/plan.md` annota: «Verificare la dichiarazione sulla protezione dei dati quando si aggiunge un nuovo servizio.»

## Verifica la missione

`mission_pruefen` con `webseite-07-recht-ch`. La verifica controlla sull'isola se il progetto è almeno al passo «Prüfung» (verifica; skill `webseite-bauen`, passo 5): impressum e protezione dei dati girano sul computer e sono collegati nel piè di ogni pagina. Dall'esterno li controlli tutti e due alla messa online (`pruefen.mjs --live`, skill `lancieren`).

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «targhetta del campanello e regolamento della casa», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
