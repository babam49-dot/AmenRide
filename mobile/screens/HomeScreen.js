import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchTrips } from '../services/tripsApi';

const { width } = Dimensions.get('window');

// ─── Animated Stat Counter ───────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 1400,
      useNativeDriver: false,
    }).start();
    anim.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => anim.removeAllListeners();
  }, [target]);

  return (
    <Text style={styles.statNumber}>
      {prefix}{display.toLocaleString()}{suffix}
    </Text>
  );
}

const SERVICES = [
  { name: 'Amen Ride',     sub: 'Daily commute',    emoji: '🚗', from: ['#FF9500', '#FF6B00'], screen: 'Map' },
  { name: 'Amen Delivery', sub: 'Send packages',    emoji: '📦', from: ['#06B6D4', '#0284C7'], screen: 'Map' },
  { name: 'Amen Boda',     sub: 'Quick motorcycle', emoji: '🏍️', from: ['#A855F7', '#7C3AED'], screen: 'Map' },
  { name: 'Intercity',     sub: 'Long distance',    emoji: '🚌', from: ['#10B981', '#059669'], screen: 'Map' },
];

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export default function HomeScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Hero banner pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.04, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Load trips from PostgreSQL
  useEffect(() => {
    fetchTrips(1).then((data) => {
      setTrips(data);
      setLoadingTrips(false);
    });
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Header ─────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>WELCOME TO AMEN</Text>
          <Text style={styles.userName}>Hello, Rider! 👋</Text>
        </View>
        <TouchableOpacity>
          <LinearGradient
            colors={['#FF9500', '#FF6B00']}
            style={styles.profileButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.profileText}>R</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── Hero Banner ─────────────────────────────── */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <LinearGradient
          colors={['#1A1A2E', '#16213E', '#0F3460']}
          style={styles.heroCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative glows */}
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🔥 Live & Ready</Text>
          </View>
          <Text style={styles.heroTitle}>Comfortable Rides,{'\n'}Always On Time</Text>
          <Text style={styles.heroDesc}>
            Request an AMEN ride and get matched in seconds. Safe, direct, and affordable.
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Map')}>
            <LinearGradient
              colors={['#FF9500', '#FF6B00']}
              style={styles.heroBtn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.heroBtnText}>Book a Ride  →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* ── Animated Stats Row ──────────────────────── */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient colors={['#FF9500', '#FF6B00']} style={styles.statIconBg}>
            <Text style={styles.statEmoji}>⭐</Text>
          </LinearGradient>
          <AnimatedCounter target={49} suffix=" / 5" prefix="" />
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
        <View style={styles.statCard}>
          <LinearGradient colors={['#06B6D4', '#0284C7']} style={styles.statIconBg}>
            <Text style={styles.statEmoji}>⚡</Text>
          </LinearGradient>
          <AnimatedCounter target={2} suffix=" min" />
          <Text style={styles.statLabel}>Avg Pickup</Text>
        </View>
        <View style={styles.statCard}>
          <LinearGradient colors={['#10B981', '#059669']} style={styles.statIconBg}>
            <Text style={styles.statEmoji}>😊</Text>
          </LinearGradient>
          <AnimatedCounter target={12000} suffix="+" />
          <Text style={styles.statLabel}>Happy Riders</Text>
        </View>
      </View>

      {/* ── Services ────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Our Services</Text>
      <View style={styles.servicesGrid}>
        {SERVICES.map((svc) => (
          <TouchableOpacity
            key={svc.name}
            style={styles.serviceItem}
            onPress={() => navigation.navigate(svc.screen)}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={svc.from}
              style={styles.serviceIconBg}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.serviceEmoji}>{svc.emoji}</Text>
            </LinearGradient>
            <Text style={styles.serviceName}>{svc.name}</Text>
            <Text style={styles.serviceSub}>{svc.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Recent Trips (from PostgreSQL) ─────────── */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Trips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loadingTrips ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#FF9500" size="small" />
            <Text style={styles.loadingText}>Loading trips...</Text>
          </View>
        ) : (
          trips.slice(0, 4).map((trip, i) => (
            <TouchableOpacity key={trip.id || i} style={styles.tripCard} activeOpacity={0.8}>
              <LinearGradient
                colors={[trip.ride_color || '#FF9500', (trip.ride_color || '#FF9500') + '88']}
                style={styles.tripIconWrapper}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.tripEmoji}>{trip.ride_icon || '📍'}</Text>
              </LinearGradient>
              <View style={styles.tripDetails}>
                <Text style={styles.tripTitle} numberOfLines={1}>{trip.dropoff_name}</Text>
                <Text style={styles.tripAddr} numberOfLines={1}>{trip.dropoff_addr}</Text>
                <Text style={styles.tripTime}>{formatTimeAgo(trip.created_at)}</Text>
              </View>
              <View style={styles.tripRight}>
                <Text style={styles.tripPrice}>{Math.round(trip.fare)} ETB</Text>
                <View style={[styles.statusDot, { backgroundColor: trip.status === 'completed' ? '#10B981' : '#FF9500' }]} />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 20 : 50,
  },

  // ── Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 11,
    color: '#FF9500',
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },

  // ── Hero Banner
  heroCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,149,0,0.2)',
  },
  glow1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FF9500',
    opacity: 0.12,
  },
  glow2: {
    position: 'absolute',
    bottom: -30,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#7C3AED',
    opacity: 0.12,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,149,0,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,149,0,0.4)',
  },
  heroBadgeText: {
    color: '#FF9500',
    fontSize: 11,
    fontWeight: '700',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 10,
    lineHeight: 32,
  },
  heroDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  heroBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 26,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  },

  // ── Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statEmoji: { fontSize: 18 },
  statNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 3,
    textAlign: 'center',
    fontWeight: '600',
  },

  // ── Services
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 14,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
    gap: 12,
  },
  serviceItem: {
    width: (width - 48) / 2,
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  serviceIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceEmoji: { fontSize: 26 },
  serviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  serviceSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 3,
  },

  // ── Recent Trips
  recentSection: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#FF9500',
    fontSize: 13,
    fontWeight: '700',
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 10,
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 13,
  },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  tripIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tripEmoji: { fontSize: 20 },
  tripDetails: { flex: 1 },
  tripTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tripAddr: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  tripTime: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 3,
  },
  tripRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  tripPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF9500',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
