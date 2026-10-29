---
name: kosten
description: "Tient avec la personne un cahier de comptes honnête pour son projet : abonnement Albatros, domaine, abonnement IA, e-mail, services en plus, plus tard un propre serveur. Explique quels coûts sont fixes et lesquels varient, comment éviter les mauvaises surprises et quand un déménagement vaut la peine. Utilise ce skill pour « ça coûte combien ? », « coûts », « prix », « trop cher », « budget », « facture », « est-ce que ça vaut la peine ? », « combien coûte un serveur ? », et avant que la personne ajoute un nouveau service payant."
---

# Coûts : le cahier de comptes

## L'image

Comme le cahier de comptes d'un appartement : il y a le **loyer** (coûts fixes chaque mois), les **charges** (selon ce que tu consommes) et les **achats uniques**. Qui note tout n'a pas de surprise sur la facture.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec les hypothèses marquées (`[Hypothèse : …]`). Ne demande ce qui manque qu'à la fin.
- Tutoiement, honnête, sans pression de vente. Ne présente jamais des prix de mémoire comme des faits. Les prix actuels d'Albatros viennent de `konto_status` ou de albatros.build/preise. Pour les autres fournisseurs, tu dis « environ » et tu envoies la personne sur leur page de prix.

## Déroulement

### 1. Qu'est-ce qui tourne déjà ?

Demande et note :

| Poste | Type | Ordre de grandeur | D'où vient le prix exact |
|---|---|---|---|
| Abonnement Albatros | loyer | selon le niveau | `konto_status` |
| Propre domaine (`.ch`) | loyer par an | à peu près un billet de cinéma par an | `domain_suchen` ou page de prix du registraire |
| IA dans le terminal (Claude Code, Codex, Gemini CLI) | loyer | à partir d'environ 20 USD par mois : Claude Pro, ChatGPT Plus ou, pour Gemini CLI, Google AI Pro ; un compte gratuit ne suffit pas, ou seulement pour quelques essais | page des prix du fournisseur ; on paie là-bas, pas chez Albatros |
| E-mail avec son propre domaine | loyer | petit | fournisseur |
| Statistique (par exemple PostHog) | charges | le plus souvent gratuit jusqu'à une limite | page de prix |
| Envoi d'e-mails (newsletter) | charges | gratuit jusqu'à une limite, ensuite par e-mail | page de prix |
| Publicité payante | charges | c'est toi qui décides | compte publicitaire |

### 2. Trouver les pièges

- **Charges sans plafond :** pour tout ce qui coûte à l'usage (interfaces d'IA, envoi d'e-mails, publicité), fixer une limite par mois. La plupart des fournisseurs ont un réglage pour ça. C'est la personne qui la fixe elle-même.
- **Périodes gratuites :** noter la date à laquelle elles se terminent.
- **Abonnements annuels :** noter le délai de résiliation.
- **Payé deux fois :** deux services qui font la même chose.

### 3. Le cahier de comptes dans le projet

Écris le tableau avec la personne dans `docs/kosten.md` dans son projet, avec le total par mois, le total par an et une ligne « Prochain contrôle : <date dans trois mois> ». Ensuite dans le journal de bord (skill `git-logbuch`) et par le tapis roulant sur le serveur.

### 4. Quand est-ce que plus de puissance ou un déménagement vaut la peine ?

- **De Light à Pilot :** dès qu'un programme doit tourner sur le site (base de données, connexion, propre CMS) ou qu'un propre domaine s'ajoute.
- **Plus de puissance chez Albatros :** quand le site devient lent et que `free -h` montre en permanence peu de plan de travail libre.
- **Déménager sur un propre serveur** (skill `landung`) : quand le projet rapporte de l'argent, a besoin durablement de plus de puissance que le plus grand niveau n'en offre, ou que la personne veut tout avoir en main. Un propre serveur est souvent moins cher en loyer, mais plus cher en temps : les mises à jour, les sauvegardes et la surveillance, plus personne ne les fait pour toi.

### 5. Contrôler la mission

`mission_pruefen` avec `flugschule-08-kosten`. Le contrôle vérifie si `docs/kosten.md` se trouve dans le projet (avec Pilot dans `~/projekt` sur le serveur, avec Light dans le port).

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « le cahier de comptes », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
