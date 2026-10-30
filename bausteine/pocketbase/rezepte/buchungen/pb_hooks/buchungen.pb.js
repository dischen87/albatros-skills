/// <reference path="../pb_data/types.d.ts" />
// Buchungen (Rezept buchungen). Plätze prüfen und Buchung speichern geschieht in einer Transaktion: PocketBase schreibt nie zwei
// Transaktionen gleichzeitig, darum bekommen zwei Leute nie denselben letzten Platz. Status und Code setzt der Server.

onRecordCreateRequest((e) => {
  if (e.requestInfo().body.website) throw new BadRequestError("Das hat nicht geklappt."); // Honigtopf: nur Roboter füllen es aus
  e.app.runInTransaction((tx) => {
    const b = e.record;
    let t, a;
    try {
      t = tx.findRecordById("termine", b.getString("termin"));
      a = tx.findRecordById("angebote", t.getString("angebot"));
    } catch (_) {
      throw new BadRequestError("Diesen Termin gibt es nicht.");
    }
    const schluss = t.getDateTime("beginn").unix() * 1000 - a.getInt("buchungsschluss_std") * 3600 * 1000;
    if (t.getBool("abgesagt") || !a.getBool("aktiv") || Date.now() >= schluss) throw new BadRequestError("Dieser Termin ist nicht mehr buchbar.");
    const aktiv = tx.findRecordsByFilter("buchungen", "termin = {:t} && status = 'bestaetigt'", "", 0, 0, { t: t.id });
    if (aktiv.some((r) => r.getString("email").toLowerCase() === b.getString("email").toLowerCase())) {
      throw new BadRequestError("Du bist für diesen Termin schon angemeldet.");
    }
    const belegt = aktiv.reduce((s, r) => s + r.getInt("anzahl"), 0);
    if (belegt + b.getInt("anzahl") > t.getInt("plaetze")) {
      throw new BadRequestError(t.getInt("plaetze") - belegt > 0 ? `Für diesen Termin sind nur noch ${t.getInt("plaetze") - belegt} Plätze frei.` : "Dieser Termin ist inzwischen voll.");
    }
    b.set("status", "bestaetigt");
    b.set("storniert_von", "");
    b.set("grund", "");
    b.set("code", $security.randomString(32));
    e.app = tx;
    e.next();
  });
}, "buchungen");

onRecordAfterCreateSuccess((e) => {
  require(`${__hooks}/buchungen.js`).mails(e.app, e.record, "neu");
  e.next();
}, "buchungen");

// Die Verwaltung setzt eine Buchung auf storniert (mit Grund): Mail an den Gast
onRecordUpdateRequest((e) => {
  const vorher = e.record.original().getString("status");
  if (e.record.getString("status") === "storniert" && vorher !== "storniert") e.record.set("storniert_von", "betrieb");
  e.next();
  if (e.record.getString("status") === "storniert" && vorher !== "storniert") require(`${__hooks}/buchungen.js`).mails(e.app, e.record, "storniert_betrieb");
}, "buchungen");

// Die Verwaltung sagt einen ganzen Termin ab: alle Buchungen storniert, jede und jeder bekommt eine Mail mit dem Grund
onRecordUpdateRequest((e) => {
  const war = e.record.original().getBool("abgesagt");
  e.next();
  if (war || !e.record.getBool("abgesagt")) return;
  const h = require(`${__hooks}/buchungen.js`);
  for (const b of e.app.findRecordsByFilter("buchungen", "termin = {:t} && status = 'bestaetigt'", "", 0, 0, { t: e.record.id })) {
    b.set("status", "storniert");
    b.set("storniert_von", "betrieb");
    b.set("grund", e.record.getString("grund"));
    e.app.save(b);
    h.mails(e.app, b, "storniert_betrieb");
  }
}, "termine");

// Absage-Link aus der Mail: buchen.html?absagen=<code> zeigt die Buchung (GET) und sagt sie ab (POST). Ohne Konto, der Code ist der Schlüssel.
routerAdd("GET", "/api/buchungen/absagen/{code}", (e) => {
  const h = require(`${__hooks}/buchungen.js`);
  const b = h.perCode(e.app, e.request.pathValue("code"));
  if (!b) throw new NotFoundError("Diese Buchung gibt es nicht. Prüf den Link aus deiner Mail.");
  return e.json(200, h.zusammenfassung(e.app, b));
});

routerAdd("POST", "/api/buchungen/absagen/{code}", (e) => {
  const h = require(`${__hooks}/buchungen.js`);
  const b = h.perCode(e.app, e.request.pathValue("code"));
  if (!b) throw new NotFoundError("Diese Buchung gibt es nicht. Prüf den Link aus deiner Mail.");
  if (b.getString("status") !== "storniert") {
    if (h.zusammenfassung(e.app, b).begonnen) throw new BadRequestError("Der Termin hat schon begonnen. Absagen geht nur vorher.");
    b.set("status", "storniert");
    b.set("storniert_von", "kunde");
    e.app.save(b);
    h.mails(e.app, b, "storniert_kunde");
  }
  return e.json(200, h.zusammenfassung(e.app, b));
});
