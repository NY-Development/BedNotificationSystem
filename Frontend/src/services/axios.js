import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = axios.create({
  // baseURL: 'https://bnst-ao5j.vercel.app/api',
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Flag to track unauthorized toast
let hasShownUnauthorizedToast = false;

// Attach token automatically
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
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
        toast.success("Please log in to continue.");
        hasShownUnauthorizedToast = true;
      }
      return Promise.reject(error);
    }

    // Reset flag for other errors (if needed)
    if (error.response && error.response.status !== 401) {
      hasShownUnauthorizedToast = false;
    }

    return Promise.reject(error); // Handle other errors normally
  }
);

export default API;