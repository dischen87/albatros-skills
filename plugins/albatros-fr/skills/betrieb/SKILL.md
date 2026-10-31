---
name: betrieb
description: "Prépare avec une personne sans connaissances préalables l'exploitation de son site, avant que les invités arrivent (P12) : comment les visiteurs la contactent et qui le lit à quelle fréquence, qui est prévenu quand le site ne répond pas (une surveillance simple et gratuite), comment revenir à hier (photos du serveur avec Pilot, le journal de bord avec Light, une propre sauvegarde par soi-même), si une entrée avec connexion est nécessaire (seulement avec un propre serveur, skill bausteine) et si on compte qui vient (skill statistik, avec consentement là où il le faut). Le résultat est docs/betrieb.md. Utilise ce skill après le domicile (lancieren) et pour « exploitation », « surveillance », « sauvegarde », « backup », « retours », « qui lit le formulaire », « et si le site tombe en panne ? »."
metadata:
  stand: 0.2.0
  quelle: 'df2a1ecf1f79'
---

# Exploitation : avant que les invités arrivent

## L'image

Avant que les premiers invités arrivent, la boîte aux lettres est posée, et quelqu'un la vide. Le détecteur de fumée sonne quand ça brûle, et on sait qui l'entend. Il y a un plan pour que la maison redevienne comme hier quand quelque chose se casse. S'il y a des pièces réservées aux habitants, un portier se tient à l'entrée. Et à la porte du magasin, il y a peut-être une liste à cocher. Pour le site, ça veut dire : retours, surveillance, sauvegarde, entrée et statistiques.

**Comment utiliser l'image :** une phrase sur l'image dans ta première réponse. Pour chaque point, une phrase avec sa partie de l'image.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Les débuts de ligne dans `docs/betrieb.md` (`Rückmeldungen:`, `Überwachung:`, `Sicherung:`, `Eingang:`, `Statistik:`) restent en allemand : `lage` les cherche tels quels. Ce qui suit les deux-points, tu l'écris en français.
- Tutoiement, calme, concret. Chaque réponse devient une ligne dans `docs/betrieb.md`.
- Les retours, l'entrée et les statistiques, la personne les décide elle-même, aussi en mode `machen`. La surveillance, tu la proposes et tu l'inscris comme `[Annahme: …]` (hypothèse). La sauvegarde, tu la clarifies toi-même et tu la montres. Au maximum deux questions par message.
- Les prix et les conditions de services externes, tu ne les donnes que depuis leur page de prix. Les comptes chez des services externes, la personne les crée elle-même.
- Ce qui s'applique dépend du domicile (`docs/lancieren.md`, ligne `Wohnort:`) : Albatros Light, Albatros Pilot ou par toi-même.
- Rien de tout ça ne met le site en ligne. Ça vient ensuite, à la mise en ligne (skill `lancieren`, partie 2).

## Déroulement

### 1. Où habite le site ?

Lis `docs/lancieren.md`. Si le fichier ou la ligne `Wohnort:` manque, le domicile vient d'abord (skill `lancieren`, partie 1).

### 2. Retours : la boîte aux lettres

Demande : « Comment les visiteurs te contactent-ils, et qui lit leurs messages, à quelle fréquence ? » Pourquoi : un message que personne ne lit est pire que pas de message du tout.

- Le chemin figure en général déjà dans le PRD (`docs/prd.md`) : un lien pour écrire un e-mail, un formulaire, un numéro de téléphone ou une brique comme la liste d'inscription. Clarifie à quelle adresse ça arrive, qui lit là-bas, à quelle fréquence, et qui le fait pendant les vacances.
- Après la mise en ligne, la personne envoie elle-même un message de test par le site en ligne et regarde s'il arrive (skill `lancieren`, partie 2).

Exemple : `Rückmeldungen: formulaire sur /kontakt vers anna@example.ch, Anna lit le lundi et le jeudi, pendant les vacances Beat`

### 3. Surveillance : le détecteur de fumée

Demande : « Qui est prévenu quand le site ne répond pas ? » Pourquoi : mieux vaut que ce soit toi qui le remarques, plutôt que ta clientèle.

- **Ce que fait Albatros :** Albatros surveille sa propre plateforme et y répare les pannes. Un message à la personne quand son site ne répond pas, Albatros n'en envoie pas. Par toi-même, il n'y a que ce que le fournisseur propose.
- **La solution simple, gratuite :** un service de contrôle sur Internet qui appelle l'adresse de `docs/lancieren.md` toutes les quelques minutes et envoie un e-mail quand elle ne répond pas, par exemple UptimeRobot ou Better Stack (conditions sur la page de prix). La personne crée le compte elle-même ; tu lui dis quoi saisir où : l'adresse, et comme destinataire la personne qui lit aussi les retours. Elle peut l'installer maintenant (l'adresse répond déjà avec le modèle) ou juste après la mise en ligne.
- **Avec un propre serveur,** un gardien comme Uptime Kuma est aussi possible, mais jamais sur le même serveur : s'il tombe, le gardien se tait aussi.
- Si la personne ne veut pas de surveillance, c'est écrit ainsi dans la ligne, avec sa raison.

Exemple : `Überwachung: [Annahme: UptimeRobot (gratuit) contrôle https://anna.aufwind.sh toutes les 5 minutes, e-mail à anna@example.ch]`. Après son oui, tu enlèves `[Annahme: …]`.

### 4. Sauvegarde : retour à hier

Tu le clarifies toi-même et tu le montres à la personne : « Comment reviens-tu à hier ? »

- **Albatros Light :** le journal de bord est la sauvegarde. Chaque état est au port et sur l'ordinateur. On revient en arrière avec `git revert` et un push (skill `zurueck-auf-gestern`, paragraphe sur Light). Il n'y a pas de photos d'un serveur, parce qu'il n'y a pas de serveur.
- **Albatros Pilot :** chaque nuit, une photo de tout le serveur (sept jours), plus une propre photo avant chaque grande transformation (outil `snapshot`). On revient en arrière avec `zurueck` (skill `zurueck-auf-gestern`). Le journal de bord au port reste la copie hors de l'appartement.
- **Par toi-même, sans serveur :** le journal de bord sur l'ordinateur a besoin d'une deuxième copie hors de l'ordinateur, par exemple un dépôt privé chez GitHub. Les fournisseurs pour sites statiques gardent en général les livraisons précédentes, qu'on peut réactiver : montre à la personne où ça se fait dans l'interface de son fournisseur.
- **Par toi-même, avec serveur :** une propre sauvegarde, la nuit, hors de la maison, chiffrée, avec un essai chaque mois (skill `landung`, liste de déménagement « Was ich selbst übernehme », ce que je reprends moi-même). Une sauvegarde ne compte que quand la restauration a fonctionné une fois.

**Moment d'apprentissage « retour à hier » :** en mode `lernen`, la personne l'essaie une fois elle-même. Avec Light ou par toi-même : inscrire un petit changement et l'annuler avec `git revert HEAD`. Avec Pilot : l'exercice du skill `zurueck-auf-gestern` (mission `flugschule-06-zurueck-auf-gestern`), sur le modèle qui est en ligne en ce moment. Ensuite `verstanden_melden` (mission `flugschule-17-betrieb`, type `selbst`). En mode `machen`, tu le proposes.

Exemple : `Sicherung: journal de bord au port et sur cet ordinateur, retour avec git revert (essayé le 31.10.2026)`

### 5. Entrée : le portier

Demande : « Y a-t-il plusieurs parties qui doivent savoir qui est connecté ? » Pourquoi : alors une entrée vérifie à un seul endroit qui a le droit de faire quoi.

- **Pas de connexion sur le site** (le tableau « Accès » de `docs/prd.md` ne contient que « tous les visiteurs ») : `Eingang: pas nécessaire (pas de connexion)`.
- **Avec connexion :** une entrée ne vient que si les critères du skill `bausteine`, partie « Ein Eingang für alles? » (une entrée pour tout ?), sont remplis, et seulement avec un propre serveur (Pilot, ou par toi-même avec serveur). Sinon, la connexion de la brique elle-même suffit. Dans tous les cas, les portes de `docs/tueren.txt` restent fermées sans connexion (`node scripts/pruefen.mjs --tueren`).

Exemple : `Eingang: pas nécessaire, seulement la liste d'inscription avec sa propre connexion (critères du skill bausteine pas remplis)`

### 6. Statistiques : la liste à cocher

Demande : « Veux-tu compter qui vient ? » Pourquoi : sans chiffres, la mesure du succès de `docs/projekt.md` (ligne `Erfolg:`) reste une supposition.

- Comment faire figure dans le skill `statistik` : d'abord un petit plan de ce qu'on compte, puis l'intégration sans cookies. Ainsi, en Suisse, il ne faut pas de bannière. Si le site compte avec des cookies ou s'adresse à des personnes dans l'UE, il faut d'abord le consentement des visiteurs (skill `recht-ch`, « Cookies und Statistik »), et la déclaration de protection des données mentionne les statistiques.
- On les intègre à la mise en ligne ou juste après (mission `webseite-08-statistik`, facultative).

Exemple : `Statistik: oui, sans cookies, objectif « demande envoyée », intégration après la mise en ligne (skill statistik)` ou `Statistik: non, les demandes dans la boîte e-mail suffisent`

### 7. `docs/betrieb.md`

```markdown
# Exploitation

Rückmeldungen: …
Überwachung: …
Sicherung: …
Eingang: …
Statistik: …
Stand: <date>
```

Quand chaque ligne a une réponse, tu fais l'entrée dans le journal de bord (`git add docs/betrieb.md && git commit -m "Exploitation : boîte aux lettres, détecteur de fumée, sauvegarde"`) et tu annonces `schritt_melden` avec `betrieb` et `sprache`. Si l'outil manque ou ne connaît pas l'étape, on continue sans île. En mode `lernen`, tu poses les questions de contrôle de la mission `flugschule-17-betrieb` (`mission_holen`) et tu n'annonces `verstanden_melden` (type `kontrollfrage`) qu'après la réponse de la personne.

Ensuite vient la mise en ligne : skill `lancieren`, partie 2.

## Pièges

- Un formulaire dont personne ne lit les messages.
- Mettre le gardien sur le même serveur que celui qu'il doit garder.
- « Albatros le remarquera bien » : Albatros voit la plateforme, pas chaque site.
- Une sauvegarde qui n'a jamais été restaurée : elle ne compte qu'après l'essai.
- Construire une entrée parce que ça fait professionnel : seulement si les critères sont remplis et avec un propre serveur.
- Des statistiques avec cookies sans consentement, là où il le faut.

## Vérifier la mission

`mission_pruefen` avec `flugschule-17-betrieb` : la vérification regarde sur l'île si le projet est à l'étape « Betrieb » (exploitation). Chez Albatros, `flugschule-07-sicherheit` fait aussi partie de cette phase, avec Pilot `flugschule-06-zurueck-auf-gestern` et, facultatif, `webseite-05-cms`.

## Message de fin

Ton dernier message dans cette étape commence par une phrase sur l'image « avant que les invités arrivent », qui redit l'essentiel. Ensuite : ce qui est clarifié (les cinq lignes de `docs/betrieb.md`), ce que la personne installe encore elle-même (par exemple le compte chez le service de contrôle), et que la mise en ligne vient ensuite.
