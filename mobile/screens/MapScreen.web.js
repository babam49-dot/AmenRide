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
import RatingModal from '../components/RatingModal';

const { width, height } = Dimensions.get('window');
const API_BASE = 'http://localhost:5000/api';

const CUSTOMER_LAT = 11.5936;
const CUSTOMER_LNG = 37.3908;

const buildMapHTML = (apiBase, customerLat, customerLng) => `
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
  const CUSTOMER_LAT = ${customerLat};
  const CUSTOMER_LNG = ${customerLng};
  const map = L.map('map', { center: [CUSTOMER_LAT, CUSTOMER_LNG], zoom: 14 });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

  const pickup = [11.5980, 37.3820];
  const dropoff = [11.5936, 37.3950];

  L.marker(pickup, { icon: L.divIcon({ className: 'pin-a', html: 'A' }) }).addTo(map);
  L.marker(dropoff, { icon: L.divIcon({ className: 'pin-b', html: 'B' }) }).addTo(map);
  L.polyline([pickup, [11.5960, 37.3888], dropoff], { color: '#000000', weight: 4 }).addTo(map);
</script>
</body>
</html>
`;

export default function MapScreenWeb() {
  const [startLocation, setStartLocation] = useState('My location: Jan Moskov Library / ጃን ሞስኮቭ');
  const [destination, setDestination]     = useState('Abay mado market (Gebeya)');
  const [selectedRide, setSelectedRide]   = useState('1');
  const [isRequested, setIsRequested]     = useState(false);
  const [isMinimized, setIsMinimized]     = useState(false);
  const [rideOptions, setRideOptions]     = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    fetchRideOptions().then((data) => {
      setRideOptions(data);
      if (data && data.length > 0) setSelectedRide(data[0].id.toString());
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Leaflet Web Map */}
      <iframe
        title="Bahir Dar Interactive Map"
        srcDoc={buildMapHTML(API_BASE, CUSTOMER_LAT, CUSTOMER_LNG)}
        style={styles.iframeMap}
      />

      {/* Floating Top Location Inputs (Image 2) */}
      <View style={styles.topInputCard}>
        <View style={styles.inputRow}>
          <View style={styles.badgeA}>
            <Text style={styles.badgeText}>A</Text>
          </View>
          <TextInput
            style={styles.locationInput}
            value={startLocation}
            onChangeText={setStartLocation}
            placeholder="Search start location..."
          />
        </View>

        <View style={styles.inputDivider} />

        <View style={styles.inputRow}>
          <View style={styles.badgeB}>
            <Text style={styles.badgeText}>B</Text>
          </View>
          <TextInput
            style={styles.locationInput}
            value={destination}
            onChangeText={setDestination}
            placeholder="Search destination..."
          />
          <TouchableOpacity style={styles.plusBtn}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Floating ETA Badge */}
      <View style={styles.etaFloatingBadge}>
        <Text style={styles.etaText}>1 min</Text>
      </View>

      {/* Bottom Sheet Card (Minimizable / Expandable) */}
      <View style={[styles.bottomSheet, isMinimized && styles.bottomSheetMinimized]}>
        <TouchableOpacity
          style={styles.dragHandle}
          onPress={() => setIsMinimized(!isMinimized)}
        >
          <View style={styles.handleBar} />
          <Text style={styles.minimizeChevron}>{isMinimized ? '▲ Expand' : '▼ Minimize'}</Text>
        </TouchableOpacity>

        {isMinimized ? (
          /* Minimized Compact View (Image 3) */
          <View style={styles.minimizedContent}>
            <Text style={styles.rideProgressTitle}>Ride in Progress</Text>
            <Text style={styles.driverName}>Name: Abraham</Text>
            <Text style={styles.driverRating}>Rating: ⭐⭐⭐⭐⭐ 4.6</Text>

            <View style={styles.locSummaryRow}>
              <Text style={styles.locDotGreen}>🟢 From: </Text>
              <Text style={styles.locSummaryText}>{startLocation}</Text>
            </View>
            <View style={styles.locSummaryRow}>
              <Text style={styles.locDotRed}>🔴 To: </Text>
              <Text style={styles.locSummaryText}>{destination}</Text>
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
          /* Expanded Card View (Image 1 & Image 2) */
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.cardHeading}>Your driver is here</Text>
            <Text style={styles.cardSubheading}>The driver is waiting for you</Text>

            {/* Vehicle Card Badge */}
            <View style={styles.vehicleDetailsCard}>
              <Text style={styles.vehicleModelName}>Toyota Camry</Text>
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
                  style={[styles.rideCard, selectedRide === ride.id.toString() && styles.rideCardActive]}
                  onPress={() => setSelectedRide(ride.id.toString())}
                >
                  <Text style={styles.rideIcon}>{ride.icon || '🚗'}</Text>
                  <Text style={styles.rideName}>{ride.name}</Text>
                  <Text style={styles.ridePrice}>~{ride.base_price || 200.23} ETB</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.paymentBadgeRow}>
              <Text style={styles.paymentIcon}>💵</Text>
              <Text style={styles.paymentText}>Cash</Text>
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
    backgroundColor: '#000000',
  },
  iframeMap: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  topInputCard: {
    position: 'absolute',
    top: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
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
    color: '#0F172A',
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
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
    marginLeft: 34,
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: 460,
    zIndex: 100,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
  },
  bottomSheetMinimized: {
    maxHeight: 240,
    backgroundColor: '#F8FAFC',
  },
  dragHandle: {
    alignItems: 'center',
    paddingBottom: 10,
    cursor: 'pointer',
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 4,
  },
  minimizeChevron: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  minimizedContent: {
    paddingVertical: 4,
  },
  rideProgressTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
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
    color: '#475569',
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
    color: '#0F172A',
  },
  cardSubheading: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  vehicleDetailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  vehicleModelName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
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
    color: '#0F172A',
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
    color: '#334155',
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
