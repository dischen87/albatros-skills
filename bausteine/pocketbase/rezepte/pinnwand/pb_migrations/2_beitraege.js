/// <reference path="../pb_data/types.d.ts" />
// Pinnwand: Beiträge (News, Anlässe) pflegst du in der Verwaltung (Tunnel, http://localhost:8090/_/), alle dürfen sie lesen.
migrate((app) => {
  app.save(new Collection({
    type: "base",
    name: "beitraege",
    listRule: "",         // leer heisst: alle dürfen lesen
    viewRule: "",
    createRule: null,     // schreiben nur die Verwaltung
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "titel", type: "text", required: true, max: 200 },
      { name: "datum", type: "date" },
      { name: "text", type: "editor" },
      { name: "bild", type: "file", maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp"], thumbs: ["800x0"] },
    ],
  }));
}, (app) => {
  app.delete(app.findCollectionByNameOrId("beitraege"));
});
