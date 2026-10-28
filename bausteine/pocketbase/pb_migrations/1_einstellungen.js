/// <reference path="../pb_data/types.d.ts" />
// Grundeinstellungen als Code. ADRESSE: die Adresse der Seite, sie steht in den Mails (Passwort vergessen, Adresse bestätigen).
const ADRESSE = "https://NAME.aufwind.sh";

migrate((app) => {
  const s = app.settings();
  s.meta.appURL = ADRESSE;
  // Die Seite reicht die Adresse der Besucher im Kopf X-Forwarded-For weiter (bausteine/pocketbase/nginx.conf)
  s.trustedProxy.headers = ["X-Forwarded-For"];
  s.trustedProxy.useLeftmostIP = true;
  // Schutz vor zu vielen Anfragen, zum Beispiel Formular-Spam
  s.rateLimits.enabled = true;
  app.save(s);
});
