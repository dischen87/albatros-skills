---
name: konzept
description: 'Klärt mit einer Person ohne Vorwissen nach dem bestätigten Plan den Charakter ihrer Seite, bevor Farben gewählt werden (Fahrplan P5): Name nach aussen, Kern in drei Sätzen, Ton (du oder Sie), drei Wörter für die Wirkung, was bleiben muss, Bildsprache und immer die Frage, ob eine Figur (Maskottchen) dazugehört: ja, nein oder später. Auf dem Weg Geschäft zuerst mit der Methode marke. Bilder der Figur nur nach Nennung des Preises und einem Ja. Ergebnis ist docs/konzept.md. Nutze den Skill nach webseite-planen (Plan bestätigt) und bei «Konzept», «Marke», «Charakter», «Ton», «Maskottchen», «Figur», «wie soll meine Seite wirken».'
metadata:
  stand: 0.3.0
---

# Konzept: Charakter vor Farben

## Das Bild

Bevor ein Haus Farbe bekommt, hat es einen Charakter: ein gemütliches Bauernhaus, eine klare Stadtwohnung, ein verspieltes Ferienhaus. Wer zuerst Farben aussucht, streicht am Ende ein Haus, das niemand so wollte. Darum legst du mit der Person zuerst fest, wie ihre Seite heisst, wie sie klingt und wie sie wirken soll. Farben, Schriften und Formen entstehen danach daraus, im nächsten Schritt (Skill `gestaltung`).

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst, auch wenn sie gleich über Farben reden will.

## Im Fahrplan

Phase P5 «Design- und Marketing-Konzept». Dran nach dem bestätigten Plan: `docs/plan.md` hat die Zeile `Bestätigt:` (P4, Skill `webseite-planen`). Fehlt sie, sag es ehrlich und geh zuerst dorthin (Abschnitt «Plan prüfen»): Erst ein bestätigter Plan wird gestaltet. Danach kommt P6, das Designsystem mit Musterblatt (Skill `gestaltung`).

- **Ergebnis:** `docs/konzept.md` mit den Zeilen `Name:`, `Kern:`, `Ton:`, `Charakter:`, `Maskottchen:`, `Muss bleiben:` und `Bildsprache:` (Vorlage in Schritt 6).
- **Geschafft, wenn** alle sieben Zeilen da sind und `Maskottchen:` mit `ja`, `nein` oder `später` beginnt. Dann meldest du den Schritt `konzept` auf der Insel.
- **Weg Geschäft:** Zuerst kommt die Methode `marke`. Hol sie mit dem Werkzeug `methode` (Name `marke`) und folge ihr: Sie prüft mit der Person den Namen (Swissreg, Handelsregister, Domain, Sprechprobe) und füllt `docs/konzept.md` mit denselben sieben Zeilen; die Herleitung kommt nach `docs/marke.md`. Danach übernimmst du ihr Ergebnis: Lies `docs/konzept.md`, frag nur noch, was fehlt (oft die Antwort zur Figur), und mach mit den Abschnitten «Die Figur» und «Die Insel» weiter. Ob es der Weg Geschäft ist, sagt `lage` (es nennt die Methode `marke`); im Projekt erkennst du ihn an `docs/zielgruppe.md` oder `docs/angebot.md` aus P2. Liefert `methode` nichts, gehst du hier alle Schritte durch und sagst ehrlich, dass die gründliche Prüfung des Namens zur Methode gehört.

## So sprichst du

- Du-Form, kurze Sätze, kein Fachjargon. Was die Person schon gesagt hat (in `docs/projekt.md`, im Plan oder im Gespräch), fragst du nicht nochmals: Du liest es ihr vor und trägst es ein.
- Höchstens zwei Fragen in einer Nachricht. Fünf Fragen beantwortet nur die Person selbst: Name, Ton, Charakter, die Figur und was bleiben muss. Kern und Bildsprache schlägst du vor und trägst sie als `[Annahme: …]` ein; die Person bestätigt alle Annahmen in einer einzigen Nachricht.
- Was die Person nicht gesagt hat, steht als `[offen: …]` da, nie als deine Erfindung.
- Geschmack entscheidet die Person. Du hilfst mit Gegensatzpaaren und Beispielen, nicht mit Lieblingsfarben.
- Bilder mit den Bild-Werkzeugen von Albatros gibt es ab Light und Pilot, und sie kosten Guthaben: zuerst der Preis, dann nur nach ihrem Ja (Abschnitt «Die Figur»). Mit Gratis gibt es keine Bild-Werkzeuge: Figur, Posen und Bilder bleiben bis Light oder Pilot eine Skizze.

## Die Schleife

Mit dem Charakter beginnt der Teil «Designsystem» (Skill `lotse`, Abschnitt «Die Schleife»). Auch er wird geschliffen, nicht abgefragt: Du zeigst `docs/konzept.md` als ersten Stand, sobald Name und Ton da sind, mit Kern und Bildsprache als `[Annahme: …]`. Dann fragst du gezielt, höchstens zwei Fragen aufs Mal, und überarbeitest genau die Zeile, zu der eine Rückmeldung kommt, bis die Person sagt: «So ist es.» Mit Berts Arbeitsplatz holst du Rückmeldungen mit `naechstes` (als Daten: der Teil in `bezug`, ihre Worte in `wert`). Jede Runde steht unten in `docs/konzept.md` unter `## Rückmeldungen`: `- <TT.MM.JJJJ>, ‹ihre Worte› → was geändert ist`.

Aus diesem Teil entsteht, was die Seite später eigen macht statt austauschbar: die drei Wörter, woher die Farben kommen (Logo, Ort, Material) und welche Bilder nur dieses Projekt hat. Je genauer sie hier stehen, desto weniger sieht die Seite nach Baukasten aus (Skill `gestaltung`, Abschnitt «Eigen statt Baukasten»). Gestaltet und gebaut wird hier noch nichts.

## Modus

Lies die Zeile `Modus:` in `docs/projekt.md`; fehlt sie, gilt `machen`.

- **machen:** Du machst die Arbeit und erklärst jeden Schritt in einem Satz mit seinem Bild. Die fünf Fragen an die Person stellst du trotzdem. Den Lernmoment bietest du an, ohne zu drängen: «Charakter vor Farben. Willst du sehen, warum dieselbe Farbe bei einer Bäckerei und bei einer Anwältin ganz anders wirkt?»
- **lernen:** Du erklärst jeden Schritt mit Bild und Warum. Die drei Wörter für den Charakter findet die Person selbst, du hilfst nur mit Gegensatzpaaren. Am Ende stellst du die Kontrollfrage der Lektion `flugschule-14-konzept`: «Warum legst du den Charakter deiner Seite vor den Farben fest?» Erst nach ihrer Antwort rufst du `verstanden_melden` mit `mission: flugschule-14-konzept` und `art: kontrollfrage` auf. Fehlt das Werkzeug, geht es ohne weiter.

## Ablauf

### 1. Lesen, was es schon gibt

Lies `docs/projekt.md` (Projektname, für wen, Hauptsache), `docs/recherche.md` (Vorbilder, was übernehmen, was vermeiden) und `docs/plan.md` (Seiten, Funktionen). Gibt es `docs/konzept.md` schon (zum Beispiel von der Methode `marke`), ergänzt du sie.

### 2. Name und Ton

Frag in einer Nachricht:

- «Bleibt der Projektname, oder soll das Projekt nach aussen anders heissen?» Warum: Der Name steht auf jeder Seite und später in der Adresse.
- «Du oder Sie, und wie soll die Sprache klingen?» Warum: Der Ton macht aus Texten eine Stimme. Hilf mit einem Satz in zwei Tönen, zum Beispiel «Komm vorbei, der Kaffee ist schon warm» und «Wir freuen uns auf Ihren Besuch».

Soll das Projekt anders heissen, schlägst du drei bis fünf Namen vor, die Person wählt. Eine kurze Websuche zeigt, ob es den Namen schon gibt; ob eine passende Adresse frei ist, zeigt das Werkzeug `domain_suchen` (nur suchen, kaufen kommt viel später). Die gründliche Prüfung mit Markenregister und Handelsregister gehört zur Methode `marke`.

### 3. Charakter und was bleiben muss

- «Welche drei Wörter beschreiben, wie es wirken soll?» Warum: Aus dem Charakter entstehen die Richtungen für die Gestaltung, nicht aus Lieblingsfarben. Hilf mit Gegensatzpaaren, passend zum Projekt: traditionell oder sportlich, Bergdorf oder Stadt, ruhig oder lebendig, edel oder bodenständig, verspielt oder sachlich. Und mit der Frage: Was sollen Besucher nach zehn Sekunden denken?
- «Gibt es Logo, Hausfarbe oder Schrift, die bleiben müssen?» Warum: Was bleiben muss, ist der Rahmen für alle Richtungen. Gibt es nichts, steht «nichts».

Lieblingsfarben kommen nur unter `Muss bleiben:`, wenn sie wirklich bleiben müssen. Sonst notierst du sie unter der Zeile als Wunsch; in P6 zeigt sich, ob sie zum Charakter passen.

Steht in `docs/projekt.md` die Zeile `Bauen lassen: albatros`, sagst du nach der Frage nach Logo, Hausfarbe und Schrift dazu: «Leg Logo und Fotos in den Ordner design/bilder.»

### 4. Die Figur: ja, nein oder später

Diese Frage stellst du immer, auch wenn die Person nicht danach fragt, in einer eigenen Nachricht:

«Soll eine Figur dazugehören, die durch deine Seite führt? Ja, nein oder später.»

Dazu der Grund in einem Satz: Eine Figur macht eine Seite unverwechselbar, braucht aber in jedem Bild Pflege. Du schlägst keine Antwort vor, die Person entscheidet. Bis sie antwortet, steht in `docs/konzept.md` `Maskottchen: [offen: Frage gestellt am <TT.MM.JJJJ>]`.

Bei «ja» geht es weiter mit dem Abschnitt «Die Figur». Bei «nein» oder «später» genügt die Zeile. «Später» heisst: Die Seite funktioniert ohne Figur, und die Frage kommt nach dem Livegang wieder.

### 5. Kern und Bildsprache als Vorschlag

Aus dem, was die Person gesagt hat, schlägst du beides vor und trägst es als `[Annahme: …]` ein:

- **Kern** in drei Sätzen: Für wen? Was versprichst du (ein Ergebnis, kein Adjektiv)? Warum gerade du (belegbar)? Der Kern ist der Massstab für jeden Text und jedes Bild.
- **Bildsprache:** Fotos, Illustrationen, Icons oder eine Mischung, und dazu in einem Halbsatz, was nur dieses Projekt zeigen kann (der Ort, die Menschen bei der Arbeit, das Material, die Handschrift). Eine Seite ohne Bild wirkt wie eine Vorlage, eine mit Bildern von irgendwo auch. Echte Fotos vom Ort und von den Menschen schlagen jedes erzeugte Bild. Kommen Fotos vor, schreibst du gleich eine kurze Fotoliste in `docs/inhalte.md` (Abschnitt «Fotoliste»: was, wo, wer darauf ist): Fotos brauchen Zeit, so kann die Person jetzt schon anfangen.

Dann in einer Nachricht: «Ich habe Kern und Bildsprache so vorgeschlagen: … Passt das, oder ändern wir etwas?» Nach ihrer Antwort fallen die Klammern weg.

### 6. docs/konzept.md

Jede Zeile beginnt am Zeilenanfang mit ihrem Namen, ohne Fettdruck, und bleibt kurz (höchstens 300 Zeichen), denn `lage` liest diese Zeilen. Einzelheiten kommen darunter.

```markdown
# Konzept: <Name>
Stand: <TT.MM.JJJJ>

Name: <Name nach aussen>
Kern: Für <wen>: <Versprechen>. Warum wir: <Beleg>.
Ton: <du oder Sie>; <drei Eigenschaften, wie es klingt>
Charakter: <drei Wörter>
Maskottchen: <ja, nein oder später>
Muss bleiben: <Logo, Hausfarbe, Schrift, oder nichts>
Bildsprache: <Fotos, Illustrationen, Icons oder eine Mischung>

## Ton
| Wir sind | So ja | So nicht |
|---|---|---|
| … | «…» | «…» |

## Figur
Nur bei «Maskottchen: ja», siehe Abschnitt «Die Figur».

## Rückmeldungen
- <TT.MM.JJJJ>, ‹ihre Worte› → was geändert ist
```

Hinter `Maskottchen:` steht zuerst eines der drei Wörter `ja`, `nein` oder `später`, bei «ja» danach kurz die Figur: `Maskottchen: ja – Lina, eine neugierige Eule`.

Lies der Person die Datei am Schluss vor und frag: «Erkennst du dein Projekt darin wieder?» Sagt sie «fast» oder «ja, aber», ist das eine Rückmeldung: Du änderst die Zeile, die sie meint, und fragst nochmals (Abschnitt «Die Schleife»).

## Die Figur

Bei «ja» beschreibt ihr die Figur zuerst in Worten, unter `## Figur` in `docs/konzept.md`:

- Was für eine Figur (Tier, Gegenstand, Mensch), ihr Name, drei Eigenschaften, passend zum Charakter der Seite.
- Wo sie auftaucht: zum Beispiel beim Willkommen, bei einem Erfolg, auf einer leeren Seite.
- Wo nie: bei Fehlern, Absagen und heiklen Momenten, neben Fotos von Menschen, hinter Listen oder Formularen.

Mit Gratis rufst du kein Bild-Werkzeug auf: Die Figur bleibt eine Skizze (unten), bis die Person Light oder Pilot hat. Antwortet ein Bild-Werkzeug, Bilder «gehören zu Light und Pilot», machst du ohne Bild-Werkzeug weiter wie bei «kommt bald» und fragst nicht nach Guthaben. Mit Light oder Pilot ist ein Bild der Figur freiwillig und kostet Guthaben. Vor dem ersten Bild rufst du das Werkzeug `guthaben` auf, nennst den Preis aus seiner Antwort und fragst einmal: «Ein Bild kostet CHF …, dein Guthaben reicht für … Soll ich ein erstes Bild der Figur machen?» Erst nach ihrem Ja rufst du `bild_erzeugen` auf; `bild_freistellen` und `modell_3d` ebenso nur nach Preis und Ja. Jedes Bild schaust du selbst an, bevor du es zeigst, und speicherst es sofort im Projekt (`curl -o design/figur/<name>.png <url>`), denn nach 7 Tagen ist es weg.

Mit Gratis, wenn das Guthaben nicht reicht oder die Person (noch) kein Bild will, bleibt die Figur eine Skizze: eine einfache Zeichnung in Grau, die du als `design/figur/skizze.svg` zeichnest, oder ein Foto ihrer eigenen Zeichnung auf Papier. Das reicht für Musterblatt und Entwurf. Die Posen der Figur (Willkommen, Suchen, Erfolg, leer) entstehen in P6 (Skill `gestaltung`, Abschnitt «Gestaltungselemente»).

## Die Insel

Steht alles in `docs/konzept.md` und beginnt `Maskottchen:` mit `ja`, `nein` oder `später`, rufst du das Werkzeug `schritt_melden` mit `schritt: konzept` und `sprache: de` auf. `projekt` lässt du weg, ausser die Person arbeitet an einem weiteren Projekt nur auf ihrem Computer; dann gibst du dessen kurzen Namen mit. Sag ihr in einem Satz, dass ihr Haus auf der Insel gewachsen ist. Antwortet das Werkzeug «Ungültige Angaben», prüf die Schreibweise einmal; kennt Albatros den Schritt noch nicht, geht es ohne Insel weiter, `docs/konzept.md` ist der Beleg. Danach rufst du `lage` erneut auf (Skill `lotse`), immer mit `skills_stand`: dem Wert von `stand` unter `metadata` oben in dieser Datei.

## Übergabe an Albatros

Nur wenn in `docs/projekt.md` `Bauen lassen: albatros` steht (die Person hat das Angebot von `lage` angenommen) und `lage` diesen Abschnitt nennt, also wenn `docs/konzept.md` steht. Dann gestaltest und baust du nicht selbst weiter: Albatros macht Mockup, Entwürfe und die ganze Seite als Vorschau, die Person wählt im Cockpit.

1. **Zusammenfassung.** Lies `docs/projekt.md`, `docs/recherche.md`, `docs/plan.md` (mit den Abnahmekriterien unter `Testing:`), `docs/plan-pruefung.md` und `docs/konzept.md`. Sag der Person in einer Nachricht, was du schickst, etwa so: «Das schicke ich an Albatros: deinen Plan mit Seiten, Funktionen und deinen Abnahmekriterien, deine Recherche und dein Konzept, als Text. Passwörter und Zugangsdaten sind nicht dabei. Die Adresse deiner Seite wählst du danach im Cockpit. Das Albatros-Team liest es, und beim Bauen hilft eine KI (Claude von Anthropic). Bis du bezahlst, ist alles unverbindlich, und du kannst jederzeit selbst weiterbauen. Soll ich es schicken?»
2. **Erst nach ihrem ausdrücklichen Ja** rufst du `auftrag_anlegen` mit `bestaetigt: true` auf, dazu die Felder des Briefings aus ihren Dateien, so wie Albatros sie beschreibt: `name` (`Name:` aus `docs/konzept.md`, sonst `Projektname:` aus `docs/projekt.md`), `wofuer` (`In einem Satz:`, `Hauptsache:` und `Erfolg:` aus `docs/projekt.md`; auf dem Weg Geschäft dazu `docs/angebot.md`), `fuerWen` (`Für wen:`; auf dem Weg Geschäft dazu `docs/zielgruppe.md`), `seiten` (`Seiten:`, `Funktionen:` und `Sprachen:` aus `docs/plan.md`), `setup` (die Zeile `Setup:` aus `docs/plan.md`, wörtlich), `adresse` nur bei einer bestehenden Seite (`Bestehende Seite:`), `stil` (`Ton:`, `Charakter:`, `Muss bleiben:`, `Maskottchen:` und `Bildsprache:` aus `docs/konzept.md`, dazu `Vorbilder:`, `Übernehmen:` und `Vermeiden:` aus `docs/recherche.md`), `material` (`Inhalte vorhanden:` und `Pflichten:` aus `docs/recherche.md` und die Abnahmekriterien aus `Testing:`; nur Text und Links, keine Dateien). `name` hat höchstens 120 Zeichen, `adresse` 300, `material` 4000, die anderen je 2000. Ohne Namen anderer Menschen, ohne Telefonnummern, Adressen, Passwörter oder Zugangsdaten. «Sieht gut aus» ist kein Ja; ohne Ja schickst du nichts.
3. **Danach** sagst du ihr, was `auftrag_anlegen` meldet: die Nummer, den Betrag genau so, wie Albatros ihn nennt, und den Weg ins Cockpit, etwa: «Erledigt: Auftrag #<Nummer> ist bei Albatros. Wähl im Cockpit unter «Dein Auftrag» deinen Projektordner, dann sieht das Team auch deine Fotos. Dort wählst du auch die Adresse deiner Seite. Als Nächstes bekommst du Entwürfe zur Wahl. Bauen musst du nichts mehr.» Dann öffnest du ihr das Cockpit (`open https://albatros.build/cockpit/auftrag`, mit Sprachpräfix wie `/fr/cockpit/auftrag`; Linux `xdg-open`, Windows `start`) und sagst ihr, wo der Projektordner auf ihrem Computer liegt: der Ordner, in dem ihr arbeitet (`pwd`). Den Ordner wählt sie dort selbst im Browser; er nimmt daraus nur `docs/` und `design/` und zeigt ihr vorher die Liste. Passwörter, private Schlüssel und Dateien wie `.env` gehören nicht hinein. Du lädst nichts selbst hoch. Einen Betrag aus dem Gedächtnis nennst du nie. Meldet Albatros einen Fehler (zum Beispiel schon ein offener Auftrag, oder der Bauservice ist gerade nicht verfügbar), gibst du ihn wörtlich weiter und baust nicht los.
4. Ab hier baust du nicht selbst weiter, auch wenn die Person fragt: kein Mockup, keine Entwürfe, kein Code, und unter `design/` legst und änderst du nichts mehr, denn daraus baut Albatros. `lage` sagt, was dran ist (zum Beispiel im Cockpit wählen oder warten auf Albatros). Daneben kann sie Texte und Fotos sammeln (Skill `inhalte`); neue Fotos legt sie selbst in `design/bilder/` und wählt den Projektordner im Cockpit nochmals. Will sie es sich anders überlegen, zieht sie den Auftrag im Cockpit zurück; danach geht der Fahrplan mit ihr weiter.

Wählt die Person `Bauen lassen: selbst`, gibt es diesen Abschnitt nicht: Es geht weiter mit dem Designsystem (Skill `gestaltung`).

## Stolpersteine

- **Farben zuerst:** Dann gefällt die Seite der Person, sagt aber den Besuchern nichts. Farben kommen in P6 aus dem Charakter.
- **Die Frage nach der Figur vergessen:** Sie geht leicht unter und ist Pflicht, weil eine Figur später jedes Bild prägt.
- **Annahmen als Antworten ausgeben:** Name, Ton, Charakter, Figur und was bleiben muss, sagt die Person selbst.
- **Bilder ohne Preis:** jedes Bild-Werkzeug erst nach Preis und Ja, und mit Gratis gar keines.
- **Ton nicht durchgehalten:** Seite per Du, Mail per Sie wirkt wie zwei verschiedene Läden.

## Mission prüfen

`mission_pruefen` mit `flugschule-14-konzept`, auf dem Weg Geschäft auch mit `geschaeft-04-marke`. Die Prüfung schaut, ob das Projekt auf der Insel mindestens beim Schritt «Konzept» steht.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Charakter vor Farben», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt (`docs/konzept.md`), was noch offen ist (oft die Antwort zur Figur oder ein Foto) und was als Nächstes kommt: das Designsystem mit Musterblatt in P6 (Skill `gestaltung`), oder mit `Bauen lassen: albatros` die Übergabe an Albatros (Abschnitt oben).
