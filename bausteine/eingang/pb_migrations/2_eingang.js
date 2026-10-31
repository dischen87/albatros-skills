/// <reference path="../pb_data/types.d.ts" />
// Baustein eingang: Grenze für POST /api/eingang/anmelden, damit niemand Passwörter durchprobiert (je Adresse 5 Versuche in 60 Sekunden).
// Die Grenze von PocketBase für /api/ allgemein (300 in 10 Sekunden) wäre dafür zu weit.
migrate((app) => {
  const s = app.settings();
  const regeln = s.rateLimits.rules.filter((r) => r.label !== "/api/eingang/anmelden");
  regeln.push({ label: "/api/eingang/anmelden", audience: "", duration: 60, maxRequests: 5 });
  s.rateLimits.rules = regeln;
  s.rateLimits.enabled = true;
  app.save(s);
}, (app) => {
  const s = app.settings();
  s.rateLimits.rules = s.rateLimits.rules.filter((r) => r.label !== "/api/eingang/anmelden");
  app.save(s);
});
