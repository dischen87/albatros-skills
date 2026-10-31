# Bausteine

Fertige Teile für Seiten auf einem Albatros-Server (Pilot). Getestet ist, was in der Tabelle einen Test hat; der Arbeitsspeicher ist gemessen, mit Datum. Wie man sie auswählt und einbaut, steht im Skill [`bausteine`](../plugins/albatros/skills/bausteine/SKILL.md).

| Ordner | Was | Test | Arbeitsspeicher im Betrieb |
|---|---|---|---|
| `pocketbase/` | PocketBase 0.40.5: Datenbank, Login und Verwaltung. Rezepte `anmeldeliste`, `buchungen` (mit Wochenplan und «Meine Buchungen»), `mitglieder` (Anfrage, Freigabe durch die Verwaltung, E-Mail bestätigen, Passwort vergessen), `pinnwand`. Lokal mit der Seite: `bun pocketbase/lokal.ts` | `bun pocketbase/rezepte/buchungen/test.ts` und `bun pocketbase/rezepte/mitglieder/test.ts` gegen ein echtes PocketBase; `anmeldeliste` und `pinnwand` ohne Test | etwa 20 MB (28.10.2026) |
| `strapi/` | Strapi 5.58 mit Postgres 17. Rezept `veranstaltungen` | kein Test | etwa 200 MB, Bau bis 2,5 GB (28.10.2026) |

Die Tests laden PocketBase in der Version aus `pocketbase/Dockerfile` einmal nach `~/.cache/albatros-pocketbase` (Prüfsumme geprüft), starten es mit einer Mail-Attrappe auf dem eigenen Computer und melden «Alles grün» oder was fehlt. Die Seiten der Rezepte (`seite/*.html`) prüfen sie nicht; die klickt man lokal mit `lokal.ts` durch.

Holen, im Logbuch des Projekts:

```bash
curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
```
