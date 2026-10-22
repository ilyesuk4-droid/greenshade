# GREEN SHADE — Rebranding & E-commerce Plan

> **Client:** GREEN SHADE — Natural Cosmetics (Soins naturels pour visage et corps)
> **Headline:** La nature au cœur de votre quotidien
> **Tagline:** Simple • Efficace • Garantie
> **Core product line:** Déodorants naturels (sans alcool, sans sels d'aluminium, jusqu'à 72h de protection, convient à tous types de peau, ne tache pas les vêtements, plusieurs fragrances)
> **Event:** Cosmenex Expo, Sétif — 28-31 Oct 2026
> **Deadline:** ASAP (expo starts in 6 days)
> **Contact:** WhatsApp 0558 67 53 86 · Instagram @green_shade_2026 · TikTok @green_shade_2024 · greenshadecontact@gmail.com

---

## Section 1 — Repo Analysis

### 1.1 Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | TanStack Start (SSR) + React 19 | `@tanstack/react-start@1.167.50` |
| Router | TanStack Router (file-based) | `@tanstack/react-router@1.168.25` |
| Build | Vite 7 via `@lovable.dev/vite-tanstack-config` | `vite@7.3.1` |
| Styling | Tailwind CSS 4 (v4 `@theme` syntax) + CSS custom properties | `tailwindcss@4.2.1` |
| UI Components | shadcn/ui (New York style) — 40+ components in `src/components/ui/` | lucide-react icons |
| State | React Context (`StoreProvider`) + Supabase Realtime | — |
| Data Query | `@tanstack/react-query` | `5.83.0` |
| Backend | Supabase (DB + Auth + Realtime) — tables: `settings`, `inquiries` | `@supabase/supabase-js@2.105.4` |
| Deploy target | Vercel (nitro preset in `vite.config.ts`) | — |
| Server entry | `src/server.ts` → Cloudflare Workers format (also works with Vercel) | — |
| Fonts (Google) | Fraunces (serif headings) + Work Sans (body) — loaded in `__root.tsx` `<link>` | — |

### 1.2 Folder Structure (current)

```
PatchNature/
├── public/                          # (empty — no public assets yet)
├── src/
│   ├── assets/                      # PatchNature product images (all to DELETE)
│   │   ├── originals/               # High-res originals
│   │   ├── cactus-produit.png
│   │   ├── hero-bg.png
│   │   ├── hydrogel-separator.jpg
│   │   ├── image2.png
│   │   ├── patchnature-box.jpg / .png
│   │   ├── patchnature-logo.jpeg
│   │   ├── patchnature-packaging.jpg / .png
│   │   ├── pharmacie-pro.jpg
│   │   └── utilisation-patch.jpg
│   ├── components/ui/               # 40 shadcn/ui components ✅ REUSE ALL
│   ├── hooks/use-mobile.tsx         # ✅ REUSE
│   ├── integrations/supabase/       # Supabase client, auth, types
│   ├── lib/
│   │   ├── error-capture.ts         # ✅ REUSE (infra)
│   │   ├── error-page.ts            # ✅ REUSE (infra)
│   │   ├── inquiries-service.ts     # ❌ DELETE (B2B inquiries, PatchNature-specific)
│   │   ├── store-context.tsx         # ❌ REPLACE (settings tied to old Supabase schema)
│   │   ├── utils.ts                 # ✅ REUSE (cn helper)
│   │   └── wilayas.ts              # ✅ REUSE (58 wilayas list)
│   ├── routes/
│   │   ├── __root.tsx               # ✅ EDIT (meta/SEO, fonts, layout wrapper)
│   │   ├── index.tsx                # ❌ REPLACE (1115-line monolith, all PatchNature content)
│   │   └── admin.tsx                # ❌ DELETE (PatchNature admin — user will build their own)
│   ├── router.tsx                   # ✅ REUSE
│   ├── routeTree.gen.ts             # Auto-generated — will regenerate
│   ├── server.ts                    # ✅ REUSE (infra)
│   ├── start.ts                     # ✅ REUSE (infra)
│   └── styles.css                   # ✅ EDIT (re-theme colors + rename tokens)
├── supabase/                        # ❌ DELETE (PatchNature schema)
├── info/                            # ❌ DELETE (PatchNature client docs)
├── frontend-design/                 # ❌ DELETE (PatchNature design docs)
├── .lovable/                        # Can keep or delete — not functional
├── .env.example                     # ✅ EDIT (rename vars)
├── README.md                        # ❌ REPLACE
├── package.json                     # ✅ EDIT (rename project)
├── vite.config.ts                   # ✅ REUSE as-is
├── tsconfig.json                    # ✅ REUSE
├── components.json                  # ✅ REUSE
└── wrangler.jsonc                   # ✅ EDIT (rename app)
```

### 1.3 Reusable Components (Keep as-is)

All 40 shadcn/ui components in `src/components/ui/` are generic and brand-agnostic:
`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`,
`button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`,
`context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`,
`input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`,
`radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`,
`skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`,
`toggle`, `tooltip`.

Also reuse: `hooks/use-mobile.tsx`, `lib/utils.ts`, `lib/wilayas.ts`, `lib/error-capture.ts`, `lib/error-page.ts`, `router.tsx`, `server.ts`, `start.ts`.

### 1.4 Design System (Current → New mapping)

The current CSS uses custom botanical token names. We remap them for GREEN SHADE:

| Current Token | Current Color | New Color | Semantic Role |
|---|---|---|---|
| `--nopal` | `#1F4D33` deep green | `#2D5A3D` sage-forest | Primary brand, headings |
| `--cladode` | `#4C8C5F` medium green | `#6B9F7D` soft sage | Accent, links, icons |
| `--aloe` | `#8FBB9C` light green | `#A8C5B0` pale sage | Subtle highlights |
| `--hydrogel` | `#EAF3EC` pale mint | `#F0F5F1` cream-green tint | Section backgrounds |
| `--linen` | `#FAF8F3` off-white | `#FAFAF7` warm cream | Page background |
| `--encre` | `#1C2620` ink black | `#1A1D1B` near-black | Body text |

> **Note:** Token names (`nopal`, `cladode`, `aloe`, `hydrogel`, `linen`, `encre`) are used
> extensively in utility classes throughout the codebase. We will **rename** them to brand-neutral
> names (`primary-dark`, `primary`, `primary-light`, `surface`, `background`, `ink`) to avoid
> botanical references, but this is a global find-replace that must be done carefully.
>
> **Simpler approach chosen:** Keep the CSS variable names as-is (`--nopal`, etc.) but change
> only their color values. The token names are internal implementation details not visible to users.
> This avoids a massive find-replace across 40+ UI component files. Only rename the comment
> from "PatchNature Botanical Palette" to "GREEN SHADE Palette".

### 1.5 What Must Be Removed (PatchNature-specific)

**Grep keywords to verify full cleanup:**
```
PatchNature, patchnature, patch_nature, patch-nature
hydrogel, cladode (only in content/copy, NOT in CSS token names)
figuier, Barbarie, Opuntia, ficus-indica
cladodes (content), raquette
pharmac, officine, officinal
B2B, grossiste, répartiteur
VELUM, velum (README references)
Innovation développée en Algérie (old tagline)
Soin Végétal, Soin cutané, anti-inflammatoire
contact.patchnature, patchnature2026, patchnature_
```

**Files to DELETE entirely:**
- `src/routes/admin.tsx` (1588 lines — PatchNature admin dashboard)
- `src/lib/inquiries-service.ts` (B2B inquiry CRUD)
- `src/assets/` — ALL files (PatchNature product images)
- `supabase/` — entire directory
- `info/` — entire directory
- `frontend-design/` — entire directory
- `.lovable/` — Lovable project metadata

**Files to REPLACE entirely:**
- `src/routes/index.tsx` (1115-line PatchNature landing → GREEN SHADE home page)
- `src/lib/store-context.tsx` (tied to PatchNature Supabase `settings` table)
- `README.md` (contains VELUM/Lovable references)
- `.env.example`

---

## Section 2 — Target File Tree

```
PatchNature/ → (repo stays, content changes)
├── public/
│   ├── images/
│   │   ├── logo.png                  # CREATE — Green Shade logo
│   │   ├── hero-bg.jpg               # CREATE — placeholder hero background
│   │   ├── product-1.jpg             # CREATE — placeholder product images
│   │   ├── product-2.jpg
│   │   ├── product-3.jpg
│   │   ├── product-4.jpg
│   │   ├── product-5.jpg
│   │   └── product-6.jpg
│   └── favicon.ico                   # CREATE — GS favicon
├── src/
│   ├── assets/                       # DELETE all old files (empty or remove dir)
│   ├── components/
│   │   ├── ui/                       # KEEP all 40 shadcn components unchanged
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # CREATE — site-wide navbar with cart icon
│   │   │   ├── Footer.tsx            # CREATE — site-wide footer
│   │   │   └── FloatingWhatsApp.tsx  # CREATE — floating WhatsApp button on all pages
│   │   ├── cart/
│   │   │   ├── CartDrawer.tsx        # CREATE — cart sheet/drawer
│   │   │   ├── CartItem.tsx          # CREATE — single cart line item
│   │   │   └── CheckoutForm.tsx      # CREATE — checkout form + WhatsApp order recap button + success screen
│   │   └── products/
│   │       ├── ProductCard.tsx       # CREATE — grid card (image + short title + price / "Prix sur demande")
│   │       ├── ProductDetail.tsx     # CREATE — modal/drawer detail view + claims + disabled state if no price
│   │       └── QuantitySelector.tsx  # CREATE — +/- quantity input
│   ├── config/
│   │   └── site.ts                   # CREATE — all brand config in one place
│   ├── data/
│   │   └── products.ts              # CREATE — 6 placeholder products
│   ├── hooks/
│   │   ├── use-mobile.tsx           # KEEP
│   │   └── use-cart.ts              # CREATE — cart logic + localStorage persistence
│   ├── integrations/supabase/       # KEEP (but remove fallback PatchNature keys)
│   │   ├── client.ts               # EDIT — remove patchnature env var names + fallback keys
│   │   ├── client.server.ts        # KEEP
│   │   ├── auth-attacher.ts        # KEEP
│   │   ├── auth-middleware.ts      # KEEP
│   │   ├── previewAuthStorage.ts   # KEEP
│   │   └── types.ts                # EDIT — remove inquiries/settings table types (or leave as placeholder)
│   ├── lib/
│   │   ├── error-capture.ts        # KEEP
│   │   ├── error-page.ts           # KEEP
│   │   ├── order-service.ts        # CREATE — submitOrder() stub
│   │   ├── utils.ts                # KEEP
│   │   └── wilayas.ts              # KEEP
│   ├── routes/
│   │   ├── __root.tsx              # EDIT — meta tags, fonts, layout wrapper (Navbar+Footer)
│   │   ├── index.tsx               # REPLACE — Green Shade home page
│   │   ├── produits.tsx            # CREATE — products page
│   │   └── contact.tsx             # CREATE — contact page
│   ├── router.tsx                  # KEEP
│   ├── routeTree.gen.ts            # AUTO-REGENERATED by TanStack Router
│   ├── server.ts                   # KEEP
│   ├── start.ts                    # KEEP
│   └── styles.css                  # EDIT — re-theme colors, rename comments
├── .env.example                    # EDIT
├── README.md                       # REPLACE
├── package.json                    # EDIT (name field)
├── wrangler.jsonc                  # EDIT (name field)
├── vite.config.ts                  # KEEP
├── tsconfig.json                   # KEEP
├── components.json                 # KEEP
└── PLAN.md                         # THIS FILE
```

### Image Naming Convention (for `/public/images/`)

```
logo.png          — Brand logo (use uploaded Green Shade water texture logo)
favicon.ico       — 32×32 favicon derived from logo
hero-bg.jpg       — Home page hero section background (1920×1080, cosmetics lifestyle)
product-{n}.jpg   — Product photos, n=1..6 (800×800 square, white background)
```

Placeholder strategy: create simple colored SVG rectangles or copy the uploaded logo temporarily. The client will send real product photos later.

---

## Section 3 — Ordered Task List

### Phase A — Cleanup

#### A1. Delete PatchNature-specific directories
- **Files:** `info/` (entire dir), `frontend-design/` (entire dir), `supabase/` (entire dir), `.lovable/` (entire dir)
- **Action:** `rm -rf info/ frontend-design/ supabase/ .lovable/`
- **Acceptance:** Directories no longer exist.

#### A2. Delete old PatchNature assets
- **File:** `src/assets/` — delete ALL files inside (both root and `originals/` subfolder)
- **Action:** Remove all `.png`, `.jpg`, `.jpeg` files. Keep the `src/assets/` directory itself (empty).
- **Acceptance:** `src/assets/` exists but is empty. No import of old images succeeds.

#### A3. Delete PatchNature admin route
- **File:** `src/routes/admin.tsx`
- **Action:** Delete the file entirely.
- **Acceptance:** File gone. Route `/admin` no longer exists.

#### A4. Delete PatchNature inquiries service
- **File:** `src/lib/inquiries-service.ts`
- **Action:** Delete the file entirely.
- **Acceptance:** File gone.

#### A5. Delete PatchNature store context
- **File:** `src/lib/store-context.tsx`
- **Action:** Delete the file entirely (will be replaced in Phase B).
- **Acceptance:** File gone.

#### A6. Clean Supabase client file
- **File:** `src/integrations/supabase/client.ts`
- **Action:** Remove the hardcoded `FALLBACK_SUPABASE_URL` and `FALLBACK_SUPABASE_PUBLISHABLE_KEY` constants (PatchNature's Supabase project). Replace them with empty strings `""`. Remove the lines checking for `patchnature_SUPABASE_URL` and `patchnature_SUPABASE_ANON_KEY` and `patchnature_SUPABASE_PUBLISHABLE_KEY`.
- **Acceptance:** No PatchNature Supabase credentials remain in source code. Client still creates if env vars are set.

#### A7. Stub the Supabase types
- **File:** `src/integrations/supabase/types.ts`
- **Action:** Remove the `inquiries` and `settings` table type definitions from `Database.public.Tables`. Leave the `Tables` object empty (`{}`). Keep the generic helper types (`Tables`, `TablesInsert`, `TablesUpdate`) as they are.
- **Acceptance:** File compiles. No references to `inquiries` or `settings` tables.

#### A8. Verify cleanup with grep
- **Action:** Run the following grep commands from repo root and fix any remaining references:
  ```
  grep -ri "PatchNature" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.json" --include="*.md" -l
  grep -ri "patchnature" --include="*.ts" --include="*.tsx" --include="*.css" -l
  grep -ri "hydrogel" --include="*.ts" --include="*.tsx" -l  (expect ONLY styles.css token)
  grep -ri "cladode" --include="*.ts" --include="*.tsx" -l   (expect ONLY styles.css token)
  grep -ri "figuier\|Barbarie\|Opuntia\|ficus-indica" -rl
  grep -ri "pharmac\|officine\|officinal" -rl
  grep -ri "VELUM\|velum" -rl
  grep -ri "inquir" --include="*.ts" --include="*.tsx" -l
  ```
- **Acceptance:** No hits outside `styles.css` (where token names are kept for compatibility), `PLAN.md` (this file), and `node_modules/`.

**→ Run `npm run build` to verify no broken imports. Fix any errors before proceeding.**

---

### Phase B — Config & Data

#### B1. Create site config
- **File:** `src/config/site.ts` (CREATE)
- **Action:** Export a `siteConfig` object with the following shape:
  ```ts
  export const siteConfig = {
    brandName: "GREEN SHADE",
    headline: "La nature au cœur de votre quotidien",
    tagline: "Simple • Efficace • Garantie",
    description: "GREEN SHADE — Soins naturels pour visage et corps. Cosmétiques naturels, simples et efficaces.",
    logoPath: "/images/logo.png",
    faviconPath: "/favicon.ico",

    contact: {
      email: "greenshadecontact@gmail.com",
      whatsapp: "0558675386",               // raw digits for wa.me link
      whatsappDisplay: "0558 67 53 86",     // formatted for display
      phone: "0558675386",                  // same as WhatsApp for now
      phoneDisplay: "0558 67 53 86",
    },

    social: {
      instagram: {
        handle: "green_shade_2026",
        url: "https://instagram.com/green_shade_2026",
      },
      tiktok: {
        handle: "green_shade_2024",
        url: "https://tiktok.com/@green_shade_2024",
      },
      facebook: {
        handle: "", // placeholder — client will provide
        url: "",    // placeholder
      },
    },

    /** Generates a WhatsApp wa.me URL with optional pre-filled message */
    whatsappUrl: (message?: string): string => {
      const base = "https://wa.me/213558675386"; // +213 prefix, drop leading 0
      return message ? `${base}?text=${encodeURIComponent(message)}` : base;
    },

    expo: {
      name: "Cosmenex Expo",
      city: "Sétif",
      dates: "28 — 31 Octobre 2026",
      tagline: "Retrouvez-nous au Cosmenex Expo de Sétif !",
    },

    delivery: {
      fee: 0,
      feeLabel: "À confirmer",
      method: "Paiement à la livraison",
    },

    currency: {
      code: "DZD",
      symbol: "DA",
      locale: "fr-DZ",
      /** Format a number as "1 500 DA". Returns "Prix sur demande" if amount is null/0. */
      format: (amount: number | null): string => {
        if (!amount) return "Prix sur demande";
        return `${amount.toLocaleString("fr-FR")} DA`;
      },
    },

    meta: {
      title: "GREEN SHADE — Cosmétiques Naturels",
      ogImage: "/images/logo.png",
    },
  } as const;
  ```
- **Acceptance:** File imports cleanly. All brand strings are in one place. No PatchNature references.

#### B2. Create product data
- **File:** `src/data/products.ts` (CREATE)
- **Action:** Export a `Product` type and a `products` array.
  The main range is natural deodorants (sans alcool, sans sels d'aluminium, jusqu'à 72h de protection, convient à tous types de peau, ne tache pas les vêtements, plusieurs fragrances).
  The data model must support `price: number | null` (where `null` triggers "Prix sur demande" and disables add-to-cart) and allows multiple product categories (e.g. deodorants and skincare):
  ```ts
  export type ProductCategory = "deodorant" | "soin-visage" | "soin-corps" | string;

  export type Product = {
    id: string;
    slug: string;
    name: string;
    shortTitle: string;
    category?: ProductCategory;
    price: number | null; // in DZD — if null, UI displays "Prix sur demande" and disables ordering
    image: string;        // strictly local path in /public/images/ — NEVER external URL
    description: string;
    usage: string;        // mode d'emploi
    features?: string[];  // claims: sans alcool, sans sels d'aluminium, etc.
  };

  export const DEODORANT_FEATURES = [
    "Sans alcool",
    "Sans sels d'aluminium",
    "Protection jusqu'à 72h",
    "Convient à tous types de peau",
    "Ne tache pas les vêtements",
  ];

  export const products: Product[] = [
    {
      id: "gs-001",
      slug: "deodorant-peach",
      name: "Déodorant Naturel — Peach",
      shortTitle: "Peach",
      category: "deodorant",
      price: 1200,
      image: "/images/product-1.jpg",
      description: "Déodorant naturel efficace aux notes gourmandes de pêche. Formule respectueuse de la peau sans compromis sur l'efficacité.",
      usage: "Appliquer quotidiennement sur des aisselles propres et sèches.",
      features: DEODORANT_FEATURES,
    },
    {
      id: "gs-002",
      slug: "deodorant-musc-grenade",
      name: "Déodorant Naturel — Musc Grenade",
      shortTitle: "Musc Grenade",
      category: "deodorant",
      price: 1200,
      image: "/images/product-2.jpg",
      description: "Déodorant naturel aux notes raffinées de musc et grenade. Protection longue durée et fraîcheur subtile.",
      usage: "Appliquer quotidiennement sur des aisselles propres et sèches.",
      features: DEODORANT_FEATURES,
    },
    {
      id: "gs-003",
      slug: "deodorant-fleur-de-coton",
      name: "Déodorant Naturel — Fleur de Coton",
      shortTitle: "Fleur de Coton",
      category: "deodorant",
      price: 1200,
      image: "/images/product-3.jpg",
      description: "PLACEHOLDER — Déodorant naturel au parfum doux et réconfortant de fleur de coton.",
      usage: "Appliquer sur une peau propre et sèche.",
      features: DEODORANT_FEATURES,
    },
    {
      id: "gs-004",
      slug: "deodorant-vanille-douce",
      name: "Déodorant Naturel — Vanille Douce",
      shortTitle: "Vanille Douce",
      category: "deodorant",
      price: 1200,
      image: "/images/product-4.jpg",
      description: "PLACEHOLDER — Déodorant naturel aux notes chaleureuses de vanille.",
      usage: "Appliquer sur une peau propre et sèche.",
      features: DEODORANT_FEATURES,
    },
    {
      id: "gs-005",
      slug: "deodorant-zeste-naturel",
      name: "Déodorant Naturel — Zeste Frais",
      shortTitle: "Zeste Frais",
      category: "deodorant",
      price: null, // DEMO: Missing price -> "Prix sur demande" & button disabled
      image: "/images/product-5.jpg",
      description: "PLACEHOLDER — Déodorant naturel ultra-frais aux extraits d'agrumes.",
      usage: "Appliquer sur une peau propre et sèche.",
      features: DEODORANT_FEATURES,
    },
    {
      id: "gs-006",
      slug: "creme-anti-age-soin",
      name: "Soin Anti-Âge Régénérant",
      shortTitle: "Soin Anti-Âge",
      category: "soin-visage",
      price: 2500, // Demonstrates a different product line in the same catalog
      image: "/images/product-6.jpg",
      description: "PLACEHOLDER — Crème anti-âge naturelle pour visage. Hydrate, nourrit et lisse la peau.",
      usage: "Appliquer matin et soir sur le visage et le cou nettoyés.",
      features: ["Soin naturel visage", "Hydratation profonde", "Tous types de peau"],
    },
  ];
  ```
- **Acceptance:** 6 products seeded with deodorants ("Peach", "Musc Grenade", etc.) and a skincare product. Supports `price: null` which triggers "Prix sur demande".

#### B3. Create placeholder product images (LOCAL FILES ONLY — NO HOTLINKING)
- **Dir:** `public/images/` (CREATE directory)
- **Constraint:** Strictly NO external hotlinking (no Unsplash, no Imgur, etc.). All assets MUST be local files under `/public/images/`.
- **Action:** Create 6 simple placeholder images locally. Create simple SVG/PNG placeholder files `product-1.jpg` through `product-6.jpg` in `public/images/`. Also copy the user-uploaded Green Shade logo to `public/images/logo.png`.
- **The uploaded logo is at:** `C:/Users/PC/.gemini/antigravity/brain/1ce9dfc9-055b-4340-b619-534adce6a3b2/.user_uploaded/media_1792687014409_6a02bd14.jpg`
- **Also create:** `public/favicon.ico` — local 32×32 favicon file.
- **Acceptance:** All 8 image paths referenced in `products.ts` and `site.ts` resolve to local files in `/public/images/`. Zero external image URLs.

#### B4. Create order service with submitOrder stub
- **File:** `src/lib/order-service.ts` (CREATE)
- **Action:** Create the following:
  ```ts
  // Order JSON shape
  export type OrderItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  };

  export type Order = {
    id: string;               // generated UUID
    date: string;             // ISO 8601
    customer: {
      fullName: string;
      phone: string;
      wilaya: string;
      address: string | null; // optional notes/address
    };
    items: OrderItem[];
    subtotal: number;         // sum of items subtotals
    delivery: number;         // delivery fee
    total: number;            // subtotal + delivery
    status: "pending";
  };

  const ORDERS_STORAGE_KEY = "greenshade_orders";

  function generateOrderId(): string {
    return `GS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  /**
   * Submit a new order.
   *
   * TODO: >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
   * Replace the localStorage simulation below with a real API call:
   *   - POST to your backend/Supabase endpoint
   *   - Send the `order` object as JSON body
   *   - Handle errors and return the created order
   * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
   */
  export async function submitOrder(
    orderData: Omit<Order, "id" | "date" | "status">
  ): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: generateOrderId(),
      date: new Date().toISOString(),
      status: "pending",
    };

    // --- SIMULATION: store in localStorage ---
    try {
      const existing = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || "[]");
      existing.unshift(order);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing.slice(0, 200)));
    } catch (e) {
      console.warn("localStorage save failed:", e);
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return order;
  }
  ```
- **Acceptance:** `submitOrder` is a single exported function. TODO marker is clearly visible. Order type matches the spec. File has zero PatchNature references.

#### B5. Create cart hook
- **File:** `src/hooks/use-cart.ts` (CREATE)
- **Action:** Create a React Context + hook for cart state with localStorage persistence:
  ```ts
  // Types
  export type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };

  // Context provides:
  interface CartContextValue {
    items: CartItem[];
    itemCount: number;           // total quantity across all items
    subtotal: number;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
  }
  ```
  - Persist `items` array to `localStorage` key `"greenshade_cart"`.
  - On mount, hydrate from localStorage.
  - Provide `CartProvider` component to wrap the app.
  - Export `useCart()` hook.
- **Acceptance:** Cart persists across page refresh. Adding same product increments quantity. Removing last quantity removes item. `itemCount` sums all quantities.

#### B6. Replace README.md
- **File:** `README.md` (REPLACE)
- **Action:** Write a minimal README:
  ```md
  # GREEN SHADE — Natural Cosmetics

  Temporary e-commerce website for GREEN SHADE, a natural cosmetics brand.

  ## Development
  ```sh
  npm install
  npm run dev
  ```

  ## Deploy
  Configured for Vercel deployment via `vite.config.ts` (nitro preset: "vercel").
  ```
- **Acceptance:** No PatchNature/VELUM references.

#### B7. Update package.json & wrangler.jsonc
- **File:** `package.json` — change `"name"` from `"tanstack_start_ts"` to `"greenshade-website"`.
- **File:** `wrangler.jsonc` — change `"name"` from `"tanstack-start-app"` to `"greenshade-website"`.
- **Acceptance:** Both files updated.

#### B8. Update .env.example
- **File:** `.env.example` (EDIT)
- **Action:** Replace content:
  ```env
  # GREEN SHADE — Environment Variables
  # Supabase (optional — only needed if you connect a real backend later)
  VITE_SUPABASE_URL=https://your-project-id.supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
  ```
- **Acceptance:** No PatchNature references.

**→ Run `npm run build` to verify compilation. Fix any errors before proceeding.**

---

### Phase C — Layout: Navbar + Footer + Root

#### C1. Re-theme styles.css
- **File:** `src/styles.css` (EDIT)
- **Action:**
  1. Change the top comment from `/* PatchNature Design System */` to `/* GREEN SHADE Design System */`.
  2. Change the palette comment from `/* PatchNature brand colors */` to `/* GREEN SHADE brand colors */`.
  3. Change the `/* PatchNature Botanical Palette */` comment to `/* GREEN SHADE Palette */`.
  4. Update color values:
     ```css
     --nopal: #2D5A3D;         /* Sage forest green (primary dark) */
     --cladode: #6B9F7D;       /* Soft sage (primary accent) */
     --aloe: #A8C5B0;          /* Pale sage (light accent) */
     --hydrogel: #F0F5F1;      /* Cream-green tint (surfaces) */
     --linen: #FAFAF7;         /* Warm cream (background) */
     --encre: #1A1D1B;         /* Near-black (body text) */
     ```
  5. Keep all utility classes, button styles, shadows, and animations as-is (they reference the CSS variables, so they auto-update).
  6. Consider changing the Google Fonts. The current Fraunces + Work Sans pairing is elegant enough for cosmetics. **Keep them.** (The Green Shade logo uses a decorative serif which Fraunces approximates well.)
- **Acceptance:** Colors are updated. All existing Tailwind classes using `text-nopal`, `bg-hydrogel` etc. automatically get new colors. Build passes.

#### C2. Create Navbar component
- **File:** `src/components/layout/Navbar.tsx` (CREATE)
- **Action:** Build a responsive sticky navbar with:
  - Left: Logo image + "GREEN SHADE" brand name (from `siteConfig`)
  - Center (desktop): Links: "Accueil" (`/`), "Nos Produits" (`/produits`), "Contact" (`/contact`)
  - Right: Cart icon (ShoppingBag from lucide) with a badge showing `itemCount` from `useCart()`
  - Clicking the cart icon opens the CartDrawer (Phase F)
  - Mobile: hamburger menu with same links
  - Use the `Sheet` component from shadcn/ui for the mobile menu
  - Props: `onOpenCart: () => void` (called when cart icon is clicked)
  - Reuse existing header styling patterns from old `index.tsx` (sticky, backdrop-blur, border-b)
- **Types/Props:**
  ```ts
  interface NavbarProps {
    onOpenCart: () => void;
    cartItemCount: number;
  }
  ```
- **Acceptance:** Navbar shows on all pages. Cart badge shows correct count. Mobile menu works. Links navigate correctly using TanStack Router `<Link>`.

#### C3. Create Footer component
- **File:** `src/components/layout/Footer.tsx` (CREATE)
- **Action:** Build a footer with:
  - Logo + brand name + tagline
  - Quick links: Accueil, Produits, Contact
  - Social links (Instagram, email) from `siteConfig`
  - Copyright: `© 2026 GREEN SHADE. Tous droits réservés.`
  - Developer credit preserved: `Développé avec soin par إلياس بدر الدين` with link to `https://ilyas-portfolio.carrd.co/`
  - Dark background (bg-nopal), light text
- **Acceptance:** Footer renders. Social links point to correct URLs. Developer credit present.

#### C4. Update __root.tsx
- **File:** `src/routes/__root.tsx` (EDIT)
- **Action:**
  1. Remove import of `StoreProvider` from `@/lib/store-context` (deleted).
  2. Import `CartProvider` from `@/hooks/use-cart`.
  3. Import `Navbar` and `Footer` from new layout components.
  4. Import `FloatingWhatsApp` from `@/components/layout/FloatingWhatsApp`.
  5. Import `CartDrawer` from `@/components/cart/CartDrawer` (will exist after Phase F — use a placeholder/empty component for now, or create a minimal stub).
  6. Update all `meta` tags:
     - `title`: `"GREEN SHADE — Cosmétiques Naturels | Simple • Efficace • Garantie"`
     - `description`: `"GREEN SHADE — La nature au cœur de votre quotidien. Soins naturels pour visage et corps : déodorants naturels sans alcool ni sels d'aluminium, efficacité garantie. Disponible en Algérie."`
     - `og:title`, `twitter:title`: `"GREEN SHADE — Cosmétiques Naturels"`
     - `og:description`, `twitter:description`: same as description
     - `og:image`, `twitter:image`: `"/images/logo.png"`
  7. Keep Google Fonts links (Fraunces + Work Sans).
  8. In `RootComponent`, wrap `<Outlet />` with:
     ```tsx
     <CartProvider>
       <Navbar onOpenCart={...} cartItemCount={...} />
       <Outlet />
       <FloatingWhatsApp />
       <Footer />
       <CartDrawer open={...} onClose={...} />
       <Toaster ... />
     </CartProvider>
     ```
     Manage cart drawer open/close state here with `useState`.
  9. Remove `StoreProvider` wrapper entirely.
  10. Update `NotFoundComponent` — remove `font-fraunces text-nopal` if desired, or keep (it auto-recolors).
  11. The `font-fraunces` and `text-nopal` classes will automatically use new colors from C1.
- **Acceptance:** Page loads with new meta tags. Navbar, Footer, and Floating WhatsApp button appear on all routes. Cart drawer can be opened. No StoreProvider errors.

#### C5. Create FloatingWhatsApp component
- **File:** `src/components/layout/FloatingWhatsApp.tsx` (CREATE)
- **Action:** Floating button anchored at the bottom-right (or bottom-left on mobile so it doesn't obstruct other controls, or bottom-right with z-40):
  - WhatsApp green circle icon with subtle pulse/shadow
  - Click opens `siteConfig.whatsappUrl("Bonjour GREEN SHADE, je souhaite des renseignements sur vos produits.")` in a new tab (`target="_blank"` with `rel="noopener noreferrer"`)
  - Tooltip or small badge on hover: "Discuter sur WhatsApp"
  - Respects responsive layouts (high z-index, but below modal drawers)
- **Acceptance:** Visible on every page. Clicking opens WhatsApp chat with phone number `213558675386`.

**→ Run `npm run build` to verify. Fix any errors before proceeding.**

---

### Phase D — Home Page

#### D1. Create Home page
- **File:** `src/routes/index.tsx` (REPLACE entire content)
- **Action:** Create a new home page with these sections:
  1. **Hero Section:**
     - Full-width with subtle background styling (local image or soft gradient)
     - Logo & Brand name "GREEN SHADE" (font-fraunces)
     - Headline: "La nature au cœur de votre quotidien"
     - Tagline: "Simple • Efficace • Garantie"
     - Short intro focused strictly on approved claims: "Soins naturels pour visage et corps. Découvrez notre gamme de déodorants naturels formulés sans alcool et sans sels d'aluminium, offrant jusqu'à 72h de protection tout en respectant votre peau."
     - STRICT INSTRUCTION: Do not invent claims beyond those specified by the client!
     - Primary CTA button: "Découvrir nos produits →" → links to `/produits`
     - Social & contact links row: WhatsApp (0558 67 53 86), Instagram (@green_shade_2026), TikTok (@green_shade_2024), Email (greenshadecontact@gmail.com)

  2. **Expo Banner:**
     - Prominent banner/strip right below hero or sticky banner:
     - Text: "📍 Retrouvez-nous au Salon Cosmenex Expo — Sétif, du 28 au 31 Octobre 2026 !"
     - Styled in `bg-nopal text-white` or emerald tone with clean typography.

  3. **Core Brand Values / Key Highlights Section:**
     - 4 benefit cards displaying strictly verified claims:
       1. "Sans alcool ni sels d'aluminium" — Respect total de l'équilibre cutané
       2. "Protection jusqu'à 72h" — Efficacité longue durée au quotidien
       3. "Tous types de peau" — Formules douces, adaptées aux peaux sensibles
       4. "Ne tache pas les vêtements" — Application propre, fini invisible
     - Secondary CTA button to view all fragrances on `/produits`.

  Keep it clean, elegant, premium cosmetics feel, and mobile-first. Use existing Tailwind utility patterns (`font-fraunces`, `text-nopal`, `btn-cta`, etc.).

- **Route definition:**
  ```ts
  import { createFileRoute } from "@tanstack/react-router";
  export const Route = createFileRoute("/")(/* ... */);
  ```
- **Acceptance:** Home page renders at `/`. Has headline, tagline, verified claims only, CTA to products, expo banner, verified social links. Zero PatchNature remnants.

---

### Phase E — Products Page + Detail

#### E1. Create QuantitySelector component
- **File:** `src/components/products/QuantitySelector.tsx` (CREATE)
- **Props:**
  ```ts
  interface QuantitySelectorProps {
    value: number;
    onChange: (newValue: number) => void;
    min?: number;  // default 1
    max?: number;  // default 99
  }
  ```
- **Action:** A row with a `−` button, a display of the current number, and a `+` button. Use shadcn `Button` component (variant outline, size icon). Disable `−` when at min, `+` when at max.
- **Acceptance:** Renders. Buttons increment/decrement. Respects min/max. Value is controlled.

#### E2. Create ProductCard component
- **File:** `src/components/products/ProductCard.tsx` (CREATE)
- **Props:**
  ```ts
  interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
  }
  ```
- **Action:** Card showing:
  - Product image (aspect-ratio square, object-cover, rounded — strictly from `/public/images/`)
  - Short title below image (centered, font-semibold)
  - Price: formatted with `siteConfig.currency.format(product.price)`.
    - IF `product.price === null`: display "Prix sur demande" in an elegant badge.
  - Entire card is clickable (calls `onClick`)
  - Hover: subtle border-color change or shadow lift
  - Use shadcn `Card` or plain div with Tailwind classes
- **Acceptance:** Card renders product info. Click fires callback. Missing price shows "Prix sur demande".

#### E3. Create ProductDetail component
- **File:** `src/components/products/ProductDetail.tsx` (CREATE)
- **Props:**
  ```ts
  interface ProductDetailProps {
    product: Product | null;
    open: boolean;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
  }
  ```
- **Action:** Use shadcn `Sheet` (drawer) or `Dialog` (modal):
  - Product image (large, local image)
  - Full name (`product.name`)
  - Price formatted (`siteConfig.currency.format(product.price)`). If `price === null`, display "Prix sur demande".
  - Features pills / badges (e.g. "Sans alcool", "Sans sels d'aluminium", "Protection 72h", etc. — strictly client-approved claims, no invented claims)
  - Description paragraph
  - "Mode d'emploi" section (with a subheading)
  - When `product.price !== null`:
    - `QuantitySelector` starting at 1
    - "Ajouter au panier" button (btn-cta, full width)
    - On add: call `onAddToCart(product, quantity)`, show toast "Produit ajouté au panier ✓", close drawer
  - When `product.price === null`:
    - Disable or omit `QuantitySelector`
    - "Ajouter au panier" is DISABLED or replaced by a direct WhatsApp inquiry button:
      "Demander le prix sur WhatsApp" linking to `siteConfig.whatsappUrl("Bonjour, je souhaite connaître le prix de : " + product.name)`.
- **Acceptance:** Opens when `open=true`. Shows all product info and feature badges. If price missing, add-to-cart is disabled and "Prix sur demande" is displayed.

#### E4. Create Products page
- **File:** `src/routes/produits.tsx` (CREATE)
- **Route:** `/produits`
- **Action:**
  - Import `products` from `@/data/products`
  - Page title section: "Nos Produits" heading + tagline "La nature au cœur de votre quotidien"
  - Responsive grid: `grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6`
  - Render `ProductCard` for each product
  - State: `selectedProduct` (Product | null) + `detailOpen` boolean
  - Clicking a card sets `selectedProduct` and opens `ProductDetail` drawer
  - `ProductDetail.onAddToCart` calls `useCart().addItem()` and shows a toast
  ```ts
  import { createFileRoute } from "@tanstack/react-router";
  export const Route = createFileRoute("/produits")(/* ... */);
  ```
- **Acceptance:** Page renders at `/produits`. Grid shows all seeded products. Clicking opens detail. Products with null price disable order button. Cart badge in navbar updates on add.

**→ Run `npm run build` to verify. Fix any errors before proceeding.**

---

### Phase F — Cart + Checkout + submitOrder

#### F1. Create CartItem component
- **File:** `src/components/cart/CartItem.tsx` (CREATE)
- **Props:**
  ```ts
  interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onRemove: (productId: string) => void;
  }
  ```
- **Action:** Single row with:
  - Small product image (48×48, rounded)
  - Product name
  - Price formatted per unit
  - QuantitySelector (inline, compact)
  - Remove button (Trash2 icon)
  - Line subtotal: `siteConfig.currency.format(item.price * item.quantity)`
- **Acceptance:** Renders all item info. Quantity changes update. Remove deletes from cart.

#### F2. Create CheckoutForm component
- **File:** `src/components/cart/CheckoutForm.tsx` (CREATE)
- **Props:**
  ```ts
  interface CheckoutFormProps {
    items: CartItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    onOrderSuccess: (order: Order) => void;
    onBack: () => void;
  }
  ```
- **Action:**
  - Form fields:
    - `Nom complet *` — text input, required
    - `Téléphone *` — tel input, required, Algerian format validation regex: `/^(?:(?:\+|00)213|0)[567][0-9]{8}$/`
    - `Wilaya *` — select dropdown using `WILAYAS` from `@/lib/wilayas`
    - `Adresse / notes` — textarea, optional
  - Order recap section: list items with quantities, subtotal, delivery fee, total
  - "Confirmer la commande" button (btn-cta)
  - On submit:
    1. Validate fields (show toast errors in French)
    2. Call `submitOrder()` from `@/lib/order-service` (this remains the PRIMARY order submission flow)
    3. On success: call `onOrderSuccess(order)`
  - **Success screen** (shown after `onOrderSuccess`):
    - Checkmark icon in green circle
    - "Commande confirmée !" heading
    - Order ID displayed (e.g. `#GS-M123-X9Y`)
    - Message: "Merci pour votre commande. Votre commande a été enregistrée avec succès. Paiement à la livraison."
    - **Optional WhatsApp confirmation button:**
      - Clear green button: "Envoyer ma commande sur WhatsApp" (with WhatsApp icon)
      - Clicking opens WhatsApp link via `siteConfig.whatsappUrl(orderSummaryText)`
      - `orderSummaryText` format:
        ```
        Bonjour GREEN SHADE, je viens de passer la commande N° {order.id} :
        - Nom : {customer.fullName}
        - Téléphone : {customer.phone}
        - Wilaya : {customer.wilaya}
        - Articles : {items list}
        - Total : {total} DA
        ```
    - "Retour à l'accueil" button → navigates to `/`
- **Acceptance:** Form validates Algerian phone format. Wilaya select works. Order stores in localStorage. Success screen shows order ID AND optional WhatsApp recap button.

#### F3. Create CartDrawer component
- **File:** `src/components/cart/CartDrawer.tsx` (CREATE)
- **Props:**
  ```ts
  interface CartDrawerProps {
    open: boolean;
    onClose: () => void;
  }
  ```
- **Action:** Use shadcn `Sheet` (side="right"):
  - **Cart view (default):**
    - Header: "Votre panier" + item count
    - List of `CartItem` components
    - Empty state: "Votre panier est vide" with link to `/produits`
    - Subtotal line
    - Delivery fee line: `siteConfig.delivery.feeLabel` or formatted fee
    - Total line (bold)
    - "Confirmer la commande" button → switches to checkout view
  - **Checkout view:**
    - Render `CheckoutForm`
    - Back button to return to cart view
  - **Success view:**
    - Shown after successful order
    - Clear cart via `useCart().clearCart()`
  - State machine: `"cart" | "checkout" | "success"`
- **Acceptance:** Drawer opens from right. Shows items with correct totals. Quantity +/- works. Checkout form validates. Order saves to localStorage. Success screen shows with optional WhatsApp button. Cart clears. Drawer can be closed at any point.

#### F4. Wire CartDrawer into __root.tsx
- **File:** `src/routes/__root.tsx` (EDIT — update the stub from C4)
- **Action:** Replace the CartDrawer stub with the real import. Ensure the cart drawer open state is managed in RootComponent and passed to both Navbar (open trigger) and CartDrawer.
- **Acceptance:** Cart icon in navbar opens drawer. Full flow works: browse → add → open cart → checkout → success.

**→ Run `npm run build` to verify. Fix any errors before proceeding.**

---

### Phase G — Contact Page

#### G1. Create Contact page
- **File:** `src/routes/contact.tsx` (CREATE)
- **Route:** `/contact`
- **Action:**
  - Page title: "Contactez-nous"
  - Tagline: "La nature au cœur de votre quotidien"
  - Contact info cards (clean, modern grid with lucide icons):
    - **WhatsApp card:** "WhatsApp : 0558 67 53 86" → direct link to `siteConfig.whatsappUrl()`
    - **Instagram card:** "Instagram : @green_shade_2026" → external link `https://instagram.com/green_shade_2026`
    - **TikTok card:** "TikTok : @green_shade_2024" → external link `https://tiktok.com/@green_shade_2024`
    - **Email card:** "Email : greenshadecontact@gmail.com" → mailto link
  - **Expo banner card:**
    - "Retrouvez-nous au Salon Cosmenex Expo — Sétif (28 — 31 Octobre 2026)"
  - Simple contact form:
    - Nom * (text)
    - Email (email, optional)
    - Téléphone (tel, optional)
    - Message * (textarea)
    - Submit button: "Envoyer le message"
    - On submit: show success toast "Votre message a été envoyé avec succès !" and clear fields
    - Add clearly marked `// TODO: connect contact form to backend endpoint` comment
- **Acceptance:** Page renders at `/contact`. Contact info matches WhatsApp, Instagram, TikTok, and Email specifications. Form submits with feedback. Zero PatchNature remnants.

**→ Run `npm run build` to verify. Fix any errors before proceeding.**

---

### Phase H — Responsive QA & Polish

#### H1. Mobile responsiveness pass
- **Action:** Test every page at 375px, 768px, 1024px, 1440px widths:
  - Home: hero text wraps, CTA button full-width on mobile, expo banner readable
  - Products: grid is 2-col on mobile, 3-col on tablet+
  - Product detail drawer: full-width on mobile
  - Cart drawer: full-width on mobile, scrollable if many items
  - Checkout form: single-column on mobile
  - Contact: cards stack vertically on mobile
  - Navbar: hamburger on mobile, horizontal links on desktop
  - Footer: stacks vertically on mobile
- **Acceptance:** No horizontal overflow. No text cut off. All interactive elements are tappable (min 44px touch targets).

#### H2. Cart edge cases
- **Action:** Test:
  - Empty cart: "Votre panier est vide" message, no checkout button
  - Add item, refresh page: cart persists
  - Add same item twice: quantity increments (doesn't duplicate)
  - Remove all items: cart shows empty state
  - Quantity selector: respects min=1, can go up to 99
  - Very long product names: text truncates or wraps gracefully
- **Acceptance:** All edge cases handled.

#### H3. Form validation
- **Action:** Test:
  - Checkout: submit with empty fields → toast error
  - Phone: `"12345"` → error, `"0555123456"` → pass, `"+213555123456"` → pass
  - Wilaya: must be selected
  - Contact form: submit with empty name/message → error
- **Acceptance:** All validation works with French error messages.

#### H4. Final brand cleanup verification
- **Action:** Run all grep commands from A8 again. Also:
  - Check browser tab title shows "GREEN SHADE"
  - Check `<html lang="fr">` is set
  - Check no old PatchNature images remain in DOM
  - View-source the page and search for "PatchNature" / "patchnature"
- **Acceptance:** Zero PatchNature references in the rendered output or source code (except PLAN.md and CSS token variable names which are internal).

**→ Run `npm run build` to verify final build passes.**

---

### Phase I — Deploy to Vercel

#### I1. Prepare for deployment
- **Action:**
  1. Verify `vite.config.ts` has `nitro: { preset: "vercel" }` (already set).
  2. Verify `.env.example` is clean.
  3. Ensure `.gitignore` includes `node_modules/`, `.env`, `dist/`, `.vercel/`.
  4. Create a production `.env` with Supabase vars set to empty strings (or omit — app works without Supabase now since we removed the settings dependency).
  5. Run `npm run build` one final time — must succeed with zero errors.
  6. Commit all changes.
- **Acceptance:** Build succeeds. Git status is clean. Ready to push.

#### I2. Deploy
- **Action:** Push to GitHub and connect to Vercel, OR run `npx vercel` from the repo root.
- **Acceptance:** Site is live. All 3 pages load. Cart works. Checkout works.

---

## Section 4 — Final QA Checklist

- [ ] **Mobile:** All pages render correctly at 375px width, no horizontal scroll
- [ ] **Floating WhatsApp:** Green WhatsApp icon visible on all pages; opens chat with `0558 67 53 86`
- [ ] **WhatsApp order button:** Success screen features optional button opening WhatsApp with pre-filled order summary
- [ ] **Missing price behavior:** Any product with `price: null` shows "Prix sur demande" and has add-to-cart disabled
- [ ] **Local assets only:** Zero external hotlinked images; all images load from `/public/images/`
- [ ] **Strict brand copy:** Contains only client-verified claims (sans alcool, sans sels d'aluminium, protection jusqu'à 72h, tous types de peau, ne tache pas les vêtements, fragrances naturelles)
- [ ] **Empty cart:** Shows "Votre panier est vide" with link to products
- [ ] **Cart persistence:** Add items → close browser → reopen → items still there
- [ ] **Add to cart flow:** Add product → toast confirmation → stay on products page → cart badge updates
- [ ] **Checkout validation:** Empty fields rejected, invalid phone rejected (Algerian format), wilaya required
- [ ] **Order submission:** Creates order in localStorage with correct JSON shape (id, date, customer, items, subtotal, delivery, total, status="pending")
- [ ] **Success screen:** Shows order ID, thank-you message, optional WhatsApp recap button, return-to-home button
- [ ] **Cart clears after order:** Cart is empty after successful checkout
- [ ] **Contact form:** Validates required fields, shows success toast
- [ ] **Social & contact links:** WhatsApp (0558 67 53 86), Instagram (`instagram.com/green_shade_2026`), TikTok (`@green_shade_2024`), email (`greenshadecontact@gmail.com`)
- [ ] **Expo banner:** Visible on home page with "Cosmenex Expo — Sétif, 28-31 Octobre 2026"
- [ ] **No old brand:** Zero occurrences of "PatchNature", "hydrogel" (in content), "figuier", "Barbarie", "pharmacie", "officine", "VELUM" in rendered output
- [ ] **SEO:** Browser tab title is "GREEN SHADE — Cosmétiques Naturels", meta description is correct
- [ ] **Favicon:** Shows local favicon
- [ ] **Build:** `npm run build` passes with zero errors
- [ ] **Navigation:** All links work (/, /produits, /contact), 404 page works for invalid routes
- [ ] **Developer credit:** Footer contains `إلياس بدر الدين` credit link

---

## Rules for the Coding Agent

1. **Execute tasks in order** (A1 → A2 → ... → I2). Do not skip ahead.
2. **One task at a time.** Complete each task, verify acceptance criteria, then move to the next.
3. **Do not refactor** files outside the scope of the current task.
4. **Do not add new npm packages** without explicit approval. The existing stack (shadcn/ui, lucide-react, sonner, TanStack Router, etc.) has everything needed.
5. **Run `npm run build`** after completing each phase (A, B, C, D, E, F, G, H). Fix all errors before moving to the next phase.
6. **All UI text must be in French.** Prices in DZD formatted as "1 500 DA". If price is null/0, display "Prix sur demande" and disable order actions.
7. **Use existing patterns.** Copy styling patterns (class names, spacing, layout grids) from the old `index.tsx` — they're well-designed. Just change the content.
8. **Keep CSS variable names** (`--nopal`, `--cladode`, etc.) unchanged in `styles.css`. Only change their color values.
9. **Import from `@/...`** using the path alias, not relative paths.
10. **Preserve all existing comments** in files you're editing (unless they reference PatchNature content that must go).
11. **Use TanStack Router's `<Link>` component** for internal navigation, never `<a href>`.
12. **Use the `toast` from sonner** for all user notifications.
13. **Strictly NO external hotlinked images.** All images must reside locally in `/public/images/`.
14. **Do not invent any claims** beyond the client-provided specifications: "La nature au cœur de votre quotidien", "Simple • Efficace • Garantie", and the approved deodorant characteristics (sans alcool, sans sels d'aluminium, jusqu'à 72h de protection, convient à tous types de peau, ne tache pas les vêtements, plusieurs fragrances).
15. **Primary order flow is `submitOrder()`** in `src/lib/order-service.ts`. The WhatsApp button on the checkout success screen is strictly an optional convenience for the customer.
