---
name: bausteine
description: 'Findet mit einer Person ohne Vorwissen heraus, was ihre Seite können soll, und baut die passenden fertigen Bausteine ein: Anmeldeliste, Buchungen für Kurse und Termine, Mitgliederbereich mit Login, Pinnwand (PocketBase) oder ein grosses CMS (Strapi mit Postgres), mit gemessenem Arbeitsspeicher. Erklärt mit dem Bild der Fertigteile beim Hausbau. Nutze den Skill bei «Anmeldung», «Anmeldeliste», «Buchung», «Buchungstool», «Kurse buchen», «Termin buchen», «Reservation», «Platz reservieren», «Formular speichern», «Login», «Mitgliederbereich», «Admin-Bereich», «Benutzer verwalten», «Datenbank», «Strapi», «CMS», «PocketBase», «Baustein», «was passt auf meinen Server», «reicht mein Server», und wenn eine Seite mehr können soll als Texte und Bilder zeigen.'
---

# Bausteine: Fertigteile für deine Seite

## Das Bild

Wer ein Haus baut, schreinert Fenster, Türen und Küche nicht selbst. Sie kommen fertig aus der Fabrik, geprüft und mit Anleitung, und werden eingebaut. Bei einer Webseite ist es gleich: Login, Anmeldeliste oder ein System für Inhalte schreibt niemand neu. Albatros hat sie als fertige Bausteine bereit, getestet und gemessen.

Und wie beim Haus gilt: Jedes Teil braucht Platz. Darum schaust du zuerst, was die Person wirklich braucht.

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
| Mitglieder melden sich an und sehen einen eigenen Bereich | **Mitgliederbereich mit Login** (PocketBase, Rezept `mitglieder`) | Pilot | etwa 20 MB |
| Andere pflegen News oder Termine im Browser | **Pinnwand** (PocketBase, Rezept `pinnwand`) | Pilot | etwa 20 MB |
| Viele Inhaltstypen, mehrere Rollen, Bilderverwaltung, später eine App | **Grosses CMS** (Strapi mit Postgres) | Pilot | etwa 200 MB, Bau bis 2,5 GB |

Empfiehl immer das Kleinste, das reicht. Mehrere Sprachen allein sind nie ein Grund für einen Baustein. PocketBase deckt Anmeldeliste, Login und Pinnwand zusammen ab, es läuft nur einmal. Strapi lohnt sich erst, wenn PocketBase zu klein wird.

Hat die Person Light und braucht einen Baustein: Sag es ehrlich. Bausteine laufen auf dem eigenen Server, also mit Pilot (Skill `kosten`, Wechsel über `upgrade_link` mit `pilot`). Logbuch und Adresse bleiben.

## 3. Was passt auf den Server?

Ein Server mit Pilot hat 4 GB Arbeitsspeicher und 40 GB Platz, ohne Auslagerungsspeicher: Wird es zu viel, beendet der Server ein Programm. Gemessen am 28.10.2026 (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17):

| Was | Im Betrieb | Beim Bauen | Platz |
|---|---|---|---|
| Grundlast: System, Docker, Arbeiter am Fliessband | 150 MB, eingeplant 0,5 GB | kurz mehr | – |
| Webseite aus der Vorlage | 10 MB | kurz | klein |
| PocketBase (alle Rezepte zusammen) | 20 MB | kurz | 40 MB |
| Strapi mit Postgres | 150 MB + 55 MB | Spitze 2,5 GB, erster Bau etwa 7 Minuten | 1,4 GB |

Für Bausteine bleiben also etwa 3,5 GB. Webseite, PocketBase und Strapi zusammen brauchen im Betrieb etwa 250 MB. Eng wird es nur beim Bauen, darum baut das Fliessband einen Auftrag nach dem anderen. Nicht auf den Server gehören Programme, die allein mehr als 1 GB brauchen, zum Beispiel Keycloak, Supabase, Logto, Mattermost oder Texterkennung (OCR). Für ein eigenes Login nimm PocketBase.

Vor dem Einbau: `free -h` auf dem Server zeigt, wie viel frei ist. Nach dem Einbau: `docker stats --no-stream` zeigt, was jeder Baustein braucht.

## 4. Einbauen

Gilt für jeden Baustein. Mach vorher ein Foto des Servers: Werkzeug `snapshot` mit Namen `vor-baustein` (Skill `zurueck-auf-gestern`).

1. **Holen.** Im Logbuch auf dem Computer der Person (Skill `git-logbuch`) lädst du den Baustein aus der Fabrik, dem öffentlichen Repo von Albatros:
   ```bash
   curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/pocketbase
   ```
   Für Strapi steht am Ende `bausteine/strapi`. Die Rezepte liegen danach unter `bausteine/<baustein>/rezepte/`.
2. **Einhängen.** In `compose.yaml` ganz oben:
   ```yaml
   include:
     - bausteine/pocketbase/compose.yaml
   ```
   Die Webseite reicht die Anfragen selbst weiter: Die Vorlage liest jede `bausteine/*/nginx.conf`. Ist das Projekt älter als die Bausteine (kein `nginx.conf` im Projekt), hol `Dockerfile` und `nginx.conf` aus `vorlage/` im gleichen Repo.
3. **Rezept einsetzen** (Abschnitt 5 oder 6), Texte der Seiten in die Sprache der Person bringen.
4. **Ins Logbuch und in den Hafen.** Das Fliessband baut und liefert aus (Skill `pipeline`). Klappt der Bau nicht, bleibt die alte Seite online.
5. **Prüfen** auf dem Server: `docker ps` zeigt den Baustein als `healthy`.

## 5. PocketBase: Anmeldeliste, Buchungen, Mitglieder, Pinnwand

PocketBase ist ein einziges kleines Programm mit Datenbank, Login und Verwaltung. Die Webseite spricht es unter `/api/` der eigenen Adresse an. Die Verwaltung bleibt draussen.

- **Adresse eintragen:** In `bausteine/pocketbase/pb_migrations/1_einstellungen.js` die Zeile `ADRESSE` auf die Adresse der Seite setzen (`https://{name}.aufwind.sh` oder die eigene Domain). Sie steht in Mails wie «Passwort vergessen».
- **Rezept einsetzen:** Aus `bausteine/pocketbase/rezepte/<rezept>/` kommt `pb_migrations/2_*.js` nach `bausteine/pocketbase/pb_migrations/`, `pb_hooks/*` (falls vorhanden) nach `bausteine/pocketbase/pb_hooks/` und `seite/*.html` nach `seite/`.
  - `anmeldeliste`: Formular `anmelden.html`. Alle dürfen sich eintragen, lesen kann nur die Verwaltung.
  - `buchungen`: `buchen.html` (freie Termine, buchen, absagen per Link aus der Mail) und `verwaltung.html` («Meine Buchungen» für die Person: wer kommt, absagen, Wochenplan). Mehr unten unter «Buchungen».
  - `mitglieder`: `mitglieder.html` mit Registrieren, Anmelden, Abmelden. Mitteilungen sehen nur angemeldete Mitglieder. Die Mitglieder stehen in der Verwaltung unter `users`.
  - `pinnwand`: `pinnwand.html` zeigt Beiträge mit Datum und Bild. Schreiben geht in der Verwaltung.
  - Eigene Felder oder Sammlungen schreibst du als weitere Datei `pb_migrations/3_*.js` nach dem gleichen Muster.
- **Erstes Konto der Verwaltung:** Nach dem ersten Start schreibt PocketBase einen Einrichtungslink ins Protokoll. Hol ihn und öffne den geheimen Gang (Tunnel), so bleibt die Verwaltung vom Internet aus unsichtbar:
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && docker compose logs pocketbase' | grep pbinstall
  ssh -N -L 8090:localhost:8090 {name}@aufwind.sh
  ```
  Den zweiten Befehl lässt du im Hintergrund laufen. Gib der Person den Link mit `http://localhost:8090` statt `http://0.0.0.0:8090`. Sie legt dort E-Mail und Passwort fest, nur im Browser. Ist der Link abgelaufen: `docker compose restart pocketbase` auf dem Server, dann gibt es einen neuen. Später geht es über `http://localhost:8090/_/`, solange der Tunnel offen ist.
- **Verwaltung freigeben:** Brauchen andere die Verwaltung ohne Terminal, oder will die Person die Liste am Handy sehen: In `bausteine/pocketbase/nginx.conf` die `#` vor dem Block «Verwaltung freigeben» entfernen, ins Logbuch, in den Hafen. Dann ist sie unter `https://{name}.aufwind.sh/_/`, geschützt mit dem Passwort der Verwaltung. Erst freigeben, wenn das erste Konto steht. Sobald Mails gehen, schaltet die Person in der Verwaltung unter `_superusers` → Options die Zwei-Faktor-Anmeldung (MFA) ein.
- **Mails** (Adresse bestätigen, Passwort vergessen): Der Server darf nicht über die üblichen Mail-Ports senden. In der Verwaltung unter Settings → Mail settings: SMTP-Server `smtp.resend.com`, Port `2587`, Benutzer `resend`, als Passwort den API-Schlüssel von Resend. Den tippt die Person dort selbst ein. Brevo geht auch, mit `smtp-relay.brevo.com` und Port `2525`. Absender ist eine Adresse der eigenen Domain, die beim Mail-Dienst bestätigt ist.
- **Anmelden mit Google, Apple oder GitHub:** geht in der Verwaltung unter `users` → Options → OAuth2. Das braucht ein Konto beim jeweiligen Anbieter. Mach es erst, wenn E-Mail und Passwort laufen.

### Buchungen

Das Rezept `buchungen` ist ein kleines Buchungstool für Kurse, Führungen und Termine, ohne Kundenkonto und ohne Bezahlen online. Es ist getestet: Zwei Leute bekommen nie denselben letzten Platz, vergangene Termine sind nicht buchbar, ein Kurs bleibt auch nach der Zeitumstellung um 18:30, Mails nennen die Schweizer Zeit.

**Der Person sagst du es so:** «Besucher wählen auf deiner Seite einen Termin und bekommen eine Bestätigung per Mail. Du trägst deine Kurse einmal als Wochenplan ein, zum Beispiel jeden Montag 18:30 mit 12 Plätzen, und siehst auf der Seite ‹Meine Buchungen›, wer kommt.»

Die Technik machst du, die Person entscheidet nur. In dieser Reihenfolge:

1. **Foto des Servers** (Werkzeug `snapshot`, Name `vor-baustein`), bevor etwas eingebaut wird.
2. **Die Kurse erfragen, bevor du baust:** Name, Wochentag, Uhrzeit, Dauer, Plätze, Ort, Preis und bis wie kurz vor Beginn man buchen kann. Steht im Plan nur «haben wir», bitte jetzt darum. Schreib sie in `docs/kurse.md` und als `bausteine/pocketbase/pb_migrations/3_kurse.js` (Muster unten): So sind die Termine ab dem ersten Start da, niemand tippt sie ab.
3. **Einbauen:** `2_buchungen.js` nach `bausteine/pocketbase/pb_migrations/`, beide Dateien aus `pb_hooks/` nach `bausteine/pocketbase/pb_hooks/`. Den Ordner `rezepte/buchungen` lässt du stehen, dort liegt der Test.
4. **Zwei richtige Seiten daraus,** mit Kopf, Menü und Fuss wie alle anderen, nie die nackten HTML-Dateien:
   - Aus `seite/buchen.html` wird die Seite zum Buchen, zum Beispiel `web/src/pages/kurse.astro` im Layout der Seite: den Inhalt von `<main>` übernehmen, das Skript als `<script is:inline>`, von den Styles nur die Teile ohne `body`, `main` und `h1`. Oben steht der Wochenplan in Worten («Montag 18:30 Yoga am Abend»), aus `docs/kurse.md`.
   - Aus `seite/verwaltung.html` wird «Meine Buchungen», zum Beispiel `web/src/pages/verwaltung.astro`, mit `<meta name="robots" content="noindex">` und nicht im Menü.
   - Die Farben oben in beiden Dateien setzt du auf die Tokens der Seite (`var(--…)` aus `tokens.css`), keine kopierten Farbwerte.
   - Den Pfad der Seite zum Buchen trägst du in `pb_hooks/buchungen.js` bei `BUCHUNGSSEITE` ein (zum Beispiel `"/kurse/"`), sonst führen die Links in den Mails ins Leere.
5. **Prüfen, mit Beweis:** `bun bausteine/pocketbase/rezepte/buchungen/test.ts` muss «Alles grün» melden. Dann in `web/` bauen (`npm run build`) und `bun bausteine/pocketbase/lokal.ts` starten: Die ganze Seite läuft mit dem Buchungstool auf dem Computer der Person, Mails erscheinen im Terminal statt bei echten Leuten. Buch selbst einen Platz, sag ihn wieder ab, melde dich auf «Meine Buchungen» mit dem Konto an, das `lokal.ts` anzeigt. Zeig der Person das Foto der Bestätigung und den Text der Mail. Ohne diese Ausgaben ist die Prüfung nicht grün.
6. **Mails, bevor die Person den Link teilt:** Nach dem Live-Gang die Mails einrichten (Abschnitt «Mails» oben) und im Netz einen Platz an die eigene Adresse buchen. Erst wenn diese Mail angekommen ist, ist das Buchungstool fertig. Meldungen über neue Buchungen gehen an die Absender-Adresse, eine andere trägst du in `pb_hooks/buchungen.js` bei `MELDUNGEN_AN` ein.
7. **Der Person zeigen, wie sie selbst pflegt:** «Meine Buchungen» am Handy öffnen (`https://{name}.aufwind.sh/verwaltung/`) und mit dem Konto der Verwaltung anmelden. Dort sieht sie die nächsten zwei Wochen, sagt eine Buchung oder einen ganzen Termin ab (alle Gebuchten bekommen eine Mail mit dem Grund), trägt Kurse ein oder beendet sie. Leg ihr die Seite als Lesezeichen an. Einzeltermine wie ein Workshop gehen (noch) nicht dort, sondern in der Verwaltung unter `termine`.

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

Strapi ist ein vollständiges System für Inhalte mit Rollen und Bilderverwaltung, dazu kommt eine eigene Datenbank (Postgres). Mehr dazu und die Frage, ob es sich lohnt: Skill `cms`.

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

## Stolpersteine

- **Verwaltung freigegeben, bevor das erste Konto steht:** Erst das Konto über den Tunnel anlegen, dann freigeben. Freigeben nur, wenn andere ohne Terminal sie brauchen.
- **Ein Baustein zu viel:** Jedes Teil will gepflegt und aktualisiert werden. Lieber eins, das gut läuft.
- **Updates:** Die Versionen stehen im `Dockerfile` (PocketBase) und in `package.json` (Strapi). Vor jedem Update ein Foto machen.
- **Daten:** Sie liegen in Volumes auf dem Server und sind in den täglichen Fotos dabei. `docker compose down -v` löscht sie, das nie ohne Foto und ohne Ja der Person.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Fertigteile beim Hausbau», der den Kern noch einmal sagt. Danach: was eingebaut ist, wo es läuft und wie viel Speicher es braucht, was noch offen ist und was als Nächstes kommt.
