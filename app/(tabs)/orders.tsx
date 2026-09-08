import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useOrders } from '../../contexts/OrdersContext';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, loading } = useOrders();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const formatPrice = (price: number): string => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return { bg: '#D1FAE5', text: '#059669', gradient: ['#D1FAE5', '#A7F3D0'] };
      case 'shipped':
        return { bg: '#DBEAFE', text: '#2563EB', gradient: ['#DBEAFE', '#BFDBFE'] };
      case 'confirmed':
        return { bg: '#FEF3C7', text: '#D97706', gradient: ['#FEF3C7', '#FDE68A'] };
      case 'cancelled':
        return { bg: '#FEE2E2', text: '#DC2626', gradient: ['#FEE2E2', '#FECACA'] };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', gradient: ['#F3F4F6', '#E5E7EB'] };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'confirmed':
        return '⏱';
      case 'cancelled':
        return '✕';
      default:
        return '•';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return order.status === 'confirmed' || order.status === 'shipped';
    }
    if (activeTab === 'completed') {
      return order.status === 'delivered';
    }
    return true;
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>📦</Text>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSubtitle}>Track your purchases</Text>
        </LinearGradient>
        <View style={[styles.emptyState, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={[styles.emptyText, { marginTop: 16 }]}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
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
        <Text style={styles.headerEmoji}>📦</Text>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>Track your purchases</Text>
      </LinearGradient>

      {/* Tab Filter */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            All Orders
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
            Completed
          </Text>
        </Pressable>
      </View>

      {/* Orders List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['#F3F4F6', '#E5E7EB']}
              style={styles.emptyIconContainer}
            >
              <Text style={styles.emptyIcon}>📦</Text>
            </LinearGradient>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' && 'You have no active orders'}
              {activeTab === 'completed' && 'You have no completed orders'}
              {activeTab === 'all' && 'Start shopping to see your orders here'}
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
        ) : (
          <View style={styles.ordersContainer}>
            {filteredOrders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              
              return (
                <Pressable
                  key={order.id}
                  style={({ pressed }) => [
                    styles.orderCard,
                    pressed && styles.orderCardPressed,
                  ]}
                >
                  <View style={styles.orderHeader}>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderId}>#{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                    </View>
                    <LinearGradient
                      colors={statusStyle.gradient}
                      style={styles.statusBadge}
                    >
                      <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
                      <Text style={[styles.statusText, { color: statusStyle.text }]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Text>
                    </LinearGradient>
                  </View>

                  {/* Order Items Preview */}
                  <View style={styles.itemsPreview}>
                    {order.items[0]?.productImage ? (
                      <Image
                        source={{ uri: order.items[0].productImage }}
                        style={styles.itemImage}
                      />
                    ) : (
                      <View style={[styles.itemImage, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 32 }}>📦</Text>
                      </View>
                    )}
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={2}>
                        {order.items[0]?.productName || 'Order Item'}
                      </Text>
                      {order.items.length > 1 && (
                        <Text style={styles.moreItems}>
                          +{order.items.length - 1} more {order.items.length - 1 === 1 ? 'item' : 'items'}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Order Footer */}
                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.totalLabel}>Total Amount</Text>
                      <Text style={styles.totalAmount}>{formatPrice(order.totalAmount)}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <Pressable style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Track Order</Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

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
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#EEF2FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#667eea',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  ordersContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemsPreview: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#667eea',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#667eea',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
    marginTop: 40,
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
});
