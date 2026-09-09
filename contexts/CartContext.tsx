import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { safeStorage } from '../utils/safeStorage';
import { Product, EMIPlan, CartItem } from '../types/product';

export { CartItem };

const CART_STORAGE_KEY = '@1fi_cart_items';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  addToCart: (product: Product, variants: Record<string, string>, emiPlan: EMIPlan, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialLoadDone = useRef(false);

  // 1. Load persisted cart items on initial mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await safeStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error);
      } finally {
        isInitialLoadDone.current = true;
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  // 2. Persist cart items whenever items change (after initial load)
  useEffect(() => {
    if (!isInitialLoadDone.current) return;

    const saveCart = async () => {
      try {
        await safeStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Failed to save cart to storage:', error);
      }
    };

    saveCart();
  }, [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalAmount = items.reduce((sum, item) => {
    const variantPriceModifier = Object.values(item.selectedVariants).reduce((total, variantId) => {
      const variant = item.product.variants
        .flatMap(v => v.options)
        .find(opt => opt.id === variantId);
      return total + (variant?.priceModifier || 0);
    }, 0);
    
    const itemPrice = item.product.basePrice + variantPriceModifier;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const addToCart = (
    product: Product,
    variants: Record<string, string>,
    emiPlan: EMIPlan,
    quantity: number = 1
  ) => {
    setItems(prevItems => {
      // Check if item already exists with same variants
      const existingItemIndex = prevItems.findIndex(
        item => 
          item.product.id === product.id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
      );

      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
          selectedEMIPlan: emiPlan, // Update EMI plan
        };
        return newItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          selectedVariants: variants,
          selectedEMIPlan: emiPlan,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalAmount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

