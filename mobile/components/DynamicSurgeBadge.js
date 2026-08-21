import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Component: DynamicSurgeBadge
 * Live surge multiplier badge indicator for high-demand zones in Bahir Dar.
 */
export default function DynamicSurgeBadge({ surgeMultiplier = 1.2, zoneName = 'Felege Hiwot' }) {
  if (!surgeMultiplier || surgeMultiplier <= 1.0) {
    return (
      <View style={styles.normalBadge}>
        <Ionicons name="sparkles" size={12} color="#10B981" />
        <Text style={styles.normalText}>Normal Pricing</Text>
      </View>
    );
  }

  return (
    <View style={styles.surgeBadge}>
      <Ionicons name="flame" size={14} color="#FFF" />
      <Text style={styles.surgeText}>{surgeMultiplier}x Surge in {zoneName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  normalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B98115',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  normalText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  surgeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  surgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
});
