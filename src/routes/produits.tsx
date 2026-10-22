import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { products, type Product } from "@/data/products";
import { siteConfig } from "@/config/site";
import { useCart } from "@/hooks/use-cart";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductDetail } from "@/components/products/ProductDetail";

export const Route = createFileRoute("/produits")({
  component: ProductsPage,
});

function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { addItem } = useCart();

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem(product, quantity);
    toast.success(`${product.shortTitle || product.name} ajouté au panier (${quantity}) ✓`);
  };

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-linen flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hydrogel border border-aloe/60 text-nopal text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cladode" />
            <span>Catalogue Officiel</span>
          </div>
          <h1 className="font-fraunces text-3xl sm:text-5xl font-bold text-nopal mb-4">
            Nos Soins & Déodorants Naturels
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Formulés avec soin, sans alcool et sans sels d'aluminium pour une protection durable et respectueuse de votre peau.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Product Detail Modal/Drawer */}
        <ProductDetail
          product={selectedProduct}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
