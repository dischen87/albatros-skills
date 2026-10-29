---
name: webseite-aendern
description: 'Ändert mit einer Person ohne Vorwissen ihre fertige Webseite aus dem Hafen von Albatros, selbst gebaut oder von Albatros gebaut, mit ihrer eigenen KI: Hafen holen, zuerst docs/ lesen (Designsystem, Tech-Stack und PRD sind die Regeln), die Änderung im bestehenden Designsystem machen, als Abnahmekriterien ins PRD, bauen, mit pruefen.mjs prüfen, vorher und nachher zeigen, Freigabe, pushen und im Netz nachprüfen. Kleine Wünsche (Text, Termin, Bild) gehen schnell, grössere (neue Seite, neue Funktion) über PRD und Prüfung. Nutze den Skill bei «ändere meine Seite», «neuer Termin», «Text ändern», «Bild austauschen», «es fehlt …», «mach die Seite …», «auf der Seite steht etwas Falsches», und immer, wenn an einer Seite unter name.aufwind.sh etwas anders werden soll.'
---

# Webseite ändern: Umbau im bewohnten Haus

## Das Bild

Ein Umbau im bewohnten Haus: Im Ordner liegen die Pläne und die Materialliste (`docs/`). Ein Bild aufhängen geht schnell. Eine neue Wand braucht einen Plan und eine Abnahme. Und man baut mit denselben Materialien weiter, sonst sieht es nach Flickwerk aus.

**So setzt du das Bild ein:** Ein Satz dazu in deiner ersten Antwort, zusammen mit der Einschätzung, ob es ein kleiner oder ein grösserer Wunsch ist.

## So sprichst du

- Du-Form, Alltagssprache, kurze Sätze. Was du tust, sagst du vorher in einem Satz.
- Die Regeln stehen in `docs/`: Designsystem, Tech-Stack und PRD. Neue Farben, Schriften, Abstände oder ein anderes Framework gibt es nur nach einem ausdrücklichen Ja der Person, und dann zuerst im Designsystem.
- Ins Netz geht nichts ohne Freigabe. Mit Light ist der Push schon die Veröffentlichung.
- Was die Person sehen soll (Vorher und Nachher, Vorschau, fertige Seite), öffnest du selbst: `open <adresse oder datei>` (Linux `xdg-open`, Windows `start`).
- Die Änderung mit der eigenen KI kostet nichts extra, nur das Abo der KI beim Anbieter. Will die Person den Wunsch lieber nicht selbst umsetzen, sag ihr: «Wenn du das nicht selbst machen willst, kann Albatros es für CHF 29 umsetzen. Das kommt bald ins Cockpit.»

## Ablauf

### 1. Den Hafen holen

Den Namen der Seite nennt `konto_status`. Liegt das Logbuch noch nicht auf diesem Computer, holst du es (Skill `git-logbuch`), sonst holst du den neuesten Stand:

```bash
git clone git@aufwind.sh:{name}/projekt.git {name}     # beim ersten Mal
cd {name} && git pull --rebase                          # jedes weitere Mal
(cd web && npm ci)                                      # Bauwerkzeuge, liegen nicht im Hafen
```

Scheitert `git` mit «Permission denied», fehlt auf diesem Computer der Schlüssel (Skill `ssh-schluessel`).

### 2. Zuerst die Pläne lesen

Bevor du etwas änderst, liest du:

- `docs/designsystem.md` und `web/src/styles/tokens.css`: Farben, Schriften, Abstände, Radien und Komponenten.
- `docs/stack.md`: womit die Seite gebaut ist (meist Astro, höchstens 50 KB JavaScript je Seite).
- `docs/prd.md`: was die Seite können muss, mit den Abnahmekriterien.
- `docs/plan.md` oder `docs/bestand.md`: für wen die Seite ist.
- `web/src/data/*.json`: Listen wie Termine, Preise oder Sponsoren.

Fehlt `designsystem.md` oder `stack.md` (ältere Seite), schreibst du sie zuerst kurz aus dem, was da ist (`tokens.css`, `web/package.json`), und sagst das der Person.

### 3. Klein oder gross?

- **Klein:** Text, Termin, Preis, Öffnungszeit, Link oder ein Bild austauschen, auf einer bestehenden Seite. Das geht schnell, ohne Mockup und Entwürfe. Termine und Listen änderst du in `web/src/data/*.json`, nicht im Code der Seite.
- **Gross:** eine neue Seite, eine neue Funktion, ein neuer Bereich oder ein anderes Aussehen. Dafür schreibst du zuerst die Abnahmekriterien (Schritt 4) und wartest auf das Ja. Eine neue Seite bekommt vorher ein Mockup in Graustufen (Skill `webseite-bauen`, Schritt 2). Braucht die Funktion ein Programm (Anmeldeliste, Login), ist das ein Baustein mit Pilot (Skill `bausteine`).

Sag der Person in einem Satz, was es ist und wie es weitergeht.

### 4. Den Wunsch ins PRD

Ganz unten in `docs/prd.md`, nach den Zeilen `Abgenommen:` und `Freigegeben:` des ersten Baus, kommt der Wunsch als neue Abnahmekriterien dazu. So sieht man, dass die alte Freigabe nicht für den neuen Wunsch gilt:

```markdown
## Änderungen

### <Datum>: <der Wunsch in einem Satz>
- [ ] <prüfbar, z. B. «Auf /termine steht das Frühlingskonzert: Samstag, 24. April 2027, 19.30 Uhr, Kirche Testdorf»>
- [ ] Nur Werte aus dem Designsystem, die bisherigen Abnahmekriterien gelten weiter
```

Bei einem grossen Wunsch zeigst du die Kriterien zuerst der Person und trägst nach ihrem Ja darunter `Abgenommen: <Datum> von <Name>` ein. Bei einem kleinen reicht es, sie in Schritt 5 zusammen mit dem Ergebnis zu zeigen.

### 5. Bauen, prüfen, vorher und nachher zeigen

```bash
node scripts/pruefen.mjs --live https://{name}.aufwind.sh --nur aussehen --aus docs/pruefung/vorher   # Fotos vorher
# … die Änderung in web/ …
(cd web && npm run build) && node scripts/pruefen.mjs                                                # bauen und prüfen
```

Fehlt `scripts/pruefen.mjs`, holst du es wie im Skill `webseite-bauen`, Schritt 7. Rot heisst: beheben und nochmals. In den Berichten unter `docs/pruefung/` ergänzt du unter «Geprüft» eine Zeile mit Datum und Wunsch und hakst die neuen Kriterien in `docs/prd.md` ab. Dann öffnest du die betroffene Seite vorher und nachher nebeneinander, am Handy und am Desktop:

```bash
open docs/pruefung/vorher/fotos/live-<seite>-390.png docs/pruefung/fotos/<seite>-390.png
open docs/pruefung/vorher/fotos/live-<seite>-1440.png docs/pruefung/fotos/<seite>-1440.png
```

### 6. Freigabe

Frag: «Darf das so ins Netz?» Erst nach dem Ja trägst du unter dem Wunsch `Freigegeben: <Datum> von <Name>` ein. Will die Person noch etwas anders, zurück zu Schritt 5.

### 7. Pushen und im Netz nachprüfen

Nur die eigenen Änderungen, einzeln aufnehmen (Skill `git-logbuch`):

```bash
git add web docs seite scripts && git commit -m "<der Wunsch in einem Satz>" && git push
```

**Fertig heisst sichtbar.** Du schaust selbst nach, bis die Änderung im Netz steht, höchstens drei Minuten, mit einem Text aus der Änderung:

```bash
for i in $(seq 12); do curl -s https://{name}.aufwind.sh/<seite> | grep -qF "<neuer Text>" && echo "Änderung ist da" && break; sleep 15; done
node scripts/pruefen.mjs --live https://{name}.aufwind.sh
```

Dann öffnest du die Seite mit der Person (`open https://{name}.aufwind.sh/<seite>`). Ist die Änderung nach drei Minuten nicht da, gehst du vor wie im Skill `webseite-bauen`, Schritt 9 («Nach drei Minuten noch nicht da»).

## Stolpersteine

- Ohne `git pull` loslegen: Dann fehlt eine Änderung von anderswo, und der Push wird abgelehnt.
- Eine neue Farbe «nur hier»: Das bricht das Designsystem. Neue Werte kommen nur mit Ja und zuerst in `tokens.css` und `designsystem.md`.
- In `seite/` ändern statt in `web/`: Beim nächsten Bau ist die Änderung weg.
- Ein Termin direkt in den Code statt in `web/src/data/`: Beim nächsten Mal sucht man ihn.
- Pushen ohne Freigabe, oder «ist online», ohne selbst nachgeschaut zu haben.

## Schlussnachricht

Deine letzte Nachricht beginnt mit einem Satz zum Bild «Umbau im bewohnten Haus». Danach: was geändert ist, wo man es sieht (mit Adresse), was geprüft wurde und ob noch etwas offen ist.
