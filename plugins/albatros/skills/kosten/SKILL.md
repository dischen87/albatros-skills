---
name: kosten
description: 'Macht mit der Person ein ehrliches Haushaltsbuch für ihr Projekt: Albatros-Abo, Domain, KI-Abo, E-Mail, Zusatzdienste, später ein eigener Server. Erklärt, welche Kosten fix und welche variabel sind, wie man böse Überraschungen vermeidet und wann sich ein Umzug lohnt. Nutze den Skill bei «was kostet das», «Kosten», «Preise», «zu teuer», «Budget», «Rechnung», «lohnt sich das», «wie viel kostet ein Server», und bevor die Person einen neuen bezahlten Dienst einbaut.'
---

# Kosten: das Haushaltsbuch

## Das Bild

Wie ein Haushaltsbuch für eine Wohnung: Es gibt **Miete** (fixe Kosten jeden Monat), **Nebenkosten** (je nachdem, wie viel du brauchst) und **einmalige Anschaffungen**. Wer alles aufschreibt, erlebt keine Überraschung auf der Rechnung.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, ehrlich, ohne Verkaufsdruck. Nenn nie Preise aus dem Gedächtnis als Tatsache. Aktuelle Albatros-Preise kommen aus `konto_status` oder von albatros.build/preise. Bei anderen Anbietern sagst du «etwa» und schickst die Person auf deren Preisseite.

## Ablauf

### 1. Was läuft schon?

Frag nach und schreib mit:

| Posten | Art | Typischer Rahmen | Woher der genaue Preis |
|---|---|---|---|
| Albatros-Abo | Miete | je nach Stufe | `konto_status` |
| Eigene Domain (`.ch`) | Miete pro Jahr | etwa ein Kinobillett pro Jahr | `domain_suchen` oder Preisseite des Registrars |
| KI im Terminal (Claude Code, Codex, Gemini CLI) | Miete | ab etwa 20 USD im Monat: Claude Pro, ChatGPT Plus oder für Gemini CLI Google AI Pro; ein Gratis-Konto reicht nicht oder nur für ein paar Versuche | Preisseite des Anbieters; bezahlt wird dort, nicht bei Albatros |
| E-Mail mit eigener Domain | Miete | klein | Anbieter |
| Statistik (z. B. PostHog) | Nebenkosten | meist gratis bis zu einer Grenze | Preisseite |
| Versand von E-Mails (Newsletter) | Nebenkosten | gratis bis zu einer Grenze, dann pro Mail | Preisseite |
| Bezahlte Werbung | Nebenkosten | du bestimmst | Werbekonto |

### 2. Fallen finden

- **Nebenkosten ohne Deckel:** Bei allem, was pro Nutzung kostet (KI-Schnittstellen, Mailversand, Werbung), ein Monatslimit setzen. Die meisten Anbieter haben dafür eine Einstellung. Die Person setzt sie selbst.
- **Gratis-Phasen:** Datum aufschreiben, wann sie endet.
- **Jahresabos:** Kündigungsfrist notieren.
- **Doppelt bezahlt:** zwei Dienste, die das Gleiche tun.

### 3. Haushaltsbuch ins Projekt

Schreib die Tabelle mit der Person in `docs/kosten.md` in ihrem Projekt, mit Monatssumme, Jahressumme und einer Zeile «Nächste Überprüfung: <Datum in drei Monaten>». Dann ins Logbuch (Skill `git-logbuch`) und über das Fliessband auf den Server.

### 4. Wann lohnt sich mehr Leistung oder ein Umzug?

- **Von Light zu Pilot:** sobald auf der Seite ein Programm laufen soll (Datenbank, Anmeldung, eigenes CMS) oder eine eigene Domain dazukommt.
- **Mehr Leistung bei Albatros:** wenn die Seite langsam wird und `free -h` dauernd wenig freie Arbeitsfläche zeigt.
- **Umzug auf einen eigenen Server** (Skill `landung`): wenn das Projekt Geld verdient, dauerhaft mehr Leistung braucht, als die grösste Stufe bietet, oder die Person alles selbst in der Hand haben will. Ein eigener Server ist oft günstiger in der Miete, aber teurer in der eigenen Zeit: Updates, Sicherungen und Überwachung macht dann niemand mehr für dich.

### 5. Mission prüfen

`mission_pruefen` mit `flugschule-08-kosten`. Die Prüfung schaut, ob `docs/kosten.md` im Projekt liegt (mit Pilot in `~/projekt` auf dem Server, mit Light im Hafen).

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «das Haushaltsbuch», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
