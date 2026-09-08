import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Component: DriverDocumentUpload
 * Onboarding document manager for driver partners with animated progress bar and Yango Red branding.
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

  const progressAnim = useRef(new Animated.Value(0)).current;

  const countAttached = Object.values(docs).filter(Boolean).length;
  const progressRatio = countAttached / 3;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressRatio,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [countAttached]);

  const toggleDoc = (key) => {
    setDocs({ ...docs, [key]: !docs[key] });
  };

  const handleSubmit = () => {
    if (!licenseNumber || !plateNumber) {
      Alert.alert('Missing Info', 'Please enter your license number and Bajaj plate number.');
      return;
    }
    Alert.alert(
      'Documents Submitted 🎉',
      'Your driver verification files have been sent to Bahir Dar Dispatch Office for manual review.',
      [{ text: 'OK', onPress: () => onUploadComplete && onUploadComplete() }]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF', borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
      <View style={styles.header}>
        <Ionicons name="document-text-outline" size={24} color="#FF2E2E" />
        <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#111111' }]}>Driver Partner Onboarding</Text>
      </View>

      {/* Progress Bar Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextRow}>
          <Text style={styles.progressLabel}>Verification Progress</Text>
          <Text style={styles.progressValue}>{Math.round(progressRatio * 100)}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      <Text style={styles.label}>Driving License Number</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
        placeholder="e.g. AM-DL-998822"
        placeholderTextColor="#64748B"
        value={licenseNumber}
        onChangeText={setLicenseNumber}
        accessibilityLabel="Driving License Number"
      />

      <Text style={styles.label}>Vehicle License Plate (Bahir Dar)</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#FFF' : '#000', borderColor: isDark ? '#333' : '#CBD5E1' }]}
        placeholder="e.g. BD-1234-AA"
        placeholderTextColor="#64748B"
        value={plateNumber}
        onChangeText={setPlateNumber}
        accessibilityLabel="Vehicle License Plate"
      />

      <Text style={styles.label}>Required Identity Verification Files</Text>
      
      {[
        { key: 'license', title: '1. Driver License Photo', desc: 'Front and back clear scan' },
        { key: 'kebeleId', title: '2. Bahir Dar Kebele ID', desc: 'Active resident ID card' },
        { key: 'registration', title: '3. Bajaj Commercial License', desc: 'City transport permit' }
      ].map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.docRow, { backgroundColor: isDark ? '#2C2C2E' : '#F8FAFC' }]}
          onPress={() => toggleDoc(item.key)}
          activeOpacity={0.85}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: docs[item.key] }}
          accessibilityLabel={`Document upload for ${item.title}`}
        >
          <Ionicons
            name={docs[item.key] ? "checkmark-circle" : "cloud-upload-outline"}
            size={22}
            color={docs[item.key] ? "#00D154" : "#FF2E2E"}
          />
          <View style={styles.docTextCol}>
            <Text style={[styles.docTitle, { color: isDark ? '#FFF' : '#111' }]}>{item.title}</Text>
            <Text style={styles.docDesc}>{item.desc}</Text>
          </View>
          <Text style={[styles.statusBadge, { color: docs[item.key] ? '#00D154' : '#FF2E2E' }]}>
            {docs[item.key] ? 'Attached ✓' : 'Upload'}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Submit documents for verification"
      >
        <Text style={styles.submitText}>Submit for Verification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '900', marginLeft: 10 },
  progressContainer: { marginBottom: 16 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 11, fontWeight: '800', color: '#64748B', textTransform: 'uppercase' },
  progressValue: { fontSize: 12, fontWeight: '900', color: '#FF2E2E' },
  progressTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#00D154', borderRadius: 3 },
  label: { fontSize: 12, color: '#64748B', fontWeight: '800', marginTop: 14, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 46, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, fontSize: 14, fontWeight: '600' },
  docRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginTop: 8 },
  docTextCol: { flex: 1, marginLeft: 12 },
  docTitle: { fontSize: 13, fontWeight: '800' },
  docDesc: { fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '500' },
  statusBadge: { fontSize: 12, fontWeight: '900' },
  submitBtn: { backgroundColor: '#FF2E2E', padding: 14, borderRadius: 16, alignItems: 'center', marginTop: 22 },
  submitText: { color: '#FFF', fontWeight: '900', fontSize: 15, letterSpacing: 0.3 }
});

