# GimmiePets storefront

Static storefront for **gimmiepets.com**. Browsing happens here; **payments never do** —
the checkout button hands the cart to Shopify's hosted checkout
(`bys-user-store-50617.myshopify.com`), which handles cards, taxes, fraud, and PCI
compliance. This repo contains no secrets, no server, and no build step: it's plain
HTML/CSS/JS, deployable on any static host.

## Architecture

```
customer ──> gimmiepets.com  (this repo, static host, free)
                 │  browse, cart (localStorage)
                 ▼
             "Check out" ──> bys-user-store-50617.myshopify.com/cart/VARIANT:QTY,...
                              (Shopify hosted checkout — payments, orders, emails)
```

- **Checkout**: cart permalink built in `js/store.js` (`SHOP` constant + variant IDs).
- **Newsletter form** (`index.html`) and **contact form** (`contact.html`) POST to
  Shopify's native `/contact` endpoint — submissions appear in the store owner's
  Shopify notifications like any theme form.
- Product images hotlink the store's own Shopify CDN.

## Editing prices / products

Prices shown on the site are display copies — Shopify always charges its own live price
at checkout, so a stale price here can't overcharge anyone, it just looks wrong.
When the owner changes anything in Shopify admin, update:

1. `js/store.js` — the `PRODUCTS` map (price and/or variant `id`).
2. The visible prices in `index.html`, `catalog.html`, and the two `product-*.html` pages.

To get current variant IDs at any time (public endpoint, no auth):
`https://gimmiepets.com/products/<product-handle>.js` → `variants[].id`.

## Rules

- **No invented reviews.** Review/testimonial sections were deliberately removed; only
  add them back with real customer quotes (HTML comments mark the spots).
- Policies pages are plain-English drafts — the owner should confirm they match how the
  store actually operates (refund window, shipping times).

## Deploying

See `DEPLOY.md`. Local preview: `python3 -m http.server 4173` in this folder,
or just open `index.html` in a browser.
