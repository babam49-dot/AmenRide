import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { fetchTrips } from '../services/tripsApi';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import ReceiptModal from '../components/ReceiptModal';
import AdminConsole from '../components/AdminConsole';
import PaymentMethodCard from '../components/PaymentMethodCard';

const { width, height: windowHeight } = Dimensions.get('window');

const UBER_SUGGESTIONS = [
  { name: 'Ride', sub: 'Instant pickup', emoji: '🚗', screen: 'Services' },
  { name: 'Reserve', sub: 'Book in advance', emoji: '📅', screen: 'Services' },
  { name: 'Package', sub: 'Deliver items', emoji: '📦', screen: 'Services' },
  { name: 'Intercity', sub: 'Long distance', emoji: '🚌', screen: 'Services' },
];

const POPULAR_DESTINATIONS = [
  { title: 'Felege Hiwot Hospital', subtitle: 'Kebele 04, Bahir Dar' },
  { title: 'Grand Resort Hotel', subtitle: 'Lake Tana Shore' },
  { title: 'BDU Peda Campus', subtitle: 'Main Gate • Gate 1' },
  { title: 'Blue Nile Bridge', subtitle: 'Abay River Crossing' },
];

// Actions shown when the floating button expands.
// Feel free to swap the icons/labels/targets for whatever fits your app.
const FAB_ACTIONS = [
  { key: 'ride', label: 'Request Ride', emoji: '🚗', screen: 'Services' },
  { key: 'reserve', label: 'Reserve', emoji: '📅', screen: 'Services' },
  { key: 'support', label: 'Support', emoji: '💬', screen: 'Support' },
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
      // Reveal any rows that are already on-screen once they've laid out
      // (covers the case where the list loads without the user scrolling).
      setTimeout(() => checkRowReveals(lastScrollY.current), 250);
    });
  }, []);

  // ---------------------------------------------------------------------
  // Floating Action Button state + animations
  // ---------------------------------------------------------------------
  const [fabOpen, setFabOpen] = useState(false);
  const fabScale = useRef(new Animated.Value(1)).current; // press feedback
  const fabRotate = useRef(new Animated.Value(0)).current; // + -> x rotation
  const fabMenuAnim = useRef(new Animated.Value(0)).current; // menu expand
  const fabTranslateY = useRef(new Animated.Value(0)).current; // hide on scroll
  const lastScrollY = useRef(0);
  const fabHidden = useRef(false);

  // ---------------------------------------------------------------------
  // Scroll-reveal for "Recent activity" rows
  // ---------------------------------------------------------------------
  const recentSectionY = useRef(0); // this section's Y within the ScrollView content
  const rowLayouts = useRef({}); // index -> { y, height } relative to recentSectionY
  const rowRevealed = useRef({}); // index -> bool, so we only animate once
  const rowAnimsRef = useRef({}); // index -> { opacity, translateY }

  const getRowAnim = (index) => {
    if (!rowAnimsRef.current[index]) {
      rowAnimsRef.current[index] = {
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(28),
      };
    }
    return rowAnimsRef.current[index];
  };

  const revealRow = (index) => {
    if (rowRevealed.current[index]) return;
    rowRevealed.current[index] = true;
    const anim = getRowAnim(index);
    Animated.parallel([
      Animated.timing(anim.opacity, {
        toValue: 1,
        duration: 420,
        delay: index * 90,
        useNativeDriver: true,
      }),
      Animated.spring(anim.translateY, {
        toValue: 0,
        friction: 8,
        tension: 60,
        delay: index * 90,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const checkRowReveals = (scrollY) => {
    const viewportBottom = scrollY + windowHeight;
    Object.keys(rowLayouts.current).forEach((key) => {
      const index = Number(key);
      const layout = rowLayouts.current[index];
      if (!layout) return;
      const absoluteY = recentSectionY.current + layout.y;
      // Reveal once the row is ~60px into the visible viewport
      if (viewportBottom - 60 > absoluteY) {
        revealRow(index);
      }
    });
  };

  const toggleFab = () => {
    const next = !fabOpen;
    setFabOpen(next);
    Animated.parallel([
      Animated.spring(fabRotate, {
        toValue: next ? 1 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 60,
      }),
      Animated.spring(fabMenuAnim, {
        toValue: next ? 1 : 0,
        useNativeDriver: true,
        friction: 7,
        tension: 70,
      }),
    ]).start();
  };

  const handleFabPressIn = () => {
    Animated.spring(fabScale, {
      toValue: 0.88,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handleFabPressOut = () => {
    Animated.spring(fabScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 120,
    }).start();
  };

  const handleFabActionPress = (action) => {
    toggleFab();
    navigation.navigate(action.screen);
  };

  // Hide the FAB while scrolling down, bring it back when scrolling up;
  // also reveal recent-activity rows as they scroll into view.
  const handleScroll = (event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    checkRowReveals(currentY);

    if (Math.abs(diff) > 6) {
      const shouldHide = diff > 0 && currentY > 40;
      if (shouldHide !== fabHidden.current) {
        fabHidden.current = shouldHide;
        if (shouldHide && fabOpen) {
          setFabOpen(false);
          fabRotate.setValue(0);
          fabMenuAnim.setValue(0);
        }
        Animated.spring(fabTranslateY, {
          toValue: shouldHide ? 120 : 0,
          useNativeDriver: true,
          friction: 8,
          tension: 60,
        }).start();
      }
      lastScrollY.current = currentY;
    }
  };

  const fabRotateDeg = fabRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  // ---------------------------------------------------------------------
  // Generic "press to shrink" interactivity, shared by every floating
  // card/button on the screen (search bar, chips, suggestion cards,
  // promo button, trip rows, language pill...).
  // ---------------------------------------------------------------------
  const pressScaleRefs = useRef({});
  const getPressScale = (key) => {
    if (!pressScaleRefs.current[key]) {
      pressScaleRefs.current[key] = new Animated.Value(1);
    }
    return pressScaleRefs.current[key];
  };
  const handlePressIn = (key) => {
    Animated.spring(getPressScale(key), {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 6,
      tension: 100,
    }).start();
  };
  const handlePressOut = (key) => {
    Animated.spring(getPressScale(key), {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 120,
    }).start();
  };

  const dynamicStyles = {
    container: { backgroundColor: theme?.background || (isDark ? '#0B1220' : '#EEF2F6') },
    headerTitle: { color: isDark ? '#FFFFFF' : '#0F172A' },
    cardBg: {
      backgroundColor: isDark ? '#161E2E' : '#FFFFFF',
      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.05)',
    },
    pillBg: { backgroundColor: isDark ? '#232C3D' : '#F1F5F9', borderColor: isDark ? '#333F55' : '#CBD5E1' },
    textPrimary: { color: isDark ? '#FFFFFF' : '#0F172A' },
    textSecondary: { color: isDark ? '#A0A0A0' : '#64748B' },
    activeRolePill: { backgroundColor: isDark ? '#FFFFFF' : '#2BFF6E' },
    activeRoleText: { color: isDark ? '#000000' : '#FFFFFF' },
    subtleDivider: { borderBottomColor: isDark ? '#262626' : '#E2E8F0' },
    promoBtnBg: { backgroundColor: isDark ? '#FFFFFF' : '#00D154' },
    promoBtnText: { color: isDark ? '#000000' : '#FFFFFF' },
    fabBg: { backgroundColor: isDark ? '#FFFFFF' : '#2BFF6E' },
    fabIconColor: isDark ? '#000000' : '#FFFFFF',
    fabActionBg: { backgroundColor: isDark ? '#181818' : '#FFFFFF', borderColor: isDark ? '#262626' : '#E2E8F0' },
    glowOne: { backgroundColor: isDark ? 'rgba(13,148,136,0.20)' : '#2BFF6E' },
    glowTwo: { backgroundColor: isDark ? 'rgba(0,209,84,0.12)' : '#2BFF6E' },
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Soft decorative glow behind everything, gives depth to the flat background */}
      <View style={[styles.bgBase, dynamicStyles.container]} pointerEvents="none">
        <View style={[styles.glowCircle, styles.glowOnePos, dynamicStyles.glowOne]} />
        <View style={[styles.glowCircle, styles.glowTwoPos, dynamicStyles.glowTwo]} />
      </View>

      <ScrollView
        style={[styles.container, { backgroundColor: 'transparent' }]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Top Header */}
        <View style={styles.topRow}>
          <Text style={[styles.uberLogo, dynamicStyles.headerTitle]}>
            Uber <Text style={styles.uberSubLogo}>AMEN</Text>
          </Text>

          <View style={styles.headerRightRow}>
            <Animated.View style={{ transform: [{ scale: getPressScale('lang') }] }}>
              <TouchableOpacity
                style={[styles.langPill, dynamicStyles.pillBg, styles.floatingSoft]}
                onPress={toggleLanguage}
                onPressIn={() => handlePressIn('lang')}
                onPressOut={() => handlePressOut('lang')}
              >
                <Text style={[styles.langText, dynamicStyles.textPrimary]}>{lang === 'en' ? '🌐 EN' : '🇪🇹 AM'}</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={[styles.roleContainer, dynamicStyles.cardBg, styles.floatingSoft]}>
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
        <Animated.View style={{ transform: [{ scale: getPressScale('search') }] }}>
          <TouchableOpacity
            style={[styles.searchPill, dynamicStyles.cardBg, styles.floating]}
            onPress={() => navigation.navigate('Services')}
            onPressIn={() => handlePressIn('search')}
            onPressOut={() => handlePressOut('search')}
            activeOpacity={0.9}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={[styles.searchPlaceholder, dynamicStyles.textPrimary]}>{t('whereTo')}</Text>

            <View style={[styles.timePill, dynamicStyles.pillBg]}>
              <Text style={[styles.timeText, dynamicStyles.textPrimary]}>⏱️ {t('pickupNow')}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Destination Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
          {POPULAR_DESTINATIONS.map((dest, idx) => {
            const chipKey = `chip-${idx}`;
            return (
              <Animated.View key={idx} style={{ transform: [{ scale: getPressScale(chipKey) }] }}>
                <TouchableOpacity
                  style={[styles.chip, dynamicStyles.cardBg, styles.floatingSoft]}
                  onPress={() => navigation.navigate('Services', { destination: dest.title })}
                  onPressIn={() => handlePressIn(chipKey)}
                  onPressOut={() => handlePressOut(chipKey)}
                >
                  <Text style={styles.chipIcon}>📍</Text>
                  <View>
                    <Text style={[styles.chipTitle, dynamicStyles.textPrimary]}>{dest.title}</Text>
                    <Text style={[styles.chipSub, dynamicStyles.textSecondary]}>{dest.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
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
              {UBER_SUGGESTIONS.map((item) => {
                const suggKey = `sugg-${item.name}`;
                return (
                  <Animated.View key={item.name} style={{ transform: [{ scale: getPressScale(suggKey) }] }}>
                    <TouchableOpacity
                      style={[styles.suggestionCard, dynamicStyles.cardBg, styles.floating]}
                      onPress={() => navigation.navigate(item.screen)}
                      onPressIn={() => handlePressIn(suggKey)}
                      onPressOut={() => handlePressOut(suggKey)}
                      activeOpacity={0.85}
                    >
                      <View style={[styles.suggestionIconBox, dynamicStyles.pillBg]}>
                        <Text style={styles.suggestionEmoji}>{item.emoji}</Text>
                      </View>
                      <Text style={[styles.suggestionName, dynamicStyles.textPrimary]}>{item.name}</Text>
                      <Text style={[styles.suggestionSub, dynamicStyles.textSecondary]}>{item.sub}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            <View style={[styles.promoCard, dynamicStyles.cardBg, styles.floating]}>
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoBadge}>Uber AMEN Bahir Dar 🇪🇹</Text>
                <Text style={[styles.promoTitle, dynamicStyles.textPrimary]}>{t('goAnywhere')}</Text>
                <Text style={[styles.promoDesc, dynamicStyles.textSecondary]}>
                  {activeRole === 'driver'
                    ? 'Today: 1,450 ETB Earned · 8 Trips Completed'
                    : 'Fast, secure & reliable Bajaj ride-hailing in Bahir Dar.'}
                </Text>

                <Animated.View style={{ transform: [{ scale: getPressScale('promo') }], alignSelf: 'flex-start' }}>
                  <TouchableOpacity
                    style={[styles.promoBtn, dynamicStyles.promoBtnBg, styles.floatingSoft]}
                    onPress={() =>
                      navigation.navigate(activeRole === 'driver' ? 'Driver' : 'Services')
                    }
                    onPressIn={() => handlePressIn('promo')}
                    onPressOut={() => handlePressOut('promo')}
                    activeOpacity={0.9}
                  >
                    <Text style={[styles.promoBtnText, dynamicStyles.promoBtnText]}>
                      {activeRole === 'driver' ? t('driverDashboard') : t('bookRide')}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </>
        )}

        {/* Recent Trips */}
        <View
          style={styles.recentSection}
          onLayout={(e) => {
            recentSectionY.current = e.nativeEvent.layout.y;
            checkRowReveals(lastScrollY.current);
          }}
        >
          <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>{t('recentActivity')}</Text>

          {loadingTrips ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator color={isDark ? '#FFFFFF' : '#0D9488'} size="small" />
              <Text style={[styles.loadingText, dynamicStyles.textSecondary]}>{t('loadingTrips')}</Text>
            </View>
          ) : (
            trips.slice(0, 4).map((trip, i) => {
              const anim = getRowAnim(i);
              return (
                <Animated.View
                  key={trip.id || i}
                  onLayout={(e) => {
                    rowLayouts.current[i] = {
                      y: e.nativeEvent.layout.y,
                      height: e.nativeEvent.layout.height,
                    };
                    checkRowReveals(lastScrollY.current);
                  }}
                  style={{
                    opacity: anim.opacity,
                    transform: [
                      { translateY: anim.translateY },
                      { scale: getPressScale(`trip-${i}`) },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={[styles.tripRow, dynamicStyles.cardBg, styles.floatingSoft]}
                    activeOpacity={0.8}
                    onPress={() => setSelectedReceiptTrip(trip)}
                    onPressIn={() => handlePressIn(`trip-${i}`)}
                    onPressOut={() => handlePressOut(`trip-${i}`)}
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
                </Animated.View>
              );
            })
          )}
        </View>

        <ReceiptModal
          visible={!!selectedReceiptTrip}
          onClose={() => setSelectedReceiptTrip(null)}
          tripData={selectedReceiptTrip}
        />

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* ------------------------------------------------------------- */}
      {/* Floating Action Button                                       */}
      {/* ------------------------------------------------------------- */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fabWrapper,
          { transform: [{ translateY: fabTranslateY }] },
        ]}
      >
        {/* Backdrop to close the menu when tapping outside */}
        {fabOpen && (
          <TouchableOpacity
            style={styles.fabBackdrop}
            activeOpacity={1}
            onPress={toggleFab}
          />
        )}

        {/* Mini action buttons */}
        <View style={styles.fabActionsContainer} pointerEvents="box-none">
          {FAB_ACTIONS.map((action, index) => {
            const translateY = fabMenuAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -(index + 1) * 62],
            });
            const opacity = fabMenuAnim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0, 1],
            });
            const scale = fabMenuAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.4, 1],
            });

            return (
              <Animated.View
                key={action.key}
                pointerEvents={fabOpen ? 'auto' : 'none'}
                style={[
                  styles.fabActionRow,
                  { transform: [{ translateY }, { scale }], opacity },
                ]}
              >
                <View style={[styles.fabActionLabel, dynamicStyles.fabActionBg]}>
                  <Text style={[styles.fabActionLabelText, dynamicStyles.textPrimary]}>
                    {action.label}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.fabActionBtn, dynamicStyles.fabActionBg]}
                  onPress={() => handleFabActionPress(action)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.fabActionEmoji}>{action.emoji}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Main button */}
        <Animated.View style={{ transform: [{ scale: fabScale }] }}>
          <TouchableOpacity
            style={[styles.fabMain, dynamicStyles.fabBg]}
            activeOpacity={0.9}
            onPress={toggleFab}
            onPressIn={handleFabPressIn}
            onPressOut={handleFabPressOut}
          >
            <Animated.Text
              style={[
                styles.fabIcon,
                { color: dynamicStyles.fabIconColor, transform: [{ rotate: fabRotateDeg }] },
              ]}
            >
              +
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
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
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
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

  // ---- Decorative background ----
  bgBase: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 200,
  },
  glowOnePos: {
    top: -80,
    right: -100,
  },
  glowTwoPos: {
    top: 260,
    left: -140,
  },

  // ---- Shared "floating" shadow, applied to every card-style surface ----
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 6,
  },
  floatingSoft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // ---- Floating Action Button styles ----
  fabWrapper: {
    // 'fixed' anchors to the browser viewport on web (react-native-web),
    // which is what makes it float correctly regardless of parent height.
    // Native (iOS/Android) uses normal 'absolute' positioning.
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 34 : 24,
    alignItems: 'flex-end',
    zIndex: 999,
    elevation: 20,
  },
  fabBackdrop: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
  },
  fabActionsContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'flex-end',
  },
  fabActionRow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fabActionLabel: {
    marginRight: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  fabActionLabelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fabActionBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  fabActionEmoji: {
    fontSize: 20,
  },
  fabMain: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  fabIcon: {
    fontSize: 30,
    fontWeight: '400',
    lineHeight: 32,
  },
});

