# Projekt «Sonnenhof» für die Fahrplan-Evals: zwei Ferienwohnungen auf einem Bauernhof in Merligen, Person Anna (wie user_anna und
# «Sonnenhof» in den lage-Attrappen von albatros). Jede Funktion schreibt das Ergebnis einer Phase wie die Skills es verlangen, mit
# den Zeilen aus fahrplan.yaml. Ein Fall lädt die Datei in seinem scaffold.sh und ruft «bis P<n>» auf:
#   . "$(dirname "${BASH_SOURCE[0]}")/../_projekt/projekt.sh"; bis P5
# MODUS=lernen vor «bis» schreibt «Modus: lernen» in docs/projekt.md. Läuft im leeren Arbeitsordner des Falls (bash, ohne Netz).

MODUS="${MODUS:-machen}"

p1() {
  mkdir -p docs design
  cat > docs/projekt.md <<EOF
# Sonnenhof

Projektname: Sonnenhof
In einem Satz: Zwei Ferienwohnungen auf unserem Bauernhof in Merligen, mit Blick auf den Thunersee.
Für wen: Familien mit kleinen Kindern, die eine ruhige Woche auf dem Hof suchen
Hauptsache: Eine Woche anfragen (Knopf: «Woche anfragen»)
Erfolg: zwei Anfragen pro Monat in der Saison
Bestehende Seite: keine
Modus: ${MODUS}
Weg: Webseite
Stand: 20.10.2026, Idee steht
Nächster Schritt: Research: vergleichbare Seiten anschauen
EOF
  cat > AGENTS.md <<'EOF'
# Hinweise für die KI

Dieses Projekt gehört einer Person, die mit Albatros ihre Webseite oder ihr Geschäft baut, meist ohne Technik-Vorwissen. Ob Claude Code, Codex, Gemini CLI oder Cursor: Für jede KI gilt dasselbe.

## Zuerst

Lies `docs/projekt.md` (Stand, nächster Schritt), dann ruf `lage` auf (Albatros), immer mit `skills_stand`: dem Wert von `stand` unter `metadata` oben in den Skills von Albatros. `lage` sagt, welcher Skill und welcher Abschnitt jetzt dran ist; folge ihm. Gibt es `docs/projekt.md` noch nicht, beginnt das Projekt mit dem Skill `webseite-planen`, Abschnitt Idee. Ohne Verbindung zu Albatros hilft der Skill `lotse` weiter.

## Regeln

- Drei Ja-Momente, und nur die Person sagt Ja: Plan bestätigt (`Bestätigt:` in `docs/plan.md`), Entwurf freigegeben (`Freigegeben zum Bauen:` in `docs/entwurf.md`), Seite freigegeben (`Freigegeben:` in `docs/prd.md`). «Sieht gut aus» ist kein Ja.
- Nichts geht ins Netz ohne Freigabe: kein Veröffentlichen und kein Push in den Hafen, bevor die Person ihre Seite freigegeben hat (`Freigegeben:` in `docs/prd.md`). Nach dem Livegang braucht jede Änderung ihr eigenes Ja.
- Preise nur aus `konto_status`, nie aus dem Gedächtnis.
- Höchstens zwei Fragen in einer Nachricht. Was du selbst vorschlagen kannst, steht als `[Annahme: …]`, was offen ist, als `[offen: …]`. Nichts erfinden.
- Nach jedem geschafften Schritt: `Stand:` und `Nächster Schritt:` in `docs/projekt.md` nachführen, `schritt_melden` (mit `titel`, dem Wert der Zeile `Projektname:`, sobald es sie gibt), dann `lage` erneut, mit `skills_stand`.
- Passwörter, Kartennummern und private Schlüssel gehören nie in den Chat und nie in eine Datei des Projekts. Geheimnisse stehen in `.env`, und `.env` steht in `.gitignore`.
- Du-Form, Alltagssprache. Ein Fachwort kommt erst mit seinem Bild.
EOF
  printf 'Es gelten die Hinweise in AGENTS.md.\n\n@AGENTS.md\n' > CLAUDE.md
  printf 'Es gelten die Hinweise in AGENTS.md.\n\n@./AGENTS.md\n' > GEMINI.md
  cat > design/skizze.html <<'EOF'
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Skizze: Sonnenhof</title>
<style>
  body { margin: 0; font: 17px/1.5 system-ui, sans-serif; color: #333; background: #eee; }
  header, section, footer { max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem; }
  .flaeche { background: #ccc; border-radius: 8px; min-height: 12rem; }
  .knopf { display: inline-block; background: #555; color: #fff; padding: .8rem 1.4rem; border-radius: 8px; }
  .notiz { font-size: .85rem; color: #777; }
</style>
</head>
<body>
  <header><strong>Sonnenhof</strong> · Start · Wohnungen · Anfrage</header>
  <section><h1>Zwei Ferienwohnungen auf unserem Bauernhof in Merligen, mit Blick auf den Thunersee.</h1><p>Für Familien mit kleinen Kindern, die eine ruhige Woche auf dem Hof suchen.</p><span class="knopf">Woche anfragen</span></section>
  <section><div class="flaeche"></div><p class="notiz">Hier kommt später ein Bild.</p></section>
  <section><h2>Was Besucher wissen müssen</h2><p>Zwei Wohnungen, Preise je Woche, freie Wochen.</p></section>
  <footer>Impressum · Datenschutz<p class="notiz">Skizze in Grau: zuerst die Reihenfolge, Farben und Bilder kommen später.</p></footer>
</body>
</html>
EOF
}

p2() {
  cat > docs/recherche.md <<'EOF'
# Research: Sonnenhof
Stand: 22.10.2026

Vorbilder: Ferienhof Rösli in Sigriswil (von Anna genannt, Adresse fehlt): Preise je Woche sofort sichtbar; weniger als drei, weil das Netz beim Research fehlte
Übliche Seiten und Funktionen: Wohnungen mit Fotos, Preise je Woche, freie Wochen, Anfrage, Anreise, Über uns
Übernehmen: Preise je Woche gross auf der Seite, Fotos vom Hof und von den Tieren
Vermeiden: Online-Kasse und Buchungssystem, für zwei Wohnungen reicht eine Anfrage
Pflichten: Impressum, Datenschutzerklärung (Anfrageformular), Bildrechte der eigenen Fotos, keine Cookies nötig
Inhalte vorhanden: Fotos beider Wohnungen und des Gartens; fehlt: Texte, Logo
Suchbegriffe: «Ferienwohnung Thunersee», «Ferien auf dem Bauernhof Berner Oberland», «Ferienwohnung Merligen»
EOF
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 22.10.2026, Research steht'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Grundriss: Seiten und Funktionen'
}

p3() {
  cat > docs/plan.md <<'EOF'
# Plan: Sonnenhof

Worum es geht: Zwei Ferienwohnungen auf unserem Bauernhof in Merligen, für Familien mit kleinen Kindern. Erfolg: zwei Anfragen pro Monat in der Saison (aus docs/projekt.md)

Projektname: Sonnenhof
Seiten: Start, Wohnungen, Preise und Belegung, Anfrage, Über uns, Impressum, Datenschutz
Funktionen: Hauptsache «Woche anfragen»: Formular mit Wunschwoche, Personen und E-Mail; Bestätigung: «Danke, Anna meldet sich innert zwei Tagen»; Fehler: «Nochmals senden», die Eingaben bleiben stehen
Zugang: keine Bereiche nur für bestimmte Leute; die Anfragen liest nur Anna in ihrem Postfach
Sprachen: Deutsch
Setup: Seite ohne eigene Dienste, Anfragen per Mail, die freien Wochen als Datei im Projekt
Testing: Am Handy sieht man ohne Scrollen den Knopf «Woche anfragen»; eine Anfrage kommt bei Anna an, und wer anfragt, bekommt eine Bestätigung; Impressum und Datenschutz sind von jeder Seite aus erreichbar
Release: vor Ostern 2027, im April beginnt die Saison; Weg ins Netz: auf dem Computer ansehen, Freigabe, Wohnort wählen, live
Pflege: Anna, die freien Wochen jeden Sonntag, die Texte zweimal im Jahr
Stand: 24.10.2026, Grundriss steht, noch nicht geprüft

## Seiten
- Start: wer wir sind, für wen, der Knopf «Woche anfragen»
- Wohnungen: «Seesicht» (4 Personen) und «Stall» (6 Personen), mit Fotos
- Preise und Belegung: Preis je Woche, freie Wochen der Saison
- Anfrage: Formular mit Wunschwoche, Personen und E-Mail
- Über uns: der Hof, die Tiere, Anna und Beat

## Inhalte
| Was | Haben wir | Fehlt noch: wer liefert bis wann |
|---|---|---|
| Fotos der Wohnungen und des Gartens | ja | |
| Texte | nein | Anna, bis 15.11.2026 |
| Logo | nein | nicht nötig für den ersten Flug |
EOF
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 24.10.2026, Grundriss steht'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Plan prüfen: zweite Meinung'
}

p4_pruefung() {
  cat > docs/plan-pruefung.md <<EOF
# Prüfung des Plans: Sonnenhof

Geprüft am: ${GEPRUEFT:-26.10.2026}
Zweite Meinung: Claude Code, Subagent in frischem Kontext, der nur docs/ las; 7 ok, 3 Risiko, 0 offen

| Punkt | Ergebnis | Stelle | Begründung |
|---|---|---|---|
| 1. Genau eine Hauptsache | ok | docs/plan.md, Funktionen | «Woche anfragen» auf jeder Seite |
| 2. Höchstens fünf bis sieben Seiten | ok | docs/plan.md, Seiten | sieben mit Impressum und Datenschutz |
| 3. Ablauf mit Bestätigung, Fehler, leerem Zustand | Risiko | docs/plan.md, Funktionen | keine Antwort, wenn eine Woche schon belegt ist |
| 4. Inhalte vorhanden oder geliefert | Risiko | docs/plan.md, Inhalte | Texte fehlen, Anna liefert bis 15.11.2026 |
| 5. Wer darf was | ok | docs/plan.md, Zugang | alles öffentlich |
| 6. Impressum, Datenschutz, Bildrechte | ok | docs/recherche.md, Pflichten | eingeplant |
| 7. Erfolgsmass | ok | docs/projekt.md, Erfolg | zwei Anfragen pro Monat |
| 8. Kosten nach dem Lancieren | Risiko | docs/plan.md, Release | wer den Wohnort bezahlt, steht noch nirgends |
| 9. Grösstes Risiko und was wegfällt | ok | docs/plan.md, Setup | ohne Buchungssystem |
| 10. Datum passt zum Umfang | ok | docs/plan.md, Release | fünf Monate für sieben Seiten |
EOF
  ersetze docs/projekt.md '^Stand: .*' "Stand: ${GEPRUEFT:-26.10.2026}, Plan geprüft, wartet auf das Ja"
}

p4_bestaetigt() {
  ersetze docs/plan.md '^Stand: .*' 'Stand: 26.10.2026, geprüft und bestätigt'
  danach docs/plan.md '^Stand: ' 'Bestätigt: 26.10.2026, «Ja, so ist er final»'
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 26.10.2026, Plan bestätigt'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Konzept: Charakter der Seite'
}

p4() { p4_pruefung; p4_bestaetigt; }

p5() {
  cat > docs/konzept.md <<'EOF'
# Konzept: Sonnenhof Merligen
Stand: 27.10.2026

Name: Sonnenhof Merligen
Kern: Für Familien mit kleinen Kindern: eine Woche Ferien mitten im Hofalltag, mit Tieren und Seeblick. Warum wir: Wir leben selbst auf dem Hof und zeigen ihn gern.
Ton: du; herzlich, einfach, wie man auf dem Hof redet
Charakter: herzlich, ruhig, ländlich
Maskottchen: nein
Muss bleiben: nichts
Bildsprache: Fotos vom Hof, von den Tieren und den Wohnungen

## Ton
| Wir sind | So ja | So nicht |
|---|---|---|
| herzlich | «Komm vorbei, die Kühe warten schon» | «Wir freuen uns auf Ihre Buchung» |
EOF
  cat > docs/inhalte.md <<'EOF'
# Inhalte: Sonnenhof

## Fotoliste
- Die Wohnung «Seesicht» am Morgen, mit Blick auf den See
- Kinder beim Füttern der Kälber
- Der Garten mit der Feuerstelle
EOF
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 27.10.2026, Konzept steht'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Gestaltung: Mockup, Richtungen, Musterblatt'
}

p6_mockup() {
  cat > design/mockup.html <<'EOF'
<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mockup: Sonnenhof Merligen</title>
<style>
  body { margin: 0; font: 17px/1.5 system-ui, sans-serif; color: #333; background: #eee; }
  section { max-width: 56rem; margin: 0 auto; padding: 1.5rem 1rem; border-bottom: 1px dashed #aaa; }
  .flaeche { background: #ccc; min-height: 10rem; }
</style>
</head>
<body>
  <section><strong>Sonnenhof Merligen</strong> · Wohnungen · Preise und Belegung · Anfrage · Über uns</section>
  <section><h1>Ferien auf dem Bauernhof, mit Blick auf den Thunersee</h1><p>Zwei Wohnungen für Familien mit kleinen Kindern.</p><p>[Knopf] Woche anfragen</p></section>
  <section><div class="flaeche"></div><p>Foto: Kinder beim Füttern der Kälber</p></section>
  <section><h2>Unsere zwei Wohnungen</h2><p>«Seesicht» für 4 Personen, «Stall» für 6 Personen</p></section>
  <section><h2>Wohnungen (wichtigste Unterseite)</h2><p>Fotos, Betten, Küche, Preis je Woche, Knopf «Woche anfragen»</p></section>
  <section>Impressum · Datenschutz</section>
</body>
</html>
EOF
}

p6() {
  p6_mockup
  mkdir -p design/richtungen
  for r in weich klar kraeftig; do
    printf '<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Richtung %s</title></head>\n<body><p>Richtung %s auf dem Mockup (vorläufige Werte).</p></body></html>\n' "$r" "$r" > "design/richtungen/$r.html"
  done
  cat > design/tokens.css <<'EOF'
/* Farbfächer des Sonnenhofs: die einzige Quelle für Farben, Schriften, Grössen, Abstände, Rundungen und Schatten.
   Kontraste nachgerechnet (Formel im Skill barrierefreiheit): Text mindestens 4,5 : 1, Knöpfe und Ränder mindestens 3 : 1. */
:root {
  /* Farben hell, jede einmal */
  --hell-grund: #faf7f2;        /* leicht warm */
  --hell-flaeche: #ffffff;
  --hell-text: #1d1b18;         /* 16,0 : 1 auf --hell-grund */
  --hell-leise: #5b564e;         /* 6,8 : 1 auf --hell-grund */
  --hell-aktion: #0b5c8c;       /* 6,7 : 1 auf --hell-grund, nur für Anklickbares */
  --hell-auf-aktion: #ffffff;   /* 7,1 : 1 auf --hell-aktion */
  --hell-rand: #8a8378;         /* 3,5 : 1 auf --hell-grund, Felder und Linien */
  --hell-fehler: #b3261e;       /* 6,1 : 1 auf --hell-grund, nur für Fehler */
  /* Farben dunkel */
  --dunkel-grund: #171614;
  --dunkel-flaeche: #23211e;
  --dunkel-text: #f1ece4;       /* 15,3 : 1 auf --dunkel-grund */
  --dunkel-leise: #b9b2a6;      /* 8,5 : 1 auf --dunkel-grund */
  --dunkel-aktion: #7cc4f0;     /* 9,4 : 1 auf --dunkel-grund */
  --dunkel-auf-aktion: #0d1b24; /* 9,1 : 1 auf --dunkel-aktion */
  --dunkel-rand: #77706a;       /* 3,7 : 1 auf --dunkel-grund */
  --dunkel-fehler: #ff8a80;     /* 7,9 : 1 auf --dunkel-grund */

  /* Was die Seiten nutzen; der Dunkelmodus tauscht nur diese Zeilen */
  --farbe-grund: var(--hell-grund);
  --farbe-flaeche: var(--hell-flaeche);
  --farbe-text: var(--hell-text);
  --farbe-leise: var(--hell-leise);
  --farbe-aktion: var(--hell-aktion);
  --farbe-auf-aktion: var(--hell-auf-aktion);
  --farbe-rand: var(--hell-rand);
  --farbe-fehler: var(--hell-fehler);

  /* Schriften: Titel mit Charakter, ruhiger Text (Systemschriften, nichts von fremden Servern) */
  --schrift-titel: Georgia, "Times New Roman", serif;
  --schrift-text: system-ui, -apple-system, "Segoe UI", sans-serif;
  --groesse-klein: 0.875rem;    /* 14 px, nie unter 12 px */
  --groesse-text: 1.0625rem;    /* 17 px */
  --groesse-h2: clamp(1.5rem, 4vw, 2rem);
  --groesse-h1: clamp(2rem, 7vw, 3.25rem);
  --zeile-text: 1.5;
  --zeile-titel: 1.1;
  --sperrung-titel: -0.02em;

  /* Abstände aus einer Reihe, dazu Breiten und Klickflächen */
  --abstand-1: 4px; --abstand-2: 8px; --abstand-3: 12px; --abstand-4: 16px; --abstand-5: 24px; --abstand-6: 32px; --abstand-7: 48px;
  --rand-seite: 16px;
  --breite-inhalt: 1200px;
  --breite-text: 70ch;
  --hoehe-knopf: 56px;
  --hoehe-feld: 48px;
  --klickflaeche: 44px;

  /* Rundungen: innen kleiner als aussen */
  --rund-klein: 6px;
  --rund-mittel: 12px;

  /* Tiefe: Fläche mit Schatten, in der Textfarbe getönt */
  --schatten-1: 0 1px 2px rgb(29 27 24 / 0.08), 0 4px 12px rgb(29 27 24 / 0.06);
  --linie: 1px solid var(--farbe-rand);

  /* Fokus: in der Aktionsfarbe, mit Abstand */
  --fokus-linie: 3px solid var(--farbe-aktion);
  --fokus-abstand: 2px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --farbe-grund: var(--dunkel-grund);
    --farbe-flaeche: var(--dunkel-flaeche);
    --farbe-text: var(--dunkel-text);
    --farbe-leise: var(--dunkel-leise);
    --farbe-aktion: var(--dunkel-aktion);
    --farbe-auf-aktion: var(--dunkel-auf-aktion);
    --farbe-rand: var(--dunkel-rand);
    --farbe-fehler: var(--dunkel-fehler);
  }
}
EOF
  cat > design/komponenten.css <<'EOF'
/* Komponenten des Sonnenhofs: Grundlage, Kopf mit Menü, Knopf, Feld, Karte, Fuss. Nur var(--…) aus tokens.css. */
body {
  margin: 0;
  background: var(--farbe-grund);
  color: var(--farbe-text);
  font-family: var(--schrift-text);
  font-size: var(--groesse-text);
  line-height: var(--zeile-text);
}
h1, h2 { font-family: var(--schrift-titel); line-height: var(--zeile-titel); letter-spacing: var(--sperrung-titel); }
h1 { font-size: var(--groesse-h1); }
h2 { font-size: var(--groesse-h2); }
a { color: var(--farbe-aktion); }

.sprung { position: absolute; left: -9999px; }
.sprung:focus { left: var(--abstand-4); }

/* Der Kopf richtet sich nach seiner eigenen Breite, darum zeigt das Musterblatt ihn auch in 390 px richtig */
.kopf {
  container: kopf / inline-size;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--abstand-3);
  padding: var(--abstand-4) var(--rand-seite);
}
.menue { display: flex; flex-wrap: wrap; gap: var(--abstand-4); margin: 0; padding: 0; list-style: none; }
.menue a { display: inline-flex; align-items: center; min-height: var(--klickflaeche); }

.knopf {
  display: inline-flex;
  align-items: center;
  min-height: var(--hoehe-knopf);
  padding: 0 var(--abstand-5);
  border: 0;
  border-radius: var(--rund-klein);
  background: var(--farbe-aktion);
  color: var(--farbe-auf-aktion);
  font: inherit;
  font-weight: 600;
}
.knopf:focus-visible, .knopf.ist-fokus { outline: var(--fokus-linie); outline-offset: var(--fokus-abstand); }
.knopf[disabled] { opacity: 0.4; }

.feld { min-height: var(--hoehe-feld); padding: 0 var(--abstand-3); border: var(--linie); border-radius: var(--rund-klein); font: inherit; }
.feld.hat-fehler { border-color: var(--farbe-fehler); }
.fehler { color: var(--farbe-fehler); }

.karte { padding: var(--abstand-5); border-radius: var(--rund-mittel); background: var(--farbe-flaeche); box-shadow: var(--schatten-1); }
.fuss { padding: var(--abstand-6) var(--rand-seite); border-top: var(--linie); color: var(--farbe-leise); font-size: var(--groesse-klein); }
EOF
  cat > design/musterblatt.html <<'EOF'
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Musterblatt · Sonnenhof Merligen</title>
  <link rel="stylesheet" href="tokens.css">
  <link rel="stylesheet" href="komponenten.css">
  <style>
    main { max-width: var(--breite-inhalt); margin: 0 auto; padding: var(--abstand-6) var(--rand-seite); }
    .farben { display: grid; grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr)); gap: var(--abstand-4); }
    .farbe { padding: var(--abstand-4); border: var(--linie); border-radius: var(--rund-mittel); }
    .handy { width: 390px; border: var(--linie); }
  </style>
</head>
<body>
  <main>
    <h1>Musterblatt</h1>
    <h2>Farben</h2>
    <div class="farben">
      <p class="farbe" style="background: var(--hell-grund); color: var(--hell-text)">Text auf Grund, hell: 16,0 : 1</p>
      <p class="farbe" style="background: var(--hell-aktion); color: var(--hell-auf-aktion)">Knopf, hell: 7,1 : 1</p>
      <p class="farbe" style="background: var(--dunkel-grund); color: var(--dunkel-text)">Text auf Grund, dunkel: 15,3 : 1</p>
    </div>
    <h2>Knöpfe</h2>
    <p><button class="knopf">Woche anfragen</button> <button class="knopf ist-fokus">Fokus</button> <button class="knopf" disabled>Gesperrt</button> gesperrt, bis Woche und E-Mail da sind</p>
    <h2>Feld mit Fehler</h2>
    <label for="m">E-Mail</label>
    <input class="feld hat-fehler" id="m" type="email" value="name@" aria-describedby="m-fehler">
    <p class="fehler" id="m-fehler">Bitte eine E-Mail-Adresse wie name@beispiel.ch</p>
    <h2>Karte</h2>
    <div class="karte"><strong>Wohnung «Seesicht»</strong><p>4 Personen, Blick auf den See</p></div>
    <h2>Kopf auf dem Handy (390 px)</h2>
    <div class="handy">
      <header class="kopf"><a href="#">Sonnenhof Merligen</a><nav><ul class="menue"><li><a href="#">Wohnungen</a></li><li><a href="#">Preise und Belegung</a></li><li><a href="#">Anfrage</a></li><li><a href="#">Über uns</a></li></ul></nav></header>
    </div>
  </main>
</body>
</html>
EOF
  cat > docs/designsystem.md <<'EOF'
# Designsystem: Sonnenhof Merligen
Stand: 28.10.2026

Reihenfolge: bestätigt am 28.10.2026
Richtung: weich
Farben: Aktion Seeblau, Grund warmes Weiss, Text fast Schwarz, Fehler Rot; hell und dunkel; Kontraste in design/tokens.css
Schriften: Titel Georgia, Text Systemschrift, beide ohne fremde Server
Abstände: Reihe 4, 8, 12, 16, 24, 32 und 48 px; Seitenrand 16 px
Komponenten: Knopf, Link, Feld mit Hilfe und Fehler, Meldung, Karte, Kopf mit Menü, Fuss
Maskottchen: nein (docs/konzept.md)
Musterblatt: gesehen am 28.10.2026, passt

## Richtung
KI-Merkmale geprüft: weich ok, klar ok, kräftig: Karten gleich gross, umgebaut
EOF
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 28.10.2026, Musterblatt gesehen'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Entwurf der ganzen Seite'
}

# Eine Seite des Entwurfs mit Kopf, Menü und Fuss: seite <datei> <titel> <inhalt von main>
seite() {
  cat > "design/entwurf/$1" <<EOF
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>$2 · Sonnenhof Merligen</title>
  <link rel="stylesheet" href="../tokens.css">
  <link rel="stylesheet" href="../komponenten.css">
  <link rel="stylesheet" href="entwurf.css">
</head>
<body>
  <a class="sprung" href="#inhalt">Zum Inhalt</a>
  <header class="kopf">
    <a href="index.html">Sonnenhof Merligen</a>
    <nav aria-label="Hauptmenü">
      <ul class="menue">
        <li><a href="wohnungen.html">Wohnungen</a></li>
        <li><a href="preise-und-belegung.html">Preise und Belegung</a></li>
        <li><a href="anfrage.html">Anfrage</a></li>
        <li><a href="ueber-uns.html">Über uns</a></li>
      </ul>
    </nav>
  </header>
  <main id="inhalt">
$3
  </main>
  <footer class="fuss">
    <p>Sonnenhof Merligen · Ferienwohnungen auf dem Bauernhof</p>
    <p><a href="impressum.html">Impressum</a> · <a href="datenschutz.html">Datenschutz</a></p>
  </footer>
</body>
</html>
EOF
}

p7() {
  mkdir -p design/entwurf/bilder
  printf '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="#cccccc"/></svg>\n' > design/entwurf/bilder/hof.svg
  cat > design/entwurf/entwurf.css <<'EOF'
/* Aufbau der Seiten im Entwurf: Breiten und Abstände, alles aus tokens.css */
main { max-width: var(--breite-inhalt); margin: 0 auto; padding: var(--abstand-6) var(--rand-seite); }
.text { max-width: var(--breite-text); }
.bild { width: 100%; height: auto; border-radius: var(--rund-mittel); }
@media (min-width: 48em) {
  .zwei { display: grid; grid-template-columns: 2fr 1fr; gap: var(--abstand-6); }
}
EOF
  seite index.html Start '    <div class="zwei">
      <div class="text">
        <h1>Ferien auf dem Bauernhof, mit Blick auf den Thunersee</h1>
        <p>Zwei Wohnungen in Merligen für Familien mit kleinen Kindern. Die Kälber warten schon.</p>
        <p><a class="knopf" href="anfrage.html">Woche anfragen</a></p>
      </div>
      <img class="bild" src="bilder/hof.svg" alt="[Platzhalter: Foto Kinder beim Füttern der Kälber]" width="600" height="400">
    </div>
    <h2>Unsere zwei Wohnungen</h2>
    <p>«Seesicht» für 4 Personen und «Stall» für 6 Personen. <a href="wohnungen.html">Zu den Wohnungen</a></p>'
  seite wohnungen.html Wohnungen '    <h1>Unsere zwei Wohnungen</h1>
    <div class="karte"><h2>Seesicht</h2><p>4 Personen, Blick auf den See, Küche mit Backofen.</p></div>
    <div class="karte"><h2>Stall</h2><p>6 Personen, ebenerdig, Garten mit Feuerstelle.</p></div>
    <p><a class="knopf" href="anfrage.html">Woche anfragen</a></p>'
  seite preise-und-belegung.html 'Preise und Belegung' '    <h1>Preise und Belegung</h1>
    <p>Seesicht: CHF 1'"'"'050.– je Woche. Stall: CHF 1'"'"'350.– je Woche. [Platzhalter: Preise von Anna bestätigen]</p>
    <h2>Freie Wochen</h2>
    <ul><li>Sa, 3. Apr. 2027 bis Sa, 10. Apr. 2027</li><li>Sa, 17. Apr. 2027 bis Sa, 24. Apr. 2027</li></ul>
    <p>Alles belegt? So sieht es dann aus: <a href="belegung-leer.html">keine freie Woche</a>.</p>'
  seite belegung-leer.html 'Keine freie Woche' '    <h1>Preise und Belegung</h1>
    <p>Diese Saison ist ausgebucht. Frag trotzdem an, manchmal wird eine Woche wieder frei.</p>
    <p><a class="knopf" href="anfrage.html">Woche anfragen</a></p>'
  seite anfrage.html Anfrage '    <h1>Woche anfragen</h1>
    <p class="text">Sag uns, welche Woche ihr möchtet. Anna meldet sich innert zwei Tagen.</p>
    <form action="anfrage-bestaetigt.html" method="get">
      <label for="woche">Wunschwoche</label>
      <input class="feld" id="woche" name="woche" required>
      <label for="personen">Personen</label>
      <input class="feld" id="personen" name="personen" type="number" min="1" max="6" required>
      <label for="mail">E-Mail</label>
      <input class="feld" id="mail" name="mail" type="email" autocomplete="email" required>
      <button class="knopf" type="submit">Woche anfragen</button>
    </form>
    <p>So sieht ein Fehler aus: <a href="anfrage-fehler.html">Fehler beim Senden</a>.</p>'
  seite anfrage-bestaetigt.html 'Anfrage angekommen' '    <h1>Danke, deine Anfrage ist da</h1>
    <p>Anna meldet sich innert zwei Tagen per Mail. Hast du dich vertippt? Schreib an [Platzhalter: Adresse von Anna].</p>
    <p><a href="index.html">Zurück zur Startseite</a></p>'
  seite anfrage-fehler.html 'Fehler beim Senden' '    <h1>Das hat nicht geklappt</h1>
    <p class="fehler">Deine Anfrage ist nicht angekommen. Deine Angaben stehen noch im Formular.</p>
    <p><a class="knopf" href="anfrage.html">Nochmals senden</a></p>'
  seite ueber-uns.html 'Über uns' '    <h1>Über uns</h1>
    <p class="text">Anna und Beat führen den Hof mit zwölf Kühen, Kälbern und zwei Katzen. [Platzhalter: Text von Anna bis 15.11.2026]</p>'
  seite impressum.html Impressum '    <h1>Impressum</h1>
    <p>[Platzhalter: Der Text kommt beim Bauen, Skill recht-ch.]</p>'
  seite datenschutz.html Datenschutz '    <h1>Datenschutz</h1>
    <p>[Platzhalter: Der Text kommt beim Bauen, Skill recht-ch.]</p>'
  seite zustaende.html 'Zustände' '    <h1>Zustände im Entwurf</h1>
    <ul>
      <li>Anfrage: <a href="anfrage.html">Formular</a>, <a href="anfrage-bestaetigt.html">Bestätigung</a>, <a href="anfrage-fehler.html">Fehler</a></li>
      <li>Belegung: <a href="preise-und-belegung.html">mit freien Wochen</a>, <a href="belegung-leer.html">ausgebucht</a></li>
    </ul>'
  cat > docs/entwurf.md <<'EOF'
# Entwurf: Sonnenhof Merligen
Stand: 29.10.2026

Werkstatt: Node 24.22.2, npm 11.19.1, Git 2.50.1 (geprüft am 29.10.2026)
Seiten: Start (index.html), Wohnungen (wohnungen.html), Preise und Belegung (preise-und-belegung.html, ausgebucht: belegung-leer.html), Anfrage (anfrage.html mit Bestätigung und Fehler), Über uns (ueber-uns.html); noch 6 Platzhalter
Rückmeldungen: 29.10.2026 ‹Die Kälber gehören ganz nach oben› → Foto der Kälber auf der Startseite oben

## Prüfung
- 29.10.2026: entwurf-pruefen.mjs grün
EOF
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 29.10.2026, Entwurf steht'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Freigabe zum Bauen'
}

p8() {
  ersetze docs/entwurf.md '^Rückmeldungen: .*' 'Rückmeldungen: 29.10.2026 ‹Die Kälber gehören ganz nach oben› → Foto der Kälber auf der Startseite oben; 30.10.2026 ‹Passt so›'
  danach docs/entwurf.md '^Rückmeldungen: ' 'Freigegeben zum Bauen: 30.10.2026, ‹Ja, so bauen›'
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 30.10.2026, Entwurf zum Bauen freigegeben'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Bauen auf dem Computer'
}

p9() {
  mkdir -p web/src/pages web/src/layouts web/src/data seite docs/pruefung
  cat > docs/stack.md <<'EOF'
# Tech-Stack

**Entscheid:** Astro, statisch
**Warum:** Texte, Fotos, freie Wochen als Datei und ein Anfrageformular, das per Mail ankommt (docs/plan.md, Setup)
**JavaScript:** nur wo nötig, höchstens 50 KB je Seite, zurzeit keins
**Baustein:** keiner
**Ausgeliefert:** der Ordner seite/; wo er wohnt, entscheidet Anna beim Lancieren
**Nicht gewählt:** WordPress, weil es für sieben Seiten einen Server und laufende Pflege braucht
EOF
  cat > docs/prd.md <<'EOF'
# PRD: Sonnenhof

Abgeleitet aus: docs/entwurf.md (Freigegeben zum Bauen: 30.10.2026)

**Für wen und wozu:** Familien mit kleinen Kindern fragen eine Woche auf dem Hof an (docs/projekt.md)
**Seiten:** wie im Entwurf: Start, Wohnungen, Preise und Belegung, Anfrage, Über uns, dazu Impressum und Datenschutz
**Funktionen:** Anfrage mit Bestätigung und Fehler, freie Wochen mit leerem Zustand, wie im Entwurf gezeigt
**Design:** design/tokens.css und docs/designsystem.md; Markup und Klassen aus design/entwurf/
**Tech-Stack:** siehe docs/stack.md
**Nicht dabei:** Online-Kasse, Buchungssystem, zweite Sprache

## Zugang (wer darf was)

| Wer | sieht | ändert |
|---|---|---|
| alle Besucher | alle Seiten | nichts |
| Anna | die Anfragen in ihrem Postfach | die freien Wochen in web/src/data/belegung.json |

Die Türen stehen in docs/tueren.txt und werden mit pruefen.mjs --tueren geprüft.

## Abnahmekriterien

Abgeleitet aus docs/plan.md (Testing:) und dem Entwurf; freigegeben mit dem Entwurf.

### Start
- [x] Überschriften, Menü und Abschnitte wie in design/entwurf/index.html (pruefen.mjs --vergleich)
- [x] Am Handy ohne Scrollen der Knopf «Woche anfragen»

### Anfrage
- [x] Absenden geht, fehlende Pflichtfelder melden sich verständlich, die Nachricht kommt bei sonnenhof@example.com an
- [x] Nach dem Absenden eine Bestätigung, bei einem Fehler «Nochmals senden» mit den Eingaben

### Für alle Seiten
- [x] Handy (390 px breit): nichts abgeschnitten, Knöpfe mindestens 44 px hoch
- [x] Kontrast: Text mindestens 4,5 : 1, Knöpfe und Ränder mindestens 3 : 1
- [x] Mit der Tastatur bedienbar, der Fokus ist sichtbar
- [x] Tempo: Lighthouse mindestens 90, höchstens 50 KB JavaScript je Seite
- [x] Jede Tür aus docs/tueren.txt antwortet wie erwartet
EOF
  cat > docs/tueren.txt <<'EOF'
# Pfad          erwarteter Status ohne Anmeldung (aus «Zugang» in docs/prd.md)
/               200
/wohnungen      200
/anfrage        200
/impressum      200
/datenschutz    200
/.env           404
/.git/config    404 403
/docs/plan.md   404     # Arbeitsdokumente gehören nicht ins Netz
EOF
  cat > web/package.json <<'EOF'
{ "name": "sonnenhof", "type": "module", "private": true, "scripts": { "build": "astro build", "preview": "astro preview" }, "dependencies": { "astro": "^7.0.0" } }
EOF
  printf "import { defineConfig } from 'astro/config';\nexport default defineConfig({ outDir: '../seite' });\n" > web/astro.config.mjs
  printf '[{ "von": "2027-04-03", "bis": "2027-04-10" }, { "von": "2027-04-17", "bis": "2027-04-24" }]\n' > web/src/data/belegung.json
  printf -- "---\nimport '../../../design/tokens.css';\nimport '../../../design/komponenten.css';\nconst { titel } = Astro.props;\n---\n<html lang=\"de\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>{titel} · Sonnenhof Merligen</title></head><body><slot /></body></html>\n" > web/src/layouts/Seite.astro
  for s in index wohnungen preise-und-belegung anfrage ueber-uns impressum datenschutz; do
    printf -- "---\nimport Seite from '../layouts/Seite.astro';\n---\n<Seite titel=\"%s\"><main id=\"inhalt\"><h1>%s</h1></main></Seite>\n" "$s" "$s" > "web/src/pages/$s.astro"
    if [ "$s" = index ]; then d=seite; else d="seite/$s"; mkdir -p "$d"; fi
    printf '<!doctype html><html lang="de"><head><meta charset="utf-8"><title>%s · Sonnenhof Merligen</title></head><body><main id="inhalt"><h1>%s</h1></main></body></html>\n' "$s" "$s" > "$d/index.html"
  done
  printf '{ "adresse": "seite/ (lokal)", "seiten": ["/", "/wohnungen/", "/preise-und-belegung/", "/anfrage/", "/ueber-uns/", "/impressum/", "/datenschutz/"], "bereiche": { "sicherheit": { "ampel": "grün", "punkte": [] }, "ablaeufe": { "ampel": "grün", "punkte": [] }, "aussehen": { "ampel": "grün", "punkte": [] }, "code": { "ampel": "grün", "punkte": [] } } }\n' > docs/pruefung/messwerte.json
  for b in sicherheit ablaeufe aussehen code; do
    printf '# Prüfung: %s\n\n**Ampel:** grün\n**In einfachen Worten:** Nichts ist rot, die Seite ist bereit für die Begehung.\n\n## Geprüft\n- messwerte.json vom 30.10.2026\n\n## Behoben\n- nichts\n\n## Offen\n- nichts\n' "$b" > "docs/pruefung/$b.md"
  done
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 30.10.2026, gebaut und geprüft, nichts rot'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Begehung und Freigabe'
}

p10_gesehen() {
  printf '\nLokal gesehen: 31.10.2026, auf dem Handy (Fotos 390 px) und am Computer (Vorschau)\nVergleich mit Entwurf: 31.10.2026, keine offene Abweichung (pruefen.mjs --vergleich)\n' >> docs/prd.md
}

p10_freigegeben() {
  printf 'Freigegeben: 31.10.2026 («Ja, ich gebe sie frei»)\n' >> docs/prd.md
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 31.10.2026, Seite freigegeben'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Wohnort wählen'
}

p10() { p10_gesehen; p10_freigegeben; }

# Wohnort bei Albatros mit Light (Seite anna wie in den lage-Attrappen)
p11() {
  cat > docs/lancieren.md <<'EOF'
# Lancieren

Wohnort: Albatros Light
Grund: Seite ohne Baustein, Anfragen per Mail (docs/plan.md, Setup); Anna will sich um nichts kümmern
Adresse: https://anna.aufwind.sh
Hafen: git@aufwind.sh:anna/projekt.git
Gewählt: 31.10.2026
EOF
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Betrieb vorbereiten'
}

# Wohnort selbst, mit den Zeilen aus dem Zustand selbst-lanciert der lage-Attrappen
p11_selbst() {
  cat > docs/lancieren.md <<'EOF'
# Lancieren

Wohnort: selbst
Grund: eigener Webspace beim Verein
Adresse: https://sonnenhof-thunersee.ch
Hafen: kein Repo, Hochladen vom Computer
Gewählt: 31.10.2026
EOF
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Betrieb vorbereiten'
}

p12() {
  cat > docs/betrieb.md <<'EOF'
# Betrieb

Rückmeldungen: Formular auf /anfrage an sonnenhof@example.com, liest Anna jeden Abend, in den Ferien Beat
Überwachung: UptimeRobot (gratis) prüft https://anna.aufwind.sh alle 5 Minuten, Mail an sonnenhof@example.com
Sicherung: Logbuch im Hafen und auf diesem Computer, zurück mit git revert
Eingang: nicht nötig (keine Anmeldung)
Statistik: nein, die Anfragen im Postfach reichen
Stand: 31.10.2026
EOF
  ersetze docs/projekt.md '^Stand: .*' 'Stand: 31.10.2026, Betrieb vorbereitet'
  ersetze docs/projekt.md '^Nächster Schritt: .*' 'Nächster Schritt: Live schalten'
}

# Ersetzt in einer Datei die erste Zeile, die zum Muster (grep -E) passt; ohne sed -i, damit es auf macOS und Linux gleich läuft
ersetze() {
  local datei=$1 muster=$2 neu=$3 tmp
  tmp=$(mktemp)
  awk -v m="$muster" -v n="$neu" '!fertig && $0 ~ m { print n; fertig = 1; next } { print }' "$datei" > "$tmp" && mv "$tmp" "$datei"
}

# Fügt nach der ersten Zeile, die zum Muster passt, eine Zeile ein
danach() {
  local datei=$1 muster=$2 neu=$3 tmp
  tmp=$(mktemp)
  awk -v m="$muster" -v n="$neu" '{ print } !fertig && $0 ~ m { print n; fertig = 1 }' "$datei" > "$tmp" && mv "$tmp" "$datei"
}

# bis P<n>: alle Phasen bis und mit n, wie im Fahrplan (P11 mit Light)
bis() {
  local ziel=${1#P} i
  for i in $(seq 1 "$ziel"); do "p$i"; done
}
