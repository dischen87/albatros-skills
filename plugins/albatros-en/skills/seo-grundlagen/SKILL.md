---
name: seo-grundlagen
description: "Makes a small website easy to find for search engines, explained for people with no prior knowledge with the picture of signposts and a city map. Page title and description, one main heading, readable addresses, picture descriptions, loading time, sitemap.xml, robots.txt, structured data for local businesses, Google Search Console and Business Profile. Use this skill for “SEO”, “get found on Google”, “Google can't find my site”, “search engine”, “sitemap”, “meta description”, “get found locally”, “Google Maps listing”."
---

# SEO basics: signposts and a city map

## The picture

A search engine is a city map that a hard-working messenger redraws every day. They walk through the streets, read the signs and mark down what they find. For your shop to be on the map, it needs:

- **a clear sign above the door** (page title and main heading),
- **signposts** from other places to you (links),
- **a site plan** you hand to the messenger (`sitemap.xml`),
- **house rules** for the messenger: where they're allowed to go (`robots.txt`).

The technical word for all of this is **SEO** (search engine optimisation). But what counts most is that the site answers the searcher's question well.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”. Don't promise miracles: getting found takes weeks, not hours. No tricks (hidden text, bought links), they do more harm than good.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. What are people searching for?

Write down with the person five phrases their audience would type into Google (“lunch club Wipkingen”, “bike repair Bern Länggasse”). One main phrase per page. It goes into `docs/plan.md`.

### 2. Every page: the sign above the door

- **Page title** (`<title>`): what + place or benefit + name, about 50 to 60 characters. Every page gets its own.
- **Description** (`<meta name="description">`): one or two sentences that invite a click, about 150 characters. Often shown under the title in the search results.
- **Exactly one main heading** (`<h1>`) per page, with subheadings below it.
- **Readable addresses:** `/angebot/mittagstisch` instead of `/seite?id=7`.
- **Picture descriptions** (`alt`), see skill `barrierefreiheit`.
- **Language:** `<html lang="de-CH">` (or the site's own language, e.g. `en` for an English site).
- **One main address:** the site can be reached either with or without `www`, and the other version redirects. `<link rel="canonical">` points to the main address.

### 3. Site plan and house rules

- `public/sitemap.xml`: all public pages with their full address. Many tools generate it automatically while building, otherwise by hand.
- `public/robots.txt`:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://<domain>/sitemap.xml
  ```

### 4. Fast and good on a phone

Shrink pictures (skill `inhalte`), only load the fonts and scripts you need. Check in Chrome with Lighthouse (right-click, “Inspect”, “Lighthouse”, categories “SEO” and “Performance”).

### 5. For local businesses

- Address, phone and opening hours as text on the site (not only in a picture), written the same way everywhere.
- Structured data: a small `application/ld+json` block of type `LocalBusiness` with name, address, phone, opening hours. It helps the search engine read the details correctly.
- Google Business Profile (formerly “Google My Business”): the person creates and verifies it themselves. The same details as on the website.

### 6. Let the messenger know

With an own domain (skill `domain`): the person adds the site in Google Search Console. They confirm ownership with a TXT record in the phone book, just like with Albatros. Then submit the sitemap there. For Bing there are the Bing Webmaster Tools.

### 7. Collect signposts

Real links from fitting places: the directory of the neighbourhood or trade association, partners, local media, clubs. No bought links.

## Check the mission

Logbook and conveyor belt (skills `git-logbuch`, `pipeline`), then `mission_pruefen` with `webseite-08-seo-grundlagen`. The check looks at whether `https://{name}.aufwind.sh/sitemap.xml` and `/robots.txt` answer.

## Final message

Your last message in this step starts with one sentence on the picture “signposts and a city map” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
