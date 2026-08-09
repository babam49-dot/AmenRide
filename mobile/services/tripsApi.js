import api from './api';

// Fallback data used when backend is unavailable
const FALLBACK_TRIPS = [
  { id: 1, pickup_name: 'Bahir Dar Airport', pickup_addr: 'Felege Hiwot, Bahir Dar', dropoff_name: 'Grand Resort Hotel', dropoff_addr: 'Kebele 03, Bahir Dar', fare: 210, status: 'completed', ride_icon: '🚗', ride_color: '#FF9500' },
  { id: 2, pickup_name: 'Bahir Dar University', pickup_addr: 'Kebele 11, Bahir Dar', dropoff_name: 'Lake Tana Hotel', dropoff_addr: 'Kebele 03, Bahir Dar', fare: 120, status: 'completed', ride_icon: '🚗', ride_color: '#FF9500' },
  { id: 3, pickup_name: 'Poly-Technic College', pickup_addr: 'Kebele 08, Bahir Dar', dropoff_name: 'Ghion Hotel', dropoff_addr: 'Kebele 05, Bahir Dar', fare: 45, status: 'completed', ride_icon: '🏍️', ride_color: '#06B6D4' },
];

const FALLBACK_DRIVER = {
  id: 1,
  name: 'Amanuel Bekele',
  email: 'amanuel.b@amenride.com',
  rating: 4.92,
  acceptance_rate: 96,
  cancellation_rate: 2,
  today_earnings: 1450,
  today_trips: 8,
  vehicle_type: 'Toyota Corolla',
  vehicle_plate: 'BD-1234-AA',
  is_online: false,
};

const FALLBACK_RIDE_OPTIONS = [
  { id: '1', name: 'AMEN Standard', icon: '🚗', eta_minutes: 3, base_price: 80,  description: 'Comfortable everyday ride',         color: '#FF9500' },
  { id: '2', name: 'AMEN Comfort',  icon: '🚙', eta_minutes: 5, base_price: 120, description: 'Premium spacious vehicle',             color: '#A855F7' },
  { id: '3', name: 'AMEN Boda',     icon: '🏍️', eta_minutes: 2, base_price: 45,  description: 'Fast motorcycle for short distances',  color: '#06B6D4' },
  { id: '4', name: 'AMEN Intercity',icon: '🚌', eta_minutes: 15,base_price: 350, description: 'Long-distance intercity transport',    color: '#10B981' },
];

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
