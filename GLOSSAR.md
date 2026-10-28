# Glossar: Albatros in vier Sprachen

Gleiche Begriffe überall: Skills, Missionen, Website, Videos. Wer übersetzt, nimmt diese Wörter und keine Synonyme. Die Slugs der Skills und Kennungen der Missionen bleiben deutsch (`ssh-schluessel`, `flugschule-01-start`), damit `lage` und die Website sie in jeder Sprache finden.

## Wo die Übersetzungen liegen

- **Skills:** je Sprache ein eigenes Plugin mit denselben Slugs: `plugins/albatros-fr/skills/<slug>/SKILL.md`, ebenso `albatros-it` und `albatros-en`, je mit `.claude-plugin/plugin.json` und `.mcp.json` wie `plugins/albatros`. Deutsch bleibt `plugins/albatros`. Name und Slug im Kopf bleiben deutsch, die `description` ist übersetzt.
- **Missionen:** `uebersetzungen/<sprache>/missionen/<weg>/<gleicher Dateiname>.md`. Im Kopf nur `titel` und `bild`, darunter der übersetzte Text. Alles andere (Kennung, Stufe, Skill, Prüfung, Dauer) kommt aus der deutschen Mission.
- **Projektvorlage und Server:** `uebersetzungen/<sprache>/vorlage/` (gleiche Pfade wie `vorlage/`) und `uebersetzungen/<sprache>/instanz/` (Bordbuch, Hinweise für die KI, Begrüssung; die deutschen liegen in albatros-flotte unter `src/instanz/`). flotte nimmt sie, wenn Server oder Seite mit `sprache` entstehen. YAML bleibt gleich gebaut wie das deutsche, nur Kommentare, `name:` und Texte in Anführungszeichen sind übersetzt (`bun run pruefen` prüft das).
- Fehlt eine Übersetzung, zeigen Website und Lotse die deutsche Fassung.

Anrede: Deutsch «du», Französisch «tu», Italienisch «tu», Englisch «you» (locker, nicht förmlich). Schweizer Schreibweise: Deutsch mit «ss», Französisch und Italienisch mit «» (wie in der Schweiz), Englisch britisch (colour, organise). Preise: «CHF 15» in allen Sprachen.

| Deutsch | Français | Italiano | English | Bedeutung |
|---|---|---|---|---|
| Albatros | Albatros | Albatros | Albatros | Marke, nie übersetzen |
| Flugschule | école de vol | scuola di volo | flight school | die Plattform als Bild |
| Lotse (Hauptskill `lotse`) | aiguilleur du ciel (kurz: l'aiguilleur) | controllore di volo | air traffic controller | sagt aus dem Turm im richtigen Moment, was dran ist; «navigateur/navigatore/navigator» nicht verwenden (Browser, Navi, sitzt im Flugzeug) |
| Bibliothek | bibliothèque | biblioteca | library | alle Skills, frei lesbar |
| Skill | skill | skill | skill | |
| Mission | mission | missione | mission | |
| abheben · Idee und Produkt | décoller · idée et produit | decollare · idea e prodotto | take off · idea and product | Stufe 1 |
| fliegen · Setup und live gehen | voler · mise en place et mise en ligne | volare · configurazione e messa online | fly · set-up and going live | Stufe 2 |
| landen · der erste Fan | atterrir · le premier fan | atterrare · il primo fan | land · your first fan | Stufe 3 |
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
| eigene Domain | propre domaine | dominio proprio | own domain | |
| Zurück auf gestern (Snapshot) | retour à hier | ritorno a ieri | back to yesterday | |
| Foto des Servers (Snapshot) | photo du serveur | foto del server | photo of the server | |
| Coach · KI | Coach · IA | Coach · IA | Coach · AI | Kennzeichen der KI |
| KI im Terminal | IA dans le terminal | IA nel terminale | AI in the terminal | Claude Code, Codex, Gemini CLI |
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
| Rucksack (die KI kommt mit) | sac à dos | zaino | rucksack | immer mit allen drei Namen: Claude Code, Codex, Gemini CLI |
| Baustein | brique | blocco | building block | fertiges Teil für die Seite (Skill `bausteine`) |
| Fertigteile beim Hausbau | éléments préfabriqués dans la construction d'une maison | elementi prefabbricati nella costruzione di una casa | prefab parts when building a house | Bild für Bausteine |
| Anmeldeliste | liste d'inscription | lista di iscrizione | sign-up list | Baustein (PocketBase) |
| Mitgliederbereich mit Login | espace membres avec connexion | area membri con accesso | members' area with login | Baustein (PocketBase) |
| Pinnwand | tableau d'affichage | bacheca | noticeboard | Baustein (PocketBase) |
| grosses CMS | grand CMS | CMS grande | big CMS | Baustein (Strapi mit Postgres) |
| Verwaltung (Admin-Bereich) | administration | amministrazione | admin area | |
| Arbeitsspeicher | mémoire vive | memoria di lavoro (RAM) | memory (RAM) | |
| geheimer Gang (SSH-Tunnel) | passage secret (tunnel) | passaggio segreto (tunnel) | secret passage (tunnel) | |
