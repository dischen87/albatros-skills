# Eingang

Eine Tür für alle Teile einer Seite, wie der Empfang in einem Haus mit mehreren Büros: Wer hinein will, meldet sich einmal an, und jedes Büro erfährt nur, wer kommt (Record-ID) und mit welcher Rolle. Angemeldet ist, wen PocketBase kennt (Rezept `mitglieder`); einen zweiten Login gibt es nicht. Muster: das Gateway von amouk (`services/gateway`), in Pilot-Grösse und ohne Pakete, nur Bun, und ohne internes Geheimnis zu den Teilen (warum: unter «Grenzen»).

**Wann:** nur mit eigenem Server (Pilot). Nicht nötig, solange ein Baustein reicht und die Regeln von PocketBase genügen (Rezept `mitglieder` allein). Nötig, wenn zwei oder mehr Teile wissen müssen, wer angemeldet ist (zum Beispiel geschützte Seiten unter `/intern/` und ein eigenes kleines Programm), oder wenn Rollen über Teile hinweg gelten. Die Kriterien stehen auch im Skill `bausteine`.

| Datei | Wofür |
|---|---|
| `eingang.ts` | der Dienst (Bun, ohne Pakete) |
| `eingang.json` | die Teile: Name, Ziel im internen Netz, Pfade, Zugang |
| `pb_hooks/eingang.pb.js`, `pb_hooks/eingang.js` | Anmelden mit Cookie in PocketBase: `POST /api/eingang/anmelden`, `POST /api/eingang/abmelden`, `GET /api/eingang/pruefen` |
| `pb_migrations/2_eingang.js` | Grenze für das Anmelden: 5 Versuche je Adresse in 60 Sekunden, über den Eingang und über `auth-with-password` |
| `Dockerfile`, `compose.yaml` | Container `eingang` auf Port 80 (Ausschnitt für `include:`) |
| `test.ts` | 52 Prüfungen gegen ein echtes PocketBase und Teile zum Schein (etwa 20 Sekunden): `bun bausteine/eingang/test.ts` |
| `stuecke.test.ts` | grosse Körper in Stücken, ohne PocketBase (läuft mit `bun test`) |
| `messen.ts` | Arbeitsspeicher und Antwortzeiten: `bun bausteine/eingang/messen.ts --anfragen 200000 --smol`; mit gehaltenen Anfragen: `--gehalten 1100 --fetch-plaetze 1024` (wartende dazu: `--je-adresse 120`); Seiten mit vielen Bildern: `--bilder 60 --seiten 20 --fetch-plaetze 1024 --smol`, mit einem Teil, der Bereiche kann: `--bereiche` |

## eingang.json

```json
{
  "ursprung": "https://NAME.aufwind.sh",
  "anmeldeseite": "/mitglieder.html",
  "teile": [
    { "name": "pocketbase", "ziel": "http://pocketbase:8090", "pfade": ["/api/"], "zugang": "offen" },
    { "name": "intern", "ziel": "http://webseite:80", "pfade": ["/intern/"], "zugang": "angemeldet" },
    { "name": "vorstand", "ziel": "http://webseite:80", "pfade": ["/vorstand/"], "zugang": "rolle:vorstand" },
    { "name": "webseite", "ziel": "http://webseite:80", "pfade": ["/"], "zugang": "offen" }
  ]
}
```

- `ursprung`: die Adresse der Seite (`https://NAME.aufwind.sh`). Schreibende Anfragen nimmt der Eingang von der Adresse an, an die sie gehen (Host), und von den Adressen in `ursprung`. Eine eigene Domain, die die Kante an denselben Server leitet, braucht darum keinen Eintrag; eine Liste (`["https://meinverein.ch", "https://NAME.aufwind.sh"]`) braucht es nur für Ausnahmen.
- `teile`: Der längste passende Pfad gewinnt; `/intern/` gilt auch für `/intern`. Genau ein Teil heisst `pocketbase`, mit `/api/` und `offen` (PocketBase prüft seine Sammlungen selbst). `zugang`: `offen`, `angemeldet` (bestätigt und freigegeben) oder `rolle:<name>` (Rollen aus `2_mitteilungen_freigabe.js`). Die Türen aus `docs/tueren.txt` werden zu diesen Teilen.
- `anmeldeseite`: wohin der Weg zur Anmeldung führt, mit `?weiter=<Pfad>` zurück. Sie muss in einem offenen Teil liegen.
- Stimmt etwas nicht (kein Teil `pocketbase`, `NAME` nicht ersetzt, ein Pfad zweimal), startet der Eingang nicht und sagt, was fehlt. Auf dem Server bleibt dann die alte Version online.

## Einbauen

1. PocketBase mit dem Rezept `mitglieder` ist eingebaut (Skill `bausteine`).
2. Holen, im Logbuch des Projekts: `curl -sL https://codeload.github.com/dischen87/albatros-skills/tar.gz/main | tar xz --strip-components=1 albatros-skills-main/bausteine/eingang`
3. `bausteine/eingang/pb_hooks/*` nach `bausteine/pocketbase/pb_hooks/`, `bausteine/eingang/pb_migrations/2_eingang.js` nach `bausteine/pocketbase/pb_migrations/`.
4. In `eingang.json` `ursprung` setzen und die Teile aus `docs/tueren.txt` eintragen. Geschützte Seiten liegen in eigenen Ordnern (`seite/intern/`), damit der Pfad passt.
5. In `mitglieder.html` `const EINGANG = true;` setzen: Die Seite meldet sich dann über den Eingang an (Cookie für alle Teile).
6. In `compose.yaml` unter `include:` die Zeile `- bausteine/eingang/compose.yaml`, und beim Dienst `webseite` die Zeilen `ports:` und `- "80:80"` löschen. Port 80 hat jetzt der Eingang; sonst käme man an ihm vorbei.
7. Lokal prüfen: `bun bausteine/eingang/test.ts` meldet «Alles grün» (eingebaut prüft er die Dateien in `bausteine/pocketbase`). Dann `bun bausteine/pocketbase/lokal.ts --eingang`: Die Seite läuft unter `http://localhost:8080` durch den Eingang, nur auf diesem Computer (`EINGANG_HOST=127.0.0.1`, im selben WLAN sieht sie niemand), und die Person klickt selbst (geschützte Seite ohne Anmeldung, anmelden, abmelden).
8. Erst beim Lancieren ins Logbuch und in den Hafen. Danach von aussen: `/intern/` ohne Anmeldung 401, `/_/` 404, `/api/collections/_SUPERUSERS/auth-methods` 404, die Startseite 200.

## Was er tut

- Entscheidet auf dem Pfad, den `new URL()` aufgelöst hat (`..` und `.` weg), dekodiert einmal. Kodierte Punkte, Schrägstriche und Rückstriche (`%2e`, `%2f`, `%5c`), Nullbytes, `//` und kaputte Kodierung: 400. Der Teil bekommt genau den Pfad, auf dem entschieden wurde.
- Sperrt mit 404: `/_/`, `/admin`, `/api/realtime`, `/api/settings`, `/api/backups`, `/api/logs`, `/api/crons`, die Verwaltung der Sammlungen (`/api/collections`, `/api/collections/<name>`, `…/truncate`, `…/impersonate`, `/api/collections/meta`) und jede Punktdatei ausser `/.well-known/`, auch kodiert (`%5fsuperusers`). Dazu jede Systemsammlung (`_superusers`, `_mfas` …) und jede Sammlung über ihre ID (`pbc_…`), in jeder Schreibweise, die PocketBase auflöst: Gross/Klein (`_SUPERUSERS`), Unicode (`_ſuperusers`), ID (`pbc_3142635823`). Die Seiten nennen Sammlungen beim Namen.
- Zweite Schicht in PocketBase: Jede Anfrage an PocketBase bekommt vom Eingang den Kopf `x-eingang-weg: aussen`. Mit ihm gilt dort kein Konto der Verwaltung, keine Systemsammlung und nicht `/_/` (404, `pb_hooks/eingang.pb.js`). Über den Tunnel (ohne den Kopf) bleibt die Verwaltung, wie sie ist.
- Entfernt alle eingehenden `x-eingang-*`, `x-forwarded-*`, `forwarded`, `x-real-ip` und jeden Kopf mit Unterstrich (`x_eingang_rolle` läsen Server nach WSGI oder CGI wie `x-eingang-rolle`, nginx verwirft sie ebenso); setzt `x-eingang-benutzer` (nur die Record-ID) und `x-eingang-rolle` für geschützte Teile, `x-forwarded-for` mit der geprüften Adresse für alle. Cookie und Authorization bekommt nur PocketBase. Antworten verlieren `x-eingang-*`, und eine Sitzung (`__Host-sitzung`, auch mit Leerzeichen oder Tab vor dem `=` und in anderer Schreibweise) darf nur PocketBase setzen. Ein Cookie ohne Namen von einem Teil (`=__Host-sitzung=…` oder ganz ohne `=`) fällt weg: Manche Browser schicken davon nur den Wert zurück, er käme als Sitzung an.
- Schreiben (alles ausser GET, HEAD, OPTIONS) aus einer fremden Seite: 403. Eigen ist ein `Origin` gleich der Adresse der Anfrage (Schema aus `ursprung`, Host von der Kante) oder einer aus `ursprung`. Mit Cookie nur mit eigenem `Origin` (fehlt er, 403). PocketBase prüft dasselbe noch einmal (zweite Schicht).
- Geschützter Teil ohne Anmeldung: 401, im Browser eine kleine Seite mit dem Weg zur Anmeldung; falsche Rolle: 403. Antwortet PocketBase nicht innert 2 s: 503. Beginnt die Antwort nicht innert 60 s ab Ankunft der Anfrage (Warten auf einen Platz eingeschlossen): 504, oder 429, wenn die Anfrage bis dahin keinen Platz bekam (Bun.serve wartet darum 65 s, nicht 10 s wie sonst).
- Hinter dem Login `Cache-Control: no-store`, `Vary: Cookie` und `X-Frame-Options: SAMEORIGIN`; überall `X-Content-Type-Options: nosniff`.
- Grenzen je Adresse (IPv6 je /64): 600 Anfragen je Minute (`ANFRAGEN_PRO_MINUTE`), 10 Anmeldeversuche je Minute (über den Eingang und über `auth-with-*` von PocketBase zusammen), dazu 5 je Minute und Adresse in PocketBase (`/api/eingang/anmelden` und `users:auth`); Kopfzeilen bis 8 KB (sonst 431), Körper bis 10 MB (sonst 413, auch in Stücken); höchstens 20 offene Anfragen gleichzeitig, bis die Antwort ganz durch ist. Weitere warten der Reihe nach auf einen dieser Plätze, höchstens 100 je Adresse und 2000 zusammen (sonst 429): Eine Seite mit vielen Bildern kommt über HTTP/2 an der Kante auf einmal und mit derselben Adresse, sie verliert so keine Bilder. So belegt eine Adresse mit langsamen Anfragen nicht alle Plätze für fetch zu den Teilen (im `Dockerfile` 1024 für alle zusammen, `BUN_CONFIG_MAX_HTTP_REQUESTS`); wer wartet, belegt keinen. Die Adresse ist die der Verbindung, ausser sie steht in `VERTRAUTE_PROXYS` (Adressen oder Netze wie `10.0.0.0/8`); `*` heisst: Jede Verbindung kommt über einen Proxy, der `X-Forwarded-For` neu setzt. Auf einem Albatros-Server ist das die Kante (nur sie erreicht Port 80), darum steht in `compose.yaml` `*`.
- Protokolliert je Anfrage eine JSON-Zeile mit Zeit, Methode, Pfad ohne Kennungen (`/api/collections/mitteilungen/records/:id`), Teil, Status und Dauer. Nie Cookie, Token, Abfrage, Kopfzeilen oder Adressen.

Das Cookie `__Host-sitzung` ist `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, ohne `Domain`, und gilt so lange wie das Token (5 Tage). Skripte im Browser lesen es nicht, und `auth-refresh` gilt mit ihm nicht, damit das Token nie in einer Antwort steht.

## Gemessen

Am 31.10.2026 mit `messen.ts`, je Lage zwei Läufe, auf einem Mac (Apple M5 Pro, macOS, arm64), Bun 1.4.2 mit `--smol` wie im `Dockerfile`, vor einem echten PocketBase 0.40.5 (`GOMEMLIMIT=200MiB` wie in `pocketbase/compose.yaml`). Je 200 000 Anfragen, die Hälfte an einen geschützten Teil (jede mit Prüfung bei PocketBase), ohne Grenze je Minute. Gemessen mit der Grenze von 20 offenen Anfragen je Adresse; mit dem Warten auf einen Platz nachgemessen (je 100 000 Anfragen, zwei Läufe): 16 300–16 900 Anfragen je Sekunde und Spitze 53 MB, gleich wie ohne Warten (16 600–16 800, 54–56 MB). Auf dem Server (Linux) nicht gemessen.

| Lage | Eingang (RSS) | offen: Median / 95 % | geschützt: Median / 95 % |
|---|---|---|---|
| Leerlauf | 20 MB | – | – |
| 50 gleichzeitig, rund 16 000 Anfragen je Sekunde, 1000 Adressen | Spitze 56 MB | 2,5 / 4,4 ms | 3,4–3,5 / 5,6–5,7 ms |
| 200 gleichzeitig, rund 18 000 je Sekunde | Spitze 65–66 MB | 9,1–9,2 / 12,9–13,1 ms | 12,5–12,7 / 18,0–18,3 ms |
| 50 gleichzeitig, von 60 000 Adressen | Spitze 67–69 MB | 2,1 / 4,1 ms | 2,9 / 5,1 ms |
| 50 gleichzeitig, ohne `--smol` | Spitze 68–69 MB | 1,9–2,0 / 3,6–3,9 ms | 2,6–2,7 / 4,7–4,9 ms |

Langsame Anfragen, die ein Teil festhält (`messen.ts --gehalten`, je 20 von einer Adresse; mit `--je-adresse 120` warten je Adresse 100 weitere auf einen Platz), je ein Lauf:

| Offen gehalten | Plätze für fetch | Eingang (RSS) | eine andere Besucherin |
|---|---|---|---|
| 300 von 15 Adressen | 256 (Standard von Bun) | 33 MB | keine Antwort in 4 s |
| 1000 von 50 Adressen | 1024 (wie im `Dockerfile`) | 45 MB | 200 sofort |
| 1100 von 55 Adressen | 1024 | 47 MB | keine Antwort in 4 s |
| 4200 von 210 Adressen | 4096 | 89 MB | keine Antwort in 4 s |
| 2400 von 20 Adressen, je 120: 400 beim Teil, 2000 wartend | 1024 | 49 MB | 200 sofort |
| 6000 von 50 Adressen, je 120: 1000 beim Teil, 2000 wartend, 3000× 429 | 1024 | 66 MB | 200 sofort |
| 6600 von 55 Adressen, je 120 (zwei Läufe) | 1024 | 69 MB | keine Antwort in 4 s |

Seiten mit vielen Bildern (`messen.ts --bilder`, je Bild 100 KB, alle Bilder einer Seite auf einmal von derselben Adresse, sofort gelesen, 1024 Plätze für fetch):

| Lage | Antworten | Seite fertig (Median) | Eingang (RSS, Spitze) |
|---|---|---|---|
| 1 Seite mit 60 Bildern | 60× 200, beim Teil höchstens 20 zugleich | 0,03–0,04 s | 20,5 MB (wie im Leerlauf) |
| 1 Seite mit 150 Bildern | 120× 200, 30× 429 (mehr als 20 + 100) | 0,05 s | 40–41 MB |
| 5 Seiten mit je 120 Bildern | 600× 200 | 0,09 s | 52–54 MB |
| 20 Seiten mit je 60 Bildern, sechs Läufe | 1200× 200 | 0,15–0,16 s | 86–129 MB |
| ebenso mit dem Eingang von 0153999 (ohne Grenze, Körper direkt), drei Läufe | 1200× 200 | 0,15–0,17 s | 61–67 MB |
| ebenso mit sofort 429 über 20 (Stand vor dem Warten), drei Läufe | 639–767× 200, der Rest 429 | 0,10–0,11 s | 75–88 MB |

- Der Körper jeder Antwort geht durch einen Strom in JavaScript, damit der Platz erst frei wird, wenn er ganz durch ist. Das kostet: Vorher waren es 29 600 statt 16 000 Anfragen je Sekunde und im Median 1,2 statt 2,5 ms (offen), gemessen am selben Tag mit je 100 000 Anfragen. Für eine Vereinsseite (höchstens 600 Anfragen je Minute und Adresse) spielt das keine Rolle; dafür blockiert eine einzelne Adresse nicht mehr alle.
- Ehrlich dazu: Mit vielen grossen Antworten zugleich kostet derselbe Strom Speicher. 20 Seiten mit je 60 Bildern in derselben Zehntelsekunde brachten den Eingang auf 86–129 MB statt 61–67 MB mit dem Körper direkt, also bis an `mem_limit` 128 MB (RSS auf dem Mac; ob der Container dabei neu startet, ist nicht gemessen). Andere Ströme (`type: 'direct'`, `TransformStream`, `highWaterMark: 0`) brachten nichts (105–125 MB). Eine Seite mit 60 Bildern allein braucht nichts zusätzlich.
- Grosse Körper in Stücken (seit 01.11.2026, Welle 8): Bun liest den Körper einer Antwort vom Teil so schnell in den Speicher, wie der Teil liefert, auch wenn die Besucherin nicht liest (ein langsamer oder angehaltener Download). Darum holt der Eingang einen Körper ab 1 MB in Stücken à 64 KB mit `Range`, jedes erst, wenn Bun das vorige an die Besucherin weitergibt, sofern der Teil Bereiche anbietet (`accept-ranges: bytes`, wie nginx und PocketBase bei Dateien) und die Datei erkennbar bleibt (`ETag` ohne `W/` oder `Last-Modified`, geschickt als `If-Range`). Ändert sich die Datei unterwegs, bricht der Download ab (die Besucherin lädt neu), statt zwei Fassungen zu mischen; ein Bereich der Besucherin (Video im Browser, `Range`) kommt ebenso in Stücken. Es gibt kein Budget über alle Adressen: Keine Besucherin wartet auf eine andere.
- Gemessen am 01.11.2026 (RSS auf dem Mac, Bun 1.4.2 mit `--smol`), je 20 Downloads à 5 MB von einer Adresse, niemand liest (`g06d-langsam-lesen.ts` der Gegenproben Welle 5 und 7), Teil wie nginx mit Bereichen: 1 Adresse 37–38 MB, 2 Adressen 46–53 MB, 3 Adressen 55–59 MB (vorher 96–107, 159–163 und 206–210 MB). Wer liest und anhält, hält, was Bun ihr vorausschreibt (gemessen 10 bis 15 Stücke). Andere Adressen bekommen ihre Bilder und Videos sofort (1 bis 3 ms, auch während eine Adresse 40 MB ungelesen hält, 180 s lang gemessen); mit dem Budget aus Welle 7 warteten sie bis 68 s.
- Ehrlich dazu: Ohne Bereiche beim Teil (ein eigener Teil, der keine `Range` kann) oder ohne Länge (in Stücken, `chunked`) geht der Körper wie vorher durch und hält den Speicher, solange die Verbindung offen ist: 1 Adresse 100–107 MB, 3 Adressen 195–201 MB, gleich wie vorher (`idleTimeout` greift beim hängenden Schreiben nicht). PocketBase kann Bereiche (gemessen mit PocketBase 0.40.5 und einer Datei aus `pb_public`, dieselbe Go-Funktion wie für `/api/files`: `accept-ranges`, `Last-Modified`, `If-Range`; der Eingang davor liefert 3 MB in 49 Stücken, Bytes gleich). nginx in `webseite` kann es nach seiner Dokumentation; hier ist es nicht gemessen (kein nginx und kein Docker auf dem Mac), sondern ein Teil, der wie nginx antwortet. Mit nur `Last-Modified` (PocketBase) sieht der Teil eine Änderung in derselben Sekunde nicht. Schon zwei Adressen ohne Bereiche kommen über `mem_limit` 128 MB; ob der Container dann neu startet, ist nicht gemessen (Entscheid eing-neu-03).
- Der Preis der Stücke: je 64 KB eine Anfrage an den Teil (eine Datei von 5 MB: 81 statt 1), jede steht im Protokoll des Teils. Eine Seite mit 60 Fotos à 2 MB (3 Seiten zugleich, `messen.ts --bilder 60 --seiten 3 --kb 2048 --bereiche`) ist nach 0,38–0,39 s statt 0,16–0,17 s fertig, mit 90–91 MB statt 170–181 MB; Bilder unter 1 MB gehen wie bisher in einem Stück (20 Seiten mit je 60 Bildern à 100 KB: 108–124 MB, vorher 95–124 MB, je zwei Läufe).
- Wer wartet, kostet rund 5 KB (gemessen ohne die Grenze für alle zusammen: 1000 beim Teil und 5000 wartend 69 MB, nur die 1000 beim Teil 46 MB). Darum warten höchstens 2000 zusammen, rund 10 MB.
- Kein Leck: 100 000 und 200 000 Anfragen endeten auf derselben Höhe (55–57 MB). Was der Speicher einmal hatte, gibt Bun in 5 Sekunden nicht zurück (RSS bleibt auf der Spitze).
- Die Prüfung bei PocketBase kostet je geschützte Anfrage knapp 1 ms (Median 3,4 statt 2,5 ms).
- Die Liste der Adressen für die Grenzen ist auf 10 000 begrenzt; mit 20 000 kostete sie gemessen 40 MB mehr (Spitze 95 MB), darum die kleinere Zahl. `mem_limit` im Container: 128 MB.
- Ehrlich dazu: PocketBase selbst stieg unter dieser künstlichen Last von 45 MB auf 166–175 MB (50 gleichzeitig) und 207–245 MB (200 gleichzeitig), nahe an sein `mem_limit` von 256 MB. Im Betrieb begrenzt der Eingang jede Adresse auf 600 Anfragen je Minute; so viel Last kommt von einer Vereinsseite nicht. Die PocketBase-Werte sind RSS auf dem Mac und nicht vergleichbar mit den 20 MB vom 28.10.2026 (`docker stats` auf dem Server).
- Das Docker-Abbild ist nicht lokal gebaut (Docker lief auf diesem Rechner nicht), darum ist auch `mem_limit` nicht im Container gemessen, nur RSS auf dem Mac. Gleich wie in den anderen Diensten von Albatros: `oven/bun:1.4.2-slim`.

## Vergleich: nginx mit auth_request (nicht gebaut)

Statt eines eigenen Dienstes könnte nginx im Container `webseite` die Tür sein: `auth_request /api/eingang/pruefen` vor jedem geschützten Pfad, `auth_request_set` für Kennung und Rolle, `limit_req_zone` für die Grenzen, `real_ip_header` für die Kante.

| | Bun-Eingang | nginx `auth_request` |
|---|---|---|
| Speicher | 20 MB im Leerlauf, 56–69 MB unter Volllast mit kleinen Seiten, 86–129 MB mit 1200 Bildern à 100 KB auf einmal; mit ungelesenen Downloads von einem Teil mit Bereichen bis 59 MB, ohne Bereiche mehr (bis 210 MB, gemessen) | kein zusätzlicher Prozess; nginx in `webseite` braucht rund 10 MB (gemessen am 28.10.2026), der Zuschlag für `auth_request` ist geschätzt, nicht gemessen |
| Prüfung bei PocketBase | je Anfrage an einen geschützten Teil, knapp 1 ms (gemessen) | ebenso je Anfrage |
| Fremde `x-eingang-*` | alle mit dem Präfix weg | nur einzeln mit `proxy_set_header … ""`; eine neue Kopfzeile ginge durch, bis jemand die Konfiguration nachführt |
| Pfade | eine Funktion: aufgelöst, einmal dekodiert, Tricks abgelehnt, getestet | nginx löst selbst auf (`merge_slashes`, `..`, `%2F`); Entscheid über `location` mit Vorrangregeln (`=`, `^~`, Regex, Präfix), Fehler leicht und schwer zu sehen |
| Ursprung beim Schreiben | Liste in `eingang.json` | `map $http_origin` und `if`, in `location` heikel |
| 503 nach 2 s | so gebaut und getestet | `auth_request` meldet bei einem Fehler 500; 503 braucht `error_page`-Umwege |
| Protokoll ohne Adressen | so gebaut und getestet | eigenes `log_format` ohne `$remote_addr` und mit `$uri` statt `$request_uri` |
| Test | `test.ts` mit 52 Prüfungen, `bun` reicht | dieselben Prüfungen über HTTP gingen, brauchen aber nginx im Test (in CI installierbar) |

Fazit: nginx spart 20 bis 69 MB (mit vielen grossen Bildern auf einmal bis 129 MB, mit ungelesenen Downloads von einem Teil ohne Bereiche mehr) und einen Container. Der Bun-Eingang kostet diesen Speicher, ist dafür an einer Stelle in derselben Sprache wie der Rest geprüft und vollständig getestet. Der Entscheid liegt bei Mathias (Plan, Entscheidungen 5).

## Grenzen

- Nur mit eigenem Server (Pilot); mit Light läuft auf dem Server kein Programm.
- Das Rezept `buchungen` meldet «Meine Buchungen» (`verwaltung.html`) über `/api/collections/_superusers` an. Das sperrt der Eingang, und ein Token der Verwaltung gilt durch ihn nicht: Hinter ihm geht «Meine Buchungen» nur über den Tunnel, bis die Seite über eine Rolle angemeldet wird (nicht gebaut).
- Kein internes Geheimnis zu den Teilen, anders als bei amouk: Ein Teil kann eine Anfrage durch den Eingang nicht von einer direkten mit gefälschtem `x-eingang-rolle` unterscheiden. Auf einem Albatros-Server kommt niemand direkt zu einem Teil: Nur der Eingang hat einen Port (die Webseite verliert `ports:` beim Einbau, eigene Teile bekommen keine), und die Firewall der Server (`nftables` der Flotte) lässt von aussen nur SSH durch, Web nur über die Kante; Server erreichen einander nicht. Offen bleibt ein anderer Container im eigenen Stack, der übernommen wurde, und ein Umzug auf einen eigenen Server, wo Docker-Ports die Firewall umgehen (Skill `landung`): Dort gilt erst recht, dass kein Teil ausser dem Eingang `ports:` hat. Ein Geheimnis, das jeder Teil prüft, ist nicht gebaut.
- Abmelden widerruft die Sitzung (neuer `tokenKey` des Mitglieds): Danach gilt kein Token dieses Mitglieds mehr, auch nicht auf anderen Geräten. Wer sich auf dem Handy abmeldet, ist also auch am Computer abgemeldet.
- Die Mail «Neue Anmeldung» von PocketBase kommt bei der Anmeldung über den Eingang nicht, und die Anmeldung in zwei Schritten (MFA) geht über ihn nicht.
- WebSockets gehen nicht durch, und die Echtzeit von PocketBase (`/api/realtime`, Server-Sent Events) sperrt er (404): Kein Rezept braucht sie, und jede Verbindung bliebe offen. Braucht ein eigener Teil sie, `/api/realtime` in `VERWALTUNG` (eingang.ts) streichen; sie zählt dann zu den 20 offenen Anfragen je Adresse.
- Gegen viele Adressen zugleich hilft die Grenze je Adresse nicht: 52 Adressen mit je 20 langsamen Anfragen belegen alle 1024 Plätze für fetch, dann warten alle (gemessen mit `messen.ts --gehalten 1100 --fetch-plaetze 1024`). Mehr Plätze kosten Speicher: 4096 belegte brauchten 89 MB, zu nah an `mem_limit` 128 MB. Sind die 2000 Wartenden über alle Adressen voll, bekommt auch eine Seite mit vielen Bildern wieder 429 für alles über 20.
- Mehrere Menschen hinter einer Adresse (Schule, Büro, ein Handynetz) teilen sich die 20 Plätze, die 100 Wartenden und die 600 Anfragen je Minute. Mit schnellen Antworten merkt das niemand. Hält dort jemand Plätze mit langsamen Downloads, warten die anderen; wer 60 s keinen Platz bekommt, erhält 429.
- Lokal mit `http://localhost` geprüft im Browser der Claude-App (Chromium); andere Browser nicht.
