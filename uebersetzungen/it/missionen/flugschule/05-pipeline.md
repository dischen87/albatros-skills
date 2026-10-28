---
titel: Il nastro trasportatore per la tua pagina
bild: Nastro trasportatore con controllo qualità
---

## Di cosa si tratta

Invece di portare a mano ogni modifica sul server, costruisci un nastro trasportatore. Metti una modifica nel diario di bordo e il nastro trasportatore se ne occupa: verificare, costruire, consegnare. Se il controllo qualità non passa, resta online la pagina vecchia. Il termine tecnico è CI/CD.

## Cosa impari

- cos'è un workflow e quando parte
- come il controllo qualità ferma gli errori prima che qualcuno li veda
- chi lavora al nastro trasportatore: un operaio (runner) che abita sul tuo server
- cosa succede quando qualcosa va storto

## Come procedi

1. Guardi il file del workflow nel tuo repo e lo capisci, passo dopo passo.
2. Conosci l'operaio sul tuo server: accetta ogni modifica, la costruisce e la consegna.
3. Fai il push di una piccola modifica e guardi come gira il nastro trasportatore.
4. Fai apposta il push di un errore e vedi come il controllo lo ferma.

## Ce l'hai fatta quando

- l'ultima esecuzione di `.github/workflows/deploy.yml` al porto è verde,
- sul tuo server gira il container `webseite`
- e `https://{name}.aufwind.sh` risponde.
