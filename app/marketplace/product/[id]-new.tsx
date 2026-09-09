import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Product, EMIPlan } from '../../../types/product';
import { getProductById } from '../../../services/marketplaceService';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

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
        
        // Pre-select first variant
        const initialVariants: Record<string, string> = {};
        data.variants.forEach((variantGroup) => {
          if (variantGroup.options.length > 0) {
            initialVariants[variantGroup.type] = variantGroup.options[0].id;
          }
        });
        setSelectedVariants(initialVariants);
        
        // Pre-select 6-month EMI plan
        const sixMonthPlan = data.emiPlans.find((plan) => plan.tenure === 6);
        setSelectedEMIPlan(sixMonthPlan || data.emiPlans[0] || null);
      }
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleVariantSelect = (variantType: string, optionId: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: optionId,
    }));
  };

  const handleEMISelect = (plan: EMIPlan) => {
    setSelectedEMIPlan(plan);
  };

  const handleContinue = () => {
    if (!product) return;

    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This product is currently unavailable.');
      return;
    }

    const allVariantsSelected = product.variants.every(
      (variant) => selectedVariants[variant.type]
    );

    if (!allVariantsSelected) {
      Alert.alert('Select Options', 'Please select all product options to continue.');
      return;
    }

    if (!selectedEMIPlan) {
      Alert.alert('Select EMI Plan', 'Please choose a payment plan to continue.');
      return;
    }

    Alert.alert(
      'Added to Cart! 🎉',
      `${product.name} has been added to your cart with ${selectedEMIPlan.tenure}-month EMI plan.`,
      [{ text: 'Great!', style: 'default' }]
    );
  };

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient
          colors={['#FFFFFF', '#F9FAFB']}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const hasDiscount = product.discount && product.discount > 0;
  const savings = hasDiscount && product.originalPrice
    ? product.originalPrice - product.basePrice
    : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#FFFFFF', '#F9FAFB']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <Pressable style={styles.headerButton} onPress={() => router.back()}>
              <Text style={styles.headerIcon}>←</Text>
            </Pressable>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {product.name}
            </Text>
            <Pressable
              style={styles.headerButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Text style={styles.headerIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {hasDiscount && (
            <LinearGradient
              colors={['#FF6B6B', '#EE5A6F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.discountBadge}
            >
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </LinearGradient>
          )}
        </View>

        {/* Product Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>⭐ {product.rating || 4.5}</Text>
              <Text style={styles.reviewCount}>({product.reviewCount || 0} reviews)</Text>
            </View>
            {product.inStock ? (
              <View style={styles.stockBadge}>
                <View style={styles.stockDot} />
                <Text style={styles.stockText}>In Stock</Text>
              </View>
            ) : (
              <View style={[styles.stockBadge, styles.outOfStockBadge]}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
          </View>

          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{formatPrice(product.basePrice)}</Text>
              {hasDiscount && product.originalPrice && (
                <Text style={styles.originalPrice}>
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
            </View>
            {savings > 0 && (
              <Text style={styles.savingsText}>
                You save {formatPrice(savings)}!
              </Text>
            )}
          </View>
        </View>

        {/* Variants Selection */}
        {product.variants.map((variantGroup) => (
          <View key={variantGroup.type} style={styles.variantSection}>
            <Text style={styles.sectionTitle}>
              Select {variantGroup.type}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.variantOptions}
            >
              {variantGroup.options.map((option) => {
                const isSelected = selectedVariants[variantGroup.type] === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => handleVariantSelect(variantGroup.type, option.id)}
                  >
                    <LinearGradient
                      colors={isSelected ? ['#667eea', '#764ba2'] : ['#FFFFFF', '#F3F4F6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[
                        styles.variantOption,
                        isSelected && styles.variantOptionSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.variantText,
                          isSelected && styles.variantTextSelected,
                        ]}
                      >
                        {option.name}
                      </Text>
                      {Boolean(option.priceModifier && option.priceModifier > 0) && (
                        <Text
                          style={[
                            styles.modifierText,
                            isSelected && styles.modifierTextSelected,
                          ]}
                        >
                          +{formatPrice(option.priceModifier || 0)}
                        </Text>
                      )}
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ))}

        {/* Product Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Product Highlights</Text>
          {product.highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightRow}>
              <Text style={styles.bulletPoint}>✓</Text>
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>

        {/* Specifications */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          {Object.entries(product.specifications as Record<string, string>).map(
            ([key, value]) => (
              <View key={key} style={styles.specRow}>
                <Text style={styles.specKey}>{key}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            )
          )}
        </View>

        {/* EMI Plans */}
        <View style={styles.emiSection}>
          <Text style={styles.sectionTitle}>Choose Payment Plan</Text>
          <Text style={styles.emiSubtitle}>Select your No Cost EMI option</Text>

          {product.emiPlans.map((plan) => {
            const isSelected = selectedEMIPlan?.id === plan.id;
            return (
              <Pressable
                key={plan.id}
                onPress={() => handleEMISelect(plan)}
                style={styles.emiPlanWrapper}
              >
                <LinearGradient
                  colors={isSelected ? ['#667eea', '#764ba2'] : ['#FFFFFF', '#FFFFFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.emiPlanCard,
                    isSelected && styles.emiPlanSelected,
                  ]}
                >
                  <View style={styles.emiPlanLeft}>
                    <View style={styles.radioButton}>
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                    <View style={styles.emiPlanInfo}>
                      <Text
                        style={[
                          styles.emiPlanAmount,
                          isSelected && styles.emiPlanAmountSelected,
                        ]}
                      >
                        ₹{plan.monthlyAmount.toLocaleString()}/month
                      </Text>
                      <Text
                        style={[
                          styles.emiPlanTenure,
                          isSelected && styles.emiPlanTenureSelected,
                        ]}
                      >
                        {plan.tenure} months
                      </Text>
                    </View>
                  </View>
                  {plan.isNoCost && (
                    <View style={[
                      styles.noCostBadge,
                      isSelected && styles.noCostBadgeSelected
                    ]}>
                      <Text style={[
                        styles.noCostText,
                        isSelected && styles.noCostTextSelected
                      ]}>
                        No Cost
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <LinearGradient
        colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
        style={styles.bottomBar}
      >
        <SafeAreaView edges={['bottom']}>
          <View style={styles.bottomContent}>
            <View style={styles.bottomLeft}>
              {selectedEMIPlan && (
                <>
                  <Text style={styles.bottomLabel}>Monthly EMI</Text>
                  <Text style={styles.bottomPrice}>
                    ₹{selectedEMIPlan.monthlyAmount.toLocaleString()}/mo
                  </Text>
                  <Text style={styles.bottomTenure}>
                    for {selectedEMIPlan.tenure} months
                  </Text>
                </>
              )}
            </View>
            <Pressable
              onPress={handleContinue}
              disabled={!product.inStock}
              style={styles.continueButtonWrapper}
            >
              <LinearGradient
                colors={
                  product.inStock
                    ? ['#667eea', '#764ba2']
                    : ['#9CA3AF', '#6B7280']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>
                  {product.inStock ? 'Add to Cart →' : 'Out of Stock'}
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: -24,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  brandText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 13,
    color: '#6B7280',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  outOfStockBadge: {
    backgroundColor: '#FEF2F2',
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  priceSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  variantSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  variantOptions: {
    paddingVertical: 4,
  },
  variantOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 100,
    alignItems: 'center',
  },
  variantOptionSelected: {
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  variantText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  variantTextSelected: {
    color: '#FFFFFF',
  },
  modifierText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  modifierTextSelected: {
    color: '#FFFFFF',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  highlightRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '700',
    marginRight: 12,
  },
  highlightText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
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
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  emiSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  emiSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  emiPlanWrapper: {
    marginBottom: 12,
  },
  emiPlanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  emiPlanSelected: {
    borderColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  emiPlanLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  emiPlanInfo: {},
  emiPlanAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emiPlanAmountSelected: {
    color: '#FFFFFF',
  },
  emiPlanTenure: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  emiPlanTenureSelected: {
    color: '#FFFFFF',
  },
  noCostBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  noCostBadgeSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  noCostText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  noCostTextSelected: {
    color: '#FFFFFF',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  bottomLeft: {
    flex: 1,
  },
  bottomLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  bottomTenure: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  continueButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
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
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
