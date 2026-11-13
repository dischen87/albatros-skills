---
name: projekt-planen
description: "Plan a website project with Albatros, read saved project state and record confirmed steps. Use for Albatros project planning or the next step of an Albatros project."
metadata:
  stand: 0.3.1
---

# Plan a project with Albatros

Respond in the person's language, plainly, with at most two open questions per message. Use the instructions bundled here.

## Connect and resume

Read the actual project state with `konto_status` and `lage`. For `lage`, you may send `skills_stand` from metadata.stand and `projekt: projekt`. Send only brief evidence from result files explicitly shared for this project; no conversation histories or credentials. If disconnected, ask the person to open the plugin's sign-in in their browser. Never request passwords, private keys or sign-in codes. On a connection error, continue planning locally and mark saved state as unknown.

Choose `webseite` or `geschaeft` with the person; save only their choice with `weg_waehlen`. Save `lernen` or `machen` with `modus_waehlen` when they choose that mode and the tool is available. Treat a business idea as a project brief within this workflow.

## From brief to checked local prototype

Work on the actual open phase P1 to P10 returned by `lage`; do not invent completion of earlier phases:

- P1: Record the project name, purpose in one sentence, audience and one observable success criterion. Mark unknowns as open questions.
- P2: Gather existing content, sources and references. Research only accessible sources and distinguish findings from assumptions.
- P3: Write a small plan of pages, functions, languages and acceptance criteria.
- P4: Review the plan with the person, show contradictions and open decisions and record their approval of the plan.
- P5: Describe the tone, visual direction and available material; work with text and existing files.
- P6: Create a small design system with typography, colors, spacing and an example page; let the person choose a direction.
- P7: Draft the whole website and check it against the page plan and design system.
- P8: Show the chosen draft and record explicit approval for implementation. Do not build before that approval.
- P9: Implement the approved draft locally only on request and in an environment that can edit files. Check content, links, narrow and wide views, keyboard use, forms and agreed acceptance criteria. In an ordinary chat, prepare the plan and handover. Distinguish measured results from pending checks.
- P10: Resolve findings, show results and ask the person to approve the local prototype.

In a chat, provide a short brief, page list, chosen direction, open questions and the next step. When local files are requested, record the same results in the relevant project files and state their location. Publishing is outside this workflow. At P11 or later, explain neutrally that the recorded project state is beyond this planning scope.

## Progress and learning

`schritt_melden` records only work actually completed and confirmed by the person. Take the step value from the tool schema or project state, never a guess; use `projekt: projekt`. Only if the schema offers `titel`, send the confirmed project name with at most 80 characters. Do not repeat the same report. Read `lage` again afterwards.

`mission_holen` gives a structured summary of the current task. Use `mission_pruefen` only for its actual ID and when the person asks for that check. A failed check stays open. Use `verstanden_melden` only after the person's own answer or action, with the actual mission ID and appropriate `art`. Explain unavailable tools or an exhausted scope; do not switch to another server to continue.

Support for this connection: mathias@albatrospartner.ch. Send a message only if the person explicitly asks you to.
