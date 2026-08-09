import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
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

// ─── Animated Earnings Counter ───────────────────────────────────────────────
function AnimatedEarnings({ target }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    Animated.timing(anim, { toValue: target, duration: 1600, useNativeDriver: false }).start();
    anim.addListener(({ value }) => setDisplay(Math.round(value)));
    return () => anim.removeAllListeners();
  }, [target]);
  return <Text style={styles.statValue}>{display.toLocaleString()} ETB</Text>;
}

// ─── Countdown Timer ─────────────────────────────────────────────────────────
function CountdownTimer({ seconds, onExpire }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return; }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);
  const pct = remaining / seconds;
  return (
    <View style={styles.timerContainer}>
      <Text style={[styles.timerText, remaining <= 5 && { color: '#EF4444' }]}>
        {remaining}s
      </Text>
      <View style={styles.timerBar}>
        <LinearGradient
          colors={remaining > 8 ? ['#10B981', '#06B6D4'] : ['#F59E0B', '#EF4444']}
          style={[styles.timerFill, { width: `${pct * 100}%` }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </View>
    </View>
  );
}

export default function DriverScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [hasRequest, setHasRequest] = useState(false);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status card background animation
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchDriver(1).then((d) => {
      setDriver(d);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: isOnline ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    if (next) {
      setTimeout(() => setHasRequest(true), 3000);
    } else {
      setHasRequest(false);
    }
  };

  const earnings = driver?.today_earnings || 0;
  const todayTrips = driver?.today_trips || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* ── Header ───────────────────────────────────── */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        style={styles.pageHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        {driver && (
          <View style={styles.headerDriver}>
            <LinearGradient colors={['#FF9500', '#FF6B00']} style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>{driver.name[0]}</Text>
            </LinearGradient>
            <View>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverVehicle}>{driver.vehicle_type} · {driver.vehicle_plate}</Text>
            </View>
          </View>
        )}
      </LinearGradient>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#FF9500" size="large" />
          <Text style={styles.loadingText}>Loading driver data...</Text>
        </View>
      )}

      {/* ── Online/Offline Toggle ─────────────────────── */}
      <TouchableOpacity style={styles.statusCard} onPress={toggleOnline} activeOpacity={0.9}>
        <LinearGradient
          colors={isOnline ? ['#064E3B', '#065F46'] : ['#1E293B', '#0F172A']}
          style={StyleSheet.absoluteFill}
          borderRadius={20}
        />
        <View>
          <Text style={styles.statusLabel}>STATUS</Text>
          <Text style={[styles.statusState, { color: isOnline ? '#10B981' : '#64748B' }]}>
            {isOnline ? '🟢  ONLINE' : '🔴  OFFLINE'}
          </Text>
          <Text style={styles.statusHint}>
            {isOnline ? 'You are receiving ride requests' : 'Tap to go online'}
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#334155', true: '#059669' }}
          thumbColor={isOnline ? '#10B981' : '#94A3B8'}
          ios_backgroundColor="#1E293B"
          onValueChange={toggleOnline}
          value={isOnline}
        />
      </TouchableOpacity>

      {/* ── Today's Earnings ──────────────────────────── */}
      <View style={styles.earningsCard}>
        <LinearGradient
          colors={['#FF9500', '#FF6B00']}
          style={styles.earningsGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.earningsGlow} />
          <Text style={styles.earningsLabel}>Today's Earnings</Text>
          <AnimatedEarnings target={earnings} />
          <View style={styles.earningsRow}>
            <View style={styles.earningsMeta}>
              <Text style={styles.earningsMetaVal}>{todayTrips}</Text>
              <Text style={styles.earningsMetaLabel}>Trips</Text>
            </View>
            <View style={styles.earningsMetaDivider} />
            <View style={styles.earningsMeta}>
              <Text style={styles.earningsMetaVal}>⭐ {driver?.rating || '—'}</Text>
              <Text style={styles.earningsMetaLabel}>Rating</Text>
            </View>
            <View style={styles.earningsMetaDivider} />
            <View style={styles.earningsMeta}>
              <Text style={styles.earningsMetaVal}>{driver?.acceptance_rate || '—'}%</Text>
              <Text style={styles.earningsMetaLabel}>Accept Rate</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* ── Incoming Request ─────────────────────────── */}
      {isOnline && hasRequest && (
        <View style={styles.requestCard}>
          <LinearGradient colors={['#1A1A2E', '#0F3460']} style={StyleSheet.absoluteFill} borderRadius={20} />
          <View style={styles.requestHeader}>
            <Text style={styles.requestLabel}>🚨  NEW RIDE REQUEST</Text>
            <CountdownTimer seconds={15} onExpire={() => setHasRequest(false)} />
          </View>

          <View style={styles.tripMeta}>
            {[
              { label: 'EST. FARE', value: '210 ETB', color: '#FF9500' },
              { label: 'DISTANCE', value: '4.2 km',  color: '#06B6D4' },
              { label: 'DURATION', value: '12 min',  color: '#10B981' },
            ].map((m) => (
              <View key={m.label} style={styles.metaCol}>
                <Text style={styles.metaLabel}>{m.label}</Text>
                <Text style={[styles.metaValue, { color: m.color }]}>{m.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.addressBox}>
            <View style={styles.addrRow}>
              <View style={[styles.addrDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.addrText}><Text style={styles.addrBold}>Pickup:</Text> Bahir Dar Airport</Text>
            </View>
            <View style={styles.addrLine} />
            <View style={styles.addrRow}>
              <View style={[styles.addrDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.addrText}><Text style={styles.addrBold}>Dropoff:</Text> Grand Resort Hotel</Text>
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.declineBtn} onPress={() => setHasRequest(false)}>
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtnWrapper}
              onPress={() => { alert('Ride Accepted! 🚗'); setHasRequest(false); }}
            >
              <LinearGradient colors={['#10B981', '#059669']} style={styles.acceptBtn} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={styles.acceptBtnText}>✓  Accept Ride</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Performance ──────────────────────────────── */}
      <Text style={styles.sectionTitle}>Performance</Text>
      <View style={styles.performanceCard}>
        {[
          { label: 'Acceptance Rate', value: `${driver?.acceptance_rate || 96}%`,  color: '#10B981' },
          { label: 'Rating',          value: `⭐ ${driver?.rating || 4.9}`,         color: '#FF9500' },
          { label: 'Total Trips',     value: `${driver?.total_trips || 0}`,         color: '#06B6D4' },
          { label: 'Cancellation',    value: `${driver?.cancellation_rate || 2}%`,  color: '#EF4444' },
        ].map((p, i, arr) => (
          <View key={p.label}>
            <View style={styles.perfRow}>
              <Text style={styles.perfText}>{p.label}</Text>
              <Text style={[styles.perfValue, { color: p.color }]}>{p.value}</Text>
            </View>
            {i < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* ── Safety Notice ────────────────────────────── */}
      <LinearGradient colors={['#064E3B', '#065F46']} style={styles.safetyCard} start={{x:0,y:0}} end={{x:1,y:0}}>
        <Text style={styles.safetyTitle}>🛡️  Drive Safely</Text>
        <Text style={styles.safetyDesc}>
          Always wear a seatbelt, observe speed limits, and take breaks between long sessions.
        </Text>
      </LinearGradient>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0F',
  },
  contentContainer: {
    paddingBottom: 40,
  },

  // Header
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 54,
    paddingBottom: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 16,
  },
  headerDriver: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  driverAvatar: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
  },
  driverAvatarText: {
    color: '#FFF', fontSize: 20, fontWeight: '800',
  },
  driverName: {
    fontSize: 16, fontWeight: '700', color: '#FFF',
  },
  driverVehicle: {
    fontSize: 11, color: '#94A3B8', marginTop: 2,
  },

  loadingBox: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 32, gap: 12,
  },
  loadingText: {
    color: '#64748B', fontSize: 14,
  },

  // Status Card
  statusCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 18,
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#1E293B',
    overflow: 'hidden',
  },
  statusLabel: {
    fontSize: 10, fontWeight: '700', color: '#475569', letterSpacing: 1.5,
  },
  statusState: {
    fontSize: 20, fontWeight: '800', marginTop: 4,
  },
  statusHint: {
    fontSize: 11, color: '#475569', marginTop: 4,
  },

  // Earnings
  earningsCard: {
    marginHorizontal: 20, marginBottom: 20, borderRadius: 20, overflow: 'hidden',
  },
  earningsGradient: {
    padding: 22, borderRadius: 20, overflow: 'hidden',
  },
  earningsGlow: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#FFF', opacity: 0.08,
  },
  earningsLabel: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '700', letterSpacing: 1,
  },
  statValue: {
    fontSize: 32, fontWeight: '900', color: '#FFF', marginTop: 6, marginBottom: 18,
  },
  earningsRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  earningsMeta: { alignItems: 'center' },
  earningsMetaVal: {
    fontSize: 16, fontWeight: '800', color: '#FFF',
  },
  earningsMetaLabel: {
    fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2,
  },
  earningsMetaDivider: {
    width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)',
  },

  // Request Card
  requestCard: {
    marginHorizontal: 20, marginBottom: 20,
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255,149,0,0.3)',
    overflow: 'hidden',
  },
  requestHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  requestLabel: {
    color: '#FF9500', fontWeight: '800', fontSize: 15,
  },
  timerContainer: {
    alignItems: 'center', gap: 4,
  },
  timerText: {
    color: '#FFF', fontWeight: '800', fontSize: 16,
  },
  timerBar: {
    width: 60, height: 4, backgroundColor: '#334155', borderRadius: 2, overflow: 'hidden',
  },
  timerFill: {
    height: '100%', borderRadius: 2,
  },
  tripMeta: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 14, borderRadius: 12, marginBottom: 16,
  },
  metaCol: { alignItems: 'center' },
  metaLabel: {
    color: '#64748B', fontSize: 9, fontWeight: '700', letterSpacing: 1,
  },
  metaValue: {
    fontSize: 15, fontWeight: '800', marginTop: 4,
  },
  addressBox: {
    marginBottom: 16, gap: 6,
  },
  addrRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  addrDot: {
    width: 10, height: 10, borderRadius: 5,
  },
  addrLine: {
    width: 1, height: 14, backgroundColor: '#334155', marginLeft: 5,
  },
  addrText: {
    color: '#CBD5E1', fontSize: 13,
  },
  addrBold: {
    fontWeight: '700', color: '#FFF',
  },
  btnRow: {
    flexDirection: 'row', justifyContent: 'space-between', gap: 12,
  },
  declineBtn: {
    flex: 1, backgroundColor: '#1E293B',
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: '#334155',
  },
  declineBtnText: {
    color: '#94A3B8', fontWeight: '700',
  },
  acceptBtnWrapper: { flex: 1 },
  acceptBtn: {
    borderRadius: 12, paddingVertical: 14, alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFF', fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 18, fontWeight: '800', color: '#FFF',
    marginHorizontal: 20, marginBottom: 12,
  },
  performanceCard: {
    backgroundColor: '#111827',
    borderRadius: 18, marginHorizontal: 20, marginBottom: 20,
    paddingHorizontal: 18, paddingVertical: 8,
    borderWidth: 1, borderColor: '#1F2937',
  },
  perfRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14,
  },
  perfText: {
    fontSize: 14, color: '#94A3B8', fontWeight: '500',
  },
  perfValue: {
    fontSize: 15, fontWeight: '800',
  },
  divider: {
    height: 1, backgroundColor: '#1F2937',
  },
  safetyCard: {
    marginHorizontal: 20, borderRadius: 16, padding: 18,
  },
  safetyTitle: {
    fontSize: 14, fontWeight: '800', color: '#10B981', marginBottom: 6,
  },
  safetyDesc: {
    fontSize: 12, color: '#6EE7B7', lineHeight: 18,
  },
});
