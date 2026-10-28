# Flight manual of __NAME__

Welcome aboard! This is your very own server. A server is a computer that's always on and always connected to the internet. Your website keeps running here, even when your laptop is closed.

## Where you are

- Your server is called **__NAME__**.
- Your page: https://__NAME__.__DOMAIN__
- How to get in: `ssh __NAME__@__DOMAIN__`
- Here you're the user `pilot`. With `sudo` in front of a command you can do anything, like a captain.
- Your home is the folder `/home/pilot`. This flight manual is there too.

## What's already on board

- **Docker** packs programs into crates (containers). Each crate carries everything its program needs. That way programs don't get in each other's way.
- **git** is your logbook for code. Each entry (commit) records what changed. You can always go back to an old entry.

## Your website

Whatever answers on port 80 of this server, the whole world sees at https://__NAME__.__DOMAIN__. Albatros takes care of the padlock in the browser (HTTPS).

At first there's a welcome message. It keeps port 80 free for you until your own page arrives. Then you make room for it:

```
sudo systemctl disable --now willkommen
```

Your project lives in the folder `~/projekt`. It's a copy of your logbook (repository) from the Albatros harbour. From your laptop you send changes to the harbour with `git push`, to `git@__DOMAIN__:__NAME__/projekt.git`, with your own key. Then the conveyor belt builds your page here on the server and delivers it. The server fetches your logbook with its own key (`~/.ssh/code`), so you don't have to worry about that.

## You can't break anything

Every night Albatros takes a photo of your server. That's called a snapshot. The photos of the last 7 days stay. If something goes wrong, choose "Back to yesterday" in the cockpit or via your AI.

Good to know: whatever you changed after the photo is gone afterwards. So are photos newer than the one you picked.

## Limits

- Memory (RAM), storage and computing power depend on your plan. If things get tight, Albatros lets you know.
- Sending emails straight from the server doesn't work, the mail ports 25, 465 and 587 are closed. That way nobody can send spam. For emails you use a service like Resend or Brevo through their API.
- You can't reach the servers of other learners, and they can't reach yours.
- From outside, only SSH (22) and the website (80 and 443) are reachable.

## Your key

In `~/.ssh/authorized_keys` there's a line with `albatros-zugang`. Leave it in: it's how you get in with `ssh __NAME__@__DOMAIN__`. You add a new key through Albatros, in the cockpit or via your AI.

## Help

Ask your AI or the coach in the cockpit. It knows your server and your mission.
