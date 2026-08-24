import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Screen: SavedPlacesScreen
 * Manage favorite saved places (Home, Work, University) in Bahir Dar for instant ordering.
 */
export default function SavedPlacesScreen({ onSelectPlace }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [places, setPlaces] = useState([
    { id: '1', label: 'Home', name: 'Kebele 11 Residence', address: 'Near BDU Poly Campus, Bahir Dar', icon: 'home-outline' },
    { id: '2', label: 'Work', name: 'Commercial Bank Building', address: 'Kebele 03 Main St, Bahir Dar', icon: 'briefcase-outline' },
    { id: '3', label: 'University', name: 'Bahir Dar Institute of Technology (BiT)', address: 'BiT Campus, Bahir Dar', icon: 'school-outline' }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [label, setLabel] = useState('Gym');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleAddPlace = () => {
    if (!name.trim()) return;
    const newPlace = {
      id: String(Date.now()),
      label,
      name,
      address: address || 'Bahir Dar',
      icon: label.toLowerCase().includes('home') ? 'home-outline' : (label.toLowerCase().includes('work') ? 'briefcase-outline' : 'location-outline')
    };
    setPlaces([newPlace, ...places]);
    setName('');
    setAddress('');
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8FAFC' }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Saved Places</Text>
          <Text style={styles.subtitle}>Quick one-tap destinations</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.placeCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#2D2D2D' : '#E2E8F0' }]}
            onPress={() => onSelectPlace && onSelectPlace(item)}
          >
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#2D2D2D' : '#F1F5F9' }]}>
              <Ionicons name={item.icon} size={22} color="#0D9488" />
            </View>
            <View style={styles.placeDetails}>
              <Text style={styles.labelTag}>{item.label}</Text>
              <Text style={[styles.placeName, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>{item.name}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#000' }]}>Add New Saved Location</Text>

            <Text style={styles.inputLabel}>Label</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CCC' }]}
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. Home, Gym, Hotel"
            />

            <Text style={styles.inputLabel}>Place Name</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CCC' }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Felege Hiwot Hospital"
            />

            <Text style={styles.inputLabel}>Address / Area</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CCC' }]}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. Kebele 08, Bahir Dar"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleAddPlace}>
                <Text style={styles.submitText}>Save Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  addBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#0D9488', alignItems: 'center', justifyContent: 'center' },
  placeCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  placeDetails: { flex: 1 },
  labelTag: { fontSize: 11, fontWeight: '800', color: '#0D9488', textTransform: 'uppercase' },
  placeName: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  addressText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 18, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#64748B', fontWeight: '700', marginTop: 10, marginBottom: 4 },
  input: { height: 44, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, fontSize: 14 },
  modalActions: { flexDirection: 'row', marginTop: 20 },
  cancelBtn: { flex: 1, padding: 12, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: '700' },
  submitBtn: { flex: 1.5, backgroundColor: '#0D9488', padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFF', fontWeight: '800' }
});
