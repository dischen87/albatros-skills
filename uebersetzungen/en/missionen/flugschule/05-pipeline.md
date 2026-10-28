---
titel: The conveyor belt for your page
bild: Conveyor belt with quality control
---

## What it's about

Instead of carrying every change to the server by hand, you build a conveyor belt. You put a change in the logbook, and the conveyor belt takes over: check, build, deliver. If quality control fails, the old page stays up. The technical term for this is CI/CD.

## What you'll learn

- what a workflow is and when it starts
- how quality control catches mistakes before anyone sees them
- who works at the conveyor belt: a worker (runner) who lives on your own server
- what happens when something goes wrong

## How you go about it

1. Look at the workflow file in your repo and understand it, step by step.
2. Get to know the worker on your server: it takes every change, builds it and delivers it.
3. Push a small change and watch the conveyor belt run.
4. Push a mistake on purpose and see how quality control stops it.

## Done when

- the last run of `.github/workflows/deploy.yml` in the harbour is green,
- the container `webseite` is running on your server
- and `https://{name}.aufwind.sh` answers.
