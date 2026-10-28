---
name: ssh-schluessel
description: "Explains the SSH key to someone with no background using the picture of house key and lock, creates the key pair locally on their computer, stores only the public part with Albatros and tests the first visit to the server. Use this skill for “SSH key”, “ssh-keygen”, “I can't get into my server”, “Permission denied (publickey)”, “what's a public key?”, “new computer”, “new laptop”, and as step 4 of /albatros-en:start."
---

# SSH key: house key and lock

## The picture

An SSH key is a pair:

- **The house key** (private key) always stays with you, on your computer. Nobody else gets it, not Albatros, not me either.
- **The lock** (public key) can be fitted anywhere you like. Anyone who sees the lock can't open anything with it.

We fit your lock into the door of your server. After that, only someone with the matching house key gets in: you. You don't need a password for it.

Explain the picture before you run a command. Only use the words “private” and “public key” after that, and then always together with the picture.

**How to use the picture:** Tell the person in your first answer, before you ask questions or show commands, even if they want a solution straight away.

## Hard rules

- The Albatros tools answer in German. Pass everything on in English, and always talk to the person in English.
- The private key never leaves the computer. You don't read it, display it, copy it or upload it anywhere, not even if asked. If the person wants to copy it into the chat: stop them kindly and explain why.
- Only the file ending in `.pub` (pub as in public) gets uploaded. Before uploading, check that the content starts with `ssh-ed25519 ` and is a single line.
- You never overwrite existing keys. `ssh-keygen` asks before overwriting, but you pick a name of your own anyway.

## Steps

### 1. Is there already an Albatros key?

```bash
ls ~/.ssh/albatros.pub 2>/dev/null && echo "schon da" || echo "noch keiner"
```

(The command prints “schon da”, already there, or “noch keiner”, none yet.) If it's already there, use it and go to step 3.

### 2. Create the key (locally)

Say beforehand: “Now your computer makes a new house key and the matching lock. Both end up in the hidden folder `.ssh` in your user folder.”

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "albatros" -f ~/.ssh/albatros -N ""
```

- `-t ed25519`: a modern, secure kind of key.
- `-f ~/.ssh/albatros`: the name. Two files are created: `albatros` (house key) and `albatros.pub` (lock).
- `-N ""`: no extra password. That way I can run the command for you. Anyone who wants an extra lock on the key ring can later type `ssh-keygen -p -f ~/.ssh/albatros` themselves in a terminal window of their own and set a passphrase. You never type that into the chat.

Windows: the same command works in PowerShell, just without the `mkdir`/`chmod` line. The folder there is called `$HOME\.ssh`.

### 3. Upload only the lock

```bash
cat ~/.ssh/albatros.pub
```

Show the person the line and say: “That's your lock. Anyone may see it.” Pass exactly this line to the Albatros tool `schluessel_hinterlegen`. If the person wants to upload their lock, do it straight away without asking again: storing a lock is harmless.

If the tool is missing (Albatros not connected yet): first follow step 1 in the skill `start`. Alternatively the person can paste the line into the cockpit on albatros.build under “Keys”.

### 4. Tell the computer which key belongs to which door

Ask whether you may add an entry to `~/.ssh/config`. Picture: a tag on the key ring saying “this key belongs to aufwind.sh”. Only append, delete nothing:

```bash
cat >> ~/.ssh/config <<'EOF'

Host aufwind.sh
  IdentityFile ~/.ssh/albatros
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

### 5. First visit

**With Light** there's no server to visit. Test the lock at the harbour: `ssh -T git@aufwind.sh`. If it greets the person by name (“successfully authenticated”), the key fits. Then carry on with the skill `git-logbuch`. The rest of this step and the mission `flugschule-02-ssh-schluessel` belong to Pilot.

**With Pilot:** let the person type this command themselves (in Claude Code with `!` in front):

```bash
ssh {name}@aufwind.sh
```

`{name}` is the name of their server (it's in `konto_status`). The very first time, the computer asks: “Are you sure you want to continue connecting?” Picture: the server is showing its ID card. The fingerprint is in the cockpit. If it matches, the person types `yes`.

Once inside: `echo "Ich war hier" > ~/hallo.txt` (“I was here”), then `exit`. That's their first footprint on their own server.

If you have to test it yourself (your terminal isn't interactive):

```bash
ssh -o StrictHostKeyChecking=accept-new {name}@aufwind.sh 'echo "Ich war hier" > ~/hallo.txt && cat ~/hallo.txt'
```

### 6. Check the mission

`mission_pruefen` with `flugschule-02-ssh-schluessel`. The check looks at whether `~/hallo.txt` is on the server.

## When it gets stuck

- **`Permission denied (publickey)`**: the lock doesn't fit the door. Check in this order: is the server name right? Was the lock uploaded (`konto_status`)? Is the entry in `~/.ssh/config`? Test with `ssh -v {name}@aufwind.sh` and look for the line “Offering public key”.
- **“Dieser Schlüssel gehört schon zu einem anderen Konto” (this key already belongs to another account):** a lock belongs to exactly one Albatros account, just like on GitHub. For a second account, create a key of its own (`ssh-keygen -t ed25519 -C "albatros-zwei" -f ~/.ssh/albatros-zwei -N ""`) and add a separate entry in `~/.ssh/config`: `Host aufwind-zwei` with `HostName aufwind.sh`, `IdentityFile ~/.ssh/albatros-zwei` and `IdentitiesOnly yes`. For that account the address is then `aufwind-zwei` instead of `aufwind.sh`, for example `git@aufwind-zwei:<name>/projekt.git`.
- **New computer:** a new house key on the new computer, and upload its lock as well. Never copy the old house key by email or USB stick.
- **Computer lost or stolen:** remove the old lock in the cockpit straight away. It's like changing the lock cylinder.
- **`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED`**: the server's ID card is different from last time. Don't just click it away. Compare the fingerprint in the cockpit. Only when it matches, remove the old line with `ssh-keygen -R aufwind.sh`.

## Final message

Your last message in this step starts with one sentence on the picture “house key and lock” that sums up the core once more. Then: what's done, where the result is, what's still open and what comes next.
