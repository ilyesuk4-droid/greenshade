// Order JSON shape
export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;               // generated UUID or unique string
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
