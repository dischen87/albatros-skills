// Hilfen für buchungen.pb.js. PocketBase führt jeden Handler für sich aus, darum holt jeder sie mit require.

// Meldungen über neue Buchungen und Absagen gehen hierhin. Leer: an die Absender-Adresse aus den Mail-Einstellungen.
const MELDUNGEN_AN = "";

const TAGE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONATE = ["Jan.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."];
const zwei = (n) => String(n).padStart(2, "0");

// Zeiten in Ortszeit: Der Container läuft mit TZ=Europe/Zurich (Dockerfile), Date rechnet dann in Schweizer Zeit, auch im Sommer.
function zeit(beginn, ende) {
  const a = new Date(beginn.unix() * 1000), b = new Date(ende.unix() * 1000);
  return `${TAGE[a.getDay()]}, ${a.getDate()}. ${MONATE[a.getMonth()]} ${a.getFullYear()}, ${zwei(a.getHours())}:${zwei(a.getMinutes())}–${zwei(b.getHours())}:${zwei(b.getMinutes())} Uhr`;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// Was, wann, wo einer Buchung: für Mails und für die Absage-Seite
function zusammenfassung(app, b) {
  const t = app.findRecordById("termine", b.getString("termin"));
  const a = app.findRecordById("angebote", t.getString("angebot"));
  return {
    nummer: b.id,
    status: b.getString("status"),
    angebot: a.getString("titel"),
    wann: zeit(t.getDateTime("beginn"), t.getDateTime("ende")),
    ort: a.getString("ort"),
    preis: a.getString("preis_hinweis"),
    anzahl: b.getInt("anzahl"),
    begonnen: Date.now() >= t.getDateTime("beginn").unix() * 1000,
  };
}

function perCode(app, code) {
  if (!code || code.length < 32) return null;
  try { return app.findFirstRecordByData("buchungen", "code", code); } catch (_) { return null; }
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

// art: neu, storniert_kunde, storniert_betrieb
function mails(app, b, art) {
  const s = app.settings();
  if (!s.smtp.enabled) {
    app.logger().warn("Mails aus: In der Verwaltung unter Settings → Mail settings ist noch kein SMTP eingetragen (Skill bausteine).");
    return;
  }
  const z = zusammenfassung(app, b);
  const gast = b.getString("email"), betrieb = MELDUNGEN_AN || s.meta.senderAddress;
  const seite = `${s.meta.appURL}/buchen.html`;
  const was = `<b>${esc(z.angebot)}</b><br>${esc(z.wann)}${z.ort ? `<br>${esc(z.ort)}` : ""}<br>${z.anzahl === 1 ? "1 Person" : `${z.anzahl} Personen`}`;
  if (art === "neu") {
    senden(app, gast, `Bestätigt: ${z.angebot}, ${z.wann}`, [
      `Hallo ${esc(b.getString("name"))}`,
      `Dein Platz ist gebucht. Nummer ${esc(z.nummer)}.`,
      was,
      z.preis && esc(z.preis),
      `Kannst du nicht kommen? Hier kannst du kostenlos absagen, bis der Termin beginnt: <a href="${seite}?absagen=${b.getString("code")}">Buchung absagen</a>`,
      `Fragen? Antworte einfach auf diese Mail.`,
    ]);
    senden(app, betrieb, `Neue Buchung: ${z.angebot}, ${z.wann}`, [
      `${esc(b.getString("name"))} (${esc(gast)}) hat gebucht.`,
      was,
      b.getString("nachricht") && `Nachricht: ${esc(b.getString("nachricht"))}`,
    ]);
  } else if (art === "storniert_kunde") {
    senden(app, gast, `Abgesagt: ${z.angebot}, ${z.wann}`, [`Hallo ${esc(b.getString("name"))}`, `Deine Buchung ist abgesagt. Schade, vielleicht ein andermal: <a href="${seite}">andere Termine</a>`, was]);
    senden(app, betrieb, `Abgesagt: ${z.angebot}, ${z.wann}`, [`${esc(b.getString("name"))} (${esc(gast)}) hat abgesagt.`, was]);
  } else if (art === "storniert_betrieb") {
    senden(app, gast, `Abgesagt: ${z.angebot}, ${z.wann}`, [
      `Hallo ${esc(b.getString("name"))}`,
      `Leider müssen wir diesen Termin absagen. Entschuldige bitte.`,
      b.getString("grund") && `Grund: ${esc(b.getString("grund"))}`,
      was,
      `Hier findest du andere Termine: <a href="${seite}">${esc(seite)}</a>`,
    ]);
  }
}

module.exports = { zeit, zusammenfassung, perCode, mails };
