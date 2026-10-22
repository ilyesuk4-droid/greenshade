import { useState, useEffect, useCallback } from "react";
import { products as initialProducts, type Product } from "@/data/products";

export const PRODUCTS_STORAGE_KEY = "greenshade_products_catalog";
const PRODUCTS_EVENT = "greenshade_products_changed";

/**
 * Read the current product catalog from localStorage, falling back to initial data.
 */
export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return initialProducts;
  }
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      // First run: seed localStorage with default products
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
      return initialProducts;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return initialProducts;
  } catch (e) {
    console.error("Failed to parse stored products:", e);
    return initialProducts;
  }
}

/**
 * Save products to localStorage and notify all subscribers.
 */
export function saveStoredProducts(productsList: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsList));
    window.dispatchEvent(new CustomEvent(PRODUCTS_EVENT, { detail: productsList }));
  } catch (e) {
    console.error("Failed to save products to localStorage:", e);
  }
}

/**
 * Upsert (create or update) a product.
 */
export function saveProduct(product: Product): Product[] {
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === product.id);
  let updated: Product[];

  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    // Generate an ID if needed
    const finalProduct = {
      ...product,
      id: product.id || `gs-${Date.now()}`,
    };
    updated = [finalProduct, ...current];
  }

  saveStoredProducts(updated);
  return updated;
}

/**
 * Delete a product by ID.
 */
export function removeProduct(productId: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  saveStoredProducts(updated);
  return updated;
}

/**
 * Reset catalog back to the initial seeded products.
 */
export function resetProducts(): Product[] {
  saveStoredProducts(initialProducts);
  return initialProducts;
}

/**
 * React hook to access and manage products reactively across the whole site.
 */
export function useProductsCatalog() {
  const [products, setProducts] = useState<Product[]>(getStoredProducts);

  useEffect(() => {
    // Synchronize on mount in case of SSR or initial hydration
    setProducts(getStoredProducts());

    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };

    window.addEventListener(PRODUCTS_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(PRODUCTS_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleSave = useCallback((prod: Product) => {
    return saveProduct(prod);
  }, []);

  const handleDelete = useCallback((id: string) => {
    return removeProduct(id);
  }, []);

  const handleReset = useCallback(() => {
    return resetProducts();
  }, []);

  return {
    products,
    saveProduct: handleSave,
    deleteProduct: handleDelete,
    resetProducts: handleReset,
  };
}
