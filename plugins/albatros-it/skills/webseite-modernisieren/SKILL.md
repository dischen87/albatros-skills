---
name: webseite-modernisieren
description: "Modernizza un sito web esistente (associazione, negozio, studio, vecchio sito Jimdo, Wix o WordPress) per una persona senza conoscenze tecniche, come variante del piano di volo. Comincia subito, senza domande, con l'inventario: tutte le pagine, ogni funzione (moduli, iscrizioni, appuntamenti, PDF, prezzi, gallerie, mappe, lingue) e tutti i contenuti, con foto del vecchio sito in docs/bestand.md. Dopo chiede solo quello che sa solo la persona, soprattutto cosa deve restare, e porta attraverso la pianta e la verifica del piano (nessuna funzione va persa senza decisione) al nuovo sito; alla messa online il dominio trasloca con reindirizzamenti, l'e-mail resta intatta. Usa lo skill con «Modernizza …», «il nostro sito è datato», «rinnovare il sito web», «relaunch», «via da Jimdo, Wix o WordPress», «rifare il vecchio sito», e subito quando qualcuno manda solo l'indirizzo di un sito web (https://…), senza altre parole."
metadata:
  stand: 0.2.0
  quelle: '2485342c6924'
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
- Chiedi solo quello che sa solo la persona, al massimo due domande per messaggio. Tutto quello che c'è sul sito lo leggi tu e lo proponi come `[Annahme: …]` (ipotesi). I segni `[Annahme: …]` e `[offen: …]` restano in tedesco, come i nomi delle righe in `docs/`: è da loro che `lage` riconosce ciò che è supposto o ancora aperto.
- Non chiedere mai password, nemmeno l'accesso al vecchio sito. Quello che sta dietro un accesso lo annoti come «non visibile».
- Imparare o fare, segnalare le lacune: come nello skill `lotse`.

## Il piano di volo quando si ristruttura

Modernizzare segue lo stesso piano di volo di un sito nuovo (skill `lotse`, «Il piano di volo in tre tappe»), con queste differenze:

| Sezione | Quando si ristruttura | Isola |
|---|---|---|
| Idea (Idee) | breve: cosa vuole il vecchio sito lo leggi tu; la persona dice cosa deve restare | `idee` |
| Ricerca (Research) | l'inventario del vecchio sito (sezione «Inventario» qui sotto) | `recherche` |
| Pianta, verificare il piano (Grundriss, Plan prüfen) | skill `webseite-planen`, in più: nessuna funzione va persa senza decisione | `plan`, `plan-geprueft` |
| Carattere, bozza, costruzione | gli skill abituali, con l'inventario come incarico | |
| Messa online | in più: il dominio trasloca con reindirizzamenti, le voci per l'e-mail (MX) restano intatte | |

Siccome cominci subito, l'inventario viene per primo e l'idea breve dopo. Sull'isola segnali comunque prima `idee`, poi `recherche`. Fino all'approvazione tutto resta sul computer della persona e da Albatros non costa niente.

## Inventario (Bestandsaufnahme)

La cartella di lavoro è una cartella nuova nella cartella attuale, con il nome del sito (per esempio `curling-grindelwald`). Per l'inventario non servono né un account né un server. Chiama prima `konto_status`. Se mostra un account, apri per primissima cosa l'isola nel browser, con `open https://albatros.build/it/cockpit/insel` (Linux `xdg-open`, Windows `start`). Senza risposta o senza account si va avanti senza isola.

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
4. **Il piano dell'inventario `docs/bestand.md`:**

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

## L'idea, in breve

Di' con parole semplici cosa hai trovato, in breve e con numeri: quante pagine, quali funzioni, cosa è superato, cosa è buono. Poi fai solo le due domande a cui può rispondere solo la persona:

1. **Cosa deve restare?** Cosa è sacro: logo, colori, un testo, una pagina, una funzione?
2. **Chi deve venire di più?** Ospiti, nuovi membri, sponsor, squadre per i tornei?

Chi cura il sito lo chiedi più tardi, nella pianta. Il resto dell'idea lo proponi dal vecchio sito, e la persona lo conferma in un solo messaggio: nome del progetto (di solito il nome del vecchio sito), in una frase, per chi, cosa principale, successo e modo (fare). Poi scrivi come nello skill `webseite-planen`, sezione Idea (passi da 4 a 6): `docs/projekt.md` con `Bestehende Seite: <indirizzo>`, `AGENTS.md` con `CLAUDE.md` e `GEMINI.md`, e lo schizzo grigio `design/skizze.html` della nuova pagina iniziale, in cui c'è già quello che deve restare. Aprilo nel browser.

Poi `schritt_melden` con `idee` e `mission_pruefen` con `flugschule-11-idee`.

## La ricerca dall'inventario

Quando si ristruttura la ricerca è già quasi fatta: l'inventario è la migliore guida di viaggio. Scrivi `docs/recherche.md` con le sette righe prese dall'inventario, ognuna a inizio riga, senza grassetto, con il nome tedesco (modello nello skill `webseite-planen`, sezione Ricerca):

- `Vorbilder:` (modelli) il vecchio sito (aperto, con la data), più, se la persona lo desidera, fino a due siti simili, ognuno aperto e raggiungibile. Mai indirizzi inventati.
- `Übliche Seiten und Funktionen:` quello che ha il vecchio sito (da `docs/bestand.md`).
- `Übernehmen:` (riprendere) quello che deve restare. `Vermeiden:` (evitare) quello che è superato.
- `Pflichten:` (obblighi) impressum, protezione dei dati, diritti sulle immagini e i diritti su testi e immagini del vecchio sito (qui sotto, «Diritti»).
- `Inhalte vorhanden:` (contenuti esistenti) dall'inventario; quello che manca o è superato va sulla lista per lo skill `inhalte`.
- `Suchbegriffe:` (parole di ricerca) come `[Annahme: …]`, dai titoli del vecchio sito.

Spiega il risultato alla persona in cinque righe. Poi `schritt_melden` con `recherche` e `mission_pruefen` con `flugschule-12-recherche`.

## Pianta e verifica del piano

Segui lo skill `webseite-planen`, sezione Pianta (Grundriss). La maggior parte delle risposte c'è già nell'inventario: riprendile e lascia che la persona le confermi soltanto. Ogni funzione dell'inventario va nel piano, con una proposta:

- Quello che ha bisogno solo di testi e file (appuntamenti, tornei, PDF, prezzi, sponsor, galleria) diventa un sito normale senza servizi propri, anche con più lingue.
- Moduli: spesso basta un link per l'e-mail. Se la lista delle iscrizioni deve essere salvata, è un blocco (skill `bausteine`, più tardi con un server tuo).
- Un libro degli ospiti pieno di pubblicità o un accesso che serviva solo alla vecchia tecnica possono sparire, ma solo con una decisione della persona.
- I vecchi indirizzi a cui rimandano altri (bandi, classifiche, risultati su Google) restano uguali o ricevono un reindirizzamento alla messa online.

Le decisioni le scrivi in `docs/bestand.md` (colonna Decisione) e in `docs/plan.md`.

Dopo viene la sezione «Verificare il piano» di `webseite-planen`, con un undicesimo punto per il secondo parere: **nessuna funzione del vecchio sito va persa senza decisione** (ogni riga in `docs/bestand.md` ha una decisione, e ognuna che resta c'è nel piano). Si va avanti solo dopo il sì della persona al piano.

## Carattere, bozza, costruzione

Poi si continua come per ogni sito nuovo, sezione dopo sezione con `lage`: il carattere (skill `konzept`), la tavola dei campioni (skill `gestaltung`), tutto il sito come bozza (skill `entwurf`), poi costruire, verificare e approvare sul computer (skill `webseite-bauen`). Il tuo incarico è `docs/plan.md` insieme a `docs/bestand.md`. In più vale:

- Quello che deve restare (logo, colori, un testo) è la cornice per il carattere e l'aspetto. Guarda anche le foto del vecchio sito: cosa è sacro, cosa sembra superato?
- La bozza, e più tardi il progetto di costruzione, elencano ogni funzione di `docs/bestand.md`, con la sua decisione. Nessuna sparisce in silenzio.
- Dopo la costruzione mostri prima e dopo uno accanto all'altro, pagina iniziale e sottopagina più importante, sul telefonino e sul desktop, con tre frasi su cosa è migliorato e cosa è rimasto uguale.

## Messa online: il dominio trasloca

Il dominio attuale del vecchio sito (per esempio `curling-wil.ch`) resta com'è finché il nuovo sito è online (skill `lancieren`, sezione messa online). Solo allora lo fai puntare al nuovo sito (skill `domain`, con Albatros tramite `domain_verbinden`):

- **Reindirizzamenti:** ogni vecchio indirizzo di `docs/bestand.md` che sul nuovo sito non esiste più riceve un reindirizzamento alla nuova pagina adatta, così i link di altri e i risultati su Google non finiscono nel vuoto. Con un server tuo si fa nel server web (`nginx.conf`, `return 301`), altrimenti con una piccola pagina al vecchio indirizzo che rimanda avanti. Dopo controlla una volta ogni vecchio indirizzo.
- **L'e-mail non si tocca mai:** il dominio resta presso il suo fornitore e lì continua a costare all'anno. Le voci per l'e-mail (MX) non le tocchi mai, altrimenti non arriva più nessuna e-mail.

## Diritti

Testi, foto e loghi del vecchio sito appartengono a qualcuno, di solito all'associazione o all'attività, a volte a una fotografa. Chi modernizza un sito che non è suo ha bisogno del permesso di chi lo gestisce, prima che qualcosa venga pubblicato. I file scaricati sono una copia di lavoro da guardare. Le foto con persone riconoscibili hanno bisogno del loro consenso. Prima di pubblicare chiedi quindi: «I testi e le immagini sono vostri, o avete il permesso, per esempio dal comitato?»

## Trappole

- Una funzione va persa in silenzio: modulo sostituito da niente, classifiche che non si trovano più. Alla fine controlla ogni riga dell'inventario.
- I vecchi indirizzi si rompono: bandi e classifiche sono spesso linkati da altri siti.
- Riprendere una galleria con migliaia di immagini così com'è: meglio una scelta delle migliori, rimpicciolite, il resto resta nell'archivio.
- Sembrare fatto dall'IA: leggi nello skill `gestaltung` la lista dei tratti tipici prima di progettare la prima pagina.
- Riprendere il banner dei cookie della vecchia pagina: un sito senza tracciamento e senza incorporamenti esterni non usa cookie e non ne ha bisogno. Basta l'informativa sulla privacy. Un banner serve solo se qualcosa richiede un consenso, per esempio una mappa di Google incorporata. Al posto della mappa basta spesso un link «Calcola percorso» con l'indirizzo, così la pagina resta senza banner.

## Messaggio finale

Il tuo ultimo messaggio in questo passo inizia con una frase sull'immagine «ristrutturare una casa vecchia», che ne ripete il nocciolo. Poi: cosa è stato trovato o costruito, dove si trova (`docs/bestand.md`, foto), cosa deve ancora decidere la persona e cosa viene dopo.
