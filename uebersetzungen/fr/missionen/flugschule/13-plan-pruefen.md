---
titel: Le deuxième avis sur le plan
bild: 'Le deuxième avis de l''ingénieure en statique, avant de construire'
phase: P4
verstehen:
  - frage: Pourquoi ton IA vérifie-t-elle ton plan dans une nouvelle conversation ?
    kern: 'Qui a écrit le plan voit le moins bien ses lacunes. Un regard neuf, sans l''historique, trouve ce que le premier n''a pas vu.'
  - frage: Que veut dire un point « risque » sur la liste de contrôle ?
    kern: Le plan fonctionne ainsi, mais à cet endroit quelque chose peut mal tourner. Tu décides en connaissance de cause si vous le changez ou si vous assumez le risque.
---

## De quoi il s'agit

Avant de construire une maison, une ingénieure en statique regarde le plan. Elle ne l'a pas dessiné et voit donc ce qui a échappé à l'architecte. Ton IA fait la même chose avec ton plan : dans une nouvelle conversation, qui ne connaît que tes documents dans `docs/`, elle le vérifie avec une liste fixe. Ensuite, tu décides si le plan est valable ainsi.

## Ce que tu apprends

- qui a écrit le plan voit le moins bien ses lacunes
- ce qui figure sur la liste de contrôle : une chose principale, peu de pages, des déroulements avec confirmation et erreur, les contenus, les obligations, les coûts, la date
- ok, risque ou ouvert : trois réponses honnêtes plutôt qu'une note
- pourquoi seul un plan confirmé passe au design

## Comment t'y prendre

1. Ton IA demande le deuxième avis dans une nouvelle conversation, qui ne lit que `docs/`.
2. Chaque point de la liste de contrôle reçoit ok, risque ou ouvert, avec l'endroit dans le plan.
3. Ton IA te montre les points marqués risque ou ouvert.
4. Tu décides : laisser ainsi ou changer. Ce n'est qu'après ton oui que le plan est marqué comme confirmé, avec la date.

Si tu modernises un site existant, le deuxième avis vérifie aussi qu'aucune fonction de l'ancien site ne se perd sans décision.

## Réussi quand

- ta confirmation avec la date figure dans `docs/plan.md`
- et l'étape « Plan vérifié » est atteinte sur ton île.
