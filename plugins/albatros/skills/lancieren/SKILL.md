---
name: lancieren
description: 'Bringt die freigegebene Seite einer Person ohne Vorwissen ins Netz, in zwei Teilen. Wohnort (P11): immer dieselbe Frage, Albatros (Light ohne Baustein, Pilot mit Baustein) oder selbst, Preise nur aus konto_status, upgrade_link mit bestaetigt erst nach der Wahl, SSH-Schlüssel, seite_erstellen oder server_erstellen, bei selbst GitHub Pages, Cloudflare Pages, Netlify oder eigener Server. Live schalten (P13): nur mit «Freigegeben:» die freigegebene Seite in den Hafen oder zum Anbieter, mit Baustein und Login der Eingang davor, Prüfung von aussen (pruefen.mjs --live und --tueren), Domain freiwillig, go-live-check beim Weg Geschäft, Ankündigung. Ergebnis: docs/lancieren.md, docs/live.md. Nutze den Skill nach der Freigabe und bei «online stellen», «veröffentlichen», «live schalten», «wo soll meine Seite wohnen», «Abo wählen», «selber hosten».'
metadata:
  stand: 0.2.0
---

# Lancieren: Wohnort und Eröffnung

## Das Bild

Das Haus ist gebaut, abgenommen und freigegeben. Jetzt kommen zwei Dinge, in dieser Reihenfolge. Zuerst entscheidest du, wo es steht, und holst den Schlüssel dafür: der **Wohnort**. Auf dem Grundstück steht danach erst ein Musterhaus (die Vorlage). Wenn Briefkasten und Rauchmelder hängen (Skill `betrieb`), kommt die **Eröffnung** mit Band vor der Tür: Genau das freigegebene Haus zieht ein, jemand prüft von der Strasse aus, ob alles stimmt, und die ersten Gäste erfahren davon.

**So setzt du das Bild ein:** In deiner ersten Antwort ein Satz zum Bild, dazu, welcher der beiden Teile jetzt dran ist.

## So sprichst du

- Preise nennst du nur aus `konto_status` (Albatros) oder von der Preisseite eines Anbieters, die du gerade gelesen hast, nie aus dem Gedächtnis. Hast du sie nicht gelesen, sagst du «steht auf der Preisseite».
- Karten, Passwörter und private Schlüssel gehören nie in den Chat. Bezahlt wird auf der Zahlungsseite, Konten bei Anbietern legt die Person selbst an, im Browser.
- Kein Druck: «Selbst» ist eine gute Wahl, wenn es passt. Du empfiehlst den kleinsten Wohnort, der reicht, mit einem Satz Grund aus dem Plan.
- Ins Netz geht nur die Seite, die die Person freigegeben hat (`Freigegeben:` in `docs/prd.md`), und erst im zweiten Teil.
- Höchstens zwei Fragen in einer Nachricht. Was die Person sehen soll (Zahlungsseite, Hafen, Seite im Netz), öffnest du selbst: `open <adresse>` (Linux `xdg-open`, Windows `start`).
- Im Modus `lernen` (Zeile `Modus:` in `docs/projekt.md`) macht die Person den SSH-Schlüssel und den ersten Push selbst; im Modus `machen` machst du es und erklärst es in einem Satz.

## Teil 1: Der Wohnort (Phase P11, `schritt: wohnort`)

### 1. Ist die Seite freigegeben?

```bash
# die letzte Zeile «Freigegeben:» zählt: vorne ein Datum mit Jahr, nirgends eine [Annahme]
grep -E '^[[:space:]>*-]*Freigegeben:' docs/prd.md | tail -n 1 | tr -d '*' \
  | grep -E '^[[:space:]>-]*Freigegeben:[[:space:]]*[0-9]{1,4}([./-]| .*[^[:space:]])' \
  | grep -E '(^|[^A-Za-z0-9_])(19|20)[0-9]{2}([^A-Za-z0-9_]|$)' \
  | grep -v -i -E '\[(annahme|hypoth(e|è|È)se|ipotesi|assumption)([^[:alnum:]]|$)'
# Windows: findstr /r /b /c:"Freigegeben: [0-9]" docs\prd.md | findstr /r /c:"19[0-9][0-9]" /c:"20[0-9][0-9]" | findstr /v /i /l /c:"[annahme" /c:"[hypoth" /c:"[ipotesi" /c:"[assumption"
```

Zeigt das keine Zeile, ist die Seite noch nicht freigegeben: Die Zeile fehlt, oder in der letzten Zeile `Freigegeben:` steht vorne kein Datum mit Jahr (zum Beispiel «noch nicht» oder «1 Seite fehlt noch»), oder darin steht eine `[Annahme: …]`. Unter Windows zeigt `findstr` jede passende Zeile; sie zählt nur, wenn sie die letzte Zeile `Freigegeben:` in `docs/prd.md` ist. Dann sagst du ehrlich: Zuerst kommt die Begehung mit Freigabe (Skill `webseite-bauen`, Schritt 6). Will die Person den Wohnort trotzdem schon wählen, geht das; einziehen wird die Seite erst nach der Freigabe. `docs/lancieren.md` schreibst du und `wohnort` meldest du aber erst nach der Freigabe: Sonst zählt der Fahrplan den Wohnort, und die Frage nach der Freigabe fällt weg.

### 2. Die Frage, immer dieselbe

Bevor du fragst, holst du die Grundlagen: `konto_status` (Abo und Preise von Light und Pilot), in `docs/plan.md` die Zeile `Setup:` und in `docs/stack.md` die Zeile `Baustein:`. Dann zeigst du die drei Wohnorte in einer kleinen Tabelle, mit den Preisen aus `konto_status`:

| Wohnort | passt, wenn | kostet | du machst selbst |
|---|---|---|---|
| Albatros Light | die Seite keinen Baustein braucht (Texte, Bilder, Kontakt per Mail) | CHF … pro Monat | nichts: Was du in den Hafen schickst, ist kurz danach online |
| Albatros Pilot | ein Baustein läuft (Anmeldung, Buchung, Login) oder du einen eigenen Server willst | CHF … pro Monat | wenig: Fliessband und tägliche Fotos des Servers sind da |
| selbst | du alles selbst in der Hand haben willst und Zeit für die Pflege hast | beim Anbieter | Konto, Einrichten, Sicherung und Überwachung |

Dazu ein Satz Empfehlung mit Grund aus `docs/plan.md` (`Setup:`).

**Mit Login:** Hat das Projekt einen Baustein mit Login (Rezept `mitglieder`; zu sehen an `Zugang:` in `docs/plan.md` und `Baustein:` in `docs/stack.md`), empfiehlst du Pilot oder selbst mit eigenem Server, nie Light, und nennst gleich den Schritt **Eingang**: Ob vor der Seite ein Eingang mit einem Login für alle Teile steht, klärt ihr im Betrieb (Skill `betrieb`, Zeile `Eingang:`, nach den Kriterien im Skill `bausteine`, Abschnitt «Ein Eingang für alles?»). Eingebaut wird er beim Live schalten (`bausteine/eingang`); danach ist die Webseite nur noch hinter dem Eingang erreichbar.

Dann die Frage, allein in der Nachricht:

> Wo soll deine Seite wohnen: bei Albatros (Light ohne Baustein, Pilot mit eigenem Server) oder selbst?

Bis hierher war bei Albatros alles gratis. Fragt die Person, warum es jetzt etwas kostet, sagst du: Ein Platz im Netz braucht einen Rechner, der rund um die Uhr läuft.

### 3a. Bei Albatros: Light oder Pilot

1. **Abo erst nach der Wahl:** Hat die Person Light oder Pilot gewählt, holst du mit `upgrade_link` den Link, mit `stufe` (`light` oder `pilot`) und `bestaetigt: true`. Vorher rufst du das Werkzeug nie auf. Gib ihr den Link und öffne ihn: Die Karte tippt sie nur dort ein. Läuft schon ein Abo, kommt der Link zum Kundenportal (zum Beispiel für den Wechsel von Light zu Pilot). Danach `konto_status`, bis das Abo aktiv ist.
2. **Hausschlüssel und Schloss:** Folge dem Skill `ssh-schluessel`. Mit Light öffnet das Schloss den Hafen für das Logbuch, mit Pilot auch die Tür zum Server. Lernmoment: Was ein SSH-Schlüssel ist, mit dem Bild von Schloss und Schlüssel. Im Modus `lernen` erzeugt die Person den Schlüssel selbst, danach meldest du `verstanden_melden` (Mission `flugschule-16-wohnort`, Art `selbst`).
3. **Der Name der Adresse:** Er wird Teil von `https://<name>.aufwind.sh` (3 bis 32 Zeichen: Kleinbuchstaben, Ziffern, Bindestrich). Schlag ihn aus dem Projektnamen vor (`docs/projekt.md`, in `docs/konzept.md` die Zeile `Name:`) und frag, ob er passt.
4. **Seite oder Server:** Mit Light `seite_erstellen`, mit Pilot `server_erstellen`, je mit `name`, dem Schloss (`schluessel`, nur der Inhalt der `.pub`-Datei) und `sprache` (die Sprache des Gesprächs). Ein Server braucht meist ein bis zwei Minuten: Frag mit `konto_status` nach, bis er bereit ist. Weicht der Name in der Antwort ab, sag es gleich.
5. **Nachschauen:** Öffne `https://<name>.aufwind.sh` mit der Person. Dort steht jetzt die Vorlage von Albatros, nicht ihre Seite. Sag das klar: Ihre freigegebene Seite zieht erst beim Live schalten ein.

### 3b. Selbst

Die Person bringt die Seite selbst ins Netz. Albatros bleibt für sie gratis (Insel, Skills), nur die Werkzeuge für Server, Hafen und Domain gehören zu einem Abo. Wie es geht, hängt vom Baustein ab:

- **Ohne Baustein (eine statische Seite):** Jeder Anbieter für statische Seiten liefert den Ordner `seite/` aus. Drei verbreitete Wege, je mit einem Konto beim Anbieter, das die Person selbst anlegt:
  - **GitHub Pages:** Das Logbuch kommt zu GitHub, ein kleines Fliessband dort liefert `seite/` aus. Gratis ist es mit einem öffentlichen Repo: Dann sieht jede und jeder auch `docs/` mit Plan und Konzept. Für ein privates Repo braucht es ein bezahltes Konto bei GitHub (Preisseite). Ohne eigene Domain liegt die Seite unter `https://<benutzer>.github.io/<repo>/`, also in einem Unterordner: Dann braucht `web/astro.config.mjs` `site: 'https://<benutzer>.github.io'` und `base: '/<repo>'`, sonst zeigen die Links ins Leere. Ohne Unterordner geht es mit dem Repo `<benutzer>.github.io` oder mit einer eigenen Domain.
  - **Cloudflare Pages** oder **Netlify:** Das Logbuch kann privat bleiben. Entweder holen sie es von GitHub (Ausgabeordner `seite`, kein Bauschritt nötig, weil `seite/` schon gebaut im Logbuch liegt), oder du lädst `seite/` direkt vom Computer hoch, ganz ohne Repo. Die Adresse ist dann `https://<name>.pages.dev` oder `https://<name>.netlify.app`.
  - Bedingungen und Grenzen der Gratis-Angebote ändern sich: Lies die Preisseite des Anbieters mit der Person, bevor sie sich entscheidet.
- **Mit Baustein:** Ein Baustein braucht einen Server, der rund um die Uhr läuft. Dann mietet die Person einen eigenen Server und richtet ihn mit der Vorlage von Albatros ein (`Dockerfile`, `compose.yaml` und `nginx.conf` aus dem Ordner `vorlage/` von albatros-skills, dazu Caddy für HTTPS). Das ist der Umzug ins eigene Haus: Skill `landung`.

Hilf bei der Wahl mit drei Fragen: Darf das Logbuch öffentlich sein? Braucht die Seite einen Baustein? Wer kümmert sich um Sicherung und Überwachung (Skill `betrieb`)? Den ganzen Weg ohne Albatros beschreibt der Skill `landung`, Abschnitt «Direkt vom Computer ins Netz». In diesem Teil legt die Person nur das Konto an und meldet sich an; hochgeladen wird erst beim Live schalten.

### 4. `docs/lancieren.md`

Erst wenn die Seite freigegeben ist (Schritt 1):

```markdown
# Lancieren

Wohnort: Albatros Light (oder Albatros Pilot, oder selbst: Netlify)
Grund: … (ein Satz, aus docs/plan.md, Zeile Setup:, und dem Wunsch der Person)
Adresse: https://<name>.aufwind.sh
Hafen: git@aufwind.sh:<name>/projekt.git (bei selbst: das Repo bei GitHub, oder «kein Repo, Hochladen vom Computer»)
Gewählt: <Datum>
```

Steht die Adresse bei «selbst» erst nach dem ersten Hochladen fest, steht dort `[offen: kommt beim Live schalten]`. Dann der Eintrag ins Logbuch (`git add docs/lancieren.md && git commit -m "Wohnort: <Wohnort>"`) und `schritt_melden` mit `wohnort` und `sprache`. Fehlt das Werkzeug oder kennt es den Schritt nicht, geht es ohne Insel weiter.

Weiter geht es mit dem Skill `betrieb`: Briefkasten, Rauchmelder und Haustür, bevor die Gäste kommen.

## Teil 2: Live schalten (Phase P13, `schritt: hafen`, `fliessband`, `live`, `domain`)

Erst wenn `docs/betrieb.md` alle Zeilen hat (Skill `betrieb`). Fehlt sie, gehst du zuerst dorthin.

### 1. Nur die freigegebene Seite

```bash
# die Freigabe aus der Begehung, wie in Teil 1, Schritt 1 (dort auch der Befehl für Windows)
grep -E '^[[:space:]>*-]*Freigegeben:' docs/prd.md | tail -n 1 | tr -d '*' \
  | grep -E '^[[:space:]>-]*Freigegeben:[[:space:]]*[0-9]{1,4}([./-]| .*[^[:space:]])' \
  | grep -E '(^|[^A-Za-z0-9_])(19|20)[0-9]{2}([^A-Za-z0-9_]|$)' \
  | grep -v -i -E '\[(annahme|hypoth(e|è|È)se|ipotesi|assumption)([^[:alnum:]]|$)'
git status --short seite web design                       # leer: nichts Ungespeichertes an der Seite
git diff --quiet freigegeben HEAD -- seite web design && echo "Seite wie freigegeben"
```

- **Keine Zeile `Freigegeben:` mit Datum vorne:** Es geht nichts ins Netz. Zurück zum Skill `webseite-bauen`, Schritt 6.
- **Seit der Freigabe geändert** (keine Ausgabe «Seite wie freigegeben»): Die Person schaut sich die geänderte Seite lokal an und gibt sie neu frei (neue Zeile `Freigegeben:`, `git tag -f freigegeben`). Erst dann weiter.
- **Kein Tag `freigegeben`** (ältere Projekte): Zeig der Person die Seite lokal und frag: «Ist das genau die Seite, die du freigegeben hast?» Nach dem Ja setzt du den Tag (`git tag freigegeben`).

### 2. In den Hafen oder zum Anbieter (`schritt: hafen`)

#### Bei Albatros

Im Hafen liegt seit dem Wohnort die Vorlage, ein Eintrag. Das Logbuch auf dem Computer hat einen eigenen Anfang. Du verbindest die beiden, ohne neu zu klonen und ohne Dateien zu kopieren (Skill `git-logbuch`, Abschnitt «Logbuch ohne Hafen»):

```bash
git remote -v                                                    # gibt es schon ein origin? dann statt origin den Namen hafen
git remote add origin git@aufwind.sh:<name>/projekt.git          # Adresse aus docs/lancieren.md oder konto_status
git fetch origin
git merge origin/main --allow-unrelated-histories -X ours -m "Vorlage aus dem Hafen übernommen, die freigegebene Seite bleibt"
git diff --quiet freigegeben HEAD -- seite && echo "Seite unverändert"
```

Sag es der Person mit dem Bild: Die Vorlage wird einmal ins Logbuch aufgenommen. Wo beide dieselbe Datei haben (`seite/index.html`, `.gitignore`), bleibt ihre. Dazu kommen die Dateien, die das Fliessband von Pilot braucht (`Dockerfile`, `compose.yaml`, `nginx.conf`, `.github/workflows/deploy.yml`); mit Light schlafen sie. Steht nach dem Zusammenführen nicht «Seite unverändert», pushst du nicht und schaust mit `git diff freigegeben HEAD -- seite` nach.

**Mit Baustein (Pilot), vor dem Push:** Jetzt liegt die `compose.yaml` der Vorlage im Logbuch, und du hängst die Bausteine ein wie im Skill `bausteine`, Abschnitt 4 «Beim Lancieren, mit Pilot»: zuerst ein Foto des Servers (Werkzeug `snapshot`, Name `vor-baustein`), dann `include:` in `compose.yaml`. Steht in `docs/betrieb.md` `Eingang: ja` (`grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` zeigt die Zeile), kommt der Schritt **Eingang** dazu: die Zeile `- bausteine/eingang/compose.yaml` unter `include:`, und beim Dienst `webseite` fallen `ports:` und `- "80:80"` weg. Port 80 hat dann der Eingang, die Webseite ist nur noch hinter ihm erreichbar. Vorher muss `bun bausteine/eingang/test.ts` «Alles grün» melden. Ohne Login, oder mit `Eingang: nicht nötig`, bleibt `compose.yaml` wie in der Vorlage. Danach ein Eintrag ins Logbuch.

```bash
git push -u origin main
```

Dann öffnest du den Hafen im Browser (`open https://code.aufwind.sh/<name>/projekt`) und meldest `hafen`.

#### Selbst, mit GitHub

Die Person meldet sich mit `gh auth login` im Browser an. Für GitHub Pages legst du vorher das Fliessband an, `.github/workflows/seite.yml`:

```yaml
name: Seite
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false            # eine laufende Auslieferung nie abbrechen
jobs:
  ausliefern:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.pages.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: seite                  # der gebaute Ordner, so wie er freigegeben ist
      - id: pages
        uses: actions/deploy-pages@v4
```

Dann das Logbuch mitnehmen: `gh repo create <repo> --private --source . --remote origin --push` (für GitHub Pages ohne bezahltes Konto `--public`, nachdem die Person weiss, dass dann auch `docs/` öffentlich ist). Bei GitHub Pages stellt die Person unter Settings, Pages die Quelle auf «GitHub Actions». Dann meldest du `hafen`.

#### Selbst, ohne Repo

Du lädst `seite/` direkt hoch, nachdem sich die Person im Browser angemeldet hat: `npx netlify-cli deploy --dir=seite --prod` oder `npx wrangler pages deploy seite --project-name=<name>`. Das Logbuch bleibt auf dem Computer; seine Sicherung steht in `docs/betrieb.md`. Einen Hafen gibt es dann nicht, `hafen` meldest du nicht.

### 3. Fliessband (`schritt: fliessband`)

- **Light:** Es gibt keins: Etwa eine Minute nach dem Push zeigt Albatros den Ordner `seite/`.
- **Pilot:** Der Push startet das Fliessband aus `.github/workflows/deploy.yml`. Öffne `https://code.aufwind.sh/<name>/projekt/actions` und schau mit der Person zu. Grün: `fliessband` melden. Rot: Skill `pipeline`, Abschnitt «Wenn das Band rot ist».
- **Selbst:** Bei GitHub Pages unter «Actions», bei Netlify und Cloudflare in deren Liste der Auslieferungen. Grün: `fliessband` melden. Beim Hochladen ohne Repo gibt es kein Fliessband.

### 4. Von aussen prüfen (`schritt: live`)

**Du schaust selbst nach, die Person wartet nie.** Die Adresse antwortet schon vorher (mit der Vorlage). Darum wartest du auf den Titel der Seite, wie er in `seite/index.html` zwischen `<title>` und `</title>` steht, höchstens drei Minuten:

```bash
for i in $(seq 12); do curl -s <Adresse> | grep -qF "<Titel deiner Seite>" && echo "Seite ist da" && break; sleep 15; done
node scripts/pruefen.mjs --live <Adresse>
node scripts/pruefen.mjs --tueren <Adresse>
```

Die Adresse steht in `docs/lancieren.md` (`Adresse:`). Live ist erst, was von aussen geprüft ist: Ist bei `--live` (Titel wie gebaut, Impressum und Datenschutz erreichbar, Zugang, Lighthouse) und bei `--tueren` nichts rot, meldest du `live`, öffnest die Adresse mit der Person und vergleichst mit den Fotos aus der Prüfung.

- **Mit Eingang:** In `docs/tueren.txt` stehen die geschützten Pfade mit 401 (ohne Anmeldung, zum Beispiel `/intern/ 401`), dazu `/_/ 404` und `/api/collections/_SUPERUSERS/auth-methods 404`: Die Anmeldung der Verwaltung bleibt von aussen zu. Listen von PocketBase mit einer Regel (zum Beispiel `/api/collections/users/records`) geben Gästen 200 mit einer leeren Liste, nicht 401 oder 403; alle Türen je Rezept stehen im Skill `bausteine`, Abschnitt «Türen der Bausteine». Stammt die Datei noch vom Bau ohne Eingang, passt du sie vor der Prüfung an. Erst wenn `--tueren` genau das zeigt und die Startseite 200 gibt, steht die Seite wirklich hinter dem Eingang.
- **Mit einem Baustein ist «live» noch nicht «fertig»:** Erst wenn die Daten drin sind (zum Beispiel die Kurse) und eine Testbuchung im Netz ihre Mail an die eigene Adresse gebracht hat (Skill `bausteine`), sagst du der Person, dass sie den Link teilen kann. Bis dahin sagst du ehrlich, was noch fehlt.

#### Nach drei Minuten noch nicht da

Mit Light zeigt `konto_status`, ob der neueste Stand online ist oder was fehlt. Oft fehlt `seite/index.html` im Hafen, weil `seite/` in einer `.gitignore` steht. Mit Pilot schaust du unter «Actions» nach (Skill `pipeline`), bei «selbst» in der Liste der Auslieferungen des Anbieters. Beheben, neuer Eintrag, pushen, nochmals prüfen. Ändert die Behebung die Seite selbst, zeigst du sie der Person zuerst und holst die Freigabe neu. Geht es dann immer noch nicht, sagst du, was du geprüft hast, und fragst den Coach (`coach_fragen`).

### 5. Eine eigene Adresse, freiwillig (`schritt: domain`)

Frag: «Eigene Adresse (Domain) jetzt, später oder nie?» Sag dazu: Sie kostet jedes Jahr und ist freiwillig. Ihre Antwort kommt gleich in `docs/live.md` (Vorlage in Schritt 8), in die Zeile `Eigene Domain:`: zuerst `jetzt`, `später` oder `nie`, danach auf Wunsch ein Satz, zum Beispiel `Eigene Domain: später, wenn der Vorstand den Namen beschlossen hat`. Jetzt: Bei Albatros folgst du dem Skill `domain`, bei «selbst» verbindest du sie beim Anbieter (Skill `landung`, Abschnitt «Direkt vom Computer ins Netz»). Zeigt `https://<domain>` die Seite mit dem Schloss-Symbol, meldest du `domain` und prüfst nochmals mit `pruefen.mjs --live https://<domain>`.

**Mit Login** (ein Baustein mit Anmeldung, zum Beispiel ein Mitgliederbereich): Nach der Domain meldet sich die Person einmal über `https://<domain>` an, auf der Seite zum Anmelden. Mit Eingang braucht es dafür keinen Eintrag in `eingang.json`: Er nimmt Anmeldungen und Formulare von der Adresse an, über die die Seite aufgerufen wird. Klappt das, nimmt die Seite Anmeldungen und Formulare auch über die neue Adresse an. Kommt «E-Mail oder Passwort stimmt nicht», obwohl beides stimmt, oder geht ein Formular über die Domain nicht: Bei Albatros fragst du den Coach (`coach_fragen`) und sagst, was du geprüft hast; bis dahin meldet sich die Person über `https://<name>.aufwind.sh` an. Bei «selbst» gibt es keine Adresse auf aufwind.sh und ohne Abo keinen Coach: Dann schreibt die Person eine Mail an hallo@albatros.build, mit dem, was du geprüft hast (was hineingehört und was nie, steht im Skill `lotse`, Abschnitt «Lücken melden»); bis dahin meldet sie sich über die Adresse an, die vor der Domain galt.

**Ersetzt die Seite eine bestehende** (`docs/bestand.md`, Skill `webseite-modernisieren`): Die alte Domain zeigt danach auf die neue Seite. Jede alte Adresse aus `docs/bestand.md`, die es nicht mehr gibt, bekommt eine Umleitung auf die passende neue Stelle (in Astro unter `redirects` in `web/astro.config.mjs`). Die Einträge für E-Mail (MX) fasst du nie an.

### 6. Weg Geschäft: Vorflugkontrolle

Auf dem Weg Geschäft holst du mit `methode` die Methode `go-live-check` und folgst ihr: Sie liest die Adresse aus `docs/lancieren.md` und schreibt ihr Ergebnis in `docs/live.md` unter `Geprüft:`. Die Methode gibt es mit Light und Pilot. Wohnt die Seite «selbst», gibt `methode` sie ohne Abo nicht heraus, und die Prüfung über den Server von Albatros geht nicht: Sag das ehrlich und geh mit der Person die Prüfung aus Schritt 4 durch, dazu Formular, Mails und Kasse selbst ausprobiert.

### 7. Wem sagst du es zuerst?

Frag: «Wem sagst du es zuerst?» Der erste Fan kommt nicht von selbst. Hilf mit einem kurzen Text, den die Person selbst verschickt (zum Beispiel an drei Menschen, die sich dafür interessieren). Du verschickst nichts.

### 8. `docs/live.md`

```markdown
# Live

Live seit: <Datum>
Adresse: https://… (die Adresse im Netz; mit eigener Domain diese, sobald sie aktiv ist)
Eigene Domain: <jetzt | später | nie>, <ein Satz, wenn die Person einen sagt>
Geprüft: <Datum>, pruefen.mjs --live ohne Rot, Türen wie erwartet (docs/pruefung/messwerte-live.json)
Angekündigt: <Datum>, <wem>
```

Hinter `Eigene Domain:` steht zuerst `jetzt`, `später` oder `nie`, so wie die Person in Schritt 5 geantwortet hat; `Adresse:` ist immer die Adresse im Netz. Dann der Eintrag ins Logbuch, Push wie oben, und die Mission. Im Modus `lernen` stellst du jetzt die Kontrollfragen der Lektion `flugschule-18-live-schalten`: «Welche Seite geht beim Live schalten ins Netz?», «Wann ist deine Seite wirklich live?» und «Warum sagst du es jemandem zuerst?» Sie stehen hier, weil `lage` und `mission_holen` sie nach `live` nicht mehr zeigen. `verstanden_melden` (Art `kontrollfrage`) meldest du erst nach der Antwort der Person.

Wünscht die Person danach etwas anders, gilt der Skill `webseite-aendern`: klein (lokal ändern, zeigen, Freigabe, Push) oder gross (Nachtrag im Plan, Entwurf, Freigabe zum Bauen, bauen, zeigen, Freigabe, Push).

Veröffentlicht wird nur, was der Person gehört oder wofür sie die Erlaubnis hat (Skill `webseite-modernisieren`, Abschnitt «Rechte»).

## Stolpersteine

- `upgrade_link` vor der Wahl der Person, oder Preise aus dem Gedächtnis.
- Beim Wohnort schon die eigene Seite pushen: Mit Light ist jeder Push sofort online, und die Seite steht dann vor Briefkasten und Rauchmelder im Netz.
- `wohnort` melden oder `docs/lancieren.md` schreiben, bevor die Seite freigegeben ist: Dann springt der Fahrplan über die Freigabe.
- Das Logbuch aus dem Hafen klonen und die Seite hineinkopieren: Dann gehen die Einträge vom Bau verloren. Verbinden statt kopieren.
- `git push --force`, um den Hafen zu überschreiben: nie. Zusammenführen wie oben.
- Pushen, obwohl sich die Seite seit der Freigabe geändert hat.
- «Ist online» sagen, ohne selbst von aussen geprüft zu haben.
- Mit Eingang `ports:` beim Dienst `webseite` stehen lassen: Dann käme man am Eingang vorbei.
- Ein öffentliches Repo für GitHub Pages, ohne der Person zu sagen, dass dann auch `docs/` öffentlich ist.

## Mission prüfen

- Nach Teil 1: `mission_pruefen` mit `flugschule-16-wohnort` (Insel bei «Wohnort»). Bei Albatros auch `flugschule-01-start`: Die Prüfung schaut, ob `https://<name>.aufwind.sh` antwortet.
- Nach Teil 2: `mission_pruefen` mit `flugschule-18-live-schalten` (Insel bei «Live»), bei Albatros auch `flugschule-04-git-logbuch`, mit Pilot `flugschule-05-pipeline`.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Wohnort und Eröffnung», der den Kern noch einmal sagt. Danach: was geschafft ist (Wohnort gewählt oder Seite live), wo das Ergebnis liegt (`docs/lancieren.md`, `docs/live.md`, die Adresse), was noch offen ist und was als Nächstes kommt (nach dem Wohnort der Skill `betrieb`, nach dem Live schalten die ersten Gäste).
