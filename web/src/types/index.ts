export type Role = 'rider' | 'driver' | 'admin';

export type Language = 'EN' | 'AM';

export interface LocationItem {
  id: string;
  name: string;
  nameAm: string;
  subtext: string;
  subtextAm: string;
  category: 'hospital' | 'hotel' | 'university' | 'airport' | 'landmark' | 'market';
  distance: string;
  estTime: string;
  lat: number;
  lng: number;
}

export interface ServiceCategory {
  id: string;
  title: string;
  titleAm: string;
  subtext: string;
  subtextAm: string;
  icon: string;
  badge?: string;
  badgeAm?: string;
  priceRange: string;
  estTime: string;
  available: boolean;
}

export interface DriverStatus {
  id: string;
  name: string;
  plate: string;
  vehicleType: string;
  rating: number;
  tripsToday: number;
  earningsToday: number;
  isOnline: boolean;
  currentLocation: string;
  locationAm: string;
}

export interface TripReceipt {
  id: string;
  pickup: string;
  destination: string;
  pickupAm?: string;
  destinationAm?: string;
  serviceType: string;
  fareETB: number;
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'Cash';
  driverName: string;
  driverPlate: string;
  timestamp: string;
  status: 'Completed' | 'In Progress' | 'Cancelled';
}

export interface AdminMetrics {
  totalTripsToday: number;
  activeDrivers: number;
  totalEarningsETB: number;
  systemUptime: string;
  pendingDriverVerifications: number;
}
