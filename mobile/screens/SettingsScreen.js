import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { fetchDriver } from '../services/tripsApi';

const SETTINGS_GROUPS = [
  {
    title: 'App Preferences',
    color: ['#7C3AED', '#A855F7'],
    emoji: '⚙️',
    items: ['toggles'],
  },
  {
    title: 'Account & Legal',
    color: ['#0284C7', '#06B6D4'],
    emoji: '🔐',
    rows: [
      { label: 'Payment Methods', detail: '💳 Visa', color: '#FF9500' },
      { label: 'Terms of Service',  detail: '→', color: '#94A3B8' },
      { label: 'Support & Help',    detail: '→', color: '#94A3B8' },
    ],
  },
];

export default function SettingsScreen() {
  const [darkMode, setDarkMode]   = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [driver, setDriver]       = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetchDriver(1).then((d) => {
      setDriver(d);
      setLoading(false);
    });
  }, []);

  const initials = driver?.name
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'JD';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* ── Header ───────────────────────────────────── */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        style={styles.pageHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>Settings</Text>
      </LinearGradient>

      {/* ── Profile Card ─────────────────────────────── */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#FF9500" size="large" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#FF9500', '#FF6B00', '#A855F7']}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{driver?.name || 'John Doe'}</Text>
            <Text style={styles.profileEmail}>{driver?.email || 'john.doe@amenride.com'}</Text>
            <View style={styles.profileBadge}>
              <LinearGradient colors={['#FF9500', '#FF6B00']} style={styles.badgeGradient} start={{x:0,y:0}} end={{x:1,y:0}}>
                <Text style={styles.badgeText}>⭐ {driver?.rating} · {driver?.vehicle_type}</Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      )}

      {/* ── App Preferences ──────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <LinearGradient colors={['#7C3AED', '#A855F7']} style={styles.sectionIconBg}>
          <Text style={styles.sectionIconText}>⚙️</Text>
        </LinearGradient>
        <Text style={styles.sectionTitle}>App Preferences</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: '#1E293B' }]}>
              <Text>🌙</Text>
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#334155', true: '#A855F7' }}
            thumbColor={darkMode ? '#FFF' : '#94A3B8'}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: '#1E293B' }]}>
              <Text>🔔</Text>
            </View>
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch
            value={pushNotif}
            onValueChange={setPushNotif}
            trackColor={{ false: '#334155', true: '#FF9500' }}
            thumbColor={pushNotif ? '#FFF' : '#94A3B8'}
          />
        </View>
      </View>

      {/* ── Account & Legal ──────────────────────────── */}
      <View style={styles.sectionHeaderRow}>
        <LinearGradient colors={['#0284C7', '#06B6D4']} style={styles.sectionIconBg}>
          <Text style={styles.sectionIconText}>🔐</Text>
        </LinearGradient>
        <Text style={styles.sectionTitle}>Account & Legal</Text>
      </View>
      <View style={styles.card}>
        {[
          { label: 'Payment Methods', detail: '💳 Visa',  color: '#FF9500' },
          { label: 'Terms of Service', detail: '›',       color: '#64748B' },
          { label: 'Support & Help',   detail: '›',       color: '#64748B' },
        ].map((row, i, arr) => (
          <View key={row.label}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#1E293B' }]}>
                  <Text>{i === 0 ? '💳' : i === 1 ? '📋' : '🎧'}</Text>
                </View>
                <Text style={styles.settingText}>{row.label}</Text>
              </View>
              <Text style={[styles.arrowText, { color: row.color }]}>{row.detail}</Text>
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* ── Logout ───────────────────────────────────── */}
      <TouchableOpacity activeOpacity={0.85}>
        <LinearGradient
          colors={['rgba(239,68,68,0.15)', 'rgba(220,38,38,0.1)']}
          style={styles.logoutBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.logoutBtnText}>🚪  Log Out</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.versionText}>AMEN Ride v1.0.0 · Powered by PostgreSQL</Text>

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

  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 54,
    paddingBottom: 24,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28, fontWeight: '900', color: '#FFF',
  },

  loadingBox: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 32, gap: 12,
  },
  loadingText: {
    color: '#64748B', fontSize: 14,
  },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 20, marginHorizontal: 20, padding: 18,
    marginBottom: 24,
    borderWidth: 1, borderColor: '#1F2937',
  },
  avatar: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: {
    color: '#FFF', fontSize: 26, fontWeight: '900',
  },
  profileDetails: {
    marginLeft: 16, flex: 1,
  },
  profileName: {
    fontSize: 18, fontWeight: '800', color: '#FFF',
  },
  profileEmail: {
    fontSize: 13, color: '#64748B', marginTop: 2,
  },
  profileBadge: {
    alignSelf: 'flex-start', marginTop: 8, borderRadius: 20, overflow: 'hidden',
  },
  badgeGradient: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  badgeText: {
    color: '#FFF', fontSize: 11, fontWeight: '700',
  },

  sectionHeaderRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 12, gap: 10,
  },
  sectionIconBg: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  sectionIconText: { fontSize: 16 },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: '#FFF',
  },

  card: {
    backgroundColor: '#111827',
    borderRadius: 18, marginHorizontal: 20,
    marginBottom: 22, paddingHorizontal: 16,
    borderWidth: 1, borderColor: '#1F2937',
  },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  settingIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  settingText: {
    fontSize: 15, color: '#E2E8F0', fontWeight: '500',
  },
  divider: {
    height: 1, backgroundColor: '#1F2937',
  },
  arrowText: {
    fontSize: 16, fontWeight: '700',
  },

  logoutBtn: {
    marginHorizontal: 20, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
    marginBottom: 22,
  },
  logoutBtnText: {
    color: '#EF4444', fontSize: 16, fontWeight: '800',
  },

  versionText: {
    textAlign: 'center', color: '#374151', fontSize: 11, fontWeight: '500',
  },
});
