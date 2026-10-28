---
name: server-kennenlernen
description: "Giro del proprio server Albatros per una persona senza conoscenze. Spiega terminale, cartelle, spazio su disco, memoria di lavoro, programmi in esecuzione e il passe-partout sudo con immagini prese da un appartamento. La persona digita da sé i primi comandi. Usa lo skill con «cosa c'è sul mio server?», «come mi muovo nel terminale?», «cos'è una cartella sul server?», «ls cd pwd», «quanto spazio ho?», «cosa sta girando?», «fammi fare un giro del server», e dopo la prima visita SSH riuscita."
---

# Conoscere il server: giro del nuovo appartamento

## L'immagine

Il tuo server è un appartamento in un grande palazzo. Ha una porta sua (la tua serratura SSH), stanze sue (cartelle) e apparecchi suoi (programmi). I vicini non vedono dentro, e tu non vedi da loro.

Il terminale è il citofono: tu dici una frase breve, l'appartamento risponde.

**Come usi l'immagine:** Dilla alla persona nella tua prima risposta, prima di fare domande o mostrare comandi, anche se vuole subito una soluzione.

**Solo con Pilot.** Con Light non c'è un appartamento proprio, solo una vetrina: la pagina dal diario di bordo. Se `konto_status` mostra un altro livello, spiega in breve cosa porta in più un server proprio, e solo se la persona lo desidera prendi il link con `upgrade_link` (livello `pilot`).

## Come parli

- **Non limitarti a chiedere:** Se manca il progetto o un dato, dai comunque i passi concreti o scrivi il file come bozza con le ipotesi segnate (`[Ipotesi: …]`). Chiedi solo alla fine quello che manca.
- Dai del tu, frasi brevi, niente gergo tecnico. Ogni comando riceve prima la sua immagine.
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- La persona digita da sé i comandi di questo giro (in Claude Code con `!` davanti, altrimenti in una propria finestra del terminale dopo `ssh {name}@aufwind.sh`). Tu spieghi cosa arriva, e poi leggi con lei la risposta.
- Al massimo un termine nuovo per passo.

## Il giro

Prima: «Qui non puoi rompere niente per sempre. Ogni notte tutto l'appartamento viene fotografato, e possiamo tornare a ieri.»

| Passo | Comando | Immagine | A cosa fare attenzione |
|---|---|---|---|
| Dove sono? | `pwd` | Il cartello «Voi siete qui» sulla pianta della città | `/home/pilot` è l'ingresso del tuo appartamento, in breve `~` |
| Cosa c'è qui? | `ls -la` | Accendere la luce nella stanza | I file con un punto davanti sono nascosti, p. es. `.ssh` |
| Leggere il libro di benvenuto | `cat BORDBUCH.md` | La cartellina di benvenuto sul tavolo | Qui c'è scritto cosa fa parte dell'appartamento |
| Entrare in una stanza | `cd projekt` e indietro con `cd ~` | Passare da una porta | Se la cartella non c'è ancora: `mkdir projekt` costruisce una stanza nuova |
| Quanto spazio? | `df -h /` | La cantina: quanto è piena? | La colonna «Avail» è lo spazio libero |
| Quanto piano di lavoro? | `free -h` | Il piano della scrivania: quello che sta girando è lì sopra | «available» è libero. Se è quasi pieno, tutto diventa lento |
| Cosa sta girando? | `docker ps` | Quali apparecchi sono attaccati alla presa | I container Docker sono come apparecchi con la spina: si attaccano e si staccano senza aprire il muro |
| Andarsene | `exit` | Chiudere la porta dietro di te | |

## Il passe-partout: sudo

Spiegalo solo quando un comando riporta «Permission denied» o ha bisogno di `sudo`. Immagine: con `sudo` davanti a un comando usi il passe-partout del custode. Con quello si apre ogni porta, anche quella del locale caldaia. Per questo solo quando sai esattamente cosa fa il comando. Tu (l'agente) non usi mai `sudo` senza un sì esplicito della persona, e mai con `rm -rf`.

## Chiusura: il biglietto del giro

La persona annota tre cose che ha scoperto, con parole sue:

```bash
nano ~/rundgang.md
```

`nano` è un semplice blocco note nel terminale: scrivere, poi `Ctrl+O` e Invio per salvare, `Ctrl+X` per uscire. Meglio con un comando? `echo "- ..." >> ~/rundgang.md`.

Poi `mission_pruefen` con `flugschule-03-server-kennenlernen`. La verifica guarda se `~/rundgang.md` esiste.

## Se qualcosa si inceppa

- **`command not found`**: Errore di battitura, oppure l'apparecchio non è installato. Prima confronta bene il comando.
- **`No such file or directory`**: Sei nella stanza sbagliata. `pwd` ti dice dove sei.
- **La persona si sente sopraffatta:** Prendi solo `pwd`, `ls`, `cd` e `exit`. Il resto può aspettare finché serve.
- **Qualcosa è stato cancellato:** skill `zurueck-auf-gestern`.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «giro del nuovo appartamento», che ne ripete il nocciolo. Poi: cosa è fatto, dove si trova il risultato, cosa resta aperto e cosa viene dopo.
