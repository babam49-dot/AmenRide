import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Component: FareEstimateCard
 * Selectable card showing ride option title, price, ETA, and capacity.
 */
export default function FareEstimateCard({ option, selected, onSelect }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={() => onSelect(option.id)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={option.icon || 'car-sport-outline'}
          size={28}
          color={selected ? '#FFFFFF' : '#A0A0A0'}
        />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{option.title}</Text>
          {option.surgeMultiplier > 1.0 && (
            <View style={styles.surgeBadge}>
              <Text style={styles.surgeText}>{option.surgeMultiplier}x Surge</Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>{option.description}</Text>
        <Text style={styles.etaText}>🕒 {option.etaMinutes} mins away</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{option.estimatedPriceETB} ETB</Text>
        <Text style={styles.capacityText}>👥 {option.capacity || 3}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#262626',
  },
  cardSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#222222',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2A2A2A',
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
    color: '#FFFFFF',
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
    color: '#8E8E93',
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  capacityText: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 4,
  },
});
