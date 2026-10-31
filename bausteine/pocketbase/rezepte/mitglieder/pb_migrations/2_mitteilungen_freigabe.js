/// <reference path="../pb_data/types.d.ts" />
// Mitglieder mit Freigabe (Rezept mitglieder). Wer sich registriert, stellt eine Anfrage; die Verwaltung schaltet sie frei
// (Tunnel, http://localhost:8090/_/, Sammlung users, Feld freigegeben). Mitteilungen sehen nur angemeldete Mitglieder mit bestätigter
// E-Mail-Adresse, die freigegeben sind. Freigabe und Rolle setzt nur die Verwaltung, nie die Person selbst.
// Die Links in den Mails führen auf Seiten der eigenen Adresse, nicht auf die Verwaltung /_/ (die ist von aussen zu).
// Läuft nach 2_mitteilungen.js, auch dort, wo das alte Rezept schon eingebaut ist.

// Rollen, die die Verwaltung vergeben kann (Feld rolle; leer heisst Mitglied). Eigene hier ergänzen, bevor die Seite läuft, später mit
// einer neuen Datei pb_migrations/3_*.js. Der Baustein eingang lässt Teile mit «rolle:<name>» nur Mitglieder mit dieser Rolle sehen.
const ROLLEN = ["mitglied", "vorstand"];
// Wo die Seiten liegen, für die Links in den Mails (in einer Astro-Seite zum Beispiel "/bestaetigen/" und "/passwort/")
const SEITE_BESTAETIGEN = "/bestaetigen.html";
const SEITE_PASSWORT = "/passwort.html";

const absatz = (zeilen) => `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5">${zeilen.map((z) => `<p>${z}</p>`).join("")}</div>`;

migrate((app) => {
  const users = app.findCollectionByNameOrId("users");
  if (!users.fields.getByName("freigegeben")) users.fields.add(new BoolField({ name: "freigegeben" }));
  if (!users.fields.getByName("rolle")) users.fields.add(new SelectField({ name: "rolle", values: ROLLEN, maxSelect: 1 }));
  // Registrieren dürfen alle, aber ohne Freigabe, Rolle und Bestätigung; ändern nur das eigene Konto, ebenfalls ohne diese drei
  const ohne = "@request.body.freigegeben:isset = false && @request.body.rolle:isset = false && @request.body.verified:isset = false";
  users.createRule = ohne;
  users.updateRule = `id = @request.auth.id && ${ohne}`;
  users.listRule = "id = @request.auth.id";
  users.viewRule = "id = @request.auth.id";
  users.deleteRule = "id = @request.auth.id";   // das eigene Konto löschen geht immer
  users.passwordResetToken.duration = 1800;      // 30 Minuten, so steht es in der Mail
  users.verificationToken.duration = 259200;     // 3 Tage

  users.verificationTemplate.subject = "Bitte bestätige deine E-Mail-Adresse";
  users.verificationTemplate.body = absatz([
    "Hallo",
    "Du hast auf {APP_URL} eine Mitgliedschaft angefragt. Bitte bestätige deine E-Mail-Adresse (der Link gilt 3 Tage):",
    `<a href="{APP_URL}${SEITE_BESTAETIGEN}?token={TOKEN}">E-Mail-Adresse bestätigen</a>`,
    "Danach schaltet dich die Verwaltung frei, du bekommst dann eine Mail. Warst du das nicht? Dann lösch diese Mail einfach.",
  ]);
  users.resetPasswordTemplate.subject = "Neues Passwort festlegen";
  users.resetPasswordTemplate.body = absatz([
    "Hallo",
    "Für dein Konto auf {APP_URL} wurde ein neues Passwort angefragt. Hier legst du es fest (der Link gilt 30 Minuten):",
    `<a href="{APP_URL}${SEITE_PASSWORT}?token={TOKEN}">Neues Passwort festlegen</a>`,
    "Warst du das nicht? Dann bleibt dein Passwort, wie es ist, und du kannst diese Mail löschen.",
  ]);
  users.authAlert.emailTemplate.subject = "Neue Anmeldung bei deinem Konto";
  users.authAlert.emailTemplate.body = absatz([
    "Hallo",
    "Mit deinem Konto auf {APP_URL} hat sich eben jemand von einem neuen Gerät oder Ort aus angemeldet:",
    "<em>{ALERT_INFO}</em>",
    `<strong>Warst du das nicht? Dann leg sofort ein neues Passwort fest («Passwort vergessen?» auf der Anmeldeseite).</strong>`,
  ]);
  app.save(users);

  const mitteilungen = app.findCollectionByNameOrId("mitteilungen");
  const mitglied = "@request.auth.collectionName = 'users' && @request.auth.verified = true && @request.auth.freigegeben = true";
  mitteilungen.listRule = mitglied;
  mitteilungen.viewRule = mitglied;
  app.save(mitteilungen);
}, (app) => {
  const mitteilungen = app.findCollectionByNameOrId("mitteilungen");
  mitteilungen.listRule = null;
  mitteilungen.viewRule = null;
  app.save(mitteilungen);
  const users = app.findCollectionByNameOrId("users");
  users.createRule = "";
  users.updateRule = "id = @request.auth.id";
  users.fields.removeByName("freigegeben");
  users.fields.removeByName("rolle");
  app.save(users);
});
