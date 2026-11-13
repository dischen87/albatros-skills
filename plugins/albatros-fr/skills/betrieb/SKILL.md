---
name: betrieb
description: "Prépare avec une personne sans connaissances préalables l'exploitation de son site, avant que les invités arrivent (P12) : comment les visiteurs la contactent et qui le lit à quelle fréquence, qui est prévenu quand le site ne répond pas (une surveillance simple et gratuite), comment revenir à hier (photos du serveur avec Pilot, le journal de bord avec Light, une propre sauvegarde par soi-même), si une entrée avec connexion est nécessaire (seulement avec un propre serveur, skill bausteine) et si on compte qui vient (skill statistik, avec consentement là où il le faut). Le résultat est docs/betrieb.md. Avec Pilot, sur demande, l'espace de travail de Bert en ligne (jour et nuit, membres du projet seulement). Utilise ce skill après le domicile (lancieren) et pour « exploitation », « surveillance », « sauvegarde », « backup », « retours », « qui lit le formulaire », « et si le site tombe en panne ? », « espace de travail en ligne », « pilote automatique la nuit »."
metadata:
  stand: 0.3.3
  quelle: '6b2bb7374057'
---

# Exploitation : avant que les invités arrivent

## L'image

Avant que les premiers invités arrivent, la boîte aux lettres est posée, et quelqu'un la vide. Le détecteur de fumée sonne quand ça brûle, et on sait qui l'entend. Il y a un plan pour que la maison redevienne comme hier quand quelque chose se casse. S'il y a des pièces réservées aux habitants, un portier se tient à l'entrée. Et à la porte du magasin, il y a peut-être une liste à cocher. Pour le site, ça veut dire : retours, surveillance, sauvegarde, entrée et statistiques.

**Comment utiliser l'image :** une phrase sur l'image dans ta première réponse. Pour chaque point, une phrase avec sa partie de l'image.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- Les débuts de ligne dans `docs/betrieb.md` (`Rückmeldungen:`, `Überwachung:`, `Sicherung:`, `Eingang:`, `Statistik:`) restent en allemand, comme les marques `[Annahme: …]` et `[offen: …]` : `lage` les cherche tels quels. Ce qui suit les deux-points, tu l'écris en français. Seule exception : après `Eingang:` vient toujours d'abord `ja` ou `nicht nötig` en allemand (lancieren et bausteine les cherchent tels quels), puis la raison en français.
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

- **Pas de connexion sur le site** (le tableau « Accès » de `docs/prd.md` ne contient que « tous les visiteurs ») : `Eingang: nicht nötig (pas de connexion)`.
- **Avec connexion :** une entrée ne vient que si les critères du skill `bausteine`, partie « Ein Eingang für alles? » (une entrée pour tout ?), sont remplis, et seulement avec un propre serveur (Pilot, ou par toi-même avec serveur). Sinon, la connexion de la brique elle-même suffit. Dans tous les cas, les portes de `docs/tueren.txt` restent fermées sans connexion (`node scripts/pruefen.mjs --tueren`).

La ligne commence toujours par `ja` ou `nicht nötig`, puis vient la raison : `lancieren` et `bausteine` n'installent l'entrée qu'avec `Eingang: ja`.

Exemples : `Eingang: ja, /intern/ et les messages de PocketBase demandent la même connexion (critères du skill bausteine remplis)` ou `Eingang: nicht nötig, seulement la liste d'inscription avec sa propre connexion (critères du skill bausteine pas remplis)`

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

Quand chaque ligne a une réponse, tu fais l'entrée dans le journal de bord (`git add docs/betrieb.md && git commit -m "Exploitation : boîte aux lettres, détecteur de fumée, sauvegarde"`) et tu annonces `schritt_melden` avec `betrieb` et `sprache`. Si l'outil manque ou ne connaît pas l'étape, on continue sans île. En mode `lernen`, tu poses maintenant les questions de contrôle de la leçon `flugschule-17-betrieb`, au maximum deux par message (autres questions comprises) : d'abord « Pourquoi un message que personne ne lit est-il pire que pas de message du tout ? » et « Comment reviens-tu à hier ? », après la réponse de la personne « Qui doit remarquer en premier que ton site ne répond pas ? » Tu n'annonces `verstanden_melden` (type `kontrollfrage`) qu'après ses réponses.

Ensuite vient la mise en ligne : skill `lancieren`, partie 2.

## Espace de travail sur mon serveur (Arbeitsplatz online, facultatif, seulement avec Pilot)

L'espace de travail sur l'ordinateur dort quand l'ordinateur est fermé. Avec Pilot, un deuxième espace de travail peut habiter sur le serveur de la personne, comme un bureau qui reste ouvert la nuit : l'IA y travaille selon l'horaire et dès qu'un mail ou une vente arrive. Seuls les membres du projet entrent, connectés avec Albatros. Tu ne le proposes que si la personne le demande (« espace de travail sur mon serveur », « espace de travail en ligne ») ou si `docs/betrieb.md` est terminé ; ce n'est pas une étape de la feuille de route.

**Ce qui marche en ligne (état au 10.11.2026), tu le dis d'abord :**
- En ligne, seul Claude Code travaille, avec l'abonnement Claude de la propriétaire. L'IA y travaille dans une cage, comme un atelier avec une seule porte vers le projet : elle ne modifie des fichiers que dans le projet et enregistre des versions (`git commit`). Elle n'atteint ni l'espace de travail lui-même, ni les clés de la personne, ni rien en dehors du projet, et elle ne peut pas publier. Au niveau le plus haut du projet, elle ne crée rien de nouveau ; pour cela, il y a l'IA sur l'ordinateur.
- Si le serveur ne peut pas enfermer l'IA (système plus ancien), elle se contente d'y lire. L'espace de travail montre ce qui vaut dans les réglages, sous « Ton IA sur le serveur ».
- Seule la propriétaire peut démarrer l'IA : elle travaille avec son propre abonnement Claude, et selon les conditions d'Anthropic personne d'autre ne peut l'utiliser. Les membres voient tout ; qui a « lecture seule » ne fait que lire.
- Tu n'installes ni Codex ni Gemini CLI en ligne. Chez OpenAI, il n'est pas clair si un programme comme l'espace de travail peut démarrer Codex avec un abonnement ChatGPT sur un serveur ; la connexion avec Google n'existe plus pour Gemini CLI depuis le 18.06.2026. Si la personne pose la question, dis-lui exactement cela.

**L'abonnement Claude le permet-il ?** Demande d'abord : « Ton projet est-il commercial, vends-tu quelque chose ou fais-tu de la publicité pour une entreprise ? » Pourquoi : l'abonnement nécessaire en dépend.
- Anthropic décrit lui-même la voie sans navigateur : `claude setup-token` pour les scripts et les machines sans navigateur. Le compte appartient à une personne et ne se partage jamais.
- En Suisse et dans l'EEE, Pro et Max ne valent que pour un usage non commercial (conditions d'Anthropic pour les consommateurs, section 11). Un projet commercial demande Claude Team ou Enterprise ; `claude setup-token` y marche aussi. Si le projet est commercial et que la personne n'a que Pro ou Max, tu t'arrêtes ici, tu dis pourquoi, et elle continue avec l'espace de travail sur l'ordinateur.
- Relis les conditions avec elle avant qu'elle décide : https://code.claude.com/docs/en/legal-and-compliance et https://www.anthropic.com/legal/consumer-terms

**Mise en place : sept étapes, dont trois faites par la personne.** Elle tape le jeton elle-même ; tu ne le vois jamais, et il ne passe jamais par Albatros.

1. **S'annoncer chez Albatros (toi).** Appelle `arbeitsplatz_online` avec `an: true`. La réponse donne `ALBATROS_PROJEKT` et l'adresse `https://{name}.aufwind.sh/arbeitsplatz`. Si l'outil n'existe pas ou dit « seulement avec Pilot », tu t'arrêtes ici : l'espace de travail en ligne n'est pas encore activé chez Albatros, ou il manque le serveur.
2. **Choisir l'adresse (toi, avec la personne).** L'espace de travail doit avoir sa propre adresse, pas une chambre dans la maison du site : sous `{name}.aufwind.sh/arbeitsplatz`, un script du site pourrait piloter l'espace de travail pendant que la personne est connectée.
   - **Avec un domaine à elle** (skill `domain`) : annonce `arbeitsplatz.<domaine>` avec `domain_verbinden` et guide la personne à travers les entrées chez le fournisseur du domaine, exactement comme dans le skill `domain`. L'adresse de l'espace de travail est alors `https://arbeitsplatz.<domaine>`.
   - **Sans domaine à elle :** on reste sur `https://{name}.aufwind.sh/arbeitsplatz`. Dis à la personne la phrase ci-dessus et que l'espace de travail lui-même en avertit dans les réglages. Aucun script de tiers ne s'ajoute à ce site tant que l'espace de travail y habite.
3. **Vérifier le modèle et récupérer l'image (toi).** `grep -c arbeitsplatz compose.yaml nginx.conf` dans le projet : s'il manque le service `arbeitsplatz` dans `compose.yaml` ou la section dans `nginx.conf` (ancien modèle), reprends les deux du modèle, fais l'entrée dans le journal de bord et livre (skill `webseite-aendern`). Ensuite :
   ```bash
   ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz pull arbeitsplatz'
   ```
   Si Docker annonce que l'image n'existe pas (« manifest unknown », « denied », « not found »), elle n'est pas encore publiée. Tu la construis alors une fois sur le serveur à partir du plugin, depuis le dossier `arbeitsplatz` à côté des skills (`<dossier de ce skill>/../../arbeitsplatz`). S'il y manque le fichier `Dockerfile`, le plugin est trop ancien : mets-le à jour, sinon arrête-toi ici.
   ```bash
   scp -r "<dossier de ce skill>/../../arbeitsplatz" {name}@aufwind.sh:arbeitsplatz-bild
   ssh {name}@aufwind.sh 'docker build -t "$(grep -o "ghcr.io/dischen87/albatros-arbeitsplatz:[0-9.]*" ~/projekt/compose.yaml)" ~/arbeitsplatz-bild && rm -r ~/arbeitsplatz-bild'
   ```
4. **Créer les réglages (toi),** sans le jeton, en dehors du projet (ainsi le fichier n'arrive jamais dans le journal de bord, et l'IA dans l'espace de travail ne le lit pas) :
   ```bash
   ssh {name}@aufwind.sh 'umask 077 && printf "%s\n" "ARBEITSPLATZ_ADRESSE=<adresse de l'étape 2>" "ALBATROS_PROJEKT=<projet>" "ARBEITSPLATZ_KI=claude" > ~/arbeitsplatz.env'
   ```
   Avec un domaine à elle, une ligne s'ajoute pour que les nouveaux mails et les ventes continuent d'arriver : `ARBEITSPLATZ_EREIGNIS_ADRESSE=https://{name}.aufwind.sh/arbeitsplatz` (l'adresse de l'étape 1).
5. **Créer le jeton (la personne, sur son ordinateur).** Dans le terminal : `claude setup-token`. Elle confirme dans le navigateur, le terminal affiche le jeton (valable un an). Dis-lui : « Copie-le, mais ne l'envoie jamais dans le chat, même pas à moi. »
6. **Inscrire le jeton sur le serveur (la personne, dans son propre terminal, pas toi).** Elle copie cette seule ligne, colle le jeton à la question (on ne le voit pas en collant) et appuie sur Entrée :
   ```bash
   ssh -t {name}@aufwind.sh 'printf "Colle le jeton, puis Entree (il reste cache) : "; stty -echo; IFS= read -r t; stty echo; echo; touch ~/arbeitsplatz.env; chmod 600 ~/arbeitsplatz.env; sed -i "/^CLAUDE_CODE_OAUTH_TOKEN=/d" ~/arbeitsplatz.env; printf "CLAUDE_CODE_OAUTH_TOKEN=%s\n" "$t" >> ~/arbeitsplatz.env; echo Enregistre.'
   ```
   N'exécute jamais cette commande toi-même, et ne lis jamais `~/arbeitsplatz.env` avec `cat` ensuite : le jeton est un accès à son abonnement.
7. **Démarrer (toi), puis se connecter (la personne).** `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz up -d --wait'`. Au premier démarrage, l'espace de travail va chercher Claude Code chez Anthropic (une fois, quelques minutes). La personne ouvre l'adresse dans le navigateur et clique sur « Se connecter avec Albatros ». Dans les réglages, sous « Ton IA sur le serveur », on lit après une minute environ « Claude connecté » et « Peut modifier des fichiers » ; elle y choisit Claude Code et les heures du pilote automatique, et sous Tâches par exemple « Quand un mail arrive : proposer une réponse ».

**Vérifier :** la page se charge, la connexion marche, « Claude connecté » s'affiche, et un membre avec « lecture seule » voit tout mais ne peut rien démarrer. Si on lit « Claude non connecté », l'espace de travail montre de nouveau les étapes 5 à 7 ; après un nouveau jeton, tu le redémarres : `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz up -d --force-recreate arbeitsplatz'`.

**Éteindre :** `ssh {name}@aufwind.sh 'cd ~/projekt && docker compose --profile arbeitsplatz stop arbeitsplatz'` et `arbeitsplatz_online` avec `an: false`. Ensuite, la personne efface la ligne du jeton : `ssh {name}@aufwind.sh 'sed -i "/^CLAUDE_CODE_OAUTH_TOKEN=/d" ~/arbeitsplatz.env'`.

Dans `docs/betrieb.md` s'ajoute la ligne `Arbeitsplatz online: nein` ou `Arbeitsplatz online: ja, seit <date>, <adresse>, Claude Code avec l'abonnement de la propriétaire`.

## Pièges

- Un formulaire dont personne ne lit les messages.
- Mettre le gardien sur le même serveur que celui qu'il doit garder.
- « Albatros le remarquera bien » : Albatros voit la plateforme, pas chaque site.
- Une sauvegarde qui n'a jamais été restaurée : elle ne compte qu'après l'essai.
- Construire une entrée parce que ça fait professionnel : seulement si les critères sont remplis et avec un propre serveur.
- Des statistiques avec cookies sans consentement, là où il le faut.
- Écrire le jeton de l'IA dans le chat, dans le journal de bord ou dans un fichier du projet : il va seulement dans `~/arbeitsplatz.env` sur le serveur, tapé par la personne.
- Laisser l'espace de travail en ligne sous l'adresse du site alors qu'il existe un domaine à elle : avec `arbeitsplatz.<domaine>`, il a sa propre porte.
- Faire tourner l'espace de travail en ligne avec un abonnement qui n'est pas prévu pour ça (Pro ou Max pour une entreprise, le compte de quelqu'un d'autre).

## Vérifier la mission

`mission_pruefen` avec `flugschule-17-betrieb` : la vérification regarde sur l'île si le projet est à l'étape « Betrieb » (exploitation). Chez Albatros, `flugschule-07-sicherheit` fait aussi partie de cette phase, avec Pilot `flugschule-06-zurueck-auf-gestern` et, facultatif, `webseite-05-cms`.

## Message de fin

Ton dernier message dans cette étape commence par une phrase sur l'image « avant que les invités arrivent », qui redit l'essentiel. Ensuite : ce qui est clarifié (les cinq lignes de `docs/betrieb.md`), ce que la personne installe encore elle-même (par exemple le compte chez le service de contrôle), et que la mise en ligne vient ensuite.
