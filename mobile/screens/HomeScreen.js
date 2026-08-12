import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { fetchTrips } from '../services/tripsApi';
import { useLanguage } from '../context/LanguageContext';
import ReceiptModal from '../components/ReceiptModal';
import AdminConsole from '../components/AdminConsole';

const { width } = Dimensions.get('window');

const UBER_SUGGESTIONS = [
  { name: 'Ride', sub: 'Instant pickup', emoji: '🚗', screen: 'Services' },
  { name: 'Reserve', sub: 'Book in advance', emoji: '📅', screen: 'Services' },
  { name: 'Package', sub: 'Deliver items', emoji: '📦', screen: 'Services' },
  { name: 'Intercity', sub: 'Long distance', emoji: '🚌', screen: 'Services' },
];

const POPULAR_DESTINATIONS = [
  { title: 'Felege Hiwot Hospital', subtitle: 'Kebele 04, Bahir Dar' },
  { title: 'Grand Resort Hotel', subtitle: 'Lake Tana Shore' },
  { title: 'Blue Nile Bridge', subtitle: 'Abay River Crossing' },
];

export default function HomeScreen({ navigation }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const [activeRole, setActiveRole] = useState('rider');
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [selectedReceiptTrip, setSelectedReceiptTrip] = useState(null);

  useEffect(() => {
    fetchTrips(1).then((data) => {
      setTrips(data);
      setLoadingTrips(false);
    });
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <Text style={styles.uberLogo}>
          Uber <Text style={styles.uberSubLogo}>AMEN</Text>
        </Text>

        <View style={styles.headerRightRow}>
          <TouchableOpacity style={styles.langPill} onPress={toggleLanguage}>
            <Text style={styles.langText}>{lang === 'en' ? '🌐 EN' : '🇪🇹 AM'}</Text>
          </TouchableOpacity>

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
      </View>

      {/* Where to Search Bar */}
      <TouchableOpacity
        style={styles.searchPill}
        onPress={() => navigation.navigate('Services')}
        activeOpacity={0.9}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>{t('whereTo')}</Text>

        <View style={styles.timePill}>
          <Text style={styles.timeText}>⏱️ {t('pickupNow')}</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Destination Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {POPULAR_DESTINATIONS.map((dest, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.chip}
            onPress={() => navigation.navigate('Services', { destination: dest.title })}
          >
            <Text style={styles.chipIcon}>📍</Text>
            <View>
              <Text style={styles.chipTitle}>{dest.title}</Text>
              <Text style={styles.chipSub}>{dest.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Role specific content */}
      {activeRole === 'admin' ? (
        <AdminConsole />
      ) : (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('suggestions')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={styles.seeAllText}>{t('seeAll')}</Text>
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

          <View style={styles.promoCard}>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoBadge}>Uber AMEN Bahir Dar 🇪🇹</Text>
              <Text style={styles.promoTitle}>{t('goAnywhere')}</Text>
              <Text style={styles.promoDesc}>
                {activeRole === 'driver'
                  ? 'Today: 1,450 ETB Earned · 8 Trips Completed'
                  : 'Fast, secure & reliable Bajaj ride-hailing in Bahir Dar.'}
              </Text>

              <TouchableOpacity
                style={styles.promoBtn}
                onPress={() =>
                  navigation.navigate(activeRole === 'driver' ? 'Driver' : 'Services')
                }
                activeOpacity={0.9}
              >
                <Text style={styles.promoBtnText}>
                  {activeRole === 'driver' ? t('driverDashboard') : t('bookRide')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Recent Trips */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>

        {loadingTrips ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.loadingText}>{t('loadingTrips')}</Text>
          </View>
        ) : (
          trips.slice(0, 4).map((trip, i) => (
            <TouchableOpacity
              key={trip.id || i}
              style={styles.tripRow}
              activeOpacity={0.8}
              onPress={() => setSelectedReceiptTrip(trip)}
            >
              <View style={styles.tripIconBox}>
                <Text style={styles.tripIcon}>📍</Text>
              </View>
              <View style={styles.tripDetails}>
                <Text style={styles.tripTitle} numberOfLines={1}>{trip.dropoff_name}</Text>
                <Text style={styles.tripAddr} numberOfLines={1}>{trip.dropoff_addr}</Text>
              </View>
              <View style={styles.tripRight}>
                <Text style={styles.tripPrice}>{Math.round(trip.fare)} ETB</Text>
                <Text style={styles.receiptTag}>🧾 Receipt</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <ReceiptModal
        visible={!!selectedReceiptTrip}
        onClose={() => setSelectedReceiptTrip(null)}
        tripData={selectedReceiptTrip}
      />

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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uberLogo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  uberSubLogo: {
    color: '#00D154',
    fontWeight: '700',
  },
  langPill: {
    backgroundColor: '#262626',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333333',
  },
  langText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  roleContainer: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderRadius: 18,
    padding: 3,
    borderWidth: 1,
    borderColor: '#262626',
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  rolePillActive: {
    backgroundColor: '#FFFFFF',
  },
  roleText: {
    color: '#A0A0A0',
    fontSize: 10,
    fontWeight: '700',
  },
  roleTextActive: {
    color: '#000000',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
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
  chipsScroll: {
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181818',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#262626',
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  chipTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  chipSub: {
    color: '#8E8E93',
    fontSize: 10,
  },
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
    marginBottom: 24,
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
    color: '#00D154',
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
  recentSection: {
    marginBottom: 20,
    marginTop: 10,
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
  receiptTag: {
    fontSize: 10,
    color: '#00D154',
    fontWeight: '700',
    marginTop: 3,
  },
});
