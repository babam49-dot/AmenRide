import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const { lang, toggleLanguage } = useLanguage();
  const { mode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250' }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.userName}>TEWANAY ZEWUDU GETNET</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        </View>

        <Text style={styles.userPhone}>+251924765475</Text>
      </View>

      {/* 4 Circular Action Buttons */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Orders', 'Viewing trip history...')}>
          <View style={styles.actionCircle}>
            <Text style={styles.actionEmoji}>🕒</Text>
          </View>
          <Text style={styles.actionLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Support', '24/7 Support center...')}>
          <View style={styles.actionCircle}>
            <Text style={styles.actionEmoji}>🎧</Text>
          </View>
          <Text style={styles.actionLabel}>Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('SavedPlacesScreen')}>
          <View style={styles.actionCircle}>
            <Text style={styles.actionEmoji}>📍</Text>
          </View>
          <Text style={styles.actionLabel}>Addresses</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => toggleLanguage()}>
          <View style={styles.actionCircle}>
            <Text style={styles.actionEmoji}>⚙️</Text>
          </View>
          <Text style={styles.actionLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Card 1: Enable notifications */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => setNotificationsEnabled(!notificationsEnabled)}
      >
        <View style={styles.rowItem}>
          <Text style={styles.rowEmoji}>🔔</Text>
          <Text style={styles.rowTitle}>Enable notifications</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Card 2: Discounts & Payment Methods */}
      <View style={styles.cardGroup}>
        <TouchableOpacity style={styles.rowItemBtn} onPress={() => Alert.alert('Discounts', 'Enter your promo code...')}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowEmoji}>🎁</Text>
            <View>
              <Text style={styles.rowTitle}>Discounts</Text>
              <Text style={styles.rowSub}>Enter promo code</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.rowItemBtn} onPress={() => Alert.alert('Payment Methods', 'Default: Cash')}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowEmoji}>💳</Text>
            <View>
              <Text style={styles.rowTitle}>Payment methods</Text>
              <Text style={styles.rowSub}>Cash</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 20 }}>💵</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Card 3: Earn as a Driver (Dark Callout Box #1C1C1E) */}
      <TouchableOpacity
        style={styles.driverBanner}
        onPress={() => navigation.navigate('DriverScreen')}
      >
        <View style={styles.rowLeft}>
          <View style={styles.starBadge}>
            <Text style={{ color: '#000', fontWeight: '900', fontSize: 16 }}>★</Text>
          </View>
          <Text style={styles.driverBannerText}>Earn as a driver</Text>
        </View>
        <Text style={[styles.chevron, { color: '#FF2E2E' }]}>›</Text>
      </TouchableOpacity>

      {/* Card 4: Maps, Safety & Score */}
      <View style={styles.cardGroup}>
        <TouchableOpacity style={styles.rowItemBtn} onPress={() => Alert.alert('Improve Maps', 'Add places, fix errors...')}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowEmoji}>🔖</Text>
            <View>
              <Text style={styles.rowTitle}>Improve maps</Text>
              <Text style={styles.rowSub}>Add places, fix errors</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.rowItemBtn} onPress={() => Alert.alert('Safety Center', 'SOS and emergency features...')}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowEmoji}>🛡️</Text>
            <Text style={styles.rowTitle}>Safety</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.rowItemBtn} onPress={() => Alert.alert('Cancellation Score', 'Search speed is optimal!')}>
          <View style={styles.rowLeft}>
            <Text style={[styles.rowEmoji, { color: '#10B981' }]}>⭕</Text>
            <View>
              <Text style={styles.rowTitle}>Great! Few canceled rides</Text>
              <Text style={styles.rowSub}>This affects ride search speed</Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Card 5: Information */}
      <TouchableOpacity style={[styles.card, { marginBottom: 40 }]} onPress={() => Alert.alert('Information', 'AMEN Ride App v2.4.0 (Bahir Dar)')}>
        <View style={styles.rowItem}>
          <Text style={styles.rowEmoji}>ℹ️</Text>
          <Text style={styles.rowTitle}>Information</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingTop: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.3,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 11,
  },
  userPhone: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    justify.content: 'space-around',
    marginBottom: 18,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EFEFF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionEmoji: {
    fontSize: 22,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111111',
  },
  card: {
    backgroundColor: '#EFEFF1',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardGroup: {
    backgroundColor: '#EFEFF1',
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowEmoji: {
    fontSize: 22,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
  },
  rowSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  driverBanner: {
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  starBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FBBF24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverBannerText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  chevron: {
    fontSize: 22,
    color: '#94A3B8',
    fontWeight: '400',
  },
});
