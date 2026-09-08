import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: TripSchedulerModal
 * Modal for scheduling rides in advance in Bahir Dar with date & hour selection.
 */
export default function TripSchedulerModal({ visible, onClose, onScheduleConfirm }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [selectedDay, setSelectedDay] = useState('Today');
  const [selectedTime, setSelectedTime] = useState('08:30 AM');

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const days = ['Today', 'Tomorrow', 'In 2 Days'];
  const times = ['07:00 AM', '08:30 AM', '12:00 PM', '03:30 PM', '06:00 PM', '09:00 PM'];

  const handleSelectDay = (day) => {
    setSelectedDay(day);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleConfirm = () => {
    const timeString = `${selectedDay} at ${selectedTime}`;
    Alert.alert(
      'Ride Scheduled 🎉',
      `Your ride from Bahir Dar has been reserved for ${timeString}. We will assign a driver 15 minutes before pickup!`,
      [{ text: 'Great!', onPress: () => {
        if (onScheduleConfirm) onScheduleConfirm({ day: selectedDay, time: selectedTime });
        onClose();
      }}]
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBg}>
        <Animated.View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.header}>
            <Ionicons name="calendar-outline" size={24} color="#FF2E2E" />
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>Reserve a Ride in Advance</Text>
          </View>

          <Text style={styles.sectionLabel}>Select Day</Text>
          <View style={styles.chipRow}>
            {days.map((day) => {
              const active = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => handleSelectDay(day)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Select date ${day}`}
                >
                  <Text style={[styles.chipText, active && { color: '#FFF', fontWeight: '900' }]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>Select Departure Time</Text>
          <View style={styles.timeGrid}>
            {times.map((t) => {
              const active = selectedTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, active && styles.chipActive]}
                  onPress={() => setSelectedTime(t)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Select departure time ${t}`}
                >
                  <Text style={[styles.timeText, active && { color: '#FFF', fontWeight: '900' }]}>{t}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.summaryBox}>
            <Ionicons name="information-circle-outline" size={20} color="#FF2E2E" style={{ marginRight: 8 }} />
            <Text style={styles.summaryText}>Scheduled for {selectedDay} at {selectedTime}</Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cancel scheduling modal"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleConfirm}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Confirm reservation schedule"
            >
              <Text style={styles.submitText}>Confirm Schedule</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', padding: 20 },
  modalCard: {
    borderRadius: 22,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '900', marginLeft: 10 },
  sectionLabel: { fontSize: 12, color: '#64748B', fontWeight: '800', marginTop: 14, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipRow: { flexDirection: 'row' },
  chip: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', marginRight: 8 },
  chipActive: { backgroundColor: '#FF2E2E', borderColor: '#FF2E2E' },
  chipText: { fontWeight: '700', fontSize: 13, color: '#64748B' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  timeChip: { width: '31%', paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center', marginRight: 6, marginBottom: 8 },
  timeText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  summaryBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF5F5', padding: 14, borderRadius: 14, marginTop: 16, borderWidth: 1, borderColor: '#FF2E2E30' },
  summaryText: { color: '#FF2E2E', fontWeight: '900', fontSize: 13 },
  modalActions: { flexDirection: 'row', marginTop: 22 },
  cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', marginRight: 8 },
  cancelText: { color: '#64748B', fontWeight: '800', fontSize: 14 },
  submitBtn: { flex: 1.5, backgroundColor: '#FF2E2E', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginLeft: 8 },
  submitText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 0.3 }
});

