---
name: betrieb
description: 'Bereitet mit einer Person ohne Vorwissen den Betrieb ihrer Seite vor, bevor die Gäste kommen (P12): wie Besucher sich melden und wer es wie oft liest, wer erfährt, wenn die Seite nicht antwortet (eine einfache, kostenlose Überwachung), wie es auf gestern zurückgeht (Fotos des Servers mit Pilot, das Logbuch mit Light, eine eigene Sicherung bei selbst), ob ein Eingang mit Anmeldung nötig ist (nur mit eigenem Server, Skill bausteine) und ob gezählt wird, wer kommt (Skill statistik, mit Einwilligung, wo es sie braucht). Ergebnis ist docs/betrieb.md. Mit Pilot auf Wunsch Berts Arbeitsplatz online auf dem eigenen Server (Autopilot und Zeitplan rund um die Uhr, nur Mitglieder des Projekts). Nutze den Skill nach dem Wohnort (lancieren) und bei «Betrieb», «Überwachung», «Sicherung», «Backup», «Rückmeldungen», «wer liest das Formular», «was, wenn die Seite ausfällt», «Arbeitsplatz online», «Arbeitsplatz auf meinen Server», «Autopilot in der Nacht».'
metadata:
  stand: 0.2.0
---

# Betrieb: bevor die Gäste kommen

## Das Bild

Bevor die ersten Gäste kommen, hängt der Briefkasten, und jemand leert ihn. Der Rauchmelder piepst, wenn es brennt, und es ist klar, wer ihn hört. Es gibt einen Plan, wie das Haus wieder so wird wie gestern, wenn etwas kaputtgeht. Gibt es Zimmer nur für Bewohner, steht am Eingang ein Pförtner. Und an der Ladentür hängt vielleicht eine Strichliste. Für die Seite heisst das: Rückmeldungen, Überwachung, Sicherung, Eingang und Statistik.

**So setzt du das Bild ein:** In deiner ersten Antwort ein Satz zum Bild. Bei jedem Punkt ein Satz mit seinem Teil des Bilds.

## So sprichst du

- Du-Form, ruhig, konkret. Jede Antwort wird eine Zeile in `docs/betrieb.md`.
- Rückmeldungen, Eingang und Statistik entscheidet die Person selbst, auch im Modus `machen`. Die Überwachung schlägst du vor und trägst sie als `[Annahme: …]` ein. Die Sicherung klärst du selbst und zeigst sie. Höchstens zwei Fragen in einer Nachricht.
- Preise und Bedingungen fremder Dienste nennst du nur von deren Preisseite. Konten bei fremden Diensten legt die Person selbst an.
- Was gilt, hängt vom Wohnort ab (`docs/lancieren.md`, Zeile `Wohnort:`): Albatros Light, Albatros Pilot oder selbst.
- Nichts davon bringt die Seite ins Netz. Das kommt danach beim Live schalten (Skill `lancieren`, Teil 2).

## Ablauf

### 1. Wo wohnt die Seite?

Lies `docs/lancieren.md`. Fehlt die Datei oder die Zeile `Wohnort:`, kommt zuerst der Wohnort (Skill `lancieren`, Teil 1).

### 2. Rückmeldungen: der Briefkasten

Frag: «Wie melden sich Besucher bei dir, und wer liest es wie oft?» Warum: Eine Rückmeldung, die niemand liest, ist schlimmer als keine.

- Der Weg steht meist schon im PRD (`docs/prd.md`): ein Link zum Mailen, ein Formular, eine Telefonnummer oder ein Baustein wie die Anmeldeliste. Klär, an welche Adresse es geht und wer dort liest, wie oft, und wer es in den Ferien tut.
- Eine Testnachricht schickt die Person nach dem Live schalten selbst ab, über die Seite im Netz, und schaut, ob sie ankommt (Skill `lancieren`, Teil 2).

Beispiel: `Rückmeldungen: Formular auf /kontakt an anna@example.ch, liest Anna montags und donnerstags, in den Ferien Beat`

### 3. Überwachung: der Rauchmelder

Frag: «Wer erfährt es, wenn die Seite nicht antwortet?» Warum: Besser du merkst es als deine Kundschaft.

- **Was Albatros tut:** Albatros überwacht die eigene Plattform und behebt Ausfälle dort. Eine Nachricht an die Person, wenn ihre Seite nicht antwortet, verschickt Albatros nicht. Bei «selbst» gibt es nur, was der Anbieter bietet.
- **Die einfache Lösung, kostenlos:** ein Prüfdienst im Netz, der die Adresse aus `docs/lancieren.md` alle paar Minuten aufruft und eine Mail schickt, wenn sie nicht antwortet, zum Beispiel UptimeRobot oder Better Stack (Bedingungen auf der Preisseite). Die Person legt das Konto selbst an; du sagst ihr, was sie wo eingibt: die Adresse, und als Empfänger die Person, die auch die Rückmeldungen liest. Einrichten kann sie ihn jetzt (die Adresse antwortet schon mit der Vorlage) oder gleich nach dem Live schalten.
- **Mit eigenem Server** geht auch ein Wächter wie Uptime Kuma, aber nie auf demselben Server: Fällt der aus, schweigt auch der Wächter.
- Will die Person keine Überwachung, steht das so in der Zeile, mit ihrem Grund.

Beispiel: `Überwachung: [Annahme: UptimeRobot (gratis) prüft https://anna.aufwind.sh alle 5 Minuten, Mail an anna@example.ch]`. Nach ihrem Ja streichst du `[Annahme: …]`.

### 4. Sicherung: zurück auf gestern

Das klärst du selbst und zeigst es der Person: «Wie kommst du auf gestern zurück?»

- **Albatros Light:** Das Logbuch ist die Sicherung. Jeder Stand liegt im Hafen und auf dem Computer. Zurück geht es mit `git revert` und einem Push (Skill `zurueck-auf-gestern`, Absatz zu Light). Fotos eines Servers gibt es nicht, weil es keinen Server gibt.
- **Albatros Pilot:** Jede Nacht ein Foto des ganzen Servers (sieben Tage), dazu ein eigenes Foto vor jedem grossen Umbau (Werkzeug `snapshot`). Zurück geht es mit `zurueck` (Skill `zurueck-auf-gestern`). Das Logbuch im Hafen bleibt dabei die Kopie ausserhalb der Wohnung.
- **Selbst, ohne Server:** Das Logbuch auf dem Computer braucht eine zweite Kopie ausserhalb des Computers, zum Beispiel ein privates Repo bei GitHub. Die Anbieter für statische Seiten behalten meist frühere Auslieferungen, die man wieder einschalten kann: Zeig der Person, wo das in der Oberfläche ihres Anbieters geht.
- **Selbst, mit Server:** eine eigene Sicherung, nachts, ausser Haus, verschlüsselt, mit einer Probe jeden Monat (Skill `landung`, Umzugsliste «Was ich selbst übernehme»). Eine Sicherung zählt erst, wenn das Zurückspielen einmal geklappt hat.

**Lernmoment «Zurück auf gestern»:** Im Modus `lernen` probiert die Person es einmal selbst aus. Mit Light oder bei «selbst»: eine kleine Änderung eintragen und mit `git revert HEAD` zurücknehmen. Mit Pilot: die Übung im Skill `zurueck-auf-gestern` (Mission `flugschule-06-zurueck-auf-gestern`), an der Vorlage, die gerade online ist. Danach `verstanden_melden` (Mission `flugschule-17-betrieb`, Art `selbst`). Im Modus `machen` bietest du es an.

Beispiel: `Sicherung: Logbuch im Hafen und auf diesem Computer, zurück mit git revert (ausprobiert am 31.10.2026)`

### 5. Eingang: der Pförtner

Frag: «Gibt es mehrere Teile, die wissen müssen, wer angemeldet ist?» Warum: Dann prüft ein Eingang an einer Stelle, wer was darf.

- **Keine Anmeldung auf der Seite** (Tabelle «Zugang» in `docs/prd.md` hat nur «alle Besucher»): `Eingang: nicht nötig (keine Anmeldung)`.
- **Mit Anmeldung:** Ein Eingang kommt nur, wenn die Kriterien im Skill `bausteine`, Abschnitt «Ein Eingang für alles?», erfüllt sind, und nur mit eigenem Server (Pilot, oder selbst mit Server). Sonst reicht die Anmeldung des Bausteins selbst. So oder so bleiben die Türen aus `docs/tueren.txt` ohne Anmeldung zu (`node scripts/pruefen.mjs --tueren`).

Die Zeile beginnt immer mit `ja` oder `nicht nötig`, danach kommt der Grund: `lancieren` und `bausteine` bauen den Eingang nur bei `Eingang: ja` ein.

Beispiele: `Eingang: ja, /intern/ und die Mitteilungen aus PocketBase brauchen dieselbe Anmeldung (Kriterien im Skill bausteine erfüllt)` oder `Eingang: nicht nötig, nur die Anmeldeliste mit eigener Anmeldung (Kriterien im Skill bausteine nicht erfüllt)`

### 6. Statistik: die Strichliste

Frag: «Willst du zählen, wer kommt?» Warum: Ohne Zahlen bleibt das Erfolgsmass aus `docs/projekt.md` (Zeile `Erfolg:`) eine Vermutung.

- Wie es geht, steht im Skill `statistik`: zuerst ein kleiner Plan, was gezählt wird, dann der Einbau ohne Cookies. So braucht es in der Schweiz kein Banner. Zählt die Seite mit Cookies oder richtet sie sich an Menschen in der EU, braucht es vorher die Einwilligung der Besucher (Skill `recht-ch`, «Cookies und Statistik»), und die Datenschutzerklärung nennt die Statistik.
- Eingebaut wird sie beim Live schalten oder gleich danach (Mission `webseite-08-statistik`, freiwillig).

Beispiel: `Statistik: ja, ohne Cookies, Ziel «Anfrage gesendet», Einbau nach dem Live schalten (Skill statistik)` oder `Statistik: nein, die Anfragen im Postfach reichen`

### 7. `docs/betrieb.md`

```markdown
# Betrieb

Rückmeldungen: …
Überwachung: …
Sicherung: …
Eingang: …
Statistik: …
Stand: <Datum>
```

Hat jede Zeile eine Antwort, machst du den Eintrag ins Logbuch (`git add docs/betrieb.md && git commit -m "Betrieb: Briefkasten, Rauchmelder, Sicherung"`) und meldest `schritt_melden` mit `betrieb` und `sprache`. Fehlt das Werkzeug oder kennt es den Schritt nicht, geht es ohne Insel weiter. Im Modus `lernen` stellst du jetzt die Kontrollfragen der Lektion `flugschule-17-betrieb`, höchstens zwei in einer Nachricht (andere Fragen mitgezählt): zuerst «Warum ist eine Rückmeldung, die niemand liest, schlimmer als keine?» und «Wie kommst du auf gestern zurück?», nach der Antwort der Person «Wer soll es zuerst merken, wenn deine Seite nicht antwortet?» `verstanden_melden` (Art `kontrollfrage`) meldest du erst nach ihren Antworten.

Danach kommt das Live schalten: Skill `lancieren`, Teil 2.

## Arbeitsplatz online (freiwillig, nur mit Pilot)

Der Arbeitsplatz auf dem Computer schläft, wenn der Computer zu ist. Mit Pilot kann ein zweiter Arbeitsplatz auf dem eigenen Server wohnen, wie ein Büro, das nachts offen bleibt: Dort arbeitet die KI nach Zeitplan und sobald eine Mail oder ein Verkauf hereinkommt. Hinein kommen nur Mitglieder des Projekts, angemeldet mit Albatros. Das bietest du nur an, wenn die Person danach fragt oder `docs/betrieb.md` fertig ist; es ist kein Schritt des Fahrplans.

**Was online geht (Stand 07.11.2026), das sagst du zuerst:**
- Online arbeitet nur Claude Code, und nur lesend («Zuerst fragen»): Die KI liest, schlägt vor, legt Entwürfe und Fragen an. Dateien ändern und Befehle ausführen geht online noch nicht, weil der Schutzraum (Sandkasten) für die KI auf dem Server noch nicht gemessen ist. Ändern macht die Person mit ihrer KI auf dem Computer.
- Die KI starten kann nur die Inhaberin: Sie arbeitet mit ihrem eigenen Claude-Abo, und das darf nach den Bedingungen von Anthropic niemand sonst nutzen. Mitglieder sehen alles; wer «nur lesen» hat, liest nur.
- Codex und Gemini CLI richtest du online nicht ein. Bei OpenAI ist offen, ob ein Programm wie der Arbeitsplatz Codex mit einem ChatGPT-Abo auf einem Server starten darf; die Anmeldung mit Google gibt es für Gemini CLI seit dem 18.06.2026 nicht mehr. Fragt die Person danach, sag ihr genau das.

**Darf das Claude-Abo das?** Frag zuerst: «Ist dein Projekt geschäftlich, verkaufst du etwas oder wirbst du für eine Firma?» Warum: Davon hängt ab, welches Abo es braucht.
- Anthropic beschreibt den Weg ohne Browser selbst: `claude setup-token` für Skripte und Rechner ohne Browser. Das Konto gehört einer Person und wird nie geteilt.
- Pro und Max gelten in der Schweiz und im EWR nur für nicht geschäftliche Zwecke (Bedingungen für Konsumenten von Anthropic, Abschnitt 11). Für ein geschäftliches Projekt braucht es Claude Team oder Enterprise, dort geht `claude setup-token` auch. Ist das Projekt geschäftlich und hat die Person nur Pro oder Max, hörst du hier auf, sagst warum, und sie arbeitet weiter mit dem Arbeitsplatz auf dem Computer.
- Lies die Bedingungen mit ihr nach, bevor sie sich entscheidet: https://code.claude.com/docs/en/legal-and-compliance und https://www.anthropic.com/legal/consumer-terms

**Einrichten.** Das Token tippt die Person selbst ein; du siehst es nie, und es geht nie über Albatros.
1. Ruf `arbeitsplatz_online` mit `an: true` auf. Die Antwort nennt `ALBATROS_PROJEKT` und `ARBEITSPLATZ_ADRESSE`. Gibt es das Werkzeug nicht oder sagt es «nur mit Pilot», hörst du hier auf: Der Arbeitsplatz online ist bei Albatros noch nicht eingeschaltet oder es fehlt der eigene Server.
2. Die Person erzeugt das Token auf ihrem Computer im Terminal: `claude setup-token`. Sie bestätigt im Browser, das Terminal zeigt das Token (es gilt ein Jahr). Sag ihr: «Kopier es, aber schick es nie in den Chat, auch nicht mir.»
3. Auf dem Server legst du die Einstellungen an, ohne Token, ausserhalb des Projekts (so kommt die Datei nie ins Logbuch, und die KI im Arbeitsplatz liest sie nicht):
   ```bash
   ssh {name}@aufwind.sh 'umask 077 && printf "%s\n" "ARBEITSPLATZ_ADRESSE=<Adresse>" "ALBATROS_PROJEKT=<Projekt>" "ARBEITSPLATZ_KI=claude" > ~/arbeitsplatz.env'
   ```
   Die Person ergänzt das Token selbst: `ssh {name}@aufwind.sh`, dann `nano ~/arbeitsplatz.env`, am Ende die Zeile `CLAUDE_CODE_OAUTH_TOKEN=` mit dem Token, speichern (Ctrl+O, Enter, Ctrl+X), `exit`.
4. Starten: `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz up -d --wait'`. Beim ersten Start holt der Arbeitsplatz Claude Code bei Anthropic (einmal, ein paar Minuten).
5. Die Person öffnet die Adresse im Browser und klickt «Mit Albatros anmelden». In den Einstellungen wählt sie Claude Code, «Zuerst fragen» und die Zeiten des Autopiloten; unter Aufgaben zum Beispiel «Wenn eine Mail kommt: eine Antwort vorschlagen».
6. Prüfen: Die Seite lädt, die Anmeldung klappt, und ein Mitglied mit «nur lesen» sieht alles, kann aber nichts starten.

**Ausschalten:** `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz stop arbeitsplatz'` und `arbeitsplatz_online` mit `an: false`. Danach löscht die Person die Zeile mit dem Token in `~/arbeitsplatz.env`.

In `docs/betrieb.md` kommt dazu die Zeile `Arbeitsplatz online: nein` oder `Arbeitsplatz online: ja, seit <Datum>, Claude Code mit dem Abo der Inhaberin, nur lesend`.

## Stolpersteine

- Ein Formular, dessen Nachrichten niemand liest.
- Den Wächter auf denselben Server stellen, den er bewachen soll.
- «Albatros merkt das schon»: Albatros sieht die Plattform, nicht jede einzelne Seite.
- Eine Sicherung, die nie zurückgespielt wurde: Sie zählt erst nach der Probe.
- Einen Eingang bauen, weil es professionell klingt: nur bei erfüllten Kriterien und mit eigenem Server.
- Statistik mit Cookies ohne Einwilligung, wo es sie braucht.
- Das Token der KI in den Chat, ins Logbuch oder in eine Datei im Projekt schreiben: Es gehört nur in `~/arbeitsplatz.env` auf dem Server, getippt von der Person.
- Den Arbeitsplatz online mit einem Abo betreiben, das dafür nicht gedacht ist (Pro oder Max für ein Geschäft, ein fremdes Konto).

## Mission prüfen

`mission_pruefen` mit `flugschule-17-betrieb`: Die Prüfung schaut auf der Insel, ob das Projekt beim Schritt «Betrieb» steht. Bei Albatros gehört in diese Phase auch `flugschule-07-sicherheit`, mit Pilot `flugschule-06-zurueck-auf-gestern` und freiwillig `webseite-05-cms`.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «bevor die Gäste kommen», der den Kern noch einmal sagt. Danach: was geklärt ist (die fünf Zeilen in `docs/betrieb.md`), was die Person noch selbst einrichtet (zum Beispiel das Konto beim Prüfdienst), und dass als Nächstes das Live schalten kommt.
