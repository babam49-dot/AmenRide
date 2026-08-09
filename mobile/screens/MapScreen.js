import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchRideOptions } from '../services/tripsApi';

const { width, height } = Dimensions.get('window');

// Real Bahir Dar, Ethiopia coordinates & region
const BAHIR_DAR_REGION = {
  latitude: 11.5958,
  longitude: 37.3885,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

// Pickup & Dropoff coordinates in Bahir Dar
const PICKUP_COORDS  = { latitude: 11.5980, longitude: 37.3820 }; // Felege Hiwot
const DROPOFF_COORDS = { latitude: 11.5936, longitude: 37.3950 }; // Grand Resort Hotel, Lake Tana

// Real street route polyline points in Bahir Dar
const ROUTE_LINE = [
  { latitude: 11.5980, longitude: 37.3820 },
  { latitude: 11.5972, longitude: 37.3855 },
  { latitude: 11.5960, longitude: 37.3888 },
  { latitude: 11.5948, longitude: 37.3915 },
  { latitude: 11.5936, longitude: 37.3950 },
];

const MATCHING_STEPS = [
  '🔍  Locating nearby drivers in Bahir Dar...',
  '📡  Connecting to AMEN Dispatcher...',
  '🚗  Matching with best driver on Kebele 03 road...',
  '✅  Driver confirmed!',
];

export default function MapScreen() {
  const [selectedRide, setSelectedRide] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchStep, setMatchStep] = useState(0);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRideOptions().then((data) => {
      setRideOptions(data);
      setSelectedRide(data[0]?.id?.toString() || '1');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isRequested) {
      Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
      ).start();
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        if (step >= MATCHING_STEPS.length) clearInterval(interval);
        else setMatchStep(step);
      }, 1400);
      return () => clearInterval(interval);
    } else {
      spinAnim.setValue(0);
      setMatchStep(0);
    }
  }, [isRequested]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const activeRide = rideOptions.find((r) => r.id?.toString() === selectedRide || r.id === selectedRide);

  return (
    <View style={styles.container}>
      {/* Real Google Map centered on Bahir Dar */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={BAHIR_DAR_REGION}
        customMapStyle={darkMapStyle}
      >
        {/* Route Polyline (Directions Line) */}
        <Polyline
          coordinates={ROUTE_LINE}
          strokeColor="#FF9500"
          strokeWidth={5}
        />

        {/* Pickup Location Marker */}
        <Marker coordinate={PICKUP_COORDS} title="Pickup Location" description="Felege Hiwot, Bahir Dar">
          <View style={styles.pickupMarker}>
            <Text style={styles.markerText}>🟢 Pickup</Text>
          </View>
        </Marker>

        {/* Dropoff Location Marker */}
        <Marker coordinate={DROPOFF_COORDS} title="Dropoff Location" description="Grand Resort Hotel, Lake Tana">
          <View style={styles.dropoffMarker}>
            <Text style={styles.markerText}>🔴 Dropoff</Text>
          </View>
        </Marker>

        {/* Active Driver Marker */}
        <Marker coordinate={{ latitude: 11.5965, longitude: 37.3865 }} title="AMEN Driver">
          <View style={styles.driverMarker}>
            <Text style={{ fontSize: 20 }}>🚗</Text>
          </View>
        </Marker>
      </MapView>

      {/* Floating Route Information Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={styles.locationDot} />
          <View style={styles.routeInfo}>
            <Text style={styles.searchText}>Bahir Dar City · Lake Tana Route</Text>
            <Text style={styles.searchSub}>4.2 km · 12 min drive</Text>
          </View>
          <View style={styles.searchBadge}>
            <Text style={styles.searchBadgeText}>LIVE</Text>
          </View>
        </View>
      </View>

      {/* Booking Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {!isRequested ? (
          <>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Where to in Bahir Dar?</Text>
            <Text style={styles.sheetSub}>Select your ride option below</Text>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FF9500" size="small" />
                <Text style={styles.loadingText}>Loading options...</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rideList}>
                {rideOptions.map((ride) => {
                  const isSelected = ride.id?.toString() === selectedRide || ride.id === selectedRide;
                  return (
                    <TouchableOpacity
                      key={ride.id}
                      style={[styles.rideCard, isSelected && styles.rideCardSelected]}
                      onPress={() => setSelectedRide(ride.id?.toString())}
                      activeOpacity={0.85}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={[ride.color || '#FF9500', (ride.color || '#FF9500') + '44']}
                          style={StyleSheet.absoluteFill}
                          borderRadius={16}
                        />
                      )}
                      <Text style={styles.rideIcon}>{ride.icon}</Text>
                      <Text style={[styles.rideName, isSelected && { color: '#FFF' }]}>{ride.name}</Text>
                      <Text style={[styles.rideEta, isSelected && { color: 'rgba(255,255,255,0.7)' }]}>
                        {ride.eta_minutes} min away
                      </Text>
                      <Text style={[styles.ridePrice, isSelected && { color: '#FFF' }]}>
                        {ride.base_price} ETB
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <TouchableOpacity onPress={() => setIsRequested(true)} disabled={!activeRide} activeOpacity={0.9}>
              <LinearGradient
                colors={[activeRide?.color || '#FF9500', '#FF6B00']}
                style={styles.confirmBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.confirmBtnText}>Confirm {activeRide?.name || 'Ride'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.matchmakingContainer}>
            <View style={styles.sheetHandle} />
            <Animated.Text style={[styles.spinEmoji, { transform: [{ rotate: spin }] }]}>🔄</Animated.Text>
            <Text style={styles.matchTitle}>Finding your driver in Bahir Dar...</Text>
            <View style={styles.stepsContainer}>
              {MATCHING_STEPS.map((step, i) => (
                <Text key={i} style={[styles.stepText, i < matchStep && styles.stepDone, i === matchStep && styles.stepActive]}>
                  {step}
                </Text>
              ))}
            </View>
            <TouchableOpacity onPress={() => setIsRequested(false)} activeOpacity={0.9}>
              <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.confirmBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.confirmBtnText}>Cancel Request</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// Dark Google Maps style
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1a2e' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#111827' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  map: { width, height },

  pickupMarker: {
    backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1.5, borderColor: '#FFF',
  },
  dropoffMarker: {
    backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 12, borderWidth: 1.5, borderColor: '#FFF',
  },
  markerText: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  driverMarker: {
    padding: 8, backgroundColor: '#1E293B',
    borderRadius: 22, borderWidth: 2, borderColor: '#FF9500',
    alignItems: 'center', justifyContent: 'center',
  },

  topBar: { position: 'absolute', top: 50, left: 18, right: 18, zIndex: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 14, borderWidth: 1,
    borderColor: 'rgba(255,149,0,0.3)',
  },
  locationDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#10B981', marginRight: 12,
  },
  routeInfo: { flex: 1 },
  searchText: { fontSize: 13, fontWeight: '700', color: '#F1F5F9' },
  searchSub: { fontSize: 10, color: '#FF9500', marginTop: 1, fontWeight: '600' },
  searchBadge: {
    backgroundColor: '#FF9500', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  searchBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1 },

  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingBottom: 36, paddingHorizontal: 20,
    borderTopWidth: 1, borderColor: '#1E293B',
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#334155', alignSelf: 'center', marginBottom: 18,
  },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  sheetSub: { fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 18 },
  loadingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 20, gap: 10,
  },
  loadingText: { color: '#64748B', fontSize: 13 },
  rideList: { paddingBottom: 16, paddingRight: 10 },
  rideCard: {
    width: 126, backgroundColor: '#1E293B',
    borderRadius: 16, padding: 14, marginRight: 12,
    borderWidth: 2, borderColor: 'transparent',
    alignItems: 'center', overflow: 'hidden',
  },
  rideCardSelected: { borderColor: 'transparent' },
  rideIcon: { fontSize: 30, marginBottom: 8 },
  rideName: { fontSize: 12, fontWeight: '700', color: '#E2E8F0', textAlign: 'center' },
  rideEta: { fontSize: 10, color: '#64748B', marginTop: 2 },
  ridePrice: { fontSize: 14, fontWeight: '800', color: '#FF9500', marginTop: 8 },

  confirmBtn: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center', marginTop: 16,
  },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  matchmakingContainer: { alignItems: 'center', paddingVertical: 10 },
  spinEmoji: { fontSize: 52, marginBottom: 16 },
  matchTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 20 },
  stepsContainer: { width: '100%', marginBottom: 10 },
  stepText: { fontSize: 13, color: '#475569', marginBottom: 8, textAlign: 'center' },
  stepDone: { color: '#10B981' },
  stepActive: { color: '#FF9500', fontWeight: '700' },
});
