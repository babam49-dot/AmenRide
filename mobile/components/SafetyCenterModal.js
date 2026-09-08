import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const SAFETY_TIPS = [
  { id: 't1', title: 'Verify Driver & License Plate', desc: 'Always double-check the plate number BD-3-XXXX before entering any Bajaj or Taxi.' },
  { id: 't2', title: 'Share Trip Status', desc: 'Send your live route link to friends or family so they can follow your trip in real time.' },
  { id: 't3', title: '24/7 Bahir Dar Police Dispatch', desc: 'Call 991 immediately if you feel uncomfortable or off-route.' },
];

export default function SafetyCenterModal({ visible, onClose }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [expandedTip, setExpandedTip] = useState(null);

  const [contacts] = useState([
    { id: '1', name: 'Emergency Contact (Family)', phone: '+251912345678' },
    { id: '2', name: 'Bahir Dar Central Police', phone: '991' },
    { id: '3', name: 'Felege Hiwot Emergency Ambulance', phone: '907' }
  ]);

  const handleTriggerSOS = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS DISPATCHED',
      'Live GPS location (Bahir Dar) has been transmitted to Central Police Control (991) and your trusted emergency contacts.',
      [{ text: 'OK', style: 'destructive' }]
    );
  };

  const toggleTip = (id) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.modalBg}>
        <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Ionicons name="shield-checkmark" size={24} color="#FF2E2E" />
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>AMEN Safety Center</Text>
            </View>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Close Safety Center">
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.sosButton}
            onPress={handleTriggerSOS}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="One-tap Emergency SOS trigger"
          >
            <Ionicons name="warning" size={24} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.sosText}>ONE-TAP EMERGENCY SOS</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Safety Features & Tips</Text>
          {SAFETY_TIPS.map((tip) => (
            <TouchableOpacity
              key={tip.id}
              style={[styles.tipCard, { backgroundColor: isDark ? '#2C2C2E' : '#F8FAFC' }]}
              onPress={() => toggleTip(tip.id)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Safety tip: ${tip.title}`}
            >
              <View style={styles.tipHeader}>
                <Text style={[styles.tipTitle, { color: isDark ? '#FFF' : '#111' }]}>{tip.title}</Text>
                <Ionicons name={expandedTip === tip.id ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
              </View>
              {expandedTip === tip.id && (
                <Text style={styles.tipDesc}>{tip.desc}</Text>
              )}
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionTitle}>Trusted Emergency Hotlines</Text>
          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.contactRow, { backgroundColor: isDark ? '#2C2C2E' : '#F8FAFC' }]}>
                <View>
                  <Text style={[styles.contactName, { color: isDark ? '#FFF' : '#111' }]}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{item.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Alert.alert('Calling Hotline', `Dialing ${item.phone}...`)}
                  activeOpacity={0.85}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${item.name} at ${item.phone}`}
                >
                  <Ionicons name="call" size={15} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.callText}>Call</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '900', marginLeft: 8 },
  sosButton: {
    backgroundColor: '#FF2E2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#FF2E2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  sosText: { color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#64748B', marginTop: 14, marginBottom: 8 },
  tipCard: { borderRadius: 12, padding: 12, marginBottom: 8 },
  tipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tipTitle: { fontSize: 13, fontWeight: '800' },
  tipDesc: { fontSize: 12, color: '#64748B', marginTop: 6, lineHeight: 17, fontWeight: '500' },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 8 },
  contactName: { fontSize: 13, fontWeight: '800' },
  contactPhone: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '600' },
  callBtn: { backgroundColor: '#00D154', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  callText: { color: '#FFF', fontWeight: '900', fontSize: 12 }
});

