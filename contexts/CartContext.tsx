import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, EMIPlan } from '../types/product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
  selectedEMIPlan: EMIPlan;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  addToCart: (product: Product, variants: Record<string, string>, emiPlan: EMIPlan, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

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
