import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { fetchRideOptions } from '../services/tripsApi';
import { useTheme } from '../context/ThemeContext';
import RatingModal from '../components/RatingModal';

const { width, height } = Dimensions.get('window');

let MapView, Marker, Polyline, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default || Maps;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn('react-native-maps dynamic load skipped on web:', e.message);
  }
}

const BAHIR_DAR_PRESETS = [
  { name: 'Felege Hiwot Hospital', subtitle: 'Kebele 04, Bahir Dar', lat: 11.5980, lng: 37.3820 },
  { name: 'Grand Resort Hotel', subtitle: 'Lake Tana Shore', lat: 11.5936, lng: 37.3950 },
  { name: 'Blue Nile Bridge', subtitle: 'Abay River Crossing', lat: 11.6050, lng: 37.3810 },
  { name: 'Bahir Dar University', subtitle: 'Kebele 11, Bahir Dar', lat: 11.5850, lng: 37.3780 },
  { name: 'Poly-Technic College', subtitle: 'Kebele 08, Bahir Dar', lat: 11.5900, lng: 37.3850 },
  { name: 'Bole International Airport', subtitle: 'Addis Ababa', lat: 8.9779, lng: 38.7993 },
];

// Haversine formula: Real distance in kilometers
function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// Calculate dynamic ETA in minutes (avg 30 km/h speed + 2 min buffer)
function getDynamicEtaMinutes(distanceKm) {
  if (!distanceKm || distanceKm <= 0.1) return 2;
  const driveMins = Math.round((distanceKm / 30) * 60);
  return Math.max(2, driveMins + 2);
}

export default function MapScreen() {
  if (Platform.OS === 'web') {
    const MapScreenWeb = require('./MapScreen.web').default;
    return <MapScreenWeb />;
  }

  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [startLocation, setStartLocation]   = useState(BAHIR_DAR_PRESETS[0].name);
  const [startCoords, setStartCoords]       = useState({ latitude: 11.5980, longitude: 37.3820 });
  const [destination, setDestination]       = useState(BAHIR_DAR_PRESETS[1].name);
  const [destCoords, setDestCoords]         = useState({ latitude: 11.5936, longitude: 37.3950 });

  const [activeInput, setActiveInput]       = useState(null);
  const [selectedRide, setSelectedRide]     = useState('1');
  const [isRequested, setIsRequested]       = useState(false);
  const [isMinimized, setIsMinimized]       = useState(false);
  const [rideOptions, setRideOptions]       = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchRideOptions().then((data) => {
      setRideOptions(data);
      if (data && data.length > 0) setSelectedRide(data[0].id.toString());
    });
  }, []);

  const handleSelectPreset = (preset) => {
    if (activeInput === 'start') {
      setStartLocation(preset.name);
      setStartCoords({ latitude: preset.lat, longitude: preset.lng });
    } else if (activeInput === 'dest') {
      setDestination(preset.name);
      setDestCoords({ latitude: preset.lat, longitude: preset.lng });
    }
    setActiveInput(null);
  };

  // Real Dynamic Calculations
  const distanceKm = getHaversineDistanceKm(
    startCoords.latitude,
    startCoords.longitude,
    destCoords.latitude,
    destCoords.longitude
  );
  const etaMinutes = getDynamicEtaMinutes(distanceKm);

  const routePolyline = [
    startCoords,
    {
      latitude: (startCoords.latitude + destCoords.latitude) / 2 + 0.001,
      longitude: (startCoords.longitude + destCoords.longitude) / 2,
    },
    destCoords,
  ];

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      {/* Real Map View */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 11.5958,
          longitude: 37.3885,
          latitudeDelta: 0.025,
          longitudeDelta: 0.025,
        }}
      >
        <Polyline coordinates={routePolyline} strokeColor={isDark ? '#38BDF8' : '#000000'} strokeWidth={5} />

        <Marker coordinate={startCoords} title="Start (A)">
          <View style={styles.pinA}>
            <Text style={styles.pinLabel}>A</Text>
          </View>
        </Marker>

        <Marker coordinate={destCoords} title="Destination (B)">
          <View style={styles.pinB}>
            <Text style={styles.pinLabel}>B</Text>
          </View>
        </Marker>
      </MapView>

      {/* Floating Location Card */}
      <View style={[styles.topInputCard, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
        <View style={styles.inputRow}>
          <View style={styles.badgeA}>
            <Text style={styles.badgeText}>A</Text>
          </View>
          <TextInput
            style={[styles.locationInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            value={startLocation}
            onChangeText={setStartLocation}
            onFocus={() => setActiveInput('start')}
            placeholder="Search start location..."
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
          />
        </View>

        <View style={[styles.inputDivider, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]} />

        <View style={styles.inputRow}>
          <View style={styles.badgeB}>
            <Text style={styles.badgeText}>B</Text>
          </View>
          <TextInput
            style={[styles.locationInput, { color: isDark ? '#F8FAFC' : '#0F172A' }]}
            value={destination}
            onChangeText={setDestination}
            onFocus={() => setActiveInput('dest')}
            placeholder="Search destination..."
            placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
          />
          <TouchableOpacity style={styles.plusBtn}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Search Suggestions Dropdown */}
        {activeInput && (
          <View style={[styles.suggestionsBox, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
            <Text style={styles.suggestionsHeader}>Suggested Locations in Bahir Dar</Text>
            {BAHIR_DAR_PRESETS.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionRow}
                onPress={() => handleSelectPreset(item)}
              >
                <Text style={styles.suggestionIcon}>📍</Text>
                <View>
                  <Text style={[styles.suggestionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.suggestionSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Dynamic Top Floating ETA Badge (Calculates Real Time & Distance) */}
      <View style={styles.etaFloatingBadge}>
        <Text style={styles.etaText}>{etaMinutes} min ({distanceKm} km)</Text>
      </View>

      {/* Bottom Sheet Card */}
      <View
        style={[
          styles.bottomSheet,
          { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' },
          isMinimized && styles.bottomSheetMinimized,
        ]}
      >
        <TouchableOpacity
          style={styles.dragHandle}
          activeOpacity={0.7}
          onPress={() => setIsMinimized(!isMinimized)}
        >
          <View style={[styles.handleBar, { backgroundColor: isDark ? '#64748B' : '#CBD5E1' }]} />
        </TouchableOpacity>

        {isMinimized ? (
          /* Minimized Compact Summary */
          <View style={styles.minimizedContent}>
            <Text style={[styles.rideProgressTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Ride in Progress ({etaMinutes} min • {distanceKm} km)
            </Text>
            <Text style={[styles.driverName, { color: isDark ? '#E2E8F0' : '#334155' }]}>
              Name: Abraham
            </Text>
            <Text style={styles.driverRating}>Rating: ⭐⭐⭐⭐⭐ 4.6</Text>

            <View style={styles.locSummaryRow}>
              <Text style={styles.locDotGreen}>🟢 From: </Text>
              <Text style={[styles.locSummaryText, { color: isDark ? '#CBD5E1' : '#475569' }]} numberOfLines={1}>
                {startLocation}
              </Text>
            </View>
            <View style={styles.locSummaryRow}>
              <Text style={styles.locDotRed}>🔴 To: </Text>
              <Text style={[styles.locSummaryText, { color: isDark ? '#CBD5E1' : '#475569' }]} numberOfLines={1}>
                {destination}
              </Text>
            </View>

            <Text style={[styles.rideFooterMsg, { color: isDark ? '#94A3B8' : '#64748B' }]}>Ride in progress - Enjoy your trip!</Text>

            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => setShowRatingModal(true)}
            >
              <Text style={styles.completeBtnText}>Complete Ride & Rate</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Expanded Full Card View */
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.cardHeading, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Your driver is here ({etaMinutes} min away)
            </Text>
            <Text style={[styles.cardSubheading, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Driver is waiting • Distance: {distanceKm} km
            </Text>

            {/* Vehicle Details Card */}
            <View style={[styles.vehicleDetailsCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
              <Text style={[styles.vehicleModelName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                Toyota Camry
              </Text>
              <View style={styles.badgePillRow}>
                <View style={styles.colorPill}>
                  <Text style={styles.colorPillText}>Black</Text>
                </View>
                <View style={styles.platePill}>
                  <Text style={styles.platePillText}>55810AA</Text>
                </View>
              </View>
            </View>

            {/* Ride Selector Row with Dynamic Calculated Fares */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rideSelectorRow}>
              {rideOptions.map((ride) => {
                const dynamicFare = Math.round((ride.base_price || 80) + distanceKm * 25);
                return (
                  <TouchableOpacity
                    key={ride.id}
                    style={[
                      styles.rideCard,
                      { backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' },
                      selectedRide === ride.id.toString() && styles.rideCardActive,
                    ]}
                    onPress={() => setSelectedRide(ride.id.toString())}
                  >
                    <Text style={styles.rideIcon}>{ride.icon || '🚗'}</Text>
                    <Text style={[styles.rideName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      {ride.name}
                    </Text>
                    <Text style={[styles.ridePrice, { color: isDark ? '#38BDF8' : '#0D9488' }]}>~{dynamicFare} ETB</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.paymentBadgeRow}>
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={[styles.paymentText, { color: isDark ? '#E2E8F0' : '#334155' }]}>Cash</Text>
            </View>

            <TouchableOpacity
              style={styles.setPickupBtn}
              onPress={() => setIsRequested(true)}
            >
              <Text style={styles.setPickupText}>
                {isRequested ? 'Driver Confirmed ✅' : 'Set pick-up point'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={() => setShowRatingModal(false)}
        driverName="Abraham"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  pinA: {
    backgroundColor: '#000000',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pinB: {
    backgroundColor: '#EF4444',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pinLabel: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  topInputCard: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeA: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeB: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 4,
  },
  plusBtn: {
    paddingHorizontal: 10,
  },
  plusText: {
    fontSize: 22,
    color: '#64748B',
  },
  inputDivider: {
    height: 1,
    marginVertical: 10,
    marginLeft: 34,
  },
  suggestionsBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#334155',
    paddingTop: 10,
  },
  suggestionsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  suggestionIcon: {
    fontSize: 16,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  suggestionSub: {
    fontSize: 11,
    color: '#64748B',
  },
  etaFloatingBadge: {
    position: 'absolute',
    top: 200,
    alignSelf: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  etaText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: height * 0.52,
    elevation: 12,
  },
  bottomSheetMinimized: {
    maxHeight: 230,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  minimizedContent: {
    paddingVertical: 4,
  },
  rideProgressTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
  },
  driverRating: {
    fontSize: 13,
    color: '#D97706',
    marginVertical: 2,
  },
  locSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locDotGreen: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  locDotRed: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '700',
  },
  locSummaryText: {
    fontSize: 13,
    flex: 1,
  },
  rideFooterMsg: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 8,
  },
  completeBtn: {
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cardHeading: {
    fontSize: 20,
    fontWeight: '800',
  },
  cardSubheading: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  vehicleDetailsCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  vehicleModelName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  badgePillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorPill: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  colorPillText: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 12,
  },
  platePill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  platePillText: {
    fontWeight: '800',
    color: '#0F172A',
    fontSize: 12,
  },
  rideSelectorRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  rideCard: {
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 140,
  },
  rideCardActive: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  rideIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  rideName: {
    fontSize: 13,
    fontWeight: '700',
  },
  ridePrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  paymentBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 12,
    gap: 6,
  },
  paymentIcon: {
    fontSize: 16,
  },
  paymentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  setPickupBtn: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  setPickupText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 16,
  },
});
