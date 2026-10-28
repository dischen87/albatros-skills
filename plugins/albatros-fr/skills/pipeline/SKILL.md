---
name: pipeline
description: "Explique le CI/CD à une personne sans connaissances préalables avec l'image du tapis roulant avec contrôle qualité, et le met en place : un workflow au port d'Albatros (Forgejo, code.aufwind.sh) démarre à chaque push sur main. L'ouvrier (runner) sur son propre serveur construit la page, la livre avec un contrôle de santé, la vérifie par l'adresse publique et revient sinon à la dernière bonne version. Utilise ce skill pour « pipeline », « CI/CD », « GitHub Actions », « Forgejo Actions », « workflow », « runner », « livrer automatiquement », « déployer », « comment ma modification arrive sur le serveur ? », « le tapis roulant est rouge », « le déploiement a échoué »."
---

# Pipeline : le tapis roulant avec contrôle qualité

## L'image

Dans une usine, personne ne porte chaque pièce une par une jusqu'au camion. Il y a un tapis roulant :

1. **Poste de contrôle :** la pièce est construite. Si ça ne marche pas, le tapis s'arrête et rien ne sort.
2. **Livraison :** la nouvelle pièce est montée et tout de suite testée : est-ce qu'elle tourne ? Sinon, l'ancienne pièce revient.
3. **Contrôle final :** depuis la rue, on regarde si la page répond.

Chez toi, le tapis démarre dès que tu envoies une entrée au port (skill `git-logbuch`). L'ouvrier du tapis habite chez toi : il tourne sur ton propre serveur et ne travaille que là. Le mot technique est **CI/CD**, le tapis s'appelle **workflow**, l'ouvrier **runner**.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** s'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon, avec les hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement. Parcours le fichier du workflow avec la personne, poste par poste, avant qu'il ne tourne.
- Le tapis roulant n'a besoin ni de clé ni de secret de la personne : l'ouvrier habite déjà sur son serveur. Sa clé de la maison n'a jamais sa place dans le tapis roulant.
- Si le tapis est rouge : corriger la cause, ne jamais désactiver le contrôle.

## Déroulement

### 1. Ce qui est déjà là

**Avec Light**, il n'y a pas de tapis roulant : après chaque push, Albatros publie directement le dossier `seite/` de `main`, sans construction et sans contrôle. Explique quand même l'image. Le tapis avec contrôle qualité fait partie de Pilot (`upgrade_link`, niveau `pilot`). Le fichier `deploy.yml` du modèle dort avec Light. Au passage à Pilot, Albatros met le tapis en marche et le fait tourner une fois tout de suite, pour que le propre serveur livre la page. La mission `flugschule-05-pipeline` fait partie de Pilot.

**Avec Pilot :** `konto_status` donne le nom du serveur, l'adresse du port (`git@aufwind.sh:{name}/projekt.git`) et indique si l'ouvrier est prêt. Ne le demande pas à la personne. Le modèle d'Albatros contient déjà `.github/workflows/deploy.yml`, `compose.yaml` et `Dockerfile` : lis-les avec la personne et compare avec l'essentiel ci-dessous. Dans le modèle, les commentaires et les messages sont en allemand ; ci-dessous, les commentaires sont traduits. Les noms des étapes et les messages restent tels quels, pour que le fichier corresponde au modèle ; traduis-les pour la personne. S'ils manquent, tu les crées, même si le dossier est encore vide, et tu dis ensuite ce qui manque encore (journal de bord au port, contenu de la page).

Le conteneur du serveur web s'appelle `webseite` et écoute dans le serveur sur le port 80. Albatros dirige `https://{name}.aufwind.sh` vers lui. Sur un serveur tout neuf, la page d'accueil (service `willkommen`) occupe le port 80. Le tapis roulant la désactive avant le premier démarrage. Si tu démarres une fois à la main, d'abord `sudo systemctl disable --now willkommen`.

`compose.yaml` (l'essentiel) :

```yaml
services:
  webseite:
    container_name: webseite
    build: .
    restart: unless-stopped
    ports:
      - "80:80"
    healthcheck:                         # « tourne » ne veut pas encore dire « fonctionne »
      test: ["CMD", "wget", "-qO-", "http://127.0.0.1/"]
      interval: 10s
      retries: 6
```

### 2. Le fichier du workflow

`.github/workflows/deploy.yml` (le port lit ce dossier comme GitHub) :

```yaml
name: Fliessband
on:
  push:
    branches: [main]
  workflow_dispatch:                    # bouton « Run workflow » pour un passage à la main

jobs:
  fliessband:
    runs-on: albatros                   # l'ouvrier sur ton propre serveur, il fait une commande après l'autre
    defaults:
      run:
        shell: bash
    env:
      SHA: ${{ github.sha }}
      SEITE: https://${{ github.repository_owner }}.aufwind.sh
    steps:
      - name: Bauen und ausliefern, notfalls zurück
        run: |
          set -euo pipefail
          cd ~/projekt                  # ici habite ta page, l'état vient toujours du journal de bord
          ALT=$(git rev-parse HEAD)
          git fetch -q origin main && git reset -q --hard "$SHA"
          # poste 1 : construire. Si ça ne marche pas, l'ancienne page reste en ligne.
          if ! docker compose build; then
            git reset -q --hard "$ALT"
            echo "Bau fehlgeschlagen, die alte Seite bleibt online" >&2
            exit 1
          fi
          # poste 2 : livrer, avec le contrôle de santé de compose.yaml
          sudo systemctl disable --now willkommen 2>/dev/null || true   # la page d'accueil libère le port 80
          if ! docker compose up -d --wait --wait-timeout 120; then
            echo "Neue Version ist nicht gesund, zurück auf $ALT" >&2
            docker compose logs --tail 30 >&2 || true
            git reset -q --hard "$ALT"
            docker compose up -d --build --wait --wait-timeout 120 || true
            exit 1
          fi
          echo "läuft: $SHA"
      - name: Endkontrolle über die öffentliche Adresse
        run: |
          for i in 1 2 3 4 5; do
            code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$SEITE" || true)
            [ "$code" = 200 ] && exit 0
            sleep 3
          done
          echo "$SEITE antwortet $code statt 200" >&2
          exit 1
```

Explique poste par poste. Sur le serveur, on ne modifie rien à la main : l'état vient toujours du journal de bord. Le fichier `.env` sur le serveur n'est pas touché (skill `sicherheit`). Si une étape a quand même besoin d'un secret, il va dans le coffre-fort du port (dans le repo sous Paramètres, Actions, Secrets) et, dans le workflow, n'entre dans la commande que par `env:`, jamais directement comme `${{ secrets.… }}` dans une ligne `run`.

### 3. Premier trajet

1. Entrée dans le journal de bord, push (skill `git-logbuch`).
2. Regarder dans le navigateur web : `https://code.aufwind.sh/{name}/projekt/actions`.
3. Vert : ouvrir la page dans le navigateur web, la modification est là.

### 4. Voir le contrôle au travail

La personne glisse exprès une erreur qui fait échouer la construction (p. ex. une faute de frappe dans le `Dockerfile`) et fait un push. Le tapis devient rouge, l'ancienne page reste en ligne. Annuler l'erreur, push, vert. Maintenant, elle sait que le tapis la protège.

### 5. Vérifier la mission

`mission_pruefen` avec `flugschule-05-pipeline`. La vérification regarde si le dernier passage de `deploy.yml` au port est vert, si le conteneur `webseite` tourne et si la page répond.

## Quand le tapis est rouge

- **Quel poste ?** Dans le navigateur web, sous « Actions », ouvrir le passage rouge. La personne copie les dernières lignes dans le chat. Sur le serveur, tu regardes toi-même : `ssh {name}@aufwind.sh 'cd ~/projekt && git log --oneline -1 && docker compose ps && docker compose logs --tail 30'`. Lire ensemble, nommer la cause en une phrase.
- **Le passage attend et ne démarre pas :** aucun ouvrier ne le prend. Le fichier contient-il exactement `runs-on: albatros` ? `konto_status` montre si l'ouvrier est prêt. Sinon `coach_fragen`.
- **`Permission denied` lors de `git fetch` :** le serveur n'a pas le droit de lire le port. C'est Albatros qui l'installe, donc `coach_fragen`.
- **Construction rouge :** erreur dans le `Dockerfile` ou dans la page. L'ancienne page reste en ligne.
- **Livraison rouge (« nicht gesund », pas en bonne santé) :** le conteneur démarre, mais ne répond pas. Les lignes de `docker compose logs` dans le passage disent pourquoi. L'ancienne version tourne à nouveau.
- **Contrôle final rouge, le reste vert :** la page tourne dans le serveur, mais pas par l'adresse. Vérifier le port du conteneur (`docker ps`), puis skill `zurueck-auf-gestern`.
- **Jamais** retirer le contrôle pour que le tapis devienne vert.

## Message final

Ton dernier message de cette étape commence par une phrase sur l'image « le tapis roulant avec contrôle qualité » qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
