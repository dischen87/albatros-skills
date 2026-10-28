---
name: webseite-planen
description: "Planifie avec une personne sans connaissances préalables son site web, avant de construire : pour qui, ce que les visiteurs doivent faire, quelles pages il faut, quels contenus existent déjà, quels modèles lui plaisent. Le résultat est un plan dans docs/plan.md. Utilise ce skill quand on dit « je veux un site web », « planifier mon site », « de quoi j'ai besoin pour un site web ? », « quelles pages il me faut ? », « plan du site », « sitemap », « par où je commence ? », et toujours avant de construire la première page sur le parcours site web."
---

# Planifier le site web : le plan de la maison

## L'image

Personne ne construit une maison sans dessiner d'abord un plan. Le plan montre quelles pièces il y a, comment on passe de l'une à l'autre et où se trouve la porte d'entrée. Pour un site web, les pièces sont les pages, les couloirs sont les menus et les liens, et la porte d'entrée est la page d'accueil.

Un plan sur une feuille de papier suffit. Il évite beaucoup de transformations plus tard.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Demande ce qui manque seulement à la fin.
- Tutoiement, questions courtes, une question par message. Reprends les réponses mot pour mot : la personne doit reconnaître son plan. Pas de jargon : « pages » plutôt que « sitemap », « menu » plutôt que « navigation ».

## Déroulement : huit questions

1. **De quoi s'agit-il ?** En une phrase, comme tu le raconterais à une voisine.
2. **Pour qui ?** Qui doit trouver le site ? Le plus concrètement possible : « les parents du quartier qui cherchent une cantine de midi » plutôt que « tout le monde ».
3. **Que doivent faire les visiteurs ?** Une seule chose principale : appeler, envoyer un formulaire, s'inscrire, passer, acheter. Tout sur le site mène là.
4. **Quelles pages faut-il ?** Pour commencer, cinq au maximum. Un départ qui a fait ses preuves :
   - Accueil : qui, quoi, pour qui, et le bouton vers la chose principale
   - Offre ou « Ce que nous faisons »
   - À propos de nous ou de moi
   - Contact
   - Mentions légales et protection des données (obligatoire, voir le skill `recht-ch`)
5. **Qu'est-ce qui existe déjà ?** Textes, photos, logo, prix, horaires d'ouverture. Ce qui manque va sur la liste pour le skill `inhalte`.
6. **Quels modèles ?** Deux ou trois sites web qui plaisent à la personne, et ce qui lui plaît exactement (les couleurs, le calme, les photos, la brièveté des textes). Cela aidera plus tard avec le skill `gestaltung`.
7. **Que doit savoir faire le site ?** Dans quelles langues, qui modifie les contenus, les visiteurs doivent-ils s'inscrire ou se connecter ? Avec plusieurs langues, ça reste un site normal. Il ne faut une brique que pour une liste d'inscription, une connexion ou un tableau d'affichage pour d'autres (skill `bausteine`).
8. **À quoi vois-tu que le site fonctionne ?** Un chiffre que la personne veut suivre, par exemple le nombre de demandes par mois. Le skill `statistik` en aura besoin plus tard.

## Le plan

Écris les réponses avec la personne dans `docs/plan.md` dans le projet :

```markdown
# Plan pour <nom du site>

**En une phrase :** …
**Pour qui :** …
**Chose principale pour les visiteurs :** … (bouton : « … »)
**À quoi nous voyons le succès :** …
**Langues :** …
**Briques :** aucune / liste d'inscription / membres avec connexion / tableau d'affichage / grand CMS

## Pages
- Accueil : …
- …

## Contenus
| Quoi | Nous l'avons | Manque encore |
|---|---|---|

## Modèles
- <adresse> : nous plaît parce que …
```

À la fin, lis le plan à la personne et demande : « C'est juste comme ça ? » Seulement ensuite, dans le journal de bord (skill `git-logbuch`) et, par le tapis roulant, sur le serveur.

## Ce que tu épargnes à la personne

- **Trop à la fois :** Blog, boutique et espace membres, c'est pour plus tard. D'abord une page qui fait bien la chose principale. Plusieurs langues ne posent pas de problème si les textes sont là.
- **Des choix techniques trop tôt :** Le modèle dans le dépôt suffit pour commencer. Un système pour les contenus (skill `cms`) ne vient que lorsque quelqu'un sans connaissances techniques doit régulièrement modifier des contenus.
- **Logo et couleurs en premier :** La mise en forme vient après le contenu. Une belle page vide n'aide personne.

## Vérifier la mission

`mission_pruefen` avec `webseite-01-webseite-planen`. La vérification regarde si `docs/plan.md` se trouve dans le projet (avec Pilot dans `~/projekt` sur le serveur, avec Light dans le port).

## Message final

Ton dernier message à cette étape commence par une phrase sur l'image « le plan de la maison », qui en redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
