import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { safeStorage } from '../utils/safeStorage';
import { Order, OrderItem, DeliveryAddress } from '../types/product';

export { Order, OrderItem, DeliveryAddress };

const ORDERS_STORAGE_KEY = '@1fi_orders';

interface OrdersContextType {
  orders: Order[];
  addOrder: (
    items: OrderItem[],
    totalAmount: number,
    deliveryAddress: DeliveryAddress,
    subtotalAmount?: number,
    taxAmount?: number
  ) => Order;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const isInitialLoadDone = useRef(false);
  const lastOrderTimestampRef = useRef<number>(0);

  // 1. Load persisted orders on initial mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const stored = await safeStorage.getItem(ORDERS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          }
        }
      } catch (error) {
        console.error('Failed to load orders from storage:', error);
      } finally {
        isInitialLoadDone.current = true;
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // 2. Persist orders whenever orders change (after initial load)
  useEffect(() => {
    if (!isInitialLoadDone.current) return;

    const saveOrders = async () => {
      try {
        await safeStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error('Failed to save orders to storage:', error);
      }
    };

    saveOrders();
  }, [orders]);

  const generateOrderNumber = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(100 + Math.random() * 900);
    return `1FI${timestamp.toString().slice(-6)}${random}`;
  };

  const addOrder = (
    items: OrderItem[],
    totalAmount: number,
    deliveryAddress: DeliveryAddress,
    subtotalAmount?: number,
    taxAmount?: number
  ): Order => {
    const now = Date.now();

    // Prevent accidental rapid duplicate order submission within 2 seconds
    if (now - lastOrderTimestampRef.current < 2000 && orders.length > 0) {
      const recent = orders[0];
      if (recent.totalAmount === totalAmount) {
        console.warn('Duplicate order attempt ignored');
        return recent;
      }
    }
    lastOrderTimestampRef.current = now;

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4); // 4 days from now

    const newOrder: Order = {
      id: `order-${now}`,
      orderNumber: generateOrderNumber(),
      items,
      totalAmount,
      subtotalAmount: subtotalAmount ?? totalAmount,
      taxAmount: taxAmount ?? 0,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      deliveryAddress,
      estimatedDelivery: estimatedDelivery.toISOString(),
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };

  const cancelOrder = (id: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === id ? { ...order, status: 'cancelled' as const } : order
      )
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        cancelOrder,
        loading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}

