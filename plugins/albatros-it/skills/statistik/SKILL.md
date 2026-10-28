---
name: statistik
description: "Installa con una persona senza conoscenze tecniche statistiche rispettose della privacy per il suo sito web, con PostHog. Prima un piccolo piano degli eventi (quali tacche contiamo, e quando esattamente), poi l'integrazione, un evento obiettivo come «richiesta inviata», escludere le proprie visite e confrontare con le richieste vere. Usa lo skill con «statistiche», «contare i visitatori», «quante persone vengono sul mio sito?», «PostHog», «Google Analytics», «tracking», «conversion», «misurare un evento», «da dove arrivano i miei visitatori?»."
---

# Statistiche: il foglio delle tacche alla porta del negozio

## L'immagine

Una negoziante tiene alla porta un foglio delle tacche. Conta solo quello che prima ha scritto sulla lista, e fa una tacca solo quando è successo davvero: il cliente ha pagato, non ha solo tirato fuori il portamonete. I volti non se li ricorda.

Proprio così devono lavorare le statistiche del tuo sito web: poche tacche con un nome chiaro, contate nel momento giusto, senza salvare sui visitatori più del necessario. Nelle statistiche una tacca si chiama **evento**.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Dai del tu, niente gergo tecnico. «Evento» solo dopo l'immagine del foglio delle tacche.
- La protezione dei dati non è un'appendice. Ogni impostazione che salva di più sulle persone ha bisogno di un motivo e di una frase nella dichiarazione sulla protezione dei dati (skill `recht-ch`).
- L'account PostHog lo crea la persona stessa nel browser. La chiave del progetto (inizia con `phc_`) può dartela: è pensata per il sito web ed è pubblica. Le chiavi API personali (`phx_`) non vanno mai nel codice.

## Procedura

### 1. Prima la lista, poi l'integrazione

Crea con la persona `docs/statistik.md`. Per cominciare basta un evento obiettivo: l'azione che per lei conta (da `docs/plan.md`, «Da cosa capiamo il successo»).

```markdown
# Piano degli eventi

| Evento | conta quando | Dati obbligatori |
|---|---|---|
| `$pageview` | automaticamente a ogni visualizzazione di pagina | – |
| `generate_lead` | modulo inviato con successo (il server ha confermato) | `form` (quale modulo) |
| `sign_up` | iscrizione alla newsletter confermata | `location` (dove sul sito) |

Visite proprie: filtrate dal <data>
Modifiche: <data> – <cosa è stato rinominato, perché>
```

Regole per i nomi: minuscolo con trattino basso (`generate_lead`), preferire i nomi standard conosciuti (`purchase`, `sign_up`, `generate_lead`), un evento per azione, le varianti come dato (`form: "kontakt"`), mai dare il nome secondo la posizione (`passo_2`).

### 2. Creare il progetto PostHog

La persona si registra su PostHog, sceglie la sede **EU** e crea un progetto. Poi ti dà la chiave del progetto.

### 3. Integrare

Lo snippet d'integrazione attuale dalle istruzioni di PostHog («Web snippet») nell'intestazione di ogni pagina, con queste impostazioni:

```js
posthog.init('phc_…', {
  api_host: 'https://eu.i.posthog.com',
  persistence: 'memory',              // niente cookie, niente banner
  person_profiles: 'identified_only', // nessun profilo di visitatori anonimi
})
```

`persistence: 'memory'` significa: ogni visualizzazione di pagina viene contata, ma PostHog non si ricorda di nessuno tramite cookie (quindi niente banner, e niente profili di visitatori anonimi). In cambio i numeri sui «singoli visitatori» sono meno precisi. Verifica nelle istruzioni attuali di PostHog se nel frattempo c'è un'impostazione migliore senza cookie.

### 4. L'evento obiettivo nel momento giusto

Conta solo dopo il successo, non quando si apre il modulo:

```js
// dopo che il server ha confermato il modulo:
posthog.capture('generate_lead', { form: 'kontakt' })
```

Mai inviare come dato nomi, indirizzi e-mail, numeri di telefono o testo libero.

### 5. Escludere le proprie visite

In PostHog, nelle impostazioni del progetto, attiva «Filter out internal and test users» (escludere utenti interni e di test) e imposta un filtro (per esempio il proprio indirizzo IP). Scrivi la data in `docs/statistik.md`.

### 6. Verificare

1. Diario di bordo e nastro trasportatore (skill `git-logbuch`, `pipeline`).
2. Apri il sito, invia una volta il modulo come prova.
3. In PostHog alla voce «Activity» o «Live events»: compaiono `$pageview` e `generate_lead` con il dato `form`?
4. Dopo una settimana: il numero di `generate_lead` corrisponde più o meno alle richieste vere nella casella di posta? Se no: l'evento scatta all'apertura invece che al successo? Vengono contati anche i test?

## Trappole

- L'evento scatta al caricamento invece che al successo: i tentativi diventano successi.
- Troppi eventi in una volta: nessuno li guarda. Meglio tre che sono giusti.
- Nome cambiato, ma l'analisi non è stata adattata: sembra un crollo.
- Dichiarazione sulla protezione dei dati dimenticata: PostHog deve esserci, con scopo e sede (skill `recht-ch`).

## Verifica la missione

`mission_pruefen` con `webseite-07-statistik`. La verifica controlla se `~/projekt/docs/statistik.md` esiste e se il sito contiene l'integrazione di PostHog.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «il foglio delle tacche alla porta del negozio», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
