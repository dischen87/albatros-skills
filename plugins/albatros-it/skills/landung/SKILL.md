---
name: landung
description: "Pianifica e accompagna il trasloco di un progetto da Albatros a un server proprio, spiegato con l'immagine del trasloco in una casa propria: lista del trasloco, affittare e configurare il server (SSH solo con chiave, firewall, aggiornamenti, Caddy per HTTPS), portare il diario di bordo su GitHub, spostare lì il nastro trasportatore sulla nuova destinazione via SSH con una chiave propria, portare con sé dati e segreti, testare, cambiare l'indirizzo nel DNS oppure trasferire un dominio comprato tramite Albatros a un nuovo registrar con l'auth-code di domain_mitnehmen, occuparsi da sé dei backup. Usa lo skill con «server proprio», «traslocare», «andare via da Albatros», «Hetzner», «VPS», «hosting in proprio», «ospitare da solo», «atterraggio», «cosa mi serve per un server tutto mio?»."
---

# Atterraggio: trasloco in una casa propria

## L'immagine

Da Albatros abiti in un appartamento con il custode: chiude il portone, cambia le serrature e ogni notte fotografa l'appartamento. In una casa propria lo fai tu.

Il trasloco non è una costruzione nuova. Il tuo progetto è già imballato in scatole che vanno bene dappertutto: il diario di bordo (Git), le istruzioni di montaggio (`Dockerfile`, `compose.yaml`) e il nastro trasportatore (workflow). Aggiungi il resto, traslochi e comunichi il nuovo indirizzo. Solo il porto appartiene alla casa di Albatros: il tuo diario di bordo riceve un nuovo porto, per esempio GitHub.

**Come usi l'immagine:** dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu. Sii onesto sull'impegno: un server proprio spesso fa risparmiare soldi, ma costa tempo per la manutenzione.
- Affittare e pagare il server lo fa la persona stessa presso il fornitore.
- La vecchia casa si spegne solo quando quella nuova funziona in modo dimostrato.

## Procedura

### 1. Il trasloco conviene?

Ripassa brevemente con la persona (vedi skill `kosten`): il progetto ha bisogno di più di quanto offre Albatros? Vuole avere tutto in mano sua? Ha ogni mese un'ora o due per la manutenzione? Se no, restare è un'ottima decisione.

**Con Light** il trasloco è piccolo: la cartella `seite/` funziona presso qualsiasi fornitore di pagine statiche. Portare il diario di bordo su GitHub (passo 4, punti 1 e 2) e lì accendere la pagina, per esempio con GitHub Pages. Server, nastro trasportatore e trasloco del dominio cadono, la lista del trasloco resta.

### 2. Lista del trasloco

`docs/landung.md` nel progetto:

```markdown
# Trasloco su un server proprio

## Scatole
- [ ] Diario di bordo: tutto mandato al porto (`git status` pulito)
- [ ] Diario di bordo nel nuovo porto (p. es. GitHub), tutte le voci arrivate
- [ ] Segreti: lista dei nomi da `.env.example` (mai i valori qui!)
- [ ] Dati: banca dati, file caricati (cartella: …)
- [ ] Impostazioni: domini, voci e-mail nel DNS (non toccarle), cronjob
- [ ] Dominio comprato tramite Albatros? Allora con l'auth-code (`domain_mitnehmen`) a un nuovo registrar

## Cosa mi assumo io
- [ ] Aggiornamenti (automatici, solo quelli di sicurezza)
- [ ] Backup (ogni notte, fuori casa, cifrati, prova ogni mese)
- [ ] Sorveglianza (il sito risponde? disco pieno?)

## Procedura e data
…
```

### 3. La casa nuova

1. Affittare un server, Ubuntu 24.04, con almeno tanta memoria di lavoro quanta finora. Al momento dell'ordine registrare la chiave **pubblica** della persona.
2. Configurare con uno script che si può far girare più volte senza pericolo (come root, prima leggerlo, poi farlo girare):
   - aggiornamenti, Docker dalla fonte ufficiale
   - utente `deploy` con la tua serratura, cartella `~/projekt`
   - SSH solo con chiave: `PasswordAuthentication no` in `/etc/ssh/sshd_config.d/10-haerten.conf`, prima verificare con `sshd -t`
   - firewall: prima `ufw allow 22/tcp`, `80/tcp`, `443`, solo dopo `ufw enable` (altrimenti ti chiudi fuori). Tieni aperta una sessione SSH come corda di salvataggio.
   - `fail2ban`, aggiornamenti di sicurezza automatici (`unattended-upgrades`)
   - limiti per i log, così il disco non si riempie
3. **Caddy** come portinaio davanti al sito web: prende da solo il certificato per HTTPS, appena l'indirizzo punta al server. Va come servizio a sé in `compose.yaml`, e il sito web stesso si collega poi solo a `127.0.0.1`. Un errore nel `Caddyfile` blocca tutto: prima di ogni ricaricamento `caddy validate`, dopo verifica dall'esterno.

### 4. Portare con sé diario di bordo e nastro trasportatore

Su Albatros l'operaio del nastro trasportatore abita in casa. Nella casa propria subentra un operaio di GitHub: non costruisce lui stesso, ma suona al nuovo server con una chiave propria e lo fa consegnare.

1. **Nuovo porto:** la persona crea lei stessa un account su github.com. Poi installare `gh` (Mac: `brew install gh`) e `gh auth login`, l'accesso avviene nel browser.
2. **Traslocare il diario di bordo:**
   ```bash
   git remote rename origin albatros
   gh repo create <nome-progetto> --private --source . --remote origin --push
   ```
   Il vecchio porto resta raggiungibile come `albatros` finché non te ne vai.
3. **Chiave di lettura per il nuovo server:** prende lui stesso il diario di bordo, solo in lettura. La sua chiave di casa resta sul server, a GitHub va solo la serratura:
   ```bash
   ssh deploy@<nuovo-indirizzo> 'ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C eigener-server'
   ssh deploy@<nuovo-indirizzo> 'cat ~/.ssh/id_ed25519.pub' > server-schloss.pub
   gh repo deploy-key add server-schloss.pub --title "eigener-server"   # solo lettura, è l'impostazione standard
   rm server-schloss.pub
   ssh deploy@<nuovo-indirizzo> 'ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts && git clone git@github.com:<utente>/<nome-progetto>.git ~/projekt'
   ```
   Confronta l'impronta digitale di github.com con quella su docs.github.com.
4. **Una chiave propria per il nastro trasportatore**, mai la chiave di casa della persona. Così si può bloccare da sola:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/fliessband -N "" -C fliessband
   ssh deploy@<nuovo-indirizzo> 'cat >> ~/.ssh/authorized_keys' < ~/.ssh/fliessband.pub
   gh secret set DEPLOY_KEY < ~/.ssh/fliessband
   gh secret set DEPLOY_KNOWN_HOSTS --body "$(ssh-keyscan -t ed25519 <nuovo-indirizzo> 2>/dev/null)"
   gh variable set SERVER --body "deploy@<nuovo-indirizzo>"
   gh variable set SEITE_URL --body "https://<domain>"
   ```
   La chiave va direttamente dal file nella cassaforte di GitHub (Secrets), mai nella chat e mai nel diario di bordo. Dopo si può cancellare `~/.ssh/fliessband` dal computer.
5. **Adattare il workflow:** in `.github/workflows/deploy.yml` cambiano l'operaio e la strada verso il server. Il resto rimane:
   ```yaml
   jobs:
     fliessband:
       runs-on: ubuntu-latest              # un operaio di GitHub invece del tuo server
       permissions:
         contents: read                    # meno diritti possibile
       concurrency:
         group: ausliefern
         cancel-in-progress: false         # mai interrompere una consegna in corso
       env:
         ZIEL: ${{ vars.SERVER }}
         SEITE: ${{ vars.SEITE_URL }}
         SHA: ${{ github.sha }}
       steps:
         - name: Schlüssel des Fliessbands einsetzen
           env:
             DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
             DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
           run: |
             [ -n "$DEPLOY_KEY" ] || { echo "::error::Secret DEPLOY_KEY fehlt"; exit 1; }
             install -d -m 700 ~/.ssh
             printf '%s\n' "$DEPLOY_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519
             printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
         - name: Bauen und ausliefern, notfalls zurück
           run: |
             ssh "$ZIEL" "SHA=$SHA bash -s" <<'EOF'
             # qui il blocco della versione Albatros, da «set -euo pipefail» fino a «echo "läuft: $SHA"», senza la riga con willkommen
             EOF
         - name: Endkontrolle von aussen
           run: |
             # invariato dalla versione Albatros
   ```
   I segreti arrivano ai comandi solo tramite `env:`, mai direttamente come `${{ secrets.… }}` in una riga `run`. Poi `gh workflow run deploy.yml` e `gh run watch`. Deve diventare verde.

### 5. Portare con sé dati e segreti

- `.env` direttamente da server a server o passando dal proprio computer con `scp`, mai tramite Git.
- Banca dati: salvarla su Albatros (p. es. `sqlite3 app.sqlite ".backup kopie.sqlite"` o `pg_dump`), ripristinarla sul nuovo server.
- I file caricati con `rsync -a`.

### 6. Cambiare l'indirizzo

Prima testa tramite l'indirizzo del nuovo server, senza cambiare l'elenco telefonico: `curl --resolve <domain>:443:<nuovo-ip> https://<domain>/`. Poi dipende da dove è affittato l'indirizzo.

**Comprato tramite Albatros** (`konto_status` lo mostra alla voce «Eigene Domains», domini propri): l'elenco telefonico per questo indirizzo lo tiene Albatros. L'indirizzo trasloca con te presso un registrar scelto dalla persona:

1. La persona crea lei stessa un account presso il nuovo registrar.
2. Solo con il suo sì chiami `domain_mitnehmen`. Da quel momento Albatros non rinnova più l'indirizzo. Fino al trasloco continua a puntare al server Albatros.
3. Lo strumento dà l'**auth-code**, la chiave per il trasloco dell'indirizzo. Mostralo solo alla persona, mai in un file o nel diario di bordo. Lei lo inserisce presso il nuovo registrar e avvia lì il trasloco (trasferimento). Di solito paga in quel momento un anno di rinnovo. Con `.com` e `.net` spesso un trasloco nei primi 60 giorni dopo l'acquisto non è ancora possibile.
4. Quando il trasloco è concluso, inserisce le voci presso il nuovo registrar: A e AAAA sul nuovo server, `www` e le voci per l'e-mail (MX), se ce n'erano.

**Affittato altrove:**

1. Il giorno prima abbassare la validità (TTL) delle voci a 300 secondi. Così il cambio va più veloce.
2. Voce A e AAAA sul nuovo server. Da Albatros per questo non devi disdire niente.

Dopo verifica: `https://<domain>` risponde, `www` reindirizza, il simbolo del lucchetto c'è.

### 7. Solo allora andarsene

Osservare per una settimana. Se va tutto, adattare o disdire l'abbonamento ad Albatros (cockpit). Un dominio che la persona ha comprato tramite Albatros trasloca prima (passo 6), altrimenti scade con il suo abbonamento. Le foto (snapshot) da lì in poi non ci sono più: d'ora in avanti contano i backup propri.

### 8. Verifica la missione

`docs/landung.md` nel diario di bordo e con il nastro trasportatore (skill `git-logbuch`, `pipeline`), poi `mission_pruefen` con `flugschule-10-landung`. La verifica controlla se la lista del trasloco `docs/landung.md` si trova nel progetto (con Pilot sul server Albatros, con Light nel porto). La cosa migliore è che la persona scriva la lista mentre abita ancora da Albatros.

## Dove si inciampa

- Nessun certificato: l'indirizzo non punta ancora al nuovo server, oppure la porta 80 è chiusa.
- Le porte di Docker aggirano il firewall: i servizi interni solo su `127.0.0.1`.
- Backup configurati ma mai ripristinati: un backup conta solo quando la prova di ripristino è riuscita.
- Riavvio automatico dopo gli aggiornamenti: solo se dopo tutto riparte da solo.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «trasloco in una casa propria», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
