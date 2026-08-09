import axios from 'axios';
import { Platform } from 'react-native';

// Standard local backend development endpoints:
// - Android Emulator: 10.0.2.2 (redirects to host localhost)
// - iOS Simulator / Web: localhost
// Change this to your machine's local IP address (e.g. 192.168.1.X) if testing on physical devices.
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for easy error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;
