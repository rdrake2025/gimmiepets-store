# GimmiePets — Redesign Handoff

> **⚠️ Superseded (2026-07-20):** the plan changed — this site is now being deployed as
> the real storefront (static hosting + Shopify checkout). See `README.md` and
> `DEPLOY.md`. This document is kept only as the reference list of problems found on the
> original Dawn storefront, in case the owner ever reverts to it.

**What this is:** a clickable redesign of gimmiepets.com showing every recommended fix.
Unzip the folder and double-click `index.html` — it opens in any browser. Browse it like a
real store (cart works; checkout is intentionally disabled). Product photos load from your
own store's CDN, so you need internet while viewing.

**What this is NOT:** a theme you upload. Your store runs Shopify's Dawn theme, and every
change below is done in the Shopify admin — no code needed unless marked. Use the demo as
the target, and this checklist as the map.

---

## 1. Remove the trust-killers (do these first, ~30 min)

| Problem on the live store | Where to fix in Shopify |
|---|---|
| "Review 1 – Share positive thoughts and feedback from your customer" placeholder text visible under the buy button on both products | This is a theme section with unfilled example content. **Online Store → Themes → Customize → Product template** — find the review/testimonial block and either fill it or click **Remove section**. |
| "(126 Reviews)" star badge on both products (identical number, no real reviews) | Same place — it's a text/badge setting on the product template. Delete the fake count. If you want real reviews, install **Judge.me** or **Loox** (both have free plans) and let them render stars only when reviews exist. |
| "Cart reserved for 03:41" countdown in the cart | This comes from an app (check **Settings → Apps and sales channels** for a countdown/urgency app — often Hextom, Essential, or similar). Uninstall it. |
| "HOT PRODUCT \| LOW STOCK" banner on every product | Product template badge setting in the theme editor, or the same urgency app. Remove it — only show low stock if it's actually true. |
| Cart says "You're 87.02 away from free shipping!" while the banner says "Free Worldwide Shipping" | The progress bar is a theme/app setting with a $100 threshold. Pick ONE story. Recommended: keep free shipping on everything and delete the progress bar (theme editor → Cart drawer settings, or the app that added it). |

## 2. Add the missing legal/trust pages (~20 min)

1. **Settings → Policies** — Shopify auto-generates Refund, Privacy, Terms of Service,
   and Shipping policy templates. Fill in the blanks (30-day refund window, 4–8 day
   shipping estimate) and save. See `policies.html` in the demo for friendly wording.
2. **Online Store → Navigation** — the footer currently has two menus both called
   "Quick links". Rename/rebuild as two menus:
   - **Shop**: All products, Dog Hammock, Grooming Comb
   - **Support**: Contact, Shipping policy, Returns & refunds, Privacy policy, Terms
   Then assign them in **Themes → Customize → Footer**.
3. Add a support email to the footer (footer text block in the theme editor).

## 3. Fix the product listings (~45 min)

**Products → [each product] in Shopify admin:**

- **Rename them.** The current titles are supplier keyword strings.
  - `Waterproof Back-Seat Dog Hammock` (drop "Patented" unless a patent is actually held/licensed — it's a legal risk otherwise)
  - `Double-Sided Detangling & Deshedding Comb`
- **Write descriptions.** The hammock currently has NO description at all. Copy the
  structure from the demo product pages: 2 short paragraphs → specs table → shipping &
  returns note. The demo copy in `product-hammock.html` / `product-comb.html` is free to
  paste and edit.
- **Comb: fix the variant label.** The option is named "Size" but the values are
  Blue/Pink. Edit the option name to **Color**.
- **Comb: remove the supplier spec-sheet image** (the one with the "Product name: pet
  knotting comb" table). Keep the lifestyle shots.
- **Hammock: surface the real price.** X-Large is $55.99 but the page shows $49.99 until
  clicked — that's fine ("From $49.99") as long as the price updates on selection, which
  Dawn does. Just make sure the collection card says "From $49.99".
- **Add a size guide.** The "Will it fit my car?" table in the demo
  (`product-hammock.html`) answers the #1 objection. Add it to the description or as a
  page linked next to the size picker.

## 4. Homepage content (~30 min, all in Themes → Customize)

- **Value props:** the three badges currently share one broken sentence ("amazing
  products at amazing products"). Give each its own line — see the demo homepage for
  ready-to-paste copy (shipping / tested-on-our-dogs / guarantee).
- **Testimonials:** current ones mention "Trending Items" and "home must-haves" — clearly
  from a general-store template. Replace with pet-specific quotes (the demo has examples,
  but real customer quotes are far better — even two short real ones beat five fake ones).
- **Best Sellers grid:** with only 2 products it renders half-empty. Either swap the grid
  for two full-width feature sections (demo homepage shows this pattern — Dawn's
  "Image with text" section does it natively), or add more products.
- **Own the small catalog.** The demo's About page ("Why only two products?") turns the
  tiny catalog into a trust story. Add it via **Online Store → Pages**.

## 5. Contact page (~10 min)

Add above/beside the form (**Online Store → Pages → Contact**): support email, response
time ("within 24 hours on weekdays"), and a note inviting car make/model for hammock fit
questions. See `contact.html`.

## 6. Nice-to-haves

- Cart drawer: enable Dawn's cross-sell / "complementary products" so the comb is
  suggested under the hammock (works via the Search & Discovery app, free by Shopify).
- Remove the empty "Add these products to your cart" header in the cart if the app that
  added it isn't configured.
- The cart title reads "Cart:" — stray colon, it's a theme language string
  (**Themes → ⋯ → Edit default theme content**, search "cart").

---

*Demo built 2026-07-20. The sample reviews/testimonials in the demo are placeholders and
are labeled as such — never publish invented reviews on the live store.*
