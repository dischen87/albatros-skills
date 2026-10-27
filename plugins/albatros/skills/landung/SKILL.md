---
name: landung
description: 'Plant und begleitet den Umzug eines Projekts von Albatros auf einen eigenen Server, erklärt mit dem Bild vom Umzug ins eigene Haus: Umzugsliste, Server mieten und einrichten (SSH nur mit Schlüssel, Firewall, Updates, Caddy für HTTPS), Fliessband auf das neue Ziel umstellen, Daten und Geheimnisse mitnehmen, testen, Adresse im DNS umstellen, Sicherungen selbst übernehmen. Nutze den Skill bei «eigener Server», «umziehen», «weg von Albatros», «Hetzner», «VPS», «selber hosten», «Landung», «was brauche ich für einen eigenen Server».'
---

# Landung: Umzug ins eigene Haus

## Das Bild

Bei Albatros wohnst du in einer Wohnung mit Hauswart: Er macht die Haustür zu, wechselt die Schlösser und fotografiert jede Nacht die Wohnung. Im eigenen Haus machst du das selbst.

Der Umzug ist kein Neubau. Dein Projekt ist schon in Kisten verpackt, die überall passen: das Logbuch (Git), die Bauanleitung (`Dockerfile`, `compose.yaml`) und das Fliessband (Workflow). Du packst den Rest dazu, ziehst um und meldest deine Adresse um.

## So sprichst du

- Du-Form. Ehrlich über den Aufwand: Ein eigener Server spart oft Geld, kostet aber Zeit für Pflege.
- Server mieten und bezahlen macht die Person selbst beim Anbieter.
- Das alte Zuhause wird erst abgeschaltet, wenn das neue nachweislich läuft.

## Ablauf

### 1. Lohnt sich der Umzug?

Kurz mit der Person durchgehen (siehe Skill `kosten`): Braucht das Projekt mehr, als Albatros bietet? Will sie alles selbst in der Hand haben? Hat sie jeden Monat ein, zwei Stunden für Pflege? Wenn nicht, ist Bleiben eine gute Entscheidung.

### 2. Umzugsliste

`docs/landung.md` im Projekt:

```markdown
# Umzug auf eigenen Server

## Kisten
- [ ] Logbuch: alles gepusht (`git status` sauber)
- [ ] Geheimnisse: Liste der Namen aus `.env.example` (Werte nie hier!)
- [ ] Daten: Datenbank, hochgeladene Dateien (Ordner: …)
- [ ] Einstellungen: Domains, E-Mail-Einträge im DNS (nicht anfassen), Cronjobs

## Was ich selbst übernehme
- [ ] Updates (automatisch, nur Sicherheitsupdates)
- [ ] Sicherungen (nächtlich, ausser Haus, verschlüsselt, Probe jeden Monat)
- [ ] Überwachung (Seite antwortet? Platte voll?)

## Ablauf und Datum
…
```

### 3. Das neue Haus

1. Server mieten, Ubuntu 24.04, mindestens so viel Arbeitsspeicher wie bisher. Beim Bestellen den **öffentlichen** Hausschlüssel der Person hinterlegen.
2. Einrichten mit einem Skript, das man gefahrlos mehrmals laufen lassen kann (als root, zuerst lesen, dann laufen lassen):
   - Updates, Docker aus der offiziellen Quelle
   - Benutzer `deploy` nur mit dem Schlüssel des Fliessbands, Ordner `~/projekt`
   - SSH nur mit Schlüssel: `PasswordAuthentication no` in `/etc/ssh/sshd_config.d/10-haerten.conf`, vorher `sshd -t` prüfen
   - Firewall: zuerst `ufw allow 22/tcp`, `80/tcp`, `443`, erst dann `ufw enable` (sonst sperrst du dich aus). Eine offene SSH-Sitzung als Rettungsleine behalten.
   - `fail2ban`, automatische Sicherheitsupdates (`unattended-upgrades`)
   - Grenzen für Logs, damit die Platte nicht vollläuft
3. **Caddy** als Pförtner vor der Webseite: holt das Zertifikat für HTTPS selbst, sobald die Adresse auf den Server zeigt. Er kommt als eigener Dienst in `compose.yaml`, die Webseite selbst bindet dann nur noch an `127.0.0.1`. Ein Fehler im `Caddyfile` legt alles lahm: vor jedem Neuladen `caddy validate`, danach von aussen prüfen.

### 4. Fliessband umstellen

Neue Werte in GitHub: `gh variable set SERVER --body "deploy@<neue-adresse>"`, neuer `DEPLOY_KNOWN_HOSTS`, gleicher oder neuer `DEPLOY_KEY`. Dann `gh workflow run deploy.yml`. Es muss grün werden.

### 5. Daten und Geheimnisse mitnehmen

- `.env` direkt von Server zu Server oder über den eigenen Computer mit `scp`, nie über Git.
- Datenbank: auf Albatros sichern (z. B. `sqlite3 app.sqlite ".backup kopie.sqlite"` oder `pg_dump`), auf dem neuen Server zurückspielen.
- Hochgeladene Dateien mit `rsync -a`.

### 6. Adresse umstellen

1. Am Tag vorher im DNS die Gültigkeit (TTL) der Einträge auf 300 Sekunden senken. Dann geht das Umstellen schneller.
2. Über die Adresse des neuen Servers testen, zum Beispiel mit `curl --resolve <domain>:443:<neue-ip> https://<domain>/`.
3. A- und AAAA-Eintrag auf den neuen Server. Die Domain bei Albatros mit `domain_verbinden` entfernen, damit nichts doppelt läuft.
4. Prüfen: `https://<domain>` antwortet, `www` leitet weiter, Schloss-Symbol ist da.

### 7. Erst dann ausziehen

Eine Woche beobachten. Läuft alles, das Abo bei Albatros anpassen oder kündigen (Cockpit). Fotos (Snapshots) gibt es danach nicht mehr: Ab jetzt zählen die eigenen Sicherungen.

### 8. Mission prüfen

`docs/landung.md` ins Logbuch und über das Fliessband (Skills `git-logbuch`, `pipeline`), dann `mission_pruefen` mit `flugschule-10-landung`. Die Prüfung schaut, ob die Umzugsliste auf dem Albatros-Server liegt. Am besten schreibt die Person die Liste, solange sie noch bei Albatros wohnt.

## Stolpersteine

- Kein Zertifikat: Die Adresse zeigt noch nicht auf den neuen Server, oder Port 80 ist zu.
- Docker-Ports umgehen die Firewall: interne Dienste nur an `127.0.0.1`.
- Sicherungen eingerichtet, aber nie zurückgespielt: Eine Sicherung zählt erst, wenn die Probe geklappt hat.
- Nach Updates automatisch neu starten: nur, wenn danach alles von selbst wieder hochkommt.
