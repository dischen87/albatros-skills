---
name: domain
description: 'Verbindet eine eigene Domain (z. B. meinladen.ch) mit dem Albatros-Server. Erklärt Domain und DNS mit dem Bild von Adresse und Telefonbuch, hilft beim Kauf bei einem Registrar, setzt die DNS-Einträge und den TXT-Beweis _albatros und prüft, bis die Seite mit Schloss im Browser erscheint. Nutze den Skill bei «eigene Domain», «meine Adresse», «.ch kaufen», «DNS», «A-Eintrag», «CNAME», «TXT-Eintrag», «Domain zeigt nicht auf meine Seite», «Zertifikat», «https geht nicht».'
---

# Domain: deine Adresse im Telefonbuch

## Das Bild

- **Domain** (`meinladen.ch`): deine Adresse, die sich Menschen merken können.
- **Server**: das Haus, das unter einer Nummer erreichbar ist, die sich niemand merken kann.
- **DNS**: das Telefonbuch des Internets. Es sagt: «meinladen.ch wohnt im Haus mit dieser Nummer.»
- **Registrar**: das Amt, bei dem du die Adresse für ein Jahr mietest.

Deine Seite ist schon unter `{name}.aufwind.sh` erreichbar. Mit einer eigenen Domain bekommt sie eine Adresse, die zu dir gehört. Wenn du später umziehst (Skill `landung`), nimmst du die Adresse mit.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurze Sätze, kein Fachjargon. «Eintrag im Telefonbuch» statt «DNS Record», bis die Person die Wörter in der Oberfläche ihres Registrars sieht. Dann nennst du beide.

## Ablauf

### 1. Passt das Abo?

Eigene Domains gibt es ab der Stufe Pilot. Prüf mit `konto_status`. Fehlt die Stufe, erklär den Unterschied und hol mit `upgrade_link` den Link. Nichts aufdrängen.

### 2. Adresse aussuchen und mieten

- Kurz, leicht zu buchstabieren, keine Bindestriche, wenn es sich vermeiden lässt. `.ch` für ein Publikum in der Schweiz.
- Keine fremden Marken im Namen. Das gibt Ärger.
- Gemietet wird bei einem Registrar nach Wahl der Person. Das Konto, das Passwort und die Zahlung macht sie dort selbst, im Browser. Du hilfst beim Vergleichen, aber du kaufst nichts.

### 3. Albatros sagen, welche Adresse es ist

Ruf `domain_verbinden` mit der Domain auf. Das Werkzeug antwortet mit genau den Einträgen, die ins Telefonbuch müssen:

- einem **TXT-Eintrag** `_albatros.<domain>` mit einem Code. Das ist der Beweis, dass die Adresse dir gehört, wie ein Brief, den nur der Mieter am Briefkasten findet.
- einem Eintrag, der auf den Server zeigt: für `www.<domain>` meist ein **CNAME** auf `{name}.aufwind.sh` («wohnt bei»), für die Adresse ohne `www` ein **A**- und ein **AAAA**-Eintrag mit den Nummern aus der Antwort.

Nimm immer die Werte aus der Antwort von `domain_verbinden`, nie Werte aus dem Gedächtnis. Zeig sie als Tabelle mit den Spalten Typ, Name, Wert und **Bedeutung**, damit kein Kürzel unerklärt bleibt: TXT = Zettel mit dem Beweis, CNAME = «wohnt bei», A = Hausnummer, AAAA = neue, längere Hausnummer.

### 4. Einträge beim Registrar setzen

Die Person öffnet beim Registrar die DNS-Verwaltung (oft «DNS», «Zone» oder «Nameserver-Einträge»). Führ sie Feld für Feld: Typ, Name, Wert. Typische Stolperstelle: Manche Registrare hängen die Domain selbst an. Dann heisst das Feld «Name» nur `_albatros` statt `_albatros.meinladen.ch`.

### 5. Warten und prüfen

Das Telefonbuch wird nicht sofort überall nachgedruckt. Das dauert Minuten, selten Stunden. Prüf mit:

```bash
dig +short TXT _albatros.meinladen.ch
dig +short meinladen.ch
dig +short www.meinladen.ch
```

Stimmen die Antworten mit den Werten aus Schritt 3 überein, ruf `domain_verbinden` nochmals auf. Albatros prüft den Beweis und holt danach automatisch das Zertifikat (das Schloss-Symbol im Browser). Ohne Prüfung gibt es kein Zertifikat.

### 6. Mission prüfen

Öffne `https://<domain>` mit der Person. Dann `mission_pruefen` mit `flugschule-09-domain`.

## Wenn es hakt

- **`dig` zeigt nichts:** Tippfehler im Namen oder noch nicht nachgedruckt. Zehn Minuten warten, dann nochmals.
- **Alte Einträge stören:** Viele Registrare legen eine Parkseite an. Diese A-Einträge muss die Person löschen, sonst zeigt die Adresse auf zwei Häuser.
- **E-Mail über die Domain:** MX-Einträge für E-Mail nie anfassen oder löschen. Sie sind ein anderes Telefonbuch-Kapitel.
- **Browser warnt «nicht sicher»:** Das Zertifikat fehlt noch. Meist ist der TXT-Beweis noch nicht sichtbar. Zurück zu Schritt 5.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «deine Adresse im Telefonbuch», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
