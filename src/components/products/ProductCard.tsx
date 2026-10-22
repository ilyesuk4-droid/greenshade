import type { Product } from "@/data/products";
import { siteConfig } from "@/config/site";

export interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isPriceMissing = product.price == null || product.price <= 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(product);
        }
      }}
      className="bg-white rounded-2xl overflow-hidden border border-border/80 shadow-sm hover:shadow-nature hover:border-cladode/50 transition-all cursor-pointer flex flex-col group text-left focus:outline-none focus:ring-2 focus:ring-cladode"
    >
      {/* Square Aspect Ratio Image */}
      <div className="aspect-square bg-linen/50 overflow-hidden relative">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Price or "Prix sur demande" Badge */}
        <div className="absolute top-3 left-3">
          {isPriceMissing ? (
            <span className="bg-amber-100/90 text-amber-900 border border-amber-300 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm">
              Prix sur demande
            </span>
          ) : (
            <span className="bg-white/95 text-nopal border border-border/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
              {siteConfig.currency.format(product.price)}
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-fraunces font-bold text-base sm:text-lg text-nopal group-hover:text-cladode transition-colors line-clamp-1">
            {product.shortTitle || product.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="text-cladode font-medium group-hover:underline">
            Voir le détail →
          </span>
        </div>
      </div>
    </div>
  );
}
