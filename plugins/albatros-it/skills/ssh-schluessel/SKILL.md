---
name: ssh-schluessel
description: "Spiega la chiave SSH a una persona senza conoscenze con l'immagine della chiave di casa e della serratura, crea la coppia di chiavi in locale sul suo computer, deposita da Albatros solo la parte pubblica e prova la prima visita sul server. Usa lo skill con «chiave SSH», «ssh-keygen», «non riesco a entrare nel mio server», «Permission denied (publickey)», «cos'è una public key», «cos'è una chiave pubblica», «computer nuovo», «ho cambiato computer», e come passo 4 di /albatros-it:start."
---

# Chiave SSH: chiave di casa e serratura

## L'immagine

Una chiave SSH è una coppia:

- **La chiave di casa** (chiave privata) resta sempre con te, sul tuo computer. Nessun altro la riceve, nemmeno Albatros, nemmeno io.
- **La serratura** (chiave pubblica) la puoi far montare dappertutto. Chi vede la serratura non può aprire niente.

Montiamo la tua serratura nella porta del tuo server. Dopo entra solo chi ha la chiave di casa giusta: tu. Una password non ti serve.

Spiega l'immagine prima di eseguire un comando. Le parole «chiave privata» e «chiave pubblica» le dici solo dopo, e poi sempre insieme all'immagine.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

## Regole ferree

- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- La chiave privata non lascia mai il computer. Non la leggi, non la mostri, non la copi e non la carichi da nessuna parte, nemmeno se te lo chiedono. Se la persona vuole copiarla nella chat: fermala gentilmente e spiega perché.
- Si carica solo il file che finisce con `.pub` (pub come public, pubblico). Prima di caricarlo verifica che il contenuto inizi con `ssh-ed25519 ` e sia una sola riga.
- Non sovrascrivi mai chiavi esistenti. `ssh-keygen` chiede prima di sovrascrivere, ma tu scegli comunque un nome di file tuo.

## Procedura

### 1. Esiste già una chiave Albatros?

```bash
ls ~/.ssh/albatros.pub 2>/dev/null && echo "schon da" || echo "noch keiner"
```

Se c'è già, usala e vai al passo 3.

### 2. Creare la chiave (in locale)

Prima di': «Adesso il tuo computer fabbrica una nuova chiave di casa e la serratura che le corrisponde. Tutte e due finiscono nella cartella nascosta `.ssh` nella tua cartella utente.»

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "albatros" -f ~/.ssh/albatros -N ""
```

- `-t ed25519`: un tipo di chiave moderno e sicuro.
- `-f ~/.ssh/albatros`: il nome. Nascono due file: `albatros` (chiave di casa) e `albatros.pub` (serratura).
- `-N ""`: senza password aggiuntiva. Così posso eseguire io il comando per te. Chi vuole una serratura in più sul portachiavi, più tardi digita da sé in una propria finestra del terminale `ssh-keygen -p -f ~/.ssh/albatros` e sceglie una passphrase. Quella non la digiti mai nella chat.

Windows: lo stesso comando funziona in PowerShell, solo senza la riga `mkdir`/`chmod`. Lì la cartella si chiama `$HOME\.ssh`.

### 3. Caricare solo la serratura

```bash
cat ~/.ssh/albatros.pub
```

Mostra la riga alla persona e di': «Questa è la tua serratura. Chiunque la può vedere.» Passa esattamente questa riga allo strumento Albatros `schluessel_hinterlegen`. Se la persona vuole caricare la sua serratura, lo fai subito, senza chiedere di nuovo: depositare una serratura non è pericoloso.

Se lo strumento manca (Albatros non ancora collegato): segui prima il passo 1 dello skill `start`. In alternativa la persona può incollare la riga nel cockpit su albatros.build alla voce «Schlüssel» (chiavi).

### 4. Dire al computer quale chiave va con quale porta

Chiedi se puoi aggiungere una voce in `~/.ssh/config`. Immagine: un biglietto sul portachiavi «questa chiave è per aufwind.sh». Solo aggiungere, non cancellare niente:

```bash
cat >> ~/.ssh/config <<'EOF'

Host aufwind.sh
  IdentityFile ~/.ssh/albatros
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

### 5. Prima visita

**Con Light** non c'è un server da visitare. Prova la serratura al porto: `ssh -T git@aufwind.sh`. Se saluta la persona con il suo nome («successfully authenticated»), la chiave va bene. Poi avanti con lo skill `git-logbuch`. Il resto di questo passo e la missione `flugschule-02-ssh-schluessel` sono per Pilot.

**Con Pilot:** Lascia che la persona digiti da sé questo comando (in Claude Code con `!` davanti):

```bash
ssh {name}@aufwind.sh
```

`{name}` è il nome del suo server (è indicato in `konto_status`). La primissima volta il computer chiede: «Are you sure you want to continue connecting?» Immagine: il server mostra la sua carta d'identità. L'impronta digitale è nel cockpit. Se corrisponde, la persona digita `yes`.

Dentro: `echo "Ich war hier" > ~/hallo.txt`, poi `exit`. È la sua prima impronta sul proprio server.

Se devi provare tu (il tuo terminale non è interattivo):

```bash
ssh -o StrictHostKeyChecking=accept-new {name}@aufwind.sh 'echo "Ich war hier" > ~/hallo.txt && cat ~/hallo.txt'
```

### 6. Verifica la missione

`mission_pruefen` con `flugschule-02-ssh-schluessel`. La verifica guarda se `~/hallo.txt` si trova sul server.

## Se qualcosa si inceppa

- **`Permission denied (publickey)`**: La serratura non va con la porta. Verifica in ordine: il nome del server è giusto? La serratura è stata caricata (`konto_status`)? La voce in `~/.ssh/config` c'è? Prova con `ssh -v {name}@aufwind.sh` e cerca la riga «Offering public key».
- **«Dieser Schlüssel gehört schon zu einem anderen Konto» (questa chiave appartiene già a un altro account):** Una serratura appartiene a un solo account Albatros, come da GitHub. Per un secondo account crea una chiave propria (`ssh-keygen -t ed25519 -C "albatros-zwei" -f ~/.ssh/albatros-zwei -N ""`) e in `~/.ssh/config` una voce propria: `Host aufwind-zwei` con `HostName aufwind.sh`, `IdentityFile ~/.ssh/albatros-zwei` e `IdentitiesOnly yes`. Per questo account l'indirizzo diventa `aufwind-zwei` invece di `aufwind.sh`, per esempio `git@aufwind-zwei:<name>/projekt.git`.
- **Computer nuovo:** nuova chiave di casa sul computer nuovo, caricare in più la serratura. Non copiare mai la vecchia chiave di casa per e-mail o su una chiavetta.
- **Computer perso o rubato:** Togliere subito la vecchia serratura nel cockpit. È come cambiare il cilindro della serratura.
- **`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED`**: La carta d'identità del server è diversa dall'ultima volta. Non ignorarlo semplicemente. Confronta l'impronta digitale nel cockpit. Solo se corrisponde, togli la vecchia riga con `ssh-keygen -R aufwind.sh`.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «chiave di casa e serratura», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
