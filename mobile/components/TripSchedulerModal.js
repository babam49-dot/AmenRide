import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Alert } from 'react-native';
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

  const days = ['Today', 'Tomorrow', 'In 2 Days'];
  const times = ['07:00 AM', '08:30 AM', '12:00 PM', '03:30 PM', '06:00 PM', '09:00 PM'];

  const handleConfirm = () => {
    const timeString = `${selectedDay} at ${selectedTime}`;
    Alert.alert(
      'Ride Scheduled',
      `Your ride from Bahir Dar has been scheduled for ${timeString}. We will assign a driver 15 minutes before pickup!`,
      [{ text: 'Great!', onPress: () => {
        if (onScheduleConfirm) onScheduleConfirm({ day: selectedDay, time: selectedTime });
        onClose();
      }}]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.header}>
            <Ionicons name="calendar-outline" size={24} color="#0D9488" />
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>Reserve a Ride in Advance</Text>
          </View>

          <Text style={styles.sectionLabel}>Select Day</Text>
          <View style={styles.chipRow}>
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                style={[styles.chip, selectedDay === day && styles.chipActive]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.chipText, selectedDay === day && { color: '#FFF' }]}>{day}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Select Departure Time</Text>
          <View style={styles.timeGrid}>
            {times.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.timeChip, selectedTime === t && styles.chipActive]}
                onPress={() => setSelectedTime(t)}
              >
                <Text style={[styles.timeText, selectedTime === t && { color: '#FFF' }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.summaryBox}>
            <Ionicons name="information-circle-outline" size={18} color="#0D9488" />
            <Text style={styles.summaryText}>Scheduled for {selectedDay} at {selectedTime}</Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleConfirm}>
              <Text style={styles.submitText}>Confirm Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 18, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  sectionLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginTop: 12, marginBottom: 6 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#64748B', alignItems: 'center' },
  chipActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  chipText: { fontWeight: '700', fontSize: 13, color: '#64748B' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: { width: '31%', paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#64748B', alignItems: 'center' },
  timeText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  summaryBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0D948815', padding: 12, borderRadius: 10, marginTop: 16, gap: 8 },
  summaryText: { color: '#0D9488', fontWeight: '700', fontSize: 13 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 12, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: '700' },
  submitBtn: { flex: 1.5, backgroundColor: '#0D9488', padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '800' }
});
