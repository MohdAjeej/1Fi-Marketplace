export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier?: number; // Additional price on top of base price
}

export interface EMIPlan {
  id: string;
  tenure: number; // in months
  monthlyAmount: number;
  totalAmount: number;
  interestRate: number;
  isNoCost: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  basePrice: number;
  originalPrice?: number; // MRP before discount
  discount?: number; // Discount percentage
  image: string;
  description: string;
  highlights: string[];
  specifications: Record<string, string>;
  variants: {
    type: string; // e.g., "Storage", "Color"
    options: ProductVariant[];
  }[];
  emiPlans: EMIPlan[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariants: Record<string, string>; // variant type -> variant id
  selectedEMIPlan: EMIPlan;
  quantity: number;
}

export interface SelectedVariantDetail {
  type: string;
  id: string;
  name: string;
  value: string;
  priceModifier?: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  brand?: string;
  productImage: string;
  quantity: number;
  price: number; // Unit price with variant modifiers
  totalPrice: number;
  selectedVariants: Record<string, string>;
  variantDetails: SelectedVariantDetail[];
  selectedEMIPlan: EMIPlan;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  status: 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: DeliveryAddress;
  estimatedDelivery: string;
}
