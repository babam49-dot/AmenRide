import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { fetchDriver } from '../services/tripsApi';
import { useLanguage } from '../context/LanguageContext';
import useDriverGPS from '../hooks/useDriverGPS';

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
  const [isOnline, setIsOnline] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  // GPS hook — broadcasts real phone location to backend every 5s when online
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* ── Uber Driver Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('driverDashboard')}</Text>
        <Text style={styles.headerSub}>Bahir Dar Fleet Partner</Text>
      </View>

      {/* GPS Status Badge */}
      {isOnline && (
        <View style={[styles.gpsBadge, isTracking ? styles.gpsBadgeActive : styles.gpsBadgeWaiting]}>
          {isTracking && location ? (
            <Text style={styles.gpsBadgeText}>
              📡 Broadcasting GPS · {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
            </Text>
          ) : gpsError ? (
            <Text style={styles.gpsBadgeText}>⚠️ {gpsError}</Text>
          ) : (
            <Text style={styles.gpsBadgeText}>📍 Acquiring GPS signal...</Text>
          )}
        </View>
      )}

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#FFFFFF" size="small" />
          <Text style={styles.loadingText}>Loading driver profile...</Text>
        </View>
      )}

      {/* ── Uber Online/Offline Toggle Button ── */}
      <TouchableOpacity
        style={[styles.statusBanner, isOnline ? styles.statusOnline : styles.statusOffline]}
        onPress={toggleOnline}
        activeOpacity={0.9}
      >
        <View>
          <Text style={styles.statusLabel}>{isOnline ? t('youreOnline') : t('youreOffline')}</Text>
          <Text style={styles.statusHint}>
            {isOnline ? t('onlineHint') : t('offlineHint')}
          </Text>
        </View>

        <Switch
          trackColor={{ false: '#333333', true: '#05A357' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#262626"
          onValueChange={toggleOnline}
          value={isOnline}
        />
      </TouchableOpacity>

      {/* ── Uber Net Earnings Hero Card ── */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>{t('netEarnings')}</Text>
        <Text style={styles.earningsVal}>{earnings.toLocaleString()} ETB</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaVal}>{todayTrips}</Text>
            <Text style={styles.metaLabel}>Trips</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCol}>
            <Text style={styles.metaVal}>⭐ {driver?.rating || '4.92'}</Text>
            <Text style={styles.metaLabel}>Rating</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaCol}>
            <Text style={styles.metaVal}>{driver?.acceptance_rate || '96'}%</Text>
            <Text style={styles.metaLabel}>Acceptance</Text>
          </View>
        </View>
      </View>

      {/* ── Weekly Revenue Bar Chart ── */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Revenue Breakdown</Text>
        <Text style={styles.chartSub}>Total Week: 10,200 ETB</Text>

        <View style={styles.barChartRow}>
          {WEEKLY_EARNINGS.map((item) => {
            const heightPct = (item.amount / maxWeekly) * 100;
            return (
              <View key={item.day} style={styles.barCol}>
                <Text style={styles.barVal}>{Math.round(item.amount / 1000)}k</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${heightPct}%` },
                      item.isToday && styles.barFillToday,
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, item.isToday && styles.barLabelToday]}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Uber Trip Request Alert ── */}
      {isOnline && hasRequest && (
        <View style={styles.requestCard}>
          <View style={styles.requestHeader}>
            <Text style={styles.requestBadge}>⚡ TRIP REQUEST</Text>
            <CountdownTimer seconds={15} onExpire={() => setHasRequest(false)} />
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareVal}>210.00 ETB</Text>
            <Text style={styles.fareDist}>4.2 km · 12 min</Text>
          </View>

          <View style={styles.addrBox}>
            <Text style={styles.addrText}>■ <Text style={styles.addrBold}>Pickup:</Text> Bahir Dar Airport</Text>
            <Text style={styles.addrText}>● <Text style={styles.addrBold}>Dropoff:</Text> Grand Resort Hotel</Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={() => setHasRequest(false)}>
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => { alert('Uber Trip Accepted! 🚗'); setHasRequest(false); }}
            >
              <Text style={styles.acceptBtnText}>Accept Uber Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Driver Vehicle & Profile Info ── */}
      <Text style={styles.sectionTitle}>Account Details</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Vehicle</Text>
          <Text style={styles.rowVal}>{driver?.vehicle_type || 'Toyota Corolla'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>License Plate</Text>
          <Text style={styles.rowVal}>{driver?.vehicle_plate || 'BD-1234-AA'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Total Lifetime Trips</Text>
          <Text style={styles.rowVal}>{driver?.total_trips || 847}</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 2,
  },

  loadingBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#A0A0A0',
    fontSize: 13,
  },

  // Status Banner
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#262626',
  },
  statusOnline: {
    backgroundColor: '#05A357',
  },
  statusOffline: {
    backgroundColor: '#181818',
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statusHint: {
    fontSize: 12,
    color: '#E0E0E0',
    marginTop: 4,
  },

  // Earnings
  earningsCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#262626',
  },
  earningsLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  earningsVal: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  metaCol: { alignItems: 'center' },
  metaVal: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  metaLabel: { fontSize: 11, color: '#A0A0A0', marginTop: 2 },
  metaDivider: { width: 1, height: 26, backgroundColor: '#262626' },

  // Weekly Revenue Chart
  chartCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#262626',
  },
  chartTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  chartSub: { fontSize: 12, color: '#05A357', marginTop: 2, fontWeight: '700', marginBottom: 16 },
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
  barVal: { fontSize: 9, color: '#A0A0A0', marginBottom: 4, fontWeight: '700' },
  barTrack: {
    width: 14,
    height: 80,
    backgroundColor: '#262626',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: '#666666',
    borderRadius: 7,
  },
  barFillToday: {
    backgroundColor: '#05A357',
  },
  barLabel: {
    fontSize: 10,
    color: '#A0A0A0',
    marginTop: 6,
    fontWeight: '700',
  },
  barLabelToday: {
    color: '#05A357',
  },

  // Request Card
  requestCard: {
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#05A357',
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestBadge: {
    color: '#05A357',
    fontWeight: '900',
    fontSize: 14,
  },
  timerContainer: {
    backgroundColor: '#262626',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: {
    color: '#FFFFFF',
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
    color: '#FFFFFF',
  },
  fareDist: {
    fontSize: 13,
    color: '#A0A0A0',
    fontWeight: '600',
  },
  addrBox: {
    backgroundColor: '#262626',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  addrText: { color: '#E0E0E0', fontSize: 13 },
  addrBold: { fontWeight: '800', color: '#FFFFFF' },

  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  declineBtnText: { color: '#A0A0A0', fontWeight: '800' },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#05A357',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
  },
  acceptBtnText: { color: '#FFFFFF', fontWeight: '900' },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#262626',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLabel: { fontSize: 14, color: '#A0A0A0' },
  rowVal: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: '#262626' },

  // GPS broadcasting badge
  gpsBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
    borderWidth: 1,
  },
  gpsBadgeActive: {
    backgroundColor: 'rgba(5,163,87,0.15)',
    borderColor: '#05A357',
  },
  gpsBadgeWaiting: {
    backgroundColor: '#181818',
    borderColor: '#333333',
  },
  gpsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A0A0A0',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
});
