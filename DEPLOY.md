# Deploying gimmiepets.com

Parties: **the store owner** (GitHub repo, Shopify admin, domain) and **Cloudflare
Pages** (free hosting; Netlify works identically).

## 0. Put this code in your own GitHub repo (~10 min, no terminal needed)

1. Sign up / log in at github.com.
2. Go to **github.com/new** → name it `gimmiepets-store` → visibility **Private** →
   Create repository.
3. On the new empty repo page, click **"uploading an existing file"**.
4. Drag in ALL the files and folders from this zip (everything: the `.html` files,
   `css/`, `js/`, and the `.md` docs). Commit directly to `main`.

That's it — the repo is yours. (Terminal alternative: unzip, `git init -b main`,
`git add -A && git commit -m "storefront"`, add the remote GitHub shows you, push.)

## 1. Hosting (~10 min, once)

1. Log in / sign up at https://dash.cloudflare.com → **Workers & Pages → Create → Pages**.
2. **Connect to Git** → pick this GitHub repo → framework preset: **None**, build command:
   *(empty)*, output directory: `/`. Deploy.
3. You get `<project>.pages.dev`. Every `git push` to `main` auto-deploys (~30 s).

## 2. Test before touching the domain

On the `.pages.dev` URL:

- [ ] Browse all pages, mobile + desktop.
- [ ] Add both products to cart, change quantities, remove.
- [ ] **Check out** → must land on Shopify checkout with the right items & prices.
- [ ] Full test order: owner enables test payments first
      (Shopify admin → **Settings → Payments → Shopify Payments → Manage → Test mode**,
      or activate **Bogus Gateway** under "Manual/other providers"). Card `1` (Bogus) or
      Shopify's test card numbers. Confirm the order shows up in **Orders**. Turn test
      mode OFF afterwards.
- [ ] Contact form → submission arrives at the owner's store email.
- [ ] Newsletter form → email appears under **Customers** (accepts marketing / tag
      `newsletter`). Note: Shopify may show a one-time captcha page on form submits —
      that's normal.

## 3. Point the domain (owner, ~10 min)

Find where gimmiepets.com is managed: Shopify admin → **Settings → Domains** says either
"Managed by Shopify" or names the outside registrar.

1. In Cloudflare Pages → **Custom domains** → add `gimmiepets.com` and `www.gimmiepets.com`.
   It shows the exact DNS records needed (a CNAME for each, or A records for the apex).
2. In the domain's DNS editor (Shopify: Settings → Domains → the domain → **Edit DNS
   settings**; otherwise the registrar's dashboard), replace the current A/CNAME records
   (they point at Shopify: A `23.227.38.x` / CNAME `shops.myshopify.com`) with the values
   Cloudflare gave.
3. Wait for DNS + certificate (minutes to ~1 h). The static site is now the storefront.
4. In Shopify, leave the `.myshopify.com` domain as is — checkout keeps running there.
   Do NOT close the Shopify store; it's the cash register.

## 4. After launch

- **Money saver (owner):** ask Shopify support about downgrading to the **Starter** plan
  (~$5/mo) — the full Online Store channel is no longer being used, only checkout.
  Verify cart permalinks still work on Starter before committing to the downgrade.
- **Apps:** the countdown-timer / urgency apps on the old theme can be uninstalled
  (they billed monthly and only affected the old storefront).
- **Rollback is trivial:** point the DNS records back at Shopify
  (A `23.227.38.65` / CNAME `shops.myshopify.com`) and the old Dawn storefront returns.

## Change workflow (steady state)

```
site change needed ──> edit HTML/JS (yourself, or whoever maintains it for you)
                        ──> commit to main (git push, or GitHub's web editor) ──> live in ~30 s
orders / refunds / shipping ──> handled in Shopify admin, no code involved
```

Small text/price edits don't need any tools: open the file on github.com, click the
pencil icon, edit, commit — Cloudflare redeploys automatically.
