import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Try to import expo-location, but handle if not installed
let Location: any = null;
let locationAvailable = false;
try {
  Location = require('expo-location');
  locationAvailable = true;
} catch (e) {
  console.log('expo-location not installed, location features will be limited');
}

interface StoreItem {
  id: number;
  name: string;
  logo: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  gradient: readonly [string, string];
  lat: number;
  lng: number;
  rating: number;
  services: string[];
}

// Mock store data - In real app, this would come from API based on user location
const NEARBY_STORES: StoreItem[] = [
  {
    id: 1,
    name: 'Croma',
    logo: '🟥',
    address: 'Phoenix Marketcity, LBS Marg, Kurla West, Mumbai',
    distance: '2.3 km',
    phone: '+91 22 6666 7777',
    hours: '10:00 AM - 10:00 PM',
    gradient: ['#DC2626', '#991B1B'],
    lat: 19.0896,
    lng: 72.8914,
    rating: 4.3,
    services: ['No Cost EMI', 'Expert Advice', 'Home Delivery'],
  },
  {
    id: 2,
    name: 'Reliance Digital',
    logo: '🔵',
    address: 'Ground Floor, R City Mall, Ghatkopar West, Mumbai',
    distance: '3.8 km',
    phone: '+91 22 6789 0123',
    hours: '11:00 AM - 9:00 PM',
    gradient: ['#2563EB', '#1E40AF'],
    lat: 19.0869,
    lng: 72.9089,
    rating: 4.5,
    services: ['No Cost EMI', 'Exchange Offer', 'Extended Warranty'],
  },
  {
    id: 3,
    name: 'Vijay Sales',
    logo: '🟡',
    address: 'Linking Road, Santacruz West, Mumbai',
    distance: '4.2 km',
    phone: '+91 22 2604 5678',
    hours: '10:30 AM - 9:30 PM',
    gradient: ['#F59E0B', '#D97706'],
    lat: 19.0784,
    lng: 72.8334,
    rating: 4.4,
    services: ['No Cost EMI', 'Free Installation', 'Service Center'],
  },
  {
    id: 4,
    name: 'Croma',
    logo: '🟥',
    address: 'Infinity Mall, New Link Road, Andheri West, Mumbai',
    distance: '5.1 km',
    phone: '+91 22 6666 8888',
    hours: '11:00 AM - 10:00 PM',
    gradient: ['#DC2626', '#991B1B'],
    lat: 19.1355,
    lng: 72.8295,
    rating: 4.2,
    services: ['No Cost EMI', 'Expert Advice', 'Home Delivery'],
  },
  {
    id: 5,
    name: 'Reliance Digital',
    logo: '🔵',
    address: 'Raghuleela Mall, Kandivali West, Mumbai',
    distance: '6.7 km',
    phone: '+91 22 6789 1234',
    hours: '11:00 AM - 9:00 PM',
    gradient: ['#2563EB', '#1E40AF'],
    lat: 19.2075,
    lng: 72.8355,
    rating: 4.3,
    services: ['No Cost EMI', 'Exchange Offer', 'Extended Warranty'],
  },
  {
    id: 6,
    name: 'Vijay Sales',
    logo: '🟡',
    address: 'Thane West, Opposite Viviana Mall, Mumbai',
    distance: '8.3 km',
    phone: '+91 22 2534 9876',
    hours: '10:00 AM - 9:30 PM',
    gradient: ['#F59E0B', '#D97706'],
    lat: 19.2183,
    lng: 72.9781,
    rating: 4.6,
    services: ['No Cost EMI', 'Free Installation', 'Service Center'],
  },
];

export default function StoresScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'croma' | 'reliance' | 'vijay'>('all');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (!locationAvailable || !Location) {
      console.log('Location services not available');
      setLocationLoading(false);
      return;
    }

    try {
      setLocationLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Location permission not granted. You can still view stores without distances.',
          [{ text: 'OK' }]
        );
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy?.Balanced || 3,
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationLoading(false);
    }
  };

  const filteredStores = NEARBY_STORES.filter((store) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'croma') return store.name === 'Croma';
    if (selectedFilter === 'reliance') return store.name === 'Reliance Digital';
    if (selectedFilter === 'vijay') return store.name === 'Vijay Sales';
    return true;
  });

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleGetDirections = (lat: number, lng: number, name: string) => {
    let url: string;

    if (userLocation) {
      // If we have user location, show route from current location to store
      url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${lat},${lng}&travelmode=driving`;
    } else {
      // Otherwise just show the destination
      url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    Linking.openURL(url).catch((err) => {
      console.error('Error opening directions:', err);
      Alert.alert('Error', 'Unable to open maps for directions');
    });
  };

  const handleViewOnMap = () => {
    if (filteredStores.length === 0) {
      Alert.alert('No Stores', 'No stores available to show on map');
      return;
    }

    // Get the first store's coordinates as center point
    const centerStore = filteredStores[0];
    const lat = centerStore.lat;
    const lng = centerStore.lng;

    // Create markers for all filtered stores
    const storesParam = filteredStores
      .map((store) => `${store.lat},${store.lng}`)
      .join('|');

    // Open Google Maps with all store markers
    const mapUrl = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}`,
      android: `geo:0,0?q=${lat},${lng}(${centerStore.name})`,
      default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    });

    // If user location is available, show route from current location
    if (userLocation) {
      const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${lat},${lng}&travelmode=driving`;
      Linking.openURL(routeUrl).catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Unable to open maps application');
      });
    } else {
      // Just show the location on map
      Linking.openURL(mapUrl).catch((err) => {
        console.error('Error opening maps:', err);
        Alert.alert('Error', 'Unable to open maps application');
      });
    }
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
          <Text style={styles.headerEmoji}>📍</Text>
          <Text style={styles.headerTitle}>Nearby Stores</Text>
          <Text style={styles.headerSubtitle}>{filteredStores.length} stores near you</Text>
        </View>
      </LinearGradient>

      {/* Map View Button with Location Status */}
      <View style={styles.mapButtonContainer}>
        {userLocation && (
          <View style={styles.locationIndicator}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>
              Your location detected • {filteredStores.length} stores nearby
            </Text>
          </View>
        )}
        <Pressable
          style={({ pressed }) => [styles.mapButton, pressed && styles.mapButtonPressed]}
          onPress={handleViewOnMap}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mapButtonGradient}
          >
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapButtonText}>
              {locationLoading ? 'Getting Location...' : 'View All on Map'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <Pressable
          style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            All Stores
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, selectedFilter === 'croma' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('croma')}
        >
          <Text style={[styles.filterText, selectedFilter === 'croma' && styles.filterTextActive]}>
            🟥 Croma
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, selectedFilter === 'reliance' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('reliance')}
        >
          <Text style={[styles.filterText, selectedFilter === 'reliance' && styles.filterTextActive]}>
            🔵 Reliance
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterChip, selectedFilter === 'vijay' && styles.filterChipActive]}
          onPress={() => setSelectedFilter('vijay')}
        >
          <Text style={[styles.filterText, selectedFilter === 'vijay' && styles.filterTextActive]}>
            🟡 Vijay Sales
          </Text>
        </Pressable>
      </ScrollView>

      {/* Stores List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.storesContainer}>
          {filteredStores.map((store) => (
            <View key={store.id} style={styles.storeCard}>
              <LinearGradient
                colors={store.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.storeHeader}
              >
                <View style={styles.storeHeaderContent}>
                  <Text style={styles.storeLogo}>{store.logo}</Text>
                  <View style={styles.storeHeaderText}>
                    <Text style={styles.storeName}>{store.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingText}>⭐ {store.rating}</Text>
                      <Text style={styles.distanceText}>• {store.distance}</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.storeBody}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={styles.infoText}>{store.address}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🕐</Text>
                  <Text style={styles.infoText}>{store.hours}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📞</Text>
                  <Text style={styles.infoText}>{store.phone}</Text>
                </View>

                {/* Services */}
                <View style={styles.servicesContainer}>
                  {store.services.map((service, index) => (
                    <View key={index} style={styles.serviceChip}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.callButton,
                      pressed && styles.actionButtonPressed,
                    ]}
                    onPress={() => handleCall(store.phone)}
                  >
                    <Text style={styles.callButtonText}>📞 Call</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      styles.directionsButton,
                      pressed && styles.actionButtonPressed,
                    ]}
                    onPress={() => handleGetDirections(store.lat, store.lng, store.name)}
                  >
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.directionsGradient}
                    >
                      <Text style={styles.directionsButtonText}>🧭 Directions</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </View>
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
  mapButtonContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  mapButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mapButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  mapButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  mapIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  mapButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#EEF2FF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#667eea',
  },
  scrollView: {
    flex: 1,
  },
  storesContainer: {
    padding: 16,
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  storeHeader: {
    padding: 16,
  },
  storeHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeLogo: {
    fontSize: 48,
    marginRight: 16,
  },
  storeHeaderText: {
    flex: 1,
  },
  storeName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginLeft: 6,
  },
  storeBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  serviceChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  serviceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#667eea',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  callButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  directionsButton: {
    flex: 1,
  },
  directionsGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
