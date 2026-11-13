---
name: kanaele
description: "Helps a person with no prior knowledge set up social media accounts for her website herself (Instagram as a professional account, Facebook page, LinkedIn page, Pinterest, TikTok optional), with the same name as the site and a bio with a link; passwords and codes stay with her. Then “share new posts”: for each new blog post Bert writes one short post per channel as a draft (tool entwurf), the person approves and posts herself; as a recurring helper with the tool aufgabe. Use this skill for “social media”, “Instagram”, “Facebook page”, “LinkedIn”, “Pinterest”, “TikTok”, “create an account”, “share a post”, “write a post”, “how do I make my site known”."
metadata:
  stand: 0.3.2
  quelle: 'e939e5cb6500'
---

# Channels: the poster pillars in town

## The picture

Your website is your shop. Instagram, Facebook and the others are poster pillars in different neighbourhoods. Every poster shows the same name and the same picture, plus an arrow to the shop: the link. Only you may put up posters.

**How to use the picture:** tell the person in one sentence in your first answer.

## How you talk

- Informal “you”, short sentences, numbered steps, at most two questions per message.
- The buttons in the apps sometimes change their names. If the person sees something else, she should tell you what she sees.

## Three fixed rules

1. **The person creates the accounts herself.** She types passwords and codes (two-factor) only in the app. You never ask for them and never see them.
2. **You never post.** Every post is a draft. The person reads it, approves it and posts it with her own click. This always applies, even if she says “just do it”.
3. **Say openly who recommends.** If a post links to SwissActivities and the person works there, the post says: “I work at SwissActivities. The tips are my own.” (in the language of the post). You add this on your own and never leave it out. Reason: advertising must be recognisable as advertising (Swiss fair-trading law). The accounts never look like the official SwissActivities ones: own name, own picture. Whether the company has rules for social media, the person asks there.

## 1. Prepare name and bio

You write `docs/kanaele.md`:

```markdown
# Kanäle
Name: <like the website, e.g. ausflugsmami>
Link: <address of the website>
Bio: <at most 150 characters, with the note>
| Kanal | Konto | Stand |
|---|---|---|
| Instagram | @… | offen |

## Geteilt
```

The line names and `## Geteilt` stay German so that the recurring helper finds them; after the colon you write in the person’s language.

1. **Name:** the same as the website, the same everywhere. The person checks in each app whether it is free; otherwise a small addition, the same everywhere.
2. **Picture:** logo or the same photo on all channels.
3. **Bio:** for example “Family days out in Switzerland, tested by us. I work at SwissActivities, the tips are my own.” Plus the link to the website.

## 2. Create the accounts (the person does this)

**Instagram (professional account)**
1. Open the Instagram app, “Create new account”, with your email address.
2. Enter name, profile picture and bio from `docs/kanaele.md`.
3. Profile, menu ☰, “Account type and tools”, “Switch to professional account”, choose a category (e.g. “Blogger”), “Creator”.
4. “Edit profile”, “Links”, the address of your website.
5. In the settings, turn on two-factor authentication.

**Facebook page**
1. Sign in with your personal Facebook account. A page needs one behind it; it is not shown.
2. Menu, “Pages”, “Create new Page”.
3. Enter name, category (e.g. “Blogger”) and bio.
4. Profile picture, cover photo and the address of your website.
5. “Done”. Then turn on two-factor authentication in the settings.

**LinkedIn page**
1. Often your personal profile is enough: there you simply share the posts yourself. A page is worth it if the recommendations are a project of their own.
2. Sign in to LinkedIn, at the top “For Business”, “Create a Company Page”.
3. Enter name, page address (linkedin.com/company/<name>), website, logo and tagline.
4. Confirm that you may create the page, and “Create page”.

**Pinterest**
1. Create a business account: on pinterest.ch “Sign up” and choose “business account”, or convert an existing account.
2. Name, profile picture, about text and the address of your website.
3. Confirm the website: Pinterest shows a short piece of code. Give it to me, I build it into the site. It is not a secret.
4. Create boards, for example “Rainy days with kids” and “Hiking with a pushchair”.

**TikTok (optional)**
1. Open the TikTok app, “Sign up”, with your email address.
2. Name, profile picture and bio from `docs/kanaele.md`.
3. If a link in the profile is not possible, the address of the website goes into the post.
4. In the settings, turn on two-factor authentication.

When an account is ready, you enter its name in `docs/kanaele.md` and set `Stand` to `fertig`. Menu names according to the apps, not rechecked on 13.11.2026.

## 3. Share new posts

When a blog post is online (skill `blog`), you do this:

1. **Read:** title, the sentence from `description`, address of the post, picture.
2. **One draft per channel:** for each ready channel in `docs/kanaele.md` you call `entwurf` with `art: beitrag`. In `an` goes the channel (e.g. “Instagram”), in `text` the post. Short: one sentence that makes people curious, one sentence of benefit, the link, three to five hashtags and the note from rule 3.
3. **Each channel differently:** Instagram with “link in bio” and a portrait picture; Facebook with the link directly; LinkedIn a little more matter-of-fact; Pinterest as a pin with a portrait picture and link; TikTok as text for a short video by the person.
4. **The person decides:** she sees the drafts in Albatros, changes them, approves and posts herself.
5. **Remember:** under `## Geteilt` in `docs/kanaele.md` goes `<slug> <DD.MM.YYYY>`. That way no draft is made twice.

Without the Albatros app you put the drafts in `docs/beitraege/<DD.MM.YYYY>-<slug>.md`; the person copies them into the app.

## 4. Set it up as a recurring helper

Offer it. Only after her yes do you create it with `aufgabe`, with `ausloeser: zeit` and `wiederholen: woechentlich`:

- **Title:** “Share new posts”
- **When:** every Monday at 9 a.m. (the person chooses day and time)
- **Instruction:** “Look in web/src/content/blog/ for posts that are online and missing under ## Geteilt in docs/kanaele.md. For each: one draft per ready channel with entwurf, art beitrag, with the note about SwissActivities if it links there. Then enter the post under ## Geteilt. Post nothing.”

If `aufgabe` offers a trigger for a freshly published site, prefer that one (`ausloeser: ereignis`). Then the drafts come right after publishing instead of on Monday.

## Stumbling blocks

- Five names for one site: nobody finds what belongs together. The same name everywhere.
- A password in the chat: tell the person to change it at once. You store it nowhere.
- A post without the note about the employer: the sentence from rule 3 belongs in every post with a link to SwissActivities.

## Final message

Your last message in this step starts with a sentence about the picture “the poster pillars in town” that says the core once more. Then: what is done, which accounts are ready, what is still open and what comes next.
