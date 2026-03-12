import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/src/store/authStore';
import apiClient from '@/src/lib/apiClient';
import type { User, LoginPayload, RegisterPayload } from '@/src/types';

export function useProfile() {
  const { token, setUser } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiClient.get<User>('/auth/profile');
      setUser(data);
      return data;
    },
    enabled: !!token,
  });
}

export function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await apiClient.post('/auth/login', payload);
      return data;
    },
    onSuccess: (data) => {
      login(data, data.token);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await apiClient.post('/auth/register', payload);
      return data;
    },
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const { data } = await apiClient.post('/auth/verify-otp', payload);
      return data;
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await apiClient.post('/auth/resend-otp', { email });
      return data;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      return data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string; otp: string; newPassword: string }) => {
      const { data } = await apiClient.post('/auth/reset-password', payload);
      return data;
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
  };
}
