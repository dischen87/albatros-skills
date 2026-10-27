---
name: recht-ch
description: 'Bringt eine kleine Schweizer Webseite rechtlich in Ordnung, erklärt für Menschen ohne Vorwissen mit dem Bild von Klingelschild und Hausordnung: Impressum (UWG Art. 3 Abs. 1 lit. s), Datenschutzerklärung nach revDSG (Informationspflicht Art. 19), Cookies (Art. 45c FMG), wann die DSGVO der EU dazukommt, Bildrechte, Werbemails nur mit Einwilligung. Keine Rechtsberatung. Nutze den Skill bei «Impressum», «Datenschutz», «Datenschutzerklärung», «DSG», «DSGVO», «Cookie-Banner», «brauche ich das rechtlich», «was muss auf meine Webseite», «Kontaktformular Datenschutz».'
---

# Recht CH: Klingelschild und Hausordnung

## Das Bild

- **Impressum = Klingelschild:** Wer wohnt hier, und wie erreicht man die Person?
- **Datenschutzerklärung = Hausordnung für Besucher:** Was passiert mit dem, was Besucher dir geben oder hinterlassen (Name im Formular, Spuren in der Statistik)?
- **Cookies = kleine Zettel, die du Besuchern in die Tasche steckst**, damit du sie wiedererkennst. Darüber musst du informieren.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, einfach, aber präzise: Gesetz und Artikel nennen.
- Immer dazusagen: «Das ist keine Rechtsberatung. Bei Unsicherheit, bei heiklen Daten (Gesundheit, Kinder) oder viel Umsatz lohnt sich eine Fachperson.»
- Keine Vorlage aus dem Netz blind kopieren. Jeder Satz muss zur Seite passen. Eine Erklärung, die Dienste nennt, die es gar nicht gibt, oder echte vergisst, ist falsch.

## Ablauf

### 1. Bestandsaufnahme

Frag und schreib mit:

- Wer betreibt die Seite (Privatperson, Verein, Einzelfirma, GmbH)? Verkauft sie etwas online?
- Welche Daten kommen herein? Kontaktformular, Newsletter, Bestellung, Konto, Statistik (Skill `statistik`), eingebettete Karten oder Videos, Schriften von fremden Servern.
- Wo laufen die Dienste? Albatros-Server (Deutschland/Finnland, EU), PostHog (EU), Mailversand, Zahlungsanbieter (oft USA).
- Richtet sich die Seite auch an Menschen in der EU (Lieferung, Preise in Euro, Sprache)?

### 2. Impressum (`/impressum`)

Pflicht für alle, die online Waren, Werke oder Leistungen anbieten (UWG Art. 3 Abs. 1 lit. s): klare und vollständige Angaben zur Identität und Kontaktadresse, inklusive E-Mail. Auch ohne Pflicht empfehlenswert.

- Name oder Firma (wie im Handelsregister), Rechtsform
- Postadresse (kein Postfach allein)
- E-Mail-Adresse
- falls vorhanden: UID-Nummer, Handelsregister-Eintrag, verantwortliche Person

### 3. Datenschutzerklärung (`/datenschutz`)

Das revidierte Datenschutzgesetz (revDSG, seit 1. September 2023) verlangt, dass du informierst, wenn du Personendaten beschaffst (Art. 19). Das passiert schon bei einem Kontaktformular oder einer Statistik mit IP-Adressen. Inhalt:

1. Wer verantwortlich ist, mit Kontakt
2. Welche Daten, wofür (pro Zweck: Kontakt, Newsletter, Bestellung, Statistik)
3. An wen sie gehen (Hosting, Statistik, Mailversand, Zahlung), mit Land. Bei Ländern ohne angemessenen Datenschutz: welche Garantien gelten
4. Wie lange sie bleiben
5. Rechte der Besucher: Auskunft (Art. 25), Berichtigung, Löschung, und wie man sie ausübt
6. Datum der letzten Änderung

Richtet sich die Seite auch an Menschen in der EU, kann zusätzlich die DSGVO gelten (Art. 3 Abs. 2 DSGVO). Dann zusätzlich die Rechtsgrundlage pro Zweck nennen.

### 4. Cookies und Statistik

- Schweiz: Wer Cookies setzt, muss über die Bearbeitung und ihren Zweck informieren und sagen, wie man sie ablehnen kann (Art. 45c FMG). Ein Hinweis in der Datenschutzerklärung reicht dafür meist.
- EU-Publikum: Für Cookies, die nicht nötig sind (Statistik, Werbung), braucht es vorher eine Einwilligung. Dann ein Banner mit gleichwertigem «Ablehnen».
- Am einfachsten: keine unnötigen Cookies. Die Statistik aus dem Skill `statistik` läuft ohne Cookies. Schriften lokal einbinden statt von fremden Servern.

### 5. Werbemails

Werbung per E-Mail nur mit vorheriger Einwilligung (UWG Art. 3 Abs. 1 lit. o). Ausnahme: eigene Kundschaft, die beim Kauf auf die Ablehnungsmöglichkeit hingewiesen wurde, für eigene ähnliche Angebote. In jeder Mail: richtiger Absender und ein einfacher, kostenloser Abmeldelink. Newsletter-Anmeldung mit Bestätigungsmail (Double-Opt-in), damit die Einwilligung belegt ist.

### 6. Bilder und Texte

Nur eigene oder lizenzierte Bilder. Erkennbare Personen nur mit Einverständnis. Siehe Skill `inhalte`.

### 7. Seiten bauen und verlinken

Impressum und Datenschutz als eigene Seiten, von jeder Seite im Fuss erreichbar. Logbuch und Fliessband (Skills `git-logbuch`, `pipeline`). In `docs/plan.md` notieren: «Datenschutzerklärung prüfen, wenn ein neuer Dienst dazukommt.»

## Mission prüfen

`mission_pruefen` mit `webseite-06-recht-ch`. Die Prüfung schaut, ob `https://{name}.aufwind.sh/impressum` und `/datenschutz` antworten.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «Klingelschild und Hausordnung», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
