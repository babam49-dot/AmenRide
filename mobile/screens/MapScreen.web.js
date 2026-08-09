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
import { fetchRideOptions } from '../services/tripsApi';

const { width, height } = Dimensions.get('window');

const MATCHING_STEPS = [
  '🔍  Locating nearby drivers...',
  '📡  Connecting to AMEN Dispatcher...',
  '🚗  Matching with best driver...',
  '✅  Driver confirmed!',
];

export default function MapScreen() {
  const [selectedRide, setSelectedRide] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchStep, setMatchStep] = useState(0);

  // Pulsing pin animation
  const pinPulse = useRef(new Animated.Value(1)).current;
  const pinOpacity = useRef(new Animated.Value(0.5)).current;

  // Spinner rotation
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse location pin
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pinPulse, { toValue: 1.3, duration: 900, useNativeDriver: true }),
          Animated.timing(pinOpacity, { toValue: 0,   duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pinPulse, { toValue: 1,   duration: 0,   useNativeDriver: true }),
          Animated.timing(pinOpacity, { toValue: 0.5,duration: 0,   useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Load ride options from PostgreSQL
    fetchRideOptions().then((data) => {
      setRideOptions(data);
      setSelectedRide(data[0]?.id?.toString() || '1');
      setLoading(false);
    });
  }, []);

  // Spin animation when requested
  useEffect(() => {
    if (isRequested) {
      Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
      ).start();

      // Cycle through matching steps
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        if (step >= MATCHING_STEPS.length) {
          clearInterval(interval);
        } else {
          setMatchStep(step);
        }
      }, 1400);
      return () => clearInterval(interval);
    } else {
      spinAnim.setValue(0);
      setMatchStep(0);
    }
  }, [isRequested]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const activeRide = rideOptions.find(
    (r) => r.id?.toString() === selectedRide || r.id === selectedRide
  );

  return (
    <View style={styles.container}>
      {/* ── Map Background ─────────────────────────── */}
      <LinearGradient
        colors={['#0F172A', '#1E293B', '#1a2744']}
        style={styles.mapBg}
      >
        {/* Grid lines */}
        <View style={styles.mapGrid}>
          {[...Array(10)].map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 9}%` }]} />
          ))}
          {[...Array(8)].map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 12}%` }]} />
          ))}
        </View>

        {/* Glowing roads */}
        <LinearGradient colors={['transparent', '#FF950022', 'transparent']} style={styles.road1} start={{x:0,y:0}} end={{x:1,y:0}} />
        <LinearGradient colors={['transparent', '#FF950022', 'transparent']} style={styles.road2} start={{x:0,y:0}} end={{x:0,y:1}} />

        {/* Pulsing pin */}
        <View style={styles.pinContainer}>
          <Animated.View style={[styles.pinRipple, { transform: [{ scale: pinPulse }], opacity: pinOpacity }]} />
          <View style={styles.pinInner}>
            <Text style={styles.pinEmoji}>📍</Text>
          </View>
          <View style={styles.pinLabelBox}>
            <Text style={styles.pinLabel}>Bahir Dar, Ethiopia</Text>
            <Text style={styles.pinCoords}>11.5936° N, 37.3908° E</Text>
          </View>
        </View>

        {/* Driver dots */}
        {[
          { top: '22%', left: '28%', emoji: '🚗', color: '#FF9500' },
          { top: '38%', left: '62%', emoji: '🚗', color: '#06B6D4' },
          { top: '18%', right: '22%', emoji: '🚙', color: '#A855F7' },
          { top: '55%', left: '18%', emoji: '🏍️', color: '#10B981' },
        ].map((d, i) => (
          <View key={i} style={[styles.driverDot, { top: d.top, left: d.left, right: d.right, borderColor: d.color }]}>
            <Text style={{ fontSize: 20 }}>{d.emoji}</Text>
          </View>
        ))}
      </LinearGradient>

      {/* ── Floating Search Bar ─────────────────────── */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={styles.locationDot} />
          <Text style={styles.searchText}>Bahir Dar City Center</Text>
          <View style={styles.searchBadge}>
            <Text style={styles.searchBadgeText}>LIVE</Text>
          </View>
        </View>
      </View>

      {/* ── Booking Bottom Sheet ────────────────────── */}
      <View style={styles.bottomSheet}>
        {!isRequested ? (
          <>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Where to, Rider?</Text>
            <Text style={styles.sheetSub}>Select your ride type below</Text>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FF9500" size="small" />
                <Text style={styles.loadingText}>Loading ride options...</Text>
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
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
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

            <TouchableOpacity
              onPress={() => setIsRequested(true)}
              disabled={!activeRide}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[activeRide?.color || '#FF9500', '#FF6B00']}
                style={styles.confirmBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.confirmBtnText}>
                  Confirm {activeRide?.name || 'Ride'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.matchmakingContainer}>
            <View style={styles.sheetHandle} />
            <Animated.Text style={[styles.spinEmoji, { transform: [{ rotate: spin }] }]}>
              🔄
            </Animated.Text>
            <Text style={styles.matchTitle}>Finding your driver...</Text>
            <View style={styles.stepsContainer}>
              {MATCHING_STEPS.map((step, i) => (
                <Text
                  key={i}
                  style={[
                    styles.stepText,
                    i < matchStep && styles.stepDone,
                    i === matchStep && styles.stepActive,
                  ]}
                >
                  {step}
                </Text>
              ))}
            </View>
            <TouchableOpacity onPress={() => setIsRequested(false)} activeOpacity={0.9}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.confirmBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.confirmBtnText}>Cancel Request</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapBg: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  gridLineH: {
    position: 'absolute', left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  gridLineV: {
    position: 'absolute', top: 0, bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  road1: {
    position: 'absolute', top: '42%', left: 0, right: 0, height: 20,
  },
  road2: {
    position: 'absolute', left: '48%', top: 0, bottom: 0, width: 20,
  },
  pinContainer: {
    position: 'absolute',
    top: '25%', left: 0, right: 0,
    alignItems: 'center',
  },
  pinRipple: {
    position: 'absolute',
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#FF9500',
    top: -14,
  },
  pinInner: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#1E293B',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FF9500',
  },
  pinEmoji: { fontSize: 26 },
  pinLabelBox: {
    marginTop: 10, alignItems: 'center',
    backgroundColor: 'rgba(30,41,59,0.95)',
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,149,0,0.3)',
  },
  pinLabel: {
    fontWeight: '700', fontSize: 13, color: '#FFF',
  },
  pinCoords: {
    fontSize: 10, color: '#94A3B8', marginTop: 2,
  },
  driverDot: {
    position: 'absolute',
    backgroundColor: 'rgba(30,41,59,0.9)',
    borderRadius: 22, padding: 6,
    borderWidth: 2,
  },
  topBar: {
    position: 'absolute', top: 50, left: 18, right: 18, zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,149,0,0.25)',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  locationDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#10B981', marginRight: 12,
  },
  searchText: {
    flex: 1, fontSize: 14, fontWeight: '600', color: '#F1F5F9',
  },
  searchBadge: {
    backgroundColor: '#FF9500', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  searchBadgeText: {
    color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingBottom: 36, paddingHorizontal: 20,
    borderTopWidth: 1, borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 20,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#334155', alignSelf: 'center', marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 22, fontWeight: '800', color: '#FFFFFF',
  },
  sheetSub: {
    fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 18,
  },
  loadingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 20, gap: 10,
  },
  loadingText: { color: '#64748B', fontSize: 13 },
  rideList: { paddingBottom: 16, paddingRight: 10 },
  rideCard: {
    width: 126, backgroundColor: '#1E293B',
    borderRadius: 16, padding: 14,
    marginRight: 12,
    borderWidth: 2, borderColor: 'transparent',
    alignItems: 'center', overflow: 'hidden',
  },
  rideCardSelected: {
    borderColor: 'transparent',
  },
  rideIcon: { fontSize: 30, marginBottom: 8 },
  rideName: {
    fontSize: 12, fontWeight: '700', color: '#E2E8F0', textAlign: 'center',
  },
  rideEta: {
    fontSize: 10, color: '#64748B', marginTop: 2,
  },
  ridePrice: {
    fontSize: 14, fontWeight: '800', color: '#FF9500', marginTop: 8,
  },
  confirmBtn: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 16,
  },
  confirmBtnText: {
    color: '#FFF', fontSize: 16, fontWeight: '800',
  },

  // Matchmaking
  matchmakingContainer: {
    alignItems: 'center', paddingVertical: 10,
  },
  spinEmoji: { fontSize: 52, marginBottom: 16 },
  matchTitle: {
    fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 20,
  },
  stepsContainer: { width: '100%', marginBottom: 10 },
  stepText: {
    fontSize: 13, color: '#475569', marginBottom: 8, textAlign: 'center',
  },
  stepDone: { color: '#10B981' },
  stepActive: { color: '#FF9500', fontWeight: '700' },
});
