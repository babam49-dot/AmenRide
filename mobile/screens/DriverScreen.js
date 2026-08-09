import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { fetchDriver } from '../services/tripsApi';

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
  const [isOnline, setIsOnline] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* ── Uber Driver Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Uber Driver</Text>
        <Text style={styles.headerSub}>Bahir Dar Fleet Partner</Text>
      </View>

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
          <Text style={styles.statusLabel}>{isOnline ? "YOU'RE ONLINE" : "YOU'RE OFFLINE"}</Text>
          <Text style={styles.statusHint}>
            {isOnline ? 'Receiving trip requests in Bahir Dar' : 'Tap to start earning'}
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
        <Text style={styles.earningsLabel}>Net Earnings Today</Text>
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
});
