import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Screen: DriverEarningsScreen
 * Shows weekly driver revenue metrics and cashout request modal for Telebirr / CBE Birr.
 */
export default function DriverEarningsScreen() {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('1200');
  const [accountNumber, setAccountNumber] = useState('0911000001');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr');

  const handleRequestPayout = () => {
    Alert.alert(
      'Payout Request Submitted 🎉',
      `Your request for ${payoutAmount} ETB via ${paymentMethod} to ${accountNumber} is being processed.`,
      [{ text: 'OK', onPress: () => setModalVisible(false) }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: '#FF2E2E' }]}>Weekly Earnings</Text>
        <Text style={styles.subtitle}>Bahir Dar Bajaj Fleet Partner 🇪🇹</Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <Text style={styles.cardLabel}>Available Balance</Text>
        <Text style={styles.balanceText}>2,450.00 ETB</Text>
        <TouchableOpacity
          style={styles.cashoutBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Cashout balance to Telebirr or CBE Birr"
        >
          <Ionicons name="wallet-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.cashoutBtnText}>Cashout to Telebirr / CBE</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#111111' }]}>Recent Payouts</Text>
        <View style={styles.payoutItem}>
          <View>
            <Text style={[styles.payoutAmount, { color: isDark ? '#EEE' : '#1E293B' }]}>1,500.00 ETB</Text>
            <Text style={styles.payoutDate}>Yesterday • Telebirr</Text>
          </View>
          <View style={styles.statusCompleted}>
            <Text style={styles.statusCompletedText}>PAID ✓</Text>
          </View>
        </View>

        <View style={styles.payoutItem}>
          <View>
            <Text style={[styles.payoutAmount, { color: isDark ? '#EEE' : '#1E293B' }]}>950.00 ETB</Text>
            <Text style={styles.payoutDate}>3 days ago • CBE Birr</Text>
          </View>
          <View style={styles.statusCompleted}>
            <Text style={styles.statusCompletedText}>PAID ✓</Text>
          </View>
        </View>
      </View>

      {/* Cashout Modal */}
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>Request Earnings Payout</Text>

            <Text style={styles.inputLabel}>Amount (ETB)</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
              keyboardType="numeric"
              value={payoutAmount}
              onChangeText={setPayoutAmount}
              accessibilityLabel="Payout amount in Ethiopian Birr"
            />

            <Text style={styles.inputLabel}>Payment Method</Text>
            <View style={styles.methodRow}>
              {['Telebirr', 'CBE Birr'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodBtn, paymentMethod === m && styles.methodBtnActive]}
                  onPress={() => setPaymentMethod(m)}
                  activeOpacity={0.85}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: paymentMethod === m }}
                  accessibilityLabel={`Payout method ${m}`}
                >
                  <Text style={[styles.methodText, paymentMethod === m && { color: '#FFF', fontWeight: '900' }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Account / Phone Number</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
              value={accountNumber}
              onChangeText={setAccountNumber}
              accessibilityLabel="Account or Phone Number for payout"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel payout modal"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleRequestPayout}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Confirm cashout request"
              >
                <Text style={styles.submitText}>Confirm Cashout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' },
  card: { padding: 20, borderRadius: 22, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F030' },
  cardLabel: { fontSize: 12, color: '#64748B', fontWeight: '800', textTransform: 'uppercase' },
  balanceText: { fontSize: 32, fontWeight: '900', color: '#FF2E2E', marginVertical: 8 },
  cashoutBtn: { backgroundColor: '#FF2E2E', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 16, marginTop: 10 },
  cashoutBtnText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 0.3 },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 14 },
  payoutItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F030' },
  payoutAmount: { fontSize: 15, fontWeight: '800' },
  payoutDate: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '500' },
  statusCompleted: { backgroundColor: '#00D15418', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusCompletedText: { color: '#00D154', fontWeight: '900', fontSize: 11 },
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 22, padding: 22 },
  modalTitle: { fontSize: 18, fontWeight: '900', marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#64748B', fontWeight: '800', marginTop: 12, marginBottom: 6, textTransform: 'uppercase' },
  input: { height: 46, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, fontSize: 14, fontWeight: '600' },
  methodRow: { flexDirection: 'row', marginVertical: 4 },
  methodBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', marginRight: 8 },
  methodBtnActive: { backgroundColor: '#FF2E2E', borderColor: '#FF2E2E' },
  methodText: { fontWeight: '700', fontSize: 13, color: '#64748B' },
  modalActions: { flexDirection: 'row', marginTop: 22 },
  cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', marginRight: 8 },
  cancelText: { color: '#64748B', fontWeight: '800', fontSize: 14 },
  submitBtn: { flex: 1.5, backgroundColor: '#FF2E2E', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginLeft: 8 },
  submitText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 0.3 }
});

