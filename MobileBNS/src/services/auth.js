import API from "./axios";

export const register = async (name, email, password, role, plan) => {
  try {
    const response = await API.post(`/auth/register`, {
      name,
      email,
      password,
      role,
      plan,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await API.post(`/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const resendOtp = async (email) => {
  try {
    const response = await API.post(`/auth/resend-otp`, { email });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const login = async (email, password) => {
  try {
    const response = await API.post(`/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getProfile = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await API.get(`/auth/profile`, config);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getAllUsers = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await API.get(`/auth/all`, config);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await API.post(`/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await API.post(`/auth/reset-password`, {
      email,
      otp,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
