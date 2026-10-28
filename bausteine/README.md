# Bausteine

Fertige Teile für Seiten auf einem Albatros-Server (Pilot), getestet und gemessen. Wie man sie auswählt und einbaut, steht im Skill [`bausteine`](../plugins/albatros/skills/bausteine/SKILL.md).

| Ordner | Was | Arbeitsspeicher im Betrieb |
|---|---|---|
| `pocketbase/` | PocketBase 0.40.5: Datenbank, Login und Verwaltung. Rezepte `anmeldeliste`, `mitglieder`, `pinnwand` | etwa 20 MB |
| `strapi/` | Strapi 5.58 mit Postgres 17. Rezept `veranstaltungen` | etwa 200 MB, Bau bis 2,5 GB |

Holen, im Logbuch des Projekts:

```bash
curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
```
