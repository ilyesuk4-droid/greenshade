import { useState, useEffect } from "react";
import { ShoppingBag, Phone, CheckCircle2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import type { Product } from "@/data/products";
import { QuantitySelector } from "./QuantitySelector";

export interface ProductDetailProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetail({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when opened for a new product
  useEffect(() => {
    if (open) {
      setQuantity(1);
    }
  }, [open, product]);

  if (!product) return null;

  const isPriceMissing = product.price == null || product.price <= 0;

  const handleAdd = () => {
    if (isPriceMissing) return;
    onAddToCart(product, quantity);
    onClose();
  };

  const whatsappInquiryUrl = siteConfig.whatsappUrl(
    `Bonjour GREEN SHADE, je souhaite connaître le prix et la disponibilité du produit : ${product.name}`
  );

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-linen flex flex-col justify-between p-6 overflow-y-auto"
      >
        <div className="space-y-6">
          <SheetHeader className="text-left pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cladode">
              {product.category === "deodorant"
                ? "Déodorant Naturel"
                : product.category || "Cosmétique Naturel"}
            </span>
            <SheetTitle className="font-fraunces text-2xl sm:text-3xl font-bold text-nopal leading-tight">
              {product.name}
            </SheetTitle>
          </SheetHeader>

          {/* Product Image */}
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-border/70 shadow-sm relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Price Badge Overlay */}
            <div className="absolute top-4 left-4">
              {isPriceMissing ? (
                <span className="bg-amber-100 text-amber-950 border border-amber-300 font-bold px-3 py-1.5 rounded-full text-xs shadow-sm">
                  Prix sur demande
                </span>
              ) : (
                <span className="bg-white/95 text-nopal border border-border/60 font-bold px-3 py-1.5 rounded-full text-sm shadow-sm">
                  {siteConfig.currency.format(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Features Pills */}
          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.map((feat) => (
                <span
                  key={feat}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-hydrogel text-nopal text-xs font-medium border border-border/40"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cladode shrink-0" />
                  <span>{feat}</span>
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-nopal mb-1.5">
              Description
            </h4>
            <p className="text-sm text-encre/85 leading-relaxed bg-white/70 p-3.5 rounded-xl border border-border/60">
              {product.description}
            </p>
          </div>

          {/* Mode d'emploi */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-nopal mb-1.5">
              Mode d'emploi
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed bg-white/70 p-3.5 rounded-xl border border-border/60">
              {product.usage}
            </p>
          </div>
        </div>

        {/* Action Panel */}
        <div className="pt-6 border-t border-border/80 mt-6 space-y-4">
          {isPriceMissing ? (
            <div className="space-y-3">
              <p className="text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200 text-center">
                Ce produit est disponible sur commande spéciale. Contactez-nous directement pour obtenir les tarifs.
              </p>
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Demander le prix sur WhatsApp</span>
              </a>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between sm:justify-start gap-3">
                <span className="text-xs font-semibold text-muted-foreground">Quantité :</span>
                <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={50} />
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="btn-cta flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-nature"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  Ajouter au panier • {siteConfig.currency.format((product.price || 0) * quantity)}
                </span>
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
