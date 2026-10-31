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

// Kommt die Anfrage durch den Eingang von aussen? Den Kopf setzt nur der Eingang (eingehende x-eingang-* entfernt er); über den Tunnel
// fehlt er.
const vonAussen = (e) => e.request.header.get("X-Eingang-Weg") === "aussen";

// Verwaltung von aussen: ein Konto der Verwaltung (Token im Kopf Authorization), eine Systemsammlung (_superusers, _mfas …) in jeder
// Schreibweise, die PocketBase auflöst (Gross/Klein, «ſ», ID), oder die Oberfläche /_/. Die Sammlung sucht PocketBase hier selbst,
// über den Wert aus der Route und zur Sicherheit auch über den Pfad.
function verwaltung(e) {
  if (e.auth && e.auth.isSuperuser()) return true;
  const pfad = String(e.request.url.path);
  if (pfad === "/_" || pfad.startsWith("/_/")) return true;
  const namen = [];
  try { namen.push(e.request.pathValue("collection")); } catch (_) {}
  const m = /^\/api\/(?:collections|files)\/([^/]+)/.exec(pfad);
  if (m) namen.push(m[1]);
  for (const n of namen) {
    if (!n) continue;
    try {
      if (e.app.findCachedCollectionByNameOrId(n).system) return true;
    } catch (_) {}
  }
  return false;
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

module.exports = { COOKIE, sitzung, lesend, eigeneHerkunft, vonAussen, verwaltung, mitglied, cookie };
