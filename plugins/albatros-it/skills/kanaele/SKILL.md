---
name: kanaele
description: "Aiuta una persona senza conoscenze preliminari a creare da sé account sui social per il suo sito (Instagram come account professionale, pagina Facebook, pagina LinkedIn, Pinterest, TikTok facoltativo), con lo stesso nome del sito e una bio con link; password e codici restano a lei. Poi «condividere i nuovi articoli»: per ogni nuovo articolo del blog Bert scrive un breve post per canale come messaggio in bozza (strumento entwurf), la persona approva e pubblica da sé; come aiuto ricorrente con lo strumento aufgabe. Usa lo skill per «social media», «Instagram», «pagina Facebook», «LinkedIn», «Pinterest», «TikTok», «creare un account», «condividere un articolo», «scrivere un post», «come faccio conoscere il mio sito»."
metadata:
  stand: 0.3.2
  quelle: 'e939e5cb6500'
---

# Canali: le colonne delle affissioni in città

## L'immagine

Il tuo sito è il tuo negozio. Instagram, Facebook e gli altri sono colonne delle affissioni in quartieri diversi. Su ogni manifesto ci sono lo stesso nome e la stessa immagine, più una freccia verso il negozio: il link. Attaccare i manifesti puoi farlo solo tu.

**Come usare l'immagine:** dilla alla persona in una frase nella tua prima risposta.

## Come parli

- Dai del tu, frasi brevi, passi numerati, al massimo due domande per messaggio.
- I pulsanti delle app a volte cambiano nome. Se la persona vede qualcos’altro, ti dice cosa vede.

## Tre regole fisse

1. **La persona crea gli account da sé.** Password e codici (autenticazione a due fattori) li digita solo nell’app. Non li chiedi mai e non li vedi mai.
2. **Non pubblichi mai.** Ogni post è un messaggio in bozza. La persona lo legge, lo approva e lo pubblica con il suo clic. Vale sempre, anche se dice «fallo e basta».
3. **Dire apertamente chi consiglia.** Se un post rimanda a SwissActivities e la persona ci lavora, nel post c’è scritto: «Lavoro da SwissActivities. I consigli sono miei.» (nella lingua del post). Lo aggiungi di tua iniziativa e non lo togli mai. Motivo: la pubblicità deve essere riconoscibile come tale (diritto svizzero contro la concorrenza sleale). Gli account non sembrano mai quelli ufficiali di SwissActivities: nome proprio, immagine propria. Se l’azienda ha regole per i social, la persona lo chiede lì.

## 1. Preparare nome e bio

Scrivi `docs/kanaele.md`:

```markdown
# Kanäle
Name: <come il sito, p. es. ausflugsmami>
Link: <indirizzo del sito>
Bio: <al massimo 150 caratteri, con la nota>
| Kanal | Konto | Stand |
|---|---|---|
| Instagram | @… | offen |

## Geteilt
```

I nomi delle righe e `## Geteilt` restano in tedesco perché l’aiuto ricorrente li trovi; dopo i due punti scrivi nella lingua della persona.

1. **Nome:** lo stesso del sito, ovunque uguale. La persona controlla in ogni app se è libero; se no, una piccola aggiunta, ovunque la stessa.
2. **Immagine:** logo o la stessa foto su tutti i canali.
3. **Bio:** per esempio «Gite in famiglia in Svizzera, provate da noi. Lavoro da SwissActivities, i consigli sono miei.» Più il link al sito.

## 2. Creare gli account (lo fa la persona)

**Instagram (account professionale)**
1. Aprire l’app Instagram, «Crea nuovo account», con il tuo indirizzo e-mail.
2. Inserire nome, immagine del profilo e bio da `docs/kanaele.md`.
3. Profilo, menu ☰, «Tipo di account e strumenti», «Passa a un account professionale», scegliere una categoria (p. es. «Blogger»), «Creator».
4. «Modifica profilo», «Link», l’indirizzo del tuo sito.
5. Nelle impostazioni, attivare l’autenticazione a due fattori.

**Pagina Facebook**
1. Accedere con il tuo account Facebook personale. Una pagina ne ha bisogno dietro di sé; non viene mostrato.
2. Menu, «Pagine», «Crea nuova Pagina».
3. Inserire nome, categoria (p. es. «Blogger») e bio.
4. Immagine del profilo, immagine di copertina e l’indirizzo del tuo sito.
5. «Fine». Poi attivare l’autenticazione a due fattori nelle impostazioni.

**Pagina LinkedIn**
1. Spesso basta il tuo profilo personale: lì condividi semplicemente gli articoli da te. Una pagina vale la pena se i consigli sono un progetto a sé.
2. Accedere a LinkedIn, in alto «Per le aziende», «Crea una pagina aziendale».
3. Inserire nome, indirizzo della pagina (linkedin.com/company/<nome>), sito, logo e slogan.
4. Confermare che puoi creare la pagina, e «Crea pagina».

**Pinterest**
1. Creare un account aziendale: su pinterest.ch «Iscriviti» e scegliere «account aziendale», oppure convertire un account esistente.
2. Nome, immagine del profilo, informazioni e l’indirizzo del tuo sito.
3. Confermare il sito: Pinterest mostra un breve pezzo di codice. Dammelo, lo inserisco nel sito. Non è un segreto.
4. Creare bacheche, per esempio «Giorni di pioggia con i bambini» e «Escursioni con il passeggino».

**TikTok (facoltativo)**
1. Aprire l’app TikTok, «Iscriviti», con il tuo indirizzo e-mail.
2. Nome, immagine del profilo e bio da `docs/kanaele.md`.
3. Se un link nel profilo non è possibile, l’indirizzo del sito va nel post.
4. Nelle impostazioni, attivare l’autenticazione a due fattori.

Quando un account è pronto, inserisci il nome in `docs/kanaele.md` e metti `Stand` su `fertig`. Nomi dei menu secondo le app, non ricontrollati il 13.11.2026.

## 3. Condividere i nuovi articoli

Quando un articolo del blog è online (skill `blog`), fai così:

1. **Leggere:** titolo, la frase di `description`, indirizzo dell’articolo, immagine.
2. **Un messaggio in bozza per canale:** per ogni canale pronto in `docs/kanaele.md` chiami `entwurf` con `art: beitrag`. In `an` va il canale (p. es. «Instagram»), in `text` il post. Breve: una frase che incuriosisce, una frase di utilità, il link, da tre a cinque hashtag e la nota della regola 3.
3. **Ogni canale a modo suo:** Instagram con «link nella bio» e immagine in verticale; Facebook con il link diretto; LinkedIn un po’ più sobrio; Pinterest come pin con immagine in verticale e link; TikTok come testo per un breve video della persona.
4. **La persona decide:** vede i messaggi in bozza in Albatros, li modifica, approva e pubblica da sé.
5. **Annotare:** sotto `## Geteilt` in `docs/kanaele.md` va `<slug> <GG.MM.AAAA>`. Così nessun messaggio in bozza viene fatto due volte.

Senza il programma Albatros metti i messaggi in bozza in `docs/beitraege/<GG.MM.AAAA>-<slug>.md`; la persona li copia nell’app.

## 4. Farne un aiuto ricorrente

Proponilo. Solo dopo il suo sì lo crei con `aufgabe`, con `ausloeser: zeit` e `wiederholen: woechentlich`:

- **Titolo:** «Condividere i nuovi articoli»
- **Quando:** ogni lunedì alle 9 (giorno e ora li sceglie la persona)
- **Istruzione:** «Guarda in web/src/content/blog/ se ci sono articoli online che mancano sotto ## Geteilt in docs/kanaele.md. Per ciascuno: un messaggio in bozza per canale pronto con entwurf, art beitrag, con la nota su SwissActivities se rimanda lì. Poi inserire l’articolo sotto ## Geteilt. Non pubblicare niente.»

Se `aufgabe` offre un attivatore per un sito appena pubblicato, prendi piuttosto quello (`ausloeser: ereignis`). Allora i messaggi in bozza arrivano subito dopo la pubblicazione invece che il lunedì.

## Trappole

- Cinque nomi per un sito: nessuno trova ciò che va insieme. Ovunque lo stesso nome.
- Una password nella chat: di’ alla persona di cambiarla subito. Non la salvi da nessuna parte.
- Un post senza la nota sul datore di lavoro: la frase della regola 3 va in ogni post con un link a SwissActivities.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «le colonne delle affissioni in città» che ridice l'essenziale. Poi: cosa è fatto, quali account sono pronti, cosa resta aperto e cosa viene dopo.
