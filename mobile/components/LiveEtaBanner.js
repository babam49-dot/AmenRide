import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function LiveEtaBanner({ etaMinutes = 5, distanceKm = 1.8, statusText = 'Driver En Route' }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const dynamicStyles = {
    banner: { backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? '#1E293B' : '#E2E8F0' },
    status: { color: isDark ? '#F8FAFC' : '#0F172A' },
    distance: { color: isDark ? '#94A3B8' : '#64748B' },
  };

  return (
    <View style={[styles.banner, dynamicStyles.banner]}>
      <View style={styles.leftSection}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LIVE GPS 🇪🇹</Text>
        </View>
        <Text style={[styles.status, dynamicStyles.status]}>{statusText}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.eta}>{etaMinutes} min</Text>
        <Text style={[styles.distance, dynamicStyles.distance]}>{distanceKm} km away</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    elevation: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    backgroundColor: '#14B8A6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#0F172A',
    fontSize: 10,
    fontWeight: '800',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  eta: {
    color: '#0284C7',
    fontSize: 18,
    fontWeight: '700',
  },
  distance: {
    fontSize: 12,
  },
});
