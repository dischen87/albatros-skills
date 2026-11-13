---
name: seo-grundlagen
description: "Makes a small website visible: for search engines (SEO) and for AI assistants (GEO), explained for people with no prior knowledge with the picture of signposts and a city map. Page title and description, one main heading, canonical address, picture descriptions, sitemap.xml, robots.txt, structured data by kind of business, the preview when sharing, llms.txt, facts and questions with answers, Google Search Console, Bing Webmaster Tools, IndexNow and Business Profile; checked with sichtbar-pruefen.mjs on the built site. Use this skill for “SEO”, “GEO”, “become visible”, “get found on Google”, “Google can't find my site”, “get found in ChatGPT”, “AI search”, “search engine”, “sitemap”, “meta description”, “Search Console”, “Bing”, “IndexNow”, “llms.txt”, “get found locally”, “Google Maps listing”."
metadata:
  stand: 0.3.2
  quelle: 'd1e923bdddba'
---

# SEO basics: signposts and a city map

## The picture

A search engine is a city map that a hard-working messenger redraws every day. They walk through the streets, read the signs and mark down what they find. For your shop to be on the map, it needs:

- **a clear sign above the door** (page title and main heading),
- **signposts** from other places to you (links),
- **a site plan** you hand to the messenger (`sitemap.xml`),
- **house rules** for the messenger: where they're allowed to go (`robots.txt`).

Today many people no longer ask the city map but an information desk: an AI assistant that gives the answer itself straight away. The information desk only recommends what it knows for sure. It needs clear facts about your shop that are the same everywhere.

The technical words for this are **SEO** (getting found in search engines) and **GEO** (getting named in AI answers). What counts most for both is that the site answers the searcher's question well.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with assumptions marked `[Annahme: …]`. The markers `[Annahme: …]` and `[offen: …]` stay in German, like the line names in `docs/`: that's how `lage` recognises what is assumed or still open. Only ask about what's missing at the end.
- Casual “you”. Don't promise miracles: getting found takes weeks, not hours, and nobody can promise a place in a search or in an AI answer. No tricks (hidden text, bought links, texts only for machines), they do more harm than good.
- **Don't make anything up:** no reviews, stars, customer numbers, awards or quotes that don't exist. Every number on the site comes from the person or from a source you opened yourself, and it's shown with that source.
- **Accounts belong to the person:** at Google and Microsoft they sign in themselves, in their own browser. You never enter access details, not even if they tell you them, and you don't confirm anything in their name: they click “Verify”. You prepare what has to be on the site and tell them every click.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## What comes when

- **While building** (skill `webseite-bauen`), on the person's computer: everything that's in the site, steps 1 to 6. The script `sichtbar-pruefen.mjs` checks it on the built site.
- **After going live** (skill `lancieren`), with the real address: Search Console, Bing Webmaster Tools, IndexNow and the Business Profile, steps 7 to 10. Easiest with an own domain (skill `domain`).
- **With the Albatros app** (skill `lotse`, section “The Albatros app” (Berts Arbeitsplatz)), the stage “Get found” shows the same twelve points as the script, in everyday words (“Show up on Google”). Call `naechstes` at the start and after every step: it says how many points are still missing there, and brings what the person asks for in Albatros. If their message names points of the check, you take care of exactly those and change only what's needed for that.

## Steps

### 1. What are people searching for and asking?

Write down with the person five phrases their audience would type into Google (“lunch club Wipkingen”, “bike repair Bern Länggasse”), and five questions they would ask an AI (“Where can I get my bike fixed in the Länggasse, and what does a service cost?”). One main phrase per page. It goes into `docs/recherche.md`, in the line `Suchbegriffe:`; if there's already something there from the research (P2), you build on it.

### 2. Every page: the sign above the door

- **Page title** (`<title>`): what + place or benefit + name, about 50 to 60 characters. Every page gets its own. (point “titel”)
- **Description** (`<meta name="description">`): one or two sentences that invite a click, about 150 characters, a different one on every page. Often shown under the title in the search results. (point “beschreibung”)
- **Exactly one main heading** (`<h1>`) per page, with subheadings below it. (point “h1”)
- **Readable addresses:** `/angebot/mittagstisch` instead of `/seite?id=7`.
- **Pictures:** each with a description (`alt`, for pure decoration `alt=""`), with `width` and `height`, under 500 KB (skills `barrierefreiheit` and `inhalte`). (point “bilder”)
- **Language:** `<html lang="de-CH">` (or the site's own language, e.g. `en` for an English site).
- **One main address:** the site can be reached either with or without `www`, and the other version redirects. Every page names its one full address with `<link rel="canonical" href="https://…">`. With Astro, the main address is set as `site` in `web/astro.config.mjs` (the address from `docs/lancieren.md`, line `Adresse:`), and the layout writes `<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)}>`. (point “kanonisch”)
- **Internal links:** every page is linked from at least one other page, with a link text that says where it goes.
- **Preview when sharing** (Open Graph): `og:title`, `og:description`, `og:image` (full address, a picture of its own, about 1200 × 630 px) and `og:url` on every page. That way a shared link shows a picture and text instead of a bare address. (point “open_graph”)

### 3. Site plan and house rules

- **`web/public/sitemap.xml`:** all public pages with their full address (`https://…`), one `<url><loc>…</loc></url>` per page. For the five to seven pages of the first flight you write it by hand and update it with every new page; the script in step 6 reports if a page is missing or one too many is in it. Google only reads the addresses from it and, if it's correct, the date of the last change; it ignores `priority` and `changefreq`. From many pages on, Astro's integration generates it (`npx astro add sitemap`, needs `site`); then the file is called `sitemap-index.xml`, and the script reads that too. The mission below checks `sitemap.xml`, so for the first flight it stays with the file written by hand. (point “sitemap”)
- **`web/public/robots.txt`:** (point “robots”)
  ```
  User-agent: *
  Allow: /

  Sitemap: https://<domain>/sitemap.xml
  ```
  The line `Sitemap:` needs the full address. Through it, search engines that nobody has submitted the site plan to can find it too.
- **AI messengers:** whoever wants to appear in AI answers doesn't lock out their messengers. Whether the site's texts may also be read for training AI models is the person's decision; you ask them and enter it. Single messengers are locked out with a block of their own (`User-agent: GPTBot`, with `Disallow: /` below it); at Google, `Google-Extended` only controls training, not search.

### 4. Structured data: the details of the business, machine-readable

A block `application/ld+json` (JSON-LD, vocabulary schema.org) in the head of the home page tells search engines and AI assistants who this is, without guessing. The kind (`@type`) depends on the business, as precise as possible: (point “strukturierte_daten”)

| What the person has | `@type` | What goes in |
|---|---|---|
| Shop, practice, studio, workshop, restaurant with an address | `LocalBusiness` or more precise (`Restaurant`, `BikeStore`, `HairSalon`, `Dentist` …) | `name`, `address` (Google requires both), plus `telephone`, `url`, `openingHoursSpecification`, `geo` |
| Club, company without a shop, project | `Organization` (a club also `SportsOrganization`, `NGO` …) | `name`, `url`, `logo`, contact |
| One person (freelance, an artist) | `Person` | `name`, `jobTitle`, `url` |
| Courses and events with a date | `Event`, one block per event | `name`, `startDate`, `location` |
| Products with a price | `Product` with `offers` | `name`, `image`, price and currency |

Rules: the block only contains what's also visible on the site, with the same words and numbers. No stars and reviews of your own business (`aggregateRating`, `review`): Google doesn't show them for `LocalBusiness` and `Organization` when the business manages them itself, and made-up ones are forbidden. No `[Annahme: …]` and no `[placeholder: …]` in the block. The person can check it after going live with Google's “Rich Results Test”.

### 5. For AI answers: facts that can be quoted

An AI assistant names a site when it finds a clear answer with evidence in it. That takes no tricks and, according to Google, no special files either: what's good for search is also good for Google's AI answers. What helps beyond that:

- **A facts section** on the home page or under “About us”: who, what, for whom, where, when it's open, what it costs, how to send an enquiry. In whole sentences that are true on their own (“The Länggasse bike workshop repairs bikes of all brands, usually by the next day”), not only in pictures or tables.
- **Questions and answers:** the five questions from step 1, each with an answer in two or three sentences, visible on the site. Only questions that really get asked; the person confirms the answers.
- **Sources:** every number and every claim has evidence: a detail of your own with a date (“as of November 2026”) or a link to the source. Whatever can't be backed up is dropped.
- **The same details everywhere:** name, address, phone and opening hours are the same character for character on the site, in the structured data, in the Business Profile and in directories.
- **`web/public/llms.txt`:** a short overview for AI assistants, in Markdown: first `# <name>`, then a summary as a quote (`> …`), then under `## Pages` the most important pages as links with half a sentence each. Only checked facts, nothing that isn't on the site too. To be honest about it: this is a proposal (llmstxt.org), not a standard; Google says no such file is needed, and whether other assistants read it isn't certain. It costs five minutes and does no harm. (point “llms_txt”)

  ```markdown
  # Länggasse bike workshop

  > Bike repairs in the Länggasse in Bern, usually by the next day. Open Tuesday to Saturday.

  ## Pages

  - [Offer](https://<domain>/angebot/): service and repairs with prices
  - [Contact](https://<domain>/kontakt/): address, opening hours, phone
  ```

### 6. Fast and light, then check

Shrink pictures (skill `inhalte`), only load the fonts and scripts you need: per page at most 1 MB with everything it includes directly. (point “gewicht”)

Then the script in this skill checks the built site, without the network and without changing anything:

```bash
mkdir -p scripts && cp <folder of this skill>/sichtbar-pruefen.mjs scripts/
# folder unknown: curl -fsSL https://raw.githubusercontent.com/dischen87/albatros-skills/main/plugins/albatros/skills/seo-grundlagen/sichtbar-pruefen.mjs -o scripts/sichtbar-pruefen.mjs
(cd web && npm run build) && node scripts/sichtbar-pruefen.mjs        # the built site in seite/ (otherwise dist/)
node scripts/sichtbar-pruefen.mjs --json                               # the same as JSON, with the twelve names
```

It reports twelve points with a traffic light, with fixed names (the same in every language): “titel”, “beschreibung”, “h1”, “bilder”, “sitemap”, “robots”, “kanonisch”, “strukturierte_daten”, “open_graph”, “llms_txt”, “gewicht” and “indexnow”. Red means: this prevents the site being found or distorts it; fix it, build again, check again. Yellow means: recommended. What the script can't see, you tell the person honestly: whether the facts are true, whether others link to them, and everything that only works in their accounts. On top of that, Lighthouse in Chrome (right-click, “Inspect”, “Lighthouse”, categories “SEO” and “Performance”); while building, `pruefen.mjs` already measures that (skill `webseite-bauen`).

### 7. Google Search Console: let the messenger know

After going live. The Search Console is the window through which the person sees what Google knows about their site. This is how it works (checked on 10.11.2026 against Google's help):

1. The person opens search.google.com/search-console, signs in with their Google account and adds their site. There are two kinds: **Domain** (everything under the domain, only works with an entry in the domain's phone book, the DNS) and **URL prefix** (exactly one address like `https://www.<domain>/`, also works with a file).
2. **Ownership by file** (URL prefix): Google gives them a small file to download. They put it into the project folder for you, you put it unchanged into `web/public/` (name and content stay as they are), then the site goes online again with this file (skill `webseite-aendern`: the person's release, and only then the push). You check that the file answers at its address; the person clicks “Verify”.
3. **Ownership by DNS entry** (Domain or URL prefix): Google shows a TXT record. The person enters it where their domain is managed (skill `domain`; at Albatros exactly like the TXT proof `_albatros`), then they click “Verify”. It can take minutes to hours until the entry is visible.
4. **The file or the entry stays for good:** Google checks again and again. Whoever removes them loses the verification.
5. **Submit the sitemap:** under “Sitemaps” the person enters the address of the sitemap (`https://<domain>/sitemap.xml`). That's a hint for Google, not a promise.
6. After a few days, “Pages” shows what has been taken in and what hasn't, with the reason. They check single addresses with “URL inspection”.

Without an own domain (the address from Albatros), only the way **URL prefix** works, with a file or with the tag `<meta name="google-site-verification" …>` in the head of the home page, because Albatros manages the DNS of that address.

### 8. Bing Webmaster Tools

Bing also feeds other searches and some AI assistants. This is how it works (checked on 10.11.2026 against Bing's help and blog):

1. The person opens bing.com/webmasters and signs in with their Microsoft account.
2. **Easiest: import from the Search Console.** They choose “Import” and allow Bing access to their Search Console themselves. The site is then verified without further proof; Bing syncs with Google regularly. Only they give this permission, in their own browser.
3. **Or by hand:** the file `BingSiteAuth.xml` into `web/public/` (as with Google, unchanged), or the tag `<meta name="msvalidate.01" content="…">` in the head of the home page, or a DNS entry that Bing shows in the account. Then they click “Verify”.
4. Under “Sitemaps” they submit the same sitemap.

### 9. IndexNow: report new and changed pages straight away

IndexNow is a doorbell for search engines: instead of waiting until the messenger comes by, the site itself reports what's new. It applies to Bing and others (according to indexnow.org on 10.11.2026: Amazon, Bing, Naver, Seznam.cz, Yandex, Yep; a report to one goes to all), not to Google. A report is a hint, not a promise.

1. **Key:** 8 to 128 characters from `a–z`, `A–Z`, `0–9` and `-`. You generate it: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"`.
2. **Key file:** `web/public/<key>.txt`, its content exactly the key. The key isn't a secret, it's openly on the web; it only proves that the report comes from this site. Every address (with and without `www` too) needs its own file. (point “indexnow”)
3. **Report**, only once the site with the key file is live, and only with the person's yes, because this sends the addresses of their site to third parties:
   ```bash
   curl -s -o /dev/null -w '%{http_code}\n' "https://api.indexnow.org/indexnow?url=https://<domain>/&key=<key>"
   ```
   200 means accepted, 202 accepted and the key is still being checked, 403 the key doesn't match the file, 422 the address doesn't belong to this key, 429 too many reports. Several addresses go in one report as JSON (`host`, `key`, `urlList`, up to 10 000 addresses).
4. You report what's new, changed or deleted, not everything every day. If the person publishes with the Albatros app, the stage “Get found” says whether the report already runs along there; then you don't report twice.

### 10. For local businesses: the Business Profile

- Address, phone and opening hours as text on the site (not only in a picture), written the same way everywhere.
- **Google Business Profile** (formerly “Google My Business”): with it the business appears on Google Maps and to the right of the search. The person creates it themselves (google.com/business) and verifies it themselves, depending on the business by post, phone or video; that can take days. The same details as on the website, and the address of the website entered. Reviews there come from real customers; asking for them is allowed, buying them or writing them yourself never.
- A pointer, nothing more: you don't set up the profile and you don't sign in there.

### 11. Collect signposts

Real links from fitting places: the directory of the neighbourhood or trade association, partners, local media, clubs. No bought links. Every mention with the same details as on the site helps the AI assistants too: they're more likely to believe what's written the same way in several places.

## Stumbling blocks

- Promising a ranking: nobody can.
- Making up stars, reviews or numbers, even “just as an example”: that's deception (UWG) and it gets found out.
- Details in the JSON-LD that aren't on the site or read differently.
- Deleting Google's or Bing's verification file after the verification: then the verification is lost.
- Accepting the person's access details or clicking “Verify” for them: only they do that.
- Forgetting a `robots.txt` with `Disallow: /` from the building time: then nobody finds the site.
- The sitemap with a different address from the site (with instead of without `www`, `http` instead of `https`).

## Check the mission

Logbook and conveyor belt (skills `git-logbuch`, `pipeline`), then `mission_pruefen` with `webseite-09-seo-grundlagen`. The check looks at whether `https://{name}.aufwind.sh/sitemap.xml` and `/robots.txt` answer.

## Final message

Your last message in this step starts with one sentence on the picture “signposts and a city map” that sums up the core once more. Then: what's done (the twelve points with their traffic lights), where the result is, what the person has to do themselves in their accounts (Search Console, Bing, Business Profile) and what comes next. Say honestly that it can take weeks.
