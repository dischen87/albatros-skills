/// <reference path="../pb_data/types.d.ts" />
// Mitgliederbereich: die Sammlung für Mitteilungen. Schreiben kann die Verwaltung (Tunnel, http://localhost:8090/_/).
// Lesen dürfen nur freigegebene Mitglieder; diese Regel setzt 2_mitteilungen_freigabe.js, bis dahin ist die Sammlung zu.
migrate((app) => {
  app.save(new Collection({
    type: "base",
    name: "mitteilungen",
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "titel", type: "text", required: true, max: 200 },
      { name: "text", type: "editor" },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    ],
  }));
}, (app) => {
  app.delete(app.findCollectionByNameOrId("mitteilungen"));
});
