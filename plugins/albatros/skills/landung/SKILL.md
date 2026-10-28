---
name: landung
description: 'Plant und begleitet den Umzug eines Projekts von Albatros auf einen eigenen Server, erklärt mit dem Bild vom Umzug ins eigene Haus: Umzugsliste, Server mieten und einrichten (SSH nur mit Schlüssel, Firewall, Updates, Caddy für HTTPS), Logbuch zu GitHub mitnehmen, Fliessband dort mit eigenem Schlüssel per SSH auf das neue Ziel umstellen, Daten und Geheimnisse mitnehmen, testen, Adresse im DNS umstellen oder eine bei Albatros gekaufte Domain mit dem Auth-Code aus domain_mitnehmen zu einem neuen Registrar umziehen, Sicherungen selbst übernehmen. Nutze den Skill bei «eigener Server», «umziehen», «weg von Albatros», «Hetzner», «VPS», «selber hosten», «Landung», «was brauche ich für einen eigenen Server».'
---

# Landung: Umzug ins eigene Haus

## Das Bild

Bei Albatros wohnst du in einer Wohnung mit Hauswart: Er macht die Haustür zu, wechselt die Schlösser und fotografiert jede Nacht die Wohnung. Im eigenen Haus machst du das selbst.

Der Umzug ist kein Neubau. Dein Projekt ist schon in Kisten verpackt, die überall passen: das Logbuch (Git), die Bauanleitung (`Dockerfile`, `compose.yaml`) und das Fliessband (Workflow). Du packst den Rest dazu, ziehst um und meldest deine Adresse um. Nur der Hafen gehört zum Haus von Albatros: Dein Logbuch bekommt einen neuen Hafen, zum Beispiel GitHub.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
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
- [ ] Logbuch im neuen Hafen (z. B. GitHub), alle Einträge dort angekommen
- [ ] Geheimnisse: Liste der Namen aus `.env.example` (Werte nie hier!)
- [ ] Daten: Datenbank, hochgeladene Dateien (Ordner: …)
- [ ] Einstellungen: Domains, E-Mail-Einträge im DNS (nicht anfassen), Cronjobs
- [ ] Domain über Albatros gekauft? Dann mit dem Auth-Code (`domain_mitnehmen`) zu einem neuen Registrar

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
   - Benutzer `deploy` mit deinem Schloss, Ordner `~/projekt`
   - SSH nur mit Schlüssel: `PasswordAuthentication no` in `/etc/ssh/sshd_config.d/10-haerten.conf`, vorher `sshd -t` prüfen
   - Firewall: zuerst `ufw allow 22/tcp`, `80/tcp`, `443`, erst dann `ufw enable` (sonst sperrst du dich aus). Eine offene SSH-Sitzung als Rettungsleine behalten.
   - `fail2ban`, automatische Sicherheitsupdates (`unattended-upgrades`)
   - Grenzen für Logs, damit die Platte nicht vollläuft
3. **Caddy** als Pförtner vor der Webseite: holt das Zertifikat für HTTPS selbst, sobald die Adresse auf den Server zeigt. Er kommt als eigener Dienst in `compose.yaml`, die Webseite selbst bindet dann nur noch an `127.0.0.1`. Ein Fehler im `Caddyfile` legt alles lahm: vor jedem Neuladen `caddy validate`, danach von aussen prüfen.

### 4. Logbuch und Fliessband mitnehmen

Auf Albatros wohnt der Arbeiter des Fliessbands im Haus. Im eigenen Haus übernimmt ein Arbeiter von GitHub: Er baut nicht selbst, sondern klingelt mit einem eigenen Schlüssel beim neuen Server und lässt ihn liefern.

1. **Neuer Hafen:** Die Person legt selbst ein Konto auf github.com an. Dann `gh` installieren (Mac: `brew install gh`) und `gh auth login`, die Anmeldung läuft im Browser.
2. **Logbuch umziehen:**
   ```bash
   git remote rename origin albatros
   gh repo create <projektname> --private --source . --remote origin --push
   ```
   Der alte Hafen bleibt als `albatros` erreichbar, bis du ausziehst.
3. **Lese-Schlüssel für den neuen Server:** Er holt das Logbuch selbst, nur lesend. Sein Hausschlüssel bleibt auf dem Server, zu GitHub geht nur das Schloss:
   ```bash
   ssh deploy@<neue-adresse> 'ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C eigener-server'
   ssh deploy@<neue-adresse> 'cat ~/.ssh/id_ed25519.pub' > server-schloss.pub
   gh repo deploy-key add server-schloss.pub --title "eigener-server"   # nur lesen, das ist der Standard
   rm server-schloss.pub
   ssh deploy@<neue-adresse> 'ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts && git clone git@github.com:<benutzer>/<projektname>.git ~/projekt'
   ```
   Den Fingerabdruck von github.com mit dem auf docs.github.com vergleichen.
4. **Eigener Schlüssel für das Fliessband**, nie der Hausschlüssel der Person. So lässt er sich einzeln sperren:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/fliessband -N "" -C fliessband
   ssh deploy@<neue-adresse> 'cat >> ~/.ssh/authorized_keys' < ~/.ssh/fliessband.pub
   gh secret set DEPLOY_KEY < ~/.ssh/fliessband
   gh secret set DEPLOY_KNOWN_HOSTS --body "$(ssh-keyscan -t ed25519 <neue-adresse> 2>/dev/null)"
   gh variable set SERVER --body "deploy@<neue-adresse>"
   gh variable set SEITE_URL --body "https://<domain>"
   ```
   Der Schlüssel geht direkt aus der Datei in den Tresor von GitHub (Secrets), nie in den Chat und nie ins Logbuch. Danach darf `~/.ssh/fliessband` auf dem Computer gelöscht werden.
5. **Workflow anpassen:** In `.github/workflows/deploy.yml` ändern sich der Arbeiter und der Weg zum Server. Der Rest bleibt:
   ```yaml
   jobs:
     fliessband:
       runs-on: ubuntu-latest              # ein Arbeiter von GitHub statt deines Servers
       permissions:
         contents: read                    # so wenig Rechte wie möglich
       concurrency:
         group: ausliefern
         cancel-in-progress: false         # eine laufende Auslieferung nie abbrechen
       env:
         ZIEL: ${{ vars.SERVER }}
         SEITE: ${{ vars.SEITE_URL }}
         SHA: ${{ github.sha }}
       steps:
         - name: Schlüssel des Fliessbands einsetzen
           env:
             DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
             DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
           run: |
             [ -n "$DEPLOY_KEY" ] || { echo "::error::Secret DEPLOY_KEY fehlt"; exit 1; }
             install -d -m 700 ~/.ssh
             printf '%s\n' "$DEPLOY_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519
             printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
         - name: Bauen und ausliefern, notfalls zurück
           run: |
             ssh "$ZIEL" "SHA=$SHA bash -s" <<'EOF'
             # hier der Block aus der Albatros-Version, ab «set -euo pipefail» bis «echo "läuft: $SHA"», ohne die Zeile mit willkommen
             EOF
         - name: Endkontrolle von aussen
           run: |
             # unverändert aus der Albatros-Version
   ```
   Geheimnisse kommen nur über `env:` in die Befehle, nie direkt als `${{ secrets.… }}` in eine `run`-Zeile. Dann `gh workflow run deploy.yml` und `gh run watch`. Es muss grün werden.

### 5. Daten und Geheimnisse mitnehmen

- `.env` direkt von Server zu Server oder über den eigenen Computer mit `scp`, nie über Git.
- Datenbank: auf Albatros sichern (z. B. `sqlite3 app.sqlite ".backup kopie.sqlite"` oder `pg_dump`), auf dem neuen Server zurückspielen.
- Hochgeladene Dateien mit `rsync -a`.

### 6. Adresse umstellen

Zuerst über die Adresse des neuen Servers testen, ohne das Telefonbuch zu ändern: `curl --resolve <domain>:443:<neue-ip> https://<domain>/`. Dann kommt es darauf an, wo die Adresse gemietet ist.

**Über Albatros gekauft** (`konto_status` zeigt sie unter «Eigene Domains»): Das Telefonbuch dafür führt Albatros. Die Adresse zieht mit zu einem Registrar, den die Person wählt:

1. Die Person legt beim neuen Registrar selbst ein Konto an.
2. Erst mit ihrem Ja `domain_mitnehmen` aufrufen. Ab dann verlängert Albatros die Adresse nicht mehr. Bis zum Umzug zeigt sie weiter auf den Albatros-Server.
3. Das Werkzeug gibt den **Auth-Code**, den Schlüssel für den Umzug der Adresse. Zeig ihn nur der Person, nie in einer Datei oder im Logbuch. Sie gibt ihn beim neuen Registrar ein und startet dort den Umzug (Transfer). Meist bezahlt sie dabei ein Jahr Verlängerung. Bei `.com` und `.net` geht ein Umzug in den ersten 60 Tagen nach dem Kauf oft noch nicht.
4. Ist der Umzug durch, setzt sie beim neuen Registrar die Einträge: A und AAAA auf den neuen Server, `www` und die E-Mail-Einträge (MX), falls es welche gab.

**Anderswo gemietet:**

1. Am Tag vorher die Gültigkeit (TTL) der Einträge auf 300 Sekunden senken. Dann geht das Umstellen schneller.
2. A- und AAAA-Eintrag auf den neuen Server. Bei Albatros musst du dafür nichts abmelden.

Danach prüfen: `https://<domain>` antwortet, `www` leitet weiter, Schloss-Symbol ist da.

### 7. Erst dann ausziehen

Eine Woche beobachten. Läuft alles, das Abo bei Albatros anpassen oder kündigen (Cockpit). Eine Domain, die die Person über Albatros gekauft hat, zieht vorher um (Schritt 6), sonst läuft sie mit ihrem Abo ab. Fotos (Snapshots) gibt es danach nicht mehr: Ab jetzt zählen die eigenen Sicherungen.

### 8. Mission prüfen

`docs/landung.md` ins Logbuch und über das Fliessband (Skills `git-logbuch`, `pipeline`), dann `mission_pruefen` mit `flugschule-10-landung`. Die Prüfung schaut, ob die Umzugsliste auf dem Albatros-Server liegt. Am besten schreibt die Person die Liste, solange sie noch bei Albatros wohnt.

## Stolpersteine

- Kein Zertifikat: Die Adresse zeigt noch nicht auf den neuen Server, oder Port 80 ist zu.
- Docker-Ports umgehen die Firewall: interne Dienste nur an `127.0.0.1`.
- Sicherungen eingerichtet, aber nie zurückgespielt: Eine Sicherung zählt erst, wenn die Probe geklappt hat.
- Nach Updates automatisch neu starten: nur, wenn danach alles von selbst wieder hochkommt.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Umzug ins eigene Haus», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
