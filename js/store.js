/* GimmiePets storefront — cart, drawer, product page logic.
   Checkout hands off to Shopify (hosted checkout) via cart permalinks:
   https://SHOP/cart/VARIANT_ID:QTY,... — the site never touches payment data.
   Prices shown here are display copies; Shopify checkout always charges the
   live price. If a price or variant changes in Shopify admin, update it here. */
(function () {
  const CDN = "https://cdn.shopify.com/s/files/1/0656/7080/7637/files/";
  const SHOP = "https://bys-user-store-50617.myshopify.com";
  const PLACEHOLDER_IMG = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='lightgray'/><text x='200' y='200' font-family='sans-serif' font-size='22' fill='dimgray' text-anchor='middle'>Photo pending</text></svg>";

  const PRODUCTS = {
    hammock: {
      name: "Waterproof Back-Seat Dog Hammock",
      url: "product-hammock.html",
      img: CDN + "7ed541bf8c7c5de0b2b082914b21e61f.jpg",
      variants: {
        "Standard (Cars & SUVs)": { price: 49.99, id: 42747541782613 },
        "X-Large (Full-Size Trucks)": { price: 55.99, id: 42747541815381 },
      },
    },
    comb: {
      name: "Double-Sided Detangling & Deshedding Comb",
      url: "product-comb.html",
      img: CDN + "ecb23479aaba407bbdce3af3ad1d88a1_tplv-fhlh96nyum-crop-webp_1600_1600.webp",
      variants: {
        Blue: { price: 12.98, id: 42747553054805 },
        Pink: { price: 12.98, id: 42747553087573 },
      },
    },
    /* --- Below: CJ candidates, not live yet. Each needs a real Shopify variant ID
       (from Shopify admin after importing via the CJ app) before checkout will work. --- */
    seatbelt: {
      name: "Adjustable Pet Car Seat Belt",
      url: "product-seatbelt.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 14.99, id: "TODO_VARIANT_ID" } },
    },
    leash: {
      name: "Retractable Dog Leash with Spotlight",
      url: "product-leash.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 24.99, id: "TODO_VARIANT_ID" } },
    },
    "bath-gloves": {
      name: "Silicone Dog Bath Massage Gloves",
      url: "product-bath-gloves.html",
      img: PLACEHOLDER_IMG,
      variants: { "One Pair": { price: 16.99, id: "TODO_VARIANT_ID" } },
    },
    "lint-roller": {
      name: "2-in-1 Reusable Pet Hair Remover",
      url: "product-lint-roller.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 14.99, id: "TODO_VARIANT_ID" } },
    },
    "airtag-collar": {
      name: "Reflective Waterproof AirTag Collar Case",
      url: "product-airtag-collar.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 19.99, id: "TODO_VARIANT_ID" } },
    },
    "travel-bottle": {
      name: "Portable Outdoor Travel Water Bottle",
      url: "product-travel-bottle.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 17.99, id: "TODO_VARIANT_ID" } },
    },
    sweater: {
      name: "Cashmere Pet Sweater",
      url: "product-sweater.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 22.99, id: "TODO_VARIANT_ID" } },
    },
    "cooling-mat": {
      name: "Dog Cooling Mat",
      url: "product-cooling-mat.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 24.99, id: "TODO_VARIANT_ID" } },
    },
    feeder: {
      name: "Automatic Pet Feeder & Water Dispenser",
      url: "product-feeder.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 34.99, id: "TODO_VARIANT_ID" } },
    },
    "undercoat-comb": {
      name: "Open-Knot Massage Comb",
      url: "product-undercoat-comb.html",
      img: PLACEHOLDER_IMG,
      variants: { Standard: { price: 15.99, id: "TODO_VARIANT_ID" } },
    },
  };

  const KEY = "gp_cart_v1";
  const money = (n) => "$" + n.toFixed(2);
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const save = (c) => localStorage.setItem(KEY, JSON.stringify(c));

  /* ---------- toast ---------- */
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  document.body.appendChild(toastEl);
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }
  window.gpToast = toast;

  /* ---------- cart drawer ---------- */
  const veil = document.createElement("div");
  veil.className = "drawer-veil";
  const drawer = document.createElement("aside");
  drawer.className = "drawer";
  drawer.innerHTML = `
    <div class="drawer-head">
      <h3>Your cart</h3>
      <button class="drawer-close" aria-label="Close cart">✕</button>
    </div>
    <div class="ship-note">🚚 Free worldwide shipping on every order — no minimum.</div>
    <div class="drawer-items"></div>
    <div class="d-cross"></div>
    <div class="drawer-foot">
      <div class="subtotal-row"><span>Subtotal</span><span class="sub-val">$0.00</span></div>
      <p class="fine">Shipping is free. Taxes calculated at checkout. 30-day money-back guarantee.</p>
      <button class="btn btn-primary btn-block checkout-btn">Check out</button>
    </div>`;
  document.body.appendChild(veil);
  document.body.appendChild(drawer);

  const openDrawer = () => { drawer.classList.add("open"); veil.classList.add("open"); render(); };
  const closeDrawer = () => { drawer.classList.remove("open"); veil.classList.remove("open"); };
  veil.addEventListener("click", closeDrawer);
  drawer.querySelector(".drawer-close").addEventListener("click", closeDrawer);
  drawer.querySelector(".checkout-btn").addEventListener("click", () => {
    const cart = load();
    if (!cart.length) { toast("Your cart is empty."); return; }
    const items = cart
      .map((i) => PRODUCTS[i.id].variants[i.variant].id + ":" + i.qty)
      .join(",");
    window.location.href = SHOP + "/cart/" + items;
  });

  function cartCount() { return load().reduce((s, i) => s + i.qty, 0); }

  function updateBadge() {
    document.querySelectorAll(".cart-count").forEach((b) => {
      const n = cartCount();
      b.textContent = n;
      b.classList.toggle("show", n > 0);
    });
  }

  function render() {
    const cart = load();
    const wrap = drawer.querySelector(".drawer-items");
    const crossWrap = drawer.querySelector(".d-cross");
    if (!cart.length) {
      wrap.innerHTML = `<div class="empty-cart"><p>Your cart is empty.</p><p style="margin-top:10px"><a href="catalog.html">Shop our essentials →</a></p></div>`;
    } else {
      wrap.innerHTML = cart.map((item, idx) => {
        const p = PRODUCTS[item.id];
        return `<div class="d-item">
          <img src="${p.img}" alt="${p.name}">
          <div>
            <div class="t">${p.name}</div>
            <div class="v">${item.variant}</div>
            <div class="p">${money(p.variants[item.variant].price)}</div>
            <span class="stepper">
              <button data-a="dec" data-i="${idx}" aria-label="Decrease">−</button>
              <span class="qv">${item.qty}</span>
              <button data-a="inc" data-i="${idx}" aria-label="Increase">+</button>
            </span>
            <button class="d-remove" data-a="rm" data-i="${idx}">Remove</button>
          </div>
        </div>`;
      }).join("");
    }
    // cross-sell: suggest whichever product is not in the cart yet
    const inCart = new Set(cart.map((i) => i.id));
    const suggestId = Object.keys(PRODUCTS).find((id) => !inCart.has(id));
    if (cart.length && suggestId) {
      const s = PRODUCTS[suggestId];
      const firstVariant = Object.keys(s.variants)[0];
      crossWrap.style.display = "";
      crossWrap.innerHTML = `<h4>Pairs well with</h4>
        <div class="d-cross-row">
          <img src="${s.img}" alt="${s.name}">
          <div class="t">${s.name}<br><span style="font-weight:700">${money(s.variants[firstVariant].price)}</span></div>
          <button class="btn btn-ghost" data-cross="${suggestId}">Add</button>
        </div>`;
    } else {
      crossWrap.style.display = "none";
      crossWrap.innerHTML = "";
    }
    const sub = cart.reduce((s, i) => s + PRODUCTS[i.id].variants[i.variant].price * i.qty, 0);
    drawer.querySelector(".sub-val").textContent = money(sub);
    updateBadge();
  }

  drawer.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.cross) { addToCart(btn.dataset.cross, Object.keys(PRODUCTS[btn.dataset.cross].variants)[0], 1, true); return; }
    const i = +btn.dataset.i;
    const cart = load();
    if (btn.dataset.a === "inc") cart[i].qty++;
    if (btn.dataset.a === "dec") cart[i].qty = Math.max(1, cart[i].qty - 1);
    if (btn.dataset.a === "rm") cart.splice(i, 1);
    save(cart);
    render();
  });

  function addToCart(id, variant, qty, silent) {
    const cart = load();
    const hit = cart.find((i) => i.id === id && i.variant === variant);
    if (hit) hit.qty += qty; else cart.push({ id, variant, qty });
    save(cart);
    render();
    openDrawer();
    if (!silent) toast("Added to cart ✓");
  }
  window.gpAdd = addToCart;

  /* ---------- header wiring ---------- */
  document.querySelectorAll(".cart-btn").forEach((b) => b.addEventListener("click", openDrawer));
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) navToggle.addEventListener("click", () => document.querySelector("nav.main").classList.toggle("open"));
  updateBadge();

  /* ---------- product page ---------- */
  const buy = document.querySelector("[data-product-id]");
  if (buy) {
    const pid = buy.dataset.productId;
    const p = PRODUCTS[pid];
    let variant = Object.keys(p.variants)[0];
    let qty = 1;
    const priceEl = document.querySelector(".price-big");
    const qv = document.querySelector(".qty-row .qv");
    const mainImg = document.querySelector("img.main");

    document.querySelectorAll(".pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        document.querySelectorAll(".pill").forEach((x) => x.classList.remove("sel"));
        pill.classList.add("sel");
        variant = pill.dataset.variant;
        priceEl.textContent = money(p.variants[variant].price);
        if (pill.dataset.img && mainImg) {
          mainImg.src = pill.dataset.img;
          document.querySelectorAll(".thumbs img").forEach((t) => t.classList.toggle("sel", t.src === pill.dataset.img));
        }
      });
    });
    document.querySelectorAll(".qty-row .stepper button").forEach((b) => {
      b.addEventListener("click", () => {
        qty = b.textContent.trim() === "+" ? qty + 1 : Math.max(1, qty - 1);
        qv.textContent = qty;
      });
    });
    document.querySelector(".add-to-cart").addEventListener("click", () => addToCart(pid, variant, qty));
    document.querySelectorAll(".thumbs img").forEach((t) => {
      t.addEventListener("click", () => {
        mainImg.src = t.src;
        document.querySelectorAll(".thumbs img").forEach((x) => x.classList.remove("sel"));
        t.classList.add("sel");
      });
    });
  }

  /* ---------- newsletter + contact forms ---------- */
  document.querySelectorAll("form[data-demo]").forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      toast(f.dataset.demo);
      f.reset();
    });
  });
})();
