import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const API = axios.create({
  baseURL: 'https://bnst-ao5j.vercel.app/api',
  // baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Flag to track unauthorized toast
let hasShownUnauthorizedToast = false;

// Attach token automatically
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Use AsyncStorage to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
        // Show a toast notification for unauthorized access
        Toast.show({
          type: 'error',
          text1: "Please log in to continue.",
        });
        hasShownUnauthorizedToast = true;
      }
      return Promise.reject(error);
    }

    // Reset flag for other errors (if needed)
    if (error.response && error.response.status !== 401) {
      hasShownUnauthorizedToast = false;
    }

    // General error handling
    Toast.show({
      type: 'error',
      text1: error.response?.data?.message || "Something went wrong!",
    });

    return Promise.reject(error); // Handle other errors normally
  }
);

export default API;