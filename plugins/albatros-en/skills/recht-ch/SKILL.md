---
name: recht-ch
description: "Gets a small Swiss website legally in order, explained for people with no prior knowledge with the picture of the doorbell nameplate and house rules: legal notice (Impressum, UWG Art. 3 para. 1 let. s), privacy policy under the revised Swiss data protection act revDSG (duty to inform, Art. 19), cookies (Art. 45c FMG), when the EU's GDPR comes in as well, picture rights, marketing emails only with consent. Not legal advice. Use this skill for “Impressum”, “legal notice”, “data protection”, “privacy policy”, “DSG”, “GDPR”, “DSGVO”, “cookie banner”, “do I legally need this”, “what has to be on my website”, “contact form and data protection”."
---

# Swiss law: doorbell nameplate and house rules

## The picture

- **Legal notice = the nameplate by the doorbell:** Who lives here, and how do you reach them?
- **Privacy policy = house rules for visitors:** What happens to what visitors give you or leave behind (their name in a form, traces in the statistics)?
- **Cookies = little notes you slip into visitors' pockets** so you recognise them again. You have to tell people about that.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, simple but precise: name the law and the article.
- Always add: “This isn't legal advice. If you're unsure, if you handle sensitive data (health, children) or have a lot of turnover, it's worth asking a professional.”
- Never blindly copy a template from the internet. Every sentence has to fit the site. A policy that names services that don't exist, or forgets real ones, is wrong.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. Take stock

Ask and write it down:

- Who runs the site (private person, association, sole proprietorship, GmbH, i.e. a limited company)? Do they sell anything online?
- What data comes in? Contact form, newsletter, order, account, statistics (skill `statistik`), embedded maps or videos, fonts from other people's servers.
- Where do the services run? Albatros server (Germany/Finland, EU), PostHog (EU), email sending, payment provider (often USA).
- Is the site also aimed at people in the EU (delivery, prices in euros, language)?

### 2. Legal notice (`/impressum`)

Mandatory for anyone offering goods, works or services online (UWG, the Swiss Unfair Competition Act, Art. 3 para. 1 let. s): clear and complete details of identity and contact address, including email. Recommended even when it isn't mandatory.

- Name or company name (as in the Handelsregister, the Swiss commercial register), legal form
- Postal address (not just a PO box)
- Email address
- if there is one: UID number (Swiss business identification number), Handelsregister entry, responsible person

Keep the page addresses `/impressum` and `/datenschutz` as they are, even on an English site: the mission check looks for exactly these.

### 3. Privacy policy (`/datenschutz`)

The revised Data Protection Act (revDSG, the Swiss Federal Act on Data Protection, in force since 1 September 2023) requires you to inform people when you collect personal data (Art. 19). That already happens with a contact form or with statistics that use IP addresses. Contents:

1. Who is responsible, with contact details
2. Which data, for what (per purpose: contact, newsletter, order, statistics)
3. Who it goes to (hosting, statistics, email sending, payment), with the country. For countries without adequate data protection: which safeguards apply
4. How long it's kept
5. Visitors' rights: access (Art. 25), correction, deletion, and how to exercise them
6. Date of the last change

If the site is also aimed at people in the EU, the GDPR (General Data Protection Regulation, in German DSGVO) may apply as well (Art. 3(2) GDPR). Then also name the legal basis for each purpose.

### 4. Cookies and statistics

- Switzerland: anyone who sets cookies has to inform people about the processing and its purpose, and say how to refuse them (Art. 45c FMG, the Swiss Telecommunications Act). A note in the privacy policy is usually enough for that.
- EU audience: cookies that aren't necessary (statistics, advertising) need consent beforehand. Then a banner with an equally easy “Reject”.
- Simplest of all: no unnecessary cookies. The statistics from the skill `statistik` run without cookies. Host fonts locally instead of loading them from other people's servers.

### 5. Marketing emails

Advertising by email only with prior consent (UWG Art. 3 para. 1 let. o). Exception: your own customers, who were told when they bought that they can refuse, for your own similar offers. In every email: the correct sender and a simple, free unsubscribe link. Newsletter sign-up with a confirmation email (double opt-in), so the consent can be proven.

### 6. Pictures and texts

Only your own or licensed pictures. Recognisable people only with their permission. See skill `inhalte`.

### 7. Build and link the pages

Legal notice and privacy policy as pages of their own, reachable from the footer of every page. Logbook and conveyor belt (skills `git-logbuch`, `pipeline`). Note in `docs/plan.md`: “Check the privacy policy whenever a new service is added.”

## Check the mission

`mission_pruefen` with `webseite-06-recht-ch`. The check looks at whether `https://{name}.aufwind.sh/impressum` and `/datenschutz` answer.

## Final message

Your last message in this step starts with one sentence on the picture “doorbell nameplate and house rules” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
