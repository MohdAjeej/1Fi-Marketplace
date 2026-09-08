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
  product: Product;
  selectedVariants: Record<string, string>; // variant type -> variant id
  selectedEMIPlan?: EMIPlan;
  quantity: number;
}
