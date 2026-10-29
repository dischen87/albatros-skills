---
name: webseite-modernisieren
description: 'Modernisiert eine bestehende Webseite (Verein, Laden, Praxis, alte Jimdo-, Wix- oder WordPress-Seite) für eine Person ohne Vorwissen. Legt sofort ohne Rückfrage mit der Bestandsaufnahme los: alle Seiten, jede Funktion (Formulare, Anmeldungen, Termine, PDFs, Preise, Galerien, Karten, Sprachen) und alle Inhalte, mit Fotos der alten Seite in docs/bestand.md. Fragt danach nur, was nur die Person weiss, und führt über Plan und Gestaltung zur neuen Seite, ohne dass eine Funktion ungefragt verloren geht. Nutze den Skill bei «Modernisiere …», «modernisiere unsere Webseite», «unsere Seite ist veraltet», «Webseite erneuern», «Relaunch», «weg von Jimdo, Wix oder WordPress», «die alte Seite neu machen», und sofort, wenn jemand nur die Adresse einer Webseite schickt (https://…), ohne weitere Worte.'
---

# Webseite modernisieren: einen Altbau renovieren

## Das Bild

Ein Altbau wird renoviert, nicht abgerissen. Zuerst geht jemand mit Notizblock und Kamera durch jedes Zimmer: Was ist da, was funktioniert, was ist morsch, und was ist der Familie heilig, zum Beispiel der Kachelofen. Erst mit diesem Bestandsplan wird umgebaut. Und keine Wand kommt weg, ohne dass die Familie Ja gesagt hat.

**So setzt du das Bild ein:** Ein Satz dazu in deiner ersten Antwort, zusammen mit dem, was du gerade tust.

## So sprichst du

- **Sofort loslegen.** Schickt die Person eine Adresse oder «Modernisiere …», fragst du nicht, was sie will. Du sagst in einem Satz, dass du jetzt jedes Zimmer der alten Seite anschaust und wie lange das etwa dauert, und fängst an.
- Die Person muss nie wissen, was der nächste Schritt ist. Du schlägst ihn vor und machst ihn nach einem kurzen Ja.
- Du-Form, Alltagssprache. Statt «Sitemap» sagst du «Liste aller Seiten», statt «Formular-Backend» «wohin die Anfragen gehen».
- Du fragst nur, was nur die Person weiss. Alles, was auf der Seite steht, liest du selbst nach.
- Frag nie nach Passwörtern, auch nicht nach dem Login der alten Seite. Was hinter einem Login liegt, notierst du als «nicht einsehbar».

## Ablauf

### 1. Bestandsaufnahme, ohne Rückfrage

Arbeitsordner ist ein neuer Ordner im aktuellen Ordner, benannt nach der Seite (zum Beispiel `curling-grindelwald`). Für die Bestandsaufnahme braucht es weder ein Konto noch einen Server. Ruf zuerst `konto_status` auf. Zeigt es ein Konto, öffnest du als Allererstes die Insel im Browser, mit `open https://albatros.build/cockpit/insel` (Präfix für andere Sprachen und Befehle für Linux und Windows im Skill `webseite-bauen`, Abschnitt «Die Insel»). Ohne Antwort oder ohne Konto geht es ohne Insel weiter.

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

### 2. Der Bestandsplan `docs/bestand.md`

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

### 3. Zurückmelden, dann nur drei Fragen

Sag in einfachen Worten, was du gefunden hast, kurz und mit Zahlen: wie viele Seiten, welche Funktionen, was veraltet ist, was gut ist. Dann stellst du nur die Fragen, die nur die Person beantworten kann, nummeriert in einer Nachricht:

1. **Wer pflegt die Seite** heute und künftig, und wie oft ändert sich etwas?
2. **Was ist heilig?** Was muss genau so bleiben (Logo, Farben, ein Text, eine Seite, eine Funktion)?
3. **Wer soll mehr kommen?** Gäste, neue Mitglieder, Sponsoren, Teams für Turniere?

Alles andere schlägst du selbst vor, mit markierten Annahmen (`[Annahme: …]`), die die Person korrigieren kann.

### 4. Vom Bestand zum Plan

Folge dem Skill `webseite-planen`. Die meisten Antworten stehen schon im Bestand: Übernimm sie und lass die Person nur bestätigen. Jede Funktion aus dem Bestand kommt in den Plan, mit einem Vorschlag:

- Was nur Texte und Dateien braucht (Termine, Turniere, PDFs, Preise, Sponsoren, Galerie), wird eine normale statische Seite, auch mit mehreren Sprachen (Light reicht).
- Formulare: Ein Mail-Link reicht oft. Soll die Liste der Anmeldungen gespeichert werden, ist das ein Baustein (Skill `bausteine`, mit Pilot).
- Ein Gästebuch voller Werbung oder ein Login, den nur die alte Technik brauchte, darf wegfallen, aber nur mit Entscheid der Person.
- Alte Adressen, die andere verlinken (Ausschreibungen, Ranglisten, Google-Treffer), bleiben gleich oder bekommen eine Umleitung.

Die Entscheide trägst du in `docs/bestand.md` (Spalte Entscheid) und in `docs/plan.md` ein.

### 5. Bauen in acht Schritten

Ab hier folgst du dem Skill `webseite-bauen`, in seiner festen Reihenfolge: Mockup, Design, Framework, PRD, lokal, Hafen, Fliessband, Seite oder Server. Dabei gilt zusätzlich:

- Das PRD führt jede Funktion aus `docs/bestand.md` auf, mit ihrem Entscheid. Keine fällt still weg.
- Für die Gestaltung liest du die Fotos der alten Seite mit: Was ist heilig (Logo, Farben)? Was wirkt veraltet?
- Nach dem lokalen Bau zeigst du vorher und nachher nebeneinander, Startseite und wichtigste Unterseite, am Handy und am Desktop, mit drei Sätzen dazu, was besser und was gleich geblieben ist.
- Die alte Adresse zeigt erst auf die neue Seite, wenn die neue läuft (Skill `domain`).

## Rechte

Texte, Fotos und Logos der alten Seite gehören jemandem, meist dem Verein oder Geschäft, manchmal einer Fotografin. Wer eine Seite modernisiert, die ihm nicht selbst gehört, braucht die Erlaubnis der Betreiber, bevor etwas davon veröffentlicht wird. Die heruntergeladenen Dateien sind eine Arbeitskopie zum Anschauen. Fotos mit erkennbaren Personen brauchen deren Einverständnis. Vor dem Veröffentlichen fragst du darum: «Gehören euch die Texte und Bilder, oder habt ihr die Erlaubnis, zum Beispiel vom Vorstand?»

## Stolpersteine

- Eine Funktion geht still verloren: Formular ersetzt durch nichts, Ranglisten nicht mehr auffindbar. Prüf am Ende jede Zeile im Bestand.
- Alte Adressen brechen: Ausschreibungen und Ranglisten sind oft von anderen Seiten verlinkt.
- Eine Galerie mit Tausenden Bildern eins zu eins übernehmen: lieber eine Auswahl der besten, verkleinert, der Rest bleibt im Archiv.
- Nach KI aussehen: Lies im Skill `gestaltung` die Liste der typischen Merkmale, bevor du die erste Seite baust.
- Das Cookie-Banner der alten Seite übernehmen: Eine statische Seite ohne Tracking und ohne fremde Einbettungen setzt keine Cookies und braucht keins. Es reicht die Datenschutzerklärung. Ein Banner kommt nur, wenn etwas eine Einwilligung braucht, zum Beispiel eine eingebettete Karte von Google. Statt der Karte reicht meist ein Link «Route planen» mit der Adresse, dann bleibt die Seite ohne Banner.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «einen Altbau renovieren», der den Kern noch einmal sagt. Danach: was gefunden oder gebaut ist, wo es liegt (`docs/bestand.md`, Fotos), was die Person noch entscheiden muss und was als Nächstes kommt.
