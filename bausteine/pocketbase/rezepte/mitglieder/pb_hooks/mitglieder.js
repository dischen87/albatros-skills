// Hilfen für mitglieder.pb.js. PocketBase führt jeden Handler für sich aus, darum holt jeder sie mit require.

// Meldungen über neue Anfragen gehen hierhin. Leer: an die Absender-Adresse aus den Mail-Einstellungen.
const MELDUNGEN_AN = "";
// Wo der Mitgliederbereich auf der eigenen Seite liegt (für den Link in der Mail nach der Freigabe), z. B. "/mitglieder/"
const MITGLIEDERSEITE = "/mitglieder.html";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function mailsAn(app) {
  if (app.settings().smtp.enabled) return true;
  app.logger().warn("Mails aus: In der Verwaltung unter Settings → Mail settings ist noch kein SMTP eingetragen (Skill bausteine).");
  return false;
}

function senden(app, an, betreff, zeilen) {
  const s = app.settings();
  const html = `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5">${zeilen.filter(Boolean).map((z) => `<p>${z}</p>`).join("")}</div>`;
  try {
    app.newMailClient().send(new MailerMessage({
      from: { address: s.meta.senderAddress, name: s.meta.senderName },
      to: [{ address: an }],
      subject: betreff,
      html,
    }));
  } catch (err) {
    app.logger().error("Mail nicht gesendet", "betreff", betreff, "fehler", String(err));
  }
}

// Neue Anfrage: Mail zum Bestätigen der Adresse an die Person (Vorlage aus 2_mitteilungen_freigabe.js), Meldung an die Verwaltung
function anfrage(app, u) {
  if (!mailsAn(app)) return;
  try {
    $mails.sendRecordVerification(app, u);
  } catch (err) {
    app.logger().error("Mail zum Bestätigen nicht gesendet", "fehler", String(err));
  }
  const name = u.getString("name");
  senden(app, MELDUNGEN_AN || app.settings().meta.senderAddress, `Neue Anfrage für den Mitgliederbereich${name ? `: ${name}` : ""}`, [
    `${esc(name || "Jemand")} (${esc(u.email())}) möchte in den Mitgliederbereich.`,
    "Freischalten: In der Verwaltung unter users die Person öffnen und «freigegeben» einschalten. Sie bekommt dann eine Mail.",
    "Kennst du die Person nicht? Dann lösch den Eintrag dort.",
  ]);
}

// Die Verwaltung hat jemanden freigeschaltet
function freigeschaltet(app, u) {
  if (!mailsAn(app)) return;
  const seite = `${app.settings().meta.appURL.replace(/\/$/, "")}${MITGLIEDERSEITE}`;
  senden(app, u.email(), "Du bist freigeschaltet", [
    `Hallo${u.getString("name") ? ` ${esc(u.getString("name"))}` : ""}`,
    "Die Verwaltung hat dich für den Mitgliederbereich freigeschaltet.",
    `Hier meldest du dich an: <a href="${seite}">${esc(seite)}</a>`,
  ]);
}

module.exports = { anfrage, freigeschaltet };
