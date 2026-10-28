---
name: domain
description: 'Findet, kauft oder verbindet eine eigene Domain (z. B. meinladen.ch) für den Albatros-Server. Erklärt Domain und DNS mit dem Bild von Adresse und Telefonbuch, schlägt Namen vor, sucht mit domain_suchen, was frei ist, und kauft über Albatros mit domain_kaufen (die Person ist Inhaberin, ihre Angaben gibt sie nur auf der Zahlungsseite ein). Eine Domain, die die Person schon hat, verbindet der Skill mit domain_verbinden: DNS-Einträge, TXT-Beweis _albatros und Prüfung, bis die Seite mit Schloss im Browser erscheint. Nutze den Skill bei «eigene Domain», «meine Adresse», «.ch kaufen», «welche Domain ist frei», «Domain suchen», «DNS», «A-Eintrag», «CNAME», «TXT-Eintrag», «Domain zeigt nicht auf meine Seite», «Zertifikat», «https geht nicht».'
---

# Domain: deine Adresse im Telefonbuch

## Das Bild

- **Domain** (`meinladen.ch`): deine Adresse, die sich Menschen merken können.
- **Server**: das Haus, das unter einer Nummer erreichbar ist, die sich niemand merken kann.
- **DNS**: das Telefonbuch des Internets. Es sagt: «meinladen.ch wohnt im Haus mit dieser Nummer.»
- **Registrar**: das Amt, bei dem du die Adresse für ein Jahr mietest. Albatros kann das für dich erledigen. Als Inhaberin oder Inhaber eingetragen bist trotzdem du.

Deine Seite ist schon unter `{name}.aufwind.sh` erreichbar. Mit einer eigenen Domain bekommt sie eine Adresse, die zu dir gehört. Wenn du später umziehst (Skill `landung`), nimmst du die Adresse mit.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kurze Sätze, kein Fachjargon. «Eintrag im Telefonbuch» statt «DNS Record», bis die Person die Wörter in der Oberfläche ihres Registrars sieht. Dann nennst du beide.
- Name, Adresse, Telefon und Zahlungsangaben gibt die Person nur auf der Zahlungsseite ein, nie im Chat.

## Ablauf

### 1. Passt das Abo?

Eigene Domains gibt es nur mit Pilot, nicht mit Gratis oder Light. Prüf mit `konto_status`. Fehlt Pilot, erklär den Unterschied und hol mit `upgrade_link` (Stufe `pilot`) den Link. Nichts aufdrängen. Suchen geht mit jedem Abo.

### 2. Hat die Person schon eine Adresse?

- **Nein:** weiter mit Schritt 3, sie findet und kauft eine über Albatros.
- **Ja, anderswo gekauft:** weiter mit Schritt 4.
- **Ja, über Albatros gekauft:** `konto_status` zeigt sie unter «Eigene Domains» mit ihrem Stand. Ist sie aktiv, weiter mit Schritt 7.

### 3. Eine Adresse finden und kaufen

1. **Selbst Namen vorschlagen:** drei bis fünf Ideen passend zum Projekt, bevor du suchst. Kurz, leicht zu buchstabieren, keine Bindestriche, wenn es sich vermeiden lässt. Eine Ortschaft im Namen hilft, wenn das Wort allein vergeben ist. `.ch` für ein Publikum in der Schweiz. Keine fremden Marken im Namen, das gibt Ärger.
2. **Suchen:** `domain_suchen` mit bis zu fünf Wünschen, als Wörter oder ganze Domains (`veloladen-thun`, `annas-laden.ch`). Albatros ergänzt die Endungen `.ch`, `.com`, `.net`, `.shop` und `.li` sowie Varianten und nennt nur, was wirklich frei ist, mit Preis pro Jahr. Gib Treffer und Preise genau so weiter. Ob eine Adresse frei ist und was sie kostet, rätst du nie. Ist nichts frei: andere Wörter, eine Ortschaft dazu oder eine kürzere Form, dann nochmals suchen.
3. **Sagen, wie der Kauf läuft,** gleich mit den Treffern:
   - Die Person ist von Anfang an selbst Inhaberin oder Inhaber, nicht Albatros. Ihre Rechte als Inhaberin stehen bei der ICANN, der Stelle, die die Regeln für Domains macht. Schreib den Link immer aus (Seite auf Englisch): https://www.icann.org/resources/pages/benefits-2013-09-16-en
   - Name, Adresse und Telefon trägt sie selbst auf der Zahlungsseite ein, nie im Chat. Die Angaben müssen stimmen, denn wer eingetragen ist, dem gehört die Adresse.
   - Der Preis gilt pro Jahr und gleich auch für die Verlängerung. Albatros verlängert jedes Jahr, solange das Abo der Domain läuft.
4. **Kaufen:** Hat sich die Person für eine Adresse entschieden, rufst du `domain_kaufen` mit genau dieser auf und gibst den Link weiter. Bezahlen und Angaben macht sie selbst auf der Zahlungsseite.
5. **Danach:** Beim Registrar ist nichts einzutragen. Albatros registriert die Adresse, setzt die Einträge im Telefonbuch und holt das Zertifikat, meist in 5 bis 30 Minuten. Den Stand zeigt `konto_status`. Weiter mit Schritt 7.

### 4. Eine vorhandene Adresse anmelden

Ruf `domain_verbinden` mit der Domain auf. Das Werkzeug antwortet mit genau den Einträgen, die ins Telefonbuch müssen:

- einem **TXT-Eintrag** `_albatros.<domain>` mit einem Code. Das ist der Beweis, dass die Adresse dir gehört, wie ein Brief, den nur der Mieter am Briefkasten findet.
- einem Eintrag, der auf den Server zeigt: für `www.<domain>` meist ein **CNAME** auf `{name}.aufwind.sh` («wohnt bei»), für die Adresse ohne `www` ein **A**- und ein **AAAA**-Eintrag mit den Nummern aus der Antwort.

Nimm immer die Werte aus der Antwort von `domain_verbinden`, nie Werte aus dem Gedächtnis. Zeig sie als Tabelle mit den Spalten Typ, Name, Wert und **Bedeutung**, damit kein Kürzel unerklärt bleibt: TXT = Zettel mit dem Beweis, CNAME = «wohnt bei», A = Hausnummer, AAAA = neue, längere Hausnummer.

### 5. Einträge beim Registrar setzen

Die Person öffnet beim Registrar die DNS-Verwaltung (oft «DNS», «Zone» oder «Nameserver-Einträge»). Führ sie Feld für Feld: Typ, Name, Wert. Typische Stolperstelle: Manche Registrare hängen die Domain selbst an. Dann heisst das Feld «Name» nur `_albatros` statt `_albatros.meinladen.ch`.

### 6. Warten und prüfen

Das Telefonbuch wird nicht sofort überall nachgedruckt. Das dauert Minuten, selten Stunden. Prüf mit:

```bash
dig +short TXT _albatros.meinladen.ch
dig +short meinladen.ch
dig +short www.meinladen.ch
```

Stimmen die Antworten mit den Werten aus Schritt 4 überein, ruf `domain_verbinden` nochmals auf. Albatros prüft den Beweis und holt danach automatisch das Zertifikat (das Schloss-Symbol im Browser). Ohne Prüfung gibt es kein Zertifikat.

### 7. Mission prüfen

Öffne `https://<domain>` mit der Person. Dann `mission_pruefen` mit `flugschule-09-domain`.

## Wenn es hakt

- **Gekauft, aber nach einer Stunde noch nicht aktiv:** `konto_status` zeigt den Stand und einen Hinweis. Steht dort, dass etwas nicht geklappt hat, meldet sich das Team. Sonst `coach_fragen`.
- **`dig` zeigt nichts:** Tippfehler im Namen oder noch nicht nachgedruckt. Zehn Minuten warten, dann nochmals.
- **Alte Einträge stören:** Viele Registrare legen eine Parkseite an. Diese A-Einträge muss die Person löschen, sonst zeigt die Adresse auf zwei Häuser.
- **E-Mail über die Domain:** MX-Einträge für E-Mail nie anfassen oder löschen. Sie sind ein anderes Telefonbuch-Kapitel.
- **Browser warnt «nicht sicher»:** Das Zertifikat fehlt noch. Meist ist der TXT-Beweis noch nicht sichtbar. Zurück zu Schritt 6.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «deine Adresse im Telefonbuch», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
