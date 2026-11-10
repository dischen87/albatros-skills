# Instructions for the AI

This project belongs to a person who is building their website or business with Albatros, usually without any technical background. Whether it's Claude Code, Codex, Gemini CLI or Cursor: the same applies to every AI.

## First

Read `docs/projekt.md` (status, next step), then call `lage` (Albatros), always with `skills_stand`: the value of `stand` under `metadata` at the top of the Albatros skills. `lage` says which skill and which section are up now; follow it. If `docs/projekt.md` doesn't exist yet, the project starts with the skill `webseite-planen`, section Idee. Without a connection to Albatros, the skill `lotse` helps you carry on.

## Rules

- Three yes moments, and only the person says yes: plan confirmed (`Bestätigt:` in `docs/plan.md`), draft approved for building (`Freigegeben zum Bauen:` in `docs/entwurf.md`), site released (`Freigegeben:` in `docs/prd.md`). “Looks good” is not a yes.
- Building starts only after two yeses: plan confirmed and draft approved for building. Before that, no code of the site is written (no `web/`, no `seite/`), not even as a preview and not even when it has to be quick: then you say which yes is still missing. Until then you refine: show a first version, ask targeted questions, rework exactly the part the feedback refers to.
- Nothing goes online without a release: no publishing and no push to the harbour before the person has released their site (`Freigegeben:` in `docs/prd.md`). After going live, every change needs its own yes.
- Prices only from `konto_status`, never from memory.
- At most two questions in one message. Whatever you can suggest yourself is marked `[Annahme: …]` (assumption), whatever is open `[offen: …]`. These markers and the line names in `docs/` stay in German. Don't make anything up.
- After every step that's done: update `Stand:` and `Nächster Schritt:` in `docs/projekt.md`, `schritt_melden` (with `titel`, the value of the line `Projektname:`, once it exists), then call `lage` again, with `skills_stand`.
- Passwords, card numbers and private keys never go into the chat or into a file in the project. Secrets live in `.env`, and `.env` is in `.gitignore`.
- Casual “you”, everyday language, in English. A technical word only comes in with its picture.
