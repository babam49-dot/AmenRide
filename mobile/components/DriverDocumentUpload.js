import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: DriverDocumentUpload
 * Onboarding document manager for driver partners (Driving License, Kebele ID, Bajaj Registration).
 */
export default function DriverDocumentUpload({ onUploadComplete }) {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [licenseNumber, setLicenseNumber] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [docs, setDocs] = useState({
    license: false,
    kebeleId: false,
    registration: false
  });

  const toggleDoc = (key) => {
    setDocs({ ...docs, [key]: !docs[key] });
  };

  const handleSubmit = () => {
    if (!licenseNumber || !plateNumber) {
      Alert.alert('Missing Info', 'Please enter your license number and Bajaj plate number.');
      return;
    }
    Alert.alert(
      'Documents Submitted',
      'Your driver verification files have been sent to Bahir Dar Dispatch Office for manual review.',
      [{ text: 'OK', onPress: () => onUploadComplete && onUploadComplete() }]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF', borderColor: isDark ? '#2D2D2D' : '#E2E8F0' }]}>
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={24} color="#0D9488" />
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>Driver Partner Onboarding</Text>
      </View>

      <Text style={styles.label}>Driving License Number</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
        placeholder="e.g. AM-DL-998822"
        placeholderTextColor="#64748B"
        value={licenseNumber}
        onChangeText={setLicenseNumber}
      />

      <Text style={styles.label}>Vehicle License Plate (Bahir Dar)</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
        placeholder="e.g. BD-1234-AA"
        placeholderTextColor="#64748B"
        value={plateNumber}
        onChangeText={setPlateNumber}
      />

      <Text style={styles.label}>Required Identity Verification Files</Text>
      
      {[
        { key: 'license', title: '1. Driver License Photo', desc: 'Front and back clear scan' },
        { key: 'kebeleId', title: '2. Bahir Dar Kebele ID', desc: 'Active resident ID card' },
        { key: 'registration', title: '3. Bajaj Commercial License', desc: 'City transport permit' }
      ].map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.docRow, { backgroundColor: isDark ? '#2A2A2A' : '#F8FAFC' }]}
          onPress={() => toggleDoc(item.key)}
        >
          <Ionicons
            name={docs[item.key] ? "checkmark-circle" : "cloud-upload-outline"}
            size={22}
            color={docs[item.key] ? "#10B981" : "#0D9488"}
          />
          <View style={styles.docTextCol}>
            <Text style={[styles.docTitle, { color: isDark ? '#FFF' : '#000' }]}>{item.title}</Text>
            <Text style={styles.docDesc}>{item.desc}</Text>
          </View>
          <Text style={[styles.statusBadge, { color: docs[item.key] ? '#10B981' : '#64748B' }]}>
            {docs[item.key] ? 'Attached' : 'Upload'}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit for Verification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: 16, borderWidth: 1, marginVertical: 10 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  title: { fontSize: 17, fontWeight: '800' },
  label: { fontSize: 12, color: '#64748B', fontWeight: '700', marginTop: 12, marginBottom: 4 },
  input: { height: 42, borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, fontSize: 14 },
  docRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginTop: 8 },
  docTextCol: { flex: 1, marginLeft: 10 },
  docTitle: { fontSize: 13, fontWeight: '700' },
  docDesc: { fontSize: 11, color: '#64748B' },
  statusBadge: { fontSize: 12, fontWeight: '800' },
  submitBtn: { backgroundColor: '#0D9488', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitText: { color: '#FFF', fontWeight: '800', fontSize: 15 }
});
