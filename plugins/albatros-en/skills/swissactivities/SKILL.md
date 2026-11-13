---
name: swissactivities
description: "Embeds SwissActivities building blocks in a person’s own website with family recommendations, for SwissActivities employees with no prior knowledge. Connects the AI to the public SwissActivities server (no sign-in), researches a recommendation with real facts only (age, weather, price with date, getting there by public transport), asks about the person’s own experience instead of inventing one, links with the booking link and embeds the widget from the partner area as an Astro component, with the note “I work at SwissActivities” and a line for the privacy policy. Use this skill for “SwissActivities”, “embed a widget”, “partner area”, “widget ID”, “write a recommendation”, “what to do with the kids”, “day trip with children”, “booking link”, “show activities on my site”."
metadata:
  stand: 0.3.2
  quelle: 'd6c73f8c489e'
---

# SwissActivities: the signpost on the hiking trail

## The picture

A yellow signpost shows the destination and the time, and it is right because someone measured it. Your recommendation is such a signpost: the numbers on it (age, price, getting there) come from the measurement, that is, from the SwissActivities tools. The story next to it comes from you.

**How to use the picture:** tell the person in one sentence in your first answer.

## How you talk

- Informal “you”, short sentences, one step at a time, at most two questions per message.
- Explain a word when it comes up: a **widget** is a ready-made box from SwissActivities that shows offers on your site.

## Five rules

1. **Say openly who recommends.** The person works at SwissActivities. On the site (in the footer or on “About me”) and next to every widget it says: “I work at SwissActivities. The tips are my own.” (in the language of the site). You add this sentence on your own and never leave it out. Reason: advertising must be recognisable as advertising; Swiss fair-trading law requires it.
2. **Real facts only.** You write prices, ages, opening hours and duration only if a tool returned them, with the date of the query. If a value is missing, it is unknown: “Price: see booking page”, never an estimate.
3. **Real experiences only.** The point of the site is the person’s own experience. You ask what she experienced. You never invent an experience, a quote, a child or a review.
4. **No keys.** The widget ID is not secret and may go into the code. You never ask for an API key and never store one.
5. **Promise nothing.** Whether there is a commission is handled by the partner area. How employees are credited is decided by SwissActivities (still open). You do not promise money.

## 1. Connect the tools

The SwissActivities server is public and needs no sign-in: `https://gateway.swissactivities.com/mcp`. In the Albatros app, Bert is meant to bring it along on his own; that is being built right now. So first check whether you already have tools such as `search_activities`. If not, connect it with the person’s yes:

| AI | How |
|---|---|
| Claude Code | `claude mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp`, then restart Claude Code |
| Codex | for one session `codex -c 'mcp_servers.swissactivities.url="https://gateway.swissactivities.com/mcp"'`, permanently `codex mcp add swissactivities --url https://gateway.swissactivities.com/mcp` |
| Cursor | in `.cursor/mcp.json`: `{"mcpServers":{"swissactivities":{"url":"https://gateway.swissactivities.com/mcp"}}}`, then restart Cursor |
| Gemini CLI | `gemini mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp` |

Checked on 13.11.2026 without a model: Claude Code 2.1.118 reports “✓ Connected”, Codex 0.166.0 lists the server with `-c`. Cursor and Gemini CLI according to their documentation, not measured.

The tools (14, read on 13.11.2026):

| What for | Tool |
|---|---|
| Find offers and look at them closely | `search_activities`, `get_activity_details` |
| Price and free places on a given day | `check_availability` |
| Places such as playgrounds or museums, with opening hours | `search_places`, `get_place_details` |
| Hikes, also for children and pushchairs | `search_hikes`, `get_hike_details` |
| Weather | `get_weather` |
| Getting there by train, bus and boat | `plan_journey` |
| Rail passes | `find_rail_passes`, `recommend_rail_pass` |
| Sights | `get_point_of_interest` |
| Map with photos and links | `show_on_map` |
| A free day, what to do? | `plan_free_time` |

## 2. Research a recommendation

1. **Ask about the experience.** Where were you? How old were the children? What was great, what was a hassle? Is there a tip only you know?
2. **Find the offer** with `search_activities` (for families with `for_families`), `search_places` or `search_hikes`. Get the details with `get_activity_details`.
3. **Age:** from `min_age` and `max_age`. If they are missing, write “Age: not stated”.
4. **Weather:** indoors or outdoors and whether it works in the rain is in the result (`rain_ok`). For a specific day, ask `get_weather`.
5. **Price:** `check_availability` for a date, with adults and children. You write: “CHF … for 2 adults and 2 children on <date>, checked on <DD.MM.YYYY>”.
6. **Getting there:** `plan_journey` from the station the person names. You write only duration and changes, no departure times; they change.
7. **Link:** the `booking_url` exactly as the tool returns it, with everything after the “?”. Never shorten it, never build it yourself.

You then write the post with the skill `blog`, using the template for family recommendations. Before each new publication you check prices again.

## 3. Get the widget (the person does this)

1. Open partner.swissactivities.com and sign in. You type your password only there.
2. Click “Widget-Builder” and then “Neues Widget” (names as in the German partner area).
3. Choose a template: “Aktivitäten-Raster” (activity grid), “Highlights-Karussell” (carousel), “Katalog” (catalogue) or “Karte” (map).
4. Choose the offers and click “Veröffentlichen” (publish).
5. Copy the widget ID and give it to me in the chat.

One widget per topic is enough, for example “Rainy days with kids”. It can appear on several pages.

## 4. Embed the widget

This is what the SwissActivities code looks like:

```html
<sa-widget widget-id="…" locale="de-CH"></sa-widget>
<script type="module" src="https://studio.swissactivities.com/v1/embed.mjs"></script>
```

On the site it becomes a component, `web/src/components/SwissActivities.astro`. It loads the script only when the box is almost in view. Reason: the script is about 70 KB, and `pruefen.mjs` allows 50 KB of JavaScript per page. Measured on 13.11.2026 with Astro 7.4.11: 0 KB and no contact with SwissActivities on load, 70 KB after scrolling and the widget runs.

```astro
---
// SwissActivities building block (skill swissactivities). The widget ID is not secret.
interface Props { widgetId: string; locale?: string; link?: string }
const { widgetId, locale = 'de-CH', link } = Astro.props;
---
<div class="sa-baustein" data-sa-baustein>
  <sa-widget widget-id={widgetId} locale={locale}></sa-widget>
  {link && <p><a href={link}>View the offer at SwissActivities</a></p>}
  <p class="sa-hinweis">I work at SwissActivities. The tips are my own.</p>
</div>
<script is:inline type="module">
  const kaesten = document.querySelectorAll('[data-sa-baustein]');
  const laden = () => { if (!window.__saGeladen) { window.__saGeladen = true; import('https://studio.swissactivities.com/v1/embed.mjs'); } };
  const beobachter = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { beobachter.disconnect(); laden(); } }, { rootMargin: '300px' });
  kaesten.forEach((k) => beobachter.observe(k));
</script>
<style>
  /* Only values from design/tokens.css, names as there */
  .sa-baustein { margin-block: var(--abstand-4); }
  .sa-hinweis { color: var(--farbe-text); font-size: 0.875em; }
</style>
```

1. **Place:** first your own text, then the widget. If it sits right at the top, it loads at once and `pruefen.mjs` turns red.
2. **Language:** `locale` is the language of the page, as it appears in the code from the partner area (German: `de-CH`).
3. **Link as fallback:** `link` is the `booking_url` of the offer. That way people reach the offer even without JavaScript.
4. **Look:** around the widget only values from `design/tokens.css`. The widget itself brings its own look.
5. **In the blog:** a post names the ID in its header (`widget:`), and the post page then shows the component (skill `blog`).
6. **Check and publish:** look at the preview (`vorschau_starten`), `node scripts/pruefen.mjs`, an entry in the logbook. Then the person clicks the publish button in Albatros. Without the app, the skill `webseite-aendern` applies.

## 5. Note and privacy

1. **Note:** the sentence “I work at SwissActivities. The tips are my own.” is in the footer of every page or on “About me”, and next to every widget (the component brings it along).
2. **Privacy policy:** add to it with the skill `recht-ch`. Suggestion:
   > On some pages we show offers from SwissActivities. Only when you scroll to this box does your browser load content from studio.swissactivities.com and widget.swissactivities.com, for a map also map images from tiles.openfreemap.org. These servers see your IP address. If you book, the terms of SwissActivities apply.

   The addresses were read from the script on 13.11.2026. If a template is added, check them again.

## Stumbling blocks

- A price from memory: it is almost never right. Always `check_availability`, with a date.
- A shortened or retyped link: it may then not lead to the right offer. Copy it exactly.
- Widget ID and API key mixed up: the ID belongs in the code, a key never.
- An account or site that looks like the official SwissActivities one: the name and logo are the person’s own.

## Final message

Your last message in this step starts with a sentence about the picture “the signpost on the hiking trail” that says the core once more. Then: what is done, where it is, what is still open and what comes next.
