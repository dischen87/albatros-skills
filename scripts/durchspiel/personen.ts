// Personas für den Durchspiel-Test (scripts/durchspiel.ts). Jede Person weiss Dinge, die die KI erfragen muss (verdeckte Tatsachen): Die
// zweite KI spielt die Person und sagt eine Tatsache nur, wenn danach gefragt wird. Steht die Tatsache am Ende in der Ablage der
// Pflichtfrage (fahrplan.yaml), hat die KI gefragt; das prüft scripts/punkte.ts deterministisch über `muster` (ohne Gross- und Kleinschreibung).
// Alle Personen, Orte, Vereine und Adressen sind erfunden (Testdorf, Testwil, *.example), ausser der Seite im Fall curling, die nie ins Netz geht.

export type Wissen = {
  sagt: string; // was die Person weiss, für die Rolle
  frage?: string; // Pflichtfrage aus fahrplan.yaml, deren Ablage die Tatsache aufnimmt
  ablage?: string; // sonst die Ablage selbst («datei#Zeilenanfang») mit Phase
  phase?: string;
  muster?: string; // RegExp, der der Wert der Zeile am Ende genügen muss; ohne: nur für die Rolle
};
export type Persona = {
  id: string;
  titel: string;
  name: string; // für git user.name im Arbeitsordner
  weg: 'webseite' | 'geschaeft';
  stufe: 'gratis' | 'light' | 'pilot'; // Abo beim Start (Attrappe); mit --echt kommt es von der Plattform
  schloesser: number; // hinterlegte Schlösser beim Start (Attrappe); dort ist ssh-keygen nur ein Protokoll, wer bis P11 kommt, hat also eins
  erste: string; // der erste Satz an die KI
  wer: string;
  wissen: Wissen[];
  regeln?: string[];
  ende: string; // wann die Person ENDE sagt
  bis: string; // bis zu dieser Phase prüft punkte.ts (mit --bis kürzer)
  werkzeuge?: { werkzeug: string; argumente?: Record<string, string | boolean> }[];
  verboten?: string[];
  nein?: string; // feste Antwort beim ersten Ja-Moment «Freigabe zum Bauen»; erkannt am Teil vor dem Doppelpunkt
  echt?: boolean; // darf mit --echt gegen die Plattform (nur erfundene Inhalte, die Seite geht wirklich ins Netz)
  vorher?: boolean; // bestehende Seite unter {adresse}: Fotos vorher
};

const ALLGEMEIN = [
  'Antworte auf Deutsch, kurz (ein bis drei Sätze), wie ein Mensch im Chat.',
  'Du weisst nur, was oben steht. Sag davon nur, wonach die KI fragt, und erzähl nichts im Voraus.',
  'Schlag nie selbst technische Schritte vor und sag nie, was die KI als Nächstes tun soll.',
  'Musst du wählen und steht oben nichts dazu, wähle selbst etwas Passendes. Nenn nie echte Personen, Adressen oder Telefonnummern.',
  'Schlägt die KI Annahmen vor, bestätige sie, ausser sie widersprechen dem, was du weisst; dann sag, wie es richtig ist.',
  'Kostet etwas Geld (zum Beispiel Bilder erzeugen), sag Nein.',
  'Bittet sie dich, selbst eine Datei zu ändern oder im Terminal etwas zu tippen: «Das traue ich mir noch nicht zu, mach du es bitte und zeig mir, was du geändert hast.»',
  'Fragt sie, ob der Plan so gilt, ob sie den Entwurf so bauen darf oder ob du die fertige Seite freigibst, und hast du nichts dagegen, sag ausdrücklich Ja, zum Beispiel «Ja, so ist der Plan gut.», «Ja, bau ihn so.» oder «Ja, ich gebe die Seite frei.»',
];

// Rolle der zweiten KI (Systemprompt). Spätere Regeln der Persona gehen den allgemeinen vor.
export const rolle = (p: Persona, adresse = '') => [
  `Du spielst eine Person ohne Technikwissen. ${p.wer}`,
  'Was du weisst (sag es nur, wenn die KI danach fragt, und nur das Gefragte):',
  ...p.wissen.map((w) => `- ${w.sagt}`),
  `Regeln: ${[...ALLGEMEIN, ...(p.regeln ?? [])].join(' ')} Wenn sich zwei Regeln widersprechen, gilt die spätere.`,
  `${p.ende}, antworte genau: ENDE`,
].join('\n').replaceAll('{adresse}', adresse);

const KEINE = 'kein|nein|noch nicht';
const OFFEN = 'öffentlich|offen|kein|nein|alle';

export const PERSONEN: Record<string, Persona> = {
  knapp: {
    id: 'knapp', titel: 'Velowerkstatt, antwortet mit wenigen Worten (Light, bis P13)', name: 'Inhaber Speiche Testdorf',
    weg: 'webseite', stufe: 'light', schloesser: 1, bis: 'P13',
    erste: 'Ich brauche eine Webseite.',
    wer: 'Du führst allein die kleine Velowerkstatt «Speiche» in Testdorf, einem erfundenen Dorf für einen Test. Bei Albatros hast du das Abo Light schon bezahlt und einen Schlüssel hinterlegt.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Speiche», wie die Werkstatt.', muster: 'Speiche' },
      { frage: 'satz', sagt: 'Du flickst Velos und E-Bikes, schnell und zu fairen Preisen.', muster: 'Velo|E-Bike' },
      { frage: 'fuer-wen', sagt: 'Für Leute aus Testdorf und Umgebung, die mit dem Velo zur Arbeit fahren.', muster: 'Velo|Pendl|Arbeit|Testdorf' },
      { frage: 'hauptsache', sagt: 'Besucher sollen einen Reparaturtermin anfragen.', muster: 'Termin' },
      { frage: 'bestehend', sagt: 'Es gibt noch keine Webseite.', muster: KEINE },
      { frage: 'inhalte-vorhanden', sagt: 'Du hast ein Logo, aber keine Fotos und keine Texte.', muster: 'Logo' },
      { frage: 'funktionen', sagt: 'Man soll einen Termin anfragen können (Name, E-Mail, was kaputt ist), mehr nicht.', muster: 'Termin|anfrag' },
      { frage: 'zugang', sagt: 'Alles ist öffentlich, es gibt keinen Bereich nur für bestimmte Leute.', muster: OFFEN },
      { frage: 'sprachen', sagt: 'Nur Deutsch.', muster: 'Deutsch' },
      { frage: 'release', sagt: 'Online bis Ende März 2027, zum Saisonstart.', muster: 'März|0?3\\.2027|Saison' },
      { frage: 'pflege', sagt: 'Du pflegst sie selbst, etwa zweimal im Jahr (Öffnungszeiten, Preise).', muster: 'zweimal|2-mal|zwei ?mal|halbj' },
      { frage: 'name', sagt: 'Der Name «Speiche» bleibt.', muster: 'Speiche' },
      { frage: 'ton', sagt: 'Du-Form, locker.', muster: '\\bdu\\b|duzen' },
      { frage: 'charakter', sagt: 'ehrlich, schnell, handfest', muster: 'ehrlich|handfest|schnell' },
      { frage: 'maskottchen', sagt: 'Eine Figur vielleicht später, jetzt nicht.', muster: '^später' },
      { frage: 'muss-bleiben', sagt: 'Das Logo muss bleiben.', muster: 'Logo' },
      { frage: 'wohnort', sagt: 'Bei Albatros mit Light, das hast du schon.', muster: 'Light' },
      { frage: 'rueckmeldungen', sagt: 'Per E-Mail; du liest sie jeden Abend.', muster: 'Mail' },
      { frage: 'eingang', sagt: 'Nein, nur eine Seite ohne Anmeldung.', muster: '^nein|kein' },
      { frage: 'statistik', sagt: 'Nein, du willst nichts zählen.', muster: '^nein|kein' },
      { frage: 'adresse', sagt: 'Eine eigene Adresse später, nicht jetzt.', muster: 'später' },
      { frage: 'ankuendigung', sagt: 'Zuerst den Stammkunden in der Werkstatt.', muster: 'Stammkund|Kund' },
      { sagt: 'Öffnungszeiten: Dienstag bis Freitag 8 bis 12 und 14 bis 18 Uhr, Samstag 9 bis 13 Uhr. E-Mail: werkstatt@speiche-testdorf.example.' },
      { sagt: 'Fragt die KI nach dem Namen der Adresse: speiche-testdorf.' },
    ],
    regeln: ['Antworte mit höchstens fünf Wörtern, ohne Begründung.', 'Stellt die KI in einer Nachricht mehrere Fragen, beantworte nur die erste.'],
    ende: 'Sobald die KI meldet, dass deine Seite unter ihrer Adresse im Netz steht, und sie dir gezeigt hat, oder fragt sie nichts mehr',
  },
  'gratis-bis-lokal': {
    id: 'gratis-bis-lokal', titel: 'Mittagstisch ohne Abo, zahlt nicht vor der fertigen Seite, wohnt selbst (Gratis, bis P11)', name: 'Mittagstisch Testwil',
    weg: 'webseite', stufe: 'gratis', schloesser: 0, bis: 'P11',
    erste: 'Ich will eine Webseite für unseren Mittagstisch. Zahlen will ich aber erst, wenn ich sehe, was rauskommt.',
    wer: 'Du organisierst ehrenamtlich den Mittagstisch «Suppenlöffel» im Quartier Testwil, einem erfundenen Ort für einen Test: Jeden Mittwoch kochen Freiwillige im Kirchgemeindehaus für Seniorinnen, Senioren und Familien. Bei Albatros hast du nur ein Gratis-Konto.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Suppenlöffel».', muster: 'Suppenl' },
      { frage: 'satz', sagt: 'Jeden Mittwoch ein warmes Mittagessen für 8 Franken, gekocht von Freiwilligen.', muster: 'Mittag|Essen' },
      { frage: 'fuer-wen', sagt: 'Seniorinnen, Senioren und Familien aus dem Quartier.', muster: 'Senior|Famil' },
      { frage: 'hauptsache', sagt: 'Sich bis Dienstagabend fürs Essen anmelden.', muster: 'anmeld' },
      { frage: 'bestehend', sagt: 'Es gibt keine Webseite.', muster: KEINE },
      { frage: 'inhalte-vorhanden', sagt: 'Fotos vom letzten Sommerfest, sonst nichts.', muster: 'Foto' },
      { frage: 'funktionen', sagt: 'Anmeldung fürs Essen mit Name und Anzahl Personen.', muster: 'Anmeld' },
      { frage: 'zugang', sagt: 'Nein, alles ist öffentlich.', muster: OFFEN },
      { frage: 'sprachen', sagt: 'Deutsch.', muster: 'Deutsch' },
      { frage: 'release', sagt: 'Vor den Sommerferien 2027.', muster: 'Sommer|0?[67]\\.2027' },
      { frage: 'pflege', sagt: 'Du selbst, jede Woche das Menü.', muster: 'Woche|wöchentlich|Menü' },
      { frage: 'name', sagt: 'Der Name bleibt.', muster: 'Suppenl' },
      { frage: 'ton', sagt: 'Du-Form, warm und einfach.', muster: '\\bdu\\b|duzen' },
      { frage: 'charakter', sagt: 'warm, einfach, gemeinsam', muster: 'warm|gemeinsam|einfach' },
      { frage: 'maskottchen', sagt: 'Nein, keine Figur.', muster: '^nein' },
      { frage: 'muss-bleiben', sagt: 'Nichts muss bleiben.', muster: 'nichts|kein|nein' },
      { frage: 'wohnort', sagt: 'Selbst: Ein Bekannter hat Platz auf seinem Webspace.', muster: 'selbst' },
      { sagt: 'Ort: Kirchgemeindehaus Testwil, jeden Mittwoch um 12 Uhr. Kontakt: mittagstisch@testwil.example.' },
    ],
    regeln: [
      'Fragt die KI nach Abo, Bezahlen oder einem Zahlungslink, bevor du deine Seite auf deinem Computer gesehen und freigegeben hast, antworte: «Ich will zuerst sehen, was rauskommt, bevor ich etwas bezahle.»',
      'Fragt sie, wo die Seite wohnen soll: «Selbst. Ein Bekannter hat Platz auf seinem Webspace.»',
    ],
    verboten: ['upgrade_link', 'seite_erstellen', 'server_erstellen'],
    ende: 'Sobald ihr entschieden habt, wo die Seite wohnt, und die KI das aufgeschrieben hat, oder fragt sie nichts mehr',
  },
  'nein-vor-bau': {
    id: 'nein-vor-bau', titel: 'Hofladen, sagt beim ersten Mal Nein zum Bauen (Light, bis P9)', name: 'Hofladen Testmatt',
    weg: 'webseite', stufe: 'light', schloesser: 1, bis: 'P9',
    erste: 'Ich hätte gern eine Webseite für unseren Hofladen.',
    wer: 'Du führst den Hofladen auf dem Hof Testmatt, einem erfundenen Hof für einen Test: Eier, Gemüse und Most, Selbstbedienung mit Kasse. Bei Albatros hast du das Abo Light schon bezahlt und einen Schlüssel hinterlegt.',
    nein: 'Nein, so noch nicht: Die Öffnungszeiten sollen ganz oben auf der Startseite stehen.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Eierkiste».', muster: 'Eierkiste' },
      { frage: 'satz', sagt: 'Frische Eier, Gemüse und Most direkt vom Hof, Selbstbedienung.', muster: 'Eier|Gemüse|Hof' },
      { frage: 'fuer-wen', sagt: 'Familien aus der Umgebung, die regional einkaufen wollen.', muster: 'Famil|Umgebung|regional' },
      { frage: 'hauptsache', sagt: 'Vorbeikommen: Öffnungszeiten und Weg zum Hof finden.', muster: 'vorbei|Öffnungszeit|Weg' },
      { frage: 'bestehend', sagt: 'Es gibt keine Webseite.', muster: KEINE },
      { frage: 'inhalte-vorhanden', sagt: 'Ein paar Fotos vom Hof, keine Texte.', muster: 'Foto' },
      { frage: 'funktionen', sagt: 'Nur zeigen, keine Bestellung und kein Formular.', muster: 'kein|nur|zeig' },
      { frage: 'zugang', sagt: 'Nein, alles ist öffentlich.', muster: OFFEN },
      { frage: 'sprachen', sagt: 'Deutsch.', muster: 'Deutsch' },
      { frage: 'release', sagt: 'Zum Frühlingsmarkt im April 2027.', muster: 'April|0?4\\.2027|Frühling' },
      { frage: 'pflege', sagt: 'Deine Tochter, jeden Monat (Angebot der Saison).', muster: 'Tochter|Monat' },
      { frage: 'name', sagt: 'Der Name bleibt.', muster: 'Eierkiste' },
      { frage: 'ton', sagt: 'Sie-Form, freundlich.', muster: '\\bSie\\b|siez' },
      { frage: 'charakter', sagt: 'bodenständig, frisch, freundlich', muster: 'bodenständig|frisch|freundlich' },
      { frage: 'maskottchen', sagt: 'Nein, keine Figur.', muster: '^nein' },
      { frage: 'muss-bleiben', sagt: 'Das Grün vom Hofschild soll bleiben.', muster: 'grün' },
      { sagt: 'Öffnungszeiten: täglich 7 bis 19 Uhr. Der Hof liegt in Testwil (erfunden).' },
    ],
    regeln: [
      'Fragt die KI zum ersten Mal, ob sie den Entwurf so bauen darf (Freigabe zum Bauen), antworte genau: «Nein, so noch nicht: Die Öffnungszeiten sollen ganz oben auf der Startseite stehen.» Erst wenn sie das geändert und dir gezeigt hat und wieder fragt: «Ja, bau ihn so.»',
    ],
    ende: 'Sobald die KI meldet, dass deine Seite auf deinem Computer gebaut und geprüft ist, oder fragt sie nichts mehr',
  },
  lernen: {
    id: 'lernen', titel: 'Fotoclub, will lernen statt machen lassen (Gratis, bis P2)', name: 'Fotoclub Testwil',
    weg: 'webseite', stufe: 'gratis', schloesser: 0, bis: 'P2',
    erste: 'Ich will lernen, wie man eine Webseite macht, für unseren Fotoclub.',
    wer: 'Du leitest den Fotoclub «Blende 8» in Testwil, einem erfundenen Ort für einen Test. Du willst lernen, wie man eine Webseite macht, nicht nur eine bekommen. Bei Albatros hast du ein Gratis-Konto.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Blende 8».', muster: 'Blende' },
      { frage: 'satz', sagt: 'Ein Fotoclub mit Ausflügen und Bildbesprechungen.', muster: 'Foto' },
      { frage: 'fuer-wen', sagt: 'Leute ab 16, die besser fotografieren wollen.', muster: '16|fotograf|Leute' },
      { frage: 'hauptsache', sagt: 'Einmal an einen Clubabend schnuppern kommen.', muster: 'schnupper|Clubabend' },
      { frage: 'bestehend', sagt: 'Es gibt keine Webseite.', muster: KEINE },
      { frage: 'modus', sagt: 'Du willst die wichtigen Schritte selbst lernen.', muster: '^lernen' },
      { frage: 'inhalte-vorhanden', sagt: 'Viele Fotos der Mitglieder; ein Logo gibt es nicht.', muster: 'Foto' },
      { sagt: 'Clubabend jeden zweiten Montag um 19.30 Uhr im Gemeindesaal Testwil.' },
    ],
    regeln: [
      'Fragt die KI, ob sie es machen soll oder ob du lernen willst: «Ich will es lernen.»',
      'Bittet sie dich, selbst etwas zu tippen oder eine Datei zu ändern: «Das habe ich noch nie gemacht. Mach es diesmal du und zeig mir genau, was du tippst; ich schaue zu.»',
      'Stellt sie eine Kontrollfrage oder fragt sie, ob du etwas verstanden hast, antworte in eigenen Worten mit einem Satz, der den Kern trifft.',
    ],
    werkzeuge: [{ werkzeug: 'modus_waehlen', argumente: { modus: 'lernen' } }, { werkzeug: 'verstanden_melden' }],
    ende: 'Sobald die KI die Vorbilder aufgeschrieben hat und mit dem Grundriss (Plan) beginnen will, oder fragt sie nichts mehr',
  },
  geschaeft: {
    id: 'geschaeft', titel: 'Geschäftsidee Znünibox, Weg Geschäft mit Methoden (Gratis, bis P3)', name: 'Znünibox Testdorf',
    weg: 'geschaeft', stufe: 'gratis', schloesser: 0, bis: 'P3',
    erste: 'Ich habe eine Geschäftsidee und will wissen, ob sie etwas taugt.',
    wer: 'Du hast eine Geschäftsidee: die «Znünibox» für kleine Handwerksbetriebe rund um Testdorf, einen erfundenen Ort für einen Test. Jeden Morgen um 9 Uhr frische Sandwiches und Früchte, geliefert in die Werkstatt. Bei Albatros hast du ein Gratis-Konto.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Znünibox».', muster: 'Zn[üu]ni' },
      { frage: 'satz', sagt: 'Frisches Znüni, jeden Morgen in die Werkstatt geliefert.', muster: 'Zn[üu]ni|Werkstatt|geliefert' },
      { frage: 'fuer-wen', sagt: 'Kleine Handwerksbetriebe mit 3 bis 15 Leuten in der Region.', muster: 'Handwerk' },
      { frage: 'hauptsache', sagt: 'Eine Probewoche bestellen.', muster: 'Probe|bestell' },
      { frage: 'bestehend', sagt: 'Es gibt keine Webseite.', muster: KEINE },
      {
        phase: 'P1', ablage: 'docs/ideen-check.md#Entscheid:', muster: '^weiter',
        sagt: 'Gespräche hast du schon geführt, mit acht Betrieben. Sechs holen heute jeden Morgen selbst etwas beim Beck, bei zwei ist der Lehrling dafür eine halbe Stunde weg. Vier haben sich auf deine Warteliste geschrieben, zwei haben je 20 Franken für eine Probewoche angezahlt.',
      },
      { sagt: 'Preis: Du denkst an 9 Franken pro Box; die Zutaten kosten dich etwa 4 Franken.' },
      { frage: 'funktionen', sagt: 'Eine Probewoche bestellen, mit Betrieb, Anzahl Leute und Adresse.', muster: 'Probe|bestell' },
      { frage: 'zugang', sagt: 'Nein, alles ist öffentlich.', muster: OFFEN },
      { frage: 'sprachen', sagt: 'Deutsch.', muster: 'Deutsch' },
      { frage: 'release', sagt: 'Bis Ende Januar 2027.', muster: 'Januar|0?1\\.2027' },
      { frage: 'pflege', sagt: 'Du selbst, jede Woche das Angebot.', muster: 'Woche|wöchentlich|selbst' },
    ],
    regeln: ['Fragt die KI nach Gesprächen mit möglichen Kunden oder nach einem Beweis, erzähl, was du darüber weisst.'],
    ende: 'Sobald der Plan für die Webseite steht und die KI ihn prüfen lassen will, oder fragt sie nichts mehr',
  },
  musikverein: {
    id: 'musikverein', titel: 'Musikverein, auch gegen die echte Plattform (Light, bis P13)', name: 'Präsidentin Musikverein Testdorf',
    weg: 'webseite', stufe: 'light', schloesser: 1, bis: 'P13', echt: true,
    erste: 'Ich will eine Webseite für unseren Musikverein.',
    wer: 'Du bist Präsidentin des Musikvereins Testdorf, eines erfundenen Vereins für einen Test. Bei Albatros hast du das Abo Light schon bezahlt.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Harmonie Testdorf».', muster: 'Harmonie' },
      { frage: 'satz', sagt: 'Blasmusik im Dorf, gegründet 1923, rund 35 Mitglieder.', muster: 'Blasmusik|Musik' },
      { frage: 'fuer-wen', sagt: 'Junge Leute, die ein Blasinstrument spielen, und Publikum aus dem Dorf.', muster: 'jung|Publikum' },
      { frage: 'hauptsache', sagt: 'Neue Mitglieder melden sich zum Schnuppern an einer Probe.', muster: 'schnupper|Mitglied|Probe' },
      { frage: 'bestehend', sagt: 'Es gibt keine Webseite.', muster: KEINE },
      { frage: 'inhalte-vorhanden', sagt: 'Keine Bilder; die Texte schreibst du selbst, kurz und freundlich, wenn die KI danach fragt.', muster: 'kein|Text' },
      { frage: 'funktionen', sagt: 'Kontakt per E-Mail an info@musikverein-testdorf.example, kein Formular.', muster: 'Mail|Kontakt' },
      { frage: 'zugang', sagt: 'Nein, alles ist öffentlich.', muster: OFFEN },
      { frage: 'sprachen', sagt: 'Deutsch.', muster: 'Deutsch' },
      { frage: 'release', sagt: 'Vor dem Jahreskonzert am Samstag, 13. März 2027.', muster: 'März|0?3\\.2027|Jahreskonzert' },
      { frage: 'pflege', sagt: 'Du selbst, ein paar Mal im Jahr.', muster: 'Jahr|selbst' },
      { frage: 'name', sagt: 'Der Name bleibt.', muster: 'Harmonie' },
      { frage: 'ton', sagt: 'Du-Form, herzlich.', muster: '\\bdu\\b|duzen' },
      { frage: 'charakter', sagt: 'festlich, herzlich, offen', muster: 'festlich|herzlich|offen' },
      { frage: 'maskottchen', sagt: 'Nein, keine Figur.', muster: '^nein' },
      { frage: 'muss-bleiben', sagt: 'Nichts muss bleiben.', muster: 'nichts|kein|nein' },
      { frage: 'wohnort', sagt: 'Bei Albatros mit Light, das ist schon bezahlt.', muster: 'Light' },
      { frage: 'rueckmeldungen', sagt: 'Per E-Mail; du liest sie jede Woche.', muster: 'Mail' },
      { frage: 'eingang', sagt: 'Nein.', muster: '^nein|kein' },
      { frage: 'statistik', sagt: 'Nein.', muster: '^nein|kein' },
      { frage: 'adresse', sagt: 'Keine eigene Domain, nie.', muster: 'nie|nein|kein' },
      { frage: 'ankuendigung', sagt: 'Allen Mitgliedern per Mail.', muster: 'Mitglied' },
      { sagt: 'Probe jeden Donnerstag um 20 Uhr im Schulhaus Testdorf. Jahreskonzert am Samstag, 13. März 2027, um 20 Uhr in der Mehrzweckhalle Testdorf, Eintritt frei, Kollekte. Gesucht: alle Register, besonders Klarinette und Posaune.' },
    ],
    regeln: ['Fragt die KI nach dem Namen der Adresse oder schlägt sie einen vor, antworte immer: «Nimm bitte e2e-plattform, so heisst unsere Testadresse.»'],
    ende: 'Sobald die KI meldet, dass die Seite unter https://e2e-plattform.aufwind.sh im Netz steht, und sie dir gezeigt hat (eine Vorschau unter localhost heisst noch nicht, dass sie im Netz steht), oder fragt sie nichts mehr',
  },
  curling: {
    id: 'curling', titel: 'Curling Club modernisiert seine bestehende Seite (Light, bis P13, nie --echt)', name: 'Vorstand Curling',
    weg: 'webseite', stufe: 'light', schloesser: 1, bis: 'P13', vorher: true,
    erste: 'Modernisiere {adresse}',
    wer: 'Du bist im Vorstand des Curling Club Grindelwald (Bern, Schweiz). Die Webseite {adresse} gehört dem Club; heute pflegt sie der Kassier ab und zu mit Jimdo, künftig möchtest du sie selbst pflegen, ein paar Mal pro Saison. Bei Albatros hast du das Abo Light schon bezahlt und deinen Schlüssel hinterlegt.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Curling Grindelwald».', muster: 'Curling' },
      { frage: 'bestehend', sagt: 'Die bestehende Seite ist {adresse}.', muster: 'https?://|www\\.|\\.ch\\b' },
      { frage: 'fuer-wen', sagt: 'Gäste und Teams, die an den Turnieren mitspielen wollen.', muster: 'Gäst|Team|Turnier' },
      { frage: 'hauptsache', sagt: 'Sich für ein Turnier anmelden (die Ausschreibungen sind PDFs).', muster: 'Turnier|anmeld' },
      { frage: 'inhalte-vorhanden', sagt: 'Das Clublogo und die Turnierausschreibungen als PDF; eigene Fotos hast du keine zur Hand.', muster: 'Logo|PDF' },
      { frage: 'sprachen', sagt: 'Deutsch.', muster: 'Deutsch' },
      { frage: 'muss-bleiben', sagt: 'Das Clublogo muss bleiben.', muster: 'Logo' },
      { frage: 'maskottchen', sagt: 'Nein, keine Figur.', muster: '^nein' },
      { frage: 'wohnort', sagt: 'Bei Albatros mit Light, das ist schon bezahlt.', muster: 'Light' },
      { frage: 'adresse', sagt: 'Eine eigene Domain jetzt noch nicht.', muster: 'später|nein|noch nicht|nie' },
    ],
    regeln: ['Fragt sie nach Rechten an Texten und Bildern: Sie gehören dem Club, du bist im Vorstand.', 'Fragt sie nach dem Namen der Adresse: «curling-grindelwald».'],
    ende: 'Sobald die Seite im Hafen ist und die KI meldet, dass sie unter ihrer Adresse läuft, oder fragt sie nichts mehr',
  },
  buchung: {
    id: 'buchung', titel: 'Yogastudio mit Platzbuchung, Pilot mit Baustein (Gratis, wählt beim Wohnort, bis P13)', name: 'Inhaberin Yogaraum Testwil',
    weg: 'webseite', stufe: 'gratis', schloesser: 1, bis: 'P13',
    erste: 'Ich habe ein kleines Yogastudio und will eine Webseite, auf der man meine Kurse sieht und einen Platz buchen kann.',
    wer: 'Du bist Mira, Inhaberin des Yogaraums Testwil, eines erfundenen kleinen Yogastudios für einen Test (den Ort Testwil gibt es nicht). Du unterrichtest allein im Yogaraum im alten Schulhaus Testwil, höchstens 12 Plätze pro Kurs. Bei Albatros bist du angemeldet und hast deinen Schlüssel schon hinterlegt (eine Bekannte hat dir das eingerichtet); ein Abo hast du noch keins.',
    wissen: [
      { frage: 'projektname', sagt: 'Das Projekt heisst «Yogaraum Testwil».', muster: 'Yogaraum' },
      { frage: 'fuer-wen', sagt: 'Leute aus Testwil und Umgebung, die Yoga machen wollen, auch Ältere (Yoga 60+).', muster: 'Yoga|60' },
      { frage: 'hauptsache', sagt: 'Einen Platz in einem Kurs buchen.', muster: 'buch' },
      { frage: 'bestehend', sagt: 'Es gibt keine Webseite.', muster: KEINE },
      { frage: 'funktionen', sagt: 'Für einen bestimmten Termin einen Platz buchen, mit Name und E-Mail, ohne eigenes Konto; Bestätigung per Mail; ist ein Kurs voll, kann man nicht mehr buchen. Bezahlt wird vor Ort bar oder mit TWINT, nicht online.', muster: 'buch' },
      { frage: 'zugang', sagt: 'Nur du selbst siehst, wer gebucht hat, und kannst eine Buchung absagen, am liebsten auch am Handy.', muster: 'Inhaberin|Verwaltung|absag|nur|ich' },
      { frage: 'sprachen', sagt: 'Deutsch.', muster: 'Deutsch' },
      { frage: 'maskottchen', sagt: 'Nein; schlichte Formen oder Icons sind gut, erzeugte Fotos willst du nicht.', muster: '^nein' },
      { frage: 'wohnort', sagt: 'Bei Albatros; welches Abo, weisst du nicht.', muster: 'Pilot' },
      { sagt: 'Wochenplan: Montag 18.30 Hatha (75 Minuten), Dienstag 9.00 Yoga 60+ (60 Minuten), Dienstag 19.00 Vinyasa (75 Minuten), Mittwoch 18.30 Yin Yoga (75 Minuten), Donnerstag 12.15 Mittagsyoga (45 Minuten), Samstag 9.30 Vinyasa (90 Minuten).' },
      { sagt: 'Preise: Einzelstunde CHF 28, 10er-Abo CHF 250. Kontakt: hallo@yogaraum-testwil.example. Fotos hast du keine.' },
    ],
    regeln: [
      'Fragt die KI, welches Abo du willst, ohne eines zu empfehlen: «Ich weiss nicht, was ich brauche. Was empfiehlst du?» Gibt sie dir einen Link zur Zahlungsseite: «Erledigt, ich habe bezahlt.»',
      'Fragt sie nach dem Namen der Adresse oder schlägt sie einen vor, antworte immer: «Nimm bitte yogaraum-testwil.»',
      'Bittet sie dich, im Browser etwas anzulegen oder einzugeben (Konto, Passwort, Schlüssel für Mails): «Erledigt.»',
      'Erst wenn die KI meldet, dass die Seite unter https://yogaraum-testwil.aufwind.sh im Netz steht, und sie dir gezeigt hat, fragst du einmal: «Super! Wie sehe ich jetzt am Handy, wer gebucht hat, und wie sage ich eine Buchung ab?»',
    ],
    ende: 'Hat sie das erklärt, oder fragt sie nichts mehr',
  },
};
