---
name: statistik
description: "Met en place avec une personne sans connaissances préalables des statistiques respectueuses de la protection des données pour son site web, avec PostHog. D'abord un petit plan des événements (quels bâtons on compte, et à quel moment exactement), puis l'intégration, un événement cible comme « demande envoyée », filtrer ses propres visites et comparer avec les vraies demandes. Utilise ce skill pour « statistiques », « compter les visiteurs », « combien de gens viennent sur mon site ? », « PostHog », « Google Analytics », « tracking », « conversion », « mesurer un événement », « d'où viennent mes visiteurs ? »."
---

# Statistiques : la liste de bâtons à la porte du magasin

## L'image

Une commerçante tient une liste de bâtons à la porte de son magasin. Elle ne compte que ce qui figure d'avance sur la liste, et elle ne fait un bâton que quand c'est vraiment arrivé : le client a payé, il n'a pas seulement sorti son porte-monnaie. Elle ne retient pas les visages.

Les statistiques de ton site web doivent travailler exactement comme ça : peu de bâtons, avec des noms clairs, comptés au bon moment, sans enregistrer sur les visiteurs plus que nécessaire. Dans les statistiques, un bâton s'appelle un **événement**.

**Comment utiliser l'image :** dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** s'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement, pas de jargon. Le mot « événement » seulement après l'image de la liste de bâtons.
- La protection des données n'est pas un accessoire. Chaque réglage qui enregistre plus sur les gens a besoin d'une raison et d'une phrase dans la déclaration de protection des données (skill `recht-ch`).
- La personne crée elle-même le compte PostHog dans son navigateur web. Elle peut te donner la clé du projet (elle commence par `phc_`) : elle est faite pour le site web et elle est publique. Les clés API personnelles (`phx_`) n'ont jamais leur place dans le code.

## Déroulement

### 1. D'abord la liste, ensuite l'intégration

Crée avec la personne `docs/statistik.md`. Un seul événement cible suffit pour commencer : l'action qui compte pour elle (tirée de `docs/plan.md`, ligne « À quoi nous voyons le succès »).

```markdown
# Plan des événements

| Événement | compte quand | Indications obligatoires |
|---|---|---|
| `$pageview` | automatiquement à chaque affichage de page | – |
| `generate_lead` | formulaire envoyé avec succès (le serveur a confirmé) | `form` (quel formulaire) |
| `sign_up` | inscription à la newsletter confirmée | `location` (où sur la page) |

Propres visites : filtrées depuis le <date>
Modifications : <date> – <ce qui a été renommé, pourquoi>
```

Règles pour les noms : en minuscules avec un trait de soulignement (`generate_lead`), préférer les noms standard connus (`purchase`, `sign_up`, `generate_lead`), un événement par action, les variantes comme indication (`form: "contact"`), ne jamais nommer d'après la position (`schritt_2`).

### 2. Créer le projet PostHog

La personne s'inscrit chez PostHog, choisit l'emplacement **EU** et crée un projet. Ensuite, elle te donne la clé du projet.

### 3. Intégrer

L'extrait de code actuel du guide PostHog (« Web snippet ») dans l'en-tête de chaque page, avec ces réglages :

```js
posthog.init('phc_…', {
  api_host: 'https://eu.i.posthog.com',
  persistence: 'memory',              // pas de cookies, pas besoin de bannière
  person_profiles: 'identified_only', // pas de profils pour les visiteurs anonymes
})
```

`persistence: 'memory'` veut dire : chaque affichage de page est compté, mais PostHog ne retient personne avec des cookies. En échange, les chiffres sur les « visiteurs uniques » sont moins précis. Vérifie dans le guide PostHog actuel s'il existe entre-temps un meilleur réglage sans cookies.

### 4. L'événement cible au bon moment

Compter seulement après le succès, pas à l'ouverture du formulaire :

```js
// après que le serveur a confirmé le formulaire :
posthog.capture('generate_lead', { form: 'contact' })
```

N'envoie jamais de noms, d'adresses e-mail, de numéros de téléphone ou de texte libre comme indication.

### 5. Filtrer ses propres visites

Dans PostHog, dans les réglages du projet, active « Filter out internal and test users » (filtrer les utilisateurs internes et de test) et pose un filtre (par exemple ta propre adresse IP). Inscris la date dans `docs/statistik.md`.

### 6. Vérifier

1. Journal de bord et tapis roulant (skills `git-logbuch`, `pipeline`).
2. Ouvrir la page, envoyer une fois le formulaire pour tester.
3. Dans PostHog, sous « Activity » ou « Live events » : est-ce que `$pageview` et `generate_lead` apparaissent, avec l'indication `form` ?
4. Après une semaine : le nombre de `generate_lead` correspond-il à peu près aux vraies demandes dans la boîte mail ? Sinon : l'événement se déclenche-t-il à l'ouverture au lieu du succès ? Les tests sont-ils comptés aussi ?

## Pièges

- L'événement se déclenche au chargement au lieu du succès : les tentatives deviennent des succès.
- Trop d'événements d'un coup : personne ne les regarde. Mieux vaut trois qui sont justes.
- Renommé, mais l'analyse n'a pas été adaptée : ça ressemble à une chute.
- Déclaration de protection des données oubliée : PostHog doit y figurer, avec le but et l'emplacement (skill `recht-ch`).

## Vérifier la mission

`mission_pruefen` avec `webseite-07-statistik`. La vérification regarde si `~/projekt/docs/statistik.md` existe et si la page contient l'intégration de PostHog.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « la liste de bâtons à la porte du magasin », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
