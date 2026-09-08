import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user's cart
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId! },
      include: {
        product: {
          include: {
            variants: true,
            emiPlans: true,
          },
        },
      },
    });

    res.json({ cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart
router.post(
  '/',
  authenticate,
  [
    body('productId').notEmpty(),
    body('selectedVariants').isObject(),
    body('emiPlanId').optional(),
    body('quantity').isInt({ min: 1 }).default(1),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { productId, selectedVariants, emiPlanId, quantity } = req.body;

      // Check if product exists
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (!product.inStock) {
        return res.status(400).json({ error: 'Product out of stock' });
      }

      // Check if item already in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId: req.userId!,
          productId,
        },
      });

      let cartItem;
      if (existingItem) {
        // Update existing item
        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            selectedVariants,
            emiPlanId,
            quantity: existingItem.quantity + quantity,
          },
          include: {
            product: {
              include: {
                variants: true,
                emiPlans: true,
              },
            },
          },
        });
      } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
          data: {
            userId: req.userId!,
            productId,
            selectedVariants,
            emiPlanId,
            quantity,
          },
          include: {
            product: {
              include: {
                variants: true,
                emiPlans: true,
              },
            },
          },
        });
      }

      res.status(201).json({
        message: 'Item added to cart',
        cartItem,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  }
);

// Update cart item
router.put(
  '/:id',
  authenticate,
  [
    body('quantity').optional().isInt({ min: 1 }),
    body('selectedVariants').optional().isObject(),
    body('emiPlanId').optional(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const cartItem = await prisma.cartItem.findFirst({
        where: {
          id,
          userId: req.userId!,
        },
      });

      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }

      const updatedItem = await prisma.cartItem.update({
        where: { id },
        data: req.body,
        include: {
          product: {
            include: {
              variants: true,
              emiPlans: true,
            },
          },
        },
      });

      res.json({
        message: 'Cart item updated',
        cartItem: updatedItem,
      });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  }
);

// Remove item from cart
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/', authenticate, async (req: AuthRequest, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.userId! },
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
