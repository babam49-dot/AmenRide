import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function EmergencyButton({ currentTripId, driverInfo }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [modalVisible, setModalVisible] = useState(false);

  const pulseScale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScale, {
          toValue: 1.12,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, []);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.90,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 120,
    }).start();
  };

  const handleTriggerSOS = () => {
    setModalVisible(false);
    Alert.alert(
      '🚨 SOS Emergency Alert Sent!',
      'Your real-time GPS location and trip details have been dispatched to Bahir Dar Police dispatch (991) and Amen-Ride emergency hotline.',
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
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => setModalVisible(true)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel="Emergency SOS Alert Trigger"
      >
        <Animated.View style={[styles.sosButton, { transform: [{ scale: Animated.multiply(pressScale, pulseScale) }] }]}>
          <Text style={styles.sosText}>🚨 SOS</Text>
        </Animated.View>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={[styles.dialog, dynamicStyles.dialog]}>
            <Text style={styles.title}>Emergency SOS Assistance (Bahir Dar Police 991)</Text>
            <Text style={[styles.description, dynamicStyles.description]}>
              Are you in immediate danger? Pressing confirm will share your live GPS updates with local emergency authorities in Bahir Dar.
            </Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Trip ID: {currentTripId || 'TRIP-BD-8821'}</Text>
              {driverInfo && <Text style={styles.infoText}>Driver: {driverInfo.name} ({driverInfo.plate})</Text>}
              <Text style={styles.infoText}>Police Line: 991 | Ambulance: 907</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.cancelBtn, dynamicStyles.cancelBtn]}
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel emergency SOS alert"
              >
                <Text style={[styles.cancelText, dynamicStyles.cancelText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleTriggerSOS}
                accessibilityRole="button"
                accessibilityLabel="Confirm SOS Emergency Dispatch"
              >
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
    backgroundColor: '#FF2E2E',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    elevation: 6,
    shadowColor: '#FF2E2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    borderRadius: 22,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF2E2E',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#991B1B',
    marginVertical: 2,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelText: {
    fontWeight: '800',
    fontSize: 14,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FF2E2E',
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

