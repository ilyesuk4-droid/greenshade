import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, ArrowRight, CheckCircle2, Phone, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { siteConfig } from "@/config/site";
import { CartItem } from "./CartItem";
import { CheckoutForm } from "./CheckoutForm";
import type { Order } from "@/lib/order-service";

export interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [view, setView] = useState<"cart" | "checkout" | "success">("cart");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const deliveryFee = siteConfig.delivery.fee;
  const total = subtotal + deliveryFee;

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setView("success");
    clearCart();
  };

  const handleClose = () => {
    onClose();
    // Reset view after animation finishes
    setTimeout(() => {
      setView("cart");
      setCompletedOrder(null);
    }, 300);
  };

  // Pre-formatted WhatsApp order message
  const getWhatsAppOrderUrl = () => {
    if (!completedOrder) return siteConfig.whatsappUrl();
    const itemsList = completedOrder.items
      .map((i) => `• ${i.name} x${i.quantity} (${siteConfig.currency.format(i.subtotal)})`)
      .join("\n");
    const msg = `Bonjour GREEN SHADE, je viens de valider ma commande N° ${completedOrder.id} :
- Nom : ${completedOrder.customer.fullName}
- Téléphone : ${completedOrder.customer.phone}
- Wilaya : ${completedOrder.customer.wilaya}
${completedOrder.customer.address ? `- Adresse : ${completedOrder.customer.address}\n` : ""}- Articles :
${itemsList}
- Total : ${siteConfig.currency.format(completedOrder.total)}`;
    return siteConfig.whatsappUrl(msg);
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-linen flex flex-col justify-between p-6 overflow-y-auto"
      >
        <div>
          <SheetHeader className="pb-4 border-b border-border/70 flex flex-row items-center justify-between text-left">
            <div>
              <SheetTitle className="font-fraunces text-2xl text-nopal">
                {view === "cart" && `Votre Panier (${itemCount})`}
                {view === "checkout" && "Finaliser la commande"}
                {view === "success" && "Commande Reçue !"}
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {siteConfig.brandName} • {siteConfig.tagline}
              </p>
            </div>
          </SheetHeader>

          {/* VIEW 1: CART */}
          {view === "cart" && (
            <div className="mt-4">
              {items.length === 0 ? (
                <div className="py-16 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-hydrogel text-cladode flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-fraunces text-xl font-bold text-nopal mb-1">
                    Votre panier est vide
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs mb-6">
                    Découvrez nos déodorants naturels et soins pour composer votre panier.
                  </p>
                  <Link
                    to="/produits"
                    onClick={handleClose}
                    className="btn-cta text-xs px-5 py-2.5 rounded-lg"
                  >
                    Découvrir nos produits
                  </Link>
                </div>
              ) : (
                <div className="space-y-1 divide-y divide-border/60">
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: CHECKOUT */}
          {view === "checkout" && (
            <div className="mt-4">
              <CheckoutForm
                items={items}
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                total={total}
                onOrderSuccess={handleOrderSuccess}
                onBack={() => setView("cart")}
              />
            </div>
          )}

          {/* VIEW 3: SUCCESS */}
          {view === "success" && completedOrder && (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-fraunces text-2xl font-bold text-nopal mb-1">
                Commande confirmée !
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Référence : <span className="font-mono font-bold text-nopal">{completedOrder.id}</span>
              </p>
              <div className="bg-white rounded-xl p-4 border border-border text-xs text-left w-full space-y-1.5 mb-6 shadow-sm">
                <p>
                  <strong>Client :</strong> {completedOrder.customer.fullName}
                </p>
                <p>
                  <strong>Téléphone :</strong> {completedOrder.customer.phone}
                </p>
                <p>
                  <strong>Wilaya :</strong> {completedOrder.customer.wilaya}
                </p>
                <p>
                  <strong>Total à régler :</strong> {siteConfig.currency.format(completedOrder.total)} (à la livraison)
                </p>
              </div>

              <p className="text-xs text-muted-foreground mb-6">
                Merci pour votre confiance ! Notre équipe vous contactera sous peu pour organiser la livraison.
              </p>

              {/* Optional WhatsApp Confirmation Button */}
              <a
                href={getWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 mb-3 shadow transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Envoyer ma commande sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="btn-outline-nature w-full py-2.5 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
          )}
        </div>

        {/* Footer for Cart View */}
        {view === "cart" && items.length > 0 && (
          <div className="pt-4 border-t border-border/80 space-y-3 mt-6">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{siteConfig.currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Frais de livraison</span>
                <span>{deliveryFee > 0 ? siteConfig.currency.format(deliveryFee) : siteConfig.delivery.feeLabel}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-nopal pt-1 border-t border-border/60">
                <span>Total</span>
                <span>{siteConfig.currency.format(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView("checkout")}
              className="w-full btn-cta py-3.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-nature"
            >
              <span>Confirmer la commande</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
