---
name: barrierefreiheit
description: "Checks and improves the accessibility of a small website with a person who has no prior knowledge, following WCAG 2.2 AA in plain words: contrast, text size and zoom, picture descriptions, using it with the keyboard, forms, screen readers, motion. The result is a check report in docs/barrierefreiheit.md. Use this skill for “accessibility”, “accessible”, “barrier-free”, “a11y”, “WCAG”, “contrast”, “alt text”, “screen reader”, “readable for older people”, “use it with the keyboard”."
---

# Accessibility: the ramp next to the stairs

## The picture

A house with steps in front of the door works well for many people. For someone in a wheelchair, with a pram or with a heavy suitcase, it's a wall. A ramp next to the stairs helps these people, and everyone else is happy to use it too.

On websites, the ramps are: enough contrast, descriptions for pictures, using it without a mouse, forms with clear labels. Everyone benefits, whether they're looking at their phone in the sun, have forgotten their glasses or are in a hurry.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## How you talk

- Abbreviations and tool names only with half a sentence of explanation: WCAG (the internationally recognised checklist for accessible websites), Lighthouse (a checking tool built into Chrome). Otherwise leave them out.
- **Don't just ask:** If the project or a detail is missing, still give the concrete steps, or write the file as a draft with marked assumptions (`[Assumption: …]`). Only ask about what's missing at the end.
- Casual “you”, no technical abbreviations. You explain “contrast” with light grey writing on white paper.
- Every point needs evidence: page and spot.
- Automatic tools only find part of it. Say so honestly, and do the checks by hand with the person.
- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.

## Steps

### 1. Automatic first check

The person opens their site in Chrome, right-click, “Inspect”, the “Lighthouse” tab, choose only “Accessibility”, “Analyze page load”. Or you check in the terminal:

```bash
npx pa11y https://{name}.aufwind.sh
```

The messages go into the report as findings. What the tools don't see: whether the order makes sense, whether texts are understandable, where you end up after a click.

### 2. Check by hand

**Seeing**
- Calculate contrast: text at least 4.5 : 1, large headings, buttons, borders of input fields and icons at least 3 : 1. Light and dark separately.
  - Formula: linearise each colour channel (0 to 1): `c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`. Luminance `L = 0.2126 R + 0.7152 G + 0.0722 B`. Contrast `(L_hell + 0.05) / (L_dunkel + 0.05)` (hell = lighter colour, dunkel = darker colour). Sanity check: white on black gives 21.
- Colour is never the only signal: errors with an icon and text, the active menu item also underlined or bold.
- Zoom to 200%: nothing gets cut off, no sideways scrolling. Check widths 320, 375, 768 and 1440 pixels.

**Using**
- Keyboard only: `Tab` forwards, `Shift+Tab` back, `Enter` clicks. Can you get everywhere? Can you always see where you are (focus outline)? Does `Escape` close an open window?
- Tap areas on a phone big enough: about a fingertip, at least 44 × 44 pixels.
- Links are links, buttons are buttons. Link texts say where they go (“See prices”, not “here”).

**Reading aloud**
- Every picture with content has a description (`alt="…"`) that says what you should see. Pure decoration gets `alt=""`.
- Buttons with only an icon (heart, magnifying glass, menu) have a name (`aria-label="Suchen"`, in the site's language).
- Headings in a sensible order: exactly one `h1`, below it `h2`, `h3`.
- The page language is set: `<html lang="de-CH">` (or the site's own language, e.g. `en` for an English site).
- Listen for yourself on a Mac: `Cmd+F5` switches VoiceOver on and off.

**Forms**
- A visible label above every field, not just grey placeholder text inside the field.
- Required fields can be recognised. The right field type (`type="email"`, `type="tel"`), so the phone shows the matching keyboard.
- Errors right at the field, understandable, with the way to fix them. Entries are kept when there's an error.

**Motion**
- Anyone who has chosen “Reduce motion” in their system settings sees still images: `@media (prefers-reduced-motion: reduce)`.
- Anything that moves by itself stops after 5 seconds at most, or can be paused.
- Videos have subtitles.

### 3. Report and repair

`docs/barrierefreiheit.md`:

```markdown
# Accessibility: check report (<date>)

| Point | Result | Evidence (page, spot) | Repair |
|---|---|---|---|
| Text contrast | met / not met / not relevant | … | … |

## Contrasts
| Colour pair | Value | Enough for |
|---|---|---|
```

Then repair, critical points first (anything that shuts a person out completely). After that, check again and update the report. Logbook (skill `git-logbuch`), conveyor belt (skill `pipeline`).

## Good to know

- In Switzerland, the Behindertengleichstellungsgesetz (BehiG, the Swiss Disability Equality Act) mainly binds authorities and public services. For private sites it isn't mandatory, but it's an advantage: more people get through, and search engines understand the site better. If the person also sells into the EU, the European Accessibility Act may apply. This isn't legal advice.
- What helps most is testing with real people, including older people.

## Check the mission

`mission_pruefen` with `webseite-06-barrierefreiheit`. The check looks at whether `docs/barrierefreiheit.md` is in the project (with Pilot in `~/projekt` on the server, with Light in the harbour).

## Final message

Your last message in this step starts with one sentence on the picture “the ramp next to the stairs” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
