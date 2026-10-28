---
name: bausteine
description: 'Findet mit einer Person ohne Vorwissen heraus, was ihre Seite können soll, und baut die passenden fertigen Bausteine ein: Anmeldeliste, Mitgliederbereich mit Login, Pinnwand (PocketBase) oder ein grosses CMS (Strapi mit Postgres), mit gemessenem Arbeitsspeicher. Erklärt mit dem Bild der Fertigteile beim Hausbau. Nutze den Skill bei «Anmeldung», «Anmeldeliste», «Formular speichern», «Login», «Mitgliederbereich», «Admin-Bereich», «Benutzer verwalten», «Datenbank», «Strapi», «CMS», «PocketBase», «Baustein», «was passt auf meinen Server», «reicht mein Server», und wenn eine Seite mehr können soll als Texte und Bilder zeigen.'
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
| Mitglieder melden sich an und sehen einen eigenen Bereich | **Mitgliederbereich mit Login** (PocketBase, Rezept `mitglieder`) | Pilot | etwa 20 MB |
| Andere pflegen News oder Termine im Browser | **Pinnwand** (PocketBase, Rezept `pinnwand`) | Pilot | etwa 20 MB |
| Viele Inhaltstypen, mehrere Rollen, Bilderverwaltung, später eine App | **Grosses CMS** (Strapi mit Postgres) | Pilot | etwa 200 MB, Bau bis 2,5 GB |

Empfiehl immer das Kleinste, das reicht. Mehrere Sprachen allein sind nie ein Grund für einen Baustein. PocketBase deckt Anmeldeliste, Login und Pinnwand zusammen ab, es läuft nur einmal. Strapi lohnt sich erst, wenn PocketBase zu klein wird.

Hat die Person Light und braucht einen Baustein: Sag es ehrlich. Bausteine laufen auf dem eigenen Server, also mit Pilot (Skill `kosten`, Wechsel über `upgrade_link` mit `pilot`). Logbuch und Adresse bleiben.

## 3. Was passt auf den Server?

Ein Server mit Pilot hat 4 GB Arbeitsspeicher und 40 GB Platz, ohne Auslagerungsspeicher: Wird es zu viel, beendet der Server ein Programm. Gemessen am 28.10.2026 (PocketBase 0.40.5, Strapi 5.58.0, Postgres 17):

| Was | Im Betrieb | Beim Bauen | Platz |
|---|---|---|---|
| Webseite aus der Vorlage | 10 MB | kurz | klein |
| PocketBase (alle drei Rezepte zusammen) | 20 MB | kurz | 40 MB |
| Strapi mit Postgres | 150 MB + 55 MB | Spitze 2,5 GB, erster Bau etwa 7 Minuten | 1,4 GB |

Webseite, PocketBase und Strapi zusammen brauchen im Betrieb etwa 250 MB. Eng wird es nur beim Bauen, darum baut das Fliessband einen Auftrag nach dem anderen. Nicht auf den Server gehören Programme, die allein mehr als 1 GB brauchen, zum Beispiel Keycloak, Supabase, Logto, Mattermost oder Texterkennung (OCR). Für ein eigenes Login nimm PocketBase.

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

## 5. PocketBase: Anmeldeliste, Mitglieder, Pinnwand

PocketBase ist ein einziges kleines Programm mit Datenbank, Login und Verwaltung. Die Webseite spricht es unter `/api/` der eigenen Adresse an. Die Verwaltung bleibt draussen.

- **Adresse eintragen:** In `bausteine/pocketbase/pb_migrations/1_einstellungen.js` die Zeile `ADRESSE` auf die Adresse der Seite setzen (`https://{name}.aufwind.sh` oder die eigene Domain). Sie steht in Mails wie «Passwort vergessen».
- **Rezept einsetzen:** Aus `bausteine/pocketbase/rezepte/<rezept>/` kommt `pb_migrations/2_*.js` nach `bausteine/pocketbase/pb_migrations/` und `seite/*.html` nach `seite/`.
  - `anmeldeliste`: Formular `anmelden.html`. Alle dürfen sich eintragen, lesen kann nur die Verwaltung.
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
