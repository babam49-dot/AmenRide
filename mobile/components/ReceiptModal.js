import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function ReceiptModal({ visible, onClose, tripData }) {
  const { t } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  if (!tripData) return null;

  const fare = tripData.fare || tripData.estimated_fare || 210;
  const baseFare = 50;
  const distanceFare = Math.round(fare * 0.7);
  const serviceFee = Math.max(10, Math.round(fare * 0.1));
  const total = baseFare + distanceFare + serviceFee;

  const dynamicStyles = {
    receiptBox: { backgroundColor: isDark ? '#181818' : '#FFFFFF', borderColor: isDark ? '#333333' : '#E2E8F0' },
    cardBg: { backgroundColor: isDark ? '#262626' : '#F8FAFC' },
    textPrimary: { color: isDark ? '#FFFFFF' : '#0F172A' },
    textSecondary: { color: isDark ? '#A0A0A0' : '#64748B' },
    divider: { backgroundColor: isDark ? '#333333' : '#E2E8F0' },
    borderBottom: { borderBottomColor: isDark ? '#262626' : '#E2E8F0' },
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.receiptBox, dynamicStyles.receiptBox]}>
          {/* Header */}
          <View style={[styles.header, dynamicStyles.borderBottom]}>
            <Text style={[styles.brandTitle, dynamicStyles.textPrimary]}>Uber <Text style={styles.greenText}>AMEN</Text></Text>

            <Text style={[styles.receiptTitle, dynamicStyles.textPrimary]}>{t('receiptTitle')}</Text>
            <Text style={styles.receiptId}>Receipt ID: AMEN-BD-{tripData.id || Math.floor(1000 + Math.random() * 9000)}</Text>
            <Text style={[styles.dateText, dynamicStyles.textSecondary]}>{new Date().toLocaleDateString()} · Bahir Dar, Ethiopia 🇪🇹 (TIN: 0098776655)</Text>
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
                <Text style={[styles.driverLabel, dynamicStyles.textSecondary]}>{t('driverAssigned')}</Text>
                <Text style={[styles.driverName, dynamicStyles.textPrimary]}>{tripData.driver_name || 'Abebe Bikila'} (⭐ {tripData.driver_rating || '4.9'})</Text>
                <Text style={[styles.vehicleText, dynamicStyles.textSecondary]}>{tripData.vehicle_type || 'Standard Bajaj'} · {tripData.vehicle_plate || 'BD-3-1029'}</Text>
              </View>
            </View>

            {/* Fare Breakdown */}
            <Text style={[styles.sectionHeader, dynamicStyles.textPrimary]}>{t('fareBreakdown')}</Text>
            <View style={[styles.fareTable, dynamicStyles.cardBg]}>
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, dynamicStyles.textSecondary]}>{t('baseFare')}</Text>
                <Text style={[styles.fareVal, dynamicStyles.textPrimary]}>{baseFare}.00 ETB</Text>
              </View>
              <View style={[styles.divider, dynamicStyles.divider]} />
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, dynamicStyles.textSecondary]}>{t('distanceFare')}</Text>
                <Text style={[styles.fareVal, dynamicStyles.textPrimary]}>{distanceFare}.00 ETB</Text>
              </View>
              <View style={[styles.divider, dynamicStyles.divider]} />
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, dynamicStyles.textSecondary]}>{t('serviceFee')}</Text>
                <Text style={[styles.fareVal, dynamicStyles.textPrimary]}>{serviceFee}.00 ETB</Text>
              </View>
              {tripData.discount ? (
                <>
                  <View style={[styles.divider, dynamicStyles.divider]} />
                  <View style={styles.fareRow}>
                    <Text style={[styles.fareLabel, { color: '#10B981', fontWeight: '700' }]}>🎁 Promo Code Discount</Text>
                    <Text style={[styles.fareVal, { color: '#10B981' }]}>-{tripData.discount}.00 ETB</Text>
                  </View>
                </>
              ) : null}
              <View style={styles.dividerBold} />
              <View style={styles.fareRowTotal}>
                <Text style={[styles.totalLabel, dynamicStyles.textPrimary]}>{t('totalPaid')}</Text>
                <Text style={styles.totalVal}>{total - (tripData.discount || 0)}.00 ETB</Text>
              </View>
            </View>


            {/* Payment Method */}
            <View style={[styles.paymentBox, dynamicStyles.cardBg]}>
              <Text style={[styles.paymentLabel, dynamicStyles.textSecondary]}>{t('paymentMethod')}</Text>
              <Text style={[styles.paymentVal, dynamicStyles.textPrimary]}>📱 Telebirr 🇪🇹 / Cash</Text>
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.closeBtnText}>{t('closeReceipt')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
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
  },
  greenText: {
    color: '#05A357',
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
  },
  receiptId: {
    fontSize: 12,
    color: '#05A357',
    fontWeight: '700',
    marginTop: 2,
  },
  dateText: {
    fontSize: 11,
    marginTop: 2,
  },
  content: {
    marginBottom: 16,
  },
  routeBox: {
    borderRadius: 16,
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
    backgroundColor: '#05A357',
    marginRight: 12,
  },
  dropoffCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    marginRight: 12,
  },
  routeLine: {
    width: 1,
    height: 14,
    marginLeft: 4.5,
    marginVertical: 2,
  },
  routeTextCol: { flex: 1 },
  routeLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  routeVal: { fontSize: 13, fontWeight: '700', marginTop: 1 },
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 18,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#05A357',
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
  driverLabel: { fontSize: 10, fontWeight: '700' },
  driverName: { fontSize: 14, fontWeight: '800', marginTop: 1 },
  vehicleText: { fontSize: 11, marginTop: 2 },
  sectionHeader: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  fareTable: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 16,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  fareLabel: { fontSize: 13 },
  fareVal: { fontSize: 13, fontWeight: '700' },
  divider: { height: 1 },
  dividerBold: { height: 2, backgroundColor: '#05A357', marginVertical: 4 },
  fareRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: { fontSize: 15, fontWeight: '800' },
  totalVal: { fontSize: 18, fontWeight: '900', color: '#05A357' },
  paymentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 14,
  },
  paymentLabel: { fontSize: 12, fontWeight: '700' },
  paymentVal: { fontSize: 13, fontWeight: '800' },
  closeBtn: {
    backgroundColor: '#05A357',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
