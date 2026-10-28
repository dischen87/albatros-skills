/// <reference path="../pb_data/types.d.ts" />
// Mitgliederbereich: Mitteilungen sehen nur angemeldete Mitglieder. Schreiben kann die Verwaltung (Tunnel, http://localhost:8090/_/).
// Die Mitglieder selbst liegen in der Sammlung users, die PocketBase schon mitbringt.
migrate((app) => {
  app.save(new Collection({
    type: "base",
    name: "mitteilungen",
    listRule: "@request.auth.collectionName = 'users'",   // nur angemeldete Mitglieder
    viewRule: "@request.auth.collectionName = 'users'",
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
