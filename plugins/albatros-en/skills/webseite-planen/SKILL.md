---
name: webseite-planen
description: "Plans a website with a person who has no prior knowledge, before anything gets built: who it's for, what visitors should do, which pages it needs, which content already exists, which examples they like. The result is a floor plan in docs/plan.md. Use this skill for “I want a website”, “plan my website”, “what do I need for a website”, “which pages do I need”, “sitemap”, “where do I start”, and always before the first page gets built on the website path."
---

# Plan your website: the floor plan

## The picture

Nobody builds a house without drawing a floor plan first. The floor plan shows which rooms there are, how you get from one to the next and where the front door is. On a website, the rooms are the pages, the corridors are the menus and links, and the front door is the home page.

A floor plan on one sheet of paper is enough. It saves a lot of rebuilding later.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, short questions. One question per message; if the person has already told you a lot, only ask what's missing, even two or three short questions at once. Write the answers down word for word, so the person recognises their own plan. No jargon: “pages” instead of “sitemap”, “menu” instead of “navigation”.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps: eight questions

1. **What's it about?** In one sentence, the way you'd tell a neighbour.
2. **Who's it for?** Who should find the site? As specific as possible: “parents in the neighbourhood looking for a lunch club” instead of “everyone”.
3. **What should visitors do?** Exactly one main thing: call, send a form, sign up, drop by, buy. Everything on the site leads there.
4. **Which pages does it need?** At most five to start with. A tried and tested start:
   - Home page: who, what, for whom, and the button to the main thing
   - What we offer, or “What we do”
   - About us, or about me
   - Contact
   - Legal notice (Impressum, the details Swiss law requires about who runs the site) and privacy policy (mandatory, see skill `recht-ch`)
5. **What's already there?** Texts, photos, logo, prices, opening hours. If the person says “we've got that”, ask for it straight away (text, list or a photo of it), above all for anything a feature needs, for example classes with times and places. Whatever's missing goes on the list for the skill `inhalte`.
6. **Which examples?** Two or three websites the person likes, and what exactly about them (colours, calm, photos, how short the texts are). That helps later with the skill `gestaltung`.
7. **What does the site need to be able to do?** In which languages, who changes the content, should visitors sign up or log in? Several languages still make a normal site. Only a sign-up list, bookings with places, a login or a noticeboard for others needs a building block (skill `bausteine`).
8. **How will you know the site works?** One number the person wants to keep an eye on, e.g. enquiries per month. The skill `statistik` needs that later.

## The floor plan

Write the answers down with the person in `docs/plan.md` in the project:

```markdown
# Plan for <name of the site>

**In one sentence:** …
**Who it's for:** …
**Main thing for visitors:** … (button: “…”)
**How we'll know it works:** …
**Languages:** …
**Building blocks:** none / sign-up list / members with login / noticeboard / big CMS

## Pages
- Home: …
- …

## Content
| What | We have | Still missing |
|---|---|---|

## Examples
- <address>: we like it because …
```

At the end, read the plan back to the person and ask: “Is that right?” Only then into the logbook (skill `git-logbuch`) and over the conveyor belt onto the server.

## What you spare the person

- **Too much at once:** a blog, a shop and a members' area are for later. First a site that does the main thing well. Several languages are no problem if the texts are there.
- **Tech decisions too early:** the template in the repo is enough to start with. A system for content (skill `cms`) only comes when someone without tech skills regularly has to change content.
- **Logo and colours first:** design comes after content. A beautiful empty site helps nobody.

## Check the mission

`mission_pruefen` with `webseite-01-webseite-planen`. The check looks at whether `docs/plan.md` is in the project (with Pilot in `~/projekt` on the server, with Light in the harbour).

Next comes the skill `webseite-bauen` (mission `webseite-02-bauen`): from floor plan to a page on the web. Read it (`../webseite-bauen/SKILL.md`) and start there with step 1.

## Final message

Your last message in this step starts with one sentence on the picture “the floor plan” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
