import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
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

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🏪', gradient: ['#667eea', '#764ba2'] },
  { id: 'Smartphones', name: 'Phones', icon: '📱', gradient: ['#f093fb', '#f5576c'] },
  { id: 'Laptops', name: 'Laptops', icon: '💻', gradient: ['#4facfe', '#00f2fe'] },
  { id: 'TVs', name: 'TVs', icon: '📺', gradient: ['#43e97b', '#38f9d7'] },
  { id: 'Audio', name: 'Audio', icon: '🎧', gradient: ['#fa709a', '#fee140'] },
  { id: 'Tablets', name: 'Tablets', icon: '📲', gradient: ['#30cfd0', '#330867'] },
  { id: 'Wearables', name: 'Watch', icon: '⌚', gradient: ['#a8edea', '#fed6e3'] },
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
      
      const data = selectedCategory === 'all'
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

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/marketplace/product/${productId}`);
  };

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <Pressable onPress={() => handleCategoryPress(item.id)}>
        <LinearGradient
          colors={isSelected ? item.gradient : ['#FFFFFF', '#F3F4F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.categoryCard,
            isSelected && styles.categoryCardSelected,
          ]}
        >
          <Text style={[
            styles.categoryIcon,
            isSelected && styles.categoryIconSelected
          ]}>
            {item.icon}
          </Text>
          <Text style={[
            styles.categoryName,
            isSelected && styles.categoryNameSelected,
          ]}>
            {item.name}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const lowestEMI = item.emiPlans && item.emiPlans.length > 0
      ? Math.min(...item.emiPlans.map(plan => plan.monthlyAmount))
      : null;

    const hasDiscount = item.discount && item.discount > 0;

    return (
      <Pressable
        style={styles.productCard}
        onPress={() => handleProductPress(item.id)}
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
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
              <Text style={styles.discountText}>{item.discount}% OFF</Text>
            </LinearGradient>
          )}
          {item.inStock && (
            <View style={styles.stockBadge}>
              <View style={styles.stockDot} />
              <Text style={styles.stockText}>In Stock</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.brandText} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {item.rating || 4.5}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount || 0})</Text>
          </View>

          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.currentPrice}>
                {formatPrice(item.basePrice)}
              </Text>
              {hasDiscount && item.originalPrice && (
                <Text style={styles.originalPrice}>
                  {formatPrice(item.originalPrice)}
                </Text>
              )}
            </View>
          </View>

          {lowestEMI && (
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.emiCard}
            >
              <Text style={styles.emiText}>EMI from</Text>
              <Text style={styles.emiAmount}>₹{lowestEMI.toLocaleString()}/mo</Text>
            </LinearGradient>
          )}

          <Pressable
            style={styles.viewDetailsButton}
            onPress={() => handleProductPress(item.id)}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <Text style={styles.arrowIcon}>→</Text>
          </Pressable>
        </View>
      </Pressable>
    );
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
          <Text style={styles.loadingText}>Loading amazing products...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadProducts}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.retryGradient}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#FFFFFF', '#F9FAFB']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>1Fi Marketplace</Text>
            <Text style={styles.headerSubtitle}>Shop with No Cost EMI</Text>
          </View>
          <Pressable style={styles.cartButton} onPress={() => router.push('/(tabs)/cart')}>
            <Text style={styles.cartIcon}>🛒</Text>
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <View key={category.id}>
              {renderCategoryItem({ item: category })}
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Products Grid */}
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>No products found</Text>
          <Text style={styles.emptySubtext}>Try selecting a different category</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productsContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryCardSelected: {
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  categoryIconSelected: {
    transform: [{ scale: 1.1 }],
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  productsContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stockBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  cardContent: {
    padding: 12,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#667eea',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  emiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 10,
  },
  emiText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emiAmount: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667eea',
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#667eea',
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
  retryButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
