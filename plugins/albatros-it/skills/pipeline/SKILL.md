---
name: pipeline
description: "Spiega la CI/CD a una persona senza conoscenze tecniche con l'immagine del nastro trasportatore con controllo qualità e lo configura: un workflow nel porto di Albatros (Forgejo, code.aufwind.sh) parte a ogni push su main. L'operaio (runner) sul proprio server costruisce la pagina, la consegna con un controllo di salute, la verifica dall'indirizzo pubblico e altrimenti torna all'ultima versione buona. Usa lo skill con «pipeline», «CI/CD», «GitHub Actions», «Forgejo Actions», «workflow», «runner», «pubblicare in automatico», «fare il deploy», «come arriva la mia modifica sul server?», «il nastro è rosso», «il deploy non è andato a buon fine», «deploy fallito»."
---

# Pipeline: il nastro trasportatore con controllo qualità

## L'immagine

In una fabbrica nessuno porta ogni pezzo a mano fino al camion. C'è un nastro trasportatore:

1. **Stazione di verifica:** il pezzo viene costruito. Se non riesce, il nastro si ferma e non esce niente.
2. **Consegna:** il pezzo nuovo viene montato e verificato subito: funziona? Se no, torna il pezzo vecchio.
3. **Controllo finale:** dalla strada si guarda se la pagina risponde.

Da te il nastro parte appena mandi una voce al porto (skill `git-logbuch`). L'operaio al nastro abita da te: gira sul tuo server e lavora solo lì. Il termine tecnico è **CI/CD**, il nastro si chiama **workflow**, l'operaio **runner**.

**Come usi l'immagine:** dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Come parli

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu. Percorri con la persona il file del workflow stazione per stazione, prima che giri.
- Il nastro trasportatore non ha bisogno di nessuna chiave e di nessun segreto della persona: l'operaio abita già sul suo server. La sua chiave di casa non va mai nel nastro trasportatore.
- Se il nastro è rosso: elimina la causa, non spegnere mai la verifica.

## Procedura

### 1. Cosa c'è già

**Con Light** non c'è nessun nastro trasportatore: dopo ogni push Albatros mette in vetrina direttamente la cartella `seite/` da `main`, senza costruire e senza verifica. Spiega comunque l'immagine. Il nastro con controllo qualità fa parte di Pilot (`upgrade_link`, livello `pilot`). Il file `deploy.yml` del modello dorme con Light. Al passaggio a Pilot, Albatros accende il nastro e lo fa girare subito una volta, così è il proprio server a consegnare la pagina. La missione `flugschule-05-pipeline` fa parte di Pilot.

**Con Pilot:** `konto_status` indica il nome del server, l'indirizzo del porto (`git@aufwind.sh:{name}/projekt.git`) e se l'operaio è pronto. Non chiederlo alla persona. Il modello di Albatros porta già con sé `.github/workflows/deploy.yml`, `compose.yaml` e `Dockerfile`: leggili con la persona e confrontali con il nucleo qui sotto. Se mancano li crei tu, anche se la cartella è ancora vuota, e poi dici cosa manca ancora (diario di bordo nel porto, contenuto della pagina).

Il container del server web si chiama `webseite` e nel server ascolta sulla porta 80. Albatros indirizza lì `https://{name}.aufwind.sh`. Su un server appena creato la pagina di benvenuto (servizio `willkommen`) occupa la porta 80. Il nastro trasportatore la spegne prima del primo avvio. Se una volta avvii a mano, prima `sudo systemctl disable --now willkommen`.

`compose.yaml` (nucleo):

```yaml
services:
  webseite:
    container_name: webseite
    build: .
    restart: unless-stopped
    ports:
      - "80:80"
    healthcheck:                         # «läuft» heisst noch nicht «funktioniert»
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/"]
      interval: 10s
      retries: 6
```

### 2. Il file del workflow

`.github/workflows/deploy.yml` (il porto legge questa cartella come GitHub):

```yaml
name: Fliessband
on:
  push:
    branches: [main]
  workflow_dispatch:                    # Knopf «Run workflow» für einen Lauf von Hand

jobs:
  fliessband:
    runs-on: albatros                   # der Arbeiter auf deinem eigenen Server, er macht einen Auftrag nach dem anderen
    defaults:
      run:
        shell: bash
    env:
      SHA: ${{ github.sha }}
      SEITE: https://${{ github.repository_owner }}.aufwind.sh
    steps:
      - name: Bauen und ausliefern, notfalls zurück
        run: |
          set -euo pipefail
          cd ~/projekt                  # hier wohnt deine Seite, der Stand kommt immer aus dem Logbuch
          ALT=$(git rev-parse HEAD)
          git fetch -q origin main && git reset -q --hard "$SHA"
          # Station 1: bauen. Klappt das nicht, bleibt die alte Seite online.
          if ! docker compose build; then
            git reset -q --hard "$ALT"
            echo "Bau fehlgeschlagen, die alte Seite bleibt online" >&2
            exit 1
          fi
          # Station 2: ausliefern, mit dem Gesundheitscheck aus compose.yaml
          sudo systemctl disable --now willkommen 2>/dev/null || true   # Begrüssungsseite gibt Port 80 frei
          if ! docker compose up -d --wait --wait-timeout 120; then
            echo "Neue Version ist nicht gesund, zurück auf $ALT" >&2
            docker compose logs --tail 30 >&2 || true
            git reset -q --hard "$ALT"
            docker compose up -d --build --wait --wait-timeout 120 || true
            exit 1
          fi
          echo "läuft: $SHA"
      - name: Endkontrolle über die öffentliche Adresse
        run: |
          for i in 1 2 3 4 5; do
            code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$SEITE" || true)
            [ "$code" = 200 ] && exit 0
            sleep 3
          done
          echo "$SEITE antwortet $code statt 200" >&2
          exit 1
```

Spiega stazione per stazione. Sul server non si cambia niente a mano: lo stato viene sempre dal diario di bordo. Il file `.env` sul server resta intatto (skill `sicherheit`). Se un passo ha comunque bisogno di un segreto, questo va nella cassaforte del porto (nel repo alla voce Impostazioni, Actions, Secrets) e nel workflow arriva al comando solo tramite `env:`, mai direttamente come `${{ secrets.… }}` in una riga `run`.

### 3. Il primo giro

1. Voce nel diario di bordo, push (skill `git-logbuch`).
2. Guardare nel browser: `https://code.aufwind.sh/{name}/projekt/actions`.
3. Verde: apri la pagina nel browser, la modifica c'è.

### 4. Vedere il controllo all'opera

La persona inserisce apposta un errore che fa fallire la costruzione (p. es. un errore di battitura nel `Dockerfile`) e fa il push. Il nastro diventa rosso, la vecchia pagina resta online. Togliere l'errore, push, verde. Adesso sa che il nastro la protegge.

### 5. Verifica la missione

`mission_pruefen` con `flugschule-05-pipeline`. La verifica controlla se l'ultimo giro di `deploy.yml` nel porto è verde, se il container `webseite` gira e se la pagina risponde.

## Quando il nastro è rosso

- **Quale stazione?** Nel browser, alla voce «Actions», apri il giro rosso. La persona copia le ultime righe nella chat. Sul server guardi tu stesso: `ssh {name}@aufwind.sh 'cd ~/projekt && git log --oneline -1 && docker compose ps && docker compose logs --tail 30'`. Leggete insieme e nomina la causa in una frase.
- **Il giro aspetta e non parte:** nessun operaio lo prende in carico. Nel file c'è esattamente `runs-on: albatros`? `konto_status` mostra se l'operaio è pronto. Altrimenti `coach_fragen`.
- **`Permission denied` con `git fetch`:** il server non ha il permesso di leggere il porto. Questo lo configura Albatros, quindi `coach_fragen`.
- **Costruzione rossa:** errore nel `Dockerfile` o nella pagina. La vecchia pagina resta online.
- **Consegna rossa («nicht gesund», non in salute):** il container parte ma non risponde. Le righe di `docker compose logs` nel giro dicono perché. La vecchia versione gira di nuovo.
- **Controllo finale rosso, il resto verde:** la pagina gira nel server ma non tramite l'indirizzo. Verifica la porta del container (`docker ps`), poi skill `zurueck-auf-gestern`.
- **Mai** togliere la verifica per far diventare verde il nastro.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «il nastro trasportatore con controllo qualità», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
