import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr', icon: '📱', subtitle: 'Ethio Telecom Mobile Wallet' },
  { id: 'cbe_birr', name: 'CBE Birr', icon: '🏦', subtitle: 'Commercial Bank of Ethiopia' },
  { id: 'cash', name: 'Cash', icon: '💵', subtitle: 'Pay driver directly on arrival' },
];

export default function PaymentMethodCard({ selectedMethod = 'telebirr', onSelectMethod }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Payment Method</Text>
      {PAYMENT_METHODS.map((method) => {
        const isSelected = selectedMethod === method.id;
        return (
          <TouchableOpacity
            key={method.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onSelectMethod && onSelectMethod(method.id)}
          >
            <Text style={styles.icon}>{method.icon}</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.name, isSelected && styles.nameSelected]}>{method.name}</Text>
              <Text style={styles.subtitle}>{method.subtitle}</Text>
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
    color: '#0F172A',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardSelected: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
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
    color: '#334155',
  },
  nameSelected: {
    color: '#0F766E',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
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
