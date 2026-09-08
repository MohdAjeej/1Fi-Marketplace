import { View, Text, StyleSheet, ScrollView, StatusBar, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function PortfolioScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>📊</Text>
          <Text style={styles.headerTitle}>My Portfolio</Text>
          <Text style={styles.headerSubtitle}>Track your mutual fund investments</Text>
        </LinearGradient>

        <View style={styles.emptyState}>
          <LinearGradient
            colors={['#F3F4F6', '#E5E7EB']}
            style={styles.emptyIconContainer}
          >
            <Text style={styles.emptyIcon}>📈</Text>
          </LinearGradient>
          <Text style={styles.emptyTitle}>No investments yet</Text>
          <Text style={styles.emptyText}>
            Start shopping with 1Fi to build your portfolio and watch your investments grow
          </Text>
          <Pressable 
            style={({ pressed }) => [styles.ctaButton, pressed && styles.ctaButtonPressed]}
            onPress={() => router.push('/marketplace')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Start Shopping</Text>
              <Text style={styles.ctaArrow}>→</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Portfolio Benefits */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>What you'll get</Text>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconContainer, { backgroundColor: '#DBEAFE' }]}>
              <Text style={styles.benefitIcon}>💰</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitItemTitle}>Mutual Fund Returns</Text>
              <Text style={styles.benefitItemText}>Earn returns while you pay off purchases</Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconContainer, { backgroundColor: '#D1FAE5' }]}>
              <Text style={styles.benefitIcon}>📊</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitItemTitle}>Track Growth</Text>
              <Text style={styles.benefitItemText}>Monitor your portfolio performance</Text>
            </View>
          </View>
          <View style={styles.benefitItem}>
            <View style={[styles.benefitIconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.benefitIcon}>✨</Text>
            </View>
            <View style={styles.benefitContent}>
              <Text style={styles.benefitItemTitle}>No Cost EMI</Text>
              <Text style={styles.benefitItemText}>Your returns offset the interest</Text>
            </View>
          </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyIcon: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 8,
  },
  ctaArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  benefitsSection: {
    padding: 20,
    marginTop: 20,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  benefitItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  benefitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitIcon: {
    fontSize: 28,
  },
  benefitContent: {
    flex: 1,
    justifyContent: 'center',
  },
  benefitItemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  benefitItemText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});
