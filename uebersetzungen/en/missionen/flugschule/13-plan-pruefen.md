---
titel: A second opinion on the plan
bild: 'The structural engineer''s second opinion before building starts'
phase: P4
verstehen:
  - frage: Why does your AI check your plan in a fresh conversation?
    kern: Whoever wrote the plan is worst at seeing its gaps. A fresh look without the back story finds what the first one missed.
  - frage: What does it mean when a point on the checklist is marked “risk”?
    kern: The plan works like this, but something can go wrong at that point. You decide knowingly whether to change it or live with the risk.
---

## What it's about

Before a house gets built, a structural engineer looks at the plan. She didn't draw it, so she sees what the architect missed. Your AI does the same with your plan: in a fresh conversation that only knows your documents in `docs/`, it checks the plan against a fixed list. Then you decide whether the plan stands.

## What you'll learn

- whoever wrote the plan is worst at seeing its gaps
- what's on the checklist: one main thing, few pages, flows with confirmation and errors, content, obligations, costs, the date
- ok, risk or open: three honest answers instead of a grade
- why design only starts once the plan is confirmed

## How you go about it

1. Your AI gets the second opinion in a fresh conversation that only reads `docs/`.
2. Every point on the checklist gets ok, risk or open, with the place in the plan. The result goes into `docs/plan-pruefung.md`.
3. Your AI shows you the points marked risk or open, each with a suggestion.
4. You decide: leave it or change it. This is one of three moments on your way where the yes can only come from you. Only after your yes is the plan marked as confirmed, with the date.

If you're modernising an existing site, the second opinion also checks that no feature of the old site gets lost without a decision.

## Done when

- your confirmation with the date is in `docs/plan.md`
- and the “Plan checked” step is reached on your island.
