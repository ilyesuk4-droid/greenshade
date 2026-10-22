import { Minus, Plus } from "lucide-react";

export interface QuantitySelectorProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-white shadow-sm p-1">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-8 h-8 rounded flex items-center justify-center text-encre hover:bg-linen disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        aria-label="Diminuer la quantité"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-10 text-center font-semibold text-sm select-none text-nopal">
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-8 h-8 rounded flex items-center justify-center text-encre hover:bg-linen disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        aria-label="Augmenter la quantité"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
