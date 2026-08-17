import api from './api';

// ── Fallback data (used when backend is offline) ──────────────────────────────

const FALLBACK_TRIPS = [
  { id: 1, pickup_name: 'Bahir Dar Airport',      pickup_addr: 'Felege Hiwot, Bahir Dar',  dropoff_name: 'Grand Resort Hotel',   dropoff_addr: 'Kebele 03, Bahir Dar',  fare: 210, status: 'completed', ride_icon: '🚗' },
  { id: 2, pickup_name: 'Bahir Dar University',   pickup_addr: 'Kebele 11, Bahir Dar',     dropoff_name: 'Lake Tana Hotel',      dropoff_addr: 'Kebele 03, Bahir Dar',  fare: 120, status: 'completed', ride_icon: '🚗' },
  { id: 3, pickup_name: 'Poly-Technic College',   pickup_addr: 'Kebele 08, Bahir Dar',     dropoff_name: 'Ghion Hotel',          dropoff_addr: 'Kebele 05, Bahir Dar',  fare: 45,  status: 'completed', ride_icon: '🏍️' },
  { id: 4, pickup_name: 'Bahir Dar Bus Terminal', pickup_addr: 'Kebele 01, Bahir Dar',     dropoff_name: 'Bahir Dar University', dropoff_addr: 'Kebele 11, Bahir Dar',  fare: 85,  status: 'completed', ride_icon: '🚗' },
];

const FALLBACK_DRIVER = {
  id: 1, name: 'Amanuel Bekele', email: 'amanuel.b@amenride.com',
  phone: '+251911000001', rating: 4.92, acceptance_rate: 96,
  cancellation_rate: 2, today_earnings: 1450, today_trips: 8,
  vehicle_type: 'Toyota Corolla', vehicle_plate: 'BD-1234-AA',
  vehicle_color: 'White', is_online: false,
};

const FALLBACK_RIDE_OPTIONS = [
  { id: '1', name: 'AMEN Standard', icon: '🚗', eta_minutes: 3,  base_price: 80,  description: 'Comfortable everyday ride',          color: '#FF9500' },
  { id: '2', name: 'AMEN Comfort',  icon: '🚙', eta_minutes: 5,  base_price: 120, description: 'Premium spacious vehicle',             color: '#A855F7' },
  { id: '3', name: 'AMEN Boda',     icon: '🏍️', eta_minutes: 2,  base_price: 45,  description: 'Fast motorcycle for short distances',  color: '#06B6D4' },
  { id: '4', name: 'AMEN Intercity',icon: '🚌', eta_minutes: 15, base_price: 350, description: 'Long-distance intercity transport',    color: '#10B981' },
];

// Bahir Dar demo drivers shown when backend is offline
const FALLBACK_NEARBY_DRIVERS = [
  { id: 1, name: 'Amanuel Bekele',   phone: '+251911000001', rating: 4.92, vehicle_type: 'Toyota Corolla',  vehicle_plate: 'BD-1234-AA', vehicle_color: 'White',  lat: 11.6041, lng: 37.3724, distance_km: '1.40', eta_minutes: 3 },
  { id: 2, name: 'Tewodros Kassaye', phone: '+251911000002', rating: 4.88, vehicle_type: 'Hyundai Elantra', vehicle_plate: 'BD-5678-BB', vehicle_color: 'Silver', lat: 11.5880, lng: 37.3812, distance_km: '2.10', eta_minutes: 5 },
  { id: 3, name: 'Meron Tadesse',    phone: '+251911000003', rating: 4.95, vehicle_type: 'Toyota Vitz',     vehicle_plate: 'BD-9101-CC', vehicle_color: 'Blue',   lat: 11.5936, lng: 37.3950, distance_km: '3.30', eta_minutes: 8 },
];

// ── API Functions ─────────────────────────────────────────────────────────────

export async function fetchTrips(userId = 1) {
  try {
    const res = await api.get(`/api/trips?userId=${userId}`);
    return res.data.trips || FALLBACK_TRIPS;
  } catch {
    return FALLBACK_TRIPS;
  }
}

export async function fetchDriver(driverId = 1) {
  try {
    const res = await api.get(`/api/driver/${driverId}`);
    return res.data.driver || FALLBACK_DRIVER;
  } catch {
    return FALLBACK_DRIVER;
  }
}

export async function fetchRideOptions() {
  try {
    const res = await api.get('/api/ride-options');
    return res.data.rideOptions || FALLBACK_RIDE_OPTIONS;
  } catch {
    return FALLBACK_RIDE_OPTIONS;
  }
}

/**
 * fetchNearbyDrivers — returns online drivers sorted nearest-first
 * @param {number} lat    - customer latitude
 * @param {number} lng    - customer longitude
 * @param {number} radius - search radius in km (default 10)
 */
export async function fetchNearbyDrivers(lat = 11.5936, lng = 37.3908, radius = 10) {
  try {
    const res = await api.get(`/api/driver/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    return res.data.drivers || FALLBACK_NEARBY_DRIVERS;
  } catch {
    return FALLBACK_NEARBY_DRIVERS;
  }
}

export async function pingDriverHeartbeat(driverId = 1, lat = 11.5936, lng = 37.3908) {
  try {
    const res = await api.post('/api/driver/ping', { driverId, lat, lng, isOnline: true });
    return res.data;
  } catch {
    return { success: true, status: 'MOCK_PING_ACK' };
  }
}
