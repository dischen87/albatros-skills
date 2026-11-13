---
name: kanaele
description: 'Hilft einer Person ohne Vorwissen, Social-Media-Konten für ihre Webseite selbst anzulegen (Instagram als professionelles Konto, Facebook-Seite, LinkedIn-Seite, Pinterest, TikTok freiwillig), mit gleichem Namen wie die Seite und Bio mit Link; Passwörter und Codes bleiben bei ihr. Danach «Neue Beiträge teilen»: Zu jedem neuen Blogbeitrag schreibt Bert je Kanal einen kurzen Beitrag als Entwurf (Werkzeug entwurf), die Person gibt frei und postet selbst; als wiederkehrende Hilfe mit dem Werkzeug aufgabe. Nutze den Skill bei «Social Media», «Instagram», «Facebook-Seite», «LinkedIn», «Pinterest», «TikTok», «Konto anlegen», «Beitrag teilen», «Post schreiben», «wie mache ich meine Seite bekannt».'
metadata:
  stand: 0.3.3
---

# Kanäle: die Plakatsäulen in der Stadt

## Das Bild

Deine Webseite ist dein Laden. Instagram, Facebook und die anderen sind Plakatsäulen in verschiedenen Quartieren. Auf jedem Plakat stehen derselbe Name und dasselbe Bild, dazu ein Pfeil zum Laden: der Link. Plakate kleben darfst nur du.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, in einem Satz.

## So sprichst du

- Du-Form, kurze Sätze, nummerierte Schritte, höchstens zwei Fragen in einer Nachricht.
- Die Knöpfe der Apps ändern manchmal ihren Namen. Sieht die Person etwas anderes, soll sie dir sagen, was sie sieht.

## Drei feste Regeln

1. **Die Konten legt die Person selbst an.** Passwörter und Codes (Zwei-Faktor) tippt sie nur in der App. Du fragst nie danach und siehst sie nie.
2. **Du postest nie.** Jeder Beitrag ist ein Entwurf. Die Person liest, gibt frei und postet mit ihrem eigenen Klick. Das gilt immer, auch wenn sie sagt «mach einfach».
3. **Offen sagen, wer empfiehlt.** Verlinkt ein Beitrag auf SwissActivities und die Person arbeitet dort, steht im Beitrag: «Ich arbeite bei SwissActivities. Die Tipps sind meine eigenen.» Du baust das von dir aus ein und lässt es nie weg. Grund: Werbung muss als Werbung erkennbar sein (Schweizer Lauterkeitsrecht). Die Konten sehen nie aus wie die offiziellen von SwissActivities: eigener Name, eigenes Bild. Ob die Firma Regeln für Social Media hat, fragt die Person dort nach.

## 1. Name und Bio vorbereiten

Du schreibst `docs/kanaele.md`:

```markdown
# Kanäle
Name: <wie die Webseite, z. B. ausflugsmami>
Link: <Adresse der Webseite>
Bio: <höchstens 150 Zeichen, mit dem Hinweis>
| Kanal | Konto | Stand |
|---|---|---|
| Instagram | @… | offen |

## Geteilt
```

1. **Name:** derselbe wie die Webseite, überall gleich. Die Person prüft in jeder App, ob er frei ist; sonst ein kleiner Zusatz, überall derselbe.
2. **Bild:** Logo oder dasselbe Foto auf allen Kanälen.
3. **Bio:** zum Beispiel «Familienausflüge in der Schweiz, selbst getestet. Ich arbeite bei SwissActivities, die Tipps sind meine eigenen.» Dazu der Link zur Webseite.

## 2. Die Konten anlegen (macht die Person)

**Instagram (professionelles Konto)**
1. Instagram-App öffnen, «Neues Konto erstellen», mit deiner E-Mail-Adresse.
2. Name, Profilbild und Bio aus `docs/kanaele.md` eintragen.
3. Profil, Menü ☰, «Kontoart und Tools», «Zu professionellem Konto wechseln», Kategorie wählen (z. B. «Blogger»), «Creator».
4. «Profil bearbeiten», «Links», die Adresse deiner Webseite.
5. In den Einstellungen die Zwei-Faktor-Authentifizierung einschalten.

**Facebook-Seite**
1. Mit deinem persönlichen Facebook-Konto anmelden. Eine Seite braucht eins dahinter, gezeigt wird es nicht.
2. Menü, «Seiten», «Neue Seite erstellen».
3. Name, Kategorie (z. B. «Blogger») und Bio eintragen.
4. Profilbild, Titelbild und die Adresse deiner Webseite.
5. «Fertig». Dann in den Einstellungen die Zwei-Faktor-Authentifizierung einschalten.

**LinkedIn-Seite**
1. Oft reicht dein persönliches Profil: Dort teilst du die Beiträge einfach selbst. Eine Seite lohnt sich, wenn die Empfehlungen ein eigenes Projekt sind.
2. Auf LinkedIn anmelden, oben «Für Unternehmen», «Unternehmensseite erstellen».
3. Name, Adresse der Seite (linkedin.com/company/<name>), Webseite, Logo und Slogan eintragen.
4. Bestätigen, dass du die Seite anlegen darfst, und «Seite erstellen».

**Pinterest**
1. Ein Unternehmenskonto anlegen: auf pinterest.ch «Registrieren» und «Unternehmenskonto» wählen, oder ein bestehendes Konto umstellen.
2. Name, Profilbild, Info und die Adresse deiner Webseite.
3. Die Webseite bestätigen: Pinterest zeigt ein kurzes Stück Code. Gib es mir, ich baue es in die Seite ein. Es ist kein Geheimnis.
4. Pinnwände anlegen, zum Beispiel «Regentage mit Kind» und «Wandern mit Kinderwagen».

**TikTok (freiwillig)**
1. TikTok-App öffnen, «Registrieren», mit deiner E-Mail-Adresse.
2. Name, Profilbild und Bio aus `docs/kanaele.md`.
3. Geht kein Link im Profil, steht die Adresse der Webseite im Beitrag.
4. In den Einstellungen die Zwei-Faktor-Authentifizierung einschalten.

Ist ein Konto fertig, trägst du in `docs/kanaele.md` den Namen ein und setzt `Stand` auf `fertig`. Menünamen nach dem Stand der Apps, nicht nachgeprüft am 13.11.2026.

## 3. Neue Beiträge teilen

Ist ein Blogbeitrag im Netz (Skill `blog`), machst du das:

1. **Lesen:** Titel, Satz aus `description`, Adresse des Beitrags, Bild.
2. **Je Kanal ein Entwurf:** Für jeden fertigen Kanal aus `docs/kanaele.md` rufst du `entwurf` mit `art: beitrag` auf. In `an` steht der Kanal (z. B. «Instagram»), in `text` der Beitrag. Kurz: ein Satz, der neugierig macht, ein Satz Nutzen, der Link, drei bis fünf Hashtags und der Hinweis aus Regel 3.
3. **Je Kanal anders:** Instagram mit «Link im Profil» und Bild im Hochformat; Facebook mit dem Link direkt; LinkedIn etwas sachlicher; Pinterest als Pin mit Bild im Hochformat und Link; TikTok als Text zu einem kurzen Video der Person.
4. **Die Person entscheidet:** Sie sieht die Entwürfe in Albatros, ändert, gibt frei und postet selbst.
5. **Merken:** Unter `## Geteilt` in `docs/kanaele.md` kommt `<slug> <TT.MM.JJJJ>`. So entsteht kein Entwurf doppelt.

Ohne das Programm Albatros legst du die Entwürfe in `docs/beitraege/<TT.MM.JJJJ>-<slug>.md` ab; die Person kopiert sie in die App.

## 4. Als wiederkehrende Hilfe einrichten

Biete es an. Erst nach ihrem Ja legst du es mit `aufgabe` an, mit `ausloeser: zeit` und `wiederholen: woechentlich`:

- **Titel:** «Neue Beiträge teilen»
- **Wann:** jeden Montag um 9 Uhr (Wochentag und Zeit wählt die Person)
- **Anweisung:** «Schau in web/src/content/blog/ nach Beiträgen, die im Netz sind und unter ## Geteilt in docs/kanaele.md fehlen. Für jeden: je fertigen Kanal einen Entwurf mit entwurf, art beitrag, mit dem Hinweis auf SwissActivities, wenn er dorthin verlinkt. Dann den Beitrag unter ## Geteilt eintragen. Nichts posten.»

Bietet `aufgabe` einen Auslöser für eine frisch veröffentlichte Seite an, nimm lieber diesen (`ausloeser: ereignis`). Dann kommen die Entwürfe gleich nach dem Veröffentlichen statt am Montag.

## Stolpersteine

- Fünf Namen für eine Seite: Niemand findet zusammen, was zusammengehört. Überall derselbe Name.
- Passwort im Chat: Sag der Person, sie soll es sofort ändern. Du speicherst es nirgends.
- Beitrag ohne Hinweis auf die Arbeitgeberin: Der Satz aus Regel 3 gehört in jeden Beitrag mit Link zu SwissActivities.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die Plakatsäulen in der Stadt», der den Kern noch einmal sagt. Danach: was geschafft ist, welche Konten fertig sind, was noch offen ist und was als Nächstes kommt.
