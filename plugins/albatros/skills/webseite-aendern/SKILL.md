---
name: webseite-aendern
description: 'Ändert mit einer Person ohne Vorwissen ihre fertige Webseite mit ihrer eigenen KI, ob sie im Hafen von Albatros liegt oder selbst wohnt: Logbuch holen, zuerst docs/ lesen (Plan, Designsystem, Tech-Stack, PRD, Wohnort), dann klein (Text, Termin, Bild: lokal ändern, vorher und nachher zeigen, Freigabe, Push) oder gross (neue Seite, Funktion, anderes Aussehen: Nachtrag im Plan, Entwurf der geänderten Seiten, Freigabe zum Bauen, bauen und prüfen, zeigen, Freigabe, Push), immer im bestehenden Designsystem, danach im Netz nachprüfen. Nutze den Skill bei «ändere meine Seite», «neuer Termin», «Text ändern», «Bild austauschen», «es fehlt …», «neue Seite», «mach die Seite …», «auf der Seite steht etwas Falsches», und immer, wenn an einer Seite im Netz etwas anders werden soll.'
metadata:
  stand: 0.2.0
---

# Webseite ändern: Umbau im bewohnten Haus

## Das Bild

Ein Umbau im bewohnten Haus: Im Ordner liegen die Pläne und die Materialliste (`docs/`). Ein Bild aufhängen geht schnell. Eine neue Wand braucht zuerst einen Plan und ein Modell, das die Bewohner gesehen haben. Und man baut mit denselben Materialien weiter, sonst sieht es nach Flickwerk aus.

**So setzt du das Bild ein:** Ein Satz dazu in deiner ersten Antwort, zusammen mit der Einschätzung, ob es ein kleiner oder ein grosser Wunsch ist.

## So sprichst du

- Du-Form, Alltagssprache, kurze Sätze. Was du tust, sagst du vorher in einem Satz.
- Die Regeln stehen in `docs/`: Plan, Designsystem, Tech-Stack und PRD. Neue Farben, Schriften, Abstände oder ein anderes Framework gibt es nur nach einem ausdrücklichen Ja der Person, und dann zuerst in `design/tokens.css` (bei älteren Seiten `web/src/styles/tokens.css`) und `docs/designsystem.md`.
- Ins Netz geht nichts ohne Freigabe. Mit Light und bei den meisten Anbietern ist der Push schon die Veröffentlichung.
- Was die Person sehen soll (vorher und nachher, Vorschau, Entwurf, fertige Seite), öffnest du selbst: `open <adresse oder datei>` (Linux `xdg-open`, Windows `start`).
- Die Änderung mit der eigenen KI ist gratis, es braucht nur das Abo der KI beim Anbieter. Will die Person den Wunsch lieber nicht selbst umsetzen und wohnt die Seite bei Albatros mit Light, gibt es «Wir machen es für dich»: Sie beschreibt ihn, du rufst `wunsch_melden` auf, die Antwort nennt den Preis und den Link zur Zahlung. Sie bezahlt vor dem Umsetzen, den Stand sieht sie unter `https://albatros.build/cockpit/wuensche` (öffne die Adresse für sie). Mit eigenem Server (Pilot) oder bei «selbst» geht das nicht.

## Ablauf

### 1. Das Logbuch holen

Wo die Seite wohnt, steht in `docs/lancieren.md` (Zeile `Wohnort:`, Adresse unter `Adresse:`), sonst nennt es `konto_status`. Danach richtet sich, wo das Logbuch liegt:

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # Hafen von Albatros, beim ersten Mal
gh repo clone <benutzer>/<repo>                         # selbst, mit dem Logbuch bei GitHub
git pull --rebase                                       # jedes weitere Mal, im Projektordner
(cd web && npm ci)                                      # Bauwerkzeuge, liegen nicht im Logbuch
```

Liegt das Logbuch nur auf diesem Computer (selbst, ohne Repo), arbeitest du dort und holst nichts. Scheitert `git` mit «Permission denied», fehlt auf diesem Computer der Schlüssel (Skill `ssh-schluessel`).

**Hat Albatros die Seite gebaut** (im bisherigen Projektordner steht in `docs/projekt.md` `Bauen lassen: albatros`, und der Auftrag ist live), liegt das ganze Projekt im Hafen, und `docs/lancieren.md` gibt es nicht: `{name}` ist der Name der Seite aus `konto_status`. Zuerst kommt der Schlüssel (Skill `ssh-schluessel`). Das Logbuch holst du in einen neuen Ordner neben dem bisherigen, nicht hinein: `git clone git@aufwind.sh:{name}/projekt.git ../{name}-seite`. Ab jetzt arbeitest du dort; den bisherigen Ordner löschst du nicht. Im geholten Ordner rufst du `lage` mit `skills_stand` (dem Wert von `stand` unter `metadata` oben in dieser Datei) und mit dessen Belegen auf, darin `docs/prd.md` mit der Zeile `Freigegeben:`, die Albatros beim Ausliefern eingetragen hat (Schritt 4). Texte und Fotos, die die Person während des Baus gesammelt hat (im bisherigen Ordner `docs/inhalte.md` und `design/bilder/`), sind oft eine gute erste eigene Änderung.

### 2. Zuerst die Pläne lesen

Bevor du etwas änderst, liest du:

- `docs/designsystem.md` und `design/tokens.css` (bei älteren Seiten `web/src/styles/tokens.css`): Farben, Schriften, Abstände, Radien und Komponenten.
- `docs/stack.md`: womit die Seite gebaut ist (meist Astro, höchstens 50 KB JavaScript je Seite).
- `docs/prd.md`: was die Seite können muss, mit den Abnahmekriterien, dem Zugang und der Freigabe.
- `docs/projekt.md` (Zeile `Für wen:`, bei älteren Seiten `docs/plan.md`) oder `docs/bestand.md`: für wen die Seite ist. `design/entwurf/`, falls es ihn gibt: das Modell der Seiten.
- `web/src/data/*.json`: Listen wie Termine, Preise oder Sponsoren.

Fehlt `designsystem.md` oder `stack.md` (ältere Seite), schreibst du sie zuerst kurz aus dem, was da ist (`tokens.css`, `web/package.json`), und sagst das der Person. Fehlt `scripts/pruefen.mjs`, holst du es wie im Skill `webseite-bauen`, Schritt 0.

### 3. Klein oder gross?

- **Klein:** Text, Termin, Preis, Öffnungszeit, Link oder ein Bild auf einer bestehenden Seite. Der Weg: lokal ändern, vorher und nachher zeigen, Freigabe, Push (Schritte 4 bis 7). Termine und Listen änderst du in `web/src/data/*.json`, nicht im Code der Seite.
- **Gross:** eine neue Seite, eine neue Funktion, ein neuer Bereich oder ein anderes Aussehen. Der Weg: Nachtrag im Plan, Entwurf der geänderten Seiten, Freigabe zum Bauen, bauen und prüfen, zeigen, Freigabe, Push (zuerst «Gross: Plan und Entwurf», dann die Schritte 4 bis 7). Braucht die Funktion ein Programm (Anmeldeliste, Login), ist das ein Baustein mit eigenem Server (Skill `bausteine`): Wohnt die Seite bei Light, heisst das Wechsel zu Pilot (Skill `lancieren`), bei «selbst» ein eigener Server (Skill `landung`).
- **Eigene Adresse** (`meinverein.ch` statt `{name}.aufwind.sh`): kein Umbau, sondern der Skill `domain`. Sie ist freiwillig und kostet separat pro Jahr.

Sag der Person in einem Satz, was es ist und wie es weitergeht.

### Gross: Plan und Entwurf

1. **Nachtrag im Plan:** ganz unten in `docs/plan.md`:
   ```markdown
   ## Nachtrag <Datum>: <der Wunsch in einem Satz>
   Seiten: … (neu oder geändert)
   Funktionen: … (mit Ablauf, Bestätigung, Fehler und leerem Zustand)
   Zugang: … (ändert sich, wer was darf? dann auch docs/tueren.txt)
   ```
2. **Entwurf der geänderten Seiten** in `design/entwurf/`, im bestehenden Designsystem, mit echten Texten (Skill `entwurf`). Die Person klickt sich durch, auf dem Handy und am Computer.
3. **Freigabe zum Bauen:** Erst nach ihrem Ja kommt in `docs/entwurf.md` unter einer Überschrift für den Nachtrag die Zeile `Freigegeben zum Bauen: <TT.MM.JJJJ>, «<ihre Worte>»`. Das Datum steht vorne, als Zahl; ohne Datum, mit `[Annahme: …]` oder mit «noch nicht» gilt sie nicht als Ja. Dann muss `node scripts/pruefen.mjs --vor-bau` mit 0 enden.
4. **Bauen** wie im Skill `webseite-bauen`, Schritt 4: Markup und Klassen aus dem Entwurf, Tokens nur aus `design/tokens.css`.

### 4. Der Wunsch ins PRD

Ganz unten in `docs/prd.md`, nach der Zeile `Freigegeben:` des ersten Baus, kommt der Wunsch als neue Abnahmekriterien dazu. So sieht man, dass die alte Freigabe nicht für den neuen Wunsch gilt:

```markdown
## Änderungen

### <Datum>: <der Wunsch in einem Satz>
- [ ] <prüfbar, z. B. «Auf /termine steht das Frühlingskonzert: Samstag, 24. April 2027, 19.30 Uhr, Kirche Testdorf»>
- [ ] Nur Werte aus dem Designsystem, die bisherigen Abnahmekriterien gelten weiter
```

Bei einem grossen Wunsch steht darüber `Abgeleitet aus: docs/entwurf.md (Nachtrag <TT.MM.JJJJ>, Freigegeben zum Bauen: <TT.MM.JJJJ>)`: Die Kriterien folgen aus dem Entwurf, den die Person freigegeben hat. Bei einem kleinen zeigst du sie in Schritt 5 zusammen mit dem Ergebnis.

Hat Albatros die Seite gebaut, heisst die Zeile des ersten Baus `Freigegeben: <TT.MM.JJJJ>, Abnahme mit der Zahlung von Auftrag #<Nummer>`: Die Zahlung war die Freigabe. Diese Zeile bleibt, wie sie ist.

### 5. Ändern, bauen, prüfen, vorher und nachher zeigen

```bash
node scripts/pruefen.mjs --live <Adresse> --nur aussehen --aus docs/pruefung/vorher     # Fotos vorher, Adresse aus docs/lancieren.md
# … die Änderung in web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                    # bauen und prüfen
```

Bei einem grossen Wunsch zusätzlich `node scripts/pruefen.mjs --vergleich` (die geänderten Seiten wie im Entwurf) und, wenn sich der Zugang ändert, `node scripts/pruefen.mjs --tueren`. Rot heisst: beheben und nochmals. In den Berichten unter `docs/pruefung/` ergänzt du unter «Geprüft» eine Zeile mit Datum und Wunsch und hakst die neuen Kriterien in `docs/prd.md` ab. Dann öffnest du die betroffene Seite vorher und nachher nebeneinander, am Handy und am Computer, und die Vorschau (`(cd web && npx astro preview --background)`, dann `open http://localhost:4321/<seite>/`):

```bash
open docs/pruefung/vorher/fotos/live-<seite>-390.png docs/pruefung/fotos/<seite>-390.png
open docs/pruefung/vorher/fotos/live-<seite>-1440.png docs/pruefung/fotos/<seite>-1440.png
```

Ist nichts mehr rot, kommt die Änderung ins Logbuch, nur mit den eigenen Dateien (Skill `git-logbuch`): `git add web docs seite && git commit -m "<der Wunsch in einem Satz>"`.

### 6. Freigabe

Frag: «Darf das so ins Netz?» Erst nach dem Ja trägst du unter dem Wunsch `Freigegeben: <TT.MM.JJJJ>, «<ihre Worte>»` ein, das Datum vorne als Zahl, und machst den Eintrag ins Logbuch mit dem Zeichen für den freigegebenen Stand:

```bash
git add docs/prd.md && git commit -m "Freigegeben: <der Wunsch in einem Satz>" && git tag -f freigegeben
```

Will die Person noch etwas anders, zurück zu Schritt 5.

### 7. Pushen und im Netz nachprüfen

Ins Netz geht nur der freigegebene Stand:

```bash
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
git push                                                                # Hafen von Albatros oder GitHub
```

Fehlt «Seite wie freigegeben», hat sich nach der Freigabe noch etwas geändert: zuerst zeigen und neu freigeben.

Wohnt die Seite selbst, ohne Repo, lädst du `seite/` wieder hoch wie beim Live schalten (Skill `lancieren`, Teil 2, «Selbst, ohne Repo»).

**Fertig heisst sichtbar.** Du schaust selbst nach, bis die Änderung im Netz steht, höchstens drei Minuten, mit einem Text aus der Änderung:

```bash
for i in $(seq 12); do curl -s <Adresse>/<seite> | grep -qF "<neuer Text>" && echo "Änderung ist da" && break; sleep 15; done
node scripts/pruefen.mjs --live <Adresse>
```

Dann öffnest du die Seite mit der Person (`open <Adresse>/<seite>`). Ist die Änderung nach drei Minuten nicht da, gehst du vor wie im Skill `lancieren`, Teil 2, Schritt 4 («Nach drei Minuten noch nicht da»).

## Stolpersteine

- Ohne `git pull` loslegen: Dann fehlt eine Änderung von anderswo, und der Push wird abgelehnt.
- Eine neue Farbe «nur hier»: Das bricht das Designsystem. Neue Werte kommen nur mit Ja und zuerst in `tokens.css` und `designsystem.md`.
- Eine neue Seite ohne Entwurf und ohne Freigabe zum Bauen: Dann sieht die Person sie zum ersten Mal, wenn sie schon gebaut ist.
- In `seite/` ändern statt in `web/`: Beim nächsten Bau ist die Änderung weg.
- Ein Termin direkt in den Code statt in `web/src/data/`: Beim nächsten Mal sucht man ihn.
- Pushen ohne Freigabe, oder «ist online», ohne selbst nachgeschaut zu haben.

## Schlussnachricht

Deine letzte Nachricht beginnt mit einem Satz zum Bild «Umbau im bewohnten Haus». Danach: was geändert ist, wo man es sieht (mit Adresse), was geprüft wurde und ob noch etwas offen ist.
