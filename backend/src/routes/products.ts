import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all products with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    const where: any = {};
    
    if (category && category !== 'all') {
      where.category = {
        equals: category as string,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { brand: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        variants: true,
        emiPlans: {
          orderBy: { tenure: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend interface
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: product.basePrice,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      description: product.description,
      highlights: product.highlights,
      specifications: product.specifications,
      inStock: product.inStock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      variants: groupVariantsByType(product.variants),
      emiPlans: product.emiPlans.map(plan => ({
        id: plan.id,
        tenure: plan.tenure,
        monthlyAmount: plan.monthlyAmount,
        totalAmount: plan.totalAmount,
        interestRate: plan.interestRate,
        isNoCost: plan.isNoCost,
      })),
    }));

    res.json({ products: transformedProducts });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        emiPlans: {
          orderBy: { tenure: 'asc' },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Transform to match frontend interface
    const transformedProduct = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      basePrice: product.basePrice,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      description: product.description,
      highlights: product.highlights,
      specifications: product.specifications,
      inStock: product.inStock,
      rating: product.rating,
      reviewCount: product.reviewCount,
      variants: groupVariantsByType(product.variants),
      emiPlans: product.emiPlans.map(plan => ({
        id: plan.id,
        tenure: plan.tenure,
        monthlyAmount: plan.monthlyAmount,
        totalAmount: plan.totalAmount,
        interestRate: plan.interestRate,
        isNoCost: plan.isNoCost,
      })),
    };

    res.json({ product: transformedProduct });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    res.json({
      categories: ['All', ...categories.map(c => c.category)],
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Helper function to group variants by type
function groupVariantsByType(variants: any[]) {
  const grouped: Record<string, any[]> = {};

  variants.forEach(variant => {
    if (!grouped[variant.type]) {
      grouped[variant.type] = [];
    }
    grouped[variant.type].push({
      id: variant.id,
      name: variant.name,
      value: variant.value,
      priceModifier: variant.priceModifier,
    });
  });

  return Object.entries(grouped).map(([type, options]) => ({
    type,
    options,
  }));
}

export default router;
