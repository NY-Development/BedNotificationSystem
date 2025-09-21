import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import {
  login as loginService,
  register as registerService,
  getProfile as getProfileService,
  verifyOtp,
  resendOtp,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from '../services/auth';
import { initiatePayment } from '../services/payment';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('token');
        if (storedToken) {
          setToken(storedToken);
          const profile = await getProfileService(storedToken);
          setUser(profile);
          setUserEmail(profile.email);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        await SecureStore.deleteItemAsync('token');
        setToken(null);
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const { token, ...userData } = await loginService(email, password);
    setToken(token);
    await SecureStore.setItemAsync('token', token);
    setUser(userData);
  };

  const logout = async () => {
    setToken(null);
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  const register = async (name, email, password, role, plan) => {
    const regData = await registerService(name, email, password, role, plan);
    setUserEmail(email);
    return regData;
  };

  const checkOtp = async (email, otp) => {
    await verifyOtp(email, otp);
  };

  const resendVerificationOtp = async (email) => {
    await resendOtp(email);
  };

  const forgotPassword = async (email) => {
    const res = await forgotPasswordService(email);
    setUserEmail(res.email);
    return res;
  };

  const resetPassword = async (email, otp, newPassword) => {
    await resetPasswordService(email, otp, newPassword);
  };

  const initiateUserPayment = async (email) => {
    const res = await initiatePayment(email);
    try {
      if (res.checkout_url) {
        // For mobile, you might want to open this in a WebView or external browser
        // For now, we'll just return the URL
        return res.checkout_url;
      }
    } catch (error) {
      console.error('Payment initiation error: ', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userEmail,
        token,
        loading,
        login,
        logout,
        register,
        checkOtp,
        resendVerificationOtp,
        forgotPassword,
        resetPassword,
        initiateUserPayment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);