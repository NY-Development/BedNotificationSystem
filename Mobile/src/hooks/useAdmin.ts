import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/src/lib/apiClient';
import type { AdminStats, User, Assignment } from '@/src/types';

export function useAdminStats() {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await apiClient.get<AdminStats>('/admin/stats');
      return data;
    },
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const { data } = await apiClient.get<User[]>('/auth/all');
      return data;
    },
  });
}

export function useAllAssignments() {
  return useQuery({
    queryKey: ['allAssignments'],
    queryFn: async () => {
      const { data } = await apiClient.get<Assignment[]>('/admin/assignments');
      return data;
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/admin/users/${encodeURIComponent(id)}`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allUsers'] }),
  });
}

export function useActivateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.put(`/admin/${encodeURIComponent(userId)}/activate`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allUsers'] }),
  });
}

export function useDeactivateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.put(`/admin/${encodeURIComponent(userId)}/deactivate`);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allUsers'] }),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { userId: string; newRole: string }) => {
      const { data } = await apiClient.put('/admin/data', {
        type: 'role',
        userId: payload.userId,
        newRole: payload.newRole,
      });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allUsers'] }),
  });
}

export function useAddDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await apiClient.post('/supervisor/add-departments', { name });
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deptId: string) => {
      const { data } = await apiClient.delete(
        `/supervisor/departments/${encodeURIComponent(deptId)}`
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useAddWard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { deptId: string; name: string }) => {
      const { data } = await apiClient.post(
        `/supervisor/departments/${encodeURIComponent(payload.deptId)}/wards`,
        { name: payload.name }
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useAddBed() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { deptId: string; wardId: string; id: number }) => {
      const { data } = await apiClient.post(
        `/supervisor/departments/${encodeURIComponent(payload.deptId)}/wards/${encodeURIComponent(payload.wardId)}/beds`,
        { id: payload.id }
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  });
}
