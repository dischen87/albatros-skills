---
name: webseite-planen
description: 'Plant mit einer Person ohne Vorwissen ihre Webseite, bevor gebaut wird: für wen, was Besucher tun sollen, welche Seiten es braucht, welche Inhalte schon da sind, welche Vorbilder gefallen. Ergebnis ist ein Grundriss in docs/plan.md. Nutze den Skill bei «ich will eine Webseite», «Webseite planen», «was brauche ich für eine Webseite», «welche Seiten», «Sitemap», «wo fange ich an», und immer bevor auf dem Weg Webseite die erste Seite gebaut wird.'
---

# Webseite planen: der Grundriss

## Das Bild

Niemand baut ein Haus, ohne vorher einen Grundriss zu zeichnen. Der Grundriss zeigt, welche Zimmer es gibt, wie man von einem ins andere kommt und wo die Haustür ist. Bei einer Webseite sind die Zimmer die Seiten, die Gänge die Menüs und Links, und die Haustür ist die Startseite.

Ein Grundriss auf einer Seite Papier reicht. Er spart später viele Umbauten.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurze Fragen, eine Frage pro Nachricht. Nimm die Antworten wörtlich auf, die Person soll ihren Plan wiedererkennen. Kein Fachjargon: «Seiten» statt «Sitemap», «Menü» statt «Navigation».

## Ablauf: acht Fragen

1. **Worum geht es?** In einem Satz, so wie du es einer Nachbarin erzählen würdest.
2. **Für wen?** Wer soll die Seite finden? Möglichst konkret: «Eltern im Quartier, die einen Mittagstisch suchen» statt «alle».
3. **Was sollen Besucher tun?** Genau eine Hauptsache: anrufen, Formular schicken, sich anmelden, vorbeikommen, kaufen. Alles auf der Seite führt dorthin.
4. **Welche Seiten braucht es?** Zum Anfang höchstens fünf. Ein bewährter Start:
   - Startseite: wer, was, für wen, und der Knopf zur Hauptsache
   - Angebot oder «Was wir machen»
   - Über uns oder über mich
   - Kontakt
   - Impressum und Datenschutz (Pflicht, siehe Skill `recht-ch`)
5. **Was ist schon da?** Texte, Fotos, Logo, Preise, Öffnungszeiten. Was fehlt, kommt auf die Liste für den Skill `inhalte`.
6. **Welche Vorbilder?** Zwei, drei Webseiten, die der Person gefallen, und was genau daran (Farben, Ruhe, Fotos, wie kurz die Texte sind). Das hilft später beim Skill `gestaltung`.
7. **Was muss die Seite können?** In welchen Sprachen, wer ändert die Inhalte, sollen Besucher sich eintragen oder einloggen? Mehrere Sprachen bleiben eine normale Seite. Erst eine Anmeldeliste, ein Login oder eine Pinnwand für andere braucht einen Baustein (Skill `bausteine`).
8. **Woran merkst du, dass die Seite funktioniert?** Eine Zahl, die die Person beobachten will, z. B. Anfragen pro Monat. Das braucht später der Skill `statistik`.

## Der Grundriss

Schreib die Antworten mit der Person in `docs/plan.md` im Projekt:

```markdown
# Plan für <Name der Seite>

**In einem Satz:** …
**Für wen:** …
**Hauptsache für Besucher:** … (Knopf: «…»)
**Woran wir Erfolg merken:** …
**Sprachen:** …
**Bausteine:** keine / Anmeldeliste / Mitglieder mit Login / Pinnwand / grosses CMS

## Seiten
- Start: …
- …

## Inhalte
| Was | Haben wir | Fehlt noch |
|---|---|---|

## Vorbilder
- <Adresse>: gefällt uns, weil …
```

Lies den Plan der Person am Schluss vor und frag: «Stimmt das so?» Erst dann ins Logbuch (Skill `git-logbuch`) und über das Fliessband auf den Server.

## Was du der Person ersparst

- **Zu viel auf einmal:** Blog, Shop und Mitgliederbereich sind etwas für später. Zuerst eine Seite, die die Hauptsache gut kann. Mehrere Sprachen sind kein Problem, wenn die Texte da sind.
- **Technik-Entscheide zu früh:** Die Vorlage im Repo reicht für den Anfang. Ein System für Inhalte (Skill `cms`) kommt erst, wenn regelmässig jemand ohne Technik Inhalte ändern muss.
- **Logo und Farben als erstes:** Gestaltung kommt nach dem Inhalt. Eine schöne leere Seite hilft niemandem.

## Mission prüfen

`mission_pruefen` mit `webseite-01-webseite-planen`. Die Prüfung schaut, ob `docs/plan.md` im Projekt liegt (mit Pilot in `~/projekt` auf dem Server, mit Light im Hafen).

Danach kommt der Skill `webseite-bauen` (Mission `webseite-02-bauen`): vom Grundriss zur Seite im Netz. Lies ihn (`../webseite-bauen/SKILL.md`) und fang dort mit Schritt 1 an.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «der Grundriss», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
