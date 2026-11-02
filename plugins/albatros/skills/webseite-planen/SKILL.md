---
name: webseite-planen
description: 'Plant mit einer Person ohne Vorwissen ihre Webseite, bevor gestaltet und gebaut wird, in vier Abschnitten des Fahrplans: Idee (Projektname, Idee in einem Satz, für wen, Hauptsache, docs/projekt.md, AGENTS.md und eine graue Skizze der Startseite), Research (bis zu drei vergleichbare Seiten, Pflichten, vorhandene Inhalte, docs/recherche.md), Grundriss (Seiten, Funktionen, Zugang, Sprachen, Pflege, docs/plan.md) und Plan prüfen (zweite Meinung in frischem Kontext, docs/plan-pruefung.md, Ja der Person). Auf dem Weg Geschäft mit den Methoden ideen-check, zielgruppe, angebot-und-preis und landingpage. Nutze den Skill bei «ich will eine Webseite», «Webseite planen», «wo fange ich an», «was brauche ich für eine Webseite», «welche Seiten», «Sitemap», «Projektname», «Vorbilder», «Plan prüfen», wenn lage webseite-planen nennt, und immer bevor auf dem Weg Webseite gestaltet oder gebaut wird.'
metadata:
  stand: 0.2.0
---

# Webseite planen: der Grundriss

## Das Bild

Niemand baut ein Haus, ohne vorher einen Grundriss zu zeichnen. Der Grundriss zeigt, welche Zimmer es gibt, wie man von einem ins andere kommt und wo die Haustür ist. Bei einer Webseite sind die Zimmer die Seiten, die Gänge die Menüs und Links, und die Haustür ist die Startseite. Bevor gebaut wird, schaut eine Statikerin den Grundriss an, die ihn nicht gezeichnet hat.

Ein Grundriss auf einer Seite Papier reicht. Er spart später viele Umbauten.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will. Jeder Abschnitt unten hat dazu sein eigenes Bild für einen Satz.

## Die vier Abschnitte

`lage` nennt den Abschnitt, der jetzt dran ist. Ohne `lage` fängst du beim ersten Abschnitt an, dessen Ergebnis fehlt.

| Abschnitt | Bild | Ergebnis | Insel |
|---|---|---|---|
| Idee | das Ziel auf der Karte einkreisen, bevor man losfliegt | `docs/projekt.md`, `AGENTS.md`, `design/skizze.html` | `idee` |
| Research | die Reiseführer lesen, bevor man losfliegt | `docs/recherche.md` | `recherche` |
| Grundriss | der Grundriss des Hauses | `docs/plan.md` | `plan` |
| Plan prüfen | die zweite Meinung der Statikerin, bevor gebaut wird | `docs/plan-pruefung.md`, `Bestätigt:` in `docs/plan.md` | `plan-geprueft` |

Die vier Abschnitte sind der Anfang der ersten Etappe, des Abhebens (im Fahrplan P1 bis P4). Die Nummern sind nur für dich; der Person nennst du den Abschnitt in Worten. Alles bleibt auf ihrem Computer und kostet bei Albatros nichts.

Will die Person gleich den ganzen Plan, schreibst du die fehlenden Dateien in einem Zug als Entwurf, mit `[Annahme: …]` und `[offen: …]`, und fragst danach nur, was fehlt. Die zweite Meinung und das Ja der Person im Abschnitt «Plan prüfen» lässt du nie aus.

## So sprichst du

- Du-Form, kurze Sätze, kein Fachjargon: «Seiten» statt «Sitemap», «Menü» statt «Navigation». Ein Fachwort kommt erst, wenn es gebraucht wird, und zuerst mit seinem Bild.
- **Höchstens zwei Fragen in einer Nachricht, höchstens fünf an die Person je Abschnitt.** Was die Person schon erzählt hat, fragst du nicht nochmals. Nimm ihre Antworten wörtlich auf, sie soll ihren Plan wiedererkennen.
- **Annahmen statt Fragen:** Was du selbst vorschlagen kannst, trägst du als `[Annahme: …]` ein, mit einem Halbsatz Begründung. Alle Annahmen eines Abschnitts bestätigt die Person in einer einzigen Nachricht: «Diese Annahmen habe ich eingetragen: … Stimmt das so?» Danach nimmst du die Markierung weg. Was niemand weiss, steht als `[offen: …]` da. Erfinde nichts.
- **Nicht warten:** Fehlt eine Angabe, schreib die Datei trotzdem als Entwurf mit markierten Annahmen und offenen Punkten. Frag erst am Schluss nach dem, was fehlt.
- **Lernen oder machen:** Es gilt die Zeile `Modus:` in `docs/projekt.md`, Standard ist machen. Wie die beiden Modi gehen, steht im Skill `lotse`, Abschnitt «Lernen oder machen». Die Lernmomente unten bietest du im Modus machen an; im Modus lernen macht die Person sie selbst.
- **Zeilen für den Fahrplan:** In `docs/projekt.md`, `docs/recherche.md`, `docs/plan.md` und `docs/plan-pruefung.md` beginnt jede Pflichtzeile am Zeilenanfang mit ihrem Namen, ohne Fettdruck (`Projektname: …`). Daran erkennt `lage`, was schon beantwortet ist.
- Fragt die Person etwas, das dieser Skill nicht abdeckt, oder musst du raten: Skill `lotse`, Abschnitt «Lücken melden».

## Nach jedem Abschnitt

1. In `docs/projekt.md` die Zeilen `Stand:` und `Nächster Schritt:` nachführen.
2. `schritt_melden` mit dem Schritt aus der Tabelle oben, `titel` (der Wert der Zeile `Projektname:` in `docs/projekt.md`, so wie die Person ihr Projekt nennt) und `sprache` (die Sprache des Gesprächs). Mit `titel` zeigt die Insel das Haus mit diesem Namen statt «projekt»; Albatros nimmt ihn bis 300 Zeichen an und kürzt ihn dort auf 80. `projekt` lässt du beim ersten Projekt der Person weg: Daraus wird später das Logbuch im Hafen. Nur für ein weiteres Projekt gibst du einen kurzen Namen aus Kleinbuchstaben, Ziffern und «-» mit. Sag der Person in einem Satz, dass ihr Haus auf der Insel gewachsen ist. Antwortet das Werkzeug «Ungültige Angaben» wegen `titel` (etwa ein Zeilenumbruch oder mehr als 300 Zeichen), meldest du denselben Schritt gleich nochmals ohne `titel`: Der Schritt zählt, der Name ist Nebensache. Antwortet es sonst «Ungültige Angaben» oder «unbekannt», oder fehlt es, geht es ohne Insel weiter.
3. Die Mission des Abschnitts prüfen (unten, «Mission prüfen»), dann `lage` erneut aufrufen (Skill `lotse`), mit `skills_stand` (dem Wert von `stand` unter `metadata` oben in dieser Datei), und dem folgen, was jetzt dran ist.

Hat die Person ein Konto und ist ihre Insel in diesem Gespräch noch nicht offen, öffnest du sie einmal: `open https://albatros.build/cockpit/insel` (mit Sprachpräfix wie `/fr/cockpit/insel`; Linux `xdg-open`, Windows `start`). Dort wächst mit jedem Schritt ein Haus.

## Idee

**Bild:** Das Ziel auf der Karte einkreisen, bevor man losfliegt. Ohne Ziel weiss keine Pilotin, welche Route sie fliegt.

1. **Ein Name, gleich in der ersten Antwort.** Schlag einen Projektnamen vor oder frag danach: «Wie soll dein Projekt heissen? Ein Arbeitsname reicht, er darf auch willkürlich sein.» Mit einem Namen könnt ihr ab jetzt auf alles verweisen. Für den Ordner nimmst du eine kurze Form aus Kleinbuchstaben und «-» (`mittagstisch-wipkingen`). Arbeitest du nicht schon in einem Projektordner, legst du einen neuen Ordner mit diesem Namen an und arbeitest darin.
2. **Die Fragen zur Idee.** Frag nur, was noch fehlt, höchstens zwei auf einmal, in dieser Reihenfolge:
   - Worum geht es, in einem Satz? So, wie du es einer Nachbarin erzählen würdest.
   - Für wen ist es gedacht? Möglichst konkret: «Eltern im Quartier, die einen Mittagstisch suchen» statt «alle».
   - Was sollen Besucher vor allem tun? Genau eine Hauptsache: anrufen, anfragen, sich anmelden, vorbeikommen, kaufen. Alles auf der Seite führt dorthin.
   - Gibt es schon eine Webseite? Wenn ja, die Adresse. **Bei Ja** folgst du dem Skill `webseite-modernisieren`: Er beginnt mit der Bestandsaufnahme der alten Seite, damit nichts verloren geht.
3. **Zwei Annahmen.** `Erfolg:` schlägst du selbst vor: woran die Person in drei Monaten merkt, dass es funktioniert, als Zahl oder als Ereignis, das man sehen kann (z. B. «zehn Anfragen im Monat»). `Modus:` ist machen, ausser die Person hat schon anders gewählt. Sag dazu: «Ich mache die Arbeit und erkläre dir jeden Schritt in einem Satz. Willst du die wichtigen Schritte lieber selbst lernen, sag es, das geht jederzeit.» Beide bestätigt sie in einer Nachricht.
4. **`docs/projekt.md`** im Projektordner:

   ```markdown
   # <Projektname>

   Projektname: <Name>
   In einem Satz: …
   Für wen: …
   Hauptsache: … (Knopf: «…»)
   Erfolg: [Annahme: …]
   Bestehende Seite: keine
   Modus: machen
   Weg: Webseite (oder Geschäft)
   Stand: <TT.MM.JJJJ>, Idee steht
   Nächster Schritt: Research: vergleichbare Seiten anschauen
   ```

5. **`AGENTS.md`** im Projektordner, mit genau diesem Text. Er sagt jeder KI, auch in einem neuen Gespräch, wo ihr steht und was gilt. Es ist derselbe Text wie in der Vorlage für das Logbuch im Hafen.

   ```markdown
   # Hinweise für die KI

   Dieses Projekt gehört einer Person, die mit Albatros ihre Webseite oder ihr Geschäft baut, meist ohne Technik-Vorwissen. Ob Claude Code, Codex, Gemini CLI oder Cursor: Für jede KI gilt dasselbe.

   ## Zuerst

   Lies `docs/projekt.md` (Stand, nächster Schritt), dann ruf `lage` auf (Albatros), immer mit `skills_stand`: dem Wert von `stand` unter `metadata` oben in den Skills von Albatros. `lage` sagt, welcher Skill und welcher Abschnitt jetzt dran ist; folge ihm. Gibt es `docs/projekt.md` noch nicht, beginnt das Projekt mit dem Skill `webseite-planen`, Abschnitt Idee. Ohne Verbindung zu Albatros hilft der Skill `lotse` weiter.

   ## Regeln

   - Drei Ja-Momente, und nur die Person sagt Ja: Plan bestätigt (`Bestätigt:` in `docs/plan.md`), Entwurf freigegeben (`Freigegeben zum Bauen:` in `docs/entwurf.md`), Seite freigegeben (`Freigegeben:` in `docs/prd.md`). «Sieht gut aus» ist kein Ja.
   - Nichts geht ins Netz ohne Freigabe: kein Veröffentlichen und kein Push in den Hafen, bevor die Person ihre Seite freigegeben hat (`Freigegeben:` in `docs/prd.md`). Nach dem Livegang braucht jede Änderung ihr eigenes Ja.
   - Preise nur aus `konto_status`, nie aus dem Gedächtnis.
   - Höchstens zwei Fragen in einer Nachricht. Was du selbst vorschlagen kannst, steht als `[Annahme: …]`, was offen ist, als `[offen: …]`. Nichts erfinden.
   - Nach jedem geschafften Schritt: `Stand:` und `Nächster Schritt:` in `docs/projekt.md` nachführen, `schritt_melden` (mit `titel`, dem Wert der Zeile `Projektname:`, sobald es sie gibt), dann `lage` erneut, mit `skills_stand`.
   - Passwörter, Kartennummern und private Schlüssel gehören nie in den Chat und nie in eine Datei des Projekts. Geheimnisse stehen in `.env`, und `.env` steht in `.gitignore`.
   - Du-Form, Alltagssprache. Ein Fachwort kommt erst mit seinem Bild.
   ```

   Dazu zwei kleine Dateien, damit auch Claude Code und Gemini CLI den Text lesen (Codex und Cursor lesen `AGENTS.md` selbst): `CLAUDE.md` mit der Zeile «Es gelten die Hinweise in AGENTS.md.» und darunter `@AGENTS.md`, `GEMINI.md` mit derselben Zeile und darunter `@./AGENTS.md`.
6. **Die graue Skizze, der erste sichtbare Erfolg.** Schreib `design/skizze.html`: die Startseite von oben nach unten, nur in Grau, mit den echten Worten aus `docs/projekt.md`. Noch keine Farben, keine Bilder, keine Schrift zum Aussuchen; graue Flächen zeigen, wo später Bilder hinkommen. Eine einzige Datei ohne Verweise nach aussen, am Handy lesbar:

   ```html
   <!doctype html>
   <html lang="de">
   <head>
   <meta charset="utf-8">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <title>Skizze: <Projektname></title>
   <style>
     body { margin: 0; font: 17px/1.5 system-ui, sans-serif; color: #333; background: #eee; }
     header, section, footer { max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem; }
     .flaeche { background: #ccc; border-radius: 8px; min-height: 12rem; }
     .knopf { display: inline-block; background: #555; color: #fff; padding: .8rem 1.4rem; border-radius: 8px; }
     .notiz { font-size: .85rem; color: #777; }
   </style>
   </head>
   <body>
     <header><strong><Projektname></strong> · Start · Angebot · Kontakt</header>
     <section><h1><In einem Satz></h1><p><Für wen></p><span class="knopf"><Hauptsache als Knopf></span></section>
     <section><div class="flaeche"></div><p class="notiz">Hier kommt später ein Bild.</p></section>
     <section><h2>Was Besucher wissen müssen</h2><p>…</p></section>
     <footer>Impressum · Datenschutz<p class="notiz">Skizze in Grau: zuerst die Reihenfolge, Farben und Bilder kommen später.</p></footer>
   </body>
   </html>
   ```

   Öffne sie im Browser (`open design/skizze.html`; Linux `xdg-open`, Windows `start`) und sag in einem Satz, was die Person sieht: «Das ist die Reihenfolge deiner Startseite, noch ganz in Grau. Farben und Bilder kommen später.»
7. **Weg Geschäft:** Jetzt prüft die Methode `ideen-check`, ob die Idee trägt. Hol sie mit dem Werkzeug `methode` (`name: ideen-check`) und folge ihr. Sie endet mit der Zeile `Entscheid:` in `docs/ideen-check.md`: **weiter** (dann Research mit Zielgruppe, Angebot und Preis), **anpassen** (eine neue Runde im Ideen-Check) oder **stoppen** (ein ehrliches, geschafftes Ende). Steht dort «Hausaufgabe offen bis …», wartet der Fahrplan auf die Person: Trag es in `docs/projekt.md` bei `Stand:` und `Nächster Schritt:` ein und hör für heute auf. Antwortet `methode`, die Methode sei nur für Mitglieder, sag es ehrlich und schreib `docs/ideen-check.md` nicht aus dem Gedächtnis.

**Lernmomente:** Warum ein Projekt einen Namen braucht, bevor es etwas gibt. Eine Hauptsache statt fünf.

**Geschafft, wenn** `docs/projekt.md` alle Zeilen hat, der Projektname nicht leer ist, `AGENTS.md` im Projekt liegt und die Skizze geöffnet wurde; auf dem Weg Geschäft steht dazu `Entscheid: weiter` oder `Entscheid: stoppen`. Dann `schritt_melden` mit `idee` und `titel`, dem Wert der Zeile `Projektname:` (zum Beispiel `titel: Mittagstisch Wipkingen`).

## Research

**Bild:** Die Reiseführer lesen, bevor man losfliegt: was man dort erwartet, was man besser lässt, was man mitbringen muss. Die Reiseführer sind vergleichbare Seiten in der Region und Branche der Person.

Du fängst ohne Rückfrage an. Die eine Frage an die Person ist, welche Texte, Fotos und welches Logo sie schon hat. Ob sie selbst Seiten kennt, die ihr gefallen, fragst du nebenbei; ihre kommen zu deinen dazu.

1. **Bis zu drei vergleichbare Seiten.** Such sie im Netz, in der Region und Branche der Person. Ruf jede Adresse selbst auf und prüf, dass sie antwortet, zum Beispiel so:
   ```bash
   curl -sL -o /dev/null -w '%{http_code}\n' --max-time 15 https://www.beispiel.ch/
   ```
   200 heisst erreichbar. Was nicht antwortet, kommt nicht hinein. Findest du weniger als drei, schreib den Grund dazu. Kannst du nicht ins Netz, nennt die Person die Seiten; sonst steht dort `[offen: …]`. Nie erfundene Adressen.
2. **Was alle haben** (`Übliche Seiten und Funktionen:`): welche Seiten, welches Menü, Anfrage, Buchung, Preise, Öffnungszeiten. Was alle haben, erwarten Besucher auch hier.
3. **Übernehmen und vermeiden:** was sich bewährt, und was die Seite der Person bewusst anders macht, beides als `[Annahme: …]`. Abgucken ist erlaubt, kopieren nicht: Texte, Bilder und Gestaltung anderer übernimmst du nie.
4. **Pflichten:** Impressum, Datenschutz, Bildrechte, Cookies. In der Schweiz braucht fast jede Seite Impressum und Datenschutzerklärung; Einzelheiten im Skill `recht-ch`. Keine Rechtsberatung.
5. **Inhalte vorhanden:** «Welche Texte, Fotos und welches Logo hast du schon?» Sagt die Person «haben wir», bitte gleich darum (Text, Liste oder ein Foto davon), vor allem um alles, was eine Funktion braucht, zum Beispiel Kurse mit Zeiten und Plätzen. Was fehlt, kommt auf die Liste für den Skill `inhalte`. Fehlende Inhalte sind der häufigste Grund, warum Seiten nie fertig werden.
6. **Suchbegriffe:** drei bis fünf Worte, mit denen jemand die Person suchen würde, als `[Annahme: …]`. Daraus entstehen später Titel und Texte, die man findet.
7. **`docs/recherche.md`** schreiben und der Person in fünf Zeilen erklären: was die Vorbilder gemeinsam haben, was ihr übernehmt, was ihr anders macht, welche Pflichten gelten und welche Inhalte noch fehlen. Die Annahmen bestätigt sie in einer Nachricht.

   ```markdown
   # Research: <Projektname>
   Stand: <TT.MM.JJJJ>

   Vorbilder: <Adresse> (aufgerufen am <TT.MM.JJJJ>, erreichbar): gefällt, weil …; …
   Übliche Seiten und Funktionen: …
   Übernehmen: [Annahme: …]
   Vermeiden: [Annahme: …]
   Pflichten: Impressum, Datenschutzerklärung, …
   Inhalte vorhanden: …; fehlt: …
   Suchbegriffe: [Annahme: «…», «…», «…»]
   ```

**Weg Geschäft:** Zuerst kommen die Methoden `zielgruppe` und `angebot-und-preis` (Werkzeug `methode`), aber erst, wenn `docs/ideen-check.md` «Entscheid: weiter» sagt. Sie schreiben `docs/zielgruppe.md` und `docs/angebot.md` und tragen in `docs/recherche.md` ein, was der Research daraus braucht; die vergleichbaren Angebote werden die Vorbilder. Danach füllst du hier nur noch die Zeilen, die fehlen.

**Lernmoment:** Abgucken ist erlaubt, kopieren nicht.

**Geschafft, wenn** `docs/recherche.md` alle sieben Zeilen hat und jede Adresse bei den Vorbildern aufgerufen und erreichbar war. Dann `schritt_melden` mit `recherche`.

## Grundriss

**Bild:** Der Grundriss des Hauses: welche Zimmer, welche Gänge, wo die Haustür ist.

1. **Fünf Fragen, die nur die Person beantworten kann,** höchstens zwei auf einmal, und nur, was noch fehlt:
   - Was sollen Besucher tun können: anfragen, buchen, sich anmelden, bezahlen? Jede Funktion braucht später einen Ablauf mit Bestätigung und Fehlerfall.
   - Gibt es Bereiche nur für bestimmte Leute? Wer darf was sehen und ändern?
   - In welchen Sprachen? Jede Sprache verdoppelt die Texte.
   - Bis wann soll es online sein? Gibt es einen Anlass?
   - Wer ändert später Texte und Termine, und wie oft?
2. **Den Rest schlägst du begründet vor, als Standard statt als Frage:**
   - `Seiten:` Für den ersten Flug höchstens fünf bis sieben, Impressum und Datenschutz zählen mit. Ein bewährter Start: Startseite (wer, was, für wen, und der Knopf zur Hauptsache), Angebot, Über uns, Kontakt, Impressum und Datenschutz. Jede Seite muss gepflegt werden.
   - `Setup:` Standard ist eine Seite ohne eigene Dienste: Texte und Bilder, auch in mehreren Sprachen, Listen wie Termine als Datei im Projekt, Anfragen per Mail. Erst eine Anmeldeliste, Buchungen mit Plätzen, ein Login oder eine Pinnwand für andere braucht einen Baustein (Skill `bausteine`, später mit eigenem Server). Ein System zur Inhaltspflege (Skill `cms`) kommt erst, wenn regelmässig jemand ohne Technik Inhalte ändert. Der Wert beginnt mit dem deutschen Wort `statisch` (Seite ohne eigene Dienste) oder `baustein` (mit Anmeldeliste, Buchung, Login oder Pinnwand), danach ein Satz in der Sprache der Person; die Wörter bleiben deutsch, Albatros liest nur das erste.
   - `Testing:` woran ihr erkennt, dass es fertig ist: drei bis fünf Sätze, die man prüfen kann, ausgehend von der Hauptsache. Zum Beispiel: «Am Handy sieht man ohne Scrollen, worum es geht, und den Knopf «Platz anfragen».» «Eine Anfrage kommt an, und wer anfragt, bekommt eine Bestätigung.» «Impressum und Datenschutz sind von jeder Seite aus erreichbar.»
   - `Release:` das Datum oder der Anlass der Person, und dazu der Weg ins Netz als Standard: Die Person sieht ihre Seite zuerst auf ihrem Computer und gibt sie frei, dann wählt sie, wo die Seite wohnt (bei Albatros oder selbst), dann geht sie live. Vor der Freigabe geht nichts ins Netz.
3. **`docs/plan.md`** schreiben:

   ```markdown
   # Plan: <Projektname>

   Worum es geht: <In einem Satz>, für <Für wen>. Erfolg: <Erfolg> (aus docs/projekt.md)

   Projektname: <aus docs/projekt.md>
   Seiten: [Annahme: Start, Angebot, Über uns, Kontakt, Impressum und Datenschutz]
   Funktionen: Hauptsache «…»: …; Bestätigung: …; Fehler: …
   Zugang: …
   Sprachen: …
   Setup: [Annahme: statisch, Seite ohne eigene Dienste, weil …]
   Testing: [Annahme: …; …; …]
   Release: <Datum oder Anlass>; Weg ins Netz: auf dem Computer ansehen, Freigabe, Wohnort wählen, live
   Pflege: …
   Stand: <TT.MM.JJJJ>, Grundriss steht, noch nicht geprüft

   ## Seiten
   - Start: …

   ## Inhalte
   | Was | Haben wir | Fehlt noch: wer liefert bis wann |
   |---|---|---|
   ```

   Lies der Person den Plan in kurzen Worten vor. Die Annahmen bestätigt sie in einer Nachricht.

**Weg Geschäft:** Den Bauplan der Startseite von oben nach unten und die Abnahme schreibt die Methode `landingpage` (Werkzeug `methode`) in `docs/plan.md`. Danach ergänzt du mit den Fragen oben die Zeilen, die dort noch `[offen]` sind.

**Lernmoment:** Warum jede Seite gepflegt werden muss.

**Geschafft, wenn** `docs/plan.md` alle zehn Zeilen hat, offene Punkte als `[offen: …]` dastehen und nichts erfunden ist. Dann `schritt_melden` mit `plan`.

## Plan prüfen

**Bild:** Die zweite Meinung der Statikerin, bevor gebaut wird. Sie hat den Plan nicht gezeichnet und sieht darum, was dem Architekten entgangen ist.

1. **Zweite Meinung in frischem Kontext.** Wer den Plan geschrieben hat, sieht seine Lücken am schlechtesten, auch du. Darum prüft ein frischer Kontext, der nur `docs/` liest und die Vorgeschichte nicht kennt:

   | KI | So |
   |---|---|
   | Claude Code | ein Subagent, oder `claude -p` im Projektordner |
   | Codex | `codex exec` im Projektordner |
   | Gemini CLI | `gemini -p` im Projektordner |
   | Cursor | ein neuer Agent-Chat, oder `agent -p` im Projektordner |

   Geht nichts davon, bittest du die Person, ein neues Gespräch zu öffnen und den Auftrag hineinzukopieren. Der Auftrag, wörtlich:

   > Lies nur die Dateien in docs/ und prüfe den Plan in docs/plan.md gegen diese Liste. Gib für jeden Punkt ok, Risiko oder offen an, mit der Stelle (Datei und Zeile) und einem Satz Begründung. Erfinde nichts: Was nicht in docs/ steht, ist offen.
   > 1. Genau eine Hauptsache, und jede Seite dient ihr
   > 2. Höchstens fünf bis sieben Seiten für den ersten Flug
   > 3. Jede Funktion hat einen Ablauf mit Bestätigung, Fehler und leerem Zustand
   > 4. Die Inhalte sind vorhanden, oder es ist klar, wer sie bis wann liefert
   > 5. Es ist geklärt, wer was darf, und ob es dafür einen Baustein braucht
   > 6. Impressum, Datenschutz und Bildrechte sind eingeplant
   > 7. Das Erfolgsmass ist eine Zahl oder ein beobachtbares Ereignis
   > 8. Es ist klar, was es nach dem Lancieren kostet und wer es bezahlt
   > 9. Das grösste Risiko ist benannt, und was für den ersten Flug wegfällt
   > 10. Das Datum passt zum Umfang

2. **`docs/plan-pruefung.md`** mit dem Ergebnis, ohne Note und ohne Quote: jeder Punkt ehrlich ok, Risiko oder offen.

   ```markdown
   # Prüfung des Plans: <Projektname>

   Geprüft am: <TT.MM.JJJJ>
   Zweite Meinung: <KI und Weg, z. B. Claude Code, Subagent in frischem Kontext>; <Anzahl> ok, <Anzahl> Risiko, <Anzahl> offen

   | Punkt | Ergebnis | Stelle | Begründung |
   |---|---|---|---|
   ```

3. **Die Person entscheidet.** Zeig ihr nur die Punkte mit Risiko oder offen, je in einem Satz mit deinem Vorschlag. Dann die Frage: «Ich habe die Punkte mit Risiko oder offen markiert. Ist der Plan so final, oder ändern wir etwas?» Das ist der erste von drei Ja-Momenten auf dem ganzen Weg: Erst ein bestätigter Plan wird gestaltet. «Sieht gut aus» ist kein Ja; dann fragst du nach.
4. **Erst nach ihrem Ja** kommt in `docs/plan.md` die Zeile `Bestätigt: <TT.MM.JJJJ>, «<ihr Wortlaut>»`, und bei `Stand:` steht «geprüft und bestätigt». Vorher nie. Will sie etwas ändern, änderst du den Plan, prüfst die geänderten Punkte nochmals in frischem Kontext und fragst wieder.

**Modernisieren:** Die zweite Meinung prüft zusätzlich, dass keine Funktion der alten Seite ohne Entscheid verloren geht (`docs/bestand.md`, Spalte Entscheid). Häng das als elften Punkt an den Auftrag.

**Lernmoment:** Wer den Plan geschrieben hat, sieht seine Lücken am schlechtesten.

**Geschafft, wenn** jeder Punkt der Prüfliste ok, Risiko oder offen mit Stelle ist und `docs/plan.md` die Zeile `Bestätigt:` mit dem Ja der Person hat. Dann `schritt_melden` mit `plan-geprueft`. Als Nächstes kommt der Charakter der Seite (Skill `konzept`), noch vor Farben und Code.

**Bauen lassen:** Zeigt `lage` danach eine Zeile `Angebot:`, sagst du es der Person einmal, mit dem Betrag genau so, wie `lage` ihn nennt, nie aus dem Gedächtnis. Etwa so: «Dein Plan steht. Ab hier wird gestaltet und gebaut. Du kannst mit mir selbst weiterbauen: Bis deine Seite auf deinem Computer fertig ist, kostet Albatros nichts. Oder Albatros baut sie für dich: Du bekommst Entwürfe zur Wahl und danach eine Vorschau deiner ganzen Seite. Bezahlen musst du erst, wenn du die Seite willst: <Betrag aus lage>. So oder so kommen jetzt fünf Fragen zum Charakter deiner Seite. Was ist dir lieber?» Ihre Wahl schreibst du gleich in `docs/projekt.md`: `Bauen lassen: selbst (<TT.MM.JJJJ>)` oder `Bauen lassen: albatros (<TT.MM.JJJJ>)`; die Wörter `selbst` und `albatros` bleiben deutsch. Dann kommt das Angebot nicht wieder. Ohne Zeile `Angebot:` sagst du nichts dazu; fragt die Person selbst, ob Albatros bauen kann, nennst du den Weg einmal, mit dem Betrag aus `konto_status`. Mit `albatros` geht es trotzdem zuerst mit dem Konzept weiter, danach kommt die Übergabe (Skill `konzept`, Abschnitt «Übergabe an Albatros»).

## Was du der Person ersparst

- **Zu viel auf einmal:** Blog, Shop und Mitgliederbereich sind etwas für später. Zuerst eine Seite, die die Hauptsache gut kann. Mehrere Sprachen sind kein Problem, wenn die Texte da sind.
- **Technik-Entscheide zu früh:** Für den Plan reicht der Standard oben. Ein Baustein oder ein System für Inhalte kommt erst, wenn eine Funktion es wirklich braucht.
- **Logo und Farben als Erstes:** Charakter und Gestaltung kommen nach dem bestätigten Plan. Eine schöne leere Seite hilft niemandem.

## Mission prüfen

Nach `schritt_melden` prüfst du die Mission des Abschnitts mit `mission_pruefen`. Sie besteht, sobald der Schritt auf der Insel steht:

| Abschnitt | Mission | Weg Geschäft zusätzlich |
|---|---|---|
| Idee | `flugschule-11-idee` | `geschaeft-01-ideen-check` |
| Research | `flugschule-12-recherche` | `geschaeft-02-zielgruppe`, `geschaeft-03-angebot-und-preis` |
| Grundriss | `webseite-01-webseite-planen` (Weg Webseite) | `geschaeft-05-landingpage` |
| Plan prüfen | `flugschule-13-plan-pruefen` | |

Ohne Anmeldung entfällt das; die Dateien im Projekt sind trotzdem das Ergebnis.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild des Abschnitts (das Ziel auf der Karte, die Reiseführer, der Grundriss, die zweite Meinung der Statikerin), der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
