import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { fetchDriver } from '../services/tripsApi';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import useDriverGPS from '../hooks/useDriverGPS';
import EmergencyButton from '../components/EmergencyButton';

const WEEKLY_EARNINGS = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 950 },
  { day: 'Wed', amount: 1450, isToday: true },
  { day: 'Thu', amount: 1100 },
  { day: 'Fri', amount: 1800 },
  { day: 'Sat', amount: 2100 },
  { day: 'Sun', amount: 1600 },
];

function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  return (
    <View style={styles.timerContainer}>
      <Text style={[styles.timerText, remaining <= 5 && { color: '#EF4444' }]}>{remaining}s</Text>
    </View>
  );
}

export default function DriverScreen() {
  const { t } = useLanguage();
  const { mode, theme } = useTheme();
  const isDark = mode === 'dark';
  const [isOnline, setIsOnline] = useState(false);

  const [hasRequest, setHasRequest] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const { location, error: gpsError, isTracking } = useDriverGPS({
    driverId: driver?.id || 1,
    isOnline,
  });

  useEffect(() => {
    fetchDriver(1).then((d) => {
      setDriver(d);
      setLoading(false);
    });
  }, []);

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    if (next) {
      setTimeout(() => setHasRequest(true), 3000);
    } else {
      setHasRequest(false);
    }
  };

  const earnings = driver?.today_earnings || 1450;
  const todayTrips = driver?.today_trips || 8;
  const maxWeekly = Math.max(...WEEKLY_EARNINGS.map((w) => w.amount));

  const dynamicStyles = {
    container: { backgroundColor: theme?.background || (isDark ? '#0F172A' : '#F8FAFC') },
    cardBg: { backgroundColor: isDark ? '#181818' : '#FFFFFF', borderColor: isDark ? '#262626' : '#E2E8F0' },
    pillBg: { backgroundColor: isDark ? '#262626' : '#F1F5F9', borderColor: isDark ? '#333333' : '#CBD5E1' },
    textPrimary: { color: isDark ? '#FFFFFF' : '#0F172A' },
    textSecondary: { color: isDark ? '#A0A0A0' : '#64748B' },
    divider: { backgroundColor: isDark ? '#262626' : '#E2E8F0' },
  };

  return (
    <ScrollView
      style={[styles.container, dynamicStyles.container]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, dynamicStyles.textPrimary]}>{t('driverDashboard')}</Text>
        <Text style={[styles.headerSub, dynamicStyles.textSecondary]}>Bahir Dar Fleet Partner 🇪🇹</Text>
      </View>

      {/* GPS Status Badge */}
      {isOnline && (
        <View style={[styles.gpsBadge, isTracking ? styles.gpsBadgeActive : dynamicStyles.cardBg]}>
          {isTracking && location ? (
            <Text style={styles.gpsBadgeText}>
              📡 Broadcasting GPS · {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
            </Text>
          ) : gpsError ? (
            <Text style={styles.gpsBadgeText}>⚠️ {gpsError}</Text>
          ) : (
            <Text style={[styles.gpsBadgeText, dynamicStyles.textSecondary]}>📍 Acquiring GPS signal...</Text>
          )}
        </View>
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={isDark ? '#FFFFFF' : '#0D9488'} size="small" />
          <Text style={[styles.loadingText, dynamicStyles.textSecondary]}>Loading driver profile...</Text>
        </View>
      )}

      {/* Online/Offline Banner */}
      <TouchableOpacity
        style={[styles.statusBanner, isOnline ? styles.statusOnline : dynamicStyles.cardBg]}
        onPress={toggleOnline}
        activeOpacity={0.9}
      >
        <View>
          <Text style={[styles.statusLabel, isOnline ? { color: '#FFFFFF' } : dynamicStyles.textPrimary]}>
            {isOnline ? t('youreOnline') : t('youreOffline')}
          </Text>
          <Text style={[styles.statusHint, isOnline ? { color: '#E0E0E0' } : dynamicStyles.textSecondary]}>
            {isOnline ? t('onlineHint') : t('offlineHint')}
          </Text>
        </View>

        <Switch
          trackColor={{ false: '#CBD5E1', true: '#00D154' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#262626"
          onValueChange={toggleOnline}
          value={isOnline}
        />
      </TouchableOpacity>

      {/* Net Earnings Hero Card */}
      <View style={[styles.earningsCard, dynamicStyles.cardBg]}>
        <Text style={[styles.earningsLabel, dynamicStyles.textSecondary]}>{t('netEarnings')}</Text>
        <Text style={[styles.earningsVal, dynamicStyles.textPrimary]}>{earnings.toLocaleString()} ETB</Text>

        <View style={[styles.metaRow, dynamicStyles.divider]}>
          <View style={styles.metaCol}>
            <Text style={[styles.metaVal, dynamicStyles.textPrimary]}>{todayTrips}</Text>
            <Text style={[styles.metaLabel, dynamicStyles.textSecondary]}>Trips</Text>
          </View>
          <View style={[styles.metaDivider, dynamicStyles.divider]} />
          <View style={styles.metaCol}>
            <Text style={[styles.metaVal, dynamicStyles.textPrimary]}>⭐ {driver?.rating || '4.92'}</Text>
            <Text style={[styles.metaLabel, dynamicStyles.textSecondary]}>Rating</Text>
          </View>
          <View style={[styles.metaDivider, dynamicStyles.divider]} />
          <View style={styles.metaCol}>
            <Text style={[styles.metaVal, dynamicStyles.textPrimary]}>{driver?.acceptance_rate || '96'}%</Text>
            <Text style={[styles.metaLabel, dynamicStyles.textSecondary]}>Acceptance</Text>
          </View>
        </View>
      </View>

      {/* Weekly Revenue Bar Chart */}
      <View style={[styles.chartCard, dynamicStyles.cardBg]}>
        <Text style={[styles.chartTitle, dynamicStyles.textPrimary]}>Weekly Revenue Breakdown</Text>
        <Text style={styles.chartSub}>Total Week: 10,200 ETB</Text>

        <View style={styles.barChartRow}>
          {WEEKLY_EARNINGS.map((item) => {
            const heightPct = (item.amount / maxWeekly) * 100;
            return (
              <View key={item.day} style={styles.barCol}>
                <Text style={[styles.barVal, dynamicStyles.textSecondary]}>{Math.round(item.amount / 1000)}k</Text>
                <View style={[styles.barTrack, dynamicStyles.pillBg]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${heightPct}%` },
                      item.isToday && styles.barFillToday,
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, dynamicStyles.textSecondary, item.isToday && styles.barLabelToday]}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Trip Request Dispatch Modal */}
      {isOnline && hasRequest && (
        <View style={[styles.requestCard, dynamicStyles.cardBg]}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestBadge}>⚡ TRIP REQUEST</Text>
            <CountdownTimer seconds={15} onExpire={() => setHasRequest(false)} />
          </View>

          <View style={styles.fareRow}>
            <Text style={[styles.fareVal, dynamicStyles.textPrimary]}>210.00 ETB</Text>
            <Text style={[styles.fareDist, dynamicStyles.textSecondary]}>4.2 km · 12 min</Text>
          </View>

          <View style={[styles.addrBox, dynamicStyles.pillBg]}>
            <Text style={[styles.addrText, dynamicStyles.textPrimary]}>■ <Text style={[styles.addrBold, dynamicStyles.textPrimary]}>Pickup:</Text> Bahir Dar Airport</Text>
            <Text style={[styles.addrText, dynamicStyles.textPrimary]}>● <Text style={[styles.addrBold, dynamicStyles.textPrimary]}>Dropoff:</Text> Grand Resort Hotel</Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.declineBtn, dynamicStyles.pillBg]} onPress={() => setHasRequest(false)}>
              <Text style={[styles.declineBtnText, dynamicStyles.textSecondary]}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => {
                if (Platform.OS === 'web') alert('AMEN Trip Accepted! 🚗');
                else Alert.alert('Trip Accepted', 'Heading to Bahir Dar Airport pickup point.');
                setHasRequest(false);
              }}
            >
              <Text style={styles.acceptBtnText}>Accept AMEN Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Account Details */}
      <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>Account Details</Text>
      <View style={[styles.card, dynamicStyles.cardBg]}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, dynamicStyles.textSecondary]}>Vehicle</Text>
          <Text style={[styles.rowVal, dynamicStyles.textPrimary]}>{driver?.vehicle_type || 'Standard Bajaj'}</Text>
        </View>
        <View style={[styles.divider, dynamicStyles.divider]} />
        <View style={styles.row}>
          <Text style={[styles.rowLabel, dynamicStyles.textSecondary]}>License Plate</Text>
          <Text style={[styles.rowVal, dynamicStyles.textPrimary]}>{driver?.vehicle_plate || 'BD-3-1029'}</Text>
        </View>
        <View style={[styles.divider, dynamicStyles.divider]} />
        <View style={styles.row}>
          <Text style={[styles.rowLabel, dynamicStyles.textSecondary]}>Total Lifetime Trips</Text>
          <Text style={[styles.rowVal, dynamicStyles.textPrimary]}>{driver?.total_trips || 847}</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 20 : 52,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
  },
  headerSub: {
    fontSize: 13,
    marginTop: 2,
  },

  loadingBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 13,
  },

  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  statusOnline: {
    backgroundColor: '#00D154',
  },
  statusOffline: {},
  statusLabel: {
    fontSize: 18,
    fontWeight: '900',
  },
  statusHint: {
    fontSize: 12,
    marginTop: 4,
  },

  earningsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  earningsLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  earningsVal: {
    fontSize: 34,
    fontWeight: '900',
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  metaCol: { alignItems: 'center' },
  metaVal: { fontSize: 16, fontWeight: '800' },
  metaLabel: { fontSize: 11, marginTop: 2 },
  metaDivider: { width: 1, height: 26 },

  chartCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  chartTitle: { fontSize: 16, fontWeight: '800' },
  chartSub: { fontSize: 12, color: '#00D154', marginTop: 2, fontWeight: '700', marginBottom: 16 },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barVal: { fontSize: 9, marginBottom: 4, fontWeight: '700' },
  barTrack: {
    width: 14,
    height: 80,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#94A3B8',
    borderRadius: 7,
  },
  barFillToday: {
    backgroundColor: '#00D154',
  },
  barLabel: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '700',
  },
  barLabelToday: {
    color: '#00D154',
  },

  requestCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00D154',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestBadge: {
    color: '#00D154',
    fontWeight: '900',
    fontSize: 14,
  },
  timerContainer: {
    backgroundColor: '#00D15422',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: {
    color: '#00D154',
    fontWeight: '800',
    fontSize: 14,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  fareVal: {
    fontSize: 26,
    fontWeight: '900',
  },
  fareDist: {
    fontSize: 13,
    fontWeight: '600',
  },
  addrBox: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  addrText: { fontSize: 13 },
  addrBold: { fontWeight: '800' },

  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  declineBtnText: { fontWeight: '800' },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#00D154',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: '900' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLabel: { fontSize: 14 },
  rowVal: { fontSize: 14, fontWeight: '700' },
  divider: { height: 1 },

  gpsBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
    borderWidth: 1,
  },
  gpsBadgeActive: {
    backgroundColor: 'rgba(0,209,84,0.15)',
    borderColor: '#00D154',
  },
  gpsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});
