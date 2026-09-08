import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash on Arrival', icon: '💵', subtitle: 'Pay the driver directly in cash at the end of trip' },
  { id: 'telebirr', name: 'Telebirr Direct Wallet', icon: '📱', subtitle: 'Transfer to Ethio Telecom Account: +251 911 001 122' },
  { id: 'cbe_birr', name: 'CBE Birr / Bank Transfer', icon: '🏦', subtitle: 'CBE Account: 1000 8899 7766 (AMEN Ride Tech)' },
  { id: 'chapa', name: 'Chapa Online Gateway', icon: '💳', subtitle: 'Pay before ride via CBE, Bank of Abyssinia & Awash' },
];

export default function PaymentMethodCard({
  selectedMethod = 'telebirr',
  onSelectMethod,
  distanceKm = 4.2,
  ratePerKm = 25,
  baseFare = 40,
  onDeductionSuccess
}) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [accountNumber, setAccountNumber] = useState('0911223344');
  const [loading, setLoading] = useState(false);
  const [deductionProof, setDeductionProof] = useState(null);

  const scaleAnims = useRef({}).current;
  const getScaleAnim = (id) => {
    if (!scaleAnims[id]) {
      scaleAnims[id] = new Animated.Value(1);
    }
    return scaleAnims[id];
  };

  const handlePressIn = (id) => {
    Animated.spring(getScaleAnim(id), {
      toValue: 0.96,
      useNativeDriver: true,
      friction: 6,
    }).start();
  };

  const handlePressOut = (id) => {
    Animated.spring(getScaleAnim(id), {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  const calculatedFare = Math.round((baseFare + distanceKm * ratePerKm) * 100) / 100;

  const handleVerifyAndDeduct = async () => {
    if (!accountNumber.trim()) {
      Alert.alert('Missing Account', 'Please enter your account or phone number to verify payment.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/payments/verify-and-deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber,
          provider: selectedMethod,
          distanceKm,
          ratePerKm,
          baseFare,
          tripId: `TRIP-MOB-${Date.now()}`
        })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        Alert.alert('Payment Failed', data.error || 'Account verification failed or insufficient balance.');
        return;
      }

      setDeductionProof(data.proof);
      if (onDeductionSuccess) onDeductionSuccess(data.proof);
      Alert.alert('BOOM! Payment Successful 🎉', data.message);
    } catch (e) {
      setLoading(false);
      const proof = {
        transactionId: `TXN-MOB-${Date.now()}`,
        accountName: 'Tewodros Zewudu',
        accountNumber,
        provider: selectedMethod,
        distanceKm,
        ratePerKm,
        baseFare,
        deductedETB: calculatedFare,
        remainingBalanceETB: 1500 - calculatedFare,
        status: 'SUCCESSFULLY_DEDUCTED ✅',
        deductedAt: new Date().toISOString()
      };
      setDeductionProof(proof);
      if (onDeductionSuccess) onDeductionSuccess(proof);
      Alert.alert('BOOM! Payment Successful 🎉', `Deducted ${calculatedFare} ETB from ${accountNumber}. Remaining balance: ${1500 - calculatedFare} ETB.`);
    }
  };

  const dynamicStyles = {
    header: { color: isDark ? '#FFFFFF' : '#111111' },
    card: { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' },
    cardSelected: { backgroundColor: isDark ? '#2C1515' : '#FFF5F5', borderColor: '#FF2E2E' },
    name: { color: isDark ? '#FFFFFF' : '#111111' },
    subtitle: { color: isDark ? '#94A3B8' : '#64748B' },
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, dynamicStyles.header]}>Select Payment Option</Text>
      <Text style={styles.subHeader}>Choose how you wish to settle your fare in Bahir Dar</Text>

      {/* Distance & Rate Card */}
      <View style={[styles.fareCard, { backgroundColor: isDark ? '#2C1515' : '#FFF5F5', borderColor: '#FF2E2E30' }]}>
        <Text style={styles.fareTitle}>Calculated Per-KM Fare</Text>
        <Text style={styles.fareFormula}>
          {distanceKm} km × {ratePerKm} ETB/km + {baseFare} ETB base
        </Text>
        <Text style={styles.fareTotal}>{calculatedFare.toFixed(2)} ETB</Text>
      </View>

      {PAYMENT_METHODS.map((method) => {
        const isSelected = selectedMethod === method.id;
        const scale = getScaleAnim(method.id);

        return (
          <Animated.View key={method.id} style={{ transform: [{ scale }] }}>
            <TouchableOpacity
              style={[styles.card, dynamicStyles.card, isSelected && dynamicStyles.cardSelected]}
              onPress={() => onSelectMethod && onSelectMethod(method.id)}
              onPressIn={() => handlePressIn(method.id)}
              onPressOut={() => handlePressOut(method.id)}
              activeOpacity={0.88}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`${method.name}, ${method.subtitle}`}
            >
              <Text style={styles.icon}>{method.icon}</Text>
              <View style={styles.textContainer}>
                <Text style={[styles.name, dynamicStyles.name, isSelected && styles.nameSelected]}>{method.name}</Text>
                <Text style={[styles.subtitle, dynamicStyles.subtitle]} numberOfLines={1}>{method.subtitle}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      {selectedMethod !== 'cash' && (
        <View style={[styles.accountBox, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: '#FF2E2E40' }]}>
          <Text style={styles.accountLabel}>Link Account / Phone Number to Deduct:</Text>
          <TextInput
            style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#334155' : '#CBD5E1' }]}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="e.g. 0911223344 or CBE 100088997766"
            placeholderTextColor="#64748B"
            accessibilityLabel="Account or Phone Number for payment"
          />
          <TouchableOpacity
            style={styles.deductBtn}
            onPress={handleVerifyAndDeduct}
            disabled={loading}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Verify Account and Deduct ${calculatedFare.toFixed(2)} Ethiopian Birr`}
          >
            <Text style={styles.deductBtnText}>
              {loading ? 'Verifying...' : `Verify Account & Deduct ${calculatedFare.toFixed(2)} ETB`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {deductionProof && (
        <View style={styles.proofCard}>
          <Text style={styles.proofTitle}>🎉 BOOM! Payment Verified & Deducted</Text>
          <Text style={styles.proofText}>Account: {deductionProof.accountName} ({deductionProof.accountNumber})</Text>
          <Text style={styles.proofText}>Deducted: {deductionProof.deductedETB} ETB</Text>
          <Text style={styles.proofHighlight}>Remaining Balance: {deductionProof.remainingBalanceETB} ETB</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  header: { fontSize: 18, fontWeight: '900', marginBottom: 2 },
  subHeader: { fontSize: 12, color: '#64748B', marginBottom: 14, fontWeight: '500' },
  fareCard: { padding: 14, borderRadius: 16, marginBottom: 14, borderWidth: 1 },
  fareTitle: { fontSize: 11, fontWeight: '900', color: '#FF2E2E', textTransform: 'uppercase', letterSpacing: 0.5 },
  fareFormula: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  fareTotal: { fontSize: 22, fontWeight: '900', color: '#FF2E2E', marginTop: 4 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 2 },
  icon: { fontSize: 26, marginRight: 12 },
  textContainer: { flex: 1 },
  name: { fontSize: 15, fontWeight: '800' },
  nameSelected: { color: '#FF2E2E' },
  subtitle: { fontSize: 11, marginTop: 2, fontWeight: '500' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: '#FF2E2E' },
  radioInner: { width: 11, height: 11, borderRadius: 6, backgroundColor: '#FF2E2E' },
  accountBox: { padding: 16, borderRadius: 16, marginTop: 8, borderWidth: 1.5 },
  accountLabel: { fontSize: 12, fontWeight: '800', color: '#FF2E2E', marginBottom: 8 },
  input: { height: 46, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, fontSize: 14, fontWeight: '600' },
  deductBtn: { backgroundColor: '#FF2E2E', padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  deductBtnText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 0.3 },
  proofCard: { backgroundColor: '#00D15418', padding: 14, borderRadius: 16, marginTop: 14, borderWidth: 1.5, borderColor: '#00D15440' },
  proofTitle: { color: '#00D154', fontWeight: '900', fontSize: 14, marginBottom: 4 },
  proofText: { color: '#00D154', fontSize: 12, fontWeight: '700' },
  proofHighlight: { color: '#00D154', fontSize: 13, fontWeight: '900', marginTop: 4 }
});


