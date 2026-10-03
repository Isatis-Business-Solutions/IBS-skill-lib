# One-time setup

Read this only when no route is ready. Do not install anything or start a login without the user's consent.

**Every user sets up their own access, in their own environment.** A login or API key belongs to one person
and stays on the machine or in the environment where it was made (Codex keeps it in `~/.codex/auth.json`).
Never reuse, copy or share someone else's login, key or login link, and never put them in a repository, a
document or a chat with others. Login links and codes are single-use: always start a fresh login for the
current user.

## Explain the choice first, including cost

| Route | What it uses | Cost |
|---|---|---|
| **Codex CLI** (recommended) | The user's existing ChatGPT subscription | No extra cost: images count toward the subscription's usage limits |
| **OpenAI API** | An API key with billing on platform.openai.com | Always extra cost: paid per image, on top of any subscription |
| **No image model** | — | Free: you get a ready-to-use prompt and a placeholder (`fallback.md`) |

Recommend the Codex CLI when the user has a ChatGPT subscription. Ask which route they want.

## Codex CLI

1. Check `codex --version`. If it is missing, ask permission, then install with
   `npm install -g @openai/codex` (requires Node.js).
2. Log in with the user's ChatGPT account:
   - with a browser on this machine: `codex login`;
   - without a browser on this machine (remote, container, cloud), two options:
     - **Browser login with callback (works from a phone, no extra setting):** run `codex login` in the
       background and give the user the `https://auth.openai.com/oauth/authorize…` URL it prints. They log in
       on their own device; the browser then lands on a page that does not load, starting with
       `http://127.0.0.1:1455/auth/callback?code=…`. Ask them to paste that full address, then call it from
       this machine (`curl -s "<address>"`) to complete the login. The code works once and only with this
       machine's login session.
     - **Device code:** `codex login --device-auth`. Run it in the background,
       pass the URL and code it prints to the user, and wait until they have confirmed on their own device.
       Device codes are off by default in ChatGPT: the user first turns on **Settings → Security → Device code
       authorization** (in a Team or Enterprise workspace an admin may have to). If the code is rejected,
       this is the cause. A code expires after 15 minutes; start a new login if needed.
3. Confirm with `codex login status`.
4. Sandboxed or cloud environment: `chatgpt.com` and `auth.openai.com` must be allowed in its network
   settings, or login and generation fail.

## OpenAI API

Summarise these steps and point to the OpenAI website for details:

1. Create an account at platform.openai.com and add billing (prepaid credit or a payment method).
2. Create an API key at platform.openai.com/api-keys.
3. Make it available as the environment variable `OPENAI_API_KEY` (shell profile or the environment's
   secret settings). Never paste the key into the chat or commit it to a repository.
4. Prices per image: openai.com/api/pricing. Guide: platform.openai.com/docs/guides/image-generation.
5. Sandboxed or cloud environment: `api.openai.com` must be allowed.

## Neither

Go to `fallback.md`.
