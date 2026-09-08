import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Component: DynamicSurgeBadge
 * Live surge multiplier badge indicator with pulsing glow animation and accessible press physics.
 */
export default function DynamicSurgeBadge({ surgeMultiplier = 1.2, zoneName = 'Felege Hiwot', onPress }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (surgeMultiplier > 1.0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [surgeMultiplier]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  const getSurgeColor = (multiplier) => {
    if (multiplier >= 2.0) return '#FF2E2E'; // High Yango Red
    if (multiplier >= 1.4) return '#FF6B00'; // Flame Orange
    return '#EAB308'; // Gold Amber
  };

  if (!surgeMultiplier || surgeMultiplier <= 1.0) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel="Standard Pricing Active in Bahir Dar"
      >
        <Animated.View style={[styles.normalBadge, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="sparkles" size={13} color="#00D154" />
          <Text style={styles.normalText}>Normal Pricing</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  const badgeColor = getSurgeColor(surgeMultiplier);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${surgeMultiplier} times surge pricing in ${zoneName}`}
    >
      <Animated.View
        style={[
          styles.surgeBadge,
          { backgroundColor: badgeColor, transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }] },
        ]}
      >
        <Ionicons name="flame" size={14} color="#FFF" />
        <Text style={styles.surgeText}>{surgeMultiplier}x Surge in {zoneName}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  normalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00D15418',
    borderColor: '#00D15435',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  normalText: {
    color: '#00D154',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 5,
  },
  surgeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    shadowColor: '#FF2E2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  surgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 5,
    letterSpacing: 0.2,
  },
});

