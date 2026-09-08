import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';

type ShopTab = 'brands' | 'stores' | 'marketplace';

export default function ShopScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ShopTab>('marketplace');

  const handleMarketplacePress = () => {
    router.push('/marketplace');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'brands' && styles.tabActive]}
          onPress={() => setActiveTab('brands')}
        >
          <Text style={[styles.tabText, activeTab === 'brands' && styles.tabTextActive]}>
            Top Brands
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'stores' && styles.tabActive]}
          onPress={() => setActiveTab('stores')}
        >
          <Text style={[styles.tabText, activeTab === 'stores' && styles.tabTextActive]}>
            Nearby Stores
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'marketplace' && styles.tabActive]}
          onPress={() => setActiveTab('marketplace')}
        >
          <Text style={[styles.tabText, activeTab === 'marketplace' && styles.tabTextActive]}>
            1Fi Marketplace
          </Text>
        </Pressable>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'brands' && (
          <Pressable style={styles.placeholderContainer} onPress={() => router.push('/brands')}>
            <Text style={styles.placeholderIcon}>🏷️</Text>
            <Text style={styles.placeholderTitle}>Top Brands</Text>
            <Text style={styles.placeholderText}>
              Shop from your favorite brands like Apple, Samsung, Sony & more
            </Text>
            <View style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Explore Brands →</Text>
            </View>
          </Pressable>
        )}

        {activeTab === 'stores' && (
          <Pressable style={styles.placeholderContainer} onPress={() => router.push('/stores')}>
            <Text style={styles.placeholderIcon}>📍</Text>
            <Text style={styles.placeholderTitle}>Nearby Stores</Text>
            <Text style={styles.placeholderText}>
              Find Croma, Reliance Digital, Vijay Sales near you
            </Text>
            <View style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>Find Stores →</Text>
            </View>
          </Pressable>
        )}

        {activeTab === 'marketplace' && (
          <View style={styles.marketplaceContainer}>
            {/* Marketplace Hero */}
            <View style={styles.marketplaceHero}>
              <Text style={styles.marketplaceTitle}>1Fi Marketplace</Text>
              <Text style={styles.marketplaceSubtitle}>
                Shop electronics with flexible No-Cost EMI plans
              </Text>
            </View>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
              <Text style={styles.sectionTitle}>Shop by Category</Text>
              <View style={styles.categoryGrid}>
                <View style={styles.categoryCard}>
                  <Text style={styles.categoryIcon}>📱</Text>
                  <Text style={styles.categoryName}>Smartphones</Text>
                </View>
                <View style={styles.categoryCard}>
                  <Text style={styles.categoryIcon}>💻</Text>
                  <Text style={styles.categoryName}>Laptops</Text>
                </View>
                <View style={styles.categoryCard}>
                  <Text style={styles.categoryIcon}>📺</Text>
                  <Text style={styles.categoryName}>TVs</Text>
                </View>
                <View style={styles.categoryCard}>
                  <Text style={styles.categoryIcon}>🎧</Text>
                  <Text style={styles.categoryName}>Audio</Text>
                </View>
              </View>
            </View>

            {/* CTA to Full Marketplace */}
            <Pressable style={styles.ctaButton} onPress={handleMarketplacePress}>
              <Text style={styles.ctaButtonText}>Browse All Products</Text>
              <Text style={styles.ctaButtonIcon}>→</Text>
            </Pressable>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>0% Interest EMI</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Backed by Mutual Funds</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Instant Approval</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✓</Text>
                <Text style={styles.featureText}>Flexible Tenures</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#1E40AF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 80,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  marketplaceContainer: {
    flex: 1,
  },
  marketplaceHero: {
    backgroundColor: '#1E40AF',
    padding: 24,
  },
  marketplaceTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  marketplaceSubtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    lineHeight: 20,
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  ctaButton: {
    backgroundColor: '#1E40AF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  ctaButtonIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureIcon: {
    fontSize: 16,
    color: '#10B981',
    marginRight: 12,
    fontWeight: '700',
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  exploreButton: {
    marginTop: 24,
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
