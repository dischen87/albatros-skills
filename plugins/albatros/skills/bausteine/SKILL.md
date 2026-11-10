---
name: bausteine
description: 'Findet mit einer Person ohne Vorwissen heraus, was ihre Seite können soll, und baut die passenden fertigen Bausteine ein, zuerst auf ihrem Computer: Anmeldeliste, Buchungen für Kurse und Termine, Mitgliederbereich mit Login und Freigabe, Pinnwand (PocketBase), ein Eingang mit einem Login für mehrere Teile oder ein grosses CMS (Strapi mit Postgres), mit gemessenem Arbeitsspeicher. Erklärt mit dem Bild der Fertigteile beim Hausbau. Nutze den Skill bei «Anmeldung», «Anmeldeliste», «Buchung», «Buchungstool», «Kurse buchen», «Termin buchen», «Reservation», «Platz reservieren», «Formular speichern», «Login», «Mitgliederbereich», «Admin-Bereich», «Benutzer verwalten», «Rollen», «Eingang», «Datenbank», «Strapi», «CMS», «PocketBase», «Baustein», «was passt auf meinen Server», «reicht mein Server», und wenn eine Seite mehr können soll als Texte und Bilder zeigen.'
metadata:
  stand: 0.3.0
---

# Bausteine: Fertigteile für deine Seite

## Das Bild

Wer ein Haus baut, schreinert Fenster, Türen und Küche nicht selbst. Sie kommen fertig aus der Fabrik, mit Anleitung, und werden eingebaut. Bei einer Webseite ist es gleich: Login, Anmeldeliste oder ein System für Inhalte schreibt niemand neu. Albatros hat sie als fertige Bausteine bereit. Getestet ist, was einen Test hat (Buchungen, Mitglieder, Eingang); den Arbeitsspeicher haben wir bei allen gemessen.

Und wie beim Haus gilt: Jedes Teil braucht Platz. Darum schaust du zuerst, was die Person wirklich braucht. Eingebaut wird zuerst auf dem Computer der Person, wie ein Probeaufbau in der Werkstatt; auf den Server kommt es erst beim Lancieren.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst.

## So sprichst du

- **Nicht nur fragen:** Fehlt eine Angabe, gib trotzdem die konkreten Schritte mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurze Sätze. Statt «Authentifizierung» sagst du «anmelden mit E-Mail und Passwort», statt «Admin-Panel» «Verwaltung».
- Frag nie nach Passwörtern oder Schlüsseln. Das erste Konto der Verwaltung legt die Person selbst im Browser an. API-Schlüssel (zum Beispiel für Mails) tippt sie nur dort ein.

## 1. Was willst du bauen?

Eine Frage pro Nachricht, nur so viele, bis die Antwort klar ist:

1. Was soll die Seite tun? In einem Satz.
2. In welchen Sprachen?
3. Wer ändert die Inhalte: nur du mit deiner KI, oder auch andere ohne Terminal?
4. Sollen Besucher etwas eintragen, sich anmelden oder einloggen? Willst du eine Liste der Anmeldungen sehen?
5. Hängt etwas dahinter, zum Beispiel Bezahlen, Buchungen oder ein Newsletter?

## 2. Was daraus folgt

| Die Person sagt … | Das passt | Abo | Arbeitsspeicher im Betrieb |
|---|---|---|---|
| Nur ich pflege die Seite, kein Login, auch in mehreren Sprachen | Normale Seite aus der Vorlage, ohne Baustein. Je Sprache ein Ordner (`seite/fr/`). Listen wie Termine oder Produkte als Datei im Projekt (`seite/daten/termine.json`), die Seite liest sie: eine leichte Datenbank im Code. | Light | nichts extra |
| Bezahlen, Spenden | Zahlungslink eines Anbieters wie Stripe (Payment Link), auf der Seite als Knopf | Light | nichts extra |
| Newsletter | Ein Dienst wie Brevo, Formular des Dienstes auf der Seite | Light | nichts extra |
| Leute tragen sich ein, ich will die Liste sehen | **Anmeldeliste** (PocketBase, Rezept `anmeldeliste`) | Pilot | etwa 20 MB |
| Besucher buchen einen Platz oder Termin (Kurs, Führung, Termin beim Coiffeur), ich will die Buchungen sehen und absagen können | **Buchungen** (PocketBase, Rezept `buchungen`) | Pilot | etwa 20 MB |
| Mitglieder melden sich an und sehen einen eigenen Bereich; wer neu ist, fragt an, und ich schalte frei | **Mitgliederbereich mit Login** (PocketBase, Rezept `mitglieder`) | Pilot | etwa 20 MB |
| Andere pflegen News oder Termine im Browser | **Pinnwand** (PocketBase, Rezept `pinnwand`) | Pilot | etwa 20 MB |
| Mehrere Teile brauchen dasselbe Login, oder ein Bereich ist nur für eine Rolle (zum Beispiel den Vorstand) | **Eingang** (Baustein `eingang`, mit dem Rezept `mitglieder`), Abschnitt 7 | Pilot | 20 MB, unter Volllast bis 129 MB (Grenze im Container 128 MB) |
| Viele Inhaltstypen, mehrere Rollen, Bilderverwaltung, später eine App | **Grosses CMS** (Strapi mit Postgres) | Pilot | etwa 200 MB, Bau bis 2,5 GB |

Empfiehl immer das Kleinste, das reicht. Mehrere Sprachen allein sind nie ein Grund für einen Baustein. PocketBase deckt Anmeldeliste, Login und Pinnwand zusammen ab, es läuft nur einmal. Strapi lohnt sich erst, wenn PocketBase zu klein wird.

Auf dem eigenen Computer geht jeder Baustein gratis, auch ohne Abo. Online braucht er einen eigenen Server, also Pilot. Hat die Person Light, sag es ehrlich, sobald sie einen Baustein will: Den Wohnort wählt sie beim Lancieren (Skill `lancieren`, Preise mit `konto_status`, Skill `kosten`). Logbuch und Adresse bleiben.

## 3. Was passt auf den Server?

Ein Server mit Pilot hat 4 GB Arbeitsspeicher und 40 GB Platz, ohne Auslagerungsspeicher: Wird es zu viel, beendet der Server ein Programm. Gemessen am 28.10.2026 auf dem Server (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17), der Eingang am 31.10.2026 auf einem Mac:

| Was | Im Betrieb | Beim Bauen | Platz |
|---|---|---|---|
| Grundlast: System, Docker, Arbeiter am Fliessband | 150 MB, eingeplant 0,5 GB | kurz mehr | – |
| Webseite aus der Vorlage | 10 MB | kurz | klein |
| PocketBase (alle Rezepte zusammen) | 20 MB | kurz | 40 MB |
| Eingang | 20 MB, unter Volllast bis 129 MB, im Container begrenzt auf 128 MB | kurz | klein |
| Strapi mit Postgres | 150 MB + 55 MB | Spitze 2,5 GB, erster Bau etwa 7 Minuten | 1,4 GB |

Für Bausteine bleiben also etwa 3,5 GB. Webseite, PocketBase und Strapi zusammen brauchen im Betrieb etwa 250 MB. Eng wird es nur beim Bauen, darum baut das Fliessband einen Auftrag nach dem anderen. Nicht auf den Server gehören Programme, die allein mehr als 1 GB brauchen, zum Beispiel Keycloak, Supabase, Logto, Mattermost oder Texterkennung (OCR). Für ein eigenes Login nimm PocketBase.

Vor dem Lancieren: `free -h` auf dem Server zeigt, wie viel frei ist. Danach: `docker stats --no-stream` zeigt, was jeder Baustein braucht.

## 4. Einbauen: zuerst lokal, der Server beim Lancieren

### Lokal, auf dem Computer der Person

Beim Bauen (Skill `webseite-bauen`), gratis:

1. **Holen.** Im Logbuch auf dem Computer der Person (Skill `git-logbuch`) lädst du den Baustein aus der Fabrik, dem öffentlichen Repo von Albatros:
   ```bash
   curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
   ```
   Für den Eingang steht am Ende `bausteine/eingang`, für Strapi `bausteine/strapi`. Die Rezepte liegen danach unter `bausteine/<baustein>/rezepte/`.
2. **Rezept einsetzen** (Abschnitt 5, 6 oder 7), Texte der Seiten in die Sprache der Person bringen.
3. **Test:** Hat das Rezept einen Test, muss er «Alles grün» melden: `bun bausteine/pocketbase/rezepte/buchungen/test.ts`, `bun bausteine/pocketbase/rezepte/mitglieder/test.ts`, `bun bausteine/eingang/test.ts`. Eingebaut prüft er die eingebauten Dateien. Ohne grünen Test geht es nicht weiter.
4. **Die Person klickt selbst.** In `web/` bauen (`npm run build`), dann `bun bausteine/pocketbase/lokal.ts` (mit Eingang: `--eingang`). Die ganze Seite läuft mit dem Baustein auf dem Computer der Person, Mails erscheinen im Terminal statt bei echten Leuten. Gib ihr die Adresse und sag, was sie ausprobieren soll (anmelden, buchen, absagen). Sie klickt, du schaust zu und reparierst. Für die Verwaltung zeigt `lokal.ts` ein Konto nur für diesen Computer.
5. **Ins Logbuch**, noch nicht in den Hafen.

Strapi hat noch keinen Test und kein `lokal.ts`; seine Inhaltstypen schreibst du als Dateien (Abschnitt 6), laufen sieht man ihn erst auf dem Server. Sag das ehrlich.

### Beim Lancieren, mit Pilot

Im Skill `lancieren`, Teil 2, nach der Freigabe der Seite und vor dem Push in den Hafen:

1. **Foto des Servers:** Werkzeug `snapshot` mit Namen `vor-baustein` (Skill `zurueck-auf-gestern`).
2. **Einhängen.** In `compose.yaml` ganz oben:
   ```yaml
   include:
     - bausteine/pocketbase/compose.yaml
   ```
   Die Webseite reicht die Anfragen selbst weiter: Die Vorlage liest jede `bausteine/*/nginx.conf`. Ist das Projekt älter als die Bausteine (kein `nginx.conf` im Projekt), hol `Dockerfile` und `nginx.conf` aus `vorlage/` im gleichen Repo.
   **Mit Login der Schritt Eingang:** Steht in `docs/betrieb.md` `Eingang: ja` (Abschnitt 7; `grep -E '^Eingang: ja([^[:alpha:]]|$)' docs/betrieb.md` zeigt die Zeile, «Eingang: jamais» zählt nicht), kommt `- bausteine/eingang/compose.yaml` unter `include:`, und beim Dienst `webseite` fallen `ports:` und `- "80:80"` weg: Dann ist die Webseite nur noch hinter dem Eingang erreichbar. Ohne Login, oder wenn die Regeln von PocketBase reichen, bleibt `compose.yaml` wie in der Vorlage. Den Schritt nennt der Skill `lancieren` schon beim Wohnort.
3. **In den Hafen.** Das Fliessband baut und liefert aus (Skill `pipeline`). Klappt der Bau nicht, bleibt die alte Seite online.
4. **Prüfen** auf dem Server: `docker ps` zeigt den Baustein als `healthy`. Dann prüfst du von aussen jede Tür: `node scripts/pruefen.mjs --tueren <Adresse>` mit den Türen unten, mit Eingang auch geschützte Pfade 401, `/_/` 404, `/api/collections/_SUPERUSERS/auth-methods` 404 und die Startseite 200. Dann das erste Konto der Verwaltung und die Mails (Abschnitt 5).

### Türen der Bausteine

Was ein Baustein ohne Anmeldung antwortet, kommt in `docs/tueren.txt` (Skill `webseite-bauen`), nur die Zeilen der eingebauten Rezepte. `node scripts/pruefen.mjs --tueren` prüft sie lokal gegen `http://localhost:8090` (mit Eingang `http://localhost:8080`), solange `lokal.ts` läuft, und nach dem Lancieren gegen die Adresse. Listen von PocketBase mit einer Regel (etwa «nur das eigene Konto») geben Gästen 200 mit leerer Liste, nicht 401 oder 403; nur Listen allein für die Verwaltung geben 403. Das ist richtig so; die Regeln bleiben, wie sie sind.

```
/api/collections/anmeldungen/records      403   # anmeldeliste: eintragen dürfen alle, lesen nur die Verwaltung
/api/collections/termine_frei/records     200   # buchungen: freie Termine sieht jede Person
/api/collections/buchungen/records        403   # buchungen: Buchungen sieht nur die Verwaltung
/api/collections/wochenplan/records       403   # buchungen
/api/collections/users/records            200   # mitglieder: Gäste bekommen eine leere Liste
/api/collections/mitteilungen/records     200   # mitglieder: Gäste bekommen eine leere Liste
/api/collections/beitraege/records        200   # pinnwand: für alle
/intern/                                  401   # mit Eingang: jeder geschützte Pfad aus eingang.json
/_/                                       404   # mit Eingang
/api/collections/_SUPERUSERS/auth-methods 404   # mit Eingang
```

Gemessen am 31.10.2026 mit PocketBase 0.40.5 und `pruefen.mjs --tueren`, direkt bei PocketBase und durch den Eingang. Ohne Eingang ist `/_/` erst auf dem Server zu (404); lokal zeigt `lokal.ts` dort die Verwaltung, darum diese Tür dann erst nach dem Lancieren prüfen. Mit `buchungen` antwortet «Meine Buchungen» (`/verwaltung/`) mit 200: Die Seite ist offen, die Buchungen darin sieht nur, wer sich mit dem Konto der Verwaltung anmeldet. Eine Zeile `/verwaltung 404` passt dann nicht.

## 5. PocketBase: Anmeldeliste, Buchungen, Mitglieder, Pinnwand

PocketBase ist ein einziges kleines Programm mit Datenbank, Login und Verwaltung. Die Webseite spricht es unter `/api/` der eigenen Adresse an. Die Verwaltung bleibt draussen.

- **Adresse eintragen:** In `bausteine/pocketbase/pb_migrations/1_einstellungen.js` die Zeile `ADRESSE` auf die Adresse der Seite setzen (`https://{name}.aufwind.sh` oder die eigene Domain). Sie steht in Mails wie «Passwort vergessen».
- **Rezept einsetzen:** Aus `bausteine/pocketbase/rezepte/<rezept>/` kommen alle Dateien aus `pb_migrations/` nach `bausteine/pocketbase/pb_migrations/`, `pb_hooks/*` (falls vorhanden) nach `bausteine/pocketbase/pb_hooks/` und `seite/*.html` nach `seite/`. Den Ordner des Rezepts lässt du stehen, dort liegt der Test.
  - `anmeldeliste`: Formular `anmelden.html`. Alle dürfen sich eintragen, lesen kann nur die Verwaltung.
  - `buchungen`: `buchen.html` (freie Termine, buchen, absagen per Link aus der Mail) und `verwaltung.html` («Meine Buchungen» für die Person: wer kommt, absagen, Wochenplan). Mehr unten unter «Buchungen».
  - `mitglieder`: Wer sich registriert, stellt eine Anfrage. Die Person bestätigt ihre E-Mail-Adresse mit dem Link aus der Mail, die Verwaltung bekommt eine Meldung und schaltet sie frei (in der Verwaltung unter `users` das Feld `freigegeben`), dann bekommt die Person eine Mail. Erst bestätigt und freigeschaltet sieht sie die Mitteilungen. Freigabe und Rolle (`rolle`, zum Beispiel `vorstand`) setzt nur die Verwaltung, nie die Person selbst. Seiten: `mitglieder.html` (Anfrage, anmelden, Stand der Anfrage, Mail nochmals, «Passwort vergessen?»), `bestaetigen.html` und `passwort.html`; auf diese zwei führen die Links in den Mails. Liegen die Seiten anders (zum Beispiel `/passwort/` in einer Astro-Seite), trägst du den Pfad in `pb_migrations/2_mitteilungen_freigabe.js` ein (`SEITE_BESTAETIGEN`, `SEITE_PASSWORT`), den Mitgliederbereich und wer die Meldungen bekommt in `pb_hooks/mitglieder.js` (`MITGLIEDERSEITE`, `MELDUNGEN_AN`). Eigene Rollen ergänzt du in `ROLLEN`, bevor die Seite läuft. War das alte Rezept schon eingebaut, kommen die neuen Dateien einfach dazu; wer schon Mitglied war, muss danach einmal freigeschaltet werden und die Adresse bestätigen («Mail nochmals schicken» auf `mitglieder.html`).
  - `pinnwand`: `pinnwand.html` zeigt Beiträge mit Datum und Bild. Schreiben geht in der Verwaltung.
  - Eigene Felder oder Sammlungen schreibst du als weitere Datei `pb_migrations/3_*.js` nach dem gleichen Muster.
- **Erstes Konto der Verwaltung** (beim Lancieren): Nach dem ersten Start schreibt PocketBase einen Einrichtungslink ins Protokoll. Hol ihn und öffne den geheimen Gang (Tunnel), so bleibt die Verwaltung vom Internet aus unsichtbar:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && docker compose logs pocketbase' | grep pbinstall
  ssh -N -L 8090:localhost:8090 {name}@aufwind.sh
  ```
  Den zweiten Befehl lässt du im Hintergrund laufen. Gib der Person den Link mit `http://localhost:8090` statt `http://0.0.0.0:8090`. Sie legt dort E-Mail und Passwort fest, nur im Browser. Ist der Link abgelaufen: `docker compose restart pocketbase` auf dem Server, dann gibt es einen neuen. Später geht es über `http://localhost:8090/_/`, solange der Tunnel offen ist.
- **Verwaltung freigeben:** Brauchen andere die Verwaltung ohne Terminal, oder will die Person die Liste am Handy sehen: In `bausteine/pocketbase/nginx.conf` die `#` vor dem Block «Verwaltung freigeben» entfernen, ins Logbuch, in den Hafen. Dann ist sie unter `https://{name}.aufwind.sh/_/`, geschützt mit dem Passwort der Verwaltung. Erst freigeben, wenn das erste Konto steht. Sobald Mails gehen, schaltet die Person in der Verwaltung unter `_superusers` → Options die Zwei-Faktor-Anmeldung (MFA) ein. Mit dem Eingang (Abschnitt 7) bleibt die Verwaltung von aussen immer zu.
- **Mails** (Adresse bestätigen, Passwort vergessen): Der Server darf nicht über die üblichen Mail-Ports senden. In der Verwaltung unter Settings → Mail settings: SMTP-Server `smtp.resend.com`, Port `2587`, Benutzer `resend`, als Passwort den API-Schlüssel von Resend. Den tippt die Person dort selbst ein. Brevo geht auch, mit `smtp-relay.brevo.com` und Port `2525`. Absender ist eine Adresse der eigenen Domain, die beim Mail-Dienst bestätigt ist.
- **Anmelden mit Google, Apple oder GitHub:** geht in der Verwaltung unter `users` → Options → OAuth2. Das braucht ein Konto beim jeweiligen Anbieter. Mach es erst, wenn E-Mail und Passwort laufen.

### Buchungen

Das Rezept `buchungen` ist ein kleines Buchungstool für Kurse, Führungen und Termine, ohne Kundenkonto und ohne Bezahlen online. Es ist getestet: Zwei Leute bekommen nie denselben letzten Platz, vergangene Termine sind nicht buchbar, ein Kurs bleibt auch nach der Zeitumstellung um 18:30, Mails nennen die Schweizer Zeit.

**Der Person sagst du es so:** «Besucher wählen auf deiner Seite einen Termin und bekommen eine Bestätigung per Mail. Du trägst deine Kurse einmal als Wochenplan ein, zum Beispiel jeden Montag 18:30 mit 12 Plätzen, und siehst auf der Seite ‹Meine Buchungen›, wer kommt.»

Die Technik machst du, die Person entscheidet nur. In dieser Reihenfolge:

1. **Die Kurse erfragen, bevor du baust:** Name, Wochentag, Uhrzeit, Dauer, Plätze, Ort, Preis und bis wie kurz vor Beginn man buchen kann. Steht im Plan nur «haben wir», bitte jetzt darum. Schreib sie in `docs/kurse.md` und als `bausteine/pocketbase/pb_migrations/3_kurse.js` (Muster unten): So sind die Termine ab dem ersten Start da, niemand tippt sie ab.
2. **Einbauen:** `2_buchungen.js` nach `bausteine/pocketbase/pb_migrations/`, beide Dateien aus `pb_hooks/` nach `bausteine/pocketbase/pb_hooks/`. Den Ordner `rezepte/buchungen` lässt du stehen, dort liegt der Test.
3. **Zwei richtige Seiten daraus,** mit Kopf, Menü und Fuss wie alle anderen, nie die nackten HTML-Dateien:
   - Aus `seite/buchen.html` wird die Seite zum Buchen, zum Beispiel `web/src/pages/kurse.astro` im Layout der Seite: den Inhalt von `<main>` übernehmen, das Skript als `<script is:inline>`, von den Styles nur die Teile ohne `body`, `main` und `h1`. Oben steht der Wochenplan in Worten («Montag 18:30 Yoga am Abend»), aus `docs/kurse.md`.
   - Aus `seite/verwaltung.html` wird «Meine Buchungen», zum Beispiel `web/src/pages/verwaltung.astro`, mit `<meta name="robots" content="noindex">` und nicht im Menü.
   - Die Farben oben in beiden Dateien setzt du auf die Tokens der Seite (`var(--…)` aus `tokens.css`), keine kopierten Farbwerte.
   - Den Pfad der Seite zum Buchen trägst du in `pb_hooks/buchungen.js` bei `BUCHUNGSSEITE` ein (zum Beispiel `"/kurse/"`), sonst führen die Links in den Mails ins Leere.
4. **Prüfen, mit Beweis:** `bun bausteine/pocketbase/rezepte/buchungen/test.ts` muss «Alles grün» melden. Dann in `web/` bauen (`npm run build`) und `bun bausteine/pocketbase/lokal.ts` starten: Die ganze Seite läuft mit dem Buchungstool auf dem Computer der Person, Mails erscheinen im Terminal statt bei echten Leuten. Die Person bucht selbst einen Platz, sagt ihn wieder ab und meldet sich auf «Meine Buchungen» mit dem Konto an, das `lokal.ts` anzeigt. Zeig ihr den Text der Mail. Ohne diese Ausgaben ist die Prüfung nicht grün.
5. **Beim Lancieren:** Foto des Servers (Werkzeug `snapshot`, Name `vor-baustein`), einhängen, in den Hafen (Abschnitt 4).
6. **Mails, bevor die Person den Link teilt:** Nach dem Live-Gang die Mails einrichten (Abschnitt «Mails» oben) und im Netz einen Platz an die eigene Adresse buchen. Erst wenn diese Mail angekommen ist, ist das Buchungstool fertig. Meldungen über neue Buchungen gehen an die Absender-Adresse, eine andere trägst du in `pb_hooks/buchungen.js` bei `MELDUNGEN_AN` ein.
7. **Der Person zeigen, wie sie selbst pflegt:** «Meine Buchungen» am Handy öffnen (`https://{name}.aufwind.sh/verwaltung/`) und mit dem Konto der Verwaltung anmelden. Dort sieht sie die nächsten zwei Wochen, sagt eine Buchung oder einen ganzen Termin ab (alle Gebuchten bekommen eine Mail mit dem Grund), trägt Kurse ein oder beendet sie. Leg ihr die Seite als Lesezeichen an. Einzeltermine wie ein Workshop gehen (noch) nicht dort, sondern in der Verwaltung unter `termine`. Steht ein Eingang davor (Abschnitt 7), geht «Meine Buchungen» nur über den Tunnel.

Muster für `3_kurse.js` (Wochentage `mo` bis `so`, Uhrzeit in Schweizer Zeit, Buchungsschluss in Minuten vor Beginn):

```js
/// <reference path="../pb_data/types.d.ts" />
// Die Kurse aus docs/kurse.md. Später ändert die Person sie selbst auf «Meine Buchungen».
migrate((app) => {
  const kurs = (titel, ort, preis, buchungsschluss_min, plaene) => {
    const a = new Record(app.findCollectionByNameOrId("angebote"));
    a.set("titel", titel); a.set("ort", ort); a.set("preis_hinweis", preis); a.set("buchungsschluss_min", buchungsschluss_min); a.set("aktiv", true);
    app.save(a);
    for (const [wochentag, zeit, dauer_min, plaetze] of plaene) {
      const w = new Record(app.findCollectionByNameOrId("wochenplan"));
      w.set("angebot", a.id); w.set("wochentag", wochentag); w.set("zeit", zeit); w.set("dauer_min", dauer_min); w.set("plaetze", plaetze); w.set("aktiv", true);
      app.save(w);
    }
  };
  kurs("Yoga am Abend", "Seestrasse 1, Testwil", "CHF 25, bar oder TWINT vor Ort", 30, [["mo", "18:30", 75, 12], ["mi", "18:30", 75, 12]]);
});
```

Aus dem Wochenplan entstehen die Termine für acht Wochen im Voraus, jede Nacht kommen neue dazu. Ändert die Person Zeit oder Plätze, gilt das für alle Termine ohne Buchung; gebuchte bleiben, wie sie sind.

- **Wenn ihr es erweitert, bleiben diese Regeln:** Frei ist immer Plätze minus aktive Buchungen, nie ein Zähler. Geprüft wird im Server (`pb_hooks/`), nie nur im Browser. Zeiten speichern als Zeitpunkt, anzeigen mit `Europe/Zurich`. Fristen als Datum und Uhrzeit nennen, nie «24 h vorher». Nach dem Buchen eine Bestätigungsseite und eine Mail. Nur erfassen, was nötig ist: keine Adresse, kein Geburtsdatum, keine Gesundheitsangaben. Eine Löschfrist (Vorschlag: 12 Monate nach dem Termin) kommt in die Datenschutzerklärung (Skill `recht-ch`).
- **Bewusst nicht dabei,** erst wenn es fehlt: Bezahlen online (bei vielen No-Shows oder für eine Anzahlung: ein Zahlungslink mit der Buchungsnummer), Kundenkonten für Abos oder 10er-Karten (Rezept `mitglieder`), Warteliste, Erinnerung am Vortag.
- **Mit Light** geht kein echtes Buchen: Ohne Programm auf dem Server zählt niemand die Plätze. Ehrlich sagen und die Wahl lassen: Anfrage per Mail oder Formular-Dienst («Du bekommst bis morgen eine Bestätigung»), ein fremdes Buchungstool verlinken (kostet, Daten oft im Ausland), oder Pilot mit diesem Rezept.

## 6. Strapi: das grosse CMS

Strapi ist ein vollständiges System für Inhalte mit Rollen und Bilderverwaltung, dazu kommt eine eigene Datenbank (Postgres). Mehr dazu und die Frage, ob es sich lohnt: Skill `cms`. Strapi läuft erst auf dem Server, also beim Lancieren.

1. **Geheimnisse zuerst,** bevor `include` im Hafen ist, sonst scheitert der erste Bau. Vom Logbuch aus, ohne dass du sie siehst:
   ```bash
   ssh {name}@aufwind.sh 'mkdir -p ~/projekt/bausteine/strapi && sh -s ~/projekt/bausteine/strapi' < bausteine/strapi/geheimnisse.sh
   ```
2. **Inhaltstypen als Dateien:** Auf dem Server läuft Strapi im Betriebsmodus, dort lassen sich keine Inhaltstypen anklicken. Du schreibst sie unter `bausteine/strapi/cms/src/api/`. Das Rezept `veranstaltungen` zeigt das Muster: `schema.json` plus Controller, Route und Service.
3. **Lesen für alle:** In `bausteine/strapi/cms/src/index.ts` den Typ in `OEFFENTLICH` eintragen, zum Beispiel `'api::veranstaltung.veranstaltung'`. Die Seite liest dann `/cms/api/veranstaltungen` der eigenen Adresse, Bilder kommen über `/cms/uploads/`. Schreiben geht nur in der Verwaltung.
4. **`include` ergänzen, ins Logbuch, in den Hafen.** Der erste Bau dauert etwa 7 Minuten. Sag das vorher, damit niemand denkt, es hänge.
5. **Erstes Konto der Verwaltung:** Tunnel `ssh -N -L 1337:localhost:1337 {name}@aufwind.sh`, dann `http://localhost:1337/admin`. Die Person legt das Konto dort selbst an.
6. **Verwaltung freigeben** (eine Redaktion ohne Terminal): erst wenn das erste Konto steht, sonst könnte sich eine fremde Person zuerst registrieren. In `bausteine/strapi/nginx.conf` den ersten Block durch den Block «Verwaltung freigeben» ersetzen (ohne `#`), in `bausteine/strapi/cms/config/server.ts` die Zeile `url: '/cms'` einschalten, ins Logbuch, in den Hafen. Dann ist die Verwaltung unter `https://{name}.aufwind.sh/cms/admin`. Die Person lädt die Redaktion dort ein (Settings → Users, Rolle Editor oder Author). Jede Person setzt ihr Passwort selbst.
7. **Einträge erscheinen,** sobald sie in der Verwaltung veröffentlicht sind. Ein neuer Bau ist dafür nicht nötig.

## 7. Ein Eingang für alles?

**Das Bild:** der Empfang in einem Haus mit mehreren Büros. Wer hinein will, meldet sich einmal an; jedes Büro erfährt nur, wer kommt und mit welcher Rolle. Der Eingang ist ein kleiner Dienst vor der Seite. Angemeldet ist, wen PocketBase kennt (Rezept `mitglieder`), ein zweites Login gibt es nicht.

Ob es ihn braucht, entscheiden diese Regeln, in dieser Reihenfolge:

1. **Nie mit Light** und nie ohne eigenen Server: Der Eingang ist ein Programm, das auf dem Server läuft.
2. **Nicht nötig bei einem Baustein, wo die Regeln von PocketBase reichen:** zum Beispiel nur das Rezept `mitglieder` (Mitteilungen nur für Freigeschaltete) oder nur `buchungen`. Dann ohne Eingang.
3. **Nötig, wenn zwei oder mehr Teile wissen müssen, wer angemeldet ist** (zum Beispiel geschützte Seiten unter `/intern/` und die Mitteilungen aus PocketBase, oder ein eigenes kleines Programm daneben), **oder wenn Rollen über Teile hinweg gelten** (der Vorstand sieht `/vorstand/` und darf in PocketBase mehr).

Die Antwort kommt in `docs/betrieb.md` in die Zeile `Eingang:` (Skill `betrieb`). Ihr Wert beginnt immer mit dem deutschen `ja` oder `nicht nötig`, auch wenn die Person eine andere Sprache spricht; danach folgt der Grund in ihrer Sprache, zum Beispiel `Eingang: ja – /intern/ und die Mitteilungen aus PocketBase brauchen dieselbe Anmeldung` oder `Eingang: nicht nötig – nur das Rezept mitglieder, die Regeln von PocketBase reichen`. Nur bei `Eingang: ja` baut der Skill `lancieren` den Eingang ein. Die Türen der Seite (`docs/tueren.txt`: offen, nur mit Anmeldung, nie) werden zu den Teilen in `bausteine/eingang/eingang.json`.

**Kosten:** kein Geld extra, er läuft auf dem Pilot-Server mit. Speicher: 20 MB im Leerlauf; unter Volllast mit kleinen Seiten bis 69 MB, mit vielen Bildern auf einmal (20 Seiten mit je 60 Bildern) bis 129 MB, und wenn Besucherinnen grosse Dateien laden und nicht zu Ende lesen: Von der Webseite (nginx) und von PocketBase holt der Eingang grosse Dateien in Stücken, mit drei Adressen gemessen bis 42 MB, mit vierzehn bis 73 MB; von einem eigenen Teil, der keine Bereiche kann, mehr (gemessen 201 MB). Gemessen vom 31.10. bis 02.11.2026 auf einem Mac. Der Container ist auf 128 MB begrenzt (`mem_limit`); ob er dann neu startet und wie viel er auf dem Server braucht, ist noch nicht gemessen; jeder Aufruf eines geschützten Teils fragt PocketBase, das kostet knapp eine Millisekunde. Dazu ein Teil mehr, das gepflegt wird (Bun-Version im `Dockerfile`).

**Einbauen,** zuerst lokal wie jeder Baustein (Abschnitt 4), Schritt für Schritt in `bausteine/eingang/README.md`:

1. PocketBase mit dem Rezept `mitglieder` ist eingebaut. `bausteine/eingang` holen, `pb_hooks/*` nach `bausteine/pocketbase/pb_hooks/`, `pb_migrations/*` nach `bausteine/pocketbase/pb_migrations/`.
2. In `eingang.json` die Adresse der Seite (`ursprung`) und die Teile eintragen: Name, Ziel, Pfade, Zugang `offen`, `angemeldet` oder `rolle:<name>`. Geschützte Seiten liegen in eigenen Ordnern (`seite/intern/`). Kommt später eine eigene Domain dazu, braucht es hier nichts: Der Eingang nimmt Formulare und Anmeldungen von der Adresse an, über die die Seite aufgerufen wird.
3. In `mitglieder.html` `const EINGANG = true;` setzen: Die Anmeldung gilt dann mit einem Cookie für alle Teile.
4. `bun bausteine/eingang/test.ts` meldet «Alles grün», dann `bun bausteine/pocketbase/lokal.ts --eingang`: Die Person öffnet eine geschützte Seite ohne Anmeldung, meldet sich an, kommt zurück und meldet sich wieder ab.
5. Beim Lancieren (Skill `lancieren`, Teil 2): in `compose.yaml` unter `include:` die Zeile `- bausteine/eingang/compose.yaml`, und beim Dienst `webseite` die Zeilen `ports:` und `- "80:80"` löschen, sonst käme man am Eingang vorbei. Die Webseite ist dann nur noch hinter dem Eingang erreichbar. Danach von aussen jede Tür prüfen: `node scripts/pruefen.mjs --tueren https://{name}.aufwind.sh` mit den «Türen der Bausteine» (Abschnitt 4): `/intern/` gibt 401, `/_/` und `/api/collections/_SUPERUSERS/auth-methods` geben 404, die Startseite 200.

**Was er nicht kann:** Hinter dem Eingang geht «Meine Buchungen» (Rezept `buchungen`) nur über den Tunnel, weil er die Verwaltung von aussen sperrt, in jeder Schreibweise. Die Echtzeit von PocketBase (`/api/realtime`) sperrt er auch, kein Rezept braucht sie. Abmelden gilt für alle Geräte: Wer sich auf dem Handy abmeldet, ist auch am Computer abgemeldet.

## Stolpersteine

- **Verwaltung freigegeben, bevor das erste Konto steht:** Erst das Konto über den Tunnel anlegen, dann freigeben. Freigeben nur, wenn andere ohne Terminal sie brauchen.
- **Ein Baustein zu viel:** Jedes Teil will gepflegt und aktualisiert werden. Lieber eins, das gut läuft. Ein Eingang ohne zweiten Teil ist einer zu viel.
- **Direkt auf den Server:** Ein Baustein, der lokal nicht grün war und den die Person nicht selbst angeklickt hat, kommt nicht auf den Server.
- **Updates:** Die Versionen stehen im `Dockerfile` (PocketBase, Eingang) und in `package.json` (Strapi). Vor jedem Update ein Foto machen.
- **Daten:** Sie liegen in Volumes auf dem Server und sind in den täglichen Fotos dabei. `docker compose down -v` löscht sie, das nie ohne Foto und ohne Ja der Person.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Fertigteile beim Hausbau», der den Kern noch einmal sagt. Danach: was eingebaut ist, wo es läuft und wie viel Speicher es braucht, was noch offen ist und was als Nächstes kommt.
