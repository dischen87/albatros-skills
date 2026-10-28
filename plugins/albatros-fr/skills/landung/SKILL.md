---
name: landung
description: "Planifie et accompagne le déménagement d'un projet d'Albatros vers un propre serveur, expliqué avec l'image du déménagement dans sa propre maison : liste de déménagement, louer et installer le serveur (SSH seulement avec clé, pare-feu, mises à jour, Caddy pour HTTPS), emporter le journal de bord sur GitHub, y régler le tapis roulant avec sa propre clé par SSH sur la nouvelle destination, emporter les données et les secrets, tester, changer l'adresse dans le DNS ou faire déménager un domaine acheté chez Albatros vers un nouveau registraire avec l'auth-code de domain_mitnehmen, reprendre soi-même les sauvegardes. Utilise ce skill pour « propre serveur », « déménager », « quitter Albatros », « Hetzner », « VPS », « héberger moi-même », « atterrissage », « de quoi j'ai besoin pour un propre serveur ? »."
---

# Atterrissage : déménager dans ta propre maison

## L'image

Chez Albatros, tu habites un appartement avec un concierge : il ferme la porte d'entrée, change les serrures et photographie l'appartement chaque nuit. Dans ta propre maison, tu fais tout ça toi-même.

Le déménagement n'est pas une construction neuve. Ton projet est déjà emballé dans des cartons qui vont partout : le journal de bord (Git), la notice de montage (`Dockerfile`, `compose.yaml`) et le tapis roulant (workflow). Tu ajoutes le reste, tu déménages et tu annonces ta nouvelle adresse. Seul le port appartient à la maison d'Albatros : ton journal de bord reçoit un nouveau port, par exemple GitHub.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec les hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement. Honnête sur l'effort : un propre serveur fait souvent économiser de l'argent, mais coûte du temps d'entretien.
- Louer et payer le serveur, la personne le fait elle-même chez le fournisseur.
- L'ancien chez-soi n'est éteint que quand le nouveau tourne, preuve à l'appui.

## Déroulement

### 1. Le déménagement vaut-il la peine ?

Passe-le brièvement en revue avec la personne (voir le skill `kosten`) : le projet a-t-il besoin de plus que ce qu'Albatros offre ? Veut-elle tout avoir en main ? A-t-elle une ou deux heures par mois pour l'entretien ? Sinon, rester est une bonne décision.

**Avec Light**, le déménagement est petit : le dossier `seite/` tourne chez n'importe quel fournisseur de pages statiques. Emporter le journal de bord sur GitHub (étape 4, points 1 et 2) et y activer la page, par exemple avec GitHub Pages. Le serveur, le tapis roulant et le déménagement du domaine tombent, la liste de déménagement reste.

### 2. Liste de déménagement

`docs/landung.md` dans le projet :

```markdown
# Déménagement sur un propre serveur

## Cartons
- [ ] Journal de bord : tout est poussé (`git status` propre)
- [ ] Journal de bord dans le nouveau port (par ex. GitHub), toutes les entrées y sont arrivées
- [ ] Secrets : liste des noms tirés de `.env.example` (jamais les valeurs ici !)
- [ ] Données : base de données, fichiers téléversés (dossier : …)
- [ ] Réglages : domaines, entrées e-mail dans le DNS (ne pas toucher), tâches cron
- [ ] Domaine acheté via Albatros ? Alors vers un nouveau registraire avec l'auth-code (`domain_mitnehmen`)

## Ce que je reprends moi-même
- [ ] Mises à jour (automatiques, seulement les mises à jour de sécurité)
- [ ] Sauvegardes (chaque nuit, hors de la maison, chiffrées, essai chaque mois)
- [ ] Surveillance (le site répond ? le disque est plein ?)

## Déroulement et date
…
```

### 3. La nouvelle maison

1. Louer un serveur, Ubuntu 24.04, au moins autant de mémoire de travail qu'avant. À la commande, déposer la clé **publique** de la maison de la personne.
2. L'installer avec un script qu'on peut lancer plusieurs fois sans danger (en root, d'abord le lire, puis le lancer) :
   - mises à jour, Docker depuis la source officielle
   - utilisateur `deploy` avec ta serrure, dossier `~/projekt`
   - SSH seulement avec clé : `PasswordAuthentication no` dans `/etc/ssh/sshd_config.d/10-haerten.conf`, contrôler avant avec `sshd -t`
   - pare-feu : d'abord `ufw allow 22/tcp`, `80/tcp`, `443`, seulement ensuite `ufw enable` (sinon tu t'enfermes dehors). Garder une session SSH ouverte comme corde de secours.
   - `fail2ban`, mises à jour de sécurité automatiques (`unattended-upgrades`)
   - des limites pour les logs, pour que le disque ne se remplisse pas
3. **Caddy** comme portier devant le site web : il va chercher lui-même le certificat pour HTTPS dès que l'adresse pointe vers le serveur. Il arrive comme service à part dans `compose.yaml`, et le site web lui-même ne se lie plus qu'à `127.0.0.1`. Une erreur dans le `Caddyfile` paralyse tout : avant chaque rechargement `caddy validate`, ensuite contrôler depuis l'extérieur.

### 4. Emporter le journal de bord et le tapis roulant

Chez Albatros, l'ouvrier du tapis roulant habite dans la maison. Dans ta propre maison, c'est un ouvrier de GitHub qui prend le relais : il ne construit pas lui-même, il sonne avec sa propre clé chez le nouveau serveur et le fait livrer.

1. **Nouveau port :** la personne crée elle-même un compte sur github.com. Ensuite installer `gh` (Mac : `brew install gh`) et `gh auth login`, la connexion se fait dans le navigateur web.
2. **Déménager le journal de bord :**
   ```bash
   git remote rename origin albatros
   gh repo create <projektname> --private --source . --remote origin --push
   ```
   L'ancien port reste joignable sous le nom `albatros` jusqu'à ce que tu déménages.
3. **Clé de lecture pour le nouveau serveur :** il va chercher lui-même le journal de bord, seulement en lecture. Sa clé de la maison reste sur le serveur, seule la serrure va chez GitHub :
   ```bash
   ssh deploy@<neue-adresse> 'ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C eigener-server'
   ssh deploy@<neue-adresse> 'cat ~/.ssh/id_ed25519.pub' > server-schloss.pub
   gh repo deploy-key add server-schloss.pub --title "eigener-server"   # lecture seule, c'est le réglage par défaut
   rm server-schloss.pub
   ssh deploy@<neue-adresse> 'ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts && git clone git@github.com:<benutzer>/<projektname>.git ~/projekt'
   ```
   Comparer l'empreinte de github.com avec celle de docs.github.com.
4. **Une clé à part pour le tapis roulant**, jamais la clé de la maison de la personne. Comme ça, on peut la bloquer seule :
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/fliessband -N "" -C fliessband
   ssh deploy@<neue-adresse> 'cat >> ~/.ssh/authorized_keys' < ~/.ssh/fliessband.pub
   gh secret set DEPLOY_KEY < ~/.ssh/fliessband
   gh secret set DEPLOY_KNOWN_HOSTS --body "$(ssh-keyscan -t ed25519 <neue-adresse> 2>/dev/null)"
   gh variable set SERVER --body "deploy@<neue-adresse>"
   gh variable set SEITE_URL --body "https://<domain>"
   ```
   La clé va directement du fichier dans le coffre-fort de GitHub (Secrets), jamais dans le chat et jamais dans le journal de bord. Ensuite, `~/.ssh/fliessband` peut être effacé de l'ordinateur.
5. **Adapter le workflow :** dans `.github/workflows/deploy.yml`, l'ouvrier et le chemin vers le serveur changent. Le reste ne bouge pas :
   ```yaml
   jobs:
     fliessband:
       runs-on: ubuntu-latest              # un ouvrier de GitHub au lieu de ton serveur
       permissions:
         contents: read                    # aussi peu de droits que possible
       concurrency:
         group: ausliefern
         cancel-in-progress: false         # ne jamais interrompre une livraison en cours
       env:
         ZIEL: ${{ vars.SERVER }}
         SEITE: ${{ vars.SEITE_URL }}
         SHA: ${{ github.sha }}
       steps:
         - name: Mettre en place la clé du tapis roulant
           env:
             DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
             DEPLOY_KNOWN_HOSTS: ${{ secrets.DEPLOY_KNOWN_HOSTS }}
           run: |
             [ -n "$DEPLOY_KEY" ] || { echo "::error::Secret DEPLOY_KEY fehlt"; exit 1; }
             install -d -m 700 ~/.ssh
             printf '%s\n' "$DEPLOY_KEY" > ~/.ssh/id_ed25519 && chmod 600 ~/.ssh/id_ed25519
             printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > ~/.ssh/known_hosts
         - name: Construire et livrer, au besoin revenir en arrière
           run: |
             ssh "$ZIEL" "SHA=$SHA bash -s" <<'EOF'
             # ici le bloc de la version Albatros, de « set -euo pipefail » jusqu'à « echo "läuft: $SHA" », sans la ligne avec willkommen
             EOF
         - name: Contrôle final depuis l'extérieur
           run: |
             # repris tel quel de la version Albatros
   ```
   Les secrets n'arrivent dans les commandes que par `env:`, jamais directement comme `${{ secrets.… }}` dans une ligne `run`. Ensuite `gh workflow run deploy.yml` et `gh run watch`. Ça doit passer au vert.

### 5. Emporter les données et les secrets

- `.env` directement de serveur à serveur ou en passant par ton propre ordinateur avec `scp`, jamais par Git.
- Base de données : la sauvegarder chez Albatros (par exemple `sqlite3 app.sqlite ".backup kopie.sqlite"` ou `pg_dump`), la restaurer sur le nouveau serveur.
- Fichiers téléversés avec `rsync -a`.

### 6. Changer l'adresse

D'abord tester par l'adresse du nouveau serveur, sans changer l'annuaire : `curl --resolve <domain>:443:<neue-ip> https://<domain>/`. Ensuite, tout dépend d'où l'adresse est louée.

**Achetée via Albatros** (`konto_status` la montre sous « Eigene Domains », propres domaines) : c'est Albatros qui tient l'annuaire pour elle. L'adresse déménage vers un registraire que la personne choisit :

1. La personne crée elle-même un compte chez le nouveau registraire.
2. Seulement avec son oui, appeler `domain_mitnehmen`. À partir de là, Albatros ne renouvelle plus l'adresse. Jusqu'au déménagement, elle continue de pointer vers le serveur Albatros.
3. L'outil donne l'**auth-code**, la clé pour le déménagement de l'adresse. Montre-le seulement à la personne, jamais dans un fichier ou dans le journal de bord. Elle le saisit chez le nouveau registraire et y lance le déménagement (transfert). Le plus souvent, elle paie à ce moment-là une année de renouvellement. Pour `.com` et `.net`, un déménagement n'est souvent pas encore possible dans les 60 premiers jours après l'achat.
4. Une fois le déménagement terminé, elle pose les entrées chez le nouveau registraire : A et AAAA vers le nouveau serveur, `www` et les entrées e-mail (MX), s'il y en avait.

**Louée ailleurs :**

1. La veille, baisser la durée de validité (TTL) des entrées à 300 secondes. Le changement va alors plus vite.
2. Entrée A et entrée AAAA vers le nouveau serveur. Chez Albatros, tu n'as rien à annuler pour ça.

Ensuite contrôler : `https://<domain>` répond, `www` redirige, le symbole du cadenas est là.

### 7. Seulement alors, quitter les lieux

Observer pendant une semaine. Si tout tourne, adapter ou résilier l'abonnement chez Albatros (cockpit). Un domaine que la personne a acheté via Albatros déménage avant (étape 6), sinon il expire avec son abonnement. Il n'y a plus de photos (snapshots) ensuite : à partir de maintenant, ce sont tes propres sauvegardes qui comptent.

### 8. Contrôler la mission

`docs/landung.md` dans le journal de bord et par le tapis roulant (skills `git-logbuch`, `pipeline`), puis `mission_pruefen` avec `flugschule-10-landung`. Le contrôle vérifie si la liste de déménagement `docs/landung.md` se trouve dans le projet (avec Pilot sur le serveur Albatros, avec Light dans le port). Le mieux, c'est que la personne écrive la liste tant qu'elle habite encore chez Albatros.

## Pièges

- Pas de certificat : l'adresse ne pointe pas encore vers le nouveau serveur, ou le port 80 est fermé.
- Les ports Docker contournent le pare-feu : les services internes seulement sur `127.0.0.1`.
- Sauvegardes installées, mais jamais restaurées : une sauvegarde ne compte que quand l'essai a marché.
- Redémarrer automatiquement après les mises à jour : seulement si tout redémarre ensuite tout seul.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « déménager dans ta propre maison », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
