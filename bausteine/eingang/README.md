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
| `test.ts` | 34 Prüfungen gegen ein echtes PocketBase und Teile zum Schein: `bun bausteine/eingang/test.ts` |
| `messen.ts` | Arbeitsspeicher und Antwortzeiten: `bun bausteine/eingang/messen.ts --anfragen 200000 --smol`; mit gehaltenen Anfragen: `--gehalten 1100 --fetch-plaetze 1024` |

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
- Entfernt alle eingehenden `x-eingang-*`, `x-forwarded-*`, `forwarded`, `x-real-ip` und jeden Kopf mit Unterstrich (`x_eingang_rolle` läsen Server nach WSGI oder CGI wie `x-eingang-rolle`, nginx verwirft sie ebenso); setzt `x-eingang-benutzer` (nur die Record-ID) und `x-eingang-rolle` für geschützte Teile, `x-forwarded-for` mit der geprüften Adresse für alle. Cookie und Authorization bekommt nur PocketBase. Antworten verlieren `x-eingang-*`, und eine Sitzung (`__Host-sitzung`, auch mit Leerzeichen oder Tab vor dem `=` und in anderer Schreibweise) darf nur PocketBase setzen.
- Schreiben (alles ausser GET, HEAD, OPTIONS) aus einer fremden Seite: 403. Eigen ist ein `Origin` gleich der Adresse der Anfrage (Schema aus `ursprung`, Host von der Kante) oder einer aus `ursprung`. Mit Cookie nur mit eigenem `Origin` (fehlt er, 403). PocketBase prüft dasselbe noch einmal (zweite Schicht).
- Geschützter Teil ohne Anmeldung: 401, im Browser eine kleine Seite mit dem Weg zur Anmeldung; falsche Rolle: 403. Antwortet PocketBase nicht innert 2 s: 503. Braucht ein Teil länger als 60 s bis zur Antwort: 504 (Bun.serve wartet darum 65 s, nicht 10 s wie sonst).
- Hinter dem Login `Cache-Control: no-store`, `Vary: Cookie` und `X-Frame-Options: SAMEORIGIN`; überall `X-Content-Type-Options: nosniff`.
- Grenzen je Adresse (IPv6 je /64): 600 Anfragen je Minute (`ANFRAGEN_PRO_MINUTE`), 10 Anmeldeversuche je Minute (über den Eingang und über `auth-with-*` von PocketBase zusammen), dazu 5 je Minute und Adresse in PocketBase (`/api/eingang/anmelden` und `users:auth`); Kopfzeilen bis 8 KB (sonst 431), Körper bis 10 MB (sonst 413, auch in Stücken); höchstens 20 offene Anfragen gleichzeitig, bis die Antwort ganz durch ist (sonst 429). So belegt eine Adresse mit langsamen Anfragen nicht alle Plätze für fetch zu den Teilen (im `Dockerfile` 1024 für alle zusammen, `BUN_CONFIG_MAX_HTTP_REQUESTS`). Die Adresse ist die der Verbindung, ausser sie steht in `VERTRAUTE_PROXYS` (Adressen oder Netze wie `10.0.0.0/8`); `*` heisst: Jede Verbindung kommt über einen Proxy, der `X-Forwarded-For` neu setzt. Auf einem Albatros-Server ist das die Kante (nur sie erreicht Port 80), darum steht in `compose.yaml` `*`.
- Protokolliert je Anfrage eine JSON-Zeile mit Zeit, Methode, Pfad ohne Kennungen (`/api/collections/mitteilungen/records/:id`), Teil, Status und Dauer. Nie Cookie, Token, Abfrage, Kopfzeilen oder Adressen.

Das Cookie `__Host-sitzung` ist `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, ohne `Domain`, und gilt so lange wie das Token (5 Tage). Skripte im Browser lesen es nicht, und `auth-refresh` gilt mit ihm nicht, damit das Token nie in einer Antwort steht.

## Gemessen

Am 31.10.2026 mit `messen.ts`, je Lage zwei Läufe, auf einem Mac (Apple M5 Pro, macOS, arm64), Bun 1.4.2 mit `--smol` wie im `Dockerfile`, vor einem echten PocketBase 0.40.5 (`GOMEMLIMIT=200MiB` wie in `pocketbase/compose.yaml`). Je 200 000 Anfragen, die Hälfte an einen geschützten Teil (jede mit Prüfung bei PocketBase), ohne Grenzen. Auf dem Server (Linux) nicht gemessen.

| Lage | Eingang (RSS) | offen: Median / 95 % | geschützt: Median / 95 % |
|---|---|---|---|
| Leerlauf | 20 MB | – | – |
| 50 gleichzeitig, rund 30 000 Anfragen je Sekunde, 1000 Adressen | Spitze 55–56 MB | 1,2 / 2,7 ms | 1,7 / 3,8–4,0 ms |
| 200 gleichzeitig, rund 20 000 je Sekunde | Spitze 59–62 MB | 3,6–3,8 / 8,5 ms | 8,5 / 52–53 ms |
| 50 gleichzeitig, von 60 000 Adressen | Spitze 64–66 MB | 1,2 / 2,6 ms | 1,6 / 3,3–3,4 ms |
| 50 gleichzeitig, ohne `--smol` | Spitze 69–71 MB | 1,2 / 2,5–2,7 ms | 1,6–1,7 / 3,7–4,3 ms |

- Kein Leck: 50 000 und 200 000 Anfragen endeten auf derselben Höhe, 600 000 von 60 000 Adressen ebenso. Was der Speicher einmal hatte, gibt Bun in 5 Sekunden nicht zurück (RSS bleibt auf der Spitze).
- Die Prüfung bei PocketBase kostet je geschützte Anfrage rund 0,5 ms (Median 1,7 statt 1,2 ms).
- Die Liste der Adressen für die Grenzen ist auf 10 000 begrenzt; mit 20 000 kostete sie gemessen 40 MB mehr (Spitze 95 MB), darum die kleinere Zahl. `mem_limit` im Container: 128 MB.
- Ehrlich dazu: PocketBase selbst stieg unter dieser künstlichen Last von 45 MB auf 172–180 MB (50 gleichzeitig) und 311–314 MB (200 gleichzeitig), über sein `mem_limit` von 256 MB. Im Betrieb begrenzt der Eingang jede Adresse auf 600 Anfragen je Minute; so viel Last kommt von einer Vereinsseite nicht. Die PocketBase-Werte sind RSS auf dem Mac und nicht vergleichbar mit den 20 MB vom 28.10.2026 (`docker stats` auf dem Server).
- Das Docker-Abbild ist nicht lokal gebaut (Docker lief auf diesem Rechner nicht). Gleich wie in den anderen Diensten von Albatros: `oven/bun:1.4.2-slim`.

## Vergleich: nginx mit auth_request (nicht gebaut)

Statt eines eigenen Dienstes könnte nginx im Container `webseite` die Tür sein: `auth_request /api/eingang/pruefen` vor jedem geschützten Pfad, `auth_request_set` für Kennung und Rolle, `limit_req_zone` für die Grenzen, `real_ip_header` für die Kante.

| | Bun-Eingang | nginx `auth_request` |
|---|---|---|
| Speicher | 20 MB im Leerlauf, 55–66 MB unter Volllast (gemessen) | kein zusätzlicher Prozess; nginx in `webseite` braucht rund 10 MB (gemessen am 28.10.2026), der Zuschlag für `auth_request` ist geschätzt, nicht gemessen |
| Prüfung bei PocketBase | je Anfrage an einen geschützten Teil, rund 0,5 ms (gemessen) | ebenso je Anfrage |
| Fremde `x-eingang-*` | alle mit dem Präfix weg | nur einzeln mit `proxy_set_header … ""`; eine neue Kopfzeile ginge durch, bis jemand die Konfiguration nachführt |
| Pfade | eine Funktion: aufgelöst, einmal dekodiert, Tricks abgelehnt, getestet | nginx löst selbst auf (`merge_slashes`, `..`, `%2F`); Entscheid über `location` mit Vorrangregeln (`=`, `^~`, Regex, Präfix), Fehler leicht und schwer zu sehen |
| Ursprung beim Schreiben | Liste in `eingang.json` | `map $http_origin` und `if`, in `location` heikel |
| 503 nach 2 s | so gebaut und getestet | `auth_request` meldet bei einem Fehler 500; 503 braucht `error_page`-Umwege |
| Protokoll ohne Adressen | so gebaut und getestet | eigenes `log_format` ohne `$remote_addr` und mit `$uri` statt `$request_uri` |
| Test | `test.ts` mit 34 Prüfungen, `bun` reicht | dieselben Prüfungen über HTTP gingen, brauchen aber nginx im Test (in CI installierbar) |

Fazit: nginx spart 20 bis 66 MB und einen Container. Der Bun-Eingang kostet diesen Speicher, ist dafür an einer Stelle in derselben Sprache wie der Rest geprüft und vollständig getestet. Der Entscheid liegt bei Mathias (Plan, Entscheidungen 5).

## Grenzen

- Nur mit eigenem Server (Pilot); mit Light läuft auf dem Server kein Programm.
- Das Rezept `buchungen` meldet «Meine Buchungen» (`verwaltung.html`) über `/api/collections/_superusers` an. Das sperrt der Eingang, und ein Token der Verwaltung gilt durch ihn nicht: Hinter ihm geht «Meine Buchungen» nur über den Tunnel, bis die Seite über eine Rolle angemeldet wird (nicht gebaut).
- Kein internes Geheimnis zu den Teilen, anders als bei amouk: Ein Teil kann eine Anfrage durch den Eingang nicht von einer direkten mit gefälschtem `x-eingang-rolle` unterscheiden. Auf einem Albatros-Server kommt niemand direkt zu einem Teil: Nur der Eingang hat einen Port (die Webseite verliert `ports:` beim Einbau, eigene Teile bekommen keine), und die Firewall der Server (`nftables` der Flotte) lässt von aussen nur SSH durch, Web nur über die Kante; Server erreichen einander nicht. Offen bleibt ein anderer Container im eigenen Stack, der übernommen wurde, und ein Umzug auf einen eigenen Server, wo Docker-Ports die Firewall umgehen (Skill `landung`): Dort gilt erst recht, dass kein Teil ausser dem Eingang `ports:` hat. Ein Geheimnis, das jeder Teil prüft, ist nicht gebaut.
- Abmelden löscht das Cookie in diesem Browser, widerruft die Sitzung aber nicht: Eine Kopie des Tokens bleibt gültig, bis es abläuft (5 Tage). Überall abmelden: ein neues Passwort setzen («Passwort vergessen?»). Widerrufen liesse sich beim Abmelden (neuer `tokenKey` des Mitglieds); dann wären alle Geräte dieses Mitglieds abgemeldet. Das ist nicht gebaut und noch nicht entschieden.
- Die Mail «Neue Anmeldung» von PocketBase kommt bei der Anmeldung über den Eingang nicht, und die Anmeldung in zwei Schritten (MFA) geht über ihn nicht.
- WebSockets gehen nicht durch, und die Echtzeit von PocketBase (`/api/realtime`, Server-Sent Events) sperrt er (404): Kein Rezept braucht sie, und jede Verbindung bliebe offen. Braucht ein eigener Teil sie, `/api/realtime` in `VERWALTUNG` (eingang.ts) streichen; sie zählt dann zu den 20 offenen Anfragen je Adresse.
- Gegen viele Adressen zugleich hilft die Grenze je Adresse nicht: 52 Adressen mit je 20 langsamen Anfragen belegen alle 1024 Plätze für fetch, dann warten alle (gemessen mit `messen.ts --gehalten 1100 --fetch-plaetze 1024`). Mehr Plätze kosten Speicher: 4096 belegte brauchten 89 MB, zu nah an `mem_limit` 128 MB.
- Lokal mit `http://localhost` geprüft im Browser der Claude-App (Chromium); andere Browser nicht.
