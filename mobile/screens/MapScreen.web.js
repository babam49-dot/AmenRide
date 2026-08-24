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

import { BAHIR_DAR_PRESETS, resolveBahirDarCoords } from '../utils/bahirDarLocations';

const { width, height } = Dimensions.get('window');
const API_BASE = 'http://localhost:5000/api';

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

  const [transferRefCode, setTransferRefCode] = useState('');
  const [transferVerified, setTransferVerified] = useState(false);
  const [transferError, setTransferError] = useState('');
  const [verifyingTransfer, setVerifyingTransfer] = useState(false);

  const handleStartLocationChange = (text) => {
    setStartLocation(text);
    const coords = resolveBahirDarCoords(text);
    if (coords && coords.lat) {
      setStartCoords({ lat: coords.lat, lng: coords.lng });
    }
  };

  const handleDestinationChange = (text) => {
    setDestination(text);
    const coords = resolveBahirDarCoords(text);
    if (coords && coords.lat) {
      setDestCoords({ lat: coords.lat, lng: coords.lng });
    }
  };

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

  const handleVerifyBankTransfer = async () => {
    if (!transferRefCode || transferRefCode.trim().length < 5) {
      setTransferError('Please enter a valid Telebirr or CBE Birr transfer transaction reference (e.g. TLB-88771122).');
      return;
    }
    setVerifyingTransfer(true);
    setTransferError('');

    try {
      const res = await fetch(`${API_BASE}/payments/verify-transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: `TRIP-WEB-${Date.now()}`,
          referenceCode: transferRefCode,
          provider: selectedPayment,
          amount: 220,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setTransferVerified(true);
        setTransferError('');
      } else {
        setTransferError(data.error || 'Transfer reference could not be verified by backend.');
        setTransferVerified(false);
      }
    } catch (e) {
      setTransferError('Network error verifying payment transfer with backend.');
    } finally {
      setVerifyingTransfer(false);
    }
  };

  const handleConfirmRide = () => {
    if ((selectedPayment === 'telebirr' || selectedPayment === 'cbe_birr') && !transferVerified) {
      setShowPaymentModal(true);
      return;
    }
    setIsRequested(true);
    setIsMinimized(true);
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
    if (selectedPayment === 'telebirr') return `📱 Telebirr ${transferVerified ? '✅ Verified' : '(Pending Ref)'}`;
    if (selectedPayment === 'cbe_birr') return `🏦 CBE Birr ${transferVerified ? '✅ Verified' : '(Pending Ref)'}`;
    return '💵 Cash on Arrival (Pay Driver in Car)';
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      {/* Yango Top Banner Overlay: Swipe to move map */}
      <View style={styles.yangoTopBanner}>
        <Text style={styles.yangoTopBannerText}>Swipe to move map</Text>
      </View>

      {/* Leaflet Web Map Container */}
      <View style={styles.iframeContainer}>
        <iframe
          title="Bahir Dar Interactive Map"
          srcDoc={buildMapHTML(API_BASE, startCoords.lat, startCoords.lng, destCoords.lat, destCoords.lng)}
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </View>

      {/* Yango Center Red Marker Pin with Hailing Icon */}
      <View style={styles.yangoCenterPin} pointerEvents="none">
        <View style={styles.yangoPinBadge}>
          <Text style={{ fontSize: 24 }}>🙋‍♂️</Text>
        </View>
        <View style={styles.yangoPinStem} />
      </View>

      {/* Floating Map Action Buttons (Bottom Left & Bottom Right) */}
      <View style={styles.yangoMapActions}>
        <TouchableOpacity
          style={styles.yangoFloatingCircle}
          onPress={() => setIsMinimized(!isMinimized)}
        >
          <Text style={{ fontSize: 22, fontWeight: '900', color: '#111111' }}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.yangoFloatingCircle}
          onPress={() => {
            setStartLocation('Ring Road, Felege Hiwot');
            setStartCoords({ lat: 11.5980, lng: 37.3820 });
          }}
        >
          <Text style={{ fontSize: 22, color: '#111111' }}>🧭</Text>
        </TouchableOpacity>
      </View>

      {/* Yango Bottom Sheet Card: WHERE FROM? */}
      <View style={styles.yangoBottomSheet}>
        <Text style={styles.whereFromHeader}>WHERE FROM?</Text>
        <View style={styles.whereFromDivider} />

        <View style={styles.whereFromRow}>
          <Text style={{ fontSize: 22, marginRight: 12 }}>📍</Text>
          <TextInput
            style={styles.whereFromInput}
            value={startLocation}
            onChangeText={setStartLocation}
            placeholder="Ring Road, Felege Hiwot"
          />
        </View>

        {/* Action Buttons Bar: Red Done Button + Bookmark */}
        <View style={styles.whereFromActions}>
          <TouchableOpacity
            style={styles.yangoDoneBtn}
            onPress={handleConfirmRide}
          >
            <Text style={styles.yangoDoneBtnText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.yangoBookmarkBtn}
            onPress={() => handleSelectPreset(BAHIR_DAR_PRESETS[0])}
          >
            <Text style={{ fontSize: 22 }}>🔖</Text>
          </TouchableOpacity>
        </View>
      </View>

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
              onPress={() => { setSelectedPayment('telebirr'); }}
            >
              <Text style={styles.optionIcon}>📱</Text>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>Telebirr Direct Wallet</Text>
                <Text style={styles.optionDesc}>Transfer to Ethio Telecom Account: +251 911 001 122</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOptionItem, selectedPayment === 'cbe_birr' && styles.paymentOptionActive]}
              onPress={() => { setSelectedPayment('cbe_birr'); }}
            >
              <Text style={styles.optionIcon}>🏦</Text>
              <View style={styles.optionTextCol}>
                <Text style={[styles.optionTitle, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>CBE Birr / Bank Transfer</Text>
                <Text style={styles.optionDesc}>CBE Account: 1000 8899 7766 (AMEN Ride Tech)</Text>
              </View>
            </TouchableOpacity>

            {(selectedPayment === 'telebirr' || selectedPayment === 'cbe_birr') && (
              <View style={{ marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: isDark ? '#0F172A' : '#F1F5F9' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: isDark ? '#F8FAFC' : '#0F172A', marginBottom: 6 }}>
                  Enter Transaction Reference Code:
                </Text>
                <TextInput
                  style={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: transferVerified ? '#10B981' : (isDark ? '#334155' : '#CBD5E1'),
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    color: isDark ? '#FFF' : '#000',
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                  value={transferRefCode}
                  onChangeText={(text) => { setTransferRefCode(text); setTransferVerified(false); setTransferError(''); }}
                  placeholder="e.g. TLB-88771122 or CBE-445566"
                  placeholderTextColor={isDark ? '#94A3B8' : '#64748B'}
                />

                {transferError ? (
                  <Text style={{ color: '#EF4444', fontSize: 11, marginBottom: 8, fontWeight: '600' }}>⚠️ {transferError}</Text>
                ) : null}

                {transferVerified ? (
                  <Text style={{ color: '#10B981', fontSize: 12, marginBottom: 8, fontWeight: '700' }}>
                    ✅ Payment Transfer Verified with Backend!
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#0D9488',
                      borderRadius: 8,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                    onPress={handleVerifyBankTransfer}
                    disabled={verifyingTransfer}
                  >
                    <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 12 }}>
                      {verifyingTransfer ? 'Verifying with Backend...' : 'Verify Transfer Payment'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.closeModalText}>{transferVerified || selectedPayment === 'cash' ? 'Confirm & Close' : 'Close'}</Text>
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
  // ── Yango Map Pickup Location Picker Styles ──
  yangoTopBanner: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    zIndex: 30,
    alignItems: 'center',
  },
  yangoTopBannerText: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  yangoCenterPin: {
    position: 'absolute',
    top: '48%',
    left: '50%',
    zIndex: 25,
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -48 }],
  },
  yangoPinBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FF2E2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  yangoPinStem: {
    width: 4,
    height: 24,
    backgroundColor: '#000000',
  },
  yangoMapActions: {
    position: 'absolute',
    bottom: 230,
    left: 20,
    right: 20,
    zIndex: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  yangoFloatingCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  yangoBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  whereFromHeader: {
    fontSize: 20,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: -0.5,
  },
  whereFromDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  whereFromRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  whereFromInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#111111',
  },
  whereFromActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yangoDoneBtn: {
    flex: 1,
    backgroundColor: '#FF2E2E',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 10,
  },
  yangoDoneBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  yangoBookmarkBtn: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#EFEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },

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
  },
  colorPill: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 10,
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
