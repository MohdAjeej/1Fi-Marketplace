import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCart } from '../../contexts/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { items, itemCount, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before checkout');
      return;
    }

    // Navigate to checkout
    router.push('/checkout');
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(itemId) },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const getItemPrice = (item: typeof items[0]) => {
    const variantPriceModifier = Object.values(item.selectedVariants).reduce((total, variantId) => {
      const variant = item.product.variants
        .flatMap(v => v.options)
        .find(opt => opt.id === variantId);
      return total + (variant?.priceModifier || 0);
    }, 0);
    
    return item.product.basePrice + variantPriceModifier;
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>🛒</Text>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSubtitle}>Your shopping cart is empty</Text>
        </LinearGradient>

        <View style={styles.emptyState}>
          <LinearGradient
            colors={['#F3F4F6', '#E5E7EB']}
            style={styles.emptyIconContainer}
          >
            <Text style={styles.emptyIcon}>🛍️</Text>
          </LinearGradient>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Explore our marketplace and add products to your cart
          </Text>
          <Pressable
            style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            onPress={() => router.push('/marketplace')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Start Shopping</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerWithItems}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Cart</Text>
            <Text style={styles.headerSubtitle}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
          </View>
          <Pressable onPress={handleClearCart} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </Pressable>
        </View>
      </LinearGradient>

      {/* Cart Items */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsContainer}>
          {items.map((item) => {
            const itemPrice = getItemPrice(item);
            const itemTotal = itemPrice * item.quantity;

            return (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.product.image }} style={styles.itemImage} />
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemBrand}>{item.product.brand}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.product.name}
                  </Text>

                  {/* Variants */}
                  <View style={styles.variantsContainer}>
                    {Object.entries(item.selectedVariants).map(([type, variantId]) => {
                      const variant = item.product.variants
                        .flatMap(v => v.options)
                        .find(opt => opt.id === variantId);
                      return (
                        <Text key={type} style={styles.variantText}>
                          {variant?.value}
                        </Text>
                      );
                    })}
                  </View>

                  {/* EMI Info */}
                  <LinearGradient
                    colors={['#EEF2FF', '#E0E7FF']}
                    style={styles.emiInfo}
                  >
                    <Text style={styles.emiInfoText}>
                      EMI: ₹{item.selectedEMIPlan.monthlyAmount.toLocaleString('en-IN')}/mo × {item.selectedEMIPlan.tenure}
                    </Text>
                  </LinearGradient>

                  {/* Price and Quantity */}
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>{formatPrice(itemTotal)}</Text>
                    <View style={styles.quantityContainer}>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Text style={styles.quantityButtonText}>−</Text>
                      </Pressable>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <Pressable
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>

                {/* Remove Button */}
                <Pressable
                  style={styles.removeButton}
                  onPress={() => handleRemoveItem(item.id)}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({itemCount} items)</Text>
            <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, styles.freeText]}>FREE</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
          </View>

          <View style={styles.savingsCard}>
            <Text style={styles.savingsIcon}>✨</Text>
            <Text style={styles.savingsText}>
              Pay with No-Cost EMI and save on interest
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Checkout */}
      <View style={styles.checkoutBar}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutAmount}>{formatPrice(totalAmount)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.checkoutButton, pressed && styles.checkoutButtonPressed]}
          onPress={handleCheckout}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutArrow}>→</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
  },
  headerWithItems: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  itemBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  variantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  variantText: {
    fontSize: 11,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  emiInfo: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
  },
  emiInfoText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
  },
  quantityText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '700',
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  freeText: {
    color: '#10B981',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#667eea',
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  savingsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  savingsText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  checkoutInfo: {
    marginRight: 16,
  },
  checkoutLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  checkoutAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  checkoutButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  checkoutArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
});
