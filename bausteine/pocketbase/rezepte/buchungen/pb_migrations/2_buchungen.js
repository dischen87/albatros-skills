/// <reference path="../pb_data/types.d.ts" />
// Buchungen: Angebote mit Terminen und Plätzen, Besucher buchen ohne Konto. Angebote und Termine pflegt die Verwaltung
// (Tunnel, http://localhost:8090/_/). Buchungen sieht nur die Verwaltung; Plätze, Status und Code setzt der Server
// (pb_hooks/buchungen.pb.js), nie der Browser. Die Seite liest die freien Plätze aus der Sicht termine_frei.
migrate((app) => {
  const angebote = new Collection({
    type: "base",
    name: "angebote",
    listRule: "aktiv = true",
    viewRule: "aktiv = true",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "titel", type: "text", required: true, max: 100 },
      { name: "beschreibung", type: "text", max: 2000 },
      { name: "ort", type: "text", max: 200 },
      { name: "preis_hinweis", type: "text", max: 200 },          // z. B. «CHF 25 pro Person, bar oder TWINT vor Ort»
      { name: "buchungsschluss_std", type: "number", min: 0 },     // so viele Stunden vor Beginn ist Schluss (0: bis zum Beginn)
      { name: "aktiv", type: "bool" },
    ],
  });
  app.save(angebote);

  const termine = new Collection({
    type: "base",
    name: "termine",
    listRule: "abgesagt = false && beginn > @now",
    viewRule: "abgesagt = false && beginn > @now",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "angebot", type: "relation", required: true, collectionId: angebote.id, maxSelect: 1 },
      { name: "beginn", type: "date", required: true },
      { name: "ende", type: "date", required: true },
      { name: "plaetze", type: "number", required: true, min: 1, onlyInt: true },
      { name: "abgesagt", type: "bool" },                          // absagen statt löschen: alle Gebuchten bekommen eine Mail
      { name: "grund", type: "text", max: 500 },
    ],
  });
  app.save(termine);

  app.save(new Collection({
    type: "base",
    name: "buchungen",
    createRule: "",       // alle dürfen buchen; was erlaubt ist, prüft pb_hooks/buchungen.pb.js
    listRule: null,       // lesen, ändern und absagen nur die Verwaltung
    viewRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "termin", type: "relation", required: true, collectionId: termine.id, maxSelect: 1 },
      { name: "anzahl", type: "number", required: true, min: 1, max: 10, onlyInt: true },
      { name: "name", type: "text", required: true, max: 100 },
      { name: "email", type: "email", required: true },
      { name: "nachricht", type: "text", max: 500 },
      { name: "status", type: "select", values: ["bestaetigt", "storniert"], maxSelect: 1 },
      { name: "storniert_von", type: "select", values: ["kunde", "betrieb"], maxSelect: 1 },
      { name: "grund", type: "text", max: 500 },
      { name: "code", type: "text", hidden: true, max: 64 },       // für den Absage-Link in der Mail, nie in einer Antwort
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    ],
  }));

  // Freie Plätze je künftigem Termin, für die Seite. Frei ist immer Plätze minus aktive Buchungen, nie ein Zähler.
  app.save(new Collection({
    type: "view",
    name: "termine_frei",
    listRule: "beginn > @now",
    viewRule: "beginn > @now",
    viewQuery: `
      SELECT t.id, t.angebot, t.beginn, t.ende, t.plaetze,
        CAST(t.plaetze - COALESCE((SELECT SUM(b.anzahl) FROM buchungen b WHERE b.termin = t.id AND b.status = 'bestaetigt'), 0) AS INTEGER) AS frei
      FROM termine t
      WHERE t.abgesagt = FALSE`,
  }));
}, (app) => {
  for (const name of ["termine_frei", "buchungen", "termine", "angebote"]) app.delete(app.findCollectionByNameOrId(name));
});
