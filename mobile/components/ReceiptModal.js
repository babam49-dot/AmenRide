import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function ReceiptModal({ visible, onClose, tripData }) {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [copied, setCopied] = useState(false);

  if (!tripData) return null;

  const fare = tripData.fare || tripData.estimated_fare || 210;
  const baseFare = 50;
  const distanceFare = Math.round(fare * 0.7);
  const serviceFee = Math.max(10, Math.round(fare * 0.1));
  const total = baseFare + distanceFare + serviceFee;
  const receiptCode = `AMEN-BD-${tripData.id || Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopyCode = () => {
    setCopied(true);
    Alert.alert('Receipt Code Copied 📋', `Receipt ID: ${receiptCode}`);
    setTimeout(() => setCopied(false), 2500);
  };

  const dynamicStyles = {
    receiptBox: { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' },
    cardBg: { backgroundColor: isDark ? '#2C2C2E' : '#F8FAFC' },
    textPrimary: { color: isDark ? '#FFFFFF' : '#111111' },
    textSecondary: { color: isDark ? '#94A3B8' : '#64748B' },
    divider: { backgroundColor: isDark ? '#3A3A3C' : '#E2E8F0' },
    borderBottom: { borderBottomColor: isDark ? '#2C2C2E' : '#E2E8F0' },
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.receiptBox, dynamicStyles.receiptBox]}>
          {/* Header */}
          <View style={[styles.header, dynamicStyles.borderBottom]}>
            <Text style={[styles.brandTitle, { color: '#FF2E2E' }]}>AMEN <Text style={{ color: '#00D154' }}>RIDE 🇪🇹</Text></Text>

            <Text style={[styles.receiptTitle, dynamicStyles.textPrimary]}>{t('receiptTitle') || 'Official Electronic Receipt'}</Text>
            
            <TouchableOpacity
              style={styles.copyRow}
              onPress={handleCopyCode}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Copy receipt ID ${receiptCode}`}
            >
              <Text style={styles.receiptId}>ID: {receiptCode}</Text>
              <Text style={styles.copyBadge}>{copied ? 'COPIED ✓' : 'COPY 📋'}</Text>
            </TouchableOpacity>

            <Text style={[styles.dateText, dynamicStyles.textSecondary]}>
              {new Date().toLocaleDateString()} · Bahir Dar, Ethiopia (TIN: 0098776655)
            </Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Route Box */}
            <View style={[styles.routeBox, dynamicStyles.cardBg]}>
              <View style={styles.routeRow}>
                <View style={styles.pickupSquare} />
                <View style={styles.routeTextCol}>
                  <Text style={[styles.routeLabel, dynamicStyles.textSecondary]}>PICKUP</Text>
                  <Text style={[styles.routeVal, dynamicStyles.textPrimary]}>{tripData.pickup_address || tripData.pickup_name || 'Felege Hiwot Hospital, Bahir Dar'}</Text>
                </View>
              </View>
              <View style={[styles.routeLine, dynamicStyles.divider]} />
              <View style={styles.routeRow}>
                <View style={styles.dropoffCircle} />
                <View style={styles.routeTextCol}>
                  <Text style={[styles.routeLabel, dynamicStyles.textSecondary]}>DROPOFF</Text>
                  <Text style={[styles.routeVal, dynamicStyles.textPrimary]}>{tripData.dropoff_address || tripData.dropoff_name || 'Grand Resort Hotel, Lake Tana'}</Text>
                </View>
              </View>
            </View>

            {/* Driver & Vehicle */}
            <View style={[styles.driverBox, dynamicStyles.cardBg]}>
              <View style={styles.driverAvatar}>
                <Text style={styles.avatarText}>
                  {(tripData.driver_name || 'Abebe Bikila').split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={[styles.driverLabel, dynamicStyles.textSecondary]}>{t('driverAssigned') || 'Driver Assigned'}</Text>
                <Text style={[styles.driverName, dynamicStyles.textPrimary]}>{tripData.driver_name || 'Abebe Bikila'} (⭐ {tripData.driver_rating || '4.9'})</Text>
                <Text style={[styles.vehicleText, dynamicStyles.textSecondary]}>{tripData.vehicle_type || 'Standard Bajaj'} · {tripData.vehicle_plate || 'BD-3-1029'}</Text>
              </View>
            </View>

            {/* Fare Breakdown */}
            <Text style={[styles.sectionHeader, dynamicStyles.textPrimary]}>{t('fareBreakdown') || 'Fare Breakdown'}</Text>
            <View style={[styles.fareTable, dynamicStyles.cardBg]}>
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, dynamicStyles.textSecondary]}>{t('baseFare') || 'Base Fare'}</Text>
                <Text style={[styles.fareVal, dynamicStyles.textPrimary]}>{baseFare}.00 ETB</Text>
              </View>
              <View style={[styles.divider, dynamicStyles.divider]} />
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, dynamicStyles.textSecondary]}>{t('distanceFare') || 'Distance Fare'}</Text>
                <Text style={[styles.fareVal, dynamicStyles.textPrimary]}>{distanceFare}.00 ETB</Text>
              </View>
              <View style={[styles.divider, dynamicStyles.divider]} />
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, dynamicStyles.textSecondary]}>{t('serviceFee') || 'Service Fee'}</Text>
                <Text style={[styles.fareVal, dynamicStyles.textPrimary]}>{serviceFee}.00 ETB</Text>
              </View>
              {tripData.discount ? (
                <>
                  <View style={[styles.divider, dynamicStyles.divider]} />
                  <View style={styles.fareRow}>
                    <Text style={[styles.fareLabel, { color: '#00D154', fontWeight: '800' }]}>🎁 Promo Discount</Text>
                    <Text style={[styles.fareVal, { color: '#00D154' }]}>-{tripData.discount}.00 ETB</Text>
                  </View>
                </>
              ) : null}
              <View style={styles.dividerBold} />
              <View style={styles.fareRowTotal}>
                <Text style={[styles.totalLabel, dynamicStyles.textPrimary]}>{t('totalPaid') || 'Total Paid'}</Text>
                <Text style={styles.totalVal}>{total - (tripData.discount || 0)}.00 ETB</Text>
              </View>
            </View>

            {/* Payment Method */}
            <View style={[styles.paymentBox, dynamicStyles.cardBg]}>
              <Text style={[styles.paymentLabel, dynamicStyles.textSecondary]}>{t('paymentMethod') || 'Payment Method'}</Text>
              <Text style={[styles.paymentVal, dynamicStyles.textPrimary]}>📱 Telebirr 🇪🇹 / Cash</Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Close receipt modal"
          >
            <Text style={styles.closeBtnText}>{t('closeReceipt') || 'Close Receipt'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  receiptBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  receiptTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: '#00D15415',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  receiptId: {
    fontSize: 12,
    color: '#00D154',
    fontWeight: '900',
    marginRight: 6,
  },
  copyBadge: {
    fontSize: 10,
    color: '#00D154',
    fontWeight: '800',
  },
  dateText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  content: {
    marginBottom: 16,
  },
  routeBox: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#00D154',
    marginRight: 12,
  },
  dropoffCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF2E2E',
    marginRight: 12,
  },
  routeLine: {
    width: 1,
    height: 14,
    marginLeft: 4.5,
    marginVertical: 2,
  },
  routeTextCol: { flex: 1 },
  routeLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  routeVal: { fontSize: 13, fontWeight: '800', marginTop: 1 },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 12,
    marginBottom: 18,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF2E2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  driverInfo: { flex: 1 },
  driverLabel: { fontSize: 10, fontWeight: '800' },
  driverName: { fontSize: 14, fontWeight: '800', marginTop: 1 },
  vehicleText: { fontSize: 11, marginTop: 2, fontWeight: '500' },
  sectionHeader: { fontSize: 14, fontWeight: '900', marginBottom: 10 },
  fareTable: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  fareLabel: { fontSize: 13, fontWeight: '500' },
  fareVal: { fontSize: 13, fontWeight: '800' },
  divider: { height: 1 },
  dividerBold: { height: 2, backgroundColor: '#FF2E2E', marginVertical: 4 },
  fareRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: { fontSize: 15, fontWeight: '900' },
  totalVal: { fontSize: 19, fontWeight: '900', color: '#FF2E2E' },
  paymentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 18,
    padding: 14,
  },
  paymentLabel: { fontSize: 12, fontWeight: '800' },
  paymentVal: { fontSize: 13, fontWeight: '800' },
  closeBtn: {
    backgroundColor: '#FF2E2E',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});

