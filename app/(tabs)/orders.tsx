import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  StatusBar, Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useOrders } from '../../contexts/OrdersContext';
import { Order, OrderItem } from '../../types/product';
import { Colors, Fonts, Space, Radii, Shadow, formatPrice } from '../../constants/theme';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, loading, cancelOrder } = useOrders();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  const formatDate = (d?: string) => {
    if (!d) return 'Pending';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: string }> = {
    delivered: { bg: Colors.greenLight, text: Colors.green, icon: '✓' },
    shipped: { bg: Colors.blueLight, text: Colors.blue, icon: '🚚' },
    confirmed: { bg: Colors.orangeLight, text: '#B45309', icon: '⏱' },
    cancelled: { bg: Colors.coralLight, text: Colors.coral, icon: '✕' },
  };

  const handleCancel = (id: string, num: string) => {
    Alert.alert('Cancel Order', `Cancel #${num}?`, [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => { cancelOrder(id); Alert.alert('Cancelled', 'Order cancelled.'); } },
    ]);
  };

  const handleTrack = (order: Order) => {
    Alert.alert(
      `Order #${order.orderNumber}`,
      `Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}\nOrdered: ${formatDate(order.createdAt)}\nEst. Delivery: ${formatDate(order.estimatedDelivery)}\n\n${order.deliveryAddress.fullName}\n${order.deliveryAddress.address}, ${order.deliveryAddress.city} - ${order.deliveryAddress.pincode}`,
    );
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'active') return o.status === 'confirmed' || o.status === 'shipped';
    if (activeTab === 'completed') return o.status === 'delivered';
    return true;
  });

  const counts = {
    all: orders.length,
    active: orders.filter((o) => o.status === 'confirmed' || o.status === 'shipped').length,
    completed: orders.filter((o) => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}><Text style={styles.headerTitle}>My Orders</Text></View>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerSub}>{orders.length} {orders.length === 1 ? 'purchase' : 'purchases'}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {([
          { key: 'all' as const, label: 'All' },
          { key: 'active' as const, label: 'Active' },
          { key: 'completed' as const, label: 'Done' },
        ]).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable key={tab.key} onPress={() => setActiveTab(tab.key)}>
              {isActive ? (
                <LinearGradient colors={Colors.gradientPrimary} style={styles.tabPill}>
                  <Text style={styles.tabTextActive}>{tab.label} ({counts[tab.key]})</Text>
                </LinearGradient>
              ) : (
                <View style={styles.tabPillInactive}>
                  <Text style={styles.tabText}>{tab.label} ({counts[tab.key]})</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyWrap}>
            <LinearGradient colors={Colors.gradientPrimary} style={styles.emptyCircle}>
              <Text style={styles.emptyEmoji}>📦</Text>
            </LinearGradient>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySub}>
              {activeTab === 'all' ? 'Start shopping to see orders here' :
               activeTab === 'active' ? 'No active orders' : 'No completed orders'}
            </Text>
            <Pressable onPress={() => router.push('/marketplace')} style={({ pressed }) => [pressed && { transform: [{ scale: 0.96 }] }]}>
              <LinearGradient colors={Colors.gradientPrimary} style={styles.emptyBtn}>
                <Text style={styles.emptyBtnText}>Browse Products</Text>
              </LinearGradient>
            </Pressable>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {filteredOrders.map((order) => {
              const st = statusConfig[order.status] || { bg: Colors.cardAlt, text: Colors.textMuted, icon: '•' };

              return (
                <View key={order.id} style={styles.orderCard}>
                  {/* Header */}
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderNum}>#{order.orderNumber}</Text>
                      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: st.bg }]}>
                      <Text style={styles.statusIcon}>{st.icon}</Text>
                      <Text style={[styles.statusText, { color: st.text }]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  {/* Items */}
                  {order.items.map((item: OrderItem, idx: number) => (
                    <View key={item.id || `${order.id}-${idx}`} style={styles.itemRow}>
                      {item.productImage ? (
                        <Image source={{ uri: item.productImage }} style={styles.itemImg} resizeMode="cover" />
                      ) : (
                        <View style={[styles.itemImg, styles.imgPlaceholder]}><Text style={{ fontSize: 22 }}>📦</Text></View>
                      )}
                      <View style={styles.itemInfo}>
                        {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
                        <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>

                        {item.variantDetails && item.variantDetails.length > 0 && (
                          <View style={styles.chipRow}>
                            {item.variantDetails.map((v, vi) => (
                              <View key={`${v.type}-${vi}`} style={styles.chip}>
                                <Text style={styles.chipText}>{v.value}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {item.selectedEMIPlan && (
                          <View style={styles.emiChip}>
                            <Text style={styles.emiChipText}>
                              💳 ₹{item.selectedEMIPlan.monthlyAmount.toLocaleString('en-IN')}/mo × {item.selectedEMIPlan.tenure}mo
                              {item.selectedEMIPlan.isNoCost ? ' · No Cost' : ''}
                            </Text>
                          </View>
                        )}

                        <View style={styles.priceRow}>
                          <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                          <Text style={styles.itemTotal}>{formatPrice(item.totalPrice || item.price * item.quantity)}</Text>
                        </View>
                      </View>
                    </View>
                  ))}

                  {/* Delivery */}
                  {order.deliveryAddress && (
                    <View style={styles.deliveryBox}>
                      <Text style={styles.deliveryHeading}>📍 Delivery</Text>
                      <Text style={styles.deliveryName}>{order.deliveryAddress.fullName} · {order.deliveryAddress.phone}</Text>
                      <Text style={styles.deliveryAddr} numberOfLines={2}>
                        {order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                      </Text>
                      <Text style={styles.deliveryEta}>🚚 Est: {formatDate(order.estimatedDelivery)}</Text>
                    </View>
                  )}

                  {/* Footer */}
                  <View style={styles.orderFooter}>
                    <View>
                      <Text style={styles.footerLabel}>Total (incl. GST)</Text>
                      <Text style={styles.footerTotal}>{formatPrice(order.totalAmount)}</Text>
                    </View>
                    <View style={styles.footerActions}>
                      {order.status === 'confirmed' && (
                        <Pressable style={styles.cancelBtn} onPress={() => handleCancel(order.id, order.orderNumber)}>
                          <Text style={styles.cancelBtnText}>Cancel</Text>
                        </Pressable>
                      )}
                      <Pressable style={styles.trackBtn} onPress={() => handleTrack(order)}>
                        <Text style={styles.trackBtnText}>Track</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: Space.xl, paddingTop: Space.md, paddingBottom: Space.lg,
    backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { ...Fonts.h1, color: Colors.text },
  headerSub: { ...Fonts.caption, color: Colors.textMuted, marginTop: 2 },

  // Tabs
  tabBar: {
    flexDirection: 'row', gap: Space.sm,
    paddingHorizontal: Space.xl, paddingVertical: Space.md,
    backgroundColor: Colors.card,
  },
  tabPill: { paddingHorizontal: Space.lg, paddingVertical: Space.sm, borderRadius: Radii.pill },
  tabPillInactive: { paddingHorizontal: Space.lg, paddingVertical: Space.sm, borderRadius: Radii.pill, backgroundColor: Colors.cardAlt, borderWidth: 1, borderColor: Colors.border },
  tabTextActive: { ...Fonts.captionBold, color: Colors.textWhite },
  tabText: { ...Fonts.captionBold, color: Colors.textMuted },

  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...Fonts.caption, color: Colors.textMuted, marginTop: Space.lg },

  // Empty
  emptyWrap: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: Space.xxxl },
  emptyCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: Space.xxl, ...Shadow.glow(Colors.accent) },
  emptyEmoji: { fontSize: 44 },
  emptyTitle: { ...Fonts.h2, color: Colors.text, marginBottom: Space.sm },
  emptySub: { ...Fonts.body, color: Colors.textMuted, textAlign: 'center', marginBottom: Space.xxl },
  emptyBtn: { paddingHorizontal: Space.xxl, paddingVertical: Space.lg, borderRadius: Radii.lg },
  emptyBtnText: { ...Fonts.bodySemibold, color: Colors.textWhite },

  // Orders
  ordersList: { padding: Space.lg, gap: Space.md },
  orderCard: { backgroundColor: Colors.card, borderRadius: Radii.xl, padding: Space.xl, ...Shadow.card },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Space.lg },
  orderNum: { ...Fonts.captionBold, color: Colors.text },
  orderDate: { ...Fonts.tiny, color: Colors.textMuted, marginTop: 2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Space.md, paddingVertical: Space.xs, borderRadius: Radii.pill, gap: 4 },
  statusIcon: { fontSize: 12 },
  statusText: { ...Fonts.tinyBold },

  // Item Row
  itemRow: { flexDirection: 'row', marginBottom: Space.md, paddingBottom: Space.md, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  itemImg: { width: 64, height: 64, borderRadius: Radii.md, backgroundColor: Colors.cardAlt },
  imgPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  itemInfo: { flex: 1, marginLeft: Space.md },
  itemBrand: { ...Fonts.label, color: Colors.textLight, marginBottom: 1, fontSize: 10 },
  itemName: { ...Fonts.captionBold, color: Colors.text, marginBottom: Space.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: Space.xs },
  chip: { backgroundColor: Colors.cardAlt, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radii.sm, borderWidth: 1, borderColor: Colors.border },
  chipText: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  emiChip: { backgroundColor: Colors.accentSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radii.sm, alignSelf: 'flex-start', marginBottom: Space.xs },
  emiChipText: { fontSize: 10, fontWeight: '700', color: Colors.accent },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  itemQty: { ...Fonts.tiny, color: Colors.textMuted },
  itemTotal: { ...Fonts.captionBold, color: Colors.text },

  // Delivery
  deliveryBox: { backgroundColor: Colors.cardAlt, borderRadius: Radii.md, padding: Space.md, marginBottom: Space.lg, borderWidth: 1, borderColor: Colors.border },
  deliveryHeading: { ...Fonts.tinyBold, color: Colors.textMuted, marginBottom: Space.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  deliveryName: { ...Fonts.captionBold, color: Colors.text, marginBottom: 2 },
  deliveryAddr: { ...Fonts.tiny, color: Colors.textMuted, lineHeight: 16 },
  deliveryEta: { ...Fonts.tinyBold, color: Colors.green, marginTop: Space.xs },

  // Footer
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerLabel: { ...Fonts.tiny, color: Colors.textMuted, marginBottom: 2 },
  footerTotal: { ...Fonts.priceSmall, color: Colors.accent },
  footerActions: { flexDirection: 'row', gap: Space.sm },
  cancelBtn: { paddingHorizontal: Space.lg, paddingVertical: Space.sm, borderRadius: Radii.md, backgroundColor: Colors.coralLight },
  cancelBtnText: { ...Fonts.captionBold, color: Colors.coral },
  trackBtn: { paddingHorizontal: Space.lg, paddingVertical: Space.sm, borderRadius: Radii.md, backgroundColor: Colors.accentSoft },
  trackBtnText: { ...Fonts.captionBold, color: Colors.accent },
});
