/// <reference path="../pb_data/types.d.ts" />
// Baustein eingang: Grenze fürs Anmelden, damit niemand Passwörter durchprobiert (je Adresse 5 Versuche in 60 Sekunden). Sie gilt für
// POST /api/eingang/anmelden und für die Handlung «anmelden» der Mitglieder (users:auth, etwa auth-with-password), die durch den Eingang
// ebenso erreichbar ist. Die Grenzen von PocketBase für /api/ allgemein (300 in 10 Sekunden) und *:auth (2 in 3 Sekunden) wären dafür zu weit.
const REGELN = [
  { label: "/api/eingang/anmelden", audience: "", duration: 60, maxRequests: 5 },
  { label: "users:auth", audience: "", duration: 60, maxRequests: 5 },
];

migrate((app) => {
  const s = app.settings();
  const regeln = s.rateLimits.rules.filter((r) => !REGELN.some((x) => x.label === r.label));
  regeln.push(...REGELN);
  s.rateLimits.rules = regeln;
  s.rateLimits.enabled = true;
  app.save(s);
}, (app) => {
  const s = app.settings();
  s.rateLimits.rules = s.rateLimits.rules.filter((r) => !REGELN.some((x) => x.label === r.label));
  app.save(s);
});
