// Hilfen für eingang.pb.js. PocketBase führt jeden Handler für sich aus, darum holt jeder sie mit require.

const COOKIE = "__Host-sitzung";

// Das Token aus dem Cookie, sonst ""
function sitzung(e) {
  try {
    return e.request.cookie(COOKIE).value || "";
  } catch (_) {
    return "";
  }
}

const lesend = (methode) => methode === "GET" || methode === "HEAD" || methode === "OPTIONS";
const host = (adresse) => {
  const m = /^https?:\/\/([^/?#]+)/i.exec(adresse || "");
  return m ? m[1].toLowerCase() : "";
};

// Kommt die Anfrage von der eigenen Seite? Der Browser schickt bei jedem Schreiben Origin mit; der muss zur Adresse passen, an die die
// Anfrage ging (Host, vom Eingang und von der Seite weitergereicht), oder zur Adresse der Seite in den Einstellungen.
function eigeneHerkunft(e) {
  const o = host(e.request.header.get("Origin"));
  return o !== "" && (o === String(e.request.host).toLowerCase() || o === host(e.app.settings().meta.appURL));
}

// Ein angemeldetes Mitglied (Sammlung users) zum Token, sonst null
function mitglied(app, token) {
  try {
    const r = app.findAuthRecordByToken(token, "auth");
    return r.collection().name === "users" ? r : null;
  } catch (_) {
    return null;
  }
}

const cookie = (wert, sekunden) => `${COOKIE}=${wert}; Path=/; Max-Age=${sekunden}; HttpOnly; Secure; SameSite=Lax`;

module.exports = { COOKIE, sitzung, lesend, eigeneHerkunft, mitglied, cookie };
