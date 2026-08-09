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

const { width, height } = Dimensions.get('window');

const MATCHING_STEPS = [
  '🔍  Connecting to Uber AMEN Dispatcher...',
  '📡  Locating nearest driver on Kebele 03 road...',
  '🚗  Matching your ride...',
  '✅  Driver confirmed! En route to pickup.',
];

// Uber Dark Map Leaflet HTML
const UBER_MAP_HTML = `
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
      background: #000000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .leaflet-container { background: #000000 !important; }

    /* Uber Pickup Pin (Black Square inside White) */
    .pickup-pin {
      background: #FFFFFF;
      color: #000000;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 4px 16px rgba(255, 255, 255, 0.4);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Uber Dropoff Pin (Black Circle inside White) */
    .dropoff-pin {
      background: #000000;
      color: #FFFFFF;
      border: 2px solid #FFFFFF;
      border-radius: 20px;
      padding: 6px 12px;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Uber Driver Badges */
    .uber-car-badge {
      background: #FFFFFF;
      color: #000000;
      border-radius: 18px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 800;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      white-space: nowrap;
    }

    .leaflet-control-zoom { border: none !important; }
    .leaflet-control-zoom a {
      background: #181818 !important;
      color: #FFF !important;
      border: 1px solid #262626 !important;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', {
      center: [11.5950, 37.3880],
      zoom: 14,
      zoomControl: true
    });

    // Dark Tile Layer (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const customerPickup = [11.5980, 37.3820];
    const destinationDropoff = [11.5936, 37.3950];

    const routeCoordinates = [
      [11.5980, 37.3820],
      [11.5972, 37.3855],
      [11.5960, 37.3888],
      [11.5948, 37.3915],
      [11.5936, 37.3950]
    ];

    // Uber Signature White Route Polyline
    L.polyline(routeCoordinates, {
      color: '#FFFFFF',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round'
    }).addTo(map);

    // Pickup Square Pin
    L.marker(customerPickup, {
      icon: L.divIcon({
        className: 'custom-icon',
        html: '<div class="pickup-pin">■ Pickup: Felege Hiwot</div>',
        iconSize: [180, 32],
        iconAnchor: [90, 16]
      })
    }).addTo(map);

    // Dropoff Circle Pin
    L.marker(destinationDropoff, {
      icon: L.divIcon({
        className: 'custom-icon',
        html: '<div class="dropoff-pin">● Dropoff: Grand Resort Hotel</div>',
        iconSize: [210, 32],
        iconAnchor: [105, 16]
      })
    }).addTo(map);

    // Nearby Uber Drivers
    const drivers = [
      { coords: [11.5965, 37.3865], label: '🚗 UberX' },
      { coords: [11.5925, 37.3910], label: '🚙 Uber Comfort' },
      { coords: [11.5950, 37.3970], label: '🏍️ Uber Moto' }
    ];

    drivers.forEach(d => {
      L.marker(d.coords, {
        icon: L.divIcon({
          className: 'custom-icon',
          html: '<div class="uber-car-badge">' + d.label + '</div>',
          iconSize: [120, 28],
          iconAnchor: [60, 14]
        })
      }).addTo(map);
    });

    map.fitBounds(L.polyline(routeCoordinates).getBounds(), { padding: [50, 50] });
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
      {/* ── Uber Dark Leaflet Map ── */}
      <View style={styles.mapContainer}>
        <iframe
          title="Uber Map"
          srcDoc={UBER_MAP_HTML}
          style={styles.iframeMap}
          frameBorder="0"
        />
      </View>

      {/* ── Uber Address Route Bar ── */}
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

      {/* ── Uber Booking Bottom Sheet ── */}
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

            {/* Uber Full-Width White Action Button */}
            <TouchableOpacity
              style={styles.uberConfirmBtn}
              onPress={() => setIsRequested(true)}
              disabled={!activeRide}
              activeOpacity={0.9}
            >
              <Text style={styles.uberConfirmBtnText}>
                Choose {activeRide?.name || 'UberX'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.matchmakingContainer}>
            <View style={styles.sheetHandle} />
            <Animated.Text style={[styles.spinEmoji, { transform: [{ rotate: spin }] }]}>
              🔄
            </Animated.Text>
            <Text style={styles.matchTitle}>Requesting your ride...</Text>
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
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setIsRequested(false)}
              activeOpacity={0.9}
            >
              <Text style={styles.cancelBtnText}>Cancel Request</Text>
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
    backgroundColor: '#000000',
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

  // Address Bar
  addressBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#181818',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#262626',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupSquare: {
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  dropoffCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
  },
  addressDividerLine: {
    width: 1,
    height: 10,
    backgroundColor: '#333333',
    marginLeft: 3.5,
    marginVertical: 2,
  },
  addressText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },

  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 32,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: '#262626',
    maxHeight: height * 0.55,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333333',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: { color: '#A0A0A0', fontSize: 13 },
  optionsList: {
    maxHeight: 220,
    marginBottom: 16,
  },
  uberOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#181818',
  },
  uberOptionRowSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#262626',
  },
  uberOptionIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  uberOptionInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uberOptionName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uberOptionBadge: {
    fontSize: 11,
    color: '#A0A0A0',
    fontWeight: '600',
  },
  uberOptionSub: {
    fontSize: 11,
    color: '#A0A0A0',
    marginTop: 2,
  },
  uberOptionPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  uberConfirmBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uberConfirmBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
  },

  // Matchmaking
  matchmakingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  spinEmoji: { fontSize: 48, marginBottom: 14 },
  matchTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  stepsContainer: { width: '100%', marginBottom: 16 },
  stepText: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDone: { color: '#05A357' },
  stepActive: { color: '#FFFFFF', fontWeight: '800' },
  cancelBtn: {
    backgroundColor: '#262626',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FF3B30',
    fontWeight: '800',
    fontSize: 15,
  },
});
