---
name: swissactivities
description: "Integra elementi di SwissActivities in un sito personale di consigli per famiglie, per collaboratrici e collaboratori di SwissActivities senza conoscenze preliminari. Collega l’IA al server pubblico di SwissActivities (senza accesso), prepara un consiglio solo con dati reali (età, meteo, prezzo con data, viaggio con i mezzi pubblici), chiede l’esperienza della persona invece di inventarne una, mette il link di prenotazione e integra il widget dell’area partner come componente Astro, con la nota «Lavoro da SwissActivities» e una riga per l’informativa sulla privacy. Usa lo skill per «SwissActivities», «integrare un widget», «area partner», «ID del widget», «scrivere un consiglio», «cosa fare con i bambini», «gita in famiglia», «link di prenotazione», «mostrare attività sul mio sito»."
metadata:
  stand: 0.3.2
  quelle: '8f395bf66d54'
---

# SwissActivities: il cartello del sentiero

## L'immagine

Un cartello giallo indica la meta e il tempo di cammino, ed è giusto perché qualcuno ha misurato. Il tuo consiglio è un cartello così: i numeri sopra (età, prezzo, viaggio) vengono dalla misura, cioè dagli strumenti di SwissActivities. La storia accanto viene da te.

**Come usare l'immagine:** dilla alla persona in una frase nella tua prima risposta.

## Come parli

- Dai del tu, frasi brevi, un passo alla volta, al massimo due domande per messaggio.
- Spieghi una parola quando arriva: un **widget** è un riquadro già pronto di SwissActivities che mostra offerte sul tuo sito.

## Cinque regole

1. **Dire apertamente chi consiglia.** La persona lavora da SwissActivities. Sul sito (nel piè di pagina o su «Chi sono») e accanto a ogni widget c’è scritto: «Lavoro da SwissActivities. I consigli sono miei.» (nella lingua del sito). Aggiungi questa frase di tua iniziativa e non la togli mai. Motivo: la pubblicità deve essere riconoscibile come tale, lo esige il diritto svizzero contro la concorrenza sleale.
2. **Solo dati reali.** Scrivi prezzi, età, orari di apertura e durata solo se uno strumento li ha forniti, con la data della richiesta. Se manca un valore, è sconosciuto: «Prezzo: vedi la pagina di prenotazione», mai una stima.
3. **Solo esperienze reali.** Il senso del sito sono le esperienze proprie. Chiedi alla persona che cosa ha vissuto. Non inventi mai un’esperienza, una citazione, un bambino o una recensione.
4. **Nessuna chiave.** L’ID del widget non è segreto e può stare nel codice. Non chiedi mai una chiave API e non ne salvi mai una.
5. **Non promettere niente.** Se c’è una provvigione, se ne occupa l’area partner. Come vengono considerati i collaboratori lo decide SwissActivities (ancora aperto). Non prometti soldi.

## 1. Collegare gli strumenti

Il server di SwissActivities è pubblico e non richiede accesso: `https://gateway.swissactivities.com/mcp`. Nel programma Albatros, Bert lo porta con sé non appena la persona attiva l’interruttore nel passo «Gite di SwissActivities» della lista di controllo (solo lettura, costruito il 13.11.2026). Guarda quindi prima se hai già strumenti come `search_activities`. Se no, collegalo con il sì della persona:

| IA | Come |
|---|---|
| Claude Code | `claude mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp`, poi riavviare Claude Code |
| Codex | per una sessione `codex -c 'mcp_servers.swissactivities.url="https://gateway.swissactivities.com/mcp"'`, in modo permanente `codex mcp add swissactivities --url https://gateway.swissactivities.com/mcp` |
| Cursor | in `.cursor/mcp.json`: `{"mcpServers":{"swissactivities":{"url":"https://gateway.swissactivities.com/mcp"}}}`, poi riavviare Cursor |
| Gemini CLI | `gemini mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp` |

Verificato il 13.11.2026 senza modello: Claude Code 2.1.118 segnala «✓ Connected», Codex 0.166.0 mostra il server con `-c`. Cursor e Gemini CLI secondo la loro documentazione, non misurati.

Gli strumenti (14, letti il 13.11.2026):

| A cosa serve | Strumento |
|---|---|
| Trovare offerte e guardarle da vicino | `search_activities`, `get_activity_details` |
| Prezzo e posti liberi in un giorno | `check_availability` |
| Luoghi come parchi giochi o musei, con orari | `search_places`, `get_place_details` |
| Escursioni, anche per bambini e passeggini | `search_hikes`, `get_hike_details` |
| Meteo | `get_weather` |
| Viaggio in treno, bus e battello | `plan_journey` |
| Abbonamenti ferroviari | `find_rail_passes`, `recommend_rail_pass` |
| Attrazioni | `get_point_of_interest` |
| Mappa con foto e link | `show_on_map` |
| Un giorno libero, cosa fare? | `plan_free_time` |

## 2. Preparare un consiglio

1. **Chiedi dell’esperienza.** Dove siete stati? Quanti anni avevano i bambini? Cosa è stato bello, cosa faticoso? C’è un consiglio che conosci solo tu?
2. **Trova l’offerta** con `search_activities` (per famiglie con `for_families`), `search_places` o `search_hikes`. I dettagli li prendi con `get_activity_details`.
3. **Età:** da `min_age` e `max_age`. Se mancano, scrivi «Età: non indicata».
4. **Meteo:** dentro o fuori e se va bene con la pioggia lo dice il risultato (`rain_ok`). Per un giorno preciso chiedi `get_weather`.
5. **Prezzo:** `check_availability` per una data, con adulti e bambini. Scrivi: «CHF … per 2 adulti e 2 bambini il <data>, verificato il <GG.MM.AAAA>».
6. **Viaggio:** `plan_journey` dalla stazione che la persona indica. Scrivi solo durata e cambi, niente orari di partenza; cambiano.
7. **Link:** il `booking_url` esattamente come lo fornisce lo strumento, con tutto quello che segue il «?». Mai accorciarlo, mai costruirlo da te.

Poi scrivi l’articolo con lo skill `blog`, con il modello per i consigli alle famiglie. Prima di ogni nuova pubblicazione ricontrolli i prezzi.

## 3. Prendere il widget (lo fa la persona)

1. Apri partner.swissactivities.com e accedi. La password la digiti solo lì.
2. Clicca su «Widget-Builder» e poi su «Neues Widget» (nomi come nell’area partner in tedesco).
3. Scegli un modello: «Aktivitäten-Raster» (griglia di attività), «Highlights-Karussell» (carosello), «Katalog» (catalogo) o «Karte» (mappa).
4. Scegli le offerte e clicca su «Veröffentlichen» (pubblica).
5. Copia l’ID del widget e dammelo nella chat.

Basta un widget per tema, per esempio «Giorni di pioggia con i bambini». Può stare su più pagine.

## 4. Integrare il widget

Ecco il codice di SwissActivities:

```html
<sa-widget widget-id="…" locale="de-CH"></sa-widget>
<script type="module" src="https://studio.swissactivities.com/v1/embed.mjs"></script>
```

Sul sito diventa un componente, `web/src/components/SwissActivities.astro`. Carica lo script solo quando il riquadro è quasi visibile. Motivo: lo script pesa circa 70 KB, e `pruefen.mjs` permette 50 KB di JavaScript per pagina. Misurato il 13.11.2026 con Astro 7.4.11: al caricamento 0 KB e nessun contatto con SwissActivities, dopo lo scorrimento 70 KB e il widget funziona.

```astro
---
// Elemento di SwissActivities (skill swissactivities). L’ID del widget non è segreto.
interface Props { widgetId: string; locale?: string; link?: string }
const { widgetId, locale = 'de-CH', link } = Astro.props;
---
<div class="sa-baustein" data-sa-baustein>
  <sa-widget widget-id={widgetId} locale={locale}></sa-widget>
  {link && <p><a href={link}>Vedi l’offerta su SwissActivities</a></p>}
  <p class="sa-hinweis">Lavoro da SwissActivities. I consigli sono miei.</p>
</div>
<script is:inline type="module">
  const kaesten = document.querySelectorAll('[data-sa-baustein]');
  const laden = () => { if (!window.__saGeladen) { window.__saGeladen = true; import('https://studio.swissactivities.com/v1/embed.mjs'); } };
  const beobachter = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { beobachter.disconnect(); laden(); } }, { rootMargin: '300px' });
  kaesten.forEach((k) => beobachter.observe(k));
</script>
<style>
  /* Solo valori da design/tokens.css, nomi come lì */
  .sa-baustein { margin-block: var(--abstand-4); }
  .sa-hinweis { color: var(--farbe-text); font-size: 0.875em; }
</style>
```

1. **Posto:** prima il tuo testo, poi il widget. Se sta in cima, si carica subito e `pruefen.mjs` diventa rosso.
2. **Lingua:** `locale` è la lingua della pagina, come appare nel codice dell’area partner (tedesco: `de-CH`).
3. **Link di riserva:** `link` è il `booking_url` dell’offerta. Così si arriva all’offerta anche senza JavaScript.
4. **Aspetto:** intorno al widget solo valori da `design/tokens.css`. Il widget porta il suo aspetto.
5. **Nel blog:** un articolo indica l’ID nella sua intestazione (`widget:`), e la pagina dell’articolo mostra allora il componente (skill `blog`).
6. **Verificare e pubblicare:** guardare l’anteprima (`vorschau_starten`), `node scripts/pruefen.mjs`, una voce nel diario di bordo. Poi la persona clicca sul pulsante di pubblicazione in Albatros. Senza il programma vale lo skill `webseite-aendern`.

## 5. Nota e protezione dei dati

1. **Nota:** la frase «Lavoro da SwissActivities. I consigli sono miei.» sta nel piè di ogni pagina o su «Chi sono», e accanto a ogni widget (il componente la porta con sé).
2. **Informativa sulla privacy:** completala con lo skill `recht-ch`. Proposta:
   > Su alcune pagine mostriamo offerte di SwissActivities. Solo quando scorri fino a questo riquadro il tuo browser carica contenuti da studio.swissactivities.com e widget.swissactivities.com, per una mappa anche immagini della mappa da tiles.openfreemap.org. Questi server vedono il tuo indirizzo IP. Se prenoti, valgono le condizioni di SwissActivities.

   Gli indirizzi sono stati letti nello script il 13.11.2026. Se si aggiunge un modello, ricontrollali.

## Trappole

- Un prezzo a memoria: non è quasi mai giusto. Sempre `check_availability`, con una data.
- Un link accorciato o ricopiato: forse non porta più all’offerta giusta. Riprenderlo esattamente.
- ID del widget e chiave API confusi: l’ID va nel codice, una chiave mai.
- Un account o un sito che sembra quello ufficiale di SwissActivities: nome e logo sono quelli della persona.

## Messaggio finale

Il tuo ultimo messaggio in questo passo comincia con una frase sull'immagine «il cartello del sentiero» che ridice l'essenziale. Poi: cosa è fatto, dove si trova, cosa resta aperto e cosa viene dopo.
