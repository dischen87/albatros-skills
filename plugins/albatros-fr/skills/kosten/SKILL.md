---
name: kosten
description: "Tient avec la personne un cahier de comptes honnête pour son projet : abonnement Albatros (seulement dès le domicile, jusqu'au site sur son propre ordinateur Albatros est gratuit), domaine, abonnement IA, e-mail, services en plus, un fournisseur ou un propre serveur par soi-même. Prix d'Albatros seulement depuis konto_status. Explique quels coûts sont fixes et lesquels varient, comment éviter les mauvaises surprises et quand un déménagement vaut la peine. Utilise ce skill pour « ça coûte combien ? », « coûts », « prix », « trop cher », « budget », « facture », « est-ce que ça vaut la peine ? », « combien coûte un serveur ? », et avant que la personne ajoute un nouveau service payant."
metadata:
  stand: 0.3.2
  quelle: 'da041e2a8b74'
---

# Coûts : le cahier de comptes

## L'image

Comme le cahier de comptes d'un appartement : il y a le **loyer** (coûts fixes chaque mois), les **charges** (selon ce que tu consommes) et les **achats uniques**. Qui note tout n'a pas de surprise sur la facture.

**Comment utiliser l'image :** Dis-la à la personne dans ta première réponse, avant de poser des questions ou de montrer des commandes, même si elle veut tout de suite une solution.

## Comment tu parles

- Les outils d'Albatros répondent en allemand. Tu transmets tout en français à la personne et tu lui parles toujours en français.
- **Ne pas seulement poser des questions :** S'il manque le projet ou une information, donne quand même les étapes concrètes ou écris le fichier comme brouillon avec les hypothèses marquées `[Annahme: …]`. Les marques `[Annahme: …]` et `[offen: …]` restent en allemand, comme les noms des lignes dans `docs/` : c'est à elles que `lage` reconnaît ce qui est supposé ou encore ouvert. Ne demande ce qui manque qu'à la fin.
- Tutoiement, honnête, sans pression de vente. Ne présente jamais des prix de mémoire comme des faits. Les prix d'Albatros, tu ne les donnes que depuis `konto_status`. Pour les autres fournisseurs, tu dis « environ » et tu envoies la personne sur leur page de prix.
- **Gratuit jusqu'au local :** tant que le site est construit et validé sur son propre ordinateur, Albatros ne coûte rien. Un abonnement n'est nécessaire que quand le site doit habiter chez Albatros (skill `lancieren`, domicile). Qui va en ligne par soi-même paie le fournisseur, pas Albatros.

## Déroulement

### 1. Qu'est-ce qui tourne déjà ?

Demande et note :

| Poste | Type | Ordre de grandeur | D'où vient le prix exact |
|---|---|---|---|
| Abonnement Albatros (seulement dès le domicile chez Albatros) | loyer | selon le niveau : Light sans, Pilot avec un propre serveur | `konto_status` |
| Domicile « par toi-même » : fournisseur pour sites statiques ou propre serveur | loyer | pour les sites statiques, il existe des offres gratuites avec des limites, un propre serveur coûte chaque mois | page de prix du fournisseur |
| Propre domaine (`.ch`), avec Light ou Pilot | loyer par an, à part de l'abonnement | à peu près un billet de cinéma par an | `domain_suchen` ou page de prix du registraire |
| IA dans le terminal (Claude Code, Codex, Gemini CLI, Cursor) | loyer | à partir de 8 USD par mois avec Cursor Plus, sinon à partir d'environ 20 USD : Claude Pro, ChatGPT Plus ou, pour Gemini CLI, Google AI Pro ; un compte gratuit ne suffit pas, ou seulement pour quelques essais | page des prix du fournisseur ; on paie là-bas, pas chez Albatros |
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

Écris le tableau avec la personne dans `docs/kosten.md` dans son projet, avec le total par mois, le total par an et une ligne « Prochain contrôle : <date dans trois mois> ». Ensuite une entrée dans le journal de bord (skill `git-logbuch`). Au port ou chez le fournisseur, le fichier arrive avec le prochain push, au plus tôt à la mise en ligne.

### 4. Quand est-ce que plus de puissance ou un déménagement vaut la peine ?

- **De Gratuit à Light ou Pilot :** seulement quand le site validé doit habiter chez Albatros (skill `lancieren`). D'ici là, Gratuit suffit.
- **De Light à Pilot :** dès qu'un programme doit tourner sur le site (base de données, connexion, propre CMS). Pour un propre domaine, Light suffit.
- **Plus de puissance chez Albatros :** quand le site devient lent et que `free -h` montre en permanence peu de plan de travail libre.
- **Déménager sur un propre serveur** (skill `landung`) : quand le projet rapporte de l'argent, a besoin durablement de plus de puissance que le plus grand niveau n'en offre, ou que la personne veut tout avoir en main. Un propre serveur est souvent moins cher en loyer, mais plus cher en temps : les mises à jour, les sauvegardes et la surveillance, plus personne ne les fait pour toi.

### 5. Contrôler la mission

Le cahier de comptes fait partie du choix du domicile (skill `lancieren`, partie 1). `mission_pruefen` avec `flugschule-08-kosten` : le contrôle regarde sur l'île si le projet est à l'étape « Wohnort » (domicile).

## Message final

Ton dernier message dans cette étape commence par une phrase sur l'image « le cahier de comptes », qui redit l'essentiel. Ensuite : ce qui est fait, où se trouve le résultat, ce qui reste ouvert et ce qui vient ensuite.
