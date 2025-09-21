import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

const API = axios.create({
  baseURL: 'https://bns-ao5j.vercel.app/api',
  timeout: 10000,
});

// Flag to track unauthorized toast
let hasShownUnauthorizedToast = false;

// Attach token automatically
API.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from secure store:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (!hasShownUnauthorizedToast) {
        Toast.show({
          type: 'info',
          text1: 'Authentication Required',
          text2: 'Please log in to continue.',
        });
        hasShownUnauthorizedToast = true;
      }
      return Promise.reject(error);
    }

    // Reset flag for other errors
    if (error.response && error.response.status !== 401) {
      hasShownUnauthorizedToast = false;
    }

    return Promise.reject(error);
  }
);

export default API;