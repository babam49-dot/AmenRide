import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Component: DriverStatusBadge
 * Reusable badge showing driver online/offline status with animated dot indicator.
 */
export default function DriverStatusBadge({ isOnline = true, driverName = 'Driver', pulse = true }) {
  return (
    <View style={[styles.container, isOnline ? styles.onlineBg : styles.offlineBg]}>
      <View style={[styles.dot, isOnline ? styles.onlineDot : styles.offlineDot]} />
      <Ionicons
        name={isOnline ? 'radio-button-on' : 'radio-button-off'}
        size={14}
        color={isOnline ? '#00D154' : '#8E8E93'}
      />
      <Text style={[styles.text, isOnline ? styles.onlineText : styles.offlineText]}>
        {isOnline ? 'ONLINE' : 'OFFLINE'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  onlineBg: {
    backgroundColor: '#0E2914',
    borderWidth: 1,
    borderColor: '#00D15433',
  },
  offlineBg: {
    backgroundColor: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#38383A',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  onlineDot: {
    backgroundColor: '#00D154',
  },
  offlineDot: {
    backgroundColor: '#8E8E93',
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  onlineText: {
    color: '#00D154',
  },
  offlineText: {
    color: '#8E8E93',
  },
});
