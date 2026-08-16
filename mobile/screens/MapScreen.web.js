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
  { name: 'Bahir Dar University', subtitle: 'Kebele 11, Main Campus', lat: 11.5850, lng: 37.3780 },
  { name: 'Poly-Technic College', subtitle: 'Kebele 08, Bahir Dar', lat: 11.5900, lng: 37.3850 },
  { name: 'Belay Zeleke Airport', subtitle: 'Bahir Dar Airport (BJR)', lat: 11.6080, lng: 37.3216 },
];

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

function getDynamicEtaMinutes(distanceKm) {
  if (!distanceKm || distanceKm <= 0.1) return 2;
  const driveMins = Math.round((distanceKm / 30) * 60);
  return Math.max(2, driveMins + 2);
}

const buildMapHTML = (apiBase, startLat, startLng, destLat, destLng, isRequested) => `
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
    .car-marker {
      font-size: 26px;
      text-align: center;
      transition: all 0.5s ease-in-out;
      filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
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
  
  const midLat = (${startLat} + ${destLat})/2 + 0.001;
  const midLng = (${startLng} + ${destLng})/2;
  const poly = L.polyline([pickup, [midLat, midLng], dropoff], { color: '#0D9488', weight: 5, opacity: 0.8 }).addTo(map);
  map.fitBounds(poly.getBounds(), { padding: [40, 40] });

  // Animated Live Car Marker En-Route to Destination
  const carIcon = L.divIcon({ className: 'car-marker', html: '🚗' });
  const liveCarMarker = L.marker(pickup, { icon: carIcon }).addTo(map);

  let step = 0;
  const totalSteps = 100;
  setInterval(() => {
    step = (step + 1) % totalSteps;
    const progress = step / totalSteps;
    const currentLat = ${startLat} + (${destLat} - ${startLat}) * progress;
    const currentLng = ${startLng} + (${destLng} - ${startLng}) * progress;
    liveCarMarker.setLatLng([currentLat, currentLng]);
  }, 300);
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
  const [selectedPayment, setSelectedPayment] = useState('cash'); // 'cash' | 'telebirr' | 'cbe_birr'
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const handleConfirmRide = () => {
    setIsRequested(true);
    setIsMinimized(true); // Auto-minimize bottom sheet to progress state on ride start
  };

  const distanceKm = getHaversineDistanceKm(
    startCoords.lat,
    startCoords.lng,
    destCoords.lat,
    destCoords.lng
  );
  const etaMinutes = getDynamicEtaMinutes(distanceKm);

  const getPaymentLabel = () => {
    if (selectedPayment === 'chapa') return '💳 Chapa Online (CBE / Abyssinia / Telebirr)';
    if (selectedPayment === 'telebirr') return '📱 Telebirr (+251 911 001 122)';
    if (selectedPayment === 'cbe_birr') return '🏦 CBE Birr (1000 8899 7766)';
    return '💵 Cash on Arrival';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
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

      {/* Dynamic Floating ETA Badge */}
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

            <Text style={[styles.rideFooterMsg, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Payment: {getPaymentLabel()}
            </Text>

            <TouchableOpacity
              style={styles.completeBtn}
              onPress={() => {
                setShowRatingModal(true);
                setIsRequested(false);
              }}
            >
              <Text style={styles.completeBtnText}>Complete Ride & Rate</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Expanded Card View */
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
                Toyota Camry Sedan
              </Text>
              <View style={styles.badgePillRow}>
                <View style={styles.colorPill}>
                  <Text style={styles.colorPillText}>Black</Text>
                </View>
                <View style={styles.platePill}>
                  <Text style={styles.platePillText}>BD-3-5581</Text>
                </View>
              </View>
            </View>

            {/* Ride Selector Row with Dynamic Calculated Fares */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rideSelectorRow}>
              {rideOptions.map((ride) => {
                const dynamicFare = Math.round((ride.base_price || ride.basePriceETB || 80) + distanceKm * 25);
                const isSelected = selectedRide === ride.id.toString();

                return (
                  <TouchableOpacity
                    key={ride.id}
                    style={[
                      styles.rideCard,
                      { backgroundColor: isDark ? '#0F172A' : '#FFFFFF', borderColor: isDark ? '#334155' : '#E2E8F0' },
                      isSelected && styles.rideCardActive,
                    ]}
                    onPress={() => setSelectedRide(ride.id.toString())}
                  >
                    <Text style={styles.rideIcon}>{ride.icon || '🚗'}</Text>
                    <Text
                      style={[
                        styles.rideName,
                        { color: isSelected ? '#0F172A' : (isDark ? '#F8FAFC' : '#0F172A') },
                      ]}
                    >
                      {ride.name || ride.title}
                    </Text>
                    <Text
                      style={[
                        styles.ridePrice,
                        { color: isSelected ? '#0D9488' : (isDark ? '#38BDF8' : '#0D9488') },
                      ]}
                    >
                      ~{dynamicFare} ETB
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Payment Method Selection Bar */}
            <TouchableOpacity
              style={[styles.paymentBadgeRow, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }]}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.paymentIcon}>
                {selectedPayment === 'chapa' ? '💳' : selectedPayment === 'telebirr' ? '📱' : selectedPayment === 'cbe_birr' ? '🏦' : '💵'}
              </Text>
              <Text style={[styles.paymentText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                {getPaymentLabel()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.setPickupBtn}
              onPress={handleConfirmRide}
            >
              <Text style={styles.setPickupText}>
                {isRequested ? 'Driver Confirmed ✅' : 'Set pick-up point'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Payment Selection Modal */}
      {showPaymentModal && (
        <View style={styles.modalBackdrop}>
          <View style={[styles.paymentModalBox, { backgroundColor: isDark ? '#1E293B' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Select Payment Option</Text>
            <Text style={styles.modalSub}>Choose how you wish to settle your fare in Bahir Dar</Text>

            <TouchableOpacity
              style={[styles.paymentOptionItem, selectedPayment === 'cash' && styles.paymentOptionActive]}
              onPress={() => { setSelectedPayment('cash'); setShowPaymentModal(false); }}
            >
              <Text style={styles.optionIcon}>💵</Text>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Cash on Arrival</Text>
                <Text style={styles.optionDesc}>Pay the driver directly in cash at the end of trip</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOptionItem, selectedPayment === 'chapa' && styles.paymentOptionActive]}
              onPress={() => { setSelectedPayment('chapa'); setShowPaymentModal(false); }}
            >
              <Text style={styles.optionIcon}>💳</Text>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Chapa Online Payment Gateway</Text>
                <Text style={styles.optionDesc}>Pay before ride via CBE, Bank of Abyssinia, Telebirr & Awash</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOptionItem, selectedPayment === 'telebirr' && styles.paymentOptionActive]}
              onPress={() => { setSelectedPayment('telebirr'); setShowPaymentModal(false); }}
            >
              <Text style={styles.optionIcon}>📱</Text>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Telebirr Direct Wallet</Text>
                <Text style={styles.optionDesc}>Transfer to Ethio Telecom Account: +251 911 001 122</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOptionItem, selectedPayment === 'cbe_birr' && styles.paymentOptionActive]}
              onPress={() => { setSelectedPayment('cbe_birr'); setShowPaymentModal(false); }}
            >
              <Text style={styles.optionIcon}>🏦</Text>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>CBE Birr / Bank Transfer</Text>
                <Text style={styles.optionDesc}>CBE Account: 1000 8899 7766 (AMEN Ride Tech)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    cursor: 'pointer',
  },
  paymentIcon: {
    fontSize: 16,
  },
  paymentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  paymentChangeBtn: {
    color: '#0D9488',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
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
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 999,
  },
  paymentModalBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  paymentOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 10,
    cursor: 'pointer',
  },
  paymentOptionActive: {
    borderColor: '#0D9488',
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionTextCol: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeModalBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    cursor: 'pointer',
  },
  closeModalText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
