import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchRideOptions } from '../services/tripsApi';

const { width, height } = Dimensions.get('window');

const BAHIR_DAR_REGION = {
  latitude: 11.5958,
  longitude: 37.3885,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

const PICKUP_COORDS  = { latitude: 11.5980, longitude: 37.3820 };
const DROPOFF_COORDS = { latitude: 11.5936, longitude: 37.3950 };

const ROUTE_LINE = [
  { latitude: 11.5980, longitude: 37.3820 },
  { latitude: 11.5972, longitude: 37.3855 },
  { latitude: 11.5960, longitude: 37.3888 },
  { latitude: 11.5948, longitude: 37.3915 },
  { latitude: 11.5936, longitude: 37.3950 },
];

const MATCHING_STEPS = [
  '🔍  Connecting to Uber AMEN Dispatcher...',
  '📡  Locating nearest driver on Kebele 03 road...',
  '🚗  Matching your ride...',
  '✅  Driver confirmed!',
];

export default function MapScreen() {
  const [selectedRide, setSelectedRide] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchStep, setMatchStep] = useState(0);

  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRideOptions().then((data) => {
      setRideOptions(data);
      setSelectedRide(data[0]?.id?.toString() || '1');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (isRequested) {
      Animated.loop(
        Animated.timing(spinAnim, { toValue: 1, duration: 1200, useNativeDriver: true })
      ).start();
      let step = 0;
      const interval = setInterval(() => {
        step += 1;
        if (step >= MATCHING_STEPS.length) clearInterval(interval);
        else setMatchStep(step);
      }, 1400);
      return () => clearInterval(interval);
    } else {
      spinAnim.setValue(0);
      setMatchStep(0);
    }
  }, [isRequested]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const activeRide = rideOptions.find((r) => r.id?.toString() === selectedRide || r.id === selectedRide);

  return (
    <View style={styles.container}>
      {/* Uber Map View */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={BAHIR_DAR_REGION}
        customMapStyle={uberDarkMapStyle}
      >
        <Polyline coordinates={ROUTE_LINE} strokeColor="#FFFFFF" strokeWidth={5} />

        <Marker coordinate={PICKUP_COORDS} title="Pickup">
          <View style={styles.pickupPin}>
            <Text style={styles.pinText}>■ Felege Hiwot</Text>
          </View>
        </Marker>

        <Marker coordinate={DROPOFF_COORDS} title="Dropoff">
          <View style={styles.dropoffPin}>
            <Text style={styles.pinText}>● Grand Resort Hotel</Text>
          </View>
        </Marker>

        <Marker coordinate={{ latitude: 11.5965, longitude: 37.3865 }} title="Driver">
          <View style={styles.driverBadge}>
            <Text style={{ fontSize: 16 }}>🚗 UberX</Text>
          </View>
        </Marker>
      </MapView>

      {/* Address Bar */}
      <View style={styles.addressBar}>
        <View style={styles.addressRow}>
          <View style={styles.pickupSquare} />
          <Text style={styles.addressText} numberOfLines={1}>Felege Hiwot, Bahir Dar</Text>
        </View>
        <View style={styles.addressDividerLine} />
        <View style={styles.addressRow}>
          <View style={styles.dropoffCircle} />
          <Text style={styles.addressText} numberOfLines={1}>Grand Resort Hotel, Lake Tana</Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {!isRequested ? (
          <>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Choose a ride</Text>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.loadingText}>Loading options...</Text>
              </View>
            ) : (
              <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                {rideOptions.map((ride) => {
                  const isSelected = ride.id?.toString() === selectedRide || ride.id === selectedRide;
                  return (
                    <TouchableOpacity
                      key={ride.id}
                      style={[styles.uberOptionRow, isSelected && styles.uberOptionRowSelected]}
                      onPress={() => setSelectedRide(ride.id?.toString())}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.uberOptionIcon}>{ride.icon}</Text>
                      <View style={styles.uberOptionInfo}>
                        <View style={styles.titleRow}>
                          <Text style={styles.uberOptionName}>{ride.name}</Text>
                          <Text style={styles.uberOptionBadge}>👤 4</Text>
                        </View>
                        <Text style={styles.uberOptionSub}>
                          {ride.eta_minutes} min away · {ride.description || 'Fast, direct ride'}
                        </Text>
                      </View>
                      <Text style={styles.uberOptionPrice}>{ride.base_price} ETB</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.uberConfirmBtn}
              onPress={() => setIsRequested(true)}
              disabled={!activeRide}
              activeOpacity={0.9}
            >
              <Text style={styles.uberConfirmBtnText}>Choose {activeRide?.name || 'UberX'}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.matchmakingContainer}>
            <View style={styles.sheetHandle} />
            <Animated.Text style={[styles.spinEmoji, { transform: [{ rotate: spin }] }]}>🔄</Animated.Text>
            <Text style={styles.matchTitle}>Requesting your ride...</Text>
            <View style={styles.stepsContainer}>
              {MATCHING_STEPS.map((step, i) => (
                <Text key={i} style={[styles.stepText, i < matchStep && styles.stepDone, i === matchStep && styles.stepActive]}>
                  {step}
                </Text>
              ))}
            </View>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsRequested(false)} activeOpacity={0.9}>
              <Text style={styles.cancelBtnText}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const uberDarkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#7c7c7c' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1f1f1f' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#262626' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#090909' }] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  map: { width, height },

  pickupPin: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4,
  },
  dropoffPin: {
    backgroundColor: '#000000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  pinText: { color: '#000000', fontSize: 11, fontWeight: '800' },
  driverBadge: {
    backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12,
  },

  addressBar: {
    position: 'absolute', top: 50, left: 16, right: 16, zIndex: 10,
    backgroundColor: '#181818', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#262626',
  },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  pickupSquare: { width: 8, height: 8, backgroundColor: '#FFFFFF', marginRight: 12 },
  dropoffCircle: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF', marginRight: 12 },
  addressDividerLine: { width: 1, height: 10, backgroundColor: '#333333', marginLeft: 3.5, marginVertical: 2 },
  addressText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', flex: 1 },

  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 10, paddingBottom: 32, paddingHorizontal: 16, borderWidth: 1, borderColor: '#262626',
    maxHeight: height * 0.55,
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#333333', alignSelf: 'center', marginBottom: 14 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 12 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 10 },
  loadingText: { color: '#A0A0A0', fontSize: 13 },
  optionsList: { maxHeight: 220, marginBottom: 16 },
  uberOptionRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 14, marginBottom: 6, borderWidth: 2, borderColor: 'transparent', backgroundColor: '#181818',
  },
  uberOptionRowSelected: { borderColor: '#FFFFFF', backgroundColor: '#262626' },
  uberOptionIcon: { fontSize: 32, marginRight: 14 },
  uberOptionInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  uberOptionName: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  uberOptionBadge: { fontSize: 11, color: '#A0A0A0', fontWeight: '600' },
  uberOptionSub: { fontSize: 11, color: '#A0A0A0', marginTop: 2 },
  uberOptionPrice: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },

  uberConfirmBtn: { backgroundColor: '#FFFFFF', borderRadius: 30, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  uberConfirmBtnText: { color: '#000000', fontSize: 16, fontWeight: '900' },

  matchmakingContainer: { alignItems: 'center', paddingVertical: 10 },
  spinEmoji: { fontSize: 48, marginBottom: 14 },
  matchTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  stepsContainer: { width: '100%', marginBottom: 16 },
  stepText: { fontSize: 13, color: '#7C7C7C', marginBottom: 8, textAlign: 'center' },
  stepDone: { color: '#05A357' },
  stepActive: { color: '#FFFFFF', fontWeight: '800' },
  cancelBtn: { backgroundColor: '#262626', borderRadius: 30, paddingVertical: 14, paddingHorizontal: 30, width: '100%', alignItems: 'center' },
  cancelBtnText: { color: '#FF3B30', fontWeight: '800', fontSize: 15 },
});
