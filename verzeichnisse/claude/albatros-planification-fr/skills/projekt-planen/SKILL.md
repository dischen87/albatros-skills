---
name: projekt-planen
description: "Planifie un projet de site web avec Albatros, lit son état enregistré et note les étapes confirmées. À utiliser pour la planification Albatros ou la prochaine étape d'un projet Albatros."
metadata:
  stand: 0.3.3
---

# Planifier un projet avec Albatros

Réponds dans la langue de la personne, simplement, avec au plus deux questions ouvertes par message. Utilise les instructions fournies ici.

## Connexion et reprise

Lis l'état réel du projet avec `konto_status` et `lage`. Pour `lage`, tu peux envoyer `skills_stand` depuis metadata.stand et `projekt: projekt`. N'envoie que de courts éléments de preuve issus de fichiers de résultat explicitement partagés pour ce projet ; aucun historique de conversation ni identifiant secret. Si la connexion manque, invite la personne à ouvrir la connexion du plugin dans son navigateur. Ne demande jamais de mot de passe, clé privée ou code de connexion. En cas d'erreur, poursuis la planification localement et indique que l'état enregistré est inconnu.

Choisis avec la personne `webseite` ou `geschaeft` ; enregistre uniquement son choix avec `weg_waehlen`. Enregistre `lernen` ou `machen` avec `modus_waehlen` si elle choisit ce mode et que l'outil existe. Traite une idée d'activité comme un projet à préciser dans ce parcours.

## Du projet au prototype local vérifié

Travaille sur la phase réellement ouverte, de P1 à P10, indiquée par `lage`, sans inventer l'achèvement des étapes précédentes :

- P1 : note le nom du projet, son objectif en une phrase, son public et un critère de réussite observable. Garde les inconnues comme questions ouvertes.
- P2 : rassemble les contenus existants, sources et références. Utilise des sources accessibles et distingue les faits des hypothèses.
- P3 : formule un petit plan des pages, fonctions, langues et critères de validation.
- P4 : examine le plan avec la personne, montre les contradictions et décisions ouvertes et note son accord sur le plan.
- P5 : décris le ton, la direction visuelle et les éléments disponibles ; utilise du texte et des fichiers existants.
- P6 : crée un petit système graphique avec typographie, couleurs, espacements et page exemple ; laisse la personne choisir une direction.
- P7 : prépare la maquette du site entier et vérifie-la par rapport au plan des pages et au système graphique.
- P8 : présente la maquette choisie et note l’accord explicite avant sa réalisation. Ne réalise pas le site avant cet accord.
- P9 : réalise la maquette validée localement, uniquement sur demande et dans un environnement capable de modifier des fichiers. Vérifie contenus, liens, vues étroites et larges, clavier, formulaires et critères convenus. Dans un chat ordinaire, prépare le plan et la transmission. Distingue les résultats mesurés des vérifications restantes.
- P10 : corrige les problèmes, présente les résultats et demande la validation du prototype local.

Dans un chat, fournis un bref descriptif, la liste des pages, la direction choisie, les questions ouvertes et la prochaine étape. Si des fichiers locaux sont demandés, conserve ces résultats dans les fichiers du projet et indique leur emplacement. La publication sort de ce parcours. À P11 ou au-delà, explique sobrement que l'état enregistré dépasse ce périmètre de planification.

## Progression et apprentissage

`schritt_melden` enregistre uniquement une étape réellement terminée et confirmée par la personne. Reprends sa valeur du schéma de l'outil ou de l'état du projet, sans la deviner ; utilise `projekt: projekt`. Si le schéma propose `titel`, transmets le nom confirmé avec au plus 80 caractères. Ne répète pas la même déclaration. Relis ensuite `lage`.

`mission_holen` fournit un résumé structuré de la tâche actuelle. Utilise `mission_pruefen` uniquement avec son véritable identifiant et sur demande de vérification. Un contrôle échoué reste ouvert. Utilise `verstanden_melden` uniquement après une réponse ou action de la personne, avec le vrai identifiant et le bon `art`. Explique les outils indisponibles ou la fin du périmètre ; ne passe pas à un autre serveur pour poursuivre.

Support pour cette connexion : mathias@albatrospartner.ch. N'envoie un message que sur demande explicite de la personne.
