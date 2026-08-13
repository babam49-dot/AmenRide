import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LiveEtaBanner({ etaMinutes = 5, distanceKm = 1.8, statusText = 'Driver En Route' }) {
  return (
    <View style={styles.banner}>
      <View style={styles.leftSection}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LIVE GPS</Text>
        </View>
        <Text style={styles.status}>{statusText}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.eta}>{etaMinutes} min</Text>
        <Text style={styles.distance}>{distanceKm} km away</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 10,
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
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  eta: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '700',
  },
  distance: {
    color: '#94A3B8',
    fontSize: 12,
  },
});
