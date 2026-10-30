// Gemeinsam für lokal.ts und die Tests der Rezepte: PocketBase für diesen Computer holen und eine Mail-Attrappe.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// PocketBase in der Version aus dem Dockerfile, einmal nach ~/.cache/albatros-pocketbase, mit geprüfter Prüfsumme
export async function pocketbase(wurzel: string): Promise<string> {
  if (process.env.POCKETBASE) return process.env.POCKETBASE;
  const v = /PB_VERSION=([\d.]+)/.exec(readFileSync(join(wurzel, 'Dockerfile'), 'utf8'))![1]!;
  const win = process.platform === 'win32';
  const os = win ? 'windows' : process.platform === 'darwin' ? 'darwin' : 'linux', arch = process.arch === 'arm64' ? 'arm64' : 'amd64';
  const ordner = join(homedir(), '.cache', 'albatros-pocketbase', v), programm = join(ordner, win ? 'pocketbase.exe' : 'pocketbase');
  if (existsSync(programm)) return programm;
  const datei = `pocketbase_${v}_${os}_${arch}.zip`, url = `https://github.com/pocketbase/pocketbase/releases/download/v${v}`;
  console.log(`Lade PocketBase ${v} (einmalig, etwa 15 MB) …`);
  const zip = new Uint8Array(await (await fetch(`${url}/${datei}`, { signal: AbortSignal.timeout(120_000) })).arrayBuffer());
  const summe = (await (await fetch(`${url}/checksums.txt`, { signal: AbortSignal.timeout(30_000) })).text()).split('\n').find((z) => z.endsWith(datei))?.split(/\s+/)[0];
  if (new Bun.CryptoHasher('sha256').update(zip).digest('hex') !== summe) throw new Error(`Prüfsumme von ${datei} stimmt nicht, nichts entpackt`);
  mkdirSync(ordner, { recursive: true });
  writeFileSync(join(ordner, datei), zip);
  // Windows hat kein unzip, aber tar kann zip
  const r = Bun.spawnSync(win ? ['tar', '-xf', datei] : ['unzip', '-oq', datei], { cwd: ordner });
  if (!r.success || !existsSync(programm)) throw new Error(`${datei} liess sich nicht entpacken`);
  return programm;
}

// Mail-Attrappe auf diesem Computer: nimmt SMTP an, jede Mail geht an neu(), nichts verlässt den Computer
export function mailAttrappe(neu: (mail: string) => void) {
  return Bun.listen<{ daten: boolean; puffer: string }>({
    hostname: '127.0.0.1', port: 0,
    socket: {
      open(s) { s.data = { daten: false, puffer: '' }; s.write('220 attrappe\r\n'); },
      data(s, d) {
        s.data.puffer += d.toString();
        if (s.data.daten) {
          const i = s.data.puffer.indexOf('\r\n.\r\n');
          if (i < 0) return;
          neu(s.data.puffer.slice(0, i));
          s.data = { daten: false, puffer: s.data.puffer.slice(i + 5) };
          s.write('250 ok\r\n');
        }
        let n;
        while (!s.data.daten && (n = s.data.puffer.indexOf('\r\n')) >= 0) {
          const z = s.data.puffer.slice(0, n).toUpperCase();
          s.data.puffer = s.data.puffer.slice(n + 2);
          if (z.startsWith('EHLO') || z.startsWith('HELO')) s.write('250 attrappe\r\n');
          else if (z.startsWith('DATA')) { s.data.daten = true; s.write('354 los\r\n'); }
          else if (z.startsWith('QUIT')) { s.write('221 tschuess\r\n'); s.end(); }
          else s.write('250 ok\r\n');
        }
      },
    },
  });
}

// Mail lesbar machen: quoted-printable zurück in Text (UTF-8)
export function lesbar(mail: string) {
  const t = mail.replace(/=\r\n/g, ''), bytes: number[] = [];
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '=' && /^[0-9A-F]{2}$/.test(t.slice(i + 1, i + 3))) { bytes.push(parseInt(t.slice(i + 1, i + 3), 16)); i += 2; } else bytes.push(t.charCodeAt(i));
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

// Gemeinsame Einstellungen: Mails an die Attrappe, Adresse der Seite. token ist ein Schlüssel der Verwaltung.
export async function einstellen(api: string, token: string, smtpPort: number, adresse: string) {
  const r = await fetch(`${api}/settings`, {
    method: 'PATCH', headers: { 'content-type': 'application/json', authorization: token },
    body: JSON.stringify({ meta: { appURL: adresse, senderAddress: 'seite@example.com', senderName: 'Meine Seite' }, smtp: { enabled: true, host: '127.0.0.1', port: smtpPort, tls: false } }),
  });
  if (!r.ok) throw new Error(`Einstellungen: ${r.status}`);
}

// Ordner mit pb_migrations/1_einstellungen.js und Dockerfile, von hier aus nach oben gesucht
export function wurzelVon(hier: string) {
  for (let d = hier; d !== join(d, '..'); d = join(d, '..')) if (existsSync(join(d, 'Dockerfile')) && existsSync(join(d, 'pb_migrations', '1_einstellungen.js'))) return d;
  throw new Error('bausteine/pocketbase nicht gefunden');
}
