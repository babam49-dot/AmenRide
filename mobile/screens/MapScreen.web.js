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
import { LinearGradient } from 'expo-linear-gradient';
import { fetchRideOptions } from '../services/tripsApi';

const { width, height } = Dimensions.get('window');

const MATCHING_STEPS = [
  '🔍  Locating nearby drivers in Bahir Dar...',
  '📡  Connecting to AMEN Dispatcher...',
  '🚗  Matching with best driver on Kebele 03 road...',
  '✅  Driver confirmed! En route to pickup.',
];

// Interactive Leaflet HTML document centered on Bahir Dar, Ethiopia
const BAHIR_DAR_MAP_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #0f172a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .leaflet-container { background: #0f172a !important; }
    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30, 41, 59, 0.95);
      border: 2px solid #FF9500;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(255, 149, 0, 0.4);
      font-size: 20px;
    }
    .pickup-marker {
      background: #10B981;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.6);
      white-space: nowrap;
    }
    .dropoff-marker {
      background: #EF4444;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.6);
      white-space: nowrap;
    }
    .driver-badge {
      background: #1E293B;
      border: 2px solid #FF9500;
      border-radius: 20px;
      padding: 4px 8px;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    }
    .leaflet-control-zoom { border: none !important; }
    .leaflet-control-zoom a {
      background: #1E293B !important;
      color: #FFF !important;
      border: 1px solid #334155 !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    // Initialize map centered at Bahir Dar City Center (Lake Tana shore)
    const map = L.map('map', {
      center: [11.5936, 37.3908],
      zoom: 14,
      zoomControl: true
    });

    // Dark tile layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Key Bahir Dar Coordinates
    const pickupCoords  = [11.5980, 37.3820]; // Bahir Dar Airport Rd / Felege Hiwot
    const dropoffCoords = [11.5936, 37.3950]; // Grand Resort Hotel, Lake Tana

    // Real street polyline route in Bahir Dar
    const routeCoordinates = [
      [11.5980, 37.3820], // Pickup
      [11.5972, 37.3855], // Kebele 11 Junction
      [11.5960, 37.3888], // St. George Church Roundabout
      [11.5948, 37.3915], // Commercial Bank Ave
      [11.5936, 37.3950]  // Lake Tana Dropoff
    ];

    // Draw glowing route line (polyline)
    L.polyline(routeCoordinates, {
      color: '#FF9500',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Outer glow effect line
    L.polyline(routeCoordinates, {
      color: '#FF9500',
      weight: 14,
      opacity: 0.25,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Pickup Marker
    L.marker(pickupCoords, {
      icon: L.divIcon({
        className: 'custom-icon',
        html: '<div class="pickup-marker">🟢 Pickup: Felege Hiwot</div>',
        iconSize: [160, 30],
        iconAnchor: [80, 15]
      })
    }).addTo(map);

    // Dropoff Marker
    L.marker(dropoffCoords, {
      icon: L.divIcon({
        className: 'custom-icon',
        html: '<div class="dropoff-marker">🔴 Dropoff: Grand Resort Hotel</div>',
        iconSize: [180, 30],
        iconAnchor: [90, 15]
      })
    }).addTo(map);

    // Live Drivers nearby on Bahir Dar roads
    const drivers = [
      { coords: [11.5965, 37.3865], icon: '🚗', name: 'Amen Ride Driver 1' },
      { coords: [11.5925, 37.3910], icon: '🚙', name: 'Amen Comfort Driver 2' },
      { coords: [11.5950, 37.3970], icon: '🏍️', name: 'Amen Boda Driver 3' }
    ];

    drivers.forEach(d => {
      const marker = L.marker(d.coords, {
        icon: L.divIcon({
          className: 'custom-icon',
          html: '<div class="driver-badge">' + d.icon + '</div>',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        })
      }).addTo(map);
      marker.bindPopup('<b>' + d.name + '</b><br>Available in Bahir Dar');
    });

    // Fit map bounds to show route
    map.fitBounds(L.polyline(routeCoordinates).getBounds(), { padding: [40, 40] });
  </script>
</body>
</html>
`;

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
        if (step >= MATCHING_STEPS.length) {
          clearInterval(interval);
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

  return (
    <View style={styles.container}>
      {/* ── Real Interactive Bahir Dar OpenStreetMap View ── */}
      <View style={styles.mapContainer}>
        <iframe
          title="Bahir Dar City Map"
          srcDoc={BAHIR_DAR_MAP_HTML}
          style={styles.iframeMap}
          frameBorder="0"
        />
      </View>

      {/* ── Floating Route & Location Bar ── */}
      <View style={styles.topBar}>
        <View style={styles.searchBar}>
          <View style={styles.locationDot} />
          <View style={styles.routeInfo}>
            <Text style={styles.searchText}>Bahir Dar City · Lake Tana Route</Text>
            <Text style={styles.searchSub}>4.2 km · 12 min drive</Text>
          </View>
          <View style={styles.searchBadge}>
            <Text style={styles.searchBadgeText}>LIVE MAP</Text>
          </View>
        </View>
      </View>

      {/* ── Booking Bottom Sheet ── */}
      <View style={styles.bottomSheet}>
        {!isRequested ? (
          <>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Where to in Bahir Dar?</Text>
            <Text style={styles.sheetSub}>Select your ride option for Lake Tana route</Text>

            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FF9500" size="small" />
                <Text style={styles.loadingText}>Loading ride options...</Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rideList}>
                {rideOptions.map((ride) => {
                  const isSelected = ride.id?.toString() === selectedRide || ride.id === selectedRide;
                  return (
                    <TouchableOpacity
                      key={ride.id}
                      style={[styles.rideCard, isSelected && styles.rideCardSelected]}
                      onPress={() => setSelectedRide(ride.id?.toString())}
                      activeOpacity={0.85}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={[ride.color || '#FF9500', (ride.color || '#FF9500') + '44']}
                          style={StyleSheet.absoluteFill}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          borderRadius={16}
                        />
                      )}
                      <Text style={styles.rideIcon}>{ride.icon}</Text>
                      <Text style={[styles.rideName, isSelected && { color: '#FFF' }]}>{ride.name}</Text>
                      <Text style={[styles.rideEta, isSelected && { color: 'rgba(255,255,255,0.7)' }]}>
                        {ride.eta_minutes} min away
                      </Text>
                      <Text style={[styles.ridePrice, isSelected && { color: '#FFF' }]}>
                        {ride.base_price} ETB
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <TouchableOpacity
              onPress={() => setIsRequested(true)}
              disabled={!activeRide}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[activeRide?.color || '#FF9500', '#FF6B00']}
                style={styles.confirmBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.confirmBtnText}>
                  Confirm {activeRide?.name || 'Ride'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.matchmakingContainer}>
            <View style={styles.sheetHandle} />
            <Animated.Text style={[styles.spinEmoji, { transform: [{ rotate: spin }] }]}>
              🔄
            </Animated.Text>
            <Text style={styles.matchTitle}>Finding your driver in Bahir Dar...</Text>
            <View style={styles.stepsContainer}>
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
            <TouchableOpacity onPress={() => setIsRequested(false)} activeOpacity={0.9}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.confirmBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.confirmBtnText}>Cancel Request</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  iframeMap: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  topBar: {
    position: 'absolute', top: 50, left: 18, right: 18, zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255,149,0,0.3)',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
  },
  locationDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#10B981', marginRight: 12,
  },
  routeInfo: { flex: 1 },
  searchText: {
    fontSize: 13, fontWeight: '700', color: '#F1F5F9',
  },
  searchSub: {
    fontSize: 10, color: '#FF9500', marginTop: 1, fontWeight: '600',
  },
  searchBadge: {
    backgroundColor: '#FF9500', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  searchBadgeText: {
    color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingBottom: 36, paddingHorizontal: 20,
    borderTopWidth: 1, borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 20,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#334155', alignSelf: 'center', marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 22, fontWeight: '800', color: '#FFFFFF',
  },
  sheetSub: {
    fontSize: 13, color: '#64748B', marginTop: 4, marginBottom: 18,
  },
  loadingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 20, gap: 10,
  },
  loadingText: { color: '#64748B', fontSize: 13 },
  rideList: { paddingBottom: 16, paddingRight: 10 },
  rideCard: {
    width: 126, backgroundColor: '#1E293B',
    borderRadius: 16, padding: 14,
    marginRight: 12,
    borderWidth: 2, borderColor: 'transparent',
    alignItems: 'center', overflow: 'hidden',
  },
  rideCardSelected: {
    borderColor: 'transparent',
  },
  rideIcon: { fontSize: 30, marginBottom: 8 },
  rideName: {
    fontSize: 12, fontWeight: '700', color: '#E2E8F0', textAlign: 'center',
  },
  rideEta: {
    fontSize: 10, color: '#64748B', marginTop: 2,
  },
  ridePrice: {
    fontSize: 14, fontWeight: '800', color: '#FF9500', marginTop: 8,
  },
  confirmBtn: {
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 16,
  },
  confirmBtnText: {
    color: '#FFF', fontSize: 16, fontWeight: '800',
  },

  // Matchmaking
  matchmakingContainer: {
    alignItems: 'center', paddingVertical: 10,
  },
  spinEmoji: { fontSize: 52, marginBottom: 16 },
  matchTitle: {
    fontSize: 18, fontWeight: '800', color: '#FFF', marginBottom: 20,
  },
  stepsContainer: { width: '100%', marginBottom: 10 },
  stepText: {
    fontSize: 13, color: '#475569', marginBottom: 8, textAlign: 'center',
  },
  stepDone: { color: '#10B981' },
  stepActive: { color: '#FF9500', fontWeight: '700' },
});
