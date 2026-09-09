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
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Product, EMIPlan } from '../../../types/product';
import { getProductById } from '../../../services/marketplaceService';
import { useCart } from '../../../contexts/CartContext';
import { Colors, Fonts, Space, Radii, Shadow, formatPrice as fmtPrice } from '../../../constants/theme';

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
  const { addToCart, itemCount } = useCart();

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
        const initialVariants: Record<string, string> = {};
        data.variants.forEach((variantGroup) => {
          if (variantGroup.options.length > 0) {
            initialVariants[variantGroup.type] = variantGroup.options[0].id;
          }
        });
        setSelectedVariants(initialVariants);
        const recommendedPlan =
          data.emiPlans.find((plan) => plan.tenure === 6) || data.emiPlans[0];
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
    setSelectedVariants((prev) => ({ ...prev, [variantType]: variantId }));
  };

  const handleEMISelect = (plan: EMIPlan) => {
    setSelectedEMIPlan(plan);
  };

  const formatPrice = (price: number): string =>
    `₹${Math.round(price).toLocaleString('en-IN')}`;

  const handleContinue = () => {
    if (!product || !selectedEMIPlan) return;

    const allVariantsSelected = product.variants.every(
      (variantGroup) => selectedVariants[variantGroup.type]
    );

    if (!allVariantsSelected) {
      Alert.alert('Selection Required', 'Please select all product options');
      return;
    }

    addToCart(product, selectedVariants, selectedEMIPlan, 1);

    Alert.alert(
      'Added to Cart ✓',
      `${product.name}\nEMI: ₹${selectedEMIPlan.monthlyAmount.toLocaleString('en-IN')}/mo × ${selectedEMIPlan.tenure} months`,
      [
        { text: 'Continue Shopping', style: 'cancel', onPress: () => router.navigate('/marketplace') },
        { text: 'View Cart', onPress: () => router.push('/cart') },
      ]
    );
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `Check out ${product.name} on 1Fi Marketplace! Starting from ₹${product.basePrice.toLocaleString('en-IN')} with No-Cost EMI.`,
        title: product.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingWrap}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>😔</Text>
          <Text style={styles.errorTitle}>{error || 'Product not found'}</Text>
          <Pressable onPress={() => router.back()} style={styles.errorBtn}>
            <Text style={styles.errorBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const variantPriceModifier = Object.values(selectedVariants).reduce((total, variantId) => {
    const variant = product.variants.flatMap((v) => v.options).find((opt) => opt.id === variantId);
    return total + (variant?.priceModifier || 0);
  }, 0);
  const displayPrice = product.basePrice + variantPriceModifier;
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Navigation */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.navBtn, pressed && { backgroundColor: '#E5E7EB' }]}
        >
          <Text style={styles.navBtnIcon}>←</Text>
        </Pressable>
        <View style={styles.navCenter}>
          <Text style={styles.navBrand} numberOfLines={1}>{product.brand}</Text>
        </View>
        <View style={styles.navRight}>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.navBtn, pressed && { backgroundColor: '#E5E7EB' }]}
          >
            <Text style={styles.navBtnIcon}>↗</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/cart')}
            style={({ pressed }) => [styles.navBtn, pressed && { backgroundColor: '#E5E7EB' }]}
          >
            <Text style={{ fontSize: 20 }}>🛒</Text>
            {itemCount > 0 && (
              <View style={styles.navCartBadge}>
                <Text style={styles.navCartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Product Image Hero */}
        <View style={styles.heroSection}>
          <Image source={{ uri: product.image }} style={styles.heroImage} resizeMode="contain" />
          {hasDiscount && (
            <LinearGradient colors={['#EF4444', '#DC2626'] as const} style={styles.heroDiscountBadge}>
              <Text style={styles.heroDiscountText}>{product.discount}% OFF</Text>
            </LinearGradient>
          )}
          <Pressable
            style={[styles.heartBtn, isFavorite && styles.heartBtnActive]}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Text style={{ fontSize: 22, color: isFavorite ? '#EF4444' : '#9CA3AF' }}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoBrand}>{product.brand}</Text>
          <Text style={styles.infoName}>{product.name}</Text>

          {/* Rating */}
          {product.rating && (
            <View style={styles.ratingRow}>
              <LinearGradient colors={['#059669', '#047857'] as const} style={styles.ratingBadge}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingVal}>{product.rating.toFixed(1)}</Text>
              </LinearGradient>
              <Text style={styles.ratingReviews}>
                {(product.reviewCount || 0).toLocaleString()} ratings
              </Text>
            </View>
          )}

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.priceMain}>{formatPrice(displayPrice)}</Text>
            {hasDiscount && product.originalPrice && (
              <View style={styles.priceRow}>
                <Text style={styles.priceOriginal}>
                  MRP {formatPrice(product.originalPrice + variantPriceModifier)}
                </Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveText}>
                    Save {formatPrice(product.originalPrice - product.basePrice)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {!product.inStock && (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Currently Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Variants */}
        {product.variants.map((variantGroup) => (
          <View key={variantGroup.type} style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{variantGroup.type}</Text>
            <View style={styles.chipGrid}>
              {variantGroup.options.map((option) => {
                const isSelected = selectedVariants[variantGroup.type] === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => handleVariantSelect(variantGroup.type, option.id)}
                  >
                    {isSelected ? (
                      <LinearGradient
                        colors={['#4F46E5', '#6366F1'] as const}
                        style={styles.variantChip}
                      >
                        <Text style={[styles.variantLabel, { color: '#FFFFFF' }]}>{option.value}</Text>
                        {option.priceModifier !== undefined && option.priceModifier > 0 && (
                          <Text style={[styles.variantMod, { color: 'rgba(255,255,255,0.8)' }]}>
                            +{formatPrice(option.priceModifier)}
                          </Text>
                        )}
                      </LinearGradient>
                    ) : (
                      <View style={[styles.variantChip, styles.variantChipDefault]}>
                        <Text style={styles.variantLabel}>{option.value}</Text>
                        {option.priceModifier !== undefined && option.priceModifier > 0 && (
                          <Text style={styles.variantMod}>+{formatPrice(option.priceModifier)}</Text>
                        )}
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        {/* EMI Plans */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionLabelRow}>
            <Text style={styles.sectionLabel}>EMI Plans</Text>
            <View style={styles.noCostBadgeHeader}>
              <Text style={styles.noCostBadgeHeaderText}>✨ No Cost EMI</Text>
            </View>
          </View>
          <Text style={styles.sectionSub}>Backed by your mutual fund investments</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 20 }}>
            {product.emiPlans.map((plan) => {
              const isSelected = selectedEMIPlan?.id === plan.id;
              return (
                <Pressable key={plan.id} onPress={() => handleEMISelect(plan)}>
                  {isSelected ? (
                    <LinearGradient
                      colors={['#4F46E5', '#7C3AED'] as const}
                      style={styles.emiCard}
                    >
                      <View style={styles.emiCheckCircle}>
                        <Text style={styles.emiCheckText}>✓</Text>
                      </View>
                      <Text style={[styles.emiTenure, { color: 'rgba(255,255,255,0.85)' }]}>{plan.tenure} months</Text>
                      <Text style={[styles.emiAmount, { color: '#FFFFFF' }]}>₹{plan.monthlyAmount.toLocaleString('en-IN')}</Text>
                      <Text style={[styles.emiPer, { color: 'rgba(255,255,255,0.7)' }]}>per month</Text>
                      {plan.isNoCost && (
                        <View style={[styles.noCostPill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                          <Text style={[styles.noCostPillText, { color: '#FFFFFF' }]}>No Cost</Text>
                        </View>
                      )}
                    </LinearGradient>
                  ) : (
                    <View style={[styles.emiCard, styles.emiCardDefault]}>
                      <Text style={styles.emiTenure}>{plan.tenure} months</Text>
                      <Text style={styles.emiAmount}>₹{plan.monthlyAmount.toLocaleString('en-IN')}</Text>
                      <Text style={styles.emiPer}>per month</Text>
                      {plan.isNoCost && (
                        <View style={styles.noCostPill}>
                          <Text style={styles.noCostPillText}>No Cost</Text>
                        </View>
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Key Features */}
        {product.highlights.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Key Features</Text>
            {product.highlights.map((h, i) => (
              <View key={i} style={styles.featureItem}>
                <LinearGradient colors={['#10B981', '#059669'] as const} style={styles.featureCheckCircle}>
                  <Text style={styles.featureCheckMark}>✓</Text>
                </LinearGradient>
                <Text style={styles.featureText}>{h}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.descText}>{product.description}</Text>
        </View>

        {/* Specifications */}
        {Object.keys(product.specifications).length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Specifications</Text>
            {Object.entries(product.specifications).map(([key, value], index) => (
              <View key={key} style={[styles.specRow, index % 2 === 0 && styles.specRowAlt]}>
                <Text style={styles.specKey}>{key}</Text>
                <Text style={styles.specValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          {selectedEMIPlan && (
            <>
              <Text style={styles.bottomEmiLabel}>Monthly EMI</Text>
              <Text style={styles.bottomEmiPrice}>
                {formatPrice(selectedEMIPlan.monthlyAmount)}
                <Text style={styles.bottomEmiTenure}> ×{selectedEMIPlan.tenure}mo</Text>
              </Text>
            </>
          )}
        </View>
        <Pressable
          onPress={handleContinue}
          disabled={!product.inStock}
          style={({ pressed }) => [pressed && product.inStock && { transform: [{ scale: 0.97 }] }]}
        >
          <LinearGradient
            colors={product.inStock ? (['#4F46E5', '#7C3AED'] as const) : (['#D1D5DB', '#9CA3AF'] as const)}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addToCartBtn}
          >
            <Text style={styles.addToCartText}>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Text>
            {product.inStock && <Text style={styles.addToCartArrow}>→</Text>}
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FC' },

  // Loading / Error
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { fontSize: 14, color: '#9CA3AF', marginTop: 14 },
  errorTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 20 },
  errorBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  errorBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  // Nav
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  navBtn: {
    width: 42, height: 42, borderRadius: 14, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  navBtnIcon: { fontSize: 22, color: '#111827', fontWeight: '500' },
  navCenter: { flex: 1, alignItems: 'center' },
  navBrand: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1.2 },
  navRight: { flexDirection: 'row', gap: 8 },
  navCartBadge: {
    position: 'absolute', top: -3, right: -3, backgroundColor: '#EF4444',
    borderRadius: 9, minWidth: 18, height: 18, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: '#FFFFFF',
  },
  navCartBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800' },

  // Hero Image
  heroSection: {
    width: '100%', height: width * 0.8, backgroundColor: '#FFFFFF',
    justifyContent: 'center', alignItems: 'center', position: 'relative',
  },
  heroImage: { width: '100%', height: '100%' },
  heroDiscountBadge: {
    position: 'absolute', top: 16, left: 16,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
  },
  heroDiscountText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  heartBtn: {
    position: 'absolute', top: 16, right: 16, width: 46, height: 46,
    borderRadius: 23, backgroundColor: '#FFFFFF', justifyContent: 'center',
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 6, elevation: 4,
  },
  heartBtnActive: { backgroundColor: '#FEF2F2' },

  // Info
  infoSection: {
    padding: 20, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
  },
  infoBrand: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  infoName: { fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: -0.5, lineHeight: 30, marginBottom: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  ratingStar: { fontSize: 12, color: '#FFFFFF' },
  ratingVal: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  ratingReviews: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  priceSection: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
  priceMain: { fontSize: 30, fontWeight: '800', color: '#111827', letterSpacing: -0.5, marginBottom: 6 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  priceOriginal: { fontSize: 15, color: '#D1D5DB', textDecorationLine: 'line-through' },
  saveBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  saveText: { fontSize: 12, fontWeight: '700', color: '#059669' },
  outOfStock: { backgroundColor: '#FEF2F2', padding: 12, borderRadius: 10, marginTop: 12 },
  outOfStockText: { fontSize: 14, fontWeight: '600', color: '#EF4444', textAlign: 'center' },

  // Section Cards
  sectionCard: { backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingVertical: 18, marginTop: 8 },
  sectionLabel: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 14, letterSpacing: -0.2 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sectionSub: { fontSize: 13, color: '#9CA3AF', marginBottom: 16, marginTop: -8 },
  noCostBadgeHeader: { backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  noCostBadgeHeaderText: { fontSize: 11, fontWeight: '700', color: '#92400E' },

  // Variants
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  variantChip: {
    paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  variantChipDefault: { backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: '#E5E7EB' },
  variantLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  variantMod: { fontSize: 12, fontWeight: '500', color: '#9CA3AF' },

  // EMI
  emiCard: {
    width: 150, padding: 18, borderRadius: 16, alignItems: 'center', position: 'relative',
  },
  emiCardDefault: {
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  emiCheckCircle: {
    position: 'absolute', top: 10, right: 10, width: 22, height: 22,
    borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  emiCheckText: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  emiTenure: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8 },
  emiAmount: { fontSize: 20, fontWeight: '800', color: '#111827' },
  emiPer: { fontSize: 11, fontWeight: '500', color: '#9CA3AF', marginTop: 2 },
  noCostPill: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  noCostPillText: { fontSize: 11, fontWeight: '700', color: '#059669' },

  // Features
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  featureCheckCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  featureCheckMark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  featureText: { fontSize: 15, color: '#4B5563', lineHeight: 22, flex: 1 },

  // Description
  descText: { fontSize: 15, color: '#6B7280', lineHeight: 24 },

  // Specs
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8 },
  specRowAlt: { backgroundColor: '#F9FAFB', borderRadius: 8 },
  specKey: { fontSize: 13, color: '#6B7280', flex: 1 },
  specValue: { fontSize: 13, fontWeight: '600', color: '#111827', flex: 1, textAlign: 'right' },

  // Bottom Bar
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F3F4F6',
    paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 12,
  },
  bottomLeft: {},
  bottomEmiLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 },
  bottomEmiPrice: { fontSize: 20, fontWeight: '800', color: '#4F46E5' },
  bottomEmiTenure: { fontSize: 13, fontWeight: '400', color: '#9CA3AF' },
  addToCartBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28,
    paddingVertical: 16, borderRadius: 16, gap: 8,
  },
  addToCartText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  addToCartArrow: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
