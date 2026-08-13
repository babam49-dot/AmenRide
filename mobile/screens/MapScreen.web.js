import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { fetchRideOptions } from '../services/tripsApi';
import { useTheme } from '../context/ThemeContext';
import RatingModal from '../components/RatingModal';

const { width, height } = Dimensions.get('window');
const API_BASE = 'http://localhost:5000/api';

const BAHIR_DAR_PRESETS = [
  { name: 'Felege Hiwot Hospital', subtitle: 'Kebele 04, Bahir Dar', lat: 11.5980, lng: 37.3820 },
  { name: 'Grand Resort Hotel', subtitle: 'Lake Tana Shore', lat: 11.5936, lng: 37.3950 },
  { name: 'Blue Nile Bridge', subtitle: 'Abay River Crossing', lat: 11.6050, lng: 37.3810 },
  { name: 'Bahir Dar University', subtitle: 'Kebele 11, Bahir Dar', lat: 11.5850, lng: 37.3780 },
  { name: 'Poly-Technic College', subtitle: 'Kebele 08, Bahir Dar', lat: 11.5900, lng: 37.3850 },
  { name: 'Bole International Airport', subtitle: 'Addis Ababa', lat: 8.9779, lng: 38.7993 },
];

const buildMapHTML = (apiBase, startLat, startLng, destLat, destLng) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { width:100%; height:100%; margin:0; padding:0; background:#E5E7EB; }
    .leaflet-container { background:#E5E7EB !important; }
    .pin-a {
      background: #000000; color: #FFF; border-radius: 50%;
      width: 24px; height: 24px; text-align: center; line-height: 24px; font-weight: bold;
      border: 2px solid #FFF; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .pin-b {
      background: #EF4444; color: #FFF; border-radius: 50%;
      width: 24px; height: 24px; text-align: center; line-height: 24px; font-weight: bold;
      border: 2px solid #FFF; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  const pickup = [${startLat}, ${startLng}];
  const dropoff = [${destLat}, ${destLng}];
  const map = L.map('map', { center: pickup, zoom: 14 });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  L.marker(pickup, { icon: L.divIcon({ className: 'pin-a', html: 'A' }) }).addTo(map);
  L.marker(dropoff, { icon: L.divIcon({ className: 'pin-b', html: 'B' }) }).addTo(map);
  L.polyline([pickup, [(${startLat} + ${destLat})/2 + 0.001, (${startLng} + ${destLng})/2], dropoff], { color: '#000000', weight: 4 }).addTo(map);
</script>
</body>
</html>
`;

export default function MapScreenWeb() {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const [startLocation, setStartLocation]   = useState(BAHIR_DAR_PRESETS[0].name);
  const [startCoords, setStartCoords]       = useState({ lat: 11.5980, lng: 37.3820 });
  const [destination, setDestination]       = useState(BAHIR_DAR_PRESETS[1].name);
  const [destCoords, setDestCoords]         = useState({ lat: 11.5936, lng: 37.3950 });

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
      setStartCoords({ lat: preset.lat, lng: preset.lng });
    } else if (activeInput === 'dest') {
      setDestination(preset.name);
      setDestCoords({ lat: preset.lat, lng: preset.lng });
    }
    setActiveInput(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#000000' }]}>
      {/* Leaflet Web Map Container */}
      <View style={styles.iframeContainer}>
        <iframe
          title="Bahir Dar Interactive Map"
          srcDoc={buildMapHTML(API_BASE, startCoords.lat, startCoords.lng, destCoords.lat, destCoords.lng)}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>

      {/* Floating Interactive Location Card */}
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
          />
          <TouchableOpacity style={styles.plusBtn}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Search Suggestions Dropdown */}
        {activeInput && (
          <View style={[styles.suggestionsBox, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
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
                  <Text style={styles.suggestionSub}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Floating ETA Badge */}
      <View style={styles.etaFloatingBadge}>
        <Text style={styles.etaText}>1 min</Text>
      </View>

      {/* Bottom Sheet Card with Clean Drag Bar (No Text) */}
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
          /* Minimized Compact View */
          <View style={styles.minimizedContent}>
            <Text style={[styles.rideProgressTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Ride in Progress
            </Text>
            <Text style={[styles.driverName, { color: isDark ? '#E2E8F0' : '#334155' }]}>
              Name: Abraham
            </Text>
            <Text style={styles.driverRating}>Rating: ⭐⭐⭐⭐⭐ 4.6</Text>

            <View style={styles.locSummaryRow}>
              <Text style={styles.locDotGreen}>🟢 From: </Text>
              <Text style={[styles.locSummaryText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                {startLocation}
              </Text>
            </View>
            <View style={styles.locSummaryRow}>
              <Text style={styles.locDotRed}>🔴 To: </Text>
              <Text style={[styles.locSummaryText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                {destination}
              </Text>
            </View>

            <Text style={styles.rideFooterMsg}>Ride in progress - Enjoy your trip!</Text>

            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => setShowRatingModal(true)}
            >
              <Text style={styles.completeBtnText}>Complete Ride & Rate</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Expanded Card View */
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.cardHeading, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
              Your driver is here
            </Text>
            <Text style={styles.cardSubheading}>The driver is waiting for you</Text>

            {/* Vehicle Details Card */}
            <View style={[styles.vehicleDetailsCard, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
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

            {/* Ride Selector Row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rideSelectorRow}>
              {rideOptions.map((ride) => (
                <TouchableOpacity
                  key={ride.id}
                  style={[
                    styles.rideCard,
                    { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' },
                    selectedRide === ride.id.toString() && styles.rideCardActive,
                  ]}
                  onPress={() => setSelectedRide(ride.id.toString())}
                >
                  <Text style={styles.rideIcon}>{ride.icon || '🚗'}</Text>
                  <Text style={[styles.rideName, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {ride.name}
                  </Text>
                  <Text style={styles.ridePrice}>~{ride.base_price || 200.23} ETB</Text>
                </TouchableOpacity>
              ))}
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
  iframeContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topInputCard: {

    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    borderRadius: 16,
    padding: 14,
    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
    zIndex: 100,
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
    outlineStyle: 'none',
  },
  plusBtn: {
    paddingHorizontal: 8,
  },
  plusText: {
    fontSize: 22,
    color: '#64748B',
  },
  inputDivider: {
    height: 1,
    marginVertical: 8,
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
    cursor: 'pointer',
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
    top: 155,
    alignSelf: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 100,
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
    maxHeight: 460,
    zIndex: 100,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
  },
  bottomSheetMinimized: {
    maxHeight: 230,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 10,
    cursor: 'pointer',
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
    cursor: 'pointer',
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
    cursor: 'pointer',
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
    cursor: 'pointer',
  },
  setPickupText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 16,
  },
});
