import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { getProducts, getProductsByCategory } from '../../services/marketplaceService';
import { Product } from '../../types/product';
import { useCart } from '../../contexts/CartContext';
import { Colors, Fonts, Space, Radii, Shadow, formatPrice as fmtPrice } from '../../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES: { id: string; name: string; icon: string }[] = [
  { id: 'all', name: 'All', icon: '✦' },
  { id: 'Smartphones', name: 'Phones', icon: '📱' },
  { id: 'Laptops', name: 'Laptops', icon: '💻' },
  { id: 'TVs', name: 'TVs', icon: '📺' },
  { id: 'Audio', name: 'Audio', icon: '🎧' },
  { id: 'Tablets', name: 'Tablets', icon: '📲' },
  { id: 'Wearables', name: 'Watch', icon: '⌚' },
];

export default function MarketplaceListingScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { itemCount } = useCart();

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data =
        selectedCategory === 'all'
          ? await getProducts()
          : await getProductsByCategory(selectedCategory);
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/marketplace/product/${productId}`);
  };

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Skeleton shimmer card
  const renderSkeleton = (index: number) => (
    <View key={`skel-${index}`} style={styles.productCard}>
      <View style={[styles.cardImageContainer, { backgroundColor: '#F0F0F5' }]}>
        <View style={styles.shimmerOverlay} />
      </View>
      <View style={styles.cardContent}>
        <View style={{ width: '50%', height: 10, backgroundColor: '#F0F0F5', borderRadius: 5, marginBottom: 8 }} />
        <View style={{ width: '80%', height: 12, backgroundColor: '#F0F0F5', borderRadius: 6, marginBottom: 6 }} />
        <View style={{ width: '65%', height: 12, backgroundColor: '#F0F0F5', borderRadius: 6, marginBottom: 12 }} />
        <View style={{ width: '45%', height: 18, backgroundColor: '#F0F0F5', borderRadius: 6 }} />
      </View>
    </View>
  );

  const renderProductCard = ({ item }: { item: Product }) => {
    const lowestEMI =
      item.emiPlans && item.emiPlans.length > 0
        ? Math.min(...item.emiPlans.map((plan) => plan.monthlyAmount))
        : null;
    const hasDiscount = item.discount && item.discount > 0;

    return (
      <Pressable
        style={({ pressed }) => [styles.productCard, pressed && styles.productCardPressed]}
        onPress={() => handleProductPress(item.id)}
      >
        {/* Image */}
        <View style={styles.cardImageContainer}>
          <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
          {hasDiscount && (
            <LinearGradient
              colors={['#EF4444', '#DC2626'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.discountBadge}
            >
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </LinearGradient>
          )}
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.brandLabel}>{item.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <LinearGradient
              colors={['#059669', '#047857'] as const}
              style={styles.ratingBadge}
            >
              <Text style={styles.ratingStarText}>★</Text>
              <Text style={styles.ratingNumber}>{item.rating || '4.5'}</Text>
            </LinearGradient>
            <Text style={styles.reviewCount}>
              ({(item.reviewCount || 0).toLocaleString()})
            </Text>
          </View>

          {/* Price Block */}
          <View style={styles.priceBlock}>
            <Text style={styles.currentPrice}>{formatPrice(item.basePrice)}</Text>
            {hasDiscount && item.originalPrice && (
              <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
            )}
          </View>

          {/* EMI Tag */}
          {lowestEMI && (
            <LinearGradient
              colors={['#4F46E5', '#6366F1'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.emiTag}
            >
              <Text style={styles.emiTagLabel}>EMI from </Text>
              <Text style={styles.emiTagAmount}>₹{lowestEMI.toLocaleString('en-IN')}/mo</Text>
            </LinearGradient>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoRow}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED'] as const}
              style={styles.logoBadge}
            >
              <Text style={styles.logoText}>1Fi</Text>
            </LinearGradient>
            <View>
              <Text style={styles.headerTitle}>Marketplace</Text>
              <Text style={styles.headerSubtitle}>Shop with No Cost EMI</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.cartBtn, pressed && { transform: [{ scale: 0.92 }] }]}
          onPress={() => router.push('/cart')}
        >
          <Text style={styles.cartEmoji}>🛒</Text>
          {itemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Category Chips */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <Pressable
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#4F46E5', '#7C3AED'] as const}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.categoryChip}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={[styles.categoryText, styles.categoryTextSelected]}>{cat.name}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[styles.categoryChip, styles.categoryChipDefault]}>
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={styles.categoryText}>{cat.name}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      {error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateEmoji}>😔</Text>
          <Text style={styles.stateTitle}>Something went wrong</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={loadProducts}>
            <LinearGradient colors={['#4F46E5', '#7C3AED'] as const} style={styles.retryGradient}>
              <Text style={styles.retryText}>Try Again</Text>
            </LinearGradient>
          </Pressable>
        </View>
      ) : loading ? (
        <FlatList
          data={[0, 1, 2, 3, 4, 5]}
          renderItem={({ item }) => renderSkeleton(item)}
          keyExtractor={(item) => `skel-${item}`}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsGrid}
          showsVerticalScrollIndicator={false}
        />
      ) : products.length === 0 ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateEmoji}>🔍</Text>
          <Text style={styles.stateTitle}>No products found</Text>
          <Text style={styles.stateText}>Try a different category</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsGrid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {},
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 1,
  },
  cartBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartEmoji: {
    fontSize: 22,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 11,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },

  // Categories
  categoriesWrapper: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 6,
  },
  categoryChipDefault: {
    backgroundColor: '#F3F4F6',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },

  // Products
  productsGrid: {
    padding: 16,
    paddingBottom: 32,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  productCardPressed: {
    transform: [{ scale: 0.97 }],
    shadowOpacity: 0.04,
  },
  cardImageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.95,
    position: 'relative',
    backgroundColor: '#F5F6FA',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EBEBF0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // Card Content
  cardContent: {
    padding: 14,
    paddingTop: 12,
  },
  brandLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 19,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingStarText: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  ratingNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  reviewCount: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 10,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.3,
  },
  originalPrice: {
    fontSize: 12,
    color: '#D1D5DB',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  emiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  emiTagLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  emiTagAmount: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // States
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  stateEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
