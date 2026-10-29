---
name: domain
description: "Finds, buys or connects an own domain (e.g. meinladen.ch) for the site or server at Albatros, with Light as with Pilot. Explains domain and DNS with the picture of an address in the phone book, suggests names, uses domain_suchen to search what's free and buys through Albatros with domain_kaufen (the person is the owner and only enters their details on the payment page). A domain the person already has gets connected with domain_verbinden: DNS records, the TXT proof _albatros and a check, until the site shows the padlock in the browser. Use this skill for “my own domain”, “my own address”, “buy a .ch”, “which domain is free”, “search for a domain”, “DNS”, “A record”, “CNAME”, “TXT record”, “my domain doesn't point to my site”, “certificate”, “https isn't working”."
---

# Domain: your address in the phone book

## The picture

- **Domain** (`meinladen.ch`): your address, one that people can remember.
- **Server**: the house, reachable under a number nobody can remember.
- **DNS**: the phone book of the internet. It says: “meinladen.ch lives in the house with this number.”
- **Registrar**: the office where you rent the address for a year. Albatros can do that for you. The owner on record is still you.

Your site can already be reached at `{name}.aufwind.sh`. With an own domain, it gets an address that belongs to you. If you move later (skill `landung`), you take the address with you.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, short sentences, no jargon. Say “entry in the phone book” instead of “DNS record” until the person sees the words in their registrar's interface. Then use both.
- The person only enters their name, address, phone number and payment details on the payment page, never in the chat.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. Is the plan right?

Own domains come with Light and with Pilot, not with Free. Check with `konto_status`. If the person is on Free, explain the difference and get the link with `upgrade_link` (level `light`). Don't push anything. Searching works with every plan. Buying and connecting work as soon as the site (Light) or the server (Pilot) is up. The domain costs extra, per year, on top of the plan.

### 2. Does the person already have an address?

- **No:** go on with step 3, they find one and buy it through Albatros.
- **Yes, bought somewhere else:** go on with step 4.
- **Yes, bought through Albatros:** `konto_status` shows it under “Eigene Domains” (own domains) with its status. If it's active, go on with step 7.

### 3. Find and buy an address

1. **Suggest names yourself:** three to five ideas that fit the project, before you search. Short, easy to spell, no hyphens if you can avoid them. A place name helps if the word on its own is taken. `.ch` for an audience in Switzerland. No other people's brands in the name, that means trouble.
2. **Search:** `domain_suchen` with up to five wishes, as words or whole domains (`veloladen-thun`, `annas-laden.ch`). Albatros adds the endings `.ch`, `.com`, `.net`, `.shop` and `.li` plus variants, and only names what's really free, with the price per year. Pass on the results and prices exactly as they are. You never guess whether an address is free or what it costs. If nothing is free: other words, add a place name, or a shorter form, then search again.
3. **Say how the purchase works,** right along with the results:
   - From the start, the person is the owner themselves, not Albatros. Their rights as owner are set out by ICANN, the body that makes the rules for domains. Always write out the link in full (the page is in English): https://www.icann.org/resources/pages/benefits-2013-09-16-en
   - They enter their name, address and phone number themselves on the payment page, never in the chat. The details have to be correct, because the address belongs to whoever is on record.
   - The price is per year and is also the price for the renewal. Albatros renews every year as long as the plan for the domain is running.
4. **Buy:** Once the person has decided on an address, you call `domain_kaufen` with exactly that one and pass on the link. They pay and enter their details themselves on the payment page.
5. **After that:** There's nothing to enter at the registrar. Albatros registers the address, sets the entries in the phone book and gets the certificate, usually within 5 to 30 minutes. `konto_status` shows the status. Go on with step 7.

### 4. Register an address you already have

Call `domain_verbinden` with the domain. The tool answers with exactly the entries that need to go into the phone book:

- a **TXT record** `_albatros.<domain>` with a code. That's the proof the address belongs to you, like a letter only the tenant finds in the letterbox.
- an entry that points to your site or your server: for `www.<domain>` usually a **CNAME** to `{name}.aufwind.sh` (“lives at”), for the address without `www` an **A** and an **AAAA** record with the numbers from the answer.

Always take the values from the answer of `domain_verbinden`, never values from memory. Show them as a table with the columns Type, Name, Value and **Meaning**, so no abbreviation goes unexplained: TXT = a note with the proof, CNAME = “lives at”, A = house number, AAAA = new, longer house number.

### 5. Set the entries at the registrar

The person opens the DNS settings at their registrar (often called “DNS”, “Zone” or “Nameserver records”). Guide them field by field: type, name, value. A typical stumbling point: some registrars add the domain themselves. Then the “Name” field is just `_albatros` instead of `_albatros.meinladen.ch`.

### 6. Wait and check

The phone book isn't reprinted everywhere at once. That takes minutes, rarely hours. Check with:

```bash
dig +short TXT _albatros.meinladen.ch
dig +short meinladen.ch
dig +short www.meinladen.ch
```

If the answers match the values from step 4, call `domain_verbinden` again. Albatros checks the proof and then gets the certificate automatically (the padlock in the browser). No check, no certificate.

### 7. Check the mission

Open `https://<domain>` with the person. Then `mission_pruefen` with `flugschule-09-domain`.

## When it gets stuck

- **Bought, but still not active after an hour:** `konto_status` shows the status and a note. If it says something didn't work, the team will get in touch. Otherwise `coach_fragen`.
- **`dig` shows nothing:** a typo in the name, or not reprinted yet. Wait ten minutes, then try again.
- **Old entries get in the way:** Many registrars set up a parking page. The person has to delete those A records, otherwise the address points to two houses.
- **Email on the domain:** Never touch or delete MX records for email. They're a different chapter of the phone book.
- **Browser warns “not secure”:** The certificate is still missing. Usually the TXT proof isn't visible yet. Back to step 6.

## Final message

Your last message in this step starts with one sentence on the picture “your address in the phone book” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
