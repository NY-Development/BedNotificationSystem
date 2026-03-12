import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBedStore } from '@/src/store/bedStore';
import apiClient from '@/src/lib/apiClient';
import type { Department } from '@/src/types';

export function useDepartments() {
  const { setDepartments } = useBedStore();

  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await apiClient.get<Department[]>('/departments');
      setDepartments(data);
      return data;
    },
  });
}

export function useAdmitPatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { deptId: string; wardName: string; bedId: string }) => {
      const { data } = await apiClient.post('/departments/admit', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

export function useDischargePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { deptId: string; wardName: string; bedId: string }) => {
      const { data } = await apiClient.post('/departments/discharge', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}
