import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCart } from '../../contexts/CartContext';
import { useOrders } from '../../contexts/OrdersContext';

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

  // Redirect to cart if no items - must be in useEffect to avoid render issues
  useEffect(() => {
    if (items.length === 0) {
      router.replace('/(tabs)/cart');
    }
  }, [items.length, router]);

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!fullName || !phone || !email || !address || !city || !pincode) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (pincode.length !== 6) {
      Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      try {
        // Convert cart items to order items
        const orderItems = items.map(item => ({
          id: item.id,
          productName: item.product.name,
          productImage: item.product.images?.[0],
          quantity: item.quantity,
          price: item.product.basePrice,
          totalPrice: item.product.basePrice * item.quantity,
        }));

        // Create delivery address object
        const deliveryAddress = {
          fullName,
          phone,
          email,
          address,
          city,
          pincode,
        };

        // Add order to context
        const newOrder = addOrder(orderItems, totalAmount * 1.18, deliveryAddress);
        
        setIsProcessing(false);

        Alert.alert(
          '🎉 Order Placed Successfully!',
          `Order ID: ${newOrder.orderNumber}\n\nYour order will be delivered in 3-5 business days.\n\nThank you for shopping with 1Fi!`,
          [
            {
              text: 'View Orders',
              onPress: () => {
                clearCart();
                router.replace('/(tabs)/orders');
              },
            },
            {
              text: 'Continue Shopping',
              onPress: () => {
                clearCart();
                router.replace('/(tabs)/index');
              },
            },
          ]
        );
      } catch (error) {
        setIsProcessing(false);
        Alert.alert('Error', 'Failed to place order. Please try again.');
        console.error('Order placement error:', error);
      }
    }, 2000);
  };

  // Don't render if no items (redirect will happen in useEffect)
  if (items.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSubtitle}>Complete your order</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="10-digit mobile number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Delivery Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={address}
              onChangeText={setAddress}
              placeholder="House/Flat No., Street, Area"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Pincode *</Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                placeholder="6-digit pincode"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({items.length})</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalAmount)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charges</Text>
              <Text style={[styles.summaryValue, styles.freeText]}>FREE</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>GST (18%)</Text>
              <Text style={styles.summaryValue}>{formatPrice(totalAmount * 0.18)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>{formatPrice(totalAmount * 1.18)}</Text>
            </View>

            <LinearGradient
              colors={['#FEF3C7', '#FDE68A']}
              style={styles.emiCard}
            >
              <Text style={styles.emiIcon}>✨</Text>
              <Text style={styles.emiText}>
                No-Cost EMI selected • Your mutual funds cover the interest
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomLabel}>Total Payable</Text>
          <Text style={styles.bottomAmount}>{formatPrice(totalAmount * 1.18)}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.placeOrderButton,
            pressed && styles.placeOrderButtonPressed,
            isProcessing && styles.placeOrderButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={isProcessing ? ['#9CA3AF', '#6B7280'] : ['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.placeOrderGradient}
          >
            <Text style={styles.placeOrderText}>
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Text>
            {!isProcessing && <Text style={styles.placeOrderIcon}>✓</Text>}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  row: {
    flexDirection: 'row',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
  emiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  emiIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  emiText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
  },
  bottomBar: {
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
  bottomInfo: {
    marginRight: 16,
  },
  bottomLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  bottomAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  placeOrderButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  placeOrderButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  placeOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  placeOrderText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  placeOrderIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
