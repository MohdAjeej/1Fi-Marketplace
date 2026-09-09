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
import { Colors, Fonts, Space, Radii, Shadow, formatPrice } from '../../constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, itemCount, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add items before checkout');
      return;
    }
    router.push('/checkout');
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert('Remove Item', 'Remove this from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(itemId) },
    ]);
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearCart },
    ]);
  };

  const getItemPrice = (item: typeof items[0]) => {
    const mod = Object.values(item.selectedVariants).reduce((total, variantId) => {
      const v = item.product.variants.flatMap((vg) => vg.options).find((o) => o.id === variantId);
      return total + (v?.priceModifier || 0);
    }, 0);
    return item.product.basePrice + mod;
  };

  // Empty Cart
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <View style={styles.emptyWrap}>
          <LinearGradient colors={Colors.gradientPrimary} style={styles.emptyCircle}>
            <Text style={styles.emptyEmoji}>🛒</Text>
          </LinearGradient>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Browse the marketplace and add products you love</Text>
          <Pressable
            style={({ pressed }) => [pressed && { transform: [{ scale: 0.96 }] }]}
            onPress={() => router.push('/marketplace')}
          >
            <LinearGradient colors={Colors.gradientPrimary} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Explore Products</Text>
              <Text style={styles.emptyBtnArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSub}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
        </View>
        <Pressable onPress={handleClearCart} style={({ pressed }) => [styles.clearBtn, pressed && { opacity: 0.6 }]}>
          <Text style={styles.clearText}>Clear all</Text>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cart Items */}
        <View style={styles.itemsSection}>
          {items.map((item, index) => {
            const price = getItemPrice(item);
            const total = price * item.quantity;

            return (
              <View key={item.id} style={[styles.cartCard, index === 0 && { marginTop: 0 }]}>
                {/* Product Image */}
                <View style={styles.imageWrap}>
                  <Image source={{ uri: item.product.image }} style={styles.itemImage} resizeMode="cover" />
                </View>

                <View style={styles.itemBody}>
                  {/* Top Row: Info + Delete */}
                  <View style={styles.itemTopRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.itemBrand}>{item.product.brand}</Text>
                      <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
                    </View>
                    <Pressable onPress={() => handleRemoveItem(item.id)} style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}>
                      <Text style={styles.deleteIcon}>✕</Text>
                    </Pressable>
                  </View>

                  {/* Variant Chips */}
                  <View style={styles.chipsRow}>
                    {Object.entries(item.selectedVariants).map(([type, variantId]) => {
                      const v = item.product.variants.flatMap((vg) => vg.options).find((o) => o.id === variantId);
                      return (
                        <View key={type} style={styles.chip}>
                          <Text style={styles.chipText}>{v?.value || variantId}</Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* EMI Badge */}
                  <View style={styles.emiBadge}>
                    <Text style={styles.emiIcon}>💳</Text>
                    <Text style={styles.emiText}>
                      ₹{item.selectedEMIPlan.monthlyAmount.toLocaleString('en-IN')}/mo × {item.selectedEMIPlan.tenure}mo
                    </Text>
                  </View>

                  {/* Price + Quantity */}
                  <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>{formatPrice(total)}</Text>

                    <View style={styles.qtyControl}>
                      <Pressable
                        style={({ pressed }) => [styles.qtyBtn, pressed && styles.qtyBtnPressed]}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </Pressable>
                      <View style={styles.qtyDisplay}>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [styles.qtyBtn, styles.qtyBtnPlus, pressed && styles.qtyBtnPressed]}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Text style={[styles.qtyBtnText, styles.qtyBtnTextPlus]}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({itemCount} items)</Text>
            <Text style={styles.summaryVal}>{formatPrice(totalAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <View style={styles.freeBadge}>
              <Text style={styles.freeText}>FREE</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalVal}>{formatPrice(totalAmount)}</Text>
          </View>

          {/* EMI Callout */}
          <LinearGradient colors={['#FFF9E6', '#FFF3CC'] as const} style={styles.emiCallout}>
            <Text style={styles.emiCalloutIcon}>✨</Text>
            <Text style={styles.emiCalloutText}>No-Cost EMI available · Backed by your mutual funds</Text>
          </LinearGradient>
        </View>

        {/* Continue Shopping */}
        <Pressable
          style={({ pressed }) => [styles.continueShopping, pressed && { opacity: 0.7 }]}
          onPress={() => router.push('/marketplace')}
        >
          <Text style={styles.continueText}>← Continue Shopping</Text>
        </Pressable>
      </ScrollView>

      {/* Checkout Bar */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutPrice}>{formatPrice(totalAmount)}</Text>
        </View>
        <Pressable
          onPress={handleCheckout}
          style={({ pressed }) => [pressed && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient
            colors={Colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkoutBtn}
          >
            <Text style={styles.checkoutBtnText}>Checkout</Text>
            <Text style={styles.checkoutArrow}>→</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Space.xl, paddingTop: Space.md, paddingBottom: Space.lg,
    backgroundColor: Colors.card,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { ...Fonts.h1, color: Colors.text },
  headerSub: { ...Fonts.caption, color: Colors.textMuted, marginTop: 2 },
  clearBtn: { paddingHorizontal: Space.md, paddingVertical: Space.sm },
  clearText: { ...Fonts.captionBold, color: Colors.coral },

  // Empty
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Space.xxxl },
  emptyCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center', marginBottom: Space.xxl,
    ...Shadow.glow(Colors.accent),
  },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { ...Fonts.h2, color: Colors.text, marginBottom: Space.sm },
  emptySub: { ...Fonts.body, color: Colors.textMuted, textAlign: 'center', marginBottom: Space.xxl },
  emptyBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Space.xxl,
    paddingVertical: Space.lg, borderRadius: Radii.lg, gap: Space.sm,
  },
  emptyBtnText: { ...Fonts.bodySemibold, color: Colors.textWhite },
  emptyBtnArrow: { fontSize: 18, color: Colors.textWhite, fontWeight: '600' },

  // Items
  itemsSection: { padding: Space.lg },
  cartCard: {
    flexDirection: 'row', backgroundColor: Colors.card,
    borderRadius: Radii.xl, padding: Space.lg,
    marginTop: Space.md,
    ...Shadow.card,
  },
  imageWrap: {
    width: 100, height: 100, borderRadius: Radii.lg,
    backgroundColor: '#F5F6FA', overflow: 'hidden',
  },
  itemImage: { width: '100%', height: '100%' },
  itemBody: { flex: 1, marginLeft: Space.lg },
  itemTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemBrand: { ...Fonts.label, color: Colors.textLight, marginBottom: 2 },
  itemName: { ...Fonts.captionBold, color: Colors.text, lineHeight: 18 },
  deleteBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.coralLight, alignItems: 'center', justifyContent: 'center',
  },
  deleteIcon: { fontSize: 12, color: Colors.coral, fontWeight: '700' },

  // Chips
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.xs, marginTop: Space.sm },
  chip: {
    backgroundColor: Colors.cardAlt, paddingHorizontal: Space.sm, paddingVertical: 3,
    borderRadius: Radii.sm, borderWidth: 1, borderColor: Colors.border,
  },
  chipText: { ...Fonts.tiny, color: Colors.textMuted },

  // EMI Badge
  emiBadge: {
    flexDirection: 'row', alignItems: 'center', gap: Space.xs,
    backgroundColor: Colors.accentSoft, paddingHorizontal: Space.sm,
    paddingVertical: 4, borderRadius: Radii.sm,
    alignSelf: 'flex-start', marginTop: Space.sm,
  },
  emiIcon: { fontSize: 12 },
  emiText: { ...Fonts.tiny, color: Colors.accent, fontWeight: '700' },

  // Price + Qty
  itemBottomRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: Space.md,
  },
  itemPrice: { ...Fonts.priceSmall, color: Colors.text },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderRadius: Radii.md, overflow: 'hidden' },
  qtyBtn: {
    width: 34, height: 34, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border,
  },
  qtyBtnPlus: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  qtyBtnPressed: { opacity: 0.7 },
  qtyBtnText: { fontSize: 18, fontWeight: '600', color: Colors.text },
  qtyBtnTextPlus: { color: Colors.textWhite },
  qtyDisplay: {
    paddingHorizontal: Space.lg, height: 34, justifyContent: 'center',
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  qtyValue: { ...Fonts.captionBold, color: Colors.text },

  // Summary
  summaryCard: {
    backgroundColor: Colors.card, marginHorizontal: Space.lg,
    marginTop: Space.sm, padding: Space.xl, borderRadius: Radii.xl,
    ...Shadow.card,
  },
  summaryTitle: { ...Fonts.h3, color: Colors.text, marginBottom: Space.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Space.md },
  summaryLabel: { ...Fonts.body, color: Colors.textMuted },
  summaryVal: { ...Fonts.bodySemibold, color: Colors.text },
  freeBadge: { backgroundColor: Colors.greenLight, paddingHorizontal: Space.sm, paddingVertical: 3, borderRadius: Radii.sm },
  freeText: { ...Fonts.tinyBold, color: Colors.green },
  summaryDivider: { height: 1, backgroundColor: Colors.divider, marginVertical: Space.md },
  totalLabel: { ...Fonts.h3, color: Colors.text },
  totalVal: { ...Fonts.price, color: Colors.accent, fontSize: 20 },

  emiCallout: {
    flexDirection: 'row', alignItems: 'center', padding: Space.md,
    borderRadius: Radii.md, marginTop: Space.lg, gap: Space.sm,
  },
  emiCalloutIcon: { fontSize: 18 },
  emiCalloutText: { ...Fonts.caption, color: '#92400E', flex: 1 },

  continueShopping: {
    alignSelf: 'center', marginTop: Space.xl,
    paddingVertical: Space.md, paddingHorizontal: Space.xxl,
    borderWidth: 1.5, borderColor: Colors.borderDark, borderRadius: Radii.md,
  },
  continueText: { ...Fonts.captionBold, color: Colors.textMuted },

  // Checkout Bar
  checkoutBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: Space.xl, paddingVertical: Space.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Shadow.elevated,
  },
  checkoutLabel: { ...Fonts.tiny, color: Colors.textMuted, marginBottom: 2 },
  checkoutPrice: { ...Fonts.price, color: Colors.text, fontSize: 20 },
  checkoutBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Space.xxl,
    paddingVertical: Space.lg, borderRadius: Radii.lg, gap: Space.sm,
  },
  checkoutBtnText: { ...Fonts.bodySemibold, color: Colors.textWhite },
  checkoutArrow: { fontSize: 18, color: Colors.textWhite, fontWeight: '600' },
});
