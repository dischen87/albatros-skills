---
name: kosten
description: "Draws up an honest household budget book for the person's project: Albatros plan (only once the site lives with Albatros; up to the site on their own computer, Albatros is free), domain, AI subscription, email, extra services, a provider or your own server when hosting it yourself. Albatros prices only from konto_status. Explains which costs are fixed and which vary, how to avoid nasty surprises and when a move pays off. Use this skill for “how much does it cost?”, “costs”, “prices”, “too expensive”, “budget”, “invoice”, “bill”, “is it worth it?”, “how much is a server?”, and before the person adds a new paid service."
metadata:
  stand: 0.3.3
  quelle: 'da041e2a8b74'
---

# Costs: the household budget book

## The picture

Like a household budget book for a flat: there's **rent** (fixed costs every month), **running costs** (depending on how much you use) and **one-off purchases**. If you write everything down, there are no surprises on the bill.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with assumptions marked `[Annahme: …]`. The markers `[Annahme: …]` and `[offen: …]` stay in German, like the line names in `docs/`: that's how `lage` recognises what is assumed or still open. Only ask about what's missing at the end.
- Casual “you”, honest, no sales pressure. Never state prices from memory as fact. You only name Albatros prices from `konto_status`. For other providers you say “about” and send the person to their pricing page.
- **Free until it's local:** as long as the site is being built and released on their own computer, Albatros costs nothing. A plan is only needed once the site is to live with Albatros (skill `lancieren`, where it lives). Anyone who goes online by hosting it themselves pays the provider, not Albatros.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. What's already running?

Ask and write it down:

| Item | Type | Typical range | Where the exact price comes from |
|---|---|---|---|
| Albatros plan (only once the site lives with Albatros) | rent | depends on the plan: Light without, Pilot with its own server | `konto_status` |
| Hosting it yourself: a provider for static sites or your own server | rent | for static sites there are free offers with limits, your own server costs something every month | the provider's pricing page |
| Own domain (`.ch`), with Light or Pilot | rent per year, separate from the plan | about the price of a cinema ticket a year | `domain_suchen` or the registrar's pricing page |
| AI in the terminal (Claude Code, Codex, Gemini CLI, Cursor) | rent | from 8 USD a month with Cursor Plus, otherwise from about 20 USD: Claude Pro, ChatGPT Plus or, for Gemini CLI, Google AI Pro; a free account isn't enough, or only for a few tries | the provider's pricing page; paid there, not at Albatros |
| Email with your own domain | rent | small | provider |
| Statistics (e.g. PostHog) | running costs | usually free up to a limit | pricing page |
| Sending emails (newsletter) | running costs | free up to a limit, then per email | pricing page |
| Paid advertising | running costs | you decide | ad account |

### 2. Find the traps

- **Running costs without a cap:** for anything that costs per use (AI interfaces, sending emails, advertising), set a monthly limit. Most providers have a setting for it. The person sets it themselves.
- **Free trial periods:** write down the date they end.
- **Yearly subscriptions:** note the notice period.
- **Paying twice:** two services that do the same thing.

### 3. The household budget book in the project

Write the table with the person into `docs/kosten.md` in their project, with the monthly total, the yearly total and a line “Next review: <date in three months>”. Then an entry in the logbook (skill `git-logbuch`). The file reaches the harbour or the provider with the next push, at the earliest when going live.

### 4. When is more power or a move worth it?

- **From Free to Light or Pilot:** only once the released site is to live with Albatros (skill `lancieren`). Until then, Free is enough.
- **From Light to Pilot:** as soon as a program should run on the site (database, sign-in, your own CMS). For your own domain, Light is enough.
- **More power at Albatros:** when the site gets slow and `free -h` keeps showing little free desk space.
- **Moving to a server of your own** (skill `landung`): when the project earns money, needs more power for good than the biggest plan offers, or the person wants to have everything in their own hands. A server of your own is often cheaper in rent but more expensive in your own time: nobody does updates, backups and monitoring for you any more.

### 5. Check the mission

The budget book is part of choosing where the site lives (skill `lancieren`, part 1). `mission_pruefen` with `flugschule-08-kosten`: the check looks on the island whether the project is at the step “Wohnort” (where it lives).

## Final message

Your last message in this step starts with one sentence on the picture “the household budget book” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
