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
    phone: "0558675386",
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
      handle: "",
      url: "",
    },
  },

  /** Generates a WhatsApp wa.me URL with optional pre-filled message */
  whatsappUrl: (message?: string): string => {
    const base = "https://wa.me/213558675386"; // +213 prefix, without leading 0
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
    format: (amount: number | null | undefined): string => {
      if (amount == null || amount <= 0) return "Prix sur demande";
      return `${amount.toLocaleString("fr-FR")} DA`;
    },
  },

  meta: {
    title: "GREEN SHADE — Cosmétiques Naturels",
    ogImage: "/images/logo.png",
  },
} as const;
