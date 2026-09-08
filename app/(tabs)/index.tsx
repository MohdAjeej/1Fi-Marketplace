import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>✨</Text>
            <Text style={styles.heroTitle}>Welcome to 1Fi</Text>
            <Text style={styles.heroSubtitle}>
              Shop smart with No-Cost EMI backed by mutual funds
            </Text>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>💰</Text>
            </View>
            <Text style={styles.statValue}>₹0</Text>
            <Text style={styles.statLabel}>Available Credit</Text>
          </LinearGradient>
          <LinearGradient
            colors={['#FFFFFF', '#F8FAFC']}
            style={styles.statCard}
          >
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>💳</Text>
            </View>
            <Text style={styles.statValue}>₹0</Text>
            <Text style={styles.statLabel}>Current EMI</Text>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <Pressable 
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push('/marketplace')}
            >
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>📱</Text>
              </LinearGradient>
              <Text style={styles.actionText}>Buy Phones</Text>
            </Pressable>
            <Pressable 
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push('/marketplace')}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>💻</Text>
              </LinearGradient>
              <Text style={styles.actionText}>Buy Laptops</Text>
            </Pressable>
            <Pressable 
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push('/marketplace')}
            >
              <LinearGradient
                colors={['#43e97b', '#38f9d7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>🏍️</Text>
              </LinearGradient>
              <Text style={styles.actionText}>Buy Bikes</Text>
            </Pressable>
            <Pressable 
              style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
              onPress={() => router.push('/(tabs)/portfolio')}
            >
              <LinearGradient
                colors={['#fa709a', '#fee140']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>📊</Text>
              </LinearGradient>
              <Text style={styles.actionText}>My Portfolio</Text>
            </Pressable>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why 1Fi?</Text>
          <Pressable style={({ pressed }) => [styles.benefitCard, pressed && styles.benefitCardPressed]}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.benefitIconGradient}
            >
              <Text style={styles.benefitIcon}>✨</Text>
            </LinearGradient>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>No-Cost EMI</Text>
              <Text style={styles.benefitDescription}>
                Pay in easy installments with 0% interest
              </Text>
            </View>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.benefitCard, pressed && styles.benefitCardPressed]}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.benefitIconGradient}
            >
              <Text style={styles.benefitIcon}>💰</Text>
            </LinearGradient>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Backed by Mutual Funds</Text>
              <Text style={styles.benefitDescription}>
                Your investments work for your purchases
              </Text>
            </View>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.benefitCard, pressed && styles.benefitCardPressed]}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.benefitIconGradient}
            >
              <Text style={styles.benefitIcon}>⚡</Text>
            </LinearGradient>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Instant Approval</Text>
              <Text style={styles.benefitDescription}>
                Get credit limit in minutes
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
    marginTop: -24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  actionCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  actionGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  benefitCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  benefitIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitIcon: {
    fontSize: 28,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
