import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: FareEstimateCard
 * Selectable card showing ride option title, price, ETA, capacity, with spring press animations.
 */
export default function FareEstimateCard({ option, selected, onSelect }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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

  const dynamicStyles = {
    card: { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' },
    cardSelected: { backgroundColor: isDark ? '#2C1515' : '#FFF5F5', borderColor: '#FF2E2E' },
    iconBox: { backgroundColor: selected ? '#FF2E2E' : (isDark ? '#2A2A2A' : '#F1F5F9') },
    textPrimary: { color: isDark ? '#FFFFFF' : '#111111' },
    textSecondary: { color: isDark ? '#94A3B8' : '#64748B' },
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, dynamicStyles.card, selected && dynamicStyles.cardSelected]}
        onPress={() => onSelect(option.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityState={{ selected: !!selected }}
        accessibilityLabel={`${option.title} ride option, estimated fare ${option.estimatedPriceETB} Ethiopian Birr, arrival in ${option.etaMinutes} minutes`}
      >
        <View style={[styles.iconContainer, dynamicStyles.iconBox]}>
          <Ionicons
            name={option.icon || 'car-sport-outline'}
            size={24}
            color={selected ? '#FFFFFF' : (isDark ? '#A0A0A0' : '#475569')}
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, dynamicStyles.textPrimary]}>{option.title}</Text>
            {option.surgeMultiplier > 1.0 && (
              <View style={styles.surgeBadge}>
                <Text style={styles.surgeText}>{option.surgeMultiplier}x Surge</Text>
              </View>
            )}
          </View>
          <Text style={[styles.description, dynamicStyles.textSecondary]} numberOfLines={1}>{option.description}</Text>
          <Text style={styles.etaText}>🕒 {option.etaMinutes} min away</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={[styles.priceText, selected ? styles.priceSelected : dynamicStyles.textPrimary]}>
            {option.estimatedPriceETB} ETB
          </Text>
          <Text style={[styles.capacityText, dynamicStyles.textSecondary]}>👥 {option.capacity || 3} seats</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  detailsContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '900',
  },
  surgeBadge: {
    backgroundColor: '#FF2E2E',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  surgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  etaText: {
    color: '#00D154',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '800',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  priceText: {
    fontSize: 17,
    fontWeight: '900',
  },
  priceSelected: {
    color: '#FF2E2E',
  },
  capacityText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
});

