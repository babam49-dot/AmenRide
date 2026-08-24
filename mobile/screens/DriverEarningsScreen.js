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
      'Payout Request Submitted',
      `Your request for ${payoutAmount} ETB via ${paymentMethod} to ${accountNumber} is being processed.`,
      [{ text: 'OK', onPress: () => setModalVisible(false) }]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Weekly Earnings</Text>
        <Text style={styles.subtitle}>Bahir Dar Bajaj Fleet Partner</Text>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={styles.cardLabel}>Available Balance</Text>
        <Text style={styles.balanceText}>2,450.00 ETB</Text>
        <TouchableOpacity
          style={styles.cashoutBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="wallet-outline" size={18} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.cashoutBtnText}>Cashout to Telebirr / CBE</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF' }]}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Recent Payouts</Text>
        <View style={styles.payoutItem}>
          <View>
            <Text style={[styles.payoutAmount, { color: isDark ? '#EEE' : '#1E293B' }]}>1,500.00 ETB</Text>
            <Text style={styles.payoutDate}>Yesterday • Telebirr</Text>
          </View>
          <View style={styles.statusCompleted}>
            <Text style={styles.statusCompletedText}>PAID</Text>
          </View>
        </View>

        <View style={styles.payoutItem}>
          <View>
            <Text style={[styles.payoutAmount, { color: isDark ? '#EEE' : '#1E293B' }]}>950.00 ETB</Text>
            <Text style={styles.payoutDate}>3 days ago • CBE Birr</Text>
          </View>
          <View style={styles.statusCompleted}>
            <Text style={styles.statusCompletedText}>PAID</Text>
          </View>
        </View>
      </View>

      {/* Cashout Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>Request Earnings Payout</Text>

            <Text style={styles.inputLabel}>Amount (ETB)</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CCC' }]}
              keyboardType="numeric"
              value={payoutAmount}
              onChangeText={setPayoutAmount}
            />

            <Text style={styles.inputLabel}>Payment Method</Text>
            <View style={styles.methodRow}>
              {['Telebirr', 'CBE Birr'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.methodBtn, paymentMethod === m && styles.methodBtnActive]}
                  onPress={() => setPaymentMethod(m)}
                >
                  <Text style={[styles.methodText, paymentMethod === m && { color: '#FFF' }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Account / Phone Number</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CCC' }]}
              value={accountNumber}
              onChangeText={setAccountNumber}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleRequestPayout}>
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
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  card: { padding: 18, borderRadius: 16, marginBottom: 16 },
  cardLabel: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  balanceText: { fontSize: 32, fontWeight: '900', color: '#0D9488', marginVertical: 8 },
  cashoutBtn: { backgroundColor: '#0D9488', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginTop: 10 },
  cashoutBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  payoutItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#33333320' },
  payoutAmount: { fontSize: 15, fontWeight: '700' },
  payoutDate: { fontSize: 12, color: '#64748B', marginTop: 2 },
  statusCompleted: { backgroundColor: '#10B98120', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusCompletedText: { color: '#10B981', fontWeight: '800', fontSize: 11 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 18, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginTop: 10, marginBottom: 4 },
  input: { height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, fontSize: 14 },
  methodRow: { flexDirection: 'row', marginVertical: 4 },
  methodBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#64748B', alignItems: 'center', marginRight: 8 },
  methodBtnActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  methodText: { fontWeight: '700', fontSize: 13, color: '#64748B' },
  modalActions: { flexDirection: 'row', marginTop: 20 },
  cancelBtn: { flex: 1, padding: 12, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: '700' },
  submitBtn: { flex: 1.5, backgroundColor: '#0D9488', padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '800' }
});
