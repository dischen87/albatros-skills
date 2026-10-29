---
name: recht-ch
description: "Met en ordre sur le plan juridique un petit site web suisse, expliqué à des personnes sans connaissances préalables avec l'image de la plaque de sonnette et du règlement de maison : mentions légales (impressum, art. 3, al. 1, let. s, LCD), déclaration de protection des données selon la LPD révisée (devoir d'informer, art. 19), cookies (art. 45c LTC), quand le RGPD de l'UE s'ajoute, droits sur les images, e-mails publicitaires seulement avec consentement. Pas de conseil juridique. Utilise ce skill pour « impressum », « mentions légales », « protection des données », « déclaration de protection des données », « LPD », « RGPD », « bannière cookies », « est-ce que j'en ai besoin légalement ? », « qu'est-ce qui doit figurer sur mon site ? », « formulaire de contact et protection des données »."
---

# Droit CH : la plaque de sonnette et le règlement de maison

## L'image

- **Mentions légales (impressum) = la plaque de sonnette :** qui habite ici, et comment joindre cette personne ?
- **Déclaration de protection des données = le règlement de maison pour les visiteurs :** que devient ce que les visiteurs te donnent ou laissent derrière eux (un nom dans le formulaire, des traces dans les statistiques) ?
- **Cookies = des petits billets que tu glisses dans la poche des visiteurs**, pour les reconnaître. Tu dois en informer.

**Comment utiliser l'image :** dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** s'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec des hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement, simple mais précis : cite la loi et l'article.
- Dis toujours : « Ce n'est pas un conseil juridique. En cas de doute, de données sensibles (santé, enfants) ou de gros chiffre d'affaires, ça vaut la peine de consulter un ou une spécialiste. »
- Ne copie jamais à l'aveugle un modèle trouvé sur Internet. Chaque phrase doit correspondre au site. Une déclaration qui cite des services qui n'existent pas, ou qui oublie les vrais, est fausse.

## Déroulement

### 1. État des lieux

Pose ces questions et note les réponses :

- Qui exploite le site (personne privée, association, entreprise individuelle, Sàrl) ? Vend-il quelque chose en ligne ?
- Quelles données arrivent ? Formulaire de contact, newsletter, commande, compte, statistiques (skill `statistik`), cartes ou vidéos intégrées, polices chargées depuis des serveurs tiers.
- Où tournent les services ? Serveur Albatros (Allemagne/Finlande, UE), PostHog (UE), envoi d'e-mails, prestataire de paiement (souvent aux États-Unis).
- Le site s'adresse-t-il aussi à des personnes dans l'UE (livraison, prix en euros, langue) ?

### 2. Mentions légales (`/impressum`)

Obligatoires pour toute personne qui propose en ligne des marchandises, des œuvres ou des prestations (art. 3, al. 1, let. s, LCD) : des indications claires et complètes sur l'identité et l'adresse de contact, y compris l'e-mail. Recommandées aussi sans obligation.

- Nom ou raison sociale (comme au registre du commerce), forme juridique
- Adresse postale (pas une case postale seule)
- Adresse e-mail
- si disponible : numéro IDE, inscription au registre du commerce, personne responsable

### 3. Déclaration de protection des données (`/datenschutz`)

La loi sur la protection des données révisée (LPD, en vigueur depuis le 1er septembre 2023) exige que tu informes quand tu collectes des données personnelles (art. 19 LPD). C'est déjà le cas avec un formulaire de contact ou des statistiques avec adresses IP. Contenu :

1. Qui est responsable, avec un contact
2. Quelles données, dans quel but (par but : contact, newsletter, commande, statistiques)
3. À qui elles vont (hébergement, statistiques, envoi d'e-mails, paiement), avec le pays. Pour les pays sans protection des données adéquate : quelles garanties s'appliquent
4. Combien de temps elles sont gardées
5. Droits des visiteurs : droit d'accès (art. 25 LPD), rectification, effacement, et comment les exercer
6. Date de la dernière modification

Si le site s'adresse aussi à des personnes dans l'UE, le RGPD peut s'appliquer en plus (art. 3, par. 2, RGPD). Dans ce cas, indique aussi la base légale pour chaque but.

### 4. Cookies et statistiques

- Suisse : qui place des cookies doit informer sur le traitement et son but, et dire comment les refuser (art. 45c LTC). Une mention dans la déclaration de protection des données suffit en général.
- Public dans l'UE : pour les cookies qui ne sont pas nécessaires (statistiques, publicité), il faut un consentement préalable. Il faut alors une bannière avec un bouton « Refuser » de même valeur.
- Le plus simple : pas de cookies inutiles. Les statistiques du skill `statistik` fonctionnent sans cookies. Intègre les polices en local au lieu de les charger depuis des serveurs tiers.

### 5. E-mails publicitaires

La publicité par e-mail seulement avec un consentement préalable (art. 3, al. 1, let. o, LCD). Exception : ta propre clientèle, informée lors de l'achat qu'elle peut refuser, pour tes propres offres similaires. Dans chaque e-mail : le bon expéditeur et un lien de désinscription simple et gratuit. Inscription à la newsletter avec un e-mail de confirmation (double opt-in), pour que le consentement soit prouvé.

### 6. Images et textes

Uniquement des images à toi ou sous licence. Des personnes reconnaissables seulement avec leur accord. Voir le skill `inhalte`.

### 7. Construire et relier les pages

Mentions légales et protection des données comme pages à part, accessibles depuis le pied de chaque page. Journal de bord et tapis roulant (skills `git-logbuch`, `pipeline`). Note dans `docs/plan.md` : « Vérifier la déclaration de protection des données quand un nouveau service s'ajoute. »

## Vérifier la mission

`mission_pruefen` avec `webseite-07-recht-ch`. La vérification regarde si `https://{name}.aufwind.sh/impressum` et `/datenschutz` répondent.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « la plaque de sonnette et le règlement de maison », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
