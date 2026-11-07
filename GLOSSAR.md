# Glossar: Albatros in vier Sprachen

Gleiche Begriffe überall: Skills, Missionen, Website, Videos. Wer übersetzt, nimmt diese Wörter und keine Synonyme. Die Slugs der Skills und Kennungen der Missionen bleiben deutsch (`ssh-schluessel`, `flugschule-01-start`), damit `lage` und die Website sie in jeder Sprache finden.

## Wo die Übersetzungen liegen

- **Skills:** je Sprache ein eigenes Plugin mit denselben Slugs: `plugins/albatros-fr/skills/<slug>/SKILL.md`, ebenso `albatros-it` und `albatros-en`, je mit `.claude-plugin/plugin.json` und `.mcp.json` wie `plugins/albatros`. Deutsch bleibt `plugins/albatros`. Name und Slug im Kopf bleiben deutsch, die `description` ist übersetzt.
- **Missionen:** `uebersetzungen/<sprache>/missionen/<weg>/<gleicher Dateiname>.md`. Im Kopf `titel`, `bild` und, wo die deutsche Mission sie hat, `verstehen` (gleich viele Kontrollfragen) übersetzt, dazu `phase` und `optional` gleich wie Deutsch; darunter der übersetzte Text. Alles andere (Kennung, Stufe, Skill, Prüfung, Dauer) kommt aus der deutschen Mission. `bun run pruefen` prüft das.
- **Stand der Skills:** Jede übersetzte `SKILL.md` nennt in `metadata.quelle` den deutschen Text, nach dem sie übersetzt ist (siehe README, «Prüfen»). Ändert sich der deutsche Text, gilt die Übersetzung als veraltet, bis sie nachgeführt ist.
- **Projektvorlage und Server:** `uebersetzungen/<sprache>/vorlage/` (gleiche Pfade wie `vorlage/`) und `uebersetzungen/<sprache>/instanz/` (Bordbuch, Hinweise für die KI, Begrüssung; die deutschen liegen in albatros-flotte unter `src/instanz/`). flotte nimmt sie, wenn Server oder Seite mit `sprache` entstehen. YAML bleibt gleich gebaut wie das deutsche, nur Kommentare, `name:` und Texte in Anführungszeichen sind übersetzt (`bun run pruefen` prüft das).
- Fehlt eine Übersetzung, zeigen Website und Lotse die deutsche Fassung.

Anrede: Deutsch «du», Französisch «tu», Italienisch «tu», Englisch «you» (locker, nicht förmlich). Schweizer Schreibweise: Deutsch mit «ss», Französisch und Italienisch mit «» (wie in der Schweiz), Englisch britisch (colour, organise). Preise: «CHF 15» in allen Sprachen.

Projektdateien der Person: In `docs/` bleiben die Zeilennamen (`Projektname:`, `Freigegeben:` …) und die Marken `[Annahme: …]` und `[offen: …]` in jeder Sprache deutsch, damit `lage` und die Prüfskripte sie lesen; nach dem Doppelpunkt schreibt die KI in der Sprache der Person. Jede übersetzte `SKILL.md`, die die Marken nutzt, sagt das in einem Satz. Übersetzt ist nur der Platzhalter im Entwurf (`[à compléter]`, `[da completare]`, `[placeholder]`), denn ihn liest die Person auf der Seite. Welche Wörter als Marke zählen, steht in `fahrplan.yaml` unter `marken`; dort steht auch, welche Werte am Anfang einer Zeile deutsch bleiben (`werte`, z. B. `Eigene Domain: später`).

| Deutsch | Français | Italiano | English | Bedeutung |
|---|---|---|---|---|
| Albatros | Albatros | Albatros | Albatros | Marke, nie übersetzen |
| Flugschule | école de vol | scuola di volo | flight school | die Plattform als Bild |
| Lotse (Hauptskill `lotse`) | aiguilleur du ciel (kurz: l'aiguilleur) | controllore di volo | air traffic controller | sagt aus dem Turm im richtigen Moment, was dran ist; «navigateur/navigatore/navigator» nicht verwenden (Browser, Navi, sitzt im Flugzeug) |
| Bibliothek | bibliothèque | biblioteca | library | alle Skills, frei lesbar |
| Lernen oder machen (Modus) | apprendre ou faire | imparare o fare | learn or do | Zeile `Modus:` in `docs/projekt.md` mit `lernen` oder `machen`, die Werte bleiben deutsch |
| Lücken melden (`luecke_melden`) | signaler les lacunes | segnalare le lacune | reporting gaps | wo das Know-how fehlt, nur mit Einwilligung; niemand antwortet darauf |
| Anfrage (Feld `anfrage` von `lage`) | demande | richiesta | request | worum die Person die KI gerade bittet, umformuliert, nur mit Einwilligung; was ein Mensch sehen muss, geht mit `coach_fragen` und `anliegen` |
| Besucheranfrage (eines Besuchers, «Platz anfragen») | demande d'un visiteur | richiesta di un visitatore | enquiry | was Besucher über die Seite der Person schicken; nicht dasselbe wie das Feld `anfrage` von `lage` |
| Skill | skill | skill | skill | |
| Mission | mission | missione | mission | |
| Fahrplan (`fahrplan.yaml`) | plan de vol | piano di volo | flight plan | der feste Ablauf in 13 Phasen (P1 bis P13); die Phasen nennt nur `lage`, der Person zeigt die KI die Etappen |
| Etappe | grande étape | tappa | stage | drei Etappen des Fahrplans; auf Französisch nicht «étape», das heisst schon Schritt |
| Phase (P1 bis P13) | phase | fase | phase | einer der 13 Teile des Fahrplans, mit Skill, Ergebnis und Pflichtfragen; heisst nie «Schritt» |
| Schritt (Insel-Schritt, `schritt_melden`) | étape (sur l'île) | passo (sull'isola) | step (on the island) | was die KI mit `schritt_melden` meldet, 19 Schritte von `idee` bis `domain`; eine Phase hat einen oder mehrere Schritte, P13 je nach Wohnort andere |
| abheben · Idee und Produkt | décoller · l'idée et le produit | decollare · l'idea e il prodotto | take off · the idea and the product | Etappe 1 (P1 bis P8): bis zum Entwurf zum Durchklicken |
| fliegen · bauen und freigeben | voler · construire et valider | volare · costruire e approvare | fly · build and release | Etappe 2 (P9 bis P11): die Seite auf dem eigenen Computer, Freigabe, Wohnort |
| landen · live und der erste Fan | atterrir · la mise en ligne et le premier fan | atterrare · la messa online e il primo fan | land · going live and your first fan | Etappe 3 (P12, P13 und danach); in Missionen heisst das Feld `stufe` |
| Anlauf | élan | rincorsa | run-up | |
| Bordkarte (Konto) | carte d'embarquement | carta d'imbarco | boarding pass | |
| Cockpit | cockpit | cockpit | cockpit | |
| Gratis · Light · Pilot | Gratuit · Light · Pilot | Gratis · Light · Pilot | Free · Light · Pilot | Stufen; Light und Pilot sind Namen |
| Weg Webseite | parcours site web | percorso sito web | website path | |
| Weg Geschäft | parcours entreprise | percorso attività | business path | |
| Methode (Weg Geschäft) | méthode | metodo | method | privat, nur für Mitglieder |
| Hausschlüssel (privater SSH-Schlüssel) | clé de la maison | chiave di casa | house key | bleibt auf dem Computer |
| Schloss (öffentlicher SSH-Schlüssel) | serrure | serratura | lock | kommt auf den Server |
| Server (Wohnung im grossen Haus) | serveur (appartement dans un grand immeuble) | server (appartamento in un grande palazzo) | server (flat in a big building) | |
| Seite (Light, Schaufenster) | page (vitrine) | pagina (vetrina) | page (shop window) | |
| Logbuch (Git-Repo) | journal de bord | diario di bordo | logbook | |
| Flugbuch (Fortschritt im Cockpit) | carnet de vol | libretto di volo | flight log | |
| Bordbuch (`~/BORDBUCH.md` auf dem Server) | manuel de bord | manuale di bordo | flight manual | erklärt den Server; Dateiname bleibt |
| Hafen (code.aufwind.sh) | port | porto | harbour | wo das Logbuch liegt |
| Fliessband (Pipeline) | tapis roulant | nastro trasportatore | conveyor belt | |
| Adresse (name.aufwind.sh) | adresse | indirizzo | address | |
| eigene Domain | propre domaine | dominio proprio | own domain | freiwillig (P13); die Zeile `Eigene Domain:` in `docs/live.md` beginnt mit `jetzt`, `später` oder `nie`, deutsch |
| Zurück auf gestern (Snapshot) | retour à hier | ritorno a ieri | back to yesterday | |
| Foto des Servers (Snapshot) | photo du serveur | foto del server | photo of the server | |
| Coach · KI | Coach · IA | Coach · IA | Coach · AI | Kennzeichen der KI |
| KI im Terminal | IA dans le terminal | IA nel terminale | AI in the terminal | Claude Code, Codex, Gemini CLI, Cursor |
| Community | communauté | community | community | |
| der erste Fan | le premier fan | il primo fan | your first fan | |
| Hoppla | Oups | Ops | Oops | kleiner Fehler, nichts kaputt |
| Browser | navigateur web | browser | browser | |
| Schloss-Symbol im Browser (HTTPS) | cadenas | lucchetto | padlock | nicht dasselbe wie das SSH-Schloss |
| Telefonbuch (DNS) | annuaire | elenco telefonico | phone book | |
| Repo | dépôt | repository | repository | wenn das Wort nötig ist, sonst Logbuch |
| Arbeiter am Fliessband | ouvrier | operaio | worker | |
| Landingpage | landing page | landing page | landing page | |
| Bert | Bert | Bert | Bert | der Albatros, Maskottchen; Name nie übersetzen |
| Berts Arbeitsplatz | le poste de travail de Bert | la postazione di Bert | Bert's workspace | die Startseite der Person auf ihrem Computer (lokaler Server `albatros-arbeitsplatz`): Aktivität, Erstelltes, Vorschläge, Fragen, Ja-Momente; nicht die Werkstatt (Node, npm, Git) und nicht das Cockpit auf albatros.build |
| Schnellstart (Skill `schnellstart`) | démarrage rapide | avvio rapido | quick start | in wenigen Minuten die ersten Stücke einer neuen Idee, nur im Modus machen; Bild: der erste Rundflug (le premier vol panoramique, il primo volo panoramico, the first sightseeing flight) |
| Arbeitslogo (`design/logo.svg`) | logo provisoire | logo provvisorio | working logo | schwarz und grau, bis Konzept und Musterblatt das richtige Logo bringen |
| Vorschlag (vorgeschlagene Aufgabe) · Ideen-Karte | proposition · carte d'idée | proposta · scheda idea | suggestion · idea card | Karten im Arbeitsplatz; die Ideen-Karte mit «Das erkunden» und «Nicht jetzt» (Explorer, Pas maintenant · Esplorare, Non ora · Explore this, Not now) |
| Entwurf nach aussen (Werkzeug `entwurf`) | brouillon | messaggio in bozza | draft | Mail, Beitrag, Kontaktaufnahme: liegt im Arbeitsplatz, gesendet wird nichts; nicht die ébauche/bozza der Seite (P7), auf Italienisch nie «bozza approvata» |
| Rucksack (die KI kommt mit) | sac à dos | zaino | rucksack | immer mit allen vier Namen: Claude Code, Codex, Gemini CLI, Cursor |
| Baustein | brique | blocco | building block | fertiges Teil für die Seite (Skill `bausteine`) |
| Fertigteile beim Hausbau | éléments préfabriqués dans la construction d'une maison | elementi prefabbricati nella costruzione di una casa | prefab parts when building a house | Bild für Bausteine |
| Anmeldeliste | liste d'inscription | lista di iscrizione | sign-up list | Baustein (PocketBase) |
| Mitgliederbereich mit Login | espace membres avec connexion | area membri con accesso | members' area with login | Baustein (PocketBase) |
| Pinnwand | tableau d'affichage | bacheca | noticeboard | Baustein (PocketBase) |
| grosses CMS | grand CMS | CMS grande | big CMS | Baustein (Strapi mit Postgres) |
| einen Altbau renovieren | rénover une vieille maison | ristrutturare una casa vecchia | renovating an old house | Bild für `webseite-modernisieren` |
| Bestandsaufnahme · Bestandsplan (`docs/bestand.md`) | état des lieux · plan de l'état des lieux | inventario · piano dell'inventario | inventory · inventory plan | was die alte Seite hat |
| der Rohbau in der eigenen Werkstatt | le gros œuvre dans ton propre atelier | il rustico nella tua officina | the shell in your own workshop | Bild für `webseite-bauen` (P9, P10) |
| Skizze (`design/skizze.html`) | esquisse | schizzo | sketch | die graue Startseite aus P1; nur sie heisst «graue Skizze», in P6 wird daraus das graue Mockup |
| zweite Meinung | deuxième avis | secondo parere | second opinion | P4: Prüfung des Plans in frischem Kontext gegen die feste Prüfliste |
| graues Mockup (`design/mockup.html`) | maquette grise | mockup grigio | grey mockup | P6, Skill `gestaltung`: die graue Startseite in ihrer Reihenfolge («Stimmt die Reihenfolge im grauen Mockup?», Zeile `Reihenfolge: bestätigt am <Datum>`); Insel-Schritt `mockup`; nie «Skizze» |
| drei Richtungen | trois directions | tre direzioni | three directions | P6, `design/richtungen/`; Insel-Schritt `entwuerfe`, sobald das Musterblatt gesehen ist |
| PRD (`docs/prd.md`) | PRD | PRD | PRD | P9, Skill `webseite-bauen`: der Bauplan, aus dem freigegebenen Entwurf abgeleitet, ohne eigene Unterschrift |
| Insel (Cockpit) | île | isola | island | dort wächst pro Projekt ein Haus mit jedem Schritt |
| Konzept (Skill `konzept`) | concept | concetto | concept | Charakter vor Farben |
| Musterblatt | planche d'échantillons | tavola dei campioni | sample sheet | Farben, Schriften, Knöpfe und Felder auf einem Blatt; nach dem Ja der Person `Musterblatt: gesehen am <Datum>` in `docs/designsystem.md`, deutsch |
| Entwurf (ganze Seite zum Durchklicken, Skill `entwurf`) | ébauche | bozza | draft | das begehbare Modell vor dem Rohbau (P7) |
| Modell (Bild für den Entwurf) | modèle | modello | model | das begehbare Modell des Hauses vor dem Rohbau (P7, Skill `entwurf`); auf Französisch «modèle», nicht «maquette», das ist das graue Mockup aus P6 |
| Werkstatt (Node, npm und Git auf dem Computer, bei einem Baustein auch Bun) | atelier | officina | workshop | P7: vor dem Entwurf geprüft (Zeile `Werkstatt:`), ab da helfen Prüfskripte |
| Attrappe (Seite eines Bausteins im Entwurf) | factice | simulazione | dummy | sieht aus wie echt, sendet aber nichts; gebaut wird sie in P9 |
| [Platzhalter] | [à compléter] | [da completare] | [placeholder] | fehlender Text im Entwurf |
| Freigabe zum Bauen | autorisation de construire | via libera per costruire | approval to build | Ja zum Entwurf (P8); `Freigegeben zum Bauen:` bleibt deutsch |
| Freigabe (Ja zum Livegang) | validation | approvazione | release | `Freigegeben:` bleibt deutsch (P10) |
| Wohnort (Skill `lancieren`) | domicile (où ton site habite) | domicilio (dove abita il sito) | where it lives | Light, Pilot oder selbst |
| selbst (Wohnort ausserhalb von Albatros) | par toi-même | da te | hosting it yourself | |
| Betrieb (Skill `betrieb`) | exploitation | gestione | running it | P12: Rückmeldungen, Überwachung, Sicherung, Eingang, Statistik |
| Eingang (Baustein `eingang`) | entrée | ingresso | entrance | ein Login für alle Teile der Seite, nur mit eigenem Server und nur nach den Kriterien im Skill `bausteine`; Zeile `Eingang:` in `docs/betrieb.md` |
| freischalten (ein Mitglied) | activer | abilitare | approve | nur die Verwaltung, im Rezept `mitglieder` das Feld `freigegeben`; nicht dasselbe wie die Freigabe einer Seite |
| Live schalten | mise en ligne | messa online | going live | |
| `[Annahme: …]` | `[Annahme: …]` (hypothèse) | `[Annahme: …]` (ipotesi) | `[Annahme: …]` (assumption) | Vorschlag der KI, den die Person bestätigt, alle Annahmen einer Phase in einer Nachricht |
| `[offen: …]` | `[offen: …]` (ouvert) | `[offen: …]` (aperto) | `[offen: …]` (open) | was noch niemand beantwortet hat; `lage` zählt die Zeile als offen |
| Guthaben | crédit | credito | credit | für Bilder, Freistellen und 3D (Selbstkosten plus 35 %) |
| Charakter statt Farben | le caractère avant les couleurs | il carattere prima dei colori | character before colours | Gestaltung: zuerst Eigenschaften |
| Verwaltung (Admin-Bereich) | administration | amministrazione | admin area | |
| Arbeitsspeicher | mémoire vive | memoria di lavoro (RAM) | memory (RAM) | |
| geheimer Gang (SSH-Tunnel) | passage secret (tunnel) | passaggio segreto (tunnel) | secret passage (tunnel) | |
