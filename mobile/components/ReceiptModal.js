import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export default function ReceiptModal({ visible, onClose, tripData }) {
  const { t } = useLanguage();

  if (!tripData) return null;

  const fare = tripData.fare || 210;
  const baseFare = 80;
  const distanceFare = Math.round(fare * 0.55);
  const serviceFee = Math.round(fare * 0.1);
  const total = baseFare + distanceFare + serviceFee;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.receiptBox}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandTitle}>Uber <Text style={styles.greenText}>AMEN</Text></Text>

            <Text style={styles.receiptTitle}>{t('receiptTitle')}</Text>
            <Text style={styles.receiptId}>Receipt ID: AMEN-BD-{Math.floor(1000 + Math.random() * 9000)}</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString()} · Bahir Dar</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Route Box */}
            <View style={styles.routeBox}>
              <View style={styles.routeRow}>
                <View style={styles.pickupSquare} />
                <View style={styles.routeTextCol}>
                  <Text style={styles.routeLabel}>PICKUP</Text>
                  <Text style={styles.routeVal}>{tripData.pickup_name || 'Felege Hiwot, Bahir Dar'}</Text>
                </View>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeRow}>
                <View style={styles.dropoffCircle} />
                <View style={styles.routeTextCol}>
                  <Text style={styles.routeLabel}>DROPOFF</Text>
                  <Text style={styles.routeVal}>{tripData.dropoff_name || 'Grand Resort Hotel, Lake Tana'}</Text>
                </View>
              </View>
            </View>

            {/* Driver & Vehicle */}
            <View style={styles.driverBox}>
              <View style={styles.driverAvatar}>
                <Text style={styles.avatarText}>AB</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverLabel}>{t('driverAssigned')}</Text>
                <Text style={styles.driverName}>Amanuel Bekele (⭐ 4.92)</Text>
                <Text style={styles.vehicleText}>Toyota Corolla · BD-1234-AA</Text>
              </View>
            </View>

            {/* Fare Breakdown */}
            <Text style={styles.sectionHeader}>{t('fareBreakdown')}</Text>
            <View style={styles.fareTable}>
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>{t('baseFare')}</Text>
                <Text style={styles.fareVal}>{baseFare}.00 ETB</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>{t('distanceFare')}</Text>
                <Text style={styles.fareVal}>{distanceFare}.00 ETB</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.fareRow}>
                <Text style={styles.fareLabel}>{t('serviceFee')}</Text>
                <Text style={styles.fareVal}>{serviceFee}.00 ETB</Text>
              </View>
              <View style={styles.dividerBold} />
              <View style={styles.fareRowTotal}>
                <Text style={styles.totalLabel}>{t('totalPaid')}</Text>
                <Text style={styles.totalVal}>{total}.00 ETB</Text>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.paymentBox}>
              <Text style={styles.paymentLabel}>{t('paymentMethod')}</Text>
              <Text style={styles.paymentVal}>📱 Telebirr 🇪🇹 / Cash</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  receiptBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#181818',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#333333',
    maxHeight: '88%',
  },

  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  greenText: {
    color: '#05A357',
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
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
    color: '#A0A0A0',
    marginTop: 2,
  },

  content: {
    marginBottom: 16,
  },

  // Route
  routeBox: {
    backgroundColor: '#262626',
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
    backgroundColor: '#444444',
    marginLeft: 4.5,
    marginVertical: 2,
  },
  routeTextCol: { flex: 1 },
  routeLabel: { fontSize: 9, fontWeight: '800', color: '#A0A0A0', letterSpacing: 1 },
  routeVal: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginTop: 1 },

  // Driver
  driverBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
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
  driverLabel: { fontSize: 10, color: '#A0A0A0', fontWeight: '700' },
  driverName: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', marginTop: 1 },
  vehicleText: { fontSize: 11, color: '#A0A0A0', marginTop: 2 },

  // Fare
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  fareTable: {
    backgroundColor: '#262626',
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
  fareLabel: { fontSize: 13, color: '#A0A0A0' },
  fareVal: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  divider: { height: 1, backgroundColor: '#333333' },
  dividerBold: { height: 2, backgroundColor: '#05A357', marginVertical: 4 },
  fareRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  totalVal: { fontSize: 18, fontWeight: '900', color: '#05A357' },

  paymentBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 14,
    padding: 12,
  },
  paymentLabel: { fontSize: 12, color: '#A0A0A0', fontWeight: '700' },
  paymentVal: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },

  // Close Btn
  closeBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
  },
});
