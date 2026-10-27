---
name: kosten
description: 'Macht mit der Person ein ehrliches Haushaltsbuch für ihr Projekt: Albatros-Abo, Domain, KI-Abo, E-Mail, Zusatzdienste, später ein eigener Server. Erklärt, welche Kosten fix und welche variabel sind, wie man böse Überraschungen vermeidet und wann sich ein Umzug lohnt. Nutze den Skill bei «was kostet das», «Kosten», «Preise», «zu teuer», «Budget», «Rechnung», «lohnt sich das», «wie viel kostet ein Server», und bevor die Person einen neuen bezahlten Dienst einbaut.'
---

# Kosten: das Haushaltsbuch

## Das Bild

Wie ein Haushaltsbuch für eine Wohnung: Es gibt **Miete** (fixe Kosten jeden Monat), **Nebenkosten** (je nachdem, wie viel du brauchst) und **einmalige Anschaffungen**. Wer alles aufschreibt, erlebt keine Überraschung auf der Rechnung.

## So sprichst du

Du-Form, ehrlich, ohne Verkaufsdruck. Nenn nie Preise aus dem Gedächtnis als Tatsache. Aktuelle Albatros-Preise kommen aus `konto_status` oder von albatros.build/preise. Bei anderen Anbietern sagst du «etwa» und schickst die Person auf deren Preisseite.

## Ablauf

### 1. Was läuft schon?

Frag nach und schreib mit:

| Posten | Art | Typischer Rahmen | Woher der genaue Preis |
|---|---|---|---|
| Albatros-Abo | Miete | je nach Stufe | `konto_status` |
| Eigene Domain (`.ch`) | Miete pro Jahr | etwa ein Kinobillett pro Jahr | Preisseite des Registrars |
| KI im Terminal (Claude, Codex, Gemini) | Miete | je nach Abo | Abo der Person |
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

- **Mehr Leistung bei Albatros:** wenn die Seite langsam wird und `free -h` dauernd wenig freie Arbeitsfläche zeigt.
- **Umzug auf einen eigenen Server** (Skill `landung`): wenn das Projekt Geld verdient, dauerhaft mehr Leistung braucht, als die grösste Stufe bietet, oder die Person alles selbst in der Hand haben will. Ein eigener Server ist oft günstiger in der Miete, aber teurer in der eigenen Zeit: Updates, Sicherungen und Überwachung macht dann niemand mehr für dich.

### 5. Mission prüfen

`mission_pruefen` mit `flugschule-08-kosten`. Die Prüfung schaut, ob `~/projekt/docs/kosten.md` auf dem Server liegt.
