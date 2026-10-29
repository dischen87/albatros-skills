---
name: webseite-modernisieren
description: "Modernizza un sito web esistente (associazione, negozio, studio, vecchio sito Jimdo, Wix o WordPress) per una persona senza conoscenze tecniche. Comincia subito, senza domande, con l'inventario: tutte le pagine, ogni funzione (moduli, iscrizioni, appuntamenti, PDF, prezzi, gallerie, mappe, lingue) e tutti i contenuti, con foto del vecchio sito in docs/bestand.md. Dopo chiede solo quello che sa solo la persona e porta, attraverso il piano e l'aspetto, al nuovo sito, senza che una funzione vada persa senza la sua decisione. Usa lo skill con «Modernizza …», «modernizza il nostro sito», «il nostro sito è datato», «rinnovare il sito web», «relaunch», «via da Jimdo, Wix o WordPress», «rifare il vecchio sito», e subito quando qualcuno manda solo l'indirizzo di un sito web (https://…), senza altre parole."
---

# Modernizzare il sito web: ristrutturare una casa vecchia

## L'immagine

Una casa vecchia si ristruttura, non si abbatte. Prima qualcuno passa con taccuino e macchina fotografica in ogni stanza: cosa c'è, cosa funziona, cosa è marcio, e cosa per la famiglia è sacro, per esempio la stufa in maiolica. Solo con questo piano dell'inventario si comincia a ristrutturare. E nessun muro viene tolto senza che la famiglia abbia detto di sì.

**Come usi l'immagine:** Una frase nella tua prima risposta, insieme a quello che stai facendo.

## Come parli

- **Comincia subito.** Se la persona manda un indirizzo o «Modernizza …», non le chiedi cosa vuole. Dici in una frase che adesso guardi ogni stanza del vecchio sito e quanto ci vuole più o meno, e cominci.
- La persona non deve mai sapere qual è il prossimo passo. Lo proponi tu e lo fai dopo un breve sì.
- Dai del tu, lingua di tutti i giorni. Invece di «sitemap» dici «lista di tutte le pagine», invece di «backend del modulo» «dove vanno le richieste».
- Gli strumenti di Albatros rispondono in tedesco: tu riporti tutto in italiano e con la persona parli sempre italiano.
- Chiedi solo quello che sa solo la persona. Tutto quello che c'è sul sito lo leggi tu.
- Non chiedere mai password, nemmeno l'accesso al vecchio sito. Quello che sta dietro un accesso lo annoti come «non visibile».

## Procedura

### 1. Inventario, senza domande

La cartella di lavoro è una cartella nuova nella cartella attuale, con il nome del sito (per esempio `curling-grindelwald`). Per l'inventario non servono né un account né un server. Chiama prima `konto_status`. Se mostra un account, apri per primissima cosa l'isola nel browser, con `open https://albatros.build/it/cockpit/insel` (skill `webseite-bauen`, sezione «L'isola»). Senza risposta o senza account si va avanti senza isola.

1. **Leggere tutte le pagine.** Lo script `bestand.mjs` si trova nella cartella di questo skill (in Claude Code il percorso è indicato in alto come «Base directory for this skill»). Serve solo Node:
   ```bash
   node <cartella-di-questo-skill>/bestand.mjs https://www.beispiel.ch docs/bestand
   ```
   Legge `sitemap.xml`, segue i link dello stesso indirizzo e salva: `docs/bestand/bestand.json` (pagine, moduli con i loro campi, incorporamenti, e-mail, telefono, prezzi, orari, documenti, servizi esterni), il testo di ogni pagina in `docs/bestand/seiten/` e immagini e documenti in `docs/bestand/dateien/`. Senza Node prendi la lista delle pagine con `curl -sL https://www.beispiel.ch/sitemap.xml` e ogni pagina una per una.
2. **Foto del vecchio sito.** Di ogni pagina del menu una foto in larghezza telefonino e desktop. La prima volta Playwright scarica un browser (circa 150 MB):
   ```bash
   npx -y playwright install chromium
   npx -y playwright screenshot --viewport-size=390,844 --full-page https://www.beispiel.ch/ docs/bestand/fotos/start-390.png
   npx -y playwright screenshot --viewport-size=1440,900 https://www.beispiel.ch/ docs/bestand/fotos/start-1440.png
   ```
   Guarda tu stesso ogni foto. Mostrano quello che i testi non dicono: ordine, immagini, se il sito funziona sul telefonino.
3. **Trovare ogni funzione.** Percorri testi e foto con questa lista e annota per ogni punto dove si trova e come è costruito oggi:
   - Moduli: contatto, iscrizione, prenotazione, ordinazione, borsa giocatori o partner, libro degli ospiti. Quali campi, dove vanno le richieste?
   - Appuntamenti: calendario, tornei, corsi, orari di allenamento, orari d'apertura, stagione.
   - Documenti: PDF (bandi, classifiche, statuti, menù), quanti, quanto vecchi.
   - Prezzi, quote sociali, tariffe.
   - Immagini: gallerie (album, numero), loghi, sponsor con link.
   - Incorporamenti e sistemi esterni: mappa, video, sistema di prenotazione, negozio online, newsletter, social media, meteo, webcam (`einbettungen` e `fremdeDienste` in `bestand.json`).
   - Aree con accesso, lingue, Impressum e protezione dei dati, link ad altri siti.

### 2. Il piano dell'inventario `docs/bestand.md`

```markdown
# Inventario: <nome del sito>

**Indirizzo:** … · **rilevato il:** <data> · **costruito con:** <p. es. Jimdo> · **Pagine:** <numero> · **Lingue:** …

## Pagine
| Pagina | Indirizzo | Cosa c'è sopra, in una frase | Stato | Foto |
|---|---|---|---|---|

## Funzioni
| Funzione | Dove | Come oggi | Deve restare? | Decisione |
|---|---|---|---|---|
| Modulo di contatto (nome, e-mail, messaggio) | /kontakt | modulo di Jimdo | sì | aperta |

## Contenuti
Testi, immagini (numero, proprie o di altri), documenti, loghi, sponsor.

## Cosa è superato
Ogni punto con una prova, per esempio «notizie del 2019 sulla pagina iniziale», «immagini sfocate sul telefonino», «libro degli ospiti pieno di pubblicità».

## Cosa deve restare
Quello che serve ai visitatori e quello che è buono.

## Domande aperte
```

La colonna **Decisione** resta «aperta» finché la persona non ha deciso: «resta», «nuova come …» o «eliminata (decisa il <data>)». Nessuna funzione sparisce dal nuovo sito finché qui non c'è una decisione così.

`docs/bestand/dateien/` non va nel diario di bordo: è troppo grande e contiene diritti di altri. Inseriscila in `.gitignore`. Quello che ne serve al nuovo sito lo copi più tardi in modo mirato.

### 3. Riferire, poi solo tre domande

Di' con parole semplici cosa hai trovato, in breve e con numeri: quante pagine, quali funzioni, cosa è superato, cosa è buono. Poi fai solo le domande a cui può rispondere solo la persona, numerate in un unico messaggio:

1. **Chi cura il sito** oggi e in futuro, e quanto spesso cambia qualcosa?
2. **Cosa è sacro?** Cosa deve restare esattamente così (logo, colori, un testo, una pagina, una funzione)?
3. **Chi deve venire di più?** Ospiti, nuovi membri, sponsor, squadre per i tornei?

Tutto il resto lo proponi tu, con le ipotesi segnate (`[Ipotesi: …]`), che la persona può correggere.

### 4. Dall'inventario al piano

Segui lo skill `webseite-planen`. La maggior parte delle risposte c'è già nell'inventario: riprendile e lascia che la persona le confermi soltanto. Ogni funzione dell'inventario va nel piano, con una proposta:

- Quello che ha bisogno solo di testi e file (appuntamenti, tornei, PDF, prezzi, sponsor, galleria) diventa una normale pagina statica, anche con più lingue (basta Light).
- Moduli: spesso basta un link per l'e-mail. Se la lista delle iscrizioni deve essere salvata, è un blocco (skill `bausteine`, con Pilot).
- Un libro degli ospiti pieno di pubblicità o un accesso che serviva solo alla vecchia tecnica possono sparire, ma solo con una decisione della persona.
- I vecchi indirizzi a cui rimandano altri (bandi, classifiche, risultati su Google) restano uguali o ricevono un reindirizzamento.

Le decisioni le scrivi in `docs/bestand.md` (colonna Decisione) e in `docs/plan.md`.

### 5. Costruire in otto passi

Da qui segui lo skill `webseite-bauen`, nel suo ordine fisso: mockup, design, framework, PRD, in locale, porto, nastro trasportatore, pagina o server. In più vale:

- Il PRD elenca ogni funzione di `docs/bestand.md`, con la sua decisione. Nessuna sparisce in silenzio.
- Per l'aspetto leggi anche le foto del vecchio sito: cosa è sacro (logo, colori)? Cosa sembra superato?
- Dopo la costruzione in locale mostri prima e dopo uno accanto all'altro, pagina iniziale e sottopagina più importante, sul telefonino e sul desktop, con tre frasi su cosa è migliorato e cosa è rimasto uguale.
- Il vecchio indirizzo punta al nuovo sito solo quando il nuovo funziona (skill `domain`).

## Diritti

Testi, foto e loghi del vecchio sito appartengono a qualcuno, di solito all'associazione o all'attività, a volte a una fotografa. Chi modernizza un sito che non è suo ha bisogno del permesso di chi lo gestisce, prima che qualcosa venga pubblicato. I file scaricati sono una copia di lavoro da guardare. Le foto con persone riconoscibili hanno bisogno del loro consenso. Prima di pubblicare chiedi quindi: «I testi e le immagini sono vostri, o avete il permesso, per esempio dal comitato?»

## Trappole

- Una funzione va persa in silenzio: modulo sostituito da niente, classifiche che non si trovano più. Alla fine controlla ogni riga dell'inventario.
- I vecchi indirizzi si rompono: bandi e classifiche sono spesso linkati da altri siti.
- Riprendere una galleria con migliaia di immagini così com'è: meglio una scelta delle migliori, rimpicciolite, il resto resta nell'archivio.
- Sembrare fatto dall'IA: leggi nello skill `gestaltung` la lista dei tratti tipici prima di costruire la prima pagina.
- Riprendere il banner dei cookie della vecchia pagina: una pagina statica senza tracciamento e senza incorporamenti esterni non usa cookie e non ne ha bisogno. Basta l'informativa sulla privacy. Un banner serve solo se qualcosa richiede un consenso, per esempio una mappa di Google incorporata. Al posto della mappa basta spesso un link «Calcola percorso» con l'indirizzo, così la pagina resta senza banner.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «ristrutturare una casa vecchia», che ne ripete il nocciolo. Poi: cosa è stato trovato o costruito, dove si trova (`docs/bestand.md`, foto), cosa deve ancora decidere la persona e cosa viene dopo.
