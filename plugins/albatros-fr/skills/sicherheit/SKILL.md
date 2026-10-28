---
name: sicherheit
description: "Sécurise le projet d'une personne sans connaissances préalables, avec l'image de la maison avec son trousseau, son coffre-fort, ses fenêtres et ses serrures : jamais de secrets dans le journal de bord (Git), mais dans .env sur le serveur (et, si le tapis roulant en a besoin, dans le coffre-fort du port) ; régénérer tout de suite une clé publiée par erreur ; une clé par usage ; seulement les portes nécessaires ouvertes ; mises à jour. Utilise ce skill pour « sécurité », « mot de passe dans le code », « clé API », « .env », « secret », « j'ai mis une clé sur GitHub », « mon site est-il sûr ? », « je me suis fait pirater », « mises à jour », « pare-feu », et avant qu'un nouveau secret entre dans le projet."
---

# Sécurité : pas de clé sous le paillasson

## L'image

Une maison n'est pas plus sûre que son moment le plus négligent. Les cambrioleurs ne cherchent pas la serrure la plus solide, mais la clé sous le paillasson et la fenêtre de la cave restée ouverte.

- Les **secrets** (mots de passe, clés API, clés privées) sont des clés. Leur place est dans le **coffre-fort**, jamais sous le paillasson.
- Le **journal de bord** (Git) n'est pas un paillasson, c'est une vitrine : ce qui y est écrit une fois reste visible dans toutes les anciennes entrées.
- Les **portes et fenêtres** sont les accès ouverts au serveur. Seulement autant que nécessaire.
- Les **mises à jour** sont de nouvelles serrures, quand un truc pour ouvrir les anciennes est devenu connu.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec les hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement, calme mais clair. Si un secret est devenu public, la règle est : agir tout de suite, sans chercher de coupable.
- Tu ne lis jamais un secret à voix haute, tu ne l'affiches jamais et tu ne l'écris jamais dans le chat, dans des notes de commit ou dans des logs.
- Les clés publiques (par exemple `phc_…` pour la statistique ou `pk_…` chez Stripe) ne sont pas des secrets. Les secrètes se reconnaissent souvent à leur début : `sk_…`, `ghp_…`, `-----BEGIN … PRIVATE KEY-----`.

## Déroulement

**Avec Light**, tout ce qu'Albatros publie est public, même ce qui n'est lié nulle part : le dossier `seite/`. S'il manque, c'est `public/` ou même tout le dépôt avec `docs/`. C'est pourquoi la page reste dans `seite/`. Aucun secret n'a sa place là-dedans. Les étapes 1 et 2 s'appliquent quand même. Tout ce qui concerne le serveur, `.env` et les ports ne s'applique qu'avec Pilot.

### 1. Y a-t-il déjà quelque chose sous le paillasson ?

```bash
git ls-files | grep -E '(^|/)\.env(\..+)?$' | grep -v '\.env\.example$'
git log -p --all | grep -nE -- '-----BEGIN [A-Z ]*PRIVATE KEY-----|sk_live_|sk_test_|ghp_[A-Za-z0-9]{20,}|password *[=:]' | head
```

Si tu trouves quelque chose : **régénère-le tout de suite chez le fournisseur** (rotation) et rends l'ancien invalide. L'effacer du dépôt ne suffit pas, l'ancienne entrée reste dans le journal de bord et dans le port. Range seulement après.

### 2. Le coffre-fort

- **`.gitignore`** contient `.env`, `.env.*` et `!.env.example`. La personne vérifie avec toi.
- **`.env.example`** dans le dépôt montre quels secrets il faut, avec des valeurs vides.
- **Sur le serveur**, les vraies valeurs sont dans `~/projekt/.env`, lisibles seulement par toi :
  ```bash
  ssh {name}@aufwind.sh 'cd ~/projekt && umask 077 && touch .env && chmod 600 .env'
  ```
  C'est la personne qui saisit elle-même les valeurs (`nano ~/projekt/.env`), pour qu'elles n'atterrissent pas dans ton historique.
- **Pour le tapis roulant :** il tourne sur ton serveur, et ta page lit ses secrets dans le `.env`. Si une étape du workflow a quand même besoin d'un secret, il va dans le coffre-fort du port (dans le dépôt sous Paramètres, Actions, Secrets) et, dans le workflow, il n'arrive dans la commande que par `env:` (skill `pipeline`).
- **Dans le Dockerfile :** un `.dockerignore` avec `.env`, `.git`, `node_modules`. Sinon le `.env` est emballé avec le reste au moment de la construction.

### 3. Une clé par usage

La clé de la maison de la personne (pour le serveur et le port), la clé de lecture du serveur pour le port, plus tard sur le propre serveur la clé du tapis roulant : chacune séparément. Si l'une se perd, on ne change que cette serrure-là (dans le cockpit ou avec `schluessel_hinterlegen`).

### 4. Portes et fenêtres

Sur Albatros, la plateforme s'occupe de la porte d'entrée (pare-feu, protection contre les mots de passe devinés à la chaîne). Toi, tu fais attention aux portes que tu ouvres toi-même :

- Dans `compose.yaml`, seul le site web sur le port 80 est ouvert vers l'extérieur. Tout le reste (base de données, CMS, administration) seulement lié à `127.0.0.1`, par exemple `"127.0.0.1:5432:5432"`, ou pas publié du tout. Sinon Docker ouvre les ports en passant à côté de tout pare-feu.
- Les zones d'administration seulement par un tunnel (skill `cms`).
- Vérifier que rien d'interne n'est servi :
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.env
  curl -s -o /dev/null -w '%{http_code}\n' https://{name}.aufwind.sh/.git/config
  ```
  Les deux doivent donner `404` (ou `403`).

### 5. De nouvelles serrures

- Sur le serveur : `apt list --upgradable` montre les mises à jour en attente. Avant de grosses mises à jour, une photo (skill `zurueck-auf-gestern`), puis `sudo apt update && sudo apt upgrade`.
- Dans le projet : `npm audit` (s'il y a un `package.json`) montre les failles connues dans les briques utilisées.

### 6. Peu de droits

- Les workflows ne reçoivent que les secrets dont ils ont besoin. Sur GitHub (après le déménagement, skill `landung`), en plus `permissions: contents: read`.
- Ne pas faire tourner les programmes du conteneur en root, si le modèle le permet (`USER` dans le Dockerfile).
- Chaque personne qui collabore reçoit son propre accès, pas un accès partagé.

### 7. Contrôler la mission

Journal de bord et tapis roulant (skills `git-logbuch`, `pipeline`), puis `mission_pruefen` avec `flugschule-07-sicherheit`. Le contrôle vérifie si `.gitignore` contient `.env` dans le projet (avec Pilot dans `~/projekt` sur le serveur, avec Light dans le port).

## Si quelque chose est arrivé

1. Régénérer le secret chez le fournisseur, bloquer l'ancien.
2. Vérifier s'il a été utilisé à mauvais escient (factures, connexions, listes d'envoi chez le fournisseur).
3. Remettre le serveur sur une photo d'avant l'incident, s'il a été modifié (skill `zurueck-auf-gestern`).
4. S'il s'agit de données d'autres personnes : informer Albatros via `coach_fragen`. En cas de risque élevé pour les personnes concernées, la loi sur la protection des données exige une annonce au PFPDT (art. 24 LPD). Pas de conseil juridique.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « pas de clé sous le paillasson », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
