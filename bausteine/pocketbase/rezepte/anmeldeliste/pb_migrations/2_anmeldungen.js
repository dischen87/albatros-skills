/// <reference path="../pb_data/types.d.ts" />
// Anmeldeliste: Alle dürfen sich eintragen, lesen kann nur die Verwaltung (Tunnel, http://localhost:8090/_/).
migrate((app) => {
  app.save(new Collection({
    type: "base",
    name: "anmeldungen",
    createRule: "",       // leer heisst: alle dürfen
    listRule: null,       // null heisst: nur die Verwaltung
    viewRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "name", type: "text", required: true, max: 100 },
      { name: "email", type: "email", required: true },
      { name: "anlass", type: "text", max: 100 },
      { name: "nachricht", type: "text", max: 2000 },
      { name: "created", type: "autodate", onCreate: true, onUpdate: false },
    ],
  }));
}, (app) => {
  app.delete(app.findCollectionByNameOrId("anmeldungen"));
});
