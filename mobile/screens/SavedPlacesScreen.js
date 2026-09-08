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
          <Text style={[styles.title, { color: '#FF2E2E' }]}>Saved Places</Text>
          <Text style={styles.subtitle}>Quick one-tap destinations in Bahir Dar 🇪🇹</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Add new saved location"
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.placeCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}
            onPress={() => onSelectPlace && onSelectPlace(item)}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel={`Saved place ${item.label}: ${item.name}, ${item.address}`}
          >
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#2C2C2E' : '#FFF5F5' }]}>
              <Ionicons name={item.icon} size={22} color="#FF2E2E" />
            </View>
            <View style={styles.placeDetails}>
              <Text style={styles.labelTag}>{item.label}</Text>
              <Text style={[styles.placeName, { color: isDark ? '#FFFFFF' : '#111111' }]}>{item.name}</Text>
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBg}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#111' }]}>Add New Saved Location</Text>

            <Text style={styles.inputLabel}>Label</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. Home, Gym, Hotel"
              accessibilityLabel="Location Label"
            />

            <Text style={styles.inputLabel}>Place Name</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Felege Hiwot Hospital"
              accessibilityLabel="Place Name"
            />

            <Text style={styles.inputLabel}>Address / Area</Text>
            <TextInput
              style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. Kebele 08, Bahir Dar"
              accessibilityLabel="Address or Area"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel saving location"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleAddPlace}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Save location to favorites"
              >
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
  title: { fontSize: 24, fontWeight: '900' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: '500' },
  addBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF2E2E', alignItems: 'center', justifyContent: 'center', shadowColor: '#FF2E2E', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 },
  placeCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 12 },
  iconBox: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  placeDetails: { flex: 1 },
  labelTag: { fontSize: 11, fontWeight: '900', color: '#FF2E2E', textTransform: 'uppercase', letterSpacing: 0.5 },
  placeName: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  addressText: { fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: '500' },
  modalBg: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 22, padding: 22 },
  modalTitle: { fontSize: 18, fontWeight: '900', marginBottom: 16 },
  inputLabel: { fontSize: 12, color: '#64748B', fontWeight: '800', marginTop: 12, marginBottom: 6, textTransform: 'uppercase' },
  input: { height: 46, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, fontSize: 14, fontWeight: '600' },
  modalActions: { flexDirection: 'row', marginTop: 22 },
  cancelBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', marginRight: 8 },
  cancelText: { color: '#64748B', fontWeight: '800', fontSize: 14 },
  submitBtn: { flex: 1.5, backgroundColor: '#FF2E2E', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginLeft: 8 },
  submitText: { color: '#FFF', fontWeight: '900', fontSize: 14, letterSpacing: 0.3 }
});

