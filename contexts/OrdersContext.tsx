import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OrderItem {
  id: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress?: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
  };
  estimatedDelivery?: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (items: OrderItem[], totalAmount: number, deliveryAddress: any) => Order;
  getOrderById: (id: string) => Order | undefined;
  cancelOrder: (id: string) => void;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading] = useState(false);

  const generateOrderNumber = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD${timestamp}${random}`.slice(0, 16);
  };

  const addOrder = (items: OrderItem[], totalAmount: number, deliveryAddress: any): Order => {
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5); // 5 days from now

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      items,
      totalAmount,
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
