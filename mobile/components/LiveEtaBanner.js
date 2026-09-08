import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function LiveEtaBanner({ etaMinutes = 5, distanceKm = 1.8, statusText = 'Driver En Route' }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const progressAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate ETA progress line
    Animated.timing(progressAnim, {
      toValue: 0.75,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    // Pulse live dot
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [etaMinutes]);

  const dynamicStyles = {
    banner: { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' },
    status: { color: isDark ? '#F8FAFC' : '#111111' },
    distance: { color: isDark ? '#94A3B8' : '#64748B' },
  };

  return (
    <View
      style={[styles.banner, dynamicStyles.banner]}
      accessibilityRole="header"
      accessibilityLabel={`Live GPS: Driver status ${statusText}, estimated arrival in ${etaMinutes} minutes, ${distanceKm} km away`}
    >
      <View style={styles.contentRow}>
        <View style={styles.leftSection}>
          <View style={styles.badge}>
            <Animated.View style={[styles.pulseDot, { transform: [{ scale: pulseAnim }] }]} />
            <Text style={styles.badgeText}>LIVE GPS 🇪🇹</Text>
          </View>
          <Text style={[styles.status, dynamicStyles.status]}>{statusText}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.eta}>{etaMinutes} min</Text>
          <Text style={[styles.distance, dynamicStyles.distance]}>{distanceKm} km away</Text>
        </View>
      </View>

      {/* Animated progress bar bar indicator */}
      <View style={styles.progressBarTrack}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D15418',
    borderColor: '#00D15440',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D154',
    marginRight: 6,
  },
  badgeText: {
    color: '#00D154',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  status: {
    fontSize: 14,
    fontWeight: '800',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  eta: {
    color: '#FF2E2E',
    fontSize: 20,
    fontWeight: '900',
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#00D154',
    borderRadius: 2,
  },
});

