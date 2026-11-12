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
- Marken am Anfang eines Werts: `[offen: …]` (in jeder Sprache deutsch) und der Platzhalter `[Platzhalter]` (im Entwurf übersetzt) heissen nicht belegt; `[Annahme: …]` (deutsch) ist ein Vorschlag der KI und nie die Antwort der Person. Erkannt werden auch ouvert, aperto, open, à compléter, a compléter, a completer, da completare, placeholder, hypothèse, hypothese, ipotesi, assumption.
- Wohnort (P11, Zeile `Wohnort:`): beginnt mit «Albatros Light» (light) oder «Albatros Pilot» (pilot), jeder andere Wert heisst selbst; ohne die Zeile gilt das Abo im Konto (Gratis heisst selbst).
- Bauen lassen (ab P5, nur im Modus machen, wenn `Setup:` mit `statisch` beginnt): Zeigt `lage` eine Zeile `Angebot:`, sagt die KI es einmal, mit dem Betrag aus `lage`, nie aus dem Gedächtnis. Die Wahl der Person steht in `docs/projekt.md#Bauen lassen:`, Wert `selbst` oder `albatros` mit Datum. `auftrag_anlegen` erst nach der Zusammenfassung und dem Ja der Person, mit `bestaetigt: true`; danach baut die KI nicht selbst weiter.
- Modus (Standard: machen; gilt je Projekt, steht in `docs/projekt.md#Modus:`):
  - machen: Die KI nutzt das Know-how und macht die Arbeit, mit einem Satz Erklärung und Bild je Schritt. Pflichtfragen mit antwortet: person stellt sie trotzdem, den Rest trägt sie als [Annahme] ein. Lernmomente bietet sie an, drängt sie nicht auf.
  - lernen: Die KI erklärt jeden Schritt mit Bild und Warum, lässt die Person die Lernmomente selbst tippen, stellt am Ende der Phase die Kontrollfrage der Lektion und meldet «verstanden» (verstanden_melden) erst nach der Antwort der Person.

## P1 Idee verstehen

Etappe abheben · Skill `webseite-planen`, Abschnitt «Idee» · Insel `idee` · Bild: Das Ziel auf der Karte einkreisen, bevor man losfliegt

- Weg Geschäft: `ideen-check`, nach den Schritten des Skills (Ausgänge: weiter, anpassen, stoppen, festgehalten in `docs/ideen-check.md#Entscheid:`; die Phase ist erst mit weiter oder stoppen geschafft)

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `projektname` | Wie soll dein Projekt heissen? Ein Arbeitsname reicht, er darf auch willkürlich sein. | Person | `docs/projekt.md#Projektname:` |
| `satz` | Worum geht es, in einem Satz? | Person | `docs/projekt.md#In einem Satz:` |
| `fuer-wen` | Für wen ist es gedacht? | Person | `docs/projekt.md#Für wen:` |
| `hauptsache` | Was sollen Besucher vor allem tun? | Person | `docs/projekt.md#Hauptsache:` |
| `bestehend` | Gibt es schon eine Webseite? Wenn ja, die Adresse. | Person | `docs/projekt.md#Bestehende Seite:` |
| `erfolg` | Woran merkst du in drei Monaten, dass es funktioniert? | Annahme | `docs/projekt.md#Erfolg:` |
| `modus` | Soll ich es einfach machen und dir jeden Schritt in einem Satz erklären, oder willst du die wichtigen Schritte selbst lernen? | Annahme | `docs/projekt.md#Modus:`, beginnt mit `lernen` oder `machen` |

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

- Weg Geschäft: `zielgruppe`, `angebot-und-preis`, vor den Schritten des Skills
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

**Eval-Fälle:** `modernisieren-adresse`, `modernisieren-einstieg`, `p2-research`, `webseite-planen`

## P3 Plan

Etappe abheben · Skill `webseite-planen`, Abschnitt «Grundriss» · Insel `plan` · Bild: Der Grundriss des Hauses

- Weg Geschäft: `landingpage`, vor den Schritten des Skills

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

**Eval-Fälle:** `gratis-bis-lokal`, `knapp`, `p3-grundriss`, `webseite-planen`

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

- Weg Geschäft: `marke`, vor den Schritten des Skills

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `name` | Bleibt der Projektname, oder soll das Projekt nach aussen anders heissen? | Person | `docs/konzept.md#Name:` |
| `ton` | Du oder Sie, und wie soll die Sprache klingen? | Person | `docs/konzept.md#Ton:` |
| `charakter` | Welche drei Wörter beschreiben, wie es wirken soll? | Person | `docs/konzept.md#Charakter:` |
| `maskottchen` | Soll eine Figur dazugehören, die durch deine Seite führt? Ja, nein oder später. | Person | `docs/konzept.md#Maskottchen:`, beginnt mit `ja`, `nein` oder `später` |
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
| `reihenfolge` | Stimmt die Reihenfolge im grauen Mockup? | Person | `docs/designsystem.md#Reihenfolge:`, beginnt mit `bestätigt` |
| `richtung` | Welche der drei Richtungen, oder welche Mischung? | Person | `docs/designsystem.md#Richtung:` |
| `musterblatt` | Passt das Musterblatt: Farben, Schriften, Knöpfe, Felder, Karten und Kopf auf dem Handy? | Person | `docs/designsystem.md#Musterblatt:`, beginnt mit `gesehen` |
| `dunkel` | Auch eine dunkle Fassung? | Annahme | `docs/designsystem.md#Farben:` |

**Ergebnis**

- `design/mockup.html`
- `design/tokens.css`
- `design/musterblatt.html`
- `docs/designsystem.md` mit den Zeilen `Reihenfolge:`, `Richtung:`, `Farben:`, `Schriften:`, `Abstände:`, `Komponenten:`, `Maskottchen:`, `Musterblatt:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** tokens.css und musterblatt.html existieren; das Musterblatt nutzt nur var(--…) aus tokens.css; die Person hat das Musterblatt gesehen und Ja gesagt (Zeile «Musterblatt: gesehen am <Datum>»).

**Lernmomente:** Warum Farben und Schriften nur an einem Ort stehen

**Eval-Fälle:** `p6-mockup`

## P7 Ganze Webseite entwerfen

Etappe abheben · Skill `entwurf` · Insel `entwurf` · Bild: Das begehbare Modell des Hauses, bevor der Rohbau beginnt

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `werkstatt` | Sind Node, npm und Git da, bei einem Baustein auch Bun (Prüfung im Terminal ohne Node: command -v, unter Windows where)? | KI | `docs/entwurf.md#Werkstatt:` |
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

**Eval-Fälle:** `webseite-bauen-prd`, `webseite-bauen-pruefung`

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

**Eval-Fälle:** `p11-wohnort`, `start-sprache`

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

- Weg Geschäft: `go-live-check`, nach den Schritten des Skills
- Modernisieren: Domain umstellen mit Umleitungen für alte Adressen; MX-Einträge nie anfassen.
- Insel je Wohnort (bis zum Abschluss zu melden): light `hafen`, `live`; pilot `hafen`, `fliessband`, `live`; selbst `live`

**Pflichtfragen**

| Kennung | Frage | Wer antwortet | Ablage |
|---|---|---|---|
| `adresse` | Eigene Adresse (Domain) jetzt, später oder nie? | Person | `docs/live.md#Eigene Domain:`, beginnt mit `jetzt`, `später` oder `nie` |
| `ankuendigung` | Wem sagst du es zuerst? | Person | `docs/live.md#Angekündigt:` |
| `pruefung-live` | Ist die Seite unter ihrer Adresse ohne Rot (pruefen.mjs --live)? | KI | `docs/live.md#Geprüft:` |

**Ergebnis**

- `docs/live.md` mit den Zeilen `Live seit:`, `Adresse:`, `Eigene Domain:`, `Geprüft:`, `Angekündigt:`

**Ja-Moment:** keiner. Was die Person hier entscheidet, ist eine Wahl oder eine Annahme.

**Gate:** Push nur mit «Freigegeben:» aus P10; pruefen.mjs --live ohne Rot; Impressum und Datenschutz erreichbar.

**Eval-Fälle:** `domain`, `domain-kaufen`, `p13-geaendert`

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
| 2026-10-31 | lotse-ohne-anmeldung | Muss «offene Bibliothek mit mindestens zehn Skills» ersetzt durch «drei Etappen mit dem nächsten Schritt nach dem Ordner (leer: die Idee, Skill `webseite-planen`)»; die Bibliothek ist nur noch ein Soll. Neu ohne Modell: `etappen`, `naechster-schritt`. | fahrplan.yaml: Ablauf in drei Etappen (abheben, fliegen, landen), P1 «Idee verstehen» mit Skill `webseite-planen` ist der Anfang. Der Skill `lotse` zeigt ohne Anmeldung die Etappen mit dem nächsten Schritt und die Bibliothek auf Wunsch; die Person muss nicht selbst wählen. |
| 2026-10-31 | webseite-bauen-prd | Gerüst bis P8 (Entwurf zum Bauen freigegeben, Projekt Sonnenhof statt Mittagstisch), Prompt ohne «Bauplan zum Abnehmen», max_turns 30. Muss «Bauplan abnehmen lassen» ersetzt durch «Bauweise und Türen als Annahmen bestätigen lassen»; statt «kein Abgenommen: mit Datum» gilt: keine Zeile `Abgenommen:` (keine eigene Abnahme). Neu ohne Modell: `abgeleitet`, `keine-eigene-abnahme`, `tueren`, `kein-rohbau`, kein Schritt `prd` vor dem Ja, `lage-zuerst`, `fragen`, `kein-scharfes-s`. | fahrplan.yaml P9 Gate: «Das PRD ist aus dem freigegebenen Entwurf abgeleitet (keine eigene Abnahme)»; P8 Gate: «Ohne diese Zeile baut webseite-bauen nicht»; P9 Ergebnis `docs/prd.md` mit `Abgeleitet aus:` und `docs/tueren.txt`. Im leeren Ordner von vorher wäre «nicht bauen» richtig; das prüft jetzt `nein-vor-bau`. |
| 2026-10-31 | webseite-planen | «höchstens etwa fünf Seiten» wird «höchstens sieben Seiten»; das Vorbild wird in `docs/recherche.md` geprüft statt im Plan (neu ohne Modell: `vorbild`, `keine-erfundene-adresse`); neu: `zeilen-plan`, `kein-bestaetigt`. Der Prompt nennt den Projektordner, max_turns 30, Tags P2 und P3. | fahrplan.yaml P3 Pflichtfrage `seiten`: «höchstens fünf bis sieben, Impressum und Datenschutz zählen mit»; P2 Ergebnis `docs/recherche.md#Vorbilder:`; P3 Ergebnis `docs/plan.md` mit zehn Zeilen; P4 Gate: `Bestätigt:` erst nach dem Ja. Ohne Projektordner legt der Skill einen neuen Ordner an, die Grader lesen `docs/` im Arbeitsordner. |
| 2026-10-31 | start-light | Beispiel «Link zur Zahlungsseite für Light» ersetzt durch «zuerst die Idee; gratis bis zur fertigen Seite, Abo erst beim Wohnort»; neu ohne Modell: kein `upgrade_link` (`kein-zahlungslink`). | fahrplan.yaml `gratis_bis: P10` und P11 Gate: «upgrade_link gibt den Link erst mit bestaetigt: true nach der Wahl der Person». Der Skill `start` antwortet auf Preisfragen «ohne Zahlungslink». |
| 2026-10-31 | webseite-bauen-pruefung, start-sprache, modernisieren-einstieg, modernisieren-adresse, domain, domain-kaufen | Nur Tags: P9, P11, P2 (Variante Modernisieren) und P13 (Domain); Kriterien unverändert. | Damit `GUTE-ANTWORT.md` diese Fälle bei ihrer Phase nennt. start-sprache bleibt richtig: `seite_erstellen` mit `sprache` gehört zu P11 (Skill `lancieren`, Teil 1), und nach P11 Gate ist online «höchstens die Vorlage». |
| 2026-10-31 | p4-plan-pruefen, p5-konzept, p6-mockup, p7-entwurf, p8-sieht-gut-aus, knapp, lernen-kontrollfrage, anfrage, p13-geaendert | Enger: Stichwort und Fragezeichen der Frage-Grader müssen im selben Satz stehen; `neue-freigabe` verlangt «neu, nochmals oder erneut freigeben» statt nur «freig». | Bei der Durchsicht vor dem ersten Lauf gefunden: Eine schlechte Antwort mit irgendeiner Frage im nächsten Satz oder mit «deine freigegebene Seite geht live» wäre durchgegangen. Die Gegenbeispiele stehen in `scripts/evals.test.ts`. |
| 2026-10-31 | alle | fahrplan.yaml P6: je Pflichtfrage eine eigene Zeile in `docs/designsystem.md`: `reihenfolge` in `Reihenfolge:` (beginnt mit bestätigt), `richtung` in `Richtung:`, `musterblatt` in `Musterblatt:` (beginnt mit gesehen); `Reihenfolge:` und `Musterblatt:` neu in den Ergebniszeilen, das Gate verlangt die Zeile zum Musterblatt. Die Frage `reihenfolge` heisst «Stimmt die Reihenfolge im grauen Mockup?» (fr maquette grise, it mockup grigio, en grey mockup). | Gegenprüfung 31.10.2026 (vert-03, weg-04, vert-10): Drei Pflichtfragen in der einen Zeile `Richtung:` liessen sich nicht unterscheiden. lage meldete nach Schritt 1 die bestätigte Reihenfolge als offen und nach Schritt 3 das Musterblatt als beantwortet, bevor es gezeigt war. «Graue Skizze» heisst die Datei aus P1 (`design/skizze.html`), nicht das Mockup. |
| 2026-10-31 | alle | fahrplan.yaml P13: `adresse` hat die Ablage `docs/live.md#Eigene Domain:` (beginnt mit jetzt, später oder nie), neu in den Ergebniszeilen; `Adresse:` bleibt die URL. Neu `insel_je_wohnort`: light `hafen`, `live`; pilot `hafen`, `fliessband`, `live`; selbst `live`. Dazu `wohnorte`: Der Wert von `Wohnort:` beginnt mit «Albatros Light» oder «Albatros Pilot», jeder andere heisst selbst. | Gegenprüfung 31.10.2026 (vert-06, vert-05): lancieren schreibt in `Adresse:` die URL, die Antwort zur Domain stand nirgends, und punkte verglich «später» mit der URL (Exit 1 bei einem Lauf genau nach der Vorlage). Light hat kein Fliessband (lancieren Teil 2, Schritt 3; flugschule sieht es nie), bei selbst ohne Repo gibt es weder Hafen noch Fliessband; lage und punkte verlangten trotzdem alle drei. |
| 2026-10-31 | alle | fahrplan.yaml P7: Die Frage `werkstatt` nennt bei einem Baustein auch Bun. | Gegenprüfung 31.10.2026 (weg-08): Mit Baustein verlangt P9 `bun …/lokal.ts` und `bun …/test.ts`, die Werkstatt prüfte nur Node, npm und Git. |
| 2026-10-31 | alle | fahrplan.yaml: `methoden` je Phase mit `wann` (P1 und P13 `nach_skill`, P2, P3 und P5 `vor_skill`), `ausgaenge` mit `ablage` (`docs/ideen-check.md#Entscheid:`), `werte` bei Pflichtfragen mit festen Anfängen (modus, maskottchen, reihenfolge, musterblatt, adresse) und `marken` (offen, Platzhalter, Annahme mit den Wörtern, die lage, punkte.ts und die Prüfskripte heute lesen). | Gegenprüfung 31.10.2026 (weg-05, steu-07, vert-09): lage stellte die Methode immer vor den Skill, Skills und Methoden sagen in P1 und P13 das Gegenteil. Ob die Methoden am Pin zum Vertrag passen, liess sich nicht prüfen. lage und punkte lasen die Marken verschieden, obwohl beide «wie lage» behaupteten. |
| 2026-10-31 | start-bauen | Neu ohne Modell: kein `upgrade_link` (`kein-zahlungslink`, wie start-light). Die Attrappen von lage, konto_status und upgrade_link kommen aus dem echten mcp (`scripts/attrappen.ts`, Zustand `gratis-ohne-weg`) statt «Skill `start`, Schritt 3» von Hand. | Gegenprüfung 31.10.2026 (vert-12): Schritt 3 von start heisst heute «Lernen oder machen», die Attrappe von upgrade_link lieferte einen Zahlungslink, und start verlangt «ohne Zahlungslink». |
| 2026-10-31 | start-sprache | Attrappen von lage und konto_status aus dem echten mcp (`scripts/attrappen.ts`, Zustand `light-ohne-seite-fr`: Light auf Französisch, Insel bei Freigabe, noch keine Seite; lage nennt lancieren). Kriterium unverändert (seite_erstellen mit sprache fr). | Gegenprüfung 31.10.2026 (vert-12): Die Attrappe nannte «Skill `start`, Schritt 5», der heute «Los: die Idee» heisst; mit FAHRPLAN entsteht die Seite in lancieren Teil 1 (P11). |
| 2026-10-31 | luecke-ohne-skill | Umbenannt von `anfrage`, Kriterien unverändert. Die Einträge oben mit `anfrage` meinen diesen Fall. | Gegenprüfung 31.10.2026 (vert-11): Der Fall prüft luecke_melden, nicht das Feld `anfrage` von lage; «Anfrage» hatte im Glossar zwei Bedeutungen. |
| 2026-10-31 | p1-idee | Neu ohne Modell: `titel`: Meldet die KI den Schritt `idee`, dann mit `titel` = Projektname (Sonnenhof). Ohne Meldung prüft der Grader nichts, denn ohne Bash kann die KI die Skizze nicht öffnen, und das Gate von P1 ist dann noch offen. | Gegenprüfung 31.10.2026 (anf-09): Kein Skill gab `titel` mit, die Insel zeigte «projekt» statt des Namens. Die Skills nennen ihn ab dieser Welle (Paket texte-a). |
| 2026-10-31 | p7-entwurf, p8-sieht-gut-aus, p8-ja, nein-vor-bau, webseite-bauen-prd, p10-freigabe, p11-wohnort, p12-betrieb, p13-geaendert | Gerüst `_projekt/projekt.sh`: `docs/designsystem.md` mit je einer Zeile `Reihenfolge:`, `Richtung:` und `Musterblatt:` statt allem in `Richtung:`. Kriterien unverändert. | fahrplan.yaml P6 (Eintrag oben): eine Zeile je Pflichtfrage, so wie gestaltung sie schreibt. |
| 2026-10-31 | alle | Messbedingung: Die Attrappen von lage, konto_status und upgrade_link und die Anleitung (`_projekt/anleitung.txt`, `append_system_prompt` der Fahrplan-Fälle) neu aus dem echten mcp nach der Gegenprüfung. lage zählt die Belege lückenlos ab der Insel und nur mit allen Ergebnisdateien, ein Ja-Moment nur mit Datum vorne, eine Frage der Person nie als Annahme (lage sagt das bei jeder offenen Frage dazu); in P1 auf dem Weg Geschäft zuerst der Skill, dann der Ideen-Check; P13 meldet mit Light `hafen` und `live`; die Anleitung sagt «13 Phasen» und nennt mit ERFASSUNG den Hinweis zur Erfassung und die Zeile «Anfragen: erlaubt.»; konto_status nennt Gratis «bis zur fertigen Seite auf deinem Computer». Die Attrappen nehmen die Einwilligung für Lücken als erteilt, die für Anfragen nicht. Grader unverändert. | Gegenprüfung 31.10.2026 (vert-02, weg-02, weg-03, vert-04, steu-05, weg-05, vert-05, vert-10, weg-13, anf-01, anf-03): lage sprang über Gates und Ja-Momente, zählte Annahmen als Antwort der Person und verlangte von Light ein Fliessband. Läufe vor diesem Stand sahen eine andere lage und sind nicht gleichwertig vergleichbar. |
| 2026-10-31 | alle | fahrplan.yaml P1: `ausgaenge.geschafft: [weiter, stoppen]`. Auf dem Weg Geschäft ist P1 erst mit `Entscheid: weiter` oder `Entscheid: stoppen` in `docs/ideen-check.md` geschafft, solange der Ideen-Check zur Stufe gehört; die Idee allein, `anpassen` oder eine Hausaufgabe halten P1. lage sagt dann «Jetzt dran: Methode `ideen-check`» und nennt den Entscheid unter «Fertig, wenn»; punkte.ts zählt `idee` erst mit dem Entscheid als belegt (`insel-belegt`). Grader unverändert; kein Eval-Fall zeigt diesen Zustand. | Gegenprobe Welle 5, 31.10.2026 (weg-05): Mit dem Skill zuerst ist «Idee fertig, Ideen-Check offen» der normale Zwischenstand. lage zählte P1 dann nach den Belegen als geschafft, nannte P2 und «Auf der Insel fehlt noch: «idee»»; meldete die KI das, rechnete flugschule den Ideen-Check an. webseite-planen («Geschafft, wenn») und ideen-check («Mission prüfen») verlangen weiter oder stoppen. |
| 2026-11-01 | alle | Gerüst `_projekt/projekt.sh`: AGENTS.md gleich wie `vorlage/AGENTS.md`; die Regel nach jedem Schritt nennt jetzt `schritt_melden` mit `titel` (Wert der Zeile `Projektname:`). Kriterien unverändert. | Welle 6 (w6-52): Vorlage und Block in webseite-planen nennen `titel` wie der lotse; ein Test in `scripts/pruefen.test.ts` hält Gerüst und Vorlage gleich. |
| 2026-11-01 | anfrage-erlaubt, anfrage-nicht-erlaubt | Neu (Tags `fahrplan`, `erfassung`): derselbe Satz und dasselbe Gerüst wie p3-grundriss, unterschrieben mit Name und E-Mail; die lage-Attrappen unterscheiden sich nur in der Zeile «Anfragen: erlaubt.». Ohne die Zeile: `keine-anfrage` (lage nie mit dem Feld `anfrage`, `max: 0`). Mit der Zeile: `anfrage-gesendet` (mindestens ein lage-Aufruf mit `anfrage`, also ab dem nächsten nach dem ersten) und `anfrage-ohne-personendaten` (nie Name oder E-Mail in `anfrage`). Dazu `lage-zuerst`, `fragen`, `kein-scharfes-s` wie in p3-grundriss. Die Einwilligung steht je Fall in `scripts/attrappen.ts` (`FAELLE[…].einwilligung`, sonst Lücken ja, Anfragen offen wie bisher für alle). Zwei Fälle, weil eine Attrappe vom Typ `fixed` bei jedem Aufruf dasselbe antwortet. | Welle 6 (w6-51, anf-01): Die Regel «anfrage nur bei Anfragen: erlaubt.» (lotse, Anleitung, Beschreibung von lage) war bisher nicht messbar. |
| 2026-11-01 | lernen-kontrollfrage, lernen-verstanden | Messbedingung: Attrappen nach Welle 7 neu aus dem echten mcp. lage nennt am Ende der Phase die Kontrollfrage der Lektion mit dem Kern einer guten Antwort (Lektion flugschule-13-plan-pruefen bzw. flugschule-14-konzept); `mission_holen` sagt ehrlich «Kontrollfragen dieser Mission, der Lektion von Phase …», und `_tools.json` beschreibt es so (am Ende einer Phase ist die nächste Mission oft schon eine der nächsten Phase). Kriterien unverändert. | Welle 7 (w7-04, Sichtung sicht-04): `mission_holen` versprach die Kontrollfragen der Lektion, zeigte aber die nächste offene Mission; die Lektion der Phase nennt lage. |
| 2026-11-01 | start | Neu ohne Modell: `lage` (mindestens ein Aufruf von `lage`). Beispiele in `scripts/evals-beispiele.ts` (gut: start, konto_status, weg_waehlen, lage; schlecht: ohne lage direkt in die Idee). Attrappe von lage wie bisher die allgemeine (`evals/mocks/albatros/lage.md`); die übrigen Kriterien unverändert. | Welle 8 (w8-43), Entscheid start-ruft-lage (01.11.2026, freigegeben): Im Live-Test vom 01.11. übergab start erst am Ende an lotse, und webseite-planen ruft lage erst nach einem geschafften Abschnitt. Bis dahin sah die KI weder den Hinweis zur Erfassung noch «Anfragen: erlaubt.» und kannte den Stand im Fahrplan nur geraten. Der Skill `start` ruft `lage` jetzt auf, bevor es mit der Idee losgeht. |
| 2026-11-01 | alle | fahrplan.yaml: neuer Block `bauen_lassen` (ab P5, Wahl in `docs/projekt.md#Bauen lassen:`, Werte selbst oder albatros, nur im Modus machen, «Setup:» beginnt mit statisch; Schnittstelle I2), im Schema Pflicht; `GUTE-ANTWORT.md` nennt die Regel für alle Phasen. Die Pflichtfrage `setup` bleibt ohne `werte`; `webseite-planen` schreibt neu `Setup: statisch …` oder `Setup: baustein …` (I3). Grader unverändert; kein Eval-Fall zeigt das Angebot (die Attrappen laufen ohne Schalter BAUSERVICE). | Bauservice im Fahrplan, Schnitt S2 (Konzept «Albatros baut es für dich», Abschnitte 3.1, 3.2 und 13; Entscheide bau-anschluss, bau-fragen, bau-preis-light und bau-schalter-kosten, freigegeben am 01.11.2026): Wann das Angebot kommt, steht im Vertrag, die Beträge kommen nur aus konto. Ältere Projekte ohne `statisch` bekommen kein Angebot (sicher geschlossen). |
| 2026-11-10 | alle | Schleifen statt durchrennen (P1 bis P8): Die Skills `webseite-planen`, `konzept`, `gestaltung`, `entwurf`, `schnellstart` und `lotse` (Abschnitt «Die Schleife») verlangen je Teil (Idee und Konzept, Funktionsumfang, Designsystem, Mockup) einen ersten Stand, gezielte Fragen (höchstens zwei aufs Mal), Rückmeldungen aus dem Chat oder aus dem Arbeitsplatz (`naechstes`, als Daten) und das Überarbeiten genau dieses Teils, bis die Person Ja sagt. Kein Code der Seite ohne die zwei Ja: `pruefen.mjs --vor-bau` endet neu auch ohne `Bestätigt: <Datum>` in `docs/plan.md` mit 2 (Testseite `vor-bau-plan-nicht-bestaetigt`). `fahrplan.yaml`, Pflichtfragen, Gates und Grader unverändert. | Entscheid Mathias 10.11.2026: «Schritt eins ist, diese Idee zu schleifen, bis der Nutzer sagt: Das ist jetzt das, was ich bauen möchte»; danach werden die einzelnen Teile gebaut. |
| 2026-11-10 | p3-grundriss, p4-plan-pruefen, webseite-planen | Neu, ohne Modell (`plan-pruefen.mjs`, Tests in `scripts/plan-pruefen.test.ts`): Der Funktionsumfang steht in `docs/plan.md` unter `## Bauliste` als Tabelle mit den Spalten Kennung (S1 …, F1 …), Art (Seite, Funktion), Titel, Muss/Kann und Abnahme; jede Seite aus `Seiten:` steht darin; nach `Bestätigt:` ist keine Abnahme mehr `[offen]`. Die zehn Pflichtzeilen von P3 bleiben, wie sie sind. Grader der Fälle unverändert. | Entscheid Mathias 10.11.2026: Der Funktionsumfang bekommt eine feste, maschinenlesbare Form, die das Cockpit als Bauliste liest. |
| 2026-11-10 | gestaltung, p6-mockup | Neu, ohne Modell (`design-pruefen.mjs`, Tests in `scripts/design-pruefen.test.ts`): Titelschrift keine Standardschrift (Inter, Roboto, Arial, Systemschrift), höchstens zwei eigene Familien, keine Schrift von fremden Servern, Typo-Skala mit mindestens vier Grössen; keine Farbe mit den Standardwerten eines Baukastens, kein Verlauf in Lila und Blau, andere Verläufe und Glaseffekte nur mit Grund; keine Lorem-Texte, keine Emoji als Icons, keine Bilder von Platzhalter-Diensten; kein zentrierter Kopf mit ein oder zwei Knöpfen ohne Bild und Inhalt; mindestens zwei Richtungen, die sich nicht nur in den Farben unterscheiden; Bewegung nur mit `prefers-reduced-motion` (CSS und Skript), nichts endlos, die Absicht in `docs/designsystem.md`; 3D nur mit Standbild (`data-3d-standbild`), erst bei Sichtbarkeit und ab Tablet-Breite, Modell höchstens 2 MB; je Seite höchstens 1 MB (über 2 MB rot), Bilder unter 500 KB. Was `Muss bleiben:` in `docs/konzept.md` nennt, ist kein Fehler. Neu als Selbstprüfung der KI mit zweiter Meinung in frischem Kontext (neun Punkte, `docs/designsystem.md` unter `## Prüfung`): eigen ohne Logo erkennbar, Herkunft der Farben, Bildsprache, Aufbau aus dem Inhalt, Kopf, Absicht je Bewegung, 3D dient dem Inhalt, voller Funktionsumfang, Barrierefreiheit. Grader der Fälle unverändert. | Entscheid Mathias 10.11.2026: Das Design ist einzigartig, sieht nicht vibecoded aus und verwendet 3D und Animationen, falls sinnvoll. |
| 2026-11-10 | p7-entwurf, p8-ja, p8-sieht-gut-aus | Neu, ohne Modell (`plan-pruefen.mjs --entwurf`): Jede Seite und jede Funktion der Bauliste kommt im Entwurf vor, eine Funktion an der Stelle mit `data-bauliste="<Kennung>"`; ein fehlender Muss-Eintrag ist rot, ein fehlender Kann-Eintrag gelb. Dazu `design-pruefen.mjs` am Entwurf und die Selbstprüfung mit zweiter Meinung (`docs/entwurf.md` unter `## Prüfung`). Das Gate von P7 und P8 in `fahrplan.yaml` und die Grader bleiben. | Entscheid Mathias 10.11.2026: Das Mockup hat den vollen Funktionsumfang. |
| 2026-11-10 | webseite-bauen-prd, webseite-bauen-pruefung, nein-vor-bau | Neu, ohne Modell: `plan-pruefen.mjs --bau` (jeder Eintrag der Bauliste ist in `seite/` gebaut, Funktionen über `data-bauliste`, Impressum und Datenschutz je für sich) und `design-pruefen.mjs --bau` (dieselben Design-Kriterien an der gebauten Seite; fest eingebundenes JavaScript über 50 KB dort rot). Das PRD nennt je Eintrag der Bauliste einen Abschnitt mit Kennung, gebaut wird Eintrag für Eintrag. Grader der Fälle unverändert. | Entscheid Mathias 10.11.2026: Nach den zwei Ja werden die einzelnen Teile gebaut, mit vollem Funktionsumfang und Grenzen für Gewicht und Ladezeit. |
| 2026-11-10 | seo-grundlagen | Neu, ohne Modell (`sichtbar-pruefen.mjs`, Tests in `scripts/sichtbar-pruefen.test.ts`): zwölf Punkte an der gebauten Seite, mit denselben Namen wie die Etappe «Sichtbar werden» im Cockpit: `titel`, `beschreibung`, `h1`, `bilder`, `sitemap`, `robots`, `kanonisch`, `strukturierte_daten`, `open_graph`, `llms_txt`, `gewicht`, `indexnow`. Rot nur, was das Finden verhindert oder verfälscht; `llms.txt` und die Schlüsseldatei für IndexNow sind empfohlen (gelb). Der Skill nennt dazu GEO (Fakten, Fragen und Antworten, Quellen, gleiche Angaben, nichts erfunden), Search Console und Bing Webmaster Tools (die Person meldet sich selbst an und bestätigt selbst) und IndexNow, mit den Fakten von Google, Bing und indexnow.org vom 10.11.2026. Grader des Falls unverändert. | Entscheid Mathias 10.11.2026: Marketing gehört dazu: SEO, GEO, Bing Webmaster, Google Search Console, als Punkte, die das Cockpit zeigt. |
| 2026-11-11 | alle | `vorlage/AGENTS.md` (mit den drei Übersetzungen), der Block in `webseite-planen` und `schnellstart` und das Gerüst `_projekt/projekt.sh`: neue Regel «Gebaut wird erst nach zwei Ja»: kein Code der Seite (`web/`, `seite/`) vor Plan bestätigt und Entwurf zum Bauen freigegeben, bis dahin schleifen. Kriterien und Grader unverändert. | Live-Lauf 11.11.2026 (Sonnet über das Abo, ein Lauf, Projekt ohne AGENTS.md): Die KI lud keinen Skill und baute auf «bau mir doch gleich die Startseite» eine Startseite ohne beide Ja. Die Regel stand nur in den Skills; AGENTS.md lädt jede KI in jedem Gespräch. Nicht nachgemessen (ein Lauf war die Grenze). |
| 2026-11-12 | gestaltung, p6-mockup | Neu, ohne Modell (`design-pruefen.mjs`, Bereich `vorlage`, Tests in `scripts/design-pruefen.test.ts`): Vorlagen-Rahmen gelb: mindestens zwei Etiketten in Grossbuchstaben direkt über Titeln (geschrieben oder per `text-transform: uppercase`), mindestens drei Angaben mit Mittelpunkt im Inhalt (ohne Kopf, Navigation und Fuss), mindestens zwei Knöpfe oder Links mit «→» am Ende, Monospace ausserhalb von Code, Creme mit Terrakotta (nahe #f4f1ea und #d97757), Fast-Schwarz (#0b0b0b, #111111, #0a0a0a, #121212). Gelb, nie rot: gewählt und begründet bleibt es. Im Skill neu die Gegenprobe vor dem Bauen jeder Richtung (knapper Plan, «käme ich für eine ähnliche Seite auf dasselbe?»), Kühnheit an einer Stelle, und der Leitfaden `anthropic-frontend-design.md` (Anthropic, Apache 2.0, anthropics/skills 2c5958e) als Lektüre; der Strich unter einem Wort im Titel ist kein Vorschlag mehr, nur noch erlaubt, wenn er zur Marke gehört. Grader der Fälle unverändert. | Auftrag Mathias 12.11.2026 (UX- und UI-Skills holen, damit Bert die erste Seite gestaltet): Der Leitfaden frontend-design von Anthropic nennt Merkmale erzeugter Seiten, die Berts Liste «Nicht nach KI aussehen» noch nicht hatte, und den Strich unter einem einzelnen Wort ausdrücklich als eines davon. |
