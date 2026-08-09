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
import { fetchTrips } from '../services/tripsApi';

const { width } = Dimensions.get('window');

// Uber Style Suggestions Grid
const UBER_SUGGESTIONS = [
  { name: 'Ride', sub: 'Instant pickup', emoji: '🚗', screen: 'Services' },
  { name: 'Reserve', sub: 'Book in advance', emoji: '📅', screen: 'Services' },
  { name: 'Package', sub: 'Deliver items', emoji: '📦', screen: 'Services' },
  { name: 'Intercity', sub: 'Long distance', emoji: '🚌', screen: 'Services' },
];

function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export default function HomeScreen({ navigation }) {
  const [activeRole, setActiveRole] = useState('rider'); // 'rider' | 'driver' | 'admin'
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Load trips from PostgreSQL
  useEffect(() => {
    fetchTrips(1).then((data) => {
      setTrips(data);
      setLoadingTrips(false);
    });
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Uber Top Brand Header & Role Switcher ── */}
      <View style={styles.topRow}>
        <Text style={styles.uberLogo}>Uber <Text style={styles.uberSubLogo}>AMEN</Text></Text>
        
        {/* Role Toggle */}
        <View style={styles.roleContainer}>
          {[
            { key: 'rider', label: 'Rider' },
            { key: 'driver', label: 'Driver' },
            { key: 'admin', label: 'Admin' },
          ].map((r) => (
            <TouchableOpacity
              key={r.key}
              style={[styles.rolePill, activeRole === r.key && styles.rolePillActive]}
              onPress={() => setActiveRole(r.key)}
            >
              <Text style={[styles.roleText, activeRole === r.key && styles.roleTextActive]}>
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Uber "Where to?" Search Bar ── */}
      <TouchableOpacity
        style={styles.searchPill}
        onPress={() => navigation.navigate('Services')}
        activeOpacity={0.9}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Where to?</Text>

        <View style={styles.timePill}>
          <Text style={styles.timeText}>⏱️ Pickup now ▾</Text>
        </View>
      </TouchableOpacity>

      {/* ── Uber Suggestions Grid ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggestions</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Services')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsGrid}>
        {UBER_SUGGESTIONS.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.suggestionCard}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.85}
          >
            <View style={styles.suggestionIconBox}>
              <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.suggestionName}>{item.name}</Text>
            <Text style={styles.suggestionSub}>{item.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Uber Promo Hero Card ── */}
      <View style={styles.promoCard}>
        <View style={styles.promoTextContainer}>
          <Text style={styles.promoBadge}>Uber AMEN Bahir Dar</Text>
          <Text style={styles.promoTitle}>Go anywhere with Uber AMEN</Text>
          <Text style={styles.promoDesc}>
            {activeRole === 'admin'
              ? 'Fleet Control Center · System Revenue: 48,250 ETB · 142 Vehicles Active'
              : activeRole === 'driver'
              ? 'Today: 1,450 ETB Earned · 8 Trips Done in Bahir Dar'
              : 'Affordable, reliable rides available 24/7 across Bahir Dar.'}
          </Text>

          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() =>
              navigation.navigate(activeRole === 'driver' ? 'Driver' : activeRole === 'admin' ? 'Account' : 'Services')
            }
            activeOpacity={0.9}
          >
            <Text style={styles.promoBtnText}>
              {activeRole === 'driver' ? 'Driver Dashboard' : activeRole === 'admin' ? 'Fleet Admin' : 'Book a ride'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Recent Activity / Trips (PostgreSQL Data) ── */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent activity</Text>

        {loadingTrips ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.loadingText}>Loading trips...</Text>
          </View>
        ) : (
          trips.slice(0, 4).map((trip, i) => (
            <TouchableOpacity key={trip.id || i} style={styles.tripRow} activeOpacity={0.8}>
              <View style={styles.tripIconBox}>
                <Text style={styles.tripIcon}>📍</Text>
              </View>
              <View style={styles.tripDetails}>
                <Text style={styles.tripTitle} numberOfLines={1}>{trip.dropoff_name}</Text>
                <Text style={styles.tripAddr} numberOfLines={1}>{trip.dropoff_addr}</Text>
              </View>
              <View style={styles.tripRight}>
                <Text style={styles.tripPrice}>{Math.round(trip.fare)} ETB</Text>
                <Text style={styles.tripTime}>{formatTimeAgo(trip.created_at)}</Text>
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
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 20 : 52,
  },

  // Header Logo & Role Switcher
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  uberLogo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  uberSubLogo: {
    color: '#05A357', // Uber Green
    fontWeight: '700',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: '#262626',
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  rolePillActive: {
    backgroundColor: '#FFFFFF',
  },
  roleText: {
    color: '#A0A0A0',
    fontSize: 11,
    fontWeight: '700',
  },
  roleTextActive: {
    color: '#000000',
  },

  // "Where to?" Search Bar
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#262626',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timePill: {
    backgroundColor: '#262626',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Suggestions Grid
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seeAllText: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  suggestionCard: {
    width: (width - 48) / 4,
    backgroundColor: '#181818',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
  },
  suggestionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionEmoji: {
    fontSize: 22,
  },
  suggestionName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  suggestionSub: {
    fontSize: 9,
    color: '#A0A0A0',
    marginTop: 2,
  },

  // Promo Card
  promoCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#262626',
  },
  promoTextContainer: { flex: 1 },
  promoBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#05A357',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoDesc: {
    fontSize: 13,
    color: '#A0A0A0',
    lineHeight: 19,
    marginBottom: 16,
  },
  promoBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '800',
  },

  // Recent Activity
  recentSection: {
    marginBottom: 20,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    color: '#A0A0A0',
    fontSize: 13,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#181818',
  },
  tripIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  tripIcon: {
    fontSize: 18,
  },
  tripDetails: { flex: 1 },
  tripTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tripAddr: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
  },
  tripRight: {
    alignItems: 'flex-end',
  },
  tripPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tripTime: {
    fontSize: 10,
    color: '#7C7C7C',
    marginTop: 3,
  },
});
