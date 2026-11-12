---
name: webseite-modernisieren
description: 'Modernisiert eine bestehende Webseite (Verein, Laden, Praxis, alte Jimdo-, Wix- oder WordPress-Seite) für eine Person ohne Vorwissen, als Variante des Fahrplans. Legt sofort ohne Rückfrage mit der Bestandsaufnahme los: alle Seiten, jede Funktion (Formulare, Anmeldungen, Termine, PDFs, Preise, Galerien, Karten, Sprachen) und alle Inhalte, mit Fotos der alten Seite in docs/bestand.md. Fragt danach nur, was nur die Person weiss, vor allem was bleiben muss, und führt über Grundriss und Plan prüfen (keine Funktion geht ohne Entscheid verloren) zur neuen Seite; beim Livegang zieht die Domain mit Umleitungen um, die E-Mail bleibt unberührt. Nutze den Skill bei «Modernisiere …», «modernisiere unsere Webseite», «unsere Seite ist veraltet», «Webseite erneuern», «Relaunch», «weg von Jimdo, Wix oder WordPress», «die alte Seite neu machen», und sofort, wenn jemand nur die Adresse einer Webseite schickt (https://…), ohne weitere Worte.'
metadata:
  stand: 0.3.1
---

# Webseite modernisieren: einen Altbau renovieren

## Das Bild

Ein Altbau wird renoviert, nicht abgerissen. Zuerst geht jemand mit Notizblock und Kamera durch jedes Zimmer: Was ist da, was funktioniert, was ist morsch, und was ist der Familie heilig, zum Beispiel der Kachelofen. Erst mit diesem Bestandsplan wird umgebaut. Und keine Wand kommt weg, ohne dass die Familie Ja gesagt hat.

**So setzt du das Bild ein:** Ein Satz dazu in deiner ersten Antwort, zusammen mit dem, was du gerade tust.

## So sprichst du

- **Sofort loslegen.** Schickt die Person eine Adresse oder «Modernisiere …», fragst du nicht, was sie will. Du sagst in einem Satz, dass du jetzt jedes Zimmer der alten Seite anschaust und wie lange das etwa dauert, und fängst an.
- Die Person muss nie wissen, was der nächste Schritt ist. Du schlägst ihn vor und machst ihn nach einem kurzen Ja.
- Du-Form, Alltagssprache. Statt «Sitemap» sagst du «Liste aller Seiten», statt «Formular-Backend» «wohin die Anfragen gehen».
- Du fragst nur, was nur die Person weiss, höchstens zwei Fragen in einer Nachricht. Alles, was auf der Seite steht, liest du selbst nach und schlägst es als `[Annahme: …]` vor.
- Frag nie nach Passwörtern, auch nicht nach dem Login der alten Seite. Was hinter einem Login liegt, notierst du als «nicht einsehbar».
- Lernen oder machen, Lücken melden: wie im Skill `lotse`.

## Der Fahrplan beim Renovieren

Modernisieren folgt demselben Fahrplan wie eine neue Seite (Skill `lotse`, «Der Fahrplan in drei Etappen»), mit diesen Unterschieden:

| Abschnitt | Beim Renovieren | Insel |
|---|---|---|
| Idee | kurz: Was die alte Seite will, liest du selbst; die Person sagt, was bleiben muss | `idee` |
| Research | die Bestandsaufnahme der alten Seite (Abschnitt «Bestandsaufnahme» unten) | `recherche` |
| Grundriss, Plan prüfen | Skill `webseite-planen`, dazu: Keine Funktion geht ohne Entscheid verloren | `plan`, `plan-geprueft` |
| Gestalten, entwerfen, bauen | die üblichen Skills, mit dem Bestand als Auftrag | |
| Live schalten | dazu: Die Domain zieht mit Umleitungen um, die E-Mail-Einträge (MX) bleiben unberührt | |

Weil du sofort loslegst, kommt die Bestandsaufnahme zuerst und die kurze Idee danach. Auf der Insel meldest du trotzdem zuerst `idee`, dann `recherche`. Alles bleibt bis zur Freigabe auf dem Computer der Person und kostet bei Albatros nichts.

## Bestandsaufnahme

Arbeitsordner ist ein neuer Ordner im aktuellen Ordner, benannt nach der Seite (zum Beispiel `curling-grindelwald`). Für die Bestandsaufnahme braucht es weder ein Konto noch einen Server. Ruf zuerst `konto_status` auf. Zeigt es ein Konto, öffnest du als Allererstes die Insel im Browser, mit `open https://albatros.build/cockpit/insel` (mit Sprachpräfix wie `/fr/cockpit/insel`; Linux `xdg-open`, Windows `start`). Ohne Antwort oder ohne Konto geht es ohne Insel weiter.

1. **Alle Seiten lesen.** Das Skript `bestand.mjs` liegt im Ordner dieses Skills (in Claude Code steht der Pfad oben als «Base directory for this skill»). Es braucht nur Node:
   ```bash
   node <ordner-dieses-skills>/bestand.mjs https://www.beispiel.ch docs/bestand
   ```
   Es liest `sitemap.xml`, folgt den Links derselben Adresse und legt ab: `docs/bestand/bestand.json` (Seiten, Formulare mit Feldern, Einbettungen, Mail, Telefon, Preise, Zeiten, Dokumente, fremde Dienste), den Text jeder Seite in `docs/bestand/seiten/` und Bilder und Dokumente in `docs/bestand/dateien/`. Ohne Node holst du die Liste der Seiten mit `curl -sL https://www.beispiel.ch/sitemap.xml` und jede Seite einzeln.
2. **Fotos der alten Seite.** Von jeder Seite aus der Navigation ein Foto in Handy- und Desktopbreite. Beim ersten Mal lädt Playwright einen Browser (etwa 150 MB):
   ```bash
   npx -y playwright install chromium
   npx -y playwright screenshot --viewport-size=390,844 --full-page https://www.beispiel.ch/ docs/bestand/fotos/start-390.png
   npx -y playwright screenshot --viewport-size=1440,900 https://www.beispiel.ch/ docs/bestand/fotos/start-1440.png
   ```
   Schau dir jedes Foto selbst an. Sie zeigen, was die Texte nicht sagen: Ordnung, Bilder, Handytauglichkeit.
3. **Jede Funktion finden.** Geh die Texte und Fotos mit dieser Liste durch und notiere zu jedem Punkt, wo er steht und wie er heute gebaut ist:
   - Formulare: Kontakt, Anmeldung, Reservation, Bestellung, Spieler- oder Partnerbörse, Gästebuch. Welche Felder, wohin gehen die Anfragen?
   - Termine: Kalender, Turniere, Kurse, Trainingszeiten, Öffnungszeiten, Saison.
   - Dokumente: PDFs (Ausschreibungen, Ranglisten, Statuten, Menükarten), wie viele, wie alt.
   - Preise, Mitgliederbeiträge, Tarife.
   - Bilder: Galerien (Alben, Anzahl), Logos, Sponsoren mit Links.
   - Einbettungen und fremde Systeme: Karte, Video, Buchungssystem, Shop, Newsletter, Social Media, Wetter, Webcam (`einbettungen` und `fremdeDienste` in `bestand.json`).
   - Bereiche mit Login, Sprachen, Impressum und Datenschutz, Links zu anderen Seiten.
4. **Der Bestandsplan `docs/bestand.md`:**

   ```markdown
   # Bestand: <Name der Seite>

   **Adresse:** … · **erfasst:** <Datum> · **gebaut mit:** <z. B. Jimdo> · **Seiten:** <Anzahl> · **Sprachen:** …

   ## Seiten
   | Seite | Adresse | Was drauf ist, in einem Satz | Zustand | Foto |
   |---|---|---|---|---|

   ## Funktionen
   | Funktion | Wo | Wie heute | Muss bleiben? | Entscheid |
   |---|---|---|---|---|
   | Kontaktformular (Name, E-Mail, Nachricht) | /kontakt | Formular von Jimdo | ja | offen |

   ## Inhalte
   Texte, Bilder (Anzahl, eigene oder fremde), Dokumente, Logos, Sponsoren.

   ## Was veraltet ist
   Jeder Punkt mit Beleg, zum Beispiel «News von 2019 auf der Startseite», «Bilder unscharf am Handy», «Gästebuch voller Werbung».

   ## Was bleiben muss
   Was die Besucher brauchen und was gut ist.

   ## Offene Fragen
   ```

   Die Spalte **Entscheid** bleibt «offen», bis die Person entschieden hat: «bleibt», «neu als …» oder «fällt weg (entschieden am <Datum>)». Keine Funktion verschwindet aus der neuen Seite, solange hier nicht so ein Entscheid steht.

   `docs/bestand/dateien/` kommt nicht ins Logbuch, sie ist zu gross und enthält fremde Rechte: Trag sie in `.gitignore` ein. Was die neue Seite davon braucht, kopierst du später gezielt hinüber.

## Die Idee, kurz

Sag in einfachen Worten, was du gefunden hast, kurz und mit Zahlen: wie viele Seiten, welche Funktionen, was veraltet ist, was gut ist. Dann stellst du nur die zwei Fragen, die nur die Person beantworten kann:

1. **Was muss bleiben?** Was ist heilig: Logo, Farben, ein Text, eine Seite, eine Funktion?
2. **Wer soll mehr kommen?** Gäste, neue Mitglieder, Sponsoren, Teams für Turniere?

Wer die Seite pflegt, fragst du später im Grundriss. Den Rest der Idee schlägst du aus der alten Seite vor, und die Person bestätigt ihn in einer Nachricht: Projektname (meist der Name der alten Seite), In einem Satz, Für wen, Hauptsache, Erfolg und Modus (machen). Dann schreibst du wie im Skill `webseite-planen`, Abschnitt Idee (Schritte 4 bis 6): `docs/projekt.md` mit `Bestehende Seite: <Adresse>`, `AGENTS.md` mit `CLAUDE.md` und `GEMINI.md`, und die graue Skizze `design/skizze.html` der neuen Startseite, in der schon steht, was bleiben muss. Öffne sie im Browser.

Dann `schritt_melden` mit `idee` und `titel`, dem Wert der Zeile `Projektname:` in `docs/projekt.md` (antwortet es «Ungültige Angaben» wegen `titel`, meldest du `idee` gleich nochmals ohne `titel`, wie im Skill `webseite-planen`), danach `mission_pruefen` mit `flugschule-11-idee`.

## Research aus dem Bestand

Der Research ist beim Renovieren schon fast fertig: Der Bestand ist der beste Reiseführer. Schreib `docs/recherche.md` mit den sieben Zeilen aus dem Bestand, jede am Zeilenanfang ohne Fettdruck (Vorlage im Skill `webseite-planen`, Abschnitt Research):

- `Vorbilder:` die alte Seite (aufgerufen, mit Datum), dazu auf Wunsch bis zu zwei vergleichbare Seiten, jede aufgerufen und erreichbar. Nie erfundene Adressen.
- `Übliche Seiten und Funktionen:` was die alte Seite hat (aus `docs/bestand.md`).
- `Übernehmen:` was bleiben muss. `Vermeiden:` was veraltet ist.
- `Pflichten:` Impressum, Datenschutz, Bildrechte und die Rechte an Texten und Bildern der alten Seite (unten, «Rechte»).
- `Inhalte vorhanden:` aus dem Bestand; was fehlt oder veraltet ist, kommt auf die Liste für den Skill `inhalte`.
- `Suchbegriffe:` als `[Annahme: …]`, aus den Titeln der alten Seite.

Erklär der Person das Ergebnis in fünf Zeilen. Dann `schritt_melden` mit `recherche` und `mission_pruefen` mit `flugschule-12-recherche`.

## Grundriss und Plan prüfen

Folge dem Skill `webseite-planen`, Abschnitt Grundriss. Die meisten Antworten stehen schon im Bestand: Übernimm sie und lass die Person nur bestätigen. Jede Funktion aus dem Bestand kommt in den Plan, mit einem Vorschlag:

- Was nur Texte und Dateien braucht (Termine, Turniere, PDFs, Preise, Sponsoren, Galerie), wird eine normale Seite ohne eigene Dienste, auch mit mehreren Sprachen.
- Formulare: Ein Mail-Link reicht oft. Soll die Liste der Anmeldungen gespeichert werden, ist das ein Baustein (Skill `bausteine`, später mit eigenem Server).
- Ein Gästebuch voller Werbung oder ein Login, den nur die alte Technik brauchte, darf wegfallen, aber nur mit Entscheid der Person.
- Alte Adressen, die andere verlinken (Ausschreibungen, Ranglisten, Google-Treffer), bleiben gleich oder bekommen beim Livegang eine Umleitung.

Die Entscheide trägst du in `docs/bestand.md` (Spalte Entscheid) und in `docs/plan.md` ein.

Danach folgt der Abschnitt «Plan prüfen» in `webseite-planen`, mit einem elften Punkt für die zweite Meinung: **Keine Funktion der alten Seite geht ohne Entscheid verloren** (jede Zeile in `docs/bestand.md` hat einen Entscheid, und jede, die bleibt, steht im Plan). Erst nach dem Ja der Person zum Plan geht es weiter.

## Gestalten, entwerfen, bauen

Danach geht es wie bei jeder neuen Seite weiter, Abschnitt für Abschnitt mit `lage`: Charakter (Skill `konzept`), Musterblatt (Skill `gestaltung`), die ganze Seite als Entwurf (Skill `entwurf`), dann bauen, prüfen und freigeben auf dem Computer (Skill `webseite-bauen`). Dein Auftrag ist `docs/plan.md` zusammen mit `docs/bestand.md`. Dabei gilt zusätzlich:

- Was bleiben muss (Logo, Farben, ein Text), ist der Rahmen für Charakter und Gestaltung. Lies die Fotos der alten Seite mit: Was ist heilig, was wirkt veraltet?
- Der Entwurf und später der Bauplan führen jede Funktion aus `docs/bestand.md` auf, mit ihrem Entscheid. Keine fällt still weg.
- Nach dem Bau zeigst du vorher und nachher nebeneinander, Startseite und wichtigste Unterseite, am Handy und am Desktop, mit drei Sätzen dazu, was besser und was gleich geblieben ist.

## Live schalten: die Domain zieht um

Die bisherige Domain der alten Seite (zum Beispiel `curling-wil.ch`) bleibt, bis die neue Seite live ist (Skill `lancieren`, Abschnitt Live schalten). Erst dann stellst du sie um (Skill `domain`, mit Albatros über `domain_verbinden`):

- **Umleitungen:** Jede alte Adresse aus `docs/bestand.md`, die es auf der neuen Seite nicht mehr gibt, bekommt eine Umleitung auf die passende neue Seite, damit Links von anderen und Google-Treffer nicht ins Leere führen. Mit eigenem Server geht das im Webserver (`nginx.conf`, `return 301`), sonst mit einer kleinen Seite an der alten Adresse, die weiterleitet. Prüf danach jede alte Adresse einmal.
- **E-Mail nie anfassen:** Die Domain bleibt bei ihrem Anbieter und kostet dort weiter pro Jahr. Die Einträge für die E-Mail (MX) fasst du nie an, sonst kommt keine Mail mehr an.

## Rechte

Texte, Fotos und Logos der alten Seite gehören jemandem, meist dem Verein oder Geschäft, manchmal einer Fotografin. Wer eine Seite modernisiert, die ihm nicht selbst gehört, braucht die Erlaubnis der Betreiber, bevor etwas davon veröffentlicht wird. Die heruntergeladenen Dateien sind eine Arbeitskopie zum Anschauen. Fotos mit erkennbaren Personen brauchen deren Einverständnis. Vor dem Veröffentlichen fragst du darum: «Gehören euch die Texte und Bilder, oder habt ihr die Erlaubnis, zum Beispiel vom Vorstand?»

## Stolpersteine

- Eine Funktion geht still verloren: Formular ersetzt durch nichts, Ranglisten nicht mehr auffindbar. Prüf am Ende jede Zeile im Bestand.
- Alte Adressen brechen: Ausschreibungen und Ranglisten sind oft von anderen Seiten verlinkt.
- Eine Galerie mit Tausenden Bildern eins zu eins übernehmen: lieber eine Auswahl der besten, verkleinert, der Rest bleibt im Archiv.
- Nach KI aussehen: Lies im Skill `gestaltung` die Liste der typischen Merkmale, bevor du die erste Seite entwirfst.
- Das Cookie-Banner der alten Seite übernehmen: Eine Seite ohne Tracking und ohne fremde Einbettungen setzt keine Cookies und braucht keins. Es reicht die Datenschutzerklärung. Ein Banner kommt nur, wenn etwas eine Einwilligung braucht, zum Beispiel eine eingebettete Karte von Google. Statt der Karte reicht meist ein Link «Route planen» mit der Adresse, dann bleibt die Seite ohne Banner.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «einen Altbau renovieren», der den Kern noch einmal sagt. Danach: was gefunden oder gebaut ist, wo es liegt (`docs/bestand.md`, Fotos), was die Person noch entscheiden muss und was als Nächstes kommt.
