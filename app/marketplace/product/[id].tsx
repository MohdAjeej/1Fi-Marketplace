import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Product, ProductVariant, EMIPlan } from '../../../types/product';
import { getProductById } from '../../../services/marketplaceService';
import { useCart } from '../../../contexts/CartContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedEMIPlan, setSelectedEMIPlan] = useState<EMIPlan | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductById(id);
      if (data) {
        setProduct(data);
        // Pre-select first variant option for each variant type
        const initialVariants: Record<string, string> = {};
        data.variants.forEach((variantGroup) => {
          if (variantGroup.options.length > 0) {
            initialVariants[variantGroup.type] = variantGroup.options[0].id;
          }
        });
        setSelectedVariants(initialVariants);
        // Pre-select recommended EMI plan (6 months if available)
        const recommendedPlan = data.emiPlans.find((plan) => plan.tenure === 6) || data.emiPlans[0];
        setSelectedEMIPlan(recommendedPlan);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variantType: string, variantId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: variantId,
    }));
  };

  const handleEMISelect = (plan: EMIPlan) => {
    setSelectedEMIPlan(plan);
  };

  const handleContinue = () => {
    if (!product || !selectedEMIPlan) return;

    // Validate all variants are selected
    const allVariantsSelected = product.variants.every(
      (variantGroup) => selectedVariants[variantGroup.type]
    );

    if (!allVariantsSelected) {
      Alert.alert('Selection Required', 'Please select all product options');
      return;
    }

    // Add to cart
    addToCart(product, selectedVariants, selectedEMIPlan, 1);

    Alert.alert(
      'Added to Cart! 🛒',
      `${product.name}\nEMI: ₹${selectedEMIPlan.monthlyAmount.toLocaleString('en-IN')}/mo for ${selectedEMIPlan.tenure} months`,
      [
        { text: 'Continue Shopping', style: 'cancel', onPress: () => router.back() },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') },
      ]
    );
  };

  const handleShare = async () => {
    if (!product) return;

    try {
      await Share.share({
        message: `Check out ${product.name} on 1Fi Marketplace! Starting from ₹${product.basePrice.toLocaleString('en-IN')} with No-Cost EMI available.`,
        title: product.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removed from Wishlist' : 'Added to Wishlist',
      isFavorite ? 'Product removed from your wishlist' : 'Product added to your wishlist',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E40AF" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Unable to load product</Text>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
          <Pressable style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const displayPrice = product.basePrice;
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="contain" />
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
          {/* Action Buttons */}
          <View style={styles.imageActions}>
            <Pressable style={styles.actionButton} onPress={toggleFavorite}>
              <Text style={styles.actionIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={handleShare}>
              <Text style={styles.actionIcon}>📤</Text>
            </Pressable>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.contentContainer}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          {product.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
              </Text>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{displayPrice.toLocaleString('en-IN')}</Text>
              {hasDiscount && product.originalPrice && (
                <View style={styles.priceInfo}>
                  <Text style={styles.originalPrice}>
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </Text>
                  <Text style={styles.savings}>
                    Save ₹{(product.originalPrice - displayPrice).toLocaleString('en-IN')}
                  </Text>
                </View>
              )}
            </View>
            {!product.inStock && (
              <View style={styles.outOfStockBanner}>
                <Text style={styles.outOfStockText}>Currently Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Variants */}
          {product.variants.map((variantGroup) => (
            <View key={variantGroup.type} style={styles.variantSection}>
              <Text style={styles.variantTitle}>
                {variantGroup.type}
                <Text style={styles.variantSelected}>
                  {' '}
                  -{' '}
                  {
                    variantGroup.options.find(
                      (opt) => opt.id === selectedVariants[variantGroup.type]
                    )?.value
                  }
                </Text>
              </Text>
              <View style={styles.variantOptions}>
                {variantGroup.options.map((option) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.variantOption,
                      selectedVariants[variantGroup.type] === option.id &&
                        styles.variantOptionSelected,
                    ]}
                    onPress={() => handleVariantSelect(variantGroup.type, option.id)}
                  >
                    <Text
                      style={[
                        styles.variantOptionText,
                        selectedVariants[variantGroup.type] === option.id &&
                          styles.variantOptionTextSelected,
                      ]}
                    >
                      {option.value}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))}

          {/* Highlights */}
          {product.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              {product.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <Text style={styles.highlightBullet}>•</Text>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              {Object.entries(product.specifications).map(([key, value]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* EMI Plans */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your EMI Plan</Text>
            <Text style={styles.sectionSubtitle}>No Cost EMI backed by mutual funds</Text>
            <View style={styles.emiPlansContainer}>
              {product.emiPlans.map((plan) => (
                <Pressable
                  key={plan.id}
                  style={[
                    styles.emiPlan,
                    selectedEMIPlan?.id === plan.id && styles.emiPlanSelected,
                  ]}
                  onPress={() => handleEMISelect(plan)}
                >
                  <View style={styles.emiPlanHeader}>
                    <View style={styles.emiPlanInfo}>
                      <Text style={styles.emiTenure}>{plan.tenure} Months</Text>
                      <Text style={styles.emiAmount}>
                        ₹{plan.monthlyAmount.toLocaleString('en-IN')} / month
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radioButton,
                        selectedEMIPlan?.id === plan.id && styles.radioButtonSelected,
                      ]}
                    >
                      {selectedEMIPlan?.id === plan.id && <View style={styles.radioButtonInner} />}
                    </View>
                  </View>
                  {plan.isNoCost && (
                    <View style={styles.noCostBadge}>
                      <Text style={styles.noCostText}>No Cost EMI</Text>
                    </View>
                  )}
                  <View style={styles.emiPlanDetails}>
                    <Text style={styles.emiDetailText}>
                      Total: ₹{plan.totalAmount.toLocaleString('en-IN')}
                    </Text>
                    <Text style={styles.emiDetailText}>Interest: {plan.interestRate}%</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          {selectedEMIPlan && (
            <>
              <Text style={styles.bottomLabel}>Monthly EMI</Text>
              <Text style={styles.bottomPrice}>
                ₹{selectedEMIPlan.monthlyAmount.toLocaleString('en-IN')}/mo
              </Text>
              <Text style={styles.bottomTenure}>for {selectedEMIPlan.tenure} months</Text>
            </>
          )}
        </View>
        <Pressable
          style={[styles.continueButton, !product.inStock && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!product.inStock}
        >
          <Text style={styles.continueButtonText}>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.8,
    backgroundColor: '#F9FAFB',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  imageActions: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    fontSize: 24,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 30,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingStar: {
    fontSize: 16,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  savings: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  outOfStockBanner: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  outOfStockText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
  },
  variantSection: {
    marginBottom: 24,
  },
  variantTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  variantSelected: {
    color: '#1E40AF',
  },
  variantOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  variantOptionSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  variantOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  variantOptionTextSelected: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  highlightItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  highlightBullet: {
    fontSize: 16,
    color: '#1E40AF',
    marginRight: 8,
    fontWeight: '700',
  },
  highlightText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    flex: 1,
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  specKey: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  emiPlansContainer: {
    gap: 12,
  },
  emiPlan: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  emiPlanSelected: {
    borderColor: '#1E40AF',
    backgroundColor: '#EFF6FF',
  },
  emiPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emiPlanInfo: {
    flex: 1,
  },
  emiTenure: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  emiAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#1E40AF',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E40AF',
  },
  noCostBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  noCostText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  emiPlanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emiDetailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomInfo: {
    flex: 1,
    marginRight: 16,
  },
  bottomLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  bottomPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E40AF',
  },
  bottomTenure: {
    fontSize: 12,
    color: '#6B7280',
  },
  continueButton: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
