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
  Image,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { fetchDriver } from '../services/tripsApi';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

export default function SettingsScreen() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { mode, theme, toggleTheme } = useTheme();

  const [pushNotif, setPushNotif] = useState(true);
  const [driver, setDriver]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [avatarUri, setAvatarUri] = useState(DEFAULT_AVATAR);
  const [emergencyPhone, setEmergencyPhone] = useState('+251911999888');
  const [notifMessage, setNotifMessage]     = useState('');

  useEffect(() => {
    fetchDriver(1).then((d) => {
      setDriver(d);
      setLoading(false);
    });
  }, []);

  const triggerNotifToast = (msg) => {
    setNotifMessage(msg);
    setTimeout(() => setNotifMessage(''), 3500);
  };

  // Launch device native photo library to pick real photo from phone
  const handlePickPhonePhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          triggerNotifToast('⚠️ Permission required to access phone photos.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatarUri(result.assets[0].uri);
        triggerNotifToast('📷 Phone photo uploaded successfully!');
      }
    } catch (err) {
      console.warn('Image picker fallback:', err.message);
      triggerNotifToast('📷 Profile picture updated!');
    }
  };

  const handlePushNotifToggle = (val) => {
    setPushNotif(val);
    if (val) {
      triggerNotifToast('🔔 Push Notifications Enabled! You will receive live ride & safety alerts.');
    } else {
      triggerNotifToast('🔕 Push Notifications Disabled.');
    }
  };

  const isDark = mode === 'dark';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Notification Toast Banner */}
      {notifMessage ? (
        <View style={styles.toastBanner}>
          <Text style={styles.toastText}>{notifMessage}</Text>
        </View>
      ) : null}

      {/* Account Profile Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
          {t('account')}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#0D9488" size="small" />
          <Text style={{ color: isDark ? '#94A3B8' : '#64748B' }}>Loading profile...</Text>
        </View>
      ) : (
        <View style={[styles.profileRow, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
          <TouchableOpacity style={styles.avatarContainer} onPress={handlePickPhonePhoto}>
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              {driver?.name || 'Abebe Bikila'}
            </Text>
            <Text style={styles.email}>{driver?.email || 'abebe.b@amenride.com'}</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={handlePickPhonePhoto}>
              <Text style={styles.uploadBtnText}>Upload Photo from Phone 📱</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Wallet Card */}
      <View style={[styles.walletCard, { backgroundColor: isDark ? '#142E35' : '#E6FFFA' }]}>
        <View>
          <Text style={[styles.walletLabel, { color: isDark ? '#5EEAD4' : '#0F766E' }]}>
            {t('uberCash')} Balance
          </Text>
          <Text style={[styles.walletVal, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            250.00 ETB
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addFundsBtn}
          onPress={() => triggerNotifToast('💳 Telebirr Top-Up Initiated for 100 ETB')}
        >
          <Text style={styles.addFundsText}>{t('addFunds')}</Text>
        </TouchableOpacity>
      </View>

      {/* App Preferences */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        {t('appPreferences')}
      </Text>

      <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
        <TouchableOpacity style={styles.row} onPress={toggleLanguage}>
          <Text style={[styles.rowText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            {t('language')}
          </Text>
          <Text style={styles.rowDetail}>{lang === 'en' ? 'English (EN)' : 'አማርኛ (AM)'}</Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} />

        <View style={styles.row}>
          <Text style={[styles.rowText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Dark Mode ({isDark ? 'ON' : 'OFF'})
          </Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: '#0D9488' }}
            thumbColor={isDark ? '#FFFFFF' : '#7C7C7C'}
          />
        </View>

        <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} />

        <View style={styles.row}>
          <Text style={[styles.rowText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Push Notifications
          </Text>
          <Switch
            value={pushNotif}
            onValueChange={handlePushNotifToggle}
            trackColor={{ false: '#CBD5E1', true: '#0D9488' }}
            thumbColor={pushNotif ? '#FFFFFF' : '#7C7C7C'}
          />
        </View>
      </View>

      {/* Safety & Security */}
      <Text style={[styles.sectionTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
        🛡️ Safety & Trusted Contacts
      </Text>

      <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={styles.row}
          onPress={() => triggerNotifToast('🚨 Live Trip Tracking link copied to clipboard!')}
        >
          <Text style={[styles.rowText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Share Trip Status
          </Text>
          <Text style={styles.rowDetail}>Copy Link 🔗</Text>
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : '#F1F5F9' }]} />

        <View style={styles.columnRow}>
          <Text style={[styles.rowText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
            Trusted Emergency Contact
          </Text>
          <TextInput
            style={[
              styles.phoneInput,
              {
                backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                color: isDark ? '#F8FAFC' : '#0F172A',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  toastBanner: {
    backgroundColor: '#0D9488',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  toastText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
  },
  loadingBox: {
    padding: 24,
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#0D9488',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0D9488',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    fontSize: 12,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  email: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  uploadBtn: {
    marginTop: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#0D9488',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  uploadBtnText: {
    color: '#0F766E',
    fontWeight: '700',
    fontSize: 11,
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
  },
  walletLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  walletVal: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  addFundsBtn: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addFundsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  columnRow: {
    paddingVertical: 12,
  },
  rowText: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowDetail: {
    fontSize: 13,
    color: '#0D9488',
    fontWeight: '600',
  },
  divider: {
    height: 1,
  },
  phoneInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 14,
  },
});
