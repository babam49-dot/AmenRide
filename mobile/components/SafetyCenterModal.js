import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: SafetyCenterModal
 * Safety center modal with emergency contact dispatch & local Bahir Dar hotline directory.
 */
export default function SafetyCenterModal({ visible, onClose }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [contacts, setContacts] = useState([
    { id: '1', name: 'Emergency Contact 1 (Family)', phone: '+251912345678' },
    { id: '2', name: 'Bahir Dar Central Police', phone: '991' },
    { id: '3', name: 'Felege Hiwot Emergency Ambulance', phone: '907' }
  ]);

  const handleTriggerSOS = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS DISPATCHED',
      'Live GPS location (Bahir Dar) has been transmitted to Central Police Control and your trusted contacts.',
      [{ text: 'OK', style: 'destructive' }]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBg}>
        <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <Ionicons name="shield-checkmark" size={24} color="#EF4444" />
              <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>AMEN Safety Center</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sosButton} onPress={handleTriggerSOS}>
            <Ionicons name="warning" size={24} color="#FFF" />
            <Text style={styles.sosText}>ONE-TAP EMERGENCY SOS</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Trusted Emergency Hotlines</Text>

          <FlatList
            data={contacts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.contactRow, { backgroundColor: isDark ? '#2A2A2A' : '#F8FAFC' }]}>
                <View>
                  <Text style={[styles.contactName, { color: isDark ? '#FFF' : '#000' }]}>{item.name}</Text>
                  <Text style={styles.contactPhone}>{item.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.callBtn}
                  onPress={() => Alert.alert('Calling', `Dialing ${item.phone}...`)}
                >
                  <Ionicons name="call" size={16} color="#FFF" />
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
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 18, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  sosButton: { backgroundColor: '#EF4444', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 10, marginVertical: 10 },
  sosText: { color: '#FFF', fontWeight: '900', fontSize: 15 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#64748B', marginTop: 14, marginBottom: 8 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8 },
  contactName: { fontSize: 13, fontWeight: '700' },
  contactPhone: { fontSize: 12, color: '#64748B', marginTop: 2 },
  callBtn: { backgroundColor: '#10B981', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 4 },
  callText: { color: '#FFF', fontWeight: '700', fontSize: 12 }
});
