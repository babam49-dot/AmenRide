import axios from 'axios';
import { Platform } from 'react-native';

// ── Base URL Configuration ────────────────────────────────────────────────────
// Android Emulator: 10.0.2.2 routes to host machine's localhost
// iOS Simulator / Web: localhost
// Physical device on WiFi: set to your machine's local IP (e.g. 192.168.1.X)
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'X-App-Name': 'AMEN-Ride',
    'X-App-Version': '1.0.0',
  },
});

// ── Request interceptor — log outgoing requests in dev ───────────────────────
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — normalize errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg = error.response?.data?.error || error.message;
    if (__DEV__) {
      console.error(`✗ API Error [${error.response?.status || 'NETWORK'}]:`, msg);
    }
    return Promise.reject(error);
  }
);

export default api;
