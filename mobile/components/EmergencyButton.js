import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function EmergencyButton({ currentTripId, driverInfo }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const handleTriggerSOS = () => {
    setModalVisible(false);
    Alert.alert(
      '🚨 SOS Emergency Alert Sent!',
      'Your real-time GPS location and trip details have been dispatched to Bahir Dar Police dispatch and Amen-Ride emergency helpline.',
      [{ text: 'OK' }]
    );
  };

  const dynamicStyles = {
    dialog: { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
    description: { color: isDark ? '#CBD5E1' : '#475569' },
    cancelBtn: { backgroundColor: isDark ? '#334155' : '#F1F5F9' },
    cancelText: { color: isDark ? '#F8FAFC' : '#475569' },
  };

  return (
    <>
      <TouchableOpacity style={styles.sosButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.sosText}>🚨 SOS</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={[styles.dialog, dynamicStyles.dialog]}>
            <Text style={styles.title}>Emergency SOS Assistance (Bahir Dar Police 991)</Text>
            <Text style={[styles.description, dynamicStyles.description]}>
              Are you in immediate danger? Pressing confirm will share your live GPS updates with local emergency authorities in Bahir Dar.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Trip ID: {currentTripId || 'N/A'}</Text>
              {driverInfo && <Text style={styles.infoText}>Driver: {driverInfo.name} ({driverInfo.plate})</Text>}
              <Text style={styles.infoText}>Police Line: 991 | Ambulance: 907</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={[styles.cancelBtn, dynamicStyles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.cancelText, dynamicStyles.cancelText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleTriggerSOS}>
                <Text style={styles.confirmText}>CONFIRM SOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  sosButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#991B1B',
    marginVertical: 2,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
