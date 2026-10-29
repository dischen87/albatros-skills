---
name: statistik
description: 'Richtet mit einer Person ohne Vorwissen eine datenschutzfreundliche Statistik für ihre Webseite ein, mit PostHog. Zuerst ein kleiner Ereignis-Plan (welche Striche zählen wir, und wann genau), dann Einbau, ein Ziel-Ereignis wie «Anfrage gesendet», eigene Besuche herausfiltern und mit den echten Anfragen abgleichen. Nutze den Skill bei «Statistik», «Besucher zählen», «wie viele Leute kommen auf meine Seite», «PostHog», «Google Analytics», «Tracking», «Conversion», «Ereignis messen», «woher kommen meine Besucher».'
---

# Statistik: die Strichliste an der Ladentür

## Das Bild

Eine Ladenbesitzerin macht an der Tür eine Strichliste. Sie zählt nur, was vorher auf der Liste steht, und sie macht einen Strich erst, wenn es wirklich passiert ist: Der Kunde hat bezahlt, nicht nur das Portemonnaie gezückt. Gesichter merkt sie sich nicht.

Genau so soll die Statistik deiner Webseite arbeiten: wenige, klar benannte Striche, gezählt im richtigen Moment, ohne mehr über die Besucher zu speichern als nötig. Ein Strich heisst in der Statistik **Ereignis**.

**So setzt du das Bild ein:** Sag es der Person in deiner ersten Antwort, bevor du Fragen stellst oder Befehle zeigst, auch wenn sie gleich eine Lösung will.

## So sprichst du

- **Nicht nur fragen:** Fehlt das Projekt oder eine Angabe, gib trotzdem die konkreten Schritte oder schreib die Datei als Entwurf mit markierten Annahmen (`[Annahme: …]`). Frag erst am Schluss nach dem, was fehlt.
- Du-Form, kein Fachjargon. «Ereignis» erst nach dem Bild der Strichliste.
- Datenschutz ist kein Anhängsel. Jede Einstellung, die mehr über Menschen speichert, braucht einen Grund und einen Satz in der Datenschutzerklärung (Skill `recht-ch`).
- Das PostHog-Konto legt die Person selbst im Browser an. Den Projekt-Schlüssel (beginnt mit `phc_`) darf sie dir geben, er ist für die Webseite gedacht und öffentlich. Persönliche API-Schlüssel (`phx_`) gehören nie in den Code.

## Ablauf

### 1. Erst die Liste, dann der Einbau

Leg mit der Person `docs/statistik.md` an. Ein Ziel-Ereignis reicht für den Anfang: die Handlung, die für sie zählt (aus `docs/plan.md`, «Woran wir Erfolg merken»).

```markdown
# Ereignis-Plan

| Ereignis | zählt wenn | Pflicht-Angaben |
|---|---|---|
| `$pageview` | automatisch bei jedem Seitenaufruf | – |
| `generate_lead` | Formular erfolgreich abgeschickt (Server hat bestätigt) | `form` (welches Formular) |
| `sign_up` | Newsletter-Anmeldung bestätigt | `location` (wo auf der Seite) |

Eigene Besuche: herausgefiltert seit <Datum>
Änderungen: <Datum> – <was umbenannt, warum>
```

Namensregeln: klein mit Unterstrich (`generate_lead`), bekannte Standardnamen bevorzugen (`purchase`, `sign_up`, `generate_lead`), ein Ereignis pro Handlung, Varianten als Angabe (`form: "kontakt"`), nie nach der Position benennen (`schritt_2`).

### 2. PostHog-Projekt anlegen

Die Person registriert sich bei PostHog, wählt den Standort **EU** und legt ein Projekt an. Danach gibt sie dir den Projekt-Schlüssel.

### 3. Einbauen

Den aktuellen Einbau-Schnipsel aus der PostHog-Anleitung («Web snippet») in den Kopf jeder Seite, mit diesen Einstellungen:

```js
posthog.init('phc_…', {
  api_host: 'https://eu.i.posthog.com',
  persistence: 'memory',              // keine Cookies, kein Banner nötig
  person_profiles: 'identified_only', // keine Profile von anonymen Besuchern
})
```

`persistence: 'memory'` bedeutet: Jeder Seitenaufruf wird gezählt, aber PostHog merkt sich niemanden über Cookies. Dafür sind die Zahlen zu «einzelnen Besuchern» ungenauer. Prüf in der aktuellen PostHog-Anleitung, ob es inzwischen eine bessere cookielose Einstellung gibt.

### 4. Das Ziel-Ereignis im richtigen Moment

Erst nach dem Erfolg zählen, nicht beim Öffnen des Formulars:

```js
// nachdem der Server das Formular bestätigt hat:
posthog.capture('generate_lead', { form: 'kontakt' })
```

Nie Namen, E-Mail-Adressen, Telefonnummern oder Freitext als Angabe mitschicken.

### 5. Eigene Besuche herausfiltern

In PostHog unter den Projekt-Einstellungen «Interne Nutzer und Testnutzer herausfiltern» einschalten und einen Filter setzen (zum Beispiel die eigene IP-Adresse). Datum in `docs/statistik.md` eintragen.

### 6. Prüfen

1. Logbuch und Fliessband (Skills `git-logbuch`, `pipeline`).
2. Seite öffnen, Formular einmal testweise abschicken.
3. In PostHog unter «Activity» oder «Live events»: Erscheinen `$pageview` und `generate_lead` mit der Angabe `form`?
4. Nach einer Woche: Stimmt die Zahl der `generate_lead` ungefähr mit den echten Anfragen im Postfach überein? Wenn nicht: Feuert das Ereignis beim Öffnen statt beim Erfolg? Zählen Tests mit?

## Stolpersteine

- Ereignis feuert beim Laden statt beim Erfolg: Versuche werden zu Erfolgen.
- Zu viele Ereignisse auf einmal: niemand schaut sie an. Lieber drei, die stimmen.
- Umbenannt, aber die Auswertung nicht angepasst: Das sieht aus wie ein Einbruch.
- Datenschutzerklärung vergessen: PostHog muss dort stehen, mit Zweck und Standort (Skill `recht-ch`).

## Mission prüfen

`mission_pruefen` mit `webseite-08-statistik`. Die Prüfung schaut, ob `~/projekt/docs/statistik.md` existiert und die Seite den PostHog-Einbau enthält.

## Schlussnachricht

Deine letzte Nachricht in diesem Schritt beginnt mit einem Satz zum Bild «die Strichliste an der Ladentür», der den Kern noch einmal sagt. Danach: was geschafft ist, wo das Ergebnis liegt, was noch offen ist und was als Nächstes kommt.
