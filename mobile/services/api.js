import axios from 'axios';
import { Platform } from 'react-native';

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
    'X-App-Version': '1.1.0',

  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (__DEV__) {
      console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with automatic retry on network timeout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Retry up to 2 times on network failures or 5xx server errors
    if (config && (!response || response.status >= 500)) {
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount < 2) {
        config.__retryCount += 1;
        const backoffDelay = config.__retryCount * 1000;
        
        if (__DEV__) {
          console.log(`⚠️ Network retry attempt #${config.__retryCount} after ${backoffDelay}ms...`);
        }

        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return api(config);
      }
    }

    const msg = error.response?.data?.error || error.message;
    if (__DEV__) {
      console.error(`✗ API Error [${error.response?.status || 'NETWORK'}]:`, msg);
    }
    return Promise.reject(error);
  }
);

export default api;
