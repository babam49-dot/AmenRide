import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: FareEstimateCard
 * Selectable card showing ride option title, price, ETA, and capacity.
 */
export default function FareEstimateCard({ option, selected, onSelect }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const dynamicStyles = {
    card: { backgroundColor: isDark ? '#161616' : '#FFFFFF', borderColor: isDark ? '#262626' : '#E2E8F0' },
    cardSelected: { backgroundColor: isDark ? '#222222' : '#F0FDFA', borderColor: '#0D9488' },
    iconBox: { backgroundColor: isDark ? '#2A2A2A' : '#F1F5F9' },
    textPrimary: { color: isDark ? '#FFFFFF' : '#0F172A' },
    textSecondary: { color: isDark ? '#8E8E93' : '#64748B' },
  };

  return (
    <TouchableOpacity
      style={[styles.card, dynamicStyles.card, selected && dynamicStyles.cardSelected]}
      onPress={() => onSelect(option.id)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, dynamicStyles.iconBox]}>
        <Ionicons
          name={option.icon || 'car-sport-outline'}
          size={28}
          color={selected ? '#0D9488' : (isDark ? '#A0A0A0' : '#64748B')}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, dynamicStyles.textPrimary]}>{option.title}</Text>
          <Text style={styles.capacityBadge}>👥 {option.capacity || 3}</Text>
          {option.surgeMultiplier > 1.0 && (
            <View style={styles.surgeBadge}>
              <Text style={styles.surgeText}>{option.surgeMultiplier}x Surge</Text>
            </View>
          )}
        </View>
        <Text style={[styles.description, dynamicStyles.textSecondary]}>{option.description}</Text>
        <Text style={styles.etaText}>🕒 {option.etaMinutes} mins away</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={[styles.priceText, dynamicStyles.textPrimary]}>{option.estimatedPriceETB} ETB</Text>
        <Text style={[styles.capacityText, dynamicStyles.textSecondary]}>👥 {option.capacity || 3}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  surgeBadge: {
    backgroundColor: '#E65100',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  surgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    marginTop: 2,
  },
  etaText: {
    color: '#00D154',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
  },
  capacityText: {
    fontSize: 11,
    marginTop: 4,
  },
});
