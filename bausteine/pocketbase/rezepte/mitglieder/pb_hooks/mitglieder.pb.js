/// <reference path="../pb_data/types.d.ts" />
// Mitglieder (Rezept mitglieder). Wer sich registriert, stellt eine Anfrage: Die Person bekommt eine Mail zum Bestätigen ihrer Adresse,
// die Verwaltung eine Meldung. Freigabe und Rolle setzt nur die Verwaltung (zusätzlich zu den Regeln in 2_mitteilungen_freigabe.js);
// wer freigeschaltet wird, bekommt eine Mail.

onRecordCreateRequest((e) => {
  const selbst = !e.hasSuperuserAuth();
  if (selbst) {
    e.record.set("freigegeben", false);
    e.record.set("rolle", "");
    e.record.setVerified(false);
  }
  e.next();
  if (selbst) require(`${__hooks}/mitglieder.js`).anfrage(e.app, e.record);
}, "users");

onRecordUpdateRequest((e) => {
  const vorher = e.record.original();
  const frei = e.record.getBool("freigegeben");
  if (!e.hasSuperuserAuth() && (frei !== vorher.getBool("freigegeben") || e.record.getString("rolle") !== vorher.getString("rolle"))) {
    throw new ForbiddenError("Freigabe und Rolle setzt nur die Verwaltung.");
  }
  e.next();
  if (frei && !vorher.getBool("freigegeben")) require(`${__hooks}/mitglieder.js`).freigeschaltet(e.app, e.record);
}, "users");
