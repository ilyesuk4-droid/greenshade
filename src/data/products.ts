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
