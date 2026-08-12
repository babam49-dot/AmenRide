import React, { useState, useEffect } from 'react';
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
import { useLanguage } from '../context/LanguageContext';

export default function SettingsScreen() {
  const { lang, toggleLanguage, t } = useLanguage();
  const [darkMode, setDarkMode]   = useState(true);
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
    .slice(0, 2) || 'AB';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Account Profile Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('account')}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#FFFFFF" size="small" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{driver?.name || 'Abebe Bikila'}</Text>
            <Text style={styles.email}>{driver?.email || 'abebe.b@amenride.com'}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {driver?.rating || '4.92'}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Wallet Card */}
      <View style={styles.walletCard}>
        <View>
          <Text style={styles.walletLabel}>{t('uberCash')}</Text>
          <Text style={styles.walletVal}>250.00 ETB</Text>
        </View>
        <TouchableOpacity style={styles.addFundsBtn}>
          <Text style={styles.addFundsText}>{t('addFunds')}</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <Text style={styles.sectionTitle}>{t('appPreferences')}</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
          <Text style={styles.rowText}>{t('language')}</Text>
          <Text style={styles.rowDetail}>{lang === 'en' ? 'English (EN)' : 'አማርኛ (AM)'}</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#333333', true: '#00D154' }}
            thumbColor={darkMode ? '#FFFFFF' : '#7C7C7C'}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Text style={styles.rowText}>Push Notifications</Text>
          <Switch
            value={pushNotif}
            onValueChange={setPushNotif}
            trackColor={{ false: '#333333', true: '#00D154' }}
            thumbColor={pushNotif ? '#FFFFFF' : '#7C7C7C'}
          />
        </View>
      </View>

      {/* Account Links */}
      <Text style={styles.sectionTitle}>{t('accountSafety')}</Text>
      <View style={styles.card}>
        {[
          { label: 'Payment Methods', detail: '💳 Telebirr / Cash' },
          { label: 'Safety Center', detail: '🛡️ Active' },
          { label: 'Terms & Privacy', detail: '›' },
          { label: 'Help & Support', detail: '›' },
        ].map((item, i, arr) => (
          <View key={item.label}>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.rowText}>{item.label}</Text>
              <Text style={styles.rowDetail}>{item.detail}</Text>
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85}>
        <Text style={styles.logoutText}>{t('signOut')}</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>AMEN Ride v1.0.0 · Bahir Dar, Ethiopia 🇪🇹</Text>

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
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: { color: '#A0A0A0', fontSize: 13 },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00D154',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  profileInfo: { flex: 1 },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  email: {
    fontSize: 13,
    color: '#A0A0A0',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#181818',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  walletCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#181818',
    borderRadius: 20,
    padding: 20,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: '#262626',
  },
  walletLabel: {
    fontSize: 12,
    color: '#A0A0A0',
    fontWeight: '700',
  },
  walletVal: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  addFundsBtn: {
    backgroundColor: '#262626',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addFundsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#181818',
    borderRadius: 20,
    paddingHorizontal: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#262626',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rowDetail: {
    fontSize: 14,
    color: '#00D154',
    fontWeight: '700',
  },
  divider: { height: 1, backgroundColor: '#262626' },

  logoutBtn: {
    backgroundColor: '#181818',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#262626',
    marginBottom: 24,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800',
  },
  versionText: {
    textAlign: 'center',
    color: '#7C7C7C',
    fontSize: 11,
  },
});
