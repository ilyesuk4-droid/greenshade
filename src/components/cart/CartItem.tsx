import { Trash2, Minus, Plus } from "lucide-react";
import type { CartItem as CartItemType } from "@/hooks/use-cart";
import { siteConfig } from "@/config/site";

export interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/60">
      <img
        src={item.image}
        alt={item.name}
        className="w-14 h-14 object-cover rounded-lg bg-white border border-border/80 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-nopal truncate">{item.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {siteConfig.currency.format(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="w-6 h-6 rounded border border-border bg-linen/50 flex items-center justify-center text-xs hover:bg-linen text-encre"
            aria-label="Diminuer la quantité"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="w-6 h-6 rounded border border-border bg-linen/50 flex items-center justify-center text-xs hover:bg-linen text-encre"
            aria-label="Augmenter la quantité"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between self-stretch shrink-0">
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
          aria-label="Supprimer l'article"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <span className="text-xs font-bold text-nopal">
          {siteConfig.currency.format(item.price * item.quantity)}
        </span>
      </div>
    </div>
  );
}
