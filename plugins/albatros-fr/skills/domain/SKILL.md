---
name: domain
description: "Trouve, achète ou relie un propre domaine (par exemple monmagasin.ch) pour le serveur Albatros. Explique le domaine et le DNS avec l'image de l'adresse et de l'annuaire, propose des noms, cherche avec domain_suchen ce qui est libre et achète via Albatros avec domain_kaufen (la personne est titulaire, elle ne donne ses coordonnées que sur la page de paiement). Un domaine que la personne a déjà, le skill le relie avec domain_verbinden : entrées DNS, preuve TXT _albatros et contrôle, jusqu'à ce que le site s'affiche avec le cadenas dans le navigateur web. Utilise ce skill pour « propre domaine », « mon adresse », « acheter un .ch », « quel domaine est libre ? », « chercher un domaine », « DNS », « entrée A », « CNAME », « entrée TXT », « mon domaine ne pointe pas sur mon site », « certificat », « https ne marche pas »."
---

# Domaine : ton adresse dans l'annuaire

## L'image

- **Domaine** (`monmagasin.ch`) : ton adresse, que les gens peuvent retenir.
- **Serveur** : la maison, joignable sous un numéro que personne ne peut retenir.
- **DNS** : l'annuaire d'Internet. Il dit : « monmagasin.ch habite dans la maison avec ce numéro. »
- **Registraire** : l'office où tu loues l'adresse pour un an. Albatros peut s'en charger pour toi. C'est quand même toi qui es inscrite ou inscrit comme titulaire.

Ton site est déjà joignable sous `{name}.aufwind.sh`. Avec un propre domaine, il reçoit une adresse qui t'appartient. Si tu déménages plus tard (skill `landung`), tu emportes l'adresse.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec les hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement, phrases courtes, pas de jargon. « Entrée dans l'annuaire » au lieu de « DNS record », jusqu'à ce que la personne voie les mots dans l'interface de son registraire. Ensuite tu donnes les deux.
- Le nom, l'adresse, le téléphone et les données de paiement, la personne ne les saisit que sur la page de paiement, jamais dans le chat.

## Déroulement

### 1. L'abonnement convient-il ?

Les propres domaines n'existent qu'avec Pilot, pas avec Gratuit ni avec Light. Vérifie avec `konto_status`. S'il manque Pilot, explique la différence et va chercher le lien avec `upgrade_link` (niveau `pilot`). N'impose rien. Chercher est possible avec chaque abonnement.

### 2. La personne a-t-elle déjà une adresse ?

- **Non :** continue avec l'étape 3, elle en trouve une et l'achète via Albatros.
- **Oui, achetée ailleurs :** continue avec l'étape 4.
- **Oui, achetée via Albatros :** `konto_status` la montre sous « Eigene Domains » (propres domaines) avec son état. Si elle est active, continue avec l'étape 7.

### 3. Trouver et acheter une adresse

1. **Proposer toi-même des noms :** trois à cinq idées qui vont avec le projet, avant de chercher. Courts, faciles à épeler, sans trait d'union si on peut l'éviter. Une localité dans le nom aide quand le mot seul est déjà pris. `.ch` pour un public en Suisse. Pas de marques d'autres dans le nom, ça crée des ennuis.
2. **Chercher :** `domain_suchen` avec jusqu'à cinq souhaits, sous forme de mots ou de domaines entiers (`veloladen-thun`, `annas-laden.ch`). Albatros complète avec les terminaisons `.ch`, `.com`, `.net`, `.shop` et `.li` ainsi que des variantes, et ne donne que ce qui est vraiment libre, avec le prix par an. Transmets les résultats et les prix exactement comme ils sont. Si une adresse est libre et ce qu'elle coûte, tu ne le devines jamais. Si rien n'est libre : d'autres mots, une localité en plus ou une forme plus courte, puis chercher encore.
3. **Dire comment se passe l'achat,** directement avec les résultats :
   - La personne est dès le début elle-même titulaire, pas Albatros. Ses droits de titulaire sont décrits à l'ICANN, l'organisme qui fixe les règles pour les domaines. Écris toujours le lien en entier (page en anglais) : https://www.icann.org/resources/pages/benefits-2013-09-16-en
   - Le nom, l'adresse et le téléphone, elle les saisit elle-même sur la page de paiement, jamais dans le chat. Les données doivent être justes, car l'adresse appartient à celui qui est inscrit.
   - Le prix vaut pour un an et aussi pour le renouvellement. Albatros renouvelle chaque année, tant que l'abonnement du domaine court.
4. **Acheter :** Quand la personne s'est décidée pour une adresse, tu appelles `domain_kaufen` avec exactement celle-ci et tu transmets le lien. Le paiement et les coordonnées, elle s'en occupe elle-même sur la page de paiement.
5. **Ensuite :** Il n'y a rien à saisir chez le registraire. Albatros enregistre l'adresse, pose les entrées dans l'annuaire et va chercher le certificat, le plus souvent en 5 à 30 minutes. `konto_status` montre l'état. Continue avec l'étape 7.

### 4. Annoncer une adresse existante

Appelle `domain_verbinden` avec le domaine. L'outil répond avec exactement les entrées qui doivent aller dans l'annuaire :

- une **entrée TXT** `_albatros.<domain>` avec un code. C'est la preuve que l'adresse t'appartient, comme une lettre que seul le locataire trouve dans la boîte aux lettres.
- une entrée qui pointe vers le serveur : pour `www.<domain>`, le plus souvent un **CNAME** vers `{name}.aufwind.sh` (« habite chez »), pour l'adresse sans `www` une entrée **A** et une entrée **AAAA** avec les numéros de la réponse.

Prends toujours les valeurs de la réponse de `domain_verbinden`, jamais des valeurs de mémoire. Montre-les sous forme de tableau avec les colonnes Type, Nom, Valeur et **Signification**, pour qu'aucune abréviation ne reste sans explication : TXT = billet avec la preuve, CNAME = « habite chez », A = numéro de la maison, AAAA = nouveau numéro de maison, plus long.

### 5. Poser les entrées chez le registraire

La personne ouvre chez le registraire la gestion DNS (souvent « DNS », « Zone » ou « entrées de serveur de noms »). Guide-la champ par champ : Type, Nom, Valeur. Piège typique : certains registraires ajoutent eux-mêmes le domaine. Le champ « Nom » s'appelle alors seulement `_albatros` au lieu de `_albatros.monmagasin.ch`.

### 6. Attendre et contrôler

L'annuaire n'est pas réimprimé partout tout de suite. Ça prend des minutes, rarement des heures. Contrôle avec :

```bash
dig +short TXT _albatros.monmagasin.ch
dig +short monmagasin.ch
dig +short www.monmagasin.ch
```

Si les réponses correspondent aux valeurs de l'étape 4, appelle encore une fois `domain_verbinden`. Albatros contrôle la preuve et va ensuite chercher automatiquement le certificat (le symbole du cadenas dans le navigateur web). Sans contrôle, pas de certificat.

### 7. Contrôler la mission

Ouvre `https://<domain>` avec la personne. Ensuite `mission_pruefen` avec `flugschule-09-domain`.

## Quand ça coince

- **Acheté, mais toujours pas actif après une heure :** `konto_status` montre l'état et une remarque. S'il est écrit que quelque chose n'a pas marché, l'équipe se manifeste. Sinon `coach_fragen`.
- **`dig` ne montre rien :** faute de frappe dans le nom ou pas encore réimprimé. Attendre dix minutes, puis réessayer.
- **D'anciennes entrées dérangent :** beaucoup de registraires créent une page de parking. Ces entrées A, la personne doit les effacer, sinon l'adresse pointe vers deux maisons.
- **E-mail sur le domaine :** ne jamais toucher ni effacer les entrées MX pour l'e-mail. C'est un autre chapitre de l'annuaire.
- **Le navigateur web avertit « Non sécurisé » :** le certificat manque encore. Le plus souvent, la preuve TXT n'est pas encore visible. Retour à l'étape 6.

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « ton adresse dans l'annuaire », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
