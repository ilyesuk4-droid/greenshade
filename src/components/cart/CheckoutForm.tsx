import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2, ArrowLeft, CheckCircle2, Phone } from "lucide-react";
import { WILAYAS } from "@/lib/wilayas";
import { siteConfig } from "@/config/site";
import { submitOrder, type Order, type OrderItem } from "@/lib/order-service";
import type { CartItem } from "@/hooks/use-cart";

export interface CheckoutFormProps {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  onOrderSuccess: (order: Order) => void;
  onBack: () => void;
}

export function CheckoutForm({
  items,
  subtotal,
  deliveryFee,
  total,
  onOrderSuccess,
  onBack,
}: CheckoutFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("19 - Sétif"); // Expo in Sétif
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const cleanName = fullName.trim().slice(0, 100);
    const cleanPhone = phone.trim().replace(/[\s.-]/g, "").slice(0, 20);
    const cleanAddress = address.trim().slice(0, 500);

    if (!cleanName || !cleanPhone || !wilaya.trim()) {
      toast.error("Veuillez remplir votre nom complet, votre numéro de téléphone et votre wilaya.");
      return;
    }

    // Algerian phone format validation
    const algerianPhoneRegex = /^(?:(?:\+|00)213|0)[567][0-9]{8}$/;
    if (!algerianPhoneRegex.test(cleanPhone)) {
      toast.error("Veuillez saisir un numéro de téléphone algérien valide (ex: 0555123456 ou 06/07...).");
      return;
    }

    if (items.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    setSubmitting(true);
    try {
      const orderItems: OrderItem[] = items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
      }));

      const createdOrder = await submitOrder({
        customer: {
          fullName: cleanName,
          phone: cleanPhone,
          wilaya,
          address: cleanAddress || null,
        },
        items: orderItems,
        subtotal,
        delivery: deliveryFee,
        total,
      });

      toast.success("Votre commande a été confirmée avec succès !");
      onOrderSuccess(createdOrder);
    } catch (err) {
      console.error("Erreur lors de la validation de commande:", err);
      toast.error("Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-muted-foreground hover:text-nopal flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour au panier</span>
        </button>
      </div>

      <div>
        <h3 className="font-fraunces text-xl font-bold text-nopal">Informations de livraison</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Paiement sécurisé en espèces à la livraison.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="checkoutFullName" className="block text-xs font-semibold text-nopal mb-1">
            Nom et prénom <span className="text-destructive">*</span>
          </label>
          <input
            id="checkoutFullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex. Amina Mansouri"
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="checkoutPhone" className="block text-xs font-semibold text-nopal mb-1">
            Numéro de téléphone <span className="text-destructive">*</span>
          </label>
          <input
            id="checkoutPhone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XX XX XX XX"
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="checkoutWilaya" className="block text-xs font-semibold text-nopal mb-1">
            Wilaya de destination <span className="text-destructive">*</span>
          </label>
          <select
            id="checkoutWilaya"
            required
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent cursor-pointer"
          >
            {WILAYAS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="checkoutAddress" className="block text-xs font-semibold text-nopal mb-1">
            Commune / Adresse ou remarques (facultatif)
          </label>
          <textarea
            id="checkoutAddress"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ex. Centre-ville, près de la poste..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-cladode focus:border-transparent resize-none"
          />
        </div>

        {/* Order Summary Strip */}
        <div className="bg-linen/60 rounded-xl p-4 border border-border space-y-2 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Articles ({items.length})</span>
            <span>{siteConfig.currency.format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Frais de livraison</span>
            <span>{deliveryFee > 0 ? siteConfig.currency.format(deliveryFee) : siteConfig.delivery.feeLabel}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-nopal pt-2 border-t border-border/60">
            <span>Total estimé</span>
            <span>{siteConfig.currency.format(total)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-cta py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enregistrement en cours...</span>
            </>
          ) : (
            <span>Confirmer la commande</span>
          )}
        </button>
      </form>
    </div>
  );
}
