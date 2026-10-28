# Manuale di bordo di __NAME__

Ti diamo il benvenuto a bordo! Questo è il tuo server. Un server è un computer sempre acceso e sempre collegato a Internet. La tua pagina web continua a girare qui, anche quando il tuo portatile è chiuso.

## Dove sei

- Il tuo server si chiama **__NAME__**.
- La tua pagina: https://__NAME__.__DOMAIN__
- Per entrare: `ssh __NAME__@__DOMAIN__`
- Qui sei l'utente `pilot`. Con `sudo` davanti a un comando puoi fare tutto, come un comandante.
- La tua casa è la cartella `/home/pilot`. Lì c'è anche questo manuale di bordo.

## Cosa c'è già a bordo

- **Docker** impacchetta i programmi in casse (container). Ogni cassa ha con sé tutto ciò che serve al programma. Così i programmi non si disturbano.
- **git** è il tuo diario di bordo per il codice. Ogni voce (commit) registra cosa è cambiato. Puoi sempre tornare a una voce precedente.

## La tua pagina web

Quello che risponde su questo server alla porta 80 lo vede tutto il mondo all'indirizzo https://__NAME__.__DOMAIN__. Del lucchetto nel browser (HTTPS) si occupa Albatros.

All'inizio lì c'è un benvenuto. Tiene libera la porta 80 per te finché arriva la tua pagina. Allora gli fai posto:

```
sudo systemctl disable --now willkommen
```

Il tuo progetto si trova nella cartella `~/projekt`. È una copia del tuo diario di bordo (repository) dal porto di Albatros. Dal tuo portatile mandi le modifiche al porto con `git push`, a `git@__DOMAIN__:__NAME__/projekt.git`, con la tua chiave. Poi il nastro trasportatore costruisce la tua pagina qui sul server e la consegna. Il server va a prendere il tuo diario di bordo con una sua chiave (`~/.ssh/code`), non devi occupartene tu.

## Non puoi rompere niente

Ogni notte Albatros scatta una foto del tuo server. Si chiama snapshot. Le foto degli ultimi 7 giorni restano. Se qualcosa va storto, scegli «Ritorno a ieri» nel cockpit o tramite la tua IA.

Buono a sapersi: quello che hai cambiato dopo la foto poi non c'è più. E nemmeno le foto più recenti di quella scelta.

## Limiti

- Memoria di lavoro (RAM), spazio di archiviazione e potenza di calcolo dipendono dal tuo abbonamento. Se lo spazio si fa stretto, Albatros ti avvisa.
- Spedire e-mail direttamente dal server non funziona, le porte e-mail 25, 465 e 587 sono chiuse. Così nessuno può spedire spam. Per le e-mail usi un servizio come Resend o Brevo tramite la loro API.
- I server degli altri allievi non li raggiungi, e loro non raggiungono il tuo.
- Dall'esterno sono raggiungibili solo SSH (22) e la pagina web (80 e 443).

## La tua chiave

In `~/.ssh/authorized_keys` c'è una riga con `albatros-zugang`. Lasciala: è da lì che entri con `ssh __NAME__@__DOMAIN__`. Una nuova chiave la registri tramite Albatros, nel cockpit o tramite la tua IA.

## Aiuto

Chiedi alla tua IA o al coach nel cockpit. Conosce il tuo server e la tua missione.
