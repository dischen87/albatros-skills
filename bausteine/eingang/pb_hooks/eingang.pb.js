/// <reference path="../pb_data/types.d.ts" />
// Anmeldung für den Baustein eingang (bausteine/eingang). Die Sitzung liegt in einem Cookie, das Skripte im Browser nicht lesen
// können (HttpOnly). Braucht das Rezept mitglieder: Nur bestätigte und freigegebene Mitglieder gelten als angemeldet.
//   POST /api/eingang/anmelden  {email, passwort}  204 und Cookie __Host-sitzung, so lange wie das Token gilt; sonst 400
//   POST /api/eingang/abmelden                     204, Cookie gelöscht
//   GET  /api/eingang/pruefen                      204 mit x-eingang-benutzer (Record-ID) und x-eingang-rolle, sonst 401

// Durch den Eingang (Kopf X-Eingang-Weg: aussen) ist die Verwaltung zu: kein Konto der Verwaltung, keine Systemsammlung und nicht /_/,
// egal wie geschrieben (404). Der Eingang sperrt das schon selbst, das hier ist die zweite Schicht. Über den Tunnel bleibt alles, wie es ist.
// Das Cookie gilt auch für die Sammlungen, mit denselben Regeln wie eine Anmeldung im Browser. Nie für die Wege zum Anmelden und
// Erneuern (das Token stünde sonst in einer Antwort an ein Skript), und Schreiben mit dem Cookie nur von der eigenen Seite.
routerUse((e) => {
  const h = require(`${__hooks}/eingang.js`);
  if (h.vonAussen(e) && h.verwaltung(e)) throw new NotFoundError("Nicht gefunden.");
  const token = e.auth ? "" : h.sitzung(e);
  if (!token || /^\/api\/collections\/[^/]+\/auth-/.test(e.request.url.path)) return e.next();
  if (!h.lesend(e.request.method) && !h.eigeneHerkunft(e)) throw new ForbiddenError("Mit der Anmeldung geht Schreiben nur von der eigenen Seite.");
  const r = h.mitglied(e.app, token);
  if (r) e.auth = r;
  return e.next();
});

routerAdd("POST", "/api/eingang/anmelden", (e) => {
  const h = require(`${__hooks}/eingang.js`);
  if (e.request.header.get("Origin") && !h.eigeneHerkunft(e)) throw new ForbiddenError("Anmelden geht nur auf der eigenen Seite.");
  const body = e.requestInfo().body;
  const email = String(body.email || "").trim(), passwort = String(body.passwort || "");
  const users = e.app.findCollectionByNameOrId("users");
  let r = null;
  try { r = e.app.findAuthRecordByEmail("users", email); } catch (_) {}
  // Ohne Konto gleich lang rechnen wie mit, damit die Antwortzeit nicht verrät, welche Adressen es gibt
  if (!r) new Record(users).setPassword(passwort || "-");
  const regel = users.authRule;
  const darf = r && users.passwordAuth.enabled && !users.mfa.enabled && regel !== null && (regel === "" || e.app.canAccessRecord(r, e.requestInfo(), regel));
  if (!r || !r.validatePassword(passwort) || !darf) throw new BadRequestError("E-Mail oder Passwort stimmt nicht.");
  e.response.header().add("Set-Cookie", h.cookie(r.newAuthToken(), users.authToken.duration));
  e.response.header().set("Cache-Control", "no-store");
  return e.noContent(204);
});

routerAdd("POST", "/api/eingang/abmelden", (e) => {
  const h = require(`${__hooks}/eingang.js`);
  // Abmelden widerruft die Sitzung: Ein neuer tokenKey macht jedes Token dieses Mitglieds ungültig, auf allen Geräten. Fremde Seiten
  // kommen nicht bis hierher (Schreiben mit dem Cookie nur von der eigenen Seite, routerUse oben).
  if (e.auth && e.auth.collection().name === "users") {
    e.auth.refreshTokenKey();
    e.app.save(e.auth);
  }
  e.response.header().add("Set-Cookie", h.cookie("", 0));
  return e.noContent(204);
});

// Für den Eingang: Wer ist angemeldet, mit welcher Rolle? Nur Mitglieder mit bestätigter Adresse und Freigabe.
routerAdd("GET", "/api/eingang/pruefen", (e) => {
  const r = e.auth;
  if (!r || r.collection().name !== "users" || !r.verified() || !r.getBool("freigegeben")) throw new UnauthorizedError("Nicht angemeldet.");
  e.response.header().set("x-eingang-benutzer", r.id);
  e.response.header().set("x-eingang-rolle", r.getString("rolle") || "mitglied");
  e.response.header().set("Cache-Control", "no-store");
  return e.noContent(204);
});
