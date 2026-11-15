---
name: blog
description: "Met en place avec une personne sans connaissances préalables un blog sur son site Astro et écrit des articles avec elle : chaque article est un fichier Markdown dans le journal de bord (web/src/content/blog/<slug>.md avec title, date, description, bild), la personne raconte l’idée, Bert écrit le fichier, elle le lit dans l’aperçu et clique sur publier dans Albatros. Avec un modèle pour les recommandations aux familles (pour qui, quoi, quand et météo, trajet, coût, mon conseil, lien) et des règles pour ses propres photos. Utilise ce skill pour « blog », « article de blog », « nouvel article », « écrire un article », « publier une recommandation », « noter une idée de sortie », « actualités sur mon site »."
metadata:
  stand: 0.3.5
  quelle: 'e22602facd46'
---

# Blog : le classeur des fiches de sortie

## L'image

Sur l’étagère, il y a un classeur. Chaque sortie est une fiche dedans, toujours étiquetée de la même façon en haut : titre, date, une phrase sur le sujet. Les nouvelles fiches s’ajoutent devant, les anciennes restent. Le site lit le classeur et montre joliment chaque fiche.

**Comment utiliser l'image :** dis-la à la personne en une phrase dans ta première réponse.

## Comment tu parles

- Tutoiement, phrases courtes, étapes numérotées, au plus deux questions par message.
- Tu expliques le **Markdown** ainsi : un texte simple dans lequel `**gras**` devient gras. La personne n’a pas besoin d’en savoir plus.

## Où se trouvent les articles

Chaque article est un fichier dans le journal de bord : `web/src/content/blog/<slug>.md`. Le `<slug>` est le titre en minuscules avec des traits d’union, par exemple `parc-accrobranche-enfants` ; il devient l’adresse `/blog/parc-accrobranche-enfants/`. C’est le niveau le plus simple du skill `cms` (textes dans le projet) : pas de CMS, pas de base de données, Bert écrit les fichiers. Si d’autres doivent écrire plus tard sans Bert, le skill `cms` montre l’étape suivante.

**Une recommandation est un article.** Un conseil pour les familles ou une idée de sortie est un article de blog et se trouve dans `web/src/content/blog/`. Si le site a déjà sa propre collection pour les recommandations (par exemple `web/src/content/tipps/` issue de la construction), Albatros compte ses entrées comme des articles, avec les mêmes règles (en-tête, liens, mention, prix, « Mon conseil »). Tu écris alors l’article ou le vécu à cet endroit et tu ne crées jamais un deuxième blog vide.

**Avant les deux oui** (plan confirmé, ébauche validée ; `naechstes` indique `bauen_erlaubt: false`), tu ne construis rien sur le site. Écris alors l’article comme brouillon dans `docs/beitraege/<slug>.md`, avec le même en-tête (title, date, description). Après les deux oui, tu le déplaces dans `web/src/content/blog/`. Albatros vérifie les deux endroits de la même façon.

## 1. Mettre en place le blog une fois

Le blog est une partie du site comme une autre. Si le site est encore en planification, il entre dans la liste de construction (skill `webseite-planen`) et se construit avec le skill `webseite-bauen`. Si le site est déjà en ligne, c’est un grand changement (skill `webseite-aendern`). On le construit ainsi (Astro 7, mesuré le 13.11.2026 avec 7.4.11) :

1. `web/src/content.config.ts` décrit l’en-tête de chaque article :
   ```ts
   import { defineCollection } from 'astro:content';
   import { glob } from 'astro/loaders';
   import { z } from 'astro/zod';

   const blog = defineCollection({
     loader: glob({ pattern: '*.md', base: './src/content/blog' }),
     schema: ({ image }) => z.object({
       title: z.string(),
       date: z.coerce.date(),
       description: z.string().max(160),
       bild: image().optional(),
       bildtext: z.string().optional(),
       widget: z.string().optional(),
     }),
   });

   export const collections = { blog };
   ```
2. `web/src/pages/blog/index.astro` montre tous les articles, les plus récents d’abord (`getCollection('blog')`, triés par `date`).
3. `web/src/pages/blog/[slug].astro` montre un article dans la mise en page du site :
   ```astro
   ---
   import { getCollection, render } from 'astro:content';
   import { Image } from 'astro:assets';
   import SwissActivities from '../../components/SwissActivities.astro';
   export async function getStaticPaths() {
     return (await getCollection('blog')).map((b) => ({ params: { slug: b.id }, props: { b } }));
   }
   const { b } = Astro.props;
   const { Content } = await render(b);
   ---
   <article>
     <h1>{b.data.title}</h1>
     {b.data.bild && <Image src={b.data.bild} alt={b.data.bildtext ?? ''} width={1200} />}
     <Content />
     {b.data.widget && <SwissActivities widgetId={b.data.widget} />}
   </article>
   ```
   La ligne avec `SwissActivities` n’existe que si le site montre des offres de SwissActivities (skill `swissactivities`).
4. L’aspect seulement avec les valeurs de `design/tokens.css` et les composants du site.

## 2. Écrire un article

1. **La personne raconte l’idée :** où étiez-vous, avec qui, qu’avez-vous vécu ? Si elle a déjà raconté son vécu (dans le chat ou dans le texte de la tâche), tu ne redemandes pas. Si elle a des photos, elle les met dans le chat ou dans le dossier du projet.
2. **Bert va chercher les faits.** Pour une sortie avec le skill `swissactivities` : âge, météo, prix avec date, trajet, lien. Rien de mémoire.
3. **Bert écrit le fichier** selon le modèle ci-dessous. Ce que la personne a vécu, il le reprend exactement avec ses mots à elle. Il n’ajoute rien qu’elle n’a pas dit : pas de météo, pas de moment de la journée, pas de sentiments, pas de citations. Si elle écrit « un jour de pluie », il n’écrit pas « Ce jour-là, il a plu toute la matinée ». S’il manque quelque chose, il demande au lieu d’inventer.
4. **La personne lit dans l’aperçu.** Bert le lance avec `vorschau_starten` (sans le programme : `cd web && npm run dev`). Elle dit ce qui doit changer ; Bert le modifie.
5. **La personne confirme.** Un article ne compte que quand elle l’a confirmé dans Albatros avec « C’est bien ça » : la section « Mon conseil », et pour un article sans cette section, le texte entier. Dis-lui en une phrase où : dans la liste de contrôle, à l’étape « Blog ». Sans le programme, elle le dit dans le chat.
6. **Bert vérifie.** Si tu as écrit ou modifié des articles dans ce passage, ou des pages qui montrent un partenaire (par exemple SwissActivities), tu appelles avec le programme, avant la fin du passage, l’outil `beitrag_pruefen` (serveur « albatros-arbeitsplatz »). Chaque erreur qu’il signale, tu la corriges dans le même passage, puis tu l’appelles une nouvelle fois. Sans le programme, tu vérifies avec `node scripts/pruefen.mjs`. Ensuite une entrée dans le journal de bord : `git add web && git commit -m "Blog: <titre>"`.
7. **La personne clique sur le bouton de publication dans Albatros.** Bert ne fait pas de `git push`. Sans le programme, c’est le skill `webseite-aendern` qui s’applique (validation, puis push).
8. **Ensuite partager :** les publications pour Instagram et les autres, Bert les écrit en brouillon (skill `kanaele`).

## Modèle : recommandation pour les familles

```markdown
---
title: "Parc accrobranche avec les enfants : notre samedi"
date: 2026-11-14
description: "Une phrase sur le sujet. Google et l’aperçu au partage l’affichent."
bild: ../../assets/blog/accrobranche.jpg
bildtext: "Deux enfants dans le parc accrobranche, vus de dos"
widget: ""
---

**Pour qui :** dès … ans selon le prestataire. Nos enfants avaient … et … ans.

**Quoi :** …

**Quand et météo :** dedans ou dehors, par temps de pluie …

**Trajet :** depuis … en train environ … minutes, … changement(s) (état au <JJ.MM.AAAA>).

**Coût :** CHF … pour … le <date>, vérifié le <JJ.MM.AAAA>.

**Mon conseil :** … (seulement ce que la personne a vécu elle-même)

**Lien :** [Voir l’offre](<booking_url exactement comme fourni>)
```

Les noms des champs de l’en-tête (`title`, `date`, `bild` …) restent tels quels ; le texte est dans la langue du site. Les champs vides disparaissent : `widget` seulement avec un ID de widget, `bild` seulement avec une photo.

Dans « Mon conseil », il n’y a jamais d’espace réservé (comme « [Espace réservé : vient plus tard] »). Si la personne n’a pas encore raconté son vécu, la recommandation reste un brouillon dans `docs/beitraege/` jusqu’à ce qu’elle le raconte.

## 3. Photos

1. **Seulement ses propres photos** ou celles pour lesquelles elle a l’autorisation. Jamais d’images d’Internet.
2. **Enfants :** de préférence de dos ou sans visage. Des personnes reconnaissables seulement avec leur accord, pour les enfants avec celui des parents (skill `recht-ch`).
3. **Rangement :** `web/src/assets/blog/`, un nom sans espaces. Astro réduit l’image lors de la construction.
4. **Texte de l’image :** `bildtext` dit en une phrase ce qu’on voit. Un lecteur d’écran le lit à voix haute.

## Pièges

- Une expérience que personne n’a vécue : le site vit de vrais conseils. Mieux vaut plus court et vrai.
- Des prix sans date : ils deviennent obsolètes. Toujours avec « vérifié le ».
- Date mal écrite dans l’en-tête (`14.11.2026` au lieu de `2026-11-14`) : la construction s’arrête. Bert l’écrit comme dans le modèle.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « le classeur des fiches de sortie » qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve l’article, ce qui reste ouvert et ce qui vient ensuite.
