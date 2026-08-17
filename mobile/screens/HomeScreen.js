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
import { useTheme } from '../context/ThemeContext';
import ReceiptModal from '../components/ReceiptModal';
import AdminConsole from '../components/AdminConsole';
import PaymentMethodCard from '../components/PaymentMethodCard';

import { BAHIR_DAR_PRESETS } from '../utils/bahirDarLocations';

const { width } = Dimensions.get('window');

const UBER_SUGGESTIONS = [
  { name: 'Ride', sub: 'Instant pickup', emoji: '🚗', screen: 'Services' },
  { name: 'Reserve', sub: 'Book in advance', emoji: '📅', screen: 'Services' },
  { name: 'Package', sub: 'Deliver items', emoji: '📦', screen: 'Services' },
  { name: 'Intercity', sub: 'Long distance', emoji: '🚌', screen: 'Services' },
];

export default function HomeScreen({ navigation }) {
  const { lang, toggleLanguage, t } = useLanguage();
  const { mode, theme } = useTheme();
  const isDark = mode === 'dark';
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

  const dynamicStyles = {
    container: { backgroundColor: theme?.background || (isDark ? '#0F172A' : '#F8FAFC') },
    headerTitle: { color: isDark ? '#FFFFFF' : '#0F172A' },
    cardBg: { backgroundColor: isDark ? '#181818' : '#FFFFFF', borderColor: isDark ? '#262626' : '#E2E8F0' },
    pillBg: { backgroundColor: isDark ? '#262626' : '#F1F5F9', borderColor: isDark ? '#333333' : '#CBD5E1' },
    textPrimary: { color: isDark ? '#FFFFFF' : '#0F172A' },
    textSecondary: { color: isDark ? '#A0A0A0' : '#64748B' },
    activeRolePill: { backgroundColor: isDark ? '#FFFFFF' : '#0D9488' },
    activeRoleText: { color: isDark ? '#000000' : '#FFFFFF' },
    subtleDivider: { borderBottomColor: isDark ? '#262626' : '#E2E8F0' },
    promoBtnBg: { backgroundColor: isDark ? '#FFFFFF' : '#0D9488' },
    promoBtnText: { color: isDark ? '#000000' : '#FFFFFF' },
  };

  return (
    <ScrollView
      style={[styles.container, dynamicStyles.container]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.topRow}>
        <Text style={[styles.uberLogo, dynamicStyles.headerTitle]}>
          Uber <Text style={styles.uberSubLogo}>AMEN</Text>
        </Text>

        <View style={styles.headerRightRow}>
          <TouchableOpacity style={[styles.langPill, dynamicStyles.pillBg]} onPress={toggleLanguage}>
            <Text style={[styles.langText, dynamicStyles.textPrimary]}>{lang === 'en' ? '🌐 EN' : '🇪🇹 AM'}</Text>
          </TouchableOpacity>

          <View style={[styles.roleContainer, dynamicStyles.cardBg]}>
            {[
              { key: 'rider', label: 'Rider' },
              { key: 'driver', label: 'Driver' },
              { key: 'admin', label: 'Admin' },
            ].map((r) => (
              <TouchableOpacity
                key={r.key}
                style={[styles.rolePill, activeRole === r.key && dynamicStyles.activeRolePill]}
                onPress={() => setActiveRole(r.key)}
              >
                <Text style={[styles.roleText, dynamicStyles.textSecondary, activeRole === r.key && dynamicStyles.activeRoleText]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Where to Search Bar */}
      <TouchableOpacity
        style={[styles.searchPill, dynamicStyles.cardBg]}
        onPress={() => navigation.navigate('Services')}
        activeOpacity={0.9}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={[styles.searchPlaceholder, dynamicStyles.textPrimary]}>{t('whereTo')}</Text>

        <View style={[styles.timePill, dynamicStyles.pillBg]}>
          <Text style={[styles.timeText, dynamicStyles.textPrimary]}>⏱️ {t('pickupNow')}</Text>
        </View>
      </TouchableOpacity>

      {/* Quick Destination Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
        {BAHIR_DAR_PRESETS.slice(0, 6).map((dest, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.chip, dynamicStyles.cardBg]}
            onPress={() => navigation.navigate('Services', { destination: dest.name })}
          >
            <Text style={styles.chipIcon}>📍</Text>
            <View>
              <Text style={[styles.chipTitle, dynamicStyles.textPrimary]}>{dest.name}</Text>
              <Text style={[styles.chipSub, dynamicStyles.textSecondary]}>{dest.subtitle}</Text>
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
            <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>{t('suggestions')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={[styles.seeAllText, dynamicStyles.textSecondary]}>{t('seeAll')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.suggestionsGrid}>
            {UBER_SUGGESTIONS.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={[styles.suggestionCard, dynamicStyles.cardBg]}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.85}
              >
                <View style={[styles.suggestionIconBox, dynamicStyles.pillBg]}>
                  <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
                </View>
                <Text style={[styles.suggestionName, dynamicStyles.textPrimary]}>{item.name}</Text>
                <Text style={[styles.suggestionSub, dynamicStyles.textSecondary]}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.promoCard, dynamicStyles.cardBg]}>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoBadge}>Uber AMEN Bahir Dar 🇪🇹</Text>
              <Text style={[styles.promoTitle, dynamicStyles.textPrimary]}>{t('goAnywhere')}</Text>
              <Text style={[styles.promoDesc, dynamicStyles.textSecondary]}>
                {activeRole === 'driver'
                  ? 'Today: 1,450 ETB Earned · 8 Trips Completed'
                  : 'Fast, secure & reliable Bajaj ride-hailing in Bahir Dar.'}
              </Text>

              <TouchableOpacity
                style={[styles.promoBtn, dynamicStyles.promoBtnBg]}
                onPress={() =>
                  navigation.navigate(activeRole === 'driver' ? 'Driver' : 'Services')
                }
                activeOpacity={0.9}
              >
                <Text style={[styles.promoBtnText, dynamicStyles.promoBtnText]}>
                  {activeRole === 'driver' ? t('driverDashboard') : t('bookRide')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Recent Trips */}
      <View style={styles.recentSection}>
        <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>{t('recentActivity')}</Text>

        {loadingTrips ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={isDark ? '#FFFFFF' : '#0D9488'} size="small" />
            <Text style={[styles.loadingText, dynamicStyles.textSecondary]}>{t('loadingTrips')}</Text>
          </View>
        ) : (
          trips.slice(0, 4).map((trip, i) => (
            <TouchableOpacity
              key={trip.id || i}
              style={[styles.tripRow, dynamicStyles.subtleDivider]}
              activeOpacity={0.8}
              onPress={() => setSelectedReceiptTrip(trip)}
            >
              <View style={[styles.tripIconBox, dynamicStyles.pillBg]}>
                <Text style={styles.tripIcon}>📍</Text>
              </View>
              <View style={styles.tripDetails}>
                <Text style={[styles.tripTitle, dynamicStyles.textPrimary]} numberOfLines={1}>{trip.dropoff_name}</Text>
                <Text style={[styles.tripAddr, dynamicStyles.textSecondary]} numberOfLines={1}>{trip.dropoff_addr}</Text>
              </View>
              <View style={styles.tripRight}>
                <Text style={[styles.tripPrice, dynamicStyles.textPrimary]}>{Math.round(trip.fare)} ETB</Text>
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
    letterSpacing: -0.5,
  },
  uberSubLogo: {
    color: '#00D154',
    fontWeight: '700',
  },
  langPill: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  langText: {
    fontSize: 11,
    fontWeight: '800',
  },
  roleContainer: {
    flexDirection: 'row',
    borderRadius: 18,
    padding: 3,
    borderWidth: 1,
  },
  rolePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  timePill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chipsScroll: {
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  chipTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  chipSub: {
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
  },
  seeAllText: {
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
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  suggestionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  },
  suggestionSub: {
    fontSize: 9,
    marginTop: 2,
  },
  promoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    borderWidth: 1,
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
    marginBottom: 8,
  },
  promoDesc: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  promoBtn: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 22,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
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
    fontSize: 13,
  },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  tripIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  },
  tripAddr: {
    fontSize: 12,
    marginTop: 2,
  },
  tripRight: {
    alignItems: 'flex-end',
  },
  tripPrice: {
    fontSize: 14,
    fontWeight: '800',
  },
  receiptTag: {
    fontSize: 10,
    color: '#00D154',
    fontWeight: '700',
    marginTop: 3,
  },
});

