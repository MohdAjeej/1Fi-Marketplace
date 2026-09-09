import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Alert, TextInput, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrdersContext';
import { OrderItem, SelectedVariantDetail } from '../../types/product';
import { Colors, Fonts, Space, Radii, Shadow, formatPrice } from '../../constants/theme';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const { addOrder } = useOrders();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isOrderPlacedRef = useRef(false);
  const isSubmittingRef = useRef(false);

  React.useEffect(() => {
    if (items.length === 0 && !isOrderPlacedRef.current) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  const tax = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + tax;

  const handlePlaceOrder = async () => {
    if (isProcessing || isSubmittingRef.current) return;
    if (!fullName.trim() || !phone.trim() || !email.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      Alert.alert('Missing Info', 'Please fill all fields'); return;
    }
    const cleanPhone = phone.trim();
    if (cleanPhone.length !== 10 || !/^\d+$/.test(cleanPhone)) {
      Alert.alert('Invalid Phone', 'Enter a valid 10-digit number'); return;
    }
    const cleanPincode = pincode.trim();
    if (cleanPincode.length !== 6 || !/^\d+$/.test(cleanPincode)) {
      Alert.alert('Invalid Pincode', 'Enter a valid 6-digit pincode'); return;
    }

    isSubmittingRef.current = true;
    setIsProcessing(true);

    setTimeout(() => {
      try {
        const orderItems: OrderItem[] = items.map((item) => {
          const variantDetails: SelectedVariantDetail[] = Object.entries(item.selectedVariants).map(
            ([type, variantId]) => {
              const group = item.product.variants.find((v) => v.type === type);
              const option = group?.options.find((opt) => opt.id === variantId);
              return { type, id: variantId, name: option?.name || variantId, value: option?.value || variantId, priceModifier: option?.priceModifier || 0 };
            }
          );
          const mod = variantDetails.reduce((s, v) => s + (v.priceModifier || 0), 0);
          const unitPrice = item.product.basePrice + mod;
          return {
            id: `${item.id}-${Date.now()}`, productId: item.product.id,
            productName: item.product.name, brand: item.product.brand,
            productImage: item.product.image, quantity: item.quantity,
            price: unitPrice, totalPrice: unitPrice * item.quantity,
            selectedVariants: item.selectedVariants, variantDetails,
            selectedEMIPlan: item.selectedEMIPlan,
          };
        });

        const deliveryAddress = {
          fullName: fullName.trim(), phone: cleanPhone, email: email.trim(),
          address: address.trim(), city: city.trim(), pincode: cleanPincode,
        };

        isOrderPlacedRef.current = true;
        const newOrder = addOrder(orderItems, grandTotal, deliveryAddress, totalAmount, tax);
        clearCart();
        setIsProcessing(false);

        Alert.alert(
          '🎉 Order Confirmed!',
          `Order #${newOrder.orderNumber}\n\nBacked by mutual funds.\nDelivery in 3-5 business days.`,
          [
            { text: 'View Orders', onPress: () => router.replace('/(tabs)/orders') },
            { text: 'Continue Shopping', onPress: () => router.replace('/marketplace') },
          ]
        );
      } catch (error) {
        isSubmittingRef.current = false; setIsProcessing(false);
        Alert.alert('Error', 'Failed to place order. Try again.');
      }
    }, 1200);
  };

  if (items.length === 0 && !isOrderPlacedRef.current) return null;

  const inputStyle = (field: string) => [styles.input, focusedField === field && styles.inputFocused];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Steps */}
      <View style={styles.stepRow}>
        <View style={styles.stepDone}><Text style={styles.stepDoneText}>✓</Text></View>
        <View style={styles.stepLineDone} />
        <LinearGradient colors={Colors.gradientPrimary} style={styles.stepActive}>
          <Text style={styles.stepActiveText}>2</Text>
        </LinearGradient>
        <View style={styles.stepLineNext} />
        <View style={styles.stepNext}><Text style={styles.stepNextText}>3</Text></View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Delivery Form */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>📍 Delivery Address</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput style={inputStyle('name')} value={fullName} onChangeText={setFullName}
              placeholder="John Doe" placeholderTextColor={Colors.textLight}
              onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            <TextInput style={inputStyle('phone')} value={phone} onChangeText={setPhone}
              placeholder="10-digit number" placeholderTextColor={Colors.textLight}
              keyboardType="phone-pad" maxLength={10}
              onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <TextInput style={inputStyle('email')} value={email} onChangeText={setEmail}
              placeholder="you@email.com" placeholderTextColor={Colors.textLight}
              keyboardType="email-address" autoCapitalize="none"
              onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Address</Text>
            <TextInput style={[...inputStyle('addr'), styles.textArea]} value={address}
              onChangeText={setAddress} placeholder="House, Street, Area"
              placeholderTextColor={Colors.textLight} multiline numberOfLines={3}
              onFocus={() => setFocusedField('addr')} onBlur={() => setFocusedField(null)} />
          </View>
          <View style={styles.row}>
            <View style={[styles.fieldGroup, { flex: 1, marginRight: Space.sm }]}>
              <Text style={styles.fieldLabel}>City</Text>
              <TextInput style={inputStyle('city')} value={city} onChangeText={setCity}
                placeholder="City" placeholderTextColor={Colors.textLight}
                onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)} />
            </View>
            <View style={[styles.fieldGroup, { flex: 1, marginLeft: Space.sm }]}>
              <Text style={styles.fieldLabel}>Pincode</Text>
              <TextInput style={inputStyle('pin')} value={pincode} onChangeText={setPincode}
                placeholder="6-digit" placeholderTextColor={Colors.textLight}
                keyboardType="number-pad" maxLength={6}
                onFocus={() => setFocusedField('pin')} onBlur={() => setFocusedField(null)} />
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>📋 Order Summary</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Image source={{ uri: item.product.image }} style={styles.summaryImg} />
              <View style={{ flex: 1, marginLeft: Space.md }}>
                <Text style={styles.summaryName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.summaryQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.summaryPrice}>{formatPrice(item.product.basePrice * item.quantity)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}><Text style={styles.totalRowLabel}>Subtotal</Text><Text style={styles.totalRowVal}>{formatPrice(totalAmount)}</Text></View>
          <View style={styles.totalRow}><Text style={styles.totalRowLabel}>Delivery</Text><View style={styles.freePill}><Text style={styles.freeText}>FREE</Text></View></View>
          <View style={styles.totalRow}><Text style={styles.totalRowLabel}>GST (18%)</Text><Text style={styles.totalRowVal}>{formatPrice(tax)}</Text></View>

          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandVal}>{formatPrice(grandTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomPrice}>{formatPrice(grandTotal)}</Text>
        </View>
        <Pressable
          onPress={handlePlaceOrder} disabled={isProcessing}
          style={({ pressed }) => [pressed && !isProcessing && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient
            colors={isProcessing ? (['#D1D5DB', '#9CA3AF'] as const) : Colors.gradientPrimary}
            style={styles.placeBtn}
          >
            {isProcessing ? (
              <><ActivityIndicator size="small" color="#FFF" /><Text style={styles.placeBtnText}>Processing...</Text></>
            ) : (
              <><Text style={styles.placeBtnText}>Place Order</Text><Text style={styles.placeCheck}>✓</Text></>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.lg, paddingVertical: Space.md,
    backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: { width: 40, height: 40, borderRadius: 14, backgroundColor: Colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, color: Colors.text, fontWeight: '500' },
  headerTitle: { ...Fonts.h3, color: Colors.text },

  // Steps
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Space.lg, backgroundColor: Colors.card, gap: Space.xs },
  stepDone: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center' },
  stepDoneText: { fontSize: 15, color: '#FFF', fontWeight: '700' },
  stepActive: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stepActiveText: { fontSize: 14, color: '#FFF', fontWeight: '700' },
  stepNext: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.cardAlt, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.border },
  stepNextText: { fontSize: 14, color: Colors.textLight, fontWeight: '600' },
  stepLineDone: { width: 44, height: 2.5, backgroundColor: Colors.green, borderRadius: 2 },
  stepLineNext: { width: 44, height: 2.5, backgroundColor: Colors.border, borderRadius: 2 },

  // Form
  formCard: {
    backgroundColor: Colors.card, marginHorizontal: Space.lg,
    marginTop: Space.lg, padding: Space.xl, borderRadius: Radii.xl, ...Shadow.card,
  },
  sectionTitle: { ...Fonts.h3, color: Colors.text, marginBottom: Space.lg },
  fieldGroup: { marginBottom: Space.lg },
  fieldLabel: { ...Fonts.captionBold, color: Colors.textMuted, marginBottom: Space.sm },
  input: {
    backgroundColor: Colors.cardAlt, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radii.md, paddingHorizontal: Space.lg, paddingVertical: Space.md,
    fontSize: 15, color: Colors.text,
  },
  inputFocused: { borderColor: Colors.accent, backgroundColor: Colors.card },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: Space.md },
  row: { flexDirection: 'row' },

  // Summary Items
  summaryItem: { flexDirection: 'row', alignItems: 'center', marginBottom: Space.md },
  summaryImg: { width: 48, height: 48, borderRadius: Radii.sm, backgroundColor: Colors.cardAlt },
  summaryName: { ...Fonts.captionBold, color: Colors.text },
  summaryQty: { ...Fonts.tiny, color: Colors.textMuted, marginTop: 2 },
  summaryPrice: { ...Fonts.captionBold, color: Colors.text },

  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Space.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Space.sm },
  totalRowLabel: { ...Fonts.body, color: Colors.textMuted },
  totalRowVal: { ...Fonts.bodySemibold, color: Colors.text },
  freePill: { backgroundColor: Colors.greenLight, paddingHorizontal: Space.sm, paddingVertical: 3, borderRadius: Radii.sm },
  freeText: { ...Fonts.tinyBold, color: Colors.green },
  grandLabel: { ...Fonts.h3, color: Colors.text },
  grandVal: { ...Fonts.price, color: Colors.accent, fontSize: 20 },

  // Bottom
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: Space.xl, paddingVertical: Space.lg,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    ...Shadow.elevated,
  },
  bottomLabel: { ...Fonts.tiny, color: Colors.textMuted, marginBottom: 2 },
  bottomPrice: { ...Fonts.price, color: Colors.text, fontSize: 20 },
  placeBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Space.xxl,
    paddingVertical: Space.lg, borderRadius: Radii.lg, gap: Space.sm,
  },
  placeBtnText: { ...Fonts.bodySemibold, color: Colors.textWhite },
  placeCheck: { fontSize: 16, color: Colors.textWhite, fontWeight: '700' },
});
