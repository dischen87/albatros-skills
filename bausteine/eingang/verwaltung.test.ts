// Vordere Schicht des Eingangs, ohne PocketBase (Welle 6, w6-49, 01.11.2026). verwaltung() sperrt die Verwaltung von PocketBase in jeder
// Schreibweise, die PocketBase auflöst (Go strings.EqualFold: Gross/Klein, «ſ» für «s»; Sammlungen über ihre ID pbc_<Ziffern>). Bisher
// prüfte das nur test.ts gegen ein echtes PocketBase, und dort antwortet die zweite Schicht (pb_hooks/eingang.pb.js mit x-eingang-weg)
// ebenfalls 404: Ohne systemOderId in verwaltung() blieb alles grün (Gegenprobe 2 eingang, Welle 5, runde2/kopie-m1). Diese Schicht
// allein schützt, wenn eingang.js in pb_hooks veraltet ist. Läuft mit bun test (CI-Job pruefen), test.ts prüft zusätzlich den Körper.
import { expect, test } from 'bun:test';
import { pfadVon, verwaltung } from './eingang.ts';

// Wie der Eingang entscheidet: zuerst der Pfad aus der Adresse (dekodiert), dann verwaltung()
const gesperrt = (adresse: string) => {
  const pfad = pfadVon(adresse);
  if (pfad === null) throw new Error(`${adresse}: pfadVon lehnt ab, das wäre 400, nicht verwaltung()`);
  return verwaltung(pfad);
};

test('Systemsammlungen in jeder Schreibweise und über ihre ID: gesperrt', () => {
  for (const a of [
    '/api/collections/_superusers/auth-with-password', '/api/collections/_SUPERUSERS/auth-with-password', '/api/collections/_Superusers/auth-methods',
    '/api/collections/_%C5%BFuperusers/request-password-reset', '/api/collections/_%5Fsuperusers/records', '/api/collections/%5fsuperusers/records',
    '/api/collections/_MFAS/records', '/api/collections/_otps/records', '/api/collections/pbc_3142635823/auth-with-password',
    '/api/collections/PBC_3142635823/records', '/api/collections/Pbc_1/auth-methods',
  ]) expect([a, gesperrt(a)]).toEqual([a, true]);
});

test('übrige Verwaltung: Oberfläche, Einstellungen, Sammlungen verwalten, Punktdateien: gesperrt', () => {
  for (const a of ['/_/', '/_', '/admin', '/api/settings', '/api/backups', '/api/logs', '/api/crons', '/api/realtime', '/api/collections',
    '/api/collections/users', '/api/collections/users/truncate', '/api/collections/users/impersonate/abc', '/api/collections/meta/scaffolds',
    '/.env', '/.git/config', '/intern/.htpasswd'])
    expect([a, gesperrt(a)]).toEqual([a, true]);
});

test('eigene Sammlungen beim Namen, Dateien über die ID und /.well-known/: offen für die Teile', () => {
  for (const a of ['/api/collections/users/records', '/api/collections/users/auth-with-password', '/api/collections/beitraege/records',
    '/api/collections/termine_frei/records', '/api/collections/pbcx_1/records', '/api/collections/pbc_abc/records', '/api/files/pbc_123/abc/bild.jpg',
    '/.well-known/security.txt', '/intern/', '/verwaltung/'])
    expect([a, gesperrt(a)]).toEqual([a, false]);
});
