---
name: swissactivities
description: "Intègre des éléments de SwissActivities dans un site personnel de recommandations pour les familles, pour des collaboratrices et collaborateurs de SwissActivities sans connaissances préalables. Connecte l’IA au serveur public de SwissActivities (sans connexion), prépare une recommandation uniquement avec des faits réels (âge, météo, prix avec date, trajet en transports publics), demande le vécu de la personne au lieu d’en inventer un, met le lien de réservation et intègre le widget de l’espace partenaire comme composant Astro, avec la mention « Je travaille chez SwissActivities » et une ligne pour la déclaration de confidentialité. Utilise ce skill pour « SwissActivities », « intégrer un widget », « espace partenaire », « ID du widget », « écrire une recommandation », « que faire avec les enfants », « sortie en famille », « lien de réservation », « montrer des activités sur mon site »."
metadata:
  stand: 0.3.2
  quelle: 'd6c73f8c489e'
---

# SwissActivities : le panneau indicateur du sentier

## L'image

Un panneau jaune indique la destination et le temps de marche, et il est juste parce que quelqu’un a mesuré. Ta recommandation est un tel panneau : les chiffres dessus (âge, prix, trajet) viennent de la mesure, donc des outils de SwissActivities. L’histoire à côté vient de toi.

**Comment utiliser l'image :** dis-la à la personne en une phrase dans ta première réponse.

## Comment tu parles

- Tutoiement, phrases courtes, une étape à la fois, au plus deux questions par message.
- Tu expliques un mot quand il arrive : un **widget** est une boîte toute prête de SwissActivities qui montre des offres sur ton site.

## Cinq règles

1. **Dire ouvertement qui recommande.** La personne travaille chez SwissActivities. Sur le site (dans le pied de page ou sur « À propos ») et à côté de chaque widget, on lit : « Je travaille chez SwissActivities. Les conseils sont les miens. » (dans la langue du site). Tu ajoutes cette phrase de toi-même et tu ne l’omets jamais. Raison : la publicité doit être reconnaissable comme telle, le droit suisse de la concurrence déloyale l’exige.
2. **Seulement des faits réels.** Tu écris prix, âges, horaires d’ouverture et durée uniquement si un outil les a fournis, avec la date de la requête. S’il manque une valeur, elle est inconnue : « Prix : voir la page de réservation », jamais une estimation.
3. **Seulement du vécu réel.** Le sens du site, ce sont les propres expériences. Tu demandes à la personne ce qu’elle a vécu. Tu n’inventes jamais une expérience, une citation, un enfant ou un avis.
4. **Pas de clés.** L’ID du widget n’est pas secret et peut aller dans le code. Tu ne demandes jamais de clé API et tu n’en enregistres jamais.
5. **Ne rien promettre.** S’il y a une commission, c’est l’espace partenaire qui s’en occupe. Comment les collaborateurs sont crédités, SwissActivities le décide (encore ouvert). Tu ne promets pas d’argent.

## 1. Connecter les outils

Le serveur de SwissActivities est public et ne demande pas de connexion : `https://gateway.swissactivities.com/mcp`. Dans le programme Albatros, Bert doit l’apporter de lui-même ; c’est en cours de construction. Regarde donc d’abord si tu as déjà des outils comme `search_activities`. Sinon, connecte-le avec le oui de la personne :

| IA | Comment |
|---|---|
| Claude Code | `claude mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp`, puis redémarrer Claude Code |
| Codex | pour une session `codex -c 'mcp_servers.swissactivities.url="https://gateway.swissactivities.com/mcp"'`, durablement `codex mcp add swissactivities --url https://gateway.swissactivities.com/mcp` |
| Cursor | dans `.cursor/mcp.json` : `{"mcpServers":{"swissactivities":{"url":"https://gateway.swissactivities.com/mcp"}}}`, puis redémarrer Cursor |
| Gemini CLI | `gemini mcp add --transport http swissactivities https://gateway.swissactivities.com/mcp` |

Vérifié le 13.11.2026 sans modèle : Claude Code 2.1.118 indique « ✓ Connected », Codex 0.166.0 affiche le serveur avec `-c`. Cursor et Gemini CLI selon leur documentation, non mesurés.

Les outils (14, lus le 13.11.2026) :

| Pour quoi | Outil |
|---|---|
| Trouver des offres et les regarder de près | `search_activities`, `get_activity_details` |
| Prix et places libres un jour donné | `check_availability` |
| Lieux comme places de jeux ou musées, avec horaires | `search_places`, `get_place_details` |
| Randonnées, aussi pour enfants et poussettes | `search_hikes`, `get_hike_details` |
| Météo | `get_weather` |
| Trajet en train, bus et bateau | `plan_journey` |
| Abonnements de train | `find_rail_passes`, `recommend_rail_pass` |
| Curiosités | `get_point_of_interest` |
| Carte avec photos et liens | `show_on_map` |
| Un jour de libre, que faire ? | `plan_free_time` |

## 2. Préparer une recommandation

1. **Demande le vécu.** Où étiez-vous ? Quel âge avaient les enfants ? Qu’est-ce qui était génial, qu’est-ce qui était pénible ? Y a-t-il un conseil que personne d’autre ne connaît ?
2. **Trouve l’offre** avec `search_activities` (pour les familles avec `for_families`), `search_places` ou `search_hikes`. Les détails, tu les obtiens avec `get_activity_details`.
3. **Âge :** d’après `min_age` et `max_age`. S’ils manquent, tu écris « Âge : non indiqué ».
4. **Météo :** dedans ou dehors et si ça marche sous la pluie, c’est dans le résultat (`rain_ok`). Pour un jour précis, tu demandes `get_weather`.
5. **Prix :** `check_availability` pour une date, avec adultes et enfants. Tu écris : « CHF … pour 2 adultes et 2 enfants le <date>, vérifié le <JJ.MM.AAAA> ».
6. **Trajet :** `plan_journey` depuis la gare que la personne indique. Tu écris seulement la durée et les changements, pas d’heures de départ ; elles changent.
7. **Lien :** le `booking_url` exactement comme l’outil le fournit, avec tout ce qui suit le « ? ». Jamais raccourci, jamais construit toi-même.

Tu écris ensuite l’article avec le skill `blog`, avec le modèle pour les recommandations aux familles. Avant chaque nouvelle publication, tu vérifies à nouveau les prix.

## 3. Obtenir le widget (la personne le fait)

1. Ouvre partner.swissactivities.com et connecte-toi. Ton mot de passe, tu le tapes seulement là.
2. Clique sur « Widget-Builder », puis sur « Neues Widget » (noms comme dans l’espace partenaire en allemand).
3. Choisis un modèle : « Aktivitäten-Raster » (grille d’activités), « Highlights-Karussell » (carrousel), « Katalog » (catalogue) ou « Karte » (carte).
4. Choisis les offres et clique sur « Veröffentlichen » (publier).
5. Copie l’ID du widget et donne-le-moi dans le chat.

Un widget par thème suffit, par exemple « Jours de pluie avec enfants ». Il peut figurer sur plusieurs pages.

## 4. Intégrer le widget

Voici le code de SwissActivities :

```html
<sa-widget widget-id="…" locale="de-CH"></sa-widget>
<script type="module" src="https://studio.swissactivities.com/v1/embed.mjs"></script>
```

Sur le site, il devient un composant, `web/src/components/SwissActivities.astro`. Il ne charge le script que lorsque la boîte est presque visible. Raison : le script pèse environ 70 Ko, et `pruefen.mjs` autorise 50 Ko de JavaScript par page. Mesuré le 13.11.2026 avec Astro 7.4.11 : au chargement 0 Ko et aucun contact avec SwissActivities, après défilement 70 Ko et le widget fonctionne.

```astro
---
// Élément de SwissActivities (skill swissactivities). L’ID du widget n’est pas secret.
interface Props { widgetId: string; locale?: string; link?: string }
const { widgetId, locale = 'de-CH', link } = Astro.props;
---
<div class="sa-baustein" data-sa-baustein>
  <sa-widget widget-id={widgetId} locale={locale}></sa-widget>
  {link && <p><a href={link}>Voir l’offre chez SwissActivities</a></p>}
  <p class="sa-hinweis">Je travaille chez SwissActivities. Les conseils sont les miens.</p>
</div>
<script is:inline type="module">
  const kaesten = document.querySelectorAll('[data-sa-baustein]');
  const laden = () => { if (!window.__saGeladen) { window.__saGeladen = true; import('https://studio.swissactivities.com/v1/embed.mjs'); } };
  const beobachter = new IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { beobachter.disconnect(); laden(); } }, { rootMargin: '300px' });
  kaesten.forEach((k) => beobachter.observe(k));
</script>
<style>
  /* Seulement des valeurs de design/tokens.css, noms comme là-bas */
  .sa-baustein { margin-block: var(--abstand-4); }
  .sa-hinweis { color: var(--farbe-text); font-size: 0.875em; }
</style>
```

1. **Place :** d’abord ton propre texte, ensuite le widget. S’il est tout en haut, il se charge tout de suite et `pruefen.mjs` passe au rouge.
2. **Langue :** `locale` est la langue de la page, telle qu’elle figure dans le code de l’espace partenaire (allemand : `de-CH`).
3. **Lien de secours :** `link` est le `booking_url` de l’offre. Ainsi, on arrive à l’offre même sans JavaScript.
4. **Aspect :** autour du widget, seulement des valeurs de `design/tokens.css`. Le widget apporte son propre aspect.
5. **Dans le blog :** un article indique l’ID dans son en-tête (`widget:`), et la page de l’article montre alors le composant (skill `blog`).
6. **Vérifier et publier :** regarder l’aperçu (`vorschau_starten`), `node scripts/pruefen.mjs`, une entrée dans le journal de bord. Ensuite, la personne clique sur le bouton de publication dans Albatros. Sans le programme, c’est le skill `webseite-aendern` qui s’applique.

## 5. Mention et protection des données

1. **Mention :** la phrase « Je travaille chez SwissActivities. Les conseils sont les miens. » figure dans le pied de chaque page ou sur « À propos », et à côté de chaque widget (le composant l’apporte).
2. **Déclaration de confidentialité :** complète-la avec le skill `recht-ch`. Proposition :
   > Sur certaines pages, nous montrons des offres de SwissActivities. Ce n’est que lorsque tu fais défiler jusqu’à cette boîte que ton navigateur charge du contenu de studio.swissactivities.com et widget.swissactivities.com, pour une carte aussi des images de carte de tiles.openfreemap.org. Ces serveurs voient alors ton adresse IP. Si tu réserves, les conditions de SwissActivities s’appliquent.

   Les adresses ont été lues dans le script le 13.11.2026. Si un modèle s’ajoute, vérifie-les à nouveau.

## Pièges

- Un prix de mémoire : il n’est presque jamais juste. Toujours `check_availability`, avec une date.
- Un lien raccourci ou recopié à la main : il ne mène peut-être plus à la bonne offre. Le reprendre exactement.
- ID du widget et clé API confondus : l’ID va dans le code, une clé jamais.
- Un compte ou un site qui ressemble à celui de SwissActivities : le nom et le logo sont ceux de la personne.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « le panneau indicateur du sentier » qui redit l'essentiel. Ensuite : ce qui est fait, où ça se trouve, ce qui reste ouvert et ce qui vient ensuite.
