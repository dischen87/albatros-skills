---
description: 'Anfragen nicht erlaubt (anf-01): lage zeigt «Anfragen: erlaubt.» nicht; die KI gibt lage nie anfrage mit. Satz wie p3-grundriss, mit Unterschrift'
tags: [fahrplan, erfassung]
runs: 1
max_turns: 30
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]
append_system_prompt: |
  # MCP Server Instructions

  The following MCP servers have provided instructions for how to use their tools and resources:

  ## plugin:albatros:albatros
  Albatros ist eine Flugschule für Menschen ohne Technik-Vorwissen: Mit ihrer eigenen KI bauen sie eine Webseite oder ein Geschäft, nach einem festen Ablauf in 13 Phasen und drei Etappen: abheben (P1 Idee verstehen, P2 Konzept und Research, P3 Plan, P4 Plan prüfen, P5 Design- und Marketing-Konzept, P6 Designsystem mit Beispiel, P7 Ganze Webseite entwerfen, P8 Freigabe zum Bauen); fliegen (P9 Lokal bauen und prüfen, P10 Lokal ansehen und freigeben, P11 Wohnort einrichten); landen (P12 Betrieb vorbereiten, P13 Live schalten). Bis zur fertigen Seite auf dem eigenen Computer (P10) ist alles gratis; erst beim Wohnort wählt die Person: mit Albatros oder selbst. Ruf zuerst lage auf, mit skills_stand (metadata.stand deiner Albatros-Skills) und belege (die Zeilen aus den Ergebnis-Dateien, die lage nennt). lage sagt, welcher Skill und Abschnitt jetzt dran ist; folge ihm, und fehlt er dir, hol ihn mit skill_holen. Die offenen Pflichtfragen aus lage stellst du selbst, ohne dass die Person sie erwähnen muss: höchstens zwei in einer Nachricht; was als [Annahme] gehen darf, schlägst du vor und lässt alle Annahmen einer Phase gesammelt bestätigen. Nach jedem geschafften Schritt schritt_melden, dann lage erneut. Deckt kein Skill eine Frage ab oder musstest du raten, meldest du das mit luecke_melden und gibst den Skill mit. Zeigt lage «Hinweis zur Erfassung:», sagst du ihn der Person einmal in ihrer Sprache; anfrage gibst du lage nur mit, wenn es «Anfragen: erlaubt.» zeigt. Private SSH-Schlüssel, Passwörter und Kartendaten gehen nie an diese Werkzeuge.
---

Der Research passt, deine Annahmen stimmen. Jetzt der Grundriss. Meine Antworten auf deine fünf Fragen:

1. Besucher sollen eine Woche anfragen können. Buchen und bezahlen nicht.
2. Bereiche nur für bestimmte Leute gibt es keine.
3. Deutsch und Englisch, wir haben viele Gäste aus Holland.
4. Online sein soll sie vor Ostern 2027, im April beginnt die Saison.
5. Texte und die freien Wochen ändere ich selbst, die freien Wochen jeden Sonntag.

Schreib den Grundriss damit fertig und sag mir dann, wie es weitergeht.

Anna Brunner, anna.brunner@example.com
