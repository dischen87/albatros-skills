# Gute Antwort: was die KI in jeder Phase tut

Erzeugt aus `fahrplan.yaml` (Fassung 2, Stand 2026-10-31) mit `bun scripts/gute-antwort.ts`. Nicht von Hand ändern: `bun scripts/pruefen.ts` verlangt, dass diese Datei dem Erzeugten entspricht. Kriterien ändern sich nur mit Datum und Grund in `KRITERIEN-LOG.md`. Ein Eval-Fall zählt für eine Phase, wenn seine `prompt.md` sie als Tag nennt (`tags: [P3]` oder `tags: [P3, P4]`); so filtert auch `claude plugin eval --tag P3`.

## Für alle Phasen

- Höchstens 2 Fragen in einer Nachricht.
- Höchstens 5 Fragen an die Person je Phase. Den Rest schlägt die KI als [Annahme] vor, und die Person bestätigt alle Annahmen einer Phase in einer einzigen Nachricht.
- Ein Fachwort kommt erst, nachdem es erklärt ist, zuerst mit seinem Bild.
- Preise nur aus `konto_status`, nie aus dem Gedächtnis.
- Wer antwortet: Person heisst, die Person antwortet immer selbst, auch im Modus machen. Annahme heisst, die KI schlägt einen Standard als [Annahme] vor. KI heisst, die KI klärt es selbst (Recherche, Messung) und zeigt das Ergebnis.
- Ja-Momente gibt es nur 3: P4 (`plan-bestaetigt`), P8 (`freigabe-entwurf`), P10 (`freigabe`). «Sieht gut aus» ist kein Ja.
- Gratis bis P10.
- Modus (Standard: machen; gilt je Projekt, steht in `docs/projekt.md#Modus:`):
  - machen: Die KI nutzt das Know-how und macht die Arbeit, mit einem Satz Erklärung und Bild je Schritt. Pflichtfragen mit antwortet: person stellt sie trotzdem, den Rest trägt sie als [Annahme] ein. Lernmomente bietet sie an, drängt sie nicht auf.
  - lernen: Die KI erklärt jeden Schritt mit Bild und Warum, lässt die Person die Lernmomente selbst tippen, stellt am Ende der Phase die Kontrollfrage der Lektion und meldet «verstanden» (verstanden_melden) erst nach der Antwort der Person.

## P1 Idee verstehen

Etappe abheben · Skill `webseite-planen`, Abschnitt «Idee» · Insel `idee` · Bild: Das Ziel auf der Karte einkreisen, bevor man losfliegt

- Weg Geschäft: `ideen-check` (Ausgänge: weiter, anpassen, stoppen)

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `projektname` | Wie soll dein Projekt heissen? Ein Arbeitsname reicht, er darf auch willkürlich sein. | Person | `docs/projekt.md#Projektname:` |
| `satz` | Worum geht es, in einem Satz? | Person | `docs/projekt.md#In einem Satz:` |
| `fuer-wen` | Für wen ist es gedacht? | Person | `docs/projekt.md#Für wen:` |
| `hauptsache` | Was sollen Besucher vor allem tun? | Person | `docs/projekt.md#Hauptsache:` |
| `bestehend` | Gibt es schon eine Webseite? Wenn ja, die Adresse. | Person | `docs/projekt.md#Bestehende Seite:` |
| `erfolg` | Woran merkst du in drei Monaten, dass es funktioniert? | Annahme | `docs/projekt.md#Erfolg:` |
| `modus` | Soll ich es einfach machen und dir jeden Schritt in einem Satz erklären, oder willst du die wichtigen Schritte selbst lernen? | Annahme | `docs/projekt.md#Modus:` |

**Ergebnis**

- `docs/projekt.md` mit den Zeilen `Projektname:`, `In einem Satz:`, `Für wen:`, `Hauptsache:`, `Erfolg:`, `Bestehende Seite:`, `Modus:`, `Stand:`, `Nächster Schritt:`
- `AGENTS.md`
- `design/skizze.html`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** docs/projekt.md hat alle Zeilen; Projektname nicht leer; die Skizze der Startseite ist geöffnet worden.

**Lernmomente:** Warum ein Projekt einen Namen braucht, bevor es etwas gibt · Eine Hauptsache statt fünf

**Eval-Fälle:** `p1-idee`

## P2 Konzept und Research

Etappe abheben · Skill `webseite-planen`, Abschnitt «Research» · Insel `recherche` · Bild: Die Reiseführer lesen, bevor man losfliegt

- Weg Geschäft: `zielgruppe`, `angebot-und-preis`
- Modernisieren: Skill `webseite-modernisieren`, Abschnitt «Bestandsaufnahme»

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `vorbilder` | Kennst du Seiten, die dir gefallen? Ich suche zusätzlich bis zu drei vergleichbare in deiner Region und Branche. | Annahme | `docs/recherche.md#Vorbilder:` |
| `funktionen-ueblich` | Was bieten vergleichbare Seiten an? | KI | `docs/recherche.md#Übliche Seiten und Funktionen:` |
| `uebernehmen-vermeiden` | Was übernehmen wir, was machen wir bewusst anders? | Annahme | `docs/recherche.md#Übernehmen:` |
| `pflichten` | Welche Pflichten gelten (Impressum, Datenschutz, Bildrechte, Cookies)? | KI | `docs/recherche.md#Pflichten:` |
| `inhalte-vorhanden` | Welche Texte, Fotos und welches Logo hast du schon? | Person | `docs/recherche.md#Inhalte vorhanden:` |
| `suchbegriffe` | Mit welchen Worten würde dich jemand suchen? | Annahme | `docs/recherche.md#Suchbegriffe:` |

**Ergebnis**

- `docs/recherche.md` mit den Zeilen `Vorbilder:`, `Übliche Seiten und Funktionen:`, `Übernehmen:`, `Vermeiden:`, `Pflichten:`, `Inhalte vorhanden:`, `Suchbegriffe:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** Bis zu drei Vorbilder mit Adresse, jede Adresse von der KI aufgerufen und erreichbar; weniger nur mit Grund; ohne Netz nennt die Person sie. Keine erfundenen Adressen.

**Lernmomente:** Abgucken ist erlaubt, kopieren nicht

**Eval-Fälle:** `p2-research`

## P3 Plan

Etappe abheben · Skill `webseite-planen`, Abschnitt «Grundriss» · Insel `plan` · Bild: Der Grundriss des Hauses

- Weg Geschäft: `landingpage`

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `funktionen` | Was sollen Besucher tun können: anfragen, buchen, sich anmelden, bezahlen? | Person | `docs/plan.md#Funktionen:` |
| `zugang` | Gibt es Bereiche nur für bestimmte Leute? Wer darf was sehen und ändern? | Person | `docs/plan.md#Zugang:` |
| `sprachen` | In welchen Sprachen? | Person | `docs/plan.md#Sprachen:` |
| `release` | Bis wann soll es online sein? Gibt es einen Anlass? | Person | `docs/plan.md#Release:` |
| `pflege` | Wer ändert später Texte und Termine, und wie oft? | Person | `docs/plan.md#Pflege:` |
| `seiten` | Welche Seiten braucht es? Für den ersten Flug höchstens fünf bis sieben, Impressum und Datenschutz zählen mit. | Annahme | `docs/plan.md#Seiten:` |
| `setup` | Reicht eine Seite ohne eigene Dienste, oder braucht es einen Baustein (Anmeldung, Buchung, Login)? | Annahme | `docs/plan.md#Setup:` |
| `testing` | Woran erkennen wir, dass es fertig ist? | Annahme | `docs/plan.md#Testing:` |

**Ergebnis**

- `docs/plan.md` mit den Zeilen `Projektname:`, `Seiten:`, `Funktionen:`, `Zugang:`, `Sprachen:`, `Setup:`, `Testing:`, `Release:`, `Pflege:`, `Stand:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** docs/plan.md hat alle Zeilen; offene Punkte stehen als [offen], nichts erfunden.

**Lernmomente:** Warum jede Seite gepflegt werden muss

**Eval-Fälle:** `gratis-bis-lokal`, `knapp`, `p3-grundriss`

## P4 Plan prüfen

Etappe abheben · Skill `webseite-planen`, Abschnitt «Plan prüfen» · Insel `plan-geprueft` · Bild: Die zweite Meinung vom Statiker, bevor gebaut wird

- Modernisieren: Keine Funktion der alten Seite geht ohne Entscheid verloren (docs/bestand.md).

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `zweite-meinung` | Was spricht gegen diesen Plan? Prüfung in frischem Kontext, der nur docs/ liest, gegen die feste Prüfliste. | KI | `docs/plan-pruefung.md#Zweite Meinung:` |
| `plan-bestaetigt` | Ich habe die Punkte mit Risiko oder offen markiert. Ist der Plan so final, oder ändern wir etwas? | Person | `docs/plan.md#Bestätigt:` |

**Ergebnis**

- `docs/plan-pruefung.md` mit den Zeilen `Geprüft am:`, `Zweite Meinung:`
- `docs/plan.md` mit der Zeile `Bestätigt:`

**Prüfliste** (jeder Punkt ok, Risiko oder offen, mit Stelle im Plan)

1. Genau eine Hauptsache, und jede Seite dient ihr
2. Höchstens fünf bis sieben Seiten für den ersten Flug
3. Jede Funktion hat einen Ablauf mit Bestätigung, Fehler und leerem Zustand
4. Die Inhalte sind vorhanden, oder es ist klar, wer sie bis wann liefert
5. Es ist geklärt, wer was darf, und ob es dafür einen Baustein braucht
6. Impressum, Datenschutz und Bildrechte sind eingeplant
7. Das Erfolgsmass ist eine Zahl oder ein beobachtbares Ereignis
8. Es ist klar, was es nach dem Lancieren kostet und wer es bezahlt
9. Das grösste Risiko ist benannt, und was für den ersten Flug wegfällt
10. Das Datum passt zum Umfang

**Zweite Meinung in frischem Kontext**

- claude-code: Subagent oder claude -p im Projektordner
- codex: codex exec im Projektordner
- gemini-cli: gemini -p im Projektordner
- cursor: neuer Agent-Chat oder agent -p im Projektordner

**Ja-Moment:** «Ich habe die Punkte mit Risiko oder offen markiert. Ist der Plan so final, oder ändern wir etwas?» (`plan-bestaetigt`). Erst nach dem Ja der Person, mit Datum und ihrem Wortlaut in `docs/plan.md#Bestätigt:`.

**Gate:** Jeder Punkt der Prüfliste ist ok, Risiko oder offen mit Stelle; plan.md hat «Bestätigt: <Datum>» erst nach dem Ja der Person.

**Lernmomente:** Wer den Plan geschrieben hat, sieht seine Lücken am schlechtesten

**Eval-Fälle:** `lernen-kontrollfrage`, `lernen-verstanden`, `p4-plan-pruefen`

## P5 Design- und Marketing-Konzept

Etappe abheben · Skill `konzept` · Insel `konzept` · Bild: Der Charakter des Hauses, bevor Farben gewählt werden

- Weg Geschäft: `marke`

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `name` | Bleibt der Projektname, oder soll das Projekt nach aussen anders heissen? | Person | `docs/konzept.md#Name:` |
| `ton` | Du oder Sie, und wie soll die Sprache klingen? | Person | `docs/konzept.md#Ton:` |
| `charakter` | Welche drei Wörter beschreiben, wie es wirken soll? | Person | `docs/konzept.md#Charakter:` |
| `maskottchen` | Soll eine Figur dazugehören, die durch deine Seite führt? Ja, nein oder später. | Person | `docs/konzept.md#Maskottchen:` |
| `muss-bleiben` | Gibt es Logo, Hausfarbe oder Schrift, die bleiben müssen? | Person | `docs/konzept.md#Muss bleiben:` |
| `kern` | Was versprichst du, und warum gerade du? (drei Sätze) | Annahme | `docs/konzept.md#Kern:` |
| `bildsprache` | Fotos, Illustrationen, Icons oder eine Mischung? | Annahme | `docs/konzept.md#Bildsprache:` |

**Ergebnis**

- `docs/konzept.md` mit den Zeilen `Name:`, `Kern:`, `Ton:`, `Charakter:`, `Maskottchen:`, `Muss bleiben:`, `Bildsprache:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** docs/konzept.md hat alle Zeilen; Maskottchen ist ja, nein oder später. Bilder mit den Bild-Werkzeugen nur nach Nennung des Preises und Ja der Person.

**Lernmomente:** Charakter vor Farben

**Eval-Fälle:** `p5-konzept`

## P6 Designsystem mit Beispiel

Etappe abheben · Skill `gestaltung` · Insel `mockup`, `entwuerfe` · Bild: Die Materialmuster, ausgelegt auf einem Musterblatt

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `reihenfolge` | Stimmt die Reihenfolge auf der grauen Skizze? | Person | `docs/designsystem.md#Richtung:` |
| `richtung` | Welche der drei Richtungen, oder welche Mischung? | Person | `docs/designsystem.md#Richtung:` |
| `musterblatt` | Passt das Musterblatt: Farben, Schriften, Knöpfe, Felder, Karten und Kopf auf dem Handy? | Person | `docs/designsystem.md#Richtung:` |
| `dunkel` | Auch eine dunkle Fassung? | Annahme | `docs/designsystem.md#Farben:` |

**Ergebnis**

- `design/mockup.html`
- `design/tokens.css`
- `design/musterblatt.html`
- `docs/designsystem.md` mit den Zeilen `Richtung:`, `Farben:`, `Schriften:`, `Abstände:`, `Komponenten:`, `Maskottchen:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** tokens.css und musterblatt.html existieren; das Musterblatt nutzt nur var(--…) aus tokens.css; die Person hat das Musterblatt gesehen.

**Lernmomente:** Warum Farben und Schriften nur an einem Ort stehen

**Eval-Fälle:** `p6-mockup`

## P7 Ganze Webseite entwerfen

Etappe abheben · Skill `entwurf` · Insel `entwurf` · Bild: Das begehbare Modell des Hauses, bevor der Rohbau beginnt

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `werkstatt` | Sind Node, npm und Git da (Prüfung im Terminal ohne Node: command -v, unter Windows where)? | KI | `docs/entwurf.md#Werkstatt:` |
| `texte` | Welche Texte kommen auf jede Seite? Fehlende stehen als [Platzhalter] da. | Annahme | `docs/entwurf.md#Seiten:` |
| `zustaende` | Wie sehen Bestätigung, Fehler und leere Zustände jeder Funktion aus? | KI | `docs/entwurf.md#Seiten:` |
| `durchklicken` | Klick dich durch, auf dem Handy und am Computer: Was fehlt, was stört? | Person | `docs/entwurf.md#Rückmeldungen:` |

**Ergebnis**

- `design/entwurf/index.html`
- `docs/entwurf.md` mit den Zeilen `Werkstatt:`, `Seiten:`, `Rückmeldungen:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** design/entwurf hat eine Seite je Seite aus plan.md (ausser Impressum und Datenschutz), aus der gewählten Richtung weitergeführt; alle Links führen auf vorhandene Seiten; nur var(--…) aus design/tokens.css; entwurf-pruefen.mjs ist grün oder die KI hat dasselbe von Hand geprüft.

**Lernmomente:** Jetzt ist eine Änderung ein Satz, nach dem Bau ein Umbau

**Eval-Fälle:** `p7-entwurf`

## P8 Freigabe zum Bauen

Etappe abheben · Skill `entwurf`, Abschnitt «Freigabe» · Insel `entwurf-freigegeben` · Bild: Die Unterschrift unter das Modell

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `freigabe-entwurf` | Wollen wir das so bauen? | Person | `docs/entwurf.md#Freigegeben zum Bauen:` |

**Ergebnis**

- `docs/entwurf.md` mit der Zeile `Freigegeben zum Bauen:`

**Ja-Moment:** «Wollen wir das so bauen?» (`freigabe-entwurf`). Erst nach dem Ja der Person, mit Datum und ihrem Wortlaut in `docs/entwurf.md#Freigegeben zum Bauen:`.

**Gate:** Zeile «Freigegeben zum Bauen: <Datum>» mit dem Wortlaut der Person; «sieht gut aus» ohne Ja zum Bauen reicht nicht. Ohne diese Zeile baut webseite-bauen nicht (pruefen.mjs --vor-bau).

**Eval-Fälle:** `nein-vor-bau`, `p8-ja`, `p8-sieht-gut-aus`

## P9 Lokal bauen und prüfen

Etappe fliegen · Skill `webseite-bauen` · Insel `prd`, `lokal`, `pruefung` · Bild: Der Rohbau in der eigenen Werkstatt

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `stack` | Bauweise: statisch mit Astro, oder mit Baustein? | Annahme | `docs/stack.md` |
| `tueren` | Welche Adressen sind offen, welche nur mit Anmeldung, welche nie? | Annahme | `docs/tueren.txt` |

**Ergebnis**

- `docs/stack.md`
- `docs/prd.md` mit der Zeile `Abgeleitet aus:`
- `docs/tueren.txt`
- `docs/pruefung/messwerte.json`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** Das PRD ist aus dem freigegebenen Entwurf abgeleitet (keine eigene Abnahme); Markup und Klassen kommen aus design/entwurf; pruefen.mjs ohne Rot; lokales Logbuch mit einem Eintrag je Schritt.

**Lernmomente:** Was ein Logbuch-Eintrag ist (git commit)

**Eval-Fälle:** noch kein Fall

## P10 Lokal ansehen und freigeben

Etappe fliegen · Skill `webseite-bauen`, Abschnitt «Freigabe» · Insel `freigabe` · Bild: Die Begehung des fertigen Rohbaus

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `freigabe` | Du hast deine Seite auf deinem Computer gesehen, auf dem Handy und am Computer. Gibst du sie frei? | Person | `docs/prd.md#Freigegeben:` |

**Ergebnis**

- `docs/prd.md` mit den Zeilen `Lokal gesehen:`, `Vergleich mit Entwurf:`, `Freigegeben:`

**Ja-Moment:** «Du hast deine Seite auf deinem Computer gesehen, auf dem Handy und am Computer. Gibst du sie frei?» (`freigabe`). Erst nach dem Ja der Person, mit Datum und ihrem Wortlaut in `docs/prd.md#Freigegeben:`.

**Gate:** Vergleich Bau gegen Entwurf je Seite (Überschriften, Menü, Abschnitte) ohne offene Abweichung; «Freigegeben: <Datum>» mit dem Wortlaut der Person.

**Lernmomente:** Einen Text selbst ändern und lokal sehen (Pflicht im Modus lernen, sonst Angebot)

**Eval-Fälle:** `p10-freigabe`

## P11 Wohnort einrichten

Etappe fliegen · Skill `lancieren` · Insel `wohnort` · Bild: Entscheiden, wo das Haus steht, und den Schlüssel holen

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `wohnort` | Wo soll deine Seite wohnen: bei Albatros (Light ohne Baustein, Pilot mit eigenem Server) oder selbst? | Person | `docs/lancieren.md#Wohnort:` |

**Ergebnis**

- `docs/lancieren.md` mit den Zeilen `Wohnort:`, `Grund:`, `Adresse:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** Preise nur aus konto_status; upgrade_link gibt den Link erst mit bestaetigt: true nach der Wahl der Person. Online ist höchstens die Vorlage; die freigegebene Seite geht erst in P13 ins Netz.

**Lernmomente:** Was ein SSH-Schlüssel ist (Schloss und Schlüssel)

**Eval-Fälle:** `p11-wohnort`

## P12 Betrieb vorbereiten

Etappe landen · Skill `betrieb` · Insel `betrieb` · Bild: Briefkasten, Rauchmelder und Haustür, bevor die Gäste kommen

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `rueckmeldungen` | Wie melden sich Besucher bei dir, und wer liest es wie oft? | Person | `docs/betrieb.md#Rückmeldungen:` |
| `eingang` | Gibt es mehrere Teile, die wissen müssen, wer angemeldet ist? | Person | `docs/betrieb.md#Eingang:` |
| `statistik` | Willst du zählen, wer kommt (mit Einwilligung)? | Person | `docs/betrieb.md#Statistik:` |
| `ueberwachung` | Wer erfährt es, wenn die Seite nicht antwortet? | Annahme | `docs/betrieb.md#Überwachung:` |
| `sicherung` | Wie kommst du auf gestern zurück? | KI | `docs/betrieb.md#Sicherung:` |

**Ergebnis**

- `docs/betrieb.md` mit den Zeilen `Rückmeldungen:`, `Überwachung:`, `Sicherung:`, `Eingang:`, `Statistik:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** docs/betrieb.md hat alle Zeilen; ein Eingang nur bei erfüllten Kriterien und nur mit eigenem Server.

**Lernmomente:** Zurück auf gestern

**Eval-Fälle:** `p12-betrieb`

## P13 Live schalten

Etappe landen · Skill `lancieren`, Abschnitt «Live schalten» · Insel `hafen`, `fliessband`, `live`, `domain` · Bild: Die Eröffnung mit Band vor der Tür

- Weg Geschäft: `go-live-check`
- Modernisieren: Domain umstellen mit Umleitungen für alte Adressen; MX-Einträge nie anfassen.

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `adresse` | Eigene Adresse (Domain) jetzt, später oder nie? | Person | `docs/live.md#Adresse:` |
| `ankuendigung` | Wem sagst du es zuerst? | Person | `docs/live.md#Angekündigt:` |
| `pruefung-live` | Ist die Seite unter ihrer Adresse ohne Rot (pruefen.mjs --live)? | KI | `docs/live.md#Geprüft:` |

**Ergebnis**

- `docs/live.md` mit den Zeilen `Live seit:`, `Adresse:`, `Geprüft:`, `Angekündigt:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** Push nur mit «Freigegeben:» aus P10; pruefen.mjs --live ohne Rot; Impressum und Datenschutz erreichbar.

**Eval-Fälle:** `p13-geaendert`

## Nach dem Livegang

Kein eigener Platz auf der Insel. Ändern mit `webseite-aendern`:

- klein: lokal ändern, lokal zeigen, Freigabe, Push
- gross: Nachtrag in docs/plan.md, Entwurf der geänderten Seiten, Freigabe zum Bauen, bauen, lokal zeigen, Freigabe, Push

Weg Geschäft, Etappe Landen: `sichtbar-in-ki-antworten`, `marketing-kanaele`, `verkauf`, `kundenstimmen`, `feedback-und-tickets`, `funktionen-sichtbar-machen`, `bezahlte-werbung`, `zahlen`

## Änderungen

Aus `KRITERIEN-LOG.md`, ältester Eintrag zuerst.

| Datum | Fall | Änderung | Grund |
|---|---|---|---|
| 2026-10-31 | alle | Fahrplan-Fassung 2: Phasen P1 bis P13 mit Pflichtfragen (wer antwortet), Ergebnissen mit Pflichtzeilen, Gates, drei Ja-Momenten (P4, P8, P10) und 19 Insel-Schritten; `GUTE-ANTWORT.md` wird daraus erzeugt. | Plan «Fahrplan und Lernschleife», Fassung 2 nach der Gegenprüfung (albatros/docs/plan-fahrplan.md): Was eine gute Antwort ist, soll an einer Stelle festgelegt und messbar sein, statt über 42 Grader verstreut. |
| 2026-10-31 | alle | Die Phase eines Falls steht als Tag (P1 bis P13) in `tags` der `prompt.md`, nicht mehr im Kopf `phase:`; `scripts/gute-antwort.ts` liest die Tags und meldet einen Kopf `phase:` als Fehler. | Gemessen mit Claude Code 2.1.309 (`plugin eval` mit `--max-cost-usd 0`, ohne Modell): Ein Kopf `phase:` ergibt «unknown frontmatter key "phase"», der Fall lädt nicht. Tags sind erlaubt und filtern mit `--tag P3`. |
| 2026-10-31 | alle | Messbedingung: Die Attrappe von Albatros zeigt die echte Werkzeugliste (`mocks/albatros/_tools.json`, tools/list mit FAHRPLAN und ERFASSUNG) und hat neu `modus_waehlen`, `verstanden_melden` und `luecke_melden`; `schritt_melden` antwortet im Format mit FAHRPLAN. Erzeugt mit `scripts/attrappen.ts` aus dem echten mcp. | Ohne `_tools.json` sah die KI im Eval nur Werkzeugnamen ohne Beschreibung und ohne Eingaben; die Skills 0.2.0 sind für den Server mit FAHRPLAN geschrieben. Läufe vor diesem Stand sind darum nicht gleichwertig vergleichbar. |
| 2026-10-31 | p1-idee, p2-research, p3-grundriss, p4-plan-pruefen, p5-konzept, p6-mockup, p7-entwurf, p8-sieht-gut-aus, p8-ja, p10-freigabe, p11-wohnort, p12-betrieb, p13-geaendert, knapp, nein-vor-bau, gratis-bis-lokal, lernen-kontrollfrage, lernen-verstanden, anfrage | Neu (Tag `fahrplan`): je Phase mindestens ein Fall, dazu Personen, die nicht mitspielen. Grader ohne Modell für Pflichtzeilen, Antworten in ihrer Zeile, Annahmen, Werkzeugaufrufe (lage zuerst, richtiger Insel-Schritt, kein Schritt zu weit, kein `upgrade_link` mit `bestaetigt` vor P11), höchstens zwei Fragen und kein ß; ein llm-Grader nur für die Formulierung. lage aus `scripts/attrappen.ts`, Projekt Sonnenhof aus `_projekt/projekt.sh`. | Plan «Fahrplan und Lernschleife», Schnitt B5a: Was eine gute Antwort ist, soll je Phase messbar sein, ohne Modell, wo es geht (fahrplan.yaml: `ergebnis.zeilen`, `pflichtfragen`, `ja_momente`, `gratis_bis`, `fragen_je_nachricht`). |
