---
name: statistik
description: "Sets up privacy-friendly statistics for a website with a person who has no prior knowledge, using PostHog. First a small event plan (which ticks do we count, and exactly when), then the set-up, one goal event such as “enquiry sent”, filtering out your own visits and comparing with the real enquiries. Use this skill for “statistics”, “analytics”, “count visitors”, “how many people visit my site”, “PostHog”, “Google Analytics”, “tracking”, “conversion”, “measure an event”, “where do my visitors come from”."
---

# Statistics: the tally sheet at the shop door

## The picture

A shop owner keeps a tally sheet at the door. She only counts what's on the list beforehand, and she only makes a tick once it has really happened: the customer has paid, not just pulled out their wallet. She doesn't remember faces.

That's exactly how your website's statistics should work: a few clearly named ticks, counted at the right moment, without storing more about the visitors than necessary. In statistics, a tick is called an **event**.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, no jargon. “Event” only after the picture of the tally sheet.
- Data protection isn't an add-on. Every setting that stores more about people needs a reason and a sentence in the privacy policy (skill `recht-ch`).
- The person creates the PostHog account themselves in the browser. They may give you the project key (starts with `phc_`): it's meant for the website and is public. Personal API keys (`phx_`) never belong in the code.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. First the list, then the set-up

Create `docs/statistik.md` with the person. One goal event is enough to start with: the action that counts for them (from `docs/plan.md`, “How we'll know it works”).

```markdown
# Event plan

| Event | counts when | Required details |
|---|---|---|
| `$pageview` | automatically on every page view | – |
| `generate_lead` | form sent successfully (the server has confirmed) | `form` (which form) |
| `sign_up` | newsletter sign-up confirmed | `location` (where on the site) |

Own visits: filtered out since <date>
Changes: <date> – <what was renamed, why>
```

Naming rules: lower case with underscores (`generate_lead`), prefer well-known standard names (`purchase`, `sign_up`, `generate_lead`), one event per action, variants as a detail (`form: "kontakt"`), never name it after its position (`schritt_2`).

### 2. Create a PostHog project

The person signs up at PostHog, chooses the **EU** location and creates a project. Then they give you the project key.

### 3. Set it up

Put the current snippet from the PostHog instructions (“Web snippet”) into the head of every page, with these settings:

```js
posthog.init('phc_…', {
  api_host: 'https://eu.i.posthog.com',
  persistence: 'memory',              // no cookies, no banner needed
  person_profiles: 'identified_only', // no profiles of anonymous visitors
})
```

`persistence: 'memory'` means: every page view gets counted, but PostHog doesn't remember anyone through cookies. In exchange, the numbers for “unique visitors” are less precise. Check in the current PostHog instructions whether there's a better cookieless setting by now.

### 4. The goal event at the right moment

Only count after success, not when the form is opened:

```js
// after the server has confirmed the form:
posthog.capture('generate_lead', { form: 'kontakt' })
```

Never send names, email addresses, phone numbers or free text as details.

### 5. Filter out your own visits

In PostHog, in the project settings, switch on “Filter out internal and test users” and set a filter (for example your own IP address). Enter the date in `docs/statistik.md`.

### 6. Check

1. Logbook and conveyor belt (skills `git-logbuch`, `pipeline`).
2. Open the site, send the form once as a test.
3. In PostHog under “Activity” or “Live events”: do `$pageview` and `generate_lead` show up with the detail `form`?
4. After a week: does the number of `generate_lead` roughly match the real enquiries in the inbox? If not: does the event fire when the form opens instead of on success? Are tests being counted too?

## Stumbling blocks

- The event fires on loading instead of on success: attempts turn into successes.
- Too many events at once: nobody looks at them. Better three that are right.
- Renamed, but the reports not adjusted: that looks like a slump.
- Forgot the privacy policy: PostHog has to be listed there, with purpose and location (skill `recht-ch`).

## Check the mission

`mission_pruefen` with `webseite-08-statistik`. The check looks at whether `~/projekt/docs/statistik.md` exists and the site contains the PostHog set-up.

## Final message

Your last message in this step starts with one sentence on the picture “the tally sheet at the shop door” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
