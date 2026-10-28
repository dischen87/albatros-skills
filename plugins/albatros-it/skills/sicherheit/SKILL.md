---
name: sicherheit
description: "Con una persona senza conoscenze tecniche rende sicuro il suo progetto, con l'immagine della casa con mazzo di chiavi, cassaforte, finestre e serrature: i segreti mai nel diario di bordo (Git), ma in .env sul server (e, se il nastro trasportatore ne ha bisogno, nella cassaforte del porto); chiavi pubblicate per sbaglio da rigenerare subito; una chiave per ogni scopo; aperte solo le porte necessarie; aggiornamenti. Usa lo skill con «sicurezza», «password nel codice», «chiave API», «API key», «.env», «secret», «ho caricato una chiave su GitHub», «il mio sito è sicuro?», «mi hanno hackerato», «aggiornamenti», «firewall», e prima che un nuovo segreto entri nel progetto."
---

# Sicurezza: la chiave non sotto lo zerbino

## L'immagine

Una casa è sicura quanto il suo momento più distratto. Gli scassinatori non cercano la serratura più robusta, ma la chiave sotto lo zerbino e la finestra della cantina lasciata aperta.

- **I segreti** (password, chiavi API, chiavi private) sono chiavi. Vanno nella **cassaforte**, mai sotto lo zerbino.
- Il **diario di bordo** (Git) non è uno zerbino, ma una vetrina: quello che c'è scritto una volta resta visibile in tutte le voci vecchie.
- **Porte e finestre** sono gli accessi aperti al server. Solo quante ne servono.
- **Gli aggiornamenti** sono serrature nuove, quando per quelle vecchie si è scoperto un trucco.

**Come usi l'immagine:** dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu, con calma ma in modo chiaro. Se un segreto è diventato pubblico, vale: agire subito, senza dare colpe.
- I segreti non li leggi mai ad alta voce, non li mostri mai e non li scrivi mai nella chat, nelle note dei commit o nei log.
- Le chiavi pubbliche (p. es. `phc_…` per le statistiche o `pk_…` da Stripe) non sono segreti. Quelle segrete si riconoscono spesso dall'inizio: `sk_…`, `ghp_…`, `-----BEGIN … PRIVATE KEY-----`.

## Procedura

**Con Light** è pubblico tutto quello che Albatros mette in vetrina, anche quello che non è collegato da nessuna parte: la cartella `seite/`. Se manca, è `public/` o addirittura tutto il repo con `docs/`. Per questo la pagina resta in `seite/`. Lì dentro non va nessun segreto. I passi 1 e 2 valgono comunque. Tutto quello che riguarda server, `.env` e porte vale solo con Pilot.

### 1. C'è già qualcosa sotto lo zerbino?

```bash
git ls-files | grep -E '(^|/)\.env(\..+)?$' | grep -v '\.env\.example$'
git log -p --all | grep -nE -- '-----BEGIN [A-Z ]*PRIVATE KEY-----|sk_live_|sk_test_|ghp_[A-Za-z0-9]{20,}|password *[=:]' | head
```

Se trovi qualcosa: **rigeneralo subito presso il fornitore** (rotazione) e rendi non valido quello vecchio. Cancellarlo dal repo non basta, la vecchia voce resta nel diario di bordo e nel porto. Solo dopo si fa ordine.

### 2. La cassaforte

- **`.gitignore`** contiene `.env`, `.env.*` e `!.env.example`. La persona controlla con te.
- **`.env.example`** nel repo mostra quali segreti servono, con valori vuoti.
- **Sul server** i valori veri stanno in `~/projekt/.env`, leggibili solo da te:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && umask 077 && touch .env && chmod 600 .env'
  ```
  I valori li inserisce la persona stessa (`nano ~/projekt/.env`), così non finiscono nella tua cronologia.
- **Per il nastro trasportatore:** gira sul tuo server, e la tua pagina legge i suoi segreti dal `.env`. Se un passo nel workflow ne ha comunque bisogno, va nella cassaforte del porto (nel repo alla voce Impostazioni, Actions, Secrets) e nel workflow arriva al comando solo tramite `env:` (skill `pipeline`).
- **Nel Dockerfile:** un `.dockerignore` con `.env`, `.git`, `node_modules`. Altrimenti il `.env` viene impacchettato durante la costruzione.

### 3. Una chiave per ogni scopo

La chiave di casa della persona (per server e porto), la chiave di lettura del server per il porto, più avanti sul proprio server la chiave del nastro trasportatore: ognuna separata. Se se ne perde una, si cambia solo quella serratura (nel cockpit o con `schluessel_hinterlegen`).

### 4. Porte e finestre

Su Albatros la piattaforma si occupa della porta di casa (firewall, protezione contro chi tira a indovinare le password). Tu badi alle porte che apri tu stesso:

- In `compose.yaml` verso l'esterno solo il sito web sulla porta 80. Tutto il resto (banca dati, CMS, amministrazione) collegalo solo a `127.0.0.1`, p. es. `"127.0.0.1:5432:5432"`, oppure non pubblicarlo affatto. Altrimenti Docker apre le porte scavalcando ogni firewall.
- Le aree di amministrazione solo tramite un tunnel (skill `cms`).
- Verifica che non venga consegnato niente di interno:
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.env
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.git/config
  ```
  Tutti e due devono dare `404` (o `403`).

### 5. Serrature nuove

- Sul server: `apt list --upgradable` mostra gli aggiornamenti in sospeso. Prima di aggiornamenti più grossi una foto (skill `zurueck-auf-gestern`), poi `sudo apt update && sudo apt upgrade`.
- Nel progetto: `npm audit` (se c'è un `package.json`) mostra le falle note nei componenti.

### 6. Pochi diritti

- I workflow ricevono solo i segreti di cui hanno bisogno. Su GitHub (dopo il trasloco, skill `landung`) in più `permissions: contents: read`.
- Non far girare i programmi nel container come root, se il modello lo permette (`USER` nel Dockerfile).
- Ogni persona che collabora riceve un accesso suo, non uno condiviso.

### 7. Verifica la missione

Diario di bordo e nastro trasportatore (skill `git-logbuch`, `pipeline`), poi `mission_pruefen` con `flugschule-07-sicherheit`. La verifica controlla se `.gitignore` nel progetto contiene `.env` (con Pilot in `~/projekt` sul server, con Light nel porto).

## Se è successo qualcosa

1. Rigenera il segreto presso il fornitore, blocca quello vecchio.
2. Verifica se è stato usato in modo abusivo (fatture, accessi, liste di invio presso il fornitore).
3. Riporta il server a una foto di prima dell'incidente, se è stato modificato (skill `zurueck-auf-gestern`).
4. Se riguarda dati di altre persone: informa Albatros tramite `coach_fragen`. In caso di rischio elevato per le persone interessate, la legge sulla protezione dei dati richiede una notifica all'IFPDT (art. 24 LPD). Nessuna consulenza legale.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «la chiave non sotto lo zerbino», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
