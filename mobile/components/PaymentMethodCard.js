import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr', icon: '📱', subtitle: 'Ethio Telecom Mobile Wallet (Transfer Verified)' },
  { id: 'cbe_birr', name: 'CBE Birr', icon: '🏦', subtitle: 'Commercial Bank of Ethiopia (Transfer Verified)' },
  { id: 'cash', name: 'Cash', icon: '💵', subtitle: 'Pay driver directly in car on arrival' },
];

export default function PaymentMethodCard({ selectedMethod = 'telebirr', onSelectMethod }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const dynamicStyles = {
    header: { color: isDark ? '#F8FAFC' : '#0F172A' },
    card: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' },
    cardSelected: { backgroundColor: isDark ? '#134E4A' : '#F0FDFA', borderColor: '#0D9488' },
    name: { color: isDark ? '#F8FAFC' : '#334155' },
    subtitle: { color: isDark ? '#94A3B8' : '#64748B' },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, dynamicStyles.header]}>Select Payment Method</Text>
      {PAYMENT_METHODS.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.card, dynamicStyles.card, isSelected && dynamicStyles.cardSelected]}
            onPress={() => onSelectMethod && onSelectMethod(method.id)}
          >
            <Text style={styles.icon}>{method.icon}</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.name, dynamicStyles.name, isSelected && styles.nameSelected]}>{method.name}</Text>
              <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{method.subtitle}</Text>
            </View>
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  nameSelected: {
    color: '#0D9488',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#0D9488',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0D9488',
  },
});
