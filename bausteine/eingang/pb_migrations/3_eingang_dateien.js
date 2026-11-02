/// <reference path="../pb_data/types.d.ts" />
// Baustein eingang: eigene Grenze für Dateien (/api/files/), Nachbesserung 02.11.2026 (Welle 8, w8-45). Der Eingang holt grosse Dateien in
// Stücken à 64 KB mit Range, je Stück eine Anfrage an PocketBase, mit der Adresse der Besucherin in X-Forwarded-For. Die Grenze von
// PocketBase für /api/ allgemein (300 in 10 Sekunden je Adresse) brach so einen Film von 25 MB und eine Galerie mit 12 Fotos à 2 MB mit 429
// ab. Für Dateien gilt darum 10 000 in 10 Sekunden je Adresse (rund 600 MB in Stücken). Die Anfragen der Besucherin selbst begrenzt der
// Eingang (600 je Minute und Adresse), und von aussen kommt niemand an ihm vorbei zu PocketBase (README, «Grenzen»). PocketBase nimmt die
// erste passende Regel, darum steht diese vor «/api/».
const REGELN = [{ label: "/api/files/", audience: "", duration: 10, maxRequests: 10000 }];

migrate((app) => {
  const s = app.settings();
  s.rateLimits.rules = [...REGELN, ...s.rateLimits.rules.filter((r) => !REGELN.some((x) => x.label === r.label))];
  s.rateLimits.enabled = true;
  app.save(s);
}, (app) => {
  const s = app.settings();
  s.rateLimits.rules = s.rateLimits.rules.filter((r) => !REGELN.some((x) => x.label === r.label));
  app.save(s);
});
