import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE = Platform.OS === 'web'
  ? 'http://localhost:5000/api'
  : 'http://10.0.2.2:5000/api'; // Android emulator uses 10.0.2.2

const GPS_UPDATE_INTERVAL_MS = 5000; // Send GPS every 5 seconds

/**
 * useDriverGPS — custom hook for live driver GPS broadcasting
 *
 * Usage in DriverScreen:
 *   const { location, error, isTracking } = useDriverGPS({ driverId: 1, isOnline });
 *
 * When isOnline = true  → requests GPS permission, then broadcasts lat/lng to backend every 5s
 * When isOnline = false → stops all GPS watching and broadcasting
 */
export default function useDriverGPS({ driverId, isOnline }) {
  const [location, setLocation]     = useState(null);
  const [error, setError]           = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const watchRef    = useRef(null); // expo-location watch subscription
  const intervalRef = useRef(null); // broadcast interval
  const latestLoc   = useRef(null); // latest GPS reading (for interval closure)

  useEffect(() => {
    if (isOnline) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => stopTracking();
  }, [isOnline]);

  async function startTracking() {
    try {
      // 1. Request GPS permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('📍 GPS permission denied. Please enable location for AMEN Driver.');
        return;
      }

      // 2. Start watching position in real-time
      watchRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10, // update if moved 10+ meters
          timeInterval: 4000,   // at most every 4 seconds
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          latestLoc.current = { lat: latitude, lng: longitude };
          setLocation({ lat: latitude, lng: longitude });
        }
      );

      setIsTracking(true);
      setError(null);

      // 3. Broadcast to backend every 5 seconds
      intervalRef.current = setInterval(async () => {
        if (!latestLoc.current) return;
        const { lat, lng } = latestLoc.current;

        try {
          await axios.post(`${API_BASE}/driver/${driverId}/location`, { lat, lng });
          console.log(`📡 GPS sent: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch (e) {
          // Silently fail — connection may be briefly lost
          console.warn('GPS broadcast failed:', e.message);
        }
      }, GPS_UPDATE_INTERVAL_MS);

    } catch (err) {
      setError('GPS error: ' + err.message);
      console.error('useDriverGPS startTracking error:', err);
    }
  }

  function stopTracking() {
    // Stop expo-location watch
    if (watchRef.current) {
      watchRef.current.remove();
      watchRef.current = null;
    }
    // Stop broadcast interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    latestLoc.current = null;
  }

  return { location, error, isTracking };
}
