import apiClient from '@/src/lib/apiClient';
import type { LoginPayload, RegisterPayload } from '@/src/types';

export const authApi = {
  login: (payload: LoginPayload) => apiClient.post('/auth/login', payload),
  register: (payload: RegisterPayload) => apiClient.post('/auth/register', payload),
  verifyOtp: (payload: { email: string; otp: string }) =>
    apiClient.post('/auth/verify-otp', payload),
  resendOtp: (email: string) => apiClient.post('/auth/resend-otp', { email }),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (payload: { email: string; otp: string; newPassword: string }) =>
    apiClient.post('/auth/reset-password', payload),
  getProfile: () => apiClient.get('/auth/profile'),
  uploadImage: (formData: FormData) =>
    apiClient.post('/auth/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
