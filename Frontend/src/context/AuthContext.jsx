import { createContext, useContext, useEffect, useState } from 'react';
import {
  login as loginService,
  register as registerService,
  getProfile as getProfileService,
  verifyOtp,
  resendOtp,
  forgotPassword as forgotPasswordService,
  resetPassword as resetPasswordService,
} from "../services/auth";
import { getAssignmentExpiryForUser } from '../services/assignment';
import { initiatePayment } from '../services/payment';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState();
  const [firstTime, setFirstTime] = useState();

  // Assignment-related states now managed here
  const [deptExpiry, setDeptExpiry] = useState(null);
  const [wardExpiry, setWardExpiry] = useState(null);
  const [expiry, setExpiry] = useState(null);

  useEffect(() => {
    const loadUserAndAssignments = async () => {
      setLoading(true);
      if (token) {
        try {
          const profile = await getProfileService(token);
          setUser(profile);
          setUserEmail(profile.email);
          setFirstTime(profile.firstLoginDone);

          // Centralized assignment expiry fetch
          const data = await getAssignmentExpiryForUser(profile._id);
          setExpiry(data);

          if (data) {
            const formattedDeptExpiry = data.deptExpiry ? new Date(data.deptExpiry).toISOString().split('T')[0] : null;
            const formattedWardExpiry = data.wardExpiry ? new Date(data.wardExpiry).toLocaleDateString('en-CA') : null;

            setDeptExpiry(formattedDeptExpiry);
            setWardExpiry(formattedWardExpiry);
          }
        } catch (error) {
          console.error("Failed to fetch user profile or assignments:", error);
          setToken(null);
          sessionStorage.removeItem("token");
          setUser(null);
          // Reset assignment states on error
          setExpiry(null);
          setDeptExpiry(null);
          setWardExpiry(null);
        }
      }
      setLoading(false);
    };

    loadUserAndAssignments();
  }, [token]);

  const login = async (email, password) => {
    const { token, ...userData } = await loginService(email, password);
    setToken(token);
    sessionStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
    setUser(null);
    // Reset all states upon logout
    setExpiry(null);
    setDeptExpiry(null);
    setWardExpiry(null);
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
        window.location.href = res.checkout_url;
      }
    } catch (error) {
      console.error("Payment initiation error: ", error.message);
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
        // Expose assignment states
        expiry,
        deptExpiry,
        wardExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;