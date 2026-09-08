import { Product } from '../types/product';

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'Smartphones',
    basePrice: 134900,
    originalPrice: 144900,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop',
    description:
      'The iPhone 15 Pro features a titanium design, A17 Pro chip, and advanced camera system with ProRAW capabilities. Experience the ultimate in mobile performance and photography.',
    highlights: [
      'A17 Pro chip for blazing-fast performance',
      'Titanium design - Strong. Light. Pro.',
      'Pro camera system with 5x Telephoto lens',
      'Action button for quick access',
      'All-day battery life with USB-C',
    ],
    specifications: {
      Display: '6.1" Super Retina XDR',
      Processor: 'A17 Pro chip',
      'RAM': '8GB',
      Camera: '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
      Battery: '3274 mAh',
      OS: 'iOS 17',
    },
    variants: [
      {
        type: 'Storage',
        options: [
          { id: 'storage-128', name: '128GB', value: '128 GB', priceModifier: 0 },
          { id: 'storage-256', name: '256GB', value: '256 GB', priceModifier: 10000 },
          { id: 'storage-512', name: '512GB', value: '512 GB', priceModifier: 20000 },
        ],
      },
      {
        type: 'Color',
        options: [
          { id: 'color-natural', name: 'Natural Titanium', value: 'Natural Titanium' },
          { id: 'color-blue', name: 'Blue Titanium', value: 'Blue Titanium' },
          { id: 'color-white', name: 'White Titanium', value: 'White Titanium' },
          { id: 'color-black', name: 'Black Titanium', value: 'Black Titanium' },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-3',
        tenure: 3,
        monthlyAmount: 44967,
        totalAmount: 134900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 22483,
        totalAmount: 134900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 14989,
        totalAmount: 134900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 11242,
        totalAmount: 134900,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 2547,
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    brand: 'Apple',
    category: 'Laptops',
    basePrice: 114900,
    originalPrice: 119900,
    discount: 4,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
    description:
      'The MacBook Air with M3 chip delivers exceptional performance in a stunning, thin design. Perfect for students, professionals, and creatives.',
    highlights: [
      'M3 chip for powerful performance',
      'Up to 18 hours battery life',
      '13.6" Liquid Retina display',
      'Fanless design - Silent operation',
      'MagSafe charging and two Thunderbolt ports',
    ],
    specifications: {
      Display: '13.6" Liquid Retina',
      Processor: 'Apple M3 chip',
      RAM: '8GB unified memory',
      Storage: '256GB SSD',
      'Battery Life': 'Up to 18 hours',
      Weight: '1.24 kg',
    },
    variants: [
      {
        type: 'Storage',
        options: [
          { id: 'storage-256', name: '256GB', value: '256 GB', priceModifier: 0 },
          { id: 'storage-512', name: '512GB', value: '512 GB', priceModifier: 10000 },
        ],
      },
      {
        type: 'Color',
        options: [
          { id: 'color-midnight', name: 'Midnight', value: 'Midnight' },
          { id: 'color-starlight', name: 'Starlight', value: 'Starlight' },
          { id: 'color-silver', name: 'Silver', value: 'Silver' },
          { id: 'color-spacegray', name: 'Space Gray', value: 'Space Gray' },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-3',
        tenure: 3,
        monthlyAmount: 38300,
        totalAmount: 114900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 19150,
        totalAmount: 114900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 12767,
        totalAmount: 114900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 9575,
        totalAmount: 114900,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 1832,
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    basePrice: 129999,
    originalPrice: 139999,
    discount: 7,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop',
    description:
      'The Samsung Galaxy S24 Ultra comes with an integrated S Pen, powerful Snapdragon processor, and a versatile quad-camera system for professional photography.',
    highlights: [
      '200MP main camera with AI enhancements',
      'Built-in S Pen for productivity',
      'Snapdragon 8 Gen 3 processor',
      '6.8" Dynamic AMOLED 2X display',
      '5000mAh battery with fast charging',
    ],
    specifications: {
      Display: '6.8" Dynamic AMOLED 2X',
      Processor: 'Snapdragon 8 Gen 3',
      RAM: '12GB',
      Camera: '200MP Main + 50MP Telephoto + 12MP Ultra Wide + 10MP Telephoto',
      Battery: '5000 mAh',
      OS: 'Android 14 with One UI 6',
    },
    variants: [
      {
        type: 'Storage',
        options: [
          { id: 'storage-256', name: '256GB', value: '256 GB', priceModifier: 0 },
          { id: 'storage-512', name: '512GB', value: '512 GB', priceModifier: 10000 },
          { id: 'storage-1tb', name: '1TB', value: '1 TB', priceModifier: 20000 },
        ],
      },
      {
        type: 'Color',
        options: [
          { id: 'color-titanium-gray', name: 'Titanium Gray', value: 'Titanium Gray' },
          { id: 'color-titanium-black', name: 'Titanium Black', value: 'Titanium Black' },
          { id: 'color-titanium-violet', name: 'Titanium Violet', value: 'Titanium Violet' },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-3',
        tenure: 3,
        monthlyAmount: 43333,
        totalAmount: 129999,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 21667,
        totalAmount: 129999,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 14444,
        totalAmount: 129999,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 10833,
        totalAmount: 129999,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 1456,
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    brand: 'Sony',
    category: 'Audio',
    basePrice: 29990,
    originalPrice: 34990,
    discount: 14,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop',
    description:
      'Industry-leading noise canceling headphones with premium sound quality, multipoint connectivity, and exceptional comfort for all-day wear.',
    highlights: [
      'Industry-leading noise cancellation',
      '30-hour battery life',
      'Premium sound with LDAC support',
      'Multipoint connection',
      'Speak-to-chat technology',
    ],
    specifications: {
      Driver: '30mm',
      'Noise Cancellation': 'Active Noise Cancellation',
      'Battery Life': '30 hours',
      Connectivity: 'Bluetooth 5.2',
      Weight: '250g',
      Codec: 'LDAC, AAC, SBC',
    },
    variants: [
      {
        type: 'Color',
        options: [
          { id: 'color-black', name: 'Black', value: 'Black' },
          { id: 'color-silver', name: 'Silver', value: 'Silver' },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-3',
        tenure: 3,
        monthlyAmount: 9997,
        totalAmount: 29990,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 4998,
        totalAmount: 29990,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 3332,
        totalAmount: 29990,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 2499,
        totalAmount: 29990,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 3421,
  },
  {
    id: '5',
    name: 'Dell XPS 15',
    brand: 'Dell',
    category: 'Laptops',
    basePrice: 189990,
    originalPrice: 209990,
    discount: 10,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=500&fit=crop',
    description:
      'The Dell XPS 15 combines powerful performance with a stunning InfinityEdge display. Perfect for creative professionals and power users.',
    highlights: [
      '13th Gen Intel Core i7 processor',
      '15.6" 4K OLED InfinityEdge display',
      'NVIDIA GeForce RTX 4050 graphics',
      '16GB DDR5 RAM',
      'Premium aluminum chassis',
    ],
    specifications: {
      Display: '15.6" 4K OLED',
      Processor: 'Intel Core i7-13700H',
      RAM: '16GB DDR5',
      Storage: '512GB SSD',
      Graphics: 'NVIDIA RTX 4050 6GB',
      Weight: '1.86 kg',
    },
    variants: [
      {
        type: 'Storage',
        options: [
          { id: 'storage-512', name: '512GB', value: '512 GB', priceModifier: 0 },
          { id: 'storage-1tb', name: '1TB', value: '1 TB', priceModifier: 15000 },
        ],
      },
      {
        type: 'RAM',
        options: [
          { id: 'ram-16', name: '16GB', value: '16 GB', priceModifier: 0 },
          { id: 'ram-32', name: '32GB', value: '32 GB', priceModifier: 20000 },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 31665,
        totalAmount: 189990,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 21110,
        totalAmount: 189990,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 15833,
        totalAmount: 189990,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 892,
  },
  {
    id: '6',
    name: 'LG C3 55" OLED TV',
    brand: 'LG',
    category: 'TVs',
    basePrice: 139990,
    originalPrice: 159990,
    discount: 13,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop',
    description:
      'Experience cinematic picture quality with the LG C3 OLED TV. Perfect blacks, vibrant colors, and advanced gaming features make this the ultimate entertainment centerpiece.',
    highlights: [
      'Self-lit OLED pixels for perfect blacks',
      'α9 AI Processor Gen6 for enhanced picture quality',
      '4K 120Hz for gaming',
      'Dolby Vision IQ & Dolby Atmos',
      'webOS smart platform with Magic Remote',
    ],
    specifications: {
      'Screen Size': '55 inches',
      Resolution: '4K Ultra HD (3840 x 2160)',
      'Display Type': 'OLED Evo',
      'Refresh Rate': '120Hz',
      HDR: 'Dolby Vision IQ, HDR10, HLG',
      'Smart TV': 'webOS 23',
    },
    variants: [
      {
        type: 'Size',
        options: [
          { id: 'size-55', name: '55 inch', value: '55"', priceModifier: 0 },
          { id: 'size-65', name: '65 inch', value: '65"', priceModifier: 60000 },
          { id: 'size-77', name: '77 inch', value: '77"', priceModifier: 160000 },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 23332,
        totalAmount: 139990,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 15554,
        totalAmount: 139990,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 11666,
        totalAmount: 139990,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 654,
  },
  {
    id: '7',
    name: 'iPad Pro 12.9" M2',
    brand: 'Apple',
    category: 'Tablets',
    basePrice: 112900,
    originalPrice: 122900,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
    description:
      'The ultimate iPad experience with M2 chip performance, Liquid Retina XDR display, and all-day battery life. Perfect for creative professionals.',
    highlights: [
      'M2 chip for desktop-class performance',
      '12.9" Liquid Retina XDR display',
      'ProMotion technology with 120Hz',
      'Apple Pencil (2nd generation) support',
      'Face ID and 5G connectivity',
    ],
    specifications: {
      Display: '12.9" Liquid Retina XDR',
      Processor: 'Apple M2 chip',
      RAM: '8GB',
      'Front Camera': '12MP Ultra Wide',
      'Rear Camera': '12MP Wide + 10MP Ultra Wide',
      Connectivity: '5G, Wi-Fi 6E',
    },
    variants: [
      {
        type: 'Storage',
        options: [
          { id: 'storage-128', name: '128GB', value: '128 GB', priceModifier: 0 },
          { id: 'storage-256', name: '256GB', value: '256 GB', priceModifier: 10000 },
          { id: 'storage-512', name: '512GB', value: '512 GB', priceModifier: 20000 },
        ],
      },
      {
        type: 'Connectivity',
        options: [
          { id: 'wifi', name: 'Wi-Fi', value: 'Wi-Fi', priceModifier: 0 },
          { id: 'wifi-cellular', name: 'Wi-Fi + Cellular', value: 'Wi-Fi + Cellular', priceModifier: 15000 },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-3',
        tenure: 3,
        monthlyAmount: 37633,
        totalAmount: 112900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 18817,
        totalAmount: 112900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 12544,
        totalAmount: 112900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 9408,
        totalAmount: 112900,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 2134,
  },
  {
    id: '8',
    name: 'Apple Watch Series 9',
    brand: 'Apple',
    category: 'Wearables',
    basePrice: 45900,
    originalPrice: 49900,
    discount: 8,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop',
    description:
      'The most advanced Apple Watch features a brighter display, faster S9 chip, and new Double Tap gesture. Track your health and fitness like never before.',
    highlights: [
      'S9 chip with 4-core Neural Engine',
      'Always-On Retina display - 2000 nits',
      'Double Tap gesture control',
      'Advanced health features including ECG and Blood Oxygen',
      'Up to 18 hours battery life',
    ],
    specifications: {
      Display: 'Always-On Retina LTPO OLED',
      Processor: 'S9 SiP with 64-bit dual-core',
      'Water Resistance': '50 meters',
      Connectivity: 'GPS, Bluetooth 5.3, Wi-Fi',
      Sensors: 'ECG, Blood Oxygen, Heart Rate',
      'Battery Life': 'Up to 18 hours',
    },
    variants: [
      {
        type: 'Size',
        options: [
          { id: 'size-41', name: '41mm', value: '41mm', priceModifier: 0 },
          { id: 'size-45', name: '45mm', value: '45mm', priceModifier: 4000 },
        ],
      },
      {
        type: 'Color',
        options: [
          { id: 'color-midnight', name: 'Midnight', value: 'Midnight' },
          { id: 'color-starlight', name: 'Starlight', value: 'Starlight' },
          { id: 'color-silver', name: 'Silver', value: 'Silver' },
          { id: 'color-pink', name: 'Pink', value: 'Pink' },
          { id: 'color-red', name: '(PRODUCT)RED', value: '(PRODUCT)RED' },
        ],
      },
    ],
    emiPlans: [
      {
        id: 'emi-3',
        tenure: 3,
        monthlyAmount: 15300,
        totalAmount: 45900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-6',
        tenure: 6,
        monthlyAmount: 7650,
        totalAmount: 45900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-9',
        tenure: 9,
        monthlyAmount: 5100,
        totalAmount: 45900,
        interestRate: 0,
        isNoCost: true,
      },
      {
        id: 'emi-12',
        tenure: 12,
        monthlyAmount: 3825,
        totalAmount: 45900,
        interestRate: 0,
        isNoCost: true,
      },
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 4567,
  },
];

/**
 * Simulates API delay
 */
const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Get all products from the marketplace
 */
export async function getProducts(): Promise<Product[]> {
  await simulateDelay();
  return mockProducts;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  await simulateDelay();
  const product = mockProducts.find((p) => p.id === id);
  return product || null;
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  await simulateDelay();
  return mockProducts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search products by query
 */
export async function searchProducts(query: string): Promise<Product[]> {
  await simulateDelay();
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
}
