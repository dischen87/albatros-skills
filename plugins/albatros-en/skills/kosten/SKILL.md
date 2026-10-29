---
name: kosten
description: "Draws up an honest household budget book for the person's project: Albatros plan, domain, AI subscription, email, extra services, later a server of their own. Explains which costs are fixed and which vary, how to avoid nasty surprises and when a move pays off. Use this skill for “how much does it cost?”, “costs”, “prices”, “too expensive”, “budget”, “invoice”, “bill”, “is it worth it?”, “how much is a server?”, and before the person adds a new paid service."
---

# Costs: the household budget book

## The picture

Like a household budget book for a flat: there's **rent** (fixed costs every month), **running costs** (depending on how much you use) and **one-off purchases**. If you write everything down, there are no surprises on the bill.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, honest, no sales pressure. Never state prices from memory as fact. Current Albatros prices come from `konto_status` or from albatros.build/preise. For other providers you say “about” and send the person to their pricing page.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. What's already running?

Ask and write it down:

| Item | Type | Typical range | Where the exact price comes from |
|---|---|---|---|
| Albatros plan | rent | depends on the plan | `konto_status` |
| Own domain (`.ch`) | rent per year | about the price of a cinema ticket a year | `domain_suchen` or the registrar's pricing page |
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

Write the table with the person into `docs/kosten.md` in their project, with the monthly total, the yearly total and a line “Next review: <date in three months>”. Then into the logbook (skill `git-logbuch`) and via the conveyor belt onto the server.

### 4. When is more power or a move worth it?

- **From Light to Pilot:** as soon as a program should run on the site (database, sign-in, your own CMS) or an own domain comes in.
- **More power at Albatros:** when the site gets slow and `free -h` keeps showing little free desk space.
- **Moving to a server of your own** (skill `landung`): when the project earns money, needs more power for good than the biggest plan offers, or the person wants to have everything in their own hands. A server of your own is often cheaper in rent but more expensive in your own time: nobody does updates, backups and monitoring for you any more.

### 5. Check the mission

`mission_pruefen` with `flugschule-08-kosten`. The check looks at whether `docs/kosten.md` is in the project (with Pilot in `~/projekt` on the server, with Light in the harbour).

## Final message

Your last message in this step starts with one sentence on the picture “the household budget book” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
