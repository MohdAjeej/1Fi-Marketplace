import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get user's orders
router.get('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId! },
      include: {
        items: {
          include: {
            product: true,
            emiPlan: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
            emiPlan: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order from cart
router.post(
  '/',
  authenticate,
  [
    body('shippingAddress').isObject(),
    body('shippingAddress.street').notEmpty(),
    body('shippingAddress.city').notEmpty(),
    body('shippingAddress.state').notEmpty(),
    body('shippingAddress.pincode').notEmpty(),
    body('shippingAddress.country').notEmpty(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { shippingAddress } = req.body;

      // Get cart items
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

      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Validate stock and EMI plans
      for (const item of cartItems) {
        if (!item.product.inStock) {
          return res.status(400).json({
            error: `Product ${item.product.name} is out of stock`,
          });
        }

        if (!item.emiPlanId) {
          return res.status(400).json({
            error: `Please select EMI plan for ${item.product.name}`,
          });
        }
      }

      // Calculate total amount
      let totalAmount = 0;
      for (const item of cartItems) {
        // Calculate price with variant modifiers
        let itemPrice = item.product.basePrice;
        const selectedVariants = item.selectedVariants as Record<string, string>;
        
        for (const variantId of Object.values(selectedVariants)) {
          const variant = item.product.variants.find(v => v.id === variantId);
          if (variant && variant.priceModifier) {
            itemPrice += variant.priceModifier;
          }
        }

        totalAmount += itemPrice * item.quantity;
      }

      // Generate order number
      const orderNumber = `1FI${Date.now()}${Math.floor(Math.random() * 1000)}`;

      // Create order with items
      const order = await prisma.order.create({
        data: {
          userId: req.userId!,
          orderNumber,
          status: 'PENDING',
          totalAmount,
          shippingAddress,
          items: {
            create: cartItems.map(item => {
              // Calculate item price
              let itemPrice = item.product.basePrice;
              const selectedVariants = item.selectedVariants as Record<string, string>;
              
              for (const variantId of Object.values(selectedVariants)) {
                const variant = item.product.variants.find(v => v.id === variantId);
                if (variant && variant.priceModifier) {
                  itemPrice += variant.priceModifier;
                }
              }

              return {
                productId: item.productId,
                emiPlanId: item.emiPlanId!,
                selectedVariants: item.selectedVariants,
                quantity: item.quantity,
                price: itemPrice * item.quantity,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: true,
              emiPlan: true,
            },
          },
        },
      });

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: { userId: req.userId! },
      });

      res.status(201).json({
        message: 'Order placed successfully',
        order,
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
);

// Cancel order
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Order already cancelled' });
    }

    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      return res.status(400).json({
        error: 'Cannot cancel order that has been shipped or delivered',
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        items: {
          include: {
            product: true,
            emiPlan: true,
          },
        },
      },
    });

    res.json({
      message: 'Order cancelled successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

export default router;
