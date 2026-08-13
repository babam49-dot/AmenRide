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
import { fetchRideOptions } from '../services/tripsApi';
import { useLanguage } from '../context/LanguageContext';
import ReceiptModal from '../components/ReceiptModal';
import LiveEtaBanner from '../components/LiveEtaBanner';
import RatingModal from '../components/RatingModal';

const { width, height } = Dimensions.get('window');
const API_BASE = 'http://localhost:5000/api';

// Customer demo position (Bahir Dar city center — used as default on web)
const CUSTOMER_LAT = 11.5936;
const CUSTOMER_LNG = 37.3908;

const MATCHING_STEPS = [
  '🔍  Connecting to AMEN Dispatcher...',
  '📡  Locating nearest driver...',
  '🚗  Matching your ride...',
  '✅  Driver confirmed! En route.',
];

// ── Real Bahir Dar Leaflet Map HTML ──────────────────────────────────────────
// Uses OpenStreetMap CartoDB Dark tiles (real Bahir Dar imagery)
// Polls /api/drivers/nearby every 5 seconds to move real driver pins
const buildMapHTML = (apiBase, customerLat, customerLng) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { width:100%; height:100%; margin:0; padding:0; background:#000; }
    .leaflet-container { background:#000 !important; }

    .customer-pin {
      background: #3B82F6;
      border: 3px solid #FFFFFF;
      border-radius: 50%;
      width: 16px; height: 16px;
      box-shadow: 0 0 0 6px rgba(59,130,246,0.3);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
      70%  { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
      100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
    }

    .driver-pin {
      background: #05A357;
      color: #FFFFFF;
      border: 2px solid #FFFFFF;
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 900;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(5,163,87,0.7);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    .driver-pin:hover { transform: scale(1.1); }
    .driver-pin.nearest {
      background: #FFFFFF;
      color: #000000;
      border-color: #05A357;
      box-shadow: 0 4px 20px rgba(255,255,255,0.9);
    }

    .dist-label {
      background: rgba(0,0,0,0.85);
      color: #A0A0A0;
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 10px;
      font-family: -apple-system, sans-serif;
      white-space: nowrap;
    }

    .leaflet-control-zoom a {
      background: #181818 !important;
      color: #FFF !important;
      border: 1px solid #333 !important;
    }
    .leaflet-popup-content-wrapper {
      background: #181818;
      color: #FFF;
      border: 1px solid #333;
      border-radius: 16px;
    }
    .leaflet-popup-tip { background: #181818; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  const CUSTOMER_LAT = ${customerLat};
  const CUSTOMER_LNG = ${customerLng};
  const API_BASE = '${apiBase}';

  const map = L.map('map', { center: [CUSTOMER_LAT, CUSTOMER_LNG], zoom: 14 });

  // Real Bahir Dar dark map tiles (OpenStreetMap CartoDB Dark)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Customer pulsing blue dot
  const customerIcon = L.divIcon({
    className: '',
    html: '<div class="customer-pin"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  const customerMarker = L.marker([CUSTOMER_LAT, CUSTOMER_LNG], { icon: customerIcon })
    .addTo(map)
    .bindPopup('<b>📍 Your Location</b><br>Bahir Dar City Center');

  // Driver markers map (id -> marker)
  const driverMarkers = {};

  // ── Fetch nearest drivers and update pins every 5 seconds ──
  async function updateNearbyDrivers() {
    try {
      const res = await fetch(
        API_BASE + '/driver/nearby?lat=' + CUSTOMER_LAT + '&lng=' + CUSTOMER_LNG + '&radius=15'
      );
      const data = await res.json();
      if (!data.success) return;

      const freshIds = new Set(data.drivers.map(d => d.id));

      // Remove stale markers (driver went offline)
      Object.keys(driverMarkers).forEach(id => {
        if (!freshIds.has(parseInt(id))) {
          driverMarkers[id].remove();
          delete driverMarkers[id];
        }
      });

      // Add/update driver markers
      data.drivers.forEach((driver, index) => {
        const isNearest = index === 0;
        const label = (isNearest ? '⭐ ' : '🚗 ') + driver.name.split(' ')[0];
        const distText = driver.distance_km + ' km · ' + driver.eta_minutes + ' min';

        const icon = L.divIcon({
          className: '',
          html: '<div class="driver-pin ' + (isNearest ? 'nearest' : '') + '">' + label + '</div>',
          iconSize: [120, 28],
          iconAnchor: [60, 14]
        });

        const popupContent =
          '<div style="font-family:-apple-system,sans-serif">' +
          '<b>' + driver.name + '</b><br>' +
          '🚗 ' + driver.vehicle_type + ' · ' + driver.vehicle_plate + '<br>' +
          '⭐ ' + driver.rating + '<br>' +
          '📍 ' + distText +
          (isNearest ? '<br><span style="color:#05A357;font-weight:900">✅ Nearest Driver</span>' : '') +
          '</div>';

        if (driverMarkers[driver.id]) {
          // Smoothly move existing marker
          driverMarkers[driver.id].setLatLng([driver.lat, driver.lng]);
          driverMarkers[driver.id].setIcon(icon);
        } else {
          // Create new marker
          driverMarkers[driver.id] = L.marker([driver.lat, driver.lng], { icon })
            .addTo(map)
            .bindPopup(popupContent);
        }
      });

    } catch (e) {
      // Backend might not be running — show demo fallback pins
      showDemoPins();
    }
  }

  // Demo fallback pins (shown when backend is offline)
  let demoShown = false;
  function showDemoPins() {
    if (demoShown) return;
    demoShown = true;
    const demoPins = [
      { lat: 11.6041, lng: 37.3724, name: 'Amanuel B.', km: '1.4', min: '3', nearest: true },
      { lat: 11.5880, lng: 37.3812, name: 'Tewodros K.', km: '2.1', min: '5', nearest: false },
      { lat: 11.5936, lng: 37.3950, name: 'Meron T.', km: '3.3', min: '8', nearest: false },
    ];
    demoPins.forEach((d, i) => {
      const icon = L.divIcon({
        className: '',
        html: '<div class="driver-pin ' + (d.nearest ? 'nearest' : '') + '">' +
              (d.nearest ? '⭐ ' : '🚗 ') + d.name + '</div>',
        iconSize: [130, 28], iconAnchor: [65, 14]
      });
      L.marker([d.lat, d.lng], { icon })
        .addTo(map)
        .bindPopup('<b>' + d.name + '</b><br>📍 ' + d.km + ' km · ' + d.min + ' min ETA');
    });
  }

  // Start polling
  updateNearbyDrivers();
  setInterval(updateNearbyDrivers, 5000);

  // Bahir Dar key landmarks
  const landmarks = [
    { lat: 11.6041, lng: 37.3724, name: '✈️ Bahir Dar Airport' },
    { lat: 11.5936, lng: 37.3950, name: '🏨 Grand Resort Hotel' },
    { lat: 11.5880, lng: 37.3812, name: '🎓 Bahir Dar University' },
    { lat: 11.5810, lng: 37.3870, name: '🚌 Bus Terminal' },
  ];
  landmarks.forEach(l => {
    L.marker([l.lat, l.lng], {
      icon: L.divIcon({
        className: '',
        html: '<div class="dist-label">' + l.name + '</div>',
        iconSize: [160, 22], iconAnchor: [80, 11]
      })
    }).addTo(map);
  });

</script>
</body>
</html>
`;

export default function MapScreen() {
  const { t } = useLanguage();
  const [selectedRide, setSelectedRide] = useState(null);
  const [isRequested, setIsRequested] = useState(false);
  const [rideOptions, setRideOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchStep, setMatchStep] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
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
        if (step >= MATCHING_STEPS.length) {
          clearInterval(interval);
          setShowReceipt(true);
        } else {
          setMatchStep(step);
        }
      }, 1400);
      return () => clearInterval(interval);
    } else {
      spinAnim.setValue(0);
      setMatchStep(0);
    }
  }, [isRequested]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const activeRide = rideOptions.find(
    (r) => r.id?.toString() === selectedRide || r.id === selectedRide
  );

  const mapHTML = buildMapHTML(API_BASE, CUSTOMER_LAT, CUSTOMER_LNG);

  return (
    <View style={styles.container}>
      {/* ── Real Bahir Dar Leaflet Map ── */}
      <View style={styles.mapContainer}>
        <iframe
          title="AMEN Ride Map — Bahir Dar"
          srcDoc={mapHTML}
          style={styles.iframeMap}
          frameBorder="0"
        />
      </View>

      {/* ── Address Route Bar (top overlay) ── */}
      <View style={styles.addressBar}>
        <View style={styles.addressRow}>
          <View style={styles.pickupDot} />
          <Text style={styles.addressText} numberOfLines={1}>📍 Your Location — Bahir Dar</Text>
        </View>
        <View style={styles.addressDivider} />
        <View style={styles.addressRow}>
          <View style={styles.dropoffDot} />
          <Text style={styles.addressText} numberOfLines={1}>Where to? Tap to set destination</Text>
        </View>
      </View>

      {/* ── Uber-style Booking Bottom Sheet ── */}
      <View style={styles.bottomSheet}>
        {!isRequested ? (
          <>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{t('chooseRide')}</Text>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.loadingText}>{t('loadingOptions')}</Text>
              </View>
            ) : (
              <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                {rideOptions.map((ride) => {
                  const isSelected =
                    ride.id?.toString() === selectedRide || ride.id === selectedRide;
                  return (
                    <TouchableOpacity
                      key={ride.id}
                      style={[styles.rideRow, isSelected && styles.rideRowSelected]}
                      onPress={() => setSelectedRide(ride.id?.toString())}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.rideIcon}>{ride.icon}</Text>
                      <View style={styles.rideInfo}>
                        <View style={styles.rideTitleRow}>
                          <Text style={styles.rideName}>{ride.name}</Text>
                          <Text style={styles.rideCapacity}>👤 4</Text>
                        </View>
                        <Text style={styles.rideSub}>
                          {ride.eta_minutes} min · {ride.description || 'Direct ride'}
                        </Text>
                      </View>
                      <Text style={styles.ridePrice}>{ride.base_price} ETB</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <TouchableOpacity
              style={[styles.confirmBtn, !activeRide && styles.confirmBtnDisabled]}
              onPress={() => setIsRequested(true)}
              disabled={!activeRide}
              activeOpacity={0.9}
            >
              <Text style={styles.confirmBtnText}>
                Choose {activeRide?.name || 'AMEN Standard'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.matchingContainer}>
            <View style={styles.sheetHandle} />
            <Animated.Text style={[styles.spinnerEmoji, { transform: [{ rotate: spin }] }]}>
              🔄
            </Animated.Text>
            <Text style={styles.matchTitle}>{t('requestingRide')}</Text>
            <View style={styles.steps}>
              {MATCHING_STEPS.map((step, i) => (
                <Text
                  key={i}
                  style={[
                    styles.stepText,
                    i < matchStep && styles.stepDone,
                    i === matchStep && styles.stepActive,
                  ]}
                >
                  {step}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsRequested(false)}
              activeOpacity={0.9}
            >
              <Text style={styles.cancelBtnText}>{t('cancelRequest')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ReceiptModal
        visible={showReceipt}
        onClose={() => { setShowReceipt(false); setIsRequested(false); }}
        tripData={{
          fare: activeRide?.base_price || 210,
          pickup_name: 'Your Location, Bahir Dar',
          dropoff_name: 'Grand Resort Hotel, Lake Tana',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  mapContainer: { width: '100%', height: '100%' },
  iframeMap: { width: '100%', height: '100%', border: 'none' },

  addressBar: {
    position: 'absolute', top: 50, left: 16, right: 16, zIndex: 10,
    backgroundColor: '#181818', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#262626',
  },
  addressRow: { flexDirection: 'row', alignItems: 'center' },
  pickupDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6', marginRight: 12 },
  dropoffDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF', marginRight: 12 },
  addressDivider: { width: 1, height: 10, backgroundColor: '#333', marginLeft: 4.5, marginVertical: 2 },
  addressText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', flex: 1 },

  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 10, paddingBottom: 32, paddingHorizontal: 16,
    borderTopWidth: 1, borderColor: '#262626', maxHeight: height * 0.52,
  },
  sheetHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: '#333',
    alignSelf: 'center', marginBottom: 14,
  },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 12 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 10 },
  loadingText: { color: '#A0A0A0', fontSize: 13 },
  optionsList: { maxHeight: 200, marginBottom: 16 },
  rideRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12,
    borderRadius: 14, marginBottom: 6, borderWidth: 2, borderColor: 'transparent', backgroundColor: '#181818',
  },
  rideRowSelected: { borderColor: '#FFFFFF', backgroundColor: '#262626' },
  rideIcon: { fontSize: 32, marginRight: 14 },
  rideInfo: { flex: 1 },
  rideTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rideName: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  rideCapacity: { fontSize: 11, color: '#A0A0A0' },
  rideSub: { fontSize: 11, color: '#A0A0A0', marginTop: 2 },
  ridePrice: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  confirmBtn: {
    backgroundColor: '#FFFFFF', borderRadius: 30, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { color: '#000000', fontSize: 16, fontWeight: '900' },

  matchingContainer: { alignItems: 'center', paddingVertical: 10 },
  spinnerEmoji: { fontSize: 48, marginBottom: 14 },
  matchTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginBottom: 16 },
  steps: { width: '100%', marginBottom: 16 },
  stepText: { fontSize: 13, color: '#7C7C7C', marginBottom: 8, textAlign: 'center' },
  stepDone: { color: '#05A357' },
  stepActive: { color: '#FFFFFF', fontWeight: '800' },
  cancelBtn: {
    backgroundColor: '#262626', borderRadius: 30, paddingVertical: 14,
    paddingHorizontal: 30, width: '100%', alignItems: 'center',
  },
  cancelBtnText: { color: '#EF4444', fontWeight: '800', fontSize: 15 },
});
