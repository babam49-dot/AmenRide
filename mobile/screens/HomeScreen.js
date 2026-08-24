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

// Yango-style 2x2 service grid data
const SERVICE_CATEGORIES = [
  { name: 'Cargo', sub: 'Large goods & delivery', emoji: '🚚', screen: 'Services' },
  { name: 'Transport', sub: 'City & intercity bus', emoji: '🚌', screen: 'Services' },
  { name: 'Delivery', sub: 'Motorcycle courier', emoji: '🏍️', screen: 'Services' },
  { name: 'Rides', sub: 'from 3 min', emoji: '🚘', screen: 'Services', badge: 'from 3 min' },
];

// Suggested destinations (Yango vertical list style)
const POPULAR_DESTINATIONS = [
  { title: 'BDU 5 Kilo Peda Campus', subtitle: 'Bahir Dar, Arada, Kebele 11', icon: '🎓' },
  { title: 'Felege Hiwot Referral Hospital', subtitle: 'Bahir Dar, Kebele 04', icon: '📍' },
  { title: 'Atenatera Taxi Station', subtitle: 'Bahir Dar, Main Bus Station, Kebele 01', icon: '📍' },
  { title: 'Grand Resort Hotel', subtitle: 'Bahir Dar, Lake Tana Shore, Kebele 03', icon: '📍' },
];

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
    // Yango-style: white background
    container: { backgroundColor: '#F5F5F5' },
    headerTitle: { color: '#FF2E2E' },
    cardBg: { backgroundColor: '#FFFFFF', borderColor: 'rgba(0,0,0,0.06)' },
    pillBg: { backgroundColor: '#F1F5F9', borderColor: '#E2E8F0' },
    textPrimary: { color: '#111111' },
    textSecondary: { color: '#64748B' },
    activeRolePill: { backgroundColor: '#FF2E2E' },
    activeRoleText: { color: '#FFFFFF' },
    subtleDivider: { borderBottomColor: '#E2E8F0' },
    promoBtnBg: { backgroundColor: '#FFFFFF' },
    promoBtnText: { color: '#FF2E2E' },
    fabBg: { backgroundColor: '#FF2E2E' },
    fabIconColor: '#FFFFFF',
    fabActionBg: { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0' },
    glowOne: { backgroundColor: 'rgba(255,46,46,0.08)' },
    glowTwo: { backgroundColor: 'rgba(255,46,46,0.04)' },
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
        {/* Top Header — Yango Red Branding */}
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.uberLogo, { color: '#FF2E2E', fontStyle: 'italic', fontWeight: '900', letterSpacing: -1 }]}>
              AMEN
            </Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}
              onPress={() => navigation.navigate('Services')}
            >
              <Text style={{ fontSize: 11, color: '#FF2E2E', marginRight: 2 }}>📍</Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#111111' }}>Felege Hiwot Square</Text>
              <Text style={{ fontSize: 12, color: '#64748B' }}>›</Text>
            </TouchableOpacity>
          </View>

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

        {/* Yango Service Category Grid: Top horizontal cards + Bottom SQUARE shape cards */}
        <View style={styles.serviceGrid}>
          {/* Top Row: Cargo & Transport */}
          <View style={styles.serviceRow}>
            {SERVICE_CATEGORIES.slice(0, 2).map((item, idx) => {
              const cardKey = `service-${idx}`;
              return (
                <Animated.View key={item.name} style={[styles.serviceCardWrap, { transform: [{ scale: getPressScale(cardKey) }] }]}>
                  <TouchableOpacity
                    style={[styles.serviceCardTop, { backgroundColor: '#EFEFF1' }]}
                    onPress={() => navigation.navigate(item.screen)}
                    onPressIn={() => handlePressIn(cardKey)}
                    onPressOut={() => handlePressOut(cardKey)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.serviceEmojiTop}>{item.emoji}</Text>
                    <Text style={styles.serviceName}>{item.name}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Bottom Row: Delivery & Rides (SQUARE SHAPE 1:1 RATIO) */}
          <View style={styles.serviceRow}>
            {SERVICE_CATEGORIES.slice(2, 4).map((item, idx) => {
              const cardKey = `service-${idx + 2}`;
              return (
                <Animated.View key={item.name} style={[styles.serviceCardWrap, { transform: [{ scale: getPressScale(cardKey) }] }]}>
                  <TouchableOpacity
                    style={[styles.serviceCardSquare, { backgroundColor: '#EFEFF1' }]}
                    onPress={() => navigation.navigate(item.screen)}
                    onPressIn={() => handlePressIn(cardKey)}
                    onPressOut={() => handlePressOut(cardKey)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.squareIconBox}>
                      <Text style={styles.serviceEmojiSquare}>{item.emoji}</Text>
                    </View>
                    <Text style={styles.serviceName}>
                      {item.name}
                      {item.badge ? <Text style={styles.serviceBadge}> • {item.badge}</Text> : null}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Yango-style pill "Where to?" search bar */}
        <Animated.View style={{ transform: [{ scale: getPressScale('search') }], marginHorizontal: 16, marginBottom: 8 }}>
          <TouchableOpacity
            style={styles.whereToBar}
            onPress={() => navigation.navigate('Services')}
            onPressIn={() => handlePressIn('search')}
            onPressOut={() => handlePressOut('search')}
            activeOpacity={0.9}
          >
            <Text style={styles.whereToIcon}>🚘</Text>
            <Text style={styles.whereToText}>{t('whereTo')}</Text>
            <View style={styles.whereToArrow}>
              <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 18 }}>›</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Yango-style vertical destinations list */}
        <View style={styles.destList}>
          {POPULAR_DESTINATIONS.map((dest, idx) => {
            const chipKey = `chip-${idx}`;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.destRow, idx < POPULAR_DESTINATIONS.length - 1 && styles.destRowBorder]}
                onPress={() => navigation.navigate('Services', { destination: dest.title })}
                onPressIn={() => handlePressIn(chipKey)}
                onPressOut={() => handlePressOut(chipKey)}
              >
                <View style={styles.destIconBadge}>
                  <Text style={{ fontSize: 18 }}>{dest.icon}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.destTitle}>{dest.title}</Text>
                  <Text style={styles.destSub}>{dest.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Yango-style Red Promo Banner */}
        {activeRole !== 'admin' && (
          <TouchableOpacity
            style={styles.promoBanner}
            onPress={() => navigation.navigate(activeRole === 'driver' ? 'Driver' : 'Services')}
            activeOpacity={0.9}
          >
            {/* Decorative diagonal blocks */}
            <View style={styles.promoDiag1} />
            <View style={styles.promoDiag2} />
            <View style={styles.promoDiag3} />

            <View style={{ zIndex: 2, maxWidth: '65%' }}>
              <Text style={styles.promoBannerTitle}>
                {activeRole === 'driver' ? 'DRIVER DASHBOARD' : 'TRY DELIVERY\nON AMEN'}
              </Text>
              <Text style={styles.promoBannerSub}>
                {activeRole === 'driver'
                  ? 'View your earnings & active trips'
                  : 'Use 20% discount for your first 6 orders'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {activeRole === 'admin' && <AdminConsole />}

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

  // ── 2×2 Yango Service Grid with Square Cards ──
  serviceGrid: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  serviceRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  serviceCardWrap: {
    flex: 1,
  },
  serviceCardTop: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 100,
  },
  serviceCardSquare: {
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: (width - 42) / 2, // Perfect 1:1 Square Shape!
  },
  squareIconBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmojiTop: {
    fontSize: 34,
  },
  serviceEmojiSquare: {
    fontSize: 54,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
  },
  serviceBadge: {
    fontSize: 11,
    fontWeight: '400',
    color: '#64748B',
  },


  // ── Yango "Where to?" pill ──
  whereToBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 50,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 8,
  },
  whereToIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  whereToText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  whereToArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Yango vertical destinations list ──
  destList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  destRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  destRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  destIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  destTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  destSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // ── Yango Red Promo Banner ──
  promoBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#FF2E2E',
    paddingVertical: 26,
    paddingHorizontal: 22,
    minHeight: 130,
    justifyContent: 'center',
  },
  promoBannerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    lineHeight: 24,
  },
  promoBannerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '600',
    marginTop: 6,
  },
  promoDiag1: {
    position: 'absolute',
    right: 40,
    top: -10,
    width: 55,
    height: 140,
    backgroundColor: '#FFCC00',
    transform: [{ skewX: '-10deg' }],
    borderRadius: 4,
    opacity: 0.9,
  },
  promoDiag2: {
    position: 'absolute',
    right: 8,
    top: 0,
    width: 32,
    height: 120,
    backgroundColor: '#1A8C1A',
    transform: [{ skewX: '-8deg' }],
    borderRadius: 4,
    opacity: 0.85,
  },
  promoDiag3: {
    position: 'absolute',
    right: 78,
    top: 20,
    width: 12,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.6)',
    transform: [{ skewX: '-10deg' }],
    borderRadius: 2,
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

