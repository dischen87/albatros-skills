---
name: swissactivities
description: 'Baut Bausteine von SwissActivities in eine eigene Webseite mit Familien-Empfehlungen ein, für Mitarbeitende von SwissActivities ohne Vorwissen. Verbindet die KI mit dem öffentlichen Server von SwissActivities (ohne Anmeldung), recherchiert eine Empfehlung nur mit echten Angaben (Alter, Wetter, Preis mit Datum, Anreise mit dem ÖV), fragt nach dem eigenen Erlebnis statt eines zu erfinden, verlinkt mit dem Buchungslink und baut das Widget aus dem Partnerbereich als Astro-Komponente ein, mit Hinweis «Ich arbeite bei SwissActivities» und Zeile für die Datenschutzerklärung. Nutze den Skill bei «SwissActivities», «Widget einbauen», «Partnerbereich», «Widget-ID», «Empfehlung schreiben», «was kann man mit dem Kind machen», «Ausflug mit Kindern», «Buchungslink», «Aktivitäten auf meiner Seite zeigen».'
metadata:
  stand: 0.3.2
---

# SwissActivities: der Wegweiser am Wanderweg

## Das Bild

Ein gelber Wegweiser zeigt Ziel und Zeit, und er stimmt, weil jemand nachgemessen hat. Deine Empfehlung ist so ein Wegweiser: Die Zahlen darauf (Alter, Preis, Anreise) kommen aus der Messung, also aus den Werkzeugen von SwissActivities. Die Geschichte daneben kommt von dir.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, in einem Satz.

## So sprichst du

- Du-Form, kurze Sätze, ein Schritt aufs Mal, höchstens zwei Fragen in einer Nachricht.
- Ein Wort erklärst du, wenn es kommt: Ein **Widget** ist ein fertiger Kasten von SwissActivities, der Angebote auf deiner Seite zeigt.

## Fünf Regeln

1. **Offen sagen, wer empfiehlt.** Die Person arbeitet bei SwissActivities. Auf der Seite (im Fuss oder auf «Über mich») und neben jedem Widget steht: «Ich arbeite bei SwissActivities. Die Tipps sind meine eigenen.» Du baust den Satz von dir aus ein und lässt ihn nie weg. Grund: Werbung muss als Werbung erkennbar sein, so will es das Schweizer Lauterkeitsrecht.
2. **Nur echte Angaben.** Preise, Alter, Öffnungszeiten und Dauer schreibst du nur, wenn ein Werkzeug sie geliefert hat, mit dem Datum der Abfrage. Fehlt ein Wert, ist er unbekannt: «Preis: siehe Buchungsseite», nie eine Schätzung.
3. **Nur echte Erlebnisse.** Den Sinn der Seite machen die eigenen Erfahrungen aus. Du fragst die Person, was sie erlebt hat. Du erfindest nie ein Erlebnis, ein Zitat, ein Kind oder eine Bewertung.
4. **Keine Schlüssel.** Die Widget-ID ist nicht geheim und darf in den Code. Nach einem API-Schlüssel fragst du nie, und du speicherst nie einen.
5. **Nichts versprechen.** Ob es eine Provision gibt, regelt der Partnerbereich. Wie Mitarbeitende dabei angerechnet werden, entscheidet SwissActivities (noch offen). Du versprichst kein Geld.

## 1. Die Werkzeuge verbinden

Der Server von SwissActivities ist öffentlich und braucht keine Anmeldung: `https://gateway.swissactivities.com/mcp`. Im Programm Albatros bringt Bert ihn mit, sobald die Person in der Checkliste beim Schritt «Ausflüge von SwissActivities» den Schalter einschaltet (nur lesen, gebaut am 13.11.2026). Schau darum zuerst, ob du Werkzeuge wie `search_activities` schon hast. Wenn nicht, verbindest du ihn mit dem Ja der Person:

| KI | So |
|---|---|
| Claude Code | `claude mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp`, dann Claude Code neu starten |
| Codex | für eine Sitzung `codex -c 'mcp_servers.swissactivities.url="https://gateway.swissactivities.com/mcp"'`, dauerhaft `codex mcp add swissactivities --url https://gateway.swissactivities.com/mcp` |
| Cursor | in `.cursor/mcp.json`: `{"mcpServers":{"swissactivities":{"url":"https://gateway.swissactivities.com/mcp"}}}`, dann Cursor neu starten |
| Gemini CLI | `gemini mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp` |

Geprüft am 13.11.2026 ohne Modell: Claude Code 2.1.118 meldet «✓ Connected», Codex 0.166.0 zeigt den Server mit `-c` an. Cursor und Gemini CLI nach ihrer Anleitung, nicht gemessen.

Die Werkzeuge (14, gelesen am 13.11.2026):

| Wofür | Werkzeug |
|---|---|
| Angebote finden und genau ansehen | `search_activities`, `get_activity_details` |
| Preis und freie Plätze an einem Tag | `check_availability` |
| Orte wie Spielplätze oder Museen, mit Öffnungszeiten | `search_places`, `get_place_details` |
| Wanderungen, auch für Kinder und Kinderwagen | `search_hikes`, `get_hike_details` |
| Wetter | `get_weather` |
| Anreise mit Zug, Bus und Schiff | `plan_journey` |
| Bahnpässe | `find_rail_passes`, `recommend_rail_pass` |
| Sehenswürdigkeiten | `get_point_of_interest` |
| Karte mit Fotos und Links | `show_on_map` |
| Ein freier Tag, was tun? | `plan_free_time` |

## 2. Eine Empfehlung recherchieren

1. **Frag nach dem Erlebnis.** Wo wart ihr? Wie alt waren die Kinder? Was war toll, was mühsam? Gibt es einen Tipp, den nur du kennst?
2. **Finde das Angebot** mit `search_activities` (bei Familien mit `for_families`), `search_places` oder `search_hikes`. Die Einzelheiten holst du mit `get_activity_details`.
3. **Alter:** aus `min_age` und `max_age`. Fehlen sie, schreibst du «Alter: nicht angegeben».
4. **Wetter:** Drinnen oder draussen und ob es bei Regen geht, steht im Ergebnis (`rain_ok`). Für einen bestimmten Tag fragst du `get_weather`.
5. **Preis:** `check_availability` für ein Datum, mit Erwachsenen und Kindern. Du schreibst: «CHF … für 2 Erwachsene und 2 Kinder am <Datum>, geprüft am <TT.MM.JJJJ>».
6. **Anreise:** `plan_journey` vom Bahnhof, den die Person nennt. Du schreibst nur Dauer und Umsteigen, keine Abfahrtszeiten; die ändern sich.
7. **Link:** den `booking_url` genau so, wie das Werkzeug ihn liefert, mit allem nach dem «?». Nie kürzen, nie selbst bauen.

Den Beitrag schreibst du dann mit dem Skill `blog`, mit der Vorlage für Familien-Empfehlungen. Vor jedem neuen Veröffentlichen prüfst du Preise nochmals.

## 3. Das Widget holen (macht die Person)

1. Öffne partner.swissactivities.com und melde dich an. Dein Passwort tippst du nur dort.
2. Klick auf «Widget-Builder» und dann auf «Neues Widget».
3. Wähl eine Vorlage: Aktivitäten-Raster, Highlights-Karussell, Katalog oder Karte.
4. Wähl die Angebote aus und klick auf «Veröffentlichen».
5. Kopier die Widget-ID und gib sie mir im Chat.

Ein Widget pro Thema reicht, zum Beispiel «Regentage mit Kind». Es kann auf mehreren Seiten stehen.

## 4. Das Widget einbauen

So sieht der Code von SwissActivities aus:

```html
<sa-widget widget-id="…" locale="de-CH"></sa-widget>
<script type="module" src="https://studio.swissactivities.com/v1/embed.mjs"></script>
```

Auf der Seite wird daraus eine Komponente, `web/src/components/SwissActivities.astro`. Sie lädt das Skript erst, wenn der Kasten fast zu sehen ist. Grund: Das Skript hat rund 70 KB, und `pruefen.mjs` erlaubt 50 KB JavaScript je Seite. Gemessen am 13.11.2026 mit Astro 7.4.11: beim Laden 0 KB und kein Kontakt zu SwissActivities, nach dem Scrollen 70 KB und das Widget läuft.

```astro
---
// Baustein von SwissActivities (Skill swissactivities). Die Widget-ID ist nicht geheim.
interface Props { widgetId: string; locale?: string; link?: string }
const { widgetId, locale = 'de-CH', link } = Astro.props;
---
<div class="sa-baustein" data-sa-baustein>
  <sa-widget widget-id={widgetId} locale={locale}></sa-widget>
  {link && <p><a href={link}>Angebot bei SwissActivities ansehen</a></p>}
  <p class="sa-hinweis">Ich arbeite bei SwissActivities. Die Tipps sind meine eigenen.</p>
</div>
<script is:inline type="module">
  const kaesten = document.querySelectorAll('[data-sa-baustein]');
  const laden = () => { if (!window.__saGeladen) { window.__saGeladen = true; import('https://studio.swissactivities.com/v1/embed.mjs'); } };
  const beobachter = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { beobachter.disconnect(); laden(); } }, { rootMargin: '300px' });
  kaesten.forEach((k) => beobachter.observe(k));
</script>
<style>
  /* Nur Werte aus design/tokens.css, Namen wie dort */
  .sa-baustein { margin-block: var(--abstand-4); }
  .sa-hinweis { color: var(--farbe-text); font-size: 0.875em; }
</style>
```

1. **Platz:** zuerst der eigene Text, dann das Widget. Steht es ganz oben, lädt es sofort, und `pruefen.mjs` wird rot.
2. **Sprache:** `locale` ist die Sprache der Seite, so wie sie im Code aus dem Partnerbereich steht (Deutsch: `de-CH`).
3. **Link als Rückfall:** `link` ist der `booking_url` des Angebots. So kommt man auch ohne JavaScript zum Angebot.
4. **Aussehen:** Rund um das Widget nur Werte aus `design/tokens.css`. Das Widget selbst bringt sein eigenes Aussehen mit.
5. **Im Blog:** Ein Beitrag nennt die ID im Kopf (`widget:`), die Seite des Beitrags zeigt dann die Komponente (Skill `blog`).
6. **Prüfen und veröffentlichen:** Vorschau ansehen (`vorschau_starten`), `node scripts/pruefen.mjs`, Eintrag ins Logbuch. Dann klickt die Person in Albatros auf «Veröffentlichen». Ohne das Programm gilt der Skill `webseite-aendern`.

## 5. Hinweis und Datenschutz

1. **Hinweis:** Der Satz «Ich arbeite bei SwissActivities. Die Tipps sind meine eigenen.» steht im Fuss jeder Seite oder auf «Über mich» und neben jedem Widget (die Komponente bringt ihn mit).
2. **Datenschutzerklärung:** Ergänze sie mit dem Skill `recht-ch`. Vorschlag:
   > Auf einigen Seiten zeigen wir Angebote von SwissActivities. Erst wenn du zu diesem Kasten scrollst, lädt dein Browser Inhalte von studio.swissactivities.com und widget.swissactivities.com, bei einer Karte auch Kartenbilder von tiles.openfreemap.org. Dabei sehen diese Server deine IP-Adresse. Buchst du, gelten die Bestimmungen von SwissActivities.

   Die Adressen sind am 13.11.2026 aus dem Skript gelesen. Kommt eine Vorlage dazu, prüfst du sie nochmals.

## Stolpersteine

- Preis aus dem Gedächtnis: Er stimmt fast nie. Immer `check_availability`, mit Datum.
- Link gekürzt oder abgetippt: Er führt dann vielleicht nicht zum richtigen Angebot. Genau übernehmen.
- Widget-ID und API-Schlüssel verwechselt: Die ID gehört in den Code, ein Schlüssel nie.
- Ein Konto oder eine Seite, die aussieht wie die offizielle von SwissActivities: Name und Logo sind die eigenen.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «der Wegweiser am Wanderweg», der den Kern noch einmal sagt. Danach: was geschafft ist, wo es liegt, was noch offen ist und was als Nächstes kommt.
