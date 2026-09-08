import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

const TOP_BRANDS = [
  {
    id: 1,
    name: 'Apple',
    logo: '🍎',
    gradient: ['#667eea', '#764ba2'],
    products: '150+ Products',
    description: 'iPhone, MacBook, iPad, AirPods',
  },
  {
    id: 2,
    name: 'Samsung',
    logo: '📱',
    gradient: ['#4facfe', '#00f2fe'],
    products: '200+ Products',
    description: 'Galaxy Phones, TVs, Appliances',
  },
  {
    id: 3,
    name: 'Sony',
    logo: '🎮',
    gradient: ['#43e97b', '#38f9d7'],
    products: '180+ Products',
    description: 'PlayStation, Cameras, Audio',
  },
  {
    id: 4,
    name: 'LG',
    logo: '📺',
    gradient: ['#fa709a', '#fee140'],
    products: '120+ Products',
    description: 'OLED TVs, Appliances, Monitors',
  },
  {
    id: 5,
    name: 'Dell',
    logo: '💻',
    gradient: ['#30cfd0', '#330867'],
    products: '90+ Products',
    description: 'Laptops, Desktops, Monitors',
  },
  {
    id: 6,
    name: 'OnePlus',
    logo: '📲',
    gradient: ['#a8edea', '#fed6e3'],
    products: '75+ Products',
    description: 'Smartphones, TVs, Audio',
  },
  {
    id: 7,
    name: 'Xiaomi',
    logo: '🔷',
    gradient: ['#ffecd2', '#fcb69f'],
    products: '160+ Products',
    description: 'Mi Phones, Smart Home, Fitness',
  },
  {
    id: 8,
    name: 'HP',
    logo: '🖥️',
    gradient: ['#ff9a9e', '#fecfef'],
    products: '110+ Products',
    description: 'Laptops, Printers, Desktops',
  },
  {
    id: 9,
    name: 'Lenovo',
    logo: '💼',
    gradient: ['#fbc2eb', '#a6c1ee'],
    products: '95+ Products',
    description: 'ThinkPad, Laptops, Tablets',
  },
  {
    id: 10,
    name: 'Bose',
    logo: '🎧',
    gradient: ['#fdcbf1', '#e6dee9'],
    products: '50+ Products',
    description: 'Headphones, Speakers, Soundbars',
  },
  {
    id: 11,
    name: 'Canon',
    logo: '📷',
    gradient: ['#a1c4fd', '#c2e9fb'],
    products: '85+ Products',
    description: 'Cameras, Lenses, Printers',
  },
  {
    id: 12,
    name: 'Nikon',
    logo: '📸',
    gradient: ['#d4fc79', '#96e6a1'],
    products: '70+ Products',
    description: 'DSLR, Mirrorless, Lenses',
  },
];

export default function BrandsScreen() {
  const router = useRouter();

  const handleBrandPress = (brandName: string) => {
    router.push(`/marketplace?brand=${brandName}`);
  };

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
          <Text style={styles.headerEmoji}>🏷️</Text>
          <Text style={styles.headerTitle}>Top Brands</Text>
          <Text style={styles.headerSubtitle}>Shop from premium brands</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.brandsGrid}>
          {TOP_BRANDS.map((brand) => (
            <Pressable
              key={brand.id}
              style={({ pressed }) => [
                styles.brandCard,
                pressed && styles.brandCardPressed,
              ]}
              onPress={() => handleBrandPress(brand.name)}
            >
              <LinearGradient
                colors={brand.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.brandGradient}
              >
                <Text style={styles.brandLogo}>{brand.logo}</Text>
              </LinearGradient>
              
              <View style={styles.brandInfo}>
                <Text style={styles.brandName}>{brand.name}</Text>
                <Text style={styles.brandProducts}>{brand.products}</Text>
                <Text style={styles.brandDescription} numberOfLines={2}>
                  {brand.description}
                </Text>
              </View>

              <View style={styles.exploreButton}>
                <Text style={styles.exploreText}>Explore →</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
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
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  scrollView: {
    flex: 1,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  brandCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  brandCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  brandGradient: {
    width: '100%',
    height: 100,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandLogo: {
    fontSize: 48,
  },
  brandInfo: {
    marginBottom: 12,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  brandProducts: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 6,
  },
  brandDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  exploreButton: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#667eea',
  },
});
