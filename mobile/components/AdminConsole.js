import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const DEMO_FLEET_DRIVERS = [
  { id: 1, name: 'Amanuel Bekele', vehicle: 'Toyota Corolla (BD-1234-AA)', rating: 4.92, trips: 847, status: 'online' },
  { id: 2, name: 'Tewodros Kassaye', vehicle: 'Hyundai Elantra (BD-5678-BB)', rating: 4.88, trips: 620, status: 'busy' },
  { id: 3, name: 'Meron Tadesse', vehicle: 'TukTuk / Boda (BD-9101-CC)', rating: 4.95, trips: 1140, status: 'online' },
  { id: 4, name: 'Yonas Gebre', vehicle: 'Toyota Vitz (BD-3412-DD)', rating: 4.79, trips: 310, status: 'offline' },
];

export default function AdminConsole() {
  const { t } = useLanguage();
  const [drivers, setDrivers] = useState(DEMO_FLEET_DRIVERS);

  const toggleDriverStatus = (id) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: d.status === 'online' ? 'offline' : 'online' }
          : d
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>🛡️ {t('adminConsole')}</Text>
      <Text style={styles.headerSub}>Bahir Dar City Dispatch Control Center</Text>

      {/* Stats Summary */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>{t('totalRevenue')}</Text>
          <Text style={styles.statVal}>48,250 ETB</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>{t('activeFleet')}</Text>
          <Text style={styles.statVal}>142 Cars</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>{t('dailyTrips')}</Text>
          <Text style={styles.statVal}>1,280</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>{t('systemUptime')}</Text>
          <Text style={[styles.statVal, { color: '#05A357' }]}>99.9%</Text>
        </View>
      </View>

      {/* Fleet Management */}
      <Text style={styles.sectionTitle}>Fleet Drivers Management</Text>

      <ScrollView style={styles.driverList} showsVerticalScrollIndicator={false}>
        {drivers.map((d) => (
          <View key={d.id} style={styles.driverRow}>
            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>{d.name}</Text>
                <View style={[styles.statusDot, { backgroundColor: d.status === 'online' ? '#05A357' : d.status === 'busy' ? '#FF9500' : '#7C7C7C' }]} />
                <Text style={styles.statusText}>{d.status.toUpperCase()}</Text>
              </View>
              <Text style={styles.vehicleText}>{d.vehicle}</Text>
              <Text style={styles.metaText}>⭐ {d.rating} · {d.trips} Trips</Text>
            </View>

            <Switch
              trackColor={{ false: '#333333', true: '#05A357' }}
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
    backgroundColor: '#181818',
    borderRadius: 24,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#262626',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#A0A0A0',
    marginTop: 2,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#262626',
    borderRadius: 16,
    padding: 14,
  },
  statLabel: {
    fontSize: 10,
    color: '#A0A0A0',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  driverList: {
    maxHeight: 240,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#262626',
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
    color: '#FFFFFF',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#A0A0A0',
  },
  vehicleText: {
    fontSize: 11,
    color: '#A0A0A0',
    marginTop: 2,
  },
  metaText: {
    fontSize: 10,
    color: '#7C7C7C',
    marginTop: 2,
  },
});
