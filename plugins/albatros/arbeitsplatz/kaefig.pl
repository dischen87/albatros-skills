#!/usr/bin/perl
# Käfig für die KI unter Linux (F1.11 für den Arbeitsplatz online, docs/foundable/f01-bert-lokal.md §8): startet ein Programm unter Landlock.
# Im Container gibt es keine Namensräume (bubblewrap scheitert), Landlock aber schon. Dieses Skript legt die Regeln auf sich selbst und ersetzt
# sich dann durch das Programm (exec): Alles, was das Programm startet (Befehle, Skripte, npm, git), erbt die Regeln und kann sie nie lockern.
#
# Perl, weil es in jedem Debian- und Ubuntu-Bild schon da ist (perl-base ist «Essential») und Systemaufrufe ohne Compiler kann: kein Bau, kein
# Binärprogramm im Repo, nichts nachzuladen. Gebraucht werden nur Fcntl, POSIX und Socket aus perl-base.
#
# Aufruf: kaefig.pl [Regeln] -- <Programm> [Argumente]
#   -r <Pfad>          lesen und ausführen (Ordner samt Inhalt, oder eine Datei)
#   -w <Pfad>          alles: lesen, schreiben, anlegen, löschen, umbenennen (Ordner samt Inhalt, oder eine Datei)
#   -d <Pfad>          lesen und in bestehende Dateien schreiben, nichts anlegen (für /dev)
#   -p <Port>          TCP-Verbindungen zu diesem Port erlaubt; alle anderen Ports sind gesperrt, Hören (bind) immer
#   -P <Port>          Probe: Nach dem Einsperren muss eine Verbindung zu 127.0.0.1:<Port> mit EACCES scheitern, sonst startet nichts
#   -W <Pfad>          Probe: Nach dem Einsperren muss das Öffnen dieser Datei zum Schreiben mit EACCES scheitern, sonst startet nichts
#   --abi              nur die Landlock-Version dieses Kerns ausgeben («abi 4») und enden
#   --anschluss <Pfad> kein Käfig, nur eine Leitung: verbindet stdin und stdout mit dem Unix-Socket <Pfad> und endet, wenn eine Seite schliesst.
#                      So erreicht die KI im Käfig den MCP-Server des Arbeitsplatzes (src/bruecke/anschluss.ts): Der Server läuft beim
#                      Arbeitsplatz ausserhalb des Käfigs und schreibt .albatros/; die KI startet im Käfig nur diese Leitung. Landlock ABI 4
#                      sperrt Verbindungen zu Unix-Sockets mit Pfad nicht, und die Leitung braucht keine Regel für den Ordner des Sockets.
# Was keine Regel hat, ist zu. Pfade, die es nicht gibt, und symbolische Links werden übergangen (ein Link bekäme sonst Rechte auf sein Ziel).
# Ein Pfad unter /proc/self meint diesen Prozess: Das Programm nach «--» übernimmt seine PID (exec), die Regel gilt also für das Programm selbst
# und für kein anderes (so bekommt die KI-CLI ihre eigene Speicherkarte /proc/self/maps, src/bruecke/kaefig.ts).
# Verlangt Landlock ABI 4 (Linux 6.7): Erst dort lassen sich TCP-Verbindungen sperren (Port des Arbeitsplatzes, ssh). Fehlt etwas oder greift
# eine Probe nicht, endet das Skript mit Code 126 und startet das Programm nicht (lieber kein Lauf als ein ungeschützter).
use strict;
use warnings;
use Fcntl qw(O_RDONLY O_WRONLY O_APPEND O_NOFOLLOW);
use POSIX ();
use Socket qw(PF_INET PF_UNIX SOCK_STREAM pack_sockaddr_in pack_sockaddr_un inet_aton);

# Nummern der Systemaufrufe: Landlock überall gleich; prctl je Architektur
my ($SYS_CREATE, $SYS_ADD, $SYS_RESTRICT) = (444, 445, 446);
my %SYS_PRCTL = (x86_64 => 157, aarch64 => 167);
my $O_PATH = 0x200000;       # auf x86_64 und aarch64 gleich
my $O_CLOEXEC = 0x80000;
my $EACCES = 13;

# Rechte von Landlock (linux/landlock.h)
my ($EXECUTE, $WRITE_FILE, $READ_FILE, $READ_DIR) = (1 << 0, 1 << 1, 1 << 2, 1 << 3);
my $TRUNCATE = 1 << 14;
my $FS_ALLE = (1 << 15) - 1;                                     # alles bis TRUNCATE (ABI 3); IOCTL_DEV (ABI 5) bleibt unbehandelt
my $FS_DATEI = $EXECUTE | $WRITE_FILE | $READ_FILE | $TRUNCATE;  # nur diese Rechte kennt Landlock für eine einzelne Datei
my $LESEN = $EXECUTE | $READ_FILE | $READ_DIR;
my $GERAET = $READ_FILE | $READ_DIR | $WRITE_FILE;
my ($NET_BIND, $NET_CONNECT) = (1 << 0, 1 << 1);

sub ende { my ($m) = @_; print STDERR "kaefig: $m\n"; exit 126; }

# Leitung zum MCP-Server des Arbeitsplatzes: vor allem anderen, ohne Landlock (dieser Aufruf läuft schon im Käfig der KI)
sub alles_schreiben {
  my ($h, $daten) = @_;
  my $weg = 0;
  while ($weg < length $daten) {
    my $n = syswrite($h, $daten, length($daten) - $weg, $weg);
    return 0 unless defined $n;
    $weg += $n;
  }
  return 1;
}
sub anschluss {
  my ($pfad) = @_;
  $SIG{PIPE} = 'IGNORE';
  socket(my $s, PF_UNIX, SOCK_STREAM, 0) or ende("Anschluss: socket: $!");
  my $adresse = eval { pack_sockaddr_un($pfad) } or ende("Anschluss: Pfad zu lang: $pfad");
  connect($s, $adresse) or ende("Anschluss $pfad: $!");
  binmode($_) for (\*STDIN, \*STDOUT, $s);
  my $ein_offen = 1;
  while (1) {
    my $rin = '';
    vec($rin, fileno(STDIN), 1) = 1 if $ein_offen;
    vec($rin, fileno($s), 1) = 1;
    my $n = select(my $r = $rin, undef, undef, undef);
    if ($n < 0) { next if $! == 4; last; }   # EINTR
    if ($ein_offen && vec($r, fileno(STDIN), 1)) {
      my $gelesen = sysread(STDIN, my $stueck, 65536);
      # stdin zu: Der Server bekommt das Ende, beantwortet, was offen ist, und schliesst dann selbst
      if (!$gelesen) { $ein_offen = 0; shutdown($s, 1); }
      else { alles_schreiben($s, $stueck) or last; }
    }
    if (vec($r, fileno($s), 1)) {
      my $gelesen = sysread($s, my $stueck, 65536);
      last unless $gelesen;
      alles_schreiben(\*STDOUT, $stueck) or last;
    }
  }
  exit 0;
}
if (@ARGV && $ARGV[0] eq '--anschluss') {
  ende('--anschluss braucht genau einen Pfad') unless @ARGV == 2 && length $ARGV[1];
  anschluss($ARGV[1]);
}

my (@regeln, @ports, @probe_ports, @probe_dateien, @programm);
my $nur_abi = 0;
while (@ARGV) {
  my $a = shift @ARGV;
  if ($a eq '--') { @programm = @ARGV; last; }
  if ($a eq '--abi') { $nur_abi = 1; next; }
  ende("unbekannte Option $a") unless $a =~ /^-[rwdpPW]$/;
  my $wert = shift @ARGV;
  ende("$a braucht einen Wert") unless defined $wert && length $wert;
  if ($a eq '-r') { push @regeln, [$wert, $LESEN]; }
  elsif ($a eq '-w') { push @regeln, [$wert, $FS_ALLE]; }
  elsif ($a eq '-d') { push @regeln, [$wert, $GERAET]; }
  else {
    if ($a eq '-W') { push @probe_dateien, $wert; next; }
    ende("$a braucht einen Port von 1 bis 65535") unless $wert =~ /^[0-9]{1,5}$/ && $wert >= 1 && $wert <= 65535;
    if ($a eq '-p') { push @ports, 0 + $wert; } else { push @probe_ports, 0 + $wert; }
  }
}

my $abi = syscall($SYS_CREATE, 0, 0, 1);   # landlock_create_ruleset(NULL, 0, LANDLOCK_CREATE_RULESET_VERSION)
if ($nur_abi) { print 'abi ', ($abi < 0 ? 0 : $abi), "\n"; exit 0; }
ende("Landlock fehlt auf diesem System ($!)") if $abi < 0;
ende("Landlock ABI $abi ist zu alt: nötig ist 4 (Linux 6.7), erst dort lassen sich Verbindungen sperren") if $abi < 4;
ende('kein Programm nach --') unless @programm;
my $prctl = $SYS_PRCTL{(POSIX::uname())[4]} // ende('unbekannte Architektur ' . (POSIX::uname())[4]);

# struct landlock_ruleset_attr { __u64 handled_access_fs; __u64 handled_access_net; }
my $attr = pack('Q<Q<', $FS_ALLE, $NET_BIND | $NET_CONNECT);
my $satz = syscall($SYS_CREATE, $attr, length($attr), 0);
ende("landlock_create_ruleset: $!") if $satz < 0;

for my $regel (@regeln) {
  my ($pfad, $recht) = @$regel;
  next if -l $pfad || !-e $pfad;
  my $datei = !-d $pfad;
  sysopen(my $h, $pfad, $O_PATH | $O_CLOEXEC | O_NOFOLLOW) or ende("Pfad nicht zu öffnen: $pfad ($!)");
  # struct landlock_path_beneath_attr { __u64 allowed_access; __s32 parent_fd; } gepackt (12 Byte)
  my $eintrag = pack('Q<l<', $datei ? ($recht & $FS_DATEI) : $recht, fileno($h));
  syscall($SYS_ADD, $satz, 1, $eintrag, 0) == 0 or ende("landlock_add_rule für $pfad: $!");
  close($h);
}
for my $port (@ports) {
  my $eintrag = pack('Q<Q<', $NET_CONNECT, $port);   # struct landlock_net_port_attr { __u64 allowed_access; __u64 port; }
  syscall($SYS_ADD, $satz, 2, $eintrag, 0) == 0 or ende("landlock_add_rule für Port $port: $!");
}

syscall($prctl, 38, 1, 0, 0, 0) == 0 or ende("no_new_privs: $!");   # PR_SET_NO_NEW_PRIVS
syscall($SYS_RESTRICT, $satz, 0) == 0 or ende("landlock_restrict_self: $!");
POSIX::close($satz);

# Proben: Die Sperren müssen jetzt greifen, sonst startet das Programm nicht
for my $port (@probe_ports) {
  socket(my $s, PF_INET, SOCK_STREAM, 0) or ende("Probe Port $port: socket: $!");
  my $ok = connect($s, pack_sockaddr_in($port, inet_aton('127.0.0.1')));
  my $fehler = $ok ? 0 : $! + 0;
  close($s);
  ende("Port $port ist nicht gesperrt, darum startet das Programm nicht") unless !$ok && $fehler == $EACCES;
}
for my $pfad (@probe_dateien) {
  next unless -e $pfad;
  my $ok = sysopen(my $h, $pfad, O_WRONLY | O_APPEND);
  my $fehler = $ok ? 0 : $! + 0;
  close($h) if $ok;
  ende("$pfad ist nicht vor Schreiben geschützt, darum startet das Programm nicht") unless !$ok && $fehler == $EACCES;
}

{ no warnings 'exec'; exec { $programm[0] } @programm; }
print STDERR "kaefig: $programm[0] startet nicht ($!)\n";
exit 127;
