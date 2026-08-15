import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const DEMO_FLEET_DRIVERS = [
  { id: 1, name: 'Abebe Bikila', vehicle: 'Standard Bajaj (BD-3-1029)', rating: 4.92, trips: 847, status: 'online' },
  { id: 2, name: 'Tewodros Kassahun', vehicle: 'Executive Bajaj (BD-3-4820)', rating: 4.88, trips: 620, status: 'busy' },
  { id: 3, name: 'Mulugeta Tesfaye', vehicle: 'Comfort Car (BD-2-7711)', rating: 4.95, trips: 1140, status: 'online' },
  { id: 4, name: 'Aster Aweke', vehicle: 'Standard Bajaj (BD-3-9934)', rating: 4.79, trips: 310, status: 'offline' },
];

export default function AdminConsole() {
  const { t } = useLanguage();
  const { mode, theme } = useTheme();
  const isDark = mode === 'dark';
  const [drivers, setDrivers] = useState(DEMO_FLEET_DRIVERS);
  const [isSimulating, setIsSimulating] = useState(false);

  const toggleDriverStatus = (id) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === 'online' ? 'offline' : 'online' }
          : d
      )
    );
  };

  const triggerFleetSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 2000);
  };

  const dynamicStyles = {
    container: { backgroundColor: isDark ? '#181818' : '#FFFFFF', borderColor: isDark ? '#262626' : '#E2E8F0' },
    cardBg: { backgroundColor: isDark ? '#262626' : '#F8FAFC' },
    pillBg: { backgroundColor: isDark ? '#262626' : '#F1F5F9', borderColor: isDark ? '#38383A' : '#CBD5E1' },
    textPrimary: { color: isDark ? '#FFFFFF' : '#0F172A' },
    textSecondary: { color: isDark ? '#A0A0A0' : '#64748B' },
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerTitle, dynamicStyles.textPrimary]}>🛡️ {t('adminConsole')}</Text>
          <Text style={[styles.headerSub, dynamicStyles.textSecondary]}>Bahir Dar City Dispatch Control Center</Text>
        </View>

        <TouchableOpacity
          style={[styles.simBtn, dynamicStyles.pillBg, isSimulating && styles.simBtnActive]}
          onPress={triggerFleetSimulation}
        >
          <Text style={[styles.simBtnText, dynamicStyles.textPrimary]}>{isSimulating ? '⚡ Syncing...' : '📡 Sim GPS'}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, dynamicStyles.cardBg]}>
          <Text style={[styles.statLabel, dynamicStyles.textSecondary]}>{t('totalRevenue')}</Text>
          <Text style={[styles.statVal, dynamicStyles.textPrimary]}>48,250 ETB</Text>
        </View>
        <View style={[styles.statCard, dynamicStyles.cardBg]}>
          <Text style={[styles.statLabel, dynamicStyles.textSecondary]}>{t('activeFleet')}</Text>
          <Text style={[styles.statVal, dynamicStyles.textPrimary]}>142 Vehicles</Text>
        </View>
        <View style={[styles.statCard, dynamicStyles.cardBg]}>
          <Text style={[styles.statLabel, dynamicStyles.textSecondary]}>{t('dailyTrips')}</Text>
          <Text style={[styles.statVal, dynamicStyles.textPrimary]}>1,280</Text>
        </View>
        <View style={[styles.statCard, dynamicStyles.cardBg]}>
          <Text style={[styles.statLabel, dynamicStyles.textSecondary]}>{t('systemUptime')}</Text>
          <Text style={[styles.statVal, { color: '#00D154' }]}>99.9%</Text>
        </View>
      </View>

      {/* Fleet Management */}
      <Text style={[styles.sectionTitle, dynamicStyles.textPrimary]}>Fleet Drivers Management</Text>

      <ScrollView style={styles.driverList} showsVerticalScrollIndicator={false}>
        {drivers.map((d) => (
          <View key={d.id} style={[styles.driverRow, dynamicStyles.cardBg]}>
            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.driverName, dynamicStyles.textPrimary]}>{d.name}</Text>
                <View style={[styles.statusDot, { backgroundColor: d.status === 'online' ? '#00D154' : d.status === 'busy' ? '#FF9500' : '#7C7C7C' }]} />
                <Text style={[styles.statusText, dynamicStyles.textSecondary]}>{d.status.toUpperCase()}</Text>
              </View>
              <Text style={[styles.vehicleText, dynamicStyles.textSecondary]}>{d.vehicle}</Text>
              <Text style={[styles.metaText, dynamicStyles.textSecondary]}>⭐ {d.rating} · {d.trips} Trips</Text>
            </View>

            <Switch
              trackColor={{ false: '#CBD5E1', true: '#00D154' }}
              thumbColor="#FFFFFF"
              value={d.status === 'online'}
              onValueChange={() => toggleDriverStatus(d.id)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 16,
  },
  simBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  simBtnActive: {
    backgroundColor: '#00D154',
  },
  simBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  driverList: {
    maxHeight: 240,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  driverInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  vehicleText: {
    fontSize: 12,
    marginTop: 2,
  },
  metaText: {
    fontSize: 10,
    color: '#7C7C7C',
    marginTop: 2,
  },
});
